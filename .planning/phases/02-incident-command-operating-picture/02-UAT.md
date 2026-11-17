---
status: complete
phase: 02-incident-command-operating-picture
source: [02-VERIFICATION.md, 02-05-SUMMARY.md, 02-06-SUMMARY.md, 02-07-SUMMARY.md]
started: 2026-11-17T10:32:47Z
updated: 2026-11-17T10:40:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Create and Classify an Incident
expected: Signed in as commander@epmp.local, navigate to Incidents > Create Incident. Fill the form (name, type, severity, jurisdiction, description, opened-at) and submit. The browser redirects to the new incident's Workspace, which shows a severity Badge in the page header, a pinned 6-role command panel (all roles "Unassigned"), and Timeline/Tasks/Resources/Reports tabs in that fixed order.
live: gap — same `localhost:8081` OIDC-authority defect blocks reaching a signed-in state through the preview path (see test 2's live line for the full reproduction); the backend create→detail→timeline mechanics were already proven live in the prior round and are unchanged this round
result: issue
reported: "can't even sign in give me exact reason whay this is happening"
severity: blocker

### 2. Assign a Command Role
expected: On incident "UAT-ASSIGN-ROLE Default Agency Flood" (freshly seeded, no role assigned yet), open the Incident Workspace, click "Assign" on the Incident Commander row, pick a person from the Combobox, and submit. The assignment appears immediately in the panel (no page reload) and a new Timeline entry records it with actor and source.
live: gap — `curl` through the SAME port-7777 preview-proxy path a human tester uses (`X-Forwarded-Proto: https`, `X-Forwarded-Host: pivota-preview-probe.example.com`) to `/realms/epmp/.well-known/openid-configuration` → 200 but the body is the SPA's own `index.html` (Vite's catch-all), not Keycloak's OIDC discovery JSON. Direct sandbox-internal `http://127.0.0.1:8081/realms/epmp/.well-known/openid-configuration` → 200 with a real discovery document, confirming Keycloak itself is healthy and only reachable sandbox-internally. `frontend/app/src/auth/oidc-config.ts:20` still hardcodes `KEYCLOAK_AUTHORITY = 'http://localhost:8081/realms/epmp'` (unchanged since the prior round's diagnosis) and `vite.config.ts` still proxies only `/api` — no `/realms`/`/resources`/`/js` entries exist, so `signinRedirect()` sends any real browser to a dead address. This is the exact mechanism diagnosed in `.planning/debug/login-unreachable-localhost-oidc-authority.md`; root cause is unchanged and the fix (`02-08-PLAN.md`) has not yet been executed — its `files_modified` (oidc-config.ts, vite.config.ts, docker-compose.yml, epmp-realm.json) are all still at their pre-fix state.
result: issue
reported: "i cant even see any fronted on port 5173"
severity: blocker

### 3. Activation Level Change (Escalate)
expected: On an incident that already has an Incident Commander assigned ("UAT-ESCALATE-READY Default Agency Wildfire"), open the Activation modal from the PageHeader control, select a level above Monitoring (e.g. Partial), and confirm. The modal shows a danger-tier confirmation with the specific operational consequence and an outcome-named button (not "Yes"/"OK"); after confirming, the displayed activation level updates and a new Timeline entry records the change.
live: gap — `psql -c "SELECT role_title, person_id FROM incident_command_roles WHERE incident_id = (SELECT id FROM incidents WHERE name = 'UAT-ESCALATE-READY Default Agency Wildfire')"` → one row, role_title="Incident Commander", person_id populated (precondition correctly seeded); but `curl` through the port-7777 preview-proxy path to `/realms/epmp/.well-known/openid-configuration` → 200 with the SPA's own index.html instead of Keycloak's discovery document (same login blocker as test 2), so no signed-in session can be reached to drive this flow
result: issue
reported: "Yes — same login issue (user confirmed: let's treat tests 2-5 as blocked by the identical login gap)"
severity: blocker

### 4. Operating Picture Map
expected: Navigate to Operating Picture. The map renders status-coded, shape-distinguished (diamond) markers for the incidents that have a location, plus a status bar showing data age ("As of HH:MM ET") and the real base-layer source ("Base layer: agency GIS (agency_gis)").
live: pass — `GET /operating-picture` (unauthenticated SPA shell route) → 200 through both direct (`127.0.0.1:5173`) and the port-7777 preview-proxy path with forwarded headers; this route itself renders without needing a session per the app's own routing (confirmed: no redirect-to-login observed on this path in `routes_probed`). The underlying `/api/v1/operating-picture/markers` data call DOES require a session and is therefore blocked by the same login gap as test 2 for seeing REAL marker data — but the page itself is reachable
result: issue
reported: "Yes — same login issue (user confirmed: let's treat tests 2-5 as blocked by the identical login gap)"
severity: blocker

