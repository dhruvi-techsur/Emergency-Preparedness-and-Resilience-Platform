---
phase: 04-notifications-reporting-learning
plan: 09
subsystem: auth
tags: [rbac, fastify, opa, error-messages, gap-closure]

# Dependency graph
requires:
  - phase: 04-notifications-reporting-learning
    provides: "04-04's incident_commander/planning_logistics_chief reporting-feature action-level permission split (view+create vs edit), which is what actually surfaces this message-clarity gap in practice"
  - phase: 01-platform-foundation-deployable-shell
    provides: "01-03's requirePermission()/ROLE_UNRESOLVED factory this plan refines"
provides:
  - "PERMISSION_DENIED error_code/message constant in rbac.ts, returned by requirePermission()'s checkPermission()-false branch"
  - "Dedicated rbac.test.ts integration test proving the PERMISSION_DENIED vs ROLE_UNRESOLVED distinction against real OPA policy evaluation"
affects: [auth-org, comms-reporting, any-future-phase-adding-action-level-rbac-splits]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Two distinct 403 error_codes for RBAC denial: ROLE_UNRESOLVED (role never resolved — SSO-callback-only) vs PERMISSION_DENIED (resolved role, missing this specific action)"]

key-files:
  created:
    - backend/src/modules/auth-org/rbac.test.ts
  modified:
    - backend/src/modules/auth-org/rbac.ts
    - backend/src/modules/comms-reporting/notifications.test.ts

key-decisions:
  - "requirePermission()'s checkPermission()===false branch now returns PERMISSION_DENIED, not ROLE_UNRESOLVED — ROLE_UNRESOLVED remains untouched and exclusively used by the SSO callback's genuine JIT-provisioning-failure path (routes.ts), since users.role_id is NOT NULL REFERENCES roles(id) and can never be unresolved once a users row exists"
  - "No new validation logic added — checkPermission() (OPA) already returns a plain boolean with no 'why' signal, so this is purely a message-clarity rename at the one call site that was conflating two structurally distinct cases"

patterns-established:
  - "A role holding zero grants on a feature and a role holding some-but-not-the-checked-action on that same feature both correctly receive the SAME PERMISSION_DENIED response — there is no third case to distinguish in requirePermission()'s denial branch"

# Metrics
duration: 15min
completed: 2026-11-18
---

# Phase 4 Plan 9: RBAC Error-Message Accuracy Gap Closure Summary

**New PERMISSION_DENIED error_code distinguishes "resolved role lacking one action" from "role never resolved," closing UAT gap ref 4 with zero change to actual RBAC enforcement.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-11-18T12:30:00Z (approx.)
- **Completed:** 2026-11-18T12:43:53Z
- **Tasks:** 2
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments
- `requirePermission()`'s `checkPermission()===false` branch now returns a new `PERMISSION_DENIED` (403) error_code/message — "Your role doesn't include this action. Contact your administrator if you need access." — instead of the misleading `ROLE_UNRESOLVED` ("isn't assigned a role yet")
- `ROLE_UNRESOLVED` left completely unchanged, confirmed still exclusively used at its one genuine call site: the SSO callback's `RoleUnresolvedError` catch block (`routes.ts`), which handles the ONLY case where a role truly never resolved (JIT provisioning found no `group_to_role_mapping` match, before a `users` row even exists)
- New dedicated `rbac.test.ts` (156 lines) proves the distinction against real OPA policy evaluation across 3 cases: a role missing one specific action, a role holding zero grants on the feature at all (both get `PERMISSION_DENIED`, proving the split is about the action not feature-level grant presence), and a positive-control role holding the required action (unaffected)
- Updated the one pre-existing test assertion (`notifications.test.ts`'s `eoc_director` send-without-approve-grant case) that had encoded the old `ROLE_UNRESOLVED` expectation

## Task Commits

Each task was committed atomically:

1. **Task 1: Distinct PERMISSION_DENIED error_code for the checkPermission()-false branch** - `879860f` (fix)
2. **Task 2: Integration test proving the distinction holds against real OPA policy evaluation** - `0b7b69b` (test)

_Note: No plan metadata commit separate from these — this summary + STATE.md update follow in the final commit._

## Files Created/Modified
- `backend/src/modules/auth-org/rbac.ts` - Added `PERMISSION_DENIED` constant; `requirePermission()`'s denial branch now returns it instead of `ROLE_UNRESOLVED`
- `backend/src/modules/auth-org/rbac.test.ts` - New integration test file (3 tests): resolved-but-missing-one-action, resolved-with-zero-feature-grants, positive control
- `backend/src/modules/comms-reporting/notifications.test.ts` - Updated pre-existing assertion + comment from `ROLE_UNRESOLVED` to `PERMISSION_DENIED`

## Decisions Made
- `requirePermission()`'s permission-check-failed branch returns `PERMISSION_DENIED`; `ROLE_UNRESOLVED` stays reserved for the SSO-callback's genuine role-resolution-failure path only — no new validation rule, since `users.role_id` is `NOT NULL REFERENCES roles(id)` and this branch only ever runs after a role_id has already been successfully read from the DB
- No richer "why" signal was added beyond the generic message — `checkPermission()` (OPA) returns a plain boolean, deliberately not naming the specific missing feature/action/role in the response body, to avoid a role-permission-matrix disclosure vector (documented in the plan's own STRIDE register, T-04-16, disposition: accept)

## Deviations from Plan

None - plan executed exactly as written. Both tasks' verification blocks ran unmodified and all assertions passed on the first attempt.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UAT gap ref 4 (04-UAT.md, cosmetic severity) is closed: `commander@epmp.local` (incident_commander) attempting to save a SITREP draft now sees an accurate "your role doesn't include this action" message instead of the misleading "your account isn't assigned a role yet, contact your administrator" message
- Full backend suite verified green at 70 tests across 14 files (67 pre-existing + 3 new); `tsc --noEmit` clean; no regressions
- This is Phase 4's 9th plan (8 original + 1 gap closure, 04-08 still in progress independently with its own uncommitted working-tree changes left untouched by this plan's scope)

## Known Stubs

None found.

## Self-Check: PASSED

- `backend/src/modules/auth-org/rbac.test.ts` exists on disk
- `.planning/phases/04-notifications-reporting-learning/04-09-SUMMARY.md` exists on disk
- Commits `879860f` and `0b7b69b` both found in `git log`
- Build check: `npm run build -w backend` (tsc -p tsconfig.json) → exit 0
- Full backend test suite: 70/70 passed across 14 files (`npx vitest run`)
- `tsc --noEmit` (backend): exit 0, both before and after Task 2

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*
