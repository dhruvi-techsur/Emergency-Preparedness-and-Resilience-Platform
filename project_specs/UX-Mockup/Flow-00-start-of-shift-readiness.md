## User Flows

### Flow 1: Start-of-Shift Readiness & Activity Check (JRN-01.1)

**Trigger:** Maria Alvarez (PER-01) signs in at the start of her shift.
**User Story:** US-0.1 (role-scoped nav), US-2.4 (EOC dashboard), US-3.1 (plan repository)

```
[Sign-in via SSO]
    │
    ▼
[EOC / Executive Dashboard — role-scoped landing, PageHeader h1 "Dashboard"]
    │
    ├── Scans Stat tiles (Active incidents / Open tasks / Pending
    │   resource requests / Notifications pending ack) ──▶ all current,
    │   data-age visible on every tile
    │
    ▼
[Filters operating-picture map thumbnail by jurisdiction + severity Badge]
    │
    ├── Spots an Elevated/Critical marker ──▶ clicks map-thumbnail Card
    │   ──▶ Operating Picture (Map) full view, scoped to that jurisdiction
    │
    ▼
[Navigates to Plan Repository via SideNav → Prepare]
    │
    ├── Checks Status Badge column for overdue Review/Draft plans
    │
    ▼
[Returns to Dashboard, exports readiness summary]
    │
    └── Success ──▶ One-page readiness/activity summary exported
        (Reports/Export action) with timestamp + source per line,
        ready for 8am leadership call
```

**Steps:**
1. Maria signs in; SSO resolves her role (PER-01) and the shell renders the EOC Director `SideNav` plus the Dashboard page pattern as her default landing view (S18.1).
2. `PageHeader` ("Dashboard") + up to 4 `Stat` tiles show Active incidents, Open tasks, Pending resource requests, Notifications pending acknowledgment — each tile shows a data-age caption.
3. A 12-column grid of `Card`s shows the operating-picture map thumbnail (widest card) and a side `Card` with recent cross-incident `Timeline` entries plus a task-status summary.
4. Maria scans severity `Badge`s on the map thumbnail and incident list to triage visually; she clicks through to the full Operating Picture (`MapCanvas`) for any jurisdiction needing attention.
5. She navigates to Plan Repository (`/plans`) via `SideNav` → Prepare, scanning the Status `Badge` column (Draft/Review/Approved) for overdue approvals.
6. She returns to the Dashboard and triggers a one-click readiness-summary export (Reports/F7 pattern), which assembles current data with "as of HH:MM · source" on every line.

---

### Flow 2: Storm Activation Decision & Command Handoff (JRN-01.2)

**Trigger:** Maria is monitoring an approaching storm via the hazard overlay and must decide whether to activate.
**User Story:** US-1.1 (create/classify incident), US-1.2 (assign command roles), US-1.3 (activation level change), US-5.2 (notify), US-10.2 (federation grant — referenced for scoped sharing)

```
[Operating Picture — storm-track hazard overlay layer, LayerPanel
 shows source + "As of HH:MM" + Unverified flag if not yet validated]
    │
    ▼
[Decide: clicks "Create incident" from Incident List PageHeader]
    │
    ▼
[Create Incident form — name, type, severity, jurisdiction,
 description, opened-at]
    │
    ├── Possible-duplicate warning (409) ──▶ Alert shown, does not
    │   block creation
    │
    ▼
[Submit ──▶ Incident Workspace, status=Open, activation=Monitoring,
 first Timeline entry "Incident created" auto-written]
    │
    ▼
[Assign Command — Command Role Assignment Modal: assigns James
 Okafor as Incident Commander]
    │
    ├── Timeline entry: actor + timestamp, auto-captured
    │
    ▼
[Activation Level Change Modal (danger-tier escalation,
 Monitoring → Full)]
    │
    ├── Blocked (422 NO_COMMANDER_ASSIGNED) if no IC assigned yet
    │
    ▼
[Confirms "Escalate to Full" ──▶ Timeline entry + notification
 triggered to assigned roles]
    │
    ▼
[Notify — Compose Notification flow: audience → message → review
 → approve & send]
    │
    ▼
[Share Scoped Picture — Federation Grants: explicit, scoped,
 revocable grant to neighboring jurisdiction]
    │
    └── Success ──▶ Command structure stood up, neighboring
        jurisdiction sees only the granted data slice
```

**Steps:**
1. Maria monitors the storm-track hazard overlay layer on the Operating Picture; unverified feeds show the dashed "Unverified" `Provenance` treatment until validated.
2. She decides to activate and opens Create Incident (`/incidents/new`), completing name/type/severity/jurisdiction/description/opened-at fields; a possible-duplicate `Alert` may appear but never blocks submission.
3. On submit, the Incident Workspace opens immediately with status `Open`, activation `Monitoring`, and an auto-written first `Timeline` entry.
4. She assigns James Okafor as Incident Commander via the Command Role Assignment `Modal`, which writes a `Timeline` entry with actor and timestamp automatically.
5. She escalates activation level via the `Modal danger` confirmation, which is blocked with a clear 422 message if no Incident Commander is assigned; footer buttons name the explicit outcome ("Escalate to Full" / "Keep at Partial").
6. She sends an activation notification via the 4-step Compose Notification flow and tracks delivery/acknowledgment.
7. She grants a neighboring jurisdiction scoped, time-limited, revocable access via Federation Grants (F10 S10.3) for mutual-aid coordination.
