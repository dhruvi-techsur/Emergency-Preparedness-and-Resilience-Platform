import { test, expect } from '@playwright/test';
import { signInThroughKeycloak } from './helpers/sign-in';

/**
 * 04-08 (gap closure, UAT gap ref 3): a signed-in user who opens a deep
 * link (e.g. a notification's Delivery Tracking page) in a FRESH browser
 * tab with no existing sessionStorage token must land on that EXACT
 * originally-requested page after the OIDC round-trip completes, not on
 * the home page.
 *
 * Root cause (see RouteGuard.tsx/oidc-config.ts/SignInCallback.tsx):
 * session-storage.ts deliberately scopes the app's own session token to
 * `sessionStorage` (per-tab, threat register T-01-21) — untouched by this
 * fix. A fresh tab with no token re-enters the OIDC flow; Keycloak's OWN
 * SSO session cookie (shared across tabs in the same browser context) lets
 * the round-trip complete silently with no login form, but
 * `SignInCallback.tsx` used to unconditionally `navigate('/')`, discarding
 * the originally-requested path. This spec proves the fix: `state` now
 * carries the path through the round-trip.
 */
test('A second tab with no sessionStorage token, deep-linked to a protected route, lands on that route after the silent SSO round-trip — not on the home page', async ({
  page,
}) => {
  // Tab 1: normal sign-in, establishing Keycloak's own SSO session cookie.
  await signInThroughKeycloak(page);

  // Tab 2: a new page in the SAME browser context as tab 1 — shares
  // cookies (including Keycloak's SSO session cookie, just established
  // above) with tab 1, but has its OWN independent sessionStorage, same
  // as two real tabs opened in one browser window. This is the exact
  // mechanism the gap report reproduced ("a fresh tab 2 in the SAME
  // browser context" per 04-UAT.md) — deliberately NOT a brand-new
  // isolated browser context (Playwright's `context()`-creating helper on
  // the `browser` object), which would create a separate cookie jar too
  // and hit a real Keycloak login form instead of the silent round-trip
  // this gap is actually about.
  const page2 = await page.context().newPage();

  // Navigate directly to the protected deep link — in a SINGLE navigation,
  // not a separate preliminary visit to '/' first. An earlier version of
  // this spec visited '/' to confirm the tab-2 precondition (no token) and
  // THEN navigated to the deep link as a second step, but that first visit
  // to '/' is itself an unauthenticated route: RouteGuard mounts there too
  // and immediately calls signIn('/'), kicking off ITS OWN Keycloak
  // round-trip (with the WRONG return path, '/') that races the real
  // deep-link navigation — the exact kind of double-redirect race that
  // would falsely "prove" the fix by accident (or falsely fail it,
  // depending on which round-trip's callback the browser happens to
  // process). One navigation, one round-trip, one correct return path.
  //
  // `waitUntil: 'commit'` resolves as soon as the browser commits to
  // displaying this response — before the document's scripts have had a
  // chance to run — so the sessionStorage check immediately below reflects
  // the tab's true pre-React state, not a timing accident.
  await page2.goto('/notifications/groups', { waitUntil: 'commit' });
  const tokenBefore = await page2.evaluate(() => window.sessionStorage.getItem('epmp_session_token'));
  expect(tokenBefore).toBeNull();

  // RouteGuard now mounts, sees no token, and calls
  // signIn('/notifications/groups'),
  // which redirects through Keycloak. Keycloak's SSO cookie (shared
  // with tab 1, via the same browser context) completes the round-trip
  // silently with no login form, redirecting back to /auth/callback,
  // which reads the `state` this plan's fix threads through and
  // navigates to the ORIGINAL path.
  await page2.waitForURL(/\/notifications\/groups$/, { timeout: 15_000 });
  expect(page2.url()).toContain('/notifications/groups');
  expect(page2.url()).not.toMatch(/\/$/);

  await page2.close();
});
