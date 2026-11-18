---
phase: 03-plans-tasks-resource-requests
plan: 08
subsystem: ui
tags: [react, playwright, incident-workspace, plans, tasks, resource-requests, integration-test]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "03-05's Plan Repository/Detail/Editor screens, LinkTasksModal, ReviewPlanModal; 03-06's embeddable TaskList/ResourceRequestList (incidentId prop) and CreateTask/CreateResourceRequest incident-scoped routes; 03-03's materialize-tasks endpoint; 02-06's Incident Workspace shell with its two documented placeholders"
provides:
  - "Incident Workspace's Tasks/Resources tabs now render the REAL embedded TaskList/ResourceRequestList (03-06), replacing 02-06's Phase-2 placeholders"
  - "Incident Workspace's 'New task' header action navigates to the real, pre-filled Create Task form instead of 02-06's no-op handler"
  - "Plan Detail reading view gained a 'Link tasks' entry point (previously only PlanEditor's Draft-only flow had one) — closes a real functional gap in the Approved-plan task-linking flow"
  - "CreateResourceRequest now correctly returns to the originating Incident Workspace when launched incident-scoped, instead of always navigating to the standalone detail page"
  - "frontend/app/e2e/plan-to-task-materialization.spec.ts — the phase's own terminal integration-proof spec, proving the complete F3->F4 cross-module handoff in one browser session"
affects: ["phase-4", "future-incident-workspace-work", "future-plans-work"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Incident Workspace tabs mount embedded feature-screen components directly (not via route/navigation) — TaskList/ResourceRequestList render only while their tab is active, so their own ~30s poll doesn't run against a hidden tab"
    - "Cross-module Playwright integration specs (this phase's terminal plan) call a backend endpoint directly via an authenticated page.evaluate(fetch) helper when no dedicated UI trigger button exists yet for that endpoint, documenting this explicitly as an acceptable proof of backend integration, distinct from the critical UI-visibility assertion that follows it"

key-files:
  created:
    - frontend/app/e2e/plan-to-task-materialization.spec.ts
  modified:
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/src/pages/plans/PlanDetail.tsx
    - frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx

key-decisions:
  - "PlanDetail.tsx (the reading view routed at /plans/{id}, where an Approved plan is actually viewed) had NO Link Tasks entry point at all — only PlanEditor.tsx's Draft-only editing flow wired LinkTasksModal. Added a 'Link tasks' button per section, reusing the same modal, since link-tasks is explicitly status-unrestricted (plans.ts's own documented decision: task templates are section metadata, not plan content) and this plan's own materialize-to-real-incident flow requires linking a template to an ALREADY-APPROVED plan without reopening the Draft editor."
  - "CreateResourceRequest.tsx always navigated to the standalone /resource-requests/{id} detail page on success, even when launched with routeIncidentId from an Incident Workspace's Resources tab — fixed to mirror CreateTask.tsx's already-correct incident-aware navigate(), so the 'same workspace, no page reload' success criterion actually holds."
  - "Materialize-tasks has no dedicated UI trigger button (03-05's scope didn't build one for POST /api/v1/plans/{id}/materialize-tasks) — the e2e spec calls it directly via an authenticated page.evaluate(fetch), documented inline as an acceptable proof of backend integration; the test's critical assertion is the SUBSEQUENT UI-visibility check in the Incident Workspace's real TaskList, not the API call's 200 itself."
  - "The materialization spec uses eoc_director (not planning_logistics_chief) to create the test incident, since planning_logistics_chief is deliberately 'incidents' VIEW-only per seed.ts (only incident_commander/eoc_director hold incidents:create) — reused the already-present eoc_director reviewer identity rather than introducing a third seeded account."

patterns-established:
  - "An Incident Workspace tab panel conditionally renders its embedded component only `activeTab === '<tab>' ? <Component .../> : null` (not just toggling CSS visibility) so that component's own internal polling/queries don't run while the tab is hidden."

# Metrics
duration: 35min
completed: 2026-11-17
---

# Phase 3 Plan 08: Incident Workspace Integration Summary

**Incident Workspace's Tasks/Resources tabs now embed the real TaskList/ResourceRequestList components, and a 7-step Playwright spec proves the full plan-author-to-materialized-task-visible-in-workspace handoff in one browser session — closing two real gaps found along the way: PlanDetail had no Link Tasks button, and CreateResourceRequest didn't return to its originating workspace.**

## Performance

- **Duration:** ~35 min
- **Started:** 2026-11-17T15:06:00Z (approx, first task commit)
- **Completed:** 2026-11-17T15:41:23Z
- **Tasks:** 2 (plus 2 auto-fixed deviations)
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- Incident Workspace's Tasks/Resources tab placeholders ("Tasks ship in a later phase" / "Resource requests ship in a later phase" — 02-06's exact documented Phase-2 strings) replaced with the real, incident-scoped `<TaskList incidentId={...}>` / `<ResourceRequestList incidentId={...}>` components from 03-06
- Incident Workspace's "New task" header action now navigates to the real pre-filled `/incidents/{id}/tasks/new` form instead of 02-06's no-op handler
- Discovered and fixed a real functional gap: Plan Detail's reading view (where an Approved plan is actually viewed) had no way to reach LinkTasksModal at all
- Discovered and fixed a real navigation bug: CreateResourceRequest always went to the standalone detail page, breaking the "same workspace, no reload" flow when launched from an Incident Workspace
- A single, comprehensive Playwright spec proves the complete roadmap-stated Phase 3 goal end-to-end: plan authoring → cross-reviewer approval → task-template linking on an Approved plan → real incident creation → materialization → the resulting task visible in that SAME incident's real embedded TaskList → a resource request created in-workspace appearing live with no page reload

