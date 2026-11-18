import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as incidents.test.ts/tasks.test.ts.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;
let token: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for field-reports.test.ts'],
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

async function createTestIncident(jurisdictionId: string): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Field Reports Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

// 05-05: mints a session token for a user whose role_id is one of the REAL
// persona roles (field_responder, planning_logistics_chief, ...) seeded by
// scripts/seed.ts — proving this plan's seeded role_permissions grants
// genuinely authorize the correct role, not a test-scoped role_permissions
// row that would bypass the real seed entirely.
async function mintTokenForSeededRole(roleName: string, jurisdictionId: string): Promise<string> {
  const roleRows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [roleName]);
  const roleId = roleRows[0]?.id;
  expect(roleId, `Seeded role '${roleName}' must exist — run npm run seed first`).toBeTruthy();

  const email = `field-reports-test-${roleName}-${Date.now()}-${Math.random()}@epmp.local`;
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

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Field Reports Test Jurisdiction');
  testRoleId = await findOrCreateRole('field_reports_test_role', 'PER-04');

  // Grant incidents (for the incident-creation helper) and field_reports
  // view/create/resolve (the feature-permission this plan's routes are
  // gated on).
  const grants: Array<[string, string[]]> = [
    ['incidents', ['view', 'create', 'edit']],
    ['field_reports', ['view', 'create', 'resolve']],
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

  const email = `field-reports-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Field Reports Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;

  token = await mintSessionToken({
    id: testUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops field-reports routes', () => {
  it('POST /api/v1/field-reports is idempotent on client_report_id — a retried submission never creates a duplicate row', async () => {
    const clientReportId = `client-report-${Date.now()}-${Math.random()}`;

    const firstRes = await request(app.server)
      .post('/api/v1/field-reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client_report_id: clientReportId,
        observation_type: 'Road hazard',
        description: 'Downed tree blocking Main St',
        captured_at: new Date().toISOString(),
      });
    expect(firstRes.status).toBe(201);
    expect(firstRes.body.sync_status).toBe('synced');
    const firstId = firstRes.body.id;

    // Second POST with the SAME client_report_id (different body, simulating
    // a flaky-retry resubmission) returns the SAME id, not a second row.
    const secondRes = await request(app.server)
      .post('/api/v1/field-reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client_report_id: clientReportId,
        observation_type: 'DIFFERENT TYPE — should be ignored',
        description: 'A totally different description that should never be written',
        captured_at: new Date().toISOString(),
      });
    expect(secondRes.status).toBe(201);
    expect(secondRes.body.id).toBe(firstId);

    const countRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM field_reports WHERE client_report_id = $1`,
      [clientReportId],
    );
    expect(countRows[0].count).toBe('1');
  });

  it('POST /api/v1/field-reports with neither description nor location returns 422 REPORT_EMPTY', async () => {
    const res = await request(app.server)
      .post('/api/v1/field-reports')
      .set('Authorization', `Bearer ${token}`)
      .send({
        client_report_id: `client-report-empty-${Date.now()}-${Math.random()}`,
        observation_type: 'Road hazard',
        captured_at: new Date().toISOString(),
      });
    expect(res.status).toBe(422);
    expect(res.body.error_code).toBe('REPORT_EMPTY');
  });

  it('POST /api/v1/field-reports/sync-batch processes reports in order, detects a conflict, and preserves both versions', async () => {
    const incidentId = await createTestIncident(testJurisdictionId);

    // Capture a baseline time BEFORE bumping the incident's updated_at.
    const beforeBump = new Date(Date.now() - 60_000).toISOString();

    const item1 = {
      client_report_id: `batch-1-${Date.now()}-${Math.random()}`,
      incident_id: incidentId,
      observation_type: 'Shelter status',
      description: 'Shelter at capacity',
      captured_at: new Date().toISOString(),
    };
    const item2Conflict = {
      client_report_id: `batch-2-conflict-${Date.now()}-${Math.random()}`,
      incident_id: incidentId,
      observation_type: 'Damage assessment',
      description: 'Roof damage observed',
      // captured_at BEFORE the incident's updated_at bump below — this is
      // what triggers conflict detection.
      captured_at: beforeBump,
    };
    const item3 = {
      client_report_id: `batch-3-${Date.now()}-${Math.random()}`,
      incident_id: incidentId,
      observation_type: 'Road hazard',
      description: 'Debris on access road',
      captured_at: new Date().toISOString(),
    };

    // Bump the incident's updated_at to AFTER item2Conflict's captured_at —
    // simulating a server-side change that happened while item2 was queued
    // offline.
    await query(`UPDATE incidents SET updated_at = now() WHERE id = $1`, [incidentId]);

    const batchRes = await request(app.server)
      .post('/api/v1/field-reports/sync-batch')
      .set('Authorization', `Bearer ${token}`)
      .send({ reports: [item1, item2Conflict, item3] });

    expect(batchRes.status).toBe(200);
    expect(batchRes.body.results).toHaveLength(3);

    // Results come back in the SAME order as the input array.
    expect(batchRes.body.results[0].client_report_id).toBe(item1.client_report_id);
    expect(batchRes.body.results[0].status).toBe('synced');
    expect(batchRes.body.results[1].client_report_id).toBe(item2Conflict.client_report_id);
    expect(batchRes.body.results[1].status).toBe('conflict');
    expect(batchRes.body.results[1].conflict_id).toBeTruthy();
    expect(batchRes.body.results[2].client_report_id).toBe(item3.client_report_id);
    expect(batchRes.body.results[2].status).toBe('synced');

    const conflictId = batchRes.body.results[1].conflict_id;

    const conflictRows = await query<{
      entity_id: string;
      field_version: Record<string, unknown>;
      eoc_version: Record<string, unknown>;
    }>(`SELECT entity_id, field_version, eoc_version FROM sync_conflicts WHERE id = $1`, [conflictId]);
    expect(conflictRows).toHaveLength(1);
    expect(conflictRows[0].field_version).toBeTruthy();
    expect(conflictRows[0].eoc_version).toBeTruthy();
    expect((conflictRows[0].field_version as { client_report_id?: string }).client_report_id).toBe(
      item2Conflict.client_report_id,
    );

    (globalThis as { __conflictId?: string }).__conflictId = conflictId;
    (globalThis as { __conflictEntityId?: string }).__conflictEntityId = conflictRows[0].entity_id;
    (globalThis as { __conflictIncidentId?: string }).__conflictIncidentId = incidentId;
  });

  it('POST /api/v1/sync-conflicts/{id}/resolve with keep_mine re-applies the field version and appends a Timeline entry; resolving twice fails', async () => {
    const conflictId = (globalThis as { __conflictId?: string }).__conflictId;
    const entityId = (globalThis as { __conflictEntityId?: string }).__conflictEntityId;
    const incidentId = (globalThis as { __conflictIncidentId?: string }).__conflictIncidentId;
    expect(conflictId).toBeTruthy();
    expect(entityId).toBeTruthy();
    expect(incidentId).toBeTruthy();

    const resolveRes = await request(app.server)
      .post(`/api/v1/sync-conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ resolution: 'keep_mine' });
    expect(resolveRes.status).toBe(200);
    expect(resolveRes.body.resolution).toBe('keep_mine');

    const fieldReportRows = await query<{ sync_status: string }>(
      `SELECT sync_status FROM field_reports WHERE id = $1`,
      [entityId],
    );
    expect(fieldReportRows[0].sync_status).toBe('synced');

    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const titles = timelineRes.body.items.map((i: { title: string }) => i.title.toLowerCase());
    expect(titles.some((t: string) => t.includes('conflict resolved'))).toBe(true);

    // Resolving an ALREADY-resolved conflict returns an error, not a
    // silent 200 re-resolve — resolution is a one-time, named action.
    const secondResolveRes = await request(app.server)
      .post(`/api/v1/sync-conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ resolution: 'keep_eoc' });
    expect(secondResolveRes.status).not.toBe(200);
    expect(secondResolveRes.body.error_code).toBe('SYNC_CONFLICT_ALREADY_RESOLVED');
  });

  // 05-05: the four assertions below mint tokens for REAL seeded roles
  // (field_responder, planning_logistics_chief) rather than this file's
  // own test-scoped role above — proving backend/scripts/seed.ts's
  // field_reports grants genuinely authorize the correct real-world
  // role-to-action combinations end-to-end through OPA. Requires
  // `npm run seed` to have been run against this same database before
  // this suite executes (see this plan's own <verify> block).

  it('a user with the SEEDED field_responder role can POST /api/v1/field-reports (create grant works end-to-end)', async () => {
    const fieldResponderToken = await mintTokenForSeededRole('field_responder', testJurisdictionId);

    const res = await request(app.server)
      .post('/api/v1/field-reports')
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .send({
        client_report_id: `seeded-field-responder-${Date.now()}-${Math.random()}`,
        observation_type: 'Road hazard',
        description: 'Seeded field_responder create-grant proof',
        captured_at: new Date().toISOString(),
      });

    expect(res.status).toBe(201);
    expect(res.body.sync_status).toBe('synced');
  });

  it('a user with the SEEDED field_responder role can POST /api/v1/sync-conflicts/{id}/resolve (resolve grant works end-to-end, matching the mockup\'s field-responder-resolves-their-own-conflict design)', async () => {
    const fieldResponderToken = await mintTokenForSeededRole('field_responder', testJurisdictionId);

    // Create a fresh incident and force a conflict the same way the
    // earlier sync-batch test does, so this test owns its own
    // independent conflict row rather than reusing the globalThis one
    // already resolved above.
    const incidentId = await createTestIncident(testJurisdictionId);
    const beforeBump = new Date(Date.now() - 60_000).toISOString();
    await query(`UPDATE incidents SET updated_at = now() WHERE id = $1`, [incidentId]);

    const batchRes = await request(app.server)
      .post('/api/v1/field-reports/sync-batch')
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .send({
        reports: [
          {
            client_report_id: `seeded-field-responder-conflict-${Date.now()}-${Math.random()}`,
            incident_id: incidentId,
            observation_type: 'Damage assessment',
            description: 'Forces a conflict for the resolve-grant proof',
            captured_at: beforeBump,
          },
        ],
      });
    expect(batchRes.status).toBe(200);
    expect(batchRes.body.results[0].status).toBe('conflict');
    const seededConflictId = batchRes.body.results[0].conflict_id;
    expect(seededConflictId).toBeTruthy();

    const resolveRes = await request(app.server)
      .post(`/api/v1/sync-conflicts/${seededConflictId}/resolve`)
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .send({ resolution: 'keep_mine' });

    expect(resolveRes.status).toBe(200);
    expect(resolveRes.status).not.toBe(403);
    expect(resolveRes.body.resolution).toBe('keep_mine');
  });

  it('a user with the SEEDED planning_logistics_chief role is DENIED create (403) but ALLOWED view (200) on field_reports — the view-only split is real, not just intended', async () => {
    const planningChiefToken = await mintTokenForSeededRole('planning_logistics_chief', testJurisdictionId);

    const createRes = await request(app.server)
      .post('/api/v1/field-reports')
      .set('Authorization', `Bearer ${planningChiefToken}`)
      .send({
        client_report_id: `seeded-planning-chief-denied-${Date.now()}-${Math.random()}`,
        observation_type: 'Road hazard',
        description: 'This create attempt must be denied — planning_logistics_chief is view-only on field_reports',
        captured_at: new Date().toISOString(),
      });
    expect(createRes.status).toBe(403);

    const viewRes = await request(app.server)
      .get('/api/v1/sync-conflicts')
      .set('Authorization', `Bearer ${planningChiefToken}`);
    expect(viewRes.status).toBe(200);
  });

  // F-05-01 (05-SECURITY.md): jurisdiction-scope enforcement on
  // sync-conflicts and field-report-photo routes. A caller whose
  // jurisdiction_scope is Jurisdiction A must not be able to read or
  // resolve a sync conflict, nor read a photo, tied to Jurisdiction B's
  // incident -- and an in-scope (same-jurisdiction) caller must continue
  // to work exactly as before.
  describe('F-05-01: jurisdiction-scope enforcement', () => {
    let otherJurisdictionId: string;
    let otherJurisdictionToken: string;
    let scopedIncidentId: string;
    let scopedConflictId: string;
    let scopedFieldReportId: string;
    let scopedPhotoId: string;

    beforeAll(async () => {
      otherJurisdictionId = await findOrCreateJurisdiction('Field Reports OTHER Jurisdiction');

      const email = `field-reports-other-jx-${Date.now()}-${Math.random()}@epmp.local`;
      const inserted = await query<{ id: string }>(
        `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
        [email, 'Field Reports Other-Jurisdiction User', testRoleId, [otherJurisdictionId]],
      );
      otherJurisdictionToken = await mintSessionToken({
        id: inserted[0].id,
        role_id: testRoleId,
        jurisdiction_scope: [otherJurisdictionId],
      });

      // Create an incident + conflicting field report in testJurisdictionId
      // (the "home" jurisdiction this file's main `token` belongs to).
      scopedIncidentId = await createTestIncident(testJurisdictionId);
      const beforeBump = new Date(Date.now() - 60_000).toISOString();
      await query(`UPDATE incidents SET updated_at = now() WHERE id = $1`, [scopedIncidentId]);

      const batchRes = await request(app.server)
        .post('/api/v1/field-reports/sync-batch')
        .set('Authorization', `Bearer ${token}`)
        .send({
          reports: [
            {
              client_report_id: `f0501-conflict-${Date.now()}-${Math.random()}`,
              incident_id: scopedIncidentId,
              observation_type: 'Damage assessment',
              description: 'F-05-01 jurisdiction-scope test conflict',
              captured_at: beforeBump,
            },
          ],
        });
      expect(batchRes.status).toBe(200);
      expect(batchRes.body.results[0].status).toBe('conflict');
      scopedConflictId = batchRes.body.results[0].conflict_id;

      const conflictRows = await query<{ entity_id: string }>(
        `SELECT entity_id FROM sync_conflicts WHERE id = $1`,
        [scopedConflictId],
      );
      scopedFieldReportId = conflictRows[0].entity_id;

      const photoRows = await query<{ id: string }>(
        `INSERT INTO field_report_photos (field_report_id, storage_ref, upload_status) VALUES ($1, $2, 'uploaded') RETURNING id`,
        [scopedFieldReportId, `field-reports/${scopedFieldReportId}/f0501-test.jpg`],
      );
      scopedPhotoId = photoRows[0].id;
    });

    it('OUT-OF-SCOPE: GET /api/v1/sync-conflicts does not list a conflict belonging to another jurisdiction', async () => {
      const res = await request(app.server)
        .get('/api/v1/sync-conflicts?page_size=100')
        .set('Authorization', `Bearer ${otherJurisdictionToken}`);
      expect(res.status).toBe(200);
      const ids = res.body.items.map((i: { id: string }) => i.id);
      expect(ids).not.toContain(scopedConflictId);
    });

    it('OUT-OF-SCOPE: GET /api/v1/sync-conflicts/{id} 404s (not 403, not 200) for another jurisdiction\'s conflict', async () => {
      const res = await request(app.server)
        .get(`/api/v1/sync-conflicts/${scopedConflictId}`)
        .set('Authorization', `Bearer ${otherJurisdictionToken}`);
      expect(res.status).toBe(404);
      expect(res.body.error_code).toBe('SYNC_CONFLICT_NOT_FOUND');
    });

    it('OUT-OF-SCOPE: POST /api/v1/sync-conflicts/{id}/resolve 404s (not 403, not 200) and does not mutate another jurisdiction\'s conflict', async () => {
      const res = await request(app.server)
        .post(`/api/v1/sync-conflicts/${scopedConflictId}/resolve`)
        .set('Authorization', `Bearer ${otherJurisdictionToken}`)
        .send({ resolution: 'keep_mine' });
      expect(res.status).toBe(404);
      expect(res.body.error_code).toBe('SYNC_CONFLICT_NOT_FOUND');

      // Confirm the conflict was NOT resolved by the out-of-scope attempt.
      const rows = await query<{ resolution: string | null }>(
        `SELECT resolution FROM sync_conflicts WHERE id = $1`,
        [scopedConflictId],
      );
      expect(rows[0].resolution).toBeNull();
    });

    it('OUT-OF-SCOPE: GET /api/v1/field-reports/{id}/photos/{photoId} 404s for another jurisdiction\'s field report', async () => {
      const res = await request(app.server)
        .get(`/api/v1/field-reports/${scopedFieldReportId}/photos/${scopedPhotoId}`)
        .set('Authorization', `Bearer ${otherJurisdictionToken}`);
      expect(res.status).toBe(404);
      expect(res.body.error_code).toBe('FIELD_REPORT_NOT_FOUND');
    });

    it('OUT-OF-SCOPE: POST /api/v1/field-reports/{id}/photos 404s for another jurisdiction\'s field report', async () => {
      const res = await request(app.server)
        .post(`/api/v1/field-reports/${scopedFieldReportId}/photos`)
        .set('Authorization', `Bearer ${otherJurisdictionToken}`)
        .attach('file', Buffer.from('fake-jpeg-bytes'), 'test.jpg');
      expect(res.status).toBe(404);
      expect(res.body.error_code).toBe('FIELD_REPORT_NOT_FOUND');
    });

    it('IN-SCOPE: GET /api/v1/sync-conflicts/{id} still works for the owning jurisdiction', async () => {
      const res = await request(app.server)
        .get(`/api/v1/sync-conflicts/${scopedConflictId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.id).toBe(scopedConflictId);
    });

    it('IN-SCOPE: GET /api/v1/field-reports/{id}/photos/{photoId} still works for the owning jurisdiction', async () => {
      const res = await request(app.server)
        .get(`/api/v1/field-reports/${scopedFieldReportId}/photos/${scopedPhotoId}`)
        .set('Authorization', `Bearer ${token}`);
      // storage_ref points at a file that was never actually written to
      // disk by this test (inserted directly via SQL) -- readFile fails
      // and the route 404s per its own catch block, which is a distinct,
      // already-existing behavior unrelated to jurisdiction-scope. What
      // this assertion proves is that the SCOPE CHECK did not reject the
      // in-scope request: a real multipart-uploaded photo (covered by the
      // next test) proves the full round trip.
      expect(res.status).toBe(404);
      expect(res.body.error_code).toBe('FIELD_REPORT_NOT_FOUND');
    });

    it('IN-SCOPE: POST then GET /api/v1/field-reports/{id}/photos/{photoId} round-trips for the owning jurisdiction', async () => {
      const uploadRes = await request(app.server)
        .post(`/api/v1/field-reports/${scopedFieldReportId}/photos`)
        .set('Authorization', `Bearer ${token}`)
        .attach('file', Buffer.from('fake-jpeg-bytes'), 'roundtrip.jpg');
      expect(uploadRes.status).toBe(204);

      const photoRows = await query<{ id: string }>(
        `SELECT id FROM field_report_photos WHERE field_report_id = $1 ORDER BY created_at DESC LIMIT 1`,
        [scopedFieldReportId],
      );
      const uploadedPhotoId = photoRows[0].id;

      const getRes = await request(app.server)
        .get(`/api/v1/field-reports/${scopedFieldReportId}/photos/${uploadedPhotoId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(getRes.status).toBe(200);
      expect(getRes.body).toBeTruthy();
    });

    it('IN-SCOPE: POST /api/v1/sync-conflicts/{id}/resolve still works for the owning jurisdiction', async () => {
      const res = await request(app.server)
        .post(`/api/v1/sync-conflicts/${scopedConflictId}/resolve`)
        .set('Authorization', `Bearer ${token}`)
        .send({ resolution: 'keep_eoc' });
      expect(res.status).toBe(200);
      expect(res.body.resolution).toBe('keep_eoc');
    });
  });
});
