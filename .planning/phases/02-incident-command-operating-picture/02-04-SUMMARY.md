---
phase: 02-incident-command-operating-picture
plan: 04
subsystem: ui
tags: [design-system, maps, gis, accessibility, react, svg, provenance]

# Dependency graph
requires:
  - phase: 01-platform-foundation-deployable-shell
    provides: "Icon/Badge/Modal/Card/Checkbox/IconButton foundation components exported from frontend/design-system/src/index.ts (01-02, 01-06)"
provides:
  - "MapCanvas: marker/area/line overlay surface with percent-based x/y positioning, offline schematic fallback, keyboard-operable + screen-reader-mirrored markers"
  - "MapControls: vertical zoom/locate/layers/fullscreen icon-button stack, buttons without a handler prop not rendered"
  - "MapLegend: Card-based glyph+label list matching MapCanvas's shape-by-type convention"
  - "MapPopup: selected-feature card with title/Badge/facts/Provenance/actions, shadow-lg at rest (documented Card-shadow-rule exception)"
  - "LayerPanel: Checkbox-bound layer checklist with immediate (no-save-step) onToggle, reusing Provenance's dashed/Unverified treatment for unverified layers"
  - "Provenance: source/time/verification chip — dashed outline + alert icon + literal 'Unverified' word, all three together, only on explicit verified=false"
  - "All 6 components exported from frontend/design-system/src/index.ts onto window.EPMP"
affects: ["02-07", "02-08"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "MapCanvas separates offline-gated base rendering (fill/label) from always-rendered overlay rendering (markers/areas/lines/hidden text list) as two structurally independent branches in the same component"
    - "Provenance's verified=false branch renders entirely different markup (dashed border + Icon + word) rather than a conditional class/style on shared markup, making the unverified treatment impossible for a caller to accidentally omit"
    - "LayerPanel/MapLegend compose existing design-system primitives (Checkbox, Card, Provenance) rather than reimplementing their visual treatments a second time"

key-files:
  created:
    - frontend/design-system/src/maps/MapCanvas.tsx
    - frontend/design-system/src/maps/MapCanvas.css
    - frontend/design-system/src/maps/MapControls.tsx
    - frontend/design-system/src/maps/MapControls.css
    - frontend/design-system/src/maps/MapLegend.tsx
    - frontend/design-system/src/maps/MapLegend.css
    - frontend/design-system/src/maps/MapPopup.tsx
    - frontend/design-system/src/maps/MapPopup.css
    - frontend/design-system/src/maps/LayerPanel.tsx
    - frontend/design-system/src/maps/LayerPanel.css
    - frontend/design-system/src/product-patterns/Provenance.tsx
    - frontend/design-system/src/product-patterns/Provenance.css
    - frontend/design-system/test/maps.test.tsx
  modified:
    - frontend/design-system/src/index.ts

key-decisions:
  - "MapCanvas's offline badge occupies the topLeft slot only when the caller's own topLeft content is absent; when both exist, the badge renders adjacent (stacked) rather than being dropped, per the plan's 'never dropped' requirement"
  - "Marker/area/line tone resolution uses a shared toneVar() helper producing var(--{tone}-solid, var(--brand)) so any status tone string ('danger'|'warning'|'success'|'info'|'brand') maps directly onto existing status color tokens with no new token family introduced"
  - "test/maps.test.tsx injects Provenance.css directly (mirroring the existing tokens.css injection pattern in foundations.test.tsx/layout-nav.test.tsx) after discovering vitest/jsdom does not auto-inject component-level CSS imports — confirmed by querying document.querySelectorAll('style') after a bare component render, which returned zero tags"

patterns-established:
  - "MAPS component family: shape-by-type (diamond/square/triangle/circle) + tone-by-status + always-ink-outlined markers, consistently applied across MapCanvas and MapLegend's glyph rendering"

# Metrics
duration: 18min
completed: 2026-11-16
---

# Phase 2 Plan 04: MAPS Component Family + Provenance Summary

**MapCanvas/MapControls/MapLegend/MapPopup/LayerPanel + the Provenance product-pattern chip, all exported onto `window.EPMP`, giving the operating-picture page a complete map-rendering surface with zero custom map code.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-16T12:55:40Z
- **Completed:** 2026-11-16T12:58:30Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments
- `MapCanvas` renders markers/areas/lines via percent-based `x`/`y` SVG+DOM overlay; `offline={true}` swaps only the base fill/label to a hatched "Schematic base map, offline" treatment while every marker/area/line prop renders identically — proven by a dedicated test rendering 2 markers under `offline` and asserting both survive
- Every marker is a real focusable element (`tabIndex={0}`, `role="button"`, `Enter`/`Space`-activatable calling `onSelect`) with a parallel visually-hidden (`clip:rect`, not `display:none`) text list giving screen readers the identical label+status information set — proven by a Tab-sequence + Enter test
- `Provenance` structurally branches on `verified`: the default-`true` path renders a plain solid-outline chip; an explicit `verified={false}` renders a dashed outline, an announced `Icon name="alert"`, and the literal word "Unverified" together — never a subset of the three — so a caller cannot accidentally make unverified data look verified by omitting a prop
- `LayerPanel` has no `onSave` prop anywhere in its API — `onToggle(id, checked)` fires synchronously on click, proven by a test asserting no "save"/"confirm" button exists anywhere in its rendered output
- `MapPopup` accepts status only as a rendered `Badge` element (never a color-only indicator), proven by querying for `Badge`'s actual icon+text DOM shape inside the popup
- `MapLegend` reuses `Card padded={false}` rather than reimplementing panel chrome; `LayerPanel`'s unverified rows reuse `Provenance` directly rather than reimplementing its dashed treatment a second time

## Task Commits

Each task was committed atomically:

1. **Task 1: MapCanvas + MapControls** - `f66bbe2` (feat)
2. **Task 2: MapLegend + MapPopup + Provenance** - `217b4a2` (feat)
3. **Task 3: LayerPanel + export all 6 components + conformance test** - `ec9c85a` (feat)

_Note: index.ts's export-list edit was deferred to Task 3 (the plan's own documented either/or) rather than split across Tasks 2 and 3._

