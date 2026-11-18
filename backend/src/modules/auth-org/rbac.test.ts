import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from './session.js';
import { syncRolePermissionsToOpa } from './opa-client.js';
import { requirePermission } from './rbac.js';

// Integration test proving requirePermission()'s checkPermission()-false
// branch returns the NEW PERMISSION_DENIED error_code/message — not the
// ROLE_UNRESOLVED constant, which remains accurate ONLY for the genuinely
// unresolved-role case handled separately in the SSO callback (routes.ts).
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set — same contract as routes.test.ts.

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for rbac.test.ts'],
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

async function setReportingGrant(roleId: string, actions: string[]): Promise<void> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
    [roleId, 'reporting'],
  );
  if (existing[0]) {
    await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existing[0].id]);
  } else if (actions.length > 0) {
    await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, 'reporting', $2)`, [
      roleId,
      actions,
    ]);
  }
  // actions.length === 0 and no existing row: deliberately leave NO row at
  // all for this role/feature pair — the "zero reporting grant whatsoever"
  // case Test 2 below exercises, distinct from "has a row but it's empty".
}

let jurisdictionId: string;
let viewCreateOnlyRoleId: string;
let zeroGrantRoleId: string;
let fullEditRoleId: string;
let viewCreateOnlyUserId: string;
let zeroGrantUserId: string;
let fullEditUserId: string;

// Minimal bare route, registered directly on the shared app instance in
// beforeAll, gated by the REAL requirePermission('reporting','edit')
// preHandler — avoids needing an incident/sitrep fixture just to exercise
// the RBAC branch under test, per the plan's own "Claude's discretion" note.
const TEST_ROUTE = '/api/v1/_test/rbac-reporting-edit-probe';

beforeAll(async () => {
  app.get(TEST_ROUTE, { preHandler: requirePermission('reporting', 'edit') }, async (_req, reply) => {
    return reply.code(200).send({ ok: true });
  });

  await app.ready();

  jurisdictionId = await findOrCreateJurisdiction();
  viewCreateOnlyRoleId = await findOrCreateRole('rbac_test_view_create_only', 'PER-05');
  zeroGrantRoleId = await findOrCreateRole('rbac_test_zero_grant', 'PER-05');
  fullEditRoleId = await findOrCreateRole('rbac_test_full_edit', 'PER-05');

  // Role 1: mirrors incident_commander's real 04-04 seed grant on
  // 'reporting' — view+create, but NOT edit. Can trigger but not finalize.
  await setReportingGrant(viewCreateOnlyRoleId, ['view', 'create']);
  // Role 2: no row at all for 'reporting' — the simplest "lacks this grant"
  // case, holding zero actions on the feature whatsoever.
  await setReportingGrant(zeroGrantRoleId, []);
  // Role 3 (positive control): holds the 'edit' action being checked.
  await setReportingGrant(fullEditRoleId, ['view', 'create', 'edit']);

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const mkUser = async (roleId: string, label: string): Promise<string> => {
    const email = `rbac-test-${label}-${Date.now()}@epmp.local`;
    const inserted = await query<{ id: string }>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
      [email, `RBAC Test ${label}`, roleId, [jurisdictionId]],
    );
    return inserted[0].id;
  };

  viewCreateOnlyUserId = await mkUser(viewCreateOnlyRoleId, 'view-create-only');
  zeroGrantUserId = await mkUser(zeroGrantRoleId, 'zero-grant');
  fullEditUserId = await mkUser(fullEditRoleId, 'full-edit');
});

afterAll(async () => {
  await pool.end();
});

describe('requirePermission() PERMISSION_DENIED vs ROLE_UNRESOLVED', () => {
  it('a resolved role holding view+create but NOT edit gets 403 PERMISSION_DENIED with accurate wording (not ROLE_UNRESOLVED)', async () => {
    const token = await mintSessionToken({
      id: viewCreateOnlyUserId,
      role_id: viewCreateOnlyRoleId,
      jurisdiction_scope: [jurisdictionId],
    });

    const res = await request(app.server).get(TEST_ROUTE).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('PERMISSION_DENIED');
    expect(res.body.message).toContain("role doesn't include this action");
    expect(res.body.message).not.toContain("isn't assigned a role yet");
  });

  it('a resolved role holding NO reporting grant at all ALSO gets 403 PERMISSION_DENIED — the distinction is about the ACTION, not whether the role holds any grant on the feature', async () => {
    const token = await mintSessionToken({
      id: zeroGrantUserId,
      role_id: zeroGrantRoleId,
      jurisdiction_scope: [jurisdictionId],
    });

    const res = await request(app.server).get(TEST_ROUTE).set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('PERMISSION_DENIED');
  });

  it('a role that DOES hold the required edit action is not denied with PERMISSION_DENIED — proves the fix did not start denying everyone', async () => {
    const token = await mintSessionToken({
      id: fullEditUserId,
      role_id: fullEditRoleId,
      jurisdiction_scope: [jurisdictionId],
    });

    const res = await request(app.server).get(TEST_ROUTE).set('Authorization', `Bearer ${token}`);

    expect(res.body.error_code).not.toBe('PERMISSION_DENIED');
    expect(res.status).toBe(200);
  });
});
