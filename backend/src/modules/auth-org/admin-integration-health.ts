import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { query } from '../../db/client.js';

interface IntegrationHealthRow {
  id: string;
  system_name: string;
  last_sync_at: string | null;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  record_authority: string;
  sync_status: 'online' | 'syncing' | 'offline' | 'conflict';
  error_count: number;
  updated_at: string;
}

/**
 * F10 — simple passthrough read of the integration_health table (migrated
 * in 01-01). Phase 1 has no integration adapters writing to it yet, since
 * F11-F17 are out of scope — this correctly and expectedly returns an empty
 * list on a fresh Phase 1 deployment. The admin screen built in 01-11 must
 * render this as an EmptyState, not an error.
 */
export default async function adminIntegrationHealthRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/integration-health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<IntegrationHealthRow>(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at FROM integration_health`,
      );
      return reply.code(200).send({ items: rows });
    },
  );
}
