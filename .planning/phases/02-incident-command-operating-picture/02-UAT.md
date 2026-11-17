---
status: complete
phase: 02-incident-command-operating-picture
source: [02-VERIFICATION.md, 02-05-SUMMARY.md, 02-06-SUMMARY.md, 02-07-SUMMARY.md, 02-08-SUMMARY.md]
started: 2026-11-17T12:14:30Z
updated: 2026-11-17T13:22:30Z
---

## Current Test

[testing complete]

## Tests

### 1. Create and Classify an Incident
expected: Signed in as commander@epmp.local, navigate to Incidents > Create Incident. Fill the form (name, type, severity, jurisdiction, description, opened-at) and submit. The browser redirects to the new incident's Workspace, which shows a severity Badge in the page header, a pinned 6-role command panel (all roles "Unassigned"), and Timeline/Tasks/Resources/Reports tabs in that fixed order.
live: pass — full login + create driven through the port-7777 preview-proxy path with forged `X-Forwarded-Proto: https` / `X-Forwarded-Host: pivota-preview-probe.example.com` headers (the same mechanism a real Preview-tab tester uses): discovery doc → authorization request → Keycloak login form (action URL correctly `https://pivota-preview-probe.example.com/...`, not `localhost:8081`) → `commander@epmp.local`/`devpass123` credentials accepted (302 to `.../auth/callback?code=...`) → token exchange (200, id_token `preferred_username: commander@epmp.local`) → `POST /api/v1/auth/sso/callback` (200, real EPMP session_token minted) → `POST /api/v1/incidents` through the SAME proxy path with that session token (201) → `GET /api/v1/incidents/{id}` (200, workspace shape: severity, activation_level, status, empty command_roles) → `GET /api/v1/incidents/{id}/timeline` (200, exactly 1 entry, title "Incident created", actor populated, source "EPMP")
result: pass

### 2. Assign a Command Role
expected: On incident "UAT-ASSIGN-ROLE Default Agency Flood" (freshly seeded, no role assigned yet), open the Incident Workspace, click "Assign" on the Incident Commander row, pick a person from the Combobox, and submit. The assignment appears immediately in the panel (no page reload) and a new Timeline entry records it with actor and source.
live: pass — same preview-proxy login session as test 1. Pre-check confirmed the seeded incident had `commander: null, command_roles: []`. `POST /api/v1/incidents/{id}/command-roles` `{role_title: "Incident Commander", person_id: ...}` through the proxy → 201. Immediate re-GET of the incident (no reload) shows `commander` populated and `command_roles` containing the new assignment. `GET .../timeline` shows a new entry: title "Incident Commander assigned to Incident Commander", actor populated, source "EPMP" — total now 2 (plus the pre-existing "Incident created" entry from original seeding)
result: pass

