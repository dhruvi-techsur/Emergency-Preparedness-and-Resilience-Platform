---
phase: 01-platform-foundation-deployable-shell
plan: 08
subsystem: integration
tags: [fastify, scrypt, opa, federation, api-clients, record-authority, vitest, supertest]

# Dependency graph
requires:
  - phase: 01-03
    provides: "backend/src/modules/auth-org/rbac.ts (requirePermission), backend/src/modules/auth-org/audit.ts (AuditService) — this plan calls, never duplicates, that logic"
provides:
  - "backend/src/modules/integration-gateway/api-clients.ts: GET/POST /api/v1/admin/api-clients, POST .../{id}/revoke — one-time-only client_secret, scrypt-hashed at rest"
  - "backend/src/modules/integration-gateway/record-authority.ts: GET/POST /api/v1/admin/record-authority + exported checkRecordAuthority(recordType) lookup helper for future F11-F17 write-paths"
  - "backend/src/modules/integration-gateway/federation-grants.ts: GET/POST /api/v1/admin/federation-grants, POST .../{id}/revoke — server-side empty-scope rejection, synchronous OPA resync on both create and revoke"
  - "backend/src/modules/integration-gateway/opa-federation-policy.ts: syncFederationGrantsToOpa() — pushes active grant set to OPA's data document"
  - "backend/src/modules/integration-gateway/routes.ts: Fastify plugin mounting all three route files, registered in server.ts alongside auth-org and webhook-subscriptions"
affects: [01-11]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "client_secret hashing uses Node's built-in crypto.scrypt (no new dependency) with a per-secret random salt, stored as `${saltHex}:${derivedKeyHex}` — mirrors the project's existing zero-extra-dependency posture for crypto primitives (jose for JWT, pg for DB)"
    - "OPA federation-grant sync (opa-federation-policy.ts) mirrors 01-03/01-07's role-permission resync pattern: PUT the full active-set into OPA's data document synchronously, before the HTTP response, on every create/revoke — no caching window"
    - "AuditService.record()'s recordId parameter is always a UUID column value (the row's own primary key), never a natural-key string — see Deviations below for the bug this constraint caught"

key-files:
  created:
    - backend/src/modules/integration-gateway/api-clients.ts
    - backend/src/modules/integration-gateway/record-authority.ts
    - backend/src/modules/integration-gateway/federation-grants.ts
    - backend/src/modules/integration-gateway/opa-federation-policy.ts
    - backend/src/modules/integration-gateway/routes.ts
    - backend/src/modules/integration-gateway/gateway.test.ts
  modified:
    - backend/src/server.ts

key-decisions:
  - "client_secret hashed with Node's built-in crypto.scrypt (promisified) rather than adding bcrypt as a new dependency — scrypt is a well-vetted KDF already available with zero additional package.json footprint, and the plan's own action text offered scrypt as an explicit alternative to bcrypt"
  - "checkRecordAuthority() is exported as a plain async function (not a class/service) from record-authority.ts, matching the plan's exact signature — Phase 2+'s F11-F17 write-paths import it directly rather than going through a registry abstraction that doesn't exist yet"

patterns-established:
  - "Integration-gateway module's own route-mounting file (routes.ts) registers sibling route files as Fastify sub-plugins, matching auth-org's established per-module routes.ts convention"

# Metrics
duration: 22min
completed: 2026-11-16
---

# Phase 1 Plan 08: F10 Registry/Governance Endpoints (API Clients, Record Authority, Federation Grants) Summary

**Fastify `integration-gateway` module shipping F10's admin-facing governance surface: one-time-only scrypt-hashed API client secrets, an upsert-based record-authority registry with a `checkRecordAuthority()` lookup helper for future write-paths, and federation grants with server-side empty-scope rejection plus synchronous (pre-response) OPA resync on every create/revoke — closing the caching window within the same request cycle.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-11-16T03:11:00Z (approx, per concurrent-plan interleaving)
- **Completed:** 2026-11-16T03:33:35Z
- **Tasks:** 3
- **Files modified:** 6 created, 1 modified

