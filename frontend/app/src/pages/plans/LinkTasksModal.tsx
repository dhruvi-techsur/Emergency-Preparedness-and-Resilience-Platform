import * as React from 'react';
import { Modal, Button, TextField, Select, Alert, type SelectOption } from '@epmp/design-system';
import { apiPost, ApiRequestError } from '../../lib/api-client';

export interface LinkTasksModalExistingTemplate {
  id: string;
  /**
   * Optional — `GET /api/v1/plans/{id}` only returns each section's
   * `linked_task_templates` as a list of ids (03-03's literal
   * `fetchLinkedTaskTemplateIds()` response shape has no title/name
   * field), so a template linked in an EARLIER session has no title
   * available to display here without a new backend endpoint this plan
   * doesn't add. A template linked THIS session (via this same modal)
   * can carry its real title through local state instead. When absent,
   * a short id-derived placeholder is rendered so the row is still
   * informative without inventing data the API doesn't provide.
   */
  default_title?: string;
}

export interface LinkTasksModalProps {
  planId: string;
  sectionId: string;
  sectionHeading: string;
  existingTemplates: LinkTasksModalExistingTemplate[];
  open: boolean;
  onClose: () => void;
  onLinked: () => void;
}

/**
 * F3 S3.5 — Link Tasks to Plan Section (Modal).
 *
 * Phase 3 scope note (per 03-03's own documented schema reality —
 * plan_task_templates.plan_section_id is NOT NULL and fixed at creation):
 * a task template is created already-scoped to its section, so "linking an
 * existing template from elsewhere" is not a supported operation in this
 * schema shape. `existingTemplates` is therefore rendered as a read-only,
 * informational list (what's already linked to this section), and the
 * actual write path is exclusively "+ Define new template" below.
 *
 * "Default owner role" options: the FRD's Process step 5 describes
 * role-based default ownership, but the backend's actual resolution
 * (materialize.ts) matches `default_owner_role` against `roles.name` — the
 * system's 5 fixed PERSONA roles (eoc_director, incident_commander,
 * planning_logistics_chief, field_responder, secops_admin) — NOT the 6 ICS
 * "command role" titles (Incident Commander, Planning, Logistics, ...)
 * assigned per-incident via CommandRoleModal, which are a distinct concept
 * with similar-sounding names. This Select's options are the 5 real persona
 * role names so a submitted value actually resolves to an owner at
 * materialize-time, per Claude's discretion on "exact option source"
 * invited by this plan's task description.
 */
const PERSONA_ROLE_OPTIONS: SelectOption[] = [
  { value: '', label: 'No default owner' },
  { value: 'eoc_director', label: 'EOC Director' },
  { value: 'incident_commander', label: 'Incident Commander' },
  { value: 'planning_logistics_chief', label: 'Planning/Logistics Chief' },
  { value: 'field_responder', label: 'Field Responder' },
  { value: 'secops_admin', label: 'Security & Operations Admin' },
];

export function LinkTasksModal({
  planId,
  sectionId,
  sectionHeading,
  existingTemplates,
  open,
  onClose,
  onLinked,
}: LinkTasksModalProps): JSX.Element {
  const [defining, setDefining] = React.useState(false);
  const [name, setName] = React.useState('');
  const [ownerRole, setOwnerRole] = React.useState('');
  const [dueOffset, setDueOffset] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setDefining(false);
      setName('');
      setOwnerRole('');
      setDueOffset('');
      setError(null);
    }
  }, [open, sectionId]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiPost(`/api/v1/plans/${planId}/sections/${sectionId}/link-tasks`, {
        new_template: {
          default_title: name.trim(),
          ...(ownerRole ? { default_owner_role: ownerRole } : {}),
          ...(dueOffset.trim() ? { default_due_offset_minutes: Number(dueOffset) } : {}),
        },
      });
      onLinked();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Could not link this task template. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Link tasks to '${sectionHeading}'`}
      onClose={onClose}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {defining ? (
            <Button
              variant="primary"
              onClick={() => void handleSubmit()}
              loading={submitting}
              disabled={!name.trim()}
            >
              Link tasks
            </Button>
          ) : null}
        </>
      }
    >
      {error ? (
        <Alert tone="danger" title="Could not link task template">
          {error}
        </Alert>
      ) : null}

      <div className="ep-link-tasks-modal__existing">
        <p className="caption">Existing task templates for this section</p>
        {existingTemplates.length === 0 ? (
          <p className="caption">No task templates linked yet.</p>
        ) : (
          <ul>
            {existingTemplates.map((t) => (
              <li key={t.id}>{t.default_title ?? `Template ${t.id.slice(0, 8)}`}</li>
            ))}
          </ul>
        )}
      </div>

      {defining ? (
        <div className="ep-link-tasks-modal__new-template">
          <TextField
            label="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Default owner role"
            options={PERSONA_ROLE_OPTIONS}
            value={ownerRole}
            onChange={(e) => setOwnerRole(e.target.value)}
          />
          <TextField
            label="Due offset"
            type="number"
            min={0}
            hint="minutes after incident activation"
            value={dueOffset}
            onChange={(e) => setDueOffset(e.target.value)}
          />
        </div>
      ) : (
        <Button variant="ghost" onClick={() => setDefining(true)}>
          + Define new template
        </Button>
      )}
    </Modal>
  );
}
