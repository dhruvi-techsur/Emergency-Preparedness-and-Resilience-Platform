---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: completed
stopped_at: Completed 03-05-PLAN.md
last_updated: "2026-11-17T14:50:00.000Z"
last_activity: "2026-11-17 — Plan 03-05 complete (five Plans & Playbooks screens — Plan Repository, Plan Detail/Reading View, Plan Editor, Link Tasks modal, Approval Workflow modal — composed entirely from window.EPMP, making 03-03's Draft->Review->Approved plans API observable to a real browser user for the first time. Plan Repository's status Badge uses the exact FRD tone mapping (Draft=neutral, Review=warning, Approved=success); Plan Detail's content area is hard-constrained to --reading-max (720px), verified via getBoundingClientRect in the Playwright spec; version history is strictly read-only. Plan Editor's Submit for review surfaces the exact 422 PLAN_EMPTY Alert without navigating away; a debounced ~3s save-on-blur implements the mockup's autosave indicator. ReviewPlanModal renders 403 SELF_APPROVAL_BLOCKED as an inline Alert that keeps the modal open. A new role_permissions-driven 'Prepare' SideNav group was added to nav-config. 2 auto-fixed deviations: Rule 3 (two new seeded Keycloak identities — planner@epmp.local/planning_logistics_chief and eocdirector@epmp.local/eoc_director — were required since no prior phase seeded distinct author/reviewer accounts for this feature's segregation-of-duties rule to be testable at all) and Rule 1 (Playwright Badge-locator strict-mode fix, scoping to .ep-page-header__status). All 4 new Playwright assertions passed first re-run after the locator fix. Full backend suite (11 files, 55 tests) green with zero regressions; tsc --noEmit and both npm run build (backend + frontend/app) clean)"
progress:
  total_phases: 6
  completed_phases: 2
  total_plans: 32
  completed_plans: 30
  percent: 34
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-14)

**Core value:** Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.
**Current focus:** Phase 3 — Plans, Tasks & Resource Requests (in progress)

## Current Position

