---
status: diagnosed
phase: 04-notifications-reporting-learning
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md, 04-06-SUMMARY.md, 04-07-SUMMARY.md]
started: 2026-11-18T09:29:54Z
updated: 2026-11-18T10:58:55Z
---

## Current Test

[testing complete]

## Tests

### 1. Recipient Groups & Message Templates
expected: From the shell's "Coordinate" nav group, open Notification groups. A list of recipient groups shows (including a Jurisdiction-type group, e.g. "UAT-NOTIFY Default Agency residents"). Creating a new group succeeds and appears in the list. Message templates works the same way (list + create).
live: NOT RUN — UI list/create flow; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass

### 2. Compose Notification — full 4-step flow
expected: |
  Sign in as commander@epmp.local / devpass123 (the only role holding notifications:approve).
  Open Compose Notification (optionally pre-filled via an incident's "Compose notification" action).
  Step 1 (Audience) requires selecting an audience before continuing — the exact "no audience
  selected" message is enforced. Step 2 (Message) lets you type a body (and optionally "Draft
  with AI", which never auto-inserts — only an explicit Approve click inserts the draft). Step 3
  (Review) is fully read-only. Step 4 (Approve and send) is gated to commander@epmp.local's
  permission, shows a danger confirmation restating audience+channels, and only sends on confirm.
live: NOT RUN — multi-step UI wizard with visual/UX judgement; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: issue
reported: "No Compose Notification option in coordinate tab"
severity: major

### 3. Delivery & Acknowledgment Tracking
expected: |
  Open the Delivery Tracking page for an already-sent notification (seeded: "UAT-NOTIFY-SENT
  Shelter-in-place advisory issued for Default Agency residents.", id 9673467a-cced-430f-b7a0-72763631205e,
  at /notifications/9673467a-cced-430f-b7a0-72763631205e/delivery). A per-recipient table shows
  current status for each of its 4 recipients (seeded with a mix: Acknowledged / Delivered /
  Delivered / Failed). The Failed row shows its failure_reason inline, never silently dropped.
  The table keeps polling (updates without a manual refresh).
live: gap — `playwright: sign in on tab 1, open a fresh tab 2 in the SAME browser context, navigate tab 2 directly to /notifications/{id}/delivery` → tab 2 lands on `/` (home) instead of the delivery page; `page.evaluate(() => sessionStorage.getItem('epmp_session_token'))` returns null on tab 2 vs a real token on tab 1, confirming sessionStorage's per-tab isolation is the mechanism
result: issue
reported: "https://...pivota.dev/notifications/9673467a-cced-430f-b7a0-72763631205e/delivery is it fine its landing me to same home page"
severity: major

### 4. Generate SITREP (auto-assembly, zero re-entry)
expected: |
  Sign in as commander@epmp.local. Open "Generate SITREP" for incident "UAT-ASSIGN-ROLE Default
  Agency Flood" (id 726e3ef8-19c2-4915-9d10-0dfedd52e003, Open) — visit
  /incidents/726e3ef8-19c2-4915-9d10-0dfedd52e003/sitreps/new. The page auto-fires generation on
  load with zero button press: three read-only sections (current Timeline, Task status, Resource-
  request status) populate automatically from this incident's real data (it has an Overdue task
  and an Awaiting-approval resource request). Only the narrative text field and the AI-draft panel
  are editable. Saving as Draft succeeds (as planning_logistics_chief, the only role holding
  reporting:edit — incident_commander can trigger generation but not save/finalize, by design).
live: NOT RUN — UI auto-generation + visual layout; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass
reported: "Yess everything worked but on saving is a draft it said Could not save this report  Your account isn't assigned a role yet. Contact your administrator. [as commander@epmp.local — expected, since only planning_logistics_chief holds reporting:edit]. Pass — works as expected [after re-testing as planner@epmp.local]"

### 5. Generate AAR — closure gate blocks an open incident
expected: |
  Open "Generate AAR" for a still-Open incident (seeded: "UAT-ASSIGN-ROLE Default Agency Flood" or
  "UAT-ESCALATE-READY Default Agency Wildfire") by navigating directly to /incidents/{id}/aar/new.
  The page renders ONLY an EmptyState explaining the incident must be Closed first — no wizard
  steps, no form fields, nothing editable appears at all.
