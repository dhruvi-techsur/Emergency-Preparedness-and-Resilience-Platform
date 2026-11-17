---
phase: 03-plans-tasks-resource-requests
plan: 06
subsystem: ui
tags: [react, react-query, tasks, resource-requests, rbac-ux, playwright, polling]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "03-01's tasks API + state machine, 03-02's Overdue sweep scheduler, 03-04's resource-request lifecycle API, 03-07's tasks/resource_requests role_permissions seed grants"
  - phase: 01-platform-foundation-deployable-shell
    provides: "01-10's AppShell layout route, 01-05/01-06's design-system form/overlay/data primitives"
provides:
  - "Six routed/embeddable Task & Resource-Request screens (Task List, Create/Edit Task, Task Detail, Resource Request List, Create/Edit Resource Request, Resource Request Detail) composed entirely from window.EPMP"
  - "A 'Coordinate' SideNav group, role_permissions-driven like the existing Prepare/Monitor/Activate/Admin groups"
  - "TaskList/ResourceRequestList both export accepting an optional incidentId prop for 03-07's Incident Workspace tab embedding"
  - "Backend additions: GET /api/v1/tasks/{id}, PATCH /api/v1/tasks/{id}/owner, GET /api/v1/resource-requests/{id} — thin single-record/metadata endpoints TechArch's literal table omitted"
affects: ["03-07", "03-08", "03-09"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "~30s refetchInterval as the Phase-3 mechanism making a time-based backend sweep (03-02's Overdue flip) and an event-published-but-unsubscribed status change (03-04's resource_request.status_changed) both visible to the user without any manual action — same simplification 02-07's Operating Picture page documented for its own identical problem"
    - "Personnel lookup via GET /api/v1/incidents/personnel (not /admin/users) reused a second time for Task owner/filter Comboboxes — the roles holding tasks permissions deliberately hold no admin:view permission, same CommandRoleModal-documented gap"

key-files:
  created:
    - frontend/app/src/pages/tasks-resources/TaskList.tsx
    - frontend/app/src/pages/tasks-resources/CreateTask.tsx
    - frontend/app/src/pages/tasks-resources/TaskDetail.tsx
    - frontend/app/src/pages/tasks-resources/ResourceRequestList.tsx
    - frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx
    - frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx
    - frontend/app/e2e/tasks-resources.spec.ts
  modified:
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts
    - backend/src/modules/incident-ops/tasks.ts
    - backend/src/modules/incident-ops/resource-requests.ts

key-decisions:
  - "Added GET /api/v1/tasks/{id} and GET /api/v1/resource-requests/{id} (both embedding status_history) rather than a client-side find-in-list fallback — TechArch's literal endpoint table has neither, but a full-list fetch-and-filter on every detail-page load is both wasteful and silently breaks once pagination ever truncates the list; same precedent as 03-03's GET /api/v1/plans/{id}"
  - "Added PATCH /api/v1/tasks/{id}/owner as a thin metadata-only write (no status_history row, same metadata-vs-transition distinction 03-04's fulfill endpoint documents for assigned_to) to make Task List's mockup-specified bulk 'Reassign' action actually work — no prior endpoint existed for reassignment"
  - "Task/Create Task's owner Combobox sources from GET /api/v1/incidents/personnel, not GET /api/v1/admin/users — the 4 roles holding tasks permissions (incident_commander, eoc_director, planning_logistics_chief, field_responder) all hold incidents:view but NONE hold admin:view (02-01's seed decision), confirmed before writing the component rather than assumed"
  - "CreateTask's 'Linked plan section' Combobox renders disabled/empty rather than querying a nonexistent incident->plan link — TechArch's incidents row shape carries no FK to a specific plan this form could follow, and the plan's own task description explicitly allows 'else empty/disabled' as an acceptable outcome"

patterns-established:
  - "Bulk row-selection actions (Table's own checkbox column, not a design-system feature) compose directly against Table's existing columns prop by prepending a synthetic '__select' column — no change needed to the Table component itself"

# Metrics
duration: 35min
completed: 2026-11-17
---

# Phase 3 Plan 06: Tasks & Resource Requests UI Summary

**Six routed/embeddable screens (Task List, Create/Edit Task, Task Detail, Resource Request List, Create/Edit Resource Request, Resource Request Detail) make 03-01/03-02/03-04's task and resource-request APIs observable to a real browser user for the first time, proven end-to-end by a Playwright spec whose central assertion watches a backdated task flip to the Overdue Badge purely through 03-02's real scheduler and this plan's own ~30s polling — zero manual action.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-17T14:19:00Z (approx, immediately following 03-05's wave-4 gate commit)
- **Completed:** 2026-11-17T14:54:28Z
- **Tasks:** 3
- **Files modified:** 11 (7 created, 4 modified)

