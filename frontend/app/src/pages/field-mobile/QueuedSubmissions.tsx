import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Button, EmptyState, type BadgeTone } from '@epmp/design-system';
import {
  getQueueSnapshot,
  subscribeToQueue,
  deleteQueuedItem,
  enqueueFieldReport,
  type QueuedFieldReport,
  type QueuedTaskStatusChange,
  type QueueSnapshot,
} from '../../lib/offline-queue';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import './QueuedSubmissions.css';

/** Per-`queue_status` Badge word/tone — `pending` is deliberately `neutral`
 * (the mockup's plain "Queued" badge, not a status-color tone) since it is
 * a transient waiting-state, not yet a success/failure outcome. Covers
 * BOTH field_reports' and tasks_status' `queue_status` unions —
 * tasks_status's union (`pending|syncing|synced|failed`) is a strict
 * subset of field_reports' (which additionally has `conflict`), so one
 * shared lookup table is correct for both without a cast. */
const STATUS_BADGE: Record<QueuedFieldReport['queue_status'], { label: string; tone: BadgeTone }> = {
  pending: { label: 'Queued', tone: 'neutral' },
  syncing: { label: 'Syncing', tone: 'brand' },
  synced: { label: 'Synced', tone: 'success' },
  conflict: { label: 'Conflict', tone: 'warning' },
  failed: { label: 'Failed', tone: 'danger' },
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function titleFor(item: QueuedFieldReport): string {
  return item.observation_type || 'Field observation';
}

/** 05-04-PLAN.md's own documented title format for tasks_status items
 * (review finding W2): `"Task status: {new_status}"`. */
function titleForTaskStatus(item: QueuedTaskStatusChange): string {
  return `Task status: ${item.new_status}`;
}

/**
 * F6 S6.4 — Queued Submissions View. Routed `/field/queued`. Lists every
 * item from the offline-queue's `field_reports` IndexedDB store (05-02),
 * live-updated via `subscribeToQueue` so a status transition (e.g.
 * pending -> synced, or pending -> conflict) is reflected without a manual
 * refresh — this is the literal mechanism satisfying "nothing is silently
 * dropped, every item resolves visibly to one of these states."
 */
export function QueuedSubmissions(): JSX.Element {
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = React.useState<QueueSnapshot | null>(null);
  const [retryingIds, setRetryingIds] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const unsubscribe = subscribeToQueue(setSnapshot);
    return unsubscribe;
  }, []);

  const handleDelete = async (clientReportId: string) => {
    await deleteQueuedItem(clientReportId);
  };

  const handleRetry = async (item: QueuedFieldReport) => {
    // The original client_report_id's idempotency key was already
    // consumed by the failed attempt (the server may have partially
    // processed it before failing) -- retrying needs a FRESH
    // client_report_id, a new submission, never a resubmission of the
    // same id. The old failed row is deleted so the list doesn't show
    // both the old failed item and the new pending one simultaneously.
    setRetryingIds((prev) => new Set(prev).add(item.client_report_id));
    try {
      const newClientReportId = crypto.randomUUID();
      await enqueueFieldReport({
        client_report_id: newClientReportId,
        incident_id: item.incident_id,
        observation_type: item.observation_type,
        description: item.description,
        location: item.location,
        location_accuracy_m: item.location_accuracy_m,
        captured_at: new Date().toISOString(),
      });
      await deleteQueuedItem(item.client_report_id);
    } finally {
      setRetryingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.client_report_id);
        return next;
      });
    }
  };

  const items = snapshot?.items ?? [];
  const taskStatusItems = snapshot?.taskStatusItems ?? [];
  // Most-recently-captured first -- matches the mockup's "newest on top"
  // convention for a queue the responder is actively monitoring.
  const sortedItems = [...items].sort((a, b) => b.created_at.localeCompare(a.created_at));
  // Review finding W2: queued task-status changes (05-03's second
  // IndexedDB object store) rendered in their OWN sorted list, appended
  // after field_reports' own cards below -- they have no `conflict_id`/
  // retry/delete action surface (a task-status change is re-attempted by
  // tapping the SAME Start/Mark-done button again on My Tasks, not from
  // this screen), so they are read-only Cards here: title + Badge +
  // Captured timestamp only, same visual language as field_reports'
  // cards but without the per-item actions that only make sense for a
  // field report.
  const sortedTaskStatusItems = [...taskStatusItems].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  return (
    <FieldMobileShell>
      <div className="ep-queued-submissions">
        <h1 className="h1">Queued submissions</h1>

        {sortedItems.length === 0 && sortedTaskStatusItems.length === 0 ? (
          <EmptyState title="Nothing queued">
            Every submitted report has synced.
          </EmptyState>
        ) : (
          <div className="ep-queued-submissions__list">
            {sortedTaskStatusItems.map((item) => {
              const badge = STATUS_BADGE[item.queue_status];
              return (
                <Card key={`${item.task_id}-${item.captured_at}`} title={titleForTaskStatus(item)}>
                  <div className="ep-queued-submissions__badge-row">
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </div>
                  <p className="caption">Captured: {formatTimestamp(item.captured_at)}</p>
                </Card>
              );
            })}
            {sortedItems.map((item) => {
              const badge = STATUS_BADGE[item.queue_status];
              const isConflict = item.queue_status === 'conflict';

              const cardBody = (
                <>
                  <div className="ep-queued-submissions__badge-row">
                    <Badge tone={badge.tone}>{badge.label}</Badge>
                  </div>

                  {item.queue_status === 'synced' ? (
                    <p className="caption">Synced: {formatTimestamp(item.created_at)}</p>
                  ) : (
                    <p className="caption">Captured: {formatTimestamp(item.captured_at)}</p>
                  )}

                  {item.queue_status === 'failed' ? (
                    <p className="caption ep-queued-submissions__failed-reason">
                      This submission couldn&apos;t be delivered. Retry to resubmit it as a new
                      report.
                    </p>
                  ) : null}

                  <div className="ep-queued-submissions__actions">
                    {item.queue_status === 'pending' ? (
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleDelete(item.client_report_id);
                        }}
                      >
                        Delete
                      </Button>
                    ) : null}
                    {item.queue_status === 'failed' ? (
                      <Button
                        variant="ghost"
                        size="lg"
                        loading={retryingIds.has(item.client_report_id)}
                        onClick={(event) => {
                          event.stopPropagation();
                          void handleRetry(item);
                        }}
                      >
                        Retry
                      </Button>
                    ) : null}
                  </div>
                </>
              );

              // Card's discriminated union requires `interactive` paired
              // with `onClick`/`href` ONLY when true — two separate JSX
              // branches (rather than a spread) keep that union intact for
              // tsc, since a conditionally-built props object can't satisfy
              // CardProps' exact-shape requirement.
              return isConflict ? (
                <Card
                  key={item.client_report_id}
                  title={titleFor(item)}
                  interactive
                  onClick={() => navigate(`/field/conflicts/${item.conflict_id}`)}
                >
                  {cardBody}
                </Card>
              ) : (
                <Card key={item.client_report_id} title={titleFor(item)}>
                  {cardBody}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </FieldMobileShell>
  );
}
