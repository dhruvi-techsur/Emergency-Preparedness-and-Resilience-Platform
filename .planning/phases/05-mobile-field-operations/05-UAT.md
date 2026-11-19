---
status: complete
phase: 05-mobile-field-operations
source: [05-01-SUMMARY.md, 05-02-SUMMARY.md, 05-03-SUMMARY.md, 05-04-SUMMARY.md, 05-05-SUMMARY.md]
started: 2026-11-18T18:21:19Z
updated: 2026-11-19T09:44:14Z
---

## Current Test

[testing complete]

## Tests

### 1. Field Home — Today's Tasks + Report Observation Entry Point
expected: Signing in as field-responder@epmp.local and navigating to /field shows a list of today's tasks (with Skeleton while loading, informational EmptyState if none) and a single size="lg" sticky "Report observation" button at the bottom.
live: pass — `GET /api/v1/tasks?owner=bf2b800e-...` (field-responder bearer token) → 2 seeded tasks returned (`UAT-FIELD-OPEN`, `UAT-FIELD-INPROGRESS`); screenshot `.pivota/uat-shots/1-field-home.png` confirms both render with status badges + the sticky "Report observation" button
result: issue
reported: "I landed on home page then on left side in field option i saw my tasks when i opened it then i got the two tasks that u have mentioned but no button is there on theat page then on home scree on left side in field option below my task there is a rport button when i open it then i see report observation page"
severity: major

### 2. My Tasks — One-Tap Status Update (online)
expected: On /field/tasks, tapping Start or Mark done on a task immediately shows a "Queued" badge overlay, then updates to reflect the new status once the server confirms (while online).
live: gap (fixed) — initial attempt found both seeded tasks already status=Overdue (correctly showing no action button, by design) because `backend/scripts/seed.ts`'s original due_at was a short relative offset (2h/30min) computed once at seed time, and findOrInsert() never updates an existing row, so the Phase-3 overdue-sweep correctly flipped both tasks hours before this human round. Fixed in commit `d83e9c0`: due_at → +30 days (never stale) + an idempotent self-heal UPDATE for sandboxes already seeded under the old values. Re-verified: `UPDATE tasks SET status='Open'/'In progress', due_at=now()+30d` confirmed via direct DB read after the fix
result: pass
reported: "Pass — works as expected"

### 3. Report Observation — Photo + Location Capture + Offline-First Submit
expected: On /field/report, tapping the photo button opens the camera/file picker and shows a thumbnail + "✓ Captured" after selection; tapping the location button captures lat/long/accuracy text; submitting with no data shows a client-side validation message; submitting a valid report always succeeds and navigates away, even if simulated offline (queued, not lost).
live: pass — `curl -F photo=@probe.bin .../field-reports/{id}/photos && curl .../photos/{photoId}` → upload 204, download 200 2048B, bytes_match=yes (self_check 3f)
result: pass
reported: "Pass — works as expected"

### 4. SyncStatus Pinned + Shows "Queued" When Offline
expected: On every field-mobile screen, a SyncStatus indicator (icon+word+color) is pinned at the top. Going offline (e.g. via DevTools) shows "Offline"/"Queued" wording, never a silent failure or disappearance of the submitted item.
live: pass — `playwright screenshot .pivota/uat-shots/{1,2,3,6,7,8}-*.png` → "✓ Online" SyncStatus pill pinned at the top of every field-mobile screen (6/6)
result: pass
reported: "Yes, I see it"

