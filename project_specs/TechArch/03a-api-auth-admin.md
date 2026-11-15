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
