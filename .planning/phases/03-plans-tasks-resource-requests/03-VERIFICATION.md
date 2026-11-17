---
phase: 03-plans-tasks-resource-requests
verified: 2026-11-17T17:11:54Z
status: gaps_found
score: 3/4 success criteria verified (criterion 2 partial — backend complete, UI trigger missing)
gaps:
  - truth: "A user can link a plan section to a task template, and when an incident references that plan, the linked template is offered for one-click task creation rather than writing the task from scratch."
    status: partial
    reason: >
      The linking half (plan section → task template) is fully built and verified working through the real UI
      (PlanDetail.tsx's "Link tasks" button + LinkTasksModal, covered by plan-to-task-materialization.spec.ts
      step 3 and plans.test.ts). The backend materialization half
      (POST /api/v1/plans/{id}/materialize-tasks → TaskService.createFromTemplate) is also fully built, transactional,
      and verified working end-to-end at the API level (plans.test.ts step 7) and via Playwright driving the real
      fetch call (plan-to-task-materialization.spec.ts step 5-6). However, there is NO user-facing "one-click" UI
      control anywhere in the frontend that calls this endpoint — not on PlanDetail, not on IncidentWorkspace, not
      on CreateTask. The 03-08 plan's own e2e spec explicitly documents this gap in its own code comments
      (plan-to-task-materialization.spec.ts:39-48: "No UI button exists anywhere under
      frontend/app/src/pages/plans/ for POST /api/v1/plans/{id}/materialize-tasks ... a 'Materialize tasks' button
      is a reasonable future UI enhancement") and drives the endpoint directly via an authenticated `fetch()` from
      the browser console rather than clicking any real control. CreateTask.tsx's "Linked plan section" Combobox is
      permanently disabled/empty (hardcoded `planSectionOptionsSource: PlanSection[] = []`) because, per its own
      comment, "TechArch's `incidents` row shape carries no 'linked plan' foreign key this form could follow" — so
      even the literal FRD premise ("when an incident activates and references a plan") has no data path: incidents
      do not reference plans anywhere in the schema, API, or UI. The roadmap's success criterion's exact phrase
      "offered for one-click task creation rather than writing the task from scratch" describes a user-facing
      affordance that does not exist; a planning/command user today has no way to trigger materialization without
      hand-crafting an HTTP request.
    artifacts:
      - path: "frontend/app/src/pages/plans/PlanDetail.tsx"
        issue: "No 'Materialize tasks' button or any control that calls POST /api/v1/plans/{id}/materialize-tasks"
      - path: "frontend/app/src/pages/incidents/IncidentWorkspace.tsx"
        issue: "No affordance offering a linked plan's task templates for one-click creation when viewing an incident"
      - path: "frontend/app/src/pages/tasks-resources/CreateTask.tsx"
        issue: "Linked plan section Combobox is hardcoded to an empty, disabled list (planSectionOptionsSource = []) — no real lookup exists"
      - path: "backend/migrations/1700000000002_incident-ops-schema.js"
        issue: "incidents table has no column referencing a plan (no plan_id / linked_plan_id) — the FRD's 'incident activates and references a plan' premise has no schema support"
    missing:
      - "A UI control (e.g. on PlanDetail or IncidentWorkspace) that calls POST /api/v1/plans/{id}/materialize-tasks against a real incident, surfacing created/skipped results to the user"
      - "A way for an incident to reference/be linked to a plan (schema + API + UI), so 'when an incident references that plan' is an observable, user-driven event rather than an arbitrary incident_id typed into a fetch call"
human_verification:
  - test: "Open the app as a planning_logistics_chief, author and approve a plan with a linked task template, then open or create an incident and look for any button, menu item, or workspace affordance offering that plan's task templates for one-click creation"
    expected: "Per success criterion 2, the user should be able to trigger task creation from the linked template without writing the task from scratch"
    why_human: "Automated review of the entire frontend (grep across frontend/app/src) found zero call sites for POST /api/v1/plans/{id}/materialize-tasks; confirming there is truly no hidden entry point (e.g. a context menu, keyboard shortcut, or dev-only button) benefits from a human click-through of the live app, though the static evidence already strongly indicates this control does not exist."
---

# Phase 3: Plans, Tasks & Resource Requests Verification Report

**Phase Goal:** Planning staff can maintain a versioned, approved plan/SOP repository linked to generated tasks, and command/logistics staff can run tasks and resource requests through to closure — replacing manual spreadsheets and phone-based tracking.
**Verified:** 2026-11-17T17:11:54Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Gate Evidence (cited, not re-run)

Per `03-GATE.md` (`gate_status: passed`, `review_blockers_open: 0`, `boot_smoke: pass`, `browser_suite: pass`, all 7 waves build+test `pass`, 0 fix attempts) and `03-REVIEW.md` (iteration 2, `status: clean`, `blockers: 0`, `warnings: 0`, both prior BLOCKERs B1/B2 independently re-verified with live DB tests and real router-matching execution, not just the fixer's commit messages). `verify gate-evidence 3 --raw` → `pass` (no skipped checks). The documented pre-existing flaky `eventbus.test.ts` (Phase-1 file, NATS/JetStream contention, re-confirmed clean on every re-run) and the refuted SignInCallback.tsx contract-scan false positive (Phase-1 file, confirmed via live curl + full suite) are correctly out of this phase's scope and are not re-litigated here.

These gates prove the code builds, the full backend + e2e test suites pass, and the app boots. They do **not** by themselves prove the roadmap's literal success-criterion language ("offered for one-click task creation") is satisfied — that requires inspecting what UI actually exists, which is this report's job below.

## Goal Achievement

### Observable Truths (Success Criteria from ROADMAP.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A user can author a plan/SOP and move it through Draft → Review → Approved with immutable version history and no self-approval (different named reviewer must approve) | ✓ VERIFIED | Backend: `plans.ts` enforces Draft→Review→Approved state machine (409 on direct Draft→Approved), app-layer self-approval check (403 SELF_APPROVAL_BLOCKED) backstopped by `chk_no_self_approval` DB CHECK constraint, `plan_versions` rows never UPDATEd/DELETEd (only `reviewed_by`/`review_action`/`reviewed_at` columns on the review-outcome row are filled in later; `content_snapshot` itself is write-once at submit-time). Fully exercised in `plans.test.ts`'s `'runs the full plan lifecycle end-to-end'` test (self-approval attempt → 403 → still Review; different reviewer → 200 → Approved, version incremented, prior version's `reviewed_by`/`reviewed_at` readable) and the `'attempting to approve a Draft-status plan directly returns 409'` test. Frontend: `PlanRepository.tsx`→`PlanEditor.tsx`→`ReviewPlanModal.tsx` wired to the real endpoints; `ReviewPlanModal.tsx` renders the exact `SELF_APPROVAL_BLOCKED` message as an `Alert` (not generic, not a toast) and leaves the modal open. `plans.spec.ts` e2e (4 tests) drives this through the real browser with two distinct signed-in identities. |
| 2 | A user can link a plan section to a task template, and when an incident references that plan, the linked template is offered for one-click task creation rather than writing the task from scratch | ✗ PARTIAL | **Linking half: VERIFIED.** `POST .../sections/{sectionId}/link-tasks` works on any plan status (intentionally unrestricted — section metadata, not content), wired through `PlanDetail.tsx`'s "Link tasks" button + `LinkTasksModal.tsx`, proven via `plans.test.ts` and `plan-to-task-materialization.spec.ts` step 3. **Materialization backend: VERIFIED.** `POST /api/v1/plans/{id}/materialize-tasks` → `TaskService.createFromTemplate` is transactional, resolves `default_owner_role`→`owner_id`, computes `due_at` from `incident.opened_at + offset`, proven end-to-end in `plans.test.ts` step 7 and `plan-to-task-materialization.spec.ts` steps 5-6 (task becomes visible in the real embedded `TaskList`). **"Offered for one-click task creation": FAILED.** No UI control anywhere calls this endpoint. `plan-to-task-materialization.spec.ts`'s own code comments (lines 39-48) state plainly: "No UI button exists anywhere under frontend/app/src/pages/plans/ for POST /api/v1/plans/{id}/materialize-tasks ... a reasonable future UI enhancement 03-05 didn't literally build" — and drives the endpoint via a raw authenticated `fetch()` from the browser console, not a real click. Additionally, `incidents` has no column referencing a plan at all (confirmed against the migration DDL and `CreateTask.tsx`'s own comment: "TechArch's incidents row shape carries no 'linked plan' foreign key"), so the literal premise "when an incident references that plan" has no schema support anywhere in the phase. |
| 3 | A user can create, assign (named person or role), approve, track, and close a task, and a task left open past its due time automatically flips to Overdue without any manual status update | ✓ VERIFIED | `tasks.ts`'s fixed state machine (`isValidTransition`) rejects `Overdue` as a PATCH target unconditionally and enforces the `requires_approval` branch correctly (409 INVALID_STATUS_TRANSITION). `overdue-sweep.ts`'s `runOverdueSweep()` is idempotent (WHERE excludes already-Done/Overdue), transactional per-task, writes `task_status_history` with `changed_by=NULL` + a Timeline entry, and is scheduled via `startOverdueSweepScheduler()` called at boot in `server.ts` (confirmed: `grep -n startOverdueSweepScheduler backend/src/server.ts` → found). `closure.ts`'s per-task cascade extends the same audit pattern (per-task history+Timeline row, not one generic entry). Frontend: `TaskList.tsx` polls every 30s (`refetchInterval: 30_000`), documented explicitly as "the mechanism making 03-02's time-based Overdue sweep VISIBLE... without any user action." `tasks.test.ts` (5 tests) + `overdue-sweep.test.ts` (4 tests) cover owner-required 422, due-date-past 422/backfill-override, status-machine 409, and sweep idempotency/background_jobs-row assertions. |
| 4 | A user can create a resource request linked to an incident or task and move it through Draft → Awaiting approval → Approved → Fulfilled (or Declined with a required reason), with its current status visible on both the operating picture and in reporting without a page reload | ✓ VERIFIED (operating-picture half); reporting half correctly deferred to Phase 4 | `resource-requests.ts` implements the full lifecycle with 422 DECLINE_REASON_REQUIRED, the Approved+assigned two-phase fulfill design, transactional status-history+Timeline writes, and `publishEvent('resource_request.status_changed', ...)` fired non-blocking on every transition (fire-and-forget, matching 01-09's established pattern). `operating-picture.ts` (03-09) extends `GET /api/v1/operating-picture/markers` with triangle resource-request markers, toned by status, inheriting the linked incident's location, explicitly excluding Fulfilled/Declined from the query (not just dimmed). `OperatingPicture.tsx` renders triangle markers via `MapPopup`, covered by `operating-picture-resource-markers.spec.ts`. `ResourceRequestList.tsx`/`ResourceRequestDetail.tsx` poll every 30s for "without a page reload" status visibility. The "in reporting" clause is explicitly and correctly out of this phase's scope — `03-04-PLAN.md`'s own must_haves documents this is Phase 4's job ("the actual operating-picture/reporting CONSUMERS... are built in 03-09 (operating-picture) and Phase 4 (reporting), not here"), confirmed against Phase 4's roadmap entry (Requirements F5/F7, reporting dashboard explicitly listed there). This is a deliberate, documented scope boundary, not a gap. |

**Score:** 3/4 fully verified, 1/4 partially verified (backend complete, user-facing "one-click" affordance missing)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `backend/migrations/1700000000004_plans-tasks-resources-schema.js` | tasks/task_status_history/resource_requests/resource_request_status_history DDL | ✓ VERIFIED | 100 lines, all 4 CREATE TABLEs confirmed present |
| `backend/migrations/1700000000006_background-jobs-extend-job-type.js` | job_type CHECK extended with 'task_overdue_sweep' | ✓ VERIFIED | Confirmed via content grep |
| `backend/migrations/1700000000007_plans-schema.js` (renamed from planned `1700000000005`) | plans/plan_versions/plan_sections/plan_task_templates/document_links DDL + fk_tasks_plan_section | ✓ VERIFIED | Rename documented and justified in 03-03-SUMMARY.md (node-pg-migrate out-of-order rejection, no DDL content changed); all 4 CREATE TABLEs + chk_no_self_approval + fk_tasks_plan_section confirmed present |
| `backend/src/modules/incident-ops/tasks.ts` | GET/POST tasks, PATCH status, TaskService.createFromTemplate export | ✓ VERIFIED | 436 lines, substantive, exports `taskRoutes` (default) + `TaskService`, transactional writes confirmed |
| `backend/src/modules/incident-ops/overdue-sweep.ts` | runOverdueSweep, startOverdueSweepScheduler | ✓ VERIFIED | 93 lines, both exports present, wired to `server.ts` at boot |
| `backend/src/modules/incident-ops/closure.ts` | per-task Overdue cascade with task_status_history | ✓ VERIFIED | `task_status_history` INSERT confirmed in per-task loop |
| `backend/src/modules/plans/plans.ts` | Full plans CRUD + workflow + link-tasks | ✓ VERIFIED | 580 lines, all endpoints present and substantive |
| `backend/src/modules/plans/materialize.ts` | POST .../materialize-tasks (separate file, documented discretion) | ✓ VERIFIED | 157 lines, calls `TaskService.createFromTemplate`, transactional batch, partial-success `skipped` array |
| `backend/src/modules/incident-ops/resource-requests.ts` | Full resource-request lifecycle + event publish | ✓ VERIFIED | 500 lines, all endpoints present, `publishEvent` called on every transition |
| `frontend/app/src/pages/plans/PlanRepository.tsx` | Plan list Table | ✓ VERIFIED | Wired to GET /api/v1/plans, status Badge |
| `frontend/app/src/pages/plans/PlanEditor.tsx` | Section-based editor | ✓ VERIFIED | B1 blocker fix confirmed by REVIEW.md iteration 2 (id-less sections no longer silently dropped) |
| `frontend/app/src/pages/plans/PlanDetail.tsx` | Reading view, 720px reading-max, read-only version history | ✓ VERIFIED | 331 lines; "Link tasks" button present (03-08 fix); NO "Materialize tasks" control (see gap above) |
| `frontend/app/src/pages/tasks-resources/TaskList.tsx` | Task table with Badge, 30s poll | ✓ VERIFIED | `incidentId` prop supported, Incident column conditionally omitted, polling confirmed |
| `frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx` | Full detail + approve/decline/fulfill actions | ✓ VERIFIED | 401 lines, Decline modal requires non-empty reason client-side, Approval history Timeline |
| `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` | Tasks/Resources tabs render real embedded components | ✓ VERIFIED | `<TaskList incidentId={...}>` and `<ResourceRequestList incidentId={...}>` confirmed, replacing Phase 2 placeholders |
| `backend/src/modules/incident-ops/operating-picture.ts` | Resource-request triangle markers, excluding terminal statuses | ✓ VERIFIED | UNION query confirmed, Fulfilled/Declined excluded from WHERE clause (not dimmed) |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `tasks.ts` | `timeline.ts` | `withTimelineTransaction` + conditional `TimelineService.append` | ✓ WIRED | Confirmed in both POST and PATCH .../status handlers |
| `tasks.ts` | migration 004 | `task_status_history` INSERT on every transition incl. creation | ✓ WIRED | Confirmed, `from_status=NULL` on creation |
| `overdue-sweep.ts` | `timeline.ts` | `withTimelineTransaction`, one txn per flipped task | ✓ WIRED | Confirmed, `changed_by=NULL` for system attribution |
| `closure.ts` | migration 004 | per-cascaded-task `task_status_history` INSERT | ✓ WIRED | Confirmed per-task loop (not single generic entry) |
| `server.ts` | `overdue-sweep.ts` | `startOverdueSweepScheduler()` at boot | ✓ WIRED | Confirmed via grep against `server.ts` |
| `plans.ts` | migration 007 | `chk_no_self_approval` CHECK as defense-in-depth | ✓ WIRED | App-layer check + DB constraint both confirmed present |
| `migration 007` | migration 004 | `fk_tasks_plan_section` FK closing 03-01's deferred window | ✓ WIRED | Confirmed in migration 007 content |
| `materialize.ts` | `tasks.ts` | `TaskService.createFromTemplate` cross-module call | ✓ WIRED | Confirmed, called inside materialize.ts's own transaction |
| `resource-requests.ts` | `timeline.ts` | `withTimelineTransaction` on every status UPDATE | ✓ WIRED | Confirmed on create/approve/decline/fulfill |
| `resource-requests.ts` | `nats-client.ts` | `publishEvent('resource_request.status_changed', ...)` non-blocking | ✓ WIRED | Confirmed, wrapped in `.catch()`, never blocks HTTP response |
| `PlanRepository.tsx` | `plans.ts` | GET /api/v1/plans via apiGet | ✓ WIRED | Confirmed |
| `ReviewPlanModal.tsx` | `plans.ts` | POST .../review, surfaces SELF_APPROVAL_BLOCKED inline | ✓ WIRED | Confirmed, exact Alert rendering, modal stays open |
| `AppShell.tsx`/`main.tsx` | `PlanRepository.tsx` | route + SideNav link | ✓ WIRED | Confirmed in main.tsx routes |
| `TaskList.tsx` | `tasks.ts` | GET /api/v1/tasks, 30s refetchInterval | ✓ WIRED | Confirmed |
| `ResourceRequestDetail.tsx` | `resource-requests.ts` | approve/decline/fulfill via apiPost | ✓ WIRED | Confirmed |
| `seed.ts` | `opa-client.ts` | role_permissions rows reach OPA via syncRolePermissionsToOpa | ✓ WIRED | Confirmed plans/tasks grants present in seed.ts |
| `IncidentWorkspace.tsx` | `TaskList.tsx` | direct import + `incidentId` prop | ✓ WIRED | Confirmed |
| `IncidentWorkspace.tsx` | `ResourceRequestList.tsx` | direct import + `incidentId` prop | ✓ WIRED | Confirmed |
| `operating-picture.ts` | migration 004 | SELECT resource_requests JOIN incidents, filtered non-terminal | ✓ WIRED | Confirmed |
| `OperatingPicture.tsx` | `ResourceRequestDetail.tsx` | MapPopup deep-link to /resource-requests/{id} | ✓ WIRED | Confirmed in e2e spec |
| **(missing)** `PlanDetail.tsx` or `IncidentWorkspace.tsx` | `materialize.ts` | a UI control calling POST .../materialize-tasks | ✗ **NOT WIRED** | No such control exists anywhere in the frontend; confirmed via repo-wide grep (only the e2e test calls this endpoint, via raw `fetch()`, not a UI click) |
| `incidents` table | `plans` table | a column/FK by which an incident "references" a plan | ✗ **NOT WIRED** | No such column exists in any incident-ops migration; `CreateTask.tsx`'s own code comment confirms this gap |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|-----------------|
| F3 (Plans & Playbooks) | ⚠️ PARTIAL | Authoring/review/version-history/linking all satisfied. The FRD's Process step 5 ("linked task templates... offered to the incident commander/planning staff as one-click task creation") has a complete backend but no user-facing trigger. |
| F4 (Tasks & Resource Requests) | ✓ SATISFIED | Task CRUD, state machine, Overdue sweep, resource-request lifecycle, operating-picture visibility all verified working end-to-end through the real UI. |

### Anti-Patterns Found

None found in the reviewed backend/frontend source files beyond what 03-03/03-05/03-08's own SUMMARY.md self-checks already documented (pre-existing, unrelated placeholders in AppShell.tsx/seed.ts, and LinkTasksModal.tsx's own non-blocking id-fallback doc comment). No TODO/FIXME/placeholder/stub patterns found in any of the 7 backend or 11 frontend files read directly for this verification.

The one genuinely blocking gap identified above (materialize-tasks UI trigger) is not an anti-pattern in the "sloppy code" sense — it is an honestly and repeatedly self-documented scope gap (03-03-SUMMARY.md, 03-05-SUMMARY.md, and 03-08's own e2e spec all independently flag it as "a reasonable future enhancement 03-05 didn't literally build") rather than a hidden stub. The gap is real regardless of how honestly it was documented: the roadmap's literal success-criterion language is not yet true of the shipped product.

### Human Verification Required

See `human_verification` in frontmatter above — one item, confirming no hidden materialize-tasks UI trigger exists beyond what static analysis found.

## Gaps Summary

Three of four roadmap success criteria are fully and robustly verified against the actual codebase, each backed by substantive, well-wired backend implementations, thorough backend integration tests, and real browser-driven e2e Playwright specs exercising the exact UI flows a planning/command/logistics user would use. Code review iteration 2 confirms both prior BLOCKERs are genuinely closed (not just claimed), and all 7 wave gates pass clean with zero skipped checks.

The one gap is success criterion 2's second half: "when an incident references that plan, the linked template is offered for one-click task creation rather than writing the task from scratch." The backend materialization endpoint and its cross-module call into `TaskService.createFromTemplate` are fully built, transactional, and tested — but there is no UI control anywhere that invokes it, and the underlying premise ("incident references that plan") has no schema support at all (no FK from `incidents` to `plans`). The phase's own 03-08 e2e test, written by the same implementation effort, explicitly documents this absence in its own comments and works around it by calling the endpoint directly via browser-console `fetch()` rather than a real UI interaction — which is honest test-authoring but also direct, first-party evidence that the user-facing affordance the roadmap promises does not exist. A planning or command user today cannot, through any screen in the app, see "this incident's plan has 1 linked task template — create it with one click"; they would still need an engineer to call the API by hand.

This is a scoped, well-isolated gap (one plan's worth of frontend work plus a small schema addition) rather than a systemic one — the other three criteria, and the linking/authoring/approval/lifecycle machinery success criterion 2 depends on, are all solid.

---

_Verified: 2026-11-17T17:11:54Z_
_Verifier: Claude (pivota_spec-verifier)_
