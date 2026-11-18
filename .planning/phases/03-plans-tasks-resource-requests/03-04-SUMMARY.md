---
phase: 03-plans-tasks-resource-requests
plan: 04
subsystem: api
tags: [fastify, postgres, nats, jetstream, resource-requests, event-bus, timeline]

# Dependency graph
requires:
  - phase: 03-01
    provides: "resource_requests/resource_request_status_history schema migration; RECORD_NOT_FOUND export from tasks.ts"
  - phase: 02-01
    provides: "TimelineService / withTimelineTransaction transactional Timeline-write helper"
  - phase: 01-09
    provides: "publishEvent (NATS JetStream), the webhook-subscription + delivery-worker event-bus proof pattern (eventbus.test.ts)"
  - phase: 01-03
    provides: "requirePermission RBAC preHandler factory"
provides:
  - "GET/POST /api/v1/resource-requests, POST .../approve, .../decline, .../fulfill — full resource-request lifecycle API"
  - "resource_request.status_changed event published on every successful transition"
affects: [03-06, "Phase 4 reporting dashboard", "03-07 (resource_requests feature-permission seeding)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Two-phase single-endpoint assign-then-fulfill: POST .../fulfill first call (assigned_to not yet set) assigns only with no status-history row; second call (assigned_to already set) performs the actual Approved -> Fulfilled transition"
    - "Immediate-submit-on-create: POST /api/v1/resource-requests writes Draft then immediately Awaiting approval in the same transaction (2 status-history rows) unless save_as_draft:true is passed"
    - "Fire-and-forget event publish: publishResourceRequestStatusChanged() wraps publishEvent().catch(log.warn) so a NATS outage never blocks the HTTP response, reusing 01-09's non-blocking pattern"

key-files:
  created:
    - backend/src/modules/incident-ops/resource-requests.ts
    - backend/src/modules/incident-ops/resource-requests.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts

key-decisions:
  - "Declining a resource request is gated on the 'approve' action (not a lesser 'edit'), since declining is itself an approval-adjacent decision requiring the same permission level as approving"
  - "The UX mockup's 'Assigned' state is reconciled as a sub-state of 'Approved' (assigned_to IS NOT NULL), not a distinct status enum value, since TechArch's schema only has 5 status values with no 'Assigned' entry — the same single POST .../fulfill endpoint handles both the first assign-only call and the second true-fulfill call"
  - "save_as_draft:true is a documented extension beyond the FRD's literal request shape, giving the Draft status a real resting-state reachability path since the mockup's Create/Edit form has no distinct 'save as draft' action"

patterns-established:
  - "Resource-request lifecycle transitions follow the exact same withTimelineTransaction + status-history + Timeline-append + fire-and-forget publishEvent shape as 03-01's task status-transition route, giving the codebase one consistent template for every F1/F4 state-changing endpoint"

# Metrics
duration: 20min
completed: 2026-11-17
---

# Phase 3 Plan 04: Resource-Request Lifecycle API Summary

**Resource-request create/submit/approve/decline/assign/fulfill lifecycle API built on 03-01's schema, publishing `resource_request.status_changed` to NATS JetStream on every transition and proving real webhook-delivery-worker-based event-bus delivery end-to-end in the integration test.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-11-17T13:30:10Z (approx, immediately following 03-01 completion)
- **Completed:** 2026-11-17T13:38:35Z
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- Full resource-request HTTP API: `GET/POST /api/v1/resource-requests`, `POST .../approve`, `POST .../decline`, `POST .../fulfill`, all gated by `requirePermission('resource_requests', <action>)`
- Submitting the create form immediately transitions `Draft → Awaiting approval` in one transaction (2 status-history rows), matching the UX mockup's single-step submit, with an opt-in `save_as_draft:true` escape hatch for true draft persistence
- Decline is rejected with `422 DECLINE_REASON_REQUIRED` before any database write when `reason` is empty/missing, backstopped by 03-01's `chk_decline_requires_reason` DB CHECK constraint
- Two-phase assign-then-fulfill behavior on the single `POST .../fulfill` endpoint: the first call (no prior `assigned_to`) assigns only (no status-history row, since assignment is metadata not a status transition); the second call (assigned_to already set) performs the real `Approved → Fulfilled` transition with its own status-history + Timeline + event publish
- Every successful transition (create/submit, approve, decline, fulfill) writes exactly one `resource_request_status_history` row and one `incident_timeline` entry inside the same `withTimelineTransaction`, then publishes `resource_request.status_changed` to NATS JetStream without ever blocking the HTTP response on publish failure
- Integration test proves the event-bus publish is real, not just a code-path assertion: a throwaway webhook subscriber registered via `POST /api/v1/admin/webhook-subscriptions` actually receives the delivered event (through the real JetStream durable-consumer delivery worker from 01-09), with payload `{id, status, incident_id}` verified

## Task Commits

Each task was committed atomically:

1. **Task 1: Resource-request CRUD + approve/decline/fulfill lifecycle with event-bus publish** - `174faf3` (feat)
2. **Task 2: Mount routes + integration test — full lifecycle and event-bus proof** - `6534db2` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/src/modules/incident-ops/resource-requests.ts` - Full resource-request lifecycle route handlers (list/create/approve/decline/fulfill), all transactional via `withTimelineTransaction`, publishing `resource_request.status_changed` on every transition
- `backend/src/modules/incident-ops/resource-requests.test.ts` - 4 integration tests against the real Postgres+NATS+OPA compose stack: immediate-submit + decline-reason gate, two-phase assign-then-fulfill + event-bus delivery proof, quantity validation, invalid-status-transition guards
- `backend/src/modules/incident-ops/routes.ts` - Registered `resourceRequestRoutes` alongside 03-01's `taskRoutes`

## Decisions Made
- Declining requires the `'approve'` RBAC action (not `'edit'`) since it's an approval-adjacent decision requiring the same permission level as approving — documented inline in the route handler
- The schema's lack of a distinct "Assigned" status enum value is reconciled by treating "Assigned" as a sub-state of `Approved` (distinguished by `assigned_to IS NOT NULL`), with the single `POST .../fulfill` endpoint handling both the assign-only first call and the true-fulfill second call — this is the exact reconciliation the plan's own task description called for between the UX mockup's descriptive language and TechArch's literal 5-value enum
- `save_as_draft:true` added as a documented extension beyond the FRD's literal request body, giving `Draft` a real reachable resting state since the UX mockup's Create/Edit Resource Request form shows no separate "save as draft" action

## Deviations from Plan

None — plan executed exactly as written. All four `<verify>` greps for Task 1 (`DECLINE_REASON_REQUIRED`, `withTimelineTransaction`, `publishEvent`, `resource_request.status_changed`) passed on first implementation, and all of Task 2's integration-test assertions passed on first run against the real compose stack.

## Issues Encountered
None. The dev compose stack (db/nats/opa) was already running at plan start (per the parallel-execution note), so the plan's own `docker compose up -d db nats opa && docker compose down` bracket in its `<verify>` block was adapted to NOT tear the stack down mid-run, since 03-02 was executing concurrently against the same stack — migrations were already current (`npm run migrate` reported "No migrations to run!") and the full backend suite (10 files, 49 tests) ran green both before and after this plan's changes.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Success criterion 4's entire backend lifecycle (Draft→Awaiting approval→Approved→Fulfilled/Declined-with-reason) and its event-bus propagation are complete and tested against a real Postgres+NATS+OPA stack
- 03-06's frontend resource-request screens and Phase 4's reporting dashboard now have a real, firing `resource_request.status_changed` event stream to subscribe to
- The `resource_requests` feature-permission referenced throughout this plan's route gating is seeded in 03-07 (not yet run) — this plan's own integration test seeds the grant locally for its test role, same pattern 03-01's `tasks.test.ts` used, so no cross-plan ordering dependency blocks this plan's own verification
- No blockers for 03-03 (plans/plan_sections/plan_task_templates), which 03-02 is already unblocking in parallel

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Known Stubs

None found. `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across both changed/created files returned zero matches.

## Self-Check: PASSED

- `backend/src/modules/incident-ops/resource-requests.ts` — FOUND
- `backend/src/modules/incident-ops/resource-requests.test.ts` — FOUND
- `.planning/phases/03-plans-tasks-resource-requests/03-04-SUMMARY.md` — FOUND
- Commit `174faf3` (feat: resource-request lifecycle API) — FOUND
- Commit `6534db2` (test: mount routes + integration test) — FOUND
- Build check: `cd backend && npm run build` (tsc -p tsconfig.json) → exit 0
- Test check: `npm test -w backend` → 10/10 files, 49/49 tests passed, zero regressions
- Task-level verify greps (DECLINE_REASON_REQUIRED, withTimelineTransaction, publishEvent, resource_request.status_changed) — all present
- Task 2's own `<verify>` integration test run (4/4 assertions) — all passed against the real Postgres+NATS+OPA stack, including the event-bus delivery proof
