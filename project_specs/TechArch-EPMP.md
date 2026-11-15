# TechArch — EPMP (Emergency Preparedness & Management Platform)

**Document type:** Technical Architecture Document
**Project acronym:** EPMP
**Status:** Draft v1 — architecture foundation for implementation
**Last updated:** 2026-11-14

**Source material:** `project_specs/PRD-EPMP.md` (vision, feature set F0–F18, NFRs, Section 4 Technical Architecture hypotheses), `project_specs/FRD-EPMP.md` and its chunked schema (`Y0a`–`Y0d`), API (`Y1a`–`Y1d`), error catalog (`Y2`), and integration index (`Y3`), `project_specs/ref_docs/TechSur_EPMP_Product_Definition.pdf.md` (Sections 11–12: source-proposed logical architecture and open-source stack hypotheses), `.planning/PROJECT.md`.

**Evidence boundary carried forward:** This document adopts the source's architecture *hypotheses* (Sections 11–12) as defaults and validates them against the FRD's committed MVP scope. Where the FRD's actual requirements argue for a deviation, that deviation is stated with rationale — this is not a rubber-stamp of the source PDF. No claim in this document asserts FedRAMP authorization; "NIST-aligned" and "FedRAMP-compatible patterns" describe architectural posture only, per the PRD's hard constraint (§6).

---

## 1. Architectural Overview

### 1.1 Architecture Pattern

EPMP is built as a **modular-monolith-first, domain-service-oriented backend** behind a single versioned API gateway, with a **React single-page application** (installable as a mobile-first PWA) as the sole UI client. This is a deliberate deviation from a full microservices decomposition at MVP stage:

- The FRD's ~45 tables group cleanly into 5 bounded contexts (Auth/Org, Incident/Ops, Plans/Comms/Reporting/AI, Integration/Geo) that the schema chunking (`Y0a`–`Y0d`) already mirrors — these become **modules within one deployable backend**, not five separately-deployed services, because MVP traffic/team size does not justify the operational overhead of inter-service network calls, distributed transactions, and five sets of CI/CD pipelines.
- Each module is internally cohesive (owns its tables, exposes its slice of the REST API) and communicates with other modules **in-process via well-defined service interfaces**, falling back to the event bus (Kafka/NATS) only for genuinely asynchronous, cross-cutting concerns (notification fan-out, feed ingestion, sync reconciliation, webhook delivery) — exactly the four background-job categories the FRD's F10 already names.
- This keeps a path open to extract a module into its own deployable service later (e.g., if hazard-feed ingestion volume or AI-gateway load outgrows the monolith) without a rewrite, because module boundaries are already enforced at the code and schema level.

**Why not full microservices at MVP:** The FRD's own MVP demonstration path (incident → activation → tasks/resources → operating picture → report) is a single coherent transaction graph across Incident/ICS, Tasks/Resources, and Reporting. Splitting these into separately-deployed services at MVP would require distributed transaction handling (sagas) for operations the FRD specifies as atomic (e.g., "every state-changing action... must write exactly one Timeline entry" — F1 validation) with no corresponding scale requirement to justify it. Genuinely independent-scaling concerns (hazard-feed ingestion, AI drafting, notification fan-out) are already isolated as background workers behind the event bus, which gives most of microservices' operational benefit (independent scaling, isolated failure) without its full cost.

**Why not a thin API-only backend with logic in the SPA:** The FRD's hard governance constraints (AI governance guard, record-authority enforcement, provenance validation, append-only audit/timeline) are explicitly specified as **server-side, API-boundary guards independent of which client calls them** (Y2, F9 Validation: "this is a server-side guard, not merely a UI convention"). These must live in the backend domain services, never in client code.

### 1.2 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              EXPERIENCE LAYER                                 │
│  ┌────────────────────────────┐   ┌─────────────────────────────────────┐    │
│  │  Web App (React SPA)        │   │  Field-Mobile (same React SPA,       │    │
│  │  window.EPMP Design System  │   │  installable PWA, offline-first)     │    │
│  │  - EOC dashboards           │   │  - SQLite (via sql.js/OPFS) local    │    │
│  │  - Incident workspace       │   │    cache + outbox queue              │    │
│  │  - Operating picture (map)  │   │  - Service Worker (Workbox) for      │    │
│  │  - Admin console            │   │    asset caching + background sync   │    │
│  └──────────────┬───────────────┘   └───────────────────┬───────────────┘    │
└─────────────────┼──────────────────────────────────────┼────────────────────┘
                   │  HTTPS / REST+JSON (OpenAPI)          │  HTTPS + sync-batch API
                   ▼                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY  (Kong / Envoy-class)                        │
│   TLS termination · rate limiting · OAuth2/OIDC token validation ·            │
│   request routing · versioning (/api/v1) · webhook egress proxy              │
└───────────────────────────────┬────────────────────────────────────────────-─┘
                                 ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER (modular monolith, containers)          │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────────┐  │
│ │ Auth/Org   │ │ Incident/  │ │ Plans &    │ │ Comms &    │ │ Integration │  │
│ │ & Admin    │ │ Ops        │ │ Playbooks  │ │ Reporting  │ │ Gateway     │  │
│ │ (F8,F16,   │ │ (F1,F2,F4, │ │ (F3)       │ │ (F5,F7)    │ │ (F10,F11–17)│  │
│ │  F18)      │ │  F6)       │ │            │ │            │ │             │  │
│ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └─────┬──────┘ └──────┬──────┘  │
│       │   in-process service calls  │               │               │        │
│       └──────────────┴──────────────┴───────────────┴───────────────┘        │
│                                      │                                        │
│                         ┌────────────▼─────────────┐                         │
│                         │  INTELLIGENCE LAYER (F9)  │                         │
│                         │  Model-neutral AI gateway │                         │
│                         │  AIDraft + Provenance     │                         │
│                         │  enforcement middleware   │                         │
│                         └────────────┬─────────────┘                         │
└──────────────────────────────────────┼────────────────────────────────────-──┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                               EXCHANGE LAYER                                  │
│  ┌──────────────┐  ┌─────────────────────┐  ┌───────────────────────────┐    │
│  │ Event Bus     │  │ Background Workers   │  │ Policy Engine (OPA)       │    │
│  │ (NATS         │  │ (notification fanout,│  │ federation grants,        │    │
│  │  JetStream)   │  │  feed ingestion,     │  │ jurisdiction scope,       │    │
│  │               │  │  sync reconciliation,│  │ RBAC authorization        │    │
│  │               │  │  report generation,  │  │ decisions                 │    │
│  │               │  │  webhook delivery)   │  │                           │    │
│  └──────────────┘  └─────────────────────┘  └───────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────-─┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                                  DATA LAYER                                   │
│  ┌────────────────────┐  ┌───────────────┐  ┌──────────────────────────┐     │
│  │ PostgreSQL 16 +     │  │ Object Storage │  │ Search Index              │     │
│  │ PostGIS 3.4         │  │ (S3-compatible,│  │ (Postgres full-text at    │     │
│  │ (operational +      │  │  field photos, │  │  MVP scale; OpenSearch    │     │
│  │  geospatial +       │  │  documents)    │  │  if volume grows)         │     │
│  │  append-only audit/ │  │                │  │                           │     │
│  │  timeline tables)   │  │                │  │                           │     │
│  └────────────────────┘  └───────────────┘  └──────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────────-─┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                           IDENTITY & AUTHORIZATION                            │
│         Keycloak (OIDC/SAML2 IdP broker + agency federation) + OPA            │
└────────────────────────────────────────────────────────────────────────────-─┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SYSTEMS                                 │
│  EOC COTS (WebEOC/Veoci/DisasterLAN) · GIS (Esri/OSM/agency) · NOAA/NWS/USGS  │
│  · Everbridge/AtHoc · FEMA IPAWS/CAP · CAD/911 · HR/IAM (HRIS) · ERP/asset ·  │
│  SharePoint/document systems                                                  │
└────────────────────────────────────────────────────────────────────────────-─┘

   CROSS-CUTTING (all layers): Identity · Audit (append-only) · Encryption ·
   Observability (metrics/traces/logs) · Resilience (retry/backoff/circuit-break) ·
   Data governance (record authority, provenance, federation policy)
