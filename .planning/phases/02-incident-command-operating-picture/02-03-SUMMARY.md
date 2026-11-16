---
phase: 02-incident-command-operating-picture
plan: 03
subsystem: integration-gateway
tags: [fastify, postgis, geojson, gis-adapter, schematic-fallback]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "incidents table with nullable location GEOGRAPHY(POINT,4326) column, incident-ops routes.ts shared route-registration file (02-01, 02-02)"
provides:
  - "gis_feed_status schema (exact TechArch 02d DDL)"
  - "fetchGisFeatures() / checkGisHealth() — F11's vendor-neutral GIS adapter stub, provenance-enforced"
  - "GET /api/v1/operating-picture/markers — incidents render as diamond MapMarkers with mandatory schematic-offline fallback on ANY GIS failure"
  - "GET /api/v1/operating-picture/layers — single incidents-overlay layer entry (Phase 2 scope)"
  - "GET /api/v1/integrations/gis/health — admin Integration Health passthrough read of gis_feed_status"
affects: ["02-07 (frontend operating-picture map page consumes these endpoints directly)", "Phase 3+ (facility/resource markers extend the same MapMarker[] array)"]

# Tech tracking
tech-stack:
  added: ["@types/geojson (devDependency, for GeoJSON.Feature typing in the adapter contract)"]
  patterns:
    - "Schematic-fallback-as-default-path: baseLayerSource/baseLayerAsOf are initialized to the degraded values BEFORE the GIS fetch is attempted, and only overwritten on a fully provenanced success — the fallback is structurally the default, not a catch-block afterthought"
    - "Test-only failure injection via an explicit, undocumented query param (force_gis_failure=true) lets both backend and future frontend e2e tests deterministically exercise the degraded path via a normal HTTP request, no mocking/restart required"

key-files:
  created:
    - backend/migrations/1700000000003_integration-geo-schema.js
    - backend/src/modules/integration-gateway/gis-adapter.ts
    - backend/src/modules/incident-ops/operating-picture.ts
    - backend/src/modules/incident-ops/operating-picture.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts
    - backend/src/modules/integration-gateway/routes.ts
    - backend/package.json

key-decisions:
  - "GIS adapter stub's only recognized layer_id is 'agency-base-boundary'; any other layer_id deterministically simulates a vendor timeout (GIS_FEED_TIMEOUT) — gives the integration test a reliable, no-mocking way to exercise the real adapter-throws path without random failure injection"
  - "gisHealthRoutes gated by requirePermission('admin','view') (not 'incidents') matching every other admin Integration Health-style route (record-authority.ts, api-clients.ts, federation-grants.ts) in this codebase"
  - "status_bar.as_of reduces to baseLayerAsOf alone for Phase 2 (no other provenanced layer exists yet) — documented inline as a TODO for F12/F17 to extend to a true stalest-across-all-visible-layers computation per FRD's rule"

patterns-established:
  - "MapMarker[]'s type discriminant ('incident' | 'facility' | 'resource' | 'shelter') lets later phases append facility/resource markers to the SAME response shape with no breaking change — operating-picture.ts only ever queries incidents today, documented inline as a Phase 2 scope boundary, not an oversight"

# Metrics
duration: 12min
completed: 2026-11-16
---

# Phase 2 Plan 03: GIS Adapter + Operating-Picture Markers/Layers Summary

**F11's provenance-enforced GIS adapter stub feeding F2's operating-picture markers endpoint, where the "Schematic base map, offline" fallback is the structural default code path — not a bolted-on catch block — so the page is incapable of 500ing even under total GIS outage.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-11-16T13:04:00Z
- **Completed:** 2026-11-16T13:16:00Z
- **Tasks:** 3
- **Files modified:** 7 (4 created, 3 modified)

## Accomplishments
- `gis_feed_status` table live with the exact TechArch 02d DDL (layer_id/vendor UNIQUE, last_fetch_status CHECK, can_publish)
- `fetchGisFeatures(layerId, bbox)` implements F11's approved adapter contract end-to-end: normalizes to `{layer_id, source, as_of, features}`, enforces mandatory `source`/`as_of` provenance before returning, and records `gis_feed_status` on every call (success, timeout, or provenance failure)
- `GET /api/v1/operating-picture/markers` assembles real incident data (diamond markers, severity-toned per the exact FRD Badge mapping) on top of a real-adapter-shaped base layer, with the fallback defaults assigned BEFORE the fetch attempt — structurally the default path, proven by a test that forces the adapter to throw and asserts 200 + the exact fallback string, not just an assumption
- `GET /api/v1/operating-picture/layers` returns the Phase-2-scoped single incidents-overlay layer entry
- `GET /api/v1/integrations/gis/health` surfaces `gis_feed_status` rows for the admin Integration Health view
- Integration test proves all 4 `<done>` assertions from the plan against the live compose stack: GIS success path naming the real adapter source, location-less incidents omitted (not broken), forced-failure degraded path still 200 with markers present, and health rows populated

