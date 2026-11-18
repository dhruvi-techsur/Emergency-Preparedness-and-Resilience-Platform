import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

interface OverdueCandidateRow {
  id: string;
  title: string;
  incident_id: string | null;
}

// Time-based Overdue flip — DISTINCT from Phase 2's closure.ts cascade
// (closure.ts is extended in Task 2 of this SAME plan to write the
// identical audit pattern this function writes, for its own cascade path).
// closure.ts flips tasks to Overdue synchronously when an incident closes
// (scoped to that incident, inside the closure transaction). THIS function
// flips tasks to Overdue on a schedule, purely because due_at has passed,
// regardless of incident status (including tasks with incident_id=NULL,
// i.e. standalone tasks). Both converge on the same tasks.status='Overdue'
// terminal value via the same task_status_history/Timeline audit pattern;
// neither supersedes the other. The WHERE clause below excludes tasks
// already 'Done' or 'Overdue', making repeated sweep runs a no-op against
// already-flipped tasks (idempotent), and symmetric with closure.ts's own
// `status NOT IN ('Done','Overdue')` exclusion — a task flipped by either
// path is simply skipped by the other on its next run, never double-flipped.
export async function runOverdueSweep(): Promise<{ flipped_count: number }> {
  const candidates = await query<OverdueCandidateRow>(
    `SELECT id, title, incident_id FROM tasks
     WHERE due_at < now() AND status NOT IN ('Done','Overdue')`,
  );

  let flippedCount = 0;
  for (const task of candidates) {
    // One transaction per task — a failure on one overdue task must not
    // roll back the sweep's progress on every other task it already flipped
    // in this run (unlike a single-incident closure cascade, which IS one
    // atomic unit; this sweep spans many independent tasks/incidents).
    await withTimelineTransaction(async (client) => {
      const updated = await client.query(
        `UPDATE tasks SET status='Overdue', updated_at=now()
         WHERE id=$1 AND status NOT IN ('Done','Overdue') RETURNING id`,
        [task.id],
      );
      if (updated.rowCount === 0) return; // already flipped by a concurrent path (closure cascade or a prior sweep tick) — no-op, not an error
      await client.query(
        `INSERT INTO task_status_history (task_id, from_status, to_status, changed_by)
         VALUES ($1, NULL, 'Overdue', NULL)`, // changed_by=NULL marks this as system-driven, per TechArch's task_status_history.changed_by comment
        [task.id],
      );
      if (task.incident_id) {
        await TimelineService.append(
          client,
          task.incident_id,
          `Task overdue: ${task.title}`,
          undefined,
          'danger',
          null,
          'system',
        );
      }
    });
    flippedCount += 1;
  }

  // This insert now succeeds because the migration above extended the
  // allowed job_type list — NO defensive catch-and-swallow around the
  // CHECK-constraint violation this used to silently hit on every call.
  // A genuinely different failure here (e.g. DB connection loss) SHOULD
  // still surface, not be swallowed — document inline why the broad
  // try/catch pattern other background-job writers (01-09) use for THEIR
  // own distinct "schema shape I'm not certain about" uncertainty does not
  // apply here: this plan's migration makes the schema shape a known fact,
  // not a guess, so there is nothing left to defend against via a catch.
  await query(
    `INSERT INTO background_jobs (job_type, status, last_run_at)
     VALUES ('task_overdue_sweep', 'running', now())`,
  );

  return { flipped_count: flippedCount };
}

let intervalHandle: NodeJS.Timeout | undefined;

export function startOverdueSweepScheduler(intervalMs: number = 60_000): void {
  // Runs every 60s by default — frequent enough that "automatically flips...
  // without any manual status update" is observable within a minute of the
  // due time passing, per FRD's implicit real-time expectation, without
  // hammering the DB. A production deployment may tune this via the
  // intervalMs param; tests call runOverdueSweep() directly without the
  // scheduler for determinism (see overdue-sweep.test.ts).
  if (intervalHandle) return; // idempotent against double-start (e.g. hot reload)
  intervalHandle = setInterval(() => {
    runOverdueSweep().catch((err) => console.error('[overdue-sweep] failed', err));
  }, intervalMs);
}
