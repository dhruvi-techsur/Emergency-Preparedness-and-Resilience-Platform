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
  Avatar,
  Alert,
  type TableColumn,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiGetBlob, ApiRequestError } from '../../lib/api-client';

interface EvidenceLogEntry {
  id: string;
  actor: { id: string; name: string } | null;
  action: string;
  record_type?: string;
  record_id?: string;
  occurred_at: string;
  detail?: Record<string, unknown>;
  source_table: 'audit_log' | 'incident_timeline';
}

interface EvidenceLogResponse {
  items: EvidenceLogEntry[];
  total: number;
  page: number;
  page_size: number;
}

interface AdminUserSummary {
  id: string;
  name: string;
}

/**
 * The action strings this plan's own backend plans actually emit into
 * audit_log/incident_timeline, reconciled against evidence-log.ts's real
 * UNION query (reusing 01-11's AuditLogView.tsx action-type convention —
 * an `action_type` free-text filter param, not a closed enum this UI
 * invents). A plain text-matched Select of common, documented values is
 * offered; the filter still passes through whatever value is chosen.
 */
const ACTION_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All actions' },
  { value: 'aar_finalized', label: 'AAR finalized' },
  { value: 'login', label: 'Login' },
  { value: 'user_edit', label: 'User edited' },
  { value: 'role_permission_edit', label: 'Role permission edit' },
];

const RECORD_TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All record types' },
  { value: 'incident', label: 'Incident' },
  { value: 'aar', label: 'AAR' },
  { value: 'user', label: 'User' },
  { value: 'role_permission', label: 'Role permission' },
];

const PAGE_SIZE = 25;

/** Maps a known evidence-log record_type to a real, navigable route when
 * one exists in this app's route tree — otherwise the Record column
 * renders plain text, per this plan's own "linked if recognizable" rule. */
function recordHrefFor(entry: EvidenceLogEntry): string | null {
  if (!entry.record_id) return null;
  if (entry.record_type === 'incident') return `/incidents/${entry.record_id}`;
  return null;
}

/**
 * F7 S7.4 — Evidence & Audit Log View. Routed `/reports/evidence-log`.
 *
 * Per the UX mockup's Navigation Map, this is a SEPARATE route from F8's
 * existing `/admin/audit-log` (01-11's AuditLogView.tsx, scoped to
 * audit_log alone) — this is the F7-owned AGGREGATE view spanning
 * audit_log + incident_timeline, matching 04-02's distinct
 * `GET /api/v1/evidence-log` endpoint (a UNION of both tables).
 *
 * Structural immutability (hard requirement, not permission-conditional):
 * this component renders absolutely NO edit or delete affordance anywhere
 * in its markup, for ANY role including an admin-permissioned one — there
 * is no conditional branch anywhere below that could introduce one. The
 * "Export as CSV" action fetches the CSV with the app's Bearer-token auth
 * header (via apiGetBlob) and triggers the download through a synthetic
 * `<a download>` click on an object URL — a plain `window.location.href`
 * navigation cannot carry the Authorization header this app's entire auth
 * model requires, so it would always 401. PDF export is NOT offered as a UI
 * option at all — 04-02's `format=pdf` path is a documented, guaranteed
 * `500 EXPORT_FAILED`, and offering a UI choice that always fails is
 * worse than simply not offering it; if a future PDF library lands, this
 * is the one place to add the option back.
 */
