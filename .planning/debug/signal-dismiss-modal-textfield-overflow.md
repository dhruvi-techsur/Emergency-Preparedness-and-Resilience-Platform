---
status: diagnosed
trigger: "Investigate issue: signal-dismiss-modal-textfield-overflow"
created: 2026-11-19T00:00:00Z
updated: 2026-11-19T00:10:00Z
---

## Current Focus

hypothesis: CONFIRMED — the `.ep` box-sizing-reset class (tokens.css `.ep, .ep * { box-sizing: border-box }`) is never applied anywhere in the real app's DOM tree, so every design-system component (not just Modal/TextField) renders in the browser default `content-box` mode. This makes `width: 100%` add on top of padding/border instead of including them, pushing the textarea's rendered edge past the Modal's edge.
test: Playwright script signed in as eocdirector@epmp.local, opened the real Dismiss modal on a New-status signal, read computed styles + bounding boxes directly from the live DOM, and searched the entire app source for any `className="ep"` application.
expecting: textarea computed boxSizing = "content-box" (not "border-box"), and zero elements in the document carrying the exact class "ep".
next_action: none — root cause confirmed with direct observation; returning diagnosis (goal: find_root_cause_only).

## Symptoms

expected: The Dismiss-signal confirmation Modal's Reason text box renders fully inside the Modal's bounds at any viewport width — a standard contained form field, not overflowing the dialog's edges.
actual: User reported (verbatim): "the test case works as expected, but the formatting of the text box is messed up. it goes outside the modal."
errors: None reported — purely a CSS/layout rendering issue, not a crash or functional failure.
reproduction: Test 8 in UAT (sign in as eocdirector@epmp.local / devpass123, go to /signals, click Dismiss on a New-status signal row, observe the Reason text box in the resulting Modal)
started: Discovered during UAT testing of Phase 6 (Persona Dashboards & AI Assistance)

## Eliminated

- hypothesis: textarea default `resize: both` handle visually extends past the modal (independent of width calc)
  evidence: computed style showed `resize: "both"` IS present, but the bounding-box math shows the overflow is fully explained by content-box width math alone (textarea offsetWidth 506 = 480 content + 2px border + 24px padding, matching the predicted content-box formula exactly) — the resize handle is a secondary cosmetic issue, not the primary overflow cause. Did not rule out a tiny additional contribution from the resize handle itself but it's not the dominant mechanism.
  timestamp: 2026-11-19T00:08:00Z

- hypothesis: horizontal overflow from textarea's own `cols` attribute
  evidence: `getAttribute('cols')` returned `null` in computed-style dump — TextField.tsx never sets a `cols` prop, so this is not a contributing factor.
  timestamp: 2026-11-19T00:08:00Z

- hypothesis: SignalTriageQueue.tsx's own markup (footer/body children layout) introduces a flex/grid quirk specific to this screen
  evidence: SignalTriageQueue.tsx renders the TextField as a plain, unstyled child of Modal with no wrapping div or custom CSS — the overflow mechanism (content-box width math) lives entirely in the design-system's Modal.css/TextField.css + the app's missing `.ep` class, which is identical for every Modal+TextField combination in the app. Not specific to this screen's own markup.
  timestamp: 2026-11-19T00:09:00Z

## Evidence

- timestamp: 2026-11-19T00:03:00Z
  checked: tokens.css lines 349-361 (the box-sizing reset block)
  found: `.ep, .ep * { box-sizing: border-box }` — the border-box reset is SCOPED to descendants of an element carrying the literal class `ep`. It does not apply globally; it requires some ancestor in the real DOM tree to have `className="ep"`.
  implication: if no element in the app's actual render tree has this class, every design-system component in the app renders in the browser's default `content-box` sizing mode.

- timestamp: 2026-11-19T00:04:00Z
  checked: exhaustive grep across `frontend/app/src/**/*.tsx` and `frontend/design-system/src/**/*.tsx` for any literal `className="ep"` / `className='ep'` application (not `ep-*` prefixed classes, the exact bare token `ep`)
  found: ZERO occurrences in the actual app or design-system component source. The ONLY places `className="ep"` appears anywhere in the repo are the design-system's own Vitest test harnesses (`frontend/design-system/test/*.test.tsx`), which wrap their test fixtures in `<div className="ep" data-theme={theme}>` specifically so the border-box reset + theme tokens apply during component-level testing.
  implication: the design system's own test suite proves the INTENDED usage pattern is "consumer app wraps its root in `<div className=\"ep\">`" — but the real EPMP app (`frontend/app/src/main.tsx` → `AppShell.tsx`, root element uses `className=\"ep-shell\"`, NOT `ep`) never does this. This is an integration gap between the design system and its consumer app, not a bug in either component's own logic.

- timestamp: 2026-11-19T00:06:00Z
  checked: live rendered DOM via Playwright — signed in as eocdirector@epmp.local, navigated to /signals, opened the Dismiss modal on a New-status row, inspected `.ep-modal`'s full ancestor chain up to `<html>`
  found: Ancestor chain = `DIV.ep-modal <- DIV.ep-modal-scrim <- DIV.ep-signal-triage <- MAIN.ep-shell__content <- DIV.ep-shell__main-col <- DIV.ep-shell <- DIV <- BODY <- HTML`. `document.querySelectorAll('.ep').length` = **0** in the entire live document.
  implication: directly confirms (not just source-grep) that no ancestor of this specific Modal instance carries the `.ep` class — the border-box reset genuinely does not apply here.

