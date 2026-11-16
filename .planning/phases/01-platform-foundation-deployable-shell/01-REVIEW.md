---
phase: 1
status: issues_found
blockers: 1
warnings: 2
files_reviewed: 73
files_reviewed_list:
  - .dockerignore
  - .env.example
  - Dockerfile
  - backend/keycloak/epmp-realm.json
  - backend/migrations/1700000000000_auth-org-schema.js
  - backend/migrations/1700000000001_seed-roles.js
  - backend/opa/policy.rego
  - backend/package.json
  - backend/scripts/seed.ts
  - backend/src/config/env.ts
  - backend/src/db/client.ts
  - backend/src/db/migrate-runner.ts
  - backend/src/modules/auth-org/admin-audit.ts
  - backend/src/modules/auth-org/admin-integration-health.ts
  - backend/src/modules/auth-org/admin-roles.ts
  - backend/src/modules/auth-org/admin-sso-config.ts
  - backend/src/modules/auth-org/admin-users.ts
  - backend/src/modules/auth-org/admin.test.ts
  - backend/src/modules/auth-org/audit.ts
  - backend/src/modules/auth-org/opa-client.ts
  - backend/src/modules/auth-org/platform-health.ts
  - backend/src/modules/auth-org/rbac.ts
  - backend/src/modules/auth-org/routes.test.ts
  - backend/src/modules/auth-org/routes.ts
  - backend/src/modules/auth-org/session.ts
  - backend/src/modules/auth-org/sso.ts
  - backend/src/modules/integration-gateway/api-clients.ts
  - backend/src/modules/integration-gateway/eventbus.test.ts
  - backend/src/modules/integration-gateway/federation-grants.ts
  - backend/src/modules/integration-gateway/gateway.test.ts
  - backend/src/modules/integration-gateway/nats-client.ts
  - backend/src/modules/integration-gateway/opa-federation-policy.ts
  - backend/src/modules/integration-gateway/record-authority.ts
  - backend/src/modules/integration-gateway/routes.ts
  - backend/src/modules/integration-gateway/webhook-delivery-worker.ts
  - backend/src/modules/integration-gateway/webhook-subscriptions.ts
  - backend/src/modules/platform/healthz.ts
  - backend/src/openapi/spec.ts
  - backend/src/server.ts
  - backend/src/static.ts
  - backend/tsconfig.json
  - backend/vitest.config.ts
  - docker-compose.yml
  - frontend/app/e2e/admin-platform-sso.spec.ts
  - frontend/app/e2e/admin-users-roles.spec.ts
  - frontend/app/e2e/app-shell.spec.ts
  - frontend/app/e2e/helpers/sign-in.ts
  - frontend/app/index.html
  - frontend/app/package.json
  - frontend/app/playwright.config.ts
  - frontend/app/src/app-shell/AppShell.css
  - frontend/app/src/app-shell/AppShell.tsx
  - frontend/app/src/app-shell/ThemeSwitcher.tsx
  - frontend/app/src/auth/RouteGuard.tsx
  - frontend/app/src/auth/auth-context.ts
  - frontend/app/src/auth/oidc-config.ts
  - frontend/app/src/auth/session-storage.ts
  - frontend/app/src/lib/api-client.ts
  - frontend/app/src/main.tsx
  - frontend/app/src/pages/RoleUnresolved.tsx
  - frontend/app/src/pages/SignInCallback.tsx
  - frontend/app/src/pages/admin/ApiClients.tsx
  - frontend/app/src/pages/admin/AuditLogView.tsx
  - frontend/app/src/pages/admin/FederationGrants.tsx
  - frontend/app/src/pages/admin/IntegrationHealth.tsx
  - frontend/app/src/pages/admin/PlatformMonitoring.tsx
  - frontend/app/src/pages/admin/RolesPermissions.tsx
  - frontend/app/src/pages/admin/SsoConfigForm.tsx
  - frontend/app/src/pages/admin/UserDetail.tsx
  - frontend/app/src/pages/admin/UsersList.tsx
  - frontend/app/tsconfig.json
  - frontend/app/vite.config.ts
  - frontend/design-system/src/navigation/SideNav.tsx
  - frontend/design-system/src/navigation/Breadcrumbs.tsx
  - pivota-deploy.yaml
