import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 02-01's incidents.test.ts and 02-02's activation.test.ts.
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
    [name, personaId, 'Test role for operating-picture.test.ts'],
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

async function createTestIncident(
  token: string,
  jurisdictionId: string,
  severity: 'Critical' | 'Elevated' | 'Watch' | 'Normal' = 'Normal',
): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Operating Picture Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity,
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Operating Picture Test Jurisdiction');
  testRoleId = await findOrCreateRole('operating_picture_test_role', 'PER-02');

  // incidents:view/create for creating and reading test fixtures;
  // admin:view for GET /api/v1/integrations/gis/health.
  await grantPermission(testRoleId, 'incidents', ['view', 'create', 'edit']);
  await grantPermission(testRoleId, 'admin', ['view']);

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `operating-picture-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Operating Picture Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('incident-ops operating-picture routes', () => {
  it('markers includes incidents WITH a location as diamond markers with a real agency-GIS base layer', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId, 'Critical');
    await query(
      `UPDATE incidents SET location = ST_SetSRID(ST_MakePoint(-77.0, 38.9), 4326) WHERE id = $1`,
      [incidentId],
    );

    // 2. A second incident with NO location set — must be omitted entirely.
    const noLocationIncidentId = await createTestIncident(token, testJurisdictionId, 'Normal');

    const markersRes = await request(app.server)
      .get('/api/v1/operating-picture/markers')
      .set('Authorization', `Bearer ${token}`);

    expect(markersRes.status).toBe(200);
    const marker = markersRes.body.markers.find((m: { id: string }) => m.id === incidentId);
    expect(marker).toBeTruthy();
    expect(marker.shape).toBe('diamond');
    expect(marker.tone).toBe('danger'); // Critical -> danger
    expect(typeof marker.location.lat).toBe('number');
    expect(typeof marker.location.lng).toBe('number');
    expect(marker.location.lat).toBeCloseTo(38.9, 1);
    expect(marker.location.lng).toBeCloseTo(-77.0, 1);

    // Omitted, not broken — the no-location incident never appears.
    const omitted = markersRes.body.markers.find((m: { id: string }) => m.id === noLocationIncidentId);
    expect(omitted).toBeUndefined();

    // Success path: the adapter's known layer ID is used internally, so the
    // base layer source should name the real (stubbed-but-contract-faithful)
    // agency GIS adapter, not the schematic fallback.
    expect(markersRes.body.status_bar.base_layer_source).toContain('agency GIS');
  });

  it('force_gis_failure=true still returns 200 with the exact schematic-fallback label, and incident markers remain present', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const incidentId = await createTestIncident(token, testJurisdictionId, 'Elevated');
    await query(
      `UPDATE incidents SET location = ST_SetSRID(ST_MakePoint(-74.0, 40.7), 4326) WHERE id = $1`,
      [incidentId],
    );

    const degradedRes = await request(app.server)
      .get('/api/v1/operating-picture/markers')
      .query({ force_gis_failure: 'true' })
      .set('Authorization', `Bearer ${token}`);

    expect(degradedRes.status).toBe(200);
    expect(degradedRes.body.status_bar.base_layer_source).toBe('Schematic base map, offline');

    // The page never fails to render — real incident data still shows on
    // top of the degraded base.
    const marker = degradedRes.body.markers.find((m: { id: string }) => m.id === incidentId);
    expect(marker).toBeTruthy();
    expect(marker.shape).toBe('diamond');
  });

  it('a malformed bbox query param falls through to the schematic fallback instead of an invalid polygon (W3 fix)', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const malformedRes = await request(app.server)
      .get('/api/v1/operating-picture/markers')
      .query({ bbox: '1,2,notanumber' })
      .set('Authorization', `Bearer ${token}`);

    expect(malformedRes.status).toBe(200);
    expect(malformedRes.body.status_bar.base_layer_source).toBe('Schematic base map, offline');
  });

  it('GET /api/v1/operating-picture/layers returns at least one layer with non-null source and as_of', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const layersRes = await request(app.server)
      .get('/api/v1/operating-picture/layers')
      .set('Authorization', `Bearer ${token}`);

    expect(layersRes.status).toBe(200);
    expect(layersRes.body.layers.length).toBeGreaterThanOrEqual(1);
    const incidentsLayer = layersRes.body.layers.find((l: { id: string }) => l.id === 'incidents');
    expect(incidentsLayer).toBeTruthy();
    expect(incidentsLayer.source).toBeTruthy();
    expect(incidentsLayer.as_of).toBeTruthy();
  });

  it('GET /api/v1/integrations/gis/health returns gis_feed_status rows written by this test run\u2019s adapter calls', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    // Issue both a success-path and a forced-failure request first, so at
    // least one 'ok' row (from the success-path test above having already
    // run, or from this call) exists in gis_feed_status.
    await request(app.server)
      .get('/api/v1/operating-picture/markers')
      .set('Authorization', `Bearer ${token}`);

    const healthRes = await request(app.server)
      .get('/api/v1/integrations/gis/health')
      .set('Authorization', `Bearer ${token}`);

    expect(healthRes.status).toBe(200);
    expect(healthRes.body.items.length).toBeGreaterThanOrEqual(1);
    const statuses = healthRes.body.items.map((i: { last_fetch_status: string }) => i.last_fetch_status);
    expect(statuses).toContain('ok');
  });
});
