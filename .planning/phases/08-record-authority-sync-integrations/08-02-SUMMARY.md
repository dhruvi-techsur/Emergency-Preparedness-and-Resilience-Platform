---
phase: 08-record-authority-sync-integrations
plan: 02
subsystem: integration-gateway
tags: [facility-adapter, document-adapter, provenance, rbac, postgres, fastify, F17]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "document_links table (Phase 3's 1700000000007_plans-schema.js) — reused, not re-created, by this plan's document-adapter.ts"
  - phase: 07-operating-picture-read-overlays-weather-dispatch
    provides: "computeBackoff (webhook-delivery-worker.ts), the recognized-vs-unrecognized adapter trigger pattern (gis-adapter.ts/cad-adapter.ts), and the background_jobs job_type-isolation convention this plan follows exactly"
provides:
  - "facility_feed_config/facilities/document_system_config tables (migration 1700000000015)"
  - "facility-adapter.ts: fetchFacilityStatus/runFacilitySync/facilityRoutes/startFacilitySyncScheduler — a read-only facility/asset-status adapter stub that structurally discards inventory/maintenance/cost fields at the normalization boundary"
  - "document-adapter.ts: browseDocuments/importDocument/linkDocument/documentRoutes — a permission-aware SharePoint-class adapter stub whose operations execute under the requesting user's own simulated delegated permission set"
  - "GET /api/v1/operating-picture/facilities — new route feeding Plan 08-04's Operating Picture facility markers"
  - "GET /api/v1/integrations/documents/browse|import|link|health — reused by Plan 08-05's Plan Repository import/link UI"
