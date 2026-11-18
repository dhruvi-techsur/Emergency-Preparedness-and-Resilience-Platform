---
phase: 03-plans-tasks-resource-requests
plan: 05
subsystem: ui
tags: [react, react-query, plans, approval-workflow, rbac-ux, playwright]

# Dependency graph
requires:
  - phase: 03-plans-tasks-resource-requests
    provides: "03-03's plans module (Draft->Review->Approved CRUD/review/link-tasks API), 03-07's plans role_permissions seed grants"
  - phase: 01-platform-foundation-deployable-shell
    provides: "01-10's AppShell layout route, 01-05's design-system form/overlay primitives"
provides:
  - "Five routed/modal Plans & Playbooks screens (Plan Repository, Plan Detail/Reading View, Plan Editor, Link Tasks modal, Approval Workflow modal) composed entirely from window.EPMP"
  - "A 'Prepare' SideNav group, role_permissions-driven like the existing Admin/Activate/Monitor groups"
  - "Two new seeded Keycloak identities (planner@epmp.local, eocdirector@epmp.local) giving every future phase-3 plan real distinct author/reviewer accounts to sign in as"
affects: ["03-06", "03-08", "03-09"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Debounced save-on-blur autosave (~3s inactivity -> background PATCH) as the Phase-3 interpretation of a mockup 'autosave indicator', documented inline as distinct from literal continuous-typing autosave"
    - "UX-convenience-only action button + server-side-is-the-real-gate pattern reused a third time (ActivationModal/CommandRoleModal precedent) for ReviewPlanModal's self-approval handling"

key-files:
  created:
    - frontend/app/src/pages/plans/PlanRepository.tsx
    - frontend/app/src/pages/plans/PlanDetail.tsx
    - frontend/app/src/pages/plans/PlanDetail.css
    - frontend/app/src/pages/plans/PlanEditor.tsx
    - frontend/app/src/pages/plans/LinkTasksModal.tsx
    - frontend/app/src/pages/plans/ReviewPlanModal.tsx
    - frontend/app/e2e/plans.spec.ts
  modified:
    - frontend/app/src/main.tsx
    - frontend/app/src/app-shell/AppShell.tsx (no functional change required — routes added in main.tsx per 02-07's established convention)
    - backend/src/modules/auth-org/routes.ts
    - backend/scripts/seed.ts
    - backend/keycloak/epmp-realm.json
    - frontend/app/e2e/helpers/sign-in.ts

key-decisions:
  - "Plan 'Default owner role' Select in LinkTasksModal offers the 5 real persona role names (eoc_director, incident_commander, planning_logistics_chief, field_responder, secops_admin) that materialize.ts actually matches against roles.name — NOT the 6 ICS 'command role' titles (Incident Commander, Planning, Logistics...) assigned per-incident via CommandRoleModal, a similarly-named but distinct concept"
  - "Two new seeded Keycloak identities (planner@epmp.local -> planning_logistics_chief, eocdirector@epmp.local -> eoc_director) added as a Rule 3 (blocking) deviation — no prior phase seeded distinct author/reviewer accounts, and the plan's own cross-reviewer no-self-approval success criterion is otherwise untestable end-to-end"
  - "ReviewPlanModal shows CURRENT plan sections only, not a full diff against the last Approved content_snapshot — out of this plan's 2-3-task budget per the FRD's own 'side-by-side or stacked view' language, approximated by showing the clear proposed state"
  - "'View this version' renders a summary-only modal (reviewer/action/date) rather than full historical section text, since GET /api/v1/plans/{id}'s version_history has no content_snapshot field in TechArch's literal PlanDetail shape"

patterns-established:
  - "Plan Editor section rows track a server-assigned id separately from local-only unsaved rows, so 'Link tasks' can be correctly disabled until a section is actually persisted"

# Metrics
duration: 48min
completed: 2026-11-17
---

# Phase 3 Plan 05: Plans & Playbooks UI Summary

**Five routed/modal screens (Plan Repository, Plan Detail/Reading View, Plan Editor, Link Tasks modal, Approval Workflow modal) make 03-03's Draft->Review->Approved plans API observable to a real browser user for the first time, proven end-to-end by a cross-reviewer Playwright spec against two newly-seeded distinct Keycloak identities.**

## Performance

- **Duration:** 48 min
- **Started:** 2026-11-17T14:02:00Z (approx)
- **Completed:** 2026-11-17T14:50:00Z
- **Tasks:** 3
- **Files modified:** 13 (7 created, 6 modified)

## Accomplishments

- **Plan Repository (S3.1)** — `/plans`: Table with Name (linked)/Type/Status (exact FRD Badge tone mapping: Draft=neutral, Review=warning, Approved=success)/Version/Jurisdiction/Owner, loading/empty/error wired to Table's built-in props, "Import plan" rendered disabled-with-tooltip per F17's documented v2 deferral rather than silently omitted.
- **Plan Detail / Reading View (S3.2)** — `/plans/{id}`: sidebar jump links with per-section linked-task counts, content area hard-constrained to `--reading-max` (720px, verified via `getBoundingClientRect` in the Playwright spec), collapsible read-only version history where "View this version" opens a non-editable summary modal (the backend's literal `version_history` shape carries no `content_snapshot`, documented inline rather than extending the API unprompted).
- **Plan Editor (S3.3)** — `/plans/new` and `/plans/{id}/edit`: section-based editor with "+ Add section", Save as draft (POST on first save, PATCH thereafter) / Submit for review footer surfacing the exact `422 PLAN_EMPTY` Alert without navigating away, and a debounced (~3s) save-on-blur autosave indicator ("Saved HH:MM").
- **Link Tasks modal (S3.5)**: existing templates rendered read-only (03-03's schema scopes a template to its section at creation time — cross-section re-linking isn't a supported operation), "+ Define new template" creates one via the real `link-tasks` endpoint and triggers a parent refetch.
- **Approval Workflow modal (S3.4)**: shows the plan's current sections (not a full diff, documented as a budget-scoped simplification), Approve/Request changes actions, and critically renders the exact `403 SELF_APPROVAL_BLOCKED` message as an inline `Alert` that keeps the modal open — never a toast, never a generic error.
- **"Prepare" SideNav group**: `GET /api/v1/me/nav-config` now derives a `Prepare` group for any role holding ANY `plans` permission, identical role_permissions-driven pattern to the existing Admin/Activate/Monitor groups.
- **Two new seeded identities**: `planner@epmp.local` (planning_logistics_chief, author) and `eocdirector@epmp.local` (eoc_director, reviewer) — added to `backend/keycloak/epmp-realm.json` and `seed.ts`'s `group_to_role_mapping`, since no prior phase had seeded distinct accounts for these two FRD-named roles and the plan's own no-self-approval success criterion requires two genuinely different signed-in users.
- **`e2e/plans.spec.ts`** (4 test cases, all passing against the real compose stack): author creates/saves/submits a plan → the SAME author's role lacks review permission, so attempting to approve hits the real server-side RBAC gate (not the self-approval check specifically, since they never get that far) → a DIFFERENT reviewer (`eoc_director`) approves successfully with no self-approval error → the reading view's 720px constraint and version history are directly asserted.

## Task Commits

Each task was committed atomically:

1. **Task 1: Plan Repository (S3.1) + Plan Detail/Reading View (S3.2)** - `60f587f` (feat)
2. **Task 2: Plan Editor (S3.3) + Link Tasks Modal (S3.5)** - `453d8db` (feat)
3. **Task 3: Approval Workflow Modal (S3.4) + AppShell wiring + Playwright coverage** - `f98bc76` (feat)

**Plan metadata:** (this commit, following)

## Files Created/Modified

- `frontend/app/src/pages/plans/PlanRepository.tsx` - Plan list with filters, exact status Badge tone mapping
- `frontend/app/src/pages/plans/PlanDetail.tsx` - Reading view with 720px-constrained content, read-only version history, Review plan action wiring
- `frontend/app/src/pages/plans/PlanDetail.css` - The literal `--reading-max` (720px) constraint on `.ep-plan-detail__content`
- `frontend/app/src/pages/plans/PlanEditor.tsx` - Section-based create/edit form, autosave, PLAN_EMPTY error surfacing
- `frontend/app/src/pages/plans/LinkTasksModal.tsx` - New-template creation modal scoped to a plan section
- `frontend/app/src/pages/plans/ReviewPlanModal.tsx` - Approve/Request changes modal with inline self-approval error handling
- `frontend/app/src/main.tsx` - `/plans*` routes nested under AppShell
- `backend/src/modules/auth-org/routes.ts` - "Prepare" nav group derivation
- `backend/scripts/seed.ts` - Two new `group_to_role_mapping` entries for the new Keycloak identities
- `backend/keycloak/epmp-realm.json` - Two new groups + seeded users (planner@epmp.local, eocdirector@epmp.local)
- `frontend/app/e2e/helpers/sign-in.ts` - `signInAsPlanningChief` / `signInAsEocDirector` helpers
- `frontend/app/e2e/plans.spec.ts` - Full-stack Playwright proof

## Decisions Made

- LinkTasksModal's "Default owner role" options are the 5 real persona role names (what `materialize.ts` actually resolves against `roles.name`), not the 6 ICS command-role titles that look similar but are a per-incident assignment concept entirely — using the wrong set would silently produce `NO_USER_FOR_ROLE` skips at materialize time.
- Two new seeded Keycloak identities were added as a Rule 3 (blocking) deviation, not a Rule 4 architectural decision — this is additive fixture data following the exact pattern 02-05 already established for `commander@epmp.local`, not a new mechanism.
- ReviewPlanModal and "View this version" both deliberately simplify what the FRD's prose describes (a full diff; full historical content) within this plan's task budget, with each simplification documented inline rather than silently narrowing scope.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added two seeded Keycloak identities for the author/reviewer roles**
- **Found during:** Task 3 (Playwright spec authoring)
- **Issue:** The plan's cross-reviewer no-self-approval success criterion requires signing in as two genuinely different users holding `planning_logistics_chief` (author) and `eoc_director` (reviewer) respectively — neither role had a seeded Keycloak identity anywhere in the codebase (only `admin@epmp.local`/`secops_admin` and `commander@epmp.local`/`incident_commander` existed from Phases 1-2).
- **Fix:** Added two new Keycloak groups (`/epmp-planning-logistics-chiefs`, `/epmp-eoc-directors`) and two new users (`planner@epmp.local`, `eocdirector@epmp.local`) to `backend/keycloak/epmp-realm.json`, plus matching `group_to_role_mapping` entries in `seed.ts`, following 02-05's exact established pattern for `commander@epmp.local`.
- **Files modified:** `backend/keycloak/epmp-realm.json`, `backend/scripts/seed.ts`, `frontend/app/e2e/helpers/sign-in.ts`
- **Verification:** Both new users successfully sign in through the real Keycloak realm and are JIT-provisioned to the correct roles; the Playwright spec's cross-reviewer flow passes end-to-end against the real stack.
- **Committed in:** `f98bc76` (Task 3 commit)

**2. [Rule 1 - Bug] Scoped "Approved" Badge locators in the Playwright spec to avoid a strict-mode double-match**
- **Found during:** Task 3 (first Playwright run)
- **Issue:** Once a plan has at least one reviewed version, BOTH the PageHeader's status Badge AND the version-history sidebar's per-entry Badge can read "Approved" simultaneously — a bare `.ep-badge` + text locator matched 2 elements, failing Playwright's strict mode.
- **Fix:** Scoped the status-assertion locator to `.ep-page-header__status .ep-badge` specifically.
- **Files modified:** `frontend/app/e2e/plans.spec.ts`
- **Verification:** Re-ran the full spec; all 4 tests pass.
- **Committed in:** `f98bc76` (Task 3 commit, test file was not yet separately committed before the fix)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug). **Impact on plan:** Both were necessary for the plan's own stated success criteria to be provable at all — no scope creep beyond what the plan's own task descriptions required.

## Issues Encountered

- A stray backend `tsx watch` process from an earlier session was already bound to port 8080 when this plan's own `<verify>` block tried to start a second instance; killed the duplicate and the already-live one (which had also been using a now-replaced docker network), then cleanly restarted a single instance against the fresh compose stack. No code change required — a sandbox process-lifecycle artifact, not a plan defect.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 03-06 (Task/Resource-Request screens) can proceed: it shares `AppShell.tsx`/`main.tsx`/`auth-org/routes.ts` with this plan and its own plan document already anticipates appending to what this plan left behind (its own Sequencing note references exactly this file-overlap risk).
- 03-08 (the phase's terminal integration-proof plan) can sign in as `planner@epmp.local` and `eocdirector@epmp.local` directly — both identities are real, working, and already proven end-to-end by this plan's own Playwright spec.
- The Approval Workflow's self-approval UX-convenience-only pattern (button rendered whenever `status==='Review'`, server is the real gate) is now the THIRD instance of this exact pattern in the codebase (after `ActivationModal`/`CommandRoleModal`), reinforcing it as EPMP's established convention for threat-model-transferred authorization checks.

---
*Phase: 03-plans-tasks-resource-requests*
*Completed: 2026-11-17*

## Known Stubs

None found — `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all created/modified files returned only pre-existing, non-blocking patterns: AppShell.tsx's documented Phase-1 "coming soon" search/alerts no-ops (unrelated, pre-existing), seed.ts's SQL-placeholder variable name (`const placeholders = ...`, pre-existing helper unrelated to this plan), and LinkTasksModal.tsx's own doc comment describing its id-derived display fallback for a documented, non-blocking API-shape gap (the row still renders correctly, just without a title string the API doesn't provide).

## Self-Check: PASSED

- `frontend/app/src/pages/plans/PlanRepository.tsx` — FOUND
- `frontend/app/src/pages/plans/PlanDetail.tsx` — FOUND
- `frontend/app/src/pages/plans/PlanDetail.css` — FOUND
- `frontend/app/src/pages/plans/PlanEditor.tsx` — FOUND
- `frontend/app/src/pages/plans/LinkTasksModal.tsx` — FOUND
- `frontend/app/src/pages/plans/ReviewPlanModal.tsx` — FOUND
- `frontend/app/e2e/plans.spec.ts` — FOUND
- Commit `60f587f` (Task 1) — FOUND
- Commit `453d8db` (Task 2) — FOUND
- Commit `f98bc76` (Task 3) — FOUND
- Plan-level build (`cd frontend/app && npm run build` → vite build): exit 0, 403.89 kB JS bundle, no errors
- Plan-level build (`cd backend && npm run build` → tsc -p tsconfig.json): exit 0, no output
- Plan-level type-check (`cd frontend/app && npx tsc --noEmit`): exit 0, no output
- Full backend test suite (`npx vitest run`, with db+nats+opa running): 11/11 files passed, 55/55 tests passed, zero regressions
- Task 3's own Playwright spec (`npx playwright test e2e/plans.spec.ts --workers=1`): 4/4 tests passed against the real compose stack (db, nats, opa, keycloak, backend dev server, frontend dev server)
- No blocking or cosmetic stubs found in any created/modified file
