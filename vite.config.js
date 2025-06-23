import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa'; // Import VitePWA

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // Automatically update the service worker
      // Customize included assets. Make sure these paths are correct relative to your public folder.
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'pwa-64x64.png', 'pwa-192x192.png', 'pwa-512x512.png', 'maskable-icon-512x512.png'],
      manifest: {
        name: 'MakeMyForte', // Your app's full name: MakeMyForte
        short_name: 'Forte', // Shorter name for home screen icon: Forte
        description: 'MakeMyForte: Your AI-powered assistant to generate impactful resumes, custom interview questions, SOPs, and more.', // A detailed description emphasizing AI features
        theme_color: '#9D88D9', // Primary color from your lavender palette
        background_color: '#EAE4F7', // Lightest color from your lavender palette for splash screen
        display: 'fullscreen', // Key setting for full-screen experience without browser UI
        scope: '/', // Scope of your PWA, typically root
        start_url: '/', // The URL that loads when the PWA is launched
        icons: [
          // Ensure these icon files are present in your 'public' directory
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any', // Can be used on any background
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable', // Special icon for adaptive icons on Android
          },
        ],
        // Optional: Add shortcuts for quick actions from the app icon
        shortcuts: [
          {
            name: "Build New Resume",
            short_name: "New Resume",
            description: "Start creating a fresh resume from scratch",
            url: "/resume/new", // Assuming a route for creating new resumes
            icons: [{ src: "shortcut-new-resume.png", sizes: "192x192" }] // You'll need this icon
          },
          {
            name: "My Dashboard",
            short_name: "Dashboard",
            description: "Access your saved resumes and features",
            url: "/dashboard", // Assuming your dashboard route
            icons: [{ src: "shortcut-dashboard.png", sizes: "192x192" }] // You'll need this icon
          },
          {
            name: "Generate SOP",
            short_name: "SOP",
            description: "Generate a Statement of Purpose with AI",
            url: "/generate/sop", // Assuming a route or direct action for SOP
            icons: [{ src: "shortcut-sop.png", sizes: "192x192" }] // You'll need this icon
          },
        ]
      },
      devOptions: {
        enabled: true, // Enable PWA in development mode for easier testing
      },
      // Optional: Workbox options for fine-tuning caching strategies
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,jpg}'], // Cache these file types
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === self.location.origin, // Cache requests from the same origin
            handler: 'NetworkFirst', // Try network first, then cache
            options: {
              cacheName: 'app-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i, // Cache Google Fonts
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1600, // Keep your existing build configuration
  },
});