### 3. Activation Level Change (Escalate)
expected: On an incident that already has an Incident Commander assigned ("UAT-ESCALATE-READY Default Agency Wildfire"), open the Activation modal from the PageHeader control, select a level above Monitoring (e.g. Partial), and confirm. The modal shows a danger-tier confirmation with the specific operational consequence and an outcome-named button (not "Yes"/"OK"); after confirming, the displayed activation level updates and a new Timeline entry records the change.
live: pass — preconditions re-confirmed via `psql` (Incident Commander already assigned, activation_level=Monitoring, unchanged from prior round's seeding). `POST /api/v1/incidents/{id}/activation` `{activation_level: "Partial", confirmed: true}` through the preview-proxy session → 200, body shows `activation_level: "Partial"`. Immediate re-GET confirms the change persisted. `GET .../timeline` shows a new entry: title "Activation changed to Partial", tone "warning", `detail: {from: "Monitoring", to: "Partial"}`, actor populated, source "EPMP". The modal's own confirmation UI (danger-tier styling, outcome-named button, the specific consequence text) is a visual/UX element this probe cannot assert — that part is still for the human to judge
result: pass

### 4. Operating Picture Map
expected: Navigate to Operating Picture. The map renders status-coded, shape-distinguished (diamond) markers for the incidents that have a location, plus a status bar showing data age ("As of HH:MM ET") and the real base-layer source ("Base layer: agency GIS (agency_gis)").
live: pass — `GET /api/v1/operating-picture/markers` through the SAME preview-proxy path, with the real session token from test 1's login (not an unauthenticated probe — this is the exact call the page itself makes) → 200, `status_bar: {"as_of":"...","base_layer_source":"agency GIS (agency_gis)"}`, 2 markers returned. This is the authenticated data call that was blocked in the prior round; it now succeeds end-to-end through the proxy. The map's own visual rendering (diamond shapes, status-coding, the exact status-bar copy) is a visual element left for the human to judge
result: pass

### 5. GIS Feed Outage Fallback
expected: Navigate to Operating Picture with `?force_gis_failure=true`. The page still renders; the status bar/banner reads exactly "Schematic base map, offline"; the same incident markers stay visible and clickable.
live: pass — `GET /api/v1/operating-picture/markers?force_gis_failure=true` through the preview-proxy path with the real session token → 200, `status_bar: {"as_of":"...","base_layer_source":"Schematic base map, offline"}` — the exact string the test documents — with 2 markers still returned (not an empty/error response). The authenticated degraded-mode call that was blocked in the prior round now succeeds end-to-end. The page's own visual rendering of this state is left for the human to judge
result: pass

## Summary

total: 5
passed: 5
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: all preconditions present — "UAT-ASSIGN-ROLE Default Agency Flood" (no command role assigned, located) and "UAT-ESCALATE-READY Default Agency Wildfire" (Incident Commander already assigned, located, activation_level=Monitoring) both still present from prior seeding; no new seeding needed this round
routes_probed: 5 ok / 0 failed (/, /incidents, /incidents/new, /operating-picture, backend /healthz — all 2xx with forwarded preview headers via port 7777)
cookie: n/a — this app is a Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie for the app's own session (Keycloak itself sets SameSite=None;Secure cookies for its own login-flow state, which is iframe-safe); iframe-cookie class does not apply to the app's session mechanism
browser_urls: 0 gaps / 0 advisories from both the static 0b scan (no client-exposed env vars, no in-source fallbacks, no runtime client config) and the live 3e scan (5 driven flows + 0 bundles, all clean)
documented_limitations: []
repairs: []
browser_suite: pass (execute) — 02-GATE.md records browser_suite: pass (30/30, 0 unexpected, including app-shell.spec.ts's direct-sandbox SSO regression suite); not re-run here per 3b
deploy_check: PASS — re-run fresh this session (`pivota-deploy-check.cjs`): D3/C1/C2/C3/D1/D2/D4/D5/C6/C4/D7 all PASS, exit 0
agent_run: not due (this app calls no model in Phase 2 scope — AI assistance is Phase 6)
3g_origin_gate: pass — `/api/v1/me` via the port-7777 preview proxy returns the same 401 with and without a browser Origin header (route semantics, not an Origin rejection); shell itself loads 200 with an Origin header
3g-i_dev_proxy: advisory, not a gap — vite.config.ts's `/api` and `/realms`/`/resources`/`/js` proxies target `localhost:8080`/`localhost:8081`; `docker compose config --services` reports 4 services (nats/opa/db/keycloak), but per `.pivota/start-dev.sh`'s own documented Shape-B classification this is a native multi-process app (frontend+backend run natively in-sandbox, sharing loopback) with compose providing ONLY dependency services — not the separate-container class this check targets. Empirically confirmed both targets resolve: `curl 127.0.0.1:5173/realms/epmp/.well-known/openid-configuration` -> 200 real Keycloak doc; `curl 127.0.0.1:5173/api/healthz` -> 404 (route doesn't exist, but proxy itself reaches the backend — confirmed via the many 200s on real /api/v1/* calls this round)
3d_orphan_pages: none — both Phase 2 routes (/operating-picture, /incidents) have real inbound source-level links (OperatingPicture.tsx, IncidentWorkspace.tsx, ClosureModal.tsx, main.tsx route tree); nav itself is server-driven from role_permissions (carried forward from prior round, unchanged)
3f_object_store: skipped (this app has no file storage)
stale_placeholders: 3 findings reviewed, 0 treated as gaps — 2 in PlatformMonitoring.tsx (lines 59, 69, "Phase 1 placeholder" — past-tense provenance, Phase 1 already complete, not a forward promise) + 1 in api-clients.ts (line 105, "Phase 2+'s actual API-client-authenticated routes" — refers to F10/integration-gateway's external-partner-API scope, not this phase's F1/F2/F11 scope); consistent with prior round's assessment
dev_log_scan: one non-fatal advisory — Vite's one-time dependency pre-bundling scan logged `Failed to resolve entry for package "@epmp/design-system"` at cold start (consistent with the documented Phase 01-10 decision: tsconfig path-maps straight to src/index.ts, a pre-existing workaround for a package with no built dist/index.d.ts); root route still served 200 immediately after, and the error did not recur on any of this round's ~15 subsequent requests. No fatal signatures (5xx, unhandled exception, EADDRINUSE, MissingSecret) found in the full log
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: drove the complete end-to-end chain through the exact browser-equivalent path (port-7777 preview proxy, forged X-Forwarded-Proto/X-Forwarded-Host) that was broken in the prior round — Keycloak discovery, login form, credential submission, authorization code, token exchange, and the app's own /api/v1/auth/sso/callback — all the way to a real EPMP session token for commander@epmp.local. Used that session to create an incident through the same proxy path: 201, workspace GET shows the severity/activation_level/status shape, and the Timeline shows exactly 1 entry ('Incident created') with actor and source populated. The visual layout (severity Badge styling, 6-role panel showing all-Unassigned, the exact tab order) is left for you to confirm by eye."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: using the same proven login session, assigned Incident Commander to the seeded no-role incident via the exact API call the UI's Assign button makes. Immediate re-fetch (no reload) shows the assignment reflected, and a new Timeline entry records it with actor+source. The Combobox UI interaction itself is left for you to confirm."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: preconditions re-confirmed (Incident Commander already assigned, activation_level=Monitoring). Escalated to Partial via the exact API call the Activation modal's confirm button makes — 200, activation_level now Partial, new Timeline entry with correct from/to detail. The modal's own confirmation copy and danger-tier styling are left for you to judge."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: fetched real marker data through the preview-proxy path using the SAME authenticated call the page makes — this was the exact call blocked by the login gap last round. Now returns base_layer_source: 'agency GIS (agency_gis)' and 2 markers. The map's visual rendering (diamond shapes, status-bar copy, marker styling) is left for you to judge."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: same authenticated call with force_gis_failure=true — returns the exact fallback string 'Schematic base map, offline' with markers still present (not an empty/error state). This was also blocked by the login gap last round. The page's visual fallback rendering is left for you to judge."
    confidence: proven

## Gaps

[none yet]
