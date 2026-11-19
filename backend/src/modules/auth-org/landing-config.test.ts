import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from './session.js';
import { syncRolePermissionsToOpa } from './opa-client.js';

// Integration test against the real compose stack (Postgres + OPA), same
// pattern as admin.test.ts. Requires: docker compose up -d db opa;
// DATABASE_URL + OPA_URL + SESSION_JWT_SECRET set.
//
// Proves 06-02's Task 1 seed (5 role_landing_config rows) and Task 2's
// GET /api/v1/me/landing-config both resolve correctly end-to-end, and
// that a role with NO row gets the documented non-blank 200
// ROLE_VIEW_UNMAPPED fallback rather than a 404/500.

let testJurisdictionId: string;

// This plan's own Task 1 seed values, re-asserted here as the expected
// shape — if a future plan edits seed.ts's role_landing_config block
// without updating this test, these assertions catch the drift.
const EXPECTED_ROUTES: Record<string, string> = {
  eoc_director: '/dashboard',
  incident_commander: '/incidents',
  planning_logistics_chief: '/my-work',
  field_responder: '/field',
  secops_admin: '/admin/platform-monitoring',
};

async function findOrCreateJurisdiction(): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    ['Landing Config Test Jurisdiction', 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    ['Landing Config Test Jurisdiction', 'county'],
  );
  return inserted[0].id;
}

async function mintTokenForRole(roleName: string, roleId: string): Promise<string> {
  const email = `landing-config-test-${roleName}-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, `Landing Config Test ${roleName}`, roleId, [testJurisdictionId]],
  );
  return mintSessionToken({
    id: inserted[0].id,
    role_id: roleId,
    jurisdiction_scope: [testJurisdictionId],
  });
}

async function findRoleId(roleName: string): Promise<string> {
  const rows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [roleName]);
  if (!rows[0]) throw new Error(`Role ${roleName} not found — run npm run seed first`);
  return rows[0].id;
}

beforeAll(async () => {
  await app.ready();
  testJurisdictionId = await findOrCreateJurisdiction();
});

afterAll(async () => {
  await pool.end();
});

describe('GET /api/v1/me/landing-config (F18)', () => {
  it('1-5. each of the 5 seeded persona roles resolves its own distinct default_route', async () => {
    for (const [roleName, expectedRoute] of Object.entries(EXPECTED_ROUTES)) {
      const roleId = await findRoleId(roleName);
      const token = await mintTokenForRole(roleName, roleId);

      const res = await request(app.server)
        .get('/api/v1/me/landing-config')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.default_route).toBe(expectedRoute);
      expect(res.body.error_code).toBeUndefined();
    }
  });

  it("6. PER-04 (field_responder)'s mobile_bottom_bar_items has exactly 4 entries", async () => {
    const roleId = await findRoleId('field_responder');
    const token = await mintTokenForRole('field_responder', roleId);

    const res = await request(app.server)
      .get('/api/v1/me/landing-config')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.mobile_bottom_bar_items).toHaveLength(4);
  });

  it("7. PER-05 (secops_admin)'s nav_groups contains exactly one group labeled 'Admin'", async () => {
    const roleId = await findRoleId('secops_admin');
    const token = await mintTokenForRole('secops_admin', roleId);

    const res = await request(app.server)
      .get('/api/v1/me/landing-config')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.nav_groups).toHaveLength(1);
    expect(res.body.nav_groups[0].label).toBe('Admin');
  });

  it('8. a role with NO role_landing_config row returns 200 ROLE_VIEW_UNMAPPED, never 404/500', async () => {
    // Throwaway 6th role, deliberately never seeded into role_landing_config.
    // `roles.persona_id` has its own CHECK constraint restricting values to
    // the 5 canonical personas ('PER-01'..'PER-05') — there is no "PER-99"
    // escape hatch, and `persona_id` itself carries no UNIQUE constraint
    // (only `name` does), so reusing an existing persona_id value with a
    // brand-new, never-seeded role NAME is the correct way to create a
    // genuinely unmapped role within the schema's own rules.
    const unmappedRoleName = `unmapped_test_role_${Date.now()}`;
    const roleInserted = await query<{ id: string }>(
      `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
      [unmappedRoleName, 'PER-04', 'Throwaway role for landing-config.test.ts unmapped-role case'],
    );
    const unmappedRoleId = roleInserted[0].id;
    // 'platform'/'view' so requirePermission's own preHandler doesn't 403
    // before the route logic under test ever runs. OPA is re-synced
    // explicitly below (fresh from the full role_permissions table,
    // mirroring server.ts's own boot-time sync) since opa-client.ts's
    // checkPermission reads OPA's own data document, not Postgres
    // directly — a bare INSERT here alone would leave OPA unaware of
    // this brand-new role and every request would 403 before this
    // route's own logic ever ran.
    await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, 'platform', $2)`, [
      unmappedRoleId,
      ['view'],
    ]);
    const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
      `SELECT role_id, feature, actions FROM role_permissions`,
    );
    await syncRolePermissionsToOpa(allPerms);
    const token = await mintTokenForRole(unmappedRoleName, unmappedRoleId);

    const res = await request(app.server)
      .get('/api/v1/me/landing-config')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.error_code).toBe('ROLE_VIEW_UNMAPPED');
    expect(res.body.message).toBeTruthy();
    expect(res.body.default_route).toBeTruthy();
    expect(res.body.nav_groups).toEqual([]);
    expect(res.body.mobile_bottom_bar_items).toEqual([]);
  });
});
