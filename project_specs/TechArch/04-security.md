## 5. Security Architecture

### 5.1 Identity & Authentication

**Pattern:** Keycloak as an IdP broker, never the authoritative identity store. Each agency federates its own IdP (Active Directory FS, Okta, Azure AD, PingFederate, etc.) via SAML2 or OIDC into a per-tenant Keycloak realm; EPMP's `users` table stores only the minimal local projection (`idp_subject`, `email`, `name`, `role_id`, `jurisdiction_scope`) needed for RBAC — matching F16's "HR often authoritative for personnel records" principle and the "no parallel system of record" NFR.

```
Agency IdP (SAML2/OIDC) ──► Keycloak Realm (per-tenant) ──► EPMP API Gateway
                                    │                              │
                                    │ issues short-lived            │ validates bearer
                                    │ JWT access token               │ token signature +
                                    │ (OIDC) or SAML assertion        │ claims (role, jti,
                                    ▼                                 │ exp) per request
                          users.idp_subject resolved/
                          provisioned on first login (JIT)
```

- **Protocol support:** SAML2 and OIDC, matching F8/F16's explicit requirement; OAuth2 client-credentials flow for machine-to-machine (API client / partner federation) access, separate from the user-facing SSO flow.
- **Session lifecycle:** short-lived access tokens (15 min) + refresh tokens (rotating, revocable); **suspending a user's access immediately invalidates active sessions** (F8 Validation) via Keycloak's admin API session-revocation call issued synchronously from the `auth-org` module's `PATCH /api/v1/admin/users/{id}` handler — not a wait-for-expiry model.
- **JIT provisioning:** first successful SSO assertion creates the local `users` row if `idp_subject` is unmatched; IdP group claims map to an EPMP `role_id` via the admin-configured `group_to_role_mapping` (tested via `POST /api/v1/admin/sso-config/test` before activation — "no untested IdP config goes live," F8 Validation).
- **MFA:** delegated entirely to the agency IdP — EPMP does not implement its own MFA, consistent with "HR/IdP is often authoritative" and avoiding a parallel identity system.

### 5.2 Authorization (RBAC + Jurisdiction/Incident Scoping)

**Two-layer enforcement**, matching the FRD's explicit requirement that jurisdiction/federation scope checks happen server-side regardless of client:

1. **Application-layer (OPA policy decisions).** Every protected request is evaluated against a Rego policy bundle that encodes:
   - Role → feature → action permissions (`role_permissions` table, editable via admin console S8.3).
   - Jurisdiction scope (`users.jurisdiction_scope` + active, non-expired `federation_grants`).
   - Incident-scoped overrides where applicable (e.g., a command-role assignment grants edit rights on that specific incident regardless of base jurisdiction scope).
   The policy engine runs as a sidecar/service queried per-request (`POST /v1/data/epmp/authz` to OPA), **never cached across a credential revocation** — satisfying F10's "no caching window that honors a revoked credential."

2. **Database-layer (PostgreSQL Row-Level Security).** As defense-in-depth beneath the application check, every jurisdiction-scoped table enforces an RLS policy filtering on a session-local `app.jurisdiction_scope` variable set immediately post-authentication (see `02-data-model.md` §3.4). This means a bug in application-layer filtering cannot leak cross-jurisdiction data even if OPA is bypassed by a code defect.

