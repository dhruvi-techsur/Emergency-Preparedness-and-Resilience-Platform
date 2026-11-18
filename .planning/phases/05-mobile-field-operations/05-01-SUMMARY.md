---
phase: 05-mobile-field-operations
plan: 01
subsystem: api
tags: [postgis, fastify, node-pg-migrate, offline-sync, conflict-resolution, multipart]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "incidents table, incident_timeline + TimelineService/withTimelineTransaction helper (02-01) — reused unchanged for every incident-touching field-reports/sync-conflicts write"
provides:
  - "field_reports, field_report_photos, sync_conflicts tables (TechArch 02b exact DDL) via migration 1700000000010"
  - "POST /api/v1/field-reports — idempotent single-report submission keyed on client_report_id"
  - "POST /api/v1/field-reports/sync-batch — ordered batch sync with per-item synced/conflict/failed outcome"
  - "POST + GET /api/v1/field-reports/{id}/photos[/{photoId}] — non-blocking multipart upload, same-origin streaming read-back"
  - "GET /api/v1/sync-conflicts, POST /api/v1/sync-conflicts/{id}/resolve — named-person conflict resolution (keep_mine | keep_eoc)"
affects: [05-02, 05-03, 05-04]

# Tech tracking
tech-stack:
  added: ["@fastify/multipart ^10.1.0"]
  patterns:
    - "Idempotency via UNIQUE-constraint-backed SELECT-before-INSERT (client_report_id) — resubmission returns the same row, never a duplicate or an error"
    - "Sequential (non-Promise.all) batch processing with per-item try/catch so one failed item never aborts the rest of the batch"
    - "Local-disk object-storage stand-in behind a same-origin streaming route pair, documented as a drop-in replacement point for a future MinIO/S3 adapter"

key-files:
  created:
    - backend/migrations/1700000000010_field-operations-schema.js
    - backend/src/modules/incident-ops/field-reports.ts
    - backend/src/modules/incident-ops/sync-conflicts.ts
    - backend/src/modules/incident-ops/field-reports.test.ts
  modified:
    - backend/src/modules/incident-ops/routes.ts
    - backend/package.json
    - .gitignore

key-decisions:
  - "Migration renumbered 1700000000009 -> 1700000000010 — the plan's literal number collides with Phase 4's already-existing 1700000000009_reporting-schema.js"
  - "@fastify/multipart registered locally inside field-reports.ts's own plugin scope (not globally in server.ts) to contain the new dependency's blast radius to the one route that needs it"
  - "Photo bytes persist to backend/uploads/ (gitignored) as a local-disk stand-in for a real object-storage adapter, read back exclusively through GET /api/v1/field-reports/{id}/photos/{photoId} — never a raw filesystem path or external URL reaches the client"
  - "sync-batch conflict detection covers entity_type='field_report' vs incidents.updated_at only; any other entity_type is a documented extension point for a later plan"

patterns-established:
  - "Pattern: per-item fault isolation in a batch endpoint — catch per-report-in-loop, push {status:'failed'}, continue — rather than wrapping the whole loop so one bad item can never 500 the entire batch"

# Metrics
duration: 8min
completed: 2026-11-18
---

# Phase 5 Plan 1: Field Operations Backend — Idempotent Sync, Conflict Detection, and Named-Person Resolution Summary

**Three new PostGIS-backed tables plus four Fastify endpoints implementing idempotent offline field-report submission, ordered batch sync with per-item conflict detection against `incidents.updated_at`, and a named-person `keep_mine`/`keep_eoc` conflict-resolution workflow that always leaves a visible Timeline trail.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-11-18T14:20:37Z
- **Completed:** 2026-11-18T14:27:10Z
- **Tasks:** 3
- **Files modified:** 7 (4 created, 3 modified)

## Accomplishments

- `field_reports`, `field_report_photos`, `sync_conflicts` tables created with TechArch 02b's exact DDL (GEOGRAPHY column, GIST index, partial unresolved-conflicts index), verified both forward and down against the real Postgres+PostGIS compose service
- `POST /api/v1/field-reports` is provably idempotent: a retried submission with the same `client_report_id` returns the identical row id with zero second INSERT, confirmed via a direct `COUNT(*)` assertion in the integration test
- `POST /api/v1/field-reports/sync-batch` processes a client's queued offline reports in exact array order, sequentially, returning a per-item `synced`/`conflict`/`failed` result — a crafted conflict item (captured before a server-side `incidents.updated_at` bump) correctly produces a `sync_conflicts` row with both `field_version` and `eoc_version` preserved verbatim
- `POST`/`GET /api/v1/field-reports/{id}/photos[/{photoId}]` implements non-blocking photo upload via `@fastify/multipart`, streaming bytes through a same-origin route pair backed by local disk — no filesystem path or external URL ever reaches the client
- `POST /api/v1/sync-conflicts/{id}/resolve` makes `keep_mine`/`keep_eoc` a one-time, visibly-recorded named-person action: either outcome updates the conflict row and appends an `incident_timeline` entry, and a second resolve attempt is rejected with `409 SYNC_CONFLICT_ALREADY_RESOLVED`

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration — field_reports, field_report_photos, sync_conflicts** - `c45eeef` (feat)
2. **Task 2: field-reports.ts + sync-conflicts.ts — idempotent submit, sync-batch, photo upload, resolve** - `fc9d51c` (feat)
3. **Task 3: Integration test — idempotency, batch ordering, conflict creation, resolve invariant** - `51a6f23` (test)

