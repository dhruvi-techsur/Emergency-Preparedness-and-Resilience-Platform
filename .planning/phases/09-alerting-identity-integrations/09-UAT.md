---
status: diagnosed
phase: 09-alerting-identity-integrations
source: [09-VERIFICATION.md, 09-01-SUMMARY.md, 09-03-SUMMARY.md, 09-05-SUMMARY.md]
started: 2026-11-21T13:40:00Z
updated: 2026-11-21T17:05:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Compose a public alert via IPAWS — Channels checkboxes are visually discoverable
expected: Opening Compose Notification and reaching Step 2 shows the Channels group (SMS/Email/IPAWS) as 3 clearly separated, vertically stacked checkboxes — not crammed onto one line with the "Draft with AI" button. Selecting IPAWS reveals 6 CAP fields (Sender/Event/Urgency/Severity/Certainty/Area); Continue is blocked until all are filled.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "Selecting IPAWS reveals CAP fields"` → 1 passed (re-run fresh this session); `git status --porcelain frontend/app/src/pages/notifications/ComposeNotification.tsx` → empty (file unchanged since 09-05's fix landed); fresh screenshot captured this session (`.pivota/uat-shots/1-compose-step2-r2.png`)
result: pass

## Summary

total: 1
passed: 1
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200 (frontend 5173 direct + preview-proxy :7777/preview/5173/ both 200; backend 8080 serving API, 404 on `/` in dev mode — expected, SPA served separately in dev; backend /healthz 200)
data: all preconditions present — `commander@epmp.local`/`planner@epmp.local` + seeded "UAT-NOTIFY Default Agency residents" recipient group confirmed present; `npm run seed` re-run, 0 rows inserted (idempotent)
routes_probed: 5 ok / 0 failed (`/`, `/admin/integration-health`, `/api/v1/me`, `/notifications/compose`, `/notifications/groups` — all through the forwarded-header probe)
cookie: n/a — app uses sessionStorage-held Bearer JWTs (Keycloak OIDC) exclusively; grepped entire backend/src for `Set-Cookie`/`setCookie` — zero hits, confirmed no cookie-based session exists anywhere
browser_urls: none — 0b client-config scan (surfaces B/D/E) found zero client-exposed env vars, zero in-source fallbacks, zero runtime client-config templates; 3e re-ran the same classifier against 5 freshly-driven flows (forwarded X-Forwarded-Proto/Host headers) — `gaps=0 advisories=0` both times
documented_limitations: none found — 0b markdown scan found no "known limitation" sections referencing Phase 9 flows
browser_origin: pass — 3g drove `/api/v1/me` through the :7777 preview proxy with and without a browser `Origin` header: both returned identical 401 `SESSION_EXPIRED` (route's own semantics, not an origin rejection); shell document loads 200 with an Origin header present
dev_proxy_targets: 2 loopback targets found in `frontend/app/vite.config.ts` (`/api` → `localhost:8080`, Keycloak sub-paths → `localhost:8081`) against 4 compose services (db/nats/opa/keycloak) — **advisory, not a gap**: this app's backend is NOT a compose service (it runs via `npm run dev -w backend` directly on the host per `.pivota/start-dev.sh`, confirmed in `dev-script.meta.json`'s `existing_scripts`), so the frontend container and the backend process share the same loopback network — proxying to `localhost:8080`/`:8081` is correct here, not the Permit-1 cross-container defect class this check exists to catch
stale_placeholders: 1 finding, reviewed and NOT a gap — `frontend/app/src/pages/plans/ImportDocumentModal.tsx:59` matched the scanner's regex ("...placeholder...Phase 8's F17") but the matched text is a code comment describing PAST history ("Replaces Phase 3's documented, deliberately-disabled... placeholder... now in scope via Phase 8's F17") — i.e. the placeholder was already replaced by Phase 8, which is itself complete; this is retrospective documentation, not a current user-facing deferral
deploy_check: FAIL (D4 run, re-confirmed this round) — see `## Gaps` below; still reproduces identically to the prior round (ran with `--no-trivy` for speed; all non-D4 lines pass: D3 profile.port/healthPath/size/database, C1 healthz, C2 env-example, C3 dockerfile-secrets, D1 build, D2 image-user)
repairs: none — baseline HEAD clean before this session (verified via `git status --porcelain` before and after); no ledger entries; nothing hand-repaired
browser_suite: pass (execute) — cited from `09-GATE.md` (`gate_status: passed`, `browser_suite: pass`, `review_blockers_open: 0`); `verify gate-evidence 9 --raw` → `pass`. Not re-run per 3b's rule (execute already ran it before the push).
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: fresh Playwright re-run this session (not cited from a prior report) confirms the fix is still live and passing, including gap-closure plan 09-05's own boundingBox assertion (>8px vertical gap). `ComposeNotification.tsx` confirmed unchanged (`git status --porcelain` empty) since the 09-05 fix landed. A fresh screenshot independently confirms the visual separation: the 3 Channels checkboxes render on clearly distinct stacked lines with visible gaps between them and before the 'Draft with AI' button."
    confidence: proven

