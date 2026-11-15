### Screen: SITREP Generator

**Purpose:** Never start from a blank page — auto-assemble current incident data into a reviewable situation report.
**User Stories:** US-7.1, JRN-03.1 (Draft SITREP, Finalize)

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Generate situation report"  status Badge "Draft" │
├───────────────────────────────────────────────────────────────┤
│ Auto-pulled sections (read-only, structured):                    │
│  h4 "Current timeline" — list of recent entries                   │
│  h4 "Task status" — summary counts by status                      │
│  h4 "Resource-request status" — summary counts by status          │
│                                                                     │
│ h4 "Narrative summary"                                             │
│  TextField multiline  [Draft with AI]                              │
│   ┌─ AIDraft panel: draft text + Provenance chips +                │
│   │  "Not issued" badge · [Discard][Edit][Approve]                 │
│   └──────────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────┤
│ h3 "Preview" — assembled document preview pane                     │
├───────────────────────────────────────────────────────────────┤
│  [Save as draft secondary]     [Approve and finalize primary]     │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Draft | Status `Badge` "Draft" (neutral) | Remains available throughout incident lifecycle, not gated on closure |
| AIDraft inserted | "Not issued" `Badge` persists until Approve | Low-confidence drafts state so in the body text |
| Finalized | Status `Badge` "Approved" (success) | Only Approved documents count as official record |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Narrative section only; `AIDraft` panel inserted below field |
| "Save as draft" | `Button secondary` | Preserves current state as `Draft` |
| "Approve and finalize" | `Button primary` | Requires named-person reviewer+timestamp; locks document as official record |

---

### Screen: AAR Generator

**Purpose:** Close the preparedness loop by turning incident activity into traceable, reusable learning.
**User Stories:** US-7.2, JRN-03.2 (Generate AAR through Publish & Export)

#### Layout

Page pattern: **Forms** (multi-step with `Progress`).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "After-action report: Riverbend flood response"   │
│  (only available once incident Closed)                            │
│ Progress "Step 4 of 5: Findings & corrective actions" ▓▓▓▓░       │
├───────────────────────────────────────────────────────────────┤
│ STEP 1 — Timeline export (auto-populated, read-only, exportable) │
│ STEP 2 — Decisions log (auto-populated, editable annotations)    │
│ STEP 3 — Resource-request history (auto-populated Table)         │
│                                                                     │
│ STEP 4 — Findings & corrective actions                             │
│  Card (per finding):                                                │
│   TextField "Finding text"                                          │
│   Select "Category"                                                 │
│   TextField "Corrective action"                                     │
│   Combobox "Owner" (required)                                       │
│   DatePicker "Due date" (required)                                  │
│   [+ Add finding]                                                    │
│  [Draft with AI] available on findings narrative                    │
│                                                                     │
│ STEP 5 — Review & finalize                                          │
├───────────────────────────────────────────────────────────────┤
│  [Back]                        [Finalize AAR primary]              │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "After-action report: [incident name]" | `PageHeader` |
| Primary | Current step content | Main body, `Progress` indicator above |
| Secondary (h4) | Step section headings (Timeline export, Decisions log, etc.) | Within each step |
| Secondary | Finding/corrective-action fields | Step 4 `Card` per finding |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Incident not closed | "Generate AAR" action is absent/disabled from Reports tab | 409 `INCIDENT_NOT_CLOSED` if attempted directly |
| Steps 1–3 | Read-only, annotatable, auto-populated — never manually re-entered | N/A |
| Unowned corrective action | `Alert danger`: "Assign an owner and due date to every corrective action before finalizing." (422 `CORRECTIVE_ACTION_UNOWNED`) | Blocks finalization |
| Finalized | Document becomes immutable, exportable | 403 `DOCUMENT_IMMUTABLE` if edit attempted post-finalization; corrections require a new version/addendum |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "+ Add finding" | `Button secondary` | Adds a new finding/corrective-action `Card` |
| "Draft with AI" (findings narrative) | `Button secondary` | `AIDraft` + `Provenance`, human-approved per F9 |
| "Finalize AAR" | `Button primary` | Writes immutable record + evidence-log entry |
| Link to plan section (per finding) | `Combobox` | Associates corrective action with the specific plan/SOP section (F3) it should update |

**Keyboard/focus:** Multi-step `Progress` announces current step; validation blocks advancing past Step 4 until every corrective action has owner+due date.
