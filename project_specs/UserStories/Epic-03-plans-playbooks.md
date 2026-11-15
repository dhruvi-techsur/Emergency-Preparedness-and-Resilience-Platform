## Epic 3: Plans & Playbooks (F3)

A plan repository with SOPs, versioning, and approvals, with linkage from plan sections to the operational tasks they generate.

### US-3.1: Maintain a versioned, approvable plan repository
**As a** Maria Alvarez / EOC Director, **I want to** maintain plans and SOPs in a repository with version history and a draft → review → approved workflow, **so that** my agency can substantiate its preparedness on demand instead of relying on scattered documents.

**Acceptance Criteria:**
- [ ] Plan list shows Name, Type (EOP/SOP/Annex), Status (`Badge`: Draft/Review/Approved), Version, Jurisdiction, Last updated, and Owner
- [ ] A plan cannot move to `Approved` without passing through `Review` first — no direct Draft → Approved transition
- [ ] The reviewer approving a plan must be a different named person than the most recent editor (no self-approval), unless an explicit logged exception applies (403 SELF_APPROVAL_BLOCKED otherwise)
- [ ] Approving a plan increments its version, transitions status to `Approved`, and writes an audit-log entry with reviewer and timestamp
- [ ] Previous Approved versions remain accessible read-only in version history and are never deleted

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.2: Link plan sections to the tasks they generate
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** link a plan or SOP section directly to the operational tasks it should generate, **so that** written readiness and executed response are no longer disconnected.

**Acceptance Criteria:**
- [ ] A "Link tasks" action on each plan section opens a modal to select existing task templates or define a new one (name, default owner role, default due offset)
- [ ] Multiple task templates can be associated with one plan section
- [ ] When an incident activates and references a plan, linked task templates are offered as one-click task creation rather than requiring tasks to be written from scratch
- [ ] A plan must have at least one section before it can be submitted for review (422 PLAN_EMPTY otherwise)

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.3: Import plans from an existing document system
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** import or link EOPs/SOPs/annexes from our existing SharePoint library into the plan repository, **so that** I don't have to recreate readiness documents we already maintain elsewhere.

**Acceptance Criteria:**
- [ ] Import flow lets me browse/search the connected document library scoped to my own existing permissions and choose "Import copy" or "Link live" sync mode
- [ ] A document I couldn't see in the source system is never visible to me in this import flow (403 IMPORT_PERMISSION_DENIED when attempted)
- [ ] "Link live" documents are periodically re-checked for source changes; changes are flagged to a named person for review, never auto-applied (200 flagged PLAN_SOURCE_CHANGED)
- [ ] A permission downgrade at the source system immediately restricts EPMP-side visibility of a linked document

**Priority:** P0 | **Feature Ref:** F3

---

### US-3.4: Read plans in a focused, distraction-free view
**As a** James Okafor / Incident Commander, **I want to** read an approved plan's content in a clean, line-length-constrained reading view with jump links to sections, **so that** I can quickly find the guidance I need during an incident without visual strain.

**Acceptance Criteria:**
- [ ] Plan content area is constrained to `reading-max` (720px) for the plan text
- [ ] Sidebar lists plan sections as jump links and shows linked tasks per section
- [ ] Version history is shown as a collapsible, read-only list with "View this version" per entry
- [ ] Plan detail header shows plan name, status `Badge`, and version number

**Priority:** P0 | **Feature Ref:** F3
