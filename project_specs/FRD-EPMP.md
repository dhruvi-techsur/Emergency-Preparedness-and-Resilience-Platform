# FRD — EPMP (Emergency Preparedness & Management Platform)

**Document type:** Functional Requirements Document
**Project acronym:** EPMP
**Status:** Draft v1 — elaborates `PRD-EPMP.md` features F0–F18
**Last updated:** 2026-11-14

**Source material:** `project_specs/PRD-EPMP.md` (committed MVP feature set, NFRs, out-of-scope), `project_specs/PERSONAS-EPMP.md` (5 consolidated personas: PER-01 EOC Director/EMA Coordinator, PER-02 Incident Commander/PIO, PER-03 Planning & Logistics Section Chief, PER-04 Field Responder, PER-05 IT/SecOps Admin & Executive Sponsor), `project_specs/ref_docs/TechSur_EPMP_Product_Definition.pdf.md` (business context, external interfaces), `project_specs/ref_docs/EPMP-Design-System.pdf.md` (40-component design system, tokens, page patterns), `project_specs/ref_docs/EPMP-llm-build-guide.md` (build contract), `.planning/PROJECT.md` (scope decisions).

**Evidence boundary:** This FRD commits only to the MVP scope defined in the PRD. Any capability named in the TechSur source but deferred in the PRD's Out of Scope section (advanced logistics, risk intelligence, exercises/simulation, continuous monitoring, continuity/recovery beyond basic AAR, Phase 2/3 AI) is explicitly NOT specified here.

---

## Scope Statement

