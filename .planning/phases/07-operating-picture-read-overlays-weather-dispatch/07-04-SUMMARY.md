---
phase: 07-operating-picture-read-overlays-weather-dispatch
plan: 04
subsystem: incident-ops
tags: [cad-911, dispatch-status, provenance, integration-health, read-only-ui, react-query, playwright]

# Dependency graph
requires:
  - phase: 07-operating-picture-read-overlays-weather-dispatch
    provides: "07-02's GET /api/v1/incidents/:id/dispatch-status (CAD/911 read-only backend contract) and seeded cad_dispatch_events fixture linked to the UAT-ESCALATE-READY demo incident"
  - phase: 07-operating-picture-read-overlays-weather-dispatch
    provides: "07-01's hazard-feed adapter writing 'NOAA/NWS/USGS Hazard Feed' rows into the shared integration_health table, needed for this plan's integration-health visibility assertion"
  - phase: 01-foundation
    provides: "Provenance product-pattern component (verified-true/false branch contract), Card layout component, admin Integration Health screen (01-11) and its generic Table-over-whatever-rows design"
provides:
  - "IncidentWorkspace.tsx's sidebar: a new read-only 'Dispatch status' Card (between Command roles and Map) consuming GET /api/v1/incidents/:id/dispatch-status via a new dispatchStatusQuery"
  - "Confirmation (doc comment + copy tweak only) that IntegrationHealth.tsx is generic over whatever rows the backend returns — no structural change needed for the new hazard-feed/CAD rows"
  - "incident-workspace-dispatch-status.spec.ts: 4 Playwright tests proving the no-edit-affordance, unmatched empty-state, integration-health visibility, and outage-tolerance contracts end-to-end"
