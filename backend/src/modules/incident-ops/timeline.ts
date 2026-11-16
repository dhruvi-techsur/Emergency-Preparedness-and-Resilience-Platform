import { PoolClient } from 'pg';
import { pool } from '../../db/client.js';

export type TimelineTone = 'brand' | 'success' | 'warning' | 'danger';

// This is the ONLY code path permitted to write to incident_timeline — mirrors
// auth-org's AuditService.record() single-writer pattern. ALWAYS call this
// inside the same transaction (same `client`) as the domain mutation it
// documents, never as a separate connection/call that could partially fail.
export const TimelineService = {
  async append(
    client: PoolClient,
    incidentId: string,
    title: string,
    meta: string | undefined,
    tone: TimelineTone,
    actorId: string | null,
    source: string,
    detail?: Record<string, unknown>,
  ): Promise<void> {
    await client.query(
      `INSERT INTO incident_timeline (incident_id, title, meta, tone, actor_id, source, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [incidentId, title, meta ?? null, tone, actorId, source, detail ? JSON.stringify(detail) : null],
    );
  },
};

// Shared transaction helper every incident-mutating handler uses: runs `fn`
// inside BEGIN/COMMIT, rolling back (and rethrowing as TIMELINE_WRITE_FAILED
// upstream) if either the domain mutation or the TimelineService.append call
// fails — this is what makes "every state-changing action writes exactly one
// Timeline entry" a real transactional guarantee, not just a code convention.
export async function withTimelineTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
