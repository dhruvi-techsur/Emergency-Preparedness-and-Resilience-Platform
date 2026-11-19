import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from './session.js';
import { syncRolePermissionsToOpa } from './opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — per the
// plan's project-context-boot-adjacent testing contract for this module.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for routes.test.ts'],
  );
  return inserted[0].id;
}

async function findOrCreateJurisdiction(): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    ['Test Jurisdiction', 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    ['Test Jurisdiction', 'county'],
  );
  return inserted[0].id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction();
  testRoleId = await findOrCreateRole('routes_test_role', 'PER-05');

  // Seed role_permissions for the test role: platform:view (required by
  // requirePermission('platform','view') on every route under test).
  const existingPerm = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [testRoleId, 'platform'],
  );
  if (!existingPerm[0]) {
    await query(
      `INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`,
      [testRoleId, 'platform', ['view']],
    );
  } else {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [['view'], existingPerm[0].id]);
  }

  // Sync role_permissions to OPA's data document so checkPermission resolves.
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  // Seed the test user directly (bypassing SSO/Keycloak, out of scope per plan).
  const email = `routes-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Routes Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('auth-org routes', () => {
  it('GET /api/v1/me with a valid session token returns 200 with the expected user shape', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const res = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(testUserId);
    expect(res.body.role.id).toBe(testRoleId);
    expect(res.body.status).toBe('Active');
  });

  it('GET /api/v1/me with no Authorization header returns 401 SESSION_EXPIRED', async () => {
    const res = await request(app.server).get('/api/v1/me');

    expect(res.status).toBe(401);
    expect(res.body.error_code).toBe('SESSION_EXPIRED');
  });

  it('PATCH /api/v1/me/preferences updates theme_preference and GET /api/v1/me reflects it', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const patchRes = await request(app.server)
      .patch('/api/v1/me/preferences')
      .set('Authorization', `Bearer ${token}`)
      .send({ theme_preference: 'dark' });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.theme_preference).toBe('dark');

    const getRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(200);
    expect(getRes.body.theme_preference).toBe('dark');
  });

  it('a suspended user is rejected on the SAME still-unexpired session token — proves immediate invalidation', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    // Confirm the token works BEFORE suspension.
    const beforeRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${token}`);
    expect(beforeRes.status).toBe(200);

    await query(`UPDATE users SET status = 'Suspended' WHERE id = $1`, [testUserId]);

    const afterRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${token}`);
    expect(afterRes.status).toBe(401);
    expect(afterRes.body.error_code).toBe('SESSION_EXPIRED');

    // Restore status for any subsequent test runs against the same seeded row.
    await query(`UPDATE users SET status = 'Active' WHERE id = $1`, [testUserId]);
  });

  it('GET /api/v1/me/nav-config returns a NavGroup[] shaped per 03a-api-auth-admin.md', async () => {
    const token = await mintSessionToken({
      id: testUserId,
      role_id: testRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const res = await request(app.server).get('/api/v1/me/nav-config').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.nav_groups)).toBe(true);
    // This test role has no 'admin' feature permission, so nav_groups is empty
    // per Phase 1 scope (only secops_admin sees the Admin group).
    expect(res.body.nav_groups).toEqual([]);
  });

  it('GET /api/v1/me/nav-config: every group carries a stable id, and the Field group is labeled "Field home" not "Profile" (UAT gap refs 8/1 regression)', async () => {
    // Grant field_reports:view to the existing test role so a Field group
    // actually appears in this response. The grant + assertions run inside a
    // try/finally so the restore step below ALWAYS runs — even if an
    // assertion throws — preventing cross-test pollution of the shared
    // testRoleId (the earlier "nav-config returns []" test depends on this
    // role having no field_reports permission on a fresh/subsequent run).
    try {
      const existingFieldReportsPerm = await query<{ id: string }>(
        `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
        [testRoleId, 'field_reports'],
      );
      if (!existingFieldReportsPerm[0]) {
        await query(
          `INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`,
          [testRoleId, 'field_reports', ['view']],
        );
      } else {
        await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [
          ['view'],
          existingFieldReportsPerm[0].id,
        ]);
      }
      const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
        `SELECT role_id, feature, actions FROM role_permissions`,
      );
      await syncRolePermissionsToOpa(allPerms);

      const token = await mintSessionToken({
        id: testUserId,
        role_id: testRoleId,
        jurisdiction_scope: [testJurisdictionId],
      });

      const res = await request(app.server).get('/api/v1/me/nav-config').set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      const fieldGroup = res.body.nav_groups.find((g: { id?: string }) => g.id === 'field');
      expect(fieldGroup).toBeTruthy();
      expect(fieldGroup.items).toHaveLength(4);
      const fourthItem = fieldGroup.items.find((i: { id: string }) => i.id === 'field-profile');
      expect(fourthItem.label).toBe('Field home');
      expect(fourthItem.href).toBe('/field');

      // Every group in the response must carry a non-empty id (not just Field) —
      // the stable-id convention applies uniformly, not as a Field-only special case.
      for (const group of res.body.nav_groups) {
        expect(typeof group.id).toBe('string');
        expect(group.id.length).toBeGreaterThan(0);
      }
    } finally {
      // Restore the test role to its pre-test permission set (platform:view
      // only) so the earlier "nav-config returns []" test's assumption holds
      // on any subsequent run against this same persistent DB — same
      // restore-after-test pattern as the suspended-user test above. This
      // runs unconditionally, even if an assertion above threw.
      await query(`DELETE FROM role_permissions WHERE role_id = $1 AND feature = $2`, [
        testRoleId,
        'field_reports',
      ]);
      const restoredPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
        `SELECT role_id, feature, actions FROM role_permissions`,
      );
      await syncRolePermissionsToOpa(restoredPerms);
    }
  });

  it('POST /api/v1/auth/sso/callback rejects a missing/invalid id_token with 401 SSO_AUTH_FAILED', async () => {
    const res = await request(app.server).post('/api/v1/auth/sso/callback').send({ id_token: 'not-a-real-token' });

    expect(res.status).toBe(401);
    expect(res.body.error_code).toBe('SSO_AUTH_FAILED');
  });
});
