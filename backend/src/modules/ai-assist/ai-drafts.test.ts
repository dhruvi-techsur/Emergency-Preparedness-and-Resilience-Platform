import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as ics-forms.test.ts/notifications.test.ts. Requires:
// docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET
// set; `npm run seed` already run against this same database (this suite
// mints a token for the REAL seeded incident_commander role, which
// Task 2's seed.ts grant actually authorizes for ai_assist — not a
// test-local permission grant that would bypass the real seed entirely).

let testJurisdictionId: string;

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

// Mints a session token for a user whose role_id is the REAL seeded
// incident_commander role (PER-02) — proving this plan's seeded
// ai_assist role_permissions grant genuinely authorizes the correct role,
// not a test-scoped row that would bypass the real seed entirely.
async function mintTokenForSeededRole(roleName: string, jurisdictionId: string): Promise<{ token: string; userId: string }> {
  const roleRows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [roleName]);
  const roleId = roleRows[0]?.id;
  expect(roleId, `Seeded role '${roleName}' must exist — run npm run seed first`).toBeTruthy();

  const email = `ai-drafts-test-${roleName}-${Date.now()}-${Math.random()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, `Test ${roleName}`, roleId, [jurisdictionId]],
  );

  const token = await mintSessionToken({
    id: inserted[0].id,
    role_id: roleId,
    jurisdiction_scope: [jurisdictionId],
  });
  return { token, userId: inserted[0].id };
}

beforeAll(async () => {
  await app.ready();
  testJurisdictionId = await findOrCreateJurisdiction('AI Drafts Test Jurisdiction');

  // Re-sync OPA's data document with whatever role_permissions rows exist
  // right now (including this plan's own seed.ts ai_assist grant, assuming
  // `npm run seed` already ran per this file's own <verify> block) —
  // mirrors every other integration test's beforeAll in this codebase.
  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);
});

afterAll(async () => {
  await pool.end();
});

describe('ai-assist ai-drafts routes (F9 provenance-or-flagged, approver gate, soft discard)', () => {
  it('POST /api/v1/ai-drafts with a non-empty context returns 200 with sources.length > 0 and a qualitative confidence_label', async () => {
    const { token, userId } = await mintTokenForSeededRole('incident_commander', testJurisdictionId);

    const res = await request(app.server)
      .post('/api/v1/ai-drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        target_feature: 'ics_form',
        target_field: 'narrative',
        context: 'Shelter opened at Main St Community Center; 42 residents checked in as of 14:00.',
        requesting_user_id: userId,
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.sources)).toBe(true);
    expect(res.body.sources.length).toBeGreaterThan(0);
    expect(['High', 'Medium', 'Low']).toContain(res.body.confidence_label);
    // Never a bare percentage anywhere in the response.
    expect(JSON.stringify(res.body)).not.toMatch(/\d+%/);
    expect(res.body.error_code).toBeUndefined();

    (globalThis as { __aiDraftSourcedId?: string }).__aiDraftSourcedId = res.body.id;
  });

  it('POST /api/v1/ai-drafts with an EMPTY context returns 200 with error_code AIDRAFT_NO_SOURCE and draft_text containing "No source available"', async () => {
    const { token, userId } = await mintTokenForSeededRole('incident_commander', testJurisdictionId);

    const res = await request(app.server)
      .post('/api/v1/ai-drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        target_feature: 'sitrep',
        target_field: 'narrative',
        context: '',
        requesting_user_id: userId,
      });

    expect(res.status).toBe(200);
    expect(res.body.error_code).toBe('AIDRAFT_NO_SOURCE');
    expect(res.body.draft_text).toContain('No source available');
    expect(res.body.sources).toEqual([]);
  });

  it('POST .../approve with NO approver_id returns 403 APPROVAL_REQUIRES_NAMED_USER with the FRD exact message; approved_by stays NULL', async () => {
    const { token } = await mintTokenForSeededRole('incident_commander', testJurisdictionId);
    const draftId = (globalThis as { __aiDraftSourcedId?: string }).__aiDraftSourcedId!;

    const res = await request(app.server)
      .post(`/api/v1/ai-drafts/${draftId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(403);
    expect(res.body.error_code).toBe('APPROVAL_REQUIRES_NAMED_USER');
    expect(res.body.message).toBe('AI drafts must be approved by a signed-in person.');

    const rows = await query<{ approved_by: string | null }>(
      `SELECT approved_by FROM ai_drafts WHERE id = $1`,
      [draftId],
    );
    expect(rows[0].approved_by).toBeNull();
  });

  it('POST .../approve with a valid approver_id matching the signed-in user succeeds (200), approved_by/approved_at are both non-null', async () => {
    const { token, userId } = await mintTokenForSeededRole('incident_commander', testJurisdictionId);

    // Mint a fresh draft owned by THIS specific user (the prior test's
    // draft was approved-attempt-only, not yet successfully approved, so
    // reusing it here is fine too, but minting fresh keeps this test
    // self-contained and independent of execution order).
    const draftRes = await request(app.server)
      .post('/api/v1/ai-drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        target_feature: 'ics_form',
        target_field: 'narrative',
        context: 'Road closure on Elm St due to flooding, reported by field unit 12.',
        requesting_user_id: userId,
      });
    expect(draftRes.status).toBe(200);
    const draftId = draftRes.body.id;

    const approveRes = await request(app.server)
      .post(`/api/v1/ai-drafts/${draftId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send({ approver_id: userId });

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.approved_by).toBe(userId);
    expect(approveRes.body.approved_at).toBeTruthy();

    const rows = await query<{ approved_by: string | null; approved_at: string | null }>(
      `SELECT approved_by, approved_at FROM ai_drafts WHERE id = $1`,
      [draftId],
    );
    expect(rows[0].approved_by).toBe(userId);
    expect(rows[0].approved_at).toBeTruthy();
  });

  it('POST .../discard on a second draft leaves the row in place with action=discard — never a hard DELETE', async () => {
    const { token, userId } = await mintTokenForSeededRole('incident_commander', testJurisdictionId);

    const draftRes = await request(app.server)
      .post('/api/v1/ai-drafts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        target_feature: 'notification',
        target_field: 'message_body',
        context: 'Public advisory draft, pending review.',
        requesting_user_id: userId,
      });
    expect(draftRes.status).toBe(200);
    const draftId = draftRes.body.id;

    const discardRes = await request(app.server)
      .post(`/api/v1/ai-drafts/${draftId}/discard`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(discardRes.status).toBe(204);

    const rows = await query<{ id: string; action: string | null }>(
      `SELECT id, action FROM ai_drafts WHERE id = $1`,
      [draftId],
    );
    // Proof of no hard DELETE: exactly one row still exists.
    expect(rows).toHaveLength(1);
    expect(rows[0].action).toBe('discard');
  });
});
