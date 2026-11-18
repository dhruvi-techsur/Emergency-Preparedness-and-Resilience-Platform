---
status: diagnosed
trigger: "task-list-overdue-not-visible"
created: 2026-11-18T00:00:00Z
updated: 2026-11-18T00:30:00Z
---

## Current Focus

hypothesis: CONFIRMED (candidate 1, specific mechanism identified and directly reproduced): the preview-proxy path (:7777/preview/5173/) never bootstraps the React app at all because Vite's root-relative asset script tags (`/src/main.tsx`, `/@vite/client`, `/@react-refresh`) resolve against the browser's actual origin (127.0.0.1:7777) rather than staying under the /preview/5173/ prefix, landing on the exec-server's own protected namespace (401). #root never mounts; the page is blank.
test: n/a -- root cause confirmed via direct Playwright navigation + screenshot + network capture through the documented in-sandbox preview-proxy path.
expecting: n/a
next_action: none -- return ROOT CAUSE FOUND to caller; do not fix (goal: find_root_cause_only)

## Symptoms

expected: Signed in as commander@epmp.local (incident_commander role, tasks:edit permission), navigating to /tasks should show a task titled "UAT-OVERDUE Verify generator fuel levels" with an Overdue status badge. The Task List should also keep itself current via a ~30s background poll (React Query refetchInterval: 30_000 in frontend/app/src/pages/tasks-resources/TaskList.tsx) without requiring a manual page reload.
actual: User reports they do not see "UAT-OVERDUE" in the list, and the list does not appear to poll every 30 seconds.
errors: None reported by the user.
reproduction: Test 3 in .planning/phases/03-plans-tasks-resource-requests/03-UAT.md — sign in as commander@epmp.local / devpass123 at http://127.0.0.1:5173, navigate to /tasks, look for "UAT-OVERDUE Verify generator fuel levels" with an Overdue badge, and watch for ~30-40s without refreshing.
started: Discovered during this UAT round (2026-11-18), immediately after self_check's automated Playwright re-drive of same flow succeeded (task visible as first row, Overdue badge, confirmed via network capture of GET /api/v1/tasks JSON).

## Eliminated

## Evidence

- timestamp: 2026-11-18T00:05:00Z
  checked: frontend/app/src/pages/tasks-resources/TaskList.tsx (full file, 429 lines)
  found: refetchInterval 30_000 is set unconditionally on the main useQuery (line 138), no enabled:false guard, no conditional disabling. queryKey includes statusFilter/ownerFilter/dueWindowFilter/incidentId - on fresh page load with no filters these are all empty strings/undefined, stable. Default empty state -> isOrgWideEmpty only true if total===0 and no active filter. Sort/pagination controlled server-side.
  implication: Frontend polling code itself looks structurally correct; no obvious frontend bug disabling the poll under default filters.

## Resolution

root_cause:
fix:
verification:
files_changed: []

- timestamp: 2026-11-18T00:15:00Z
  checked: backend/src/modules/incident-ops/tasks.ts full GET /api/v1/tasks handler, jurisdiction-scope WHERE clause (line 197-198), ORDER BY (line 240)
  found: WHERE clause is `(t.incident_id IS NULL OR i.jurisdiction_id = ANY($1))` with $1=req.epmpUser.jurisdiction_scope -- an array. commander@epmp.local's jurisdiction_scope = {fb8f2a03-7a90-4f7a-89ca-0edca2516e80}, task's incident jurisdiction_id = fb8f2a03-7a90-4f7a-89ca-0edca2516e80 -- direct match confirmed via DB query. ORDER BY t.due_at ASC puts UAT-OVERDUE (due_at 2026-01-01, earliest of all tasks) at position 1 of 7 total tasks -- well within default page_size=25, first page. DB query directly confirms only ONE commander@epmp.local row exists with this exact jurisdiction_scope.
  implication: Candidates 4 (identity/jurisdiction mismatch) and 5 (pagination/sort) are REFUTED by direct evidence -- the backend query, as written, unambiguously returns this task first for this exact account.

- timestamp: 2026-11-18T00:20:00Z
  checked: frontend/app/vite.config.ts full file (proxy config) + runtime-environment.md section 1 and 9 (sandbox preview-proxy contract)
  found: Vite config has NO `base` option set (defaults to '/'), so index.html's script tags are emitted root-relative (`/src/main.tsx`, confirmed via curl of GET / both direct and via proxy -- byte-identical HTML, no base-path rewriting in the proxy). Confirmed via direct curl AND an actual headless-Chromium Playwright navigation to http://127.0.0.1:7777/preview/5173/ (the exact path environment_notes says mirrors Pivota's real Preview tab): the browser's root-relative requests for /@vite/client, /src/main.tsx, /@react-refresh resolve against the ORIGIN (127.0.0.1:7777), NOT under the /preview/5173/ prefix, landing on the exec-server's OWN protected routes, which require `x-pivota-exec-token` (observed 401 "sandbox exec server requires a valid x-pivota-exec-token" on all three). React never mounts: #root stays empty, zero console/app activity. Requesting the SAME assets WITH the /preview/5173/ prefix explicitly (e.g. curl .../preview/5173/src/main.tsx) returns 200 -- proving the asset exists and is served fine, it's only reachable at the prefixed path, which the SPA's own root-relative HTML never requests.
  implication: This is a genuine, directly-reproduced (not just inferred) infrastructure-class bug: ANY access to the SPA through the preview-proxy path fails to bootstrap the React app AT ALL (not merely "missing one row") because Vite's default root-relative asset paths escape the /preview/<port> prefix the proxy requires. This matches runtime-environment.md's own documented failure class (§9's "root-relative path escapes the proxy prefix") but is NOT one of the already-fixed issues (02-08-PLAN fixed the OIDC KEYCLOAK_AUTHORITY hardcoding, a DIFFERENT, already-resolved bug; this vite.config base-path gap was never addressed).

- timestamp: 2026-11-18T00:22:00Z
  checked: frontend/app/playwright.config.ts
  found: `baseURL: 'http://localhost:5173'` -- Playwright's entire e2e suite (including self_check's own automated re-drive the task describes) runs against DIRECT access to Vite's port, completely bypassing the :7777 preview-proxy path and its path-prefix requirement entirely.
  implication: This explains why self_check's automated re-drive succeeded (task visible, first row, Overdue badge, confirmed via network capture) -- it never went through the broken proxy path at all, so it could not have encountered the asset-path-escaping bug. A human using Pivota's actual Preview tab (which DOES traverse this exact proxy path per environment_notes) would encounter total React-mount failure, not merely "one row missing."