```

### 1.3 Layer-by-Layer Mapping to Source Architecture (Section 11)

| Source layer | EPMP implementation | Deviation / rationale |
|---|---|---|
| Experience | React SPA, `window.EPMP` design system, installable PWA | **React chosen, not Vue** — the EPMP Design System's 40-component library (`EPMP-Design-System.pdf.md`) is implemented and shipped as React components under `window.EPMP`; using Vue would require either a wrapper/adapter layer (re-implementing 40 components) or web-component wrapping, both adding risk and time with zero product benefit. React is adopted as a hard requirement, not merely a default. |
| Application | Modular monolith: Auth/Org, Incident/Ops, Plans, Comms/Reporting, Integration Gateway modules | Source proposes "modular domain services behind versioned REST APIs" (PRD §4) — implemented as in-process modules at MVP scale rather than network-separated services (see §1.1 rationale) |
| Intelligence | Model-neutral AI gateway (F9) sitting behind the Application layer, never called directly by any writing endpoint without the AIDraft/Provenance guard | Matches source Section 11/13 exactly: "retrieval scoped to approved sources; AIDraft + Provenance enforced at the API boundary" |
| Data | PostgreSQL 16 + PostGIS 3.4; S3-compatible object storage for documents/photos; Postgres full-text search at MVP scale | Matches source. Dedicated search engine (OpenSearch/Elasticsearch) deferred until the `GET /api/v1/search` (F0) load profile demonstrates Postgres `tsvector` is insufficient — avoids running a second stateful cluster at MVP scale. |
| Exchange | Kong/Envoy-class API gateway; NATS JetStream event bus; OPA policy engine | **NATS chosen over Kafka** (both were source hypotheses) — see §1.4 rationale |
| External | Approved adapters per F11–F17, each isolated behind the Integration Gateway module | Matches source; see `06-integrations.md` for per-system adapter design |

### 1.4 Key Architectural Decisions & Rationale

| Decision | Options considered | Choice | Rationale |
|---|---|---|---|
| UI framework | React, Vue | **React** | EPMP Design System's `window.EPMP` component set is pre-built in React (per FRD F0 conventions and `EPMP-Design-System.pdf.md`); consuming it directly avoids a wrapper/adapter layer entirely. This elevates the source's "React or Vue" hypothesis to a hard requirement. |
| Event bus | Kafka, NATS | **NATS (JetStream)** | FRD's actual async workload (F10 background jobs: notification fan-out, feed ingestion, sync reconciliation, report generation; webhook delivery with idempotency keys) is moderate-throughput, latency-sensitive, multi-tenant-filtered messaging — not the high-volume log-aggregation/stream-processing workload Kafka is built for. NATS JetStream gives durable, at-least-once delivery, consumer groups, and dramatically lower operational overhead (single binary, no ZooKeeper/KRaft cluster, no partition-rebalancing tuning) — a better fit for a platform that must also run in constrained/on-prem agency environments per the "portable deployment artifacts" NFR. Kafka remains a documented upgrade path if a future phase's event volume (e.g., continuous monitoring, Phase 2/3 AI telemetry) demands it. |
| IAM / authorization | Keycloak, enterprise IdP federation, OPA | **Keycloak (IdP broker) + OPA (policy engine)** | Matches source directly. Keycloak brokers SAML2/OIDC against each agency's own IdP (satisfying F8/F16's "SSO against an agency IdP" without EPMP becoming an identity system of record) and OPA evaluates jurisdiction-scope, RBAC, and federation-grant policy as externalized, auditable Rego rules rather than if/else logic buried in application code — directly satisfying F10's "policy-enforced, revocable federation" and "no caching window that honors a revoked credential" requirements. |
| Operational/geospatial data | PostgreSQL+PostGIS vs. separate GIS datastore | **PostgreSQL 16 + PostGIS 3.4** | Matches source and FRD schema conventions exactly (`GEOGRAPHY` columns already specified in `Y0b`/`Y0d`). A single RDBMS for both operational and geospatial data simplifies backup/DR, avoids dual-write consistency problems between an operational DB and a separate spatial store, and is sufficient at MVP scale (facility/hazard/dispatch point and polygon data, not high-frequency sensor streams). |
| Offline field-mobile cache | SQLite, IndexedDB, PouchDB | **SQLite via `sql.js`/OPFS (or Capacitor SQLite if a later native wrapper is added), with IndexedDB as the outbox/blob fallback** | Matches source hypothesis. SQLite gives a relational local store matching the server schema's shape (tasks, field_reports, sync_conflicts) closely enough that reconciliation logic can be shared conceptually between client and server; IndexedDB handles binary photo blobs pending upload. See `04-security.md`/offline section for full sync design. |
| Deployment / compute | VMs, serverless, Kubernetes | **Containers + Kubernetes, with a documented single-node/Docker Compose fallback for small agency/on-prem deployments** | Matches source ("Kubernetes/containers where justified"). Kubernetes is justified by the NFR for "portable deployment artifacts" so agencies "are not locked into EPMP's hosting" — K8s manifests/Helm charts are themselves the portable artifact. A Compose-based reference deployment is documented for pilot/small-county agencies for whom a K8s control plane is disproportionate operational burden, directly addressing PRD Risk "long government procurement cycles... slow adoption feedback." |
| API style | REST, GraphQL, gRPC | **REST + JSON, OpenAPI-documented** | FRD §Conventions and PRD §6 NFR ("Standards support at the interface layer") commit to this explicitly; GraphQL/gRPC would conflict with the open-standards/interoperability-first NFR and the webhook/CAP/EDXL alignment already specified. |
| Search | Postgres full-text, OpenSearch/Elasticsearch | **Postgres `tsvector`/`pg_trgm` at MVP; OpenSearch documented as the scale-out path** | F0's global search (`GET /api/v1/search`) spans incidents/plans/tasks/resources at an MVP data volume well within Postgres full-text capability; avoids a second stateful system to operate/secure/backup at MVP. |

### 1.5 Deployment Topology

```
                         ┌─────────────────────────────┐
                         │   DNS / CDN (static assets,  │
                         │   SPA bundle, Workbox SW)     │
                         └──────────────┬───────────────┘
                                        ▼
                         ┌─────────────────────────────┐
                         │  Ingress / API Gateway        │
                         │  (TLS term., WAF, rate limit) │
                         └──────────────┬───────────────┘
                                        ▼
         ┌──────────────────────────────────────────────────────────┐
         │                 Kubernetes Cluster (per deployment)        │
         │  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
         │  │ API pods   │ │ Worker pods │ │ AI-gateway  │            │
         │  │ (modular   │ │ (background │ │ pods        │            │
         │  │  monolith, │ │  jobs,      │ │ (F9, scaled │            │
         │  │  HPA 2–N)  │ │  consumers) │ │  independ.) │            │
         │  └─────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
         │        │                │                │                 │
         │  ┌─────▼────────────────▼────────────────▼──────┐          │
         │  │          NATS JetStream (durable queue)        │          │
         │  └────────────────────────────────────────────────┘          │
         │  ┌────────────┐  ┌───────────────┐  ┌──────────┐           │
         │  │ Keycloak    │  │ OPA sidecar/   │  │ Ingress   │           │
         │  │ (StatefulSet│  │ service        │  │ controller│           │
         │  └────────────┘  └───────────────┘  └──────────┘           │
         └──────────────────────────┬───────────────────────────────┘
                                     ▼
         ┌──────────────────────────────────────────────────────────┐
         │   Managed PostgreSQL 16 + PostGIS (HA: primary + replica,  │
         │   point-in-time recovery, encrypted at rest)                │
         └──────────────────────────────────────────────────────────┘
         ┌──────────────────────────────────────────────────────────┐
         │   S3-compatible object storage (photos, documents, exports) │
         └──────────────────────────────────────────────────────────┘

  Deployment profiles:
  - Cloud/managed: full K8s cluster per agency tenant or shared multi-tenant cluster
    with jurisdiction-scoped RBAC/RLS (see 04-security.md).
  - Small-agency/on-prem: Docker Compose reference stack (API, worker, Postgres,
    NATS, Keycloak as single-node containers) — same images, reduced HA, documented
    upgrade path to full K8s.
  - Air-gapped/high-ATO-expectation agencies: all images mirrorable to an agency-
    controlled registry; no mandatory outbound call to an EPMP-operated SaaS
    control plane for core operation (supports "customer control"/"data portability"
    NFR and avoids a FedRAMP-authorization claim EPMP does not hold).
```

### 1.6 Multi-Tenancy & Jurisdiction Model

Per the FRD's "Tenant / Jurisdiction" terminology and `jurisdictions` table (self-referencing hierarchy: state → county → city, or federal/critical-infrastructure), EPMP uses a **single-database, shared-schema multi-tenancy model with row-level jurisdiction scoping**, not a database-per-tenant model:

- Every tenant-scoped table carries (directly or via its parent incident/plan) a `jurisdiction_id`.
- PostgreSQL **Row-Level Security (RLS) policies** enforce jurisdiction-scope filtering at the database layer as a defense-in-depth measure beneath the OPA-enforced application-layer checks — so a bug in application-layer filtering cannot leak cross-jurisdiction data.
- Cross-jurisdiction visibility is granted exclusively through `federation_grants` (F10), evaluated by OPA per-request, never by broadening a user's base `jurisdiction_scope`.
- A large agency (e.g., a state EOC) may itself be deployed on a dedicated cluster/database for isolation/compliance reasons; the shared-schema model does not preclude single-tenant deployment — it is the default for cost-efficient smaller-agency and SaaS-posture deployments.
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
## 3. Data Model

### 3.1 Overview & Conventions

The data model directly reconciles the FRD's `Y0a`–`Y0d` schema chunks into one coherent PostgreSQL 16 + PostGIS 3.4 DDL, organized into four domain files below (mirroring the FRD's own chunking, since it already reflects clean bounded-context boundaries). No entity, relationship, or constraint from the FRD schema chunks has been dropped; a small number of forward-reference FKs that the FRD left as prose cross-references (e.g., `tasks.plan_section_id → plan_sections`, `signal_source_events.hazard_feed_event_id → hazard_feed_events`, `notifications.ai_draft_id → ai_drafts`) are made explicit here since the full cross-file picture is now available.

**Global conventions (apply to every table unless stated otherwise):**
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (omitted on append-only and pure-event tables)
- `created_by`/`updated_by UUID REFERENCES users(id)` where the FRD specifies named-person accountability
- Append-only tables (`audit_log`, `incident_timeline`) have **no UPDATE or DELETE grants** at the database-role level for the application's runtime DB user — enforced via `REVOKE UPDATE, DELETE ON audit_log, incident_timeline FROM app_runtime;` in addition to the application-layer convention, satisfying F8's "enforced at the data layer, not just the UI" requirement.
- All `GEOGRAPHY`/`GEOMETRY` columns use SRID 4326 (WGS84), consistent with GeoJSON/OGC interchange.
- Enum-like status columns are implemented as `VARCHAR` + `CHECK` constraint (not native Postgres `ENUM` types) to allow adding a new status value via a migration without an `ALTER TYPE` lock — a pragmatic choice for a schema that will evolve across MVP iterations.

### 3.2 Entity-Relationship Diagram (high-level, cross-domain)

```
                         ┌──────────────┐
                         │ jurisdictions │◄─────────────────────────┐
                         └──────┬───────┘                           │
                                │ 1:N                                │
                  ┌─────────────┼──────────────┐                     │
                  ▼             ▼              ▼                     │
            ┌──────────┐  ┌──────────┐   ┌───────────┐               │
            │  users   │  │   plans   │   │ incidents │               │
            └────┬─────┘  └────┬─────┘   └─────┬─────┘               │
                 │ role_id      │ 1:N sections   │ 1:N                 │
                 ▼              ▼               ├──────────────┬──────┴────────┐
            ┌──────────┐  ┌──────────────┐      ▼              ▼               ▼
            │  roles   │  │ plan_sections │ ┌──────────┐ ┌─────────────┐ ┌───────────────┐
            └──────────┘  └──────┬───────┘ │ incident_ │ │ incident_   │ │   ics_forms    │
                                 │ 1:N       │ command_  │ │ timeline    │ │  (ai_origin,   │
                                 ▼           │ roles     │ │ (append-   │ │   approved_by) │
                         ┌───────────────┐  └──────────┘ │  only)     │ └───────┬────────┘
                         │ plan_task_     │               └────────────┘         │
                         │ templates      │                      ▲               │ ai_drafts
                         └───────┬────────┘                      │ FK            ▼
                                 │ materializes                   │        ┌───────────┐
                                 ▼                                │        │ ai_drafts │
                         ┌──────────────┐    1:N     ┌────────────┴──┐    └───────────┘
                         │    tasks      │◄───────────┤ task_status_   │
                         └──────┬───────┘             │ history        │
                                 │ 1:N                 └────────────────┘
                                 ▼
                         ┌──────────────────┐   1:N   ┌────────────────────────────┐
                         │ resource_requests  │◄────────┤ resource_request_status_   │
                         └──────────────────┘          │ history                      │
                                                        └────────────────────────────┘
      incidents ──1:N──► field_reports ──1:N──► field_report_photos
      incidents ──1:N──► sync_conflicts (via entity_type/entity_id polymorphic ref)
      incidents ──1:N──► notifications ──1:N──► notification_recipients ──1:1──► notification_delivery_status
      incidents ──1:N──► sitreps, aars ──1:N──► aar_findings
      incidents ──1:N──► cad_dispatch_events (F15, read-only)
      hazard_feed_events ──1:N──► hazard_layers; ──1:N──► signal_source_events ──N:1──► signals
      users ──1:N──► audit_log, federation_grants(granted_by), api_clients(via admin action)
```

### 3.3 Domain Schema Files

The full DDL is organized into four domain files, each independently loadable as a migration group:

| File | Domain | Owning features | Table count |
|---|---|---|---|
| [`02a-data-auth-org.md`](./02a-data-auth-org.md) | Identity, RBAC, audit, platform API/federation, HR/IAM reference, persona config | F8, F10, F16, F18 | 13 |
| [`02b-data-incident-ops.md`](./02b-data-incident-ops.md) | Incident/ICS, tasks/resources, field operations | F1, F4, F6 | 11 |
| [`02c-data-plans-comms-reporting.md`](./02c-data-plans-comms-reporting.md) | Plans/playbooks, notifications, reporting/AAR, AI assistance | F3, F5, F7, F9, F14 | 18 |
| [`02d-data-integration-geo.md`](./02d-data-integration-geo.md) | GIS, hazard feeds, EOC COTS, CAD/911, asset/facility/document | F11, F12, F13, F15, F17 | 11 |

**Total: 53 tables** (FRD's ~45 estimate plus the explicit forward-reference reconciliation above; no duplicate counting across domain files — each table is defined exactly once in its owning file).

### 3.4 Row-Level Security Pattern (applied across jurisdiction-scoped tables)

In addition to the DDL in each domain file, every jurisdiction-scoped table (`incidents`, `plans`, and any table reachable from them) carries this RLS policy pattern, enabled as a second line of defense beneath OPA's application-layer authorization (see `01-components.md` §2.4 and `04-security.md`):

```sql
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY incident_jurisdiction_scope ON incidents
  USING (
    jurisdiction_id = ANY(current_setting('app.jurisdiction_scope')::UUID[])
    OR current_setting('app.jurisdiction_scope') = 'all'
  );
```

The application sets `app.jurisdiction_scope` as a session-local Postgres variable immediately after authenticating each request (derived from `users.jurisdiction_scope` plus any active `federation_grants`), before any query executes. This pattern is repeated for `plans` and is inherited transitively for child tables (`incident_timeline`, `tasks`, `resource_requests`, etc.) via a `USING (incident_id IN (SELECT id FROM incidents))` policy, avoiding duplicated jurisdiction columns on every child table.
## 3a. Data Model — Auth, Organization & Platform Core

Owning features: F8 (Security & Administration), F10 (Platform API/Federation), F16 (HR/IAM reference data), F18 (persona landing config), F0 (session/theme — reads `users` only).

### Jurisdictions & RBAC

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(50) NOT NULL
    CHECK (type IN ('state','county','city','federal','critical_infrastructure')),
  parent_jurisdiction_id UUID REFERENCES jurisdictions(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  persona_id VARCHAR(10) NOT NULL
    CHECK (persona_id IN ('PER-01','PER-02','PER-03','PER-04','PER-05')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(320) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  role_id UUID NOT NULL REFERENCES roles(id),
  jurisdiction_scope UUID[] NOT NULL DEFAULT '{}',
  theme_preference VARCHAR(10) NOT NULL DEFAULT 'light'
    CHECK (theme_preference IN ('light','dark','contrast')),
  status VARCHAR(20) NOT NULL DEFAULT 'Active'
    CHECK (status IN ('Active','Suspended')),
  idp_subject VARCHAR(500),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id),
  feature VARCHAR(50) NOT NULL,
  actions TEXT[] NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id),
  UNIQUE (role_id, feature)
);

CREATE TABLE sso_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol VARCHAR(10) NOT NULL CHECK (protocol IN ('SAML2','OIDC')),
  idp_metadata_url TEXT,
  idp_metadata_xml TEXT,
  attribute_mapping JSONB NOT NULL,
  group_to_role_mapping JSONB NOT NULL,
  tested_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_idp_metadata CHECK (idp_metadata_url IS NOT NULL OR idp_metadata_xml IS NOT NULL)
);

-- Append-only: REVOKE UPDATE/DELETE from app_runtime role after creation.
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  record_type VARCHAR(50),
  record_id UUID,
  detail JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
REVOKE UPDATE, DELETE ON audit_log FROM app_runtime;

CREATE TABLE integration_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL UNIQUE,
  last_sync_at TIMESTAMPTZ,
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound','bidirectional')),
  record_authority VARCHAR(100) NOT NULL,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'online'
    CHECK (sync_status IN ('online','syncing','offline','conflict')),
  error_count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Platform API, Federation & Event Bus (F10)

```sql
CREATE TABLE api_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name VARCHAR(200) NOT NULL,
  client_secret_hash TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  revoked BOOLEAN NOT NULL DEFAULT false,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  api_client_id UUID NOT NULL REFERENCES api_clients(id),
  callback_url TEXT NOT NULL,
  event_types TEXT[] NOT NULL,
  secret_hash TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE webhook_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES webhook_subscriptions(id),
  idempotency_key VARCHAR(200) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  delivery_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (delivery_status IN ('pending','delivered','failed')),
  attempt_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (subscription_id, idempotency_key)
);

