---
phase: 3
status: clean
blockers: 0
warnings: 0
files_reviewed: 3
files_reviewed_list:
  - backend/src/modules/plans/plans.ts
  - frontend/app/src/pages/plans/PlanEditor.tsx
  - frontend/app/src/main.tsx
reviewed_at: 2026-11-17T17:05:00Z
iteration: 2
---

# Phase 3 Code Review (Re-review, iteration 2)

## Verification of prior BLOCKERs

### B1 — VERIFIED FIXED
Fixer's claim: `PATCH /api/v1/plans/:id` now INSERTs id-less sections and `PlanEditor.tsx` sends all sections (not just ones with an `id`), reconciling returned ids back into local state.

Read the actual diff in `4d799d1` (not just the commit message):
- `backend/src/modules/plans/plans.ts:262-270` — the PATCH body type now declares `sections?: Array<{ id?: string; heading?: string; body?: string }>` (was `id: string`, required).
- `plans.ts:311-354` — the section loop now branches on `section.id`: real-id sections still go through the pre-existing conditional `UPDATE`; id-less sections hit a new branch that computes `nextSortOrder` once via `SELECT MAX(sort_order)` and then increments locally for each subsequent id-less section in the same request (avoiding an extra query per new section, and avoiding duplicate sort_order values when several sections are added in the same save).
- `PlanEditor.tsx:163-179` — `persistPlan`'s edit-branch no longer filters `sections.filter((s) => s.id)`; it now sends `sections.map((s) => ({ id: s.id, heading: s.heading, body: s.body }))` (id possibly `undefined`, which JSON-serializes as an omitted key, matching the backend's now-optional `id?`), and reconciles `updated.sections[i]?.id` back into local state exactly mirroring the create-branch's existing pattern.

I did not stop at reading the diff — I wrote and ran two throwaway integration tests against the live Postgres/OPA stack (not committed, removed after verification) to confirm this isn't just type-correct but behaviorally correct:
1. Created a plan with 1 persisted section, PATCHed with `[existing-with-id, new-without-id]`, confirmed the new section comes back with a real id in the PATCH response AND survives a fresh `GET` (durability, not just an echo). Then PATCHed again adding a THIRD id-less section in a separate save, confirming `sort_order` values stay distinct across repeated id-less inserts (no collision from `MAX(sort_order)` being recomputed each time the `nextSortOrder` cache is null for a fresh request).
2. Simulated the more realistic "+ Add section" clicked twice before ever saving, sending BOTH id-less sections in a single PATCH. Confirmed (a) both get distinct sort_order values in send order, and (b) critically, confirmed the PATCH response's `sections` array preserves the exact index order of the request body — this is the load-bearing assumption `PlanEditor.tsx:176`'s `updated.sections[i]?.id` reconciliation depends on (positional, not keyed by heading/content). It holds.

All 3 pre-existing `plans.test.ts` cases still pass (ran live, not just trusted). `tsc --noEmit` clean on both frontend and backend. B1 is genuinely closed.

### B2 — VERIFIED FIXED
Fixer's claim: added `incidents/:incidentId/tasks/:id` and `incidents/:incidentId/resource-requests/:id` routes to `main.tsx`; no component changes needed since `TaskDetail`/`ResourceRequestDetail` already read `id` generically via `useParams`.

Read the diff in `65663bb` — exactly as claimed, two `<Route>` entries added (`main.tsx:95`, `:103-106`). Confirmed both target components (`TaskDetail.tsx:102`, `ResourceRequestDetail.tsx:86`) destructure `{ id }` from `useParams<{ id: string }>()`, which binds to whatever segment the matched route names `:id`, regardless of what prefix segments (`incidents/:incidentId/...`) preceded it — so no component change really was needed.

I did not take this on faith either: wrote a standalone Node script using the actual `react-router-dom` v7 `matchRoutes` function (the same matching engine `BrowserRouter` uses internally) against the full route table as it exists in `main.tsx` today, and fed it the exact href strings `TaskList.tsx`/`ResourceRequestList.tsx` generate for the embedded-in-workspace case. Confirmed:
- `incidents/abc-123/tasks/task-456` → matches `incidents/:incidentId/tasks/:id` with `params: { incidentId: 'abc-123', id: 'task-456' }`.
- `incidents/abc-123/resource-requests/req-789` → matches `incidents/:incidentId/resource-requests/:id` with `params: { incidentId: 'abc-123', id: 'req-789' }`.
- The standalone hrefs (`tasks/task-456`, `resource-requests/req-789`) still correctly match their pre-existing standalone routes, unaffected by the new additions (no shadowing/collision).

