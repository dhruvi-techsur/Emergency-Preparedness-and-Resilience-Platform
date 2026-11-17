---
phase: 02-incident-command-operating-picture
plan: 07
subsystem: ui
tags: [react, react-router, tanstack-query, maps, playwright, design-system]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "GET /api/v1/operating-picture/markers and /layers (02-03), MapCanvas/MapControls/LayerPanel/MapLegend/MapPopup/Provenance (02-04), /incidents/:id route + Timeline query pattern (02-06)"
provides:
  - "frontend/app/src/pages/operating-picture/OperatingPicture.tsx — routed /operating-picture, S2.1 map screen"
  - "projectToPercent() — client-side lat/lng -> MapCanvas x/y percent projection, bbox derived from the current marker set"
  - "'Monitor' SideNav group ('Operating picture' item) in GET /api/v1/me/nav-config"
  - "frontend/app/e2e/operating-picture.spec.ts — 5-assertion Playwright suite including the degraded-mode proof"
affects: []

# Tech tracking
tech-stack:
  added: ["pg/@types/pg as frontend/app devDependencies (test-only: direct Postgres access to seed a located incident, no API/UI path sets that nullable column)"]
  patterns:
    - "Status bar text and MapCanvas's offline prop both derived from the SAME backend status_bar.base_layer_source string (never independently tracked) — they cannot disagree"
    - "force_gis_failure test-only query param threaded from window.location.search straight through to the markers fetch URL, with zero user-facing control ever exposing it"
    - "Per-incident popup detail (severity/jurisdiction/activation/opened-at) fetched lazily via GET /api/v1/incidents/{id} only for the currently-selected marker, rather than widening the markers endpoint's thin per-marker shape for data only the popup needs"

key-files:
  created:
    - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
    - frontend/app/src/pages/operating-picture/OperatingPicture.css
    - frontend/app/e2e/operating-picture.spec.ts
  modified:
    - backend/src/modules/auth-org/routes.ts
    - frontend/app/src/main.tsx
    - frontend/app/package.json

key-decisions:
  - "Route /operating-picture added to frontend/app/src/main.tsx (not AppShell.tsx) — consistent with 02-05/02-06's already-established convention that main.tsx owns the nested route tree while AppShell.tsx is layout/chrome only; the plan's frontmatter named AppShell.tsx but the actual wiring point matches the codebase's real structure"
  - "'Operating picture' nav item reuses the exact same incidents:view-gated hasIncidents check as the 'Activate' group, in its own separate 'Monitor' SideNav group per the UX mockup's Navigation Map — no new feature-permission string invented since the FRD doesn't name one"
  - "Popup fetches the selected incident's fuller detail via the existing GET /api/v1/incidents/{id} rather than widening operating-picture.ts's thin MapMarker shape — keeps the polled markers response small regardless of popup state"

patterns-established:
  - "projectToPercent(lat, lng, bbox) colocated in the page file, not the design system — this bbox-derived linear approximation is explicitly documented as what a real MapLibre/Leaflet/ArcGIS JS integration's own screen-coordinate output would replace, once a map-engine license/tile-server credential exists"

# Metrics
duration: 25min
completed: 2026-11-16
---

# Phase 2 Plan 07: Operating Picture (S2.1) Summary

**Operating Picture map screen composing 02-04's MapCanvas/MapControls/LayerPanel/MapLegend/MapPopup family over 02-03's markers/layers endpoints, where the status bar text and MapCanvas's `offline` prop are both derived from the identical backend `status_bar.base_layer_source` string so the page cannot show a GIS outage in one place while claiming normalcy in the other — proven end-to-end by a Playwright test that forces the GIS feed to fail and asserts the page keeps rendering real incident markers.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-16T14:00:00Z (approx)
- **Completed:** 2026-11-16T14:25:00Z
- **Tasks:** 2
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments

