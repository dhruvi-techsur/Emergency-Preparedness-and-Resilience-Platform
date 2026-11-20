---
phase: 07-operating-picture-read-overlays-weather-dispatch
plan: 01
subsystem: integration-gateway
tags: [hazard-feeds, noaa, nws, usgs, integration-health, provenance, operating-picture, fastify, postgres]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-governance-signal-triage
    provides: hazard_feed_config/hazard_feed_events tables (1700000000011) and clusterHazardFeedEvents() seed fixtures this plan promotes into hazard_layers
provides:
  - "hazard_layers table (verified/verified_by/verified_at with chk_verified_requires_user)"
  - "hazard-feed-adapter.ts: fetchHazardFeedEvents, runHazardFeedIngestion, syncHazardLayersFromEvents, hazardFeedRoutes, startHazardFeedIngestionScheduler"
  - "GET /api/v1/operating-picture/layers extended with hazard-<feed> entries (additive, no response-shape change)"
  - "GET /api/v1/integrations/hazard-feeds/health + POST /api/v1/hazard-layers/:id/verify"
  - "FIRST adapter in this codebase writing directly into the shared integration_health table"
affects: [07-02-cad-911-dispatch, 07-03-operating-picture-frontend-layerpanel]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Deterministic adapter stub: exactly one recognized input (feed_name='NOAA') simulates a live vendor success; everything else deterministically throws, mirroring gis-adapter.ts's KNOWN_LAYER_ID pattern exactly"
    - "Shared integration_health UPSERT on system_name, reusing the SAME table every future adapter (07-02's CAD, future F13/F14/F16/F17) writes into — no per-adapter health table reinvented"
    - "Per-adapter job_type isolation in background_jobs: this plan's 'feed_ingestion' is exclusively this adapter's own bookkeeping row, never shared with 07-02's distinct 'cad_ingestion' value"

key-files:
  created:
    - backend/migrations/1700000000012_hazard-layers-schema.js
    - backend/src/modules/integration-gateway/hazard-feed-adapter.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/server.ts
    - backend/src/modules/incident-ops/operating-picture.ts
    - backend/src/modules/incident-ops/operating-picture.test.ts
    - backend/scripts/seed.ts

key-decisions:
  - "No migration renumbering needed — ls backend/migrations confirmed 1700000000012 was free (highest existing was Phase 6's 1700000000011) at execution time; Plan 07-02 (parallel Wave-1 plan) has since independently claimed 1700000000013 for its own cad-dispatch-schema migration, confirming the renumbering precedent documents a real, recurring risk even when this plan itself didn't hit it"
  - "recordFeedHealth's UPSERT keys on integration_health.system_name (its own UNIQUE constraint from 01-01), writing '<feed_name> Hazard Feed' as the natural identity — matches the exact convention 07-02's cad-adapter.ts independently also adopted for its own 'CAD/911 Dispatch' row, confirming this is the right shared-table idiom for every future F13-F17 adapter"
  - "runHazardFeedIngestion's background_jobs bookkeeping is scoped EXCLUSIVELY to job_type='feed_ingestion' — proven both structurally (grep against this file) and at runtime (this plan's own cross-adapter integration test, which successfully resolved 07-02's cad-adapter.js since that plan had already executed in this same sandbox by the time this plan's Task 3 ran)"

# Metrics
duration: 25min
completed: 2026-11-20
---

# Phase 7 Plan 1: Hazard-Feed Adapter + Operating-Picture Layers Summary

**Deterministic NOAA/NWS/USGS hazard-feed adapter stub (`KNOWN_LIVE_FEED = 'NOAA'`) that writes directly into the shared `integration_health` table for the first time in this codebase, promotes `hazard_feed_events` into provenance-tagged `hazard_layers` rows (unverified by default), and appends `hazard-<feed>` entries onto the existing `GET /api/v1/operating-picture/layers` response.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-20T09:30:00Z (approx.)
- **Completed:** 2026-11-20T09:55:19Z
- **Tasks:** 3 completed
- **Files modified:** 7 (2 created, 5 modified)

