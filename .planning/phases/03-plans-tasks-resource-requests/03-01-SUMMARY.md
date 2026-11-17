---
phase: 03-plans-tasks-resource-requests
plan: 01
subsystem: incident-ops
tags: [fastify, node-pg-migrate, postgres, vitest, rbac, timeline]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "incidents table, TimelineService/withTimelineTransaction transactional Timeline-write pattern, requirePermission RBAC gate, closure.ts's forward-compatible tasks-cascade UPDATE"
provides:
  - "tasks, task_status_history, resource_requests, resource_request_status_history schema (extends Phase 2's incident-ops migration file set)"
  - "GET/POST /api/v1/tasks and PATCH /api/v1/tasks/{id}/status — owner-required and due-date-past creation gates, fixed state-machine enforcement, transactional task_status_history + conditional Timeline writes"
  - "TaskService.createFromTemplate — the single in-process cross-module entry point for materializing a task from a plan template"
affects: [03-02-overdue-sweep, 03-03-plans-templates, 03-05-task-screens, 03-06-task-screens, 03-07-seed-and-nav]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Task state machine enforced as an explicit switch-based allow-list (isValidTransition), never a dynamic/configurable table, so 'Overdue' can be hard-rejected as a value before any other check runs"
    - "TaskService exported as a plain object with one async method, designed to run INSIDE a caller-supplied transaction (no own BEGIN/COMMIT) — distinct from the HTTP handler's own withTimelineTransaction-wrapped path"

key-files:
  created:
    - backend/migrations/1700000000004_plans-tasks-resources-schema.js
    - backend/src/modules/incident-ops/tasks.ts
    - backend/src/modules/incident-ops/tasks.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts

key-decisions:
  - "isValidTransition() implemented as a plain switch statement keyed on current status (not a transition-table literal) since 'Overdue' needing to be rejected universally as a next-value, independent of current status, is cleaner expressed as an early guard than as N copies of the same forbidden edge"
  - "fetchTaskRow() accepts either the bare `query` function or a transaction client's `.query` method via a type-narrowing branch, avoiding a second near-duplicate row-fetch implementation for the pre-PATCH existence/ownership lookup vs. the post-mutation re-fetch"

patterns-established:
  - "Task creation route and TaskService.createFromTemplate() share the exact same three-write sequence (INSERT tasks, INSERT task_status_history with from_status=NULL, conditional TimelineService.append) but the former owns the owner/due_at validation gates while the latter assumes a plan-template caller pre-resolved both — documented inline so 03-03 doesn't duplicate or skip either gate incorrectly"

# Metrics
duration: 35min
completed: 2026-11-17
---

# Phase 3 Plan 01: Tasks & Resource-Requests Schema and Task CRUD/Status API Summary

**Tasks table family (tasks/task_status_history/resource_requests/resource_request_status_history) plus GET/POST /api/v1/tasks and PATCH /api/v1/tasks/{id}/status, with a hard-coded state-machine allow-list and transactional task_status_history + Timeline writes on every change**

## Performance

- **Duration:** 35 min
- **Tasks:** 3
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments
- Extended Phase 2's incident-ops migration file set with a separate, additive migration creating `tasks`, `task_status_history`, `resource_requests`, `resource_request_status_history` — verified against the real Postgres compose instance, with `plan_section_id` left as a plain UUID column (FK deferred to 03-03) exactly as the plan specifies
- `GET/POST /api/v1/tasks` and `PATCH /api/v1/tasks/{id}/status` built with the owner-required and due-date-past (confirmed_backfill override) creation gates, and a server-side-enforced fixed state machine that always rejects a direct PATCH to `'Overdue'`
- Every task write (creation and every valid status transition) runs inside `withTimelineTransaction`, inserting a `task_status_history` row every time and — only when `incident_id` is non-null — exactly one `incident_timeline` entry via Phase 2's `TimelineService`
- `TaskService.createFromTemplate` exported for 03-03's cross-module plan-to-task materialization, designed to run inside a caller-supplied transaction rather than opening its own
- Phase 2's `closure.ts` tasks-cascade `UPDATE ... RETURNING id` (previously forward-compatible against a non-existent table) is now live against a real `tasks` table from this plan forward

## Task Commits

Each task was committed atomically:

1. **Task 1: Tasks & resource-requests schema migration** - `9005496` (feat)
2. **Task 2: Task CRUD + state-machine-enforced status transition routes** - `1a2235d` (feat)
3. **Task 3: Integration test — creation gates, state machine, transactional Timeline writes** - `eda7066` (test)

