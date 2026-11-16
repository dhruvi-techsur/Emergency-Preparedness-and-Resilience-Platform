---
phase: 01-platform-foundation-deployable-shell
plan: 01
subsystem: database
tags: [postgres, postgis, node-pg-migrate, nats-jetstream, opa, keycloak, docker-compose, fastify]

# Dependency graph
requires: []
provides:
  - "docker-compose.yml dev stack: Postgres+PostGIS, NATS JetStream, OPA, Keycloak — all with healthchecks, all reachable fresh within ~25s"
  - "Full auth-org schema (15 tables) migrated verbatim from TechArch 02a-data-auth-org.md via node-pg-migrate"
  - "backend/src/db/client.ts: pg Pool wrapper (pool, query<T>()) every later backend plan imports"
  - "Idempotent seed script producing 5 persona roles, 1 default jurisdiction, 1 admin user, sso_config stub, record_authority_registry baseline rows"
  - "backend/opa/policy.rego: epmp.authz default-deny policy evaluating role_permissions"
  - "backend/keycloak/epmp-realm.json: realm epmp with public PKCE client, test user, groups claim mapper"
  - "backend/package.json + tsconfig.json: npm workspace package scaffold for all future backend plans"
affects: [01-02, 01-03, 01-04, 01-05, 01-06, 01-07, 01-08, 01-09, 01-10, 01-11, 01-12, 01-13]

# Tech tracking
tech-stack:
  added: [fastify@5, pg, jose, nats@2.28, node-pg-migrate@9, pino, tsx, typescript, concurrently]
  patterns:
    - "node-pg-migrate JS migrations: pgm.sql(...) with raw verbatim DDL rather than the DSL builder, to guarantee byte-for-byte match with TechArch's spec"
    - "Seed idempotency via application-level find-or-insert (SELECT then INSERT) rather than ON CONFLICT, because several auth-org tables (jurisdictions, sso_config) have no UNIQUE constraint on their natural key per TechArch's exact DDL"
    - "audit_log immutability via BEFORE UPDATE/DELETE trigger (not GRANT/REVOKE) — required because DEPLOY-01 gives the app exactly one DATABASE_URL role, which must also run migrations"

key-files:
  created:
    - package.json
    - docker-compose.yml
    - .env.example
    - backend/package.json
    - backend/tsconfig.json
    - backend/src/config/env.ts
    - backend/src/db/client.ts
    - backend/migrations/1700000000000_auth-org-schema.js
    - backend/scripts/seed.ts
    - backend/opa/policy.rego
    - backend/keycloak/epmp-realm.json
  modified: []

key-decisions:
  - "audit_log immutability implemented as a BEFORE UPDATE/DELETE trigger raising an exception, not TechArch's literal REVOKE UPDATE/DELETE FROM app_runtime — DEPLOY-01's single-DATABASE_URL contract means the app has exactly one DB role, which must also run DDL, so a separate low-privilege role to revoke from doesn't exist in the deployed environment. The trigger gives the same caller-independent guarantee."
  - "OPA image pinned to openpolicyagent/opa:0.68.0-debug instead of the plain 0.68.0 tag — the default tag is a Chainguard static base with no shell and no wget/curl, so its own Docker healthcheck could never succeed regardless of policy correctness"
  - "Seed idempotency implemented as explicit SELECT-then-INSERT (find-or-insert) rather than INSERT...ON CONFLICT — several seeded tables (jurisdictions, sso_config) have no UNIQUE constraint on the columns the seed treats as a natural key, and the migration's DDL must match TechArch verbatim rather than gain constraints TechArch didn't specify"

patterns-established:
  - "Backend workspace package scripts: dev (tsx watch), migrate (node-pg-migrate), seed (tsx scripts/seed.ts), build (tsc), start (node dist) — every later backend plan extends src/ under this same package"
  - "docker-compose healthcheck discipline: every service must have a healthcheck that can actually execute inside that specific image (verify the image ships the tool the healthcheck invokes, not just that the tool exists generically)"

# Metrics
duration: 25min
completed: 2026-11-16
---

# Phase 1 Plan 01: Data Foundation & Backing Services Summary

**Full auth-org Postgres schema (15 tables, append-only audit_log trigger) migrated via node-pg-migrate, idempotent seed script, OPA default-deny policy, and a Keycloak realm import — all four docker-compose services (Postgres+PostGIS, NATS JetStream, OPA, Keycloak) verified healthy from a completely fresh volume.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-16T02:48:00Z (approx, session start)
- **Completed:** 2026-11-16T03:00:08Z
- **Tasks:** 3
- **Files modified:** 11 created

