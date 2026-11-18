import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// EPMP app shell — Vite dev server config.
//
// Binds 0.0.0.0 (never localhost) per runtime-environment.md §2 so the
// sandbox's preview proxy (which connects over 127.0.0.1) can reach it.
// The /api dev proxy lets the SPA and the Fastify backend share an origin
// in local dev without CORS friction — same-origin fetches from
// src/lib/api-client.ts resolve to the backend transparently.
//
// Keycloak's browser-facing paths (/realms, /resources, /js) are proxied
// same-origin too, per runtime-environment.md §9's named Keycloak example —
// `signinRedirect()` navigates to these paths and Keycloak itself
// (KC_PROXY_HEADERS=xforwarded, see docker-compose.yml) needs to see the
// browser's real forwarded proto/host to compute its own self-issued URLs
// (discovery `issuer`, login-page form action, asset hrefs) correctly.
//
// Deliberately NOT using http-proxy's built-in `xfwd: true` option here:
// its XHeaders() helper unconditionally APPENDS its own X-Forwarded-Port
// (Vite's own listening port, 5173 — see node_modules/vite's bundled
// http-proxy, the `XHeaders` function) to whatever X-Forwarded-Port a real
// upstream hop already set, which Keycloak then folds into its computed
// issuer host (producing a wrong "https://preview-host:5173/..." instead
// of "https://preview-host/..."). The `forwardHeaders` configure hook below
// passes through X-Forwarded-Proto/-Host verbatim when an upstream hop
// already set them, and falls back to Vite's own connection info (proto
// http, host = the Host header Vite itself received) only when they are
// absent — i.e. direct access with no proxy chain in front of Vite at all.
const forwardHeaders: NonNullable<ProxyOptions['configure']> = (proxy) => {
  proxy.on('proxyReq', (proxyReq, req) => {
    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedHost = req.headers['x-forwarded-host'];
    proxyReq.setHeader(
      'x-forwarded-proto',
      typeof forwardedProto === 'string' ? forwardedProto : 'http',
    );
    proxyReq.setHeader(
      'x-forwarded-host',
      typeof forwardedHost === 'string' ? forwardedHost : req.headers.host || '',
    );
  });
};

const keycloakProxy: ProxyOptions = {
  target: 'http://localhost:8081',
  changeOrigin: true,
  configure: forwardHeaders,
};

export default defineConfig({
  plugins: [
    react(),
    // Minimum PWA scaffolding (manifest + service worker) that makes the
    // app installable, per F6's "add to home screen" field-mobile
    // requirement. Auto-injects <link rel="manifest"> and the SW
    // registration script into index.html at build time — do NOT add a
    // manifest <link> manually, it would conflict with this injection.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'EPMP Field Operations',
        short_name: 'EPMP Field',
        start_url: '/field',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1a1a1a',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        // Precache the app shell; runtime-cache API GETs so a field
        // responder's already-visited screens (task list, field home)
        // still render from cache if reopened offline before the
        // offline-queue's own IndexedDB data is the thing actually being
        // shown — this is a secondary, best-effort layer UNDER the
        // offline-queue's own guarantee, not a replacement for it (the
        // queue is what guarantees writes never fail; this cache is what
        // keeps already-fetched READS available too).
        runtimeCaching: [
          {
            urlPattern: /^\/api\/v1\/(tasks|me)/,
            handler: 'NetworkFirst',
            options: { cacheName: 'epmp-api-cache', networkTimeoutSeconds: 3 },
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/realms': keycloakProxy,
      '/resources': keycloakProxy,
      '/js': keycloakProxy,
    },
  },
  build: {
    outDir: 'dist',
  },
});
