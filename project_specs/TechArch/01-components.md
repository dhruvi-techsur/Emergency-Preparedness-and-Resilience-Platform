## 2. Component Architecture

This section maps FRD features to concrete backend modules and frontend application components, defining responsibilities and boundaries. Module boundaries mirror the FRD's own schema chunking (`Y0a`–`Y0d`) and API chunking (`Y1a`–`Y1d`), which were already organized along cohesive domain lines.

### 2.1 Backend Modules (within the modular monolith)

#### Module: `auth-org` (owns Auth, Org, Admin, Platform API/Federation reference data)
**FRD features:** F8 (Security & Administration), F10 (Platform API/Gateway/Federation — registry & grant management only; see `integration-gateway` module for runtime enforcement), F16 (HR/IAM — roster sync target), F18 (persona landing config), F0 (session/theme — thin pass-through)

**Responsibilities:**
- Session resolution: validates Keycloak-issued OIDC/SAML2 tokens, resolves local `users` record, attaches `role_id` + `jurisdiction_scope` to the request context.
- RBAC enforcement entry point: every other module calls this module's authorization check (backed by OPA) before executing a protected action.
- User/role/permission CRUD (admin console backend).
- Append-only audit log writer — the **only** code path permitted to insert into `audit_log`; exposed as an internal service interface (`AuditService.record(actor, action, record_type, record_id, detail)`) called by every other module, never written to directly by another module's repository layer.
- API client & webhook subscription registry CRUD (`api_clients`, `webhook_subscriptions`).
- Record-authority registry and federation-grant CRUD (data owner; runtime per-request enforcement delegated to OPA via the `integration-gateway` module's policy middleware).
- Persona landing-config resolution (`role_landing_config`) for F18 role-scoped nav.
- Platform health aggregation (uptime, active sessions, failed-login rate, integration-error rate) for F8 S8.7.

**Does not own:** incident data, task data, notification content — reads only, via the authorization check.

#### Module: `incident-ops` (owns Incident/ICS, Operating Picture aggregation, Tasks/Resources, Field Operations)
**FRD features:** F1 (Incident/ICS), F2 (Common Operating Picture — read/aggregation layer only, no owned tables), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations)

**Responsibilities:**
- Incident lifecycle state machine (severity/activation-level/status transitions, command-role assignment) with the hard invariant "every state-changing action writes exactly one Timeline entry" enforced as a single transactional write (incident/role/task/resource mutation + `incident_timeline` insert in the same DB transaction, never as two separate calls that could partially fail).
- `incident_timeline` append-only writer (the **only** code path permitted to insert rows — mirrors `auth-org`'s `audit_log` pattern; exposed as `TimelineService.append(incident_id, title, meta, tone, actor_id, source, detail)`).
- ICS form draft/approve lifecycle, including the AI-governance guard (rejects `ai_origin: true` payloads lacking `approved_by`/`approved_at` — see `04-security.md` §AI Governance Enforcement).
- Task and resource-request state machines, including system-driven `Overdue` transition (scheduled job, not user-settable).
- Operating-picture read/aggregation: queries `incidents`, `facilities` (from `integration-gateway`'s F17 cache), `resource_requests`, `hazard_layers` (from `integration-gateway`'s F12 cache) and assembles the unified marker/layer response — this module owns no geospatial source-of-truth tables itself, only the incident/task/resource data that becomes markers.
- Field-report ingestion and sync-batch reconciliation, including conflict detection (`sync_conflicts`) — see `03-offline-sync.md` equivalent coverage in `04-security.md`/overview for full design; this module implements the server-side half of the offline-sync contract.

**Publishes to event bus:** `incident.created`, `incident.activation_changed`, `task.status_changed`, `resource_request.status_changed`, `field_report.synced` — consumed by `comms-reporting` (F2 live updates), `integration-gateway` (F13 EOC COTS outbound sync), and any registered external webhook subscriber.

#### Module: `plans` (owns Plans & Playbooks)
**FRD features:** F3 (Plans & Playbooks)

**Responsibilities:**
- Plan/section/version CRUD and the Draft→Review→Approved state machine, enforcing no-self-approval and immutable version history (`plan_versions` rows are never updated, only inserted).
- Task-template linkage (`plan_task_templates`) and one-click materialization into `incident-ops`'s `tasks` table when an incident references a plan (cross-module call: `plans` emits the template list; `incident-ops` performs the actual task creation — keeping task-creation logic in one place).
- Document import/link orchestration (`document_links`) — delegates the actual SharePoint/document-system call to `integration-gateway`'s F17 adapter, but owns the permission-check re-verification cadence and the "flag don't auto-apply" rule for Link-live mode changes.

#### Module: `comms-reporting` (owns Notifications, Reporting/Learning, AI Assistance)
**FRD features:** F5 (Notifications Integration — internal domain model only; see `integration-gateway` for F14 external send), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage)

