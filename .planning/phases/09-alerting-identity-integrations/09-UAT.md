---
status: diagnosed
phase: 09-alerting-identity-integrations
source: [09-VERIFICATION.md, 09-01-SUMMARY.md, 09-03-SUMMARY.md, 09-05-SUMMARY.md]
started: 2026-11-21T08:37:27Z
updated: 2026-11-21T10:55:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Compose a public alert via IPAWS — Channels checkboxes are visually discoverable
expected: Opening Compose Notification and reaching Step 2 shows the Channels group (SMS/Email/IPAWS) as 3 clearly separated, vertically stacked checkboxes — not crammed onto one line with the "Draft with AI" button. Selecting IPAWS reveals 6 CAP fields (Sender/Event/Urgency/Severity/Certainty/Area); Continue is blocked until all are filled.
live: pass — `npx playwright test e2e/notification-provider-cap-delivery.spec.ts -g "Selecting IPAWS reveals CAP fields"` → 1 passed, including the boundingBox assertion added by gap-closure plan 09-05 (verticalGap between IPAWS checkbox and "Draft with AI" button > 8px); screenshot captured this session (`.pivota/uat-shots/1-compose-step2.png`) shows the 3 checkboxes on visually distinct stacked lines with clear separation from the button
result: pass

## Summary

total: 1
passed: 1
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200 (frontend 5173; backend 8080 serving API, 404 on `/` in dev mode — expected, SPA served separately in dev)
data: all preconditions present — spawned data-doctor, confirmed `commander@epmp.local`/`planner@epmp.local` + seeded "UAT-NOTIFY Default Agency residents" recipient group already exist; re-ran `npm run seed`, 0 rows inserted (idempotent, confirms no drift from fresh boot)
routes_probed: n/a — single visual/UX test, no new HTTP flow beyond what the live Playwright run already drove
cookie: n/a — app uses sessionStorage-held Bearer JWTs (Keycloak OIDC), never cookies; no SameSite/iframe exposure for this auth mechanism
browser_urls: none — 0b client-config scan (surfaces B/D/E) found zero client-exposed env vars, zero in-source fallbacks, zero runtime client-config templates; scan returned `gaps=0 advisories=0`
documented_limitations: none found — 0b markdown scan found no "known limitation" sections referencing Phase 9 flows
repairs: none — baseline HEAD clean before this session (only this session's own UAT.md edit was dirty); no ledger entries; nothing hand-repaired
deploy_check: FAIL (D4 run) — see `## Gaps` below. All other deploy-check lines passed: D3 profile.port/healthPath/size/database, C1 healthz, C2 env-example, C3 dockerfile-secrets, D1 build, D2 image-user, D7 trivy (no fixable CRITICAL vulnerabilities). Re-ran independently a second time (`--no-trivy`, faster) to confirm reproducibility before recording as a gap — same FAIL both times, deterministic.
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: the live Playwright spec (re-run fresh this session, not cited from a prior report) confirms the fix is live and passing, including gap-closure plan 09-05's own boundingBox assertion. A fresh screenshot (not reused from a prior round) independently confirms the visual separation by direct observation: the 3 Channels checkboxes render on clearly distinct stacked lines with visible gaps between them and before the 'Draft with AI' button."
    confidence: proven

## Gaps

- truth: "The Phase 9 repository (with all 5 plans, including gap-closure 09-05, landed) deploys as it stands — a cold container started the way the deployer starts it (only PORT set, no DATABASE_URL/NATS_URL/OPA_URL) comes up and answers its health check"
  status: failed
  reason: "Deploy check (self_check, DEPLOY-01 D4 run): `docker run` with only PORT set (no DATABASE_URL) exits code 1 almost immediately. Backend log shows the OPA-sync and NATS-connect failures at startup are correctly caught and logged as warnings (server.ts's own documented graceful-degradation try/catch blocks around both), but the crash itself is an UNCAUGHT rejection from `recordDocumentHealth()` in document-adapter.ts:441 — called with no surrounding try/catch directly from `documentRoutes()`'s registration body (document-adapter.ts:529, inside `if (!documentHealthRecorded) { ... await recordDocumentHealth('online'); }`), which itself is invoked via an unawaited `app.register(integrationGatewayRoutes)` in server.ts:61. Every sibling adapter in this same file (cad-adapter.ts, eoc-cots-adapter.ts, facility-adapter.ts, hazard-feed-adapter.ts, hris-roster-adapter.ts, notification-provider-adapter.ts) calls its own `record*Health()` only from inside a function that is itself called from a scheduler wrapped in server.ts's try/catch 'must never crash the server' blocks (documented explicitly in comments at server.ts:109/121/130/138/146/152/160/168/177) — document-adapter.ts is the ONE adapter that calls its health-record function directly and unconditionally at route-registration time, with zero error handling anywhere in the chain. Reproduced twice (full run with Trivy, and a faster --no-trivy re-run) with the identical crash — deterministic, not a flake."
  severity: blocker
  test: 1
  source: self_check
  confidence: proven
  root_cause: "backend/src/modules/integration-gateway/document-adapter.ts:527-530 — `documentRoutes()`'s registration body calls `await recordDocumentHealth('online')` unconditionally (guarded only by the in-memory `documentHealthRecorded` flag, not by a try/catch), and `recordDocumentHealth()` (document-adapter.ts:441) runs a bare `query(...)` with no try/catch of its own. When DATABASE_URL is unset (the exact DEPLOY-01 D4 boot condition: only PORT set), `query()` throws ECONNREFUSED, which propagates uncaught through the unawaited `app.register(integrationGatewayRoutes)` call chain in server.ts:61 and crashes the Fastify process (exit code 1) before the health endpoint can ever bind."
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
  reason: "Closed by gap-closure plan 09-05 (verified in prior round's 09-VERIFICATION.md, re-confirmed live this round via a fresh Playwright run and a fresh screenshot — see test 1 above)."
  severity: minor
  test: 1
  source: user
  confidence: proven
  redrive: closed (re-driven, see 09-VERIFICATION.md)