## Accomplishments
- `POST /api/v1/admin/api-clients` returns `client_secret` plaintext exactly once, at creation; every subsequent `GET` and the DB row itself carry only `client_secret_hash` (scrypt, per-secret random salt) — proven by the gateway test's immediate create-then-list assertion
- `POST /api/v1/admin/federation-grants` rejects an empty/missing `scope.record_types` with a clean `400 FEDERATION_GRANT_SCOPE_EMPTY` server-side, before the DB's `chk_scope_not_empty` constraint is ever reached
- Revoking a federation grant synchronously calls `syncFederationGrantsToOpa()` **before** responding `204` — the gateway test proves this end-to-end by querying OPA's `/v1/data/federation_grants` endpoint directly immediately after revoke and confirming the grant is already gone, not just the database row
- `checkRecordAuthority('registered_type')` resolves the registered `authoritative_system`; `checkRecordAuthority('never_registered')` correctly defaults to `'EPMP'` — proven by direct unit-level import in the test, independent of any consuming write path (none exists yet in Phase 1, per the plan's documented scope boundary)
- All three route files mounted as a single Fastify plugin (`routes.ts`) registered in `server.ts` alongside `auth-org` and (concurrently landed) `webhook-subscriptions` — all 5 `gateway.test.ts` assertions pass against the real Postgres+OPA compose stack

## Task Commits

Each task was committed atomically:

1. **Task 1: API Clients registry (one-time secret)** - `3ce4b19` (feat)
2. **Task 2: Record Authority Registry + Federation Grants (immediate-effect revocation)** - `23cc738` (feat)
3. **Task 3: Mount routes + integration test** - `f049a68` (feat — see note below)

**Plan metadata:** (this commit, following SUMMARY.md + STATE.md)

_Note on Task 3's commit: this phase is executing with parallel plans (01-07/01-09) landing commits on the same branch concurrently. Task 3's `git add` was staged correctly (verified via `git status --short` immediately before commit), but between staging and the `git commit` call, plan 01-07's own commit (`f049a68`, "feat(01-07): mount admin routes + F8 admin console integration test") landed first and absorbed this plan's staged Task 3 changes (`gateway.test.ts`, `routes.ts`, the `record-authority.ts` bugfix, and the `server.ts` edit) alongside 01-07's own files — a git race inherent to two agents committing on the same branch within the same few seconds. All Task 3 content was verified present and correct in `f049a68` via `git show HEAD:<path>` for every file this plan created/modified, and the full gateway test suite (5/5) and backend build were re-run and re-verified passing after that commit landed._

## Files Created/Modified
- `backend/src/modules/integration-gateway/api-clients.ts` - `GET/POST /api/v1/admin/api-clients`, `POST .../{id}/revoke`; scrypt-hashed secret at rest, plaintext returned once
- `backend/src/modules/integration-gateway/record-authority.ts` - `GET/POST /api/v1/admin/record-authority` (upsert via `ON CONFLICT`); exported `checkRecordAuthority(recordType)`
- `backend/src/modules/integration-gateway/federation-grants.ts` - `GET/POST /api/v1/admin/federation-grants`, `POST .../{id}/revoke`; server-side empty-scope 400; synchronous OPA resync on create+revoke
- `backend/src/modules/integration-gateway/opa-federation-policy.ts` - `syncFederationGrantsToOpa()`: pushes the active (non-expired, non-revoked) grant set to OPA's data document
- `backend/src/modules/integration-gateway/routes.ts` - Fastify plugin mounting all three route files
- `backend/src/modules/integration-gateway/gateway.test.ts` - 5-assertion supertest integration suite against live Postgres+OPA
- `backend/src/server.ts` (modified) - registers `integrationGatewayRoutes` alongside `authOrgRoutes` and `webhookSubscriptionRoutes`

## Decisions Made
- **scrypt over bcrypt for `client_secret_hash`** — Node's built-in `crypto.scrypt` (promisified, per-secret random salt stored alongside the derived key) avoids adding a new dependency; the plan's own action text explicitly offered this as an equal alternative to bcrypt.
- **`checkRecordAuthority` ships as a standalone exported function**, not wrapped in a class/service — matches the plan's exact specified signature (`async function checkRecordAuthority(recordType: string): Promise<string>`) for direct import by Phase 2+'s F11-F17 write-paths.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed UUID type-mismatch in record-authority's audit call**
- **Found during:** Task 3 (running `gateway.test.ts` against the live compose stack)
- **Issue:** `AuditService.record(actorId, action, recordType, recordId, detail)`'s `recordId` parameter maps to `audit_log.record_id`, a `UUID` column. The initial `record-authority.ts` implementation passed the natural-key `record_type` string (e.g. `"test_type_1794799894186"`) as `recordId` — every `POST /api/v1/admin/record-authority` call 500'd with `invalid input syntax for type uuid`.
- **Fix:** Added `id` to the `INSERT ... RETURNING` clause (`RecordAuthorityDbRow` extends the public shape with `id`), and pass that row's own UUID `id` to `AuditService.record()` instead of the `record_type` string. The public response/list shapes are unaffected — they still omit `id` per `RecordAuthorityEntry`'s documented interface in `03a-api-auth-admin.md`.
- **Files modified:** `backend/src/modules/integration-gateway/record-authority.ts`
- **Verification:** `gateway.test.ts` assertions 4 and 5 (POST/GET round-trip, `checkRecordAuthority()` unit coverage) both failed with the 500 before the fix and pass cleanly after; full 5/5 suite re-confirmed passing after the fix.
- **Committed in:** `f049a68` (absorbed into 01-07's Task-3-timing commit per the race-condition note above; content verified present via `git show`)

---

**Total deviations:** 1 auto-fixed (1 Rule 1 - Bug)
**Impact on plan:** The fix was required for the plan's own Task 3 verify step (`gateway.test.ts`'s 5 assertions) to pass at all — specifically assertions 4 and 5, which directly exercise the `POST /api/v1/admin/record-authority` endpoint the bug broke. No scope creep — no endpoint, schema, or interface beyond what the plan specified; the fix only corrects which value is passed to an existing audit call.

## Issues Encountered
- **Out-of-scope `tsc --noEmit` failure in `backend/src/modules/auth-org/routes.ts`** encountered mid-execution (a `401`/`200` Fastify response-schema type mismatch), caused by plan 01-07's in-flight uncommitted work on that same file (confirmed via `git diff --stat` showing 62 insertions/10 deletions not yet committed at the time, and 01-07's own commits for its sibling admin-* files already present in `git log`). Not fixed here — out of this plan's `files_modified` scope (`backend/src/modules/integration-gateway/*.ts` only). Logged to `deferred-items.md`. Resolved itself once 01-07's own commit (`f049a68`) landed — final `npx tsc --noEmit` after that commit is clean project-wide.
- **Git race on Task 3's commit** — see the Task Commits note above. Content-verified via `git show HEAD:<path>` for every file this plan created/modified; no data loss, only a commit-message/authorship attribution artifact of concurrent parallel-plan execution on a shared branch.

