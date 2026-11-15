## F14: Notification Provider & Public-Alerting Integration

**Description:** Outbound integration with external notification providers (Everbridge, AtHoc, and similar channels) and the FEMA IPAWS/OASIS CAP ecosystem for approval-controlled public warning distribution, extending F5's internal notification domain to real delivery channels.

**Terminology:**
- **Provider adapter:** The integration translating EPMP's internal notification payload into a specific external provider's send API.
- **CAP (Common Alerting Protocol):** The OASIS standard format for public-warning messages, used for any message routed through IPAWS or CAP-compatible channels.
- **Delivery callback:** An inbound webhook from a provider reporting delivery/acknowledgment status for a previously sent message.

### Sub-features
- Provider-integration adapter(s) for Everbridge/AtHoc-class channels, with delivery-status and acknowledgment callbacks.
- OASIS CAP-formatted alert representation for IPAWS/CAP-compatible channels, subject to agency authority/access rights.
- Every external send remains approval-controlled by a named person.
- Graceful failure: provider outages queue messages for retry and surface delivery failures.

### Approved Adapter Pattern
One normalized adapter contract per provider family (Everbridge/AtHoc-class commercial notification channels, and a separate CAP-formatting adapter for IPAWS/CAP-compatible public-warning channels). MVP ships with a single approved provider integration rather than every named vendor; the adapter contract below is vendor-neutral so additional providers can be added without changing F5's domain model.

**Adapter contract (MVP depth):**
- **Send request:** `POST {adapter}/send` with `{ notification_id, channel, recipients: [...], message, approved_by, approved_at }` — the adapter rejects any request missing `approved_by`/`approved_at` (mirrors F9's AI-draft approval enforcement; a human approval is required regardless of whether the content was AI-drafted).
- **CAP formatting (for IPAWS/CAP channels only):** the adapter wraps the approved message in an OASIS CAP XML envelope with required fields (`identifier`, `sender`, `sent`, `status`, `scope`, `category`, `event`, `urgency`, `severity`, `certainty`, `area`), subject to the agency's configured authority/access rights for that channel — EPMP never originates a CAP alert without an explicit agency-authorized sender identity attached.
- **Delivery callback (inbound webhook):** `POST /api/v1/integrations/notification-providers/callback` with `{ external_message_id, recipient, status: "sent"|"delivered"|"failed"|"acknowledged", timestamp }`, matched back to the originating `notification_id`/recipient record in F5.

### Process
1. When a notification is approved and sent in F5 (S5.3 Step 4), the system dispatches it through this feature's provider adapter(s) for every channel not handled as a purely internal channel.
2. For channels routed through IPAWS/CAP-compatible public-warning systems, the message is additionally wrapped in a CAP-formatted envelope before dispatch, using the agency's configured, authorized sender identity — this step never runs for a message that has not passed F5's named-person approval gate.
3. The adapter records an `external_message_id` per recipient/channel at send time, enabling delivery callbacks to be matched back to the correct notification and recipient.
4. As the provider sends delivery/acknowledgment callbacks, this feature updates the corresponding `notification_delivery_status` records (owned by F5), which immediately reflect in F5's S5.4 Delivery & Acknowledgment Tracking view.
5. If the provider is unreachable at send time, the message is queued (not dropped) and retried with backoff; the failure state and retry schedule are visible in F5's delivery view as `Failed` with a visible reason and retry countdown, and in F8's Integration Health view.
6. No code path in this feature can dispatch a message without a prior F5-recorded `approved_by`/`approved_at` pair — the adapter's send endpoint validates this server-side and rejects any request missing it, mirroring F9's AI-governance enforcement pattern.

### Inputs
- Send request: `notification_id` (UUID, required), `channel` (enum, required), `recipients` (array, required), `message` (string, required), `approved_by` (UUID, required), `approved_at` (ISO datetime, required).
- CAP fields (public-warning channels only): `sender` (authorized agency identity, required), `event`, `urgency`, `severity`, `certainty`, `area` (all required per CAP spec).
- Delivery callback: `external_message_id`, `recipient`, `status` (enum), `timestamp` (all required).

### Outputs
- Dispatched messages via provider channel(s), tracked by `external_message_id`.
- CAP-formatted XML payload for public-warning channel sends (retained for audit).
- Updated `notification_delivery_status` records consumed by F5 S5.4.

### Validation
- The send endpoint must reject any request lacking `approved_by`/`approved_at` — unconditionally, with no override, regardless of caller.
- CAP-formatted sends must include all OASIS CAP required fields; an incomplete CAP payload is never dispatched, it is rejected back to the composer (F5) for completion.
- Delivery callbacks must match an existing `notification_id`/recipient pair; an unmatched callback is logged for investigation, not silently discarded or silently attached to the wrong record.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Send attempted without approval record | 400 | SEND_REQUIRES_APPROVAL | "This message hasn't been approved and can't be sent." |
| Provider unreachable | 503 | PROVIDER_UNAVAILABLE | "[Provider] is temporarily unavailable. The message is queued and will retry." |
| CAP payload incomplete | 422 | CAP_FIELDS_INCOMPLETE | "This public warning is missing required fields: [list]. Complete it before sending." |
| Delivery callback unmatched | 200 (logged) | CALLBACK_UNMATCHED | (Internal — logged for investigation, no user-facing error.) |
| Agency lacks authorization for IPAWS/CAP channel | 403 | CAP_AUTHORITY_DENIED | "[Agency] isn't authorized to send through this public-warning channel." |

### API Surface (this feature)
See `Y1d-api-integrations.md` §Notification Providers for `POST /api/v1/integrations/notification-providers/send`, `POST /api/v1/integrations/notification-providers/callback`, `GET /api/v1/integrations/notification-providers/health`.

### Schema Surface (this feature)
Owns tables `notification_provider_config`, `notification_dispatch_log`, `cap_alert_records` — see `Y0c-schema-comms-reporting.md` §Notification Provider Integration. Writes into F5's `notification_delivery_status` table.
