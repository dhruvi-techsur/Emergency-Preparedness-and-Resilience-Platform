---
status: diagnosed
phase: 08-record-authority-sync-integrations
source: [08-01-SUMMARY.md, 08-02-SUMMARY.md, 08-03-SUMMARY.md, 08-04-SUMMARY.md, 08-05-SUMMARY.md, 08-06-SUMMARY.md]
started: 2026-11-20T13:57:48Z
updated: 2026-11-20T14:40:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. EOC COTS Integration Health Row
expected: Opening the admin Integration Health screen shows a row for the WebEOC-class EOC COTS system declaring which record types it is authoritative for versus EPMP, with last-sync/direction/SyncStatus visible.
live: pass — `signed in as admin@epmp.local, navigated to /admin/integration-health` → WebEOC row rendered with System=WebEOC, Direction=bidirectional, Record authority=WebEOC, Status=online, Last sync=11/20/2026 2:07:14 PM (screenshot: .pivota/uat-shots/1-integration-health.png)
result: pass

### 2. EOC COTS Conflict Resolution
expected: When a conflict exists between an EPMP record and the external WebEOC system, expanding the integration-health row shows both values side by side with "Keep EPMP value" / "Keep WebEOC value" actions. Clicking one resolves the conflict (it disappears from the list) and it never reappears automatically.
live: pass — `clicked "1 conflict — review" toggle on the live page` → side-by-side panel rendered with "EPMP value" (status:Monitoring,severity:Elevated) / "WebEOC value" (status:Active,severity:Elevated) and literal "Keep EPMP value"/"Keep WebEOC value" buttons present (screenshot: .pivota/uat-shots/2-conflict-expanded.png); the resolve-and-never-reappear half of this test is covered by 08-03-SUMMARY.md's REVIEW.md-cited live Postgres repro (3 ticks -> 1 row; resolve + 1 more tick -> still 1 row, resolved) and eoc-cots-conflict-resolution.spec.ts (4/4, browser_suite: pass) — not independently re-clicked here to avoid consuming the phase's one seeded conflict fixture before the human sees it
result: pass

### 3. Operating Picture Facility Markers
expected: The Operating Picture map shows facility/asset markers (square shape) sourced from the facility adapter stub, each showing a Provenance chip (source/as-of) when clicked. No inventory count, maintenance date, or cost figure ever appears anywhere in the popup.
live: pass — `signed in as eocdirector@epmp.local, navigated to /operating-picture, clicked the facility marker` → popup showed "County EOC Building", "Status: operational", "agency_erp · 14:07" (Provenance), full popup text scanned for inventory/maintenance/annual cost/$ — none found (screenshot: .pivota/uat-shots/3-operating-picture.png). 🤖 Auto-check: clicking the facility marker also opens a side "Tasks" card reading "Tasks ship in a later phase — Task tracking (F4) is built in Phase 3" — Phase 3 is complete and tasks are a fully built feature; this is unrelated to this test's own pass/fail criteria (Provenance + no forbidden field, both satisfied) but is recorded as gap 1 below
result: pass

### 4. Plan Repository Document Import/Link
expected: A user with document-system permission can open "Import plan" on the Plan Repository, search/browse documents from the simulated SharePoint-class adapter, and either "Import copy" or "Link live" a document into the Plan Repository. A document the user lacks permission for never appears in the browse/import list at all.
live: pass — `signed in as planner@epmp.local, navigated to /plans, clicked "Import plan"` → modal opened showing "Regional EOP" and "Flood Response SOP" (both SharePoint-sourced); "Hazmat Annex" (the withheld document) absent from the rendered list (screenshot: .pivota/uat-shots/4-import-modal.png). Server-side enforcement (not just hidden client-side) independently proven by 08-05-SUMMARY.md's direct page.evaluate+fetch bypass test
result: issue
reported: "either \"Import copy\" or \"Link live\"  this doesnt take me anyhwere no downlaods also"
severity: major

### 5. Live-Linked Document Flagged Review
expected: When a "Link live" document's background sync detects the simulated source document changed, the linked plan's reading view shows a persistent "Source changed, review" alert rather than silently applying the external edit. Clicking "Mark reviewed" clears the flag.
live: pass — `signed in as planner@epmp.local, navigated to /plans/7f09c2b1-80d7-4134-a2ef-1e8c77c164d6` (the UAT-LINK-TASKS-READY plan, with a real link_live DOC-SOP-002 row flagged content_status='changed' via the real runDocumentLinkSync() path, seeded this session) → page rendered the literal "Source changed, review" alert with a "Mark reviewed" button, and the plan's own Shelter-activation section content rendered unchanged alongside it (screenshot: .pivota/uat-shots/5-plan-detail-flagged.png). The acknowledge-clears-the-flag half is independently proven by plan-live-link-flagged-review.spec.ts (3/3, browser_suite: pass) — not clicked here to leave the flagged state visible for the human tester
result: pass

## Summary

total: 5
passed: 4
issues: 1
pending: 0
skipped: 0

