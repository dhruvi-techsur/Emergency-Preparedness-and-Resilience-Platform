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
