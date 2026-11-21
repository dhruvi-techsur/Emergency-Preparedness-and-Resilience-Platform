---
phase: 09-alerting-identity-integrations
plan: 01
subsystem: integration-gateway
tags: [notification-provider, everbridge, ipaws, oasis-cap, f14, retry-backoff, integration-health]

# Dependency graph
requires:
  - phase: 04-comms-reporting (Phase 4)
    provides: F5's fully-built notification/approval/delivery-tracking domain (notifications, notification_recipients, notification_delivery_status tables; POST /api/v1/notifications/:id/send route with approval/approver-match/AI-governance gates)
  - phase: 01-foundation (Phase 1)
    provides: background_jobs table with 'notification_fanout' already present, UNUSED, in its original job_type CHECK constraint list
provides:
  - "notification_provider_config, notification_dispatch_log, cap_alert_records tables"
  - "sendViaProvider() — Everbridge/AtHoc-class send stub re-verifying approved_by/approved_at server-side as its own FIRST check, independent of any caller-side gate"
  - "buildCapEnvelope() — pure OASIS CAP 1.2 XML builder with all required fields, hand-escaped (no new XML dependency)"
  - "runNotificationRetrySweep() — scheduled retry-sweep job scoped to the previously-unused job_type='notification_fanout'"
  - "notificationProviderRoutes — POST .../send, POST .../callback, GET .../health"
  - "notifications.ts's send route additively dispatches through sendViaProvider per distinct channel"
