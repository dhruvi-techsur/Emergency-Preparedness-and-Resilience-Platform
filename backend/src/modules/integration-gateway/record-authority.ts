import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { AuditService } from '../auth-org/audit.js';
import { query } from '../../db/client.js';

interface RecordAuthorityRow {
  record_type: string;
  authoritative_system: string;
  notes: string | null;
}

interface RecordAuthorityDbRow extends RecordAuthorityRow {
  id: string;
}

/**
 * Looks up which system is authoritative for a given record type, defaulting
 * to 'EPMP' when no row is registered (i.e. EPMP itself is authoritative
 * unless some other system has explicitly claimed that record type). This is
 * the function any Phase 2+ integration write-path (F11-F17 — all out of
 * Phase 1 scope) will call BEFORE persisting an externally-sourced change:
 * if the incoming write's source system does not match
 * `checkRecordAuthority(recordType)`, that future call site is responsible
 * for returning `409 RECORD_AUTHORITY_CONFLICT` — enforcement of that HTTP
 * response happens at the call site in those future modules, not here. This
 * plan ships only the registry (storage + lookup), since no consuming write
 * path exists yet in Phase 1 to enforce against.
 */
export async function checkRecordAuthority(recordType: string): Promise<string> {
  const rows = await query<{ authoritative_system: string }>(
    `SELECT authoritative_system FROM record_authority_registry WHERE record_type = $1`,
    [recordType],
  );
  return rows[0]?.authoritative_system ?? 'EPMP';
}

export default async function recordAuthorityRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/record-authority',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<RecordAuthorityRow>(
        `SELECT record_type, authoritative_system, notes FROM record_authority_registry ORDER BY record_type`,
      );
      return reply.code(200).send(rows);
    },
  );

  app.post<{ Body: { record_type: string; authoritative_system: string; notes?: string } }>(
    '/api/v1/admin/record-authority',
    { preHandler: requirePermission('admin', 'create') },
    async (req, reply) => {
      const { record_type, authoritative_system, notes } = req.body ?? {
        record_type: '',
        authoritative_system: '',
      };
      if (!record_type || !authoritative_system) {
        return reply.code(400).send({
          error_code: 'RECORD_AUTHORITY_INVALID',
          message: 'record_type and authoritative_system are required.',
        });
      }

      const before = await query<RecordAuthorityRow>(
        `SELECT record_type, authoritative_system, notes FROM record_authority_registry WHERE record_type = $1`,
        [record_type],
      );

      const rows = await query<RecordAuthorityDbRow>(
        `INSERT INTO record_authority_registry (record_type, authoritative_system, notes, updated_by)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (record_type) DO UPDATE SET
           authoritative_system = EXCLUDED.authoritative_system,
           notes = EXCLUDED.notes,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()
         RETURNING id, record_type, authoritative_system, notes`,
        [record_type, authoritative_system, notes ?? null, req.epmpUser!.id],
      );
      const after = rows[0];

      // AuditService.record's recordId column is UUID — pass the row's own
      // id, never the natural-key record_type string (which is not a UUID
      // and would fail the column's type constraint on every call).
      await AuditService.record(req.epmpUser!.id, 'record_authority_change', 'record_authority_registry', after.id, {
        before: before[0] ?? null,
        after: { record_type: after.record_type, authoritative_system: after.authoritative_system, notes: after.notes },
      });

      return reply.code(200).send({
        record_type: after.record_type,
        authoritative_system: after.authoritative_system,
        notes: after.notes,
      });
    },
  );
}
