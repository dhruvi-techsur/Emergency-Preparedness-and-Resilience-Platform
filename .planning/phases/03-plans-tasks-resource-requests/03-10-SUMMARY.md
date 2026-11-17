---
phase: 03-plans-tasks-resource-requests
plan: 10
subsystem: plans
tags: [react, fastify, playwright, materialize-tasks, gap-closure]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "materialize-tasks backend endpoint (03-03), plan Detail/linking UI (03-05), Incident Workspace Tasks tab (03-08)"
provides:
  - "MaterializeTasksModal.tsx: real UI caller of POST /api/v1/plans/{id}/materialize-tasks (incident Combobox + optional per-section checkbox narrowing filter, renders {created, skipped} results inline)"
  - "PlanDetail.tsx 'Materialize tasks' PageHeader action, gated to plan.status === 'Approved' && at least one section with a linked template"
  - "plan-to-task-materialization.spec.ts test 5 rewritten to drive the real button/modal instead of a raw page.evaluate() fetch"
  - "plans.spec.ts negative-gating assertion proving the button is absent on a Review-status, zero-template plan"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Materialize modal reuses LinkTasksModal's Modal/Button/Alert composition pattern and CreateTask.tsx's incident-Combobox-from-GET-/api/v1/incidents convention, rather than inventing a new form pattern"
    - "Skip-reason codes rendered through a reason-code -> human-string lookup map (SKIP_REASON_TEXT), never the raw error_code, mirroring the design system's 'never show a raw code to a user' convention"

key-files:
  created:
    - frontend/app/src/pages/plans/MaterializeTasksModal.tsx
  modified:
    - frontend/app/src/pages/plans/PlanDetail.tsx
    - frontend/app/e2e/plan-to-task-materialization.spec.ts
    - frontend/app/e2e/plans.spec.ts

key-decisions:
  - "Section checkboxes are an opt-in NARROWING filter (default: all eligible sections' templates materialize) rather than a required per-section selection, matching the FRD's one-click framing"
  - "The 'Materialize tasks' PageHeader action is the ONLY new entry point -- no second affordance added to the sections list or version-history sidebar, since per-section 'Link tasks' (03-08) is a separate authoring concern"

patterns-established:
  - "Gap-closure plans that add a UI caller to an already-hardened backend endpoint re-verify the endpoint's jurisdiction/RBAC checks by direct code read rather than re-litigating them in a new threat_model entry from scratch"

duration: 25min
completed: 2026-11-17
---

# Phase 3 Plan 10: Materialize Tasks UI Trigger (Gap Closure) Summary

**Built the real "Materialize tasks" button + modal on PlanDetail.tsx that calls the already-working `POST /api/v1/plans/{id}/materialize-tasks` endpoint, closing UAT gap ref "uat:1" where the only UI path to materialization was a raw `page.evaluate()` fetch the phase's own e2e suite had pre-emptively documented as a known gap.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-17T21:24:00Z
- **Completed:** 2026-11-17T21:48:37Z
- **Tasks:** 3
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments

