import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { findOrCreateEocCotsConfig, type EocCotsRecordType } from './eoc-cots-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as gateway.test.ts/eoc-cots-adapter.test.ts (real Postgres + OPA,
// no mocking). Requires: docker compose up -d db opa; DATABASE_URL +
// OPA_URL + SESSION_JWT_SECRET set.

let adminToken: string;
let adminUserId: string;
let otherUserId: string;
let testRoleId: string;
let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for eoc-cots-conflicts.test.ts'],
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

async function insertTestConflict(configId: string, recordType: EocCotsRecordType): Promise<string> {
  const inserted = await query<{ id: string }>(
    `INSERT INTO eoc_cots_conflicts (config_id, record_type, epmp_record_id, epmp_value, external_value)
     VALUES ($1, $2, gen_random_uuid(), $3, $4)
     RETURNING id`,
    [
      configId,
      recordType,
      JSON.stringify({ status: 'Monitoring', source: 'EPMP' }),
      JSON.stringify({ status: 'Active', source: 'WebEOC' }),
    ],
  );
  return inserted[0].id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Eoc Cots Conflicts Test Jurisdiction');
  testRoleId = await findOrCreateRole('eoc_cots_conflicts_test_admin_role', 'PER-05');

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

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const adminEmail = `eoc-cots-conflicts-admin-${Date.now()}@epmp.local`;
  const adminInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [adminEmail, 'Eoc Cots Conflicts Test Admin', testRoleId, [testJurisdictionId]],
  );
  adminUserId = adminInserted[0].id;

  const otherEmail = `eoc-cots-conflicts-other-${Date.now()}@epmp.local`;
  const otherInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [otherEmail, 'Eoc Cots Conflicts Test Other User', testRoleId, [testJurisdictionId]],
  );
  otherUserId = otherInserted[0].id;

  adminToken = await mintSessionToken({
    id: adminUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('eoc-cots-conflicts — the sole resolve route', () => {
  it('1. POST .../resolve with resolved_by not matching the caller\'s own id returns 403 VERIFICATION_REQUIRES_NAMED_USER', async () => {
    const configId = await findOrCreateEocCotsConfig();
    const conflictId = await insertTestConflict(configId, 'incident');

    const res = await request(app.server)
      .post(`/api/v1/integrations/eoc-cots/conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolution: 'keep_epmp', resolved_by: otherUserId });

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('VERIFICATION_REQUIRES_NAMED_USER');

    // Confirm the row was NOT mutated by the rejected attempt.
    const rows = await query<{ resolution: string | null }>(
      `SELECT resolution FROM eoc_cots_conflicts WHERE id = $1`,
      [conflictId],
    );
    expect(rows[0].resolution).toBeNull();
  });

  it("2. POST .../resolve with the caller's own id and resolution:'keep_epmp' returns 200, and a follow-up SELECT confirms the resolution was recorded", async () => {
    const configId = await findOrCreateEocCotsConfig();
    const conflictId = await insertTestConflict(configId, 'incident');

    const res = await request(app.server)
      .post(`/api/v1/integrations/eoc-cots/conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolution: 'keep_epmp', resolved_by: adminUserId });

    expect(res.status).toBe(200);
    expect(res.body.resolution).toBe('keep_epmp');

    const rows = await query<{
      resolution: string | null;
      resolved_by: string | null;
      resolved_at: string | null;
      epmp_record_id: string;
    }>(
      `SELECT resolution, resolved_by, resolved_at, epmp_record_id FROM eoc_cots_conflicts WHERE id = $1`,
      [conflictId],
    );
    expect(rows[0].resolution).toBe('keep_epmp');
    expect(rows[0].resolved_by).toBe(adminUserId);
    expect(rows[0].resolved_at).not.toBeNull();

    // 3. A second POST .../resolve against the SAME now-resolved conflict
    // id returns 404 EOC_CONFLICT_NOT_FOUND — resolving twice can never
    // silently "win" a later click over an earlier one.
    const secondRes = await request(app.server)
      .post(`/api/v1/integrations/eoc-cots/conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolution: 'keep_external', resolved_by: adminUserId });

    expect(secondRes.status).toBe(404);
    expect(secondRes.body.error_code).toBe('EOC_CONFLICT_NOT_FOUND');

    // The row must still show the FIRST resolution, never overwritten by
    // the rejected second attempt.
    const rowsAfterSecond = await query<{ resolution: string | null }>(
      `SELECT resolution FROM eoc_cots_conflicts WHERE id = $1`,
      [conflictId],
    );
    expect(rowsAfterSecond[0].resolution).toBe('keep_epmp');

    // 4. After a 'keep_epmp' resolution, an eoc_cots_sync_log row exists
    // proving the write-back — the "written back through the adapter"
    // requirement's proof at this MVP stub depth.
    const logRows = await query<{ id: string }>(
      `SELECT id FROM eoc_cots_sync_log WHERE epmp_record_id = $1 AND direction = 'outbound'`,
      [rows[0].epmp_record_id],
    );
    expect(logRows.length).toBeGreaterThan(0);
  });

  it("5. POST .../resolve with resolution:'keep_external' logs an inbound sync_log row (external value accepted locally)", async () => {
    const configId = await findOrCreateEocCotsConfig();
    const conflictId = await insertTestConflict(configId, 'resource_request');

    const res = await request(app.server)
      .post(`/api/v1/integrations/eoc-cots/conflicts/${conflictId}/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolution: 'keep_external', resolved_by: adminUserId });

    expect(res.status).toBe(200);
    expect(res.body.resolution).toBe('keep_external');

    const rows = await query<{ epmp_record_id: string }>(
      `SELECT epmp_record_id FROM eoc_cots_conflicts WHERE id = $1`,
      [conflictId],
    );

    const logRows = await query<{ id: string }>(
      `SELECT id FROM eoc_cots_sync_log WHERE epmp_record_id = $1 AND direction = 'inbound'`,
      [rows[0].epmp_record_id],
    );
    expect(logRows.length).toBeGreaterThan(0);
  });

  it('6. POST .../resolve against a nonexistent conflict id returns 404 EOC_CONFLICT_NOT_FOUND', async () => {
    const res = await request(app.server)
      .post(`/api/v1/integrations/eoc-cots/conflicts/00000000-0000-0000-0000-000000000000/resolve`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ resolution: 'keep_epmp', resolved_by: adminUserId });

    expect(res.status).toBe(404);
    expect(res.body.error_code).toBe('EOC_CONFLICT_NOT_FOUND');
  });
});