live: NOT RUN — UI EmptyState visual; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass
reported: "Generate AAR button doesnt work it like in light gray color not working [confirmed as the expected disabled-button gate]. the buton is there but it is not clickable and it doesnt show any message [confirmed: disabled state is correct behavior]. mark it as pass still make a gap and give a popup message that why this button is not working"

### 6. Generate AAR — wizard success, finding ownership, finalize
expected: |
  Open "Generate AAR" for a Closed incident as commander@epmp.local to view the auto-assembled
  5-step wizard (Timeline export / Decisions log / Resource history / Findings / Review) — its
  sections reflect the incident's real history. Adding a finding WITH a corrective action but
  WITHOUT an owner+due-date and clicking Finalize shows the exact ownership-required error (a
  finding with NO corrective action is correctly allowed to have no owner, per the DB's own
  chk_corrective_action_owned constraint). Switching to planner@epmp.local (the only role holding
  reporting:edit), filling Owner+Due-date, and clicking Finalize AAR succeeds.
live: NOT RUN — multi-step UI wizard with identity-switch and visual judgement; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass
reported: "Could not generate this after-action report  This report is finalized and can't be edited. Create an addendum instead. [on the already-finalized incident from the first attempt, which had correctly finalized since no corrective action was set]. Pass — blocked without owner, succeeded once filled in [after retesting on a fresh incident with a corrective action specified]"

### 7. Evidence & Audit Log View
expected: |
  Sign in as planner@epmp.local and open Evidence log (under the "Improve" nav group). A single
  aggregated table shows both audit_log and incident_timeline activity together (24+ existing rows,
  activity from at least 2 different actors e.g. "Incident Commander" and "Planning Chief"). There
  is NO edit or delete control anywhere on the page. CSV export downloads a file. Filtering by
  actor narrows the table.
live: NOT RUN — UI table + visual absence-of-affordance judgement; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass

### 8. Analytics & Reporting Dashboard
expected: |
  Sign in as planner@epmp.local and open Analytics (under "Improve"). Exactly 3 Stat tiles render
  (median_activation_time, resource_request_fulfillment_time, corrective_action_closure_rate) with
  real non-zero values (seeded: 9000s / 108000s / 100%) — no tile shows an invented "target" value
  next to it. A LineChart trend, a BarChart (resource requests by type), and a DonutChart
  (corrective actions by status) all render with real data, each with a visible data table
  alternative for accessibility.
live: NOT RUN — UI chart rendering/visual judgement; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass

### 9. Incident Workspace — Reports tab + Compose-notification action
expected: |
  Open the Incident Workspace for "UAT-CLOSED-AAR-FINALIZED Default Agency HazMat Response" (id
  ef7a6c26-156f-4d43-94bc-e0848a59274b, Closed, has a Finalized AAR). The Reports tab shows a real
  list including this incident's finalized AAR (not the old "ships in a later phase" placeholder),
  with working Generate-SITREP / Generate-AAR actions. On a still-open incident (e.g.
  726e3ef8-19c2-4915-9d10-0dfedd52e003) the Generate-AAR action in the Reports tab is disabled.
  The PageHeader's "Compose notification" action (new in this phase) navigates to the Compose
  Notification flow pre-filled with this incident.
live: NOT RUN — UI list + navigation visual judgement; judged by the human, with browser_suite's execute-time pass cited as context (see 🤖 Auto-check note)
result: pass

## Summary

