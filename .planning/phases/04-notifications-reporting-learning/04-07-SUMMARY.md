---
phase: 04-notifications-reporting-learning
plan: 07
subsystem: integration-proof
tags: [react, playwright, fastify, postgres, incident-workspace, evidence-log, cross-phase-integration]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "IncidentWorkspace.tsx (02-06) with Reports-tab placeholder and Generate-SITREP no-op action, extended in-place by 03-08 for Tasks/Resources tabs"
  - phase: 03-plans-tasks-resource-requests
    provides: "CreateTask.tsx's incident-pre-filled flow and the embedded TaskList/ResourceRequestList tabs (03-06/03-08)"
  - phase: 04-notifications-reporting-learning
    provides: "04-05's ComposeNotification.tsx (?incident= pre-fill) and 04-06's SitrepGenerator/AarGenerator/EvidenceLogView screens"
provides:
  - "IncidentWorkspace.tsx's Reports tab renders a real (non-placeholder) list of this incident's finalized AARs, with working Generate-SITREP/Generate-AAR actions (AAR disabled until Closed)"
  - "PageHeader's Generate-SITREP action navigates to the real SitrepGenerator route instead of a no-op handler"
  - "A new Compose-notification PageHeader action, incident-linked, satisfying the UX mockup's Navigation Map row that no prior plan wired"
  - "incident-to-evidence-trail.spec.ts — a 7-test Playwright proof that ONE incident's command/task/notification/reporting activity composes into one coherent, chronologically-ordered Timeline and evidence trail"
  - "Fixed a pre-existing evidence-log.ts bug: action_type/record_type filters 500'd on the incident_timeline half of its UNION query"
affects: [verify-work, future-reporting-work]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Reports-tab read path: GET /api/v1/evidence-log?action_type=aar_finalized, client-narrowed by detail.incident_id, standing in for a list-all-reports endpoint 04-02's backend never exposed"
    - "Two-identity Playwright pattern for cross-phase reporting flows: incident_commander (create/approve/trigger-generation) handing off to planning_logistics_chief (the only role holding reporting:edit) for save-as-draft/finalize steps"

key-files:
  created:
    - frontend/app/e2e/incident-to-evidence-trail.spec.ts
  modified:
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/src/pages/incidents/IncidentWorkspace.css
    - backend/src/modules/comms-reporting/evidence-log.ts

key-decisions:
  - "Reports tab's document list reads GET /api/v1/evidence-log?action_type=aar_finalized (client-narrowed by detail.incident_id) rather than inventing a new backend endpoint — 04-02 exposes no GET to list all reports for an incident, and SITREPs have no equivalent audit write at all to recover from, so the tab is honest about that scope gap rather than faking a list"
  - "AAR generation's disabled-until-Closed check in the Reports tab duplicates AarGenerator.tsx's own page-level guard proactively, so the failure is visible before navigation, not only after"
  - "The Playwright spec uses TWO identities (incident_commander, planning_logistics_chief), not the single-identity shortcut the first draft assumed — reporting:edit (gating both SITREP PATCH/save-as-draft and AAR finalize) is held only by planning_logistics_chief per 04-04's seed, confirmed directly against reporting.ts's requirePermission calls after the single-identity draft's assertions turned out to be false positives"

patterns-established:
  - "A plan's own Playwright run is the actual verification gate for cross-module RBAC assumptions — do not trust a green assertion against a UI element whose underlying PATCH may have silently 403'd while an unrelated earlier state (e.g. an already-Draft badge) kept the page looking correct"

# Metrics
duration: 45min
completed: 2026-11-18
---

# Phase 4 Plan 7: Incident-to-evidence-trail integration proof Summary

**Closed Phase 2's `02-06` Reports-tab/Generate-SITREP placeholders, wired a new incident-linked Compose-notification action, and proved the complete F1→F4→F5→F7 cross-phase Timeline composition end-to-end via a 7-test Playwright spec — which in the process surfaced and fixed a real backend bug in `GET /api/v1/evidence-log`'s action_type/record_type filtering.**

## Performance

- **Duration:** 45 min
- **Completed:** 2026-11-18
- **Tasks:** 2
- **Files modified:** 3 (1 created, 2 modified in Task 1/2; evidence-log.ts fixed as a deviation)

## Accomplishments

