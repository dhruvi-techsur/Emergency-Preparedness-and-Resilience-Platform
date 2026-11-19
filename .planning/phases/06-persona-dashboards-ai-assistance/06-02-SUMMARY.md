---
phase: 06-persona-dashboards-ai-assistance
plan: 02
subsystem: auth-org
tags: [rbac, postgres, fastify, persona-dashboards, F18]

# Dependency graph
requires:
  - phase: 06-01
    provides: "incidentsFullAccessRoles approve-grant edit already applied in seed.ts (explicit depends_on edge to avoid a same-wave seed.ts conflict)"
provides:
  - "role_landing_config fully populated — 5 rows, one per persona role (PER-01..PER-05), each with a distinct default_landing_route and nav_groups array"
  - "GET /api/v1/me/landing-config — resolves the signed-in user's own role_landing_config row into the TechArch LandingConfig shape, with a documented non-blank 200 ROLE_VIEW_UNMAPPED fallback for any role with no row"
affects: [06-05, 06-06, 06-07, frontend-dashboard-routing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "role_landing_config seeded via the file's existing findOrInsert (natural key role_id, UNIQUE per schema) + explicit re-assert UPDATE immediately after — same idempotent-overwrite pattern sso_config's group_to_role_mapping block already established"
    - "JSONB nullable-column binding: pass the actual JS `null` as the bound parameter for a nullable JSONB column, never JSON.stringify(null) — the stringified form writes a JSONB scalar null that fails an `IS NULL OR jsonb_array_length(...)` CHECK's first branch"

key-files:
  created:
    - backend/src/modules/auth-org/landing-config.ts
    - backend/src/modules/auth-org/landing-config.test.ts
  modified:
    - backend/scripts/seed.ts
    - backend/src/modules/auth-org/routes.ts

key-decisions:
  - "PER-05 (secops_admin) modeled as ONE role_landing_config row carrying only the admin (default) facet's nav_groups — role_id is UNIQUE per the table's own constraint, so the executive facet's distinct SideNav is NOT stored here; 06-07's frontend hardcodes it client-side, documented inline in both seed.ts and this summary as a budget-scoped simplification"
  - "PER-02's default_landing_route is /incidents (the list), not a specific active-incident id, per S18.2's own 'Incident List if none is active' wording — 06-05's frontend wraps active-incident-redirect logic client-side"
  - "PER-04's nav_groups is deliberately []  — S18.4 offers no desktop SideNav variant to this role by default; it only ever sees the 4-item mobile bottom bar"

patterns-established:
  - "A route accepting no parameters and keying exclusively on req.epmpUser!.role_id is the structural mitigation for 'can a caller read another role's config' — no param to pass means no cross-role read is possible by construction (see this plan's own threat register T-06-04)"

# Metrics
duration: 18min
completed: 2026-11-19
---

# Phase 6 Plan 02: Persona Landing-Config Backend Summary

**Populated the F18 `role_landing_config` reference table (migrated in Phase 1, explicitly left empty) with 5 distinct persona configs, and shipped `GET /api/v1/me/landing-config` resolving them with a non-blank `ROLE_VIEW_UNMAPPED` fallback for any unmapped role.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-11-19T12:03:00Z (approx, first file read)
- **Completed:** 2026-11-19T12:21:54Z
- **Tasks:** 3 completed
- **Files modified:** 4 (1 new endpoint, 1 new test, seed.ts extended, routes.ts extended)

## Accomplishments
- `backend/scripts/seed.ts` now idempotently seeds all 5 `role_landing_config` rows (PER-01 eoc_director through PER-05 secops_admin), each matching F18's S18.1–S18.5 screen specs exactly, re-asserted via UPDATE on every seed run.
- `GET /api/v1/me/landing-config` resolves the signed-in user's own role into the TechArch `LandingConfig` shape (`default_route`, `nav_groups`, `mobile_bottom_bar_items`), or returns the FRD's exact `200 ROLE_VIEW_UNMAPPED` fallback payload/message for any role with no row — never a 404/500.
- New integration test (`landing-config.test.ts`, 4 `it` blocks / 8 logical assertions) proves all 5 personas resolve distinct routes, PER-04's bottom-bar cap (exactly 4 items), PER-05's admin-only `nav_groups`, and the unmapped-role fallback end-to-end against the real Postgres+OPA compose stack.

## Task Commits

Each task was committed atomically:

1. **Task 1: role_landing_config seed rows for all 5 personas** - `196afe0` (feat)
2. **Task 2: GET /api/v1/me/landing-config with ROLE_VIEW_UNMAPPED fallback** - `7a3a00d` (feat)
3. **Task 3: Integration test — all 5 personas resolve distinct configs, unmapped-role fallback** - `1b65de2` (test)

_No separate plan-metadata commit yet — this SUMMARY.md + STATE.md update will be committed next per the execute-plan workflow's `git_commit_metadata` step._

## Files Created/Modified
- `backend/scripts/seed.ts` - Appended a `roleLandingConfigs` array (5 entries) + a findOrInsert-then-UPDATE loop populating `role_landing_config`, keyed on `role_id` (the table's own UNIQUE natural key)
- `backend/src/modules/auth-org/landing-config.ts` - New file: `GET /api/v1/me/landing-config`, `requirePermission('platform','view')`-gated, queries by `req.epmpUser!.role_id` only, maps `default_landing_route`→`default_route`, defaults `nav_groups`/`mobile_bottom_bar_items` to `[]` when absent/unmapped
- `backend/src/modules/auth-org/routes.ts` - Registers `landingConfigRoutes` after the existing admin route registrations (append-only convention, per this plan's own sequencing note)
- `backend/src/modules/auth-org/landing-config.test.ts` - New integration test file: 5-role distinct-route assertions, PER-04 bottom-bar-length assertion, PER-05 admin-only-nav_groups assertion, throwaway-6th-role unmapped-fallback assertion

## Decisions Made
- PER-05 modeled as one row carrying only the admin facet's `nav_groups` — see frontmatter `key-decisions` above for full rationale (role_id UNIQUE constraint, no second-facet schema field, documented client-side handling for 06-07).
- PER-02's `default_landing_route` is `/incidents` (the list), not a resolved "current active incident" id — same rationale, see frontmatter.
- PER-04's `nav_groups` is deliberately `[]` — this role gets no desktop SideNav by default, only the 4-item mobile bottom bar.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `JSON.stringify(null)` writes a JSONB scalar `null`, not SQL `NULL`, breaking PER-05's `chk_bottom_bar_max` CHECK**
- **Found during:** Task 1 (first seed run, verification step)
- **Issue:** PER-05's `mobile_bottom_bar_items` is intentionally `null` per the plan's own spec. Binding `JSON.stringify(cfg.mobile_bottom_bar_items)` for that case produced the parameter string `"null"`, which Postgres writes into the JSONB column as the **scalar JSON value** `null` — not a true SQL `NULL`. The table's `chk_bottom_bar_max CHECK (mobile_bottom_bar_items IS NULL OR jsonb_array_length(mobile_bottom_bar_items) <= 4)` then evaluated its second branch against a scalar, and Postgres raised `ERROR: cannot get array length of a scalar` (`jsonb_array_length` requires its argument to actually be a JSON array). Every seed run failed outright at the PER-05 row.
- **Fix:** Added an explicit `mobileBottomBarParam` check in the seed loop: pass the real JS `null` (not its `JSON.stringify`'d string) as the bound parameter whenever `cfg.mobile_bottom_bar_items === null`, so `pg` writes a true SQL `NULL` and the CHECK's first (`IS NULL`) branch short-circuits correctly, exactly as it does for every other nullable JSONB write elsewhere in this file.
- **Files modified:** `backend/scripts/seed.ts`
- **Verification:** Re-ran `npm run seed` twice — first run reported `role_landing_config=1 inserted/4 already-present` (PER-05 landing the fix), second run reported `0 inserted/5 already-present` (idempotency confirmed). Direct `psql` inspection confirmed PER-05's `mobile_bottom_bar_items IS NULL` is `true` and all 4 other roles have exactly 4 bottom-bar entries.
- **Committed in:** `196afe0` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** The fix is necessary for Task 1's own stated `<done>` criterion ("PER-05's nav_groups contains only the Admin group... re-running the seed script does not create duplicate rows") to be satisfiable at all — without it, every seed run (including a correctly-written one) would crash on PER-05's row. No scope creep; confined entirely to this plan's own new code in seed.ts.

## Issues Encountered
None beyond the auto-fixed deviation above.

## User Setup Required
None — no external service configuration required.

## Next Phase Readiness
- 06-05/06-06/06-07's frontend dashboard pages and RouteGuard's post-login redirect can now call `GET /api/v1/me/landing-config` for a real, per-role default route and nav configuration — the data-source half of success criterion 1 is complete and tested for all 5 personas.
- Full backend suite (17 files, 98 tests — 94 pre-existing + 4 new) green with zero regression; `tsc --noEmit` and `npm run build` both clean.
- No blockers for subsequent Phase 6 plans building on this endpoint.

## Known Stubs

None found. Scanned all 4 changed/created files (`backend/src/modules/auth-org/landing-config.ts`, `backend/src/modules/auth-org/landing-config.test.ts`, `backend/scripts/seed.ts`, `backend/src/modules/auth-org/routes.ts`) for TODO/FIXME/placeholder/not-implemented markers — the one grep hit (`placeholders` variable name in seed.ts's pre-existing `findOrInsert` helper, used for SQL `$1,$2,...` bind-parameter strings) is unrelated code, not a stub.

## Self-Check: PASSED

- All 5 key files confirmed present on disk via `[ -f ]`.
- All 3 task commits (`196afe0`, `7a3a00d`, `1b65de2`) confirmed present via `git log --oneline --all`.
- Build check: `npm run build` → exit 0.
- Full backend test suite: 17 files, 98 tests, all passing (verified via `npx vitest run`).
- `npx tsc --noEmit` clean.
- No blocking stubs found.

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
