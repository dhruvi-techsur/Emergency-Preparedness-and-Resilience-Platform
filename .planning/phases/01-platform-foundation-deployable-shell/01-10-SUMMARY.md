---
phase: 01-platform-foundation-deployable-shell
plan: 10
subsystem: ui
tags: [react, vite, oidc-client-ts, react-router, tanstack-query, keycloak, playwright, app-shell]

# Dependency graph
requires:
  - phase: 01-03
    provides: "GET /api/v1/me, PATCH /api/v1/me/preferences, GET /api/v1/me/nav-config, POST /api/v1/auth/sso/callback (backend/src/modules/auth-org/routes.ts)"
  - phase: 01-04
    provides: "SideNav, PageHeader, Avatar, Breadcrumbs, Card (frontend/design-system)"
  - phase: 01-05
    provides: "Select, Switch, Combobox (frontend/design-system)"
  - phase: 01-06
    provides: "Modal (frontend/design-system)"
provides:
  - "frontend/app: a real Vite React SPA consuming @epmp/design-system, wired to Keycloak OIDC auth-code+PKCE"
  - "AppShell.tsx: SideNav + header strip (Breadcrumbs, no-op search, no-op alerts, Avatar+profile menu) + <main> content area, skip-to-content as first child"
  - "RouteGuard.tsx: resolves session before first paint, handles 401/403/200, provides AuthContext"
  - "ThemeSwitcher.tsx: instant data-theme apply + background-persisted PATCH, non-reverting on save failure"
  - "api-client.ts: apiGet/apiPatch/apiPost with centralized 401 SESSION_EXPIRED handling"
  - "e2e/app-shell.spec.ts: 4-assertion Playwright suite proving real SSO sign-in, role-scoped nav, theme persistence, a11y skip-link"
affects: ["01-11", "01-12", "01-13 (admin console screens mount inside this shell)"]

# Tech tracking
tech-stack:
  added: ["oidc-client-ts", "react-router-dom@7", "@tanstack/react-query@5", "@playwright/test@1.63.0 (frontend/app devDependency)"]
  patterns:
    - "RouteGuard bypasses its own session-resolution effect on exactly one route (/auth/callback) via react-router's useLocation() (never raw window.location, which doesn't update on client-side navigate()), letting SignInCallback own its full lifecycle without a race"
    - "Theme is applied to document.documentElement.dataset.theme from two independent call sites with different timing guarantees: main.tsx's pre-render default ('light'), RouteGuard's useLayoutEffect on session resolution (the persisted preference, applied before paint), and ThemeSwitcher's synchronous on-change handler (instant, before the background PATCH)"
    - "TanStack Query queryKey includes the resolved role id (['nav-config', user.role?.id]) so nav-config re-fetches automatically on role change, per the plan's explicit requirement"
    - "SideNav's collapsed/variant props (never self-inferred per design-system contract) are driven by a matchMedia(--bp-md) listener owned entirely by AppShell"

key-files:
  created:
    - frontend/app/package.json
    - frontend/app/vite.config.ts
    - frontend/app/index.html
    - frontend/app/tsconfig.json
    - frontend/app/src/main.tsx
    - frontend/app/src/auth/oidc-config.ts
    - frontend/app/src/auth/session-storage.ts
    - frontend/app/src/auth/auth-context.ts
    - frontend/app/src/auth/RouteGuard.tsx
    - frontend/app/src/app-shell/AppShell.tsx
    - frontend/app/src/app-shell/AppShell.css
    - frontend/app/src/app-shell/ThemeSwitcher.tsx
    - frontend/app/src/lib/api-client.ts
    - frontend/app/src/pages/SignInCallback.tsx
    - frontend/app/src/pages/RoleUnresolved.tsx
    - frontend/app/e2e/app-shell.spec.ts
    - frontend/app/playwright.config.ts
  modified:
    - package.json (workspaces: frontend -> frontend/app)
    - backend/keycloak/epmp-realm.json (seed user firstName/lastName, groups mapper full.path)

