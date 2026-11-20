---
phase: 7
status: issues_found
blockers: 0
warnings: 2
files_reviewed: 15
files_reviewed_list:
  - backend/migrations/1700000000012_hazard-layers-schema.js
  - backend/migrations/1700000000013_cad-dispatch-schema.js
  - backend/scripts/seed.ts
  - backend/src/modules/incident-ops/incidents.test.ts
  - backend/src/modules/incident-ops/incidents.ts
  - backend/src/modules/incident-ops/operating-picture.test.ts
  - backend/src/modules/incident-ops/operating-picture.ts
  - backend/src/modules/integration-gateway/cad-adapter.ts
  - backend/src/modules/integration-gateway/hazard-feed-adapter.ts
  - backend/src/modules/integration-gateway/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/incident-workspace-dispatch-status.spec.ts
  - frontend/app/e2e/operating-picture-hazard-layers.spec.ts
  - frontend/app/src/pages/admin/IntegrationHealth.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
reviewed_at: 2026-11-20T10:38:11Z
iteration: 1
---

# Phase 7 Code Review

## BLOCKERs

None found.

## WARNINGs

### W1: `POST /api/v1/hazard-layers/:id/verify` silently succeeds (204) for a non-existent hazard-layer id
- **File:** `backend/src/modules/integration-gateway/hazard-feed-adapter.ts:233-262`
- **Evidence:** The handler checks caller-identity equality (`verified_by !== req.epmpUser!.id` → 403) but never checks whether the `UPDATE hazard_layers SET verified = true ... WHERE id = $2` actually matched a row. `query()` (`backend/src/db/client.ts`) returns `result.rows`, discarding `rowCount`, so there's no way for this handler to detect a zero-row UPDATE even if it tried — and it doesn't try. A caller hitting this route with a mistyped/stale/already-deleted `id` and their own user id gets `204 No Content` exactly as if the verification succeeded, with no `hazard_layers` row actually changed. This is a confirmable-not-fatal gap (no data corruption, no security impact — the action silently no-ops) but it diverges from the FRD's implicit expectation that a verification action be unambiguous, and from this codebase's own `INCIDENT_NOT_FOUND`-style precedent of confirming existence before mutating.
- **Fix direction:** Either `SELECT id FROM hazard_layers WHERE id = $1` first (same existence-guard convention `fetchIncidentForMutation` establishes) and 404 if absent, or inspect the raw `pg` `rowCount` from the UPDATE and 404 on zero.

### W2: Playwright spec imports backend business-logic module directly from the frontend package, a new pattern with no import-boundary enforcement
- **File:** `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts:4`
- **Evidence:** `import { fetchCadDispatchEvents } from '../../../backend/src/modules/integration-gateway/cad-adapter';` pulls in `cad-adapter.ts`'s full transitive dependency graph (`fastify` types, `pg`, the shared `db/client.ts` pool, `webhook-delivery-worker.ts`) into a test file that lives in `frontend/app`'s own workspace package — `frontend/app/package.json` declares no `fastify` dependency at all (confirmed: `grep -n '"fastify"' frontend/app/package.json` returns nothing); this resolves today only because npm workspaces hoist `fastify`/`jose`/`nats` to the monorepo root `node_modules`, which every other e2e spec in this codebase has never relied on (every other spec using `pg.Pool` for fixture access imports only the `pg` driver itself, which frontend/app *does* declare as its own devDependency). I confirmed this actually runs correctly in this sandbox (ran the full spec live against the compose stack: 4/4 pass once the shared CAD fixture link — independently destabilized by a prior backend test run, a pre-existing/documented cross-plan interaction — was restored), so this is not a current failure, but it is a fragile, undeclared cross-package coupling: a future change to `frontend/app/package.json`'s dependency resolution (e.g. disabling hoisting, or `npm ci` with stricter workspace isolation) would break this spec with no compile-time signal in `frontend/app` itself (its own `tsc --noEmit` passes clean today only because `moduleResolution: Bundler` doesn't verify package-level dependency declarations, just path resolution).
- **Fix direction:** Prefer re-exercising the adapter's failure path via an HTTP call against a running backend (as `operating-picture.spec.ts` does for the analogous GIS-adapter forced-failure case) rather than a direct cross-package source import, or add `fastify`/the backend package as an explicit (dev)dependency of `frontend/app` so the coupling is declared rather than incidental.

## Cross-file seams checked

