---
status: diagnosed
trigger: "Investigate issue: no-sign-in-option-reachable — User testing Phase 1's SSO sign-in flow in a browser reported \"there is no sign in option\" — the app appears to have no UI/sign-in at all."
created: 2026-11-16T09:08:00Z
updated: 2026-11-16T09:15:00Z
---

## Current Focus

hypothesis: Independently verify prior-cause claim — preview session routes to port 8080 (backend), which has no frontend/app/dist in native dev mode and returns a bare JSON 404; real app + sign-in flow lives correctly on port 5173.
test: Directly curl both ports; inspect backend/src/static.ts; inspect RouteGuard.tsx + oidc-config.ts for frontend-side defects; run the actual Playwright SSO suite live against the running stack; check CORS config; re-confirm .pivota/start-dev.sh absence.
expecting: 8080 -> bare 404 JSON, 5173 -> real app shell HTML; Playwright SSO suite passes; no CORS/Keycloak misconfig found; start-dev.sh absent.
next_action: none — root cause confirmed, no fix (goal: find_root_cause_only)

## Symptoms

expected: In a real browser, signing in via Keycloak against the epmp realm redirects to Keycloak login, then back to /auth/callback, landing in the role-scoped AppShell (SideNav + header + theme).
actual: User reports no sign-in option is visible/reachable at all.
errors: None reported by the user directly, but server-side: GET / on the backend's port (8080, the port declared in pivota-deploy.yaml) returns a bare JSON 404: {"error_code":"NOT_FOUND","message":"Frontend build not found."}
reproduction: Test 3 and Test 4 in Phase 1's UAT (.planning/phases/01-platform-foundation-deployable-shell/01-UAT.md)
started: Discovered during UAT, phase 1 (first phase of this project — first init-dev-server run for this repo, so .pivota/start-dev.sh does not exist yet)

## Eliminated

- hypothesis: Frontend-side bug in RouteGuard / sign-in trigger logic (e.g. RouteGuard fails to call signIn(), or oidc-client-ts misconfigured)
  evidence: Read RouteGuard.tsx end-to-end — unauthenticated state correctly triggers `void signIn()` via useEffect. Read oidc-config.ts — authority/client_id/redirect_uri all correctly point at Keycloak's epmp realm on port 8081. Ran the live Playwright suite (app-shell.spec.ts) against the real running stack on port 5173 — all 4 assertions passed in 1.8s, including the full Keycloak redirect → login → /auth/callback → role-scoped AppShell flow. No frontend defect found.
  timestamp: 2026-11-16T09:14:00Z

- hypothesis: CORS misconfiguration blocking API calls between frontend (5173) and backend (8080), which could independently produce a broken/invisible sign-in experience
  evidence: backend/src/server.ts registers `@fastify/cors` with `origin: true` (fully permissive, explicitly commented as intentional for dev/preview cross-origin access). No CORS-related errors in dev log. Not a contributing factor.
  timestamp: 2026-11-16T09:15:00Z

- hypothesis: Keycloak itself misconfigured or unreachable (realm not imported, container down, wrong port)
  evidence: `docker ps` shows project-keycloak-1 healthy, mapped 8081->8080. `curl -i http://127.0.0.1:8081/` returns 302 to /admin/ (expected Keycloak behavior). Live Playwright suite's signInThroughKeycloak() helper completes a real Keycloak login round-trip successfully in all 4 tests. Not a contributing factor.
  timestamp: 2026-11-16T09:15:00Z

## Evidence

- timestamp: 2026-11-16T09:08:34Z
  checked: curl -i http://127.0.0.1:8080/ (backend port, declared in pivota-deploy.yaml)
  found: "HTTP/1.1 404 Not Found, body: {\"error_code\":\"NOT_FOUND\",\"message\":\"Frontend build not found.\"}"
  implication: Confirms the declared platform port returns a bare JSON 404 with zero UI/HTML — exactly what a user would perceive as "no sign in option at all."

