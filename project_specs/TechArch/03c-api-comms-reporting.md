## 4c. API — Plans, Notifications, Reporting & AI

Covers F3 (Plans & Playbooks), F5 (Notifications Integration), F7 (Reporting & Learning), F9 (AI-Assisted Drafting & Signal Triage).

### TypeScript Interfaces

```typescript
type PlanStatus = 'Draft' | 'Review' | 'Approved';
type PlanType = 'EOP' | 'SOP' | 'Annex';

interface Plan {
  id: string; name: string; type: PlanType; status: PlanStatus;
  jurisdiction_id: string; version: number;
  owner: { id: string; name: string };
}

interface PlanDetail extends Plan {
  sections: Array<{ id: string; heading: string; body: string; sort_order: number; linked_task_templates: string[] }>;
  version_history: Array<{ version_number: number; reviewed_by?: string; review_action?: string; reviewed_at?: string }>;
}

interface RecipientGroup {
  id: string; name: string; type: 'Role' | 'Jurisdiction' | 'Geography';
  selector: Record<string, unknown>; member_count?: number;
}

interface MessageTemplate {
  id: string; name: string; category?: string; body: string;
}

interface Notification {
  id: string;
  incident_id?: string;
  message_body: string;
  ai_origin: boolean;
  channels: string[];
  recipient_group_ids: string[];
  geotarget_polygon?: GeoJSON.Polygon;
  approved_by?: { id: string; name: string };
  sent_at?: string;
}

interface DeliveryStatusResponse {
  recipients: Array<{ name: string; channel: string; status: string; failure_reason?: string }>;
  ack_percentage: number;
}

interface Sitrep {
  id: string; incident_id: string; status: 'Draft' | 'Approved';
  content: Record<string, unknown>; ai_origin: boolean;
}

interface Aar {
  id: string; incident_id: string;
  timeline_export: TimelineEntry[];
  decisions_log: Record<string, unknown>[];
  resource_history: Record<string, unknown>[];
  status: 'Draft' | 'Finalized';
}

interface AarFinding {
  text: string; category?: string; corrective_action?: string;
  owner_id?: string; due_date?: string;
}

interface KpiResult {
  name: string; value: number; definition: string; baseline?: number;
  target?: number; // omitted entirely (not zero/null) when undefined
  owner: string; review_cadence: string; period: string; source: string;
}

interface Signal {
  id: string; summary: string; confidence_label: ConfidenceLabel;
  confidence_reason: string; detected_at: string;
  status: 'New' | 'Dismissed' | 'Promoted';
}

interface SignalPromotePrefill {
  prefill: {
    name_suggestion: string; type_suggestion: string;
    severity_suggestion: Severity; source_signal_id: string;
  };
}

interface AiDraftRequest {
  target_feature: 'ics_form' | 'notification' | 'sitrep' | 'aar';
  target_field: string;
  context: string;
  requesting_user_id: string;
}

interface AiDraftResponse {
  id: string;
  draft_text: string;
  sources: Array<{ source: string; time: string; confidence: ConfidenceLabel }>;
  confidence_label: ConfidenceLabel;
}
```

### Endpoints

**Plans (F3)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET / POST | `/api/v1/plans` | (POST) `{ name, type, jurisdiction_id, content_sections: [{heading, body}] }` | `ListResponse<Plan>` / `201 PlanDetail` | — |
| GET / PATCH | `/api/v1/plans/{id}` | (PATCH) `Partial<PlanDetail>` | `PlanDetail` | `404 PLAN_NOT_FOUND` |
| POST | `/api/v1/plans/{id}/submit-review` | — | `PlanDetail` | `422 PLAN_EMPTY` |
| POST | `/api/v1/plans/{id}/review` | `{ review_action: 'approve' \| 'request_changes'; comments? }` | `PlanDetail` | `403 SELF_APPROVAL_BLOCKED` |
| POST | `/api/v1/plans/{id}/sections/{sectionId}/link-tasks` | `{ task_template_ids?: string[]; new_template?: {...} }` | `204` | — |
| POST | `/api/v1/plans/import` | `{ source_document_ref, mode: 'import_copy' \| 'link_live' }` | `PlanDetail` | `403 IMPORT_PERMISSION_DENIED`, `200 PLAN_SOURCE_CHANGED` (flagged) |

