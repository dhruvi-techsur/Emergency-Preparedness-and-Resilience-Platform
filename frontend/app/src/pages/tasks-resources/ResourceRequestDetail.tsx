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
  Modal,
  TextField,
  Combobox,
  Timeline,
  EmptyState,
  type BadgeTone,
  type TimelineItem,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

type ResourceRequestStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Fulfilled' | 'Declined';
type ResourceType = 'Personnel' | 'Equipment' | 'Supplies';

interface ResourceRequestStatusHistoryEntry {
  from_status: ResourceRequestStatus | null;
  to_status: ResourceRequestStatus;
  changed_at: string;
}

interface RosterRow {
  id: string;
  name: string;
  qualifications: string[] | null;
}

interface RosterResponse {
  items: RosterRow[];
}

interface ResourceRequestDetailResponse {
  id: string;
  resource_type: ResourceType;
  description: string;
  quantity: number;
  status: ResourceRequestStatus;
  incident_id: string;
  requesting_role: string;
  needed_by: string;
  requested_by: { id: string; name: string };
  decline_reason?: string;
  assigned_to?: string;
  status_history: ResourceRequestStatusHistoryEntry[];
}

/** Exact FRD tone mapping for resource-request status (same mapping
 * ResourceRequestList.tsx uses) — rendered via Badge, never a raw colored
 * span. */
