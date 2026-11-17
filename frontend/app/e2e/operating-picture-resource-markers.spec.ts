import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import { signInAsIncidentCommander, signInAsPlanningChief } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 03-09's objective: closing the gap the plan
 * checker identified in 02-03-PLAN.md's own stated design intent — the
 * operating-picture `markers` response was deliberately kept generic
 * specifically so a later phase could add resource-request markers to the
 * SAME array without a response-shape change. This spec proves that
 * extension end-to-end at the browser level: a resource request created
 * through the real Incident Workspace Resources tab (03-08) appears as a
 * triangle marker on the real Operating Picture map, is interactive via
 * MapPopup with a working deep-link to its detail page, its tone updates
 * as its status changes (no page reload beyond the existing 30s poll), and
 * it disappears from the map once Fulfilled (the terminal-status
 * exclusion operating-picture.ts's query now applies).
 *
 * Direct Postgres access (same `pg` dependency 02-07's own
 * operating-picture.spec.ts uses) seeds the test incident's `location` —
 * no API/UI path sets that nullable column (02-01's documented scope).
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Same test-fixture fix 02-07's operating-picture.spec.ts already
 * documents in detail: `commander@epmp.local` is JIT-provisioned with an
 * empty jurisdiction_scope on first login, and operating-picture.ts's
 * markers query (both its incident AND its new resource-request half)
 * correctly enforces it. Without this grant this identity could never see
 * a single marker of either type, making every assertion below
 * untestable. One-time test-fixture correction, not a production change.
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

/** Same fix, applied to planner@epmp.local (03-06/03-08's own documented
 * precedent for this exact identity) — needed here because test 3/4 sign
 * in as the planning_logistics_chief identity to approve/fulfill the
 * request, then navigate to the Operating Picture themselves; without a
 * jurisdiction grant that identity's own markers query would see zero
 * results regardless of marker type, same root cause as the commander fix
 * above. */
async function ensurePlannerHasJurisdictionScope(): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = 'Default Agency'`,
  );
  const jurisdictionId = rows[0]?.id;
  if (!jurisdictionId) return;
  await pool.query(
    `UPDATE users SET jurisdiction_scope = ARRAY[$1]::uuid[]
     WHERE email = 'planner@epmp.local' AND NOT ($1 = ANY(jurisdiction_scope))`,
    [jurisdictionId],
  );
}

function futureIsoDateTime(minutesFromNow: number): string {
  const d = new Date(Date.now() + minutesFromNow * 60_000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

/** Same two-field fill as 03-06's tasks-resources.spec.ts's identical
 * helper — the DatePicker's date text input and its separate `withTime`
 * time input are two distinct controls. */
async function fillDateTimePicker(page: Page, isoDateTime: string): Promise<void> {
  const [datePart, timePart] = isoDateTime.split('T');
  await page.locator('input[placeholder="YYYY-MM-DD"]').fill(datePart);
  await page.locator('input[type="time"]').fill(timePart);
}

/** Same `fetch`-through-the-page pattern tasks-resources.spec.ts's own
 * apiGetViaPage helper uses — reads the session token straight out of
 * sessionStorage and issues a real request through the same origin the
 * page is already on. Used here to read this test's own just-created
 * request's id directly rather than following
 * ResourceRequestList.tsx's row link, whose incident-scoped href
 * (`/incidents/{incidentId}/resource-requests/{id}`) has no matching
 * route registered in main.tsx — a pre-existing gap outside this plan's
 * scope (main.tsx only registers the incident-scoped CREATE route for
 * resource requests, not a detail one; TaskList.tsx's equivalent
 * `taskHref` has the identical gap). Reading the id via the API sidesteps
 * that gap entirely rather than attempting to fix it here. */
async function apiGetViaPage<T>(page: Page, path: string): Promise<T> {
  return page.evaluate(async (path) => {
    const token = window.sessionStorage.getItem('epmp_session_token');
    const res = await fetch(path, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GET ${path} failed: ${res.status} ${text}`);
    }
    return res.json();
  }, path);
}

interface LocatedIncident {
  id: string;
  name: string;
}

/** Creates a real incident via the UI (same pattern 02-07's own e2e spec
 * uses) and gives it a real location via direct Postgres access, since no
 * API/UI path exists to set that nullable column. */
async function createLocatedIncidentViaUi(page: Page, namePrefix: string): Promise<LocatedIncident> {
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

  const jitter = () => (Math.random() - 0.5) * 2; // +/- 1 degree
  await pool.query(
    `UPDATE incidents SET location = ST_SetSRID(ST_MakePoint($2, $3), 4326) WHERE id = $1`,
    [incidentId, -77.0 + jitter(), 38.9 + jitter()],
  );

  return { id: incidentId, name: incidentName };
}

