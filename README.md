# ForteFolio / MakeMyForte

ForteFolio is a React resume builder with Firebase authentication and storage,
24 resume layouts, AI-assisted writing, public publishing, and PDF/DOCX export.

## Features

- Google sign-in through Firebase Authentication
- Private resume CRUD backed by Firebase Realtime Database
- Six resume sections: personal details, education, experience, skills,
  projects, and references
- 24 core, modern, professional, and regional templates
- Persistent template, color, font, font-size, section-order, and starred-section
  settings
- Five-second debounced autosave plus explicit saving and navigation protection
- Gemini-powered resume suggestions, enhancement, cover letters, SOPs, and
  interview questions
- Explicit publish/unpublish workflow using separate public resume snapshots
- Template-faithful browser print / Save as PDF
- Standard accessible PDF and editable DOCX exports

## Technology

- React 18 and Vite
- Material UI and Framer Motion
- Firebase Authentication and Realtime Database
- Netlify Functions
- Google Gemini through `@google/genai`
- Vitest and Testing Library

The active backend is Netlify Functions plus Gemini. The former Firebase
Functions/OpenAI implementation has been removed.

## Requirements

- Node.js 20 or newer
- A Firebase project with Google authentication and Realtime Database enabled
- A Gemini API key
- A Firebase service account for the Netlify Functions runtime
- Netlify CLI for full local AI testing

## Local setup

```bash
npm install
npm install --prefix netlify/functions
cp .env.example .env
npm run dev
```

`npm run dev` starts the frontend at `http://localhost:5173`. AI features expect
Netlify Functions at port 8888, so use this for full-stack development:

```bash
npx netlify dev
```

## Environment variables

Frontend Firebase variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_DATABASE_URL
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
```

Server-only Netlify variables:

```text
GEMINI_API_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
FIREBASE_DATABASE_URL
ALLOWED_ORIGINS
```

`FIREBASE_SERVICE_ACCOUNT_JSON` must contain the complete Firebase service
account JSON document. `ALLOWED_ORIGINS` is an optional comma-separated list in
addition to the production and local origins built into the function.

Never prefix server secrets with `VITE_`; Vite-prefixed values are exposed to
the browser.

## Data and publishing model

Private data remains under:

```text
users/{uid}/resumes/{resumeId}
```

Only the owner can read or write it. Presentation settings use the canonical:

```text
metadata.presentation
├── template
├── colorScheme
├── fontFamily
├── fontSize
├── sectionOrder
└── starredSections
```

Older `metadata.template`, `metadata.colorScheme`, and `metadata.color` records
are read through compatibility normalization.

Sharing never makes the private branch public. Selecting “Share Public Link”
saves the resume and creates a bounded snapshot at:

```text
publicResumes/{uid}/{resumeId}
```

Anyone can read that published snapshot. Only its owner can publish, update, or
remove it. “Disable Public Link” on the dashboard removes the snapshot.

Deploy database rules after changing the sharing model:

```bash
npx firebase-tools deploy --only database
```

## AI security

The browser sends a current Firebase ID token to both AI functions. Functions
verify the token with Firebase Admin before calling Gemini.

- Main generation: 50 requests per user per rolling one-hour window
- Quick suggestions: 100 requests per user per rolling one-hour window
- Counters are stored durably in Firebase and cannot be accessed by clients
- Prompts and message counts are bounded server-side
- CORS is restricted to configured origins

## Export behavior

- **Template-faithful PDF / Print** opens the browser print dialog; choose
  “Save as PDF” to retain the selected visual template.
- **Standard PDF** creates a consistent, accessible single-column document.
- **Editable DOCX** creates a standard editable Word layout.

The standard PDF and DOCX exports intentionally do not imitate every visual
template.

## Commands

```bash
npm run dev
npm run lint
npm test
npm run test:watch
npm run build
npm run preview
```

The test suite covers normalization, persistence payloads, autosaving,
navigation protection, public snapshot behavior, database-rule contracts, and
AI authentication/CORS boundaries.

## Deployment

Netlify runs:

```bash
npm install --prefix netlify/functions
npm ci
npm run build
```

Configure all server variables in Netlify, deploy Firebase database rules, and
then deploy the site. Node.js 20 is configured in `netlify.toml`.
