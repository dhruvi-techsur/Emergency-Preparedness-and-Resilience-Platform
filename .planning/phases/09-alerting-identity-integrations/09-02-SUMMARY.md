---
phase: 09-alerting-identity-integrations
plan: 02
subsystem: integration-gateway
tags: [hris, iam-roster, fastify, postgres, email-matching, read-only-contract]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "personnel_roster table (Phase 1's original auth-org migration, unused until this plan), record_authority_registry seed row ({record_type:'personnel_roster', authoritative_system:'HRIS'}), computeBackoff helper (webhook-delivery-worker.ts)"
provides:
  - "fetchHrisPersonnel(since, simulateFailure) stub adapter — matched + unmatched personnel records, HRIS_FEED_UNREACHABLE on failure"
  - "runHrisRosterSync() — upserts personnel_roster, matches to users by EMAIL ONLY (never fuzzy/force-matched), never writes users table"
  - "hrisRosterRoutes — GET /api/v1/integrations/hris/personnel, GET /api/v1/integrations/hris/health (zero write routes)"
  - "startHrisRosterSyncScheduler() — 5-minute idempotent-against-double-start scheduler, wired into server.ts"
  - "personnel_roster seed fixture (1 matched row against commander@epmp.local, 1 unmatched reference-only row)"
affects: [09-04-roster-frontend, command-role-assignment-F1, resource-request-matching-F4]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "job_type='report_generation' claimed as this adapter's exclusive background_jobs scope — one of Phase 1's original reserved-but-unused CHECK-constraint values, re-confirmed unclaimed via grep at execution time"
    - "Email-only matching as a separate explicit UPDATE statement after the personnel_roster UPSERT — never combined into one write, so matched_user_id is structurally never set by the same statement that writes HR-sourced columns"

key-files:
  created:
    - backend/src/modules/integration-gateway/hris-roster-adapter.ts
    - backend/src/modules/integration-gateway/hris-roster-adapter.test.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/server.ts
    - backend/scripts/seed.ts

key-decisions:
  - "job_type='report_generation' chosen over 'signal_triage' (the other remaining unclaimed reserved value) — earlier alphabetically, avoids any collision risk with sibling Wave-1 plan 09-01's own job_type choice ('notification_fanout'), and conceptually fits a periodic reporting-style batch sync"
  - "MATCHED_SEED_USER_EMAIL = commander@epmp.local — the real seeded EPMP user (Phase 2's 02-05 plan) whose email the stub's one matched fixture record deliberately carries, proving the email-only-matching path end-to-end rather than against a synthetic id"
  - "runHrisRosterSync() never re-throws on a fetch failure — returns {synced:0, matched:0, unmatched:0} early instead, since F16's 'last-synced roster data remains available' rule requires the sync job itself to survive an HRIS outage, not just the data"

patterns-established:
  - "Pattern: structural grep-based verify commands inside a test file must exclude the test file itself (--exclude=\"*.test.ts\") to avoid the test's own literal assertion string self-matching the pattern it's proving absent — same self-collision class as Phase 8's 08-08 finding"

duration: 25min
completed: 2026-11-20
---

# Phase 9 Plan 02: HRIS Roster Adapter Summary

**Deterministic HR/IAM roster-sync stub adapter reading into Phase 1's dormant `personnel_roster` table, matching to EPMP users by email ONLY, with a structural (route-absence) guarantee that no write path to that table exists anywhere in the codebase.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-20T19:35:00Z
- **Completed:** 2026-11-20T19:45:48Z
- **Tasks:** 2
- **Files modified:** 5 (1 created adapter, 1 created test, 3 modified: routes.ts, server.ts, seed.ts)