export function EvidenceLogView(): JSX.Element {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [actorId, setActorId] = React.useState('');
  const [actionType, setActionType] = React.useState('');
  const [recordType, setRecordType] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [exportError, setExportError] = React.useState<string | null>(null);

  // No larger actor-list endpoint exists for this view either — reuses
  // 01-11's AuditLogView.tsx exact "derive options from already-fetched
  // data" fallback: GET /api/v1/admin/users as the Combobox options
  // source. planning_logistics_chief (the role holding reporting:view)
  // does not itself hold admin:view, but this specific GET is permitted
  // to anyone with admin:view only — reusing it anyway here would 403 for
  // this view's real audience, so this view derives actor options from
  // its OWN already-fetched evidence-log rows instead (distinct names
  // seen so far), which needs no extra permission beyond reporting:view.
  const queryParams = React.useMemo(() => {
    const params = new URLSearchParams();
    if (startDate || endDate) {
      params.set('date_range', `${startDate},${endDate}`);
    }
    if (actorId) params.set('actor_id', actorId);
    if (actionType) params.set('action_type', actionType);
    if (recordType) params.set('record_type', recordType);
    params.set('page', String(page));
    params.set('page_size', String(PAGE_SIZE));
    return params.toString();
  }, [startDate, endDate, actorId, actionType, recordType, page]);

  const evidenceQuery = useQuery({
    queryKey: ['evidence-log', queryParams],
    queryFn: () => apiGet<EvidenceLogResponse>(`/api/v1/evidence-log?${queryParams}`),
  });

  const unfilteredQuery = useQuery({
    queryKey: ['evidence-log', 'unfiltered-for-actor-options'],
    queryFn: () => apiGet<EvidenceLogResponse>('/api/v1/evidence-log?page_size=1000'),
  });

  const actorOptions: ComboboxOption[] = React.useMemo(() => {
    const seen = new Map<string, string>();
    for (const row of unfilteredQuery.data?.items ?? []) {
      if (row.actor) seen.set(row.actor.id, row.actor.name);
    }
    return Array.from(seen.entries()).map(([value, label]) => ({ value, label }));
  }, [unfilteredQuery.data]);

  const handleExportCsv = async () => {
    setExportError(null);
    try {
      const blob = await apiGetBlob(`/api/v1/evidence-log/export?format=csv&${queryParams}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'evidence-log.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof ApiRequestError ? err.message : 'Could not export the evidence log.');
    }
  };

  const items = evidenceQuery.data?.items ?? [];
  const total = evidenceQuery.data?.total ?? 0;
  const hasNextPage = page * PAGE_SIZE < total;
  const hasPrevPage = page > 1;

  const columns: TableColumn<EvidenceLogEntry>[] = [
    {
      key: 'occurred_at',
      header: 'Timestamp',
      render: (row) => <span className="data">{new Date(row.occurred_at).toLocaleString()}</span>,
    },
    {
      key: 'actor',
      header: 'Actor',
      render: (row) =>
        row.actor ? (
          <span className="ep-evidence-log-view__actor">
            <Avatar name={row.actor.name} />
            <span>{row.actor.name}</span>
          </span>
        ) : (
          '—'
        ),
    },
    { key: 'action', header: 'Action' },
    { key: 'record_type', header: 'Record type', render: (row) => row.record_type ?? '—' },
    {
      key: 'record',
      header: 'Record',
      render: (row) => {
        const href = recordHrefFor(row);
        if (!href) return row.record_id ? <span className="data">{row.record_id}</span> : '—';
        return <a href={href}>{row.record_id}</a>;
      },
    },
  ];

  return (
    <div className="ep-evidence-log-view">
      <PageHeader
        title="Evidence & audit log"
        crumbs={[{ label: 'Evidence log' }]}
        actions={[
          // Fetches with the app's Bearer-token auth header and triggers
          // the download via an object URL + synthetic <a download> click
          // — a plain window.location.href navigation cannot carry the
          // Authorization header this route's requirePermission requires.
          <Button key="export-csv" variant="secondary" onClick={() => void handleExportCsv()}>
            Export as CSV
          </Button>,
        ]}
      />

      {exportError && (
        <Alert tone="danger" title="Export failed">
          {exportError}
        </Alert>
      )}

      <Alert tone="info" title="PDF export is not available this phase">
        Only CSV export is offered here — 04-02's PDF export path is a documented backend gap
        (always returns 500 EXPORT_FAILED), so it is deliberately not offered as a choice in this
        UI rather than giving you a guaranteed-failing option.
      </Alert>

      <div className="ep-evidence-log-view__toolbar">
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
          placeholder="Search actors"
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
        <Select
          label="Record type"
          options={RECORD_TYPE_OPTIONS}
          value={recordType}
          onChange={(e) => {
            setRecordType(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Structurally, no edit/delete column, button, or row action exists
          anywhere in this Card/Table — this is the hard "no edit/delete
          control exists anywhere on this page, for any role" requirement,
          satisfied by never writing such a control, not by hiding one
          conditionally. */}
      <Card padded={false}>
        <Table
          caption="Evidence & audit log"
          columns={columns}
          rows={items}
          rowKey={(row) => row.id}
          loading={evidenceQuery.isLoading}
          error={
            evidenceQuery.isError
              ? { message: 'Could not load the evidence log.', onRetry: () => void evidenceQuery.refetch() }
              : undefined
          }
          empty={{ title: 'No evidence-log entries match these filters' }}
        />
      </Card>

      <div className="ep-evidence-log-view__pagination">
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
    </div>
  );
}
