---
status: diagnosed
trigger: "Investigate issue: eoc-dashboard-stale-hint-text"
created: 2026-11-19T00:00:00Z
updated: 2026-11-19T00:00:00Z
---

## Current Focus

hypothesis: CONFIRMED — frontend/app/src/pages/dashboard/EocDashboard.tsx hardcodes a stale "ships in a later phase" hint on the Open tasks / Pending resource requests Stat tiles, left over from the plan's original (incorrect) premise that backend/src/modules/incident-ops/dashboard.ts would hardcode zeros for these fields. The backend actually computes real COUNT(*) queries (documented as an explicit, correct deviation in 06-01-SUMMARY.md). The frontend hint was never updated to match.
test: Read EocDashboard.tsx + dashboard.ts fully; cross-referenced 06-01-SUMMARY.md's Deviations section; queried DB directly to confirm real nonzero rows exist; surveyed every other `hint=` usage across frontend/app to establish the codebase's actual hint-prop convention; checked whether notifications_pending_ack (the one genuinely-still-zero field) uses the same prop pattern.
expecting: If the hint-prop convention elsewhere in the codebase attaches a "placeholder/limitation" caption ONLY to values that are genuinely limited/approximated/structural-zero (never to genuinely real computed values), that confirms the fix is to remove (not reword/conditionalize) the two stale hints, matching the file's own `active_incidents` tile (no hint at all) as the in-file precedent for a "real value, no caveat" tile.
next_action: none — root cause confirmed, mode is find_root_cause_only, returning diagnosis.

## Symptoms

expected: Each Stat tile on /dashboard (PER-01 EOC Dashboard) either shows a real count with an accurate caption, OR (if the data genuinely can't be computed) shows 0 with an honest "not yet tracked" caption — never both a real nonzero number AND a caption claiming the feature doesn't exist.
actual: Open tasks shows "2" with hint "Tasks module ships in a later phase". Pending resource requests shows "1" with hint "Resource requests module ships in a later phase". Both are real, correctly-computed nonzero values.
errors: None — UI copy/logic mismatch, not a crash.
reproduction: Sign in as eocdirector@epmp.local / devpass123, land on /dashboard (Test 1 in UAT).
started: Phase 6 (06-01 backend deviation + 06-05 frontend consumption), discovered during UAT.

## Eliminated

(none — prior_cause was proven on first pass, no false leads)

## Evidence

- timestamp: investigation
  checked: backend/src/modules/incident-ops/dashboard.ts (full file, 76 lines)
  found: open_tasks (lines 35-43) and pending_resource_requests (lines 45-52) run real `SELECT COUNT(*)` queries against `tasks`/`resource_requests` joined to `incidents` and scoped by `req.epmpUser!.jurisdiction_scope`. Only `notifications_pending_ack` (line 64) is a hardcoded literal `0`, with an inline comment explicitly justifying it as a genuine schema gap (`notification_recipients` has no per-user-id column).
  implication: Confirms backend side of prior_cause exactly — 3 of 4 summary fields are real, only 1 is a genuine structural zero.

- timestamp: investigation
  checked: frontend/app/src/pages/dashboard/EocDashboard.tsx (full file, 164 lines)
  found: Lines 104-121 render all 4 Stat tiles. `active_incidents` (line 105) has NO `hint` prop at all. `open_tasks` (109) and `pending_resource_requests` (114) each carry a hardcoded "...ships in a later phase" hint with zero conditional logic — the hint renders unconditionally regardless of the value received. `notifications_pending_ack` (119) also carries a "ships in a later phase" hint. The file's own top-of-component doc comment (lines 36-47) asserts "Only 1 of the 4 Stat tiles (active_incidents) reads a value this phase's schema can genuinely answer" — this comment is ALSO stale and contradicts dashboard.ts's actual implementation.
  implication: The hint props are literal strings with no connection to the fetched `summary` value — a pure copy-paste leftover from before the backend deviation was decided. The component's own doc comment reinforces that the UI code was written under the plan's original (stale) premise and never reconciled with the actual backend behavior.

- timestamp: investigation
  checked: .planning/phases/06-persona-dashboards-ai-assistance/06-01-SUMMARY.md, Deviations #3 and key-decisions
  found: Explicitly documents "dashboard.ts computes real task/resource-request counts instead of the plan's stale hardcoded-zero assumption" as an auto-fixed Rule 1 bug, with reasoning: hardcoding zero would have been a regression since Phase 3 already shipped real `tasks`/`resource_requests` tables. `notifications_pending_ack` is explicitly called out as staying a documented zero because that field is a genuine, permanent schema gap (no per-recipient user_id column), not a stale assumption.
  implication: The backend's deviation from its own plan's premise is fully documented and deliberate/correct. The frontend plan (06-05, consuming this API) was evidently authored/executed without re-syncing to this already-landed deviation — there's no cross-reference from 06-05-SUMMARY.md back to 06-01's Deviation #3, which is the "missed cross-plan sync point" the prior_cause speculated about.

- timestamp: investigation
  checked: .planning/phases/06-persona-dashboards-ai-assistance/06-05-SUMMARY.md (full file — this is actually the AIDraft component plan, NOT the EocDashboard plan; confirmed EocDashboard.tsx's own doc comment cites "06-05" as its origin but the file by that number in this phase is unrelated)
  found: 06-05-SUMMARY.md covers the `AIDraft` design-system component (product-patterns/AIDraft.tsx), not EocDashboard.tsx. There is no SUMMARY.md in phase 06 whose content matches EocDashboard.tsx's actual implementation (searched all phase-06 SUMMARY files; EocDashboard.tsx itself is not listed as a created/modified file in 06-01 or 06-05's key-files).
  implication: Either EocDashboard.tsx was authored in a plan not yet checked, or its own doc-comment's "06-05" citation is itself wrong/stale — a secondary minor inconsistency on top of the main bug, but not required to resolve the primary root cause (which is proven directly from dashboard.ts + EocDashboard.tsx's code, independent of which plan number wrote it).

