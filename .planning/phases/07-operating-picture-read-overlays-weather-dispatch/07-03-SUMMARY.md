---
phase: 07-operating-picture-read-overlays-weather-dispatch
plan: 03
subsystem: ui
tags: [operating-picture, layer-panel, provenance, hazard-feeds, playwright, react, design-system]

# Dependency graph
requires:
  - phase: 07-operating-picture-read-overlays-weather-dispatch
    provides: "Plan 07-01's GET /api/v1/operating-picture/layers hazard-<feed> entries (hazard_layers table, syncHazardLayersFromEvents)"
provides:
  - "Confirmed OperatingPicture.tsx's existing ApiLayer/LayersResponse types and layersForPanel mapping are fully generic over any backend layer id -- zero widening needed for hazard-* entries"
  - "Documented MARKER_TYPE_TO_LAYER_ID structurally never needs a hazard entry (hazard layers are LayerPanel-only rows, no point marker)"
  - "Playwright proof (operating-picture-hazard-layers.spec.ts) that LayerPanel/Provenance render hazard layers dashed-Unverified, off by default, and stay dashed even when toggled on"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Zero-new-UI-code feature delivery: a generically-written frontend data-plumbing layer (layersForPanel) absorbs an entirely new layer family (F12 hazard/weather) with no component changes, only a confirming Playwright proof"

key-files:
  created:
    - frontend/app/e2e/operating-picture-hazard-layers.spec.ts
  modified:
    - frontend/app/src/pages/operating-picture/OperatingPicture.tsx

key-decisions:
  - "No TypeScript interface widening was needed: ApiLayer/LayersResponse already matched the backend's hazard-<feed> entry shape (id/label/source/as_of/verified/count/checked) exactly, confirming Plan 07-01's backend author correctly matched this page's pre-existing generic contract rather than inventing a new field name"
  - "MARKER_TYPE_TO_LAYER_ID intentionally gets no hazard entry -- documented inline as a structural property (F12 hazard layers are LayerPanel-only overlay rows, never a canvasMarkers point), not an oversight"

# Metrics
duration: 18min
completed: 2026-11-20
---

# Phase 7 Plan 3: Operating Picture Hazard-Layer Frontend Wiring Summary

**Confirmed (not rebuilt) that OperatingPicture.tsx's existing generic `layersForPanel` mapping and `LayerPanel`/`Provenance` design-system components already satisfy F12's hazard/weather overlay requirement with zero new UI code; added a Playwright spec proving the dashed-Unverified treatment survives a toggle-on.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-20T10:05:00Z (approx.)
- **Completed:** 2026-11-20T10:23:00Z
- **Tasks:** 2 completed
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments
- Verified by direct inspection that `OperatingPicture.tsx`'s `ApiLayer`/`LayersResponse` TypeScript interfaces and `layersForPanel` mapping require **zero** code change to consume Plan 07-01's new `hazard-<feed>` layer entries — the mapping was already written generically over any backend layer id.
- Confirmed (via `docker exec` query against the live compose-stack database) that Plan 07-01's seed fixtures produced exactly the expected data: NOAA (43 events), NWS (6 events), USGS (6 events) hazard layers, all with `verified = false`.
- Added a documenting inline comment at `MARKER_TYPE_TO_LAYER_ID`'s definition making explicit why hazard layers never need an entry there (they're LayerPanel-only rows, never a point marker).
- New Playwright spec (`operating-picture-hazard-layers.spec.ts`, 3 tests) proves, against the real backend:
  1. A hazard layer row renders unchecked by default with the `.ep-provenance--unverified` dashed treatment and literal "Unverified" text.
  2. Toggling that row's checkbox ON keeps the identical dashed-Unverified treatment visible — the single assertion that structurally proves `verified` is sourced only from the backend response, never mutated by `handleLayerToggle` (which only ever writes to the separate `layerVisibility` state).
  3. The Operating Picture page (map canvas, status bar, pre-existing `Incidents` layer row) renders unaffected alongside the new hazard rows in the same `LayerPanel` list.

## Task Commits

Each task was committed atomically:

1. **Task 1: Confirm/extend OperatingPicture.tsx's layer plumbing for hazard rows** - `3a0c95c` (docs)
2. **Task 2: Playwright — hazard layers render dashed-Unverified, toggle-on preserves dashed treatment** - `bd0028e` (test)

**Plan metadata:** (this commit, docs)

## Files Created/Modified
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` - Added one documenting inline comment at `MARKER_TYPE_TO_LAYER_ID`; no functional change (the mapping was already generic)
- `frontend/app/e2e/operating-picture-hazard-layers.spec.ts` - New Playwright spec (3 tests) proving hazard-layer rendering, dashed-Unverified-on-toggle, and no-regression

## Decisions Made
- No TypeScript interface widening needed — `ApiLayer`/`LayersResponse` already matched the backend's `hazard-<feed>` entry shape field-for-field, confirming the two plans' independently-authored contracts aligned exactly.
- `MARKER_TYPE_TO_LAYER_ID` intentionally gets no hazard entry, documented inline as a structural property (hazard layers are LayerPanel-only rows) rather than an oversight a future reader might "fix."

## Deviations from Plan

None - plan executed exactly as written. Task 1's own instructions anticipated (correctly) that the existing frontend code might need zero structural change — this was confirmed true by direct inspection, and the only code change made was the documented inline comment the plan's own Task 1 explicitly requested.

## Issues Encountered

None. The compose stack (Postgres/Keycloak/NATS/OPA) and both the Vite dev server and backend (`tsx watch`) were already running in this sandbox from prior plans' sessions in the same wave — no server startup or env configuration was needed before running `tsc`, the build, or Playwright.

One unrelated, pre-existing uncommitted change was found in the working tree (`frontend/app/src/pages/admin/IntegrationHealth.tsx`, likely a leftover from the parallel Plan 07-02's session) — left untouched and unstaged, out of this plan's scope per the deviation rules' scope boundary.

## User Setup Required

None - no external service configuration required. This plan adds no new backend dependency; it consumes Plan 07-01's existing deterministic stub adapter.

## Next Phase Readiness

- ROADMAP success criterion 1 (toggleable hazard layers, source/as-of via Provenance, unverified layers stay dashed even when toggled on) is fully satisfied end-to-end.
- Both `tsc --noEmit` and `npm run build` (frontend/app) pass clean.
- New spec (3/3) and the existing `operating-picture.spec.ts` (5/5) regression-pass with zero impact.
- No blockers for Phase 7's remaining plans or the phase's post-wave gate.

---
*Phase: 07-operating-picture-read-overlays-weather-dispatch*
*Completed: 2026-11-20*

## Self-Check: PASSED
