---
phase: 02
status: issues_found
blockers: 1
warnings: 3
files_reviewed: 47
files_reviewed_list:
  - backend/keycloak/epmp-realm.json
  - backend/migrations/1700000000002_incident-ops-schema.js
  - backend/migrations/1700000000003_integration-geo-schema.js
  - backend/package.json
  - backend/scripts/seed.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/incident-ops/activation.test.ts
  - backend/src/modules/incident-ops/activation.ts
  - backend/src/modules/incident-ops/closure.ts
  - backend/src/modules/incident-ops/command-roles.ts
  - backend/src/modules/incident-ops/incidents.test.ts
  - backend/src/modules/incident-ops/incidents.ts
  - backend/src/modules/incident-ops/operating-picture.test.ts
  - backend/src/modules/incident-ops/operating-picture.ts
  - backend/src/modules/incident-ops/routes.ts
  - backend/src/modules/incident-ops/timeline.ts
  - backend/src/modules/integration-gateway/gis-adapter.ts
  - backend/src/modules/integration-gateway/routes.ts
  - backend/src/server.ts
  - frontend/app/e2e/helpers/sign-in.ts
  - frontend/app/e2e/incident-list-create.spec.ts
  - frontend/app/e2e/incident-workspace.spec.ts
  - frontend/app/e2e/operating-picture.spec.ts
  - frontend/app/package.json
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/incidents/ActivationModal.tsx
  - frontend/app/src/pages/incidents/CommandRoleModal.tsx
  - frontend/app/src/pages/incidents/CreateIncident.tsx
  - frontend/app/src/pages/incidents/IncidentList.tsx
  - frontend/app/src/pages/incidents/IncidentWorkspace.css
  - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
  - frontend/app/src/pages/operating-picture/OperatingPicture.css
  - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
  - frontend/design-system/src/index.ts
  - frontend/design-system/src/maps/LayerPanel.css
  - frontend/design-system/src/maps/LayerPanel.tsx
  - frontend/design-system/src/maps/MapCanvas.css
  - frontend/design-system/src/maps/MapCanvas.tsx
  - frontend/design-system/src/maps/MapControls.css
  - frontend/design-system/src/maps/MapControls.tsx
  - frontend/design-system/src/maps/MapLegend.css
  - frontend/design-system/src/maps/MapLegend.tsx
  - frontend/design-system/src/maps/MapPopup.css
  - frontend/design-system/src/maps/MapPopup.tsx
  - frontend/design-system/src/product-patterns/Provenance.css
  - frontend/design-system/src/product-patterns/Provenance.tsx
  - frontend/design-system/test/maps.test.tsx
reviewed_at: 2026-11-16T14:47:20Z
iteration: 1
---

# Phase 2 Code Review

## BLOCKERs

### B1: `IncidentWorkspace` never distinguishes a failed/404 incident fetch from "still loading" — a non-existent or inaccessible incident spins forever
- **File:** `frontend/app/src/pages/incidents/IncidentWorkspace.tsx:146-148`
- **Category:** bug
- **Evidence:**
  ```tsx
  if (incidentQuery.isLoading || !incidentQuery.data) {
    return <div className="ep-incident-workspace" aria-busy="true" />;
  }
  ```
  `useQuery`'s `isLoading` is `true` only during the *first* fetch attempt; once that request settles (success or error), `isLoading` becomes `false`. When `GET /api/v1/incidents/{id}` returns `404 INCIDENT_NOT_FOUND` (a route this same plan wires — `incidents.ts:333-338`), `incidentQuery.data` stays `undefined` and `incidentQuery.isLoading` is `false`, so the condition `incidentQuery.isLoading || !incidentQuery.data` is still `true` — the component renders the bare `aria-busy="true"` div **forever**, with no error message, no retry action, and no indication to the user that the incident doesn't exist or isn't accessible. This is reachable through ordinary navigation: a stale bookmark/deep-link to a closed-and-purged incident, a typo'd UUID, or (given the jurisdiction-scope gap in W1 below) an incident outside the caller's own `jurisdiction_scope`. `incidents.test.ts`/`activation.test.ts` never exercise this path from the frontend; no e2e spec visits a nonexistent `/incidents/:id`.
  Every sibling screen in this same phase (`IncidentList`, `CreateIncident`) wires `isError`/`error` into the `Table`'s own error-surfacing machinery; `IncidentWorkspace` is the one screen in this plan's output that has no `isError` branch at all for its primary data fetch.
