---
phase: 03-plans-tasks-resource-requests
plan: 07
subsystem: auth-org
tags: [rbac, seed, role_permissions, opa, idempotency]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "03-01's tasks feature-permission routes, 03-04's resource_requests approve/decline/fulfill routes, 03-03's plans review route (action-string only, confirmed via grep against tasks.ts/resource-requests.ts)"
provides:
  - "role_permissions seed grants for 'plans'/'tasks'/'resource_requests' features against the FRD-named roles (incident_commander, eoc_director, planning_logistics_chief, field_responder)"
  - "Integration-test proof that the real seed script's grants authorize real HTTP requests through OPA end-to-end, not just exist as database rows"
affects: ["03-05", "03-06", "03-08", "03-09"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Action-level split within one feature-permission string (plans: create/edit vs review; resource_requests: create vs approve) to make segregation-of-duties satisfiable with single-role seeded accounts"
    - "findSeededRoleId() test helper throws a clear error instead of falling back to creating a throwaway role — forces the test to actually exercise the real seed.ts output"

key-files:
  created: []
  modified:
    - "backend/scripts/seed.ts — 12 new idempotent role_permissions grant blocks for plans/tasks/resource_requests"
    - "backend/src/modules/incident-ops/incidents.test.ts — new describe block with 3 integration tests proving seeded grants authorize real requests"

key-decisions:
  - "resource_requests 'approve' action-level granted ONLY to planning_logistics_chief, not incident_commander/eoc_director — command staff can create a request but logistics alone approves it, per the FRD's explicit role split"
  - "plans 'review' action-level granted to eoc_director specifically, SEPARATE from planning_logistics_chief's create/edit grant — makes the no-self-approval workflow satisfiable with real seeded accounts (a single role holding both would make cross-reviewer tests impossible against the seeded role set)"
  - "No explicit syncRolePermissionsToOpa() call added to seed.ts — confirmed server.ts's start() already re-syncs the FULL role_permissions table to OPA unconditionally at every boot, so a normal `npm run migrate && npm run seed` followed by app start is sufficient, identical to 02-01's resolution of the same question for 'incidents'"

# Metrics
duration: 25min
completed: 2026-11-17
---

# Phase 3 Plan 07: Seed role-permission grants for plans/tasks/resource_requests Summary

**Twelve idempotent `role_permissions` INSERT blocks grant the FRD-named roles (incident_commander, eoc_director, planning_logistics_chief, field_responder) access to the three new Phase 3 feature-permission strings — with the `review`/`approve` action-levels deliberately split onto a DIFFERENT role than `create`/`edit`, proven end-to-end against real OPA policy evaluation via a new integration-test describe block in `incidents.test.ts`.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-17T13:38:35Z (approx, per STATE.md's prior session timestamp)
- **Completed:** 2026-11-17T13:47:41Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `backend/scripts/seed.ts` extended with 3 new grant groups (tasks, resource_requests, plans), following 02-01's exact `findOrInsert` idempotent pattern — verified by running `npm run seed` twice against the real compose-stack database: first run inserted 12 new rows, second run inserted 0 (zero duplicates on re-seed, confirmed via `GROUP BY role_id, feature HAVING count(*) > 1` returning 0 rows).
- The action-level split required by the phase's segregation-of-duties rules is now real seed data, not just application-layer logic:
  - `resource_requests`: `planning_logistics_chief` gets `{view,create,edit,approve}`; `incident_commander`/`eoc_director` get `{view,create}` (no `approve`) — command staff can originate a request but cannot approve their own.
  - `plans`: `planning_logistics_chief` (author) gets `{view,create,edit}`; `eoc_director` (reviewer) gets `{view,review}` — a DIFFERENT role than the author, which is what makes 03-03's no-self-approval gate satisfiable with distinct real seeded accounts.
  - `tasks`: command/logistics roles get `{view,create,edit}`; `field_responder` is view-only.
- New integration-test `describe` block in `incidents.test.ts` (Task 2) proves these grants authorize real HTTP requests through the real OPA policy engine — not just that rows exist in Postgres:
  1. `incident_commander`'s seeded `tasks` grant → real `POST /api/v1/tasks` returns `201`.
  2. `planning_logistics_chief`'s seeded `resource_requests` `approve` grant → `POST .../approve` on a request created by a DIFFERENT user (`incident_commander`) returns `200`, not `403`.
  3. `field_responder`'s seeded view-only `tasks` grant → `GET /api/v1/tasks` returns `200`, `POST /api/v1/tasks` returns `403`.
- Confirmed (by reading `server.ts`'s `start()` directly) that no explicit `syncRolePermissionsToOpa()` call is needed in `seed.ts` itself — the server already re-syncs the full table at every boot, identical to 02-01's resolution of the same question for `incidents`.
- Full backend suite: **10/10 files, 52/52 tests green** (49 pre-existing + 3 new), `tsc --noEmit` clean, `npm run build` clean.

## Task Commits

Each task was committed atomically:

1. **Task 1: Idempotent seed additions for plans/tasks/resource_requests feature-permissions** - `2cc4b22` (feat)
2. **Task 2: Integration test — seeded roles can actually reach the gated routes end-to-end** - `a7efde1` (test)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `backend/scripts/seed.ts` — 12 new idempotent `role_permissions` grant blocks for `tasks`/`resource_requests`/`plans`, with inline documentation of the action-level split reasoning and the deliberate `secops_admin` omission (mirrors the existing `incidents` pattern).
- `backend/src/modules/incident-ops/incidents.test.ts` — new `describe('03-07: seeded role_permissions grants authorize real requests end-to-end')` block with 3 `it()` cases, appended to 02-01's existing test file per the plan's own stated preference (no new dedicated file needed; the addition is small and targeted).

## Decisions Made

- **Appended to `incidents.test.ts` rather than creating a dedicated `seed-permissions.test.ts`** — the plan explicitly offered Claude's discretion on this; three small, targeted test cases proving the real seed's effect fit comfortably within the existing file without cluttering it, and keeping them there means they run alongside the file's other OPA-integration-style tests with zero new test-setup boilerplate (the file already imports `syncRolePermissionsToOpa`, `mintSessionToken`, etc.).
- **`findSeededRoleId()` throws rather than falls back to creating a throwaway role** — a design choice to make the test fail loudly (with a clear error naming exactly why) if `npm run seed` hasn't actually run against the test database, rather than silently passing against a test-only role_permissions row that would prove nothing about the real seed script's effect. This matches the plan's own stated intent: proving the REAL seeded grants work, not re-deriving a parallel test fixture.
- **No architectural changes** — this plan's scope was entirely additive seed-data rows plus a proving integration test; no schema, no new endpoints, no new modules.

## Deviations from Plan

None - plan executed exactly as written. Both tasks completed on the first attempt with zero auto-fixes needed:
- Task 1's three grant-action strings (`resource_requests`'s `approve` action-name, `plans`'s `review` action-name) were double-checked against the actual route files (`resource-requests.ts`, and `tasks.ts`/`rbac.ts` for the general pattern) exactly as the plan instructed ("confirm this matches 03-04's actual action-string choice before finalizing") — confirmed `requirePermission('resource_requests', 'approve')` gates both the approve and decline routes in `resource-requests.ts`, matching this plan's seed grant exactly with no adjustment needed.
- `plans`'s `review` action-string could not be independently confirmed against 03-03's `plans.ts` file, since that module did not yet exist at plan-execution time (03-03 is executing in parallel in a separate agent). The seed grant uses `review` per this plan's own explicit specification (`{feature:'plans', actions:['view','review']}` for `eoc_director`), consistent with 03-03's own plan document's stated intent (`requirePermission('plans','review')`) read directly from `.planning/phases/03-plans-tasks-resource-requests/03-03-PLAN.md`.

## Issues Encountered

None. Database/NATS/OPA services were already running via `docker compose up -d db nats opa` per this plan's setup note; migrations were already current (no new migration needed since this plan only touches seed data and tests, not schema).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Every frontend plan in this phase (03-05, 03-06) and the end-to-end test (03-08) can now sign in as a real seeded user (`incident_commander`, `eoc_director`, `planning_logistics_chief`, `field_responder`) and reach the `plans`/`tasks`/`resource_requests` features their Playwright tests will exercise — this plan closes the gap between "routes exist and are RBAC-gated" (03-01/03-04, and eventually 03-03) and "a real user can actually use them."
- **One cross-plan note for a future reader:** 03-03 (the `plans` module itself) was executing in parallel in a separate agent at the time this plan ran, so this plan's `plans` feature-permission grants were written based on 03-03's own PLAN.md specification of its `review` action-string, not by reading 03-03's actual shipped `plans.ts` code (which did not yet exist). If 03-03's final implementation used a different action-string than `review` for its approval route, that would be a mismatch surfacing as `403 ROLE_UNRESOLVED` for `eoc_director` against the real `plans.ts` routes — worth a quick `grep -n "requirePermission('plans'" backend/src/modules/plans/plans.ts` cross-check once 03-03 lands, though no evidence of such a mismatch exists as of this plan's completion (03-03's own PLAN.md is unambiguous and internally consistent on this point).

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against both changed files returned only an unrelated variable name (`placeholders` for SQL `$1,$2,...` tokens in `seed.ts`'s pre-existing `findOrInsert` helper), not an actual stub marker.

## Self-Check: PASSED

- `backend/scripts/seed.ts` exists on disk: FOUND
- `backend/src/modules/incident-ops/incidents.test.ts` exists on disk: FOUND
- Commit `2cc4b22` (Task 1) exists in git log: FOUND
- Commit `a7efde1` (Task 2) exists in git log: FOUND
- Plan-level build (`npm run build` → `tsc -p tsconfig.json`): exit 0, no output
- Plan-level type-check (`npx tsc --noEmit`): exit 0, no output
- Full backend test suite (`npx vitest run`, with db+nats+opa running): 10/10 files passed, 52/52 tests passed (49 pre-existing + 3 new)
- No blocking or cosmetic stubs found in either changed file
