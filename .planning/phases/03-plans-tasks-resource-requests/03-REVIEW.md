---
phase: 3
status: clean
blockers: 0
warnings: 0
files_reviewed: 4
files_reviewed_list:
  - frontend/app/src/pages/plans/MaterializeTasksModal.tsx
  - frontend/app/src/pages/plans/PlanDetail.tsx
  - frontend/app/e2e/plan-to-task-materialization.spec.ts
  - frontend/app/e2e/plans.spec.ts
reviewed_at: 2026-11-17T22:10:00Z
iteration: 1
---

# Phase 3 Code Review (03-10 gap closure)

## Scope

This iteration reviews ONLY the diff produced by `03-10-PLAN.md` (gap-closure
run, UAT ref "uat:1"), per the orchestrator's explicit scope note. The other 9
plans (03-01..03-09) were already reviewed clean in a prior iteration and are
out of scope here. Full file list confirmed via
`git diff --name-only 5a21b2a^ 36ec3af -- . ':!.planning' ':!*.lock'` —
matches the 4 files listed above exactly, no drift from the claimed change set.

## BLOCKERs

None found.

## WARNINGs

None found.

## Contract-scan c-gap disposition (investigated independently)

`c-gap api frontend/app/src/pages/SignInCallback.tsx:58 GET /api/v1/auth/sso/callback — no matching backend route declaration`

