import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { runOverdueSweep } from './overdue-sweep.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 03-01's tasks.test.ts. runOverdueSweep() is tested as a direct
// function call (NOT via HTTP), since there is no user-facing endpoint for a
// system-scheduled job — the closure-cascade assertions (step 8) DO go via
// HTTP, reusing 02-02's POST .../closure endpoint.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for overdue-sweep.test.ts'],
  );
  return inserted[0].id;
}

async function findOrCreateJurisdiction(name: string): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    [name, 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    [name, 'county'],
  );
  return inserted[0].id;
}

async function createTestIncident(token: string, jurisdictionId: string): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Overdue Sweep Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

// Direct-insert test setup is intentional here, not a bug: 03-01's
// POST /api/v1/tasks rejects a past due_at unless confirmed_backfill:true
// is set, and even with that flag it enforces owner/validation gates this
// test doesn't want to depend on. This test needs full control over
// due_at/status to exercise the sweep's own query boundary precisely, so it
// bypasses the API and inserts tasks rows directly via query().
async function insertTask(params: {
  title: string;
  ownerId: string;
  createdBy: string;
  dueAt: Date;
  status?: string;
  incidentId?: string | null;
}): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO tasks (title, owner_id, incident_id, due_at, status, created_by)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`,
    [
      params.title,
      params.ownerId,
      params.incidentId ?? null,
      params.dueAt.toISOString(),
      params.status ?? 'Open',
      params.createdBy,
    ],
  );
  return rows[0].id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Overdue Sweep Test Jurisdiction');
  testRoleId = await findOrCreateRole('overdue_sweep_test_role', 'PER-02');

  for (const feature of ['incidents', 'tasks']) {
    const existingPerm = await query<{ id: string }>(
      `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
      [testRoleId, feature],
    );
    if (!existingPerm[0]) {
      await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
        testRoleId,
        feature,
        ['view', 'create', 'edit'],
      ]);
    } else {
      await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
        ['view', 'create', 'edit'],
        existingPerm[0].id,
      ]);
    }
  }

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `overdue-sweep-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Overdue Sweep Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('time-based overdue sweep (runOverdueSweep) + closure-cascade per-task audit', () => {
  it('flips a genuinely-overdue, open task to Overdue while its OPEN incident is untouched, writing a system-attributed history row and Timeline entry', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    const title = `Overdue Task ${Date.now()}`;
    const taskId = await insertTask({
      title,
      ownerId: testUserId,
      createdBy: testUserId,
      dueAt: new Date(Date.now() - 3600_000), // 1 hour in the past
      incidentId,
    });

    // 2. Run the sweep; assert flipped_count >= 1 and the task is now Overdue.
    const result = await runOverdueSweep();
    expect(result.flipped_count).toBeGreaterThanOrEqual(1);

    const statusRows = await query<{ status: string }>(`SELECT status FROM tasks WHERE id = $1`, [taskId]);
    expect(statusRows[0].status).toBe('Overdue');

    const historyRows = await query<{ changed_by: string | null }>(
      `SELECT changed_by FROM task_status_history WHERE task_id = $1 AND to_status = 'Overdue'`,
      [taskId],
    );
    expect(historyRows).toHaveLength(1);
    expect(historyRows[0].changed_by).toBeNull();

    // 3. The incident itself is STILL Open — proving this is the time-based
    // trigger, not Phase 2's closure cascade.
    const incidentRows = await query<{ status: string }>(`SELECT status FROM incidents WHERE id = $1`, [incidentId]);
    expect(incidentRows[0].status).toBe('Open');

    // 4. Timeline shows a system-sourced "Task overdue: ..." entry with a
    // null actor.
    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const entry = timelineRes.body.items.find((i: { title: string }) => i.title === `Task overdue: ${title}`);
    expect(entry).toBeTruthy();
    expect(entry.source).toBe('system');
    expect(entry.actor).toBeNull();

    // 5. Running the sweep again is a no-op for this already-flipped task —
    // still exactly one history row, not two.
    await runOverdueSweep();
    const historyRowsAfterSecondRun = await query<{ id: string }>(
      `SELECT id FROM task_status_history WHERE task_id = $1 AND to_status = 'Overdue'`,
      [taskId],
    );
    expect(historyRowsAfterSecondRun).toHaveLength(1);
  });

  it('does not flip a future-due task or an already-Done past-due task', async () => {
    const futureTaskId = await insertTask({
      title: `Future Due Task ${Date.now()}`,
      ownerId: testUserId,
      createdBy: testUserId,
      dueAt: new Date(Date.now() + 3600_000), // 1 hour in the future
    });

    const doneTaskId = await insertTask({
      title: `Already Done Task ${Date.now()}`,
      ownerId: testUserId,
      createdBy: testUserId,
      dueAt: new Date(Date.now() - 3600_000), // past due, but terminal
      status: 'Done',
    });

    await runOverdueSweep();

    const futureRows = await query<{ status: string }>(`SELECT status FROM tasks WHERE id = $1`, [futureTaskId]);
    expect(futureRows[0].status).toBe('Open');

    const doneRows = await query<{ status: string }>(`SELECT status FROM tasks WHERE id = $1`, [doneTaskId]);
    expect(doneRows[0].status).toBe('Done');
  });

  it('background_jobs visibility: a sweep run lands a real row, not a silently-swallowed CHECK violation', async () => {
    await runOverdueSweep();

    const rows = await query<{ status: string; last_run_at: string }>(
      `SELECT status, last_run_at FROM background_jobs WHERE job_type = 'task_overdue_sweep' ORDER BY last_run_at DESC LIMIT 1`,
    );
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe('running');
    expect(rows[0].last_run_at).toBeTruthy();
    // "Recent" — within the last 5 minutes of this test run.
    const ageMs = Date.now() - new Date(rows[0].last_run_at).getTime();
    expect(ageMs).toBeLessThan(5 * 60_000);
  });

  it('closing an incident with open tasks writes one task_status_history row AND one Timeline entry PER cascaded task', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    const task1Title = `Cascade Task One ${Date.now()}`;
    const task2Title = `Cascade Task Two ${Date.now()}`;
    const task1Id = await insertTask({
      title: task1Title,
      ownerId: testUserId,
      createdBy: testUserId,
      dueAt: new Date(Date.now() + 3600_000), // not yet overdue
      incidentId,
    });
    const task2Id = await insertTask({
      title: task2Title,
      ownerId: testUserId,
      createdBy: testUserId,
      dueAt: new Date(Date.now() + 3600_000),
      incidentId,
    });

    const closeRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/closure`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmed: true });
    expect(closeRes.status).toBe(200);

    const task1Rows = await query<{ status: string }>(`SELECT status FROM tasks WHERE id = $1`, [task1Id]);
    expect(task1Rows[0].status).toBe('Overdue');
    const task2Rows = await query<{ status: string }>(`SELECT status FROM tasks WHERE id = $1`, [task2Id]);
    expect(task2Rows[0].status).toBe('Overdue');

    const historyCountRows = await query<{ count: string }>(
      `SELECT count(*) FROM task_status_history WHERE task_id IN ($1, $2) AND to_status = 'Overdue'`,
      [task1Id, task2Id],
    );
    expect(parseInt(historyCountRows[0].count, 10)).toBe(2);

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const titles: string[] = timelineRes.body.items.map((i: { title: string }) => i.title);
    expect(titles).toContain(`Task overdue (incident closed): ${task1Title}`);
    expect(titles).toContain(`Task overdue (incident closed): ${task2Title}`);
    expect(titles).toContain('Incident closed');

    // Three Overdue-related entries total for this closure: one per
    // cascaded task plus the one generic incident-level entry — proving the
    // fix landed per-task, not just the generic entry Phase 2 originally
    // wrote alone.
    const overdueRelatedCount = titles.filter(
      (t) => t.startsWith('Task overdue (incident closed): ') || t === 'Incident closed',
    ).length;
    expect(overdueRelatedCount).toBe(3);
  });
});
