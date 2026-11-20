---
phase: 08-record-authority-sync-integrations
plan: 10
subsystem: plans
tags: [react, playwright, document-import, plan-repository, uat-gap-closure]

# Dependency graph
requires:
  - phase: 08-record-authority-sync-integrations
    provides: "08-09's new POST /api/v1/plans/import backend route (creates a new Draft/v1 plan with source_document_ref set, or attaches to an existing in-scope plan the caller names)"
provides:
  - "ImportDocumentModal.tsx offers a 'Create a new plan' (default) vs 'Attach to an existing plan' choice once a document is selected, and calls POST /api/v1/plans/import with the correct body shape"
  - "PlanRepository.tsx navigates to the resulting plan on a successful import/link instead of silently refetching its own list"
  - "plan-document-import-link.spec.ts (5/5) proves the full visible, navigable, list-reflected outcome for both Import copy and Link live"
affects: [plan-repository, plan-detail, document-adapter]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Modal collects a target-plan choice (new vs existing) gated by React Query `enabled`, mirroring PlanEditor.tsx's exact jurisdiction-Combobox/plan-type-Select patterns"]

key-files:
  created: []
  modified:
    - frontend/app/src/pages/plans/ImportDocumentModal.tsx
    - frontend/app/src/pages/plans/PlanRepository.tsx
    - frontend/app/e2e/plan-document-import-link.spec.ts

key-decisions:
  - "ImportDocumentModal's new-plan name field is editable (not read-only pre-fill) — both the plan's own spec and the e2e spec rely on this to keep repeated suite runs collision-free on a shared compose DB"
  - "handleSubmit's mode values renamed from the prior local 'import'/'link' shorthand to the backend's literal mode enum ('import_copy'/'link_live') exactly, closing a naming mismatch that would have 400'd against 08-09's route"

# Metrics
duration: 22min
completed: 2026-11-20
---

# Phase 8 Plan 10: Plan Repository Import/Link — Visible Result Closure Summary

