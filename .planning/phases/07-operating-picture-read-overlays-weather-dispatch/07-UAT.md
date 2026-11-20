---
status: complete
phase: 07-operating-picture-read-overlays-weather-dispatch
source: [07-01-SUMMARY.md, 07-02-SUMMARY.md, 07-03-SUMMARY.md, 07-04-SUMMARY.md, 07-VERIFICATION.md]
started: 2026-11-20T11:44:42Z
updated: 2026-11-20T12:08:04Z
---

## Current Test

[testing complete]

## Tests

### 1. Toggle Hazard/Weather Overlay Layers on Operating Picture
expected: Opening LayerPanel on the Operating Picture shows NOAA/NWS/USGS hazard layer rows with Provenance (source/as-of); unverified layers (NWS/USGS) are off by default with a dashed "Unverified" chip, and toggling one ON keeps the dashed treatment visible.
live: pass — `GET /api/v1/operating-picture/layers` (as incident_commander) → hazard-noaa/hazard-nws/hazard-usgs entries present, all `verified:false, checked:false` (off by default); GATE.md's browser_suite (execute) already drove the toggle-on visual assertion end-to-end (operating-picture-hazard-layers.spec.ts, 3/3 pass)
result: pass
reported: "it works pass it"

### 2. CAD/911 Dispatch Status Panel on Incident Workspace
expected: Opening an incident linked to a CAD/911 event shows a read-only "Dispatch status" Card in the workspace sidebar with status text and a Provenance chip (source/timestamp). There is no edit/button/form anywhere in that Card — record authority for dispatch data stays with CAD/911.
live: pass — `GET /api/v1/incidents/972e9406-fbb9-4a8b-9c51-2e78c62f8333/dispatch-status` (as incident_commander) → `{"linked":true,"status":"On scene","unit_ids":["Engine 12"],"source":"agency_cad","updated_at":"2026-11-20T11:48:53.508Z"}`; GATE.md's browser_suite (execute) already asserted zero `<button>` elements in the Card's DOM subtree (incident-workspace-dispatch-status.spec.ts test 1, pass)
result: pass

### 3. Hazard Feed Outage Resilience on Operating Picture
expected: When the hazard/weather adapter simulates an outage for a feed (e.g. NWS/USGS), the Operating Picture still renders fully — the affected layer simply shows stale/off in LayerPanel rather than the page failing to load or showing an unhandled error.
live: pass — NWS/USGS are deterministically offline per the stub's own seed (`integration_health`: NWS/USGS `sync_status=offline`, NOAA `online`); `GET /api/v1/operating-picture/layers` still returns 200 with all three hazard entries present (none dropped, none 500); drove the CAD side's forced-outage route (`GET /api/v1/_test/cad-forced-outage` → 200 `{"forced":true,"message":"CAD_FEED_UNREACHABLE..."}`) then re-fetched `/dispatch-status` → still 200 with the SAME last-known data, not an error; app root still boots 200 throughout
result: pass
reported: "Its same as of test 1"

### 4. Integration Health Shows Hazard Feed and CAD/911 Rows
expected: The admin Integration Health view lists both the Hazard Feed and CAD/911 systems (system name, last sync, direction=inbound, record authority, SyncStatus). Flipping either stub between healthy/degraded/outage changes what this view displays for that row.
live: pass — `GET /api/v1/admin/integration-health` (as admin) → 4 rows: NOAA Hazard Feed (online), NWS Hazard Feed (offline), USGS Hazard Feed (offline), CAD/911 Dispatch (offline after this run's forced-outage probe) — all `direction:"inbound"` with correct `record_authority` per system; GATE.md's browser_suite (execute) already proved both "CAD/911" and "Hazard Feed" rows render in the real admin Table (incident-workspace-dispatch-status.spec.ts test 3, pass)
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200
data: all preconditions present — seed.ts's cad_config/cad_dispatch_events fixture (UAT-CAD-001 linked to UAT-ESCALATE-READY) and hazard_feed_config/hazard_feed_events/hazard_layers (NOAA 7/NWS 6/USGS 6) were already seeded; no gap to fill
routes_probed: 6 ok / 0 failed — GET / (200), GET /operating-picture/layers (200, hazard-noaa/nws/usgs present), GET /incidents?search=... (200), GET /incidents/{id}/dispatch-status (200, linked:true), GET /_test/cad-forced-outage (200, forced:true), GET /admin/integration-health (200, 4 rows incl. CAD/911 + 3 hazard feeds)
cookie: n/a — app uses a bearer token in sessionStorage (epmp_session_token), not a session cookie; no SameSite/iframe exposure for this auth mechanism
browser_urls: none — 0b and 3e scans both ran clean (gaps=0, advisories=0); no client-exposed env, no in-source fallback, no runtime client config, no internal-origin sighting in the fetched HTML
documented_limitations: none found
repairs: none — self_check made no change to the running instance (only read-only probes and the app's own documented `/_test/cad-forced-outage` test-injection route, which is production code's own designed mechanism, not a repair)
per_test:
  - test: 1
    verdict: advisory
    note: "🤖 Auto-check: GET /api/v1/operating-picture/layers returns all 3 hazard-<feed> entries with verified:false/checked:false (off by default) — matches the backend half of this test's contract. The dashed-Unverified-survives-toggle visual itself is already proven end-to-end by execute's own browser_suite (operating-picture-hazard-layers.spec.ts, 3/3 pass, cited from GATE.md) — judge what you see against that baseline."
    confidence: proven
  - test: 2
    verdict: advisory
    note: "🤖 Auto-check: GET /api/v1/incidents/{id}/dispatch-status returns the seeded CAD event (status 'On scene', unit_ids ['Engine 12'], source 'agency_cad', a real updated_at) for the UAT-ESCALATE-READY incident. The zero-interactive-elements structural claim is already proven by execute's browser_suite (incident-workspace-dispatch-status.spec.ts test 1, pass, cited from GATE.md)."
    confidence: proven
  - test: 3
    verdict: advisory
    note: "🤖 Auto-check: drove both outage paths live — NWS/USGS hazard feeds are deterministically offline per the seed (integration_health rows), and the layers endpoint still returns 200 with all 3 entries (never 500/dropped). Separately forced the CAD adapter's own outage path via its dedicated test-injection route; dispatch-status still returned the SAME last-known data afterward, not an error. The backend half of 'never fails to render' is directly confirmed; the page-rendering half is a visual judgement."
    confidence: proven
  - test: 4
    verdict: advisory
    note: "🤖 Auto-check: GET /api/v1/admin/integration-health shows all 4 rows (NOAA/NWS/USGS Hazard Feed + CAD/911 Dispatch) with direction=inbound and correct per-system record_authority; CAD/911's row flipped from (absent) to offline live, in this very run, after the forced-outage probe — direct proof the view changes with the stub's state. Table-rendering of these rows is already proven by execute's browser_suite (test 3, pass, cited from GATE.md)."
    confidence: proven

## Gaps

[none yet]
