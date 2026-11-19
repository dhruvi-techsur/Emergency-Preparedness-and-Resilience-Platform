---
status: complete
phase: 06-persona-dashboards-ai-assistance
source: [06-06-SUMMARY.md, 06-07-SUMMARY.md, 06-08-SUMMARY.md, 06-09-SUMMARY.md, 06-10-SUMMARY.md]
started: 2026-11-19T15:30:40Z
updated: 2026-11-19T22:34:59Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. EOC Dashboard (PER-01)
expected: Signing in as eoc_director lands on /dashboard with 4 Stat tiles (Active Incidents real count; the other 3 honestly captioned as structural zeros), an "Operating picture" link-out Card, and a "Recent activity" EmptyState Card.
live: pass — `npx playwright test e2e/persona-dashboards.spec.ts --workers=1` → 4/4 passed (fresh run against this live stack); DB confirms 4 Open incidents in eoc_director's jurisdiction, so the Active Incidents tile has a real nonzero value to show
result: issue
reported: "Active incidents 4; Open tasks 2 Tasks module ships in a later phase; Pending resource requests 1 Resource requests module ships in a later phase; Notifications pending ack 0 Per-recipient acknowledgment ships in a later phase"
severity: major

### 2. My Work Dashboard (PER-03)
expected: Signing in as planning_logistics_chief lands on /my-work with 3 named action buttons (Generate SITREP / Review resource requests / Review plan) and 3 EmptyState cards honestly stating the underlying feature isn't aggregated yet.
live: pass — `npx playwright test e2e/persona-dashboards.spec.ts --workers=1` → 4/4 passed (same run as test 1, covers PER-03 landing)
result: pass

### 3. Field Home bottom-bar-only (PER-04)
expected: Signing in as field_responder lands on /field. No desktop SideNav rail ever renders for this role, at any viewport width — only the bottom bar with Field-group items (My Tasks / Report / Field home, etc.).
live: pass — `npx playwright test e2e/persona-dashboards-per04-per05.spec.ts --workers=1` → 5/5 passed (fresh run), including an explicit toHaveCount(0) assertion that no SideNav rail renders for this role at a desktop viewport
result: pass

### 4. Executive Dashboard facet (PER-05)
expected: Signing in as secops_admin shows an Admin/Executive toggle in the header, defaulted to Admin. Switching to Executive shows /executive with exactly 3 big (display-scale) KPI numbers, each with a definition/period/source caption, and no charts or decorative cards. Reloading the page resets the facet back to Admin (never persists).
live: pass — `npx playwright test e2e/persona-dashboards-per04-per05.spec.ts --workers=1` → 5/5 passed; test 4 asserts exactly 3 display-scale KPI numbers and zero chart/SVG elements; test 5 asserts the facet resets to Admin on reload
result: pass

### 5. AIDraft never pre-inserts into the record (ICS Form Editor)
expected: On an ICS-201 form, clicking "Draft with AI" shows the draft text ONLY inside a separate AIDraft panel below the narrative field (with Provenance source chips) — the narrative field itself stays untouched until you explicitly click Approve inside the AIDraft panel, at which point the text appears in the narrative field and the form becomes Approved.
live: pass — `npx playwright test e2e/ics-form-aidraft.spec.ts --workers=1` → 1/1 passed (fresh run); DB confirms target incident 2fc86067-cefb-4fd0-a423-71c976077ad2 has 0 ics_forms rows (clean slate for a human to repeat the flow)
result: pass

### 6. AIDraft Discard leaves the field untouched
expected: Requesting an AI draft and then clicking Discard in the AIDraft panel leaves the narrative field exactly as it was before the draft was requested (empty or whatever was there) — no draft text leaks into the record.
live: pass — `npx playwright test e2e/ics-form-aidraft.spec.ts --workers=1` → 1/1 passed; the spec's own discard-leaves-field-untouched assertion passed
result: pass

### 7. Signal Triage Queue — Promote never auto-creates an incident
expected: On the Signals queue (/signals), clicking Promote on a clustered signal navigates you to the Create Incident form with the hazard type/name/severity already pre-filled — but no new incident exists yet. Only after you review and submit that form does a new incident actually get created.
live: pass — `npx playwright test e2e/signal-triage.spec.ts --workers=1` → 4/4 passed (fresh run, includes explicit before/during/after incidents-count assertion that Promote alone creates zero rows); DB confirms 3 signals still in New status after this run (re-seeded, idempotent) — 2 available for a human to try (02009c9b-… and 4bba168f-…)
result: pass

### 8. Signal Triage — Dismiss requires a reason
expected: On the Signals queue, clicking Dismiss opens a confirmation dialog whose confirm button stays disabled until you type a reason; only then can you confirm the dismissal.
live: pass — `npx playwright test e2e/signal-triage.spec.ts --workers=1` → 4/4 passed; covers the Dismiss-disabled-until-reason-typed flow against the server's 422 SIGNAL_DISMISS_REASON_REQUIRED backstop; a84c478a-… remains in New status for a human to try
result: issue
reported: "the test case works as expected, but the formatting of the text box is messed up. it goes outside the modal"
severity: cosmetic

