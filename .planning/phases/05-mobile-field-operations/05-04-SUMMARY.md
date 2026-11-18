---
phase: 05-mobile-field-operations
plan: 04
subsystem: mobile-field-ops
tags: [react, react-router, indexeddb, fastify, postgres, playwright, design-system]

# Dependency graph
requires:
  - phase: 05-01
    provides: "sync_conflicts table + GET /api/v1/sync-conflicts + POST /api/v1/sync-conflicts/:id/resolve"
  - phase: 05-02
    provides: "offline-queue.ts (IndexedDB field_reports store, getQueueSnapshot/subscribeToQueue) + SyncStatus design-system component"
  - phase: 05-03
    provides: "FieldMobileShell wrapper + FieldHome/MyTasksField/ReportObservation screens + main.tsx's first 3 field-mobile routes"
  - phase: 05-05
    provides: "real seeded field_responder Keycloak identity (field-responder@epmp.local) + signInAsFieldResponder Playwright helper"
provides:
  - "Queued Submissions View (/field/queued) -- live per-item status, Delete (pending-only), Retry (failed-only, fresh client_report_id)"
  - "Sync Conflict Resolution (/field/conflicts/:id) -- side-by-side field/EOC version comparison, no default button selection, commits via real resolve endpoint"
  - "Field Map (/field/map) -- MapCanvas with real operating-picture markers + dashed-outline pending field-report markers, offline-reactive base layer"
  - "GET /api/v1/sync-conflicts/:id single-record lookup (05-04 addition to 05-01's sync-conflicts.ts)"
  - "GET /api/v1/me/nav-config's new 'Field' bottom-bar group (Tasks/Report/Map/Profile) for any field_reports-permissioned role"
  - "All 6 field-mobile routes wired into main.tsx's route tree -- no orphan screens"
