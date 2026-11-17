import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 01-03's routes.test.ts.
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
    [name, personaId, 'Test role for incidents.test.ts'],
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

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Incidents Test Jurisdiction');
  testRoleId = await findOrCreateRole('incidents_test_role', 'PER-02');

  // Seed role_permissions for the test role: incidents:view/create/edit
  // (required by requirePermission('incidents', <action>) on every route
  // under test).
  const existingPerm = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [testRoleId, 'incidents'],
  );
  if (!existingPerm[0]) {
    await query(
      `INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`,
      [testRoleId, 'incidents', ['view', 'create', 'edit']],
    );
  } else {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
      ['view', 'create', 'edit'],
      existingPerm[0].id,
    ]);
  }

  // Sync role_permissions to OPA's data document so checkPermission resolves.
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  // Seed the test user directly (bypassing SSO/Keycloak, out of scope per plan).
  const email = `incidents-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Incidents Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops incidents routes', () => {
  it('POST /api/v1/incidents creates an incident and writes exactly one Timeline entry', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const createRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Timeline Check Incident ${Date.now()}`,
        type: 'Flood',
        severity: 'Normal',
        jurisdiction_id: testJurisdictionId,
        opened_at: new Date().toISOString(),
      });

    expect(createRes.status).toBe(201);
    const incidentId = createRes.body.id;
    expect(incidentId).toBeTruthy();

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);

    expect(timelineRes.status).toBe(200);
    expect(timelineRes.body.items).toHaveLength(1);
    expect(timelineRes.body.items[0].title).toBe('Incident created');
    expect(timelineRes.body.items[0].actor).not.toBeNull();
    expect(timelineRes.body.items[0].source).toBe('EPMP');
  });

  it('a same-name/same-jurisdiction duplicate within 24h returns 409, then confirmed_duplicate:true creates it anyway', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const name = `Duplicate Check Incident ${Date.now()}`;
    const body = {
      name,
      type: 'Wildfire' as const,
      severity: 'Elevated' as const,
      jurisdiction_id: testJurisdictionId,
      opened_at: new Date().toISOString(),
    };

    const firstRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(firstRes.status).toBe(201);

    const secondRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send(body);
    expect(secondRes.status).toBe(409);
    expect(secondRes.body.error_code).toBe('INCIDENT_POSSIBLE_DUPLICATE');

    const thirdRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...body, confirmed_duplicate: true });
    expect(thirdRes.status).toBe(201);
    expect(thirdRes.body.id).not.toBe(firstRes.body.id);
  });

  it('GET /api/v1/incidents?severity=Critical returns only matching rows from a mixed-severity seed', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const suffix = Date.now();
    const severities = ['Critical', 'Normal', 'Watch'] as const;
    for (const severity of severities) {
      const res = await request(app.server)
        .post('/api/v1/incidents')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: `Severity Filter ${severity} ${suffix}`,
          type: 'Other',
          severity,
          jurisdiction_id: testJurisdictionId,
          opened_at: new Date().toISOString(),
        });
      expect(res.status).toBe(201);
    }

    const listRes = await request(app.server)
      .get('/api/v1/incidents')
      .query({ severity: 'Critical', page_size: 100 })
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    const names = listRes.body.items.map((i: { name: string }) => i.name);
    expect(names).toContain(`Severity Filter Critical ${suffix}`);
    expect(names).not.toContain(`Severity Filter Normal ${suffix}`);
    expect(names).not.toContain(`Severity Filter Watch ${suffix}`);
    expect(
      listRes.body.items.every((i: { severity: string }) => i.severity === 'Critical'),
    ).toBe(true);
  });

  it('jurisdiction-scope isolation: a caller scoped to jurisdiction A cannot read, list, or edit an incident in jurisdiction B (W1 fix)', async () => {
    const otherJurisdictionId = await findOrCreateJurisdiction('Incidents Test Jurisdiction (Other)');

    const ownToken = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    // Create an incident scoped to the OTHER jurisdiction using a second
    // user whose own scope includes it (bypassing the own-scope caller
    // entirely, so this doesn't depend on POST's own scoping).
    const otherEmail = `incidents-test-other-${Date.now()}@epmp.local`;
    const otherUserRows = await query<{ id: string }>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
      [otherEmail, 'Incidents Test Other User', testRoleId, [otherJurisdictionId]],
    );
    const otherToken = await mintSessionToken({
      id: otherUserRows[0].id,
      role_id: testRoleId,
      jurisdiction_scope: [otherJurisdictionId],
    });
    const createRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${otherToken}`)
      .send({
        name: `Other-Jurisdiction Incident ${Date.now()}`,
        type: 'Flood',
        severity: 'Normal',
        jurisdiction_id: otherJurisdictionId,
        opened_at: new Date().toISOString(),
      });
    expect(createRes.status).toBe(201);
    const otherIncidentId = createRes.body.id;

    // GET detail by id -> 404, not 200 with someone else's data.
    const getRes = await request(app.server)
      .get(`/api/v1/incidents/${otherIncidentId}`)
      .set('Authorization', `Bearer ${ownToken}`);
    expect(getRes.status).toBe(404);
    expect(getRes.body.error_code).toBe('INCIDENT_NOT_FOUND');

    // List -> does not include the other jurisdiction's incident.
    const listRes = await request(app.server)
      .get('/api/v1/incidents')
      .query({ page_size: 100 })
      .set('Authorization', `Bearer ${ownToken}`);
    expect(listRes.status).toBe(200);
    const ids = listRes.body.items.map((i: { id: string }) => i.id);
    expect(ids).not.toContain(otherIncidentId);

    // PATCH -> 404, update does not leak through.
    const patchRes = await request(app.server)
      .patch(`/api/v1/incidents/${otherIncidentId}`)
      .set('Authorization', `Bearer ${ownToken}`)
      .send({ name: 'Should not apply' });
    expect(patchRes.status).toBe(404);

    // Timeline -> 404, not an accidental leak of another jurisdiction's
    // Timeline entries.
    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${otherIncidentId}/timeline`)
      .set('Authorization', `Bearer ${ownToken}`);
    expect(timelineRes.status).toBe(404);
  });

  it('a direct UPDATE against incident_timeline throws the append-only exception, proving the trigger is live', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const createRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: `Immutability Check Incident ${Date.now()}`,
        type: 'HazMat',
        severity: 'Watch',
        jurisdiction_id: testJurisdictionId,
        opened_at: new Date().toISOString(),
      });
    expect(createRes.status).toBe(201);

    await expect(
      query(`UPDATE incident_timeline SET title = 'tampered' WHERE incident_id = $1`, [createRes.body.id]),
    ).rejects.toThrow(/append-only/);
  });
});

