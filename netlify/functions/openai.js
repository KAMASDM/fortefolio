const { GoogleGenAI } = require('@google/genai');
const {
  ENTERPRISE_SAFETY_SETTINGS,
  formatMessages,
  createErrorResponse,
  AI_UNAVAILABLE_MESSAGE,
  normalizeGeminiError,
  createSuccessResponse,
  mapModelName,
  approximateTokenCount,
  sanitizeInput
} = require('./gemini-utils');
const {
  authenticateRequest,
  enforceRateLimit,
  rateLimitHeaders,
  withCors,
} = require("./security");

exports.handler = async (event, context) => {
  const respond = (response, headers) => withCors(response, event, headers);
  // Increase function timeout to 30 seconds
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return respond({
      statusCode: 200,
      body: ''
    });
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return respond({
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    });
  }

  // 1. Setup AbortController for network-level timeouts
  const controller = new AbortController();
  let timeoutId = null;
  let rateLimit = null;

  try {
    const user = await authenticateRequest(event);
    const { messages, model = "gemini-1.5-flash", temperature = 0.7, maxTokens = 1500 } = JSON.parse(event.body);

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return respond({
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Messages array is required and must not be empty.'
        })
      });
    }

    const sanitizedMessages = messages
      .slice(0, 30)
      .map((message) => ({
        role: ["system", "user", "assistant"].includes(message?.role)
          ? message.role
          : "user",
        content: sanitizeInput(message?.content, 50000),
      }))
      .filter((message) => message.content);
    if (!sanitizedMessages.length) {
      return respond(createErrorResponse(400, "Message content is required.", "INVALID_MESSAGES"));
    }

    rateLimit = await enforceRateLimit({
      uid: user.uid,
      endpoint: "generate",
      limit: 50,
    });

    // Check environment
    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return respond(
        createErrorResponse(503, AI_UNAVAILABLE_MESSAGE, 'AI_SERVICE_UNAVAILABLE')
      );
    }

    // Determine timeout based on token count
    // Netlify standard functions have a 10s default timeout unless configured otherwise.
    // Even with configuration, 26s is often the hard limit on some plans/gateways.
    // We'll set a safer internal timeout to try to return a 408 before the platform 502s.
    const baseTimeout = 24000; // 24 seconds (under the typical 26s AWS Lambda gateway limit)
    
    // Start the timeout timer
    timeoutId = setTimeout(() => {
      controller.abort();
    }, baseTimeout);

    // Initialize Gemini client
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });

    const geminiModel = mapModelName(model);
    console.log(`Using model: ${geminiModel} (mapped from ${model})`);
    
    // 2. Fix: Nest config parameters properly for @google/genai SDK
    const modelConfig = {
      temperature: temperature,
      maxOutputTokens: Math.min(maxTokens || 2000, 8192), // Allow larger outputs for Flash model
      topP: 0.95,
      topK: 40,
      safetySettings: ENTERPRISE_SAFETY_SETTINGS,
      responseMimeType: 'text/plain',
    };
    
    let prompt = formatMessages(sanitizedMessages);
    
    // 3. Call API with config object and signal
    // Note: In @google/genai, generateContent accepts (options, requestOptions)
    // or ({ model, contents, config }, requestOptions)
    const result = await ai.models.generateContent({
      model: geminiModel,
      contents: prompt,
      config: modelConfig,
    }, {
      // Pass the signal to the fetch request to enable actual cancellation
      signal: controller.signal 
    });

    // Clear timeout immediately after success
    if (timeoutId) clearTimeout(timeoutId);

    // 4. Validate Response (New SDK uses getters)
    let text = null;
    try {
        text = result.text;
    } catch(e) {
        // .text() getter might throw if there are no text parts
        console.log("Could not get text via getter:", e.message);
    }

    // Fallback: Manually check candidates if getter fails
    if (!text && result.candidates && result.candidates.length > 0) {
        const candidate = result.candidates[0];
        
        // Check for MAX_TOKENS finish reason - the content might be there but truncated
        if (candidate.finishReason === 'MAX_TOKENS') {
            console.log("Response truncated due to MAX_TOKENS");
            // Try to extract text part even if truncated
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                text = candidate.content.parts.map(p => p.text).join('');
            }
        }
    }

    // Handle case where text is null (e.g. Safety Filter trigger)
    if (!text) {
       console.warn('Empty response text. Candidates:', JSON.stringify(result.candidates));
       
       // Check if it was blocked by safety settings
       const finishReason = result.candidates?.[0]?.finishReason;
       if (finishReason === 'SAFETY') {
         throw new Error('Content was blocked due to safety filters.');
       } else if (finishReason === 'MAX_TOKENS') {
           // If we're here, we hit MAX_TOKENS but couldn't extract text. 
           // This implies the max tokens limit was too low for ANY output?
           // OR the SDK is handling MAX_TOKENS differently.
           console.log("Hit MAX_TOKENS but extracted no text?");
       }
       throw new Error('AI returned an empty response.');
    }

    return respond(createSuccessResponse(text, {
      headers: {
        'X-Model-Used': geminiModel,
        'X-Generation-Time': Date.now().toString()
      },
      usage: {
        prompt_tokens: approximateTokenCount(prompt),
        completion_tokens: approximateTokenCount(text),
        total_tokens: approximateTokenCount(prompt + text)
      },
      model: geminiModel,
    }), rateLimitHeaders(rateLimit));

  } catch (error) {
    // Clean up timeout if it's still running
    if (timeoutId) clearTimeout(timeoutId);

    if (!["AUTH_REQUIRED", "RATE_LIMITED"].includes(error.code)) {
      console.error('Gemini API Error:', {
        message: error.message,
        name: error.name,
        status: error.status,
        timestamp: new Date().toISOString()
      });
    }
    
    let statusCode;
    let errorMessage;
    let errorCode;

    // Handle AbortError specifically
    if (error.code === "AUTH_REQUIRED") {
      statusCode = 401;
      errorMessage = "Authentication required.";
      errorCode = "AUTH_REQUIRED";
    }
    else if (error.code === "RATE_LIMITED") {
      statusCode = 429;
      errorMessage = "You've made several AI requests in a short time. Please wait a moment and try again.";
      errorCode = "RATE_LIMITED";
    }
    else if (error.message?.includes('JSON')) {
      statusCode = 400;
      errorMessage = "We couldn't understand that request. Please refresh the page and try again.";
      errorCode = 'INVALID_JSON';
    }
    else {
      const normalized = normalizeGeminiError(error);
      statusCode = normalized.statusCode;
      errorMessage = normalized.message;
      errorCode = normalized.code;
    }

    return respond(
      createErrorResponse(statusCode, errorMessage, errorCode),
      {
        ...rateLimitHeaders(rateLimit),
        ...(error.retryAfter
          ? { "Retry-After": String(error.retryAfter) }
          : {}),
      }
    );
  }
};
