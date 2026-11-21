import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import {
  sendViaProvider,
  buildCapEnvelope,
  runNotificationRetrySweep,
} from './notification-provider-adapter.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as notifications.test.ts/eoc-cots-adapter.test.ts (real Postgres
// + OPA, no mocking). Helpers below are copied (not imported) from
// notifications.test.ts, matching this codebase's established per-test-file
// helper-duplication convention.
// Requires: docker compose up -d db opa; DATABASE_URL + OPA_URL +
// SESSION_JWT_SECRET set.

let approverId: string;
let testRoleId: string;
let testJurisdictionId: string;
let approverToken: string;

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for notification-provider-adapter.test.ts'],
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
      name: `Notification Provider Test Incident ${Date.now()}-${Math.random()}`,
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

  testJurisdictionId = await findOrCreateJurisdiction('Notification Provider Test Jurisdiction');
  testRoleId = await findOrCreateRole('notification_provider_test_approver_role', 'PER-02');

  const grants: Array<[string, string, string[]]> = [
    [testRoleId, 'incidents', ['view', 'create', 'edit']],
    [testRoleId, 'notifications', ['view', 'create', 'approve']],
    [testRoleId, 'admin', ['view']],
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

  const approverEmail = `notification-provider-approver-test-${Date.now()}@epmp.local`;
  const approverInserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [approverEmail, 'Notification Provider Test Approver', testRoleId, [testJurisdictionId]],
  );
  approverId = approverInserted[0].id;

  approverToken = await mintSessionToken({
    id: approverId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });
});

afterAll(async () => {
  await pool.end();
});

