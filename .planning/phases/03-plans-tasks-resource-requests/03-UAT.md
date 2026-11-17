---
status: diagnosed
phase: 03-plans-tasks-resource-requests
source: [03-VERIFICATION.md]
started: 2026-11-17T18:10:48Z
updated: 2026-11-17T20:48:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Materialize-Tasks UI Trigger Check
expected: |
  Sign in as planning_logistics_chief, open the Approved plan
  "UAT-MATERIALIZE-READY Generator Pre-Positioning Plan" (section
  "Generator pre-positioning" has 1 linked task template,
  "Pre-position generators (UAT)"), then open an incident (e.g.
  "UAT-ASSIGN-ROLE Default Agency Flood") and look for any button, menu
  item, or workspace affordance offering that plan's task templates for
  one-click creation. Per success criterion 2, this should be reachable
  without writing the task from scratch.
live: gap — `grep -rn "materialize-tasks\|materializeTask\|Materialize" frontend/app/src` → zero matches repo-wide (no button/menu/affordance anywhere renders or calls this flow). Separately drove `POST /api/v1/plans/dd4f6c95-ea2e-4cc2-a375-1e9a36a63a59/materialize-tasks {"incident_id":"ab8eba10-9a07-4181-9f5f-83bc2f72e702"}` as planner@epmp.local through the port-7777 preview proxy → 200, `{"created":[{"title":"Pre-position generators (UAT)","status":"Open"}],"skipped":[]}` — the backend endpoint is fully functional; the gap is specifically the absence of any UI control that calls it.
result: issue
reported: "No — it's a blank form, not from the template. [On the plan's own page, the closest thing is the Incident Workspace's 'New task' button under Tasks in the Coordinate section — but that opens a manual create-task form (name/owner/due date typed by hand), not a one-click creation from the plan's linked task template.]"
severity: major

## Summary

total: 1
passed: 0
issues: 1
pending: 0
skipped: 0

## Self-Check

boot: 200 (http://127.0.0.1:5173/), backend http://127.0.0.1:8080/healthz -> 200 {"status":"ok"}
data: seeded 2 preconditions — planner@epmp.local/eocdirector@epmp.local jurisdiction_scope grant + Approved plan "UAT-MATERIALIZE-READY Generator Pre-Positioning Plan" with linked task template "Pre-position generators (UAT)", committed `backend/scripts/seed.ts` sha 59dee19 (pivota_spec-data-doctor)
routes_probed: 8 ok / 0 failed (/, /plans, /plans/new, /tasks, /tasks/new, /resource-requests, /resource-requests/new, backend /healthz — all 2xx)
cookie: n/a — Bearer-token SPA (session JWT in sessionStorage via oidc-client-ts), issues no Set-Cookie for the app's own session; confirmed via direct probe (no Set-Cookie header on an authenticated request). Same as Phase 2's finding — iframe-cookie class does not apply.
browser_urls: 0 gaps / 0 advisories from both the static 0b scan (no client-exposed env vars, no in-source fallbacks, no runtime client config) and the live 3e scan (8 driven flows, 0 bundles found)
documented_limitations: []
repairs:
  - kind: data
    what: "pivota_spec-data-doctor seeded jurisdiction_scope for planner@epmp.local/eocdirector@epmp.local + an Approved plan with a linked task template, so this round's UAT walkthrough doesn't require authoring+approving a plan from scratch"
    resolution: committed 59dee19
browser_suite: pass (execute) — 03-GATE.md records browser_suite: pass (0 fix attempts, all 7 waves build+test pass); not re-run here per 3b
deploy_check: PASS — re-run fresh this session (`pivota-deploy-check.cjs`): D3/C1/C2/C3/D1/D2/D4/D5/C6/C4/D7 all PASS, exit 0
agent_run: not due (this app calls no model in Phase 3 scope — AI assistance is Phase 6)
3g_origin_gate: pass — `/api/v1/plans` via the port-7777 preview proxy returns the same 401 SESSION_EXPIRED with and without a browser Origin header (route semantics — auth required, not an Origin rejection); shell itself loads 200 with an Origin header
3g-i_dev_proxy: advisory, not a gap — vite.config.ts's proxy targets `localhost:8080`/`localhost:8081`; `docker compose config --services` reports 4 services (db/keycloak/nats/opa), but per `.pivota/start-dev.sh`'s documented Shape-B classification this is a native multi-process app (frontend+backend run natively in-sandbox) with compose providing ONLY dependency services. Empirically confirmed both targets resolve: `curl 127.0.0.1:5173/realms/epmp/.well-known/openid-configuration` -> 200 real Keycloak doc; `curl 127.0.0.1:5173/api/v1/plans` -> 401 (auth-gated, not dead) — same conclusion as Phase 2's prior round
3d_orphan_pages: none — all Phase 3 routes (/plans, /plans/new, /plans/:id, /plans/:id/edit, /tasks, /tasks/new, /tasks/:id, /resource-requests, /resource-requests/new, /resource-requests/:id) have real inbound source-level navigate()/Link calls confirmed in PlanRepository.tsx, PlanDetail.tsx, main.tsx's route tree, and IncidentWorkspace.tsx's embedded TaskList/ResourceRequestList
3f_object_store: skipped (this app has no file storage)
stale_placeholders: 4 findings reviewed, 0 treated as gaps — operating-picture.ts:221's "TODO(Phase 3+)" refers to F12/F17 (weather/hazard feeds, document-system integration), both explicitly deferred to v2 per REQUIREMENTS.md (not in this project's v1 scope at all, let alone owed by a completed phase); api-clients.ts:105's "Phase 2+'s actual API-client-authenticated routes" is Phase-1-authored text about an external-partner-API consumer that F10's own roadmap entry never scheduled for any specific phase; PlatformMonitoring.tsx:59/69 are the same two Phase-1-authored, past-tense hint strings already assessed clean in Phase 2's own UAT round
dev_log_scan: one non-fatal advisory — Vite's one-time dependency pre-bundling scan logged `Failed to resolve entry for package "@epmp/design-system"` at cold start (same pre-existing Phase 01-10 tsconfig-path-mapping workaround already documented in Phase 2's UAT); root route and all 7 Phase 3 routes served 200 on every subsequent request this round. No fatal signatures (5xx, unhandled exception, EADDRINUSE, MissingSecret) found in the dev-server log; no fatal markers in db/keycloak/nats/opa compose logs
per_test:
  - test: 1
    verdict: fail
    note: "🤖 Auto-check: confirmed via repo-wide source grep that zero call sites exist anywhere in frontend/app/src for POST /api/v1/plans/{id}/materialize-tasks — no button, menu item, or workspace affordance renders this flow. Separately drove the backend endpoint directly as a real planning_logistics_chief session through the preview proxy: 200, task created successfully. So the backend half works end-to-end; the gap is specifically that no UI control anywhere invokes it. The human's own click-through confirmed this: the Incident Workspace's 'New task' button (the only candidate on the page) opens CreateTask.tsx's ordinary manual form — confirmed in code to have its 'Linked plan section' dropdown permanently empty/disabled — not a template-driven one-click flow."
    confidence: proven