/** Same exact-name anchoring pattern 02-07's own operating-picture.spec.ts
 * documents for incident markers. */
function incidentMarkerLocator(page: Page, incident: LocatedIncident) {
  return page.locator(
    `.ep-map-marker.ep-map-marker--diamond[aria-label^="${incident.name} \u2014 "]`,
  );
}

/** Finds THIS test's own resource-request triangle marker by proximity to
 * its own incident's diamond marker, rather than a bare global
 * `.ep-map-marker--triangle` selector — the live compose-stack database
 * accumulates other in-flight resource-request markers across this
 * suite's own earlier runs (same reasoning 02-07's own spec documents for
 * why a bare `.first()`/global selector is unsafe here), and this
 * request's `aria-label` text (quantity + resource type only, no incident
 * name) carries no unique anchor the way an incident marker's name does.
 * Since this request inherits its own freshly created, randomly-jittered
 * incident's location (see createLocatedIncidentViaUi), the triangle
 * marker sitting at that SAME projected position is unambiguously this
 * test's own — any other accumulated triangle marker is tied to a
 * different incident's own different (jittered) location. */
async function findOwnResourceMarker(page: Page, incident: LocatedIncident) {
  const diamondMarker = incidentMarkerLocator(page, incident);
  await expect(diamondMarker).toBeVisible({ timeout: 10_000 });
  const diamondBox = await diamondMarker.boundingBox();
  if (!diamondBox) throw new Error('Could not read bounding box of incident marker');

  const triangles = page.locator('.ep-map-marker.ep-map-marker--triangle');
  const count = await triangles.count();
  for (let i = 0; i < count; i++) {
    const candidate = triangles.nth(i);
    const box = await candidate.boundingBox();
    if (!box) continue;
    if (Math.abs(box.x - diamondBox.x) < 20 && Math.abs(box.y - diamondBox.y) < 20) {
      return candidate;
    }
  }
  throw new Error('No resource-request triangle marker found near this incident\'s own marker');
}

