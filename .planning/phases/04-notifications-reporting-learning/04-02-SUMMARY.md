---
phase: 04-notifications-reporting-learning
plan: 02
subsystem: comms-reporting
tags: [fastify, postgres, postgis, reporting, sitrep, aar, evidence-log, analytics, ai-governance]

# Dependency graph
requires:
  - phase: 04-notifications-reporting-learning
    provides: "assertAiOriginApproved/AiOriginNotApprovedError shared AI-governance guard, comms-reporting module + routes.ts barrel (04-01)"
  - phase: 02-incident-command-operating-picture
    provides: "incident_timeline (F1), fetchIncidentForMutation, incidents.status closure gate"
  - phase: 03-plans-tasks-resource-requests
    provides: "tasks/resource_requests/resource_request_status_history tables (F4)"
  - phase: 01-platform-foundation-deployable-shell
    provides: "audit_log (F8), AuditService.record(), requirePermission (01-03)"
provides:
  - "sitreps, aars, aar_findings tables (migration 1700000000009)"
  - "POST/PATCH /api/v1/incidents/{id}/sitreps[/{sitrepId}] — auto-assembled SITREP generation + Draft-edit/Approve-finalize lifecycle"
  - "POST /api/v1/incidents/{id}/aar, PATCH .../aar/{aarId}/finalize — auto-assembled AAR generation gated on incident closure, with findings-ownership validation and finalize-immutability"
  - "GET /api/v1/evidence-log, GET /api/v1/evidence-log/export — audit_log + incident_timeline aggregated, structurally read-only view"
  - "GET /api/v1/analytics/kpis — 3 server-computed KPIs with target always omitted, never invented"
