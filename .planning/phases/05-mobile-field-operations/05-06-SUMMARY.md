---
phase: 05-mobile-field-operations
plan: 06
subsystem: ui
tags: [navigation, nav-config, side-nav, bottom-nav, react, fastify, playwright, gap-closure]

# Dependency graph
requires:
  - phase: 05-mobile-field-operations
    provides: "field-mobile routes (/field, /field/tasks, /field/report, /field/queued, /field/conflicts/:id, /field/map), nav_groups-driven SideNav/bottom-bar rendering, the seeded field_responder@epmp.local identity"
provides:
  - "nav_groups[].id — a stable, machine-readable group identifier alongside each group's existing display `label`, emitted for all 7 possible groups (Prepare/Monitor/Activate/Coordinate/Improve/Field/Admin)"
  - "AppShell.tsx's mobileBottomBarItems — selects the Field group specifically by id, independent of flatItems' emission-order-dependent flattening"
  - "SideNavGroup.id (design system type) — optional, additive field callers can key off instead of the human-readable label"
  - "Field group's 4th item relabeled 'Profile' -> 'Field home' (icon 'users' -> 'home')"
affects: [mobile-field-operations, navigation, app-shell]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Nav-group selection by stable id, not label text or flattened-array position — mirrors existing id-based item selection within a group, extended to the group level itself"
    - "Defensive fallback (fieldGroup ? fieldGroup.items : flatItems) preserves pre-fix behavior for any role lacking the targeted group, avoiding a hard crash/empty-render edge case"

key-files:
  created:
    - frontend/app/e2e/field-mobile-bottom-nav.spec.ts
  modified:
    - backend/src/modules/auth-org/routes.ts
    - backend/src/modules/auth-org/routes.test.ts
    - frontend/app/src/app-shell/AppShell.tsx
    - frontend/design-system/src/navigation/SideNav.tsx
    - frontend/design-system/test/layout-nav.test.tsx
    - .planning/phases/05-mobile-field-operations/deferred-items.md

key-decisions:
  - "nav_groups[].id selects the mobile bottom-bar's source group — not array position or label text — so a field_responder's broad Phase 1-4 view-only grants (which populate 5 groups before Field's own items) can no longer push the wrong 4 items into the bottom bar regardless of future emission-order or label-wording changes"
  - "Field group's 4th item relabeled 'Profile' -> 'Field home' (not renamed id/href) — closes UAT-1's discoverability gap with zero blast radius to anything keying off the existing id/href"

# Metrics
duration: 12min
completed: 2026-11-19
---

# Phase 5 Plan 06: Mobile Field Operations — Gap Closure (UAT-8/UAT-1) Summary

**Backend emits a stable `nav_groups[].id` per lifecycle group; AppShell's mobile bottom-bar now selects the Field group by that id instead of flattening+slicing the whole nav array, and the Field group's ambiguous "Profile" label is now "Field home".**

## Performance

- **Duration:** 12 min
- **Started:** 2026-11-19T10:50:00Z (approx, context load)
- **Completed:** 2026-11-19T10:58:36Z
- **Tasks:** 3
- **Files modified:** 6 (5 code/test files + 1 deferred-items.md log)

## Accomplishments
- Fixed UAT-8 (blocker): a field_responder on a real mobile-width viewport now sees the bottom bar read exactly "My Tasks / Report / Map / Field home" — never the desktop Prepare/Monitor/Activate/Coordinate group items that previously leaked in via `flatItems.slice(0,4)`'s emission-order dependency.
- Fixed UAT-1 (major): the Field group's 4th SideNav item on desktop/tablet now reads "Field home" (not "Profile"), making the combined tasks+Report-button landing screen discoverable without trial-and-error.
- Confirmed (not re-fixed) F-05-01: the security finding's 16-test suite (including the 9-test jurisdiction-scope-enforcement block) still passes untouched — this plan never touched `field-reports.ts`/`sync-conflicts.ts`.
- Added a stable `id` to every possible `nav_groups` entry (7 groups total), not just Field — applying the convention uniformly per the plan's own instruction.
- Proved zero regression for every other role's nav rendering via the pre-existing `app-shell.spec.ts` test 2 (which derives its expected label set directly from the live API response, so it needed no code change and still passes).

