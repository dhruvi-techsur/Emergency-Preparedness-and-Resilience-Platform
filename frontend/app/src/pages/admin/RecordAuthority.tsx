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
  Alert,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

/**
 * F10 S10.2 — Record Authority Registry. Backend (01-08's
 * `record-authority.ts`) is upsert-only: `POST /api/v1/admin/record-authority`
 * creates a new row OR overwrites the existing row for that `record_type`
 * (`ON CONFLICT (record_type) DO UPDATE`), and there is no delete/revoke
 * endpoint — a record type's authority assignment is corrected by
 * re-submitting it with a different `authoritative_system`, not removed.
 * This mirrors `FederationGrants.tsx`'s list+create-modal pattern but has
 * no revoke action, matching the backend's actual contract.
 */

interface RecordAuthorityRow {
  record_type: string;
  authoritative_system: string;
  notes: string | null;
}

const COLUMNS: TableColumn<RecordAuthorityRow>[] = [
  { key: 'record_type', header: 'Record type' },
  { key: 'authoritative_system', header: 'Authoritative system' },
  { key: 'notes', header: 'Notes', render: (row) => row.notes ?? '—' },
];

export function RecordAuthority(): JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['record-authority'],
    queryFn: () => apiGet<RecordAuthorityRow[]>('/api/v1/admin/record-authority'),
  });

  const [modalOpen, setModalOpen] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [recordType, setRecordType] = React.useState('');
  const [authoritativeSystem, setAuthoritativeSystem] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [savePending, setSavePending] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);

  function openCreateModal() {
    setIsEditMode(false);
    setRecordType('');
    setAuthoritativeSystem('');
    setNotes('');
    setSaveError(null);
    setModalOpen(true);
  }

  function openEditModal(row: RecordAuthorityRow) {
    setIsEditMode(true);
    setRecordType(row.record_type);
    setAuthoritativeSystem(row.authoritative_system);
    setNotes(row.notes ?? '');
    setSaveError(null);
    setModalOpen(true);
  }

  async function handleSave() {
    setSavePending(true);
    setSaveError(null);
    try {
      await apiPost('/api/v1/admin/record-authority', {
        record_type: recordType,
        authoritative_system: authoritativeSystem,
        notes: notes || undefined,
      });
      await queryClient.invalidateQueries({ queryKey: ['record-authority'] });
      setModalOpen(false);
    } catch (err) {
      setSaveError(
        err instanceof ApiRequestError ? err.body.message : 'Could not save this record authority entry.',
      );
    } finally {
      setSavePending(false);
    }
  }

  return (
    <div>
      <PageHeader
        title="Record authority"
        crumbs={[{ label: 'Admin' }, { label: 'Record authority' }]}
        actions={[
          <Button key="add" variant="primary" icon="plus" onClick={openCreateModal}>
            Register record type
          </Button>,
        ]}
      />

      <Card padded={false}>
        <Table
          caption="Record authority registry"
          columns={[
            ...COLUMNS,
            {
              key: 'actions',
              header: '',
              align: 'right',
              render: (row) => (
                <Button variant="ghost" size="sm" onClick={() => openEditModal(row)}>
                  Edit
                </Button>
              ),
            },
          ]}
          rows={data ?? []}
          rowKey={(row) => row.record_type}
          loading={isLoading}
          error={isError ? { message: 'Could not load record authority registry.', onRetry: () => void refetch() } : undefined}
          empty={{
            title: 'No record types registered yet',
            children:
              'Register the system of record for a record type. Unregistered record types default to EPMP as authoritative.',
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={recordType ? `Record authority: ${recordType}` : 'Register record type'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!recordType || !authoritativeSystem.trim()}
              loading={savePending}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <TextField
            label="Record type"
            hint={isEditMode ? 'Record type is locked once registered — it cannot be changed from here.' : undefined}
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            required
            disabled={isEditMode}
          />
          <TextField
            label="Authoritative system"
            hint='The system of record for this type (e.g. "EPMP", "ExternalHR", "GIS").'
            value={authoritativeSystem}
            onChange={(e) => setAuthoritativeSystem(e.target.value)}
            required
          />
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {saveError ? <Alert tone="danger" title={saveError} /> : null}
        </div>
      </Modal>
    </div>
  );
}
