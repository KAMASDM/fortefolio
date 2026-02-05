
exports.handler = async (event, context) => {
  const keyStatus = process.env.GEMINI_API_KEY ? "Present" : "Missing";
  const keyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0;
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: "OK",
      env: {
        GEMINI_API_KEY: keyStatus,
        KEY_LENGTH: keyLength
      },
      message: keyStatus === "Present" 
        ? "Environment variable is correctly detected." 
        : "Critical: GEMINI_API_KEY is missing from Netlify environment variables."
    })
  };
};
