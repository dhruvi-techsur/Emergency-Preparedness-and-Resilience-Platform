### Screen: Plan Repository (List)

**Purpose:** Let agencies substantiate preparedness on demand via a versioned, approvable plan/SOP repository.
**User Stories:** US-3.1, JRN-01.1 (Verify Plans)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Plans & playbooks"  actions: "Create plan"      │
│   (primary), "Import plan" (secondary)                          │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filters (type, status, jurisdiction)          │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                              │
│  Table: Name (linked) │ Type (EOP/SOP/Annex) │ Status (Badge:    │
│   Draft/Review/Approved) │ Version │ Jurisdiction │ Last updated │
│   │ Owner (Avatar)                                               │
└───────────────────────────────────────────────────────────────┘
```

#### States
Standard list states per S0.3: `Skeleton` rows while loading; `EmptyState` "No plans yet" + "Create plan" (first-use) vs. "No plans match" + "Clear filters" (filtered); `Alert danger` + Retry on error, last-known data labeled with age.

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create plan" | `Button primary` | Opens Plan Editor, new draft |
| "Import plan" | `Button secondary` | Opens Import from Document System modal (S3.6) |
| Row (Name) | Linked text | Navigates to Plan Detail / Reading View |

---

### Screen: Plan Detail / Reading View

**Purpose:** A focused, distraction-free reading experience with jump links and version history.
**User Stories:** US-3.4, US-3.1

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Riverbend County Flood Response EOP"            │
│   status Badge "Approved" (success) · version "v3" ·            │
│   actions: "Edit" (if permitted), "Import new version"          │
├──────────────────────┬────────────────────────────────────────┤
│ Sidebar (jump links): │ Content area, constrained to            │
│  §1 Purpose           │ reading-max (720px):                     │
│  §2 Roles             │   h2 "1. Purpose" ... body-lg text       │
│  §3 Activation        │   h2 "2. Roles" ... body-lg text         │
│  §4 Resources         │                                           │
│   linked tasks shown  │                                           │
│   per section         │                                           │
├──────────────────────┤                                           │
│ Version history       │                                           │
│  (collapsible):       │                                           │
│  v3 Approved (current)│                                           │
│  v2 "View this        │                                           │
│   version" (read-only)│                                           │
│  v1 "View this        │                                           │
│   version" (read-only)│                                           │
└──────────────────────┴────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | Plan name | `PageHeader` |
| Secondary | Status `Badge`, version number | `PageHeader` status slot |
| Secondary (h2) | Plan section headings | Content area, `reading-max` 720px |
| Tertiary | Linked tasks per section | Sidebar, beneath each jump link |
| Tertiary | Version history | Sidebar, collapsible, read-only |

#### States
Previous Approved versions are never deleted — "View this version" always available, read-only, non-destructive.

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Edit" | `Button secondary` | Navigates to Plan Editor (only if permitted) |
| Sidebar jump link | Anchor link | Scrolls content area to the section |
| "View this version" | `Button ghost` | Opens the historical version read-only |

**Keyboard/focus:** Content area max line length `reading-max` for legibility; jump links are a standard focusable list.

---

### Screen: Plan Editor

**Purpose:** Author/edit plan sections and link them to the operational tasks they generate.
**User Stories:** US-3.2, US-3.1

#### Layout

Page pattern: **Forms** (long-form).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Edit: Riverbend County Flood Response EOP"      │
├───────────────────────────────────────────────────────────────┤
│ h4 "1. Purpose"                                                  │
│ TextField multiline                                              │
│ [Link tasks] (Button secondary)                                 │
│                                                                   │
│ h4 "2. Roles"                                                    │
│ TextField multiline                                              │
│ [Link tasks]                                                     │
├───────────────────────────────────────────────────────────────┤
│ autosave: "Saved 08:41"                                          │
│  [Save as draft secondary]    [Submit for review primary]       │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Submit with zero sections | `Alert danger`: "Add at least one section before submitting this plan for review." (422 `PLAN_EMPTY`) | Blocks submission |
| Self-approval attempted | `Alert danger`: "You submitted this plan for review. Ask another reviewer to approve it." (403 `SELF_APPROVAL_BLOCKED`) | Shown on the Approval Workflow screen, not here |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Link tasks" (per section) | `Button secondary` | Opens Link Tasks to Plan Section `Modal` |
| "Save as draft" | `Button secondary` | Saves without changing status |
| "Submit for review" | `Button primary` | Moves status Draft → Review |

---

### Screen: Link Tasks to Plan Section (Modal)

**User Stories:** US-3.2

```
┌─────────────────────────────────────┐
│ Modal: "Link tasks to '2. Roles'"    │
├─────────────────────────────────────┤
│ List of existing task templates      │
│ (multi-select Checkbox) or           │
│ "+ Define new template" (name,       │
│ default owner role, due offset)      │
├─────────────────────────────────────┤
│       [Cancel]   [Link tasks primary]│
└─────────────────────────────────────┘
```
Multiple task templates may be associated with one section; when an incident activates and references the plan, linked templates are offered as one-click task creation (F4) rather than requiring tasks written from scratch.
