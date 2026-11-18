---
phase: 03-plans-tasks-resource-requests
plan: 09
subsystem: incident-ops
tags: [fastify, postgres, postgis, react, react-query, playwright, map-markers]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "operating-picture.ts's GET .../markers and .../layers endpoints with a generic MapMarker[] response shape and schematic-fallback try/catch; OperatingPicture.tsx rendering MapCanvas/MapPopup/MapLegend/LayerPanel"
  - phase: 03-plans-tasks-resource-requests
    provides: "03-04's resource_requests table/lifecycle API; 03-06's ResourceRequestDetail page and status tone vocabulary; 03-08's real Incident Workspace Resources tab (ResourceRequestList embed) as the realistic data-creation path this plan's own Playwright test uses"
provides:
  - "GET /api/v1/operating-picture/markers now includes a triangle marker (type:'resource') for every in-flight (non-Fulfilled/Declined) resource_request, toned by status and inheriting its linked incident's location"
  - "GET /api/v1/operating-picture/layers now exposes a second toggleable 'resource-requests' layer entry alongside 'incidents'"
  - "OperatingPicture.tsx renders/selects resource markers via MapPopup (facts + deep-link to ResourceRequestDetail), includes them in MapLegend, and filters markers per-type against each layer's own visibility toggle"
