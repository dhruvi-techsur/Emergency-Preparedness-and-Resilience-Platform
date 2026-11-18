---
status: complete
phase: 04-notifications-reporting-learning
source: [04-VERIFICATION.md, 04-08-SUMMARY.md, 04-09-SUMMARY.md]
started: 2026-11-18T13:50:54Z
updated: 2026-11-18T14:20:00Z
---

## Current Test

[testing complete]

## Tests

### 2. Compose Notification reachable from the Notifications area itself
expected: |
  Sign in as commander@epmp.local / devpass123 (incident_commander, the only role holding
  notifications:approve). From the shell's "Coordinate" nav group, click "Notifications"
  (repointed from the old "Notification groups" label). A new Notifications landing page
  opens (PageHeader "Notifications") with a primary "Compose notification" button — clicking
  it navigates to /notifications/compose with NO ?incident= query param. The page also links
  on to Groups and Templates sub-screens.
live: pass — `curl -H "X-Forwarded-Proto: https" -H "X-Forwarded-Host: pivota-verify-probe.example.com" http://127.0.0.1:5173/notifications` → 200; source-level inbound link confirmed at backend/src/modules/auth-org/routes.ts:307 (href: '/notifications') and NotificationsLanding.tsx:31 (navigate('/notifications/compose'), no incident param)
result: pass

### 3. Deep link in a fresh tab lands on that page, not home
expected: |
  Sign in as commander@epmp.local on tab 1, then open a fresh tab 2 (same browser, new tab)
  and navigate directly to a notification's Delivery Tracking URL:
  /notifications/e5848614-74cb-4f4d-9316-4e8066978a61/delivery (seeded "UAT-NOTIFY-SENT
  Shelter-in-place advisory issued for Default Agency residents.", 4 recipients:
  Acknowledged/Delivered/Delivered/Failed). Tab 2 should silently complete an SSO round-trip
  and land on the EXACT delivery-tracking page requested — not on the home page.
live: pass — `curl -H "X-Forwarded-Proto: https" -H "X-Forwarded-Host: pivota-verify-probe.example.com" http://127.0.0.1:5173/notifications/e5848614-74cb-4f4d-9316-4e8066978a61/delivery` → 200; source-level round-trip confirmed: oidc-config.ts signIn(returnPath) forwards state -> RouteGuard.tsx calls signIn(location.pathname+location.search) -> SignInCallback.tsx reads oidcUser.state back and navigates there (not hardcoded '/'); browser_suite (execute) already drove this exact scenario in auth-deep-link-return-path.spec.ts using the correct same-context-second-page isolation primitive
result: pass
reported: "Lands on delivery-tracking page — Pass"

### 4. RBAC error message distinguishes "no permission" from "no role"
expected: |
  Sign in as commander@epmp.local (incident_commander — holds reporting:view/create but NOT
  reporting:edit). Attempt to save a SITREP draft for incident "UAT-ASSIGN-ROLE Default Agency
  Flood" (id 29bf6105-6c42-49cc-b9eb-9555433c8749, Open, has an Overdue task + an
  Awaiting-approval resource request) — visit /incidents/29bf6105-6c42-49cc-b9eb-9555433c8749/sitreps/new,
  let it auto-generate, then try to save as Draft. The error message should now read
  something like "Your role doesn't include this action. Contact your administrator if you
  need access." — NOT the old "Your account isn't assigned a role yet. Contact your
  administrator." Then switch to planner@epmp.local / devpass123 (planning_logistics_chief,
  holds reporting:edit) and confirm the save succeeds.
live: pass — `rbac.ts:40-43 defines PERMISSION_DENIED constant; requirePermission()'s checkPermission()-false branch (line 76-78) returns it; ROLE_UNRESOLVED (line 27-30) confirmed still used only at its one genuine call site, routes.ts:85's SSO-callback RoleUnresolvedError catch` → backend rbac.test.ts (3 new tests): resolved-but-missing-one-action -> PERMISSION_DENIED, zero-grant-on-feature -> also PERMISSION_DENIED, positive control -> not PERMISSION_DENIED; all passed per 04-09-SUMMARY.md's Verification Evidence (backend suite 70/70, re-confirmed independently per GATE.md wave state)
result: pass
reported: "New message shown, planner save succeeds — Pass"