- New `MaterializeTasksModal` component: incident `Combobox` (required) + optional per-section `Checkbox` narrowing filter, calls the real endpoint with the exact `{incident_id, section_ids?}` body shape, and renders the `{created, skipped}` result inline (success Alert listing created task titles; warning Alert with human skip-reason strings, never raw `NO_USER_FOR_ROLE`-style codes)
- `PlanDetail.tsx` gained a "Materialize tasks" PageHeader primary action, visible exactly when `plan.status === 'Approved'` AND at least one section has `linked_task_templates.length > 0` — structurally impossible to click into a 404/409
- `plan-to-task-materialization.spec.ts` test 5 rewritten end-to-end: clicks the real button, selects the incident via the modal's Combobox, clicks "Materialize tasks", asserts the created-task title renders inside the modal, clicks "Done" — the exact UI interaction the UAT's human walkthrough found missing. The now-unused `apiPostViaPage` helper and its stale "no dedicated UI trigger exists yet" doc comments were removed.
- `plans.spec.ts` test 3 (Review-status, zero-linked-template plan) gained one new assertion proving the "Materialize tasks" button is absent — closing the plan's last untested `must_haves` truth with a real automated check.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build MaterializeTasksModal and wire into PlanDetail.tsx** - `5a21b2a` (feat)
2. **Task 2: Rewrite e2e test 5 to drive the real UI control** - `3ff75bd` (test)
3. **Task 3: Add negative-gating assertion** - `ecdf755` (test)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/pages/plans/MaterializeTasksModal.tsx` - New modal: incident Combobox, optional per-section checkbox filter, calls POST /api/v1/plans/{id}/materialize-tasks, renders created/skipped results
- `frontend/app/src/pages/plans/PlanDetail.tsx` - 'Materialize tasks' PageHeader action gated on plan.status === 'Approved' && hasEligibleSections; renders the new modal
- `frontend/app/e2e/plan-to-task-materialization.spec.ts` - Test 5 rewritten to drive the real button/modal; apiPostViaPage helper + stale doc comments removed
- `frontend/app/e2e/plans.spec.ts` - One new negative-gating assertion in test 3

## Decisions Made

- Section checkboxes are an opt-in narrowing filter (default: all eligible sections' templates materialize), not a required per-section selection — matches the FRD's "offered... rather than requiring tasks to be written from scratch" one-click framing, and avoids forcing a decision the backend doesn't require (materialize.ts's own `section_ids` param is optional).
- Exactly one new entry point (the PageHeader action) — no second affordance on the sections list or version-history sidebar, since per-section "Link tasks" (03-08) is authoring the template, a separate concern from materializing it.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Known Stubs

None found. Grep for `TODO|FIXME|placeholder|not.?implemented|coming soon` across the four
changed files returned two hits, both benign and unrelated to this plan's own work: a doc
comment in `plan-to-task-materialization.spec.ts` referencing 02-06's historical placeholders,
and a DatePicker CSS selector literally named `placeholder="YYYY-MM-DD"` in pre-existing test 7
code this plan did not touch.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 3 (Plans, Tasks & Resource Requests) UAT gap ref "uat:1" is now closed. All three of this plan's own `<verification>` steps pass:
  1. `MaterializeTasksModal.tsx` compiles clean (`npx tsc --noEmit`, zero errors).
  2. `PlanDetail.tsx` renders the gated action exactly as specified, verified both by static grep and by Playwright's explicit visibility assertions (positive in `plan-to-task-materialization.spec.ts` test 5, negative in `plans.spec.ts` test 3).
  3. `plan-to-task-materialization.spec.ts`'s full 7-test suite passes with `--workers=1`, proving the complete plan-author → reviewer-approve → link-template → create-incident → materialize-via-real-UI-button → task-visible-in-workspace → resource-request chain end-to-end.
- Zero regressions: full e2e suite (11 files, 51 tests) and full backend suite (11 files, 55 tests) both green. All three builds (design-system, backend, frontend app) clean.
- No blockers. Phase 3 remains fully complete; this was a standalone gap-closure plan with no downstream dependents.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Self-Check: PASSED

- `frontend/app/src/pages/plans/MaterializeTasksModal.tsx` — FOUND on disk.
- Commits `5a21b2a`, `3ff75bd`, `ecdf755` — all FOUND in `git log`.
- Build check: `npm run build` in `frontend/design-system` → exit 0; `npm run build` in `backend` (`tsc -p tsconfig.json`) → exit 0; `npm run build` in `frontend/app` (`vite build`) → exit 0.
- `## Known Stubs` section present above; zero blocking stubs found.
- Full e2e suite (11 files, 51 tests, `--workers=1`) green. Full backend suite (11 files, 55 tests) green.
