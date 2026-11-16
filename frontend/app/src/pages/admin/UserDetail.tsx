import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Select,
  Checkbox,
  Button,
  Modal,
  Badge,
  type SelectOption,
} from '@epmp/design-system';
import { apiGet, apiPatch } from '../../lib/api-client';

/** Matches backend's AdminUserSummary shape, plus the role/jurisdiction ids
 * this detail screen needs that the list's summary row doesn't carry. The
 * backend's PATCH /api/v1/admin/users/{id} returns the same
 * AdminUserSummary shape (role NAME, not id) after a mutation, so this
 * screen re-derives "current role_id" by matching `role` (name) against the
 * roles list it also fetches, rather than the backend returning a
 * role_id directly on this endpoint. */
interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  jurisdiction_scope: string[];
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

interface RoleOption {
  id: string;
  name: string;
}

interface AdminRolesResponse extends Array<{ id: string; name: string; persona_id: string }> {}

/**
 * Phase 1 note: `Combobox` (built in 01-05) is single-select only, and a
 * true multi-select combobox is explicitly listed as "Not yet built" in the
 * design system's Open Decisions section. Jurisdiction-scope editing is
 * therefore rendered as a list of `Checkbox`es (one per known jurisdiction)
 * rather than a multi-select Combobox — this substitution is intentional
 * and documented here, not an oversight. There is also no
 * `GET /api/v1/admin/jurisdictions` endpoint in this phase's backend
 * surface (01-01's seed creates exactly one "Default Agency" jurisdiction
 * row, with no admin list/CRUD route built for it anywhere in Phase 1's
 * API surface) — so the only jurisdiction ids this screen can offer as
 * checkboxes are the ones already present across the fetched user list's
 * own `jurisdiction_scope` arrays. This keeps the screen functional
 * (toggle membership in whatever jurisdictions already exist) without
 * inventing a new endpoint outside this plan's integration_contracts.
 */
function useKnownJurisdictionIds(): string[] {
  const { data } = useQuery({
    queryKey: ['admin-users', 'all-for-jurisdictions'],
    queryFn: () => apiGet<{ items: AdminUserSummary[] }>('/api/v1/admin/users?page_size=1000'),
  });
  return React.useMemo(() => {
    const ids = new Set<string>();
    for (const u of data?.items ?? []) {
      for (const j of u.jurisdiction_scope) ids.add(j);
    }
    return Array.from(ids);
  }, [data]);
}

export function UserDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const knownJurisdictionIds = useKnownJurisdictionIds();

  const [suspendModalOpen, setSuspendModalOpen] = React.useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = React.useState(false);
  const [statusActionError, setStatusActionError] = React.useState<string | null>(null);

  const userQuery = useQuery({
    queryKey: ['admin-user', id],
    // There is no GET /api/v1/admin/users/{id} in this phase's API surface
    // (only list + PATCH) — fetch the full list and find this row, same
    // dependency UsersList already pays for. page_size=1000 keeps this
    // deterministic for the same reason 01-07's own admin.test.ts needed it
    // (see 01-07-SUMMARY.md's documented deviation).
    queryFn: async () => {
      const res = await apiGet<{ items: AdminUserSummary[] }>(
        '/api/v1/admin/users?page_size=1000',
      );
      const user = res.items.find((u) => u.id === id);
      if (!user) throw new Error('User not found.');
      return user;
    },
  });

  const rolesQuery = useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => apiGet<AdminRolesResponse>('/api/v1/admin/roles'),
  });

  const roleOptions: SelectOption[] = (rolesQuery.data ?? []).map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const currentRoleId =
    (rolesQuery.data ?? []).find((r: RoleOption) => r.name === userQuery.data?.role)?.id ?? '';

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role_id = e.target.value;
    await apiPatch(`/api/v1/admin/users/${id}`, { role_id });
    void queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
    void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const handleJurisdictionToggle = async (jurisdictionId: string, checked: boolean) => {
    const current = userQuery.data?.jurisdiction_scope ?? [];
    const next = checked
      ? [...current, jurisdictionId]
      : current.filter((j) => j !== jurisdictionId);
    await apiPatch(`/api/v1/admin/users/${id}`, { jurisdiction_scope: next });
    void queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
    void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  };

  const handleConfirmSuspend = async () => {
    setStatusActionError(null);
    try {
      await apiPatch(`/api/v1/admin/users/${id}`, { status: 'Suspended' });
      setSuspendModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (err) {
      setStatusActionError(err instanceof Error ? err.message : 'Could not suspend access.');
    }
  };

  const handleConfirmReactivate = async () => {
    setStatusActionError(null);
    try {
      await apiPatch(`/api/v1/admin/users/${id}`, { status: 'Active' });
      setReactivateModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
      void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (err) {
      setStatusActionError(err instanceof Error ? err.message : 'Could not reactivate access.');
    }
  };

  if (userQuery.isLoading || !userQuery.data) {
    return <div className="ep-user-detail" aria-busy="true" />;
  }

  const user = userQuery.data;
  const isActive = user.status === 'Active';

  return (
    <div className="ep-user-detail">
      <PageHeader
        title={user.name}
        crumbs={[{ label: 'Admin' }, { label: 'Users', href: '/admin/users' }, { label: user.name }]}
        status={
          <Badge tone={isActive ? 'success' : 'danger'}>{user.status}</Badge>
        }
        actions={[
          isActive ? (
            <Button key="suspend" variant="danger" onClick={() => setSuspendModalOpen(true)}>
              Suspend access
            </Button>
          ) : (
            <Button key="reactivate" variant="primary" onClick={() => setReactivateModalOpen(true)}>
              Reactivate
            </Button>
          ),
        ]}
      />

      <Card title="Role">
        <Select
          label="Role"
          options={roleOptions.length > 0 ? roleOptions : [{ value: currentRoleId, label: user.role }]}
          value={currentRoleId}
          onChange={(e) => void handleRoleChange(e)}
        />
      </Card>

      <Card
        title="Jurisdiction scope"
        subtitle="Phase 1 note: rendered as a Checkbox list rather than a multi-select Combobox — a true multi-select Combobox is not yet built in the design system (see Open Decisions)."
      >
        {knownJurisdictionIds.length === 0 ? (
          <p>No jurisdictions exist yet.</p>
        ) : (
          knownJurisdictionIds.map((jid) => (
            <Checkbox
              key={jid}
              label={jid}
              checked={user.jurisdiction_scope.includes(jid)}
              onChange={(e) => void handleJurisdictionToggle(jid, e.target.checked)}
            />
          ))
        )}
      </Card>

      <Modal
        open={suspendModalOpen}
        danger
        title={`Suspend ${user.name}'s access?`}
        onClose={() => setSuspendModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSuspendModalOpen(false)}>
              Keep active
            </Button>
            <Button variant="danger" onClick={() => void handleConfirmSuspend()}>
              Suspend access
            </Button>
          </>
        }
      >
        <p>
          They will be signed out immediately and unable to sign back in until reactivated.
        </p>
        {statusActionError ? <p role="alert">{statusActionError}</p> : null}
      </Modal>

      <Modal
        open={reactivateModalOpen}
        title={`Reactivate ${user.name}'s access?`}
        onClose={() => setReactivateModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setReactivateModalOpen(false)}>
              Keep suspended
            </Button>
            <Button variant="primary" onClick={() => void handleConfirmReactivate()}>
              Reactivate access
            </Button>
          </>
        }
      >
        <p>They will be able to sign in again immediately.</p>
        {statusActionError ? <p role="alert">{statusActionError}</p> : null}
      </Modal>
    </div>
  );
}
