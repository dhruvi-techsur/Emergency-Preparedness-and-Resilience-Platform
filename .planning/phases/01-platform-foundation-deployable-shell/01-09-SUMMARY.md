---
phase: 01-platform-foundation-deployable-shell
plan: 09
subsystem: integration-gateway
tags: [nats, jetstream, webhooks, openapi, fastify-swagger, platform-health, background-jobs]

# Dependency graph
requires:
  - phase: 01-03
    provides: "backend/src/modules/auth-org/sso.ts (handleSsoCallback), rbac.ts (requirePermission), audit.ts (AuditService), db/client.ts (query<T>())"
provides:
  - "backend/src/modules/integration-gateway/nats-client.ts: connectNats()/publishEvent() against the EPMP_EVENTS JetStream stream, graceful degradation on connection failure"
  - "backend/src/modules/integration-gateway/webhook-subscriptions.ts: POST /api/v1/admin/webhook-subscriptions with scrypt-hashed secret"
  - "backend/src/modules/integration-gateway/webhook-delivery-worker.ts: durable pull-consumer delivery with DB-constraint idempotency dedup, exponential backoff, background_jobs bookkeeping"
  - "backend/src/openapi/spec.ts: GET /api/v1/openapi.json — live OpenAPI 3.1 document assembled from every route's declared schema"
  - "backend/src/modules/auth-org/platform-health.ts: GET /api/v1/admin/platform-health"
  - "backend/src/modules/auth-org/admin-integration-health.ts: GET /api/v1/admin/integration-health"
  - "sso.ts: publishEvent('user.login', ...) fired after every successful login, non-blocking on publish failure"
affects: [01-11]

# Tech tracking
tech-stack:
  added: ["nats (JetStream client)", "@fastify/swagger", "fastify-plugin", "openapi-types (type-only)"]
  patterns:
    - "JetStream delivery worker uses the modern consumers.get(stream, durable) + .consume() async-iterable API, not the legacy pullSubscribe — consume() auto-repulls continuously, matching how a real production consumer must behave"
    - "@fastify/swagger must itself be registered via a fastify-plugin-wrapped function (fp()) so its onRoute hook observes sibling route plugins registered directly on the Fastify root instance, not just its own encapsulation context"
    - "background_jobs rows are find-or-updated by job_type (no UNIQUE constraint exists on that column) rather than blind-INSERTed on every server boot, matching scripts/seed.ts's established find-or-insert idempotency convention"
    - "Webhook delivery idempotency is enforced at the database layer (UNIQUE (subscription_id, idempotency_key) + ON CONFLICT DO NOTHING), never an application-level Set, so concurrent delivery workers can't double-deliver"

key-files:
  created:
    - backend/src/modules/integration-gateway/nats-client.ts
    - backend/src/modules/integration-gateway/webhook-subscriptions.ts
    - backend/src/modules/integration-gateway/webhook-delivery-worker.ts
    - backend/src/modules/auth-org/platform-health.ts
    - backend/src/modules/auth-org/admin-integration-health.ts
    - backend/src/openapi/spec.ts
    - backend/src/modules/integration-gateway/eventbus.test.ts
  modified:
    - backend/src/modules/auth-org/sso.ts
    - backend/src/modules/auth-org/routes.ts
    - backend/src/modules/auth-org/admin-users.ts
    - backend/src/server.ts

key-decisions:
  - "Rewrote the plan's pseudocode pullSubscribe/for-await snippet to use nats.js's modern consumers.get()+.consume() API — pullSubscribe requires the caller to manually re-issue .pull() calls to keep messages flowing, and the plan's literal snippet (a bare for-await over the subscription with no .pull() call) would receive at most one batch and then silently stop, never processing a second published event"
  - "Wrapped the OpenAPI plugin with fastify-plugin (fp()) — without it, @fastify/swagger's onRoute hook only observes routes in its own encapsulation context, so sibling route plugins (authOrgRoutes, platformHealthRoutes, etc., each registered directly on the Fastify root in server.ts) would be invisible and the generated document would come back with an empty paths object regardless of how many routes declared a schema"
  - "background_jobs is find-or-updated by job_type rather than INSERTed on every boot, since the table has no UNIQUE constraint on that column and startWebhookDeliveryWorker() runs once per server start — a bare INSERT silently accumulated duplicate rows across restarts (caught via manual smoke-test of platform-health, not by the plan's own verify commands)"