This FRD specifies exact inputs, outputs, validation rules, process steps, and error states for every PRD feature (F0–F18), so that developers can implement each feature without re-deriving intent from the PRD or source documents. It also consolidates the data model (schema), the REST API surface, the cross-feature error catalog, and the external integration contracts into dedicated cross-feature chunks. UI requirements are specified as concrete screens, components (from the EPMP Design System's `window.EPMP` set), states (loading/empty/error/offline), and navigation — not as an afterthought to the API.

## Conventions

- **Feature IDs** (`F0`–`F18`) are carried unchanged from the PRD and are never renumbered.
- **Component names** in backticks (e.g., `Table`, `AIDraft`, `SyncStatus`) refer to the EPMP Design System's `window.EPMP` component library — see the design-system reference for full prop contracts. Every screen in this FRD is built exclusively from this set; if a screen needs something the set doesn't have, that gap is called out explicitly rather than silently improvised.
- **Design tokens** (e.g., `--space-4`, `brand`, `danger-solid`) refer to `tokens.json`/`tokens.css`. No raw hex values or arbitrary pixel sizes are permitted in any implementation of this FRD.
- **Status vocabulary** is fixed and reused across every feature: incidents (`Critical`/`Elevated`/`Watch`/`Normal` severity; `Monitoring`/`Partial`/`Full` activation), tasks (`Open`/`In progress`/`Awaiting approval`/`Done`/`Overdue`), resource requests (`Draft`/`Awaiting approval`/`Approved`/`Fulfilled`/`Declined`), plans (`Draft`/`Review`/`Approved`), sync (`online`/`syncing`/`offline`/`conflict`). Every status renders as icon + word + color (`Badge`), never color alone.
- **API conventions:** all endpoints are versioned (`/api/v1/...`), JSON request/response, OAuth2/OIDC bearer tokens, idempotency keys required on all mutating webhook-triggered calls. Full request/response schemas live in `Y1a`–`Y1d`; per-feature chunks reference them rather than repeating them.
- **Schema conventions:** PostgreSQL + PostGIS. All tables carry `id UUID PK`, `created_at`, `updated_at`, `created_by`/`updated_by` (FK to `users`) unless noted. Append-only tables (`incident_timeline`, `audit_log`) never update or delete rows — corrections are new rows. Full DDL lives in `Y0a`–`Y0d`; per-feature chunks list only the tables they own or read.
- **Cross-references:** `see F03 §Process step 4` means "read the Process section of the F03 chunk, step 4."
- **AI governance marker:** any field, draft, or output produced by F9 is tagged `[AIDraft]` in this document to flag that it must render through the `AIDraft` + `Provenance` components and requires named-person approval before becoming part of an official record. No code path may bypass this.

## Shared Terminology (cross-feature)

- **EOC:** Emergency Operations Center.
- **ICS:** Incident Command System. Roles: Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information.
- **COP:** Common Operating Picture — referred to as "operating picture" in UI copy (see F2).
- **SITREP:** Situation report.
- **AAR:** After-Action Report.
- **Activation:** Moving an EOC or incident to Monitoring, Partial, or Full.
- **Operational period:** The planning cycle for an incident (e.g., "Operational Period 2").
- **Record authority:** The explicit, documented declaration of which system (EPMP or a named external system) creates, updates, and reconciles a given record type. Every external integration feature (F11, F13, F14, F15, F16, F17) must declare this per record type it touches.
- **Provenance:** Source, timestamp, version, and confidence attached to every ingested or AI-derived fact. Rendered via the `Provenance` component. Unverified facts are never silently promoted to operational fact.
- **SyncStatus states:** `online`, `syncing`, `offline` (with queued count), `conflict`. Conflicts always surface to a named person — never silently auto-resolved.
- **Tenant / Jurisdiction:** The organizational/geographic scoping unit for RBAC and data federation. An agency may contain multiple jurisdictions (state, county, city); federation grants (F10 NFR) permit explicit, revocable cross-jurisdiction visibility.
- **Named-person approval:** Any action requiring this must record the approving user's identity and timestamp in an append-only audit trail (`incident_timeline` or `audit_log`), never a system/service account.

## Master Table of Contents

**Platform Core**
- [F0: Web & Mobile Application Shell](./F00-application-shell.md)
- [F8: Security & Administration](./F08-security-administration.md)
- [F10: Platform API, Integration Gateway & Event Bus](./F10-platform-api-gateway.md)

**Operational Modules**
- [F1: Incident / ICS](./F01-incident-ics.md)
- [F2: Common Operating Picture](./F02-common-operating-picture.md)
- [F3: Plans & Playbooks](./F03-plans-playbooks.md)
- [F4: Tasks & Resource Requests](./F04-tasks-resource-requests.md)
- [F5: Notifications Integration](./F05-notifications-integration.md)
- [F6: Mobile Field Operations](./F06-mobile-field-operations.md)
- [F7: Reporting & Learning](./F07-reporting-learning.md)

**AI Assistance**
- [F9: AI-Assisted Drafting & Signal Triage](./F09-ai-assisted-drafting.md)

**External Integrations**
- [F11: GIS & Geospatial Integration](./F11-gis-geospatial-integration.md)
- [F12: Weather & Hazard Feed Ingestion](./F12-weather-hazard-feed-ingestion.md)
- [F13: EOC COTS Interoperability](./F13-eoc-cots-interoperability.md)
- [F14: Notification Provider & Public-Alerting Integration](./F14-notification-provider-integration.md)
- [F15: CAD / 911 Integration](./F15-cad-911-integration.md)
- [F16: HR / IAM & Identity Integration](./F16-hr-iam-identity-integration.md)
- [F17: Asset, Facility & Document System Integration](./F17-asset-facility-document-integration.md)

**Experience / Role Views**
- [F18: Persona & Role-Specific Dashboards](./F18-persona-role-dashboards.md)

**Cross-Feature Chunks**
- Database Schema: [Y0a Auth/Org](./Y0a-schema-auth-org.md) · [Y0b Incident/Ops](./Y0b-schema-incident-ops.md) · [Y0c Comms/Reporting](./Y0c-schema-comms-reporting.md) · [Y0d Integration/Geo](./Y0d-schema-integration-geo.md)
- API Endpoints: [Y1a Auth/Admin](./Y1a-api-auth-admin.md) · [Y1b Incident/Ops](./Y1b-api-incident-ops.md) · [Y1c Comms/Reporting](./Y1c-api-comms-reporting.md) · [Y1d Integrations](./Y1d-api-integrations.md)
- [Y2: Error Catalog](./Y2-errors.md)
- [Y3: Integration Points](./Y3-integrations.md)

---
*This FRD is the functional foundation for `TechArch-EPMP.md` and `UserStories-EPMP.md`. Feature IDs F0–F18 are carried through unchanged.*
## F0: Web & Mobile Application Shell (EPMP Design System UI)

**Description:** The single required UI surface for the entire platform — the app shell, navigation, page-pattern library, and theming system that every persona uses to operate EPMP. Built exclusively from the EPMP Design System's 40 `window.EPMP` components and design tokens across light, dark, and contrast themes. This feature is the thing a human actually sees and operates; no other feature (F1–F18) is usable without it, and no other feature may introduce a screen, component, or visual treatment that bypasses this shell.

**Terminology:**
- **App shell:** The persistent chrome (SideNav, header strip, content area) that wraps every page.
- **Page pattern:** A named, reusable page layout (dashboard, incident workspace, list/table, form, field-mobile, operating-picture, analytics/reporting, notifications/alerts, interoperability/integration-health) defined in the design system and reused by feature-specific screens.
- **Theme:** One of `light` (default), `dark` (operations-center low-light), or `contrast` (Section 508 high-contrast, 7:1 text). Set via `data-theme` on the app root.
- **Breakpoint:** `bp-sm` 640px, `bp-md` 768px, `bp-lg` 1024px, `bp-xl` 1280px.

### Sub-features
- App shell: `SideNav` + header strip + content area, responsive collapse to bottom bar under `bp-md`.
- Page-pattern library: dashboard, incident workspace, lists/tables, forms, field-mobile, operating-picture, analytics/reporting, notifications/alerts, interoperability/integration-health.
- Global states: loading (`Skeleton`), empty (`EmptyState`), error (`Alert` + retry) on every list/table/panel across the platform.
- Three-theme support with full functional/visual parity including maps and charts.
- Installable, mobile-first web application (field use; see F6) — no native app store build in this MVP.
- Global header utilities: global search, `SyncStatus`, alerts `IconButton`, user `Avatar`.
- Admin console shell (detailed screens owned by F8, but the console itself is built from this shell).

### Screens

**S0.1 — App Shell (persistent chrome, all pages)**
- `SideNav` (240px, 64px collapsed under `bp-md`): grouped items following lifecycle order Prepare → Monitor → Activate → Coordinate → Recover → Improve; 6–9 top-level items; current page highlighted `brand-subtle`; brand mark (gold square + "EPMP" in `h4`) at top.
- Header strip (56px, `bg`, bottom `border`): left — `Breadcrumbs`; center — global search `Combobox`; right — `SyncStatus`, alerts `IconButton`, user `Avatar` (opens profile/logout menu).
- Under `bp-md`: `SideNav` collapses to a bottom bar of exactly 4 destinations (role-dependent — see F18); header keeps `SyncStatus` and incident name only.
- Skip-to-content link is the first focusable element on every page.

**S0.2 — Theme Switcher (in user/profile menu, reachable from every page)**
- `Select` or `Switch` group offering `light` / `dark` / `contrast`; persists per-user; applies instantly via `data-theme` without reload.

**S0.3 — Global Empty/Error/Loading Reference States**
- Not a standalone screen but a mandatory pattern instance validated on every list, table, and panel platform-wide: `Skeleton` sized to final layout (loads >300ms), `EmptyState` (title + 1 sentence + ≤1 action, differentiated for first-use vs. filtered-out vs. error), `Alert` (danger, with Retry, keeps last-known data visible labeled with its age).

**S0.4 — Component Gap Escalation (internal/admin-facing)**
- When a screen needs a treatment the 40-component set does not support, the gap is logged (not improvised) via an internal "Design system gap" flag visible to F8 admins, with the proposed addition described. No ad hoc component or raw style may ship.

### Process
1. On load, the shell resolves the user's session (F8/F16 SSO), determines role (F8 RBAC), and renders the role-scoped `SideNav` groups and bottom-bar destinations (F18).
2. The shell applies the user's persisted theme preference (default `light`) via `data-theme` before first paint to avoid flash of incorrect theme.
3. Every route renders inside the shell's content area using exactly one of the nine page patterns; the page pattern used is declared in the page's implementation metadata for design-system conformance checking.
4. Every list/table/panel component mounts in a `loading` state first, replaces all `Skeleton` blocks atomically on data arrival (no partial replace, to avoid layout shift), and falls back to `EmptyState` or `Alert` per the data/error outcome.
5. `SyncStatus` in the header polls/subscribes to connectivity and sync-queue state (shared with F6, F10) and updates in real time; state changes never require a page reload.
6. Responsive behavior: below `bp-md`, the shell swaps `SideNav` for a bottom bar; below `bp-sm`, `Table` instances convert to card/label-value layouts (feature-specific tables defined in F1–F18 inherit this automatically).

### Inputs
- `theme_preference` (enum: `light`|`dark`|`contrast`, optional, default `light`): persisted per user.
- `session_token` (JWT, required): resolved by F8; determines role-scoped nav.
- `global_search_query` (string, optional): free text searched across incidents, plans, tasks, resources per the user's RBAC scope.
- `viewport_width` (px, runtime): determines breakpoint-driven layout.

### Outputs
- Rendered shell with role-scoped `SideNav`/bottom bar, applied theme, and the invoked page pattern.
- Global search results list (grouped by record type) with loading/empty/error states.
- Theme persisted to user preference store (F8 `users` table).

### Validation
- Every page must have exactly one `h1` (enforced via the `PageHeader` component contract) and ordered headings beneath it (no skipped levels).
- Every interactive element must have a visible 2px `focus-ring` on focus; no element may suppress focus styling.
- No raw hex colors, arbitrary pixel values, or custom components may ship; any screen failing this check is non-conformant and blocked pre-merge.
- Status must render as icon + word + color on every instance (`Badge`, `Alert`, `SyncStatus`); color-alone status indicators fail validation.
- Touch targets must be ≥44px (`size="lg"`) on any field-mobile breakpoint (<`bp-md` when `SyncStatus` indicates field-mobile context, or when F6 routes are active).
- Theme switch must produce no loss of contrast compliance (4.5:1 body text / 7:1 in `contrast`) across any screen.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Session expired on shell load | 401 | SESSION_EXPIRED | "Your session has ended. Sign in again to continue." |
| Global search backend unavailable | 503 | SEARCH_UNAVAILABLE | "Search is temporarily unavailable. Retry." |
| Theme preference save failed | 500 | THEME_SAVE_FAILED | "Couldn't save your theme preference. It will reset next time you sign in. Retry." |
| Role resolution failed (no role mapped) | 403 | ROLE_UNRESOLVED | "Your account isn't assigned a role yet. Contact your administrator." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Session/Theme for `GET /api/v1/me`, `PATCH /api/v1/me/preferences`. Global search: see `Y1b-api-incident-ops.md` §Search for `GET /api/v1/search`.

### Schema Surface (this feature)
Uses `users.theme_preference`, `users.role_id` — see `Y0a-schema-auth-org.md` §Users. No feature-specific tables; the shell is presentation-layer only and reads reference data owned by F8/F18.
## F1: Incident / ICS

**Description:** Incident intake, classification, command-role assignment, activity timeline, checklists, and ICS forms — the core activation and command workflow of the platform. This is the feature the MVP demonstration scenario starts from: a user creates an incident, activates an EOC, assigns roles, and begins coordinating.

**Terminology:**
- **Incident:** A tracked emergency event with a type, severity, jurisdiction, activation level, and command structure.
- **Severity:** One of `Critical` / `Elevated` / `Watch` / `Normal`, rendered via `Badge` (Critical = `danger solid`, Elevated = `warning`, Watch = `info`, Normal = `success`).
- **Activation level:** One of `Monitoring` / `Partial` / `Full`. Changing this requires a `Modal` confirmation stating the operational consequence.
- **Command role:** A named ICS position (Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information) assigned to a named person for a given incident.
- **ICS form:** A structured document (e.g., ICS-201, ICS-202) generated from incident data, optionally AI-drafted (see F9), always human-approved before becoming official.
- **Timeline:** The append-only chronological activity log for an incident (see Timeline component).

### Sub-features
- Incident intake and classification (type, severity, jurisdiction).
- Command role assignment with named-person accountability.
- Append-only activity `Timeline`.
- ICS checklists and structured ICS forms, including `[AIDraft]`-assisted drafting from reviewed notes.
- Activation-level change with `Modal` confirmation.
- Incident workspace page pattern.

### Screens

**S1.1 — Incident List**
- Page pattern: Lists/tables. `PageHeader` (title "Incidents", primary action "Create incident"). `Table` inside `Card padded={false}`: columns Name (linked), Type, Severity (`Badge`), Jurisdiction, Activation, Opened, Commander (`Avatar` + name). Toolbar: search `TextField`, filter `Select`s (severity, activation, jurisdiction), count caption ("1 to 25 of 140"). Bulk actions replace toolbar on row selection. Loading: 6 `Skeleton` rows. Empty (first-use): "No incidents yet" + "Create incident" action. Empty (filtered): "No incidents match" + "Clear filters". Error: `Alert` danger + Retry, last-known data visible.

**S1.2 — Create Incident (form)**
- Page pattern: Forms, single column, max 560px. Fields: Name (`TextField`, required), Type (`Select`), Severity (`Select`: Critical/Elevated/Watch/Normal), Jurisdiction (`Combobox`, searchable), Description (`TextField multiline`), Opened at (`DatePicker withTime zone`). Footer: Cancel (`ghost`) left of primary; "Create incident" (`primary`) right. Validates on blur/submit; on submit error, focus moves to first error field and a summary `Alert` appears above the form.

**S1.3 — Incident Workspace**
- Page pattern: Incident workspace. `PageHeader`: incident name, severity `Badge`, subtitle (jurisdiction + opened date), actions: "Generate SITREP" (`secondary`), "New task" (`primary`). Below: `Tabs` — Timeline, Tasks, Resources, Reports (2–6 tabs, same order every incident). Left two-thirds: active tab content. Right third: pinned `Card` with command-role list (`Avatar` + role + name, "Reassign" action per row) and a map-thumbnail panel (links to F2 operating picture scoped to this incident).
  - **Timeline tab:** `Timeline` component, newest-first, each entry: time (incident zone, 24-hour, monospace), status dot tone, title, meta (actor + source), optional expandable `children`. AI-sourced entries say so in `meta`.
  - **Tasks tab:** embedded `Table` of tasks scoped to this incident (see F4 S4.x for full task screens); "New task" primary action.
  - **Resources tab:** embedded `Table` of resource requests scoped to this incident (see F4).
  - **Reports tab:** list of generated ICS forms/SITREPs with status (`Draft`/`Approved`) and "Generate" action (see F7, F9).

**S1.4 — Command Role Assignment (Modal)**
- `Modal` (480px): title "Assign [role name]", body: `Combobox` to search personnel (sourced from F16 roster where synced, else manual entry), current assignee shown if reassigning. Footer: "Cancel" / "Assign role" (primary, rightmost). Assignment writes to Timeline with actor and timestamp.

**S1.5 — Activation Level Change (Modal, danger-tier when escalating)**
- `Modal danger` when escalating (e.g., Monitoring → Full): title states the decision ("Escalate Riverbend Flood to Full activation?"), body states the operational consequence (e.g., "This notifies all assigned command roles and opens full resource-request approval workflows."), footer buttons name outcomes ("Escalate to Full" / "Keep at Partial") — never "Yes/No". De-escalation uses a standard (non-danger) `Modal`.

**S1.6 — ICS Form / Checklist Editor**
- Page pattern: Forms, split into steps of 5–8 fields with `Progress` for long ICS forms (e.g., ICS-201). Autosave with "Saved HH:MM" indicator. "Draft with AI" secondary button available on narrative fields — inserts `[AIDraft]` panel with `Provenance` sources below the field; Approve inserts text and logs reviewer+time to Timeline; Discard removes it (see F9).

### Process
1. User (typically PER-01 or PER-02) creates an incident via S1.2: enters name, type, severity, jurisdiction, description, opened timestamp.
2. System creates the incident record (status = `Open`, activation = `Monitoring` by default), writes the first Timeline entry ("Incident created"), and routes the user to the Incident Workspace (S1.3).
3. User assigns the Incident Commander and other command roles via S1.4; each assignment writes a Timeline entry with actor and timestamp.
4. User (now typically PER-02) changes activation level as conditions warrant via S1.5; the Modal confirmation must be accepted before the change takes effect; the change writes a Timeline entry and triggers any configured notification (F5) to assigned roles.
5. Throughout the incident, command staff create tasks (F4) and resource requests (F4) from the workspace's Tasks/Resources tabs; every status change by any feature touching this incident appends to the shared Timeline.
6. Planning staff (PER-03) complete ICS forms and checklists (S1.6), optionally using `[AIDraft]` assistance (F9) for narrative sections; forms remain in `Draft` status until a named person approves them, at which point they become part of the official record (F7).
7. Incident closure: a user with appropriate role sets status to `Closed` via a Modal confirmation stating the consequence (e.g., "closes all open tasks to Overdue unless completed"); this triggers AAR generation eligibility (F7).

### Inputs
- `name` (string, required, 3–200 chars): incident name.
- `type` (enum, required): incident type (e.g., Flood, Wildfire, Severe Weather, HazMat, Public Health, Other).
- `severity` (enum, required): `Critical`|`Elevated`|`Watch`|`Normal`.
- `jurisdiction_id` (UUID, required): FK to jurisdiction reference data.
- `description` (string, optional, ≤2000 chars).
- `opened_at` (ISO 8601 datetime with zone, required).
- `activation_level` (enum, required on change): `Monitoring`|`Partial`|`Full`.
- `command_role_assignments` ([{role, person_id}], required at least Incident Commander before activation above `Monitoring`).

### Outputs
- Incident record with current status, severity, activation level, and command-role roster.
- Append-only Timeline feed consumable by F2 (map thumbnail), F7 (reporting), and F10 (event bus publication).
- Generated ICS forms/checklists in `Draft` or `Approved` state.

### Validation
- `name` must be unique within an active jurisdiction at a given time (warn, not block, if a similar name exists within 24 hours — possible duplicate).
- `severity` and `activation_level` must be one of the fixed enum values; no free text.
- Activation level cannot jump directly from `Monitoring` to `Full` without the Modal confirmation explicitly naming the intermediate consequence skipped (UI must still require explicit confirmation of the actual target level, not assume `Partial` first).
- At least one Incident Commander must be assigned before activation level can move above `Monitoring`.
- Every state-changing action (create, reassign, activation change, closure) must write exactly one Timeline entry with a non-null actor and source.
- ICS forms cannot transition to `Approved` without a recorded named-person reviewer and timestamp.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Duplicate incident name within 24h, same jurisdiction | 409 | INCIDENT_POSSIBLE_DUPLICATE | "An incident named '[name]' was opened in the last 24 hours. Confirm this is a new incident." |
| Activation change attempted with no Incident Commander assigned | 422 | NO_COMMANDER_ASSIGNED | "Assign an Incident Commander before activating above Monitoring." |
| Timeline write failed | 500 | TIMELINE_WRITE_FAILED | "This action didn't record to the incident timeline. Retry before continuing." |
| ICS form approval attempted without reviewer context | 403 | APPROVAL_REQUIRES_NAMED_USER | "Approval must be made by a signed-in person, not an automated process." |
| Incident not found | 404 | INCIDENT_NOT_FOUND | "This incident no longer exists or you don't have access." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Incidents for `GET/POST /api/v1/incidents`, `GET/PATCH /api/v1/incidents/{id}`, `POST /api/v1/incidents/{id}/activation`, `POST /api/v1/incidents/{id}/command-roles`, `GET/POST /api/v1/incidents/{id}/timeline`, `GET/POST /api/v1/incidents/{id}/ics-forms`.

### Schema Surface (this feature)
Owns tables `incidents`, `incident_command_roles`, `incident_timeline`, `ics_forms` — see `Y0b-schema-incident-ops.md` §Incident/ICS. Reads `jurisdictions`, `users` (F8), `personnel_roster` (F16, where synced).
## F2: Common Operating Picture

**Description:** Live incident dashboards, maps, weather/hazard layers, and facility/resource positions, giving every role a shared, time-stamped view of the current situation. This is the feature that makes "shared situational awareness" real rather than aspirational — every layer on the map declares its source and age, and degraded/offline conditions are a first-class, visibly labeled state rather than a failure.

**Terminology:**
- **Operating picture:** The map-centric shared view of current incidents, facilities, resources, and hazard overlays. Preferred UI term over "COP."
- **Layer:** A toggleable data overlay on the map (incidents, facilities, resources, weather/hazard feeds), each carrying a source and data-age label.
- **Schematic base map:** The offline/degraded fallback base map shown when real GIS tiles are unavailable, always labeled "Schematic base map, offline."
- **Marker:** A map symbol distinguished by shape (incident = diamond, facility = square, resource = triangle, shelter = circle) and tone (status color), outlined in `ink` for 3:1 contrast on any base.

### Sub-features
- Operating-picture map view (`MapCanvas` + `MapControls`, `LayerPanel`, `MapLegend`, `MapPopup`).
- Live EOC and executive dashboards (`Stat` tiles + `Card`-based layout).
- Weather/hazard overlay layers from approved external feeds (F12), off by default when unverified.
- Status bar showing data age and base-layer source on every map/dashboard view.
- Degraded/offline mode with schematic base map.

### Screens

**S2.1 — Operating Picture (Map)**
- Page pattern: Operating picture (map). `MapCanvas` at 8 of 12 columns at `bp-lg`+, `MapControls` top-right (zoom always shown; locate/layers/fullscreen as supported), `LayerPanel` opened from controls (4–8 layers; incidents first, reference layers last; unverified feeds off by default and labeled "Unverified"), `MapLegend` bottom-left (exactly the glyphs currently drawn), `MapPopup` for selected feature (title, status `Badge`, 2–3 facts, `Provenance`, 1–2 actions). Status bar: "As of HH:MM ET · Base layer: agency GIS" (or "Schematic base map, offline" when degraded). Right column (4 of 12 at `bp-lg`+): incident `Timeline` and task list for the currently selected/pinned incident. Below `bp-md`: map full width, list becomes a bottom sheet.
- Every marker is keyboard-focusable (Tab, Enter) and duplicated in a hidden text list for screen readers; closing a popup returns focus to its marker.

**S2.2 — EOC / Executive Dashboard**
- Page pattern: Dashboard. `PageHeader`, then a row of up to 4 `Stat` tiles (e.g., Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment), then a 12-column grid of `Card`s (8/4 or 6/6 split). Widest card: operating-picture map thumbnail/mini-view linking to S2.1. Side `Card`: recent `Timeline` entries across all incidents in scope, plus a task-status summary. Executive-briefing variant (PER-05 executive facet, see F18): `display`-scale numbers for 1–3 headline KPIs only, no other decoration; each number shows definition/period/source on hover or in `caption`.

**S2.3 — Layer Panel (opened from MapControls)**
- `LayerPanel`: checklist of layers, each row showing label, source, "As of HH:MM" age, verified/unverified flag, optional count. Toggling a layer is immediate (no save step). Unverified weather/hazard layers (from F12) are visually dashed-outlined per `Provenance` conventions and off by default.

### Process
1. On load, the operating picture queries the current incident/facility/resource positions (F1, F4, F17) and renders them as markers on the base map obtained from F11's GIS read integration.
2. If the GIS base-layer feed is unavailable or times out, `MapCanvas` falls back to the schematic offline base map, labels it "Schematic base map, offline," and continues rendering EPMP markers on top — the page never fails to render.
3. The status bar computes and displays data age as the max staleness across currently visible layers and the base-layer source name.
4. User opens `LayerPanel` to toggle weather/hazard overlay layers (F12); unverified layers remain off until explicitly enabled, and stay visually flagged "Unverified" even when on, until a person validates the underlying feed.
5. Selecting a marker opens `MapPopup` with the record's key facts and `Provenance`; actions in the popup deep-link to the full record (incident workspace F1, resource detail F4, facility detail F17).
6. Dashboard `Stat` tiles and summary cards poll/subscribe to the same underlying incident/task/resource aggregates and update independent of the map view.
7. Resource-request status changes (F4) and notification delivery status (F5) surface on the operating picture and dashboard without requiring a page reload (event-bus-driven updates via F10).

### Inputs
- `jurisdiction_scope` (UUID[] or "all", from RBAC/F8): determines which incidents/facilities/resources are visible.
- `layer_toggles` ([{layer_id, enabled}], user session state): which overlay layers are currently on.
- `selected_marker_id` (UUID, optional): currently selected map feature.
- `map_viewport` (bounds, runtime): current pan/zoom state, not persisted server-side.

### Outputs
- Rendered map with incident/facility/resource/hazard markers, legend, and status bar (data age + base-layer source).
- Dashboard `Stat` tiles and summary cards reflecting current counts and statuses.
- Hidden text-list equivalent of all visible map markers for screen-reader access.

### Validation
- Every layer in `LayerPanel` must show a non-null `source` and `asOf` timestamp; a layer missing either is rejected at ingestion (F12/F11), not displayed silently without provenance.
- Unverified feeds must default to `checked: false` and must render the dashed "Unverified" treatment whenever toggled on.
- No more than 6 layers may be visible simultaneously without consolidation into `LayerPanel` groups.
- Status bar data-age calculation must reflect the stalest currently-visible layer, not an average.
- Markers must be distinguishable by shape and tone, never tone alone; selected markers must show a `focus-ring` halo.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| GIS base-layer feed unavailable | 200 (degraded) | GIS_FEED_UNAVAILABLE | "Schematic base map, offline. Live map layers will return when the GIS feed reconnects." |
| Hazard feed stale beyond threshold | 200 (flagged) | HAZARD_FEED_STALE | "[Layer name] data is more than [N] hours old. Verify before relying on it." |
| Marker data fetch failed | 500 | MARKER_FETCH_FAILED | "Couldn't load current positions. Retry." |
| Dashboard aggregate query timeout | 504 | DASHBOARD_TIMEOUT | "Dashboard is taking longer than expected to load. Retry." |
| Unauthorized jurisdiction scope requested | 403 | JURISDICTION_SCOPE_DENIED | "You don't have access to data for this jurisdiction." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Operating Picture for `GET /api/v1/operating-picture/markers`, `GET /api/v1/operating-picture/layers`, `GET /api/v1/dashboard/summary`.

### Schema Surface (this feature)
Reads `incidents`, `facilities` (F17), `resource_requests` (F4), `hazard_layers` (F12), `gis_feed_status` (F11) — no feature-owned tables; this is a read/aggregation and rendering layer. See `Y0d-schema-integration-geo.md` §Operating Picture Views.
## F3: Plans & Playbooks

**Description:** A plan repository with SOPs, versioning, and approvals, with the ability to link response tasks directly to the plans that call for them — closing the gap between written readiness and executed response. This is how an agency substantiates its own preparedness on demand.

**Terminology:**
- **Plan:** A top-level readiness document (EOP, SOP, annex) with version history and an approval workflow.
- **Plan section:** A subdivision of a plan that can be linked to one or more operational tasks.
- **Approval workflow:** Draft → Review → Approved. A plan version cannot be the "current" version for operational use until Approved.
- **Linked task:** A task template or task-generation rule attached to a plan section, materialized into an actual task (F4) when an incident activates.

### Sub-features
- Plan/SOP repository with version history and approval workflow (draft → review → approved).
- Linkage from a plan/SOP section to the operational tasks it generates during an incident.
- Document import/sync from existing SharePoint/document systems (F17).
- Reading view respecting `reading-max` (720px) line length.

### Screens

**S3.1 — Plan Repository (List)**
- Page pattern: Lists/tables. `PageHeader` (title "Plans & playbooks", primary action "Create plan"). `Table`: columns Name (linked), Type (EOP/SOP/Annex), Status (`Badge`: Draft/Review/Approved), Version, Jurisdiction, Last updated, Owner (`Avatar`). Toolbar with search, filters (type, status, jurisdiction). Loading/empty/error states per platform standard (S0.3).

**S3.2 — Plan Detail / Reading View**
- `PageHeader`: plan name, status `Badge`, version number, actions "Edit" (if permitted), "Import new version" (secondary). Content area constrained to `reading-max` (720px) for the plan text itself; sidebar lists plan sections (jump links) and linked tasks per section. Version history shown as a collapsible list with "View this version" per entry (read-only, non-destructive).

**S3.3 — Plan Editor**
- Page pattern: Forms (long-form). Section-based editor: each section has a heading (`h4`), rich/structured text area (`TextField multiline`), and a "Link tasks" action opening S3.5. Footer: "Save as draft" (secondary), "Submit for review" (primary). Autosave indicator "Saved HH:MM".

**S3.4 — Approval Workflow (Modal / inline)**
- Reviewer sees a "Review plan" action on plans in `Review` status; opens a side-by-side or stacked view of changes since the last Approved version, with "Approve" (primary) / "Request changes" (secondary) actions. Approving transitions status to `Approved`, increments version, and writes an audit-log entry (F8) with reviewer and timestamp.

**S3.5 — Link Tasks to Plan Section (Modal)**
- `Modal`: lists existing task templates or allows defining a new one (name, default owner role, default due offset from activation). Multi-select association to the current plan section. Footer: "Cancel" / "Link tasks" (primary).

**S3.6 — Import from Document System (F17 integration)**
- `Modal` or dedicated form: `Combobox` to browse/search the connected SharePoint (or equivalent) library scoped to the user's existing document permissions, select document(s) to import/link, choose "Import copy" vs. "Link live" sync mode. Preserves the source system's access permissions — a user who couldn't see the document in SharePoint cannot see it imported into EPMP either.

### Process
1. A planning user (PER-03) creates a new plan or imports one from a connected document system (F17) via S3.6, landing it in `Draft` status, version 1.
2. The author edits plan content and section structure via S3.3, optionally linking sections to task templates via S3.5.
3. The author submits the plan for review; status moves to `Review`; a notification (F5) may alert designated reviewers.
4. A reviewer (typically PER-01 or PER-03 with review permission) opens S3.4, compares against the last Approved version, and either Approves (status → `Approved`, version increments, becomes the current operational version) or Requests changes (status reverts to `Draft` with reviewer comments attached).
5. When an incident activates and references a plan (F1), any task templates linked to that plan's sections are offered to the incident commander/planning staff as one-click task creation (F4) rather than requiring tasks to be written from scratch.
6. Previous Approved versions remain accessible read-only in S3.2's version history; the system never deletes a prior version.
7. Document import/sync (S3.6) runs as a background job (F10) for "Link live" mode, periodically checking the source system for updates and flagging (not auto-applying) changes to a named person for review.

### Inputs
- `name` (string, required, 3–200 chars).
- `type` (enum, required): `EOP`|`SOP`|`Annex`.
- `jurisdiction_id` (UUID, required).
- `content_sections` ([{heading, body}], required, at least 1 section).
- `linked_tasks` ([{section_id, task_template_id}], optional).
- `source_document_ref` (string, optional): reference to the external SharePoint/document-system item when imported.
- `review_action` (enum: `approve`|`request_changes`, required at review step).

### Outputs
- Plan record with current status, version number, and full version history.
- Task templates available for one-click materialization into actual tasks when an incident references the plan.
- Audit-log entries (F8) for every submit/approve/request-changes transition.

### Validation
- A plan cannot move to `Approved` without passing through `Review` first — no direct `Draft` → `Approved` transition.
- The reviewer approving a plan must be a different named person than the most recent editor who submitted it for review (no self-approval), unless the agency's role config explicitly permits it (flagged exception, logged).
- At least one section must exist before a plan can be submitted for review.
- Imported documents in "Link live" mode must preserve and re-check source-system permissions on every sync; a permission downgrade at the source must immediately restrict EPMP-side visibility.
- Version history entries are immutable once created; corrections require a new version, never an edit to a past version.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Self-approval attempted without exception flag | 403 | SELF_APPROVAL_BLOCKED | "You submitted this plan for review. Ask another reviewer to approve it." |
| Submit for review with zero sections | 422 | PLAN_EMPTY | "Add at least one section before submitting this plan for review." |
| Document import permission check failed | 403 | IMPORT_PERMISSION_DENIED | "You don't have access to this document in the source system." |
| Live-link sync detected a source change | 200 (flagged) | PLAN_SOURCE_CHANGED | "The linked document changed in [source system]. Review before updating the EPMP copy." |
| Plan not found | 404 | PLAN_NOT_FOUND | "This plan no longer exists or you don't have access." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §Plans for `GET/POST /api/v1/plans`, `GET/PATCH /api/v1/plans/{id}`, `POST /api/v1/plans/{id}/submit-review`, `POST /api/v1/plans/{id}/review`, `POST /api/v1/plans/{id}/sections/{sectionId}/link-tasks`, `POST /api/v1/plans/import`.

### Schema Surface (this feature)
Owns tables `plans`, `plan_versions`, `plan_sections`, `plan_task_templates` — see `Y0c-schema-comms-reporting.md` §Plans & Playbooks. Reads `jurisdictions`, `users` (F8), `document_links` (F17).
## F4: Tasks & Resource Requests

**Description:** Create, assign, approve, track, and close operational tasks and initial resource requests — the MVP's manual-coordination replacement. Advanced logistics (inventory, workforce scheduling, mutual aid, fulfillment tracing) is explicitly deferred.

**Terminology:**
- **Task:** A tracked unit of work with an owner and due time. Statuses: `Open`, `In progress`, `Awaiting approval`, `Done`, `Overdue`.
- **Resource request:** A request for people, equipment, or supplies. Statuses: `Draft`, `Awaiting approval`, `Approved`, `Fulfilled`, `Declined`.
- **Owner:** The person or role a task/request is assigned to; always a named accountability point, never "unassigned" once in `Open` status.

### Sub-features
- Task lifecycle: create, assign (person or role), approve, track status, close.
- Basic resource-request lifecycle: create, approve, assign, track, close; linked to originating incident or task.
- List/table views with search, filter, bulk actions.
- Resource-request status visible on operating picture (F2) and reporting (F7).

### Screens

**S4.1 — Task List (standalone and embedded in Incident Workspace Tasks tab)**
- `Table` inside `Card padded={false}`: columns Task (linked), Status (`Badge`), Owner (`Avatar` + name), Due, Incident (when standalone view spans incidents), Linked plan section (if any). Toolbar: search, filter by status/owner/due-window, "New task" primary action. Bulk actions (e.g., "Mark done", "Reassign") replace toolbar on selection.

**S4.2 — Create/Edit Task (form)**
- Single column, max 560px. Fields: Title (`TextField`, required), Description (`TextField multiline`, optional), Owner (`Combobox` — person or role), Due (`DatePicker withTime zone`), Incident (`Combobox`, pre-filled when created from an incident workspace), Linked plan section (`Combobox`, optional, pre-filled when materialized from F3 template). Footer: Cancel / "Create task" or "Save changes" (primary).

**S4.3 — Task Detail**
- `PageHeader`: task title, status `Badge`, actions "Mark in progress" / "Submit for approval" / "Reopen" depending on current state. Body: description, owner, due, linked incident/plan section, and a small `Timeline` of status changes specific to this task.

**S4.4 — Resource Request List (standalone and embedded in Incident Workspace Resources tab)**
- `Table` inside `Card padded={false}`: columns Request (linked), Type (Personnel/Equipment/Supplies), Status (`Badge`), Quantity, Requested by (`Avatar`), Incident, Requested at. Toolbar: search, filter by status/type. "New resource request" primary action.

**S4.5 — Create/Edit Resource Request (form)**
- Fields: Resource type (`Select`: Personnel/Equipment/Supplies), Description (`TextField multiline`, required — what specifically is needed), Quantity (`TextField` numeric, required), Incident (`Combobox`, pre-filled from context), Needed by (`DatePicker withTime zone`), Requesting role (`Select`). Footer: Cancel / "Submit request" (primary) — submitting moves status from `Draft` to `Awaiting approval`.

**S4.6 — Resource Request Approval (inline action / Modal for decline)**
- On the request detail or list row: "Approve" (primary) / "Decline" (secondary, opens `Modal` requiring a reason `TextField`) for users with approval permission. Approving moves status to `Approved` and prompts an optional "Assign" step (who/what is fulfilling it). "Mark fulfilled" action available once assigned, moving status to `Fulfilled`.

**S4.7 — Resource Request Detail**
- `PageHeader`: request summary, status `Badge`. Body: full request details, approval history (`Timeline`-style entries: submitted → approved/declined → assigned → fulfilled), linked incident and task (if any).

### Process
1. A user (typically PER-02 or PER-03) creates a task via S4.2, either standalone or from within an Incident Workspace (F1) Tasks tab, or materialized from a plan's linked task template (F3) when an incident activates.
2. Task status starts at `Open`; the owner updates it to `In progress`, then either `Done` directly (if no approval required) or `Awaiting approval` (if the task type requires sign-off), at which point an approver moves it to `Done`.
3. Tasks past their due time without reaching `Done` automatically flip to `Overdue` (system-driven status, visible via `Badge`, triggers no auto-notification beyond what F5 rules define for overdue tasks).
4. A user creates a resource request via S4.5, linked to an incident and optionally a task; it starts in `Draft` and moves to `Awaiting approval` on submit.
5. An approver (typically PER-03, logistics function) reviews and Approves or Declines (S4.6); Approved requests can be assigned to a specific resource/person, then marked `Fulfilled` once delivered.
6. Every status transition on a task or resource request writes an entry to the owning incident's Timeline (F1) with actor, timestamp, and the before/after status.
7. Resource-request status changes publish to the event bus (F10) so the operating picture (F2) and reporting (F7) reflect current state without manual refresh.

### Inputs
- Task: `title` (string, required, 3–200 chars), `owner_id` (UUID, required — person or role), `due_at` (ISO datetime+zone, required), `incident_id` (UUID, optional), `plan_section_id` (UUID, optional).
- Resource request: `resource_type` (enum, required): `Personnel`|`Equipment`|`Supplies`; `description` (string, required, ≤1000 chars); `quantity` (integer, required, ≥1); `incident_id` (UUID, required); `needed_by` (ISO datetime+zone, required); `requesting_role` (enum, required).
- Status transitions: `new_status` (enum per type, required), `reason` (string, required only for `Declined`).

### Outputs
- Task/resource-request records with current status, owner/approver history, and linkage to incident/plan.
- Status-change events published to F10 event bus for F2/F7 consumption.
- Timeline entries on the owning incident (F1).

### Validation
- A task cannot be created without an owner — "unassigned" is not a valid starting state once beyond `Draft`-equivalent (tasks have no draft state; they start `Open`).
- `due_at` must be in the future relative to `created_at` at creation time (warn if in the past, allow override with explicit confirmation for backfilled/retroactive entries).
- Resource request `quantity` must be a positive integer; `needed_by` must be present.
- A `Declined` resource request requires a non-empty `reason`.
- Status transitions must follow the fixed state machine per type (e.g., a task cannot go from `Open` directly to `Done` if the task type is flagged as requiring approval — must pass through `Awaiting approval`).
- Overdue transition is system-computed, never user-settable directly.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Task created without owner | 422 | TASK_OWNER_REQUIRED | "Assign an owner before creating this task." |
| Resource request declined without reason | 422 | DECLINE_REASON_REQUIRED | "State why this request is declined." |
| Invalid status transition attempted | 409 | INVALID_STATUS_TRANSITION | "This task can't move to [status] from its current state." |
| Due date in the past without override | 422 | DUE_DATE_PAST | "This due time has already passed. Confirm this is a retroactive entry." |
| Task/request not found | 404 | RECORD_NOT_FOUND | "This item no longer exists or you don't have access." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Tasks and §Resource Requests for `GET/POST /api/v1/tasks`, `PATCH /api/v1/tasks/{id}/status`, `GET/POST /api/v1/resource-requests`, `POST /api/v1/resource-requests/{id}/approve`, `POST /api/v1/resource-requests/{id}/decline`, `POST /api/v1/resource-requests/{id}/fulfill`.

### Schema Surface (this feature)
Owns tables `tasks`, `task_status_history`, `resource_requests`, `resource_request_status_history` — see `Y0b-schema-incident-ops.md` §Tasks & Resources. Reads `incidents` (F1), `plan_task_templates` (F3), `users` (F8).
## F5: Notifications Integration

**Description:** Recipient groups, message templates, geotargeting, provider integration, and delivery/acknowledgment tracking — making communications accountable rather than best-effort. This feature owns the internal notification domain model and UI; outbound delivery through external providers and public-alerting standards is delivered by F14.

**Terminology:**
- **Recipient group:** A reusable collection of recipients defined by role, jurisdiction, or geography.
- **Message template:** A reusable message body with placeholders, reducing drafting time for recurring notification types.
- **Geotargeting:** Selecting an audience by drawing or selecting an area on the operating-picture map rather than by named group.
- **Delivery status:** Per-recipient tracked state of whether a message was sent, delivered, and acknowledged.

### Sub-features
- Recipient-group management (role, jurisdiction, geography) and reusable message templates.
- Geotargeted audience selection using operating-picture map components.
- Compose flow: audience → message (`[AIDraft]`-assisted, never auto-sent) → review → approve and send.
- Delivery and acknowledgment tracking view.
- Named-person approval required before any external send.

### Screens

**S5.1 — Recipient Groups (List + Editor)**
- `Table`: Group name (linked), Type (Role/Jurisdiction/Geography), Member count, Last used. "New group" primary action. Editor form: name, type `Select`, and type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn/selected on a `MapCanvas` instance).