- `backend/src/modules/integration-gateway/routes.ts` → `hazardFeedRoutes`/`cadRoutes` exports: both registered alongside `gisHealthRoutes`, append-only, confirmed in file — OK
- `backend/src/server.ts` → `startHazardFeedIngestionScheduler`/`startCadIngestionScheduler`: both called inside their own graceful-degradation try/catch blocks, matching existing scheduler-start convention — OK
- `backend/src/modules/incident-ops/operating-picture.ts` → `syncHazardLayersFromEvents` (imported from `hazard-feed-adapter.ts`): called at top of `GET /layers` handler, wrapped in empty try/catch per plan's own must-have ("never blocks the response") — OK
- `backend/src/modules/incident-ops/operating-picture.ts`'s `GET /layers` hazard-aggregation query → `hazard_feed_config`/`hazard_feed_events`/`hazard_layers` schema (Phase 6 + this phase's migration): column names (`feed_id`, `feed_name`, `issued_at`, `hazard_feed_event_id`, `verified`) all match the actual DDL — OK
- `backend/src/modules/incident-ops/incidents.ts`'s `GET /:id/dispatch-status` → `cad_dispatch_events` schema (this phase's migration): `status`/`unit_ids`/`source`/`updated_at`/`linked_incident_id` column names match the DDL exactly — OK
- `frontend/app/src/pages/operating-picture/OperatingPicture.tsx`'s `ApiLayer` interface → backend `GET /operating-picture/layers` response shape (`id`/`label`/`source`/`as_of`/`verified`/`count`/`checked`): field-for-field match, confirmed by direct read of both sides — OK (matches 07-03-SUMMARY's own claim, independently verified here)
- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx`'s `DispatchStatusResponse` interface → backend `GET /incidents/:id/dispatch-status` response shape (`linked`/`status`/`unit_ids`/`source`/`updated_at`): matches exactly, including the `linked:false`-means-no-other-fields contract — OK
- `backend/src/modules/integration-gateway/hazard-feed-adapter.ts`'s `recordFeedHealth` / `backend/src/modules/integration-gateway/cad-adapter.ts`'s `recordCadHealth` → shared `integration_health` table (`system_name` UNIQUE constraint from `01-01`'s migration): both UPSERTs key on `system_name` correctly, `record_authority` is always the vendor name (`'NOAA'`/`'NWS'`/`'USGS'`/`'CAD/911'`), never `'EPMP'` — confirmed live against the running database (`SELECT system_name, record_authority ... FROM integration_health`) — OK
- `background_jobs.job_type` CHECK constraint (`1700000000013`'s ALTER) → both adapters' bookkeeping queries (`WHERE job_type = 'feed_ingestion'` vs `WHERE job_type = 'cad_ingestion'`): structurally distinct, confirmed via grep and via the cross-adapter integration tests in both `operating-picture.test.ts` and `incidents.test.ts`, both of which pass live — OK
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` → `backend/src/modules/auth-org/admin-integration-health.ts` (GET /admin/integration-health, pre-existing Phase 1 route, not modified this phase): plain `SELECT *` with no `system_name` filter, confirmed generic over the new hazard-feed/CAD rows — OK
- `c-gap` (scanner finding) `SignInCallback.tsx:65` GET vs backend POST route mismatch: independently verified via `git log` that `SignInCallback.tsx` was last touched by the pre-phase-7 "docs: phase 7 status → In Progress" commit (not by any of phase 7's 4 plans), and independently confirmed the backend route at `auth-org/routes.ts:72` is a `POST` handler while the frontend code at line 65 calls `fetch(..., { method: 'POST' })` — the scanner's "GET" characterization does not match the actual code on either side. This is a pre-existing scanner false-positive unrelated to phase 7's diff, not a phase-7 regression; not counted as a phase-7 BLOCKER per the prompt's exception clause.
- `c-adv` (scanner advisory) `api-client.ts:121` dynamic path `GET /field-reports/${id}/photos`: independently confirmed `api-client.ts` was also last touched by the same pre-phase-7 docs commit — out of this phase's diff entirely, no action needed.
- `cad-adapter.ts`'s `CadDispatchEvent.location` field → `IncidentWorkspace.tsx`'s dispatch-status Card: the frontend never reads `location` from the dispatch-status response (backend's `GET /dispatch-status` route doesn't expose it either, only `status`/`unit_ids`/`source`/`updated_at`) — consistent, no dangling consumer expectation — OK