## Accomplishments
- `docker compose up -d db nats opa keycloak` on a completely fresh volume brings all four services to `healthy` within ~25 seconds
- `npm run migrate` creates all 15 auth-org tables with TechArch's exact DDL (verbatim column names, types, constraints, indexes)
- `audit_log` is provably append-only: a `BEFORE UPDATE OR DELETE` trigger raises `audit_log is append-only: % not permitted` for both UPDATE and DELETE on any populated row, regardless of DB role
- `npm run seed` run twice leaves exactly 1 jurisdiction, 5 roles, 6 role_permissions rows, 1 user, 1 sso_config row, 2 record_authority_registry rows — zero duplicates on the second run
- Keycloak's realm-import makes the `epmp` realm's OIDC discovery document live at `/realms/epmp/.well-known/openid-configuration` with no manual console configuration
- `backend/opa/policy.rego` loads and OPA reports `healthy` with the real policy file (not a placeholder) mounted

## Task Commits

Each task was committed atomically:

1. **Task 1: docker-compose dev stack + repo/package scaffold** - `e4c633f` (feat)
2. **Task 2: Auth-org schema migration (exact TechArch DDL)** - `72676d6` (feat)
3. **Task 3: Idempotent seed script, OPA policy, Keycloak realm import** - `e35bf73` (feat)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

## Files Created/Modified
- `package.json` - npm workspaces root (backend, frontend, frontend/design-system), `dev` script bringing up compose + concurrently running both app dev servers
- `docker-compose.yml` - db (postgis/postgis:16-3.4-alpine), nats (nats:2.10-alpine with JetStream + monitoring), opa (openpolicyagent/opa:0.68.0-debug), keycloak (quay.io/keycloak/keycloak:25.0), all with healthchecks
- `.env.example` - empty-valued config keys: DATABASE_URL, NATS_URL, OPA_URL, KEYCLOAK_ISSUER, KEYCLOAK_CLIENT_ID, SESSION_JWT_SECRET, PORT
- `backend/package.json` - `@epmp/backend`: fastify, pg, jose, nats, node-pg-migrate, pino deps; dev/migrate/seed/build/start scripts
- `backend/tsconfig.json` - ES2022/NodeNext/strict, outDir dist
- `backend/src/config/env.ts` - typed `loadEnv()`, nothing throws at import time
- `backend/src/db/client.ts` - `pool` + `query<T>()` exports every later plan imports
- `backend/migrations/1700000000000_auth-org-schema.js` - all 15 auth-org tables + indexes + `trg_audit_log_immutable` trigger, verbatim from TechArch 02a
- `backend/scripts/seed.ts` - idempotent find-or-insert seed for jurisdictions, roles, role_permissions, users, sso_config, record_authority_registry
- `backend/opa/policy.rego` - `epmp.authz` package, default-deny, `role_permissions`-driven allow rule
- `backend/keycloak/epmp-realm.json` - realm `epmp`, public PKCE client `epmp-app`, `/epmp-admins` group, one seeded test user, groups-claim protocol mapper

