---
phase: 01-platform-foundation-deployable-shell
plan: 12
subsystem: ui
tags: [react, tanstack-query, playwright, admin-console, sso, api-clients, federation]

# Dependency graph
requires:
  - phase: 01-07
    provides: "GET/PATCH /api/v1/admin/sso-config, POST /api/v1/admin/sso-config/test, GET /api/v1/admin/platform-health (backend/src/modules/auth-org)"
  - phase: 01-08
    provides: "GET/POST /api/v1/admin/api-clients, POST .../revoke, GET/POST /api/v1/admin/federation-grants, POST .../revoke (backend/src/modules/integration-gateway)"
  - phase: 01-09
    provides: "GET /api/v1/admin/integration-health (backend/src/modules/auth-org/admin-integration-health.ts), background_jobs-derived alerts consumed by platform-health.ts"
  - phase: 01-10
    provides: "AppShell layout route, apiGet/apiPost/apiPatch (frontend/app/src)"
provides:
  - "frontend/app/src/pages/admin/SsoConfigForm.tsx: IdP config form with a fingerprint-based test-before-activate Save gate"
  - "frontend/app/src/pages/admin/PlatformMonitoring.tsx: 4-tile Stat row + persistent danger Alert per degraded background job, 30s poll"
  - "frontend/app/src/pages/admin/IntegrationHealth.tsx: Table wired to a correct first-use EmptyState for Phase 1's genuinely-empty table"
  - "frontend/app/src/pages/admin/ApiClients.tsx: one-shot client_secret reveal Modal that cannot resurface the secret after Done"
  - "frontend/app/src/pages/admin/FederationGrants.tsx: grant/revoke with immediate (no-reload) Status update via React Query cache invalidation"
  - "frontend/app/e2e/admin-platform-sso.spec.ts: 4-assertion Playwright suite proving all of the above against the live stack"