affects: [none — this is the terminal frontend consumer plan for F15 in this phase]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Read-only data Card pattern: a Card with zero button/form/onClick anywhere in its JSX subtree is the structural 'no edit action' mechanism (mirrors 04-06's AarGenerator closure-gate 'absence, not merely hidden' precedent), verified by a committed grep-based check in the task's own <verify> step"
    - "Provenance's verified-true (default) branch is the correct rendering for read-only, authoritative-elsewhere data (CAD dispatch status) — distinct from F12/hazard-layer data's verified=false unverified-feed treatment, even though both flow through the same Provenance component"

key-files:
  created:
    - frontend/app/e2e/incident-workspace-dispatch-status.spec.ts
  modified:
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/src/pages/admin/IntegrationHealth.tsx

key-decisions:
  - "Dispatch status Card placed between Command roles and Map in the sidebar — command roles is most operationally urgent, map least, dispatch status sits in between; this plan's own documented discretion since Screen-05's layout predates F15 and names no explicit ordering"
  - "Status rendered as plain `<p>Status: {status}</p>` text, never a Badge — F15 defines no fixed tone-mapped status vocabulary the way incident severity does, so inventing a tone mapping would have been unjustified"
  - "Provenance always renders its verified-true (default) branch for this Card — CAD data isn't an 'unverified feed' being validated (F12's concept), it's read-only data whose authority lives elsewhere, so `verified={false}` is never passed here"
  - "IntegrationHealth.tsx required zero structural change: its Table is already generic over whatever rows GET /api/v1/admin/integration-health returns (confirmed by reading admin-integration-health.ts's backend route directly — a plain `SELECT *` with no system_name filter/allowlist). Only the now-stale EmptyState copy (implying no adapter is configured yet) and a doc comment were updated"
  - "The Playwright spec resolves the CAD-linked incident by querying cad_dispatch_events.linked_incident_id directly at test time, rather than assuming by name it's still the seeded UAT-ESCALATE-READY incident — 07-02's own SUMMARY documents that the stub's single `external_event_id` re-links to whichever incident's name most recently matched the shared CAD number across repeated test-suite runs against this shared dev database; reading the live link is the only approach correct regardless of execution order"

patterns-established:
  - "Dispatch status Card's test-4 (forced-outage tolerance) calls fetchCadDispatchEvents(undefined, true) directly — the raw adapter function, never runCadIngestion() — so the UI assertion proves genuine staleness-tolerance without the test itself mutating the fixture it's asserting against"

# Metrics
duration: 28min
completed: 2026-11-20
---

# Phase 7 Plan 04: Incident Workspace Dispatch Status Panel + Integration Health Confirmation Summary

**Read-only "Dispatch status" Card added to the Incident Workspace sidebar (status text + unit_ids + Provenance, zero interactive affordance anywhere in its subtree), confirming the already-built admin Integration Health screen needs no structural change to surface Phase 7's new hazard-feed/CAD rows.**

## Performance

- **Duration:** 28 min
- **Started:** 2026-11-20T09:46:00Z (approx, context-gathering phase)
- **Completed:** 2026-11-20T10:14:35Z
- **Tasks:** 2
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- `IncidentWorkspace.tsx`'s sidebar gained a new "Dispatch status" Card, sourced from a new `dispatchStatusQuery` consuming 07-02's `GET /api/v1/incidents/:id/dispatch-status` — loading state, "No dispatch data linked" `EmptyState` for an honestly-unmatched incident, or plain status text + comma-joined unit IDs + a `Provenance` chip (always verified-true, never the dashed/unverified branch) when linked
- Structurally zero `<button>`/`<form>`/`onClick` anywhere inside the Card's JSX subtree — the literal mechanism satisfying F15's "no edit action anywhere in the UI" rule, verified by the task's own grep-based `<verify>` check and a Playwright assertion counting zero `button` elements within the Card's own DOM subtree
- Confirmed (by reading `admin-integration-health.ts`'s backend route directly) that `IntegrationHealth.tsx` needed zero structural change — its `Table` is already generic over whatever rows the backend's plain `SELECT *` query returns, with no `system_name` filter/allowlist that could exclude the new `'CAD/911 Dispatch'`/`'NOAA Hazard Feed'`/etc. rows. Updated only the now-stale EmptyState copy (previously implied no adapter was configured yet) and a doc comment
- New `incident-workspace-dispatch-status.spec.ts` (4 Playwright tests, 138 lines): dispatch-panel rendering with Provenance + zero interactive controls on the real CAD-linked incident; the unmatched empty state on a fresh incident; integration-health admin view showing both the `'CAD/911'` and `'Hazard Feed'` rows; and staleness-tolerance under a forced CAD adapter outage (the previously-ingested status/Provenance stays visible, never an error or blank Card)

## Task Commits

Each task was committed atomically:

1. **Task 1: Dispatch status Card in IncidentWorkspace.tsx** - `4ef369d` (feat)
2. **Task 2: Confirm IntegrationHealth.tsx needs no change; Playwright coverage for dispatch panel + integration-health flip** - `97d6c4d` (test)

## Files Created/Modified

- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` - new `DispatchStatusResponse` interface, `dispatchStatusQuery`, and the "Dispatch status" Card between Command roles and Map
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` - doc comment + EmptyState copy tweak only (no structural change)
- `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts` - 4 new Playwright tests

## Decisions Made

- Dispatch status Card ordering (between Command roles and Map) is this plan's own documented discretion — no mockup pins an explicit position for a card F15 adds to a Phase-2-era layout
- Status rendered as plain text, never a `Badge` — F15 defines no fixed status-tone vocabulary unlike incident severity
- Provenance's default verified-true branch is always used here — CAD data is read-only/authoritative-elsewhere, not an "unverified feed" being validated (a distinct concept from F12's hazard-layer Provenance usage)
- `IntegrationHealth.tsx` required no structural change — confirmed via direct inspection of its backend route (`admin-integration-health.ts`), which has no hardcoded filter excluding new `system_name` values
- The Playwright spec resolves the CAD-linked incident by live query (`cad_dispatch_events.linked_incident_id`) rather than by name — 07-02's own SUMMARY documents the stub's single-event re-linking behavior across repeated test-suite runs against the shared dev database, discovered directly when this plan's first draft (querying by `UAT-ESCALATE-READY` name) failed with "Incident not found" because a backend test had re-linked the one `cad_dispatch_events` row to its own fixture incident

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Playwright spec initially hardcoded the CAD-linked incident by name, which had drifted**
- **Found during:** Task 2 (first Playwright run against the live shared dev database)
- **Issue:** The spec's first draft queried for the incident named `UAT-ESCALATE-READY%` and assumed it was still the one linked to `cad_dispatch_events`. A backend integration test (07-02's own `incidents.test.ts`, run earlier in this session) had called `runCadIngestion('CAD-UAT-001')` against its own test-fixture incident (`'CAD-UAT-001 Matchable Incident ...'`), which — per the adapter's documented non-sticky matching rule — re-linked the single `cad_dispatch_events` row away from the seed demo incident. The workspace page for the (stale) assumed incident ID returned "Incident not found" since the test-fixture incident lived in a different jurisdiction than `commander@epmp.local`'s scope.
- **Fix:** Rewrote `findCadLinkedIncidentId()` to query `cad_dispatch_events.linked_incident_id` directly at test time instead of assuming a name, making the spec correct regardless of what ran against the shared database before it. Also restored the row's link to the seed's `UAT-ESCALATE-READY` incident via a one-off `UPDATE` (same recovery precedent as 07-02's own SUMMARY documents) so the repo is left in the documented clean demo state.
- **Files modified:** `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts`
- **Verification:** All 4 tests pass; re-ran the full incident-workspace.spec.ts regression suite (6/6) to confirm no interference.
- **Committed in:** `97d6c4d` (Task 2 commit)

**2. [Rule 3 - Blocking] TypeScript rejected the `.ts` extension on the cross-package backend import**
- **Found during:** Task 2 (running `tsc --noEmit` after writing the spec)
- **Issue:** `import { fetchCadDispatchEvents } from '../../../backend/src/modules/integration-gateway/cad-adapter.ts'` failed with `TS5097: An import path can only end with a '.ts' extension when 'allowImportingTsExtensions' is enabled` — frontend/app's tsconfig (Bundler module resolution, no `allowImportingTsExtensions`) rejects explicit `.ts` extensions, unlike the backend's own NodeNext-resolution convention.
- **Fix:** Dropped the `.ts` extension from the import path — extensionless resolution works identically under Bundler resolution.
- **Files modified:** `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts`
- **Verification:** `tsc --noEmit` clean; Playwright spec re-run, all 4 tests still pass.
- **Committed in:** `97d6c4d` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 — blocking issues preventing the Playwright spec from running/type-checking correctly)
**Impact on plan:** Both fixes were necessary to make the spec correct and type-check clean. No scope creep — the final spec tests exactly what the plan specified, just resolves its one dynamic fixture correctly.