## Files Created/Modified
- `frontend/design-system/src/maps/MapCanvas.tsx` / `.css` — map surface: markers/areas/lines overlay, topLeft/topRight/bottomLeft/popup slots, status bar, offline schematic fallback
- `frontend/design-system/src/maps/MapControls.tsx` / `.css` — vertical zoom/locate/layers/fullscreen icon-button stack, conditional per handler prop
- `frontend/design-system/src/maps/MapLegend.tsx` / `.css` — glyph+label list matching MapCanvas's shape-by-type convention, built on Card
- `frontend/design-system/src/maps/MapPopup.tsx` / `.css` — selected-feature card: title, Badge, facts, Provenance, actions, shadow-lg at rest
- `frontend/design-system/src/maps/LayerPanel.tsx` / `.css` — Checkbox-bound layer checklist, immediate onToggle, reuses Provenance for unverified rows
- `frontend/design-system/src/product-patterns/Provenance.tsx` / `.css` — source/time/verification chip with the dashed+icon+word unverified branch
- `frontend/design-system/src/index.ts` — adds MAPS and PRODUCT PATTERNS export sections (6 new components + their prop/type exports)
- `frontend/design-system/test/maps.test.tsx` — 6 Vitest/Testing-Library assertions covering all 5 `must_haves.truths` from the plan

## Decisions Made
- Offline badge placement: adjacent-not-dropped when the caller already occupies `topLeft`, rather than silently discarding the caller's content or the badge
- Shared `toneVar()` helper in `MapCanvas`/`MapLegend` maps any tone string onto `var(--{tone}-solid, var(--brand))`, avoiding a second hardcoded tone→color table
- Test harness: discovered (via a throwaway probe test) that vitest/jsdom does not auto-inject component `.css` imports, so `test/maps.test.tsx` injects `Provenance.css`'s real file contents directly — same technique `foundations.test.tsx` already used for `tokens.css` — rather than re-declaring the dashed-border rule as a parallel assertion

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Provenance's computed `border-style` assertion failed until the component's own CSS was injected into the test's jsdom document**
- **Found during:** Task 3 (writing `test/maps.test.tsx`)
- **Issue:** The plan's own verify step 3 requires asserting `getComputedStyle(...).borderStyle === 'dashed'`, but a first run returned `''` — vitest/jsdom only loads the test file's own imports' JS side-effects for CSS-module-less `import './X.css'` statements as no-ops in this project's Vite test config, so no stylesheet reaches `document.styleHead`. Confirmed via a one-off probe test rendering `Badge` and querying `document.querySelectorAll('style')`, which returned 0 elements.
- **Fix:** Read `Provenance.css`'s real file contents with `readFileSync` and appended a `<style>` tag with that content in the suite's `beforeAll`, exactly mirroring the existing `tokens.css`-injection pattern already used by `test/foundations.test.tsx` and `test/layout-nav.test.tsx` for the same underlying jsdom limitation.
- **Files modified:** `frontend/design-system/test/maps.test.tsx`
- **Verification:** `npx vitest run test/maps.test.tsx` — all 6 assertions pass, including the dashed-border-style check
- **Committed in:** `ec9c85a` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix only affects test infrastructure (how the test observes the already-correct component CSS); no production component code changed. No scope creep.

## Issues Encountered
None beyond the deviation above.

## Known Stubs
None found — a full `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across every file this plan created returned zero matches, and manual review found no hardcoded/static-data handlers, empty function bodies, or dummy-prop renders. All 6 components implement real behavior per the plan's literal contracts.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- All 6 MAPS/product-pattern components are live on `window.EPMP`; the operating-picture frontend page (02-07/02-08) can compose `MapCanvas`/`MapControls`/`MapLegend`/`MapPopup`/`LayerPanel`/`Provenance` directly with zero custom map code
- Full design-system build (`npm run build`) and the full existing test suite (46 tests across 5 files) both pass green after this plan's additions — no regressions introduced
- No blockers for 02-05/02-06/02-07

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 7 key files confirmed present on disk (`[ -f ... ]` checks).
- All 3 task commits (`f66bbe2`, `217b4a2`, `ec9c85a`) confirmed in `git log`.
- Build check: `npm run build` (vite build) → exit 0 — `dist/bundle.es.js`/`dist/bundle.js`/`dist/bundle.css` all produced; grep confirms `MapCanvas`, `LayerPanel`, `Provenance`, and the literal `"Schematic base map"` string are present in the compiled bundle.
- Full Vitest suite (`npx vitest run`) → 5 test files, 46/46 tests passed, including this plan's 6-assertion `test/maps.test.tsx`.
- `## Known Stubs` section present above: None found.
