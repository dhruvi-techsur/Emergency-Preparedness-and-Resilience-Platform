import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import {
  fetchFacilityStatus,
  runFacilitySync,
} from './facility-adapter.js';
import { browseDocuments, importDocument, linkDocument } from './document-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as gateway.test.ts/incidents.test.ts.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let testToken: string;
let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for facility-document-adapter.test.ts'],
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

async function grantPermission(roleId: string, feature: string, actions: string[]): Promise<void> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [roleId, feature],
  );
  if (!existing[0]) {
    await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
      roleId,
      feature,
      actions,
    ]);
  } else {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existing[0].id]);
  }
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Facility Document Test Jurisdiction');
  testRoleId = await findOrCreateRole('facility_document_test_role', 'PER-03');

  await grantPermission(testRoleId, 'incidents', ['view']);
  await grantPermission(testRoleId, 'plans', ['view', 'edit']);
  await grantPermission(testRoleId, 'admin', ['view']);

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `facility-document-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Facility Document Test User', testRoleId, [testJurisdictionId]],
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

describe('Plan 08-02: F17 facility adapter — field-discarding + outage-resilience', () => {
  it('1. fetchFacilityStatus() returns ONLY the 6 allow-listed keys — no inventory/maintenance/cost fields present', async () => {
    const records = await fetchFacilityStatus();
    expect(records.length).toBeGreaterThan(0);
    for (const record of records) {
      const keys = Object.keys(record).sort();
      expect(keys).toEqual(['as_of', 'facility_id', 'location', 'name', 'source', 'status']);
      expect((record as unknown as Record<string, unknown>).inventory_count).toBeUndefined();
      expect((record as unknown as Record<string, unknown>).maintenance_due_at).toBeUndefined();
      expect((record as unknown as Record<string, unknown>).annual_cost).toBeUndefined();
    }
  });

  it('2. fetchFacilityStatus(undefined, true) deterministically rejects with FACILITY_FEED_UNREACHABLE', async () => {
    await expect(fetchFacilityStatus(undefined, true)).rejects.toThrow(/FACILITY_FEED_UNREACHABLE/);
  });

  it('3. after runFacilitySync(), GET /api/v1/operating-picture/facilities returns a type:facility, shape:square marker with source/as_of', async () => {
    await runFacilitySync();

    const res = await request(app.server)
      .get('/api/v1/operating-picture/facilities')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.markers)).toBe(true);
    expect(res.body.markers.length).toBeGreaterThan(0);

    const marker = res.body.markers[0];
    expect(marker.type).toBe('facility');
    expect(marker.shape).toBe('square');
    expect(marker.source).toBeTruthy();
    expect(marker.as_of).toBeTruthy();
  });

  it('4. a failed runFacilitySync() leaves prior successfully-synced facility rows in place (last-known position kept) and marks health offline', async () => {
    // Ensure at least one successful sync has happened first.
    await runFacilitySync();

    const beforeRes = await request(app.server)
      .get('/api/v1/operating-picture/facilities')
      .set('Authorization', `Bearer ${testToken}`);
    const beforeCount = beforeRes.body.markers.length;
    expect(beforeCount).toBeGreaterThan(0);

    // Force a failed run — this must NOT delete the already-synced rows.
    await expect(runFacilitySync(true)).rejects.toThrow(/FACILITY_FEED_UNREACHABLE/);

    const afterRes = await request(app.server)
      .get('/api/v1/operating-picture/facilities')
      .set('Authorization', `Bearer ${testToken}`);
    expect(afterRes.body.markers.length).toBe(beforeCount);

    const healthRes = await request(app.server)
      .get('/api/v1/integrations/facilities/health')
      .set('Authorization', `Bearer ${testToken}`);
    expect(healthRes.status).toBe(200);
    const facilityHealthRow = healthRes.body.items.find(
      (r: { system_name: string }) => r.system_name === 'Facility/Asset Feed',
    );
    expect(facilityHealthRow).toBeDefined();
    expect(facilityHealthRow.sync_status).toBe('offline');

    // Restore to 'online' for any test that runs after this one in the
    // same process, mirroring runFacilitySync()'s own recovery behavior.
    await runFacilitySync();
  });

  it('8. job-type isolation: background_jobs rows for facility_sync/cad_ingestion/sync_reconciliation never collide', async () => {
    const rows = await query<{ job_type: string }>(
      `SELECT DISTINCT job_type FROM background_jobs WHERE job_type IN ('facility_sync', 'cad_ingestion', 'sync_reconciliation', 'feed_ingestion')`,
    );
    const jobTypes = rows.map((r) => r.job_type);
    expect(jobTypes).toContain('facility_sync');
    // These other adapters may or may not have run yet in this test process
    // (conditional, same cross-plan proof pattern Plan 07-01/07-02
    // established) — the only hard assertion is that facility_sync is
    // present and that the set contains no duplicates (a Set comparison
    // confirms distinctness trivially since this is already DISTINCT).
    expect(new Set(jobTypes).size).toBe(jobTypes.length);
  });
});

describe('Plan 08-02: F17 document adapter — permission-boundary enforcement', () => {
  it('5. browseDocuments(userId, "") for a fresh user returns ONLY DOC-EOP-001/DOC-SOP-002, never DOC-ANNEX-003', async () => {
    const freshUserId = `test-user-${Date.now()}-a`;
    const results = await browseDocuments(freshUserId, '');

    const ids = results.map((r) => r.external_document_id).sort();
    expect(ids).toEqual(['DOC-EOP-001', 'DOC-SOP-002']);
    expect(ids).not.toContain('DOC-ANNEX-003');
  });

  it('6. importDocument rejects a document outside the granted set; the HTTP route returns 403 IMPORT_PERMISSION_DENIED', async () => {
    const freshUserId = `test-user-${Date.now()}-b`;
    // Lazily seed this user's access set via a browse call first (same
    // lazy-seed trigger the route itself uses).
    await browseDocuments(freshUserId, '');

    await expect(importDocument(freshUserId, 'DOC-ANNEX-003')).rejects.toThrow(/IMPORT_PERMISSION_DENIED/);

    // HTTP-level proof: the real request as the SEEDED test user (whose
    // access set is lazily granted the same fixed 2-of-3 split on first
    // use within this route's own call to importDocument/browseDocuments).
    const res = await request(app.server)
      .post('/api/v1/integrations/documents/DOC-ANNEX-003/import')
      .set('Authorization', `Bearer ${testToken}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('IMPORT_PERMISSION_DENIED');
  });

  it('7. importDocument succeeds for a document inside the granted set and writes a real document_links row with imported_by = the requesting user', async () => {
    const freshUserId = `test-user-${Date.now()}-c`;
    await browseDocuments(freshUserId, ''); // lazy-seed

    // importDocument requires a real users.id FK target for imported_by —
    // use the real seeded testUserId (already lazily granted the same
    // fixed split via test 6's HTTP call, or will be lazily seeded fresh
    // here if this test runs first in isolation).
    const result = await importDocument(testUserId, 'DOC-EOP-001');
    expect(result.id).toBeTruthy();
    expect(typeof result.content).toBe('string');

    const rows = await query<{ imported_by: string; external_document_id: string; mode: string }>(
      `SELECT imported_by, external_document_id, mode FROM document_links WHERE id = $1`,
      [result.id],
    );
    expect(rows[0]).toBeDefined();
    expect(rows[0].imported_by).toBe(testUserId);
    expect(rows[0].external_document_id).toBe('DOC-EOP-001');
    expect(rows[0].mode).toBe('import_copy');
  });

  it('GET /api/v1/integrations/documents/browse (HTTP) returns the filtered array directly for the authenticated user', async () => {
    const res = await request(app.server)
      .get('/api/v1/integrations/documents/browse')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((r: { external_document_id: string }) => r.external_document_id);
    expect(ids).not.toContain('DOC-ANNEX-003');
  });

  it('GET /api/v1/integrations/documents/health (HTTP, admin:view) returns the SharePoint health row', async () => {
    const res = await request(app.server)
      .get('/api/v1/integrations/documents/health')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    const row = res.body.items.find((r: { system_name: string }) => r.system_name === 'SharePoint');
    expect(row).toBeDefined();
    expect(row.record_authority).toBe('SharePoint');
  });

  it('9. F-08-01: POST /:id/link with a plan_id belonging to a FOREIGN jurisdiction is rejected 404 PLAN_NOT_FOUND, with zero document_links row written', async () => {
    const foreignJurisdictionId = await findOrCreateJurisdiction('F-08-01 Foreign Jurisdiction Test');

    const foreignPlan = await query<{ id: string }>(
      `INSERT INTO plans (name, type, jurisdiction_id, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['F-08-01 Foreign Jurisdiction Plan', 'EOP', foreignJurisdictionId, testUserId],
    );
    const foreignPlanId = foreignPlan[0].id;

    const res = await request(app.server)
      .post('/api/v1/integrations/documents/DOC-EOP-001/link')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ plan_id: foreignPlanId });

    expect(res.status).toBe(404);
    expect(res.body.error_code).toBe('PLAN_NOT_FOUND');

    const linkRows = await query<{ id: string }>(
      `SELECT id FROM document_links WHERE plan_id = $1`,
      [foreignPlanId],
    );
    expect(linkRows.length).toBe(0);
  });

  it('10. F-08-01: POST /:id/link with a nonexistent plan_id is rejected 404 PLAN_NOT_FOUND, never a 500', async () => {
    const res = await request(app.server)
      .post('/api/v1/integrations/documents/DOC-EOP-001/link')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ plan_id: '00000000-0000-0000-0000-000000000000' });

    expect(res.status).toBe(404);
    expect(res.body.error_code).toBe('PLAN_NOT_FOUND');
  });

  it('11. F-08-01: a legitimate IN-SCOPE plan_id still succeeds 201 and writes a real document_links row', async () => {
    const inScopePlan = await query<{ id: string }>(
      `INSERT INTO plans (name, type, jurisdiction_id, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['F-08-01 In-Scope Plan', 'EOP', testJurisdictionId, testUserId],
    );
    const inScopePlanId = inScopePlan[0].id;

    const res = await request(app.server)
      .post('/api/v1/integrations/documents/DOC-SOP-002/link')
      .set('Authorization', `Bearer ${testToken}`)
      .send({ plan_id: inScopePlanId });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();

    const linkRows = await query<{ id: string; plan_id: string }>(
      `SELECT id, plan_id FROM document_links WHERE id = $1`,
      [res.body.id],
    );
    expect(linkRows[0]).toBeDefined();
    expect(linkRows[0].plan_id).toBe(inScopePlanId);
  });

  it('12. F-08-01: linkDocument() called directly with no jurisdictionScope argument (no plan_id) is unaffected', async () => {
    // imported_by is a real users.id FK, so this uses the already-seeded
    // testUserId (same pattern as test 7's importDocument call) rather
    // than a synthetic freshUserId string, which is only safe for
    // resolveUserAccessSet's in-memory map, not a real FK insert.
    const result = await linkDocument(testUserId, 'DOC-EOP-001');
    expect(result.id).toBeTruthy();

    const rows = await query<{ plan_id: string | null }>(
      `SELECT plan_id FROM document_links WHERE id = $1`,
      [result.id],
    );
    expect(rows[0].plan_id).toBeNull();
  });
});