- timestamp: 2026-11-16T09:08:34Z
  checked: curl -i http://127.0.0.1:5173/ (Vite dev server port)
  found: "HTTP/1.1 200 OK, real HTML document with <title>EPMP</title>, Vite HMR client script, theme-preference guard comment"
  implication: Confirms the real application — including whatever triggers Keycloak sign-in — is live and correctly served on 5173, not 8080.

- timestamp: 2026-11-16T09:08:40Z
  checked: ls .pivota/ and ls .pivota/start-dev.sh
  found: ".pivota/ contains only boot-ctl.sh; start-dev.sh does not exist (exit code 2 / No such file or directory)"
  implication: Confirms this is the project's first init-dev-server run — no canonical dev-mode startup/port script has been generated yet, so the platform has only pivota-deploy.yaml's port:8080 to route a preview session to.

- timestamp: 2026-11-16T09:08:40Z
  checked: cat pivota-deploy.yaml
  found: "port: 8080 (the only port declared anywhere in the deploy manifest)"
  implication: Confirms 8080 — the backend's port — is the ONLY port the platform's preview routing mechanism knows about in the absence of .pivota/start-dev.sh.

- timestamp: 2026-11-16T09:08:45Z
  checked: ps aux | grep -E "node|vite|fastify"
  found: "Both backend (tsx watch src/server.ts) and frontend (vite --host 0.0.0.0) processes are running concurrently, confirmed via a shell wrapper invoking `npm run dev` (root package.json script), not via .pivota/start-dev.sh (which doesn't exist)."
  implication: The dev stack IS fully up and functional on both ports simultaneously — this is purely a routing/port-declaration gap, not a broken dev boot.

- timestamp: 2026-11-16T09:08:45Z
  checked: /tmp/pivota-dev.log
  found: "Log shows backend logger explicitly warning at startup: {\"msg\":\"\\\"root\\\" path \\\"/home/daytona/project/frontend/app/dist\\\" must exist\"} immediately before binding 0.0.0.0:8080, and a subsequent GET / request logged with responseTime and statusCode 404."
  implication: Direct confirmation from the backend's own startup log that frontend/app/dist is missing (never built in native dev mode) and that the observed 404 on port 8080 is the backend's own static-file-serving fallback behaving exactly as coded — not a crash, not an unhandled exception, just structurally nothing to serve.

- timestamp: 2026-11-16T09:10:00Z
  checked: backend/src/static.ts (full file, 54 lines)
  found: "FRONTEND_DIST resolves to frontend/app/dist (a sibling build-output directory). Code comments explicitly document that this only exists after `vite build` (production), and a code comment (lines 48-51) explicitly anticipates this exact failure mode: \"frontend build output missing entirely (e.g. backend-only dev run without `npm run build -w frontend/app` yet) — degrade to a plain 404 rather than crashing the request.\" The catch-all correctly never shadows /api/* or /healthz."
  implication: static.ts is correctly implemented per its own documented intent — the backend code is not a defect; it behaves exactly as designed when frontend/app/dist is absent, which is expected and correct for native dev mode. This rules out a backend application-code bug.

- timestamp: 2026-11-16T09:11:00Z
  checked: frontend/app/vite.config.ts
  found: "Vite dev server binds 0.0.0.0:5173 explicitly 'per runtime-environment.md §2 so the sandbox's preview proxy... can reach it.' Proxies /api to http://localhost:8080 with changeOrigin, so same-origin API fetches from the frontend work transparently in dev."
  implication: Confirms 5173 is the intended, documented dev-mode entrypoint for a preview session, and that API calls made from the frontend correctly reach the backend via Vite's proxy — no cross-origin friction. This is consistent with the prior cause: 5173 (not 8080) is where a human should have been routed.