CREATE TABLE record_authority_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_type VARCHAR(100) NOT NULL UNIQUE,
  authoritative_system VARCHAR(100) NOT NULL,
  notes TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES users(id)
);

CREATE TABLE federation_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  scope JSONB NOT NULL,
  granted_by UUID NOT NULL REFERENCES users(id),
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active','Revoked')),
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_scope_not_empty CHECK (jsonb_typeof(scope->'record_types') = 'array' AND jsonb_array_length(scope->'record_types') > 0)
);

CREATE TABLE background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type VARCHAR(100) NOT NULL
    CHECK (job_type IN ('notification_fanout','feed_ingestion','sync_reconciliation','report_generation','webhook_delivery','signal_triage')),
  status VARCHAR(20) NOT NULL DEFAULT 'idle' CHECK (status IN ('idle','running','failed','backoff')),
  last_run_at TIMESTAMPTZ,
  failure_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### HR/IAM Integration Reference Data (F16)

```sql
CREATE TABLE personnel_roster (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_person_id VARCHAR(200) NOT NULL,
  matched_user_id UUID REFERENCES users(id),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(320),
  role_titles TEXT[],
  qualifications TEXT[],
  contact_info JSONB,
  jurisdiction_id UUID REFERENCES jurisdictions(id),
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_person_id, source)
);
```

### Persona Views Reference Config (F18)

```sql
CREATE TABLE role_landing_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) UNIQUE,
  default_landing_route VARCHAR(200) NOT NULL,
  nav_groups JSONB NOT NULL,
  mobile_bottom_bar_items JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_bottom_bar_max CHECK (mobile_bottom_bar_items IS NULL OR jsonb_array_length(mobile_bottom_bar_items) <= 4)
);
```

### Indexes

```sql
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_jurisdiction_scope ON users USING GIN(jurisdiction_scope);
CREATE INDEX idx_audit_log_actor_time ON audit_log(actor_id, occurred_at DESC);
CREATE INDEX idx_audit_log_record ON audit_log(record_type, record_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(delivery_status, next_retry_at);
CREATE INDEX idx_personnel_roster_email ON personnel_roster(email);
CREATE INDEX idx_personnel_roster_matched_user ON personnel_roster(matched_user_id);
CREATE INDEX idx_federation_grants_jurisdiction ON federation_grants(partner_jurisdiction_id, status);
CREATE INDEX idx_background_jobs_type_status ON background_jobs(job_type, status);
CREATE INDEX idx_jurisdictions_parent ON jurisdictions(parent_jurisdiction_id);
```
## 3b. Data Model — Incident Operations

Owning features: F1 (Incident/ICS), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations). Forward reference: `tasks.plan_section_id` resolves to `plan_sections` defined in `02c-data-plans-comms-reporting.md`.

### Incident / ICS (F1)

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100) NOT NULL
    CHECK (type IN ('Flood','Wildfire','Severe Weather','HazMat','Public Health','Other')),
  severity VARCHAR(20) NOT NULL CHECK (severity IN ('Critical','Elevated','Watch','Normal')),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  description TEXT CHECK (char_length(description) <= 2000),
  activation_level VARCHAR(20) NOT NULL DEFAULT 'Monitoring'
    CHECK (activation_level IN ('Monitoring','Partial','Full')),
  status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open','Closed')),
  opened_at TIMESTAMPTZ NOT NULL,
  closed_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_name_length CHECK (char_length(name) BETWEEN 3 AND 200)
);
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE TABLE incident_command_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  role_title VARCHAR(100) NOT NULL
    CHECK (role_title IN ('Incident Commander','Planning','Logistics','Operations','Finance/Admin','Public Information')),
  person_id UUID NOT NULL REFERENCES users(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID NOT NULL REFERENCES users(id),
  unassigned_at TIMESTAMPTZ
);

-- Append-only: REVOKE UPDATE/DELETE from app_runtime after creation.
CREATE TABLE incident_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  title VARCHAR(300) NOT NULL,
  meta TEXT,
  tone VARCHAR(20) NOT NULL DEFAULT 'brand' CHECK (tone IN ('brand','success','warning','danger')),
  actor_id UUID REFERENCES users(id),
  source VARCHAR(100) NOT NULL,
  detail JSONB
);
REVOKE UPDATE, DELETE ON incident_timeline FROM app_runtime;

CREATE TABLE ics_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  form_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Approved')),
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_ai_requires_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL)),
  CONSTRAINT chk_approved_requires_reviewer CHECK (status != 'Approved' OR (approved_by IS NOT NULL AND approved_at IS NOT NULL))
);
```

### Tasks & Resources (F4)

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL CHECK (char_length(title) BETWEEN 3 AND 200),
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'Open'
    CHECK (status IN ('Open','In progress','Awaiting approval','Done','Overdue')),
  owner_id UUID NOT NULL REFERENCES users(id),
  incident_id UUID REFERENCES incidents(id),
  plan_section_id UUID REFERENCES plan_sections(id),
  due_at TIMESTAMPTZ NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT false,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE task_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE resource_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('Personnel','Equipment','Supplies')),
  description TEXT NOT NULL CHECK (char_length(description) <= 1000),
  quantity INTEGER NOT NULL CHECK (quantity >= 1),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft'
    CHECK (status IN ('Draft','Awaiting approval','Approved','Fulfilled','Declined')),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  task_id UUID REFERENCES tasks(id),
  requesting_role VARCHAR(100) NOT NULL,
  needed_by TIMESTAMPTZ NOT NULL,
  requested_by UUID NOT NULL REFERENCES users(id),
  approved_by UUID REFERENCES users(id),
  decline_reason TEXT,
  assigned_to VARCHAR(200),
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_decline_requires_reason CHECK (NOT (status = 'Declined' AND decline_reason IS NULL))
);

CREATE TABLE resource_request_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_request_id UUID NOT NULL REFERENCES resource_requests(id),
  from_status VARCHAR(20),
  to_status VARCHAR(20) NOT NULL,
  changed_by UUID NOT NULL REFERENCES users(id),
  changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Field Operations (F6)

```sql
CREATE TABLE field_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_report_id VARCHAR(100) NOT NULL UNIQUE,
  incident_id UUID REFERENCES incidents(id),
  observation_type VARCHAR(100) NOT NULL,
  description TEXT,
  location GEOGRAPHY(POINT, 4326),
  location_accuracy_m NUMERIC,
  submitted_by UUID NOT NULL REFERENCES users(id),
  captured_at TIMESTAMPTZ NOT NULL,
  synced_at TIMESTAMPTZ,
  sync_status VARCHAR(20) NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced','conflict','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_report_not_empty CHECK (description IS NOT NULL OR location IS NOT NULL)
);

CREATE TABLE field_report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_report_id UUID NOT NULL REFERENCES field_reports(id),
  storage_ref TEXT,
  upload_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending','uploaded','failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  field_version JSONB NOT NULL,
  eoc_version JSONB NOT NULL,
  resolution VARCHAR(20) CHECK (resolution IN ('keep_mine','keep_eoc')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Indexes

```sql
CREATE INDEX idx_incidents_jurisdiction_status ON incidents(jurisdiction_id, status);
CREATE INDEX idx_incidents_severity ON incidents(severity) WHERE status = 'Open';
CREATE INDEX idx_incident_command_roles_incident ON incident_command_roles(incident_id) WHERE unassigned_at IS NULL;
CREATE INDEX idx_incident_timeline_incident_time ON incident_timeline(incident_id, occurred_at DESC);
CREATE INDEX idx_ics_forms_incident ON ics_forms(incident_id, status);
CREATE INDEX idx_tasks_owner_status ON tasks(owner_id, status);
CREATE INDEX idx_tasks_incident ON tasks(incident_id);
CREATE INDEX idx_tasks_plan_section ON tasks(plan_section_id);
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE status NOT IN ('Done');
CREATE INDEX idx_task_status_history_task ON task_status_history(task_id, changed_at DESC);
CREATE INDEX idx_resource_requests_incident_status ON resource_requests(incident_id, status);
CREATE INDEX idx_resource_requests_task ON resource_requests(task_id);
CREATE INDEX idx_field_reports_incident ON field_reports(incident_id);
CREATE INDEX idx_field_reports_location ON field_reports USING GIST(location);
CREATE INDEX idx_field_reports_submitted_by ON field_reports(submitted_by);
CREATE INDEX idx_field_report_photos_report ON field_report_photos(field_report_id);
CREATE INDEX idx_sync_conflicts_unresolved ON sync_conflicts(entity_type) WHERE resolution IS NULL;
```

### Transactional Invariant: Timeline Write Atomicity

Per FRD F1 Validation ("every state-changing action... must write exactly one Timeline entry with a non-null actor and source") and the `TIMELINE_WRITE_FAILED` error contract, every `incident-ops` module write path that mutates `incidents`, `incident_command_roles`, `tasks`, or `resource_requests` wraps the domain mutation and the corresponding `incident_timeline` INSERT in a **single database transaction**. If the timeline insert fails, the entire transaction rolls back and the API returns `500 TIMELINE_WRITE_FAILED` rather than leaving a state change unrecorded.
## 3c. Data Model — Plans, Notifications, Reporting & AI

Owning features: F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage), F14 (Notification Provider Integration). Forward reference resolved: `signal_source_events.hazard_feed_event_id → hazard_feed_events` (defined in `02d-data-integration-geo.md`); `notifications.ai_draft_id` and `ics_forms.ai_draft_id` reference `ai_drafts` defined below (load this file before `02b` in migration order, or defer the FK as `ALTER TABLE ... ADD CONSTRAINT` after both exist).

### Plans & Playbooks (F3)

