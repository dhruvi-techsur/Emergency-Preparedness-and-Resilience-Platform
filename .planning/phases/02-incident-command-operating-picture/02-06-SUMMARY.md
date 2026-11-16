---
phase: 02-incident-command-operating-picture
plan: 06
subsystem: incident-ops
tags: [react, react-router, tanstack-query, fastify, playwright, design-system]

# Dependency graph
requires:
  - phase: 02-incident-command-operating-picture
    provides: "GET /api/v1/incidents/{id} and /timeline (02-01), POST /command-roles and /activation (02-02), /incidents and /incidents/new routes in main.tsx (02-05)"
provides:
  - "frontend/app/src/pages/incidents/IncidentWorkspace.tsx — routed /incidents/:id, PageHeader+Tabs+pinned command-role Card"
  - "frontend/app/src/pages/incidents/CommandRoleModal.tsx — S1.4 assignment/reassignment modal"
  - "frontend/app/src/pages/incidents/ActivationModal.tsx — S1.5 danger-tier escalation modal"
  - "GET /api/v1/incidents/personnel — new incidents:view-gated personnel lookup (backend/src/modules/incident-ops/incidents.ts)"
affects: ["02-07 (consumes 02-03's operating-picture endpoints directly, no dependency on this plan's screens)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Modal-reached-only-from-parent-screen invariant: CommandRoleModal/ActivationModal are imported and rendered directly inside IncidentWorkspace, never independently routed, matching the UX mockup's documented Navigation Map rule"
    - "Server-enforced gate, client-surfaced message: the 422 NO_COMMANDER_ASSIGNED body is rendered verbatim inline and onChanged() is deliberately skipped on that path, so the activation display visibly doesn't change without a second source of truth check on the client"

key-files:
  created:
    - frontend/app/src/pages/incidents/IncidentWorkspace.tsx
    - frontend/app/src/pages/incidents/IncidentWorkspace.css
    - frontend/app/src/pages/incidents/CommandRoleModal.tsx
    - frontend/app/src/pages/incidents/ActivationModal.tsx
    - frontend/app/e2e/incident-workspace.spec.ts
  modified:
    - backend/src/modules/incident-ops/incidents.ts
    - frontend/app/src/main.tsx

key-decisions:
  - "Added GET /api/v1/incidents/personnel (incidents:view gated) instead of reusing GET /api/v1/admin/users for the Command Role Modal's Combobox — incident_commander/eoc_director (the only roles holding incidents:edit) deliberately hold no admin:view permission per 02-01's seed, so reusing the admin endpoint would have required widening admin access to a role with no business there"
  - "Route /incidents/:id added to frontend/app/src/main.tsx (not AppShell.tsx) — 02-05 already established that main.tsx, not AppShell.tsx, is where this app's nested route tree lives (AppShell.tsx is the layout/chrome component); this plan's frontmatter named AppShell.tsx but the actual wiring point, consistent with 02-05's own prior edit, is main.tsx's <Route> tree"
  - "Map-thumbnail panel renders a 'View on operating picture' Button linking to /operating-picture?incident={id} rather than embedding a second MapCanvas instance — documented Phase-2 simplification explicitly called out in the plan, kept within this plan's 3-task budget"

patterns-established:
  - "IncidentWorkspace establishes the tabpanel-pairs-with-Tabs pattern other Phase-3/4 incident-scoped screens (Tasks/Resources/Reports real implementations) will extend when their backends land"

# Metrics
duration: 25min
completed: 2026-11-16
---

# Phase 2 Plan 06: Incident Workspace, Command Role & Activation Modals Summary

**Incident Workspace (S1.3) with fixed Timeline/Tasks/Resources/Reports tab order and a pinned 6-role command-role Card, plus the Command Role Assignment (S1.4) and danger-tier Activation Level Change (S1.5) Modals that gate the workspace's two most consequential actions — both modals surface 02-02's server-side commander/confirmation gates inline rather than letting a generic error mask them.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-16T13:32:00Z (approx)
- **Completed:** 2026-11-16T13:56:46Z
- **Tasks:** 3
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments

- `IncidentWorkspace.tsx` renders the exact S1.3 structure: `PageHeader` with severity `Badge`, jurisdiction+opened subtitle, and SITREP/New-task placeholder actions; the 4 tabs (Timeline, Tasks, Resources, Reports) render unconditionally in that fixed order on every incident; the right-column `Card` lists all 6 FRD command-role titles (Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information) with `Avatar`+name or "Unassigned" captions and a per-row Assign/Reassign action
- The Timeline tab is live, not a placeholder: it fetches `GET /api/v1/incidents/{id}/timeline` and renders through the `Timeline` component with 24-hour monospace times and `{actor} via {source}` meta — Tasks/Resources/Reports render honest "ships in a later phase" `EmptyState`s rather than fake content
- `CommandRoleModal.tsx` (S1.4): shows "Currently assigned: {name}" when reassigning, a `Combobox` search over active personnel, and an outcome-named "Assign role" primary button; success closes the modal and triggers a parent refetch (incident + timeline) with no page reload
- `ActivationModal.tsx` (S1.5): `danger` tier exclusively on escalation, exact FRD title pattern ("Escalate {name} to {level} activation?"), per-target-level consequence copy, and outcome-named footer buttons ("Escalate to Full" / "Keep at Monitoring") — never "Yes"/"OK". A 422 `NO_COMMANDER_ASSIGNED` renders the backend's exact message inline and deliberately skips the parent refetch, so the activation-level display visibly stays unchanged
- Added `GET /api/v1/incidents/personnel` (gated by `incidents:view`) since the roles that can actually assign command roles hold no `admin:view` permission — see Deviations
- `/incidents/:id` wired into `frontend/app/src/main.tsx`'s route tree, appended after 02-05's `/incidents`/`/incidents/new` entries
- All 4 Playwright assertions in `incident-workspace.spec.ts` pass against the live compose stack: fixed structure + all-Unassigned on a fresh incident, role assignment without reload, inline commander-gate 422 with unchanged activation display, and a full escalation showing the outcome-named button plus PageHeader/Timeline updates
- Full backend suite (33 tests, 7 files), design-system suite (46 tests, 5 files), and all 3 pre-existing Playwright suites (`incident-list-create.spec.ts`, `app-shell.spec.ts`, `admin-users-roles.spec.ts` — 13 assertions total) re-run clean after this plan's changes, zero regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Incident Workspace shell (PageHeader, Tabs, pinned command-role panel)** - `403fd52` (feat)
2. **Task 2: Command Role Assignment Modal (S1.4)** - `ac7d696` (feat)
3. **Task 3: Activation Level Change Modal (S1.5) + AppShell wiring + Playwright** - `2d903c8` (feat)

**Plan metadata:** (this commit)

## Files Created/Modified

- `frontend/app/src/pages/incidents/IncidentWorkspace.tsx` - S1.3 workspace: PageHeader, 4 fixed tabs, pinned command-role Card, activation control, map-thumbnail link
- `frontend/app/src/pages/incidents/IncidentWorkspace.css` - left-two-thirds/right-third grid layout, role-row chrome
- `frontend/app/src/pages/incidents/CommandRoleModal.tsx` - S1.4 assignment/reassignment modal
- `frontend/app/src/pages/incidents/ActivationModal.tsx` - S1.5 danger-tier activation-change modal
- `frontend/app/e2e/incident-workspace.spec.ts` - 4-assertion Playwright suite
- `backend/src/modules/incident-ops/incidents.ts` - added `GET /api/v1/incidents/personnel`
- `frontend/app/src/main.tsx` - added `/incidents/:id` route

## Decisions Made

- `GET /api/v1/incidents/personnel` added rather than reusing `/api/v1/admin/users`, since `incident_commander`/`eoc_director` hold no `admin:view` permission (see Deviations)
- Route wiring landed in `main.tsx` (where 02-05 actually put the route tree), not `AppShell.tsx` (the layout/chrome component the plan's frontmatter named) — consistent with the existing codebase structure, not a deviation from intent
- Map-thumbnail panel is a link-out `Button`, not a second embedded `MapCanvas`, per the plan's own documented Phase-2 simplification

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `GET /api/v1/admin/users` is unreachable by any role that can assign command roles**

- **Found during:** Task 2 (building `CommandRoleModal.tsx`'s personnel `Combobox`)
- **Issue:** The plan's Task 2 text specified sourcing personnel from `GET /api/v1/admin/users` (01-07's existing endpoint). That route is gated by `requirePermission('admin', 'view')`. Checking 02-01's seed showed `incident_commander` and `eoc_director` — the only two roles holding `incidents:edit` and therefore the only roles that can ever open this modal — hold **no** `admin` permission at all (02-01's seed deliberately scopes `admin` access to `secops_admin` only). Following the plan literally would have made every assignment attempt 403 on the personnel lookup, a real functional break, not a cosmetic one.
- **Fix:** Added `GET /api/v1/incidents/personnel` to `backend/src/modules/incident-ops/incidents.ts`, gated by the same `incidents:view` permission every other read route in that module uses, returning `{id, name, email}` for all `Active` users. `CommandRoleModal.tsx` calls this new endpoint instead of `/api/v1/admin/users`. This introduces no new trust boundary beyond what `incidents:view` already grants, and keeps the admin/incidents permission boundaries exactly as 02-01 seeded them rather than widening `admin:view` to a role with no business in user management.
- **Files modified:** `backend/src/modules/incident-ops/incidents.ts`, `frontend/app/src/pages/incidents/CommandRoleModal.tsx`
- **Verification:** `incident-workspace.spec.ts` test 2 signs in as `commander@epmp.local` (`incident_commander` role) and successfully opens the modal, searches personnel, and assigns a role — this path would 403 before the fix.
- **Committed in:** `ac7d696` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** The fix was required for the plan's own specified Command Role Modal to be usable by the only roles that can reach it. No scope creep — the new endpoint reuses the exact `requirePermission` pattern every other read route in `incidents.ts` already follows.

## Issues Encountered

- One test-authoring mistake in this plan's own Playwright spec (not a deviation from the plan's built screens): the initial `incident-workspace.spec.ts` asserted the Activation Modal's title/button text for "Full" before selecting "Full" in the `Select` (the modal defaults to the next-higher level, "Partial"). Reordered the assertion to select the target level first, then assert the title — fixed before the final `<verify>` run, no production code change needed.

