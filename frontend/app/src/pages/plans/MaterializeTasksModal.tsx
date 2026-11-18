import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, Button, Combobox, Checkbox, Alert, type ComboboxOption } from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

interface IncidentListItem {
  id: string;
  name: string;
}

interface IncidentsListResponse {
  items: IncidentListItem[];
}

interface MaterializeResult {
  created: Array<{ id: string; title: string; status: string }>;
  skipped: Array<{ template_id: string; reason: string }>;
}

export interface MaterializeTasksModalSection {
  id: string;
  heading: string;
  linked_task_templates: string[];
}

export interface MaterializeTasksModalProps {
  planId: string;
  sections: MaterializeTasksModalSection[];
  open: boolean;
  onClose: () => void;
}

/** Human string per `materialize.ts`'s documented skip reason codes — never
 * the raw code. Unknown/future codes fall back to a generic sentence rather
 * than leaking a code the user can't act on. */
const SKIP_REASON_TEXT: Record<string, string> = {
  NO_USER_FOR_ROLE: 'No user currently holds the role this template defaults to.',
};

function skipReasonText(reason: string): string {
  return SKIP_REASON_TEXT[reason] ?? 'This template was skipped.';
}

/**
 * F3 S3.5 / 03-10 gap closure — Materialize Tasks Modal.
 *
 * Closes UAT gap ref "uat:1": the one real UI entry point for
 * `POST /api/v1/plans/{id}/materialize-tasks` (03-03's already-hardened
 * backend endpoint). Opened from `PlanDetail.tsx`'s "Materialize tasks"
 * PageHeader action, gated there to `plan.status === 'Approved'` plus at
 * least one section holding a linked template.
 *
 * Section checkboxes are an opt-in NARROWING filter (default: all eligible
 * sections' templates materialize) — matches the FRD's "offered... rather
 * than requiring tasks to be written from scratch" one-click framing. Only
 * sections with >=1 linked template render a checkbox at all, mirroring
 * `materialize.ts`'s own `section_ids` join through `plan_task_templates`.
 */
export function MaterializeTasksModal({
  planId,
  sections,
  open,
  onClose,
}: MaterializeTasksModalProps): JSX.Element {
  const [incidentId, setIncidentId] = React.useState('');
  const [selectedSectionIds, setSelectedSectionIds] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<MaterializeResult | null>(null);

  React.useEffect(() => {
    if (open) {
      setIncidentId('');
      setSelectedSectionIds([]);
      setSubmitting(false);
      setError(null);
      setResult(null);
    }
  }, [open]);

  const incidentsQuery = useQuery({
    queryKey: ['incidents-for-materialize-tasks'],
    queryFn: () => apiGet<IncidentsListResponse>('/api/v1/incidents?page_size=1000'),
    enabled: open,
  });

  const incidentOptions: ComboboxOption[] = (incidentsQuery.data?.items ?? []).map((i) => ({
    value: i.id,
    label: i.name,
  }));

  const eligibleSections = sections.filter((s) => s.linked_task_templates.length > 0);

  const toggleSection = (sectionId: string, checked: boolean) => {
    setSelectedSectionIds((prev) =>
      checked ? [...prev, sectionId] : prev.filter((id) => id !== sectionId),
    );
  };

  const handleSubmit = async () => {
    if (!incidentId) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await apiPost<MaterializeResult>(`/api/v1/plans/${planId}/materialize-tasks`, {
        incident_id: incidentId,
        ...(selectedSectionIds.length > 0 ? { section_ids: selectedSectionIds } : {}),
      });
      setResult(response);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Could not materialize tasks. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Materialize tasks"
      onClose={onClose}
      footer={
        result ? (
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => void handleSubmit()}
              loading={submitting}
              disabled={!incidentId}
            >
              Materialize tasks
            </Button>
          </>
        )
      }
    >
      {result ? (
        <>
          <Alert tone="success" title={`${result.created.length} task${result.created.length === 1 ? '' : 's'} created`}>
            {result.created.length > 0 ? (
              <ul>
                {result.created.map((task) => (
                  <li key={task.id}>{task.title}</li>
                ))}
              </ul>
            ) : null}
          </Alert>
          {result.skipped.length > 0 ? (
            <Alert
              tone="warning"
              title={`${result.skipped.length} template${result.skipped.length === 1 ? '' : 's'} skipped`}
            >
              <ul>
                {result.skipped.map((s) => (
                  <li key={s.template_id}>{skipReasonText(s.reason)}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
        </>
      ) : (
        <>
          {error ? (
            <Alert tone="danger" title="Could not materialize tasks">
              {error}
            </Alert>
          ) : null}

          <Combobox
            label="Incident"
            required
            options={incidentOptions}
            value={incidentId}
            onChange={(value) => setIncidentId(value)}
            loading={incidentsQuery.isLoading}
          />

          {eligibleSections.length > 0 ? (
            <div className="ep-materialize-tasks-modal__sections">
              <p className="caption">
                Optionally limit to specific sections (default: all linked templates below
                materialize):
              </p>
              {eligibleSections.map((section) => (
                <Checkbox
                  key={section.id}
                  label={section.heading}
                  checked={selectedSectionIds.includes(section.id)}
                  onChange={(e) => toggleSection(section.id, e.target.checked)}
                />
              ))}
            </div>
          ) : null}
        </>
      )}
    </Modal>
  );
}
