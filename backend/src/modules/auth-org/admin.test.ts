import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from './session.js';
import { syncRolePermissionsToOpa } from './opa-client.js';

// Integration test against the real compose stack (Postgres + OPA), same
// pattern as 01-03's routes.test.ts.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let adminRoleId: string;
let adminUserId: string;
let adminToken: string;

let plainRoleId: string;
let plainUserId: string;

let escalationRoleId: string;
let escalationUserId: string;
let escalationToken: string;

let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for admin.test.ts'],
  );
  return inserted[0].id;
}

async function findOrCreateJurisdiction(): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    ['Admin Test Jurisdiction', 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    ['Admin Test Jurisdiction', 'county'],
  );
  return inserted[0].id;
}

async function setRolePermission(role_id: string, feature: string, actions: string[]) {
  const existing = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [role_id, feature],
  );
  if (existing[0]) {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existing[0].id]);
  } else {
    await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
      role_id,
      feature,
      actions,
    ]);
  }
}

async function syncAllPermsToOpa() {
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction();

  // Admin role: full admin + platform permissions.
  adminRoleId = await findOrCreateRole('admin_test_admin_role', 'PER-05');
  await setRolePermission(adminRoleId, 'admin', ['view', 'create', 'edit', 'approve']);
  await setRolePermission(adminRoleId, 'platform', ['view']);

  // Plain role: platform view only, no admin — used as the "already
  // logged in" target of the suspend test.
  plainRoleId = await findOrCreateRole('admin_test_plain_role', 'PER-04');
  await setRolePermission(plainRoleId, 'platform', ['view']);

  // Escalation role: starts with NO admin feature permission at all —
  // used to prove the synchronous OPA resync has no caching window. This
  // role is reused across test runs (find-or-create), so explicitly strip
  // any 'admin' permission a PREVIOUS run's assertion-3 PATCH may have
  // granted it, keeping this test idempotently re-runnable against an
  // already-seeded database.
  escalationRoleId = await findOrCreateRole('admin_test_escalation_role', 'PER-04');
  await setRolePermission(escalationRoleId, 'platform', ['view']);
  await query(`DELETE FROM role_permissions WHERE role_id = $1 AND feature = $2`, [escalationRoleId, 'admin']);

  await syncAllPermsToOpa();

  const adminEmail = `admin-test-${Date.now()}@epmp.local`;
  const adminInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [adminEmail, 'Admin Test Admin', adminRoleId, [testJurisdictionId]],
  );
  adminUserId = adminInserted[0].id;
  adminToken = await mintSessionToken({
    id: adminUserId,
    role_id: adminRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });

  const plainEmail = `plain-test-${Date.now()}@epmp.local`;
  const plainInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [plainEmail, 'Admin Test Plain User', plainRoleId, [testJurisdictionId]],
  );
  plainUserId = plainInserted[0].id;

  const escalationEmail = `escalation-test-${Date.now()}@epmp.local`;
  const escalationInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [escalationEmail, 'Admin Test Escalation User', escalationRoleId, [testJurisdictionId]],
  );
  escalationUserId = escalationInserted[0].id;
  escalationToken = await mintSessionToken({
    id: escalationUserId,
    role_id: escalationRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('admin console backend (F8)', () => {
  let createdUserId: string;

  it('1. POST /api/v1/admin/users creates a user; GET /api/v1/admin/users immediately includes it', async () => {
    const email = `created-test-${Date.now()}@epmp.local`;
    const createRes = await request(app.server)
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email, name: 'Newly Created User', role_id: plainRoleId, jurisdiction_scope: [testJurisdictionId] });

    expect(createRes.status).toBe(201);
    expect(createRes.body.email).toBe(email);
    createdUserId = createRes.body.id;

    const listRes = await request(app.server)
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.items.some((u: { id: string }) => u.id === createdUserId)).toBe(true);
  });

  it('2. suspending a user via PATCH immediately invalidates their active session', async () => {
    const plainToken = await mintSessionToken({
      id: plainUserId,
      role_id: plainRoleId,
      jurisdiction_scope: [testJurisdictionId],
    });

    const beforeRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${plainToken}`);
    expect(beforeRes.status).toBe(200);

    const suspendRes = await request(app.server)
      .patch(`/api/v1/admin/users/${plainUserId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'Suspended' });
    expect(suspendRes.status).toBe(200);
    expect(suspendRes.body.status).toBe('Suspended');

    const afterRes = await request(app.server).get('/api/v1/me').set('Authorization', `Bearer ${plainToken}`);
    expect(afterRes.status).toBe(401);
    expect(afterRes.body.error_code).toBe('SESSION_EXPIRED');

    // Restore for cleanliness / any re-run against the same seeded row.
    await query(`UPDATE users SET status = 'Active' WHERE id = $1`, [plainUserId]);
  });

  it('3. PATCH /api/v1/admin/roles/{id} grants admin:view with no OPA caching window', async () => {
    // Before the grant, the escalation user cannot reach an admin-only route.
    const beforeRes = await request(app.server)
      .get('/api/v1/admin/audit-log')
      .set('Authorization', `Bearer ${escalationToken}`);
    expect(beforeRes.status).toBe(403);

    const patchRes = await request(app.server)
      .patch(`/api/v1/admin/roles/${escalationRoleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ permissions: [{ feature: 'admin', actions: ['view'] }] });
    expect(patchRes.status).toBe(200);
    expect(
      patchRes.body.permissions.some((p: { feature: string; actions: string[] }) => p.feature === 'admin' && p.actions.includes('view')),
    ).toBe(true);

    // Immediately (no delay) the SAME still-valid token now succeeds.
    const afterRes = await request(app.server)
      .get('/api/v1/admin/audit-log')
      .set('Authorization', `Bearer ${escalationToken}`);
    expect(afterRes.status).toBe(200);
  });

  it('4. GET /api/v1/admin/audit-log contains entries for steps 1-3 with populated detail', async () => {
    const res = await request(app.server)
      .get('/api/v1/admin/audit-log')
      .query({ actor_id: adminUserId, page_size: '50' })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    const actions: string[] = res.body.items.map((e: { action: string }) => e.action);
    expect(actions).toContain('user_create');
    // Step 2's PATCH set status:'Suspended', which Task 1's own action-naming
    // contract maps to 'user_suspend' (not the generic 'user_edit') — see
    // admin-users.ts's statusChanged ? 'user_suspend'/'user_reactivate' : 'user_edit'.
    expect(actions).toContain('user_suspend');
    expect(actions).toContain('role_permission_edit');

    for (const wanted of ['user_create', 'user_suspend', 'role_permission_edit']) {
      const entry = res.body.items.find((e: { action: string }) => e.action === wanted);
      expect(entry.detail).toBeTruthy();
    }
  });

  it('5. PATCH /api/v1/admin/audit-log returns 403 AUDIT_LOG_IMMUTABLE', async () => {
    const res = await request(app.server)
      .patch('/api/v1/admin/audit-log')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ anything: 'goes' });

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('AUDIT_LOG_IMMUTABLE');
  });

  it('6. untested/unreachable SSO config fails /test and fails PATCH activation with 422', async () => {
    const unreachableUrl = 'http://127.0.0.1:1/does-not-exist-sso-metadata';

    const testRes = await request(app.server)
      .post('/api/v1/admin/sso-config/test')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ protocol: 'OIDC', idp_metadata_url: unreachableUrl });

    expect(testRes.status).toBe(200);
    expect(testRes.body.success).toBe(false);

    const patchRes = await request(app.server)
      .patch('/api/v1/admin/sso-config')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ protocol: 'OIDC', idp_metadata_url: unreachableUrl, active: true });

    expect(patchRes.status).toBe(422);
    expect(patchRes.body.error_code).toBe('SSO_CONFIG_INVALID');
  });

  it('7. GET /api/v1/admin/sso-config writes a queryable record_view audit entry', async () => {
    const getRes = await request(app.server)
      .get('/api/v1/admin/sso-config')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(getRes.status).toBe(200);

    const auditRes = await request(app.server)
      .get('/api/v1/admin/audit-log')
      .query({ actor_id: adminUserId, action_type: 'record_view' })
      .set('Authorization', `Bearer ${adminToken}`);

    expect(auditRes.status).toBe(200);
    const entry = auditRes.body.items.find(
      (e: { action: string; record_type?: string }) => e.action === 'record_view' && e.record_type === 'sso_config',
    );
    expect(entry).toBeTruthy();
  });
});
