## Epic 1: Incident / ICS (F1)

Incident intake, classification, command-role assignment, activity timeline, checklists, and ICS forms — the core activation and command workflow.

### US-1.1: Create and classify a new incident
**As a** Maria Alvarez / EOC Director, **I want to** create and classify a new incident with type, severity, and jurisdiction, **so that** my team has a single authoritative record to coordinate around from the first moment of an event.

**Acceptance Criteria:**
- [ ] Create-incident form captures name (required, 3–200 chars), type, severity (Critical/Elevated/Watch/Normal), jurisdiction, description (≤2000 chars), and opened-at timestamp
- [ ] On submit, the incident is created with status `Open` and activation level defaulting to `Monitoring`
- [ ] A first Timeline entry ("Incident created") is written automatically with actor and timestamp
- [ ] Submitting a name matching another incident opened in the same jurisdiction within 24 hours shows a possible-duplicate warning (409 INCIDENT_POSSIBLE_DUPLICATE) but does not block creation
- [ ] On submit error, focus moves to the first invalid field and a summary `Alert` appears above the form

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.2: Assign command roles with named-person accountability
**As a** James Okafor / Incident Commander, **I want to** assign ICS command roles (Incident Commander, Planning, Logistics, Operations, Finance/Admin, Public Information) to named people, **so that** every position in the command structure has clear, accountable ownership.

**Acceptance Criteria:**
- [ ] Role-assignment `Modal` lets me search personnel (from F16 roster where synced, else manual entry) and assign or reassign a role
- [ ] Current assignee is shown when reassigning a role
- [ ] Every assignment writes a Timeline entry with actor and timestamp
- [ ] At least one Incident Commander must be assigned before activation level can move above `Monitoring` (422 NO_COMMANDER_ASSIGNED otherwise)
- [ ] Pinned command-role panel on the Incident Workspace shows `Avatar` + role + name with a "Reassign" action per row

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.3: Change activation level with explicit consequence confirmation
**As a** James Okafor / Incident Commander, **I want to** change an incident's activation level (Monitoring/Partial/Full) through a confirmation that states the operational consequence, **so that** escalation decisions are deliberate and never accidental.

**Acceptance Criteria:**
- [ ] Escalating activation opens a `Modal danger` stating the decision and consequence (e.g., "This notifies all assigned command roles and opens full resource-request approval workflows")
- [ ] Modal footer buttons name the outcome explicitly (e.g., "Escalate to Full" / "Keep at Partial") — never generic "Yes/No"
- [ ] De-escalating activation uses a standard (non-danger) `Modal` confirmation
- [ ] The change writes a Timeline entry and triggers any configured notification (F5) to assigned roles
- [ ] Activation cannot move above `Monitoring` without at least one assigned Incident Commander

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.4: Monitor the incident via a single workspace
**As a** James Okafor / Incident Commander, **I want to** view timeline, tasks, resources, and reports for an incident in one workspace with a pinned command-role roster and map thumbnail, **so that** I can command the response without switching between disconnected tools.

**Acceptance Criteria:**
- [ ] `PageHeader` shows incident name, severity `Badge`, jurisdiction + opened date subtitle, and "Generate SITREP" / "New task" actions
- [ ] Tabs (Timeline, Tasks, Resources, Reports) appear in the same fixed order on every incident
- [ ] Timeline tab shows entries newest-first with time (24-hour, monospace), status-dot tone, title, and actor+source meta; AI-sourced entries are labeled as such
- [ ] Right-hand panel shows pinned command roles and a map-thumbnail panel linking to the full operating picture (F2) scoped to this incident
- [ ] Tasks and Resources tabs embed the respective F4 tables scoped to this incident

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.5: Complete ICS forms with AI-assisted drafting
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** complete structured ICS forms (e.g., ICS-201/202) with optional AI-drafted narrative sections that I review before approving, **so that** I produce official documentation faster without sacrificing accuracy or accountability.

**Acceptance Criteria:**
- [ ] Long ICS forms are split into steps of 5–8 fields with a `Progress` indicator and autosave ("Saved HH:MM")
- [ ] "Draft with AI" button on narrative fields inserts an `[AIDraft]` panel with `Provenance` sources below the field, never directly into the field
- [ ] Approving the draft copies the text into the field and logs reviewer + timestamp to the Timeline; Discard removes it with no trace beyond an audit note
- [ ] A form cannot transition to `Approved` without a recorded named-person reviewer and timestamp (403 APPROVAL_REQUIRES_NAMED_USER otherwise)
- [ ] Forms remain in `Draft` status, visually distinct from `Approved`, until explicitly approved

**Priority:** P0 | **Feature Ref:** F1

---

### US-1.6: Close an incident with explicit consequence
**As a** Maria Alvarez / EOC Director, **I want to** close an incident through a confirmation that states what will happen to open items, **so that** closure is a deliberate, informed action rather than an accidental status flip.

**Acceptance Criteria:**
- [ ] Closing an incident requires a `Modal` confirmation stating the consequence (e.g., "closes all open tasks to Overdue unless completed")
- [ ] Closure writes a Timeline entry with actor and timestamp
- [ ] Closure makes the "Generate AAR" action available in Reports (F7); AAR generation is blocked on any incident not yet `Closed`
- [ ] Every state-changing action on the incident (create, reassign, activation change, closure) writes exactly one Timeline entry with non-null actor and source

**Priority:** P0 | **Feature Ref:** F1
