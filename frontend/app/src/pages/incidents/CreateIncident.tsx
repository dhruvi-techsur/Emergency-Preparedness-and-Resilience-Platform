import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

type IncidentType = 'Flood' | 'Wildfire' | 'Severe Weather' | 'HazMat' | 'Public Health' | 'Other';
type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'Flood', label: 'Flood' },
  { value: 'Wildfire', label: 'Wildfire' },
  { value: 'Severe Weather', label: 'Severe Weather' },
  { value: 'HazMat', label: 'HazMat' },
  { value: 'Public Health', label: 'Public Health' },
  { value: 'Other', label: 'Other' },
];

const SEVERITY_OPTIONS: SelectOption[] = [
  { value: 'Critical', label: 'Critical' },
  { value: 'Elevated', label: 'Elevated' },
  { value: 'Watch', label: 'Watch' },
  { value: 'Normal', label: 'Normal' },
];

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

interface IncidentDetailResponse {
  id: string;
}

interface DuplicateErrorBody {
  error_code: 'INCIDENT_POSSIBLE_DUPLICATE';
  message: string;
  details: { id: string; opened_at: string };
}

function defaultOpenedAt(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(
    now.getHours(),
  )}:${pad(now.getMinutes())}`;
}

interface FieldError {
  field: 'name' | 'jurisdiction_id' | 'opened_at';
  message: string;
}

/**
 * F1 S1.2 — Create Incident form. Routed `/incidents/new`.
 *
 * Phase 2 scope note: no dedicated jurisdictions-list endpoint existed in
 * any prior backend plan — this component's jurisdiction Combobox depends
 * on `GET /api/v1/jurisdictions`, added in this plan's incidents.ts module
 * (see that file's own doc comment) since every incident-creation flow
 * needs it and no earlier plan owns it.
 *
 * Phase 6 (06-09) addition — ADDITIVE ONLY: an optional pre-fill read from
 * router state (`navigate('/incidents/new', { state: { prefill } })`,
 * 06-09's Signal Triage Queue/Detail's Promote action). Router state is a
 * purely client-side, same-origin navigation mechanism — it cannot be
 * injected from an external URL or a different origin, and the pre-filled
 * values are only ever USED as `useState` lazy-initializer defaults for
 * fields the user can freely edit before submitting; they carry no
 * elevated trust and bypass none of this form's own existing validation.
 * A user arriving at `/incidents/new` with NO router state (the normal
 * Phase-2 flow) behaves EXACTLY as before — this is the ONLY change to
 * this Phase-2 file, non-breaking to Phase 2's own existing
 * incident-list-create.spec.ts Playwright suite.
 */
/** [Rule 1 - Bug] 06-04's signal-triage promote endpoint derives
 * `type_suggestion` from free-text hazard-feed vocabulary (e.g.
 * "Earthquake Advisory", "Hurricane Watch", "High Wind Warning") via
 * `deriveTypeSuggestion()` — values that are NOT members of this form's
 * own `incidents.type` CHECK constraint enum. Submitting one of those
 * unrecognized strings straight through would violate the DB constraint
 * and 500 on submit (reproduced: POST /api/v1/incidents with
 * type="Earthquake Advisory" fails the CHECK). This guard maps any
 * pre-fill suggestion not already a known IncidentType to the form's
 * existing 'Other' catch-all — the same bucket a human would pick
 * manually for an unlisted hazard type — rather than letting an invalid
 * value reach the submit call at all. */
const KNOWN_INCIDENT_TYPES: readonly IncidentType[] = [
  'Flood',
  'Wildfire',
  'Severe Weather',
  'HazMat',
  'Public Health',
  'Other',
];

function resolveTypeSuggestion(suggestion: string | undefined): IncidentType {
  if (suggestion && (KNOWN_INCIDENT_TYPES as readonly string[]).includes(suggestion)) {
    return suggestion as IncidentType;
  }
  return suggestion ? 'Other' : 'Flood';
}

export function CreateIncident(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (
    location.state as {
      prefill?: { name_suggestion: string; type_suggestion: string; severity_suggestion: string };
    } | null
  )?.prefill;

  const [name, setName] = React.useState(() => prefill?.name_suggestion ?? '');
  const [type, setType] = React.useState<IncidentType>(() =>
    resolveTypeSuggestion(prefill?.type_suggestion),
  );
  const [severity, setSeverity] = React.useState<Severity>(
    () => (prefill?.severity_suggestion as Severity) ?? 'Normal',
  );
  const [jurisdictionId, setJurisdictionId] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [openedAt, setOpenedAt] = React.useState(() => defaultOpenedAt());

  const [fieldErrors, setFieldErrors] = React.useState<FieldError[]>([]);
  const [duplicateWarning, setDuplicateWarning] = React.useState<DuplicateErrorBody | null>(null);
  // Set to true the first time a 409 is seen for the current form contents —
  // the NEXT submit resends the same body with confirmed_duplicate:true, so
  // the user never has to re-type anything to proceed past the warning.
  const [duplicateConfirmed, setDuplicateConfirmed] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const nameRef = React.useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const jurisdictionRef = React.useRef<HTMLInputElement | null>(null);
  const openedAtRef = React.useRef<HTMLInputElement | null>(null);

  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
  });

  const jurisdictionOptions: ComboboxOption[] = (jurisdictionsQuery.data?.items ?? []).map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const errorFor = (field: FieldError['field']): string | undefined =>
    fieldErrors.find((e) => e.field === field)?.message;

  function validate(): FieldError[] {
    const errors: FieldError[] = [];
    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 200) {
      errors.push({ field: 'name', message: 'Enter a name between 3 and 200 characters.' });
    }
    if (!jurisdictionId) {
      errors.push({ field: 'jurisdiction_id', message: 'Select a jurisdiction.' });
    }
    if (!openedAt) {
      errors.push({ field: 'opened_at', message: 'Enter when this incident opened.' });
    }
    return errors;
  }

  function focusField(field: FieldError['field']) {
    if (field === 'name') nameRef.current?.focus();
    else if (field === 'jurisdiction_id') jurisdictionRef.current?.focus();
    else if (field === 'opened_at') openedAtRef.current?.focus();
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setName(e.target.value);
    // The duplicate warning is specific to this exact name; once the user
    // changes it, the prior 409 no longer applies and the confirm-anyway
    // state resets — this is the resolution path for the persistent
    // (non-dismissable-by-design, per Alert's documented contract) warning
    // tone Alert below.
    if (duplicateWarning) {
      setDuplicateWarning(null);
      setDuplicateConfirmed(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (errors.length > 0) {
      focusField(errors[0].field);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiPost<IncidentDetailResponse>('/api/v1/incidents', {
        name: name.trim(),
        type,
        severity,
        jurisdiction_id: jurisdictionId,
        description: description.trim() || undefined,
        opened_at: openedAt,
        ...(duplicateConfirmed ? { confirmed_duplicate: true } : {}),
      });
      navigate(`/incidents/${response.id}`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.status === 409) {
        const body = err.body as unknown as DuplicateErrorBody;
        setDuplicateWarning(body);
        setDuplicateConfirmed(true);
        return;
      }
      setSubmitError(err instanceof Error ? err.message : 'Could not create incident.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ep-create-incident">
      <PageHeader
        title="Create incident"
        crumbs={[{ label: 'Incidents', href: '/incidents' }, { label: 'Create incident' }]}
      />

      <div className="ep-create-incident__column">
        <Card>
          <form onSubmit={(e) => void handleSubmit(e)} noValidate>
            {fieldErrors.length > 0 ? (
              <Alert tone="danger" title="Fix the following before continuing">
                <ul>
                  {fieldErrors.map((err) => (
                    <li key={err.field}>{err.message}</li>
                  ))}
                </ul>
              </Alert>
            ) : null}

            {duplicateWarning ? (
              <Alert
                tone="warning"
                title={duplicateWarning.message}
                onDismiss={() => setDuplicateWarning(null)}
              >
                Submit again to confirm this is a new incident — your entries are kept.
              </Alert>
            ) : null}

            <TextField
              ref={nameRef}
              label="Name"
              required
              hint="3-200 characters"
              value={name}
              onChange={handleNameChange}
              error={errorFor('name')}
            />

            <Select
              label="Type"
              options={TYPE_OPTIONS}
              value={type}
              onChange={(e) => setType(e.target.value as IncidentType)}
            />

            <Select
              label="Severity"
              options={SEVERITY_OPTIONS}
              value={severity}
              onChange={(e) => setSeverity(e.target.value as Severity)}
            />

            <Combobox
              ref={jurisdictionRef}
              label="Jurisdiction"
              required
              options={jurisdictionOptions}
              value={jurisdictionId}
              onChange={(value) => setJurisdictionId(value)}
              loading={jurisdictionsQuery.isLoading}
              error={errorFor('jurisdiction_id')}
            />

            <TextField
              label="Description"
              multiline
              hint="Up to 2000 characters (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <DatePicker
              ref={openedAtRef}
              label="Opened at"
              required
              withTime
              zone="ET"
              value={openedAt}
              onChange={(iso) => setOpenedAt(iso)}
              error={errorFor('opened_at')}
            />

            {submitError ? (
              <Alert tone="danger" title="Could not create incident">
                {submitError}
              </Alert>
            ) : null}

            <div className="ep-create-incident__footer">
              <Button type="button" variant="ghost" onClick={() => navigate('/incidents')}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={submitting}>
                Create incident
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
