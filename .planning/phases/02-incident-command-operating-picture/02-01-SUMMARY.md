---
phase: 02-incident-command-operating-picture
plan: 01
subsystem: incident-ops
tags: [fastify, postgres, node-pg-migrate, vitest, transactional-writes, append-only-trigger]

# Dependency graph
requires:
  - phase: 01-platform-foundation-deployable-shell
    provides: "requirePermission RBAC preHandler (auth-org/rbac.ts), pool/query db client (db/client.ts), OPA sync pattern, append-only-trigger precedent (audit_log)"
provides:
  - "incidents / incident_command_roles / incident_timeline tables (exact TechArch 02b DDL + documented nullable location column)"
  - "TimelineService.append() — sole writer to incident_timeline"
  - "withTimelineTransaction() — BEGIN/COMMIT/ROLLBACK helper wrapping domain mutation + Timeline write as one atomic unit"
  - "POST/GET /api/v1/incidents, GET/PATCH /api/v1/incidents/{id}, GET /api/v1/incidents/{id}/timeline"
  - "incidents feature role_permissions seed rows (incident_commander/eoc_director full; planning_logistics_chief/field_responder view-only)"
affects: [02-02, 02-03, 02-04, "every Phase 2 frontend incident-workspace screen"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Single-writer service (TimelineService) + transaction helper (withTimelineTransaction) pattern for append-only child tables, mirroring 01-01's AuditService"
    - "BEFORE UPDATE/DELETE trigger for append-only enforcement in place of TechArch's REVOKE-based app_runtime role, since DEPLOY-01 gives the app exactly one DB role"

key-files:
  created:
    - backend/migrations/1700000000002_incident-ops-schema.js
    - backend/src/modules/incident-ops/timeline.ts
    - backend/src/modules/incident-ops/incidents.ts
    - backend/src/modules/incident-ops/routes.ts
    - backend/src/modules/incident-ops/incidents.test.ts
  modified:
    - backend/src/server.ts
    - backend/scripts/seed.ts

key-decisions:
  - "Added nullable incidents.location GEOGRAPHY(POINT,4326) column beyond TechArch 02b's literal DDL — F2's MapMarker interface and diamond-marker requirement need it, but S1.2's create-form has no location field, so it's optional and incidents without it are simply omitted from operating-picture markers until set"
  - "Append-only enforcement via BEFORE UPDATE/DELETE trigger (not TechArch's REVOKE UPDATE,DELETE FROM app_runtime) — identical pattern to Phase 1's audit_log trigger, required because DEPLOY-01 gives the app one DATABASE_URL role that must also run DDL"
  - "POST /api/v1/incidents's duplicate-confirmation flow uses a confirmed_duplicate:true request-body flag (not literally specified in TechArch's request body) since the FRD's 'warn, not block' validation rule requires SOME mechanism for the client to confirm-and-proceed on resubmission"
  - "Generic PATCH /api/v1/incidents/{id} is restricted to name/type/description and writes NO Timeline entry — severity/activation_level/status get their own dedicated endpoints in later 02-* plans with their own validation (NO_COMMANDER_ASSIGNED, closure confirmation), and only those are 'state-changing actions' per FRD's Timeline-write validation rule"

patterns-established:
  - "Incident list/detail shaping helpers (fetchIncidentListShape/fetchIncidentDetailShape) centralize the jurisdiction-join + active-commander-left-join query shape so list and detail endpoints stay consistent without duplicating SQL"

# Metrics
duration: 45min
completed: 2026-11-16
---

# Phase 2 Plan 01: Incident-Ops Foundation Summary

**Transactional incident create/list/detail/timeline-read backend with a single-writer TimelineService enforcing "every state change writes exactly one Timeline entry" as a real Postgres transaction, not an application convention.**

## Performance

- **Duration:** 45 min
- **Started:** 2026-11-16T12:09:00Z
- **Completed:** 2026-11-16T12:54:17Z
- **Tasks:** 3
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments
- Migrated the exact TechArch 02b incidents/incident_command_roles/incident_timeline DDL, plus one documented nullable `location` column addition for F2's map-marker requirement
- `TimelineService.append()` + `withTimelineTransaction()` make the FRD's "every state-changing action writes exactly one Timeline entry" invariant a database-transaction fact — if the Timeline insert fails, the incident row rolls back
- `incident_timeline` is immutable by construction (BEFORE UPDATE/DELETE trigger raises unconditionally), verified end-to-end against a running Postgres instance via a direct `UPDATE` in the integration test
- Full incident CRUD surface live: filterable list, transactional create with possible-duplicate warning (409 → confirm → 201), detail with command-role roster, metadata-only PATCH, newest-first timeline read
- Seeded `incidents` feature role_permissions for the 4 relevant Phase-2 personas idempotently

## Task Commits

Each task was committed atomically:

1. **Task 1: Incident-ops schema migration + TimelineService** - `7481191` (feat)
2. **Task 2: Incident CRUD routes (create/list/detail/timeline-read)** - `e6b032e` (feat)
3. **Task 3: Integration test — transactional creation, duplicate warning, timeline immutability** - `384b29d` (test)

**Plan metadata:** (pending — see final commit below)

## Files Created/Modified
- `backend/migrations/1700000000002_incident-ops-schema.js` - incidents/incident_command_roles/incident_timeline DDL + append-only trigger + indexes
- `backend/src/modules/incident-ops/timeline.ts` - TimelineService.append() + withTimelineTransaction() helper
- `backend/src/modules/incident-ops/incidents.ts` - POST/GET /api/v1/incidents, GET/PATCH /api/v1/incidents/{id}, GET /api/v1/incidents/{id}/timeline handlers
- `backend/src/modules/incident-ops/routes.ts` - Fastify plugin mounting incidents.ts
- `backend/src/modules/incident-ops/incidents.test.ts` - integration test (supertest + real Postgres) covering create/duplicate/filter/immutability
- `backend/src/server.ts` - registered incidentOpsRoutes
- `backend/scripts/seed.ts` - added incidents feature role_permissions rows for incident_commander/eoc_director (full) and planning_logistics_chief/field_responder (view-only)

## Decisions Made
- `location` column added beyond TechArch's literal DDL (nullable, documented in migration comments) — required by F2/FRD map-marker rendering, kept optional since the create-form has no location input
- Append-only trigger (not REVOKE-based role separation) for `incident_timeline`, matching Phase 1's `audit_log` precedent under DEPLOY-01's single-DB-role constraint
- `confirmed_duplicate: true` request-body flag added as the mechanism for the FRD's "warn, not block" duplicate-name rule, since TechArch's literal request body doesn't show one
- Generic incident PATCH scoped to name/type/description only, writing no Timeline entry — severity/activation/status changes are reserved for dedicated endpoints in later plans

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Migration file's SQL comments broke the JS template literal**
- **Found during:** Task 1 (running `npm run migrate` verification)
- **Issue:** The plan's literal DDL comments used backtick characters (`` ` ``) inside prose (e.g. `` `location:{lat,lng}` ``, `` `REVOKE UPDATE, DELETE ON incident_timeline FROM app_runtime` ``) while being embedded in a JS template literal (`` const UP_SQL = `...` ``) — the backtick prematurely terminated the template literal, causing node-pg-migrate's parser to fail with "Missing semicolon" at two separate lines.
- **Fix:** Replaced the markdown-style backtick-quoting in both SQL comment blocks with plain quotes/no-quoting (`location:{lat,lng}` → unquoted; `` `REVOKE UPDATE, DELETE ON incident_timeline FROM app_runtime` `` → double-quoted), preserving the documented rationale text verbatim otherwise.
- **Files modified:** backend/migrations/1700000000002_incident-ops-schema.js
- **Verification:** `npm run migrate` ran clean after both fixes; all 3 tables created with the append-only trigger confirmed live
- **Committed in:** 7481191 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Purely a syntax-safety fix required to make the plan's own literal DDL text embeddable in a JS migration file — no schema, behavior, or scope change. No scope creep.

## Issues Encountered
None — all three tasks' own `<verify>` commands passed as written (after the Rule 1 fix above), including the live immutability-trigger check against a running Postgres instance and the full existing 26-test backend suite (no regressions).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `incident-ops` module's schema, `TimelineService`, and incident CRUD are live and tested — unblocking 02-02 (command-role assignment + activation), 02-03/02-04 (operating-picture aggregation), and every Phase 2 frontend screen that needs `incidents`/`incident_timeline`.
- Documented gap carried forward (per this plan's own threat model, T-02-03): `GET /api/v1/incidents` does not yet apply jurisdiction-scope filtering to its results — every route is still RBAC-gated via `requirePermission('incidents','view')`, so this is a scoping gap, not an authorization gap. Flagged for the next plan touching this query.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

None found — scanned all created/modified files (migration, timeline.ts, incidents.ts, routes.ts, incidents.test.ts, server.ts, seed.ts) for TODO/FIXME/placeholder/not-implemented patterns; the only grep hit was the pre-existing `placeholders` SQL-parameter variable name in seed.ts, not a stub.

## Self-Check: PASSED

- All 5 created files confirmed present on disk (`[ -f ]` checks above)
- All 3 task commits (7481191, e6b032e, 384b29d) confirmed in `git log`
- Build check: `npm run build` (tsc -p tsconfig.json) → exit 0
- Full backend test suite (5 files, 26 tests, including this plan's 4) → all passed, zero regressions
- No blocking stubs found
