# Security Report — Phase 8: Record Authority & Sync Integrations

**Mode:** retroactive (confirmation re-audit after bounded fix round #899 step 3b)
**Audited:** 2026-11-20 (confirmation audit — supersedes the 2026-11-20 re-audit that opened F-08-01)
**Verdict:** SECURED
**Confirmed HIGH/CRITICAL:** 0

## Summary

This audit independently re-verifies the fixer's claim (commits `a5230d4`, `9820718`) that F-08-01 — the `linkDocument()` `plan_id` jurisdiction-scope IDOR — is closed. Scope was restricted, per the task's mode hint, to the three files the fix touched: `backend/src/modules/integration-gateway/document-adapter.ts`, `backend/scripts/seed.ts`, `backend/src/modules/integration-gateway/facility-document-adapter.test.ts`. The fixer's own verification claims were **not trusted** — every claim was independently reproduced:

- **Commit scope confirmed via `git show --stat a5230d4`**: exactly `backend/scripts/seed.ts` (+2/-2), `document-adapter.ts` (+54/-? lines), `facility-document-adapter.test.ts` (+76 lines) — matches the claimed scope exactly, no surprise files touched. `9820718` touches only `08-SECURITY.md` (docs).
- **Structural fix read in full** (`document-adapter.ts:146-207`): a new private `planIsInScope(planId, jurisdictionScope)` helper (`:158-164`) runs `SELECT id FROM plans WHERE id = $1 AND jurisdiction_id = ANY($2)` — the identical scoping clause `plans.ts`'s `fetchPlanRow` uses (`plans.ts:89`, confirmed by direct read). `linkDocument()` (`:178-207`) now takes an optional 4th `jurisdictionScope?: string[]` param; when `planId` is truthy, it calls `planIsInScope` and throws `Error('PLAN_NOT_FOUND')` BEFORE the `INSERT INTO document_links` at `:199-204` if out-of-scope — the throw is unconditionally reached ahead of the INSERT (no early return, no swallowed exception, `await`ed correctly).
- **Fail-closed, not fail-open, on missing scope**: `jurisdictionScope ? await planIsInScope(...) : false` (`:190`) — if `jurisdictionScope` is `undefined` (only possible via a direct internal call, never via the route — see below), `inScope` evaluates to `false`, which **throws** `PLAN_NOT_FOUND`, blocking the link. This is the opposite of fail-open. Independently confirmed the Postgres-level edge case too: a live query with an **empty** `jurisdiction_scope = ANY('{}')` array against a real plan row returns zero rows (verified directly against the running Postgres instance), so an empty-array edge case also fails closed.
- **Sole caller confirmed**: `grep -rn "linkDocument(" src/ scripts/` across the whole backend shows exactly two non-test call sites: the route handler (`document-adapter.ts:472`) and the seed script (`seed.ts:1334`). No other route or internal path reaches `linkDocument` with a request-supplied `plan_id` bypassing the new check.
- **Route handler confirmed correct** (`document-adapter.ts:467-499`): passes `req.epmpUser!.jurisdiction_scope` as the 4th arg (`:476`), catches `PLAN_NOT_FOUND` and returns 404 with the literal `error_code: 'PLAN_NOT_FOUND'` shape matching `plans.ts`'s own convention. `req.epmpUser!.jurisdiction_scope` is typed `string[]` (non-optional) on the authenticated-request shape (`session.ts:13`, `rbac.ts:19`) and always populated from a DB-backed `users.jurisdiction_scope` lookup at auth time (`rbac.ts:85,108`) — never attacker-suppliable, never undefined for a real authenticated request.
- **Only one write sink exists for `document_links.plan_id`-bearing rows**: repo-wide grep for `INSERT INTO document_links` found exactly two sites, both in `document-adapter.ts` — `importDocument` (`:134`, never takes `plan_id`, unaffected and correctly out of scope per the fix's own PLAN.md) and `linkDocument` (`:200`, now guarded). `plans.ts` never inserts into `document_links` (confirmed via grep — only `SELECT`/`UPDATE`).
- **seed.ts call site re-verified independently**: `linkDocument(plannerUser.id, 'DOC-SOP-002', uatUnlinkedPlan.id, [jurisdiction.id])` (`seed.ts:1334-1336`). Traced `uatUnlinkedPlan`'s own creation (`seed.ts:1225-1238`) — it is inserted with `jurisdiction_id = jurisdiction.id`, i.e. the exact same `jurisdiction` variable passed as the 4th-arg scope array — correctly matched, not a coincidental or mismatched variable name.
- **4 new tests read in full and independently re-run** (`facility-document-adapter.test.ts:252-324`, tests 9-12): test 9 creates a REAL foreign-jurisdiction row via direct `INSERT INTO plans`, asserts `404 PLAN_NOT_FOUND`, and directly queries `document_links WHERE plan_id = $1` to assert zero rows — proving rejection happens before the INSERT, not as a post-hoc cleanup. Test 10 uses a real nonexistent all-zero UUID, asserts `404` (never `500`). Test 11 creates a real in-scope plan row, asserts `201` and a real `document_links` row with the correct `plan_id`. Test 12 calls `linkDocument` directly with no `jurisdictionScope`/no `planId`, confirming the standalone-import-style call path is unaffected. All assertions are against real Postgres state, not mocked.
- **Independently executed (not trusted from the fixer's report)**: `cd backend && npx tsc --noEmit` → clean, zero errors. `npm test -- facility-document-adapter.test.ts` → **14/14 passed** (not 14 claimed-and-trusted — actually observed in this session's own terminal output, including live HTTP log lines showing the two new `404` responses and one new `201` for the link route). Full suite `npm test` → **22 files / 148 tests passed** — matches the fixer's claim exactly, independently reproduced. `npm run seed` (after supplying the missing `DATABASE_URL`/`OPA_URL` env vars the shell didn't have pre-set) → ran cleanly, idempotent: `document_links=0 inserted/1 already-present` — matches the claimed idempotent behavior exactly, no new error from the 4-arg call site.
- **New-vulnerability check**: `planIsInScope`'s query uses parameterized placeholders (`$1`, `$2`) exclusively — no string interpolation, no injection risk. Accepting `jurisdictionScope` as optional does not create a fail-open path (see above — it fails closed). The `seed.ts` change introduces no secret/credential exposure — it is a trusted offline dev script passing an already-seeded jurisdiction id, no new route or attacker-reachable surface.

No regressions found in any of the other 21 test files (full suite green), and no other caller of `linkDocument`/`document_links` was newly introduced or broken by this fix.

**Ship/no-ship: this phase is now clear to ship.** F-08-01 is genuinely closed — the fix is structurally sound, fails closed on missing/empty scope, is the sole code path to the `document_links.plan_id` INSERT, and is proven by tests that use real adversarial fixtures (a real foreign-jurisdiction plan row, a real nonexistent UUID) rather than mocks, with direct DB assertions on the zero-row rejection claim.

## Attack surface audited (this confirmation pass)

| Area | STRIDE | Verdict | Evidence (file:line) |
|------|--------|---------|----------------------|
| `planIsInScope()` helper — query shape and injection safety | T | SAFE | `document-adapter.ts:158-164` — parameterized `$1`/`$2` only, mirrors `plans.ts:89`'s `fetchPlanRow` scoping clause exactly |
| `linkDocument()` — throws before INSERT when `planId` out-of-scope | E | SAFE | `document-adapter.ts:189-194` (throw precedes `:199-204`'s INSERT); confirmed no early-return/swallow path exists between them |
| `linkDocument()` — fail-closed on missing/empty `jurisdictionScope` | E | SAFE | `document-adapter.ts:190` (`jurisdictionScope ? ... : false` → throws); live DB check confirms `jurisdiction_id = ANY('{}')` matches zero rows |
| `POST /:id/link` route — passes real `req.epmpUser!.jurisdiction_scope`, never attacker-suppliable | S/E | SAFE | `document-adapter.ts:476`; `rbac.ts:85,108` populates `jurisdiction_scope` from `users` table at auth time, type is non-optional `string[]` (`rbac.ts:19`, `session.ts:13`) |
| `POST /:id/link` route — 404 mapping matches `plans.ts`'s `PLAN_NOT_FOUND` shape | E | SAFE | `document-adapter.ts:486-495` |
| Sole caller surface for `linkDocument` with request-supplied `plan_id` | E | SAFE | `grep -rn "linkDocument("` → only `document-adapter.ts:472` (route) and `seed.ts:1334` (trusted dev script) outside tests |
| Sole INSERT sink for `document_links` | T | SAFE | `grep -n "INSERT INTO document_links"` → exactly 2 sites, both in `document-adapter.ts` (`:134` importDocument, no `plan_id`; `:200` linkDocument, now guarded); `plans.ts` never inserts |
| `seed.ts:1334` call site — jurisdiction variable correctness | T | SAFE | `seed.ts:1228,1233` (`uatUnlinkedPlan.jurisdiction_id = jurisdiction.id`) matches `seed.ts:1335`'s `[jurisdiction.id]` scope arg exactly — no variable mismatch |
| 4 new tests (9-12) — real fixtures, direct DB assertions, not mocked | E/T | SAFE | `facility-document-adapter.test.ts:252-324` — test 9 uses a real cross-jurisdiction `INSERT INTO plans` row + direct `document_links` zero-row query; test 10 uses a real nonexistent UUID; test 11 proves the legitimate path still works; test 12 proves the no-planId call is unaffected |
| `tsc --noEmit` | — | SAFE | Independently executed this session: zero errors |
| `npm test -- facility-document-adapter.test.ts` | — | SAFE | Independently executed this session: 14/14 passed (live HTTP log confirms 2×404 + 1×201 on the link route) |
| Full backend suite regression | — | SAFE | Independently executed this session: 22 files / 148 tests passed |
| `npm run seed` idempotency | — | SAFE | Independently executed this session: `document_links=0 inserted/1 already-present`, no error |
| New-vulnerability check on the fix itself | T/I | SAFE | Parameterized query only; fail-closed on undefined/empty scope; seed.ts change is a trusted offline script, no secret/credential exposure |

## Confirmed findings

None.

## Resolved findings

### F-08-01: `linkDocument`'s `plan_id` parameter bypasses jurisdiction-scope enforcement — HIGH
- **Status:** Fixed in commit `a5230d4`.
- **Location:** `backend/src/modules/integration-gateway/document-adapter.ts:146-207` (`planIsInScope` helper + hardened `linkDocument`), `:467-499` (route handler); `backend/scripts/seed.ts:1334-1336` (call-site update); `backend/src/modules/integration-gateway/facility-document-adapter.test.ts:252-324` (tests 9-12).
- **Original issue:** The `/:id/link` route passed a caller-supplied `plan_id` straight into the `document_links` INSERT with zero existence/jurisdiction check, letting any `plans:edit` holder (an org-wide, non-jurisdiction-scoped RBAC grant) attach a document link to any plan UUID system-wide, regardless of jurisdiction.
- **Fix:** A new private `planIsInScope(planId, jurisdictionScope)` helper runs the identical `jurisdiction_id = ANY($2)` scoping clause `plans.ts`'s `fetchPlanRow` already uses elsewhere, implemented self-contained inside `document-adapter.ts` to avoid a reverse module-import cycle (`plans.ts` already imports from `document-adapter.ts`). `linkDocument()` gained an optional 4th `jurisdictionScope?: string[]` parameter; when `planId` is provided, it must resolve in-scope or the function throws `PLAN_NOT_FOUND` before the INSERT. The route handler passes `req.epmpUser!.jurisdiction_scope` through and maps the thrown error to the same 404 `PLAN_NOT_FOUND` shape every other plans-mutating route uses. The `seed.ts` call site was updated to pass `[jurisdiction.id]` — confirmed to be the exact jurisdiction the seeded test plan itself belongs to.
- **How verified (this audit, independently, not from the fixer's report):**
  1. Read `document-adapter.ts` in full (521 lines) and traced the control flow: the `PLAN_NOT_FOUND` throw at `:192` unconditionally precedes the INSERT at `:199-204`; no bypass path exists.
  2. Confirmed fail-closed behavior on missing scope (code inspection, `:190`) AND empirically against a live Postgres instance (`jurisdiction_id = ANY('{}')` → 0 rows).
  3. Grepped the entire backend source tree for every caller of `linkDocument(` and every `INSERT INTO document_links` — confirmed the route handler and the trusted seed script are the only two call sites, and `linkDocument`'s own INSERT is the only write path for `plan_id`-bearing rows.
  4. Read all 4 new tests in full and confirmed they use real Postgres fixtures (a real `INSERT INTO plans` row for the foreign jurisdiction, a real all-zero UUID for the nonexistent case) and assert directly against `document_links` state, not mocks.
  5. Independently executed (this session's own terminal, with the docker-compose Postgres/OPA stack already running): `npx tsc --noEmit` (clean), `npm test -- facility-document-adapter.test.ts` (14/14 passed, live HTTP logs show the new 404/404/201 responses), full `npm test` (22 files / 148 tests passed, zero regressions), and `npm run seed` (idempotent, `document_links=0 inserted/1 already-present`, no new error).
  6. Checked the fix itself for new vulnerabilities: the new query is fully parameterized (no injection risk), the optional-param design fails closed rather than open, and the `seed.ts` change touches no secret/credential material.
- **Residual risk:** None identified. The fix mirrors the established `fetchPlanRow(..., jurisdictionScope)` convention used by every other plans-mutating route exactly, is the sole gate on the sole write path, and is proven by adversarial (not merely happy-path) tests.

## Accepted risks

| ID | Risk | Why accepted | Owner |
|----|------|--------------|-------|
| none | | | |

## Audit trail

- Scope restricted per task instruction to the bounded fix round's three touched files: `document-adapter.ts`, `seed.ts`, `facility-document-adapter.test.ts`.
- Commit scope independently verified via `git show --stat a5230d4` / `9820718` — matches the fixer's claimed file list exactly, no surprise changes.
- Full file read (`document-adapter.ts`, all 521 lines) — not a partial/targeted grep-only review.
- Cross-caller sweep: `grep -rn "linkDocument(" src/ scripts/` and `grep -rn "INSERT INTO document_links" src/` run across the whole backend tree, not just the three cited files, to rule out a bypass path outside the stated scope.
- Live-DB empirical check of the fail-closed edge case (empty `jurisdiction_scope` array) run directly against the running Postgres instance, not inferred from code reading alone.
- All verification commands re-run independently in this session (not copy-pasted from the fixer's report): `tsc --noEmit`, targeted test file, full test suite, `npm run seed` — all results match the fixer's claims, all captured directly in this session's own terminal output.
- Test file diff read via `git diff 8f62ccc..a5230d4 -- facility-document-adapter.test.ts` to confirm the actual added test code (not just test names) matches what each test claims to assert.
