---
phase: 01-platform-foundation-deployable-shell
verified: 2026-11-16T06:10:09Z
status: human_needed
score: 7/7 must-haves code-verified; 4/7 carry unresolved live-boot/browser gate gaps requiring human-driven confirmation
human_verification:
  - test: "Start the app with only PORT set (generate/use .pivota/start-dev.sh or docker run the built image with only -e PORT=8080), then GET /healthz"
    expected: "200 response, no auth required, within 30 seconds of process start"
    why_human: "not run — boot_smoke: skipped in GATE.md (no .pivota/start-dev.sh existed at execution time — first phase, dev-script generated at verify time). The verifier may not start long-running servers (Step 7b constraint)."
    not_run: boot_smoke
  - test: "GET / against the booted app (same boot as above)"
    expected: "200 and the real SPA index.html (or a redirect to it), not a 404 or blank page"
    why_human: "not run — boot_smoke: skipped in GATE.md. Depends on the same live boot as above."
    not_run: boot_smoke
  - test: "Run the project's full Playwright browser suite (frontend/app/e2e/*.spec.ts) against a freshly self-served stack (playwright.config.ts currently has no webServer block, so this needs the dev stack already running — docker compose up + npm run dev, or wait for a webServer block to be added)"
    expected: "All 13 assertions across app-shell.spec.ts (4), admin-users-roles.spec.ts (5), admin-platform-sso.spec.ts (4) pass — proving real SSO sign-in, role-scoped SideNav/header/theme, RBAC-gated admin screens, audit-log read-only rendering, and SSO-config/API-clients/federation-grants flows all work against a live browser."
    expected_detail: "Individual plan SUMMARYs (01-10, 01-11, 01-12) already report these exact suites passing against the live compose stack during their own execution (9/9 combined in 01-11, 13/13 combined in 01-12) — this is real evidence the flows worked at build time, but it is not the same as this phase-level verification's own browser_suite gate check passing, which was skipped (GATE.md: browser_suite: skipped, blocked on boot_smoke also being skipped)."
    why_human: "not run — browser_suite: skipped in GATE.md, cascading from boot_smoke being skipped (nothing to point a browser at). The verifier may not start servers/browsers (Step 7b constraint)."
    not_run: browser_suite
  - test: "Sign in via SAML2/OIDC SSO against a configured identity provider (Keycloak epmp realm) in a real browser and confirm landing in the role-scoped AppShell (SideNav + header + theme), not a generic landing page"
    expected: "Redirect to Keycloak login, successful auth, redirect back to /auth/callback, AppShell renders with role-correct SideNav groups from GET /api/v1/me/nav-config"
    why_human: "Visual/interactive flow verification — code-level wiring is confirmed (oidc-config.ts PKCE flow, sso.ts JWKS verification + JIT provisioning, AppShell.tsx nav-config query) and 01-10-SUMMARY.md reports this exact flow passing via Playwright against the live stack, but the phase-level gate's own boot_smoke/browser_suite checks that would independently reconfirm this were skipped."
  - test: "Switch between light/dark/contrast themes in a real browser and run an automated contrast checker (e.g. axe-core or Lighthouse) against each theme's rendered palette"
    expected: "Instant theme switch (no reload), WCAG AA contrast ratios maintained in all three themes"
    why_human: "Visual/perceptual verification of contrast cannot be done by static grep. tokens.css defines three complete theme palettes and foundations.test.tsx has 23 unit tests confirming per-theme custom-property cascading differs per tone, but no automated contrast-ratio audit tool was run against actual rendered pixels in any theme."
