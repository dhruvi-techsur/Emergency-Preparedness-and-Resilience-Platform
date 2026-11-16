---
status: diagnosed
phase: 02-incident-command-operating-picture
source: [02-VERIFICATION.md, 02-05-SUMMARY.md, 02-06-SUMMARY.md, 02-07-SUMMARY.md]
started: 2026-11-16T16:22:50Z
updated: 2026-11-16T19:00:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Create and Classify an Incident
expected: Signed in as commander@epmp.local, navigate to Incidents > Create Incident. Fill the form (name, type, severity, jurisdiction, description, opened-at) and submit. The browser redirects to the new incident's Workspace, which shows a severity Badge in the page header, a pinned 6-role command panel (all roles "Unassigned"), and Timeline/Tasks/Resources/Reports tabs in that fixed order.
live: pass — `POST /api/v1/incidents {name, type:"Flood", severity:"Watch", jurisdiction_id:"Default Agency"}` → 201 with the new incident; `GET /api/v1/incidents/{id}` → 200 full detail; `GET /api/v1/incidents/{id}/timeline` → 200, exactly 1 entry ("Incident created", actor="Incident Commander", source="EPMP")
result: skipped

### 2. Assign a Command Role
expected: On incident "UAT-MANUAL-ASSIGN Default Agency Hazmat" (freshly created, no role assigned yet), open the Incident Workspace, click "Assign" on the Incident Commander row, pick a person from the Combobox, and submit. The assignment appears immediately in the panel (no page reload) and a new Timeline entry records it with actor and source.
live: pass — `GET /api/v1/incidents/personnel` → 200 (14 active users); `POST /api/v1/incidents/{assign-role-id}/command-roles {role_title:"Incident Commander", person_id}` → 201; re-`GET` on that incident showed `commander` populated and `command_roles[0]` filled; `GET .../timeline` grew from 1 to 2 entries, the new one titled "Incident Commander assigned to Incident Commander" with actor+source
result: issue
reported: "cant test anything no login or signing option is there"
severity: blocker

### 3. Activation Level Change (Escalate)
expected: On an incident that already has an Incident Commander assigned, open the Activation modal from the PageHeader control, select a level above Monitoring (e.g. Partial), and confirm. The modal shows a danger-tier confirmation with the specific operational consequence and an outcome-named button (not "Yes"/"OK"); after confirming, the displayed activation level updates and a new Timeline entry records the change.
live: pass — `POST .../activation {activation_level:"Partial"}` (no confirmed flag) → 400 `ACTIVATION_CONFIRMATION_REQUIRED` (confirms the server-side gate fires regardless of UI); `POST .../activation {activation_level:"Partial", confirmed:true}` → 200, `activation_level` became "Partial"; `GET .../timeline` recorded "Activation changed to Partial" with actor+source; separately confirmed the commander-gate: the SAME request against an incident with NO commander assigned → 422 `NO_COMMANDER_ASSIGNED`, activation level unchanged. (State reverted to Monitoring after this check so the human sees a clean starting point.)
result: issue
reported: "Yes — I can't log in"
severity: blocker

### 4. Operating Picture Map
expected: Navigate to Operating Picture. The map renders status-coded, shape-distinguished (diamond) markers for the incidents that have a location, plus a status bar showing data age ("As of HH:MM ET") and the real base-layer source ("Base layer: agency GIS (agency_gis)").
live: pass — `GET /api/v1/operating-picture/markers` → 200, 2 markers returned (`tone:"danger"` for the Critical incident, `tone:"warning"` for the Elevated one, both `shape:"diamond"`), `status_bar.base_layer_source: "agency GIS (agency_gis)"`. Screenshot: `.pivota/uat-shots/4-operating-picture.png` confirms the same visually (2 diamond markers, legend, status bar text).
result: issue
reported: "Yes — I can't log in"
severity: blocker

### 5. GIS Feed Outage Fallback
expected: Navigate to Operating Picture with `?force_gis_failure=true`. The page still renders; the status bar/banner reads exactly "Schematic base map, offline"; the same incident markers stay visible and clickable.
live: pass — `GET /api/v1/operating-picture/markers?force_gis_failure=true` → 200, the SAME 2 markers still present, `status_bar.base_layer_source: "Schematic base map, offline"` (exact string match). Screenshot: `.pivota/uat-shots/5-operating-picture-degraded.png` confirms visually — a "Schematic base map, offline" badge plus a hatched-pattern base fill, with both diamond markers still rendered identically to the normal-mode screenshot.
result: issue
reported: "Yes — I can't log in"
severity: blocker

## Summary

