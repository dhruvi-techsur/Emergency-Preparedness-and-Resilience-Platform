---
pivota_spec_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 01-12-PLAN.md
last_updated: "2026-11-16T05:35:00.000Z"
last_activity: 2026-11-16 — Plan 01-12 complete (SSO config test-before-activate gate, Platform Monitoring, Integration Health, API Clients one-time-secret, Federation Grants immediate-revoke admin screens)
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 13
  completed_plans: 12
  percent: 92
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-11-14)

**Core value:** Give emergency management organizations one shared, trustworthy operating picture — spanning readiness, live incident coordination, and after-action learning — so they can demonstrate preparedness, coordinate a response with less manual reconciliation, and show measurable resilience improvement after every incident or exercise.
**Current focus:** Phase 1 — Platform Foundation & Deployable Shell

## Current Position

Phase: 1 of 6 (Platform Foundation & Deployable Shell)
Plan: 12 of 13 in current phase (01-13 — final deploy-packaging plan — next per wave 6)
Status: In progress
Last activity: 2026-11-16 — Plan 01-12 complete (SSO config test-before-activate gate, Platform Monitoring, Integration Health, API Clients one-time-secret, Federation Grants immediate-revoke admin screens)

Progress: [█████████░] 92%

## Performance Metrics

**Velocity:**

- Total plans completed: 12
- Average duration: 28 min
- Total execution time: 5.9 hours

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

**Recent Trend:**

- Last 5 plans: 70 min, 35 min, ~30 min, 35 min
- Trend: Plan 12 landed at average with only one environment-recovery deviation (a silently-dead Vite dev server process, not a code bug) — all 4 of this plan's Playwright assertions plus the full 13-test cross-plan suite (01-10/01-11/01-12) passed on the first real run against the live stack

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
- [Phase 01-12]: SSO config's Save-gate uses a stable JSON fingerprint comparison (not a boolean "hasBeenTested" flag) over every field a Test call validates, so any field edit — not just a hardcoded set — invalidates the gate automatically
- [Phase 01-12]: API-client secret reveal uses one local-only useState in the Create modal, never the React Query cache, cleared entirely on "Done" — the backend (01-08) never returns it again on any GET, so client and server agree on exactly one moment the plaintext exists
- [Phase 01-12]: Federation Grants' jurisdiction picker derives its single option from any admin user's jurisdiction_scope[0] rather than hardcoding a UUID, since no jurisdictions-list endpoint exists yet in Phase 1

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-11-16T05:35:00.000Z
Stopped at: Completed 01-12-PLAN.md
Resume file: None
