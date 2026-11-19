import { test, expect, type Page } from '@playwright/test';
import {
  signInThroughKeycloak,
  signInAsIncidentCommander,
  signInAsEocDirector,
  signInAsPlanningChief,
  signInAsFieldResponder,
} from './helpers/sign-in';

/**
 * Phase 6's own terminal integration-proof plan (06-10), mirroring Phase
 * 3's 03-08 and Phase 4's 04-07 precedent: a single Playwright suite
 * signing in as ALL 5 personas in sequence, proving the roadmap's stated
 * phase goal end-to-end — "Every named persona lands on a dashboard
 * scoped to their job the moment they sign in" — rather than each persona
 * only being proven in isolation by its own plan (06-06/06-07).
 *
 * Also closes the one specific gap no individual Phase 6 plan explicitly
 * re-tested: PER-02 (incident_commander) already had a landing page from
 * Phase 2, so this suite is the first to confirm ITS redirect now flows
 * through the SAME `landing-config` mechanism 06-06/06-07 built for the
 * other 4 personas (step 2 below).
 *
 * Step 8 adds the one action-level RBAC assertion no prior Phase 6 plan
 * explicitly tested: a role lacking `incidents:approve`
 * (planning_logistics_chief, after 06-01's fix narrows that grant to
 * exactly incident_commander/eoc_director) is rejected with a real 403
 * on a direct ICS-form approve attempt — proving success criterion 1's
 * "never completes an action their role doesn't permit" holds
 * server-side, not merely via a hidden/disabled button.
 *
 * `test.describe.serial` since each test depends on a fresh sign-in, the
 * same convention `incident-workspace.spec.ts` already uses — and because
 * the cross-cutting assertion (step 6) and the sanity re-check (step 7)
 * depend on label sets collected by the earlier per-persona tests running
 * first, in order.
 */

/** Reads the session token straight out of sessionStorage (the same key
 * src/auth/session-storage.ts owns) and fetches a given path through the
 * SAME origin the page is already on — the established convention this
 * phase's other specs (ics-form-aidraft.spec.ts, signal-triage.spec.ts)
 * already use for direct-API test-fixture/proof calls. */