_Note: all three tasks ran clean on the first implementation pass — no debugging/iteration cycles needed beyond one template-literal backtick fix caught immediately by node-pg-migrate's own parse error (see Deviations)._

## Files Created/Modified
- `backend/migrations/1700000000004_plans-tasks-resources-schema.js` - DDL for tasks/task_status_history/resource_requests/resource_request_status_history, pinned indexes, down() in reverse dependency order
- `backend/src/modules/incident-ops/tasks.ts` - GET/POST /api/v1/tasks, PATCH /api/v1/tasks/{id}/status, exported TaskService.createFromTemplate
- `backend/src/modules/incident-ops/routes.ts` - registers tasksRoutes alongside Phase 2's incidents/command-roles/activation/closure/operating-picture handlers
- `backend/src/modules/incident-ops/tasks.test.ts` - 5 integration tests against the real Postgres+OPA compose stack

## Decisions Made
- `isValidTransition()` implemented as a switch on current status with an early `if (next === 'Overdue') return false` guard, rather than a literal transition-table map, so the "never user-settable to Overdue" rule reads as one line instead of being duplicated across every current-status branch
- `fetchTaskRow()` is parameterized over either the bare `query` helper or a transaction client, so the pre-PATCH existence/current-state lookup and the post-mutation re-fetch-for-response share one implementation instead of two near-duplicates

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration file template-literal backtick broke node-pg-migrate's parser**
- **Found during:** Task 1 (first `npm run migrate` attempt)
- **Issue:** The inline SQL comment documenting the deferred `plan_section_id` FK originally quoted the literal `ALTER TABLE ...` statement inside backticks, inside the migration file's own outer JS template-literal string — the inner backtick prematurely closed the outer `UP_SQL` template literal, producing `ParseError: Missing semicolon.` when node-pg-migrate loaded the file.
- **Fix:** Removed the nested backticks from the comment, keeping the same documentation wording without the markdown-code-span styling.
- **Files modified:** `backend/migrations/1700000000004_plans-tasks-resources-schema.js`
- **Verification:** `npm run migrate` ran clean on retry; all 4 tables created with exact columns/constraints/indexes confirmed via `\dt` and `\d tasks`.
- **Committed in:** `9005496` (Task 1 commit — fixed before commit, not a separate commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Purely a migration-file authoring fix caught by the plan's own `<verify>` step before any commit; no schema, API, or test logic was affected.

## Issues Encountered
None — all three tasks' `<verify>` commands passed as specified, and the full backend test suite (8 files, 41 tests) ran green with zero regressions after Task 3, confirming Phase 2's `incidents.test.ts`, `activation.test.ts`, and `operating-picture.test.ts` suites are unaffected by the new `tasks` table now being live under `closure.ts`'s cascade query.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The `tasks` table Phase 2's `closure.ts` cascade already expected now exists and is functional — the cascade's SAVEPOINT-guarded "relation does not exist" fallback is now dead code on this path (03-02 owns narrowing that error-message match to `err.code === '42P01'` per threat T-02-06, not touched by this plan).
- `resource_requests`/`resource_request_status_history` columns exist and are ready for 03-04's resource-request plan; this plan's own API surface does not touch them.
- `TaskService.createFromTemplate` is exported and ready for 03-03's plan-to-task materialization — 03-03 must resolve `owner_role_or_id`/`default_due_offset_minutes` into a concrete `owner_id`/`due_at` before calling it, since this function does not validate those fields itself.
- `plan_section_id`'s FK constraint (threat T-03-03, accepted) must be added by 03-03's migration as its first step, closing the bounded referential-integrity gap documented in this plan's migration.
- No blockers for 03-02 (Overdue time-based sweep), which can now build directly against this plan's live `tasks` table and its `idx_tasks_due` partial index.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all created/modified files returned zero hits.

## Self-Check: PASSED

- All 4 created/modified key-files confirmed present on disk via `[ -f ]`.
- All 3 task commits (`9005496`, `1a2235d`, `eda7066`) confirmed present via `git log --oneline --all`.
- Plan-level build (`npm run build` across backend + frontend/design-system + frontend/app, per `config.json`'s `workflow.build_command`) ran and exited 0.
- Full backend test suite (8 files, 41 tests, including this plan's own 5-assertion `tasks.test.ts`) ran green with zero regressions.
