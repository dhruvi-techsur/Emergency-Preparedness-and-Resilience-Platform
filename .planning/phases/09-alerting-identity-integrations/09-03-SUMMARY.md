---
phase: 09-alerting-identity-integrations
plan: 03
subsystem: comms-reporting
tags: [notification-provider, everbridge, ipaws, oasis-cap, f14, playwright, integration-health]

# Dependency graph
requires:
  - phase: 09-alerting-identity-integrations (Plan 09-01)
    provides: "sendViaProvider()/buildCapEnvelope() adapter, notifications.ts's send route additively dispatching per channel, the shared integration_health Everbridge/IPAWS rows"
  - phase: 04-comms-reporting (Phase 4)
    provides: "F5's Compose Notification 4-step wizard (ComposeNotification.tsx) and Delivery & Acknowledgment Tracking (DeliveryTracking.tsx)"
provides:
  - "ComposeNotification.tsx Step 2 conditionally renders 6 CAP public-alert fields (Sender/Event/Urgency/Severity/Certainty/Area) when IPAWS is selected, gating Step 4's send until complete"
  - "DeliveryTracking.tsx renders a 'Public alert (CAP)' Badge, sourced from notifications.ts's new additive is_cap_send field on the existing delivery-status response"
  - "notification-provider-adapter.ts's new GET /api/v1/_test/notification-retry-sweep test-injection route, enabling deterministic Playwright coverage of the 4th-failure Failed escalation"
  - "notification-provider-cap-delivery.spec.ts — 5/5 Playwright tests proving the CAP gate, the Badge's conditional presence, integration-health visibility, and the forced-outage Failed state end-to-end"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Additive-only response field (is_cap_send) on an EXISTING endpoint rather than a new one — same precedent as every prior adapter plan's integration-health exposure, zero shape change for existing consumers"
    - "Dedicated GET /api/v1/_test/* test-injection route calling the real backend function SERVER-SIDE (mirrors cad-adapter.ts's /api/v1/_test/cad-forced-outage exactly) — lets Playwright drive a scheduled job's outcome deterministically without waiting for its real interval or importing backend source into the test runner's own Node process"

key-files:
  created:
    - frontend/app/e2e/notification-provider-cap-delivery.spec.ts
  modified:
    - frontend/app/src/pages/notifications/ComposeNotification.tsx
    - frontend/app/src/pages/notifications/DeliveryTracking.tsx
    - backend/src/modules/comms-reporting/notifications.ts
    - backend/src/modules/integration-gateway/notification-provider-adapter.ts

key-decisions:
  - "IntegrationHealth.tsx needed ZERO code change — confirmed by direct inspection that no hardcoded system_name allowlist excludes 'Everbridge'/'IPAWS', and the EmptyState copy is already generic ('GIS, hazard feeds, CAD/911, HR/IAM, EOC COTS, etc.') from Plan 07-01 onward. Same confirm-only posture Plan 07-04/08-03 each already established for their own adapters, per this plan's own objective."
  - "CAP-send signal derived via a new additive is_cap_send boolean on the EXISTING GET /api/v1/notifications/:id/delivery-status response (sourced from the notification's own already-fetched channels array), not a new endpoint or a second query — the cheapest correct shape, and the one the plan's own key_links section named as the sanctioned pattern."
  - "Added a new GET /api/v1/_test/notification-retry-sweep test-injection route to notification-provider-adapter.ts — not in the original plan text, but required to make Test 5 (forced-outage -> Failed) deterministic within a single Playwright test's timeout, mirroring cad-adapter.ts's own pre-existing /api/v1/_test/cad-forced-outage route exactly. Gated on notifications:view (not admin:view), matching that route's own reasoning for using the domain-specific permission the test identity already holds."
  - "Compose/send request bodies carry a capFields object as forward-compatible plumbing (confirmed via grep that notifications.ts's send route does NOT yet read req.body.capFields — it still passes its OWN Plan-09-01-documented placeholder object to sendViaProvider). Sending it anyway costs nothing and matches the exact shape Plan 09-01's SUMMARY names as its own handoff point for this plan."

patterns-established: []

# Metrics
duration: 24min
completed: 2026-11-20
---

# Phase 9 Plan 03: Notification Provider & Public-Alerting Integration (F14 frontend) Summary

