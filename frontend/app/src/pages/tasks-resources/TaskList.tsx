import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  TextField,
  Select,
  Combobox,
  Button,
  Avatar,
  type TableColumn,
  type SelectOption,
  type ComboboxOption,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet, apiPatch } from '../../lib/api-client';

type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';

/** Matches backend's shapeTaskRow shape (incident-ops/tasks.ts). */
interface TaskListItem {
  id: string;
  title: string;
  status: TaskStatus;
  owner: { id: string; name: string };
  due_at: string;
  incident_id?: string;
  plan_section_id?: string;
}

interface TasksListResponse {
  items: TaskListItem[];
  total: number;
  page: number;
  page_size: number;
}

/** Sourced from `GET /api/v1/incidents/personnel` (incidents:view gated,
 * added by 02-06 for CommandRoleModal), NOT `GET /api/v1/admin/users` —
 * the roles that actually hold `tasks` permissions (incident_commander,
 * eoc_director, planning_logistics_chief, field_responder) deliberately
 * hold no `admin:view` permission (02-01's seed decision), same reasoning
 * CommandRoleModal.tsx documents in detail for the identical problem. */
interface PersonnelSummary {
  id: string;
  name: string;
}

/** Exact FRD tone mapping for task status, rendered via Table.StatusCell
 * (which delegates to Badge), never a raw colored span: Open=info,
 * In progress=brand, Awaiting approval=warning, Done=success,
 * Overdue=danger. */
const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  Open: 'info',
  'In progress': 'brand',
  'Awaiting approval': 'warning',
  Done: 'success',
  Overdue: 'danger',
};

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'In progress', label: 'In progress' },
  { value: 'Awaiting approval', label: 'Awaiting approval' },
  { value: 'Done', label: 'Done' },
  { value: 'Overdue', label: 'Overdue' },
];

const DUE_WINDOW_OPTIONS: SelectOption[] = [
  { value: '', label: 'All due dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due today' },
  { value: 'week', label: 'Due this week' },
];