**Notifications (F5)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET / POST | `/api/v1/recipient-groups` | (POST) `{ name, type, selector }` | `RecipientGroup[]` / `RecipientGroup` | — |
| GET / POST | `/api/v1/message-templates` | (POST) `{ name, category, body }` | `MessageTemplate[]` / `MessageTemplate` | — |
| POST | `/api/v1/notifications/compose` | `{ recipient_group_ids?, geotarget_polygon?, message_body, channels, incident_id? }` | `Notification` | `422 NO_AUDIENCE_SELECTED`, `422 MESSAGE_TOO_LONG` |
| POST | `/api/v1/notifications/{id}/send` | `{ approver_id, confirmed: true }` | `Notification` | `403 APPROVER_MISMATCH`, `400 AIDRAFT_NOT_APPROVED`, `503 CHANNEL_UNAVAILABLE` |
| GET | `/api/v1/notifications/{id}/delivery-status` | — | `DeliveryStatusResponse` | — |

**Reporting (F7)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| POST | `/api/v1/incidents/{id}/sitreps` | `{ include_ai_draft?: boolean }` | `Sitrep` | — |
| POST | `/api/v1/incidents/{id}/aar` | `{ findings: AarFinding[] }` | `Aar` | `409 INCIDENT_NOT_CLOSED`, `422 CORRECTIVE_ACTION_UNOWNED` |
| PATCH | `/api/v1/incidents/{id}/aar/{aarId}/finalize` | — | `Aar` | `403 DOCUMENT_IMMUTABLE` (on subsequent edit attempts) |
| GET | `/api/v1/evidence-log` | query: date_range, actor_id, action_type, record_type | `ListResponse<AuditLogEntry>` | — |
| GET | `/api/v1/evidence-log/export` | query: format=csv\|pdf | file stream | `500 EXPORT_FAILED` |
| GET | `/api/v1/analytics/kpis` | query: date_range, jurisdiction_scope | `{ kpis: KpiResult[] }` | `504 ANALYTICS_TIMEOUT` |

**AI Assistance (F9)**

| Method | Path | Request | Response | Errors |
|---|---|---|---|---|
| GET | `/api/v1/signals` | query: status, confidence | `ListResponse<Signal>` | — |
| POST | `/api/v1/signals/{id}/promote` | — (pre-fill only, never creates a record) | `SignalPromotePrefill` | `400 PROMOTE_REQUIRES_HUMAN_SUBMIT` |
| POST | `/api/v1/signals/{id}/dismiss` | `{ reason: string }` | `Signal` | — |
| POST | `/api/v1/ai-drafts` | `AiDraftRequest` | `AiDraftResponse` | `503 AI_GATEWAY_UNAVAILABLE`, `200 AIDRAFT_NO_SOURCE` (flagged) |
| POST | `/api/v1/ai-drafts/{id}/approve` | `{ approver_id: string; edited_text?: string }` | `{ id, approved_by, approved_at }` | `403 APPROVAL_REQUIRES_NAMED_USER` |
| POST | `/api/v1/ai-drafts/{id}/discard` | — | `204` | — |

### Server-Side AI Governance Guard

Every endpoint above that writes to an official record (`ics-forms`, `notifications/{id}/send`, `sitreps`, `aar`) rejects any payload tagged `ai_origin: true` lacking non-null `approved_by`/`approved_at` with `400 AIDRAFT_UNAPPROVED_WRITE_BLOCKED` — implemented as shared middleware (see `01-components.md` §2.4), enforced independent of which UI client calls the endpoint.
