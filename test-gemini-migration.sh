#!/usr/bin/env bash
set -euo pipefail

echo "Checking the Netlify/Gemini backend..."

npm install --prefix netlify/functions
node -e "require('./netlify/functions/openai.js'); require('./netlify/functions/ai-suggestion.js')"
npm test -- --run tests/ai-handlers.test.js
npm run build

echo "Netlify/Gemini checks passed."
