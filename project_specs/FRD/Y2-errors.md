## Y2: Cross-Feature Error Catalog

This catalog consolidates error scenarios that span more than one feature, or that represent platform-wide conventions. Feature-specific error tables live in each `F{nn}-*.md` chunk; this file is the authoritative reference for shared/cross-cutting error codes and the conventions all features must follow.

### Error Response Envelope (all endpoints)

```json
{
  "error_code": "STRING_CONSTANT",
  "message": "Human-readable, action-oriented message per content-and-voice.md",
  "details": { "optional": "structured context" }
}
```

- `message` must follow the design system's content rule: state the cause, then the fix. Never "something went wrong," never blame the user.
- HTTP status codes follow standard REST semantics: `400`/`422` client/validation errors, `401` authentication, `403` authorization/policy, `404` not found, `409` conflict/invalid state transition, `500`/`502`/`503`/`504` server/upstream errors, `507` storage exhaustion (client-side offline queue only).

### Cross-Feature Error Codes

| Scenario | HTTP Status | Error Code | Message | Originating Features |
|----------|-------------|------------|---------|----------------------|
| Session expired | 401 | SESSION_EXPIRED | "Your session has ended. Sign in again to continue." | F0, F8 |
| Role unresolved / no permissions mapped | 403 | ROLE_UNRESOLVED | "Your account isn't assigned a role yet. Contact your administrator." | F0, F8, F18 |
| Jurisdiction/federation scope denied | 403 | JURISDICTION_SCOPE_DENIED | "You don't have access to data for this jurisdiction." | F2, F10 |
| Federation grant expired/revoked | 403 | FEDERATION_ACCESS_DENIED | "Access to this data was revoked or has expired." | F10 |
| Record not found / no access | 404 | RECORD_NOT_FOUND | "This item no longer exists or you don't have access." | F1, F3, F4 |
| Timeline/audit write failed | 500 | TIMELINE_WRITE_FAILED | "This action didn't record to the incident timeline. Retry before continuing." | F1, F4 |
| Approval requires named person (non-AI context) | 403 | APPROVAL_REQUIRES_NAMED_USER | "Approval must be made by a signed-in person, not an automated process." | F1, F3, F9 |
| AI draft requires approval before use | 400 | AIDRAFT_NOT_APPROVED / AIDRAFT_UNAPPROVED_WRITE_BLOCKED | "This draft hasn't been approved. Approve it before it can be sent/saved." | F1, F5, F7, F9 |
| AI approval attempted by service/system account | 403 | APPROVAL_REQUIRES_NAMED_USER | "AI drafts must be approved by a signed-in person." | F9 |
| Record-authority conflict (external system owns record) | 409 | RECORD_AUTHORITY_CONFLICT | "[External system] owns this record. Changes must be made there, or flagged as a conflict for review." | F10, F13, F15, F16 |
| Sync conflict (field vs. EOC) | 409 | SYNC_CONFLICT | "This record differs from the current EOC record. Choose which version to keep." | F6, F13 |
| Edit attempted on an immutable/finalized record | 403 | DOCUMENT_IMMUTABLE / AUDIT_LOG_IMMUTABLE | "This record is finalized/immutable and can't be edited." | F7, F8 |
| Provenance missing on ingested data | 422 | PROVENANCE_REQUIRED | "This data is missing source, timestamp, or confidence and can't be accepted." | F10, F11, F12, F13, F15, F16, F17 |
| Upstream integration feed unavailable (graceful degrade) | 503/504 | *_FEED_UNAVAILABLE / *_FEED_TIMEOUT | "[System] is temporarily unavailable. [Fallback behavior description]." | F11, F12, F13, F14, F15, F16, F17 |
| Document/data import permission denied | 403 | IMPORT_PERMISSION_DENIED | "You don't have access to this document/data in the source system." | F3, F17 |
| Invalid status transition | 409 | INVALID_STATUS_TRANSITION | "This [task/request] can't move to [status] from its current state." | F4 |
| Export operation failed | 500 | EXPORT_FAILED | "This export didn't complete. Retry." | F7, F8 |
| Query timeout on large range | 504 | *_TIMEOUT | "This request is taking longer than expected. Narrow the range and retry." | F2, F7 |
| FedRAMP-claim guard (content/copy lint, not a runtime error) | n/a | FEDRAMP_CLAIM_BLOCKED | (Build-time/content-review check; no runtime HTTP response — any UI copy or API response text asserting FedRAMP authorization fails content review.) | All |

### Retry & Backoff Guidance (applies to all external integration features: F11–F17)

- All background polling/sync jobs use exponential backoff on failure (base interval → ×2 per consecutive failure, capped at a maximum interval defined in TechArch).
- Idempotency keys are required on all retried webhook/event-bus deliveries (F10); duplicate keys within the retry window are no-ops, not reprocessed, and never surfaced as a user-facing error.
- A feed/job in sustained backoff surfaces as `BACKGROUND_JOB_DEGRADED` (200, alert-level) in F8's Platform Monitoring (S8.7), not as a hard failure to end users interacting with already-cached data.

### Degraded/Offline-Mode Conventions (F2, F6)

- Loss of an external feed (GIS, hazard, CAD) never blocks the page: the last-known data remains visible, explicitly labeled with its age, and the relevant status indicator (`SyncStatus` or map status bar) reflects the degraded state.
- Field-mobile offline submissions never silently fail: every queued item resolves to `synced`, `conflict` (pending human resolution), or `failed` (flagged, retryable) — `QUEUE_STORAGE_FULL` (507) is the only scenario where new submissions are blocked client-side, and even then existing queued items remain intact pending reconnect.

### AI Governance Error Family (F9, enforced across F1/F5/F7)

These five codes form a closed family enforced at the API boundary, independent of which UI client calls the endpoint — no code path may bypass them:
`AIDRAFT_NO_SOURCE` (200, flagged in body) · `AIDRAFT_NOT_APPROVED` (400) · `AIDRAFT_UNAPPROVED_WRITE_BLOCKED` (400) · `APPROVAL_REQUIRES_NAMED_USER` (403) · `PROMOTE_REQUIRES_HUMAN_SUBMIT` (400, F9 signal-to-incident boundary only).