key-decisions:
  - "frontend/app/tsconfig.json path-maps @epmp/design-system straight to its src/index.ts rather than its declared-but-never-generated dist/index.d.ts, since that package's own build (vite.config.ts, declaration:false) never emits a .d.ts despite package.json claiming one exists; Vite's runtime resolution (dev + build) is unaffected since it uses the module/main fields, never tsconfig paths"
  - "RouteGuard applies the resolved theme_preference to the DOM via useLayoutEffect (not useEffect) on session resolution — this is the actual flash-of-wrong-theme guard for the steady-state/reload case, since main.tsx can only ever set the pre-JS 'light' default synchronously before the real preference is known"
  - "SignInCallback's async effect has no cancelled-closure cleanup guard around navigate()/setError() — React.StrictMode's synthetic double-invoke was observed to set a stale 'cancelled=true' on the one invocation that actually completes the real network exchange, silently dropping a successful sign-in's navigation; hasStartedRef (a ref, not state) is the only duplicate-invocation guard needed since navigate()/setState() are safe no-ops after a genuine unmount in React 18"

patterns-established:
  - "api-client.ts centralizes all 401 SESSION_EXPIRED handling (clear token + redirect) in exactly one place rather than per call site, matching the plan's explicit requirement"

# Metrics
duration: 35min
completed: 2026-11-16
---

# Phase 1 Plan 10: App Shell (SSO + Role-Scoped Nav + Theme Switcher) Summary

**React/Vite SPA with real Keycloak OIDC authorization-code+PKCE sign-in, a role-scoped AppShell (SideNav/header/profile-menu) resolved from `GET /api/v1/me*` before first paint, instant+persisted theme switching, and a 4-assertion Playwright suite proving the whole flow end-to-end against the live compose stack.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-16T03:45:00Z (approx, per STATE.md handoff)
- **Completed:** 2026-11-16T04:20:00Z (approx)
- **Tasks:** 3
- **Files created:** 17
- **Files modified:** 2

## Accomplishments

