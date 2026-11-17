---
phase: 3
status: issues_found
blockers: 2
warnings: 4
files_reviewed: 39
files_reviewed_list:
  - backend/keycloak/epmp-realm.json
  - backend/migrations/1700000000004_plans-tasks-resources-schema.js
  - backend/migrations/1700000000006_background-jobs-extend-job-type.js
  - backend/migrations/1700000000007_plans-schema.js
  - backend/scripts/seed.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/incident-ops/closure.ts
  - backend/src/modules/incident-ops/incidents.test.ts
  - backend/src/modules/incident-ops/operating-picture.ts
  - backend/src/modules/incident-ops/overdue-sweep.test.ts
  - backend/src/modules/incident-ops/overdue-sweep.ts
  - backend/src/modules/incident-ops/resource-requests.test.ts
  - backend/src/modules/incident-ops/resource-requests.ts
  - backend/src/modules/incident-ops/routes.ts
  - backend/src/modules/incident-ops/tasks.test.ts
  - backend/src/modules/incident-ops/tasks.ts
  - backend/src/modules/plans/materialize.ts
  - backend/src/modules/plans/plans.test.ts
  - backend/src/modules/plans/plans.ts
  - backend/src/modules/plans/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/helpers/sign-in.ts
  - frontend/app/e2e/operating-picture-resource-markers.spec.ts
  - frontend/app/e2e/plan-to-task-materialization.spec.ts
  - frontend/app/e2e/plans.spec.ts
  - frontend/app/e2e/tasks-resources.spec.ts
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
  - frontend/app/src/pages/plans/LinkTasksModal.tsx
  - frontend/app/src/pages/plans/PlanDetail.css
  - frontend/app/src/pages/plans/PlanDetail.tsx
  - frontend/app/src/pages/plans/PlanEditor.tsx
  - frontend/app/src/pages/plans/PlanRepository.tsx
  - frontend/app/src/pages/plans/ReviewPlanModal.tsx
  - frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx
  - frontend/app/src/pages/tasks-resources/CreateTask.tsx
  - frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx
  - frontend/app/src/pages/tasks-resources/ResourceRequestList.tsx
  - frontend/app/src/pages/tasks-resources/TaskDetail.tsx
  - frontend/app/src/pages/tasks-resources/TaskList.tsx
reviewed_at: 2026-11-17T16:42:54Z
iteration: 1
---

# Phase 3 Code Review

## BLOCKERs

### B1: Sections added to a plan during an EDIT session are silently discarded — never persisted
- **File:** frontend/app/src/pages/plans/PlanEditor.tsx:163-170
- **Category:** bug
- **Evidence:**
  ```ts
  const updated = await apiPatch<PlanDetailResponse>(`/api/v1/plans/${planId}`, {
    name: name.trim(),
    jurisdiction_id: jurisdictionId,
    sections: sections
      .filter((s) => s.id)                                   // <-- drops every new section
      .map((s) => ({ id: s.id!, heading: s.heading, body: s.body })),
  });
  ```
  `handleAddSection` (line 202-205) is reachable at any time, including while editing an already-persisted plan (`isEditing=true`), and simply appends a new `EditorSection` with `id: undefined` to local state — the "+ Add section" button is never disabled in edit mode (confirmed: no `disabled={isEditing && ...}` guard anywhere near line 332). The create-branch of `persistPlan` (lines 146-161) does a POST and reconciles new ids back via `created.sections[i]?.id`, but the edit-branch only ever does a PATCH, and the backend's `PATCH /api/v1/plans/:id` handler (`plans.ts:262-334`) has NO code path that inserts a new `plan_sections` row — it only runs `UPDATE plan_sections ... WHERE id = $sIdx` for sections already carrying a real id (`plans.ts:308-328`). Since `persistPlan`'s edit branch filters `sections.filter((s) => s.id)` before sending the PATCH body, a section typed into the UI after the plan was first saved is never even sent to the server, let alone persisted. A user editing an existing Draft plan who clicks "+ Add section", fills in heading/body, then clicks "Save as draft" or "Submit for review" will see the new section rendered locally for the remainder of the session, but on next page load (or after a 3s autosave reconciliation reload) the content is gone with no error, no warning, and no indication anything was lost.