total: 5
passed: 0
issues: 4
pending: 0
skipped: 1

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: seeded 2 preconditions (commander jurisdiction_scope + 2 located incidents) via pivota_spec-data-doctor, committed `a951774`; additionally created 1 more fresh unassigned incident during this self-check (UAT-MANUAL-ASSIGN) so Test 2 has a clean untouched target after my own Test 2/3 API verification consumed the original one
routes_probed: 5 ok / 0 failed (/, /api/v1/me, /incidents, /incidents/new, /operating-picture — all 2xx with forwarded preview headers)
cookie: n/a — this app is a Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie on login; iframe-cookie class does not apply
browser_urls: 0 gaps / 0 advisories (0b static scan: no client-exposed env vars, no in-source fallbacks, no runtime client config, no documented limitations; 3e live-flow scan over /, /api/v1/me, /incidents, /incidents/new, /operating-picture with forwarded preview headers: 0 gaps / 0 advisories)
documented_limitations: []
repairs:
  - kind: file
    what: "backend/scripts/seed.ts — commander@epmp.local pre-provisioned with Default Agency jurisdiction_scope at seed time (data doctor), replacing a prior test-fixture-only direct-Postgres grant in 02-07's own e2e spec"
    resolution: committed a951774
browser_suite: pass (execute) — 02-GATE.md records browser_suite: pass; not re-run here
deploy_check: PASS — all 14 checks (D1-D7, C1-C4, C6) passed: `docker build .` succeeds, USER 10001, cold boot with only PORT set, GET /healthz -> 200, GET / -> 200, answers on a reassigned PORT, Trivy found no fixable CRITICAL CVEs
agent_run: not due (this app calls no model in Phase 2 scope — AI assistance is Phase 6)
3g_origin_gate: pass — /api/v1/me via the port-7777 preview proxy returns the same 401 with and without a browser Origin header (route semantics, not an Origin rejection); the SPA shell itself returns 200 through the proxy with an Origin header set
3g-i_dev_proxy: advisory only — vite.config.ts's `/api` proxy targets `http://localhost:8080`; the backend runs as a NATIVE process on this sandbox host (confirmed via `pgrep`), not as a separate compose service (docker compose only runs db/nats/opa/keycloak, infra dependencies), so the loopback target correctly resolves — live-verified: `GET http://127.0.0.1:5173/api/v1/me` through the Vite proxy returned 200 with the real user payload
3d_orphan_pages: none — both Phase 2 routes (/operating-picture, /incidents) have real inbound SideNav links confirmed via `GET /api/v1/me/nav-config` ("Monitor" and "Activate" groups) and match the UX-Mockup's own Navigation Map
3f_object_store: skipped (this app has no file storage — no storage compose service, no S3/MinIO/multer dependency, no multipart route)
stale_placeholders: 3 regex hits reviewed, 0 treated as gaps — `api-clients.ts:105`'s "Phase 2+" is a forward-looking code comment about a not-yet-built external API-client-auth consumer, unrelated to this phase's actual incident-ops/GIS scope (not a promise this phase broke); `PlatformMonitoring.tsx:59,69`'s "Phase 1 placeholder" labels are past-tense provenance (built during Phase 1, Phase 1 is in fact complete) not a forward promise to a still-incomplete phase
dev_log_scan: 1 advisory (not a gap) — the frontend's Vite dep-scanner logged repeated `Failed to resolve entry for package "@epmp/design-system"` warnings during this sandbox's cold start / dev-server restarts; this is Vite's pre-bundling optimizer misreading the monorepo workspace alias, NOT a real resolution failure — verified live: `GET /src/main.tsx` -> 200, `GET /@fs/.../design-system/src/index.ts` -> 200, and every real route (/, /incidents, /operating-picture) serves the full SPA shell at 200 throughout
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: the backend create→detail→timeline flow is fully proven live (201/200/200, exactly 1 Timeline entry with actor+source). The visual parts — severity Badge placement, pinned 6-role panel, fixed tab order — need your eyes; judge the test on what you see."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: the backend assign-role flow is fully proven live (personnel lookup 200, assignment 201, commander field + command_roles populated, exactly 1 new Timeline entry). The visual parts — Combobox search, no-reload update, 'Currently assigned' text — need your eyes."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: both server-side gates are proven live — escalating without confirmed:true returns 400 ACTIVATION_CONFIRMATION_REQUIRED, and escalating an incident with no commander returns 422 NO_COMMANDER_ASSIGNED with the level unchanged. A confirmed escalation on a commanded incident succeeds and records one new Timeline entry. The visual parts — modal consequence copy, danger tier, outcome-named buttons — need your eyes."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: the markers endpoint returns 2 real status-coded diamond markers and the real GIS-sourced status bar string. Screenshot .pivota/uat-shots/4-operating-picture.png shows the same on the real page. Judge on what you see."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: forcing the GIS failure still returns the same 2 markers with the exact degraded status string 'Schematic base map, offline'. Screenshot .pivota/uat-shots/5-operating-picture-degraded.png confirms the page visually survives the outage with markers intact. Judge on what you see."
    confidence: proven

