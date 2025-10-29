const OpenAI = require('openai');

// Simple in-memory rate limiting (you might want to use a database for production)
const rateLimits = new Map();

const cleanupRateLimit = () => {
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  
  rateLimits.forEach((calls, userId) => {
    const filteredCalls = calls.filter(timestamp => timestamp > hourAgo);
    if (filteredCalls.length === 0) {
      rateLimits.delete(userId);
    } else {
      rateLimits.set(userId, filteredCalls);
    }
  });
};

const checkRateLimit = (userId) => {
  cleanupRateLimit();
  
  const now = Date.now();
  const hourAgo = now - (60 * 60 * 1000);
  const MAX_CALLS_PER_HOUR = 50;
  
  const userCalls = rateLimits.get(userId) || [];
  const recentCalls = userCalls.filter(timestamp => timestamp > hourAgo);
  
  if (recentCalls.length >= MAX_CALLS_PER_HOUR) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: recentCalls[0] + (60 * 60 * 1000)
    };
  }
  
  recentCalls.push(now);
  rateLimits.set(userId, recentCalls);
  
  return {
    allowed: true,
    remaining: MAX_CALLS_PER_HOUR - recentCalls.length,
    resetTime: recentCalls[0] + (60 * 60 * 1000)
  };
};

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
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { messages, model = "gpt-3.5-turbo", temperature = 0.7, maxTokens = 1500, userId } = JSON.parse(event.body);

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

    // Check rate limit if userId is provided
    if (userId) {
      const rateLimitResult = checkRateLimit(userId);
      if (!rateLimitResult.allowed) {
        return {
          statusCode: 429,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            success: false,
            error: 'Rate limit exceeded. Please try again later.',
            resetTime: rateLimitResult.resetTime
          })
        };
      }
    }

    // Determine timeout based on max_tokens (longer content needs more time)
    const baseTimeout = maxTokens > 1000 ? 45000 : maxTokens > 500 ? 35000 : 25000;
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: baseTimeout,
    });

    // Create a timeout promise to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), baseTimeout);
    });

    // Optimize model selection for faster responses
    const optimizedModel = model === "gpt-3.5-turbo" && maxTokens > 1000 ? "gpt-3.5-turbo" : model;
    
    // Call OpenAI API with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: optimizedModel,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        // Add parameters for faster response
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
      timeoutPromise
    ]);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        content: completion.choices[0].message.content,
        usage: completion.usage,
      })
    };

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to generate content. Please try again.';

    // Handle different error types
    if (error.message === 'Request timeout') {
      statusCode = 408;
      errorMessage = 'Request took too long. Please try with a shorter prompt or try again.';
    } else if (error.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded. Please try again later.';
    } else if (error.status === 401) {
      statusCode = 500; // Don't expose auth errors to client
      errorMessage = 'Service temporarily unavailable. Please contact support.';
    } else if (error.status === 400) {
      statusCode = 400;
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      statusCode = 503;
      errorMessage = 'Unable to connect to AI service. Please try again later.';
    } else if (error.message && error.message.includes('JSON')) {
      statusCode = 422;
      errorMessage = 'Invalid response format. Please try again.';
    }

    return {
      statusCode: statusCode,
      headers: { 
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: errorMessage
      })
    };
  }
};