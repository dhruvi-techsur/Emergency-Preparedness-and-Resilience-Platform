---
phase: 06-persona-dashboards-ai-assistance
plan: 13
subsystem: ui
tags: [css, box-sizing, design-system, playwright, regression-test, gap-closure]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-assistance
    provides: "06-09's Signal Triage Queue screen (SignalTriageQueue.tsx) and its Dismiss confirmation Modal, the exact UI surface this gap closure fixes"
provides:
  - "AppShell.tsx's root element now carries the design system's `.ep` box-sizing:border-box reset activator class app-wide, not just inside the design system's own isolated test harnesses"
  - "A Playwright geometry regression guard (test 2 + new test 2b) proving the Dismiss Modal's Reason textarea renders entirely inside the Modal's bounds at both desktop and 390px mobile viewports"
affects: [06-UAT.md gap ref 8, any future screen composing Modal+TextField or any other width+padding/border design-system component pairing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Playwright boundingBox() geometry assertions for layout-overflow regression guards (precedent: operating-picture-resource-markers.spec.ts)"

key-files:
  created: []
  modified:
    - frontend/app/src/app-shell/AppShell.tsx
    - frontend/app/e2e/signal-triage.spec.ts

key-decisions:
  - "Fixed the systemic root cause (missing .ep class on AppShell's root) rather than patching Modal.css/TextField.css directly — both stylesheets were already correctly authored assuming border-box, per the gap's own root_cause diagnosis"
  - "Geometry assertions use a +1px tolerance for sub-pixel rounding only, not to mask the ~2px structural overflow the gap's diagnosis measured — the fix eliminates the overflow outright rather than widening the tolerance to hide it"
  - "New test 2b cancels (not confirms) the Dismiss Modal to preserve the New-status signal fixture pool for the existing serial-ordered tests 3-5 that still need one"

patterns-established:
  - "A one-class CSS-integration-boundary fix (matching the design system's own test-harness convention) resolves an entire systemic class of defect across multiple unrelated screens, rather than per-screen CSS patches"

# Metrics
duration: 10 min
completed: 2026-11-19
---

# Phase 6 Plan 13: AppShell `.ep` Box-Sizing Reset Activation Summary

**AppShell.tsx's root element gains the design system's `.ep` class alongside its existing `ep-shell` layout class, activating `tokens.css`'s app-wide `box-sizing: border-box` reset for the first time outside the design system's own test harnesses — closing UAT gap ref 8 and the entire systemic class of Modal+multiline-TextField width-overflow defects it caused.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-11-19T23:24:00Z (approx.)
- **Completed:** 2026-11-19T23:34:25Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Root-caused UAT gap ref 8 (the Signal Triage Queue Dismiss Modal's Reason textarea visually overflowing the Modal's right edge) to a missing `.ep` class on `AppShell.tsx`'s root element — `tokens.css`'s `box-sizing: border-box` reset is scoped to `.ep, .ep *` and the real app's shell root had never carried it, even though the design system's own test harnesses always do
- Applied the single-class fix (`className="ep ep-shell"`), activating the reset app-wide with zero changes to `Modal.css`/`TextField.css` or any other design-system stylesheet, per the gap's own diagnosis that those files are already internally consistent assuming border-box is active
- Added a Playwright `boundingBox()` geometry regression guard directly into the existing Dismiss Modal flow test (test 2), proving the Reason textarea's right edge never exceeds the Modal's own right edge at the default desktop viewport
- Added a new standalone test 2b repeating the identical geometry check at a 390px mobile viewport, closing the gap's "at any viewport" requirement — the exact kind of assertion missing from the prior round, since the prior Dismiss Modal test only checked functional behavior (button enabled/disabled, status update), never layout, which is why the visual defect went unreported by automation until a human looked at it

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply the `.ep` class to AppShell's root element** - `ba5ef7c` (fix)
2. **Task 2: Add a Playwright bounding-box regression check** - `30b8576` (test)

**Plan metadata:** (pending — see final commit)

## Files Created/Modified

- `frontend/app/src/app-shell/AppShell.tsx` - Root element className changed from `"ep-shell"` to `"ep ep-shell"`, activating the design system's box-sizing:border-box reset app-wide
- `frontend/app/e2e/signal-triage.spec.ts` - Test 2 gained geometry assertions on the Dismiss Modal's Reason textarea bounding box; new standalone test 2b repeats the check at a 390px viewport

## Decisions Made

- Fixed the systemic integration-boundary gap (one class on AppShell's root) rather than patching individual component stylesheets — matches the gap's own diagnosis that Modal.css/TextField.css are already correctly authored, and resolves every other Modal+multiline-TextField pairing named in the gap's `root_cause` field (RecipientGroups, MessageTemplates, ComposeNotification, SignalDetail, ResourceRequestDetail, ReviewPlanModal, RecordAuthority) without touching any of them
- Kept the `+1` pixel tolerance in the geometry assertions strictly for sub-pixel rounding, not to paper over the actual defect — the fix removes the ~2px structural overflow the gap's diagnosis measured, rather than loosening the test to let it pass anyway
- New test 2b explicitly cancels the Dismiss flow instead of confirming it, so it doesn't consume a `New`-status fixture row needed by the existing serial tests 3-5 that run afterward

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- UAT gap ref 8 (06-UAT.md) is closed — the Dismiss Modal's Reason textarea renders entirely inside the Modal at both viewports tested, verified by new automated regression coverage
- A regression sample of other Modal+multiline-TextField screens named in the gap's diagnosis (notifications-compose, plans, tasks-resources, admin-platform-sso — 24 tests total) all pass unaffected by the box-sizing reset now being active app-wide, confirming no new regression was introduced
- app-shell.spec.ts (4/4) confirms the shell's own SideNav/breadcrumbs/header/skip-link behavior is unaffected
- This was the last of the three gap-closure plans (06-11, 06-12, 06-13) queued for Phase 6; the phase is ready to re-enter verification

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*

## Self-Check: PASSED

- `frontend/app/src/app-shell/AppShell.tsx` — FOUND, contains `className="ep ep-shell"` (verified via grep)
- `frontend/app/e2e/signal-triage.spec.ts` — FOUND, contains new test 2b and test 2's geometry assertions
- Commit `ba5ef7c` — FOUND in git log
- Commit `30b8576` — FOUND in git log
- Build check: `cd frontend/app && npm run build` → exit 0 (clean, PWA precache generated)
- `cd frontend/app && npx tsc --noEmit` → exit 0, no errors
- `npx playwright test e2e/signal-triage.spec.ts --workers=1` → 5/5 passed
- Regression sample (`notifications-compose.spec.ts plans.spec.ts tasks-resources.spec.ts admin-platform-sso.spec.ts`) → 24/24 passed
- Full app-shell regression (`app-shell.spec.ts`) → 4/4 passed
- `## Known Stubs` — None found (pre-existing documented Phase-1 no-op placeholders in AppShell.tsx — search box, alerts button — are untouched by this plan's diff and are not blocking)
