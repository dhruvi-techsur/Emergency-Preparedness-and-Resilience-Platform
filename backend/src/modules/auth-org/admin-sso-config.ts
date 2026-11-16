import type { FastifyInstance } from 'fastify';
import { requirePermission } from './rbac.js';
import { AuditService } from './audit.js';
import { query } from '../../db/client.js';

interface SsoConfigRow {
  id: string;
  protocol: 'SAML2' | 'OIDC';
  idp_metadata_url: string | null;
  idp_metadata_xml: string | null;
  attribute_mapping: { email_attr: string; name_attr: string; group_attr: string };
  group_to_role_mapping: Array<{ idp_group: string; role_id: string }>;
  tested_at: string | null;
  active: boolean;
}

interface VerifyResult {
  success: boolean;
  details: string;
}

/**
 * Phase 1 scope: verify the IdP metadata is reachable and parseable.
 * OIDC: fetch the discovery document, require it to be JSON with an
 * `issuer` field. SAML2: require the metadata XML to be well-formed
 * (balanced tags, looks like an EntityDescriptor document). Full SAML
 * assertion validation happens at actual login time via 01-03's
 * handleSsoCallback, not here.
 */
async function verifyIdpMetadata(
  protocol: 'SAML2' | 'OIDC',
  idp_metadata_url?: string | null,
  idp_metadata_xml?: string | null,
): Promise<VerifyResult> {
  if (protocol === 'OIDC') {
    if (!idp_metadata_url) {
      return { success: false, details: 'OIDC protocol requires idp_metadata_url.' };
    }
    try {
      const res = await fetch(idp_metadata_url);
      if (!res.ok) {
        return { success: false, details: `Metadata URL returned HTTP ${res.status}.` };
      }
      const body = (await res.json()) as Record<string, unknown>;
      if (typeof body.issuer !== 'string') {
        return { success: false, details: 'Discovery document is missing a string "issuer" field.' };
      }
      return { success: true, details: 'OIDC discovery document fetched and parsed successfully.' };
    } catch (err) {
      return { success: false, details: `Could not reach or parse metadata URL: ${(err as Error).message}` };
    }
  }

  // SAML2
  if (!idp_metadata_xml || idp_metadata_xml.trim().length === 0) {
    return { success: false, details: 'SAML2 protocol requires idp_metadata_xml.' };
  }
  const xml = idp_metadata_xml.trim();
  if (!xml.includes('<') || !xml.includes('>') || !xml.includes('EntityDescriptor')) {
    return { success: false, details: 'XML does not look like a SAML2 EntityDescriptor document.' };
  }
  const opens = (xml.match(/<[^/!?][^>]*[^/]>/g) ?? []).length;
  const closes = (xml.match(/<\/[^>]+>/g) ?? []).length;
  const selfClosing = (xml.match(/<[^>]*\/>/g) ?? []).length;
  if (opens - selfClosing !== closes) {
    return { success: false, details: 'XML tags are not balanced — metadata appears malformed.' };
  }
  return { success: true, details: 'SAML2 metadata XML is well-formed.' };
}

async function fetchCurrentConfig(): Promise<SsoConfigRow | undefined> {
  const rows = await query<SsoConfigRow>(
    `SELECT id, protocol, idp_metadata_url, idp_metadata_xml, attribute_mapping, group_to_role_mapping, tested_at, active
     FROM sso_config ORDER BY active DESC, created_at DESC LIMIT 1`,
  );
  return rows[0];
}

