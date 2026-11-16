import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  DatePicker,
  Combobox,
  Select,
  Button,
  Modal,
  type TableColumn,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

interface AuditLogEntry {
  id: string;
  actor: { id: string; name: string };
  action: string;
  record_type?: string;
  record_id?: string;
  occurred_at: string;
  detail?: Record<string, unknown>;
}

interface AuditLogResponse {
  items: AuditLogEntry[];
  total: number;
  page: number;
  page_size: number;
}

interface AdminUserSummary {
  id: string;
  name: string;
}

/**
 * The exact action strings this phase's backend plans actually call
 * AuditService.record() with — reconciled against the real literals in
 * 01-03/01-07/01-08/01-09's source (grep -rn "AuditService.record(" across
 * backend/src), not invented. `user_suspend`/`user_reactivate` are distinct
 * from `user_edit` per admin-users.ts's own action-naming (status changes
 * get their own specific action name; everything else is `user_edit`).
 */
const ACTION_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All actions' },
  { value: 'login', label: 'Login' },
  { value: 'user_create', label: 'User created' },
  { value: 'user_edit', label: 'User edited' },
  { value: 'user_suspend', label: 'User suspended' },
  { value: 'user_reactivate', label: 'User reactivated' },
  { value: 'role_permission_edit', label: 'Role permission edit' },
  { value: 'record_view', label: 'Sensitive record view' },
  { value: 'sso_config_change', label: 'SSO config change' },
  { value: 'api_client_create', label: 'API client created' },
  { value: 'api_client_revoke', label: 'API client revoked' },
  { value: 'federation_grant_create', label: 'Federation grant created' },
  { value: 'federation_grant_revoke', label: 'Federation grant revoked' },
  { value: 'record_authority_change', label: 'Record authority change' },
  { value: 'webhook_subscription_create', label: 'Webhook subscription created' },
];

const PAGE_SIZE = 25;

function DetailModal({
  entry,
  onClose,
}: {
  entry: AuditLogEntry | null;
  onClose: () => void;
}) {
  return (
    <Modal open={Boolean(entry)} title="Audit log detail" onClose={onClose}>
      {entry ? (
        <pre className="code ep-audit-log__detail-json">
          {JSON.stringify(entry.detail ?? {}, null, 2)}
        </pre>
      ) : null}
    </Modal>
  );
}

/**
 * F8 S8.5 — read-only, filterable, paginated audit log view. No row action
 * beyond "View detail" exists anywhere on this page, and there is no bulk
 * action of any kind — structurally confirming the FRD's "read-only and
 * exportable" requirement in the UI itself (export is a documented Phase-1
 * scope gap: GET /api/v1/evidence-log/export is not built in this phase's
 * backend plans).
 */
export function AuditLogView(): JSX.Element {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [actorId, setActorId] = React.useState('');
  const [actionType, setActionType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [viewingEntry, setViewingEntry] = React.useState<AuditLogEntry | null>(null);

  // Phase 1 note: no dedicated user-search endpoint exists for the actor
  // filter's Combobox. GET /api/v1/admin/users is reused as the options
  // source, filtered client-side — a documented Phase-1 simplification
  // (the plan's own Task 2 text specifies exactly this fallback).
  const usersQuery = useQuery({
    queryKey: ['admin-users', 'for-audit-actor-filter'],
    queryFn: () => apiGet<{ items: AdminUserSummary[] }>('/api/v1/admin/users?page_size=1000'),
  });
  const actorOptions: ComboboxOption[] = (usersQuery.data?.items ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const queryParams = React.useMemo(() => {
    const params = new URLSearchParams();
    if (startDate || endDate) {
      params.set('date_range', `${startDate},${endDate}`);
    }
    if (actorId) params.set('actor_id', actorId);
    if (actionType) params.set('action_type', actionType);
    params.set('page', String(page));
    params.set('page_size', String(PAGE_SIZE));
    return params.toString();
  }, [startDate, endDate, actorId, actionType, page]);

  const auditQuery = useQuery({
    queryKey: ['admin-audit-log', queryParams],
    queryFn: () => apiGet<AuditLogResponse>(`/api/v1/admin/audit-log?${queryParams}`),
  });

  const items = auditQuery.data?.items ?? [];
  const total = auditQuery.data?.total ?? 0;
  const hasNextPage = page * PAGE_SIZE < total;
  const hasPrevPage = page > 1;

  const columns: TableColumn<AuditLogEntry>[] = [
    {
      key: 'occurred_at',
      header: 'Occurred at',
      render: (row) => (
        <span className="data">{new Date(row.occurred_at).toLocaleString()}</span>
      ),
    },
    { key: 'actor', header: 'Actor', render: (row) => row.actor.name },
    { key: 'action', header: 'Action' },
    {
      key: 'record',
      header: 'Record type / id',
      render: (row) =>
        row.record_type ? (
          <span className="data">
            {row.record_type}
            {row.record_id ? ` / ${row.record_id}` : ''}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'detail',
      header: 'Detail',
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setViewingEntry(row)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="ep-audit-log-view">
      <PageHeader title="Audit log" crumbs={[{ label: 'Admin' }, { label: 'Audit log' }]} />

      <div className="ep-audit-log-view__toolbar">
        <DatePicker
          label="Start date"
          value={startDate}
          onChange={(v) => {
            setStartDate(v);
            setPage(1);
          }}
        />
        <DatePicker
          label="End date"
          value={endDate}
          onChange={(v) => {
            setEndDate(v);
            setPage(1);
          }}
        />
        <Combobox
          label="Actor"
          placeholder="Search users"
          options={actorOptions}
          clearable
          value={actorId}
          onChange={(value) => {
            setActorId(value);
            setPage(1);
          }}
        />
        <Select
          label="Action"
          options={ACTION_TYPE_OPTIONS}
          value={actionType}
          onChange={(e) => {
            setActionType(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <Card padded={false}>
        <Table
          caption="Audit log"
          columns={columns}
          rows={items}
          rowKey={(row) => row.id}
          loading={auditQuery.isLoading}
          error={
            auditQuery.isError
              ? { message: 'Could not load the audit log.', onRetry: () => void auditQuery.refetch() }
              : undefined
          }
          empty={{ title: 'No audit log entries match these filters' }}
        />
      </Card>

      <div className="ep-audit-log-view__pagination">
        <Button variant="secondary" disabled={!hasPrevPage} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="caption">
          Page {page} of {Math.max(1, Math.ceil(total / PAGE_SIZE))}
        </span>
        <Button variant="secondary" disabled={!hasNextPage} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>

      <DetailModal entry={viewingEntry} onClose={() => setViewingEntry(null)} />
    </div>
  );
}
