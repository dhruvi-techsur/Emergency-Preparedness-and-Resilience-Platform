import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as field-reports.test.ts/tasks.test.ts.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set; `npm run seed` already run against this same
// database (this suite mints tokens for REAL seeded roles, not test-local
// permission grants, so Task 2's seed.ts 'approve' fix is actually
// exercised — not bypassed by a throwaway test fixture).

let testJurisdictionId: string;

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

// Mints a session token for a user whose role_id is one of the REAL
// persona roles (incident_commander, planning_logistics_chief, ...) seeded
// by scripts/seed.ts — proving this plan's seeded role_permissions grants
// genuinely authorize the correct role, not a test-scoped role_permissions
// row that would bypass the real seed entirely. Same pattern
// field-reports.test.ts's mintTokenForSeededRole establishes.
async function mintTokenForSeededRole(roleName: string, jurisdictionId: string): Promise<string> {
  const roleRows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [roleName]);
  const roleId = roleRows[0]?.id;
  expect(roleId, `Seeded role '${roleName}' must exist — run npm run seed first`).toBeTruthy();

  const email = `ics-forms-test-${roleName}-${Date.now()}-${Math.random()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, `Test ${roleName}`, roleId, [jurisdictionId]],
  );

  return mintSessionToken({
    id: inserted[0].id,
    role_id: roleId,
    jurisdiction_scope: [jurisdictionId],
  });
}

async function createTestIncident(token: string, jurisdictionId: string): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `ICS Forms Test Incident ${Date.now()}-${Math.random()}`,
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
  testJurisdictionId = await findOrCreateJurisdiction('ICS Forms Test Jurisdiction');

  // Re-sync OPA's data document with whatever role_permissions rows exist
  // right now (including this plan's own seed.ts 'approve' grant, assuming
  // `npm run seed` already ran per this file's own <verify> block) —
  // mirrors every other integration test's beforeAll in this codebase.
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops ics-forms routes (F9 AI governance + F1 approval)', () => {
  it('a user with the SEEDED incident_commander role can create a Draft ICS form (201) via POST /api/v1/incidents/{id}/ics-forms', async () => {
    const commanderToken = await mintTokenForSeededRole('incident_commander', testJurisdictionId);
    const incidentId = await createTestIncident(commanderToken, testJurisdictionId);

    const res = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ form_type: 'ICS-201', content: { narrative: 'draft text' } });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('Draft');
    expect(res.body.incident_id).toBe(incidentId);

    (globalThis as { __icsIncidentId?: string }).__icsIncidentId = incidentId;
    (globalThis as { __icsFormId?: string }).__icsFormId = res.body.id;
    (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken = commanderToken;
  });

  it('POST .../approve with NO approved_by returns 403 APPROVAL_REQUIRES_NAMED_USER; the form stays Draft', async () => {
    const incidentId = (globalThis as { __icsIncidentId?: string }).__icsIncidentId!;
    const formId = (globalThis as { __icsFormId?: string }).__icsFormId!;
    const commanderToken = (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken!;

    const res = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms/${formId}/approve`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('APPROVAL_REQUIRES_NAMED_USER');

    const rows = await query<{ status: string }>(`SELECT status FROM ics_forms WHERE id = $1`, [formId]);
    expect(rows[0].status).toBe('Draft');
  });

  it('POST .../approve with a valid approved_by matching the signed-in user succeeds (200), status becomes Approved, and exactly one Timeline entry is written', async () => {
    const incidentId = (globalThis as { __icsIncidentId?: string }).__icsIncidentId!;
    const formId = (globalThis as { __icsFormId?: string }).__icsFormId!;
    const commanderToken = (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken!;

    // Resolve this token's own user id (the body's approved_by must equal
    // it — re-verified server-side, never trusted bare from the client).
    const meRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${commanderToken}`);
    expect(meRes.status).toBe(200);
    const approverId = meRes.body.id;

    const approveRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms/${formId}/approve`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ approved_by: approverId });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('Approved');
    expect(approveRes.body.approved_at).toBeTruthy();

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${commanderToken}`);
    expect(timelineRes.status).toBe(200);
    const approvalEntries = timelineRes.body.items.filter((i: { title: string }) =>
      i.title.toLowerCase().includes('ics form approved'),
    );
    expect(approvalEntries).toHaveLength(1);
    expect(approvalEntries[0].actor).toBeTruthy();
  });

  it('approving an ai_origin:true form whose linked ai_drafts row has NO approved_by returns 400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED', async () => {
    const incidentId = (globalThis as { __icsIncidentId?: string }).__icsIncidentId!;
    const commanderToken = (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken!;

    const meRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${commanderToken}`);
    const approverId = meRes.body.id;

    // Unapproved ai_drafts row (action/approved_by both NULL).
    const draftRows = await query<{ id: string }>(
      `INSERT INTO ai_drafts (target_feature, target_field, draft_text, sources, confidence_label, requesting_user_id)
       VALUES ('ics_form', 'narrative', 'AI-drafted narrative text', '["NWS feed"]', 'High', $1)
       RETURNING id`,
      [approverId],
    );
    const aiDraftId = draftRows[0].id;

    const createRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        form_type: 'ICS-201',
        content: { narrative: 'AI-drafted narrative text' },
        ai_origin: true,
        ai_draft_id: aiDraftId,
      });
    expect(createRes.status).toBe(201);
    const aiFormId = createRes.body.id;

    const approveRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms/${aiFormId}/approve`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ approved_by: approverId });

    expect(approveRes.status).toBe(400);
    expect(approveRes.body.error_code).toBe('AIDRAFT_UNAPPROVED_WRITE_BLOCKED');

    (globalThis as { __icsAiFormId?: string }).__icsAiFormId = aiFormId;
    (globalThis as { __icsAiDraftId?: string }).__icsAiDraftId = aiDraftId;
  });

  it('once the linked ai_drafts row is approved, retrying POST .../approve on the SAME ics_form now succeeds (200) — proving the real incident_commander-role identity reaches the shared guard end-to-end', async () => {
    const incidentId = (globalThis as { __icsIncidentId?: string }).__icsIncidentId!;
    const commanderToken = (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken!;
    const aiFormId = (globalThis as { __icsAiFormId?: string }).__icsAiFormId!;
    const aiDraftId = (globalThis as { __icsAiDraftId?: string }).__icsAiDraftId!;

    const meRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${commanderToken}`);
    const approverId = meRes.body.id;

    await pool.query(`UPDATE ai_drafts SET action='approve', approved_by=$1, approved_at=now() WHERE id=$2`, [
      approverId,
      aiDraftId,
    ]);

    const approveRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms/${aiFormId}/approve`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ approved_by: approverId });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('Approved');
  });

  it('a user with the SEEDED planning_logistics_chief role (view-only on incidents) is DENIED (403) on POST .../approve — the view-only grant correctly still cannot approve', async () => {
    const incidentId = (globalThis as { __icsIncidentId?: string }).__icsIncidentId!;
    const formId = (globalThis as { __icsFormId?: string }).__icsFormId!;

    const planningChiefToken = await mintTokenForSeededRole('planning_logistics_chief', testJurisdictionId);

    const meRes = await request(app.server)
      .get('/api/v1/me')
      .set('Authorization', `Bearer ${planningChiefToken}`);
    expect(meRes.status).toBe(200);

    const approveRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/ics-forms/${formId}/approve`)
      .set('Authorization', `Bearer ${planningChiefToken}`)
      .send({ approved_by: meRes.body.id });

    // OPA denies before the route body logic even runs — view-only on
    // 'incidents' holds no 'approve' action per seed.ts's UNCHANGED
    // incidentsViewOnlyRoles block.
    expect(approveRes.status).toBe(403);
  });

  it('GET /api/v1/dashboard/summary returns all four DashboardSummary fields, active_incidents matching a real COUNT, and the two Phase-3/4-gap fields at their documented values', async () => {
    const commanderToken = (globalThis as { __icsCommanderToken?: string }).__icsCommanderToken!;

    const res = await request(app.server)
      .get('/api/v1/dashboard/summary')
      .set('Authorization', `Bearer ${commanderToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('active_incidents');
    expect(res.body).toHaveProperty('open_tasks');
    expect(res.body).toHaveProperty('pending_resource_requests');
    expect(res.body).toHaveProperty('notifications_pending_ack');
    expect(typeof res.body.active_incidents).toBe('number');
    expect(res.body.active_incidents).toBeGreaterThan(0);

    const directCountRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM incidents WHERE status = 'Open' AND jurisdiction_id = $1`,
      [testJurisdictionId],
    );
    expect(res.body.active_incidents).toBe(parseInt(directCountRows[0].count, 10));

    // notifications_pending_ack is a documented structural zero (no
    // per-recipient user_id column in this schema) — always 0, never a
    // guess at data this schema cannot answer.
    expect(res.body.notifications_pending_ack).toBe(0);
  });
});
