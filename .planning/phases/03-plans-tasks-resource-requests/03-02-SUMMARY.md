---
phase: 03-plans-tasks-resource-requests
plan: 02
subsystem: incident-ops
tags: [postgres, node-pg-migrate, fastify, vitest, scheduled-job, audit-trail]

# Dependency graph
requires:
  - phase: 03-01
    provides: "tasks/task_status_history schema, TaskService, task state machine rejecting direct-to-Overdue PATCH"
  - phase: 02-02
    provides: "closure.ts's incident-closure endpoint and its (originally bulk, now per-task) tasks-cascade UPDATE"
  - phase: 01-01
    provides: "background_jobs table with job_type CHECK constraint (extended by this plan)"
provides:
  - "runOverdueSweep() — idempotent, transactional, time-based Overdue flip for all open tasks past due_at, independent of incident status"
  - "startOverdueSweepScheduler() — 60s setInterval scheduler wired into server.ts boot"
  - "background_jobs.job_type CHECK constraint extended to include 'task_overdue_sweep'"
  - "closure.ts's tasks-cascade now writes one task_status_history row + one Timeline entry PER cascaded task, not a single generic entry"
affects: [03-05, 03-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "One transaction per flipped task (not one transaction per sweep run) — a failure on one overdue task must not roll back progress already made on other independent tasks/incidents in the same sweep tick"
    - "System-driven status transitions carry changed_by=NULL in task_status_history, distinguishing them unambiguously from user-driven transitions in the audit trail"

key-files:
  created:
    - backend/migrations/1700000000006_background-jobs-extend-job-type.js
    - backend/src/modules/incident-ops/overdue-sweep.ts
    - backend/src/modules/incident-ops/overdue-sweep.test.ts
  modified:
    - backend/src/server.ts
    - backend/src/modules/incident-ops/closure.ts

key-decisions:
  - "Confirmed background_jobs_job_type_check is the real constraint name in the migrated database (via pg_constraint query) before finalizing the ALTER, per the plan's own verify-before-commit instruction — the default node-pg-migrate naming assumption held"
  - "closure.ts's per-task audit loop runs INSIDE the closure's existing single transaction (not withTimelineTransaction per-task like overdue-sweep.ts) since all cascaded tasks share the same atomic close-the-incident operation and must roll back together on any failure"
  - "overdue-sweep.ts uses one transaction PER task (not one transaction for the whole sweep run) since it spans many independent tasks/incidents and needs per-task fault isolation that closure.ts's single-incident scope doesn't need"

patterns-established:
  - "System-attributed audit rows (changed_by=NULL, Timeline source='system') for any status transition the system itself drives, as opposed to a user-initiated one"

# Metrics
duration: 15min
completed: 2026-11-17
---

# Phase 3 Plan 02: Time-Based Overdue Sweep + Closure-Cascade Audit Fix Summary

**Scheduled `runOverdueSweep()` flipping past-due tasks to Overdue independent of incident status, plus a fix making Phase 2's incident-closure cascade write the same per-task audit trail instead of one generic entry.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-11-17T13:32:25Z
- **Completed:** 2026-11-17T13:36:07Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- `background_jobs.job_type` CHECK constraint extended to permit `'task_overdue_sweep'` — Phase 1's original 6-value list silently rejected every sweep monitoring insert until this fix
- `runOverdueSweep()`: a transactional, per-task, idempotent function that finds every task with `due_at < now()` and `status NOT IN ('Done','Overdue')` and flips it to `Overdue`, writing a `changed_by=NULL` `task_status_history` row and (when incident-linked) a `danger`-tone, `source='system'` Timeline entry
- `startOverdueSweepScheduler()` runs the sweep every 60s via `setInterval`, wired into `server.ts`'s boot sequence with the same try/catch graceful-degradation posture as 01-09's NATS connection
- Fixed Phase 2's `closure.ts`: its tasks-cascade bulk `UPDATE` now loops per cascaded task, writing one `task_status_history` row and one Timeline entry for EACH task — closing the gap where the phase's own "exactly one history row per transition" invariant held for user-driven and sweep-driven transitions but not the closure-cascade path
- Proved via test that the two Overdue-triggering mechanisms (time-based sweep, incident-closure cascade) are genuinely independent and non-conflicting: a task flips to Overdue purely from its own `due_at` passing while its incident stays `Open`

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend background_jobs.job_type + overdue sweep function + scheduler** - `a9519b8` (feat)
2. **Task 2: Fix Phase 2's closure cascade to write per-task audit records** - `a504bc1` (fix)
3. **Task 3: Integration tests — time-based flip, idempotency, background_jobs visibility, and per-task closure-cascade audit** - `1448eaa` (test)

**Plan metadata:** (this commit)

## Files Created/Modified

- `backend/migrations/1700000000006_background-jobs-extend-job-type.js` - ALTER extending `background_jobs_job_type_check` to allow `'task_overdue_sweep'`
- `backend/src/modules/incident-ops/overdue-sweep.ts` - `runOverdueSweep()` + `startOverdueSweepScheduler()`
- `backend/src/server.ts` - wires `startOverdueSweepScheduler()` into the boot sequence
- `backend/src/modules/incident-ops/closure.ts` - cascade loop now writes per-task `task_status_history` + Timeline entries
- `backend/src/modules/incident-ops/overdue-sweep.test.ts` - 4 integration tests covering the sweep, idempotency, `background_jobs` visibility, and the closure-cascade audit fix

## Decisions Made

- Verified the real `background_jobs_job_type_check` constraint name against the live migrated database (`pg_constraint` query) before finalizing the migration's `DROP CONSTRAINT` — confirmed the plan's default-naming assumption was correct rather than guessing silently
- `closure.ts`'s per-task audit writes run inside the closure's existing single transaction (atomic with the incident's own status flip), while `overdue-sweep.ts` uses one transaction PER task (fault-isolated across independent tasks/incidents) — different transaction granularities for genuinely different correctness requirements, not an inconsistency

## Deviations from Plan

None - plan executed exactly as written. The plan's own pre-verification instruction (confirm the real constraint name before finalizing the migration) was followed and confirmed the assumed name was correct, so no adjustment was needed there either.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Success criterion 3 (F4's user-driven + system-driven Overdue transitions) is now fully backend-complete: 03-01's user-driven lifecycle and this plan's time-based sweep both exist, tested, and proven non-conflicting with Phase 2's closure cascade
- The phase's "exactly one task_status_history row per transition" invariant now genuinely holds across every Overdue-producing path (user PATCH rejection, time-based sweep, closure cascade)
- `background_jobs` monitoring visibility into the sweep's own runs is real, not silently broken — any future admin/ops dashboard reading `background_jobs` will see accurate sweep run history
- Ready for 03-03 (plan_sections / plan_task_templates — the deferred FK this plan's 03-01 predecessor documented) and 03-05/03-06 (frontend Task List/Detail screens, which render the `Overdue` badge this sweep produces with no frontend polling logic of their own)

## Self-Check: PASSED

- `backend/migrations/1700000000006_background-jobs-extend-job-type.js` — FOUND
- `backend/src/modules/incident-ops/overdue-sweep.ts` — FOUND
- `backend/src/modules/incident-ops/overdue-sweep.test.ts` — FOUND
- Commit `a9519b8` — FOUND in git log
- Commit `a504bc1` — FOUND in git log
- Commit `1448eaa` — FOUND in git log
- Build check: `tsc -p tsconfig.json` (via `npm run build -w backend`) → exit 0
- Full backend test suite: 9 files, 45 tests, all passed, zero regressions
- `## Known Stubs`: None found — grep for TODO/FIXME/placeholder/not-implemented across all changed files returned no matches

## Known Stubs

None found.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*
