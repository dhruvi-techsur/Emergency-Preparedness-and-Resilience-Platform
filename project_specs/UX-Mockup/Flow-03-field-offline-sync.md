### Flow 7: Offline Field Reporting and Reconnect Sync Confirmation (JRN-04.1)

**Trigger:** Diego Reyes (PER-04) is working in an area with zero connectivity and needs to keep reporting.
**User Story:** US-6.1 (check/update tasks offline), US-6.2 (submit structured report), US-6.3 (confirm sync on reconnect), US-6.4 (resolve sync conflict)

```
[Check Tasks — Field Home, SyncStatus pinned at top shows "offline"
 immediately]
    │
    ▼
[My Tasks (field view) — cached locally, loads instantly regardless
 of connectivity; card-per-row layout, one-tap status buttons
 sized lg (44px)]
    │
    ▼
[Submit Report — Report Observation form: one-tap photo capture +
 visible thumbnail, one-tap "Use my location" + lat/long/accuracy
 shown as text]
    │
    ├── 422 REPORT_EMPTY if no description/photo/location present
    │
    ▼
[Update Status — single-action status update ("Mark done"), no
 multi-step form]
    │
    ▼
[Stay Queued — every submission shows "Queued" Badge via SyncStatus
 styling immediately on local capture]
    │
    ▼
[Reconnect — SyncStatus transitions to "syncing"; queued items sync
 in creation order]
    │
    ├── Clean sync ──▶ Timeline entry appended, preserving original
    │   captured_at timestamp
    │
    └── Conflict detected ──▶ Sync Conflict Resolution screen
        │
        ├── "Keep my version" / "Keep EOC version" — no automatic
        │   merge, explicit named-person choice required
        │
        └── Success ──▶ Timeline entry notes which version was kept
            and by whom; zero data loss, zero silent drops
```

**Steps:**
1. Diego opens the Field Home (`/field`), mobile breakpoint, bottom-nav only; `SyncStatus` immediately reflects `offline` state even before he taps anything.
2. He checks My Tasks (field view) — cached locally and instantly available regardless of connectivity, rendered as card-per-row (not a dense table) with `size="lg"` one-tap status buttons.
3. He captures a structured field report: observation type, description, one-tap photo capture with a visible thumbnail confirmation, and one-tap "Use my location" with lat/long + accuracy shown as readable text (not just a map pin). A report cannot be fully empty (422 `REPORT_EMPTY`).
4. He updates a task's status with a single tap ("Mark done") — no multi-step form, no hover or gesture dependency.
5. Every submission immediately shows a "Queued" `Badge` via `SyncStatus` styling the moment it's captured locally — nothing waits silently in an ambiguous state.
6. On reconnect, `SyncStatus` shows `syncing`; all queued items sync automatically in creation order, each appending a `Timeline` entry that preserves the original field-capture `captured_at` timestamp (not the sync time).
7. If a queued submission conflicts with an EOC-side change to the same record, the Sync Conflict Resolution screen (S6.5) shows "Your version" vs. "Current EOC version" side by side with differing fields highlighted; Diego must explicitly choose "Keep my version" or "Keep EOC version" — no default/automatic resolution exists. The resolution writes a `Timeline` entry naming which version was kept and by whom.
8. If a photo fails to upload after reconnect, the report text/location still syncs and the photo failure is flagged separately rather than blocking the whole report.
