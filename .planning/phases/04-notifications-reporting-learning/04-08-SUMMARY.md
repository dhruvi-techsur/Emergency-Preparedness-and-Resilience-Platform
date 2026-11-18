---
phase: 04-notifications-reporting-learning
plan: 08
subsystem: ui-navigation-auth
tags: [react-router, oidc-client-ts, keycloak, playwright, notifications, incident-reports]

# Dependency graph
requires:
  - phase: 04-05
    provides: ComposeNotification routed at /notifications/compose, RecipientGroups/MessageTemplates sub-screens
  - phase: 04-07
    provides: IncidentWorkspace Reports-tab Generate-AAR disabled-gate Button
  - phase: 01-10
    provides: oidc-config.ts's signIn()/userManager (oidc-client-ts), RouteGuard, SignInCallback
provides:
  - "/notifications landing page (NotificationsLanding.tsx) with a primary Compose-notification action reachable with no incident context"
  - "SideNav 'Notifications' Coordinate-group item repointed from /notifications/groups to the new landing page"
  - "OIDC state-param return-path round-trip: signIn(returnPath) -> RouteGuard forwards location -> SignInCallback reads oidcUser.state and navigates there"
  - "Visible, always-rendered explanation (title + caption) on the disabled Generate AAR button"
affects: [04-notifications-reporting-learning, phase-5-planning]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "oidc-client-ts's native ExtraSigninRequestArgs.state used as the deep-link return-path carrier, read back off User.state on the callback"
    - "Playwright same-browser-context second page() (not browser.newContext()) to reproduce a shared-cookie/independent-sessionStorage tab pair"

key-files:
  created:
    - frontend/app/src/pages/notifications/NotificationsLanding.tsx
    - frontend/app/e2e/auth-deep-link-return-path.spec.ts
  modified:
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts
    - frontend/app/src/auth/oidc-config.ts
    - frontend/app/src/auth/RouteGuard.tsx
    - frontend/app/src/pages/SignInCallback.tsx
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/e2e/notifications-compose.spec.ts
    - frontend/app/e2e/incident-workspace.spec.ts

key-decisions:
  - "signIn(returnPath?) forwards the path via oidc-client-ts's own `state` param rather than a custom sessionStorage/localStorage return-path mechanism — the library already carries this through the full redirect+callback round-trip with no extra storage needed"
  - "SignInCallback's state type-guard rejects '/auth/callback' explicitly (not just non-string values) to prevent a pathological self-redirect loop if state ever carried that value"
  - "AAR button explanation uses BOTH a title attribute (hover/screen-reader) AND an always-visible caption, since no Tooltip component exists yet and a title-only approach is not discoverable on touch devices"

patterns-established:
  - "A second Playwright page() in the SAME browser context (page.context().newPage()) is the correct primitive for reproducing per-tab sessionStorage isolation against a shared SSO cookie — browser.newContext() creates a separate cookie jar and tests the wrong thing entirely"

# Metrics
duration: 35min
completed: 2026-11-18
---

# Phase 4 Plan 08: Gap Closure — Notifications Landing, Deep-Link Return-Path, AAR Button Explanation Summary

**Closed three UAT reachability/explainability gaps via pure routing/UX wiring: a new `/notifications` landing page with its own Compose action, an `oidc-client-ts` `state`-param return-path round-trip for deep links opened in fresh tabs, and a visible explanation on the disabled "Generate AAR" button.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-18T12:15:00Z (approx.)
- **Completed:** 2026-11-18T12:53:10Z
- **Tasks:** 3
- **Files modified:** 10 (2 created, 8 modified)

## Accomplishments

- A user with no open incident in front of them can now reach Compose Notification directly from the Notifications area (`/notifications` landing page's primary action), satisfying the UX mockup's documented OR-requirement for Compose's two independent reach-paths (the other being 04-07's Incident Workspace action).
- A signed-in user who opens a deep link in a fresh browser tab with no existing `sessionStorage` token now lands on that EXACT originally-requested page after the silent SSO round-trip completes, instead of being dropped on the home page — proven by a new Playwright spec using the correct same-context-second-page isolation primitive.
- The disabled "Generate AAR" button on an Open incident's Reports tab now tells the user WHY it's disabled (via both a `title` attribute and an always-visible caption), reusing `AarGenerator.tsx`'s own EmptyState message text verbatim.

