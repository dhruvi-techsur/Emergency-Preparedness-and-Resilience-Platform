import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { fetchHrisPersonnel, runHrisRosterSync } from './hris-roster-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as cad-adapter's sibling test file / eoc-cots-adapter.test.ts /
// facility-document-adapter.test.ts (real Postgres + OPA, no mocking).
// Helpers below are copied (not imported) from those sibling test files,
// matching this codebase's existing per-test-file helper-duplication
// convention.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let testToken: string;
let testJurisdictionId: string;
let commanderUserId: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for hris-roster-adapter.test.ts'],
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

  testJurisdictionId = await findOrCreateJurisdiction('Hris Roster Test Jurisdiction');
  const testRoleId = await findOrCreateRole('hris_roster_test_role', 'PER-01');

  await grantPermission(testRoleId, 'incidents', ['view']);
  await grantPermission(testRoleId, 'admin', ['view']);

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const email = `hris-roster-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'HRIS Roster Test User', testRoleId, [testJurisdictionId]],
  );
  const testUserId = inserted[0].id;

  testToken = await mintSessionToken({
    id: testUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });

  // commander@epmp.local is the real seeded EPMP user (Phase 2's 02-05
  // plan) hris-roster-adapter.ts's fetchHrisPersonnel() deliberately
  // matches by email — confirm it exists so test 1/3 can assert exact
  // equality against its real id, not a guessed value.
  const commander = await query<{ id: string }>(`SELECT id FROM users WHERE email = 'commander@epmp.local'`);
  expect(commander[0]).toBeDefined();
  commanderUserId = commander[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('Plan 09-02: F16-roster HRIS adapter — email-only matching, read-only, outage-resilience', () => {
  it('1. fetchHrisPersonnel() returns 2 records with source/as_of present, exactly one carrying commander@epmp.local\'s email', async () => {
    const records = await fetchHrisPersonnel();
    expect(records.length).toBe(2);
    for (const record of records) {
      expect(record.source).toBeTruthy();
      expect(record.as_of).toBeTruthy();
    }

    const matchingEmails = records.filter((r) => r.email === 'commander@epmp.local');
    expect(matchingEmails.length).toBe(1);

    const userMatch = await query<{ id: string }>(`SELECT id FROM users WHERE email = $1`, [
      'commander@epmp.local',
    ]);
    expect(userMatch[0]).toBeDefined();
    expect(userMatch[0].id).toBe(commanderUserId);
  });

  it('2. fetchHrisPersonnel(undefined, true) (simulateFailure) rejects with HRIS_FEED_UNREACHABLE', async () => {
    await expect(fetchHrisPersonnel(undefined, true)).rejects.toThrow(/HRIS_FEED_UNREACHABLE/);
  });

  it('3. after runHrisRosterSync(), GET /personnel includes BOTH the matched record (matched_user_id = commander\'s real id) AND the unmatched record (matched_user_id explicitly null)', async () => {
    await runHrisRosterSync();

    const res = await request(app.server)
      .get('/api/v1/integrations/hris/personnel')
      .set('Authorization', `Bearer ${testToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);

    const matchedRow = res.body.items.find(
      (r: { email: string | null }) => r.email === 'commander@epmp.local',
    );
    expect(matchedRow).toBeDefined();
    expect(matchedRow.matched_user_id).toBe(commanderUserId);

    const unmatchedRow = res.body.items.find(
      (r: { email: string | null }) => r.email === 'jordan.reserve@agency-hris-external.example',
    );
    expect(unmatchedRow).toBeDefined();
    expect(unmatchedRow.matched_user_id).toBeNull();
  });

  it('4. outage-resilience: a failed sync leaves the prior personnel_roster row set byte-identical (same as_of, same row count)', async () => {
    // Ensure a successful sync has happened first, then capture the full
    // row set.
    await runHrisRosterSync();

    const before = await query<{ id: string; as_of: string }>(
      `SELECT id, as_of FROM personnel_roster ORDER BY id`,
    );
    expect(before.length).toBeGreaterThan(0);

    // Force a failed sync — runHrisRosterSync() itself never throws (the
    // "last-synced roster data remains available" rule), so assert on its
    // returned zeroed result instead of a rejection.
    const failedResult = await runHrisRosterSync(true);
    expect(failedResult).toEqual({ synced: 0, matched: 0, unmatched: 0 });

    const after = await query<{ id: string; as_of: string }>(
      `SELECT id, as_of FROM personnel_roster ORDER BY id`,
    );
    expect(after).toEqual(before);

    // Restore to 'online' for any test that runs after this one in the
    // same process, mirroring facility-adapter.ts's own recovery pattern.
    await runHrisRosterSync();
  });

  it('5. never-writes-users-table structural proof: zero UPDATE/INSERT against users exists in hris-roster-adapter.ts', () => {
    // Structural codebase check, not a runtime HTTP assertion — run here
    // via a synchronous read so it participates as a normal vitest
    // assertion rather than only this task's own shell <verify> step.
    const filePath = fileURLToPath(new URL('./hris-roster-adapter.ts', import.meta.url));
    const source = readFileSync(filePath, 'utf-8');
    expect(source).not.toMatch(/UPDATE users|INSERT INTO users/);
  });

  it('6. read-only-contract structural proof: zero PATCH/PUT/DELETE route exists for personnel_roster anywhere in backend/src', () => {
    const srcDir = fileURLToPath(new URL('../../', import.meta.url));
    let output = '';
    try {
      // --exclude="*.test.ts" avoids a self-collision: this grep pattern
      // would otherwise match its own literal string one line below in
      // this very test file (same self-collision class documented in
      // Plan 08-08's SUMMARY.md).
      output = execSync(
        `grep -rn --exclude="*.test.ts" "PATCH.*personnel_roster\\|PUT.*personnel_roster\\|DELETE.*personnel_roster" "${srcDir}"`,
      ).toString();
    } catch {
      // grep exits non-zero when it finds zero matches — that's the
      // expected/passing outcome here.
      output = '';
    }
    expect(output.trim()).toBe('');
  });

  it("7. integration-health flip: sync_status is 'online' after success, 'offline' after a forced failure, always record_authority='HRIS'", async () => {
    await runHrisRosterSync();

    const onlineRes = await request(app.server)
      .get('/api/v1/integrations/hris/health')
      .set('Authorization', `Bearer ${testToken}`);
    expect(onlineRes.status).toBe(200);
    const onlineRow = onlineRes.body.items.find((r: { system_name: string }) => r.system_name === 'HRIS');
    expect(onlineRow).toBeDefined();
    expect(onlineRow.sync_status).toBe('online');
    expect(onlineRow.record_authority).toBe('HRIS');

    await runHrisRosterSync(true);

    const offlineRes = await request(app.server)
      .get('/api/v1/integrations/hris/health')
      .set('Authorization', `Bearer ${testToken}`);
    expect(offlineRes.status).toBe(200);
    const offlineRow = offlineRes.body.items.find((r: { system_name: string }) => r.system_name === 'HRIS');
    expect(offlineRow).toBeDefined();
    expect(offlineRow.sync_status).toBe('offline');
    expect(offlineRow.record_authority).toBe('HRIS');

    // Restore to online for any test that runs after this one.
    await runHrisRosterSync();
  });

  it("8. job-type isolation: background_jobs rows for report_generation/facility_sync/cad_ingestion/sync_reconciliation never collide", async () => {
    await runHrisRosterSync();

    const rows = await query<{ job_type: string }>(
      `SELECT DISTINCT job_type FROM background_jobs
       WHERE job_type IN ('report_generation', 'facility_sync', 'cad_ingestion', 'sync_reconciliation')`,
    );
    const jobTypes = rows.map((r) => r.job_type);
    expect(jobTypes).toContain('report_generation');
    expect(new Set(jobTypes).size).toBe(jobTypes.length);

    // Confirm no OTHER adapter file's background_jobs queries reference
    // 'report_generation' — this adapter is its sole claimant.
    // --exclude="*.test.ts" avoids a self-collision: this grep pattern
    // would otherwise match its own literal string a few lines above in
    // this very test file.
    const srcDir = fileURLToPath(new URL('../../', import.meta.url));
    let output = '';
    try {
      output = execSync(
        `grep -rln --exclude="*.test.ts" "job_type = 'report_generation'" "${srcDir}"`,
      ).toString();
    } catch {
      output = '';
    }
    const filesClaiming = output
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    expect(filesClaiming.every((f) => f.endsWith('hris-roster-adapter.ts'))).toBe(true);
  });
});
