---
phase: 09-alerting-identity-integrations
plan: 04
subsystem: ui
tags: [react-query, combobox, provenance, table, badge, playwright, hris-roster]

# Dependency graph
requires:
  - phase: 09-alerting-identity-integrations
    provides: "Plan 09-02's GET /api/v1/integrations/hris/personnel (hris-roster-adapter.ts) — deterministic 2-record HR/IAM roster fixture (one matched to commander@epmp.local, one deliberately unmatched)"
provides:
  - "New read-only Personnel Roster admin screen (frontend/app/src/pages/admin/PersonnelRoster.tsx), reachable from the Admin Console SideNav"
  - "Command Role Assignment's personnel Combobox enriched with roster qualification hints"
  - "Resource Request's Assign modal gains a roster-sourced 'Or pick from roster' Combobox quick-pick, additive to the existing free-text field"
  - "record_authority_registry's personnel_roster row now carries notes='Reference data only' (closes a Phase-1-era gap)"
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Roster-as-reference-data: a second useQuery against the same GET /api/v1/integrations/hris/personnel endpoint, merged client-side by matched_user_id, to enrich an existing FK-constrained selector's hint text without changing its options source"
    - "Combobox-as-quick-pick-above-TextField: when Combobox's committed-value-only contract can't express 'pick from list OR type anything', add Combobox as an ADDITIVE quick-pick that populates the same state the TextField already binds to, rather than replacing TextField"

key-files:
  created:
    - frontend/app/src/pages/admin/PersonnelRoster.tsx
    - frontend/app/src/pages/admin/PersonnelRoster.css
    - frontend/app/e2e/personnel-roster-reference-data.spec.ts
    - .planning/phases/09-alerting-identity-integrations/deferred-items.md
  modified:
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts
    - backend/scripts/seed.ts
    - frontend/app/src/pages/incidents/CommandRoleModal.tsx
    - frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx

key-decisions:
  - "ADMIN_NAV_ITEMS's new 'personnel-roster' entry uses icon='file' — the only genuinely valid, unclaimed ICON_NAMES value available; the array's OTHER entries ('file-text'/'activity'/'gauge'/'plug'/'database'/'link'/'key') are themselves not members of Icon.tsx's actual ICON_NAMES set, a pre-existing mismatch left untouched as out of this plan's scope"
  - "ResourceRequestDetail's roster Combobox is ADDITIVE above the existing TextField, not a replacement — Combobox.tsx's real contract is committed-value-from-list only (typing alone reverts on blur via closeDropdown(true)), so it cannot alone satisfy 'pick from list OR type free text'; selecting a roster option populates the same assignedToInput state the TextField already binds"

patterns-established:
  - "Personnel Roster screen mirrors IntegrationHealth.tsx/RecordAuthority.tsx's exact PageHeader + Card(padded=false) + Table composition, with zero onClick/button/form anywhere — the literal structural mechanism for 'no direct in-EPMP edit', matching the backend's own structural no-write-route guarantee"

# Metrics
duration: 18min
completed: 2026-11-20
---

# Phase 9 Plan 04: Personnel Roster Frontend + Reference-Data Wiring Summary

**Read-only Personnel Roster admin screen (Table+Provenance+Badge, zero edit affordance) plus roster-sourced qualification hints wired into Command Role Assignment's Combobox and a new roster quick-pick Combobox in Resource Request's Assign modal — all against the real Plan 09-02 backend, proven end-to-end via a new 4-test Playwright spec.**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-11-20T19:47:00Z (approx, continuing from 09-02's completion)
- **Completed:** 2026-11-20T19:57:57Z
- **Tasks:** 2
- **Files modified:** 8 (3 created, 5 modified) + 1 deferred-items log

## Accomplishments

- Shipped `PersonnelRoster.tsx` — a new admin screen sourced exclusively from `GET /api/v1/integrations/hris/personnel`, rendering Name/Role/Qualifications/Contact/Match(Badge)/Source(Provenance) columns, with a literal "No matched user" Badge on unmatched rows and zero onClick/button/form anywhere on the page
- Wired the screen into `main.tsx` (new route) and `ADMIN_NAV_ITEMS` (new SideNav entry), closing the no-orphan-pages rule
- Closed a genuine Phase-1-era gap: `record_authority_registry`'s `personnel_roster` row has carried `notes=NULL` since Phase 1 (the row itself was seeded then, but nothing ever set `notes`) — a new standalone `ON CONFLICT DO UPDATE` statement in `seed.ts` (NOT a `findOrInsert` change, which cannot update an already-existing row) now sets it to `'Reference data only'`, proven idempotent across two consecutive seed runs via a direct post-seed `SELECT` against the live database
- Enriched Command Role Assignment's personnel Combobox with a qualification hint sourced from the roster, merged client-side by `matched_user_id`, without touching the underlying FK-constrained options list
- Added a roster-sourced "Or pick from roster" Combobox to Resource Request's Assign modal, additive above the existing free-text field (documented reasoning: Combobox's real contract has no "accept arbitrary typed text" mode)
- New `personnel-roster-reference-data.spec.ts` (4/4 passing) proves SideNav reachability, matched/unmatched Provenance rendering, a zero-edit-control structural guarantee scoped to the Table container, Command Role Assignment's live qualification hint, and Resource Request's roster quick-pick populating the Assigned-to field