async function apiFetchViaPage<T>(
  page: Page,
  path: string,
  init?: { method?: string; body?: object },
): Promise<{ status: number; body: T }> {
  return page.evaluate(
    async ({ path, method, body }) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch(path, {
        method: method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const json = await res.json().catch(() => ({}));
      return { status: res.status, body: json };
    },
    { path, method: init?.method, body: init?.body },
  );
}

async function getCurrentUserId(page: Page): Promise<string> {
  const { body } = await apiFetchViaPage<{ id: string }>(page, '/api/v1/me');
  return body.id;
}

/** Fetches GET /api/v1/me/nav-config via the same in-page session token
 * and returns the flattened, sorted label set — the exact proof pattern
 * app-shell.spec.ts's test 2 and persona-dashboards.spec.ts's test 4
 * already establish for "the rendered SideNav never shows a group/item
 * the fetched config doesn't also contain". */
async function fetchNavConfigLabels(page: Page): Promise<string[]> {
  const navConfig = await page.evaluate(async () => {
    const token = window.sessionStorage.getItem('epmp_session_token');
    const res = await fetch('/api/v1/me/nav-config', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json() as Promise<{
      nav_groups: Array<{ label?: string; items: Array<{ label: string }> }>;
    }>;
  });
  return navConfig.nav_groups.flatMap((g) => g.items.map((i) => i.label)).sort();
}

async function renderedSideNavLabels(page: Page): Promise<string[]> {
  const sideNav = page.locator('nav[aria-label="Primary"]');
  await expect(sideNav).toBeVisible({ timeout: 10_000 });
  const labels = await sideNav.locator('.ep-sidenav__item-label').allTextContents();
  return labels.map((l) => l.trim()).sort();
}

// Collected across the serial test block for the cross-cutting
// distinct-dashboard-identity assertion (step 6). Each entry pairs the
// persona's landing route with its rendered nav label set.
const personaDashboardIdentities: Record<string, { route: string; labels: string[] }> = {};

test.describe.serial('Phase 6 cross-persona integration — all 5 personas land distinctly, nav matches server, RBAC holds at the action level', () => {
  test('1. PER-01 (eoc_director) lands on /dashboard with SideNav matching a fresh nav-config fetch', async ({
    page,
  }) => {
    await signInAsEocDirector(page);

    // Exactly /dashboard, not '/' — proving the redirect actually fired.
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    const expectedLabels = await fetchNavConfigLabels(page);
    const renderedLabels = await renderedSideNavLabels(page);
    expect(renderedLabels).toEqual(expectedLabels);

    personaDashboardIdentities['PER-01 eoc_director'] = { route: '/dashboard', labels: renderedLabels };
  });

  test('2. PER-02 (incident_commander) lands on /incidents via the SAME landing-config mechanism every other persona uses — the one gap no individual Phase 6 plan re-tested', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);

    // Phase 2's pre-existing landing page now flows through 06-02's
    // landing-config redirect, not a parallel/different mechanism.
    await expect(page).toHaveURL(/\/incidents$/, { timeout: 10_000 });

    const expectedLabels = await fetchNavConfigLabels(page);
    const renderedLabels = await renderedSideNavLabels(page);
    expect(renderedLabels).toEqual(expectedLabels);

    personaDashboardIdentities['PER-02 incident_commander'] = { route: '/incidents', labels: renderedLabels };
  });

  test('3. PER-03 (planning_logistics_chief) lands on /my-work with Signals present and Admin absent', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);

    await expect(page).toHaveURL(/\/my-work$/, { timeout: 10_000 });

    const expectedLabels = await fetchNavConfigLabels(page);
    const renderedLabels = await renderedSideNavLabels(page);
    expect(renderedLabels).toEqual(expectedLabels);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    // ai_assist-gated Signals item IS present (06-03's seed grants
    // ai_assist to PER-01/02/03).
    await expect(sideNav.getByText('Signals', { exact: true })).toBeVisible();
    // No admin permission (02-01's own seed decision, unchanged by this
    // phase) — the whole Admin group must be absent.
    await expect(sideNav.getByText('Admin', { exact: true })).toHaveCount(0);

    personaDashboardIdentities['PER-03 planning_logistics_chief'] = {
      route: '/my-work',
      labels: renderedLabels,
    };
  });

  test('4. PER-04 (field_responder) lands on /field with bottom-bar-only nav (no desktop rail) at a DESKTOP viewport, exactly 4 items', async ({
    page,
  }) => {
    // Desktop viewport, set explicitly BEFORE navigating — proves the
    // bottom-bar override is role-driven, not viewport-driven (same
    // convention persona-dashboards-per04-per05.spec.ts's test 1 already
    // establishes).
    await page.setViewportSize({ width: 1280, height: 800 });

    await signInAsFieldResponder(page);

    await expect(page).toHaveURL(/\/field$/, { timeout: 10_000 });

    // NO desktop rail element exists anywhere in the DOM — not merely
    // hidden via CSS.
    const railNav = page.locator('nav[aria-label="Primary"].ep-sidenav--rail');
    await expect(railNav).toHaveCount(0);

    const bottomBar = page.locator('nav[aria-label="Primary"].ep-sidenav--bottom-bar');
    await expect(bottomBar).toBeVisible({ timeout: 10_000 });

    const items = bottomBar.locator('.ep-sidenav__bottom-item-wrap');
    await expect(items).toHaveCount(4);

    const bottomLabels = (
      await bottomBar.locator('.ep-sidenav__bottom-label').allTextContents()
    )
      .map((l) => l.trim())
      .sort();
    personaDashboardIdentities['PER-04 field_responder'] = { route: '/field', labels: bottomLabels };
  });

  test('5. PER-05 (secops_admin) lands on /admin/platform-monitoring, FacetToggle defaults to Admin, switching to Executive shows exactly Executive dashboard/Reports', async ({
    page,
  }) => {
    await signInThroughKeycloak(page);

    // Unchanged Phase-1 default.
    await expect(page).toHaveURL(/\/admin\/platform-monitoring$/, { timeout: 10_000 });

    const facetToggle = page.getByLabel('Facet');
    await expect(facetToggle).toBeVisible({ timeout: 10_000 });
    await expect(facetToggle).toHaveValue('admin');

    const adminLabels = await renderedSideNavLabels(page);
    personaDashboardIdentities['PER-05 secops_admin (admin facet)'] = {
      route: '/admin/platform-monitoring',
      labels: adminLabels,
    };

    await facetToggle.selectOption('executive');

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav.getByText('Executive dashboard', { exact: true })).toBeVisible();
    await expect(sideNav.getByText('Reports', { exact: true })).toBeVisible();
    // Admin group replaced entirely, not merely supplemented.
    await expect(sideNav.getByText('Admin', { exact: true })).toHaveCount(0);

    const executiveLabels = await renderedSideNavLabels(page);
    expect(executiveLabels).toEqual(['Executive dashboard', 'Reports']);
  });

  test('6. Cross-cutting: every persona has a distinct dashboard identity (landing route + rendered nav combined)', async () => {
    // "Distinct default dashboard" per the roadmap's own phrasing is the
    // combination a signed-in user actually experiences: WHERE they land
    // AND what they see there — not nav-label uniqueness considered in
    // isolation. Checked that way, this assertion is exactly as strong as
    // it needs to be: no persona's post-sign-in EXPERIENCE duplicates
    // another's.
    //
    // Known, pre-existing, non-blocking characteristic (NOT introduced by
    // this plan — see this plan's own SUMMARY.md "Deviations" for the
    // full record): PER-01 (eoc_director) and PER-02 (incident_commander)
    // happen to render BYTE-IDENTICAL SideNav label sets, because GET
    // /api/v1/me/nav-config (backend/src/modules/auth-org/routes.ts, built
    // incrementally across Phases 1-6) derives every nav item from
    // feature-level PRESENCE (`role_permissions.actions.length > 0`),
    // never from WHICH actions a role holds within a feature. These two
    // roles hold the exact same set of features with >=1 action each —
    // their real difference is action-level (eoc_director: plans:review +
    // notifications:create-only; incident_commander: plans:view-only +
    // notifications:approve), which this nav-derivation layer was never
    // built to surface. Their landing ROUTES differ (/dashboard vs
    // /incidents), so the combined identity this test actually checks
    // still correctly distinguishes them.
    const entries = Object.entries(personaDashboardIdentities);
    // Sanity: every prior test actually populated its entry before this
    // comparison runs (serial execution guarantees ordering).
    expect(entries.length).toBeGreaterThanOrEqual(5);

    const seen = new Map<string, string>();
    for (const [persona, identity] of entries) {
      const key = JSON.stringify(identity);
      const clashingPersona = seen.get(key);
      expect(
        clashingPersona,
        `${persona} has an identical (route, nav) dashboard identity to ${clashingPersona ?? '(none)'}: ${key}`,
      ).toBeUndefined();
      seen.set(key, persona);
    }

    // Direct, explicit proof the known nav-label overlap is real and
    // tracked, not silently masked by the composite check above.
    expect(personaDashboardIdentities['PER-01 eoc_director'].labels).toEqual(
      personaDashboardIdentities['PER-02 incident_commander'].labels,
    );
    expect(personaDashboardIdentities['PER-01 eoc_director'].route).not.toBe(
      personaDashboardIdentities['PER-02 incident_commander'].route,
    );
  });

  test('7. Sanity re-check: 06-08/06-09\u2019s screens remain reachable after full persona-dashboard wiring', async ({
    page,
  }) => {
    await signInAsIncidentCommander(page);
    await expect(page).toHaveURL(/\/incidents$/, { timeout: 10_000 });

    // /signals renders without error.
    await page.goto('/signals');
    const signalsTable = page.locator('table.ep-table');
    await expect(signalsTable).toBeVisible({ timeout: 10_000 });

    // An existing incident's new-ICS-form route renders without error.
    const incidentsList = await apiFetchViaPage<{ items: Array<{ id: string }> }>(
      page,
      '/api/v1/incidents',
    );
    expect(incidentsList.status).toBe(200);
    expect(incidentsList.body.items.length).toBeGreaterThan(0);
    const existingIncidentId = incidentsList.body.items[0].id;

    await page.goto(`/incidents/${existingIncidentId}/forms/new`);
    const narrativeField = page.getByLabel('Narrative', { exact: false });
    await expect(narrativeField).toBeVisible({ timeout: 10_000 });
    // No error boundary / blank screen — the page's own PageHeader title
    // rendered.
    await expect(page.getByRole('heading', { name: /ICS-201/ })).toBeVisible();
  });

  test('8. Action-level RBAC proof: planning_logistics_chief (no incidents:approve) is rejected with 403 on a direct ICS-form approve attempt', async ({
    page,
  }) => {
    // First, signed in as eoc_director (holds incidents:edit per 06-01's
    // seed), create a fresh ICS-201 form on an existing incident via the
    // real create endpoint.
    await signInAsEocDirector(page);
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 10_000 });

    const incidentsList = await apiFetchViaPage<{ items: Array<{ id: string }> }>(
      page,
      '/api/v1/incidents',
    );
    expect(incidentsList.status).toBe(200);
    expect(incidentsList.body.items.length).toBeGreaterThan(0);
    const incidentId = incidentsList.body.items[0].id;

    const freshForm = await apiFetchViaPage<{ id: string }>(
      page,
      `/api/v1/incidents/${incidentId}/ics-forms`,
      {
        method: 'POST',
        body: {
          form_type: 'ICS-201',
          content: { narrative: '06-10 action-level RBAC proof fixture form' },
        },
      },
    );
    expect(freshForm.status).toBe(201);
    const formId = freshForm.body.id;

    // Clear the eoc_director session before switching identities. Two
    // layers of stale state, both needed:
    //   1. epmp_session_token in sessionStorage — without clearing this,
    //      RouteGuard treats the second identity's '/' visit as
    //      "already signed in" and never calls signIn() at all.
    //   2. Keycloak's OWN SSO session cookie (set on this origin via
    //      Vite's dev proxy for /realms/epmp/...) — even after (1),
    //      signIn()'s redirect to Keycloak's authorization endpoint
    //      silently re-authenticates the SAME prior identity via that
    //      cookie and bounces straight back without ever showing the
    //      username/password form, landing back on eoc_director's own
    //      /dashboard instead of prompting for planning_logistics_chief.
    // Every OTHER multi-identity spec in this codebase (plans.spec.ts,
    // reporting.spec.ts, incident-to-evidence-trail.spec.ts) switches
    // identities across SEPARATE `test()` calls with a fresh page/context
    // each time, never within one test — so neither of these two clears
    // has ever been needed until this plan's single-test two-identity
    // sequence.
    await page.evaluate(() => window.sessionStorage.removeItem('epmp_session_token'));
    await page.context().clearCookies();

    // Now sign in as planning_logistics_chief (06-01's fix leaves this
    // role on the UNCHANGED view-only `incidents` grant — no `approve`
    // action) and attempt the approve directly via its own session's
    // bearer token.
    await signInAsPlanningChief(page);
    await expect(page).toHaveURL(/\/my-work$/, { timeout: 10_000 });

    const planningChiefUserId = await getCurrentUserId(page);

    const bypassAttempt = await apiFetchViaPage<{ error_code: string }>(
      page,
      `/api/v1/incidents/${incidentId}/ics-forms/${formId}/approve`,
      { method: 'POST', body: { approved_by: planningChiefUserId } },
    );

    // The server rejects the attempt with 403 regardless of whether the
    // "Approve form" control itself is visible — proving success
    // criterion 1's "never completes an action their role doesn't
    // permit" holds at the action level, not just the nav-group level.
    expect(bypassAttempt.status).toBe(403);
    expect(bypassAttempt.body.error_code).toBe('PERMISSION_DENIED');
  });
});
