---
phase: 03-plans-tasks-resource-requests
plan: 03
subsystem: plans
tags: [fastify, postgres, plans, playbooks, approval-workflow, task-materialization, rbac]

# Dependency graph
requires:
  - phase: 03-01
    provides: "tasks table + TaskService.createFromTemplate cross-module entry point; tasks.plan_section_id unconstrained column"
  - phase: 03-02
    provides: "shared-file edit serialization on backend/src/server.ts (no functional dependency)"
  - phase: 01-03
    provides: "requirePermission RBAC preHandler; AuditService.record()"
provides:
  - "plans, plan_versions, plan_sections, plan_task_templates, document_links schema (exact TechArch 02c DDL)"
  - "Closed 03-01's deferred tasks.plan_section_id -> plan_sections FK"
  - "GET/POST /api/v1/plans, GET/PATCH /api/v1/plans/{id}, POST .../submit-review, POST .../review, POST .../sections/{sectionId}/link-tasks, POST .../materialize-tasks"
  - "Draft -> Review -> Approved workflow with immutable append-only version history and server-enforced no-self-approval (application layer + chk_no_self_approval DB CHECK defense-in-depth)"
  - "Section-to-task-template linkage unrestricted by plan status (metadata, not content)"
  - "One-click task materialization calling 03-01's TaskService.createFromTemplate cross-module"
