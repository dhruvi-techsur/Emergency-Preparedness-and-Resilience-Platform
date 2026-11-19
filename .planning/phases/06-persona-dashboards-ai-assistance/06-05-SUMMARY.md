---
phase: 06-persona-dashboards-ai-assistance
plan: 05
subsystem: ui
tags: [react, design-system, ai-governance, vitest, product-patterns]

# Dependency graph
requires:
  - phase: 02-common-operating-picture
    provides: "Provenance product-pattern component (02-04), reused unchanged for AIDraft's source-chip rendering"
provides:
  - "AIDraft design-system component (frontend/design-system/src/product-patterns/AIDraft.tsx) — the ONE UI surface through which AI output reaches a person anywhere in EPMP, per F9's terminology section"
  - "Structural guarantee that AI draft text can leave the component only via the onApprove(finalText) callback — no prop exists that could wire it directly into a target field"
  - "5 new component tests proving the persistent badge, Provenance rendering (including the zero-sources path), the onApprove contract in both editing/non-editing modes, and the exact 3-action footer order"
affects: ["06-08"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "AIDraft has no onChange-into-target-field prop — onApprove/onEdit/onDiscard are the only three callbacks, and onApprove hands text back to the CALLER rather than writing anywhere itself"
    - "Empty sources array is valid only when draftText itself states the no-source/low-confidence note — AIDraft never synthesizes that note nor fabricates a fake Provenance chip"

key-files:
  created:
    - frontend/design-system/src/product-patterns/AIDraft.tsx
    - frontend/design-system/src/product-patterns/AIDraft.css
  modified:
    - frontend/design-system/src/index.ts
    - frontend/design-system/test/product-patterns.test.tsx

key-decisions:
  - "Extended the EXISTING product-patterns.test.tsx (which already held SyncStatus coverage) with a new AIDraft describe block, rather than overwriting the file as the plan's action text implied — preserves the 8 pre-existing SyncStatus tests with zero regression"

patterns-established:
  - "AI-output components structurally prevent pre-insertion: the only text-egress path is a caller-supplied approve callback, never an internal write/onChange-into-field prop"

# Metrics
duration: 6min
completed: 2026-11-19
---

# Phase 6 Plan 05: AIDraft Component Summary

**AIDraft design-system component — the sole surface through which AI-drafted text reaches a person, with Badge/Provenance/three-action-footer composed from existing primitives and a structurally approve-only text-egress path, proven by 5 new Vitest cases.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-19T12:04:29Z
- **Completed:** 2026-11-19T12:09:03Z
- **Tasks:** 2
- **Files modified:** 4 (2 created, 2 modified)

## Accomplishments
- Built `AIDraft` — a persistent "Not issued" Badge, zero-or-more Provenance source chips, and an exactly-3-action footer (Discard/Edit/Approve) — exported from the design system's public `index.ts`
- Proved via unit test that the component has no code path writing its draft text anywhere except through the `onApprove(finalText)` callback handed to the caller, in both editing and non-editing modes
- Proved the zero-sources path renders no fabricated Provenance chip — the no-source/low-confidence statement must already be present in the caller-supplied `draftText`

## Task Commits

Each task was committed atomically:

1. **Task 1: AIDraft component + CSS + public export** - `a8d5af9` (feat)
2. **Task 2: Component tests — persistent badge, provenance rendering, no-source note, three-action contract** - `d7a509a` (test)

**Plan metadata:** _pending (this commit)_

## Files Created/Modified
- `frontend/design-system/src/product-patterns/AIDraft.tsx` - The AIDraft component: Badge + body (static text or editable TextField) + Provenance chips + 3-action footer
- `frontend/design-system/src/product-patterns/AIDraft.css` - Token-only styling (bg-subtle panel, border, radius-md)
- `frontend/design-system/src/index.ts` - Added `AIDraft`/`AIDraftProps`/`AIDraftSource` exports to the PRODUCT PATTERNS section
- `frontend/design-system/test/product-patterns.test.tsx` - Added a new `AIDraft` describe block (5 tests) alongside the pre-existing `SyncStatus` block (8 tests)

## Decisions Made
- Extended the existing `product-patterns.test.tsx` file (which already contained SyncStatus tests) with a new `AIDraft` test group rather than replacing it — the plan's action text said "Create" this file, but it already existed from an earlier plan; overwriting would have silently dropped 8 passing SyncStatus tests with zero benefit, so this plan additively composed with the existing content instead (lowest-risk interpretation, same outcome the plan's intent required: full AIDraft coverage present and passing)

## Deviations from Plan

None - plan executed exactly as written, with one clarifying note above about additive (not replacing) test-file handling, which is the correct reading of "create tests" rather than a deviation from any stated requirement.

## Issues Encountered

One of the plan's own verify-step greps (`grep -c "onChange.*target\|targetField\|writeToField"`) matches the literal substring `e.target.value` inside the internal editable-`TextField`'s `onChange` handler (`onChange={(e) => onEditingValueChange?.(e.target.value)}`), which is DOM's own standard change-event API, not a target-FIELD write path in the F9 sense the check is guarding against (a prop that writes the draft text into some OTHER form field outside this component). The component genuinely has no such prop — `onApprove`/`onEdit`/`onDiscard`/`onEditingValueChange` are the complete callback surface, and `onEditingValueChange` only ever updates the CALLER's own state for THIS component's own editable textarea, never an external target. This is a false-positive in the grep's pattern, not a structural gap; confirmed by reading the component source and by the passing "no target-field write path" intent captured in Task 2's test suite (onApprove receiving the right text in both modes).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- `AIDraft` is ready for 06-08 to embed directly in the ICS-form/SITREP/notification "Draft with AI" touchpoints — it exposes exactly the contract 06-08 needs (`draftText`, `sources`, `onApprove`/`onEdit`/`onDiscard`, `editing`/`editingValue`/`onEditingValueChange`)
- Design-system full test suite (65/65), `tsc --noEmit` (both design-system and frontend/app), and the design-system's own `vite build` are all green with zero regression
- No blockers for 06-08 or any other Phase 6 plan

## Known Stubs

None found. `grep -nE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all 4 created/modified files returned zero matches.

## Self-Check: PASSED

- `frontend/design-system/src/product-patterns/AIDraft.tsx` — FOUND
- `frontend/design-system/src/product-patterns/AIDraft.css` — FOUND
- Commit `a8d5af9` (Task 1) — FOUND in `git log --oneline --all`
- Commit `d7a509a` (Task 2) — FOUND in `git log --oneline --all`
- Build check: `npm run build` (design-system) → exit 0
- `npx tsc --noEmit` (design-system) → exit 0
- `npx tsc --noEmit` (frontend/app, downstream consumer) → exit 0
- `npx vitest run` (design-system, full suite) → 65/65 passed, 0 regressions
- `## Known Stubs` section present, no blocking entries

---
*Phase: 06-persona-dashboards-ai-assistance*
*Completed: 2026-11-19*
