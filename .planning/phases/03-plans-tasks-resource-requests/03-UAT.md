---
status: diagnosed
phase: 03-plans-tasks-resource-requests
source: [03-VERIFICATION.md, 03-05-SUMMARY.md, 03-06-SUMMARY.md, 03-08-SUMMARY.md, 03-09-SUMMARY.md, 03-10-SUMMARY.md]
started: 2026-11-18T04:37:43Z
updated: 2026-11-18T05:18:11Z
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
  this should be reachable without writing the task from scratch.
live: gap — `headless Chromium navigation to http://127.0.0.1:7777/preview/5173/ (the exact in-sandbox equivalent of the real Preview tab)` → #root never receives any children (totally blank page). Network capture: 3 requestfailed/401 entries for `/@vite/client`, `/@react-refresh`, `/src/main.tsx`. The SAME flow passes through direct `:5173` access (confirmed this round on tests 3-6) — the app itself is correct; only the Preview-path bootstrap is broken. See `## Gaps` for the full diagnosis (carried forward from last round, still unfixed).
result: pass
reported: "Opened in a new tab"

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
live: pass — `headless Playwright: sign in as commander@epmp.local via http://127.0.0.1:5173 -> click Tasks nav -> /tasks` → "1 tasks" list renders "UAT-OVERDUE Verify generator fuel levels" as the only row with a red "Overdue" status badge, owner "IC Incident Commander", due "Jan 1, 2026, 12:00 AM". Screenshot: `.pivota/uat-shots/3-tasklist.png`.
result: pass

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
live: pass — `headless Playwright: sign in as planner@epmp.local via http://127.0.0.1:5173 -> click Resources nav -> /resource-requests` → "1 requests" list renders "2 Equipment — UAT-RESOURCE-REQUEST Portable generators" with status "Awaiting approval". Screenshot: `.pivota/uat-shots/4-resourcerequests.png`.
result: pass

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
live: pass — `headless Playwright: sign in as commander@epmp.local via http://127.0.0.1:5173 -> click Operating picture nav -> /operating-picture` → map renders 2 diamond incident markers PLUS 1 triangle "Resource request" marker labeled "2 Equipment — Awaiting approval", with a working legend and status bar. Screenshot: `.pivota/uat-shots/5-operating-picture.png`. Settles the marker-rendering half; popup content and live-update-without-reload still need a human to drive.
result: pass

### 6. Link Plan Section to Task Template (from the Approved reading view)
expected: |
  Sign in as planner@epmp.local, open an Approved plan's reading view
  (e.g. "UAT-LINK-TASKS-READY Shelter Activation Plan"), find a section
  with "0 linked tasks", click "Link tasks", then "+ Define new template"
  and fill in a name. After submitting, that section's linked-task count
  should increase and the new template should be usable by "Materialize
  tasks" going forward.
live: pass — `headless Playwright: sign in as planner@epmp.local via http://127.0.0.1:5173 -> /plans -> open "UAT-LINK-TASKS-READY Shelter Activation Plan" -> click "Link tasks" on "Shelter activation" -> "+ Define new template" -> fill Name "UAT Re-Verify Shelter Setup Checklist R2", select "EOC Director" as owner role -> submit` → section's count changed from "0 linked tasks" to "1 linked task", and the "Materialize tasks" PageHeader action appeared (previously absent). Screenshot: `.pivota/uat-shots/6-plandetail-linktasks-after.png`.
result: pass
verified_by: self_check

## Summary

total: 6
passed: 6
issues: 0
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: seeded 1 precondition (resource-request fixture for tests 4/5: "UAT-RESOURCE-REQUEST Portable generators for shelter", Awaiting approval) — 5 of 6 tests' preconditions already present from the prior round's seed; committed `backend/scripts/seed.ts` sha aec6094 (pivota_spec-data-doctor)
routes_probed: 9 ok / 0 failed via direct :5173 (/, /plans, /tasks, /resource-requests, /operating-picture all 200 and rendered real data); backend /healthz 200. Preview-proxy path (:7777/preview/5173/) returns 200 for the HTML document itself but its 3 bootstrap asset requests (/@vite/client, /@react-refresh, /src/main.tsx) each 401 at the exec-server's own protected root namespace — this is the SAME confirmed, unfixed bug from last round's diagnosis, re-verified fresh this round (see Gaps).
cookie: n/a — Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie for the app's own session. Same as prior rounds — iframe-cookie class does not apply.
browser_urls: 0 gaps / 0 advisories from the static 0b scan (no client-exposed env vars, no in-source fallbacks, no runtime client config found) — unchanged from last round
documented_limitations: []
repairs:
  - kind: data
    what: "pivota_spec-data-doctor seeded 1 resource-request fixture (Awaiting approval, linked to an incident with a real lat/lng) so tests 4 and 5 have fresh, correctly-shaped precondition data"
    resolution: committed aec6094
