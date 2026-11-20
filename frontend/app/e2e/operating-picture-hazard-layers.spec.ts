import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of Phase 7 Plan 03's objective: the Operating
 * Picture's existing `LayerPanel` correctly renders the new hazard/weather
 * overlay layers Plan 07-01's backend appends to `GET
 * /api/v1/operating-picture/layers` — proving the F11 GIS-adapter frontend
 * pattern genuinely generalizes to F12 with zero new UI code.
 *
 * Follows `operating-picture.spec.ts`'s exact pattern: direct `pg.Pool`
 * access for fixture confirmation, `signInAsIncidentCommander`,
 * `test.describe.serial`. Unlike that spec, this one needs no incident
 * fixture of its own — it relies entirely on Plan 07-01's seed.ts fixtures
 * (NOAA/NWS/USGS hazard_feed_events, promoted into hazard_layers rows with
 * `verified = false` by `syncHazardLayersFromEvents()`), which are
 * guaranteed present in this same compose-stack database once `npm run
 * seed` has run.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/** Confirms at least one unverified hazard_layers row exists for a given
 * feed before the tests run. Plan 07-01's seed.ts already seeds and
 * promotes NOAA/NWS/USGS fixture events into hazard_layers on every `npm
 * run seed` — if none are found (a fresh database that hasn't been seeded
 * yet, or a future change to the seed fixtures), insert one directly via
 * the same 3-table chain (hazard_feed_config -> hazard_feed_events ->
 * hazard_layers) the 07-01 migration defines.
 *
 * `hazard_feed_config.feed_name` has a literal `CHECK (feed_name IN
 * ('NOAA','NWS','USGS'))` constraint (confirmed by reading migration
 * 1700000000011 directly) — a test-only feed name is not possible here, so
 * the fallback path reuses whichever of those 3 feeds is already `active`
 * in this database rather than inventing a 4th. */
async function ensureUnverifiedHazardLayerExists(): Promise<{ feedName: string; label: string }> {
  const existing = await pool.query<{ feed_name: string }>(
    `SELECT hfc.feed_name
     FROM hazard_feed_config hfc
     JOIN hazard_feed_events hfe ON hfe.feed_id = hfc.id
     JOIN hazard_layers hl ON hl.hazard_feed_event_id = hfe.id
     WHERE hfc.active = true
     GROUP BY hfc.feed_name, hfc.id
     HAVING bool_and(hl.verified) = false
     ORDER BY hfc.feed_name
     LIMIT 1`,
  );
  if (existing.rows[0]) {
    const feedName = existing.rows[0].feed_name;
    return { feedName, label: `${feedName} hazard feed` };
  }

  // Fallback: no unverified hazard layer found (unexpected given 07-01's
  // seed, but defend against a future change) — insert one directly
  // against whichever feed config is active, matching the migration's
  // exact column set (geometry NOT NULL, confidence CHECK'd, label
  // required on hazard_layers).
  const feedConfigRows = await pool.query<{ id: string; feed_name: string }>(
    `SELECT id, feed_name FROM hazard_feed_config WHERE active = true ORDER BY feed_name LIMIT 1`,
  );
  const feedConfig = feedConfigRows.rows[0];
  if (!feedConfig) {
    throw new Error(
      'No active hazard_feed_config row exists — Plan 07-01\'s seed.ts must run before this spec.',
    );
  }
  const { id: feedId, feed_name: feedName } = feedConfig;

  const uniqueExternalId = `e2e-test-event-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const feedEvent = await pool.query<{ id: string }>(
    `INSERT INTO hazard_feed_events
       (feed_id, external_event_id, type, severity, geometry, confidence, source, issued_at)
     VALUES ($1, $2, 'Flood', 'Moderate', ST_SetSRID(ST_MakePoint(-77.0, 38.9), 4326)::geography, 'Medium', $3, now())
     RETURNING id`,
    [feedId, uniqueExternalId, feedName],
  );
  const eventId = feedEvent.rows[0].id;

  await pool.query(
    `INSERT INTO hazard_layers (hazard_feed_event_id, label, verified)
     VALUES ($1, $2, false)`,
    [eventId, `${feedName} hazard feed`],
  );

  return { feedName, label: `${feedName} hazard feed` };
}

