import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Badge,
  Avatar,
  Button,
  Alert,
  Timeline,
  EmptyState,
  type BadgeTone,
  type TimelineItem,
} from '@epmp/design-system';
import { apiGet, apiPatch, ApiRequestError } from '../../lib/api-client';

type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';

interface TaskStatusHistoryEntry {
  from_status: TaskStatus | null;
  to_status: TaskStatus;
  changed_at: string;
}

interface TaskDetailResponse {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner: { id: string; name: string };
  incident_id?: string;
  plan_section_id?: string;
  due_at: string;
  requires_approval: boolean;
  status_history: TaskStatusHistoryEntry[];
}

/** Exact FRD tone mapping for task status (same mapping TaskList.tsx
 * uses) — rendered via Badge, never a raw colored span. */
const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  Open: 'info',
  'In progress': 'brand',
  'Awaiting approval': 'warning',
  Done: 'success',
  Overdue: 'danger',
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatTime24h(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** Per the mockup's exact action table: the single next valid status for
 * each current status (Awaiting approval's "Mark done" is the approver
 * action; Done/Overdue both offer "Reopen"). Returns null when the
 * current status is terminal with no further action (never happens in
 * this fixed state machine, but keeps the type honest). */
function nextActionFor(
  status: TaskStatus,
  requiresApproval: boolean,
): { label: string; newStatus: TaskStatus } | null {
  switch (status) {
    case 'Open':
      return { label: 'Mark in progress', newStatus: 'In progress' };
    case 'In progress':
      return requiresApproval
        ? { label: 'Submit for approval', newStatus: 'Awaiting approval' }
        : { label: 'Mark done', newStatus: 'Done' };
    case 'Awaiting approval':
      return { label: 'Mark done', newStatus: 'Done' };
    case 'Done':
    case 'Overdue':
      return { label: 'Reopen', newStatus: 'Open' };
    default:
      return null;
  }
}

/**
 * F4 S4.3 — Task Detail. Routed `/tasks/{id}`.
 *
 * Action buttons are re-derived from the task's CURRENT status after every
 * fetch/refetch — including after a failed 409 attempt, where the status
 * hasn't changed server-side, so the just-recomputed action set is still
 * correct without any special-case handling.
 */
export function TaskDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transitionError, setTransitionError] = React.useState<string | null>(null);
  const [transitioning, setTransitioning] = React.useState(false);

  const taskQuery = useQuery({
    queryKey: ['task', id],
    queryFn: () => apiGet<TaskDetailResponse>(`/api/v1/tasks/${id}`),
    enabled: Boolean(id),
  });

  const handleAction = async (newStatus: TaskStatus) => {
    if (!id) return;
    setTransitioning(true);
    setTransitionError(null);
    try {
      await apiPatch(`/api/v1/tasks/${id}/status`, { new_status: newStatus });
      await taskQuery.refetch();
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'INVALID_STATUS_TRANSITION') {
        setTransitionError(err.message);
        // The task's current status hasn't changed server-side on a 409 —
        // refetch so the action button re-derives from the real current
        // state (defensive; usually a no-op since nothing changed).
        await taskQuery.refetch();
        return;
      }
      setTransitionError(
        err instanceof ApiRequestError ? err.message : 'Could not update this task.',
      );
    } finally {
      setTransitioning(false);
    }
  };

  if (taskQuery.isError) {
    const message =
      taskQuery.error instanceof ApiRequestError
        ? taskQuery.error.body.message
        : 'Could not load this task.';
    return (
      <div className="ep-task-detail">
        <EmptyState
          title="Task not found"
          action={
            <Button variant="primary" onClick={() => navigate('/tasks')}>
              Back to tasks
            </Button>
          }
        >
          {message}
        </EmptyState>
      </div>
    );
  }

  if (taskQuery.isLoading || !taskQuery.data) {
    return <div className="ep-task-detail" aria-busy="true" />;
  }

  const task = taskQuery.data;
  const action = nextActionFor(task.status, task.requires_approval);

  const historyItems: TimelineItem[] = task.status_history.map((entry) => ({
    time: formatTime24h(entry.changed_at),
    title: entry.from_status
      ? `${entry.from_status} \u2192 ${entry.to_status}`
      : `Created as ${entry.to_status}`,
    tone: entry.to_status === 'Done' ? 'success' : entry.to_status === 'Overdue' ? 'danger' : 'brand',
  }));

  return (
    <div className="ep-task-detail">
      <PageHeader
        title={task.title}
        status={<Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>}
        crumbs={[{ label: 'Tasks', href: '/tasks' }, { label: task.title }]}
        actions={
          action
            ? [
                <Button
                  key="action"
                  variant="primary"
                  onClick={() => void handleAction(action.newStatus)}
                  loading={transitioning}
                >
                  {action.label}
                </Button>,
              ]
            : []
        }
      />

      {transitionError ? (
        <Alert tone="danger" title="This task can't move to that status from its current state.">
          {transitionError}
        </Alert>
      ) : null}

      <Card>
        {task.description ? <p className="body-lg">{task.description}</p> : null}
        <div className="ep-task-detail__meta-row">
          <Avatar name={task.owner.name} />
          <span>{task.owner.name}</span>
        </div>
        <p className="caption">Due {formatDateTime(task.due_at)}</p>
        {task.incident_id ? (
          <p>
            <a
              href={`/incidents/${task.incident_id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/incidents/${task.incident_id}`);
              }}
            >
              View linked incident
            </a>
          </p>
        ) : null}
        {task.plan_section_id ? <p className="caption">Linked to a plan section</p> : null}
      </Card>

      <Card title="Status history">
        {historyItems.length > 0 ? (
          <Timeline items={historyItems} />
        ) : (
          <p className="caption">No status changes recorded yet.</p>
        )}
      </Card>
    </div>
  );
}
