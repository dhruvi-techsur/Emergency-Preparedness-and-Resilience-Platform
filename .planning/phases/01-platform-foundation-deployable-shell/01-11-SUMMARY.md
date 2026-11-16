---
phase: 01-platform-foundation-deployable-shell
plan: 11
subsystem: ui
tags: [react, react-router, tanstack-query, design-system, admin-console, playwright, rbac-ui]

# Dependency graph
requires:
  - phase: 01-07
    provides: "GET/POST /api/v1/admin/users, PATCH /api/v1/admin/users/{id}, GET/PATCH /api/v1/admin/roles, GET /api/v1/admin/audit-log (backend/src/modules/auth-org/*.ts)"
  - phase: 01-10
    provides: "AppShell, RouteGuard, apiGet/apiPatch/apiPost (frontend/app/src/app-shell/AppShell.tsx, src/lib/api-client.ts)"
provides:
  - "frontend/app/src/pages/admin/UsersList.tsx: Users table (Avatar/Email/Role/Jurisdiction/Status/Last-login) wired to Table's loading/empty/error props from live react-query state, search+status filters, Add-user Modal"
  - "frontend/app/src/pages/admin/UserDetail.tsx: role Select (PATCH), jurisdiction-scope as Checkbox list (Combobox is single-select only), Suspend/Reactivate behind Modal confirmation with outcome-named buttons"
  - "frontend/app/src/pages/admin/RolesPermissions.tsx: Table of roles + per-feature Checkbox-group permission matrix, sequential edit-then-confirm Modal pattern"
  - "frontend/app/src/pages/admin/AuditLogView.tsx: filterable/paginated read-only audit log Table with zero edit/delete affordance anywhere on the page"
  - "frontend/app/src/main.tsx: nested /admin/users, /admin/users/:id, /admin/roles, /admin/audit-log routes under AppShell's layout route"
  - "frontend/app/e2e/helpers/sign-in.ts: shared Keycloak sign-in helper, factored out of 01-10's app-shell.spec.ts"
