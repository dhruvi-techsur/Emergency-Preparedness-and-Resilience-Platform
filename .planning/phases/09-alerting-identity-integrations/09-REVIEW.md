---
phase: 9
status: clean
blockers: 0
warnings: 0
files_reviewed: 2
files_reviewed_list:
  - backend/src/modules/integration-gateway/document-adapter.ts
  - backend/src/modules/integration-gateway/facility-document-adapter.test.ts
reviewed_at: 2026-11-21T17:43:51Z
iteration: 1
---

# Phase 9 Code Review

Scope note: this is a gap-closure run (`--gaps-only`) executing only 09-06-PLAN.md against commits `d883e40`/`5cb2028` (range `d3d3159..HEAD`). Plans 09-01 through 09-05 were reviewed in prior sessions and are out of scope here. Confirmed via `git log d3d3159..HEAD -- .` that the only implementation files touched in this range are the two listed above; all other changed paths in the diff (`.planning/ROADMAP.md`, `.planning/STATE.md`, `09-06-PLAN.md`, `09-06-SUMMARY.md`, `09-GATE.md`, `09-SECURITY.md`, `logs/attempt-7/*`) are planning/docs artifacts, not implementation, per the task instructions.

## BLOCKERs

None.

## WARNINGs

None.

## Findings detail

**document-adapter.ts (lines 527-537):** The previously-unguarded `await recordDocumentHealth('online')` call inside `documentRoutes()`'s registration body is now wrapped in try/catch, logging via `app.log.warn(err, ...)` and swallowing the error. This is a 1:1 structural match to the established graceful-degradation convention used elsewhere in this codebase (e.g. `gis-adapter.ts`'s `checkGisHealth()`, and every scheduler-start try/catch block in `server.ts`'s `start()` function). Verified:
- `server.ts:61` calls `app.register(integrationGatewayRoutes)` unawaited inside `buildApp()` (a synchronous function) — confirming the plan's claimed crash mechanism (an uncaught rejection inside a registered plugin's async body propagates to an unhandled rejection at the process level) is real and not fabricated.
- `documentHealthRecorded` is still set to `true` *before* the guarded call (unchanged from before) — matches the plan's stated "never retry on next hot-reload" semantics; this is pre-existing behavior, not newly introduced by this diff, and is explicitly documented as intentional in both the plan and the code comment.
- No other call site touches `recordDocumentHealth` or the `documentHealthRecorded` flag — the change is fully localized, no action-at-a-distance.
- `recordDocumentHealth()` itself, `routes.ts`, and `server.ts` are untouched, exactly as the plan specifies.
- `cd backend && npx tsc --noEmit` — clean (0 errors).

**facility-document-adapter.test.ts (2 new tests, lines 327-366):**
- Test 13 (happy path): queries `integration_health WHERE system_name = 'SharePoint'` and asserts `record_authority = 'SharePoint'` and `sync_status` in `['online','offline']`. This correctly proves the happy-path write is unaffected by the new try/catch (relies on the shared `app` import at module load already having triggered `documentRoutes()` registration against the live compose DB — same established pattern this file's other 12 tests already use). No other test file writes to `integration_health WHERE system_name = 'SharePoint'`, so no cross-test race.
- Structural test (lines 359-366): reads `document-adapter.ts` source directly and regex-asserts the try/catch wraps `recordDocumentHealth('online')` between the `if (!documentHealthRecorded)` and the first `app.get(` call. Checked the regex (`/try\s*{[\s\S]*recordDocumentHealth\('online'\)[\s\S]*}\s*catch/`) against the actual current source slice — matches correctly; the slice boundary (`fixtureSource.indexOf('app.get(', ...)`) correctly terminates before the first route registration, so it won't accidentally span unrelated code. The comment accurately explains why a true live-failure re-trigger isn't attempted (shared `documentHealthRecorded` flag + pool singleton), and this reasoning holds up — there genuinely is no DI seam in `document-adapter.ts` to swap the query client without widening the module's public surface, which the plan explicitly says not to do.
- `readFile`/`import.meta.url` resolution: `backend/package.json` has `"type": "module"`, vitest runs in Node ESM mode, so `import.meta.url` resolves correctly relative to the test file's own directory (same directory as `document-adapter.ts`) — no path resolution issue.

Both tests are read-only against `integration_health`/filesystem respectively; neither mutates shared state in a way that could destabilize the other 12 pre-existing tests in the same file.

## Cross-file seams checked

- `document-adapter.ts`'s `documentRoutes` export ↔ `routes.ts:11,40` consumer — signature unchanged (`documentRoutes(app: FastifyInstance)`), registration call site untouched. OK.
- `document-adapter.ts`'s `recordDocumentHealth` (private, non-exported) ↔ only call site is the one now-guarded line inside `documentRoutes()` — OK, no other consumer exists to break.
- `facility-document-adapter.test.ts`'s new `readFile` import ↔ only used by the one new structural test — OK, no collision with existing imports in the file.
- Contract-scan `c-gap` (SignInCallback.tsx → `/api/v1/auth/sso/callback`): confirmed via `git log d3d3159..HEAD -- frontend/app/src/pages/SignInCallback.tsx` — zero commits in this diff range. This file and its backend route are untouched by 09-06. Pre-existing, out of scope for this gap-closure plan's review — not carried into this report as a new finding, but flagged here so it isn't silently dropped; it should be tracked against whichever phase actually introduced it.
- Contract-scan `c-adv` (api-client.ts dynamic path for `/photos`): same disposition — unrelated to 09-06's two touched files, zero commits touching `api-client.ts` in this diff range. Not carried forward as a 09-06 finding.
