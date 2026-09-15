/**
 * Gemini API Utility Functions
 * 
 * This module provides helper functions for enterprise-level features
 * of the Gemini API including structured outputs, function calling,
 * and advanced configurations.
 */

/**
 * Standard safety settings for enterprise use
 * Blocks medium and above levels for all harmful content categories
 */
const ENTERPRISE_SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];

/**
 * Generation configurations for different use cases
 */
const GENERATION_CONFIGS = {
  // For creative content (cover letters, SOPs)
  creative: {
    temperature: 0.8,
    topP: 0.95,
    topK: 40,
  },
  
  // For balanced output (resume enhancement, suggestions)
  balanced: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
  },
  
  // For factual/structured content (analysis, scoring)
  factual: {
    temperature: 0.3,
    topP: 0.8,
    topK: 20,
  },
  
  // For quick suggestions (bullet points)
  quick: {
    temperature: 0.7,
    topP: 0.9,
    topK: 20,
  }
};

/**
 * JSON schemas for structured outputs
 */
const SCHEMAS = {
  // Resume analysis with scoring
  resumeAnalysis: {
    type: "object",
    properties: {
      overall_score: {
        type: "integer",
        description: "Overall resume score from 0-100",
        minimum: 0,
        maximum: 100
      },
      ats_compatibility: {
        type: "integer",
        description: "ATS compatibility score from 0-100",
        minimum: 0,
        maximum: 100
      },
      sections: {
        type: "array",
        description: "Analysis of each resume section",
        items: {
          type: "object",
          properties: {
            section_name: { type: "string" },
            score: { type: "integer", minimum: 0, maximum: 100 },
            suggestions: {
              type: "array",
              items: { type: "string" }
            }
          },
          required: ["section_name", "score", "suggestions"]
        }
      },
      strengths: {
        type: "array",
        description: "Key strengths identified",
        items: { type: "string" }
      },
      improvements: {
        type: "array",
        description: "Areas for improvement",
        items: { type: "string" }
      },
      keywords_missing: {
        type: "array",
        description: "Important keywords that are missing",
        items: { type: "string" }
      }
    },
    required: ["overall_score", "ats_compatibility", "sections", "strengths", "improvements"]
  },

  // Interview questions with categories
  interviewQuestions: {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            category: {
              type: "string",
              enum: ["technical", "behavioral", "situational", "cultural_fit"]
            },
            difficulty: {
              type: "string",
              enum: ["easy", "medium", "hard"]
            },
            tips: { type: "string" }
          },
          required: ["question", "category", "difficulty"]
        }
      }
    },
    required: ["questions"]
  },

  // Job match analysis
  jobMatchAnalysis: {
    type: "object",
    properties: {
      match_score: {
        type: "integer",
        minimum: 0,
        maximum: 100
      },
      matching_skills: {
        type: "array",
        items: { type: "string" }
      },
      missing_skills: {
        type: "array",
        items: { type: "string" }
      },
      experience_match: {
        type: "string",
        enum: ["under_qualified", "qualified", "over_qualified"]
      },
      recommendations: {
        type: "array",
        items: { type: "string" }
      }
    },
    required: ["match_score", "matching_skills", "missing_skills", "experience_match"]
  }
};

/**
 * Function declarations for function calling
 */
const FUNCTION_DECLARATIONS = {
  // Search for jobs (to be connected to real API)
  searchJobs: {
    name: "search_jobs",
    description: "Search for job opportunities matching the user's profile and preferences",
    parameters: {
      type: "object",
      properties: {
        keywords: {
          type: "array",
          items: { type: "string" },
          description: "Job title or skill keywords to search for"
        },
        location: {
          type: "string",
          description: "Job location (city, state, or 'remote')"
        },
        experience_level: {
          type: "string",
          enum: ["entry", "mid", "senior", "lead"],
          description: "Required experience level"
        },
        job_type: {
          type: "string",
          enum: ["full_time", "part_time", "contract", "internship"],
          description: "Type of employment"
        }
      },
      required: ["keywords"]
    }
  },

  // Calculate ATS score
  calculateATSScore: {
    name: "calculate_ats_score",
    description: "Calculate how well a resume matches ATS (Applicant Tracking System) requirements",
    parameters: {
      type: "object",
      properties: {
        resume_text: {
          type: "string",
          description: "The complete resume text"
        },
        job_description: {
          type: "string",
          description: "The job description to match against"
        }
      },
      required: ["resume_text", "job_description"]
    }
  },

  // Get salary information
  getSalaryInfo: {
    name: "get_salary_info",
    description: "Get salary range information for a specific job title and location",
    parameters: {
      type: "object",
      properties: {
        job_title: {
          type: "string",
          description: "The job title to research"
        },
        location: {
          type: "string",
          description: "Location (city, state)"
        },
        experience_years: {
          type: "integer",
          description: "Years of experience",
          minimum: 0
        }
      },
      required: ["job_title", "location"]
    }
  }
};