function formatDue(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export interface TaskListProps {
  /** When provided, routes/links use the incident-scoped path and the
   * Incident column is omitted — per the UX mockup's explicit "When
   * embedded... the Incident column is omitted" rule for 03-07's
   * Incident Workspace Tasks tab embedding. */
  incidentId?: string;
}

/**
 * F4 S4.1 — Task List. Routed `/tasks` standalone; also exported accepting
 * an optional `incidentId` prop for 03-07's embedded Incident Workspace
 * Tasks tab use.
 *
 * Polling (not a live event-bus subscriber) is the Phase 3 mechanism that
 * makes 03-02's time-based Overdue sweep VISIBLE to a user who never takes
 * any action — the same documented simplification 02-07's Operating
 * Picture page established for its own ~30s refetchInterval. 03-04's
 * backend publishes task-adjacent NATS events conceptually via its
 * Timeline writes, but no frontend event-bus subscriber exists yet in this
 * phase, so polling is the honest, working mechanism for success
 * criterion 3's "automatically flips... without any manual status update."
 */
export function TaskList({ incidentId }: TaskListProps = {}): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [ownerFilter, setOwnerFilter] = React.useState('');
  const [dueWindowFilter, setDueWindowFilter] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [reassignTargetId, setReassignTargetId] = React.useState<string | null>(null);
  const [reassignOwnerId, setReassignOwnerId] = React.useState('');
  const [bulkBusy, setBulkBusy] = React.useState(false);

  const hasActiveFilter =
    search.trim() !== '' || statusFilter !== '' || ownerFilter !== '' || dueWindowFilter !== '';

  const queryParams = new URLSearchParams();
  if (statusFilter) queryParams.set('status', statusFilter);
  if (ownerFilter) queryParams.set('owner', ownerFilter);
  if (dueWindowFilter) queryParams.set('due_window', dueWindowFilter);
  if (incidentId) queryParams.set('incident', incidentId);
  const queryString = queryParams.toString();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['tasks', statusFilter, ownerFilter, dueWindowFilter, incidentId],
    queryFn: () => apiGet<TasksListResponse>(`/api/v1/tasks${queryString ? `?${queryString}` : ''}`),
    // ~30s poll — the mechanism making 03-02's Overdue sweep observable
    // without any user action (see file-header doc comment).
    refetchInterval: 30_000,
  });

  const ownersQuery = useQuery({
    queryKey: ['incidents-personnel-for-task-filter'],
    queryFn: () => apiGet<{ items: PersonnelSummary[] }>('/api/v1/incidents/personnel'),
  });

  const ownerOptions: SelectOption[] = [
    { value: '', label: 'All owners' },
    ...(ownersQuery.data?.items ?? []).map((u) => ({ value: u.id, label: u.name })),
  ];

  const ownerComboboxOptions: ComboboxOption[] = (ownersQuery.data?.items ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const allItems = data?.items ?? [];

  // Client-side-only name filter against the fetched page — same
  // documented limitation IncidentList.tsx/PlanRepository.tsx carry: the
  // backend's query params don't include a text-search param.
  const filteredItems = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allItems;
    return allItems.filter((t) => t.title.toLowerCase().includes(q));
  }, [allItems, search]);

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setOwnerFilter('');
    setDueWindowFilter('');
  };

  const taskHref = (id: string) => (incidentId ? `/incidents/${incidentId}/tasks/${id}` : `/tasks/${id}`);
  const newTaskHref = incidentId ? `/incidents/${incidentId}/tasks/new` : '/tasks/new';

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleBulkMarkDone = async () => {
    // TechArch's API has no literal bulk-status endpoint — one PATCH per
    // selected row, per this plan's own documented Phase 3 scope note.
    setBulkBusy(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          apiPatch(`/api/v1/tasks/${id}/status`, { new_status: 'Done' }).catch(() => {
            // Some selected rows may not be in a state Done is valid from
            // (409) -- a per-row failure doesn't block the others; the
            // list refetch below shows the real resulting state for every
            // row either way.
          }),
        ),
      );
      clearSelection();
      await refetch();
    } finally {
      setBulkBusy(false);
    }
  };

  const handleBulkReassign = async () => {
    if (!reassignOwnerId || !reassignTargetId) return;
    setBulkBusy(true);
    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          apiPatch(`/api/v1/tasks/${id}/owner`, { owner_id: reassignOwnerId }).catch(() => {}),
        ),
      );
      clearSelection();
      setReassignTargetId(null);
      setReassignOwnerId('');
      void queryClient.invalidateQueries({ queryKey: ['tasks'] });
      await refetch();
    } finally {
      setBulkBusy(false);
    }
  };

  const columns: TableColumn<TaskListItem>[] = [
    {
      key: 'title',
      header: 'Task',
      render: (row) => (
        <a
          href={taskHref(row.id)}
          className="ep-task-list__name-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(taskHref(row.id));
          }}
        >
          {row.title}
        </a>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Table.StatusCell tone={STATUS_TONE[row.status]}>{row.status}</Table.StatusCell>
      ),
    },
    {
      key: 'owner',
      header: 'Owner',
      render: (row) => (
        <span className="ep-task-list__owner">
          <Avatar name={row.owner.name} />
          <span>{row.owner.name}</span>
        </span>
      ),
    },
    {
      key: 'due_at',
      header: 'Due',
      render: (row) => formatDue(row.due_at),
    },
    ...(incidentId
      ? []
      : [
          {
            key: 'incident',
            header: 'Incident',
            render: (row: TaskListItem) =>
              row.incident_id ? (
                <a
                  href={`/incidents/${row.incident_id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/incidents/${row.incident_id}`);
                  }}
                >
                  View incident
                </a>
              ) : (
                '—'
              ),
          } as TableColumn<TaskListItem>,
        ]),
    {
      key: 'plan_section',
      header: 'Linked plan section',
      render: (row) => (row.plan_section_id ? 'Linked' : '—'),
    },
  ];

  const isOrgWideEmpty = !hasActiveFilter && (data?.total ?? 0) === 0;
  const hasSelection = selectedIds.size > 0;

  return (
    <div className="ep-task-list">
      <PageHeader
        title="Tasks"
        actions={[
          <Button key="new" variant="primary" onClick={() => navigate(newTaskHref)}>
            New task
          </Button>,
        ]}
      />

      {hasSelection ? (
        <div className="ep-task-list__bulk-toolbar">
          <p className="caption">{selectedIds.size} selected</p>
          <Button variant="secondary" onClick={() => void handleBulkMarkDone()} loading={bulkBusy}>
            Mark done
          </Button>
          <Button
            variant="secondary"
            onClick={() => setReassignTargetId('bulk')}
            disabled={bulkBusy}
          >
            Reassign
          </Button>
          <Button variant="ghost" onClick={clearSelection} disabled={bulkBusy}>
            Cancel
          </Button>
          {reassignTargetId === 'bulk' ? (
            <div className="ep-task-list__reassign-inline">
              <Combobox
                label="Reassign to"
                options={ownerComboboxOptions}
                value={reassignOwnerId}
                onChange={(value) => setReassignOwnerId(value)}
                loading={ownersQuery.isLoading}
              />
              <Button
                variant="primary"
                onClick={() => void handleBulkReassign()}
                loading={bulkBusy}
                disabled={!reassignOwnerId}
              >
                Apply
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="ep-task-list__toolbar">
          <TextField
            label="Search"
            placeholder="Search by title"
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
            label="Owner"
            options={ownerOptions}
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          />
          <Select
            label="Due"
            options={DUE_WINDOW_OPTIONS}
            value={dueWindowFilter}
            onChange={(e) => setDueWindowFilter(e.target.value)}
          />
          <p className="caption ep-task-list__count">{data?.total ?? 0} tasks</p>
        </div>
      )}

      <Card padded={false}>
        <Table
          caption="Tasks"
          columns={[
            {
              key: '__select',
              header: '',
              render: (row) => (
                <input
                  type="checkbox"
                  aria-label={`Select ${row.title}`}
                  checked={selectedIds.has(row.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelected(row.id)}
                />
              ),
            },
            ...columns,
          ]}
          rows={filteredItems}
          rowKey={(row) => row.id}
          onRowClick={(row) => navigate(taskHref(row.id))}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load tasks.', onRetry: () => void refetch() }
              : undefined
          }
          empty={
            isOrgWideEmpty
              ? {
                  title: 'No tasks yet',
                  action: (
                    <Button variant="primary" onClick={() => navigate(newTaskHref)}>
                      New task
                    </Button>
                  ),
                }
              : {
                  title: 'No tasks match',
                  children: 'Clear filters to see all tasks.',
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
