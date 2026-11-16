import http from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { connectNats, publishEvent } from './nats-client.js';
import { startWebhookDeliveryWorker } from './webhook-delivery-worker.js';

// Integration test against the real compose stack (Postgres + NATS + OPA) —
// proving a real event (login) flows from publish through durable JetStream
// delivery to an external HTTP subscriber with idempotency-key dedup.
// Requires: docker compose up -d db nats opa; DATABASE_URL + NATS_URL +
// OPA_URL + SESSION_JWT_SECRET set.

let testUserId: string;
let testRoleId: string;
let testJurisdictionId: string;
let adminToken: string;

let receiverServer: http.Server;
let receiverPort: number;
const receivedBodies: Array<Record<string, unknown>> = [];

async function findOrCreateRole(name: string, personaId: string): Promise<string> {
  const existing = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [name]);
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO roles (name, persona_id, description) VALUES ($1, $2, $3) RETURNING id`,
    [name, personaId, 'Test role for eventbus.test.ts'],
  );
  return inserted[0].id;
}

async function findOrCreateJurisdiction(): Promise<string> {
  const existing = await query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = $1 AND type = $2`,
    ['Eventbus Test Jurisdiction', 'county'],
  );
  if (existing[0]) return existing[0].id;
  const inserted = await query<{ id: string }>(
    `INSERT INTO jurisdictions (name, type) VALUES ($1, $2) RETURNING id`,
    ['Eventbus Test Jurisdiction', 'county'],
  );
  return inserted[0].id;
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

  testJurisdictionId = await findOrCreateJurisdiction();
  testRoleId = await findOrCreateRole('eventbus_test_admin_role', 'PER-05');

  // Seed admin feature permission for this test role — required by
  // requirePermission('admin','create') on the webhook-subscriptions route.
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

  const email = `eventbus-test-${Date.now()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, 'Eventbus Test Admin', testRoleId, [testJurisdictionId]],
  );
  testUserId = inserted[0].id;

  adminToken = await mintSessionToken({
    id: testUserId,
    role_id: testRoleId,
    jurisdiction_scope: [testJurisdictionId],
  });

  // Tiny throwaway HTTP server acting as the webhook receiver — records
  // every request body it receives.
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
});

afterAll(async () => {
  await new Promise<void>((resolve) => receiverServer.close(() => resolve()));
  await pool.end();
});

describe('event bus: publish -> durable delivery -> webhook subscriber', () => {
  it('registers a webhook subscription for user.login', async () => {
    const res = await request(app.server)
      .post('/api/v1/admin/webhook-subscriptions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        callback_url: `http://127.0.0.1:${receiverPort}/webhook`,
        event_types: ['user.login'],
        secret: 'eventbus-test-secret',
      });

    expect(res.status).toBe(201);
    expect(res.body.callback_url).toBe(`http://127.0.0.1:${receiverPort}/webhook`);
  });

  it('a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key', async () => {
    // Simulates the event without a full SSO round-trip — this test's
    // purpose is proving EVENT BUS delivery mechanics, not re-testing SSO
    // (already covered by auth-org/routes.test.ts).
    await publishEvent('user.login', { user_id: testUserId, email: 'eventbus-test@epmp.local' });

    await waitFor(() => receivedBodies.length > 0, 10_000);

    const delivered = receivedBodies[receivedBodies.length - 1];
    expect(delivered.event_type).toBe('user.login');
    expect(typeof delivered.idempotency_key).toBe('string');
    expect((delivered.idempotency_key as string).length).toBeGreaterThan(0);
    expect(delivered.payload).toMatchObject({ user_id: testUserId });
  });

  it('duplicate-key inserts are provably rejected at the DB constraint (idempotent dedup)', async () => {
    const subRows = await query<{ id: string }>(
      `SELECT id FROM webhook_subscriptions WHERE callback_url = $1 LIMIT 1`,
      [`http://127.0.0.1:${receiverPort}/webhook`],
    );
    const subscriptionId = subRows[0].id;
    const dedupKey = `eventbus-test-dedup-${Date.now()}`;

    await query(
      `INSERT INTO webhook_deliveries (subscription_id, idempotency_key, event_type, payload)
       VALUES ($1, $2, $3, $4) ON CONFLICT (subscription_id, idempotency_key) DO NOTHING`,
      [subscriptionId, dedupKey, 'user.login', JSON.stringify({ attempt: 1 })],
    );
    await query(
      `INSERT INTO webhook_deliveries (subscription_id, idempotency_key, event_type, payload)
       VALUES ($1, $2, $3, $4) ON CONFLICT (subscription_id, idempotency_key) DO NOTHING`,
      [subscriptionId, dedupKey, 'user.login', JSON.stringify({ attempt: 2 })],
    );

    const countRows = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM webhook_deliveries WHERE idempotency_key = $1`,
      [dedupKey],
    );
    expect(parseInt(countRows[0].count, 10)).toBe(1);
  });

  it('GET /api/v1/openapi.json returns a valid, non-trivial OpenAPI document', async () => {
    const res = await request(app.server).get('/api/v1/openapi.json');

    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe('3.1.0');
    expect(res.body.paths).toBeTruthy();
    const paths = Object.keys(res.body.paths);
    expect(paths.some((p) => p.includes('/me'))).toBe(true);
  });
});