affects: ["phase-04 (reporting/F7 — the 'in reporting' half of success criterion 4 this plan deliberately left out of scope)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Marker-type-to-layer-id mapping object, filtering the single polled markers array per-type rather than gating the whole response on one layer's visibility"
    - "Thin-marker-object popup rendering: a resource marker's MapPopup needs no extra detail fetch (unlike the incident popup's GET /api/v1/incidents/{id}) since Task 1's marker shape already carries every fact the popup shows"

key-files:
  created:
    - frontend/app/e2e/operating-picture-resource-markers.spec.ts
  modified:
    - backend/src/modules/incident-ops/operating-picture.ts
    - frontend/app/src/pages/operating-picture/OperatingPicture.tsx

key-decisions:
  - "resourceStatusToTone's Draft case maps to 'brand' (not a 6th invented tone) since MapMarker's MarkerTone type has no 'neutral' entry — Fulfilled/Declined never reach this function since they're excluded from the query's WHERE clause entirely"
  - "Layer-visibility filtering fixed from Phase 2's single-layer-gates-everything logic to a per-marker-type->layer-id mapping, since a second real layer (resource-requests) now exists and the old logic would have incorrectly hidden resource markers whenever the unrelated 'incidents' layer was toggled off"
  - "Resource-marker popup renders directly from the thin marker object already in the polled markers array (no extra GET /api/v1/resource-requests/{id} fetch) — unlike the incident popup, which needs full detail (jurisdiction name, opened_at) the thin marker shape doesn't carry"

# Metrics
duration: 50min
completed: 2026-11-17
---

# Phase 3 Plan 09: Resource Requests on the Operating Picture Summary

**Operating-picture markers endpoint now unions incident (diamond) and in-flight resource-request (triangle) markers into the same generic array Phase 2 deliberately kept open for this extension; the frontend renders/selects both types with a type-specific MapPopup and a per-layer visibility toggle, proven end-to-end by a Playwright spec that creates a real resource request through the Incident Workspace, watches its marker's tone change on approval, and confirms it vanishes from the map once Fulfilled.**

## Performance

- **Duration:** 50 min
- **Completed:** 2026-11-17
- **Tasks:** 2
- **Files modified:** 2 modified, 1 created

## Accomplishments

- `operating-picture.ts`'s markers query extended with a second SQL query joining `resource_requests` to `incidents` (for location), excluding `Fulfilled`/`Declined` entirely, and mapped onto the SAME `markers` array as triangle-shaped, status-toned entries — zero response-shape change, exactly matching 02-03's stated design intent.
- `GET /api/v1/operating-picture/layers` gained a second `resource-requests` layer entry with its own live in-flight count, so `LayerPanel` can toggle resource markers independently of incident markers.
- `OperatingPicture.tsx`'s `MapPopup` now branches on `marker.type`: a resource selection renders facts + an "Open request" deep-link to `ResourceRequestDetail` straight from the thin marker object already in hand (no extra fetch), while an incident selection keeps its existing full-detail fetch.
- Fixed a latent Rule-1 bug in the same file: layer-visibility filtering previously gated the ENTIRE markers array on the single `'incidents'` layer's checked state — now each marker type maps to its own layer id, so toggling one layer off no longer silently hides the other type's markers.
- `MapLegend` gains a `'Resource request'` entry whenever a resource marker is present, closing 02-07's own documented Phase-2 TODO comment.
- New `operating-picture-resource-markers.spec.ts`: creates a real incident + resource request through the actual Incident Workspace Resources tab (03-08), asserts the triangle marker appears near its incident's own diamond marker, opens its popup, deep-links to the detail page, watches the popup's Badge tone flip from `Awaiting approval` to `Approved`, then confirms the marker disappears entirely once the request is marked `Fulfilled`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend operating-picture markers query with resource-request triangles** - `385a1af` (feat)
2. **Task 2: Render resource-request triangle markers on Operating Picture page + Playwright proof** - `3006c22` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `backend/src/modules/incident-ops/operating-picture.ts` — second query/mapping for resource-request triangle markers; second `resource-requests` layer entry
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` — type-branching `MapPopup`, per-type layer-visibility filtering, resource entry in `MapLegend`
- `frontend/app/e2e/operating-picture-resource-markers.spec.ts` — new Playwright spec, 3 tests, full lifecycle proof

## Decisions Made

- `resourceStatusToTone`'s `Draft` case maps to `'brand'` rather than inventing a 6th tone, since `MapMarker`'s `MarkerTone` type (danger/warning/info/success/brand) has no `'neutral'` entry the way `BadgeTone` does.
- Layer-visibility filtering generalized from a single hardcoded `'incidents'` check to a marker-type → layer-id map, since Phase 2's code had no second marker type to have gotten this wrong against.
- The resource popup intentionally does NOT fetch `GET /api/v1/resource-requests/{id}` — its facts (type/quantity/status) are fully present in the thin marker object already polled, unlike the incident popup which genuinely needs extra fields (jurisdiction name, opened_at) the thin shape doesn't carry.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Layer-visibility filter would have hidden resource markers behind the unrelated 'incidents' toggle**
- **Found during:** Task 2 (rendering resource markers on the page)
- **Issue:** `OperatingPicture.tsx`'s existing code gated the ENTIRE `apiMarkers` array on `layerVisibility['incidents']` alone — a hardcoded Phase-2 assumption that held only because `'incidents'` was the only real layer that existed. Once a second real layer (`'resource-requests'`) and marker type existed, toggling `'incidents'` off would have incorrectly also hidden every resource marker, and there was no way to toggle resource markers independently at all.
- **Fix:** Replaced the single-layer check with a `MARKER_TYPE_TO_LAYER_ID` map (`incident`→`'incidents'`, `resource`→`'resource-requests'`) and filtered `apiMarkers` per-marker against its own mapped layer's visibility.
- **Files modified:** `frontend/app/src/pages/operating-picture/OperatingPicture.tsx`
- **Verification:** Full e2e suite (51 tests across 11 spec files) passes, including both the pre-existing `operating-picture.spec.ts` (incident-only assertions, unaffected) and the new resource-marker spec exercising both layer toggles implicitly via the markers' own visibility.
- **Committed in:** `3006c22` (Task 2 commit)

**2. [Rule 3 - Blocking] First Playwright run failed: test 3 signed in as the wrong identity**
- **Found during:** Task 2 (writing/running the new Playwright spec)
- **Issue:** Test 3 initially called `signInAsIncidentCommander(page)` followed immediately by `signInAsPlanningChief(page)` — but `signInAs()`'s redirect-to-Keycloak wait only fires when no session token is yet in `sessionStorage`. With an already-resolved commander session, the second call never redirected at all, timing out waiting for the Keycloak login page and leaving the test running as the WRONG identity (commander, who lacks the `resource_requests:approve` permission this test needs).
- **Fix:** Removed the redundant first `signInAsIncidentCommander` call — test 3 only ever needs the planning-chief identity to approve.
- **Files modified:** `frontend/app/e2e/operating-picture-resource-markers.spec.ts`
- **Verification:** Re-ran the spec twice consecutively after the fix; all 3 tests passed both times.
- **Committed in:** `3006c22` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 Rule 1 bug, 1 Rule 3 blocking), both confined to this plan's own new/modified files.
**Impact on plan:** Both fixes were necessary for correctness (the layer-filter bug would have shipped a real functional regression; the test-identity bug would have shipped a flaky/incorrect test). No scope creep.

## Known Stubs

None found. Scanned all three changed files for `TODO|FIXME|placeholder|not.?implemented|coming soon`; the only hits are a pre-existing Phase-2 `TODO(Phase 3+)` comment about `status_bar.as_of` reduction (unrelated to this plan, left untouched per its own documented scope), a pre-existing "structural placeholders" comment about `MapControls`' non-functional zoom (Phase 2, unrelated), and a legitimate HTML `placeholder="YYYY-MM-DD"` input attribute (not a stub).

## Issues Encountered

None beyond the two auto-fixed deviations above, both resolved within this plan's own scope.

## Full Regression Check

- Backend: `npx tsc --noEmit` clean; full backend test suite 11 files / 55 tests passed (one run hit the pre-existing documented flaky `eventbus.test.ts` cross-test-file NATS race; re-run confirmed 55/55 green, consistent with the note's guidance not to spend fix attempts on it).
- Frontend: `design-system` build clean, `app` build clean, `design-system` unit tests 5 files / 46 tests passed.
- Full Playwright e2e suite: **51 tests across 11 spec files, all green** — this plan's own new 3 tests plus zero regressions across every pre-existing spec (operating-picture.spec.ts, tasks-resources.spec.ts, plan-to-task-materialization.spec.ts, plans.spec.ts, incident-workspace.spec.ts, incident-list-create.spec.ts, app-shell.spec.ts, admin-*.spec.ts, contrast-audit.spec.ts).

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

Success criterion 4's full text ("...with its current status visible on both the operating picture and in reporting without a page reload") now has its "operating picture" clause genuinely built and tested end-to-end. The "in reporting" clause remains correctly out of this phase's scope, deferred to Phase 4 (F7/reporting) per the roadmap — not claimed as satisfied here.

This is the terminal plan for Phase 3 (wave 7, no further plans depend on it). Phase 3 (Plans, Tasks & Resource Requests) is now fully complete: all 9 plans (03-01 through 03-09) done.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Self-Check: PASSED

- Files: `backend/src/modules/incident-ops/operating-picture.ts`, `frontend/app/src/pages/operating-picture/OperatingPicture.tsx`, `frontend/app/e2e/operating-picture-resource-markers.spec.ts` all confirmed present on disk.
- Commits: `385a1af` (Task 1) and `3006c22` (Task 2) both confirmed present via `git log --oneline --all`.
- Build check: `cd backend && npx tsc --noEmit` → exit 0; `cd frontend/design-system && npm run build` → exit 0; `cd frontend/app && npm run build` → exit 0.
- Known Stubs section present above; no entry classified blocking.