- **Fix direction:** Either (a) extend `PATCH /api/v1/plans/:id` to accept sections with no `id` and `INSERT INTO plan_sections` for them (assigning `sort_order` from their array position), returning the new ids so the client can reconcile exactly as the create-branch already does, or (b) have `persistPlan`'s edit branch itself call a section-creation endpoint for each id-less section before/alongside the PATCH. Either way, the id-less sections must not be silently filtered out of the request.
- **Resolution:** fixed (4d799d1) — `PATCH /api/v1/plans/:id` now INSERTs id-less sections (assigning the next `sort_order`, queried via `MAX(sort_order)`) alongside the existing UPDATE path for sections carrying a real id, and returns them in the response. `PlanEditor.tsx`'s `persistPlan` edit-branch now sends all sections (not just ones with an `id`) and reconciles returned ids back into local state, mirroring the create-branch's existing reconciliation. Verified with a targeted integration test exercising PATCH with one existing + one id-less section, confirming the new section is durably persisted (survives a fresh GET) — all 3 pre-existing `plans.test.ts` cases still pass; `tsc --noEmit` clean on both frontend and backend.

### B2: Row links inside the Incident-Workspace-embedded Task/Resource-Request lists navigate to routes that don't exist
- **File:** frontend/app/src/pages/tasks-resources/TaskList.tsx:174, frontend/app/src/pages/tasks-resources/ResourceRequestList.tsx:140-141; frontend/app/src/main.tsx (route table)
- **Category:** integration
- **Evidence:**
  ```ts
  // TaskList.tsx:174
  const taskHref = (id: string) => (incidentId ? `/incidents/${incidentId}/tasks/${id}` : `/tasks/${id}`);
  ```
  ```ts
  // ResourceRequestList.tsx:140-141
  const requestHref = (id: string) =>
    incidentId ? `/incidents/${incidentId}/resource-requests/${id}` : `/resource-requests/${id}`;
  ```
  Both components are embedded with `incidentId` set inside `IncidentWorkspace.tsx`'s Tasks/Resources tabs (`IncidentWorkspace.tsx:269,282`). `main.tsx`'s route table registers `incidents/:incidentId/tasks/new` and `incidents/:incidentId/resource-requests/new` (the CREATE routes only — lines 94 and 98-101) but never registers `incidents/:incidentId/tasks/:id` or `incidents/:incidentId/resource-requests/:id`. Every row click or name-link click inside the embedded Tasks/Resources tab of a real Incident Workspace therefore navigates to a URL `react-router` has no match for; the `/*` wildcard `<Route path="/*" element={<AppShell/>}>` still renders the shell, but none of its children match the incident-scoped detail path, so `<Outlet/>` renders empty — the user sees the shell chrome with a blank content area and no way back except browser-back or the nav. This is reachable via the exact same real user flow 03-08's own objective says it proved end-to-end (embedded TaskList/ResourceRequestList inside the workspace). Confirmed independently by `operating-picture-resource-markers.spec.ts`'s own comment (lines 92-97): "ResourceRequestList.tsx's row link, whose incident-scoped href (`/incidents/{incidentId}/resource-requests/{id}`) has no matching route registered in main.tsx — a pre-existing gap outside this plan's scope ... TaskList.tsx's equivalent `taskHref` has the identical gap" — the test author found this exact defect and routed around it in the test rather than reporting it as a fix-required bug.
- **Fix direction:** Add `<Route path="incidents/:incidentId/tasks/:id" element={<TaskDetail />} />` and `<Route path="incidents/:incidentId/resource-requests/:id" element={<ResourceRequestDetail />} />` to `main.tsx`'s route table (TaskDetail/ResourceRequestDetail already read `id` via `useParams`, so no component change is needed — just the missing route registrations).
- **Resolution:** fixed (65663bb) — added the two missing route registrations to `main.tsx` exactly as proposed; no component changes needed since `TaskDetail`/`ResourceRequestDetail` already resolve the `id` param generically via `useParams<{ id: string }>()` regardless of the matched path's prefix. Verified with `tsc --noEmit` on the frontend app (clean).

