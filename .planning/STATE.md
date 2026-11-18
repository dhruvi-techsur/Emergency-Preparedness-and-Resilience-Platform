---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Plan 05-02 shipped the client-side half of F6 — SyncStatus design-system component, IndexedDB-backed offline-queue library with queue-first writes and auto-sync-on-reconnect, and PWA manifest/service-worker scaffolding for home-screen installability.
stopped_at: Completed 05-02-PLAN.md
last_updated: "2026-11-18T14:32:54.710Z"
last_activity: 2026-11-18 — Plan 05-02 complete (see 05-02-SUMMARY.md for full detail), run in parallel with 05-01. New SyncStatus product-pattern component (icon+word+color for online/syncing/offline/conflict, exported from window.EPMP) and frontend/app/src/lib/offline-queue.ts (enqueueFieldReport/getQueueSnapshot/subscribeToQueue/syncQueueNow) give 05-03/05-04's field-mobile screens both reusable primitives they need, independently proven correct before any screen exists. vite-plugin-pwa now emits dist/manifest.webmanifest + dist/sw.js on build. Design-system suite (59 tests, +8 new) and frontend/app's new offline-queue suite (5 tests against fake-indexeddb) both green; tsc --noEmit clean in both workspaces; design-system + app builds both clean.
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 57
  completed_plans: 44
  percent: 67
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-14)

**Core value:** Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.
**Current focus:** Phase 5 — Mobile Field Operations — IN PROGRESS. Plan 05-01 (backend data layer + API) complete. Plan 05-02 (SyncStatus component + offline-queue library + PWA scaffolding) complete, run in parallel with 05-01. 05-03/05-04/05-05 remain.

## Current Position

Phase: 5 of 6 (Mobile Field Operations) — IN PROGRESS
Plan: 2 of 5 complete in current phase (05-01, 05-02 done, run in parallel this session; 05-03/05-04/05-05 pending)
Status: Plan 05-02 shipped the client-side half of F6 — SyncStatus design-system component, IndexedDB-backed offline-queue library with queue-first writes and auto-sync-on-reconnect, and PWA manifest/service-worker scaffolding for home-screen installability.
Last activity: 2026-11-18 — Plan 05-02 complete (see 05-02-SUMMARY.md for full detail), run in parallel with 05-01. New SyncStatus product-pattern component (icon+word+color for online/syncing/offline/conflict, exported from window.EPMP) and frontend/app/src/lib/offline-queue.ts (enqueueFieldReport/getQueueSnapshot/subscribeToQueue/syncQueueNow) give 05-03/05-04's field-mobile screens both reusable primitives they need, independently proven correct before any screen exists. vite-plugin-pwa now emits dist/manifest.webmanifest + dist/sw.js on build. Design-system suite (59 tests, +8 new) and frontend/app's new offline-queue suite (5 tests against fake-indexeddb) both green; tsc --noEmit clean in both workspaces; design-system + app builds both clean.

Plan 05-01 (prior, backend): shipped the F6 backend data layer and API surface — field_reports/field_report_photos/sync_conflicts tables plus idempotent-submit/ordered-batch-sync/photo-upload/conflict-resolve endpoints, every incident-touching write wrapped in the shared withTimelineTransaction invariant. Integration test (4 cases) + full backend suite (15 files, 74 tests) green with zero regression; tsc --noEmit and backend build both clean.

Progress: [███████░░░] 67%

## Performance Metrics

**Velocity:**

