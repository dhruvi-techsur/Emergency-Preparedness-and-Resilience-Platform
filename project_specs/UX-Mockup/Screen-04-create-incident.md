### Screen: Create Incident (form)

**Purpose:** Capture a new incident's classification so the team has a single authoritative record from the first moment of an event.
**User Stories:** US-1.1, JRN-01.2 (Decide/Activate)

#### Layout

Page pattern: **Forms**, single column, max 560px.

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "Create incident"       │
├───────────────────────────────────────┤
│ TextField  "Name" (required)           │
│ Select     "Type"                      │
│ Select     "Severity" (Critical/       │
│            Elevated/Watch/Normal)      │
│ Combobox   "Jurisdiction" (searchable) │
│ TextField multiline "Description"      │
│ DatePicker withTime zone "Opened at"   │
├───────────────────────────────────────┤
│  [Cancel ghost]      [Create incident  │
│                        primary]        │
└───────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Create incident" | `PageHeader` |
| Primary | Name, Type, Severity (required fields) | Top of form |
| Secondary | Jurisdiction, Description, Opened at | Remaining fields, `space-5` gaps |
| Tertiary | Cancel action | Footer, left of primary, `ghost` |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form, "Create incident" primary enabled | N/A |
| Validating | Inline field errors on blur | "Enter a date after..." style, cause-then-fix copy |
| Possible duplicate | `Alert warning` above form: "An incident named '[name]' was opened in the last 24 hours. Confirm this is a new incident." (409, non-blocking) | Does not block submission |
| Submit error | Focus moves to first invalid field; summary `Alert danger` above form | Names what's wrong, never clears entered data |
| Success | Redirects immediately to Incident Workspace | No toast needed (navigation is the confirmation) |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Create incident" | `Button primary` | Submits; on success routes to `/incidents/{id}` |
| "Cancel" | `Button ghost` | Returns to Incident List, discards entered data (confirmed via standard browser/SPA navigation guard if dirty) |
| Opened-at `DatePicker` | `withTime zone` | Always states time zone; never silently defaults a time |

**Keyboard/focus:** Labels always above fields; errors linked via `aria-describedby`; required fields marked with `required` attribute, not placeholder text. Validates on blur and on submit.
