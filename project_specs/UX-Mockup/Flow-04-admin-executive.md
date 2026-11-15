### Flow 8: Resolving an EOC-COTS Integration Conflict (JRN-05.1, Admin Facet)

**Trigger:** EPMP and WebEOC both record conflicting status updates for the same shelter facility.
**User Story:** US-8.4 (integration health), US-7.3 (audit trail), US-8.2 (RBAC review)

```
[Notice Alert — Admin Console → Integration Health view: alert
 flags a record conflict between EPMP and WebEOC]
    │
    ▼
[Investigate — Integration Health detail: both values shown side
 by side with their respective sources + declared record authority]
    │
    ▼
[Resolve — "Keep EPMP value" / "Keep [external] value" actions
 inline, never a silent overwrite]
    │
    ├── Resolution written back through the adapter if EPMP value
    │   kept; applied locally if external value kept
    │
    ▼
[Verify Audit Entry — Audit Log view: conflict + resolution shown
 with Dana's identity and timestamp]
    │
    ▼
[Review RBAC Scope — Roles & Permissions: checks which roles
 currently access the shelter facility's incident data]
    │
    └── Success ──▶ Record-authority declaration explicit, zero
        silent overwrites, every action captured in append-only
        audit trail
```

**Steps:**
1. Dana Whitfield (PER-05, admin facet) sees a `Badge`-flagged conflict row in the Integration Health `Table` (System, Last sync, Direction, Record authority, `SyncStatus`).
2. She opens the conflict detail, which shows both EPMP's and WebEOC's values side by side with their respective sources and the declared record-authority owner for that record type.
3. She clicks "Keep EPMP value" (or "Keep WebEOC value") — an explicit, deliberate action; the UI never silently overwrites either side.
4. She navigates to the Evidence & Audit Log View (shared pattern with F7 S7.4) to confirm the conflict and resolution are captured with her identity and timestamp, immutable and exportable.
5. While in the admin console, she reviews Roles & Permissions to confirm only the correct roles retain access to the shelter facility's incident data.

---

### Flow 9: Quarterly Executive Review of Readiness and Evidence (JRN-05.2, Executive Facet)

**Trigger:** Dana needs to answer "are we more prepared than last quarter?" ahead of a budget review.
**User Story:** US-7.4 (KPI trends dashboard), US-7.3 (evidence export)

```
[Open Dashboard — Executive Briefing Dashboard: display-scale
 numbers for 1-3 headline KPIs, no other decoration]
    │
    ▼
[Review KPIs — each Stat shows definition, period, source on hover
 or in caption; no invented targets]
    │
    ▼
[Drill Into Evidence — clicks through a KPI to Analytics & Reporting
 Dashboard, then to the underlying incident's AAR and closed
 corrective actions]
    │
    ▼
[Check Compliance Posture — confirms zero unresolved WCAG 2.2 AA /
 Section 508 findings; no FedRAMP claims anywhere in copy]
    │
    ▼
[Prepare Briefing — exports KPI summary + evidence links via
 "Export as CSV/PDF"]
    │
    └── Success ──▶ Leadership-ready packet with evidence links
        intact, built from platform evidence alone
```

**Steps:**
1. Dana (executive facet) signs in and lands directly on the Executive Briefing Dashboard — 1–3 `display`-scale KPI numbers only, no charts, no decoration.
2. She reviews each KPI's definition, baseline, period, and source shown in `caption` or on hover; a KPI never shows a numeric target unless one was explicitly configured — otherwise only the current measured value appears.
3. She clicks "View full reporting" to drill into the Analytics & Reporting Dashboard (F7 S7.5), then further into a specific incident's AAR and its closed corrective actions as traceable evidence.
4. She confirms the compliance posture (zero unresolved accessibility findings, no FedRAMP authorization claims anywhere in product copy).
5. She exports the KPI summary and evidence links as a single leadership-ready packet via "Export as CSV/PDF," with export failures (500 `EXPORT_FAILED`) showing a clear retry message rather than failing silently.
