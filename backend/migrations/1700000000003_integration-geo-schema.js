/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02d-data-integration-geo.md §GIS
// Integration (F11). Geospatial feature data itself (base-map tiles,
// boundary geometries) is read-through/cached only -- EPMP is not the
// system of record for GIS base-layer content; only fetch status/health is
// persisted here. Live feature data is fetched on-demand via the F11
// adapter (gis-adapter.ts) and never persisted to a dedicated table.
const UP_SQL = `
CREATE TABLE gis_feed_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  layer_id VARCHAR(100) NOT NULL,
  vendor VARCHAR(100) NOT NULL CHECK (vendor IN ('Esri','OSM','agency_gis')),
  last_fetch_at TIMESTAMPTZ,
  last_fetch_status VARCHAR(20) NOT NULL DEFAULT 'ok' CHECK (last_fetch_status IN ('ok','error','timeout')),
  can_publish BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (layer_id, vendor)
);

CREATE INDEX idx_gis_feed_status_layer ON gis_feed_status(layer_id);
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS gis_feed_status;
`;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.sql(UP_SQL);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.sql(DOWN_SQL);
};