## Task Commits

Each task (plus deviations) was committed atomically:

1. **Task 1: Replace Incident Workspace's Tasks/Resources placeholders with real embedded components** - `ca6fcd4` (feat)
2. **Deviation (Rule 1 - Bug): CreateResourceRequest navigation fix** - `4aa8779` (fix)
3. **Deviation (Rule 2 - Missing Critical): PlanDetail Link Tasks entry point** - `ef401b7` (feat)
4. **Task 2: End-to-end Playwright proof** - `1763e9f` (test)

_No plan-metadata commit yet — this SUMMARY.md + STATE.md update follows._

## Files Created/Modified
- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` - Tasks/Resources tabs now mount real TaskList/ResourceRequestList; "New task" action navigates for real; Reports tab placeholder deliberately left untouched (documented inline, out of F3/F4 scope)
- `frontend/app/src/pages/plans/PlanDetail.tsx` - Added a "Link tasks" button per section in the Sections sidebar Card, wiring LinkTasksModal (previously only reachable from PlanEditor's Draft-only flow)
- `frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx` - navigate() now returns to the originating Incident Workspace when routeIncidentId is present, mirroring CreateTask.tsx's already-correct pattern
- `frontend/app/e2e/plan-to-task-materialization.spec.ts` - new 7-step full-stack Playwright spec proving the complete F3→F4 cross-module handoff

## Decisions Made
- PlanDetail needed its own Link Tasks entry point, separate from PlanEditor's — task templates are section metadata (status-unrestricted per plans.ts), so linking must work on an Approved plan without reopening the Draft editor. See key-decisions in frontmatter for full rationale.
- CreateResourceRequest's post-submit navigation now matches CreateTask's incident-aware pattern.
- The materialization spec calls `POST /api/v1/plans/{id}/materialize-tasks` directly via an authenticated `fetch` from the browser session (no dedicated UI button exists for this endpoint yet — confirmed by inspecting all of `frontend/app/src/pages/plans/`) — documented inline as acceptable proof of backend integration, with the REAL critical assertion being the subsequent UI-visibility check.
- Used `eocdirector@epmp.local` (not `planner@epmp.local`) to create the test incident, since `planning_logistics_chief` is seeded `incidents`-view-only; reused the already-present reviewer identity rather than adding a third account.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CreateResourceRequest.tsx always navigated to the standalone detail page, even when incident-scoped**
- **Found during:** Task 2 (writing the Playwright spec's step 7 — the Resources-tab-created-request-visible-live assertion)
- **Issue:** `navigate(\`/resource-requests/${response.id}\`)` ran unconditionally on submit success, ignoring `routeIncidentId` — so launching "New resource request" from an Incident Workspace's Resources tab would always leave that workspace, breaking the "same workspace, no page reload" requirement CreateTask.tsx already satisfies correctly for the task-creation equivalent.
- **Fix:** `navigate(routeIncidentId ? \`/incidents/${routeIncidentId}\` : \`/resource-requests/${response.id}\`)`, mirroring CreateTask.tsx's existing pattern exactly.
- **Files modified:** `frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx`
- **Verification:** Playwright spec step 7 asserts the URL returns to `/incidents/{id}` and the new request appears in the embedded ResourceRequestList without a full navigation; full tasks-resources.spec.ts suite re-run clean afterward (zero regressions in the standalone flow).
- **Committed in:** `4aa8779`

**2. [Rule 2 - Missing Critical] PlanDetail.tsx had no Link Tasks entry point at all**
- **Found during:** Task 2 (writing the Playwright spec's step 3 — linking a task template to the now-Approved plan "directly from the Plan Detail reading view," per the plan's own task description)
- **Issue:** `LinkTasksModal` was only ever rendered from `PlanEditor.tsx`'s Draft-editing flow (gated on `section.id` existing, itself only reachable while editing a Draft or re-opening `/plans/{id}/edit`). `PlanDetail.tsx` — the page an Approved plan is actually viewed from, and where this plan's own objective explicitly says linking should happen — rendered only a read-only linked-task COUNT, with no button to open the modal. Since `link-tasks` is action-level `edit` and intentionally status-unrestricted (03-03's documented decision), this was a real functional gap blocking the plan's own described flow, not a scope question.
- **Fix:** Added a "Link tasks" `Button` per section inside the existing Sections `Card`, wiring the same `LinkTasksModal` component `PlanEditor.tsx` already uses, with `onLinked` invalidating the `['plan', id]` query so the real linked-template count refetches immediately.
- **Files modified:** `frontend/app/src/pages/plans/PlanDetail.tsx`
- **Verification:** Playwright spec step 3 passes — the modal opens, a new template is defined and submitted, the modal closes, and the section's "1 linked task" count updates; `npx tsc --noEmit` and `npm run build -w frontend/app` both clean; full plans.spec.ts suite re-run clean afterward.
- **Committed in:** `ef401b7`

---

**Total deviations:** 2 auto-fixed (1 Rule 1 bug, 1 Rule 2 missing critical)
**Impact on plan:** Both fixes were necessary for the plan's own described integration flow to actually work end-to-end through the real UI (not just via direct API calls) — no scope creep, no architectural changes.

## Issues Encountered

- First Playwright run of the new spec failed on `modal.getByLabel('Name', { exact: true })` timing out — `TextField`'s `required` prop appends a visually-hidden `*` to the label text, so the accessible name is `"Name *"`, not `"Name"`. Fixed by switching to `exact: false`, consistent with every other label match in this codebase's existing e2e specs. Not a production bug — a test-authoring mismatch with an already-established, already-correct component behavior.
- Second run failed on incident creation timing out — `planning_logistics_chief` (the identity test 3/5 continue to use as plan author) is seeded `incidents`-VIEW-only (only `incident_commander`/`eoc_director` hold `incidents:create`, per `seed.ts`'s own documented role split). Fixed by using `eoc_director` (already present in the test as the plan reviewer) for the one incident-creation step instead. Not a production bug — a test-identity mismatch with the real, intentional seeded permission split.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 3's roadmap goal — "Planning staff can maintain a versioned, approved plan/SOP repository linked to generated tasks, and command/logistics staff can run tasks and resource requests through to closure" — is now demonstrated as a single, observable, cross-feature browser flow (this plan's own spec), not just as isolated per-plan proofs.
- This was the phase's terminal integration-proof plan (wave 6, depends on everything else). Only 03-09 remains in Phase 3's plan list.
- Full regression confirmation performed in this plan: all 9 e2e spec files (32 tests total) pass; full backend suite (11 files, 55 tests) passes; `tsc --noEmit` and all three builds (backend, design-system, frontend/app) are clean.
- No blockers for 03-09 or Phase 4.

## Known Stubs

None found. Grep for TODO/FIXME/placeholder/not-implemented across all 4 changed files surfaced only documentation comments explaining deliberately-deferred, out-of-scope Phase-2 placeholders (Reports tab/SITREP button/Map-thumbnail — none touched by this plan) and one literal `placeholder="YYYY-MM-DD"` HTML attribute selector in the new test file. No blocking stubs.

## Self-Check: PASSED

- Created file `frontend/app/e2e/plan-to-task-materialization.spec.ts` confirmed on disk.
- All 4 commits (`ca6fcd4`, `4aa8779`, `ef401b7`, `1763e9f`) confirmed present in `git log`.
- Plan-level build check: `npm run build -w backend` (exit 0), `npm run build -w frontend/design-system` (exit 0), `npm run build -w frontend/app` (exit 0) — all three ran and passed after the last task.
- Full backend test suite: 11 files / 55 tests passed (including the previously-flagged-flaky `eventbus.test.ts`, clean this run).
- Full e2e suite: 9 spec files / 32 tests passed, including the new `plan-to-task-materialization.spec.ts` (7/7), re-run twice to confirm stability.
- `npx tsc --noEmit` clean across `src/**` and `e2e/**`.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*