- `IncidentWorkspace.tsx`'s Reports tab now renders a real list of this incident's finalized AARs (with Generate SITREP/Generate AAR actions, AAR gated on `incident.status === 'Closed'`) instead of 02-06's "ships in a later phase" `EmptyState`
- PageHeader's `Generate SITREP` action now navigates to the real `SitrepGenerator` route instead of a no-op `() => {}` handler
- A brand-new `Compose notification` PageHeader action navigates to the incident-linked Compose Notification flow — the wiring the UX mockup's Navigation Map named but no earlier plan implemented
- `incident-to-evidence-trail.spec.ts` proves, in one incident's lifecycle: command-role assignment → task creation (F1/F4) → a sent notification appearing in the SAME Timeline, chronologically after the task (F5) → a SITREP auto-assembled from this incident's live task-status data, saved as draft → incident closure → a finalized AAR → all four activity types visible together in the aggregated Evidence Log (F7)
- Found and fixed a real pre-existing bug in `evidence-log.ts`: the `action_type`/`record_type` query filters referenced their own SELECT-list output aliases in the `incident_timeline` half of the UNION's WHERE clause, which Postgres cannot resolve against a non-existent `action` column — every such filtered request was silently failing

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace Incident Workspace's Reports placeholder + wire Generate-SITREP/Compose-notification actions** - `9ffe27f` (feat)
2. **Task 2: End-to-end Playwright proof — full cross-phase incident lifecycle composes into one coherent Timeline** - `e79cdce` (test, includes the evidence-log.ts bug fix found during this task's own verification)

_Note: no plan-metadata commit yet — this SUMMARY.md + STATE.md update is that commit._

## Files Created/Modified

- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` — real Reports tab (finalized-AAR list + Generate SITREP/AAR actions), Generate-SITREP action rewired, new Compose-notification action added
- `frontend/app/src/pages/incidents/IncidentWorkspace.css` — styles for the new report-list/report-row/report-actions classes
- `frontend/app/e2e/incident-to-evidence-trail.spec.ts` — the phase's terminal integration-proof Playwright spec (7 tests)
- `backend/src/modules/comms-reporting/evidence-log.ts` — fixed the WHERE-clause-references-SELECT-alias bug in the UNION's filter builder

## Decisions Made

- Reports tab's read path uses `GET /api/v1/evidence-log?action_type=aar_finalized` (client-narrowed by `detail.incident_id`) rather than a new backend endpoint, since 04-02 never exposed a "list all reports for this incident" GET and SITREPs have no durable audit-visible write to recover from at all — documented inline as an honest Phase-4 scope limitation, since this tab is explicitly not this plan's primary proof target (the Playwright spec is)
- The Generate-AAR button in the Reports tab proactively disables itself using the SAME `incident.status === 'Closed'` check `AarGenerator.tsx` performs as its own page-level guard, so the failure is visible before navigation rather than only after
- The Playwright spec's identity split (incident_commander for creation/notification/closure steps, planning_logistics_chief for SITREP-save/AAR-finalize steps) matches the REAL `reporting:edit` permission boundary (04-04's seed) — this was discovered as a correction mid-plan, not assumed from the start (see Deviations)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed `GET /api/v1/evidence-log`'s `action_type`/`record_type` filters 500ing on the `incident_timeline` half of its UNION query**
- **Found during:** Task 2's own Playwright verification run (the spec's final evidence-log assertion failed with a generic "Could not load the evidence log" UI alert)
- **Issue:** `buildFilterConditions()` always wrote the literal condition strings `action = $N` / `record_type = $N` against BOTH halves of the evidence-log's UNION query. `audit_log`'s half genuinely has columns named `action`/`record_type`, but `incident_timeline`'s half selects `it.title AS action` and a hard-coded `'incident' AS record_type` — neither is a real column on that table, and Postgres's WHERE clause is evaluated before the SELECT list, so it cannot resolve a SELECT-list alias. Any `action_type`- or `record_type`-filtered request against this endpoint raised a bare `column "action" does not exist`, silently surfaced to users as "Could not load the evidence log."
- **Fix:** `buildFilterConditions()` now takes an explicit `{ actionColumn, recordTypeColumn }` pair per call site — the `audit_log` half passes its real column names (`al.action`, `al.record_type`); the `incident_timeline` half passes its real underlying column (`it.title`) and the identical literal re-stated for `record_type` (`'incident'`), which Postgres evaluates as a constant-equality check rather than an identifier lookup.
- **Files modified:** `backend/src/modules/comms-reporting/evidence-log.ts`
- **Verification:** Reproduced the exact failure with a minimal direct-SQL repro (`column "action" does not exist`) before the fix, confirmed the corrected query form succeeds after; full backend suite (67 tests) and this plan's own Playwright spec pass post-fix; 04-06's `reporting.spec.ts` (7 tests) re-verified green with zero regression.
- **Committed in:** `e79cdce` (Task 2 commit)

**2. [Rule 1 - Bug] Corrected this plan's own Playwright spec's identity assumption**
- **Found during:** Task 2's first verification run — the original single-identity (`incident_commander`-only) draft's "Save as draft"/"Finalize AAR" assertions were FALSE POSITIVES, passing only because the SITREP's already-Draft status (set by the initial POST, which `incident_commander` IS permitted to trigger) and the AAR's visible-but-unfinalized state papered over a silently-403'd PATCH
- **Issue:** `reporting:edit` (gating the SITREP save-as-draft PATCH and the AAR finalize PATCH) is held ONLY by `planning_logistics_chief` per 04-04's seed grants — `incident_commander` holds `reporting:view`/`create` only (sufficient to TRIGGER generation, not to edit/finalize)
- **Fix:** Rewrote the spec's SITREP-save and AAR-generate-through-finalize steps to run under `signInAsPlanningChief`, matching 04-06's own `reporting.spec.ts` two-identity precedent exactly; added the identical `ensurePlannerHasJurisdictionScope()` test-fixture fix 03-05/03-06/04-06 already document for this same JIT-provisioned identity
- **Files modified:** `frontend/app/e2e/incident-to-evidence-trail.spec.ts`
- **Verification:** All 7 tests pass against the real backend after the identity-split correction
- **Committed in:** `e79cdce` (Task 2 commit, test-only — this spec was never committed in its incorrect form)

---

**Total deviations:** 2 auto-fixed (1 production bug, 1 test-logic-only correction)
**Impact on plan:** The evidence-log.ts fix is a genuine, previously-undetected production bug this plan's own verification surfaced — necessary for correctness, no scope creep (it's the same endpoint this plan's Reports tab and final assertion both depend on). The identity-split correction is entirely confined to this plan's own new test file; no production code or other plan's artifacts were touched by it.

## Issues Encountered

None beyond the two deviations above — both were found and resolved during this plan's own verification, before any commit claimed success.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 4 (Notifications, Reporting & Learning) is now functionally complete: all 7 plans shipped (04-01 through 04-07)
- This plan is the phase's terminal integration-proof plan — it touches no new backend surface beyond the evidence-log.ts fix, and its Playwright spec is the phase's own proof that the roadmap's stated goal ("closing the preparedness loop so every incident leaves a reusable evidence trail") is observable as a single coherent cross-feature flow, not just isolated per-plan proofs
- Full backend suite (67 tests), design-system suite (51 tests), `tsc --noEmit` on both frontend/backend, and all three workspace builds are clean
- Six existing Playwright specs (incident-workspace, plan-to-task-materialization, notifications-compose, reporting) re-verified green with zero regression from this plan's IncidentWorkspace.tsx and evidence-log.ts edits
- Ready for phase transition / milestone review

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

None found — scanned all changed files (IncidentWorkspace.tsx, IncidentWorkspace.css, evidence-log.ts, incident-to-evidence-trail.spec.ts) for TODO/FIXME/placeholder/not-implemented markers; the only hits are either historical doc-comment references to PRIOR phases' now-closed placeholders, or literal HTML `placeholder=` attributes on DatePicker inputs (unrelated to stub tracking).

## Self-Check: PASSED

- Build check: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → exit 0
- Created files verified present on disk: `frontend/app/e2e/incident-to-evidence-trail.spec.ts` (FOUND)
- Modified files verified present on disk: `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` (FOUND), `backend/src/modules/comms-reporting/evidence-log.ts` (FOUND)
- Commits verified in git log: `9ffe27f` (FOUND), `e79cdce` (FOUND)
- Full backend suite: 67/67 tests passed
- Design-system suite: 51/51 tests passed
- This plan's own Playwright spec: 7/7 tests passed
- Regression specs re-verified green: incident-workspace.spec.ts (5/5), reporting.spec.ts (7/7), notifications-compose.spec.ts (8/8), plan-to-task-materialization.spec.ts (7/7)
- `## Known Stubs` section present above, no blocking entries
