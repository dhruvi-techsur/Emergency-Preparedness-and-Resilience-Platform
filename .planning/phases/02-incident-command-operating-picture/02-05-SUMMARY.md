---
phase: 02-incident-command-operating-picture
plan: 05
subsystem: incident-ops
tags: [react, react-router, tanstack-query, fastify, playwright, design-system]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "GET/POST /api/v1/incidents, incidents feature role_permissions seed rows (02-01)"
  - phase: 01-platform-foundation-deployable-shell
    provides: "AppShell layout route, apiGet/apiPost client, Table/Badge/Alert/Combobox/DatePicker/PageHeader design-system components (01-10, 01-05, 01-06)"
provides:
  - "frontend/app/src/pages/incidents/IncidentList.tsx — routed /incidents, Table with Badge severity, loading/empty/error via real useQuery state"
  - "frontend/app/src/pages/incidents/CreateIncident.tsx — routed /incidents/new, single-column form with non-blocking duplicate-warning resubmit flow"
  - "GET /api/v1/jurisdictions — new incidents:view-gated route (backend/src/modules/incident-ops/incidents.ts)"
  - "GET /api/v1/me/nav-config now emits an 'Activate' SideNav group for any role with incidents permissions"
  - "Second seeded Keycloak identity (commander@epmp.local, incident_commander role) for e2e coverage of incident-command screens"
