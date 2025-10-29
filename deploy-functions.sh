#!/bin/bash

# ForteFolio - Firebase Functions Deployment Script
# This script deploys the secure OpenAI integration

echo "🚀 Starting ForteFolio Firebase Functions Deployment"
echo "=================================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

echo ""
echo "1️⃣  Installing function dependencies..."
cd functions
npm install
cd ..

echo ""
echo "2️⃣  Setting OpenAI API Key..."
read -p "Enter your OpenAI API Key: " OPENAI_KEY
firebase functions:config:set openai.key="$OPENAI_KEY"

echo ""
echo "3️⃣  Verifying configuration..."
firebase functions:config:get

echo ""
echo "4️⃣  Deploying functions to Firebase..."
firebase deploy --only functions

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Test the functions in your app"
echo "   2. Build and deploy your frontend: npm run build"
echo "   3. Deploy to Netlify: netlify deploy --prod"
echo "   4. Deactivate old exposed API keys in OpenAI dashboard"
echo ""
echo "🎉 Your OpenAI API key is now secure!"
