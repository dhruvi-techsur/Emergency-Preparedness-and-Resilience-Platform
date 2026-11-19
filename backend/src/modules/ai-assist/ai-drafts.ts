import type { FastifyInstance } from 'fastify';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';

export type AiDraftTargetFeature = 'ics_form' | 'notification' | 'sitrep' | 'aar';
export type ConfidenceLabel = 'High' | 'Medium' | 'Low';

interface AiDraftSource {
  source: string;
  time: string;
  confidence: ConfidenceLabel;
}

interface GatewayResult {
  draft_text: string;
  sources: AiDraftSource[];
  confidence_label: ConfidenceLabel;
}

// -----------------------------------------------------------------------
// **Cross-phase route relocation — not a new feature, a move.**
//
// Phase 4's 04-01 already implemented POST /api/v1/ai-drafts,
// .../approve, .../discard inline inside comms-reporting/notifications.ts
// (gated on the 'notifications' feature-permission, since no dedicated
// ai_assist permission existed yet at that point in the roadmap). This
// plan is Phase 6's F9-proper home for these three routes — per
// TechArch 01-components.md, ai-drafts is an ai-assist module concern,
// not a notifications concern, and this plan's own Task 2 seeds the
// FRD-named ai_assist feature-permission (PER-01/02/03 only) these routes
// should actually be gated on. Registering the SAME three paths a second
// time in a second Fastify plugin would throw FST_ERR_DUPLICATE_ROUTE at
// boot, so this is a RELOCATION: notifications.ts's three ai-drafts
// routes are removed (see that file's own inline note at the same spot)
// and the governance guard they exist to feed (assertAiOriginApproved)
// is untouched — it reads ai_drafts.approved_by directly from the table,
// not from any route, so relocating the routes changes nothing about
// how 04-01/04-02/06-01's existing AI-governance-guard consumers work.
//
// Two behavioral upgrades land with the move, both required by this
// plan's own spec and the FRD/TechArch it's built from (04-01's version
// predates both documents being read this closely):
//  1. POST /api/v1/ai-drafts now returns 200 (not 201) on success,
//     matching TechArch 03c's literal "AiDraftResponse" / "200
//     AIDRAFT_NO_SOURCE (flagged)" row — the no-source case is NOT a
//     different HTTP status, so there must be exactly one success status
//     for this route, and TechArch's table says 200.
//  2. draftViaGateway() is now content-aware: an empty `context` produces
//     the FRD's exact AIDRAFT_NO_SOURCE draft body + empty sources array
//     (04-01's version always fabricated a non-empty sources array
//     regardless of context, which could never satisfy "never presents
//     as sourced when it is not" for a context-less request).
// -----------------------------------------------------------------------

/**
 * Deterministic stand-in for TechArch 2.2's model-neutral Intelligence
 * Layer gateway — "deployed as an independently-scalable service... own
 * container/pod," out of this phase's infrastructure scope (same
 * documented simplification Phase 4's unexecuted 04-01-PLAN.md already
 * established for its own notifications-scoped stub). Swapping this
 * function's body for a real gateway call is a contract-preserving
 * drop-in replacement — callers only ever see the GatewayResult shape.
 */
function draftViaGateway(context: string, _targetField: string): GatewayResult {
  if (context.trim().length === 0) {
    // Satisfies the ai_drafts table's chk_sources_or_flagged CHECK
    // (empty sources requires draft_text ILIKE '%no source%') and the
    // FRD's exact AIDRAFT_NO_SOURCE wording — this is a 200 (flagged),
    // never an error status.
    return {
      draft_text: 'No source available for this draft. Review carefully before using it.',
      sources: [],
      confidence_label: 'Low',
    };
  }
  return {
    draft_text: `Drafted summary (stub \u2014 no live AI gateway in this environment): ${context.slice(0, 300)}`,
    sources: [{ source: 'Reviewed notes', time: new Date().toISOString(), confidence: 'Medium' }],
    confidence_label: 'Medium',
  };
}

const APPROVAL_REQUIRES_NAMED_USER = {
  error_code: 'APPROVAL_REQUIRES_NAMED_USER',
  // FRD's exact wording for THIS context (service/system-account approval
  // attempt) — deliberately a DIFFERENT string from ics-forms.ts's own
  // 403 APPROVAL_REQUIRES_NAMED_USER message ("Approval must be made by
  // a signed-in person, not an automated process."). Y2-errors.md
  // documents both strings sharing the same error code for two distinct
  // validation contexts (rows 28 and 30) — this route uses row 30's
  // wording.
  message: 'AI drafts must be approved by a signed-in person.',
} as const;