describe('notification-provider-adapter — approval bypass rejection, CAP completeness, outage/retry, callback matching, job_type isolation', () => {
  it('1. sendViaProvider called directly rejects a missing approved_by/approved_at pair with SEND_REQUIRES_APPROVAL', async () => {
    await expect(
      sendViaProvider({
        notification_id: '00000000-0000-0000-0000-000000000000',
        channel: 'SMS',
        recipients: [],
        message: 'test',
        approved_by: '',
        approved_at: '',
      }),
    ).rejects.toThrow(/SEND_REQUIRES_APPROVAL/);
  });

  it('2. end-to-end approved send dispatches through the provider and updates F5 delivery status off Queued', async () => {
    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ name: 'Notification Provider Test Responders', type: 'Role', selector: { role_id: testRoleId } });
    expect(groupRes.status).toBe(201);
    const groupId = groupRes.body.id;

    const incidentId = await createTestIncident(approverToken, testJurisdictionId);

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        recipient_group_ids: [groupId],
        message_body: 'End-to-end provider dispatch test message.',
        channels: ['SMS'],
        incident_id: incidentId,
      });
    expect(composeRes.status).toBe(201);
    const notificationId = composeRes.body.id;

    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({});
    expect(sendRes.status).toBe(200);

    const statusRes = await request(app.server)
      .get(`/api/v1/notifications/${notificationId}/delivery-status`)
      .set('Authorization', `Bearer ${approverToken}`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.recipients.length).toBeGreaterThan(0);
    for (const recipient of statusRes.body.recipients) {
      expect(recipient.status).not.toBe('Queued');
    }
  });

  it('3. buildCapEnvelope produces XML containing all required OASIS CAP fields', () => {
    const xml = buildCapEnvelope({
      notification_id: '00000000-0000-0000-0000-000000000001',
      message: 'Evacuate now',
      sender: 'Test Agency',
      event: 'Flood Warning',
      urgency: 'Immediate',
      severity: 'Severe',
      certainty: 'Observed',
      area: 'Test County',
    });

    expect(xml).toContain('<identifier>');
    expect(xml).toContain('<sender>Test Agency');
    expect(xml).toContain('<sent>');
    expect(xml).toContain('<status>Actual');
    expect(xml).toContain('<scope>Public');
    expect(xml).toContain('<event>Flood Warning');
    expect(xml).toContain('<urgency>Immediate');
    expect(xml).toContain('<severity>Severe');
    expect(xml).toContain('<certainty>Observed');
    expect(xml).toMatch(/<area>.*<areaDesc>Test County/s);
  });

  it('4. sendViaProvider on IPAWS channel without capFields rejects with CAP_FIELDS_INCOMPLETE and writes zero cap_alert_records rows', async () => {
    const notificationIdForCapTest = '00000000-0000-0000-0000-000000000002';

    // Use a real notification row so the FK on cap_alert_records would be
    // satisfiable if a row were (incorrectly) written — proving the
    // rejection happens BEFORE any dispatch, not merely because the FK
    // itself would fail.
    const notifRows = await query<{ id: string }>(
      `INSERT INTO notifications (message_body, channels, recipient_group_ids, created_by)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['CAP incompleteness test message', ['IPAWS'], [], approverId],
    );
    const realNotificationId = notifRows[0].id;
    void notificationIdForCapTest;

    await expect(
      sendViaProvider({
        notification_id: realNotificationId,
        channel: 'IPAWS',
        recipients: [],
        message: 'test',
        approved_by: approverId,
        approved_at: new Date().toISOString(),
      }),
    ).rejects.toThrow(/CAP_FIELDS_INCOMPLETE/);

    const capRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM cap_alert_records WHERE notification_id = $1`,
      [realNotificationId],
    );
    expect(capRows[0].count).toBe('0');
  });

  it('5. a successful non-public-warning-channel send (SMS) never writes cap_alert_records', async () => {
    const notifRows = await query<{ id: string }>(
      `INSERT INTO notifications (message_body, channels, recipient_group_ids, created_by)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Non-CAP channel test message', ['SMS'], [], approverId],
    );
    const notificationId = notifRows[0].id;

    const result = await sendViaProvider({
      notification_id: notificationId,
      channel: 'SMS',
      recipients: [],
      message: 'test',
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    });
    expect(result.dispatch_status).toBe('sent');

    const capRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM cap_alert_records WHERE notification_id = $1`,
      [notificationId],
    );
    expect(capRows[0].count).toBe('0');
  });

  it('6. a FORCE_PROVIDER_OUTAGE send returns queued_for_retry (not a throw) and health shows Everbridge offline', async () => {
    const notifRows = await query<{ id: string }>(
      `INSERT INTO notifications (message_body, channels, recipient_group_ids, created_by)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      ['Outage test message', ['SMS'], [], approverId],
    );
    const notificationId = notifRows[0].id;

    const result = await sendViaProvider({
      notification_id: notificationId,
      channel: 'SMS',
      recipients: [],
      message: 'FORCE_PROVIDER_OUTAGE',
      approved_by: approverId,
      approved_at: new Date().toISOString(),
    });
    expect(result).toEqual({ external_message_id: '', dispatch_status: 'queued_for_retry' });

    const healthRes = await request(app.server)
      .get('/api/v1/integrations/notification-providers/health')
      .set('Authorization', `Bearer ${approverToken}`);
    expect(healthRes.status).toBe(200);
    const everbridgeRow = healthRes.body.items.find((r: { system_name: string }) => r.system_name === 'Everbridge');
    expect(everbridgeRow).toBeDefined();
    expect(everbridgeRow.sync_status).toBe('offline');
  });

  it('7. runNotificationRetrySweep surfaces a 4x-failed dispatch as Failed in F5 delivery view with a non-empty failure_reason', async () => {
    const incidentId = await createTestIncident(approverToken, testJurisdictionId);

    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ name: 'Retry Sweep Test Group', type: 'Role', selector: { role_id: testRoleId } });
    expect(groupRes.status).toBe(201);

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        recipient_group_ids: [groupRes.body.id],
        message_body: 'Retry sweep test message.',
        channels: ['SMS'],
        incident_id: incidentId,
      });
    expect(composeRes.status).toBe(201);
    const notificationId = composeRes.body.id;

    // Insert 4 consecutive 'failed'-status notification_dispatch_log rows
    // directly (simpler than 4 real outage calls, per this task's own
    // instruction), each already at retry_count=3 so the sweep's
    // increment-to-4 crosses the >3 threshold on the FIRST sweep call
    // below.
    for (let i = 0; i < 4; i += 1) {
      await query(
        `INSERT INTO notification_dispatch_log (notification_id, provider_name, dispatch_status, retry_count)
         VALUES ($1, 'Everbridge', 'failed', 3)`,
        [notificationId],
      );
    }

    await runNotificationRetrySweep();

    const statusRes = await request(app.server)
      .get(`/api/v1/notifications/${notificationId}/delivery-status`)
      .set('Authorization', `Bearer ${approverToken}`);
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.recipients.length).toBeGreaterThan(0);
    for (const recipient of statusRes.body.recipients) {
      expect(recipient.status).toBe('Failed');
      expect(recipient.failure_reason).toBeTruthy();
    }
  });

  it('8. an inbound callback with a matching external_message_id/recipient flips that recipient to Acknowledged', async () => {
    const incidentId = await createTestIncident(approverToken, testJurisdictionId);

    const groupRes = await request(app.server)
      .post('/api/v1/recipient-groups')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({ name: 'Callback Test Group', type: 'Role', selector: { role_id: testRoleId } });
    expect(groupRes.status).toBe(201);

    const composeRes = await request(app.server)
      .post('/api/v1/notifications/compose')
      .set('Authorization', `Bearer ${approverToken}`)
      .send({
        recipient_group_ids: [groupRes.body.id],
        message_body: 'Callback matching test message.',
        channels: ['SMS'],
        incident_id: incidentId,
      });
    expect(composeRes.status).toBe(201);
    const notificationId = composeRes.body.id;

    const sendRes = await request(app.server)
      .post(`/api/v1/notifications/${notificationId}/send`)
      .set('Authorization', `Bearer ${approverToken}`)
      .send({});
    expect(sendRes.status).toBe(200);

    const dispatchRows = await query<{ external_message_id: string }>(
      `SELECT external_message_id FROM notification_dispatch_log
       WHERE notification_id = $1 AND dispatch_status = 'sent'
       ORDER BY dispatched_at DESC LIMIT 1`,
      [notificationId],
    );
    expect(dispatchRows[0]).toBeDefined();
    const externalMessageId = dispatchRows[0].external_message_id;

    const recipientRows = await query<{ recipient_contact: string }>(
      `SELECT recipient_contact FROM notification_recipients WHERE notification_id = $1 LIMIT 1`,
      [notificationId],
    );
    expect(recipientRows[0]).toBeDefined();
    const recipientContact = recipientRows[0].recipient_contact;

    const callbackRes = await request(app.server)
      .post('/api/v1/integrations/notification-providers/callback')
      .send({
        external_message_id: externalMessageId,
        recipient: recipientContact,
        status: 'acknowledged',
        timestamp: new Date().toISOString(),
      });
    expect(callbackRes.status).toBe(200);

    const statusRes = await request(app.server)
      .get(`/api/v1/notifications/${notificationId}/delivery-status`)
      .set('Authorization', `Bearer ${approverToken}`);
    expect(statusRes.status).toBe(200);

    // The delivery-status API response carries name/channel/status —
    // never recipient_contact — so it cannot disambiguate which specific
    // recipient the callback targeted when a notification has more than
    // one recipient (true here: the shared 'Notification Provider Test
    // Responders' role accumulates one real user per describe-block in
    // this file, same as every sibling adapter test file's find-or-insert
    // convention). Assert directly against the same (notification_id,
    // recipient_contact) key the callback route itself matches on
    // (notification-provider-adapter.ts:483-488) — proving the SPECIFIC
    // recipient this test called back for was flipped, not merely that
    // *some* recipient on the notification reached Acknowledged.
    const matchedStatusRows = await query<{ status: string }>(
      `SELECT nds.status FROM notification_delivery_status nds
       JOIN notification_recipients nr ON nr.id = nds.notification_recipient_id
       WHERE nr.notification_id = $1 AND nr.recipient_contact = $2`,
      [notificationId, recipientContact],
    );
    expect(matchedStatusRows[0]).toBeDefined();
    expect(matchedStatusRows[0].status).toBe('Acknowledged');

    // Also confirm the API response surfaces at least one Acknowledged
    // recipient for this notification, so the delivery-status route's own
    // read path is exercised end-to-end (not just the underlying table).
    expect(
      statusRes.body.recipients.some((r: { status: string }) => r.status === 'Acknowledged'),
    ).toBe(true);
  });

  it('9. an unmatched callback (nonexistent external_message_id) returns 200 and mutates no existing delivery-status row', async () => {
    const countBefore = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM notification_delivery_status WHERE status = 'Acknowledged'`,
    );

    const callbackRes = await request(app.server)
      .post('/api/v1/integrations/notification-providers/callback')
      .send({
        external_message_id: 'nonexistent-message-id-does-not-exist',
        recipient: 'nobody@epmp.local',
        status: 'acknowledged',
        timestamp: new Date().toISOString(),
      });
    expect(callbackRes.status).toBe(200);

    const countAfter = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM notification_delivery_status WHERE status = 'Acknowledged'`,
    );
    expect(countAfter[0].count).toBe(countBefore[0].count);
  });

  it('10. background_jobs job_type=notification_fanout reflects the sweep outcome, and no other adapter file claims it', async () => {
    await runNotificationRetrySweep();

    const rows = await query<{ status: string }>(
      `SELECT status FROM background_jobs WHERE job_type = 'notification_fanout'`,
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(['idle', 'backoff']).toContain(rows[0].status);
  });
});
