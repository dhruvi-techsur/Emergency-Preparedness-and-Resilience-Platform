---
status: diagnosed
trigger: "UAT Gap (test 1, user-sourced, confidence: hypothesis): tester used desktop left-side SideNav, opened 'My Tasks', saw tasks but no Report button; the button lives on a different page ('Field Home', reached only via 'Profile')"
created: 2026-11-19T09:50:15Z
updated: 2026-11-19T10:05:00Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: CONFIRMED (a DIFFERENT root cause than the one recorded in the gap's `reason` field — see Eliminated) — see Resolution
test: n/a — root cause demonstrated directly
expecting: n/a
next_action: none — diagnosis complete, handing off to plan-phase --gaps

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: Signing in as field-responder@epmp.local and navigating to /field shows a list of today's tasks AND a sticky "Report observation" button together on the same screen.
actual: User reported: "I landed on home page then on left side in field option i saw my tasks when i opened it then i got the two tasks that u have mentioned but no button is there on theat page then on home scree on left side in field option below my task there is a rport button when i open it then i see report observation page" — i.e. clicking the Field group's "My Tasks" SideNav item shows the 2 tasks but NO Report button; a separate "Report" SideNav item below it opens the Report Observation FORM directly (not Field Home).
errors: None reported (navigation/discoverability issue, not a crash/error)
reproduction: Test 1 in UAT — sign in as field-responder@epmp.local on a desktop-width viewport, use the left-side SideNav's Field group, click "My Tasks".
started: Introduced whenever the Field group's 4 SideNav items were defined (05-04), specifically the "Profile" label/href choice documented in routes.ts's own inline comment at the time it was written

## Prior Cause (candidate, confidence: hypothesis — generated own hypotheses first per workflow rules)

Recorded in the gap's `reason`: "This corroborates test 8's gap from the SAME root cause under a different symptom" — i.e. the gap as recorded asserts gap 2 is explained by gap 1's flattening bug (AppShell.tsx/SideNav.tsx's bottom-bar `flatItems`/`.slice(0,4)` mechanism). Per workflow rules for `confidence: hypothesis`, this candidate was NOT adopted up front — independent hypotheses were formed first (below), then tested, and this candidate was tested last as one option among several.

## Eliminated
<!-- APPEND only - prevents re-investigating -->

- hypothesis: "Same root cause as gap 1 (test 8): the desktop SideNav is somehow ALSO affected by the AppShell.tsx cross-group flattening bug, e.g. the rail-variant SideNav also flattens groups or picks the wrong group's items."
  evidence: Direct Playwright render of the real desktop-viewport (1280x900) app, authenticated as the real field_responder, at both /field/tasks and /field, shows the rail SideNav rendering ALL 6 groups correctly and separately, each under its own group-label heading ("PREPARE", "MONITOR", "ACTIVATE", "COORDINATE", "IMPROVE", "FIELD") — the Field group is intact, isolated, and shows exactly its own 4 items ("My Tasks", "Report", "Map", "Profile") with correct current-item highlighting ("My Tasks" bold/highlighted when on /field/tasks; "Profile" bold/highlighted when on /field). SideNav.tsx's rail-variant code path (lines 139-180) iterates `groups.map(...)` and `group.items.map(...)` per-group — it never flattens across groups at all; only the bottom-bar variant (lines 97-128) does any flattening-adjacent operation (and that's AppShell.tsx's `flatItems`, fed in from outside). The desktop SideNav the human tester used is architecturally untouched by gap 1's bug.
  timestamp: 2026-11-19T10:00:00Z
- hypothesis: "The backend's nav_groups item ORDER within the Field group is wrong (e.g. 'My Tasks' and 'Profile' hrefs are swapped), so the user clicked the right-looking label but landed on the wrong actual screen by accident of a backend wiring bug."
  evidence: routes.ts:422-425 shows `field-tasks` (label "My Tasks") → href `/field/tasks`, and `field-profile` (label "Profile") → href `/field`. `/field/tasks` genuinely renders MyTasksField.tsx (confirmed by reading the file: a task list with Start/Mark-done one-tap buttons, NO Report Observation button anywhere in its JSX) and `/field` genuinely renders FieldHome.tsx (confirmed: task list AND a sticky "Report observation" Button in an `action-bar` div). The hrefs are wired exactly as labeled — there is no swap/wiring bug. The labels correctly describe what role_landing_config design intends ("My Tasks" → the one-tap task-status screen; "Profile" → whatever /field was designed to be), they are just a poor match for what the TEST's expected behavior (tasks + Report button together) actually needs.
  timestamp: 2026-11-19T10:02:00Z

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-11-19T09:56:00Z
  checked: frontend/app/src/pages/field-mobile/MyTasksField.tsx (full file, routed /field/tasks)
  found: Renders an `h1` "My tasks", a loading/error/empty state, and a list of Cards with status badges and a one-tap Start/Mark-done `<Button>` per task where applicable. There is NO "Report observation" button, Button with icon="send", or any navigate('/field/report') call anywhere in this file.
  implication: A user who reaches this screen (via the SideNav's "My Tasks" link) will never find a Report button here, no matter how long they look — confirms the user's reported experience exactly.

- timestamp: 2026-11-19T09:56:00Z
  checked: frontend/app/src/pages/field-mobile/FieldHome.tsx (full file, routed /field)
  found: Renders `h1` "Field home", "Today's tasks" list (same task data as MyTasksField, same query key `['field-tasks', user.id]`), AND a sticky `ep-field-home__action-bar` div containing a `size="lg"` primary `<Button icon="send" onClick={() => navigate('/field/report')}>Report observation</Button>`.
  implication: This IS the screen the test's expected behavior describes (tasks + Report button together) — but it's reached via the SideNav item labeled "Profile", not "My Tasks" or any label suggesting "home"/"tasks+report".

- timestamp: 2026-11-19T09:58:00Z
  checked: backend/src/modules/auth-org/routes.ts:407-425 (the Field group's own inline comment, written at the time the 4 items were authored)
  found: The comment literally documents the exact ambiguity this gap reports, in advance: "'Profile' still has no dedicated screen anywhere in this phase or prior phases ... so it continues to route to /field (Claude's discretion, unchanged by this fix) ... simpler than inventing a fake 5th screen just to satisfy the href requirement." This is a self-acknowledged placeholder label choice (reusing "Profile" as a filler name for a 4th required bottom-bar slot) that happens to point at the real, fully-built Field Home screen — not an accidental bug, but a naming/IA decision that collides with Field Home's real content.
  implication: The root cause is a genuine, pre-existing, self-documented design gap: the 4-item Field group was authored to satisfy a "need exactly 4 bottom-bar slots" structural constraint, and "Profile" was chosen as a label for the unavoidable 4th slot since no profile screen existed to build — but that slot's href (`/field`) is actually Field Home, the screen with the task list + Report button, and NOTHING in the SideNav/nav-config signals that to a user looking for "my tasks + report button screen." The label "My Tasks" (which IS what a user looks for) instead points at a DIFFERENT, narrower one-tap-status screen that structurally cannot have a Report button (it's scoped to task-status actions only, per MyTasksField.tsx's own doc comment: "the full state machine ... belongs to Task Detail, not this field-mobile one-tap view").

- timestamp: 2026-11-19T10:03:00Z
  checked: Playwright render, desktop viewport, authenticated as real field_responder — /field/tasks and /field, SideNav current-item highlighting
  found: On /field/tasks, SideNav highlights "My Tasks" (correct — that IS /field/tasks). On /field, SideNav highlights "Profile" (correct — that IS /field, per the href wiring). Both match their own hrefs correctly; there is no current-item-detection bug (AppShell.tsx:92's `flatItems.find((item) => location.pathname.startsWith(item.href))` works correctly here too, since it's reusing the SAME fully-correct `flatItems` array — this call site is unaffected by gap 1's bug, which only affects what's PASSED to the bottom-bar's rendering, not the `currentItem` lookup used for highlighting in either variant).
  implication: Every piece of this screen reached exactly what its own href promised; the defect is purely in the choice of LABEL ("Profile") failing to communicate that this is the screen holding the Report button, not in any routing, highlighting, or flattening logic.

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "INDEPENDENT of gap 1 (test 8). Gap 1 is a mobile-only bottom-bar item-selection bug in AppShell.tsx/SideNav.tsx; this gap is a desktop SideNav information-architecture/labeling defect in the Field group's nav_groups definition (backend/src/modules/auth-org/routes.ts:417-429), confirmed to be independent because the desktop rail SideNav the human tester used renders the Field group correctly and in isolation (unaffected by gap 1's cross-group flattening mechanism — verified live). The actual defect: routes.ts's Field group defines 'My Tasks' (href /field/tasks → MyTasksField.tsx, a narrow one-tap task-status screen with NO Report button by design) and 'Profile' (href /field → FieldHome.tsx, which DOES have both the task list and the sticky 'Report observation' button together) as two separate items. 'Profile' was chosen, per the code's own inline comment, only because the Field group needed exactly 4 items to satisfy the bottom-bar's structural 4-slot constraint and no dedicated profile screen exists — it was never intended to describe Field Home's actual content, and nothing in the label signals 'this is where the tasks+Report screen lives.' A user reasonably clicking the item labeled 'My Tasks' (which matches what they're looking for almost verbatim) lands on a screen that structurally cannot have a Report button, while the screen that actually has both pieces together sits behind an unrelated-sounding 'Profile' label the user has no reason to try. This is confirmed by direct inspection of both screen components' real JSX (no Report button exists anywhere in MyTasksField.tsx; FieldHome.tsx has exactly the button the test expects) and by live Playwright render of the real desktop SideNav showing both items correctly routed/highlighted per their own hrefs — the bug is a mapping/labeling choice, not a code defect in any routing, flattening, or highlighting mechanism."

fix: (not in scope for this diagnose-only session — find_root_cause_only)

verification: Root cause demonstrated directly: (1) read both screen components in full, confirming MyTasksField.tsx has zero Report-button code paths and FieldHome.tsx has exactly the task-list+Report-button combination the test expects; (2) live Playwright render of the real desktop SideNav confirmed both items route and highlight correctly per their own hrefs, ruling out any routing/highlighting bug; (3) the SAME live render independently disproved the gap's own recorded candidate cause ("same root cause as gap 1") by showing the rail SideNav's Field group renders correctly and in isolation — architecturally untouched by gap 1's cross-group flattening mechanism, which only affects the bottom-bar's item source in AppShell.tsx.

files_changed: []
