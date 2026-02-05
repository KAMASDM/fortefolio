
const { GoogleGenAI } = require('@google/genai');

exports.handler = async (event, context) => {
  const keyStatus = process.env.GEMINI_API_KEY ? "Present" : "Missing";
  const keyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0;
  
  let generationResult = "Not attempted";
  let generationError = null;

  if (process.env.GEMINI_API_KEY) {
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          // Try the exact model we are using in production
          const result = await ai.models.generateContent({
              model: 'gemini-flash-latest',
              contents: 'Hello, confirm you are working.',
          });
          generationResult = result.text || "No text returned but success";
      } catch (e) {
          generationResult = "Failed";
          generationError = {
              name: e.name,
              message: e.message,
              stack: e.stack ? e.stack.split('\n').slice(0,3) : [] // Simplify stack
          };
      }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "OK",
      env: {
        GEMINI_API_KEY: keyStatus,
        KEY_LENGTH: keyLength
      },
      generation: {
          result: generationResult,
          error: generationError
      }
    })
  };
};