### 5. Auto-Sync on Reconnect + Timeline Entry
expected: After queuing a field report while offline, reconnecting automatically syncs the queued item with no manual "upload" step, and the related incident's Timeline shows a "Field report synced" entry.
live: NOT RUN — the offline→reconnect transition and watching a live Timeline entry append is a timed interaction a static probe cannot drive; the server-side mechanism (`withTimelineTransaction` + `TimelineService.append('Field report synced', ...)` in field-reports.ts's sync-batch handler) was read directly by the phase verifier (05-VERIFICATION.md truth #3) and is not re-derived here
result: skipped
reason: "too technical for me to test"

### 6. Sync Conflict Resolution — No Default Choice, Explicit Commit
expected: When a field report conflicts with a newer EOC-side change, visiting /field/conflicts/:id shows BOTH the field version and the current EOC version side-by-side with no pre-selected/default button; clicking "Keep mine" or "Keep EOC version" commits the choice server-side and the conflict cannot be re-resolved afterward.
live: pass — `GET /api/v1/sync-conflicts/0dfe7e5e-a676-4085-a2f3-35e437600ee5` (real conflict produced through the actual sync-batch conflict-detection code path, not hand-inserted) → 200, both `field_version` and `eoc_version` present and populated; screenshot `.pivota/uat-shots/6-sync-conflict.png` confirms both sections render ("Your version" / "Current EOC version") with real, differing data
result: pass
reported: "Pass — works as expected"

### 7. Queued Submissions View — Delete/Retry
expected: /field/queued shows every queued field report with live status; a pending item can be Deleted; a failed item can be Retried (with a fresh submission); a conflicted item taps through to its Sync Conflict Resolution screen.
live: pass — `playwright screenshot .pivota/uat-shots/7-queued-submissions.png` → renders correctly; user's own real submissions from test 3 show with correct "Synced" status, type, and timestamp
result: pass
reported: "Queued submissions Structural damage Synced Synced: 19 Nov, 15:07 Structural damage Synced Synced: 19 Nov, 14:36" / "Yes, looks correct and readable"

### 8. Field Map + Bottom-Nav Wiring
expected: /field/map shows the operating-picture map with real incident/resource markers plus the user's own queued/pending field reports as visually distinct (dashed-outline) markers. All 6 field-mobile screens are reachable via a 4-item bottom nav bar (Tasks/Report/Map/Profile) visible at mobile breakpoints for the field_responder role.
live: gap — `GET /api/v1/operating-picture/markers` (field-responder bearer token) → 3 real markers rendered correctly (confirmed in `.pivota/uat-shots/8-field-map.png`); BUT `GET /api/v1/me/nav-config` (same token) → the bottom-bar's actual rendered items are `['plans','operating-picture','incidents','tasks']` (desktop Prepare/Monitor/Activate/Coordinate groups), NOT the `Field` group's `['field-tasks','field-report','field-map-nav','field-profile']` — confirmed in every captured screenshot (`1,2,3,6,7,8-*.png` all show "Plans & playbooks / Operating picture / Incidents / Tasks" as the bottom bar, never "My Tasks / Report / Map / Profile")
result: issue
reported: "Markers are there on map but there are not clickable" / "Yes, markers render on the map background" — map-rendering half confirmed correct by the user (marker-click/popup was never in this screen's documented scope, confirmed via 05-04-PLAN.md Task 2, so that part is NOT a gap); the bottom-nav-wiring half of this test's expected behavior is the self_check-discovered gap above (not independently re-driven by the human, since they test exclusively via the desktop left-side SideNav, which correctly shows the Field group — the bug only manifests in the mobile bottom-bar variant)
severity: blocker

## Summary

total: 8
passed: 5
issues: 2
pending: 0
skipped: 1

## Self-Check

boot: 200
data: seeded 3 preconditions (2 tasks, 1 sync conflict; committed via `backend/scripts/seed.ts` lines 774-931, commit `681374a`) — markers and field_reports RBAC grant already present
routes_probed: 7 ok / 0 failed (/, /field, /field/tasks, /field/report, /field/queued, /field/map, /field/conflicts/:id)
cookie: n/a (bearer-token auth via Authorization header + localStorage, not cookies — confirmed in api-client.ts)
browser_urls: none (0b scan: 0 gaps/0 advisories across client-env/client-fallback/client-runtime; 3e re-scan of all 7 field-mobile flow bodies: 0 gaps/0 advisories)
documented_limitations: none found
file_roundtrip: pass — field-report photo upload+download round-trip: 2048B uploaded, 2048B downloaded, bytes_match=yes, same-origin path only (`POST/GET /api/v1/field-reports/:id/photos[/:photoId]`), no internal object-store origin ever reached the client
browser_origin: pass — `/api/v1/tasks` through the :7777 preview proxy: no-origin=401, with-origin=401 (identical — route's own auth semantics, not an origin rejection); shell-with-origin=200
browser_suite: pass (execute) — cited from 05-GATE.md, not re-run (79/79 Playwright, including both field-mobile specs)
stale_placeholders: 4 found, 0 new gaps — all 4 (operating-picture.ts:221 F12/F17 TODO, api-clients.ts:105 Phase-2+-consumer contract, PlatformMonitoring.tsx:59/69) were already reviewed identically in Phase 2/3/4's prior UAT rounds and assessed as non-blocking (F12/F17 are explicitly v2-deferred per REQUIREMENTS.md; no phase in ROADMAP.md ever builds an api-client-authenticated consumer; the PlatformMonitoring labels are accurate past/present-tense scope notes, not broken promises) — this round's assessment is unchanged, consistent with precedent
repairs: none — self_check made no changes to the running instance; the only dirty paths are this file and `.pivota/uat-shots/*.png` (verification's own artifacts)
deploy_check: PASS — `pivota-deploy-check.cjs`: D3 profile fields, C1 healthz, C2/C3 no leaked secrets, D1 docker build, D2 non-root USER 10001, D4 PORT-only run, D5 /healthz→200, C6 /→200, C4 reads-PORT on a second port, D7 Trivy no fixable CRITICAL CVEs — all PASS
agent_run: not due (this phase makes no live model call)
per_test:
  - test: 1
    verdict: advisory
    note: "🤖 Auto-check: both seeded tasks (UAT-FIELD-OPEN, UAT-FIELD-INPROGRESS) confirmed reachable via the real API and rendering correctly in the captured screenshot. Judge the visual/layout yourself."
    confidence: proven
  - test: 4
    verdict: advisory
    note: "🤖 Auto-check: SyncStatus renders '✓ Online' pinned at the top on every screenshot captured. The offline-state wording needs a DevTools toggle to verify."
    confidence: proven
  - test: 6
    verdict: advisory
    note: "🤖 Auto-check: the real unresolved conflict (produced through the actual sync-batch detection code path) renders both field and EOC versions correctly with real, differing data. Judge the no-default-selection / explicit-commit UI behavior yourself."
    confidence: proven
  - test: 8
    verdict: fail
    note: "🤖 Auto-check: the operating-picture map and its markers render correctly, but the bottom navigation bar for this real field_responder identity shows the WRONG 4 items — 'Plans & playbooks / Operating picture / Incidents / Tasks' (desktop groups) instead of the Field group's 'My Tasks / Report / Map / Profile'. This is a confirmed, reproducible defect — see the Gaps entry below."
    confidence: proven

## Gaps

- truth: "All 6 field-mobile screens are reachable via a 4-item bottom nav bar (Tasks/Report/Map/Profile) visible at mobile breakpoints for the field_responder role"
  status: failed
  reason: "self_check drove this directly: AppShell.tsx:91 derives `flatItems = navGroups.flatMap((g) => g.items)` over the FULL nav_groups array (every group the role has ANY permission for, in the backend's fixed emission order: Prepare→Monitor→Activate→Coordinate→Improve→Field→Admin), then SideNav.tsx:98 takes `mobileBottomBarItems.slice(0, 4)` — the first 4 items of the WHOLE flattened list, not the Field group specifically. The real seeded field_responder identity (field-responder@epmp.local) holds view-level grants on incidents/plans/tasks/resource_requests/notifications/reporting (seeded across Phases 1-4 for legitimate 'situational awareness' reasons — see backend/scripts/seed.ts lines 124, 150, 191, 259, 301, 338, 368, 395, 422), which populates the Prepare/Monitor/Activate/Coordinate groups BEFORE the Field group ever appears (confirmed: Field group's 4 items sit at flattened array indices 9-12, never indices 0-3). Verified end-to-end: `GET /api/v1/me/nav-config` with a real field_responder bearer token, flattened and sliced exactly as AppShell.tsx/SideNav.tsx do it, yields `['plans','operating-picture','incidents','tasks']` — confirmed visually in all 6 captured screenshots (every one shows 'Plans & playbooks / Operating picture / Incidents / Tasks' as the bottom bar, never 'My Tasks / Report / Map / Profile'). 05-VERIFICATION.md's claim that this mechanism was 'confirmed... — nav-config's Field group... renders through this unmodified, pre-existing mechanism' checked that the code path EXISTS but never simulated it against the actual permission set a real field_responder holds, so it never observed this failure mode."
  severity: blocker
  test: 8
  source: self_check
  confidence: proven
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Signing in as field-responder@epmp.local and navigating to /field shows a list of today's tasks AND a sticky 'Report observation' button together on the same screen"
  status: failed
  reason: "User reported: landed on home, used the left-side 'Field' group, opened 'My Tasks' and saw the 2 tasks correctly, but no Report button was on that page; the Report button was on a DIFFERENT page reached via the 'Field' group's separate 'Report' item, which opens the Report Observation form directly rather than Field Home. This corroborates test 8's gap from the SAME root cause under a different symptom: the tester is on a desktop-width viewport (left-side SideNav, not the bottom bar), where `nav-config`'s 'Field' group renders 4 separate SideNav items — 'My Tasks' (href /field/tasks), 'Report' (href /field/report), 'Map' (href /field/map), and 'Profile' (href /field, backend/src/modules/auth-org/routes.ts:425) — with NO item labeled anything like 'Field Home' to make it obvious that clicking 'Profile' is actually the way to reach the combined tasks+Report-button screen the test describes. A user reasonably tries 'My Tasks' first (matching what they're looking for) and never discovers the Report button lives on Field Home, reached only through a misleadingly-labeled 'Profile' link."
  severity: major
  test: 1
  source: user
  confidence: hypothesis
  artifacts: []
  missing: []
  debug_session: ""
