### Screen: Admin Console Shell / Users

**Purpose:** The IT/SecOps admin landing surface — user, role, and integration management, visible only to the Admin role.
**User Stories:** US-8.1, US-8.2, JRN-05.1 (Review RBAC Scope)

#### Layout

App shell with an admin-scoped `SideNav`.

```
┌───────────────────────────────────────────────────────────────┐
│ SideNav (admin): Users, Roles & permissions, SSO configuration,  │
│  Audit log, Integration health, Platform monitoring,              │
│  Record authority, Federation grants                               │
│ Header: facet toggle (Admin/Executive for PER-05) · SyncStatus ·  │
│  Avatar                                                            │
├───────────────────────────────────────────────────────────────┤
│ PageHeader  h1 "Users"  actions: "Invite user" (primary)          │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: search · filter (role, status)                           │
├───────────────────────────────────────────────────────────────┤
│ Card padded={false}                                                 │
│  Table: Name (Avatar) │ Email │ Role │ Jurisdiction scope │        │
│   Status (Badge: Active/Suspended) │ Last login                    │
└───────────────────────────────────────────────────────────────┘
```

User Detail (opened via row click): role assignment `Select`, jurisdiction-scope `Combobox` (multi), "Suspend access" (`Button danger`, requires `Modal` confirmation) / "Reactivate" actions.

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Users" | `PageHeader` |
| Primary | Name, Role, Status `Badge` | First `Table` columns |
| Secondary | Email, Jurisdiction scope, Last login | Remaining columns |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Populated `Table` | N/A |
| Suspend confirmation | `Modal danger`: "Suspend [name]'s access? This immediately invalidates their active sessions." | Footer: "Keep access" / "Suspend access" (danger primary) — never "Yes/No" |
| Suspended | Status `Badge` "Suspended" (danger) | Active sessions invalidated immediately, not at token expiry |
| Loading/Empty/Error | Standard per S0.3 | `Skeleton` / `EmptyState` / `Alert danger` + Retry |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Invite user" | `Button primary` | Opens invite form |
| Row click | Navigation | Opens User Detail |
| "Suspend access" | `Button danger` | Opens `Modal danger` confirmation |

---

### Screen: Roles & Permissions

**Purpose:** Configure RBAC down to the feature/action level and jurisdiction scope.
**User Stories:** US-8.2

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Roles & permissions"  actions: "New role"         │
├───────────────────────────────────────────────────────────────┤
│ Table of roles (linked) │ # users assigned │ Last modified        │
├───────────────────────────────────────────────────────────────┤
│ Role edit panel (opened per role):                                  │
│  Permission matrix (feature × action):                              │
│   "Incidents: create/view/edit/approve-activation"                  │
│   Checkbox groups per feature area                                   │
├───────────────────────────────────────────────────────────────┤
│ [Cancel ghost]           [Save changes primary]                    │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Permission change | Opens confirmation `Modal` before applying | Logged with before/after permission set, not just "permissions changed" |
| Role deletion attempted, in use | `Alert danger`: "Reassign all users before deleting this role." (409 `ROLE_IN_USE`) | Blocks deletion |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| `Checkbox` groups (per feature × action) | Permission toggle | Grouped under `fieldset`/`legend` per feature area |
| "Save changes" | `Button primary` | Opens confirmation `Modal` restating the before/after diff |

---

### Screen: SSO Configuration

**Purpose:** Configure and mandatorily test an SSO connection before it can go live — never lock out an agency with an untested config.
**User Stories:** US-8.5

#### Layout

Page pattern: **Forms**.

```
┌───────────────────────────────────────┐
│ PageHeader  h1 "SSO configuration"      │
├───────────────────────────────────────┤
│ TextField/file "IdP metadata URL or     │
│  XML upload"                            │
│ Select "Protocol" (SAML2/OIDC)          │
│ Attribute mapping table:                │
│  email_attr, name_attr, group_attr      │
│ Group → role mapping table               │
├───────────────────────────────────────┤
│  [Test connection secondary]             │
│  (must succeed before Save activates)    │
│  [Save configuration primary, disabled   │
│   until test passes]                     │
└───────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Untested | "Save configuration" disabled | Cannot activate as live config |
| Test passed | `Alert success`: "Connection test succeeded." "Save configuration" enabled | Clear unlock signal |
| Test failed | `Alert danger`: "Couldn't validate this identity provider configuration. Check the metadata URL and retry." (422 `SSO_CONFIG_INVALID`) | "Save configuration" remains disabled |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Test connection" | `Button secondary` | Must succeed before "Save configuration" activates |
| "Save configuration" | `Button primary` | Disabled until test passes; logs change to audit trail |