**S5.2 — Message Templates (List + Editor)**
- `Table`: Template name (linked), Category, Last updated. Editor: name, category `Select`, body `TextField multiline` with placeholder tokens (e.g., `{{incident_name}}`, `{{jurisdiction}}`) and a character count.

**S5.3 — Compose Notification (4-step flow, required order)**
- Step 1 — **Audience:** Select recipient group(s) (`Combobox` multi) and/or geotarget via embedded `MapCanvas`/`LayerPanel` drawing an area; live recipient-count estimate shown.
- Step 2 — **Message:** Select template or write freeform (`TextField multiline`, character count); "Draft with AI" secondary button available, inserting `[AIDraft]` panel with `Provenance` sources — Approve inserts into the field and logs reviewer+time, Discard removes it. AI never auto-populates the field without explicit Approve.
- Step 3 — **Review:** Read-only preview of the final message, selected delivery channels (from F14's configured providers), and the named approver who must sign off.
- Step 4 — **Approve and send:** "Approve and send" (primary, `danger`-styled `Modal` confirmation for public/external-reach messages) — requires the signed-in named person to be the approver of record; send action is always deliberate, never automatic or AI-triggered.

**S5.4 — Delivery & Acknowledgment Tracking**
- `Table` of recipients: Name/Group, Channel, Status `Badge` (Queued/Sent/Delivered/Failed), Acknowledgment `Progress` bar (e.g., "68% acknowledged, 412 of 606"). Filter by status. Auto-refreshes as delivery callbacks arrive (F14).

### Process
1. A user (typically PER-02 in the PIO capacity) selects or creates recipient groups and/or draws a geotargeted area (S5.1, Step 1 of S5.3).
2. The user drafts a message, optionally using a template or `[AIDraft]` assistance from reviewed incident notes (Step 2); AI drafts remain inert text in the panel until a named person clicks Approve, which copies the text into the message field and logs the approval.
3. The user reviews the final composed message, audience, and channels (Step 3) — nothing is editable at this step without returning to a prior step.
4. The named approver (who may be the same user if they hold approval permission, or a different designated approver per agency policy) clicks "Approve and send"; for any message routed to public/external channels (F14), a `Modal danger` confirmation restates the audience size and channels before the send is dispatched.
5. The system dispatches the message through configured internal channels and via F14's provider adapter(s) for external channels; each recipient/channel combination gets a tracked delivery record.
6. Delivery and acknowledgment callbacks (from F14) update S5.4 in near-real-time; failures surface as `Failed` status with a visible reason, never a silent drop.
7. The compose/send action and its approver are written to the originating incident's Timeline (F1) if the notification is incident-linked.

### Inputs
- Recipient group: `name` (string, required), `type` (enum: `Role`|`Jurisdiction`|`Geography`, required), `selector` (role ID, jurisdiction ID, or geo-polygon, required per type).
- Message template: `name`, `category`, `body` (string with placeholder tokens).
- Compose: `recipient_group_ids` ([UUID], at least one group or geotarget required), `geotarget_polygon` (GeoJSON, optional), `message_body` (string, required, ≤[channel-specific limit]), `channels` ([enum], required, from F14-configured providers), `approver_id` (UUID, required at send).

### Outputs
- Sent notification record with full audience, message, channel, and approver history.
- Per-recipient delivery and acknowledgment status records.
- Timeline entry on the linked incident (if any).

### Validation
- At least one recipient group or a non-empty geotarget polygon is required before proceeding past Step 1.
- Message body cannot be empty and must respect the per-channel character limit shown in Step 2/3.
- The "Approve and send" action is blocked unless the signed-in user matches the designated approver role for the selected channels (enforced server-side, not just hidden client-side).
- AI-drafted content (`[AIDraft]`) can never populate the message field without an explicit, logged Approve action — this is enforced at the API boundary, not just the UI.
- Public/external-reach sends (any channel flagged as public-facing by F14) must show the `Modal danger` confirmation; this cannot be bypassed or auto-confirmed.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Send attempted with no audience selected | 422 | NO_AUDIENCE_SELECTED | "Select at least one recipient group or draw a geotargeted area." |
| Send attempted by non-approver | 403 | APPROVER_MISMATCH | "You're not the designated approver for this channel. Route it to [approver name]." |
| AI draft inserted without approval (API-level guard) | 400 | AIDRAFT_NOT_APPROVED | "This draft hasn't been approved. Approve it before it can be sent." |
| Provider channel unavailable at send time | 503 | CHANNEL_UNAVAILABLE | "[Channel] is temporarily unavailable. The message is queued and will retry." |
| Message exceeds channel character limit | 422 | MESSAGE_TOO_LONG | "This message exceeds the [N]-character limit for [channel]. Shorten it." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §Notifications for `GET/POST /api/v1/recipient-groups`, `GET/POST /api/v1/message-templates`, `POST /api/v1/notifications/compose`, `POST /api/v1/notifications/{id}/send`, `GET /api/v1/notifications/{id}/delivery-status`.

### Schema Surface (this feature)
Owns tables `recipient_groups`, `message_templates`, `notifications`, `notification_recipients`, `notification_delivery_status` — see `Y0c-schema-comms-reporting.md` §Notifications. Reads `incidents` (F1), `users` (F8); writes delivery dispatch requests consumed by F14.
## F6: Mobile Field Operations

**Description:** Mobile updates, structured forms, and geolocated observations for field responders, with offline caching and later reconciliation so field-to-EOC reporting stays reliable regardless of connectivity. Ships as a responsive, installable web application built from the same design system — not a native app.

**Terminology:**
- **Field report:** A structured or free-text observation submitted by a field responder, optionally with photo and location.
- **Queued submission:** A field report or status update created while offline, held locally until reconnect.
- **Reconciliation:** The process of syncing queued submissions to the EOC on reconnect, including conflict detection.
- **Sync conflict:** A state where a queued field submission and the EOC's current record for the same entity have diverged; always surfaced to a named person.

### Sub-features
- Mobile-optimized, installable web app (same design system, `size="lg"` 44px targets, single-column `body-lg` layout, bottom action bar with one primary action).
- Structured field forms and free-text observations with one-tap photo/location capture.
- Offline-first operation: every edit possible while offline, queued submissions shown via `SyncStatus`.
- Reconciliation on reconnect with Timeline entry and conflict surfacing.
- No hover-only or gesture-only interactions.

### Screens

**S6.1 — Field Home (bottom-nav, mobile breakpoint)**
- Single column, `body-lg`. `SyncStatus` pinned at top (online/syncing/offline + queued count/conflict). Bottom bar: 4 destinations (Tasks, Report, Map, Profile — role-dependent per F18). Primary action in bottom action bar: "Report observation."

**S6.2 — My Tasks (field view)**
- List of assigned tasks (card-per-row, label/value pairs per mobile responsive rule, not a dense table): title, status `Badge`, due. Tap opens task detail with one-tap status update buttons ("Start", "Mark done") sized `lg` (44px).

**S6.3 — Report Observation (structured form)**
- Single column, all controls `size="lg"`. Fields: Observation type (`Select`), Description (`TextField multiline`), Photo capture (one-tap camera button with visible thumbnail confirmation after capture), Location capture (one-tap "Use my location" button with visible confirmation — captured lat/long and accuracy shown as text, not just a map pin). Bottom action bar: single primary "Submit report" button. No hover-dependent or swipe-only interactions; every action has a visible button.

**S6.4 — Queued Submissions View**
- List of locally queued items not yet synced: each row shows type, timestamp, and a "Queued" `Badge` via `SyncStatus` styling. Tapping shows full content (read-only) with no edit capability once queued (to avoid silent divergence) — user may delete a queued item before it syncs if it was created in error.

**S6.5 — Sync Conflict Resolution**
- When a queued submission conflicts with an EOC-side change to the same record: side-by-side display of "Your version" vs. "Current EOC version," each field highlighted where they differ. Actions: "Keep my version" / "Keep EOC version" (never a silent auto-merge). Resolution writes a Timeline entry noting which version was kept and by whom.

**S6.6 — Field Map (lightweight operating-picture view)**
- A constrained version of F2's operating picture: `MapCanvas` plus the single "Report observation" primary action, offline-capable (schematic base map fallback per F2), queued reports shown as pending markers via `SyncStatus` styling until synced.

### Process
1. A field responder (PER-04) opens the field app; `SyncStatus` immediately reflects current connectivity (online/syncing/offline).
2. The responder views assigned tasks (S6.2) and updates status with one-tap buttons; if offline, the update is written to local cache (e.g., SQLite) and queued, with `SyncStatus` showing an incremented queued count.
3. The responder submits a structured field report (S6.3), including one-tap photo and location capture; every field remains editable offline, and submission always succeeds locally regardless of connectivity — it either sends immediately (online) or queues (offline).
4. On reconnect, the app automatically attempts to sync all queued items in creation order; `SyncStatus` shows `syncing` during this process.
5. For each queued item that syncs cleanly (no conflicting EOC-side change to the same record), the system appends a Timeline entry on the relevant incident (F1) noting the sync, with the original field-capture timestamp preserved (not the sync timestamp).
6. For each queued item that conflicts with an EOC-side change, the app surfaces it via S6.5 rather than silently resolving; the responder (or an EOC-side user, depending on agency configuration) must explicitly choose which version to keep.
7. Photo/location data captured offline is stored locally until sync; if a photo fails to upload after reconnect (e.g., size/format issue), the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report.

### Inputs
- Task status update: `task_id` (UUID, required), `new_status` (enum, required), `captured_at` (ISO datetime, client-generated, required).
- Field report: `observation_type` (enum, required), `description` (string, optional if photo/location present, required otherwise), `photo` (binary/base64, optional), `location` (lat/long + accuracy, optional but recommended), `captured_at` (ISO datetime, client-generated, required).
- Conflict resolution: `conflict_id` (UUID, required), `resolution` (enum: `keep_mine`|`keep_eoc`, required).

### Outputs
- Field report records visible in the EOC's incident workspace (F1) and operating picture (F2) once synced.
- `SyncStatus` state (online/syncing/offline/conflict) with queued count, visible in the app header and on every mobile screen.
- Timeline entries noting field-to-EOC sync events with original capture timestamps.

### Validation
- Every queued submission must carry a client-generated `captured_at` timestamp at creation time (not assigned at sync time), so the record reflects when the observation actually happened.
- A field report must have at least a description or a photo or a location — not fully empty.
- No submission may be silently dropped: every queued item must resolve to either "synced," "conflict (pending resolution)," or "failed (flagged, with reason and retry option)" — never disappear.
- Conflict resolution requires an explicit named-person choice; no default/automatic resolution path exists.
- All touch targets in field-mobile screens must be ≥44px (`size="lg"`); no interaction may depend on hover or a gesture without a visible single-tap button equivalent.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Sync conflict detected | 409 | SYNC_CONFLICT | "This report differs from the current EOC record. Choose which version to keep." |
| Photo upload failed after reconnect | 500 | PHOTO_UPLOAD_FAILED | "Photo didn't upload. The rest of your report synced. Retry the photo." |
| Location capture denied/unavailable | 200 (degraded) | LOCATION_UNAVAILABLE | "Location isn't available. You can still submit without it." |
| Empty field report submitted | 422 | REPORT_EMPTY | "Add a description, photo, or location before submitting." |
| Local storage full / queue limit reached | 507 | QUEUE_STORAGE_FULL | "Your device can't queue more reports. Connect to sync before adding more." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Field Reports for `POST /api/v1/field-reports` (idempotent via client-generated `report_id`), `POST /api/v1/field-reports/sync-batch`, `POST /api/v1/sync-conflicts/{id}/resolve`, `PATCH /api/v1/tasks/{id}/status` (shared with F4, idempotent by `captured_at` + `task_id`).

### Schema Surface (this feature)
Owns tables `field_reports`, `sync_conflicts`, `field_report_photos` — see `Y0b-schema-incident-ops.md` §Field Operations. Reads/writes `tasks` (F4), `incident_timeline` (F1). Client-side local cache schema (SQLite) is a TechArch concern, not specified here.
## F7: Reporting & Learning

**Description:** ICS output, operational summaries, initial after-action reports (AARs), and evidence/audit logs — closing the preparedness loop by turning incident activity into traceable, reusable learning. Full continuity/recovery measurement and exercise-evidence tracking are deferred.

**Terminology:**
- **SITREP:** Situation report — an operational summary generated from current incident data.
- **AAR:** After-action report — a structured post-incident document combining timeline export, decisions log, resource-request history, and findings/corrective actions.
- **Finding:** A discrete observation from an AAR, optionally linked to a corrective action and, eventually, a plan update (F3).
- **Evidence log:** The append-only, exportable, time-stamped record demonstrating preparedness and accountability (built on F1's Timeline and F8's audit log).

### Sub-features
- Generate ICS-standard output documents and operational summaries/SITREPs, with `[AIDraft]`-assisted narrative sections.
- Initial AAR generation: timeline export, decisions log, resource-request history, structured findings/corrective-action list.
- Evidence and audit log views: append-only, exportable, time-stamped.
- Analytics/reporting page pattern with `Stat` row and `Card`-based charts.

### Screens

**S7.1 — Reports Tab (within Incident Workspace, see F1 S1.3)**
- List of generated documents for the incident: SITREPs, ICS forms, AAR (once incident closes). Each row: document name, type, status (`Draft`/`Approved`), generated at, generated by. "Generate SITREP" / "Generate AAR" primary actions (AAR only available once incident status is `Closed`).

**S7.2 — SITREP Generator**
- Form/wizard: pulls current incident Timeline, task status, and resource-request status automatically into a structured draft; narrative sections offer "Draft with AI" (`[AIDraft]` + `Provenance`, human-approved per F9). Preview pane shows the assembled document; "Save as draft" / "Approve and finalize" (primary) footer actions.

**S7.3 — AAR Generator**
- Multi-step form (steps with `Progress`): Step 1 — Timeline export (auto-populated, read-only, exportable); Step 2 — Decisions log (auto-populated from Timeline entries tagged as decisions, editable annotations); Step 3 — Resource-request history (auto-populated table); Step 4 — Findings & corrective actions (structured list: finding text, category, corrective action text, owner, due date — each addable/editable); Step 5 — Review & finalize. `[AIDraft]` assistance available on narrative/findings text fields.

**S7.4 — Evidence & Audit Log View**
- `Table`: Timestamp (monospace), Actor (`Avatar` + name), Action, Record type, Record (linked). Filters: date range (two `DatePicker`s), actor, action type, record type. Export action ("Export as CSV/PDF"). Read-only — no edit or delete capability exists anywhere in this view, consistent with append-only design.

**S7.5 — Analytics & Reporting Dashboard**
- Page pattern: Analytics and reporting. `PageHeader`, `Stat` row (e.g., Median activation time, Resource-request fulfillment time, Corrective-action closure rate), then `Card`s each holding one chart (`LineChart` for trends, `BarChart` for comparisons, `DonutChart` for part-to-whole) with title, subtitle (unit/period/source), and a hidden data-table alternative. Date ranges via two `DatePicker`s; people/places via `Combobox`. Every KPI shows definition/baseline/target/owner/review-cadence per the design system's dashboard pattern — no invented targets.

### Process
1. During an active incident, planning staff (PER-03) generate a SITREP (S7.2) on demand; the system auto-assembles current Timeline, task, and resource-request data into a structured draft, optionally enriched with `[AIDraft]` narrative text that requires named-person approval before the document is finalized.
2. SITREPs and ICS forms accumulate in the Reports tab (S7.1) with Draft/Approved status; only Approved documents count as official record (consistent with F1's ICS form approval rule).
3. On incident closure (F1), the "Generate AAR" action becomes available; the system auto-populates Steps 1–3 of the AAR wizard (S7.3) from the incident's Timeline, decision-tagged entries, and resource-request history — nothing here is manually re-entered.
4. Planning staff complete Step 4 (findings & corrective actions), optionally using `[AIDraft]` assistance for findings narrative; each finding may reference a plan/SOP section (F3) that should be updated as a result.
5. The AAR is reviewed and finalized (Step 5); finalizing writes it as an immutable, exportable record and triggers an evidence-log entry.
6. The Evidence & Audit Log view (S7.4) aggregates append-only entries from F1 (Timeline), F8 (security audit log), and F7 (report generation/approval events) into one exportable, filterable view — it never allows editing or deleting history.
7. The Analytics dashboard (S7.5) aggregates across incidents/time for KPI reporting (see PRD §7 Success Metrics); every KPI card requires a documented definition/baseline/target/owner/cadence before it is surfaced — no numeric target may be invented by the system or by AI.

### Inputs
- SITREP/ICS form generation: `incident_id` (UUID, required), `include_ai_draft` (boolean, optional).
- AAR generation: `incident_id` (UUID, required, incident must be `Closed`), `findings` ([{text, category, corrective_action, owner_id, due_date}], required at least one before finalization).
- Evidence log query: `date_range`, `actor_id`, `action_type`, `record_type` (all optional filters).
- Analytics query: `date_range` (required), `jurisdiction_scope` (from RBAC).

### Outputs
- Finalized SITREP/ICS form/AAR documents (immutable once Approved/finalized), exportable.
- Evidence/audit log export (CSV/PDF) reflecting the exact filtered view on screen.
- Analytics dashboard KPI tiles and charts with definition/baseline/target/period/source metadata.

### Validation
- AAR generation is blocked until the incident status is `Closed` (cannot generate a final AAR on an open incident, though SITREPs remain available throughout).
- A finalized AAR or Approved SITREP/ICS form is immutable; any correction requires a new version or a dated addendum, never an edit to the finalized record.
- Every AAR finding with a corrective action must have a non-null `owner_id` and `due_date` — an unowned corrective action is not permitted.
- Evidence/audit log views and exports must never expose an edit or delete control, by design, regardless of role — not even for F8 admins.
- Analytics KPI tiles must not display a numeric target unless that target has been explicitly configured with a definition/baseline/owner/cadence (see PRD §7); an undefined KPI shows only the current measured value with no target line.
- AI-generated activity counts (e.g., "N drafts generated") must never be presented as a business outcome KPI on this dashboard — only decision-quality, time-saved, and error-rate metrics qualify.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| AAR generation attempted on open incident | 409 | INCIDENT_NOT_CLOSED | "Close this incident before generating its after-action report." |
| Finalize attempted with an unowned corrective action | 422 | CORRECTIVE_ACTION_UNOWNED | "Assign an owner and due date to every corrective action before finalizing." |
| Edit attempted on a finalized document | 403 | DOCUMENT_IMMUTABLE | "This report is finalized and can't be edited. Create an addendum instead." |
| Evidence log export failed | 500 | EXPORT_FAILED | "This export didn't complete. Retry." |
| Analytics query timeout on large date range | 504 | ANALYTICS_TIMEOUT | "This date range is taking too long to load. Narrow it and retry." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §Reporting for `POST /api/v1/incidents/{id}/sitreps`, `POST /api/v1/incidents/{id}/aar`, `GET /api/v1/evidence-log`, `GET /api/v1/evidence-log/export`, `GET /api/v1/analytics/kpis`.

### Schema Surface (this feature)
Owns tables `sitreps`, `aars`, `aar_findings` — see `Y0c-schema-comms-reporting.md` §Reporting & Learning. Reads `incident_timeline` (F1), `audit_log` (F8), `resource_requests`/`resource_request_status_history` (F4), `ics_forms` (F1).
## F8: Security & Administration

**Description:** The identity, access, audit, and operational-monitoring foundation required for secure multi-role use from day one. Owns RBAC, SSO session management, the append-only audit trail, encryption posture, and the admin console UI used to configure all of the above.

**Terminology:**
- **RBAC:** Role-Based Access Control, scoped by role and incident/jurisdiction.
- **Audit log:** Append-only record of security-relevant actions (login, permission change, record access, AI-draft approval).
- **SSO:** Single sign-on via SAML2/OIDC against an agency's identity provider (shared critical path with F16).
- **Integration health:** Status view of external system connectivity, sync direction, and record authority (detailed screens shared with F13/F15; owned here as the platform-wide pattern).

### Sub-features
- SSO via SAML2/OIDC against an agency IdP.
- Granular, role- and incident-scoped RBAC covering every persona.
- Full audit logging of security-relevant actions, append-only.
- Encryption at rest and in transit for all operational data.
- Operational/availability monitoring and alerting for platform health.
- Admin console UI for user, role, and integration management.

### Screens

**S8.1 — Admin Console Shell**
- Built from the same app shell (F0) with an admin-scoped `SideNav`: Users, Roles & Permissions, Audit Log, Integration Health, Platform Monitoring. Visible only to users with the `IT/SecOps Admin` role (PER-05 admin facet).

**S8.2 — Users (List + Detail)**
- `Table`: Name (`Avatar`), Email, Role, Jurisdiction scope, Status (Active/Suspended), Last login. Detail view: role assignment `Select`, jurisdiction-scope `Combobox` (multi), "Suspend access" (`danger`, requires `Modal` confirmation) / "Reactivate" actions.

**S8.3 — Roles & Permissions**
- `Table` of roles with permission matrix (feature × action, e.g., "Incidents: create/view/edit/approve-activation"). Editing a role's permissions opens a form with `Checkbox` groups per feature area. Changes require confirmation and are logged.

**S8.4 — SSO Configuration**
- Form: IdP metadata URL or XML upload (`TextField`/file input), protocol `Select` (SAML2/OIDC), attribute-mapping fields (email, name, groups → role mapping table). "Test connection" (secondary) before "Save configuration" (primary).

**S8.5 — Audit Log View**
- Shared pattern with F7 S7.4 (Evidence & Audit Log); this screen additionally surfaces security-specific filters: login events, permission changes, record-access events, AI-draft approvals. Read-only, exportable, no edit/delete.

**S8.6 — Integration Health**
- `Table`: System (WebEOC/GIS/Everbridge/CAD/HR-IAM/etc.), Last sync, Direction (in/out/bidirectional), Record authority, `SyncStatus`. Conflict rows show "Keep EPMP value" / "Keep [external] value" actions inline (shared pattern with F13 S13.x).

**S8.7 — Platform Monitoring**
- `Stat` row: uptime, active sessions, failed-login rate, integration-error rate. `Card`s with trend charts (`LineChart`) for availability over time. Alert banner (`Alert` danger, persistent) surfaces any current platform-health incident until resolved.

### Process
1. A user authenticates via the agency's IdP (SAML2/OIDC) through F16's shared SSO integration; F8 validates the assertion/token, resolves or provisions the local user record, and maps IdP groups/attributes to an EPMP role per the configured mapping (S8.4).
2. Every authenticated session is scoped by RBAC: the user's role and jurisdiction scope determine which `SideNav` groups, actions, and records are visible across every other feature (F0–F18).
3. Every security-relevant action (login, logout, permission change, record access to a sensitive record type, AI-draft approval per F9) writes an immutable entry to the audit log with actor, timestamp, action, and affected record.
4. Admins (PER-05 admin facet) manage users and role/permission assignments via S8.2/S8.3; every change is itself an audited action.
5. Admins configure and monitor external integrations' health via S8.6, declaring record authority per system/record-type pair (shared contract with F10, F13, F15, F16, F17); conflicts are never silently resolved — an admin or designated resolver must choose a value.
6. Platform monitoring (S8.7) continuously tracks availability and error rates, surfacing a persistent `Alert` when thresholds are breached, until the underlying issue is resolved.
7. Data at rest and in transit is encrypted per the platform's security baseline (TechArch concern for implementation; this FRD requires the capability to be present and verifiable in every release).

### Inputs
- SSO config: `idp_metadata` (URL or XML, required), `protocol` (enum: `SAML2`|`OIDC`, required), `attribute_mapping` ({email_attr, name_attr, group_attr}, required), `group_to_role_mapping` ([{idp_group, epmp_role}], required).
- User management: `role_id` (UUID, required), `jurisdiction_scope` (UUID[], required), `status` (enum: `Active`|`Suspended`).
- Role/permission edit: `role_id` (UUID, required), `permissions` ([{feature, actions: [string]}], required).
- Audit log query: `date_range`, `actor_id`, `action_type` (all optional filters).

### Outputs
- Authenticated session with resolved role and jurisdiction scope, consumed by every other feature's RBAC checks.
- Append-only audit log entries queryable/exportable via S8.5.
- Integration-health status table consumed by/shared with F13/F15/F10.
- Platform availability/error-rate metrics and alerts.

### Validation
- SSO configuration must pass "Test connection" before it can be saved as active — no untested IdP config goes live.
- A role cannot be deleted while any user is currently assigned to it; it must be reassigned first.
- Permission changes must be logged with the before/after permission set, not just "permissions changed."
- Audit log entries are immutable and exempt from any delete/edit code path, including for admins — this is enforced at the data layer, not just the UI.
- Suspending a user's access must immediately invalidate active sessions for that user (not wait for token expiry).
- No screen, including the admin console, may claim FedRAMP authorization in any copy.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| IdP metadata invalid or unreachable | 422 | SSO_CONFIG_INVALID | "Couldn't validate this identity provider configuration. Check the metadata URL and retry." |
| SSO assertion/token validation failed | 401 | SSO_AUTH_FAILED | "Sign-in with your organization account failed. Contact your administrator if this continues." |
| Role deletion attempted with active assignments | 409 | ROLE_IN_USE | "Reassign all users before deleting this role." |
| Audit log delete/edit attempted (any role) | 403 | AUDIT_LOG_IMMUTABLE | "Audit log entries can't be edited or deleted." |
| Platform health threshold breached | 200 (alert) | PLATFORM_HEALTH_DEGRADED | "[Subsystem] is degraded. [N] users affected. Investigating." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Security & Administration for `POST /api/v1/auth/sso/callback`, `GET/PATCH /api/v1/admin/sso-config`, `GET/POST /api/v1/admin/users`, `GET/PATCH /api/v1/admin/roles`, `GET /api/v1/admin/audit-log`, `GET /api/v1/admin/integration-health`, `GET /api/v1/admin/platform-health`.

### Schema Surface (this feature)
Owns tables `users`, `roles`, `role_permissions`, `audit_log`, `sso_config`, `integration_health` — see `Y0a-schema-auth-org.md` §Security & Administration. Read by every other feature for RBAC enforcement.
## F9: AI-Assisted Drafting & Signal Triage

**Description:** The Phase-1 AI use cases: signal triage/clustering on approved risk feeds, and AI-assisted drafting of structured incident information and ICS forms from reviewed notes. Every output is a draft, never an auto-issued fact or action. This feature is the governance layer that every other feature's `[AIDraft]` touchpoints (F1, F5, F7) depend on.

**Terminology:**
- **AIDraft:** The only UI surface through which AI output reaches a person — always labeled, never auto-issued, shows sources, requires named-person approve/edit/discard.
- **Signal:** A candidate event surfaced from clustering/triage across approved hazard feeds, requiring human validation before it may become an incident.
- **Confidence:** A qualitative label (`High`/`Medium`/`Low`) with a stated reason — never a bare percentage.
- **Model-neutral gateway:** The AI service abstraction that routes requests to a model without hard-coding product logic to a specific vendor model.

### Sub-features
- Signal triage/clustering across approved weather/hazard feeds (F12), surfacing candidates for human validation.
- `[AIDraft]`-assisted drafting of ICS form fields and incident narrative text from reviewed notes.
- Named-person approval required before any AI-drafted content becomes official record.
- Low-confidence/missing-source drafts say so in the draft body.
- Absolute prohibition on auto-issuing AI content as public warning, evacuation instruction, or binding resource decision.

### Screens

**S9.1 — Signal Triage Queue**
- `Table`: Signal summary, Source feed(s), Confidence (text: High/Medium/Low + reason, never a bare percentage), Detected at, Status (New/Dismissed/Promoted). "Review" action per row opens detail; "Promote to incident" (opens F1 S1.2 pre-filled, still requires full human review and submission — never auto-created) and "Dismiss" (requires a one-line reason) actions.

**S9.2 — Signal Detail**
- Shows the clustered source events/feeds that produced this signal, each with `Provenance` (source, time, confidence). No action in this screen writes an operational record directly — "Promote to incident" only pre-fills the incident-creation form (F1 S1.2) for a human to review, edit, and submit.

**S9.3 — AIDraft Panel (embedded wherever "Draft with AI" appears: F1 ICS forms/narrative, F5 message compose, F7 SITREP/AAR narrative)**
- `AIDraft` component: draft text body, `Provenance` chips per source used, "Not issued" badge persists until Approve. Footer actions: "Approve" (inserts text into the target field, logs reviewer + timestamp to the owning record's Timeline/audit trail), "Edit" (opens the draft text in an editable state before approval), "Discard" (removes the draft, no record kept of its content beyond an audit note that a draft was discarded). Low-confidence or missing-source drafts show an inline note in the draft body itself (e.g., "Low confidence: only one source available") rather than being hidden.

### Process
1. Approved weather/hazard feed data (F12) flows into a triage/clustering job (background, via F10) that groups related raw events into candidate "signals."
2. Each signal is scored with a qualitative confidence label and reason, and surfaced in S9.1 for human review — a signal is never auto-promoted to an active incident under any configuration.
3. A reviewer (typically PER-01 or PER-03) opens S9.2, reviews the clustered source data and provenance, and either dismisses the signal (with a reason) or clicks "Promote to incident," which pre-fills the F1 incident-creation form — the reviewer must still complete and submit that form as a distinct, deliberate action.
4. Separately, wherever a "Draft with AI" button appears on a form (ICS forms/F1, message compose/F5, SITREP/AAR narrative/F7), clicking it sends the relevant reviewed notes/context to the model-neutral AI gateway and renders the response in an `AIDraft` panel (S9.3) below the field — never directly into the field.
5. The named person reviewing the draft can Approve (copies text into the field, logs reviewer+timestamp to the owning record), Edit (adjust text before approving), or Discard (removes it). No code path writes AI-drafted text into an official field without passing through this explicit Approve action.
6. If the AI service returns a low-confidence result or cannot find a source for part of its output, the draft body itself states this plainly (e.g., "Low confidence: based on limited data") — the system never silently upgrades a weak draft to look authoritative.
7. At the API boundary, every endpoint capable of writing to an official record (incident fields, ICS forms, notifications, SITREP/AAR content) rejects any payload tagged as AI-originated that lacks a recorded approver ID and timestamp — this is a server-side guard, not merely a UI convention.

### Inputs
- Signal triage: `feed_events` ([{source, timestamp, payload}], from F12 background ingestion).
- AIDraft request: `context` (string — reviewed notes or structured data the draft should be based on), `target_field` (string, identifies where the draft would be inserted if approved), `requesting_user_id` (UUID, required).
- Approval: `draft_id` (UUID, required), `action` (enum: `approve`|`edit`|`discard`, required), `edited_text` (string, required if `action=edit`), `approver_id` (UUID, required).

### Outputs
- Signal triage queue entries with confidence labels and source provenance.
- `AIDraft` panel content (draft text + sources + confidence note), never written to any official record until approved.
- Approval audit entries (reviewer, timestamp, original draft, final approved text if edited) on the owning record's Timeline/audit trail.

### Validation
- A signal may never transition directly to an active incident without a human explicitly completing and submitting the F1 incident-creation form — "Promote to incident" is a pre-fill action only, enforced server-side (the promote endpoint returns a pre-filled draft payload, not a created incident).
- Every `AIDraft` must carry at least one `Provenance` source or explicitly state "No source available" in its body — it may never present as sourced when it is not.
- Confidence must always render as a qualitative label with a stated reason, never a bare numeric percentage.
- The approve action requires a `approver_id` resolving to an active, named (non-service) user account; service/system accounts cannot approve AI drafts.
- No API endpoint that writes to an incident, ICS form, notification, SITREP, or AAR may accept content flagged `ai_origin: true` without a non-null `approved_by`/`approved_at` pair — this is validated at the data layer, independent of which UI client calls it.
- Under no configuration, feature flag, or admin setting may AI-generated content be dispatched as a public warning, evacuation instruction, or binding resource deployment decision without this same human-approval gate — this is a hard, non-overridable constraint.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| AI gateway unavailable | 503 | AI_GATEWAY_UNAVAILABLE | "AI drafting is temporarily unavailable. You can still write this manually." |
| Draft requested with no usable source context | 200 (flagged) | AIDRAFT_NO_SOURCE | "No source available for this draft. Review carefully before using it." |
| Approval attempted by a service/system account | 403 | APPROVAL_REQUIRES_NAMED_USER | "AI drafts must be approved by a signed-in person." |
| Write attempted with unapproved AI-origin content (API guard) | 400 | AIDRAFT_UNAPPROVED_WRITE_BLOCKED | "This content hasn't been approved and can't be saved to the official record." |
| Signal promotion attempted to bypass incident-creation form | 400 | PROMOTE_REQUIRES_HUMAN_SUBMIT | "Promoting a signal only pre-fills the incident form. Complete and submit it to create the incident." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §AI Assistance for `GET /api/v1/signals`, `POST /api/v1/signals/{id}/promote` (returns pre-fill payload only), `POST /api/v1/signals/{id}/dismiss`, `POST /api/v1/ai-drafts`, `POST /api/v1/ai-drafts/{id}/approve`, `POST /api/v1/ai-drafts/{id}/discard`.

### Schema Surface (this feature)
Owns tables `signals`, `signal_source_events`, `ai_drafts` — see `Y0c-schema-comms-reporting.md` §AI Assistance. `ai_drafts.approved_by`/`approved_at` are referenced by F1 (`ics_forms`), F5 (`notifications`), and F7 (`sitreps`/`aars`) as the enforcement join for the "no unapproved AI content" constraint.
## F10: Platform API, Integration Gateway & Event Bus

**Description:** The programmatic contract and background-processing backbone that lets EPMP publish its own data, accept approved external data, and process work asynchronously (notification delivery, sync reconciliation, feed ingestion) without blocking interactive use. This is the system's public/partner-facing API surface, distinct from the UI (F0), and the enforcement point for the four non-negotiable integration behaviors: record authority, trusted provenance, controlled federation, graceful failure.

**Terminology:**
- **Record authority registry:** The documented, queryable declaration of which system owns each record type.
- **Provenance enforcement:** API-boundary validation that every ingested/AI-derived fact carries source, timestamp, version, confidence.
- **Idempotent consumer:** A webhook/event consumer that safely processes a duplicate delivery without side effects (via idempotency keys).
- **Federation grant:** A policy-enforced, revocable permission allowing a specific partner jurisdiction to view specific incident/resource data.

### Sub-features
- Versioned OpenAPI/REST/JSON contracts for incident, resource, readiness, reporting, and administration functions.
- OAuth2/OIDC/SAML2-based delegated authorization for API and federation access.
- Webhook/event-bus publication of incident/status changes with durable delivery, idempotent consumers, retry policies.
- Background job processing for notification fan-out, feed ingestion, offline-sync reconciliation, report generation.
- Record-authority registry.
- Provenance enforcement at the API boundary.
- Policy-enforced, revocable cross-jurisdiction data federation.

### Screens

**S10.1 — API & Integration Gateway (admin-facing, within F8 admin console)**
- `Table`: registered API clients/partners, scopes granted, last request, rate-limit status. "Revoke access" (`danger`, `Modal` confirmation) per row.

**S10.2 — Record Authority Registry (admin-facing)**
- `Table`: Record type (e.g., Incident, Dispatch status, Personnel roster), Authoritative system (EPMP or named external system), Notes. Read-mostly reference configuration; changes require admin role and are audited.

**S10.3 — Federation Grants**
- `Table`: Partner jurisdiction, Scope granted (which incidents/record types), Granted by, Expires, Status (Active/Revoked). "Grant access" (form: partner `Combobox`, scope checkboxes, expiry `DatePicker`) / "Revoke" (`danger`, immediate effect) actions.

**S10.4 — Background Job Monitor (within F8 Platform Monitoring, S8.7)**
- `Table`: Job type (notification fan-out, feed ingestion, sync reconciliation, report generation), Status, Last run, Failure count, Next retry. Surfaced as part of the platform-health view, not a separate top-level nav item.

### Process
1. Every external API request authenticates via OAuth2/OIDC bearer token (or SAML2-federated session for browser-based partner access); the gateway validates scope against the record-authority and federation-grant configuration before routing to the relevant domain service.
2. Incident/status changes originating in EPMP (F1, F4, F5) publish events to the durable event bus; external subscribers (webhooks) receive deliveries with a unique idempotency key, so a retried delivery is safely ignored if already processed.
3. Inbound data from approved external sources (F11 GIS, F12 hazard feeds, F13 EOC COTS, F15 CAD, F16 HR/IAM, F17 assets/documents) passes through provenance enforcement: every ingested fact must carry source, timestamp, version, and confidence before it is persisted; data missing this is rejected, not silently accepted.
4. Background jobs handle: notification fan-out (F5/F14, parallelized per channel), feed ingestion (F12, scheduled polling with retry/backoff on outage), offline-sync reconciliation (F6, processing queued batches), and report generation (F7, for long-running AAR compilation).
5. The record-authority registry (S10.2) is consulted by every integration feature (F13, F15, F16, F17) before writing a record sourced externally — if EPMP is not authoritative for a record type, EPMP treats inbound data as reference/display-only and never allows a local edit to silently diverge without flagging a conflict.
6. Federation grants (S10.3) are policy-enforced per request (via a policy engine) and revocable at any time; a revoked grant takes effect immediately, not at next token expiry.
7. Graceful failure: any integration feed/job experiencing an outage queues work, retries with backoff, and surfaces its degraded state via `SyncStatus`/integration-health (F8 S8.6) rather than failing silently or blocking unrelated platform operation.

### Inputs
- API auth: `access_token` (OAuth2/OIDC bearer, required), `client_id` (required for partner/federation access).
- Webhook registration: `callback_url` (required), `event_types` ([string], required), `secret` (for signature verification, required).
- Record authority entry: `record_type` (string, required), `authoritative_system` (enum: `EPMP`|named external system, required).
- Federation grant: `partner_jurisdiction_id` (UUID, required), `scope` ([record types/incident filters], required), `expires_at` (ISO datetime, optional).
- Ingested fact (any integration): `source` (string, required), `timestamp` (ISO datetime, required), `version` (string, required), `confidence` (enum, required), `payload` (required).

### Outputs
- Published webhook/event-bus deliveries with idempotency keys.
- Record-authority registry responses consumed by F13/F15/F16/F17.
- Federation-scoped query results (only data within an active, non-expired, non-revoked grant).
- Background-job status/health feed into F8 S8.7 Platform Monitoring.

### Validation
- Every mutating webhook consumer call must include and check an idempotency key; duplicate keys within the retry window must be rejected/no-op'd, not reprocessed.
- Inbound data lacking `source`, `timestamp`, `version`, or `confidence` must be rejected at the API boundary — never persisted as if verified.
- A federation grant must have an explicit scope; a grant with no scope restriction (implicit "all data") is not permitted — every grant must enumerate what it covers.
- Revoking a federation grant or API client must take effect within the same request cycle — no caching window that honors a revoked credential.
- Background jobs must be observable: every job type must report last-run time, failure count, and next-retry time to S10.4/S8.7 — a silent, unmonitored background job is a defect.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Ingested fact missing provenance fields | 422 | PROVENANCE_REQUIRED | "This data is missing source, timestamp, or confidence and can't be accepted." |
| Duplicate webhook delivery (idempotency match) | 200 (no-op) | DUPLICATE_DELIVERY_IGNORED | (Internal — not user-facing; logged as a no-op, not an error to the caller.) |
| Federation grant expired/revoked | 403 | FEDERATION_ACCESS_DENIED | "Access to this data was revoked or has expired." |
| Record-authority conflict (write attempted to externally-owned record) | 409 | RECORD_AUTHORITY_CONFLICT | "[External system] owns this record. Changes must be made there, or flagged as a conflict for review." |
| Background job failure threshold exceeded | 200 (alert) | BACKGROUND_JOB_DEGRADED | "[Job type] has failed [N] times and is in backoff. Last error: [reason]." |

### API Surface (this feature)
See all of `Y1a`–`Y1d` for the full versioned contract; this feature specifically owns `Y1a-api-auth-admin.md` §API Clients & Federation for `GET/POST /api/v1/admin/api-clients`, `POST /api/v1/admin/api-clients/{id}/revoke`, `GET/POST /api/v1/admin/record-authority`, `GET/POST /api/v1/admin/federation-grants`, `POST /api/v1/admin/federation-grants/{id}/revoke`, and the shared webhook-subscription endpoints in `Y1d-api-integrations.md` §Event Bus.

### Schema Surface (this feature)
Owns tables `api_clients`, `webhook_subscriptions`, `webhook_deliveries`, `record_authority_registry`, `federation_grants`, `background_jobs` — see `Y0a-schema-auth-org.md` §Platform API & Federation and `Y0d-schema-integration-geo.md` §Event Bus. Consulted by every integration feature (F11–F17).
## F11: GIS & Geospatial Integration

**Description:** Read integration with the agency's own GIS so the common operating picture (F2) renders real base maps, boundaries, and facility layers styled to the EPMP map tokens, rather than EPMP building a parallel GIS system of record. Publishes EPMP-authored layers back to the agency's GIS where permitted.

**Terminology:**
- **Base layer:** The agency's own GIS tile/vector layer (Esri, OSM-derived, agency GIS) rendered underneath EPMP's own markers.
- **Feature service:** An OGC-service/GeoJSON/Esri-REST endpoint exposing geospatial features (boundaries, facilities) consumable by EPMP.
- **Published layer:** An EPMP-authored layer (incidents, resource positions, hazard overlays) exposed back to the agency's GIS as an authorized read service.

### Sub-features
- Read integration with Esri, OSM-derived, or agency GIS base layers and feature services.
- EPMP-authored data published as authorized layers/services back to the agency's GIS where permitted.
- Base-map styling to `map-*` design tokens.
- Graceful failure to the schematic offline base map (F2) when the GIS feed is unavailable.

### Approved Adapter Pattern
This integration uses a single approved adapter contract regardless of the underlying GIS vendor (Esri ArcGIS, agency-hosted OSM/MapLibre, or similar): the adapter normalizes vendor-specific feature-service responses into a common internal GeoJSON-based representation before anything reaches the F2 rendering layer. Vendor-specific adapter implementations are out of scope for this FRD (TechArch concern); this document specifies only the adapter's external contract.

**Adapter request/response contract (MVP depth):**
- **Request:** `GET /adapter/gis/features?layer={layer_id}&bbox={minx,miny,maxx,maxy}` — the adapter translates this into the vendor's native query (e.g., Esri REST `query` operation or an OGC `GetFeature` request).
- **Response (normalized):** `{ layer_id, source, as_of, features: [GeoJSON Feature] }` — every response carries `source` and `as_of` regardless of vendor, satisfying provenance enforcement (F10).
- **Publish request:** `POST /adapter/gis/publish` with `{ layer_id, features: [GeoJSON Feature], visibility: "agency-internal"|"public" }` — the adapter translates this into the vendor's feature-service write/update API where the agency has granted publish rights; this is explicitly scoped to the defined layer set (incidents, resource positions, hazard overlays), not a general-purpose GIS write API.

### Process
1. On operating-picture load (F2), the gateway (F10) requests the agency's configured base-layer feature services via the GIS adapter, scoped to the current map viewport (bounding box).
2. The adapter normalizes the vendor response into the common GeoJSON representation and attaches `source` and `as_of` provenance before returning it to F2 for rendering.
3. F2 styles the base layer using `map-*` tokens (muted land/water/park/road/boundary/label) so EPMP's own markers remain the most prominent layer on screen.
4. EPMP-authored data (incident markers, resource positions, hazard overlays validated by F12) is optionally published back to the agency's GIS as an authorized read-only service, via the adapter's publish contract, only for agencies that have granted this write permission.
5. If the GIS feed request times out or errors, F10 surfaces the failure to F2, which falls back to the schematic offline base map (per F2's Process step 2) rather than failing the operating-picture page.
6. Feed health (last successful fetch, error count) is surfaced in F8's Integration Health view (S8.6) with record authority declared as the agency's GIS being authoritative for base-layer/boundary/facility-location data, and EPMP being authoritative only for its own incident/resource/hazard-overlay layers.

### Inputs
- `layer_id` (string, required): which base or feature layer to request.
- `bbox` (4 floats, required): bounding box of the current map viewport.
- `publish_payload` (GeoJSON FeatureCollection, required for publish calls): EPMP-authored features to expose back to the agency's GIS.

### Outputs
- Normalized GeoJSON feature responses with `source`/`as_of` provenance, consumed by F2.
- Published layer availability status (for agencies with write permission granted).
- Integration-health status entry (F8 S8.6) for the GIS adapter.

### Validation
- Every normalized response must carry non-null `source` and `as_of`; a response missing either is treated as a feed failure (triggers the degraded-mode fallback), not silently passed through.
- Publish calls are restricted to the defined layer set (incidents, resource positions, hazard overlays) — the adapter must reject any publish payload targeting an undeclared layer type.
- Base-layer styling must use only `map-*` tokens; no raw color values may be applied to the GIS base layer at the EPMP rendering layer.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| GIS feature service timeout | 504 | GIS_FEED_TIMEOUT | (Surfaces to F2 as schematic-base fallback; no separate user-facing error beyond F2's degraded-mode banner.) |
| GIS feature service returns malformed/unprovenanced data | 502 | GIS_FEED_INVALID | "GIS layer '[layer]' returned invalid data and was skipped this refresh." |
| Publish attempted to undeclared layer | 400 | GIS_PUBLISH_LAYER_NOT_ALLOWED | "This layer isn't approved for publishing back to [agency] GIS." |
| Publish rejected by agency GIS (no write permission) | 403 | GIS_PUBLISH_DENIED | "[Agency] hasn't granted EPMP permission to publish this layer." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §GIS for `GET /api/v1/integrations/gis/features`, `POST /api/v1/integrations/gis/publish`, `GET /api/v1/integrations/gis/health`.

### Schema Surface (this feature)
Owns table `gis_feed_status` (health/record-authority metadata) — see `Y0d-schema-integration-geo.md` §GIS. Does not own geospatial feature data itself (read-through/cached only, not a system of record); feeds `hazard_layers`/`facilities` surfaces consumed by F2/F17.
## F12: Weather & Hazard Feed Ingestion

**Description:** Read-only ingestion of NOAA/NWS/USGS and similar hazard data feeds as common-operating-picture overlay layers (F2), with full provenance preserved. The curated, correlated risk-intelligence module is explicitly deferred.

**Terminology:**
- **Hazard feed:** An external, read-only data source (NOAA/NWS/USGS) providing forecasts, warnings, events, or hazard locations with confidence metadata.
- **Hazard layer:** The EPMP-side representation of ingested hazard-feed data, rendered as a toggleable overlay on the operating picture (F2).

### Sub-features
- Scoped, read-only ingestion of forecasts, warnings, events, and hazard locations with confidence metadata.
- Every ingested hazard fact carries source, timestamp, confidence via `Provenance`.
- Feeds surface as toggleable layers in `LayerPanel`, off by default when unverified.
- Feed ingestion runs as a background job with retry/backoff on outage.

### Approved Adapter Pattern
One normalized adapter contract per feed family (NOAA/NWS alerts API, USGS earthquake/hazard feeds), each translating the vendor's native format (CAP-XML for NWS alerts, GeoJSON for USGS) into a common internal hazard-event representation. Vendor-specific parsing logic is a TechArch concern; this FRD specifies the external contract and ingestion behavior only.

**Adapter contract (MVP depth):**
- **Poll request:** scheduled background job calls `GET {adapter}/hazard-events?feed={noaa|usgs|...}&since={timestamp}`.
- **Normalized response:** `{ feed, events: [{ id, type, severity, geometry (GeoJSON), confidence, source, issued_at, expires_at }] }`.
- Each normalized event is persisted with `verified: false` by default until an operator marks it reviewed, per the Provenance convention — ingestion never auto-verifies a feed.

### Process
1. A scheduled background job (F10) polls each configured hazard feed at its defined interval, requesting events since the last successful poll.
2. The adapter normalizes vendor-specific responses (CAP-XML, GeoJSON, etc.) into the common hazard-event representation, attaching `source`, `issued_at`, and `confidence` to every event.
3. Normalized events are persisted as hazard layers with `verified: false`; they appear in F2's `LayerPanel` as toggleable, off-by-default, visually flagged "Unverified" layers.
4. A person (typically PER-01 or PER-03) reviews an unverified hazard layer against other evidence and may mark it `verified: true`, at which point the dashed "Unverified" treatment is removed from the layer — this is a deliberate human action, never automatic.
5. If a feed is unreachable, the job retries with exponential backoff and logs the outage to F8's Integration Health view; the operating picture continues to render using the last successfully ingested data, labeled with its age, rather than blocking.
6. Ingested hazard events also feed F9's signal-triage/clustering job as raw input for candidate-signal detection.

### Inputs
- Feed configuration: `feed_name` (enum: `NOAA`|`NWS`|`USGS`|..., required), `poll_interval` (seconds, required), `endpoint_url` (required).
- Ingested event (post-normalization): `type`, `severity`, `geometry` (GeoJSON), `confidence` (enum), `source`, `issued_at`, `expires_at`.
- Verification action: `hazard_layer_id` (UUID, required), `verified_by` (UUID, required — named person).

### Outputs
- Hazard-layer records consumable by F2's `LayerPanel` and `MapCanvas`.
- Raw hazard events consumable by F9's signal-triage job.
- Feed-health status (last poll, success/failure, backoff state) in F8's Integration Health view.

### Validation
- An ingested event missing `source`, `issued_at`, or `confidence` is rejected (per F10's provenance enforcement), not persisted as a usable layer.
- `verified` can only be set `true` by an explicit, named-person action — no automated promotion from unverified to verified under any configuration.
- Expired events (`expires_at` in the past) must be visually distinguished or removed from the active `LayerPanel` list, never shown as current without an age indicator.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Feed unreachable | 503 | HAZARD_FEED_UNREACHABLE | (Logged to integration health; F2 shows last-known data labeled with age, no blocking error to end users.) |
| Feed returns malformed data | 502 | HAZARD_FEED_MALFORMED | "[Feed name] returned data that couldn't be processed and was skipped this cycle." |
| Verification attempted by non-named/service account | 403 | VERIFICATION_REQUIRES_NAMED_USER | "A signed-in person must verify this hazard layer." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Hazard Feeds for `GET /api/v1/integrations/hazard-feeds/events`, `POST /api/v1/hazard-layers/{id}/verify`, `GET /api/v1/integrations/hazard-feeds/health`.

### Schema Surface (this feature)
Owns tables `hazard_feed_config`, `hazard_layers`, `hazard_feed_events` — see `Y0d-schema-integration-geo.md` §Hazard Feeds. Feeds F2 (operating picture) and F9 (signal triage).
## F13: EOC COTS Interoperability

**Description:** Governed interoperability with incumbent EOC platforms (WebEOC, Veoci, DisasterLAN) so agencies that retain these systems can use EPMP as a coordination/readiness layer rather than a forced replacement, per the product's dual commercial posture. Scoped to an MVP-appropriate record set via approved adapters, not full bidirectional sync of every board/widget type.

**Terminology:**
- **EOC COTS:** Commercial off-the-shelf incumbent EOC platform (e.g., WebEOC, Veoci, DisasterLAN).
- **Board:** An incumbent system's native term for a structured data table/form (e.g., a WebEOC "board"); mapped to EPMP's incidents/tasks/resource-requests where the record types align.
- **Conflict:** A state where the same logical record (e.g., an incident status) differs between EPMP and the external COTS system, requiring human resolution.

### Sub-features
- Approved adapter integration exchanging incidents, boards, resource requests, status, and activity logs with incumbent EOC COTS systems.
- Explicit record-authority declaration per integrated system, visible in integration-health view.
- Conflict surfacing with side-by-side values and "Keep EPMP value" / "Keep [external] value" actions.
- Integration-health view (system, last sync, direction, record authority, `SyncStatus`).

### Screens

**S13.1 — EOC COTS Integration Health & Conflict Resolution (embedded in F8 S8.6 Integration Health)**
- Shares F8's Integration Health `Table` row for each configured EOC COTS system (System name, Last sync, Direction, Record authority, `SyncStatus`). A conflict-flagged row expands to a side-by-side comparison: EPMP's current value and the external system's value, each labeled with its source and last-modified time, with "Keep EPMP value" / "Keep [external] value" actions (never a silent overwrite). This is not an independently-routed screen — it is the EOC-COTS-specific instance of F8 S8.6's shared conflict-row pattern, reached exclusively via `/admin/integration-health`.

### Approved Adapter Pattern
One normalized adapter contract per COTS vendor family, each translating the vendor's native API (WebEOC's REST/SOAP board API, Veoci's REST API, DisasterLAN's integration API) into a common internal "exchange record" representation covering exactly four record types in this MVP: Incident, Resource Request, Status Update, Activity Log Entry. Full per-vendor board/widget mapping beyond these four record types is explicitly out of scope.

**Adapter contract (MVP depth):**
- **Inbound sync:** `GET {adapter}/exchange-records?type={incident|resource_request|status|activity_log}&since={timestamp}` → normalized `{ external_id, type, payload, external_system, last_modified_external }`.
- **Outbound sync:** `POST {adapter}/exchange-records` with the EPMP-side record, translated by the adapter into the vendor's native board/field format.
- **Conflict detection:** on each sync cycle, if both EPMP and the external system have modified the same logical record since the last successful sync, the adapter returns both versions tagged `conflict: true` rather than picking one.

### Process
1. A scheduled or triggered sync job (F10) calls the adapter's inbound-sync endpoint for each of the four exchange-record types, scoped to records modified since the last successful sync.
2. For each inbound record, the system checks the record-authority registry (F10 S10.2): if the external system is authoritative for that record type, the inbound value is accepted and applied directly, with provenance noting the external source; if EPMP is authoritative, the inbound value is treated as a candidate and checked for conflict against the EPMP-side current value.
3. If both sides have diverged since the last sync, the record is flagged as a conflict and surfaced in F8 S8.6 / this feature's integration-health view with both values shown side by side; no automatic merge or overwrite occurs.
4. A named person (typically PER-01 or PER-05 admin facet) resolves the conflict by explicitly choosing "Keep EPMP value" or "Keep [external system] value"; the resolution is written back through the adapter to the external system if EPMP's value was kept, or applied locally if the external value was kept.
5. Outbound sync pushes EPMP-originated changes (new incidents, resource requests, status updates, activity-log entries) to the external system via the adapter's outbound contract, for record types where EPMP is authoritative or where bidirectional exchange is configured.
6. Integration health (last sync time, direction, record authority, current `SyncStatus`) is continuously updated and visible in F8 S8.6.

### Inputs
- Adapter config: `vendor` (enum: `WebEOC`|`Veoci`|`DisasterLAN`, required), `endpoint_url`, `auth_credentials` (vendor-specific, required).
- Sync record (either direction): `external_id`, `type` (enum, required), `payload`, `last_modified_external`/`last_modified_epmp`.
- Conflict resolution: `conflict_id` (UUID, required), `resolution` (enum: `keep_epmp`|`keep_external`, required), `resolved_by` (UUID, required).

### Outputs
- Synced incident/resource-request/status/activity-log records reflected in both systems (per declared record authority).
- Conflict entries in the integration-health view, pending resolution.
- Integration-health status (last sync, direction, authority, `SyncStatus`) in F8 S8.6.

### Validation
- Every sync cycle must declare, per record type, which system is authoritative (via F10's record-authority registry) before applying any inbound change — undeclared record types are not synced.
- A detected conflict must never be auto-resolved by any heuristic (e.g., "last write wins"); resolution always requires an explicit named-person choice.
- Outbound sync to the external system must only occur for record types where the record-authority registry permits an EPMP-originated write.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Adapter authentication failed | 401 | EOC_ADAPTER_AUTH_FAILED | "Connection to [vendor] failed. Check the integration credentials." |
| Sync detected a conflict | 200 (flagged) | EOC_SYNC_CONFLICT | "[Record] differs between EPMP and [vendor]. Choose which value to keep." |
| Outbound write rejected by external system | 502 | EOC_OUTBOUND_REJECTED | "[Vendor] rejected this update: [vendor error reason]." |
| Record type not in approved exchange set | 400 | EOC_RECORD_TYPE_UNSUPPORTED | "This record type isn't part of the approved exchange set with [vendor]." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §EOC COTS for `GET/POST /api/v1/integrations/eoc-cots/exchange-records`, `GET /api/v1/integrations/eoc-cots/conflicts`, `POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve`, `GET /api/v1/integrations/eoc-cots/health`.

### Schema Surface (this feature)
Owns tables `eoc_cots_config`, `eoc_cots_sync_log`, `eoc_cots_conflicts` — see `Y0d-schema-integration-geo.md` §EOC COTS. References `incidents` (F1), `resource_requests` (F4) as the EPMP-side records being exchanged.
## F14: Notification Provider & Public-Alerting Integration

**Description:** Outbound integration with external notification providers (Everbridge, AtHoc, and similar channels) and the FEMA IPAWS/OASIS CAP ecosystem for approval-controlled public warning distribution, extending F5's internal notification domain to real delivery channels.

**Terminology:**
- **Provider adapter:** The integration translating EPMP's internal notification payload into a specific external provider's send API.
- **CAP (Common Alerting Protocol):** The OASIS standard format for public-warning messages, used for any message routed through IPAWS or CAP-compatible channels.
- **Delivery callback:** An inbound webhook from a provider reporting delivery/acknowledgment status for a previously sent message.

### Sub-features
- Provider-integration adapter(s) for Everbridge/AtHoc-class channels, with delivery-status and acknowledgment callbacks.
- OASIS CAP-formatted alert representation for IPAWS/CAP-compatible channels, subject to agency authority/access rights.
- Every external send remains approval-controlled by a named person.
- Graceful failure: provider outages queue messages for retry and surface delivery failures.

### Approved Adapter Pattern
One normalized adapter contract per provider family (Everbridge/AtHoc-class commercial notification channels, and a separate CAP-formatting adapter for IPAWS/CAP-compatible public-warning channels). MVP ships with a single approved provider integration rather than every named vendor; the adapter contract below is vendor-neutral so additional providers can be added without changing F5's domain model.

**Adapter contract (MVP depth):**
- **Send request:** `POST {adapter}/send` with `{ notification_id, channel, recipients: [...], message, approved_by, approved_at }` — the adapter rejects any request missing `approved_by`/`approved_at` (mirrors F9's AI-draft approval enforcement; a human approval is required regardless of whether the content was AI-drafted).
- **CAP formatting (for IPAWS/CAP channels only):** the adapter wraps the approved message in an OASIS CAP XML envelope with required fields (`identifier`, `sender`, `sent`, `status`, `scope`, `category`, `event`, `urgency`, `severity`, `certainty`, `area`), subject to the agency's configured authority/access rights for that channel — EPMP never originates a CAP alert without an explicit agency-authorized sender identity attached.
- **Delivery callback (inbound webhook):** `POST /api/v1/integrations/notification-providers/callback` with `{ external_message_id, recipient, status: "sent"|"delivered"|"failed"|"acknowledged", timestamp }`, matched back to the originating `notification_id`/recipient record in F5.

### Process
1. When a notification is approved and sent in F5 (S5.3 Step 4), the system dispatches it through this feature's provider adapter(s) for every channel not handled as a purely internal channel.
2. For channels routed through IPAWS/CAP-compatible public-warning systems, the message is additionally wrapped in a CAP-formatted envelope before dispatch, using the agency's configured, authorized sender identity — this step never runs for a message that has not passed F5's named-person approval gate.
3. The adapter records an `external_message_id` per recipient/channel at send time, enabling delivery callbacks to be matched back to the correct notification and recipient.
4. As the provider sends delivery/acknowledgment callbacks, this feature updates the corresponding `notification_delivery_status` records (owned by F5), which immediately reflect in F5's S5.4 Delivery & Acknowledgment Tracking view.
5. If the provider is unreachable at send time, the message is queued (not dropped) and retried with backoff; the failure state and retry schedule are visible in F5's delivery view as `Failed` with a visible reason and retry countdown, and in F8's Integration Health view.
6. No code path in this feature can dispatch a message without a prior F5-recorded `approved_by`/`approved_at` pair — the adapter's send endpoint validates this server-side and rejects any request missing it, mirroring F9's AI-governance enforcement pattern.

### Inputs
- Send request: `notification_id` (UUID, required), `channel` (enum, required), `recipients` (array, required), `message` (string, required), `approved_by` (UUID, required), `approved_at` (ISO datetime, required).
- CAP fields (public-warning channels only): `sender` (authorized agency identity, required), `event`, `urgency`, `severity`, `certainty`, `area` (all required per CAP spec).
- Delivery callback: `external_message_id`, `recipient`, `status` (enum), `timestamp` (all required).

### Outputs
- Dispatched messages via provider channel(s), tracked by `external_message_id`.
- CAP-formatted XML payload for public-warning channel sends (retained for audit).
- Updated `notification_delivery_status` records consumed by F5 S5.4.

### Validation
- The send endpoint must reject any request lacking `approved_by`/`approved_at` — unconditionally, with no override, regardless of caller.
- CAP-formatted sends must include all OASIS CAP required fields; an incomplete CAP payload is never dispatched, it is rejected back to the composer (F5) for completion.
- Delivery callbacks must match an existing `notification_id`/recipient pair; an unmatched callback is logged for investigation, not silently discarded or silently attached to the wrong record.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Send attempted without approval record | 400 | SEND_REQUIRES_APPROVAL | "This message hasn't been approved and can't be sent." |
| Provider unreachable | 503 | PROVIDER_UNAVAILABLE | "[Provider] is temporarily unavailable. The message is queued and will retry." |
| CAP payload incomplete | 422 | CAP_FIELDS_INCOMPLETE | "This public warning is missing required fields: [list]. Complete it before sending." |
| Delivery callback unmatched | 200 (logged) | CALLBACK_UNMATCHED | (Internal — logged for investigation, no user-facing error.) |
| Agency lacks authorization for IPAWS/CAP channel | 403 | CAP_AUTHORITY_DENIED | "[Agency] isn't authorized to send through this public-warning channel." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Notification Providers for `POST /api/v1/integrations/notification-providers/send`, `POST /api/v1/integrations/notification-providers/callback`, `GET /api/v1/integrations/notification-providers/health`.

### Schema Surface (this feature)
Owns tables `notification_provider_config`, `notification_dispatch_log`, `cap_alert_records` — see `Y0c-schema-comms-reporting.md` §Notification Provider Integration. Writes into F5's `notification_delivery_status` table.
## F15: CAD / 911 Integration

**Description:** Read integration with CAD/911 and public-safety dispatch systems to bring approved incident and dispatch status into EPMP's incident record, without EPMP becoming a dispatch system of record.

**Terminology:**
- **CAD:** Computer-Aided Dispatch — the public-safety system of record for 911/dispatch events.
- **Dispatch status:** The CAD-side lifecycle state of a dispatched unit/event (e.g., dispatched, en route, on scene, cleared).

### Sub-features
- Vendor-authorized, read-oriented event/API integration surfacing dispatch status against an EPMP incident.
- Record authority for dispatch data remains with CAD/911; EPMP references and displays it with provenance, never edits it.
- Integration-health visibility consistent with F13's pattern.

### Approved Adapter Pattern
One normalized adapter contract per CAD vendor, read-only, translating vendor-specific dispatch events into a common internal representation linked to an EPMP incident by a configured matching key (e.g., shared incident number, geographic/time proximity match confirmed by a human).

**Adapter contract (MVP depth):**
- **Poll/subscribe request:** `GET {adapter}/dispatch-events?since={timestamp}` or vendor-native webhook subscription where supported.
- **Normalized response:** `{ external_event_id, cad_incident_number, status, unit_ids, location (GeoJSON), updated_at, source }`.
- No write/update operations exist in this adapter contract — it is strictly read-only, consistent with CAD remaining the system of record for dispatch data.

### Process
1. A background job (F10) polls or subscribes to the configured CAD system's dispatch-event feed via the adapter.
2. Normalized dispatch events are matched to an EPMP incident, either automatically (shared incident number configured) or via a human-confirmed match (geographic/time proximity suggested, person confirms the link).
3. Matched dispatch status displays within the linked incident's workspace (F1) as a read-only panel/card, always carrying `Provenance` (source: CAD system name, timestamp) — never editable from EPMP.
4. If a user attempts to edit dispatch-status data from within EPMP, the system blocks the edit and explains that CAD/911 is authoritative for this record type (consistent with F10's record-authority enforcement).
5. Feed health (last poll/subscription event, error count) is surfaced in F8's Integration Health view, declaring CAD as authoritative for all dispatch-status record types.

### Inputs
- Adapter config: `vendor` (string, required), `endpoint_url`/`webhook_config` (required), `auth_credentials` (vendor-specific, required), `incident_matching_strategy` (enum: `shared_number`|`human_confirmed`, required).
- Dispatch event (post-normalization): `external_event_id`, `cad_incident_number`, `status`, `unit_ids`, `location`, `updated_at`, `source`.

### Outputs
- Read-only dispatch-status panel within the linked incident workspace (F1).
- Integration-health status entry (F8 S8.6) declaring CAD as authoritative for dispatch records.

### Validation
- No API endpoint in this feature accepts a write/update to dispatch-status data — the contract is read-only by design, enforced at the route level (no PATCH/PUT/DELETE routes exist for this resource).
- A dispatch event with no plausible incident match (neither shared number nor human-confirmed) remains unlinked and is not force-attached to an unrelated incident.
- Every displayed dispatch-status fact must carry its CAD-system source and timestamp via `Provenance`.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| CAD feed/webhook unreachable | 503 | CAD_FEED_UNREACHABLE | (Logged to integration health; incident workspace shows last-known dispatch status labeled with its age.) |
| Edit attempted on CAD-authoritative data | 403 | CAD_RECORD_READ_ONLY | "Dispatch status is maintained by [CAD system] and can't be edited here." |
| Dispatch event has no matching incident | 200 (unlinked) | CAD_EVENT_UNMATCHED | (Logged for review; not attached to any incident until matched.) |

### API Surface (this feature)
See `Y1d-api-integrations.md` §CAD/911 for `GET /api/v1/integrations/cad/dispatch-events`, `GET /api/v1/incidents/{id}/dispatch-status`, `GET /api/v1/integrations/cad/health`.

### Schema Surface (this feature)
Owns tables `cad_config`, `cad_dispatch_events` — see `Y0d-schema-integration-geo.md` §CAD/911. References `incidents` (F1) via the matching link, never writes to `incidents` fields it doesn't own.
## F16: HR / IAM & Identity Integration

**Description:** Identity, organization, role, qualification, and contact-record integration with an agency's HR/IAM systems — the external-identity half of Security & Administration (F8), recognizing that HR is often the authoritative source for personnel data. SSO/authentication is on the P0 critical path (shared with F8); roster/qualification sync is P1.

**Terminology:**
- **Personnel roster:** The read-synced list of agency personnel with role, qualification, and contact data, sourced from HR/IAM.
- **Qualification:** A credential or certification (e.g., ICS-100 certified) relevant to resource-request matching and command-role assignment eligibility.

### Sub-features
- SSO/SAML2/OIDC integration with the agency's identity provider for authentication (shared with F8).
- Read sync of personnel roster, role, qualification, and contact data, with HR treated as authoritative where designated.
- Role/qualification data flows into resource-request matching (F4) and command-role assignment (F1) as reference data.

### Approved Adapter Pattern
SSO/authentication uses the standard SAML2/OIDC protocol integration (specified in F8 S8.4; not re-specified here to avoid duplication). Roster/qualification sync uses one normalized adapter contract per HR/IAM system family (e.g., Workday, PeopleSoft, or agency-specific HRIS), read-only.

**Roster sync adapter contract (MVP depth):**
- **Poll request:** scheduled background job calls `GET {adapter}/personnel?since={timestamp}`.
- **Normalized response:** `{ person_id (external), name, email, role_titles: [...], qualifications: [...], contact_info, jurisdiction, source, as_of }`.
- Matching to an existing EPMP user record (if any) occurs by email address; unmatched records are retained as reference-only personnel (not full platform users) until/unless provisioned a login via SSO.

### Process
1. Authentication: handled via F8's SSO integration (SAML2/OIDC); this feature does not duplicate that flow, but consumes the same IdP connection for any identity-mapping needs specific to roster data.
2. A scheduled background job (F10) polls the configured HR/IAM system for personnel records modified since the last successful sync, via the roster adapter.
3. Normalized personnel records are matched to existing EPMP users by email; matched records update the user's role/qualification/contact reference data (never overwriting EPMP-specific settings like theme preference or RBAC role assignment, which remain EPMP-owned per F8).
4. Unmatched personnel records are retained as reference-only entries, available for selection in F1's command-role assignment (S1.4) and F4's resource-request owner/assignment fields, even if that person has never logged into EPMP.
5. Where an agency designates HR as authoritative for personnel records (per F10's record-authority registry), any conflicting local edit to qualification/contact data is flagged as a conflict rather than silently overwritten by the next sync — consistent with F13's conflict-handling pattern.
6. Feed health (last sync, record counts, errors) is surfaced in F8's Integration Health view.

### Inputs
- Roster sync config: `hris_vendor` (string, required), `endpoint_url`, `auth_credentials` (required).
- Personnel record (post-normalization): `external_person_id`, `name`, `email`, `role_titles`, `qualifications`, `contact_info`, `jurisdiction`, `source`, `as_of`.

### Outputs
- Personnel reference records consumable by F1 (command-role assignment) and F4 (resource-request owner/assignment).
- Matched/unmatched sync status surfaced in F8 Integration Health.

### Validation
- Roster sync must never overwrite EPMP-owned fields (RBAC role assignment, theme preference, audit history) — it updates only HR-sourced reference fields (name, email, qualifications, contact info, organizational role title).
- A conflicting local edit to an HR-authoritative field must be flagged, not silently overwritten on next sync, consistent with the platform's conflict-handling NFR.
- Unmatched personnel records must never be silently discarded — they remain available as reference-only entries.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| HRIS feed unreachable | 503 | HRIS_FEED_UNREACHABLE | (Logged to integration health; last-synced roster data remains available, labeled with its age.) |
| Conflicting local edit to HR-authoritative field | 200 (flagged) | HR_FIELD_CONFLICT | "[Field] was updated locally but [HRIS] is authoritative for this field. Review before the next sync." |
| Roster record missing required fields | 422 | HRIS_RECORD_INCOMPLETE | "[N] personnel records from [HRIS] were missing required fields and skipped this sync." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §SSO (shared with F8) and `Y1d-api-integrations.md` §HR/IAM for `GET /api/v1/integrations/hris/personnel`, `GET /api/v1/integrations/hris/health`.

### Schema Surface (this feature)
Owns table `personnel_roster` — see `Y0a-schema-auth-org.md` §HR/IAM Integration. Read by F1 (command-role assignment) and F4 (resource-request assignment) as reference data; does not replace `users` (F8), which remains the platform's own identity/RBAC table.
## F17: Asset, Facility & Document System Integration

**Description:** Read integration with asset/facility/ERP systems for site status, and permission-aware import/link/sync with document systems (SharePoint and similar) for plans, SOPs, annexes, and evidence — supporting F2 (facility positions) and F3 (plan repository) without EPMP duplicating these systems of record. Full asset/inventory/maintenance management is explicitly deferred.

**Terminology:**
- **Facility marker:** A map marker (square shape, per F2's symbology) representing a facility's read-synced status/location.
- **Document link:** A reference from an EPMP plan (F3) to an externally-stored document, either imported as a copy or linked live.

### Sub-features
- Read-only facility/asset status and location feed into the common operating picture (F2) as facility markers with provenance.
- Permission-aware import/link/sync of EOPs/SOPs/annexes/evidence documents from SharePoint or equivalent into the plan repository (F3), preserving source-system access permissions.
- No write-back of inventory, maintenance, or cost data (explicitly out of scope).

### Approved Adapter Pattern
Two separate adapter contracts: (1) a read-only facility/asset-status adapter per ERP/facility-management vendor family; (2) a permission-aware document adapter for SharePoint or equivalent document systems, reused by F3's import/link flow (S3.6).

**Facility/asset adapter contract (MVP depth):**
- **Poll request:** `GET {adapter}/facility-status?since={timestamp}`.
- **Normalized response:** `{ facility_id, name, location (GeoJSON point), status, source, as_of }` — no inventory, maintenance, or cost fields are requested or persisted in this MVP.

**Document adapter contract (MVP depth), shared with F3 S3.6:**
- **Browse request:** `GET {adapter}/documents?query={search}` — executed with the requesting user's own delegated credentials against the source system, so results never exceed what that user could already see in SharePoint.
- **Import request:** `POST {adapter}/documents/{id}/import` → returns document content/metadata for a point-in-time copy into F3's plan repository.
- **Link request:** `POST {adapter}/documents/{id}/link` → establishes a live reference; subsequent permission or content checks re-query the source system using the original importing user's delegated credentials (or re-validate on each access, per TechArch's chosen session model).

### Process
1. A scheduled background job (F10) polls the configured facility/asset system for status/location updates via the facility adapter, normalizing responses to include `source` and `as_of`.
2. Normalized facility data renders as facility markers (square shape, status-toned) on F2's operating picture, with `Provenance` attached; no inventory, maintenance, or cost fields are ever requested, stored, or displayed in this MVP.
3. When a planning user imports or links a document from a connected document system (F3 S3.6), the document adapter executes the browse/import/link request using that user's own delegated permissions — never a shared service account with broader access than the requesting user has.
4. For "Link live" documents, a periodic background check re-validates the source document's permissions and content; a permission downgrade at the source immediately restricts the EPMP-side link's visibility, and a content change is flagged to a named person for review rather than silently applied.
5. Feed/integration health for both the facility adapter and the document adapter is surfaced in F8's Integration Health view, declaring the source ERP/document system as authoritative for facility status and document content respectively.

### Inputs
- Facility adapter config: `erp_vendor` (string, required), `endpoint_url`, `auth_credentials` (required).
- Facility record (post-normalization): `facility_id`, `name`, `location`, `status`, `source`, `as_of`.
- Document import/link request: `document_external_id` (required), `mode` (enum: `import_copy`|`link_live`, required), `requesting_user_credentials` (delegated, required).

### Outputs
- Facility markers consumable by F2's operating picture.
- Imported/linked document content and metadata consumable by F3's plan repository.
- Integration-health status entries for both adapters in F8 S8.6.

### Validation
- The facility adapter must never request, store, or expose inventory, maintenance, or cost fields in this MVP — any such fields present in a vendor response are discarded at the adapter boundary, not merely hidden in the UI.
- Document browse/import/link operations must always execute under the requesting user's own delegated permissions; a user must never see or import a document in EPMP that they could not already access in the source system.
- A "Link live" document's permission state must be re-validated on a defined cadence (at minimum, before each render in F3's reading view) — stale permission caching that could expose a since-revoked document is not permitted.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Facility feed unreachable | 503 | FACILITY_FEED_UNREACHABLE | (Logged to integration health; last-known facility positions remain on the map, labeled with their age.) |
| Document import permission denied | 403 | IMPORT_PERMISSION_DENIED | "You don't have access to this document in the source system." |
| Linked document permission revoked at source | 403 | LINK_PERMISSION_REVOKED | "Access to this linked document was removed in [source system]. It's no longer visible here." |
| Document content changed at source (link live) | 200 (flagged) | LINKED_DOCUMENT_CHANGED | "This document changed in [source system]. Review before relying on the current EPMP copy." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Asset/Facility/Document Systems for `GET /api/v1/integrations/facilities/status`, `GET /api/v1/integrations/documents/browse`, `POST /api/v1/integrations/documents/{id}/import`, `POST /api/v1/integrations/documents/{id}/link`, `GET /api/v1/integrations/facilities/health`, `GET /api/v1/integrations/documents/health`.

### Schema Surface (this feature)
Owns tables `facility_feed_config`, `facilities`, `document_system_config`, `document_links` — see `Y0d-schema-integration-geo.md` §Asset/Facility/Document Integration. Feeds F2 (facility markers) and F3 (`plans` document linkage).
## F18: Persona & Role-Specific Dashboards

**Description:** Tailored views and default navigation for each of the five consolidated personas (PER-01 through PER-05, see `PERSONAS-EPMP.md`, mapping to the nine named roles in the PRD), ensuring each role sees the information and primary actions relevant to their job without being buried in capabilities meant for other roles. This feature is the RBAC-driven presentation layer that determines what every other feature's screens actually show a given user.

**Terminology:**
- **Default landing view:** The screen a user sees immediately after sign-in, role-dependent.
- **Role-scoped navigation:** The subset of `SideNav` groups/items (or bottom-bar destinations on mobile) visible to a given role, per F8's RBAC model.
- **Executive briefing:** The `display`-scale, decoration-free KPI view used for the executive facet of PER-05.

### Sub-features
- Role-scoped default dashboard/landing view for each persona.
- Role-based navigation and action visibility driven by F8's RBAC model.
- Executive-briefing view using `display`-scale numbers for 1–3 headline KPIs.
- Consistent terminology and status vocabulary across every role's view of the same underlying record.

### Screens

**S18.1 — PER-01 Landing (EOC Director / EMA Coordinator)**
- Default view: Dashboard page pattern (F2 S2.2) scoped to the user's full jurisdiction responsibility. `SideNav`: Prepare (Plans), Monitor (Operating Picture, Readiness), Activate (Incidents), Coordinate (Notifications), Improve (Reports). Primary actions surfaced: "Create incident," "Activate EOC," "Review plan approvals."

**S18.2 — PER-02 Landing (Incident Commander / PIO)**
- Default view: Incident Workspace (F1 S1.3) for the currently active/most-recent incident, or Incident List (F1 S1.1) if none is active. `SideNav`: Activate (Incidents), Coordinate (Tasks, Resources, Notifications), Monitor (Operating Picture). Primary actions: "New task," "Create resource request," "Compose notification."

**S18.3 — PER-03 Landing (Planning & Logistics Section Chief)**
- Default view: a combined "My work" dashboard: open tasks/resource requests assigned to the user's section, plus plans pending review. `SideNav`: Prepare (Plans), Coordinate (Tasks, Resources), Improve (Reports). Primary actions: "Generate SITREP," "Review resource requests," "Review plan."

**S18.4 — PER-04 Landing (Field Responder)**
- Default view: Field Home (F6 S6.1), mobile breakpoint, bottom-bar navigation only (Tasks, Report, Map, Profile — exactly 4 destinations). No desktop `SideNav` variant is offered to this role by default (field responders primarily operate the field-mobile surface), though the role may access desktop views at reduced scope if agency policy permits.

**S18.5 — PER-05 Landing (IT/SecOps Admin & Executive Sponsor)**
- Two sub-facets, same login, switchable via a toggle at the top of the landing view (not two separate accounts):
  - **Admin facet default:** F8 Admin Console shell (S8.1), landing on Platform Monitoring (S8.7).
  - **Executive facet default:** Executive-briefing dashboard: `display`-scale numbers for 1–3 headline KPIs only (e.g., readiness posture, open corrective actions, incident outcomes this period), each showing definition/period/source in `caption`, no other decoration, no charts beyond the headline numbers. "View full reporting" secondary link to F7 S7.5 Analytics Dashboard for drill-down.
- `SideNav` for admin facet: Users, Roles & Permissions, Audit Log, Integration Health, Platform Monitoring. `SideNav` for executive facet: Executive Dashboard, Reports (read-only F7 access).

### Process
1. On sign-in, F8 resolves the user's role (and, for PER-05, which facet(s) they hold) and F18 determines the default landing view and `SideNav`/bottom-bar configuration accordingly.
2. Every `SideNav` group and page-level primary action is filtered through the RBAC permission set from F8 — a user never sees a nav item or action their role doesn't permit, rather than seeing it disabled/grayed out.
3. For PER-05's dual facet, the user explicitly toggles between Admin and Executive views; the system does not guess which facet is intended, and each facet's `SideNav`/landing view is fully distinct.
4. Status vocabulary (incident severity/activation, task status, resource-request status) renders identically across every role's view of the same record — F18 does not introduce role-specific terminology variants; the underlying Badge/status components are shared across F1–F7's screens regardless of which persona's landing view surfaced them.
5. Mobile breakpoint behavior (bottom bar, 4 destinations) applies per-role: the 4 destinations shown differ by role (e.g., PER-04 sees Tasks/Report/Map/Profile; PER-02 on mobile might see Incidents/Tasks/Resources/Profile), always capped at exactly 4 per the design system's SideNav-to-bottom-bar collapse rule.

### Inputs
- `role_id` / `facet` (from F8 session resolution, required): determines landing view and nav configuration.
- `jurisdiction_scope` (from F8 RBAC, required): determines which records populate the landing dashboard.

### Outputs
- Role-scoped default landing view on sign-in.
- Role-scoped `SideNav` groups / bottom-bar destinations (exactly 4 on mobile).
- Executive-briefing KPI view for PER-05's executive facet.

### Validation
- Every role must map to exactly one default landing view and one `SideNav`/bottom-bar configuration — no role may be left with an undefined default (falls back to a generic dashboard with an explicit note to contact an admin, never a blank page).
- Mobile bottom-bar destinations must never exceed 4, regardless of role.
- The executive-briefing view must never show more than 3 headline numbers, and never show a chart or decorative element beyond the `display`-scale numbers and their definition/period/source captions.
- PER-05's facet toggle must be an explicit user action — the system must never auto-select a facet on the user's behalf.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Role with no mapped default view | 200 (fallback) | ROLE_VIEW_UNMAPPED | "Your role doesn't have a default view configured yet. Contact your administrator." |
| Executive KPI data unavailable | 503 | KPI_DATA_UNAVAILABLE | "Headline figures are temporarily unavailable. Retry." |
| Facet toggle attempted without both-facet permission | 403 | FACET_ACCESS_DENIED | "You don't have access to the [facet] view." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Persona Views for `GET /api/v1/me/landing-config`, `GET /api/v1/me/nav-config`.

### Schema Surface (this feature)
Reads `users.role_id`, `roles` (F8) to resolve landing/nav configuration — see `Y0a-schema-auth-org.md` §Security & Administration. No feature-owned tables beyond a `role_landing_config` reference table — see `Y0a-schema-auth-org.md` §Persona Views.
## Database Schema — Auth, Organization & Platform Core (Y0a)

Covers tables owned by F8 (Security & Administration), F10 (Platform API/Federation), F16 (HR/IAM reference data), and F18 (persona landing config). PostgreSQL + PostGIS. All tables carry `id UUID PK DEFAULT gen_random_uuid()`, `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`, `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` unless noted; append-only tables omit `updated_at`/`updated_by` by design.

### Security & Administration (F8)

```sql
CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'state'|'county'|'city'|'federal'|'critical_infrastructure'
  parent_jurisdiction_id UUID REFERENCES jurisdictions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE, -- e.g. 'eoc_director', 'incident_commander', 'field_responder'
  persona_id VARCHAR(10) NOT NULL, -- 'PER-01'..'PER-05'
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  feature VARCHAR(50) NOT NULL, -- e.g. 'incidents','tasks','resource_requests','notifications'
  actions TEXT[] NOT NULL, -- e.g. {'view','create','edit','approve'}
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  jurisdiction_scope UUID[] NOT NULL DEFAULT '{}', -- array of jurisdiction ids
  theme_preference VARCHAR(10) NOT NULL DEFAULT 'light', -- 'light'|'dark'|'contrast'
  status VARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active'|'Suspended'
  idp_subject VARCHAR(500), -- SSO subject identifier
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol VARCHAR(10) NOT NULL, -- 'SAML2'|'OIDC'
  idp_metadata_url TEXT,
  idp_metadata_xml TEXT,
  attribute_mapping JSONB NOT NULL, -- {email_attr, name_attr, group_attr}
  group_to_role_mapping JSONB NOT NULL, -- [{idp_group, role_id}]
  tested_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Append-only: no UPDATE/DELETE permitted at the application layer.
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL, -- 'login','permission_change','record_access','ai_draft_approval', etc.
  record_type VARCHAR(50),
  record_id UUID,
  detail JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE integration_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL, -- 'GIS','WebEOC','Everbridge','CAD', etc.
  last_sync_at TIMESTAMPTZ,
  direction VARCHAR(20) NOT NULL, -- 'inbound'|'outbound'|'bidirectional'
  record_authority VARCHAR(100) NOT NULL, -- which system owns the record type
  sync_status VARCHAR(20) NOT NULL DEFAULT 'online', -- 'online'|'syncing'|'offline'|'conflict'
  error_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Platform API, Federation & Event Bus (F10)

```sql
CREATE TABLE api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(200) NOT NULL,
  client_secret_hash TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_client_id UUID NOT NULL REFERENCES api_clients(id),
  callback_url TEXT NOT NULL,
  event_types TEXT[] NOT NULL,
  secret_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id),
  idempotency_key VARCHAR(200) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending'|'delivered'|'failed'
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, idempotency_key)
);

CREATE TABLE record_authority_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type VARCHAR(100) NOT NULL UNIQUE, -- 'incident','dispatch_status','personnel_roster', etc.
  authoritative_system VARCHAR(100) NOT NULL, -- 'EPMP' or named external system
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE federation_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  scope JSONB NOT NULL, -- {record_types: [...], incident_filters: {...}}
  granted_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'Active', -- 'Active'|'Revoked'
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL, -- 'notification_fanout','feed_ingestion','sync_reconciliation','report_generation'
  status VARCHAR(20) NOT NULL DEFAULT 'idle', -- 'idle'|'running'|'failed'|'backoff'
  last_run_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### HR/IAM Integration Reference Data (F16)

```sql
CREATE TABLE personnel_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_person_id VARCHAR(200) NOT NULL,
  matched_user_id UUID REFERENCES users(id), -- null if unmatched
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  role_titles TEXT[],
  qualifications TEXT[],
  contact_info JSONB,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  source VARCHAR(100) NOT NULL, -- HRIS system name
  as_of TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Persona Views Reference Config (F18)

```sql
CREATE TABLE role_landing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) UNIQUE,
  default_landing_route VARCHAR(200) NOT NULL,
  nav_groups JSONB NOT NULL, -- [{label, items: [{id,label,icon,href}]}]
  mobile_bottom_bar_items JSONB, -- max 4 items
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes (representative, non-exhaustive)

```sql
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_audit_log_actor_time ON audit_log(actor_id, occurred_at DESC);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(delivery_status, next_retry_at);
CREATE INDEX idx_personnel_roster_email ON personnel_roster(email);
CREATE INDEX idx_federation_grants_jurisdiction ON federation_grants(partner_jurisdiction_id, status);
```
## Database Schema — Incident Operations (Y0b)

Covers tables owned by F1 (Incident/ICS), F4 (Tasks & Resource Requests), and F6 (Mobile Field Operations). All tables carry `id UUID PK DEFAULT gen_random_uuid()`, `created_at`, `updated_at` unless noted; `incident_timeline` is append-only.

### Incident / ICS (F1)

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL, -- 'Flood','Wildfire','Severe Weather','HazMat','Public Health','Other'
  severity VARCHAR(20) NOT NULL, -- 'Critical'|'Elevated'|'Watch'|'Normal'
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  description TEXT,
  activation_level VARCHAR(20) NOT NULL DEFAULT 'Monitoring', -- 'Monitoring'|'Partial'|'Full'
  status VARCHAR(20) NOT NULL DEFAULT 'Open', -- 'Open'|'Closed'
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE incident_command_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  role_title VARCHAR(100) NOT NULL, -- 'Incident Commander','Planning','Logistics','Operations','Finance/Admin','Public Information'
  person_id UUID NOT NULL REFERENCES users(id), -- or personnel_roster.id via mapping
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  unassigned_at TIMESTAMPTZ
);

-- Append-only: no UPDATE/DELETE at application layer; corrections are new rows.
CREATE TABLE incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title VARCHAR(300) NOT NULL,
  meta TEXT, -- actor + source description
  tone VARCHAR(20) NOT NULL DEFAULT 'brand', -- 'brand'|'success'|'warning'|'danger'
  actor_id UUID REFERENCES users(id),
  source VARCHAR(100) NOT NULL, -- 'manual','ai_draft','eoc_cots_sync','field_report', etc.
  detail JSONB
);

CREATE TABLE ics_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  form_type VARCHAR(50) NOT NULL, -- 'ICS-201','ICS-202', etc.
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Approved'
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_ai_requires_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL))
);
```

### Tasks & Resources (F4)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Open', -- 'Open'|'In progress'|'Awaiting approval'|'Done'|'Overdue'
  owner_id UUID NOT NULL REFERENCES users(id),
  incident_id UUID REFERENCES incidents(id),
  plan_section_id UUID, -- FK to plan_sections (Y0c), nullable
  due_at TIMESTAMPTZ NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES users(id), -- null for system-driven Overdue transition
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL, -- 'Personnel'|'Equipment'|'Supplies'
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Awaiting approval'|'Approved'|'Fulfilled'|'Declined'
  incident_id UUID NOT NULL REFERENCES incidents(id),
  task_id UUID REFERENCES tasks(id),
  requesting_role VARCHAR(100) NOT NULL,
  needed_by TIMESTAMPTZ NOT NULL,
  requested_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  decline_reason TEXT,
  assigned_to VARCHAR(200),
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_decline_requires_reason CHECK (NOT (status = 'Declined' AND decline_reason IS NULL))
);

CREATE TABLE resource_request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_request_id UUID NOT NULL REFERENCES resource_requests(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Field Operations (F6)

```sql
CREATE TABLE field_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_report_id VARCHAR(100) NOT NULL UNIQUE, -- client-generated for idempotent sync
  incident_id UUID REFERENCES incidents(id),
  observation_type VARCHAR(100) NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_accuracy_m NUMERIC,
  submitted_by UUID NOT NULL REFERENCES users(id),
  captured_at TIMESTAMPTZ NOT NULL, -- client-side capture time, preserved
  synced_at TIMESTAMPTZ,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'synced', -- 'synced'|'conflict'|'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE field_report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_report_id UUID NOT NULL REFERENCES field_reports(id),
  storage_ref TEXT, -- object storage key once uploaded
  upload_status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending'|'uploaded'|'failed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL, -- 'field_report','task_status', etc.
  entity_id UUID NOT NULL,
  field_version JSONB NOT NULL,
  eoc_version JSONB NOT NULL,
  resolution VARCHAR(20), -- 'keep_mine'|'keep_eoc', null until resolved
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes (representative)

