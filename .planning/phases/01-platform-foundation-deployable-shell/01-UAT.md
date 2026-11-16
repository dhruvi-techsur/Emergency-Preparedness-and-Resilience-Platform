---
status: complete
phase: 01-platform-foundation-deployable-shell
source: [01-VERIFICATION.md]
started: 2026-11-16T11:37:51Z
updated: 2026-11-16T11:39:19Z
---

## Current Test

[testing complete]

## Tests

### 3. Live boot_smoke — app starts and answers /healthz and / with only PORT set
expected: GET /healthz returns 200 (no auth required) within 30 seconds of process start; GET / returns 200 and the real SPA index.html (or a redirect to it), not a 404 or blank page.
live: pass — `node pivota-deploy-check.cjs --dir .` (D4/D5/C4/C6, this session, fresh container, only PORT=8080 env set, caps dropped, 1g limit) -> GET /healthz=200 within budget; GET /=200 real SPA; also re-confirmed on PORT=8081. Separately, this session's .pivota/start-dev.sh (now generated — the thing the previous round's gap named as missing) was boot-smoked twice (initial boot + a fix-and-reboot after a design-system/frontend dep-scan race was found and fixed in the wrapper) and currently answers 127.0.0.1:5173->200 and 127.0.0.1:8080->200 live.
result: pass
verified_by: self_check

### 4. Live browser_suite — full Playwright suite against a self-served stack
expected: All 16 assertions across app-shell.spec.ts (4), admin-users-roles.spec.ts (5), admin-platform-sso.spec.ts (4), contrast-audit.spec.ts (3) pass against a live, freshly-booted stack — proving real SSO sign-in, role-scoped SideNav/header/theme, RBAC-gated admin screens, audit-log read-only rendering, SSO-config/API-clients/federation-grants flows, and WCAG AA contrast across all three themes.
live: pass — `cd frontend/app && CI=true npx playwright test --workers=1 --max-failures=25 --reporter=json` (this session, against the live compose+native stack .pivota/start-dev.sh booted) -> `expected=16 unexpected=0 skipped=0`. Includes app-shell.spec.ts test 1 ("Sign-in flow lands in a role-scoped shell, not a generic landing page") — a real Keycloak-redirect sign-in — and all 3 contrast-audit.spec.ts theme tests, all passing.
result: pass
verified_by: self_check

## Summary

total: 2
passed: 2
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200
data: all preconditions present — seeded admin@epmp.local (secops_admin) via backend/scripts/seed.ts at this boot; Keycloak epmp realm import provides the matching IdP credential
routes_probed: 6 ok / 0 failed
cookie: n/a (session is a Bearer token in sessionStorage, not a cookie — no SameSite/iframe concern for this app's auth model)
browser_urls: none
documented_limitations: none
deploy_check: PASS
repairs: []
per_test:
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: this session generated .pivota/start-dev.sh (the artifact the previous UAT round's root-cause analysis identified as missing) via the init-dev-server workflow — catalog entry `compose` (datastores-only compose + native npm-workspaces app, per compose.md Shape B), with a synthesized multi-process block supervising frontend/design-system (build+watch), backend (migrate+seed+dev), and frontend/app (vite dev). Boot-smoked twice: the first boot surfaced a real race (frontend/app's Vite dep-scan started before frontend/design-system's one-time build finished, intermittently throwing \"Failed to resolve entry for package @epmp/design-system\" during the dep-scan window) which was fixed by making the design-system build run synchronously before the multi-process block starts any child — removing the race by construction rather than retrying around it. The second boot (after the fix) bound both ports cleanly with no resolution errors, migrated+seeded the DB, and answered healthz/root/data endpoints all non-5xx. Separately, the platform's own deploy-check (`pivota-deploy-check.cjs`, which is the actual DEPLOY-01 boot_smoke scenario — a cold container with only PORT set) passed all 14 checks including D4 (cold boot, only PORT=8080), D5 (GET /healthz -> 200), C6 (GET / -> 200 real SPA), and C4 (also answers on a different PORT)."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: ran the full 16-assertion Playwright suite (4 specs) against the live stack booted by the same .pivota/start-dev.sh this round generated — 16/16 passed, 0 unexpected, 0 skipped, including the real Keycloak SSO sign-in flow and all 3 WCAG contrast-audit theme tests. This directly and formally closes the two gate-level gaps (`boot_smoke`, `browser_suite`) that both prior UAT rounds (diagnosed) and 01-VERIFICATION.md's re-verification left as the sole remaining `human_verification` items — both were blocked purely on the absence of `.pivota/start-dev.sh`, which this session's init-dev-server run produced."
    confidence: proven

## Gaps

[none yet]