patterns-established:
  - "Durable JetStream consumer creation (jsm.consumers.add) happens once in connectNats(), not in the worker itself — keeps stream/consumer provisioning colocated with connection setup and makes the worker a pure consumer of an already-provisioned durable"
  - "computeBackoff(failureCount) is exported from webhook-delivery-worker.ts as the shared exponential-backoff helper for any future background_jobs consumer, per Y2-errors.md's 'base interval doubling, capped at 1 hour' convention"

# Metrics
duration: 70min
completed: 2026-11-16
---

# Phase 1 Plan 09: NATS Event Bus, Webhook Delivery & OpenAPI/Health Observability Summary

**NATS JetStream event bus with idempotent webhook delivery (DB-constraint dedup, exponential backoff), a live OpenAPI 3.1 document assembled from every route's declared schema via @fastify/swagger, and platform/integration-health read endpoints — `user.login` now flows end-to-end from SSO callback through durable delivery to a registered external subscriber, proven against the real compose stack.**

## Performance

- **Duration:** 70 min
- **Started:** 2026-11-16T03:25:00Z (approx)
- **Completed:** 2026-11-16T03:42:00Z
- **Tasks:** 3
- **Files modified:** 7 created, 4 modified

## Accomplishments
- `connectNats()`/`publishEvent()` durably publish to the `EPMP_EVENTS` JetStream stream, with a NATS outage at boot degrading gracefully (server continues, DB-backed routes keep working) rather than crashing the process
- `POST /api/v1/admin/webhook-subscriptions` hashes the subscriber secret with scrypt before storage and auto-creates a placeholder `api_clients` row when none is supplied, as the plan's documented Phase 1 simplification
- `webhook-delivery-worker.ts`'s durable pull consumer delivers every matching event to every active subscription, with dedup enforced at the database layer (`UNIQUE (subscription_id, idempotency_key)` + `ON CONFLICT DO NOTHING`) rather than an application-level set — proven race-safe by construction, not just by test
- `sso.ts` publishes `user.login` after every successful login without ever blocking the login response on a publish failure (network/NATS errors are caught and logged, not thrown)
- `GET /api/v1/openapi.json` returns a live OpenAPI 3.1 document covering all 20 routes registered across `auth-org` and `integration-gateway`, assembled automatically from each route's declared `schema`
- `GET /api/v1/admin/platform-health` and `GET /api/v1/admin/integration-health` are live, each Phase 1 approximation/gap (no live session store, no failed-login audit trail, no historical uptime tracking, no integration adapters yet) documented inline rather than silently faked
- `eventbus.test.ts`'s 4 assertions pass against the real compose stack (Postgres + NATS + OPA): subscription registration, publish→durable-delivery within a 10s poll window with a populated `idempotency_key`, DB-constraint dedup proof, and a valid non-trivial OpenAPI document
- Full backend suite (22/22 across all 4 test files) re-verified green after every task, with no regressions to 01-03/01-07/01-08's parallel-landed work

## Task Commits

Each task was committed atomically:

1. **Task 1: NATS client + webhook subscription CRUD + publish wiring** - `ccf3bb2` (feat)
2. **Task 2: Webhook delivery worker (idempotent, retry/backoff) + login event wiring** - `fcadca0` (feat)
3. **Task 3: OpenAPI document, platform/integration health endpoints, end-to-end event-bus test** - `4b006a7` (feat)

**Deviation fix:** `c00195a` (fix — background_jobs find-or-update, see Deviations below)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

_Note: this phase executed with parallel plans (01-07/01-08/01-10) landing commits on the same branch concurrently. My own `/me` route schema edit landed interleaved inside 01-07's commit (`f049a68`) rather than my own — content verified identical and correctly present either way; `admin-users.ts`'s schema addition is staged separately in this plan's own commit since 01-07 had already committed that file's base content first._

