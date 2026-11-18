import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  TextField,
  Combobox,
  DatePicker,
  Checkbox,
  Button,
  Alert,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

/** Sourced from `GET /api/v1/incidents/personnel` (incidents:view gated)
 * rather than `GET /api/v1/admin/users` -- same reasoning TaskList.tsx and
 * CommandRoleModal.tsx both document: the roles that actually hold
 * `tasks:create` deliberately hold no `admin:view` permission. */
interface PersonnelSummary {
  id: string;
  name: string;
}

interface IncidentListItem {
  id: string;
  name: string;
}

interface IncidentsListResponse {
  items: IncidentListItem[];
}

interface PlanSection {
  id: string;
  heading: string;
}

/**
 * F4 S4.2 — Create/Edit Task. Routed `/tasks/new` standalone, or
 * `/incidents/{incidentId}/tasks/new` when launched from the Incident
 * Workspace (03-07) with the Incident field pre-filled from the route.
 */
export function CreateTask(): JSX.Element {
  const navigate = useNavigate();
  const { incidentId: routeIncidentId } = useParams<{ incidentId?: string }>();

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [ownerId, setOwnerId] = React.useState('');
  const [dueAt, setDueAt] = React.useState('');
  const [incidentId, setIncidentId] = React.useState(routeIncidentId ?? '');
  const [planSectionId, setPlanSectionId] = React.useState('');
  const [retroactiveConfirmed, setRetroactiveConfirmed] = React.useState(false);

  const [ownerRequiredError, setOwnerRequiredError] = React.useState(false);
  const [dueDatePastWarning, setDueDatePastWarning] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const ownerRef = React.useRef<HTMLInputElement | null>(null);

  const ownersQuery = useQuery({
    queryKey: ['incidents-personnel-for-create-task'],
    queryFn: () => apiGet<{ items: PersonnelSummary[] }>('/api/v1/incidents/personnel'),
  });

  const incidentsQuery = useQuery({
    queryKey: ['incidents-for-create-task'],
    queryFn: () => apiGet<IncidentsListResponse>('/api/v1/incidents?page_size=1000'),
  });

  // The plan_section Combobox's options would come from the pre-filled
  // incident's referenced plan, if any -- but TechArch's `incidents` row
  // shape carries no "linked plan" foreign key this form could follow to
  // reach a specific plan's sections (confirmed directly against
  // incidents.ts's response shape), so there is no real source to query
  // yet. Per this plan's own documented discretion ("else empty/disabled"
  // is an explicitly acceptable outcome), this renders a disabled, empty
  // Combobox rather than inventing a lookup the schema doesn't support --
  // a future phase adding that FK can wire a real query here without
  // changing this form's contract.
  const planSectionOptionsSource: PlanSection[] = [];

  const ownerOptions: ComboboxOption[] = (ownersQuery.data?.items ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const incidentOptions: ComboboxOption[] = (incidentsQuery.data?.items ?? []).map((i) => ({
    value: i.id,
    label: i.name,
  }));

  const planSectionOptions: ComboboxOption[] = planSectionOptionsSource.map((s) => ({
    value: s.id,
    label: s.heading,
  }));

  const isDueInPast = (iso: string): boolean => {
    if (!iso) return false;
    return new Date(iso).getTime() <= Date.now();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side owner-required pre-check mirroring 03-01's server-side
    // 422 TASK_OWNER_REQUIRED -- the user never round-trips to the server
    // for this specific case, though the server-side check remains the
    // actual enforcement.
    if (!ownerId) {
      setOwnerRequiredError(true);
      ownerRef.current?.focus();
      return;
    }
    setOwnerRequiredError(false);

    if (isDueInPast(dueAt) && !retroactiveConfirmed) {
      setDueDatePastWarning(true);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiPost<{ id: string }>('/api/v1/tasks', {
        title: title.trim(),
        description: description.trim() || undefined,
        owner_id: ownerId,
        due_at: dueAt,
        incident_id: incidentId || undefined,
        plan_section_id: planSectionId || undefined,
        ...(retroactiveConfirmed ? { confirmed_backfill: true } : {}),
      });
      navigate(routeIncidentId ? `/incidents/${routeIncidentId}` : `/tasks/${response.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'TASK_OWNER_REQUIRED') {
        setOwnerRequiredError(true);
        ownerRef.current?.focus();
        return;
      }
      if (err instanceof ApiRequestError && err.body.error_code === 'DUE_DATE_PAST') {
        setDueDatePastWarning(true);
        return;
      }
      setSubmitError(err instanceof Error ? err.message : 'Could not create this task.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ep-create-task">
      <PageHeader
        title="Create task"
        crumbs={[{ label: 'Tasks', href: '/tasks' }, { label: 'Create task' }]}
      />

      <Card>
        <form onSubmit={(e) => void handleSubmit(e)} noValidate>
          {ownerRequiredError ? (
            <Alert tone="danger" title="Assign an owner before creating this task.">
              Select an owner from the field below, then try again.
            </Alert>
          ) : null}

          {dueDatePastWarning ? (
            <Alert tone="warning" title="This due time has already passed. Confirm this is a retroactive entry.">
              Check the box below to confirm, then submit again.
            </Alert>
          ) : null}

          <TextField
            label="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Combobox
            ref={ownerRef}
            label="Owner"
            required
            options={ownerOptions}
            value={ownerId}
            onChange={(value) => {
              setOwnerId(value);
              setOwnerRequiredError(false);
            }}
            loading={ownersQuery.isLoading}
          />

          <DatePicker
            label="Due"
            required
            withTime
            zone="ET"
            value={dueAt}
            onChange={(iso) => {
              setDueAt(iso);
              setDueDatePastWarning(false);
              setRetroactiveConfirmed(false);
            }}
          />

          <Combobox
            label="Incident"
            options={incidentOptions}
            value={incidentId}
            onChange={(value) => setIncidentId(value)}
            loading={incidentsQuery.isLoading}
            disabled={Boolean(routeIncidentId)}
            clearable={!routeIncidentId}
          />

          <Combobox
            label="Linked plan section"
            options={planSectionOptions}
            value={planSectionId}
            onChange={(value) => setPlanSectionId(value)}
            disabled={planSectionOptions.length === 0}
            placeholder={planSectionOptions.length === 0 ? 'No plan sections available' : undefined}
            clearable
          />

          {dueDatePastWarning ? (
            <Checkbox
              label="This is a retroactive entry"
              checked={retroactiveConfirmed}
              onChange={(e) => setRetroactiveConfirmed(e.target.checked)}
            />
          ) : null}

          {submitError ? (
            <Alert tone="danger" title="Could not create this task">
              {submitError}
            </Alert>
          ) : null}

          <div className="ep-create-task__footer">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate(routeIncidentId ? `/incidents/${routeIncidentId}` : '/tasks')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Create task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
