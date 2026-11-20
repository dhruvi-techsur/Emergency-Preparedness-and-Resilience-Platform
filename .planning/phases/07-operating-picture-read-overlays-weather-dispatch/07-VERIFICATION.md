---
phase: 07-operating-picture-read-overlays-weather-dispatch
verified: 2026-11-20T11:39:30Z
status: passed
score: 4/4 must-haves verified
---

# Phase 7: Operating Picture Read Overlays — Weather & Dispatch Verification Report

**Phase Goal:** EOC and incident-command staff see weather/hazard and CAD/911 dispatch data as additional, clearly-sourced read-only layers on the Operating Picture and incident workspace — simulated via deterministic adapter stubs that behave exactly like F11's GIS adapter (default degraded/fallback path, provenance-tagged, no live vendor credentials) — so an unverified feed is never treated as operational fact and a stub outage never breaks the page.

**Verified:** 2026-11-20T11:39:30Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth (ROADMAP Success Criterion)                                                                                                                                                                | Status     | Evidence |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | -------- |
| 1   | User opens LayerPanel on Operating Picture, toggles weather/hazard overlay layers from stub NOAA/NWS/USGS adapter; each shows source/as-of via Provenance; unverified stays off by default and keeps dashed "Unverified" treatment even when toggled on | ✓ VERIFIED | `hazard-feed-adapter.ts:31-91` (deterministic `KNOWN_LIVE_FEED='NOAA'`, all other feed names throw `HAZARD_FEED_UNREACHABLE`); `operating-picture.ts:324-342` (`checked: allVerified` — off whenever `verified===false`, never silently promoted); `OperatingPicture.tsx:375-380` (`layersForPanel` passes `layer.verified` straight through unchanged to `LayerPanel`); Playwright `operating-picture-hazard-layers.spec.ts` test 1 (asserts unchecked + `.ep-provenance--unverified` visible with "Unverified" text) and test 2 (toggles ON, re-asserts the SAME dashed chip is still visible) — both pass per GATE.md's `browser_suite: pass` (110/111; unrelated flake documented) |
| 2   | Weather/hazard adapter stub deterministically simulates outage (same recognized/unrecognized trigger as GIS adapter); retry/backoff job records failure rather than hiding it; Operating Picture keeps rendering with affected layer marked stale/off — page never fails to render from a hazard-feed outage | ✓ VERIFIED | `hazard-feed-adapter.ts:44-50` (non-`NOAA` feed → `recordFeedHealth('offline')` then throw, same shape as `gis-adapter.ts`'s `KNOWN_LAYER_ID`); `runHazardFeedIngestion` (`:131-183`) iterates all configured feeds with isolated try/catch, writes `background_jobs` row scoped to `job_type='feed_ingestion'` exclusively, computes backoff via the shared `computeBackoff()` helper (never a second bespoke implementation) — `failure_count`/`next_retry_at` genuinely persisted, not swallowed; `operating-picture.ts:299-305` wraps `syncHazardLayersFromEvents()` in an empty-catch try/catch ("a hazard-layer sync failure must never block the layers response... No rethrow, no 500"); backend test `operating-picture.test.ts:297` ("runHazardFeedIngestion() populates integration_health with both online and offline sync_status rows") proves NOAA→online, NWS/USGS→offline in the SAME admin-visible table — all 119 (then 120 after the B1/B2 fix pass) backend tests pass per GATE.md |
| 3   | User viewing incident workspace sees CAD/911 dispatch-status panel sourced from deterministic CAD adapter stub, showing status + Provenance (source/timestamp) — no edit action anywhere in the UI, since record authority stays with CAD/911 | ✓ VERIFIED | `incidents.ts:384-420` (`GET /api/v1/incidents/:id/dispatch-status`, read-only — comment explicitly: "the write path for that table lives exclusively in cad-adapter.ts's runCadIngestion... never writes it"); structural grep confirms **zero** PATCH/PUT/DELETE route exists anywhere for `cad_dispatch_events` (`cad-adapter.ts:329-334`'s own doc-comment: "this absence IS the enforcement mechanism... not a runtime permission check" — only non-route write-path hits are `runCadIngestion`'s own INSERT/ON-CONFLICT-UPDATE and test-only direct-DB helpers in `incidents.test.ts`); `IncidentWorkspace.tsx:516-557` renders the Card with `Provenance source={...} time={...}`, and its own comment states "Structurally this Card has NO button, NO form, and NO onClick handler anywhere in its subtree"; Playwright `incident-workspace-dispatch-status.spec.ts` test 1 asserts `dispatchCard.locator('button')).toHaveCount(0)` AND the non-dashed `.ep-provenance` (not `--unverified`) renders; test 2 proves the unmatched empty state with zero buttons — both pass per GATE.md |
| 4   | Both weather/hazard and CAD/911 integrations appear in integration-health view (system, last sync, direction=inbound, record authority, SyncStatus); deterministically flipping either stub between healthy/degraded/outage changes what the health view displays — provable entirely against the stub's own simulated states, no real vendor network call | ✓ VERIFIED | `admin-integration-health.ts` is a generic passthrough (`SELECT ... FROM integration_health`) requiring zero code change — confirmed by its own doc comment citing Phase 7's adapters as the first real rows; `hazard-feed-adapter.ts:103-115`'s `recordFeedHealth` and `cad-adapter.ts:147-159`'s `recordCadHealth` both UPSERT into the SAME shared table with `direction='inbound'` hardcoded, `record_authority` correctly set (vendor name for hazard, hardcoded `'CAD/911'` — never `'EPMP'` — for CAD); `IntegrationHealth.tsx` renders System/Last sync/Direction/Record authority/Status columns unchanged; backend tests prove deterministic flips: `operating-picture.test.ts:297` (hazard online/offline) and `incidents.test.ts:479-512` ("GET /api/v1/integrations/cad/health deterministically flips between online/offline across a forced-failure and a success call" — asserts `offlineRow.sync_status==='offline'`, `record_authority==='CAD/911'`, then re-asserts `online` after a success call); Playwright `incident-workspace-dispatch-status.spec.ts` test 3 confirms both "CAD/911" and "Hazard Feed" rows render in the admin table; test 4 exercises the dedicated `GET /api/v1/_test/cad-forced-outage` route (server-side, real DB-backed) and confirms the Dispatch status Card shows last-known data, not an error |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `backend/migrations/1700000000012_hazard-layers-schema.js` | `hazard_layers` table | ✓ VERIFIED | Exists; migration file present |
| `backend/migrations/1700000000013_cad-dispatch-schema.js` | `cad_config`/`cad_dispatch_events` tables + `job_type` CHECK ALTER | ✓ VERIFIED | Exists; `cad_ingestion` job_type confirmed distinct from `feed_ingestion` (see key links) |
| `backend/src/modules/integration-gateway/hazard-feed-adapter.ts` | Adapter stub, ingestion job, sync function, health/verify routes | ✓ VERIFIED | 291 lines, substantive; all 5 required exports present (`fetchHazardFeedEvents`, `runHazardFeedIngestion`, `syncHazardLayersFromEvents`, `hazardFeedRoutes`, `startHazardFeedIngestionScheduler`); wired into `routes.ts` and `server.ts` |
| `backend/src/modules/integration-gateway/cad-adapter.ts` | Read-only CAD adapter stub, ingestion job, routes (no write route) | ✓ VERIFIED | 430 lines, substantive; all 4 required exports present (`fetchCadDispatchEvents`, `runCadIngestion`, `cadRoutes`, `startCadIngestionScheduler`); structurally zero PATCH/PUT/DELETE route for `cad_dispatch_events`; wired into `routes.ts` and `server.ts` |
| `backend/src/modules/incident-ops/operating-picture.ts` | `/layers` extended with hazard-layer entries, additive, never 500s | ✓ VERIFIED | `syncHazardLayersFromEvents` imported and called (line 5, 300); hazard entries appended at lines 324-342; wrapped in empty-catch try/catch |
| `backend/src/modules/incident-ops/incidents.ts` | `GET /api/v1/incidents/:id/dispatch-status` read-only route | ✓ VERIFIED | Route present at line 385; reads `cad_dispatch_events` only, returns `{linked:false}` gracefully on no match, never throws |
| `frontend/app/src/pages/operating-picture/OperatingPicture.tsx` | `ApiLayer`/`layersForPanel` extended to pass hazard entries through | ✓ VERIFIED | `verified` field passed straight through unchanged at line 380; hazard entries documented as LayerPanel-only (never canvas markers) at line 320-324 |
| `frontend/app/e2e/operating-picture-hazard-layers.spec.ts` | Playwright proof of dashed-Unverified-stays-dashed-on-toggle | ✓ VERIFIED | 195 lines (exceeds 40-line min); 3 tests covering off-by-default, toggle-keeps-dashed, no-regression |
| `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` | Read-only Dispatch status Card with Provenance, no edit affordance | ✓ VERIFIED | Card at lines 528-557; explicit "NO button, NO form, NO onClick" structural comment; renders `Provenance` and graceful `EmptyState` for unmatched case |
| `frontend/app/e2e/incident-workspace-dispatch-status.spec.ts` | Playwright proof of panel, no-edit, empty-state, integration-health visibility, outage resilience | ✓ VERIFIED | 153 lines (exceeds 55-line min); 4 tests covering all 5 required behaviors (combines empty-state + outage-resilience assertions in test 4) |
| `frontend/app/src/pages/admin/IntegrationHealth.tsx` | Confirms generic passthrough renders both new integrations with zero code change | ✓ VERIFIED | Component unchanged beyond doc-comment/EmptyState copy, exactly as 07-04's plan specified; generic over `system_name`/`direction`/`record_authority`/`sync_status` |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | --- | --- | ------ | ------- |
| `operating-picture.ts` | `hazard-feed-adapter.ts` | `import { syncHazardLayersFromEvents }`, called at top of GET /layers | ✓ WIRED | Confirmed: import line 5, call line 300, hazard_layers SELECT lines 307-322 |
| `hazard-feed-adapter.ts` | `integration_health` table | UPSERT ON CONFLICT (system_name) | ✓ WIRED | `recordFeedHealth` at lines 103-115, called from both success and failure branches of `fetchHazardFeedEvents` |
| `server.ts` | `hazard-feed-adapter.ts` | `startHazardFeedIngestionScheduler()` called in `start()` | ✓ WIRED | Confirmed import line 18, call line 127 |
| `incidents.ts` | `cad_dispatch_events` (via migration) | Read-only SELECT WHERE linked_incident_id | ✓ WIRED | Confirmed at lines 393-405, read-only, no mutation |
| `cad-adapter.ts` | `integration_health` table | UPSERT, `record_authority='CAD/911'` hardcoded | ✓ WIRED | `recordCadHealth` lines 147-159, never parameterizes `record_authority` as anything but the literal string |
| `OperatingPicture.tsx` | `GET /api/v1/operating-picture/layers` | existing `useQuery` — no new query needed | ✓ WIRED | Confirmed line 266, unchanged query, now returns hazard entries additively |
| `OperatingPicture.tsx` | design-system `LayerPanel`/`Provenance` | `layersForPanel` array unchanged wiring | ✓ WIRED | Confirmed lines 375-380, 509-510 |
| `IncidentWorkspace.tsx` | `GET /api/v1/incidents/:id/dispatch-status` | new `useQuery(['incident-dispatch-status', id], ...)` | ✓ WIRED | Confirmed lines 239-240 |
| `IncidentWorkspace.tsx` | design-system `Provenance` | rendered in new Dispatch status Card | ✓ WIRED | Confirmed lines 547-554, correctly never uses `verified={false}` per F15's "read-only authoritative-elsewhere data" contract |

### Requirements Coverage

No REQUIREMENTS.md phase-7 mapping table found distinct from the ROADMAP success criteria already used as the must_haves source (Option B per verification process) — all 4 ROADMAP success criteria are covered above and SATISFIED.

### Anti-Patterns Found

None. Scan of all phase-7-modified files (hazard-feed-adapter.ts, cad-adapter.ts, operating-picture.ts, incidents.ts, OperatingPicture.tsx, IncidentWorkspace.tsx, IntegrationHealth.tsx, and both e2e specs) for TODO/FIXME/placeholder/empty-handler/console-log-only patterns returned no hits. The one `/api/v1/_test/cad-forced-outage` route is a deliberate, documented test-injection endpoint (mirroring the pre-existing `force_gis_failure` precedent from Phase 2), not a stub or placeholder — it calls the real adapter function server-side against the real DB-backed pool.

### Human Verification Required

None. All 4 truths are structurally and behaviorally verifiable via static code inspection plus the already-green gate evidence (backend unit tests, frontend unit tests, and the full Playwright browser suite). No skipped gate checks exist for this phase (`verify gate-evidence 7` returns `pass` with no `not_run` entries) — `boot_smoke: pass` (all 4 gates, including the empty-state init confirming all 4 `integration_health` rows populated correctly), `browser_suite: pass` (110/111, the 1 failure a documented pre-existing unrelated Phase-5 flake).

### Gaps Summary

No gaps. All 4 ROADMAP success criteria are fully implemented, substantively coded (not stubs), and correctly wired end-to-end:

1. **Hazard-feed LayerPanel overlays** — deterministic adapter stub (`NOAA` recognized, `NWS`/`USGS` simulate outage), `verified:false` structurally un-promotable except via the named-person `/verify` endpoint, dashed-Unverified treatment proven to survive toggle-on via Playwright.
2. **Outage resilience** — per-feed fault isolation, shared `computeBackoff()` helper (not duplicated), `background_jobs` bookkeeping genuinely records failures, empty-catch wrapper around the sync call guarantees the `/layers` endpoint never 500s.
3. **CAD/911 dispatch-status panel** — structurally zero write route exists for `cad_dispatch_events` (route absence, not a disabled button), UI Card has zero interactive elements in its subtree, Provenance renders source+timestamp.
4. **Integration-health visibility + deterministic flip** — both adapters write into the pre-existing shared `integration_health` table with zero admin-UI code change required; backend tests directly prove online↔offline flips are visible via the same table both the admin screen and the Incident Workspace's own forced-outage test consume.

Additionally, 3 genuine defects surfaced during the browser-suite gate (a cross-workspace-boundary import, a shared-fixture test pollution issue, and a real production bug in `runCadIngestion`'s incident-matching stickiness) were found and fixed within this same execution session — not deferred as gaps — with the fix for the production bug directly strengthening truth #3/#4's reliability (the CAD dispatch link no longer silently drifts to an unrelated incident on background scheduler ticks). These are documented in 07-REVIEW.md with full before/after verification including a live-scheduler proof, and are cited here as resolved, not outstanding.

---

_Verified: 2026-11-20T11:39:30Z_
_Verifier: Claude (pivota_spec-verifier)_
