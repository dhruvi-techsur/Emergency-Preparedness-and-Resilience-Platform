import type { FastifyInstance } from 'fastify';
import apiClientsRoutes from './api-clients.js';
import recordAuthorityRoutes from './record-authority.js';
import federationGrantsRoutes from './federation-grants.js';
import { gisHealthRoutes } from './gis-adapter.js';
import { hazardFeedRoutes } from './hazard-feed-adapter.js';
import { cadRoutes } from './cad-adapter.js';

/**
 * Mounts the integration-gateway module's F10 registry/governance endpoints
 * as a Fastify plugin, registered independently of auth-org's routes per
 * TechArch's component boundaries (01-components.md).
 */
export default async function integrationGatewayRoutes(app: FastifyInstance) {
  await app.register(apiClientsRoutes);
  await app.register(recordAuthorityRoutes);
  await app.register(federationGrantsRoutes);
  await app.register(gisHealthRoutes);
  // 07-01 (F12): hazard-feed health + verify routes, appended per this
  // file's existing append-only registration convention.
  await app.register(hazardFeedRoutes);
  // F15 CAD/911 — read-only dispatch-events/health routes (Plan 07-02).
  await app.register(cadRoutes);
}