- **Fix direction:** Add an `incidentQuery.isError` branch before the loading check that renders an `Alert`/`EmptyState` with the `404`'s own message (reuse `INCIDENT_NOT_FOUND`'s text via `ApiRequestError.body.message`) and a way back to `/incidents`, mirroring the pattern `IncidentList.tsx` already uses for its own fetch.

## WARNINGs

### W1: Every incident-ops route except the operating-picture endpoints lacks jurisdiction-scope filtering — any authenticated `incidents:view` user can read/mutate any incident in any jurisdiction
- **File:** `backend/src/modules/incident-ops/incidents.ts` (all routes), `activation.ts`, `command-roles.ts`, `closure.ts`
- **Evidence:** `fetchIncidentDetailShape`/`fetchIncidentListShape` (incidents.ts:96-129), the `GET /api/v1/incidents` list query (incidents.ts:235-248), the PATCH route (incidents.ts:358), and every mutation route in `activation.ts`/`command-roles.ts`/`closure.ts` select/update by `id` alone with zero reference to `req.epmpUser.jurisdiction_scope`. Only `operating-picture.ts`'s two routes apply `jurisdiction_id = ANY(req.epmpUser.jurisdiction_scope)`. The migration (`1700000000002_incident-ops-schema.js:35`) runs `ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;` per TechArch 02-data-model.md §3.4, but no `CREATE POLICY` statement exists anywhere in the migrations, and no code anywhere in the diff ever issues `SET LOCAL app.jurisdiction_scope` — so the DB-layer defense-in-depth TechArch specifies as the second of its explicit "two-layer enforcement" (04-security.md §5.2) is entirely absent, and the gap is not merely an app-layer omission with a DB backstop: there is no backstop. This is a documented, carried-forward gap (T-02-03) in every one of this phase's SUMMARY.md files, correctly re-scoped by 02-03's summary to "the plain incidents-list endpoint only" — but that re-scoping is itself inaccurate: the gap is present on every incident-ops route this phase ships except the two `operating-picture.ts` routes, including the mutating `POST .../activation`, `.../command-roles`, and `.../closure` endpoints, which let any role holding `incidents:edit` (not just `incidents:view`) change activation level, (re)assign command roles, or close an incident belonging to a jurisdiction entirely outside their own `jurisdiction_scope`.
- **Fix direction:** Add `AND jurisdiction_id = ANY($n)` (bound to `req.epmpUser.jurisdiction_scope`) to every incident-scoped SELECT/UPDATE in `incidents.ts`, `activation.ts`, `command-roles.ts`, and `closure.ts`, and/or implement the `CREATE POLICY ... USING (jurisdiction_id = ANY(current_setting('app.jurisdiction_scope')::UUID[]))` pattern TechArch specifies, wiring `SET LOCAL app.jurisdiction_scope` immediately after `rbac.ts` resolves the caller. Given this is a cross-cutting correctness gap already flagged four times across this phase's own plan threat-models, the next plan touching any of these files should close it rather than re-deferring again.

