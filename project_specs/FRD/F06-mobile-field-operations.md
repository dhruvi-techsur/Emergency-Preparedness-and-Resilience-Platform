## F6: Mobile Field Operations

**Description:** Mobile updates, structured forms, and geolocated observations for field responders, with offline caching and later reconciliation so field-to-EOC reporting stays reliable regardless of connectivity. Ships as a responsive, installable web application built from the same design system — not a native app.

**Terminology:**
- **Field report:** A structured or free-text observation submitted by a field responder, optionally with photo and location.
- **Queued submission:** A field report or status update created while offline, held locally until reconnect.
- **Reconciliation:** The process of syncing queued submissions to the EOC on reconnect, including conflict detection.
- **Sync conflict:** A state where a queued field submission and the EOC's current record for the same entity have diverged; always surfaced to a named person.

### Sub-features
- Mobile-optimized, installable web app (same design system, `size="lg"` 44px targets, single-column `body-lg` layout, bottom action bar with one primary action).
- Structured field forms and free-text observations with one-tap photo/location capture.
- Offline-first operation: every edit possible while offline, queued submissions shown via `SyncStatus`.
- Reconciliation on reconnect with Timeline entry and conflict surfacing.
- No hover-only or gesture-only interactions.

### Screens

**S6.1 — Field Home (bottom-nav, mobile breakpoint)**
- Single column, `body-lg`. `SyncStatus` pinned at top (online/syncing/offline + queued count/conflict). Bottom bar: 4 destinations (Tasks, Report, Map, Profile — role-dependent per F18). Primary action in bottom action bar: "Report observation."

**S6.2 — My Tasks (field view)**
- List of assigned tasks (card-per-row, label/value pairs per mobile responsive rule, not a dense table): title, status `Badge`, due. Tap opens task detail with one-tap status update buttons ("Start", "Mark done") sized `lg` (44px).

**S6.3 — Report Observation (structured form)**
- Single column, all controls `size="lg"`. Fields: Observation type (`Select`), Description (`TextField multiline`), Photo capture (one-tap camera button with visible thumbnail confirmation after capture), Location capture (one-tap "Use my location" button with visible confirmation — captured lat/long and accuracy shown as text, not just a map pin). Bottom action bar: single primary "Submit report" button. No hover-dependent or swipe-only interactions; every action has a visible button.

**S6.4 — Queued Submissions View**
- List of locally queued items not yet synced: each row shows type, timestamp, and a "Queued" `Badge` via `SyncStatus` styling. Tapping shows full content (read-only) with no edit capability once queued (to avoid silent divergence) — user may delete a queued item before it syncs if it was created in error.

**S6.5 — Sync Conflict Resolution**
- When a queued submission conflicts with an EOC-side change to the same record: side-by-side display of "Your version" vs. "Current EOC version," each field highlighted where they differ. Actions: "Keep my version" / "Keep EOC version" (never a silent auto-merge). Resolution writes a Timeline entry noting which version was kept and by whom.

**S6.6 — Field Map (lightweight operating-picture view)**
- A constrained version of F2's operating picture: `MapCanvas` plus the single "Report observation" primary action, offline-capable (schematic base map fallback per F2), queued reports shown as pending markers via `SyncStatus` styling until synced.

### Process
1. A field responder (PER-04) opens the field app; `SyncStatus` immediately reflects current connectivity (online/syncing/offline).
2. The responder views assigned tasks (S6.2) and updates status with one-tap buttons; if offline, the update is written to local cache (e.g., SQLite) and queued, with `SyncStatus` showing an incremented queued count.
3. The responder submits a structured field report (S6.3), including one-tap photo and location capture; every field remains editable offline, and submission always succeeds locally regardless of connectivity — it either sends immediately (online) or queues (offline).
4. On reconnect, the app automatically attempts to sync all queued items in creation order; `SyncStatus` shows `syncing` during this process.
5. For each queued item that syncs cleanly (no conflicting EOC-side change to the same record), the system appends a Timeline entry on the relevant incident (F1) noting the sync, with the original field-capture timestamp preserved (not the sync timestamp).
6. For each queued item that conflicts with an EOC-side change, the app surfaces it via S6.5 rather than silently resolving; the responder (or an EOC-side user, depending on agency configuration) must explicitly choose which version to keep.
7. Photo/location data captured offline is stored locally until sync; if a photo fails to upload after reconnect (e.g., size/format issue), the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report.

### Inputs
- Task status update: `task_id` (UUID, required), `new_status` (enum, required), `captured_at` (ISO datetime, client-generated, required).
- Field report: `observation_type` (enum, required), `description` (string, optional if photo/location present, required otherwise), `photo` (binary/base64, optional), `location` (lat/long + accuracy, optional but recommended), `captured_at` (ISO datetime, client-generated, required).
- Conflict resolution: `conflict_id` (UUID, required), `resolution` (enum: `keep_mine`|`keep_eoc`, required).

### Outputs
- Field report records visible in the EOC's incident workspace (F1) and operating picture (F2) once synced.
- `SyncStatus` state (online/syncing/offline/conflict) with queued count, visible in the app header and on every mobile screen.
- Timeline entries noting field-to-EOC sync events with original capture timestamps.

### Validation
- Every queued submission must carry a client-generated `captured_at` timestamp at creation time (not assigned at sync time), so the record reflects when the observation actually happened.
- A field report must have at least a description or a photo or a location — not fully empty.
- No submission may be silently dropped: every queued item must resolve to either "synced," "conflict (pending resolution)," or "failed (flagged, with reason and retry option)" — never disappear.
- Conflict resolution requires an explicit named-person choice; no default/automatic resolution path exists.
- All touch targets in field-mobile screens must be ≥44px (`size="lg"`); no interaction may depend on hover or a gesture without a visible single-tap button equivalent.

### Error States
| Scenario | HTTP Status | Error Code | Message |
|----------|-------------|------------|---------|
| Sync conflict detected | 409 | SYNC_CONFLICT | "This report differs from the current EOC record. Choose which version to keep." |
| Photo upload failed after reconnect | 500 | PHOTO_UPLOAD_FAILED | "Photo didn't upload. The rest of your report synced. Retry the photo." |
| Location capture denied/unavailable | 200 (degraded) | LOCATION_UNAVAILABLE | "Location isn't available. You can still submit without it." |
| Empty field report submitted | 422 | REPORT_EMPTY | "Add a description, photo, or location before submitting." |
| Local storage full / queue limit reached | 507 | QUEUE_STORAGE_FULL | "Your device can't queue more reports. Connect to sync before adding more." |

### API Surface (this feature)
See `Y1b-api-incident-ops.md` §Field Reports for `POST /api/v1/field-reports` (idempotent via client-generated `report_id`), `POST /api/v1/field-reports/sync-batch`, `POST /api/v1/sync-conflicts/{id}/resolve`, `PATCH /api/v1/tasks/{id}/status` (shared with F4, idempotent by `captured_at` + `task_id`).

### Schema Surface (this feature)
Owns tables `field_reports`, `sync_conflicts`, `field_report_photos` — see `Y0b-schema-incident-ops.md` §Field Operations. Reads/writes `tasks` (F4), `incident_timeline` (F1). Client-side local cache schema (SQLite) is a TechArch concern, not specified here.
