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
            </Route>
          </Routes>
        </RouteGuard>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