export default async function adminSsoConfigRoutes(app: FastifyInstance) {
  app.get(
    '/api/v1/admin/sso-config',
    { preHandler: requirePermission('admin', 'view') },
    async (req, reply) => {
      const row = await fetchCurrentConfig();
      if (!row) {
        return reply.code(404).send({ error_code: 'SSO_CONFIG_NOT_FOUND', message: 'No SSO configuration exists yet.' });
      }

      // SSO config is a sensitive record type: reading it is itself a
      // security-relevant action per F08's audit spec ("record access to a
      // sensitive record type"). Write the audit entry AFTER a successful
      // read, BEFORE responding.
      await AuditService.record(req.epmpUser!.id, 'record_view', 'sso_config', row.id);

      return reply.code(200).send(row);
    },
  );

  app.post<{
    Body: { protocol: 'SAML2' | 'OIDC'; idp_metadata_url?: string; idp_metadata_xml?: string };
  }>(
    '/api/v1/admin/sso-config/test',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const { protocol, idp_metadata_url, idp_metadata_xml } = req.body ?? ({} as never);
      // Dry-run only — this is explicitly NOT saved to the database, per
      // F8's "no untested IdP config goes live" rule.
      const result = await verifyIdpMetadata(protocol, idp_metadata_url, idp_metadata_xml);
      return reply.code(200).send(result);
    },
  );

  app.patch<{
    Body: Partial<{
      protocol: 'SAML2' | 'OIDC';
      idp_metadata_url: string;
      idp_metadata_xml: string;
      attribute_mapping: { email_attr: string; name_attr: string; group_attr: string };
      group_to_role_mapping: Array<{ idp_group: string; role_id: string }>;
      active: boolean;
    }>;
  }>(
    '/api/v1/admin/sso-config',
    { preHandler: requirePermission('admin', 'edit') },
    async (req, reply) => {
      const body = req.body ?? {};
      const current = await fetchCurrentConfig();
      if (!current) {
        return reply.code(404).send({ error_code: 'SSO_CONFIG_NOT_FOUND', message: 'No SSO configuration exists yet.' });
      }

      const merged = {
        protocol: body.protocol ?? current.protocol,
        idp_metadata_url: body.idp_metadata_url ?? current.idp_metadata_url ?? undefined,
        idp_metadata_xml: body.idp_metadata_xml ?? current.idp_metadata_xml ?? undefined,
        attribute_mapping: body.attribute_mapping ?? current.attribute_mapping,
        group_to_role_mapping: body.group_to_role_mapping ?? current.group_to_role_mapping,
      };

      const wantsActive = body.active === true;
      let tested_at: string | null = current.tested_at;
      let active = body.active ?? current.active;

      if (wantsActive) {
        // Server-side gate: NEVER trust a client-asserted "I tested it"
        // claim — re-run the exact same reachability check server-side,
        // using the config this PATCH would actually persist, before
        // allowing activation.
        const result = await verifyIdpMetadata(merged.protocol, merged.idp_metadata_url, merged.idp_metadata_xml);
        if (!result.success) {
          return reply.code(422).send({
            error_code: 'SSO_CONFIG_INVALID',
            message: "Couldn't validate this identity provider configuration. Check the metadata URL and retry.",
            details: { reason: result.details },
          });
        }
        tested_at = new Date().toISOString();
        active = true;
      }

      const before = {
        protocol: current.protocol,
        idp_metadata_url: current.idp_metadata_url,
        idp_metadata_xml: current.idp_metadata_xml,
        attribute_mapping: current.attribute_mapping,
        group_to_role_mapping: current.group_to_role_mapping,
        active: current.active,
        tested_at: current.tested_at,
      };

      const updatedRows = await query<SsoConfigRow>(
        `UPDATE sso_config
         SET protocol = $1, idp_metadata_url = $2, idp_metadata_xml = $3,
             attribute_mapping = $4, group_to_role_mapping = $5,
             tested_at = $6, active = $7, updated_at = now()
         WHERE id = $8
         RETURNING id, protocol, idp_metadata_url, idp_metadata_xml, attribute_mapping, group_to_role_mapping, tested_at, active`,
        [
          merged.protocol,
          merged.idp_metadata_url ?? null,
          merged.idp_metadata_xml ?? null,
          JSON.stringify(merged.attribute_mapping),
          JSON.stringify(merged.group_to_role_mapping),
          tested_at,
          active,
          current.id,
        ],
      );
      const after = updatedRows[0];

      await AuditService.record(req.epmpUser!.id, 'sso_config_change', 'sso_config', after.id, { before, after });

      return reply.code(200).send(after);
    },
  );
}