```sql
CREATE INDEX idx_incidents_jurisdiction_status ON incidents(jurisdiction_id, status);
CREATE INDEX idx_incident_timeline_incident_time ON incident_timeline(incident_id, occurred_at DESC);
CREATE INDEX idx_tasks_owner_status ON tasks(owner_id, status);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE status NOT IN ('Done');
CREATE INDEX idx_resource_requests_incident_status ON resource_requests(incident_id, status);
CREATE INDEX idx_field_reports_incident ON field_reports(incident_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(entity_type) WHERE resolution IS NULL;
```
## Database Schema — Plans, Notifications, Reporting & AI (Y0c)

Covers tables owned by F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage), and F14 (Notification Provider Integration).

### Plans & Playbooks (F3)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'EOP'|'SOP'|'Annex'
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Review'|'Approved'
  current_version INTEGER NOT NULL DEFAULT 1,
  source_document_ref TEXT, -- external document system reference, if imported
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL, -- immutable snapshot of sections at approval time
  submitted_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  review_action VARCHAR(20), -- 'approve'|'request_changes'
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version_number)
);

CREATE TABLE plan_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  heading VARCHAR(300) NOT NULL,
  body TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_section_id UUID NOT NULL REFERENCES plan_sections(id),
  default_title VARCHAR(200) NOT NULL,
  default_owner_role VARCHAR(100),
  default_due_offset_minutes INTEGER, -- offset from incident activation
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id),
  external_document_id VARCHAR(300) NOT NULL,
  source_system VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL, -- 'import_copy'|'link_live'
  imported_by UUID NOT NULL REFERENCES users(id),
  last_permission_check_at TIMESTAMPTZ,
  permission_status VARCHAR(20) NOT NULL DEFAULT 'valid', -- 'valid'|'revoked'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Notifications (F5)