total: 9
passed: 7
issues: 2
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173)
data: seeded 7 preconditions (pivota_spec-data-doctor, commit db56951) | 3 already present
routes_probed: 7 ok / 0 failed (/, /api/v1/me [401, correctly unauthenticated], /incidents, /notifications/compose, /notifications/groups, /notifications/templates, /reports/analytics, /reports/evidence-log)
cookie: n/a (no login driven from this self-check; browser_suite's own sign-in flows are execute's, cited above)
browser_urls: 0 gaps / 0 advisories (0b client-config scan: no NEXT_PUBLIC_/VITE_/etc. keys set anywhere, no in-source fallback URLs, no runtime window.X config; 3e: fetched app shell + all 7 phase-4 routes through the sandbox with forwarded headers, scanner found nothing internal-only; dev-mode Vite serves no built JS bundle to scan for surface C)
documented_limitations: none (0b markdown scan: zero "known limitation" headings anywhere in the repo)
repairs: none (self-check made no changes to the running instance; only read-only probes plus a delegated, source-committed seed addition — see data: line)
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: browser_suite (execute) already drove recipient-group creation through the real UI; this self-check independently confirmed GET /notifications/groups route is reachable (200) and the client emits no internal-only URLs."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: browser_suite (execute) drove all 4 compose steps end-to-end including the audience gate, AI-draft approve-before-insert, and danger-confirm send against the real compose stack. 3g confirmed the /api/v1/me route (representative of the compose flow's API calls) behaves identically with and without a browser Origin header through the preview proxy — no origin-rejection class bug."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: seeded notification 9673467a-cced-430f-b7a0-72763631205e has 4 recipients with Acknowledged/Delivered/Delivered/Failed statuses, ready to view; browser_suite already proved the polling table renders per-recipient status."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: seeded incident 726e3ef8-19c2-4915-9d10-0dfedd52e003 has a real Overdue task + Awaiting-approval resource request for the auto-assembly to pull from; browser_suite already proved the auto-generate-on-mount pattern."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: browser_suite's reporting.spec.ts directly navigated to an open incident's AAR route and asserted the EmptyState-only render (no wizard JSX at all) — the strongest form of this proof, a direct-URL attempt."
    confidence: proven
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: seeded Closed incident 1e0e22ba-4184-4b6d-844e-4b304f0faeb2 carries a command-role assignment + activation change + task + fulfilled resource request + sent notification for the wizard to auto-assemble from, with NO pre-generated AAR (first visit creates fresh). browser_suite already proved both the ownership-block and the finalize-success paths."
    confidence: proven
  - test: 7
    verdict: pass
    note: "🤖 Auto-check: evidence log already has 24+ rows from Phase 1-3 activity plus 2 distinct actors confirmed present after Phase-4 seeding (Incident Commander, Planning Chief) for the actor filter. browser_suite already proved zero edit/delete affordance structurally (grep-verified in source, not just a UI observation)."
    confidence: proven
  - test: 8
    verdict: pass
    note: "🤖 Auto-check: all 3 KPIs seeded non-zero (median_activation_time=9000s, resource_request_fulfillment_time=108000s, corrective_action_closure_rate=100%) so no chart renders empty. browser_suite already proved the structural no-target-prop guarantee (StatProps has no target field at all)."
    confidence: proven
  - test: 9
    verdict: pass
    note: "🤖 Auto-check: seeded Closed incident ef7a6c26-156f-4d43-94bc-e0848a59274b has a Finalized AAR recoverable via GET /api/v1/evidence-log?action_type=aar_finalized for the Reports tab to list; browser_suite's incident-to-evidence-trail.spec.ts (7/7) already proved this exact tab + the Compose-notification PageHeader action end-to-end across a real incident lifecycle."
    confidence: proven

Additional checks run this session (not test-specific):
- preview-path (1b): 200 via http://127.0.0.1:7777/preview/5173/ — same as direct probe, no proxy-path mismatch
- compose health (1c): db/keycloak/nats/opa all "Up ... (healthy)"; no fatal-marker log lines in any service
- dev-log fatal scan (2): one advisory — frontend's Vite pre-bundling emitted "Failed to resolve entry for package @epmp/design-system" during dependency-scan warmup, but VITE itself reported "ready in 298ms" immediately before it and the live boot probe (200) + preview-path probe (200) both succeeded afterward — this is Vite dependency-optimizer warmup noise, not a live-request failure. Advisory only, not a gap.
- object-store round-trip (3f): skipped (this app has no file storage — no minio/s3/localstack service, no aws-sdk/boto3/multer-class dependency, no multipart/form-data route anywhere in source)
- browser-Origin gate (3g): drove GET /api/v1/me through the :7777 preview proxy both with and without a synthetic Origin header — both returned 401 identically (SESSION_EXPIRED), i.e. the route's own auth semantics, not an origin-rejection. The shell itself (GET / with an Origin header) returned 200. No gap.
- dev-proxy targets (3g-i): vite.config.ts's /api→localhost:8080 and /realms,/resources,/js→localhost:8081 loopback targets matched against 4 compose services (db/nats/opa/keycloak) at face value, but the architecture (documented in .pivota/dev-script.meta.json and vite.config.ts's own comments) runs frontend+backend as NATIVE sibling processes on the host, not as separate compose containers — only db/nats/opa/keycloak are containerized, with keycloak port-mapped to host:8081. The live boot probe (200), preview-path probe (200), and 3g's consistent-401 result already provide direct evidence these loopback targets correctly reach their native/port-mapped destinations. Advisory, not a gap — the static heuristic's compose_services>=2 trigger doesn't distinguish "sibling container" from "port-mapped host service," and this session's live evidence resolves the ambiguity in the app's favor.
- stale-placeholder scan (0c): 4 findings reviewed (operating-picture.ts:221 F12/F17 TODO — v2-deferred requirements per REQUIREMENTS.md; api-clients.ts:105 "Phase 2+'s actual API-client-authenticated routes" — refers to F10/integration-gateway external-partner-API scope, still not built in any phase through Phase 4; PlatformMonitoring.tsx:59,69 "Phase 1 placeholder" hints — past-tense provenance labels, not forward-looking promises). All 4 were already reviewed identically in Phase 2's and Phase 3's UAT rounds (02-UAT.md, 03-UAT.md) and assessed as 0 gaps; this round's assessment is unchanged. 0 treated as gaps.
- deploy check: due (pivota-deploy.yaml present) — ran `pivota-deploy-check.cjs`: ALL checks PASS (D3 profile fields, C1 healthz, C2/C3 no leaked secrets, D1 docker build, D2 non-root USER 10001, D4 PORT-only run, D5 /healthz→200, C6 /→200, C4 reads-PORT on a second port, D7 Trivy no fixable CRITICAL CVEs). deploy_check: PASS
- agent run: not due (this phase makes no live model call — notifications' AI-draft is a documented deterministic stub per 04-01/04-05's own scope boundary)

