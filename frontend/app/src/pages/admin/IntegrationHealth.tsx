import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card, Table, type TableColumn } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

/**
 * F8 S8.6 — Integration Health. Phase 1 genuinely had zero rows here (no
 * F11-F17 integration adapter existed yet). Phase 2's GIS adapter (F11)
 * and Phase 7's hazard-feed/CAD-911 adapters (F12/F15, Plans 07-01/07-02)
 * now write real rows into this same shared table — this component is
 * generic over whatever rows `GET /api/v1/admin/integration-health`
 * returns (01-09's admin-integration-health.ts, a correct passthrough
 * read), so no code change was needed beyond this doc comment and the
 * EmptyState copy below to stop implying no adapter is configured yet.
 * The EmptyState itself only ever renders pre-any-adapter or on a
 * fresh/empty database — not the expected steady state anymore.
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
              'Integration health populates as external system adapters (GIS, hazard feeds, CAD/911, HR/IAM, EOC COTS, etc.) sync.',
          }}
        />
      </Card>
    </div>
  );
}