## WARNINGs

### W1: `requesting_role` is sent to the backend even when left at its default empty string, satisfying no client-side "required" check despite the FRD marking it required
- **File:** frontend/app/src/pages/tasks-resources/CreateResourceRequest.tsx:72,196-201
- **Evidence:** `requestingRole` state initializes to `''` (line 72); the `Select` rendering it (lines 196-201) passes no `required` prop and `handleSubmit` (lines 88-99) validates quantity and incident but never checks `requestingRole` before posting `{ ..., requesting_role: requestingRole }`. The FRD (`F04-tasks-resource-requests.md:50`) states `requesting_role` is `(enum, required)`, and the column is `NOT NULL` (migration `1700000000004`, line 52) — but `NOT NULL` only rejects a true SQL NULL, not an empty string, so a user who never touches this dropdown submits a resource request with `requesting_role: ''` successfully (201, no error), silently violating the FRD's stated requirement. Low severity since every `REQUESTING_ROLE_OPTIONS` entry has a non-empty default-looking label, but the Select itself renders no blank/placeholder option and no `value=""` entry exists in the options list, so this is a genuine path to an empty value, not a cosmetic concern only.

### W2: `GET /api/v1/tasks` and `GET /api/v1/resource-requests` (and the `plans` list) apply no jurisdiction-scope filtering, unlike every other incident-adjacent list endpoint in the codebase
- **File:** backend/src/modules/incident-ops/tasks.ts (list handler, lines 153-226), backend/src/modules/incident-ops/resource-requests.ts (list handler, lines 76-139), backend/src/modules/plans/plans.ts (list handler, lines 133-197)
- **Evidence:** `incidents.ts`'s list/detail/mutation endpoints all thread `req.epmpUser!.jurisdiction_scope` through a `jurisdiction_id = ANY($1)` filter (e.g. `incidents.ts:238`, `:391`, `:430`). `tasks`/`resource_requests`/`plans` tables genuinely have no `jurisdiction_id` column of their own (confirmed against the migrations), so a literal same-pattern filter isn't directly portable — `plans` at least carries `jurisdiction_id` and could filter on it but doesn't; `tasks`/`resource_requests` would need a join through `incidents.jurisdiction_id` (same join `operating-picture.ts`'s own resource-marker query already performs) but no such join/filter exists on any of these three list endpoints. Any Active user holding `tasks:view`/`resource_requests:view`/`plans:view` can see every task/resource-request/plan across every jurisdiction in the system, not just their own scope — an inconsistency with the jurisdiction-isolation model the rest of the codebase enforces. Flagged as a WARNING (not a BLOCKER) since this phase's own plan documents and tests never asserted jurisdiction-scoped task/plan/resource-request visibility as an explicit requirement, and no FRD/TechArch text in this phase's context demands it — but the inconsistency with Phase 1/2's established pattern is real and likely unintentional.

### W3: Operating Picture's single `incidents:view` gate exposes resource-request markers (type/quantity/status) to any user who can see incidents, bypassing the dedicated `resource_requests:view` permission entirely
- **File:** backend/src/modules/incident-ops/operating-picture.ts:100 (route preHandler), :148-157 (resource-request query)
- **Evidence:** `GET /api/v1/operating-picture/markers` is gated solely by `requirePermission('incidents', 'view')` (line 100). Its resource-marker query (lines 148-157) returns `resource_type`, `quantity`, and `status` for every non-terminal resource request in the caller's jurisdiction scope, with no additional `requirePermission('resource_requests', 'view')` check anywhere in this handler. Per `seed.ts`, `field_responder` holds `incidents:view` but only `resource_requests:view` too (so no live example of a role with `incidents:view` but NOT `resource_requests:view` exists in the current seed) — but nothing in the RBAC model actually prevents such a role from being created, and the route's own permission declaration doesn't reflect that it now also surfaces resource-request data. This was an explicit, documented design decision in 03-09's plan (not an oversight the implementer introduced silently), so it is a WARNING about a latent authorization-boundary gap rather than a proven exploitable BLOCKER today.