**Compose Notification's Step 2 gains 6 OASIS CAP 1.2 public-alert fields gated behind IPAWS selection; Delivery Tracking surfaces a distinct 'Public alert (CAP)' Badge via a new additive `is_cap_send` field; a new test-injection route makes the provider-outage retry-sweep deterministically testable; 5/5 new Playwright tests prove all of F14's frontend-visible behavior end-to-end against the real Plan 09-01 backend.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-11-20T19:47:06Z (approx, immediately following 09-02's completion)
- **Completed:** 2026-11-20T20:09:10Z
- **Tasks:** 2
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments
- `ComposeNotification.tsx` Step 2 conditionally renders a "CAP public-alert fields" `Card` with all 6 OASIS CAP 1.2 fields (Sender/Event/Urgency/Severity/Certainty/Area, using CAP's own literal Urgency/Severity/Certainty enumerations) exactly when `channels.has('IPAWS')`
- `handleContinueFromStep2` blocks advancing past Step 2 with the exact FRD-mirroring error message until all 6 CAP fields are filled when IPAWS is selected — a client-side UX improvement that never replaces Plan 09-01's real server-side `422 CAP_FIELDS_INCOMPLETE` gate (T-09-12, accepted)
- Step 3 (Review) adds a fully read-only CAP field summary block, matching the page's existing no-edit-affordance convention
- `handleConfirmSend` passes a `capFields` object through both the compose and send request bodies when IPAWS is selected — forward-compatible plumbing matching Plan 09-01's own documented handoff point
- `notifications.ts`'s existing `GET .../delivery-status` route additively returns `is_cap_send: boolean` (derived from the notification's own `channels` array, already fetched for the 404 check) — zero shape change for any existing consumer
- `DeliveryTracking.tsx` renders a distinct `<Badge tone="warning">Public alert (CAP)</Badge>` directly under the page header when `is_cap_send` is true — never rendered identically to a plain send
- `IntegrationHealth.tsx` confirmed needing **zero** code change (see Decisions)
- New `GET /api/v1/_test/notification-retry-sweep` test-injection route on `notification-provider-adapter.ts`, mirroring `cad-adapter.ts`'s own `/api/v1/_test/cad-forced-outage` route exactly, enabling deterministic Playwright coverage of the retry-sweep's 4th-failure `Failed` escalation
- New `notification-provider-cap-delivery.spec.ts` (5/5 passing): the CAP-fields-required gate with Continue genuinely blocked, the CAP-send Badge's conditional presence (shown for IPAWS, absent for plain SMS), integration-health visibility for Everbridge/IPAWS rows, and the forced-outage Failed-state visibility with a non-empty `failure_reason`

## Task Commits

Each task was committed atomically:

1. **Task 1: CAP fields in Compose Notification's Step 2 + send gate** - `cffbbc0` (feat)
2. **Task 2: CAP-send Badge on Delivery Tracking + Playwright coverage for CAP gate, badge, forced-outage, integration-health** - `5a31940` (feat)

**Plan metadata:** commit follows this file.

## Files Created/Modified
- `frontend/app/src/pages/notifications/ComposeNotification.tsx` - 6 new CAP field states, conditional Step 2 Card, Step 2→3 gate, capFields in compose/send bodies, Step 3 CAP summary block
- `frontend/app/src/pages/notifications/DeliveryTracking.tsx` - `is_cap_send` read from the delivery-status response, `Badge` rendered under `PageHeader` when true
- `backend/src/modules/comms-reporting/notifications.ts` - `GET .../delivery-status` additively returns `is_cap_send`
- `backend/src/modules/integration-gateway/notification-provider-adapter.ts` - new `GET /api/v1/_test/notification-retry-sweep` test-injection route
- `frontend/app/e2e/notification-provider-cap-delivery.spec.ts` - new, 5 tests

## Decisions Made
- `IntegrationHealth.tsx` needed zero structural change — confirmed by direct inspection (no `system_name` allowlist, already-generic EmptyState copy), documented per the plan's own confirm-only instruction
- CAP-send signal sourced via an additive `is_cap_send` field on the existing delivery-status response rather than a new endpoint or a second `GET /api/v1/notifications/:id` route (which doesn't exist in this codebase) — the plan's own `key_links` section named this exact pattern as sanctioned
- Added a new `GET /api/v1/_test/notification-retry-sweep` route (not in the original plan text) to make the forced-outage test deterministic — justified under deviation Rule 3 (blocking: no other HTTP-reachable way existed to drive `retry_count` past 3 within a single Playwright test's timeout without waiting for the real 5-minute scheduler)
- `capFields` sent in both compose/send request bodies as forward-compatible plumbing, even though `notifications.ts`'s send route doesn't yet read it from the request body (confirmed via grep) — matches Plan 09-01's own documented handoff expectation, costs nothing today

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added GET /api/v1/_test/notification-retry-sweep test-injection route**
- **Found during:** Task 2 (Playwright Test 5 — forced-outage Failed state)
- **Issue:** The plan's own Test 5 instructions name two possible approaches ("force 4 consecutive failed notification_dispatch_log rows... or call runNotificationRetrySweep() directly if the test runner can import backend modules"). The test runner's own Node process has no `DATABASE_URL` set (confirmed, same constraint `incident-workspace-dispatch-status.spec.ts` documents for its own CAD-outage test), so importing backend source directly was not viable; no existing HTTP route exposed `runNotificationRetrySweep()` on demand (the only path was the real 5-minute `startNotificationRetryScheduler` interval, far too slow for a bounded test timeout).
- **Fix:** Added a new `GET /api/v1/_test/notification-retry-sweep` route, mirroring `cad-adapter.ts`'s pre-existing `/api/v1/_test/cad-forced-outage` test-injection pattern exactly (unauthenticated-by-convention-but-permission-gated, calls the real function server-side inside the already-running backend process). Gated on `notifications:view` (the same permission domain this module's own routes use), not `admin:view`.
- **Files modified:** `backend/src/modules/integration-gateway/notification-provider-adapter.ts`
- **Verification:** Playwright Test 5 passes, asserting a `Failed` Badge + non-empty `failure_reason` caption after 4 sweep ticks; full backend suite (24 files, 171 tests) zero regression; `npm run build` clean
- **Committed in:** `5a31940` (Task 2 commit)

**2. [Rule 1 - Bug, test-only] `getByLabel({ exact: true })` locator mismatch for required TextField/Select fields**
- **Found during:** Task 2 (writing the new Playwright spec)
- **Issue:** `TextField`/`Select`'s `required` prop appends a trailing `" *"` required-marker `<span>` into the `<label>`'s accessible name. `getByLabel('Event', { exact: true })` therefore never matched (the actual accessible name is `"Event *"`), timing out at 60s on every CAP-field fill after the first.
- **Fix:** Switched the affected locators (`Event`/`Urgency`/`Severity`/`Certainty`) to `{ exact: false }`, matching the pattern `notifications-compose.spec.ts` already uses for its own `Message`/`Name`-style required-field locators.
- **Files modified:** `frontend/app/e2e/notification-provider-cap-delivery.spec.ts` (test-only — no production code affected)
- **Verification:** All 5 tests pass after the fix; confirmed via a scratch debug spec that `exact:false` resolves to exactly 1 element for every affected field
- **Committed in:** `5a31940` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 test-only bug)
**Impact on plan:** The blocking fix (new test route) was necessary to make Test 5 deterministic and bounded, following an established same-file precedent (cad-adapter.ts) rather than inventing a new pattern. The test-only locator fix affected zero production code. No scope creep.

## Known Stubs

None found — `grep` for TODO/FIXME/placeholder/not-implemented across all new/modified files returned one incidental hit: a pre-existing Plan 09-01 doc-comment in `notifications.ts` describing the already-documented, intentional CAP-field placeholder handoff to this plan — not a new incomplete implementation. Not blocking.

## Issues Encountered
None beyond the two auto-fixed deviations above, both resolved during execution.

## User Setup Required
None - no external service configuration required. This plan extends the existing deterministic stub adapter's frontend consumer; no real Everbridge/AtHoc/IPAWS credentials are involved.

## Next Phase Readiness
- F14's frontend half is fully shipped and tested — ComposeNotification.tsx/DeliveryTracking.tsx/IntegrationHealth.tsx all satisfy ROADMAP success criteria 2 (CAP representation distinct from a normal send) and 3 (outage retried, failure surfaced, never silently dropped) end-to-end through the real UI
- `tsc --noEmit` (frontend/app) and `npm run build` (frontend/app + backend) all clean; full backend suite (24 files, 171 tests) zero regression; `npm run seed` re-confirmed idempotent
- New spec (5/5) + existing regression specs (`notifications-compose.spec.ts` 9/9, `incident-workspace-dispatch-status.spec.ts` 4/4) all green
- Plan 09-04 (same phase, parallel wave) is already complete per git history (roster wiring) — Plan 09-03 is now the final remaining original-scope plan in Phase 9 to close out, pending any gap-closure rounds

---
*Phase: 09-alerting-identity-integrations*
*Completed: 2026-11-20*

## Self-Check: PASSED

- Key file `frontend/app/e2e/notification-provider-cap-delivery.spec.ts` confirmed present on disk via `[ -f ]`
- Both task commits (`cffbbc0`, `5a31940`) confirmed present via `git log --oneline --all`
- Build check: `cd frontend/app && npx tsc --noEmit` → exit 0; `cd frontend/app && npm run build` → exit 0; `cd backend && npm run build` → exit 0
- `## Known Stubs` section present above, no blocking entries
