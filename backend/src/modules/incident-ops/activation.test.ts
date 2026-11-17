import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 02-01's incidents.test.ts. Requires: docker compose up -d db
// opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;
let secondPersonId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for activation.test.ts'],
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
      name: `Activation Test Incident ${Date.now()}-${Math.random()}`,
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

  testJurisdictionId = await findOrCreateJurisdiction('Activation Test Jurisdiction');
  testRoleId = await findOrCreateRole('activation_test_role', 'PER-02');

  const existingPerm = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [testRoleId, 'incidents'],
  );
  if (!existingPerm[0]) {
    await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
      testRoleId,
      'incidents',
      ['view', 'create', 'edit'],
    ]);
  } else {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
      ['view', 'create', 'edit'],
      existingPerm[0].id,
    ]);
  }

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `activation-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Activation Test Commander', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;

  const secondEmail = `activation-test-second-${Date.now()}@epmp.local`;
  const insertedSecond = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [secondEmail, 'Activation Test Second Commander', testRoleId, [testJurisdictionId]],
  );
  secondPersonId = insertedSecond[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops activation / command-roles / closure routes', () => {
  it('runs the full state-machine sequence: commander gate, confirmation gate, reassignment, closure', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    // 1. Activation above Monitoring with zero command roles assigned ->
    // 422 NO_COMMANDER_ASSIGNED, activation_level unchanged.
    const blockedRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/activation`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activation_level: 'Full', confirmed: true });
    expect(blockedRes.status).toBe(422);
    expect(blockedRes.body.error_code).toBe('NO_COMMANDER_ASSIGNED');

    const afterBlockedRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(afterBlockedRes.body.activation_level).toBe('Monitoring');

    // 2. Assign an Incident Commander; retry activation -> 200, Full.
    const assignRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/command-roles`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role_title: 'Incident Commander', person_id: testUserId });
    expect(assignRes.status).toBe(201);
    expect(assignRes.body.person.id).toBe(testUserId);

    const activateRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/activation`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activation_level: 'Full', confirmed: true });
    expect(activateRes.status).toBe(200);
    expect(activateRes.body.activation_level).toBe('Full');

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    expect(timelineRes.body.items).toHaveLength(3);
    for (const entry of timelineRes.body.items) {
      expect(entry.actor).not.toBeNull();
    }
    const titles = timelineRes.body.items.map((i: { title: string }) => i.title);
    expect(titles).toContain('Incident created');
    expect(titles).toContain('Incident Commander assigned to Activation Test Commander');
    expect(titles).toContain('Activation changed to Full');

    // 3. Activation request with NO confirmed field -> 400, activation_level
    // unchanged (still Full from step 2's successful call).
    const unconfirmedRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/activation`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activation_level: 'Full' });
    expect(unconfirmedRes.status).toBe(400);

    const afterUnconfirmedRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(afterUnconfirmedRes.body.activation_level).toBe('Full');

    // 4. Reassign the Incident Commander to a second person; prior
    // assignment's unassigned_at is now non-null, and a new Timeline entry
    // mentions the reassignment.
    const reassignRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/command-roles`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role_title: 'Incident Commander', person_id: secondPersonId });
    expect(reassignRes.status).toBe(201);
    expect(reassignRes.body.person.id).toBe(secondPersonId);

    const priorAssignmentRows = await query<{ unassigned_at: string | null }>(
      `SELECT unassigned_at FROM incident_command_roles
       WHERE incident_id = $1 AND role_title = 'Incident Commander' AND person_id = $2`,
      [incidentId, testUserId],
    );
    expect(priorAssignmentRows[0]?.unassigned_at).not.toBeNull();

    const timelineAfterReassignRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    const reassignTitles = timelineAfterReassignRes.body.items.map((i: { title: string }) => i.title);
    expect(reassignTitles).toContain('Incident Commander assigned to Activation Test Second Commander');
    const reassignEntry = timelineAfterReassignRes.body.items.find(
      (i: { title: string }) => i.title === 'Incident Commander assigned to Activation Test Second Commander',
    );
    expect(reassignEntry.meta).toContain('Reassigned from Activation Test Commander');

    // 5. Close the incident; status === 'Closed' and an "Incident closed"
    // Timeline entry exists.
    const closeRes = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/closure`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmed: true });
    expect(closeRes.status).toBe(200);
    expect(closeRes.body.status).toBe('Closed');

    const timelineAfterCloseRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    const closeTitles = timelineAfterCloseRes.body.items.map((i: { title: string }) => i.title);
    expect(closeTitles).toContain('Incident closed');
  });

  it('reassigning the same person twice is a no-op, not a duplicate Timeline entry', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    const firstAssign = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/command-roles`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role_title: 'Planning', person_id: testUserId });
    expect(firstAssign.status).toBe(201);

    const secondAssign = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/command-roles`)
      .set('Authorization', `Bearer ${token}`)
      .send({ role_title: 'Planning', person_id: testUserId });
    expect(secondAssign.status).toBe(201);

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    const planningEntries = timelineRes.body.items.filter((i: { title: string }) =>
      i.title.startsWith('Planning assigned to'),
    );
    expect(planningEntries).toHaveLength(1);
  });

  it('jurisdiction-scope isolation: a caller cannot activate, assign command roles on, or close an incident outside their own jurisdiction_scope (W1 fix)', async () => {
    const otherJurisdictionId = await findOrCreateJurisdiction('Activation Test Jurisdiction (Other)');

    const otherEmail = `activation-test-other-${Date.now()}@epmp.local`;
    const otherUserRows = await query<{ id: string }>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
      [otherEmail, 'Activation Test Other User', testRoleId, [otherJurisdictionId]],
    );
    const otherToken = await mintSessionToken({
      id: otherUserRows[0].id,
      role_id: testRoleId,
      jurisdiction_scope: [otherJurisdictionId],
    });
    const otherIncidentId = await createTestIncident(otherToken, otherJurisdictionId);

    const ownToken = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const activationRes = await request(app.server)
      .post(`/api/v1/incidents/${otherIncidentId}/activation`)
      .set('Authorization', `Bearer ${ownToken}`)
      .send({ activation_level: 'Full', confirmed: true });
    expect(activationRes.status).toBe(404);
    expect(activationRes.body.error_code).toBe('INCIDENT_NOT_FOUND');

    const commandRoleRes = await request(app.server)
      .post(`/api/v1/incidents/${otherIncidentId}/command-roles`)
      .set('Authorization', `Bearer ${ownToken}`)
      .send({ role_title: 'Incident Commander', person_id: testUserId });
    expect(commandRoleRes.status).toBe(404);
    expect(commandRoleRes.body.error_code).toBe('INCIDENT_NOT_FOUND');

    const closureRes = await request(app.server)
      .post(`/api/v1/incidents/${otherIncidentId}/closure`)
      .set('Authorization', `Bearer ${ownToken}`)
      .send({ confirmed: true });
    expect(closureRes.status).toBe(404);
    expect(closureRes.body.error_code).toBe('INCIDENT_NOT_FOUND');

    // Sanity: the other jurisdiction's own caller can still act on it.
    const legitActivationRes = await request(app.server)
      .post(`/api/v1/incidents/${otherIncidentId}/activation`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ activation_level: 'Monitoring', confirmed: true });
    expect(legitActivationRes.status).toBe(200);
  });

  it('closing an already-closed incident returns 409', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId);

    const firstClose = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/closure`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmed: true });
    expect(firstClose.status).toBe(200);

    const secondClose = await request(app.server)
      .post(`/api/v1/incidents/${incidentId}/closure`)
      .set('Authorization', `Bearer ${token}`)
      .send({ confirmed: true });
    expect(secondClose.status).toBe(409);
  });
});
