import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const require = createRequire(import.meta.url);
const mainHandler = require("../netlify/functions/openai.js").handler;
const suggestionHandler =
  require("../netlify/functions/ai-suggestion.js").handler;
const { normalizeGeminiError } = require("../netlify/functions/gemini-utils.js");

const context = { callbackWaitsForEmptyEventLoop: true };

describe("AI endpoint boundaries", () => {
  it.each([
    ["main", mainHandler, { messages: [{ role: "user", content: "Hi" }] }],
    ["suggestion", suggestionHandler, { prompt: "Improve this" }],
  ])("requires authentication for %s requests", async (_name, handler, body) => {
    const response = await handler(
      { httpMethod: "POST", headers: {}, body: JSON.stringify(body) },
      context
    );
    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.body).errorCode).toBe("AUTH_REQUIRED");
  });

  it("uses an allowlisted CORS origin for preflight", async () => {
    const response = await mainHandler(
      {
        httpMethod: "OPTIONS",
        headers: { origin: "http://localhost:8888" },
        body: "",
      },
      context
    );
    expect(response.statusCode).toBe(200);
    expect(response.headers["Access-Control-Allow-Origin"]).toBe(
      "http://localhost:8888"
    );
  });
});

describe("Gemini error messages", () => {
  it.each([
    [{ status: 400, message: "API key not valid" }, "AI_SERVICE_UNAVAILABLE"],
    [{ status: 403, message: "Permission denied" }, "AI_SERVICE_UNAVAILABLE"],
    [{ status: 429, message: "Resource exhausted" }, "AI_BUSY"],
  ])("humanizes provider failure %#", (providerError, expectedCode) => {
    const result = normalizeGeminiError(providerError);

    expect(result.statusCode).toBe(503);
    expect(result.code).toBe(expectedCode);
    expect(result.message).not.toMatch(/api.?key|quota|permission/i);
    expect(result.message).toMatch(/AI writing assistant/i);
  });
});
