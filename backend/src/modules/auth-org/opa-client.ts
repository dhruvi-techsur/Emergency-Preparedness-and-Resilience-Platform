/**
 * Thin REST client for OPA's Data/Query API.
 *
 * Permission data (`role_permissions`) is pushed into OPA's *data* document via
 * `syncRolePermissionsToOpa`, not re-sent on every decision query — the policy
 * (`backend/opa/policy.rego`) reads `data.role_permissions[role_id][feature]`.
 * `checkPermission` only sends `{role_id, feature, action}` as `input`. This
 * keeps the per-request payload small and matches the plan's documented
 * contract for `syncRolePermissionsToOpa` being called whenever
 * `role_permissions` changes (no caching window honoring a revoked grant,
 * per TechArch 04-security.md §5.2/§5.8 — re-sync happens immediately on
 * every edit, not on a timer).
 */

export interface CheckPermissionInput {
  role_id: string;
  feature: string;
  action: string;
}

export interface RolePermissionRow {
  role_id: string;
  feature: string;
  actions: string[];
}

function getOpaUrl(): string {
  return process.env.OPA_URL ?? 'http://localhost:8181';
}

/**
 * Queries OPA's `epmp/authz/allow` decision for the given role/feature/action.
 * Fails CLOSED (returns false) on any network error, non-2xx response, or
 * malformed decision body — never fails open. Per F8/F10's hard requirement
 * that an unreachable policy engine must deny, not allow, every request.
 */
export async function checkPermission(input: CheckPermissionInput): Promise<boolean> {
  try {
    const res = await fetch(`${getOpaUrl()}/v1/data/epmp/authz/allow`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    if (!res.ok) {
      console.error(`OPA decision query failed: HTTP ${res.status}`);
      return false;
    }
    const body = (await res.json()) as { result?: unknown };
    return body.result === true;
  } catch (err) {
    console.error('OPA unreachable — failing closed (denying permission):', err);
    return false;
  }
}

/**
 * Pushes the full role_permissions table into OPA's data document, grouped as
 * { [role_id]: { [feature]: actions[] } }. Called at server startup and by
 * the Wave 3 admin API after any role_permissions edit, so decisions never
 * lag a revoked/changed permission.
 */
export async function syncRolePermissionsToOpa(rows: RolePermissionRow[]): Promise<void> {
  const grouped: Record<string, Record<string, string[]>> = {};
  for (const row of rows) {
    grouped[row.role_id] ??= {};
    grouped[row.role_id][row.feature] = row.actions;
  }

  const res = await fetch(`${getOpaUrl()}/v1/data/role_permissions`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(grouped),
  });
  if (!res.ok) {
    throw new Error(`Failed to sync role_permissions to OPA: HTTP ${res.status}`);
  }
}
