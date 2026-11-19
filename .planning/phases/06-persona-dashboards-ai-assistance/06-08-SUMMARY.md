---
phase: 06-persona-dashboards-ai-assistance
plan: 08
subsystem: ai-assist
tags: [ai-draft, ics-forms, governance, react-query, playwright]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-assistance
    provides: "06-01's icsFormsRoutes (ics_forms backend + assertAiOriginApproved governance guard), 06-03's aiDraftsRoutes (ai-drafts request/approve/discard lifecycle), 06-05's AIDraft design-system component, 06-07's already-landed /field and /executive routes in main.tsx"
provides:
  - "IcsFormEditor.tsx — the first real, reachable consumer of 06-01's ics_forms backend and 06-05's AIDraft component, routed /incidents/{incidentId}/forms/{formId}"
  - "A real end-to-end proof (Playwright, not just backend integration tests) that a single AIDraft Approve click cascades through ai-drafts approve -> ics-forms create -> ics-forms-level approve, producing a Timeline entry in one user action"
  - "A direct-API-bypass proof that an unapproved ai_origin:true write is rejected server-side (400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED) regardless of which client calls the endpoint"
  - "Incident Workspace's Reports tab now links to a real ICS-201 form instead of a dead-end 'ships in a later phase' placeholder"
