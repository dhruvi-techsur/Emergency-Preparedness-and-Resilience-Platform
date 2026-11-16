import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Card, Table, Checkbox, Button, Modal, type TableColumn } from '@epmp/design-system';
import { apiGet, apiPatch } from '../../lib/api-client';

interface PermissionPair {
  feature: string;
  actions: string[];
}

interface Role {
  id: string;
  name: string;
  persona_id: string;
  description?: string;
  permissions: PermissionPair[];
}

/**
 * The full feature×action matrix (`incidents`, `tasks`, `resource_requests`,
 * etc.) populates in later phases as those features ship. Phase 1's own
 * seed script (backend/scripts/seed.ts) only ever writes `role_permissions`
 * rows for exactly two `feature` values — `platform` and `admin` — so this
 * is the entire matrix this screen can edit right now. The UI is
 * structurally ready to grow: KNOWN_FEATURES is the only place a future
 * phase needs to add an entry.
 */
const KNOWN_FEATURES = ['platform', 'admin'] as const;
const KNOWN_ACTIONS = ['view', 'create', 'edit', 'approve'] as const;

function actionsToSet(permissions: PermissionPair[], feature: string): Set<string> {
  const pair = permissions.find((p) => p.feature === feature);
  return new Set(pair?.actions ?? []);
}

function permissionSummary(permissions: PermissionPair[]): string {
  if (permissions.length === 0) return 'No permissions';
  return permissions.map((p) => `${p.feature}: ${p.actions.join(', ') || 'none'}`).join('; ');
}

export function RolesPermissions(): JSX.Element {
  const queryClient = useQueryClient();

  const rolesQuery = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => apiGet<Role[]>('/api/v1/admin/roles'),
  });

  const [editingRole, setEditingRole] = React.useState<Role | null>(null);
  const [draft, setDraft] = React.useState<Record<string, Set<string>>>({});
  const [confirmPending, setConfirmPending] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);

  const openEditor = (role: Role) => {
    const nextDraft: Record<string, Set<string>> = {};
    for (const feature of KNOWN_FEATURES) {
      nextDraft[feature] = actionsToSet(role.permissions, feature);
    }
    setDraft(nextDraft);
    setEditingRole(role);
    setSaveError(null);
  };

  const toggleAction = (feature: string, action: string, checked: boolean) => {
    setDraft((prev) => {
      const next = new Set(prev[feature] ?? []);
      if (checked) next.add(action);
      else next.delete(action);
      return { ...prev, [feature]: next };
    });
  };

  // Caller contract: "never render two Modals simultaneously open" — the
  // edit Modal closes BEFORE the confirmation Modal opens (sequential, not
  // stacked). confirmPending holds the fact that we're mid-save with
  // editingRole/draft still populated for the confirmation copy + the
  // actual PATCH body.
  const handleRequestSave = () => {
    setConfirmPending(true);
  };

  const handleCancelConfirm = () => {
    setConfirmPending(false);
  };

  const handleConfirmSave = async () => {
    if (!editingRole) return;
    setSaving(true);
    setSaveError(null);
    try {
      const permissions: PermissionPair[] = KNOWN_FEATURES.map((feature) => ({
        feature,
        actions: Array.from(draft[feature] ?? []),
      }));
      await apiPatch(`/api/v1/admin/roles/${editingRole.id}`, { permissions });
      setConfirmPending(false);
      setEditingRole(null);
      void queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not update permissions.');
      setConfirmPending(false);
    } finally {
      setSaving(false);
    }
  };

  const columns: TableColumn<Role>[] = [
    { key: 'name', header: 'Name' },
    { key: 'persona_id', header: 'Persona' },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (row) => permissionSummary(row.permissions),
    },
  ];

  const roles = rolesQuery.data ?? [];

  return (
    <div className="ep-roles-permissions">
      <PageHeader title="Roles & permissions" crumbs={[{ label: 'Admin' }, { label: 'Roles & permissions' }]} />

      <Card padded={false}>
        <Table
          caption="Roles"
          columns={columns}
          rows={roles}
          rowKey={(row) => row.id}
          onRowClick={openEditor}
          loading={rolesQuery.isLoading}
          error={
            rolesQuery.isError
              ? { message: 'Could not load roles.', onRetry: () => void rolesQuery.refetch() }
              : undefined
          }
          empty={{ title: 'No roles yet' }}
        />
      </Card>

      {/* Edit-permissions Modal — per feature × action Checkbox groups. */}
      <Modal
        open={Boolean(editingRole) && !confirmPending}
        title={editingRole ? `Edit permissions — ${editingRole.name}` : ''}
        onClose={() => setEditingRole(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditingRole(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRequestSave}>
              Save changes
            </Button>
          </>
        }
      >
        {editingRole
          ? KNOWN_FEATURES.map((feature) => (
              <fieldset key={feature} className="ep-roles-permissions__feature-group">
                <legend>{feature}</legend>
                {KNOWN_ACTIONS.map((action) => (
                  <Checkbox
                    key={action}
                    label={action}
                    checked={draft[feature]?.has(action) ?? false}
                    onChange={(e) => toggleAction(feature, action, e.target.checked)}
                  />
                ))}
              </fieldset>
            ))
          : null}
        {saveError ? <p role="alert">{saveError}</p> : null}
      </Modal>

      {/* Confirmation Modal — permission changes "require confirmation"
          per the FRD; this is the second, sequential Modal (the edit
          Modal above is closed, per `open={... && !confirmPending}`,
          whenever this one is shown). */}
      <Modal
        open={confirmPending}
        danger={false}
        title={`Update permissions for ${editingRole?.name ?? ''}?`}
        onClose={handleCancelConfirm}
        footer={
          <>
            <Button variant="secondary" onClick={handleCancelConfirm}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleConfirmSave()} loading={saving}>
              Save changes
            </Button>
          </>
        }
      >
        <p>This changes what this role can do across EPMP immediately.</p>
      </Modal>
    </div>
  );
}