## Task Commits

Each task was committed atomically:

1. **Task 1: gis_feed_status schema + GIS adapter stub (provenance-enforced)** - `edb6235` (feat)
2. **Task 2: Operating-picture markers/layers endpoint (schematic fallback as default path)** - `0f2bee1` (feat)
3. **Task 3: Integration test — real GIS success path AND forced-failure schematic fallback** - `c773c06` (test)

**Plan metadata:** (pending — see final commit below)

## Files Created/Modified
- `backend/migrations/1700000000003_integration-geo-schema.js` - `gis_feed_status` DDL (exact TechArch 02d)
- `backend/src/modules/integration-gateway/gis-adapter.ts` - `fetchGisFeatures()`, `checkGisHealth()`, `gisHealthRoutes` (GET /api/v1/integrations/gis/health)
- `backend/src/modules/incident-ops/operating-picture.ts` - GET /api/v1/operating-picture/markers + /layers, fallback-as-default-path pattern
- `backend/src/modules/incident-ops/operating-picture.test.ts` - integration test (supertest + real Postgres/OPA) covering success/omission/forced-failure/health
- `backend/src/modules/incident-ops/routes.ts` - mounted `operatingPictureRoutes` alongside 02-01/02-02's handlers
- `backend/src/modules/integration-gateway/routes.ts` - mounted `gisHealthRoutes`
- `backend/package.json` - added `@types/geojson` devDependency for `GeoJSON.Feature` typing in the adapter contract

## Decisions Made
- GIS adapter stub recognizes exactly one `layer_id` (`agency-base-boundary`); any other value deterministically simulates a vendor timeout, giving tests a reliable way to exercise the real throw path without random failure injection
- `GET /api/v1/integrations/gis/health` gated by `requirePermission('admin','view')`, matching every other admin Integration Health-style route in this codebase (not `'incidents'`)
- `status_bar.as_of` reduces to `baseLayerAsOf` alone for Phase 2 since no other provenanced layer exists yet — documented inline as a TODO for F12/F17's later extension to the FRD's true "stalest across all visible layers" rule

## Deviations from Plan

None - plan executed exactly as written. The one addition beyond the plan's literal text — installing `@types/geojson` as a devDependency — was required purely to make the plan's own specified `GeoJSON.Feature[]` type annotation compile; no behavior, schema, or scope change (Rule 3 - Blocking, trivially resolved, not worth a dedicated deviation entry since it has zero runtime effect).

## Issues Encountered
None — all three tasks' own `<verify>` commands passed as written, including the live-stack integration test (4/4 assertions) and the full existing 7-file/33-test backend suite (zero regressions).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `operating-picture.ts`'s markers/layers endpoints are live, tested, and structurally guaranteed to degrade gracefully — unblocking 02-07's frontend MapCanvas-based operating-picture page, which consumes these endpoints directly, including the `force_gis_failure=true` query param for its own e2e degraded-mode test.
- Carried-forward gap from 02-01/02-02 (T-02-03, still open, unaffected by this plan): `GET /api/v1/incidents` does not yet apply jurisdiction-scope filtering to ITS OWN results — this plan's markers query DOES apply `jurisdiction_id = ANY(req.epmpUser.jurisdiction_scope)` correctly, so the gap is scoped to the pre-existing incidents list endpoint only.
- This plan's own threat-model note (T-02-09, accepted): Phase 2 applies only base `jurisdiction_scope` filtering on markers, not full `federation_grants` expansion — a later phase extending cross-jurisdiction sharing must revisit this query.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

None found — scanned all created/modified files (migration, gis-adapter.ts, operating-picture.ts, routes.ts x2, operating-picture.test.ts) for TODO/FIXME/placeholder/not-implemented patterns. One hit: a single inline `TODO(Phase 3+)` comment in `operating-picture.ts` documenting the Phase-2-correct `status_bar.as_of` simplification (reduces to the single base layer's `as_of` since no other provenanced layer exists yet) — this is the plan's own explicitly-specified scope boundary, not an incomplete implementation; cosmetic, not blocking.

## Self-Check: PASSED

- All 4 created files confirmed present on disk
- All 3 task commits (edb6235, 0f2bee1, c773c06) confirmed in `git log`
- Build check: `cd backend && npm run build` (tsc -p tsconfig.json) → exit 0
- Full backend test suite (7 files, 33 tests, including this plan's 4) → all passed, zero regressions
- No blocking stubs found
