import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Badge,
  Button,
  TextField,
  Alert,
  EmptyState,
  type BadgeTone,
} from '@epmp/design-system';
import { apiGet, apiPost, apiPatch, ApiRequestError } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';

type SitrepStatus = 'Draft' | 'Approved';

interface TimelineEntrySummary {
  id: string;
  occurred_at: string;
  title: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  source: string;
}

interface SitrepContent {
  timeline: TimelineEntrySummary[];
  task_status_counts: Record<string, number>;
  resource_request_status_counts: Record<string, number>;
  narrative: string;
  ai_origin_narrative_draft_id?: string;
}

interface SitrepResponse {
  id: string;
  incident_id: string;
  status: SitrepStatus;
  content: SitrepContent;
  ai_origin: boolean;
}

interface AiDraftResponse {
  id: string;
  draft_text: string;
  sources: Array<{ source: string; time: string; confidence: string }>;
  confidence_label: string;
}

interface IncidentSummary {
  id: string;
  name: string;
}

const STATUS_TONE: Record<SitrepStatus, BadgeTone> = {
  Draft: 'neutral',
  Approved: 'success',
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

/**
 * F7 S7.2 — SITREP Generator. Routed `/incidents/{id}/sitreps/new`.
 *
 * On mount, automatically fires `POST /api/v1/incidents/{id}/sitreps` — the
 * FRD's "auto-assemble on demand" means the generation call itself needs
 * no form submission to TRIGGER, only incident_id (already in the route).
 * The 3 auto-pulled sections below (Timeline/task-status/resource-request-
 * status) render strictly READ-ONLY, per the mockup's "auto-pulled
 * sections (read-only, structured)" layout — there is no edit/select
 * control anywhere in their markup. The narrative field and the
 * Draft-with-AI panel are the ONLY user-editable inputs on this page.
 *
 * The AI-draft approve-before-insert flow mirrors 04-05's
 * ComposeNotification.tsx exactly (POST /api/v1/ai-drafts -> render
 * Provenance-chip panel -> POST .../approve -> copy draft_text into the
 * field) — kept as a local inline implementation here rather than a
 * shared extracted helper, since the two pages' surrounding state shapes
 * differ enough (single narrative field vs. a full compose wizard) that
 * factoring out a generic helper would need its own small interface this
 * plan's budget doesn't cover; documented here as the discretion call.
 */
export function SitrepGenerator(): JSX.Element {
  const { id: incidentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sitrep, setSitrep] = React.useState<SitrepResponse | null>(null);
  const [generating, setGenerating] = React.useState(true);
  const [generateError, setGenerateError] = React.useState<string | null>(null);

  const [narrative, setNarrative] = React.useState('');
  const [aiDraft, setAiDraft] = React.useState<AiDraftResponse | null>(null);
  const [aiDraftId, setAiDraftId] = React.useState<string | null>(null);
  const [aiOrigin, setAiOrigin] = React.useState(false);
  const [draftingAi, setDraftingAi] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);

  const [savingDraft, setSavingDraft] = React.useState(false);
  const [finalizing, setFinalizing] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);

  const incidentQuery = useQuery({
    queryKey: ['incident-summary-for-sitrep', incidentId],
    queryFn: () => apiGet<IncidentSummary>(`/api/v1/incidents/${incidentId}`),
    enabled: Boolean(incidentId),
  });

  // Fires automatically on mount — this IS the "auto-assemble on demand"
  // trigger. A ref guards against React.StrictMode's dev-mode double-
  // invoke generating two sitrep rows for the same page load.
  const hasGeneratedRef = React.useRef(false);
  React.useEffect(() => {
    if (hasGeneratedRef.current || !incidentId) return;
    hasGeneratedRef.current = true;

    void (async () => {
      setGenerating(true);
      setGenerateError(null);
      try {
        const created = await apiPost<SitrepResponse>(`/api/v1/incidents/${incidentId}/sitreps`, {});
        setSitrep(created);
        setNarrative(created.content.narrative ?? '');
        setAiOrigin(created.ai_origin);
        if (created.content.ai_origin_narrative_draft_id) {
          setAiDraftId(created.content.ai_origin_narrative_draft_id);
        }
      } catch (err) {
        setGenerateError(
          err instanceof ApiRequestError ? err.message : 'Could not generate this situation report.',
        );
      } finally {
        setGenerating(false);
      }
    })();
  }, [incidentId]);

  const handleDraftWithAi = async () => {
    if (!sitrep) return;
    setDraftingAi(true);
    setAiError(null);
    try {
      const draft = await apiPost<AiDraftResponse>('/api/v1/ai-drafts', {
        target_feature: 'sitrep',
        target_field: 'narrative',
        context: `Incident ${incidentQuery.data?.name ?? sitrep.incident_id} situation report narrative`,
        requesting_user_id: user.id,
      });
      setAiDraft(draft);
      setAiDraftId(draft.id);
    } catch (err) {
      setAiError(err instanceof ApiRequestError ? err.message : 'Could not draft with AI.');
    } finally {
      setDraftingAi(false);
    }
  };

  const handleApproveAiDraft = async () => {
    if (!aiDraft) return;
    try {
      await apiPost(`/api/v1/ai-drafts/${aiDraft.id}/approve`, { approver_id: user.id });
      // Narrative is populated ONLY from this explicit Approve click — the
      // field is never auto-populated otherwise, per F5/F7's shared hard
      // rule (04-05's ComposeNotification.tsx documents the identical
      // invariant).
      setNarrative(aiDraft.draft_text);
      setAiOrigin(true);
      setAiDraft(null);
    } catch (err) {
      setAiError(err instanceof ApiRequestError ? err.message : 'Could not approve this draft.');
    }
  };

  const handleDiscardAiDraft = () => {
    if (aiDraft) {
      void apiPost(`/api/v1/ai-drafts/${aiDraft.id}/discard`, {}).catch(() => {});
    }
    setAiDraft(null);
  };

  const buildContentPayload = () => {
    if (!sitrep) return {};
    return { ...sitrep.content, narrative };
  };

  const handleSaveAsDraft = async () => {
    if (!sitrep || !incidentId) return;
    setSavingDraft(true);
    setActionError(null);
    try {
      const updated = await apiPatch<SitrepResponse>(
        `/api/v1/incidents/${incidentId}/sitreps/${sitrep.id}`,
        { content: buildContentPayload() },
      );
      setSitrep(updated);
    } catch (err) {
      setActionError(err instanceof ApiRequestError ? err.message : 'Could not save this draft.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleApproveAndFinalize = async () => {
    if (!sitrep || !incidentId) return;
    setFinalizing(true);
    setActionError(null);
    try {
      const updated = await apiPatch<SitrepResponse>(
        `/api/v1/incidents/${incidentId}/sitreps/${sitrep.id}`,
        { content: buildContentPayload(), finalize: true },
      );
      setSitrep(updated);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'AIDRAFT_UNAPPROVED_WRITE_BLOCKED') {
        setActionError(err.message);
        return;
      }
      setActionError(err instanceof ApiRequestError ? err.message : 'Could not finalize this report.');
    } finally {
      setFinalizing(false);
    }
  };

  if (generating) {
    return (
      <div className="ep-sitrep-generator" aria-busy="true">
        <PageHeader title="Generate situation report" status={<Badge tone="neutral">Draft</Badge>} />
      </div>
    );
  }

  if (generateError || !sitrep) {
    return (
      <div className="ep-sitrep-generator">
        <EmptyState
          title="Could not generate this situation report"
          action={
            <Button variant="primary" onClick={() => navigate(`/incidents/${incidentId}`)}>
              Back to incident
            </Button>
          }
        >
          {generateError ?? 'Something went wrong.'}
        </EmptyState>
      </div>
    );
  }

  const isApproved = sitrep.status === 'Approved';
  const taskCounts = Object.entries(sitrep.content.task_status_counts ?? {});
  const resourceCounts = Object.entries(sitrep.content.resource_request_status_counts ?? {});

  return (
    <div className="ep-sitrep-generator">
      <PageHeader
        title="Generate situation report"
        subtitle={incidentQuery.data?.name}
        status={<Badge tone={STATUS_TONE[sitrep.status]}>{sitrep.status}</Badge>}
        crumbs={[{ label: 'Incident', href: `/incidents/${incidentId}` }, { label: 'Generate SITREP' }]}
      />

      {/* Auto-pulled sections — READ-ONLY, structurally no edit/select
          control of any kind anywhere in this block. */}
      <Card title="Current timeline">
        {sitrep.content.timeline.length === 0 ? (
          <p className="caption">No timeline entries yet.</p>
        ) : (
          <ul className="ep-sitrep-generator__timeline-list">
            {sitrep.content.timeline.slice(0, 10).map((entry) => (
              <li key={entry.id}>
                <span className="data">{formatDateTime(entry.occurred_at)}</span> — {entry.title}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Task status">
        {taskCounts.length === 0 ? (
          <p className="caption">No tasks linked to this incident yet.</p>
        ) : (
          <div className="ep-sitrep-generator__count-row">
            {taskCounts.map(([status, count]) => (
              <Badge key={status} tone="neutral">
                {status}: {count}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <Card title="Resource-request status">
        {resourceCounts.length === 0 ? (
          <p className="caption">No resource requests linked to this incident yet.</p>
        ) : (
          <div className="ep-sitrep-generator__count-row">
            {resourceCounts.map(([status, count]) => (
              <Badge key={status} tone="neutral">
                {status}: {count}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      <Card title="Narrative summary">
        {aiError ? (
          <Alert tone="danger" title="Could not complete the AI draft action">
            {aiError}
          </Alert>
        ) : null}

        {aiDraft ? (
          <Card title="AI-drafted narrative (not yet inserted)">
            <p>{aiDraft.draft_text}</p>
            <p className="caption">
              {aiDraft.sources.map((s) => `${s.source} · ${s.confidence}`).join(', ')}
            </p>
            <div className="ep-sitrep-generator__ai-actions">
              <Button variant="ghost" onClick={handleDiscardAiDraft}>
                Discard
              </Button>
              <Button variant="primary" onClick={() => void handleApproveAiDraft()}>
                Approve
              </Button>
            </div>
          </Card>
        ) : null}

        <TextField
          label="Narrative"
          multiline
          disabled={isApproved}
          hint="The only free-text, user-authored field on this report"
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
        />

        {!isApproved ? (
          <Button
            variant="secondary"
            onClick={() => void handleDraftWithAi()}
            loading={draftingAi}
          >
            Draft with AI
          </Button>
        ) : null}
      </Card>

      <Card title="Preview">
        <div className="ep-sitrep-generator__preview">
          <h4>Current timeline</h4>
          <ul>
            {sitrep.content.timeline.slice(0, 10).map((entry) => (
              <li key={entry.id}>{entry.title}</li>
            ))}
          </ul>
          <h4>Task status</h4>
          <p>{taskCounts.map(([s, c]) => `${s}: ${c}`).join(', ') || 'None'}</p>
          <h4>Resource-request status</h4>
          <p>{resourceCounts.map(([s, c]) => `${s}: ${c}`).join(', ') || 'None'}</p>
          <h4>Narrative</h4>
          <p>{narrative || 'No narrative written yet.'}</p>
        </div>
      </Card>

      {actionError ? (
        <Alert tone="danger" title="Could not save this report">
          {actionError}
        </Alert>
      ) : null}

      {!isApproved ? (
        <div className="ep-sitrep-generator__footer">
          <Button variant="secondary" onClick={() => void handleSaveAsDraft()} loading={savingDraft}>
            Save as draft
          </Button>
          <Button variant="primary" onClick={() => void handleApproveAndFinalize()} loading={finalizing}>
            Approve and finalize
          </Button>
        </div>
      ) : (
        <Alert tone="success" title="This report is finalized">
          Approved SITREPs are read-only. Create an addendum instead of editing this one.
        </Alert>
      )}
    </div>
  );
}