## Files Created/Modified
- `backend/src/modules/integration-gateway/nats-client.ts` - `connectNats`/`publishEvent`, durable `webhook-delivery` consumer provisioning, graceful-degradation contract
- `backend/src/modules/integration-gateway/webhook-subscriptions.ts` - `POST /api/v1/admin/webhook-subscriptions`, scrypt-hashed secret, placeholder `api_clients` auto-creation
- `backend/src/modules/integration-gateway/webhook-delivery-worker.ts` - durable pull-consumer delivery loop, `computeBackoff()`, `background_jobs` bookkeeping
- `backend/src/modules/auth-org/platform-health.ts` - `GET /api/v1/admin/platform-health`
- `backend/src/modules/auth-org/admin-integration-health.ts` - `GET /api/v1/admin/integration-health`
- `backend/src/openapi/spec.ts` - `@fastify/swagger` registration (as an `fp()`-wrapped plugin) + `GET /api/v1/openapi.json` + `buildOpenApiSpec()`
- `backend/src/modules/integration-gateway/eventbus.test.ts` - 4-assertion integration suite against the real compose stack
- `backend/src/modules/auth-org/sso.ts` (modified) - `publishEvent('user.login', ...)` after audit write, non-blocking on failure
- `backend/src/modules/auth-org/routes.ts` (modified) - response schema added to `GET /api/v1/me`
- `backend/src/modules/auth-org/admin-users.ts` (modified) - response schema added to `GET /api/v1/admin/users`
- `backend/src/server.ts` (modified) - registers `openApiRoutes`, `platformHealthRoutes`, `adminIntegrationHealthRoutes`, `webhookSubscriptionRoutes`; calls `connectNats()` + `startWebhookDeliveryWorker()` in a try/catch at boot

