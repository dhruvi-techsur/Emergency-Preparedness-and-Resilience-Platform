---
phase: 09-alerting-identity-integrations
plan: 06
subsystem: integrations
tags: [fastify, deploy-01, graceful-degradation, gap-closure, cold-boot]

# Dependency graph
requires:
  - phase: 09-alerting-identity-integrations
    provides: "Plan 09-02's F17 document adapter (documentRoutes()/recordDocumentHealth()) — this plan only wraps its existing registration-time call in error handling"
provides:
  - "documentRoutes()'s startup health-stamp call (recordDocumentHealth('online')) wrapped in try/catch + app.log.warn, matching every sibling adapter's and every server.ts scheduler-start block's existing graceful-degradation convention"
  - "Restored DEPLOY-01 D4 cold-boot compliance: a container started with only PORT set (no DATABASE_URL/NATS_URL/OPA_URL) comes up and stays up, answering GET /healthz with 200"
affects: [09-UAT, DEPLOY-01]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Registration-time DB calls in Fastify route-plugin bodies must be wrapped in try/catch + app.log.warn — the same pattern server.ts's start() already uses for every scheduler-start/OPA-sync/NATS-connect call — since an unawaited app.register() call propagates an uncaught rejection straight to process exit code 1"]

key-files:
  created: []
  modified:
    - backend/src/modules/integration-gateway/document-adapter.ts
    - backend/src/modules/integration-gateway/facility-document-adapter.test.ts

key-decisions:
  - "Single localized try/catch at the one unguarded call site — no changes to recordDocumentHealth() itself, routes.ts, or server.ts, per the debug session's own finding that this is the sole landmine of this shape in backend/src"
  - "documentHealthRecorded stays set to true even on failure (unchanged pre-existing 'never retry on next hot-reload' semantics) — the fix's sole job is 'don't crash the process', not 'retry the health write'"
  - "The DB-unreachable regression test uses a structural source-read + regex assertion (mirroring 09-SECURITY.md's own T-09-07/T-09-09 precedent) rather than live-exploiting a broken pool, since the shared module-level documentHealthRecorded flag and pool/query singleton make a genuine second live failure impossible to trigger safely from this test file without a DI seam the source doesn't have"

patterns-established: []

# Metrics
duration: 20min
completed: 2026-11-21
---

# Phase 9 Plan 06: DEPLOY-01 Cold-Boot Crash Fix (Gap Closure) Summary