## Task Commits

Each task was committed atomically:

1. **Task 1: Notifications landing page + SideNav repoint** - `0d2a720` (feat)
2. **Task 2: Deep-link-after-sign-in return-path** - `0ce43dd` (fix)
3. **Task 3: Explain the disabled "Generate AAR" button** - `4a44529` (fix)

_No TDD cycle — all three tasks are `type="auto"` plan tasks per 04-08-PLAN.md._

## Files Created/Modified

- `frontend/app/src/pages/notifications/NotificationsLanding.tsx` - New landing page: PageHeader + primary "Compose notification" action + in-page links to Groups/Templates
- `frontend/app/src/main.tsx` - Registered the `/notifications` route ahead of its more-specific siblings
- `backend/src/modules/auth-org/routes.ts` - Repointed the Coordinate group's "Notification groups" SideNav item to `/notifications`, renamed to "Notifications", corrected the stale 291-297 comment
- `frontend/app/src/auth/oidc-config.ts` - `signIn(returnPath?)` forwards the path via oidc-client-ts's `state` param
- `frontend/app/src/auth/RouteGuard.tsx` - Unauthenticated branch calls `signIn(location.pathname + location.search)`
- `frontend/app/src/pages/SignInCallback.tsx` - Reads `oidcUser.state` back (type-guarded) and navigates there instead of the hardcoded `/`
- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` - Disabled "Generate AAR" button gets a `title` attribute + an always-visible caption explaining the Closed-incident requirement
- `frontend/app/e2e/notifications-compose.spec.ts` - New standalone test: SideNav → landing page → Compose (no `incident=` param)
- `frontend/app/e2e/auth-deep-link-return-path.spec.ts` - New spec: a second same-context tab with no token, deep-linked to `/notifications/groups`, lands there (not `/`) after the silent SSO round-trip
- `frontend/app/e2e/incident-workspace.spec.ts` - New appended test: disabled AAR button's title + visible caption on an Open incident

## Decisions Made

- `signIn(returnPath?)` forwards the path via oidc-client-ts's own `state` param rather than inventing a custom return-path storage mechanism — the library already carries `state` through the full authorization-code redirect + callback round-trip, and `User.state` is a documented, typed (if `unknown`) read-back on the far side. No new storage key, no new threat surface beyond the existing type-guard.
- `SignInCallback`'s type-guard on `oidcUser.state` requires a non-empty string starting with `/` AND explicitly rejects `/auth/callback` itself — closing both the open-redirect vector (an absolute URL falls through to `/`) and a pathological self-redirect loop.
- The AAR-button explanation ships BOTH a `title` attribute (for hover/screen-reader discovery, matching `SideNav.tsx`'s own documented interim pattern since no `Tooltip` component exists yet) AND an always-visible `<p className="caption">` below it, since a `title`-only tooltip is not reliably discoverable (unavailable on touch, invisible until hover) — this was an explicit instruction in the plan, not a scope-creep addition.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's own `<verify>` grep for `browser.newContext()` false-matched an explanatory code comment**
- **Found during:** Task 2 (writing `auth-deep-link-return-path.spec.ts`)
- **Issue:** The plan's own doc-comment template (reproduced verbatim in the task's `<action>` block) explained the isolation choice using the literal string `browser.newContext()` inside a `//` comment. The plan's own `<verify>` step then grepped for that exact string to confirm it was NOT used — but grep matches comments too, so the verify step would always report "ERROR: WRONG ISOLATION PRIMITIVE STILL PRESENT" even though no such call existed anywhere in executable code.
- **Fix:** Reworded the comment to describe the same concept ("a brand-new isolated browser context... Playwright's `context()`-creating helper on the `browser` object") without using the literal substring the verify grep was checking for.
- **Files modified:** frontend/app/e2e/auth-deep-link-return-path.spec.ts
- **Verification:** Re-ran the exact verify grep; it now correctly reports `CONFIRMED: NO browser.newContext() USAGE`.
- **Committed in:** 0ce43dd (Task 2 commit)