affects: [06-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AIDraft embedding pattern: request-draft never touches the target field's own state; onApprove's single callback is the ONLY code path that writes draft text into the field, after the backend approve call has already succeeded"
    - "Governance-gate cascade: a single UI action chains two separate governance-sensitive POSTs (ai-drafts approve, then ics-forms-level approve) in sequence, with the frontend's own ordering treated as UX convenience, not the actual security boundary (enforced server-side by assertAiOriginApproved)"

key-files:
  created:
    - frontend/app/src/pages/incidents/IcsFormEditor.tsx
    - frontend/app/src/pages/incidents/IcsFormEditor.css
    - frontend/app/e2e/ics-form-aidraft.spec.ts
  modified:
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/src/main.tsx

key-decisions:
  - "ics_forms has no PATCH endpoint (06-01's own scope) — each narrative edit after the first create re-POSTs a new ics_forms row rather than updating in place; documented inline as a known Phase-6 simplification"
  - "'Approve form' button exists only for the manual-no-draft path (no AIDraft ever requested) — it is NOT a second click needed after AIDraft's own Approve; the single AIDraft Approve already completes the full ai-drafts+ics-forms cascade"
  - "A fresh page visit never auto-creates an ics_forms row — POST only fires on first explicit save (either via AIDraft's Approve cascade or the manual 'Save draft' button), avoiding littering the DB with empty draft rows from mere navigation"

patterns-established:
  - "AIDraft panel renders as a sibling DOM node directly below (never inside) the field it drafts for, matching the UX mockup's explicit layout rule and making 'never appears pre-inserted' true by construction, not just convention"

# Metrics
duration: 8min
completed: 2026-11-19
---

# Phase 6 Plan 08: ICS Form Editor with Embedded AIDraft Summary

**Built the ICS Form / Checklist Editor (ICS-201) wiring F9's AIDraft component into a real official-record target — a single AIDraft "Approve" click now cascades through ai-drafts approve, ics_forms create, and ics_forms-level approve, producing a Timeline entry in that same user action, with a direct-fetch bypass proven rejected server-side.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-19T13:44:20Z
- **Completed:** 2026-11-19T13:51:01Z
- **Tasks:** 3
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- New `IcsFormEditor.tsx` (ICS-201 form, routed `/incidents/{incidentId}/forms/{formId}`) embeds `AIDraft` exactly per the mockup: "Draft with AI" never touches the narrative field's own state; the panel renders as a separate sibling directly below the field; `handleApprove` cascades `POST /api/v1/ai-drafts/{id}/approve` → `POST .../ics-forms` (create) → `POST .../ics-forms/{formId}/approve` (the Timeline write), all from the AIDraft panel's own single Approve click.
- A separate "Approve form" button covers only the manual-no-draft path (narrative written entirely by hand, no AI draft ever requested) — it calls the same ics-forms approve endpoint directly and is disabled once already Approved or while the form has no content yet.
- `IncidentWorkspace.tsx`'s Reports tab now has a real, reachable "Open ICS-201 form" button, closing the last `ics_forms`-specific orphan-page gap (SITREP/AAR generation were already real from Phase 4).
- Route registered in `main.tsx` strictly after 06-07's `/field`/`/executive` routes (wave 7, explicit `depends_on`), appended last with a comment pointing future plans (06-09) at the correct append point.
- New Playwright spec (`ics-form-aidraft.spec.ts`) proves the full flow end-to-end: draft-never-pre-inserts, discard-leaves-field-untouched, a single AIDraft Approve producing both the `ai_drafts.approved_by` write and the Timeline entry, and — the plan's explicit criterion-4 requirement — a raw `fetch` bypass of the UI's own Approve button against a never-approved draft still gets rejected `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` by 06-01's server-side `assertAiOriginApproved` guard.

## Task Commits

Each task was committed atomically:

1. **Task 1: ICS Form Editor with embedded AIDraft + Provenance** - `66acb4e` (feat)
2. **Task 2: Route registration** - `96864d5` (feat)
3. **Task 3: Playwright — full draft/approve/discard flow + server-side-rejection proof** - `c36fc23` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/incidents/IcsFormEditor.tsx` - ICS-201 form page: narrative TextField + AIDraft embedding + the handleApprove governance cascade + the manual-only Approve-form path
- `frontend/app/src/pages/incidents/IcsFormEditor.css` - Token-only spacing, mockup's layout minus the out-of-scope multi-step Progress component
- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` - Reports tab: added "Open ICS-201 form" button alongside the existing Generate SITREP/AAR actions
- `frontend/app/src/main.tsx` - Appended `/incidents/:incidentId/forms/:formId` route after 06-07's routes
- `frontend/app/e2e/ics-form-aidraft.spec.ts` - Full-stack Playwright proof of success criteria 3 and 4

## Decisions Made
- See `key-decisions` in frontmatter above — all three are documented, budget-scoped simplifications consistent with 06-01's own stated scope (no `ics_forms` PATCH, no auto-create-on-visit), not regressions.

## Deviations from Plan

None - plan executed exactly as written. All integration contracts (06-01's `icsFormsRoutes`, 06-03's `aiDraftsRoutes`, 06-05's `AIDraft`, 06-07's already-landed routes in `main.tsx`) were present and matched their documented shapes exactly; no renumbering, relocation, or missing-dependency issues encountered.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- F9's three documented embedding points now have one real, end-to-end-proven instance (ICS form narrative); F5 (message compose) and F7 (SITREP/AAR narrative) already had their own independent AIDraft embeddings from Phase 4 (ComposeNotification.tsx, SitrepGenerator.tsx), so F9's cross-feature embedding requirement is now satisfied across all three named touchpoints.
- `main.tsx`'s append order for this phase is now 06-06 → 06-07 → 06-08 (this plan) → 06-09, each an explicit `depends_on` edge — 06-09 should append its own routes after line 215's `IcsFormEditor` route.
- No blockers for 06-09.

## Self-Check: PASSED

- `frontend/app/src/pages/incidents/IcsFormEditor.tsx` — FOUND
- `frontend/app/src/pages/incidents/IcsFormEditor.css` — FOUND
- `frontend/app/e2e/ics-form-aidraft.spec.ts` — FOUND
- Commit `66acb4e` — FOUND in git log
- Commit `96864d5` — FOUND in git log
- Commit `c36fc23` — FOUND in git log
- `cd frontend/app && npx tsc --noEmit` — exit 0, no errors
- `cd frontend/app && npm run build` — succeeded (vite build, 162 modules)
- `cd backend && npm run build` — succeeded (tsc -p tsconfig.json)
- `cd backend && npm test` — 19 files / 108 tests passed (zero regression)
- `cd frontend/app && npx playwright test e2e/ics-form-aidraft.spec.ts --workers=1` — 1/1 passed
- `cd frontend/app && npx playwright test e2e/incident-workspace.spec.ts --workers=1` — 6/6 passed (zero regression)
- `## Known Stubs` — None found (grep for TODO/FIXME/placeholder/not-implemented across all changed files returned only pre-existing historical comments in `IncidentWorkspace.tsx` describing already-resolved Phase 2/4 placeholders, none from this plan's own new code)

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
