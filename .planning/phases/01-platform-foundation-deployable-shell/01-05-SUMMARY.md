---
phase: 01-platform-foundation-deployable-shell
plan: 05
subsystem: ui
tags: [design-system, react, forms, aria-combobox, accessibility, vitest]

# Dependency graph
requires:
  - phase: 01-02
    provides: "frontend/design-system/src/index.ts exporting Icon, plus the token system and Vite build pipeline all form components style against"
provides:
  - "6 form-control components (TextField, Select, Checkbox, Switch, Combobox, DatePicker) added to window.EPMP"
  - "ARIA combobox/listbox pattern reference implementation (Combobox) with client-side filter and server-backed onSearch modes"
  - "Typed-entry-first DatePicker with keyboard-operable calendar popover, withTime variant, and never-silently-defaulted time zone"
  - "frontend/design-system/test/forms.test.tsx conformance suite (6 tests): error visibility, label-is-full-hit-area, combobox keyboard selection, date range-error wording, full Tab-order keyboard operability"
affects: ["01-08 (SSO config / user-role admin screens)", "01-10 (federation grant form)", "every Wave 4 admin console plan composing forms"]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Generated-id label association via React.useId(): every form field connects its <label htmlFor> to a stable generated id, never relying on placeholder text as a label substitute"
    - "Error/hint rendered below the field via aria-describedby, never color-only — TextField/Select/Combobox/DatePicker all follow the same {error ?? hint} rendering branch with a shared id-suffix convention (-hint/-error)"
    - "Visually-hidden-but-functional native input driving a styled sibling (Checkbox's box, Switch's track) so keyboard/screen-reader semantics come free from the native element while the ring and glyph render on the adjacent span"
    - "ARIA combobox/listbox: role=combobox + aria-expanded/aria-controls/aria-activedescendant on the input, role=listbox + role=option with aria-selected on the popover list, index-tracked highlight state driving aria-activedescendant rather than DOM focus"

key-files:
  created:
    - frontend/design-system/src/forms/TextField.tsx
    - frontend/design-system/src/forms/TextField.css
    - frontend/design-system/src/forms/Select.tsx
    - frontend/design-system/src/forms/Select.css
    - frontend/design-system/src/forms/Checkbox.tsx
    - frontend/design-system/src/forms/Checkbox.css
    - frontend/design-system/src/forms/Switch.tsx
    - frontend/design-system/src/forms/Switch.css
    - frontend/design-system/src/forms/Combobox.tsx
    - frontend/design-system/src/forms/Combobox.css
    - frontend/design-system/src/forms/DatePicker.tsx
    - frontend/design-system/src/forms/DatePicker.css
    - frontend/design-system/test/forms.test.tsx
  modified:
    - frontend/design-system/src/index.ts

key-decisions:
  - "DatePicker's month-grid arithmetic (addDays/addMonths/buildMonthGrid) implemented with UTC Date objects internally, keyed on YYYY-MM-DD strings, to avoid local-timezone-induced off-by-one day shifts when computing calendar cells — the component's public value/onChange contract remains plain ISO date/datetime strings with no timezone conversion applied to the value itself."
  - "Combobox's blur-revert uses a short setTimeout (100ms) rather than onMouseDown-only suppression, so a mouse click on an option (which calls preventDefault on mousedown to avoid the native blur-before-click race) and a blur via Tab/click-outside both resolve correctly without the dropdown's selection being lost to a premature revert."

patterns-established:
  - "Form-field wrapper div pattern: every control here owns a `.ep-<control>-wrap` wrapper rendering label → control → hint-or-error, keeping the three-part layout (label above, control, helper/error below) uniform across all 6 components per Chapter 11's shared visual contract."

# Metrics
duration: 25min
completed: 2026-11-16
---

# Phase 1 Plan 05: Design System Form-Control Layer Summary

**Six controlled React form components — TextField, Select, Checkbox, Switch, Combobox (ARIA combobox/listbox with keyboard nav), DatePicker (typed ISO entry + keyboard-operable calendar) — added to `@epmp/design-system`, all styled exclusively via existing `var(--token)` references, verified by a 6-test conformance suite covering label association, error visibility, full-hit-area labels, and complete Tab-order keyboard operability.**