const AI_DRAFT_NOT_FOUND = {
  error_code: 'RECORD_NOT_FOUND',
  message: "This item no longer exists or you don't have access.",
} as const;

interface AiDraftInsertRow {
  id: string;
  draft_text: string;
  sources: AiDraftSource[];
  confidence_label: ConfidenceLabel;
}

/**
 * Mounts POST /api/v1/ai-drafts, POST /api/v1/ai-drafts/{id}/approve,
 * POST /api/v1/ai-drafts/{id}/discard — the model-neutral-gateway-client
 * stub per TechArch 01-components.md \u00a72.2, swappable without a
 * contract change. Gated on the 'ai_assist' feature-permission (seeded
 * in this plan's Task 2 for PER-01 eoc_director, PER-02
 * incident_commander, PER-03 planning_logistics_chief only).
 */
export default async function aiDraftsRoutes(app: FastifyInstance) {
  app.post<{
    Body: {
      target_feature: AiDraftTargetFeature;
      target_field: string;
      context: string;
      requesting_user_id: string;
    };
  }>(
    '/api/v1/ai-drafts',
    { preHandler: requirePermission('ai_assist', 'create') },
    async (req, reply) => {
      const { target_feature, target_field, context, requesting_user_id } = req.body ?? ({} as never);

      const gatewayResult = draftViaGateway(context ?? '', target_field);

      const rows = await query<AiDraftInsertRow>(
        `INSERT INTO ai_drafts (target_feature, target_field, draft_text, sources, confidence_label, requesting_user_id)
         VALUES ($1,$2,$3,$4,$5,$6)
         RETURNING id, draft_text, sources, confidence_label`,
        [
          target_feature,
          target_field,
          gatewayResult.draft_text,
          JSON.stringify(gatewayResult.sources),
          gatewayResult.confidence_label,
          requesting_user_id ?? req.epmpUser!.id,
        ],
      );
      const row = rows[0];

      const responseBody: {
        id: string;
        draft_text: string;
        sources: AiDraftSource[];
        confidence_label: ConfidenceLabel;
        error_code?: string;
      } = {
        id: row.id,
        draft_text: row.draft_text,
        sources: row.sources,
        confidence_label: row.confidence_label,
      };
      // The "200 (flagged)" case per Y2-errors.md/TechArch 03c: the flag
      // rides inside a 200 body, never a different HTTP status. Only set
      // when the gateway itself flagged a no-source result (never
      // inferred a second time from the response shape, so a sourced
      // draft can never accidentally carry this code).
      if (gatewayResult.sources.length === 0) {
        responseBody.error_code = 'AIDRAFT_NO_SOURCE';
      }
      return reply.code(200).send(responseBody);
    },
  );

  app.post<{
    Params: { id: string };
    Body: { approver_id?: string; edited_text?: string };
  }>(
    '/api/v1/ai-drafts/:id/approve',
    { preHandler: requirePermission('ai_assist', 'approve') },
    async (req, reply) => {
      const { approver_id, edited_text } = req.body ?? ({} as never);

      // A missing approver_id OR one that doesn't match the signed-in
      // caller both fail the SAME FRD-named gate — this route never
      // trusts a client-asserted approver_id alone, same
      // re-verification-against-req.epmpUser pattern 06-01's ics-forms
      // approve route already establishes.
      if (!approver_id || approver_id !== req.epmpUser!.id) {
        return reply.code(403).send(APPROVAL_REQUIRES_NAMED_USER);
      }

      const rows = await query<{ id: string; approved_by: string; approved_at: string }>(
        `UPDATE ai_drafts SET action='approve', approved_by=$1, approved_at=now(), edited_text=$2
         WHERE id=$3 RETURNING id, approved_by, approved_at`,
        [approver_id, edited_text ?? null, req.params.id],
      );
      if (!rows[0]) {
        return reply.code(404).send(AI_DRAFT_NOT_FOUND);
      }
      return reply.code(200).send(rows[0]);
    },
  );

  app.post<{ Params: { id: string } }>(
    '/api/v1/ai-drafts/:id/discard',
    { preHandler: requirePermission('ai_assist', 'discard') },
    async (req, reply) => {
      // NEVER a DELETE — the FRD's own Outputs section requires the
      // discard leave "an audit note only (no content retained)" on the
      // record; the row itself IS that audit note. Only its `action`
      // column changes.
      await query(`UPDATE ai_drafts SET action='discard' WHERE id=$1`, [req.params.id]);
      return reply.code(204).send();
    },
  );
}
