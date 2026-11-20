---
phase: 8
status: clean
blockers: 0
warnings: 0
files_reviewed: 9
files_reviewed_list:
  - backend/src/modules/integration-gateway/document-adapter.ts
  - backend/src/modules/plans/plans.test.ts
  - backend/src/modules/plans/plans.ts
  - frontend/app/e2e/operating-picture-facility-markers.spec.ts
  - frontend/app/e2e/operating-picture-resource-markers.spec.ts
  - frontend/app/e2e/plan-document-import-link.spec.ts
  - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
  - frontend/app/src/pages/plans/ImportDocumentModal.tsx
  - frontend/app/src/pages/plans/PlanRepository.tsx
reviewed_at: 2026-11-20T18:52:31Z
iteration: 2
---

# Phase 8 Code Review (Iteration 2 — re-review of B1 fix)

## B1 verification (iteration 1 blocker, fix commit `35df808`)

**Original defect:** `POST /api/v1/plans/import`'s `if (plan_id)` branch (attach-to-existing-plan path) unconditionally called `linkDocument()`, ignoring `mode` — so `mode: 'import_copy'` against an existing plan silently wrote a `link_live` row instead of a one-time copy.

**Fix read directly (`git show 35df808`), not trusted from the commit message:**

1. **`plans.ts:359-394`** — the `if (plan_id)` branch now reads:
   ```ts
   if (mode === 'import_copy') {
     await importDocument(req.epmpUser!.id, source_document_ref, targetPlanId);
   } else {
     await linkDocument(req.epmpUser!.id, source_document_ref, targetPlanId, req.epmpUser!.jurisdiction_scope);
   }
   ```
   This is structurally identical to the `else` (new-plan) branch's existing `if (mode === 'import_copy') { importDocument(...) } else { linkDocument(...) }` pattern (plans.ts:438-442), confirmed by direct side-by-side read of both branches. **Confirmed fixed** — `mode` is now honored on both branches.

2. **`document-adapter.ts:142-166`** — `importDocument()`'s signature is now `(userId: string, externalDocId: string, planId?: string)`. The INSERT changed from `(external_document_id, source_system, mode, imported_by)` / 3 bound params to `(plan_id, external_document_id, source_system, mode, imported_by)` / 4 bound params, with `[planId ?? null, externalDocId, sourceSystem, userId]`. Column order and param order line up correctly (`plan_id`↔`planId ?? null`, `external_document_id`↔`externalDocId`, `source_system`↔`sourceSystem`, `mode`↔literal `'import_copy'`, `imported_by`↔`userId`) — **no column/param misalignment**.
   - **Standalone-import route unaffected, confirmed directly:** `document-adapter.ts:475` (`POST /api/v1/integrations/documents/:id/import`) calls `importDocument(req.epmpUser!.id, req.params.id)` — exactly 2 args, `planId` param left `undefined`, falls through `planId ?? null` to `NULL`, identical behavior to pre-fix. Also directly confirmed via `facility-document-adapter.test.ts` (test 6 and 7, both call `importDocument(userId, docId)` with 2 args) — ran this suite in isolation: **14/14 passing**.