### W4: `CreateTask.tsx`'s "Linked plan section" Combobox is permanently empty/disabled — no live data source was wired, silently diverging from the plan's documented options source
- **File:** frontend/app/src/pages/tasks-resources/CreateTask.tsx:74-84,225-233
- **Evidence:** `planSectionOptionsSource: PlanSection[] = []` is a hardcoded empty array (line 84) with a comment explaining the incident schema carries no "linked plan" FK to query against — documented inline as a deliberate scope decision, and explicitly invited by the 03-06 plan's own "Claude's discretion... else empty/disabled is an explicitly acceptable outcome" wording. Confirmed non-blocking per the plan's own documented allowance; listed as a WARNING only because a user filling out Create Task will always see this field as inert with no indication of why (`placeholder={planSectionOptions.length === 0 ? 'No plan sections available' : undefined}` is the only hint), which is a minor UX gap rather than a defect against this plan's stated scope.

## Cross-file seams checked
- `backend/src/server.ts` registers `planRoutes`/`incidentOpsRoutes` and calls `startOverdueSweepScheduler()` — OK, matches `overdue-sweep.ts`/`routes.ts` exports.
- `backend/src/modules/plans/routes.ts` → `plans.ts`/`materialize.ts` registration — OK.
- `backend/src/modules/incident-ops/routes.ts` → `tasks.ts`/`resource-requests.ts` registration — OK.
- `materialize.ts` → `tasks.ts`'s exported `TaskService.createFromTemplate` — signature match confirmed (`client: PoolClient`, matching params object) — OK.
- `resource-requests.ts` imports `RECORD_NOT_FOUND` from `tasks.ts` — export exists, shape matches — OK.
- Frontend `main.tsx` route table vs. standalone `/tasks/:id`, `/resource-requests/:id` — OK (used correctly by non-embedded TaskList/ResourceRequestList).
- Frontend `main.tsx` route table vs. incident-scoped detail hrefs generated by embedded `TaskList`/`ResourceRequestList` — **missing, see B2**.
- `IncidentWorkspace.tsx` embeds `TaskList`/`ResourceRequestList` with `incidentId` prop — prop contract matches both components' `TaskListProps`/`ResourceRequestListProps` interfaces — OK (the bug is in the generated href targets, not the prop wiring itself).
- `PlanDetail.tsx`/`PlanEditor.tsx` both wire `LinkTasksModal` with matching props (`planId`, `sectionId`, `sectionHeading`, `existingTemplates`, `open`, `onClose`, `onLinked`) — OK.
- `CreateResourceRequest.tsx`'s 03-08 fix (`navigate(routeIncidentId ? ... )`) matches `CreateTask.tsx`'s pre-existing identical pattern — OK.
- `seed.ts`'s `role_permissions` grants (`tasks`, `resource_requests`, `plans` feature/action pairs) vs. each route's `requirePermission(feature, action)` call — cross-checked tasks.ts/resource-requests.ts/plans.ts/materialize.ts's exact action strings against seed.ts's grants — OK, all consistent (including the `review` vs `edit` action-level split for plans, and `approve` covering both approve/decline for resource_requests).
- `backend/keycloak/epmp-realm.json` seeded users/groups (`planner@epmp.local`, `eocdirector@epmp.local`) vs. `seed.ts`'s `group_to_role_mapping` and `frontend/app/e2e/helpers/sign-in.ts`'s exported sign-in helpers — OK, all three agree.
- `GET /api/v1/auth/sso/callback` (SignInCallback.tsx:58) vs. backend route — refuted false positive per orchestrator's pre-investigation; confirmed independently: `backend/src/modules/auth-org/routes.ts:71` declares this exact POST route, registered via `server.ts`'s `authOrgRoutes` registration.
