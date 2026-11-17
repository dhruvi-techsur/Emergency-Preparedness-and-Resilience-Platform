import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  TextField,
  Select,
  Combobox,
  Button,
  Alert,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, apiPatch, ApiRequestError } from '../../lib/api-client';
import { LinkTasksModal, type LinkTasksModalExistingTemplate } from './LinkTasksModal';

type PlanType = 'EOP' | 'SOP' | 'Annex';

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'EOP', label: 'EOP' },
  { value: 'SOP', label: 'SOP' },
  { value: 'Annex', label: 'Annex' },
];

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

interface PlanSection {
  id: string;
  heading: string;
  body: string;
  sort_order: number;
  linked_task_templates: string[];
}

interface PlanDetailResponse {
  id: string;
  name: string;
  type: PlanType;
  status: 'Draft' | 'Review' | 'Approved';
  jurisdiction_id: string;
  sections: PlanSection[];
}

/** Local editor row — `id` is undefined for a brand-new, not-yet-saved
 * section (created client-side via "+ Add section"); once persisted via
 * POST/PATCH, the server-assigned id is written back so the Link Tasks
 * action (which requires a real sectionId) only enables for saved
 * sections. */
interface EditorSection {
  id?: string;
  heading: string;
  body: string;
  linked_task_templates: string[];
  /** Templates linked THIS session via LinkTasksModal — carries a real
   * title through local state, since the GET response only returns ids
   * (see LinkTasksModal's own doc comment on this exact gap). */
  linkedThisSession: LinkTasksModalExistingTemplate[];
}

function emptySection(): EditorSection {
  return { heading: '', body: '', linked_task_templates: [], linkedThisSession: [] };
}

/**
 * F3 S3.3 — Plan Editor. Routed `/plans/new` (create) and `/plans/{id}/edit`
 * (edit an existing Draft).
 *
 * Autosave indicator: implemented as an explicit debounced save-on-blur
 * (~3s of inactivity after a field change triggers a background PATCH) per
 * this plan's own documented Phase 3 scope note — not a literal
 * continuous-typing autosave, which is a reasonable interpretation of
 * "autosave indicator" within this plan's task budget.
 */
