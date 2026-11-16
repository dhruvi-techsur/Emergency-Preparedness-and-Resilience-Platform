import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card, Table, type TableColumn } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

/**
 * F8 S8.6 — Integration Health. Phase 1 genuinely has zero rows here: no
 * F11-F17 integration adapter exists yet to write to integration_health
 * (01-09's admin-integration-health.ts is a correct passthrough read of an
 * always-empty table in this phase). This is the CORRECT, expected state —
 * the screen renders it as a clean first-use EmptyState, not an error.
 */

interface IntegrationHealthRow {
  id: string;
  system_name: string;
  last_sync_at: string | null;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  record_authority: string;
  sync_status: 'online' | 'syncing' | 'offline' | 'conflict';
  error_count: number;
}

interface IntegrationHealthResponse {
  items: IntegrationHealthRow[];
}

const SYNC_STATUS_TONE: Record<IntegrationHealthRow['sync_status'], 'success' | 'info' | 'danger' | 'warning'> = {
  online: 'success',
  syncing: 'info',
  offline: 'danger',
  conflict: 'warning',
};

const COLUMNS: TableColumn<IntegrationHealthRow>[] = [
  { key: 'system_name', header: 'System' },
  {
    key: 'last_sync_at',
    header: 'Last sync',
    render: (row) => (row.last_sync_at ? new Date(row.last_sync_at).toLocaleString() : 'Never'),
  },
  { key: 'direction', header: 'Direction' },
  { key: 'record_authority', header: 'Record authority' },
  {
    key: 'sync_status',
    header: 'Status',
    render: (row) => (
      <Table.StatusCell tone={SYNC_STATUS_TONE[row.sync_status]}>{row.sync_status}</Table.StatusCell>
    ),
  },
];

export function IntegrationHealth(): JSX.Element {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['integration-health'],
    queryFn: () => apiGet<IntegrationHealthResponse>('/api/v1/admin/integration-health'),
  });

  const rows = data?.items ?? [];

  return (
    <div>
      <PageHeader title="Integration health" crumbs={[{ label: 'Admin' }, { label: 'Integration health' }]} />

      <Card padded={false}>
        <Table
          caption="Integration health"
          columns={COLUMNS}
          rows={rows}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={isError ? { message: 'Could not load integration health.', onRetry: () => void refetch() } : undefined}
          empty={{
            title: 'No integrations connected yet',
            children:
              'Integration health populates once an external system adapter (GIS, HR/IAM, EOC COTS, etc.) is configured.',
          }}
        />
      </Card>
    </div>
  );
}
