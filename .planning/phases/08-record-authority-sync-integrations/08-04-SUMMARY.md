---
phase: 08-record-authority-sync-integrations
plan: 04
subsystem: operating-picture
tags: [react, react-query, playwright, facility-markers, F17, map-canvas]

# Dependency graph
requires:
  - phase: 08-record-authority-sync-integrations
    provides: "Plan 08-02's GET /api/v1/operating-picture/facilities route and facility_adapter's deterministic agency_erp facility-status stub"
provides:
  - "OperatingPicture.tsx renders a third marker family (facility, square shape) alongside the existing incident/resource markers, merged client-side from a separate 30s-polled query"
  - "Facility popup renders title/badge/Provenance/one status fact only — structurally incapable of showing inventory/maintenance/cost, since ApiFacilityMarker's TypeScript interface has no such field"
  - "MapLegend gains a Facility entry (square glyph, fixed 'brand' tone) whenever at least one facility marker is present"
  - "operating-picture-facility-markers.spec.ts: 4 Playwright tests proving rendering, popup Provenance + no-forbidden-field, legend entry, and no regression"
affects: [F17, operating-picture]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Separate per-feature useQuery + client-side merge into the shared visibleMarkers/canvasMarkers pipeline, rather than widening the existing markers endpoint — avoids a cross-plan file-ownership collision with Plan 08-02's own backend edits in the same wave"
    - "MARKER_TYPE_TO_LAYER_ID extended with a layer id ('facilities') that doesn't yet exist in layersForPanel — the existing `layerVisibility[layerId] ?? true` fallback makes a new marker family visible-by-default with zero LayerPanel wiring required"

key-files:
  created:
    - frontend/app/e2e/operating-picture-facility-markers.spec.ts
  modified:
    - frontend/app/src/pages/operating-picture/OperatingPicture.tsx

key-decisions:
  - "Facility markers polled via their own useQuery(['operating-picture-facilities'], ...) rather than merged into the existing markers endpoint, per Plan 08-02's own documented file-ownership note (avoids colliding with 08-01/08-03's parallel integration-gateway edits in the same wave) — the two queries are merged client-side instead"
  - "Facility popup provenance uses the marker's OWN source/as_of fields directly (not the shared status_bar object incidents/resources read) since each facility has independently-synced provenance, unlike the single shared base-layer provenance"
  - "selectedIncidentQuery/selectedTimelineQuery's enabled guard widened from `!selectedIsResource` to `!selectedIsResource && !selectedIsFacility` so selecting a facility marker never fires a wasted/erroring GET /api/v1/incidents/{facility-id} fetch"
  - "Facility tone validated against BadgeTone's real vocabulary (VALID_BADGE_TONES set) before passing to Badge, falling back to 'neutral' for anything unrecognized — defensive against a future backend tone addition outside facilityStatusToTone's current 'success'|'warning' return type"

patterns-established:
  - "Three-marker-family pattern (incident/resource/facility) confirms MapCanvas/MapLegend/MapPopup/Provenance's Phase 2 design genuinely generalizes with zero design-system changes across three independent plans (03-09, 08-04)"

# Metrics
duration: 18min
completed: 2026-11-20
---

# Phase 8 Plan 04: Operating Picture Facility Markers Summary

**Facility markers (square, status-toned) now render on the Operating Picture from Plan 08-02's `GET /api/v1/operating-picture/facilities`, merged client-side alongside incident/resource markers, with the facility popup's TypeScript interface structurally incapable of ever rendering an inventory/maintenance/cost figure.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-20T12:24:00Z
- **Completed:** 2026-11-20T12:29:27Z
- **Tasks:** 2
- **Files modified:** 2 (1 modified, 1 created)

