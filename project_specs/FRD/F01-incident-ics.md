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