affects: ["phase-6", "mobile-field-ops", "operating-picture"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Conflict resolution is an explicit online-only action (apiPost directly, never offline-queued) -- a conflict is only ever surfaced after a successful sync attempt, so the resolving user is by definition back online"
    - "A design-system marker-type union (MapMarkerType) with no dedicated 'field report' entry is reused ('resource') rather than widened, with visual distinction achieved via a scoped aria-label-substring CSS selector instead of a new shared type"

key-files:
  created:
    - frontend/app/src/pages/field-mobile/QueuedSubmissions.tsx
    - frontend/app/src/pages/field-mobile/QueuedSubmissions.css
    - frontend/app/src/pages/field-mobile/SyncConflictResolution.tsx
    - frontend/app/src/pages/field-mobile/SyncConflictResolution.css
    - frontend/app/src/pages/field-mobile/FieldMap.tsx
    - frontend/app/src/pages/field-mobile/FieldMap.css
    - frontend/app/e2e/field-mobile-sync-conflict.spec.ts
  modified:
    - frontend/app/src/lib/offline-queue.ts
    - backend/src/modules/incident-ops/sync-conflicts.ts
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts

key-decisions:
  - "Added a small GET /api/v1/sync-conflicts/:id single-record route to 05-01's sync-conflicts.ts rather than client-side .find()-ing the unresolved-only list, since an already-resolved conflict (e.g. revisited via browser back) would otherwise 404 against that list"
  - "Field Map's queued/pending markers reuse MapMarkerType='resource' (the closest existing type) with a dashed CSS outline for visual distinction, rather than widening the shared design-system MapMarker union -- 02-07/03-09 and other map consumers depend on that type unchanged"
  - "nav-config's new 'Field' bottom-bar group routes both 'Tasks' and 'Profile' to /field -- 'Tasks' per the Navigation Map's explicit Field-Home-is-the-landing-tab documentation, 'Profile' because no dedicated screen exists anywhere in F6's scope and AppShell's header Avatar menu remains the real profile entry point at every breakpoint"
  - "AppShell.tsx required NO code change -- confirmed its isBelowBpMd branch already derives mobileBottomBarItems generically via navGroups.flatMap(g => g.items), so the new nav-config group renders through existing, unmodified bottom-bar wiring"

patterns-established:
  - "A conflict-resolution UI's two outcome buttons carry zero autoFocus/defaultChecked by construction, verified by grep in the plan's own <verify> block -- 'no default/pre-selected choice' as a structural property, not a convention"

# Metrics
duration: 55min
completed: 2026-11-18
---

# Phase 5 Plan 4: Queued Submissions, Sync Conflict Resolution, Field Map + full route wiring Summary

**Completed the F6 mobile field-ops screen set and wired all 6 field-mobile routes into the real route tree and a new role-driven bottom-nav group, closing out phase success criteria 2-4 with a Playwright spec that seeds a real conflict via the backend's own sync-batch endpoint and proves the full see-both-versions/no-default-choice/explicit-resolve/server-committed chain.**

## Performance

- **Duration:** 55 min
- **Tasks:** 3
- **Files modified/created:** 11 (7 created, 4 modified)

## Accomplishments
- Queued Submissions View: live-updating (via `subscribeToQueue`) list of every queued field report with a status-appropriate action set (Delete only pre-sync, Retry only on failure with a fresh `client_report_id`, tap-through to conflict resolution only on conflict)
- Sync Conflict Resolution: the phase's hardest success criterion — both the field version and the current EOC version render side-by-side (stacked on mobile), differing fields highlighted via `var(--warning-subtle)`, with two equally-weighted buttons carrying no default selection, committing directly to the real resolve endpoint
- Field Map: a genuinely lightweight operating-picture view reusing Phase 2/3's `MapCanvas` + real markers endpoint, merged with the offline-queue's own pending location-tagged reports as visually distinct (dashed outline) synthetic markers — offline reactivity affects only the base layer, never marker visibility
- All 6 field-mobile routes (3 from 05-03, 3 from this plan) are now reachable via `main.tsx`'s route tree, and a real 4-item role-driven bottom-nav group (`Tasks`/`Report`/`Map`/`Profile`) renders for any `field_reports`-permissioned role — verified live against the real backend for the seeded `field_responder` identity
- A real end-to-end Playwright spec seeds an actual sync conflict via the production `sync-batch` endpoint (same mechanism 05-01's own backend integration test uses) and proves the entire detect → surface → explicit-choice → server-commit chain through the real browser UI

## Task Commits

Each task was committed atomically:

1. **Task 1: Queued Submissions View + Sync Conflict Resolution** - `569eb7a` (feat)
2. **Task 2: Field Map (offline-capable lightweight operating picture)** - `4e4e492` (feat)
3. **Task 3: Route-tree + bottom-nav wiring, conflict-resolution Playwright test** - `64a8ec4` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/field-mobile/QueuedSubmissions.tsx` — live queue list, Delete/Retry actions, conflict tap-through
- `frontend/app/src/pages/field-mobile/SyncConflictResolution.tsx` — side-by-side version comparison, explicit two-choice resolve
- `frontend/app/src/pages/field-mobile/FieldMap.tsx` — MapCanvas composition with merged real + queued markers
- `frontend/app/src/lib/offline-queue.ts` — added `deleteQueuedItem` export
- `backend/src/modules/incident-ops/sync-conflicts.ts` — added `GET /api/v1/sync-conflicts/:id`
- `frontend/app/src/main.tsx` — appended the 3 remaining field-mobile routes
- `backend/src/modules/auth-org/routes.ts` — added the `hasFieldReports`-gated `Field` nav group
- `frontend/app/e2e/field-mobile-sync-conflict.spec.ts` — full-stack conflict-resolution proof

## Decisions Made
See frontmatter `key-decisions` above — summarized: (1) added a small single-record sync-conflicts GET route rather than client-side-filtering the unresolved list; (2) Field Map's queued markers reuse the existing `resource` marker type with CSS-only visual distinction rather than widening the shared `MapMarkerType` union; (3) nav-config's `Tasks`/`Profile` bottom-bar items both route to `/field` per the Navigation Map's documented landing-tab convention and the absence of any dedicated Profile screen; (4) `AppShell.tsx` needed no edit at all — confirmed by reading, not assumed.

## Deviations from Plan

None — plan executed exactly as written. The plan's own frontmatter explicitly anticipated and pre-authorized the `GET /api/v1/sync-conflicts/:id` addition ("this plan's discretion is to add a tiny ... single-record route") and the `MapMarkerType` reuse-not-widen choice, so neither required a Rule 4 ask; both are documented above as the plan's own built-in discretion points, not unplanned deviations.

## Issues Encountered

One pre-existing, out-of-scope test-isolation flake surfaced while running the full backend suite: `tasks.test.ts`'s `POST /api/v1/tasks with no owner_id ...` case asserts a bare `SELECT count(*) FROM tasks` before/after comparison, which is sensitive to other concurrently-running test files inserting rows into the shared compose-stack database during a full-suite run. Confirmed unrelated to this plan (none of this plan's changes touch the `tasks` table) by running that file in isolation — all 5 of its tests pass cleanly. Logged to `.planning/phases/05-mobile-field-operations/deferred-items.md` per the deviation rules' scope boundary; not fixed.

## Known Stubs

None found — scanned every created/modified file for TODO/FIXME/placeholder/not-implemented/coming-soon markers and hardcoded-response handlers; none present.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Phase 5 (Mobile Field Operations) is now fully complete: all 5 plans (05-01, 05-02, 05-05, 05-03, 05-04) shipped. Every F6 screen is built, routed, and reachable; all 4 phase success criteria are concretely verified end-to-end against the real backend.
- `npx tsc --noEmit` clean on both `frontend/app` and `backend`; `npm run build` clean on `backend`, `frontend/design-system`, and `frontend/app`; `frontend/app` vitest (5 tests) and `frontend/design-system` vitest (59 tests) both green; this plan's own Playwright spec (2 tests) and the pre-existing `field-mobile-report.spec.ts` (1 test, regression check) both pass.
- No blockers for Phase 6.

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-18*

## Self-Check: PASSED

- All 9 created/modified files listed above confirmed present on disk via `[ -f ]`.
- All 3 task commits (569eb7a, 4e4e492, 64a8ec4) confirmed present via `git log --oneline --all`.
- Build check: `npm run build -w backend` → exit 0; `npm run build -w frontend/app` → exit 0; `npm run build -w frontend/design-system` → exit 0.
- `## Known Stubs` section present above: none found, no blocking entries.
