---
phase: 06-persona-dashboards-ai-assistance
plan: 07
subsystem: ui
tags: [react, rbac, nav, dashboard, persona-landing, keycloak, playwright]

# Dependency graph
requires:
  - phase: 06-02
    provides: "GET /api/v1/me/landing-config (role_landing_config resolution), PER-04's seeded mobile_bottom_bar_items row"
  - phase: 06-06
    provides: "/dashboard and /my-work routes already appended in main.tsx; RouteGuard's landing-config-driven redirect mechanism"
provides:
  - "AppShell.tsx forcedBottomBar override — PER-04 (field_responder) never renders the desktop SideNav rail, at any viewport width"
  - "AppShell.tsx now prefers landing-config's own mobile_bottom_bar_items over the generic nav-config Field-group derivation, whenever non-empty"
  - "FacetToggle.tsx — PER-05's explicit, never-auto-selected Admin/Executive Select switch"
  - "AppShell.tsx facet state (admin|executive), rendered only for secops_admin, swaps in a static 2-item executive SideNav"
  - "ExecutiveDashboard.tsx at /executive — S18.5's decoration-free, 1-3 display-scale KPI view"
  - "secops_admin granted view-only 'incidents' role_permissions (previously had none)"
affects: [06-08, 06-09, 06-10, phase-6-uat]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Role-specific AppShell override via user.role?.persona_id check (forcedBottomBar) layered onto the existing viewport-driven rail/bottom-bar split"
    - "Facet state as plain component useState, deliberately never persisted — the 'never auto-select' requirement enforced structurally by having no read path from any storage"
    - "Raw .display/.caption typography classes applied directly (no wrapping component) for the one screen needing a type scale no existing component exposes"

key-files:
  created:
    - frontend/app/src/app-shell/FacetToggle.tsx
    - frontend/app/src/pages/executive/ExecutiveDashboard.tsx
    - frontend/app/src/pages/executive/ExecutiveDashboard.css
    - frontend/app/e2e/persona-dashboards-per04-per05.spec.ts
  modified:
    - frontend/app/src/app-shell/AppShell.tsx
    - frontend/app/src/main.tsx
    - backend/scripts/seed.ts
    - frontend/app/e2e/field-mobile-bottom-nav.spec.ts

key-decisions:
  - "Did NOT create frontend/app/src/pages/field/FieldHome.tsx as the plan's Task 1 specified — Phase 5 (Mobile Field Operations) is actually COMPLETE in this codebase (contradicting the plan's own stale premise that it was unexecuted), and a real, working FieldHome.tsx already exists at the exact same /field route with the exact content this plan's Task 1 would have duplicated"
  - "secops_admin granted view-only 'incidents' role_permissions — the only role reaching ExecutiveDashboard.tsx needed it to avoid a 403 on its own landing view"
  - "backend/scripts/seed.ts's field_responder mobile_bottom_bar_items corrected to match nav-config's own canonical Field-group labels/hrefs (05-06's UAT fix), discovered only once AppShell started actually reading this row"
  - "field-mobile-bottom-nav.spec.ts's desktop-viewport test re-targeted from asserting a SideNav rail to asserting the bottom bar, since F18 S18.4 deliberately removes the rail for this role at every viewport"
  - "No new Keycloak identities/seed.ts Keycloak-section changes needed — field-responder@epmp.local (05-05) and admin@epmp.local (Phase 1) already exist with exactly the roles this plan's Playwright spec needs"

patterns-established:
  - "Pattern: a role-specific AppShell layout override is a plain persona_id boolean check composed with (not replacing) the existing viewport-driven branch"
  - "Pattern: 'never auto-select/persist' requirements are proven by NOT having a read path from storage, not by a runtime guard that could be bypassed"

# Metrics
duration: 55min
completed: 2026-11-19
---

# Phase 6 Plan 07: PER-04 Bottom-Bar-Only Override + PER-05 Dual-Facet (Executive Briefing) Summary

**AppShell's role-driven `forcedBottomBar` override removes the desktop SideNav rail for field_responder at every viewport width, and a new `FacetToggle` Select lets secops_admin explicitly switch into a decoration-free, 3-KPI Executive Dashboard that never persists across reload.**

## Performance

- **Duration:** 55 min
- **Started:** 2026-11-19T12:58:00Z (approx, first file read)
- **Completed:** 2026-11-19T13:45:00Z
- **Tasks:** 3 planned, 2 fully executed as new code + 1 superseded (see Deviations)
- **Files modified:** 8 (4 created, 4 modified)

## Accomplishments

- PER-04 (field_responder) structurally never sees a desktop SideNav rail, at ANY viewport width — proven at a 1280×800 desktop viewport, not just below the bp-md breakpoint every other role uses
- PER-05 (secops_admin) gets an explicit, never-auto-selected Admin/Executive `FacetToggle` in the header — defaults fresh to 'admin' on every mount, only changes via a real `<select>` interaction, never persists across reload
- New `/executive` route: exactly 3 hardcoded `display`-scale KPI numbers (a structural, literal-array cap — not a runtime check), each with a real computed value where this phase's schema can answer it and an honest "Not yet available" where it can't, zero charts/decoration
- AppShell now prefers `landing-config`'s own `mobile_bottom_bar_items` whenever non-empty, closing the gap where nav-config's generic Field-group derivation was the only source for PER-04's bottom bar

