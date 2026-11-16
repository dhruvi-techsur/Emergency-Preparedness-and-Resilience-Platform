import type { FastifyInstance } from 'fastify';
import incidentsRoutes from './incidents.js';

/**
 * Mounts the incident-ops module's F1 endpoints as a Fastify plugin,
 * registered independently of auth-org's routes per TechArch's component
 * boundaries (01-components.md).
 */
export default async function incidentOpsRoutes(app: FastifyInstance) {
  await app.register(incidentsRoutes);
}