## Decisions Made
- **audit_log immutability via trigger, not REVOKE** — TechArch specifies `REVOKE UPDATE, DELETE ON audit_log FROM app_runtime`, but DEPLOY-01 (this platform's deployment contract) gives the app a single `DATABASE_URL` role that must also run DDL/migrations, so no separate low-privilege runtime role exists to revoke from. A `BEFORE UPDATE OR DELETE` trigger that unconditionally raises gives the identical "enforced at the data layer regardless of caller" guarantee without needing privilege separation across two roles. This was already documented in the plan itself as an anticipated deviation, not discovered during execution.
- **OPA image tag changed to `0.68.0-debug`** — discovered during Task 1/3 verification that the plan's specified `openpolicyagent/opa:0.68.0` tag is built on a Chainguard static base with no shell, `wget`, or `curl` at all, so the plan's own `wget`-based healthcheck could never pass no matter how correct the policy was. Switched to the `-debug` variant of the same pinned version, which ships a minimal shell + wget.
- **Seed idempotency via find-or-insert, not ON CONFLICT** — attempted `INSERT ... ON CONFLICT` per the plan's suggested approach first; it failed with `there is no unique or exclusion constraint matching the ON CONFLICT specification` because `jurisdictions` has no `UNIQUE(name, type)` and `sso_config` has no `UNIQUE(protocol)` in TechArch's verbatim DDL. Rewrote as an explicit `SELECT` (by the seed's natural key) followed by `INSERT` only on a miss — idempotent without requiring schema changes TechArch doesn't specify.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] OPA image swapped from `openpolicyagent/opa:0.68.0` to `openpolicyagent/opa:0.68.0-debug`**
- **Found during:** Task 1/3 verification (`docker compose up -d ... opa` health check)
- **Issue:** The plan's specified tag is a Chainguard static image with no `/bin/sh`, `wget`, or `curl` — the plan's own healthcheck (`wget -qO- http://localhost:8181/health`) could never execute inside that container, so OPA would never report `healthy` regardless of policy correctness
- **Fix:** Changed the image tag to `openpolicyagent/opa:0.68.0-debug` (same pinned OPA version, debug variant ships a minimal shell + wget) in `docker-compose.yml`
- **Files modified:** docker-compose.yml
- **Verification:** `docker compose ps` shows `opa` reaching `healthy` within the healthcheck window on a fresh volume
- **Committed in:** e35bf73 (Task 3 commit)

**2. [Rule 1 - Bug] NATS command needs explicit monitoring port flag**
- **Found during:** Task 1 verification (`docker compose up -d ... nats` health check)
- **Issue:** The plan's `command: ["-js"]` starts JetStream but never starts an HTTP listener at all — `/healthz` on port 8222 was refusing connections, so the plan's own healthcheck could never pass
- **Fix:** Changed command to `["-js", "-m", "8222"]`, which enables the HTTP monitoring endpoint (including `/healthz`) on port 8222
- **Files modified:** docker-compose.yml
- **Verification:** `docker compose ps` shows `nats` reaching `healthy`
- **Committed in:** e35bf73 (Task 3 commit)

**3. [Rule 1 - Bug] OPA policy needs `import future.keywords.in`**
- **Found during:** Task 3 verification
- **Issue:** The plan's `policy.rego` uses `some rp in input.role_permissions` without importing the `in` keyword. OPA 0.68 rejects this with a parse error and the OPA process exits immediately (container state `Exited (1)`), so the service never starts at all
- **Fix:** Added `import future.keywords.in` at the top of `backend/opa/policy.rego`
- **Files modified:** backend/opa/policy.rego
- **Verification:** `docker compose logs opa` shows the server starting and `/health` returning `{}` (200 OK)
- **Committed in:** e35bf73 (Task 3 commit)

**4. [Rule 1 - Bug] Seed idempotency rewritten from `ON CONFLICT` to find-or-insert**
- **Found during:** Task 3 verification (first seed run)
- **Issue:** `INSERT ... ON CONFLICT (name, type) DO UPDATE` against `jurisdictions`, and `ON CONFLICT (protocol)` against `sso_config`, both failed with Postgres error `42P10: there is no unique or exclusion constraint matching the ON CONFLICT specification` — those tables have no UNIQUE constraint on those columns in TechArch's verbatim DDL (only `roles.name`, `users.email`, `role_permissions(role_id,feature)`, and `record_authority_registry.record_type` are genuinely UNIQUE)
- **Fix:** Rewrote `upsert()` as `findOrInsert()`: `SELECT id FROM <table> WHERE <natural key cols> = ...` first, `INSERT` only if no row is found. Idempotent by construction regardless of whether the table declares a UNIQUE constraint, and requires no schema change beyond TechArch's spec
- **Files modified:** backend/scripts/seed.ts
- **Verification:** `npm run seed` run twice on a fresh volume: first run inserts 1/5/6/1/1/2 rows per table; second run inserts 0 rows everywhere, confirming idempotency
- **Committed in:** e35bf73 (Task 3 commit)

---

**Total deviations:** 4 auto-fixed (all Rule 1 - Bug: three container/healthcheck configuration bugs discovered during the plan's own verification steps, one seed idempotency mechanism bug)
**Impact on plan:** All four fixes were required for the plan's own stated verification steps to pass at all — none are scope creep. The schema DDL itself needed zero changes; every fix was in compose configuration, the OPA policy's syntax, or the seed script's SQL strategy. No TechArch DDL column, type, or constraint was altered.

## Issues Encountered
None beyond the four auto-fixed deviations above — each surfaced directly from running the plan's own `<verify>` commands and was resolved within the deviation rules before moving to the next task.

## User Setup Required
None - no external service configuration required. All services (Postgres, NATS, OPA, Keycloak) are dev-only backing services declared in this repo's own `docker-compose.yml`; no cloud account, API key, or dashboard configuration is needed to run this plan's verification.

## Next Phase Readiness
- Every Wave 2 backend plan in this phase can now `docker compose up -d db nats opa keycloak`, `npm run migrate`, `npm run seed` and get a fully migrated, seeded, policy-loaded, SSO-realm-ready environment to build against
- `backend/src/db/client.ts`'s `pool`/`query<T>()` contract is live and typechecks clean — later plans can import it immediately
- No blockers. `role_landing_config` table exists but is intentionally unpopulated per the plan's own scope note (F18/Phase 6 territory) — later Phase 1 plans should continue deriving nav from `role_permissions` directly, not `role_landing_config`

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 11 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`)
- All 3 task commits verified present in `git log` (`e4c633f`, `72676d6`, `e35bf73`)
- Plan-level build check: `cd backend && npm run build` (tsc) → exit 0, no TypeScript errors
- `## Known Stubs` section below: None found (one false-positive grep hit on the variable name `placeholders` in seed.ts, not an actual TODO/stub marker)
- Fresh-volume end-to-end re-verification: all 4 compose services healthy, migration + seed x2 idempotent, audit_log trigger enforced, Keycloak OIDC discovery reachable — all plan `<verify>` commands re-run and passed after the Rule 1 fixes above, not just claimed

## Known Stubs

None found. Every artifact (compose stack, migration, seed script, OPA policy, Keycloak realm) is fully functional and was verified end-to-end against the plan's own `<verify>` commands on a completely fresh Docker volume — no hardcoded/static responses, no empty function bodies, no TODO/FIXME/placeholder markers.
