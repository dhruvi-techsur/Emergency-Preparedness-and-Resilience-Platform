## 3. Data Model

### 3.1 Overview & Conventions

The data model directly reconciles the FRD's `Y0a`–`Y0d` schema chunks into one coherent PostgreSQL 16 + PostGIS 3.4 DDL, organized into four domain files below (mirroring the FRD's own chunking, since it already reflects clean bounded-context boundaries). No entity, relationship, or constraint from the FRD schema chunks has been dropped; a small number of forward-reference FKs that the FRD left as prose cross-references (e.g., `tasks.plan_section_id → plan_sections`, `signal_source_events.hazard_feed_event_id → hazard_feed_events`, `notifications.ai_draft_id → ai_drafts`) are made explicit here since the full cross-file picture is now available.

**Global conventions (apply to every table unless stated otherwise):**
- `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`
- `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
- `updated_at TIMESTAMPTZ NOT NULL DEFAULT now()` (omitted on append-only and pure-event tables)
- `created_by`/`updated_by UUID REFERENCES users(id)` where the FRD specifies named-person accountability
- Append-only tables (`audit_log`, `incident_timeline`) have **no UPDATE or DELETE grants** at the database-role level for the application's runtime DB user — enforced via `REVOKE UPDATE, DELETE ON audit_log, incident_timeline FROM app_runtime;` in addition to the application-layer convention, satisfying F8's "enforced at the data layer, not just the UI" requirement.
- All `GEOGRAPHY`/`GEOMETRY` columns use SRID 4326 (WGS84), consistent with GeoJSON/OGC interchange.
- Enum-like status columns are implemented as `VARCHAR` + `CHECK` constraint (not native Postgres `ENUM` types) to allow adding a new status value via a migration without an `ALTER TYPE` lock — a pragmatic choice for a schema that will evolve across MVP iterations.

### 3.2 Entity-Relationship Diagram (high-level, cross-domain)

```
                         ┌──────────────┐
                         │ jurisdictions │◄─────────────────────────┐
                         └──────┬───────┘                           │
                                │ 1:N                                │
                  ┌─────────────┼──────────────┐                     │
                  ▼             ▼              ▼                     │
            ┌──────────┐  ┌──────────┐   ┌───────────┐               │
            │  users   │  │   plans   │   │ incidents │               │
            └────┬─────┘  └────┬─────┘   └─────┬─────┘               │
                 │ role_id      │ 1:N sections   │ 1:N                 │
                 ▼              ▼               ├──────────────┬──────┴────────┐
            ┌──────────┐  ┌──────────────┐      ▼              ▼               ▼
            │  roles   │  │ plan_sections │ ┌──────────┐ ┌─────────────┐ ┌───────────────┐
            └──────────┘  └──────┬───────┘ │ incident_ │ │ incident_   │ │   ics_forms    │
                                 │ 1:N       │ command_  │ │ timeline    │ │  (ai_origin,   │
                                 ▼           │ roles     │ │ (append-   │ │   approved_by) │
                         ┌───────────────┐  └──────────┘ │  only)     │ └───────┬────────┘
                         │ plan_task_     │               └────────────┘         │
                         │ templates      │                      ▲               │ ai_drafts
                         └───────┬────────┘                      │ FK            ▼
                                 │ materializes                   │        ┌───────────┐
                                 ▼                                │        │ ai_drafts │
                         ┌──────────────┐    1:N     ┌────────────┴──┐    └───────────┘
                         │    tasks      │◄───────────┤ task_status_   │
                         └──────┬───────┘             │ history        │
                                 │ 1:N                 └────────────────┘
                                 ▼
                         ┌──────────────────┐   1:N   ┌────────────────────────────┐
                         │ resource_requests  │◄────────┤ resource_request_status_   │
                         └──────────────────┘          │ history                      │
                                                        └────────────────────────────┘
      incidents ──1:N──► field_reports ──1:N──► field_report_photos
      incidents ──1:N──► sync_conflicts (via entity_type/entity_id polymorphic ref)
      incidents ──1:N──► notifications ──1:N──► notification_recipients ──1:1──► notification_delivery_status
      incidents ──1:N──► sitreps, aars ──1:N──► aar_findings
      incidents ──1:N──► cad_dispatch_events (F15, read-only)
      hazard_feed_events ──1:N──► hazard_layers; ──1:N──► signal_source_events ──N:1──► signals
      users ──1:N──► audit_log, federation_grants(granted_by), api_clients(via admin action)
```

### 3.3 Domain Schema Files

The full DDL is organized into four domain files, each independently loadable as a migration group:

| File | Domain | Owning features | Table count |
|---|---|---|---|
| [`02a-data-auth-org.md`](./02a-data-auth-org.md) | Identity, RBAC, audit, platform API/federation, HR/IAM reference, persona config | F8, F10, F16, F18 | 13 |
| [`02b-data-incident-ops.md`](./02b-data-incident-ops.md) | Incident/ICS, tasks/resources, field operations | F1, F4, F6 | 11 |
| [`02c-data-plans-comms-reporting.md`](./02c-data-plans-comms-reporting.md) | Plans/playbooks, notifications, reporting/AAR, AI assistance | F3, F5, F7, F9, F14 | 18 |
| [`02d-data-integration-geo.md`](./02d-data-integration-geo.md) | GIS, hazard feeds, EOC COTS, CAD/911, asset/facility/document | F11, F12, F13, F15, F17 | 11 |

**Total: 53 tables** (FRD's ~45 estimate plus the explicit forward-reference reconciliation above; no duplicate counting across domain files — each table is defined exactly once in its owning file).

### 3.4 Row-Level Security Pattern (applied across jurisdiction-scoped tables)

In addition to the DDL in each domain file, every jurisdiction-scoped table (`incidents`, `plans`, and any table reachable from them) carries this RLS policy pattern, enabled as a second line of defense beneath OPA's application-layer authorization (see `01-components.md` §2.4 and `04-security.md`):

```sql
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY incident_jurisdiction_scope ON incidents
  USING (
    jurisdiction_id = ANY(current_setting('app.jurisdiction_scope')::UUID[])
    OR current_setting('app.jurisdiction_scope') = 'all'
  );
```

The application sets `app.jurisdiction_scope` as a session-local Postgres variable immediately after authenticating each request (derived from `users.jurisdiction_scope` plus any active `federation_grants`), before any query executes. This pattern is repeated for `plans` and is inherited transitively for child tables (`incident_timeline`, `tasks`, `resource_requests`, etc.) via a `USING (incident_id IN (SELECT id FROM incidents))` policy, avoiding duplicated jurisdiction columns on every child table.