reviewed_at: 2026-11-16T05:24:59Z
iteration: 1
---

# Phase 1 Code Review

## Contract-scan verification (c-gap)

**c-gap `GET /api/v1/auth/sso/callback` — no matching backend route declaration: FALSE POSITIVE, not a blocker.**

Read both sides directly:
- `frontend/app/src/pages/SignInCallback.tsx:58` — `fetch('/api/v1/auth/sso/callback', { method: 'POST', headers: {...}, body: JSON.stringify({ id_token: idToken }) })`
- `backend/src/modules/auth-org/routes.ts:71` — `app.post<{ Body: { id_token: string } }>('/api/v1/auth/sso/callback', async (req, reply) => {...})`

The route IS declared, same path, same method (POST), same request body shape (`{ id_token }`), and the response shape (`{ session_token, user }`) matches what `SignInCallback.tsx:69` destructures. The scanner's regex (`\.(get|post|put|patch|delete|all)\(`) cannot match through Fastify's generic type parameter (`<{ Body: ... }>`) inserted between `.post` and `(`, which is why it reported a gap that isn't real. Confirmed via `backend/src/modules/auth-org/routes.test.ts`'s own passing assertion `POST /api/v1/auth/sso/callback rejects a missing/invalid id_token with 401 SSO_AUTH_FAILED`, which exercises this exact route. No action needed.

## BLOCKERs

### B1: SSO configuration can never be created on a real (production) deployment — the Admin Console's SSO screen is permanently unusable on first boot

