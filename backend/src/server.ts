import Fastify from 'fastify';
import cors from '@fastify/cors';
import authOrgRoutes from './modules/auth-org/routes.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Permissive CORS for dev — the Pivota preview reaches this app from another
  // origin, so do not restrict to a single hardcoded origin here.
  app.register(cors, { origin: true });

  app.register(authOrgRoutes);

  // HEALTHZ_INSERTION_POINT

  return app;
}

// Exported for reuse in tests (supertest-style: `request(app.server)`).
export const app = buildApp();

async function start() {
  const port = Number(process.env.PORT ?? 8080);
  try {
    // Bind 0.0.0.0, never localhost — per runtime-environment.md §2, the
    // preview proxy connects over 127.0.0.1 and localhost can resolve to ::1.
    await app.listen({ port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Only auto-start when run directly (not when imported by tests).
if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  start();
}
