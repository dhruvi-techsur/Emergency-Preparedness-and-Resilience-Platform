---
status: diagnosed
phase: 03-plans-tasks-resource-requests
source: [03-VERIFICATION.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-08-SUMMARY.md, 03-09-SUMMARY.md, 03-10-SUMMARY.md]
started: 2026-11-17T23:00:00Z
updated: 2026-11-18T03:41:33Z
---

## Current Test

[testing complete]

## Tests

### 1. Materialize-Tasks UI Trigger Check
expected: |
  Sign in as planning_logistics_chief, open the Approved plan
  "UAT-MATERIALIZE-READY Generator Pre-Positioning Plan" (section
  "Generator pre-positioning" has 1 linked task template,
  "Pre-position generators (UAT)"), then look for a "Materialize tasks"
  button or similar affordance offering that plan's task templates for
  one-click creation into a selected incident. Per success criterion 2,
  this should be reachable without writing the task from scratch. (This
  is a re-test of UAT gap ref "uat:1", closed by plan 03-10.)
live: pass — `headless Playwright: sign in as planner@epmp.local -> /plans -> open "UAT-MATERIALIZE-READY Generator Pre-Positioning Plan" -> click "Materialize tasks" -> select incident "UAT-ASSIGN-ROLE Default Agency Flood" via Combobox -> submit` → modal rendered inline: "1 task created — Pre-position generators (UAT)". Screenshot: `.pivota/uat-shots/1-materialize-result.png`
result: pass
verified_by: self_check

### 2. Plan Cross-Reviewer Approval Workflow
expected: |
  Sign in as planner@epmp.local (planning_logistics_chief). Go to Plans &
  Playbooks, click "Create plan", add at least one section, save as draft,
  then "Submit for review". The plan's status badge should read "Review".
  Sign out, sign in as eocdirector@epmp.local (eoc_director — a DIFFERENT
  named reviewer). Open the same plan and approve it. The status badge
  should flip to "Approved" with a new version-history entry showing
  eocdirector@epmp.local as reviewer. If you instead try to approve it
  while still signed in as the SAME author, the UI should show a
  self-approval-blocked message and keep the plan in Review.
live: NOT RUN — cross-reviewer UX judgment (two separate sign-ins, a Draft→Review→Approved transition, and the self-approval-blocked message's wording/placement) needs a human to confirm the flow reads correctly end-to-end; not reducible to one deterministic HTTP call.
result: pass

### 3. Task Lifecycle + Overdue Auto-Flip Visibility
expected: |
  Sign in as commander@epmp.local (or any role holding tasks:edit). Go to
  Tasks. You should see a task named "UAT-OVERDUE Verify generator fuel
  levels" showing an "Overdue" status badge (red/danger) — it was never
  manually marked Overdue; a backend time-based sweep flips it
  automatically once its due date passes. Leave the Task List open for
  about 30-40 seconds without refreshing the page — the list should
  continue to reflect live data via background polling, not require a
  manual reload to show up-to-date statuses.
live: NOT RUN — visual/UX judgment (badge color/placement, and confirming the ~30s background poll keeps the page current without a manual refresh) needs a human to watch it happen.
result: issue
reported: "I dont see UAT-OVERDUE in the list nor the list polls every 30 sec"
severity: major
🤖 Auto-check: the task "UAT-OVERDUE Verify generator fuel levels" is confirmed present and Overdue, and is the sole task on Task List's unfiltered default page-1 view for this user (verified directly against the seed and the route's own query). Screenshot of the list at rest: `.pivota/uat-shots/3-tasklist.png`. NOTE: a direct automated re-drive (headless Playwright, same commander@epmp.local credentials, same /tasks route) immediately after this report rendered the task correctly as the FIRST row with an Overdue badge — API response confirmed via network capture to include it. This discrepancy between the automated re-drive and the human's report is unresolved and is exactly what diagnosis investigates (candidates: Preview-iframe-specific state/caching the direct probe doesn't reproduce, a stale/cached tab, a race in the ~30s poll, or a session/token difference) — recorded as the human's own testimony, not overridden.

