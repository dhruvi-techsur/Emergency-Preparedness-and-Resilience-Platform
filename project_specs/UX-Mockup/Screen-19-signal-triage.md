### Screen: Signal Triage Queue

**Purpose:** Let Maria/Priya validate AI-surfaced candidate signals before they ever become incidents — never auto-promoted under any configuration.
**User Stories:** US-9.1, JRN-01.2 (Monitor, context for activation decisions)

#### Layout

Page pattern: **Lists and tables**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Signal triage queue"                               │
├───────────────────────────────────────────────────────────────┤
│ Table: Signal summary (linked) │ Source feed(s) │ Confidence       │
│  (qualitative text: "High — 3 corroborating NOAA/NWS feeds") │      │
│  Detected at │ Status (Badge: New/Dismissed/Promoted)               │
├───────────────────────────────────────────────────────────────┤
│  Row actions: "Review" → opens Signal Detail                        │
│   "Promote to incident" (opens F1 Create Incident, pre-filled —     │
│   never creates an incident directly)                                │
│   "Dismiss" (opens Modal requiring one-line reason)                  │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Signal triage queue" | `PageHeader` |
| Primary | Signal summary, Confidence (qualitative + reason) | First `Table` columns |
| Secondary | Source feed(s), Detected at, Status `Badge` | Remaining columns |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| New | Status `Badge` "New" (info) | Awaiting human review |
| Dismissed | Status `Badge` "Dismissed" (neutral) | Reason recorded, visible on hover/detail |
| Promoted | Status `Badge` "Promoted" (success) | Links to the resulting incident once created |
| Dismiss without reason | `Modal` requires non-empty reason `TextField` | Cannot submit empty |
| Confidence | Always qualitative text + stated reason | Never a bare percentage, per content rule |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Promote to incident" | `Button secondary` | Pre-fills F1's Create Incident form only; 400 `PROMOTE_REQUIRES_HUMAN_SUBMIT` if an API caller attempts to bypass human submission |
| "Dismiss" | `Button ghost` | Opens `Modal` requiring one-line reason |
| Row (Signal summary) | Linked text | Navigates to Signal Detail |

**Governance note:** Under no configuration is a signal auto-promoted to an active incident — this is enforced at both the UI and API layers.

---

### Screen: Signal Detail

**User Stories:** US-9.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Signal: Coastal flood watch cluster"               │
│  actions: "Promote to incident" (secondary) · "Dismiss" (ghost)   │
├───────────────────────────────────────────────────────────────┤
│ h3 "Clustered source events"                                        │
│  Provenance chip per event:                                          │
│   [NOAA/NWS · 06:45 · Verified]                                      │
│   [USGS stream gauge · 07:02 · Unverified — dashed outline]          │
└───────────────────────────────────────────────────────────────┘
```

No action on this screen writes an operational record directly — "Promote to incident" only pre-fills the incident-creation form for a human to review, edit, and submit.
