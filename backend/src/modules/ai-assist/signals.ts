import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import type { Severity } from '../incident-ops/incidents.js';

export type ConfidenceLabel = 'High' | 'Medium' | 'Low';
export type SignalStatus = 'New' | 'Dismissed' | 'Promoted';

interface SignalSourceEventRow {
  source: string;
  occurred_at: string;
}

interface SignalListRow {
  id: string;
  summary: string;
  confidence_label: ConfidenceLabel;
  confidence_reason: string;
  detected_at: string;
  status: SignalStatus;
  source_feeds: string[] | null;
  source_events: SignalSourceEventRow[] | null;
}

interface SignalRow {
  id: string;
  summary: string;
  confidence_label: ConfidenceLabel;
  confidence_reason: string;
  detected_at: string;
  status: SignalStatus;
  dismissed_reason: string | null;
}

export const SIGNAL_NOT_FOUND = {
  error_code: 'SIGNAL_NOT_FOUND',
  message: "This signal no longer exists or you don't have access.",
} as const;

const DISMISS_REASON_REQUIRED = {
  error_code: 'SIGNAL_DISMISS_REASON_REQUIRED',
  message: 'A reason is required to dismiss a signal.',
} as const;

async function fetchSignalRow(id: string): Promise<SignalRow | null> {
  const rows = await query<SignalRow>(
    `SELECT id, summary, confidence_label, confidence_reason, detected_at, status, dismissed_reason
     FROM signals WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

/**
 * Derives a simple, deterministic type_suggestion from a signal's own
 * summary text (produced by signal-clustering.ts as
 * `${type} cluster — ...`) — a Phase-6 simplification pending a real
 * classification rule, documented per this plan's own spec. Falls back to
 * a generic label if the summary doesn't match the expected "<type>
 * cluster" shape (defensive against a future signal source that doesn't
 * follow this convention).
 */
function deriveTypeSuggestion(summary: string): string {
  const match = summary.match(/^(.+?) cluster/);
  return match ? match[1] : 'Unclassified hazard';
}

/**
 * Mounts GET /api/v1/signals, POST /api/v1/signals/{id}/promote,
 * POST /api/v1/signals/{id}/dismiss — the Signal Triage Queue backend per
 * TechArch 03c-api-comms-reporting.md.
 *
 * All three routes are gated on the `ai_assist` feature-permission (06-03's
 * seeded permission for PER-01/02/03) — signal triage and AIDraft are both
 * F9 sub-features sharing one permission string, per this phase's own
 * discretion (no narrower feature-permission is documented anywhere for
 * signal triage specifically).
 */
export default async function signalsRoutes(app: FastifyInstance) {
  app.get<{
    Querystring: { status?: SignalStatus; confidence?: ConfidenceLabel };
  }>(
    '/api/v1/signals',
    { preHandler: requirePermission('ai_assist', 'view') },
    async (req, reply) => {
      const { status, confidence } = req.query;

      const rows = await query<SignalListRow>(
        `SELECT s.id, s.summary, s.confidence_label, s.confidence_reason, s.detected_at, s.status,
                (SELECT array_agg(DISTINCT source) FROM signal_source_events WHERE signal_id = s.id) AS source_feeds,
                (SELECT json_agg(json_build_object('source', sse.source, 'occurred_at', sse.occurred_at) ORDER BY sse.occurred_at)
                   FROM signal_source_events sse WHERE sse.signal_id = s.id) AS source_events
         FROM signals s
         WHERE ($1::text IS NULL OR s.status = $1)
           AND ($2::text IS NULL OR s.confidence_label = $2)
         ORDER BY s.detected_at DESC`,
        [status ?? null, confidence ?? null],
      );

      // TechArch's literal Signal interface (id, summary, confidence_label,
      // confidence_reason, detected_at, status) plus source_feeds and
      // source_events as documented, additive, non-breaking extensions:
      // source_feeds is the de-duplicated feed-name list the Queue's own
      // Table column needs; source_events is the full per-event list (one
      // row per signal_source_events member) 06-09's Signal Detail screen
      // needs to render one Provenance chip per clustered source event —
      // the aggregated source_feeds alone can't distinguish individual
      // events sharing the same feed name. No dedicated single-id GET
      // route exists for a signal (06-04's own documented scope), so this
      // list response carries everything Signal Detail needs; 06-09
      // filters client-side by id, per this plan's own fallback note.
      return reply.code(200).send({ items: rows });
    },
  );

  // `action='view'` — promoting is a READ-only pre-fill operation per the
  // FRD, requiring only view access, not a mutating `edit`/`approve`
  // action, since NO row is created or modified besides this signal's own
  // status bookkeeping (step 4 below).
  app.post<{ Params: { id: string } }>(
    '/api/v1/signals/:id/promote',
    { preHandler: requirePermission('ai_assist', 'view') },
    async (req, reply) => {
      const signal = await fetchSignalRow(req.params.id);
      if (!signal) {
        return reply.code(404).send(SIGNAL_NOT_FOUND);
      }

      // Simple deterministic heuristic (Phase-6 simplification, documented
      // pending a real classification rule): severity_suggestion escalates
      // only for a High-confidence signal; everything else suggests a
      // Watch-level starting point for the human reviewer to adjust.
      const typeSuggestion = deriveTypeSuggestion(signal.summary);
      const severitySuggestion: Severity = signal.confidence_label === 'High' ? 'Elevated' : 'Watch';

      // **This endpoint's code path writes no row to the `incidents`
      // table anywhere, under any condition** — a structural guarantee,
      // not just a runtime check (verifiable by grepping this file for
      // any incidents-table write statement: there is none). It satisfies
      // the FRD's "enforced server-side (the promote endpoint returns a
      // pre-filled draft payload, not a created incident)" validation
      // rule and the 400 PROMOTE_REQUIRES_HUMAN_SUBMIT error-table entry's
      // intent: a client CANNOT bypass human submission through this
      // endpoint because the endpoint has no code path capable of
      // creating the incident — there is nothing to "bypass".
      const prefill = {
        name_suggestion: signal.summary,
        type_suggestion: typeSuggestion,
        severity_suggestion: severitySuggestion,
        source_signal_id: signal.id,
      };

      // Marks the queue row as reviewed — this proves a human clicked
      // "Promote," NOT that an incident exists. The resulting
      // incident-creation form (a separate, human-submitted step) is
      // entirely outside this endpoint's code path.
      await query(`UPDATE signals SET status='Promoted' WHERE id=$1`, [req.params.id]);

      return reply.code(200).send({ prefill });
    },
  );

  // `action='view'` — same "no mutation of incident data, pure
  // triage-queue bookkeeping" reasoning as promote above.
  app.post<{ Params: { id: string }; Body: { reason?: string } }>(
    '/api/v1/signals/:id/dismiss',
    { preHandler: requirePermission('ai_assist', 'view') },
    async (req, reply) => {
      const { reason } = req.body ?? ({} as never);

      // App-layer pre-check, backstopped by the DB's own
      // chk_dismissed_requires_reason CHECK constraint — a reason is
      // required to dismiss a signal.
      if (!reason || reason.trim().length === 0) {
        return reply.code(422).send(DISMISS_REASON_REQUIRED);
      }

      const signal = await fetchSignalRow(req.params.id);
      if (!signal) {
        return reply.code(404).send(SIGNAL_NOT_FOUND);
      }

      const rows = await query<SignalRow>(
        `UPDATE signals SET status='Dismissed', dismissed_reason=$1 WHERE id=$2
         RETURNING id, summary, confidence_label, confidence_reason, detected_at, status, dismissed_reason`,
        [reason, req.params.id],
      );

      return reply.code(200).send(rows[0]);
    },
  );
}