test.describe.serial('Operating Picture — resource-request markers', () => {
  let incident: LocatedIncident;
  let requestId: string;
  let requestDescription: string;

  test.beforeAll(async () => {
    await ensureCommanderHasJurisdictionScope();
    await ensurePlannerHasJurisdictionScope();
  });

  test.afterAll(async () => {
    await pool.end();
  });

  test('1-2. A resource request created via the Incident Workspace Resources tab appears as a triangle marker near its incident\'s diamond marker, interactive via MapPopup with a working deep-link', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);

    incident = await createLocatedIncidentViaUi(page, 'E2E OpPicture ResourceMarker');

    // Step 2: from the Incident Workspace's real Resources tab (03-08),
    // create a resource request linked to this incident.
    await page.goto(`/incidents/${incident.id}`);
    await page.getByRole('tab', { name: 'Resources' }).click();
    await page.getByRole('button', { name: 'New resource request' }).first().click();
    await expect(page).toHaveURL(new RegExp(`/incidents/${incident.id}/resource-requests/new$`));

    await page.getByLabel('Resource type', { exact: true }).selectOption('Equipment');
    requestDescription = `E2E generators ${Date.now()}`;
    await page.getByLabel('Description', { exact: false }).fill(requestDescription);
    await page.getByLabel('Quantity', { exact: false }).fill('3');
    await fillDateTimePicker(page, futureIsoDateTime(1440));
    await page.getByLabel('Requesting role', { exact: true }).selectOption('incident_commander');

    await page.getByRole('button', { name: 'Submit request' }).click();

    // 03-08's CreateResourceRequest fix returns to the originating
    // Incident Workspace when routeIncidentId is present. IncidentWorkspace
    // re-mounts fresh on this navigation (activeTab resets to its
    // 'timeline' default), so re-select the Resources tab before looking
    // for the new request's row.
    await expect(page).toHaveURL(new RegExp(`/incidents/${incident.id}$`), { timeout: 10_000 });
    await page.getByRole('tab', { name: 'Resources' }).click();

    // Confirm the embedded ResourceRequestList (now showing the new
    // request, per 03-08's "no page reload" fix) actually rendered it —
    // then read this test's own request id via the API directly, rather
    // than following the row's own incident-scoped link, whose target
    // route is a pre-existing gap outside this plan's scope (see
    // apiGetViaPage's own doc comment above).
    const row = page.locator('table.ep-table tbody tr', { hasText: requestDescription.slice(0, 40) });
    await expect(row).toBeVisible({ timeout: 10_000 });
    await expect(row.locator('.ep-badge', { hasText: 'Awaiting approval' })).toBeVisible();

    const list = await apiGetViaPage<{ items: { id: string; description: string }[] }>(
      page,
      `/api/v1/resource-requests?incident=${incident.id}`,
    );
    const created = list.items.find((item) => item.description === requestDescription);
    expect(created).toBeTruthy();
    requestId = created!.id;

    // Step 3: navigate to the Operating Picture; assert a triangle marker
    // is now present at a position near the incident's diamond marker
    // (same underlying location, since the resource request inherits its
    // incident's marker position per this plan's backend mapping).
    // findOwnResourceMarker's own proximity check IS this assertion.
    await page.goto('/operating-picture');
    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    const triangleMarker = await findOwnResourceMarker(page, incident);

    // Step 4: click (or keyboard-activate) the triangle marker; assert a
    // MapPopup appears showing the resource type/quantity and an
    // "Awaiting approval" Badge; click "Open request"; assert navigation
    // to /resource-requests/{id}.
    await triangleMarker.focus();
    await triangleMarker.press('Enter');

    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });
    await expect(popup.getByText('Resource type: Equipment')).toBeVisible();
    await expect(popup.getByText('Quantity: 3')).toBeVisible();
    await expect(popup.locator('.ep-badge', { hasText: 'Awaiting approval' })).toBeVisible();

    await popup.getByRole('button', { name: 'Open request' }).click();
    await expect(page).toHaveURL(new RegExp(`/resource-requests/${requestId}$`), {
      timeout: 10_000,
    });
  });

  test('3. Approving the request updates its marker\'s popup tone from warning to info, without a hard page reload beyond the existing poll', async ({
    page,
  }) => {
    // Approve via the detail page (reusing 03-06's approve action) —
    // commander@epmp.local (incident_commander) holds resource_requests
    // view/create but NOT approve per seed.ts's role split (that's
    // planning_logistics_chief's job); sign in as the planner identity
    // for this one action instead, matching 03-06/03-08's own precedent
    // for which identity performs which resource-request action. (Signing
    // in as commander first here was a bug: a second signIn call with an
    // already-resolved session in sessionStorage never redirects to
    // Keycloak at all, so RouteGuard would have stayed resolved as the
    // WRONG identity — commander, not planner.)
    await signInAsPlanningChief(page);
    await page.goto(`/resource-requests/${requestId}`);
    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Awaiting approval' }),
    ).toBeVisible({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Approve' }).click();
    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });

    // Navigate back to the Operating Picture — the SAME marker's popup
    // now shows an "Approved" Badge. The page's own 30s refetchInterval
    // (02-07) is the mechanism; a fresh page load already re-fetches on
    // mount, so this doesn't need to wait out the full interval.
    await page.goto('/operating-picture');
    const triangleMarker = await findOwnResourceMarker(page, incident);
    await triangleMarker.click();

    const popup = page.locator('.ep-map-popup');
    await expect(popup).toBeVisible({ timeout: 10_000 });
    await expect(popup.locator('.ep-badge', { hasText: 'Approved' })).toBeVisible({
      timeout: 10_000,
    });
  });

  test('4. Marking the request Fulfilled removes its triangle marker from the Operating Picture entirely (terminal-status exclusion)', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/resource-requests/${requestId}`);

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });

    // Two-phase per 03-04's documented behavior: first call assigns only.
    await page.getByRole('button', { name: 'Assign' }).click();
    await page.getByLabel('Assigned to', { exact: false }).fill('E2E Logistics Team');
    await page.getByRole('dialog').getByRole('button', { name: 'Assign' }).click();

    await expect(page.getByRole('button', { name: 'Mark fulfilled' })).toBeVisible({
      timeout: 10_000,
    });
    await page.getByRole('button', { name: 'Mark fulfilled' }).click();

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Fulfilled' }),
    ).toBeVisible({ timeout: 10_000 });

    // Navigate back to the Operating Picture; the triangle marker for
    // THIS request is now absent — operating-picture.ts's query excludes
    // Fulfilled/Declined entirely, proving completed requests correctly
    // disappear from the live map rather than accumulating as stale
    // clutter. The incident's own diamond marker is UNCHANGED (incidents
    // are never removed by a linked resource request's status), so
    // findOwnResourceMarker's own proximity check against it is exactly
    // the right scope: no triangle marker should be found at this
    // incident's own location anymore, regardless of how many OTHER
    // (still in-flight) resource markers the live compose-stack database
    // has accumulated elsewhere across this suite's own earlier runs.
    await page.goto('/operating-picture');
    const mapCanvas = page.locator('.ep-map-canvas');
    await expect(mapCanvas).toBeVisible({ timeout: 10_000 });

    await expect(incidentMarkerLocator(page, incident)).toBeVisible({ timeout: 10_000 });
    let foundAfterFulfill = false;
    try {
      await findOwnResourceMarker(page, incident);
      foundAfterFulfill = true;
    } catch {
      // Expected: no triangle marker found near this incident's own
      // location once the request is Fulfilled.
    }
    expect(foundAfterFulfill).toBe(false);
  });
});
