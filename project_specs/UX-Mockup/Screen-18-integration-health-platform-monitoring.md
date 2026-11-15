### Screen: Integration Health

**Purpose:** Surface record authority, sync status, and conflicts per external system — never a silent overwrite.
**User Stories:** US-8.4, US-10.1, JRN-05.1 (Notice Alert, Investigate, Resolve)

#### Layout

Page pattern: **Interoperability and integration health**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Integration health"                               │
├───────────────────────────────────────────────────────────────┤
│ Table: System │ Last sync │ Direction (in/out/bidirectional) │    │
│  Record authority │ SyncStatus                                     │
│  WebEOC │ 08:40 │ Bidirectional │ WebEOC (dispatch) │ ● syncing    │
│  Agency GIS │ 08:42 │ In │ Agency GIS │ ● online                   │
│  Everbridge │ 08:35 │ Out │ EPMP │ ● online                        │
├───────────────────────────────────────────────────────────────┤
│ Conflict row (expanded):                                            │
│  "Shelter status: EPMP says 'Open', WebEOC says 'Full'"             │
│  Both values shown side by side with sources                         │
│  [Keep EPMP value]  [Keep WebEOC value]                              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Integration health" | `PageHeader` |
| Primary | System, `SyncStatus` | First/last `Table` columns |
| Secondary | Last sync, Direction, Record authority | Middle columns |
| Primary (conflict rows) | Both values side by side + resolution actions | Expanded conflict row |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Healthy | `SyncStatus` state=`online` or `syncing`, icon+word+color | N/A |
| Conflict | `SyncStatus` state=`conflict`; row expands to show both values | Resolution actions inline: "Keep EPMP value" / "Keep [external] value" — never a silent overwrite |
| Feed unreachable | `Badge`/`SyncStatus` "offline" with error reason | Logged to integration health, last-known data labeled with age |
| Adapter auth failed | `Alert danger`: "Connection to [vendor] failed. Check the integration credentials." (401 `EOC_ADAPTER_AUTH_FAILED`) | Retry/reconfigure action |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Keep EPMP value" | `Button secondary` | Commits EPMP's value; written back through the adapter |
| "Keep [external] value" | `Button secondary` | Commits the external system's value locally |

**Keyboard/focus:** Conflict resolution requires an explicit named-person choice; the action buttons carry equal visual weight (no pre-selected "safe" default for a consequential choice).

---

### Screen: Platform Monitoring

**Purpose:** Catch and respond to degraded platform conditions before users are significantly impacted.
**User Stories:** US-8.4

#### Layout

Page pattern: **Dashboard** (admin variant).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Platform monitoring"                               │
├───────────────────────────────────────────────────────────────┤
│ Stat row: Uptime │ Active sessions │ Failed-login rate │           │
│  Integration-error rate                                             │
├───────────────────────────────────────────────────────────────┤
│ Alert danger (persistent, if active): "Notification fan-out is     │
│  degraded. 42 users affected. Investigating."                       │
├───────────────────────────────────────────────────────────────┤
│ Card "Availability trend"                                            │
│  LineChart (thresholds dashed/labelled)                               │
│                                                                         │
│ Card "Background job monitor" (F10 S10.4)                             │
│  Table: Job type │ Status │ Last run │ Failure count │ Next retry     │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Healthy | No persistent `Alert`; `Stat` row shows normal values | N/A |
| Degraded | Persistent `Alert danger` at top of content area, remains until resolved | 200 (alert) `PLATFORM_HEALTH_DEGRADED`: "[Subsystem] is degraded. [N] users affected. Investigating." |
| Job failure threshold exceeded | Row in Background Job Monitor flagged | 200 (alert) `BACKGROUND_JOB_DEGRADED`: "[Job type] has failed [N] times and is in backoff. Last error: [reason]." |

**Note:** No screen in the admin console, including this one, claims FedRAMP authorization in any copy.

---

### Screen: Record Authority Registry

**User Stories:** US-10.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Record authority registry"                        │
├───────────────────────────────────────────────────────────────┤
│ Table: Record type │ Authoritative system │ Notes                  │
│  Incident │ EPMP │ —                                                │
│  Dispatch status │ CAD/911 system │ Read-only, never edited          │
│  Personnel roster │ HR/IAM system │ Reference data only              │
└───────────────────────────────────────────────────────────────┘
```
Read-mostly reference configuration; changes require admin role and are audited. An undeclared record type is never synced by any integration feature.

---

### Screen: Federation Grants

**User Stories:** US-10.2, JRN-01.2 (Share Scoped Picture)

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Federation grants"  actions: "Grant access"       │
├───────────────────────────────────────────────────────────────┤
│ Table: Partner jurisdiction │ Scope granted │ Granted by │         │
│  Expires │ Status (Badge: Active/Revoked)                           │
├───────────────────────────────────────────────────────────────┤
│ Grant form (modal): partner Combobox, scope Checkbox list           │
│  (explicit, enumerated — no "all data" option), expiry DatePicker    │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Active grant | Status `Badge` "Active" (success) | Scope explicitly enumerated, never implicit "all data" |
| Revoked | Status `Badge` "Revoked" (neutral) | Takes effect within the same request cycle — no caching window |
| Expired/revoked access denied | `Alert danger`: "Access to this data was revoked or has expired." (403 `FEDERATION_ACCESS_DENIED`) | Shown to the partner jurisdiction attempting access |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Grant access" | `Button primary` | Opens grant form `Modal` |
| "Revoke" (per row) | `Button danger` | Immediate effect, `Modal` confirmation |
