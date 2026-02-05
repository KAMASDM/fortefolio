const { GoogleGenAI } = require('@google/genai');
const {
  ENTERPRISE_SAFETY_SETTINGS,
  formatMessages,
  createErrorResponse,
  createSuccessResponse,
  mapModelName,
  approximateTokenCount
} = require('./gemini-utils');

// Rate limiting disabled (no-op)

exports.handler = async (event, context) => {
  // Increase function timeout to 30 seconds
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // 1. Setup AbortController for network-level timeouts
  const controller = new AbortController();
  let timeoutId = null;

  try {
    const { messages, model = "gemini-1.5-flash", temperature = 0.7, maxTokens = 1500, userId } = JSON.parse(event.body);

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: 'Messages array is required and must not be empty.'
        })
      };
    }

    // Rate limiting disabled

    // Check environment
    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return createErrorResponse(500, 'Service configuration error.', 'CONFIG_ERROR');
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
      maxOutputTokens: 3000, // INCREASED from whatever was passed (often 1500)
      topP: 0.95,
      topK: 40,
      // Temporarily disable safety settings to debug 500 error
      // safetySettings: ENTERPRISE_SAFETY_SETTINGS,
      responseMimeType: 'text/plain',
    };
    
    let prompt = formatMessages(messages);
    
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

    return createSuccessResponse(text, {
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
    });

  } catch (error) {
    // Clean up timeout if it's still running
    if (timeoutId) clearTimeout(timeoutId);

    console.error('Gemini API Error:', {
      message: error.message,
      name: error.name,
      status: error.status,
      timestamp: new Date().toISOString()
    });
    
    let statusCode = 500;
    // Include the actual error message for debugging
    let errorMessage = `Failed to generate content: ${error.message}`;
    let errorCode = 'GEMINI_API_ERROR';

    // Handle AbortError specifically
    if (error.name === 'AbortError' || error.message === 'Request timeout') {
      statusCode = 408;
      errorMessage = 'Request took too long. Please try with a shorter prompt.';
      errorCode = 'TIMEOUT';
    } 
    else if (error.message?.includes('JSON')) {
      statusCode = 400;
      errorMessage = 'Invalid request format.';
      errorCode = 'INVALID_JSON';
    } 
    else if (error.status === 429 || error.message?.includes('429') || error.message?.includes('quota')) {
      statusCode = 503;
      errorMessage = 'AI service temporarily unavailable. Please try again later.';
      errorCode = 'UPSTREAM_RATE_LIMIT';
    } 
    else if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      statusCode = 400;
      errorMessage = 'Content was blocked due to safety filters.';
      errorCode = 'SAFETY_FILTER';
    }

    return createErrorResponse(statusCode, errorMessage, errorCode);
  }
};