## Performance

- **Duration:** 25 min
- **Started:** 2026-11-16T03:00:00Z (approx)
- **Completed:** 2026-11-16T03:20:00Z
- **Tasks:** 3
- **Files created:** 13
- **Files modified:** 1 (`src/index.ts`)

## Accomplishments

- Built `TextField` and `Select` sharing one layout convention: `<label htmlFor>` connected to a `React.useId()`-generated id, error text rendered below the control in `var(--danger-text)` with an `alert` icon, `aria-invalid`/`aria-describedby` wired correctly, 36px default / 44px `size="lg"` heights.
- Built `Checkbox` where the entire `<label>` (box + text) is the clickable hit area — proven by a test that clicks only the label text node and asserts the checkbox toggles — and `Switch` with `role="switch"`, `aria-checked` reflecting live state, controlled/uncontrolled support.
- Built `Combobox` implementing the full ARIA combobox/listbox pattern: `role="combobox"` with `aria-expanded`/`aria-controls`/`aria-activedescendant`, type-to-filter (client-side by default, or server-backed via `onSearch` + `loading` Skeleton rows), Up/Down/Enter/Escape keyboard support, `clearable` affordance, actionable `emptyText`.
- Built `DatePicker` where typing a date always works as a first-class path (not calendar-click-only): YYYY-MM-DD text entry, `withTime` adds a 24h time field returning `YYYY-MM-DDTHH:mm`, `zone` always stated in the hint or shows "Time zone not set" (never silently defaulted), `min`/`max` dim and un-focus out-of-range calendar days, invalid/out-of-range typed input shows an error on blur stating the allowed bound.
- Updated `src/index.ts` to re-export all 6 components (plus their prop/option/size types) from `window.EPMP`; full design-system Vitest suite now at 40/40 passing (34 pre-existing + 6 new), clean `vite build` from a wiped `dist/`.

## Task Commits

Each task was committed atomically:

1. **Task 1: TextField, Select, Checkbox, Switch** - `8b91b0d` (feat)
2. **Task 2: Combobox + DatePicker** - `204614e` (feat)
3. **Task 3: Forms conformance test + index.ts exports** - `555ce32` (test)

_Plan metadata commit follows this SUMMARY._

## Files Created/Modified

- `frontend/design-system/src/forms/TextField.tsx` + `.css` - controlled input/textarea, label/hint/error, useId-driven label association
- `frontend/design-system/src/forms/Select.tsx` + `.css` - native `<select>` styled to TextField's chrome, chevron icon, same label/error conventions
- `frontend/design-system/src/forms/Checkbox.tsx` + `.css` - visually-hidden native input driving a styled box, label is the full clickable hit area
- `frontend/design-system/src/forms/Switch.tsx` + `.css` - `role="switch"` track/thumb, 36×20px, controlled/uncontrolled
- `frontend/design-system/src/forms/Combobox.tsx` + `.css` - ARIA combobox/listbox, client-side or server-backed (`onSearch`) filtering, keyboard nav, clearable, loading skeleton rows
- `frontend/design-system/src/forms/DatePicker.tsx` + `.css` - typed ISO entry + keyboard-operable month-grid calendar popover, `withTime`, `zone` hint, `min`/`max` bounds
- `frontend/design-system/test/forms.test.tsx` - 6 tests: TextField error/aria-invalid, TextField label association, Checkbox label-click-toggle, Combobox type+ArrowDown+Enter selection, DatePicker range-error wording, full Tab-order keyboard operability across TextField/Select/Checkbox/Switch
- `frontend/design-system/src/index.ts` - added FORMS section exporting all 6 components + their types

## Decisions Made

- **DatePicker's calendar-grid date arithmetic uses UTC `Date` objects internally**, keyed by plain `YYYY-MM-DD` strings, specifically to avoid local-timezone date-shift bugs when computing "day before"/"day after"/"same day next month" for the grid — the component's external `value`/`onChange` contract is unaffected (plain ISO strings in, plain ISO strings out; no timezone math applied to the stored value itself, only to grid navigation).
- **Combobox's blur handling uses a short `setTimeout` revert** rather than relying solely on `onMouseDown preventDefault`, so that both a mouse-click selection and a Tab/click-outside dismissal resolve correctly without a race between the input's native blur and the option's click handler.

