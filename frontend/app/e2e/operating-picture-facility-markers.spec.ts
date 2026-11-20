import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of Phase 8 Plan 04's objective: the Operating
 * Picture's existing marker-rendering pattern (established Phase 2,
 * extended Phase 3 for resource markers) correctly extends to a third
 * marker family — facility markers (square shape, status-toned) sourced
 * from Plan 08-02's new `GET /api/v1/operating-picture/facilities` — with
 * F17's "no inventory/maintenance/cost ever rendered" rule proven
 * structurally (the popup's rendered text literally cannot contain such a
 * field, since the backend response it consumes never carries one).
 *
 * Follows `operating-picture-hazard-layers.spec.ts`'s exact pattern:
 * direct `pg.Pool` access for fixture confirmation, `signInAsIncidentCommander`,
 * `test.describe.serial`. Relies on Plan 08-02's seed.ts `runFacilitySync()`
 * call for its facility fixture (2 deterministic rows: "Main Street
 * Shelter" / "County EOC Building", both status 'operational', source
 * 'agency_erp') — guaranteed present in this same compose-stack database
 * once `npm run seed` has run, same reliance pattern as the hazard-layers
 * spec's dependency on 07-01's seed fixtures.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

interface FacilityFixture {
  name: string;
  status: string;
  source: string;
}

/** Confirms at least one `facilities` row exists before the tests run.
 * Plan 08-02's seed.ts already calls `runFacilitySync()` on every `npm run
 * seed`, which upserts the deterministic agency_erp stub's 2 fixture rows
 * — if none are found (a fresh database that hasn't been seeded yet),
 * insert one directly via the same 1-table insert Plan 08-02's migration
 * defines, scoped with a unique test-recognizable name so this test never
 * collides with another run's fixture. */
async function ensureFacilityFixtureExists(): Promise<FacilityFixture> {
  const existing = await pool.query<{ name: string; status: string; source: string }>(
    `SELECT name, status, source FROM facilities ORDER BY name LIMIT 1`,
  );
  if (existing.rows[0]) {
    return existing.rows[0];
  }

  // Fallback: no facilities row found (unexpected given 08-02's seed, but
  // defend against a future change) — insert one directly, matching the
  // migration's exact column set (location NOT NULL geography, source/
  // as_of required).
  const uniqueName = `E2E Test Facility ${Date.now()}`;
  await pool.query(
    `INSERT INTO facilities (external_facility_id, name, location, status, source, as_of)
     VALUES ($1, $2, ST_SetSRID(ST_MakePoint(-77.0, 38.9), 4326)::geography, $3, $4, now())`,
    [`E2E-FAC-${Date.now()}`, uniqueName, 'operational', 'agency_erp'],
  );
  return { name: uniqueName, status: 'operational', source: 'agency_erp' };
}

test.describe.serial('Operating Picture — facility markers (F17)', () => {
  let facility: FacilityFixture;

  test.beforeAll(async () => {
    facility = await ensureFacilityFixtureExists();
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Operating Picture renders a facility marker alongside incidents/resources', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    // Facility markers render as `.ep-map-marker--square`, following the
    // exact SHAPE_CLASS_FOR_TYPE mapping MapCanvas.tsx declares for
    // type:'facility'. At least one must be present, labeled with this
    // fixture's own name.
    const facilityMarker = page.locator(
      `.ep-map-marker--square[aria-label^="${facility.name} \u2014 "]`,
    );
    await expect(facilityMarker).toBeVisible({ timeout: 10_000 });
  });

  test('2. Clicking a facility marker shows its Provenance and no cost/inventory figure', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const facilityMarker = page.locator(
      `.ep-map-marker--square[aria-label^="${facility.name} \u2014 "]`,
    );
    await expect(facilityMarker).toBeVisible({ timeout: 10_000 });
    await facilityMarker.click();

    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });
    await expect(popup.locator('.ep-map-popup__title')).toHaveText(facility.name);

    // A real Provenance chip renders, showing this facility's own source.
    const provenanceChip = popup.locator('.ep-provenance');
    await expect(provenanceChip).toBeVisible();
    await expect(provenanceChip).toContainText(facility.source);

    // Structural proof, not just an assumption from the backend's own
    // field-discarding: the popup's rendered text never contains any of
    // F17's forbidden literal strings, regardless of case.
    const popupText = (await popup.textContent())?.toLowerCase() ?? '';
    expect(popupText).not.toContain('inventory');
    expect(popupText).not.toContain('maintenance');
    expect(popupText).not.toContain('cost');
    expect(popupText).not.toContain('$');

    await popup.getByRole('button', { name: 'Close' }).click();
    await expect(popup).not.toBeVisible();
  });

  test('3. MapLegend includes a facility entry', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    // With a facility marker present, MapLegend's bottom-left slot (always
    // rendered whenever legendItems.length > 0) includes a square-glyph
    // entry labeled "Facility" — matching MapLegend.tsx's own
    // type==='facility' -> 'ep-map-legend__glyph--square' mapping.
    const legend = page.locator('.ep-map-legend__list, [class*="ep-map-legend"]').first();
    await expect(legend).toBeVisible({ timeout: 10_000 });

    const facilityLegendItem = page.locator('.ep-map-legend__item', { hasText: 'Facility' });
    await expect(facilityLegendItem).toBeVisible();
    await expect(facilityLegendItem.locator('.ep-map-legend__glyph--square')).toBeVisible();
  });

  test('4. Operating Picture still renders normally alongside facility markers (no regression)', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    const statusBar = page.locator('.ep-map-canvas__status');
    await expect(statusBar).toBeVisible({ timeout: 10_000 });
    await expect(statusBar).toHaveText(/As of \d{2}:\d{2} ET \u00b7 Base layer: .+/);

    // The pre-existing facility marker is present in the same canvas as
    // whatever incident/resource markers the shared compose-stack database
    // has accumulated — no error, no blank canvas.
    const facilityMarker = page.locator(
      `.ep-map-marker--square[aria-label^="${facility.name} \u2014 "]`,
    );
    await expect(facilityMarker).toBeVisible({ timeout: 10_000 });
  });
});