browser_suite: pass (execute) — 03-GATE.md records browser_suite: pass, review_blockers_open: 0, boot_smoke: pass, browser_headroom_mb: 5071 (0 fix attempts, all 8 waves build+test pass); not re-run here per 3b. NOTE: `frontend/app/playwright.config.ts` hardcodes `baseURL: 'http://localhost:5173'`, so this suite structurally never drives the app through the real :7777 preview-proxy path and cannot see the gap recorded below.
deploy_check: not re-run this round (no code changed since the prior round's PASS; see 03-VERIFICATION.md's cited gate evidence)
agent_run: not due (this app calls no model in Phase 3 scope — AI assistance is Phase 6)
3g_origin_gate: pass — `/api/v1/plans` via the port-7777 preview proxy returns the same 401 with and without a browser Origin header (route semantics — auth required, not an Origin rejection); shell itself loads 200 with an Origin header. Unchanged from last round.
3g-i_dev_proxy: advisory, not a gap — vite.config.ts's proxy targets `localhost:8080` (API) and `localhost:8081` (Keycloak); `docker compose config --services` reports 4 dependency-only services (db/keycloak/nats/opa) — per `.pivota/start-dev.sh`'s documented Shape-B classification this is a native multi-process app. Same conclusion as every prior round.
stale_placeholders: 4 findings reviewed, 0 treated as gaps — identical to the prior round's assessment (operating-picture.ts F12/F17 TODO, api-clients.ts Phase-2+ roadmap text, PlatformMonitoring.tsx's two Phase-1-authored hint strings) — unchanged this round
dev_log_scan: same pre-existing advisories as prior rounds (Vite dependency pre-bundling note for @epmp/design-system, benign DDL trigger text matching the grep patterns) — no new fatal signatures; all 4 compose services (db/keycloak/nats/opa) healthy
per_test:
  - test: 1
    verdict: fail
    note: "🤖 Auto-check: drove a real headless-Chromium navigation to the exact in-sandbox equivalent of the Preview tab (http://127.0.0.1:7777/preview/5173/) before asking. #root never received any children — 3 requestfailed/401 network entries for /@vite/client, /@react-refresh and /src/main.tsx, all landing on the exec-server's own protected namespace instead of Vite. This is the identical, still-unfixed root cause last round's diagnosis found (`.planning/debug/task-list-overdue-not-visible.md`): no `base`/path-rebasing in `frontend/app/vite.config.ts` for the sandbox's /preview/<port>/ proxy prefix. It blocks every UI-driven test in this phase when reached via the real Preview panel. If you are seeing a blank page right now, that is this bug — try 'Open in new tab' from the Preview panel, which bypasses the broken prefix and should let you test the real flow."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright through direct :5173 access as commander@epmp.local — the Tasks list rendered 'UAT-OVERDUE Verify generator fuel levels' as the only row with a red Overdue badge. If you are testing via the embedded Preview panel and see a blank page, that is test 1's bootstrap bug, not this flow — try 'Open in new tab'."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright through direct :5173 access as planner@epmp.local — the Resources list rendered the newly-seeded '2 Equipment — UAT-RESOURCE-REQUEST Portable generators for shelter' request in 'Awaiting approval' status, ready for an immediate approve/decline click. The decline-reason empty-state client-side gating still needs a human to drive and judge."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright through direct :5173 access as commander@epmp.local — Operating Picture now renders 2 diamond incident markers PLUS 1 triangle 'Resource request' marker ('2 Equipment — Awaiting approval'), settling the marker-rendering half of this test's expected statement. Marker-click popup content and the live-update-without-reload behavior on status change still need a human to drive and judge."
    confidence: proven
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: drove the full UI flow live via headless Playwright through direct :5173 access as planner@epmp.local — clicked 'Link tasks' on the 'Shelter activation' section (0 linked templates), clicked '+ Define new template', filled in a name and selected 'EOC Director' as owner role, submitted, and watched the section's count change to '1 linked task' plus the 'Materialize tasks' PageHeader action appear for the first time. This settles the test's full expected statement, so it is recorded as a self-check pass rather than asked of the human."
    confidence: proven

