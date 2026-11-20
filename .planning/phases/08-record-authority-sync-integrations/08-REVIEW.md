---
phase: 8
status: issues_found
blockers: 1
warnings: 2
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
reviewed_at: 2026-11-20T18:45:35Z
iteration: 1
---

# Phase 8 Code Review

## Contract-scan disposition (step 0)

The single `c-gap` reported (`frontend/app/src/pages/SignInCallback.tsx:65` → `GET /api/v1/auth/sso/callback`, no matching backend route) is a **false positive, out of this review's scope**, confirmed by direct inspection:

- `git diff e545ee4..HEAD --stat` touches neither `SignInCallback.tsx` nor `backend/src/modules/auth-org/routes.ts` — both files are untouched by the 08-07/08-08/08-09/08-10 diff (`SignInCallback.tsx` last changed in `ea23577`, "fix(04-08)"; `routes.ts` last changed in `720036e`, "feat(06-06)" — both predate this gap-closure run entirely).
- Reading the actual call site (`SignInCallback.tsx:65-69`): `fetch('/api/v1/auth/sso/callback', { method: 'POST', ... })` — the method is declared in the options object, not inline with the URL, which is exactly why the scanner's static method-sniffing mis-detected GET. The backend route (`auth-org/routes.ts:72`) is `app.post<...>('/api/v1/auth/sso/callback', ...)` — a real, matching POST route exists.

Not carried forward as a finding: it is neither real nor in this run's diff.

## BLOCKERs

