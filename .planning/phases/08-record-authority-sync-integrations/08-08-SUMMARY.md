---
phase: 08-record-authority-sync-integrations
plan: 08
subsystem: ui
tags: [react, playwright, operating-picture, tasks, gap-closure]

# Dependency graph
requires:
  - phase: 03-record-authority-sync-integrations
    provides: "TaskList component (03-06) and its 03-08 IncidentWorkspace.tsx wiring pattern, reused verbatim here"
provides:
  - "OperatingPicture.tsx's side-panel Tasks Card renders the real, incident-scoped TaskList (not a stale 'ships in a later phase' placeholder) when an incident marker is selected"
  - "Structural gate (!selectedIsResource && !selectedIsFacility) ensuring the Tasks Card never renders for a resource or facility marker selection, since neither has an incident_id to scope a task list by"
  - "Playwright regression coverage proving both halves: incident selection shows the real TaskList; resource/facility selection shows no Tasks card at all"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Gap-closure plans reuse an EXISTING sibling fix's pattern verbatim (here: 03-08's IncidentWorkspace.tsx TaskList wiring) rather than inventing a new approach"

key-files:
  created: []
  modified:
    - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
    - frontend/app/e2e/operating-picture-facility-markers.spec.ts
    - frontend/app/e2e/operating-picture-resource-markers.spec.ts

key-decisions:
  - "Reworded the doc comment above the fix to avoid literally containing the stale placeholder string ('Tasks ship in a later phase'/'Task tracking (F4) is built in Phase 3'), which would otherwise self-collide with the plan's own grep-based verification step — same self-collision class 08-06's SUMMARY documented for its own idempotency-guard wording"
  - "The incident-marker Playwright assertion for the Tasks Card scopes its heading locator to 'h3.ep-card__title' (not a bare getByRole('heading', { name: 'Tasks' })), since TaskList's own embedded PageHeader independently renders an h1 also reading 'Tasks' — a bare heading-by-name locator is ambiguous (Playwright strict-mode violation) the moment the real component (not a placeholder) is mounted"

patterns-established: []

# Metrics
duration: 25min
completed: 2026-11-20
---

# Phase 8 Plan 08: Operating Picture Tasks Card Gap Closure Summary

**Replaced OperatingPicture.tsx's year-stale "Tasks ship in a later phase" placeholder with the real, incident-scoped `<TaskList incidentId={selectedId} />`, correctly gated so resource and facility marker selections never render the card at all.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-20T17:16:00Z
- **Completed:** 2026-11-20T17:41:33Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Closed UAT gap ref 3 (major): every marker selection on the Operating Picture — including Phase 8's own new facility markers — previously showed a self-contradictory "Tasks ship in a later phase... built in Phase 3" placeholder, despite Phase 3 having shipped real task tracking (F4) over a year of roadmap time ago.
- The side-panel Tasks Card now renders the SAME real `TaskList` component (03-06) that `IncidentWorkspace.tsx`'s identical placeholder was already fixed to use in 03-08 — mirroring that exact fix pattern, with zero new component code.
- Fixed the secondary structural finding UAT's root-cause analysis flagged alongside the stale copy: the Tasks Card previously had no gate at all and would have rendered (with no `incidentId`, i.e. the org-wide unscoped list) for a resource or facility marker selection too. It is now gated behind the same `!selectedIsResource && !selectedIsFacility` condition the file's own `selectedIncidentQuery`/`selectedTimelineQuery` already used, so the Card is structurally absent — not merely empty — for either selection.
- Closed a pre-existing test gap: the resource-marker spec had zero assertions on the Tasks card at all before this plan; it now independently proves the resource half of the must_haves truth, mirroring the facility half.

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace the stale Tasks placeholder with the real TaskList, correctly gated** - `e51a058` (fix)
2. **Task 2: Playwright — prove the real TaskList renders for an incident selection and is absent for resource/facility selection** - `d78e1b4` (test)

_No plan-metadata-only commit beyond these two; this plan's own SUMMARY.md + STATE.md update is committed separately per the standard workflow's final docs commit._

