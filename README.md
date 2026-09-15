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
- Standard text PDF and editable DOCX exports

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

- Node.js 22.12+ recommended (also supports 20.19+ and 24+)
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
├── starredSections
└── hiddenSections
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

- Main generation: 50 requests per user per one-hour window
- Quick suggestions: 100 requests per user per one-hour window
- Counters are stored durably in Firebase and cannot be accessed by clients
- Prompts and message counts are bounded server-side
- CORS is restricted to configured origins

## Export behavior

- **Template-faithful PDF / Print** opens the browser print dialog; choose
  “Save as PDF” to retain the selected visual template.
- **Standard PDF** creates a consistent single-column document with selectable text.
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
then deploy the site. Node.js 22 is configured in `netlify.toml`.


## Resume workflow upgrade — September 2026

The editor now commits each input immediately to a single document state. Cloud
saving remains debounced by five seconds. Changing sections immediately no longer
loses the last keystrokes, and visiting a blank section does not create a saved
placeholder entry. Ctrl/Cmd+S saves, while browser navigation and explicit exit
controls protect unsaved work.

### Faster creation

- New resumes start with the signed-in user's name and email.
- Desktop editing includes a live preview that can be hidden for more space.
- Import existing resume **text** with AI, review the extracted sections, then
  apply the result. PDF/DOCX file parsing is not included; paste their text instead.
- Download and restore JSON backups, including presentation settings.
- Undo and redo up to 50 groups of changes, including imports and AI applications.
- Unsaved recovery drafts are stored per user and resume in **sessionStorage**.
  They survive refreshing the same tab. This is not a full offline app: an initial
  load still requires connectivity, and closing the tab can discard its recovery
  draft. Cloud synchronization resumes after reconnecting.
- The resume coach provides an actionable seven-item writing checklist. It does
  not require references or projects and does not claim to predict ATS results.
- Paste a job description for a local keyword comparison. Draft a factual summary
  using the resume and job description, review/edit it, and apply it explicitly.
- Experience bullet rewrites also require review before replacing the original.
- Job search opens LinkedIn or Indeed with the chosen role and location. The
  disconnected `/api/jobs/search` integration has been replaced; no jobs backend
  or invented in-app listings are used.

### Customization, export and sharing

- Template search and keyboard-operable selection cover all 24 existing layouts.
- Font, font-size and section-visibility controls work on mobile and desktop.
  Font assets are bundled locally.
- Section reordering is supported by **Minimal**, Standard PDF and DOCX. Other
  templates retain their designed section placement, as stated in the controls.
- A shared data layer filters empty entries, applies visibility settings, handles
  legacy field names and removes unsafe website URLs from rendered/exported links.
- DOCX now includes references, portfolio links, project links and experience
  descriptions. PDF supports selectable text, links and flowing multipage entries.
  Standard PDF uses bundled Poppins Latin glyphs; use browser print and check the
  output for scripts outside this font's coverage. Formal PDF accessibility/tagging
  certification has not been performed.
- Public sharing has an explicit review dialog with email, phone, location and
  reference controls. Phone and references are excluded by default from new
  publications. Field controls cannot redact personal details typed into prose.
- Publishing, unpublishing and deleting use atomic database updates. Existing
  public links remain snapshots until updated; a disabled link no longer loads.
- Public and portfolio URLs share a responsive reader with copy-link fallback,
  native sharing, print and useful missing-link/error states.
- Text printouts use text nodes rather than interpolating AI output into HTML.
- Template printing copies Material UI CSSOM rules and removes hidden measurement
  nodes, preserving generated styles in the print window.
- Fixed inverted reference visibility in the Europe, India and USA templates.
- Route pages and PDF/DOCX generation load on demand.

### Backend and deployment

AI import and summary drafting use server-owned JSON schemas with the installed
Google GenAI SDK's `responseJsonSchema` and `abortSignal` configuration. See
[Google's structured output documentation](https://ai.google.dev/gemini-api/docs/structured-output).
`GEMINI_MODEL` optionally overrides the server model; the default remains
`gemini-flash-latest`. Credentials stay on Netlify Functions, and both existing
AI endpoints continue to verify Firebase tokens and apply durable per-user limits.

The contact form now submits to **Netlify Forms** instead of displaying a simulated
success. Enable [form detection in Netlify](https://docs.netlify.com/manage/forms/setup/)
and deploy the included static form in
`index.html`. Local development reports that delivery is unavailable and preserves
the user's message. Live form delivery requires verification after deployment.

Firebase and AI deployment configuration is still required. This change does not
publish the site, deploy database rules, sign into a real Google account, or test
production accounts or real email delivery.

### Verification

```bash
npm ci --legacy-peer-deps
npm install --prefix netlify/functions
npm test
npm run lint
npm run build
npx playwright install chromium  # once, if no Playwright browser is installed
npm run test:browser
```

Unit tests cover saving races, retries, data normalization, privacy filters,
backup validation, text matching, export contents and AI authentication boundaries.
Browser tests exercise the actual application components and routing with isolated
Firebase/authentication fixtures and controlled AI HTTP responses. They cover
immediate section switching, recovery, undo/redo, mobile customization, all 24
templates, imports, writing review, PDF/DOCX downloads, public sharing, browser Back,
AI failure, reconnecting after offline edits, print styling and preserving contact
messages when delivery is unavailable. Validation completed with 33 passing unit
tests and 12 passing browser scenarios; the production build passes. Lint reports
zero errors and 26 existing warnings. These tests do not establish live
Firebase, Gemini or Netlify Forms availability.

Browser artifacts are written to `test-results/` and are ignored by Git.