```sql
CREATE TABLE recipient_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL, -- 'Role'|'Jurisdiction'|'Geography'
  selector JSONB NOT NULL, -- role_id, jurisdiction_id, or GeoJSON polygon
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  body TEXT NOT NULL, -- contains {{placeholder}} tokens
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  message_body TEXT NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  channels TEXT[] NOT NULL,
  recipient_group_ids UUID[] NOT NULL DEFAULT '{}',
  geotarget_polygon GEOGRAPHY(POLYGON, 4326),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_send_requires_approval CHECK (NOT (sent_at IS NOT NULL AND approved_by IS NULL))
);

CREATE TABLE notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  recipient_name VARCHAR(200),
  recipient_contact VARCHAR(300),
  channel VARCHAR(50) NOT NULL
);

CREATE TABLE notification_delivery_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_recipient_id UUID NOT NULL REFERENCES notification_recipients(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Queued', -- 'Queued'|'Sent'|'Delivered'|'Failed'|'Acknowledged'
  failure_reason TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Notification Provider Integration (F14)

```sql
CREATE TABLE notification_provider_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(100) NOT NULL, -- 'Everbridge','AtHoc', etc.
  channel_types TEXT[] NOT NULL,
  is_public_warning_channel BOOLEAN NOT NULL DEFAULT false,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_dispatch_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  provider_name VARCHAR(100) NOT NULL,
  external_message_id VARCHAR(300),
  dispatch_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  dispatched_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cap_alert_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  cap_identifier VARCHAR(300) NOT NULL,
  sender VARCHAR(300) NOT NULL,
  cap_xml TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Reporting & Learning (F7)