## Accomplishments
- `hris-roster-adapter.ts` ships all 4 required exports (`fetchHrisPersonnel`, `runHrisRosterSync`, `hrisRosterRoutes`, `startHrisRosterSyncScheduler`), mirroring `cad-adapter.ts`/`facility-adapter.ts`'s exact structure/commenting conventions
- Email-only matching enforced as a genuinely separate SQL statement from the `personnel_roster` HR-column UPSERT — `matched_user_id` can never be set by the same write that lands `name`/`role_titles`/`qualifications`/etc.
- Zero PATCH/PUT/DELETE route exists anywhere in the codebase for `personnel_roster` — proven both by this plan's own structural grep and by a new vitest assertion that runs on every future regression pass
- Zero `UPDATE users`/`INSERT INTO users` statement exists in the adapter file — proven structurally, not just by code review
- Outage-resilience proven byte-identical: a forced sync failure leaves the prior `personnel_roster` row set (same ids, same `as_of` values) completely untouched
- `integration_health`'s `'HRIS'` row deterministically flips `online`/`offline`, always carrying `record_authority='HRIS'` (never `'EPMP'`)

## Task Commits

1. **Task 1: hris-roster-adapter.ts (adapter stub, email-only matching, sync job, read-only routes)** - `d245801` (feat)
2. **Task 2: seed.ts fixture (matched + unmatched roster records) + integration tests** - `0ba3117` (feat)

**Plan metadata:** (this commit, docs: complete plan)

## Files Created/Modified
- `backend/src/modules/integration-gateway/hris-roster-adapter.ts` - fetchHrisPersonnel/runHrisRosterSync/hrisRosterRoutes/startHrisRosterSyncScheduler
- `backend/src/modules/integration-gateway/hris-roster-adapter.test.ts` - 8 integration tests against the real compose stack (Postgres + OPA)
- `backend/src/modules/integration-gateway/routes.ts` - registered `hrisRosterRoutes`
- `backend/src/server.ts` - wired `startHrisRosterSyncScheduler()` into the graceful-degradation boot sequence
- `backend/scripts/seed.ts` - added `runHrisRosterSync()` import + call so `personnel_roster`/`integration_health` are populated on every `npm run seed`

## Decisions Made
- **job_type selection**: re-confirmed via `grep -n "CHECK (job_type IN" backend/migrations/*.js` at execution time that the full current claimed set is `{notification_fanout, feed_ingestion, sync_reconciliation, report_generation, webhook_delivery, signal_triage, task_overdue_sweep, cad_ingestion, facility_sync, document_link_sync}`. Of Phase 1's two originally-reserved-but-unclaimed values (`report_generation`/`signal_triage`), both remained unclaimed in application code (`grep -rn "report_generation\|signal_triage" backend/src` returned zero matches before this plan). Chose `'report_generation'` per the plan's own stated rationale — no migration ALTER needed.
- **Matched-user fixture email**: used `commander@epmp.local` (confirmed present in `scripts/seed.ts` since Phase 2's 02-05 plan) as the one real seeded user the stub's success-path matched record's email deliberately equals, so the matching rule is provably exercisable end-to-end rather than only unit-tested against a synthetic id.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored `hrisRosterRoutes` registration in `routes.ts` after a parallel-wave git interleave clobbered it**
- **Found during:** Task 2, build verification
- **Issue:** This plan runs in Wave 1 alongside sibling plan 09-01 (depends_on: none, no execution-order guarantee). 09-01's own edit to the same append-only `routes.ts` file landed after my Task 1 edit and did not carry my `await app.register(hrisRosterRoutes);` line forward — identical to the precedent documented in Phase 8's 08-04 SUMMARY.md (a concurrent-execution git race on a shared append-only file). `npm run build`'s route printout confirmed the HRIS routes were absent from the running app despite the file existing on disk and exporting correctly.
- **Fix:** Re-added the `hrisRosterRoutes` import and registration line to `routes.ts`, preserving 09-01's own `notificationProviderRoutes` registration already present.
- **Files modified:** `backend/src/modules/integration-gateway/routes.ts`
- **Verification:** `app.printRoutes()` confirmed `/api/v1/integrations/hris/personnel` and `/api/v1/integrations/hris/health` both present; full test suite re-run green.
- **Committed in:** `0ba3117` (Task 2 commit)

**2. [Rule 1 - Bug] Test-file self-collision in two structural grep `<verify>` assertions**
- **Found during:** Task 2, first test run
- **Issue:** Two of this plan's own vitest assertions (`PATCH.*personnel_roster|PUT.*personnel_roster|DELETE.*personnel_roster` and `job_type = 'report_generation'`) grepped the full `backend/src` tree, which included the test file's own literal assertion strings — the test's own code matched its own negative-assertion pattern, producing a false failure. Same self-collision class documented in Phase 8's 08-08 SUMMARY.md.
- **Fix:** Added `--exclude="*.test.ts"` to both `execSync` grep invocations inside `hris-roster-adapter.test.ts`.
- **Files modified:** `backend/src/modules/integration-gateway/hris-roster-adapter.test.ts`
- **Verification:** All 8 tests pass after the fix; the plan's own shell-level `<verify>` commands (which target only `hris-roster-adapter.ts`, not the test file) were unaffected and pass as written.
- **Committed in:** `0ba3117` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking/parallel-wave-race, 1 bug/test-self-collision)
**Impact on plan:** Both fixes were necessary for correctness and test-suite integrity; neither touched this plan's core adapter logic or its F16-roster contract. No scope creep.