affects: ["01-12 (shares the Admin SideNav group and the same admin-pages directory)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Table's loading/empty/error props are wired directly from react-query's isLoading/isError/rows.length states on every admin list screen — no screen reimplements its own skeleton/empty/error rendering"
    - "Sequential (never stacked) Modal pattern for 'edit then confirm' flows: the edit Modal's `open` condition is `Boolean(editingRole) && !confirmPending`, so the confirmation Modal only ever opens after the edit Modal has already closed"
    - "Direct-by-id navigation (`page.goto('/admin/users/{id}')` after an API lookup in page.evaluate) is this plan's e2e pattern for finding a specific user, since the default page_size=25 list view provides no guarantee a specific row sorts into the first page once the shared compose-stack database has accumulated many fixture rows across repeated plan/test runs"

key-files:
  created:
    - frontend/app/src/pages/admin/UsersList.tsx
    - frontend/app/src/pages/admin/UserDetail.tsx
    - frontend/app/src/pages/admin/RolesPermissions.tsx
    - frontend/app/src/pages/admin/AuditLogView.tsx
    - frontend/app/e2e/admin-users-roles.spec.ts
    - frontend/app/e2e/helpers/sign-in.ts
  modified:
    - frontend/app/src/main.tsx
    - frontend/app/e2e/app-shell.spec.ts

key-decisions:
  - "Jurisdiction-scope editing rendered as a Checkbox list, not a multi-select Combobox — Combobox (01-05) is single-select only and a true multi-select combobox is explicitly 'Not yet built' per the design system's own Open Decisions; UserDetail.tsx documents this substitution inline"
  - "No GET /api/v1/admin/jurisdictions endpoint exists in this phase's API surface (01-01 seeds exactly one jurisdiction row, no list/CRUD route for it anywhere) — UserDetail.tsx derives its checkbox options from the jurisdiction_scope ids already present across the fetched users list rather than inventing a new endpoint outside this plan's integration_contracts"
  - "'Add user' implemented as a Modal (TextField email/name + a Role-ID TextField), not a dedicated creation page — the FRD's S8.2 only specifies list+detail with role/status edit, and no separate creation screen is described anywhere in the FRD/UX mockup"
  - "AuditLogView's actor filter reuses GET /api/v1/admin/users as its Combobox options source (client-filtered) — no dedicated user-search endpoint exists in this phase's backend surface; this is the plan's own documented Phase-1 simplification, not a gap discovered during execution"
  - "Backend's nav-config hrefs (routes.ts's ADMIN_NAV_ITEMS, from 01-03/01-07) already matched the frontend's exact route paths (/admin/users, /admin/roles, /admin/audit-log) — no backend edit was needed for Task 3's 'reconcile frontend routes with nav-config' step"

patterns-established:
  - "Admin-console list screens derive 'first-use vs filtered-out' EmptyState copy from local filter state (hasActiveFilter), matching the FRD's distinct-copy-per-case requirement rather than Table guessing which case applies"

# Metrics
duration: 48min
completed: 2026-11-16
---

# Phase 1 Plan 11: Users, Roles & Permissions, Audit Log Admin Screens Summary

**Three routed admin-console screens (Users list+detail, Roles & Permissions matrix, read-only Audit Log) composed entirely from `@epmp/design-system`, wired into AppShell's existing Admin SideNav group, with Modal-confirmed suspend/reactivate and permission edits proven end-to-end against the live backend by a 5-assertion Playwright suite.**

## Performance

- **Duration:** 48 min
- **Started:** 2026-11-16T04:40:00Z (approx)
- **Completed:** 2026-11-16T05:28:00Z (approx)
- **Tasks:** 3
- **Files created:** 6
- **Files modified:** 2

## Accomplishments

- `UsersList.tsx` fetches `GET /api/v1/admin/users` via `@tanstack/react-query` and wires `Table`'s `loading`/`error`/`empty` props directly from the query's own state — no screen-local skeleton/error reimplementation
- `UserDetail.tsx` supports live role reassignment (`Select` → `PATCH`) and jurisdiction-scope toggling (`Checkbox` list, documented substitution for the not-yet-built multi-select Combobox), both persisting across a full page reload
- Suspend and Reactivate are both gated behind a `Modal danger` confirmation with outcome-named buttons ("Keep active" / "Suspend access", "Keep suspended" / "Reactivate access") — never "Yes"/"OK", verified by both a static grep and a live Playwright assertion
- `RolesPermissions.tsx` renders the Phase-1 permission matrix (the two `role_permissions.feature` values 01-01's seed actually populates — `platform`, `admin` — × `view`/`create`/`edit`/`approve`) as a `Checkbox` group per feature, behind a sequential edit-then-confirm Modal pattern (never two Modals open at once)
- `AuditLogView.tsx` has zero edit/delete affordance anywhere in its rendered output — proven both by a static grep and a live Playwright assertion that no "Edit"/"Delete" button or link exists in the table
- A role-permission edit through the confirmation Modal produces a `role_permission_edit` audit entry visible at the top of the (time-sorted DESC) Audit Log table within the same browser session, no reload needed
- All 4 route paths (`/admin/users`, `/admin/users/:id`, `/admin/roles`, `/admin/audit-log`) are nested under `AppShell`'s layout route and reachable via the Admin SideNav group's existing links — the backend's `nav-config` hrefs (built in 01-03/01-07) already matched these exact paths, so no backend change was needed for the "reconcile routes with nav-config" step
- All 5 Playwright assertions in `admin-users-roles.spec.ts` pass against the real `docker compose` stack (Postgres/NATS/OPA/Keycloak) + live backend + live Vite dev server, run twice consecutively to confirm idempotent repeatability
- 01-10's pre-existing `app-shell.spec.ts` (4 assertions) continues to pass unmodified in behavior — only refactored to import the shared `signInThroughKeycloak` helper rather than duplicating it

## Task Commits

Each task was committed atomically:

1. **Task 1: Users list + detail (role assignment, suspend with Modal confirmation)** - `dd28996` (feat)
2. **Task 2: Roles & Permissions matrix + Audit Log view** - `c9c8b48` (feat)
3. **Task 3: Wire into AppShell nav + Playwright coverage** - `97cc13a` (feat, includes 3 deviation fixes found while making the suite pass for real)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

## Files Created/Modified

- `frontend/app/src/pages/admin/UsersList.tsx` - Users `Table` (Avatar/Email/Role/Jurisdiction/Status/Last-login), search+status toolbar, Add-user `Modal`
- `frontend/app/src/pages/admin/UserDetail.tsx` - role `Select`, jurisdiction `Checkbox` list, Suspend/Reactivate `Modal` confirmations
- `frontend/app/src/pages/admin/RolesPermissions.tsx` - roles `Table`, feature×action `Checkbox` matrix, sequential edit→confirm `Modal`s
- `frontend/app/src/pages/admin/AuditLogView.tsx` - filterable/paginated read-only audit log `Table`, detail-view `Modal`, zero edit/delete UI
- `frontend/app/src/main.tsx` (modified) - nested admin routes under `AppShell`'s layout route
- `frontend/app/e2e/admin-users-roles.spec.ts` - 5-assertion Playwright suite
- `frontend/app/e2e/helpers/sign-in.ts` - shared Keycloak sign-in helper
- `frontend/app/e2e/app-shell.spec.ts` (modified) - refactored to import the shared sign-in helper instead of its own copy

## Decisions Made

- **Jurisdiction-scope as Checkbox list, not multi-select Combobox** — Combobox (01-05) is single-select only; a true multi-select is explicitly listed as "Not yet built" in the design system's Open Decisions. Documented inline in `UserDetail.tsx`.
- **No jurisdictions list/CRUD endpoint exists** — checkbox options are derived from the `jurisdiction_scope` ids already present across the fetched users list, rather than inventing a new endpoint outside this plan's `integration_contracts`.
- **"Add user" is a Modal, not a dedicated page** — the FRD's S8.2 only specifies list+detail with role/status edit; no creation screen is described anywhere in the FRD/UX mockup for this feature.
- **Audit Log's actor filter reuses `GET /api/v1/admin/users`** (client-filtered) as its Combobox's options source — no dedicated user-search endpoint exists in this phase's backend surface; this is the plan's own documented Phase-1 simplification.
- **Backend nav-config required no change** — `routes.ts`'s `ADMIN_NAV_ITEMS` hrefs already matched `/admin/users`, `/admin/roles`, `/admin/audit-log` exactly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test assertion 1 asserted an exact row count against an ever-growing shared database**
- **Found during:** Task 3's own `<verify>` command, first run
- **Issue:** `admin-users-roles.spec.ts` initially asserted `tbody tr` count === 1. This phase's compose-stack Postgres database is shared and persistent across every plan/test run executed so far in this phase (77+ `users` rows observed, accumulated by 01-07's `admin.test.ts` fixtures and 01-10's own app-shell runs) — asserting exactly 1 row fails the moment any prior run has added fixture data.
- **Fix:** Changed to `expect(rowCount).toBeGreaterThanOrEqual(1)` — the Table renders real backend rows; proving the specific seeded admin's identity is handled separately (see fix #2) rather than by counting rows.
- **Files modified:** `frontend/app/e2e/admin-users-roles.spec.ts`
- **Verification:** Assertion 1 passes against the live 77-row database.
- **Commit:** `97cc13a`

**2. [Rule 1 - Bug] Assertions 2 and 3 relied on finding a user by visible table text, but the default page_size=25 list view does not guarantee a specific row (by name, `ORDER BY u.name`) sorts into the first page once 25+ fixture users exist**
- **Found during:** Task 3's own `<verify>` command, same run as #1 (test 2 passed once #1 was loosened, but test 3 then timed out waiting for `table.getByText('Suspend Test User')`)
- **Issue:** Both the seeded admin ("EPMP Admin") and a just-created test user ("Suspend Test User") can sort outside the default 25-row page once the shared database has accumulated enough fixture rows from prior runs — the exact scenario 01-07's own `admin.test.ts` SUMMARY.md documented and fixed with `page_size=1000` in its own assertions.
- **Fix:** Both tests now resolve the target user's id via a direct `fetch('/api/v1/admin/users?page_size=1000', ...)` call inside `page.evaluate`, then `page.goto('/admin/users/{id}')` directly, rather than clicking a row located by visible text in the (possibly-paginated-away) list view.
- **Files modified:** `frontend/app/e2e/admin-users-roles.spec.ts`
- **Verification:** Both tests pass deterministically, independent of how many fixture users already exist in the shared database.
- **Commit:** `97cc13a`

**3. [Rule 1 - Bug] Suspend-confirmation Modal title assertion used a substring that never matches the real per-user title**
- **Found during:** Task 3's own `<verify>` command, after fixes #1/#2
- **Issue:** The test asserted `modal.getByText('Suspend access?')`, but `UserDetail.tsx`'s actual Modal title (per the plan's own Task 1 spec) is `` `Suspend ${name}'s access?` `` — e.g. "Suspend Suspend Test User's access?" — which never contains the literal substring "Suspend access?".
- **Fix:** Changed the assertion to `modal.getByText(/access\?$/)`, matching the title's fixed suffix regardless of the interpolated name.
- **Files modified:** `frontend/app/e2e/admin-users-roles.spec.ts`
- **Verification:** Assertion passes; re-ran the full suite twice consecutively afterward with all 5 assertions green both times.
- **Commit:** `97cc13a`

---

**Total deviations:** 3 auto-fixed (3 Rule 1 - Bug, all test-correctness fixes required for the plan's own `<verify>` command to actually pass against the real shared database; zero production-code deviations — `UsersList.tsx`, `UserDetail.tsx`, `RolesPermissions.tsx`, `AuditLogView.tsx` all matched the plan's specification on first implementation, confirmed by a clean `tsc --noEmit` and all 5 live assertions passing once the test file itself was corrected).
**Impact on plan:** All three fixes are in the test file only. No scope creep — no endpoint, schema, or interface beyond what the plan specified.

## Issues Encountered

- **Shared compose-stack database has accumulated 77+ `users` rows and 11 `roles` rows** across this phase's repeated plan/test executions (01-07's `admin.test.ts` fixtures, 01-10's and this plan's own Playwright runs). This is the same condition 01-07's own SUMMARY.md documented and fixed with `page_size=1000` in its test assertions — this plan hit the identical class of issue from the frontend e2e side and applied the same fix pattern (see Deviations #1/#2 above). Not a defect in this plan's production code.
- **Parallel-plan execution observed**: 01-12 (SSO Configuration + Platform Monitoring + Integration Health screens) landed its own commits (`a3310c2`, `37756be`) on the same branch concurrently with this plan's execution, and a separate in-flight parallel plan left uncommitted files (`ApiClients.tsx`, `FederationGrants.tsx`, `admin-platform-sso.spec.ts`) in the shared working tree at the time this plan's `git add` ran. Confirmed via `git status --short` + per-file `git diff --stat` that only this plan's own four files (`main.tsx`, `e2e/app-shell.spec.ts`, plus the two new files) were staged for each of this plan's commits — no cross-contamination from the other in-flight plan's unstaged work.

