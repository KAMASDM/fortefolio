import { auth } from "../firebaseConfig";

/**
 * Get the correct base URL for API calls
 * In development (localhost), always use Netlify dev server on port 8888
 * In production, use relative URLs
 */
const getApiBaseUrl = () => {
  // In development, always use Netlify dev server
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8888';
  }
  // In production, use relative URLs
  return '';
};

/**
 * Call Gemini API securely through Netlify Functions
 * @param {Array} messages - Array of message objects with role and content
 * @param {Object} options - Optional parameters (model, temperature, maxTokens)
 * @returns {Promise<string>} - The generated content
 */
export const callOpenAI = async (messages, options = {}) => {
  const {
    model = "gemini-1.5-flash",
    temperature = 0.7,
    maxTokens = 1500,
  } = options;

  try {
    // Get current user ID for rate limiting
    const userId = auth.currentUser?.uid || null;
    
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/.netlify/functions/openai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        maxTokens,
        userId,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      if (response.status === 408) {
        throw new Error("Request timeout. Please try with a shorter prompt or try again.");
      }
      throw new Error("Invalid response from server. Please try again.");
    }

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      } else if (response.status === 408) {
        throw new Error("Request timeout. Please try with a shorter prompt or try again.");
      } else if (response.status === 503) {
        throw new Error("AI service temporarily unavailable. Please try again later.");
      }
      throw new Error(result.error || "Failed to generate content");
    }

    if (result.success) {
      return result.content;
    } else {
      throw new Error(result.error || "Failed to generate content");
    }
  } catch (error) {
    console.error("Netlify Function Error:", error);
    
    // Provide user-friendly error messages
    if (error.message.includes("Rate limit")) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      throw new Error("Request took too long. Please try with a shorter prompt or try again.");
    } else if (error.message.includes("fetch") || error.name === 'TypeError') {
      throw new Error("Network error. Please check your connection and try again.");
    } else if (error.message.includes("JSON")) {
      throw new Error("Invalid response format. Please try again.");
    } else {
      throw new Error(error.message || "Failed to generate content. Please try again.");
    }
  }
};

/**
 * Get quick AI suggestions for form fields
 * @param {string} prompt - The prompt to send to AI
 * @param {number} maxTokens - Maximum tokens for response (default: 60)
 * @returns {Promise<string>} - The AI suggestion
 */
export const getAISuggestion = async (prompt, maxTokens = 60) => {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/.netlify/functions/ai-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        maxTokens,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to generate suggestion");
    }

    if (result.success) {
      return result.content;
    } else {
      throw new Error("Failed to generate suggestion");
    }
  } catch (error) {
    console.error("Netlify Function Error:", error);
    throw new Error(error.message || "Failed to generate suggestion. Please try again.");
  }
};

/**
 * Check rate limit status for current user
 * Note: Rate limiting is now handled internally by the main OpenAI function
 * @returns {Promise<Object>} - Rate limit information
 */
export const checkRateLimit = async () => {
  // Rate limiting is now handled internally by the OpenAI function
  // Return permissive default since Netlify functions handle this internally
  return { allowed: true, remaining: 50 };
};
