---
phase: 08-record-authority-sync-integrations
plan: 01
subsystem: integration-gateway
tags: [eoc-cots, webeoc, record-authority, conflict-detection, adapter-stub, fastify, postgres]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "record_authority_registry, integration_health, background_jobs tables (checkRecordAuthority, computeBackoff helpers)"
  - phase: 07-operating-picture-weather-dispatch
    provides: "gis-adapter.ts/hazard-feed-adapter.ts/cad-adapter.ts's recognized-vendor-vs-unrecognized deterministic-stub pattern this plan replicates exactly"
provides:
  - "eoc_cots_config/eoc_cots_sync_log/eoc_cots_conflicts tables (migration 1700000000014)"
  - "isRecordTypeDeclared(recordType) — direct record_authority_registry existence check, structurally distinguishing 'undeclared' from 'EPMP-authoritative' where checkRecordAuthority's own collapsed default cannot"
  - "fetchExchangeRecords/runEocCotsSync/eocCotsRoutes/startEocCotsSyncScheduler exports from eoc-cots-adapter.ts"
  - "GET/POST /api/v1/integrations/eoc-cots/exchange-records, GET .../conflicts, GET .../health"
affects: ["08-03 (EOC COTS conflict-resolution UI + resolve route)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "isRecordTypeDeclared(type) called BEFORE checkRecordAuthority(type) at every call site that could otherwise conflate 'undeclared' with 'EPMP-authoritative'"
    - "Deterministic conflict-trigger: a hardcoded external_id (EOC-CONFLICT-001) reproducibly fires eoc_cots_conflicts insertion, mirroring the KNOWN_VENDOR/KNOWN_LAYER_ID/KNOWN_LIVE_FEED recognized-trigger convention established in Phases 2/7"

key-files:
  created:
    - backend/migrations/1700000000014_eoc-cots-schema.js
    - backend/src/modules/integration-gateway/eoc-cots-adapter.ts
    - backend/src/modules/integration-gateway/eoc-cots-adapter.test.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/server.ts
    - backend/scripts/seed.ts

key-decisions:
  - "Migration renumbered 1700000000012 -> 1700000000014 (Phase 7's hazard-layers-schema.js and cad-dispatch-schema.js had already claimed 1700000000012/13 by execution time) — same cross-plan renumbering precedent as every prior phase"
  - "job_type='sync_reconciliation' required NO new migration ALTER — it already existed in Phase 1's original background_jobs CHECK constraint list, confirmed unclaimed via grep before use, unlike Plan 07-02's 'cad_ingestion' which needed its own ALTER"
  - "integration_health.record_authority for the WebEOC row is set to the literal string 'WebEOC' (not per-record-type) since that column is one-value-per-system; the actual per-type authoritative resolution lives in record_authority_registry via isRecordTypeDeclared/checkRecordAuthority, not this column"

patterns-established:
  - "Pattern 1: isRecordTypeDeclared-before-checkRecordAuthority is the first instance in this codebase structurally distinguishing 'no registry row' from 'registry row explicitly says EPMP' — future F14/F16/F17 adapters needing the same distinction should reuse this helper's shape rather than re-deriving it from checkRecordAuthority's collapsed return value"

# Metrics
duration: 20min
completed: 2026-11-20
---

# Phase 8 Plan 1: EOC COTS Interoperability Backend Summary

**Deterministic WebEOC-class adapter stub exchanging incident/resource_request/status/activity_log records, gating every inbound/outbound sync on a new isRecordTypeDeclared() existence check that structurally separates "undeclared" from "EPMP-authoritative" — a distinction checkRecordAuthority's own collapsed default return value could never express on its own.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-11-20T12:00Z (approx, first file read)
- **Completed:** 2026-11-20T12:18Z
- **Tasks:** 2
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- `eoc_cots_config`/`eoc_cots_sync_log`/`eoc_cots_conflicts` schema shipped exactly per TechArch 02d, migration renumbered to the next free slot
- `isRecordTypeDeclared(recordType)` built and wired in BEFORE `checkRecordAuthority(type)` in both `runEocCotsSync`'s per-type loop and the outbound POST route — an undeclared record type is now structurally skipped (zero fetch, zero log write, zero conflict check), never silently conflated with an explicit EPMP-authoritative declaration
- Deterministic conflict detection via the seeded `EOC-CONFLICT-001` external_id, writing to `eoc_cots_conflicts` with `resolution` left `NULL` — never auto-resolved
- `runEocCotsSync`'s `background_jobs` bookkeeping scoped exclusively to the pre-existing, previously-unclaimed `job_type = 'sync_reconciliation'` value — no new migration ALTER needed, confirmed unclaimed via grep first
- Full exchange-records/conflicts/health route surface mounted (conflict-resolve route deliberately deferred to Plan 08-03, per this plan's own scope boundary)
- seed.ts extended: `incident` registered EPMP-authoritative (resource_request/status/activity_log deliberately left unregistered), `runEocCotsSync()` called once so a real conflict + WebEOC health row exist immediately after `npm run seed`
- 8 new integration-test assertions, all passing, including the structural "undeclared type produces zero sync_log rows" proof and the direct `isRecordTypeDeclared` true/false distinction proof

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration + eoc-cots-adapter.ts (adapter stub, sync job, conflict detection, routes)** - `0e368d8` (feat)
2. **Task 2: seed.ts fixture producing a reproducible conflict + integration tests** - `df05c67` (test)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified
- `backend/migrations/1700000000014_eoc-cots-schema.js` - eoc_cots_config/eoc_cots_sync_log/eoc_cots_conflicts tables, renumbered from the plan's stale 1700000000012
- `backend/src/modules/integration-gateway/eoc-cots-adapter.ts` - adapter stub (fetchExchangeRecords), isRecordTypeDeclared existence check, runEocCotsSync scheduled job with conflict detection, eocCotsRoutes Fastify plugin, startEocCotsSyncScheduler
- `backend/src/modules/integration-gateway/eoc-cots-adapter.test.ts` - 8-assertion integration test suite against the real compose stack (Postgres + OPA)
- `backend/src/modules/integration-gateway/routes.ts` - registered eocCotsRoutes, append-only per existing convention
- `backend/src/server.ts` - registered startEocCotsSyncScheduler inside the same graceful-degradation try/catch style as other schedulers
- `backend/scripts/seed.ts` - added 'incident' record_authority_registry row, call to runEocCotsSync() for immediate post-seed conflict/health fixtures

## Decisions Made
- Migration renumbered 1700000000012 → 1700000000014 (Phase 7's 07-01/07-02 had already claimed 12/13 by execution time) — same renumbering precedent as every prior cross-plan migration collision in this codebase
- `job_type = 'sync_reconciliation'` required no new migration — already present in Phase 1's original CHECK constraint list and confirmed unclaimed by any other adapter via grep before use
- `integration_health.record_authority` for the WebEOC row carries the literal string `'WebEOC'` (the system name itself) rather than attempting to encode per-record-type authority in a single-value column — per-type resolution lives entirely in `record_authority_registry`, queried via `isRecordTypeDeclared`/`checkRecordAuthority`

## Deviations from Plan

None - plan executed exactly as written, including the pre-anticipated migration renumbering (explicitly instructed by the plan itself given the prior-plan-collision precedent).

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required (stub adapter, no real WebEOC/Veoci/DisasterLAN credential needed).

## Next Phase Readiness

- `eoc_cots_conflicts` table + `GET /api/v1/integrations/eoc-cots/conflicts` are live and seeded with a reproducible conflict row — Plan 08-03 (conflict-resolution UI + `POST .../conflicts/{id}/resolve` route) can build directly against this.
- `GET /api/v1/admin/integration-health` now returns a `WebEOC` row (via the shared `integration_health` table this adapter writes to) alongside the Phase 7 GIS/hazard-feed/CAD rows — ready for the admin Integration Health screen to render.
- No blockers.

## Self-Check: PASSED

- `backend/migrations/1700000000014_eoc-cots-schema.js` — FOUND
- `backend/src/modules/integration-gateway/eoc-cots-adapter.ts` — FOUND
- `backend/src/modules/integration-gateway/eoc-cots-adapter.test.ts` — FOUND
- Commit `0e368d8` — FOUND in git log
- Commit `df05c67` — FOUND in git log
- Build check: `cd backend && npm run build` → exit 0 (ran twice, after each task)
- Full backend suite: `cd backend && npm test` → 20 files / 128 tests passed, zero regression
- Seed check: `npm run seed` → ran clean, logged "EOC COTS sync: 1 record(s) synced, 1 conflict(s) detected."
- `## Known Stubs` section below: none blocking.

## Known Stubs

None found. `fetchExchangeRecords` is an intentional, explicitly-documented deterministic stub (no real WebEOC/Veoci/DisasterLAN vendor credential exists in this sandbox) — matching the exact same documented pattern as `gis-adapter.ts`/`hazard-feed-adapter.ts`/`cad-adapter.ts`, not an incomplete implementation. No `TODO`/`FIXME`/placeholder markers found in any file this plan created or modified (grep scan performed, only false-positive hit was a pre-existing SQL `placeholders` variable name in `seed.ts`, unrelated to this plan).

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*
