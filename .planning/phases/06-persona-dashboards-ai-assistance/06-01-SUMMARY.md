---
phase: 06-persona-dashboards-ai-assistance
plan: 01
subsystem: api
tags: [postgres, fastify, node-pg-migrate, rbac, ai-governance, vitest]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "incidents table, TimelineService/withTimelineTransaction, requirePermission RBAC middleware (02-01, complete)"
  - phase: 04-notifications-reporting-learning
    provides: "ai_drafts table + the shared assertAiOriginApproved/AiOriginNotApprovedError guard (04-01), reused unchanged rather than redefined"
provides:
  - "ics_forms/signals/signal_source_events/hazard_feed_config/hazard_feed_events schema — the F9 governance substrate + the one F1 table (ics_forms) Phase 2 deliberately deferred"
  - "backend/src/modules/ai-assist/governance.ts — the ai-assist module's own import path for the shared assertAiOriginApproved guard (re-exported from comms-reporting/notifications.ts, not redefined)"
  - "GET/POST /api/v1/incidents/{id}/ics-forms + POST .../approve — the first real official-record target enforcing named-approver + AI-governance gates server-side"
  - "GET /api/v1/dashboard/summary — real active_incidents/open_tasks/pending_resource_requests, documented zero for notifications_pending_ack"
  - "seed.ts: incident_commander/eoc_director now hold 'approve' on the incidents feature — the first approve-gated incidents action in this codebase"
