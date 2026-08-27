import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      // Proxy API paths to the backend to avoid cross-origin / CORS failures.
      '/health': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
      '/plus': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
      '/minus': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
      '/multiply': {
        target: 'http://localhost:3008',
        changeOrigin: true,
      },
    },
  },
});
