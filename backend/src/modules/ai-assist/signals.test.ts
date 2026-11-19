import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from '../../server.js';
import { pool, query } from '../../db/client.js';
import { mintSessionToken } from '../auth-org/session.js';
import { syncRolePermissionsToOpa } from '../auth-org/opa-client.js';
import { clusterHazardFeedEvents } from './signal-clustering.js';

// Integration test against the real compose stack (Postgres + OPA) — same
// pattern as ai-drafts.test.ts/ics-forms.test.ts. Requires:
// docker compose up -d db opa; DATABASE_URL + OPA_URL + SESSION_JWT_SECRET
// set; `npm run seed` already run against this same database (this suite
// mints a token for the REAL seeded incident_commander role, which holds
// ai_assist per 06-03's seed grant — the same permission this plan's
// signals routes reuse).

let testJurisdictionId: string;
let testHazardFeedId: string;
let token: string;
let testStartTimestamp: string;

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

async function mintTokenForSeededRole(roleName: string, jurisdictionId: string): Promise<{ token: string; userId: string }> {
  const roleRows = await query<{ id: string }>(`SELECT id FROM roles WHERE name = $1`, [roleName]);
  const roleId = roleRows[0]?.id;
  expect(roleId, `Seeded role '${roleName}' must exist — run npm run seed first`).toBeTruthy();

  const email = `signals-test-${roleName}-${Date.now()}-${Math.random()}@epmp.local`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO users (email, name, role_id, jurisdiction_scope, status) VALUES ($1, $2, $3, $4, 'Active') RETURNING id`,
    [email, `Test ${roleName}`, roleId, [jurisdictionId]],
  );

  const mintedToken = await mintSessionToken({
    id: inserted[0].id,
    role_id: roleId,
    jurisdiction_scope: [jurisdictionId],
  });
  return { token: mintedToken, userId: inserted[0].id };
}

beforeAll(async () => {
  await app.ready();
  testJurisdictionId = await findOrCreateJurisdiction('Signals Test Jurisdiction');
  testStartTimestamp = new Date().toISOString();

  const allPerms = await query<{ role_id: string; feature: string; actions: string[] }>(
    `SELECT role_id, feature, actions FROM role_permissions`,
  );
  await syncRolePermissionsToOpa(allPerms);

  const minted = await mintTokenForSeededRole('incident_commander', testJurisdictionId);
  token = minted.token;

  // A dedicated hazard_feed_config row for this test's own fixture events
  // — distinct feed_name-independent identity via endpoint_url, since
  // feed_name is constrained to NOAA/NWS/USGS and this test reuses 'NOAA'
  // without colliding with seed.ts's own NOAA row (that row already
  // exists from `npm run seed`, which this test's own <verify> block
  // requires having run first — findOrInsert-style find-then-insert here
  // too).
  const existingFeed = await query<{ id: string }>(
    `SELECT id FROM hazard_feed_config WHERE feed_name = 'NOAA' LIMIT 1`,
  );
  if (existingFeed[0]) {
    testHazardFeedId = existingFeed[0].id;
  } else {
    const insertedFeed = await query<{ id: string }>(
      `INSERT INTO hazard_feed_config (feed_name, endpoint_url) VALUES ('NOAA', 'https://api.weather.gov/test-fixture')
       RETURNING id`,
    );
    testHazardFeedId = insertedFeed[0].id;
  }
});

afterAll(async () => {
  await pool.end();
});

describe('ai-assist signal triage queue (real clustering, promote never creates an incident, dismiss requires reason)', () => {
  let highConfidenceSignalId: string;
  let mediumConfidenceSignalId: string;

  it('clusterHazardFeedEvents() groups real corroborating events into a High-confidence signal and isolates a single-source event into a Medium-confidence signal', async () => {
    // 3 corroborating same-type/nearby-geometry events, freshly inserted
    // with unique external_event_ids so they're genuinely unclustered.
    const uniqueSuffix = `${Date.now()}-${Math.random()}`;
    const corroboratingEvents = [
      { external_event_id: `TEST-CORROB-A-${uniqueSuffix}`, source: 'NOAA', lng: -80.1, lat: 25.76 },
      { external_event_id: `TEST-CORROB-B-${uniqueSuffix}`, source: 'NWS', lng: -80.12, lat: 25.77 },
      { external_event_id: `TEST-CORROB-C-${uniqueSuffix}`, source: 'USGS', lng: -80.09, lat: 25.75 },
    ];
    for (const e of corroboratingEvents) {
      await query(
        `INSERT INTO hazard_feed_events (feed_id, external_event_id, type, severity, geometry, confidence, source, issued_at)
         VALUES ($1,$2,'Hurricane Watch','Critical', ST_SetSRID(ST_MakePoint($3,$4), 4326), 'High', $5, now())`,
        [testHazardFeedId, e.external_event_id, e.lng, e.lat, e.source],
      );
    }

    // 1 isolated single-source event — different type, far-apart geometry.
    const isolatedExternalId = `TEST-ISOLATED-${uniqueSuffix}`;
    await query(
      `INSERT INTO hazard_feed_events (feed_id, external_event_id, type, severity, geometry, confidence, source, issued_at)
       VALUES ($1,$2,'Tornado Warning','Critical', ST_SetSRID(ST_MakePoint($3,$4), 4326), 'High', 'NOAA', now())`,
      [testHazardFeedId, isolatedExternalId, 36.17, -86.78],
    );

    const result = await clusterHazardFeedEvents();
    expect(result.clustersCreated).toBeGreaterThanOrEqual(2);

    const highRows = await query<{ id: string; confidence_label: string; confidence_reason: string }>(
      `SELECT id, confidence_label, confidence_reason FROM signals WHERE confidence_reason ILIKE '%corroborating%' ORDER BY detected_at DESC LIMIT 1`,
    );
    expect(highRows[0]).toBeTruthy();
    expect(highRows[0].confidence_label).toBe('High');
    expect(highRows[0].confidence_reason).toMatch(/corroborating/);
    highConfidenceSignalId = highRows[0].id;

    const mediumRows = await query<{ id: string; confidence_label: string }>(
      `SELECT s.id, s.confidence_label
       FROM signals s
       JOIN signal_source_events sse ON sse.signal_id = s.id
       JOIN hazard_feed_events hfe ON hfe.id = sse.hazard_feed_event_id
       WHERE hfe.external_event_id = $1`,
      [isolatedExternalId],
    );
    expect(mediumRows[0]).toBeTruthy();
    expect(mediumRows[0].confidence_label).toBe('Medium');
    mediumConfidenceSignalId = mediumRows[0].id;
  });

  it('GET /api/v1/signals returns both signals with qualitative confidence_label values only — never a bare percentage', async () => {
    const res = await request(app.server)
      .get('/api/v1/signals')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);

    const ids = res.body.items.map((s: { id: string }) => s.id);
    expect(ids).toContain(highConfidenceSignalId);
    expect(ids).toContain(mediumConfidenceSignalId);

    for (const item of res.body.items) {
      expect(['High', 'Medium', 'Low']).toContain(item.confidence_label);
      // Targeted check on the confidence fields specifically — a bare
      // percentage pattern must never appear in confidence_label or
      // confidence_reason.
      expect(item.confidence_label).not.toMatch(/%|\d+\.\d+%?$/);
      expect(item.confidence_reason).not.toMatch(/^\d+%$/);
    }
  });

  it('POST /api/v1/signals/{id}/promote for the High-confidence signal returns the exact SignalPromotePrefill shape and creates NO incident row', async () => {
    const beforeCount = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM incidents WHERE created_at > $1`,
      [testStartTimestamp],
    );

    const res = await request(app.server)
      .post(`/api/v1/signals/${highConfidenceSignalId}/promote`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.prefill).toBeTruthy();
    expect(typeof res.body.prefill.name_suggestion).toBe('string');
    expect(typeof res.body.prefill.type_suggestion).toBe('string');
    expect(['Critical', 'Elevated', 'Watch', 'Normal']).toContain(res.body.prefill.severity_suggestion);
    expect(res.body.prefill.source_signal_id).toBe(highConfidenceSignalId);

    // Direct proof: the incidents table's own row count (scoped to rows
    // created since this test suite started) is UNCHANGED after the
    // promote call — nothing was created as a side effect.
    const afterCount = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM incidents WHERE created_at > $1`,
      [testStartTimestamp],
    );
    expect(afterCount[0].count).toBe(beforeCount[0].count);
  });

  it('POST /api/v1/signals/{id}/dismiss with NO reason returns 422 and leaves status unchanged', async () => {
    const res = await request(app.server)
      .post(`/api/v1/signals/${mediumConfidenceSignalId}/dismiss`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(422);

    const rows = await query<{ status: string }>(`SELECT status FROM signals WHERE id = $1`, [mediumConfidenceSignalId]);
    expect(rows[0].status).not.toBe('Dismissed');
  });

  it('POST .../dismiss with a valid reason succeeds (200), status becomes Dismissed, dismissed_reason matches', async () => {
    const reason = 'False positive — single isolated sensor reading, no corroboration found on manual review.';

    const res = await request(app.server)
      .post(`/api/v1/signals/${mediumConfidenceSignalId}/dismiss`)
      .set('Authorization', `Bearer ${token}`)
      .send({ reason });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Dismissed');
    expect(res.body.dismissed_reason).toBe(reason);

    const rows = await query<{ status: string; dismissed_reason: string }>(
      `SELECT status, dismissed_reason FROM signals WHERE id = $1`,
      [mediumConfidenceSignalId],
    );
    expect(rows[0].status).toBe('Dismissed');
    expect(rows[0].dismissed_reason).toBe(reason);
  });
});
