import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { FastifyInstance } from 'fastify';
import fastifyStatic from '@fastify/static';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// At runtime (compiled: backend/dist/static.js) the frontend build output is
// copied to frontend/app/dist alongside backend/dist in the Dockerfile's
// runtime stage (both are siblings under /app) — so the relative path from
// dist/static.js is ../../frontend/app/dist. In dev (tsx watch src/server.ts,
// uncompiled), the same relative traversal from backend/src/static.ts also
// resolves to frontend/app/dist, since both environments share the same
// backend/<src|dist> ↔ frontend/app/dist sibling layout under the repo root.
const FRONTEND_DIST = path.resolve(__dirname, '../../frontend/app/dist');
const INDEX_HTML = path.join(FRONTEND_DIST, 'index.html');

/**
 * DEPLOY-01 success criterion 6: GET / must serve the real SPA build output
 * (or redirect to it), not 404. Registers @fastify/static over
 * frontend/app/dist, then falls back to index.html (SPA client-side-routing
 * fallback — React Router resolves the actual path in the browser) for any
 * GET request that isn't /api/*, isn't /healthz, and doesn't match a real
 * static file on disk.
 */
export default async function staticRoutes(app: FastifyInstance) {
  await app.register(fastifyStatic, {
    root: FRONTEND_DIST,
    index: ['index.html'],
    // We register our own catch-all fallback below rather than relying on
    // @fastify/static's wildcard option, so that /api/* and /healthz (both
    // registered as their own routes elsewhere) are never shadowed.
    wildcard: false,
  });

  app.setNotFoundHandler(async (req, reply) => {
    if (req.raw.method !== 'GET' && req.raw.method !== 'HEAD') {
      return reply.code(404).send({ error_code: 'NOT_FOUND', message: 'Not found.' });
    }
    if (req.url.startsWith('/api/') || req.url === '/healthz') {
      return reply.code(404).send({ error_code: 'NOT_FOUND', message: 'Not found.' });
    }
    try {
      const html = await readFile(INDEX_HTML, 'utf-8');
      return reply.code(200).type('text/html').send(html);
    } catch {
      // frontend build output missing entirely (e.g. backend-only dev run
      // without `npm run build -w frontend/app` yet) — degrade to a plain
      // 404 rather than crashing the request.
      return reply.code(404).send({ error_code: 'NOT_FOUND', message: 'Frontend build not found.' });
    }
  });
}
