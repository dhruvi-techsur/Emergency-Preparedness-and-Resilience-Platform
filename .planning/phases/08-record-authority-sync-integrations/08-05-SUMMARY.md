---
phase: 08-record-authority-sync-integrations
plan: 05
subsystem: integrations
tags: [react, react-query, playwright, document-import, rbac, f17]

# Dependency graph
requires:
  - phase: 08-record-authority-sync-integrations
    provides: "Plan 08-02's permission-aware document-adapter.ts (browseDocuments/importDocument/linkDocument, GET/POST /api/v1/integrations/documents/*)"
provides:
  - "ImportDocumentModal.tsx — F3 S3.6's browse/import/link modal, server-side-filtered results list, Import copy vs Link live mode choice"
  - "PlanRepository.tsx's 'Import plan' action changed from Phase 3's documented disabled placeholder to a real, enabled entry point"
  - "plan-document-import-link.spec.ts — Playwright proof of the full browse/import/link flow plus a direct-API-bypass proof of server-side permission enforcement"
affects: [plans, integration-gateway]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Modal results list renders exactly what a permission-filtered browse endpoint returns, with zero client-side re-filtering — the server-side filter is the sole enforcement mechanism (T-08-18's mitigation)"
    - "A plain TextField + Table (not Combobox) for a search-then-select-a-row-to-act-on flow, reserving Combobox for single-value form fields"

key-files:
  created:
    - frontend/app/src/pages/plans/ImportDocumentModal.tsx
    - frontend/app/e2e/plan-document-import-link.spec.ts
  modified:
    - frontend/app/src/pages/plans/PlanRepository.tsx

key-decisions:
  - "ImportDocumentModal uses a plain TextField + Table for browse/select, not Combobox — the ARIA combobox/listbox single-value pattern doesn't fit a 'search a result list, then pick one row to act on' flow as naturally as this codebase's established Table pattern"
  - "No debounce on the search field — the stub's fixed 3-document catalog makes a per-keystroke round-trip free of real cost; debouncing would add complexity with no payoff at this data scale (documented inline)"
  - "Two distinct footer buttons (Import copy / Link live) rather than a mode Select + single confirm button, appearing only once a row is selected — matches F3 S3.6's literal 'choose Import copy vs Link live sync mode' wording with the fewest clicks"
  - "Reused the existing signInAsPlanningChief Playwright helper (03-05) rather than adding a new identity — planning_logistics_chief already holds plans view/create/edit, which document-adapter.ts's routes gate on"

patterns-established:
  - "F17-consuming frontend screens trust their browse/list endpoint's filtering completely — no second permission check in the component, proven via an e2e assertion that a withheld item has toHaveCount(0) in the DOM, not just a visual check"

# Metrics
duration: 18min
completed: 2026-11-20
---

# Phase 8 Plan 05: Plan Repository Document Import/Link (F17 frontend) Summary

**ImportDocumentModal.tsx consuming Plan 08-02's document adapter — TextField+Table browse UI, Import copy/Link live mode buttons, and a Playwright suite proving a withheld document is genuinely absent from the DOM while a direct API bypass against it still gets a real 403.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-20T12:10:00Z (approx.)
- **Completed:** 2026-11-20T12:28:41Z
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments
- New `ImportDocumentModal.tsx`: search → server-filtered results `Table` → select a row → "Import copy"/"Link live" footer buttons → `apiPost` to the matching endpoint, with a 403 rendering the FRD's exact message as an in-modal `Alert` (never a toast)
- `PlanRepository.tsx`'s "Import plan" `PageHeader` action is no longer `disabled` — it opens the modal and refetches the plan list on success, leaving `PlanDetail.tsx`'s separate "Import new version" placeholder untouched
- New `plan-document-import-link.spec.ts` (4/4 passing): browse-result permission filtering (withheld doc asserted absent via `toHaveCount(0)`, not just invisible), successful "Import copy", successful "Link live", and a direct `page.evaluate`+`fetch` bypass of the browse UI proving the 403 is server-enforced

## Task Commits

Each task was committed atomically:

1. **Task 1: ImportDocumentModal.tsx — browse, choose mode, import/link** - `9584e37` (feat)
2. **Task 2: Wire PlanRepository.tsx's "Import plan" action to the real modal** - `8ed3948` (feat)
3. **Task 3: Playwright — browse/import/link flow + server-side permission-boundary proof** - `ae49bfe` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/plans/ImportDocumentModal.tsx` - F3 S3.6 modal: TextField search, Table results (no client-side filtering), Import copy/Link live buttons, in-modal 403 Alert
- `frontend/app/src/pages/plans/PlanRepository.tsx` - "Import plan" button enabled, opens `ImportDocumentModal`, refetches on success
- `frontend/app/e2e/plan-document-import-link.spec.ts` - 4-test Playwright suite proving the full flow plus the server-side permission-boundary bypass proof

## Decisions Made
- TextField+Table over Combobox for the browse/select UI (documented above and inline in the component)
- No debounce on search, given the stub's fixed 3-document catalog
- Two distinct mode buttons in the modal footer, shown once a row is selected, rather than a Select+confirm pairing
- Reused `signInAsPlanningChief` — no new seeded identity needed since `planning_logistics_chief` already holds the `plans` view/create/edit grant the document routes check

## Deviations from Plan

None - plan executed exactly as written. All three tasks' `<verify>`/`<done>` criteria were met on the first implementation pass with zero auto-fixes required.

## Issues Encountered
None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- F17's Plan Repository import/link half (ROADMAP success criterion 4) is now fully satisfied end-to-end through the real UI, with server-side permission enforcement proven via direct API bypass, not just assumed from Plan 08-02's own backend test coverage
- `tsc --noEmit` and `npm run build` both clean for `frontend/app`; backend suite (21 files, 138 tests) green with zero regression (this plan touched no backend code); `plans.spec.ts` (4/4) regression-passes unaffected
- Ready for the next plan in this phase (08-06)

## Known Stubs

None found — `grep` for TODO/FIXME/placeholder/not-implemented across all three changed files returned only prose comments describing Phase 3's historical placeholder and the HTML `placeholder` attribute text on the search field, neither of which represents an incomplete implementation.

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*

## Self-Check: PASSED

- `frontend/app/src/pages/plans/ImportDocumentModal.tsx` — FOUND
- `frontend/app/src/pages/plans/PlanRepository.tsx` — FOUND, modified (Import plan no longer disabled)
- `frontend/app/e2e/plan-document-import-link.spec.ts` — FOUND
- Commits `9584e37`, `8ed3948`, `ae49bfe` — all FOUND in `git log --oneline`
- Build check: `cd frontend/app && npx tsc --noEmit` → exit 0; `npm run build` → exit 0
- Playwright: `plan-document-import-link.spec.ts` 4/4 passed; `plans.spec.ts` regression 4/4 passed
- Backend suite: 21 files, 138 tests, all passed (no backend code touched by this plan)
- `## Known Stubs` section present above; no blocking stubs found
