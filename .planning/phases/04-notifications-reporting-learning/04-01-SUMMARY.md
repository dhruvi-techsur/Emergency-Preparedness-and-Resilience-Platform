---
phase: 04-notifications-reporting-learning
plan: 01
subsystem: comms-reporting
tags: [fastify, postgres, postgis, notifications, rbac, opa, ai-governance]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "TimelineService/withTimelineTransaction (02-01), requirePermission (01-03)"
  - phase: 03-plans-tasks-resource-requests
    provides: "existing migration-number sequence (plans-schema at 1700000000007), server.ts append-only convention"
provides:
  - "recipient_groups, message_templates, notifications, notification_recipients, notification_delivery_status, ai_drafts tables (migration 1700000000008)"
  - "GET/POST /api/v1/recipient-groups, GET/POST /api/v1/message-templates"
  - "POST /api/v1/notifications/compose (audience + message-body gates)"
  - "POST /api/v1/notifications/{id}/send (approver-match + AI-governance gates, transactional Timeline write)"
  - "GET /api/v1/notifications/{id}/delivery-status"
  - "POST /api/v1/ai-drafts + .../approve + .../discard (structural stub, no live AI gateway)"
  - "assertAiOriginApproved/AiOriginNotApprovedError — shared AI-governance guard for 04-02 to reuse unchanged"
