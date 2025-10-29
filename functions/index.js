const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
});

/**
 * Callable Firebase Function to interact with OpenAI API securely
 * This keeps the API key on the server side and prevents exposure
 */
exports.callOpenAI = onCall(async (request) => {
  const {data, auth} = request;
  // Verify user is authenticated
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function."
    );
  }

  const {messages, model = "gpt-3.5-turbo", temperature = 0.7, maxTokens = 1500} = data;

  // Validate input
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    throw new HttpsError(
      "invalid-argument",
      "Messages array is required and must not be empty."
    );
  }

  try {
    // Initialize OpenAI client with environment variable
    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    // Return the response
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage,
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    
    // Handle different error types
    if (error.status === 429) {
      throw new HttpsError(
        "resource-exhausted",
        "Rate limit exceeded. Please try again later."
      );
    } else if (error.status === 401) {
      throw new HttpsError(
        "internal",
        "API authentication failed. Please contact support."
      );
    } else {
      throw new HttpsError(
        "internal",
        `Failed to generate content: ${error.message}`
      );
    }
  }
});

/**
 * Optimized function for quick AI suggestions (used in forms)
 */
exports.getAISuggestion = onCall(async (request) => {
  const {data, auth} = request;

  // Verify user is authenticated
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated to use this function."
    );
  }

  const {prompt, maxTokens = 60} = data;

  if (!prompt) {
    throw new HttpsError(
      "invalid-argument",
      "Prompt is required."
    );
  }

  try {
    // Initialize OpenAI client
    const OpenAI = require("openai");
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens,
    });

    return {
      success: true,
      content: completion.choices[0].message.content.trim(),
    };
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new HttpsError(
      "internal",
      `Failed to generate suggestion: ${error.message}`
    );
  }
});

/**
 * Rate limiting helper to prevent abuse
 * This tracks API calls per user
 */
exports.checkRateLimit = onCall(async (request) => {
  const {auth} = request;

  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "User must be authenticated."
    );
  }

  const userId = auth.uid;
  const rateLimitRef = admin.database().ref(`rateLimits/${userId}`);
  
  try {
    const snapshot = await rateLimitRef.once("value");
    const now = Date.now();
    const hourAgo = now - (60 * 60 * 1000);
    
    let calls = snapshot.val() || [];
    // Filter calls from last hour
    calls = calls.filter(timestamp => timestamp > hourAgo);
    
    const MAX_CALLS_PER_HOUR = 50; // Adjust as needed
    
    if (calls.length >= MAX_CALLS_PER_HOUR) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: calls[0] + (60 * 60 * 1000)
      };
    }
    
    // Add current call
    calls.push(now);
    await rateLimitRef.set(calls);
    
    return {
      allowed: true,
      remaining: MAX_CALLS_PER_HOUR - calls.length,
      resetTime: calls[0] + (60 * 60 * 1000)
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // Allow on error to not block users
    return { allowed: true, remaining: 50 };
  }
});
