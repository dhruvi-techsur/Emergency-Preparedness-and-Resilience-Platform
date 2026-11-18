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
