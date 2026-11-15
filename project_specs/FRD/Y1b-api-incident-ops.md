## API Endpoints — Incident Operations (Y1b)

Covers F1 (Incident/ICS), F2 (Common Operating Picture), F4 (Tasks & Resource Requests), F6 (Mobile Field Operations).

### Incidents (F1)

**`GET /api/v1/incidents`** (paginated, filterable: severity, activation_level, jurisdiction, status)
Response: `{ items: [{id, name, type, severity, jurisdiction, activation_level, status, opened_at, commander}], total }`

**`POST /api/v1/incidents`**
Request: `{ name, type, severity, jurisdiction_id, description?, opened_at }`
Response: `201 { id, ...incident }` · Errors: `409 INCIDENT_POSSIBLE_DUPLICATE`

**`GET /api/v1/incidents/{id}`** / **`PATCH /api/v1/incidents/{id}`**
Errors: `404 INCIDENT_NOT_FOUND`

**`POST /api/v1/incidents/{id}/activation`**
Request: `{ activation_level: "Monitoring"|"Partial"|"Full", confirmed: true }`
Errors: `422 NO_COMMANDER_ASSIGNED`

**`POST /api/v1/incidents/{id}/command-roles`**
Request: `{ role_title, person_id }` · Errors: `500 TIMELINE_WRITE_FAILED`

**`GET /api/v1/incidents/{id}/timeline`** (append-only, newest-first) / **`POST /api/v1/incidents/{id}/timeline`** (system/internal use only — not a general-purpose write API; entries are created as side effects of other actions)

**`GET /api/v1/incidents/{id}/ics-forms`** / **`POST /api/v1/incidents/{id}/ics-forms`**
Request (POST): `{ form_type, content }`
**`POST /api/v1/incidents/{id}/ics-forms/{formId}/approve`**
Request: `{ approved_by }` · Errors: `403 APPROVAL_REQUIRES_NAMED_USER`

### Operating Picture (F2)

**`GET /api/v1/operating-picture/markers?bbox={...}&jurisdiction_scope={...}`**
Response: `{ markers: [{id, type, shape, tone, label, status, location}], status_bar: {as_of, base_layer_source} }`

**`GET /api/v1/operating-picture/layers`**
Response: `{ layers: [{id, label, source, as_of, verified, count, checked}] }`

**`GET /api/v1/dashboard/summary?jurisdiction_scope={...}`**
Response: `{ active_incidents, open_tasks, pending_resource_requests, notifications_pending_ack }`

### Tasks (F4)

**`GET /api/v1/tasks`** (filterable: owner, status, incident, due_window) / **`POST /api/v1/tasks`**
Request (POST): `{ title, description?, owner_id, due_at, incident_id?, plan_section_id? }`
Errors: `422 TASK_OWNER_REQUIRED`, `422 DUE_DATE_PAST`

**`PATCH /api/v1/tasks/{id}/status`**
Request: `{ new_status }` · Errors: `409 INVALID_STATUS_TRANSITION`, `404 RECORD_NOT_FOUND`

### Resource Requests (F4)

**`GET /api/v1/resource-requests`** (filterable: status, type, incident) / **`POST /api/v1/resource-requests`**
Request (POST): `{ resource_type, description, quantity, incident_id, needed_by, requesting_role }`

**`POST /api/v1/resource-requests/{id}/approve`**
**`POST /api/v1/resource-requests/{id}/decline`**
Request: `{ reason }` · Errors: `422 DECLINE_REASON_REQUIRED`

**`POST /api/v1/resource-requests/{id}/fulfill`**
Request: `{ assigned_to }`

### Field Reports (F6)

**`POST /api/v1/field-reports`** (idempotent via client-generated `report_id` = `client_report_id`)
Request: `{ client_report_id, incident_id?, observation_type, description?, location?, location_accuracy_m?, captured_at }`
Response: `201 { id, sync_status }` · Errors: `422 REPORT_EMPTY`, `507 QUEUE_STORAGE_FULL` (client-side guard)

**`POST /api/v1/field-reports/sync-batch`**
Request: `{ reports: [field_report payloads] }` — batch upload of queued offline items in creation order.
Response: `{ results: [{client_report_id, status: "synced"|"conflict"|"failed", conflict_id?}] }`

**`POST /api/v1/field-reports/{id}/photos`**
Multipart upload. Errors: `500 PHOTO_UPLOAD_FAILED` (does not block the rest of the report)

**`POST /api/v1/sync-conflicts/{id}/resolve`**
Request: `{ resolution: "keep_mine"|"keep_eoc" }`

**`PATCH /api/v1/tasks/{id}/status`** (shared with task status updates above; idempotent by `task_id` + client `captured_at`)

### Common Conventions
- All `incident_id` references validate against the requester's `jurisdiction_scope`; out-of-scope access returns `403 JURISDICTION_SCOPE_DENIED`.
- All list endpoints support `page`/`page_size` pagination per the common envelope (see `Y1a-api-auth-admin.md`).
