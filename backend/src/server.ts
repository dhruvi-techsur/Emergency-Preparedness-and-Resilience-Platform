import Fastify from 'fastify';
import cors from '@fastify/cors';
import authOrgRoutes from './modules/auth-org/routes.js';
import integrationGatewayRoutes from './modules/integration-gateway/routes.js';
import webhookSubscriptionRoutes from './modules/integration-gateway/webhook-subscriptions.js';
import openApiRoutes from './openapi/spec.js';
import platformHealthRoutes from './modules/auth-org/platform-health.js';
import adminIntegrationHealthRoutes from './modules/auth-org/admin-integration-health.js';
import { connectNats } from './modules/integration-gateway/nats-client.js';
import { startWebhookDeliveryWorker } from './modules/integration-gateway/webhook-delivery-worker.js';

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  // Permissive CORS for dev — the Pivota preview reaches this app from another
  // origin, so do not restrict to a single hardcoded origin here.
  app.register(cors, { origin: true });

  // Registered first so @fastify/swagger's onRoute hook observes every
  // subsequently-registered route's schema (Fastify defers actual route
  // binding until after the register() chain resolves, but registering the
  // swagger plugin first keeps the dependency explicit and documented).
  app.register(openApiRoutes);

  app.register(authOrgRoutes);
  app.register(integrationGatewayRoutes);
  app.register(webhookSubscriptionRoutes);
  app.register(platformHealthRoutes);
  app.register(adminIntegrationHealthRoutes);

  // HEALTHZ_INSERTION_POINT

  return app;
}

// Exported for reuse in tests (supertest-style: `request(app.server)`).
export const app = buildApp();

async function start() {
  const port = Number(process.env.PORT ?? 8080);

  // A NATS outage at boot must NOT crash the server — DEPLOY-01's "app
  // starts without external services" principle extended to the event bus.
  // Routes that don't need NATS (DB-backed webhook-subscription
  // registration) keep working regardless; only publishEvent()/the delivery
  // worker need a live connection, and both degrade gracefully when absent.
  try {
    await connectNats();
    await startWebhookDeliveryWorker();
  } catch (err) {
    app.log.warn(err, 'NATS connection failed at startup — event bus disabled, server continues');
  }

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
