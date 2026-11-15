## F8: Security & Administration

**Description:** The identity, access, audit, and operational-monitoring foundation required for secure multi-role use from day one. Owns RBAC, SSO session management, the append-only audit trail, encryption posture, and the admin console UI used to configure all of the above.

**Terminology:**
- **RBAC:** Role-Based Access Control, scoped by role and incident/jurisdiction.
- **Audit log:** Append-only record of security-relevant actions (login, permission change, record access, AI-draft approval).
- **SSO:** Single sign-on via SAML2/OIDC against an agency's identity provider (shared critical path with F16).
- **Integration health:** Status view of external system connectivity, sync direction, and record authority (detailed screens shared with F13/F15; owned here as the platform-wide pattern).

### Sub-features
- SSO via SAML2/OIDC against an agency IdP.
- Granular, role- and incident-scoped RBAC covering every persona.
- Full audit logging of security-relevant actions, append-only.
- Encryption at rest and in transit for all operational data.
- Operational/availability monitoring and alerting for platform health.
- Admin console UI for user, role, and integration management.

### Screens

**S8.1 — Admin Console Shell**
- Built from the same app shell (F0) with an admin-scoped `SideNav`: Users, Roles & Permissions, Audit Log, Integration Health, Platform Monitoring. Visible only to users with the `IT/SecOps Admin` role (PER-05 admin facet).

**S8.2 — Users (List + Detail)**
- `Table`: Name (`Avatar`), Email, Role, Jurisdiction scope, Status (Active/Suspended), Last login. Detail view: role assignment `Select`, jurisdiction-scope `Combobox` (multi), "Suspend access" (`danger`, requires `Modal` confirmation) / "Reactivate" actions.

**S8.3 — Roles & Permissions**
- `Table` of roles with permission matrix (feature × action, e.g., "Incidents: create/view/edit/approve-activation"). Editing a role's permissions opens a form with `Checkbox` groups per feature area. Changes require confirmation and are logged.

**S8.4 — SSO Configuration**
- Form: IdP metadata URL or XML upload (`TextField`/file input), protocol `Select` (SAML2/OIDC), attribute-mapping fields (email, name, groups → role mapping table). "Test connection" (secondary) before "Save configuration" (primary).

**S8.5 — Audit Log View**
- Shared pattern with F7 S7.4 (Evidence & Audit Log); this screen additionally surfaces security-specific filters: login events, permission changes, record-access events, AI-draft approvals. Read-only, exportable, no edit/delete.

**S8.6 — Integration Health**
- `Table`: System (WebEOC/GIS/Everbridge/CAD/HR-IAM/etc.), Last sync, Direction (in/out/bidirectional), Record authority, `SyncStatus`. Conflict rows show "Keep EPMP value" / "Keep [external] value" actions inline (shared pattern with F13 S13.x).

**S8.7 — Platform Monitoring**
- `Stat` row: uptime, active sessions, failed-login rate, integration-error rate. `Card`s with trend charts (`LineChart`) for availability over time. Alert banner (`Alert` danger, persistent) surfaces any current platform-health incident until resolved.

### Process
1. A user authenticates via the agency's IdP (SAML2/OIDC) through F16's shared SSO integration; F8 validates the assertion/token, resolves or provisions the local user record, and maps IdP groups/attributes to an EPMP role per the configured mapping (S8.4).
2. Every authenticated session is scoped by RBAC: the user's role and jurisdiction scope determine which `SideNav` groups, actions, and records are visible across every other feature (F0–F18).
3. Every security-relevant action (login, logout, permission change, record access to a sensitive record type, AI-draft approval per F9) writes an immutable entry to the audit log with actor, timestamp, action, and affected record.
4. Admins (PER-05 admin facet) manage users and role/permission assignments via S8.2/S8.3; every change is itself an audited action.
5. Admins configure and monitor external integrations' health via S8.6, declaring record authority per system/record-type pair (shared contract with F10, F13, F15, F16, F17); conflicts are never silently resolved — an admin or designated resolver must choose a value.
6. Platform monitoring (S8.7) continuously tracks availability and error rates, surfacing a persistent `Alert` when thresholds are breached, until the underlying issue is resolved.
7. Data at rest and in transit is encrypted per the platform's security baseline (TechArch concern for implementation; this FRD requires the capability to be present and verifiable in every release).

### Inputs
- SSO config: `idp_metadata` (URL or XML, required), `protocol` (enum: `SAML2`|`OIDC`, required), `attribute_mapping` ({email_attr, name_attr, group_attr}, required), `group_to_role_mapping` ([{idp_group, epmp_role}], required).
- User management: `role_id` (UUID, required), `jurisdiction_scope` (UUID[], required), `status` (enum: `Active`|`Suspended`).
- Role/permission edit: `role_id` (UUID, required), `permissions` ([{feature, actions: [string]}], required).
- Audit log query: `date_range`, `actor_id`, `action_type` (all optional filters).

### Outputs
- Authenticated session with resolved role and jurisdiction scope, consumed by every other feature's RBAC checks.
- Append-only audit log entries queryable/exportable via S8.5.
- Integration-health status table consumed by/shared with F13/F15/F10.
- Platform availability/error-rate metrics and alerts.

### Validation
- SSO configuration must pass "Test connection" before it can be saved as active — no untested IdP config goes live.
- A role cannot be deleted while any user is currently assigned to it; it must be reassigned first.
- Permission changes must be logged with the before/after permission set, not just "permissions changed."
- Audit log entries are immutable and exempt from any delete/edit code path, including for admins — this is enforced at the data layer, not just the UI.
- Suspending a user's access must immediately invalidate active sessions for that user (not wait for token expiry).
- No screen, including the admin console, may claim FedRAMP authorization in any copy.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| IdP metadata invalid or unreachable | 422 | SSO_CONFIG_INVALID | "Couldn't validate this identity provider configuration. Check the metadata URL and retry." |
| SSO assertion/token validation failed | 401 | SSO_AUTH_FAILED | "Sign-in with your organization account failed. Contact your administrator if this continues." |
| Role deletion attempted with active assignments | 409 | ROLE_IN_USE | "Reassign all users before deleting this role." |
| Audit log delete/edit attempted (any role) | 403 | AUDIT_LOG_IMMUTABLE | "Audit log entries can't be edited or deleted." |
| Platform health threshold breached | 200 (alert) | PLATFORM_HEALTH_DEGRADED | "[Subsystem] is degraded. [N] users affected. Investigating." |

### API Surface (this feature)
See `Y1a-api-auth-admin.md` §Security & Administration for `POST /api/v1/auth/sso/callback`, `GET/PATCH /api/v1/admin/sso-config`, `GET/POST /api/v1/admin/users`, `GET/PATCH /api/v1/admin/roles`, `GET /api/v1/admin/audit-log`, `GET /api/v1/admin/integration-health`, `GET /api/v1/admin/platform-health`.

### Schema Surface (this feature)
Owns tables `users`, `roles`, `role_permissions`, `audit_log`, `sso_config`, `integration_health` — see `Y0a-schema-auth-org.md` §Security & Administration. Read by every other feature for RBAC enforcement.
