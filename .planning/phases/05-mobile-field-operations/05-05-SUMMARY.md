---
phase: 05-mobile-field-operations
plan: 05
subsystem: auth
tags: [rbac, opa, keycloak, seed, playwright, field_reports]

# Dependency graph
requires:
  - phase: 05-mobile-field-operations
    provides: "05-01's field_reports/sync_conflicts API routes, already RBAC-gated via requirePermission('field_reports', ...)"
  - phase: 01-foundation
    provides: "01-01's idempotent find-or-insert seed pattern and the 5 persona roles (field_responder, incident_commander, eoc_director, planning_logistics_chief, secops_admin)"
provides:
  - "Idempotent role_permissions grants for the field_reports feature: field_responder (view/create/resolve), incident_commander/eoc_director (view/resolve), planning_logistics_chief (view)"
  - "Real Keycloak-seeded field_responder identity (field-responder@epmp.local, epmp-field-responders group) mapped via group_to_role_mapping"
  - "signInAsFieldResponder Playwright helper — canonical, sole definition for every Phase 5 frontend plan to import"
  - "3 new integration tests proving the seeded grants authorize real requests end-to-end through OPA"
affects: [05-03, 05-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Phase 5's field-responder Keycloak identity follows the exact seed/realm-file append-only pattern 02-05/03-05/04-04 established"

key-files:
  created: []
  modified:
    - backend/scripts/seed.ts
    - backend/keycloak/epmp-realm.json
    - frontend/app/e2e/helpers/sign-in.ts
    - backend/src/modules/incident-ops/field-reports.test.ts

key-decisions:
  - "field_responder is granted resolve (not just view/create) on field_reports — the mockup's Sync Conflict Resolution screen is reached from the field responder's own Queued Submissions View, so they resolve their own conflict on-device"
  - "incident_commander/eoc_director get view+resolve but deliberately NOT create — field-report authorship belongs to field_responder; EOC-side command staff review and resolve from the EOC side only"
  - "planning_logistics_chief gets view-only, consistent with every other feature's read-access-for-planning-staff pattern"
  - "Pre-seeded field-responder@epmp.local with Default Agency jurisdiction_scope up front (not left to JIT provisioning), following the exact 02-07/03-05 precedent that fixes the empty-scope gap"

patterns-established:
  - "Phase 5's wave-2 seed/RBAC plan is the sole, first owner of its phase's new Keycloak group/user and Playwright sign-in helper — no later-wave frontend plan re-adds or duplicates it"

# Metrics
duration: 25min
completed: 2026-11-18
---

# Phase 5 Plan 05: Field-Reports RBAC Seed + Real Field-Responder Identity Summary

**Idempotent field_reports role_permissions grants (field_responder: view/create/resolve; incident_commander/eoc_director: view/resolve; planning_logistics_chief: view) plus a real Keycloak-seeded field-responder@epmp.local identity and canonical signInAsFieldResponder Playwright helper, proven end-to-end through 3 new OPA-backed integration tests.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-18T14:32:54Z
- **Completed:** 2026-11-18T14:58:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Extended `backend/scripts/seed.ts` with idempotent `field_reports` role_permissions grants, documenting inline why `field_responder` deliberately holds `resolve` (matching the mockup's field-responder-resolves-their-own-conflict screen design) while `incident_commander`/`eoc_director` get `view`+`resolve` but NOT `create`
- Added a fourth seeded Keycloak group/user (`epmp-field-responders` + `field-responder@epmp.local`) to `backend/keycloak/epmp-realm.json`, following the file's exact established append-only pattern
- Pre-seeded `field-responder@epmp.local`'s jurisdiction_scope up front (same fix 02-07/03-05 applied for commander/planner/eocdirector), avoiding the JIT-provisioning empty-scope gap
- Added `signInAsFieldResponder` (+ its username/password constants) to `frontend/app/e2e/helpers/sign-in.ts` as the sole, canonical definition every Phase 5 frontend Playwright suite (05-03, 05-04) will import
- Added 3 new integration tests to 05-01's existing `field-reports.test.ts`, minting tokens for REAL seeded roles (not a test-scoped role_permissions row) to prove the seed's grants genuinely authorize real requests end-to-end through OPA: field_responder create succeeds, field_responder resolve succeeds, planning_logistics_chief create is denied (403) while view succeeds (200)

## Task Commits

Each task was committed atomically:

1. **Task 1: Idempotent seed additions + real Keycloak field-responder identity** - `3a2bd0e` (feat)
2. **Task 2: signInAsFieldResponder helper + end-to-end permission proof** - `7180a09` (feat)

## Files Created/Modified

- `backend/scripts/seed.ts` - Added field_reports role_permissions grant blocks (field_responder, incident_commander, eoc_director, planning_logistics_chief), a new group_to_role_mapping entry, and a pre-seeded field-responder@epmp.local user row
- `backend/keycloak/epmp-realm.json` - Added `epmp-field-responders` group + `field-responder@epmp.local` user (devpass123, following the existing 3-user pattern exactly)
- `frontend/app/e2e/helpers/sign-in.ts` - Added `signInAsFieldResponder` + `KEYCLOAK_FIELD_RESPONDER_USERNAME`/`PASSWORD`, mirroring `signInAsIncidentCommander`'s structure
- `backend/src/modules/incident-ops/field-reports.test.ts` - Added `mintTokenForSeededRole` helper + 3 new integration tests proving the seeded grants work end-to-end

## Decisions Made

- `field_responder` granted `resolve` (not withheld) on `field_reports`, since the mockup's own Navigation Map shows the Sync Conflict Resolution screen reached from the field responder's own Queued Submissions View — they resolve their own conflict on-device via "Keep my version"/"Keep EOC version"
- `incident_commander`/`eoc_director` get `view`+`resolve` but deliberately NOT `create` — field-report authorship is field_responder's alone; EOC-side command staff review and resolve conflicts from the EOC side only
- `planning_logistics_chief` gets `view`-only, consistent with every other feature's read-access-for-planning-staff pattern (03-07/04-04 precedent)
- Pre-seeded `field-responder@epmp.local`'s jurisdiction_scope with 'Default Agency' up front rather than relying on JIT provisioning's empty-scope default, following the exact 02-07/03-05 fix pattern

## Deviations from Plan

None - plan executed exactly as written. The plan's own initial draft reasoning (visible in its `<action>` text) walked through and corrected itself to grant `field_responder` the `resolve` action — this summary implements that corrected, final instruction, not the initial withheld-resolve instinct the plan text shows working through.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. The real Keycloak identity (`field-responder@epmp.local` / `devpass123`) is seeded entirely through the already-running compose stack's `backend/keycloak/epmp-realm.json` realm import — no manual dashboard step needed.

## Next Phase Readiness

- `signInAsFieldResponder` and the real seeded `field_responder` identity are now available for 05-03 and 05-04 to import directly — no later plan needs to touch `epmp-realm.json`'s field-responder entries or redefine the helper
- `field_reports` role_permissions grants are live in the shared compose-stack database (verified idempotent across multiple seed runs, zero duplicates)
- Full backend test suite (15 files, 77 tests) green with zero regression; `tsc --noEmit` clean in both backend and frontend/app; both builds clean
- This closes the final gap in Phase 5's F6 feature: routes (05-01) + offline-queue client primitives (05-02) + real seeded RBAC/identity (05-05) are all now in place ahead of 05-03/05-04's field-mobile screens

---
*Phase: 05-mobile-field-operations*
*Completed: 2026-11-18*

## Known Stubs

None found — scanned backend/scripts/seed.ts, backend/keycloak/epmp-realm.json, frontend/app/e2e/helpers/sign-in.ts, and backend/src/modules/incident-ops/field-reports.test.ts for TODO/FIXME/placeholder/not-implemented markers. The one `placeholders` match is a SQL parameter-list variable name in the pre-existing findOrInsert helper, not a stub.

## Self-Check: PASSED

- `.planning/phases/05-mobile-field-operations/05-05-SUMMARY.md` exists on disk
- Both task commits found in git log: `3a2bd0e` (Task 1), `7180a09` (Task 2)
- Backend `tsc --noEmit` → exit 0, clean
- `frontend/app` `tsc --noEmit` → exit 0, clean
- Backend `npm run build` → exit 0, clean
- `frontend/app` `npm run build` (vite build) → exit 0, clean, PWA manifest/sw.js emitted
- Full backend test suite: 15 files, 77 tests, all passing (74 prior + 3 new from this plan)
- `npm run seed` run twice against the live compose DB: first run inserted 4 new `field_reports` role_permissions rows + 1 new user; second run inserted 0 — confirmed idempotent, zero duplicates
- Keycloak realm file confirmed to contain `epmp-field-responders` group + `field-responder@epmp.local` user
- No blocking stubs found
