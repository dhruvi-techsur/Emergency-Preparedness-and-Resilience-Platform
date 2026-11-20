import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Button,
  Modal,
  TextField,
  Alert,
  Provenance,
  Badge,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';
import './SignalTriage.css';

type ConfidenceLabel = 'High' | 'Medium' | 'Low';
type SignalStatus = 'New' | 'Dismissed' | 'Promoted';

interface SignalSourceEventRow {
  source: string;
  occurred_at: string;
}

/** Matches backend's SignalListRow shape (ai-assist/signals.ts), extended
 * additively with source_events (this plan's own Rule-3 backend
 * extension — see signals.ts's doc comment) for this screen's per-event
 * Provenance chips. */
interface SignalListItem {
  id: string;
  summary: string;
  confidence_label: ConfidenceLabel;
  confidence_reason: string;
  detected_at: string;
  status: SignalStatus;
  source_feeds: string[] | null;
  source_events: SignalSourceEventRow[] | null;
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

const STATUS_TONE: Record<SignalStatus, BadgeTone> = {
  New: 'info',
  Dismissed: 'neutral',
  Promoted: 'success',
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * F9/S9.2 — Signal Detail. Routed `/signals/{id}`.
 *
 * 06-04's `GET /api/v1/signals` has no single-id lookup route (documented
 * Phase-6 scope boundary) — this screen fetches the full list and filters
 * client-side by id, the simpler of this plan's own two documented
 * options given 06-04's actual route shape.
 *
 * Renders one `Provenance` chip per entry in the signal's clustered
 * `signal_source_events` (06-04's `source_events`, this plan's own
 * additive backend extension — see signals.ts's doc comment). Since
 * `signal_source_events` has no `verified` boolean of its own (TechArch's
 * `hazard_layers` table, not this one, owns verification), this is a
 * documented DERIVED heuristic, not a literal DB column read: every chip
 * passes `verified={true}` UNLESS the signal's own `confidence_label`
 * is 'Low' AND there is exactly 1 contributing source, in which case
 * `verified={false}` with `confidence="Low — single source"` — a
 * reasonable stand-in given the schema has nothing more specific to read.
 *
 * Both header actions (Promote/Dismiss) reuse the EXACT SAME
 * promote-then-navigate / dismiss-then-modal flows as the Queue — no
 * action on this screen writes an operational record directly beyond the
 * signal's own `status` field, matching the mockup's explicit note.
 */
export function SignalDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [dismissModalOpen, setDismissModalOpen] = React.useState(false);
  const [dismissReason, setDismissReason] = React.useState('');
  const [dismissing, setDismissing] = React.useState(false);
  const [dismissError, setDismissError] = React.useState<string | null>(null);

  const [promoting, setPromoting] = React.useState(false);
  const [promoteError, setPromoteError] = React.useState<string | null>(null);

  // 06-04's GET /api/v1/signals has no single-id lookup — fetch the full
  // list and filter client-side, per this plan's own documented fallback.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['signals'],
    queryFn: () => apiGet<SignalsListResponse>('/api/v1/signals'),
  });

  const signal = (data?.items ?? []).find((s) => s.id === id);

  const closeDismissModal = () => {
    setDismissModalOpen(false);
    setDismissReason('');
    setDismissError(null);
  };

  const handleDismiss = async () => {
    if (!id || dismissReason.trim().length === 0) return;
    setDismissing(true);
    setDismissError(null);
    try {
      await apiPost(`/api/v1/signals/${id}/dismiss`, { reason: dismissReason.trim() });
      closeDismissModal();
      void queryClient.invalidateQueries({ queryKey: ['signals'] });
      await refetch();
    } catch (err) {
      setDismissError(
        err instanceof ApiRequestError ? err.message : 'Could not dismiss this signal.',
      );
    } finally {
      setDismissing(false);
    }
  };

  /** SAME promote-then-navigate logic as the Queue's own row action —
   * calls only the signals-triage /promote endpoint, then navigates to
   * the Create Incident form with the backend's pre-fill payload as
   * router state. Never calls any incident-creation endpoint directly. */
  const handlePromote = async () => {
    if (!id) return;
    setPromoting(true);
    setPromoteError(null);
    try {
      const response = await apiPost<SignalPromoteResponse>(`/api/v1/signals/${id}/promote`, {});
      void queryClient.invalidateQueries({ queryKey: ['signals'] });
      navigate('/incidents/new', { state: { prefill: response.prefill } });
    } catch (err) {
      setPromoteError(
        err instanceof ApiRequestError ? err.message : 'Could not promote this signal.',
      );
    } finally {
      setPromoting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="ep-signal-triage">
        <PageHeader title="Signal" />
        <p className="caption">Loading…</p>
      </div>
    );
  }

  if (isError || !signal) {
    return (
      <div className="ep-signal-triage">
        <PageHeader title="Signal" />
        <Alert
          tone="danger"
          title={isError ? 'Could not load this signal.' : "This signal no longer exists or you don't have access."}
          actions={
            isError ? (
              <Button variant="secondary" onClick={() => void refetch()}>
                Retry
              </Button>
            ) : undefined
          }
        />
      </div>
    );
  }

  // Derived-verification heuristic (documented above) — no literal
  // `verified` column exists on signal_source_events.
  const sourceEvents = signal.source_events ?? [];
  const isLowSingleSource = signal.confidence_label === 'Low' && sourceEvents.length === 1;

  return (
    <div className="ep-signal-triage">
      <PageHeader
        title={`Signal: ${signal.summary}`}
        status={<Badge tone={STATUS_TONE[signal.status]}>{signal.status}</Badge>}
        actions={[
          <Button
            key="dismiss"
            variant="ghost"
            disabled={signal.status !== 'New'}
            onClick={() => setDismissModalOpen(true)}
          >
            Dismiss
          </Button>,
          <Button
            key="promote"
            variant="secondary"
            disabled={signal.status !== 'New'}
            loading={promoting}
            onClick={() => void handlePromote()}
          >
            Promote to incident
          </Button>,
        ]}
      />

      {promoteError ? (
        <Alert tone="danger" title="Could not promote this signal">
          {promoteError}
        </Alert>
      ) : null}

      <Card>
        <p className="body">
          Confidence: {signal.confidence_label} — {signal.confidence_reason}
        </p>
        <p className="caption">Detected at: {formatTime(signal.detected_at)}</p>
      </Card>

      <Card title="Clustered source events">
        {sourceEvents.length > 0 ? (
          <div className="ep-signal-detail__provenance-list">
            {sourceEvents.map((event, i) => (
              <Provenance
                // eslint-disable-next-line react/no-array-index-key
                key={`${event.source}-${event.occurred_at}-${i}`}
                source={event.source}
                time={formatTime(event.occurred_at)}
                verified={!isLowSingleSource}
                confidence={isLowSingleSource ? 'Low — single source' : undefined}
              />
            ))}
          </div>
        ) : (
          <p className="caption">No clustered source events recorded for this signal.</p>
        )}
      </Card>

      <Modal
        open={dismissModalOpen}
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
