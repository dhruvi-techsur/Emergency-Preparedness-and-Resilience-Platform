## API Endpoints — Auth, Admin & Platform (Y1a)

All endpoints are versioned under `/api/v1`, JSON request/response, OAuth2/OIDC bearer-token authenticated unless noted. Covers F0 (session/theme), F8 (Security & Administration), F10 (API clients/federation), F16 (SSO), F18 (persona landing config).

### Session & Theme (F0)

**`GET /api/v1/me`**
Response: `{ id, email, name, role: {id, name, persona_id}, jurisdiction_scope: [UUID], theme_preference }`

**`PATCH /api/v1/me/preferences`**
Request: `{ theme_preference: "light"|"dark"|"contrast" }`
Response: `200 { theme_preference }` · Errors: `500 THEME_SAVE_FAILED`

**`GET /api/v1/search?q={query}`**
Response: `{ results: [{type, id, title, href}] }` grouped by record type, scoped by RBAC. Errors: `503 SEARCH_UNAVAILABLE`

### Persona Views (F18)

**`GET /api/v1/me/landing-config`**
Response: `{ default_route, nav_groups: [...], mobile_bottom_bar_items: [...] }` · Errors: `200 ROLE_VIEW_UNMAPPED` (fallback payload)

**`GET /api/v1/me/nav-config`**
Response: role-filtered nav groups, same shape as above.

### Security & Administration (F8)

**`POST /api/v1/auth/sso/callback`**
Request: SAML2 assertion or OIDC token per protocol. Response: `{ session_token, user: {...} }` · Errors: `401 SSO_AUTH_FAILED`

**`GET /api/v1/admin/sso-config`** / **`PATCH /api/v1/admin/sso-config`**
Request (PATCH): `{ protocol, idp_metadata_url|idp_metadata_xml, attribute_mapping, group_to_role_mapping }`
Response: `{ id, tested_at, active }` · Errors: `422 SSO_CONFIG_INVALID`

**`POST /api/v1/admin/sso-config/test`**
Tests connectivity without activating. Response: `{ success: boolean, details }`

**`GET /api/v1/admin/users`** (paginated, filterable by role/jurisdiction/status)
Response: `{ items: [{id, name, email, role, jurisdiction_scope, status, last_login_at}], total, page }`

**`POST /api/v1/admin/users`**
Request: `{ email, name, role_id, jurisdiction_scope }`

**`PATCH /api/v1/admin/users/{id}`**
Request: `{ role_id?, jurisdiction_scope?, status? }` · Errors: `409 ROLE_IN_USE` (on role deletion attempts elsewhere)

**`GET /api/v1/admin/roles`** / **`PATCH /api/v1/admin/roles/{id}`**
Request (PATCH): `{ permissions: [{feature, actions: [string]}] }`

**`GET /api/v1/admin/audit-log`** (filterable: date_range, actor_id, action_type, record_type; paginated)
Response: `{ items: [{id, actor, action, record_type, record_id, occurred_at, detail}], total }`
*(No PATCH/DELETE route exists for this resource by design — append-only.)*

**`GET /api/v1/admin/integration-health`**
Response: `{ items: [{system_name, last_sync_at, direction, record_authority, sync_status, error_count}] }`

**`GET /api/v1/admin/platform-health`**
Response: `{ uptime_pct, active_sessions, failed_login_rate, integration_error_rate, alerts: [{subsystem, message, since}] }`

### API Clients & Federation (F10)

**`GET /api/v1/admin/api-clients`** / **`POST /api/v1/admin/api-clients`**
Request (POST): `{ client_name, scopes: [string] }` → Response includes one-time `client_secret`.

**`POST /api/v1/admin/api-clients/{id}/revoke`**
Immediate effect, no caching window. Response: `204`

**`GET /api/v1/admin/record-authority`** / **`POST /api/v1/admin/record-authority`**
Request (POST): `{ record_type, authoritative_system, notes? }`

**`GET /api/v1/admin/federation-grants`** / **`POST /api/v1/admin/federation-grants`**
Request (POST): `{ partner_jurisdiction_id, scope: {record_types: [...], incident_filters: {...}}, expires_at? }`

**`POST /api/v1/admin/federation-grants/{id}/revoke`**
Immediate effect. Response: `204` · Errors (on subsequent access): `403 FEDERATION_ACCESS_DENIED`

### Webhook Subscriptions (F10, shared contract)

**`POST /api/v1/admin/webhook-subscriptions`**
Request: `{ callback_url, event_types: [string], secret }`
Delivery payload (to `callback_url`): `{ idempotency_key, event_type, payload, delivered_at }` — consumers must treat duplicate `idempotency_key` deliveries as no-ops.

### Common Response Envelope

All list endpoints return `{ items: [...], total: int, page: int, page_size: int }`. All error responses return `{ error_code, message, details? }` matching the HTTP status and code conventions in `Y2-errors.md`.
