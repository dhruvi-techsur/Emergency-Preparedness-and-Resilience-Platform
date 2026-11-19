---
status: diagnosed
trigger: "UAT Gap (test 8, self_check-sourced, confidence: proven): the mobile bottom-nav bar renders the wrong 4 items for a real field_responder identity"
created: 2026-11-19T09:50:15Z
updated: 2026-11-19T09:58:00Z
---

## Current Focus
<!-- OVERWRITE on each update - reflects NOW -->

hypothesis: CONFIRMED — see Resolution
test: n/a — root cause demonstrated directly
expecting: n/a
next_action: none — diagnosis complete, handing off to plan-phase --gaps

## Symptoms
<!-- Written during gathering, then IMMUTABLE -->

expected: All 6 field-mobile screens are reachable via a 4-item bottom nav bar (Tasks/Report/Map/Profile) visible at mobile breakpoints for the field_responder role.
actual: `GET /api/v1/me/nav-config` (field_responder bearer token) → bottom bar renders `['plans','operating-picture','incidents','tasks']` (desktop Prepare/Monitor/Activate/Coordinate groups), never the Field group's `['field-tasks','field-report','field-map-nav','field-profile']`.
errors: None reported (silent wrong-content bug, not a crash/error)
reproduction: Test 8 in UAT — sign in as field-responder@epmp.local, view any field-mobile screen at a <768px viewport, observe the bottom bar.
started: Discovered during UAT (self_check); introduced whenever field_responder's cross-phase view-only grants (Phases 1-4) were seeded, which predates this phase's Field-group nav addition (05-04)

## Prior Cause (candidate, confidence: proven)

AppShell.tsx's `flatItems = navGroups.flatMap((g) => g.items)` + SideNav.tsx's `mobileBottomBarItems.slice(0, 4)` takes the first 4 items of the WHOLE flattened nav_groups array (backend emission order Prepare→Monitor→Activate→Coordinate→Improve→Field→Admin), not the Field group specifically — and field_responder's broad view-only grants on incidents/plans/tasks/etc (seeded across phases 1-4) populate 4 groups before Field ever appears.

Per diagnose-issues workflow rules for `confidence: proven`: started investigation from this candidate and independently observed its mechanism end-to-end below (not just re-asserted the heading).

## Eliminated
<!-- APPEND only - prevents re-investigating -->

