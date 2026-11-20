---
status: diagnosed
trigger: "Investigate issue: plan-repository-document-import-no-visible-result"
created: 2026-11-20T00:00:00Z
updated: 2026-11-20T00:10:00Z
---

## Current Focus

hypothesis: CONFIRMED. Root cause fully established — see Resolution.
test: Read 08-02-PLAN.md, 08-05-PLAN.md, 08-05-SUMMARY.md, 08-02-SUMMARY.md, ImportDocumentModal.tsx, PlanRepository.tsx, PlanDetail.tsx, plans.ts, document-adapter.ts, plan-document-import-link.spec.ts, F3/F17 FRDs
expecting: n/a — investigation complete
next_action: Return ROOT CAUSE FOUND (goal: find_root_cause_only — no fix applied)

## Symptoms

expected: A user with document-system permission can browse, import, or live-link a document from the simulated SharePoint-class adapter into the Plan Repository, with the result visibly reflected in the product (per F17's success criterion — a user "can browse, import, or live-link an EOP/SOP/annex/evidence document... into the Plan Repository").
actual: User reported "either 'Import copy' or 'Link live' this doesnt take me anyhwere no downlaods also" — clicking either button in ImportDocumentModal just closes the modal with no observable change. Directly reproduced: POST /api/v1/integrations/documents/DOC-EOP-001/import returns 201 and creates a real `document_links` row (confirmed via direct Postgres query — 6 rows total, every standalone import_copy/link_live row has plan_id=NULL), but PlanRepository.tsx's onImported handler only calls refetch() on the existing plans list, which is unchanged ("2 plans" before and after). No new Plan is created from the import, no existing plan gets the row attached anywhere in the UI, and no document-links/content viewer exists to show the freshly created row.
errors: None (requests succeed with 201; this is a silent no-op from the user's perspective, not an error)
reproduction: Sign in as planner@epmp.local / devpass123 at http://127.0.0.1:5173, go to /plans, click "Import plan", select "Regional EOP", click "Import copy" (or "Link live"). Modal closes; nothing else changes.
started: Discovered during Phase 8 UAT (Test 4), reported by the human tester, reproduced directly.

## Eliminated

(none yet)

## Evidence

- timestamp: 2026-11-20T00:02:00Z
  checked: 08-05-PLAN.md `must_haves.truths` (line 22) and Task 2's `<action>` (08-05-PLAN.md:142-143)
  found: The plan's OWN acceptance criterion literally states "Successfully importing a document creates a new Plan Repository entry (OR attaches a document_links row to an existing plan) the user can subsequently open." Task 2's actual instruction only tells the implementer to call `onImported={() => void refetch()}` on the EXISTING plans-list query — it never instructs creating a new Plan record or prompting for an existing-plan target. The plan's acceptance criterion names two valid outcomes; the plan's own task body only wires the no-op refetch, satisfying neither outcome.
  implication: 08-05-PLAN.md itself is internally inconsistent — its truths/must_haves demanded a visible result, but its task-level instructions never actually produced one. This is a plan-authoring gap, not solely an implementer error.

- timestamp: 2026-11-20T00:03:00Z
  checked: 08-02-PLAN.md Task 1 point 4 (line 201) and 08-02-SUMMARY.md's key-decisions (line 42)
  found: 08-02-PLAN.md's own instruction text is explicitly hedged: "`plan_id` is nullable on that table so this import-without-a-plan-yet call leaves it NULL, matching Plan Repository's standalone-import flow where the plan association happens at a later step in Plan 08-05's UI, OR — if your reading of the Plan Repository flow shows `plan_id` is always known at import time — accept an optional `planId` parameter and pass it through; document whichever you implement." The implementer chose the NULL path and documented it in 08-02-SUMMARY.md's key-decisions: "document_links.plan_id left NULL on importDocument... matching Plan Repository's standalone-import flow." But no "later step in Plan 08-05's UI" was ever specified in 08-05-PLAN.md's task list — Plan 08-02 assumed 08-05 would build it; 08-05 was never actually written to build it.
  implication: Confirms a plan-to-plan coordination gap: 08-02 deferred the plan-association UI to 08-05, but 08-05-PLAN.md's task list (Task 1: modal, Task 2: wire button+refetch, Task 3: Playwright) never includes any such step. The assumption was never validated across the two plan files.

- timestamp: 2026-11-20T00:04:00Z
  checked: ImportDocumentModal.tsx handleSubmit() (lines 78-100) and apiPost call (line 83)
  found: `await apiPost(\`/api/v1/integrations/documents/${selectedDocId}/${mode}\`, {})` — body is a hardcoded empty object. No planId is collected anywhere in the component (no plan-picker UI, no "create new plan" UI element exists in the file at all).
  implication: linkDocument()'s optional planId parameter (backend/document-adapter.ts:154) is structurally unreachable from the UI — the capability exists at the function/route level but no frontend code path can ever supply it.

- timestamp: 2026-11-20T00:05:00Z
  checked: PlanRepository.tsx line 266, onImported wiring
  found: `<ImportDocumentModal ... onImported={() => void refetch()} />` where `refetch` is the EXISTING `useQuery(['plans', ...])` list query's refetch function (destructured line 98). This query lists rows from the `plans` table only — it has no join to `document_links` and no code path renders a `document_links` row directly.
  implication: Confirms the user's reproduction — refetching an unrelated list that was never going to change is indistinguishable from "the button does nothing."

- timestamp: 2026-11-20T00:06:00Z
  checked: backend/src/modules/plans/plans.ts — grepped all INSERT/SELECT statements touching `document_links` and `source_document_ref`
  found: (1) The ONLY read of `document_links` anywhere in the backend is `plans.ts:138`: "`... FROM document_links WHERE plan_id = $1`" — scoped inside the single-plan detail-fetch handler. There is NO route anywhere (grepped whole backend/src) that selects `document_links WHERE plan_id IS NULL` — i.e., no "pending/unattached imports" list endpoint exists, confirming no such screen was ever built (not merely hidden). (2) `source_document_ref` (a TEXT column on `plans` itself, migration 1700000000007 line 18) is SELECTed in two list/detail queries but is NEVER written anywhere — `INSERT INTO plans` (plans.ts:298-301) only inserts `(name, type, jurisdiction_id, owner_id)`, no `source_document_ref`. No frontend form passes it either (grep for the field across frontend/app/src/pages/plans/*.tsx returns zero hits in any create-plan call site). This column appears to be the schema's own placeholder for exactly the "create a new Plan from an imported document" outcome 08-05-PLAN.md's acceptance criterion named as option A — and it was never wired up by ANY plan.
  implication: The "create a new Plan Repository entry" half of 08-05's own acceptance criterion (option A) has a literal, unused column (`plans.source_document_ref`) sitting ready for it in the schema since Phase 3 — proving this was the intended mechanism, not merely one of two abstractly-equal options invented after the fact. Nobody ever wrote the code to populate it from an import.

- timestamp: 2026-11-20T00:07:00Z
  checked: PlanDetail.tsx lines 40-53, 318-346 — the document_links Alert rendering block (built by Plan 08-06, NOT 08-05)
  found: PlanDetail.tsx DOES fully render `plan.document_links` entries (flagged "Source changed, review" Alert and "Access removed" Alert) — but ONLY as a sub-list of an EXISTING plan already being viewed (`document_links: PlanDocumentLink[]` is a field on `PlanDetailResponse`, populated by `plans.ts`'s `WHERE plan_id = $1` query). This proves a document_links-rendering surface DOES exist in the product — but it is only reachable by opening a plan whose id the row's `plan_id` column points to. Since every row produced by the real UI has `plan_id = NULL`, this existing, working surface is permanently unreachable for anything the shipped ImportDocumentModal.tsx produces.
  implication: This is the most direct confirmation of impact: Plan 08-06's own flagged-review feature (the single most safety-critical F17 capability — "flag a stale live-linked document for human review") is DEAD CODE in practice for any row created through the product's own UI. The only reason it was ever observed working in UAT is that the data-doctor's seed script called `linkDocument()` directly with an explicit `planId`, bypassing `ImportDocumentModal.tsx` entirely — an artificial path no real user can take.

- timestamp: 2026-11-20T00:08:00Z
  checked: 08-05-SUMMARY.md "Deviations from Plan" (line 83-85) and "Known Stubs" (line 99-101)
  found: "Deviations from Plan: None - plan executed exactly as written... zero auto-fixes required." "Known Stubs: None found — grep for TODO/FIXME/placeholder/not-implemented... returned only prose comments... neither of which represents an incomplete implementation." The Playwright suite (4/4 passing, Test 2/Test 4) only asserts "modal closes, no error Alert shown" as the definition of success for Import copy/Link live — it NEVER asserts anything about a resulting visible plan-list change or document_links row surfacing anywhere.
  implication: The gap was invisible to the plan's own verification gates because `<done>`/`<verify>` in 08-05-PLAN.md Task 2/Task 3 only required "clicking it opens ImportDocumentModal" / "modal closes, no error" — never "a new Plan or attached row appears on screen." The acceptance criterion text (line 22) that WOULD have caught this was never translated into an executable task instruction or e2e assertion. This is why the plan "passed" all self-checks while shipping a UX no-op.

- timestamp: 2026-11-20T00:09:00Z
  checked: project_specs/FRD/F03-plans-playbooks.md S3.6 (line 34-38) and F17-asset-facility-document-integration.md (line 1-15)
  found: F3's S3.6 spec: "A planning user creates a new plan OR imports one from a connected document system (F17) via S3.6, landing it in Draft status, version 1." This is explicit: an import MUST land as a Plan in Draft status, version 1 — i.e., option A (new Plan record) of 08-05's acceptance criterion is actually the FRD's literal, singular specified behavior, not an equally-valid alternative to "attach to an existing plan." F17's own FRD: "Document link: A reference from an EPMP plan (F3) to an externally-stored document, either imported as a copy or linked live" — again presupposing a plan already exists to hold the reference.
  implication: The FRD itself specifies ONLY the "creates a new Plan, Draft status, version 1" outcome — 08-05-PLAN.md's must_haves loosened this into an OR with "attaches to an existing plan" (possibly to cover the "Link live" case on an already-existing plan, which is a legitimate secondary use case), but neither outcome was implemented. The primary, FRD-mandated outcome (new Plan, Draft, v1, with source_document_ref populated) is the one that was dropped entirely.

## Resolution

root_cause: |
  ImportDocumentModal.tsx's handleSubmit() POSTs an empty body `{}` to
  /import and /link, and PlanRepository.tsx's onImported handler only
  refetches the unrelated plans list — because NEITHER 08-05-PLAN.md's task
  instructions NOR the shipped code ever implement the "later step" that
  08-02-PLAN.md's own document-adapter.ts explicitly deferred to it: turning
  a standalone import into either (a) a brand-new Plan record (the FRD's
  actual S3.6-specified behavior — "lands it in Draft status, version 1,"
  with the already-existing-but-never-written `plans.source_document_ref`
  column as the intended marker) or (b) an attachment to a user-chosen
  existing plan (08-05-PLAN.md's own must_haves line 22 names this as an
  acceptable alternative, but no existing-plan picker was ever built either).

  This is a cross-plan coordination gap, not a single implementation bug:
  - 08-02-PLAN.md (backend) explicitly hedged plan_id=NULL as matching
    "Plan Repository's standalone-import flow where the plan association
    happens at a later step in Plan 08-05's UI" — deferring responsibility
    forward.
  - 08-05-PLAN.md (frontend) was never actually WRITTEN to include that
    later step: its Task 1 (modal) only implements browse+submit with an
    empty POST body, its Task 2 (wiring) only refetches the existing plans
    list, and its own must_haves/acceptance-criteria line (which correctly
    names the two valid outcomes) was never translated into task-level
    instructions or Playwright assertions that would have caught the gap.
  - The result: a real, permission-correct, 201-returning backend write
    with literally no reachable read-surface for standalone imports, and
    Plan 08-06's own flagged-review Alert (which depends on a non-NULL
    plan_id) is consequently dead code for every row the shipped UI can
    itself produce.

fix: (not applied — goal is find_root_cause_only)

suggested_fix_direction: |
  Two-part fix, both needed:
  1. ImportDocumentModal.tsx must collect a target: either (a) let the user
     pick an existing plan from a plan-selector dropdown and pass `planId`
     through to POST .../link (the parameter already exists server-side,
     unused), attaching the row to that plan; or (b) for "Import copy" with
     no existing-plan context (the FRD's literal S3.6 behavior), call a NEW
     backend endpoint (or extend POST .../import) that ALSO creates a new
     `plans` row in Draft/version 1 with `source_document_ref` set to the
     external_document_id, and a `document_links` row whose `plan_id` points
     at that new plan — then navigate the user to that new plan's detail
     view (or close the modal and refetch + show a toast linking to it).
  2. PlanRepository.tsx's onImported callback must do more than refetch an
     unrelated list — it needs to know whether a new plan was created (and
     navigate/highlight it) or an existing plan was updated (and surface
     that specifically), not treat "refetch the full unfiltered list" as
     sufficient feedback.
  A regression check: after the fix, Plan 08-06's existing "Source changed,
  review" Alert on PlanDetail.tsx should become reachable via the normal
  product UI (not just the data-doctor's seed script), since it depends on
  exactly this gap being closed.

verification: (not applicable — diagnosis only, no fix applied)

files_changed: []
