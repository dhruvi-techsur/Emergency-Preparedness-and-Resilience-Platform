import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { computeBackoff } from './webhook-delivery-worker.js';

// No real Everbridge/AtHoc/IPAWS credential exists in this MVP sandbox
// (TechArch's adapter catalog names public-alerting vendors as
// agency-specific, out-of-band configuration this phase does not have).
// This stub simulates the adapter's NORMALIZED SEND/CALLBACK/CAP contract
// exactly as a real adapter would produce it — so the hard approval-gate,
// CAP-completeness, outage/retry, and callback-matching rules are built and
// tested against the real contract, not a fake shortcut. Swapping in a
// real vendor call later means replacing only sendViaProvider's
// provider-simulation step; every caller (notifications.ts, the routes
// below) is unaffected. Mirrors gis-adapter.ts's KNOWN_LAYER_ID /
// eoc-cots-adapter.ts's KNOWN_VENDOR doc-comment pattern precisely.
const KNOWN_PROVIDER = 'Everbridge';

// ComposeNotification.tsx's EXISTING CHANNEL_OPTIONS (SMS/Email/IPAWS) —
// read, not invented. The Everbridge-class config handles the two
// commercial channels; the IPAWS config is the one
// is_public_warning_channel:true channel, matching F14's CAP-formatting
// requirement.
const EVERBRIDGE_CHANNELS = ['SMS', 'Email'];
const IPAWS_PROVIDER = 'IPAWS';

export interface ProviderSendRequest {
  notification_id: string;
  channel: string;
  recipients: Array<{ name: string; contact: string | null }>;
  message: string;
  approved_by: string;
  approved_at: string;
  capFields?: {
    sender: string;
    event: string;
    urgency: string;
    severity: string;
    certainty: string;
    area: string;
  };
}

export interface ProviderSendResult {
  external_message_id: string;
  dispatch_status: 'sent' | 'queued_for_retry';
}

let cachedEverbridgeConfigId: string | undefined;
let cachedIpawsConfigId: string | undefined;

/**
 * Find-or-insert the two notification_provider_config rows this stub
 * adapter needs: Everbridge (SMS/Email, not a public-warning channel) and
 * IPAWS (the one is_public_warning_channel:true channel). Idempotent, same
 * lazy find-or-insert + in-process cache idiom
 * facility-adapter.ts's/cad-adapter.ts's own findOrCreate* helpers use.
 */
async function findOrCreateProviderConfigs(): Promise<{ everbridgeId: string; ipawsId: string }> {
  if (cachedEverbridgeConfigId && cachedIpawsConfigId) {
    return { everbridgeId: cachedEverbridgeConfigId, ipawsId: cachedIpawsConfigId };
  }

  const existingEverbridge = await query<{ id: string }>(
    `SELECT id FROM notification_provider_config WHERE provider_name = $1 LIMIT 1`,
    [KNOWN_PROVIDER],
  );
  if (existingEverbridge[0]) {
    cachedEverbridgeConfigId = existingEverbridge[0].id;
  } else {
    const inserted = await query<{ id: string }>(
      `INSERT INTO notification_provider_config (provider_name, channel_types, is_public_warning_channel, auth_config)
       VALUES ($1, $2, false, $3)
       RETURNING id`,
      [KNOWN_PROVIDER, EVERBRIDGE_CHANNELS, JSON.stringify({ stub: true })],
    );
    cachedEverbridgeConfigId = inserted[0].id;
  }

  const existingIpaws = await query<{ id: string }>(
    `SELECT id FROM notification_provider_config WHERE provider_name = $1 LIMIT 1`,
    [IPAWS_PROVIDER],
  );
  if (existingIpaws[0]) {
    cachedIpawsConfigId = existingIpaws[0].id;
  } else {
    const inserted = await query<{ id: string }>(
      `INSERT INTO notification_provider_config (provider_name, channel_types, is_public_warning_channel, auth_config)
       VALUES ($1, $2, true, $3)
       RETURNING id`,
      [IPAWS_PROVIDER, [IPAWS_PROVIDER], JSON.stringify({ stub: true })],
    );
    cachedIpawsConfigId = inserted[0].id;
  }

  return { everbridgeId: cachedEverbridgeConfigId, ipawsId: cachedIpawsConfigId };
}

