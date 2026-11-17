import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 02-01's incidents.test.ts.
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
    [name, personaId, 'Test role for tasks.test.ts'],
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
      name: `Tasks Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Tasks Test Jurisdiction');
  testRoleId = await findOrCreateRole('tasks_test_role', 'PER-02');

  // Grant both incidents:view/create/edit (for the incident-creation
  // helper above) and tasks:view/create/edit (the feature-permission this
  // plan's routes are gated on).
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

  const email = `tasks-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Tasks Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops tasks routes', () => {
  it('POST /api/v1/tasks with no owner_id returns 422 TASK_OWNER_REQUIRED and inserts no row', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const beforeCount = await query<{ count: string }>(`SELECT count(*) FROM tasks`);

    const res = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'No owner task',
        due_at: new Date(Date.now() + 3600_000).toISOString(),
      });
    expect(res.status).toBe(422);
    expect(res.body.error_code).toBe('TASK_OWNER_REQUIRED');

    const afterCount = await query<{ count: string }>(`SELECT count(*) FROM tasks`);
    expect(afterCount[0].count).toBe(beforeCount[0].count);
  });

  it('POST /api/v1/tasks with a past due_at returns 422 DUE_DATE_PAST; confirmed_backfill:true creates it anyway', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const pastDueAt = new Date(Date.now() - 3600_000).toISOString();

    const blockedRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Backfill Task ${Date.now()}`,
        owner_id: testUserId,
        due_at: pastDueAt,
      });
    expect(blockedRes.status).toBe(422);
    expect(blockedRes.body.error_code).toBe('DUE_DATE_PAST');

    const confirmedRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Backfill Task ${Date.now()}`,
        owner_id: testUserId,
        due_at: pastDueAt,
        confirmed_backfill: true,
      });
    expect(confirmedRes.status).toBe(201);
    expect(confirmedRes.body.status).toBe('Open');
  });

  it('a task linked to an incident writes a "Task created: ..." Timeline entry with a non-null actor', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    const title = `Linked Task ${Date.now()}`;
    const createRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title,
        owner_id: testUserId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
        incident_id: incidentId,
      });
    expect(createRes.status).toBe(201);

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const entry = timelineRes.body.items.find((i: { title: string }) => i.title === `Task created: ${title}`);
    expect(entry).toBeTruthy();
    expect(entry.actor).not.toBeNull();
  });

  it('PATCH .../status with new_status:"Overdue" directly returns 409 INVALID_STATUS_TRANSITION (system-only transition)', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const createRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Direct Overdue Attempt ${Date.now()}`,
        owner_id: testUserId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
      });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.id;

    const patchRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'Overdue' });
    expect(patchRes.status).toBe(409);
    expect(patchRes.body.error_code).toBe('INVALID_STATUS_TRANSITION');
  });

  it('requires_approval:true enforces the approval leg of the state machine; task_status_history has exactly 4 rows in order', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const createRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: `Approval Required Task ${Date.now()}`,
        owner_id: testUserId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
        requires_approval: true,
      });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.id;

    // Open -> Done directly is rejected (requires_approval:true forbids
    // the In progress -> Done edge, but this is still Open -> Done which
    // isn't even a valid edge at all regardless of requires_approval).
    const directDoneRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'Done' });
    expect(directDoneRes.status).toBe(409);

    const toInProgressRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'In progress' });
    expect(toInProgressRes.status).toBe(200);

    // In progress -> Done is rejected when requires_approval:true (must
    // pass through Awaiting approval first).
    const inProgressToDoneRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'Done' });
    expect(inProgressToDoneRes.status).toBe(409);

    const toAwaitingApprovalRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'Awaiting approval' });
    expect(toAwaitingApprovalRes.status).toBe(200);

    const toDoneRes = await request(app.server)
      .patch(`/api/v1/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ new_status: 'Done' });
    expect(toDoneRes.status).toBe(200);
    expect(toDoneRes.body.status).toBe('Done');

    const historyRows = await query<{ from_status: string | null; to_status: string }>(
      `SELECT from_status, to_status FROM task_status_history WHERE task_id = $1 ORDER BY changed_at ASC`,
      [taskId],
    );
    expect(historyRows).toHaveLength(4);
    expect(historyRows[0]).toEqual({ from_status: null, to_status: 'Open' });
    expect(historyRows[1]).toEqual({ from_status: 'Open', to_status: 'In progress' });
    expect(historyRows[2]).toEqual({ from_status: 'In progress', to_status: 'Awaiting approval' });
    expect(historyRows[3]).toEqual({ from_status: 'Awaiting approval', to_status: 'Done' });
  });
});
