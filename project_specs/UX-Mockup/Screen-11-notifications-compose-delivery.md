### Screen: Recipient Groups & Message Templates (List + Editor)

**User Stories:** US-5.1

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Notification groups"  actions: "New group"       │
├───────────────────────────────────────────────────────────────┤
│ Table: Group name (linked) │ Type (Role/Jurisdiction/Geography) │
│  │ Member count │ Last used                                      │
└───────────────────────────────────────────────────────────────┘
```
Editor: name, type `Select`, type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn on `MapCanvas`). Message Templates follows the same list pattern (Template name, Category, Last updated) with an editor offering a `TextField multiline` body with placeholder tokens (e.g., `{{incident_name}}`) and a character count.

---

### Screen: Compose Notification (4-step flow, required order)

**Purpose:** Guarantee nothing goes out that hasn't been deliberately reviewed and named-person approved.
**User Stories:** US-5.2, US-9.3, JRN-02.2 (full flow)

#### Layout

Page pattern: **Notifications and alerts**.

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Compose notification"                            │
│ Progress  "Step 1 of 4: Audience" ▓░░░                           │
├───────────────────────────────────────────────────────────────┤
│ STEP 1 — AUDIENCE                                                 │
│  Combobox (multi) "Recipient groups"                              │
│  — or — MapCanvas + LayerPanel: draw geotargeted area              │
│  caption: "Estimated recipients: 606" (live estimate)             │
│                                                                     │
│ STEP 2 — MESSAGE                                                   │
│  Select "Template" (optional) or TextField multiline "Message"    │
│   character count shown                                            │
│  [Draft with AI] (Button secondary)                                │
│   ┌─ AIDraft panel ──────────────────────────────────────────┐   │
│   │ "Not issued" Badge · draft text pulled from shelter        │   │
│   │ record · Provenance chips                                  │   │
│   │        [Discard] [Edit] [Approve primary]                  │   │
│   └────────────────────────────────────────────────────────┘   │
│                                                                     │
│ STEP 3 — REVIEW (fully read-only)                                  │
│  Final message text · Audience size · Channels · Approver          │
│   of record — nothing editable here                                │
│                                                                     │
│ STEP 4 — APPROVE AND SEND                                          │
│  "Approve and send" (primary)                                      │
│   ┌─ Modal danger (public/external-reach only) ───────────────┐  │
│   │ "Send to 606 recipients via SMS, Email, IPAWS?"             │  │
│   │ restates audience size + channels                            │  │
│   │          [Cancel]  [Send now danger primary]                 │  │
│   └────────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│  [Back]                                        [Continue primary] │
└───────────────────────────────────────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary (h1) | "Compose notification" | `PageHeader` |
| Primary | Current step content | Main form body, one step visible at a time |
| Secondary | `Progress` step indicator | Below `PageHeader` |
| Secondary | `AIDraft` panel (Step 2 only) | Below message field |
| Tertiary | Live recipient-count estimate | Step 1, below audience selector |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| No audience selected | Blocked from advancing past Step 1; `Alert danger`: "Select at least one recipient group or draw a geotargeted area." (422 `NO_AUDIENCE_SELECTED`) | Focus returns to audience selector |
| AI draft not yet approved | Message field remains empty/unchanged | 400 `AIDRAFT_NOT_APPROVED` if any API caller attempts to bypass |
| Review step | All fields rendered read-only, no inline edit controls | Must click "Back" to change anything |
| Approver mismatch | `Alert danger`: "You're not the designated approver for this channel. Route it to [approver name]." (403 `APPROVER_MISMATCH`) | Send blocked, server-enforced |
| Public/external send | `Modal danger` confirmation, cannot be bypassed | Restates audience size and channels verbatim |
| Channel unavailable at send | `Alert warning`: "[Channel] is temporarily unavailable. The message is queued and will retry." (503 `CHANNEL_UNAVAILABLE`) | Non-blocking for other channels |
| Message too long | `Alert danger`: "This message exceeds the [N]-character limit for [channel]. Shorten it." (422 `MESSAGE_TOO_LONG`) | Character count turns `danger-text` when over limit |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Draft with AI" | `Button secondary` | Inserts `AIDraft` panel; AI never auto-populates the message field |
| "Continue" | `Button primary` | Advances one step; disabled until current step's validation passes |
| "Approve and send" | `Button primary` (Step 4) | Requires signed-in user = designated approver; triggers `Modal danger` for public sends |

**Keyboard/focus:** Step navigation never skips validation; `Progress` announces current step via `aria-label`. The `MapCanvas` geotargeting draw tool has a keyboard-operable polygon-entry fallback (coordinates `TextField`) since freehand drawing is pointer-only.

---

### Screen: Delivery & Acknowledgment Tracking

**Purpose:** Confirm with certainty whether a sent message was actually delivered and acknowledged.
**User Stories:** US-5.3, JRN-02.2 (Track Delivery)

#### Layout

```
┌───────────────────────────────────────────────────────────────┐
│ PageHeader  h1 "Delivery: Shelter opening notice"                 │
├───────────────────────────────────────────────────────────────┤
│ Progress "68% acknowledged, 412 of 606" (tone=success)            │
├───────────────────────────────────────────────────────────────┤
│ Toolbar: filter by delivery state (Queued/Sent/Delivered/Failed)  │
├───────────────────────────────────────────────────────────────┤
│ Table: Name/Group │ Channel │ Status (Badge) │ Ack Progress bar   │
│  Riverbend Shelter list · SMS · Delivered (success) · ✓ 100%     │
│  County staff · Email · Failed (danger) · reason: "bounced"       │
└───────────────────────────────────────────────────────────────┘
```

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | `Table` auto-refreshes as F14 callbacks arrive | No manual reload required |
| Failed delivery | Status `Badge` "Failed" (danger) + visible reason text in row | Never a silent drop |
| Loading | `Skeleton` rows | None |
| Error (page-level) | `Alert danger` + Retry | Last-known delivery status stays visible, labeled with age |

**Keyboard/focus:** Filter `Select` by delivery state is a standard focusable control; `Table` rows are not independently navigable links (this is a status view, not a record list) but each row's reason text is screen-reader accessible inline.