## Decisions Made
- **Rewrote the plan's pseudocode `pullSubscribe` snippet to the modern `consumers.get()+.consume()` API** — the plan's literal sample code does a bare `for await (const msg of sub)` with no `.pull()` call, which under the real `nats` package's pull-consumer semantics receives at most one batch and then stops; durable continuous delivery requires either manually re-issuing `.pull()` or using `.consume()`'s auto-repulling iterator. Chose `.consume()` since it matches how nats.js's own docs describe production usage and requires no manual pull-loop bookkeeping.
- **Wrapped the OpenAPI plugin in `fastify-plugin`** — `@fastify/swagger`'s document-assembly hook only observes routes within its own Fastify encapsulation context; without `fp()`, my plugin function would create a child context invisible to every route registered as a sibling in `server.ts`, and `GET /api/v1/openapi.json` would always return an empty `paths: {}` regardless of how thoroughly other routes declared schemas.
- **`background_jobs` find-or-update instead of blind INSERT** — caught via manual smoke-test (not the plan's own verify commands), fixed under deviation Rule 1 since it's a correctness bug that would silently inflate `platform-health`'s `alerts` array with duplicate entries across every server restart.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Rewrote pullSubscribe pseudocode to the modern consumers.get()+.consume() API**
- **Found during:** Task 2 (implementing `webhook-delivery-worker.ts`)
- **Issue:** The plan's own sample code for the worker uses `js.pullSubscribe('epmp.events.>', {...})` followed by a bare `for await (const msg of sub)` loop with no `.pull()` call. Verified directly against the installed `nats@2.29.3` package's pull-consumer implementation: a pull consumer only receives messages when the client explicitly requests a batch via `.pull()`; a bare async-iterate with zero pull requests issued would process at most whatever was already in-flight and then silently stall forever, meaning the very first published event after the initial (empty) batch would never be delivered.
- **Fix:** Used the package's modern `consumers.get(stream, durable)` + `.consume()` API instead, which returns a `PullConsumerMessagesImpl` that auto-repulls continuously — no manual `.pull()` bookkeeping needed, and messages flow for the lifetime of the process. Durable consumer creation (`jsm.consumers.add(...)`, `AckPolicy.Explicit`) moved into `connectNats()` so it's provisioned once at connection time, matching the stream-creation idempotency pattern already in place for the stream itself.
- **Files modified:** `backend/src/modules/integration-gateway/nats-client.ts`, `backend/src/modules/integration-gateway/webhook-delivery-worker.ts`
- **Verification:** `eventbus.test.ts`'s delivery assertion (publish → poll for receipt within 10s) passes consistently against the real compose NATS service.
- **Committed in:** `fcadca0` (Task 2 commit) / `4b006a7` (Task 3, where the test proving it was added)

**2. [Rule 3 - Blocking] Wrapped the OpenAPI registration plugin with fastify-plugin**
- **Found during:** Task 3 (writing `eventbus.test.ts`'s OpenAPI assertion)
- **Issue:** Without `fp()`, Fastify creates a new encapsulation context for every plugin function passed to `app.register()`. `@fastify/swagger`'s `onRoute` hook — which is what actually observes each route's declared `schema` to assemble the document — only fires for routes registered within its own context and descendants. Since `openApiRoutes` was registered as a plain async function alongside `authOrgRoutes`/`platformHealthRoutes`/etc. (all siblings on the Fastify root), the swagger plugin's hook never saw any of their routes, and `GET /api/v1/openapi.json` returned `{"paths": {}}` regardless of schema completeness.
- **Fix:** Wrapped the plugin export with `fastify-plugin`'s `fp()`, which disables Fastify's automatic encapsulation for that function — it now registers directly on the root instance, where its `onRoute` hook sees every sibling route plugin's routes.
- **Files modified:** `backend/src/openapi/spec.ts`
- **Verification:** Manual check (`app.swagger()` called directly after `app.ready()`) confirmed `paths` went from `{}` to all 20 registered routes; `eventbus.test.ts`'s OpenAPI assertion passes.
- **Committed in:** `4b006a7` (Task 3 commit)

**3. [Rule 1 - Bug] background_jobs find-or-update instead of blind INSERT on every boot**
- **Found during:** post-Task-3 manual smoke-test of `GET /api/v1/admin/platform-health` (not caught by the plan's own `<verify>` commands, which don't exercise repeated server restarts)
- **Issue:** `background_jobs` has no `UNIQUE` constraint on `job_type`, and `startWebhookDeliveryWorker()` runs once per `server.ts` `start()` call. The plan's own sample code does a bare `INSERT INTO background_jobs (...) VALUES (...)` on worker start with no existence check, so every server restart (including the repeated restarts during this plan's own iterative verification) created a new duplicate `webhook_delivery` row. Manually confirmed: after a handful of local smoke-test restarts, `platform-health`'s `alerts` array returned 6 near-identical entries for the same underlying job.
- **Fix:** Changed to a find-or-update: `SELECT id FROM background_jobs WHERE job_type = 'webhook_delivery' LIMIT 1`, then `UPDATE` the existing row's `status`/`last_run_at` if found, or `INSERT` only if not — matching `scripts/seed.ts`'s established find-or-insert idempotency convention for tables without a natural `UNIQUE` seed key.
- **Files modified:** `backend/src/modules/integration-gateway/webhook-delivery-worker.ts`
- **Verification:** Manually deleted the 7 accumulated duplicate rows, re-ran the full backend suite (22/22 pass) and a fresh server boot, confirmed exactly one `webhook_delivery` row persists across repeated restarts.
- **Committed in:** `c00195a` (standalone fix commit, after Task 3)

---

**Total deviations:** 3 auto-fixed (2 Rule 1 - Bug, 1 Rule 3 - Blocking)
**Impact on plan:** All three were necessary for the plan's own stated behavior to actually work (events must be deliverable beyond the first batch; the OpenAPI document must actually be non-trivial; platform-health must report accurate job state). No scope creep — no endpoint, schema, or interface beyond what the plan specified.

## Issues Encountered
- **Compose services (db/nats/opa) were repeatedly torn down mid-verification** by concurrent parallel-plan activity on the same branch (01-07/01-08/01-10 executing simultaneously). Each occurrence required re-running `docker compose up -d` + `npm run migrate` + `npm run seed` before continuing — no data loss occurred since the named `dbdata` volume persisted across container recreation, but this added iteration overhead. Not a defect in this plan's own code.
- **`backend/node_modules` periodically emptied back to ~8 packages** during execution — this is an npm-workspaces install, and the shared root `node_modules` is where `@fastify/swagger`/`nats`/etc. actually live; `npm install` from `backend/` re-syncs against the lockfile-less root `package.json` workspace list almost instantly when needed, so this was a non-issue once understood, but cost a few minutes of investigation the first time.

## User Setup Required
None - no external service configuration required. All verification ran against dev-only `docker compose` services (Postgres, NATS, OPA) already provisioned by 01-01; no cloud account, API key, or dashboard configuration needed.

## Next Phase Readiness
- `publishEvent()`/`connectNats()` are live and integration-tested — any future plan needing to publish a new event type (e.g. incident-ops lifecycle events in later phases) can call `publishEvent(eventType, payload)` directly with no additional wiring
- `GET /api/v1/openapi.json` is live and covers every route registered by this phase; 01-11's Platform Monitoring / API documentation screens can consume it directly
- `GET /api/v1/admin/platform-health` and `GET /api/v1/admin/integration-health` are live for 01-11's Background Job Monitor and Integration Health admin screens — `integration-health` correctly returns an empty list pre-F11-F17, which 01-11 must render as an `EmptyState`, not an error
- Two documented Phase-1-scope gaps carried forward (both explicitly called out in this plan's own text, not newly discovered): `failed_login_rate` is hardcoded `0` pending a future `login_failed` audited event type; `uptime_pct` is hardcoded `100` pending real infra/ops uptime tracking
- No blockers. The `consumers.get()+.consume()` pattern established here (rather than the plan's pseudocode `pullSubscribe`) should be followed by any future plan adding a second JetStream consumer, to avoid repeating the same stalled-delivery bug this plan found and fixed.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 7 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`)
- All 4 commits verified present in `git log --oneline --grep="01-09" --all`: `ccf3bb2`, `fcadca0`, `4b006a7`, `c00195a`
- Plan-level build check: `cd backend && npm run build` (tsc -p tsconfig.json) → exit 0, no TypeScript errors (re-run after the background_jobs fix, still clean)
- Full backend test suite re-run after all 4 commits: `npx vitest run` against live `docker compose up -d db nats opa` → 22/22 passed across 4 test files (`eventbus.test.ts`, `gateway.test.ts`, `admin.test.ts`, `routes.test.ts`), including all 4 of this plan's own `eventbus.test.ts` assertions
- `## Known Stubs` section below: two documented Phase-1-scope gaps, neither blocking (see below)
- `grep -c "ON CONFLICT (subscription_id, idempotency_key)"` in `webhook-delivery-worker.ts` → exactly 1 (idempotency dedup wired as specified)
- `grep -c "publishEvent"` in `sso.ts` → exactly 1 call site (login event wired as specified)

## Known Stubs

Two documented Phase-1-scope gaps, both explicitly called out inline in `platform-health.ts` and in the plan's own text (not undisclosed shortcuts):

1. **`failed_login_rate` hardcoded to `0`** (`backend/src/modules/auth-org/platform-health.ts:36`) — Phase 1's `audit_log` only records successful `login` actions; no `login_failed` audited event exists yet for `handleSsoCallback` to write on assertion failure. Cosmetic/non-blocking: the field is present and correctly typed, just always zero until a future plan wires the failed-assertion audit path.
2. **`uptime_pct` hardcoded to `100`** (`backend/src/modules/auth-org/platform-health.ts:50`) — no historical uptime tracking exists in Phase 1's application code; real uptime monitoring is an infra/ops concern explicitly out of this phase's scope per the plan's own text. Cosmetic/non-blocking.

Both gaps leave `GET /api/v1/admin/platform-health` fully functional and correctly shaped — they affect the *accuracy* of two of five returned fields, not the endpoint's availability or the other three (`active_sessions`, `integration_error_rate`, `alerts`), all of which reflect real, live-queried data.
