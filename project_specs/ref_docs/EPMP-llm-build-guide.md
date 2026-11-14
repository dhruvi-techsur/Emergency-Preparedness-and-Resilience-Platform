# LLM build guide

Give an LLM this system by handing it this file plus `README.md`, `tokens.json` (or the compiled `tokens.css`), `components/bundle.js` and `components/bundle.css`. The section "Prompt to paste" is the contract.

## Prompt to paste

```
You are building a screen for EPMP, the TechSur Emergency Preparedness & Management Platform. Build ONLY with the EPMP design system.

Sources of truth, in priority order: the component README for each component you use, README.md (rules), tokens.json / tokens.css (values), patterns.md (page layouts), data-visualization.md (charts), maps.md (maps), accessibility.md, content-and-voice.md.

Rules (non-negotiable):
1. Use window.EPMP components first (Button, TextField, Combobox, DatePicker, Card, Table, Badge, Alert, Tabs, Modal, Timeline, LineChart, BarChart, DonutChart, Heatmap, MapCanvas, LayerPanel, AIDraft, Provenance, SyncStatus, and the rest). Charts and maps only through the chart and map components. Do not build a new component if one fits.
2. Use design tokens only: color, spacing, radius, type, shadow, size, z-index, duration through var(--token) and the type classes (.h1 ... .caption). Never write a hex value, an arbitrary pixel size, a font name, or a box-shadow.
3. Modern, minimalist, clean: neutral surfaces, one brand teal for the primary action, one gold highlight at most. No gradients, no card shadows, no colored side borders, no emoji, no stock imagery.
4. One primary Button per region. Verb-first labels in sentence case.
5. Status is always icon + word + color (Badge, Alert, SyncStatus). Never color alone.
6. AI output only through AIDraft with Provenance sources, approved by a named person. Never auto-send anything AI-generated.
7. Every list, table and panel has loading (Skeleton), empty (EmptyState) and error (Alert) states. Show offline state with SyncStatus on pages used in the field.
8. Accessibility: WCAG 2.2 AA, visible focus, full keyboard use, labels on every field, 44px touch targets on mobile (size="lg"), one h1, ordered headings, works in light, dark and contrast themes.
9. Mobile first. Respect breakpoints bp-sm 640, bp-md 768, bp-lg 1024, bp-xl 1280.
10. Do not claim FedRAMP authorization anywhere.

Process: (a) state which pattern from patterns.md you are using; (b) list the components you will use; (c) build; (d) run the checklist at the end of llm-build-guide.md and report any item you could not satisfy. If a needed token or component does not exist, say so and propose it; do not improvise values.

Task: <describe the screen, the user's role, the data, the primary action>
```

## Loading the system in a page

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="components/bundle.css">
<script src="react.production.min.js"></script>
<script src="react-dom.production.min.js"></script>
<script src="components/bundle.js"></script>
<body data-theme="light">  <!-- light | dark | contrast -->
<div id="root" class="ep"></div>
<script>
  const { PageHeader, Card, Button, Badge } = window.EPMP;
  const h = React.createElement;
  ReactDOM.createRoot(document.getElementById('root')).render(
    h(PageHeader, { title: 'Incidents', actions: h(Button, null, 'Create incident') })
  );
</script>
```

## Using tokens

- CSS: `padding: var(--space-4); background: var(--bg-raised); border: var(--border-1) solid var(--border); border-radius: var(--radius-lg); color: var(--ink);`
- Type: apply the class (`class="h2"`, `class="body"`, `class="caption"`) or the same sizes from `tokens.json` `type.groups`. Mono (`code`, `data` styles) for ids, times and log lines.
- Never reference palette values. Pick by meaning: `bg-subtle` for a quiet panel, `danger-text` for error text, `brand-text` for a link.
- Compose layouts with CSS grid or flex using spacing tokens; use `content-max` for the page width and `reading-max` for text columns.

## Mapping intent to components

| The screen needs | Use |
| --- | --- |
| A grouped panel | `Card` (padded false for tables) |
| Page title, crumbs, actions | `PageHeader` |
| A KPI | `Stat` |
| Records in rows | `Table` + `Badge` for status |
| A history or audit trail | `Timeline` |
| A form | `TextField`, `Select`, `Combobox`, `DatePicker`, `Checkbox`, `Radio`, `Switch` in a `Card` |
| Search a long list | `Combobox` |
| A date or incident time | `DatePicker` (`withTime`, `zone`) |
| A trend, comparison or share | `LineChart`, `BarChart`, `DonutChart`, `Sparkline`, `Heatmap` |
| A map with incidents, assets, hazards | `MapCanvas` + `MapControls`, `LayerPanel`, `MapLegend`, `MapPopup` |
| A destructive confirm | `Modal danger` with outcome-named buttons |
| Something to review | `Alert` (persistent) or `Toast` (confirmation) |
| Drafted by AI | `AIDraft` + `Provenance` |
| Connectivity | `SyncStatus` |
| Nothing here yet | `EmptyState` |
| A view switch within a page | `Tabs` |

## Anti-patterns to reject

Hard-coded colors; shadows on cards; gradient or tinted hero banners; colored left borders on cards; third-party chart themes; color-only chart series; map markers without a shape and outline; emoji or filled icon sets; ghost buttons used as the only primary action; "Submit"/"OK" labels; placeholder-only fields; status shown as a colored dot alone; tables without header scope or caption; modals that stack; dark text on `brand` in light theme (use `on-brand`); auto-issued AI messages; vendor or feed claims shown as verified facts.

## Self-check before returning code

- [ ] Only tokens and EPMP components; no raw hex, no arbitrary px outside the scale.
- [ ] One `h1`; headings in order; landmarks present.
- [ ] One primary Button per region; labels verb-first, sentence case.
- [ ] Every status has icon + word.
- [ ] Loading, empty, error (and offline where relevant) handled.
- [ ] AI content only in `AIDraft` with sources; no auto-send.
- [ ] Focus visible, keyboard path complete, labels and errors associated.
- [ ] Verified in `light`, `dark` and `contrast`; checked at 375px and 1280px.
- [ ] Touch targets 44px on mobile screens.
- [ ] Charts have a label, printed values and pattern or shape differences; maps list data age and source.
- [ ] Copy follows `content-and-voice.md` and uses its terminology.
