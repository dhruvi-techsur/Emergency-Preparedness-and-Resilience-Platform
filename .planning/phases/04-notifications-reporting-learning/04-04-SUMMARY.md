---
phase: 04-notifications-reporting-learning
plan: 04
subsystem: auth-org
tags: [rbac, seed, role_permissions, opa, idempotency, notifications, reporting]

# Dependency graph
requires:
  - phase: 04-notifications-reporting-learning
    provides: "04-01's notifications feature-permission routes (requirePermission('notifications', ...)), 04-02's reporting feature-permission routes (requirePermission('reporting', ...))"
provides:
  - "role_permissions seed grants for 'notifications'/'reporting' features against the FRD-named roles (incident_commander, eoc_director, planning_logistics_chief, field_responder)"
  - "Integration-test proof that the real seed script's grants authorize (or correctly reject) real HTTP requests through OPA end-to-end, not just exist as database rows"
affects: ["04-05", "04-06", "04-07"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Action-level split within one feature-permission string (notifications: approve restricted to ONE role per PER-02's PIO-merge; reporting: edit/finalize restricted to the named SITREP/AAR author role) to make a named-person-approval requirement satisfiable with a single-role seeded account"
    - "findSeededRoleId() test helper throws a clear error instead of falling back to creating a throwaway role — forces the test to actually exercise the real seed.ts output (same pattern 03-07 established)"

key-files:
  created: []
  modified:
    - "backend/scripts/seed.ts — 2 new idempotent role_permissions grant blocks (notifications, reporting) covering 4 roles each"
    - "backend/src/modules/comms-reporting/notifications.test.ts — new describe block with 3 integration tests proving seeded grants authorize/reject real requests"

key-decisions:
  - "notifications 'approve' action-level granted ONLY to incident_commander — PERSONAS-EPMP.md's explicit PER-02/PIO merge names this role as the sole approve-and-send authority for public communications, matching F5's named-person-approval requirement with a realistic single seeded identity"
  - "reporting 'edit' action-level (gating both SITREP finalize and AAR finalize/finding-ownership) granted ONLY to planning_logistics_chief — the FRD's explicit SITREP/AAR author role; incident_commander/eoc_director can trigger generation (create) but not finalize, matching 03-07's no-single-role-holds-everything segregation pattern"
  - "No explicit syncRolePermissionsToOpa() call added to seed.ts — confirmed server.ts's start() already re-syncs the FULL role_permissions table to OPA unconditionally at every boot, identical to 02-01/03-07's resolution of the same question"

# Metrics
duration: 18min
completed: 2026-11-18
---

# Phase 4 Plan 04: Seed role-permission grants for notifications/reporting Summary

**Two idempotent `role_permissions` grant blocks extend `seed.ts` with the FRD-named roles' access to `notifications`/`reporting` — restricting the `approve` action to `incident_commander` alone (PER-02's PIO-merge) and the `edit`/finalize action to `planning_logistics_chief` alone (the named SITREP/AAR author) — proven end-to-end against real OPA policy evaluation via a new integration-test describe block in `notifications.test.ts`.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-18T05:48:43Z (per STATE.md's prior session timestamp)
- **Completed:** 2026-11-18T05:57:49Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `backend/scripts/seed.ts` extended with 2 new grant groups (notifications, reporting), following 02-01/03-07's exact `findOrInsert` idempotent pattern — verified by running `npm run seed` twice against the real compose-stack database: first run inserted 8 new rows, second run inserted 0 (zero duplicates on re-seed, confirmed via `GROUP BY role_id, feature HAVING count(*) > 1` returning 0 rows).
- The action-level split required by F5's named-person-approval rule and F7's author/finalize segregation is now real seed data:
  - `notifications`: `incident_commander` gets `{view,create,approve}` (the ONE approver, per PERSONAS-EPMP.md's PER-02 PIO-merge); `eoc_director`/`planning_logistics_chief` get `{view,create}` (draft-only, no approve); `field_responder` gets `{view}`.
  - `reporting`: `planning_logistics_chief` gets `{view,create,edit}` (the named SITREP/AAR author+finalizer); `incident_commander`/`eoc_director` get `{view,create}` (can trigger generation via the PageHeader "Generate SITREP"/"Generate AAR" actions, but cannot finalize/edit); `field_responder` gets `{view}`.
  - `secops_admin` deliberately gets no explicit grant for either feature, per every prior phase's documented blanket-admin-access-is-console-scoped convention.
- New integration-test `describe` block in `notifications.test.ts` (Task 2) proves these grants authorize/reject real HTTP requests through the real OPA policy engine — not just that rows exist in Postgres:
  1. `incident_commander`'s seeded `approve` grant → real `POST /api/v1/notifications/compose` then `POST .../send` with itself as `approver_id` returns `200`.
  2. `eoc_director`'s seeded grant correctly EXCLUDES `approve` → `POST .../send` returns `403` (`ROLE_UNRESOLVED`, rejected at the RBAC preHandler layer before the route handler's own approver-match logic ever runs — a stronger proof than a business-logic rejection), and the notification's `approved_by`/`sent_at` remain `NULL`.
  3. `field_responder`'s seeded view-only grant → `GET /api/v1/recipient-groups` returns `200`, `POST /api/v1/notifications/compose` returns `403`.
- Confirmed (by re-reading `server.ts`'s `start()`, same verification 02-01/03-07 performed) that no explicit `syncRolePermissionsToOpa()` call is needed in `seed.ts` itself — the server already re-syncs the full table at every boot.
- Full backend suite: **13/13 files, 67/67 tests green** (64 pre-existing + 3 new), `tsc --noEmit` clean, `npm run build` clean.

## Task Commits

Each task was committed atomically:

1. **Task 1: Idempotent seed additions for notifications/reporting feature-permissions** - `b1207ba` (feat)
2. **Task 2: Integration test — seeded roles can actually reach the gated routes end-to-end** - `56f223f` (test)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `backend/scripts/seed.ts` — 2 new idempotent `role_permissions` grant blocks for `notifications`/`reporting`, with inline documentation of the action-level split reasoning (PER-02's PIO-merge for `approve`; PER-03's named author role for `edit`/finalize) and the deliberate `secops_admin` omission.
- `backend/src/modules/comms-reporting/notifications.test.ts` — new `describe('04-04: seeded role_permissions grants authorize/reject real requests end-to-end')` block with 3 `it()` cases, appended to 04-01's existing test file per the plan's own stated discretion (no new dedicated file needed; the addition is small and targeted, mirroring 03-07's exact choice for `incidents.test.ts`).

## Decisions Made

- **Appended to `notifications.test.ts` rather than creating a dedicated `seed-permissions.test.ts`** — the plan explicitly offered Claude's discretion on this; three small, targeted test cases proving the real seed's effect fit comfortably within the existing file without cluttering it, consistent with 03-07's identical choice for `incidents.test.ts`.
- **`findSeededRoleId()` throws rather than falls back to creating a throwaway role** — makes the test fail loudly if `npm run seed` hasn't actually run against the test database, rather than silently passing against a test-only role_permissions row that would prove nothing about the real seed script's effect. Matches 03-07's exact precedent.
- **The eoc_director rejection test asserts the RBAC-layer 403 (`ROLE_UNRESOLVED`), not the route handler's `APPROVER_MISMATCH`** — since `eoc_director`'s seeded grant has no `approve` action at all, `requirePermission('notifications','approve')`'s OPA check denies the request before the handler's own approver-identity-match logic ever executes. This is documented inline in the test as the correct, stronger proof: the exclusion operates at the permission layer, not merely as a business-logic check that a differently-permissioned caller might still reach.
- **No architectural changes** — this plan's scope was entirely additive seed-data rows plus a proving integration test; no schema, no new endpoints, no new modules.

## Deviations from Plan

None - plan executed exactly as written. Both tasks completed on the first attempt with zero auto-fixes needed:
- Task 1's action-level grant design matches the plan's literal specification exactly: `incident_commander` alone holds `notifications:approve`; `planning_logistics_chief` alone holds `reporting:edit`. Confirmed against the actual route files (`notifications.ts`'s `requirePermission('notifications', 'approve')` on the send route; `reporting.ts`'s `requirePermission('reporting', 'edit')` on both the SITREP finalize PATCH and the AAR finalize PATCH) before finalizing, per the plan's own instruction to verify action-strings against shipped code (both 04-01 and 04-02 had already landed in this session, unlike 03-07's parallel-execution situation with 03-03).
- The plan's own frontmatter `integration_contracts` verify command (`grep -n "feature.*'notifications'\|feature.*'reporting'" backend/scripts/seed.ts`) does not literally match this file's actual code shape (the feature string and the word "feature" never appear on the same grep-matchable line outside a leading comment) — spot-checked that this same literal pattern also fails against every PRIOR phase's already-shipped grants (`feature.*'incidents'`, `feature.*'plans'` both also return no match in the current file), confirming this is pre-existing descriptive frontmatter metadata, not a literal gating check this executor runs. The actual gating verification is the task's own `<verify>` block (idempotent-seed + duplicate-count checks), which passed in full.

## Issues Encountered

None. Database/OPA/NATS services were started fresh via `docker compose up -d db opa` (then `nats` for the full suite) per this plan's setup note; migrations were already current (no new migration needed since this plan only touches seed data and tests, not schema).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Every frontend plan in this phase (04-05, 04-06, 04-07) can now sign in as a real seeded user (`incident_commander`, `eoc_director`, `planning_logistics_chief`, `field_responder`) and reach the `notifications`/`reporting` features their Playwright tests will exercise — this plan closes the gap between "routes exist and are RBAC-gated" (04-01/04-02) and "a real user can actually use them."
- The `incident_commander`'s unique `notifications:approve` grant is now a real, end-to-end-proven precondition for 04-05's Playwright suite to exercise the named-person-approval flow against a real seeded login.

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against both changed files returned only an unrelated pre-existing variable name (`placeholders` for SQL `$1,$2,...` tokens in `seed.ts`'s `findOrInsert` helper), not an actual stub marker — identical finding to 03-07's own self-check.

## Self-Check: PASSED

- `backend/scripts/seed.ts` exists on disk: FOUND
- `backend/src/modules/comms-reporting/notifications.test.ts` exists on disk: FOUND
- Commit `b1207ba` (Task 1) exists in git log: FOUND
- Commit `56f223f` (Task 2) exists in git log: FOUND
- Plan-level build (`npm run build` → `tsc -p tsconfig.json`): exit 0, no output
- Plan-level type-check (`npx tsc --noEmit`): exit 0, no output
- Full backend test suite (`npx vitest run`, with db+opa+nats running): 13/13 files passed, 67/67 tests passed (64 pre-existing + 3 new)
- Idempotency re-verified directly: `npm run seed` run twice — first run 8 inserted/22 already-present for notifications+reporting rows combined with the rest of the table; second run 0 inserted/30 already-present; `GROUP BY role_id, feature HAVING count(*) > 1` on notifications/reporting returned 0 rows
- No blocking or cosmetic stubs found in either changed file