affects: ["02-06 (Incident Workspace, reached from this list's row-click and this form's post-create redirect)", "02-07"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Client-side-only name filter against the fetched page (no server-side search param in 02-01's query surface), documented inline as a Phase 2 scope note rather than inventing a new backend param"
    - "409-then-resubmit duplicate-confirmation UI pattern: a boolean flag set on first 409, carried into the next submit's request body as confirmed_duplicate:true, with no re-entry of form data required"

key-files:
  created:
    - frontend/app/src/pages/incidents/IncidentList.tsx
    - frontend/app/src/pages/incidents/CreateIncident.tsx
    - frontend/app/e2e/incident-list-create.spec.ts
  modified:
    - backend/src/modules/incident-ops/incidents.ts
    - backend/src/modules/auth-org/routes.ts
    - backend/scripts/seed.ts
    - backend/keycloak/epmp-realm.json
    - frontend/app/src/main.tsx
    - frontend/app/e2e/helpers/sign-in.ts

key-decisions:
  - "Added GET /api/v1/jurisdictions to incidents.ts (incidents:view gated) since no prior plan exposed a jurisdictions-list endpoint and the Create Incident form's Combobox genuinely needs one"
  - "nav-config's new 'Activate' group derivation reuses 01-03's exact role_permissions-driven pattern used for 'Admin' — any role with ANY incidents permission (view or above) sees it, matching 02-01's seeded view-only vs full-access role split"
  - "Added a second seeded Keycloak user/group (commander@epmp.local / /epmp-incident-commanders) rather than reusing admin@epmp.local for e2e sign-in, since secops_admin deliberately holds no incidents permissions per 02-01's seed decision"
  - "Alert's warning tone (used for the duplicate-possible 409) is non-dismissable by the design system's own Phase-1 contract (PERSISTENT_TONES includes warning) — the 'does not block' requirement is satisfied via confirm-and-resubmit plus auto-clearing the warning when the user edits the name, not via a dismiss button"

patterns-established:
  - "Phase 2's first incident-ops frontend screens establish the jurisdiction-Combobox + duplicate-409-resubmit patterns that 02-06's Incident Workspace and any later incident-mutation screen can reuse"

# Metrics
duration: 35min
completed: 2026-11-16
---

# Phase 2 Plan 05: Incident List & Create Incident Screens Summary

**Incident List (S1.1) and Create Incident (S1.2) screens wired into the AppShell's new "Activate" SideNav group, with severity rendered exclusively through Table.StatusCell/Badge and the FRD's 409-duplicate-warning resolved as a non-blocking confirm-and-resubmit flow rather than a dead end.**

## Performance

- **Duration:** 35 min
- **Started:** 2026-11-16T13:18:00Z (approx)
- **Completed:** 2026-11-16T13:53:00Z (approx)
- **Tasks:** 3
- **Files modified:** 9 (3 created, 6 modified)

## Accomplishments

- `IncidentList.tsx` renders a filterable Table (search + severity/activation/jurisdiction Selects) with severity always rendered via `Table.StatusCell` → `Badge` (danger/warning/info/success per the FRD's exact tone mapping), never a raw colored span — loading/empty/error states wired directly to the real `useQuery` result, with distinct first-use vs. filtered-out empty copy
- `CreateIncident.tsx` is a single-column (max 560px) form with Name/Type/Severity/Jurisdiction(Combobox)/Description/Opened-at(DatePicker `withTime zone="ET"`); client-side validation focuses the first invalid field and renders a summary danger `Alert`, exactly matching F1's validation requirement
- The FRD's "warn, not block" duplicate-name rule is now a real UI flow: a 409 shows a warning `Alert` with the exact backend message, keeps every entered value intact, and flags the next submit to resend with `confirmed_duplicate:true` — no re-typing needed to proceed past the warning
- Added `GET /api/v1/jurisdictions` (gated by `incidents:view`) since no earlier plan exposed one and the Create form's Jurisdiction `Combobox` needs a real options source
- `GET /api/v1/me/nav-config` now derives an "Activate" SideNav group for any role holding incidents permissions, reconciling 02-01's seeded `incident_commander`/`eoc_director`/`planning_logistics_chief`/`field_responder` grants with the nav the shell actually renders
- A second seeded Keycloak identity (`commander@epmp.local`, JIT-provisioned to `incident_commander`) lets the new Playwright suite sign in as a role that can actually see and use these screens, since the existing `admin@epmp.local` (`secops_admin`) deliberately holds no `incidents` permissions
- All 4 Playwright assertions pass against the live compose stack: Activate-nav reachability, create→redirect→Badge-in-list round-trip, duplicate-warning→resubmit creating a second incident, and empty-Name validation focus+summary-Alert
- Full backend suite (33 tests, 7 files) and the pre-existing `app-shell.spec.ts`/`admin-users-roles.spec.ts` Playwright suites re-run clean after the nav-config change — zero regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Incident List (S1.1)** - `cf4ed59` (feat)
2. **Task 2: Create Incident form (S1.2) with non-blocking duplicate warning** - `8d2941a` (feat)
3. **Task 3: Wire into AppShell nav + Playwright coverage** - `228c091` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/pages/incidents/IncidentList.tsx` - Table-based incident list with Badge severity, filters, loading/empty/error
- `frontend/app/src/pages/incidents/CreateIncident.tsx` - single-column create form with validation-focus and duplicate-confirm-resubmit
- `frontend/app/e2e/incident-list-create.spec.ts` - 4-assertion Playwright suite
- `backend/src/modules/incident-ops/incidents.ts` - added `GET /api/v1/jurisdictions`
- `backend/src/modules/auth-org/routes.ts` - nav-config now emits an "Activate" group for incidents-permission roles
- `backend/scripts/seed.ts` - added `/epmp-incident-commanders` → `incident_commander` group_to_role_mapping entry, re-asserted idempotently on every run
- `backend/keycloak/epmp-realm.json` - added `commander@epmp.local` user + `/epmp-incident-commanders` group
- `frontend/app/src/main.tsx` - added `/incidents` and `/incidents/new` nested routes under `AppShell`
- `frontend/app/e2e/helpers/sign-in.ts` - added `signInAsIncidentCommander` alongside the existing admin sign-in helper

## Decisions Made

- `GET /api/v1/jurisdictions` added to `incidents.ts` rather than a separate module, gated by the same `incidents:view` permission every other read route in this file uses
- nav-config's "Activate" group reuses 01-03's exact role_permissions-driven derivation pattern, not a new mechanism
- A second seeded Keycloak user/group was added (not a reuse of `admin@epmp.local`) because `secops_admin` deliberately has no `incidents` permissions, documented in 02-01's own seed decision
- The duplicate-warning `Alert` keeps the design system's Phase-1 `warning` tone non-dismissable-by-button contract (`PERSISTENT_TONES`) intact — "does not block" is satisfied by resubmit-with-confirmed_duplicate and auto-clearing on name edit, not by adding a dismiss affordance that would contradict Alert's documented persistence rule

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Keycloak-seeded `admin@epmp.local` cannot reach the incident screens at all**
- **Found during:** Task 3 (writing the Playwright suite, before running it)
- **Issue:** The plan's Task 3 text anticipated possibly needing to "sign in as a newly-seeded `incident_commander`-role test user" if the admin account didn't carry incident permissions — checking 02-01's actual seed confirmed `secops_admin` (the only role `admin@epmp.local` holds) is deliberately excluded from `incidents` permissions. Reusing the existing sign-in helper as-is would make every assertion in this suite fail on permission grounds, not on a real screen defect.
- **Fix:** Added a second seeded Keycloak group (`/epmp-incident-commanders`) and user (`commander@epmp.local`) to `epmp-realm.json`, a matching `group_to_role_mapping` entry in `seed.ts` (re-asserted idempotently via an `UPDATE` after `findOrInsert`, since the `sso_config` row already existed in this sandbox's persisted dev volume from an earlier plan's seed run), and a new `signInAsIncidentCommander` helper alongside the existing `signInThroughKeycloak`.
- **Files modified:** backend/keycloak/epmp-realm.json, backend/scripts/seed.ts, frontend/app/e2e/helpers/sign-in.ts
- **Verification:** `commander@epmp.local` successfully signs in through the real Keycloak flow and `GET /api/v1/me/nav-config` returns the Activate group for that session; all 4 Playwright assertions pass.
- **Committed in:** 228c091 (Task 3 commit)

**2. [Rule 1 - Bug] `getByLabel(..., { exact: true })` failed to match required fields' accessible name**
- **Found during:** Task 3 (first Playwright run of the new spec)
- **Issue:** TextField/Combobox/DatePicker render their required marker as `<span aria-hidden="true"> *</span>` appended to the visible label text — `aria-hidden` hides it from a screen reader's announcement, but Playwright's accessible-name computation (correctly, per the ARIA spec `aria-hidden` on static content) still includes `" *"` in the computed name used by `getByLabel`. `exact: true` against the bare word "Name" therefore matched nothing and every subsequent `.fill()` call timed out waiting for a locator with zero matches.
- **Fix:** Switched `getByLabel('Name', ...)` and `getByLabel('Jurisdiction', ...)` to `exact: false` throughout the new spec (matching the pattern already used implicitly elsewhere); `Type`/`Severity` (not required, no marker) kept `exact: true`.
- **Files modified:** frontend/app/e2e/incident-list-create.spec.ts
- **Verification:** All 4 Playwright assertions pass after the fix.
- **Committed in:** 228c091 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were required for the plan's own specified Playwright suite to actually exercise the built screens rather than fail on an unrelated permission or locator-matching issue. No scope creep — the screens themselves (IncidentList.tsx, CreateIncident.tsx) needed no changes to pass once the test infrastructure was corrected.

## Issues Encountered

None beyond the two auto-fixed deviations above — all three tasks' own `<verify>` commands passed as written (after the Rule 3/Rule 1 fixes), including the live 4-assertion Playwright suite against the real compose stack, the full existing 33-test backend suite (zero regressions), and the pre-existing `app-shell.spec.ts`/`admin-users-roles.spec.ts` Playwright suites re-run to confirm the nav-config change didn't break Phase 1's admin-only nav path.

## User Setup Required

None - no external service configuration required. The second seeded Keycloak identity is committed to `backend/keycloak/epmp-realm.json` and `backend/scripts/seed.ts`, so it applies automatically on the next `docker compose up --import-realm` + `npm run seed` — no manual Keycloak Admin Console steps needed.

## Next Phase Readiness

- `IncidentList.tsx` and `CreateIncident.tsx` are live, routed, and reachable from the shell's nav — success criterion 1's "A user can create and classify an incident" is now observable end-to-end through a real browser session.
- The Create form's post-create redirect targets `/incidents/{id}` (the Incident Workspace route 02-06 owns) — until 02-06 lands, that destination 404s, which is expected Wave-3-parallelism behavior documented in this plan's own text, not a defect here.
- Carried-forward gap from 02-01 (T-02-03, still open, unaffected by this plan): `GET /api/v1/incidents` does not yet apply jurisdiction-scope filtering to its results.
- The jurisdiction Combobox and duplicate-409-resubmit patterns established here are directly reusable by 02-06 and any later incident-mutation screen.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

None found — scanned all created/modified files for TODO/FIXME/placeholder/not-implemented patterns. The only hits were pre-existing Phase-1 no-op placeholders in `AppShell.tsx` (header search/alerts, explicitly documented and out of this plan's scope) and legitimate HTML `placeholder` attribute usages (form input hints, a test's locator selector, and the pre-existing `placeholders` SQL-parameter variable name in `seed.ts`) — none is a blocking stub.

## Self-Check: PASSED

- All 3 created files confirmed present on disk (`[ -f ]` checks above)
- All 3 task commits (cf4ed59, 8d2941a, 228c091) confirmed in `git log`
- Build check: `npm run build` (backend tsc) → exit 0; `cd frontend/design-system && npm run build` (Vite) → exit 0; `cd frontend/app && npm run build` (Vite) → exit 0
- Full backend test suite (7 files, 33 tests) → all passed, zero regressions
- Full 4-assertion `incident-list-create.spec.ts` Playwright suite → all passed against the live compose stack
- Pre-existing `app-shell.spec.ts` (4 assertions) and `admin-users-roles.spec.ts` (5 assertions) Playwright suites → all passed, confirming the nav-config change introduced no regression
- No blocking stubs found
