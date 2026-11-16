import type { FastifyInstance } from 'fastify';

/**
 * DEPLOY-01 D4/D5: unauthenticated liveness probe. No `preHandler`, no
 * database/NATS/OPA call — must answer 200 even when DATABASE_URL, NATS_URL,
 * OPA_URL, and KEYCLOAK_ISSUER are all unset. This is the orchestrator's
 * ONLY signal that the process is up; it deliberately proves nothing about
 * downstream dependencies (those are platform-monitoring's job, see
 * admin-integration-health.ts / platform-health.ts, both of which require
 * admin auth and DO touch the database).
 */
export default async function healthzRoutes(app: FastifyInstance) {
  app.get('/healthz', async (_req, reply) => {
    return reply.code(200).send({ status: 'ok' });
  });
}