### 5. Disabled "Generate AAR" button explains itself
expected: |
  Open the Reports tab for a still-Open incident (seeded: "UAT-ASSIGN-ROLE Default Agency
  Flood" id 29bf6105-6c42-49cc-b9eb-9555433c8749, or "UAT-ESCALATE-READY Default Agency
  Wildfire" id 3742b7e7-8226-46c1-8683-6906a8d50f24). The "Generate AAR" button is disabled
  (grayed out) AND now shows BOTH a hover/screen-reader title attribute ("Close this incident
  before generating its after-action report.") AND an always-visible caption below the button
  row reading "Close this incident to generate its after-action report." — discoverable
  without hovering, unlike before.
live: pass — `IncidentWorkspace.tsx:435-436 (title attribute), :449 (always-visible <p className="caption"> rendered conditionally on incident.status !== 'Closed')` → new test in incident-workspace.spec.ts:194-214 asserts both the title attribute and the visible caption text render on an Open incident; passes per browser_suite (execute, 76/76)
result: pass
reported: "Caption + title both visible — Pass"

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173)
data: all preconditions present (pivota_spec-data-doctor: 0 inserted, all idempotent-seed rows already-present; 2 stale UUIDs in the previous round's UAT text corrected to their real seeded values — see per_test notes below)
routes_probed: 10 ok / 0 failed (/, /api/v1/me [401, correctly unauthenticated], /incidents, /notifications, /notifications/compose, /notifications/groups, /notifications/templates, /notifications/{real-id}/delivery, /reports/analytics, /reports/evidence-log)
cookie: n/a (auth uses sessionStorage, not cookies — session-storage.ts:16-24, oidc-config.ts:29; no Set-Cookie session mechanism exists to inspect)
browser_urls: 0 gaps / 0 advisories (0b client-config scan: no NEXT_PUBLIC_/VITE_/etc. keys set anywhere, no in-source fallback URLs, no runtime window.X config; 3e: fetched app shell + all 10 phase-4 routes through the sandbox with forwarded headers, scanner found nothing internal-only; dev-mode Vite serves no built JS bundle to scan for surface C)
documented_limitations: none (0b markdown scan: zero "known limitation" headings anywhere in the repo)
repairs: none (self-check made no changes to the running instance; read-only probes only)
per_test:
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: GET /notifications returns 200 through the preview-proxy path with forwarded headers; source read confirms the SideNav 'Notifications' item (routes.ts:307) links to it and the landing page's primary action (NotificationsLanding.tsx:31) navigates to /notifications/compose with no incident param — this is the exact gap-ref-2 fix, now present and reachable. browser_suite (execute) already drove this via notifications-compose.spec.ts's SideNav->landing->Compose assertion (76/76 pass)."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: the UAT text's previously-cited notification id (9673467a-cced-430f-b7a0-72763631205e) does not exist in this database — pivota_spec-data-doctor confirmed the real seeded row with the matching message body and the exact 4-recipient Acknowledged/Delivered/Delivered/Failed mix is e5848614-74cb-4f4d-9316-4e8066978a61; this test's `expected`/`live` lines above already use the corrected id. GET /notifications/e5848614-74cb-4f4d-9316-4e8066978a61/delivery returns 200. Source read confirms the full state-param round-trip (oidc-config.ts -> RouteGuard.tsx -> SignInCallback.tsx) is in place. browser_suite (execute) already proved the exact fresh-tab deep-link scenario via auth-deep-link-return-path.spec.ts (76/76 pass)."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: the UAT text's previously-cited incident id (726e3ef8-19c2-4915-9d10-0dfedd52e003) does not exist in this database — pivota_spec-data-doctor confirmed the real seeded incident matching the description (Open, Overdue task, Awaiting-approval resource request) is 29bf6105-6c42-49cc-b9eb-9555433c8749; this test's `expected` line above uses the corrected id. Direct SQL probe confirmed commander@epmp.local (incident_commander) holds reporting:view/create but not reporting:edit, and planner@epmp.local (planning_logistics_chief) holds reporting:edit — matching the test's RBAC-split precondition exactly. Source read confirms rbac.ts's new PERMISSION_DENIED constant is returned by the denial branch, with ROLE_UNRESOLVED untouched at its one real call site. Backend rbac.test.ts (3/3) proves the distinction against real OPA policy evaluation."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: seeded Open incidents 29bf6105-6c42-49cc-b9eb-9555433c8749 and 3742b7e7-8226-46c1-8683-6906a8d50f24 both confirmed Open status, either usable for this test. Source read confirms IncidentWorkspace.tsx:435-436 carries the title attribute and :449 renders the always-visible caption conditionally. browser_suite (execute) already proved both render on an Open incident via incident-workspace.spec.ts's new test (76/76 pass)."
    confidence: proven

Additional checks run this session (not test-specific):
- preview-path (1b): 200 via http://127.0.0.1:7777/preview/5173/ — same as direct probe, no proxy-path mismatch
- compose health (1c): db/keycloak/nats/opa all "Up ... (healthy)"; no fatal-marker log lines in any service (the two "RAISE EXCEPTION" hits are the audit_log/incident_timeline append-only triggers' own defensive error text, not a real failure)
- dev-log fatal scan (2): one advisory — frontend's Vite pre-bundling emitted "Failed to resolve entry for package @epmp/design-system" during dependency-scan warmup, but VITE itself reported "ready in 200ms" immediately before it and the live boot probe (200) + preview-path probe (200) both succeeded afterward — this is Vite dependency-optimizer warmup noise, not a live-request failure, consistent with the prior round's identical finding. Advisory only, not a gap.
- object-store round-trip (3f): skipped (this app has no file storage — no minio/s3/localstack service, no aws-sdk/boto3/multer-class dependency, no multipart/form-data route anywhere in source)
- navigation reachability (3d): /notifications has a confirmed inbound SideNav link (routes.ts:307); no orphan pages found among this round's routes
- browser-Origin gate (3g): drove GET /api/v1/me through the :7777 preview proxy both with and without a synthetic Origin header — both returned 401 identically, i.e. the route's own auth semantics, not an origin-rejection. The shell itself (GET / with an Origin header) returned 200. No gap.
- dev-proxy targets (3g-i): vite.config.ts's /api→localhost:8080 and /realms,/resources,/js→localhost:8081 loopback targets matched against 4 compose services (db/nats/opa/keycloak) at face value, but the architecture (documented in .pivota/dev-script.meta.json) runs frontend+backend as NATIVE sibling processes on the host, not as separate compose containers — only db/nats/opa/keycloak are containerized. The live boot probe (200), preview-path probe (200), and 3g's consistent-401 result already provide direct evidence these loopback targets correctly reach their native/port-mapped destinations. Advisory, not a gap — same finding as the prior round.
- stale-placeholder scan (0c): 4 findings reviewed (operating-picture.ts:221 F12/F17 TODO — v2-deferred; api-clients.ts:105 — Phase 2+ integration-gateway scope, still not built through Phase 4; PlatformMonitoring.tsx:59,69 — past-tense provenance labels). All 4 already reviewed identically in Phase 2's, Phase 3's, and this phase's prior UAT round and assessed as 0 gaps; this round's assessment is unchanged. 0 treated as gaps.
- deploy check: due (pivota-deploy.yaml present) — ran `pivota-deploy-check.cjs`: ALL checks PASS (D3 profile fields, C1 healthz, C2/C3 no leaked secrets, D1 docker build, D2 non-root USER 10001, D4 PORT-only run, D5 /healthz→200, C6 /→200, C4 reads-PORT on a second port, D7 Trivy no fixable CRITICAL CVEs). deploy_check: PASS
- agent run: not due (this phase makes no live model call — notifications' AI-draft is a documented deterministic stub)

Self-check: booted=200 preview=200 routes_ok=10/10 orphans=0 browser_urls=0g/0a stale_placeholders=4 reviewed/0 gaps file_roundtrip=skipped browser_origin=pass browser_suite=pass(execute) live=4p/0g/0n repairs=0c/0b gaps=0 (proven=0 hypothesis=0) advisories=2 (dev-log Vite warmup noise, dev-proxy loopback-vs-native-process classification) deploy_check=PASS

## Gaps

[none yet]