## Summary

total: 8
passed: 6
issues: 2
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173, frontend; backend on :8080 also healthy, 401 on protected routes without a token as expected)
data: seeded 1 precondition (2 fresh hazard_feed_events → 2 new New-status signals via clusterHazardFeedEvents(), committed to seed.ts in 9c45148); all other preconditions (5 persona Keycloak identities, incident fixtures, role_permissions grants) already present
routes_probed: 7 ok / 0 failed (/, /dashboard, /my-work, /field, /executive, /signals, /incidents all return the SPA shell; GET /api/v1/signals correctly 401s with no token)
cookie: n/a — this app's own session uses a bearer token in sessionStorage (session-storage.ts), never a Set-Cookie; no cookie/iframe-safety class applies
browser_urls: 0 gaps / 0 advisories (0b static scan: no client-exposed env, no in-source fallback, no runtime window.X config; 3e live-driven scan of all 7 UAT routes + linked JS bundle: same result)
documented_limitations: [none found — 0b's markdown scan found zero "known limitation" sections naming preview/sandbox/iframe/sign-in]
repairs:
  - kind: data
    what: "Inserted 2 new hazard_feed_events fixture rows + re-ran clusterHazardFeedEvents() against the live DB to replenish New-status signals consumed by this verification's own Playwright runs"
    resolution: committed 9c45148 (backend/scripts/seed.ts extended with the same 2 events using the file's own idempotent findOrInsert pattern — a fresh sandbox boot reproduces this automatically, not a live-only fix)
per_test:
  - test: 1
    verdict: pass
    note: "🤖 Auto-check: persona-dashboards.spec.ts (4/4) proves this live against the real stack; DB confirms 4 Open incidents in eoc_director's jurisdiction so the Active Incidents tile has real data to show, not just a zero."
    confidence: proven
  - test: 2
    verdict: pass
    note: "🤖 Auto-check: same spec run (4/4) covers PER-03's /my-work landing and its 3 named actions."
    confidence: proven
  - test: 3
    verdict: pass
    note: "🤖 Auto-check: persona-dashboards-per04-per05.spec.ts (5/5) includes an explicit toHaveCount(0) assertion that no SideNav rail renders for field_responder at a desktop viewport."
    confidence: proven
  - test: 4
    verdict: pass
    note: "🤖 Auto-check: same spec run (5/5); test 4 asserts exactly 3 display-scale KPIs and zero chart/SVG elements, test 5 asserts the facet resets to Admin on reload."
    confidence: proven
  - test: 5
    verdict: pass
    note: "🤖 Auto-check: ics-form-aidraft.spec.ts (1/1) proves the full draft→approve cascade plus a direct-fetch bypass of an unapproved draft rejected 400 server-side. Target incident 2fc86067-… has zero ics_forms rows — clean slate to repeat the flow."
    confidence: proven
  - test: 6
    verdict: pass
    note: "🤖 Auto-check: same spec run (1/1) proves discard leaves the narrative field untouched."
    confidence: proven
  - test: 7
    verdict: pass
    note: "🤖 Auto-check: signal-triage.spec.ts (4/4) includes an explicit before/during/after incidents-count assertion that Promote alone never creates a row. 2 fresh New-status signals (02009c9b-…, 4bba168f-…) are available for you to try, replenished after the automated run consumed earlier fixtures."
    confidence: proven
  - test: 8
    verdict: pass
    note: "🤖 Auto-check: same spec run (4/4) covers the Dismiss-disabled-until-reason-typed flow against the server's 422 backstop. Signal a84c478a-… (High confidence) is available for you to try."
    confidence: proven
stale_placeholders: 0 (advisory — see note)

**Advisory note (not a gap):** `verify stale-placeholders` flagged 4 lines referencing a future phase, but on inspection none name a phase-6-relevant unbuilt promise: `operating-picture.ts:221`'s TODO is explicitly conditioned on F12/F17 (both documented in REQUIREMENTS.md as deferred to v2, never scoped into any v1 phase); `api-clients.ts:105`'s comment describes a hypothetical future external-API-consumer never required by any phase 2-6 success criterion; and `PlatformMonitoring.tsx`'s two "Phase 1 placeholder" hints are honest admissions with no committing future phase. None block any of this phase's 8 tests.

**Advisory note (not a gap):** the frontend dev-server log shows one `Failed to scan for dependencies` / `Failed to resolve entry for package "@epmp/design-system"` warning from Vite's initial dependency pre-bundle at cold start. The app is confirmed serving correctly now (`curl :5173/` returns the real SPA shell, `routes_probed` above all 200), so this was a transient cold-start condition that resolved itself, not a live defect.

**Advisory note (not a gap):** the 3g-i static heuristic flagged 2 dev-proxy loopback targets (`/api` → `localhost:8080`, Keycloak → `localhost:8081`) against 4 compose services. Verified directly: this project's documented architecture runs the backend/frontend natively (not as compose services) with compose providing only infra dependencies (db/keycloak/nats/opa) — both targets are live and correctly reachable (`curl localhost:8081` → 302 real Keycloak via its published port, `curl localhost:8080/api/v1/me` → 401 real backend). The static rule's "frontend-in-its-own-container" assumption doesn't apply to this native-process architecture; direct reachability is proven, not a gap.

deploy_check: PASS — `pivota-deploy-check.cjs` (14/14 checks PASS: profile, healthz, no-secrets, image-user, PORT-reads-from-env, Trivy D7 no fixable CRITICALs)
browser_suite: fail (execute) — 97/100 Playwright, 3 failures, all cited from 06-GATE.md/06-VERIFICATION.md as pre-existing shared-sandbox fixture-accumulation artifacts (admin-users-roles.spec.ts, field-mobile-sync-conflict.spec.ts, signal-triage.spec.ts fixture exhaustion) with zero overlap with any Phase 6 file. This verify's own fresh re-runs of signal-triage.spec.ts (4/4), persona-dashboards*.spec.ts (9/9), and ics-form-aidraft.spec.ts (1/1) — the specs covering this phase's own 8 UAT tests — all passed cleanly.

## Gaps

- truth: "Open Tasks / Pending Resource Requests tiles on the EOC Dashboard (PER-01) are either a real count or honestly captioned as not-yet-tracked — never both a real nonzero number and a caption claiming the feature doesn't exist yet"
  status: failed
  reason: "User reported: Open tasks 2 Tasks module ships in a later phase; Pending resource requests 1 Resource requests module ships in a later phase. Confirmed by direct code read: backend/src/modules/incident-ops/dashboard.ts computes REAL COUNT(*) queries for open_tasks/pending_resource_requests against Phase 3's real tasks/resource_requests tables (06-01-SUMMARY.md explicitly documents this as an intentional correction — hardcoding zero would have been a regression). frontend/app/src/pages/dashboard/EocDashboard.tsx:109,114 hardcodes the hint text 'Tasks module ships in a later phase' / 'Resource requests module ships in a later phase' on BOTH tiles regardless of the real value returned — the hint was written for a stale premise (the plan's original hardcoded-zero assumption) and never updated once dashboard.ts started returning real data. DB confirms the live values: tasks (2 Open/In-progress/Awaiting-approval... actually 1 Open+1 In progress=2), resource_requests (1 Awaiting approval) in eoc_director's jurisdiction scope."
  severity: major
  test: 1
  source: user
  confidence: proven
  root_cause: "frontend/app/src/pages/dashboard/EocDashboard.tsx:106-115 — the `hint` prop on the Open tasks / Pending resource requests Stat tiles is a hardcoded string claiming the feature isn't tracked yet, written when 06-05-PLAN.md's premise assumed dashboard.ts would return hardcoded zeros. 06-01's own execution deviated from that premise (dashboard.ts actually computes real COUNT(*) queries, confirmed in 06-01-SUMMARY.md's own Deviations section), but EocDashboard.tsx's hint text was never updated to match — it still unconditionally shows the stale explanation even when `summary.open_tasks`/`summary.pending_resource_requests` is a genuine nonzero value."
  artifacts:
    - path: "frontend/app/src/pages/dashboard/EocDashboard.tsx"
      issue: "Lines 106-115: hint text hardcoded to 'ships in a later phase' regardless of the actual (real, nonzero) value received from the backend"
  missing:
    - "Make the hint conditional: only show 'Tasks module ships in a later phase' / 'Resource requests module ships in a later phase' styled language when the value is genuinely unanswerable (there is none such for these two fields anymore, per 06-01) — otherwise show a correct, real caption (or no hint at all) for a field the backend actually counts. The only field that still deserves a 'ships in a later phase'-style caption is notifications_pending_ack, which dashboard.ts documents as a genuine structural zero (no per-recipient user_id column in this schema)."
  debug_session: ""

- truth: "The Dismiss-signal confirmation Modal's Reason text box renders fully inside the Modal's bounds, at any viewport"
  status: failed
  reason: "User reported: the test case works as expected, but the formatting of the text box is messed up. it goes outside the modal. (Signal Triage Queue's Dismiss Modal, SignalTriageQueue.tsx:296-325, wraps a multiline TextField with no wrapping container styling of its own — likely a width/overflow interaction between the multiline textarea and Modal's padding/flex layout.)"
  severity: cosmetic
  test: 8
  source: user
  confidence: hypothesis
  root_cause: ""
  artifacts:
    - path: "frontend/app/src/pages/signals/SignalTriageQueue.tsx"
      issue: "Lines 319-325: the Dismiss Modal's multiline TextField (Reason) has no explicit width/max-width/overflow constraint beyond whatever TextField.css's own width:100% provides — needs diagnosis against Modal.css's flex/padding layout to find why the rendered textarea overflows the modal's visible bounds"
  missing: []
  debug_session: ""
