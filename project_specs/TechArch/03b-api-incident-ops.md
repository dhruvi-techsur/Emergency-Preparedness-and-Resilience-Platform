## 4b. API — Incident Operations

Covers F1 (Incident/ICS), F2 (Common Operating Picture), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations).

### TypeScript Interfaces

```typescript
type Severity = 'Critical' | 'Elevated' | 'Watch' | 'Normal';
type ActivationLevel = 'Monitoring' | 'Partial' | 'Full';
type TaskStatus = 'Open' | 'In progress' | 'Awaiting approval' | 'Done' | 'Overdue';
type ResourceRequestStatus = 'Draft' | 'Awaiting approval' | 'Approved' | 'Fulfilled' | 'Declined';
type CommandRoleTitle = 'Incident Commander' | 'Planning' | 'Logistics' | 'Operations' | 'Finance/Admin' | 'Public Information';

interface Incident {
  id: string;
  name: string;
  type: 'Flood' | 'Wildfire' | 'Severe Weather' | 'HazMat' | 'Public Health' | 'Other';
  severity: Severity;
  jurisdiction: { id: string; name: string };
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  opened_at: string;
  commander: { id: string; name: string } | null;
}

interface IncidentDetail extends Incident {
  description?: string;
  closed_at: string | null;
  command_roles: Array<{ role_title: CommandRoleTitle; person: { id: string; name: string }; assigned_at: string }>;
}

interface TimelineEntry {
  id: string;
  occurred_at: string;
  title: string;
  meta?: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
  actor: { id: string; name: string } | null;
  source: string;
  detail?: Record<string, unknown>;
}

interface IcsForm {
  id: string;
  incident_id: string;
  form_type: string;
  status: 'Draft' | 'Approved';
  content: Record<string, unknown>;
  ai_origin: boolean;
  approved_by?: { id: string; name: string };
  approved_at?: string;
}

interface MapMarker {
  id: string;
  type: 'incident' | 'facility' | 'resource' | 'shelter';
  shape: 'diamond' | 'square' | 'triangle' | 'circle';
  tone: string;
  label: string;
  status: string;
  location: { lat: number; lng: number };
  provenance?: Provenance;
}

interface OperatingPictureResponse {
  markers: MapMarker[];
  status_bar: { as_of: string; base_layer_source: string };
}

interface MapLayer {
  id: string; label: string; source: string; as_of: string;
  verified: boolean; count: number; checked: boolean;
}

interface DashboardSummary {
  active_incidents: number;
  open_tasks: number;
  pending_resource_requests: number;
  notifications_pending_ack: number;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner: { id: string; name: string };
  incident_id?: string;
  plan_section_id?: string;
  due_at: string;
}

interface ResourceRequest {
  id: string;
  resource_type: 'Personnel' | 'Equipment' | 'Supplies';
  description: string;
  quantity: number;
  status: ResourceRequestStatus;
  incident_id: string;
  task_id?: string;
  requesting_role: string;
  needed_by: string;
  requested_by: { id: string; name: string };
  decline_reason?: string;
  assigned_to?: string;
}

interface FieldReport {
  id: string;
  client_report_id: string; // client-generated, idempotency key
  incident_id?: string;
  observation_type: string;
  description?: string;
  location?: { lat: number; lng: number; accuracy_m: number };
  captured_at: string; // client capture time, preserved through sync
  sync_status: 'synced' | 'conflict' | 'failed';
}

interface SyncBatchResult {
  client_report_id: string;
  status: 'synced' | 'conflict' | 'failed';
  conflict_id?: string;
}

interface SyncConflict {
  id: string;
  entity_type: string;
  entity_id: string;
  field_version: Record<string, unknown>;
  eoc_version: Record<string, unknown>;
  resolution: 'keep_mine' | 'keep_eoc' | null;
}
```

### Endpoints

