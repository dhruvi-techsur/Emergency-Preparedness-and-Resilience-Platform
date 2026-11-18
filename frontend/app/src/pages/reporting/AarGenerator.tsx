import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Progress,
  Button,
  TextField,
  Select,
  Combobox,
  DatePicker,
  Table,
  Alert,
  EmptyState,
  type TableColumn,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, apiPatch, ApiRequestError } from '../../lib/api-client';

type IncidentStatus = 'Open' | 'Closed';

interface IncidentDetail {
  id: string;
  name: string;
  status: IncidentStatus;
}

interface TimelineExportEntry {
  id: string;
  occurred_at: string;
  title: string;
  source: string;
}

interface DecisionLogEntry {
  id: string;
  occurred_at: string;
  title: string;
}

interface ResourceHistoryRequest {
  id: string;
  resource_type: string;
  description: string;
  status: string;
}

interface ResourceHistoryStatusEntry {
  id: string;
  resource_request_id: string;
  to_status: string;
  changed_at: string;
}

interface AarFinding {
  id?: string;
  text: string;
  category?: string;
  corrective_action?: string;
  owner_id?: string;
  due_date?: string;
  closure_status?: 'Open' | 'Closed';
}

interface AarResponse {
  id: string;
  incident_id: string;
  timeline_export: TimelineExportEntry[];
  decisions_log: DecisionLogEntry[];
  resource_history: { requests: ResourceHistoryRequest[]; status_history: ResourceHistoryStatusEntry[] };
  status: 'Draft' | 'Finalized';
  findings: AarFinding[];
}

interface PersonnelSummary {
  id: string;
  name: string;
}

const FINDING_CATEGORY_OPTIONS: SelectOption[] = [
  { value: '', label: 'No category' },
  { value: 'Command & Control', label: 'Command & Control' },
  { value: 'Communications', label: 'Communications' },
  { value: 'Resource Management', label: 'Resource Management' },
  { value: 'Planning', label: 'Planning' },
  { value: 'Logistics', label: 'Logistics' },
];

const STEP_LABELS = ['', 'Timeline export', 'Decisions log', 'Resource history', 'Findings', 'Review'];

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
 * F7 S7.3 — AAR Generator. Routed `/incidents/{id}/aar/new`.
 *
 * First fetches the incident; if `status !== 'Closed'`, renders an
 * EmptyState with the exact FRD `409 INCIDENT_NOT_CLOSED` message and
 * NEVER renders the wizard form at all — this is the UI manifestation of
 * the mockup's "Generate AAR action is absent/disabled" state rule when
 * this page is reached directly by URL for an open incident.
 *
 * If Closed, renders a 5-step wizard with Progress step indication
 * (Timeline export / Decisions log / Resource history / Findings /
 * Review), mirroring ComposeNotification.tsx's step-machine pattern.
 *
 * Step 1 "Export" downloads the raw timeline JSON — a minimal, honest
 * "exportable" implementation for this sub-section; a polished PDF/CSV
 * export is 04-02's evidence-log-level export only, not duplicated here.
 *
 * Step 2's per-row annotation TextFields are local component state ONLY
 * in this phase — 04-02's schema has no distinct annotation-storage
 * column separate from the decisions_log JSONB blob. Documented as a
 * Phase-4 simplification; annotations are NOT sent to the backend on this
 * plan's AAR generate/finalize calls, since no field exists to receive
 * them.
 */
