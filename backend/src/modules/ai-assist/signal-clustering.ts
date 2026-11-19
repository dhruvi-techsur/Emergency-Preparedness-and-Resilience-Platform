import { query } from '../../db/client.js';

export type ConfidenceLabel = 'High' | 'Medium' | 'Low';

interface HazardFeedClusterGroupRow {
  type: string;
  lng: number;
  lat: number;
  event_ids: string[];
  sources: string[];
  event_count: number;
}

interface HazardFeedEventSourceRow {
  id: string;
  source: string;
  issued_at: string;
}

/**
 * Deterministic stand-in for TechArch 01-components.md's `comms-reporting`
 * module's hazard-feed-clustering consumer ("reads hazard-feed events via
 * event bus... clusters, writes signals"). This phase hosts it in
 * `ai-assist` instead, since `comms-reporting` has zero executed code in
 * this codebase (Phase 4 is unexecuted PLAN.md files only, confirmed via
 * STATE.md) and F9's signal-triage half belongs conceptually with this
 * phase's other AI-governance work; if Phase 4 is executed later and a
 * real `comms-reporting` module materializes, this function can be moved
 * there without changing its exported contract.
 *
 * No live NOAA/NWS/USGS feed credential exists in this sandbox (F12 —
 * Weather & Hazard Feed Ingestion — is explicitly deferred to v2 per
 * `.planning/REQUIREMENTS.md`). This function only needs the
 * triage/clustering MECHANISM to be real and demonstrable against seeded
 * sample data, not a live external integration.
 *
 * Grouping rule (real, deterministic — NOT a 1:1 passthrough): raw
 * hazard_feed_events rows with no existing signal_source_events link are
 * grouped by `(type, ST_SnapToGrid(geometry, 0.5))` — same `type` hazard
 * within roughly the same 0.5-degree grid cell, i.e. "corroborating feeds
 * in the same area" per the FRD's own example confidence reason ("High —
 * 3 corroborating NOAA/NWS feeds"). Each resulting group becomes one
 * `signals` row; its member hazard_feed_events become `signal_source_events`
 * rows linking back to it.
 *
 * Idempotent by construction: the grouping query's own
 * `WHERE NOT EXISTS (signal_source_events link)` condition means a second
 * run finds zero unclustered events and clusters nothing new — re-running
 * this function never duplicates a signal for events already clustered.
 */
export async function clusterHazardFeedEvents(): Promise<{ clustersCreated: number }> {
  // Single SQL query with GROUP BY — groups every still-unclustered
  // hazard_feed_events row by (type, 0.5-degree grid cell), aggregating
  // the member event ids/sources/count needed to build each signal.
  const groups = await query<HazardFeedClusterGroupRow>(
    `SELECT
       hfe.type AS type,
       ST_X(ST_Centroid(ST_Collect(hfe.geometry::geometry))) AS lng,
       ST_Y(ST_Centroid(ST_Collect(hfe.geometry::geometry))) AS lat,
       array_agg(hfe.id) AS event_ids,
       array_agg(DISTINCT hfe.source) AS sources,
       count(*)::int AS event_count
     FROM hazard_feed_events hfe
     WHERE NOT EXISTS (
       SELECT 1 FROM signal_source_events sse WHERE sse.hazard_feed_event_id = hfe.id
     )
     GROUP BY hfe.type, ST_SnapToGrid(hfe.geometry::geometry, 0.5)`,
  );

  let clustersCreated = 0;

  for (const group of groups) {
    const count = group.event_count;
    const sources = group.sources;

    let confidenceLabel: ConfidenceLabel;
    let confidenceReason: string;
    if (count >= 2) {
      confidenceLabel = 'High';
      confidenceReason = `${count} corroborating feeds (${sources.join(', ')})`;
    } else {
      confidenceLabel = 'Medium';
      confidenceReason = `Single source: ${sources[0]}`;
    }

    const roundedLat = Math.round(group.lat * 100) / 100;
    const roundedLng = Math.round(group.lng * 100) / 100;
    const summary = `${group.type} cluster \u2014 ${count} event(s) near ${roundedLat},${roundedLng}`;

    const insertedSignalRows = await query<{ id: string }>(
      `INSERT INTO signals (summary, confidence_label, confidence_reason)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [summary, confidenceLabel, confidenceReason],
    );
    const signalId = insertedSignalRows[0].id;
    clustersCreated += 1;

    // Fetch each member event's own source/issued_at so
    // signal_source_events carries the real per-event provenance, not
    // just the group's aggregated values.
    const eventRows = await query<HazardFeedEventSourceRow>(
      `SELECT id, source, issued_at FROM hazard_feed_events WHERE id = ANY($1)`,
      [group.event_ids],
    );

    for (const event of eventRows) {
      await query(
        `INSERT INTO signal_source_events (signal_id, hazard_feed_event_id, source, occurred_at)
         VALUES ($1, $2, $3, $4)`,
        [signalId, event.id, event.source, event.issued_at],
      );
    }
  }

  return { clustersCreated };
}