```sql
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL CHECK (char_length(name) BETWEEN 3 AND 200),
  type VARCHAR(20) NOT NULL CHECK (type IN ('EOP','SOP','Annex')),
  jurisdiction_id UUID NOT NULL REFERENCES jurisdictions(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Review','Approved')),
  current_version INTEGER NOT NULL DEFAULT 1,
  source_document_ref TEXT,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE TABLE plan_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  version_number INTEGER NOT NULL,
  content_snapshot JSONB NOT NULL,
  submitted_by UUID REFERENCES users(id),
  reviewed_by UUID REFERENCES users(id),
  review_action VARCHAR(20) CHECK (review_action IN ('approve','request_changes')),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (plan_id, version_number),
  CONSTRAINT chk_no_self_approval CHECK (reviewed_by IS NULL OR submitted_by IS NULL OR reviewed_by != submitted_by)
);

CREATE TABLE plan_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id),
  heading VARCHAR(300) NOT NULL,
  body TEXT,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE plan_task_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_section_id UUID NOT NULL REFERENCES plan_sections(id),
  default_title VARCHAR(200) NOT NULL,
  default_owner_role VARCHAR(100),
  default_due_offset_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE document_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES plans(id),
  external_document_id VARCHAR(300) NOT NULL,
  source_system VARCHAR(100) NOT NULL,
  mode VARCHAR(20) NOT NULL CHECK (mode IN ('import_copy','link_live')),
  imported_by UUID NOT NULL REFERENCES users(id),
  last_permission_check_at TIMESTAMPTZ,
  permission_status VARCHAR(20) NOT NULL DEFAULT 'valid' CHECK (permission_status IN ('valid','revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### AI Assistance (F9) — defined before Notifications/ICS forms reference it

```sql
CREATE TABLE ai_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_feature VARCHAR(50) NOT NULL CHECK (target_feature IN ('ics_form','notification','sitrep','aar')),
  target_field VARCHAR(100) NOT NULL,
  draft_text TEXT NOT NULL,
  sources JSONB NOT NULL DEFAULT '[]',
  confidence_label VARCHAR(10) NOT NULL CHECK (confidence_label IN ('High','Medium','Low')),
  requesting_user_id UUID NOT NULL REFERENCES users(id),
  action VARCHAR(20) CHECK (action IN ('approve','edit','discard')),
  edited_text TEXT,
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_approve_requires_named_user CHECK (action != 'approve' OR approved_by IS NOT NULL),
  CONSTRAINT chk_sources_or_flagged CHECK (jsonb_array_length(sources) > 0 OR draft_text ILIKE '%no source%' OR draft_text ILIKE '%low confidence%')
);

CREATE TABLE signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary TEXT NOT NULL,
  confidence_label VARCHAR(10) NOT NULL CHECK (confidence_label IN ('High','Medium','Low')),
  confidence_reason TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'New' CHECK (status IN ('New','Dismissed','Promoted')),
  dismissed_reason TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_dismissed_requires_reason CHECK (status != 'Dismissed' OR dismissed_reason IS NOT NULL)
);

CREATE TABLE signal_source_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES signals(id),
  hazard_feed_event_id UUID REFERENCES hazard_feed_events(id),
  source VARCHAR(100) NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL
);
```

### Notifications (F5)

```sql
CREATE TABLE recipient_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('Role','Jurisdiction','Geography')),
  selector JSONB NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100),
  body TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  message_body TEXT NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  channels TEXT[] NOT NULL,
  recipient_group_ids UUID[] NOT NULL DEFAULT '{}',
  geotarget_polygon GEOGRAPHY(POLYGON, 4326),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_send_requires_approval CHECK (NOT (sent_at IS NOT NULL AND approved_by IS NULL)),
  CONSTRAINT chk_ai_origin_requires_approval CHECK (NOT (ai_origin AND sent_at IS NOT NULL AND approved_by IS NULL)),
  CONSTRAINT chk_audience_present CHECK (array_length(recipient_group_ids, 1) > 0 OR geotarget_polygon IS NOT NULL)
);

CREATE TABLE notification_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  recipient_name VARCHAR(200),
  recipient_contact VARCHAR(300),
  channel VARCHAR(50) NOT NULL
);

CREATE TABLE notification_delivery_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_recipient_id UUID NOT NULL REFERENCES notification_recipients(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Queued'
    CHECK (status IN ('Queued','Sent','Delivered','Failed','Acknowledged')),
  failure_reason TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Notification Provider Integration (F14)

```sql
CREATE TABLE notification_provider_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(100) NOT NULL,
  channel_types TEXT[] NOT NULL,
  is_public_warning_channel BOOLEAN NOT NULL DEFAULT false,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_dispatch_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  provider_name VARCHAR(100) NOT NULL,
  external_message_id VARCHAR(300),
  dispatch_status VARCHAR(20) NOT NULL DEFAULT 'pending',
  dispatched_at TIMESTAMPTZ,
  retry_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE cap_alert_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id),
  cap_identifier VARCHAR(300) NOT NULL,
  sender VARCHAR(300) NOT NULL,
  cap_xml TEXT NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Reporting & Learning (F7)

```sql
CREATE TABLE sitreps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id),
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Approved')),
  content JSONB NOT NULL,
  ai_origin BOOLEAN NOT NULL DEFAULT false,
  ai_draft_id UUID REFERENCES ai_drafts(id),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_sitrep_ai_approval CHECK (NOT (ai_origin AND status = 'Approved' AND approved_by IS NULL))
);

CREATE TABLE aars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID NOT NULL REFERENCES incidents(id) UNIQUE,
  timeline_export JSONB NOT NULL,
  decisions_log JSONB NOT NULL,
  resource_history JSONB NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Finalized')),
  finalized_by UUID REFERENCES users(id),
  finalized_at TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_finalized_requires_signoff CHECK (status != 'Finalized' OR (finalized_by IS NOT NULL AND finalized_at IS NOT NULL))
);

CREATE TABLE aar_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aar_id UUID NOT NULL REFERENCES aars(id),
  finding_text TEXT NOT NULL,
  category VARCHAR(100),
  corrective_action TEXT,
  owner_id UUID REFERENCES users(id),
  due_date DATE,
  closure_status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (closure_status IN ('Open','Closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_corrective_action_owned CHECK (corrective_action IS NULL OR (owner_id IS NOT NULL AND due_date IS NOT NULL))
);
```

### Indexes

```sql
CREATE INDEX idx_plans_jurisdiction_status ON plans(jurisdiction_id, status);
CREATE INDEX idx_plan_versions_plan ON plan_versions(plan_id, version_number DESC);
CREATE INDEX idx_plan_sections_plan ON plan_sections(plan_id, sort_order);
CREATE INDEX idx_plan_task_templates_section ON plan_task_templates(plan_section_id);
CREATE INDEX idx_document_links_plan ON document_links(plan_id);
CREATE INDEX idx_notifications_incident ON notifications(incident_id);
CREATE INDEX idx_notifications_geotarget ON notifications USING GIST(geotarget_polygon);
CREATE INDEX idx_notification_recipients_notif ON notification_recipients(notification_id);
CREATE INDEX idx_notification_delivery_status_notif ON notification_delivery_status(notification_recipient_id, status);
CREATE INDEX idx_notification_dispatch_log_notif ON notification_dispatch_log(notification_id);
CREATE INDEX idx_cap_alert_records_notif ON cap_alert_records(notification_id);
CREATE INDEX idx_sitreps_incident ON sitreps(incident_id);
CREATE INDEX idx_aar_findings_owner_open ON aar_findings(owner_id) WHERE closure_status = 'Open';
CREATE INDEX idx_signals_status ON signals(status);
CREATE INDEX idx_signal_source_events_signal ON signal_source_events(signal_id);
CREATE INDEX idx_signal_source_events_hazard ON signal_source_events(hazard_feed_event_id);
CREATE INDEX idx_ai_drafts_unresolved ON ai_drafts(requesting_user_id) WHERE action IS NULL;
CREATE INDEX idx_ai_drafts_target ON ai_drafts(target_feature, target_field);
```

### Migration Ordering Note

Because `ai_drafts` is referenced by `ics_forms` (domain file `02b`), `notifications` (this file), and `sitreps` (this file), the migration sequence loads domain files in this order: `02a` (no cross-domain FKs) → `02c` AI Assistance section (`ai_drafts`, `signals`) → `02b` (incidents, which references `ai_drafts` via `ics_forms`) → `02c` remainder (plans, notifications, reporting) → `02d` (integration/geo, referenced by `02c`'s `signal_source_events.hazard_feed_event_id`). In practice, the reference implementation ships `ai_drafts` and `hazard_feed_events` as "phase 0" tables with no outbound FKs, added first, then all dependents follow — avoiding circular-dependency migration ordering issues entirely.
## 3d. Data Model — Integration & Geospatial

Owning features: F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F15 (CAD/911), F17 (Asset/Facility/Document). PostGIS extension required (declared in `02a`). `hazard_feed_events` is treated as a "phase 0" table with no outbound FKs so that `signal_source_events` (`02c`) can reference it without circular migration ordering — see `02c`'s Migration Ordering Note.

### GIS Integration (F11)

```sql
CREATE TABLE gis_feed_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NOT NULL CHECK (vendor IN ('Esri','OSM','agency_gis')),
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status VARCHAR(20) NOT NULL DEFAULT 'ok' CHECK (last_fetch_status IN ('ok','error','timeout')),
  can_publish BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (layer_id, vendor)
);
```
*Geospatial feature data itself (base-map tiles, boundary geometries) is read-through/cached only — EPMP is not the system of record for GIS base-layer content; only fetch status/health is persisted here. Live feature data is fetched on-demand via the F11 adapter and optionally cached in Redis/application-memory with a short TTL, not persisted to a dedicated table.*

### Hazard Feeds (F12)

```sql
CREATE TABLE hazard_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_name VARCHAR(50) NOT NULL CHECK (feed_name IN ('NOAA','NWS','USGS')),
  endpoint_url TEXT NOT NULL,
  poll_interval_seconds INTEGER NOT NULL DEFAULT 300,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Phase-0 table: no outbound FKs, to avoid circular migration dependency with signal_source_events (02c).
CREATE TABLE hazard_feed_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID NOT NULL REFERENCES hazard_feed_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  type VARCHAR(100) NOT NULL,
  severity VARCHAR(50),
  geometry GEOGRAPHY NOT NULL,
  confidence VARCHAR(10) NOT NULL CHECK (confidence IN ('High','Medium','Low')),
  source VARCHAR(100) NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_id, external_event_id)
);

CREATE TABLE hazard_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_feed_event_id UUID NOT NULL REFERENCES hazard_feed_events(id),
  label VARCHAR(200) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_verified_requires_user CHECK (NOT verified OR verified_by IS NOT NULL)
);
```

### EOC COTS Interoperability (F13)

```sql
CREATE TABLE eoc_cots_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(50) NOT NULL CHECK (vendor IN ('WebEOC','Veoci','DisasterLAN')),
  endpoint_url TEXT NOT NULL,
  auth_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('incident','resource_request','status','activity_log')),
  external_id VARCHAR(300),
  epmp_record_id UUID,
  direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound')),
  sync_status VARCHAR(20) NOT NULL DEFAULT 'ok',
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE eoc_cots_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
  record_type VARCHAR(50) NOT NULL,
  epmp_record_id UUID NOT NULL,
  epmp_value JSONB NOT NULL,
  external_value JSONB NOT NULL,
  resolution VARCHAR(20) CHECK (resolution IN ('keep_epmp','keep_external')),
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### CAD / 911 Integration (F15)

```sql
CREATE TABLE cad_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  incident_matching_strategy VARCHAR(20) NOT NULL DEFAULT 'human_confirmed'
    CHECK (incident_matching_strategy IN ('shared_number','human_confirmed')),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cad_dispatch_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id UUID NOT NULL REFERENCES cad_config(id),
  external_event_id VARCHAR(300) NOT NULL,
  cad_incident_number VARCHAR(100),
  linked_incident_id UUID REFERENCES incidents(id),
  status VARCHAR(100) NOT NULL,
  unit_ids TEXT[],
  location GEOGRAPHY(POINT, 4326),
  source VARCHAR(100) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (config_id, external_event_id)
);
-- No UPDATE path exists from any non-adapter code; CAD data is strictly read-only
-- from EPMP's perspective (F15: "EPMP never edits dispatch data").
```

### Asset, Facility & Document Integration (F17)

