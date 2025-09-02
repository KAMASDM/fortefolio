import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-64x64.png', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: 'MakeMyForte',
        short_name: 'Forte',
        description: 'MakeMyForte: Your AI-powered assistant to generate impactful resumes, custom interview questions, SOPs, and more.',
        theme_color: '#9D88D9',
        background_color: '#EAE4F7',
        display: 'fullscreen',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.jpg', sizes: '64x64', type: 'image/jpg' },
          { src: 'pwa-192x192.jpg', sizes: '192x192', type: 'image/jpg' },
          { src: 'pwa-512x512.jpg', sizes: '512x512', type: 'image/jpg', purpose: 'any' },
          { src: 'pwa-512x512.jpg', sizes: '512x512', type: 'image/jpg', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: "Build New Resume", short_name: "New Resume", description: "Start creating a fresh resume from scratch", url: "/resume/new", icons: [{ src: "shortcut-new-resume.png", sizes: "192x192" }] },
          { name: "My Dashboard", short_name: "Dashboard", description: "Access your saved resumes and features", url: "/dashboard", icons: [{ src: "shortcut-dashboard.png", sizes: "192x192" }] },
          { name: "Generate SOP", short_name: "SOP", description: "Generate a Statement of Purpose with AI", url: "/generate/sop", icons: [{ src: "shortcut-sop.png", sizes: "192x192" }] },
        ]
      },
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  // FIX: Add the 'define' property here to solve the 'global is not defined' error
  define: {
    'global': {},
  },
  build: {
    chunkSizeWarningLimit: 1600,
  },
});