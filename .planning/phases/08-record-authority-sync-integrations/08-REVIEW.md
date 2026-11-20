---
phase: 8
status: issues_found
blockers: 1
warnings: 1
files_reviewed: 24
files_reviewed_list:
  - backend/migrations/1700000000014_eoc-cots-schema.js
  - backend/migrations/1700000000015_facility-document-schema.js
  - backend/migrations/1700000000016_document-links-extend-flagged-state.js
  - backend/scripts/seed.ts
  - backend/src/modules/integration-gateway/document-adapter.ts
  - backend/src/modules/integration-gateway/eoc-cots-adapter.test.ts
  - backend/src/modules/integration-gateway/eoc-cots-adapter.ts
  - backend/src/modules/integration-gateway/eoc-cots-conflicts.test.ts
  - backend/src/modules/integration-gateway/eoc-cots-conflicts.ts
  - backend/src/modules/integration-gateway/facility-adapter.ts
  - backend/src/modules/integration-gateway/facility-document-adapter.test.ts
  - backend/src/modules/integration-gateway/routes.ts
  - backend/src/modules/plans/plans.test.ts
  - backend/src/modules/plans/plans.ts
  - backend/src/server.ts
  - frontend/app/e2e/eoc-cots-conflict-resolution.spec.ts
  - frontend/app/e2e/operating-picture-facility-markers.spec.ts
  - frontend/app/e2e/plan-document-import-link.spec.ts
  - frontend/app/e2e/plan-live-link-flagged-review.spec.ts
  - frontend/app/src/pages/admin/IntegrationHealth.tsx
  - frontend/app/src/pages/operating-picture/OperatingPicture.tsx
  - frontend/app/src/pages/plans/ImportDocumentModal.tsx
  - frontend/app/src/pages/plans/PlanDetail.tsx
  - frontend/app/src/pages/plans/PlanRepository.tsx
reviewed_at: 2026-11-20T12:56:40Z
iteration: 1
---

# Phase 8 Code Review

## BLOCKERs

### B1: runEocCotsSync() inserts a brand-new, unresolved duplicate `eoc_cots_conflicts` row for the same external record on every scheduled tick, so a resolved conflict silently reappears 5 minutes later and the conflict table grows unbounded
- **File:** backend/src/modules/integration-gateway/eoc-cots-adapter.ts:285-296
- **Category:** bug
- **Evidence:**
  ```ts
  if (record.external_id === KNOWN_CONFLICT_EXTERNAL_ID) {
    await query(
      `INSERT INTO eoc_cots_conflicts (config_id, record_type, epmp_record_id, epmp_value, external_value)
       VALUES ($1, $2, gen_random_uuid(), $3, $4)`,
      [configId, type, JSON.stringify({...}), JSON.stringify(record.payload)],
    );
    conflicts += 1;
  }
  ```
  There is no existence/dedup check (no `WHERE NOT EXISTS (... AND resolution IS NULL)`, no `ON CONFLICT` guard) before this INSERT, unlike every comparable adapter write in this codebase — `facility-adapter.ts`'s `facilities` upsert uses `ON CONFLICT (external_facility_id, source) DO UPDATE`, and `cad-adapter.ts`'s `cad_dispatch_events` upsert uses `ON CONFLICT (config_id, external_event_id) DO UPDATE` precisely to avoid this class of duplication.

  `fetchExchangeRecords('incident')` (same file, lines 97-126) is a deterministic stub that **always** returns the fixed `EOC-CONFLICT-001` record on every call. `startEocCotsSyncScheduler()` (line 520) is registered unconditionally in `server.ts` (line 152) and fires `runEocCotsSync()` every 300,000ms (5 minutes) in the running server — not just in tests. `seed.ts` also declares `'incident'` as EPMP-authoritative (line ~2034), which is exactly the condition (`authority === 'EPMP'`) that routes this record into the conflict-insert branch rather than the plain sync-log branch.

  Concrete failing sequence: at t=0 the scheduler runs and inserts conflict row R1 for `EOC-CONFLICT-001`. An admin resolves R1 via `POST .../conflicts/:id/resolve` (the eoc-cots-conflicts.ts route, built correctly and non-idempotent **per row**). At t=5min the scheduler ticks again, `fetchExchangeRecords` returns the identical `EOC-CONFLICT-001` record again, and since there is no check for an already-existing unresolved (or even already-resolved) row for this external_id, a **brand-new** row R2 is inserted with `resolution = NULL`. `GET /api/v1/integrations/eoc-cots/conflicts` (which filters `WHERE resolution IS NULL`) now shows R2 as a fresh, never-before-seen unresolved conflict — the admin's resolution of R1 is invisible to the UI/API and the "conflict" reappears forever, every 5 minutes, unbounded, for the lifetime of the server. This directly undermines F13's explicit-resolution workflow: a human can never actually make this conflict "go away" — they must re-resolve an apparently-identical conflict every single tick, and the `eoc_cots_conflicts` table grows one new row every 5 minutes indefinitely.

  Neither `eoc-cots-adapter.test.ts` nor `eoc-cots-conflicts.test.ts` catches this: test #4 in `eoc-cots-adapter.test.ts` calls `runEocCotsSync()` more than once across the suite and only asserts `items.length > 0` / finds *a* matching row by `record_type`, never asserting there is exactly one unresolved conflict per external record.