```sql
CREATE TABLE facility_feed_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  erp_vendor VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_facility_id VARCHAR(300) NOT NULL,
  name VARCHAR(200) NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  status VARCHAR(50) NOT NULL,
  source VARCHAR(100) NOT NULL,
  as_of TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (external_facility_id, source)
);
-- Note (F17 hard constraint): no inventory/maintenance/cost columns exist on this
-- table by design — those fields are discarded at the integration-adapter boundary
-- before persistence, never stored even transiently.

CREATE TABLE document_system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  system_name VARCHAR(100) NOT NULL,
  endpoint_config JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- document_links table is defined in 02c-data-plans-comms-reporting.md (owned
-- conceptually by F3, populated via this module's F17 adapter).
```

### Indexes

```sql
CREATE INDEX idx_gis_feed_status_layer ON gis_feed_status(layer_id);
CREATE INDEX idx_hazard_feed_events_feed_time ON hazard_feed_events(feed_id, issued_at DESC);
CREATE INDEX idx_hazard_feed_events_geometry ON hazard_feed_events USING GIST(geometry);
CREATE INDEX idx_hazard_feed_events_expires ON hazard_feed_events(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_hazard_layers_unverified ON hazard_layers(verified) WHERE verified = false;
CREATE INDEX idx_eoc_cots_sync_log_config_time ON eoc_cots_sync_log(config_id, synced_at DESC);
CREATE INDEX idx_eoc_cots_conflicts_unresolved ON eoc_cots_conflicts(config_id) WHERE resolution IS NULL;
CREATE INDEX idx_cad_dispatch_events_incident ON cad_dispatch_events(linked_incident_id);
CREATE INDEX idx_cad_dispatch_events_location ON cad_dispatch_events USING GIST(location);
CREATE INDEX idx_facilities_location ON facilities USING GIST(location);
CREATE INDEX idx_facilities_status ON facilities(status);
```
## 4. API Design

### 4.1 Conventions