## Gaps

- truth: "A user can link a plan section to a task template, and when an incident references that plan, the linked template is offered for one-click task creation rather than writing the task from scratch"
  status: failed
  reason: "self_check: repo-wide grep for materialize-tasks/materializeTask/Materialize across frontend/app/src returns zero matches — no button, menu item, or workspace affordance anywhere calls POST /api/v1/plans/{id}/materialize-tasks. Confirmed the backend endpoint itself is fully functional (200, task created) when driven directly as planner@epmp.local through the preview proxy, so the gap is isolated to the missing UI trigger, matching 03-VERIFICATION.md's own documented finding. User reported: confirmed by hand-walkthrough — the Incident Workspace's 'New task' button (the only candidate control) opens a blank manual create-task form, not a template-driven one-click flow."
  severity: major
  test: 1
  source: self_check
  confidence: proven
  root_cause: "Two compounding, independently-confirmed scope-boundary omissions, not bugs. (1) UI gap: no plan in Phase 3's 9-plan sequence ever included a task to build a materialize-tasks UI control — 03-03-PLAN.md scoped materialize-tasks as backend-API-only; 03-05-PLAN.md built the plan-authoring/linking UI but never included a materialize-trigger button; 03-08-PLAN.md (the phase's terminal integration-proof plan) is where the gap became self-aware, pre-emptively authorizing its own e2e test to call the endpoint via raw fetch() 'if no dedicated UI button exists yet.' (2) Schema gap: incidents (backend/migrations/1700000000002_incident-ops-schema.js) has zero columns referencing plans — confirmed by direct read, and independently confirmed by CreateTask.tsx's own code comment hardcoding planSectionOptionsSource=[]. TechArch's ER diagram never depicts an incident->plan edge either, only plan_task_templates->tasks — this is an FRD/TechArch spec-level gap, not just an implementation oversight. materialize.ts's actual API shape ({incident_id, section_ids?}) works around the missing FK by having the user supply the target incident explicitly (a plan-initiated flow) rather than the incident-initiated flow the roadmap's literal language implies."
  artifacts:
    - path: "frontend/app/src/pages/plans/PlanDetail.tsx"
      issue: "No 'Materialize tasks' button or any control that calls POST /api/v1/plans/{id}/materialize-tasks — most natural home for a plan-initiated flow, requires no schema change"
    - path: "frontend/app/src/pages/incidents/IncidentWorkspace.tsx"
      issue: "No reciprocal affordance for an incident-initiated flow ('this incident's plan has N linked templates — create them now'); would require the schema change below first"
    - path: "frontend/app/src/pages/tasks-resources/CreateTask.tsx"
      issue: "planSectionOptionsSource hardcoded to an empty array (line ~84) — symptom of the same incidents->plans schema gap"
    - path: "backend/migrations/1700000000002_incident-ops-schema.js"
      issue: "incidents table has no plan_id / linked-plan column — FRD's 'when an incident references that plan' premise has no schema support anywhere in the phase"
  missing:
    - "Minimal/correct-now fix (no schema change): a 'Materialize tasks' button on PlanDetail.tsx (visible when plan.status === 'Approved' and any section has linked templates) that opens a modal with an incident Combobox (same pattern CreateTask.tsx already uses) and calls POST /api/v1/plans/{id}/materialize-tasks, surfacing {created, skipped} to the user"
    - "Full roadmap-literal fix (larger, optional): add incidents.plan_id (nullable FK), surface it in incident create/edit, add the reciprocal affordance in IncidentWorkspace.tsx, and wire CreateTask.tsx's currently-empty plan-section lookup to a real query"
  debug_session: ".planning/debug/materialize-tasks-ui-trigger-missing.md"