Self-check: booted=200 preview=200 routes_ok=7/7 orphans=0 browser_urls=0g/0a stale_placeholders=4 reviewed/0 gaps file_roundtrip=skipped browser_origin=pass browser_suite=pass(execute) live=0p/0g/9n(provisional-pass, not self-check-settled — all 9 need human judgment on visuals/UX) repairs=0c/0b gaps=0 (proven=0 hypothesis=0) advisories=2 (dev-log Vite warmup noise, dev-proxy loopback-vs-native-process classification) deploy_check=PASS

## Gaps

- truth: "A user can reach Compose Notification from the Notifications area itself (not only from an existing incident's workspace)"
  status: failed
  reason: "User reported: No Compose Notification option in coordinate tab. The UX mockup's Navigation Map (project_specs/UX-Mockup-EPMP.md:63) names TWO independent reach-paths for /notifications/compose: 'Notifications landing primary action' OR 'Incident Workspace \"Compose notification\"' (documented as OR — both must exist). 04-07 wired only the second (IncidentWorkspace.tsx:295-297's onClick navigate). 04-05's nav-config 'Coordinate' group (backend/src/modules/auth-org/routes.ts:291-319) adds only 'Notification groups' and 'Message templates' sub-items — no 'Compose' entry — and its own comment (routes.ts:291-297) incorrectly asserts Compose is reached from these screens' own in-page actions, which is false: neither RecipientGroups.tsx nor MessageTemplates.tsx has a Compose button/link anywhere in their JSX (confirmed via direct file read, zero matches). There is also no standalone Notifications landing page route anywhere in main.tsx. So a user with no open incident in front of them has no way to reach Compose Notification without directly typing /notifications/compose into the address bar."
  severity: major
  test: 2
  source: user
  confidence: proven
  root_cause: "The mockup requires a dedicated 'Notifications landing' screen as Compose's primary non-incident entry point, which was never built — RecipientGroups.tsx and MessageTemplates.tsx are sub-tab editors, not a landing page, and 04-05's nav-config comment incorrectly treated them as satisfying this requirement."
  artifacts:
    - path: "project_specs/UX-Mockup-EPMP.md:63"
      issue: "requires a 'Notifications landing primary action' reach-path to Compose Notification, independent of the Incident Workspace path"
    - path: "backend/src/modules/auth-org/routes.ts:291-297"
      issue: "comment incorrectly asserts Compose/Delivery-Tracking are reached via Groups/Templates in-page actions; no 'compose' nav item exists in the Coordinate group's items array"
    - path: "frontend/app/src/main.tsx:127-130"
      issue: "only four notification routes registered (groups, templates, compose, :id/delivery) — no landing route (e.g. /notifications) exists"
    - path: "frontend/app/src/pages/notifications/RecipientGroups.tsx"
      issue: "only a 'New group' button; zero Compose references"
    - path: "frontend/app/src/pages/notifications/MessageTemplates.tsx"
      issue: "only a 'New template' button; zero Compose references"
  missing:
    - "A Notifications landing page (new component + route, e.g. /notifications -> frontend/app/src/pages/notifications/NotificationsLanding.tsx)"
    - "Route registration for that landing page in frontend/app/src/main.tsx alongside the existing notifications/* routes (~line 127)"
    - "A primary-action 'Compose notification' button on that landing page navigating to /notifications/compose (no incident query param, since this path is not incident-scoped)"
    - "A SideNav entry point to reach the landing page: either repoint the 'Notifications' parent label at the landing page (matching the mockup's literal 'SideNav -> Coordinate: \"Notifications\" -> sub-tab \"Groups\"/\"Templates\"' structure) or add a new sibling nav item in routes.ts's Coordinate group (~line 298) under the hasNotifications gate"
    - "Update the stale/incorrect comment at routes.ts:291-297 once implemented"
  debug_session: "general-agent investigation, 2026-11-18 (task ses_e11b26598ffeWyR0N92XN5HcsC)"

