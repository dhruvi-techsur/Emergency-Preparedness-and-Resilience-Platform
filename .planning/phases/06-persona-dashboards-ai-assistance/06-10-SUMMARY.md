---
phase: 06-persona-dashboards-ai-assistance
plan: 10
subsystem: testing
tags: [playwright, rbac, e2e-integration, persona-dashboards, ai-governance]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-assistance
    provides: "06-01's incidents:approve seed grant, 06-06/06-07's all-5-persona landing-config redirects, 06-08's ICS Form Editor, 06-09's Signal Triage Queue"
provides:
  - "One Playwright suite (persona-dashboards-integration.spec.ts, 8 tests) proving Phase 6's complete goal end-to-end across all 5 personas in a single run, not just per-plan"
  - "Explicit closure of the PER-02 (incident_commander) landing-config redirect gap no individual Phase 6 plan re-tested"
  - "Action-level RBAC proof: a role lacking incidents:approve is rejected 403 server-side on a direct API bypass, not merely hidden in the UI"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Phase-closing integration-proof plan: one new Playwright spec, zero production code, mirroring 03-08/04-07's established convention"
    - "test.describe.serial with a shared cross-test record (personaDashboardIdentities) populated by earlier tests and asserted on by a later cross-cutting test in the same serial block"
    - "Switching Keycloak-SSO identities within a SINGLE test requires clearing both the app's own session token (sessionStorage) AND Keycloak's SSO session cookie (context().clearCookies()) — every other multi-identity spec in this codebase switches across separate test() calls with a fresh context instead"

key-files:
  created:
    - frontend/app/e2e/persona-dashboards-integration.spec.ts
  modified: []

key-decisions:
  - "Step 6's cross-persona uniqueness check asserts distinct DASHBOARD IDENTITY (landing route + rendered nav combined), not nav-label uniqueness in isolation — PER-01/PER-02 render byte-identical SideNav label sets by a real, pre-existing, cross-phase architectural characteristic (GET /api/v1/me/nav-config derives nav items from feature-level permission PRESENCE, never per-action), not a defect this plan introduces or is scoped to fix"
  - "Switching eoc_director -> planning_logistics_chief within Task 1 step 8's single test required clearing sessionStorage AND cookies before the second signInAs* call — a Rule 1 test-only fix, since this codebase's other multi-identity specs always use a fresh test()/context per identity"

patterns-established:
  - "A phase-closing integration plan transfers any genuine finding it surfaces to whichever earlier plan's artifact is responsible (per its own threat model's T-0X-NN transfer disposition), documenting it rather than silently fixing production code outside its own stated zero-new-code scope"

# Metrics
duration: 35min
completed: 2026-11-19
---

# Phase 6 Plan 10: Cross-Persona Integration Proof Summary

**One Playwright suite (8 tests) signing in as all 5 EPMP personas in sequence, proving every persona lands on a distinct route with a server-matching nav, closing the one PER-02 redirect-mechanism gap no prior Phase 6 plan re-tested, and proving the `incidents:approve` RBAC gate rejects a non-holder's direct API bypass with a real 403.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-19T13:55:00Z
- **Completed:** 2026-11-19T14:29:59Z
- **Tasks:** 1
- **Files modified:** 1 (new)

## Accomplishments

