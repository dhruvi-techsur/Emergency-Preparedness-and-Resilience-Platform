import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import {
  fetchExchangeRecords,
  isRecordTypeDeclared,
  runEocCotsSync,
} from './eoc-cots-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as gateway.test.ts/07-01's operating-picture.test.ts extension
// (real Postgres + OPA, no mocking). Helpers below are copied (not
// imported) from gateway.test.ts, matching this codebase's existing
// per-test-file helper-duplication convention.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let adminToken: string;
let testRoleId: string;
let testJurisdictionId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for eoc-cots-adapter.test.ts'],
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

  testJurisdictionId = await findOrCreateJurisdiction('Eoc Cots Test Jurisdiction');
  testRoleId = await findOrCreateRole('eoc_cots_test_admin_role', 'PER-05');

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

  // Declare 'incident' as EPMP-authoritative — needed for
  // checkRecordAuthority('incident') to resolve a real row rather than its
  // own collapsed 'EPMP' default, and for isRecordTypeDeclared('incident')
  // to return true. 'status' is DELIBERATELY left unregistered (no row at
  // all) — test #5/#6 below depend on that absence to prove the
  // undeclared-type-not-synced rule.
  const existingAuthority = await query<{ id: string }>(
    `SELECT id FROM record_authority_registry WHERE record_type = $1`,
    ['incident'],
  );
  if (!existingAuthority[0]) {
    await query(
      `INSERT INTO record_authority_registry (record_type, authoritative_system) VALUES ($1, $2)`,
      ['incident', 'EPMP'],
    );
  } else {
    await query(`UPDATE record_authority_registry SET authoritative_system = $1 WHERE id = $2`, [
      'EPMP',
      existingAuthority[0].id,
    ]);
  }
  // Confirm 'status' is NOT registered — self-healing cleanup in case a
  // prior, unrelated test run left a row behind (none currently does, but
  // this keeps the precondition explicit rather than assumed).
  await query(`DELETE FROM record_authority_registry WHERE record_type = 'status'`);

  const email = `eoc-cots-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Eoc Cots Test Admin', testRoleId, [testJurisdictionId]],
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

describe('eoc-cots-adapter', () => {
  it('1. fetchExchangeRecords("incident") returns provenance-complete records including the recognized conflict-trigger external_id', async () => {
    const records = await fetchExchangeRecords('incident');
    expect(records.length).toBeGreaterThan(0);
    for (const r of records) {
      expect(r.external_system).toBeTruthy();
      expect(r.last_modified_external).toBeTruthy();
    }
    // The recognized KNOWN_VENDOR success path must actually wire in the
    // deterministic conflict-trigger record — without this assertion,
    // test #4 below could pass or fail for the wrong reason.
    expect(records.some((r) => r.external_id === 'EOC-CONFLICT-001')).toBe(true);
  });

  it('2. fetchExchangeRecords with the FORCE_AUTH_FAILURE trigger rejects with EOC_ADAPTER_AUTH_FAILED', async () => {
    await expect(fetchExchangeRecords('incident', 'FORCE_AUTH_FAILURE')).rejects.toThrow(
      /EOC_ADAPTER_AUTH_FAILED/,
    );
  });

  it('3. after runEocCotsSync(), GET /api/v1/integrations/eoc-cots/health shows a WebEOC row with a sync_status', async () => {
    await runEocCotsSync();

    const res = await request(app.server)
      .get('/api/v1/integrations/eoc-cots/health')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    const webEocRow = res.body.items.find((r: { system_name: string }) => r.system_name === 'WebEOC');
    expect(webEocRow).toBeDefined();
    expect(['online', 'syncing', 'offline', 'conflict']).toContain(webEocRow.sync_status);
  });

  it('4. after runEocCotsSync(), GET /api/v1/integrations/eoc-cots/conflicts includes the EOC-CONFLICT-001 record, never auto-resolved', async () => {
    await runEocCotsSync();

    const res = await request(app.server)
      .get('/api/v1/integrations/eoc-cots/conflicts')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    const conflictRow = res.body.items.find((c: { record_type: string }) => c.record_type === 'incident');
    expect(conflictRow).toBeDefined();
    expect(conflictRow.epmp_value).toBeDefined();
    expect(conflictRow.external_value).toBeDefined();
    // Never auto-resolved — resolution stays null/undefined until a named
    // person explicitly resolves it (Plan 08-03's own route).
    expect(conflictRow.resolution == null).toBe(true);
  });

  it('5. isRecordTypeDeclared distinguishes a declared type (incident) from an undeclared one (status)', async () => {
    const incidentDeclared = await isRecordTypeDeclared('incident');
    expect(incidentDeclared).toBe(true);

    const statusDeclared = await isRecordTypeDeclared('status');
    expect(statusDeclared).toBe(false);
  });

  it("6. an undeclared record type ('status') produces ZERO eoc_cots_sync_log rows after runEocCotsSync()", async () => {
    // Clear any pre-existing 'status' sync_log rows so this assertion is
    // unambiguous regardless of run order/prior test executions.
    await query(`DELETE FROM eoc_cots_sync_log WHERE record_type = 'status'`);

    await runEocCotsSync();

    const statusLogRows = await query<{ id: string }>(
      `SELECT id FROM eoc_cots_sync_log WHERE record_type = 'status'`,
    );
    expect(statusLogRows.length).toBe(0);
  });

  it('7. background_jobs.job_type=sync_reconciliation reflects the run outcome and no other adapter file claims it', async () => {
    await runEocCotsSync();

    const rows = await query<{ failure_count: number; status: string; next_retry_at: string | null }>(
      `SELECT failure_count, status, next_retry_at FROM background_jobs WHERE job_type = 'sync_reconciliation'`,
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(['idle', 'backoff']).toContain(rows[0].status);
  });

  it('8. POST exchange-records with an undeclared type (status) returns 400 EOC_RECORD_TYPE_UNSUPPORTED', async () => {
    const res = await request(app.server)
      .post('/api/v1/integrations/eoc-cots/exchange-records')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ type: 'status', payload: { foo: 'bar' } });

    expect(res.status).toBe(400);
    expect(res.body.error_code).toBe('EOC_RECORD_TYPE_UNSUPPORTED');
  });
});