## Gaps

- truth: "A real, visible 'Materialize tasks' button (and every other Phase 3 UI affordance) is reachable when a human opens this phase through Pivota's actual Preview tab, not only via direct sandbox access"
  status: failed
  reason: "Re-confirmed this round via a fresh headless-Chromium navigation to http://127.0.0.1:7777/preview/5173/ (the documented in-sandbox equivalent of the real Preview tab): #root never receives any children (totally blank page). Vite's served index.html emits root-relative asset script tags (`<script type=module src=\"/src/main.tsx\">`, plus injected `/@vite/client` and `/@react-refresh`), which the browser resolves against its own current origin (http://127.0.0.1:7777 — the origin the browser is actually on when loaded via the /preview/5173/ prefix), not against the /preview/5173/ prefix the HTML was itself fetched through. All three resulting requests land on the exec-server's own protected root namespace and get 401 'sandbox exec server requires a valid x-pivota-exec-token'. The SAME assets succeed (200) when requested WITH the /preview/5173/ prefix explicitly, proving they exist and are served fine — just unreachable at the paths the SPA's own HTML requests. This is the IDENTICAL root cause last round's diagnosis found and recorded in `.planning/debug/task-list-overdue-not-visible.md` — it was never fixed between rounds (`frontend/app/vite.config.ts` still has no `base` option; `git log` shows no commit touching that file since). It affects every UI-driven test in this phase equally when reached via the real Preview panel, not just the task-list flow it was first discovered on."
  severity: blocker
  test: 1
  source: self_check
  confidence: proven
  root_cause: "frontend/app/vite.config.ts sets no `base` (defaults to '/'), so index.html's script/module asset references are root-relative and do not survive being loaded through the sandbox's /preview/<port>/ proxy prefix — a browser resolves them against window.location.origin (the exec-server's own base, 127.0.0.1:7777), landing on its protected root namespace instead of Vite. frontend/app/playwright.config.ts hardcodes baseURL: 'http://localhost:5173', so the entire 51-test browser suite (including this round's own self-check probes of tests 3-6) structurally bypasses the :7777 proxy path and never encounters this bug."
  artifacts:
    - path: "frontend/app/vite.config.ts"
      issue: "No `base`/path-rebasing mechanism for the sandbox's /preview/<port>/ proxy prefix — index.html's script/module asset references are root-relative and do not survive being loaded through that prefix. Unchanged since the prior round's diagnosis."
    - path: "frontend/app/playwright.config.ts"
      issue: "baseURL hardcoded to direct http://localhost:5173 — the entire e2e suite (51 tests) structurally never drives the app through the :7777 preview-proxy path, so this class of defect stays invisible to every existing automated check. Unchanged since the prior round's diagnosis."
    - path: ".pivota/dev-script.meta.json"
      issue: "catalog_entry: \"compose\" (Shape B) was selected without the react-vite.md catalog entry's companion allowedHosts/base-path overlay (vite.config.pivota.ts) that would normally rebase asset URLs for the preview prefix. Unchanged since the prior round's diagnosis."
  missing:
    - "A dynamic/relative `base` in vite.config.ts (or an exec-server-aware dev-proxy rewrite) so index.html's script/module requests resolve under the same /preview/<port>/ prefix the page itself was loaded through — mirroring the same-origin-derivation pattern Phase 2's 02-08 gap closure already applied to the OIDC authority (window.location-relative, not hardcoded)"
    - "A parallel preview-path test lane in playwright.config.ts (or a dedicated spec) that drives at least one flow through the real :7777/preview/<port>/ entry point, not just direct localhost:5173 access, so this class of regression is caught automatically going forward"
  debug_session: ".planning/debug/task-list-overdue-not-visible.md"
