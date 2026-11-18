---
phase: 04-notifications-reporting-learning
plan: 03
subsystem: ui
tags: [design-system, react, svg, accessibility, data-visualization, progress-bar]

# Dependency graph
requires:
  - phase: 01-platform-foundation-deployable-shell
    provides: "tokens.css's --viz-1..--viz-6, --seq-1..--seq-5, --success/warning/danger-solid tokens, and the Skeleton/EmptyState/Badge/Alert/Toast FEEDBACK-family + MapCanvas's ep-visually-hidden / toneVar conventions this plan reuses"
provides:
  - "Progress: determinate 8px pill progress bar, numeric value always visible as text (never decoration-only), tone-aware fill"
  - "LineChart: up to 6-series trend chart with per-series marker shapes (not just color), dashed threshold lines, keyboard arrow-key exact-value readout, hidden data table twin"
  - "BarChart: vertical/horizontal, grouped/stacked category comparison chart with printed values and optional print/grayscale-safe pattern fills, hidden data table twin"
  - "DonutChart: 2-5-segment part-to-whole chart with center total, always-visible list legend (value+percentage), loud dev-only overflow warning past 5 segments (never silent truncation), hidden data table twin"
affects: ["04-05-notifications-delivery-tracking", "04-06-aar-analytics-reporting"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "6th-series LineChart marker fallback (ring + center dot) documented inline as Claude's discretion, since the spec names exactly 5 shapes for 'up to 6 series'"
    - "BarChart's SVG <pattern> defs (stripe/dot/hatch) layered UNDER the solid viz-N fill, cycling per series index, satisfying 'series survive print and grayscale'"
    - "DonutChart's overflow contract: console.warn (dev-only, gated on NODE_ENV) rather than truncation or a thrown error — a caller-contract violation is loud, never data-lossy"

key-files:
  created:
    - frontend/design-system/src/feedback/Progress.tsx
    - frontend/design-system/src/feedback/Progress.css
    - frontend/design-system/src/data/LineChart.tsx
    - frontend/design-system/src/data/LineChart.css
    - frontend/design-system/src/data/BarChart.tsx
    - frontend/design-system/src/data/BarChart.css
    - frontend/design-system/src/data/DonutChart.tsx
    - frontend/design-system/src/data/DonutChart.css
    - frontend/design-system/test/data-viz.test.tsx
  modified:
    - frontend/design-system/src/index.ts

key-decisions:
  - "LineChart's 6th-series marker shape (the spec names only 5: circle/square/triangle/diamond/cross) resolved as a ring with a contrasting center dot — visually distinct from series-1's filled circle even in grayscale/print"
  - "DonutChart's >5-segment caller-contract violation is a dev-only console.warn (gated on process.env.NODE_ENV !== 'production'), never a thrown error or silent truncation — all segments still render"
  - "All three chart components render a SEPARATE always-visible list/axis presentation (BarChart's printed values, DonutChart's list legend) in addition to a visually-hidden <table> — the hidden table is purely the screen-reader twin, never the only place values appear"

patterns-established:
  - "DATA VISUALIZATION as a new index.ts barrel section, parallel to existing FEEDBACK/FORMS/DATA/NAVIGATION/MAPS sections"

# Metrics
duration: 25min
completed: 2026-11-18
---

# Phase 4 Plan 3: Progress + LineChart/BarChart/DonutChart Data-Visualization Components Summary

**Four design-system components (Progress, LineChart, BarChart, DonutChart) added to `window.EPMP`, each satisfying the spec's explicit never-color/width-alone accessibility rules: Progress always prints its percentage as text, the three charts each carry a visually-hidden data-table twin of their visual chart, LineChart distinguishes series by shape as well as hue, and DonutChart warns loudly (never truncates) past its 5-segment contract.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-18T05:04:00Z (approx.)
- **Completed:** 2026-11-18T05:29:10Z
- **Tasks:** 3
- **Files modified:** 10 (9 created, 1 modified)

## Accomplishments
- `Progress`: accessible `role="progressbar"` with `aria-valuenow/min/max`, `showValue` defaulting `true` so the numeric percentage is always visible text, tone-aware fill reusing `MapCanvas.tsx`'s exact `toneVar` helper pattern, reduced-motion-respecting transition
- `LineChart`: SVG line chart, up to 6 series each with a distinct `viz-N` color AND marker shape, dashed `thresholds` reference lines (never a color band), Left/Right-arrow keyboard readout rendered as visible `<text>` (not a native tooltip), legend showing each series' latest value, hidden `<table>` twin
- `BarChart`: vertical/horizontal, grouped/stacked bars with 2px corner radius, values always printed on/beside each bar, optional stripe/dot/hatch SVG pattern fills under the solid color for print/grayscale survival, hidden `<table>` twin
- `DonutChart`: 2-5 segment ring with center total slot, always-visible list legend (label + value + computed percentage for every segment, never hidden/optional), `console.warn` (dev-only) past 5 segments while still rendering every segment, separate hidden `<table>` twin
- New 5-test suite (`data-viz.test.tsx`) proving: Progress's numeric value is DOM text (not just inline `width` style); LineChart/BarChart render both visual + hidden-table data in parity; DonutChart's exactly-5 and 6-segment contract boundary (warn vs no-warn, full render either way)

## Task Commits

Each task was committed atomically:

1. **Task 1: Progress component** - `7eff3fc` (feat)
2. **Task 2: LineChart + BarChart + DonutChart** - `153d731` (feat)
3. **Task 3: Component tests** - `a430810` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/design-system/src/feedback/Progress.tsx` - Determinate progress bar: value/label/showValue/tone props, accessible progressbar role
- `frontend/design-system/src/feedback/Progress.css` - 8px pill track/fill, reduced-motion-aware width transition
- `frontend/design-system/src/data/LineChart.tsx` - Up-to-6-series trend chart, per-series marker shapes, keyboard readout, hidden data table
- `frontend/design-system/src/data/LineChart.css` - SVG chart styling (axis/threshold/legend/readout), token-only
- `frontend/design-system/src/data/BarChart.tsx` - Vertical/horizontal grouped/stacked bar chart with printed values and pattern fills
- `frontend/design-system/src/data/BarChart.css` - Bar chart styling, token-only
- `frontend/design-system/src/data/DonutChart.tsx` - 2-5-segment donut with center total, list legend, overflow dev-warning
- `frontend/design-system/src/data/DonutChart.css` - Donut chart styling, token-only
- `frontend/design-system/src/index.ts` - Added Progress to FEEDBACK section; added new DATA VISUALIZATION section exporting LineChart/BarChart/DonutChart
- `frontend/design-system/test/data-viz.test.tsx` - 5-assertion test suite for all 4 components

## Decisions Made
- LineChart's 6th-series marker (spec names exactly 5 shapes for "up to 6 series") resolved as a ring + contrasting center dot, documented inline as the resolution of this spec ambiguity
- DonutChart's >5-segment violation is a loud dev-only `console.warn`, never a thrown error or silent data loss — all segments always render regardless of count
- Chart components' "hidden data table" convention is strictly additive to an already-visible presentation (BarChart's printed values, DonutChart's list legend) — the hidden table is never the sole place data appears, even for sighted users

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

One self-correction during Task 3 authoring: the initial test assertions used `screen.getByText(seg.label)` for DonutChart's single-letter segment labels (`'A'`..`'F'`), which matched multiple DOM nodes (the visible legend label AND the hidden-table row header both render the same single-letter text) and failed with a "multiple elements found" error. Fixed by scoping the assertion to `.ep-donutchart__legend-label` elements specifically — resolved within Task 3's own execution, before the task's commit, so no separate deviation-rule tracking was needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- 04-05 (Compose Notification / Delivery & Acknowledgment Tracking) and 04-06 (AAR Generator / Analytics & Reporting Dashboard) now have every design-system component their UX-mockup screens require (Progress for step indicators and ack-percentage bars; LineChart/BarChart/DonutChart for the Analytics dashboard's three chart cards) — none need to be built via ad-hoc inline styling outside `window.EPMP`
- No blockers. Full design-system suite (51 tests, 6 files) green; `tsc --noEmit` clean; `vite build` clean (dist/bundle.js 67.19 kB, dist/bundle.es.js 106.44 kB, dist/bundle.css 37.80 kB)

## Known Stubs

None found - all four components fully implement their documented contracts (LineChart's "Hover is not implemented" is a doc comment noting the keyboard-arrow-key readout is used instead of a pointer-hover tooltip, per the plan's own "implement via a visually-rendered `<text>` readout, not a native browser tooltip" instruction — not an incomplete implementation).

## Self-Check: PASSED

- All 9 created files verified present on disk
- All 3 task commits (7eff3fc, 153d731, a430810) verified in git log
- Build check: `cd frontend/design-system && npx tsc --noEmit` → exit 0 (clean); `npm run build` → exit 0 (dist/bundle.js 67.19 kB, dist/bundle.es.js 106.44 kB, dist/bundle.css 37.80 kB)
- Full design-system test suite: 51/51 tests passing across 6 files, including the new 5-test data-viz.test.tsx
- Integration contracts verified: `--viz-1` present in tokens.css; `Progress`/`LineChart`/`BarChart`/`DonutChart` all exported from `frontend/design-system/src/index.ts`

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*
