import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  TextField,
  Select,
  Button,
  Avatar,
  type TableColumn,
  type SelectOption,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

/** Matches backend's shapeIncidentListRow shape (incident-ops/incidents.ts). */
interface IncidentListItem {
  id: string;
  name: string;
  type: string;
  severity: 'Critical' | 'Elevated' | 'Watch' | 'Normal';
  jurisdiction: { id: string; name: string };
  activation_level: 'Monitoring' | 'Partial' | 'Full';
  status: 'Open' | 'Closed';
  opened_at: string;
  commander: { id: string; name: string } | null;
}

interface IncidentsListResponse {
  items: IncidentListItem[];
  total: number;
  page: number;
  page_size: number;
}

/** Exact FRD tone mapping for incident severity — rendered via
 * Table.StatusCell (which delegates to Badge), never a raw colored span. */
const SEVERITY_TONE: Record<IncidentListItem['severity'], BadgeTone> = {
  Critical: 'danger',
  Elevated: 'warning',
  Watch: 'info',
  Normal: 'success',
};

const SEVERITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'All severities' },
  { value: 'Critical', label: 'Critical' },
  { value: 'Elevated', label: 'Elevated' },
  { value: 'Watch', label: 'Watch' },
  { value: 'Normal', label: 'Normal' },
];

const ACTIVATION_OPTIONS: SelectOption[] = [
  { value: '', label: 'All activation levels' },
  { value: 'Monitoring', label: 'Monitoring' },
  { value: 'Partial', label: 'Partial' },
  { value: 'Full', label: 'Full' },
];

function formatOpenedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * F1 S1.1 — Incident List. Table's built-in loading/empty/error props are
 * wired directly from this query's own state, per Table's "every consumer
 * gets this for free" contract (01-06) — this screen does not reimplement
 * its own skeleton/empty/error rendering.
 *
 * Phase 2 scope note: the Jurisdiction filter's options are derived from
 * the jurisdictions already present across the currently-fetched page
 * (same "derive from what's already loaded" pattern 01-11's UserDetail.tsx
 * established for jurisdiction checkboxes), since no dedicated
 * GET /api/v1/jurisdictions list endpoint is guaranteed to exist until
 * CreateIncident.tsx's Task 2 potentially adds one for the create form's
 * Combobox — this list screen has no hard dependency on that endpoint.
 */
export function IncidentList(): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [severityFilter, setSeverityFilter] = React.useState('');
  const [activationFilter, setActivationFilter] = React.useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');

  const hasActiveFilter =
    search.trim() !== '' ||
    severityFilter !== '' ||
    activationFilter !== '' ||
    jurisdictionFilter !== '' ||
    statusFilter !== '';

  const queryParams = new URLSearchParams();
  if (severityFilter) queryParams.set('severity', severityFilter);
  if (activationFilter) queryParams.set('activation_level', activationFilter);
  if (jurisdictionFilter) queryParams.set('jurisdiction', jurisdictionFilter);
  if (statusFilter) queryParams.set('status', statusFilter);
  const queryString = queryParams.toString();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['incidents', severityFilter, activationFilter, jurisdictionFilter, statusFilter],
    queryFn: () => apiGet<IncidentsListResponse>(`/api/v1/incidents${queryString ? `?${queryString}` : ''}`),
  });

  const allItems = data?.items ?? [];

  // Client-side-only name filter against the fetched page — 02-01's query
  // params don't include a text-search param, so this is documented as a
  // filter of the current page only; full server-side search is deferred.
  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((i) => i.name.toLowerCase().includes(q));
  }, [allItems, search]);

  const jurisdictionOptions: SelectOption[] = React.useMemo(() => {
    const seen = new Map<string, string>();
    for (const item of allItems) {
      seen.set(item.jurisdiction.id, item.jurisdiction.name);
    }
    return [
      { value: '', label: 'All jurisdictions' },
      ...Array.from(seen.entries()).map(([value, label]) => ({ value, label })),
    ];
  }, [allItems]);

  const clearFilters = () => {
    setSearch('');
    setSeverityFilter('');
    setActivationFilter('');
    setJurisdictionFilter('');
    setStatusFilter('');
  };

  const columns: TableColumn<IncidentListItem>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <a
          href={`/incidents/${row.id}`}
          className="ep-incident-list__name-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/incidents/${row.id}`);
          }}
        >
          {row.name}
        </a>
      ),
    },
    { key: 'type', header: 'Type' },
    {
      key: 'severity',
      header: 'Severity',
      render: (row) => (
        <Table.StatusCell tone={SEVERITY_TONE[row.severity]}>{row.severity}</Table.StatusCell>
      ),
    },
    {
      key: 'jurisdiction',
      header: 'Jurisdiction',
      render: (row) => row.jurisdiction.name,
    },
    { key: 'activation_level', header: 'Activation' },
    {
      key: 'opened_at',
      header: 'Opened',
      render: (row) => formatOpenedAt(row.opened_at),
    },
    {
      key: 'commander',
      header: 'Commander',
      render: (row) =>
        row.commander ? (
          <span className="ep-incident-list__commander">
            <Avatar name={row.commander.name} />
            <span>{row.commander.name}</span>
          </span>
        ) : (
          <span className="caption">Unassigned</span>
        ),
    },
  ];

  const isOrgWideEmpty = !hasActiveFilter && (data?.total ?? 0) === 0;

  return (
    <div className="ep-incident-list">
      <PageHeader
        title="Incidents"
        actions={[
          <Button key="create" variant="primary" onClick={() => navigate('/incidents/new')}>
            Create incident
          </Button>,
        ]}
      />

      <div className="ep-incident-list__toolbar">
        <TextField
          label="Search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Severity"
          options={SEVERITY_OPTIONS}
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        />
        <Select
          label="Activation"
          options={ACTIVATION_OPTIONS}
          value={activationFilter}
          onChange={(e) => setActivationFilter(e.target.value)}
        />
        <Select
          label="Jurisdiction"
          options={jurisdictionOptions}
          value={jurisdictionFilter}
          onChange={(e) => setJurisdictionFilter(e.target.value)}
        />
        <p className="caption ep-incident-list__count">{data?.total ?? 0} incidents</p>
      </div>

      <Card padded={false}>
        <Table
          caption="Incidents"
          columns={columns}
          rows={filteredItems}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/incidents/${row.id}`)}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load incidents.', onRetry: () => void refetch() }
              : undefined
          }
          empty={
            isOrgWideEmpty
              ? {
                  title: 'No incidents yet',
                  action: (
                    <Button variant="primary" onClick={() => navigate('/incidents/new')}>
                      Create incident
                    </Button>
                  ),
                }
              : {
                  title: 'No incidents match',
                  children: 'Clear filters to see all incidents.',
                  action: (
                    <Button variant="secondary" onClick={clearFilters}>
                      Clear filters
                    </Button>
                  ),
                }
          }
        />
      </Card>
    </div>
  );
}