## Task Commits

Each task was committed atomically:

1. **Task 1: Give every nav_groups entry a stable `id`, relabel Field's 4th item, add `SideNavGroup.id`** - `cc0d599` (feat)
2. **Task 2: Make AppShell's mobile bottom-bar select the Field group specifically, update tests** - `c852e10` (fix)
3. **Task 3: Playwright e2e proving the real field_responder sees the fixed bottom-bar and desktop label** - `2aaf9f4` (test)

**Plan metadata:** (this commit, next)

## Files Created/Modified
- `backend/src/modules/auth-org/routes.ts` - Every `nav_groups` entry gains `id` (prepare/monitor/activate/coordinate/improve/field/admin); Field group's 4th item relabeled `'Profile'` → `'Field home'`, icon `'users'` → `'home'`; stale inline comment replaced with the UAT-1 gap-ref explanation
- `backend/src/modules/auth-org/routes.test.ts` - New regression test proving every `nav_groups` entry carries a non-empty `id` and the Field group's 4th item reads `'Field home'`; grants/revokes `field_reports:view` on the shared test role with OPA re-sync, restoring state afterward so the pre-existing empty-`nav_groups` test's assumption holds on repeat runs
- `frontend/app/src/app-shell/AppShell.tsx` - New `fieldGroup`/`mobileBottomBarItems` derivation selects `navGroups.find(g => g.id === 'field').items` specifically for the bottom bar, falling back to `flatItems` only if no Field group exists; `flatItems`/`currentItem` unchanged (still used for rail highlight-matching across all groups)
- `frontend/design-system/src/navigation/SideNav.tsx` - `SideNavGroup` interface gains optional `id?: string` (type-only, additive; rendering loop still keys/display off `label` exactly as before)
- `frontend/design-system/test/layout-nav.test.tsx` - New regression test proving `SideNav` renders unaffected when `groups` entries carry the additive `id` field
- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` - New Playwright spec (2 tests): mobile-viewport bottom-bar label assertion + desktop-viewport "Field home" label/href/navigation assertion, both against the real seeded `field-responder@epmp.local` identity and live backend
- `.planning/phases/05-mobile-field-operations/deferred-items.md` - Logged one pre-existing, out-of-scope test-isolation flake discovered during regression verification (see Deviations)

## Decisions Made
- Selected the Field group for the mobile bottom-bar by `nav_groups[].id === 'field'` rather than by array position, label text, or a dedicated backend endpoint — this is resilient to future group-count/ordering/label changes and required no new API surface, since `nav_groups` already carried everything needed once given a stable key.
- Kept the Field item's existing `id: 'field-profile'` and `href: '/field'` unchanged when relabeling — only `label` and `icon` changed, minimizing blast radius to zero other consumers (confirmed via repo-wide grep per the plan's own instruction).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Test-isolation leak: new regression test's `field_reports` grant on the shared test role broke the pre-existing empty-`nav_groups` test**
- **Found during:** Task 2 verification (full backend suite run)
- **Issue:** The plan's own test snippet granted `field_reports:view` to `testRoleId` but didn't revoke it afterward. Since `routes.test.ts` runs against the real persistent compose-stack Postgres DB (not a per-test-file-isolated one), the leaked grant made the pre-existing `'GET /api/v1/me/nav-config returns a NavGroup[] shaped...'` test (which asserts `nav_groups` is empty for this role) fail on any subsequent run, since the Field group now appeared for that same role.
- **Fix:** Added a cleanup step at the end of the new test (`DELETE FROM role_permissions WHERE role_id = $1 AND feature = 'field_reports'` + re-sync to OPA), restoring `testRoleId` to its pre-test `platform:view`-only state — same restore-after-test pattern the file's own pre-existing suspended-user test already uses.
- **Files modified:** `backend/src/modules/auth-org/routes.test.ts`
- **Verification:** Ran the full backend suite twice in a row (87/87 passing both times), confirming idempotency.
- **Committed in:** `c852e10` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/test-isolation)
**Impact on plan:** Necessary for correctness of the test suite's own idempotency; no scope creep — the fix is confined entirely to the new test's own cleanup, touching no production code beyond what Task 2 already specified.

## Issues Encountered

- During Task 3's regression-suite verification (plan's own verification step 5), the pre-existing `field-mobile-sync-conflict.spec.ts` test failed with a `GET /api/v1/sync-conflicts/:id` 404. Root-caused via direct DB query: the spec's setup picks `jurisdictions.items[0]` (API's `ORDER BY name` list) as the test incident's jurisdiction; an unrelated prior phase's test fixture (`04-04 Seed Permissions Test Jurisdiction`) now sorts alphabetically before `Default Agency` in the same shared compose-stack DB, so the created incident lands outside both `commander@epmp.local`'s and `field-responder@epmp.local`'s `jurisdiction_scope` — the lookup's jurisdiction-scope enforcement (the F-05-01 fix) correctly 404s it. This is a pre-existing test-isolation gap in an unrelated spec file's jurisdiction-selection logic, not caused by this plan's `routes.ts`/`AppShell.tsx`/`SideNav.tsx` changes (none of which touch jurisdictions/incidents/sync_conflicts). Logged to `deferred-items.md` per the deviation-rules scope boundary; not fixed, since it is out of this plan's scope and pre-dates it (confirmed unrelated by reading the diff against the pre-plan commit).
- This plan's own new spec (`field-mobile-bottom-nav.spec.ts`, 2/2), the pre-existing `app-shell.spec.ts` (4/4), and `field-mobile-report.spec.ts` (1/1) all pass cleanly, confirming zero regression from this plan's actual code changes.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both UAT gaps (ref 8 blocker, ref 1 major) are closed and proven end-to-end against the real seeded `field-responder@epmp.local` identity, via both unit-level (backend/design-system) and e2e (Playwright) coverage.
- F-05-01 remains confirmed fixed (16/16 tests), untouched by this plan.
- Full backend suite (87/87), design-system suite (6/6 relevant tests in `layout-nav.test.tsx`), and all three project builds (backend/frontend-app/design-system) are clean.
- One pre-existing, unrelated test-isolation flake in `field-mobile-sync-conflict.spec.ts` (jurisdiction-ordering drift from accumulated cross-phase test fixtures in the shared DB) is logged in `deferred-items.md` — a candidate for a future gap-closure plan if it starts blocking other work, but does not block this plan's own closure since it predates and is independent of this plan's changes.
- Phase 5 (Mobile Field Operations) remains structurally complete; this plan closes its last two open UAT gaps. Ready for Phase 6.

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-19*

## Known Stubs

None found. Pre-existing, unrelated placeholders in `AppShell.tsx` (the disabled Search/Alerts no-ops, Phase 1 scope) and `SideNav.tsx` (the `Tooltip`-pending TODO) were not introduced or touched by this plan.

## Self-Check: PASSED

- `frontend/app/e2e/field-mobile-bottom-nav.spec.ts` — FOUND on disk
- `.planning/phases/05-mobile-field-operations/05-06-SUMMARY.md` — FOUND on disk
- Commit `cc0d599` (Task 1) — FOUND in git log
- Commit `c852e10` (Task 2) — FOUND in git log
- Commit `2aaf9f4` (Task 3) — FOUND in git log
- Build check: `cd backend && npm run build` → exit 0
- Build check: `cd frontend/app && npm run build` → exit 0
- Build check: `cd frontend/design-system && npm run build` → exit 0