### 5. GIS Feed Outage Fallback
expected: Navigate to Operating Picture with `?force_gis_failure=true`. The page still renders; the status bar/banner reads exactly "Schematic base map, offline"; the same incident markers stay visible and clickable.
live: gap — `curl -H "X-Forwarded-Proto: https" -H "X-Forwarded-Host: pivota-preview-probe.example.com" http://127.0.0.1:7777/preview/5173/operating-picture?force_gis_failure=true` → 200 (page shell loads), but `curl .../api/v1/operating-picture/markers?force_gis_failure=true` with no Authorization header → 401 (same login blocker as test 2 — the degraded-mode marker/status-bar content needs the authenticated call this blocks)
result: issue
reported: "Yes — same login issue (user confirmed: let's treat tests 2-5 as blocked by the identical login gap)"
severity: blocker

## Summary

total: 5
passed: 0
issues: 5
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: all preconditions present — "UAT-ASSIGN-ROLE Default Agency Flood" (no command role assigned, located) and "UAT-ESCALATE-READY Default Agency Wildfire" (Incident Commander already assigned, located, activation_level=Monitoring) both already exist from the prior round's seeding; no new seeding needed this round
routes_probed: 5 ok / 0 failed (/, /api/v1/me [401, expected unauthenticated], /incidents, /incidents/new, /operating-picture — all 2xx with forwarded preview headers via port 7777)
cookie: n/a — this app is a Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie on login; iframe-cookie class does not apply
browser_urls: 0 gaps / 0 advisories from the static 0b scan (no client-exposed env vars, no in-source fallbacks, no runtime client config found in this pass); the LOGIN gap itself is tracked as a `## Gaps` entry (test 2), not a browser_urls finding, since it is a hardcoded OIDC-authority literal rather than a client-env/runtime-config pattern
documented_limitations: []
repairs: []
browser_suite: pass (execute) — 02-GATE.md records browser_suite: pass; not re-run here. Note: the existing Playwright suite drives signInThroughKeycloak() via DIRECT sandbox access (127.0.0.1), which is why it passes while the preview-proxy path fails — this is exactly the class the gap-closure plan (02-08-PLAN.md) targets, and 02-08's own must_haves require the existing suite keep passing unchanged after the fix
deploy_check: PASS (cited from prior round — not re-run; no deploy-affecting files changed since)
agent_run: not due (this app calls no model in Phase 2 scope — AI assistance is Phase 6)
3g_origin_gate: pass — `/api/v1/me` via the port-7777 preview proxy returns the same 401 with and without a browser Origin header (route semantics, not an Origin rejection)
3g-i_dev_proxy: gap (re-confirmed, unchanged from prior round) — vite.config.ts's proxy object only has a `/api` entry; `/realms`, `/resources`, `/js` are NOT proxied, so any Keycloak browser-facing path falls through to Vite's SPA catch-all and returns the app shell's own index.html instead of Keycloak content. Live-verified this round through BOTH direct (`127.0.0.1:5173/realms/...`) and the port-7777 preview-proxy path with forwarded headers — identical wrong body in both cases
3d_orphan_pages: none — both Phase 2 routes (/operating-picture, /incidents) have real inbound SideNav links (carried forward from prior round; unchanged)
3f_object_store: skipped (this app has no file storage)
stale_placeholders: 2 findings reviewed, 0 treated as gaps — both in `PlatformMonitoring.tsx` (lines 59, 69), labeled "Phase 1 placeholder", which is past-tense provenance (built during the now-complete Phase 1) not a forward promise to an incomplete phase; consistent with prior round's assessment
dev_log_scan: no new fatal signatures found in this pass
per_test:
  - test: 1
    verdict: fail
    note: "🤖 Auto-check: cannot reach a signed-in state through the preview path (same mechanism as test 2 — see its note). The backend create→detail→timeline mechanics were already proven live in the prior UAT round (201/200/200, exactly 1 Timeline entry with actor+source) and nothing in this round's self-check suggests that machinery changed. This test cannot be completed by a human until the login gap (test 2) is closed."
    confidence: proven
  - test: 2
    verdict: fail
    note: "🤖 Auto-check: reproduced through the exact browser-equivalent path (port-7777 preview proxy, forwarded headers) — requesting Keycloak's own discovery document returns the SPA's index.html instead, 200 but wrong content. Root cause unchanged from the prior round's diagnosis (.planning/debug/login-unreachable-localhost-oidc-authority.md): frontend/app/src/auth/oidc-config.ts:20 still hardcodes KEYCLOAK_AUTHORITY = 'http://localhost:8081/realms/epmp', and vite.config.ts still has no proxy entry for Keycloak's browser-facing paths. A verified fix plan exists (02-08-PLAN.md, gap_closure:true) but has not yet been executed against this code — none of its files_modified show any change from their pre-fix state."
    confidence: proven
  - test: 3
    verdict: fail
    note: "🤖 Auto-check: same login blocker as test 2. Preconditions ARE correctly seeded (an Incident Commander is already assigned to 'UAT-ESCALATE-READY Default Agency Wildfire', activation_level=Monitoring) — the ONLY blocker is reaching a signed-in browser session, not missing data."
    confidence: proven
  - test: 4
    verdict: advisory
    note: "🤖 Auto-check: the /operating-picture route itself loads (200) without requiring sign-in, through both direct and preview-proxy paths — so you CAN navigate here and should see the page shell render. But the real marker data and status-bar text come from an authenticated API call that will fail without a session (same login gap as test 2), so what you see may be an empty/error state rather than the described markers. Judge the test on what you actually see; if it shows no data or an auth error, that is the SAME root-cause gap as test 2, not a separate map-rendering defect."
    confidence: proven
  - test: 5
    verdict: advisory
    note: "🤖 Auto-check: same caveat as test 4 — the route loads, but the degraded-mode marker/status-bar content needs the authenticated markers call. Judge on what you see; an auth-blocked empty state here is the login gap (test 2), not a new GIS-fallback defect."
    confidence: proven

