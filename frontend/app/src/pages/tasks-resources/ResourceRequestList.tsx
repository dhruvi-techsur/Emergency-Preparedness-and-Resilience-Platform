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

type ResourceRequestStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Fulfilled' | 'Declined';
type ResourceType = 'Personnel' | 'Equipment' | 'Supplies';

/** Matches backend's shapeResourceRequestRow shape
 * (incident-ops/resource-requests.ts). */
interface ResourceRequestListItem {
  id: string;
  resource_type: ResourceType;
  description: string;
  quantity: number;
  status: ResourceRequestStatus;
  incident_id: string;
  requested_by: { id: string; name: string };
  needed_by: string;
}

interface ResourceRequestsListResponse {
  items: ResourceRequestListItem[];
  total: number;
  page: number;
  page_size: number;
}

/** Exact FRD tone mapping for resource-request status, rendered via
 * Table.StatusCell (which delegates to Badge), never a raw colored span:
 * Draft=neutral, Awaiting approval=warning, Approved=info,
 * Fulfilled=success, Declined=danger. */
const STATUS_TONE: Record<ResourceRequestStatus, BadgeTone> = {
  Draft: 'neutral',
  'Awaiting approval': 'warning',
  Approved: 'info',
  Fulfilled: 'success',
  Declined: 'danger',
};

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Draft', label: 'Draft' },
  { value: 'Awaiting approval', label: 'Awaiting approval' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Fulfilled', label: 'Fulfilled' },
  { value: 'Declined', label: 'Declined' },
];

const TYPE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All types' },
  { value: 'Personnel', label: 'Personnel' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Supplies', label: 'Supplies' },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface ResourceRequestListProps {
  /** When provided, routes/links use the incident-scoped path and the
   * Incident column is omitted, per the UX mockup's standalone/embedded
   * screen framing — 03-07's Incident Workspace Resources tab embeds this
   * same component. */
  incidentId?: string;
}

/**
 * F4 S4.4 — Resource Request List. Routed `/resource-requests` standalone;
 * also exported accepting an optional `incidentId` prop for 03-07's
 * embedded use.
 *
 * Polling (not a live event-bus subscriber) is the SPECIFIC mechanism
 * satisfying success criterion 4's "status visible... without a page
 * reload" — 03-04's backend publishes `resource_request.status_changed`
 * to NATS, but this phase builds no frontend event-bus/SSE subscriber, so
 * polling is the honest, working mechanism, documented exactly as
 * 02-07's Operating Picture page documented its own identical
 * simplification.
 */
export function ResourceRequestList({ incidentId }: ResourceRequestListProps = {}): JSX.Element {
  const navigate = useNavigate();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('');

  const hasActiveFilter = search.trim() !== '' || statusFilter !== '' || typeFilter !== '';

  const queryParams = new URLSearchParams();
  if (statusFilter) queryParams.set('status', statusFilter);
  if (typeFilter) queryParams.set('type', typeFilter);
  if (incidentId) queryParams.set('incident', incidentId);
  const queryString = queryParams.toString();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['resource-requests', statusFilter, typeFilter, incidentId],
    queryFn: () =>
      apiGet<ResourceRequestsListResponse>(
        `/api/v1/resource-requests${queryString ? `?${queryString}` : ''}`,
      ),
    // ~30s poll — the mechanism satisfying success criterion 4's
    // "status visible... without a page reload" (see file-header doc
    // comment).
    refetchInterval: 30_000,
  });

  const allItems = data?.items ?? [];

  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((r) => r.description.toLowerCase().includes(q));
  }, [allItems, search]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
  };

  const requestHref = (id: string) =>
    incidentId ? `/incidents/${incidentId}/resource-requests/${id}` : `/resource-requests/${id}`;
  const newRequestHref = incidentId
    ? `/incidents/${incidentId}/resource-requests/new`
    : '/resource-requests/new';

  const columns: TableColumn<ResourceRequestListItem>[] = [
    {
      key: 'description',
      header: 'Request',
      render: (row) => (
        <a
          href={requestHref(row.id)}
          className="ep-resource-request-list__name-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(requestHref(row.id));
          }}
        >
          {row.quantity} {row.resource_type} — {row.description.slice(0, 40)}
        </a>
      ),
    },
    { key: 'resource_type', header: 'Type' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Table.StatusCell tone={STATUS_TONE[row.status]}>{row.status}</Table.StatusCell>
      ),
    },
    { key: 'quantity', header: 'Quantity', align: 'right' },
    {
      key: 'requested_by',
      header: 'Requested by',
      render: (row) => (
        <span className="ep-resource-request-list__requester">
          <Avatar name={row.requested_by.name} />
          <span>{row.requested_by.name}</span>
        </span>
      ),
    },
    ...(incidentId
      ? []
      : [
          {
            key: 'incident',
            header: 'Incident',
            render: (row: ResourceRequestListItem) => (
              <a
                href={`/incidents/${row.incident_id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/incidents/${row.incident_id}`);
                }}
              >
                View incident
              </a>
            ),
          } as TableColumn<ResourceRequestListItem>,
        ]),
    {
      key: 'needed_by',
      header: 'Requested at',
      render: (row) => formatDateTime(row.needed_by),
    },
  ];

  const isOrgWideEmpty = !hasActiveFilter && (data?.total ?? 0) === 0;

  return (
    <div className="ep-resource-request-list">
      <PageHeader
        title="Resource requests"
        actions={[
          <Button key="new" variant="primary" onClick={() => navigate(newRequestHref)}>
            New resource request
          </Button>,
        ]}
      />

      <div className="ep-resource-request-list__toolbar">
        <TextField
          label="Search"
          placeholder="Search by description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        />
        <p className="caption ep-resource-request-list__count">{data?.total ?? 0} requests</p>
      </div>

      <Card padded={false}>
        <Table
          caption="Resource requests"
          columns={columns}
          rows={filteredItems}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(requestHref(row.id))}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load resource requests.', onRetry: () => void refetch() }
              : undefined
          }
          empty={
            isOrgWideEmpty
              ? {
                  title: 'No resource requests yet',
                  action: (
                    <Button variant="primary" onClick={() => navigate(newRequestHref)}>
                      New resource request
                    </Button>
                  ),
                }
              : {
                  title: 'No requests match',
                  children: 'Clear filters to see all resource requests.',
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
