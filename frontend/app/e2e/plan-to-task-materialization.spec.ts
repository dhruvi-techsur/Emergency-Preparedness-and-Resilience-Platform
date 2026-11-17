import { test, expect, type Page } from '@playwright/test';
import { Pool } from 'pg';
import {
  signInAsPlanningChief,
  signInAsEocDirector,
} from './helpers/sign-in';

/**
 * 03-08's own integration-proof spec — the phase's terminal plan,
 * deliberately held until last (wave 6) because it is the only plan that
 * touches BOTH Phase 2's Incident Workspace AND this phase's plan/task/
 * resource-request screens simultaneously. Proves the roadmap's complete
 * Phase 3 goal end-to-end in ONE browser session: author a plan, link a
 * task template, approve the plan, materialize it against a real
 * incident, and see the resulting task appear in that SAME incident's
 * workspace — the full F3->F4 cross-module handoff, not just isolated
 * per-plan proofs.
 *
 * Two identities, matching 03-07's seed grants (same pair plans.spec.ts
 * already uses for the identical segregation-of-duties reason):
 *   - planner@epmp.local (planning_logistics_chief — `plans`
 *     view/create/edit, i.e. the AUTHOR) creates the plan, links the task
 *     template (link-tasks is action-level 'edit', per 03-03's design),
 *     creates the test incident, and triggers materialization.
 *   - eocdirector@epmp.local (eoc_director — `plans` view/review
 *     SPECIFICALLY, separate from the author's grant) approves the plan —
 *     a DIFFERENT reviewer, satisfying the no-self-approval rule exactly
 *     as plans.spec.ts's own cross-reviewer test does.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

/** Same pattern tasks-resources.spec.ts's apiPostViaPage/apiGetViaPage use:
 * reads the session token straight out of sessionStorage (the same key
 * src/auth/session-storage.ts owns) and issues a real fetch through the
 * SAME origin the page is already on (Vite's own /api dev proxy). Used
 * here for the materialize-tasks call itself, since 03-05's scope did not
 * build a dedicated UI "Materialize tasks" button for
 * `POST /api/v1/plans/{id}/materialize-tasks` (confirmed: no reference to
 * this endpoint exists anywhere under frontend/app/src/pages/plans/) — a
 * reasonable future UI enhancement 03-05 didn't literally build. Calling
 * the real endpoint via an authenticated fetch from the already-signed-in
 * browser session is an acceptable proof of the BACKEND integration; the
 * critical assertion this test makes (step 6 below) is that the
 * materialized task becomes visible in the real, embedded TaskList inside
 * the Incident Workspace — not just that the API call itself succeeds. */
async function apiPostViaPage<T>(page: Page, path: string, body: object): Promise<T> {
  return page.evaluate(
    async ({ path, body }) => {
      const token = window.sessionStorage.getItem('epmp_session_token');
      const res = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`POST ${path} failed: ${res.status} ${text}`);
      }
      return res.json();
    },
    { path, body },
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgres://postgres:devpass@localhost:5432/epmp',
});

/**
 * Test-fixture fix (Rule 3 - Blocking), same root cause 03-07's own
 * tasks-resources.spec.ts already documents and fixes for
 * `planner@epmp.local` and 02-07 originally fixed for
 * `commander@epmp.local`: `eocdirector@epmp.local` is JIT-provisioned by
 * sso.ts on first login with `jurisdiction_scope = '{}'` (confirmed via
 * direct query against the live compose-stack database). This test's own
 * plan/incident creation both use 'Default Agency' jurisdiction — the
 * reviewer identity doesn't strictly need incidents access for THIS test
 * (it only reviews the plan), but granting the same scope here keeps this
 * spec self-sufficient and consistent with the other two phase-3 specs'
 * identical one-time test-fixture correction, not a change to sso.ts's or
 * seed.ts's production behavior.
 */