All endpoints are versioned under `/api/v1`, JSON request/response, OAuth2/OIDC bearer-token authenticated (issued by Keycloak after SAML2/OIDC federation with the agency IdP), matching FRD §Conventions exactly. The API is specified as an OpenAPI 3.1 document; the TypeScript interfaces below are the canonical shape the OpenAPI schema compiles to (and what the frontend's generated API client consumes).

**Common envelope types:**

```typescript
interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

interface ApiError {
  error_code: string;
  message: string;
  details?: Record<string, unknown>;
}

type ConfidenceLabel = 'High' | 'Medium' | 'Low';
type Theme = 'light' | 'dark' | 'contrast';
type SyncStatusState = 'online' | 'syncing' | 'offline' | 'conflict';

interface Provenance {
  source: string;
  as_of: string; // ISO 8601
  confidence?: ConfidenceLabel;
  version?: string;
}
```

Full endpoint catalog is split by domain, mirroring the FRD's `Y1a`–`Y1d` chunking:

| File | Domain | Endpoint count (approx.) |
|---|---|---|
| [`03a-api-auth-admin.md`](./03a-api-auth-admin.md) | Session/theme, admin console, API clients/federation, webhooks | 20 |
| [`03b-api-incident-ops.md`](./03b-api-incident-ops.md) | Incidents, operating picture, tasks, resource requests, field reports | 20 |
| [`03c-api-comms-reporting.md`](./03c-api-comms-reporting.md) | Plans, notifications, reporting/AAR, AI assistance | 22 |
| [`03d-api-integrations.md`](./03d-api-integrations.md) | GIS, hazard feeds, EOC COTS, notification providers, CAD, HR/IAM, assets/documents | 19 |

### 4.2 API Design Principles Carried from the FRD

- **Idempotency on mutating webhook-triggered calls:** every webhook delivery includes an `idempotency_key`; consumers (internal or partner) must treat a duplicate key within the retry window as a no-op, never reprocess it. Implemented server-side via a `UNIQUE (subscription_id, idempotency_key)` constraint on `webhook_deliveries` (see `02a-data-auth-org.md`).
- **AI governance guard at every write boundary:** any endpoint accepting content that can carry an `ai_origin: true` flag (ICS forms, notification send, SITREP/AAR) validates `approved_by`/`approved_at` are both non-null server-side, returning `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` otherwise — implemented once as shared middleware (see `01-components.md` §2.4) rather than per-endpoint.
- **Provenance required on all ingested data:** every integration endpoint response (and the persistence layer behind it) requires `source` + an `as_of`/`issued_at`/`updated_at` timestamp; missing either is rejected with `422 PROVENANCE_REQUIRED` before persistence, not merely flagged.
- **Jurisdiction scope enforced on every incident-scoped read:** requests resolve the caller's `jurisdiction_scope` (base + active `federation_grants`) and apply it as a query filter (defense-in-depth with the RLS policy at the DB layer); out-of-scope access returns `403 JURISDICTION_SCOPE_DENIED`.
- **No general-purpose write route exists for append-only resources:** `incident_timeline` and `audit_log` have `GET` routes only; writes happen exclusively as side effects of other domain actions, through the internal `TimelineService`/`AuditService` interfaces (see `01-components.md`).

### 4.3 OpenAPI Contract Governance

The OpenAPI 3.1 spec is the single source of truth for the REST contract and is:
1. Generated from the domain-module route definitions (code-first) to prevent contract/implementation drift, then checked into the repo as the published artifact for SDK generation and partner documentation.
2. Used to generate the frontend's typed API client (`lib/api-client/`) via `openapi-typescript` or equivalent, so frontend/backend type mismatches fail at build time.
3. Versioned alongside the API path prefix (`/api/v1`); breaking changes require a `/api/v2` prefix and a documented deprecation window for `/api/v1`, consistent with the "published REST APIs... documented schemas" data-portability NFR.
4. Published (read-only, scoped to a partner's granted record types) to external API clients/federation partners as part of the "SDKs and adapters" integration posture named in the source architecture (Section 12).
## 4a. API — Session, Admin, Platform API & Federation

Covers F0 (session/theme), F8 (Security & Administration), F10 (API clients/federation/webhooks), F16 (SSO), F18 (persona config).

### TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: { id: string; name: string; persona_id: string };
  jurisdiction_scope: string[];
  theme_preference: Theme;
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

interface NavGroup {
  label: string;
  items: Array<{ id: string; label: string; icon: string; href: string }>;
}

interface LandingConfig {
  default_route: string;
  nav_groups: NavGroup[];
  mobile_bottom_bar_items: Array<{ id: string; label: string; icon: string; href: string }>; // max 4
}

interface SsoConfig {
  id: string;
  protocol: 'SAML2' | 'OIDC';
  idp_metadata_url?: string;
  idp_metadata_xml?: string;
  attribute_mapping: { email_attr: string; name_attr: string; group_attr: string };
  group_to_role_mapping: Array<{ idp_group: string; role_id: string }>;
  tested_at: string | null;
  active: boolean;
}

interface AdminUserSummary {
  id: string; name: string; email: string;
  role: string; jurisdiction_scope: string[];
  status: 'Active' | 'Suspended'; last_login_at: string | null;
}

interface Role {
  id: string; name: string; persona_id: string; description?: string;
  permissions: Array<{ feature: string; actions: string[] }>;
}

interface AuditLogEntry {
  id: string; actor: { id: string; name: string }; action: string;
  record_type?: string; record_id?: string; occurred_at: string;
  detail?: Record<string, unknown>;
}

interface IntegrationHealth {
  system_name: string;
  last_sync_at: string | null;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  record_authority: string;
  sync_status: SyncStatusState;
  error_count: number;
}

interface PlatformHealth {
  uptime_pct: number;
  active_sessions: number;
  failed_login_rate: number;
  integration_error_rate: number;
  alerts: Array<{ subsystem: string; message: string; since: string }>;
}

interface ApiClient {
  id: string; client_name: string; scopes: string[];
  revoked: boolean; created_at: string;
}

interface ApiClientCreated extends ApiClient {
  client_secret: string; // one-time, never retrievable again
}

interface RecordAuthorityEntry {
  record_type: string; authoritative_system: string; notes?: string;
}

interface FederationGrant {
  id: string;
  partner_jurisdiction_id: string;
  scope: { record_types: string[]; incident_filters?: Record<string, unknown> };
  granted_by: string;
  expires_at: string | null;
  status: 'Active' | 'Revoked';
}

interface WebhookSubscription {
  id: string; callback_url: string; event_types: string[]; active: boolean;
}

interface WebhookDeliveryPayload<T = unknown> {
  idempotency_key: string;
  event_type: string;
  payload: T;
  delivered_at: string;
}
```

### Endpoints

**Session & Theme (F0)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/me` | — | `User` | `401 SESSION_EXPIRED` |
| PATCH | `/api/v1/me/preferences` | `{ theme_preference: Theme }` | `{ theme_preference: Theme }` | `500 THEME_SAVE_FAILED` |
| GET | `/api/v1/search?q={query}` | — | `{ results: Array<{type, id, title, href}> }` | `503 SEARCH_UNAVAILABLE` |

**Persona Views (F18)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/me/landing-config` | `LandingConfig` | `200 ROLE_VIEW_UNMAPPED` (fallback payload) |
| GET | `/api/v1/me/nav-config` | `{ nav_groups: NavGroup[] }` | — |

**Security & Administration (F8)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| POST | `/api/v1/auth/sso/callback` | SAML2 assertion / OIDC token | `{ session_token: string; user: User }` | `401 SSO_AUTH_FAILED` |
| GET / PATCH | `/api/v1/admin/sso-config` | (PATCH) `Partial<SsoConfig>` | `SsoConfig` | `422 SSO_CONFIG_INVALID` |
| POST | `/api/v1/admin/sso-config/test` | — | `{ success: boolean; details: string }` | — |
| GET | `/api/v1/admin/users` | query: role, jurisdiction, status, page | `ListResponse<AdminUserSummary>` | — |
| POST | `/api/v1/admin/users` | `{ email, name, role_id, jurisdiction_scope }` | `AdminUserSummary` | — |
| PATCH | `/api/v1/admin/users/{id}` | `{ role_id?, jurisdiction_scope?, status? }` | `AdminUserSummary` | `409 ROLE_IN_USE` |
| GET / PATCH | `/api/v1/admin/roles` / `/api/v1/admin/roles/{id}` | (PATCH) `{ permissions: Array<{feature, actions}> }` | `Role` / `Role[]` | — |
| GET | `/api/v1/admin/audit-log` | query: date_range, actor_id, action_type, record_type | `ListResponse<AuditLogEntry>` | *(no PATCH/DELETE — append-only)* |
| GET | `/api/v1/admin/integration-health` | — | `{ items: IntegrationHealth[] }` | — |
| GET | `/api/v1/admin/platform-health` | — | `PlatformHealth` | — |

**API Clients & Federation (F10)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET / POST | `/api/v1/admin/api-clients` | (POST) `{ client_name, scopes }` | `ApiClientCreated` / `ApiClient[]` | — |
| POST | `/api/v1/admin/api-clients/{id}/revoke` | — | `204` | — |
| GET / POST | `/api/v1/admin/record-authority` | (POST) `RecordAuthorityEntry` | `RecordAuthorityEntry[]` | — |
| GET / POST | `/api/v1/admin/federation-grants` | (POST) `{ partner_jurisdiction_id, scope, expires_at? }` | `FederationGrant[]` | — |
| POST | `/api/v1/admin/federation-grants/{id}/revoke` | — | `204` | `403 FEDERATION_ACCESS_DENIED` (on subsequent access) |
| POST | `/api/v1/admin/webhook-subscriptions` | `{ callback_url, event_types, secret }` | `WebhookSubscription` | — |

**Common response envelope:** all list endpoints return `ListResponse<T>`; all errors return `ApiError` per the shared conventions in `03-api.md`.
## 4b. API — Incident Operations

Covers F1 (Incident/ICS), F2 (Common Operating Picture), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations).

### TypeScript Interfaces

```typescript
type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';
type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';
type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';
type ResourceRequestStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Fulfilled' | 'Declined';
type CommandRoleTitle = 'Incident Commander' | 'Planning' | 'Logistics' | 'Operations' | 'Finance/Admin' | 'Public Information';

interface Incident {
  id: string;
  name: string;
  type: 'Flood' | 'Wildfire' | 'Severe Weather' | 'HazMat' | 'Public Health' | 'Other';
  severity: Severity;
  jurisdiction: { id: string; name: string };
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  opened_at: string;
  commander: { id: string; name: string } | null;
}

interface IncidentDetail extends Incident {
  description?: string;
  closed_at: string | null;
  command_roles: Array<{ role_title: CommandRoleTitle; person: { id: string; name: string }; assigned_at: string }>;
}

interface TimelineEntry {
  id: string;
  occurred_at: string;
  title: string;
  meta?: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  actor: { id: string; name: string } | null;
  source: string;
  detail?: Record<string, unknown>;
}

interface IcsForm {
  id: string;
  incident_id: string;
  form_type: string;
  status: 'Draft' | 'Approved';
  content: Record<string, unknown>;
  ai_origin: boolean;
  approved_by?: { id: string; name: string };
  approved_at?: string;
}

interface MapMarker {
  id: string;
  type: 'incident' | 'facility' | 'resource' | 'shelter';
  shape: 'diamond' | 'square' | 'triangle' | 'circle';
  tone: string;
  label: string;
  status: string;
  location: { lat: number; lng: number };
  provenance?: Provenance;
}

interface OperatingPictureResponse {
  markers: MapMarker[];
  status_bar: { as_of: string; base_layer_source: string };
}

interface MapLayer {
  id: string; label: string; source: string; as_of: string;
  verified: boolean; count: number; checked: boolean;
}

interface DashboardSummary {
  active_incidents: number;
  open_tasks: number;
  pending_resource_requests: number;
  notifications_pending_ack: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner: { id: string; name: string };
  incident_id?: string;
  plan_section_id?: string;
  due_at: string;
}

interface ResourceRequest {
  id: string;
  resource_type: 'Personnel' | 'Equipment' | 'Supplies';
  description: string;
  quantity: number;
  status: ResourceRequestStatus;
  incident_id: string;
  task_id?: string;
  requesting_role: string;
  needed_by: string;
  requested_by: { id: string; name: string };
  decline_reason?: string;
  assigned_to?: string;
}

interface FieldReport {
  id: string;
  client_report_id: string; // client-generated, idempotency key
  incident_id?: string;
  observation_type: string;
  description?: string;
  location?: { lat: number; lng: number; accuracy_m: number };
  captured_at: string; // client capture time, preserved through sync
  sync_status: 'synced' | 'conflict' | 'failed';
}

interface SyncBatchResult {
  client_report_id: string;
  status: 'synced' | 'conflict' | 'failed';
  conflict_id?: string;
}

interface SyncConflict {
  id: string;
  entity_type: string;
  entity_id: string;
  field_version: Record<string, unknown>;
  eoc_version: Record<string, unknown>;
  resolution: 'keep_mine' | 'keep_eoc' | null;
}
```

### Endpoints

**Incidents (F1)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/incidents` | query: severity, activation_level, jurisdiction, status, page | `ListResponse<Incident>` | — |
| POST | `/api/v1/incidents` | `{ name, type, severity, jurisdiction_id, description?, opened_at }` | `201 IncidentDetail` | `409 INCIDENT_POSSIBLE_DUPLICATE` |
| GET / PATCH | `/api/v1/incidents/{id}` | (PATCH) `Partial<IncidentDetail>` | `IncidentDetail` | `404 INCIDENT_NOT_FOUND` |
| POST | `/api/v1/incidents/{id}/activation` | `{ activation_level: ActivationLevel; confirmed: true }` | `IncidentDetail` | `422 NO_COMMANDER_ASSIGNED` |
| POST | `/api/v1/incidents/{id}/command-roles` | `{ role_title: CommandRoleTitle; person_id: string }` | `IncidentDetail['command_roles'][0]` | `500 TIMELINE_WRITE_FAILED` |
| GET | `/api/v1/incidents/{id}/timeline` | (append-only, newest-first) | `ListResponse<TimelineEntry>` | — |
| GET / POST | `/api/v1/incidents/{id}/ics-forms` | (POST) `{ form_type, content }` | `IcsForm[]` / `IcsForm` | — |
| POST | `/api/v1/incidents/{id}/ics-forms/{formId}/approve` | `{ approved_by: string }` | `IcsForm` | `403 APPROVAL_REQUIRES_NAMED_USER` |

**Operating Picture (F2)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/operating-picture/markers` | query: bbox, jurisdiction_scope | `OperatingPictureResponse` | `500 MARKER_FETCH_FAILED` |
| GET | `/api/v1/operating-picture/layers` | — | `{ layers: MapLayer[] }` | — |
| GET | `/api/v1/dashboard/summary` | query: jurisdiction_scope | `DashboardSummary` | `504 DASHBOARD_TIMEOUT` |

**Tasks (F4)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/tasks` | query: owner, status, incident, due_window | `ListResponse<Task>` | — |
| POST | `/api/v1/tasks` | `{ title, description?, owner_id, due_at, incident_id?, plan_section_id? }` | `201 Task` | `422 TASK_OWNER_REQUIRED`, `422 DUE_DATE_PAST` |
| PATCH | `/api/v1/tasks/{id}/status` | `{ new_status: TaskStatus }` | `Task` | `409 INVALID_STATUS_TRANSITION`, `404 RECORD_NOT_FOUND` |

**Resource Requests (F4)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/resource-requests` | query: status, type, incident | `ListResponse<ResourceRequest>` | — |
| POST | `/api/v1/resource-requests` | `{ resource_type, description, quantity, incident_id, needed_by, requesting_role }` | `201 ResourceRequest` | — |
| POST | `/api/v1/resource-requests/{id}/approve` | — | `ResourceRequest` | — |
| POST | `/api/v1/resource-requests/{id}/decline` | `{ reason: string }` | `ResourceRequest` | `422 DECLINE_REASON_REQUIRED` |
| POST | `/api/v1/resource-requests/{id}/fulfill` | `{ assigned_to: string }` | `ResourceRequest` | — |

**Field Reports (F6)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| POST | `/api/v1/field-reports` | `FieldReport` (idempotent via `client_report_id`) | `201 { id, sync_status }` | `422 REPORT_EMPTY`, `507 QUEUE_STORAGE_FULL` (client-side) |
| POST | `/api/v1/field-reports/sync-batch` | `{ reports: FieldReport[] }` (creation order) | `{ results: SyncBatchResult[] }` | — |
| POST | `/api/v1/field-reports/{id}/photos` | multipart | `204` | `500 PHOTO_UPLOAD_FAILED` (non-blocking) |
| POST | `/api/v1/sync-conflicts/{id}/resolve` | `{ resolution: 'keep_mine' \| 'keep_eoc' }` | `SyncConflict` | — |

**Common conventions:** all `incident_id` references are validated against the requester's `jurisdiction_scope` (`403 JURISDICTION_SCOPE_DENIED` otherwise); all list endpoints support `page`/`page_size` per the shared `ListResponse<T>` envelope.
## 4c. API — Plans, Notifications, Reporting & AI

Covers F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage).

### TypeScript Interfaces

```typescript
type PlanStatus = 'Draft' | 'Review' | 'Approved';
type PlanType = 'EOP' | 'SOP' | 'Annex';

interface Plan {
  id: string; name: string; type: PlanType; status: PlanStatus;
  jurisdiction_id: string; version: number;
  owner: { id: string; name: string };
}

interface PlanDetail extends Plan {
  sections: Array<{ id: string; heading: string; body: string; sort_order: number; linked_task_templates: string[] }>;
  version_history: Array<{ version_number: number; reviewed_by?: string; review_action?: string; reviewed_at?: string }>;
}

interface RecipientGroup {
  id: string; name: string; type: 'Role' | 'Jurisdiction' | 'Geography';
  selector: Record<string, unknown>; member_count?: number;
}

interface MessageTemplate {
  id: string; name: string; category?: string; body: string;
}

interface Notification {
  id: string;
  incident_id?: string;
  message_body: string;
  ai_origin: boolean;
  channels: string[];
  recipient_group_ids: string[];
  geotarget_polygon?: GeoJSON.Polygon;
  approved_by?: { id: string; name: string };
  sent_at?: string;
}

interface DeliveryStatusResponse {
  recipients: Array<{ name: string; channel: string; status: string; failure_reason?: string }>;
  ack_percentage: number;
}

interface Sitrep {
  id: string; incident_id: string; status: 'Draft' | 'Approved';
  content: Record<string, unknown>; ai_origin: boolean;
}

interface Aar {
  id: string; incident_id: string;
  timeline_export: TimelineEntry[];
  decisions_log: Record<string, unknown>[];
  resource_history: Record<string, unknown>[];
  status: 'Draft' | 'Finalized';
}

interface AarFinding {
  text: string; category?: string; corrective_action?: string;
  owner_id?: string; due_date?: string;
}

interface KpiResult {
  name: string; value: number; definition: string; baseline?: number;
  target?: number; // omitted entirely (not zero/null) when undefined
  owner: string; review_cadence: string; period: string; source: string;
}

interface Signal {
  id: string; summary: string; confidence_label: ConfidenceLabel;
  confidence_reason: string; detected_at: string;
  status: 'New' | 'Dismissed' | 'Promoted';
}

interface SignalPromotePrefill {
  prefill: {
    name_suggestion: string; type_suggestion: string;
    severity_suggestion: Severity; source_signal_id: string;
  };
}

interface AiDraftRequest {
  target_feature: 'ics_form' | 'notification' | 'sitrep' | 'aar';
  target_field: string;
  context: string;
  requesting_user_id: string;
}

interface AiDraftResponse {
  id: string;
  draft_text: string;
  sources: Array<{ source: string; time: string; confidence: ConfidenceLabel }>;
  confidence_label: ConfidenceLabel;
}
```

### Endpoints

**Plans (F3)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET / POST | `/api/v1/plans` | (POST) `{ name, type, jurisdiction_id, content_sections: [{heading, body}] }` | `ListResponse<Plan>` / `201 PlanDetail` | — |
| GET / PATCH | `/api/v1/plans/{id}` | (PATCH) `Partial<PlanDetail>` | `PlanDetail` | `404 PLAN_NOT_FOUND` |
| POST | `/api/v1/plans/{id}/submit-review` | — | `PlanDetail` | `422 PLAN_EMPTY` |
| POST | `/api/v1/plans/{id}/review` | `{ review_action: 'approve' \| 'request_changes'; comments? }` | `PlanDetail` | `403 SELF_APPROVAL_BLOCKED` |
| POST | `/api/v1/plans/{id}/sections/{sectionId}/link-tasks` | `{ task_template_ids?: string[]; new_template?: {...} }` | `204` | — |
| POST | `/api/v1/plans/import` | `{ source_document_ref, mode: 'import_copy' \| 'link_live' }` | `PlanDetail` | `403 IMPORT_PERMISSION_DENIED`, `200 PLAN_SOURCE_CHANGED` (flagged) |

**Notifications (F5)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET / POST | `/api/v1/recipient-groups` | (POST) `{ name, type, selector }` | `RecipientGroup[]` / `RecipientGroup` | — |
| GET / POST | `/api/v1/message-templates` | (POST) `{ name, category, body }` | `MessageTemplate[]` / `MessageTemplate` | — |
| POST | `/api/v1/notifications/compose` | `{ recipient_group_ids?, geotarget_polygon?, message_body, channels, incident_id? }` | `Notification` | `422 NO_AUDIENCE_SELECTED`, `422 MESSAGE_TOO_LONG` |
| POST | `/api/v1/notifications/{id}/send` | `{ approver_id, confirmed: true }` | `Notification` | `403 APPROVER_MISMATCH`, `400 AIDRAFT_NOT_APPROVED`, `503 CHANNEL_UNAVAILABLE` |
| GET | `/api/v1/notifications/{id}/delivery-status` | — | `DeliveryStatusResponse` | — |

**Reporting (F7)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| POST | `/api/v1/incidents/{id}/sitreps` | `{ include_ai_draft?: boolean }` | `Sitrep` | — |
| POST | `/api/v1/incidents/{id}/aar` | `{ findings: AarFinding[] }` | `Aar` | `409 INCIDENT_NOT_CLOSED`, `422 CORRECTIVE_ACTION_UNOWNED` |
| PATCH | `/api/v1/incidents/{id}/aar/{aarId}/finalize` | — | `Aar` | `403 DOCUMENT_IMMUTABLE` (on subsequent edit attempts) |
| GET | `/api/v1/evidence-log` | query: date_range, actor_id, action_type, record_type | `ListResponse<AuditLogEntry>` | — |
| GET | `/api/v1/evidence-log/export` | query: format=csv\|pdf | file stream | `500 EXPORT_FAILED` |
| GET | `/api/v1/analytics/kpis` | query: date_range, jurisdiction_scope | `{ kpis: KpiResult[] }` | `504 ANALYTICS_TIMEOUT` |

**AI Assistance (F9)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/signals` | query: status, confidence | `ListResponse<Signal>` | — |
| POST | `/api/v1/signals/{id}/promote` | — (pre-fill only, never creates a record) | `SignalPromotePrefill` | `400 PROMOTE_REQUIRES_HUMAN_SUBMIT` |
| POST | `/api/v1/signals/{id}/dismiss` | `{ reason: string }` | `Signal` | — |
| POST | `/api/v1/ai-drafts` | `AiDraftRequest` | `AiDraftResponse` | `503 AI_GATEWAY_UNAVAILABLE`, `200 AIDRAFT_NO_SOURCE` (flagged) |
| POST | `/api/v1/ai-drafts/{id}/approve` | `{ approver_id: string; edited_text?: string }` | `{ id, approved_by, approved_at }` | `403 APPROVAL_REQUIRES_NAMED_USER` |
| POST | `/api/v1/ai-drafts/{id}/discard` | — | `204` | — |

### Server-Side AI Governance Guard

Every endpoint above that writes to an official record (`ics-forms`, `notifications/{id}/send`, `sitreps`, `aar`) rejects any payload tagged `ai_origin: true` lacking non-null `approved_by`/`approved_at` with `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` — implemented as shared middleware (see `01-components.md` §2.4), enforced independent of which UI client calls the endpoint.
## 4d. API — External Integrations

Covers F11 (GIS), F12 (Weather/Hazard Feeds), F13 (EOC COTS), F14 (Notification Providers), F15 (CAD/911), F16 (HR/IAM roster), F17 (Asset/Facility/Document). These are the normalized, vendor-neutral contracts EPMP's own services expose/consume internally — each wraps a vendor-specific adapter (see `06-integrations.md`).

### TypeScript Interfaces

```typescript
interface GeoFeatureResponse {
  layer_id: string; source: string; as_of: string;
  features: GeoJSON.Feature[];
}

interface HazardFeedEvent {
  id: string; type: string; severity?: string;
  geometry: GeoJSON.Geometry; confidence: ConfidenceLabel;
  source: string; issued_at: string; expires_at?: string;
}

interface EocCotsExchangeRecord {
  external_id: string;
  type: 'incident' | 'resource_request' | 'status' | 'activity_log';
  payload: Record<string, unknown>;
  external_system: string;
  last_modified_external: string;
}

interface EocCotsConflict {
  id: string; record_type: string; epmp_record_id: string;
  epmp_value: Record<string, unknown>; external_value: Record<string, unknown>;
  resolution: 'keep_epmp' | 'keep_external' | null;
}

interface NotificationProviderSendRequest {
  notification_id: string; channel: string; recipients: string[];
  message: string; approved_by: string; approved_at: string;
}

interface NotificationProviderCallback {
  external_message_id: string; recipient: string; status: string; timestamp: string;
}

interface CadDispatchEvent {
  external_event_id: string; cad_incident_number?: string;
  status: string; unit_ids: string[];
  location?: { lat: number; lng: number };
  updated_at: string; source: string;
}

interface HrisPersonnelRecord {
  external_person_id: string; name: string; email?: string;
  role_titles: string[]; qualifications: string[];
  contact_info: Record<string, unknown>; jurisdiction: string;
  source: string; as_of: string;
}

interface FacilityStatus {
  facility_id: string; name: string;
  location: { lat: number; lng: number };
  status: string; source: string; as_of: string;
  // No inventory/maintenance/cost fields — discarded at adapter boundary (F17 constraint)
}

interface DocumentBrowseResult {
  id: string; name: string; path: string; last_modified: string;
  // Executed under requesting user's delegated credentials; never exceeds source-system visibility
}
```

### Endpoints

**GIS (F11)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/gis/features?layer_id={...}&bbox={...}` | `GeoFeatureResponse` | `504 GIS_FEED_TIMEOUT` (triggers F2 schematic fallback, not hard error), `502 GIS_FEED_INVALID` |
| POST | `/api/v1/integrations/gis/publish` | `{ layer_id, features, visibility: 'agency-internal' \| 'public' }` → `204` | `400 GIS_PUBLISH_LAYER_NOT_ALLOWED`, `403 GIS_PUBLISH_DENIED` |
| GET | `/api/v1/integrations/gis/health` | `IntegrationHealth` | — |

**Hazard Feeds (F12)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/hazard-feeds/events?feed={noaa\|usgs\|...}&since={ts}` | `{ feed: string; events: HazardFeedEvent[] }` | — |
| POST | `/api/v1/hazard-layers/{id}/verify` | `{ verified_by: string }` → `204` | `403 VERIFICATION_REQUIRES_NAMED_USER` |
| GET | `/api/v1/integrations/hazard-feeds/health` | `IntegrationHealth` | — |

**EOC COTS (F13)**

| Method | Path | Request/Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/eoc-cots/exchange-records?type={...}&since={ts}` | → `EocCotsExchangeRecord[]` | — |
| POST | `/api/v1/integrations/eoc-cots/exchange-records` | EPMP-side record, type-scoped to 4 approved types → `204` | `400 EOC_RECORD_TYPE_UNSUPPORTED`, `502 EOC_OUTBOUND_REJECTED`, `401 EOC_ADAPTER_AUTH_FAILED` |
| GET | `/api/v1/integrations/eoc-cots/conflicts` | → `EocCotsConflict[]` | — |
| POST | `/api/v1/integrations/eoc-cots/conflicts/{id}/resolve` | `{ resolution, resolved_by }` → `EocCotsConflict` | — |
| GET | `/api/v1/integrations/eoc-cots/health` | `IntegrationHealth` | — |

**Notification Providers (F14)**

| Method | Path | Request/Response | Errors |
|---|---|---|---|
| POST | `/api/v1/integrations/notification-providers/send` | `NotificationProviderSendRequest` → `202` | `400 SEND_REQUIRES_APPROVAL`, `503 PROVIDER_UNAVAILABLE`, `422 CAP_FIELDS_INCOMPLETE`, `403 CAP_AUTHORITY_DENIED` |
| POST | `/api/v1/integrations/notification-providers/callback` | `NotificationProviderCallback` → `200` | (logged `CALLBACK_UNMATCHED` if no match) |
| GET | `/api/v1/integrations/notification-providers/health` | `IntegrationHealth` | — |

**CAD / 911 (F15) — strictly read-only, no write routes exist**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/cad/dispatch-events?since={ts}` | `CadDispatchEvent[]` | — |
| GET | `/api/v1/incidents/{id}/dispatch-status` | read-only panel data + `Provenance` | `403 CAD_RECORD_READ_ONLY` (if PATCH attempted; route does not exist) |
| GET | `/api/v1/integrations/cad/health` | `IntegrationHealth` | — |

**HR / IAM Roster (F16)**

| Method | Path | Response |
|---|---|---|
| GET | `/api/v1/integrations/hris/personnel?since={ts}` | `HrisPersonnelRecord[]` |
| GET | `/api/v1/integrations/hris/health` | `IntegrationHealth` |

*(SSO/authentication endpoints are shared with F8 — see `03a-api-auth-admin.md`, `POST /api/v1/auth/sso/callback`.)*

**Asset, Facility & Document Systems (F17)**

| Method | Path | Response | Errors |
|---|---|---|---|
| GET | `/api/v1/integrations/facilities/status?since={ts}` | `FacilityStatus[]` | — |
| GET | `/api/v1/integrations/documents/browse?query={...}` | `DocumentBrowseResult[]` (delegated credentials) | — |
| POST | `/api/v1/integrations/documents/{id}/import` | → `204` | `403 IMPORT_PERMISSION_DENIED` |
| POST | `/api/v1/integrations/documents/{id}/link` | → `204` | `403 LINK_PERMISSION_REVOKED`, `200 LINKED_DOCUMENT_CHANGED` (flagged) |
| GET | `/api/v1/integrations/facilities/health` / `/api/v1/integrations/documents/health` | `IntegrationHealth` | — |

### Shared Conventions Across All Integration Endpoints

- Every response payload carrying ingested external data includes `source` and an `as_of`/`issued_at`/`updated_at` timestamp — payloads missing these are rejected server-side **before persistence** (`422 PROVENANCE_REQUIRED`), not merely flagged client-side.
- All integration health endpoints return the common `IntegrationHealth` shape (see `03a-api-auth-admin.md`).
- Background polling jobs backing these endpoints are monitored via `GET /api/v1/admin/platform-health` and the `background_jobs` table (see `02a-data-auth-org.md`).
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
## 6. Technology Stack

### 6.1 Core Stack Table

| Layer | Technology | Version (baseline) | Purpose | Rationale |
|---|---|---|---|---|
| UI framework | React | 18.x | SPA consuming `window.EPMP` design system | Design system is pre-built in React; hard requirement, not a default (see `00-overview.md` §1.4) |
| UI build tooling | Vite | 5.x | Dev server + production bundling | Fast HMR, native ESM, strong PWA-plugin ecosystem |
| PWA / offline | Workbox (Service Worker) | 7.x | Asset caching, background sync registration | Matches "installable, mobile-first web application" NFR; no native app store build |
| Client local cache | sql.js / SQLite (OPFS-backed) | current | Offline field-mobile relational cache | Matches source hypothesis (SQLite); relational shape mirrors server schema subset |
| Client state/data | TanStack Query | 5.x | Server-state caching, optimistic updates, retry | Pairs naturally with REST + offline-queue patterns |
| API client generation | openapi-typescript / orval | current | Typed client generated from OpenAPI spec | Prevents frontend/backend contract drift |
| Backend language/runtime | Node.js (TypeScript) | 20.x LTS | Domain services, API layer | Single language across API + frontend reduces context-switching and duplicate type definitions (shared TS interfaces, §4) |
| Backend framework | Fastify (or NestJS if stronger modular-DI structure is preferred) | current | HTTP routing, request validation, middleware (AI-governance guard, provenance guard) | High throughput, strong schema-validation ecosystem (JSON Schema/OpenAPI-native) |
| API gateway | Kong (OSS) or Envoy-based gateway | current | TLS termination, rate limiting, OAuth2 token introspection, routing | Open-source-first per source Section 12; mature OIDC plugin ecosystem |
| Database | PostgreSQL | 16.x | Operational + geospatial + audit/event data | Matches source hypothesis exactly; single RDBMS avoids dual-write consistency issues |
| Geospatial extension | PostGIS | 3.4.x | `GEOGRAPHY`/`GEOMETRY` types, spatial indexes (GIST) | Matches source hypothesis; required for facility/hazard/dispatch location data |
| Migrations | node-pg-migrate or Prisma Migrate | current | Versioned schema migrations | Explicit, reviewable SQL migrations matching the DDL in `02a`–`02d` |
| Object storage | S3-compatible (AWS S3, MinIO for self-hosted) | — | Field-report photos, imported documents, exports | Open, portable format; MinIO option supports air-gapped/on-prem deployment |
| Search | PostgreSQL full-text (`tsvector`/`pg_trgm`) at MVP; OpenSearch as scale-out path | PG 16-native; OpenSearch 2.x if adopted | Global search (F0) across incidents/plans/tasks/resources | Avoids a second stateful system at MVP data volume |
| Event bus | NATS (JetStream) | 2.10.x | Durable async messaging: notification fan-out, feed ingestion, sync reconciliation, webhook delivery | Chosen over Kafka — see `00-overview.md` §1.4 rationale (operational simplicity, sufficient throughput, better portability fit) |
| Background job framework | BullMQ (Redis-backed) or NATS JetStream consumers directly | current | Scheduled polling, retry/backoff, job status tracking (`background_jobs`) | BullMQ gives mature retry/backoff/monitoring UX on top of a lightweight Redis instance if NATS JetStream consumer groups alone are insufficient for job-level introspection |
| IAM / IdP broker | Keycloak | 25.x | SAML2/OIDC federation with agency IdPs, JIT provisioning, session management | Matches source hypothesis; open-source, mature SAML2+OIDC support |
| Policy engine | Open Policy Agent (OPA) | current | RBAC + jurisdiction-scope + federation-grant authorization decisions (Rego) | Matches source hypothesis; externalizes policy from application code for auditability |
| Caching / ephemeral state | Redis | 7.x | Session-adjacent caching, rate-limit counters, optional BullMQ backing store, short-TTL GIS feature cache | Standard, low-overhead addition; not a system of record |
| Container runtime / orchestration | Docker + Kubernetes (Helm charts) | K8s 1.29+ | Deployment, scaling, portability | Matches source hypothesis; Helm charts ARE the "portable deployment artifact" satisfying the data-portability NFR |
| Small-deployment fallback | Docker Compose (same images) | — | Single-node reference stack for small agencies/pilots | Addresses procurement-cycle risk (PRD §8) without maintaining a second codebase |
| Observability — metrics | Prometheus + Grafana | current | Platform health (`GET /api/v1/admin/platform-health`), uptime/error-rate dashboards (F8 S8.7) | Open-source-first, Kubernetes-native |
| Observability — tracing | OpenTelemetry | current | Cross-module and cross-service request tracing | Vendor-neutral instrumentation, exportable to any backend (Jaeger/Tempo/vendor APM) |
| Observability — logging | Structured JSON logs → Loki or equivalent | current | Centralized log aggregation, correlated with traces via request ID | Supports audit/evidence requirements without a proprietary log vendor lock-in |
| AI gateway | Model-neutral internal service (see `01-components.md` §2.2); backing model configurable (OpenAI-, Anthropic-, or self-hosted-model-compatible via a thin adapter) | — | Signal triage/clustering, AIDraft generation (F9) | "Model-neutral gateway" is a named source requirement (Section 12/13); no product logic hard-coded to one vendor |
| Vector/retrieval store (if needed for AI context scoping) | pgvector extension on the same PostgreSQL instance | current | Scoped retrieval over approved EPMP sources (incidents, plans) for AIDraft context assembly | Avoids a dedicated vector DB at MVP scale; keeps retrieval data in the same access-controlled, RLS-governed database as the records it indexes |
| CI/CD | GitHub Actions (or agency-preferred equivalent) | — | Build, test, design-system conformance lint, OpenAPI contract check, container image build/push | Standard; design-system lint and AI-governance-guard tests are custom CI gates specific to this platform |
| Secrets management | HashiCorp Vault (self-hosted/air-gapped) or cloud-native KMS/Secrets Manager | current | Encryption keys, integration adapter credentials | Matches NIST SC control alignment (§5.4); avoids secrets in environment variables or source control |

### 6.2 Licensing & Open-Source Policy

Per the source's explicit clarification (Section 12, "Open-source policy: the attachment proposes an open-source-first stack, not a mandate to open-source all TechSur application code"), every infrastructure dependency above is selected under a permissive or widely-accepted copyleft-at-the-infrastructure-layer license (Apache 2.0, MIT, PostgreSQL License, BSD) with no dependency requiring EPMP's own application code to be open-sourced as a condition of use. License review is a required CI/release-gate step before any new infrastructure dependency is adopted, consistent with the "customer control... documented schemas... portable deployment artifacts" NFR.

### 6.3 Why Not GraphQL / gRPC

Addressed explicitly because the source document's technology-neutral framing could be read as leaving this open: GraphQL and gRPC are **not adopted** because the FRD and PRD both commit to REST/JSON/OpenAPI as the interface standard (FRD §Conventions; PRD §6 "Standards support at the interface layer"), which in turn is required for straightforward alignment with OASIS CAP/EDXL, webhook/event-bus patterns, and partner SDK generation — introducing a second API paradigm would fragment the "one connected operating picture" integration story without a corresponding FRD requirement driving it.
## 7. Integration & Adapter Architecture

### 7.1 Common Adapter Pattern

Every external system family (F11–F17) is integrated through a dedicated adapter implementing a common interface, hosted within the `integration-gateway` backend module (see `01-components.md` §2.1). This uniformity is what makes the FRD's "four non-negotiable integration behaviors" (record authority, trusted provenance, controlled federation, graceful failure) enforceable as shared middleware rather than seven separate bespoke implementations.

```typescript
interface IntegrationAdapter<TRecord> {
  // Pull-based adapters (F11, F12, F13 inbound, F15, F16, F17)
  fetch(since?: string): Promise<ProvenancedRecord<TRecord>[]>;

  // Push-based adapters (F11 publish, F13 outbound, F14 send)
  publish?(records: TRecord[]): Promise<PublishResult>;

  // Required on every adapter — feeds integration_health (02a) and S8.6/F13 UI
  health(): Promise<IntegrationHealthStatus>;
}

interface ProvenancedRecord<T> {
  source: string;        // required — adapter's declared system identity
  as_of: string;         // required — ISO 8601, when the fact was true as of
  confidence?: ConfidenceLabel; // required for hazard/signal data, optional elsewhere
  version?: string;
  payload: T;
}
```

**Provenance enforcement middleware** (shared across all adapters) runs immediately after `fetch()` and before any persistence call: any `ProvenancedRecord` missing `source` or `as_of` is rejected with `422 PROVENANCE_REQUIRED` and never reaches a domain table — this is the single enforcement point for F10's "provenance enforcement at the API boundary," applied uniformly rather than per-adapter.

**Record-authority middleware** runs before any write that could affect a record type with a declared external authority (consulting `record_authority_registry`): if EPMP is not authoritative for that record type, an inbound change that conflicts with EPMP's current value is diverted to a `*_conflicts` table rather than applied — never a silent overwrite.

**Backoff/retry (shared job scheduler):** exponential backoff (base → ×2 per failure, capped at a configurable max), state tracked in `background_jobs`; sustained backoff surfaces as `BACKGROUND_JOB_DEGRADED` (alert, not hard failure) rather than blocking unrelated platform operation.

### 7.2 Adapter Catalog (one row per F11–F17 integration)

| # | System family | Feature | Adapter type | Direction | Record authority split | Graceful-failure behavior |
|---|---|---|---|---|---|---|
| 1 | GIS (Esri REST, OGC/WMS/WFS, OSM-derived) | F11 | Normalized GeoJSON adapter, one implementation per vendor sharing a common OGC/GeoJSON translation layer | Read (base layers/boundaries/facilities); optional publish (EPMP-authored layers) | External: base map, boundaries, facility locations. EPMP: incidents, resource positions, hazard overlays (if published) | Timeout/unavailable → F2 operating picture falls back to schematic offline base map (`GIS_FEED_UNAVAILABLE`, 200 degraded, never a hard page failure) |
| 2 | NOAA / NWS / USGS hazard feeds | F12 | One adapter per feed family (CAP-XML parser for NWS alerts, GeoJSON for USGS); scheduled poll (default 300s interval per `hazard_feed_config.poll_interval_seconds`) | Read-only | External: all hazard-event data. EPMP: none — never originates hazard facts | Feed outage → exponential backoff; events already ingested remain visible, flagged with age (`HAZARD_FEED_STALE` beyond threshold) |
| 3 | EOC COTS (WebEOC, Veoci, DisasterLAN) | F13 | One adapter per vendor; normalizes to exactly 4 exchange-record types (Incident, Resource Request, Status Update, Activity Log) — no attempt to sync every board/widget type | Bidirectional, scoped to 4 record types | Varies per declared record type (admin-configured in `record_authority_registry`) | Conflicting field values surfaced side-by-side in integration-health UI with "Keep EPMP value"/"Keep [external] value" — never silent overwrite (`eoc_cots_conflicts`) |
| 4 | Everbridge / AtHoc / notification channels | F14 | One adapter per provider family; send + inbound delivery-callback webhook | Outbound send + inbound callback | External: delivery/acknowledgment receipts. EPMP: message content, audience, approval | Provider outage → message queued for retry, delivery failure surfaced in F5 delivery-status view, never silently dropped (`PROVIDER_UNAVAILABLE`, `503`) |
| 5 | FEMA IPAWS / OASIS CAP | F14 | CAP-formatting layer on top of the notification-provider adapter — translates an approved, human-sent message into a CAP-compliant XML envelope | Outbound, approval- and authority-gated | N/A (standards format, not a system of record). EPMP: CAP envelope content post-approval | `CAP_FIELDS_INCOMPLETE` (422) blocks send before reaching IPAWS if required CAP fields are missing; `CAP_AUTHORITY_DENIED` (403) if the sending agency lacks configured CAP origination authority |
| 6 | CAD / 911 / public safety dispatch | F15 | One adapter per CAD vendor; strictly read-only, no write routes exist in the API surface at all (not merely disabled — absent) | Read-only | External: all dispatch-status data. EPMP: none — never edits dispatch data | Feed unavailable → last-known dispatch status remains visible on the incident's dispatch panel, labeled with age; `CAD_RECORD_READ_ONLY` (403) is a structural guarantee, not a runtime toggle |
| 7 | HR / IAM / personnel rosters (HRIS) | F16 | One adapter per HRIS vendor for roster sync; SSO is handled separately via Keycloak federation (§5.1), not this adapter | Read sync (roster) + SSO (shared, not this adapter) | External: personnel role/qualification/contact data (where agency designates HR authoritative). EPMP: RBAC role assignment, theme preference, audit history (always EPMP-owned, never overwritten by roster sync) | Roster sync failure → `personnel_roster` retains last-synced data (`as_of` visibly aged); `matched_user_id` remains null for unmatched records rather than guessing a match |
| 8 | Asset / facility / ERP systems | F17 | One adapter per ERP vendor; **inventory/maintenance/cost fields are discarded at the adapter boundary** before the payload ever reaches application code — not merely unused, structurally absent from the `facilities` table | Read-only (status/location) | External: facility status, location, and all inventory/maintenance/cost data (untouched). EPMP: none | Feed unavailable → facility markers on operating picture retain last-known status, visibly aged |
| 9 | SharePoint / document systems | F17 (feeds F3) | Document adapter executing under the **requesting user's delegated credentials** (OAuth2 on-behalf-of flow against the document system), reused by F3's plan-import flow | Permission-aware import/link | External: document content and permissions. EPMP: plan/SOP structure and linkage metadata only | Permission check failure → `IMPORT_PERMISSION_DENIED` (403), never falls back to a cached/stale permission state; Link-live mode re-checks permission on every scheduled sync and **immediately restricts** EPMP-side visibility on a detected downgrade |

### 7.3 Standards Alignment at the Adapter Layer

| Standard | Where applied |
|---|---|
| OGC services / GeoJSON / Esri REST | F11 adapter (#1) — normalized internally to GeoJSON regardless of source vendor protocol |
| OASIS CAP | F14's CAP-formatting adapter (#5) |
| OASIS EDXL (RM/DE) | Reserved for F4/F13 resource-request exchange with partner agencies beyond MVP's basic resource-request lifecycle — adapter interface (`IntegrationAdapter<TRecord>`) is generic enough to accept an EDXL-RM payload shape later without a redesign, but no EDXL adapter ships in this MVP |
| NIEM data models | Reserved for cross-agency semantic exchange beyond MVP's declared record types; not elaborated further per the FRD's evidence boundary |
| STIX/TAXII, FHIR | Explicitly optional, no MVP feature requires them; the adapter interface could host either if a regulated use case emerges, but none is built |
| OAuth2/OIDC/SAML2 | Keycloak federation (§5.1) for user SSO; OAuth2 client-credentials for adapter-to-vendor and partner API-client authentication |
| Webhooks with idempotent retries | `webhook_subscriptions`/`webhook_deliveries` (F10, `02a-data-auth-org.md`); every delivery carries an `idempotency_key`, duplicate keys within the retry window are no-ops |

### 7.4 Record-Authority Registry as the Integration Contract of Record

The `record_authority_registry` table (admin-managed via F10 S10.2 / F8 S8.6) is the single declarative source of truth answering "which system owns this record type" for every integration — this is deliberately a **data-driven configuration**, not hard-coded per-adapter logic, so that:
1. A new agency's record-authority decisions (e.g., "this agency's WebEOC remains authoritative for resource requests, but EPMP is authoritative for incidents") can be configured without a code change.
2. The decision is auditable (every change to the registry is itself an audited action, per F8).
3. Every write path in F13/F15/F16/F17 consults the same registry before applying an inbound or outbound change, guaranteeing consistent enforcement across all seven integration features rather than seven independently-reasoned implementations.