Phase: 3 of 6 (Plans, Tasks & Resource Requests) — IN PROGRESS
Plan: 6 of 9 complete in current phase (03-01, 03-02, 03-03, 03-04, 03-07, 03-05 — waves 1/2/3/4 — COMPLETE; 03-06, 03-08, 03-09 remaining)
Status: 03-05 complete (Plans & Playbooks UI: Plan Repository, Plan Detail, Plan Editor, Link Tasks modal, Approval Workflow modal) — ready for 03-06 (Tasks/Resource-Requests UI)
Last activity: 2026-11-17 — Plan 03-05 complete (five Plans & Playbooks screens composed entirely from window.EPMP, making 03-03's plans API observable to a real browser user for the first time — see frontmatter last_activity for full detail; two new seeded Keycloak identities added as a Rule 3 blocking deviation so the cross-reviewer no-self-approval flow could be tested end-to-end with real distinct accounts)

Progress: [███░░░░░░░] 34%

## Performance Metrics

**Velocity:**

- Total plans completed: 23
- Average duration: 23 min
- Total execution time: 10.1 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| Phase 01 P01 | 25 min | 3 tasks | 11 files |
| Phase 01 P02 | 35 min | 3 tasks | 24 files |
| Phase 01 P03 | 30 min | 3 tasks | 9 files |
| Phase 01 P04 | 5 min | - tasks | 11 files |
| Phase 01 P06 | 25 min | 3 tasks | 11 files |
| Phase 01 P05 | 25 min | 3 tasks | 14 files |
| Phase 01 P08 | 22 min | 3 tasks | 7 files |
| Phase 01 P07 | 28 min | 3 tasks | 6 files |
| Phase 01 P09 | 70 min | 3 tasks | 11 files |
| Phase 01 P10 | 35 min | 3 tasks | 17 files |
| Phase 01 P11 | 48 min | 3 tasks | 6 files |
| Phase 01 P12 | 35 min | 3 tasks | 6 files |
| Phase 01 P13 | 50 min | 3 tasks | 8 files |
| Phase 01 P14 | 8 min | 1 tasks | 2 files |
| Phase 01 P15 | 20 min | 2 tasks | 5 files |
| Phase 02 P01 | 45 min | 3 tasks | 7 files |
| Phase 02 P04 | 18 min | 3 tasks | 14 files |
| Phase 02 P02 | 9 min | 3 tasks | 6 files |
| Phase 02 P03 | 12 min | 3 tasks | 7 files |
| Phase 02 P05 | 35 min | 3 tasks | 9 files |
| Phase 02 P06 | 25 min | 3 tasks | 7 files |
| Phase 02 P07 | 25 min | 2 tasks | 6 files |
| Phase 02 P08 | 13 min | 2 tasks | 4 files |

**Recent Trend:**

- Last 5 plans: 25 min, 25 min, 13 min
- Trend: Phase 1 is now fully complete: all 15 plans (13 original + 2 gap-closure) done. Phase 2 is now ALSO fully complete: all 8 plans done (7 original + 1 gap-closure), with a parallel-wave structure (02-01 and 02-04 both wave 1; 02-02 wave 2 depends_on 02-01; 02-03/02-05 wave 3; 02-06 wave 4; 02-07 wave 5, depends_on 02-03+02-04+02-06; 02-08 wave 6, gap_closure, isolated for infra reasons not a functional dependency). 02-05 shipped the Incident List/Create Incident screens (success criterion 1). 02-06 shipped the Incident Workspace plus the Command Role Assignment and Activation Level Change Modals (success criteria 2 and 3). 02-07 shipped the Operating Picture map screen (success criteria 4 and 5), composing 02-04's MAPS component family over 02-03's markers/layers endpoints, with its Playwright suite proving the page survives a forced GIS outage end-to-end. 02-08 closed UAT gap ref 2 (blocker): Keycloak OIDC sign-in is now reachable through Pivota's preview proxy, not just direct sandbox access — four compounding fixes (same-origin OIDC authority, Vite dev-proxy forwarding Keycloak's browser-facing paths, Keycloak KC_PROXY_HEADERS forwarded-header trust, relative realm redirectUris), proven end-to-end via forged X-Forwarded-* headers through the real :7777 proxy with zero regression on the existing direct-sandbox Playwright suite. Plan 02-01 ran one trivial auto-fixed deviation. Plan 02-04 ran one trivial test-infrastructure-only deviation. Plan 02-02 ran one auto-fixed Rule 1 bug (SAVEPOINT). Plan 02-03 ran clean. Plan 02-05 ran two auto-fixed deviations (Rule 3 Keycloak identity seed, Rule 1 Playwright label fix). Plan 02-06 ran one auto-fixed Rule 3 deviation (GET /api/v1/incidents/personnel). Plan 02-07 ran two auto-fixed deviations, both confined to its own new Playwright spec file (no production code touched): a Rule 3 test-fixture jurisdiction-scope grant for commander@epmp.local (the markers endpoint correctly enforces jurisdiction_scope filtering where the plain incidents-list endpoint doesn't yet — T-02-03) and a Rule 1 marker-overlap selector fix (exact-name aria-label matching instead of `.first()`, plus per-incident lat/lng jitter). Plan 02-08 ran one auto-fixed Rule 1 deviation (http-proxy's xfwd:true port-pollution bug, discovered during the plan's own reproduction, not assumed from documentation). All eight Phase 2 plans' own verify commands (build + full test suite, with 02-01/02-02/02-03/02-05/02-06/02-07/02-08 also running a live-stack integration/Playwright test) passed clean.

*Updated after each plan completion*
| Phase 03 P01 | 35 min | 3 tasks | 4 files |
| Phase 03 P02 | 15 min | 3 tasks | 5 files |
| Phase 03 P04 | 20 min | 2 tasks | 3 files |
| Phase 03 P07 | 25 min | 2 tasks | 2 files |
| Phase 03 P03 | 6 min | 3 tasks | 6 files |
| Phase 03 P05 | 48 min | 3 tasks | 13 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: Phases derived from TechArch's 5 backend module boundaries (auth-org, incident-ops, plans, comms-reporting, integration-gateway) plus F6 (mobile) and F18/F9 (cross-cutting) split into their own phases since they depend on APIs built in earlier phases.
- [Roadmap]: DEPLOY-01 mapped to Phase 1 (first phase producing a runnable, Postgres-backed app) per the Deployability Checklist.
- [Roadmap]: F2 (Common Operating Picture) and F11 (GIS integration) placed in Phase 2 with F1, since F2 is a read/aggregation layer with no owned tables that depends directly on F1's incident data and F11's base-map feed.
- [Phase 01-01]: audit_log immutability via BEFORE UPDATE/DELETE trigger instead of TechArch's REVOKE-based approach, since DEPLOY-01 gives the app one DATABASE_URL role that must also run DDL
- [Phase 01-01]: OPA image pinned to openpolicyagent/opa:0.68.0-debug (not the plain tag) because the Chainguard static base ships no shell/wget needed for its own healthcheck
- [Phase 01-01]: Seed idempotency implemented as explicit find-or-insert (SELECT then INSERT) rather than ON CONFLICT, since several auth-org tables have no UNIQUE constraint on their natural seed key per TechArch's verbatim DDL
- [Phase 01-02]: Cross-theme token-wiring proof reads cascaded CSS custom-property values (getPropertyValue('--success-subtle')) directly rather than computed color/background-color, since jsdom's cssstyle engine does not substitute var() inside shorthand color properties
- [Phase 01-04]: PageHeader is structurally the sole `<h1>` source in the design system (verified by the plan's own `grep -rn '<h1' src/` check), so "exactly one h1 per page" holds as long as every page composes exactly one PageHeader
- [Phase 01-04]: SideNav's bottom-bar variant slices `mobileBottomBarItems` to the first 4 unconditionally, enforcing the role_landing_config max-4 DB constraint from 01-01 structurally at the component level, not just by caller convention
- [Phase 01-06]: Modal's focus-trap/focus-return implemented with one internal useEffect (no external focus-trap library) — store document.activeElement on open, cycle Tab/Shift+Tab through a querySelectorAll focusable-elements set, Escape calls onClose, restore focus to the stored trigger on cleanup
- [Phase 01-06]: Table owns its own loading/empty/error presentation via props (delegating to Skeleton/EmptyState/Alert) rather than leaving every consumer screen to reimplement F0's "every list/table/panel has loading/empty/error" rule
- [Phase 01-03]: Rewrote backend/opa/policy.rego to read data.role_permissions[role_id][feature] instead of input.role_permissions — opa-client.ts syncs permissions into OPA's data document via PUT, so the original 01-01 policy (expecting the full table as input) would fail-closed on every check
- [Phase 01-03]: GET /api/v1/me/nav-config derives NavGroup[] directly from role_permissions (admin feature → full Admin nav group), leaving role_landing_config unpopulated per 01-01's documented Phase 6 scope boundary
- [Phase 01-05]: DatePicker's calendar-grid date arithmetic uses UTC Date objects internally keyed on YYYY-MM-DD strings to avoid local-timezone day-shift bugs, while the public value/onChange contract remains plain ISO strings with no timezone conversion applied
- [Phase 01-08]: client_secret hashed with Node's built-in crypto.scrypt (promisified, per-secret random salt) rather than adding bcrypt as a new dependency — plan's own spec offered scrypt as an equal alternative
- [Phase 01-08]: AuditService.record()'s recordId parameter must always be the row's own UUID primary key, never a natural-key string (e.g. record_type) — a mismatch there 500s with "invalid input syntax for type uuid" on every call, caught and fixed in record-authority.ts
- [Phase 01-07]: No DELETE route built for /api/v1/admin/roles — Phase 1's fixed 5-persona-role model means the FRD's 409 ROLE_IN_USE conflict is satisfied structurally (the deletion path itself doesn't exist), matching S8.3's permission-editing-only scope
- [Phase 01-07]: Role-permission edits call syncRolePermissionsToOpa() with the FULL current role_permissions table (not just changed rows) synchronously before responding, guaranteeing zero caching window for a client polling immediately after a PATCH
- [Phase 01-07]: SSO config PATCH activation always re-verifies IdP metadata reachability server-side at write time — never trusts a client-asserted tested_at/success flag from a prior /test call
- [Phase 01-09]: JetStream delivery worker uses nats.js's modern consumers.get(stream,durable)+.consume() async-iterable API instead of the plan's pseudocode pullSubscribe snippet, which never re-issues pull requests and would stall after the first batch
- [Phase 01-09]: @fastify/swagger's registration plugin must itself be wrapped with fastify-plugin (fp()) — without it its onRoute hook can't see sibling route plugins registered on the Fastify root, and GET /api/v1/openapi.json returns an empty paths object regardless of schema completeness
- [Phase 01-09]: background_jobs rows are find-or-updated by job_type (no UNIQUE constraint exists on that column) rather than INSERTed on every server boot, since startWebhookDeliveryWorker() runs once per start() and a bare INSERT silently accumulates duplicate rows across restarts
- [Phase 01-10]: frontend/app/tsconfig.json path-maps @epmp/design-system straight to its src/index.ts (not its declared-but-never-generated dist/index.d.ts) — a pre-existing 01-02 build gap worked around without touching that package's own Vite build pipeline
- [Phase 01-10]: Keycloak realm fix — groups protocol mapper's full.path must be true (not false) for sso.ts's group_to_role_mapping ('/epmp-admins', with leading slash) to ever match; also added seeded user firstName/lastName to avoid Keycloak's VERIFY_PROFILE required-action blocking every login. Both carried forward in backend/keycloak/epmp-realm.json for any future plan touching it.
- [Phase 01-10]: RouteGuard applies the resolved theme_preference to the DOM via useLayoutEffect on session resolution (not just on ThemeSwitcher's onChange) — this is what actually satisfies "no flash of wrong theme" on reload, since main.tsx's pre-render default can only ever be the static 'light' fallback
- [Phase 01-10]: SignInCallback's OIDC-callback effect has no cleanup-based cancellation guard — React.StrictMode's synthetic double-invoke was observed to silently drop a legitimately successful sign-in's navigate() via a stale cancelled=true; a useRef (not a cleanup flag) is the correct one-time guard for the non-idempotent OAuth code exchange
- [Phase 01-11]: Jurisdiction-scope editing rendered as a Checkbox list, not a multi-select Combobox — Combobox (01-05) is single-select only and a true multi-select is explicitly "Not yet built" per the design system's own Open Decisions
- [Phase 01-11]: No GET /api/v1/admin/jurisdictions endpoint exists in this phase's API surface — UserDetail.tsx derives checkbox options from jurisdiction_scope ids already present across the fetched users list rather than inventing a new endpoint outside the plan's integration_contracts
- [Phase 01-11]: Admin-console e2e specs resolve a target user by direct API lookup + page.goto(`/admin/users/{id}`) rather than clicking a row found by visible table text — the shared compose-stack database has accumulated 77+ fixture users across this phase's repeated plan/test runs, and the default page_size=25 list view (ORDER BY u.name) gives no guarantee a specific row sorts into the first page
- [Phase 01-13]: Dockerfile's runtime stage installs a dedicated production-only `backend/node_modules` (standalone npm install of backend's own package.json with devDependencies key deleted) rather than copying the full workspace-wide devDependency node_modules — Trivy's D7 scan blocks on fixable CRITICAL CVEs in vitest/tinypool/esbuild's bundled Go stdlib, all devDependency-only; the plan's own snippet had assumed this wouldn't be required to pass D7
- [Phase 01-13]: backend/migrations/1700000000001_seed-roles.js ships only the 5 structural persona roles + secops_admin's baseline role_permissions (0 users, 0 sso_config) as a production-safe migration, deliberately separate from scripts/seed.ts's dev-fixture admin user/sso_config which point at the local docker-compose Keycloak — solves the SSO group-to-role bootstrap problem without seeding sensitive fixture data into a real deployment
- [Phase 01-14]: Did not write .pivota/start-dev.sh — that file is generated exclusively by the platform's init-dev-server workflow (runtime-environment.md Section 7a), outside this phase's repository scope; this plan's dev-mode port banner + README section is an explicitly partial in-repo mitigation for UAT gap ref 3
- [Phase 01-15]: Dark theme's replacement --ink-disabled (#6c8499) derived by proportionally lightening the original #5d7284 hue 1.16x rather than an arbitrary hex, to stay in the same blue-grey hue family while clearing 4.5:1
- [Phase 02-01]: incidents table gets a documented nullable `location GEOGRAPHY(POINT,4326)` column beyond TechArch 02b's literal DDL — F2/FRD's diamond-marker rendering and MapMarker interface need it, but S1.2's create-form has no location field, so incidents without one are simply omitted from operating-picture markers until set
- [Phase 02-01]: incident_timeline immutability enforced via BEFORE UPDATE/DELETE trigger (not TechArch's REVOKE-based app_runtime role), identical to Phase 1's audit_log pattern, since DEPLOY-01 gives the app exactly one DB role that must also run migrations
- [Phase 02-01]: POST /api/v1/incidents duplicate-name warning (409 INCIDENT_POSSIBLE_DUPLICATE) resolved via a confirmed_duplicate:true request-body flag on resubmission — TechArch's literal request body doesn't show this field, but the FRD's "warn, not block" rule needs some confirm-and-proceed mechanism
- [Phase 02-01]: Generic PATCH /api/v1/incidents/{id} restricted to name/type/description with no Timeline entry — severity/activation_level/status changes get their own dedicated endpoints (later 02-* plans) with their own validation, since only those count as "state-changing actions" per FRD's Timeline-write rule
- [Phase 02-04]: MapCanvas's offline prop gates ONLY the base fill/label branch; markers/areas/lines render from an entirely separate, always-executed branch in the same component — this structural separation (not a shared conditional) is what makes "the page never fails to render" hold even in degraded mode
- [Phase 02-04]: Provenance's verified=false path renders fully different markup (dashed border + Icon + literal word) rather than a conditional class on shared markup, so a caller cannot accidentally make unverified data look verified by omitting a prop
- [Phase 02-04]: LayerPanel's unverified rows reuse Provenance directly (not a second dashed-treatment implementation); MapLegend is built on Card padded={false} rather than reimplementing panel chrome
- [Phase 02-02]: Command-role reassignment locks the existing active-role row with SELECT ... FOR UPDATE before deciding assign/reassign/no-op, closing the race where two concurrent reassignment requests could both create a simultaneously-active row for the same role
- [Phase 02-02]: closure.ts reuses activation.ts's exact ACTIVATION_CONFIRMATION_REQUIRED error code for its own confirmed:true gate — documented as EPMP's general destructive-action confirmation convention, not duplicated per-endpoint
- [Phase 02-02]: The tasks-cascade UPDATE (defensive against Phase 3's not-yet-existing tasks table) needed a Postgres SAVEPOINT, not just a JS try/catch, to avoid poisoning the rest of the transaction on Postgres's all-or-nothing error semantics — found via this plan's own integration test
- [Phase 02-03]: GIS adapter stub recognizes exactly one layer_id ('agency-base-boundary'); any other value deterministically simulates a vendor timeout (GIS_FEED_TIMEOUT) — gives tests a reliable way to exercise the real adapter-throws path without random failure injection
- [Phase 02-03]: baseLayerSource/baseLayerAsOf are initialized to the schematic-degraded values BEFORE the GIS fetch is attempted, overwritten only on a fully provenanced success — makes the fallback structurally the default code path, not a catch-block afterthought, and is what the plan's own integration test proves directly by forcing the adapter to throw
- [Phase 02-03]: status_bar.as_of reduces to the single base layer's as_of for Phase 2 (no other provenanced layer exists yet) — documented inline as a TODO for F12/F17 to extend to the FRD's true stalest-across-all-visible-layers rule
- [Phase 02-05]: Added GET /api/v1/jurisdictions (incidents:view gated) since no prior plan exposed a jurisdictions-list endpoint and the Create Incident form's Combobox needs a real options source
- [Phase 02-05]: nav-config's new "Activate" group reuses 01-03's exact role_permissions-driven derivation pattern — any role with ANY incidents permission sees it, reconciling 02-01's seeded view-only vs full-access role split with the nav the shell renders
- [Phase 02-05]: Seeded a second Keycloak identity (commander@epmp.local, incident_commander role, /epmp-incident-commanders group) for e2e sign-in, since admin@epmp.local's secops_admin role deliberately holds no incidents permissions (02-01's own seed decision)
- [Phase 02-05]: Alert's warning tone stays non-dismissable-by-button for the duplicate-name 409 (Phase 1's PERSISTENT_TONES contract) — "does not block" is satisfied via confirm-and-resubmit + auto-clear-on-name-edit, not by adding a dismiss affordance that would contradict Alert's documented persistence rule
- [Phase 02-06]: Added GET /api/v1/incidents/personnel (incidents:view gated) instead of reusing GET /api/v1/admin/users for the Command Role Modal's Combobox — incident_commander/eoc_director (the only roles holding incidents:edit) deliberately hold no admin:view permission per 02-01's seed, so reusing the admin endpoint would have required widening admin access to a role with no business there
- [Phase 02-06]: ActivationModal's 422 NO_COMMANDER_ASSIGNED path deliberately skips the parent's onChanged() refetch callback — the activation-level display visibly stays unchanged because the client never re-fetches, not because of any extra client-side state check duplicating the server's own gate
- [Phase 02-07]: Operating Picture's /operating-picture route added to main.tsx (not AppShell.tsx) — consistent with 02-05/02-06's established convention that main.tsx owns the nested route tree; AppShell.tsx is layout/chrome only
- [Phase 02-07]: Status bar text and MapCanvas's offline prop are both derived from the identical backend status_bar.base_layer_source string (never independently tracked) — structurally impossible to show contradictory GIS-outage states
- [Phase 02-07]: projectToPercent(lat, lng, bbox) colocated in the page file (not the design system) — a documented linear approximation standing in for a real MapLibre/Leaflet/ArcGIS JS integration's own screen-coordinate output, since no map-engine license/tile-server credential exists in this sandbox
- [Phase 02-07]: Discovered (not caused by this plan) that commander@epmp.local's JIT-provisioned jurisdiction_scope is empty by design, and that operating-picture.ts's markers query (unlike the still-unscoped GET /api/v1/incidents list endpoint, T-02-03) correctly enforces it — fixed via a test-fixture-only grant in the new Playwright spec, not a production code change
- [Phase 02-08]: KEYCLOAK_AUTHORITY changed from hardcoded sandbox-internal string to window.location.origin-derived, mirroring the file's own already-correct redirect_uri pattern
- [Phase 02-08]: Vite Keycloak proxy entries use an explicit configure() forwarded-header hook, not http-proxy's xfwd:true -- xfwd:true unconditionally appends its own listening port to X-Forwarded-Port, corrupting Keycloak's computed issuer in a chained-proxy scenario (discovered during this plan's own reproduction, not assumed)
- [Phase 02-08]: epmp-app's redirectUris widened to the host-less relative pattern /auth/callback, /auth/callback/* (not a literal preview-domain wildcard, which Keycloak 25.0 empirically rejected) -- validated against both a simulated external preview origin and direct sandbox access
- [Phase 03-01]: isValidTransition() implemented as a switch on current status with an early reject-Overdue guard rather than a literal transition-table map, so the never-user-settable-to-Overdue rule reads as one line instead of being duplicated across every current-status branch
- [Phase 03-01]: fetchTaskRow() is parameterized over either the bare query helper or a transaction client, so the pre-PATCH existence/current-state lookup and the post-mutation re-fetch-for-response share one implementation instead of two near-duplicates
- [Phase 03-02]: overdue-sweep.ts uses one transaction PER flipped task (not one transaction for the whole sweep run) since the sweep spans many independent tasks/incidents and needs per-task fault isolation; closure.ts's per-task audit loop instead runs INSIDE the closure's existing single transaction since all cascaded tasks share one atomic close-the-incident operation that must roll back together on any failure
- [Phase 03-02]: Confirmed background_jobs_job_type_check is the real constraint name in the migrated database (via pg_constraint query) before finalizing the ALTER migration, per the plan's own verify-before-commit instruction — the default node-pg-migrate naming assumption held, no adjustment needed
- [Phase 03-04]: Declining a resource request is gated on the 'approve' RBAC action (not 'edit'), since declining is itself an approval-adjacent decision requiring the same permission level as approving
- [Phase 03-04]: The UX mockup's "Assigned" state is reconciled as a sub-state of 'Approved' (assigned_to IS NOT NULL), not a distinct status enum value — the single POST .../fulfill endpoint handles both the first assign-only call (no status-history row, since assignment is metadata not a transition) and the second true-fulfill call
- [Phase 03-04]: save_as_draft:true added as a documented extension beyond the FRD's literal request shape, giving Draft a real reachable resting state since the UX mockup's Create/Edit form shows no separate "save as draft" action
- [Phase 03-07]: resource_requests 'approve' action-level granted ONLY to planning_logistics_chief (not incident_commander/eoc_director) — command staff can create a request but logistics alone approves it, per the FRD's explicit role split
- [Phase 03-07]: plans 'review' action-level granted to eoc_director specifically, SEPARATE from planning_logistics_chief's create/edit grant — makes the no-self-approval workflow satisfiable with real seeded accounts
- [Phase 03-03]: materialize-tasks split into its own file (materialize.ts) rather than appended to plans.ts, once plans.ts crossed ~400 lines — Plan's own stated discretion for file organization once the single-file size grows past the plan's 2-3-task budget comfort
- [Phase 03-05]: LinkTasksModal's "Default owner role" Select offers the 5 real persona role names (what materialize.ts actually resolves against roles.name), not the 6 similarly-named ICS "command role" titles assigned per-incident via CommandRoleModal — a distinct, unrelated concept despite the name overlap
- [Phase 03-05]: Two new seeded Keycloak identities (planner@epmp.local -> planning_logistics_chief, eocdirector@epmp.local -> eoc_director) added to epmp-realm.json + seed.ts's group_to_role_mapping, following 02-05's exact commander@epmp.local pattern — required since no prior phase seeded distinct author/reviewer accounts for the plans feature's segregation-of-duties rule
- [Phase 03-05]: ReviewPlanModal shows CURRENT plan sections only (not a full diff against the last Approved content_snapshot) and "View this version" renders a summary-only modal (no full historical text) — both documented as budget-scoped simplifications of the FRD's literal language, not regressions

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-11-17T14:50:00.000Z
Stopped at: Completed 03-05-PLAN.md
Resume file: None