- `frontend/app` is a real Vite React SPA (new workspace, package.json renamed in root `workspaces` from the never-created `frontend/`) consuming `@epmp/design-system`'s component exports directly as ES module imports — proven by a clean production `npm run build` (327 kB JS / 36 kB CSS bundle)
- OIDC authorization-code+PKCE sign-in against Keycloak's `epmp` realm (`oidc-client-ts`'s `UserManager`, PKCE on by default for the public `epmp-app` client) — a real browser redirect through Keycloak's own login page, not a mocked token
- `RouteGuard` resolves `GET /api/v1/me` before any protected route renders: 401 → sign-in redirect, 403 `ROLE_UNRESOLVED` → the FRD's exact message via `RoleUnresolved.tsx`, 200 → `AuthContext` provided to `AppShell` and everything inside it
- `AppShell` composes `SideNav` (role-scoped groups from `GET /api/v1/me/nav-config`, fetched via `@tanstack/react-query` with the role id in the query key so it re-fetches on role change) + header strip (`Breadcrumbs`, a documented Phase-1 no-op search `Combobox`, a documented Phase-1 no-op alerts `IconButton`, `Avatar` opening a profile menu with `ThemeSwitcher` + Sign out) + `<main>` rendering `<Outlet />`
- Skip-to-content is the literal first child of `AppShell`'s root, proven by Playwright pressing `Tab` once on a fresh load
- `ThemeSwitcher` applies `data-theme` to the document root synchronously on change — before the background `PATCH /api/v1/me/preferences` is even issued — and never reverts the visual theme on save failure (shows the FRD's exact `THEME_SAVE_FAILED` message instead)
- `api-client.ts` centralizes 401 `SESSION_EXPIRED` handling (clear token, redirect) in exactly one place rather than duplicating it per call site
- All 4 Playwright assertions pass, twice in a row (stability check), against the real compose stack (Postgres/NATS/OPA/Keycloak) + live backend + live Vite dev server: real SSO redirect, exact role-scoped nav match against the backend's own `nav-config` response, instant+persistent theme switching, and skip-to-content as the first Tab stop

## Task Commits

Each task was committed atomically:

1. **Task 1: Vite SPA scaffold + OIDC auth flow** - `01a907d` (feat)
2. **Task 2: AppShell + ThemeSwitcher + typed API client** - `f4bd3c5` (feat)
3. **Task 3: Playwright e2e — sign-in, shell render, theme persistence** - `3509245` (feat, includes 5 deviation fixes found while making the suite pass for real)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

## Files Created/Modified

- `frontend/app/package.json`, `vite.config.ts`, `tsconfig.json`, `index.html` - new Vite workspace, bound to `0.0.0.0:5173`, `/api` dev proxy to `localhost:8080`
- `frontend/app/src/main.tsx` - pre-render `data-theme` default, mounts `BrowserRouter`→`RouteGuard`→`Routes` (`/auth/callback` and `/*`)
- `frontend/app/src/auth/oidc-config.ts` - `UserManager` against Keycloak's `epmp` realm, sessionStorage-backed userStore
- `frontend/app/src/auth/session-storage.ts` - single source of truth for session-token storage (sessionStorage only)
- `frontend/app/src/auth/auth-context.ts` - `AuthContext`/`useAuth()` for the resolved user
- `frontend/app/src/auth/RouteGuard.tsx` - session resolution, 401/403/200 branching, theme-apply-on-resolve
- `frontend/app/src/pages/SignInCallback.tsx` - OIDC callback → backend exchange → session storage → navigate
- `frontend/app/src/pages/RoleUnresolved.tsx` - exact FRD `ROLE_UNRESOLVED` message
- `frontend/app/src/app-shell/AppShell.tsx` + `.css` - the persistent chrome: SideNav + header + content area + skip-link
- `frontend/app/src/app-shell/ThemeSwitcher.tsx` - instant apply + background-persisted theme change
- `frontend/app/src/lib/api-client.ts` - typed `apiGet`/`apiPatch`/`apiPost` with centralized 401 handling
- `frontend/app/e2e/app-shell.spec.ts` + `playwright.config.ts` - the 4-assertion e2e suite
- `package.json` (root) - `workspaces` entry fixed from the nonexistent `frontend` to `frontend/app`
- `backend/keycloak/epmp-realm.json` - seed user `firstName`/`lastName` added, groups mapper `full.path` fixed to `true`

## Decisions Made

- **`@epmp/design-system` path-mapped to its real source** in `frontend/app/tsconfig.json` rather than its declared `dist/index.d.ts`, since that package's own Vite build never generates a `.d.ts` (no `vite-plugin-dts`, `declaration: false`) despite `package.json` claiming one — a pre-existing gap from 01-02, worked around here without touching that package's build pipeline.
- **Theme application split across three call sites by necessity, not duplication**: `main.tsx`'s pre-JS default (`'light'`, before any async work can possibly complete), `RouteGuard`'s `useLayoutEffect` on session resolution (the real persisted preference, applied before paint — this is what actually satisfies "no flash of wrong theme" for the reload/steady-state case), and `ThemeSwitcher`'s synchronous on-change handler (the interactive instant-apply case). All three write to the same `document.documentElement.dataset.theme`; none conflicts with another in time.
- **`SignInCallback`'s effect has no cleanup-based cancellation guard** — `React.StrictMode`'s synthetic double-invoke was directly observed to drop a legitimately successful sign-in by setting a stale `cancelled=true` mid-flight; a `useRef` (not a cleanup flag) is the correct "run exactly once" guard for a non-idempotent async operation (the OAuth code exchange) under StrictMode.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Keycloak seed user missing firstName/lastName triggered VERIFY_PROFILE interstitial**
- **Found during:** Task 3 (running the Playwright suite against the real Keycloak instance for the first time)
- **Issue:** `backend/keycloak/epmp-realm.json`'s seeded `admin@epmp.local` user had no `firstName`/`lastName`. Keycloak's `VERIFY_PROFILE` required action (enabled by default in the realm) fired on every login, showing an "Update Account Information" form instead of completing the OIDC redirect — the entire sign-in flow never reached the app.
- **Fix:** Added `"firstName": "EPMP", "lastName": "Admin"` to the seeded user in the realm import.
- **Files modified:** `backend/keycloak/epmp-realm.json`
- **Verification:** Playwright's sign-in flow no longer stalls on an account-update form; proceeds straight to the redirect back to the app.
- **Committed in:** `3509245` (Task 3 commit)

**2. [Rule 1 - Bug] Groups protocol mapper's full.path=false broke group_to_role_mapping matching**
- **Found during:** Task 3 (first full sign-in attempt returned 403 ROLE_UNRESOLVED despite the user being in `/epmp-admins`)
- **Issue:** The realm's `groups` protocol mapper had `full.path: "false"`, which emits bare group names (`epmp-admins`) in the ID token's `groups` claim. But `backend/scripts/seed.ts`'s `group_to_role_mapping` (consumed by `sso.ts`'s `handleSsoCallback`) is keyed on `/epmp-admins` (with the leading slash) — every real SSO login failed to match any mapping regardless of actual group membership, hitting `RoleUnresolvedError` on every attempt.
- **Fix:** Changed `full.path` to `"true"` so the emitted claim matches the seeded mapping key exactly.
- **Files modified:** `backend/keycloak/epmp-realm.json`
- **Verification:** `POST /api/v1/auth/sso/callback` now returns 200 (was 403) for the seeded admin user; confirmed in the backend's own request log.
- **Committed in:** `3509245` (Task 3 commit)