```sql
CREATE TABLE sitreps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Approved'
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE aars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) UNIQUE,
  timeline_export JSONB NOT NULL,
  decisions_log JSONB NOT NULL,
  resource_history JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft', -- 'Draft'|'Finalized'
  finalized_by UUID REFERENCES users(id),
  finalized_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE aar_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aar_id UUID NOT NULL REFERENCES aars(id),
  finding_text TEXT NOT NULL,
  category VARCHAR(100),
  corrective_action TEXT,
  owner_id UUID REFERENCES users(id),
  due_date DATE,
  closure_status VARCHAR(20) NOT NULL DEFAULT 'Open', -- 'Open'|'Closed'
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_corrective_action_owned CHECK (corrective_action IS NULL OR (owner_id IS NOT NULL AND due_date IS NOT NULL))
);
```

### AI Assistance (F9)

```sql
CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  confidence_label VARCHAR(10) NOT NULL, -- 'High'|'Medium'|'Low'
  confidence_reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'New', -- 'New'|'Dismissed'|'Promoted'
  dismissed_reason TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE signal_source_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES signals(id),
  hazard_feed_event_id UUID, -- FK to hazard_feed_events (Y0d)
  source VARCHAR(100) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE ai_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_feature VARCHAR(50) NOT NULL, -- 'ics_form','notification','sitrep','aar'
  target_field VARCHAR(100) NOT NULL,
  draft_text TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]', -- [{source, time, confidence}]
  confidence_label VARCHAR(10) NOT NULL, -- 'High'|'Medium'|'Low'
  requesting_user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(20), -- 'approve'|'edit'|'discard', null until resolved
  edited_text TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_approve_requires_named_user CHECK (action != 'approve' OR approved_by IS NOT NULL)
);
```

