import { auth } from "../firebaseConfig";

const DEFAULT_AI_ERROR =
  "We couldn't complete that AI request right now. Your work is safe—please try again.";

const getFriendlyAIError = (response, result = {}) => {
  if (result.error) return result.error;
  if (response.status === 401) return "Please sign in again to use the AI writing tools.";
  if (response.status === 408) return "This is taking longer than expected. Please try again in a moment.";
  if (response.status === 429) return "You've made several AI requests in a short time. Please wait a moment and try again.";
  if (response.status >= 500) return "Our AI writing assistant is unavailable right now. Your work is safe—please try again in a little while.";
  return DEFAULT_AI_ERROR;
};

/**
 * Get the correct base URL for API calls
 * In development (localhost), always use Netlify dev server on port 8888
 * In production, use relative URLs
 */
const getApiBaseUrl = () => "";

const getAuthenticatedHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in to use AI features.");
  }
  const idToken = await user.getIdToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${idToken}`,
  };
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
    task,
  } = options;

  try {
    const baseUrl = getApiBaseUrl();
    const headers = await getAuthenticatedHeaders();
    const response = await fetch(`${baseUrl}/.netlify/functions/openai`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages,
        model,
        temperature,
        maxTokens,
        task,
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
      throw new Error(getFriendlyAIError(response, result));
    }

    if (result.success) {
      return result.content;
    } else {
      throw new Error(result.error || DEFAULT_AI_ERROR);
    }
  } catch (error) {
    console.error("Netlify Function Error:", error);
    
    // Provide user-friendly error messages
    if (error.message.includes("Rate limit")) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      throw new Error("This is taking longer than expected. Please try again in a moment.");
    } else if (error.message.includes("fetch") || error.name === 'TypeError') {
      throw new Error("Network error. Please check your connection and try again.");
    } else if (error.message.includes("JSON")) {
      throw new Error(DEFAULT_AI_ERROR);
    } else {
      throw new Error(error.message || DEFAULT_AI_ERROR);
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
    const headers = await getAuthenticatedHeaders();
    const response = await fetch(`${baseUrl}/.netlify/functions/ai-suggestion`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        prompt,
        maxTokens,
      }),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error(DEFAULT_AI_ERROR);
    }

    if (!response.ok) {
      throw new Error(getFriendlyAIError(response, result));
    }

    if (result.success) {
      return result.content;
    } else {
      throw new Error(DEFAULT_AI_ERROR);
    }
  } catch (error) {
    console.error("Netlify Function Error:", error);
    throw new Error(error.message || DEFAULT_AI_ERROR);
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

export const runResumeTask = async (task, content) => {
  const result = await callOpenAI([{ role: "user", content }], { task, temperature: 0.2, maxTokens: task === "import" ? 6000 : 1000 });
  try { return JSON.parse(result); } catch { throw new Error("The writing assistant returned an incomplete result. Please try again with less text."); }
};
