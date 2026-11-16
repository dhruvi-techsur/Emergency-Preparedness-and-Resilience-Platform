import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  Avatar,
  TextField,
  Select,
  Button,
  Modal,
  type TableColumn,
  type SelectOption,
} from '@epmp/design-system';
import { apiGet, apiPost } from '../../lib/api-client';

/** Matches backend's AdminUserSummary shape (03a-api-auth-admin.md). */
interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  jurisdiction_scope: string[];
  status: 'Active' | 'Suspended';
  last_login_at: string | null;
}

interface AdminUsersListResponse {
  items: AdminUserSummary[];
  total: number;
  page: number;
  page_size: number;
}

/** Only the two roles 01-01's seed script actually creates permissions for
 * are meaningfully filterable in Phase 1, but the filter itself should work
 * against whatever `GET /api/v1/admin/roles` returns in the future too — for
 * now, derive role filter options from the loaded users themselves rather
 * than hardcoding the 5 persona role names, since this screen has no
 * dependency on the Roles endpoint and shouldn't invent one just for a
 * filter dropdown. */
const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Suspended', label: 'Suspended' },
];

function formatLastLogin(iso: string | null): string {
  if (!iso) return 'Never';
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Add-user modal state — Phase 1 scope note: the FRD's S8.2 only
 * specifies list+detail with role/status edit, not a dedicated creation
 * form. "Add user" is implemented here as a Modal rather than a separate
 * creation page, since no such page is specified anywhere in the FRD/UX
 * mockup for this screen. */
function AddUserModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [roleId, setRoleId] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Role options: no dedicated roles-lookup is fetched by this modal to
  // keep UsersList's own data dependency limited to GET /api/v1/admin/users
  // per the plan's artifact scope; the admin instead types/knows the
  // role_id. Phase 1's RolesPermissions screen (01-11 Task 2) is where an
  // admin can look up each role's id if needed. This is a documented
  // Phase-1 simplification of the "Add user" modal, not a spec requirement.
  const resetAndClose = () => {
    setEmail('');
    setName('');
    setRoleId('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiPost('/api/v1/admin/users', { email, name, role_id: roleId });
      resetAndClose();
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create user.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Add user"
      onClose={resetAndClose}
      footer={
        <>
          <Button variant="secondary" onClick={resetAndClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>
            Add user
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="ep-add-user-form">
        <TextField
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <TextField
          label="Role ID"
          required
          hint="Paste the role's id from Roles & Permissions."
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
        />
        {error ? <p role="alert">{error}</p> : null}
      </form>
    </Modal>
  );
}

/**
 * F8 S8.2 — Users list. Table's built-in loading/empty/error props are
 * wired directly from this query's own state (isLoading/isError/empty
 * rows), per Table's "every consumer gets this for free" contract — this
 * screen does not reimplement its own skeleton/empty/error rendering.
 */
export function UsersList(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [addUserOpen, setAddUserOpen] = React.useState(false);

  const hasActiveFilter = search.trim() !== '' || statusFilter !== '';

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users', statusFilter],
    queryFn: () =>
      apiGet<AdminUsersListResponse>(
        `/api/v1/admin/users${statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : ''}`,
      ),
  });

  const allItems = data?.items ?? [];
  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [allItems, search]);

  const columns: TableColumn<AdminUserSummary>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <a
          href={`/admin/users/${row.id}`}
          className="ep-users-list__name-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/admin/users/${row.id}`);
          }}
        >
          <Avatar name={row.name} />
          <span>{row.name}</span>
        </a>
      ),
    },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    {
      key: 'jurisdiction_scope',
      header: 'Jurisdiction scope',
      render: (row) =>
        row.jurisdiction_scope.length === 0
          ? '—'
          : row.jurisdiction_scope.length === 1
            ? '1 jurisdiction'
            : `${row.jurisdiction_scope.length} jurisdictions`,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Table.StatusCell tone={row.status === 'Active' ? 'success' : 'danger'}>
          {row.status}
        </Table.StatusCell>
      ),
    },
    {
      key: 'last_login_at',
      header: 'Last login',
      render: (row) => formatLastLogin(row.last_login_at),
    },
  ];

  return (
    <div className="ep-users-list">
      <PageHeader
        title="Users"
        crumbs={[{ label: 'Admin' }, { label: 'Users' }]}
        actions={[
          <Button key="add-user" variant="primary" onClick={() => setAddUserOpen(true)}>
            Add user
          </Button>,
        ]}
      />

      <div className="ep-users-list__toolbar">
        <TextField
          label="Search"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <Card padded={false}>
        <Table
          caption="Users"
          columns={columns}
          rows={filteredItems}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load users.', onRetry: () => void refetch() }
              : undefined
          }
          empty={
            hasActiveFilter
              ? { title: 'No users match', children: 'Clear filters to see all users.' }
              : { title: 'No users yet' }
          }
        />
      </Card>

      <AddUserModal
        open={addUserOpen}
        onClose={() => setAddUserOpen(false)}
        onCreated={() => {
          void queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        }}
      />
    </div>
  );
}
