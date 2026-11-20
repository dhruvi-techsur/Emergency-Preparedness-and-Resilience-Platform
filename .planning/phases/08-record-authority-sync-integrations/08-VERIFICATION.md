---
phase: 08-record-authority-sync-integrations
verified: 2026-11-20T13:27:21Z
status: passed
score: 5/5 must-haves verified
---

# Phase 8: Record-Authority & Sync Integrations Verification Report

**Phase Goal:** EOC/logistics and planning staff see WebEOC/Veoci-class EOC COTS data and facility/asset/document-system data integrated into EPMP via deterministic adapter stubs with explicit, visible record-authority declarations — and when a record conflicts between EPMP and the external system, a named person resolves it through an explicit side-by-side "Keep EPMP value" / "Keep [external] value" action — so no sync integration in this milestone ever silently overwrites a record or hides which system actually owns it.
**Verified:** 2026-11-20T13:27:21Z
**Status:** passed
**Re-verification:** No — initial verification

## Gate Evidence (cited, not re-run)

Per `08-GATE.md` frontmatter: `gate_status: passed`, `review_blockers_open: 0`, `boot_smoke: pass`, `browser_suite: pass` (waves 1-3 build/tests all `pass`). Per `08-REVIEW.md`: `status: clean`, `blockers: 0`, `warnings: 0` (iteration 2, after B1/W1 fixes independently re-verified with live manual repro + full regression sweep — 22 files / 144 tests, zero regressions). `node pivota_spec-tools.cjs verify gate-evidence 08 --raw` returns `pass`. No skipped checks found — these are used as evidence for build/test/boot/browser-suite correctness rather than re-run here, per protocol.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Integration-health Table row for EOC COTS (WebEOC) declares authoritative record types vs EPMP, last-sync/direction/SyncStatus, testable against stub's healthy/degraded/outage states | ✓ VERIFIED | `eoc-cots-adapter.ts` `recordEocCotsHealth()` upserts `integration_health` (system_name='WebEOC', direction='bidirectional', record_authority='WebEOC', sync_status online/offline) on every fetch; `GET /api/v1/integrations/eoc-cots/health` route exposes it; `IntegrationHealth.tsx` renders it via the shared `Table`/`COLUMNS` (System/Last sync/Direction/Record authority/Status). `fetchExchangeRecords`'s `since==='FORCE_AUTH_FAILURE'` trigger deterministically drives the offline/degraded path (`eoc-cots-adapter.test.ts`, 8/8 pass per REVIEW.md). Per-record-type authority is resolved via `isRecordTypeDeclared`/`checkRecordAuthority` against `record_authority_registry`, seeded with `incident`→EPMP and `resource_request`/`status`/`activity_log` deliberately unregistered (seed.ts:2021-2045), making "undeclared types are skipped" an observable, test-reproducible behavior (`runEocCotsSync`'s `isRecordTypeDeclared` gate, lines 257-263). |
| 2 | EOC COTS conflict screen shows both values side-by-side with "Keep EPMP value"/"Keep [external] value" actions; resolved only by explicit click, never automatic/silent re-overwrite | ✓ VERIFIED | `IntegrationHealth.tsx` lines 176-230: expand panel renders `conflict.epmp_value`/`conflict.external_value` in a 2-column grid with literal buttons `Keep EPMP value` / `Keep {system} value`, wired to `handleResolve` → `POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve`. Backend (`eoc-cots-conflicts.ts`) is the SOLE file issuing `SET resolution` (doc-comment + REVIEW.md's B1 fix confirms this structurally), enforces caller-identity (`resolved_by !== req.epmpUser.id` → 403), uses `WHERE resolution IS NULL` race guard, and a dedup `SELECT` before every conflict INSERT (B1 fix, REVIEW.md lines 30-38) prevents a resolved conflict reappearing on a subsequent tick — manually reproduced live against real Postgres (REVIEW.md: 3 ticks → 1 row; resolve + 1 more tick → still 1 row, now resolved). e2e spec `eoc-cots-conflict-resolution.spec.ts` (4 tests) proves: side-by-side values visible, no button pre-focused, resolve removes from list with zero page reload, second resolve attempt → 404 `EOC_CONFLICT_NOT_FOUND`, forged `resolved_by` → 403 `VERIFICATION_REQUIRES_NAMED_USER`. Covered by browser_suite: pass (gate evidence). |
| 3 | Facility/asset status + location markers on Operating Picture from deterministic adapter stub, each carrying Provenance (source/as-of); no inventory/maintenance/cost field ever displayed or persisted | ✓ VERIFIED | `facility-adapter.ts`'s `fetchFacilityStatus` deliberately simulates a raw vendor response containing `inventory_count`/`maintenance_due_at`/`annual_cost` (lines 143-156) then normalizes via an explicit allow-list object-literal copy (lines 170-177) that structurally cannot reference those fields — proven, not merely asserted, by `facility-document-adapter.test.ts` test 1 ("returns ONLY the 6 allow-listed keys"). The `facilities` table itself (migration 1700000000015) has no inventory/maintenance/cost columns at all — forbidden fields cannot even be persisted transiently. `ApiFacilityMarker` (OperatingPicture.tsx interface, lines 116-126) likewise has no such field to destructure. `GET /api/v1/operating-picture/facilities` → `OperatingPicture.tsx` renders `type:'facility'` markers with `<Provenance source={facility.source} time={...as_of} />` in the popup (lines 546-559). e2e spec `operating-picture-facility-markers.spec.ts` (test.describe.serial, several tests) covers this. Outage-resilience ("last-known positions remain on map") verified by `facility-document-adapter.test.ts` test 4. |
| 4 | Document-system-permission user can browse/import/live-link EOP/SOP/annex/evidence docs from simulated SharePoint-class adapter into Plan Repository; a user lacking permission cannot see the document in browse/import list — enforced server-side | ✓ VERIFIED | `document-adapter.ts`'s `browseDocuments()` filters server-side against a lazily-seeded per-user `SIMULATED_USER_DOCUMENT_ACCESS` map (2 of 3 docs granted, `DOC-ANNEX-003` deliberately withheld) BEFORE any result leaves the module (lines 90-102) — `ImportDocumentModal.tsx`'s own doc-comment confirms "No client-side filtering... the server-side filtering... is the ENTIRE enforcement mechanism." `importDocument`/`linkDocument` independently re-check the access set at call time (not cached from browse), closing a guess-the-id bypass. `facility-document-adapter.test.ts` tests 5-7 directly prove: fresh user sees only 2 granted docs, import of the withheld doc → `IMPORT_PERMISSION_DENIED` (403 at HTTP layer), import of a granted doc succeeds with `imported_by` = the real requesting user. W1 fix (REVIEW.md lines 40-45) closed the previously-dead permission-revocation detection path, now proven end-to-end via `plans.test.ts`'s new describe block (link → valid → trigger revocation → re-GET flips to `permission_status: 'revoked'`, independently confirmed via direct DB SELECT) and the UI alert consumer (`PlanDetail.tsx:344-351`, "Access removed"). |
| 5 | "Link live" background sync detecting a simulated source-document change flags the linked plan "source changed, review" rather than auto-applying the edit | ✓ VERIFIED | `document-adapter.ts`'s `runDocumentLinkSync()` deterministically flags `DOC-SOP-002` (`content_status='changed'`, idempotent via `AND content_status <> 'changed'` guard) and is STRUCTURALLY proven (per the plan's own doc comment, lines 235-243) to never write to `plans`/`plan_sections`/`plan_versions` — only `plans.ts`'s separate `PATCH .../acknowledge` route (lines 668-713) can clear the flag back to `'current'`, requiring an explicit person's action. `PlanDetail.tsx` lines 322-343 renders the literal `title="Source changed, review"` `Alert` with a "Mark reviewed" button calling that acknowledge route — never auto-applying. e2e spec `plan-live-link-flagged-review.spec.ts` (3/3 passing per 08-06-SUMMARY.md) covers this end-to-end. |

**Score:** 5/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `backend/src/modules/integration-gateway/eoc-cots-adapter.ts` | EOC COTS adapter stub, health/exchange routes, sync job | ✓ VERIFIED | 546 lines; exists, substantive, wired into `routes.ts` and `server.ts` scheduler |
| `backend/src/modules/integration-gateway/eoc-cots-conflicts.ts` | Sole conflict-resolve route | ✓ VERIFIED | 151 lines; registered in `routes.ts`; caller-identity + race guards present |
| `backend/src/modules/integration-gateway/facility-adapter.ts` | Facility/asset adapter, field-discarding, sync job | ✓ VERIFIED | 409 lines; registered in `routes.ts`/`server.ts` |
| `backend/src/modules/integration-gateway/document-adapter.ts` | SharePoint-class document adapter, browse/import/link, link-live sync | ✓ VERIFIED | 471 lines; registered in `routes.ts`/`server.ts` |
| `backend/migrations/1700000000014_eoc-cots-schema.js` | eoc_cots_config/sync_log/conflicts tables | ✓ VERIFIED | Matches TechArch DDL; `resolution` CHECK, FK, indexes present |
| `backend/migrations/1700000000015_facility-document-schema.js` | facility_feed_config/facilities/document_system_config | ✓ VERIFIED | `facilities` table has NO inventory/maintenance/cost columns by design |
| `backend/migrations/1700000000016_document-links-extend-flagged-state.js` | content_status/content_flagged_at/acknowledged_by/at on document_links | ✓ VERIFIED | ALTER confirmed; CHECK constraint restricts to current/changed |
| `frontend/app/src/pages/admin/IntegrationHealth.tsx` | Integration health Table + EOC COTS conflict expand panel | ✓ VERIFIED | 233 lines; side-by-side values, Keep EPMP/external buttons wired to resolve route |
| `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` | Facility markers + Provenance on map | ✓ VERIFIED | 656 lines; `ApiFacilityMarker` interface has no forbidden fields; Provenance rendered |
| `frontend/app/src/pages/plans/ImportDocumentModal.tsx` | Document browse/import/link modal | ✓ VERIFIED | 181 lines; renders exactly what server returns, no client-side filtering |
| `frontend/app/src/pages/plans/PlanDetail.tsx` | "Source changed, review" Alert + Mark reviewed action | ✓ VERIFIED | Lines 322-351; literal title text, wired to acknowledge route |
| e2e specs (eoc-cots-conflict-resolution, operating-picture-facility-markers, plan-document-import-link, plan-live-link-flagged-review) | Browser-level proof of each truth | ✓ VERIFIED | All present, substantive (229/167/+ lines), part of browser_suite: pass per gate |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `eoc-cots-adapter.ts` fetch/sync | `integration_health` table | `recordEocCotsHealth()` UPSERT | WIRED | Called on every fetch success/failure path |
| `IntegrationHealth.tsx` | `GET /api/v1/integrations/eoc-cots/conflicts` | `useQuery` | WIRED | `conflictsData` drives expand panel |
| `IntegrationHealth.tsx` "Keep X value" buttons | `POST .../conflicts/{id}/resolve` | `handleResolve` → `apiPost` | WIRED | Query invalidation refetches, no reload |
| `eoc-cots-conflicts.ts` resolve route | `eoc_cots_conflicts` table | `UPDATE ... WHERE resolution IS NULL` | WIRED | Race-safe, caller-identity-checked |
| `facility-adapter.ts` fetch | `facilities` table | `runFacilitySync()` INSERT...ON CONFLICT | WIRED | Idempotent upsert, failure leaves stale rows (not deleted) |
| `OperatingPicture.tsx` | `GET /api/v1/operating-picture/facilities` | `facilitiesQuery` useQuery, 30s poll | WIRED | Markers merged into `allMarkers`, rendered with Provenance |
| `document-adapter.ts` browseDocuments | `ImportDocumentModal.tsx` | `GET /api/v1/integrations/documents/browse` | WIRED | Zero client-side re-filtering (verified by doc comment + T-08-18 note) |
| `document-adapter.ts` importDocument/linkDocument | `document_links` table | `INSERT ... imported_by = userId` | WIRED | `userId` always the real requesting user, never defaultable |
| `runDocumentLinkSync()` | `document_links.content_status` | `UPDATE ... content_status='changed'` | WIRED | Structurally guaranteed to never touch `plans`/`plan_sections`/`plan_versions` |
| `PlanDetail.tsx` Alert | `PATCH .../document-links/{id}/acknowledge` | `handleAcknowledge` | WIRED | Only route clearing `content_status` back to 'current' |
| `plans.ts` GET /:id | `revalidateDocumentLinkPermission()` | per-request re-check | WIRED | Confirmed reachable end-to-end by W1 fix's new test (REVIEW.md) |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|-----------------|
| F13 (EOC COTS record-authority + conflict resolution) | ✓ SATISFIED | None — Truths 1, 2 fully verified |
| F17 (facility/asset + document-system integration) | ✓ SATISFIED | None — Truths 3, 4, 5 fully verified |

### Anti-Patterns Found

None. Grep scan for `TODO|FIXME|XXX|HACK|not.?implemented|coming soon` across all 9 key phase files (backend adapters/routes, frontend IntegrationHealth/OperatingPicture/ImportDocumentModal/PlanDetail/PlanRepository) returned zero hits. All 6 plan SUMMARY.md files independently report "Known Stubs: None found" with their own grep evidence, and the only false-positive hits identified (a pre-existing `seed.ts` SQL `placeholders` variable name, a pre-existing Phase-2 `MapControls` structural-placeholder doc comment) are unrelated to this phase's scope.

The two deliberately-left-undeclared record types (`resource_request`/`status`/`activity_log` have no `record_authority_registry` row) are an intentional design choice proving the "undeclared types are skipped" rule is testable, not an omission — `incident` is explicitly declared EPMP-authoritative to drive the conflict-detection demo path.

### Human Verification Required

None — all 5 success criteria have concrete, substantive backend+frontend+test-level evidence, and gate evidence (build/tests/boot/browser_suite) is fully green with no skipped checks. REVIEW.md's two fix iterations (B1 unbounded-duplicate-conflict-rows, W1 dead-permission-revocation-path) were independently re-verified via live manual repro against real Postgres, not just re-reading the fix commit — both confirmed genuinely resolved with no regression (22 files / 144 tests passing).

### Gaps Summary

No gaps. All 5 observable truths are backed by substantive, wired code (server-side enforcement for permission boundaries, structural guarantees for field-discarding and no-auto-apply, race-safe + caller-identity-checked conflict resolution with a verified non-reappearing dedup guard) and corroborated by passing unit tests (680+ lines across 3 backend test files), e2e Playwright specs covering every truth, and a clean code review with two fix iterations independently re-verified.

---

_Verified: 2026-11-20T13:27:21Z_
_Verifier: Claude (pivota_spec-verifier)_