Read both sides directly:
- `frontend/app/src/pages/SignInCallback.tsx:58-62`: `fetch('/api/v1/auth/sso/callback', { method: 'POST', headers: {...}, body: JSON.stringify({ id_token: idToken }) })` — the method is `POST`, just declared a few lines below the flagged line 58 inside the same multiline options object, which is why a line-58-only text match reads as "GET" (the scanner's regex likely defaults to GET when it can't find an explicit method token on the matched line itself).
- `backend/src/modules/auth-org/routes.ts:71`: `app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', async (req, reply) => {...})` — a real, registered POST route with a matching body shape (`{ id_token: string }` matches the frontend's `JSON.stringify({ id_token: idToken })`).

**Independent conclusion: confirmed false positive.** The route exists and the method matches; this is a scanner parsing artifact (multiline `fetch()` options object), not a dead route. `SignInCallback.tsx` is also untouched by 03-10's diff (pre-existing Phase 1 file) — out-of-scope-but-investigated, as instructed. No action needed from this run.

## Cross-file seams checked

- `PlanDetail.tsx` "Materialize tasks" button `onClick` → `setMaterializeModalOpen(true)` → `<MaterializeTasksModal open={materializeModalOpen} ...>` — OK, wired correctly, single state variable drives both the trigger and the modal's `open` prop.
- `PlanDetail.tsx` → `MaterializeTasksModal` props (`planId`, `sections`, `open`, `onClose`) vs. `MaterializeTasksModalProps` interface — OK, exact match; `sortedSections` (shape `{id, heading, body, sort_order, linked_task_templates}`) is a structural superset of `MaterializeTasksModalSection` (`{id, heading, linked_task_templates}`), which TypeScript accepts for object-literal-free variable assignment (structural typing, excess properties on a variable aren't flagged) — confirmed via `tsc --noEmit -p frontend/app/tsconfig.json` running clean with zero errors.
- `MaterializeTasksModal`'s `apiPost<MaterializeResult>('/api/v1/plans/${planId}/materialize-tasks', {incident_id, section_ids?})` → backend `materialize.ts`'s `app.post<{Params:{id}, Body:{incident_id, section_ids?}}>('/api/v1/plans/:id/materialize-tasks', ...)` — OK, request body shape matches exactly; response shape `{created: {id,title,status}[], skipped: {template_id,reason}[]}` matches the backend's literal `reply.code(200).send({created, skipped})` and `TaskService.createFromTemplate`'s returned `{id, title, status}` row shape.
- `MaterializeTasksModal`'s incident Combobox → `GET /api/v1/incidents?page_size=1000` → backend `incidents.ts`'s `GET /api/v1/incidents` route — OK, same query-key/response-shape convention already used identically by `CreateTask.tsx` and `CreateResourceRequest.tsx` (`{items: [{id, name}]}` via `shapeIncidentListRow`, jurisdiction-scoped server-side).
- `MaterializeTasksModal`'s `SKIP_REASON_TEXT` map (`NO_USER_FOR_ROLE` → human string) vs. the only skip-reason code `materialize.ts` actually emits (`skipped.push({template_id, reason: 'NO_USER_FOR_ROLE'})`, two call sites, both this exact string) — OK, exhaustive; the `?? 'This template was skipped.'` fallback covers any future/unknown code without ever leaking a raw code to the UI.
- `PlanDetail.tsx`'s gating condition (`plan.status === 'Approved' && hasEligibleSections`) vs. `materialize.ts`'s server-side gate (`plan.status !== 'Approved'` → 409) — OK, client gate is a strict subset of server gate (button genuinely can't be clicked into a 409 from this path); `hasEligibleSections` has no server-side equivalent gate but is a UX nicety only (sending `section_ids` that don't resolve to templates just yields an empty `created`/`skipped` — not a 404/409 — confirmed by reading `materialize.ts`'s template query, which simply returns zero rows for an unmatched filter, not an error).
- `plan-to-task-materialization.spec.ts` test 5 selectors (`getByRole('button', {name: 'Materialize tasks'})`, `getByRole('dialog', {name: /Materialize tasks/})`, `modal.getByLabel('Incident', {exact: false})`) vs. the actual rendered DOM — OK: `Modal`'s `aria-labelledby="ep-modal-title"` + `<h2 id="ep-modal-title">{title}</h2>` gives the dialog its accessible name from the `title="Materialize tasks"` prop passed by `MaterializeTasksModal`; `Combobox`'s `<label htmlFor={id}>{label}</label>` + generated `id` gives the input an accessible name of "Incident" (plus a hidden " *" for `required`, which `{exact: false}` tolerates, matching the same pattern already used elsewhere in this file and in `tasks-resources.spec.ts`).
- `plan-to-task-materialization.spec.ts`'s `apiPostViaPage` helper removal — OK, confirmed via diff it had no other call sites in the file (test 5 was its only caller) before removal.
- `plans.spec.ts` test 3's new `not.toBeVisible()` assertion — OK, placed on a plan that is genuinely `Review` status with zero linked templates at that point in the serial suite (test 3 runs before any `LinkTasksModal` interaction, which only happens in the separate `plan-to-task-materialization.spec.ts` file) — the negative assertion is testing a real negative case, not a tautology.
- Seed-data check for test 5's actual resolvability: the linked template's `default_owner_role: 'incident_commander'` (set in test 3 via `LinkTasksModal`) resolves against `commander@epmp.local` (seeded with `role_id = incident_commander`, confirmed in `backend/scripts/seed.ts`), so `materialize.ts`'s owner-resolution query returns a real row — test 5's `expect(modal.getByText(/skipped/i)).not.toBeVisible()` assertion is consistent with the actual seed data, not relying on a coincidental pass.
- `MaterializeTasksModal`'s `Checkbox onChange={(e) => toggleSection(section.id, e.target.checked)}` vs. `Checkbox`'s native `<input type="checkbox">` props passthrough — OK, standard DOM checkbox event, `e.target.checked` is valid.
- TypeScript compile check: `npx tsc --noEmit -p frontend/app/tsconfig.json` run directly — zero errors, confirming no signature drift the SUMMARY.md's self-check claim might have missed.

## Notes (non-blocking, pre-existing pattern, not a new defect)

- `MaterializeTasksModal.tsx` and `PlanDetail.tsx` both introduce bespoke CSS class hooks (`ep-materialize-tasks-modal__sections`) with no corresponding stylesheet rule — confirmed this is the exact same pre-existing pattern `LinkTasksModal.tsx` (`ep-link-tasks-modal__existing`, `ep-link-tasks-modal__new-template`) and `ReviewPlanModal.tsx` already use with no dedicated CSS file of their own (all three modals rely entirely on the design system's own component-level styling plus plain block layout). Out of scope per this review's style/cosmetic exclusion — not reported as a finding.
