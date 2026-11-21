---
status: diagnosed
trigger: "phase9-deploy-check-d4-crash: DEPLOY-01 D4 cold-boot-only-PORT-set scenario crashes with exit code 1 instead of staying up and answering /healthz"
created: 2026-11-21T00:00:00Z
updated: 2026-11-21T00:10:00Z
---

## Current Focus

hypothesis: CONFIRMED - document-adapter.ts's documentRoutes() calls recordDocumentHealth() unconditionally and unguarded at route-registration time; recordDocumentHealth() runs a bare `query()` call with zero try/catch; with no DATABASE_URL, this throws ECONNREFUSED which propagates uncaught through app.register(integrationGatewayRoutes) and crashes the Fastify process before /healthz can bind.
test: Grepped every route-registration function (`export async function *Routes`/`export default async function`) across the entire backend/src tree for top-level (2-space-indent, non-handler-closure) `await` statements that touch the DB, to confirm this is the ONLY such unguarded call site.
expecting: If this is the SOLE cause, no other registration-time `await` in any module should touch `query()`/DB/network without a try/catch or without being safely isolated inside a request-handler closure (which only runs per-request, after /healthz already bound).
next_action: none — diagnosis complete, handed off for fix (find_root_cause_only mode, no fix applied)

## Symptoms

expected: A cold container started the way the deployer starts it (only PORT env var set) comes up and answers its health check (GET /healthz -> 200), the same graceful-degradation posture every other missing-dependency path in this codebase already follows (OPA sync failure, NATS connection failure, and every scheduler-start failure are all caught and logged as warnings, never crash the server).
actual: Container exits with code 1 almost immediately. Backend log shows the OPA-sync and NATS-connect failures at startup are correctly caught and logged as warnings, but then an UNCAUGHT rejection crashes the process before /healthz can ever bind.
errors: |
  {"level":40,...,"msg":"OPA role_permissions sync failed at startup — authorization checks will fail closed until the next admin role edit"}
  {"level":40,...,"msg":"NATS connection failed at startup — event bus disabled, server continues"}
  {"level":50,...,"err":{"type":"AggregateError","message":"","stack":"AggregateError [ECONNREFUSED]: \n    at /app/backend/node_modules/pg-pool/index.js:45:11\n    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)\n    at async query (file:///app/backend/dist/db/client.js:4:20)\n    at async recordDocumentHealth (file:///app/backend/dist/modules/integration-gateway/document-adapter.js:335:5)\n    at async documentRoutes (file:///app/backend/dist/modules/integration-gateway/document-adapter.js:400:9)","aggregateErrors":[{"type":"Error","message":"connect ECONNREFUSED ::1:5432",...},{"type":"Error","message":"connect ECONNREFUSED 127.0.0.1:5432",...}],"code":"ECONNREFUSED"},"msg":""}
reproduction: |
  cd /home/daytona/project
  node "/home/daytona/.config/opencode/pivota_spec-framework/bin/pivota-deploy-check.cjs" --dir . --no-trivy
  (Reproduced twice already by the verify-work self_check this session — deterministic, not a flake.)
started: Discovered during Phase 9 (alerting-identity-integrations) UAT re-verify round, self_check's deploy_check sub-step (2026-11-21). Not previously caught by phases 1-8 (no prior deploy_check FAIL found anywhere in .planning/phases/*/*.md history for this project).

## Eliminated

