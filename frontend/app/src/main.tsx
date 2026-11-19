// Flash-of-wrong-theme guard (F00-application-shell.md §Process 2): set
// data-theme synchronously, before any React render, so the document root
// never paints with the wrong theme even for a single frame. index.html's
// <body data-theme="light"> is the pre-JS default; this line is the
// earliest point at which JS runs, so it's a no-op confirming 'light'
// until RouteGuard resolves the user's real persisted preference and
// AppShell/ThemeSwitcher update the attribute again post-resolution.
document.documentElement.dataset.theme = document.body.dataset.theme ?? 'light';

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Monorepo-bundled loading (not the standalone <script>-tag pattern in
// EPMP-llm-build-guide.md, which targets a plain HTML page loading
// window.EPMP directly) — see index.html's comment for why these are
// ordinary ES module imports instead of raw <link> tags.
import '@epmp/design-system/tokens/tokens.css';
import '@epmp/design-system/dist/bundle.css';

import { RouteGuard } from './auth/RouteGuard';
import { SignInCallback } from './pages/SignInCallback';
import { AppShell } from './app-shell/AppShell';
import { UsersList } from './pages/admin/UsersList';
import { UserDetail } from './pages/admin/UserDetail';
import { RolesPermissions } from './pages/admin/RolesPermissions';
import { AuditLogView } from './pages/admin/AuditLogView';
import { SsoConfigForm } from './pages/admin/SsoConfigForm';
import { PlatformMonitoring } from './pages/admin/PlatformMonitoring';
import { IntegrationHealth } from './pages/admin/IntegrationHealth';
import { ApiClients } from './pages/admin/ApiClients';
import { FederationGrants } from './pages/admin/FederationGrants';
import { RecordAuthority } from './pages/admin/RecordAuthority';
import { IncidentList } from './pages/incidents/IncidentList';
import { CreateIncident } from './pages/incidents/CreateIncident';
import { IncidentWorkspace } from './pages/incidents/IncidentWorkspace';
import { OperatingPicture } from './pages/operating-picture/OperatingPicture';
import { PlanRepository } from './pages/plans/PlanRepository';
import { PlanDetail } from './pages/plans/PlanDetail';
import { PlanEditor } from './pages/plans/PlanEditor';
import { TaskList } from './pages/tasks-resources/TaskList';
import { CreateTask } from './pages/tasks-resources/CreateTask';
import { TaskDetail } from './pages/tasks-resources/TaskDetail';
import { ResourceRequestList } from './pages/tasks-resources/ResourceRequestList';
import { CreateResourceRequest } from './pages/tasks-resources/CreateResourceRequest';
import { ResourceRequestDetail } from './pages/tasks-resources/ResourceRequestDetail';
import { NotificationsLanding } from './pages/notifications/NotificationsLanding';
import { RecipientGroups } from './pages/notifications/RecipientGroups';
import { MessageTemplates } from './pages/notifications/MessageTemplates';
import { ComposeNotification } from './pages/notifications/ComposeNotification';
import { DeliveryTracking } from './pages/notifications/DeliveryTracking';
import { SitrepGenerator } from './pages/reporting/SitrepGenerator';
import { AarGenerator } from './pages/reporting/AarGenerator';
import { EvidenceLogView } from './pages/reporting/EvidenceLogView';
import { AnalyticsDashboard } from './pages/reporting/AnalyticsDashboard';
import { FieldHome } from './pages/field-mobile/FieldHome';
import { MyTasksField } from './pages/field-mobile/MyTasksField';
import { ReportObservation } from './pages/field-mobile/ReportObservation';
import { QueuedSubmissions } from './pages/field-mobile/QueuedSubmissions';
import { SyncConflictResolution } from './pages/field-mobile/SyncConflictResolution';
import { FieldMap } from './pages/field-mobile/FieldMap';
import { EocDashboard } from './pages/dashboard/EocDashboard';
import { MyWorkDashboard } from './pages/dashboard/MyWorkDashboard';

const queryClient = new QueryClient();

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RouteGuard>
          <Routes>
            <Route path="/auth/callback" element={<SignInCallback />} />
            {/* AppShell is a layout route (Outlet renders the matched
                child below) — 01-11's and 01-12's Admin-nav-group screens
                are the nested routes this shell composes. The "/*"
                parent still matches every path (so RouteGuard's
                isCallbackRoute check and any not-yet-built path keep
                rendering the shell with an empty Outlet), while
                react-router ranks the more specific child match first
                when the current path is one of these eight. */}
            <Route path="/*" element={<AppShell />}>
              <Route path="admin/users" element={<UsersList />} />
              <Route path="admin/users/:id" element={<UserDetail />} />
              <Route path="admin/roles" element={<RolesPermissions />} />
              <Route path="admin/audit-log" element={<AuditLogView />} />
              <Route path="admin/sso-config" element={<SsoConfigForm />} />
              <Route path="admin/platform-monitoring" element={<PlatformMonitoring />} />
              <Route path="admin/integration-health" element={<IntegrationHealth />} />
              <Route path="admin/api-clients" element={<ApiClients />} />
              <Route path="admin/federation-grants" element={<FederationGrants />} />
              <Route path="admin/record-authority" element={<RecordAuthority />} />
              <Route path="incidents" element={<IncidentList />} />
              <Route path="incidents/new" element={<CreateIncident />} />
              <Route path="incidents/:id" element={<IncidentWorkspace />} />
              <Route path="operating-picture" element={<OperatingPicture />} />
              <Route path="plans" element={<PlanRepository />} />
              <Route path="plans/new" element={<PlanEditor />} />
              <Route path="plans/:id" element={<PlanDetail />} />
              <Route path="plans/:id/edit" element={<PlanEditor />} />
              {/* F4 (03-06) — Tasks/Resource-Requests, standalone routes.
                  Both TaskList/ResourceRequestList also accept an optional
                  `incidentId` prop for 03-07's Incident Workspace tab
                  embedding (direct component render, not these routes). */}
              <Route path="tasks" element={<TaskList />} />
              <Route path="tasks/new" element={<CreateTask />} />
              <Route path="tasks/:id" element={<TaskDetail />} />
              <Route path="incidents/:incidentId/tasks/new" element={<CreateTask />} />
              <Route path="incidents/:incidentId/tasks/:id" element={<TaskDetail />} />
              <Route path="resource-requests" element={<ResourceRequestList />} />
              <Route path="resource-requests/new" element={<CreateResourceRequest />} />
              <Route path="resource-requests/:id" element={<ResourceRequestDetail />} />
              <Route
                path="incidents/:incidentId/resource-requests/new"
                element={<CreateResourceRequest />}
              />
              <Route
                path="incidents/:incidentId/resource-requests/:id"
                element={<ResourceRequestDetail />}
              />
              {/* F5 (04-05) — Notifications: Recipient Groups, Message
                  Templates, Compose (4-step flow, accepts optional
                  ?incident=<id>), Delivery & Acknowledgment Tracking.
                  Appended here (not AppShell.tsx itself — see this plan's
                  own sequencing note on the shared-file convention 02-05/
                  02-06 established: main.tsx owns the nested route tree,
                  AppShell.tsx is layout/chrome only) following the SAME
                  append-not-overwrite discipline 03-05/03-06 demonstrated
                  for their own two-same-wave-plans-touch-one-file
                  scenario — 04-06 (same wave) appends its own `/reports/*`
                  routes independently, with no compile-time dependency
                  between the two route sets. */}
              {/* 04-08 (gap closure): the bare `/notifications` landing
                  page — the UX mockup's Navigation Map documents Compose's
                  TWO reach-paths (this page's primary action / Incident
                  Workspace's own action, 04-07) as an OR-requirement; this
                  route is the half no prior plan wired. Registered BEFORE
                  the more-specific `groups`/`templates`/`compose`/
                  `:id/delivery` siblings below — react-router's path
                  matching has no ambiguity between a bare segment and its
                  more-specific siblings regardless of declaration order,
                  but the landing page is kept first here to read as the
                  "parent" of the group visually. */}
              <Route path="notifications" element={<NotificationsLanding />} />
              <Route path="notifications/groups" element={<RecipientGroups />} />
              <Route path="notifications/templates" element={<MessageTemplates />} />
              <Route path="notifications/compose" element={<ComposeNotification />} />
              <Route path="notifications/:id/delivery" element={<DeliveryTracking />} />
              {/* F7 (04-06) — Reporting & Learning: SITREP Generator, AAR
                  Generator, Evidence & Audit Log View, Analytics &
                  Reporting Dashboard. Appended here following the SAME
                  append-not-overwrite discipline 04-05 (same wave) used
                  for its own notifications/* routes above — no
                  compile-time dependency between the two route sets. */}
              <Route path="incidents/:id/sitreps/new" element={<SitrepGenerator />} />
              <Route path="incidents/:id/aar/new" element={<AarGenerator />} />
              <Route path="reports/evidence-log" element={<EvidenceLogView />} />
              <Route path="reports/analytics" element={<AnalyticsDashboard />} />
              {/* F6 (05-03) — Mobile Field Operations: this plan's own 3
                  screens only (Field Home, My Tasks field view, Report
                  Observation). 05-04 (same wave group, depends on this
                  plan) appends its own 3 remaining field-mobile routes
                  (field/queued, field/conflicts/:id, field/map) plus the
                  bottom-nav wiring — following the SAME append-not-
                  overwrite discipline 03-05/03-06 and 04-05/04-06
                  established for their own multi-plan shared-file edits.
                  This plan's own Playwright spec needs these 3 routes
                  live to prove the offline-first submit flow end-to-end,
                  so they are wired here rather than left for 05-04. */}
              <Route path="field" element={<FieldHome />} />
              <Route path="field/tasks" element={<MyTasksField />} />
              <Route path="field/report" element={<ReportObservation />} />
              {/* 05-04 (this plan) — the 3 remaining field-mobile routes,
                  appended after 05-03's own 3 per the SAME
                  append-not-overwrite discipline documented above. All 6
                  field-mobile screens are now reachable via the route
                  tree. */}
              <Route path="field/queued" element={<QueuedSubmissions />} />
              <Route path="field/conflicts/:id" element={<SyncConflictResolution />} />
              <Route path="field/map" element={<FieldMap />} />
              {/* F18 (06-06) — PER-01's EOC Dashboard and PER-03's My Work
                  Dashboard, the two genuinely NEW persona landing pages
                  this plan builds (PER-02's landing, /incidents, already
                  exists from Phase 2). This plan is always the FIRST to
                  append routes in this phase (06-07, wave 6, carries an
                  explicit depends_on this plan specifically because both
                  plans touch this file) — 06-07's own routes append AFTER
                  these two, following the SAME append-not-overwrite
                  discipline every other multi-plan shared-file edit in
                  this route tree already established. */}
              <Route path="dashboard" element={<EocDashboard />} />
              <Route path="my-work" element={<MyWorkDashboard />} />
            </Route>
          </Routes>
        </RouteGuard>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
