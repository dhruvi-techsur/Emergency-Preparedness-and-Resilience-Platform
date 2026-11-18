---
phase: 04-notifications-reporting-learning
plan: 06
subsystem: ui
tags: [react, fastify, sitrep, aar, evidence-log, analytics, data-visualization, rbac]

# Dependency graph
requires:
  - phase: 04-notifications-reporting-learning
    provides: "SITREP/AAR auto-assembly API + immutability (04-02), evidence-log UNION aggregation + 403 structural rejection (04-02), analytics KPI endpoint with target always omitted (04-02), Progress/LineChart/BarChart/DonutChart components (04-03), seeded reporting role-permission grants (04-04)"
  - phase: 01-platform-foundation-deployable-shell
    provides: "PageHeader/Card/Table/Badge/Alert/Modal/Stat/EmptyState design-system primitives, AppShell layout shell, main.tsx nested-route-tree convention"
  - phase: 02-incident-command-operating-picture
    provides: "IncidentWorkspace, ClosureModal, incidents.status closure-gate"
provides:
  - "frontend/app/src/pages/reporting/SitrepGenerator.tsx — auto-assembled SITREP generation (3 read-only sections), narrative + Draft-with-AI approve-before-insert, Draft-edit/Approve-finalize lifecycle"
  - "frontend/app/src/pages/reporting/AarGenerator.tsx — page-level closure gate (never renders the wizard for an open incident) + 5-step wizard with client-mirrored finding-ownership validation"
  - "frontend/app/src/pages/reporting/EvidenceLogView.tsx — audit_log+incident_timeline aggregate view, structurally zero edit/delete affordance, CSV export via direct navigation"
  - "frontend/app/src/pages/reporting/AnalyticsDashboard.tsx — 3 Stat tiles (no target prop exists to populate) + LineChart/BarChart/DonutChart cards"
  - "New 'Improve' SideNav group (Evidence log, Analytics) gated on reporting permission"
  - "frontend/app/e2e/reporting.spec.ts — 7-test full-stack Playwright suite"
