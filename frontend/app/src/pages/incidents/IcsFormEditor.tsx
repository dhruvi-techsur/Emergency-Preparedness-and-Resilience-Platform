import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  TextField,
  Button,
  Badge,
  Alert,
  AIDraft,
  type BadgeTone,
  type AIDraftSource,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';
import './IcsFormEditor.css';

type IcsFormStatus = 'Draft' | 'Approved';

interface IcsFormContent {
  narrative?: string;
}

interface IcsFormResponse {
  id: string;
  incident_id: string;
  form_type: string;
  status: IcsFormStatus;
  content: IcsFormContent;
  ai_origin: boolean;
  approved_by?: { id: string; name: string };
  approved_at?: string;
}

interface AiDraftResponse {
  id: string;
  draft_text: string;
  sources: AIDraftSource[];
  confidence_label: string;
}

const STATUS_TONE: Record<IcsFormStatus, BadgeTone> = {
  Draft: 'neutral',
  Approved: 'success',
};

/** This plan builds a SINGLE representative form type ('ICS-201') per
 * S9.3's own "Situation summary" narrative-field example — a full
 * multi-step-form/multiple-form-type editor is out of this 2-3-task
 * plan's budget. The underlying `ics_forms.form_type` column accepts any
 * string, so adding more form types later is a data-only extension, not
 * a structural change. */
const FORM_TYPE = 'ICS-201';

/**
 * S9.3/Screen-07 — ICS Form / Checklist Editor. Routed
 * `/incidents/{incidentId}/forms/{formId}` (an existing form) or
 * `/incidents/{incidentId}/forms/new` (a fresh, unsaved ICS-201).
 *
 * The frontend half of 06-01's `ics_forms` backend — embeds the `AIDraft`
 * component exactly per the mockup's layout: "Draft with AI" button below
 * the narrative field, the AIDraft panel rendering BELOW (never inside)
 * that field, and a real end-to-end approve flow that writes the final
 * text into the field AND logs the Timeline entry via 06-01's
 * governance-guarded backend, all from a SINGLE click of AIDraft's own
 * Approve button.
 *
 * `narrativeText` is the field's OWN value, entirely independent of
 * `activeDraft` — requesting/discarding a draft never touches it. The
 * ONLY point in this component where draft text reaches the field is
 * inside `handleApprove`, after `POST /api/v1/ai-drafts/{id}/approve`
 * (06-03's governance gate) has already succeeded.
 */
