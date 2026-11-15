## API Endpoints — Plans, Notifications, Reporting & AI (Y1c)

Covers F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage).

### Plans (F3)

**`GET /api/v1/plans`** (filterable: type, status, jurisdiction) / **`POST /api/v1/plans`**
Request (POST): `{ name, type, jurisdiction_id, content_sections: [{heading, body}] }`

**`GET /api/v1/plans/{id}`** / **`PATCH /api/v1/plans/{id}`**
Errors: `404 PLAN_NOT_FOUND`

**`POST /api/v1/plans/{id}/submit-review`**
Errors: `422 PLAN_EMPTY`

**`POST /api/v1/plans/{id}/review`**
Request: `{ review_action: "approve"|"request_changes", comments? }`
Errors: `403 SELF_APPROVAL_BLOCKED`

**`POST /api/v1/plans/{id}/sections/{sectionId}/link-tasks`**
Request: `{ task_template_ids: [UUID] }` or `{ new_template: {default_title, default_owner_role, default_due_offset_minutes} }`

**`POST /api/v1/plans/import`**
Request: `{ source_document_ref, mode: "import_copy"|"link_live" }`
Errors: `403 IMPORT_PERMISSION_DENIED`, `200 PLAN_SOURCE_CHANGED` (flagged on subsequent sync)

### Notifications (F5)

**`GET /api/v1/recipient-groups`** / **`POST /api/v1/recipient-groups`**
Request (POST): `{ name, type: "Role"|"Jurisdiction"|"Geography", selector }`

**`GET /api/v1/message-templates`** / **`POST /api/v1/message-templates`**
Request (POST): `{ name, category, body }`

**`POST /api/v1/notifications/compose`**
Request: `{ recipient_group_ids?, geotarget_polygon?, message_body, channels, incident_id? }`
Errors: `422 NO_AUDIENCE_SELECTED`, `422 MESSAGE_TOO_LONG`

**`POST /api/v1/notifications/{id}/send`**
Request: `{ approver_id, confirmed: true }`
Errors: `403 APPROVER_MISMATCH`, `400 AIDRAFT_NOT_APPROVED`, `503 CHANNEL_UNAVAILABLE`

**`GET /api/v1/notifications/{id}/delivery-status`**
Response: `{ recipients: [{name, channel, status, failure_reason?}], ack_percentage }`

### Reporting (F7)

**`POST /api/v1/incidents/{id}/sitreps`**
Request: `{ include_ai_draft?: boolean }` → Response: auto-assembled draft from Timeline/tasks/resource-requests.

**`POST /api/v1/incidents/{id}/aar`**
Request: `{ findings: [{text, category, corrective_action, owner_id, due_date}] }`
Errors: `409 INCIDENT_NOT_CLOSED`, `422 CORRECTIVE_ACTION_UNOWNED`

**`PATCH /api/v1/incidents/{id}/aar/{aarId}/finalize`**
Errors: `403 DOCUMENT_IMMUTABLE` (on any subsequent edit attempt)

**`GET /api/v1/evidence-log`** (filterable: date_range, actor_id, action_type, record_type)
**`GET /api/v1/evidence-log/export?format=csv|pdf`**
Errors: `500 EXPORT_FAILED`

**`GET /api/v1/analytics/kpis?date_range={...}&jurisdiction_scope={...}`**
Response: `{ kpis: [{name, value, definition, baseline, target?, owner, review_cadence, period, source}] }` — `target` omitted entirely (not zero/null-displayed) when undefined.
Errors: `504 ANALYTICS_TIMEOUT`

### AI Assistance (F9)

**`GET /api/v1/signals`** (filterable: status, confidence)
Response: `{ items: [{id, summary, confidence_label, confidence_reason, detected_at, status}] }`

**`POST /api/v1/signals/{id}/promote`**
Returns a pre-fill payload only — does NOT create an incident. Response: `{ prefill: {name_suggestion, type_suggestion, severity_suggestion, source_signal_id} }`
Errors: `400 PROMOTE_REQUIRES_HUMAN_SUBMIT` (if caller attempts to treat this as incident creation)

**`POST /api/v1/signals/{id}/dismiss`**
Request: `{ reason }`

**`POST /api/v1/ai-drafts`**
Request: `{ target_feature, target_field, context, requesting_user_id }`
Response: `{ id, draft_text, sources: [{source, time, confidence}], confidence_label }`
Errors: `503 AI_GATEWAY_UNAVAILABLE`, `200 AIDRAFT_NO_SOURCE` (flagged in response body)

**`POST /api/v1/ai-drafts/{id}/approve`**
Request: `{ approver_id, edited_text? }`
Errors: `403 APPROVAL_REQUIRES_NAMED_USER`

**`POST /api/v1/ai-drafts/{id}/discard`**

### Server-Side AI Governance Guard (applies across F1/F5/F7 write endpoints)
Every endpoint listed above that writes to an official record (`ics-forms`, `notifications/{id}/send`, `sitreps`, `aar`) rejects any payload tagged `ai_origin: true` lacking non-null `approved_by`/`approved_at` with `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` — enforced independent of UI client.
