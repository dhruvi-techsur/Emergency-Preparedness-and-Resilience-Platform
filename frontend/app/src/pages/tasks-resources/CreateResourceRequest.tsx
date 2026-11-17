import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  TextField,
  Select,
  Combobox,
  DatePicker,
  Button,
  Alert,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

type ResourceType = 'Personnel' | 'Equipment' | 'Supplies';

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'Personnel', label: 'Personnel' },
  { value: 'Equipment', label: 'Equipment' },
  { value: 'Supplies', label: 'Supplies' },
];

/** Requesting role options — the 5 real persona role names (the same set
 * LinkTasksModal.tsx documents in detail: what the system's seeded roles
 * table actually contains), since `requesting_role` is a free-text VARCHAR
 * column (03-01's migration) with no FK of its own to constrain it against
 * — this Select's option set is this form's own reasonable choice for
 * "options from seeded role names" per this plan's task description. */
const REQUESTING_ROLE_OPTIONS: SelectOption[] = [
  { value: 'eoc_director', label: 'EOC Director' },
  { value: 'incident_commander', label: 'Incident Commander' },
  { value: 'planning_logistics_chief', label: 'Planning/Logistics Chief' },
  { value: 'field_responder', label: 'Field Responder' },
  { value: 'secops_admin', label: 'Security & Operations Admin' },
];

interface IncidentListItem {
  id: string;
  name: string;
}

interface IncidentsListResponse {
  items: IncidentListItem[];
}

interface ResourceRequestDetailResponse {
  id: string;
}

/**
 * F4 S4.5 — Create/Edit Resource Request. Routed `/resource-requests/new`
 * standalone, or `/incidents/{incidentId}/resource-requests/new` when
 * launched from the Incident Workspace (03-07) with Incident pre-filled.
 *
 * 03-04's backend immediately transitions Draft -> Awaiting approval on
 * this call per its documented default behavior, so this form has only
 * one submit action — matching the mockup's literal S4.5 layout, which
 * shows no separate "save as draft" button.
 */
export function CreateResourceRequest(): JSX.Element {
  const navigate = useNavigate();
  const { incidentId: routeIncidentId } = useParams<{ incidentId?: string }>();

  const [resourceType, setResourceType] = React.useState<ResourceType>('Personnel');
  const [description, setDescription] = React.useState('');
  const [quantity, setQuantity] = React.useState('1');
  const [incidentId, setIncidentId] = React.useState(routeIncidentId ?? '');
  const [neededBy, setNeededBy] = React.useState('');
  const [requestingRole, setRequestingRole] = React.useState('');

  const [fieldError, setFieldError] = React.useState<string | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const incidentsQuery = useQuery({
    queryKey: ['incidents-for-create-resource-request'],
    queryFn: () => apiGet<IncidentsListResponse>('/api/v1/incidents?page_size=1000'),
  });

  const incidentOptions: ComboboxOption[] = (incidentsQuery.data?.items ?? []).map((i) => ({
    value: i.id,
    label: i.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const quantityNum = Number(quantity);
    if (!Number.isInteger(quantityNum) || quantityNum < 1) {
      setFieldError('Quantity must be at least 1.');
      return;
    }
    if (!incidentId) {
      setFieldError('Select an incident.');
      return;
    }
    setFieldError(null);

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiPost<ResourceRequestDetailResponse>('/api/v1/resource-requests', {
        resource_type: resourceType,
        description: description.trim(),
        quantity: quantityNum,
        incident_id: incidentId,
        needed_by: neededBy,
        requesting_role: requestingRole,
      });
      navigate(`/resource-requests/${response.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'RESOURCE_REQUEST_QUANTITY_INVALID') {
        setFieldError(err.message);
        return;
      }
      setSubmitError(err instanceof Error ? err.message : 'Could not create this resource request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ep-create-resource-request">
      <PageHeader
        title="New resource request"
        crumbs={[
          { label: 'Resource requests', href: '/resource-requests' },
          { label: 'New resource request' },
        ]}
      />

      <Card>
        <form onSubmit={(e) => void handleSubmit(e)} noValidate>
          {fieldError ? (
            <Alert tone="danger" title="Fix the following before continuing">
              {fieldError}
            </Alert>
          ) : null}

          <Select
            label="Resource type"
            options={TYPE_OPTIONS}
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as ResourceType)}
          />

          <TextField
            label="Description"
            multiline
            required
            hint="Up to 1000 characters"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Quantity"
            type="number"
            min={1}
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />

          <Combobox
            label="Incident"
            required
            options={incidentOptions}
            value={incidentId}
            onChange={(value) => setIncidentId(value)}
            loading={incidentsQuery.isLoading}
            disabled={Boolean(routeIncidentId)}
          />

          <DatePicker
            label="Needed by"
            required
            withTime
            zone="ET"
            value={neededBy}
            onChange={(iso) => setNeededBy(iso)}
          />

          <Select
            label="Requesting role"
            options={REQUESTING_ROLE_OPTIONS}
            value={requestingRole}
            onChange={(e) => setRequestingRole(e.target.value)}
          />

          {submitError ? (
            <Alert tone="danger" title="Could not create this resource request">
              {submitError}
            </Alert>
          ) : null}

          <div className="ep-create-resource-request__footer">
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                navigate(routeIncidentId ? `/incidents/${routeIncidentId}` : '/resource-requests')
              }
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Submit request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