- `OperatingPicture.tsx` renders the exact S2.1 layout: `MapCanvas` at 2fr/1fr (≈8/12 columns) with `MapControls` (`topRight`, wired to toggle `LayerPanel`), `MapLegend` (`bottomLeft`, derived from the currently-rendered marker tones only), `MapPopup` (on marker selection, with severity `Badge` + 2-3 facts + `Provenance` + deep-link "Open incident" action), and the exact status-bar string format `"As of HH:MM ET · Base layer: {source}"`
- `projectToPercent(lat, lng, bbox)` — a documented linear approximation (no Mercator correction) projecting incident lat/lng onto `MapCanvas`'s 0-100 `x`/`y` percent space, with `bbox` computed from the current marker set's own min/max + padding (falling back to a wide CONUS-ish default when there are zero markers)
- Status bar text and `MapCanvas`'s `offline` prop are both derived from the exact same `status_bar.base_layer_source` string the backend returns — structurally impossible to disagree, satisfying this plan's first `must_haves.truths` entry
- `force_gis_failure=true` test-only query param read from `window.location.search` and threaded through to the markers fetch URL — never exposed in any user-facing control, documented inline
- Popup close handler stores `document.activeElement` on marker selection and restores focus to it on close, satisfying `MapPopup`'s documented caller-contract (same pattern `Modal`/02-06 used)
- Right column: selected incident's `Timeline` (same query pattern `IncidentWorkspace.tsx` uses) + a Tasks `EmptyState` placeholder when selected; an "Select an incident" `EmptyState` otherwise
- `LayerPanel`'s single Phase-2 "Incidents" layer toggles the entire marker set on/off immediately (no save step), per `LayerPanel`'s own no-`onSave`-prop structural contract
- "Monitor" SideNav group with "Operating picture" added to `GET /api/v1/me/nav-config`, gated by the same `incidents:view` permission check (`hasIncidents`) the "Activate" group already uses
- `/operating-picture` route registered in `main.tsx` (02-05/02-06's established route-tree location, not `AppShell.tsx`)
- All 5 Playwright assertions in `operating-picture.spec.ts` pass against the live compose stack: reachability + keyboard-focusable marker, exact status-bar format, popup open + severity Badge + deep-link navigation, popup-close focus-return, and — the single most important check in this plan — the degraded-mode proof: `force_gis_failure=true` still renders the page, shows the exact "Schematic base map, offline" status string, and keeps the incident marker visible and clickable
- Full backend suite (7 files, 33 tests), design-system suite (5 files, 46 tests), and all 4 pre-existing Playwright suites (17 assertions: admin-users-roles, app-shell, incident-list-create, incident-workspace) re-run clean after this plan's changes — zero regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Operating Picture page (map, controls, layer panel, popup, status bar)** - `deca4e5` (feat)
2. **Task 2: AppShell wiring + Playwright coverage (including forced-degraded-mode rendering)** - `d6df426` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` - S2.1 Operating Picture page: MapCanvas/MapControls/LayerPanel/MapLegend/MapPopup composition, projectToPercent, status-bar/offline derivation
- `frontend/app/src/pages/operating-picture/OperatingPicture.css` - 2fr/1fr layout, responsive single-column collapse below --bp-md
- `frontend/app/e2e/operating-picture.spec.ts` - 5-assertion Playwright suite (reachability, status-bar format, popup+deep-link, focus-return, degraded-mode)
- `backend/src/modules/auth-org/routes.ts` - added "Monitor" SideNav group ("Operating picture" item) to GET /api/v1/me/nav-config
- `frontend/app/src/main.tsx` - added /operating-picture route + import
- `frontend/app/package.json` - added pg/@types/pg devDependencies (test-only direct-DB incident-location seeding)

## Decisions Made

- `/operating-picture` route landed in `main.tsx`, not `AppShell.tsx` — matches 02-05/02-06's already-established real route-tree location, not the plan's frontmatter wording
- "Operating picture" reuses the existing `incidents:view`-gated `hasIncidents` check for its own separate "Monitor" nav group (distinct from "Activate"), rather than inventing a new feature-permission string the FRD doesn't name
- Popup detail (severity/jurisdiction/activation/opened-at) fetched per-selection via the existing `GET /api/v1/incidents/{id}`, keeping the polled markers endpoint's response shape thin regardless of which marker (if any) is currently selected

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `commander@epmp.local`'s empty `jurisdiction_scope` made the degraded-mode e2e assertion untestable**

- **Found during:** Task 2 (writing `operating-picture.spec.ts`)
- **Issue:** `commander@epmp.local` — the only seeded identity holding `incidents` permissions, used by every prior Phase 2 e2e suite — is JIT-provisioned by `sso.ts` on first login with `jurisdiction_scope = '{}'` (by design: a fresh SSO account has no jurisdiction until an admin assigns one, same as a real deployment). Every earlier suite signing in as this user worked anyway because `GET /api/v1/incidents`'s own list query doesn't yet filter by `jurisdiction_scope` (T-02-03, a documented carried-forward gap from 02-01/02-02's own SUMMARYs). `operating-picture.ts`'s markers query, by contrast, correctly enforces `jurisdiction_id = ANY(req.epmpUser.jurisdiction_scope)` — with an empty scope this identity could never see a single marker, making this plan's own primary success criterion (the degraded-mode render proof) impossible to test against a real browser session.
- **Fix:** Added a one-time test-fixture correction (`ensureCommanderHasJurisdictionScope()` in the spec file itself, run in `test.beforeAll`) that grants this fixture user the 'Default Agency' jurisdiction scope via direct Postgres access — the same jurisdiction every other e2e spec's "Default Agency" Combobox selection already implies. This is a test-fixture-only change; it does not modify `sso.ts`'s production JIT-provisioning behavior or `seed.ts`.
- **Files modified:** `frontend/app/e2e/operating-picture.spec.ts` (test fixture only)
- **Verification:** All 5 assertions pass once the fixture grant runs; reverting the grant reproduces the original "0 markers ever visible" failure.
- **Committed in:** `d6df426` (Task 2 commit)

**2. [Rule 1 - Bug] Overlapping markers at the identical hardcoded lat/lng intercepted each other's pointer events**

- **Found during:** Task 2, first Playwright run
- **Issue:** The spec's `createLocatedIncidentViaUi` helper initially set every test's incident to the exact same lat/lng (matching 02-03's own integration test fixture point). Across this `test.describe.serial` suite's several `test()` calls against the shared live-compose-stack database, multiple markers projected to the identical `x`/`y` percent position and visually stacked, so Playwright's click on "the marker" sometimes hit a different incident's identically-positioned `<div>`, causing a 60s click timeout.
- **Fix:** Added a small per-call random lat/lng jitter (±1°) so each test's own incident projects to a distinct screen position; also switched every test from `.first()` (non-deterministic once markers accumulate across runs) to an exact-name `aria-label` match (`markerFor()` helper) so each test unambiguously targets the marker it just created, not any other incident's leftover marker from a prior run.
- **Files modified:** `frontend/app/e2e/operating-picture.spec.ts`
- **Verification:** All 5 assertions pass deterministically across repeated runs.
- **Committed in:** `d6df426` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking test-fixture gap, 1 test-flakiness bug). Both fixes are confined to the new Playwright spec file; no production code (`OperatingPicture.tsx`, `operating-picture.ts`, `routes.ts`) was touched by either fix.
**Impact on plan:** Both fixes were necessary to make this plan's own success-criterion-5 Playwright assertion reliably pass against the real backend. No scope creep.

## Issues Encountered

None beyond the two deviations above, both resolved within this plan's own task execution.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Success criteria 4 and 5 are now fully observable end-to-end through a real browser session: a user sees status-coded incident diamond markers on a provenanced base layer, with a status bar showing data age and source, and the page demonstrably survives a forced GIS outage without failing to render.
- This is the terminal screen for Phase 2's map slice — hazard/facility layers (F12/F17) and the EOC dashboard variant (F18) are explicitly out of scope, deferred to later phases per REQUIREMENTS.md.
- Carried-forward gap (T-02-03, still open, unaffected by this plan): `GET /api/v1/incidents`'s own list query still does not filter by `jurisdiction_scope`; `operating-picture.ts`'s markers query (02-03) and this plan's own test-fixture discovery both confirm the markers endpoint itself is correctly scoped — only the plain incidents-list endpoint remains unscoped.
- 30s `refetchInterval` polling (both markers and layers) is a documented Phase 2 simplification per this plan's own threat-model note (T-02-14); a later phase wiring `incident.activation_changed` events into a live map refresh should replace it.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

Scanned all created/modified files for TODO/FIXME/placeholder/not-implemented/coming-soon patterns and reviewed for hardcoded/static-data handlers, empty function bodies, or dummy-prop renders:

- `OperatingPicture.tsx`'s `MapControls` `onZoomIn`/`onZoomOut` handlers are explicit, documented no-ops — the plan's own text specifies these as "structural placeholders satisfying the component contract without functional zoom," since no real map engine exists underneath yet (same documented limitation as `projectToPercent`'s linear approximation). Cosmetic, not blocking — `MapControls` requires these two handler props to render its always-shown zoom buttons at all.
- `OperatingPicture.css`'s file-header comment uses the word "placeholder" solely to describe the right column's Tasks `EmptyState` card (itself a plan-specified, honestly-labeled "ships in a later phase" message, identical in spirit to `IncidentWorkspace.tsx`'s own Tasks/Resources/Reports placeholders from 02-06). Cosmetic, not blocking.

No blocking stub defeats this plan's objective: the map, markers, status bar, popup, layer toggling, and degraded-mode rendering are all fully functional against the real backend.

## Self-Check: PASSED

- All 3 created files confirmed present on disk (`[ -f ]` checks: `OperatingPicture.tsx`, `OperatingPicture.css`, `operating-picture.spec.ts`)
- Both task commits (`deca4e5`, `d6df426`) confirmed in `git log --oneline`
- Build check: `npm run build` (backend `tsc`) → exit 0; `cd frontend/design-system && npm run build` (Vite) → exit 0; `cd frontend/app && npm run build` (Vite) → exit 0
- Full backend test suite (7 files, 33 tests) → all passed, zero regressions
- Full design-system test suite (5 files, 46 tests) → all passed
- New 5-assertion `operating-picture.spec.ts` Playwright suite → all passed against the live compose stack, including the degraded-mode proof
- Pre-existing `admin-users-roles.spec.ts` (5), `app-shell.spec.ts` (4), `incident-list-create.spec.ts` (4), `incident-workspace.spec.ts` (4) Playwright suites → all 17 assertions passed, confirming zero regressions from this plan's `routes.ts`/`main.tsx` edits
- `## Known Stubs` section present above: both entries cosmetic, neither blocking