## Task Commits

1. **Task 1: PersonnelRoster.tsx admin screen + SideNav wiring** - `b037668` (feat)
2. **Task 2: Wire roster into Command Role Assignment + Resource Request, Playwright coverage** - `333e97c` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/pages/admin/PersonnelRoster.tsx` - New read-only roster screen (Table+Provenance+Badge)
- `frontend/app/src/pages/admin/PersonnelRoster.css` - Minimal caption-spacing style
- `frontend/app/src/main.tsx` - New `admin/personnel-roster` route
- `backend/src/modules/auth-org/routes.ts` - New `ADMIN_NAV_ITEMS` entry
- `backend/scripts/seed.ts` - Standalone `ON CONFLICT DO UPDATE` for `record_authority_registry.notes`
- `frontend/app/src/pages/incidents/CommandRoleModal.tsx` - Roster-qualification hint enrichment via a second useQuery
- `frontend/app/src/pages/tasks-resources/ResourceRequestDetail.tsx` - New "Or pick from roster" Combobox quick-pick
- `frontend/app/e2e/personnel-roster-reference-data.spec.ts` - New 4-test Playwright coverage
- `.planning/phases/09-alerting-identity-integrations/deferred-items.md` - Logged pre-existing unrelated test flake

## Decisions Made

- `icon='file'` chosen for the new nav entry since it's the only ICON_NAMES-valid, unclaimed icon value available — documented inline in `routes.ts` that several of the array's OTHER pre-existing entries use icon strings that aren't actually members of `Icon.tsx`'s `ICON_NAMES` set at all (a pre-existing mismatch, left untouched as out of scope)
- Resource Request's roster Combobox is additive above the existing TextField (not a replacement), per `Combobox.tsx`'s real committed-value-only contract — documented in-line in the component and in this plan's own context notes

## Deviations from Plan

None - plan executed exactly as written. The seed.ts fix, SideNav icon selection, and Combobox additive-pattern decision were all explicitly pre-specified by the plan itself (not discoveries requiring a deviation-rule judgment call).

## Issues Encountered

- `npm run seed` requires `DATABASE_URL` exported into the shell environment (not auto-loaded via dotenv by `seed.ts`/`db/client.ts` — only `.pivota/start-dev.sh`'s own `.env` sourcing provides it for the long-running dev process). Worked around by exporting it inline for the one-off verification command; no production code change needed.
- `tasks-resources.spec.ts` test 5 ("Overdue visibility... via polling alone") failed on a pre-existing, unrelated test/config timing mismatch (`playwright.config.ts`'s 60s per-test timeout is shorter than the test's own internal 90s `toPass` retry window) while running the full regression pass. Confirmed unrelated to this plan (zero Task-sweep code touched) by re-running the two Resource-Request-specific tests in that same file (6 and 7) in isolation — both pass clean. Logged to `deferred-items.md`, not fixed (out of this plan's scope per the deviation rules' scope boundary).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 9 (Alerting & Identity Integrations) is now fully complete: all 4 plans shipped (09-01 F14 backend, 09-02 F16-roster backend, 09-03 F14 frontend, 09-04 F16-roster frontend).
- ROADMAP success criteria 4 and 5 (roster list with Provenance/HR-authoritative declaration; roster populates F1/F4 as reference options, unmatched shows no matched user, no direct in-EPMP edit) are fully satisfied end-to-end through the real UI.
- No blockers for the next phase.

## Known Stubs

None found - scanned all created/modified files for TODO/FIXME/placeholder/not-implemented markers; the only `placeholder` hits were legitimate SQL placeholder variable names (`seed.ts`) and input `placeholder` attribute text (`CommandRoleModal.tsx`/`ResourceRequestDetail.tsx`), not stub markers.

## Self-Check: PASSED

- All 5 created files verified present on disk via `[ -f ]`.
- Both task commits (`b037668`, `333e97c`) verified present via `git log --oneline --all --grep="09-04"`.
- Build check: `frontend/app && npx tsc --noEmit` → exit 0; `frontend/app && npm run build` → exit 0; `backend && npx tsc --noEmit` → exit 0; `backend && npm run build` → exit 0.
- Full backend test suite: 24 files / 171 tests, all passing (zero regression).
- New Playwright spec (`personnel-roster-reference-data.spec.ts`): 4/4 passing.
- Regression Playwright specs: `incident-workspace.spec.ts` 6/6 passing; `tasks-resources.spec.ts` tests 6/7 (Resource-Request-specific) passing in isolation — test 5's pre-existing, unrelated timing flake documented in deferred-items.md.

---
*Phase: 09-alerting-identity-integrations*
*Completed: 2026-11-20*
