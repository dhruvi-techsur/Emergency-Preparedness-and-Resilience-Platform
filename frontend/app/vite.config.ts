import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// EPMP app shell — Vite dev server config.
//
// Binds 0.0.0.0 (never localhost) per runtime-environment.md §2 so the
// sandbox's preview proxy (which connects over 127.0.0.1) can reach it.
// The /api dev proxy lets the SPA and the Fastify backend share an origin
// in local dev without CORS friction — same-origin fetches from
// src/lib/api-client.ts resolve to the backend transparently.
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