- All 5 personas (PER-01 eoc_director, PER-02 incident_commander, PER-03 planning_logistics_chief, PER-04 field_responder, PER-05 secops_admin) proven to land on their own distinct default route with a rendered SideNav/bottom-bar that exactly matches a fresh server-side `GET /api/v1/me/nav-config` fetch, in one coherent cross-persona sweep.
- Closed the specific gap no individual Phase 6 plan explicitly re-tested: PER-02 (incident_commander)'s Phase-2-era landing page (`/incidents`) now provably flows through the SAME `landing-config` redirect mechanism 06-06/06-07 built for the other 4 personas, not a parallel/legacy one.
- Added the one action-level RBAC assertion this phase's individual plans never exercised: `planning_logistics_chief` (06-01's fix leaves this role on the unchanged view-only `incidents` grant) is rejected with a real `403 PERMISSION_DENIED` on a direct, UI-bypassing `POST .../ics-forms/{formId}/approve` call — proving success criterion 1's "never completes an action their role doesn't permit" holds server-side, not merely via a hidden/disabled button.
- Sanity re-checked that 06-08's ICS Form Editor (`/incidents/:id/forms/new`) and 06-09's Signal Triage Queue (`/signals`) both remain reachable and render without error after this phase's full persona-dashboard wiring landed end-to-end.
- Surfaced (and documented, per this plan's own zero-new-code scope) a genuine, pre-existing, non-blocking finding: PER-01 and PER-02 render byte-identical SideNav label sets.

## Task Commits

1. **Task 1: Cross-persona landing + nav-visibility integration sweep** - `8995fd3` (test)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/e2e/persona-dashboards-integration.spec.ts` - 8-test Playwright suite: steps 1-5 prove each persona's distinct landing + nav-match-server; step 6 proves distinct dashboard identity across all 5; step 7 sanity-rechecks 06-08/06-09's screens remain reachable; step 8 proves the `incidents:approve` action-level RBAC gate rejects a non-holder's direct bypass with 403.

## Decisions Made

1. **Step 6's assertion scope — dashboard identity, not nav-label uniqueness alone.** Running the test as originally specified (strict "no two personas share an identical nav label set") failed on first execution: PER-01 (eoc_director) and PER-02 (incident_commander) render byte-identical SideNav label sets. Investigation confirmed this is a real, consistent, cross-phase architectural characteristic — `GET /api/v1/me/nav-config` (`backend/src/modules/auth-org/routes.ts`, built incrementally across Phases 1-6) derives every nav item from feature-level permission **presence** (`role_permissions.actions.length > 0`), never from *which* actions a role holds within a feature. Querying the live database confirmed eoc_director and incident_commander hold the exact same set of features with ≥1 action each — their genuine difference is action-level (`eoc_director`: `plans:review` + `notifications:create`-only; `incident_commander`: `plans:view`-only + `notifications:approve`), which this five-phase-old nav-derivation layer was never built to surface.
   - Per this plan's own threat model (T-06-20, disposition "transfer") and its Output section's explicit "no new production code" scope, this finding's ownership transfers to whichever earlier plan's nav-derivation code is responsible — not something to silently patch here, which would also risk regressing 5+ phases of already-passing nav-dependent tests across this codebase.
   - Asked the user how to proceed; chosen path (of three offered): soften the test to assert what the roadmap's phrasing actually requires — a distinct **dashboard identity** (landing route + rendered nav, considered together) — which correctly distinguishes PER-01 (`/dashboard`) from PER-02 (`/incidents`) even though their nav label sets alone collide. The test now ALSO explicitly asserts the known nav-label overlap directly (not silently masked by the composite check), so the finding stays visible rather than disappearing into a passing assertion.
   - Recorded here as a non-blocking, documented limitation for a future phase or gap-closure plan: if per-action nav granularity is ever required by a product need, `nav-config`'s derivation would need to move from feature-presence booleans to action-aware gates (e.g. distinguishing `notifications:approve` from `notifications:create`-only) — a genuine Rule-4 architectural change, not attempted in this plan.

2. **Session/cookie clearing required to switch Keycloak identities mid-test (Task 1, step 8).** The plan's own action-level RBAC proof requires two DIFFERENT seeded identities (`eoc_director` to create the fixture ICS form, `planning_logistics_chief` to attempt the forbidden approve) within a single test, since the before/after causality (fixture exists, then a different role's bypass attempt against that SAME fixture) only makes sense sequentially within one test body. Every other multi-identity spec in this codebase (`plans.spec.ts`, `reporting.spec.ts`, `incident-to-evidence-trail.spec.ts`, `operating-picture-resource-markers.spec.ts`) switches identities across **separate** `test()` calls, each getting a fresh page/context automatically — so this exact pattern had never been exercised before. A first attempt (clearing only `sessionStorage`'s `epmp_session_token`) still failed: Keycloak's own SSO session cookie (set on this origin via Vite's dev proxy) silently re-authenticated the SAME prior identity on `signIn()`'s redirect, bouncing straight back to `eoc_director`'s own `/dashboard` without ever showing a login form. Adding `page.context().clearCookies()` alongside the sessionStorage clear fixed it — both layers of stale authentication state needed clearing, not just one.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug, test-only] Identity-switch within a single test required clearing both sessionStorage AND Keycloak's SSO cookie**
- **Found during:** Task 1, step 8 (action-level RBAC proof, the first use in this codebase of two sequential `signInAs*` calls within one test body)
- **Issue:** The second `signInAsPlanningChief(page)` call timed out waiting for Keycloak's login form — RouteGuard's bare `/` visit saw the still-valid `eoc_director` session (both the app's own `epmp_session_token` in sessionStorage AND Keycloak's own SSO cookie) and either skipped the Keycloak redirect entirely or silently re-authenticated as the SAME prior identity via SSO.
- **Fix:** Added `await page.evaluate(() => window.sessionStorage.removeItem('epmp_session_token'))` followed by `await page.context().clearCookies()` immediately before the second `signInAs*` call.
- **Files modified:** `frontend/app/e2e/persona-dashboards-integration.spec.ts` (test-only; no production code touched)
- **Verification:** Re-ran the full 8-test suite twice after the fix — all 8 pass consistently.
- **Committed in:** `8995fd3` (Task 1 commit)

### Architectural Decision (asked, not auto-fixed)

**2. [Rule 4 - Architectural, transferred per threat model] PER-01/PER-02 nav-label collision — test assertion softened, production code NOT changed**
- **Found during:** Task 1, step 6 (cross-persona nav-uniqueness assertion)
- **Issue:** `GET /api/v1/me/nav-config`'s feature-presence-only derivation (no per-action granularity) makes `eoc_director` and `incident_commander` render byte-identical SideNav label sets, despite genuinely different underlying permissions.
- **Why not auto-fixed:** Changing `routes.ts`'s nav derivation to be action-aware is a structural change to a route 5+ phases of already-passing tests depend on, and this plan's own Output section explicitly scopes it to "no new application code." The plan's own threat model (T-06-20) documents this exact category of finding as "transfer" — ownership belongs to whichever earlier plan's artifact is responsible, not to this terminal integration plan.
- **Resolution (user-selected):** Softened Task 1 step 6's assertion to check distinct **dashboard identity** (route + nav combined) rather than nav-label uniqueness alone — this correctly distinguishes all 5 personas (PER-01 and PER-02 differ by route even though their nav collides) while still directly, explicitly asserting the known nav-label overlap so it stays visible for a future phase/gap-closure plan to address if per-action nav granularity is ever needed.
- **Files modified:** `frontend/app/e2e/persona-dashboards-integration.spec.ts` only (test assertion, not production code)
- **Verification:** All 8 tests pass; the overlap is directly asserted (not accidentally masked) via an explicit `toEqual` check between the two personas' label sets alongside an explicit `not.toBe` check on their routes.
- **Committed in:** `8995fd3` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (test-only Rule 1), 1 architectural finding surfaced-and-transferred (Rule 4, resolved via user decision to soften the test assertion rather than alter shared production code).
**Impact on plan:** Both deviations are fully contained within this plan's own new test file — zero production code was touched, matching this plan's stated "no new application code" scope. The nav-label-collision finding is a genuine, pre-existing cross-phase characteristic correctly identified as out of this plan's remit to fix, and is now explicitly documented and asserted rather than silently passing or silently failing.

## Issues Encountered

None beyond the two deviations documented above, both resolved within this plan's own scope.

## User Setup Required

None - no external service configuration required.

## Known Stubs

None found. This plan adds test-only code (a Playwright spec); no handlers, hardcoded responses, or empty function bodies were introduced.

## Next Phase Readiness

- Phase 6 (Persona Dashboards & AI Assistance) is now fully proven end-to-end: all 5 personas land distinctly, nav-visibility matches the server in every case, 06-08/06-09's AI-governance screens remain reachable, and the `incidents:approve` RBAC gate holds at the action level.
- This was the phase's terminal plan (wave 9, depends_on 06-01/06-06/06-07/06-08/06-09) — all 10 Phase 6 plans are now complete.
- Documented, non-blocking gap for a future phase or gap-closure plan: `GET /api/v1/me/nav-config`'s feature-presence-only derivation cannot distinguish roles that hold the same set of features with different per-action grants (e.g. eoc_director vs incident_commander). No current product requirement depends on this distinction being visible in the nav itself, so it is not a blocker — only a documented limitation.
- Full backend suite (19 files, 108 tests), both `tsc --noEmit` checks (backend, frontend/app — design-system unchanged by this plan), and both builds (backend, frontend/app) all green with zero regression. Regression-ran `persona-dashboards.spec.ts` (4/4), `persona-dashboards-per04-per05.spec.ts` (5/5), and `app-shell.spec.ts` (4/4) — all unaffected.

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*

## Self-Check: PASSED

- `frontend/app/e2e/persona-dashboards-integration.spec.ts` — FOUND on disk
- `.planning/phases/06-persona-dashboards-ai-assistance/06-10-SUMMARY.md` — FOUND on disk
- Commit `8995fd3` (test(06-10): cross-persona integration proof) — FOUND in `git log`
- Backend build (`npm run build` in `backend/`) — exit 0, clean
- Frontend app build (`npm run build` in `frontend/app/`) — exit 0, clean (vite build succeeded)
- Backend `tsc --noEmit` — clean, no output
- Frontend app `tsc --noEmit` — clean, no output
- Full backend test suite — 19 files, 108/108 tests passing, zero regression
- New spec's own 8 tests — all passing (re-ran twice for stability, no flakiness observed)
- Regression spot-check (`persona-dashboards.spec.ts`, `persona-dashboards-per04-per05.spec.ts`, `app-shell.spec.ts`) — 13/13 passing, unaffected
- `## Known Stubs` section present above — "None found", no blocking stub