**Responsibilities:**
- Recipient-group and message-template CRUD.
- Notification compose/approve/send-request lifecycle — this module validates the AI-governance guard and the named-person-approval requirement, then **hands off the actual external dispatch** to `integration-gateway`'s F14 adapter (`POST /api/v1/integrations/notification-providers/send`) rather than calling any provider SDK directly, keeping all external-provider credential handling in one module.
- Delivery-status aggregation from provider callbacks (consumed via event bus from `integration-gateway`).
- SITREP/AAR generation (template assembly from `incident-ops` Timeline/task/resource data via read-only cross-module queries), finding/corrective-action tracking.
- Evidence/audit-log read views (delegates to `auth-org`'s `AuditService` for the underlying data; this module adds export formatting only).
- **AI gateway client and governance middleware (F9):** the sole caller of the Intelligence Layer's model-neutral AI service. Implements the signal-triage background consumer (reads hazard-feed events via event bus from `integration-gateway`'s F12 adapter, clusters, writes `signals`), and the `ai_drafts` request/approve/discard lifecycle. **This module's approval-guard logic is shared as a library/middleware** with `incident-ops` (ICS forms) and `plans`/itself (SITREP/AAR, notifications) so the "no unapproved AI content" check is implemented once and applied uniformly — not reimplemented per consuming module.

#### Module: `integration-gateway` (owns all F10 runtime enforcement + all F11–F17 adapters)
**FRD features:** F10 (Platform API/Gateway/Event Bus — runtime enforcement), F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F14 (Notification Provider/Public-Alerting), F15 (CAD/911), F16 (HR/IAM sync — SSO itself is Keycloak+`auth-org`), F17 (Asset/Facility/Document)