## User Setup Required

None - no external service configuration required. All verification ran against the dev-only `docker compose` stack (Postgres, NATS, OPA, Keycloak) already provisioned by earlier Wave plans; no cloud account, API key, or dashboard configuration needed.

## Next Phase Readiness

- Success criterion 2 ("manage users, roles, and granular RBAC permissions from the Admin Console... audit trail") is now concretely observable end-to-end through a real browser session, not just a tested backend.
- `UsersList`/`UserDetail`/`RolesPermissions`/`AuditLogView` all live under `frontend/app/src/pages/admin/`, the same directory 01-12's SSO Configuration/Platform Monitoring/Integration Health screens landed in — no naming or route collisions observed (`/admin/users*`, `/admin/roles`, `/admin/audit-log` vs. 01-12's `/admin/sso-config`, `/admin/platform-monitoring`, `/admin/integration-health`).
- `e2e/helpers/sign-in.ts` is now the shared sign-in helper any future admin-console e2e spec (including 01-12's, if it adds one) can import rather than duplicating.
- No blockers. The documented jurisdiction-checkbox substitution and the Phase-1 audit-log-actor-filter simplification should be carried forward by any later phase that adds a real jurisdictions-list endpoint or a dedicated user-search endpoint — at that point `UserDetail.tsx`'s checkbox-options derivation and `AuditLogView.tsx`'s actor Combobox can be simplified to call the new endpoint directly.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 6 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`).
- Both modified files (`main.tsx`, `e2e/app-shell.spec.ts`) confirmed to contain this plan's changes via `git diff --stat` before staging.
- All 3 task commits verified present in `git log`: `dd28996`, `c9c8b48`, `97cc13a`.
- Plan-level build checks: `cd frontend/app && npx tsc --noEmit` → exit 0, zero errors. `cd frontend/app && npm run build` (Vite) → exit 0, produced `dist/index.html` + `dist/assets/*.{js,css}` (343 kB JS / 36 kB CSS). `cd backend && npm run build` (tsc) → exit 0 (no backend files were touched by this plan; confirmed unaffected).
- Full Playwright suite (`npx playwright test e2e/admin-users-roles.spec.ts e2e/app-shell.spec.ts --workers=1 --reporter=list`) → 9/9 passed in a single combined run; `admin-users-roles.spec.ts` alone run twice consecutively (5/5 both times) to confirm idempotent repeatability against the shared, persistent-volume database.
- Memory guard checked before any browser launch: cgroup-corrected free memory ≈5.25 GB (well above the 1024 MB floor).
- `## Known Stubs` section below: none blocking.
- Integration contract verifications: all 3 `requires` entries confirmed (admin route registrations ×24 matches, `AppShell` export, `apiGet`/`apiPatch` exports); the 1 `provides` entry (`UsersList` export) confirmed.

## Known Stubs

None found that are blocking. `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all 6 created + 2 modified files returns only: (a) legitimate HTML `placeholder=` form-field attributes in `UsersList.tsx`/`AuditLogView.tsx` (example text shown in an empty input, not a stub), and (b) two pre-existing 01-10 cosmetic no-op placeholders in `AppShell.tsx` (global search, alerts bell) that this plan did not touch beyond adding nested routes — both already documented as intentional, non-blocking Phase-1 placeholders in 01-10's own SUMMARY.md.
