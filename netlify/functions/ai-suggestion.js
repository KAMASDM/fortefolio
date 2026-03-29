const { GoogleGenAI } = require('@google/genai');
const {
  ENTERPRISE_SAFETY_SETTINGS,
  getGenerationConfig,
  createSuccessResponse,
  createErrorResponse
} = require('./gemini-utils');

exports.handler = async (event, context) => {
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
    const { prompt, maxTokens = 60 } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: 'Prompt is required.'
        })
      };
    }

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
        model: "gemini-3-pro-preview",
        contents: prompt,
        generationConfig: generationConfig,
        safetySettings: ENTERPRISE_SAFETY_SETTINGS,
      }),
      timeoutPromise
    ]);

    const text = result.text;

    return createSuccessResponse(text.trim());

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Failed to generate suggestion. Please try again.';

    if (error.message === 'Request timeout') {
      statusCode = 408;
      errorMessage = 'Request took too long. Please try again.';
    } else if (error.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }
    
    return createErrorResponse(statusCode, errorMessage, error.code || 'AI_SUGGESTION_ERROR');
  }
};