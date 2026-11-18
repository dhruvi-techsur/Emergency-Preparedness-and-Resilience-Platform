import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Tabs,
  Timeline,
  EmptyState,
  Badge,
  Avatar,
  Button,
  type BadgeTone,
  type TabItem,
  type TimelineItem,
} from '@epmp/design-system';
import { apiGet, ApiRequestError } from '../../lib/api-client';
import { CommandRoleModal } from './CommandRoleModal';
import { ActivationModal } from './ActivationModal';
import { ClosureModal } from './ClosureModal';
import { TaskList } from '../tasks-resources/TaskList';
import { ResourceRequestList } from '../tasks-resources/ResourceRequestList';
import './IncidentWorkspace.css';

type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';
type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';
type CommandRoleTitle =
  | 'Incident Commander'
  | 'Planning'
  | 'Logistics'
  | 'Operations'
  | 'Finance/Admin'
  | 'Public Information';

/** The 6 FRD-defined ICS command-role titles, in display order — this
 * exact set/order is rendered on every incident regardless of which roles
 * are actually assigned, per S1.3's pinned command-role Card spec. */
const COMMAND_ROLE_TITLES: CommandRoleTitle[] = [
  'Incident Commander',
  'Planning',
  'Logistics',
  'Operations',
  'Finance/Admin',
  'Public Information',
];

/** Exact FRD tone mapping for incident severity (same mapping IncidentList
 * uses) — rendered via Badge, never a raw colored span. */
const SEVERITY_TONE: Record<Severity, BadgeTone> = {
  Critical: 'danger',
  Elevated: 'warning',
  Watch: 'info',
  Normal: 'success',
};

interface CommandRoleAssignment {
  role_title: CommandRoleTitle;
  person: { id: string; name: string };
  assigned_at: string;
}

interface IncidentDetail {
  id: string;
  name: string;
  type: string;
  severity: Severity;
  jurisdiction: { id: string; name: string };
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  opened_at: string;
  description?: string;
  command_roles: CommandRoleAssignment[];
}

interface TimelineEntry {
  id: string;
  occurred_at: string;
  title: string;
  meta?: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  actor: { id: string; name: string } | null;
  source: string;
}

