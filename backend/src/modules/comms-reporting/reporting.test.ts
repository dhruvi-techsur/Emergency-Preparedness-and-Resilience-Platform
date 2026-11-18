import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 04-01's notifications.test.ts. Requires:
// docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET
// set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;
let testToken: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for reporting.test.ts'],
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
      name: `Reporting Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

async function closeIncident(token: string, incidentId: string) {
  const res = await request(app.server)
    .post(`/api/v1/incidents/${incidentId}/closure`)
    .set('Authorization', `Bearer ${token}`)
    .send({ confirmed: true });
  expect(res.status).toBe(200);
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Reporting Test Jurisdiction');
  testRoleId = await findOrCreateRole('reporting_test_role', 'PER-03');

  // Grant incidents (for the incident-creation/closure helpers above) and
  // the reporting feature-permission (view/create/edit) this plan's own
  // routes are gated on.
  const grants: Array<[string, string[]]> = [
    ['incidents', ['view', 'create', 'edit']],
    ['tasks', ['view', 'create', 'edit']],
    ['resource_requests', ['view', 'create']],
    ['reporting', ['view', 'create', 'edit']],
  ];
  for (const [feature, actions] of grants) {
    const existingPerm = await query<{ id: string }>(
      `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
      [testRoleId, feature],
    );
    if (!existingPerm[0]) {
      await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
        testRoleId,
        feature,
        actions,
      ]);
    } else {
      await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existingPerm[0].id]);
    }
  }

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `reporting-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Reporting Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;

  testToken = await mintSessionToken({
    id: testUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('comms-reporting reporting module — SITREP/AAR auto-assembly, evidence log, analytics', () => {
  it('POST .../sitreps with ONLY incident_id auto-assembles non-empty task_status_counts (zero manual re-entry)', async () => {
    const incidentId = await createTestIncident(testToken, testJurisdictionId);

    // Create a task against this incident so task_status_counts has at
    // least one real entry to assert on.
    const taskRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'Reporting test task',
        owner_id: testUserId,
        incident_id: incidentId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
      });
    expect(taskRes.status).toBe(201);

    const sitrepRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/sitreps`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({});
    expect(sitrepRes.status).toBe(201);
    expect(sitrepRes.body.content.task_status_counts).toBeTruthy();
    expect(Object.keys(sitrepRes.body.content.task_status_counts).length).toBeGreaterThan(0);
    expect(sitrepRes.body.content.task_status_counts.Open).toBe(1);
  });

  it('POST .../aar on a STILL-OPEN incident returns 409 INCIDENT_NOT_CLOSED and inserts no row; succeeds after closure', async () => {
    const incidentId = await createTestIncident(testToken, testJurisdictionId);

    const countBefore = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM aars`);

    const blockedRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/aar`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ findings: [] });
    expect(blockedRes.status).toBe(409);
    expect(blockedRes.body.error_code).toBe('INCIDENT_NOT_CLOSED');

    const countAfter = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM aars`);
    expect(countAfter[0].count).toBe(countBefore[0].count);

    await closeIncident(testToken, incidentId);

    const okRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/aar`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ findings: [] });
    expect(okRes.status).toBe(201);
    expect(okRes.body.status).toBe('Draft');
  });

  it('POST .../aar with an unowned corrective action returns 422 CORRECTIVE_ACTION_UNOWNED and inserts no finding rows', async () => {
    const incidentId = await createTestIncident(testToken, testJurisdictionId);
    await closeIncident(testToken, incidentId);

    const countBefore = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM aar_findings`);

    const res = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/aar`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        findings: [
          {
            text: 'Response delayed due to comms outage',
            corrective_action: 'Install backup radio repeater',
            // owner_id/due_date both omitted -> must be rejected.
          },
        ],
      });
    expect(res.status).toBe(422);
    expect(res.body.error_code).toBe('CORRECTIVE_ACTION_UNOWNED');

    const countAfter = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM aar_findings`);
    expect(countAfter[0].count).toBe(countBefore[0].count);
  });

  it('PATCH .../finalize succeeds once then rejects a second finalize with 403 DOCUMENT_IMMUTABLE', async () => {
    const incidentId = await createTestIncident(testToken, testJurisdictionId);
    await closeIncident(testToken, incidentId);

    const aarRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/aar`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        findings: [
          {
            text: 'Fully-owned finding',
            corrective_action: 'Update the SOP',
            owner_id: testUserId,
            due_date: '2027-01-01',
          },
        ],
      });
    expect(aarRes.status).toBe(201);
    const aarId = aarRes.body.id;

    const finalizeRes = await request(app.server)
      .patch(`/api/v1/incidents/${incidentId}/aar/${aarId}/finalize`)
      .set('Authorization', `Bearer ${testToken}`)
      .send();
    expect(finalizeRes.status).toBe(200);
    expect(finalizeRes.body.status).toBe('Finalized');

    const secondFinalizeRes = await request(app.server)
      .patch(`/api/v1/incidents/${incidentId}/aar/${aarId}/finalize`)
      .set('Authorization', `Bearer ${testToken}`)
      .send();
    expect(secondFinalizeRes.status).toBe(403);
    expect(secondFinalizeRes.body.error_code).toBe('DOCUMENT_IMMUTABLE');
  });

  it('GET /api/v1/evidence-log returns entries from BOTH audit_log- and incident_timeline-sourced rows; PATCH is unconditionally 403', async () => {
    const incidentId = await createTestIncident(testToken, testJurisdictionId);
    await closeIncident(testToken, incidentId);
    const aarRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/aar`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ findings: [] });
    const aarId = aarRes.body.id;
    await request(app.server)
      .patch(`/api/v1/incidents/${incidentId}/aar/${aarId}/finalize`)
      .set('Authorization', `Bearer ${testToken}`)
      .send();
    // ^ writes an audit_log row ('aar_finalized') AND the incident's own
    // 'Incident closed' / 'Incident created' Timeline rows already exist
    // from createTestIncident/closeIncident above — both source tables
    // have at least one known fixture row for this test's own actor.

    const logRes = await request(app.server)
      .get('/api/v1/evidence-log')
      .query({ actor_id: testUserId, page_size: '200' })
      .set('Authorization', `Bearer ${testToken}`);
    expect(logRes.status).toBe(200);
    const sources = new Set(logRes.body.items.map((item: { source_table: string }) => item.source_table));
    expect(sources.has('audit_log')).toBe(true);
    expect(sources.has('incident_timeline')).toBe(true);

    const patchRes = await request(app.server)
      .patch('/api/v1/evidence-log')
      .set('Authorization', `Bearer ${testToken}`)
      .send();
    expect(patchRes.status).toBe(403);
    expect(patchRes.body.error_code).toBe('EVIDENCE_LOG_IMMUTABLE');
  });

  it('GET /api/v1/analytics/kpis returns exactly 3 KPI entries, none of which include a target key', async () => {
    const res = await request(app.server)
      .get('/api/v1/analytics/kpis')
      .query({ date_range: '1970-01-01,2099-01-01' })
      .set('Authorization', `Bearer ${testToken}`);
    expect(res.status).toBe(200);
    expect(res.body.kpis).toHaveLength(3);
    for (const kpi of res.body.kpis) {
      expect('target' in kpi).toBe(false);
    }
  });
});