(none — the prior cause's mechanism was confirmed on first direct test; no competing hypothesis survived to need elimination. For completeness, one alternative was considered and ruled out before confirming: "SideNav passes the wrong prop" — ruled out because AppShell.tsx:178 passes `mobileBottomBarItems={flatItems}`, i.e. the bug is in what AppShell computes as `flatItems`, not in how SideNav consumes its `mobileBottomBarItems` prop; SideNav's `.slice(0,4)` is working exactly as documented/intended on whatever array it's given.)

## Evidence
<!-- APPEND only - facts discovered -->

- timestamp: 2026-11-19T09:50:15Z
  checked: frontend/app/src/app-shell/AppShell.tsx:90-91, :174-180
  found: `const navGroups = navConfig?.nav_groups ?? []; const flatItems = navGroups.flatMap((g) => g.items);` — flattens the ENTIRE nav_groups array returned by the backend (all groups the role has ANY permission for), then at line 178 passes this same `flatItems` (not any Field-group-specific subset) as `mobileBottomBarItems` to the bottom-bar-variant `<SideNav>`.
  implication: The bottom bar's item source is never scoped to the Field group specifically — it's whatever the first 4 items of the full flattened nav are, which for the field_responder role depends entirely on backend emission order.

- timestamp: 2026-11-19T09:50:15Z
  checked: frontend/design-system/src/navigation/SideNav.tsx:97-98
  found: `if (variant === 'bottom-bar') { const barItems = mobileBottomBarItems.slice(0, 4); ... }` — SideNav itself does nothing beyond slicing the first 4 of whatever array it's handed; it has no concept of "the Field group" and documents this explicitly in its own header comment ("a fixed horizontal bar of exactly the first 4 mobileBottomBarItems ... This component does not pick the variant itself").
  implication: SideNav is working as designed/documented; it is not independently defective — the defect is entirely in what AppShell.tsx supplies it.

- timestamp: 2026-11-19T09:50:15Z
  checked: backend/src/modules/auth-org/routes.ts:257-430 (nav_groups construction)
  found: nav_groups is built as a flat JS array literal via spread-if-permitted blocks in FIXED source order: Prepare (hasPlans) → Monitor (hasIncidents) → Activate (hasIncidents) → Coordinate (hasTasks||hasResourceRequests||hasNotifications) → Improve (hasReporting) → Field (hasFieldReports) → Admin (hasAdmin). This order is unconditional — it does not depend on role, only on which permission flags are true, and Field is always emitted 6th regardless of what else the role holds.
  implication: For ANY role that holds field_reports AND any of plans/incidents/tasks/resource_requests/notifications/reporting permissions simultaneously, Field's 4 items will never occupy flattened-array positions 0-3.

- timestamp: 2026-11-19T09:50:15Z
  checked: backend/scripts/seed.ts grant lines for field_responder (124, 150, 191, 259, 301, 338, 368, 395, 422, 460-462)
  found: field_responder (PER-04) holds real, intentional view-level grants across Phases 1-4: incidents (view), tasks (view+status), resource_requests (view), plans (view), notifications (view), reporting (view) — in addition to field_reports (view/create/resolve) from this phase. Each grant is commented as a deliberate "situational awareness" decision, not an oversight.
  implication: hasPlans, hasIncidents, hasTasks-or-similar, and hasReporting are ALL true for field_responder, so Prepare, Monitor, Activate, Coordinate, and Improve ALL populate before Field — 5 full groups (9 items by group content as emitted: 1+1+1+4+2=9) ahead of Field's first item.

- timestamp: 2026-11-19T09:52:xxZ
  checked: Live API call — minted a real session JWT for the actual seeded field-responder@epmp.local user (via `mintSessionToken` with that user's real `role_id`/`jurisdiction_scope` read from the running Postgres instance) and called `GET /api/v1/me/nav-config` on the live backend (localhost:8080) with that token, exactly as AppShell.tsx's react-query call does.
  found: Real response's `nav_groups` is, in order: Prepare→Monitor→Activate→Coordinate→Improve→Field (6 groups; Admin absent). Flattening in the same order AppShell.tsx does (`navGroups.flatMap(g => g.items)`) and taking `.slice(0,4)` (as SideNav.tsx's bottom-bar branch does) yields `['plans','operating-picture','incidents','tasks']` — the EXACT 4 ids the self_check/UAT gap cites, confirmed character-for-character.
  implication: The mechanism is not merely plausible from code reading — it was reproduced end-to-end against the real backend, the real seeded user, and the real frontend's own derivation logic, and it produces exactly the reported wrong output.

- timestamp: 2026-11-19T09:55:xxZ
  checked: Playwright render of the actual running frontend (localhost:5173) at a 390x844 (mobile) viewport, `/field` route, authenticated via a real field-responder session token injected into sessionStorage before any app script ran (bypassing nothing — this is the real RouteGuard → AppShell → SideNav render path)
  found: Screenshot shows the bottom bar rendering "Plans & playbooks / Operating picture / Incidents / Tasks" (4 icons+labels), NOT "My Tasks / Report / Map / Profile" — on the actual Field Home screen, which DOES correctly show its own task list and "Report observation" button above the bad bottom bar.
  implication: Visually confirmed end-to-end in the real rendered app, not just via API inspection — the bug is real, reproducible, and exactly matches the UAT gap's screenshots.

- timestamp: 2026-11-19T09:56:xxZ
  checked: Same Playwright session, same token, desktop viewport (1280x900), `/field/tasks` and `/field` routes (rail SideNav, not bottom-bar)
  found: The rail SideNav correctly renders ALL 6 groups including a distinct "FIELD" group with "My Tasks / Report / Map / Profile" as its own labeled section — unaffected by the bug.
  implication: Confirms the defect is isolated to the bottom-bar-variant's `mobileBottomBarItems` derivation (AppShell.tsx:91/178), not to nav_groups construction itself (which is correct and already contains a properly-isolated Field group) nor to SideNav's rail-variant rendering (which correctly iterates `groups` group-by-group, never flattening across groups). This directly disproves any hypothesis that the bug lives in the backend's nav_groups ordering alone (if it did, the rail would ALSO show Field's items scattered/misplaced among other groups — it does not; Field is correctly its own last section there).

## Resolution
<!-- OVERWRITE as understanding evolves -->

root_cause: "AppShell.tsx:91 derives the mobile bottom-bar's item source via `flatItems = navGroups.flatMap((g) => g.items)` over the ENTIRE nav_groups array returned by `GET /api/v1/me/nav-config`, then passes this same undifferentiated `flatItems` as `mobileBottomBarItems` to SideNav.tsx's bottom-bar variant (AppShell.tsx:178), which structurally takes only `.slice(0, 4)` of whatever it's given (SideNav.tsx:98). Neither AppShell nor SideNav ever selects the Field group specifically by its `label` (or any other group identifier) for the bottom-bar's item source — the code has no concept of 'the Field group' at the mobile-bottom-bar call site at all, only 'the first 4 items in backend emission order.' Because the backend emits nav_groups in a fixed order (Prepare→Monitor→Activate→Coordinate→Improve→Field→Admin, routes.ts:257-430) and the real field_responder role holds broad, intentional view-only grants across Phases 1-4 (plans/incidents/tasks/resource_requests/notifications/reporting — seed.ts lines 124-462) in addition to this phase's field_reports grant, 5 groups populate with 9 total items before Field's 4 items ever appear in the flattened array. This was confirmed by direct, authenticated API call against the live backend/live seeded user (yielding the exact wrong 4 ids reported) AND by a real Playwright render of the live frontend at a mobile viewport (showing the exact wrong 4 labels), as well as by a positive control at desktop viewport showing the rail SideNav correctly displays a separate, intact Field section — isolating the defect specifically to the bottom-bar item-selection logic, not to nav_groups construction or to SideNav's rail rendering."

fix: (not in scope for this diagnose-only session — find_root_cause_only)

verification: Root cause demonstrated via live, authenticated reproduction against the real running app (not inferred from code reading alone): (1) direct API call with a real field_responder session token reproduced the exact wrong 4 ids reported in the gap; (2) Playwright screenshot of the real running frontend at mobile viewport reproduced the exact wrong 4 labels visually; (3) positive control at desktop viewport confirmed the rail SideNav's Field group renders correctly, isolating the defect to AppShell.tsx's bottom-bar-specific `flatItems` derivation.

files_changed: []