## Task Commits

Each task was committed atomically:

1. **Task 2: AppShell PER-04 bottom-bar-only override + PER-05 FacetToggle** - `f203e01` (feat)
2. **Task 3: Executive Dashboard + route + Playwright proof** - `585fb67` (feat)

_Task 1 (Field Home) produced no commit — see Deviations below for why its deliverable already existed._

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/app-shell/FacetToggle.tsx` - S18.5's explicit Admin/Executive Select switch, no internal default-selection logic
- `frontend/app/src/app-shell/AppShell.tsx` - `forcedBottomBar` override (PER-04), `facet` state + conditional executive SideNav (PER-05), landing-config-preferred bottom-bar items
- `frontend/app/src/pages/executive/ExecutiveDashboard.tsx` - S18.5/Screen-01's 3-KPI, decoration-free executive-briefing view
- `frontend/app/src/pages/executive/ExecutiveDashboard.css` - no card/border/shadow chrome, per the mockup's "no decoration" rule
- `frontend/app/src/main.tsx` - `/executive` route appended after 06-06's dashboard/my-work routes
- `backend/scripts/seed.ts` - secops_admin granted view-only `incidents`; field_responder's `mobile_bottom_bar_items` corrected to match nav-config's canonical labels/hrefs
- `frontend/app/e2e/persona-dashboards-per04-per05.spec.ts` - 5 new tests proving all 4 must-have truths
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` - desktop-viewport test re-targeted from rail to bottom-bar assertion

## Decisions Made

- **Did not build `frontend/app/src/pages/field/FieldHome.tsx` (Task 1's literal deliverable).** The plan's own Sequencing note asserted "Phase 5 (Mobile Field Operations, F6) is unexecuted ... only unexecuted PLAN.md files exist" — this was stale. STATE.md and a direct filesystem check both confirm Phase 5 shipped completely (all 6 plans, including gap-closure 05-06), and `frontend/app/src/pages/field-mobile/FieldHome.tsx` already exists, is already routed at `/field`, and already satisfies S18.4's exact contract (bottom-bar-only landing, real task list, Report Observation action). Creating a second, parallel "FieldHome" at a different file path serving the identical route would have been dead code shadowed by main.tsx's existing registration — not an honest proof of anything. The plan's genuinely new, non-duplicated work for S18.4 was the AppShell-level enforcement (Task 2's `forcedBottomBar`), which was built as specified.
- **secops_admin granted view-only `incidents` access.** Without it, the ONLY role that ever reaches `/executive` would 403 immediately on its own landing view — not a cosmetic gap, a broken core deliverable of this exact plan.
- **field_responder's seeded `mobile_bottom_bar_items` corrected**, not left stale, since AppShell now actually reads it (previously unused dead data since 06-02 seeded it but nothing consumed it until this plan's Task 2).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Field Home (Task 1) superseded by existing Phase 5 implementation**
- **Found during:** Task 1, immediately after writing the file and before verification
- **Issue:** The plan's own text asserted Phase 5/F6 was unexecuted; a direct filesystem/STATE.md check showed it is fully shipped, with a real `FieldHome.tsx` already live at `/field`
- **Fix:** Removed the newly-created duplicate `frontend/app/src/pages/field/FieldHome.tsx`/`.css` and its initial commit (`git reset --soft`, since it was the most recent commit and had not been pushed); the plan's `provides` artifact for this path is satisfied by the pre-existing `frontend/app/src/pages/field-mobile/FieldHome.tsx` instead
- **Files modified:** none remain (files deleted)
- **Verification:** `tsc --noEmit` clean after removal; existing field-mobile Playwright specs still pass
- **Committed in:** n/a (reverted before any lasting commit)

**2. [Rule 1 - Bug] backend/scripts/seed.ts's field_responder mobile_bottom_bar_items had drifted from nav-config's canonical labels**
- **Found during:** Task 2, running field-mobile-bottom-nav.spec.ts as a regression check after wiring AppShell to read landing-config
- **Issue:** 06-02's seeded row used stale labels/hrefs ("Tasks"/"Profile"→`/profile`) that predate 05-06's UAT fix to nav-config's own Field-group derivation ("My Tasks"/"Field home"→`/field`) — invisible until this plan made AppShell actually read the row
- **Fix:** Updated the 4-item array to exactly match routes.ts's own canonical Field-group item set
- **Files modified:** `backend/scripts/seed.ts`
- **Verification:** Re-ran `npm run seed`; field-mobile-bottom-nav.spec.ts test 1 passes with corrected labels
- **Committed in:** `f203e01`

