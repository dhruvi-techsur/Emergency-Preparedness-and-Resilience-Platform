import { Alert, Card } from '@epmp/design-system';

/**
 * Shown instead of a blank/broken screen whenever GET /api/v1/me resolves to
 * 403 ROLE_UNRESOLVED (backend/src/modules/auth-org/rbac.ts) — a user whose
 * session is valid but whose account has no mapped role. Message text is
 * the FRD's exact string (F00-application-shell.md §Error States).
 */
export function RoleUnresolved(): JSX.Element {
  return (
    <div className="ep-role-unresolved">
      <Card>
        <Alert tone="danger" title="Role not assigned">
          Your account isn&apos;t assigned a role yet. Contact your administrator.
        </Alert>
      </Card>
    </div>
  );
}