## Deviations from Plan

None - plan executed exactly as written. `@testing-library/user-event` (needed for the `forms.test.tsx` keyboard-interaction tests) was already present as a devDependency in `frontend/design-system/package.json`, added by a prior plan (01-06) already merged into this branch — no new dependency was required.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. This plan is a pure frontend component library addition with no runtime dependencies, no datastore, no environment variables.

## Next Phase Readiness

- `window.EPMP` now exposes 14 total components (8 from 01-02 + 6 from this plan): `Icon`, `Button`, `IconButton`, `Skeleton`, `Badge`, `Alert`, `EmptyState`, `Toast`, `TextField`, `Select`, `Checkbox`, `Switch`, `Combobox`, `DatePicker` — all 6 form controls this plan's `must_haves.artifacts` and `integration_contracts.provides` promised, verified present via the plan's own grep contract checks.
- Wave 4's admin console screens (SSO config form, user/role editors, federation grant form — F8/F10) can now be built entirely from these controls with no hand-rolled form substitutes, since every control named in those screens' FRD definitions (`TextField`, `Select`, `Combobox`, `DatePicker`, `Checkbox`, `Switch`) now exists.
- `frontend/design-system` builds cleanly from a wiped `dist/` directory (`rm -rf dist && npm run build` → exit 0) and the full Vitest suite passes 40/40 from a clean state.
- No blockers for subsequent Wave 2/3 design-system plans (data/navigation/overlays layers — already present per `src/index.ts`'s DATA/NAVIGATION/OVERLAYS/LAYOUT sections from parallel plans 01-04/01-06) or for Wave 4 admin console plans to begin consuming this form-control layer.

---
*Phase: 01-platform-foundation-deployable-shell*
*Completed: 2026-11-16*

## Self-Check: PASSED

- All 13 created files verified present on disk via `[ -f ]`-equivalent checks (forms/{TextField,Select,Checkbox,Switch,Combobox,DatePicker}.{tsx,css}, test/forms.test.tsx).
- All 3 task commits verified present via `git log --oneline`: `8b91b0d`, `204614e`, `555ce32`.
- Clean rebuild (`rm -rf dist && npm run build`) → exit 0, produced `dist/bundle.js` (48.78 kB), `dist/bundle.es.js` (75.22 kB), `dist/bundle.css` (27.32 kB).
- `npx tsc --noEmit` → exit 0, no type errors, run twice (after Task 1+2, and again after the index.ts export update in Task 3).
- `npx vitest run` (full suite, not filtered) → exit 0, 40/40 tests passed (34 pre-existing from other plans already merged to this branch + 6 new from this plan's `forms.test.tsx`).
- Plan's own literal `<verify>` grep commands re-run and confirmed passing: focus-ring-never-suppressed (Task 1 + Task 2 files), `htmlFor` label association (TextField/Select), ARIA combobox pattern present, keyboard-nav grep count ≥1, DatePicker typed-entry `<input type="text">` present, both `integration_contracts` grep checks (`Icon` export present, all 6 new component exports present).
- `## Known Stubs` section below: no blocking stubs found via `grep -rnE "TODO|FIXME|placeholder|not.?implemented|coming soon"` across all created/modified files — the only matches were the legitimate HTML `placeholder` attribute and doc-comment uses of the word "placeholder" in its design-system sense (an example value, never a label substitute), not an implementation stub.

## Known Stubs

None found (blocking or cosmetic). Grep scan across all 13 created files plus the modified `src/index.ts` for `TODO|FIXME|placeholder|not.?implemented|coming soon` returned only legitimate occurrences of the word "placeholder": the native HTML `placeholder` prop/attribute on `Combobox`'s search input and `DatePicker`'s typed-date input, and doc-comments explaining the design system's "placeholder is never a label" rule. No hardcoded/static data standing in for real logic, no empty function bodies, no components rendered with dummy props, no stubbed behavior, no silently-swallowing catch blocks (none needed — no I/O in this plan). All 6 components implement their full Chapter 11 FORMS spec behavior.
