---
phase: 02-incident-command-operating-picture
plan: 08
subsystem: auth
tags: [oidc, keycloak, vite, same-origin, preview-proxy, gap-closure]

# Dependency graph
requires:
  - phase: 01-foundation-platform
    provides: "01-10's Keycloak OIDC client (oidc-client-ts, epmp-realm.json) and docker-compose keycloak service — this plan fixes their sandbox-internal-only addressing without touching the auth flow's shape"
provides:
  - "KEYCLOAK_AUTHORITY computed from window.location.origin at call time (frontend/app/src/auth/oidc-config.ts) — same-origin, reachable through whichever proxy actually served the SPA"
  - "Vite dev-proxy entries forwarding Keycloak's browser-facing paths (/realms, /resources, /js) same-origin, with an explicit forwarded-header passthrough (not http-proxy's built-in xfwd:true, which has its own port-pollution bug — see Deviations)"
  - "Keycloak service configured to trust forwarded headers (KC_PROXY_HEADERS=xforwarded, KC_HOSTNAME_STRICT=false) so its own self-issued URLs (discovery issuer, login-page form action, asset hrefs) resolve to whichever origin the request arrived through"
  - "epmp-app client's redirectUris widened to a host-less relative pattern (/auth/callback, /auth/callback/*), validated by Keycloak against whichever origin it resolves per-request — no per-preview-host allow-list entry needed"
affects: [phase-02-uat, phase-03, phase-04, phase-05, phase-06]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Same-origin IdP proxy pattern (runtime-environment.md §9's named Keycloak example) applied for real: SPA-origin OIDC authority + Vite proxy + IdP forwarded-header trust + relative redirect URIs, all four pieces required together"
    - "Vite proxy configure() hook for explicit X-Forwarded-Proto/-Host passthrough, in place of http-proxy's built-in xfwd:true option — xfwd:true unconditionally appends its own X-Forwarded-Port (the proxy's own listening port) even when an upstream hop already set one, corrupting a chained-proxy scenario's computed origin"

key-files:
  created: []
  modified:
    - frontend/app/src/auth/oidc-config.ts
    - frontend/app/vite.config.ts
    - docker-compose.yml
    - backend/keycloak/epmp-realm.json

key-decisions:
  - "KEYCLOAK_AUTHORITY changed from a hardcoded sandbox-internal string to window.location.origin-derived, mirroring the same file's already-correct redirect_uri pattern"
  - "Vite's Keycloak proxy entries use an explicit configure() forwarded-header hook, not http-proxy's xfwd:true option, because xfwd:true's XHeaders() helper always appends the proxy's own listening port to X-Forwarded-Port — discovered empirically during this plan's own Task 2 reproduction, not assumed from documentation"
  - "epmp-app's redirectUris widened to the host-less relative pattern /auth/callback, /auth/callback/* (not a literal preview-domain wildcard, which Keycloak 25.0 empirically rejected) — validated against both a simulated external preview origin and direct sandbox access in this plan's own reproduction"

patterns-established:
  - "Pattern: an IdP running on its own port inside the sandbox needs all four of {SPA-origin-relative authority, same-origin dev-proxy forwarding, IdP forwarded-header trust, relative redirect URIs} together — any one missing reopens the same class of unreachable-login bug for a tester outside the sandbox"

# Metrics
duration: 13min
completed: 2026-11-17
---

# Phase 2 Plan 08: Preview-Proxy-Reachable Keycloak SSO Summary

**Made Keycloak OIDC sign-in work through Pivota's preview proxy by fixing four compounding sandbox-internal-only addressing gaps: a hardcoded `localhost:8081` OIDC authority, a Vite dev-proxy with no Keycloak routes, a Keycloak service that ignored forwarded headers, and a realm redirect-URI allow-list that only trusted two literal sandbox addresses — closing UAT gap ref 2 (blocker).**

## Performance

- **Duration:** 13 min
- **Started:** 2026-11-17T10:58:26Z
- **Completed:** 2026-11-17T11:11:45Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- A real browser reaching the app exclusively through Pivota's `:7777` preview proxy can now complete the full Keycloak username/password OIDC sign-in flow and land on the correct preview-origin callback — proven end-to-end with forged `X-Forwarded-Proto`/`X-Forwarded-Host` headers through the actual proxy infrastructure, not merely inferred
- Zero regression: the existing direct-sandbox Playwright SSO suite (`app-shell.spec.ts`, 4/4 tests) still passes unchanged
- Discovered and fixed a real bug in the plan's own proposed `xfwd: true` approach during Task 2's reproduction (see Deviations) — the plan's literal snippet would have shipped a subtly-wrong fix that still corrupted Keycloak's computed issuer with a bogus port
- Full project build (backend `tsc`, design-system Vite build, app Vite build) passes clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Same-origin OIDC authority + Keycloak forwarded-header trust + relative redirect allow-list** - `1f01363` (fix)
2. **Task 2: End-to-end reproduction + regression (includes the xfwd bugfix discovered during reproduction)** - `adb185d` (fix)

_Note: Task 2 is verification-only per the plan, but its reproduction surfaced a real bug in Task 1's own `vite.config.ts` approach (http-proxy's `xfwd:true`), which was fixed in place and re-verified — tracked as the commit above, not a separate task._

