import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';

interface GeoFeatureResponse {
  layer_id: string;
  source: string;
  as_of: string;
  features: GeoJSON.Feature[];
}

// No real agency GIS vendor credential exists in this MVP sandbox (TechArch's
// adapter catalog names Esri/OSM/agency-GIS as agency-specific, out-of-band
// configuration this phase does not have). This stub simulates the adapter's
// NORMALIZED OUTPUT SHAPE exactly as a real adapter would produce it — a base
// boundary polygon for the agency's default jurisdiction — so the rest of the
// system (provenance enforcement, schematic fallback, status-bar wiring) is
// built and tested against the real contract, not a fake shortcut. Swapping
// in a real Esri/OSM vendor call later means replacing only this function's
// body; every caller (operating-picture.ts) is unaffected.
const KNOWN_LAYER_ID = 'agency-base-boundary';

export async function fetchGisFeatures(
  layerId: string,
  bbox: [number, number, number, number],
): Promise<GeoFeatureResponse> {
  if (layerId !== KNOWN_LAYER_ID) {
    // Any layer this stub doesn't recognize simulates a vendor timeout —
    // exercises the exact failure path a real unreachable Esri/OSM endpoint
    // would trigger.
    await recordFeedStatus(layerId, 'timeout');
    throw new Error(`GIS_FEED_TIMEOUT: layer '${layerId}' unreachable`);
  }

  const response: GeoFeatureResponse = {
    layer_id: layerId,
    source: 'agency_gis', // matches gis_feed_status.vendor CHECK values
    as_of: new Date().toISOString(),
    features: [
      {
        type: 'Feature',
        properties: { name: 'Default Agency Boundary' },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [bbox[0], bbox[1]],
              [bbox[2], bbox[1]],
              [bbox[2], bbox[3]],
              [bbox[0], bbox[3]],
              [bbox[0], bbox[1]],
            ],
          ],
        },
      },
    ],
  };

  // Provenance enforcement (F11 Validation / 06-integrations.md §7.1): reject
  // before this function even returns if source/as_of ever end up missing —
  // structurally guaranteed here since both are always set above, but the
  // check is written explicitly so a future real-vendor swap can't silently
  // drop them.
  if (!response.source || !response.as_of) {
    await recordFeedStatus(layerId, 'error');
    throw new Error('PROVENANCE_REQUIRED: GIS response missing source or as_of');
  }

  await recordFeedStatus(layerId, 'ok');
  return response;
}

async function recordFeedStatus(layerId: string, status: 'ok' | 'error' | 'timeout'): Promise<void> {
  await query(
    `INSERT INTO gis_feed_status (layer_id, vendor, last_fetch_at, last_fetch_status)
     VALUES ($1, 'agency_gis', now(), $2)
     ON CONFLICT (layer_id, vendor) DO UPDATE SET last_fetch_at = now(), last_fetch_status = $2`,
    [layerId, status],
  );
}

/**
 * Called at server startup / on-demand by the admin Integration Health
 * route; a no-op health probe that exercises recordFeedStatus so a fresh
 * deployment has at least one gis_feed_status row rather than an empty
 * table with no diagnostic signal.
 */
export async function checkGisHealth(): Promise<void> {
  try {
    await fetchGisFeatures(KNOWN_LAYER_ID, [-180, -90, 180, 90]);
  } catch {
    // Health probe failure is itself the signal — already recorded by
    // fetchGisFeatures's own recordFeedStatus call; nothing further to do.
  }
}

interface GisFeedStatusRow {
  id: string;
  layer_id: string;
  vendor: string;
  last_fetch_at: string | null;
  last_fetch_status: 'ok' | 'error' | 'timeout';
  can_publish: boolean;
  created_at: string;
}

/**
 * Thin passthrough read of gis_feed_status per TechArch 03d's `GET
 * /api/v1/integrations/gis/health` — readable by the admin Integration
 * Health view (F8 S8.6), surfacing last_fetch_status for every layer this
 * adapter has ever attempted.
 */
export async function gisHealthRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/integrations/gis/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<GisFeedStatusRow>(
        `SELECT id, layer_id, vendor, last_fetch_at, last_fetch_status, can_publish, created_at
         FROM gis_feed_status
         ORDER BY layer_id, vendor`,
      );
      return reply.code(200).send({ items: rows });
    },
  );
}