## Issues Encountered
- One flaky test observed on a single full-suite run: `notification-provider-adapter.test.ts` (sibling plan 09-01's own test file, no relation to this plan's changes) failed once on assertion #8 (`an inbound callback with a matching external_message_id/recipient flips that recipient to Acknowledged`), then passed cleanly on two subsequent full-suite re-runs with zero code changes in between — a test-isolation timing issue in 09-01's own file against the shared compose-stack database, out of this plan's scope per the deviation rules' scope boundary. Not fixed (not caused by this plan), not logged to deferred-items.md since it is self-resolving and was independently re-verified green twice.

## User Setup Required
None - no external service configuration required (this is a deterministic in-process stub, same posture as every prior Phase 7/8/9 adapter).

## Next Phase Readiness
- Backend half of F16-roster is fully shippable: `GET /api/v1/integrations/hris/personnel` and `GET /api/v1/integrations/hris/health` are live, gated correctly (`incidents:view` / `admin:view`), and return real matched/unmatched roster data after `npm run seed`.
- Plan 09-04 (roster list frontend view, Command Role Assignment/Resource Request wiring) can now consume this plan's routes directly — no additional backend work needed for F16-roster's read surface.
- No blockers. Full backend suite (24 files, 171 tests) green with zero regression; `tsc`/`npm run build` clean; `npm run seed` re-confirmed idempotent.

---
*Phase: 09-alerting-identity-integrations*
*Completed: 2026-11-20*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` against every file this plan created/modified returned only one unrelated pre-existing match (a local variable literally named `placeholders` holding SQL `$1, $2, ...` bind-parameter markers in `seed.ts`'s generic `findOrInsert` helper, not a stub).

## Self-Check: PASSED

- `backend/src/modules/integration-gateway/hris-roster-adapter.ts` — FOUND
- `backend/src/modules/integration-gateway/hris-roster-adapter.test.ts` — FOUND
- `.planning/phases/09-alerting-identity-integrations/09-02-SUMMARY.md` — FOUND
- Commit `d245801` (Task 1) — FOUND in git log
- Commit `0ba3117` (Task 2) — FOUND in git log
- Build check: `cd backend && npm run build` → exit 0
- Full backend suite: `cd backend && npm test` → 24 files / 171 tests passed (re-verified twice after one unrelated transient flake in a sibling plan's own test file)
- `npm run seed` → clean, idempotent (0 inserted / all "already-present" on second run)
- Known Stubs: none blocking
