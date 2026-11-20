import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Card, Table, Button, Alert, type TableColumn } from '@epmp/design-system';
import { apiGet, apiPost } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';

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
 *
 * Plan 08-03 (F13) extends this screen with S13.1's conflict-row
 * expansion: any integration-health row with at least one unresolved EOC
 * COTS conflict (GET /api/v1/integrations/eoc-cots/conflicts, Plan 08-01's
 * route, cross-plan-touched to also return `system_name`) gets an
 * expand/collapse toggle below the Table revealing a side-by-side
 * EPMP-value/external-value comparison and the two outcome-named "Keep
 * EPMP value"/"Keep [system] value" actions — F13's explicit, never-
 * automatic, never-silently-re-resolved conflict resolution.
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

interface EocCotsConflictRow {
  id: string;
  record_type: string;
  epmp_record_id: string;
  epmp_value: Record<string, unknown>;
  external_value: Record<string, unknown>;
  resolution: 'keep_epmp' | 'keep_external' | null;
  system_name: string;
}

interface EocCotsConflictsResponse {
  items: EocCotsConflictRow[];
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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['integration-health'],
    queryFn: () => apiGet<IntegrationHealthResponse>('/api/v1/admin/integration-health'),
  });

  const { data: conflictsData } = useQuery({
    queryKey: ['eoc-cots-conflicts'],
    queryFn: () => apiGet<EocCotsConflictsResponse>('/api/v1/integrations/eoc-cots/conflicts'),
  });

  const rows = data?.items ?? [];
  const conflicts = conflictsData?.items ?? [];

  const [expandedSystemName, setExpandedSystemName] = React.useState<string | null>(null);
  const [resolvingId, setResolvingId] = React.useState<string | null>(null);
  const [resolveError, setResolveError] = React.useState<string | null>(null);

  // Join client-side: for each integration-health row, count how many
  // unresolved conflicts carry its system_name.
  const conflictsBySystem = React.useMemo(() => {
    const map = new Map<string, EocCotsConflictRow[]>();
    for (const conflict of conflicts) {
      const existing = map.get(conflict.system_name) ?? [];
      existing.push(conflict);
      map.set(conflict.system_name, existing);
    }
    return map;
  }, [conflicts]);

  async function handleResolve(
    conflict: EocCotsConflictRow,
    resolution: 'keep_epmp' | 'keep_external',
  ) {
    setResolveError(null);
    setResolvingId(conflict.id);
    try {
      await apiPost(`/api/v1/integrations/eoc-cots/conflicts/${conflict.id}/resolve`, {
        resolution,
        resolved_by: user.id,
      });
      // Invalidating the query cache causes an immediate re-fetch — the
      // resolved conflict disappears from the panel with no page reload.
      await queryClient.invalidateQueries({ queryKey: ['eoc-cots-conflicts'] });
    } catch {
      setResolveError("This resolution didn't go through. Check your connection and try again.");
    } finally {
      setResolvingId(null);
    }
  }

  const expandedConflicts = expandedSystemName ? conflictsBySystem.get(expandedSystemName) ?? [] : [];

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

      {rows.map((row) => {
        const rowConflicts = conflictsBySystem.get(row.system_name) ?? [];
        if (rowConflicts.length === 0) return null;
        return (
          <div key={`toggle-${row.id}`} style={{ marginTop: 'var(--space-2)' }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setExpandedSystemName((current) => (current === row.system_name ? null : row.system_name))
              }
            >
              {rowConflicts.length} conflict{rowConflicts.length === 1 ? '' : 's'} — review
            </Button>
          </div>
        );
      })}

      {expandedSystemName ? (
        <div style={{ marginTop: 'var(--space-3)' }}>
        <Card title={`Unresolved conflicts: ${expandedSystemName}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {expandedConflicts.map((conflict) => (
              <div
                key={conflict.id}
                className="ep-eoc-conflict"
                style={{ borderTop: '1px solid var(--border-default)', paddingTop: 'var(--space-3)' }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-4)',
                  }}
                >
                  <div>
                    <h4 className="h4">EPMP value</h4>
                    <p className="label">Source: EPMP</p>
                    <pre>{JSON.stringify(conflict.epmp_value, null, 2)}</pre>
                  </div>
                  <div>
                    <h4 className="h4">{expandedSystemName} value</h4>
                    <p className="label">Source: {expandedSystemName}</p>
                    <pre>{JSON.stringify(conflict.external_value, null, 2)}</pre>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  <Button
                    variant="secondary"
                    className="ep-eoc-conflict__keep-epmp"
                    loading={resolvingId === conflict.id}
                    disabled={resolvingId !== null && resolvingId !== conflict.id}
                    onClick={() => void handleResolve(conflict, 'keep_epmp')}
                  >
                    Keep EPMP value
                  </Button>
                  <Button
                    variant="primary"
                    className="ep-eoc-conflict__keep-external"
                    loading={resolvingId === conflict.id}
                    disabled={resolvingId !== null && resolvingId !== conflict.id}
                    onClick={() => void handleResolve(conflict, 'keep_external')}
                  >
                    Keep {expandedSystemName} value
                  </Button>
                </div>
              </div>
            ))}
            {resolveError ? <Alert tone="danger" title={resolveError} /> : null}
          </div>
        </Card>
        </div>
      ) : null}
    </div>
  );
}