**ImportDocumentModal now collects a new-plan-vs-existing-plan choice and calls the real `POST /api/v1/plans/import` route; PlanRepository navigates to the resulting Plan Detail page instead of silently refetching an unchanged list, closing UAT gap ref 4 end-to-end.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-11-20T18:00:23Z
- **Completed:** 2026-11-20T18:22:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- `ImportDocumentModal.tsx` offers a target-plan `Select` ("Create a new plan" default / "Attach to an existing plan") once a document is selected, with new-plan fields (name pre-filled+editable, type, jurisdiction Combobox reusing `PlanEditor.tsx`'s exact pattern) or an existing-plan `Combobox` sourced from `GET /api/v1/plans?page_size=100`, each query gated `enabled` on `targetMode` so no unnecessary fetch fires.
- `handleSubmit` now calls `POST /api/v1/plans/import` with the backend's literal `mode` enum values (`import_copy`/`link_live`) and the correct new-plan/existing-plan body shape; `onImported` changed from `() => void` to `(planId: string) => void` so the caller receives the resulting plan's real id.
- `PlanRepository.tsx`'s `ImportDocumentModal` usage changed from `onImported={() => void refetch()}` to `onImported={(planId) => navigate(`/plans/${planId}`)}`, mirroring `CreateTask.tsx`/`CreateResourceRequest.tsx`'s own navigate-to-new-resource convention.
- `plan-document-import-link.spec.ts` (5/5): test 2 drives the new default "create a new plan" path end-to-end (fills the jurisdiction Combobox from the signed-in user's own `jurisdiction_scope`, asserts navigation to a real `/plans/{id}` URL and a `Draft` status Badge); test 4 switches to "attach to an existing plan," picks the plan test 2 created, asserts navigation to that SAME plan id, and confirms a real `document_links` row (`mode='link_live'`, `external_document_id='DOC-SOP-002'`) via direct Postgres query; new test 5 proves the imported plan is immediately visible in the Plans & playbooks list — directly closing the "list is unchanged" symptom. Tests 1 and 3 (browse-filtering proof, direct-API-bypass 403 proof) are unchanged.

## Task Commits

Each task was committed atomically:

1. **Task 1: ImportDocumentModal — target-plan choice, new route, surfaced result** - `2e2dcd9` (feat)
2. **Task 2: PlanRepository navigates to result; Playwright proves visible outcome** - `1521809` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/plans/ImportDocumentModal.tsx` - Target-plan Select (new/existing) + conditional fields, `handleSubmit` calling `POST /api/v1/plans/import`, `onImported(planId)` signature
- `frontend/app/src/pages/plans/PlanRepository.tsx` - `onImported` now `navigate(`/plans/${planId}`)` instead of `refetch()`
- `frontend/app/e2e/plan-document-import-link.spec.ts` - Tests 2/4 updated for the new required target-plan choice; new test 5 proves list-visibility; 248 lines total

## Decisions Made
- Kept the new-plan name field editable (pre-filled from the selected document's name, per the plan's own instruction) rather than read-only — this was load-bearing for the e2e spec's own collision-avoidance against the shared compose DB (see Deviations).
- Reused `PlanEditor.tsx`'s exact jurisdiction-Combobox and plan-type-Select option patterns verbatim rather than inventing new ones, per the plan's explicit instruction.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test-only: `inputValue()` raced the pre-fill effect**
- **Found during:** Task 2 (Playwright verification of test 2)
- **Issue:** Reading the new-plan name field's value with `.inputValue()` immediately after clicking a document row raced React's `useEffect` that syncs `newPlanName` from `selectedDoc` — the field was still empty when read, which then broke test 4's Combobox lookup (empty-string option name matched multiple listbox items via strict-mode violation).
- **Fix:** Added an explicit `await expect(planNameField).toHaveValue('Regional EOP', { timeout: 10_000 })` wait before reading the value back.
- **Files modified:** frontend/app/e2e/plan-document-import-link.spec.ts
- **Verification:** Full suite re-run, all 5 tests green.
- **Committed in:** `1521809` (Task 2 commit)

**2. [Rule 1 - Bug] Test-only: non-unique plan name collided across repeated suite runs**
- **Found during:** Task 2 (Playwright verification of test 4)
- **Issue:** Test 2 originally accepted the pre-filled name ("Regional EOP") as-is; against the shared, already-accumulated compose DB (multiple prior suite runs' fixture plans), the existing-plan Combobox in test 4 resolved to more than one option sharing that name/substring, causing a strict-mode violation on `getByRole('option', ...)`.
- **Fix:** Test 2 now edits the pre-filled field to a unique name (`Regional EOP E2E ${Date.now()}`) before submitting — still exercising the real "editable, pre-filled" behavior the plan specifies, just with a collision-free value.
- **Files modified:** frontend/app/e2e/plan-document-import-link.spec.ts
- **Verification:** Full suite re-run, all 5 tests green; regression suite (`plans.spec.ts`, `plan-live-link-flagged-review.spec.ts`, 7/7) unaffected.
- **Committed in:** `1521809` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1, both confined to this plan's own new Playwright spec file — no production code affected).
**Impact on plan:** Both fixes were necessary to make the spec deterministic against the shared compose DB this phase's prior plans have already populated. No scope creep; the modal/PlanRepository production code matches the plan's spec exactly as written.

## Issues Encountered
None beyond the two self-caught test-only deviations documented above.

## Known Stubs
None found — grep for TODO/FIXME/placeholder/not-implemented across all three changed files returned only a legitimate HTML `placeholder` attribute and historical doc-comments referencing Phase 3's now-superseded disabled placeholder (not a current stub).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- UAT gap ref 4 (major) is now fully closed: both "Import copy" and "Link live" produce a real, GET-reachable, list-visible Plan with immediate navigation to the result.
- Plan 08-06's "Source changed, review" Alert on `PlanDetail.tsx` is now reachable through genuine product usage (a real user can Link live a document from the Plan Repository and later see it flagged), not just the data-doctor's seed-script bypass — confirmed via this plan's own regression run of `plan-live-link-flagged-review.spec.ts` (3/3, unaffected).
- This was the final plan (08-10) in Phase 8's gap-closure set (08-07/08-08/08-09/08-10). Phase 8 is now fully complete (10/10 plans: 6 original + 4 gap-closure).

## Self-Check: PASSED

- `[ -f frontend/app/src/pages/plans/ImportDocumentModal.tsx ]` → FOUND
- `[ -f frontend/app/src/pages/plans/PlanRepository.tsx ]` → FOUND
- `[ -f frontend/app/e2e/plan-document-import-link.spec.ts ]` → FOUND (248 lines, exceeds min_lines: 60)
- `git log --oneline --all --grep="08-10"` → `2e2dcd9`, `1521809` both FOUND
- `cd frontend/app && npx tsc --noEmit` → exit 0, zero errors
- `cd frontend/app && npm run build` → clean, `dist/` produced
- `npx playwright test e2e/plan-document-import-link.spec.ts --workers=1` → 5/5 passed
- Regression: `plans.spec.ts` (4/4) + `plan-live-link-flagged-review.spec.ts` (3/3) → 7/7 passed
- Backend suite (unaffected, zero backend changes this plan): 22 files, 152 tests, all passed
- Backend build (`tsc -p tsconfig.json`): clean
- `## Known Stubs` section present, no blocking entries

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*
