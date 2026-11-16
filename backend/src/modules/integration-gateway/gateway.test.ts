import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { checkRecordAuthority } from './record-authority.js';

// Integration test against the real compose stack (Postgres + OPA) — per the
// plan's project-context-boot-adjacent testing contract for this module.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET set.

let adminToken: string;
let testRoleId: string;
let testJurisdictionId: string;

function getOpaUrl(): string {
  return process.env.OPA_URL ?? 'http://localhost:8181';
}

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for gateway.test.ts'],
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

  testJurisdictionId = await findOrCreateJurisdiction('Gateway Test Jurisdiction');
  testRoleId = await findOrCreateRole('gateway_test_admin_role', 'PER-05');

  // Grant this test role full 'admin' permissions so requirePermission('admin', *) passes.
  const existingPerm = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [testRoleId, 'admin'],
  );
  if (!existingPerm[0]) {
    await query(
      `INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`,
      [testRoleId, 'admin', ['view', 'create', 'edit', 'approve']],
    );
  } else {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
      ['view', 'create', 'edit', 'approve'],
      existingPerm[0].id,
    ]);
  }

  // Sync role_permissions to OPA's data document so checkPermission resolves.
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `gateway-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Gateway Test Admin', testRoleId, [testJurisdictionId]],
  );
  const userId = inserted[0].id;

  adminToken = await mintSessionToken({
    id: userId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('integration-gateway routes', () => {
  it('1. POST /api/v1/admin/api-clients returns client_secret once; subsequent GET never includes it', async () => {
    const createRes = await request(app.server)
      .post('/api/v1/admin/api-clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ client_name: 'Test Partner Client', scopes: ['read:incidents'] });

    expect(createRes.status).toBe(201);
    expect(typeof createRes.body.client_secret).toBe('string');
    expect(createRes.body.client_secret.length).toBeGreaterThan(10);

    const listRes = await request(app.server)
      .get('/api/v1/admin/api-clients')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    const match = listRes.body.find((c: { id: string }) => c.id === createRes.body.id);
    expect(match).toBeDefined();
    expect(match.client_secret).toBeUndefined();
    expect(match.client_secret_hash).toBeUndefined();
  });

  it('2. POST /api/v1/admin/federation-grants with empty record_types returns clean 400', async () => {
    const res = await request(app.server)
      .post('/api/v1/admin/federation-grants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ partner_jurisdiction_id: testJurisdictionId, scope: { record_types: [] } });

    expect(res.status).toBe(400);
    expect(res.body.error_code).toBeDefined();
  });

  it('3. Revoking a federation grant synchronously removes it from OPA data (no caching window)', async () => {
    const createRes = await request(app.server)
      .post('/api/v1/admin/federation-grants')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        partner_jurisdiction_id: testJurisdictionId,
        scope: { record_types: ['incident'] },
      });

    expect(createRes.status).toBe(201);
    const grantId: string = createRes.body.id;

    // Confirm it's present in OPA's data before revocation.
    const beforeOpaRes = await fetch(`${getOpaUrl()}/v1/data/federation_grants`);
    const beforeOpaBody = (await beforeOpaRes.json()) as { result?: Array<{ id: string }> };
    expect((beforeOpaBody.result ?? []).some((g) => g.id === grantId)).toBe(true);

    const revokeRes = await request(app.server)
      .post(`/api/v1/admin/federation-grants/${grantId}/revoke`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(revokeRes.status).toBe(204);

    const dbRows = await query<{ status: string }>(`SELECT status FROM federation_grants WHERE id = $1`, [grantId]);
    expect(dbRows[0].status).toBe('Revoked');

    const afterOpaRes = await fetch(`${getOpaUrl()}/v1/data/federation_grants`);
    const afterOpaBody = (await afterOpaRes.json()) as { result?: Array<{ id: string }> };
    expect((afterOpaBody.result ?? []).some((g) => g.id === grantId)).toBe(false);
  });

  it('4. POST then GET /api/v1/admin/record-authority includes the newly registered record type', async () => {
    const recordType = `test_type_${Date.now()}`;
    const postRes = await request(app.server)
      .post('/api/v1/admin/record-authority')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ record_type: recordType, authoritative_system: 'ExternalSystem' });

    expect(postRes.status).toBe(200);

    const getRes = await request(app.server)
      .get('/api/v1/admin/record-authority')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(getRes.status).toBe(200);
    expect(
      getRes.body.some(
        (r: { record_type: string; authoritative_system: string }) =>
          r.record_type === recordType && r.authoritative_system === 'ExternalSystem',
      ),
    ).toBe(true);
  });

  it('5. checkRecordAuthority() resolves the registered system and defaults unregistered types to EPMP', async () => {
    const recordType = `test_type_direct_${Date.now()}`;
    await request(app.server)
      .post('/api/v1/admin/record-authority')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ record_type: recordType, authoritative_system: 'ExternalSystem' });

    const resolved = await checkRecordAuthority(recordType);
    expect(resolved).toBe('ExternalSystem');

    const defaulted = await checkRecordAuthority(`never_registered_type_${Date.now()}`);
    expect(defaulted).toBe('EPMP');
  });
});