- timestamp: 2026-11-16T09:11:30Z
  checked: frontend/app/src/auth/RouteGuard.tsx (full file, 169 lines) and frontend/app/src/auth/oidc-config.ts (full file, 43 lines)
  found: "RouteGuard correctly resolves GET /api/v1/me on mount; on no-token or 401 it transitions to 'unauthenticated' state, and a dedicated useEffect calls `void signIn()` which triggers `userManager.signinRedirect()` — a real browser redirect to Keycloak. oidc-config.ts correctly targets KEYCLOAK_AUTHORITY = 'http://localhost:8081/realms/epmp', client_id 'epmp-app', PKCE-enabled by default for a public client."
  implication: The sign-in trigger mechanism in application code is correctly implemented — no frontend defect causing a missing/unreachable sign-in option when the app itself is actually loaded (i.e., when on port 5173).

- timestamp: 2026-11-16T09:12:00Z
  checked: Live run of `npx playwright test app-shell.spec.ts --workers=1` against the currently-running dev stack (baseURL http://localhost:5173 per playwright.config.ts)
  found: "4 passed (1.8s) — including test 1 'Sign-in flow lands in a role-scoped shell, not a generic landing page' which drives a REAL Keycloak redirect/login/callback round-trip via signInThroughKeycloak() helper, and asserts the role-scoped SideNav (Admin/Users) is visible afterward."
  implication: Independently and directly verified (not taking the prior agent's word for it) — the full real SSO sign-in flow works correctly end-to-end when accessed on port 5173. This directly refutes any hypothesis that the sign-in flow itself is broken in application code.

- timestamp: 2026-11-16T09:15:00Z
  checked: `docker ps` (container status) and `curl -i http://127.0.0.1:8081/`
  found: "project-keycloak-1 healthy, port 8081->8080 mapped. curl returns 302 Found -> Location: http://127.0.0.1:8081/admin/ (Keycloak's expected root-redirect behavior)."
  implication: Keycloak itself is healthy and correctly configured/reachable — ruled out as a contributing cause.

- timestamp: 2026-11-16T09:15:30Z
  checked: backend/src/server.ts CORS registration
  found: "app.register(cors, { origin: true }) with an explicit comment: 'Permissive CORS for dev — the Pivota preview reaches this app from another origin...'"
  implication: CORS is fully permissive by deliberate design; not a contributing cause, and does not mask or compound the port-routing issue in any way."

## Resolution

root_cause: "No .pivota/start-dev.sh exists yet (confirmed absent — first init-dev-server run for this project, verified independently). The only declared port a preview session can route to is pivota-deploy.yaml's port:8080, which is the Fastify backend's port, not the Vite frontend dev server's port (5173). In native dev mode (`npm run dev`, no docker build run), backend/src/static.ts's catch-all handler correctly (by its own documented design) returns a bare JSON 404 ({\"error_code\":\"NOT_FOUND\",\"message\":\"Frontend build not found.\"}) because frontend/app/dist only exists after a production `vite build`, which the dev script never runs. The real app — Vite's dev server on 5173, with a correctly-implemented RouteGuard that triggers Keycloak sign-in via oidc-client-ts's signinRedirect() — is confirmed live, correct, and independently verified end-to-end: curl returns the real <title>EPMP</title> shell, and a fresh live run of app-shell.spec.ts's Playwright-driven version of this exact SSO flow (Keycloak redirect -> login -> /auth/callback -> role-scoped AppShell) passes 4/4 in 1.8s against the actually-running stack. CORS is permissive by design and Keycloak is healthy and correctly configured — neither is a contributing or masking factor. The human was simply never routed to port 5173; they landed on port 8080's bare JSON 404 body, which renders as literally no UI and no sign-in option at all. This is NOT a Phase 1 application-code defect — it is a gap in the init-dev-server workflow, which has not yet generated .pivota/start-dev.sh for this (first) phase of this project."
fix: ""
verification: "Independently reproduced by a second agent (not the one that first diagnosed it): confirmed via direct curl of both ports, direct inspection of backend/src/static.ts (behaves exactly as documented/intended), direct inspection of frontend-side auth code (RouteGuard.tsx, oidc-config.ts — both correctly implemented), a live re-run of the full Playwright SSO e2e suite against the currently-running stack (4/4 pass), and explicit checks for CORS misconfiguration and Keycloak health/config (both ruled out as factors). No competing or masking explanation found."
files_changed: []
