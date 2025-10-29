# ForteFolio - AI-Powered Resume Builder

A modern, feature-rich resume builder with AI-powered content generation, multiple professional templates, and real-time collaboration features.

## ✨ Features

- **11 Professional Templates** - Modern, Minimal, Creative, Professional, and more
- **AI-Powered Content Generation** - Interview questions, cover letters, resume enhancement
- **Real-time Collaboration** - Firebase-powered sync across devices
- **Multi-format Export** - PDF, DOCX, and print-ready formats
- **Secure API Integration** - Server-side OpenAI integration via Netlify Functions
- **Mobile Responsive** - Works seamlessly on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase account
- OpenAI API key
- Netlify account (for deployment)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/KAMASDM/fortefolio.git
cd fortefolio
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your actual API keys (see Security section below)
```

4. **Start development server:**
```bash
netlify dev  # Use this for full functionality with AI features
# OR
npm run dev  # Frontend only (AI features won't work)
```

5. **Access the application:**
- Full app with functions: `http://localhost:8888`
- Frontend only: `http://localhost:5173`

## 🔒 Security Setup

### Environment Variables Required:

Create a `.env` file from `.env.example` and fill in:

```bash
# Firebase Configuration (from Firebase Console)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# OpenAI API Key (CRITICAL - Keep this secure!)
OPENAI_API_KEY=sk-proj-your_openai_api_key_here
```

### 🔐 Security Best Practices:

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use Netlify Environment Variables** for production deployment
3. **OpenAI API calls are server-side only** - No client-side exposure
4. **Rate limiting implemented** - 50 calls/hour per user
5. **Authentication required** - All AI features require login

## 📁 Project Structure

```
src/
├── components/
│   ├── DashboardPage/          # Dashboard UI components
│   ├── LoginPage/              # Authentication & landing
│   └── ResumeBuilderPage/      # Core resume builder
│       ├── Templates/          # 11 resume templates
│       ├── Forms/             # Data input forms
│       ├── EnhanceResume/     # AI enhancement features
│       └── ExportMenu/        # PDF/DOCX export
├── context/
│   └── AuthContext.jsx        # Authentication state
├── pages/                     # Main page components
├── utils/
│   └── openai.js             # Secure AI API wrapper
└── firebaseConfig.js         # Firebase setup

netlify/functions/             # Serverless functions
├── openai.js                 # Main AI generation
└── ai-suggestion.js          # Quick suggestions
```

## 🛠️ Development

### Available Scripts:
```bash
npm run dev          # Start Vite dev server (frontend only)
netlify dev          # Start full development environment with functions
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### AI Features Development:
- All AI features use Netlify Functions for security
- Functions are automatically loaded in `netlify dev`
- OpenAI API calls include timeout handling and error recovery
- Rate limiting prevents API abuse

## 🚀 Deployment

### Environment Variables in Netlify:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add all variables from your `.env` file
3. **Critical:** Set `OPENAI_API_KEY` with your actual API key

### Deploy:
```bash
npm run build
netlify deploy --prod
# OR connect Git for automatic deployments
```

## 🧪 Testing AI Features

1. **Access:** `http://localhost:8888` (Netlify dev server)
2. **Login** with Google OAuth
3. **Create/Edit Resume**
4. **Test AI Features:**
   - Generate Interview Questions
   - AI Resume Enhancement
   - Cover Letter Generation
   - Statement of Purpose (SOP)

## 📊 Technology Stack

- **Frontend:** React 18, Vite, Material-UI, Framer Motion
- **Backend:** Netlify Functions (serverless)
- **Database:** Firebase Realtime Database
- **Authentication:** Firebase Auth (Google OAuth)
- **AI Integration:** OpenAI GPT-3.5-turbo
- **Export:** Browser-native PDF, DOCX generation
- **Deployment:** Netlify (frontend + functions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