async function ensureEocDirectorHasJurisdictionScope(): Promise<void> {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM jurisdictions WHERE name = 'Default Agency'`,
  );
  const jurisdictionId = rows[0]?.id;
  if (!jurisdictionId) return;
  await pool.query(
    `UPDATE users SET jurisdiction_scope = ARRAY[$1]::uuid[]
     WHERE email = 'eocdirector@epmp.local' AND NOT ($1 = ANY(jurisdiction_scope))`,
    [jurisdictionId],
  );
}

test.describe.serial('Plan-to-task materialization — the complete F3\u2192F4 cross-module handoff', () => {
  let planName: string;
  let planId: string;
  let incidentId: string;
  const templateTitle = 'Pre-position generators';

  test.afterAll(async () => {
    await pool.end();
  });

  test('1. Author creates a plan with one section and submits it for review', async ({ page }) => {
    await signInAsPlanningChief(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Plans & playbooks', { exact: true }).click();
    await expect(page).toHaveURL(/\/plans$/);

    await page.getByRole('button', { name: 'Create plan' }).first().click();
    await expect(page).toHaveURL(/\/plans\/new$/);

    planName = `E2E Materialization Plan ${Date.now()}`;
    await page.getByLabel('Name', { exact: false }).fill(planName);
    await page.getByLabel('Type', { exact: true }).selectOption('EOP');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    await page.getByLabel('Section 1 heading', { exact: false }).fill('Generator pre-positioning');
    await page
      .getByLabel('Section 1 body', { exact: false })
      .fill('Pre-position backup generators at critical facilities ahead of expected outages.');

    await page.getByRole('button', { name: 'Save as draft' }).click();
    await expect(page).toHaveURL(/\/plans\/[0-9a-f-]+\/edit$/, { timeout: 10_000 });
    const match = page.url().match(/\/plans\/([0-9a-f-]+)\/edit$/);
    planId = match![1];

    await page.getByRole('button', { name: 'Submit for review' }).click();
    await expect(page).toHaveURL(new RegExp(`/plans/${planId}$`), { timeout: 10_000 });
    await expect(page.locator('.ep-badge', { hasText: 'Review' })).toBeVisible({ timeout: 10_000 });
  });

  test('2. A DIFFERENT reviewer (eoc_director) approves the plan', async ({ page }) => {
    await ensureEocDirectorHasJurisdictionScope();
    await signInAsEocDirector(page);
    await page.goto(`/plans/${planId}`);

    await expect(page.locator('.ep-badge', { hasText: 'Review' })).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Review plan' }).click();
    await expect(page.getByRole('heading', { name: new RegExp(`Review "${planName}"`) })).toBeVisible();
    await page.getByRole('button', { name: 'Approve' }).click();

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("3. Author links a new task template to the now-Approved plan's section, directly from the Plan Detail reading view", async ({
    page,
  }) => {
    // link-tasks is action-level 'edit' (03-03's explicit, non-ambiguous
    // design: a task template is section metadata, not plan content
    // subject to the approval-immutability guarantee) — INTENTIONALLY
    // unrestricted by plan status. 03-03's own integration test already
    // proves this works server-side on an Approved plan; this step proves
    // it works through the real UI too, via this plan's own 03-08 fix
    // (PlanDetail.tsx previously had NO Link Tasks entry point at all —
    // only the Draft-only PlanEditor did).
    await signInAsPlanningChief(page);
    await page.goto(`/plans/${planId}`);

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Link tasks' }).first().click();
    const modal = page.getByRole('dialog', { name: /Link tasks to/ });
    await expect(modal).toBeVisible();

    await modal.getByRole('button', { name: '+ Define new template' }).click();
    // exact: false on every labelled field in this modal — TextField's
    // `required` prop appends a visually-hidden " *" to the label text
    // (see TextField.tsx), so the accessible name is "Name *", not "Name"
    // — same reasoning every other e2e spec in this codebase documents
    // for its own exact:false label matches.
    await modal.getByLabel('Name', { exact: false }).fill(templateTitle);
    await modal.getByLabel('Default owner role', { exact: false }).selectOption('incident_commander');
    await modal.getByLabel('Due offset', { exact: false }).fill('120');

    await modal.getByRole('button', { name: 'Link tasks' }).click();
    await expect(modal).not.toBeVisible();

    // The section now shows at least 1 linked task template — the plan
    // detail refetched after onLinked (see PlanDetail.tsx's
    // queryClient.invalidateQueries call).
    await expect(page.getByText(/1 linked task/)).toBeVisible({ timeout: 10_000 });
  });

  test('4. A test incident is created via the real UI create-incident flow', async ({ page }) => {
    // planning_logistics_chief is deliberately `incidents` VIEW-only
    // (seed.ts's `incidentsViewOnlyRoles`) — only incident_commander/
    // eoc_director hold `incidents:create`. Reusing eoc_director (already
    // used as the reviewer in test 2) for this one UI step, rather than
    // introducing a third identity, keeps this spec's identity set
    // minimal while staying within each role's real seeded grants.
    await signInAsEocDirector(page);
    await page.goto('/incidents/new');

    const incidentName = `E2E Materialization Incident ${Date.now()}`;
    await page.getByLabel('Name', { exact: false }).fill(incidentName);
    await page.getByLabel('Type', { exact: true }).selectOption('Flood');
    await page.getByLabel('Severity', { exact: true }).selectOption('Elevated');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    await page.getByRole('button', { name: 'Create incident' }).click();
    await page.waitForURL(/\/incidents\/[0-9a-f-]+$/, { timeout: 10_000 });

    const match = page.url().match(/\/incidents\/([0-9a-f-]+)$/);
    incidentId = match![1];
    expect(incidentId).toBeTruthy();
  });

  test('5. Materializing the plan\'s linked task template against the real incident creates a real task (via the backend endpoint, no dedicated UI trigger exists yet)', async ({
    page,
  }) => {
    // No UI button exists anywhere under frontend/app/src/pages/plans/
    // for POST /api/v1/plans/{id}/materialize-tasks (confirmed directly —
    // 03-05's scope didn't build one; a "Materialize tasks" button is a
    // reasonable future UI enhancement). Calling the real endpoint
    // through the already-signed-in browser session proves the backend
    // integration; step 6 below is the critical assertion proving the
    // resulting task is visible through the real, embedded UI.
    await signInAsPlanningChief(page);
    await page.goto(`/plans/${planId}`);

    const result = await apiPostViaPage<{
      created: Array<{ id: string; title: string; status: string }>;
      skipped: Array<{ template_id: string; reason: string }>;
    }>(page, `/api/v1/plans/${planId}/materialize-tasks`, { incident_id: incidentId });

    expect(result.skipped).toHaveLength(0);
    expect(result.created.length).toBeGreaterThanOrEqual(1);
    expect(result.created.some((t) => t.title === templateTitle)).toBe(true);
  });

  test('6. The materialized task appears in the SAME incident\'s real, embedded TaskList \u2014 the critical F3\u2192F4 cross-module proof', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}`);

    // Workspace renders with its real 4-tab structure (03-08's own
    // IncidentWorkspace.tsx edit, replacing 02-06's placeholders).
    await expect(page.getByRole('tab', { name: 'Tasks' })).toBeVisible({ timeout: 10_000 });
    await page.getByRole('tab', { name: 'Tasks' }).click();

    const tasksPanel = page.locator('#ep-tabpanel-tasks');
    await expect(tasksPanel).toBeVisible();

    // The embedded TaskList (incidentId prop) omits the Incident column
    // per its own documented contract — the materialized task's title
    // (the linked template's default_title) is the proof the
    // materialize-tasks call actually created a real row the UI can see,
    // not just a 200 response.
    const taskRow = tasksPanel.locator('table.ep-table tbody tr', { hasText: templateTitle });
    await expect(taskRow).toBeVisible({ timeout: 15_000 });
    await expect(taskRow.locator('.ep-badge', { hasText: 'Open' })).toBeVisible();
  });

  test('7. From the SAME Incident Workspace\'s Resources tab, a new resource request is pre-filled with this incident and appears live without a page reload', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/incidents/${incidentId}`);

    await page.getByRole('tab', { name: 'Resources' }).click();
    const resourcesPanel = page.locator('#ep-tabpanel-resources');
    await expect(resourcesPanel).toBeVisible();

    await resourcesPanel.getByRole('button', { name: 'New resource request' }).click();
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}/resource-requests/new$`), {
      timeout: 10_000,
    });

    // Incident field is PRE-FILLED and disabled — not requiring re-entry,
    // per CreateResourceRequest.tsx's routeIncidentId-aware
    // disabled={Boolean(routeIncidentId)} contract.
    const incidentField = page.getByLabel('Incident', { exact: false });
    await expect(incidentField).toBeDisabled();

    const description = `E2E generators for materialization test ${Date.now()}`;
    await page.getByLabel('Resource type', { exact: true }).selectOption('Equipment');
    await page.getByLabel('Description', { exact: false }).fill(description);
    await page.getByLabel('Quantity', { exact: false }).fill('3');

    const neededByDate = new Date(Date.now() + 24 * 60 * 60_000);
    const pad = (n: number) => String(n).padStart(2, '0');
    const neededByIso = `${neededByDate.getFullYear()}-${pad(neededByDate.getMonth() + 1)}-${pad(
      neededByDate.getDate(),
    )}T${pad(neededByDate.getHours())}:${pad(neededByDate.getMinutes())}`;
    await page.locator('input[placeholder="YYYY-MM-DD"]').fill(neededByIso.split('T')[0]);
    await page.locator('input[type="time"]').fill(neededByIso.split('T')[1]);

    await page.getByLabel('Requesting role', { exact: true }).selectOption('planning_logistics_chief');

    await page.getByRole('button', { name: 'Submit request' }).click();

    // 03-08's own fix (CreateResourceRequest.tsx) now returns to the SAME
    // incident workspace (not the standalone /resource-requests/{id}
    // detail page) when launched with a routeIncidentId — proving the
    // "no page reload, same workspace" success criterion.
    await expect(page).toHaveURL(new RegExp(`/incidents/${incidentId}$`), { timeout: 10_000 });

    await page.getByRole('tab', { name: 'Resources' }).click();
    const refreshedResourcesPanel = page.locator('#ep-tabpanel-resources');
    const newRow = refreshedResourcesPanel.locator('table.ep-table tbody tr', {
      hasText: description.slice(0, 40),
    });
    await expect(newRow).toBeVisible({ timeout: 10_000 });
    await expect(newRow.locator('.ep-badge', { hasText: 'Awaiting approval' })).toBeVisible();
  });
});
