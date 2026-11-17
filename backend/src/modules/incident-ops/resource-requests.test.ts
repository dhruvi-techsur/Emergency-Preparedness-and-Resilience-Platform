import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { connectNats } from '../integration-gateway/nats-client.js';
import { startWebhookDeliveryWorker } from '../integration-gateway/webhook-delivery-worker.js';

// Integration test against the real compose stack (Postgres + NATS + OPA) —
// same pattern as 01-09's eventbus.test.ts: a throwaway local HTTP listener
// registered as a webhook subscriber for resource_request.status_changed
// proves the event actually flows from publishEvent() through durable
// JetStream delivery to an external subscriber, not just that publishEvent
// was called.
// Requires: docker compose up -d db nats opa; DATABASE_URL + NATS_URL +
// OPA_URL + SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;
let token: string;

let receiverServer: http.Server;
let receiverPort: number;
const receivedBodies: Array<Record<string, unknown>> = [];

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for resource-requests.test.ts'],
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

async function createTestIncident(jurisdictionId: string): Promise<string> {
  const res = await request(app.server)
    .post('/api/v1/incidents')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: `Resource Requests Test Incident ${Date.now()}-${Math.random()}`,
      type: 'Flood',
      severity: 'Normal',
      jurisdiction_id: jurisdictionId,
      opened_at: new Date().toISOString(),
    });
  expect(res.status).toBe(201);
  return res.body.id;
}

function waitFor(predicate: () => boolean, timeoutMs: number): Promise<void> {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const poll = () => {
      if (predicate()) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error('waitFor timed out'));
      setTimeout(poll, 200);
    };
    poll();
  });
}