## Gaps

- truth: "The Phase 9 repository (with all 5 plans, including gap-closure 09-05, landed) deploys as it stands — a cold container started the way the deployer starts it (only PORT set, no DATABASE_URL/NATS_URL/OPA_URL) comes up and answers its health check"
  status: failed
  reason: "Deploy check (self_check, DEPLOY-01 D4 run) re-confirmed this round, reproducing identically to the prior round: `docker run` with only PORT set (no DATABASE_URL) exits code 1 almost immediately. Backend log shows the OPA-sync and NATS-connect failures at startup are correctly caught and logged as warnings (server.ts's own documented graceful-degradation try/catch blocks around both), but the crash itself is an UNCAUGHT rejection from `recordDocumentHealth()` in document-adapter.ts:441 — called with no surrounding try/catch directly from `documentRoutes()`'s registration body (document-adapter.ts:527-530, inside `if (!documentHealthRecorded) { ... await recordDocumentHealth('online'); }`), which itself is invoked via an unawaited `app.register(integrationGatewayRoutes)` in server.ts:61. Every sibling adapter in this same file (cad-adapter.ts, eoc-cots-adapter.ts, facility-adapter.ts, hazard-feed-adapter.ts, hris-roster-adapter.ts, notification-provider-adapter.ts) calls its own `record*Health()` only from inside a function that is itself called from a scheduler wrapped in server.ts's try/catch 'must never crash the server' blocks — document-adapter.ts is the ONE adapter that calls its health-record function directly and unconditionally at route-registration time, with zero error handling anywhere in the chain. This round re-ran the check independently (fresh `docker build`/`docker run`, not cached from the prior round's artifacts) and observed the byte-identical crash signature (`AggregateError [ECONNREFUSED]` at `recordDocumentHealth <- documentRoutes`), confirming this is not a flake and remains unfixed since the prior UAT round diagnosed it. No gap-closure plan has yet addressed this finding — it carries over from the prior round's `.planning/debug/phase9-deploy-check-d4-crash.md` session unchanged."
  severity: blocker
  test: 1
  source: self_check
  confidence: proven
  root_cause: "backend/src/modules/integration-gateway/document-adapter.ts:527-530 — `documentRoutes()`'s registration body calls `await recordDocumentHealth('online')` unconditionally (guarded only by the in-memory `documentHealthRecorded` flag, not by a try/catch), and `recordDocumentHealth()` (document-adapter.ts:441) runs a bare `query(...)` with no try/catch of its own. When DATABASE_URL is unset (the exact DEPLOY-01 D4 boot condition: only PORT set), `query()` throws ECONNREFUSED, which propagates uncaught through the unawaited `app.register(integrationGatewayRoutes)` call chain in server.ts:61 and crashes the Fastify process (exit code 1) before the health endpoint can ever bind. Previously diagnosed in full in `.planning/debug/phase9-deploy-check-d4-crash.md` (exhaustive scan confirmed this is the ONLY unguarded registration-time DB/network call anywhere in backend/src); re-confirmed live and unchanged this round."
  artifacts:
    - path: "backend/src/modules/integration-gateway/document-adapter.ts"
      issue: "Lines 527-530: `await recordDocumentHealth('online')` called directly inside `documentRoutes()`'s registration body with no try/catch, unlike every other adapter in this file's own sibling modules (cad/eoc-cots/facility/hazard-feed/hris-roster), each of which only reaches its record*Health() call from inside a scheduler already wrapped in server.ts's graceful-degradation try/catch."
    - path: "backend/src/server.ts"
      issue: "Line 61: `app.register(integrationGatewayRoutes)` — not awaited, and not inside a try/catch the way the NATS/OPA/every scheduler-start block above it is (lines 97-179). A throw during this plugin's registration (which document-adapter.ts's eager health-record call can now produce) has no graceful-degradation path to land in."
  missing:
    - "Wrap the `await recordDocumentHealth('online')` call at document-adapter.ts:527-530 in a try/catch that logs a warning and swallows the error (`app.log.warn(err, 'Document adapter health record failed at startup — integration_health row not yet populated')`), matching this codebase's own established convention used everywhere else in server.ts's start() function and every sibling adapter's health-record call path. Single localized change — no changes needed to recordDocumentHealth() itself, routes.ts, or server.ts."
  debug_session: ".planning/debug/phase9-deploy-check-d4-crash.md"

## Gaps (historical, closed)

- truth: "Selecting IPAWS in Compose Notification Step 2 is visually discoverable — a user can see and pick the IPAWS channel checkbox"
  status: closed
  reason: "Closed by gap-closure plan 09-05 (verified in 09-VERIFICATION.md 2026-11-20T23:38:10Z via reproduced red-then-green evidence; re-confirmed live again this round via a fresh Playwright run, a fresh screenshot, and confirmation that ComposeNotification.tsx is byte-unchanged since the fix landed — see test 1 above)."
  severity: minor
  test: 1
  source: user
  confidence: proven
  redrive: closed (re-driven twice now, see 09-VERIFICATION.md)
