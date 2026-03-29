#!/bin/bash

# 🔍 Pre-Commit Security Check
# Run this before committing to ensure no API keys are exposed

echo "🔍 Running Security Checks..."
echo ""

# Check 1: Verify .env is not staged
echo "1️⃣ Checking if .env is staged for commit..."
if git diff --cached --name-only | grep -q "^\.env$"; then
    echo "❌ ERROR: .env file is staged! Run: git reset HEAD .env"
    exit 1
else
    echo "✅ .env is not staged"
fi

# Check 2: Search for hardcoded API keys
echo ""
echo "2️⃣ Searching for hardcoded API keys..."
if git diff --cached | grep -E "AIza[0-9A-Za-z_-]{35}|sk-(live|test|proj)-[0-9A-Za-z_-]{20,}|OPENAI_API_KEY\s*=\s*['\"][^'\"]+['\"]" | grep -v "\.env\.example"; then
    echo "❌ ERROR: API key found in staged files!"
    exit 1
else
    echo "✅ No hardcoded API keys in staged files"
fi

# Check 3: Verify GEMINI_API_KEY is only in server-side files
echo ""
echo "3️⃣ Checking API key usage patterns..."
if git diff --cached | grep -E "GEMINI_API_KEY|process\.env\.GEMINI" | grep -qv "netlify/functions"; then
    echo "⚠️  WARNING: GEMINI_API_KEY reference found outside netlify/functions"
    echo "   Make sure it's only used server-side!"
fi

# Check 4: Ensure .gitignore includes .env
echo ""
echo "4️⃣ Verifying .gitignore..."
if grep -q "^\.env$" .gitignore; then
    echo "✅ .env is in .gitignore"
else
    echo "❌ ERROR: .env is NOT in .gitignore!"
    exit 1
fi

# Check 5: List staged files
echo ""
echo "5️⃣ Staged files for commit:"
git diff --cached --name-only | sed 's/^/   ✓ /'

echo ""
echo "✅ All security checks passed!"
echo "   Safe to commit."
