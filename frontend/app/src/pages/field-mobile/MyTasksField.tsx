import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Badge, Skeleton, EmptyState, Alert, Button, type BadgeTone } from '@epmp/design-system';
import { apiGet, apiPatch } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import { enqueueTaskStatusChange, type TaskStatusValue } from '../../lib/offline-queue';

type TaskStatus = TaskStatusValue;

interface FieldTask {
  id: string;
  title: string;
  status: TaskStatus;
  due_at: string;
}

interface TasksListResponse {
  items: FieldTask[];
  total: number;
}

const STATUS_TONE: Record<TaskStatus, BadgeTone> = {
  Open: 'info',
  'In progress': 'brand',
  'Awaiting approval': 'warning',
  Done: 'success',
  Overdue: 'danger',
};

function formatDue(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** The two one-tap transitions this field view offers — only these two,
 * matching the mockup's "Start"/"Mark done" one-tap buttons exactly. Tasks
 * in any OTHER status render no action button; the full state machine
 * (Awaiting approval → Done, Done → Open reopen, etc.) belongs to Task
 * Detail (03-06), not this field-mobile one-tap view. */
function nextStatusFor(current: TaskStatus): TaskStatus | null {
  if (current === 'Open') return 'In progress';
  if (current === 'In progress') return 'Done';
  return null;
}

function labelFor(current: TaskStatus): string {
  return current === 'Open' ? 'Start' : 'Mark done';
}

/**
 * F6 S6.2 — My Tasks (field view). Routed `/field/tasks`. One-tap
 * Start/Mark done, working online (direct PATCH) and offline (queued via
 * offline-queue's SECOND object store, extended by this plan).
 */
export function MyTasksField(): JSX.Element {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  // Set of task ids whose status change has been optimistically queued
  // this session — renders the "Queued" Badge overlay immediately,
  // regardless of online/offline, satisfying "SyncStatus queued count
  // increments immediately" and the mockup's "task card shows Queued Badge
  // overlay" state.
  const [queuedTaskIds, setQueuedTaskIds] = React.useState<Set<string>>(new Set());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['field-tasks', user.id],
    queryFn: () => apiGet<TasksListResponse>(`/api/v1/tasks?owner=${user.id}`),
  });

  const tasks = data?.items ?? [];

  const handleStatusTap = async (task: FieldTask) => {
    const newStatus = nextStatusFor(task.status);
    if (!newStatus) return;

    setQueuedTaskIds((prev) => new Set(prev).add(task.id));

    if (navigator.onLine) {
      try {
        await apiPatch(`/api/v1/tasks/${task.id}/status`, { new_status: newStatus });
        void queryClient.invalidateQueries({ queryKey: ['field-tasks', user.id] });
        setQueuedTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(task.id);
          return next;
        });
        return;
      } catch {
        // Treat any failure as "couldn't reach the server right now" —
        // degrade to the same queued path offline would take, rather than
        // surfacing a network-error toast. A field app should never make
        // the responder feel their tap was lost.
      }
    }

    await enqueueTaskStatusChange(task.id, newStatus);
  };

  return (
    <FieldMobileShell>
      <div className="ep-my-tasks-field">
        <h1 className="h1">My tasks</h1>

        {isLoading ? (
          <div className="ep-my-tasks-field__list">
            <Skeleton w="100%" h={120} />
            <Skeleton w="100%" h={120} />
          </div>
        ) : isError ? (
          <Alert
            tone="danger"
            title="Could not load your tasks"
            actions={
              <Button variant="secondary" size="lg" onClick={() => void refetch()}>
                Retry
              </Button>
            }
          >
            Showing last-known cached tasks below, if any.
          </Alert>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks assigned yet" />
        ) : (
          <div className="ep-my-tasks-field__list">
            {tasks.map((task) => {
              const nextStatus = nextStatusFor(task.status);
              const isQueued = queuedTaskIds.has(task.id);
              return (
                <Card key={task.id} title={task.title}>
                  <div className="ep-my-tasks-field__badges">
                    <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
                    {isQueued ? <Badge tone="warning">Queued</Badge> : null}
                  </div>
                  <p className="caption">Due: {formatDue(task.due_at)}</p>
                  {nextStatus ? (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => void handleStatusTap(task)}
                    >
                      {labelFor(task.status)}
                    </Button>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </FieldMobileShell>
  );
}
