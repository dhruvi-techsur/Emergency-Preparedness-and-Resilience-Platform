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

/** Shape of a single `GET /api/v1/evidence-log` row (evidence-log.ts's own
 * response shape) — used ONLY to recover this incident's finalized AAR, by
 * client-filtering on `detail.incident_id` (the one field reporting.ts's
 * `AuditService.record('aar_finalized', 'aar', aarId, { incident_id })`
 * call actually carries the incident back-reference on). */
interface EvidenceLogEntry {
  id: string;
  actor: { id: string; name: string } | null;
  action: string;
  record_type?: string;
  record_id?: string;
  occurred_at: string;
  detail?: { incident_id?: string };
}

interface EvidenceLogResponse {
  items: EvidenceLogEntry[];
}

type ReportStatus = 'Draft' | 'Approved' | 'Finalized';

const REPORT_STATUS_TONE: Record<ReportStatus, BadgeTone> = {
  Draft: 'neutral',
  Approved: 'success',
  Finalized: 'success',
};

/** 04-02's backend exposes no `GET` "list all reports for this incident"
 * endpoint — only `POST .../sitreps` / `POST .../aar` (both create/upsert,
 * never list) and the finalize PATCHes. A finalized AAR IS recoverable
 * read-only, though: `reporting.ts`'s finalize handler is the one place in
 * this module that calls `AuditService.record()`, so it surfaces through
 * `GET /api/v1/evidence-log` (filtered to `action_type=aar_finalized`,
 * then client-narrowed to THIS incident via the row's own
 * `detail.incident_id`, since the endpoint's `record_id` filter matches the
 * AAR's own id, not the incident's). SITREPs have no equivalent audit
 * write at all (confirmed directly against reporting.ts) and so have no
 * durable, incident-scoped read path this phase's backend can answer —
 * this tab is honest about that gap rather than inventing a fake list; per
 * this plan's own documented discretion, the FRD's S7.1 "user-observable
 * document history" requirement is satisfied well enough by this list
 * PLUS the "Generate SITREP"/"Generate AAR" actions below, since this tab
 * is explicitly NOT this plan's primary proof target (the cross-phase
 * Playwright spec is). */