## Issues Encountered

- Confirmed directly (not caused by this plan): the shared dev database's `cad_dispatch_events` single-event stub is sensitive to execution order of ANY backend test or Playwright spec that exercises `runCadIngestion()` with a cad-incident-number argument, since the adapter's matching step re-evaluates `linked_incident_id` on every call with no sticky behavior (07-02's own documented, intentional design). This plan's spec is written defensively against that (resolving the link live rather than assuming by name), so it is itself immune to future drift, but a reader running `npm run seed` followed immediately by the full backend suite (not just this plan's own spec) will still observe the link move — this is 07-02's documented adapter-stub limitation, not a defect introduced or left unresolved by this plan.

## User Setup Required

None - no external service configuration required. Consumes existing backend contracts with no new environment variables.

## Next Phase Readiness

- F15's end-to-end UI is complete: ROADMAP success criterion 3 (dispatch-status panel, Provenance, no edit action, degrades to last-known-data on outage) is fully satisfied, proven by this plan's own Playwright suite
- ROADMAP success criterion 4 (both hazard-feed and CAD/911 integrations visible and deterministically flippable in integration-health) confirmed end-to-end through the real admin UI, not just backend tests
- No blockers. Full backend suite (19 files, 119 tests) green with zero regression (this plan touched no backend code); `tsc --noEmit` and `npm run build` both clean in `frontend/app`; existing `incident-workspace.spec.ts` (6/6) regression-passes unaffected; new `incident-workspace-dispatch-status.spec.ts` (4/4) passes

## Known Stubs

None found. `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all files this plan created/modified returned only pre-existing doc-comment references to PRIOR phases' already-resolved placeholders (e.g. "04-07 closes the LAST two deliberate Phase-2 placeholders", "Map-thumbnail placeholder — a deliberate Phase-2 simplification") — none from this plan's own new code, and none represent an incomplete implementation of this plan's own deliverable.

---
*Phase: 07-operating-picture-read-overlays-weather-dispatch*
*Completed: 2026-11-20*

## Self-Check: PASSED

- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` — FOUND, contains "Dispatch status" Card
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` — FOUND, modified
- `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts` — FOUND, 138 lines (≥55 min_lines)
- `.planning/phases/07-operating-picture-read-overlays-weather-dispatch/07-04-SUMMARY.md` — FOUND
- Commit `4ef369d` (Task 1) — FOUND in git log
- Commit `97d6c4d` (Task 2) — FOUND in git log
- `cd frontend/app && npx tsc --noEmit` — exit 0, zero TypeScript errors
- `cd frontend/app && npm run build` — exit 0, clean Vite build
- `npx playwright test e2e/incident-workspace-dispatch-status.spec.ts --workers=1` — 4/4 passed
- `npx playwright test e2e/incident-workspace.spec.ts --workers=1` — 6/6 passed (regression, unaffected)
- `cd backend && npm test` — 19 files, 119 tests, all passed (zero regression — this plan touched no backend code)
- `cd backend && npm run build` — exit 0, zero TypeScript errors
- Structural grep: zero `onClick`/`<button`/`<Button` matching "dispatch" in IncidentWorkspace.tsx
- `## Known Stubs` section present above, no blocking entries