## Accomplishments

- **Task List (S4.1)** — `/tasks` (also embeddable with an `incidentId` prop for 03-07): Table with Task (linked)/Status (exact FRD Badge tone mapping: Open=info, In progress=brand, Awaiting approval=warning, Done=success, Overdue=danger)/Owner/Due/Incident (omitted when embedded)/Linked plan section, toolbar search/status/owner/due-window filters, row-selection bulk actions ("Mark done" as a per-row `PATCH .../status` loop, "Reassign" via a new owner-write endpoint), ~30s `refetchInterval` as the specific mechanism making 03-02's Overdue sweep visible without any user action.
- **Create/Edit Task (S4.2)** — `/tasks/new` and `/incidents/{id}/tasks/new`: Title/Description/Owner/Due/Incident/Linked-plan-section fields; owner-required client-side pre-check shows the exact FRD "Assign an owner before creating this task." Alert and focuses the field before any server round-trip; past-due-date warning gates resubmission behind a "This is a retroactive entry" Checkbox that sets `confirmed_backfill:true`.
- **Task Detail (S4.3)** — `/tasks/{id}`: action buttons re-derived from the task's current status per the mockup's exact next-valid-state table (Open→"Mark in progress", In progress→"Submit for approval"/"Mark done" depending on `requires_approval`, Awaiting approval→"Mark done", Done/Overdue→"Reopen"); a failed transition surfaces the exact 409 `INVALID_STATUS_TRANSITION` message as an Alert; Timeline-rendered status history sourced from a new `GET /api/v1/tasks/{id}` that embeds the real `task_status_history` rows.
- **Resource Request List (S4.4)** — `/resource-requests` (also embeddable): exact FRD status tone mapping (Draft=neutral, Awaiting approval=warning, Approved=info, Fulfilled=success, Declined=danger), same ~30s polling — the SPECIFIC mechanism satisfying success criterion 4's "status visible... without a page reload" since 03-04's backend publishes to NATS but no frontend subscriber exists yet.
- **Create/Edit Resource Request (S4.5)** — `/resource-requests/new`: single "Submit request" action (03-04's backend immediately transitions Draft→Awaiting approval), quantity/incident validation.
- **Resource Request Detail (S4.6/S4.7)** — `/resource-requests/{id}`: status-conditional action set (Approve direct / Decline modal / Assign / Mark fulfilled) matching the mockup's exact state table; Decline's modal confirm button is disabled client-side while the reason field is empty, mirroring 03-04's 422 `DECLINE_REASON_REQUIRED`; Assign and Mark fulfilled both call the same `POST .../fulfill` per 03-04's documented two-phase assign-then-fulfill behavior.
- **"Coordinate" SideNav group**: `GET /api/v1/me/nav-config` now independently derives "Tasks" (any `tasks` permission) and "Resources" (any `resource_requests` permission) items into a shared "Coordinate" group, identical role_permissions-driven pattern to Prepare/Monitor/Activate/Admin.
- **Backend additions** (Rule 3 — blocking, same precedent 03-03/03-05 set for `GET /api/v1/plans/{id}`): `GET /api/v1/tasks/{id}` and `GET /api/v1/resource-requests/{id}` (both embedding `status_history`), plus `PATCH /api/v1/tasks/{id}/owner` for Task List's bulk-reassign action — none existed in TechArch's literal endpoint table.
- **`e2e/tasks-resources.spec.ts`** (7 test cases, all passing against the real compose stack): full task lifecycle (create → appears in list → Mark in progress → owner-required validation → the critical Overdue-visibility proof) and full resource-request lifecycle (create → Awaiting approval → Decline blocked-then-enabled → Declined).

## Task Commits

Each task was committed atomically:

1. **Task 1: Task List, Create Task, Task Detail (S4.1-S4.3)** - `1fc06ac` (feat)
2. **Task 2: Resource Request List, Create/Edit, Detail (S4.4-S4.7)** - `2607b95` (feat)
3. **Task 3: AppShell/nav wiring + Playwright e2e coverage** - `cefd49a` (feat)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `frontend/app/src/pages/tasks-resources/TaskList.tsx` - Task list with filters, bulk actions, exact status Badge tone mapping, Overdue-visibility polling
- `frontend/app/src/pages/tasks-resources/CreateTask.tsx` - Create/edit form with owner-required and past-due-date client-side gates
- `frontend/app/src/pages/tasks-resources/TaskDetail.tsx` - Status-driven action buttons, Timeline status history
- `frontend/app/src/pages/tasks-resources/ResourceRequestList.tsx` - Resource request list with filters, exact status Badge tone mapping, no-reload-visibility polling
- `frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx` - Single-action create form (direct to Awaiting approval)
- `frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx` - Approve/Decline/Assign/Mark-fulfilled action set, Decline reason client-side guard
- `frontend/app/src/main.tsx` - `/tasks*`/`/resource-requests*` routes appended to 03-05's route tree
- `backend/src/modules/auth-org/routes.ts` - "Coordinate" nav group derivation
- `backend/src/modules/incident-ops/tasks.ts` - `GET /api/v1/tasks/{id}`, `PATCH /api/v1/tasks/{id}/owner` additions
- `backend/src/modules/incident-ops/resource-requests.ts` - `GET /api/v1/resource-requests/{id}` addition
- `frontend/app/e2e/tasks-resources.spec.ts` - Full-stack Playwright proof, including the Overdue-visibility assertion

## Decisions Made

- Two single-record GET endpoints and one owner-reassignment PATCH were added to the backend as thin, same-shape extensions of existing handlers (reusing each module's own `fetchXRow`/`shapeXRow` helpers) rather than client-side list-filtering workarounds — the same reasoning 03-03/03-05 already established for the identical `GET /api/v1/plans/{id}` gap.
- Task/CreateTask's personnel Combobox was built against `GET /api/v1/incidents/personnel` from the start (not `/admin/users`), having confirmed via `seed.ts` that all 4 roles holding `tasks` permissions lack `admin:view` — avoiding the dead-end CommandRoleModal.tsx had already documented and fixed for an identical case.
- The "Linked plan section" field in Create Task is a deliberately disabled/empty Combobox, not a query against a nonexistent incident→plan foreign key — this plan's own task description explicitly allows this outcome.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added GET /api/v1/tasks/{id} and GET /api/v1/resource-requests/{id}**
- **Found during:** Task 1/Task 2 (writing TaskDetail.tsx/ResourceRequestDetail.tsx)
- **Issue:** TechArch's literal endpoint table has no single-record GET for either resource — only list + status-mutation endpoints. A client-side fetch-the-whole-list-and-filter-by-id approach would be both wasteful and silently break once pagination ever truncates the list (the live database already has 140+ fixture tasks from this phase's repeated test runs).
- **Fix:** Added `GET /api/v1/tasks/{id}` and `GET /api/v1/resource-requests/{id}`, each reusing the module's existing `fetchXRow`/`shapeXRow` helpers and additionally embedding the real `*_status_history` rows for the Detail pages' Timeline sections.
- **Files modified:** `backend/src/modules/incident-ops/tasks.ts`, `backend/src/modules/incident-ops/resource-requests.ts`
- **Verification:** Both endpoints exercised live by the Playwright spec (Task Detail / Resource Request Detail pages load real data); full backend suite (11/11 files, 55/55 tests) stayed green with zero regressions.
- **Committed in:** `1fc06ac` (Task 1), `2607b95` (Task 2)

**2. [Rule 3 - Blocking] Added PATCH /api/v1/tasks/{id}/owner**
- **Found during:** Task 1 (Task List's bulk "Reassign" action)
- **Issue:** The mockup's own S4.1 spec names "Reassign" as a bulk action, but no endpoint exists anywhere in the API for changing a task's owner independent of a status transition.
- **Fix:** Added a thin metadata-only `PATCH /api/v1/tasks/{id}/owner` (no `task_status_history` row — assignment is metadata, not a transition, same distinction 03-04's `fulfill` endpoint documents for `assigned_to`).
- **Files modified:** `backend/src/modules/incident-ops/tasks.ts`
- **Verification:** Backend `tsc --noEmit` and full test suite clean; endpoint callable (not exercised by the Playwright spec directly, since the spec's own task budget focused on the single-task-reassign path being out of scope for this plan's 7 required assertions).
- **Committed in:** `1fc06ac` (Task 1)

**3. [Rule 1 - Bug] Playwright spec's DatePicker fill only set the date, leaving time at midnight**
- **Found during:** Task 3 (first Playwright run)
- **Issue:** `DatePicker`'s `withTime` prop renders TWO separate inputs (date text + a native `time` input); filling only the date field defaulted the time to `00:00`, which for a "due in 2 hours" future calendar date still reads as already-past once midnight has elapsed within the same test run — tripping CreateTask's own past-due-date gate and leaving the form on `/tasks/new` instead of redirecting.
- **Fix:** Added a `fillDateTimePicker` helper that fills both the date and time inputs.
- **Files modified:** `frontend/app/e2e/tasks-resources.spec.ts`
- **Verification:** Re-ran; test 1 passed.
- **Committed in:** `cefd49a` (Task 3, test file's first commit — fix predates any separate commit)

**4. [Rule 1 - Bug] Test 2/5's Task List assertions buried by 140+ accumulated fixture tasks**
- **Found during:** Task 3 (Playwright run)
- **Issue:** The live compose-stack database has accumulated 140+ tasks (76 already `Overdue`) across this phase's repeated plan/test runs. Task List's default 25-row page, sorted ASC by `due_at`, buried this test's own newly-created task off page 1 — not a defect in the Task List component itself, just a live-database volume problem the test needed to account for.
- **Fix:** Used Task List's own real server-side `owner`/`status` query-param filters (Owner filter in test 2, Status=Overdue + Owner filter combined in test 5) to narrow to just this test's rows, same reasoning 01-11's admin-users-roles.spec.ts documents for an identical "can't rely on default sort/page" problem.
- **Files modified:** `frontend/app/e2e/tasks-resources.spec.ts`
- **Verification:** Re-ran; both tests passed.
- **Committed in:** `cefd49a` (Task 3)

**5. [Rule 1 - Bug] Ambiguous `getByRole('option')` locator in the Create Resource Request test**
- **Found during:** Task 3 (Playwright run)
- **Issue:** A bare `page.getByRole('option')` matched BOTH the Incident Combobox's `<li role="option">` listbox items AND every native `<select>`'s (Resource type, Requesting role) implicit hidden `<option>` children on the same page — the click target resolved to a non-visible native `<option>`, hanging for the full 120s timeout.
- **Fix:** Scoped the locator to `.ep-combobox__listbox [role="option"]` specifically.
- **Files modified:** `frontend/app/e2e/tasks-resources.spec.ts`
- **Verification:** Re-ran; test passed.
- **Committed in:** `cefd49a` (Task 3)

**6. [Rule 3 - Blocking] planner@epmp.local's empty jurisdiction_scope blocked the Create Resource Request test**
- **Found during:** Task 3 (Playwright run)
- **Issue:** `planner@epmp.local` (03-05's seeded `planning_logistics_chief` identity) is JIT-provisioned by `sso.ts` with `jurisdiction_scope = '{}'` on first login — by design, identical root cause to 02-07's own documented `commander@epmp.local` fixture fix. `GET /api/v1/incidents`'s list query correctly enforces jurisdiction-scope filtering (closed since 02-05/02-07), so with an empty scope this identity's Create Resource Request form's Incident Combobox showed zero options, making the "select an incident" step impossible.
- **Fix:** Added a one-time test-fixture grant (`ensurePlannerHasJurisdictionScope`, direct Postgres `UPDATE`) giving `planner@epmp.local` the same 'Default Agency' jurisdiction scope every other e2e spec's incidents already use — identical pattern to 02-07's `ensureCommanderHasJurisdictionScope`. No production code (sso.ts/seed.ts) changed.
- **Files modified:** `frontend/app/e2e/tasks-resources.spec.ts`
- **Verification:** Re-ran; test passed, and `planner@epmp.local`'s scope now persists across future test runs against this same compose volume.
- **Committed in:** `cefd49a` (Task 3)

---

**Total deviations:** 6 auto-fixed (2 blocking backend-API-gap additions, 1 blocking test-fixture grant, 3 Playwright-test-only bugs). **Impact on plan:** All auto-fixes were necessary for the plan's own stated success criteria to be provable at all — the two backend GET additions and the owner-PATCH addition are the same "TechArch's literal table omits this but the UI genuinely needs it" pattern 03-03/03-05 already established; the test-fixture and locator fixes are confined entirely to the new Playwright spec file, touching zero production code. No scope creep.

## Issues Encountered

- Multiple stray `tsx watch src/server.ts` / `vite` processes from earlier sessions in this same sandbox were already bound to ports 8080/5173 when this plan's own `<verify>` steps tried to start fresh instances — same category of sandbox process-lifecycle artifact 03-05's own SUMMARY documented. Killed the stray processes cleanly (except the single healthy pre-existing Vite dev server on 5173, which was already serving up-to-date code via HMR and became this plan's own Playwright `baseURL` target) and restarted the backend fresh. No code change required.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 03-07 (Incident Workspace Tasks/Resources tab embedding) can proceed immediately: `TaskList`/`ResourceRequestList` both already accept and correctly honor the optional `incidentId` prop this plan built in from the start (Incident column omitted, query pre-filtered, "New task"/"New resource request" routed to the incident-scoped create paths) — 03-07's own plan document already anticipates this.
- 03-08/03-09 inherit a working "Coordinate" SideNav group and the two new single-record GET endpoints (`/api/v1/tasks/{id}`, `/api/v1/resource-requests/{id}`) as reusable building blocks.
- The Overdue-visibility Playwright assertion is now the concrete, automated, end-to-end proof that 03-02's time-based sweep reaches a real browser user — any future regression in either the scheduler or the frontend's polling wiring will be caught by this spec, not just by 03-02's own backend-only integration test.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all created/modified files returned only legitimate HTML `placeholder` attributes (search-field hints) and pre-existing Phase-1 `AppShell.tsx` "coming soon" search/alerts no-ops (that file was not modified by this plan — only `main.tsx`/`routes.ts` were touched, per 03-05's established shared-file convention).

## Self-Check: PASSED

- `frontend/app/src/pages/tasks-resources/TaskList.tsx` — FOUND
- `frontend/app/src/pages/tasks-resources/CreateTask.tsx` — FOUND
- `frontend/app/src/pages/tasks-resources/TaskDetail.tsx` — FOUND
- `frontend/app/src/pages/tasks-resources/ResourceRequestList.tsx` — FOUND
- `frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx` — FOUND
- `frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx` — FOUND
- `frontend/app/e2e/tasks-resources.spec.ts` — FOUND
- Commit `1fc06ac` (Task 1) — FOUND
- Commit `2607b95` (Task 2) — FOUND
- Commit `cefd49a` (Task 3) — FOUND
- Plan-level build (`cd frontend/design-system && npm run build` → vite build): exit 0, no errors
- Plan-level build (`cd frontend/app && npm run build` → vite build): exit 0, 426.83 kB JS bundle, no errors
- Plan-level build (`cd backend && npm run build` → tsc -p tsconfig.json): exit 0, no output
- Plan-level type-check (`cd frontend/app && npx tsc --noEmit`): exit 0, no output
- Full backend test suite (`npx vitest run`, with db+nats+opa running): 11/11 files passed, 55/55 tests passed, zero regressions
- Task 3's own Playwright spec (`npx playwright test e2e/tasks-resources.spec.ts --workers=1`): 7/7 tests passed against the real compose stack (db, nats, opa, keycloak, backend dev server, frontend dev server), including the critical Overdue-visibility assertion
- Regression check: `e2e/app-shell.spec.ts`, `e2e/plans.spec.ts`, `e2e/incident-list-create.spec.ts`, `e2e/incident-workspace.spec.ts` (all touching shared files this plan also modified) — 17/17 passed, zero regressions
- No blocking or cosmetic stubs found in any created/modified file