**3. [Rule 1 - Bug] field-mobile-bottom-nav.spec.ts's desktop test asserted a stale "rail visible" expectation**
- **Found during:** Task 2, same regression run as above
- **Issue:** The test (correct for Phase 5) asserted `.ep-sidenav--rail` was visible for field_responder at a desktop viewport — this plan's own `forcedBottomBar` override deliberately makes that false now, per F18 S18.4's literal "regardless of viewport" text
- **Fix:** Re-targeted the same substantive assertions (no stale "Profile" label, correct `/field` href, landing screen content) at the bottom bar that now renders instead of the rail
- **Files modified:** `frontend/app/e2e/field-mobile-bottom-nav.spec.ts`
- **Verification:** Test passes; added an explicit `toHaveCount(0)` assertion that no rail exists at all
- **Committed in:** `f203e01`

**4. [Rule 2 - Missing Critical] secops_admin had no `incidents` role_permissions row at all**
- **Found during:** Task 3, building ExecutiveDashboard.tsx's data-fetching and testing it live against the backend
- **Issue:** `GET /api/v1/dashboard/summary` and `GET /api/v1/incidents` are both gated `requirePermission('incidents','view')`; secops_admin (the only role that ever reaches `/executive`) held zero `incidents` permissions, so the executive dashboard would 403 on its own primary data fetch
- **Fix:** Added secops_admin to the existing `incidentsViewOnlyRoles` loop in seed.ts — the same narrow, read-only grant planning_logistics_chief/field_responder already hold; no create/edit/approve added
- **Files modified:** `backend/scripts/seed.ts`
- **Verification:** Re-seeded; `/executive` loads real data; confirmed via `admin-platform-sso.spec.ts`/`admin-users-roles.spec.ts`/`app-shell.spec.ts` (13/13) that the admin console's own nav/behavior is unaffected by the new grant
- **Committed in:** `585fb67`

**5. [Rule 1 - Bug] Plan's "seed 2 new Keycloak identities" instruction was stale**
- **Found during:** Task 3, auditing seed.ts/epmp-realm.json before writing new identities
- **Issue:** The plan assumed field_responder and secops_admin needed fresh Keycloak identities; both `field-responder@epmp.local` (05-05) and `admin@epmp.local` (Phase 1) already exist with exactly the roles/permissions this plan's own Playwright spec needs
- **Fix:** Reused `signInAsFieldResponder`/`signInThroughKeycloak` from the existing `e2e/helpers/sign-in.ts` rather than creating duplicate Keycloak groups/users — mirrors 06-06's identical discovery for its own two identities
- **Files modified:** none (no seed.ts Keycloak-section or epmp-realm.json changes needed)
- **Verification:** Both helpers already proven working by their own prior specs; this plan's new spec passes using them unchanged
- **Committed in:** n/a (no change needed)

---

**Total deviations:** 5 (1 Task-1-superseded, 2 pre-existing-data-bug fixes surfaced by newly-wired code, 1 missing-critical-permission fix, 1 stale-plan-assumption correction)
**Impact on plan:** All fixes necessary for correctness — none represent scope creep. The Task 1 supersession is the largest deviation in surface area but zero in actual lost work: S18.4's real deliverable (the AppShell-level enforcement) was built exactly as specified; only a duplicate page body was avoided.

## Issues Encountered

None beyond the deviations documented above — each was found, fixed, and verified within this plan's own execution, not left open.

## Known Stubs

None found. All newly-written code (`FacetToggle.tsx`, `AppShell.tsx`'s new branches, `ExecutiveDashboard.tsx`) either reads real backend data or renders an explicitly-labeled, honestly-captioned "Not yet available" placeholder for the one KPI this phase's schema cannot answer (`corrective_action_closure_rate` — F7 AAR findings, Phase 4 unexecuted scope) — never a hardcoded fake number presented as real.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 personas (PER-01 through PER-05) now have distinct, role-scoped default landing views — F18's success criterion 1 is fully satisfied across this phase's plans (06-06: PER-01/PER-03; this plan: PER-04/PER-05; PER-02 pre-existing from Phase 2)
- The executive-briefing KPI dashboard's exact shape (1-3 `display`-scale numbers, zero decoration, each with a definition/period/source caption) is built and Playwright-proven — F18's success criterion 2 is fully satisfied
- Full backend suite (19 files, 108 tests) green with zero regression; `tsc --noEmit` clean for both frontend/app and backend; both project builds (`backend`, `frontend/app`) clean
- 25 Playwright tests pass across this plan's own new spec plus every adjacent/regression-risk spec (app-shell, field-mobile-bottom-nav, field-mobile-report, persona-dashboards, admin-platform-sso, admin-users-roles)
- Ready for 06-08 and the remaining Phase 6 plans

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*

## Self-Check: PASSED

- All 8 key files verified present on disk (`[ -f ]`)
- Both task commits (`f203e01`, `585fb67`) verified present in `git log`
- Backend build (`npm run build` → `tsc -p tsconfig.json`): exit 0
- Frontend app build (`npm run build` → `vite build`): exit 0
- Frontend `tsc --noEmit`: exit 0, no errors
- Backend test suite: 19 files, 108/108 passed
- Playwright: 25/25 passed across this plan's own 5 new tests plus 20 adjacent/regression specs (app-shell, field-mobile-bottom-nav, field-mobile-report, persona-dashboards, admin-platform-sso, admin-users-roles)
- `## Known Stubs` section present above; no blocking stubs found