interface TimelineResponse {
  items: TimelineEntry[];
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** 24-hour monospace time, per Timeline's documented entry format
 * ("time (incident zone, 24-hour, monospace)"). */
function formatTime24h(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/** This EXACT 4-tab order — Timeline, Tasks, Resources, Reports — renders
 * unconditionally on every incident (never reordered/omitted), per F1's
 * "2-6 tabs, same order every incident" and this plan's 4-tab set. */
const WORKSPACE_TABS: TabItem[] = [
  { id: 'timeline', label: 'Timeline' }, { id: 'tasks', label: 'Tasks' }, { id: 'resources', label: 'Resources' }, { id: 'reports', label: 'Reports' },
];

/**
 * F1 S1.3 — Incident Workspace. Routed `/incidents/:id`.
 *
 * `Generate SITREP` (PageHeader action) remains a deliberate Phase-2 UI
 * placeholder wired to a no-op handler: SITREP generation (F7) ships in a
 * later phase (F7/F9, Phase 4/6 per the roadmap) and is correctly out of
 * THIS phase's (F3/F4) scope — same reasoning the Reports tab below
 * documents. `New task`, by contrast, is this phase's own 03-08 fix: it
 * now navigates to a real pre-filled create-task form instead of 02-06's
 * no-op handler, since F4 (task creation) is exactly what this phase
 * ships.
 *
 * The Tasks and Resources tabs below render the REAL embedded
 * `TaskList`/`ResourceRequestList` components (03-06), replacing 02-06's
 * "ships in a later phase" placeholders — this is 03-08's whole purpose:
 * proving F3's materialized tasks and F4's resource requests are visible
 * inside the SAME incident workspace a real user already works in. The
 * Reports tab's placeholder is intentionally left untouched (see below).
 */
export function IncidentWorkspace(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('timeline');
  const [roleModalRole, setRoleModalRole] = React.useState<CommandRoleTitle | null>(null);
  const [activationModalOpen, setActivationModalOpen] = React.useState(false);
  const [closureModalOpen, setClosureModalOpen] = React.useState(false);

  const incidentQuery = useQuery({
    queryKey: ['incident', id],
    queryFn: () => apiGet<IncidentDetail>(`/api/v1/incidents/${id}`),
    enabled: Boolean(id),
  });

  const timelineQuery = useQuery({
    queryKey: ['incident-timeline', id],
    queryFn: () => apiGet<TimelineResponse>(`/api/v1/incidents/${id}/timeline`),
    enabled: Boolean(id),
  });

  const refetchAll = () => {
    void queryClient.invalidateQueries({ queryKey: ['incident', id] });
    void queryClient.invalidateQueries({ queryKey: ['incident-timeline', id] });
  };

  if (incidentQuery.isError) {
    const message =
      incidentQuery.error instanceof ApiRequestError
        ? incidentQuery.error.body.message
        : 'Could not load this incident.';
    return (
      <div className="ep-incident-workspace">
        <EmptyState
          title="Incident not found"
          action={
            <Button variant="primary" onClick={() => navigate('/incidents')}>
              Back to incidents
            </Button>
          }
        >
          {message}
        </EmptyState>
      </div>
    );
  }

  if (incidentQuery.isLoading || !incidentQuery.data) {
    return <div className="ep-incident-workspace" aria-busy="true" />;
  }

  const incident = incidentQuery.data;

  const roleByTitle = new Map(incident.command_roles.map((r) => [r.role_title, r]));

  const timelineItems: TimelineItem[] = (timelineQuery.data?.items ?? []).map((entry) => ({
    time: formatTime24h(entry.occurred_at),
    title: entry.title,
    meta: `${entry.actor?.name ?? 'System'} via ${entry.source}`,
    tone: entry.tone,
  }));

  return (
    <div className="ep-incident-workspace">
      <PageHeader
        title={incident.name}
        status={<Badge tone={SEVERITY_TONE[incident.severity]}>{incident.severity}</Badge>}
        subtitle={`${incident.jurisdiction.name} \u00b7 Opened ${formatDate(incident.opened_at)}`}
        actions={[
          // Phase-2 placeholder, still correctly deferred: SITREP
          // generation ships with F7/F9 (Phase 4/6), out of this phase's
          // F3/F4 scope — unchanged by 03-08.
          <Button key="sitrep" variant="secondary" onClick={() => {}}>
            Generate SITREP
          </Button>,
          // 03-08 fix: F4 (task creation) IS this phase's scope, so this
          // now navigates to the real, incident-pre-filled Create Task
          // form (03-06's CreateTask, routed at
          // /incidents/{id}/tasks/new) instead of 02-06's no-op handler.
          <Button
            key="new-task"
            variant="primary"
            onClick={() => navigate(`/incidents/${incident.id}/tasks/new`)}
          >
            New task
          </Button>,
          // F1 Process step 7 — closure is only offered while the incident
          // is still Open; a Closed incident has no further action here.
          ...(incident.status === 'Open'
            ? [
                <Button key="close" variant="secondary" onClick={() => setClosureModalOpen(true)}>
                  Close incident
                </Button>,
              ]
            : []),
        ]}
      />

      <div className="ep-incident-workspace__activation">
        <Button variant="ghost" size="sm" onClick={() => setActivationModalOpen(true)}>
          Activation: {incident.activation_level}
        </Button>
      </div>

      <div className="ep-incident-workspace__layout">
        <div className="ep-incident-workspace__main">
          <Tabs tabs={WORKSPACE_TABS} value={activeTab} onChange={setActiveTab} />

          <div
            role="tabpanel"
            id="ep-tabpanel-timeline"
            aria-labelledby="ep-tab-timeline"
            hidden={activeTab !== 'timeline'}
          >
            {activeTab === 'timeline' ? (
              timelineItems.length > 0 ? (
                <Timeline items={timelineItems} />
              ) : (
                <EmptyState title="No activity yet" />
              )
            ) : null}
          </div>

          <div
            role="tabpanel"
            id="ep-tabpanel-tasks"
            aria-labelledby="ep-tab-tasks"
            hidden={activeTab !== 'tasks'}
          >
            {/* 03-08: replaces 02-06's deliberate Phase-2 Tasks-tab
                placeholder (F4 "built in a later phase" EmptyState) with
                the real, incident-scoped TaskList (03-06) — the Incident
                column is omitted automatically since `incidentId` is
                provided (see TaskList's own prop doc comment). Mounted
                only while this tab is active, so its own ~30s poll
                doesn't run against a hidden tab. */}
            {activeTab === 'tasks' ? <TaskList incidentId={incident.id} /> : null}
          </div>

          <div
            role="tabpanel"
            id="ep-tabpanel-resources"
            aria-labelledby="ep-tab-resources"
            hidden={activeTab !== 'resources'}
          >
            {/* 03-08: replaces 02-06's deliberate Phase-2 Resources-tab
                placeholder with the real, incident-scoped
                ResourceRequestList (03-06) — same incidentId-omits-column
                pattern as TaskList above. */}
            {activeTab === 'resources' ? <ResourceRequestList incidentId={incident.id} /> : null}
          </div>

          <div
            role="tabpanel"
            id="ep-tabpanel-reports"
            aria-labelledby="ep-tab-reports"
            hidden={activeTab !== 'reports'}
          >
            {/* Deliberately UNCHANGED by 03-08: ICS forms/SITREPs (F7/F9)
                ship in a later phase (Phase 4/6 per the roadmap) — this
                plan's scope is strictly F3/F4, not F7/F9, so only 2 of
                the workspace's 4 tab placeholders (Tasks, Resources) are
                replaced here; this one remains a correct, deliberate
                placeholder exactly as 02-06 documented it. */}
            {activeTab === 'reports' ? (
              <EmptyState title="Reports ship in a later phase">
                ICS forms and SITREPs ship in a later phase (F7/F9).
              </EmptyState>
            ) : null}
          </div>
        </div>

        <div className="ep-incident-workspace__side">
          <Card title="Command roles">
            {COMMAND_ROLE_TITLES.map((roleTitle) => {
              const assignment = roleByTitle.get(roleTitle);
              return (
                <div key={roleTitle} className="ep-incident-workspace__role-row">
                  <Avatar name={assignment?.person.name ?? roleTitle} />
                  <div className="ep-incident-workspace__role-text">
                    <p>{roleTitle}</p>
                    <p className="caption">{assignment?.person.name ?? 'Unassigned'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setRoleModalRole(roleTitle)}
                  >
                    {assignment ? 'Reassign' : 'Assign'}
                  </Button>
                </div>
              );
            })}
          </Card>

          {/*
            Map-thumbnail placeholder — a deliberate Phase-2 simplification:
            embedding a second MapCanvas instance inside the workspace is
            out of this plan's 2-3-task budget, so this renders a link out
            to F2's full operating picture (scoped to this incident) rather
            than a live mini-map.
          */}
          <Card title="Map">
            <p className="caption">
              The full operating picture, scoped to this incident, is available separately.
            </p>
            <Button
              variant="ghost"
              onClick={() => navigate(`/operating-picture?incident=${incident.id}`)}
            >
              View on operating picture
            </Button>
          </Card>
        </div>
      </div>

      <CommandRoleModal
        incidentId={incident.id}
        roleTitle={roleModalRole ?? 'Incident Commander'}
        currentAssignee={roleModalRole ? roleByTitle.get(roleModalRole)?.person : undefined}
        open={roleModalRole !== null}
        onClose={() => setRoleModalRole(null)}
        onAssigned={refetchAll}
      />

      <ActivationModal
        incidentId={incident.id}
        incidentName={incident.name}
        currentLevel={incident.activation_level}
        open={activationModalOpen}
        onClose={() => setActivationModalOpen(false)}
        onChanged={refetchAll}
      />

      <ClosureModal
        incidentId={incident.id}
        incidentName={incident.name}
        open={closureModalOpen}
        onClose={() => setClosureModalOpen(false)}
        onClosed={refetchAll}
      />
    </div>
  );
}
