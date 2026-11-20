import * as React from 'react';
import { Badge } from '../feedback/Badge';
import { Button } from '../actions/Button';
import { TextField } from '../forms/TextField';
import { Provenance } from './Provenance';
import './AIDraft.css';

export interface AIDraftSource {
  source: string;
  time?: string;
  confidence?: string;
}

export interface AIDraftProps {
  /** The draft text itself. When sources is empty, this MUST already state
   * "No source available" or "Low confidence" per F9's own rule — AIDraft
   * does not synthesize this note itself, it only renders whatever text is
   * passed (the caller/backend is responsible for the no-source statement
   * being present in draftText, matching the backend's chk_sources_or_flagged
   * CHECK constraint this mirrors on the frontend side). */
  draftText: string;
  /** One Provenance chip rendered per entry. Empty array is valid ONLY when
   * draftText itself states "no source"/"low confidence" (enforced by the
   * backend, not re-validated here — this component trusts its input the
   * same way Provenance trusts its own verified prop). */
  sources: AIDraftSource[];
  /** Called with the (possibly edited) final text when Approve is clicked.
   * This is the ONLY callback through which this component's text can leave
   * it — there is no onChange/onDraftTextUpdate prop that could let a caller
   * accidentally wire live text into a target field before approval. */
  onApprove: (finalText: string) => void;
  /** Called when Edit is clicked — this component does not manage its own
   * edit-mode text state; the PARENT owns `editing`/the editable text value
   * and re-renders this component with updated draftText, since different
   * embedding pages (ICS form multiline field vs. a single-line notification
   * subject) need different editing affordances. */
  onEdit: () => void;
  onDiscard: () => void;
  /** When true, renders an editable TextField instead of static draftText,
   * and Approve's callback receives the field's current value. Caller-owned
   * state, per the onEdit doc above. */
  editing?: boolean;
  /** Current editable value, used only when editing=true. */
  editingValue?: string;
  onEditingValueChange?: (value: string) => void;
}

/**
 * EPMP Design System — AIDraft (PRODUCT PATTERNS)
 *
 * The ONLY UI surface through which AI output reaches a person anywhere in
 * EPMP (F9's own terminology section). Always shows a persistent "Not
 * issued" Badge — nothing in this component's props or internal state can
 * hide that Badge before Approve is clicked; there is no prop like
 * `issued` or `hideBadge`. Renders one Provenance chip per `sources` entry.
 * Footer has exactly three actions: Discard (ghost), Edit (secondary),
 * Approve (primary) — "Approve" is always rightmost/primary per the design
 * system's established footer-action-ordering convention (PageHeader.actions,
 * Modal.footer).
 *
 * Structural guarantee: this component has NO prop capable of writing its
 * draft text anywhere outside itself. `onApprove(finalText)` hands the text
 * back to the CALLER, which decides what to do with it (typically: call the
 * backend's own `/api/v1/ai-drafts/{id}/approve` endpoint, which is the
 * actual governance gate — this component cannot bypass that, it can only
 * ever request approval, never perform it). This is what makes "never
 * appears pre-inserted into the record" true by construction: there is no
 * code path through which rendering this component alone writes anything.
 */
export function AIDraft({
  draftText,
  sources,
  onApprove,
  onEdit,
  onDiscard,
  editing = false,
  editingValue,
  onEditingValueChange,
}: AIDraftProps) {
  const handleApprove = () => {
    onApprove(editing ? (editingValue ?? draftText) : draftText);
  };

  return (
    <div className="ep-ai-draft">
      <div className="ep-ai-draft__header">
        <Badge tone="neutral">Not issued</Badge>
      </div>

      <div className="ep-ai-draft__body">
        {editing ? (
          <TextField
            label="Edit draft"
            multiline
            value={editingValue ?? draftText}
            onChange={(e) => onEditingValueChange?.(e.target.value)}
          />
        ) : (
          <p className="ep-ai-draft__text">{draftText}</p>
        )}
      </div>

      {sources.length > 0 ? (
        <div className="ep-ai-draft__sources">
          {sources.map((s, i) => (
            <Provenance key={i} source={s.source} time={s.time} confidence={s.confidence} />
          ))}
        </div>
      ) : null}

      <div className="ep-ai-draft__footer">
        <Button variant="ghost" onClick={onDiscard}>
          Discard
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="primary" onClick={handleApprove}>
          Approve
        </Button>
      </div>
    </div>
  );
}