affects: ["03-05", "03-06", "03-07", "03-08", "03-09"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "New Fastify module (plans) mounted alongside auth-org/incident-ops/integration-gateway, same component-boundary convention as TechArch's module list"
    - "Defense-in-depth no-self-approval: application-layer check (submitted_by !== reviewed_by) backstopped by a database CHECK constraint, mirroring Phase 2's append-only-trigger pattern"
    - "Content snapshot written at submit-review time (not approve time) into the SAME plan_versions row whose reviewed_by/review_action/reviewed_at columns are filled in later by the review step — content_snapshot itself is never UPDATEd by any code path"
    - "Cross-module materialization: plans module opens its own transaction and calls incident-ops's exported TaskService.createFromTemplate(client, ...) inside it, per TechArch's 'plans emits the template list; incident-ops performs the actual task creation' rule"

key-files:
  created:
    - backend/migrations/1700000000007_plans-schema.js
    - backend/src/modules/plans/plans.ts
    - backend/src/modules/plans/materialize.ts
    - backend/src/modules/plans/routes.ts
    - backend/src/modules/plans/plans.test.ts
  modified:
    - backend/src/server.ts

key-decisions:
  - "Migration filename renumbered from the plan's literal 1700000000005 to 1700000000007 — 03-02's 1700000000006 migration was already applied in this sandbox's database before this plan ran, and node-pg-migrate rejects an out-of-order migration file; renumbering (not editing 006) preserves both plans' independent history"
  - "materialize-tasks split into its own file (materialize.ts) rather than appended to plans.ts, per the plan's own stated discretion once plans.ts crossed ~400 lines"
  - "link-tasks endpoint deliberately NOT restricted to Draft status, per the plan's explicit reasoning: plan_task_templates rows are section metadata, not plan content subject to the content_snapshot immutability guarantee"

patterns-established:
  - "Plans-module no-self-approval: 403 SELF_APPROVAL_BLOCKED before any write when the reviewer is the same person who submitted the version"
  - "Partial-success materialization: an unresolvable owner-role skips that one template (skipped[] with reason NO_USER_FOR_ROLE) rather than failing the whole batch"

# Metrics
duration: 6min
completed: 2026-11-17
---

# Phase 3 Plan 3: Plans & Playbooks Approval Workflow + Task Materialization Summary

**Draft→Review→Approved plan workflow with immutable append-only version history, defense-in-depth no-self-approval (app check + DB CHECK constraint), section-to-task-template linkage unrestricted by plan status, and one-click task materialization calling 03-01's `TaskService.createFromTemplate` cross-module.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-17T13:43:01Z
- **Completed:** 2026-11-17T13:48:35Z
- **Tasks:** 3
- **Files modified:** 6 (5 created, 1 modified)

## Accomplishments
- New `plans` Fastify module built from scratch (no Phase-1/Phase-2 prior art) with `plans`, `plan_versions`, `plan_sections`, `plan_task_templates`, `document_links` tables per TechArch's exact DDL
- Closed 03-01's documented deferred FK: `tasks.plan_section_id` now carries a real `REFERENCES plan_sections(id)` constraint
- Draft → Review → Approved workflow: submit-review writes the immutable content snapshot before any reviewer sees it; approve increments `current_version` and writes an audit-log entry; request_changes reverts to Draft with comments recorded via `AuditService.record`
- No-self-approval enforced at TWO layers: application check (`submitted_by === reviewed_by` → `403 SELF_APPROVAL_BLOCKED`, no write) and the `chk_no_self_approval` database CHECK constraint as structural backstop
- `POST .../sections/{sectionId}/link-tasks` works on a plan in ANY status (Draft/Review/Approved) — proven directly in the integration test by linking a template to an already-Approved plan's section and asserting `204` (not `409`)
- `POST .../materialize-tasks`: Approved-only gate, role-to-user owner resolution (most-recently-active user holding the template's `default_owner_role`), `incident.opened_at + default_due_offset_minutes` due-date resolution, partial-success `skipped[]` array for unresolvable roles — calls 03-01's exported `TaskService.createFromTemplate` inside one transaction, and the resulting task is independently readable via 03-01's own `GET /api/v1/tasks`

## Task Commits

Each task was committed atomically:

1. **Task 1: Plans schema migration** - `7c046b8` (feat)
2. **Task 2: Plan CRUD + Draft→Review→Approved workflow** - `07dcc80` (feat)
3. **Task 3: One-click task materialization + mount routes + integration test** - `ab1a5ea` (test)

_Note: Task 1's migration file was renumbered during commit from `1700000000005` to `1700000000007` — see Deviations below._

## Files Created/Modified
- `backend/migrations/1700000000007_plans-schema.js` - Exact TechArch 02c DDL (5 tables) + `ALTER TABLE tasks ADD CONSTRAINT fk_tasks_plan_section`
- `backend/src/modules/plans/plans.ts` - Plan CRUD, submit-review, review (self-approval gate), link-tasks
- `backend/src/modules/plans/materialize.ts` - One-click task materialization, cross-module `TaskService.createFromTemplate` call
- `backend/src/modules/plans/routes.ts` - Fastify plugin registering `plans.ts` + `materialize.ts` handlers
- `backend/src/modules/plans/plans.test.ts` - 3 integration tests (full lifecycle, direct-approve-from-Draft 409, empty-plan-submit 422)
- `backend/src/server.ts` - Mounted `planRoutes` alongside existing module registrations (targeted edit, not full-file rewrite, per the parallel-plan file-sharing note)

## Decisions Made
- Migration renumbered 1700000000005 → 1700000000007: this sandbox's database already had 03-02's `1700000000006_background-jobs-extend-job-type.js` applied when this plan ran (wave-ordering in this execution happened to run 03-02 before 03-03 landed its migration file), and node-pg-migrate hard-rejects an out-of-order migration filename. Renumbering preserves both migrations' independent up/down history without editing 03-02's already-applied file.
- `materialize-tasks` split into its own file (`materialize.ts`) rather than appended to `plans.ts`, exercising the plan's own stated discretion once `plans.ts` reached ~400 lines (Claude's documented judgment call, not a deviation from the plan's intent).
- Confirmed via the integration test that `link-tasks` succeeds (`204`) on an Approved plan — not `409` — proving the status-gate decision documented inline in the handler is correctly implemented, not just asserted in a comment.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration filename renumbered to avoid out-of-order conflict**
- **Found during:** Task 1 (running the migration against the shared dev database)
- **Issue:** The plan specified `backend/migrations/1700000000005_plans-schema.js`, but `1700000000006_background-jobs-extend-job-type.js` (03-02's migration) was already applied in this sandbox's database. node-pg-migrate refuses to run a migration whose timestamp precedes an already-applied one: `Error: Not run migration 1700000000005_plans-schema is preceding already run migration 1700000000006_background-jobs-extend-job-type`.
- **Fix:** Renamed the file to `1700000000007_plans-schema.js` (next available timestamp after 006) before running `npm run migrate`. No DDL content changed.
- **Files modified:** `backend/migrations/1700000000007_plans-schema.js` (created under the new name; no file ever existed under the old name in git history)
- **Verification:** `npm run migrate` ran clean; all 5 tables + the deferred FK + the `chk_no_self_approval` constraint verified present via `psql \d`.
- **Committed in:** `7c046b8` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for migration ordering correctness in this execution's actual database state. No scope creep — DDL content is byte-for-byte what the plan specified.

## Issues Encountered
None beyond the migration renumbering documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `plans` module's full Draft→Review→Approved→link-tasks→materialize API surface is backend-complete and tested end-to-end across the `plans`/`incident-ops` module boundary.
- 03-05/03-06's frontend plan screens can now consume this API.
- 03-07 (role-permission seed, executed in parallel) already seeds `plans:{view,create,edit}` to `planning_logistics_chief` and the separate `plans:{view,review}` to `eoc_director` — the exact reviewer/author role split this plan's no-self-approval design assumes. Confirmed via `git show` on 03-07's commit; no conflict, no rework needed.
- Full backend test suite: 11 files, 55 tests, all green. `tsc --noEmit` and `npm run build` both clean.
- No known blockers for downstream Phase 3 plans.

## Known Stubs

None found - grepped all created/modified files for TODO|FIXME|placeholder|not.?implemented|coming soon with zero matches. Reviewed by reading: no handlers return hardcoded/static data where real logic belongs, no empty function bodies, no stubbed API calls.

## Self-Check: PASSED

- All 5 created files + SUMMARY.md verified present on disk via `[ -f ]`
- All 3 task commit hashes (7c046b8, 07dcc80, ab1a5ea) verified present via `git log --oneline --all`
- Plan-level build: `npm run build` (tsc -p tsconfig.json) → exit 0
- Full backend test suite (including this plan's own 3 new tests + 03-07's parallel 3 new tests): 11 files, 55 tests, all passing, zero regressions
- `## Known Stubs` section present above with 0 blocking entries

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*