beforeAll(async () => {
  await app.ready();
  await connectNats();
  await startWebhookDeliveryWorker();

  testJurisdictionId = await findOrCreateJurisdiction('Resource Requests Test Jurisdiction');
  testRoleId = await findOrCreateRole('resource_requests_test_role', 'PER-03');

  // Grant incidents (for the incident-creation helper), resource_requests
  // (view/create/approve/edit — approve covers both approve and decline per
  // this plan's design), and admin:create (for the webhook-subscription
  // registration route, same as 01-09's eventbus.test.ts).
  const grants: Array<[string, string[]]> = [
    ['incidents', ['view', 'create', 'edit']],
    ['resource_requests', ['view', 'create', 'approve', 'edit']],
    ['admin', ['view', 'create', 'edit', 'approve']],
  ];
  for (const [feature, actions] of grants) {
    const existingPerm = await query<{ id: string }>(
      `SELECT id FROM role_permissions WHERE role_id = $1 AND feature = $2`,
      [testRoleId, feature],
    );
    if (!existingPerm[0]) {
      await query(`INSERT INTO role_permissions (role_id, feature, actions) VALUES ($1, $2, $3)`, [
        testRoleId,
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

  const email = `resource-requests-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Resource Requests Test User', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;

  token = await mintSessionToken({
    id: testUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });

  // Throwaway HTTP server acting as the webhook receiver for the event-bus proof.
  receiverServer = http.createServer((req, res) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        receivedBodies.push(JSON.parse(raw));
      } catch {
        // ignore malformed body
      }
      res.writeHead(200);
      res.end();
    });
  });
  await new Promise<void>((resolve) => receiverServer.listen(0, '127.0.0.1', resolve));
  receiverPort = (receiverServer.address() as AddressInfo).port;

  const subRes = await request(app.server)
    .post('/api/v1/admin/webhook-subscriptions')
    .set('Authorization', `Bearer ${token}`)
    .send({
      callback_url: `http://127.0.0.1:${receiverPort}/webhook`,
      event_types: ['resource_request.status_changed'],
      secret: 'resource-requests-test-secret',
    });
  expect(subRes.status).toBe(201);
});

afterAll(async () => {
  await new Promise<void>((resolve) => receiverServer.close(() => resolve()));
  await pool.end();
});

describe('incident-ops resource-request routes', () => {
  it('POST /api/v1/resource-requests immediately moves Draft -> Awaiting approval; 2 status-history rows written', async () => {
    const incidentId = await createTestIncident(testJurisdictionId);

    const createRes = await request(app.server)
      .post('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resource_type: 'Equipment',
        description: 'Portable generators for shelter power',
        quantity: 3,
        incident_id: incidentId,
        needed_by: new Date(Date.now() + 86_400_000).toISOString(),
        requesting_role: 'Logistics',
      });

    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('Awaiting approval');
    const requestId = createRes.body.id;

    const historyRows = await query<{ from_status: string | null; to_status: string }>(
      `SELECT from_status, to_status FROM resource_request_status_history WHERE resource_request_id = $1 ORDER BY changed_at ASC`,
      [requestId],
    );
    expect(historyRows).toHaveLength(2);
    expect(historyRows[0]).toEqual({ from_status: null, to_status: 'Draft' });
    expect(historyRows[1]).toEqual({ from_status: 'Draft', to_status: 'Awaiting approval' });

    // Decline without a reason: 422, no write, status unchanged.
    const declineNoReasonRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/decline`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(declineNoReasonRes.status).toBe(422);
    expect(declineNoReasonRes.body.error_code).toBe('DECLINE_REASON_REQUIRED');

    const unchangedRes = await request(app.server)
      .get('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${token}`)
      .query({ incident: incidentId });
    expect(unchangedRes.status).toBe(200);
    const unchangedItem = unchangedRes.body.items.find((i: { id: string }) => i.id === requestId);
    expect(unchangedItem.status).toBe('Awaiting approval');

    // Decline with a reason: 200, Declined, decline_reason populated.
    const declineRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/decline`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason: 'Insufficient supply at this time' });
    expect(declineRes.status).toBe(200);
    expect(declineRes.body.status).toBe('Declined');
    expect(declineRes.body.decline_reason).toBe('Insufficient supply at this time');

    // Timeline proof: created + declined entries exist on this incident.
    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const titles = timelineRes.body.items.map((i: { title: string }) => i.title);
    expect(titles.some((t: string) => t.includes('Resource request:'))).toBe(true);
    expect(titles.some((t: string) => t.includes('Resource request declined:'))).toBe(true);
  });

  it('approve -> two-phase assign-then-fulfill flow; Timeline proves full lifecycle; event-bus publishes resource_request.status_changed', async () => {
    const incidentId = await createTestIncident(testJurisdictionId);

    const createRes = await request(app.server)
      .post('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resource_type: 'Personnel',
        description: 'Two additional logistics crew members',
        quantity: 2,
        incident_id: incidentId,
        needed_by: new Date(Date.now() + 86_400_000).toISOString(),
        requesting_role: 'Logistics',
      });
    expect(createRes.status).toBe(201);
    const requestId = createRes.body.id;

    const approveRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(approveRes.status).toBe(200);
    expect(approveRes.body.status).toBe('Approved');

    // First fulfill call with assigned_to not yet set on the row: assign-only.
    const assignRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/fulfill`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assigned_to: 'Logistics crew 2' });
    expect(assignRes.status).toBe(200);
    expect(assignRes.body.status).toBe('Approved'); // still Approved, not yet Fulfilled
    expect(assignRes.body.assigned_to).toBe('Logistics crew 2');

    // Second fulfill call with the same assigned_to: true fulfill.
    const fulfillRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/fulfill`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assigned_to: 'Logistics crew 2' });
    expect(fulfillRes.status).toBe(200);
    expect(fulfillRes.body.status).toBe('Fulfilled');

    const fulfilledRow = await query<{ fulfilled_at: string | null }>(
      `SELECT fulfilled_at FROM resource_requests WHERE id = $1`,
      [requestId],
    );
    expect(fulfilledRow[0].fulfilled_at).not.toBeNull();

    // Assign-only call wrote NO status-history row (metadata, not a status
    // transition); only Draft, Awaiting approval, Approved, Fulfilled exist.
    const historyRows = await query<{ to_status: string }>(
      `SELECT to_status FROM resource_request_status_history WHERE resource_request_id = $1 ORDER BY changed_at ASC`,
      [requestId],
    );
    expect(historyRows.map((r) => r.to_status)).toEqual(['Draft', 'Awaiting approval', 'Approved', 'Fulfilled']);

    // Timeline integration: created, approved, fulfilled entries exist for this incident.
    const timelineRes = await request(app.server)
      .get(`/api/v1/incidents/${incidentId}/timeline`)
      .set('Authorization', `Bearer ${token}`);
    expect(timelineRes.status).toBe(200);
    const titles = timelineRes.body.items.map((i: { title: string }) => i.title);
    expect(titles.some((t: string) => t.includes('Resource request:'))).toBe(true);
    expect(titles.some((t: string) => t.includes('Resource request approved:'))).toBe(true);
    expect(titles.some((t: string) => t.includes('Resource request fulfilled:'))).toBe(true);

    // Event-bus proof: at least one resource_request.status_changed event
    // was delivered to the registered webhook subscriber during this test
    // run, with a payload containing the correct id/status/incident_id.
    await waitFor(
      () =>
        receivedBodies.some(
          (b) =>
            b.event_type === 'resource_request.status_changed' &&
            (b.payload as { id?: string })?.id === requestId &&
            (b.payload as { status?: string })?.status === 'Fulfilled',
        ),
      10_000,
    );
    const delivered = receivedBodies.find(
      (b) =>
        b.event_type === 'resource_request.status_changed' &&
        (b.payload as { id?: string })?.id === requestId &&
        (b.payload as { status?: string })?.status === 'Fulfilled',
    )!;
    expect(delivered.payload).toMatchObject({ id: requestId, status: 'Fulfilled', incident_id: incidentId });
  });

  it('POST /api/v1/resource-requests with quantity < 1 returns 422 before any write', async () => {
    const incidentId = await createTestIncident(testJurisdictionId);
    const beforeCount = await query<{ count: string }>(`SELECT count(*) FROM resource_requests`);

    const res = await request(app.server)
      .post('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resource_type: 'Supplies',
        description: 'Invalid quantity test',
        quantity: 0,
        incident_id: incidentId,
        needed_by: new Date(Date.now() + 86_400_000).toISOString(),
        requesting_role: 'Logistics',
      });
    expect(res.status).toBe(422);
    expect(res.body.error_code).toBe('RESOURCE_REQUEST_QUANTITY_INVALID');

    const afterCount = await query<{ count: string }>(`SELECT count(*) FROM resource_requests`);
    expect(afterCount[0].count).toBe(beforeCount[0].count);
  });

  it('approve/decline/fulfill reject invalid status transitions with 409 INVALID_STATUS_TRANSITION', async () => {
    const incidentId = await createTestIncident(testJurisdictionId);

    const createRes = await request(app.server)
      .post('/api/v1/resource-requests')
      .set('Authorization', `Bearer ${token}`)
      .send({
        resource_type: 'Supplies',
        description: 'State machine guard test',
        quantity: 1,
        incident_id: incidentId,
        needed_by: new Date(Date.now() + 86_400_000).toISOString(),
        requesting_role: 'Logistics',
        save_as_draft: true,
      });
    expect(createRes.status).toBe(201);
    expect(createRes.body.status).toBe('Draft');
    const requestId = createRes.body.id;

    // fulfill before Approved
    const fulfillTooEarlyRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/fulfill`)
      .set('Authorization', `Bearer ${token}`)
      .send({ assigned_to: 'Someone' });
    expect(fulfillTooEarlyRes.status).toBe(409);
    expect(fulfillTooEarlyRes.body.error_code).toBe('INVALID_STATUS_TRANSITION');

    // approve while still Draft (never submitted) — not Awaiting approval
    const approveFromDraftRes = await request(app.server)
      .post(`/api/v1/resource-requests/${requestId}/approve`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(approveFromDraftRes.status).toBe(409);
    expect(approveFromDraftRes.body.error_code).toBe('INVALID_STATUS_TRANSITION');
  });
});
