const {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getDatabase } = require("firebase-admin/database");

const DEFAULT_ALLOWED_ORIGINS = [
  "https://makemyforte.com",
  "https://www.makemyforte.com",
  "http://localhost:8888",
  "http://localhost:5173",
];

const getAllowedOrigins = () => [
  ...DEFAULT_ALLOWED_ORIGINS,
  ...(process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
];

const getAdminApp = () => {
  if (getApps().length) return getApp();

  const options = {
    databaseURL:
      process.env.FIREBASE_DATABASE_URL ||
      process.env.VITE_FIREBASE_DATABASE_URL,
  };

  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    );
    options.credential = cert(serviceAccount);
  } else {
    options.credential = applicationDefault();
  }

  return initializeApp(options);
};

const getCorsHeaders = (event) => {
  const origin = event.headers?.origin || event.headers?.Origin;
  const allowed = getAllowedOrigins();
  const selectedOrigin = allowed.includes(origin)
    ? origin
    : "https://makemyforte.com";

  return {
    "Access-Control-Allow-Origin": selectedOrigin,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
};

const withCors = (response, event, additionalHeaders = {}) => ({
  ...response,
  headers: {
    ...(response.headers || {}),
    ...getCorsHeaders(event),
    ...additionalHeaders,
  },
});

const parseBearerToken = (event) => {
  const header =
    event.headers?.authorization || event.headers?.Authorization || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
};

const authenticateRequest = async (event) => {
  const token = parseBearerToken(event);
  if (!token) {
    const error = new Error("Authentication required.");
    error.statusCode = 401;
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  const app = getAdminApp();
  return getAuth(app).verifyIdToken(token, true);
};

const enforceRateLimit = async ({
  uid,
  endpoint,
  limit,
  windowMs = 60 * 60 * 1000,
}) => {
  const app = getAdminApp();
  const counterRef = getDatabase(app).ref(
    `aiRateLimits/${uid}/${endpoint}`
  );
  const now = Date.now();

  const result = await counterRef.transaction((current) => {
    if (!current || now - current.windowStart >= windowMs) {
      return { windowStart: now, count: 1 };
    }
    if (current.count >= limit) return;
    return { ...current, count: current.count + 1 };
  });

  if (!result.committed) {
    const current = result.snapshot.val();
    const error = new Error("Rate limit exceeded. Please try again later.");
    error.statusCode = 429;
    error.code = "RATE_LIMITED";
    error.retryAfter = Math.max(
      1,
      Math.ceil((current.windowStart + windowMs - now) / 1000)
    );
    throw error;
  }

  const counter = result.snapshot.val();
  return {
    limit,
    remaining: Math.max(0, limit - counter.count),
    reset: counter.windowStart + windowMs,
  };
};

const rateLimitHeaders = (rateLimit) =>
  rateLimit
    ? {
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(rateLimit.reset),
      }
    : {};

module.exports = {
  authenticateRequest,
  enforceRateLimit,
  getCorsHeaders,
  parseBearerToken,
  rateLimitHeaders,
  withCors,
};