- hypothesis: "Some other registration-time DB/network call elsewhere in the route tree could also throw uncaught under no-DATABASE_URL, making document-adapter.ts one of several landmines rather than the sole cause."
  evidence: |
    Scanned every file in backend/src for `export async function *Routes(...)` and `export default async function(...)` signatures (the route-registration-plugin shape Fastify's app.register() invokes). For each, grepped for top-level (2-space indented, i.e. directly in the plugin body, NOT inside a request-handler closure) `await` statements.

    Across integration-gateway/routes.ts, incident-ops/routes.ts, plans/routes.ts, auth-org/routes.ts, ai-assist/routes.ts, comms-reporting/routes.ts, and the directly-server.ts-registered files (openapi/spec.ts, static.ts, platform/healthz.ts, auth-org/platform-health.ts, auth-org/admin-integration-health.ts, integration-gateway/webhook-subscriptions.ts), every top-level await inside a routes-plugin body is either:
      (a) `await app.register(childPlugin)` — a plugin-chain call, not a DB/network call, or
      (b) `await app.register(fastifyStatic, {...})` / `await app.register(multipart)` — third-party plugin registration, same category.

    The ONLY DB-touching call found directly in a route-registration body (not wrapped in a request handler, not wrapped in try/catch) across the ENTIRE backend/src tree is document-adapter.ts:529's `await recordDocumentHealth('online')` inside `documentRoutes()`.

    Every sibling adapter's `record*Health('online')` call (cad, eoc-cots, facility, hazard-feed, hris-roster, notification-provider, gis) is called ONLY from inside functions that are themselves invoked from either (1) a scheduler's setInterval callback (wrapped in `.catch()`), or (2) checkGisHealth() (explicitly try/catch-wrapped), or (3) a per-request handler closure (only runs after /healthz has already bound, and in most cases wrapped in its own try/catch mapping to an HTTP error response, e.g. eoc-cots-adapter.ts's exchange-records GET route).
  timestamp: 2026-11-21T00:08:00Z

## Evidence

- timestamp: 2026-11-21T00:01:00Z
  checked: backend/src/modules/integration-gateway/document-adapter.ts lines 432-543
  found: |
    `recordDocumentHealth(status)` (line 441-453) runs a single bare `await query(...)` UPSERT with NO try/catch of its own.
    `documentRoutes(app)` (line 458-543), the plugin function Fastify's `app.register(documentRoutes)` invokes, contains at lines 527-530:
      if (!documentHealthRecorded) {
        documentHealthRecorded = true;
        await recordDocumentHealth('online');
      }
    This call sits directly in the plugin-registration body, guarded only by the in-memory `documentHealthRecorded` boolean flag (prevents double-execution on hot reload), NOT by any try/catch. It is NOT inside a request-handler closure — it runs synchronously (in promise-chain terms) as part of `app.register()` resolving, i.e. during server startup, before any route (including /healthz) has finished binding.
  implication: This is the single unguarded registration-time DB call responsible for the crash — matches the observed stack trace exactly (`recordDocumentHealth` <- `documentRoutes`).

- timestamp: 2026-11-21T00:02:00Z
  checked: backend/src/modules/integration-gateway/routes.ts (the integrationGatewayRoutes plugin that documentRoutes is registered into) and backend/src/server.ts (lines 61, 82-192)
  found: |
    routes.ts line 40: `await app.register(documentRoutes);` — standard Fastify plugin registration, no try/catch around it (none of the sibling `app.register(...)` lines in this file have one either — this is consistent with Fastify's own convention that register() itself should not throw for a well-formed plugin; the expectation is that the PLUGIN BODY internally handles its own fallible operations, exactly as every scheduler-start block in server.ts's `start()` function does with its own explicit try/catch).
    server.ts line 61: `app.register(integrationGatewayRoutes);` — not awaited at this call site, not wrapped in try/catch (Fastify's register() returns the app instance synchronously for chaining; the actual plugin body executes asynchronously and Fastify awaits full encapsulation resolution internally before `app.listen()` can complete, which is why a late-rejecting promise deep in this chain still prevents the server from ever finishing its boot sequence and crashes the process via unhandled rejection).
    server.ts lines 82-192 (`start()`): establishes this codebase's own explicit, stated convention — "a failure here must never crash the server" — applied via try/catch to the OPA sync (98-103), NATS connect (110-115), and EVERY SINGLE scheduler-start call (123-182, eight separate try/catch blocks, one per scheduler, each with its own matching log.warn message). `startDocumentLinkSyncScheduler()` itself (the scheduler counterpart to documentRoutes, called from server.ts:162 inside its own try/catch at lines 161-165) is correctly guarded. It is ONLY the route-registration-time call inside documentRoutes() (not a scheduler call, not something server.ts's start() function even sees directly — it's nested two levels down inside `app.register(integrationGatewayRoutes)` -> `app.register(documentRoutes)`) that has NO equivalent guard anywhere in the chain.
  implication: The codebase has an explicit, consistently-applied graceful-degradation convention for exactly this class of failure (external-dependency-unavailable-at-cold-boot) everywhere EXCEPT this one call site. This confirms the fix should follow the SAME established pattern (try/catch + log.warn, never throw) rather than introduce a new pattern.

- timestamp: 2026-11-21T00:03:00Z
  checked: backend/src/db/client.ts
  found: |
    `export const pool = new Pool({ connectionString: process.env.DATABASE_URL });` — pool is constructed at MODULE IMPORT time (top-level), not lazily. With DATABASE_URL unset, `new Pool({ connectionString: undefined })` does NOT throw by itself (pg falls back to default host/port env vars or localhost:5432) — the connection attempt and resulting ECONNREFUSED only happens when `.query()` is actually called. This confirms the crash is NOT from pool construction/import, but specifically from the first `query()` call that executes before any later component gets a chance to catch it — i.e., exactly the first unguarded `await query(...)` reached during the registration chain, which is recordDocumentHealth's call.
  implication: Rules out an alternative hypothesis that the Pool constructor itself might be throwing at import time (which would implicate a different, un-fixable-via-try/catch-at-call-site problem). The failure genuinely originates from the unguarded call, not from module-load-time pool construction.

- timestamp: 2026-11-21T00:05:00Z
  checked: Every sibling adapter in integration-gateway/ (cad-adapter.ts, eoc-cots-adapter.ts, facility-adapter.ts, hazard-feed-adapter.ts, hris-roster-adapter.ts, notification-provider-adapter.ts, gis-adapter.ts) for their own `*Routes(app)` plugin-registration function bodies
  found: |
    None of these sibling adapters call their own `record*Health()` function directly/unconditionally from inside their `*Routes(app)` registration body. Each `record*Health()` call only happens:
      - from inside a request-handler closure (executes per-HTTP-request, long after /healthz has bound, e.g. eocCotsRoutes's exchange-records GET handler wraps its call to fetchExchangeRecords/checkRecordAuthority in try/catch mapping to a 401 response), or
      - from inside the module's own scheduler function (e.g. runFacilitySync, runHazardFeedIngestion, runCadIngestion), which is only ever invoked via server.ts's try/catch-wrapped `startXxxScheduler()` call OR via a setInterval callback with its own `.catch(err => console.error(...))`.
    gis-adapter.ts's `checkGisHealth()` (the closest analog to document-adapter's "write one health row at startup" pattern) is explicitly wrapped in its own internal try/catch (lines 89-94) specifically BECAUSE it's meant to be callable at startup/on-demand without risk.
    document-adapter.ts is structurally unique: it is the ONLY adapter that performs its one-time "stamp an initial health row" write directly and unconditionally inside the Fastify plugin-registration body itself, with no try/catch anywhere in that specific call chain (documentRoutes -> recordDocumentHealth -> query).
  implication: Confirms document-adapter.ts is architecturally the ONE outlier relative to the codebase's own established convention — every other adapter either defers the DB touch to request-time or to a guarded scheduler, while this one does it unconditionally at registration time with zero protection.

- timestamp: 2026-11-21T00:07:00Z
  checked: Searched entire backend/src for setErrorHandler/onError/uncaughtException/unhandledRejection global handlers
  found: No results — no global error handler of any kind exists anywhere in the backend.
  implication: Confirms nothing intercepts the throw from recordDocumentHealth before it becomes a fatal unhandled rejection crashing the Node process — the stack trace and exit-code-1 behavior are the direct, sole consequence of the unguarded call, with no competing or additional failure path.

## Resolution

root_cause: |
  backend/src/modules/integration-gateway/document-adapter.ts:527-530 — documentRoutes()'s plugin-registration body calls `await recordDocumentHealth('online')` unconditionally (guarded only by the in-memory `documentHealthRecorded` flag, never by a try/catch), and recordDocumentHealth() (line 441-453) runs a bare `await query(...)` UPSERT with no try/catch of its own. With DATABASE_URL unset (the DEPLOY-01 D4 cold-boot contract), query() throws ECONNREFUSED. This propagates uncaught through documentRoutes() -> integrationGatewayRoutes's `app.register(documentRoutes)` -> server.ts:61's `app.register(integrationGatewayRoutes)`, crashing the Fastify process via unhandled rejection (exit code 1) before app.listen() / the /healthz route can ever bind.

  CONFIRMED AS THE SOLE CAUSE: an exhaustive scan of every route-registration-plugin function in the entire backend/src tree found this to be the ONLY top-level (non-request-handler, non-try/catch-wrapped) DB/network call in any `app.register()`-invoked plugin body anywhere in the codebase. No second landmine of the same shape exists elsewhere in the request chain that a fix here would leave unaddressed.

fix: "NOT APPLIED — find_root_cause_only mode. See Suggested Fix Direction below for the minimally-scoped recommendation."
verification: ""
files_changed: []
