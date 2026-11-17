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

type PlanType = 'EOP' | 'SOP' | 'Annex';
type PlanStatus = 'Draft' | 'Review' | 'Approved';

/** Matches backend's shapePlanListRow shape (plans/plans.ts). */
interface PlanListItem {
  id: string;
  name: string;
  type: PlanType;
  status: PlanStatus;
  jurisdiction_id: string;
  version: number;
  owner: { id: string; name: string };
}

interface PlansListResponse {
  items: PlanListItem[];
  total: number;
  page: number;
  page_size: number;
}

/** Exact FRD tone mapping for plan status — rendered via Table.StatusCell
 * (which delegates to Badge), never a raw colored span: Draft→neutral,
 * Review→warning, Approved→success. */
const STATUS_TONE: Record<PlanStatus, BadgeTone> = {
  Draft: 'neutral',
  Review: 'warning',
  Approved: 'success',
};

function statusToTone(status: PlanStatus): BadgeTone {
  return STATUS_TONE[status];
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All types' },
  { value: 'EOP', label: 'EOP' },
  { value: 'SOP', label: 'SOP' },
  { value: 'Annex', label: 'Annex' },
];

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Review', label: 'Review' },
  { value: 'Approved', label: 'Approved' },
];

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

/**
 * F3 S3.1 — Plan Repository (List). Routed `/plans`.
 *
 * Phase 3 scope note (per REQUIREMENTS.md's explicit v2 deferral of F17
 * document import/sync): the "Import plan" action is rendered — not
 * omitted — but disabled with an explanatory tooltip, since the UX
 * mockup's S3.1 spec shows it as a standing affordance on this screen.
 * This is the correct way to represent a deferred-but-specified feature:
 * visibly present, explained, inert — never silently dropped and never
 * wired to a handler that would error.
 */
export function PlanRepository(): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [jurisdictionFilter, setJurisdictionFilter] = React.useState('');

  const hasActiveFilter =
    search.trim() !== '' || typeFilter !== '' || statusFilter !== '' || jurisdictionFilter !== '';

  const queryParams = new URLSearchParams();
  if (typeFilter) queryParams.set('type', typeFilter);
  if (statusFilter) queryParams.set('status', statusFilter);
  if (jurisdictionFilter) queryParams.set('jurisdiction', jurisdictionFilter);
  const queryString = queryParams.toString();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['plans', typeFilter, statusFilter, jurisdictionFilter],
    queryFn: () => apiGet<PlansListResponse>(`/api/v1/plans${queryString ? `?${queryString}` : ''}`),
  });

  // Jurisdiction options come from the dedicated endpoint 02-05 added
  // (incidents:view gated) — plans has no equivalent of its own, and this
  // list is otherwise identical to what CreateIncident.tsx already uses,
  // so there's no reason to duplicate the "derive from loaded rows"
  // fallback pattern when a real list endpoint already exists.
  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
  });

  const jurisdictionOptions: SelectOption[] = [
    { value: '', label: 'All jurisdictions' },
    ...(jurisdictionsQuery.data?.items ?? []).map((j) => ({ value: j.id, label: j.name })),
  ];

  const allItems = data?.items ?? [];

  // Client-side-only name filter against the fetched page — same documented
  // limitation as IncidentList.tsx: 03-03's query params don't include a
  // text-search param, so this filters the current page only.
  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((p) => p.name.toLowerCase().includes(q));
  }, [allItems, search]);

  const clearFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStatusFilter('');
    setJurisdictionFilter('');
  };

  const jurisdictionNameById = new Map(
    (jurisdictionsQuery.data?.items ?? []).map((j) => [j.id, j.name]),
  );

  const columns: TableColumn<PlanListItem>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (row) => (
        <a
          href={`/plans/${row.id}`}
          className="ep-plan-repository__name-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/plans/${row.id}`);
          }}
        >
          {row.name}
        </a>
      ),
    },
    { key: 'type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Table.StatusCell tone={statusToTone(row.status)}>{row.status}</Table.StatusCell>
      ),
    },
    { key: 'version', header: 'Version', render: (row) => `v${row.version}` },
    {
      key: 'jurisdiction',
      header: 'Jurisdiction',
      render: (row) => jurisdictionNameById.get(row.jurisdiction_id) ?? '—',
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (row) => (
        <span className="ep-plan-repository__owner">
          <Avatar name={row.owner.name} />
          <span>{row.owner.name}</span>
        </span>
      ),
    },
  ];

  const isOrgWideEmpty = !hasActiveFilter && (data?.total ?? 0) === 0;

  return (
    <div className="ep-plan-repository">
      <PageHeader
        title="Plans & playbooks"
        actions={[
          <Button
            key="import"
            variant="secondary"
            disabled
            title="Document import (F17) ships in v2"
          >
            Import plan
          </Button>,
          <Button key="create" variant="primary" onClick={() => navigate('/plans/new')}>
            Create plan
          </Button>,
        ]}
      />

      <div className="ep-plan-repository__toolbar">
        <TextField
          label="Search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          label="Jurisdiction"
          options={jurisdictionOptions}
          value={jurisdictionFilter}
          onChange={(e) => setJurisdictionFilter(e.target.value)}
        />
        <p className="caption ep-plan-repository__count">{data?.total ?? 0} plans</p>
      </div>

      <Card padded={false}>
        <Table
          caption="Plans & playbooks"
          columns={columns}
          rows={filteredItems}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(`/plans/${row.id}`)}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load plans.', onRetry: () => void refetch() }
              : undefined
          }
          empty={
            isOrgWideEmpty
              ? {
                  title: 'No plans yet',
                  action: (
                    <Button variant="primary" onClick={() => navigate('/plans/new')}>
                      Create plan
                    </Button>
                  ),
                }
              : {
                  title: 'No plans match',
                  children: 'Clear filters to see all plans.',
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
