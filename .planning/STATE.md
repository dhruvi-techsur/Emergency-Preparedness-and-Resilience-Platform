---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 02-03-PLAN.md
last_updated: "2026-11-16T13:20:02.844Z"
last_activity: 2026-11-16 — Plan 02-03 complete (F11 GIS adapter stub enforcing mandatory source/as_of provenance, feeding F2's operating-picture markers/layers endpoints where the 'Schematic base map, offline' fallback is the structural default code path — not a bolted-on catch block — so the page is incapable of 500ing even under total GIS outage; proven directly by an integration test that forces the adapter to throw and asserts 200 + the exact fallback label; 0 deviations beyond a trivial @types/geojson devDependency install needed to compile the plan's own specified GeoJSON.Feature[] type)
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 31
  completed_plans: 19
  percent: 19
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-14)

**Core value:** Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.
**Current focus:** Phase 2 — Incident Command & Operating Picture (in progress)

## Current Position

Phase: 2 of 6 (Incident Command & Operating Picture)
Plan: 4 of 7 complete in current phase (02-01, 02-04 — wave 1; 02-02 — wave 2, depends_on 02-01; 02-03 — wave 3, depends_on 02-01+02-02 — all COMPLETE; 02-05/02-06/02-07 remain)
Status: In progress — ready for 02-05/02-06/02-07 (frontend plans; 02-07 consumes 02-03's operating-picture endpoints directly)
Last activity: 2026-11-16 — Plan 02-03 complete (F11 GIS adapter stub enforcing mandatory source/as_of provenance, feeding F2's operating-picture markers/layers endpoints where the 'Schematic base map, offline' fallback is the structural default code path — not a bolted-on catch block — so the page is incapable of 500ing even under total GIS outage; proven directly by an integration test that forces the adapter to throw and asserts 200 + the exact fallback label; 0 deviations beyond a trivial @types/geojson devDependency install needed to compile the plan's own specified GeoJSON.Feature[] type)

Progress: [██░░░░░░░░] 19%

## Performance Metrics

**Velocity:**

- Total plans completed: 19
- Average duration: 24 min
- Total execution time: 8.5 hours

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

**Recent Trend:**

- Last 5 plans: 45 min, 18 min, 9 min, 12 min
- Trend: Phase 1 is now fully complete: all 15 plans (13 original + 2 gap-closure) done. Phase 2 is underway with a parallel-wave structure (02-01 and 02-04 are both wave 1, no interdependency between the backend incident-ops foundation and the design-system MAPS component family); 02-02 (wave 2, depends_on 02-01) extended the incident-ops backend with command-role assignment, activation gating, and closure; 02-03 (wave 3, depends_on 02-01+02-02 solely to serialize edits to the shared routes.ts file) added the F11 GIS adapter stub and F2's operating-picture markers/layers endpoints. Plan 02-01 ran one trivial auto-fixed deviation — a backtick-in-SQL-comment template-literal break. Plan 02-04 ran one trivial test-infrastructure-only deviation. Plan 02-02 ran one auto-fixed Rule 1 bug: the plan's specified plain try/catch around a forward-compatible "tasks table doesn't exist yet" UPDATE didn't actually prevent Postgres's all-or-nothing transaction abort — needed a real SAVEPOINT, caught immediately by the plan's own integration test. Plan 02-03 ran clean with zero deviations beyond a trivial @types/geojson devDependency install. All four Phase 2 backend plans' own verify commands (build + full test suite, with 02-01/02-02/02-03 also running a live-stack integration test) passed clean.

*Updated after each plan completion*

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-11-16T13:18:26.100Z
Stopped at: Completed 02-03-PLAN.md
Resume file: None