**Incidents (F1)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/incidents` | query: severity, activation_level, jurisdiction, status, page | `ListResponse<Incident>` | — |
| POST | `/api/v1/incidents` | `{ name, type, severity, jurisdiction_id, description?, opened_at }` | `201 IncidentDetail` | `409 INCIDENT_POSSIBLE_DUPLICATE` |
| GET / PATCH | `/api/v1/incidents/{id}` | (PATCH) `Partial<IncidentDetail>` | `IncidentDetail` | `404 INCIDENT_NOT_FOUND` |
| POST | `/api/v1/incidents/{id}/activation` | `{ activation_level: ActivationLevel; confirmed: true }` | `IncidentDetail` | `422 NO_COMMANDER_ASSIGNED` |
| POST | `/api/v1/incidents/{id}/command-roles` | `{ role_title: CommandRoleTitle; person_id: string }` | `IncidentDetail['command_roles'][0]` | `500 TIMELINE_WRITE_FAILED` |
| GET | `/api/v1/incidents/{id}/timeline` | (append-only, newest-first) | `ListResponse<TimelineEntry>` | — |
| GET / POST | `/api/v1/incidents/{id}/ics-forms` | (POST) `{ form_type, content }` | `IcsForm[]` / `IcsForm` | — |
| POST | `/api/v1/incidents/{id}/ics-forms/{formId}/approve` | `{ approved_by: string }` | `IcsForm` | `403 APPROVAL_REQUIRES_NAMED_USER` |

**Operating Picture (F2)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/operating-picture/markers` | query: bbox, jurisdiction_scope | `OperatingPictureResponse` | `500 MARKER_FETCH_FAILED` |
| GET | `/api/v1/operating-picture/layers` | — | `{ layers: MapLayer[] }` | — |
| GET | `/api/v1/dashboard/summary` | query: jurisdiction_scope | `DashboardSummary` | `504 DASHBOARD_TIMEOUT` |

**Tasks (F4)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/tasks` | query: owner, status, incident, due_window | `ListResponse<Task>` | — |
| POST | `/api/v1/tasks` | `{ title, description?, owner_id, due_at, incident_id?, plan_section_id? }` | `201 Task` | `422 TASK_OWNER_REQUIRED`, `422 DUE_DATE_PAST` |
| PATCH | `/api/v1/tasks/{id}/status` | `{ new_status: TaskStatus }` | `Task` | `409 INVALID_STATUS_TRANSITION`, `404 RECORD_NOT_FOUND` |

**Resource Requests (F4)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/resource-requests` | query: status, type, incident | `ListResponse<ResourceRequest>` | — |
| POST | `/api/v1/resource-requests` | `{ resource_type, description, quantity, incident_id, needed_by, requesting_role }` | `201 ResourceRequest` | — |
| POST | `/api/v1/resource-requests/{id}/approve` | — | `ResourceRequest` | — |
| POST | `/api/v1/resource-requests/{id}/decline` | `{ reason: string }` | `ResourceRequest` | `422 DECLINE_REASON_REQUIRED` |
| POST | `/api/v1/resource-requests/{id}/fulfill` | `{ assigned_to: string }` | `ResourceRequest` | — |

**Field Reports (F6)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| POST | `/api/v1/field-reports` | `FieldReport` (idempotent via `client_report_id`) | `201 { id, sync_status }` | `422 REPORT_EMPTY`, `507 QUEUE_STORAGE_FULL` (client-side) |
| POST | `/api/v1/field-reports/sync-batch` | `{ reports: FieldReport[] }` (creation order) | `{ results: SyncBatchResult[] }` | — |
| POST | `/api/v1/field-reports/{id}/photos` | multipart | `204` | `500 PHOTO_UPLOAD_FAILED` (non-blocking) |
| POST | `/api/v1/sync-conflicts/{id}/resolve` | `{ resolution: 'keep_mine' \| 'keep_eoc' }` | `SyncConflict` | — |

**Common conventions:** all `incident_id` references are validated against the requester's `jurisdiction_scope` (`403 JURISDICTION_SCOPE_DENIED` otherwise); all list endpoints support `page`/`page_size` per the shared `ListResponse<T>` envelope.