/**
 * UPSERTs into the shared integration_health table. direction='outbound' —
 * F14's adapter sends OUT, distinct from every prior Phase 7/8 inbound-only
 * or bidirectional adapter. record_authority names the PROVIDER
 * (Everbridge/IPAWS) — F14's Outputs section frames delivery/acknowledgment
 * receipts as the provider's own data (06-integrations.md's adapter
 * catalog: "External: delivery/acknowledgment receipts"), while message
 * content/audience/approval stays EPMP-owned per that same row;
 * record_authority as a single column can only name one thing, and the
 * provider legitimately owns delivery-receipt truth specifically. Bump/
 * reset error_count exactly like every prior adapter's recordXHealth
 * helper.
 */
async function recordProviderHealth(providerName: string, status: 'online' | 'offline'): Promise<void> {
  await query(
    `INSERT INTO integration_health (system_name, last_sync_at, direction, record_authority, sync_status, error_count)
     VALUES ($1, now(), 'outbound', $1, $2, $3)
     ON CONFLICT (system_name) DO UPDATE SET
       last_sync_at = now(),
       direction = 'outbound',
       record_authority = $1,
       sync_status = $2,
       error_count = CASE WHEN $2 = 'online' THEN 0 ELSE integration_health.error_count + 1 END`,
    [providerName, status, status === 'offline' ? 1 : 0],
  );
}

/**
 * A pure function building a minimal, well-formed OASIS CAP 1.2-shaped XML
 * string containing ALL required CAP fields: identifier, sender, sent,
 * status, scope, and an info block with category/event/urgency/severity/
 * certainty/area. XML-escapes message/area/sender (replacing &, <, >)
 * before interpolation — this is a hand-built string, not an XML library
 * call, matching this codebase's "no new dependency unless necessary"
 * convention (same choice gis-adapter.ts/eoc-cots-adapter.ts make for their
 * own simulated vendor payloads).
 */
