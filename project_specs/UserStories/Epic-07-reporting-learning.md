## Epic 7: Reporting & Learning (F7)

ICS output, operational summaries, after-action reports, and evidence/audit logs — closing the preparedness loop.

### US-7.1: Generate a SITREP from current incident data
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** generate a situation report that auto-assembles current timeline, task, and resource-request data, **so that** I never start from a blank page when leadership needs an update.

**Acceptance Criteria:**
- [ ] SITREP generator auto-pulls current incident Timeline, task status, and resource-request status into a structured draft
- [ ] Narrative sections offer "Draft with AI" (`[AIDraft]` + `Provenance`), requiring named-person approval before finalizing
- [ ] Preview pane shows the assembled document before "Save as draft" or "Approve and finalize"
- [ ] SITREPs remain available throughout an incident's lifecycle (not gated on closure)
- [ ] Only Approved documents count as official record

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.2: Generate an after-action report once an incident closes
**As a** Priya Nandan / Planning & Logistics Section Chief, **I want to** generate an after-action report with auto-populated timeline, decisions, and resource history plus a structured findings list, **so that** lessons from the incident make it back into updated plans instead of being lost.

**Acceptance Criteria:**
- [ ] "Generate AAR" is only available once the incident status is `Closed` (409 INCIDENT_NOT_CLOSED otherwise)
- [ ] Steps 1–3 (timeline export, decisions log, resource-request history) are auto-populated and read-only/annotatable — nothing is manually re-entered
- [ ] Step 4 (findings & corrective actions) requires each entry to have a non-null owner and due date before finalization (422 CORRECTIVE_ACTION_UNOWNED otherwise)
- [ ] Finalizing the AAR writes it as an immutable, exportable record and triggers an evidence-log entry
- [ ] A finalized AAR cannot be edited directly — corrections require a new version or dated addendum (403 DOCUMENT_IMMUTABLE otherwise)

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.3: Review an exportable, append-only evidence and audit log
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** view and export a filterable, append-only log of timestamped actions across incidents, **so that** I can demonstrate preparedness and accountability without manually assembling evidence.

**Acceptance Criteria:**
- [ ] Evidence/audit log view shows Timestamp (monospace), Actor (`Avatar`), Action, Record type, and linked Record, filterable by date range, actor, and action/record type
- [ ] An "Export as CSV/PDF" action produces an export matching exactly the filtered view on screen
- [ ] No edit or delete control exists anywhere in this view, for any role, including F8 admins
- [ ] Export failures show a clear retry message (500 EXPORT_FAILED) rather than a silent failure

**Priority:** P0 | **Feature Ref:** F7

---

### US-7.4: Review KPI trends on an analytics dashboard
**As a** Dana Whitfield / IT/SecOps Admin & Executive Sponsor, **I want to** view a small set of KPI tiles and charts with defined baselines, targets, and sources, **so that** I can answer "are we more prepared than last quarter?" using evidence instead of a manually assembled report.

**Acceptance Criteria:**
- [ ] `Stat` row shows KPIs (e.g., median activation time, resource-request fulfillment time, corrective-action closure rate) each with a definition, period, and source
- [ ] Each chart (`LineChart`/`BarChart`/`DonutChart`) has a title, subtitle (unit/period/source), and a hidden data-table alternative
- [ ] A KPI tile never shows a numeric target unless that target has been explicitly configured with definition/baseline/owner/cadence — otherwise it shows only the current measured value
- [ ] AI-generated activity counts (e.g., "N drafts generated") are never presented as a business-outcome KPI
- [ ] A large date-range query that times out shows a clear retry/narrow-range message (504 ANALYTICS_TIMEOUT)

**Priority:** P0 | **Feature Ref:** F7
