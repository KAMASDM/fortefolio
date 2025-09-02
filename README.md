# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Job search integration
----------------------

The `JobSearch` component can call a provider endpoint directly from the client using Vite environment variables. Put your values in `.env` (do NOT commit it):

```
VITE_GOOGLE_JOBS_ENDPOINT=https://jobs.example.com/search
VITE_GOOGLE_JOBS_API_KEY=YOUR_API_KEY
```

Then start the app and open the Dashboard. Click "Find Jobs" on a resume to query the provider.

Security note: Calling external APIs from the browser exposes the API key to end users and may require proper CORS configuration by the provider. For production, prefer a backend proxy that hides secrets.