export function buildCapEnvelope(req: {
  notification_id: string;
  message: string;
  sender: string;
  event: string;
  urgency: string;
  severity: string;
  certainty: string;
  area: string;
}): string {
  const escapeXml = (value: string): string =>
    value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const identifier = randomUUID();
  const sentIso = new Date().toISOString();
  // Category is derived from the event — this MVP stub uses a single
  // fixed CAP category ('Met', the OASIS CAP vocabulary term for
  // meteorological/environmental hazards) since no per-event-type category
  // mapping exists in this phase's scope; a future enhancement could
  // derive it from incidents.type instead.
  const category = 'Met';

  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${identifier}</identifier>
  <sender>${escapeXml(req.sender)}</sender>
  <sent>${sentIso}</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <category>${category}</category>
    <event>${escapeXml(req.event)}</event>
    <urgency>${escapeXml(req.urgency)}</urgency>
    <severity>${escapeXml(req.severity)}</severity>
    <certainty>${escapeXml(req.certainty)}</certainty>
    <description>${escapeXml(req.message)}</description>
    <area><areaDesc>${escapeXml(req.area)}</areaDesc></area>
  </info>
</alert>`;
}

/**
 * The hard constraint, re-stated at THIS layer: the VERY FIRST thing this
 * function does, before touching any provider-simulation logic, is reject
 * any request missing approved_by/approved_at. This is independent of
 * notifications.ts's own existing approval gate — a future caller invoking
 * this function directly (bypassing the route entirely) is STILL blocked,
 * since the adapter itself refuses to proceed without both fields present.
 * The adapter rejects any request missing approved_by/approved_at
 * unconditionally, with no override, regardless of caller — per F14's FRD
 * Validation rule verbatim.
 */
export async function sendViaProvider(req: ProviderSendRequest): Promise<ProviderSendResult> {
  if (!req.approved_by || !req.approved_at) {
    throw Object.assign(new Error('SEND_REQUIRES_APPROVAL'), { code: 'SEND_REQUIRES_APPROVAL' });
  }

  const { everbridgeId, ipawsId } = await findOrCreateProviderConfigs();
  void everbridgeId;
  void ipawsId;

  const isIpaws = req.channel === IPAWS_PROVIDER;

  // CAP formatting gate — rejected BEFORE any dispatch attempt, never
  // partially sent. identifier/sent/status/scope are derivable internally
  // (handled inside buildCapEnvelope); sender/event/urgency/severity/
  // certainty/area MUST come from the caller.
  if (isIpaws) {
    const missing: string[] = [];
    const capFields = req.capFields;
    if (!capFields) {
      missing.push('sender', 'event', 'urgency', 'severity', 'certainty', 'area');
    } else {
      if (!capFields.sender) missing.push('sender');
      if (!capFields.event) missing.push('event');
      if (!capFields.urgency) missing.push('urgency');
      if (!capFields.severity) missing.push('severity');
      if (!capFields.certainty) missing.push('certainty');
      if (!capFields.area) missing.push('area');
    }
    if (missing.length > 0) {
      throw Object.assign(new Error('CAP_FIELDS_INCOMPLETE'), {
        code: 'CAP_FIELDS_INCOMPLETE',
        missing,
      });
    }
  }

  // Recognized-vs-unrecognized trigger: a channel outside the Everbridge
  // config's SMS/Email set or the IPAWS channel itself, OR the literal
  // test-injection trigger message === 'FORCE_PROVIDER_OUTAGE' (same
  // documented recognized-vs-unrecognized shape as cad-adapter.ts's own
  // simulateFailure param doc comment), simulates a provider outage.
  const providerName = isIpaws ? IPAWS_PROVIDER : KNOWN_PROVIDER;
  const isRecognizedChannel = isIpaws || EVERBRIDGE_CHANNELS.includes(req.channel);
  const isForcedOutage = req.message === 'FORCE_PROVIDER_OUTAGE';

  if (!isRecognizedChannel || isForcedOutage) {
    await recordProviderHealth(providerName, 'offline');
    await query(
      `INSERT INTO notification_dispatch_log (notification_id, provider_name, dispatch_status)
       VALUES ($1, $2, 'failed')`,
      [req.notification_id, providerName],
    );
    // NOT a throw — unlike the approval/CAP gates above, a provider
    // outage is F14's documented "queue for retry" graceful-failure path,
    // not a hard rejection. The caller (notifications.ts) must NOT treat
    // this return value as a dispatch success.
    return { external_message_id: '', dispatch_status: 'queued_for_retry' };
  }

  // Success path.
  const externalMessageId = randomUUID();
  await query(
    `INSERT INTO notification_dispatch_log (notification_id, provider_name, external_message_id, dispatch_status, dispatched_at)
     VALUES ($1, $2, $3, 'sent', now())`,
    [req.notification_id, providerName, externalMessageId],
  );
  await recordProviderHealth(providerName, 'online');

  if (isIpaws && req.capFields) {
    const capXml = buildCapEnvelope({
      notification_id: req.notification_id,
      message: req.message,
      sender: req.capFields.sender,
      event: req.capFields.event,
      urgency: req.capFields.urgency,
      severity: req.capFields.severity,
      certainty: req.capFields.certainty,
      area: req.capFields.area,
    });
    // cap_identifier is re-extracted from the generated XML's own
    // <identifier> so the persisted record and the XML never disagree —
    // simpler than threading the UUID through buildCapEnvelope's return
    // shape (a pure string), and buildCapEnvelope's own identifier
    // generation is itself what makes identifiers unique per call.
    const identifierMatch = capXml.match(/<identifier>([^<]+)<\/identifier>/);
    const capIdentifier = identifierMatch ? identifierMatch[1] : randomUUID();
    await query(
      `INSERT INTO cap_alert_records (notification_id, cap_identifier, sender, cap_xml, sent_at)
       VALUES ($1, $2, $3, $4, now())`,
      [req.notification_id, capIdentifier, req.capFields.sender, capXml],
    );
  }

  return { external_message_id: externalMessageId, dispatch_status: 'sent' };
}

interface DispatchLogRow {
  id: string;
  notification_id: string;
  provider_name: string;
  external_message_id: string | null;
  dispatch_status: string;
  retry_count: number;
}

/**
 * Scheduled job: re-queue scan over notification_dispatch_log rows stuck
 * at dispatch_status='failed'. This MVP stub does not re-attempt the
 * ORIGINAL provider call per se, since it has no live vendor to actually
 * retry against; instead it demonstrates the required OBSERVABLE
 * behavior: on each sweep tick, for each failed row, bump retry_count, and
 * if retry_count would now exceed 3, update the row's linked
 * notification's recipients' notification_delivery_status to 'Failed'
 * with a visible failure_reason — F5's EXISTING table, never a new one,
 * matching F14's literal "failures surface in F5's delivery view"
 * requirement.
 *
 * background_jobs bookkeeping is scoped EXCLUSIVELY to
 * job_type = 'notification_fanout' — confirmed via
 * `grep -rn "notification_fanout" backend/src` returning nothing before
 * this task claimed it. It exists in Phase 1's original CHECK constraint
 * list, reserved but never claimed by any Phase 1-8 adapter — making it
 * the correct, already-available value, requiring NO migration ALTER,
 * unlike Plan 07-02/08-02's 'cad_ingestion'/'facility_sync' additions. On
 * any sweep-tick failure (a DB error during the sweep itself, not a
 * dispatch-log row being in 'failed' state — that's the expected input),
 * status='backoff' + failure_count bumped + next_retry_at via
 * computeBackoff(failureCount) (imported from webhook-delivery-worker.ts,
 * never reimplemented); on a clean sweep run, status='idle' +
 * last_run_at=now().
 */
export async function runNotificationRetrySweep(): Promise<{ swept: number }> {
  let swept = 0;

  try {
    const failedRows = await query<DispatchLogRow>(
      `SELECT id, notification_id, provider_name, external_message_id, dispatch_status, retry_count
       FROM notification_dispatch_log WHERE dispatch_status = 'failed'`,
    );

    for (const row of failedRows) {
      const newRetryCount = row.retry_count + 1;
      await query(`UPDATE notification_dispatch_log SET retry_count = $1 WHERE id = $2`, [
        newRetryCount,
        row.id,
      ]);
      swept += 1;

      if (newRetryCount > 3) {
        await query(
          `UPDATE notification_delivery_status SET status = 'Failed', failure_reason = $1, updated_at = now()
           WHERE notification_recipient_id IN (
             SELECT id FROM notification_recipients WHERE notification_id = $2
           )`,
          ['Provider unavailable after 3 retry attempts', row.notification_id],
        );
      }
    }

    const existingJob = await query<{ id: string }>(
      `SELECT id FROM background_jobs WHERE job_type = 'notification_fanout' LIMIT 1`,
    );
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'idle', last_run_at = now(), failure_count = 0, next_retry_at = NULL
         WHERE id = $1`,
        [existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, last_run_at) VALUES ('notification_fanout', 'idle', now())`,
      );
    }
  } catch (err) {
    const existingJob = await query<{ id: string; failure_count: number }>(
      `SELECT id, failure_count FROM background_jobs WHERE job_type = 'notification_fanout' LIMIT 1`,
    );
    const failureCount = (existingJob[0]?.failure_count ?? 0) + 1;
    const nextRetryAt = computeBackoff(failureCount);
    if (existingJob[0]) {
      await query(
        `UPDATE background_jobs SET status = 'backoff', failure_count = $1, next_retry_at = $2, last_run_at = now()
         WHERE id = $3`,
        [failureCount, nextRetryAt, existingJob[0].id],
      );
    } else {
      await query(
        `INSERT INTO background_jobs (job_type, status, failure_count, next_retry_at, last_run_at)
         VALUES ('notification_fanout', 'backoff', $1, $2, now())`,
        [failureCount, nextRetryAt],
      );
    }
    throw err;
  }

  return { swept };
}

interface IntegrationHealthRow {
  id: string;
  system_name: string;
  last_sync_at: string | null;
  direction: 'inbound' | 'outbound' | 'bidirectional';
  record_authority: string;
  sync_status: 'online' | 'syncing' | 'offline' | 'conflict';
  error_count: number;
  updated_at: string;
}

const STATUS_MAP: Record<string, 'Sent' | 'Delivered' | 'Failed' | 'Acknowledged'> = {
  sent: 'Sent',
  delivered: 'Delivered',
  failed: 'Failed',
  acknowledged: 'Acknowledged',
};

/**
 * Mounts F14's notification-provider routes:
 *  - POST /api/v1/integrations/notification-providers/send
 *  - POST /api/v1/integrations/notification-providers/callback
 *  - GET /api/v1/integrations/notification-providers/health
 */
export async function notificationProviderRoutes(app: FastifyInstance) {
  app.post<{ Body: ProviderSendRequest }>(
    '/api/v1/integrations/notification-providers/send',
    // Matching F5's OWN send-gate permission exactly, since this route is
    // the direct-API-bypass surface this plan's own threat model/must-have
    // targets — a caller without notifications:approve cannot even reach
    // this route, and a caller WITH it who omits approved_by/approved_at in
    // the body is still rejected by sendViaProvider's adapter-level
    // re-check.
    { preHandler: requirePermission('notifications', 'approve') },
    async (req, reply) => {
      try {
        const result = await sendViaProvider(req.body);
        return reply.code(202).send(result);
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === 'SEND_REQUIRES_APPROVAL') {
          return reply.code(400).send({
            error_code: 'SEND_REQUIRES_APPROVAL',
            message: "This message hasn't been approved and can't be sent.",
          });
        }
        if (code === 'CAP_FIELDS_INCOMPLETE') {
          return reply.code(422).send({
            error_code: 'CAP_FIELDS_INCOMPLETE',
            message: 'This public warning is missing required fields. Complete it before sending.',
            missing: (err as { missing?: string[] }).missing ?? [],
          });
        }
        // 403 CAP_AUTHORITY_DENIED is documented in the FRD/TechArch error
        // table for an agency lacking IPAWS/CAP channel authorization.
        // This single-agency MVP stub has no per-agency CAP-authorization
        // config concept at all, so that path is unreachable in this
        // scope — deliberately omitted here rather than thrown for
        // symmetry with a condition this stub can never produce.
        throw err;
      }
    },
  );

  app.post<{
    Body: {
      external_message_id?: string;
      recipient?: string;
      status?: 'sent' | 'delivered' | 'failed' | 'acknowledged';
      timestamp?: string;
    };
  }>(
    // No auth preHandler — this is an INBOUND webhook from the simulated
    // external provider, matching F14's own framing as an
    // unauthenticated-by-design external callback surface, same posture as
    // any inbound webhook receiver in this codebase.
    '/api/v1/integrations/notification-providers/callback',
    async (req, reply) => {
      const { external_message_id, recipient, status } = req.body ?? {};

      if (!external_message_id || !recipient || !status) {
        req.log.warn({ body: req.body }, 'CALLBACK_UNMATCHED: missing required callback fields');
        return reply.code(200).send({ status: 'logged' });
      }

      const dispatchRows = await query<{ notification_id: string }>(
        `SELECT notification_id FROM notification_dispatch_log WHERE external_message_id = $1 LIMIT 1`,
        [external_message_id],
      );
      const dispatchRow = dispatchRows[0];
      if (!dispatchRow) {
        req.log.warn({ external_message_id }, 'CALLBACK_UNMATCHED: no matching dispatch_log row');
        return reply.code(200).send({ status: 'logged' });
      }

      const recipientRows = await query<{ id: string }>(
        `SELECT id FROM notification_recipients
         WHERE notification_id = $1 AND recipient_contact = $2
         LIMIT 1`,
        [dispatchRow.notification_id, recipient],
      );
      const recipientRow = recipientRows[0];
      if (!recipientRow) {
        req.log.warn(
          { external_message_id, recipient },
          'CALLBACK_UNMATCHED: no matching notification_recipients row',
        );
        return reply.code(200).send({ status: 'logged' });
      }

      const mappedStatus = STATUS_MAP[status];
      if (mappedStatus) {
        await query(
          `UPDATE notification_delivery_status SET status = $1, updated_at = now() WHERE notification_recipient_id = $2`,
          [mappedStatus, recipientRow.id],
        );
      }

      return reply.code(200).send({ status: 'ok' });
    },
  );

  app.get(
    '/api/v1/integrations/notification-providers/health',
    { preHandler: requirePermission('admin', 'view') },
    async (_req, reply) => {
      const rows = await query<IntegrationHealthRow>(
        `SELECT id, system_name, last_sync_at, direction, record_authority, sync_status, error_count, updated_at
         FROM integration_health WHERE system_name IN ($1, $2)`,
        [KNOWN_PROVIDER, IPAWS_PROVIDER],
      );
      return reply.code(200).send({ items: rows });
    },
  );

  // GET /api/v1/_test/notification-retry-sweep — test-only, never
  // documented in the public OpenAPI schema. Mirrors cad-adapter.ts's
  // `/api/v1/_test/cad-forced-outage` route exactly (same "explicit,
  // unguessable-by-accident, HTTP-reachable" shape, invoked SERVER-SIDE
  // inside this already-running backend process with a real
  // DATABASE_URL-backed pool — no backend-source import into the
  // Playwright test runner's own Node process). A real deployment's retry
  // sweep runs on startNotificationRetryScheduler's 5-minute interval;
  // Plan 09-03's own Playwright coverage (test 5) needs to drive
  // retry_count past 3 deterministically within a single test's timeout,
  // which means calling the sweep function on demand rather than waiting
  // for the real scheduler tick. Gated on 'notifications'/'view' — the
  // same permission domain this module's own delivery-status route uses,
  // not 'admin'/'view', since this exists to support Delivery Tracking's
  // own e2e coverage of the forced-outage Failed-state path.
  app.get(
    '/api/v1/_test/notification-retry-sweep',
    { preHandler: requirePermission('notifications', 'view') },
    async (_req, reply) => {
      const result = await runNotificationRetrySweep();
      return reply.code(200).send(result);
    },
  );
}

let intervalHandle: NodeJS.Timeout | undefined;

/**
 * Same idempotent-against-double-start shape as every prior scheduler
 * (startEocCotsSyncScheduler, startFacilitySyncScheduler, etc).
 */
export function startNotificationRetryScheduler(intervalMs: number = 300_000): void {
  if (intervalHandle) return;
  intervalHandle = setInterval(() => {
    runNotificationRetrySweep().catch((err) =>
      console.error('[notification-provider-adapter] retry sweep failed', err),
    );
  }, intervalMs);
}
