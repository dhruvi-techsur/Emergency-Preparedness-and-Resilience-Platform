import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { fetchGisFeatures } from '../integration-gateway/gis-adapter.js';
import type { ActivationLevel, Severity } from './incidents.js';

const SCHEMATIC_FALLBACK_LABEL = 'Schematic base map, offline';

type MarkerTone = 'brand' | 'success' | 'warning' | 'danger' | 'info';

function severityToTone(severity: Severity): MarkerTone {
  switch (severity) {
    case 'Critical':
      return 'danger';
    case 'Elevated':
      return 'warning';
    case 'Watch':
      return 'info';
    case 'Normal':
    default:
      return 'success';
  }
}

interface IncidentMarkerRow {
  id: string;
  name: string;
  severity: Severity;
  activation_level: ActivationLevel;
  status: 'Open' | 'Closed';
  lat: number;
  lng: number;
}

interface MapMarker {
  id: string;
  type: 'incident';
  shape: 'diamond';
  tone: MarkerTone;
  label: string;
  status: string;
  location: { lat: number; lng: number };
}

/**
 * Mounts GET /api/v1/operating-picture/markers and GET
 * /api/v1/operating-picture/layers.
 *
 * Scope note (per this plan's objective): "incidents, facilities, and
 * resources" is criterion 4's full target per the FRD, but `facilities`
 * (F17) and `resource_requests` (F4) are both out of Phase 2 scope — neither
 * table exists yet. This endpoint renders every marker type Phase 2's actual
 * scope (F1, F2, F11) can produce: incidents. The response shape
 * (`MapMarker[]` with a `type` discriminant) is written generically so
 * Phase 3/later integration-gateway plans add facility/resource markers to
 * the SAME array without a response-shape change — see TechArch 03b's
 * `MapMarker` interface, which already declares `type: 'incident' |
 * 'facility' | 'resource' | 'shelter'`.
 */
export default async function operatingPictureRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: {
      bbox?: string;
      jurisdiction_scope?: string;
      force_gis_failure?: string;
    };
  }>(
    '/api/v1/operating-picture/markers',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      // Phase 2 scope: base jurisdiction filtering via
      // req.epmpUser.jurisdiction_scope is applied below. Full
      // federation-grant expansion (cross-jurisdiction sharing via OPA) is a
      // Phase 2+ follow-up per TechArch §1.6 — federation evaluation happens
      // per-request via OPA generally, but is not yet wired into this
      // specific query. The `jurisdiction_scope` query param is accepted but
      // not yet enforced beyond the authenticated user's own scope.
      const jurisdictionScope = req.epmpUser!.jurisdiction_scope;

      const incidentRows = await query<IncidentMarkerRow>(
        `SELECT id, name, severity, activation_level, status,
                ST_Y(location::geometry) as lat, ST_X(location::geometry) as lng
         FROM incidents
         WHERE status = 'Open' AND location IS NOT NULL AND jurisdiction_id = ANY($1)`,
        [jurisdictionScope],
      );

      const markers: MapMarker[] = incidentRows.map((row) => ({
        id: row.id,
        type: 'incident',
        shape: 'diamond',
        tone: severityToTone(row.severity),
        label: row.name,
        status: row.activation_level,
        location: { lat: row.lat, lng: row.lng },
      }));

      // GIS base-layer fetch, wrapped so failure NEVER propagates to the
      // response — this is the core of success criterion 5. The schematic
      // defaults below are the DEFAULT code path, not a fallback bolted on
      // after the fact: every variable starts here, and only an explicitly
      // provenanced success response overwrites them.
      let baseLayerSource = SCHEMATIC_FALLBACK_LABEL;
      let baseLayerAsOf = new Date().toISOString();
      try {
        // Test-only failure injection: an explicit, unguessable-by-accident
        // query param, never documented in the public OpenAPI schema. Exists
        // solely so this plan's own integration test (Task 3) and the
        // frontend Playwright e2e test (02-07) can deterministically
        // exercise the degraded path via a normal HTTP request — no server
        // restart, no module mocking, no env var requiring a process
        // relaunch mid-test.
        if (req.query.force_gis_failure === 'true') {
          throw new Error('TEST_INJECTED_GIS_FAILURE');
        }
        const bboxParam = req.query.bbox;
        const parsedBbox = bboxParam ? bboxParam.split(',').map(Number) : [-180, -90, 180, 90];
        // A malformed bbox (wrong length, or any non-finite entry — NaN
        // from e.g. `bbox=abc`, or Infinity) must not silently produce an
        // invalid polygon that still gets recorded as a provenanced 'ok'
        // fetch. Treat it identically to an adapter failure: fall through
        // to the schematic default already set above (W3 fix).
        if (parsedBbox.length !== 4 || !parsedBbox.every(Number.isFinite)) {
          throw new Error('INVALID_BBOX: malformed bbox query parameter');
        }
        const bbox = parsedBbox as [number, number, number, number];
        const gisResponse = await fetchGisFeatures('agency-base-boundary', bbox);
        if (gisResponse.source && gisResponse.as_of) {
          baseLayerSource = `agency GIS (${gisResponse.source})`;
          baseLayerAsOf = gisResponse.as_of;
        }
        // else: missing provenance — treat identically to a feed failure,
        // fall through to the schematic default already set above. Never
        // assign baseLayerSource from an unprovenanced response.
      } catch {
        // Any adapter error (timeout, network, thrown exception) — the
        // schematic defaults already set above remain in effect. No rethrow,
        // no 500. This catch block is intentionally empty beyond the
        // comment: the absence of action IS the correct behavior.
      }

      // Phase 2 has no other provenanced layer yet (hazard/facility layers
      // are F12/F17, out of scope), so status_bar.as_of reduces to
      // baseLayerAsOf alone. TODO(Phase 3+): once F12/F17 layers exist, take
      // the actual MINIMUM (stalest) across all visible layers' as_of
      // values per FRD's "stalest, not average" rule, not just the base
      // layer's.
      const statusBarAsOf = baseLayerAsOf;

      // This response is 200 in EVERY case, including total GIS failure,
      // per FRD's GIS_FEED_UNAVAILABLE error-table entry ("200 (degraded)").
      return reply.code(200).send({
        markers,
        status_bar: { as_of: statusBarAsOf, base_layer_source: baseLayerSource },
      });
    },
  );

  app.get(
    '/api/v1/operating-picture/layers',
    { preHandler: requirePermission('incidents', 'view') },
    async (req, reply) => {
      // Phase 2 scope: returns a single layer entry for the incidents
      // overlay itself, since F12 (hazard feeds) and F17 (facilities) are
      // out of Phase 2 scope. LayerPanel's full 4-8-layer target per the FRD
      // is reached once those features ship in later phases.
      const jurisdictionScope = req.epmpUser!.jurisdiction_scope;
      const countRows = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM incidents WHERE status = 'Open' AND jurisdiction_id = ANY($1)`,
        [jurisdictionScope],
      );
      const count = parseInt(countRows[0]?.count ?? '0', 10);

      return reply.code(200).send({
        layers: [
          {
            id: 'incidents',
            label: 'Incidents',
            source: 'EPMP',
            as_of: new Date().toISOString(),
            verified: true,
            count,
            checked: true,
          },
        ],
      });
    },
  );
}