## Accomplishments
- `hazard_layers` migration (1700000000012) applies cleanly against Phase 6's existing `hazard_feed_config`/`hazard_feed_events` tables, with `chk_verified_requires_user` structurally enforcing "verified=true always has a named verifier."
- `hazard-feed-adapter.ts` mirrors `gis-adapter.ts`'s exact recognized-vs-unrecognized trigger shape: `fetchHazardFeedEvents('NOAA')` succeeds with provenance-complete synthetic events; any other feed name deterministically throws `HAZARD_FEED_UNREACHABLE`.
- `recordFeedHealth` is the first adapter in this codebase to UPSERT directly into `integration_health` (confirmed via a pre-task grep returning nothing) — `runHazardFeedIngestion()` now gives the admin Integration Health screen its first real, deterministically-flippable rows.
- `GET /api/v1/operating-picture/layers` appends one `hazard-<feed>` entry per active feed with ≥1 ingested event, each reporting `verified`/`checked` as `false` unless every constituent event has been explicitly verified — never silently promoted.
- `POST /api/v1/hazard-layers/:id/verify` enforces caller-identity equality (`verified_by !== req.epmpUser!.id` → 403 `VERIFICATION_REQUIRES_NAMED_USER`), mirroring `notifications.ts`'s `APPROVER_MISMATCH` pattern exactly.
- `background_jobs` bookkeeping for this adapter is scoped exclusively to `job_type='feed_ingestion'`, proven both structurally (grep) and at runtime (this plan's own test exercises Plan 07-02's already-landed `cad-adapter.ts` and confirms zero cross-contamination of the two adapters' rows).

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration + hazard-feed-adapter.ts** - `3fa0d95` (feat)
2. **Task 2: Wire hazard layers into GET /layers + seed.ts promotion** - `51ed05f` (feat)
3. **Task 3: Integration tests** - `2aa8716` (test)

**Plan metadata:** (this commit, docs)

## Files Created/Modified
- `backend/migrations/1700000000012_hazard-layers-schema.js` - net-new `hazard_layers` table only
- `backend/src/modules/integration-gateway/hazard-feed-adapter.ts` - adapter stub, ingestion job, idempotent promotion, health/verify routes, scheduler
- `backend/src/modules/integration-gateway/routes.ts` - registers `hazardFeedRoutes` alongside `gisHealthRoutes`
- `backend/src/server.ts` - calls `startHazardFeedIngestionScheduler()` inside the same graceful-degradation try/catch as the other schedulers
- `backend/src/modules/incident-ops/operating-picture.ts` - `GET /layers` calls `syncHazardLayersFromEvents()` then aggregates per-feed hazard layer entries
- `backend/src/modules/incident-ops/operating-picture.test.ts` - 7 new integration tests (hazard-feed adapter + layers + integration-health + verify + cross-adapter isolation)
- `backend/scripts/seed.ts` - calls `syncHazardLayersFromEvents()` + `runHazardFeedIngestion()` once after hazard_feed_events fixtures

## Decisions Made
- No migration renumbering needed for this plan's own file (1700000000012 was free); Plan 07-02 (parallel Wave-1) independently claimed 1700000000013 for its own migration, confirming both plans correctly avoided collision via the established "check `ls backend/migrations` first" convention.
- `recordFeedHealth`'s UPSERT natural key (`system_name = '<feed> Hazard Feed'`) matches the same idiom 07-02's `cad-adapter.ts` independently adopted (`'CAD/911 Dispatch'`), validating this as the correct shared convention for every future integration-health-writing adapter.
- `job_type='feed_ingestion'` isolation from 07-02's `'cad_ingestion'` was provable at RUNTIME (not just via static grep) because 07-02 had already executed in this shared sandbox by the time this plan's Task 3 ran — the cross-adapter integration test's `import('../integration-gateway/cad-adapter.js')` resolved successfully and the assertion ran for real.

## Deviations from Plan

None - plan executed exactly as written. No Rule 1-4 deviations were needed; every must-have and artifact matched the plan's literal spec on first implementation.

## Issues Encountered

None. The compose stack (Postgres/NATS/OPA/Keycloak) was already running in this sandbox from a prior session; `DATABASE_URL`/`OPA_URL`/etc. were already present in the repo's own `.env` (sourced via `set -a; source .env; set +a` before every migrate/build/test/seed invocation — no new env configuration was needed).

## User Setup Required

None - no external service configuration required. This plan's adapter is a deterministic in-sandbox stub with no real NOAA/NWS/USGS vendor credential.

## Next Phase Readiness

- Plan 07-03 (Operating Picture frontend `LayerPanel` wiring) now has a real, stub-backed `hazard-<feed>` layers feed to render, with `verified`/`checked`/`source`/`as_of`/`count` all populated per feed.
- The admin Integration Health screen (built in Phase 1) now has its first real rows — `NOAA Hazard Feed` (online), `NWS Hazard Feed`/`USGS Hazard Feed` (offline) — immediately after `npm run seed`, satisfying Phase 7's roadmap success criterion 4 ("hazard feed appears in integration-health, deterministically flippable").
- No blockers. Full backend suite (19 files, 114 tests) green with zero regression; `npm run build` and `npm run seed` both clean.

---
*Phase: 07-operating-picture-read-overlays-weather-dispatch*
*Completed: 2026-11-20*

## Self-Check: PASSED