gaps:
  - truth: "The app boots as a real running process answering /healthz and / with only PORT set, within 30s"
    status: partial
    reason: "Code-level implementation is complete and correct (healthz.ts is dependency-free and unauthenticated, static.ts serves the SPA with a client-side-routing fallback, migrate-runner.ts no-ops cleanly when DATABASE_URL is unset so server.ts still starts) and 01-13-SUMMARY.md reports the platform's own pivota-deploy-check.cjs returned DEPLOY-CHECK: PASS (all of D1-D7, C1-C4, C6) during plan execution. However this phase-level verification's own boot_smoke gate check did not run (GATE.md: boot_smoke: skipped — no .pivota/start-dev.sh existed at wave-gate time, since it is generated at verify time for a first phase) and the verifier itself may not start servers (Step 7b). No live re-confirmation exists at the phase-verification layer."
    artifacts:
      - path: "backend/src/modules/platform/healthz.ts"
        issue: "Code confirmed correct (no auth, no DB/NATS/OPA dependency) but never observed live by this verification"
      - path: "backend/src/static.ts"
        issue: "Code confirmed correct (SPA fallback, not shadowing /api or /healthz) but never observed live by this verification"
    missing:
      - "A live boot_smoke run: start the container (docker run with only -e PORT=8080, or the generated .pivota/start-dev.sh) and curl /healthz and / directly"
  - truth: "The full project browser suite passes against a live stack"
    status: partial
    reason: "browser_suite: skipped in GATE.md, cascading from boot_smoke also being skipped (nothing to point a browser at — playwright.config.ts has no self-serving webServer block). Individual plan SUMMARYs (01-10/11/12) report all 13 Playwright assertions passing against the live compose stack during their own execution, which is real build-time evidence but is not the same as this phase-level gate's own browser_suite check passing."
    missing:
      - "A live browser_suite run: bring up docker-compose + npm run dev, then npx playwright test across all three e2e specs"
human_needed_summary: "All 7 success criteria are fully and substantively implemented in the codebase — verified by direct code reading (SSO/OIDC flow, RBAC+OPA, append-only audit trigger, Table's built-in Skeleton/EmptyState/Alert states reused by every list screen, three-theme token system, OpenAPI document generation, NATS JetStream event bus with idempotent webhook delivery+retry, Dockerfile, pivota-deploy.yaml) and by a real `docker build .` + image inspection run directly in this verification. The only gap is that this phase-level verification could not itself observe a LIVE boot or browser run (both gates were skipped at wave-gate time, for structural reasons specific to being the first phase), so criteria 1, 3, 4, and 6 — anything requiring a running process or a browser — are marked for human/Verify confirmation rather than claimed as independently re-proven here, even though the individual plans' own Playwright runs during execution are strong supporting evidence."
---

# Phase 1: Platform Foundation & Deployable Shell Verification Report

**Phase Goal:** Every persona can sign in once via agency SSO into a single, themeable application shell with role-based access and a full audit trail, and the repository runs as a real, deployable, Postgres-backed service from the first commit.
**Verified:** 2026-11-16T06:10:09Z
**Status:** human_needed
**Re-verification:** No — initial verification

## Gate Evidence (cited, not re-litigated)