### W2: Incident closure (FRD F1 Process step 7) is fully implemented and tested on the backend but unreachable from any Phase 2 screen
- **File:** `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` (absence), `backend/src/modules/incident-ops/closure.ts`
- **Evidence:** `POST /api/v1/incidents/{id}/closure` is implemented, transactional, and covered by `activation.test.ts`'s backend integration test, but `grep -rn "closure" frontend/app/src/ frontend/app/e2e/` returns zero matches anywhere in the Phase 2 frontend diff — no button, no modal, no route calls it. FRD F01's Process step 7 ("a user with appropriate role sets status to `Closed` via a Modal confirmation stating the consequence") is explicitly part of F1's documented user flow, and 02-02-SUMMARY.md's own "Next Phase Readiness" section asserts "unblocking 02-05/02-06 (frontend Incident Workspace, which calls these three endpoints directly)" — but the Workspace only ever calls `activation` and `command-roles`, never `closure`. The Roadmap's 5 listed Phase 2 success criteria don't explicitly name closure, so this does not block the phase's stated gate, but it is a genuine, silent functional gap between what the SUMMARY claims was delivered and what the UI actually exposes.
- **Fix direction:** Add a "Close incident" action (e.g., a `Button` in `IncidentWorkspace`'s `PageHeader` or activation control area) that opens a `Modal` confirming the consequence ("closes all open tasks to Overdue unless completed") and calls `POST /api/v1/incidents/{id}/closure` with `{confirmed: true}`, following the same server-surfaced-error pattern `ActivationModal` already establishes.

### W3: `fetchGisFeatures` bbox parsing has no NaN/shape guard — a malformed `bbox` query param silently produces `NaN` coordinates instead of a clear error
- **File:** `backend/src/modules/incident-ops/operating-picture.ts:116-119`
- **Evidence:**
  ```ts
  const bboxParam = req.query.bbox;
  const bbox: [number, number, number, number] = bboxParam
    ? (bboxParam.split(',').map(Number) as [number, number, number, number])
    : [-180, -90, 180, 90];
  const gisResponse = await fetchGisFeatures('agency-base-boundary', bbox);
  ```
  If `bbox` is supplied but malformed (e.g. `bbox=abc`, `bbox=1,2`, or `bbox=1,2,3,4,5`), `.split(',').map(Number)` produces `NaN` entries or a shorter/longer array silently cast via `as`. `fetchGisFeatures` (gis-adapter.ts:35-56) then builds a `Polygon` geometry from these `NaN`/missing values with no validation, and `recordFeedStatus` records `'ok'` for a geometry that is actually invalid GeoJSON — this is caught by the outer `try/catch` only if `fetchGisFeatures` itself throws, which it does not for this input (no provenance fields are missing). The response still returns 200 with `base_layer_source` showing the real "agency GIS" success string even though the underlying polygon is malformed, masking rather than surfacing the bad input. This is a non-critical path (MapCanvas never visualizes the base-layer polygon's geometry directly in Phase 2's implementation, and the field is never user-facing today), but it degrades the provenance guarantee's reliability should a later phase start rendering `features` directly.
- **Fix direction:** Validate `bbox.length === 4 && bbox.every(Number.isFinite)` before calling `fetchGisFeatures`; on failure, fall through to the schematic default path exactly as the existing `catch` block already does for adapter failures, rather than passing malformed data through.

## Cross-file seams checked

- `backend/src/modules/incident-ops/routes.ts` registrations ↔ `server.ts`'s `incidentOpsRoutes` import — OK
- `backend/src/modules/integration-gateway/routes.ts`'s `gisHealthRoutes` import ↔ `gis-adapter.ts` export — OK
- `incidents.ts` exports (`fetchIncidentDetailShape`, `INCIDENT_NOT_FOUND`, `ActivationLevel`) ↔ `activation.ts`/`closure.ts` imports — OK, signatures match
- `operating-picture.ts` ↔ `gis-adapter.ts`'s `fetchGisFeatures(layerId, bbox)` call signature — OK
- Frontend `apiGet`/`apiPost` call sites (`/api/v1/jurisdictions`, `/api/v1/incidents`, `/api/v1/incidents/personnel`, `/api/v1/incidents/{id}/activation`, `/api/v1/incidents/{id}/command-roles`, `/api/v1/operating-picture/markers`, `/api/v1/operating-picture/layers`) ↔ backend route declarations — OK, all present and gated as the frontend expects
- `CommandRoleModal`/`ActivationModal` props ↔ `IncidentWorkspace`'s usage (`currentAssignee`, `incidentId`, `roleTitle`, `currentLevel`) — OK
- `@epmp/design-system` exports (`MapCanvas`, `MapControls`, `MapLegend`, `MapPopup`, `LayerPanel`, `Provenance` + their type exports) ↔ `OperatingPicture.tsx` imports — OK, all present in `index.ts`
- Severity→`BadgeTone` mapping consistency across `IncidentList.tsx`/`IncidentWorkspace.tsx`/`OperatingPicture.tsx`/backend `severityToTone` — OK, identical in all four places
- `Timeline`/`Tabs` component `TimelineTone`/tab-id/aria-controls contracts ↔ `IncidentWorkspace.tsx`'s tab panel ids — OK
- `GET /api/v1/auth/sso/callback` c-gap from contract-scan — verified false positive: route exists (`auth-org/routes.ts:71`), registered (`server.ts:32`), tested (`routes.test.ts:160`), and both route + frontend caller predate Phase 2 (commit `0b14e1c` boundary) — not carried forward.
- `GET /api/v1/me/nav-config`'s new "Monitor"/"Activate" nav groups ↔ `frontend/app/src/main.tsx`'s routed paths (`/operating-picture`, `/incidents`) — OK