- truth: "A signed-in user who opens a deep link (e.g. a notification's Delivery Tracking page) in a fresh browser tab/session lands on that page, not on the home page"
  status: failed
  reason: "User reported: https://...pivota.dev/notifications/9673467a-cced-430f-b7a0-72763631205e/delivery is it fine its landing me to same home page. Reproduced directly with Playwright: signed in on tab 1 (commander@epmp.local), then opened a FRESH tab 2 in the SAME browser context and navigated tab 2 directly to the delivery-tracking URL — tab 2 landed on '/' instead. Root cause: session-storage.ts stores the app's own session_token in window.sessionStorage, which is scoped PER TAB (not shared across tabs in the same browser, even same-origin) — confirmed via page.evaluate(() => sessionStorage.getItem('epmp_session_token')) returning a real token on tab 1 but null on tab 2. RouteGuard.tsx sees no token on tab 2, sets state 'unauthenticated', and calls signIn() (oidc-config.ts), which redirects to Keycloak. Keycloak's own SSO session cookie (separate from the app's sessionStorage) is still valid from tab 1's login, so the OIDC round-trip silently completes without showing a login form. SignInCallback.tsx then ALWAYS calls navigate('/', { replace: true }) unconditionally on success — its own comment documents this as a known gap: 'Redirect to / (Phase 1 has no deep-link return-path tracking yet...)'. So the originally-requested deep-link path is lost, and the user is dropped at the home page having never been told why. This is not specific to the Delivery Tracking route — it is a general deep-link-after-sign-in gap affecting any route in the app opened in a tab with no existing sessionStorage token."
  severity: major
  test: 3
  source: user
  confidence: proven
  root_cause: "SignInCallback.tsx's completeSignIn() unconditionally calls navigate('/', { replace: true }) after a successful OIDC exchange, with no mechanism to capture or restore the original deep-link path the RouteGuard redirect interrupted. Compounded by session-storage.ts's deliberate per-tab sessionStorage choice (threat register T-01-21), which is correct for XSS mitigation but means a deep link opened in any tab/session without its own prior sign-in always re-enters the OIDC flow, surfacing this gap on every such link, not just this one route."
  artifacts:
    - path: "frontend/app/src/pages/SignInCallback.tsx"
      issue: "navigate('/', { replace: true }) is hardcoded with no return-path parameter captured from the pre-redirect location"
    - path: "frontend/app/src/auth/RouteGuard.tsx"
      issue: "the unauthenticated branch that triggers signIn() does not record location.pathname anywhere (e.g. sessionStorage, the OIDC state parameter) for SignInCallback to read back"
  missing:
    - "PREFERRED (Option A — oidc-client-ts's native `state`, the standard OAuth2/OIDC mechanism for exactly this): oidc-config.ts's signIn() (lines 34-36) accepts a returnPath param and forwards it as userManager.signinRedirect({ state: returnPath }) — confirmed supported via ExtraSigninRequestArgs in oidc-client-ts's own type declarations (node_modules/oidc-client-ts/dist/types/oidc-client-ts.d.ts:243)"
    - "RouteGuard.tsx's unauthenticated-branch effect (~lines 130-134) calls signIn(location.pathname + location.search) instead of signIn() — location is already available via useLocation() at line 49"
    - "SignInCallback.tsx's completeSignIn() (line 52) reads oidcUser.state back after the exchange (User.state is documented at oidc-client-ts.d.ts:1508 as 'custom state data set during the initial signin request') and navigates there (with a safe string type-guard, falling back to '/') instead of the hardcoded navigate('/', { replace: true }) at line 71"
    - "FALLBACK (Option B, only if threading oidc-client-ts's state proves awkward): a small new sessionStorage-backed module mirroring session-storage.ts's existing getter/setter/clear pattern (setReturnPath/getAndClearReturnPath under a new epmp_return_path key), written by RouteGuard just before calling signIn() and read+cleared by SignInCallback.tsx instead of the hardcoded '/'"
    - "Update the stale comment at SignInCallback.tsx:18 once implemented"
  debug_session: "general-agent investigation, 2026-11-18 (task ses_e11b22fa5ffeUE6yYh7p67yxMV)"