### 4. Resource Request Lifecycle (create → approve/decline)
expected: |
  Sign in as commander@epmp.local or eocdirector@epmp.local. Go to
  Resources (standalone, or from an Incident Workspace's Resources tab),
  click "New resource request", fill it out linked to an open incident,
  and submit — it should immediately show status "Awaiting approval" (no
  separate submit step). Sign in as planner@epmp.local (holds
  resource_requests:approve) and either Approve it (status → "Approved")
  or Decline it with a reason (status → "Declined") — declining with an
  empty reason should be blocked client-side before any server round-trip.
live: NOT RUN — visual/UX judgment (the decline-reason empty-state gating, and the approve/decline button layout on Resource Request Detail) needs a human to drive the exact clicks.
result: pass
🤖 Auto-check: an empty Resource Requests list is the correct current state for this view (0 requests exist yet for this user's jurisdiction) — screenshot: `.pivota/uat-shots/4-resourcerequests.png`. Not a bug; this is the expected starting point for the test.

### 5. Resource Request Visible on Operating Picture (no page reload)
expected: |
  After creating a resource request linked to an incident (test 4, or a
  fresh one), go to the Operating Picture map. The incident should show
  as a diamond marker; the resource request should show as a SEPARATE
  triangle marker near the same location, toned by its current status.
  Clicking the triangle marker should open a popup with the request's
  facts and a link to its Resource Request Detail page. Approving or
  declining/fulfilling the request elsewhere should update the marker's
  tone or make it disappear (once Fulfilled/Declined) without you having
  to reload the Operating Picture page.
live: NOT RUN — visual judgment (marker shape/placement/tone on the map, legend entry, popup layout) needs a human to look at the rendered map.
result: pass
🤖 Auto-check: Operating Picture currently renders 2 diamond (incident) markers with a working legend and status bar ("Base layer: agency GIS") — screenshot at rest (no resource request yet): `.pivota/uat-shots/5-operating-picture.png`. Both seeded incidents carry a real `location` point, so a resource request linked to either is structurally able to render a marker once created.

### 6. Link Plan Section to Task Template (from the Approved reading view)
expected: |
  Sign in as planner@epmp.local, open an Approved plan's reading view
  (e.g. "UAT-LINK-TASKS-READY Shelter Activation Plan"), find a section
  with "0 linked tasks", click "Link tasks", then "+ Define new template"
  and fill in a name. After submitting, that section's linked-task count
  should increase and the new template should be usable by "Materialize
  tasks" going forward.
live: pass — `headless Playwright: sign in as planner@epmp.local -> /plans -> open "UAT-LINK-TASKS-READY Shelter Activation Plan" -> click "Link tasks" on "Shelter activation" section -> "+ Define new template" -> fill Name "UAT Verify-Round Shelter Setup Checklist", select "EOC Director" as default owner role -> submit` → section's count changed from "0 linked tasks" to "1 linked task", and the "Materialize tasks" PageHeader action appeared (previously absent, since `hasEligibleSections` was false before this). Screenshots: before `.pivota/uat-shots/6-plandetail-linktasks.png`, after `.pivota/uat-shots/6-plandetail-linktasks-after.png`.
result: pass
verified_by: self_check

## Summary

total: 6
passed: 5
issues: 1
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: seeded 2 preconditions (1 Overdue task, 1 Approved plan+section+version with zero linked templates) — 4 of 6 tests' preconditions already present; committed `backend/scripts/seed.ts` sha 4a356bd (pivota_spec-data-doctor)
routes_probed: 8 ok / 0 failed (/, /plans, /plans/new, /tasks, /tasks/new, /resource-requests, /resource-requests/new, /operating-picture — all 200; backend /healthz 200)
cookie: n/a — Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie for the app's own session; confirmed via direct probe (no Set-Cookie header on an unauthenticated request to `/`). Same as Phase 2/3's prior findings — iframe-cookie class does not apply.
browser_urls: 0 gaps / 0 advisories from both the static 0b scan (no client-exposed env vars, no in-source fallbacks, no runtime client config found) and the live 3e scan (9 driven flows incl. GET /api/v1/me and every Phase 3 route, 0 linked JS bundles to classify — dev server serves module-script entries, not static bundle hrefs)
documented_limitations: []
repairs:
  - kind: data
    what: "pivota_spec-data-doctor seeded 1 Overdue task + 1 zero-template Approved plan/section so this round's Task-list and Link-tasks walkthroughs have fresh, correctly-shaped precondition data rather than reusing records already exercised to exhaustion by prior rounds/e2e runs"
    resolution: committed 4a356bd
browser_suite: pass (execute) — 03-GATE.md records browser_suite: pass, review_blockers_open: 0, boot_smoke: pass, browser_headroom_mb: 5071 (0 fix attempts, all 8 waves build+test pass); not re-run here per 3b
deploy_check: PASS — re-run fresh this session (`pivota-deploy-check.cjs`): D3/C1/C2/C3/D1/D2/D4/D5/C6/C4/D7 all PASS, exit 0
agent_run: not due (this app calls no model in Phase 3 scope — AI assistance is Phase 6)
3g_origin_gate: pass — `/api/v1/plans` via the port-7777 preview proxy returns the same 401 with and without a browser Origin header (route semantics — auth required, not an Origin rejection); shell itself loads 200 with an Origin header
3g-i_dev_proxy: advisory, not a gap — vite.config.ts's proxy targets `localhost:8080` (API) and `localhost:8081`; `docker compose config --services` reports 4 dependency-only services (db/keycloak/nats/opa) — per `.pivota/start-dev.sh`'s documented Shape-B classification this is a native multi-process app (frontend+backend run natively in-sandbox). Empirically confirmed both targets resolve: `curl 127.0.0.1:5173/realms/epmp/.well-known/openid-configuration` -> 200 real Keycloak doc; `curl 127.0.0.1:5173/api/v1/plans` -> 401 (auth-gated, not dead) — same conclusion as Phase 2/3's prior rounds
3d_orphan_pages: none — spot-check confirmed 28 real inbound navigate()/Link references across main.tsx + plans/tasks-resources/incidents source for the Phase 3 route set, consistent with the prior round's full crawl finding
3f_object_store: skipped (this app has no file storage)
stale_placeholders: 4 findings reviewed, 0 treated as gaps — operating-picture.ts:221's "TODO(Phase 3+)" refers to F12/F17 (weather/hazard feeds, document-system integration), both explicitly deferred to v2 per REQUIREMENTS.md and never owed by a completed phase; api-clients.ts:105's "Phase 2+'s actual API-client-authenticated routes" is Phase-1-authored text about an external-partner-API consumer F10's roadmap never scheduled for a specific phase; PlatformMonitoring.tsx:59/69 are the same two Phase-1-authored hint strings already assessed clean in Phase 2 and Phase 3's prior UAT rounds — unchanged this round
dev_log_scan: one non-fatal advisory — Vite's one-time dependency pre-bundling scan logged `Failed to resolve entry for package "@epmp/design-system"` at cold start, the same pre-existing Phase 01-10 tsconfig-path-mapping workaround already documented in Phase 2 and Phase 3's prior UAT rounds; root route and all 8 Phase 3 routes served 200 on every subsequent request this round. No fatal signatures (5xx, unhandled exception, EADDRINUSE, MissingSecret) found in the dev-server log; no fatal markers in db/keycloak/nats/opa compose logs (all 4 services healthy)
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright as planner@epmp.local — clicked the real 'Materialize tasks' button, selected an incident through the Combobox, submitted, and watched the modal render '1 task created — Pre-position generators (UAT)' inline. This settles the test's full expected statement (a real one-click UI affordance exists and works), so it is recorded as a self-check pass rather than asked of the human."
    confidence: proven
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright as planner@epmp.local — clicked 'Link tasks' on a section with 0 linked templates, clicked '+ Define new template', filled in a name and owner role, submitted, and watched the section's count change from '0 linked tasks' to '1 linked task' plus the 'Materialize tasks' action appear for the first time (hasEligibleSections flipped true). This settles the test's full expected statement, so it is recorded as a self-check pass rather than asked of the human."
    confidence: proven
  - test: 2
    verdict: skipped (needs human)
    note: "🤖 Auto-check: both required identities (planner@epmp.local as author, eocdirector@epmp.local as reviewer) are seeded and hold the correct, segregated plans permissions (create/edit vs. review) per 03-07's seed. The /plans/new create flow is reachable and standalone. Could not drive the full cross-reviewer approval end-to-end here because it requires judging two separate signed-in UI sessions and the self-approval-blocked message's presentation — left for the human."
  - test: 3
    verdict: skipped (needs human)
    note: "🤖 Auto-check: confirmed 'UAT-OVERDUE Verify generator fuel levels' exists with status=Overdue and is the only row on the unfiltered Task List default view for a tasks:edit-holding user. Visual badge styling and the ~30s poll-without-refresh behavior need a human to watch."
  - test: 4
    verdict: skipped (needs human)
    note: "🤖 Auto-check: confirmed both seeded Open incidents and all three identities' (commander/eocdirector/planner) permissions are correctly split for create vs. approve. Resource Requests list is currently empty (0 requests) for this user — the correct starting state, not a bug. Decline-reason client-side gating UX needs a human to drive."
  - test: 5
    verdict: skipped (needs human)
    note: "🤖 Auto-check: confirmed both seeded incidents carry a non-null `location` point (structurally renderable as a map marker) and the Operating Picture page currently renders 2 diamond markers + a working legend/status-bar with no errors. Marker shape/tone/popup visuals for a resource request need a human to look at after test 4's flow creates one."

## Gaps

- truth: "A task left open past its due time automatically flips to Overdue without any manual status update, and the Task List reflects this without requiring a manual page reload"
  status: failed
  reason: "User reported: I dont see UAT-OVERDUE in the list nor the list polls every 30 sec. Self-check's own automated re-drive (headless Playwright, same commander@epmp.local credentials, same /tasks route, immediately after the report) rendered the task correctly as the first row with an Overdue badge and the API response confirmed via network capture included it — so the backend data and API are not implicated by that probe. The discrepancy between the human's report and the automated re-drive is unresolved; candidates include Preview-iframe-specific state/caching the direct probe does not reproduce, a stale/cached browser tab, a race in the ~30s poll initialization, or a session/token difference the direct probe did not hit."
  severity: major
  test: 3
  source: user
  confidence: proven
  root_cause: "The SPA never mounts React when reached through Pivota's real Preview path (:7777/preview/5173/, the documented in-sandbox equivalent of the Preview tab). Vite's served index.html emits root-relative asset tags (<script src=\"/src/main.tsx\">, plus injected /@vite/client and /@react-refresh). A browser resolves these against the actual origin (127.0.0.1:7777), not the /preview/5173/ path prefix the HTML itself was fetched through — so all three asset requests land on the exec-server's own protected root namespace and get 401 (x-pivota-exec-token required). #root never receives any children: a total React-mount failure, not a one-row-missing bug, which fully explains why the human saw neither the task nor any polling (there was no running app to show either). Directly confirmed via headless-Chromium Playwright navigation to the real proxy path: 3 requestfailed/401 network entries, zero console/app activity, blank white screenshot. The SAME assets succeed (200) when requested WITH the /preview/5173/ prefix explicitly, proving they exist and are served fine — just unreachable at the paths the SPA's own HTML requests. Self-check's own automated Playwright re-drive could never have caught this: frontend/app/playwright.config.ts hardcodes baseURL: 'http://localhost:5173', so every prior e2e run (including this round's self-check probes) structurally bypasses the :7777 proxy path and its prefix requirement entirely — explaining why 5 passing rounds of browser-suite coverage never found it."
  artifacts:
    - path: "frontend/app/vite.config.ts"
      issue: "No `base`/path-rebasing mechanism for the sandbox's /preview/<port>/ proxy prefix — index.html's script/module asset references are root-relative and do not survive being loaded through that prefix"
    - path: "frontend/app/playwright.config.ts"
      issue: "baseURL hardcoded to direct http://localhost:5173 — the entire e2e suite (51 tests) structurally never drives the app through the :7777 preview-proxy path, so this class of defect is invisible to every existing automated check"
    - path: ".pivota/dev-script.meta.json"
      issue: "catalog_entry: \"compose\" (Shape B) was selected without the react-vite.md catalog entry's companion allowedHosts/base-path overlay (vite.config.pivota.ts) that would normally rebase asset URLs for the preview prefix"
  missing:
    - "A dynamic/relative `base` in vite.config.ts (or an exec-server-aware dev-proxy rewrite) so index.html's script/module requests resolve under the same /preview/<port>/ prefix the page itself was loaded through — mirroring the same-origin-derivation pattern Phase 2's 02-08 gap closure already applied to the OIDC authority (window.location-relative, not hardcoded)"
    - "A parallel preview-path test lane in playwright.config.ts (or a dedicated spec) that drives at least one flow through the real :7777/preview/<port>/ entry point, not just direct localhost:5173 access, so this class of regression is caught automatically going forward"
  debug_session: ".planning/debug/task-list-overdue-not-visible.md"
