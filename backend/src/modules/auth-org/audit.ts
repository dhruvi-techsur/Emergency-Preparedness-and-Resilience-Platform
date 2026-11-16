// This is the ONLY code path permitted to write to audit_log. No other
// module's repository layer may INSERT into this table directly — call
// AuditService.record() instead. The append-only trigger from 01-01 blocks
// UPDATE/DELETE on this table (not INSERT), so multiple INSERT call-sites
// would still violate the single-writer *pattern* even though the trigger
// doesn't block them — this discipline is what makes 01-components.md
// §2.4's "exactly one writer module" invariant actually true in practice.
import { query } from '../../db/client.js';

export const AuditService = {
  async record(
    actorId: string,
    action: string,
    recordType?: string,
    recordId?: string,
    detail?: Record<string, unknown>,
  ): Promise<void> {
    await query(
      `INSERT INTO audit_log (actor_id, action, record_type, record_id, detail) VALUES ($1,$2,$3,$4,$5)`,
      [actorId, action, recordType ?? null, recordId ?? null, detail ? JSON.stringify(detail) : null],
    );
  },
};