export function IcsFormEditor(): JSX.Element {
  const { incidentId, formId } = useParams<{ incidentId: string; formId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formRow, setFormRow] = React.useState<IcsFormResponse | null>(null);
  const [narrativeText, setNarrativeText] = React.useState('');
  const [activeDraft, setActiveDraft] = React.useState<AiDraftResponse | null>(null);
  const [editingDraft, setEditingDraft] = React.useState(false);
  const [editingDraftValue, setEditingDraftValue] = React.useState('');
  const [draftingAi, setDraftingAi] = React.useState(false);
  const [aiUnavailable, setAiUnavailable] = React.useState(false);
  const [actionError, setActionError] = React.useState<string | null>(null);
  const [approving, setApproving] = React.useState(false);

  const formsQuery = useQuery({
    queryKey: ['ics-forms', incidentId],
    queryFn: () => apiGet<IcsFormResponse[]>(`/api/v1/incidents/${incidentId}/ics-forms`),
    enabled: Boolean(incidentId),
  });

  // Hydrate from an already-existing ICS-201 form on mount/refetch (never
  // auto-creates one — POST only fires on first explicit Approve, so a
  // mere page visit never litters the DB with an empty draft row).
  React.useEffect(() => {
    if (formRow) return; // never clobber local state once a row exists this session
    const existing = (formsQuery.data ?? []).find((f) => f.form_type === FORM_TYPE);
    if (existing) {
      setFormRow(existing);
      setNarrativeText(existing.content.narrative ?? '');
    }
  }, [formsQuery.data, formRow]);

  const incidentQuery = useQuery({
    queryKey: ['incident-summary-for-ics-form', incidentId],
    queryFn: () => apiGet<{ id: string; name: string }>(`/api/v1/incidents/${incidentId}`),
    enabled: Boolean(incidentId),
  });

  const status: IcsFormStatus = formRow?.status ?? 'Draft';
  const isApproved = status === 'Approved';

  const handleDraftWithAi = async () => {
    setDraftingAi(true);
    setAiUnavailable(false);
    setActionError(null);
    try {
      const draft = await apiPost<AiDraftResponse>('/api/v1/ai-drafts', {
        target_feature: 'ics_form',
        target_field: 'narrative',
        context: narrativeText || `Draft an ICS-201 situation summary for this incident`,
        requesting_user_id: user.id,
      });
      // Crucially: this does NOT touch narrativeText — the TextField's
      // displayed value is completely unaffected by this call.
      setActiveDraft(draft);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 503) {
        setAiUnavailable(true);
      } else {
        setActionError(
          err instanceof ApiRequestError ? err.message : 'Could not draft with AI.',
        );
      }
    } finally {
      setDraftingAi(false);
    }
  };

  const handleDiscard = async () => {
    if (!activeDraft) return;
    try {
      await apiPost(`/api/v1/ai-drafts/${activeDraft.id}/discard`, {});
    } catch {
      // Discard is a soft, best-effort audit note — narrativeText was
      // never touched either way, so surfacing a transient failure here
      // would only block the user from requesting a fresh draft.
    } finally {
      // The narrative field is untouched — it was never touched in the
      // first place.
      setActiveDraft(null);
      setEditingDraft(false);
    }
  };

  /**
   * A SINGLE user action (clicking "Approve" inside the AIDraft panel)
   * that cascades through BOTH governance-sensitive endpoints before
   * returning control to the user:
   *   1. ai-drafts approve (06-03) — the ONLY place ai_drafts.approved_by
   *      gets set.
   *   2. Only after that succeeds: update narrativeText + persist the
   *      ics_forms row (create on first save, since 06-01 defines no
   *      PATCH — a known, documented Phase-6 simplification).
   *   3. ics-forms-level approve (06-01) — the ONLY place that writes the
   *      "ICS form approved" Timeline entry.
   *   4. Collapse the AIDraft panel.
   *   5. Refetch the incident's Timeline so the new entry is visible
   *      without a manual reload.
   */
  const handleApprove = async (finalText: string) => {
    if (!activeDraft || !incidentId) return;
    setApproving(true);
    setActionError(null);
    try {
      // 1. ai-drafts approve — the ONLY place ai_drafts.approved_by is set.
      await apiPost(`/api/v1/ai-drafts/${activeDraft.id}/approve`, {
        approver_id: user.id,
        edited_text: finalText !== activeDraft.draft_text ? finalText : undefined,
      });

      // 2. Only after that succeeds does the draft text reach the field —
      // this is the ONE and ONLY point in this entire component where
      // that happens.
      setNarrativeText(finalText);

      const createdOrUpdated = await apiPost<IcsFormResponse>(
        `/api/v1/incidents/${incidentId}/ics-forms`,
        {
          form_type: FORM_TYPE,
          content: { narrative: finalText },
          ai_origin: true,
          ai_draft_id: activeDraft.id,
        },
      );
      setFormRow(createdOrUpdated);

      // 3. ics-forms-level approve — the ONLY place that writes the "ICS
      // form approved" Timeline entry, in this SAME click.
      await apiPost(
        `/api/v1/incidents/${incidentId}/ics-forms/${createdOrUpdated.id}/approve`,
        { approved_by: user.id },
      );

      // 4. Panel collapses.
      setActiveDraft(null);
      setEditingDraft(false);

      // 5. Refetch so the new Timeline entry is visible without a reload.
      void queryClient.invalidateQueries({ queryKey: ['incident-timeline', incidentId] });
      void queryClient.invalidateQueries({ queryKey: ['ics-forms', incidentId] });
      await formsQuery.refetch();
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError ? err.message : 'Could not approve this draft.',
      );
    } finally {
      setApproving(false);
    }
  };

  /**
   * "Approve form" — separate from the AIDraft panel's own internal
   * Approve, exists for the ONE case handleApprove's cascade does not
   * cover: a narrative written entirely manually, with no AI draft
   * requested at all. Calls the SAME ics-forms-level approve endpoint
   * directly for that manual-only path.
   */
  const handleApproveManual = async () => {
    if (!incidentId || !formRow) return;
    setApproving(true);
    setActionError(null);
    try {
      const approved = await apiPost<IcsFormResponse>(
        `/api/v1/incidents/${incidentId}/ics-forms/${formRow.id}/approve`,
        { approved_by: user.id },
      );
      setFormRow(approved);
      void queryClient.invalidateQueries({ queryKey: ['incident-timeline', incidentId] });
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError ? err.message : 'Could not approve this form.',
      );
    } finally {
      setApproving(false);
    }
  };

  const handleSaveManualDraft = async () => {
    if (!incidentId) return;
    setActionError(null);
    try {
      const saved = await apiPost<IcsFormResponse>(`/api/v1/incidents/${incidentId}/ics-forms`, {
        form_type: FORM_TYPE,
        content: { narrative: narrativeText },
        ai_origin: false,
      });
      setFormRow(saved);
      void queryClient.invalidateQueries({ queryKey: ['ics-forms', incidentId] });
    } catch (err) {
      setActionError(
        err instanceof ApiRequestError ? err.message : 'Could not save this form.',
      );
    }
  };

  const canApproveManually = Boolean(formRow) && narrativeText.trim().length > 0 && !isApproved;

  return (
    <div className="ep-ics-form-editor">
      <PageHeader
        title={`${FORM_TYPE}: Incident Briefing`}
        subtitle={incidentQuery.data?.name}
        status={<Badge tone={STATUS_TONE[status]}>{status}</Badge>}
        crumbs={[
          { label: 'Incident', href: `/incidents/${incidentId}` },
          { label: FORM_TYPE },
        ]}
      />

      {aiUnavailable ? (
        <Alert tone="info" title="AI drafting is temporarily unavailable. You can still write this manually." />
      ) : null}

      {actionError ? (
        <Alert tone="danger" title="This action could not be completed">
          {actionError}
        </Alert>
      ) : null}

      <Card title="Situation summary">
        <TextField
          label="Narrative"
          multiline
          rows={6}
          disabled={isApproved}
          hint="The official situation summary for this incident briefing"
          value={narrativeText}
          onChange={(e) => setNarrativeText(e.target.value)}
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

        {/* Rendered as a separate DOM sibling directly below the
            narrative TextField — never wrapped inside it, matching the
            mockup's explicit "never inside it" placement rule. */}
        {activeDraft ? (
          <AIDraft
            draftText={activeDraft.draft_text}
            sources={activeDraft.sources}
            editing={editingDraft}
            editingValue={editingDraftValue}
            onEditingValueChange={setEditingDraftValue}
            onEdit={() => {
              setEditingDraft(true);
              setEditingDraftValue(activeDraft.draft_text);
            }}
            onDiscard={() => void handleDiscard()}
            onApprove={(finalText) => void handleApprove(finalText)}
          />
        ) : null}
      </Card>

      <div className="ep-ics-form-editor__footer">
        {!isApproved ? (
          <Button
            variant="secondary"
            onClick={() => void handleSaveManualDraft()}
          >
            Save draft
          </Button>
        ) : null}
        <Button
          variant="primary"
          disabled={!canApproveManually || approving}
          loading={approving}
          onClick={() => void handleApproveManual()}
        >
          Approve form
        </Button>
      </div>
    </div>
  );
}