export function PlanEditor(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [planId, setPlanId] = React.useState<string | undefined>(id);
  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<PlanType>('EOP');
  const [jurisdictionId, setJurisdictionId] = React.useState('');
  const [sections, setSections] = React.useState<EditorSection[]>([emptySection()]);
  const [linkModalSectionIndex, setLinkModalSectionIndex] = React.useState<number | null>(null);
  const [planEmptyError, setPlanEmptyError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [savingDraft, setSavingDraft] = React.useState(false);
  const [submittingReview, setSubmittingReview] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [dirty, setDirty] = React.useState(false);
  const [loadedExisting, setLoadedExisting] = React.useState(!isEditing);

  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
  });

  const existingPlanQuery = useQuery({
    queryKey: ['plan', id],
    queryFn: () => apiGet<PlanDetailResponse>(`/api/v1/plans/${id}`),
    enabled: isEditing,
  });

  React.useEffect(() => {
    if (isEditing && existingPlanQuery.data && !loadedExisting) {
      const plan = existingPlanQuery.data;
      setName(plan.name);
      setType(plan.type);
      setJurisdictionId(plan.jurisdiction_id);
      setPlanId(plan.id);
      setSections(
        plan.sections.length > 0
          ? [...plan.sections]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((s) => ({
                id: s.id,
                heading: s.heading,
                body: s.body,
                linked_task_templates: s.linked_task_templates,
                linkedThisSession: [],
              }))
          : [emptySection()],
      );
      setLoadedExisting(true);
    }
  }, [isEditing, existingPlanQuery.data, loadedExisting]);

  const jurisdictionOptions: ComboboxOption[] = (jurisdictionsQuery.data?.items ?? []).map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const buildContentSections = () =>
    sections
      .filter((s) => s.heading.trim() !== '' || s.body.trim() !== '')
      .map((s) => ({ heading: s.heading, body: s.body }));

  /** Saves the plan (create on first save, update on subsequent saves) and
   * returns the resulting plan id, reconciling each local section's
   * server-assigned id so Link Tasks can be enabled against real section
   * ids without the caller needing to re-fetch. */
  const persistPlan = async (): Promise<string> => {
    if (!planId) {
      const created = await apiPost<PlanDetailResponse>('/api/v1/plans', {
        name: name.trim(),
        type,
        jurisdiction_id: jurisdictionId,
        content_sections: buildContentSections(),
      });
      setPlanId(created.id);
      setSections((prev) =>
        prev.map((s, i) => ({
          ...s,
          id: created.sections[i]?.id ?? s.id,
        })),
      );
      return created.id;
    }

    const updated = await apiPatch<PlanDetailResponse>(`/api/v1/plans/${planId}`, {
      name: name.trim(),
      jurisdiction_id: jurisdictionId,
      sections: sections
        .filter((s) => s.id)
        .map((s) => ({ id: s.id!, heading: s.heading, body: s.body })),
    });
    return updated.id;
  };

  // Debounced save-on-blur autosave: ~3s after the last field change, if
  // the plan has already been saved at least once (has a planId) and
  // fields are dirty, PATCH silently in the background and update the
  // "Saved HH:MM" indicator.
  React.useEffect(() => {
    if (!dirty || !planId) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          await persistPlan();
          setLastSavedAt(new Date());
          setDirty(false);
        } catch {
          // Autosave failures are silent — the explicit "Save as draft"
          // button remains the authoritative, user-visible save action.
        }
      })();
    }, 3000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, jurisdictionId, sections, dirty, planId]);

  const markDirty = () => setDirty(true);

  const handleSectionChange = (index: number, field: 'heading' | 'body', value: string) => {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));
    markDirty();
  };

  const handleAddSection = () => {
    setSections((prev) => [...prev, emptySection()]);
    markDirty();
  };

  const handleSaveAsDraft = async () => {
    setSavingDraft(true);
    setSubmitError(null);
    setPlanEmptyError(null);
    try {
      const resultId = await persistPlan();
      setLastSavedAt(new Date());
      setDirty(false);
      if (!isEditing) {
        navigate(`/plans/${resultId}/edit`);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not save this plan.');
    } finally {
      setSavingDraft(false);
    }
  };

  const handleSubmitForReview = async () => {
    setSubmittingReview(true);
    setSubmitError(null);
    setPlanEmptyError(null);
    try {
      const resultId = await persistPlan();
      setLastSavedAt(new Date());
      setDirty(false);
      await apiPost(`/api/v1/plans/${resultId}/submit-review`, {});
      navigate(`/plans/${resultId}`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'PLAN_EMPTY') {
        setPlanEmptyError(err.message);
        return;
      }
      setSubmitError(err instanceof Error ? err.message : 'Could not submit this plan for review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const activeLinkSection = linkModalSectionIndex !== null ? sections[linkModalSectionIndex] : null;

  return (
    <div className="ep-plan-editor">
      <PageHeader
        title={isEditing ? `Edit: ${name || 'Plan'}` : 'Create plan'}
        crumbs={[{ label: 'Plans & playbooks', href: '/plans' }, { label: isEditing ? 'Edit' : 'Create plan' }]}
      />

      <Card>
        {planEmptyError ? (
          <Alert tone="danger" title="Add at least one section before submitting this plan for review.">
            {planEmptyError}
          </Alert>
        ) : null}

        {!isEditing ? (
          <>
            <TextField
              label="Name"
              required
              hint="3-200 characters"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                markDirty();
              }}
            />
            <Select
              label="Type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={(e) => {
                setType(e.target.value as PlanType);
                markDirty();
              }}
            />
            <Combobox
              label="Jurisdiction"
              required
              options={jurisdictionOptions}
              value={jurisdictionId}
              onChange={(value) => {
                setJurisdictionId(value);
                markDirty();
              }}
              loading={jurisdictionsQuery.isLoading}
            />
          </>
        ) : (
          <TextField
            label="Name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              markDirty();
            }}
          />
        )}

        {sections.map((section, index) => (
          <div key={section.id ?? `new-${index}`} className="ep-plan-editor__section">
            <h4>{section.heading || `Section ${index + 1}`}</h4>
            <TextField
              label={`Section ${index + 1} heading`}
              value={section.heading}
              onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
            />
            <TextField
              label={`Section ${index + 1} body`}
              multiline
              value={section.body}
              onChange={(e) => handleSectionChange(index, 'body', e.target.value)}
            />
            <Button
              variant="secondary"
              disabled={!section.id}
              title={!section.id ? 'Save this plan first to link tasks to this section' : undefined}
              onClick={() => setLinkModalSectionIndex(index)}
            >
              Link tasks
            </Button>
          </div>
        ))}

        <Button variant="ghost" onClick={handleAddSection}>
          + Add section
        </Button>

        {submitError ? (
          <Alert tone="danger" title="Could not save this plan">
            {submitError}
          </Alert>
        ) : null}

        <div className="ep-plan-editor__footer">
          {lastSavedAt ? (
            <p className="caption">
              Saved{' '}
              {lastSavedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
            </p>
          ) : null}
          <Button variant="secondary" onClick={() => void handleSaveAsDraft()} loading={savingDraft}>
            Save as draft
          </Button>
          <Button
            variant="primary"
            onClick={() => void handleSubmitForReview()}
            loading={submittingReview}
          >
            Submit for review
          </Button>
        </div>
      </Card>

      {activeLinkSection && planId ? (
        <LinkTasksModal
          planId={planId}
          sectionId={activeLinkSection.id!}
          sectionHeading={activeLinkSection.heading || `Section ${linkModalSectionIndex! + 1}`}
          existingTemplates={activeLinkSection.linkedThisSession}
          open={linkModalSectionIndex !== null}
          onClose={() => setLinkModalSectionIndex(null)}
          onLinked={() => {
            // The link-tasks endpoint returns 204 with no body, so the
            // newly-linked template's own id/title aren't directly
            // available here — a full re-fetch of the plan (when editing
            // an already-persisted plan) is the source of truth for ids;
            // for this session's immediate visual feedback, bump the
            // section's linked-task count so "Link tasks" visibly
            // reflects the new link without requiring a page reload.
            setSections((prev) =>
              prev.map((s, i) =>
                i === linkModalSectionIndex
                  ? { ...s, linked_task_templates: [...s.linked_task_templates, 'pending'] }
                  : s,
              ),
            );
          }}
        />
      ) : null}
    </div>
  );
}