- **Fix direction:** Before inserting into `eoc_cots_conflicts`, check for an existing row with the same `(config_id, record_type, epmp_record_id-equivalent-key)` that is still unresolved (or has already been resolved for this exact external value) and skip/update instead of blindly inserting — e.g. a `WHERE NOT EXISTS (SELECT 1 FROM eoc_cots_conflicts WHERE config_id = $1 AND record_type = $2 AND resolution IS NULL)` guard, or a real natural key (e.g. `external_id`) with an `ON CONFLICT ... DO NOTHING`/`DO UPDATE` clause, mirroring the dedup pattern already established by `facility-adapter.ts` and `cad-adapter.ts` in this same module.

## WARNINGs

### W1: `document_links.permission_status` can never actually become `'revoked'` in this build — the entire "Access removed" detection/UI path is dead, untested code
- **File:** backend/src/modules/integration-gateway/document-adapter.ts:47-56, 161-196
- **Evidence:** `SIMULATED_USER_DOCUMENT_ACCESS[userId]` is lazily seeded once per user to the fixed constant `GRANTED_DOCUMENT_IDS = ['DOC-EOP-001', 'DOC-SOP-002']` (line 49, 52-54) and is never mutated, shrunk, or reassigned anywhere else in the file (confirmed via grep across the whole module — the only write is the one-time lazy-seed). `checkAndPersistPermission`'s `stillGranted` check (line 168: `accessSet.includes(row.external_document_id)`) can therefore never be false for any row that was legitimately created via `importDocument`/`linkDocument` (both of which only ever insert a `document_links` row *after* confirming the same access set already contains that `external_document_id`). The `permission_status = 'revoked'` write path (line 177-181), `runDocumentLinkSync`'s `permission_revoked` counter (line 225/242), `revalidateDocumentLinkPermission`'s `'revoked'` return value, and `PlanDetail.tsx`'s entire "Access removed" `Alert` (filtering `permission_status === 'revoked'`, PlanDetail.tsx:344-351) are consequently unreachable in this codebase as shipped — no seed fixture, test, or Playwright spec exercises or could exercise this branch (confirmed via grep: zero occurrences of `'revoked'`/`permission_status` assertions in any phase 8 test or e2e file). This mirrors the FRD requirement ("a permission downgrade at the source immediately restricts the EPMP-side link's visibility") being implemented as inert code with no reachable trigger, rather than a deliberately-scoped-out stub — unlike the facility/EOC-COTS adapters' failure triggers, which are documented, explicit, and test-covered (`simulateFailure`, `FORCE_AUTH_FAILURE`).
- **Fix direction:** Add a deterministic test-reachable trigger for a simulated permission downgrade (mirroring every other adapter's `simulateFailure`-style pattern in this same phase) — e.g. a fixed external_document_id or an explicit test-only parameter that removes an id from a user's access set — so the revocation detection and the "Access removed" UI path are genuinely exercised by at least one test, not merely theoretically correct dead code.

## Cross-file seams checked
- `frontend/app/src/pages/SignInCallback.tsx:65` (contract-scan `c-gap`) ↔ `backend/src/modules/auth-org/routes.ts:72` — verified-false-positive: SignInCallback.tsx is untouched by this phase's diff (last modified before wave 1 began, no 08-0x commit touches it), and the call is a `POST` matching the backend's `app.post(...)` route exactly, not the `GET` the scanner inferred.
- `frontend/app/src/lib/api-client.ts:121` (contract-scan `c-adv`, dynamic path) — pre-existing code (`uploadFieldReportPhoto`, Phase 5), unrelated to and untouched by this phase's diff — advisory only, no action needed.
- `routes.ts` ↔ `eoc-cots-adapter.ts`/`eoc-cots-conflicts.ts`/`facility-adapter.ts`/`document-adapter.ts` exports — all imports (`eocCotsRoutes`, `eocCotsConflictsRoutes` default export, `facilityRoutes`, `documentRoutes`) match their respective module's actual export shape. OK.
- `ImportDocumentModal.tsx` POST `/api/v1/integrations/documents/${id}/import|link` ↔ `document-adapter.ts`'s `app.post('/api/v1/integrations/documents/:id/import'|'/:id/link', ...)` — OK.
- `PlanDetail.tsx` PATCH `/api/v1/plans/${id}/document-links/${linkId}/acknowledge` ↔ `plans.ts`'s `app.patch('/api/v1/plans/:id/document-links/:linkId/acknowledge', ...)` — OK, response shape (`document_links[].content_status`/`permission_status`/`content_flagged_at`) matches `PlanDocumentLink` interface exactly.
- `IntegrationHealth.tsx` GET `/api/v1/integrations/eoc-cots/conflicts` + POST `.../resolve` ↔ `eoc-cots-adapter.ts`/`eoc-cots-conflicts.ts` routes — response shape (`items[].system_name` cross-plan touch-up) and request body (`resolution`, `resolved_by: user.id`) both match the backend's expectations. OK.
- `OperatingPicture.tsx` GET `/api/v1/operating-picture/facilities` ↔ `facility-adapter.ts`'s `facilityRoutes` — `ApiFacilityMarker` interface (id/type/shape/tone/label/status/location/source/as_of) matches the route's constructed `markers` shape exactly. OK.
- `PlanRepository.tsx`'s `ImportDocumentModal` wiring (`onImported`/`onClose`) ↔ component props — OK.
- `document-adapter.ts`'s `checkAndPersistPermission` ↔ `plans.ts`'s `revalidateDocumentLinkPermission` import — signature and return type (`'valid' | 'revoked'`) match the caller's usage in `fetchPlanDocumentLinks`. OK.
- Migration renumbering (1700000000014/015/016) — no slot collisions; `eoc_cots_schema.js` uses legacy CJS `exports.up/down` style (inconsistent with every sibling migration's `export const up/down`) but verified functionally equivalent via `node-pg-migrate`'s `jiti`-based loader, which transparently handles both — not a defect.
