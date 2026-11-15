## F10: Platform API, Integration Gateway & Event Bus

**Description:** The programmatic contract and background-processing backbone that lets EPMP publish its own data, accept approved external data, and process work asynchronously (notification delivery, sync reconciliation, feed ingestion) without blocking interactive use. This is the system's public/partner-facing API surface, distinct from the UI (F0), and the enforcement point for the four non-negotiable integration behaviors: record authority, trusted provenance, controlled federation, graceful failure.

**Terminology:**
- **Record authority registry:** The documented, queryable declaration of which system owns each record type.
- **Provenance enforcement:** API-boundary validation that every ingested/AI-derived fact carries source, timestamp, version, confidence.
- **Idempotent consumer:** A webhook/event consumer that safely processes a duplicate delivery without side effects (via idempotency keys).
- **Federation grant:** A policy-enforced, revocable permission allowing a specific partner jurisdiction to view specific incident/resource data.

### Sub-features
- Versioned OpenAPI/REST/JSON contracts for incident, resource, readiness, reporting, and administration functions.
- OAuth2/OIDC/SAML2-based delegated authorization for API and federation access.
- Webhook/event-bus publication of incident/status changes with durable delivery, idempotent consumers, retry policies.
- Background job processing for notification fan-out, feed ingestion, offline-sync reconciliation, report generation.
- Record-authority registry.
- Provenance enforcement at the API boundary.
- Policy-enforced, revocable cross-jurisdiction data federation.

### Screens

**S10.1 — API & Integration Gateway (admin-facing, within F8 admin console)**
- `Table`: registered API clients/partners, scopes granted, last request, rate-limit status. "Revoke access" (`danger`, `Modal` confirmation) per row.

**S10.2 — Record Authority Registry (admin-facing)**
- `Table`: Record type (e.g., Incident, Dispatch status, Personnel roster), Authoritative system (EPMP or named external system), Notes. Read-mostly reference configuration; changes require admin role and are audited.

**S10.3 — Federation Grants**
- `Table`: Partner jurisdiction, Scope granted (which incidents/record types), Granted by, Expires, Status (Active/Revoked). "Grant access" (form: partner `Combobox`, scope checkboxes, expiry `DatePicker`) / "Revoke" (`danger`, immediate effect) actions.

**S10.4 — Background Job Monitor (within F8 Platform Monitoring, S8.7)**
- `Table`: Job type (notification fan-out, feed ingestion, sync reconciliation, report generation), Status, Last run, Failure count, Next retry. Surfaced as part of the platform-health view, not a separate top-level nav item.

### Process
1. Every external API request authenticates via OAuth2/OIDC bearer token (or SAML2-federated session for browser-based partner access); the gateway validates scope against the record-authority and federation-grant configuration before routing to the relevant domain service.
2. Incident/status changes originating in EPMP (F1, F4, F5) publish events to the durable event bus; external subscribers (webhooks) receive deliveries with a unique idempotency key, so a retried delivery is safely ignored if already processed.
3. Inbound data from approved external sources (F11 GIS, F12 hazard feeds, F13 EOC COTS, F15 CAD, F16 HR/IAM, F17 assets/documents) passes through provenance enforcement: every ingested fact must carry source, timestamp, version, and confidence before it is persisted; data missing this is rejected, not silently accepted.
4. Background jobs handle: notification fan-out (F5/F14, parallelized per channel), feed ingestion (F12, scheduled polling with retry/backoff on outage), offline-sync reconciliation (F6, processing queued batches), and report generation (F7, for long-running AAR compilation).
5. The record-authority registry (S10.2) is consulted by every integration feature (F13, F15, F16, F17) before writing a record sourced externally — if EPMP is not authoritative for a record type, EPMP treats inbound data as reference/display-only and never allows a local edit to silently diverge without flagging a conflict.
6. Federation grants (S10.3) are policy-enforced per request (via a policy engine) and revocable at any time; a revoked grant takes effect immediately, not at next token expiry.
7. Graceful failure: any integration feed/job experiencing an outage queues work, retries with backoff, and surfaces its degraded state via `SyncStatus`/integration-health (F8 S8.6) rather than failing silently or blocking unrelated platform operation.

### Inputs
- API auth: `access_token` (OAuth2/OIDC bearer, required), `client_id` (required for partner/federation access).
- Webhook registration: `callback_url` (required), `event_types` ([string], required), `secret` (for signature verification, required).
- Record authority entry: `record_type` (string, required), `authoritative_system` (enum: `EPMP`|named external system, required).
- Federation grant: `partner_jurisdiction_id` (UUID, required), `scope` ([record types/incident filters], required), `expires_at` (ISO datetime, optional).
- Ingested fact (any integration): `source` (string, required), `timestamp` (ISO datetime, required), `version` (string, required), `confidence` (enum, required), `payload` (required).

### Outputs
- Published webhook/event-bus deliveries with idempotency keys.
- Record-authority registry responses consumed by F13/F15/F16/F17.
- Federation-scoped query results (only data within an active, non-expired, non-revoked grant).
- Background-job status/health feed into F8 S8.7 Platform Monitoring.

### Validation
- Every mutating webhook consumer call must include and check an idempotency key; duplicate keys within the retry window must be rejected/no-op'd, not reprocessed.
- Inbound data lacking `source`, `timestamp`, `version`, or `confidence` must be rejected at the API boundary — never persisted as if verified.
- A federation grant must have an explicit scope; a grant with no scope restriction (implicit "all data") is not permitted — every grant must enumerate what it covers.
- Revoking a federation grant or API client must take effect within the same request cycle — no caching window that honors a revoked credential.
- Background jobs must be observable: every job type must report last-run time, failure count, and next-retry time to S10.4/S8.7 — a silent, unmonitored background job is a defect.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Ingested fact missing provenance fields | 422 | PROVENANCE_REQUIRED | "This data is missing source, timestamp, or confidence and can't be accepted." |
| Duplicate webhook delivery (idempotency match) | 200 (no-op) | DUPLICATE_DELIVERY_IGNORED | (Internal — not user-facing; logged as a no-op, not an error to the caller.) |
| Federation grant expired/revoked | 403 | FEDERATION_ACCESS_DENIED | "Access to this data was revoked or has expired." |
| Record-authority conflict (write attempted to externally-owned record) | 409 | RECORD_AUTHORITY_CONFLICT | "[External system] owns this record. Changes must be made there, or flagged as a conflict for review." |
| Background job failure threshold exceeded | 200 (alert) | BACKGROUND_JOB_DEGRADED | "[Job type] has failed [N] times and is in backoff. Last error: [reason]." |

### API Surface (this feature)
See all of `Y1a`–`Y1d` for the full versioned contract; this feature specifically owns `Y1a-api-auth-admin.md` §API Clients & Federation for `GET/POST /api/v1/admin/api-clients`, `POST /api/v1/admin/api-clients/{id}/revoke`, `GET/POST /api/v1/admin/record-authority`, `GET/POST /api/v1/admin/federation-grants`, `POST /api/v1/admin/federation-grants/{id}/revoke`, and the shared webhook-subscription endpoints in `Y1d-api-integrations.md` §Event Bus.

### Schema Surface (this feature)
Owns tables `api_clients`, `webhook_subscriptions`, `webhook_deliveries`, `record_authority_registry`, `federation_grants`, `background_jobs` — see `Y0a-schema-auth-org.md` §Platform API & Federation and `Y0d-schema-integration-geo.md` §Event Bus. Consulted by every integration feature (F11–F17).
