import { test, expect } from '@playwright/test';
import { signInAsPlanningChief, signInAsEocDirector } from './helpers/sign-in';

/**
 * Full-stack e2e coverage of 03-05's objective: the five Plans & Playbooks
 * screens (Plan Repository, Plan Detail, Plan Editor, Link Tasks modal,
 * Approval Workflow modal) are reachable from the shell's "Prepare" SideNav
 * group and functional against the real backend, including the
 * cross-reviewer no-self-approval flow.
 *
 * Two separate signed-in sessions (via sequential sign-in/sign-out within
 * one test, reusing the single shared `page` — Claude's discretion per
 * this plan's own invitation; sequential sign-in keeps the test linear and
 * avoids the extra bookkeeping of two separate `browser.newContext()`
 * sessions for a flow that is inherently serial anyway: author submits,
 * THEN a different reviewer approves):
 *   - planner@epmp.local (planning_logistics_chief role — 03-07's seed
 *     grants `plans` view/create/edit) is the author.
 *   - eocdirector@epmp.local (eoc_director role — 03-07's seed grants
 *     `plans` view/review SPECIFICALLY, separate from the author's grant)
 *     is the reviewer.
 *
 * Runs against the live compose stack (db, nats, opa, keycloak) + the
 * backend dev server + this app's own Vite dev server, started by this
 * plan's documented <verify> pre-steps before this spec file runs.
 */

test.describe.serial('Plans & playbooks — authoring, approval workflow, reading view', () => {
  let planName: string;
  let planId: string;

  test('1-2. Author creates a plan with one section, saves as draft, then submits for review', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);

    const sideNav = page.locator('nav[aria-label="Primary"]');
    await expect(sideNav).toBeVisible({ timeout: 10_000 });
    await sideNav.getByText('Plans & playbooks', { exact: true }).click();
    await expect(page).toHaveURL(/\/plans$/);

    await page.getByRole('button', { name: 'Create plan' }).first().click();
    await expect(page).toHaveURL(/\/plans\/new$/);

    planName = `E2E Flood Response EOP ${Date.now()}`;
    await page.getByLabel('Name', { exact: false }).fill(planName);
    await page.getByLabel('Type', { exact: true }).selectOption('EOP');

    const jurisdictionInput = page.getByLabel('Jurisdiction', { exact: false });
    await jurisdictionInput.click();
    await jurisdictionInput.fill('Default Agency');
    await page.getByRole('option', { name: 'Default Agency' }).click();

    await page.getByLabel('Section 1 heading', { exact: false }).fill('Activation Criteria');
    await page
      .getByLabel('Section 1 body', { exact: false })
      .fill('When the river gauge exceeds flood stage.');

    await page.getByRole('button', { name: 'Save as draft' }).click();

    // Redirect to the edit view with status Draft.
    await expect(page).toHaveURL(/\/plans\/[0-9a-f-]+\/edit$/, { timeout: 10_000 });
    const match = page.url().match(/\/plans\/([0-9a-f-]+)\/edit$/);
    planId = match![1];

    // Submit for review.
    await page.getByRole('button', { name: 'Submit for review' }).click();
    await expect(page).toHaveURL(new RegExp(`/plans/${planId}$`), { timeout: 10_000 });
    await expect(page.locator('.ep-badge', { hasText: 'Review' })).toBeVisible({ timeout: 10_000 });
  });

  test('3. Author (same role has no review permission) sees the Review plan button per this plan\'s documented UX-convenience-only rendering, but the server-side RBAC gate blocks the actual approve attempt', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/plans/${planId}`);

    // Per this plan's own documented scope note on PlanDetail.tsx (and
    // its threat_model T-03-11): the frontend does NOT independently
    // check "review" permission beyond rendering the button when
    // status==='Review' — the actual authorization boundary is 03-03's
    // server-side requirePermission('plans','review'). planning_logistics_chief
    // (the author)'s seeded grant is view/create/edit only — NOT review
    // (03-07's segregation-of-duties decision) — so this is the "button
    // visible, server blocks the real action" path: clicking Approve
    // must NOT succeed and must NOT navigate the plan to Approved.
    await page.getByRole('button', { name: 'Review plan' }).click();
    await page.getByRole('button', { name: 'Approve' }).click();

    // The server's RBAC preHandler rejects before reaching the
    // self-approval check (the author never gets far enough to trigger
    // SELF_APPROVAL_BLOCKED specifically, since they lack 'review'
    // permission entirely) — some error Alert renders inside the modal,
    // and critically, the plan's status remains Review, not Approved.
    await expect(page.locator('.ep-alert--danger')).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press('Escape');

    await page.reload();
    await expect(page.locator('.ep-badge', { hasText: 'Review' })).toBeVisible({ timeout: 10_000 });
  });

  test('4. A DIFFERENT reviewer (eoc_director) approves the plan — status becomes Approved, no self-approval error', async ({
    page,
  }) => {
    await signInAsEocDirector(page);
    await page.goto(`/plans/${planId}`);

    await expect(page.locator('.ep-badge', { hasText: 'Review' })).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Review plan' }).click();
    await expect(page.getByRole('heading', { name: new RegExp(`Review "${planName}"`) })).toBeVisible();

    await page.getByRole('button', { name: 'Approve' }).click();

    // Modal closes, no self-approval Alert, status Badge updates — scoped
    // to the PageHeader's status slot specifically, since the version
    // history sidebar ALSO renders an "Approved" Badge for the newly
    // reviewed version entry (both are legitimately present at once).
    await expect(page.getByText('SELF_APPROVAL_BLOCKED')).toHaveCount(0);
    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });
  });

  test('5. Plan Detail reading view: content constrained to 720px reading-max, version history shows a reviewer', async ({
    page,
  }) => {
    await signInAsPlanningChief(page);
    await page.goto(`/plans/${planId}`);

    await expect(
      page.locator('.ep-page-header__status .ep-badge', { hasText: 'Approved' }),
    ).toBeVisible({ timeout: 10_000 });

    const content = page.locator('.ep-plan-detail__content');
    await expect(content).toBeVisible();
    const width = await content.evaluate((el) => el.getBoundingClientRect().width);
    expect(width).toBeLessThanOrEqual(720);

    // Version history shows at least one entry with a non-null reviewer —
    // "Approved" badge in the history list is only rendered when
    // review_action is present with a reviewed_by.
    const historyEntry = page.locator('.ep-plan-detail__version-row', { hasText: 'Approved' });
    await expect(historyEntry.first()).toBeVisible({ timeout: 10_000 });
  });
});