## Files Created/Modified
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` - Tasks Card now renders `<TaskList incidentId={selectedId} />`, gated behind `!selectedIsResource && !selectedIsFacility`; stale placeholder text and its now-redundant doc-comment wording removed
- `frontend/app/e2e/operating-picture-facility-markers.spec.ts` - extended test 2 with a Tasks-card-absence assertion for the facility-marker popup; added test 5 proving an incident-marker selection renders the real TaskList (Tasks Card `h3` title + "New task" button) with the stale copy gone from the page entirely
- `frontend/app/e2e/operating-picture-resource-markers.spec.ts` - added the matching Tasks-card-absence assertion to the existing resource-marker MapPopup test (test 1-2), closing the previously-untested resource half of this plan's must_haves truth

## Decisions Made
- Reworded the fix's doc comment to avoid literally embedding the stale placeholder string, since the plan's own `<verify>` step greps the file FOR that exact string's absence — my first draft comment ("replaces the stale 'Tasks ship in a later phase' placeholder") would have tripped its own verification, the identical self-collision class 08-06's SUMMARY documented for its idempotency-guard wording. Caught immediately by re-running the plan's own verify grep before moving on, not discovered later.
- Scoped the new Playwright heading locator for the incident-selection test to `h3.ep-card__title` rather than a bare `getByRole('heading', { name: 'Tasks' })`, since `TaskList`'s own embedded `PageHeader` independently renders an `h1` that ALSO reads "Tasks" — once the real component (not a placeholder) is mounted, a bare name-only heading locator resolves to two elements and Playwright's strict mode correctly rejects it. Discovered via the test's own first failing run, not assumed in advance.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Doc-comment self-collision with the plan's own stale-string verification grep**
- **Found during:** Task 1 (verification step)
- **Issue:** The explanatory comment added above the fix literally quoted the stale placeholder strings ("Tasks ship in a later phase", "Task tracking (F4) is built in Phase 3") that the plan's own `<verify>` step greps the file for, by design, to confirm they're gone. The comment itself would have made that grep fail even though the actual UI placeholder was correctly removed.
- **Fix:** Reworded the comment to describe the fix ("replaces the prior 'built in a future phase' placeholder") without reproducing either exact literal string.
- **Files modified:** `frontend/app/src/pages/operating-picture/OperatingPicture.tsx`
- **Verification:** Re-ran `grep -n "Tasks ship in a later phase\|Task tracking (F4) is built in Phase 3" OperatingPicture.tsx` — correctly reports no match (`STALE PLACEHOLDER REMOVED`).
- **Committed in:** `e51a058` (Task 1 commit)

**2. [Rule 1 - Bug] Playwright strict-mode violation on an ambiguous "Tasks" heading locator**
- **Found during:** Task 2 (first Playwright run of the new incident-selection test)
- **Issue:** `page.getByRole('heading', { name: 'Tasks' })` resolved to two elements once the real `TaskList` mounted: the Tasks Card's own `h3.ep-card__title` AND `TaskList`'s internally-rendered `PageHeader`'s `h1`, both reading literally "Tasks". Playwright's strict mode correctly failed the assertion rather than picking one arbitrarily.
- **Fix:** Scoped the locator to `h3.ep-card__title` with a `hasText: 'Tasks'` filter, unambiguously selecting the Card's own header and leaving the `TaskList`-internal `h1` out of scope for this assertion (the "New task" button assertion immediately below is what actually proves the real component, not a placeholder, mounted).
- **Files modified:** `frontend/app/e2e/operating-picture-facility-markers.spec.ts`
- **Verification:** Re-ran the full facility-markers spec — all 5 tests pass, including this one.
- **Committed in:** `d78e1b4` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1, both test/doc-comment-only — no production logic was affected beyond the comment wording itself)
**Impact on plan:** Both fixes were caught by the plan's own prescribed verification steps before being committed, not discovered later. No scope creep; the actual UI/behavior change matches the plan's objective exactly.

## Issues Encountered
None beyond the two self-caught deviations documented above.

## Known Stubs
None found. `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against the changed files surfaces only: (1) a pre-existing, unrelated `MapControls` doc comment describing Phase 2's documented zoom/pan structural-placeholder limitation (untouched by this plan), and (2) the DatePicker test helper's literal HTML `placeholder="YYYY-MM-DD"` attribute (pre-existing test code, not a stub). Neither is related to this plan's Tasks-card fix.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UAT gap ref 3 (major) is fully closed: the Operating Picture's Tasks Card now shows real, working, incident-scoped task data for every incident selection, and correctly shows nothing at all for resource/facility selections.
- Zero regressions: `operating-picture.spec.ts` (5/5), `operating-picture-facility-markers.spec.ts` (5/5, including the 2 new/extended cases), and `operating-picture-resource-markers.spec.ts` (3/3, including the 1 extended case) all pass. Both `tsc --noEmit` and `npm run build` (frontend/app) are clean.
- No blockers for any subsequent phase-8 plan or the phase's own re-verification.

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*

## Self-Check: PASSED

- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` — FOUND
- `frontend/app/e2e/operating-picture-facility-markers.spec.ts` — FOUND
- `frontend/app/e2e/operating-picture-resource-markers.spec.ts` — FOUND
- `.planning/phases/08-record-authority-sync-integrations/08-08-SUMMARY.md` — FOUND
- Commit `e51a058` (Task 1, fix) — FOUND in git log
- Commit `d78e1b4` (Task 2, test) — FOUND in git log
- `cd frontend/app && npx tsc --noEmit` — exit 0, zero errors
- `cd frontend/app && npm run build` — exit 0, clean build
- `## Known Stubs` section present above, no blocking entries