- **File:** `backend/src/modules/auth-org/admin-sso-config.ts:71-196`
- **Category:** bug
- **Evidence:** `admin-sso-config.ts` registers exactly three routes: `GET /api/v1/admin/sso-config` (404s via `SSO_CONFIG_NOT_FOUND` when `fetchCurrentConfig()` finds no row), `POST /api/v1/admin/sso-config/test` (dry-run reachability check only — explicitly never persists, per its own comment "this is explicitly NOT saved to the database"), and `PATCH /api/v1/admin/sso-config` (line 127-130: `const current = await fetchCurrentConfig(); if (!current) { return reply.code(404)... }` — PATCH requires an existing row and 404s if none exists). There is no `POST /api/v1/admin/sso-config` (create) route anywhere in this file or any other file in the diff.

  `backend/migrations/1700000000001_seed-roles.js` (the production-safe baseline migration, by design) inserts exactly 5 roles and 0 `sso_config` rows — its own header comment states this is deliberate: *"a real deployment's admin configures SSO via the Admin Console (S8.4) against its own agency IdP after first boot."* The only code path that ever INSERTs a `sso_config` row is `backend/scripts/seed.ts` (the dev-only fixture script, pointed at the local docker-compose Keycloak, never run in a real deployment per Dockerfile's `CMD` which only runs `migrate-runner.js` then `server.js`).

  Net effect: on a genuinely fresh production deployment (zero `sso_config` rows, exactly the DEPLOY-01 scenario this phase targets), `frontend/app/src/pages/admin/SsoConfigForm.tsx`'s `GET /api/v1/admin/sso-config` query returns 404, and the form has no code path to call a creation endpoint that doesn't exist — the admin cannot configure SSO at all, ever, through the UI this phase shipped. The documented bootstrap story in `01-13-PLAN.md`/`01-13-SUMMARY.md` ("admin configures SSO via the Admin Console after first boot") is not actually implemented; it's asserted in a comment but the corresponding create route was never built in `01-07` or any later plan.
- **Fix direction:** Add a `POST /api/v1/admin/sso-config` route that INSERTs a new row when none exists (or have the existing `PATCH` upsert via `INSERT ... ON CONFLICT` instead of requiring a pre-existing row), gated the same way (`requirePermission('admin','edit')`) and subject to the same test-before-activate server-side re-verification already implemented for the PATCH path.

## WARNINGs

### W1: "Record Authority" admin nav item links to a screen that was never built — dead navigation entry visible to every Phase 1 admin user

- **File:** `backend/src/modules/auth-org/routes.ts:48` (nav item) / `frontend/app/src/main.tsx:54-64` (route tree)
- **Evidence:** `ADMIN_NAV_ITEMS` includes `{ id: 'record-authority', label: 'Record Authority', icon: 'database', href: '/admin/record-authority' }`, which is served to every `secops_admin` user via `GET /api/v1/me/nav-config` and rendered as a clickable `SideNav` item (`frontend/design-system/src/navigation/SideNav.tsx` renders every item as a plain `<a href>`). No `<Route path="admin/record-authority" ...>` exists in `frontend/app/src/main.tsx`'s router, and no `RecordAuthority.tsx` page component exists anywhere under `frontend/app/src/pages/admin/`. Clicking this nav item renders `AppShell`'s layout with an empty `<Outlet />` (the `/*` parent route always matches) — a silent blank-content screen, not a 404 or any visible error. Unlike every other Phase 1 scope boundary in this codebase (which are consistently documented inline with an explicit "not built in Phase 1" comment — e.g. `IntegrationHealth.tsx`'s correct-empty-state documentation), this gap is undocumented anywhere in the plans, summaries, or inline comments: `01-08-SUMMARY.md` built the backend registry+lookup function and explicitly scoped out a *consuming write path* (409 enforcement), but never mentions that the admin-facing CRUD *screen* for this registry was also never built, despite the nav item for it shipping in `01-07`.
- **Fix direction:** Either add a `RecordAuthority.tsx` admin screen + route (mirroring `FederationGrants.tsx`'s GET/POST pattern against the already-complete `backend/src/modules/integration-gateway/record-authority.ts` endpoints), or remove the nav item from `ADMIN_NAV_ITEMS` until a future phase builds the screen.

### W2: Webhook delivery worker computes retry/backoff state that nothing ever consumes — failed deliveries are never actually retried, contradicting the documented "idempotent delivery with retry/backoff" claim

- **File:** `backend/src/modules/integration-gateway/webhook-delivery-worker.ts:79-142`
- **Evidence:** On every message from the JetStream pull consumer, the processing loop (lines 80-139) attempts delivery to each matching subscription; on failure it sets `webhook_deliveries.next_retry_at` (line 127, via `computeBackoff(1)`) and bumps `background_jobs.next_retry_at`/`failure_count` (via `bumpJobFailure()`, lines 144-154) — strongly implying a future retry will occur. But `msg.ack()` is called **unconditionally** at line 135, after the full per-subscription delivery loop completes, regardless of whether any or all deliveries failed. Since the consumer uses `AckPolicy.Explicit` (`nats-client.ts:32`), an unconditionally-acked message will never be redelivered by JetStream itself. No other code path in the entire backend (`grep -rn "next_retry_at"` across `backend/src`) ever reads `webhook_deliveries.next_retry_at` or `background_jobs.next_retry_at` to drive an actual re-delivery attempt — there is no scheduled job, cron, or polling loop anywhere that processes rows in a `'backoff'`/`'failed'` state. The practical effect: a webhook subscriber that is briefly down loses that event permanently after exactly one failed attempt, despite the `failure_count`/`next_retry_at` columns and the plan's/summary's explicit "retry/backoff" language suggesting otherwise. This is surfaced to the admin only as a `PlatformMonitoring` "degraded" alert (an observability signal), not as an actual recovery mechanism.
- **Fix direction:** Either implement the retry consumer (a scheduled task or a second JetStream redelivery path that re-attempts rows where `next_retry_at <= now()` and `delivery_status = 'failed'`), or only `msg.ack()` after confirming at least the primary intended behavior, and correct the plan/summary language to state this is a single-attempt delivery with failure visibility, not an actual retry mechanism, if deferring the real retry loop to a later phase.

## Cross-file seams checked

- `frontend/app/src/pages/SignInCallback.tsx` → `backend/src/modules/auth-org/routes.ts` (`POST /api/v1/auth/sso/callback`): OK (scanner false positive, confirmed real and matching, see above)
- `frontend/app/src/auth/RouteGuard.tsx` → `GET /api/v1/me`: OK — response shape matches `auth-context.ts`'s `EpmpUser` interface and `routes.ts`'s JSON schema exactly
- `frontend/app/src/app-shell/ThemeSwitcher.tsx` → `PATCH /api/v1/me/preferences`: OK — body/response shape matches
- `frontend/app/src/app-shell/AppShell.tsx` → `GET /api/v1/me/nav-config`: OK in shape, but see W1 — one nav item (`record-authority`) has no frontend route to land on
- `frontend/app/src/pages/admin/UsersList.tsx` / `UserDetail.tsx` → `backend/src/modules/auth-org/admin-users.ts` (GET/POST/PATCH `/api/v1/admin/users`): OK — request/response shapes match on all three verbs
- `frontend/app/src/pages/admin/RolesPermissions.tsx` → `backend/src/modules/auth-org/admin-roles.ts` (GET/PATCH `/api/v1/admin/roles`): OK
- `frontend/app/src/pages/admin/AuditLogView.tsx` → `backend/src/modules/auth-org/admin-audit.ts` (GET `/api/v1/admin/audit-log`): OK — `ACTION_TYPE_OPTIONS` reconciled against every actual `AuditService.record(...)` call site in the backend; all 13 action strings match exactly
- `frontend/app/src/pages/admin/SsoConfigForm.tsx` → `backend/src/modules/auth-org/admin-sso-config.ts`: integration shape matches for GET/test/PATCH, but see **B1** — PATCH-only, no create path, so this entire integration is unreachable on a fresh deployment
- `frontend/app/src/pages/admin/ApiClients.tsx` → `backend/src/modules/integration-gateway/api-clients.ts` (GET/POST/revoke `/api/v1/admin/api-clients`): OK — one-time-secret contract matches on both sides
- `frontend/app/src/pages/admin/FederationGrants.tsx` → `backend/src/modules/integration-gateway/federation-grants.ts` (GET/POST/revoke `/api/v1/admin/federation-grants`): OK
- `frontend/app/src/pages/admin/IntegrationHealth.tsx` → `backend/src/modules/auth-org/admin-integration-health.ts` (GET `/api/v1/admin/integration-health`): OK
- `frontend/app/src/pages/admin/PlatformMonitoring.tsx` → `backend/src/modules/auth-org/platform-health.ts` (GET `/api/v1/admin/platform-health`): OK — all 4 Stat fields present; hardcoded `uptime_pct`/`failed_login_rate` stubs are explicitly disclosed inline on both sides (not a seam defect)
- `backend/src/modules/auth-org/rbac.ts` (`requirePermission`) ↔ every admin/platform route's `preHandler`: OK — consistent usage across all 13+ call sites checked
- `backend/src/modules/auth-org/opa-client.ts` (`syncRolePermissionsToOpa`) ↔ `backend/src/modules/auth-org/admin-roles.ts` PATCH handler: OK, synchronous pre-response resync confirmed
- `backend/src/modules/integration-gateway/opa-federation-policy.ts` (`syncFederationGrantsToOpa`) ↔ `federation-grants.ts` create/revoke handlers: OK
- `backend/src/server.ts` boot sequence (NATS/OPA/DB all optional) ↔ `backend/src/modules/platform/healthz.ts`: OK — `/healthz` has no dependency on any backing service, confirmed by direct read
- `Dockerfile` CMD (`migrate-runner.js && server.js`) ↔ `backend/src/db/migrate-runner.ts`'s graceful no-DATABASE_URL exit-0 path: OK
- `backend/opa/policy.rego` (`data.role_permissions[role_id][feature]`) ↔ `opa-client.ts`'s `PUT /v1/data/role_permissions` shape: OK — grouping shape matches exactly