3. **New test (`plans.test.ts:523-564`)** — reads a real `document_links` row via direct `query()` call (not a status-code-only check): `SELECT id, plan_id, mode FROM document_links WHERE plan_id = $1`, asserts `linkRows.length > 0` AND `linkRows.every(row => row.mode === 'import_copy')`. The plan under test is pre-created via a separate `POST /api/v1/plans` call (`existingPlanId`) before the import call, and the import request explicitly sends `plan_id: existingPlanId` — so this genuinely exercises "attach to an EXISTING plan via import_copy," not a new-plan creation. Confirmed this is the previously-missing combination (iteration 1's gap). The response-id assertion (`importRes.body.id === existingPlanId`) additionally confirms the route didn't silently create a new plan.
   - The adjacent pre-existing `'link_live with an existing plan_id...'` test (plans.test.ts:487-515) was re-read and is untouched by the diff — still exercises the same pattern for `link_live`, still passes.

4. **Re-ran independently (not trusting the fixer's reported numbers):**
   - `cd backend && npx tsc --noEmit` → clean, no errors.
   - `cd backend && npm test -- plans.test.ts` → **10/10 passing**.
   - `cd backend && npm test -- facility-document-adapter.test.ts` → **14/14 passing** (confirms standalone-import route and direct `importDocument`/`linkDocument` callers unaffected).
   - `cd backend && npm test` (full suite), run **4 times** for reproducibility: one run showed a transient 2-test failure in `field-reports.test.ts` (`sync-batch`/`sync-conflicts resolve` tests) with an unrelated `ENOENT` on a test-fixture photo file and a `NATS not connected` log — this file is **entirely untouched by the phase 8 diff** (last changed in `4231131`, a phase-5 commit; confirmed via `git diff e545ee4..HEAD --name-only`, not in the list). Reverting to the pre-fix commit (`35df808^`) and running the full suite produced a clean 152/152 pass; re-running the full suite 3 more times at the post-fix HEAD produced 153/153 clean every time. This is pre-existing cross-test-file flakiness in an unrelated, undiffed module (likely a shared upload-fixture/ordering issue), **not a regression introduced by `35df808`** — confirmed by reproducibility testing, not assumption.
   - Final clean full-suite result: **153/153 passing**, matching the fixer's reported number.

5. **Regression check on touched files and all `importDocument`/`linkDocument` call sites:** grepped every call site across the backend (`plans.ts` x2, `document-adapter.ts`'s own route handlers x2, `facility-document-adapter.test.ts` x2). All pre-existing 2-arg/3-arg/4-arg call shapes remain valid against the new optional-3rd-param signature — no caller needed updating, none was missed.

6. **W1/W2 scope check:** `git show 35df808` touches only `document-adapter.ts`, `plans.test.ts`, `plans.ts` — confirmed neither W1 (sandbox-stub content-not-written, `plans.ts:425-426`/439) nor W2 (`jurisdiction_id` unvalidated on new-plan creation, `plans.ts:407-409`) lines were touched by the fix diff. Both remain as explicitly out-of-scope, non-regressed observations from iteration 1; not re-litigated here.

**Verdict: B1 is genuinely fixed.** The existing-plan-attach branch now honors `mode` exactly like the new-plan branch, `importDocument()`'s new optional parameter is correctly threaded and backward-compatible, the new test asserts real DB state (not just HTTP status), and no regression was introduced in any caller or the full test suite.

## BLOCKERs

None.

## WARNINGs

None (W1/W2 from iteration 1 remain correctly out-of-scope per the fix round's explicit instructions — see point 6 above — and are not carried forward as open findings in this iteration since no code review round of this phase treated them as action items).

## Cross-file seams checked

- `plans.ts`'s `if (plan_id)` branch ↔ `else` (new-plan) branch — both now branch on `mode` identically (`importDocument(...)` for `'import_copy'`, `linkDocument(...)` for `'link_live'`) — OK, confirms B1 fix symmetry.
- `importDocument()`'s new optional 3rd `planId` param ↔ its 3 call sites (`plans.ts:382` new 3-arg call, `document-adapter.ts:475` pre-existing 2-arg call, `facility-document-adapter.test.ts:194`/`216` pre-existing 2-arg calls) — all compatible, confirmed by running each caller's own test suite — OK.
- `importDocument()`'s INSERT column list ↔ bound parameter array — `(plan_id, external_document_id, source_system, mode, imported_by)` columns line up positionally with `[planId ?? null, externalDocId, sourceSystem, userId]` + literal `'import_copy'` — OK.
- New test's DB assertion (`SELECT ... FROM document_links WHERE plan_id = $1`) ↔ actual INSERT performed by the fixed `importDocument()` — the row is genuinely attached to the pre-existing plan at insert time, not via a secondary UPDATE — OK.
- Full backend test suite (153 tests, 22 files) — reproducibly green at HEAD; one transient unrelated flake in an undiffed file (`field-reports.test.ts`) traced and ruled out as a regression — OK.
