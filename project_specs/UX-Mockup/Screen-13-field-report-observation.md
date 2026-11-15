### Screen: Report Observation (structured form)

**Purpose:** One-tap, gloved-hand-friendly structured field reporting with photo and location capture, fully offline-capable.
**User Stories:** US-6.2, JRN-04.1 (Submit Report)

#### Layout

Page pattern: **Field mobile**. Single column, all controls `size="lg"`.

```
┌───────────────────────────────┐
│ SyncStatus: ● offline           │
│  "3 queued"                     │
├───────────────────────────────┤
│  h1 "Report observation"        │
│                                 │
│  Select "Observation type" lg   │
│                                 │
│  TextField multiline            │
│   "Description" lg              │
│                                 │
│  [📷 Capture photo] (Button lg) │
│   ┌─ thumbnail confirmation ──┐│
│   │ [image preview]  ✓ Captured││
│   └──────────────────────────┘│
│                                 │
│  [📍 Use my location] (Button  │
│   lg)                           │
│   ┌─ confirmation text ───────┐│
│   │ Lat: 38.9012, Long:        ││
│   │ -77.0401 · Accuracy: ±5m   ││
│   └──────────────────────────┘│
├───────────────────────────────┤
│ Bottom action bar (single       │
│  primary): [Submit report lg]   │
└───────────────────────────────┘
```

#### Information Hierarchy

| Priority | Content | Placement |
|----------|---------|-----------|
| Primary | `SyncStatus` | Pinned top |
| Primary (h1) | "Report observation" | Page title |
| Primary | Observation type, Description | Top of form |
| Primary | Photo capture + thumbnail confirmation | Below description |
| Primary | Location capture + text confirmation (lat/long/accuracy) | Below photo |
| Primary action | "Submit report" | Bottom action bar, single button |

#### States

| State | Appearance | User Feedback |
|-------|------------|---------------|
| Default | Empty form, no photo/location yet | N/A |
| Photo captured | Visible thumbnail with "✓ Captured" confirmation text | Not just a silent state change |
| Location captured | Lat/long + accuracy shown as readable text, not just a map pin | Explicit confirmation, never ambiguous |
| Submit with empty report | `Alert danger`: "Add a description, photo, or location before submitting." (422 `REPORT_EMPTY`) | Blocks submit |
| Submitting online | Brief `Button loading` state on "Submit report" | Label width stays stable |
| Submitting offline | Immediate local success; `SyncStatus` queued count increments | "Queued" confirmation, never a spinner that implies failure |
| Location unavailable | `Alert info` (degraded, 200): "Location isn't available. You can still submit without it." | Non-blocking |
| Photo upload failed post-reconnect | `Alert warning`: "Photo didn't upload. The rest of your report synced. Retry the photo." (500 `PHOTO_UPLOAD_FAILED`) | Rest of report still syncs |

#### Interactive Elements

| Element | Type | Behavior |
|---------|------|----------|
| "Capture photo" | `Button size="lg"` with camera `Icon` | One tap opens camera, returns to form with thumbnail |
| "Use my location" | `Button size="lg"` with map-pin `Icon` | One tap captures GPS, shows text confirmation |
| "Submit report" | `Button primary size="lg"` | Always succeeds locally; sends immediately online or queues offline |

**Keyboard/focus:** No hover-dependent or swipe-only interactions; every action (photo, location, submit) has a visible, single-tap button equivalent. `captured_at` is set client-side at the moment of capture, not at sync time.