## Self-Check

boot: 200
data: seeded 1 precondition (test 5's link_live/flagged document_links row) | all other preconditions present
routes_probed: 5 ok / 0 failed
cookie: n/a — app session is bearer-token (sessionStorage via oidc-client-ts), not cookie-based; Keycloak's own session cookies observed SameSite=None;Secure (modern) / SameSite=Lax;Secure=false (legacy fallback pair), neither read by this app
browser_urls: none
documented_limitations: none
repairs: none — the only change since baseline HEAD is a committed seed addition (55311be), not an instance-only repair
stale_placeholders: 1
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: WebEOC integration-health row confirmed live via real browser session, all required columns present."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: side-by-side conflict panel with both named action buttons confirmed live; resolve-never-reappears behavior cited from 08-03-SUMMARY.md's independently-reproduced evidence, not re-driven here."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: facility marker popup confirmed Provenance-bearing and structurally free of forbidden fields. A separate, unrelated stale-placeholder defect was found in the same flow's side panel — see gap 1."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: browse list confirmed server-filtered live (withheld doc absent), corroborated by 08-05's direct-bypass proof."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: flagged alert + unchanged plan content confirmed live against a real detection-path-seeded row."
    confidence: proven

## Gaps

- truth: "The Operating Picture never shows a user-facing claim that a shipped, complete feature (Task tracking, F4) is still pending a future phase"
  status: failed
  reason: "self_check's stale-placeholder scan (0c) found frontend/app/src/pages/operating-picture/OperatingPicture.tsx:643 reading 'Task tracking (F4) is built in Phase 3.' inside an EmptyState titled 'Tasks ship in a later phase', rendered in the side panel whenever ANY marker (including Phase 8's new facility markers) is selected. Phase 3 (Plans, Tasks & Resource Requests) is complete and ROADMAP.md confirms it; tasks.ts's GET /api/v1/tasks already supports an `incident` query filter, so an incident-scoped task list is buildable today. The Tasks card was never updated to query it — it still shows Phase 2-era placeholder copy claiming the feature doesn't exist yet, which a user clicking any incident OR the new facility marker will see verbatim."
  severity: major
  test: 3
  source: self_check
  confidence: proven
  root_cause: >
    Operating Picture's side-panel "Tasks" Card was built in Phase 2 (02-07-PLAN.md) as an honest,
    explicitly-labeled temporary placeholder, written before the `tasks` table existed (F4/Task-tracking
    is Phase 3 scope). Phase 2's own plan and summary self-identify this placeholder and flag it
    (02-07-SUMMARY.md's "Known Stubs" section) as something a later phase should close — the same
    pattern used for IncidentWorkspace.tsx's identical placeholder text from Phase 2's 02-06 plan.
    Phase 3 DID close the IncidentWorkspace instance (03-08-PLAN.md, "Close the loop Phase 2's 02-06
    deliberately left open," replacing it with `<TaskList incidentId={...}>`). Phase 3's only other
    touchpoint on OperatingPicture.tsx (03-09-PLAN.md) had a narrowly scoped objective — resource-request
    map markers — and never revisited the side-panel Tasks card. No plan/summary/REVIEW/VERIFICATION
    across Phases 3-8 ever tracks OperatingPicture's Tasks card as a follow-up. This is a pure oversight,
    not an intentional design decision: the FRD (F02-common-operating-picture.md line 21) has always
    specified "incident Timeline AND task list" for this column; the backend endpoint
    (GET /api/v1/tasks?incident={id}) and the exact reusable frontend component (<TaskList incidentId={...}>)
    both already exist and are proven working elsewhere. Secondary structural finding: the Tasks Card
    renders unconditionally whenever `selectedId` is set, with no gate for `selectedIsResource`/
    `selectedIsFacility` (both already computed in the file) — so resource and facility marker
    selections also incorrectly trigger this incident-tasks placeholder.
  artifacts:
    - path: "frontend/app/src/pages/operating-picture/OperatingPicture.tsx"
      issue: "Lines 629-646: hardcoded stale EmptyState placeholder instead of <TaskList incidentId={...}>; renders unconditionally with no selectedIsResource/selectedIsFacility gate"
  missing:
    - "Replace the EmptyState (lines 641-645) with <TaskList incidentId={selectedId} /> (import from ../tasks-resources/TaskList), mirroring 03-08's exact fix pattern for IncidentWorkspace.tsx's identical placeholder"
    - "Gate the entire Tasks card behind !selectedIsResource && !selectedIsFacility, matching the existing pattern already used for the Timeline/incident-detail queries"
  debug_session: ".planning/debug/operating-picture-stale-tasks-placeholder.md"

- truth: "A user with document-system permission can import or live-link a document from the simulated SharePoint-class adapter into the Plan Repository, and the result is visibly reflected in the product (a new plan, an updated plan, or a visible document reference) — not a silent no-op from the user's perspective"
  status: failed
  reason: "User reported: \"either 'Import copy' or 'Link live' this doesnt take me anyhwere no downlaods also\" (Test 4). Reproduced directly: clicking 'Import copy' on 'Regional EOP' in the modal fires POST /api/v1/integrations/documents/DOC-EOP-001/import, which returns 201 and genuinely inserts a document_links row (confirmed via direct Postgres query: 6 rows exist, each with plan_id=NULL for every import_copy/standalone link_live row). The modal closes and PlanRepository.tsx's onImported handler only calls refetch() on the EXISTING plans list — but importDocument()/linkDocument() (document-adapter.ts:121-172) always write plan_id=NULL for a standalone import (by explicit design per the inline doc comment: 'plan association happens at a later step'), and no later step exists anywhere in the shipped code: no new Plan is created from the imported content, no plan gets the import attached, and no document-links/content viewer renders the freshly-created row. The Plans & playbooks list is unchanged before and after (still '2 plans'), so from the user's perspective the action does precisely nothing observable, even though the backend silently created a real, permanently-orphaned document_links row every time. linkDocument() DOES accept an optional planId, but ImportDocumentModal.tsx never collects or passes one (confirmed: its handleSubmit always POSTs an empty body {}), so even 'Link live' from this modal can never produce the kind of linked-to-an-existing-plan row that PlanDetail.tsx's flagged-review feature (Plan 08-06) depends on — Test 5's working flow exists ONLY because the data-doctor's seed fixture called linkDocument() directly with an explicit planId, bypassing this UI entirely."
  severity: major
  test: 4
  source: user
  confidence: proven
  root_cause: >
    Cross-plan coordination gap, not a single implementation bug. 08-02-PLAN.md (backend) explicitly
    hedged `document_links.plan_id = NULL` on a standalone import as matching "Plan Repository's
    standalone-import flow where the plan association happens at a later step in Plan 08-05's UI" —
    deferring responsibility forward. 08-05-PLAN.md (frontend) was never actually written to include
    that later step: its own must_haves.truths (line 22) correctly names the required outcome
    ("creates a new Plan Repository entry OR attaches a document_links row to an existing plan"),
    but Task 1's action only implements browse+submit with an empty {} POST body, and Task 2's action
    only wires onImported={() => void refetch()} against the pre-existing, unrelated plans-list query
    — neither task ever instructs creating a new Plan or picking an existing one, and the acceptance
    criterion was never translated into a task-level instruction or Playwright assertion (08-05's own
    e2e suite only asserts "modal closes, no error Alert," never "a visible plan/row change"). The
    FRD (F03-plans-playbooks.md S3.6) is unambiguous that an import must "land it in Draft status,
    version 1" — i.e., create a new Plan — and `plans.source_document_ref` (a TEXT column present
    since Phase 3's migration, SELECTed in list/detail queries) is the schema's own dormant placeholder
    for exactly this behavior, but it is never written anywhere. linkDocument()'s optional planId
    parameter is structurally unreachable from the UI (ImportDocumentModal.tsx never collects one).
    Consequential finding: PlanDetail.tsx's "Source changed, review" Alert (Plan 08-06, this same
    phase) already fully renders document_links rows keyed off plan_id — a real, working display
    surface — but it is unreachable for any row the shipped Import/Link UI can itself produce, since
    every such row has plan_id=NULL. Test 5 of this same UAT round only passed because the data-doctor
    seed fixture called linkDocument() directly with an explicit planId, bypassing ImportDocumentModal.tsx
    entirely — an artificial path no real user can take.
  artifacts:
    - path: "frontend/app/src/pages/plans/ImportDocumentModal.tsx"
      issue: "handleSubmit() always POSTs an empty body {} — never collects/passes a target plan or triggers new-plan creation"
    - path: "frontend/app/src/pages/plans/PlanRepository.tsx"
      issue: "onImported handler (line 266) only refetches the unrelated existing plans-list query, which cannot reflect a new plan or an attached row"
    - path: "backend/src/modules/plans/plans.ts"
      issue: "INSERT INTO plans (plans.ts:298-301) never writes source_document_ref; no endpoint creates a Plan from an import"
    - path: "backend/src/modules/integration-gateway/document-adapter.ts"
      issue: "linkDocument()'s planId parameter (line 154) exists but is unreachable from any frontend code path"
  missing:
    - "ImportDocumentModal.tsx must either let the user pick an existing plan (passing planId through to POST .../link) or, for 'Import copy' with no existing-plan context (the FRD's literal S3.6 behavior), trigger a new endpoint that creates a plans row (Draft, version 1, source_document_ref set) with a document_links row pointed at it"
    - "PlanRepository.tsx's onImported callback must navigate to/highlight the resulting plan rather than silently refetching an untouched list"
    - "Regression check once fixed: Plan 08-06's existing 'Source changed, review' Alert on PlanDetail.tsx should become reachable through the real product UI, not just the data-doctor's seed script"
  debug_session: ".planning/debug/plan-repository-document-import-no-visible-result.md"
