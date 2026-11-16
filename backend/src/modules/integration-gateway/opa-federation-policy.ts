import { query } from '../../db/client.js';

interface ActiveFederationGrantRow {
  id: string;
  partner_jurisdiction_id: string;
  scope: { record_types: string[]; incident_filters?: Record<string, unknown> };
  expires_at: string | null;
}

function getOpaUrl(): string {
  return process.env.OPA_URL ?? 'http://localhost:8181';
}

/**
 * Pushes the currently-active federation grant set into OPA's data document
 * (`/v1/data/federation_grants`). Called synchronously, BEFORE the HTTP
 * response, after every grant create/revoke — same "no caching window"
 * pattern as auth-org's syncRolePermissionsToOpa (01-03/01-07). By the time
 * a client sees the 204 from a revoke, OPA's data is already updated, so the
 * very next request evaluated against OPA sees the revoked state — this is
 * what makes revocation take effect "within the same request cycle" per this
 * plan's must_haves.
 */
export async function syncFederationGrantsToOpa(): Promise<void> {
  const rows = await query<ActiveFederationGrantRow>(
    `SELECT id, partner_jurisdiction_id, scope, expires_at
     FROM federation_grants
     WHERE status = 'Active' AND (expires_at IS NULL OR expires_at > now())`,
  );

  const res = await fetch(`${getOpaUrl()}/v1/data/federation_grants`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    throw new Error(`Failed to sync federation_grants to OPA: HTTP ${res.status}`);
  }
}