Also traced the "back" navigation inside both detail pages (`TaskDetail.tsx:214`, `ResourceRequestDetail.tsx:290`) — both navigate via `task.incident_id`/`request.incident_id` read from the fetched record, not from the URL's matched prefix, so there's no scenario where the new route registrations break the existing back-navigation behavior for either the standalone or incident-scoped entry path. B2 is genuinely closed.

## Regression check (fixer's own commits)

Scope: `files_reviewed_list` from iteration 1, restricted to files any of `65663bb`/`4d799d1`/`e8f8a75` actually touched — confirmed via `git log --name-only cfb7aeb..HEAD` that only three source files changed (plus the REVIEW.md itself): `backend/src/modules/plans/plans.ts`, `frontend/app/src/main.tsx`, `frontend/app/src/pages/plans/PlanEditor.tsx`. No other file from iteration 1's 39-file review scope was touched, so no other file needed re-reading for regressions.

- `plans.ts`'s diff is scoped exactly to the PATCH handler's section-loop and its Body type — no other route, no other function, and no other part of the PATCH handler (status-gate check, name/jurisdiction UPDATE) was touched. Confirmed by reading the full surrounding handler (`plans.ts:262-359`) — the status-gate (`existing.status !== 'Draft'` → 409) still runs before any section mutation, unchanged.
- The only frontend caller of `PATCH /api/v1/plans/:id` in the entire codebase is `PlanEditor.tsx:163` (confirmed via repo-wide grep) — so the request-body shape change (optional `id`) has exactly one consumer, which was updated in the same commit. No other caller could be left sending the old required-`id` shape or misreading the new response.
- `main.tsx`'s diff is a pure addition (5 new lines, 2 `<Route>` elements) — no existing route was reordered, removed, or modified. Re-ran the `matchRoutes` simulation above against the FULL current route table (not just the two new entries) to confirm no existing standalone route lost its match.
- No test files were touched by the fixer — the 3 pre-existing `plans.test.ts` assertions were re-run live and still pass unmodified, confirming no regression in the paths they do cover (create, submit-review, self-approval gate, review-approve, link-tasks, materialize-tasks, empty-plan-422).

No regressions found.

## W1-W4 status
Not re-litigated per instructions — advisory-only, not assigned to the fixer, and none of the fixer's changes touch `CreateResourceRequest.tsx`, `tasks.ts`/`resource-requests.ts`/`plans.ts` list handlers, `operating-picture.ts`, or `CreateTask.tsx`, so none of W1-W4 could have been newly affected by this iteration's fix commits.

## Cross-file seams checked (this iteration's scope)
- `PATCH /api/v1/plans/:id` request body type (`plans.ts:264-271`) vs. `PlanEditor.tsx`'s `apiPatch` call body (`:163-172`) — OK, both now agree `id` is optional.
- `PATCH /api/v1/plans/:id` response shape (`fetchPlanDetail` → `PlanDetailResponse.sections[]`, each carrying `id`) vs. `PlanEditor.tsx`'s reconciliation (`updated.sections[i]?.id`) — OK, verified positionally correct via live test, not just type-correct.
- `main.tsx`'s two new `<Route>` entries vs. `TaskList.tsx`/`ResourceRequestList.tsx`'s generated hrefs — OK, verified via actual `matchRoutes` execution, not static inspection alone.
- `main.tsx`'s new routes vs. `TaskDetail.tsx`/`ResourceRequestDetail.tsx`'s `useParams<{ id: string }>()` — OK, param name matches (`:id` in both new routes).
- `main.tsx`'s new routes vs. existing standalone `tasks/:id` / `resource-requests/:id` routes — OK, no shadowing/collision confirmed via the same matcher run against the full table.
- Sole consumer check: grepped the entire `frontend/app/src` tree for any other `apiPatch(.../plans/...)` caller — none found, so the Body-type relaxation has exactly one call site and it was updated consistently.

No new findings this iteration. Both prior BLOCKERs are closed with evidence beyond the fixer's own commit message (live DB-backed tests + actual router-matching execution), and no regression was introduced by the fix commits.
