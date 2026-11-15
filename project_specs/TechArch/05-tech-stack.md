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