**2. [Rule 1 - Bug] Playwright test's own two-step navigation raced two independent OIDC redirects against each other**
- **Found during:** Task 2's own Playwright run (first attempt failed with `page.waitForURL` timeout after landing on `/`, second attempt failed with `net::ERR_ABORTED`)
- **Issue:** The spec's first draft (following the plan's literal snippet) navigated tab 2 to `/` FIRST to confirm the "no token" precondition, then navigated a second time to the real deep link. But `/` is itself an unauthenticated route — `RouteGuard` mounted there too and immediately called `signIn('/')`, kicking off its OWN Keycloak round-trip with the WRONG return path, which raced the second, real navigation's own round-trip. Depending on timing this either timed out (`waitForURL` never matched `/notifications/groups` because the FIRST round-trip's callback won and landed on `/`) or threw `ERR_ABORTED` (the second `goto()` got superseded mid-flight by the first round-trip's own redirect).
- **Fix:** Rewrote the test to use a SINGLE navigation directly to the deep link, with `waitUntil: 'commit'` so the sessionStorage precondition check still runs before any script executes, but only one OIDC round-trip (with the correct return path) ever starts.
- **Files modified:** frontend/app/e2e/auth-deep-link-return-path.spec.ts
- **Verification:** Re-ran the spec in isolation and combined with `app-shell.spec.ts`/`notifications-compose.spec.ts` — passes consistently, and the full 76-test suite passed with this spec included.
- **Committed in:** 0ce43dd (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1, both confined to the new Playwright spec file — no production code touched by either fix)
**Impact on plan:** Both fixes are test-harness-only corrections to the plan's own literal snippet/verify command; the production code (oidc-config.ts/RouteGuard.tsx/SignInCallback.tsx) matches the plan's specified shape exactly. No scope creep.

## Issues Encountered

None beyond the two deviations above (both resolved within the Playwright spec itself).

## Known Stubs

None found. The `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` scan across all 10 changed/created files surfaced only pre-existing historical doc-comments in `IncidentWorkspace.tsx` describing Phase-2 placeholders 04-07 had ALREADY resolved in a prior plan — no new stub, TODO, or incomplete implementation was introduced by this plan's own changes.

## User Setup Required

None - no external service configuration required.

## Verification Evidence

- `cd frontend/app && npx tsc --noEmit` — clean, zero errors
- `cd backend && npx tsc -p tsconfig.json --noEmit` — clean, zero errors
- All three plan-specified contract greps pass (`NotificationsLanding` export, `/notifications` route, `href: '/notifications'` nav entry, `signIn(returnPath`, `signIn(location.pathname`, `oidcUser.state`, same-context second-page spec, title attribute, visible caption)
- Full Playwright suite: **76/76 passed** (1.4 min), including the 3 new/modified specs for this plan and zero regressions across app-shell, admin-*, incident-*, notifications-compose, operating-picture*, plans*, reporting, tasks-resources
- Full workspace build (`backend` + `frontend/design-system` + `frontend/app`): exit 0, all three builds succeeded
- Full backend unit-test suite: **70/70 passed**
- Full design-system unit-test suite: **51/51 passed**

## Next Phase Readiness

- Phase 4 (Notifications, Reporting & Learning) is now fully complete across all 8 plans (7 original + this gap-closure plan), with UAT gap refs 2, 3, and 5 closed.
- No blockers identified for Phase 5 planning.

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Self-Check: PASSED

- `frontend/app/src/pages/notifications/NotificationsLanding.tsx` — FOUND
- `frontend/app/e2e/auth-deep-link-return-path.spec.ts` — FOUND
- `.planning/phases/04-notifications-reporting-learning/04-08-SUMMARY.md` — FOUND
- Commits `0d2a720`, `0ce43dd`, `4a44529` — all FOUND in `git log`
- Build check: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → exit 0
- `## Known Stubs` section present above — no blocking stubs found
