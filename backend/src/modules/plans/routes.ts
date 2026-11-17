import type { FastifyInstance } from 'fastify';
import plansRoutes from './plans.js';
import materializeRoutes from './materialize.js';

/**
 * Mounts the plans module's F3 endpoints as a Fastify plugin, registered
 * independently of auth-org/incident-ops/integration-gateway's routes per
 * TechArch's component boundaries (01-components.md). This is a NEW module
 * — no Phase-1/Phase-2 prior art.
 */
export default async function planRoutes(app: FastifyInstance) {
  await app.register(plansRoutes);
  await app.register(materializeRoutes);
}
