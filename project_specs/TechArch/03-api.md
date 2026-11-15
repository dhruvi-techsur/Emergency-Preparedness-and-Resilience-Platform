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
