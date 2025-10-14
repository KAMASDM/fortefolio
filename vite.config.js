import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    'global': 'globalThis',
    '__BUILD_TIME__': JSON.stringify(new Date().toISOString()),
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1600,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Group React, MUI, and Emotion together - they have tight dependencies
            if (id.includes('react') || id.includes('react-dom') || 
                id.includes('@mui') || id.includes('@emotion')) {
              return 'react-mui-vendor';
            }
            // Keep these separate as they're large and independent
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            // Everything else goes to vendor
            return 'vendor';
          }
        },
        // Force new hashes
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['html2canvas'],
  },
});