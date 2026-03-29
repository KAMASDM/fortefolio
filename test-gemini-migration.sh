#!/bin/bash

# 🧪 Test Gemini API Integration
# Run this to verify the migration was successful

echo "🧪 Testing Gemini API Integration..."
echo ""

# Check dependencies
echo "1️⃣ Checking dependencies..."
if [ -f "netlify/functions/node_modules/@google/generative-ai/package.json" ]; then
    VERSION=$(cat netlify/functions/node_modules/@google/generative-ai/package.json | grep '"version"' | head -1 | awk -F'"' '{print $4}')
    echo "✅ @google/generative-ai@$VERSION installed"
else
    echo "❌ ERROR: @google/generative-ai not installed"
    echo "   Run: cd netlify/functions && npm install"
    exit 1
fi

# Check .env file
echo ""
echo "2️⃣ Checking environment configuration..."
if [ -f ".env" ]; then
    if grep -q "GEMINI_API_KEY" .env; then
        if grep -q "GEMINI_API_KEY=AIzaSy" .env; then
            echo "✅ GEMINI_API_KEY configured in .env"
        else
            echo "⚠️  WARNING: GEMINI_API_KEY in .env but no value set"
        fi
    else
        echo "❌ ERROR: GEMINI_API_KEY not found in .env"
        exit 1
    fi
else
    echo "⚠️  WARNING: No .env file found"
    echo "   Create one from .env.example"
fi

# Check for old OpenAI references
echo ""
echo "3️⃣ Checking for old OpenAI references..."
OLD_REFS=$(grep -r "gpt-3.5\|gpt-4" src/ --include="*.jsx" --include="*.js" 2>/dev/null | wc -l)
if [ "$OLD_REFS" -eq "0" ]; then
    echo "✅ No old GPT model references found"
else
    echo "⚠️  Found $OLD_REFS old GPT model references"
    grep -rn "gpt-3.5\|gpt-4" src/ --include="*.jsx" --include="*.js" 2>/dev/null
fi

# Check function files
echo ""
echo "4️⃣ Verifying function files..."
if grep -q "@google/generative-ai" netlify/functions/openai.js; then
    echo "✅ openai.js using Gemini SDK"
else
    echo "❌ ERROR: openai.js not updated"
    exit 1
fi

if grep -q "@google/generative-ai" netlify/functions/ai-suggestion.js; then
    echo "✅ ai-suggestion.js using Gemini SDK"
else
    echo "❌ ERROR: ai-suggestion.js not updated"
    exit 1
fi

# Test build
echo ""
echo "5️⃣ Testing build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ ERROR: Build failed"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All tests passed!"
echo ""
echo "📝 Next Steps:"
echo "   1. Set GEMINI_API_KEY in Netlify Dashboard"
echo "   2. Test locally: netlify dev"
echo "   3. Deploy: netlify deploy --prod"
echo "   4. Test AI features in production"
echo ""
echo "🔗 Netlify Dashboard:"
echo "   https://app.netlify.com/"
echo ""
echo "📖 Documentation:"
echo "   - GEMINI_MIGRATION.md"
echo "   - SECURITY_CHECKLIST.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