**Responsibilities:**
- One adapter class per external vendor family (see `06-integrations.md` for full adapter catalog), each implementing a common `IntegrationAdapter` interface: `fetch(since) → ProvenancedRecord[]`, `health() → IntegrationHealthStatus`, and where applicable `publish(records)`.
- **Provenance enforcement middleware**: every adapter response passes through a single validation function before any persistence — rejects payloads missing `source`/`timestamp`/`confidence` with `422 PROVENANCE_REQUIRED`, applied uniformly across F11/F12/F13/F15/F16/F17 rather than per-adapter reimplementation.
- **Record-authority check middleware**: before any inbound write to a record type with a declared external authority, consults `auth-org`'s `record_authority_registry`; conflicting writes are diverted to the relevant `*_conflicts` table (never silently overwritten) and surfaced via `SyncStatus`/integration-health.
- Background job scheduling and backoff (feed polling, sync reconciliation triggers) — registers job status to `background_jobs` (owned here, read by `auth-org`'s platform-health aggregator).
- Webhook delivery (outbound to registered subscribers) and inbound provider callback handling (F14).
- OPA policy client: federation-grant evaluation for any cross-jurisdiction data request, called per-request with no caching of a revoked grant.

### 2.2 Intelligence Layer (F9's AI Gateway — architectural detail)

The AI gateway is deployed as an independently-scalable service (own container/pod) behind the `comms-reporting` module's client, not a library embedded in the monolith, because:
1. Model inference workloads have different scaling/resource profiles (GPU/high-memory burst) than the rest of the API.
2. It must be swappable (model-neutral) without redeploying the application modules — the gateway exposes a stable internal interface (`draft(context, target_field) → {draft_text, sources, confidence_label}`) regardless of which underlying model/provider backs it.
3. Isolating it limits the blast radius of a prompt-injection or data-exfiltration concern to one component with its own network egress policy — retrieval is scoped to approved, pre-indexed EPMP sources only (incident records, plans, reviewed notes passed explicitly as context), never an open web-browsing tool.

See `04-security.md` §AI Governance Architecture for the enforcement chain detail.

### 2.3 Frontend Application Structure (React SPA)

```
src/
  app-shell/              # F0: SideNav, header strip, theme provider, route shell
  pages/
    dashboard/             # F2, F18: EOC/executive dashboard page pattern
    operating-picture/      # F2: MapCanvas-based page pattern
    incidents/              # F1: list, create, workspace, ICS form editor
    plans/                  # F3: repository, detail/reading view, editor, approval
    tasks-resources/        # F4: lists, forms, detail
    notifications/           # F5: recipient groups, templates, compose flow, delivery tracking
    field-mobile/             # F6: mobile-only routes (field home, my tasks, report, queued, conflicts, field map)
    reporting/                 # F7: SITREP/AAR, evidence/audit log, analytics
    admin/                      # F8, F10: admin console (users, roles, SSO config, integration health, platform monitoring, API clients, federation grants)
    ai-assist/                   # F9: signal triage queue (embedded AIDraft panels live inside each owning page, not a separate route)
  components/
    (none — exclusively consumes window.EPMP per the design-system-exclusivity
     hard constraint; no locally-defined visual components beyond thin
     page-composition wrappers)
  lib/
    api-client/             # typed fetch wrappers generated from the OpenAPI spec (see 03-api.md)
    offline/                 # SQLite local-cache layer, outbox queue, sync-batch orchestrator, Service Worker registration
    auth/                    # OIDC/SAML2 client (Keycloak adapter), token refresh, RBAC-driven route guards
    rbac/                     # role → nav/action visibility resolution (consumes /api/v1/me/nav-config)
```

**Design-system conformance enforcement:** a build-time lint step (per F0 S0.4/Validation) scans compiled output for raw hex colors, inline pixel values, and any component not imported from `window.EPMP`, blocking merge on violation — this is a CI gate, not a runtime check, and is the concrete implementation of the "Component Gap Escalation" process (F0 S0.4).

### 2.4 Cross-Module Interaction Rules

1. **No module writes directly to another module's tables.** Cross-module effects happen through explicit service-interface calls (e.g., `plans` calling `incident-ops`'s `TaskService.createFromTemplate(...)`) or through the event bus for asynchronous effects — never through a shared repository or raw SQL reaching across schema ownership boundaries.
2. **Append-only tables (`audit_log`, `incident_timeline`) have exactly one writer module each** (`auth-org`, `incident-ops` respectively), exposed as a narrow service call other modules invoke — this is what makes the FRD's "exactly one Timeline entry per state change" and "audit log immutable, enforced at the data layer" invariants actually enforceable rather than aspirational.
3. **The AI governance guard is a shared middleware, not duplicated logic** — any endpoint accepting a payload with an `ai_origin` field (ICS forms, notifications, SITREPs, AARs) runs the same `assertAiOriginApproved(payload)` check from a shared library, regardless of which module owns the endpoint.
4. **All inbound external data passes through `integration-gateway`'s provenance middleware before reaching any other module** — `incident-ops`, `plans`, and `comms-reporting` only ever see already-validated, provenance-tagged data for facility/hazard/CAD/roster/document content.