_No separate plan-metadata commit required beyond this SUMMARY + STATE.md update below._

## Files Created/Modified

- `backend/migrations/1700000000010_field-operations-schema.js` - Three new tables + 5 indexes, additive-only migration (renumbered from the plan's literal 1700000000009 due to a Phase-4 collision)
- `backend/src/modules/incident-ops/field-reports.ts` - POST /field-reports, POST /field-reports/sync-batch, POST+GET /field-reports/:id/photos[/:photoId]
- `backend/src/modules/incident-ops/sync-conflicts.ts` - GET /sync-conflicts, POST /sync-conflicts/:id/resolve
- `backend/src/modules/incident-ops/routes.ts` - Registers both new modules, append-only convention preserved
- `backend/package.json` - Added `@fastify/multipart ^10.1.0`
- `.gitignore` - Added `backend/uploads/` (local-disk photo stand-in, outside the Pivota-managed block)
- `backend/src/modules/incident-ops/field-reports.test.ts` - 4 integration test cases against the real Postgres+OPA stack

## Decisions Made

- Migration renumbered `1700000000009` → `1700000000010` — the plan's literal filename collides with Phase 4's already-existing `1700000000009_reporting-schema.js`; same renumbering precedent 04-01/04-02 established, zero behavioral difference from the plan's intent.
- `@fastify/multipart` registered locally inside `field-reports.ts`'s own plugin scope rather than globally in `server.ts`, keeping the new dependency's blast radius confined to the one route that needs multipart parsing.
- Photo bytes persist to `backend/uploads/` (gitignored) as a documented local-disk stand-in for a future real object-storage adapter (MinIO/S3), read back exclusively through the paired same-origin GET route — satisfies the object-store I/O rule even without a real store configured this phase.
- `sync-batch`'s conflict-detection logic explicitly covers only the `entity_type='field_report'` vs. `incidents.updated_at` case; any other `entity_type` (e.g. a future F4 task-status sync-batch) is documented inline as an extension point requiring its own detection rule.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Migration filename renumbered to avoid a Phase-4 collision**
- **Found during:** Task 1 (migration creation)
- **Issue:** The plan's literal filename `1700000000009_field-operations-schema.js` collides with Phase 4's already-existing `1700000000009_reporting-schema.js` (node-pg-migrate requires unique, numerically-ordered migration names)
- **Fix:** Renumbered to `1700000000010_field-operations-schema.js`, documented inline in the file header
- **Files modified:** `backend/migrations/1700000000010_field-operations-schema.js`
- **Verification:** `npm run migrate` runs cleanly forward and `node-pg-migrate down` cleanly in reverse with no naming conflict
- **Committed in:** `c45eeef` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Purely a filename/ordering fix with zero behavioral difference from the plan's intent — every table, column, constraint, and index matches the plan's exact DDL. No scope creep.

## Issues Encountered

None — all three tasks executed per plan, each verification step (psql schema inspection, `tsc --noEmit`, route-contract greps, integration test run) passed on the first attempt against the real Postgres+OPA compose stack.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The full F6 backend API surface (idempotent submit, ordered batch sync with conflict detection, photo upload, named-person resolve) is live against the real database and ready for 05-02's offline queue and 05-03/05-04's field-mobile screens to call.
- Full backend test suite (15 files, 74 tests, including this plan's new 4) is green with zero regression; `tsc --noEmit` and `npm run build -w backend` both clean.
- No blockers. The `field_reports` feature-permission grant (seed data) is explicitly deferred to 05-04 per the schema/seed split convention every prior phase established — 05-02/05-03 work against the API contract directly and do not need the seed grant to build against this plan's routes.

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all 4 new files returned zero matches. The local-disk photo storage (documented above as an explicit object-storage stand-in, not a stub) is fully functional end-to-end (write + read-back via the paired route), not a placeholder blocking the plan's objective.

## Self-Check: PASSED

- All 5 created/modified key files confirmed present on disk via `[ -f ]`.
- All 3 task commit hashes (`c45eeef`, `fc9d51c`, `51a6f23`) confirmed in `git log --oneline --all`.
- Plan-level build check: `npm run build -w backend` → exit 0 (tsc -p tsconfig.json, clean, no output).
- Full backend test suite: `npx vitest run` → 15 files passed, 74 tests passed, 0 failures (includes this plan's new `field-reports.test.ts`, 4/4 passing).
- Migration verified both directions: forward creates all 3 tables/indexes (confirmed via `psql \d`), `node-pg-migrate down --count 1` cleanly drops them, re-applied forward for subsequent task work.
- `## Known Stubs` section present above; no entries, nothing blocking.

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-18*
