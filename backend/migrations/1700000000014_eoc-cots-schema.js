/**
 * F13: EOC COTS Interoperability — eoc_cots_config/eoc_cots_sync_log/
 * eoc_cots_conflicts tables, per TechArch 02d's §EOC COTS Interoperability
 * DDL verbatim.
 *
 * Renumbered from the plan's literal 1700000000012 to 1700000000014 — that
 * slot was already claimed by Phase 7's own hazard-layers-schema.js (and
 * 1700000000013 by cad-dispatch-schema.js) by the time this plan executed,
 * the same cross-plan migration-numbering collision every prior phase
 * (04-01/04-02/05-01/06-01/07-01/07-02) has hit and resolved identically —
 * renumber to the next free slot, no DDL content change.
 */

exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE eoc_cots_config (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      vendor VARCHAR(50) NOT NULL CHECK (vendor IN ('WebEOC','Veoci','DisasterLAN')),
      endpoint_url TEXT NOT NULL,
      auth_config JSONB NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE eoc_cots_sync_log (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
      record_type VARCHAR(50) NOT NULL CHECK (record_type IN ('incident','resource_request','status','activity_log')),
      external_id VARCHAR(300),
      epmp_record_id UUID,
      direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound','outbound')),
      sync_status VARCHAR(20) NOT NULL DEFAULT 'ok',
      synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE eoc_cots_conflicts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      config_id UUID NOT NULL REFERENCES eoc_cots_config(id),
      record_type VARCHAR(50) NOT NULL,
      epmp_record_id UUID NOT NULL,
      epmp_value JSONB NOT NULL,
      external_value JSONB NOT NULL,
      resolution VARCHAR(20) CHECK (resolution IN ('keep_epmp','keep_external')),
      resolved_by UUID REFERENCES users(id),
      resolved_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE INDEX idx_eoc_cots_sync_log_config_time ON eoc_cots_sync_log(config_id, synced_at DESC);
    CREATE INDEX idx_eoc_cots_conflicts_unresolved ON eoc_cots_conflicts(config_id) WHERE resolution IS NULL;
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS eoc_cots_conflicts;
    DROP TABLE IF EXISTS eoc_cots_sync_log;
    DROP TABLE IF EXISTS eoc_cots_config;
  `);
};