affects: ["08-04-operating-picture-facility-markers", "08-05-plan-repository-document-import"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Allow-list object-literal normalization as a structural field-discarding mechanism (not merely an omission) — fetchFacilityStatus's raw-to-normalized copy never references the 3 forbidden vendor fields anywhere in its construction"
    - "Lazy per-user simulated delegated-permission seeding (SIMULATED_USER_DOCUMENT_ACCESS) — first browse/import/link call for a userId grants a fixed, deterministic 2-of-3 document split, giving every subsequent call a stable permission boundary to re-check against"

key-files:
  created:
    - backend/migrations/1700000000015_facility-document-schema.js
    - backend/src/modules/integration-gateway/facility-adapter.ts
    - backend/src/modules/integration-gateway/document-adapter.ts
    - backend/src/modules/integration-gateway/facility-document-adapter.test.ts
  modified:
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/server.ts
    - backend/scripts/seed.ts

key-decisions:
  - "Migration renumbered 1700000000013 -> 1700000000015 (both 1700000000013 and 1700000000014 were claimed by sibling plans — 07-02's cad-dispatch-schema.js and this same phase's own 08-01 eoc-cots-schema.js — by execution time)"
  - "facility_sync is a genuinely new background_jobs job_type value (ALTER'd via this migration), kept structurally distinct from cad_ingestion/feed_ingestion/sync_reconciliation per the established per-adapter job_type-isolation convention"
  - "document_links.plan_id left NULL on importDocument (standalone import without a plan association yet); linkDocument accepts an optional planId parameter for the case where it's already known at link time"

patterns-established:
  - "A second adapter module in the same plan follows the EXACT same recognized-vs-unrecognized / provenance-check-anyway / job_type-isolation shape as every prior integration-gateway adapter, with zero structural deviation"

# Metrics
duration: 25min
completed: 2026-11-20
---

# Phase 8 Plan 02: Facility & Document Adapter Stubs Summary

**Two independent F17 adapter contracts — a facility/asset-status stub that structurally discards inventory/maintenance/cost fields via an allow-list copy, and a permission-aware SharePoint-class document stub whose browse/import/link operations re-check the requesting user's own simulated delegated access set server-side on every call.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-20T11:57:00Z (approx.)
- **Completed:** 2026-11-20T12:22:25Z
- **Tasks:** 2
- **Files modified:** 7 (4 created, 3 modified)

## Accomplishments
- Shipped `facility_feed_config`/`facilities`/`document_system_config` tables via a new migration (document_links reused unchanged from Phase 3)
- `facility-adapter.ts`: deterministic `agency_erp` vendor stub whose `fetchFacilityStatus()` normalizes raw vendor responses (which deliberately include `inventory_count`/`maintenance_due_at`/`annual_cost`) into a strict 6-key `FacilityRecord` via an explicit allow-list object-literal copy — structurally incapable of leaking the forbidden fields
- `runFacilitySync()`: idempotent upsert into `facilities`, scoped exclusively to the new `facility_sync` `background_jobs` job_type; a failed sync never deletes prior rows (last-known positions kept, satisfying the outage-resilience rule) and flips `integration_health`'s `Facility/Asset Feed` row to `offline`
- New `GET /api/v1/operating-picture/facilities` route (feeding Plan 08-04), plus `GET /api/v1/integrations/facilities/status` and `.../health`
- `document-adapter.ts`: lazy per-user simulated delegated-permission store (`DOC-EOP-001`/`DOC-SOP-002` granted, `DOC-ANNEX-003` withheld, deterministically); `browseDocuments`/`importDocument`/`linkDocument` all filter/re-check server-side before any result leaves the module — never a client-side narrowing of an overbroad list
- `POST /api/v1/integrations/documents/:id/import` and `.../link` both map an out-of-grant attempt to `403 IMPORT_PERMISSION_DENIED` with F17's exact literal message
- 10-test integration suite proving field-discarding (structural key-set assertion), outage-resilience, and the permission boundary (both at the function level and via a real HTTP 403) end-to-end

## Task Commits

Each task was committed atomically:

1. **Task 1: Migration + facility-adapter.ts (field-discarding adapter, scheduled sync, routes)** - `c19d384` (feat)
2. **Task 2: seed.ts fixtures + integration tests (field-discarding, permission-boundary, outage-resilience)** - `34ecc4b` (test)

**Plan metadata:** (pending — this commit)

## Files Created/Modified
- `backend/migrations/1700000000015_facility-document-schema.js` - facility_feed_config/facilities/document_system_config DDL + background_jobs_job_type_check ALTER adding 'facility_sync'
- `backend/src/modules/integration-gateway/facility-adapter.ts` - fetchFacilityStatus/runFacilitySync/facilityRoutes/startFacilitySyncScheduler
- `backend/src/modules/integration-gateway/document-adapter.ts` - browseDocuments/importDocument/linkDocument/documentRoutes
- `backend/src/modules/integration-gateway/facility-document-adapter.test.ts` - 10 integration tests
- `backend/src/modules/integration-gateway/routes.ts` - wired facilityRoutes/documentRoutes (append-only)
- `backend/src/server.ts` - wired startFacilitySyncScheduler (graceful-degradation try/catch)
- `backend/scripts/seed.ts` - one runFacilitySync() call after existing EOC COTS sync call

## Decisions Made
- Migration renumbered from the plan's stale `1700000000013` to `1700000000015`: both `1700000000013` (07-02's `cad-dispatch-schema.js`) and `1700000000014` (this same phase's own 08-01 `eoc-cots-schema.js`) were already claimed by the time this plan executed. No DDL content change, same cross-plan renumbering precedent as every prior phase.
- `facility_sync` added as a genuinely new `background_jobs.job_type` CHECK-constraint value via this migration's ALTER — confirmed the real constraint name (`background_jobs_job_type_check`) against the live compose-stack database before writing the ALTER, and confirmed 08-01's `eoc-cots-schema.js` migration (which reused the pre-existing `sync_reconciliation` value) never touched this constraint, so this migration's restated full list is accurate.
- `document_links.plan_id` is left `NULL` on `importDocument` (standalone import, no plan association yet — matches Plan Repository's standalone-import flow); `linkDocument` accepts an optional `planId` parameter for the case where it's already known at link time.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Restored 08-01's `eocCotsRoutes` registration in routes.ts, clobbered by a parallel-plan race**
- **Found during:** Task 1 (running the full backend test suite after wiring facility/document routes)
- **Issue:** This plan's wave-1 sibling, Plan 08-01, committed its own change to `backend/src/modules/integration-gateway/routes.ts` (adding `eocCotsRoutes`) between this plan's initial `read` of that file and its `edit` call. Because the edit replaced the exact block containing the then-current CAD-routes-and-below content, it silently overwrote 08-01's `eocCotsRoutes` import and registration with this plan's own facility/document routes instead of appending alongside them. The same race touched `server.ts` and `seed.ts`, but both of those edits were pure appends (new import + new try/catch block; new import + new seed call) that did not overlap with 08-01's own additions to those files, so only `routes.ts` was actually affected.
- **Fix:** Re-added `import { eocCotsRoutes } from './eoc-cots-adapter.js'` and `await app.register(eocCotsRoutes)` alongside this plan's own `facilityRoutes`/`documentRoutes` registrations, preserving 08-01's original comment and ordering.
- **Files modified:** backend/src/modules/integration-gateway/routes.ts
- **Verification:** Full backend suite re-run after the fix: 21 test files, 138 tests, all passing (the 3 `eoc-cots-adapter.test.ts` failures that surfaced before the fix — `GET .../eoc-cots/health` and `.../conflicts` returning 404, and the outbound POST returning 404 instead of 400 — all resolved once `eocCotsRoutes` was re-registered).
- **Committed in:** c19d384 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug, caused by a cross-plan file-edit race rather than this plan's own logic).
**Impact on plan:** The fix was necessary to avoid silently breaking a sibling plan's already-landed routes; no scope creep — the fix restores exactly what 08-01 had committed, with no further changes to eoc-cots-adapter.ts itself.

## Issues Encountered
None beyond the routes.ts race documented above as a deviation.

## User Setup Required
None - no external service configuration required (both adapters are deterministic stubs with no real vendor credentials).

## Next Phase Readiness
- Plan 08-04 can now consume `GET /api/v1/operating-picture/facilities` directly for its Operating Picture facility markers.
- Plan 08-05 can now consume `GET/POST /api/v1/integrations/documents/*` for its Plan Repository import/link UI.
- Plan 08-06 (document_link_sync job_type, wave 3, depends_on 08-02+08-05) should re-verify the full `background_jobs_job_type_check` list at its own execution time — it now includes this plan's `facility_sync` in addition to every prior value.
- No blockers.

## Known Stubs

None found. Both adapters in this plan are INTENTIONALLY deterministic stubs per the plan's own design (no real ERP/SharePoint vendor credential exists in this MVP sandbox) — this is documented, in-scope stub behavior, not an incomplete implementation. Scanned all created/modified files for TODO/FIXME/placeholder/not-implemented markers: the one grep hit (`seed.ts`'s pre-existing `placeholders` SQL-parameter-list variable name) is unrelated to this plan's scope.

## Self-Check: PASSED

- All 5 key files confirmed present on disk via `[ -f ]`.
- Both task commits (`c19d384`, `34ecc4b`) confirmed present via `git log`.
- Build check: `cd backend && npm run build` → exit 0 (tsc -p tsconfig.json, zero errors).
- Seed check: `cd backend && npm run seed` → exit 0, logged "Facility sync: populated facilities + Facility/Asset Feed integration_health row."
- Full backend suite: `cd backend && npx vitest run` → 21 test files, 138 tests, all passing, zero regression.

---
*Phase: 08-record-authority-sync-integrations*
*Completed: 2026-11-20*