- Total plans completed: 36
- Average duration: 24 min
- Total execution time: 13.3 hours

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
| Phase 03 P06 | 35 min | 3 tasks | 11 files |
| Phase 03 P08 | 35 min | 2 tasks | 4 files |
| Phase 03 P09 | 50 min | 2 tasks | 3 files |
| Phase 03 P10 | 25 min | 3 tasks | 4 files |
| Phase 04 P03 | 25 min | 3 tasks | 10 files |
| Phase 04 P01 | 10 min | 3 tasks | 5 files |
| Phase 04 P02 | 14 min | 3 tasks | 6 files |
| Phase 04 P04 | 18 min | 2 tasks | 2 files |
| Phase 04 P05 | 42 min | 3 tasks | 7 files |
| Phase 04 P06 | 70 min | 3 tasks | 7 files |
| Phase 04 P07 | 45 min | 2 tasks | 3 files |
| Phase 04 P09 | 15 min | 2 tasks | 3 files |
| Phase 04 P08 | 35 min | 3 tasks | 10 files |
| Phase 05 P01 | 8 min | 3 tasks | 7 files |
| Phase 05-02 P02 | 35 min | 3 tasks | 12 files |

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
- [Phase 03-06]: Added GET /api/v1/tasks/{id} and GET /api/v1/resource-requests/{id} (both embedding status_history) plus PATCH /api/v1/tasks/{id}/owner — TechArch's literal endpoint table has none of the three, but Task/Resource-Request Detail pages and the Task List's bulk-reassign action genuinely need them; same precedent as 03-03/03-05's GET /api/v1/plans/{id}
- [Phase 03-06]: Task/CreateTask's owner Comboboxes source from GET /api/v1/incidents/personnel, not GET /api/v1/admin/users — confirmed via seed.ts that all 4 roles holding tasks permissions (incident_commander, eoc_director, planning_logistics_chief, field_responder) hold incidents:view but none hold admin:view, same gap CommandRoleModal.tsx already documented and fixed
- [Phase 03-08]: PlanDetail.tsx gained a 'Link tasks' entry point reusing LinkTasksModal — previously only PlanEditor's Draft-only flow could reach it, which blocked linking a task template to an already-Approved plan through the real UI
- [Phase 03-08]: CreateResourceRequest.tsx now returns to the originating Incident Workspace when routeIncidentId is present, mirroring CreateTask.tsx's already-correct incident-aware navigate() pattern
- [Phase 03-09]: resourceStatusToTone's Draft case maps to 'brand' (not a 6th invented tone) since MapMarker's MarkerTone type has no 'neutral' entry — Fulfilled/Declined never reach this function since they're excluded from operating-picture.ts's query WHERE clause entirely
- [Phase 03-09]: Layer-visibility filtering generalized from a single hardcoded 'incidents' check to a marker-type->layer-id map, fixing a latent bug where toggling the 'incidents' layer would have also hidden resource markers once a second real layer/marker-type existed
- [Phase 03-09]: Resource-marker MapPopup renders directly from the thin marker object already in the polled markers array (no extra GET /api/v1/resource-requests/{id} fetch) — unlike the incident popup, which needs full detail (jurisdiction name, opened_at) the thin marker shape doesn't carry
- [Phase 03-10]: Section checkboxes in MaterializeTasksModal are an opt-in NARROWING filter (default: all eligible sections' templates materialize), not a required per-section selection — matches the FRD's one-click framing and the backend's own optional section_ids param
- [Phase 03-10]: Exactly one new entry point for materialize-tasks (the PlanDetail PageHeader action) — no second affordance on the sections list or version-history sidebar, since per-section "Link tasks" (03-08) is a separate authoring concern from materializing
- [Phase 04-03]: LineChart's 6th-series marker shape (the spec names exactly 5: circle/square/triangle/diamond/cross) resolved as a ring with a contrasting center dot — visually distinct from series-1's filled circle even in grayscale/print
- [Phase 04-03]: DonutChart's >5-segment caller-contract violation is a dev-only console.warn (gated on process.env.NODE_ENV), never a thrown error or silent truncation — all segments always render regardless of count
- [Phase 04-01]: Notifications migration renumbered to 1700000000008 (the plan's literal 1700000000007 was already claimed by Phase 3's plans-schema.js) — preserves node-pg-migrate's numeric-ordering contract with zero behavioral difference from the plan's intent
- [Phase 04-01]: POST /api/v1/notifications/{id}/send's APPROVER_MISMATCH gate is enforced via caller-identity equality (body's approver_id must equal req.epmpUser.id), not a role-permission lookup on the asserted id — a caller cannot send on behalf of a DIFFERENT named person regardless of that person's own permissions, matching FRD's "enforced server-side, not just hidden client-side" rule
- [Phase 04-01]: assertAiOriginApproved/AiOriginNotApprovedError exported from comms-reporting/notifications.ts as the ONE shared AI-governance guard — 04-02's reporting module imports it unchanged rather than reimplementing, per TechArch 01-components.md \u00a72.4 rule 3
- [Phase 04-01]: Geography-type recipient groups structurally resolve to zero concrete notification_recipients at both list (member_count omitted) and compose time — documented Phase-6/F16-roster-sync-dependent scope boundary, no live roster-geo-match exists this phase
- [Phase 04-02]: Migration renumbered to 1700000000009 (not plan's literal 1700000000008, already claimed by 04-01's notifications-schema.js)
- [Phase 04-02]: AAR re-generation upserts in place against the Draft row (ON CONFLICT ... WHERE status != 'Finalized'), returning 403 DOCUMENT_IMMUTABLE on a Finalized conflict instead of silently no-op'ing
- [Phase 04-02]: AAR decisions_log heuristic: EPMP-sourced Timeline rows with tone warning/danger OR title matching Activation changed to|assigned to|Incident closed are decision-tagged -- documented approximation since no literal is_decision column exists
- [Phase 04-02]: Evidence log deliberately excludes null-actor_id incident_timeline rows (e.g. the Overdue sweep) since the Actor column has no person to render for those
- [Phase 04-04]: notifications 'approve' action-level granted ONLY to incident_commander (PER-02's PIO-merge per PERSONAS-EPMP.md) — the sole approve-and-send authority, matching F5's named-person-approval rule with one realistic seeded identity
- [Phase 04-04]: reporting 'edit' action-level (gating SITREP/AAR finalize) granted ONLY to planning_logistics_chief — the FRD's named SITREP/AAR author role; incident_commander/eoc_director can trigger generation but not finalize, matching 03-07's no-single-role-holds-everything segregation pattern
- [Phase 04-05]: Compose happens lazily at Step 4's danger-Modal confirm, not at Step-1 completion -- no partial notification rows for abandoned compose sessions; GET /api/v1/me/nav-config extended with a full feature->actions permissions map so Compose's Approve-and-send button can be proactively client-side gated without a second endpoint
- [Phase 04-06]: AarGenerator's page-level closure gate checks incident.status BEFORE ever constructing the wizard's JSX tree (not a disabled/hidden wizard) — the EmptyState with the exact FRD message IS the entire render output for a non-Closed incident, matching the mockup's "action is absent/disabled" rule structurally
- [Phase 04-06]: A new "Improve" SideNav group (Evidence log, Analytics) added independently of 04-05's same-wave "Coordinate" append — each plan's Task 3 only appends to the group/key it actually owns, so no collision was possible between the two parallel plans
- [Phase 04-06]: AnalyticsDashboard's Stat tiles pass no `target` prop because `StatProps` has no such field at all — the never-invented-target rule is a structural property of the design-system component, not merely a data-layer promise from the backend
- [Phase 04-06]: Evidence log's actor-filter Combobox derives options from its own already-fetched rows rather than GET /api/v1/admin/users — planning_logistics_chief (reporting:view) doesn't hold admin:view, so reusing that endpoint would 403 for this view's real audience
- [Phase 04-06]: PDF export intentionally NOT offered as a UI choice in Evidence Log View — 04-02's format=pdf backend path is a documented guaranteed 500 EXPORT_FAILED; offering a guaranteed-failing option is worse than omitting it
- [Phase 04-07]: Reports tab's generated-document list reads GET /api/v1/evidence-log?action_type=aar_finalized (client-narrowed by detail.incident_id) rather than a new backend endpoint — 04-02 exposes no "list all reports for this incident" GET, and SITREPs have no equivalent audit-visible write to recover from at all; documented as an honest Phase-4 scope limitation since this tab is not this plan's primary proof target
- [Phase 04-07]: Fixed a real pre-existing bug in evidence-log.ts: action_type/record_type filters referenced their own SELECT-list output alias (`action`) in the incident_timeline half of the UNION's WHERE clause, which Postgres cannot resolve (it.title is the real column, not a column literally named action) — every such filtered request was silently 500ing, surfaced client-side as a generic "Could not load the evidence log" error
- [Phase 04-07]: incident-to-evidence-trail.spec.ts uses TWO identities (incident_commander, planning_logistics_chief), not a single-identity shortcut — reporting:edit (gating SITREP save-as-draft and AAR finalize) is held only by planning_logistics_chief per 04-04's seed, discovered when the spec's own first single-identity draft produced false-positive passing assertions
- [Phase 04-09]: requirePermission()'s checkPermission()-false branch now returns a new PERMISSION_DENIED error_code/message, not ROLE_UNRESOLVED — ROLE_UNRESOLVED stays reserved exclusively for the SSO callback's genuine role-resolution-failure path, since users.role_id is NOT NULL REFERENCES roles(id) and can never be unresolved once a users row exists at all; a resolved role lacking an action gets the SAME PERMISSION_DENIED response whether it holds zero or some-but-not-this grants on the feature
- [Phase 04-08]: signIn(returnPath?) forwards the pre-redirect deep-link path via oidc-client-ts's own ExtraSigninRequestArgs.state param (read back off User.state on the callback) rather than a custom sessionStorage/localStorage return-path mechanism — the library already carries state through the full authorization-code redirect+callback round-trip with no extra storage key or threat surface
- [Phase 04-08]: SignInCallback's state type-guard requires a non-empty string starting with '/' AND explicitly rejects '/auth/callback' itself, not just non-string values — closes both the open-redirect vector (any absolute URL falls through to the existing '/' fallback) and a pathological self-redirect loop
- [Phase 04-08]: AAR button explanation ships BOTH a title attribute (hover/screen-reader, matching SideNav.tsx's own interim no-Tooltip-yet pattern) AND an always-visible caption — a title-only tooltip is not reliably discoverable on touch devices or without hover
- [Phase 04-08]: auth-deep-link-return-path.spec.ts uses page.context().newPage() (a second page in the SAME browser context, sharing cookies but with independent sessionStorage) to reproduce the gap, NOT browser.newContext() (a separate cookie jar that would hit a real Keycloak login form instead of the silent SSO round-trip the gap is actually about) — and issues a SINGLE navigation directly to the deep link rather than a preliminary visit to '/' first, since '/' is itself unauthenticated and would kick off a second, racing OIDC round-trip with the wrong return path
- [Phase 05-01]: field-operations migration renumbered 1700000000009 -> 1700000000010 (the plan's literal number collides with Phase 4's already-existing 1700000000009_reporting-schema.js) — same renumbering precedent 04-01/04-02 established
- [Phase 05-01]: @fastify/multipart registered locally inside field-reports.ts's own plugin scope (not globally in server.ts) to contain the new dependency's blast radius to the one route that needs multipart parsing
- [Phase 05-01]: Photo bytes persist to backend/uploads/ (gitignored) as a local-disk stand-in for a real object-storage adapter (no MinIO/S3 configured this phase), read back exclusively through a same-origin GET route pair — documented as a drop-in replacement point for a future real adapter
- [Phase 05-01]: sync-batch conflict detection covers entity_type='field_report' vs incidents.updated_at only; any other entity_type (e.g. a future F4 task-status sync-batch) is a documented extension point for a later plan
- [Phase 05-02]: offline-queue.ts: a network-level sync-batch failure leaves every attempted item queue_status unchanged at 'pending' (never 'failed'), so it is retried on the next reconnect instead of silently abandoned

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-11-18T14:32:47.083Z
Stopped at: Completed 05-02-PLAN.md
Resume file: None
