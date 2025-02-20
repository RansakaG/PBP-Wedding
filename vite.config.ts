import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    assetsInlineLimit: 0, // Don't inline any assets as base64
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]', // Keep original file names with hash
      },
    },
  },
});