## Gaps

- truth: "A user can log in"
  status: failed
  reason: "User reported: cant test anything no login or signing option is there. Login is delivered by Phase 1 (Platform Foundation & Deployable Shell); every test that needs a signed-in user is blocked on it. Diagnosed and independently re-confirmed by a debug agent (.planning/debug/login-unreachable-localhost-oidc-authority.md): frontend/app/src/auth/oidc-config.ts:20 hardcodes KEYCLOAK_AUTHORITY = 'http://localhost:8081/realms/epmp', used by oidc-client-ts's signinRedirect() to do a full top-level browser navigation. 'localhost:8081' is sandbox-internal-only addressing — reachable from server-side code and a browser physically inside the sandbox (confirmed: Keycloak itself is healthy, serving a valid OIDC discovery doc at 127.0.0.1:8081), but NOT from the human tester's real browser, which only reaches the app through Pivota's port-7777 preview proxy. The navigation goes nowhere renderable, indistinguishable from 'no login option exists.' Three compounding factors found: (1) Keycloak's compose service has no KC_PROXY_HEADERS/forwarded-header trust, so even a same-origin proxy fix needs Keycloak itself reconfigured; (2) the realm's registered redirectUris only allow-list localhost:5173/8080, not preview-host-aware; (3) vite.config.ts's dev proxy covers only /api (backend), never Keycloak's browser-facing paths (/realms, /resources, /js). The diagnostic smoking gun: the SAME file's redirect_uri (line 26) already correctly derives from window.location.origin — proving the author knew the correct browser-safe pattern but didn't apply it to the authority URL."
  severity: blocker
  test: 2
  source: user
  confidence: proven
  root_cause: "frontend/app/src/auth/oidc-config.ts:20 — OIDC `authority` is a hardcoded `http://localhost:8081/...` literal, executed by the BROWSER via signinRedirect()'s top-level navigation, not resolved server-side. 'localhost' always means the browser's own machine in that context, never the sandbox. Confirmed via: Vite serving the literal string unchanged to any requesting browser; Keycloak's own healthy OIDC discovery document proving the address is sandbox-internal-only; and the asymmetry with the same file's already-correct window.location.origin-derived redirect_uri."
  artifacts:
    - path: "frontend/app/src/auth/oidc-config.ts"
      issue: "KEYCLOAK_AUTHORITY (line 20) hardcodes a sandbox-internal loopback host:port instead of a same-origin path or a URL derived from window.location, unlike redirect_uri (line 26) in the same file which already does this correctly"
    - path: "docker-compose.yml"
      issue: "keycloak service has no KC_PROXY_HEADERS / KC_HOSTNAME_STRICT=false / KC_HTTP_ENABLED=true — Keycloak itself does not trust forwarded headers, so it would keep emitting internal-only URLs in its own login-page HTML/redirects even behind a same-origin proxy"
    - path: "backend/keycloak/epmp-realm.json"
      issue: "epmp-app client's redirectUris only allow-lists http://localhost:5173/* and http://localhost:8080/* — sandbox-internal only, not preview-host-aware"
    - path: "frontend/app/vite.config.ts"
      issue: "dev proxy only forwards /api to the backend; no proxy entry exists for Keycloak's browser-facing paths (/realms, /resources, /js) that signinRedirect() needs to reach same-origin"
  missing:
    - "Add a Vite dev-proxy entry forwarding Keycloak's browser-facing paths (/realms, /resources, /js) same-origin through port 5173"
    - "Set KC_PROXY_HEADERS=xforwarded, no KC_HOSTNAME, KC_HOSTNAME_STRICT=false, KC_HTTP_ENABLED=true on the keycloak compose service so it stops emitting internal-only URLs"
    - "Make KEYCLOAK_AUTHORITY origin-relative (mirroring how redirect_uri already derives from window.location.origin) instead of a pinned host:port literal"
    - "Widen the realm's redirectUris to accept the preview host pattern, and have the backend (sso.ts) accept a per-request X-Forwarded-Proto/X-Forwarded-Host-derived issuer alongside the configured internal one for JWKS/token validation"
  debug_session: ".planning/debug/login-unreachable-localhost-oidc-authority.md"