const STATUS_TONE: Record<ResourceRequestStatus, BadgeTone> = {
  Draft: 'neutral',
  'Awaiting approval': 'warning',
  Approved: 'info',
  Fulfilled: 'success',
  Declined: 'danger',
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

/**
 * F4 S4.6/S4.7 — Resource Request Detail. Routed `/resource-requests/{id}`.
 *
 * Decline requires a non-empty reason, enforced client-side by disabling
 * the modal's confirm button while the field is empty (mirrors 03-04's
 * server-side 422 DECLINE_REASON_REQUIRED, same pattern CreateTask.tsx's
 * owner-required check documents). Approve has no modal, per the mockup's
 * "Approve (primary)" direct-action framing. Assign/Mark fulfilled both
 * call the same POST .../fulfill endpoint — the first call (no
 * assigned_to yet) assigns only; the second (assigned_to already set)
 * fulfills, per 03-04's documented two-phase behavior.
 */
export function ResourceRequestDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [approveError, setApproveError] = React.useState<string | null>(null);
  const [approving, setApproving] = React.useState(false);

  const [declineModalOpen, setDeclineModalOpen] = React.useState(false);
  const [reason, setDeclineReason] = React.useState('');
  const [declining, setDeclining] = React.useState(false);
  const [declineError, setDeclineError] = React.useState<string | null>(null);

  const [assignModalOpen, setAssignModalOpen] = React.useState(false);
  const [assignedToInput, setAssignedToInput] = React.useState('');
  const [assigning, setAssigning] = React.useState(false);
  const [assignError, setAssignError] = React.useState<string | null>(null);

  const [fulfilling, setFulfilling] = React.useState(false);
  const [fulfillError, setFulfillError] = React.useState<string | null>(null);

  const requestQuery = useQuery({
    queryKey: ['resource-request', id],
    queryFn: () => apiGet<ResourceRequestDetailResponse>(`/api/v1/resource-requests/${id}`),
    enabled: Boolean(id),
  });

  // F16-roster (Plan 09-04): roster-sourced quick-pick options for the
  // Assign modal below. `assigned_to` is VARCHAR(200) with NO FK (per
  // TechArch), so BOTH matched and unmatched roster rows are legitimate
  // names to offer here — unlike Command Role Assignment's FK-constrained
  // person_id, an unmatched roster entry is still assignable work.
  const rosterQuery = useQuery({
    queryKey: ['hris-personnel-for-resource-assign'],
    queryFn: () => apiGet<RosterResponse>('/api/v1/integrations/hris/personnel'),
    enabled: assignModalOpen,
  });

  const rosterOptions: ComboboxOption[] = (rosterQuery.data?.items ?? []).map((row) => ({
    value: row.name,
    label: row.name,
    hint: (row.qualifications ?? []).join(', ') || undefined,
  }));

  const handleApprove = async () => {
    if (!id) return;
    setApproving(true);
    setApproveError(null);
    try {
      await apiPost(`/api/v1/resource-requests/${id}/approve`, {});
      await requestQuery.refetch();
    } catch (err) {
      setApproveError(
        err instanceof ApiRequestError ? err.message : 'Could not approve this request.',
      );
    } finally {
      setApproving(false);
    }
  };

  const handleDecline = async () => {
    if (!id || reason.trim().length === 0) return;
    setDeclining(true);
    setDeclineError(null);
    try {
      await apiPost(`/api/v1/resource-requests/${id}/decline`, { reason: reason.trim() });
      setDeclineModalOpen(false);
      setDeclineReason('');
      await requestQuery.refetch();
    } catch (err) {
      setDeclineError(
        err instanceof ApiRequestError ? err.message : 'Could not decline this request.',
      );
    } finally {
      setDeclining(false);
    }
  };

  const handleAssign = async () => {
    if (!id || !assignedToInput.trim()) return;
    setAssigning(true);
    setAssignError(null);
    try {
      await apiPost(`/api/v1/resource-requests/${id}/fulfill`, {
        assigned_to: assignedToInput.trim(),
      });
      setAssignModalOpen(false);
      setAssignedToInput('');
      await requestQuery.refetch();
    } catch (err) {
      setAssignError(err instanceof ApiRequestError ? err.message : 'Could not assign this request.');
    } finally {
      setAssigning(false);
    }
  };

  const handleMarkFulfilled = async (assignedTo: string) => {
    if (!id) return;
    setFulfilling(true);
    setFulfillError(null);
    try {
      // Second call: assigned_to is already set on the record, so this
      // RE-supplies the same value (03-04's documented second-call-
      // fulfills behavior) — fetched from the current record rather than
      // re-prompting.
      await apiPost(`/api/v1/resource-requests/${id}/fulfill`, { assigned_to: assignedTo });
      await requestQuery.refetch();
    } catch (err) {
      setFulfillError(
        err instanceof ApiRequestError ? err.message : 'Could not mark this request fulfilled.',
      );
    } finally {
      setFulfilling(false);
    }
  };

  if (requestQuery.isError) {
    const message =
      requestQuery.error instanceof ApiRequestError
        ? requestQuery.error.body.message
        : 'Could not load this resource request.';
    return (
      <div className="ep-resource-request-detail">
        <EmptyState
          title="Resource request not found"
          action={
            <Button variant="primary" onClick={() => navigate('/resource-requests')}>
              Back to resource requests
            </Button>
          }
        >
          {message}
        </EmptyState>
      </div>
    );
  }

  if (requestQuery.isLoading || !requestQuery.data) {
    return <div className="ep-resource-request-detail" aria-busy="true" />;
  }

  const request = requestQuery.data;

  // Action set per the mockup's state table: Awaiting approval -> Approve
  // (primary) + Decline (secondary); Approved+unassigned -> Assign;
  // Approved+assigned -> Mark fulfilled; Fulfilled/Declined -> terminal,
  // no actions.
  const actions: React.ReactNode[] = [];
  if (request.status === 'Awaiting approval') {
    actions.push(
      <Button key="decline" variant="secondary" onClick={() => setDeclineModalOpen(true)}>
        Decline
      </Button>,
      <Button key="approve" variant="primary" onClick={() => void handleApprove()} loading={approving}>
        Approve
      </Button>,
    );
  } else if (request.status === 'Approved' && !request.assigned_to) {
    actions.push(
      <Button key="assign" variant="secondary" onClick={() => setAssignModalOpen(true)}>
        Assign
      </Button>,
    );
  } else if (request.status === 'Approved' && request.assigned_to) {
    actions.push(
      <Button
        key="fulfill"
        variant="primary"
        onClick={() => void handleMarkFulfilled(request.assigned_to!)}
        loading={fulfilling}
      >
        Mark fulfilled
      </Button>,
    );
  }

  const historyItems: TimelineItem[] = request.status_history.map((entry) => ({
    time: formatTime24h(entry.changed_at),
    title: entry.from_status
      ? `${entry.from_status} \u2192 ${entry.to_status}`
      : `Created as ${entry.to_status}`,
    tone:
      entry.to_status === 'Fulfilled'
        ? 'success'
        : entry.to_status === 'Declined'
          ? 'danger'
          : 'brand',
  }));

  return (
    <div className="ep-resource-request-detail">
      <PageHeader
        title={`${request.quantity} ${request.resource_type} \u2014 ${request.description.slice(0, 40)}`}
        status={<Badge tone={STATUS_TONE[request.status]}>{request.status}</Badge>}
        crumbs={[{ label: 'Resource requests', href: '/resource-requests' }, { label: 'Request detail' }]}
        actions={actions}
      />

      {approveError ? (
        <Alert tone="danger" title="Could not approve this request">
          {approveError}
        </Alert>
      ) : null}
      {fulfillError ? (
        <Alert tone="danger" title="Could not mark this request fulfilled">
          {fulfillError}
        </Alert>
      ) : null}

      <Card>
        <p className="body-lg">{request.description}</p>
        <p className="caption">Quantity: {request.quantity}</p>
        <p className="caption">Requesting role: {request.requesting_role}</p>
        <p className="caption">Needed by: {formatDateTime(request.needed_by)}</p>
        <div className="ep-resource-request-detail__meta-row">
          <Avatar name={request.requested_by.name} />
          <span>Requested by {request.requested_by.name}</span>
        </div>
        <p>
          <a
            href={`/incidents/${request.incident_id}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/incidents/${request.incident_id}`);
            }}
          >
            View linked incident
          </a>
        </p>
        {request.decline_reason ? (
          <Alert tone="danger" title="This request was declined">
            {request.decline_reason}
          </Alert>
        ) : null}
        {request.assigned_to ? <p className="caption">Assigned to: {request.assigned_to}</p> : null}
      </Card>

      <Card title="Approval history">
        {historyItems.length > 0 ? (
          <Timeline items={historyItems} />
        ) : (
          <p className="caption">No status changes recorded yet.</p>
        )}
      </Card>

      <Modal
        open={declineModalOpen}
        title="Decline this resource request?"
        onClose={() => {
          setDeclineModalOpen(false);
          setDeclineReason('');
          setDeclineError(null);
        }}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeclineModalOpen(false);
                setDeclineReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDecline()}
              loading={declining}
              disabled={reason.trim().length === 0}
            >
              Decline
            </Button>
          </>
        }
      >
        {declineError ? (
          <Alert tone="danger" title="Could not decline this request">
            {declineError}
          </Alert>
        ) : null}
        <TextField
          label="Reason"
          multiline
          required
          value={reason}
          onChange={(e) => setDeclineReason(e.target.value)}
        />
      </Modal>

      <Modal
        open={assignModalOpen}
        title="Assign this resource request"
        onClose={() => {
          setAssignModalOpen(false);
          setAssignedToInput('');
          setAssignError(null);
        }}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setAssignModalOpen(false);
                setAssignedToInput('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void handleAssign()}
              loading={assigning}
              disabled={!assignedToInput.trim()}
            >
              Assign
            </Button>
          </>
        }
      >
        {assignError ? (
          <Alert tone="danger" title="Could not assign this request">
            {assignError}
          </Alert>
        ) : null}
        {/* F16-roster (Plan 09-04): Combobox.tsx is a committed-value-from-
            the-list selector (selecting an option sets a value; typing
            alone reverts on blur, per its own closeDropdown(true) revert
            behavior) — it has no "accept arbitrary typed text as the final
            value" mode. Since assigned_to must stay usable for a person
            NOT YET in the roster (free text), this Combobox is a
            SEPARATE, additive quick-pick above the existing, unchanged
            TextField: selecting a roster option populates the SAME
            assignedToInput state the TextField binds to, via
            setAssignedToInput — not a replacement of the TextField. */}
        <Combobox
          label="Or pick from roster"
          options={rosterOptions}
          onChange={(_value, option) => {
            if (option) setAssignedToInput(option.label);
          }}
          loading={rosterQuery.isLoading}
          placeholder="Search the personnel roster"
          clearable
        />
        <TextField
          label="Assigned to"
          required
          hint="Name of the person or team responsible for fulfilling this"
          value={assignedToInput}
          onChange={(e) => setAssignedToInput(e.target.value)}
        />
      </Modal>
    </div>
  );
}