### Indexes (representative)

```sql
CREATE INDEX idx_plans_jurisdiction_status ON plans(jurisdiction_id, status);
CREATE INDEX idx_plan_sections_plan ON plan_sections(plan_id, sort_order);
CREATE INDEX idx_notifications_incident ON notifications(incident_id);
CREATE INDEX idx_notification_delivery_status_notif ON notification_delivery_status(notification_recipient_id, status);
CREATE INDEX idx_aar_findings_owner_open ON aar_findings(owner_id) WHERE closure_status = 'Open';
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_ai_drafts_unresolved ON ai_drafts(requesting_user_id) WHERE action IS NULL;
```
## Database Schema — Integration & Geospatial (Y0d)

Covers tables owned by F11 (GIS), F12 (Hazard Feeds), F13 (EOC COTS), F15 (CAD/911), and F17 (Asset/Facility/Document). PostGIS extension required for geography types.

### GIS Integration (F11)

```sql
CREATE TABLE gis_feed_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NOT NULL, -- 'Esri','OSM','agency_gis'
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status VARCHAR(20) NOT NULL DEFAULT 'ok', -- 'ok'|'error'|'timeout'
  can_publish BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```
*(Geospatial feature data itself is read-through/cached only — EPMP is not the system of record for GIS base-layer content; see F11.)*

### Hazard Feeds (F12)

```sql
CREATE TABLE hazard_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name VARCHAR(50) NOT NULL, -- 'NOAA'|'NWS'|'USGS'
  endpoint_url TEXT NOT NULL,
  poll_interval_seconds INTEGER NOT NULL DEFAULT 300,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE hazard_feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES hazard_feed_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  geometry GEOGRAPHY NOT NULL,
  confidence VARCHAR(10) NOT NULL, -- 'High'|'Medium'|'Low'
  source VARCHAR(100) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_id, external_event_id)
);

CREATE TABLE hazard_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_feed_event_id UUID NOT NULL REFERENCES hazard_feed_events(id),
  label VARCHAR(200) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### EOC COTS Interoperability (F13)

```sql
CREATE TABLE eoc_cots_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(50) NOT NULL, -- 'WebEOC'|'Veoci'|'DisasterLAN'
  endpoint_url TEXT NOT NULL,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL, -- 'incident'|'resource_request'|'status'|'activity_log'
  external_id VARCHAR(300),
  epmp_record_id UUID,
  direction VARCHAR(20) NOT NULL, -- 'inbound'|'outbound'
  sync_status VARCHAR(20) NOT NULL DEFAULT 'ok',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL,
  epmp_record_id UUID NOT NULL,
  epmp_value JSONB NOT NULL,
  external_value JSONB NOT NULL,
  resolution VARCHAR(20), -- 'keep_epmp'|'keep_external', null until resolved
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### CAD / 911 Integration (F15)

```sql
CREATE TABLE cad_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  incident_matching_strategy VARCHAR(20) NOT NULL DEFAULT 'human_confirmed', -- 'shared_number'|'human_confirmed'
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cad_dispatch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES cad_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  cad_incident_number VARCHAR(100),
  linked_incident_id UUID REFERENCES incidents(id),
  status VARCHAR(100) NOT NULL,
  unit_ids TEXT[],
  location GEOGRAPHY(POINT, 4326),
  source VARCHAR(100) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (config_id, external_event_id)
);
```

### Asset, Facility & Document Integration (F17)

```sql
CREATE TABLE facility_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_facility_id VARCHAR(300) NOT NULL,
  name VARCHAR(200) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status VARCHAR(50) NOT NULL,
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_facility_id, source)
);

CREATE TABLE document_system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL, -- 'SharePoint', etc.
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- document_links table defined in Y0c (owned conceptually by F3, populated via F17's adapter)
```

### Event Bus Supplementary (F10, cross-referenced from Y0a)

```sql
-- See Y0a-schema-auth-org.md for webhook_subscriptions, webhook_deliveries, background_jobs.
```

### Indexes (representative)

```sql
CREATE INDEX idx_hazard_feed_events_feed_time ON hazard_feed_events(feed_id, issued_at DESC);
CREATE INDEX idx_hazard_layers_unverified ON hazard_layers(verified) WHERE verified = false;
CREATE INDEX idx_eoc_cots_conflicts_unresolved ON eoc_cots_conflicts(config_id) WHERE resolution IS NULL;
CREATE INDEX idx_cad_dispatch_events_incident ON cad_dispatch_events(linked_incident_id);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_hazard_feed_events_geometry ON hazard_feed_events USING GIST(geometry);
```
## API Endpoints — Auth, Admin & Platform (Y1a)

All endpoints are versioned under `/api/v1`, JSON request/response, OAuth2/OIDC bearer-token authenticated unless noted. Covers F0 (session/theme), F8 (Security & Administration), F10 (API clients/federation), F16 (SSO), F18 (persona landing config).

### Session & Theme (F0)

**`GET /api/v1/me`**
Response: `{ id, email, name, role: {id, name, persona_id}, jurisdiction_scope: [UUID], theme_preference }`

**`PATCH /api/v1/me/preferences`**
Request: `{ theme_preference: "light"|"dark"|"contrast" }`
Response: `200 { theme_preference }` · Errors: `500 THEME_SAVE_FAILED`

**`GET /api/v1/search?q={query}`**
Response: `{ results: [{type, id, title, href}] }` grouped by record type, scoped by RBAC. Errors: `503 SEARCH_UNAVAILABLE`

### Persona Views (F18)

**`GET /api/v1/me/landing-config`**
Response: `{ default_route, nav_groups: [...], mobile_bottom_bar_items: [...] }` · Errors: `200 ROLE_VIEW_UNMAPPED` (fallback payload)

**`GET /api/v1/me/nav-config`**
Response: role-filtered nav groups, same shape as above.

### Security & Administration (F8)

**`POST /api/v1/auth/sso/callback`**
Request: SAML2 assertion or OIDC token per protocol. Response: `{ session_token, user: {...} }` · Errors: `401 SSO_AUTH_FAILED`

**`GET /api/v1/admin/sso-config`** / **`PATCH /api/v1/admin/sso-config`**
Request (PATCH): `{ protocol, idp_metadata_url|idp_metadata_xml, attribute_mapping, group_to_role_mapping }`
Response: `{ id, tested_at, active }` · Errors: `422 SSO_CONFIG_INVALID`

**`POST /api/v1/admin/sso-config/test`**
Tests connectivity without activating. Response: `{ success: boolean, details }`

**`GET /api/v1/admin/users`** (paginated, filterable by role/jurisdiction/status)
Response: `{ items: [{id, name, email, role, jurisdiction_scope, status, last_login_at}], total, page }`

**`POST /api/v1/admin/users`**
Request: `{ email, name, role_id, jurisdiction_scope }`

**`PATCH /api/v1/admin/users/{id}`**
Request: `{ role_id?, jurisdiction_scope?, status? }` · Errors: `409 ROLE_IN_USE` (on role deletion attempts elsewhere)

**`GET /api/v1/admin/roles`** / **`PATCH /api/v1/admin/roles/{id}`**
Request (PATCH): `{ permissions: [{feature, actions: [string]}] }`

**`GET /api/v1/admin/audit-log`** (filterable: date_range, actor_id, action_type, record_type; paginated)
Response: `{ items: [{id, actor, action, record_type, record_id, occurred_at, detail}], total }`
*(No PATCH/DELETE route exists for this resource by design — append-only.)*

**`GET /api/v1/admin/integration-health`**
Response: `{ items: [{system_name, last_sync_at, direction, record_authority, sync_status, error_count}] }`

**`GET /api/v1/admin/platform-health`**
Response: `{ uptime_pct, active_sessions, failed_login_rate, integration_error_rate, alerts: [{subsystem, message, since}] }`

### API Clients & Federation (F10)

**`GET /api/v1/admin/api-clients`** / **`POST /api/v1/admin/api-clients`**
Request (POST): `{ client_name, scopes: [string] }` → Response includes one-time `client_secret`.

**`POST /api/v1/admin/api-clients/{id}/revoke`**
Immediate effect, no caching window. Response: `204`

**`GET /api/v1/admin/record-authority`** / **`POST /api/v1/admin/record-authority`**
Request (POST): `{ record_type, authoritative_system, notes? }`

**`GET /api/v1/admin/federation-grants`** / **`POST /api/v1/admin/federation-grants`**
Request (POST): `{ partner_jurisdiction_id, scope: {record_types: [...], incident_filters: {...}}, expires_at? }`

**`POST /api/v1/admin/federation-grants/{id}/revoke`**
Immediate effect. Response: `204` · Errors (on subsequent access): `403 FEDERATION_ACCESS_DENIED`

### Webhook Subscriptions (F10, shared contract)

**`POST /api/v1/admin/webhook-subscriptions`**
Request: `{ callback_url, event_types: [string], secret }`
Delivery payload (to `callback_url`): `{ idempotency_key, event_type, payload, delivered_at }` — consumers must treat duplicate `idempotency_key` deliveries as no-ops.

### Common Response Envelope

All list endpoints return `{ items: [...], total: int, page: int, page_size: int }`. All error responses return `{ error_code, message, details? }` matching the HTTP status and code conventions in `Y2-errors.md`.
## API Endpoints — Incident Operations (Y1b)

Covers F1 (Incident/ICS), F2 (Common Operating Picture), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations).

### Incidents (F1)

**`GET /api/v1/incidents`** (paginated, filterable: severity, activation_level, jurisdiction, status)
Response: `{ items: [{id, name, type, severity, jurisdiction, activation_level, status, opened_at, commander}], total }`

**`POST /api/v1/incidents`**
Request: `{ name, type, severity, jurisdiction_id, description?, opened_at }`
Response: `201 { id, ...incident }` · Errors: `409 INCIDENT_POSSIBLE_DUPLICATE`

**`GET /api/v1/incidents/{id}`** / **`PATCH /api/v1/incidents/{id}`**
Errors: `404 INCIDENT_NOT_FOUND`

**`POST /api/v1/incidents/{id}/activation`**
Request: `{ activation_level: "Monitoring"|"Partial"|"Full", confirmed: true }`
Errors: `422 NO_COMMANDER_ASSIGNED`

**`POST /api/v1/incidents/{id}/command-roles`**
Request: `{ role_title, person_id }` · Errors: `500 TIMELINE_WRITE_FAILED`

**`GET /api/v1/incidents/{id}/timeline`** (append-only, newest-first) / **`POST /api/v1/incidents/{id}/timeline`** (system/internal use only — not a general-purpose write API; entries are created as side effects of other actions)

**`GET /api/v1/incidents/{id}/ics-forms`** / **`POST /api/v1/incidents/{id}/ics-forms`**
Request (POST): `{ form_type, content }`
**`POST /api/v1/incidents/{id}/ics-forms/{formId}/approve`**
Request: `{ approved_by }` · Errors: `403 APPROVAL_REQUIRES_NAMED_USER`

### Operating Picture (F2)

**`GET /api/v1/operating-picture/markers?bbox={...}&jurisdiction_scope={...}`**
Response: `{ markers: [{id, type, shape, tone, label, status, location}], status_bar: {as_of, base_layer_source} }`

**`GET /api/v1/operating-picture/layers`**
Response: `{ layers: [{id, label, source, as_of, verified, count, checked}] }`

**`GET /api/v1/dashboard/summary?jurisdiction_scope={...}`**
Response: `{ active_incidents, open_tasks, pending_resource_requests, notifications_pending_ack }`

### Tasks (F4)

**`GET /api/v1/tasks`** (filterable: owner, status, incident, due_window) / **`POST /api/v1/tasks`**
Request (POST): `{ title, description?, owner_id, due_at, incident_id?, plan_section_id? }`
Errors: `422 TASK_OWNER_REQUIRED`, `422 DUE_DATE_PAST`

**`PATCH /api/v1/tasks/{id}/status`**
Request: `{ new_status }` · Errors: `409 INVALID_STATUS_TRANSITION`, `404 RECORD_NOT_FOUND`

### Resource Requests (F4)

**`GET /api/v1/resource-requests`** (filterable: status, type, incident) / **`POST /api/v1/resource-requests`**
Request (POST): `{ resource_type, description, quantity, incident_id, needed_by, requesting_role }`

**`POST /api/v1/resource-requests/{id}/approve`**
**`POST /api/v1/resource-requests/{id}/decline`**
Request: `{ reason }` · Errors: `422 DECLINE_REASON_REQUIRED`

**`POST /api/v1/resource-requests/{id}/fulfill`**
Request: `{ assigned_to }`

### Field Reports (F6)

**`POST /api/v1/field-reports`** (idempotent via client-generated `report_id` = `client_report_id`)
Request: `{ client_report_id, incident_id?, observation_type, description?, location?, location_accuracy_m?, captured_at }`
Response: `201 { id, sync_status }` · Errors: `422 REPORT_EMPTY`, `507 QUEUE_STORAGE_FULL` (client-side guard)

**`POST /api/v1/field-reports/sync-batch`**
Request: `{ reports: [field_report payloads] }` — batch upload of queued offline items in creation order.
Response: `{ results: [{client_report_id, status: "synced"|"conflict"|"failed", conflict_id?}] }`

**`POST /api/v1/field-reports/{id}/photos`**
Multipart upload. Errors: `500 PHOTO_UPLOAD_FAILED` (does not block the rest of the report)

**`POST /api/v1/sync-conflicts/{id}/resolve`**
Request: `{ resolution: "keep_mine"|"keep_eoc" }`

**`PATCH /api/v1/tasks/{id}/status`** (shared with task status updates above; idempotent by `task_id` + client `captured_at`)

