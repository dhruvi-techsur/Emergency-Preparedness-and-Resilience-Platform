## F5: Notifications Integration

**Description:** Recipient groups, message templates, geotargeting, provider integration, and delivery/acknowledgment tracking — making communications accountable rather than best-effort. This feature owns the internal notification domain model and UI; outbound delivery through external providers and public-alerting standards is delivered by F14.

**Terminology:**
- **Recipient group:** A reusable collection of recipients defined by role, jurisdiction, or geography.
- **Message template:** A reusable message body with placeholders, reducing drafting time for recurring notification types.
- **Geotargeting:** Selecting an audience by drawing or selecting an area on the operating-picture map rather than by named group.
- **Delivery status:** Per-recipient tracked state of whether a message was sent, delivered, and acknowledged.

### Sub-features
- Recipient-group management (role, jurisdiction, geography) and reusable message templates.
- Geotargeted audience selection using operating-picture map components.
- Compose flow: audience → message (`[AIDraft]`-assisted, never auto-sent) → review → approve and send.
- Delivery and acknowledgment tracking view.
- Named-person approval required before any external send.

### Screens

**S5.1 — Recipient Groups (List + Editor)**
- `Table`: Group name (linked), Type (Role/Jurisdiction/Geography), Member count, Last used. "New group" primary action. Editor form: name, type `Select`, and type-specific selector (role `Combobox`, jurisdiction `Combobox`, or geography drawn/selected on a `MapCanvas` instance).

**S5.2 — Message Templates (List + Editor)**
- `Table`: Template name (linked), Category, Last updated. Editor: name, category `Select`, body `TextField multiline` with placeholder tokens (e.g., `{{incident_name}}`, `{{jurisdiction}}`) and a character count.

**S5.3 — Compose Notification (4-step flow, required order)**
- Step 1 — **Audience:** Select recipient group(s) (`Combobox` multi) and/or geotarget via embedded `MapCanvas`/`LayerPanel` drawing an area; live recipient-count estimate shown.
- Step 2 — **Message:** Select template or write freeform (`TextField multiline`, character count); "Draft with AI" secondary button available, inserting `[AIDraft]` panel with `Provenance` sources — Approve inserts into the field and logs reviewer+time, Discard removes it. AI never auto-populates the field without explicit Approve.
- Step 3 — **Review:** Read-only preview of the final message, selected delivery channels (from F14's configured providers), and the named approver who must sign off.
- Step 4 — **Approve and send:** "Approve and send" (primary, `danger`-styled `Modal` confirmation for public/external-reach messages) — requires the signed-in named person to be the approver of record; send action is always deliberate, never automatic or AI-triggered.

**S5.4 — Delivery & Acknowledgment Tracking**
- `Table` of recipients: Name/Group, Channel, Status `Badge` (Queued/Sent/Delivered/Failed), Acknowledgment `Progress` bar (e.g., "68% acknowledged, 412 of 606"). Filter by status. Auto-refreshes as delivery callbacks arrive (F14).

### Process
1. A user (typically PER-02 in the PIO capacity) selects or creates recipient groups and/or draws a geotargeted area (S5.1, Step 1 of S5.3).
2. The user drafts a message, optionally using a template or `[AIDraft]` assistance from reviewed incident notes (Step 2); AI drafts remain inert text in the panel until a named person clicks Approve, which copies the text into the message field and logs the approval.
3. The user reviews the final composed message, audience, and channels (Step 3) — nothing is editable at this step without returning to a prior step.
4. The named approver (who may be the same user if they hold approval permission, or a different designated approver per agency policy) clicks "Approve and send"; for any message routed to public/external channels (F14), a `Modal danger` confirmation restates the audience size and channels before the send is dispatched.
5. The system dispatches the message through configured internal channels and via F14's provider adapter(s) for external channels; each recipient/channel combination gets a tracked delivery record.
6. Delivery and acknowledgment callbacks (from F14) update S5.4 in near-real-time; failures surface as `Failed` status with a visible reason, never a silent drop.
7. The compose/send action and its approver are written to the originating incident's Timeline (F1) if the notification is incident-linked.

### Inputs
- Recipient group: `name` (string, required), `type` (enum: `Role`|`Jurisdiction`|`Geography`, required), `selector` (role ID, jurisdiction ID, or geo-polygon, required per type).
- Message template: `name`, `category`, `body` (string with placeholder tokens).
- Compose: `recipient_group_ids` ([UUID], at least one group or geotarget required), `geotarget_polygon` (GeoJSON, optional), `message_body` (string, required, ≤[channel-specific limit]), `channels` ([enum], required, from F14-configured providers), `approver_id` (UUID, required at send).

### Outputs
- Sent notification record with full audience, message, channel, and approver history.
- Per-recipient delivery and acknowledgment status records.
- Timeline entry on the linked incident (if any).

### Validation
- At least one recipient group or a non-empty geotarget polygon is required before proceeding past Step 1.
- Message body cannot be empty and must respect the per-channel character limit shown in Step 2/3.
- The "Approve and send" action is blocked unless the signed-in user matches the designated approver role for the selected channels (enforced server-side, not just hidden client-side).
- AI-drafted content (`[AIDraft]`) can never populate the message field without an explicit, logged Approve action — this is enforced at the API boundary, not just the UI.
- Public/external-reach sends (any channel flagged as public-facing by F14) must show the `Modal danger` confirmation; this cannot be bypassed or auto-confirmed.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Send attempted with no audience selected | 422 | NO_AUDIENCE_SELECTED | "Select at least one recipient group or draw a geotargeted area." |
| Send attempted by non-approver | 403 | APPROVER_MISMATCH | "You're not the designated approver for this channel. Route it to [approver name]." |
| AI draft inserted without approval (API-level guard) | 400 | AIDRAFT_NOT_APPROVED | "This draft hasn't been approved. Approve it before it can be sent." |
| Provider channel unavailable at send time | 503 | CHANNEL_UNAVAILABLE | "[Channel] is temporarily unavailable. The message is queued and will retry." |
| Message exceeds channel character limit | 422 | MESSAGE_TOO_LONG | "This message exceeds the [N]-character limit for [channel]. Shorten it." |

### API Surface (this feature)
See `Y1c-api-comms-reporting.md` §Notifications for `GET/POST /api/v1/recipient-groups`, `GET/POST /api/v1/message-templates`, `POST /api/v1/notifications/compose`, `POST /api/v1/notifications/{id}/send`, `GET /api/v1/notifications/{id}/delivery-status`.

### Schema Surface (this feature)
Owns tables `recipient_groups`, `message_templates`, `notifications`, `notification_recipients`, `notification_delivery_status` — see `Y0c-schema-comms-reporting.md` §Notifications. Reads `incidents` (F1), `users` (F8); writes delivery dispatch requests consumed by F14.
