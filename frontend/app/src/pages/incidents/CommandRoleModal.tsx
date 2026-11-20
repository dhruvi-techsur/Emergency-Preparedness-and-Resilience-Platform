import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, Button, Combobox, Alert, type ComboboxOption } from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

type CommandRoleTitle =
  | 'Incident Commander'
  | 'Planning'
  | 'Logistics'
  | 'Operations'
  | 'Finance/Admin'
  | 'Public Information';

interface PersonnelSummary {
  id: string;
  name: string;
  email: string;
}

interface PersonnelResponse {
  items: PersonnelSummary[];
}

interface RosterRow {
  id: string;
  matched_user_id: string | null;
  qualifications: string[] | null;
}

interface RosterResponse {
  items: RosterRow[];
}

export interface CommandRoleModalProps {
  incidentId: string;
  roleTitle: CommandRoleTitle;
  currentAssignee?: { id: string; name: string };
  open: boolean;
  onClose: () => void;
  /** Called after a successful assignment — parent refetches incident + timeline. */
  onAssigned: () => void;
}

/**
 * F1 S1.4 — Command Role Assignment Modal.
 *
 * Personnel options are populated from `GET /api/v1/incidents/personnel`
 * (added in Phase 2's incidents.ts, gated by `incidents:view`) rather than
 * `GET /api/v1/admin/users` — the roles that actually hold `incidents:edit`
 * (incident_commander, eoc_director) deliberately hold no `admin:view`
 * permission (02-01's seed), so reusing the admin-users endpoint would
 * have required widening admin access to a role with no business there.
 *
 * F16-roster (Plan 09-04): roster qualification hints are now sourced
 * live from `GET /api/v1/integrations/hris/personnel` (Plan 09-02's
 * backend) — a second, independent useQuery merged client-side by
 * `matched_user_id === person.id` to append a qualification hint to each
 * option's existing `hint: u.email` text. The underlying person-selection
 * mechanism (the FK-constrained `person_id`, still sourced exclusively
 * from `GET /api/v1/incidents/personnel`) is UNCHANGED — this is purely an
 * enrichment of the hint text for people who happen to have a roster
 * match. A person with no roster match still appears exactly as before.
 */
export function CommandRoleModal({
  incidentId,
  roleTitle,
  currentAssignee,
  open,
  onClose,
  onAssigned,
}: CommandRoleModalProps): JSX.Element {
  const [selectedPersonId, setSelectedPersonId] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const personnelQuery = useQuery({
    queryKey: ['incidents-personnel'],
    queryFn: () => apiGet<PersonnelResponse>('/api/v1/incidents/personnel'),
    enabled: open,
  });

  const rosterQuery = useQuery({
    queryKey: ['hris-personnel-for-command-roles'],
    queryFn: () => apiGet<RosterResponse>('/api/v1/integrations/hris/personnel'),
    enabled: open,
  });

  React.useEffect(() => {
    if (open) {
      setSelectedPersonId('');
      setError(null);
    }
  }, [open, roleTitle]);

  const rosterByUserId = React.useMemo(() => {
    const map = new Map<string, RosterRow>();
    for (const row of rosterQuery.data?.items ?? []) {
      if (row.matched_user_id) map.set(row.matched_user_id, row);
    }
    return map;
  }, [rosterQuery.data]);

  const personnelOptions: ComboboxOption[] = (personnelQuery.data?.items ?? []).map((u) => {
    const roster = rosterByUserId.get(u.id);
    return {
      value: u.id,
      label: u.name,
      hint: roster
        ? `${u.email} \u00b7 ${(roster.qualifications ?? []).join(', ') || 'No qualifications recorded'}`
        : u.email,
    };
  });

  const handleAssign = async () => {
    if (!selectedPersonId) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiPost(`/api/v1/incidents/${incidentId}/command-roles`, {
        role_title: roleTitle,
        person_id: selectedPersonId,
      });
      onAssigned();
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Could not assign this role. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Assign ${roleTitle}`}
      onClose={onClose}
      width={480}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void handleAssign()} loading={submitting}>
            Assign role
          </Button>
        </>
      }
    >
      {currentAssignee ? <p>Currently assigned: {currentAssignee.name}</p> : null}

      {error ? (
        <Alert tone="danger" title="Could not assign role">
          {error}
        </Alert>
      ) : null}

      <Combobox
        label="Search personnel"
        options={personnelOptions}
        value={selectedPersonId}
        onChange={(value) => setSelectedPersonId(value)}
        loading={personnelQuery.isLoading}
        placeholder="Type a name"
      />
    </Modal>
  );
}