/**
 * Helper function to create a generation config
 * @param {string} type - Type of config: 'creative', 'balanced', 'factual', 'quick'
 * @param {number} maxTokens - Maximum output tokens
 * @returns {object} Generation configuration
 */
function getGenerationConfig(type = 'balanced', maxTokens = 2048) {
  return {
    ...GENERATION_CONFIGS[type],
    maxOutputTokens: maxTokens
  };
}

/**
 * Helper function to format messages for Gemini API
 * @param {Array} messages - Array of message objects with role and content
 * @returns {string} Formatted prompt string
 */
function formatMessages(messages) {
  let prompt = '';
  messages.forEach(msg => {
    if (msg.role === 'system') {
      prompt += `System: ${msg.content}\n\n`;
    } else if (msg.role === 'user') {
      prompt += `User: ${msg.content}\n\n`;
    } else if (msg.role === 'assistant') {
      prompt += `Assistant: ${msg.content}\n\n`;
    }
  });
  return prompt.trim();
}

/**
 * Parse structured JSON response safely
 * @param {string} text - Response text
 * @returns {object|null} Parsed JSON or null if invalid
 */
function parseStructuredResponse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse structured response:', error);
    return null;
  }
}

/**
 * Calculate approximate token count
 * @param {string} text - Text to count tokens for
 * @returns {number} Approximate token count
 */
function approximateTokenCount(text) {
  // Rough approximation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

/**
 * Create error response
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @returns {object} Formatted error response
 */
function createErrorResponse(statusCode, message, code = 'UNKNOWN_ERROR') {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: false,
      error: message,
      errorCode: code
    })
  };
}

const AI_UNAVAILABLE_MESSAGE =
  "Our AI writing assistant is unavailable right now. Your work is safe—please try again in a little while.";

/**
 * Convert Gemini SDK failures into safe, human-friendly API responses.
 * Provider details stay in server logs and are never shown to users.
 *
 * @param {object} error - Error thrown by the Gemini SDK
 * @param {string} fallbackMessage - Feature-specific fallback message
 * @returns {{statusCode: number, message: string, code: string}}
 */
function normalizeGeminiError(
  error,
  fallbackMessage = "We couldn't complete that AI request right now. Your work is safe—please try again."
) {
  const status = Number(error?.statusCode || error?.status) || 500;
  const details = `${error?.message || ''} ${error?.code || ''}`.toLowerCase();

  if (error?.name === 'AbortError' || details.includes('request timeout')) {
    return {
      statusCode: 408,
      message: "This is taking longer than expected. Please try again in a moment.",
      code: 'TIMEOUT',
    };
  }

  if (
    status === 429 ||
    details.includes('quota') ||
    details.includes('resource_exhausted')
  ) {
    return {
      statusCode: 503,
      message: "Our AI writing assistant is busy right now. Please wait a moment and try again.",
      code: 'AI_BUSY',
    };
  }

  if (
    status === 401 ||
    status === 403 ||
    details.includes('api key') ||
    details.includes('api_key') ||
    details.includes('permission denied') ||
    details.includes('permission_denied') ||
    details.includes('unauthenticated') ||
    details.includes('forbidden')
  ) {
    return {
      statusCode: 503,
      message: AI_UNAVAILABLE_MESSAGE,
      code: 'AI_SERVICE_UNAVAILABLE',
    };
  }

  if (details.includes('safety') || details.includes('blocked')) {
    return {
      statusCode: 400,
      message: "We couldn't create that content as written. Try rephrasing your request and we'll try again.",
      code: 'SAFETY_FILTER',
    };
  }

  return {
    statusCode: status >= 400 && status < 500 ? status : 500,
    message: fallbackMessage,
    code: 'AI_REQUEST_FAILED',
  };
}

/**
 * Create success response
 * @param {string} content - Response content
 * @param {object} metadata - Additional metadata
 * @returns {object} Formatted success response
 */
function createSuccessResponse(content, metadata = {}) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      ...metadata.headers
    },
    body: JSON.stringify({
      success: true,
      content,
      ...metadata
    })
  };
}

/**
 * Map model names to Gemini models
 * @param {string} model - Input model name
 * @returns {string} Gemini model name
 */
function mapModelName(_model) {
  // Deployment controls provider/model selection; legacy client names stay compatible.
  return process.env.GEMINI_MODEL || "gemini-flash-latest";
}

/**
 * Validate and sanitize input
 * @param {string} input - User input to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized input
 */
function sanitizeInput(input, maxLength = 50000) {
  if (typeof input !== 'string') {
    return '';
  }
  // Trim and limit length
  return input.trim().substring(0, maxLength);
}

module.exports = {
  ENTERPRISE_SAFETY_SETTINGS,
  GENERATION_CONFIGS,
  SCHEMAS,
  FUNCTION_DECLARATIONS,
  getGenerationConfig,
  formatMessages,
  parseStructuredResponse,
  approximateTokenCount,
  createErrorResponse,
  AI_UNAVAILABLE_MESSAGE,
  normalizeGeminiError,
  createSuccessResponse,
  mapModelName,
  sanitizeInput
};
