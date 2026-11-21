import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Progress,
  Card,
  Table,
  Select,
  Badge,
  type TableColumn,
  type SelectOption,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

type DeliveryStatus = 'Queued' | 'Sent' | 'Delivered' | 'Failed' | 'Acknowledged';

interface DeliveryRecipient {
  name: string;
  channel: string;
  status: DeliveryStatus;
  failure_reason?: string;
}

interface DeliveryStatusResponse {
  recipients: DeliveryRecipient[];
  ack_percentage: number;
  // Plan 09-01's notifications.ts send route is untouched by this field;
  // Plan 09-03 (F14 frontend half) adds this additive-only field to the
  // EXISTING GET /api/v1/notifications/:id/delivery-status response
  // (notifications.ts), sourced from the notification's own `channels`
  // array — no new endpoint, no breaking shape change for any existing
  // consumer.
  is_cap_send?: boolean;
}

/** Exact FRD tone mapping for delivery status, rendered via
 * Table.StatusCell (which delegates to Badge), never a raw colored span:
 * Queued=neutral, Sent=info, Delivered=success, Failed=danger,
 * Acknowledged=success. */
const STATUS_TONE: Record<DeliveryStatus, BadgeTone> = {
  Queued: 'neutral',
  Sent: 'info',
  Delivered: 'success',
  Failed: 'danger',
  Acknowledged: 'success',
};

const FILTER_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'Queued', label: 'Queued' },
  { value: 'Sent', label: 'Sent' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Failed', label: 'Failed' },
  { value: 'Acknowledged', label: 'Acknowledged' },
];

/**
 * F5 S5.4 — Delivery & Acknowledgment Tracking. Routed
 * `/notifications/{id}/delivery`.
 *
 * Polls GET /api/v1/notifications/{id}/delivery-status every ~5000ms —
 * shorter than Task/Resource lists' 30s poll (TaskList.tsx), since delivery
 * status is the single most time-sensitive read in this phase: a sender
 * watching this page right after a send needs near-real-time feedback on
 * whether a message actually reached anyone, not a 30-second-stale view.
 */
export function DeliveryTracking(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [statusFilter, setStatusFilter] = React.useState('');

  const deliveryQuery = useQuery({
    queryKey: ['notification-delivery-status', id],
    queryFn: () => apiGet<DeliveryStatusResponse>(`/api/v1/notifications/${id}/delivery-status`),
    enabled: Boolean(id),
    refetchInterval: 5000,
  });

  const allRecipients = deliveryQuery.data?.recipients ?? [];
  const filteredRecipients = statusFilter
    ? allRecipients.filter((r) => r.status === statusFilter)
    : allRecipients;

  const ackPercentage = deliveryQuery.data?.ack_percentage ?? 0;
  const ackCount = allRecipients.filter((r) => r.status === 'Acknowledged').length;
  const totalCount = allRecipients.length;
  const isCapSend = deliveryQuery.data?.is_cap_send ?? false;

  const columns: TableColumn<DeliveryRecipient>[] = [
    { key: 'name', header: 'Name/Group' },
    { key: 'channel', header: 'Channel' },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div>
          <Table.StatusCell tone={STATUS_TONE[row.status]}>{row.status}</Table.StatusCell>
          {/* Failed rows show failure_reason inline as caption text
              beneath the badge — never a silent drop, per FRD's explicit
              rule. */}
          {row.status === 'Failed' && row.failure_reason ? (
            <p className="caption">{row.failure_reason}</p>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="ep-delivery-tracking">
      <PageHeader title="Delivery tracking" />

      {/* F14 (Plan 09-03): distinct, visible, never rendered identically
          to a plain delivery-status row — a CAP-formatted public-alert
          send (routed through IPAWS) gets this Badge; a plain SMS/Email
          send never does. */}
      {isCapSend ? <Badge tone="warning">Public alert (CAP)</Badge> : null}

      <Progress
        value={ackPercentage}
        label={`${Math.round(ackPercentage)}% acknowledged, ${ackCount} of ${totalCount}`}
        tone="success"
      />

      <div className="ep-delivery-tracking__toolbar">
        <Select
          label="Filter by status"
          options={FILTER_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <Card padded={false}>
        <Table
          caption="Delivery status"
          columns={columns}
          rows={filteredRecipients}
          rowKey={(row) => `${row.name}-${row.channel}-${row.status}`}
          loading={deliveryQuery.isLoading}
          error={
            deliveryQuery.isError
              ? { message: 'Could not load delivery status.', onRetry: () => void deliveryQuery.refetch() }
              : undefined
          }
          empty={{ title: 'No recipients yet' }}
        />
      </Card>
    </div>
  );
}