test.describe.serial('Operating Picture — hazard layers', () => {
  let hazardLayerLabel: string;

  test.beforeAll(async () => {
    const fixture = await ensureUnverifiedHazardLayerExists();
    hazardLayerLabel = fixture.label;
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. LayerPanel shows a hazard layer row with dashed Unverified treatment, off by default', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    // Open the Layers panel via MapControls' "Layers" icon button.
    await page.getByRole('button', { name: 'Layers' }).click();

    const layerPanel = page.locator('.ep-layer-panel');
    await expect(layerPanel).toBeVisible({ timeout: 10_000 });

    const hazardRow = layerPanel.locator('.ep-layer-panel__item', {
      hasText: hazardLayerLabel,
    });
    await expect(hazardRow).toBeVisible({ timeout: 10_000 });

    // Off by default (verified === false => checked === false, per
    // operating-picture.ts's `checked: allVerified` entry).
    const checkboxInput = hazardRow.locator('input[type="checkbox"]');
    await expect(checkboxInput).not.toBeChecked();

    // LayerPanel's dashed-Unverified treatment (Provenance verified={false}).
    const unverifiedChip = hazardRow.locator('.ep-provenance--unverified');
    await expect(unverifiedChip).toBeVisible();
    await expect(unverifiedChip).toContainText('Unverified');
  });

  test('2. Toggling an unverified hazard layer on keeps the dashed Unverified treatment', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    await page.getByRole('button', { name: 'Layers' }).click();
    const layerPanel = page.locator('.ep-layer-panel');
    await expect(layerPanel).toBeVisible({ timeout: 10_000 });

    const hazardRow = layerPanel.locator('.ep-layer-panel__item', {
      hasText: hazardLayerLabel,
    });
    await expect(hazardRow).toBeVisible({ timeout: 10_000 });

    const checkboxInput = hazardRow.locator('input[type="checkbox"]');
    await expect(checkboxInput).not.toBeChecked();

    // Toggle ON via the Checkbox's clickable label area.
    await hazardRow.locator('label.ep-checkbox').click();
    await expect(checkboxInput).toBeChecked();

    // The SAME dashed-Unverified treatment with the literal text
    // "Unverified" is STILL present — toggling visibility never clears
    // the unverified flag (the single most important assertion this plan
    // makes: `verified` is read directly from the backend response,
    // `handleLayerToggle` only ever writes to `layerVisibility`).
    const unverifiedChip = hazardRow.locator('.ep-provenance--unverified');
    await expect(unverifiedChip).toBeVisible();
    await expect(unverifiedChip).toContainText('Unverified');
  });

  test('3. Operating Picture still renders normally alongside the hazard layers (no regression)', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    // The existing map canvas renders unaffected by the new hazard rows
    // present in the SAME LayerPanel list.
    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    const statusBar = page.locator('.ep-map-canvas__status');
    await expect(statusBar).toBeVisible({ timeout: 10_000 });
    await expect(statusBar).toHaveText(/As of \d{2}:\d{2} ET \u00b7 Base layer: .+/);

    // Layers panel lists both the pre-existing incidents row AND the
    // hazard rows in the same list, with no rendering error.
    await page.getByRole('button', { name: 'Layers' }).click();
    const layerPanel = page.locator('.ep-layer-panel');
    await expect(layerPanel).toBeVisible({ timeout: 10_000 });

    const incidentsRow = layerPanel.locator('.ep-layer-panel__item', { hasText: 'Incidents' });
    await expect(incidentsRow).toBeVisible();

    const hazardRow = layerPanel.locator('.ep-layer-panel__item', {
      hasText: hazardLayerLabel,
    });
    await expect(hazardRow).toBeVisible();
  });
});