## Files Created/Modified
- `frontend/app/src/auth/oidc-config.ts` - `KEYCLOAK_AUTHORITY` now `${window.location.origin}/realms/epmp}` instead of a hardcoded `http://localhost:8081/realms/epmp`
- `frontend/app/vite.config.ts` - Added `/realms`, `/resources`, `/js` dev-proxy entries targeting Keycloak, with an explicit `configure()` forwarded-header passthrough hook (not `xfwd: true` — see Deviations)
- `docker-compose.yml` - `keycloak` service gained `KC_PROXY_HEADERS=xforwarded` and `KC_HOSTNAME_STRICT=false`
- `backend/keycloak/epmp-realm.json` - `epmp-app` client's `redirectUris` changed from `["http://localhost:5173/*", "http://localhost:8080/*"]` to `["/auth/callback", "/auth/callback/*"]`

## Decisions Made
- `KEYCLOAK_AUTHORITY` derivation mirrors the same file's already-correct `redirect_uri` pattern (`window.location.origin` at call time) — no new pattern invented, just applied consistently within the one file where it was previously asymmetric
- Rejected a literal preview-domain wildcard for `redirectUris` after Keycloak 25.0 empirically rejected it (`Invalid parameter: redirect_uri`); the host-less relative pattern is the form that actually validates, confirmed by direct test
- Chose an explicit `configure()` hook over http-proxy's `xfwd: true` for the Keycloak proxy entries after discovering `xfwd: true` corrupts the forwarded port in a chained-proxy scenario (see Deviations below) — the hook passes through only `X-Forwarded-Proto`/`X-Forwarded-Host`, matching exactly what this plan's own threat register (T-02-16) describes trusting

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `vite.config.ts`'s plan-specified `xfwd: true` corrupts Keycloak's computed issuer with a spurious port**
- **Found during:** Task 2 (the plan's own end-to-end preview-proxy reproduction)
- **Issue:** The plan's Task 1 action specified `xfwd: true` on the three new Keycloak proxy entries. Task 2's reproduction (forging `X-Forwarded-Proto`/`X-Forwarded-Host` at the real `:7777` entry point) showed Keycloak's discovery `issuer` came back as `https://fake-preview-host.pivota.dev:5173/realms/epmp` — with Vite's own internal port (5173) appended — instead of the expected `https://fake-preview-host.pivota.dev/realms/epmp`. Root-caused by reading Vite's bundled http-proxy source (`node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js`, the `XHeaders` function): `options.xfwd` unconditionally *appends* its own computed `X-Forwarded-Port` (derived from Vite's own `Host` header, i.e. Vite's own listening port) to whatever `X-Forwarded-Port` an upstream hop already set, rather than only setting it when absent. Keycloak (correctly) folds `X-Forwarded-Port` into its computed origin when present, so this directly corrupted its self-issued URLs.
- **Fix:** Replaced `xfwd: true` on all three Keycloak proxy entries with an explicit `configure()` hook (`forwardHeaders`) that sets `X-Forwarded-Proto`/`X-Forwarded-Host` verbatim from the incoming request when present, falling back to Vite's own connection info only when absent — and deliberately never touches `X-Forwarded-Port` at all, since Keycloak doesn't need it once `X-Forwarded-Host` already carries any non-default port the real external origin requires.
- **Files modified:** `frontend/app/vite.config.ts`
- **Verification:** Re-ran Task 2's full reproduction after the fix — Keycloak's discovery `issuer` now correctly reads `https://fake-preview-host.pivota.dev/realms/epmp` (no spurious port) through the real `:7777` → Vite → Keycloak chain. Full login round-trip completed, redirecting to `https://fake-preview-host.pivota.dev/auth/callback?...&iss=https%3A%2F%2Ffake-preview-host.pivota.dev%2Frealms%2Fepmp&code=...`. Re-ran the existing `app-shell.spec.ts` Playwright suite (4/4 pass, no regression). Re-ran `npx tsc --noEmit` (clean) and the full project build (`npm run build` across backend/design-system/app — exit 0).
- **Committed in:** `adb185d` (Task 2's own commit, since this was discovered and fixed during Task 2's reproduction before that task's commit landed)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 bug)
**Impact on plan:** The plan's own `xfwd: true` snippet, if shipped unmodified, would have left a residual defect identical in class (though smaller in blast radius) to the one this plan set out to fix — a real tester's browser via `:7777` would have received an `issuer` carrying Vite's own internal port, which a strict OIDC client could reject as an issuer mismatch depending on how literally it compares the discovery document's `issuer` against the `iss` claim in returned tokens. Caught only because Task 2 deliberately reproduces through the *real* `:7777` entry point with a *simulated external* origin (no port in the forged `X-Forwarded-Host`) rather than assuming the proxy chain is transparent — exactly the kind of assumption this plan's own objective called out as insufficient ("documentation alone" vs. "confirmed by direct test"). No scope creep: the fix stayed within the same single file Task 1 already modified.

## Issues Encountered

- During the reproduction's step 6 (full login POST), curl's own cookie-jar logic correctly refused to resend Keycloak's `Secure`-flagged session cookies over the plain-HTTP connection used to reach `:7777` from inside the sandbox — a curl test-harness limitation (a real browser's actual HTTPS connection to Pivota's edge sends `Secure` cookies normally), not a product defect. Worked around by extracting `Set-Cookie` values from the auth-request response and passing them back explicitly via an outbound `Cookie:` header on the login POST, bypassing curl's jar-based Secure-cookie policy while still exercising the exact same Keycloak-side logic a real browser's request would hit.

## User Setup Required

None - no external service configuration required. The fix lives entirely in already-running compose services and already-installed frontend/backend code.

## Next Phase Readiness
- UAT gap ref 2 (blocker: "A user can log in") is closed — proven by a scripted reproduction through the real `:7777` proxy infrastructure with a simulated external preview origin, completing a full username/password login and landing on that origin's own `/auth/callback`
- Phase 2 UAT tests 2-5 (all previously blocked on "can't log in as commander@epmp.local") are unblocked for re-run
- The `db`/`nats`/`opa`/`keycloak` compose stack and the native backend/frontend dev processes were left running on exit per this plan's own verify block (wave 6, the last wave in Phase 2 — no sibling plan's compose lifecycle can race it)
- No blockers for Phase 3 planning

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-17*

## Self-Check: PASSED

- All 4 `files_modified` paths confirmed present on disk via `[ -f ]`
- Both task commits (`1f01363`, `adb185d`) confirmed present via `git log --oneline --grep="02-08"`
- Build check: `npm run build` (root, cascading to backend/design-system/app workspaces) → exit 0
- `## Known Stubs` section below: none found (grep for TODO/FIXME/placeholder/not-implemented/coming-soon across all 4 changed files returned zero matches)

## Known Stubs

None found.