// 03-07: proves the real seed script's role_permissions grants for
// plans/tasks/resource_requests actually authorize real requests end-to-end
// through OPA — not just that the rows exist in the database. Deliberately
// does NOT insert any custom test-only role_permissions row for these three
// features: every permission check below resolves against whatever
// `backend/scripts/seed.ts` itself already wrote for the FRD-named roles
// (incident_commander, planning_logistics_chief, field_responder). This
// file's `npm run seed` must have already run against the same database
// this test suite connects to (see this plan's own <verify> block, which
// runs `npm run seed` immediately before `vitest run` for exactly this
// reason) — if it hasn't, `findSeededRoleId` below throws a clear error
// rather than silently creating a throwaway role that would make this test
// pass for the wrong reason.
describe('03-07: seeded role_permissions grants authorize real requests end-to-end', () => {
  let seededJurisdictionId: string;
  let commanderRoleId: string;
  let logisticsRoleId: string;
  let fieldResponderRoleId: string;
  let commanderUserId: string;
  let logisticsUserId: string;
  let fieldResponderUserId: string;

  async function findSeededRoleId(name: string): Promise<string> {
    const rows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
    if (!rows[0]) {
      throw new Error(
        `Role '${name}' not found — this test requires 'npm run seed' to have already run ` +
          `against this database (per this plan's own <verify> block), so the REAL seeded ` +
          `role_permissions grants from backend/scripts/seed.ts can be exercised end-to-end.`,
      );
    }
    return rows[0].id;
  }

  async function createSeededRoleTestUser(roleId: string, label: string): Promise<string> {
    const email = `seed-perm-test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@epmp.local`;
    const inserted = await query<{ id: string }>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
      [email, `Seed Perm Test ${label}`, roleId, [seededJurisdictionId]],
    );
    return inserted[0].id;
  }

  beforeAll(async () => {
    seededJurisdictionId = await findOrCreateJurisdiction('Seed Permissions Test Jurisdiction');

    commanderRoleId = await findSeededRoleId('incident_commander');
    logisticsRoleId = await findSeededRoleId('planning_logistics_chief');
    fieldResponderRoleId = await findSeededRoleId('field_responder');

    // Re-sync the FULL current role_permissions table to OPA's data
    // document — OPA's data starts EMPTY on every container boot
    // (server.ts's own startup-sync docstring), so a test run against a
    // freshly-started OPA container would fail-closed on every check
    // without this, exactly the gap server.ts's start() fixes for a real
    // boot. This is a re-sync of REAL rows already written by `npm run
    // seed`, not an insertion of new test-only grants.
    const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
      `SELECT role_id, feature, actions FROM role_permissions`,
    );
    await syncRolePermissionsToOpa(allPerms);

    commanderUserId = await createSeededRoleTestUser(commanderRoleId, 'commander');
    logisticsUserId = await createSeededRoleTestUser(logisticsRoleId, 'logistics');
    fieldResponderUserId = await createSeededRoleTestUser(fieldResponderRoleId, 'field-responder');
  });

  it("incident_commander's seeded 'tasks' grant authorizes a real POST /api/v1/tasks (201)", async () => {
    const commanderToken = await mintSessionToken({
      id: commanderUserId,
      role_id: commanderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    // incident_commander's seeded 'incidents' grant includes 'create',
    // needed only to set up a target incident for the task — the
    // assertion under test is the 'tasks' grant on the POST below.
    const incidentRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        name: `Seed Perm Test Incident ${Date.now()}`,
        type: 'Flood',
        severity: 'Normal',
        jurisdiction_id: seededJurisdictionId,
        opened_at: new Date().toISOString(),
      });
    expect(incidentRes.status).toBe(201);

    const taskRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        title: `Seed Perm Test Task ${Date.now()}`,
        owner_id: commanderUserId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
        incident_id: incidentRes.body.id,
      });
    expect(taskRes.status).toBe(201);
  });

  it("planning_logistics_chief's seeded 'resource_requests' approve grant authorizes POST .../approve on a DIFFERENT user's request (200, not 403)", async () => {
    const commanderToken = await mintSessionToken({
      id: commanderUserId,
      role_id: commanderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });
    const logisticsToken = await mintSessionToken({
      id: logisticsUserId,
      role_id: logisticsRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    // incident_commander creates the incident and the resource request
    // (its seeded grant includes resource_requests:create, but NOT
    // :approve — asserted implicitly by the fact the approval below must
    // come from the logistics user instead).
    const incidentRes = await request(app.server)
      .post('/api/v1/incidents')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        name: `Seed Perm Test Incident (RR) ${Date.now()}`,
        type: 'Wildfire',
        severity: 'Elevated',
        jurisdiction_id: seededJurisdictionId,
        opened_at: new Date().toISOString(),
      });
    expect(incidentRes.status).toBe(201);

    const createRrRes = await request(app.server)
      .post('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        resource_type: 'Equipment',
        description: 'Seed-permission-test generators',
        quantity: 1,
        incident_id: incidentRes.body.id,
        needed_by: new Date(Date.now() + 86_400_000).toISOString(),
        requesting_role: 'Command',
      });
    expect(createRrRes.status).toBe(201);
    expect(createRrRes.body.status).toBe('Awaiting approval');

    // The DIFFERENT user (planning_logistics_chief) approves it — proving
    // the seeded 'approve' action-level grant authorizes this request
    // through real OPA policy evaluation, not a 403.
    const approveRes = await request(app.server)
      .post(`/api/v1/resource-requests/${createRrRes.body.id}/approve`)
      .set('Authorization', `Bearer ${logisticsToken}`)
      .send();
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('Approved');
  });

  it("field_responder's seeded view-only 'tasks' grant permits GET (200) but rejects POST create (403)", async () => {
    const fieldResponderToken = await mintSessionToken({
      id: fieldResponderUserId,
      role_id: fieldResponderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    const getRes = await request(app.server)
      .get('/api/v1/tasks')
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .query({ page_size: 5 });
    expect(getRes.status).toBe(200);

    const createRes = await request(app.server)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .send({
        title: `Field Responder Should Not Create ${Date.now()}`,
        owner_id: fieldResponderUserId,
        due_at: new Date(Date.now() + 3600_000).toISOString(),
      });
    expect(createRes.status).toBe(403);
  });
});