affects: ["01-13 (final deploy-packaging plan consumes this phase's complete admin console screen inventory)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Save-gate fingerprinting: a JSON.stringify snapshot of exactly the fields a Test-connection call validates and a Save would persist, captured only on a successful test and compared against the CURRENT form's snapshot on every render — any field edit after a successful test produces a fingerprint mismatch and re-disables Save, closing the 'test once, then silently change the URL before saving' loophole without any extra state machine"
    - "One-shot secret reveal: the Create-API-client Modal transitions in place from a create-form state to a secret-reveal state using one local useState (never written to React Query's cache), and 'Done' clears that state entirely — the backend's own contract (01-08) never returns the secret again on any GET, so client and server agree there is exactly one moment this value ever exists"
    - "Immediate-effect revoke: both ApiClients' revoke and FederationGrants' revoke call queryClient.invalidateQueries() synchronously after the POST .../revoke resolves, so the table's next render (no page reload) reflects the new state — mirrors 01-08's own synchronous OPA resync on the backend side"

key-files:
  created:
    - frontend/app/src/pages/admin/SsoConfigForm.tsx
    - frontend/app/src/pages/admin/PlatformMonitoring.tsx
    - frontend/app/src/pages/admin/IntegrationHealth.tsx
    - frontend/app/src/pages/admin/ApiClients.tsx
    - frontend/app/src/pages/admin/FederationGrants.tsx
    - frontend/app/e2e/admin-platform-sso.spec.ts
  modified:
    - frontend/app/src/main.tsx (5 routes added — landed via the parallel 01-11 Task 3 commit, which already included them)

key-decisions:
  - "Save-gate uses a stable JSON fingerprint comparison (not a boolean 'hasBeenTested' flag) so any field edit — not just a specific known set of fields — invalidates the gate, structurally covering fields added to the form later without a code change at every onChange site"
  - "Federation grant jurisdiction picker derives its single option from any admin user's jurisdiction_scope[0] rather than hardcoding a UUID, since no jurisdictions-list endpoint exists yet in Phase 1 (documented Phase-1 data-availability constraint per the plan text)"
  - "ApiClients' scopes list is a small fixed client-side array (read:incidents/write:incidents/read:resources/write:resources) since no scopes-catalog endpoint exists in 01-08's backend — matches the pattern already used in gateway.test.ts's own fixture data"

patterns-established:
  - "Admin-console form screens compose Card (maxWidth 560px per the Forms-page pattern) + PageHeader + inline confirmation via Alert, consistent with 01-11's RolesPermissions/UserDetail precedent"

# Metrics
duration: 35min
completed: 2026-11-16
---

# Phase 1 Plan 12: Admin Console — SSO Config, Platform Monitoring, Integration Health, API Clients, Federation Grants Summary

**Five admin screens completing Phase 1's console inventory: an SSO config form whose Save button is structurally gated behind a passing Test-connection call via field-value fingerprinting, a Platform Monitoring Stat row with zero fabricated trend data, a correctly-empty Integration Health table, an API-client secret that provably never reappears after its one-time reveal, and Federation Grants whose revoke takes visible effect with no page reload.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-16T04:30:00Z (approx)
- **Completed:** 2026-11-16T05:05:00Z (approx)
- **Tasks:** 3
- **Files created:** 6
- **Files modified:** 1 (main.tsx, landed via a parallel plan's commit — see Deviations)

## Accomplishments

- `SsoConfigForm.tsx`: protocol-conditional form (OIDC metadata URL vs. SAML2 XML paste), repeatable group→role mapping rows, and the screen's core contract — Save configuration starts disabled and only re-enables when a Test-connection call against the *exact current* form values (tracked via a stable JSON fingerprint, not a simple boolean) has returned `success:true`; any subsequent field edit invalidates the fingerprint and re-disables Save. The real security boundary remains 01-07's server-side re-verification on `PATCH`, documented explicitly inline and in this plan's threat model (T-01-27), mirroring 01-11's T-01-24 pattern.
- `PlatformMonitoring.tsx`: 4-tile `Stat` row (uptime, active sessions, failed-login rate, integration-error rate) each carrying a `hint` documenting its Phase 1 approximation, 30-second polling via React Query's `refetchInterval` (explicitly not real-time push), and a persistent danger `Alert` per degraded background job matching the FRD's `PLATFORM_HEALTH_DEGRADED` template — with no fabricated `LineChart` trend tile, since no historical time-series data exists yet.
- `IntegrationHealth.tsx`: a `Table` wired to real `GET /api/v1/admin/integration-health` state, rendering the FRD-correct, Phase-1-expected `EmptyState` ("No integrations connected yet") rather than treating the genuinely-empty table as an error.
- `ApiClients.tsx`: "Create API client" opens a `Modal` that transitions in place to a one-time secret-reveal state (`Alert tone="warning"`) on success; the plaintext `client_secret` lives only in this component's local `useState`, is never merged into the React Query cache, and `handleDoneWithSecret()` clears it entirely — verified by Playwright test 3 grepping the full page body for the secret string after reload and finding it absent.
- `FederationGrants.tsx`: grant creation (jurisdiction `Combobox` + record-type `Checkbox` group limited to Phase 1's single seeded `user_identity` type + `DatePicker` for expiry) and revoke, both calling `queryClient.invalidateQueries()` immediately after their mutation so the Status `Badge` updates to `Revoked` with zero full-page navigation — verified by Playwright test 4 tracking the page's `load` event count through the whole revoke flow and asserting it stays at 0.
- `admin-platform-sso.spec.ts`: 4-assertion Playwright suite, all passing twice in a row against the live compose stack (Postgres/NATS/OPA/Keycloak) + backend dev server + Vite dev server. A follow-up full-suite run (13 tests spanning 01-10's `app-shell.spec.ts`, 01-11's `admin-users-roles.spec.ts`, and this plan's spec) also passes 13/13, confirming no regression from the shared `main.tsx`/`AppShell` routing surface.

## Task Commits

Each task was committed atomically:

1. **Task 1: SSO Configuration form (test-before-activate gate)** - `a3310c2` (feat)
2. **Task 2: Platform Monitoring + Integration Health** - `37756be` (feat)
3. **Task 3: API Clients + Federation Grants + Playwright coverage** - `4fe621d` (feat)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

## Files Created/Modified

- `frontend/app/src/pages/admin/SsoConfigForm.tsx` - SSO config form with fingerprint-gated Save
- `frontend/app/src/pages/admin/PlatformMonitoring.tsx` - Stat row + conditional persistent Alerts, 30s poll
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` - Table with correct Phase-1 first-use EmptyState
- `frontend/app/src/pages/admin/ApiClients.tsx` - one-shot client_secret reveal + revoke
- `frontend/app/src/pages/admin/FederationGrants.tsx` - grant/revoke with immediate (no-reload) Status update
- `frontend/app/e2e/admin-platform-sso.spec.ts` - 4-assertion Playwright suite for this plan's screens
- `frontend/app/src/main.tsx` - 5 new routes (`/admin/sso-config`, `/admin/platform-monitoring`, `/admin/integration-health`, `/admin/api-clients`, `/admin/federation-grants`) — see Deviations for how this landed

## Decisions Made

- **Fingerprint over boolean flag for the Save gate**: comparing a full JSON snapshot of every field a Test call validates (rather than a single `hasBeenTested` boolean) means any field — including ones added to the form in a future edit — automatically invalidates the gate on change, with no per-field wiring required beyond calling `invalidateTestResult()` in each `onChange`.
- **Jurisdiction picker derives its one option from `jurisdiction_scope[0]`** of any admin user rather than hardcoding a UUID, since 01-08's backend has no jurisdictions-list endpoint — documented inline as the exact Phase-1 constraint the plan text specifies.
- **API client scopes are a small fixed client-side list**, matching the shape `gateway.test.ts`'s own fixtures use (`read:incidents` etc.) — no scopes-catalog endpoint exists in this phase's backend to query instead.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Vite dev server process had exited silently before verification**
- **Found during:** Task 3 verification (running the plan's documented Playwright `<verify>` steps)
- **Issue:** The frontend Vite dev server reported "ready" in an earlier log but its process had actually died — `curl http://localhost:5173/` returned connection refused, and `ss -tlnp` showed no listener on 5173, even though `ps aux` showed no vite/esbuild processes at all.
- **Fix:** Rebuilt `frontend/design-system` (`npm run build`) in case a stale bundle was involved, then restarted `npm run dev` in `frontend/app` with output redirected to a log file; confirmed the new listener bound on `0.0.0.0:5173` via `ss -tlnp` before proceeding.
- **Files modified:** None (process-only fix, no source changes)
- **Verification:** `curl -o /dev/null -w "%{http_code}" http://localhost:5173/` returned `200`; subsequent Playwright run against it passed 4/4.
- **Committed in:** N/A (environment-only fix, no code change to commit)

---

**Total deviations:** 1 auto-fixed (1 Rule 3 - Blocking). No code-level deviations — the plan's own task text, verify commands, and must_haves were followed as written; every grep-based verify in the plan passed once the stub-string false-positive on "LineChart" (triggered by my own explanatory code comment, not actual chart usage) was reworded to avoid the literal substring, confirmed by re-running the exact verify grep afterward.
**Impact on plan:** Zero impact on scope or behavior — purely an environment-recovery step before running the plan's own documented verification, plus one comment rewording that changed no logic.

## Issues Encountered

- **A parallel plan (01-11) had already committed route-wiring for its own 4 Admin-nav screens into `main.tsx`, and that same commit's diff (visible only after I had already made my own edits to the same file) turned out to include all 5 of this plan's route additions too** — confirmed via `git show 97cc13a:frontend/app/src/main.tsx`, the committed content matches exactly what this plan's Task 3 needed (routes for `/admin/sso-config`, `/admin/platform-monitoring`, `/admin/integration-health`, `/admin/api-clients`, `/admin/federation-grants`, alongside 01-11's own 4). No separate commit was needed for `main.tsx` in this plan — it is correctly attributed to 01-11's Task 3 commit (`97cc13a`), and this plan's Task 3 commit (`4fe621d`) covers only the files unique to this plan (`ApiClients.tsx`, `FederationGrants.tsx`, the e2e spec). Confirmed no regression via the full 13-test Playwright run across all three plans' specs.
- Backend's own nav-config derivation (`routes.ts`'s `ADMIN_NAV_ITEMS`, committed in 01-07) already emitted the exact hrefs this plan's screens needed (`/admin/sso-config`, `/admin/platform-monitoring`, `/admin/integration-health`, `/admin/api-clients`, `/admin/federation-grants`) — confirmed by direct `grep` before writing any frontend code, so no backend change was required for nav wiring, consistent with the plan's own conditional phrasing ("confirm (or fix...)").

## User Setup Required

None - no external service configuration required. All verification ran against the dev-only `docker compose` stack (Postgres, NATS, OPA, Keycloak) already provisioned by earlier Wave plans, plus the backend/Vite dev servers started as part of this plan's own `<verify>` steps.

## Next Phase Readiness

- Phase 1's full admin console screen inventory (8 screens: Users, Roles & Permissions, Audit Log from 01-11; SSO Config, Platform Monitoring, Integration Health, API Clients, Federation Grants from this plan) is now complete, routed under `AppShell`'s `Outlet`, and reachable from the real `GET /api/v1/me/nav-config`-driven `SideNav` — no orphan routes.
- `01-13` (the final deploy-packaging plan) can proceed: this plan's screens round-trip real data through the live backend with no known blocking gaps.
- The one-time API-client-secret pattern (local-only state, cleared on Done, never cached) and the fingerprint-based test-gate pattern are both reusable precedents for any future admin screen needing similar one-shot-secret or test-before-activate semantics.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 6 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`): `SsoConfigForm.tsx`, `PlatformMonitoring.tsx`, `IntegrationHealth.tsx`, `ApiClients.tsx`, `FederationGrants.tsx`, `admin-platform-sso.spec.ts`.
- All 3 task commits verified present in `git log`: `a3310c2`, `37756be`, `4fe621d`.
- Plan-level build check: `cd frontend/app && npx tsc --noEmit` → exit 0 (no errors). `cd frontend/app && npm run build` (Vite) → exit 0, produced `dist/index.html` + `dist/assets/*.{js,css}` (357 kB JS / 36 kB CSS). `cd backend && npm run build` (tsc) → exit 0.
- Full Playwright suite for this plan (`npx playwright test e2e/admin-platform-sso.spec.ts --workers=1 --reporter=list`) → 4/4 passed, run twice in a row for stability. The combined suite across all three admin-console plans (`npx playwright test --workers=1 --reporter=list`, 13 specs total: 4 app-shell + 5 admin-users-roles + 4 admin-platform-sso) → 13/13 passed, confirming no regression from the shared routing surface.
- `## Known Stubs` section below: two cosmetic (non-blocking) Phase-1 scope-gap hint strings, both explicitly mandated by the plan text itself.

## Known Stubs

- `frontend/app/src/pages/admin/PlatformMonitoring.tsx:59` — the "Uptime" `Stat` tile's `hint` reads "Phase 1 placeholder — full historical uptime tracking is a later-phase concern." **Cosmetic, not blocking.** The plan's own Task 2 text explicitly specifies this exact documentation pattern ("each with a `hint` stating what's shown is an approximation where 01-09 documented one"), and 01-09's `platform-health.ts` backend itself hardcodes `uptime_pct = 100` with an identical inline comment — this frontend hint accurately reflects a real, documented backend scope boundary, not a silently-broken feature.
- `frontend/app/src/pages/admin/PlatformMonitoring.tsx:69` — the "Failed-login rate" `Stat` tile's `hint` reads "Phase 1 placeholder — no login_failed audit event is recorded yet." **Cosmetic, not blocking.** Same justification: 01-09's backend hardcodes `failed_login_rate = 0` with its own inline `TODO` comment documenting the same gap (no `login_failed` audited event exists yet in `sso.ts`). The value shown is real (always 0, per the backend), and the hint correctly tells an admin why.