affects: [09-03 (F14 frontend consumer — Compose/Delivery-tracking UI CAP-field additions)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Adapter-stub + retry-backoff + integration-health convention (established Phase 1, replicated by every subsequent adapter) — mirrors gis-adapter.ts/eoc-cots-adapter.ts/facility-adapter.ts exactly"
    - "Hard approval re-check re-stated at a second, independent layer (the adapter itself), never trusting only the HTTP route's own preHandler gate"
    - "Hand-built XML string for a simulated external-standard payload (OASIS CAP), matching this codebase's 'no new dependency unless necessary' convention"

key-files:
  created:
    - backend/migrations/1700000000017_notification-provider-schema.js
    - backend/src/modules/integration-gateway/notification-provider-adapter.ts
    - backend/src/modules/integration-gateway/notification-provider-adapter.test.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/server.ts
    - backend/src/modules/comms-reporting/notifications.ts
    - backend/scripts/seed.ts

key-decisions:
  - "Migration renumbered from the plan's literal 1700000000012 to 1700000000017 — that slot (and 1700000000013-1700000000016) were already claimed by Phase 7/8's own adapter plans by execution time, same cross-plan collision precedent as every prior phase"
  - "403 CAP_AUTHORITY_DENIED omitted from the send route's catch block — this single-agency MVP stub has no per-agency CAP-authorization config concept at all, so that FRD-documented path is structurally unreachable in this scope; documented inline rather than thrown for symmetry with a condition this stub can never produce"
  - "IPAWS CAP fields (sender/event/urgency/severity/certainty/area) passed as a documented placeholder object from notifications.ts's send handler — Plan 09-03 owns the dedicated composer UI for these fields; explicit Plan 09-01->09-03 handoff point, matching 07-01->07-03/08-01->08-03 precedent"
  - "Seed's final integration_health state leaves 'Everbridge' offline (the forced-outage demo call runs last) while 'IPAWS' stays online — documented for Plan 09-03's Playwright suite to expect"

patterns-established: []

# Metrics
duration: 25min
completed: 2026-11-20
---

# Phase 9 Plan 01: Notification Provider & Public-Alerting Integration (F14) Summary

**Everbridge/AtHoc-class notification-provider adapter stub with an adapter-level (not just route-level) approval re-check, OASIS CAP XML envelope builder for IPAWS sends, and a retry-sweep scheduled job that surfaces provider outages as `Failed` in F5's own delivery-status table under the previously-unused `job_type='notification_fanout'`.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-20T19:19:00Z (approx)
- **Completed:** 2026-11-20T19:45:04Z
- **Tasks:** 3
- **Files modified:** 7 (3 created, 4 modified)

## Accomplishments
- `notification_provider_config`/`notification_dispatch_log`/`cap_alert_records` schema shipped exactly per TechArch 02c
- `sendViaProvider()` re-verifies `approved_by`/`approved_at` as its own first executable check — proven by a direct-function-call test that never touches the HTTP route at all, closing the direct-API-bypass threat this plan's threat model names as its headline concern
- `buildCapEnvelope()` produces a complete OASIS CAP 1.2-shaped XML envelope (identifier/sender/sent/status/scope/category/event/urgency/severity/certainty/area), hand-escaped, no new XML dependency
- CAP-incomplete IPAWS sends are rejected with `422 CAP_FIELDS_INCOMPLETE` before any dispatch attempt — proven to write zero `cap_alert_records` rows
- Provider outages (unrecognized channel or the `FORCE_PROVIDER_OUTAGE` test trigger) queue for retry rather than throwing, and `runNotificationRetrySweep()` escalates a 4th consecutive failure into F5's existing `notification_delivery_status` table as `'Failed'` with a visible `failure_reason`
- Inbound delivery callbacks match by `external_message_id` + recipient contact, update F5's existing delivery-status table, and log (never drop or misattach) an unmatched callback with a `200`
- `GET /api/v1/integrations/notification-providers/health` and the shared admin integration-health table both surface the adapter's state, direction `'outbound'`, record_authority naming the real provider (`'Everbridge'`/`'IPAWS'`), never `'EPMP'`

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration + notification-provider-adapter.ts** - `b5e8c1d` (feat)
2. **Task 2: Wire into notifications.ts's send route + seed.ts** - `aa2fb9d` (feat)
3. **Task 3: Integration tests** - `66eb52e` (test)

_Note: Tasks 1-2's own code landed without a separate "plan metadata" commit until this SUMMARY; the final docs commit follows this file._

## Files Created/Modified
- `backend/migrations/1700000000017_notification-provider-schema.js` - notification_provider_config/notification_dispatch_log/cap_alert_records DDL (renumbered from 1700000000012)
- `backend/src/modules/integration-gateway/notification-provider-adapter.ts` - sendViaProvider, buildCapEnvelope, runNotificationRetrySweep, notificationProviderRoutes, startNotificationRetryScheduler
- `backend/src/modules/integration-gateway/notification-provider-adapter.test.ts` - 10-assertion integration test suite (real Postgres + OPA)
- `backend/src/modules/integration-gateway/routes.ts` - registers notificationProviderRoutes (append-only)
- `backend/src/server.ts` - starts startNotificationRetryScheduler inside the graceful-degradation scheduler block
- `backend/src/modules/comms-reporting/notifications.ts` - send route additively calls sendViaProvider per distinct channel after the existing approval/AI-governance gates commit
- `backend/scripts/seed.ts` - 3 sendViaProvider calls against the existing uatSentNotification fixture (Everbridge success, IPAWS success with full CAP fields, forced outage)

## Decisions Made
- Migration renumbered 1700000000012 → 1700000000017 (collision with Phase 7/8's own adapter migrations by execution time)
- `403 CAP_AUTHORITY_DENIED` deliberately NOT thrown anywhere — this MVP stub has no per-agency CAP-authorization concept, so the condition is structurally unreachable; documented inline rather than faked
- IPAWS CAP fields passed as a documented placeholder object from the send handler, pending Plan 09-03's composer UI
- Seed's final state: `'Everbridge'` integration_health row left `offline` (forced-outage call runs last in the 3-call sequence), `'IPAWS'` left `online` — call out for Plan 09-03's own Playwright expectations

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration JS template-literal backtick collision**
- **Found during:** Task 1 (migration write)
- **Issue:** The migration file's own SQL comment used a markdown-style backtick-quoted shell command (`` `grep -rn "notification_fanout" backend/src` ``) inside a JS template literal, which node-pg-migrate's parser read as a literal backtick terminating the template string — `ParseError: Missing semicolon.`
- **Fix:** Reworded the comment to describe the grep check in prose instead of backtick-quoting a shell command inside the SQL template literal
- **Files modified:** backend/migrations/1700000000017_notification-provider-schema.js
- **Verification:** `npm run migrate` applied cleanly afterward
- **Committed in:** b5e8c1d (Task 1 commit)

**2. [Documented, not a defect] Concurrent-execution git interleave on shared files (routes.ts, server.ts, seed.ts)**
- **Found during:** Tasks 1-2 commit staging
- **Issue:** Plan 09-02 (same wave, parallel execution) independently edited `routes.ts`, `server.ts`, and `seed.ts` for its own HRIS-roster adapter wiring. By the time this plan's edits to those same files were staged, 09-02's commit (`d245801`) had already landed with both plans' changes present in the working tree (same git race documented in Phase 8's 08-04 SUMMARY precedent) — this plan's Task 1 commit (`b5e8c1d`) therefore shows only the genuinely-new `notification-provider-adapter.ts`/migration files, while `routes.ts`/`server.ts` show zero diff against HEAD despite containing this plan's wiring.
- **Fix:** None needed — confirmed by direct inspection that `routes.ts` contains both `notificationProviderRoutes` (this plan) and `hrisRosterRoutes` (09-02) registrations, `server.ts` starts both schedulers, and `seed.ts` carries both plans' seed calls. `npm run build`/`npm test` both re-verify clean against HEAD.
- **Files affected:** backend/src/modules/integration-gateway/routes.ts, backend/src/server.ts, backend/scripts/seed.ts
- **Verification:** `grep -n "notificationProviderRoutes\|notification-provider-adapter" backend/src/modules/integration-gateway/routes.ts backend/src/server.ts` confirms both wiring points present; full backend suite (24 files, 171 tests) green
- **Committed in:** d245801 (09-02's commit, pre-existing before this plan's own staging), b5e8c1d/aa2fb9d (this plan's own commits covering the files genuinely new/changed by this plan)

---

**Total deviations:** 1 auto-fixed (1 blocking), 1 documented non-defect (concurrent-execution git interleave)
**Impact on plan:** The blocking fix was a trivial template-literal escaping issue, caught immediately by the migration run. The concurrent-execution interleave is a known, previously-observed artifact of parallel-wave plan execution (Phase 8 precedent) — verified harmless via direct inspection and a full clean test/build re-run; no code was lost or silently overwritten.

## Known Stubs

None found — `grep` for TODO/FIXME/placeholder/not-implemented across all new/modified files returned only one incidental hit (a doc-comment using the word "placeholder" to describe the documented, intentional CAP-field handoff to Plan 09-03 — not an incomplete implementation) and one unrelated pre-existing `placeholders` variable name in `seed.ts`'s SQL-parameter-building helper.

## Issues Encountered
None beyond the auto-fixed migration syntax issue and the documented concurrent-execution file interleave above, both resolved during execution.

## User Setup Required
None - no external service configuration required. This is a deterministic stub adapter requiring no real Everbridge/AtHoc/IPAWS credentials.

## Next Phase Readiness
- Plan 09-01's backend surface (`sendViaProvider`, `buildCapEnvelope`, `notificationProviderRoutes`, the notifications.ts send-route wiring) is fully shipped and tested — ready for Plan 09-03's frontend consumer (Compose/Delivery-tracking UI additions, including the dedicated CAP-field composer this plan's placeholder `capFields` object anticipates)
- Full backend suite (24 files, 171 tests) green with zero regression; `npm run build` and `npm run seed` both clean

---
*Phase: 09-alerting-identity-integrations*
*Completed: 2026-11-20*

## Self-Check: PASSED

- All 3 key-files (migration, adapter module, test file) confirmed present on disk via `[ -f ]`
- All 3 task commits (`b5e8c1d`, `aa2fb9d`, `66eb52e`) confirmed present via `git log --oneline --all`
- Build check: `cd backend && npm run build` → exit 0
- `## Known Stubs` section present above, no blocking entries
