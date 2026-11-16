import { test, expect } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 02-07's objective: the Operating Picture
 * (S2.1) is reachable, renders real incident markers, shows the exact
 * status-bar format, supports keyboard-focusable marker selection with a
 * deep-link to the Incident Workspace, and — the single most important
 * check in this plan — visibly continues to render under a forced GIS
 * failure (success criterion 5, end-to-end at the frontend, not just the
 * backend's own already-passing integration test).
 *
 * Direct Postgres access (same `pg` dependency 02-03/02-02's own backend
 * integration tests use) seeds an incident WITH a `location` set — no
 * API/UI path exists to set that nullable column (02-01's documented
 * scope: S1.2's create form has no location field) — mirroring this
 * plan's own backend integration test (operating-picture.test.ts), which
 * does the identical `UPDATE incidents SET location = ST_SetSRID(...)`
 * against the same live compose-stack database this e2e suite runs
 * against.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Test-fixture fix (Rule 3 - Blocking), discovered while writing this
 * spec: `commander@epmp.local` is JIT-provisioned by sso.ts on first login
 * with `jurisdiction_scope = '{}'` (by design — a fresh SSO account has no
 * jurisdiction until an admin assigns one via the console, same as a real
 * deployment). Every prior e2e suite signing in as this user worked
 * despite that because `GET /api/v1/incidents`'s own list query doesn't
 * yet filter by `jurisdiction_scope` (T-02-03, a documented carried-
 * forward gap from 02-01/02-02's SUMMARYs). `operating-picture.ts`'s
 * markers query DOES correctly filter by it, so with an empty scope this
 * identity could never see a single marker, making this plan's own
 * degraded-mode assertion untestable. Grants this test fixture the
 * 'Default Agency' jurisdiction scope used by every incident this suite
 * creates — the same jurisdiction every other e2e spec's "Default Agency"
 * Combobox selection already implies. This is a one-time test-fixture
 * correction, not a change to sso.ts's production JIT-provisioning
 * behavior or to seed.ts.
 */
async function ensureCommanderHasJurisdictionScope(): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = 'Default Agency'`,
  );
  const jurisdictionId = rows[0]?.id;
  if (!jurisdictionId) return;
  await pool.query(
    `UPDATE users SET jurisdiction_scope = ARRAY[$1]::uuid[]
     WHERE email = 'commander@epmp.local' AND NOT ($1 = ANY(jurisdiction_scope))`,
    [jurisdictionId],
  );
}

interface LocatedIncident {
  id: string;
  /** Full, unique generated name — use this (not the namePrefix alone) to
   * locate THIS test's own marker, since the live compose-stack database
   * accumulates incidents with the same prefix across every run of this
   * suite (including prior failed/retried runs). */
  name: string;
}

async function createLocatedIncidentViaUi(
  page: import('@playwright/test').Page,
  namePrefix: string,
): Promise<LocatedIncident> {
  await page.goto('/incidents/new');
  const incidentName = `${namePrefix} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  await page.getByLabel('Name', { exact: false }).fill(incidentName);
  await page.getByLabel('Type', { exact: true }).selectOption('Flood');
  await page.getByLabel('Severity', { exact: true }).selectOption('Critical');

  const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
  await jurisdictionInput.click();
  await jurisdictionInput.fill('Default Agency');
  await page.getByRole('option', { name: 'Default Agency' }).click();

  await page.getByRole('button', { name: 'Create incident' }).click();
  await page.waitForURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

  const match = page.url().match(/\/incidents\/([0-9a-f-]+)$/);
  if (!match) throw new Error(`Could not parse incident id from URL: ${page.url()}`);
  const incidentId = match[1];

  // Give this incident a real location (near the Washington-DC-area point
  // 02-03's own integration test uses) so it appears as a marker on GET
  // /api/v1/operating-picture/markers, which omits (not breaks) incidents
  // with no location set. Each call gets a small random offset so markers
  // from different test() calls in this serial suite (the live compose-
  // stack database accumulates them across the whole run) don't land on
  // the exact same projected x/y and visually overlap/intercept each
  // other's pointer events.
  const jitter = () => (Math.random() - 0.5) * 2; // +/- 1 degree
  await pool.query(
    `UPDATE incidents SET location = ST_SetSRID(ST_MakePoint($2, $3), 4326) WHERE id = $1`,
    [incidentId, -77.0 + jitter(), 38.9 + jitter()],
  );

  return { id: incidentId, name: incidentName };
}

/** Locates THIS incident's own marker by its exact, unique generated name
 * (never a prefix shared with other incidents the live database has
 * accumulated across this serial suite's earlier/prior runs). MapCanvas
 * renders each marker's `aria-label` as `"{label} — {status}"`, so an
 * exact-name match requires anchoring on the name followed by the em dash
 * separator, not a bare substring (a shorter incident's name could
 * otherwise be a prefix of a longer one's). */
function markerFor(page: import('@playwright/test').Page, incident: LocatedIncident) {
  return page.locator(`.ep-map-marker[aria-label^="${incident.name} \u2014 "]`);
}

test.describe.serial('Operating Picture', () => {
  test.beforeAll(async () => {
    await ensureCommanderHasJurisdictionScope();
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Reachable from the Monitor SideNav group; renders at least one keyboard-focusable marker', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incident = await createLocatedIncidentViaUi(page, 'E2E OpPicture Marker');

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Operating picture', { exact: true }).click();
    await expect(page).toHaveURL(/\/operating-picture$/);

    // Page renders — no error boundary, no blank screen. MapCanvas's own
    // `role="group"` container is present.
    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    // This test's own marker renders and is keyboard-focusable.
    const marker = markerFor(page, incident);
    await expect(marker).toBeVisible({ timeout: 10_000 });

    await marker.focus();
    await expect(marker).toBeFocused();
  });

  test('2. Status bar matches the exact "As of HH:MM ET · Base layer: ..." format', async ({ page }) => {
    await signInAsIncidentCommander(page);
    await page.goto('/operating-picture');

    const statusBar = page.locator('.ep-map-canvas__status');
    await expect(statusBar).toBeVisible({ timeout: 10_000 });
    await expect(statusBar).toHaveText(/As of \d{2}:\d{2} ET \u00b7 Base layer: .+/);
  });

  test('3. Selecting a marker opens a popup with the incident name + severity Badge; "Open incident" navigates', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incident = await createLocatedIncidentViaUi(page, 'E2E OpPicture Popup');
    await page.goto('/operating-picture');

    // Target THIS test's own marker by its exact generated name, not
    // `.first()` — the live compose-stack database accumulates markers
    // across this serial suite's earlier tests, so `.first()` is not
    // guaranteed to be the marker this test just created.
    const marker = markerFor(page, incident);
    await expect(marker).toBeVisible({ timeout: 10_000 });
    await marker.click();

    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });
    // Severity Badge inside the popup header.
    await expect(popup.locator('.ep-badge')).toBeVisible();

    await popup.getByRole('button', { name: 'Open incident' }).click();
    await expect(page).toHaveURL(new RegExp(`/incidents/${incident.id}$`), { timeout: 10_000 });
  });

  test('4. Closing the popup returns focus to the originating marker (not document.body)', async ({ page }) => {
    await signInAsIncidentCommander(page);
    const incident = await createLocatedIncidentViaUi(page, 'E2E OpPicture Focus');
    await page.goto('/operating-picture');

    const marker = markerFor(page, incident);
    await expect(marker).toBeVisible({ timeout: 10_000 });
    await marker.focus();
    await marker.press('Enter');

    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });

    await popup.getByRole('button', { name: 'Close' }).click();
    await expect(popup).not.toBeVisible();

    // Focus returned to the marker element that opened it, not lost to body.
    await expect(marker).toBeFocused();
  });

  test('5. Degraded mode: force_gis_failure=true still renders, status bar shows the exact schematic-offline string, and the incident marker stays visible/clickable', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    const incident = await createLocatedIncidentViaUi(page, 'E2E OpPicture Degraded');

    await page.goto('/operating-picture?force_gis_failure=true');

    // Page still renders — no crash, no blank screen.
    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    // Status bar reads exactly the schematic-offline string (HH:MM varies,
    // the rest is pinned literally).
    const statusBar = page.locator('.ep-map-canvas__status');
    await expect(statusBar).toHaveText(/^As of \d{2}:\d{2} ET \u00b7 Base layer: Schematic base map, offline$/, {
      timeout: 10_000,
    });

    // MapCanvas's offline hatched-base treatment is active.
    await expect(mapCanvas).toHaveClass(/ep-map-canvas--offline/);

    // The previously-visible incident marker is STILL present and clickable
    // — proving the frontend's degraded-mode handling, not just the
    // backend's, with no server restart required.
    const marker = markerFor(page, incident);
    await expect(marker).toBeVisible({ timeout: 10_000 });
    await marker.click();
    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });
  });
});
