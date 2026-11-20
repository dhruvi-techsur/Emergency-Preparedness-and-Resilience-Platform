import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  Select,
  Button,
  Modal,
  TextField,
  Alert,
  type TableColumn,
  type SelectOption,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';
import './SignalTriage.css';

type ConfidenceLabel = 'High' | 'Medium' | 'Low';
type SignalStatus = 'New' | 'Dismissed' | 'Promoted';

/** Matches backend's SignalListRow shape (ai-assist/signals.ts). */
interface SignalListItem {
  id: string;
  summary: string;
  confidence_label: ConfidenceLabel;
  confidence_reason: string;
  detected_at: string;
  status: SignalStatus;
  source_feeds: string[] | null;
}

interface SignalsListResponse {
  items: SignalListItem[];
}

interface SignalPromotePrefill {
  name_suggestion: string;
  type_suggestion: string;
  severity_suggestion: string;
  source_signal_id: string;
}

interface SignalPromoteResponse {
  prefill: SignalPromotePrefill;
}

/** Status tone mapping — New is still-actionable (info), Dismissed is a
 * closed non-outcome (neutral), Promoted is the "led somewhere" outcome
 * (success). Rendered exclusively through Table.StatusCell (Badge), never
 * a raw colored span, per F0's icon+word+color rule. */
const STATUS_TONE: Record<SignalStatus, BadgeTone> = {
  New: 'info',
  Dismissed: 'neutral',
  Promoted: 'success',
};

const STATUS_OPTIONS: SelectOption[] = [
  { value: '', label: 'All statuses' },
  { value: 'New', label: 'New' },
  { value: 'Dismissed', label: 'Dismissed' },
  { value: 'Promoted', label: 'Promoted' },
];