**Wrapped `documentRoutes()`'s unguarded registration-time `recordDocumentHealth('online')` call in try/catch + `app.log.warn`, fixing the sole uncaught-rejection crash (`AggregateError [ECONNREFUSED]` → exit code 1) that broke the DEPLOY-01 D4 cold-boot contract when `DATABASE_URL` is unset.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-11-21T17:20:00Z
- **Completed:** 2026-11-21T17:40:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Fixed the single confirmed UAT blocker carried over from the prior round: `documentRoutes()`'s registration-time `recordDocumentHealth('online')` call was the ONE unguarded, registration-time DB call in the entire `backend/src` tree, crashing the Fastify process with exit code 1 before `/healthz` could bind.
- Verified the fix against the EXACT failing scenario: a cold `docker run` with only `PORT=8080` set now stays `running`, `GET /healthz` returns `200`, and a new "Document adapter health record failed at startup" warning appears alongside the pre-existing OPA/NATS warnings — zero uncaught crash.
- Re-ran `pivota-deploy-check.cjs --dir . --no-trivy` directly: D4 (previously the sole failing line) now passes, with D3/C1/C2/C3/D1/D2/D5/C6/C4 all remaining green.
- Added 2 new regression tests: a happy-path confirmation that the `SharePoint` `integration_health` row still lands correctly when the DB IS reachable, and a structural assertion proving the try/catch now wraps the previously-unguarded call.
- Zero behavior change on the happy path and zero functional change to F17.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wrap documentRoutes()'s unguarded startup health-stamp call in try/catch** - `d883e40` (fix)
2. **Task 2: Add a regression test proving the registration-time call no longer crashes on DB failure** - `5cb2028` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/src/modules/integration-gateway/document-adapter.ts` - `documentRoutes()`'s registration-time `recordDocumentHealth('online')` call wrapped in try/catch, logging via `app.log.warn` and swallowing the error on DB-unreachable, matching every sibling scheduler-start block in server.ts's `start()`
- `backend/src/modules/integration-gateway/facility-document-adapter.test.ts` - 2 new tests: happy-path `integration_health` row confirmation (live compose DB) and a structural try/catch assertion proving the fix

## Decisions Made
- Single localized try/catch at the one unguarded call site — no changes to `recordDocumentHealth()` itself, `routes.ts`, or `server.ts`, exactly as the plan specified and the debug session confirmed was the sole root cause.
- `documentHealthRecorded` stays `true` even on failure — the pre-existing "never retry on next hot-reload" semantics are unchanged; the fix's sole job is "don't crash the process."
- The DB-failure regression test uses a structural source-read + regex match (same precedent as 09-SECURITY.md's T-09-07/T-09-09) rather than attempting to re-trigger a live failure, since the shared module-level `documentHealthRecorded` flag makes a second live registration a no-op by design, and monkey-patching the shared `pool`/`query` singleton would race every other concurrently-running test in the file.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

One pre-existing, unrelated test-isolation flake was observed in a single full-suite run of `npm test`: `field-reports.test.ts`'s sync-conflict tests (`POST /api/v1/field-reports/sync-batch` / `POST /api/v1/sync-conflicts/{id}/resolve`) failed once with order-dependent DB-state assertions (`expected 'conflict' to be 'synced'`), then passed cleanly on two immediate re-runs (24/24 files, 173/173 tests, both times) with zero changes to the working tree in between. This confirms the flake is pre-existing and unrelated to this plan's changes (document-adapter.ts / facility-document-adapter.test.ts are untouched by field-reports.test.ts's suite), out of this plan's scope per the deviation rules' scope boundary, and not a regression introduced by Task 1 or Task 2.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- DEPLOY-01 D4 cold-boot contract is restored: `docker build` succeeds, a cold `docker run` with only `PORT` set stays running and answers `/healthz` with 200, and `pivota-deploy-check.cjs`'s full D-series (D1-D5) passes with zero failing lines.
- Full backend suite (24 files, 173 tests) passes with zero regression (confirmed on 2 consecutive clean runs); `tsc --noEmit` and `npm run build` are clean for both backend and frontend/app.
- Phase 9's UAT blocker is closed; this was the phase's final outstanding gap-closure item.

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against both changed files returned no matches.

## Self-Check: PASSED

- `backend/src/modules/integration-gateway/document-adapter.ts` — FOUND on disk
- `backend/src/modules/integration-gateway/facility-document-adapter.test.ts` — FOUND on disk
- `.planning/phases/09-alerting-identity-integrations/09-06-SUMMARY.md` — FOUND on disk
- Commit `d883e40` (Task 1) — FOUND in git log
- Commit `5cb2028` (Task 2) — FOUND in git log
- `cd backend && npx tsc --noEmit` → exit 0
- `cd frontend/app && npx tsc --noEmit` → exit 0
- `cd backend && npm run build` → exit 0 (clean)
- `cd frontend/app && npm run build` → exit 0 (clean)
- `docker build -t pivota-build-check .` → exit 0 (BUILD OK)
- Cold `docker run` (only `PORT=8080` set) → container stayed `running`, `GET /healthz` → 200, no crash
- `pivota-deploy-check.cjs --dir . --no-trivy` → `DEPLOY-CHECK: PASS` (D4 now passing, all other D/C lines unaffected)
- `cd backend && npm test` → 24/24 files, 173/173 tests passing (confirmed on 2 consecutive clean runs; one earlier run hit a pre-existing, unrelated test-isolation flake in `field-reports.test.ts`, documented above under Issues Encountered)
- `## Known Stubs` section present above, zero blocking entries

---
*Phase: 09-alerting-identity-integrations*
*Completed: 2026-11-21*