**Permission model:** role × feature × action matrix (`role_permissions.feature`, `.actions[]`), covering every persona named in PRD §3 (9 personas mapped to 5 consolidated roles per `PERSONAS-EPMP.md`'s PER-01..PER-05 grouping). Example Rego fragment:

```rego
package epmp.authz

default allow = false

allow {
  input.action in data.role_permissions[input.role_id][input.feature]
  jurisdiction_allowed
}

jurisdiction_allowed {
  input.record_jurisdiction_id == input.user_jurisdiction_scope[_]
}

jurisdiction_allowed {
  grant := data.federation_grants[_]
  grant.partner_jurisdiction_id == input.user_jurisdiction_scope[_]
  grant.status == "Active"
  grant.expires_at > input.now
  input.record_type in grant.scope.record_types
}
```

### 5.3 Audit Architecture

Per F8's hard constraint ("audit log entries are immutable and exempt from any delete/edit code path, including for admins — enforced at the data layer, not just the UI"):

- `audit_log` and `incident_timeline` are both **append-only by database grant**, not merely application convention: `REVOKE UPDATE, DELETE ON audit_log, incident_timeline FROM app_runtime;` — the runtime application database role has `INSERT`/`SELECT` only. Corrections are new rows referencing the prior entry, never edits.
- **Single-writer pattern:** exactly one backend service interface writes to each table (`AuditService.record()` for `audit_log`, `TimelineService.append()` for `incident_timeline`), so every write path is auditable at the code level, not scattered across repositories.
- **What gets audited (F8 explicit list):** login, logout, permission change, record access to a sensitive record type, AI-draft approval, SSO config change, role/permission edit, federation-grant grant/revoke, integration record-authority conflict resolution, user suspend/reactivate.
- **Export:** `GET /api/v1/evidence-log/export?format=csv|pdf` for demonstrable-preparedness evidence (PRD success-metrics theme), itself an audited action.
- **Retention:** append-only tables are retained indefinitely by default (no automated purge job) since they are the platform's compliance/evidence backbone; archival-tier storage (not deletion) is the only retention-cost lever, configured per-agency if required.

### 5.4 Encryption

| Scope | Mechanism |
|---|---|
| Data in transit | TLS 1.2+ everywhere (browser↔gateway, gateway↔service mesh, service↔PostgreSQL, service↔NATS); mutual TLS between internal services where the deployment's service mesh (if used) supports it |
| Data at rest (database) | PostgreSQL transparent data encryption at the storage/volume layer (cloud-managed Postgres: provider-native encryption-at-rest; self-hosted: LUKS-encrypted volumes) plus column-level encryption for `sso_config.idp_metadata_xml`, `eoc_cots_config.auth_config`, `notification_provider_config.auth_config`, `cad_config.endpoint_config`, `facility_feed_config.endpoint_config`, `document_system_config.endpoint_config` (all contain credentials/secrets) via `pgcrypto` or application-layer envelope encryption with a KMS-managed key |
| Secrets (API client secrets, webhook signing secrets) | Stored only as salted hashes (`client_secret_hash`, `secret_hash`) — plaintext is returned exactly once at creation and never persisted or retrievable again |
| Data at rest (object storage) | Server-side encryption (SSE-S3/SSE-KMS equivalent) for field-report photos and imported documents |
| Field-mobile local cache | SQLite database encrypted at rest on-device (SQLCipher or platform-native storage encryption via OPFS + browser sandbox); queued photo blobs in IndexedDB subject to the same device-level encryption |
| Key management | Centralized KMS (cloud-provider KMS or HashiCorp Vault for self-hosted/air-gapped deployments) issuing data-encryption keys; no application code holds a master key directly |

### 5.5 NIST-Aligned Posture (Explicitly Not a FedRAMP Claim)

Per the PRD's hard constraint, this architecture targets **NIST SP 800-53 control-family alignment** and FedRAMP-*compatible* patterns without asserting FedRAMP authorization anywhere:

| NIST control family | EPMP architectural implementation |
|---|---|
| AC (Access Control) | OPA-enforced RBAC + jurisdiction scope + RLS defense-in-depth (§5.2) |
| AU (Audit & Accountability) | Append-only `audit_log`/`incident_timeline`, single-writer pattern, immutable at the data layer (§5.3) |
| IA (Identification & Authentication) | Federated SSO via Keycloak, no local password store, short-lived tokens, immediate session revocation on suspend (§5.1) |
| SC (System & Communications Protection) | TLS everywhere, encrypted secrets at rest, network-segmented deployment (API/worker/DB tiers), AI gateway egress-restricted to approved sources only |
| CM (Configuration Management) | Infrastructure-as-code (Helm/Terraform) for all deployment artifacts, version-controlled OpenAPI contract, CI-gated design-system conformance checks |
| CP (Contingency Planning) | Managed PostgreSQL with point-in-time recovery, documented backup/restore runbook, multi-AZ deployment option |
| SI (System & Information Integrity) | Provenance enforcement at every integration boundary (never silently promote unverified data), input validation via the DDL's `CHECK` constraints as a last line of defense beneath application validation |
| RA (Risk Assessment) | Record-authority registry makes external-system trust boundaries explicit and auditable rather than implicit |

**Content/copy guard:** a CI content-lint rule scans all UI copy, API response text, and documentation artifacts for FedRAMP-authorization claims and blocks merge if found (`FEDRAMP_CLAIM_BLOCKED`, per Y2's build-time guard) — the only "error" in the catalog that is a content-review gate rather than a runtime HTTP response.

### 5.6 AI Governance Architecture — Mapping Requirements to the Intelligence Layer

The PRD/FRD's AI governance model (`AIDraft` + `Provenance`, named-person approval, absolute prohibition on auto-issued public warnings/evacuation/binding resource decisions) is implemented as a **non-bypassable chain** from the Intelligence Layer through to persistence:

```
 1. Context assembly        Reviewed notes / structured incident data passed explicitly
    (never open retrieval)  as `context` — no open web browsing or uncontrolled corpus access;
                             retrieval scoped to approved EPMP-internal sources only (incidents,
                             plans, reviewed field reports) per source Section 13's "permission-
                             aware retrieval and structured data tools."
                                      │
                                      ▼
 2. Model-neutral AI        `comms-reporting` module calls the AI gateway's stable internal
    gateway (F9)            interface `draft(context, target_field) → {draft_text, sources,
                             confidence_label}` — swappable backing model, no product logic
                             hard-coded to a vendor.
                                      │
                                      ▼
 3. ai_drafts row           Every draft is persisted BEFORE it reaches the UI, with
    created (unresolved)    `action = NULL`, `approved_by = NULL` — this is the only state
                             in which AI content exists; it cannot be referenced by an
                             official record's content yet.
                                      │
                                      ▼
 4. AIDraft UI component    The ONLY UI surface that renders AI output (F0 convention).
    (mandatory render path) Shows draft_text + Provenance source chips + confidence label
                             (qualitative: High/Medium/Low + reason, never bare %).
                             "Not issued" badge persists until Approve.
                                      │
                         ┌────────────┼────────────┐
                         ▼            ▼             ▼
                     Approve        Edit          Discard
                   (named user)  (then approve)  (no further
                         │                         action)
                         ▼
 5. Server-side guard   `ai_drafts.action = 'approve'` requires
    (CHECK constraint    `approved_by IS NOT NULL` (DB layer) +
    + middleware)        shared `assertAiOriginApproved()` middleware
                         (application layer) on every write endpoint
                         accepting `ai_origin: true` — independent of
                         which UI client calls it (hard FRD requirement).
                                      │
                                      ▼
 6. Official record     ONLY now may `ics_forms.ai_origin=true`,
    write permitted      `notifications.ai_origin=true`, or
                          `sitreps.ai_origin=true` reach `Approved`/
                          `sent_at` status — enforced by DB CHECK
                          constraints `chk_ai_requires_approval` /
                          `chk_send_requires_approval` (see 02b, 02c)
                          as the last, non-bypassable line of defense.
                                      │
                                      ▼
 7. Audit trail          Approval logs reviewer identity + timestamp
                          to the owning record's Timeline (incident_
                          timeline) or audit_log — named-person
                          accountability, never a service account
                          (enforced: approver must resolve to an
                          active, non-service user; APPROVAL_REQUIRES_
                          NAMED_USER otherwise).
```

**Absolute prohibition enforcement points (public warning / evacuation / binding resource decision):**
- The `notifications` table's `chk_send_requires_approval` and `chk_ai_origin_requires_approval` CHECK constraints make it structurally impossible for `sent_at` to be set on an AI-originated message without `approved_by` — this applies identically whether the channel is an internal notification or an external IPAWS/CAP public-warning channel (F14), since F14's send path is gated by the same `comms-reporting` module before ever reaching the `integration-gateway`'s provider adapter.
- `POST /api/v1/integrations/notification-providers/send` (the only path to an external send) rejects any request missing `approved_by`/`approved_at` with `400 SEND_REQUIRES_APPROVAL` — this is the final checkpoint before a message leaves EPMP's boundary toward Everbridge/AtHoc/IPAWS.
- Resource-request approval (F4) is a separate, independently-gated workflow (`resource_requests.status` transitions) that AI never touches directly — F9's scope explicitly excludes "AI-recommended response role/resource matches" (deferred to Phase 2), so no AI-origin path exists into `resource_requests` at all in this MVP.
- Signal-to-incident promotion (`POST /api/v1/signals/{id}/promote`) returns a **pre-fill payload only** and is structurally incapable of creating an incident — enforced server-side (`400 PROMOTE_REQUIRES_HUMAN_SUBMIT` if a caller attempts to treat the response as a created record), closing the one path where an AI-detected signal could otherwise silently become an operational fact.

### 5.7 Offline / Degraded-Mode & Field-Mobile Sync Architecture

**Client-side local store:** the field-mobile PWA runs a SQLite database (via `sql.js`/OPFS in-browser, or a native SQLite binding if a future Capacitor-wrapped build is added) mirroring the shape of the server's `tasks`, `field_reports`, and a local `outbox` table — not a full schema replica, only the subset needed for offline task-status updates and field-report creation.

```
┌────────────────────────── Field-Mobile Client ──────────────────────────┐
│  UI (React, window.EPMP field-mobile page pattern)                       │
│       │ read/write                                                        │
│       ▼                                                                    │
│  Local SQLite cache          IndexedDB (photo blobs pending upload)        │
│  - tasks (read cache)        │                                              │
│  - field_reports (outbox)    │                                              │
│  - outbox_queue (pending     │                                              │
│    mutations, FIFO by        │                                              │
│    client captured_at)       │                                              │
│       │                                                                     │
│       ▼                                                                     │
│  Service Worker (Workbox) — background sync registration                   │
│       │  on reconnect: fires sync event, SyncStatus → 'syncing'            │
└───────┼─────────────────────────────────────────────────────────────────┘
        ▼  POST /api/v1/field-reports/sync-batch  (creation-order batch)
┌─────────────────────────── incident-ops module ─────────────────────────┐
│  For each queued item (in creation order):                                │
│    1. Check for EOC-side change to the same entity since captured_at       │
│    2. No conflict → persist, append incident_timeline entry with           │
│       ORIGINAL captured_at preserved (not sync time), return 'synced'      │
│    3. Conflict  → write to sync_conflicts (field_version vs eoc_version),  │
│       return 'conflict' + conflict_id — NEVER auto-resolved                │
│    4. Processing failure (e.g., photo format) → flag 'failed' with retry,  │
│       does not block the rest of the batch                                 │
└───────────────────────────────────────────────────────────────────────────┘
```

**Idempotency:** every field report carries a client-generated `client_report_id` (UNIQUE constraint on the table), and every task-status update is idempotent by `task_id` + client `captured_at` — a retried sync-batch call (e.g., due to a flaky connection mid-upload) never double-creates records.

**Conflict resolution:** always surfaced to a named person via the `SyncStatus` conflict state (S6.5) — side-by-side "your version" vs. "current EOC version," explicit `keep_mine`/`keep_eoc` choice, never a silent auto-merge. This is identical in structure to F13's EOC-COTS conflict pattern (`eoc_cots_conflicts`), so the UI pattern and resolution-audit-trail code are shared between F6 and F13/F8's admin console.

**Degraded-mode map (F2/F11):** when the GIS adapter times out (`504 GIS_FEED_TIMEOUT`), the operating picture renders the schematic offline base map labeled "Schematic base map, offline" and continues plotting EPMP-sourced markers on top — the page never hard-fails. The same schematic fallback is reused by F6's lightweight field map (S6.6).

**Backoff policy (applies to all integration polling jobs, F11–F17):** exponential backoff (base interval → ×2 per consecutive failure, capped at a configured maximum — default 1 hour), tracked in `background_jobs.failure_count`/`next_retry_at`; sustained backoff surfaces as `200 BACKGROUND_JOB_DEGRADED` (alert-level, not a hard failure) in F8's Platform Monitoring, never as a user-facing error for already-cached data.

### 5.8 Controlled Federation Enforcement

Cross-jurisdiction data sharing (PRD's "four non-negotiable integration behaviors" #3) is implemented exclusively through `federation_grants`, never through broadening a user's base `jurisdiction_scope`:

- Every grant **must** enumerate an explicit `scope.record_types` array — a grant with no scope restriction (implicit "all data") is rejected at creation (`chk_scope_not_empty` CHECK constraint, §3.4/`02a`).
- Revocation (`POST /api/v1/admin/federation-grants/{id}/revoke`) takes effect **within the same request cycle** — OPA is queried per-request with no grant-decision caching, so a revoked grant cannot be honored by a stale cached decision.
- Federation-scoped queries are additive to, never a replacement for, jurisdiction-scope RLS: a partner's federated access is evaluated as an additional `jurisdiction_allowed` branch in the Rego policy (§5.2), not a bypass of it.
