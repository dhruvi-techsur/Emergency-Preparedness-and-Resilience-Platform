/* eslint-disable @typescript-eslint/no-unused-vars */

/** @type {import('node-pg-migrate').ColumnDefinitions | undefined} */
export const shorthands = undefined;

// Exact DDL from project_specs/TechArch/02d-data-integration-geo.md's
// "Hazard Feeds" section, hazard_layers block ONLY — hazard_feed_config and
// hazard_feed_events already exist from Phase 6's
// 1700000000011_persona-ai-signal-schema.js migration (confirmed by reading
// that file directly before writing this one's FK). This migration adds
// ONLY the net-new hazard_layers table this plan's F12 frontend-overlay
// work needs.
//
// No filename renumbering needed: `ls backend/migrations` confirms
// 1700000000012 is free at the time this plan executes (the highest
// existing migration is 1700000000011, landed by Phase 6's 06-01).
const UP_SQL = `
CREATE TABLE hazard_layers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hazard_feed_event_id UUID NOT NULL REFERENCES hazard_feed_events(id),
  label VARCHAR(200) NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_verified_requires_user CHECK (NOT verified OR verified_by IS NOT NULL)
);

CREATE INDEX idx_hazard_layers_unverified ON hazard_layers(verified) WHERE verified = false;
`;

const DOWN_SQL = `
DROP TABLE IF EXISTS hazard_layers;
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