const CONFIDENCE_OPTIONS: SelectOption[] = [
  { value: '', label: 'All confidence levels' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

function formatDetectedAt(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * F9/S9.1 — Signal Triage Queue. Routed `/signals`, reached from the
 * Monitor SideNav group's "Signals" item (06-06's nav-config addition).
 *
 * Confidence renders as qualitative `${label} — ${reason}` TEXT ONLY —
 * this component never imports a numeric-confidence or bar-style gauge
 * component, which is itself the mechanism satisfying the FRD's "never a
 * bare numeric indicator" rule (there is no code path here capable of
 * rendering one).
 *
 * Promote NEVER calls any incident-creation endpoint — it calls the
 * signals-only `/promote` endpoint (which itself writes no incidents-table
 * row, per 06-04's own structural guarantee) and then navigates to the
 * EXISTING Create Incident form with the backend's own pre-fill payload
 * attached as router state. The human must still explicitly submit that
 * form — this screen's own code path cannot create an incident.
 *
 * Dismiss opens a Modal whose confirm button is disabled while the typed
 * reason is empty — a client-side backstop (not a replacement) for 06-04's
 * own server-side 422 SIGNAL_DISMISS_REASON_REQUIRED validation.
 */
export function SignalTriageQueue(): JSX.Element {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = React.useState('');
  const [confidenceFilter, setConfidenceFilter] = React.useState('');

  const [dismissModalSignalId, setDismissModalSignalId] = React.useState<string | null>(null);
  const [dismissReason, setDismissReason] = React.useState('');
  const [dismissing, setDismissing] = React.useState(false);
  const [dismissError, setDismissError] = React.useState<string | null>(null);

  const [promotingId, setPromotingId] = React.useState<string | null>(null);
  const [promoteError, setPromoteError] = React.useState<string | null>(null);

  const queryParams = new URLSearchParams();
  if (statusFilter) queryParams.set('status', statusFilter);
  if (confidenceFilter) queryParams.set('confidence', confidenceFilter);
  const queryString = queryParams.toString();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['signals', statusFilter, confidenceFilter],
    queryFn: () => apiGet<SignalsListResponse>(`/api/v1/signals${queryString ? `?${queryString}` : ''}`),
  });

  const items = data?.items ?? [];

  const closeDismissModal = () => {
    setDismissModalSignalId(null);
    setDismissReason('');
    setDismissError(null);
  };

  const handleDismiss = async () => {
    if (!dismissModalSignalId || dismissReason.trim().length === 0) return;
    setDismissing(true);
    setDismissError(null);
    try {
      await apiPost(`/api/v1/signals/${dismissModalSignalId}/dismiss`, {
        reason: dismissReason.trim(),
      });
      closeDismissModal();
      void queryClient.invalidateQueries({ queryKey: ['signals'] });
    } catch (err) {
      setDismissError(
        err instanceof ApiRequestError ? err.message : 'Could not dismiss this signal.',
      );
    } finally {
      setDismissing(false);
    }
  };

  /**
   * Calls ONLY the signals-triage `/promote` endpoint, which itself writes
   * no incidents-table row (06-04's own structural guarantee). The result
   * is navigated to `/incidents/new` as router state — this component
   * NEVER calls any incident-creation endpoint directly.
   */
  const handlePromote = async (signalId: string) => {
    setPromotingId(signalId);
    setPromoteError(null);
    try {
      const response = await apiPost<SignalPromoteResponse>(
        `/api/v1/signals/${signalId}/promote`,
        {},
      );
      void queryClient.invalidateQueries({ queryKey: ['signals'] });
      navigate('/incidents/new', { state: { prefill: response.prefill } });
    } catch (err) {
      setPromoteError(
        err instanceof ApiRequestError ? err.message : 'Could not promote this signal.',
      );
    } finally {
      setPromotingId(null);
    }
  };

  const columns: TableColumn<SignalListItem>[] = [
    {
      key: 'summary',
      header: 'Signal summary',
      render: (row) => (
        <a
          href={`/signals/${row.id}`}
          className="ep-signal-triage__summary-link"
          onClick={(e) => {
            e.preventDefault();
            navigate(`/signals/${row.id}`);
          }}
        >
          {row.summary}
        </a>
      ),
    },
    {
      key: 'source_feeds',
      header: 'Source feed(s)',
      render: (row) => (row.source_feeds && row.source_feeds.length > 0 ? row.source_feeds.join(', ') : '—'),
    },
    {
      key: 'confidence',
      header: 'Confidence',
      // Qualitative text + stated reason — NEVER a bare numeric or
      // bar-style indicator. This string concatenation is the entire
      // confidence display; no numeric value is ever derived or shown
      // anywhere in this column.
      render: (row) => `${row.confidence_label} \u2014 ${row.confidence_reason}`,
    },
    {
      key: 'detected_at',
      header: 'Detected at',
      render: (row) => formatDetectedAt(row.detected_at),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Table.StatusCell tone={STATUS_TONE[row.status]}>{row.status}</Table.StatusCell>,
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="ep-signal-triage__row-actions">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/signals/${row.id}`)}>
            Review
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={row.status !== 'New'}
            loading={promotingId === row.id}
            onClick={() => void handlePromote(row.id)}
          >
            Promote to incident
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={row.status !== 'New'}
            onClick={() => setDismissModalSignalId(row.id)}
          >
            Dismiss
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="ep-signal-triage">
      <PageHeader title="Signal triage queue" />

      {promoteError ? (
        <Alert tone="danger" title="Could not promote this signal">
          {promoteError}
        </Alert>
      ) : null}

      <div className="ep-signal-triage__toolbar">
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          label="Confidence"
          options={CONFIDENCE_OPTIONS}
          value={confidenceFilter}
          onChange={(e) => setConfidenceFilter(e.target.value)}
        />
      </div>

      <Card padded={false}>
        <Table
          caption="Signals"
          columns={columns}
          rows={items}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={
            isError
              ? { message: 'Could not load signals.', onRetry: () => void refetch() }
              : undefined
          }
          empty={{
            title: 'No signals match',
            children: 'Clear filters to see all signals, or check back after the next hazard-feed sweep.',
          }}
        />
      </Card>

      <Modal
        open={dismissModalSignalId !== null}
        title="Dismiss this signal?"
        onClose={closeDismissModal}
        footer={
          <>
            <Button variant="secondary" onClick={closeDismissModal}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDismiss()}
              loading={dismissing}
              disabled={dismissReason.trim().length === 0}
            >
              Dismiss signal
            </Button>
          </>
        }
      >
        {dismissError ? (
          <Alert tone="danger" title="Could not dismiss this signal">
            {dismissError}
          </Alert>
        ) : null}
        <TextField
          label="Reason"
          required
          multiline
          value={dismissReason}
          onChange={(e) => setDismissReason(e.target.value)}
        />
      </Modal>
    </div>
  );
}
