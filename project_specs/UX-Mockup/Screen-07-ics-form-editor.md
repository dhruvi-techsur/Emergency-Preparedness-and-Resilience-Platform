### Screen: ICS Form / Checklist Editor (with AIDraft + Provenance review)

**Purpose:** Let Priya complete structured ICS forms with optional AI-drafted narrative sections, always human-reviewed before becoming official.
**User Stories:** US-1.5, US-9.2, JRN-02.1 (Review AI-Drafted Narrative)

#### Layout

Page pattern: **Forms** (long-form, stepped).

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "ICS-201: Incident Briefing"  status Badge:     │
│   "Draft" (neutral)                                             │
├───────────────────────────────────────────────────────────────┤
│ Progress  "Step 2 of 4"  ▓▓▓▓▓▓░░░░   autosave: "Saved 08:41"  │
├───────────────────────────────────────────────────────────────┤
│ h4 "Situation summary"                                          │
│ TextField multiline "Narrative"                                 │
│  [Draft with AI]  (Button secondary)                             │
│                                                                   │
│  ┌─ AIDraft panel (inserted below field on click) ──────────┐  │
│  │ "Not issued" Badge (persists until Approve)               │  │
│  │ Draft text: "Flooding has affected 3 shelters as of       │  │
│  │  08:30. Resource requests pending for 2 generators..."     │  │
│  │ Provenance chips: [Incident Timeline · 08:30 · Verified]  │  │
│  │  [Resource Request #1182 · 07:55 · Verified]               │  │
│  │ note (if low confidence): "Low confidence: only one        │  │
│  │  source available"                                          │  │
│  │                [Discard]  [Edit]  [Approve primary]        │  │
│  └─────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│  [Cancel ghost]       [Back]   [Continue primary]               │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | Form name (e.g., "ICS-201: Incident Briefing") | `PageHeader` |
| Primary | Current step's 5–8 fields | Main form body |
| Secondary (h4) | Field group heading | Above each field group |
| Secondary | `AIDraft` panel (draft text, "Not issued" `Badge`) | Directly below the narrative field, never inside it |
| Tertiary | `Provenance` chips per source | Within the `AIDraft` panel |
| Tertiary (caption) | Autosave indicator "Saved HH:MM" | Top-right of `Progress` row |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default (Draft status) | Status `Badge` "Draft" (neutral), visually distinct from "Approved" | N/A |
| AIDraft requested | `AIDraft` panel appears with "Not issued" `Badge` | Badge persists until Approve is clicked |
| AIDraft low-confidence | Inline note in draft body itself: "Low confidence: only one source available" | Never hidden or silently upgraded |
| AIDraft approved | Text copied into the field; `AIDraft` panel collapses; `Timeline` entry logged with reviewer+time | Field now shows approved text, form remains "Draft" until the whole form is approved |
| AIDraft discarded | Panel removed; audit note only (no content retained) | No visible trace in the field |
| AI gateway unavailable | `Alert info`: "AI drafting is temporarily unavailable. You can still write this manually." (503 `AI_GATEWAY_UNAVAILABLE`) | Does not block manual completion |
| Approval blocked | `Alert danger`: "Approval must be made by a signed-in person, not an automated process." (403 `APPROVAL_REQUIRES_NAMED_USER`) | Form stays in `Draft` |
| Form fully approved | Status `Badge` changes to "Approved" (success), form becomes read-only | Confirmed via `Badge` change, no further edits possible |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Inserts `AIDraft` panel below the field; never auto-fills the field |
| "Approve" (in `AIDraft`) | `Button primary` | Copies draft text into field; logs reviewer+timestamp to `Timeline` |
| "Edit" (in `AIDraft`) | `Button secondary` | Opens draft text in an editable state before approving |
| "Discard" (in `AIDraft`) | `Button ghost` | Removes draft; audit note only |
| "Continue" | `Button primary` | Advances to next step; autosaves current step |

**Keyboard/focus:** `Progress` indicator is non-interactive (visual only, with `aria-label` stating step count). Every step validates on blur; submit-with-errors moves focus to the first error and shows a summary `Alert`.
