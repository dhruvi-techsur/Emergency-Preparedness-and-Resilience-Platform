## Epic 0: Web & Mobile Application Shell (F0)

The app shell, navigation, page-pattern library, and theming system every persona uses to operate EPMP. No other feature is usable without this surface.

### US-0.1: Role-scoped navigation on sign-in
**As a** Maria Alvarez / EOC Director, **I want to** see a navigation structure organized by lifecycle stage (Prepare, Monitor, Activate, Coordinate, Recover, Improve) scoped to my role, **so that** I can find the right tool for my current job without wading through screens meant for other roles.

**Acceptance Criteria:**
- [ ] `SideNav` renders 6–9 top-level items grouped in lifecycle order Prepare → Monitor → Activate → Coordinate → Recover → Improve
- [ ] `SideNav` collapses to a bottom bar of exactly 4 destinations below `bp-md`, with destinations determined by role (F18)
- [ ] Current page is highlighted `brand-subtle`; brand mark (gold square + "EPMP" `h4`) shown at top
- [ ] A user never sees a `SideNav` group or action their role doesn't permit (no disabled/grayed items — items are absent)
- [ ] Skip-to-content link is the first focusable element on every page

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.2: Switch between light, dark, and contrast themes
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** switch between light, dark, and contrast (Section 508 high-contrast) themes from any page, **so that** operators in low-light EOC conditions and users needing high contrast can work comfortably and accessibly.

**Acceptance Criteria:**
- [ ] Theme switcher (`Select`/`Switch` group) is reachable from the user/profile menu on every page
- [ ] Choosing `light`, `dark`, or `contrast` applies instantly via `data-theme` without a page reload
- [ ] Theme preference persists per-user and is applied before first paint on next load (no flash of incorrect theme)
- [ ] Contrast theme achieves 7:1 text contrast; all three themes achieve full functional and visual parity, including maps and charts
- [ ] Theme preference save failure shows a clear error ("Couldn't save your theme preference...") and does not block continued use

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.3: Consistent loading, empty, and error states everywhere
**As a** James Okafor / Incident Commander, **I want to** see consistent loading, empty, and error treatments on every list, table, and panel, **so that** I always know whether data is still arriving, genuinely absent, or failed to load — never left guessing during a live incident.

**Acceptance Criteria:**
- [ ] Every list/table/panel shows `Skeleton` sized to the final layout when loading takes more than 300ms, and replaces skeletons atomically (no partial replace / layout shift)
- [ ] First-use empty state shows a title, one sentence, and at most one action (e.g., "No incidents yet" + "Create incident")
- [ ] Filtered-out empty state is visually distinct from first-use empty state (e.g., "No incidents match" + "Clear filters")
- [ ] Error state shows `Alert` (danger) with a Retry action and keeps last-known data visible, labeled with its age
- [ ] Status is always shown as icon + word + color, never color alone, across every `Badge`/`Alert`/`SyncStatus` instance

**Priority:** P0 | **Feature Ref:** F0

---

### US-0.4: Design-system-only screens with no ad hoc components
**As a** Dana Whitfield / IT/SecOps Admin, **I want to** have any screen that needs a treatment the 40-component design system doesn't support flagged as a logged gap rather than improvised, **so that** the product never accumulates inconsistent, inaccessible one-off UI that undermines trust and compliance.

**Acceptance Criteria:**
- [ ] No screen ships with raw hex colors, arbitrary pixel values, or custom components outside the `window.EPMP` set
- [ ] When a screen needs an unsupported treatment, a "Design system gap" flag is logged and visible to F8 admins with the proposed addition described
- [ ] Every page has exactly one `h1` (via `PageHeader`) with ordered headings beneath it — no skipped levels
- [ ] Every interactive element shows a visible 2px focus ring on focus; no element suppresses focus styling
- [ ] Touch targets on field-mobile breakpoints are ≥44px (`size="lg"`)

**Priority:** P0 | **Feature Ref:** F0
