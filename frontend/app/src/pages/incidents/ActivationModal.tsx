import * as React from 'react';
import { Modal, Button, Select, Alert, type SelectOption } from '@epmp/design-system';
import { apiPost, ApiRequestError } from '../../lib/api-client';

type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';

const ACTIVATION_LEVELS: ActivationLevel[] = ['Monitoring', 'Partial', 'Full'];

const LEVEL_RANK: Record<ActivationLevel, number> = {
  Monitoring: 0,
  Partial: 1,
  Full: 2,
};

/** Per FRD S1.5's one given example sentence (Full) plus this plan's own
 * discretion for the other two transitions, documented here since the FRD
 * doesn't specify every pairing's exact wording. */
const CONSEQUENCE_FOR_LEVEL: Record<ActivationLevel, string> = {
  Full: 'This notifies all assigned command roles and opens full resource-request approval workflows.',
  Partial: 'This notifies assigned command roles and opens limited resource-request approval.',
  Monitoring:
    'This stands down active coordination; assigned roles remain on record but approval workflows close.',
};

export interface ActivationModalProps {
  incidentId: string;
  incidentName: string;
  currentLevel: ActivationLevel;
  open: boolean;
  onClose: () => void;
  /** Called after a successful activation change — parent refetches incident + timeline. */
  onChanged: () => void;
}

/**
 * F1 S1.5 — Activation Level Change Modal, danger-tier on escalation.
 *
 * The confirmation gate and commander-required rule are both enforced
 * server-side by 02-02's activation.ts (the actual security/business-rule
 * boundary, per that file's own doc comment) — this Modal's `danger` tier
 * and consequence wording are the UX-level half of that contract, not a
 * substitute for it. A 422 NO_COMMANDER_ASSIGNED is rendered verbatim
 * inline, never as a generic error, and `onChanged` is deliberately NOT
 * called on that path — the parent's data is never refetched, so the
 * activation-level display visibly has not changed.
 */
export function ActivationModal({
  incidentId,
  incidentName,
  currentLevel,
  open,
  onClose,
  onChanged,
}: ActivationModalProps): JSX.Element {
  const otherLevels = ACTIVATION_LEVELS.filter((l) => l !== currentLevel);
  const defaultTarget =
    otherLevels.find((l) => LEVEL_RANK[l] > LEVEL_RANK[currentLevel]) ?? otherLevels[0];

  const [targetLevel, setTargetLevel] = React.useState<ActivationLevel>(defaultTarget);
  const [submitting, setSubmitting] = React.useState(false);
  const [commanderError, setCommanderError] = React.useState<string | null>(null);
  const [genericError, setGenericError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTargetLevel(defaultTarget);
      setCommanderError(null);
      setGenericError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, currentLevel]);

  const isEscalation = LEVEL_RANK[targetLevel] > LEVEL_RANK[currentLevel];

  const levelOptions: SelectOption[] = otherLevels.map((l) => ({ value: l, label: l }));

  const handleConfirm = async () => {
    setSubmitting(true);
    setCommanderError(null);
    setGenericError(null);
    try {
      await apiPost(`/api/v1/incidents/${incidentId}/activation`, {
        activation_level: targetLevel,
        confirmed: true,
      });
      onChanged();
      onClose();
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'NO_COMMANDER_ASSIGNED') {
        // Do NOT call onChanged() — the parent's incident data is never
        // refetched, so the activation-level display visibly stays at
        // currentLevel after this modal closes.
        setCommanderError(err.message);
      } else {
        setGenericError(
          err instanceof ApiRequestError ? err.message : 'Could not change the activation level.',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      danger={isEscalation}
      title={
        isEscalation
          ? `Escalate ${incidentName} to ${targetLevel} activation?`
          : `De-escalate ${incidentName} to ${targetLevel}?`
      }
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Keep at {currentLevel}
          </Button>
          <Button
            variant={isEscalation ? 'danger' : 'secondary'}
            onClick={() => void handleConfirm()}
            loading={submitting}
          >
            {isEscalation ? 'Escalate to' : 'De-escalate to'} {targetLevel}
          </Button>
        </>
      }
    >
      {otherLevels.length > 1 ? (
        <Select
          label="New activation level"
          options={levelOptions}
          value={targetLevel}
          onChange={(e) => setTargetLevel(e.target.value as ActivationLevel)}
        />
      ) : null}

      <p>{CONSEQUENCE_FOR_LEVEL[targetLevel]}</p>

      {commanderError ? (
        <Alert tone="danger" title="Assign an Incident Commander first">
          {commanderError}
        </Alert>
      ) : null}

      {genericError ? (
        <Alert tone="danger" title="Could not change the activation level">
          {genericError}
        </Alert>
      ) : null}
    </Modal>
  );
}
