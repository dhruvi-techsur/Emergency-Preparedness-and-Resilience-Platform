import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as 03-03/03-05's plans.test.ts. Requires:
// docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET
// set.

let approverId: string;
let nonApproverId: string;
let testRoleId: string;
let noApproveRoleId: string;
let testJurisdictionId: string;
let approverToken: string;
let nonApproverToken: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for notifications.test.ts'],
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

async function createTestIncident(token: string, jurisdictionId: string): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Notifications Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

beforeAll(async () => {
  await app.ready();

  testJurisdictionId = await findOrCreateJurisdiction('Notifications Test Jurisdiction');
  testRoleId = await findOrCreateRole('notifications_test_approver_role', 'PER-02');
  noApproveRoleId = await findOrCreateRole('notifications_test_no_approve_role', 'PER-05');

  const grants: Array<[string, string, string[]]> = [
    [testRoleId, 'incidents', ['view', 'create', 'edit']],
    [testRoleId, 'notifications', ['view', 'create', 'approve']],
    [noApproveRoleId, 'notifications', ['view', 'create']],
  ];
  for (const [roleId, feature, actions] of grants) {
    const existingPerm = await query<{ id: string }>(
      `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
      [roleId, feature],
    );
    if (!existingPerm[0]) {
      await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
        roleId,
        feature,
        actions,
      ]);
    } else {
      await query(`UPDATE role_permissions SET actions = $1 WHERE id = $2`, [actions, existingPerm[0].id]);
    }
  }

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const approverEmail = `notifications-approver-test-${Date.now()}@epmp.local`;
  const approverInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [approverEmail, 'Notifications Test Approver', testRoleId, [testJurisdictionId]],
  );
  approverId = approverInserted[0].id;

  const nonApproverEmail = `notifications-nonapprover-test-${Date.now()}@epmp.local`;
  const nonApproverInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [nonApproverEmail, 'Notifications Test Non Approver', noApproveRoleId, [testJurisdictionId]],
  );
  nonApproverId = nonApproverInserted[0].id;

  approverToken = await mintSessionToken({
    id: approverId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
  nonApproverToken = await mintSessionToken({
    id: nonApproverId,
    role_id: noApproveRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('notifications module — audience gate, approver gate, AI-governance gate, delivery-status shape', () => {
  it('composing with no audience returns 422 NO_AUDIENCE_SELECTED and writes no row', async () => {
    const countBefore = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM notifications`);

    const res = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        message_body: 'Test message with no audience',
        channels: ['sms'],
      });
    expect(res.status).toBe(422);
    expect(res.body.error_code).toBe('NO_AUDIENCE_SELECTED');

    const countAfter = await query<{ count: string }>(`SELECT COUNT(*) AS count FROM notifications`);
    expect(countAfter[0].count).toBe(countBefore[0].count);
  });

  it('full flow: compose -> approver-mismatch rejected -> correct approver sends -> incident Timeline written -> delivery-status shape valid', async () => {
    // Create a recipient group (Role type) referencing the approver's own role.
    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ name: 'Test Responders', type: 'Role', selector: { role_id: testRoleId } });
    expect(groupRes.status).toBe(201);
    const groupId = groupRes.body.id;

    const incidentId = await createTestIncident(approverToken, testJurisdictionId);

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        recipient_group_ids: [groupId],
        message_body: 'Flood warning: evacuate low-lying areas immediately.',
        channels: ['sms'],
        incident_id: incidentId,
      });
    expect(composeRes.status).toBe(201);
    const notificationId = composeRes.body.id;

    // Approver-mismatch: the signed-in caller DOES hold notifications:approve
    // (required to even reach this route's preHandler), but asserts a
    // approver_id belonging to a DIFFERENT user (the seeded non-approver,
    // who holds no approve action at all) — the server never trusts a
    // client-asserted approver_id that doesn't match the caller's own
    // identity, regardless of what permission that other id's role holds.
    const mismatchRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ approver_id: nonApproverId, confirmed: true });
    expect(mismatchRes.status).toBe(403);
    expect(mismatchRes.body.error_code).toBe('APPROVER_MISMATCH');

    const afterMismatch = await query<{ approved_by: string | null; sent_at: string | null }>(
      `SELECT approved_by, sent_at FROM notifications WHERE id = $1`,
      [notificationId],
    );
    expect(afterMismatch[0].approved_by).toBeNull();
    expect(afterMismatch[0].sent_at).toBeNull();

    // Correctly-permissioned approver sends successfully.
    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ approver_id: approverId, confirmed: true });
    expect(sendRes.status).toBe(200);
    expect(sendRes.body.approved_by).toBeTruthy();
    expect(sendRes.body.sent_at).toBeTruthy();

    const afterSend = await query<{ approved_by: string | null; sent_at: string | null }>(
      `SELECT approved_by, sent_at FROM notifications WHERE id = $1`,
      [notificationId],
    );
    expect(afterSend[0].approved_by).toBe(approverId);
    expect(afterSend[0].sent_at).toBeTruthy();

    // Incident Timeline shows exactly one "Notification sent: ..." entry.
    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${approverToken}`);
    expect(timelineRes.status).toBe(200);
    const notifEntries = timelineRes.body.items.filter((e: { title: string }) =>
      e.title.startsWith('Notification sent:'),
    );
    expect(notifEntries).toHaveLength(1);
    expect(notifEntries[0].actor_id ?? notifEntries[0].actor?.id).toBeTruthy();

    // Delivery-status shape: every recipient's status is in the exact DDL
    // enum, ack_percentage is a number.
    const deliveryRes = await request(app.server)
      .get(`/api/v1/notifications/${notificationId}/delivery-status`)
      .set('Authorization', `Bearer ${approverToken}`);
    expect(deliveryRes.status).toBe(200);
    expect(typeof deliveryRes.body.ack_percentage).toBe('number');
    const validStatuses = ['Queued', 'Sent', 'Delivered', 'Failed', 'Acknowledged'];
    for (const recipient of deliveryRes.body.recipients) {
      expect(validStatuses).toContain(recipient.status);
    }
  });

  it('AI-governance gate: sending ai_origin:true content with an unapproved ai_draft is blocked, then succeeds after approval', async () => {
    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ name: 'AI Test Group', type: 'Role', selector: { role_id: testRoleId } });
    expect(groupRes.status).toBe(201);
    const groupId = groupRes.body.id;

    // Create an AI draft (stub endpoint) — NOT yet approved.
    const draftRes = await request(app.server)
      .post('/api/v1/ai-drafts')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        target_feature: 'notification',
        target_field: 'message_body',
        context: 'River gauge exceeding flood stage near downtown.',
        requesting_user_id: approverId,
      });
    expect(draftRes.status).toBe(201);
    const draftId = draftRes.body.id;

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        recipient_group_ids: [groupId],
        message_body: draftRes.body.draft_text,
        channels: ['email'],
        ai_origin: true,
        ai_draft_id: draftId,
      });
    expect(composeRes.status).toBe(201);
    const notificationId = composeRes.body.id;

    // Send attempt BEFORE draft approval: 400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED.
    const blockedSendRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ approver_id: approverId, confirmed: true });
    expect(blockedSendRes.status).toBe(400);
    expect(blockedSendRes.body.error_code).toBe('AIDRAFT_UNAPPROVED_WRITE_BLOCKED');

    // Approve the draft.
    const approveDraftRes = await request(app.server)
      .post(`/api/v1/ai-drafts/${draftId}/approve`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ approver_id: approverId });
    expect(approveDraftRes.status).toBe(200);
    expect(approveDraftRes.body.approved_by).toBe(approverId);

    // Retry send: now succeeds.
    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ approver_id: approverId, confirmed: true });
    expect(sendRes.status).toBe(200);
    expect(sendRes.body.sent_at).toBeTruthy();
  });
});

// 04-04: proves the REAL seed script's role_permissions grants for
// notifications/reporting actually authorize (or correctly reject) real
// requests end-to-end through OPA — not just that the rows exist in the
// database. Follows 03-07's exact precedent in incidents.test.ts:
// deliberately does NOT insert any custom test-only role_permissions row
// for notifications/reporting on the FRD-named roles — every permission
// check below resolves against whatever `backend/scripts/seed.ts` itself
// already wrote for incident_commander/eoc_director/field_responder. This
// file's `npm run seed` must have already run against the same database
// this test suite connects to (see this plan's own <verify> block, which
// runs `npm run seed` immediately before `vitest run` for exactly this
// reason) — if it hasn't, `findSeededRoleId` below throws a clear error
// rather than silently creating a throwaway role that would make this
// test pass for the wrong reason.
describe('04-04: seeded role_permissions grants authorize/reject real requests end-to-end', () => {
  let seededJurisdictionId: string;
  let commanderRoleId: string;
  let eocDirectorRoleId: string;
  let fieldResponderRoleId: string;
  let commanderUserId: string;
  let eocDirectorUserId: string;
  let fieldResponderUserId: string;
  let sharedRecipientGroupId: string;

  async function findSeededRoleId(name: string): Promise<string> {
    const rows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
    if (!rows[0]) {
      throw new Error(
        `Role '${name}' not found — this test requires 'npm run seed' to have already run ` +
          `against this database (per this plan's own <verify> block), so the REAL seeded ` +
          `role_permissions grants from backend/scripts/seed.ts can be exercised end-to-end.`,
      );
    }
    return rows[0].id;
  }

  async function createSeededRoleTestUser(roleId: string, label: string): Promise<string> {
    const email = `seed-perm-test-${label}-${Date.now()}-${Math.random().toString(36).slice(2)}@epmp.local`;
    const inserted = await query<{ id: string }>(
      `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
      [email, `Seed Perm Test ${label}`, roleId, [seededJurisdictionId]],
    );
    return inserted[0].id;
  }

  beforeAll(async () => {
    seededJurisdictionId = await findOrCreateJurisdiction('04-04 Seed Permissions Test Jurisdiction');

    commanderRoleId = await findSeededRoleId('incident_commander');
    eocDirectorRoleId = await findSeededRoleId('eoc_director');
    fieldResponderRoleId = await findSeededRoleId('field_responder');

    // Re-sync the FULL current role_permissions table to OPA's data
    // document — OPA's data starts EMPTY on every container boot
    // (server.ts's own startup-sync docstring), so a test run against a
    // freshly-started OPA container would fail-closed on every check
    // without this. This is a re-sync of REAL rows already written by
    // `npm run seed`, not an insertion of new test-only grants — same
    // precedent 03-07 established in incidents.test.ts.
    const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
      `SELECT role_id, feature, actions FROM role_permissions`,
    );
    await syncRolePermissionsToOpa(allPerms);

    commanderUserId = await createSeededRoleTestUser(commanderRoleId, 'ic-04-04');
    eocDirectorUserId = await createSeededRoleTestUser(eocDirectorRoleId, 'eocd-04-04');
    fieldResponderUserId = await createSeededRoleTestUser(fieldResponderRoleId, 'fr-04-04');

    // One shared Role-type recipient group (targeting the seeded
    // incident_commander role) composed notifications can reference as
    // their audience — recipient_groups carries no jurisdiction/incident
    // scoping, so a single group serves every compose call below.
    const commanderToken = await mintSessionToken({
      id: commanderUserId,
      role_id: commanderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });
    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ name: '04-04 Seed Test Responders', type: 'Role', selector: { role_id: commanderRoleId } });
    expect(groupRes.status).toBe(201);
    sharedRecipientGroupId = groupRes.body.id;
  });

  it("incident_commander's seeded notifications 'approve' grant authorizes a real compose->send as approver_id (200)", async () => {
    const commanderToken = await mintSessionToken({
      id: commanderUserId,
      role_id: commanderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({
        recipient_group_ids: [sharedRecipientGroupId],
        message_body: '04-04 seed-permission test: incident_commander compose+send',
        channels: ['sms'],
      });
    expect(composeRes.status).toBe(201);

    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${composeRes.body.id}/send`)
      .set('Authorization', `Bearer ${commanderToken}`)
      .send({ approver_id: commanderUserId, confirmed: true });
    expect(sendRes.status).toBe(200);
    expect(sendRes.body.approved_by.id).toBe(commanderUserId);
    expect(sendRes.body.sent_at).toBeTruthy();
  });

  it("eoc_director's seeded notifications grant correctly EXCLUDES 'approve' — POST .../send as approver_id is rejected (403), never reaching Sent", async () => {
    const eocDirectorToken = await mintSessionToken({
      id: eocDirectorUserId,
      role_id: eocDirectorRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    // eoc_director's seeded grant includes 'create' (confirmed by this
    // compose succeeding) but deliberately not 'approve', per this plan's
    // seed design (PER-02's PIO-merge holds the ONLY approve grant).
    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${eocDirectorToken}`)
      .send({
        recipient_group_ids: [sharedRecipientGroupId],
        message_body: '04-04 seed-permission test: eoc_director compose, cannot approve',
        channels: ['sms'],
      });
    expect(composeRes.status).toBe(201);

    // The send route's preHandler gates on requirePermission('notifications',
    // 'approve') BEFORE the route handler's own approver_id-match logic ever
    // runs — since eoc_director's seeded grant has no 'approve' action, OPA
    // denies at the RBAC layer and the caller never reaches the handler's
    // APPROVER_MISMATCH business-logic check at all. The resulting 403 (with
    // rbac.ts's PERMISSION_DENIED error_code — a resolved role simply lacking
    // this one action, NOT a role-resolution failure, so ROLE_UNRESOLVED
    // would be the wrong/misleading response here — not APPROVER_MISMATCH) is
    // the correct, stronger proof that the exclusion is real: a role missing
    // 'approve' cannot even START a send attempt as itself, regardless of
    // what approver_id it asserts.
    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${composeRes.body.id}/send`)
      .set('Authorization', `Bearer ${eocDirectorToken}`)
      .send({ approver_id: eocDirectorUserId, confirmed: true });
    expect(sendRes.status).toBe(403);
    expect(sendRes.body.error_code).toBe('PERMISSION_DENIED');

    const afterRejected = await query<{ approved_by: string | null; sent_at: string | null }>(
      `SELECT approved_by, sent_at FROM notifications WHERE id = $1`,
      [composeRes.body.id],
    );
    expect(afterRejected[0].approved_by).toBeNull();
    expect(afterRejected[0].sent_at).toBeNull();
  });

  it("field_responder's seeded view-only notifications grant permits GET /recipient-groups (200) but rejects POST /compose create (403)", async () => {
    const fieldResponderToken = await mintSessionToken({
      id: fieldResponderUserId,
      role_id: fieldResponderRoleId,
      jurisdiction_scope: [seededJurisdictionId],
    });

    const getRes = await request(app.server)
      .get('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${fieldResponderToken}`);
    expect(getRes.status).toBe(200);

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${fieldResponderToken}`)
      .send({
        recipient_group_ids: [sharedRecipientGroupId],
        message_body: 'field_responder should not be able to create this',
        channels: ['sms'],
      });
    expect(composeRes.status).toBe(403);
  });
});