affects: ["04-02 (reporting — imports assertAiOriginApproved)", "04-04 (seed — grants notifications feature-permission)", "04-05 (frontend compose/delivery screens)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared AI-governance guard (assertAiOriginApproved) as one exported function, imported by every module writing ai_origin:true content — not reimplemented per-module"
    - "Audience/message validation pre-checks in the route handler, backstopped by DB CHECK constraints (chk_audience_present) as the structural fallback, never the only enforcement layer"
    - "Server-side approver-identity re-verification: a client-asserted approver_id is only honored when it equals req.epmpUser.id — never trusted on its own even from a caller who holds the approve permission"

key-files:
  created:
    - backend/migrations/1700000000008_notifications-schema.js
    - backend/src/modules/comms-reporting/notifications.ts
    - backend/src/modules/comms-reporting/routes.ts
    - backend/src/modules/comms-reporting/notifications.test.ts
  modified:
    - backend/src/server.ts

key-decisions:
  - "Migration filename renumbered to 1700000000008 (not the plan's literal 1700000000007) — Phase 3's 03-03 plan already claimed 1700000000007 for plans-schema.js; preserved node-pg-migrate's required numeric-ordering contract by using the next free number"
  - "Approver-mismatch enforcement implemented as caller-identity equality (approver_id must equal req.epmpUser.id) rather than role-permission lookup on the asserted id — satisfies FRD's 'enforced server-side, not just hidden client-side' rule: a caller cannot send on behalf of a DIFFERENT named person regardless of that person's own permissions"
  - "Geography-type recipient groups resolve to zero concrete notification_recipients at both list (member_count omitted) and compose time, per this plan's own documented Phase-6/F16-roster-sync-dependent scope boundary — no live roster-geo-match exists this phase"
  - "ai_drafts.sources JSONB literal built via jsonb_build_array/jsonb_build_object instead of a raw '[...]'::jsonb string with an embedded now() call — Postgres's jsonb cast parses before SQL evaluates now(), so the literal string 'now()' is invalid JSON; discovered via this plan's own integration test (Rule 1 bug)"

patterns-established:
  - "AI-governance guard pattern: one assertAiOriginApproved(client, payload) function per TechArch 01-components.md §2.4 rule 3, called by any route writing ai_origin:true content, mapping its thrown AiOriginNotApprovedError to 400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED at the route layer"

# Metrics
duration: 10min
completed: 2026-11-18
---

# Phase 4 Plan 01: Notifications Integration (comms-reporting module) Summary

**Fastify `comms-reporting` module: recipient-group/template CRUD, a 4-gate compose→send notification lifecycle (audience-present, message-non-empty, server-verified approver identity, shared AI-origin-approval guard), per-recipient delivery-status tracking, and the `assertAiOriginApproved` governance function 04-02 will reuse unchanged.**

## Performance

- **Duration:** 10 min
- **Started:** 2026-11-18T05:22:00Z
- **Completed:** 2026-11-18T05:32:00Z
- **Tasks:** 3
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- New `comms-reporting` backend module (first module touching F5) mounted on `server.ts` alongside `auth-org`/`incident-ops`/`plans`/`integration-gateway`
- Migration creates all 6 tables from TechArch's exact DDL (`ai_drafts`, `recipient_groups`, `message_templates`, `notifications`, `notification_recipients`, `notification_delivery_status`) including every CHECK constraint (`chk_audience_present`, `chk_send_requires_approval`, `chk_ai_origin_requires_approval`, `chk_approve_requires_named_user`, `chk_sources_or_flagged`)
- Compose→send lifecycle backend-complete: audience-required gate rejects before any write; approver-identity gate is server-verified (never trusts a client-asserted `approver_id` belonging to someone else); shared `assertAiOriginApproved` guard blocks any AI-origin send lacking an approved `ai_drafts` row; a successful incident-linked send writes exactly one `incident_timeline` entry inside the same transaction as the `approved_by`/`sent_at` UPDATE
- `GET .../delivery-status` returns the exact DDL-enum-constrained per-recipient shape with a computed `ack_percentage`
- Minimal `ai-drafts` + approve/discard endpoints (structural stub, no live Intelligence Layer gateway) make the AI-governance send-gating invariant testable end-to-end now, with a real-gateway swap being a drop-in Phase 6 change

## Task Commits

1. **Task 1: Notifications + AI-drafts schema migration** - `bc55883` (feat)
2. **Task 2: Recipient-group/template CRUD + compose/send/delivery-status API + AI-governance guard** - `c8c81ff` (feat)
3. **Task 3: Integration test — audience gate, approver gate, AI-governance gate, delivery-status shape** - `499557b` (test)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/migrations/1700000000008_notifications-schema.js` - 6-table DDL per TechArch 02c, with inline scope-deviation note on `ai_drafts`' real referencing-table count
- `backend/src/modules/comms-reporting/notifications.ts` - Full route surface + exported `assertAiOriginApproved`/`AiOriginNotApprovedError`
- `backend/src/modules/comms-reporting/routes.ts` - Module plugin mount point (04-02 appends its own routes file here in Wave 2)
- `backend/src/modules/comms-reporting/notifications.test.ts` - 3-test integration suite against the real compose Postgres+OPA stack
- `backend/src/server.ts` - `app.register(commsReportingRoutes)` appended after `planRoutes`

## Decisions Made
- Migration renumbered to `1700000000008` (not the plan's literal `1700000000007`) since Phase 3's `plans-schema.js` already occupies that number — preserves node-pg-migrate's numeric-ordering requirement
- Approver-mismatch enforced via caller-identity equality, not a second role lookup on the asserted `approver_id` — matches the FRD's explicit "not just hidden client-side" server-side enforcement rule
- Geography-type recipient groups structurally resolve to zero concrete recipients (both `member_count` and compose-time resolution) — documented Phase-6/F16 scope gap, not a bug
- `ai_drafts.sources` JSONB literal built via `jsonb_build_array`/`jsonb_build_object` rather than an embedded `now()` inside a raw JSON string (which Postgres's `::jsonb` cast rejects as invalid JSON before SQL ever evaluates `now()`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration filename collision with Phase 3's plans-schema.js**
- **Found during:** Task 1 (schema migration)
- **Issue:** The plan's literal filename `1700000000007_notifications-schema.js` collides with an already-committed `1700000000007_plans-schema.js` from Phase 3 (03-03). node-pg-migrate requires unique, monotonically-ordered migration numbers.
- **Fix:** Renumbered to `1700000000008_notifications-schema.js`, the next free number in sequence. No other file references the old number.
- **Files modified:** `backend/migrations/1700000000008_notifications-schema.js` (created under the corrected name)
- **Verification:** `npm run migrate` ran clean against the real Postgres instance with Phase 1-3's existing migrations already applied; all 6 tables confirmed present via `\dt`
- **Committed in:** `bc55883` (Task 1 commit)

**2. [Rule 1 - Bug] ai_drafts stub INSERT's sources JSONB literal was invalid JSON**
- **Found during:** Task 3 (integration test — AI-governance gate test case)
- **Issue:** The plan's literal snippet embedded a raw `now()::text` SQL call inside a single-quoted JSON string literal cast to `::jsonb` (`'[{"source":"stub","time":now()::text,...}]'::jsonb`). Postgres parses the string as JSON text BEFORE any SQL function call resolves, so the literal token `now()` inside the string is invalid JSON syntax, not a SQL expression — every `POST /api/v1/ai-drafts` call 500'd with `invalid input syntax for type json`.
- **Fix:** Rewrote the INSERT to build the JSONB value with `jsonb_build_array(jsonb_build_object('source', 'stub', 'time', now()::text, 'confidence', 'Medium'))`, which evaluates `now()` as a real SQL expression before JSON construction.
- **Files modified:** `backend/src/modules/comms-reporting/notifications.ts`
- **Verification:** Re-ran the full integration test suite — all 3 tests pass, including the AI-governance gate flow that depends on this endpoint
- **Committed in:** `c8c81ff` (Task 2 commit — fixed before the commit landed, so no separate fix commit was needed)

**3. [Rule 1 - Bug] Test's approver-mismatch scenario asserted the wrong caller identity**
- **Found during:** Task 3 (integration test — first write-up)
- **Issue:** The initial test had a user with NO approve permission attempt to call `POST .../send` entirely — that correctly 403s, but with `ROLE_UNRESOLVED` from the RBAC preHandler (OPA denies before the route body ever runs), not `APPROVER_MISMATCH`. The plan's own assertion (`only ANY user holding notifications:approve permission is a valid approver`) means the `APPROVER_MISMATCH` path is only reachable by a caller who DOES hold `approve`, asserting a DIFFERENT person's id in the body.
- **Fix:** Corrected the test to call `/send` as the approve-permission-holding `approverToken`, asserting `approver_id: nonApproverId` (a different user's id) in the body — this is the actual code path that exercises the route's own identity-match check rather than OPA's coarser permission gate.
- **Files modified:** `backend/src/modules/comms-reporting/notifications.test.ts`
- **Verification:** Test now correctly exercises and passes against `APPROVER_MISMATCH`
- **Committed in:** `499557b` (Task 3 commit)

---

**Total deviations:** 3 auto-fixed (1 blocking migration-number collision, 2 bugs — 1 production code, 1 test-only)
**Impact on plan:** All three fixes were necessary for correctness; none represent scope creep. The migration renumbering is a pure naming fix with zero behavioral difference from the plan's intent. The JSONB fix was required for the AI-drafts stub to function at all. The test-identity fix made the test actually exercise the code path it claimed to.

## Issues Encountered
None beyond the three auto-fixed deviations above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `assertAiOriginApproved`/`AiOriginNotApprovedError` are exported and ready for 04-02's reporting module (`sitreps`/`aar` finalize) to import unchanged, satisfying TechArch's "shared middleware, not duplicated logic" rule
- `backend/src/server.ts` already has `app.register(commsReportingRoutes)` in place — 04-02's own Task can safely append its routes registration inside the SAME `comms-reporting/routes.ts` plugin (per this plan's own sequencing note) without a same-file race, since 04-02 runs strictly after this plan (Wave 2, depends_on `["04-01"]`)
- `ai_drafts` table exists with exactly two real referencing tables right now (`notifications` here, `sitreps`/`aars` to be added by 04-02) — a future Phase-6 ICS-forms plan should find it already present and only needs its own `ai_draft_id` FK column, not a fresh migration
- Full backend test suite (12 files, 58 tests) and `npm run build` both green after this plan's changes — no regressions in Phase 1-3 coverage

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

- `POST /api/v1/ai-drafts` — deterministic stub text (no live Intelligence Layer gateway exists in this sandbox). **Cosmetic, not blocking**: explicitly scoped by the plan itself as a structural stand-in making the AI-governance send-gating invariant testable end-to-end; the full F9 drafting UI/signal-triage lifecycle is documented Phase 6 scope. Swapping the stub body for a real gateway call is a drop-in change, not a contract change.
- `recipient_groups` Geography-type `member_count` (list) and compose-time recipient resolution — both return/resolve to nothing (no live roster-geo-match exists this phase). **Cosmetic, not blocking**: documented Phase-6/F16-roster-sync-dependent enhancement in the plan's own threat register (T-04-03, disposition "accept" — no data exposed, only a feature incomplete).
- Channel character-limit enforcement in compose — only "non-empty" is checked, not a numeric per-channel limit. **Cosmetic, not blocking**: F14's external-provider config (which would define per-channel limits) is explicitly v2-deferred per REQUIREMENTS.md; documented inline in the plan and in code.

None of the above defeat this plan's objective — the 4-step compose flow, mandatory approval-before-send (including AI-origin content), and per-recipient delivery tracking are all fully functional and tested.

## Self-Check: PASSED

- All 5 claimed files verified present on disk via `[ -f ]`.
- All 3 task commits (`bc55883`, `c8c81ff`, `499557b`) verified present via `git log --oneline --all`.
- Build check: `cd backend && npm run build` (`tsc -p tsconfig.json`) → exit 0.
- Full backend test suite: 12 files, 58 tests, all passing (includes this plan's 3 new integration tests against the real compose Postgres+OPA stack).
- `## Known Stubs` section above: 3 entries, all classified cosmetic (explicitly plan-scoped simplifications), none blocking.
