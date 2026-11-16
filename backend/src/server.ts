import Fastify from 'fastify';
import cors from '@fastify/cors';
import authOrgRoutes from './modules/auth-org/routes.js';
import integrationGatewayRoutes from './modules/integration-gateway/routes.js';
import webhookSubscriptionRoutes from './modules/integration-gateway/webhook-subscriptions.js';
import openApiRoutes from './openapi/spec.js';
import platformHealthRoutes from './modules/auth-org/platform-health.js';
import adminIntegrationHealthRoutes from './modules/auth-org/admin-integration-health.js';
import healthzRoutes from './modules/platform/healthz.js';
import staticRoutes from './static.js';
import { connectNats } from './modules/integration-gateway/nats-client.js';
import { startWebhookDeliveryWorker } from './modules/integration-gateway/webhook-delivery-worker.js';
import { syncRolePermissionsToOpa, type RolePermissionRow } from './modules/auth-org/opa-client.js';
import { query } from './db/client.js';

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
  // Unauthenticated liveness probe — DEPLOY-01 D4/D5. Registered with no
  // dependency on DATABASE_URL/NATS_URL/OPA_URL/KEYCLOAK_ISSUER being set.
  app.register(healthzRoutes);
  // Serves frontend/app/dist for GET / (and SPA client-side-routing
  // fallback for any other non-API, non-/healthz GET) — DEPLOY-01 success
  // criterion 6. Registered LAST so its catch-all 404 handler never
  // shadows /api/* or /healthz routes registered above.
  app.register(staticRoutes);

  return app;
}

// Exported for reuse in tests (supertest-style: `request(app.server)`).
export const app = buildApp();

async function start() {
  const port = Number(process.env.PORT ?? 8080);

  // OPA's data document (data.role_permissions) starts EMPTY on every OPA
  // container boot — opa-client.ts's checkPermission() fails closed against
  // that empty document, so EVERY requirePermission() preHandler (including
  // GET /api/v1/me, the very first call RouteGuard makes after a successful
  // SSO login) denies with 403 ROLE_UNRESOLVED until something pushes the
  // table in. syncRolePermissionsToOpa was previously only ever called from
  // the admin-roles PATCH route (after an edit) and from tests — never at
  // startup — so a fresh boot left every signed-in user permanently stuck on
  // the RoleUnresolved screen with no edit having happened yet to trigger the
  // first sync. Mirrors the NATS pattern below: DATABASE_URL/OPA_URL may be
  // unset (DEPLOY-01's "boots with only PORT set" contract), so a failure
  // here must never crash the server — just leave OPA's data empty exactly
  // as before this fix, with a loud warning instead of a silent gap.
  try {
    const allPerms = await query<RolePermissionRow>(`SELECT role_id, feature, actions FROM role_permissions`);
    await syncRolePermissionsToOpa(allPerms);
  } catch (err) {
    app.log.warn(err, 'OPA role_permissions sync failed at startup — authorization checks will fail closed until the next admin role edit');
  }

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