export function AarGenerator(): JSX.Element {
  const { id: incidentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [step, setStep] = React.useState(1);
  const [aar, setAar] = React.useState<AarResponse | null>(null);
  const [generating, setGenerating] = React.useState(false);
  const [generateError, setGenerateError] = React.useState<string | null>(null);

  const [annotations, setAnnotations] = React.useState<Record<string, string>>({});

  const [findings, setFindings] = React.useState<AarFinding[]>([]);
  const [findingsError, setFindingsError] = React.useState<string | null>(null);

  const [finalizing, setFinalizing] = React.useState(false);
  const [finalizeError, setFinalizeError] = React.useState<string | null>(null);

  const incidentQuery = useQuery({
    queryKey: ['incident-for-aar', incidentId],
    queryFn: () => apiGet<IncidentDetail>(`/api/v1/incidents/${incidentId}`),
    enabled: Boolean(incidentId),
  });

  const personnelQuery = useQuery({
    queryKey: ['incidents-personnel-for-aar'],
    queryFn: () => apiGet<{ items: PersonnelSummary[] }>('/api/v1/incidents/personnel'),
    enabled: incidentQuery.data?.status === 'Closed',
  });

  const ownerOptions: ComboboxOption[] = (personnelQuery.data?.items ?? []).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  // Auto-generates the AAR (auto-assembled Timeline/decisions/resource
  // history) the moment we know the incident IS Closed — no manual
  // "generate" button needed beyond reaching this page, same auto-assemble
  // contract SitrepGenerator.tsx establishes.
  const hasGeneratedRef = React.useRef(false);
  React.useEffect(() => {
    if (hasGeneratedRef.current) return;
    if (incidentQuery.data?.status !== 'Closed' || !incidentId) return;
    hasGeneratedRef.current = true;

    void (async () => {
      setGenerating(true);
      setGenerateError(null);
      try {
        const created = await apiPost<AarResponse>(`/api/v1/incidents/${incidentId}/aar`, {});
        setAar(created);
        setFindings(created.findings.length > 0 ? created.findings : []);
      } catch (err) {
        if (err instanceof ApiRequestError && err.body.error_code === 'INCIDENT_NOT_CLOSED') {
          setGenerateError(err.message);
          return;
        }
        setGenerateError(
          err instanceof ApiRequestError ? err.message : 'Could not generate this after-action report.',
        );
      } finally {
        setGenerating(false);
      }
    })();
  }, [incidentQuery.data?.status, incidentId]);

  const handleExportTimeline = () => {
    if (!aar) return;
    const blob = new Blob([JSON.stringify(aar.timeline_export, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aar-${aar.incident_id}-timeline.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const addFinding = () => {
    setFindings((prev) => [...prev, { text: '', closure_status: 'Open' }]);
  };

  const updateFinding = (index: number, patch: Partial<AarFinding>) => {
    setFindings((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const removeFinding = (index: number) => {
    setFindings((prev) => prev.filter((_, i) => i !== index));
  };

  // Client-side mirror of the server's 422 CORRECTIVE_ACTION_UNOWNED gate
  // — any finding carrying a non-empty corrective_action must also carry
  // BOTH owner_id and due_date before finalize is attempted.
  function validateFindingsOwnership(): boolean {
    for (const f of findings) {
      if (f.corrective_action && f.corrective_action.trim().length > 0) {
        if (!f.owner_id || !f.due_date) return false;
      }
    }
    return true;
  }

  const handleFinalize = async () => {
    if (!aar || !incidentId) return;

    if (!validateFindingsOwnership()) {
      setFindingsError('Assign an owner and due date to every corrective action before finalizing.');
      return;
    }
    setFindingsError(null);

    // Re-POST generate with the current findings array first (upserts the
    // Draft row in place per 04-02's documented upsert contract), THEN
    // finalize — this plan's findings are authored client-side across
    // Step 4 and only reach the backend at this point.
    setFinalizing(true);
    setFinalizeError(null);
    try {
      const regenerated = await apiPost<AarResponse>(`/api/v1/incidents/${incidentId}/aar`, {
        findings: findings.map((f) => ({
          text: f.text,
          category: f.category || undefined,
          corrective_action: f.corrective_action || undefined,
          owner_id: f.owner_id || undefined,
          due_date: f.due_date || undefined,
        })),
      });
      const finalized = await apiPatch<AarResponse>(
        `/api/v1/incidents/${incidentId}/aar/${regenerated.id}/finalize`,
        {},
      );
      setAar(finalized);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'CORRECTIVE_ACTION_UNOWNED') {
        setFindingsError(err.message);
        return;
      }
      if (err instanceof ApiRequestError && err.body.error_code === 'DOCUMENT_IMMUTABLE') {
        setFinalizeError(err.message);
        return;
      }
      setFinalizeError(
        err instanceof ApiRequestError ? err.message : 'Could not finalize this after-action report.',
      );
    } finally {
      setFinalizing(false);
    }
  };

  if (incidentQuery.isLoading) {
    return <div className="ep-aar-generator" aria-busy="true" />;
  }

  // The closure-required guard — the wizard form NEVER renders for an
  // open incident, regardless of how this page was reached (PageHeader
  // action or direct URL navigation).
  if (incidentQuery.data && incidentQuery.data.status !== 'Closed') {
    return (
      <div className="ep-aar-generator">
        <EmptyState
          title="Close this incident before generating its after-action report."
          action={
            <Button variant="primary" onClick={() => navigate(`/incidents/${incidentId}`)}>
              Back to incident
            </Button>
          }
        />
      </div>
    );
  }

  if (generating || !aar) {
    if (generateError) {
      return (
        <div className="ep-aar-generator">
          <EmptyState
            title="Could not generate this after-action report"
            action={
              <Button variant="primary" onClick={() => navigate(`/incidents/${incidentId}`)}>
                Back to incident
              </Button>
            }
          >
            {generateError}
          </EmptyState>
        </div>
      );
    }
    return <div className="ep-aar-generator" aria-busy="true" />;
  }

  const isFinalized = aar.status === 'Finalized';

  const resourceColumns: TableColumn<ResourceHistoryRequest>[] = [
    { key: 'resource_type', header: 'Type' },
    { key: 'description', header: 'Description' },
    { key: 'status', header: 'Status' },
  ];

  return (
    <div className="ep-aar-generator">
      <PageHeader
        title="Generate after-action report"
        subtitle={incidentQuery.data?.name}
        crumbs={[{ label: 'Incident', href: `/incidents/${incidentId}` }, { label: 'Generate AAR' }]}
      />

      <Progress value={(step / 5) * 100} label={`Step ${step} of 5: ${STEP_LABELS[step]}`} showValue={false} />

      {isFinalized ? (
        <Alert tone="success" title="This after-action report is finalized">
          Finalized AARs are read-only; no further edits are accepted.
        </Alert>
      ) : null}

      {finalizeError ? (
        <Alert tone="danger" title="Could not finalize this report">
          {finalizeError}
        </Alert>
      ) : null}

      {/* Rendered at this top level (not nested inside the step===4
          block) since the finding-ownership violation can be discovered
          from Step 5's Finalize click, after the user has already
          navigated away from the Findings step — the alert must stay
          visible regardless of which step is currently showing. */}
      {findingsError ? (
        <Alert tone="danger" title="Fix the following before finalizing">
          {findingsError}
        </Alert>
      ) : null}

      {step === 1 ? (
        <Card title="Timeline export">
          {aar.timeline_export.length === 0 ? (
            <p className="caption">No timeline entries recorded for this incident.</p>
          ) : (
            <ul className="ep-aar-generator__list">
              {aar.timeline_export.map((entry) => (
                <li key={entry.id}>
                  <span className="data">{formatDateTime(entry.occurred_at)}</span> — {entry.title}
                </li>
              ))}
            </ul>
          )}
          <Button variant="secondary" onClick={handleExportTimeline}>
            Export
          </Button>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card title="Decisions log">
          {aar.decisions_log.length === 0 ? (
            <p className="caption">No decision-tagged timeline entries found for this incident.</p>
          ) : (
            aar.decisions_log.map((entry) => (
              <div key={entry.id} className="ep-aar-generator__decision-row">
                <p>
                  <span className="data">{formatDateTime(entry.occurred_at)}</span> — {entry.title}
                </p>
                <TextField
                  label="Annotation"
                  multiline
                  hint="Phase-4 note: stored locally in this session only — no backend field exists yet to persist annotations separately from the decisions_log JSONB blob"
                  value={annotations[entry.id] ?? ''}
                  onChange={(e) => setAnnotations((prev) => ({ ...prev, [entry.id]: e.target.value }))}
                />
              </div>
            ))
          )}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card title="Resource-request history">
          <Table
            caption="Resource-request history"
            columns={resourceColumns}
            rows={aar.resource_history.requests}
            rowKey={(row) => row.id}
            empty={{ title: 'No resource requests linked to this incident' }}
          />
        </Card>
      ) : null}

      {step === 4 ? (
        <Card title="Findings & corrective actions">
          {findings.map((finding, index) => (
            <Card key={finding.id ?? `new-${index}`} title={`Finding ${index + 1}`}>
              <TextField
                label="Finding text"
                required
                value={finding.text}
                onChange={(e) => updateFinding(index, { text: e.target.value })}
              />
              <Select
                label="Category"
                options={FINDING_CATEGORY_OPTIONS}
                value={finding.category ?? ''}
                onChange={(e) => updateFinding(index, { category: e.target.value || undefined })}
              />
              <TextField
                label="Corrective action"
                multiline
                value={finding.corrective_action ?? ''}
                onChange={(e) => updateFinding(index, { corrective_action: e.target.value || undefined })}
              />
              <Combobox
                label="Owner"
                options={ownerOptions}
                value={finding.owner_id ?? ''}
                onChange={(value) => updateFinding(index, { owner_id: value || undefined })}
                loading={personnelQuery.isLoading}
                clearable
              />
              <DatePicker
                label="Due date"
                value={finding.due_date ?? ''}
                onChange={(iso) => updateFinding(index, { due_date: iso || undefined })}
              />
              <Button variant="ghost" onClick={() => removeFinding(index)}>
                Remove finding
              </Button>
            </Card>
          ))}
          <Button variant="secondary" onClick={addFinding}>
            + Add finding
          </Button>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card title="Review">
          <h4>Timeline export</h4>
          <p className="caption">{aar.timeline_export.length} entries</p>
          <h4>Decisions log</h4>
          <p className="caption">{aar.decisions_log.length} decision-tagged entries</p>
          <h4>Resource-request history</h4>
          <p className="caption">{aar.resource_history.requests.length} requests</p>
          <h4>Findings</h4>
          {findings.length === 0 ? (
            <p className="caption">No findings added.</p>
          ) : (
            <ul className="ep-aar-generator__list">
              {findings.map((f, i) => (
                <li key={f.id ?? i}>
                  {f.text || '(no text)'}
                  {f.corrective_action ? ` — corrective action: ${f.corrective_action}` : ''}
                  {f.owner_id ? ` — owner assigned` : ''}
                  {f.due_date ? ` — due ${f.due_date}` : ''}
                </li>
              ))}
            </ul>
          )}
        </Card>
      ) : null}

      <div className="ep-aar-generator__footer">
        <Button variant="ghost" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>
          Back
        </Button>
        {step < 5 ? (
          <Button variant="primary" onClick={() => setStep((s) => Math.min(5, s + 1))}>
            Continue
          </Button>
        ) : (
          <Button
            variant="primary"
            disabled={isFinalized}
            loading={finalizing}
            onClick={() => void handleFinalize()}
          >
            Finalize AAR
          </Button>
        )}
      </div>
    </div>
  );
}