affects: ["04-06 (frontend reporting screens)", "04-07 (Incident Workspace Reports-tab wiring)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Auto-assembly pattern: a generation endpoint accepts only an identifier (+ optional flags), assembling all structured content server-side via read-only SELECTs against OTHER modules' tables — zero manual re-entry by construction, not by UI discipline"
    - "Upsert-with-immutability-guard: ON CONFLICT (unique_col) DO UPDATE ... WHERE status != 'Finalized' — a conflicting-but-finalized row is excluded from the UPDATE, so RETURNING yields no row and the route maps that to an explicit 403 rather than a silent no-op"
    - "UNION ALL aggregation across two owning modules' append-only tables, with the SAME filter predicates applied to both halves before the UNION combines them"

key-files:
  created:
    - backend/migrations/1700000000009_reporting-schema.js
    - backend/src/modules/comms-reporting/reporting.ts
    - backend/src/modules/comms-reporting/evidence-log.ts
    - backend/src/modules/comms-reporting/analytics.ts
    - backend/src/modules/comms-reporting/reporting.test.ts
  modified:
    - backend/src/modules/comms-reporting/routes.ts

key-decisions:
  - "Migration renumbered to 1700000000009 (not the plan's literal 1700000000008) — 04-01's own migration already claimed 1700000000008 for notifications-schema.js; same renumbering precedent 04-01 itself used against Phase 3's plans-schema.js"
  - "AAR re-generation against an existing Draft AAR upserts in place (ON CONFLICT (incident_id) DO UPDATE ... WHERE status != 'Finalized') rather than erroring, per the aars.incident_id UNIQUE constraint's documented implication; a conflicting Finalized row returns 403 DOCUMENT_IMMUTABLE instead of a silent no-op"
  - "Decision-tagging heuristic for the AAR's decisions_log: EPMP-sourced Timeline entries with tone in (warning,danger) OR a title matching Activation changed to|assigned to|Incident closed are treated as decision-tagged — a documented Phase-4 approximation since no literal is_decision column exists on the append-only incident_timeline table"
  - "The SITREP narrative-AI-draft stub is a local re-stub of 04-01's inline ai-drafts INSERT logic, not a literal import — 04-01's stub lives as an inline route closure in notifications.ts, not an exported helper, so it can't be imported as-is; documented inline as a future shared-helper refactor opportunity"
  - "Evidence log's GET aggregation deliberately EXCLUDES incident_timeline rows with a NULL actor_id (e.g. 03-02's system-driven Overdue sweep) — FRD's Actor column requires a real person to render, and a null-actor row has none"
  - "GET /api/v1/evidence-log/export only implements format=csv; format=pdf returns 500 EXPORT_FAILED since no PDF-generation library exists anywhere in this project's dependency tree — documented Phase-4 scope gap, not silently dropped"

patterns-established:
  - "Auto-assembly generation endpoints (SITREP/AAR) take only an entity id as real input — all structured content is read-only-SELECTed from other modules' tables at request time, making zero-manual-re-entry a structural property of the endpoint rather than a UI-layer convention"

# Metrics
duration: 14min
completed: 2026-11-18
---

# Phase 4 Plan 02: Reporting & Learning (comms-reporting module) Summary

**SITREP/AAR auto-assembly from Timeline/task/resource-request data with zero manual re-entry, AAR findings/corrective-action lifecycle with finalize-immutability, evidence log UNION-aggregating audit_log+incident_timeline, and a never-invented-target analytics KPI endpoint — all reusing 04-01's `assertAiOriginApproved` guard unchanged.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-11-18T05:32:00Z
- **Completed:** 2026-11-18T05:46:00Z
- **Tasks:** 3
- **Files modified:** 6 (5 created, 1 modified)

## Accomplishments
- `sitreps`/`aars`/`aar_findings` tables created exactly per TechArch's DDL, including the `aars.incident_id UNIQUE` constraint and `chk_corrective_action_owned`/`chk_finalized_requires_signoff` CHECKs
- `POST /api/v1/incidents/{id}/sitreps` auto-assembles `content` (Timeline, task-status counts, resource-request-status counts) from ONLY `incident_id` — no caller-supplied data beyond the id itself, proven by the plan's own integration test
- `PATCH .../sitreps/{sitrepId}` supports a Draft content edit or an Approve-finalize; Approved SITREPs reject ANY further edit with `403 DOCUMENT_IMMUTABLE`
- `POST /api/v1/incidents/{id}/aar` is blocked with `409 INCIDENT_NOT_CLOSED` before any write on an open incident; auto-assembles `timeline_export`/`decisions_log`/`resource_history`; validates the WHOLE findings array atomically before any insert (`422 CORRECTIVE_ACTION_UNOWNED`); upserts against the `UNIQUE incident_id` constraint, excluding already-Finalized rows from the upsert and returning `403 DOCUMENT_IMMUTABLE` instead of a silent no-op
- `PATCH .../aar/{aarId}/finalize` rejects a second finalize with `403 DOCUMENT_IMMUTABLE`, defensively re-validates finding ownership at finalize time, and writes an `AuditService.record()` evidence-log event on success
- `GET /api/v1/evidence-log` aggregates `audit_log` (F8) and `incident_timeline` (F1) via `UNION ALL` with identical filter predicates applied to both halves; `PATCH`/`DELETE` are registered but unconditionally `403 EVIDENCE_LOG_IMMUTABLE`, mirroring 01-07's `admin-audit.ts` structural-rejection pattern
- `GET /api/v1/evidence-log/export` streams CSV with no new dependency; `format=pdf` returns `500 EXPORT_FAILED` (documented scope gap — no PDF library in this tree)
- `GET /api/v1/analytics/kpis` computes `median_activation_time`, `resource_request_fulfillment_time`, `corrective_action_closure_rate` server-side from existing tables; `jurisdiction_scope` is read from the authenticated session, never a client query param; `target` is OMITTED ENTIRELY from every KPI's JSON — never invented

## Task Commits

Each task was committed atomically:

1. **Task 1: Reporting schema migration** - `18f6569` (feat)
2. **Task 2: SITREP/AAR auto-assembly API + immutability enforcement** - `62c4e68` (feat)
3. **Task 3: Evidence & audit log aggregation + analytics KPI endpoint + integration test** - `e447b5d` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/migrations/1700000000009_reporting-schema.js` - `sitreps`/`aars`/`aar_findings` DDL per TechArch 02c, renumbered from the plan's literal `1700000000008` (collision with 04-01)
- `backend/src/modules/comms-reporting/reporting.ts` - SITREP generate/edit/finalize + AAR generate/finalize routes, auto-assembly helpers, shared AI-guard and AuditService imports
- `backend/src/modules/comms-reporting/evidence-log.ts` - UNION-aggregated evidence log GET/export + structural PATCH/DELETE 403 rejection
- `backend/src/modules/comms-reporting/analytics.ts` - 3-KPI analytics endpoint with statement-timeout handling
- `backend/src/modules/comms-reporting/reporting.test.ts` - 6-test integration suite against the real compose Postgres+OPA stack
- `backend/src/modules/comms-reporting/routes.ts` - now registers `reportingRoutes`/`evidenceLogRoutes`/`analyticsRoutes` alongside 04-01's `notificationsRoutes` in the same plugin

## Decisions Made
- Migration renumbered to `1700000000009` (not the plan's literal `1700000000008`) — 04-01's own migration already occupies that number; same renumbering precedent 04-01 itself set
- AAR re-generation upserts in place against the Draft row (`ON CONFLICT (incident_id) DO UPDATE ... WHERE status != 'Finalized'`), returning `403 DOCUMENT_IMMUTABLE` when the existing row is already Finalized rather than silently no-op'ing
- Decision-tagging heuristic for `decisions_log`: EPMP-sourced Timeline rows with `tone IN ('warning','danger')` OR a title matching `Activation changed to|assigned to|Incident closed` — documented Phase-4 approximation, no literal `is_decision` column exists
- SITREP's AI-draft stub is a local re-stub (not a literal import) of 04-01's inline `ai-drafts` INSERT — that endpoint is an inline route closure in `notifications.ts`, not an exported helper, so a true shared function doesn't exist yet
- Evidence log deliberately excludes null-`actor_id` Timeline rows (e.g. the Overdue sweep) — the Actor column has no person to render for those
- `evidence-log/export`'s `format=pdf` returns `500 EXPORT_FAILED` — no PDF library exists in this dependency tree; CSV alone satisfies FRD's "exportable" requirement this phase

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration filename collision with 04-01's notifications-schema.js**
- **Found during:** Task 1 (schema migration)
- **Issue:** The plan's literal filename `1700000000008_reporting-schema.js` collides with 04-01's already-committed `1700000000008_notifications-schema.js`. node-pg-migrate requires unique, monotonically-ordered migration numbers.
- **Fix:** Renumbered to `1700000000009_reporting-schema.js`, the next free number. No other file references the old number.
- **Files modified:** `backend/migrations/1700000000009_reporting-schema.js` (created under the corrected name)
- **Verification:** `npm run migrate` ran clean against the real Postgres instance with Phase 1-3's and 04-01's existing migrations already applied; all 3 new tables confirmed present via `\dt`
- **Committed in:** `18f6569` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking migration-number collision)
**Impact on plan:** Pure naming fix with zero behavioral difference from the plan's intent — identical in kind to 04-01's own equivalent fix against Phase 3.

## Issues Encountered
None beyond the one auto-fixed deviation above. All 6 integration-test assertions passed on the first run with no debugging iteration needed.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `reporting.ts`/`evidence-log.ts`/`analytics.ts` are registered in `comms-reporting`'s `routes.ts` barrel alongside 04-01's `notifications.ts` — no second `server.ts` registration was needed, confirming 04-01's own sequencing note held
- 04-06's frontend reporting screens and 04-07's Incident Workspace Reports-tab wiring have a complete, tested backend API surface to consume: SITREP generate/edit/finalize, AAR generate/finalize, evidence log view/export, and the 3-KPI analytics endpoint
- The `reporting` feature-permission (`view`/`create`/`edit` actions) is referenced by every route in this plan but not yet seeded into any real role — 04-04 (seed) is responsible for granting it, exactly as this plan's own frontmatter documents (`depends_on: ["F1","F4"]`, `enables: ["F7"]`)
- Full backend test suite (13 files, 64 tests, including this plan's new 6-test `reporting.test.ts`) and `npm run build` both green after this plan's changes — no regressions in Phase 1-3/04-01 coverage

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

- SITREP's `include_ai_draft` narrative stub (`reporting.ts`) — same deterministic no-live-Intelligence-Layer-gateway pattern 04-01 established for `POST /api/v1/ai-drafts`, re-stubbed locally rather than imported (04-01's version is an inline route closure, not an exported helper). **Cosmetic, not blocking**: the AI-governance send-gating invariant (draft must be approved before the SITREP can finalize with `ai_origin:true`) is fully enforced and tested via the SAME `assertAiOriginApproved` guard; only the draft TEXT itself is a stub, matching 04-01's own documented scope boundary.
- `GET /api/v1/evidence-log/export?format=pdf` returns `500 EXPORT_FAILED` — no PDF-generation library exists anywhere in this project's dependency tree, and TechArch's tech-stack doc names none for this feature. **Cosmetic, not blocking**: CSV export is fully functional and satisfies the FRD's "exportable" requirement; PDF is a documented Phase-4 scope gap per this plan's own instruction, not silently dropped.
- Evidence log excludes `incident_timeline` rows with a NULL `actor_id` (system-attributed entries like the Overdue sweep). **Cosmetic, not blocking**: documented inline as a deliberate narrowing — the FRD's Actor column requires a real person, and these rows have none to show.

None of the above defeat this plan's objective — SITREP/AAR auto-assembly with zero manual re-entry, the AAR findings/corrective-action lifecycle with finalize-immutability, the dual-source evidence log, and the never-invented-target analytics endpoint are all fully functional and tested.

## Self-Check: PASSED

- All 5 created files verified present on disk via `[ -f ]`: `backend/migrations/1700000000009_reporting-schema.js`, `backend/src/modules/comms-reporting/reporting.ts`, `backend/src/modules/comms-reporting/evidence-log.ts`, `backend/src/modules/comms-reporting/analytics.ts`, `backend/src/modules/comms-reporting/reporting.test.ts`.
- All 3 task commits (`18f6569`, `62c4e68`, `e447b5d`) verified present via `git log --oneline --all`.
- Build check: `cd backend && npm run build` (`tsc -p tsconfig.json`) → exit 0.
- Full backend test suite: 13 files, 64 tests, all passing (includes this plan's 6 new integration tests against the real compose Postgres+OPA+NATS stack).
- `## Known Stubs` section above: 3 entries, all classified cosmetic (explicitly plan-scoped simplifications matching 04-01's own precedent), none blocking.
