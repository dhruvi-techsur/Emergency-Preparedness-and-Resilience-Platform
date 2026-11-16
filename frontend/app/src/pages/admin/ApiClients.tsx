import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  type TableColumn,
  Button,
  Modal,
  TextField,
  Checkbox,
  Alert,
} from '@epmp/design-system';
import { apiGet, apiPost } from '../../lib/api-client';

/**
 * F10 S10.1 — API Clients. The returned `client_secret` is a true one-shot
 * value: 01-08's backend never returns it again on any subsequent GET (see
 * api-clients.ts's own comment — "the ONLY place client_secret plaintext
 * ever exists"). This component mirrors that contract on the client side
 * (T-01-26 in this plan's threat model): the secret lives ONLY in this
 * component's own local state, is never written to the React Query cache,
 * never persisted to any storage, and is cleared the instant "Done" is
 * clicked — reopening the modal or reloading the page cannot resurface it
 * because nothing retains it past that point.
 */

interface ApiClientRow {
  id: string;
  client_name: string;
  scopes: string[];
  revoked: boolean;
  created_at: string;
}

interface CreateApiClientResponse extends ApiClientRow {
  client_secret: string;
}

const AVAILABLE_SCOPES = ['read:incidents', 'write:incidents', 'read:resources', 'write:resources'];

const COLUMNS: TableColumn<ApiClientRow>[] = [
  { key: 'client_name', header: 'Client name' },
  { key: 'scopes', header: 'Scopes', render: (row) => row.scopes.join(', ') },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Table.StatusCell tone={row.revoked ? 'danger' : 'success'}>
        {row.revoked ? 'Revoked' : 'Active'}
      </Table.StatusCell>
    ),
  },
];

export function ApiClients(): JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['api-clients'],
    queryFn: () => apiGet<ApiClientRow[]>('/api/v1/admin/api-clients'),
  });

  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [clientName, setClientName] = React.useState('');
  const [selectedScopes, setSelectedScopes] = React.useState<string[]>([]);
  const [createPending, setCreatePending] = React.useState(false);
  const [createError, setCreateError] = React.useState<string | null>(null);

  // One-shot local state: the ONLY place the plaintext secret ever lives on
  // the client. Never written to queryClient's cache, never persisted.
  const [revealedSecret, setRevealedSecret] = React.useState<string | null>(null);
  const [copyConfirmed, setCopyConfirmed] = React.useState(false);

  const [revokeTarget, setRevokeTarget] = React.useState<ApiClientRow | null>(null);
  const [revokePending, setRevokePending] = React.useState(false);

  function openCreateModal() {
    setClientName('');
    setSelectedScopes([]);
    setCreateError(null);
    setCreateModalOpen(true);
  }

  function toggleScope(scope: string) {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }

  async function handleCreate() {
    setCreatePending(true);
    setCreateError(null);
    try {
      const created = await apiPost<CreateApiClientResponse>('/api/v1/admin/api-clients', {
        client_name: clientName,
        scopes: selectedScopes,
      });
      // Transition the SAME modal to the secret-reveal state — the secret
      // is held only in this local variable, never merged into the
      // react-query cache for ['api-clients'].
      setRevealedSecret(created.client_secret);
      await queryClient.invalidateQueries({ queryKey: ['api-clients'] });
    } catch {
      setCreateError('Could not create API client. Try again.');
    } finally {
      setCreatePending(false);
    }
  }

  function handleCopySecret() {
    if (revealedSecret) {
      void navigator.clipboard.writeText(revealedSecret);
      setCopyConfirmed(true);
    }
  }

  function handleDoneWithSecret() {
    // Clears the secret from component state entirely — re-opening this
    // modal (or any future render) can never show it again. The backend
    // itself also never returns it on a subsequent read, so there is no
    // path, client or server, back to this value after this point.
    setRevealedSecret(null);
    setCopyConfirmed(false);
    setCreateModalOpen(false);
  }

  async function handleConfirmRevoke() {
    if (!revokeTarget) return;
    setRevokePending(true);
    try {
      await apiPost(`/api/v1/admin/api-clients/${revokeTarget.id}/revoke`, {});
      await queryClient.invalidateQueries({ queryKey: ['api-clients'] });
      setRevokeTarget(null);
    } finally {
      setRevokePending(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="API clients"
        crumbs={[{ label: 'Admin' }, { label: 'API clients' }]}
        actions={[
          <Button key="create" variant="primary" icon="plus" onClick={openCreateModal}>
            Create API client
          </Button>,
        ]}
      />

      <Card padded={false}>
        <Table
          caption="API clients"
          columns={[
            ...COLUMNS,
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (row) =>
                row.revoked ? null : (
                  <Button variant="danger" size="sm" onClick={() => setRevokeTarget(row)}>
                    Revoke
                  </Button>
                ),
            },
          ]}
          rows={data ?? []}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={isError ? { message: 'Could not load API clients.', onRetry: () => void refetch() } : undefined}
          empty={{
            title: 'No API clients yet',
            children: 'Create one to issue credentials for a partner integration.',
          }}
        />
      </Card>

      <Modal
        open={createModalOpen}
        title={revealedSecret ? 'Copy your client secret' : 'Create API client'}
        onClose={revealedSecret ? handleDoneWithSecret : () => setCreateModalOpen(false)}
        footer={
          revealedSecret ? (
            <>
              <Button variant="ghost" icon="external" onClick={handleCopySecret}>
                Copy to clipboard
              </Button>
              <Button variant="primary" onClick={handleDoneWithSecret}>
                Done
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                loading={createPending}
                disabled={!clientName || selectedScopes.length === 0}
                onClick={handleCreate}
              >
                Create client
              </Button>
            </>
          )
        }
      >
        {revealedSecret ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Alert tone="warning" title="Copy this secret now — it will never be shown again.">
              <code style={{ wordBreak: 'break-all' }}>{revealedSecret}</code>
            </Alert>
            {copyConfirmed ? <p className="caption">Copied to clipboard.</p> : null}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <TextField
              label="Client name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
            <div>
              <p className="overline" style={{ marginBottom: 'var(--space-2)' }}>
                Scopes
              </p>
              {AVAILABLE_SCOPES.map((scope) => (
                <Checkbox
                  key={scope}
                  label={scope}
                  checked={selectedScopes.includes(scope)}
                  onChange={() => toggleScope(scope)}
                />
              ))}
            </div>
            {createError ? <Alert tone="danger" title={createError} /> : null}
          </div>
        )}
      </Modal>

      <Modal
        open={revokeTarget !== null}
        title={`Revoke access for ${revokeTarget?.client_name ?? ''}?`}
        danger
        onClose={() => setRevokeTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRevokeTarget(null)}>
              Keep client active
            </Button>
            <Button variant="danger" loading={revokePending} onClick={handleConfirmRevoke}>
              Revoke access
            </Button>
          </>
        }
      >
        This client will immediately lose access to the API.
      </Modal>
    </div>
  );
}