**3. [Rule 1 - Bug] RouteGuard read window.location.pathname directly instead of react-router's useLocation()**
- **Found during:** Task 3 (sign-in redirected back to `/` but the page stayed blank forever)
- **Issue:** `RouteGuard`'s `isCallbackRoute` check read `window.location.pathname` directly, captured once per render. `SignInCallback`'s `navigate('/', {replace:true})` is a client-side history push (no full page reload), so `window.location.pathname` never changed from RouteGuard's perspective — it believed it was still on `/auth/callback` forever after a successful sign-in, permanently bypassing its own session-resolution logic and rendering nothing.
- **Fix:** Switched to `useLocation()` from `react-router-dom`, which re-renders the component on every route change, and added `isCallbackRoute` to the resolution effect's dependency array so navigating off `/auth/callback` actually triggers the `GET /api/v1/me` resolution.
- **Files modified:** `frontend/app/src/auth/RouteGuard.tsx`
- **Verification:** Playwright's sign-in-flow assertion passes — `SideNav` renders after the redirect completes.
- **Committed in:** `3509245` (Task 3 commit)

**4. [Rule 1/2 - Bug/Missing Critical] Resolved theme_preference was never applied to the DOM on load/reload**
- **Found during:** Task 3 (theme-persistence assertion: reloaded page always showed `light` regardless of the saved preference)
- **Issue:** `RouteGuard` stored the resolved `theme_preference` in `AuthContext` but nothing ever wrote it to `document.documentElement.dataset.theme` on initial load or reload — only `ThemeSwitcher`'s own `onChange` handler touched the attribute. A user who set `dark` and reloaded the page saw `light` (the pre-JS default from `main.tsx`) until they opened the profile menu and re-selected `dark`.
- **Fix:** Added a `useLayoutEffect` in `RouteGuard` that applies `state.user.theme_preference` to the document root the instant session resolution succeeds — before the browser's next paint, satisfying the FRD's "applied before first paint" requirement for the one case (reload) where the preference wasn't already known at `main.tsx`'s synchronous pre-render line.
- **Files modified:** `frontend/app/src/auth/RouteGuard.tsx`
- **Verification:** Playwright's theme-persistence assertion passes: switch to `dark`, reload, `data-theme="dark"` still present.
- **Committed in:** `3509245` (Task 3 commit)

**5. [Rule 1 - Bug] StrictMode's synthetic double-invoke dropped a successful sign-in's navigation**
- **Found during:** Task 3 (full-suite run failed intermittently with Keycloak's "Code not valid", then after adding a naive ref-guard, failed differently with the SSO exchange succeeding but the page staying on `/auth/callback`)
- **Issue:** `main.tsx` wraps the app in `React.StrictMode`, which double-invokes effects in dev (mount→cleanup→mount) to surface missing-cleanup bugs. `SignInCallback`'s effect originally had both a `hasStartedRef` guard (correctly preventing the non-idempotent OAuth code exchange from running twice) AND a `cancelled`-closure cleanup flag. StrictMode's synthetic cleanup between the two invocations set `cancelled = true` on the ONE invocation that actually ran the real network exchange — so even though `POST /api/v1/auth/sso/callback` returned 200 and the session token was stored, the subsequent `if (!cancelled) navigate(...)` check silently skipped the redirect, leaving the user stuck on a blank `/auth/callback` page.
- **Fix:** Removed the `cancelled`-closure guard entirely. `hasStartedRef` already provides the only guarantee actually needed (no duplicate network call); `navigate()`/`setError()` are safe no-ops if the component has genuinely unmounted by the time they're called in React 18.
- **Files modified:** `frontend/app/src/pages/SignInCallback.tsx`
- **Verification:** Full Playwright suite passes 4/4, twice in a row (stability check against StrictMode re-render timing).
- **Committed in:** `3509245` (Task 3 commit)

---

**Total deviations:** 5 auto-fixed (5 Rule 1 - Bug; one of the five is also Rule 2 - Missing Critical functionality, since the reload-theme-persistence behavior was simply absent, not just buggy).
**Impact on plan:** All five were required for the plan's own stated success criterion (a real user signs in via SSO and lands in a working role-scoped shell with working theme switching) to actually hold — none is scope creep. Two live in the Keycloak realm config carried forward from 01-01 (a config/seed mismatch neither 01-01 nor 01-03 could have caught without a real browser-driven OIDC round-trip — 01-03's own SUMMARY.md explicitly flagged `handleSsoCallback` as "untested against a live Keycloak OIDC round-trip" and recommended this exact plan smoke-test it). Three live entirely in this plan's own new frontend code.

