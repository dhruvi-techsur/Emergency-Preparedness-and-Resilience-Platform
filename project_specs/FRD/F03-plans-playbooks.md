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