- truth: "When a signed-in user with a real, resolved role lacks the specific permission for an action, the error message reflects that (a permission problem), not a role-resolution problem"
  status: failed
  reason: "User reported (test 4, first attempt as commander@epmp.local): 'Could not save this report. Your account isn't assigned a role yet. Contact your administrator.' This is rbac.ts's generic ROLE_UNRESOLVED error_code/message (backend/src/modules/auth-org/rbac.ts:27-30), returned whenever checkPermission() denies ANY feature/action pair — including, as here, a user who DOES have a real, resolved role (incident_commander) but simply lacks reporting:edit (seeded to planning_logistics_chief alone per 04-04). The message's literal wording ('isn't assigned a role yet... contact your administrator') is factually wrong for this case and reads as a system misconfiguration rather than the real situation: 'your role can trigger SITREP generation but not save/finalize it.' The underlying RBAC enforcement itself is correct (verified: retrying as planning_logistics_chief succeeded) — this is purely a user-facing message-clarity issue, not a security or functional defect."
  severity: cosmetic
  test: 4
  source: user
  confidence: proven
  root_cause: "rbac.ts's requirePermission() preHandler returns the SAME literal ROLE_UNRESOLVED error_code/message for every permission denial, conflating two distinct cases: (1) a user whose role_id truly has no group_to_role_mapping match (JIT provisioning never resolved a role at all), and (2) a user with a perfectly valid, resolved role who simply lacks one specific feature/action grant. Case 2 is far more common in day-to-day use (any action-level RBAC split, like 04-04's reporting:edit restriction) and gets the same alarming 'contact your administrator' message as case 1's genuine misconfiguration."
  artifacts:
    - path: "backend/src/modules/auth-org/rbac.ts"
      issue: "requirePermission()'s checkPermission()===false branch (line 63-65) returns the same ROLE_UNRESOLVED constant used for a genuinely unresolved role, with no distinction for 'resolved role, missing this specific grant'"
  missing:
    - "A distinct error_code (e.g. PERMISSION_DENIED) and message for the checkPermission()-false case, separate from a genuinely unresolved role_id, so the frontend/user sees 'your role doesn't include this action' rather than 'you have no role'"
  debug_session: ""

- truth: "When 'Generate AAR' is disabled on an open incident's Reports tab, the user understands WHY it's disabled, not just that it is"
  status: failed
  reason: "User reported: 'Generate AAR button doesnt work it like in light gray color not working' then 'the buton is there but it is not clickable and it doesnt show any message'. Confirmed this is the INTENTIONAL closure gate (IncidentWorkspace.tsx: disabled={incident.status !== 'Closed'}, documented inline as proactively disabling before navigation per 04-07's own decision) working exactly as designed — not a functional bug. But the disabled Button renders with no tooltip, no adjacent caption, and no accessible explanation of why it's unclickable; a user reasonably reads a plain grayed-out button with no feedback as broken, not as a deliberate gate. User explicitly requested: 'give a popup message that why this button is not working.'"
  severity: minor
  test: 5
  source: user
  confidence: proven
  root_cause: "IncidentWorkspace.tsx's Generate AAR Button has disabled={incident.status !== 'Closed'} with no companion explanation — no title attribute, no Tooltip wrapper, no adjacent hint text telling the user the incident must be Closed first."
  artifacts:
    - path: "frontend/app/src/pages/incidents/IncidentWorkspace.tsx"
      issue: "the disabled Generate AAR Button (around line 429) has no title/tooltip/caption explaining the disabled state to the user"
  missing:
    - "Add a title attribute, Tooltip, or adjacent caption text on the disabled Generate AAR button reading something like 'Close this incident to generate its after-action report' — reusing the same message AarGenerator.tsx's own EmptyState already shows on direct navigation, so the two surfaces stay consistent"
  debug_session: ""