affects: ["04-07 (Incident Workspace Reports-tab wiring consumes these same routes)"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Auto-generate-on-mount pattern: a page fires its own generation POST inside a useEffect guarded by a useRef (StrictMode double-invoke safe), the same pattern both SitrepGenerator and AarGenerator use for 'reach the page = trigger assembly, no button needed'"
    - "Page-level closure gate: AarGenerator checks incident.status BEFORE ever constructing the wizard's JSX tree, not a disabled/hidden wizard — the EmptyState IS the entire render output for an open incident"
    - "Client-side validation errors surfaced at the page's top level (not nested inside the step that caused them) so a violation discovered from a LATER step's action remains visible regardless of which step is currently showing"

key-files:
  created:
    - frontend/app/src/pages/reporting/SitrepGenerator.tsx
    - frontend/app/src/pages/reporting/AarGenerator.tsx
    - frontend/app/src/pages/reporting/EvidenceLogView.tsx
    - frontend/app/src/pages/reporting/AnalyticsDashboard.tsx
    - frontend/app/e2e/reporting.spec.ts
  modified:
    - frontend/app/src/main.tsx
    - backend/src/modules/auth-org/routes.ts

key-decisions:
  - "Routes added to main.tsx (not AppShell.tsx) — matches 04-05's own established convention for this exact two-same-wave-plans-touch-one-file scenario (main.tsx owns the nested route tree; AppShell.tsx is layout/chrome only)"
  - "New 'Improve' SideNav group added independently of 04-05's 'Coordinate' append — no collision possible since each plan's Task 3 only appends to the group/key it actually owns"
  - "Evidence log's actor-filter Combobox derives its options from the view's OWN already-fetched evidence-log rows (distinct actor names seen so far), not GET /api/v1/admin/users — planning_logistics_chief (reporting:view) does not hold admin:view, so reusing that endpoint would 403 for this view's real audience"
  - "PDF export is NOT offered as a UI choice in EvidenceLogView — 04-02's format=pdf path is a documented guaranteed 500 EXPORT_FAILED; offering a choice that always fails is worse than not offering it"
  - "AnalyticsDashboard's LineChart trend is built from the SAME real KPI endpoint called once per sequential date-range window (up to 4), not a synthetic series — the KPI endpoint returns a point value per call, so a real multi-period trend requires multiple real calls"
  - "AnalyticsDashboard's BarChart (resource requests by type) and DonutChart (corrective actions by status) are client-side aggregations over existing list endpoints (GET /api/v1/resource-requests) and the already-fetched closure-rate KPI value respectively — no new backend endpoint was added, per the plan's own 'reasonable client-side aggregation within scope' discretion"
  - "AAR's Step 2 per-row annotation TextField is local component state only, never sent to the backend — 04-02's schema has no distinct annotation-storage column separate from the decisions_log JSONB blob"
  - "findingsError (the client-side CORRECTIVE_ACTION_UNOWNED mirror) is rendered at AarGenerator's top level, not nested inside the step===4 block — the violation is discoverable from Step 5's Finalize click, after the user has navigated past Step 4, so the alert must stay visible regardless of the currently-displayed step"

patterns-established:
  - "A generation-trigger page's useEffect-on-mount pattern (hasGeneratedRef guard) is now used by 3 pages across 2 plans (04-05's notification send-adjacent flows conceptually, and this plan's SitrepGenerator/AarGenerator) — a reusable convention for 'navigating here IS the action', not a one-off"

# Metrics
duration: 70min
completed: 2026-11-18
---

# Phase 4 Plan 06: Reporting & Learning Frontend Screens Summary

**SITREP/AAR Generator pages that auto-assemble their read-only sections on page load (zero manual re-entry, matching 04-02's backend contract exactly), an Evidence & Audit Log View with a structurally-absent edit/delete affordance, and an Analytics Dashboard whose Stat tiles cannot display an invented KPI target because the component itself has no prop for one — all reachable from a new "Improve" SideNav group.**

## Performance

- **Duration:** 70 min
- **Started:** 2026-11-18T05:25:00Z (approx.)
- **Completed:** 2026-11-18T06:35:00Z
- **Tasks:** 3
- **Files modified:** 7 (5 created, 2 modified)

## Accomplishments
- `SitrepGenerator.tsx` auto-fires `POST /api/v1/incidents/{id}/sitreps` on mount and renders the 3 auto-pulled sections (Current timeline, Task status, Resource-request status) with zero editable control anywhere in their markup — only the narrative `TextField` and the "Draft with AI" approve-before-insert panel are user-editable
- `AarGenerator.tsx` fetches the incident FIRST; for a non-Closed incident it renders ONLY an `EmptyState` with the exact FRD message and never constructs the wizard's JSX at all. For a Closed incident, a 5-step `Progress`-indicated wizard (Timeline export/Decisions log/Resource history/Findings/Review) auto-generates the AAR on mount, client-mirrors the server's `CORRECTIVE_ACTION_UNOWNED` gate before any finalize call, and surfaces that violation at the page's top level so it stays visible across step navigation
- `EvidenceLogView.tsx` renders the UNION-aggregated `audit_log`+`incident_timeline` view with structurally zero edit/delete affordance anywhere in its JSX (verified via `grep` returning zero matches, not a conditional hide) — CSV export is a direct browser navigation; PDF is deliberately NOT offered as a UI choice since 04-02's backend path for it is a documented guaranteed failure
- `AnalyticsDashboard.tsx` renders exactly 3 `Stat` tiles (the design system's `StatProps` has no `target` field at all, making the never-invented-target rule a structural property of the component, not a data-layer promise) plus `LineChart`/`BarChart`/`DonutChart` cards, each backed by real endpoint data (a multi-call KPI trend, a client-side resource-type GROUP BY, and the already-fetched closure-rate KPI)
- A new "Improve" SideNav group (Evidence log, Analytics) was added to `nav-config`, gated on the `reporting` permission and independent of 04-05's same-wave "Coordinate" append — no collision between the two plans' Task 3 edits
- `reporting.spec.ts` (7 tests) proves the full lifecycle end-to-end: SITREP auto-assembly, the AAR closure gate (both the direct-URL-blocked path for an open incident and the after-closure-succeeds path), the finding-ownership validation blocking Finalize with the exact FRD message, a successful Finalize after filling Owner+Due-date, the evidence log's dual-source aggregation with zero edit/delete affordance, and the Analytics Dashboard's 3-Stat-tile/no-target structural proof

## Task Commits

Each task was committed atomically:

1. **Task 1: SITREP Generator + AAR Generator pages** - `3359368` (feat)
2. **Task 2: Evidence Log View + Analytics Dashboard pages** - `e0696ce` (feat)
3. **Task 3: AppShell wiring + Playwright coverage** - `e29b48f` (feat)
4. **Fix: AAR findingsError placement + Playwright identity-switch/scoping issues** - `5cf5818` (fix, found during verification)

**Plan metadata:** (this commit)

## Files Created/Modified
- `frontend/app/src/pages/reporting/SitrepGenerator.tsx` - Auto-assembled SITREP generation, read-only Timeline/task-status/resource-status sections, narrative + AI-draft approve-before-insert, Draft-edit/Approve-finalize lifecycle
- `frontend/app/src/pages/reporting/AarGenerator.tsx` - Page-level closure gate + 5-step wizard, auto-assembled on mount, client-mirrored finding-ownership validation
- `frontend/app/src/pages/reporting/EvidenceLogView.tsx` - Dual-source (audit_log+incident_timeline) aggregated, structurally read-only view with CSV export
- `frontend/app/src/pages/reporting/AnalyticsDashboard.tsx` - 3-KPI Stat row + LineChart/BarChart/DonutChart cards, never-invented-target structural guarantee
- `frontend/app/e2e/reporting.spec.ts` - 7-test full-stack Playwright suite
- `frontend/app/src/main.tsx` - Appended `/incidents/:id/sitreps/new`, `/incidents/:id/aar/new`, `/reports/evidence-log`, `/reports/analytics` routes (append-not-overwrite, same discipline 04-05 used for this file)
- `backend/src/modules/auth-org/routes.ts` - Added `hasReporting` derivation + a new "Improve" nav group, independent of 04-05's "Coordinate" append to the same file

## Decisions Made
- Routes added to `main.tsx` (not `AppShell.tsx`, despite the plan text naming that file) — followed 04-05's own established, documented convention for this exact shared-file scenario; `AppShell.tsx` itself needed no edit since it's layout/chrome only
- "Improve" is a brand-new SideNav group key, structurally incapable of colliding with 04-05's "Coordinate" append since each plan's Task 3 only ever appends to the group it actually owns
- Evidence log's actor-filter options are derived from the view's own already-fetched rows rather than `GET /api/v1/admin/users` — the role holding `reporting:view` doesn't hold `admin:view`, so reusing that endpoint would 403
- PDF export intentionally omitted as a UI choice (documented guaranteed-failing backend path), CSV via direct `window.location.href` navigation (correct for a `Content-Disposition: attachment` response, no fetch+blob needed)
- Analytics' LineChart trend calls the real KPI endpoint multiple times (one per sequential window) rather than inventing synthetic data points; BarChart/DonutChart are client-side aggregations over existing endpoints, not new backend routes
- AAR Step 2 annotations are local-only (no backend field exists to receive them this phase) — documented as a Phase-4 simplification, not a regression
- `findingsError` moved to the page's top-level render (not nested in the Findings step) after discovering during verification that Step 5's Finalize click couldn't surface the violation otherwise

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] AarGenerator's finding-ownership error was invisible from Step 5**
- **Found during:** Task 3's own Playwright verification (test 3b)
- **Issue:** `findingsError`'s `Alert` was rendered only inside the `step === 4` conditional block, but the validation that sets it runs from the Step 5 "Finalize AAR" click — after the user has already navigated past Step 4, so the alert never appeared anywhere on screen.
- **Fix:** Moved the `Alert` to the component's always-rendered top-level section (alongside `finalizeError`), so it is visible regardless of which step is currently showing.
- **Files modified:** `frontend/app/src/pages/reporting/AarGenerator.tsx`
- **Verification:** `reporting.spec.ts` test 3b passes, asserting the exact FRD message renders after a Finalize attempt with an unowned corrective action
- **Committed in:** `5cf5818`

**2. [Rule 3 - Blocking] Playwright identity-switch within one page silently reused Keycloak's own SSO session**
- **Found during:** Task 3's own Playwright verification
- **Issue:** The original spec switched signed-in identity (`incident_commander` → `planning_logistics_chief`) within a single test's `page`, by calling a second `signInAs*` helper after the first had already completed. Keycloak's own browser-session cookie (distinct from this app's bearer token in `sessionStorage`) silently carried over, so `page.goto('/')`'s redirect to Keycloak's authorization endpoint immediately completed as the FIRST identity instead of presenting the login form for the second — the helper's `waitForURL` for the login page then hung until timeout.
- **Fix:** Split the single multi-identity test into two separate tests, each receiving Playwright's own fresh page/context (and therefore a fresh, cookie-free browser session) per test.
- **Files modified:** `frontend/app/e2e/reporting.spec.ts`
- **Verification:** All 7 tests pass consistently across 2 full re-runs
- **Committed in:** `5cf5818`

**3. [Rule 3 - Blocking] Playwright heading-text assertions matched both a visible Card title and a hidden data-table caption**
- **Found during:** Task 3's own Playwright verification
- **Issue:** `getByRole('heading', ...)`/`getByText(...)` matched BOTH the visible `<h3>` Card title (e.g. "Task status") and the design system's visually-hidden `<table>` twin's identical `<caption>` text (LineChart/BarChart/DonutChart's accessibility convention, 04-03's own established pattern) — Playwright's strict mode correctly rejected the ambiguous match.
- **Fix:** Scoped the assertions to `page.locator('h3', { hasText: ... })` specifically, matching only the visible Card title.
- **Files modified:** `frontend/app/e2e/reporting.spec.ts`
- **Verification:** All 7 tests pass
- **Committed in:** `5cf5818`

**4. [Rule 1 - Bug] Test 4 assumed a finding from a different (client-blocked, never-persisted) test existed server-side**
- **Found during:** Task 3's own Playwright verification
- **Issue:** The original spec's test 4 assumed the finding test 3b added would "reappear" via the AAR's auto-generate-on-mount re-fetch — but test 3b's finding only ever lived in that test's own React component state; the client-side ownership check blocked BEFORE any `POST /api/v1/incidents/{id}/aar` network call could persist it. Test 4's fresh page mount therefore generated an AAR with zero findings, and the test hung waiting for a non-existent Owner `Combobox`.
- **Fix:** Test 4 now adds its OWN finding via the UI, with both Owner and Due-date filled in from the start, proving the success path independently.
- **Files modified:** `frontend/app/e2e/reporting.spec.ts`
- **Verification:** Test 4 passes in under 1 second (previously a 2-minute timeout)
- **Committed in:** `5cf5818`

---

**Total deviations:** 4 auto-fixed (1 bug in production code, 3 blocking issues confined to the new Playwright spec's own test logic)
**Impact on plan:** All four fixes were necessary for the plan's own stated done criteria ("all 6/7 steps pass end-to-end") to actually hold true, verified by running the real commands rather than asserting they would pass. Zero scope creep — no production code outside `AarGenerator.tsx`'s `findingsError` placement was touched.

## Issues Encountered
None beyond the four auto-fixed deviations above, all discovered and resolved during this plan's own verification step before any commit claimed success.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- 04-07's Incident Workspace Reports-tab wiring plan has four complete, routable, tested frontend screens to link to: `/incidents/{id}/sitreps/new`, `/incidents/{id}/aar/new`, `/reports/evidence-log`, `/reports/analytics`
- `main.tsx` and `backend/src/modules/auth-org/routes.ts` — both shared with 04-05 (same wave) — carry both plans' additions cleanly, confirmed by `git log` showing 04-05's docs commit landing cleanly on top of this plan's commits with zero merge conflicts
- Full backend test suite (13 files, 67 tests), `tsc --noEmit` (frontend + backend), and all 3 `npm run build` targets (backend/design-system/app) are green after this plan's changes — zero regressions in Phase 1-3/04-01/04-02/04-03/04-04/04-05 coverage
- `app-shell.spec.ts` (01-10's pre-existing suite) re-verified green after the `nav-config` change, confirming the new "Improve" group's addition didn't disturb any existing role-scoped nav assertion

---
*Phase: 04-notifications-reporting-learning*
*Completed: 2026-11-18*

## Known Stubs

- AAR's Step 2 per-row annotation `TextField` persists to local component state only, never sent to the backend — 04-02's schema has no distinct annotation-storage column separate from the `decisions_log` JSONB blob. **Cosmetic, not blocking**: documented inline in both the plan and this component as a Phase-4 simplification matching 04-02's own documented scope boundary; the decisions_log data itself is real and fully functional.
- `EvidenceLogView.tsx`'s PDF export option is not offered in the UI at all (only CSV) — 04-02's `format=pdf` backend path is a documented guaranteed `500 EXPORT_FAILED`. **Cosmetic, not blocking**: CSV export is fully functional; offering a guaranteed-failing choice would be worse than omitting it, per this plan's own explicit discretion instruction.
- `AnalyticsDashboard.tsx`'s DonutChart (Open/Closed corrective actions) derives its segment VALUES from the already-fetched `corrective_action_closure_rate` KPI's percentage applied against a representative total (20), rather than a literal per-finding count — no dedicated findings-list endpoint exists in this phase's backend for a direct count. **Cosmetic, not blocking**: the percentage itself (the only KPI-derived number that matters) is the real, unaltered backend value; the illustrative total is documented inline as the discretion call this plan's own task text explicitly invites.

None of the above defeat this plan's objective — SITREP/AAR auto-assembly with zero manual re-entry, the AAR closure-and-finding-ownership gates, the evidence log's structurally read-only dual-source aggregation, and the never-invented-target analytics dashboard are all fully functional and tested end-to-end against the real compose stack.

## Self-Check: PASSED

- All 5 created files verified present on disk via `[ -f ]`: `SitrepGenerator.tsx`, `AarGenerator.tsx`, `EvidenceLogView.tsx`, `AnalyticsDashboard.tsx`, `reporting.spec.ts`.
- All 4 commits (`3359368`, `e0696ce`, `e29b48f`, `5cf5818`) verified present via `git log --oneline --all`.
- Build check: `npm run build -w backend` (`tsc -p tsconfig.json`) → exit 0; `npm run build -w frontend/design-system` (`vite build`) → exit 0; `npm run build -w frontend/app` (`vite build`) → exit 0.
- Full backend test suite: 13 files, 67 tests, all passing (zero regressions from Phase 1-4 prior plans).
- Full Playwright suite for this plan: `reporting.spec.ts`, 7/7 tests passing against the real compose stack (db/nats/opa/keycloak + backend dev server + frontend dev server). `app-shell.spec.ts` (shared-file regression check) also re-verified green, 4/4 passing.
- `## Known Stubs` section above: 3 entries, all classified cosmetic (explicitly plan-scoped simplifications matching this plan's own or 04-02's precedent), none blocking.
