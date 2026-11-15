## Epic 6: Mobile Field Operations (F6)

Mobile updates, structured forms, and geolocated observations for field responders, with offline caching and reconciliation.

### US-6.1: Check and update my tasks from the field, even offline
**As a** Diego Reyes / Field Responder, **I want to** view my assigned tasks and update their status with one-tap buttons, even without connectivity, **so that** I can keep working without waiting for a signal.

**Acceptance Criteria:**
- [ ] Field task view shows title, status `Badge`, and due in a card-per-row layout (not a dense table) with one-tap status buttons sized `lg` (44px)
- [ ] Status updates made while offline are written to local cache and queued, with `SyncStatus` showing an incremented queued count
- [ ] Every field action has a visible button equivalent — no interaction depends on hover or gesture
- [ ] `SyncStatus` is pinned at the top of every mobile screen and reflects online/syncing/offline/conflict state in real time

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.2: Submit a structured field report with photo and location
**As a** Diego Reyes / Field Responder, **I want to** submit a structured observation with one-tap photo and location capture, **so that** command has accurate, geolocated field data without relying on radio traffic.

**Acceptance Criteria:**
- [ ] Report form includes observation type, description, one-tap photo capture with visible thumbnail confirmation, and one-tap "Use my location" with visible lat/long + accuracy confirmation shown as text
- [ ] A report must have at least a description, a photo, or a location — not fully empty (422 REPORT_EMPTY otherwise)
- [ ] Submission always succeeds locally regardless of connectivity — it sends immediately online or queues offline
- [ ] Every queued submission carries a client-generated `captured_at` timestamp reflecting when the observation actually happened, not when it syncs
- [ ] Bottom action bar shows a single primary "Submit report" button; all controls are `size="lg"`

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.3: Confirm queued submissions synced successfully on reconnect
**As a** Diego Reyes / Field Responder, **I want to** see which of my queued submissions have synced to the EOC once I reconnect, **so that** I know my reports were received instead of wondering if they disappeared.

**Acceptance Criteria:**
- [ ] Queued Submissions view lists each unsynced item with type, timestamp, and a "Queued" `Badge` via `SyncStatus` styling
- [ ] A queued item can be deleted before it syncs (if created in error) but cannot be edited once queued
- [ ] On reconnect, all queued items sync automatically in creation order; `SyncStatus` shows `syncing` during the process
- [ ] Every item that syncs cleanly appends a Timeline entry noting the sync, preserving the original field-capture timestamp
- [ ] No submission is ever silently dropped — every item resolves to synced, conflict (pending resolution), or failed (flagged, with reason and retry option)

**Priority:** P0 | **Feature Ref:** F6

---

### US-6.4: Resolve a sync conflict without losing data
**As a** Diego Reyes / Field Responder, **I want to** see a side-by-side comparison when my queued submission conflicts with an EOC-side change, and explicitly choose which version to keep, **so that** neither version is silently lost or overwritten.

**Acceptance Criteria:**
- [ ] Conflict view shows "Your version" vs. "Current EOC version" with differing fields highlighted
- [ ] Actions are "Keep my version" / "Keep EOC version" — no automatic merge or default resolution path exists
- [ ] Resolution requires an explicit named-person choice and writes a Timeline entry noting which version was kept and by whom
- [ ] If a photo fails to upload after reconnect, the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report

**Priority:** P0 | **Feature Ref:** F6
