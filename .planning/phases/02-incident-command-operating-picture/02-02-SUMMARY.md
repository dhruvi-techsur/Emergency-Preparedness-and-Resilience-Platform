---
phase: 02-incident-command-operating-picture
plan: 02
subsystem: incident-ops
tags: [fastify, postgres, transactional-writes, row-locking, savepoint]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "incidents/incident_command_roles/incident_timeline schema, TimelineService.append(), withTimelineTransaction() (02-01)"
provides:
  - "POST /api/v1/incidents/{id}/command-roles — assign/reassign with row-locked reassignment history"
  - "POST /api/v1/incidents/{id}/activation — server-side confirmed:true gate + Incident-Commander-count gate"
  - "POST /api/v1/incidents/{id}/closure — closes incident, cascades open tasks to Overdue (forward-compatible no-op pre-Phase-3), writes closure Timeline entry"
affects: ["02-05", "02-06", "02-07", "Phase 3's task-schema plan (owns the SAVEPOINT-guarded tasks-cascade query's error-code narrowing)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SELECT ... FOR UPDATE row-locking on the single active-assignment row before deciding assign vs. reassign vs. no-op, preventing a two-concurrent-request race from creating duplicate active rows for the same command role"
    - "SAVEPOINT / ROLLBACK TO SAVEPOINT around a single forward-compatible statement inside a larger transaction, so an expected-to-fail-today query (tasks table doesn't exist until Phase 3) doesn't abort the whole transaction per Postgres's all-or-nothing error semantics"
    - "Shared confirmed:true structural gate (ACTIVATION_CONFIRMATION_REQUIRED) reused across activation and closure as EPMP's general destructive-action confirmation convention, not duplicated per-endpoint"

key-files:
  created:
    - backend/src/modules/incident-ops/command-roles.ts
    - backend/src/modules/incident-ops/activation.ts
    - backend/src/modules/incident-ops/closure.ts
    - backend/src/modules/incident-ops/activation.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts
    - backend/src/modules/incident-ops/incidents.ts

key-decisions:
  - "Reused incidents.ts's INCIDENT_NOT_FOUND / fetchIncidentDetailShape / ActivationLevel (and sibling types) by exporting them, rather than duplicating the detail-shaping query in activation.ts and closure.ts"
  - "closure.ts's confirmed:true gate reuses activation.ts's exact error code (ACTIVATION_CONFIRMATION_REQUIRED) — documented inline as EPMP's general destructive-action confirmation convention rather than a closure-specific code, since the FRD doesn't name a distinct one"
  - "Tasks-cascade UPDATE wrapped in a Postgres SAVEPOINT, not just a JS try/catch — the plan's own text said 'wrap in try/catch', but a bare try/catch around one statement inside a larger transaction does NOT prevent Postgres's all-or-nothing abort; found and fixed via this task's own integration test rather than left to Phase 3 to discover"

patterns-established:
  - "Three single-purpose state-machine endpoints (assign, activate, close) each owning one withTimelineTransaction call, rather than one generic incident-mutation endpoint — keeps the commander gate and confirmation gate specific to the action that needs them"

# Metrics
duration: 9min
completed: 2026-11-16
---

# Phase 2 Plan 02: Command Roles, Activation Gate, and Closure Summary

**Three transactional incident state-machine endpoints — row-locked command-role reassignment, a server-side confirmed:true + Incident-Commander-count double gate on activation, and cascading-closure with a SAVEPOINT-protected forward-compatible task cascade — each writing exactly one Timeline entry per state change.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-11-16T12:58:30Z
- **Completed:** 2026-11-16T13:07:12Z
- **Tasks:** 3
- **Files modified:** 6 (4 created, 2 modified)

## Accomplishments
- `POST /api/v1/incidents/{id}/command-roles` assigns or reassigns a named ICS command role, locking the existing active row with `SELECT ... FOR UPDATE` before deciding assign/reassign/no-op — closes the two-concurrent-request race from the plan's threat model (T-02-05)
- `POST /api/v1/incidents/{id}/activation` makes the FRD's "Modal confirmation must be accepted before the change takes effect" and "at least one Incident Commander assigned" rules real API-enforced gates — a direct API call bypassing the frontend Modal entirely cannot skip either (T-02-04)
- `POST /api/v1/incidents/{id}/closure` sets `status='Closed'`, cascades every non-`Done` task to `Overdue` (forward-compatible no-op until Phase 3's `tasks` table exists), and writes one "Incident closed" Timeline entry — all in one transaction
- All three endpoints call the shared `TimelineService.append`/`withTimelineTransaction` from 02-01, so "exactly one Timeline entry per state change" is a transactional guarantee, not a convention
- Integration test (`activation.test.ts`) proves the full sequence against the live compose stack: commander gate blocks + leaves level unchanged, successful activation writes exactly 3 Timeline entries (create + assign + activate), missing `confirmed:true` is rejected before any write, reassignment marks the prior row's `unassigned_at` and writes one Timeline entry naming both people, and closure both closes the incident and rejects a second closure with 409

## Task Commits

Each task was committed atomically:

1. **Task 1: Command-role assignment (assign/reassign)** - `bfc676e` (feat)
2. **Task 2: Activation-level change (server-side commander gate + confirmation gate)** - `82e8c15` (feat)
3. **Task 3: Incident closure + mount routes + integration test** - `3a7cc68` (feat)

**Plan metadata:** (pending — see final commit below)

## Files Created/Modified
- `backend/src/modules/incident-ops/command-roles.ts` - POST /api/v1/incidents/{id}/command-roles — row-locked assign/reassign/no-op with Timeline write
- `backend/src/modules/incident-ops/activation.ts` - POST /api/v1/incidents/{id}/activation — confirmed:true gate + Incident-Commander-count gate + Timeline write (tone: warning on escalation, brand on de-escalation)
- `backend/src/modules/incident-ops/closure.ts` - POST /api/v1/incidents/{id}/closure — status=Closed, SAVEPOINT-guarded forward-compatible tasks cascade, Timeline write
- `backend/src/modules/incident-ops/activation.test.ts` - integration test (supertest + real Postgres/OPA) covering the full state-machine sequence plus reassignment no-op and double-closure 409
- `backend/src/modules/incident-ops/routes.ts` - mounted command-roles.ts, activation.ts, closure.ts alongside 02-01's incidents.ts
- `backend/src/modules/incident-ops/incidents.ts` - exported shared types (ActivationLevel, CommandRoleTitle, etc.) and helpers (fetchIncidentDetailShape, INCIDENT_NOT_FOUND) for reuse by activation.ts/closure.ts

## Decisions Made
- Exported incidents.ts's detail-shaping helper and shared types rather than duplicating the jurisdiction-join + command-roles query in two more files
- closure.ts's confirmation gate reuses activation.ts's `ACTIVATION_CONFIRMATION_REQUIRED` error code, documented inline as EPMP's general destructive-action confirmation convention (not activation-specific) since the FRD names no distinct closure code
- Tasks-cascade UPDATE wrapped in a real Postgres `SAVEPOINT`/`ROLLBACK TO SAVEPOINT`, not just a JS-level try/catch — see Deviations below

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Tasks-cascade try/catch needed a SAVEPOINT, not just a JS catch block**
- **Found during:** Task 3 (running the integration test's closure assertions)
- **Issue:** The plan's text specified wrapping the defensive `tasks` UPDATE in a JS `try/catch` to treat "relation does not exist" as a no-op. A bare `try/catch` around one statement inside a Postgres transaction does NOT contain the error at the statement level — Postgres aborts the *entire* transaction on any error, after which every subsequent query on that same client fails with `current transaction is aborted, commands ignored until end of transaction block` (code `25P02`). The integration test caught this immediately: both closure test cases got `500` instead of `200` because the Timeline-append call (issued right after the caught "tasks doesn't exist yet" error) hit the poisoned transaction.
- **Fix:** Wrapped the `tasks` UPDATE in `SAVEPOINT tasks_cascade` / `RELEASE SAVEPOINT` (success path) or `ROLLBACK TO SAVEPOINT tasks_cascade` (expected-failure path) before the JS try/catch's error-message check, so the transaction is restored to a clean state before the subsequent Timeline write runs.
- **Files modified:** backend/src/modules/incident-ops/closure.ts
- **Verification:** `activation.test.ts`'s closure assertions (both the full-sequence test and the double-closure 409 test) pass against the live Postgres stack after the fix
- **Committed in:** 3a7cc68 (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix is purely a transaction-correctness detail required to make the plan's own specified "wrap in try/catch" behavior actually work under Postgres's error semantics — the forward-compatible no-op behavior and the 42P01-narrowing-owed-to-Phase-3 caveat from the plan's threat model are preserved exactly as written. No scope creep.

## Issues Encountered
None beyond the deviation above — all three tasks' own `<verify>` commands passed as written (after the Rule 1 fix), including the live 3-test integration suite against the real compose stack and the full existing 6-file/29-test backend suite (zero regressions).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Command-role assignment, activation-level change, and closure are all live, transactional, and tested — unblocking 02-05/02-06 (frontend Incident Workspace, which calls these three endpoints directly) and 02-07.
- Carried-forward threat-model note (T-02-06, owned by Phase 3's task-schema plan): the tasks-cascade "relation does not exist" check matches on the error MESSAGE string, not Postgres error code `42P01` — Phase 3 must narrow this to the specific code once the `tasks` table exists, per the plan's own threat register.
- Carried-forward gap from 02-01 (T-02-03, still open): `GET /api/v1/incidents` does not yet apply jurisdiction-scope filtering — unaffected by this plan, flagged again for whichever plan next touches that query.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

None found — scanned all created/modified files (command-roles.ts, activation.ts, closure.ts, activation.test.ts, routes.ts, incidents.ts) for TODO/FIXME/placeholder/not-implemented patterns; zero hits.

## Self-Check: PASSED

- All 4 created files confirmed present on disk
- All 3 task commits (bfc676e, 82e8c15, 3a7cc68) confirmed in `git log`
- Build check: `cd backend && npm run build` (tsc -p tsconfig.json) → exit 0
- Full backend test suite (6 files, 29 tests, including this plan's 3) → all passed, zero regressions
- No blocking stubs found