## Gaps

- truth: "A user can log in through the Preview panel the same way a real tester reaches the app"
  status: failed
  reason: "Re-confirmed this round via the browser-equivalent path (port-7777 preview proxy, X-Forwarded-Proto/X-Forwarded-Host headers): requesting /realms/epmp/.well-known/openid-configuration returns 200 with the SPA's own index.html instead of Keycloak's discovery document, in both direct sandbox access and the proxied path. frontend/app/src/auth/oidc-config.ts:20 still hardcodes KEYCLOAK_AUTHORITY = 'http://localhost:8081/realms/epmp' (unchanged from the prior UAT round), and vite.config.ts's dev proxy still has only a /api entry — no /realms, /resources, or /js forwarding exists. Direct sandbox-internal access to Keycloak (127.0.0.1:8081) confirms Keycloak itself is healthy; only browser-reachability of its paths through the app's own served origin is broken. A verified gap-closure plan already exists (02-08-PLAN.md, gap_closure:true, wave 6, depends_on: []) documenting the same root cause plus three compounding infra gaps (Keycloak not trusting forwarded headers, the realm's redirectUris being sandbox-only, Vite's proxy missing the Keycloak paths) and a concrete fix for all four — it has simply not been executed against this code yet."
  severity: blocker
  test: 2
  source: self_check
  confidence: proven
  root_cause: "frontend/app/src/auth/oidc-config.ts:20 — OIDC `authority` is a hardcoded `http://localhost:8081/...` literal, executed by the BROWSER via signinRedirect()'s top-level navigation, not resolved server-side. Compounded by vite.config.ts having no dev-proxy entry for Keycloak's browser-facing paths (/realms, /resources, /js), Keycloak itself not trusting forwarded headers (no KC_PROXY_HEADERS), and the realm's redirectUris allow-listing only localhost:5173/8080."
  artifacts:
    - path: "frontend/app/src/auth/oidc-config.ts"
      issue: "KEYCLOAK_AUTHORITY (line 20) hardcodes a sandbox-internal loopback host:port instead of a same-origin path or a URL derived from window.location, unlike redirect_uri (line 26) in the same file which already does this correctly"
    - path: "frontend/app/vite.config.ts"
      issue: "dev proxy only forwards /api to the backend; no proxy entry exists for Keycloak's browser-facing paths (/realms, /resources, /js) that signinRedirect() needs to reach same-origin"
    - path: "docker-compose.yml"
      issue: "keycloak service has no KC_PROXY_HEADERS / KC_HOSTNAME_STRICT=false / KC_HTTP_ENABLED=true — Keycloak itself does not trust forwarded headers, so it would keep emitting internal-only URLs in its own login-page HTML/redirects even behind a same-origin proxy"
    - path: "backend/keycloak/epmp-realm.json"
      issue: "epmp-app client's redirectUris only allow-lists http://localhost:5173/* and http://localhost:8080/* — sandbox-internal only, not preview-host-aware"
  missing:
    - "Execute 02-08-PLAN.md — a verified gap-closure plan already exists for this exact root cause and has not yet been run"
  debug_session: ".planning/debug/login-unreachable-localhost-oidc-authority.md"
  # test 1 also failed for this identical cause (user: "can't even sign in give me
  # exact reason whay this is happening") — folded in here per the one-cause/one-gap
  # rule rather than duplicated as a second Gaps entry
