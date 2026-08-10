const { GoogleGenAI } = require('@google/genai');
const {
  ENTERPRISE_SAFETY_SETTINGS,
  getGenerationConfig,
  createSuccessResponse,
  createErrorResponse,
  AI_UNAVAILABLE_MESSAGE,
  normalizeGeminiError,
  mapModelName,
  sanitizeInput,
} = require('./gemini-utils');
const {
  authenticateRequest,
  enforceRateLimit,
  rateLimitHeaders,
  withCors,
} = require("./security");

exports.handler = async (event, _context) => {
  const respond = (response, headers) => withCors(response, event, headers);
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

  let rateLimit = null;
  try {
    const user = await authenticateRequest(event);
    const { prompt, maxTokens = 60 } = JSON.parse(event.body);

    if (!prompt) {
      return respond({
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: 'Prompt is required.'
        })
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return respond(
        createErrorResponse(503, AI_UNAVAILABLE_MESSAGE, "AI_SERVICE_UNAVAILABLE")
      );
    }

    rateLimit = await enforceRateLimit({
      uid: user.uid,
      endpoint: "suggestion",
      limit: 100,
    });

    // Initialize Gemini client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 15000);
    });

    // Configure generation for quick, focused suggestions using utility
    const generationConfig = getGenerationConfig('quick', maxTokens);

    const result = await Promise.race([
      ai.models.generateContent({
        model: mapModelName("gemini-1.5-flash"),
        contents: sanitizeInput(prompt, 10000),
        config: {
          ...generationConfig,
          safetySettings: ENTERPRISE_SAFETY_SETTINGS,
          responseMimeType: "text/plain",
        },
      }),
      timeoutPromise
    ]);

    const text = result.text;

    return respond(
      createSuccessResponse(text.trim()),
      rateLimitHeaders(rateLimit)
    );

  } catch (error) {
    if (!["AUTH_REQUIRED", "RATE_LIMITED"].includes(error.code)) {
      console.error('Gemini suggestion error:', error);
    }
    
    let statusCode;
    let errorMessage;
    let errorCode;

    if (error.code === "AUTH_REQUIRED") {
      statusCode = 401;
      errorMessage = "Authentication required.";
      errorCode = "AUTH_REQUIRED";
    } else if (error.code === "RATE_LIMITED") {
      statusCode = 429;
      errorMessage = "You've made several AI requests in a short time. Please wait a moment and try again.";
      errorCode = "RATE_LIMITED";
    } else {
      const normalized = normalizeGeminiError(
        error,
        "We couldn't improve that text right now. Your work is safe—please try again."
      );
      statusCode = normalized.statusCode;
      errorMessage = normalized.message;
      errorCode = normalized.code;
    }
    
    return respond(
      createErrorResponse(
        statusCode,
        errorMessage,
        errorCode
      ),
      {
        ...rateLimitHeaders(rateLimit),
        ...(error.retryAfter
          ? { "Retry-After": String(error.retryAfter) }
          : {}),
      }
    );
  }
};