- timestamp: 2026-11-18T00:25:00Z
  checked: `.pivota/dev-script.meta.json` catalog_entry field, presence of `frontend/app/vite.config.pivota.ts`
  found: catalog_entry = "compose" (priority 100, matched because docker-compose.yml exists for datastores -- Shape B per init-dev-server's own compose.md catalog doc). This means the react-vite.md catalog entry (priority 20) was NEVER selected, so its `allowedHosts` + overlay-config pre-exec snippet was never applied. No `vite.config.pivota.ts` sidecar exists. Confirmed separately: a direct request to Vite (127.0.0.1:5173) with a Host header simulating the real external preview hostname (`5173-pivota-sandbox-19576777.preview.pivota-ng.pivota.dev`) IS blocked by Vite itself with its own 403 "Blocked request... not allowed... add to server.allowedHosts" -- an independent, compounding issue -- but irrelevant to THIS bug because the :7777 proxy only ever sends Vite its own internal Host header (confirmed: proxied requests through :7777 reach Vite with a 200, both with and without a forged external Host on the CURL-to-:7777 leg, because :7777->Vite is a loopback proxy hop that does not forward the client's Host transparently in a way that trips allowedHosts in this configuration). The ACTUAL, reproduced-live bug is specifically the root-relative asset path issue documented above -- the SPA's own HTML requests `/src/main.tsx`, `/@vite/client`, `/@react-refresh` as absolute root-relative URLs, which a BROWSER (not curl, not Vite's proxy target resolution) resolves against `window.location.origin` (http://127.0.0.1:7777), landing on the exec-server's own protected namespace instead of being rewritten/rebased under `/preview/5173/`.
  implication: The root cause is specifically in how the SPA's bootstrap HTML is written/served for proxied access, NOT a Vite-side allowedHosts block (that's a separate, latent, not-yet-triggered risk) and NOT any application/backend logic bug. No file in this repo currently rewrites or bases Vite's dev-mode asset URLs to work under the /preview/<port>/ path prefix the sandbox's exec-server proxy requires.

## Resolution

root_cause: "The human tester's browser, reaching the app through Pivota's real Preview tab (the documented :7777/preview/5173/ proxy path per runtime-environment.md), never actually renders the React app AT ALL on that path -- not a partial/one-row-missing bug, but a complete React-mount failure. Directly reproduced with a real headless-Chromium Playwright navigation to http://127.0.0.1:7777/preview/5173/ (the exact in-sandbox equivalent of the real Preview tab, per runtime-environment.md and verify-work.md's own documented 1b preview-path probe): Vite's served index.html emits root-relative asset script tags (`<script type=module src=\"/src/main.tsx\">`, plus Vite's injected `/@vite/client` and `/@react-refresh` hook), which the BROWSER resolves against its own current origin (http://127.0.0.1:7777 -- the ORIGIN the browser is actually on when loaded via the /preview/5173/ prefix), not against the /preview/5173/ prefix the HTML was itself fetched through. All three resulting requests (`/src/main.tsx`, `/@vite/client`, `/@react-refresh`) land on the exec-server's own protected root namespace instead of being routed to Vite, and all three get a 401 'sandbox exec server requires a valid x-pivota-exec-token' -- confirmed via curl AND via an actual Playwright browser run showing all three as `requestfailed`/`console.error` entries. #root never receives any children; a screenshot of the resulting page is visually blank white (saved and reviewed in this session). This is a GENUINE, reproduced defect, and it is NOT explained by any application code (TaskList.tsx and tasks.ts backend are both confirmed correct -- the Overdue task is present, correctly jurisdiction-scoped, correctly sorted first, and refetchInterval:30_000 is unconditionally wired with no disabling path). It is entirely a dev-server/proxy-path mismatch: the app was never adapted to serve root-relative asset references in a way that survives being proxied under a /preview/<port>/ path prefix (no vite.config.ts `base` option, no exec-server-aware rewriting). This exactly explains why the human saw nothing (a totally blank page, which from the user's perspective reads as both 'I don't see the task' AND 'it doesn't poll' -- there is no React component running at all to do either) while self_check's OWN automated Playwright re-drive succeeded: Playwright's playwright.config.ts baseURL is hardcoded to http://localhost:5173 (direct Vite access), which structurally bypasses the :7777 proxy path and its path-prefix requirement entirely -- so the self-check probe could never have encountered this bug, regardless of how many times it was re-run."
fix: ""
verification: ""
files_changed: []