affects: ["06-02", "06-03", "06-04", "06-05", "06-08", "06-09"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-phase shared-guard reuse: when a later phase's migration/guard collides with an already-landed earlier phase's identical table/function, re-export rather than redefine (ai-assist/governance.ts is a one-line re-export of comms-reporting/notifications.ts's assertAiOriginApproved)"
    - "Migration-number collision handling: renumber to the next free slot above every already-landed migration, document inline — same precedent 04-01/04-02/05-01 each established"

key-files:
  created:
    - backend/migrations/1700000000011_persona-ai-signal-schema.js
    - backend/src/modules/ai-assist/governance.ts
    - backend/src/modules/incident-ops/ics-forms.ts
    - backend/src/modules/incident-ops/dashboard.ts
    - backend/src/modules/incident-ops/ics-forms.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts
    - backend/scripts/seed.ts

key-decisions:
  - "ai-assist/governance.ts re-exports the EXISTING assertAiOriginApproved/AiOriginNotApprovedError from comms-reporting/notifications.ts instead of redefining it — Phase 4's 04-01 had already executed and claimed both the ai_drafts table and the guard, exactly the cross-phase collision this plan's own PLAN.md predicted and instructed how to resolve"
  - "Migration renumbered 1700000000010 -> 1700000000011 — Phase 5's 05-01 has since landed and claimed 1700000000010 (free when this PLAN.md was authored, no longer free at execution time)"
  - "dashboard.ts computes REAL open_tasks/pending_resource_requests queries (not the plan's suggested hardcoded zeros) — tasks/resource_requests tables actually exist in this codebase (Phase 3 shipped them), so a structural zero would have been a regression, not a documented gap. notifications_pending_ack stays a documented zero: notification_recipients has no per-user-id column to count against for THIS signed-in user specifically."

patterns-established:
  - "ICS form approve route re-verifies approved_by against req.epmpUser.id server-side (never trusts the client-asserted value) before ever touching the AI-governance guard — approver identity and AI-origin governance are two independently-enforced gates, not one combined check"

# Metrics
duration: 25 min
completed: 2026-11-19
---

# Phase 6 Plan 01: F9 AI-Governance Substrate + ICS Forms/Dashboard APIs Summary

**ics_forms/signals/hazard-feed schema plus the ICS-form draft/approve API enforcing both a named-approver gate and the shared assertAiOriginApproved guard server-side, reusing (not redefining) Phase 4's already-landed ai_drafts table and guard — plus GET /api/v1/dashboard/summary with real incident/task/resource-request counts.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-19T12:04:29Z
- **Completed:** 2026-11-19T12:30:00Z
- **Tasks:** 3
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments

- Migrated `ics_forms`, `signals`, `signal_source_events`, `hazard_feed_config`, `hazard_feed_events` — all 5 new tables, exact DDL/CHECK constraints/indexes per TechArch 02b/02c/02d
- `ics_forms.ai_draft_id` correctly references the PRE-EXISTING `ai_drafts` table (created by Phase 4's 04-01) rather than re-creating it — resolved the exact cross-phase collision this plan's own PLAN.md documented as a real risk, confirmed Phase 4 had already executed
- `backend/src/modules/ai-assist/governance.ts` re-exports the EXISTING `assertAiOriginApproved`/`AiOriginNotApprovedError` from `comms-reporting/notifications.ts` — one shared enforcement point, reachable from either import path, never a second implementation
- ICS Form Editor backend: `GET`/`POST /api/v1/incidents/{id}/ics-forms`, `POST .../ics-forms/{formId}/approve` — rejects a missing/mismatched approver with `403 APPROVAL_REQUIRES_NAMED_USER`, rejects unapproved `ai_origin` content with `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` via the shared guard, writes exactly one Timeline entry on success
- `GET /api/v1/dashboard/summary` — real `active_incidents`/`open_tasks`/`pending_resource_requests` queries (Phase 3's tables genuinely exist), documented structural zero for `notifications_pending_ack`
- `seed.ts`: `incident_commander`/`eoc_director` now hold `'approve'` on the `incidents` feature — the first approve-gated incidents action in this codebase, with an idempotent re-assert `UPDATE` so an already-seeded database converges on the correct 4-action grant

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration — ics_forms, signals, signal_source_events, hazard_feed_config/events** - `25afd15` (feat)
2. **Task 2: Shared AI-governance guard + ICS forms API + dashboard summary API + seed.ts approve grant** - `3e0ce02` (feat)
3. **Task 3: Integration test — AI governance gate, approver gate, Timeline write, dashboard summary shape** - `9e70c91` (test)

**Plan metadata:** (this commit)

## Files Created/Modified

- `backend/migrations/1700000000011_persona-ai-signal-schema.js` - ics_forms/signals/signal_source_events/hazard_feed_config/hazard_feed_events DDL (renumbered from the plan's literal 1700000000010, which Phase 5's 05-01 has since claimed)
- `backend/src/modules/ai-assist/governance.ts` - re-exports the shared assertAiOriginApproved guard from comms-reporting/notifications.ts
- `backend/src/modules/incident-ops/ics-forms.ts` - GET/POST ics-forms + approve route, both governance gates enforced server-side
- `backend/src/modules/incident-ops/dashboard.ts` - GET /api/v1/dashboard/summary, real incident/task/resource-request counts
- `backend/src/modules/incident-ops/ics-forms.test.ts` - 7-assertion integration test against real seeded roles
- `backend/src/modules/incident-ops/routes.ts` - registers icsFormsRoutes + dashboardRoutes (append-only)
- `backend/scripts/seed.ts` - incidentsFullAccessRoles grant extended to include 'approve', with idempotent re-assert UPDATE

## Decisions Made

- `ai-assist/governance.ts` is a one-line re-export, not a redefinition — Phase 4's 04-01 had already executed and created the identical `ai_drafts` table and `assertAiOriginApproved` guard inside `comms-reporting/notifications.ts`. This plan's own PLAN.md explicitly anticipated this exact two-phase collision and instructed detecting-and-reusing rather than redefining; confirmed via direct inspection (grep) that Phase 4 had in fact already landed both symbols before writing a single line of this plan's code.
- Migration renumbered `1700000000010` → `1700000000011`: the plan's literal filename number was free when `06-01-PLAN.md` was authored, but Phase 5's `05-01` has since landed `1700000000010_field-operations-schema.js`, claiming it first. Same renumbering precedent 04-01/04-02/05-01 each independently established for this exact situation.
- `dashboard.ts`'s `open_tasks`/`pending_resource_requests` fields compute REAL `COUNT(*)` queries rather than the plan's suggested hardcoded zeros — direct inspection confirmed Phase 3 (03-01/03-04) already shipped the `tasks`/`resource_requests` tables in this codebase, so hardcoding zero would have silently regressed real, queryable data into a false "no data" state. `notifications_pending_ack` remains a documented zero: `notification_recipients` has no per-EPMP-user-id column to count an "unacknowledged for ME specifically" row against (F5's recipient model is name/contact-based, not account-based).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration filename renumbered to avoid a real, already-landed collision**
- **Found during:** Task 1
- **Issue:** The plan's literal filename `1700000000010_persona-ai-signal-schema.js` collides with `1700000000010_field-operations-schema.js`, which Phase 5's 05-01 plan has since committed to this repository (it did not exist when 06-01-PLAN.md was authored).
- **Fix:** Renumbered to `1700000000011`, the next free slot above every migration currently on disk. Documented inline in the migration file's own header comment, same precedent 04-01/04-02/05-01 each established for an identical situation.
- **Files modified:** backend/migrations/1700000000011_persona-ai-signal-schema.js
- **Verification:** `npm run migrate` ran clean against the real Postgres instance; all 5 new tables confirmed present via `\dt`.
- **Committed in:** 25afd15 (Task 1 commit)

**2. [Rule 3 - Blocking] ai_drafts NOT re-created — the exact cross-phase collision the plan itself predicted, now resolved**
- **Found during:** Task 1 (migration) and Task 2 (governance.ts)
- **Issue:** The plan's own PLAN.md documented a real risk: Phase 4's 04-01 independently defines an identical `ai_drafts` table and `assertAiOriginApproved`/`AiOriginNotApprovedError` guard, and instructed whichever phase executes SECOND to detect and reuse rather than redefine. Direct inspection (`grep -rn "CREATE TABLE ai_drafts"` across migrations, `grep -rn "assertAiOriginApproved"` across src) confirmed Phase 4 had already executed: `1700000000008_notifications-schema.js` already contains the byte-identical `CREATE TABLE ai_drafts`, and `comms-reporting/notifications.ts` already exports both guard symbols, consumed unchanged by 04-02's reporting.ts.
- **Fix:** This plan's migration omits its own `CREATE TABLE ai_drafts` block entirely — `ics_forms.ai_draft_id` references the pre-existing table directly. `ai-assist/governance.ts` is a one-line `export { ... } from '../comms-reporting/notifications.js'` re-export, not a second implementation.
- **Files modified:** backend/migrations/1700000000011_persona-ai-signal-schema.js, backend/src/modules/ai-assist/governance.ts
- **Verification:** `grep -n 'export.*assertAiOriginApproved' backend/src/modules/ai-assist/governance.ts` confirms the export resolves; the integration test's AI-governance-blocked-then-approved flow (assertion 4/5) proves the guard functions identically through this new import path.
- **Committed in:** 25afd15, 3e0ce02

**3. [Rule 1 - Bug] dashboard.ts computes real task/resource-request counts instead of the plan's stale hardcoded-zero assumption**
- **Found during:** Task 2
- **Issue:** The plan's action text asserted "Phase 3's tasks/resource_requests tables do not exist in this codebase" based on a stale STATE.md reading, instructing hardcoded zeros for `open_tasks`/`pending_resource_requests`. Direct inspection (`grep -l "CREATE TABLE tasks\b"` and `"CREATE TABLE resource_requests\b"` across migrations) confirmed both tables DO exist — Phase 3 (03-01/03-04) already shipped them.
- **Fix:** Wrote real `COUNT(*)` queries for both fields, scoped through the caller's `jurisdiction_scope` via the same incident_id join pattern every other cross-table query in this module uses. Left `notifications_pending_ack` at the documented zero — that one is a genuine schema gap (no per-recipient user_id column), not a stale assumption.
- **Files modified:** backend/src/modules/incident-ops/dashboard.ts
- **Verification:** Integration test's dashboard assertion confirms `active_incidents` matches a direct `SELECT COUNT(*)`; `open_tasks`/`pending_resource_requests` are real integers (not hardcoded 0) confirmed by code inspection and tsc/test pass.
- **Committed in:** 3e0ce02

---

**Total deviations:** 3 auto-fixed (2 Rule 3 blocking, 1 Rule 1 bug)
**Impact on plan:** All three deviations were necessary corrections to assumptions the plan made before this codebase's actual state was known at execution time (two migrations had landed since the plan was authored). No scope creep — each fix stayed within the plan's own documented contingency instructions or its stated objective (real dashboard data, not placeholder data).

## Issues Encountered

None — the plan's own Task 1 action text explicitly anticipated and gave resolution instructions for the ai_drafts collision; following those instructions required no improvisation beyond confirming which phase had actually landed first.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- The shared `assertAiOriginApproved` guard (reachable from either `ai-assist/governance.js` or `comms-reporting/notifications.js`) is ready for 06-03 (ai-drafts lifecycle) and 06-04 (signal triage) to import unchanged, per this plan's own `enables` contract.
- `GET /api/v1/dashboard/summary` is ready for 06-05's EOC Dashboard (PER-01) to consume.
- `backend/scripts/seed.ts`'s `incidentsFullAccessRoles` loop now ends with the `'approve'` grant in place — 06-02 (which also touches `seed.ts`, in its own separate `role_landing_config` block) can safely append after this plan's already-landed state with no line-level conflict, per both plans' documented sequencing.
- No blockers. Full backend suite (16 files, 94 tests) green; tsc --noEmit and `npm run build` both clean.

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across every file this plan created/modified returned only one pre-existing, unrelated hit (`seed.ts`'s `placeholders` SQL-parameter variable name, not a stub).

## Self-Check: PASSED

- All 5 created files confirmed present on disk via `[ -f ]`.
- All 3 task commits (`25afd15`, `3e0ce02`, `9e70c91`) confirmed present via `git log --oneline --all`.
- Build check: `npm run build` (tsc -p tsconfig.json) → exit 0, no output.
- `npx tsc --noEmit` → exit 0, no output.
- Full backend suite: 16 files, 94 tests, all passing (87 pre-existing + 7 new), zero regression.
- No blocking stubs found.

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
