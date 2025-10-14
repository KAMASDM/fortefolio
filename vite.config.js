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
            // Put ALL React-related packages together
            if (id.includes('react') || id.includes('react-dom') || 
                id.includes('react-router') || id.includes('react-beautiful-dnd') ||
                id.includes('react-to-print') || id.includes('formik') ||
                id.includes('@emotion') || id.includes('@mui')) {
              return 'react-vendor';
            }
            // Large independent libraries
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('html2canvas') || id.includes('jspdf')) {
              return 'pdf-vendor';
            }
            // Everything else (should be minimal now)
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