- timestamp: investigation
  checked: Direct DB query — `SELECT status, count(*) FROM tasks GROUP BY status` and same for `resource_requests`
  found: tasks: Open=1, In progress=1, Overdue=1, Done=2. resource_requests: Awaiting approval=1, Fulfilled=2. Backend's query counts status IN ('Open','In progress','Awaiting approval') for tasks → 2 matching rows (matches symptom's reported "2"). resource_requests status='Awaiting approval' → 1 matching row (matches symptom's reported "1").
  implication: Confirms the real nonzero values displayed in the UI are correct, verified computations — not a backend bug. The bug is purely the frontend caption.

- timestamp: investigation
  checked: Every other `hint=` usage across frontend/app/src (26 call sites via grep) — specifically frontend/app/src/pages/reporting/AnalyticsDashboard.tsx (Stat hint = `${definition} · ${period} · ${source}`, attached to REAL KPI values) and frontend/app/src/pages/admin/PlatformMonitoring.tsx (Stat hints = genuine caveats like "Phase 1 placeholder — no login_failed audit event is recorded yet", each attached to a value this SAME file's own doc comment confirms is actually approximated/not historically tracked)
  found: Every other hint-on-a-real-or-limited-value Stat tile in the codebase follows one consistent rule: a "placeholder/not tracked/ships later" caption is used ONLY when the attached value is itself genuinely limited, approximated, or a structural zero — never attached to a value proven to be a real, fully-computed count. AnalyticsDashboard's hints describe (don't apologize for) real data. PlatformMonitoring's "placeholder" hints are each individually justified by that same file's own doc comment explaining why that specific value really is limited in Phase 1.
  implication: This confirms the codebase has an established, consistent convention (the "F0 rule" EocDashboard.tsx's own doc comment calls "every data point states its source/limitation") that a caveat hint is only valid when the data genuinely has that limitation. EocDashboard.tsx's open_tasks/pending_resource_requests tiles violate this established convention since 06-01's deviation made their data genuinely real — the fix must follow the same convention the rest of the codebase already uses.

- timestamp: investigation
  checked: frontend/design-system/src/data/Stat.tsx (full file, 51 lines) — the Stat component itself
  found: `hint` is a plain optional string prop (line 28), rendered unconditionally as a `<p className="ep-stat__hint caption">` if truthy (line 48). No logic in Stat.tsx ties hint content to value — that association is entirely the CALLER's responsibility. Confirms this is purely an EocDashboard.tsx-level bug, not a Stat component defect.
  implication: No conditional capability needs to be added to Stat.tsx. The fix is scoped entirely to EocDashboard.tsx's own JSX — exactly matching how `active_incidents` (same file, line 105) already omits `hint` entirely for its own real, backend-computed value.

## Resolution

root_cause: "frontend/app/src/pages/dashboard/EocDashboard.tsx hardcodes `hint=\"Tasks module ships in a later phase\"` (line 109) and `hint=\"Resource requests module ships in a later phase\"` (line 114) on the Open tasks / Pending resource requests Stat tiles unconditionally, regardless of the value received from GET /api/v1/dashboard/summary. These hints were written under the EocDashboard plan's assumption that backend/src/modules/incident-ops/dashboard.ts would return hardcoded zeros for `open_tasks`/`pending_resource_requests` (matching the plan's own stale premise, per 06-01-SUMMARY.md Deviation #3). The backend plan (06-01) executed FIRST and correctly deviated from that premise — because Phase 3 (03-01/03-04) had already shipped real `tasks`/`resource_requests` tables, hardcoding zero there would have been a regression, so 06-01 computes real, jurisdiction-scoped `COUNT(*)` queries instead (confirmed directly in dashboard.ts lines 30-52, and documented in 06-01-SUMMARY.md's Deviations section). The plan/code that wrote EocDashboard.tsx's hint text was never updated to reflect this already-landed backend deviation — there is no cross-reference from EocDashboard.tsx (or its originating plan) back to 06-01's documented deviation. The result: a real, correctly-computed nonzero count rendered directly above a caption that flatly contradicts it. Only `notifications_pending_ack` remains a genuine structural zero (no per-recipient user_id column in the notifications schema), so its identical-pattern hint (line 119, \"Per-recipient acknowledgment ships in a later phase\") is accurate and should NOT be changed."
fix: "(not applied — goal is find_root_cause_only). Suggested direction: remove the `hint` prop entirely from the Open tasks (line 109) and Pending resource requests (line 114) Stat tiles in EocDashboard.tsx, mirroring the SAME file's own `active_incidents` tile (line 105), which already has no hint because it, too, is a real computed value with no caveat to state. This requires NO conditional logic — dashboard.ts's deviation means these two fields will ALWAYS be real integers going forward (a genuine 0 for either field, e.g. when there truly are no open tasks, is not a 'data unavailable' case, exactly like active_incidents legitimately showing 0 when there are no open incidents) — so a static removal (not a value-dependent conditional) is the correct, minimal, convention-consistent fix, matching every other real-valued Stat tile already in this codebase (see AnalyticsDashboard.tsx's pattern: hint describes real data, never apologizes for it). Secondary cleanup: the component's own top-of-file doc comment (lines 36-47) asserts '3 of 4 tiles are structural zeros' which is now stale/wrong (only notifications_pending_ack is) and should be corrected alongside the JSX fix to prevent this same mismatch from recurring. Also worth a quick check (not required to fix the current bug): EocDashboard.tsx's doc comment cites phase plan '06-05' as its origin, but phase 06's actual 06-05-SUMMARY.md documents the unrelated AIDraft component — this citation may itself be stale and could mislead a future investigator; not in scope for this root-cause fix but flagged for whoever applies it."
verification: ""
files_changed: []