## User Setup Required

None - no external service configuration required. The new `GET /api/v1/incidents/personnel` route needs no migration, seed change, or env var; it reads the existing `users` table.

## Next Phase Readiness

- Success criteria 2 and 3 are now fully observable through a real browser session: every command-role assignment and activation-level decision is Timeline-recorded and visible, and the UI surfaces — but cannot bypass — the server's commander-required/confirmation-required rules.
- `IncidentWorkspace.tsx` is live, routed, and reachable both by direct URL and by 02-05's Incident List row-click / Create Incident post-create redirect.
- Tasks/Resources/Reports tabs are honest placeholders (not broken/missing) until F4/F7/F9 ship their own backends in later phases — no new work is silently deferred without a visible note in the UI.
- 02-07 (operating-picture screen) has no functional dependency on this plan's screens and can proceed independently, consuming 02-03's endpoints directly.

---
*Phase: 02-incident-command-operating-picture*
*Completed: 2026-11-16*

## Known Stubs

None blocking. Scanned all created/modified files for TODO/FIXME/placeholder/not-implemented/coming-soon patterns:
- `IncidentWorkspace.tsx`'s "Generate SITREP"/"New task" PageHeader actions and the Tasks/Resources/Reports tab `EmptyState`s are documented, plan-specified Phase-2 placeholders (F4/F7/F9 ship their real backends in later phases) — not an oversight, and each one renders honest "ships in a later phase" copy rather than fake functioning content.
- The map-thumbnail panel's link-out-rather-than-embedded-MapCanvas treatment is a documented Phase-2 simplification explicitly called out in the plan text.
- `CommandRoleModal.tsx`'s `placeholder="Type a name"` is an ordinary HTML input-hint attribute, not a stub marker.

No blocking stub defeats this plan's objective: the Timeline tab, command-role assignment, and activation-level change are all fully functional against the real backend.

## Self-Check: PASSED

- All 5 created files confirmed present on disk (`[ -f ]` checks)
- All 3 task commits (`403fd52`, `ac7d696`, `2d903c8`) confirmed in `git log`
- Build check: `npm run build` (backend `tsc`) → exit 0; `cd frontend/design-system && npm run build` (Vite) → exit 0; `cd frontend/app && npm run build` (Vite) → exit 0
- Full backend test suite (7 files, 33 tests) → all passed, zero regressions
- Full design-system test suite (5 files, 46 tests) → all passed
- New 4-assertion `incident-workspace.spec.ts` Playwright suite → all passed against the live compose stack
- Pre-existing `incident-list-create.spec.ts` (4), `app-shell.spec.ts` (4), `admin-users-roles.spec.ts` (5) Playwright suites → all 13 assertions passed, confirming zero regressions from this plan's `incidents.ts`/`main.tsx` edits
- No blocking stubs found