## User Setup Required
None - no external service configuration required. All verification ran against dev-only `docker compose` services (Postgres, OPA) already provisioned by 01-01; no cloud account, API key, or dashboard configuration needed.

## Next Phase Readiness
- `api-clients.ts`, `record-authority.ts`, `federation-grants.ts` are live, type-checked, and integration-tested — Wave 4's Federation Grants / API Clients admin screens (01-11) can call these endpoints immediately, matching `03a-api-auth-admin.md`'s documented request/response shapes verbatim.
- `checkRecordAuthority(recordType)` is exported and ready for Phase 2+'s F11-F17 write-paths to import directly — no `409 RECORD_AUTHORITY_CONFLICT` enforcement exists yet in Phase 1 (by design; no consuming write path exists yet to trigger it).
- The API-client `revoked` flag is settable and audited, but no code path in Phase 1 authenticates an incoming request AS a registered API client (no external partner API consumer exists yet). The contract for future phases — check `revoked = false` on every request, never cache — is documented inline in `api-clients.ts`'s revoke handler for whichever Phase 2+ module builds that consuming route.
- No blockers.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 6 created files verified present on disk (`[ -f ]` check for each path in `key-files.created`)
- Both of this plan's own-commit hashes (`3ce4b19`, `23cc738`) verified present in `git log`; Task 3's content verified present in `f049a68` via `git show HEAD:<path>` for every file this plan touched (`gateway.test.ts`, `routes.ts`, `record-authority.ts`, `server.ts`) — see the Task Commits note for the git-race explanation
- Plan-level build check: `cd backend && npm run build` (tsc) → exit 0, no TypeScript errors (re-run after all concurrent commits landed)
- Integration test re-run after all concurrent commits landed: `npx vitest run src/modules/integration-gateway/gateway.test.ts` against live `docker compose up -d db opa` → 5/5 passed, including the OPA-direct-query no-caching-window assertion
- `## Known Stubs` section below: None found (`grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all 7 plan files → no matches)
- `grep -n "client_secret_hash"` → 5 matches (SECRET HASHED, NOT PLAINTEXT-STORED); `grep -c "client_secret[^_]"` → 2 (PLAINTEXT SECRET APPEARS ONLY AT CREATION, per plan's exact verify regex)

## Known Stubs

None found. Every endpoint in this plan performs real database reads/writes and real OPA HTTP calls — no hardcoded/static response bodies, no empty function bodies, no swallowed errors. The one explicitly-documented scope boundary (API-client `revoked` flag has no consuming authentication middleware yet, and `checkRecordAuthority()` has no consuming write-path yet) is not a stub — it is this plan's intentionally-scoped deliverable (the registry + lookup function), with the future call-site contract documented inline exactly as the plan itself specifies.
