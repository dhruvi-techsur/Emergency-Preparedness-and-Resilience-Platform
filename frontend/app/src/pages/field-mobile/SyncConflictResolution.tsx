import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Skeleton, Alert } from '@epmp/design-system';
import { apiGet, apiPost } from '../../lib/api-client';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import './SyncConflictResolution.css';

type ConflictResolution = 'keep_mine' | 'keep_eoc';

/** Matches 05-01's `sync_conflicts.field_version` JSONB shape for the
 * `entity_type='field_report'` case this plan implements (the exact
 * payload shape `field-reports.ts`'s sync-batch route stores verbatim). */
interface FieldVersion {
  observation_type?: string;
  description?: string;
  captured_at?: string;
}

/** Matches `field-reports.ts`'s exact `eoc_version` shape: `{
 * incident_updated_at, incident_name }`. */
interface EocVersion {
  incident_updated_at?: string;
  incident_name?: string;
}

interface SyncConflictDetail {
  id: string;
  entity_type: string;
  entity_id: string;
  field_version: FieldVersion;
  eoc_version: EocVersion;
  resolution?: ConflictResolution;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
  return String(value);
}

/** A field pair that DIFFERS between field_version and eoc_version renders
 * highlighted — field_version/eoc_version have no shared field names at
 * all (the field side is a report snapshot; the EOC side is the
 * incident's own metadata), so "differing" here means: any field_version
 * value that doesn't appear verbatim anywhere in eoc_version — simple
 * string-inequality, no deep diff. */
function valueDiffers(value: unknown, otherSideValues: unknown[]): boolean {
  if (value === undefined || value === null || value === '') return false;
  return !otherSideValues.some((other) => String(other) === String(value));
}

/**
 * F6 S6.5 — Sync Conflict Resolution, the phase's hardest success
 * criterion. Routed `/field/conflicts/:id`. Fetches the single conflict by
 * id (05-04's new `GET /api/v1/sync-conflicts/:id` route), renders BOTH
 * versions stacked (side-by-side on wide viewports, stacked on mobile —
 * see the CSS), and commits an explicit choice directly via `apiPost`
 * (never queued — resolving a conflict is inherently an online action:
 * the conflict was only ever surfaced after a successful sync attempt, so
 * the responder resolving it is, by definition, back online).
 *
 * Neither button is focused or pre-checked on mount — the mockup's
 * explicit "no default/pre-selected choice" requirement is satisfied
 * structurally: there is no code path that focuses or pre-selects either
 * button on mount.
 */
export function SyncConflictResolution(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [resolving, setResolving] = React.useState<ConflictResolution | null>(null);
  const [resolveError, setResolveError] = React.useState<string | null>(null);

  const { data: conflict, isLoading } = useQuery({
    queryKey: ['sync-conflict', id],
    queryFn: () => apiGet<SyncConflictDetail>(`/api/v1/sync-conflicts/${id}`),
    enabled: Boolean(id),
  });

  const handleResolve = async (resolution: ConflictResolution) => {
    setResolveError(null);
    setResolving(resolution);
    try {
      await apiPost(`/api/v1/sync-conflicts/${id}/resolve`, { resolution });
      navigate('/field/queued');
    } catch {
      setResolveError("This resolution didn't go through. Check your connection and try again.");
    } finally {
      setResolving(null);
    }
  };

  if (isLoading || !conflict) {
    return (
      <FieldMobileShell>
        <div className="ep-sync-conflict-resolution">
          <h1 className="h1">Resolve conflict</h1>
          <Skeleton w="100%" h={120} />
          <Skeleton w="100%" h={120} />
        </div>
      </FieldMobileShell>
    );
  }

  const fieldFields: Array<[string, unknown]> = [
    ['Observation type', conflict.field_version.observation_type],
    ['Description', conflict.field_version.description],
    ['Captured', conflict.field_version.captured_at],
  ];
  const eocFields: Array<[string, unknown]> = [
    ['Incident', conflict.eoc_version.incident_name],
    ['Last updated', conflict.eoc_version.incident_updated_at],
  ];

  const allFieldValues = fieldFields.map(([, v]) => v);
  const allEocValues = eocFields.map(([, v]) => v);

  return (
    <FieldMobileShell>
      <div className="ep-sync-conflict-resolution">
        <h1 className="h1">Resolve conflict</h1>
        <p className="body">
          This report was captured while the incident changed on the EOC side. Choose which
          version to keep — neither is applied automatically.
        </p>

        <div className="ep-sync-conflict-resolution__versions">
          <section className="ep-sync-conflict-resolution__version">
            <h4 className="h4">Your version</h4>
            <dl className="ep-sync-conflict-resolution__fields">
              {fieldFields.map(([label, value]) => (
                <div key={label} className="ep-sync-conflict-resolution__field-row">
                  <dt className="label">{label}</dt>
                  <dd
                    className={
                      valueDiffers(value, allEocValues)
                        ? 'body ep-sync-conflict-resolution__value--diff'
                        : 'body'
                    }
                  >
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="ep-sync-conflict-resolution__version">
            <h4 className="h4">Current EOC version</h4>
            <dl className="ep-sync-conflict-resolution__fields">
              {eocFields.map(([label, value]) => (
                <div key={label} className="ep-sync-conflict-resolution__field-row">
                  <dt className="label">{label}</dt>
                  <dd
                    className={
                      valueDiffers(value, allFieldValues)
                        ? 'body ep-sync-conflict-resolution__value--diff'
                        : 'body'
                    }
                  >
                    {formatValue(value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        {resolveError ? <Alert tone="danger" title={resolveError} /> : null}
      </div>

      <div className="ep-sync-conflict-resolution__action-bar">
        <Button
          variant="secondary"
          size="lg"
          loading={resolving === 'keep_eoc'}
          disabled={resolving !== null && resolving !== 'keep_eoc'}
          onClick={() => void handleResolve('keep_eoc')}
        >
          Keep EOC version
        </Button>
        <Button
          variant="primary"
          size="lg"
          loading={resolving === 'keep_mine'}
          disabled={resolving !== null && resolving !== 'keep_mine'}
          onClick={() => void handleResolve('keep_mine')}
        >
          Keep my version
        </Button>
      </div>
    </FieldMobileShell>
  );
}