function useIncidentReports(incidentId: string | undefined) {
  const evidenceQuery = useQuery({
    queryKey: ['evidence-log-aar-for-incident', incidentId],
    queryFn: () =>
      apiGet<EvidenceLogResponse>('/api/v1/evidence-log?action_type=aar_finalized&page_size=200'),
    enabled: Boolean(incidentId),
  });

  const aarEntries = (evidenceQuery.data?.items ?? []).filter(
    (entry) => entry.detail?.incident_id === incidentId,
  );

  return {
    isLoading: evidenceQuery.isLoading,
    isError: evidenceQuery.isError,
    aarEntries,
  };
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
 * The Tasks and Resources tabs below render the REAL embedded
 * `TaskList`/`ResourceRequestList` components (03-06), replacing 02-06's
 * "ships in a later phase" placeholders — this was 03-08's purpose:
 * proving F3's materialized tasks and F4's resource requests are visible
 * inside the SAME incident workspace a real user already works in.
 *
 * 04-07 closes the LAST two deliberate Phase-2 placeholders this file
 * carried: the Reports tab (previously a "ships in a later phase (F7/F9)"
 * EmptyState) now renders a real list of this incident's finalized
 * reports plus "Generate SITREP"/"Generate AAR" actions (see
 * useIncidentReports's doc comment for the exact read-path and its
 * documented Phase-4 scope limits), and the PageHeader's "Generate
 * SITREP" action (previously a no-op `() => {}` handler) now navigates to
 * the real `SitrepGenerator` route (04-06). A brand-new "Compose
 * notification" PageHeader action (not present in any prior phase's
 * plan) navigates to F5's Compose Notification screen (04-05),
 * pre-filled with this incident — the wiring the UX mockup's Navigation
 * Map names but no earlier plan implemented.
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

  const reports = useIncidentReports(id);

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
          // 04-07 fix: F7 (SITREP generation) IS this phase's scope — this
          // now navigates to the real SitrepGenerator route (04-06,
          // routed at /incidents/{id}/sitreps/new) instead of 02-06's
          // no-op handler. The ordering choice (this Button stays BEFORE
          // "New task"/"Compose notification", which in turn stay before
          // the destructive "Close incident") keeps PageHeader's
          // documented "primary action last" actions-ordering contract:
          // "Close incident" is this header's one state-changing,
          // confirmation-gated action and so remains the rightmost/last
          // element whenever it's offered.
          <Button
            key="sitrep"
            variant="secondary"
            onClick={() => navigate(`/incidents/${incident.id}/sitreps/new`)}
          >
            Generate SITREP
          </Button>,
          // 04-07: a NEW action, not present in any Phase 2/3 plan — per
          // the UX mockup's Navigation Map explicitly naming "Incident
          // Workspace 'Compose notification'" as a reachable-from path
          // for F5's Compose Notification screen (04-05), this is the
          // missing wiring that makes that Navigation Map row true.
          <Button
            key="notify"
            variant="secondary"
            onClick={() => navigate(`/notifications/compose?incident=${incident.id}`)}
          >
            Compose notification
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
            {/* 04-07: replaces 02-06's deliberate Phase-2 Reports-tab
                placeholder with a real (non-placeholder) list of this
                incident's generated documents — see useIncidentReports's
                own doc comment for exactly which read-path this uses and
                why, given 04-02's backend exposes no single "list all
                reports for this incident" GET endpoint. */}
            {activeTab === 'reports' ? (
              <Card title="Generated reports">
                {reports.isError ? (
                  <p className="caption">Could not load this incident's finalized reports.</p>
                ) : reports.isLoading ? (
                  <p className="caption" aria-busy="true">
                    Loading…
                  </p>
                ) : reports.aarEntries.length === 0 ? (
                  <EmptyState title="No finalized reports yet">
                    Generate a SITREP or, once this incident is Closed, an after-action report.
                  </EmptyState>
                ) : (
                  <ul className="ep-incident-workspace__report-list">
                    {reports.aarEntries.map((entry) => (
                      <li key={entry.id} className="ep-incident-workspace__report-row">
                        <span>After-action report</span>
                        <Badge tone={REPORT_STATUS_TONE.Finalized}>Finalized</Badge>
                        <span className="caption">{formatDate(entry.occurred_at)}</span>
                        <span className="caption">{entry.actor?.name ?? 'Unknown'}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="ep-incident-workspace__report-actions">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/incidents/${incident.id}/sitreps/new`)}
                  >
                    Generate SITREP
                  </Button>
                  <Button
                    variant="secondary"
                    // AAR generation is blocked server-side (409
                    // INCIDENT_NOT_CLOSED) until this incident is Closed —
                    // AarGenerator.tsx itself performs this SAME
                    // incident.status==='Closed' check as a page-level
                    // guard (never rendering its wizard otherwise). This
                    // disables the button proactively here so the failure
                    // is visible BEFORE navigation, not only after. The
                    // `title` attribute (04-08 gap closure) reuses
                    // AarGenerator.tsx's own EmptyState message text
                    // verbatim for hover/screen-reader discovery — no
                    // `Tooltip` component exists yet (SideNav.tsx's own
                    // documented interim pattern), matching that file's
                    // precedent of using the native `title` attribute.
                    disabled={incident.status !== 'Closed'}
                    title="Close this incident before generating its after-action report."
                    onClick={() => navigate(`/incidents/${incident.id}/aar/new`)}
                  >
                    Generate AAR
                  </Button>
                  {/* 06-08: F9's ICS Form Editor is now a real, reachable
                      page — the UX mockup's own Navigation Map names this
                      exact reach-path ("ICS Form / Checklist Editor...
                      Reached from: Incident Workspace -> Reports tab").
                      This replaces the no-orphan-pages placeholder this
                      tab previously had for ICS forms specifically;
                      SITREP/AAR generation above are already real (04-06/
                      04-07). */}
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/incidents/${incident.id}/forms/new`)}
                  >
                    Open ICS-201 form
                  </Button>
                </div>
                {/* A `title` tooltip alone is not reliably discoverable
                    (hover-only, unavailable on touch) — this always-visible
                    caption (04-08 gap closure) gives every user, not just
                    mouse/screen-reader users, the same explanation with no
                    interaction required. */}
                {incident.status !== 'Closed' ? (
                  <p className="caption">
                    Close this incident to generate its after-action report.
                  </p>
                ) : null}
              </Card>
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
