import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  type TableColumn,
  Button,
  Modal,
  Combobox,
  Checkbox,
  DatePicker,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost } from '../../lib/api-client';

/**
 * F10 S10.3 — Federation Grants. Phase 1 data-availability constraint: no
 * dedicated jurisdictions-list endpoint exists yet, so the partner
 * jurisdiction Combobox reuses the single seeded "Default Agency"
 * jurisdiction (01-01's seed script) — derived here from any admin user's
 * jurisdiction_scope[0], since every Phase 1 user is scoped to that one
 * jurisdiction. A real multi-jurisdiction picker needs more seeded
 * reference data than this phase ships; a later phase with a proper
 * jurisdictions endpoint can replace this derivation without changing this
 * screen's contract.
 *
 * Scope record-type checkboxes are limited to Phase 1's single seeded
 * record_authority_registry entry relevant to federation ('user_identity')
 * — this list genuinely grows as later phases add record types.
 */

interface AdminUserRow {
  id: string;
  jurisdiction_scope: string[];
}

interface AdminUsersResponse {
  items: AdminUserRow[];
}

interface FederationGrantRow {
  id: string;
  partner_jurisdiction_id: string;
  scope: { record_types: string[] };
  granted_by: string;
  expires_at: string | null;
  status: 'Active' | 'Revoked';
}

const AVAILABLE_RECORD_TYPES = ['user_identity'];

const COLUMNS: TableColumn<FederationGrantRow>[] = [
  { key: 'partner_jurisdiction_id', header: 'Partner jurisdiction' },
  { key: 'scope', header: 'Scope granted', render: (row) => row.scope.record_types.join(', ') },
  { key: 'granted_by', header: 'Granted by' },
  {
    key: 'expires_at',
    header: 'Expires',
    render: (row) => (row.expires_at ? new Date(row.expires_at).toLocaleDateString() : 'Never'),
  },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Table.StatusCell tone={row.status === 'Active' ? 'success' : 'danger'}>{row.status}</Table.StatusCell>
    ),
  },
];

export function FederationGrants(): JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['federation-grants'],
    queryFn: () => apiGet<FederationGrantRow[]>('/api/v1/admin/federation-grants'),
  });

  // Phase 1 workaround: derive the single seeded jurisdiction id from any
  // admin user's jurisdiction_scope, since no jurisdictions-list endpoint
  // exists yet.
  const { data: usersData } = useQuery({
    queryKey: ['admin-users-for-jurisdiction-lookup'],
    queryFn: () => apiGet<AdminUsersResponse>('/api/v1/admin/users'),
  });

  const jurisdictionOptions: ComboboxOption[] = React.useMemo(() => {
    const firstJurisdictionId = usersData?.items.find((u) => u.jurisdiction_scope.length > 0)
      ?.jurisdiction_scope[0];
    return firstJurisdictionId
      ? [{ value: firstJurisdictionId, label: 'Default Agency' }]
      : [];
  }, [usersData]);

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [partnerJurisdictionId, setPartnerJurisdictionId] = React.useState('');
  const [selectedRecordTypes, setSelectedRecordTypes] = React.useState<string[]>([]);
  const [expiresAt, setExpiresAt] = React.useState('');
  const [createPending, setCreatePending] = React.useState(false);

  const [revokeTarget, setRevokeTarget] = React.useState<FederationGrantRow | null>(null);
  const [revokePending, setRevokePending] = React.useState(false);

  function openCreateModal() {
    setPartnerJurisdictionId('');
    setSelectedRecordTypes([]);
    setExpiresAt('');
    setCreateModalOpen(true);
  }

  function toggleRecordType(recordType: string) {
    setSelectedRecordTypes((prev) =>
      prev.includes(recordType) ? prev.filter((t) => t !== recordType) : [...prev, recordType],
    );
  }

  async function handleCreate() {
    setCreatePending(true);
    try {
      await apiPost('/api/v1/admin/federation-grants', {
        partner_jurisdiction_id: partnerJurisdictionId,
        scope: { record_types: selectedRecordTypes },
        expires_at: expiresAt || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['federation-grants'] });
      setCreateModalOpen(false);
    } finally {
      setCreatePending(false);
    }
  }

  async function handleConfirmRevoke() {
    if (!revokeTarget) return;
    setRevokePending(true);
    try {
      await apiPost(`/api/v1/admin/federation-grants/${revokeTarget.id}/revoke`, {});
      // Invalidating the query cache causes an immediate re-fetch, so the
      // table shows Status: Revoked with no manual page reload — this is
      // the plan's required "immediate, no page reload" behavior.
      await queryClient.invalidateQueries({ queryKey: ['federation-grants'] });
      setRevokeTarget(null);
    } finally {
      setRevokePending(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Federation grants"
        crumbs={[{ label: 'Admin' }, { label: 'Federation grants' }]}
        actions={[
          <Button key="grant" variant="primary" icon="plus" onClick={openCreateModal}>
            Grant access
          </Button>,
        ]}
      />

      <Card padded={false}>
        <Table
          caption="Federation grants"
          columns={[
            ...COLUMNS,
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (row) =>
                row.status === 'Active' ? (
                  <Button variant="danger" size="sm" onClick={() => setRevokeTarget(row)}>
                    Revoke
                  </Button>
                ) : null,
            },
          ]}
          rows={data ?? []}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={isError ? { message: 'Could not load federation grants.', onRetry: () => void refetch() } : undefined}
          empty={{
            title: 'No federation grants yet',
            children: 'Grant a partner jurisdiction access to specific record types.',
          }}
        />
      </Card>

      <Modal
        open={createModalOpen}
        title="Grant federation access"
        onClose={() => setCreateModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            {/* Disabled until at least one record-type checkbox is checked —
                UX convenience mirroring 01-08's backend, which re-validates
                scope.record_types non-empty regardless (400
                FEDERATION_GRANT_SCOPE_EMPTY). */}
            <Button
              variant="primary"
              disabled={!partnerJurisdictionId || selectedRecordTypes.length === 0}
              loading={createPending}
              onClick={handleCreate}
            >
              Grant access
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Combobox
            label="Partner jurisdiction"
            options={jurisdictionOptions}
            value={partnerJurisdictionId}
            onChange={(value) => setPartnerJurisdictionId(value)}
          />
          <div>
            <p className="overline" style={{ marginBottom: 'var(--space-2)' }}>
              Record types
            </p>
            {AVAILABLE_RECORD_TYPES.map((recordType) => (
              <Checkbox
                key={recordType}
                label={recordType}
                checked={selectedRecordTypes.includes(recordType)}
                onChange={() => toggleRecordType(recordType)}
              />
            ))}
          </div>
          <DatePicker
            label="Expires"
            value={expiresAt}
            onChange={(iso) => setExpiresAt(iso)}
          />
        </div>
      </Modal>

      <Modal
        open={revokeTarget !== null}
        title="Revoke this federation grant?"
        danger
        onClose={() => setRevokeTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRevokeTarget(null)}>
              Keep grant active
            </Button>
            <Button variant="danger" loading={revokePending} onClick={handleConfirmRevoke}>
              Revoke access
            </Button>
          </>
        }
      >
        The partner jurisdiction will immediately lose access to this scope.
      </Modal>
    </div>
  );
}