### B1: `POST /api/v1/plans/import` with `plan_id` + `mode: 'import_copy'` silently performs a `link_live` write instead, misrepresenting the user's explicit choice
- **File:** backend/src/modules/plans/plans.ts:359-381
- **Category:** bug
- **Evidence:** In the `if (plan_id)` branch (attach-to-existing-plan path), the route unconditionally calls `linkDocument(...)` — never branching on `mode` at all:
  ```ts
  if (plan_id) {
    const existing = await fetchPlanRow(query, plan_id, req.epmpUser!.jurisdiction_scope);
    if (!existing) { return reply.code(404).send(PLAN_NOT_FOUND); }
    targetPlanId = plan_id;
    try {
      await linkDocument(req.epmpUser!.id, source_document_ref, targetPlanId, req.epmpUser!.jurisdiction_scope);
      // ^ always linkDocument(), regardless of req.body.mode
  ```
  Compare to the `else` (new-plan) branch, which DOES correctly branch:
  ```ts
  if (mode === 'import_copy') {
    await importDocument(req.epmpUser!.id, source_document_ref);
  } else {
    await linkDocument(...);
  }
  ```
  Concrete failing input: a user opens `ImportDocumentModal`, selects "Attach to an existing plan," and clicks **"Import copy"** (`handleSubmit('import_copy')`, `ImportDocumentModal.tsx:218`) — the frontend sends `{ mode: 'import_copy', plan_id: <id>, ... }`. The backend ignores `mode` entirely on this branch and always writes a `document_links` row with `mode = 'link_live'` (hardcoded inside `linkDocument()`, `document-adapter.ts:218`). The user asked for a one-time point-in-time copy (no ongoing sync/flagging) and silently got a live, periodically-revalidated sync link instead — the two modes have materially different behavior per the FRD (S3.6: "choose Import copy vs. Link live sync mode," Process step 7: only `link_live` rows are swept by the background job and can be flagged "source changed" for review). The user has no way to discover this happened: the 201 response and UI navigation are identical for both buttons, and `PlanDetail.tsx`'s document_links Alert (flagged "source changed" review UI) will now spuriously apply to a document link the user believed was a disconnected copy.
  - This also means `importDocument()`'s own `import_copy` row (and its generated `content` body — the actual imported text) is never written or surfaced anywhere for the existing-plan-attach path, regardless of which button the user clicked — there is no code path in this route that ever calls `importDocument()` when `plan_id` is provided, even when `mode === 'import_copy'`.
  - Neither `plans.test.ts` nor `plan-document-import-link.spec.ts` tests `mode: 'import_copy'` combined with an existing `plan_id` — the gap is untested, which is why it shipped unnoticed (08-09's Task 2 test suite only exercises `import_copy` on the new-plan path and `link_live` on the existing-plan path, never the opposite pairing on either branch).
- **Fix direction:** Branch on `mode` inside the `if (plan_id)` block exactly as the `else` branch already does: call `importDocument()` when `mode === 'import_copy'` (and, since `importDocument()` itself never accepts a `plan_id`, either extend it to accept one or have the route separately UPDATE the resulting `document_links` row's `plan_id` after the call) vs. `linkDocument(..., targetPlanId, ...)` when `mode === 'link_live'`, matching the semantics the new-plan branch already implements correctly.

## WARNINGs

### W1: Imported document content is discarded on every `import_copy` path — `source_document_ref` is the only trace of the import, no section/body content is ever written to the new plan
- **File:** backend/src/modules/plans/plans.ts:425-426
- **Evidence:** `await importDocument(req.epmpUser!.id, source_document_ref);` — the call's return value (`{ id, content }`, where `content` is the simulated imported document body, `document-adapter.ts:157-160`) is never captured or used. The new plan is created with zero `plan_sections` rows (the INSERT at line 407 only sets `name/type/jurisdiction_id/owner_id/source_document_ref`, no section-population step follows). A user who clicks "Import copy" gets a completely empty Draft plan with no visible connection to the document's actual content — only `source_document_ref` (not rendered anywhere in `PlanDetail.tsx`, confirmed by grep: the field exists in neither `PlanDetailResponse`'s interface nor any JSX in that file) records what was imported. This is a materially incomplete implementation of the FRD's "import... landing it in Draft status" flow (F03 S3.6) — the document is fetched and a `document_links` row is written, but none of its content actually lands in the plan a user can read. Given this is a known sandbox stub (no real SharePoint content to import), this is a WARNING rather than a BLOCKER — the plumbing exists and a future real-adapter swap could wire the content through, but as shipped the "import copy" button produces an empty plan indistinguishable from a blank "Create plan," with no UI surfacing of `source_document_ref` to even confirm an import happened.
- **Fix direction:** Either write `importDocument()`'s returned `content` into a `plan_sections` row on creation (mirroring `POST /api/v1/plans`'s `content_sections` handling), or surface `source_document_ref` visibly on `PlanDetail.tsx` so a user can at least confirm which document was imported.

### W2: Pre-existing `jurisdiction_id`-unvalidated-against-caller-scope pattern reused, not introduced, by the new route — flagged for awareness only
- **File:** backend/src/modules/plans/plans.ts:407-409
- **Evidence:** The new-plan creation branch writes `jurisdiction_id` straight from the request body with no check that it is within `req.epmpUser!.jurisdiction_scope` — but this is the *exact same* pattern the pre-existing `POST /api/v1/plans` route already has (confirmed via `git show e545ee4:backend/src/modules/plans/plans.ts`, unchanged by this diff) and is not a regression this gap-closure diff introduced. Noted as an observation, not a finding requiring action in this review (pre-existing defect in an un-diffed code pattern, out of this review's bounded scope per the constraints) — surfacing it here only because the new route is the kind of place a reviewer might otherwise assume jurisdiction validation was freshly added everywhere.

## Cross-file seams checked

- `ImportDocumentModal.tsx`'s `apiPost('/api/v1/plans/import', {...})` body shape ↔ `plans.ts`'s `POST /api/v1/plans/import` `Body` type — fields match exactly (`source_document_ref`, `mode`, `name`, `type`, `jurisdiction_id`, `plan_id`); `mode` enum values (`'import_copy'|'link_live'`) match literally on both sides — OK, except see B1 (backend mishandles one combination, not a signature mismatch).
- `ImportDocumentModal.tsx`'s `onImported: (planId: string) => void` ↔ `PlanRepository.tsx`'s `onImported={(planId) => navigate(...)}` usage — signature matches, `result.id` from the POST response is the real new-or-existing plan id — OK.
- `plans.ts`'s new route importing `{ importDocument, linkDocument, hasDocumentAccess }` from `document-adapter.ts` ↔ `document-adapter.ts`'s actual exports — all three exist with matching signatures (`hasDocumentAccess(userId, externalDocId): boolean`, confirmed additive per 08-09-SUMMARY's own disclosure) — OK.
- `linkDocument()`'s 4th `jurisdictionScope?: string[]` parameter (08-07's fix) ↔ every call site in `plans.ts`'s new route — both call sites pass `req.epmpUser!.jurisdiction_scope` correctly — OK.
- `OperatingPicture.tsx`'s `<TaskList incidentId={selectedId} />` ↔ `TaskList.tsx`'s `TaskListProps.incidentId?: string` — `selectedId: string | undefined` matches the optional-string prop type exactly, no cast needed — OK.
- `operating-picture-facility-markers.spec.ts` / `operating-picture-resource-markers.spec.ts`'s Tasks-card-absence assertions (`getByRole('heading', { name: 'Tasks' })` toHaveCount(0)) ↔ `OperatingPicture.tsx`'s `!selectedIsResource && !selectedIsFacility` gate — structurally absent, not merely hidden, confirmed by reading the gate — OK.
- `plans.test.ts`'s new `describe('POST /api/v1/plans/import...)` fixture user (`importTestId`/`importTestToken`) ↔ `document-adapter.ts`'s module-level `SIMULATED_USER_DOCUMENT_ACCESS` map — correctly isolated from the earlier `simulateDocumentAccessRevocation(authorId, ...)` call in the same file/process, avoiding a false-negative — OK.
- 08-07's claimed "zero code changes" — independently confirmed: `git diff e545ee4..HEAD --stat` shows no changes to `document-adapter.ts`'s `linkDocument`/`planIsInScope` (the file WAS changed in this diff range, but only by 08-09's `hasDocumentAccess` addition — `linkDocument`/`planIsInScope` content is untouched, matching 08-07-SUMMARY's claim) — OK.