## Issues Encountered

None beyond the five auto-fixed deviations above, all surfaced directly by running the plan's own `<verify>` Playwright command against the real stack, exactly as specified.

## User Setup Required

None - no external service configuration required. All verification ran against the dev-only `docker compose` stack (Postgres, NATS, OPA, Keycloak) already provisioned by earlier Wave plans; no cloud account, API key, or dashboard configuration needed. The two Keycloak realm fixes are committed to `backend/keycloak/epmp-realm.json` so they apply automatically on the next `docker compose up --import-realm` / fresh sandbox clone — no manual Keycloak Admin Console steps are needed by a human.

## Next Phase Readiness

- `AppShell` is live and composes real `@epmp/design-system` components end-to-end — 01-11/01-12/01-13's admin console screens can mount directly inside it via nested routes under `AppShell`'s `<Outlet />`.
- `useAuth()` (from `auth-context.ts`) and `apiGet`/`apiPatch`/`apiPost` (from `lib/api-client.ts`) are the two primitives every subsequent admin-console screen will need — both are exported from stable, tested locations.
- Success criterion 1 ("a user can sign in via SSO and land in a role-scoped app shell, not a generic landing page") is now concretely proven, not just asserted: a real browser redirect through Keycloak's login page, not a mocked token exchange.
- No blockers. The two Keycloak realm fixes should be noted by anyone touching `backend/keycloak/epmp-realm.json` in a future plan: `full.path` must stay `true` for `sso.ts`'s group-to-role matching to keep working, and any newly seeded Keycloak user needs `firstName`/`lastName` set to avoid `VERIFY_PROFILE` blocking login.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 17 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`).
- All 3 task commits verified present in `git log`: `01a907d`, `f4bd3c5`, `3509245`.
- Plan-level build check: `cd frontend/app && npm run build` (Vite) → exit 0, produced `dist/index.html` + `dist/assets/*.{js,css}` (328 kB JS / 36 kB CSS). `cd backend && npm run build` (tsc) → exit 0, confirming the Keycloak realm JSON edit didn't touch any backend TypeScript.
- Full Playwright suite (`npx playwright test e2e/app-shell.spec.ts --workers=1 --reporter=list`) → 4/4 passed, run twice in a row for stability (1.6-1.7s each run) against the live compose stack + backend dev server + Vite dev server.
- `## Known Stubs` section below: two cosmetic (non-blocking) Phase-1 no-op placeholders, both explicitly mandated by the plan text itself.

## Known Stubs

- `frontend/app/src/app-shell/AppShell.tsx` — the header's global-search `Combobox` is rendered `disabled` with `placeholder="Search (coming soon)"`. **Cosmetic, not blocking.** The plan's own Task 2 text explicitly specifies this: `GET /api/v1/search` isn't built until a feature with search-indexable content exists, and "a real no-op search box ships here rather than a broken one." The component is visually present and correctly disabled, not silently broken.
- `frontend/app/src/app-shell/AppShell.tsx` — the header's alerts `IconButton` is rendered `disabled` with `label="Alerts (coming soon)"`. **Cosmetic, not blocking.** Same plan-text justification: "also a Phase-1 no-op placeholder, badge-less, since no alerting feature exists yet."