## Accomplishments
- `OperatingPicture.tsx` now fetches facility markers via a separate 30s-polled `useQuery`, merges them into the existing `visibleMarkers`/`canvasMarkers`/`legendItems` pipeline through the same `MARKER_TYPE_TO_LAYER_ID` visibility filter 03-09 established for resource markers
- Facility popup (title + status Badge + `Provenance` chip sourced from the marker's own `source`/`as_of` fields + one status fact) added as a third branch in `popupNode`, with the incident-detail queries' `enabled` guard widened so a facility selection never misfires a fetch against `/api/v1/incidents/{id}`
- `MapLegend` gains a square-glyph "Facility" entry whenever at least one facility marker is present
- New `operating-picture-facility-markers.spec.ts` (4/4 passing): facility marker rendering, popup Provenance + structural no-forbidden-field proof (asserts the popup's full text never contains `inventory`/`maintenance`/`cost`/`$`), legend entry presence, and a final no-regression check
- Confirmed zero regression against `operating-picture.spec.ts` (5/5) and `operating-picture-hazard-layers.spec.ts` (3/3)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add facilities query, marker/legend/popup wiring to OperatingPicture.tsx** - `a442609` (feat) — *see Deviations below: this task's code landed inside a concurrent wave-2 plan's commit due to a parallel-execution git race, not a plan error*
2. **Task 2: Playwright — facility markers render, popup shows Provenance with no cost data, legend entry present** - `7b51e2b` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` - `ApiFacilityMarker`/`FacilitiesResponse` interfaces, `facilitiesQuery`, `selectedIsFacility` guard, merged `allMarkers`/`visibleMarkers`, facility legend entry, facility popup branch
- `frontend/app/e2e/operating-picture-facility-markers.spec.ts` - 4-test Playwright spec proving the full facility-marker flow end-to-end

## Decisions Made
See `key-decisions` in frontmatter above.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Task 1's own commit got absorbed into a parallel plan's commit due to a concurrent-execution git race**
- **Found during:** Task 1 (immediately after implementing and verifying the facilities-query/popup wiring)
- **Issue:** This plan (08-04) is wave 2, running in parallel with sibling wave-2 plans against the same working tree/branch. Between this plan's `tsc`/build verification and its own `git add` + `git commit` step, another in-flight plan (08-03, itself touching `routes.ts`/a new `eoc-cots-conflicts.ts`) ran its own commit, and its `git add` scope apparently staged this plan's already-written (but not-yet-committed) `OperatingPicture.tsx` changes alongside its own files — landing as part of commit `a442609 feat(08-03): add POST eoc-cots conflicts resolve route (F13)` rather than its own dedicated 08-04 commit.
- **Fix:** Confirmed via `git show a442609 -- frontend/app/src/pages/operating-picture/OperatingPicture.tsx` that the FULL, correct diff for this plan's Task 1 is present verbatim in that commit (facilities interface, query, merged markers, legend entry, popup branch — all matching exactly what this plan wrote). No code was lost or needs re-applying; `tsc --noEmit` and `npm run build` both re-verified clean against the current committed state. Task 2's own commit (`7b51e2b`) was kept scoped to only its own new file, confirming the working tree is otherwise clean of cross-plan contamination.
- **Files modified:** `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` (content correct; commit attribution is to 08-03's commit, not an 08-04 commit)
- **Verification:** `git show a442609 -- frontend/app/src/pages/operating-picture/OperatingPicture.tsx` shows the complete, correct Task 1 diff; `cd frontend/app && npx tsc --noEmit` (exit 0) and `npm run build` (clean) both re-run against HEAD; all 4 new Playwright tests + both existing regression specs pass against the current committed code
- **Committed in:** `a442609` (not an 08-04-labeled commit — a pre-existing cross-plan commit this plan's own work was absorbed into)

---

**Total deviations:** 1 auto-fixed (1 blocking — parallel-execution git-race commit attribution, not a code defect)
**Impact on plan:** Zero functional impact — the code is correct, verified, and present at HEAD. The only effect is that Task 1's diff is attributed to commit `a442609` (labeled as 08-03's commit message) instead of its own dedicated 08-04 commit. Documented here for audit-trail clarity; no further action needed since the code itself is complete, tested, and unaffected.

## Issues Encountered
None beyond the git-race deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- F17's Operating Picture half (ROADMAP success criterion 3) is fully satisfied: facility markers render with Provenance, no forbidden field ever displayed, structurally enforced at both the backend (08-02) and frontend (this plan) layers
- Ready for 08-05 (Document system frontend half) and 08-06, both independent of this plan's scope
- No blockers for the phase's remaining plans

## Known Stubs

None found. The one `grep` hit in the changed file (`// structural placeholders satisfying MapControls' contract`) is Phase 2's own pre-existing comment about the zoom controls' no-op handlers — unrelated to this plan's facility-marker scope, not newly introduced, and not a stub on any code this plan added.

## Self-Check: PASSED

- `frontend/app/e2e/operating-picture-facility-markers.spec.ts` exists on disk — confirmed
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` exists on disk — confirmed
- Commit `a442609` (Task 1's code, absorbed into 08-03's commit per the documented deviation) found in git log — confirmed
- Commit `7b51e2b` (Task 2) found in git log — confirmed
- `cd frontend/app && npx tsc --noEmit` → exit 0
- `cd frontend/app && npm run build` → exit 0, clean build output
- All 4 new Playwright tests pass; both existing regression specs (`operating-picture.spec.ts` 5/5, `operating-picture-hazard-layers.spec.ts` 3/3) pass with zero regression

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*