### Common Conventions
- All `incident_id` references validate against the requester's `jurisdiction_scope`; out-of-scope access returns `403 JURISDICTION_SCOPE_DENIED`.
- All list endpoints support `page`/`page_size` pagination per the common envelope (see `Y1a-api-auth-admin.md`).
## API Endpoints — Plans, Notifications, Reporting & AI (Y1c)

Covers F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage).

### Plans (F3)

**`GET /api/v1/plans`** (filterable: type, status, jurisdiction) / **`POST /api/v1/plans`**
Request (POST): `{ name, type, jurisdiction_id, content_sections: [{heading, body}] }`

**`GET /api/v1/plans/{id}`** / **`PATCH /api/v1/plans/{id}`**
Errors: `404 PLAN_NOT_FOUND`

**`POST /api/v1/plans/{id}/submit-review`**
Errors: `422 PLAN_EMPTY`

**`POST /api/v1/plans/{id}/review`**
Request: `{ review_action: "approve"|"request_changes", comments? }`
Errors: `403 SELF_APPROVAL_BLOCKED`

**`POST /api/v1/plans/{id}/sections/{sectionId}/link-tasks`**
Request: `{ task_template_ids: [UUID] }` or `{ new_template: {default_title, default_owner_role, default_due_offset_minutes} }`

**`POST /api/v1/plans/import`**
Request: `{ source_document_ref, mode: "import_copy"|"link_live" }`
Errors: `403 IMPORT_PERMISSION_DENIED`, `200 PLAN_SOURCE_CHANGED` (flagged on subsequent sync)

### Notifications (F5)

**`GET /api/v1/recipient-groups`** / **`POST /api/v1/recipient-groups`**
Request (POST): `{ name, type: "Role"|"Jurisdiction"|"Geography", selector }`

**`GET /api/v1/message-templates`** / **`POST /api/v1/message-templates`**
Request (POST): `{ name, category, body }`

**`POST /api/v1/notifications/compose`**
Request: `{ recipient_group_ids?, geotarget_polygon?, message_body, channels, incident_id? }`
Errors: `422 NO_AUDIENCE_SELECTED`, `422 MESSAGE_TOO_LONG`

**`POST /api/v1/notifications/{id}/send`**
Request: `{ approver_id, confirmed: true }`
Errors: `403 APPROVER_MISMATCH`, `400 AIDRAFT_NOT_APPROVED`, `503 CHANNEL_UNAVAILABLE`

**`GET /api/v1/notifications/{id}/delivery-status`**
Response: `{ recipients: [{name, channel, status, failure_reason?}], ack_percentage }`

### Reporting (F7)

**`POST /api/v1/incidents/{id}/sitreps`**
Request: `{ include_ai_draft?: boolean }` → Response: auto-assembled draft from Timeline/tasks/resource-requests.

**`POST /api/v1/incidents/{id}/aar`**
Request: `{ findings: [{text, category, corrective_action, owner_id, due_date}] }`
Errors: `409 INCIDENT_NOT_CLOSED`, `422 CORRECTIVE_ACTION_UNOWNED`

**`PATCH /api/v1/incidents/{id}/aar/{aarId}/finalize`**
Errors: `403 DOCUMENT_IMMUTABLE` (on any subsequent edit attempt)

**`GET /api/v1/evidence-log`** (filterable: date_range, actor_id, action_type, record_type)
**`GET /api/v1/evidence-log/export?format=csv|pdf`**
Errors: `500 EXPORT_FAILED`

**`GET /api/v1/analytics/kpis?date_range={...}&jurisdiction_scope={...}`**
Response: `{ kpis: [{name, value, definition, baseline, target?, owner, review_cadence, period, source}] }` — `target` omitted entirely (not zero/null-displayed) when undefined.
Errors: `504 ANALYTICS_TIMEOUT`

### AI Assistance (F9)

**`GET /api/v1/signals`** (filterable: status, confidence)
Response: `{ items: [{id, summary, confidence_label, confidence_reason, detected_at, status}] }`

**`POST /api/v1/signals/{id}/promote`**
Returns a pre-fill payload only — does NOT create an incident. Response: `{ prefill: {name_suggestion, type_suggestion, severity_suggestion, source_signal_id} }`
Errors: `400 PROMOTE_REQUIRES_HUMAN_SUBMIT` (if caller attempts to treat this as incident creation)

**`POST /api/v1/signals/{id}/dismiss`**
Request: `{ reason }`

**`POST /api/v1/ai-drafts`**
Request: `{ target_feature, target_field, context, requesting_user_id }`
Response: `{ id, draft_text, sources: [{source, time, confidence}], confidence_label }`
Errors: `503 AI_GATEWAY_UNAVAILABLE`, `200 AIDRAFT_NO_SOURCE` (flagged in response body)

**`POST /api/v1/ai-drafts/{id}/approve`**
Request: `{ approver_id, edited_text? }`
Errors: `403 APPROVAL_REQUIRES_NAMED_USER`

**`POST /api/v1/ai-drafts/{id}/discard`**

### Server-Side AI Governance Guard (applies across F1/F5/F7 write endpoints)
Every endpoint listed above that writes to an official record (`ics-forms`, `notifications/{id}/send`, `sitreps`, `aar`) rejects any payload tagged `ai_origin: true` lacking non-null `approved_by`/`approved_at` with `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` — enforced independent of UI client.
## API Endpoints — External Integrations (Y1d)

Covers F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F14 (Notification Providers), F15 (CAD/911), F16 (HR/IAM roster), F17 (Asset/Facility/Document). All integration endpoints follow the approved-adapter pattern described in each feature's chunk; this file specifies the normalized, vendor-neutral contract EPMP's own services expose/consume internally.

### GIS (F11)

**`GET /api/v1/integrations/gis/features?layer_id={...}&bbox={minx,miny,maxx,maxy}`**
Response: `{ layer_id, source, as_of, features: [GeoJSON Feature] }`
Errors: `504 GIS_FEED_TIMEOUT` (triggers F2 schematic fallback, not a hard error to the end user), `502 GIS_FEED_INVALID`

**`POST /api/v1/integrations/gis/publish`**
Request: `{ layer_id, features: [GeoJSON Feature], visibility: "agency-internal"|"public" }`
Errors: `400 GIS_PUBLISH_LAYER_NOT_ALLOWED`, `403 GIS_PUBLISH_DENIED`

**`GET /api/v1/integrations/gis/health`**

### Hazard Feeds (F12)

**`GET /api/v1/integrations/hazard-feeds/events?feed={noaa|usgs|...}&since={timestamp}`**
Response: `{ feed, events: [{id, type, severity, geometry, confidence, source, issued_at, expires_at}] }`

**`POST /api/v1/hazard-layers/{id}/verify`**
Request: `{ verified_by }` · Errors: `403 VERIFICATION_REQUIRES_NAMED_USER`

**`GET /api/v1/integrations/hazard-feeds/health`**

### EOC COTS (F13)

**`GET /api/v1/integrations/eoc-cots/exchange-records?type={incident|resource_request|status|activity_log}&since={timestamp}`**
Response: `{ external_id, type, payload, external_system, last_modified_external }`

**`POST /api/v1/integrations/eoc-cots/exchange-records`** (outbound sync)
Request: EPMP-side record, type-scoped to the four approved record types.
Errors: `400 EOC_RECORD_TYPE_UNSUPPORTED`, `502 EOC_OUTBOUND_REJECTED`, `401 EOC_ADAPTER_AUTH_FAILED`

**`GET /api/v1/integrations/eoc-cots/conflicts`**
**`POST /api/v1/integrations/eoc-cots/conflicts/{id}/resolve`**
Request: `{ resolution: "keep_epmp"|"keep_external", resolved_by }`

**`GET /api/v1/integrations/eoc-cots/health`**

### Notification Providers (F14)

**`POST /api/v1/integrations/notification-providers/send`**
Request: `{ notification_id, channel, recipients, message, approved_by, approved_at }` — rejects if `approved_by`/`approved_at` missing.
Errors: `400 SEND_REQUIRES_APPROVAL`, `503 PROVIDER_UNAVAILABLE`, `422 CAP_FIELDS_INCOMPLETE`, `403 CAP_AUTHORITY_DENIED`

**`POST /api/v1/integrations/notification-providers/callback`** (inbound webhook from provider)
Request: `{ external_message_id, recipient, status, timestamp }`
Response: `200` (or logged `CALLBACK_UNMATCHED` if no matching record)

**`GET /api/v1/integrations/notification-providers/health`**

### CAD / 911 (F15) — strictly read-only, no write routes exist

**`GET /api/v1/integrations/cad/dispatch-events?since={timestamp}`**
Response: `{ external_event_id, cad_incident_number, status, unit_ids, location, updated_at, source }`

**`GET /api/v1/incidents/{id}/dispatch-status`**
Response: read-only panel data with `Provenance` fields. Errors (if a PATCH is attempted on this route, which does not exist): `403 CAD_RECORD_READ_ONLY`

**`GET /api/v1/integrations/cad/health`**

### HR / IAM Roster (F16)

**`GET /api/v1/integrations/hris/personnel?since={timestamp}`**
Response: `{ external_person_id, name, email, role_titles, qualifications, contact_info, jurisdiction, source, as_of }`

**`GET /api/v1/integrations/hris/health`**
*(SSO/authentication endpoints are shared with F8 — see `Y1a-api-auth-admin.md` §Security & Administration, `POST /api/v1/auth/sso/callback`.)*

### Asset, Facility & Document Systems (F17)

**`GET /api/v1/integrations/facilities/status?since={timestamp}`**
Response: `{ facility_id, name, location, status, source, as_of }` — no inventory/maintenance/cost fields.

**`GET /api/v1/integrations/documents/browse?query={search}`**
Executed under the requesting user's delegated credentials; results never exceed source-system visibility.

**`POST /api/v1/integrations/documents/{id}/import`**
**`POST /api/v1/integrations/documents/{id}/link`**
Errors: `403 IMPORT_PERMISSION_DENIED`, `403 LINK_PERMISSION_REVOKED`, `200 LINKED_DOCUMENT_CHANGED` (flagged)

**`GET /api/v1/integrations/facilities/health`** / **`GET /api/v1/integrations/documents/health`**

### Shared Conventions Across All Integration Endpoints
- Every response payload carrying ingested external data must include `source` and an `as_of`/`issued_at`/`updated_at` timestamp (provenance enforcement, F10) — payloads missing these are rejected server-side before persistence, not merely flagged client-side.
- All integration health endpoints return the common shape: `{ system_name, last_sync_at, direction, record_authority, sync_status, error_count }`.
- Background polling jobs backing these endpoints are monitored via `GET /api/v1/admin/platform-health` and the background-jobs table (see `Y0a-schema-auth-org.md`).
## Y2: Cross-Feature Error Catalog

This catalog consolidates error scenarios that span more than one feature, or that represent platform-wide conventions. Feature-specific error tables live in each `F{nn}-*.md` chunk; this file is the authoritative reference for shared/cross-cutting error codes and the conventions all features must follow.

### Error Response Envelope (all endpoints)

```json
{
  "error_code": "STRING_CONSTANT",
  "message": "Human-readable, action-oriented message per content-and-voice.md",
  "details": { "optional": "structured context" }
}
```

- `message` must follow the design system's content rule: state the cause, then the fix. Never "something went wrong," never blame the user.
- HTTP status codes follow standard REST semantics: `400`/`422` client/validation errors, `401` authentication, `403` authorization/policy, `404` not found, `409` conflict/invalid state transition, `500`/`502`/`503`/`504` server/upstream errors, `507` storage exhaustion (client-side offline queue only).

### Cross-Feature Error Codes

| Scenario | HTTP Status | Error Code | Message | Originating Features |
|----------|-------------|------------|---------|----------------------|
| Session expired | 401 | SESSION_EXPIRED | "Your session has ended. Sign in again to continue." | F0, F8 |
| Role unresolved / no permissions mapped | 403 | ROLE_UNRESOLVED | "Your account isn't assigned a role yet. Contact your administrator." | F0, F8, F18 |
| Jurisdiction/federation scope denied | 403 | JURISDICTION_SCOPE_DENIED | "You don't have access to data for this jurisdiction." | F2, F10 |
| Federation grant expired/revoked | 403 | FEDERATION_ACCESS_DENIED | "Access to this data was revoked or has expired." | F10 |
| Record not found / no access | 404 | RECORD_NOT_FOUND | "This item no longer exists or you don't have access." | F1, F3, F4 |
| Timeline/audit write failed | 500 | TIMELINE_WRITE_FAILED | "This action didn't record to the incident timeline. Retry before continuing." | F1, F4 |
| Approval requires named person (non-AI context) | 403 | APPROVAL_REQUIRES_NAMED_USER | "Approval must be made by a signed-in person, not an automated process." | F1, F3, F9 |
| AI draft requires approval before use | 400 | AIDRAFT_NOT_APPROVED / AIDRAFT_UNAPPROVED_WRITE_BLOCKED | "This draft hasn't been approved. Approve it before it can be sent/saved." | F1, F5, F7, F9 |
| AI approval attempted by service/system account | 403 | APPROVAL_REQUIRES_NAMED_USER | "AI drafts must be approved by a signed-in person." | F9 |
| Record-authority conflict (external system owns record) | 409 | RECORD_AUTHORITY_CONFLICT | "[External system] owns this record. Changes must be made there, or flagged as a conflict for review." | F10, F13, F15, F16 |
| Sync conflict (field vs. EOC) | 409 | SYNC_CONFLICT | "This record differs from the current EOC record. Choose which version to keep." | F6, F13 |
| Edit attempted on an immutable/finalized record | 403 | DOCUMENT_IMMUTABLE / AUDIT_LOG_IMMUTABLE | "This record is finalized/immutable and can't be edited." | F7, F8 |
| Provenance missing on ingested data | 422 | PROVENANCE_REQUIRED | "This data is missing source, timestamp, or confidence and can't be accepted." | F10, F11, F12, F13, F15, F16, F17 |
| Upstream integration feed unavailable (graceful degrade) | 503/504 | *_FEED_UNAVAILABLE / *_FEED_TIMEOUT | "[System] is temporarily unavailable. [Fallback behavior description]." | F11, F12, F13, F14, F15, F16, F17 |
| Document/data import permission denied | 403 | IMPORT_PERMISSION_DENIED | "You don't have access to this document/data in the source system." | F3, F17 |
| Invalid status transition | 409 | INVALID_STATUS_TRANSITION | "This [task/request] can't move to [status] from its current state." | F4 |
| Export operation failed | 500 | EXPORT_FAILED | "This export didn't complete. Retry." | F7, F8 |
| Query timeout on large range | 504 | *_TIMEOUT | "This request is taking longer than expected. Narrow the range and retry." | F2, F7 |
| FedRAMP-claim guard (content/copy lint, not a runtime error) | n/a | FEDRAMP_CLAIM_BLOCKED | (Build-time/content-review check; no runtime HTTP response — any UI copy or API response text asserting FedRAMP authorization fails content review.) | All |

### Retry & Backoff Guidance (applies to all external integration features: F11–F17)

- All background polling/sync jobs use exponential backoff on failure (base interval → ×2 per consecutive failure, capped at a maximum interval defined in TechArch).
- Idempotency keys are required on all retried webhook/event-bus deliveries (F10); duplicate keys within the retry window are no-ops, not reprocessed, and never surfaced as a user-facing error.
- A feed/job in sustained backoff surfaces as `BACKGROUND_JOB_DEGRADED` (200, alert-level) in F8's Platform Monitoring (S8.7), not as a hard failure to end users interacting with already-cached data.

### Degraded/Offline-Mode Conventions (F2, F6)

- Loss of an external feed (GIS, hazard, CAD) never blocks the page: the last-known data remains visible, explicitly labeled with its age, and the relevant status indicator (`SyncStatus` or map status bar) reflects the degraded state.
- Field-mobile offline submissions never silently fail: every queued item resolves to `synced`, `conflict` (pending human resolution), or `failed` (flagged, retryable) — `QUEUE_STORAGE_FULL` (507) is the only scenario where new submissions are blocked client-side, and even then existing queued items remain intact pending reconnect.

### AI Governance Error Family (F9, enforced across F1/F5/F7)

These five codes form a closed family enforced at the API boundary, independent of which UI client calls the endpoint — no code path may bypass them:
`AIDRAFT_NO_SOURCE` (200, flagged in body) · `AIDRAFT_NOT_APPROVED` (400) · `AIDRAFT_UNAPPROVED_WRITE_BLOCKED` (400) · `APPROVAL_REQUIRES_NAMED_USER` (403) · `PROMOTE_REQUIRES_HUMAN_SUBMIT` (400, F9 signal-to-incident boundary only).
## Y3: External Integration Points

This chunk consolidates the external system dependencies and integration contracts introduced per-feature in F11–F17, summarizing the approved-adapter pattern, record-authority declarations, and the four non-negotiable integration behaviors (record authority, trusted provenance, controlled federation, graceful failure) as a single cross-reference. Per-feature detail (screens, process, validation, errors) lives in each feature's own chunk; this file is the systems-integration index.

### Integration Summary Table

| External System Family | Owning Feature | Direction | Record Authority (External System) | Record Authority (EPMP) | Adapter Pattern |
|---|---|---|---|---|---|
| GIS (Esri, OSM-derived, agency GIS) | F11 | Read (base layers/boundaries/facilities); optional publish (EPMP-authored layers) | Base map, boundaries, facility locations | Incidents, resource positions, hazard overlays (when published) | One normalized GeoJSON adapter per vendor; `source`/`as_of` on every response |
| NOAA / NWS / USGS hazard feeds | F12 | Read-only | All hazard-event data | None (EPMP never originates hazard facts) | One adapter per feed family (CAP-XML, GeoJSON); events persist `verified: false` by default |
| EOC COTS (WebEOC, Veoci, DisasterLAN) | F13 | Bidirectional, scoped to 4 record types | Varies per declared record type | Varies per declared record type | One adapter per vendor; 4 exchange-record types only (Incident, Resource Request, Status Update, Activity Log) |
| Everbridge / AtHoc / notification channels | F14 | Outbound send + inbound delivery callback | Delivery/acknowledgment receipts | Message content, audience, approval | One adapter per provider family; send endpoint requires `approved_by`/`approved_at` |
| FEMA IPAWS / OASIS CAP | F14 | Outbound, approval- and authority-gated | N/A (standards format, not a system of record) | CAP envelope content (post-approval) | CAP-formatting adapter layered on top of the notification-provider adapter |
| CAD / 911 / public safety dispatch | F15 | Read-only | All dispatch-status data | None (EPMP never edits dispatch data) | One adapter per CAD vendor; strictly read-only, no write routes exist |
| HR / IAM / personnel rosters | F16 | Read sync (roster) + SSO (auth, shared with F8) | Personnel role/qualification/contact data (where agency designates) | RBAC role assignment, theme preference, audit history (always EPMP-owned) | One adapter per HRIS vendor; SSO via standard SAML2/OIDC |
| Asset / facility / ERP systems | F17 | Read-only (status/location) | Facility status, location; all inventory/maintenance/cost (not touched) | None | One adapter per ERP vendor; inventory/maintenance/cost fields discarded at adapter boundary, never persisted |
| SharePoint / document systems | F17 (feeds F3) | Permission-aware import/link | Document content and permissions | Plan/SOP structure and linkage metadata | Document adapter reused by F3's import flow; executes under requesting user's delegated credentials |

### Four Non-Negotiable Integration Behaviors — Enforcement Points

1. **Record authority:** Declared per record type in the `record_authority_registry` table (F10, see `Y0a-schema-auth-org.md`), consulted by every write path in F13/F15/F16/F17 before applying an inbound or outbound change. Visible to admins in F8 S8.6 Integration Health.
2. **Trusted provenance:** Enforced at the API boundary (F10) — every ingested fact must carry `source`, `timestamp`/`as_of`, `version` (where applicable), and `confidence` before persistence; see `Y2-errors.md` §`PROVENANCE_REQUIRED`. Rendered to users via the `Provenance` component wherever the fact is displayed (F2's `LayerPanel`/`MapPopup`, F1's Timeline AI-sourced entries, F9's `AIDraft` panels).
3. **Controlled federation:** Policy-enforced via `federation_grants` (F10), each grant scoped to an explicit record-type/incident-filter set, revocable with immediate effect (no caching window). Managed in F10 S10.3.
4. **Graceful failure:** Every integration feature (F11–F17) specifies a queue/retry/reconcile behavior and a visible degraded-mode state (`SyncStatus`, map schematic fallback, "last-known data labeled with age") rather than a blocking failure — see each feature's Process section and `Y2-errors.md`'s "Retry & Backoff Guidance."

### Standards Alignment (per PRD §6 NFRs)

- **OpenAPI/REST/JSON:** all endpoints in `Y1a`–`Y1d`.
- **OAuth2/OIDC/SAML2:** F8 SSO (S8.4), F16 SSO (shared), F10 API-client auth.
- **Webhooks/event bus with idempotent retries:** F10 `webhook_subscriptions`/`webhook_deliveries`.
- **OASIS CAP:** F14's CAP-formatting adapter for IPAWS/public-warning channels.
- **OASIS EDXL (resource messaging):** reserved for F4/F13 resource-request exchange with partner agencies where a specific regulated use case requires it beyond this MVP's basic resource-request lifecycle — not committed in MVP scope beyond the approved-adapter pattern already specified.
- **NIEM data models:** reserved for cross-agency semantic exchange beyond this MVP's declared record types; not elaborated further here per the PRD's evidence boundary.
- **OGC services/GeoJSON/Esri REST:** F11's adapter contract.
- **STIX/TAXII, FHIR:** explicitly optional per PRD §6, only if a specific regulated use case requires them — no MVP feature requires them, so no contract is specified.

### Out-of-Scope Integration Depth (explicit, per PRD §10)

- No integration feature in this FRD specifies full bidirectional, field-complete sync with any named external system — each is scoped to an explicitly declared, approved-adapter record subset.
- No integration feature builds a parallel system of record for GIS, CAD, alerting, or infrastructure data — EPMP reads, displays, and (where explicitly permitted) publishes back to these systems, never replaces them.
- Inventory, maintenance, and cost data from asset/ERP systems (F17) is explicitly never requested, stored, or displayed in this MVP.
