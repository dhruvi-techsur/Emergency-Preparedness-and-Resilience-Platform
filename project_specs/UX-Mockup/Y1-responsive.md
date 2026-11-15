## Responsive Considerations

Breakpoints (per design-system tokens): `bp-sm` 640px, `bp-md` 768px, `bp-lg` 1024px, `bp-xl` 1280px.

### Desktop (≥ bp-lg, 1024px+)

- `SideNav` expanded (240px), lifecycle-grouped, 6–9 top-level items.
- Two/three-column operating-picture layout: `MapCanvas` 8 of 12 columns, right column (`Timeline`/tasks) 4 of 12.
- Incident Workspace: left two-thirds active tab content, right third pinned command-roles + map-thumbnail `Card`.
- Dashboard: 12-column grid of `Card`s (8/4 or 6/6 split).
- Two charts per row on Analytics & Reporting Dashboard at `bp-lg`+.
- `Table` is the default dense data presentation; full columns visible.

### Tablet (bp-md to bp-lg, 768–1023px)

- `SideNav` remains expanded (or collapses to 64px icon rail per agency config) — nav still fully present above `bp-md`.
- Dashboard grid collapses toward single/double column as width tightens; `Stat` row may wrap to 2×2.
- Operating-picture map remains visible but the right-column `Timeline`/task list may stack beneath rather than beside the map as width approaches `bp-md`.
- Forms remain single column, max 560px, unaffected by this range.

### Mobile (< bp-md, phones and small tablets)

- **`SideNav` collapses to a bottom bar of exactly 4 destinations**, role-dependent (e.g., PER-04 sees Tasks/Report/Map/Profile; PER-02 on mobile might see Incidents/Tasks/Resources/Profile). Header strip keeps only `SyncStatus` and the incident name (if applicable) — nothing else.
- Dashboard/list grids collapse to a single column.
- **`Table` instances convert to card/label-value layouts below `bp-sm`** (640px) per the platform-wide responsive rule — this applies automatically to every feature-specific `Table` (tasks, resource requests, incidents, plans) without per-feature redefinition.
- Operating-picture map becomes full width; the right-column `Timeline`/task list becomes a bottom sheet.
- `MapLegend` is collapsible on mobile.
- **Field-mobile screens (F6) always use `size="lg"` (44px) controls**, single-column `body-lg` text, 24px checkboxes, and a bottom action bar with exactly one primary `Button`. This applies to Field Home, My Tasks, Report Observation, Queued Submissions, Sync Conflict Resolution, and Field Map regardless of actual viewport width — these are the canonical field-mobile layouts.
- Photo and location capture are always one-tap with a visible text/thumbnail confirmation — never hover-dependent or swipe-only.
- `SyncStatus` is pinned at the very top of every mobile screen and is never hidden, collapsed, or deprioritized regardless of available space.
- Tooltips are never the only carrier of information on touch devices (no hover on touch) — anything essential appears as visible text.

### Cross-cutting responsive rules

- Touch targets are ≥44px (`size="lg"`) on any field-mobile breakpoint or when `SyncStatus` indicates a field-mobile context; desktop minimum is 24px per WCAG 2.2 with adequate spacing.
- Charts fall back to `BarChart horizontal` or a `Table`/hidden-data-table below `bp-sm` where a vertical `BarChart`/`LineChart` would become illegible.
- Grids always collapse to one column below `bp-md`; never hide status or `SyncStatus` at any breakpoint.
- No breakpoint changes which information is available — only how it's laid out (card-vs-table, column count, nav placement).
