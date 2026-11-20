---
status: diagnosed
trigger: "Investigate issue: operating-picture-stale-tasks-placeholder"
created: 2026-11-20T14:34:45Z
updated: 2026-11-20T14:34:45Z
---

## Current Focus

hypothesis: CONFIRMED — see Resolution below.
test: n/a (root-cause-only mode; no fix applied)
expecting: n/a
next_action: none — return diagnosis to caller

## Symptoms

expected: The Operating Picture never claims a shipped, complete feature (Task tracking, F4) is still pending a future phase.
actual: Selecting any marker (incident, resource, or Phase 8's new facility marker) on the Operating Picture opens a "Tasks" Card in the side panel that renders an EmptyState reading "Tasks ship in a later phase" / "Task tracking (F4) is built in Phase 3."
errors: None reported
reproduction: Sign in as eocdirector@epmp.local / devpass123 at http://127.0.0.1:5173, navigate to /operating-picture, click any marker (e.g. the facility marker "County EOC Building").
started: Written in Phase 2 (02-07-PLAN.md), never updated since — pre-existing since Operating Picture's first implementation (2026-11-16), discovered during Phase 8 UAT (2026-11-20).

## Eliminated

- hypothesis: The Tasks card copy is a deliberate, still-valid design decision documenting genuine out-of-scope status for Operating Picture.
  evidence: project_specs/FRD/F02-common-operating-picture.md line 21 explicitly specifies the Operating Picture's right column as "incident Timeline **and task list** for the currently selected/pinned incident" — the FRD has ALWAYS called for a real task list here. Phase 2's own 02-07-PLAN.md (line 101) acknowledges this FRD requirement directly ("per F2 S2.1's spec, holds the selected incident's Timeline + task list") but implements only a placeholder because Phase 2 predates the `tasks` table (F4 ships Phase 3). This was an honest, temporary placeholder — never a decision that Operating Picture should NOT show tasks.
  timestamp: 2026-11-20T14:34:45Z

- hypothesis: Phase 3 or a later phase updated this file already (duplicate/already-fixed bug).
  evidence: `grep -rl "OperatingPicture" .planning/phases/03-plans-tasks-resource-requests/` returns only 03-09-PLAN.md/03-09-SUMMARY.md (the resource-request marker plan) — Phase 3 never touches the Tasks card. `git log --follow -- frontend/app/src/pages/operating-picture/OperatingPicture.tsx` shows only ONE commit in the entire repo history that could have modified it (the Phase 8 flush commit, which is just an artifacts-flush, not a Tasks-card edit) — the live source file at lines 641-645 still contains the EXACT verbatim string from 02-07-PLAN.md's original spec.
  timestamp: 2026-11-20T14:34:45Z

## Evidence

- timestamp: 2026-11-20T14:34:45Z
  checked: project_specs/FRD/F02-common-operating-picture.md (S2.1 page-pattern spec)
  found: "Right column (4 of 12 at bp-lg+): incident Timeline and task list for the currently selected/pinned incident." — a real, incident-scoped task list has ALWAYS been in scope for this screen per the FRD, Phase 2 through present.
  implication: The Tasks card is not "genuinely out of scope" — it's a documented FRD requirement that was deferred, then never revisited.

- timestamp: 2026-11-20T14:34:45Z
  checked: .planning/phases/02-incident-command-operating-picture/02-07-PLAN.md (lines 101, the task that built OperatingPicture.tsx)
  found: "Right column (4 of 12): per F2 S2.1's spec, holds the selected incident's Timeline + task list — Phase 2 scope: when selectedId is set, fetch and render that incident's Timeline... " — the plan ONLY wires Timeline, silently omitting "+ task list" from its own implementation, with no explicit decision note explaining the omission in the plan body itself.
  implication: Phase 2 implemented half of its own stated right-column spec (Timeline only) and shipped a placeholder for the other half (Tasks), because the `tasks` table didn't exist yet (F4 is Phase 3 scope). This is an honest temporary stand-in, explicitly labeled as such in the copy itself ("Tasks ship in a later phase... built in Phase 3").

- timestamp: 2026-11-20T14:34:45Z
  checked: .planning/phases/02-incident-command-operating-picture/02-07-SUMMARY.md (lines 68, 150, "Known Stubs" section)
  found: Summary explicitly documents the Tasks EmptyState as a known, labeled placeholder: "Right column: selected incident's Timeline... + a Tasks EmptyState placeholder when selected" and later: "OperatingPicture.css's file-header comment uses the word 'placeholder' solely to describe the right column's Tasks EmptyState card (itself a plan-specified, honestly-labeled 'ships in a later phase' message, identical in spirit to IncidentWorkspace.tsx's own Tasks/Resources/Reports placeholders from 02-06). Cosmetic, not blocking."
  implication: Phase 2 self-identified this exact same stale-placeholder risk pattern, used for IncidentWorkspace's analogous tabs, and explicitly flagged it as something a LATER phase should close — the same way 03-08 later closed IncidentWorkspace's identical placeholders.

- timestamp: 2026-11-20T14:34:45Z
  checked: .planning/phases/03-plans-tasks-resource-requests/03-08-PLAN.md (the plan that closed IncidentWorkspace's identical placeholder)
  found: 03-08-PLAN.md's objective explicitly states: "Close the loop Phase 2's 02-06 deliberately left open: replace the Incident Workspace's Tasks/Resources tab placeholders... with the REAL embedded TaskList/ResourceRequestList components this phase built in 03-06." This plan touches ONLY `IncidentWorkspace.tsx` (02-06's file) — `OperatingPicture.tsx` (02-07's file, a SEPARATE file with the IDENTICAL placeholder string) is never mentioned anywhere in 03-08's plan or summary.
  implication: Phase 3 closed the loop on ONE of the two files that shipped this exact placeholder pattern (IncidentWorkspace, from 02-06) but never circled back to the other (OperatingPicture, from 02-07). This is a scope-tracking gap, not an intentional decision — nothing in Phase 3's plans/summaries/REVIEW/VERIFICATION discusses OperatingPicture's Tasks card at all, confirming it was simply never on anyone's list.

- timestamp: 2026-11-20T14:34:45Z
  checked: .planning/phases/03-plans-tasks-resource-requests/03-09-PLAN.md (the ONLY Phase 3 plan that touches OperatingPicture.tsx)
  found: 03-09 extends OperatingPicture.tsx but SOLELY to add resource-request triangle markers to the map canvas (MapPopup branching on marker.type for resource facts/deep-link, MapLegend entry) — its objective text frames itself narrowly: "completing success criterion 4's 'visible on the operating picture' clause, which no other plan in this phase touches." It never touches or mentions the right-column Tasks card.
  implication: Confirms 03-09 (the only Phase-3 touchpoint on this file) had a narrow, explicitly scoped objective (map markers only) that never included the side-panel Tasks card — reinforcing this is an oversight, not a deliberate decision anyone made and documented.

- timestamp: 2026-11-20T14:34:45Z
  checked: backend/src/modules/incident-ops/tasks.ts (lines 175-191, GET /api/v1/tasks handler)
  found: The route already accepts an `incident` querystring param (`Querystring: { ...; incident?: string; ... }`) and applies jurisdiction-scope filtering identical to the pattern used elsewhere in the codebase — fully wired, tested (03-01's test suite), and already consumed by `frontend/app/src/pages/tasks-resources/TaskList.tsx` via its own `incidentId` prop (`if (incidentId) queryParams.set('incident', incidentId)`, confirmed at TaskList.tsx line 130).
  implication: Both the backend endpoint AND a ready-made frontend component (`<TaskList incidentId={...} />`, the exact same component 03-08 used to fix IncidentWorkspace's identical placeholder) already exist and are proven working in production use elsewhere in the app. No new backend or component work is needed to wire this correctly — it is a drop-in replacement identical to 03-08's own fix pattern.

- timestamp: 2026-11-20T14:34:45Z
  checked: frontend/app/src/pages/operating-picture/OperatingPicture.tsx (current file, lines 335-337, 629-646)
  found: The component already computes `selectedIsResource` and `selectedIsFacility` booleans (added across Phase 3's 03-09 and Phase 8's 08-04 to gate the incident-detail/timeline queries) that correctly identify when the selected marker is NOT an incident. The Tasks Card at line 641 renders unconditionally whenever `selectedId` is truthy — it does not check `selectedIsResource`/`selectedIsFacility` at all, so clicking a resource-request triangle or Phase 8 facility marker ALSO incorrectly opens the same incident-tasks placeholder, even though a resource request or facility has no "incident tasks" concept to show.
  implication: The bug has two layers: (1) the placeholder itself is stale and should be real incident-scoped tasks, and (2) even a correct fix must gate the Tasks card the same way the Timeline card is implicitly gated — only rendering it for `selectedIsResource === false && selectedIsFacility === false` (i.e., only true incident selections), matching the existing pattern already used for the Timeline/incident-detail queries at lines 340-348.

## Resolution

root_cause: >
  Operating Picture's side-panel "Tasks" Card was built in Phase 2 (02-07-PLAN.md/OperatingPicture.tsx)
  as an HONEST, EXPLICITLY-LABELED temporary placeholder, written before the `tasks` table existed
  (F4/Task-tracking is Phase 3 scope). Phase 2's own plan and summary documents self-identify this
  placeholder by name and flag it (02-07-SUMMARY.md's "Known Stubs" section) as something a later
  phase should close — the exact same pattern used for IncidentWorkspace.tsx's identical placeholder
  text from Phase 2's 02-06 plan.

  Phase 3 DID close the IncidentWorkspace instance of this placeholder (03-08-PLAN.md, explicitly
  titled "Close the loop Phase 2's 02-06 deliberately left open"), replacing it with a real
  `<TaskList incidentId={incident.id} />` embed. However, Phase 3's only other touchpoint on
  OperatingPicture.tsx (03-09-PLAN.md) had a narrowly scoped objective — adding resource-request
  triangle markers to the map canvas — and never mentions or revisits the side-panel Tasks card.
  No plan, summary, REVIEW, or VERIFICATION document across Phases 3 through 8 ever discusses or
  tracks OperatingPicture's Tasks card as a follow-up item.

  This is a pure OVERSIGHT, not an intentional design decision: the FRD (F02-common-operating-picture.md
  line 21) has always specified "incident Timeline AND task list" for this exact right column; the
  backend capability (GET /api/v1/tasks?incident={id}) and the exact reusable frontend component
  (<TaskList incidentId={...}>) both already exist and are proven working elsewhere (TaskList.tsx,
  IncidentWorkspace.tsx post-03-08) — nobody simply remembered to apply the same fix 03-08 applied
  to IncidentWorkspace.tsx to this sibling file with the identical stale copy.

  Secondary finding: the Tasks Card is also structurally wrong even independent of the stale copy —
  it renders unconditionally whenever `selectedId` is set, with no gate for `selectedIsResource`/
  `selectedIsFacility` (both already computed in the component for other purposes). A correct fix
  must apply the SAME marker-type gate already used for the Timeline/incident-detail queries, so a
  resource-request or facility marker selection does not also show an "incident's tasks" card that
  makes no sense for that marker type.

fix: ""
verification: ""
files_changed: []
