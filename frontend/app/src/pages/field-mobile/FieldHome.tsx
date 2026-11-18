import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Skeleton, EmptyState, Button, type BadgeTone } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import './FieldHome.css';

type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';

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

/** Same tone mapping 03-*'s Task List/Task Detail screens use for `status`. */
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

/**
 * F6 S6.1 — Field Home, the responder's landing screen. Routed `/field`
 * (05-04 wires the route tree + bottom-nav; this plan only builds the
 * screen itself).
 */
export function FieldHome(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();

  // `owner` is a real user id, not the literal string 'me' — confirmed
  // against tasks.ts's actual `GET /api/v1/tasks` filter contract (owner
  // is compared via `t.owner_id = $n`, not a magic-string branch).
  const { data, isLoading } = useQuery({
    queryKey: ['field-tasks', user.id],
    queryFn: () => apiGet<TasksListResponse>(`/api/v1/tasks?owner=${user.id}`),
  });

  const tasks = data?.items ?? [];

  return (
    <FieldMobileShell>
      <div className="ep-field-home">
        <h1 className="h1">Field home</h1>

        <h3 className="h3">Today&apos;s tasks</h3>

        {isLoading ? (
          <div className="ep-field-home__list">
            <Skeleton w="100%" h={96} />
            <Skeleton w="100%" h={96} />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState title="No tasks assigned yet" />
        ) : (
          <div className="ep-field-home__list">
            {tasks.map((task) => (
              <Card key={task.id} title={task.title}>
                <div className="ep-field-home__card-row">
                  <Badge tone={STATUS_TONE[task.status]}>{task.status}</Badge>
                  <span className="caption">Due {formatDue(task.due_at)}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="ep-field-home__action-bar">
        <Button
          variant="primary"
          size="lg"
          icon="send"
          block
          onClick={() => navigate('/field/report')}
        >
          Report observation
        </Button>
      </div>
    </FieldMobileShell>
  );
}