- timestamp: 2026-11-19T00:07:00Z
  checked: computed styles + bounding boxes of `.ep-modal` and its `textarea.ep-textfield` child, read live via `getComputedStyle()` and `getBoundingClientRect()`-equivalent Playwright `.boundingBox()`
  found: |
    modal: boxSizing="content-box", width(style)="480px" (maxWidth inline style), padding="24px", offsetWidth=528 (480 + 2×24 padding, i.e. padding ADDED to the 480px content width — proof content-box is active on the modal itself too, not just the textarea)
    textarea: boxSizing="content-box", width(style)="480px" ← this is the *computed* width, derived from `width:100%` of its containing block (the `.ep-textfield-wrap` flex child, clientWidth=480), border="1px solid ...", padding="8px 12px", resize="both", offsetWidth=506 (480 content + 2×1 border + 2×12 padding = 506, exactly matching the content-box formula)
    Modal boundingBox: {x:376, width:528} → right edge at x=904
    Textarea boundingBox: {x:400, width:506} → right edge at x=906
    **Textarea's right edge (906) is 2px PAST the modal's right edge (904)** — a small but real, directly-measured overflow of the textarea past the dialog's visible boundary.
  implication: this is the exact, directly-observed mechanism. Because `.ep-modal` itself is also in content-box mode, ITS padding (24px each side) is added on top of its own 480px width, growing the modal shell to 528px. Separately, the textarea computes `width:100%` against its flex-wrap container's content width (480px, inherited from the modal's inner layout chain) and then — because the textarea is ALSO content-box — adds its own 1px border + 12px horizontal padding on top of that 480px, growing to 506px. The two content-box "add-on" amounts (modal: +48px outer, textarea: +26px inner) don't cancel out across the padding boundary, so the textarea's right edge ends up outside the modal's rendered right edge by 2px. This reproduces and explains the user-visible "goes outside the modal" symptom precisely — and it will reproduce (scaled by whatever paddings/borders are involved) for ANY TextField/multiline field directly inside ANY Modal in the app, not just this one.

- timestamp: 2026-11-19T00:09:00Z
  checked: grep for other `<Modal>` usages containing a `multiline` TextField (RecipientGroups, MessageTemplates, ComposeNotification, SignalDetail, ResourceRequestDetail, ReviewPlanModal, RecordAuthority)
  found: all of these compose Modal + TextField the same structural way (TextField as a direct/near-direct child of Modal, no extra width-correcting wrapper) — same design-system components, same missing `.ep` ancestor class.
  implication: this is a systemic design-system/app integration bug (every Modal+multiline-TextField combination is affected to varying visible degree depending on padding/border sums), not something specific to SignalTriageQueue.tsx's own markup.

## Resolution

root_cause: |
  The design system's base CSS reset (`.ep, .ep * { box-sizing: border-box }` in `frontend/design-system/tokens/tokens.css` lines 352-355) is scoped to only apply inside an element carrying the literal class `ep`. The design system's OWN test suite wraps every test fixture in `<div className="ep">` to get this reset — confirming that's the intended integration contract. However, the real consumer app (`frontend/app/src/main.tsx` → `AppShell.tsx`) never applies the `.ep` class anywhere in its rendered tree (its shell root uses `className="ep-shell"`, a different, unrelated class). Confirmed live via Playwright: `document.querySelectorAll('.ep').length === 0` in the actual running app.

  As a result, every design-system component in the real app — including `.ep-modal` and `.ep-textfield`/`textarea.ep-textfield` — renders in the browser's default `content-box` sizing mode instead of `border-box`. Components whose CSS sets `width: 100%` (or an explicit px width) plus non-zero padding/border therefore render WIDER than their nominal width, because padding/border get added on top instead of being carved out of it. For the specific Dismiss Modal: the modal shell itself grows from 480px to 528px (24px padding × 2 added on top), and the textarea — computing `width:100%` against its container's 480px content-box width — grows to 506px (1px border × 2 + 12px padding × 2 added on top). The two growth amounts don't align across the modal's padding boundary, so the textarea's right edge (measured x=906) ends up 2px past the modal's own right edge (measured x=904) — directly observed and measured, not inferred.

  This is NOT specific to SignalTriageQueue.tsx's markup — every other Modal+multiline-TextField combination in the app (RecipientGroups, MessageTemplates, ComposeNotification, SignalDetail, ResourceRequestDetail, ReviewPlanModal, RecordAuthority) shares the exact same missing-`.ep`-ancestor root cause and will exhibit the same (degree-varying) overflow.
fix: "(not applied — goal is find_root_cause_only) Suggested direction: apply the `.ep` class to the app's actual root DOM element (e.g. `AppShell`'s outer wrapper in `frontend/app/src/app-shell/AppShell.tsx`, alongside or in place of `ep-shell`) so the design system's intended border-box reset scope covers the whole app — mirroring exactly what the design system's own test harnesses already do. This is a one-class, one-line fix at the integration boundary, not a change to Modal.css or TextField.css themselves (whose per-component CSS is internally consistent under the border-box assumption the design system was authored against)."
verification: "(not run — diagnose-only mode)"
files_changed: []
