## Accessibility Notes

Target: **WCAG 2.2 AA** and **Section 508** on every screen in this document, with the `contrast` theme as an additional high-contrast option. Conformance is demonstrated by testing (keyboard pass, screen-reader pass, axe scan, 200%/400% zoom, contrast audit per theme) — **never asserted as a certification EPMP does not hold, and no screen may claim FedRAMP authorization in any copy** (hard constraint, verified explicitly on every admin/executive screen).

### Contrast

- Text: 4.5:1 minimum on its ground (3:1 for 24px+/19px-bold+ text); **7:1 in the `contrast` theme** — applies to every screen including map labels, chart labels, and `AIDraft`/`Provenance` chip text.
- Controls, focus rings, icons, and chart marks that carry meaning: 3:1 minimum. Control borders always use `border-strong`, never the decorative `border` token.
- `accent` (gold) is under 3:1 on `bg` in all themes — used only as a fill carrying `on-accent` text (e.g., the brand mark, a single highlighted row), never as a lone status mark or body text. No screen in this document uses gold for status.
- Full functional and visual parity is required across light/dark/contrast on every screen, including `MapCanvas` base-layer styling (`map-*` tokens) and every chart (`viz-*`/`seq-*` tokens).

### Color and meaning — status always icon + word + color

Every status indicator across all 22 screens (`Badge`, `Alert`, `SyncStatus`, map markers) renders as **icon + word + color**, never color alone:
- Incident severity: Critical = `danger solid` + alert icon + word "Critical"; Elevated = `warning` + icon + word; Watch = `info` + icon + word; Normal = `success` + check icon + word.
- Task/resource-request status `Badge`s: Open/Draft (neutral/info), In progress/Awaiting approval (brand/warning), Done/Fulfilled/Approved (success + check), Overdue/Declined (danger + alert), each with the status word.
- `SyncStatus`: `online` (check icon + "Online"), `syncing` (spinner icon + "Syncing"), `offline` (wifi-off icon + "Offline" + queued count), `conflict` (alert icon + "Conflict").
- Map markers differ by **shape** (incident diamond, facility square, resource triangle, shelter circle) in addition to tone, each outlined in `ink` for 3:1 against any base — never tone alone.
- Charts: series differentiated by shape/marker/pattern in addition to color (`LineChart` marker shapes, `BarChart patterns` for print/grayscale/contrast), with values printed directly rather than requiring legend lookup.

### Keyboard and focus

- Skip-to-content link is the first focusable element on every page (all 22 screens), before `SideNav`.
- Everything operable by keyboard in a logical order; no keyboard traps; no hover-only or gesture-only controls anywhere (explicitly verified on all F6 field-mobile screens: photo capture, location capture, status updates, and conflict resolution all have visible single-tap button equivalents).
- Visible focus: 2px solid `focus-ring`, 2px offset, never removed, on every interactive element across every screen in this document.
- `Modal` traps focus, closes on Escape, returns focus to the trigger (verified on Command Role Assignment, Activation Level Change, Decline Reason, Suspend User, Revoke Federation Grant modals).
- `Tabs` use Left/Right arrow keys (Incident Workspace Timeline/Tasks/Resources/Reports tabs).
- Map markers are keyboard-focusable (Tab, Enter) with a hidden text-list equivalent for screen readers (Operating Picture, Field Map).

### Touch and motion

- Field-mobile controls use `size="lg"` (44px minimum) throughout: Field Home, My Tasks, Report Observation, Queued Submissions, Sync Conflict Resolution, Field Map.
- No gesture without a single-pointer alternative anywhere in the field-mobile surface.
- `prefers-reduced-motion` respected; nothing loops except the `Skeleton` pulse and `Button loading` spinner; nothing flashes more than 3 times per second.

### Structure and semantics

- **One `h1` per page, via `PageHeader`, with ordered headings beneath it (no skipped levels)** — verified across all 22 screens (e.g., Incident Workspace: h1 incident name → h3 tab panel titles → h4 field-group headings; Executive Briefing: h1 → caption KPI context, no h2/h3 skipped).
- Landmarks: `header`, `nav` (labelled), `main`, `footer` present in the app shell wrapping every screen.
- `Table` instances have `th scope="col"` and a `caption` (screen-reader title) — Incident List, Task List, Resource Request List, Evidence & Audit Log View, Integration Health, Users, Record Authority Registry, Federation Grants, Signal Triage Queue, Delivery & Acknowledgment Tracking.
- `aria-live` (`status`/`alert`) used sparingly for async updates: `SyncStatus` state changes, Delivery & Acknowledgment Tracking auto-refresh, Dashboard `Stat` tile event-bus updates.
- Page titles describe the page and, where applicable, the incident name (e.g., "Riverbend flood response — Incident Workspace").

### Forms

- Every field has a visible, programmatically associated label (never placeholder-only) — Create Incident, Create Task, Create Resource Request, Compose Notification, SSO Configuration, AAR Generator Step 4.
- Hint and error text linked via `aria-describedby`; required fields indicated in text, not color alone; errors identified with text + icon + a suggested fix, shown on blur/submit (never on first keystroke).
- Radio groups wrapped in `fieldset`/`legend` (e.g., Resource type selection where applicable).
- On submit with errors, focus moves to the first invalid field and a summary `Alert danger` appears above the form (Create Incident, Create Task, Compose Notification).

### Content

- Plain language throughout (grade 8 or below for any public-facing notification copy); acronyms (EOC, ICS, COP, AAR, SITREP) expanded on first use per page.
- Every ingested or AI-derived fact carries a text/`Provenance` equivalent — maps and charts always have a text/table alternative for screen readers (Operating Picture hidden marker list; every chart's hidden data table).
- AI output copy always says "Draft" and names who must approve — never "AI decided" or "AI approved" (verified in `AIDraft` panel copy across F1, F5, F7, F9 screens).
- Unverified information always says "Unverified" and names its source — never presented as a confirmed fact (Operating Picture `LayerPanel`, Signal Detail `Provenance` chips).

### Testing checklist (per release, applied to every screen in this document)

1. Keyboard-only pass of each full flow (all 9 flows in this document).
2. Screen-reader pass (NVDA/JAWS and VoiceOver) of each primary flow.
3. 200% and 400% zoom, no loss of content, on all 22 screens.
4. All three themes (light/dark/contrast) verified on every screen.
5. Contrast audit including interactive states (hover/pressed/disabled/focus).
6. Reduced-motion verification.
7. Automated scan (axe) with zero serious or critical issues.
8. Section 508 test process results recorded for the release; zero unresolved findings claimed, never a certification assertion.
