---
phase: 06-persona-dashboards-ai-assistance
plan: 11
subsystem: ai-assist
tags: [seed-data, fixtures, playwright, signal-triage, gap-closure]

# Dependency graph
requires:
  - phase: 06-persona-dashboards-ai-assistance
    provides: "06-04's clusterHazardFeedEvents() clustering job and its own WHERE NOT EXISTS idempotency guard, and 06-09's signal-triage.spec.ts frontend e2e suite that this plan's fixture pool keeps populated"
provides:
  - "6 additional, mutually-distinct, never-colliding hazard_feed_events fixture rows in backend/scripts/seed.ts's hazardFeedEventDefs array"
  - "A signal-triage.spec.ts fixture pool that survives at least 2 consecutive full-suite Playwright re-runs within one long-lived sandbox session without exhausting the 'at least one New-status signal' precondition test 2 depends on"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Seed-data replenishment via appending more never-before-seen natural-key rows, never a reset/reseed capability — matches the array's own pre-existing 'UAT data-doctor fixtures' precedent and is explicitly documented as safe to repeat again later"

key-files:
  created: []
  modified:
    - backend/scripts/seed.ts

key-decisions: []

patterns-established: []

# Metrics
duration: 12min
completed: 2026-11-19
---

# Phase 6 Plan 11: Signal-triage fixture pool replenishment Summary

**Extended `backend/scripts/seed.ts`'s `hazardFeedEventDefs` array with 6 more isolated, distinct-type, far-apart-geometry hazard-feed fixture rows, proven to give `clusterHazardFeedEvents()` 6 fresh Medium-confidence 'New' signals on every drained-queue reseed — closing the `browser_suite: fail` gate blocker (06-GATE.md failure #3) without touching any production route, guard, or schema.**

## Performance

- **Duration:** 12 min
- **Started:** 2026-11-19T23:07:00Z (approx., per plan file mtime)
- **Completed:** 2026-11-19T23:28:41Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- `hazardFeedEventDefs` now carries 13 total fixture-event entries (7 original + 6 new), each with a globally-unique `external_event_id` and a `type`/geometry combination far enough from every other entry that `clusterHazardFeedEvents()`'s 0.5-degree-grid-cell GROUP BY always forms 6 brand-new isolated Medium-confidence clusters rather than snapping into an existing group.
- Proved the fix directly against the exact failure condition recorded in 06-GATE.md: ran `npx playwright test e2e/signal-triage.spec.ts --workers=1` twice in direct succession in the same long-lived sandbox session — 4/4 passed both times (previously, the second/Nth run of this exact pattern is what exhausted the pool and produced the recorded `browser_suite: fail`).
- Confirmed `clusterHazardFeedEvents()`'s own `WHERE NOT EXISTS (signal_source_events link)` idempotency guard is completely unmodified and still holds: a third `npm run seed` run (immediately following the first, pre-Playwright) logged `0 new signal(s) created`, while the first run after this plan's edit logged `6 new signal(s) created` against a database that already held the 7 original fixture rows from prior phases' accumulated test/UAT runs.
- Full backend suite (19 files, 108 tests) stays green with zero regression — this plan touches only fixture data, no production code path.

## Task Commits

1. **Task 1: Extend seed.ts's hazardFeedEventDefs with a larger, self-replenishing fixture pool** - `2cc0dab` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `backend/scripts/seed.ts` - Appended 6 new `hazardFeedEventDefs` entries (UAT-SIGNAL-NOAA-005, NWS-006, USGS-007, NOAA-008, NWS-009, USGS-010) immediately after the existing UAT-SIGNAL-NOAA-004 entry, following the array's own established comment-block/shape convention exactly. No other line in the file touched.

## Decisions Made
None - followed plan as specified. The plan's own prescribed fixture rows (feed_name, external_event_id, type, severity, lng/lat, source, issued_at for each of the 6 new entries) were inserted verbatim.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

**Not a deviation, but worth recording for future executors:** `npm run seed` run directly (not via `.pivota/start-dev.sh`) does not automatically load the root `.env` file's `DATABASE_URL` into the process environment — `backend/src/db/client.ts` reads `process.env.DATABASE_URL` with no dotenv loader anywhere in the backend. Running `npm run seed` bare fails with `no PostgreSQL user name specified in startup packet`. Worked around for verification purposes only by `set -a; source /home/daytona/project/.env; set +a` before invoking `npm run seed` / `npx vitest run` directly in this shell — this is exactly what `.pivota/start-dev.sh`'s own D-11.6 step already does for the live dev/preview process, so no code or script change was needed or made.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The `browser_suite: fail` gate blocker's `signal-triage.spec.ts` failure (06-GATE.md failure #3) is closed: the exact repeated-full-run pattern that previously exhausted the fixture pool now passes 4/4 twice in direct succession.
- The other two recorded `browser_suite` failures (`admin-users-roles.spec.ts`'s 1351-accumulated-users pagination issue, `field-mobile-sync-conflict.spec.ts`'s jurisdiction-ordering flake) remain explicitly OUT OF SCOPE for this plan, owned by Phase 1 and Phase 5 respectively, per `deferred-items.md`'s own documented scope boundary — unchanged by this plan.
- No blockers. This was the final planned gap-closure plan for Phase 6; the phase and all 6 phases of the milestone remain complete and ready for verification, now with one fewer gate finding outstanding.

## Self-Check: PASSED

- `backend/scripts/seed.ts` exists on disk and contains the 6 new entries: confirmed via `grep -c "external_event_id: 'UAT-SIGNAL" backend/scripts/seed.ts` returning 13 (>= 10 per this plan's own `integration_contracts.verify` command) → `CONTRACT_OK`.
- Commit `2cc0dab` exists: confirmed via `git log --oneline` showing `feat(06-11): extend seed.ts fixture pool to survive repeated Playwright reruns`.
- Build/typecheck check: `cd backend && npx tsc --noEmit` → exit 0, no errors.
- Full backend suite: `cd backend && npx vitest run` → 19 files / 108 tests passed, exit 0.
- `## Known Stubs`: None found — `git diff` of this plan's only changed file contains no TODO/FIXME/placeholder/not-implemented markers, and the change is a pure data-literal array append with no new function bodies.

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