- `01-GATE.md`: `gate_status: passed`, all 6 waves' build+tests `pass`, `review_blockers_open: 0`, `shadowed_sources: 0`. `boot_smoke: skipped` and `browser_suite: skipped` — both explicitly explained in GATE.md's own header: this is the first phase, so no `.pivota/start-dev.sh` existed at wave-gate time (it's generated at verify time), and `browser_suite` cascaded to skipped because `boot_smoke` had nothing to point a browser at (confirmed: `playwright.config.ts` has no `webServer` block).
- `01-REVIEW.md`: iteration 3, **0 blockers, 0 warnings**, phase status "clean." The one re-reviewed finding (W-new-1, a record-authority edit-mode key-field mutability bug) was verified genuinely fixed by both static reading and a live exercise against the running backend during the review itself. Cited directly, not re-reviewed.
- `node pivota_spec-tools.cjs verify gate-evidence 1 --raw` confirms: `gate_status: passed`, `not_run: [boot_smoke (skipped), browser_suite (skipped)]`, `problems: []`, `passed: true` at the wave-gate level. Per the skipped-gate protocol, these two `not_run` entries hold back any truth that needs a live process or browser — handled below as `human_verification` entries with `not_run:` markers, not silently assumed passing.

## Goal Achievement

### Observable Truths (Success Criteria 1-7)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User signs in via SAML2/OIDC SSO, lands in role-scoped shell (SideNav/header/theme) | ✓ CODE-VERIFIED / ? LIVE UNCERTAIN | `oidc-config.ts` (PKCE auth-code flow vs Keycloak `epmp` realm), `sso.ts` (JWKS fetch+verify, JIT provisioning, role resolution, audit `login` record, `user.login` event publish), `AppShell.tsx` (nav-config query keyed on role.id, SideNav/Breadcrumbs/ThemeSwitcher render). All real, substantive, wired. 01-10-SUMMARY.md reports a 4-assertion Playwright suite proving this exact flow passed against the live stack during execution — but this phase's own `boot_smoke`/`browser_suite` gates (which would independently reconfirm it) were skipped. See human_verification. |
| 2 | Admin manages users/roles/RBAC from Admin Console; every security-relevant action is append-only audited | ✓ VERIFIED | `admin-users.ts`/`admin-roles.ts`/`admin-sso-config.ts` all call `AuditService.record` on create/update/role-permission-edit/record-view (`record_view` found in `admin-sso-config.ts:93`, satisfying "record access" auditing). `audit.ts` is the sole INSERT call-site (by discipline + comment). DB-level enforcement: `backend/migrations/1700000000000_auth-org-schema.js` creates a `BEFORE UPDATE OR DELETE` trigger (`trg_audit_log_immutable`) that raises an exception on any mutation attempt — this is real, tested at the Postgres layer, not just an app-layer convention. `admin-audit.ts` additionally registers explicit PATCH/DELETE routes that return 403 `AUDIT_LOG_IMMUTABLE`, confirmed exercised with a real 403 in GATE.md's wave-6 test log (`"url":"/api/v1/admin/audit-log" ... "statusCode":403`). RBAC enforced via `rbac.ts`'s `requirePermission` (fresh per-request `users.status` check + real OPA `checkPermission` call), confirmed exercised live in GATE.md logs (real 403s on unauthorized actions). Fully live-exercised already, in the backend test suite run during gates — no further human verification needed for this criterion. |
| 3 | Every list/table/panel renders loading/empty/error states; theme switch is instant, WCAG-safe | ✓ CODE-VERIFIED / ? CONTRAST UNCERTAIN | `Table.tsx` genuinely implements all three states internally (6-row `Skeleton` on `loading`, `Alert`+retry button on `error` while still showing last-known rows, `EmptyState` on empty) — every list screen (`UsersList.tsx` etc.) wires these directly from its own query's `isLoading`/`isError`/`refetch`/empty-check state, not reimplemented per-screen. `ThemeSwitcher.tsx` sets `data-theme` on `documentElement` synchronously before any network call (instant, no-reload). `tokens.css` defines complete light/dark/contrast palettes; `foundations.test.tsx` has 23 unit tests confirming per-theme CSS custom properties cascade correctly and differ across themes. No automated WCAG contrast-ratio audit (e.g. axe-core/Lighthouse against rendered pixels) was run in any theme — see human_verification. |
| 4 | Versioned OpenAPI REST surface at `GET /api/v1/me`, bearer-token protected, ≥1 event published + consumed by a registered webhook subscriber | ✓ VERIFIED | `spec.ts` registers `@fastify/swagger` on the root instance (fp-wrapped so `onRoute` sees all sibling routes) and mounts `GET /api/v1/openapi.json`; `routes.ts`'s `/api/v1/me` carries a `schema:` block feeding the generated doc. `rbac.ts`'s `requirePermission` is bearer-token gated (`Authorization: Bearer <jwt>`, `jose`-verified). Event bus: `nats-client.ts` connects to real NATS JetStream, `sso.ts` calls `publishEvent('user.login', ...)` on every login. `webhook-delivery-worker.ts` is a genuinely complete implementation: durable JetStream pull-consumer, DB-enforced idempotency (`UNIQUE(subscription_id, idempotency_key)` + race-safe re-select), exponential backoff with nak/redelivery on failure, ack only on success. `eventbus.test.ts` (`describe('event bus: publish -> durable delivery -> webhook subscriber')`) exercises this end-to-end against real NATS+Postgres — confirmed passing in GATE.md's wave-6 retry-with-services-up log. All live-exercised already in the test suite — no further human verification needed. |
| 5 | `docker build .` succeeds at repo root; image runs as numeric non-root USER | ✓ VERIFIED (directly, in this verification) | Ran `docker build -t epmp-phase1-verify:latest .` in this sandbox: succeeded, all stages (deps→build→deps-prod→runtime) completed, image exported. `docker inspect --format '{{.Config.User}}'` → `10001` (numeric, non-root — matches `Dockerfile`'s `addgroup -g 10001 epmp && adduser ... -u 10001` + `USER 10001`). `EXPOSE 8080` confirmed via `docker inspect .Config.ExposedPorts`. |
| 6 | Started with only PORT set, `GET /healthz` → 200 unauthenticated within 30s; `GET /` shows main page or redirects | ? LIVE UNCERTAIN | Code fully confirmed correct: `healthz.ts` has zero preHandler/DB/NATS/OPA dependency, returns 200 unconditionally; `static.ts` serves `frontend/app/dist` with a `setNotFoundHandler` SPA fallback that explicitly never shadows `/api/*` or `/healthz`; `migrate-runner.ts` exits 0 (no-op) when `DATABASE_URL` is unset so the `&&`-chained `server.js` still starts in the Dockerfile's CMD. 01-13-SUMMARY.md reports the platform's own `pivota-deploy-check.cjs` returned `DEPLOY-CHECK: PASS` (D1-D7, C1-C4, C6) during plan execution — but this phase-level verification's own `boot_smoke` gate (which independently re-runs exactly this check) was skipped, and Step 7b forbids this verifier from starting a server itself. See human_verification. |
| 7 | `pivota-deploy.yaml` reads port 8080/healthPath /healthz/size small/database postgres; app migrates schema at start; dev-server preview still starts | ✓ VERIFIED | Read `pivota-deploy.yaml` directly: `port: 8080`, `healthPath: /healthz`, `size: small`, `database: postgres` — exact match, 4 lines, no extraneous content. `migrate-runner.ts` runs `node-pg-migrate`'s programmatic `runner()` against `backend/migrations/` when `DATABASE_URL` is set, invoked first in the Dockerfile's CMD chain (`migrate-runner.js && server.js`) — this is a real schema migration at start, not a no-op when a DB is actually configured. `docker-compose.yml` (dev stack) is untouched by this phase's plans (01-13-SUMMARY.md explicitly notes "without touching the existing docker-compose.yml/npm run dev local dev workflow") — confirmed no diff to it in this phase's file list. |

**Score:** 7/7 criteria have fully substantive, wired code implementations. 3 of them (1, 3, 6 fully; 4 partially via criterion 1's SSO-flow sub-claim) have a live-process/browser-driven component this phase-level verification could not independently observe because `boot_smoke` and `browser_suite` were both `skipped` at the wave-gate level — a structural consequence of being the first phase (no `.pivota/start-dev.sh` existed yet; Playwright has no self-serve `webServer` block). These are **not** claimed as ✓ VERIFIED here; they are handed to human/Verify with explicit `not_run:` markers per the skipped-gate protocol.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `Dockerfile` | Multi-stage build, non-root numeric USER | ✓ VERIFIED | `docker build .` succeeds in this sandbox; `USER 10001` confirmed via `docker inspect` |
| `pivota-deploy.yaml` | port 8080/healthPath /healthz/size small/database postgres | ✓ VERIFIED | Read directly — exact match |
| `backend/src/modules/platform/healthz.ts` | Unauthenticated `GET /healthz` → 200 | ✓ VERIFIED (code) / ? UNCERTAIN (live) | No preHandler, no dependency on DB/NATS/OPA env vars; never observed live |
| `backend/src/static.ts` | `GET /` serves SPA or redirects | ✓ VERIFIED (code) / ? UNCERTAIN (live) | `setNotFoundHandler` SPA fallback, correctly scoped to never shadow `/api/*`/`/healthz`; never observed live |
| `backend/src/db/migrate-runner.ts` | Migrates schema at start | ✓ VERIFIED | No-ops cleanly without `DATABASE_URL`, runs real `node-pg-migrate` when set |
| `backend/src/modules/auth-org/sso.ts` | OIDC/SAML2 SSO callback handling | ✓ VERIFIED | Real JWKS verification, JIT provisioning, audit + event publish |
| `backend/src/modules/auth-org/rbac.ts` | RBAC + bearer-token auth middleware | ✓ VERIFIED | Fresh per-request status check, real OPA policy call |
| `backend/src/modules/auth-org/audit.ts` + DB trigger | Append-only audit log | ✓ VERIFIED | Sole INSERT call-site + DB-level `BEFORE UPDATE OR DELETE` exception-raising trigger |
| `backend/src/openapi/spec.ts` | Versioned OpenAPI document at `/api/v1/openapi.json` | ✓ VERIFIED | Real `@fastify/swagger` document assembly, confirmed 200 in GATE.md logs |
| `backend/src/modules/integration-gateway/nats-client.ts` + `webhook-delivery-worker.ts` | Event bus + webhook delivery | ✓ VERIFIED | Real JetStream stream/consumer, idempotent delivery with backoff/retry, exercised end-to-end in `eventbus.test.ts` |
| `frontend/design-system/src/data/Table.tsx` | Loading/empty/error states for every list | ✓ VERIFIED | Genuinely implements all 3 states internally via `Skeleton`/`EmptyState`/`Alert`, reused by every admin list screen |
| `frontend/design-system/tokens/tokens.css` | Light/dark/contrast theme tokens | ✓ VERIFIED | Full palettes for all 3 themes, 23 unit tests confirming per-theme cascading |
| `frontend/app/src/app-shell/AppShell.tsx` + `ThemeSwitcher.tsx` | Role-scoped shell, instant theme switch | ✓ VERIFIED (code) / ? UNCERTAIN (live/visual) | Instant `data-theme` set before network call; role-scoped nav query; never observed in a real browser by this verification |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `sso.ts` | `audit.ts` | `AuditService.record(user.id, 'login')` | ✓ WIRED | Called directly in `handleSsoCallback` |
| `sso.ts` | `nats-client.ts` | `publishEvent('user.login', ...)` | ✓ WIRED | Called with `.catch()` graceful degradation |
| `admin-users.ts`/`admin-roles.ts`/`admin-sso-config.ts` | `audit.ts` | `AuditService.record(...)` on create/update/view | ✓ WIRED | Confirmed via grep + live 200/201/403 responses in GATE.md logs |
| `rbac.ts` | `opa-client.ts` | `checkPermission({role_id, feature, action})` | ✓ WIRED | Real OPA HTTP call, confirmed live 403s in GATE.md logs |
| `UsersList.tsx` (and sibling admin screens) | `Table.tsx` | `loading=`/`error=`/`empty=` props from query state | ✓ WIRED | Direct prop pass-through from `useQuery`'s `isLoading`/`isError`/`refetch` |
| `ThemeSwitcher.tsx` | `tokens.css` | `document.documentElement.dataset.theme = next` | ✓ WIRED | Sets the exact attribute `tokens.css` selectors key off (`[data-theme="..."]`) |
| `nats-client.ts` publish | `webhook-delivery-worker.ts` consume | JetStream `EPMP_EVENTS` stream, durable `webhook-delivery` consumer | ✓ WIRED | Confirmed end-to-end in `eventbus.test.ts`, passing with real NATS/Postgres in GATE.md wave-6 retry log |
| `Dockerfile` CMD | `migrate-runner.js` → `server.js` | `&&` chain | ✓ WIRED | No-ops without `DATABASE_URL`, so chain always reaches `server.js` |
| `main.tsx` routes | `AppShell.tsx` / admin pages | React Router nested routes under `AppShell` | ✓ WIRED | Confirmed via 01-11/01-12 SUMMARY route-wiring notes + Playwright assertions during execution |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|-----------------|
| F0 (shell/loading-empty-error/theme) | ✓ SATISFIED (code) / ? LIVE for visual+contrast | No blocking code issue; live contrast audit not run |
| F8 (admin console: users/roles/audit) | ✓ SATISFIED | Fully live-exercised in GATE.md test logs |
| F10 (API registry/event bus/webhooks) | ✓ SATISFIED | Fully live-exercised in `eventbus.test.ts` |
| F16-SSO | ✓ SATISFIED (code) / ? LIVE for browser-driven OIDC redirect | No blocking code issue; phase-level browser_suite gate skipped |
| DEPLOY-01 | ✓ SATISFIED (code+docker-build) / ? LIVE for boot_smoke | `docker build .` + image inspection done directly in this verification; live boot not run at phase-gate level |

### Anti-Patterns Found

None blocking. Scanned all phase SUMMARYs' `## Known Stubs` sections (all 13 plans): every one reports either "None found" or explicitly-documented, plan-text-mandated cosmetic no-ops (disabled global-search box, disabled alerts bell, two hardcoded Phase-1-scope platform-health metrics (`failed_login_rate=0`, `uptime_pct=100`) with inline hints explaining why, and one interim `TODO` comment for a not-yet-built `Tooltip` component with a working native-`title` fallback already in place). None of these defeat any of the 7 success criteria — all are reviewed and classified correctly as cosmetic by the executing plans, consistent with the independent code reading done in this verification.

### Human Verification Required

1. **Live `boot_smoke`: app starts and answers `/healthz`/`/` with only `PORT` set**
   **Test:** Start the built image (or `.pivota/start-dev.sh` once generated) with only `PORT=8080` in the environment; `curl /healthz` and `curl /` within 30s.
   **Expected:** `/healthz` → 200, no auth, within 30s; `/` → 200 serving the real SPA (or a redirect to it).
   **Why human:** `boot_smoke: skipped` in GATE.md — no `.pivota/start-dev.sh` existed at wave-gate time for this first phase. This verifier may not start long-running servers (Step 7b). Code-level implementation is fully confirmed correct by direct reading.
   **not_run:** boot_smoke

2. **Live `browser_suite`: full Playwright suite against a self-served stack**
   **Test:** Bring up `docker compose up` + backend + Vite dev server, then run `npx playwright test` across `app-shell.spec.ts`, `admin-users-roles.spec.ts`, `admin-platform-sso.spec.ts` (13 assertions total).
   **Expected:** All 13 assertions pass, as they did when the individual plans (01-10/11/12) ran them live during execution.
   **Why human:** `browser_suite: skipped` in GATE.md, cascading from `boot_smoke` skipped (nothing to point a browser at — `playwright.config.ts` has no `webServer` block). This verifier may not start servers/browsers.
   **not_run:** browser_suite

3. **SSO sign-in visual/interactive flow**
   **Test:** In a real browser, sign in via Keycloak against the `epmp` realm and confirm landing in the role-scoped AppShell.
   **Expected:** Redirect to Keycloak, successful auth, redirect to `/auth/callback`, AppShell renders with correct role-scoped SideNav.
   **Why human:** Visual/interactive confirmation; code wiring fully confirmed, but the phase-level gates that would reconfirm this live were skipped.

4. **WCAG contrast compliance across all three themes**
   **Test:** Run an automated contrast-ratio tool (axe-core/Lighthouse) against the app rendered in `light`, `dark`, and `contrast` themes.
   **Expected:** WCAG AA (or stricter, per design-system spec) contrast ratios hold in all three themes.
   **Why human/tooling:** Perceptual/rendered-pixel verification; `tokens.css` defines complete palettes and unit tests confirm correct per-theme CSS custom-property cascading, but no rendered-contrast audit has been run.

### Gaps Summary

No code-level gaps were found — every one of the 7 success criteria has a fully substantive, correctly-wired implementation, confirmed by direct code reading (not SUMMARY-trusting) across SSO/OIDC, RBAC+OPA, append-only audit (both DB-trigger and app-layer), design-system loading/empty/error states, theme tokens, OpenAPI generation, and NATS JetStream event bus + idempotent webhook delivery. A real `docker build .` was run directly in this verification and succeeded with a correctly-configured non-root numeric `USER`. `pivota-deploy.yaml` was read directly and matches exactly.

The sole open items are **process-level, not code-level**: this phase's own `boot_smoke` and `browser_suite` gate checks were both `skipped` at wave-gate time (GATE.md), for reasons specific to being the very first phase (no generated dev-start script yet; no self-serving Playwright `webServer` config yet). Per the skipped-gate protocol, a skipped check is never evidence — so criteria 1 (SSO→shell, browser-driven half), 3 (visual theme/contrast half), 4 (criterion itself is backend-only and IS fully live-verified; only the frontend-adjacent browser_suite reconfirmation is missing), and 6 (live boot) are not claimed ✓ VERIFIED here even though the individual plans' own Playwright runs during execution (01-10/11/12 SUMMARYs) are real, reported, live evidence that these flows worked at build time. Four `human_verification` entries with explicit `not_run:` markers hand these to Verify to drive live, rather than asking a person to re-read a Dockerfile or trust a SUMMARY's self-report.

---

_Verified: 2026-11-16T06:10:09Z_
_Verifier: Claude (pivota_spec-verifier)_
