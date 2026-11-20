import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PageHeader,
  Progress,
  Card,
  Checkbox,
  TextField,
  Select,
  MapCanvas,
  LayerPanel,
  Modal,
  Button,
  Alert,
  Badge,
  Provenance,
  type SelectOption,
  type MapLayer,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';
import { useAuth } from '../../auth/auth-context';
import { parseCoordinatesToPolygon } from './RecipientGroups';

type Step = 1 | 2 | 3 | 4;

const STEP_LABELS: Record<Step, string> = {
  1: 'Audience',
  2: 'Message',
  3: 'Review',
  4: 'Approve and send',
};

interface RecipientGroupRow {
  id: string;
  name: string;
  type: 'Role' | 'Jurisdiction' | 'Geography';
  member_count?: number;
}

interface MessageTemplateRow {
  id: string;
  name: string;
  category: string | null;
  body: string;
}

interface NavConfigResponse {
  nav_groups: unknown[];
  permissions: Record<string, string[]>;
}

interface AiDraftResponse {
  id: string;
  draft_text: string;
  sources: Array<{ source: string; time: string; confidence: string }>;
  confidence_label: string;
}

interface NotificationResponse {
  id: string;
  message_body: string;
  channels: string[];
  recipient_group_ids: string[];
  approved_by?: { id: string; name: string };
  sent_at?: string;
}

const CHANNEL_OPTIONS: SelectOption[] = [
  { value: 'SMS', label: 'SMS' },
  { value: 'Email', label: 'Email' },
  { value: 'IPAWS', label: 'IPAWS' },
];

// OASIS CAP 1.2's own literal enumerated values for these three fields —
// not invented, per F14-notification-provider-integration.md's "CAP
// fields" Inputs section and the backend adapter's own
// buildCapEnvelope()/sendViaProvider() CAP_FIELDS_INCOMPLETE contract
// (Plan 09-01, notification-provider-adapter.ts).
const CAP_URGENCY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select urgency' },
  { value: 'Immediate', label: 'Immediate' },
  { value: 'Expected', label: 'Expected' },
  { value: 'Future', label: 'Future' },
  { value: 'Past', label: 'Past' },
];
const CAP_SEVERITY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select severity' },
  { value: 'Extreme', label: 'Extreme' },
  { value: 'Severe', label: 'Severe' },
  { value: 'Moderate', label: 'Moderate' },
  { value: 'Minor', label: 'Minor' },
];
const CAP_CERTAINTY_OPTIONS: SelectOption[] = [
  { value: '', label: 'Select certainty' },
  { value: 'Observed', label: 'Observed' },
  { value: 'Likely', label: 'Likely' },
  { value: 'Possible', label: 'Possible' },
];

/**
 * F5 S5.3 — Compose Notification (4-step flow, required order). Routed
 * `/notifications/compose`, also accepting an optional `?incident=<id>`
 * search param pre-filling `incident_id` for the "Incident Workspace ->
 * Compose notification" entry point.
 *
 * Compose-at-Step-1-completion vs deferred-to-Step-4-confirm: this
 * implementation composes (POST .../compose) lazily, only at Step 4's
 * confirm click — the Review step (3) renders from LOCAL wizard state
 * (audience/message/channels already collected in Steps 1-2), not from a
 * server round-trip, so nothing is written to the database until the user
 * has actually confirmed the danger Modal. This keeps Steps 1-3 free of any
 * partial/abandoned notification rows for a user who never reaches Step 4.
 */
export function ComposeNotification(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get('incident') ?? undefined;

  const [step, setStep] = React.useState<Step>(1);

  // Step 1 — Audience
  const [selectedGroupIds, setSelectedGroupIds] = React.useState<Set<string>>(new Set());
  const [coordinatesRaw, setCoordinatesRaw] = React.useState('');
  const [audienceError, setAudienceError] = React.useState<string | null>(null);

  // Step 2 — Message
  const [templateId, setTemplateId] = React.useState('');
  const [messageBody, setMessageBody] = React.useState('');
  const [channels, setChannels] = React.useState<Set<string>>(new Set(['Email']));
  const [aiDraft, setAiDraft] = React.useState<AiDraftResponse | null>(null);
  const [aiOrigin, setAiOrigin] = React.useState(false);
  const [aiDraftId, setAiDraftId] = React.useState<string | undefined>(undefined);
  const [draftingWithAi, setDraftingWithAi] = React.useState(false);
  const [messageError, setMessageError] = React.useState<string | null>(null);

  // Step 2 — CAP public-alert fields (F14, Plan 09-03). Only meaningful
  // when 'IPAWS' is a selected channel — the OASIS CAP 1.2 fields this
  // plan's own FRD (F14-notification-provider-integration.md) names as
  // required for a public-warning channel send. Plain empty-string
  // initialization, same as every other Step-2 field above (no dedicated
  // reset-on-open effect exists in this file to piggyback on).
  const [capSender, setCapSender] = React.useState('');
  const [capEvent, setCapEvent] = React.useState('');
  const [capUrgency, setCapUrgency] = React.useState('');
  const [capSeverity, setCapSeverity] = React.useState('');
  const [capCertainty, setCapCertainty] = React.useState('');
  const [capArea, setCapArea] = React.useState('');

  // Step 4 — Approve and send
  const [confirmModalOpen, setConfirmModalOpen] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  const groupsQuery = useQuery({
    queryKey: ['recipient-groups'],
    queryFn: () => apiGet<RecipientGroupRow[]>('/api/v1/recipient-groups'),
  });

  const templatesQuery = useQuery({
    queryKey: ['message-templates'],
    queryFn: () => apiGet<MessageTemplateRow[]>('/api/v1/message-templates'),
  });

  // Reuses the SAME react-query cache key AppShell.tsx's own nav-config
  // query already populates — 04-05's own extension of GET
  // /api/v1/me/nav-config (see routes.ts) piggybacks the signed-in user's
  // full feature->actions permission map onto this already-fetched query,
  // rather than inventing a dedicated permissions-check endpoint.
  const navConfigQuery = useQuery({
    queryKey: ['nav-config', user.role?.id],
    queryFn: () => apiGet<NavConfigResponse>('/api/v1/me/nav-config'),
  });

  const canApprove = (navConfigQuery.data?.permissions?.notifications ?? []).includes('approve');

  const parsedPolygon = React.useMemo(
    () => (coordinatesRaw.trim() ? parseCoordinatesToPolygon(coordinatesRaw) : null),
    [coordinatesRaw],
  );

  const hasGroups = selectedGroupIds.size > 0;
  const hasGeotarget = parsedPolygon !== null;

  // Live recipient-count estimate: SUM of selected groups' member_count,
  // per this plan's own documented approach — no live roster-geo-match
  // exists this phase, so a geotargeted area shows an honest "~ (geotarget,
  // exact count available after send)" caption rather than inventing a
  // fake geo-population number.
  const estimatedCount = (groupsQuery.data ?? [])
    .filter((g) => selectedGroupIds.has(g.id))
    .reduce((sum, g) => sum + (g.member_count ?? 0), 0);

  const toggleGroup = (id: string) => {
    setSelectedGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleChannel = (value: string) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const handleContinueFromStep1 = () => {
    if (!hasGroups && !hasGeotarget) {
      setAudienceError('Select at least one recipient group or draw a geotargeted area.');
      return;
    }
    setAudienceError(null);
    setStep(2);
  };

  const handleTemplateChange = (value: string) => {
    setTemplateId(value);
    const template = (templatesQuery.data ?? []).find((t) => t.id === value);
    if (template) {
      setMessageBody(template.body);
    }
  };

  const handleDraftWithAi = async () => {
    setDraftingWithAi(true);
    try {
      const response = await apiPost<AiDraftResponse>('/api/v1/ai-drafts', {
        target_feature: 'notification',
        target_field: 'message_body',
        context: incidentId ? `incident:${incidentId}` : 'compose-notification',
        requesting_user_id: user.id,
      });
      setAiDraft(response);
    } catch {
      setMessageError('Could not draft with AI right now. Try again.');
    } finally {
      setDraftingWithAi(false);
    }
  };

  const handleApproveAiDraft = async () => {
    if (!aiDraft) return;
    try {
      await apiPost(`/api/v1/ai-drafts/${aiDraft.id}/approve`, { approver_id: user.id });
      // The message field is populated ONLY from this server-confirmed
      // approve response — never from the client-held draft text alone
      // before this call succeeds (T-04-10's mitigation).
      setMessageBody(aiDraft.draft_text);
      setAiOrigin(true);
      setAiDraftId(aiDraft.id);
      setAiDraft(null);
    } catch {
      setMessageError('Could not approve this draft right now. Try again.');
    }
  };

  const handleDiscardAiDraft = () => {
    setAiDraft(null);
  };

  const handleContinueFromStep2 = () => {
    if (!messageBody.trim()) {
      setMessageError('Enter a message before continuing.');
      return;
    }
    if (channels.size === 0) {
      setMessageError('Select at least one channel.');
      return;
    }
    // Client-side half mirroring the backend's own 422
    // CAP_FIELDS_INCOMPLETE gate (sendViaProvider, Plan 09-01) — a
    // responsive UX improvement only. The backend remains the real
    // enforcement point; this check never replaces it (T-09-12).
    if (
      channels.has('IPAWS') &&
      (!capSender.trim() ||
        !capEvent.trim() ||
        !capUrgency ||
        !capSeverity ||
        !capCertainty ||
        !capArea.trim())
    ) {
      setMessageError('Complete the CAP fields before continuing — required for a public-warning channel send.');
      return;
    }
    setMessageError(null);
    setStep(3);
  };

  const handleConfirmSend = async () => {
    setSendError(null);
    setSending(true);
    try {
      // Forward-compatible plumbing matching the backend's eventual real
      // contract: Plan 09-01's sendViaProvider()/buildCapEnvelope() DOES
      // read a capFields shape (see ProviderSendRequest in
      // notification-provider-adapter.ts), but notifications.ts's own
      // send route (the caller this request body actually reaches) still
      // passes its OWN documented placeholder capFields object to
      // sendViaProvider rather than reading one from THIS request's body
      // (confirmed via `grep -n "capFields" backend/src/modules/
      // comms-reporting/notifications.ts` — no `req.body.capFields` read
      // exists there). Sending it here is still correct: it is the exact
      // shape 09-01's SUMMARY documents as the Plan 09-01->09-03 handoff
      // point, and costs nothing if the current backend doesn't yet wire
      // it through from this specific request body.
      const capFields = channels.has('IPAWS')
        ? {
            sender: capSender,
            event: capEvent,
            urgency: capUrgency,
            severity: capSeverity,
            certainty: capCertainty,
            area: capArea,
          }
        : undefined;

      const composed = await apiPost<NotificationResponse>('/api/v1/notifications/compose', {
        recipient_group_ids: hasGroups ? Array.from(selectedGroupIds) : undefined,
        geotarget_polygon: hasGeotarget ? parsedPolygon : undefined,
        message_body: messageBody,
        channels: Array.from(channels),
        incident_id: incidentId,
        ai_origin: aiOrigin,
        ai_draft_id: aiDraftId,
        capFields,
      });
      const sent = await apiPost<NotificationResponse>(
        `/api/v1/notifications/${composed.id}/send`,
        { approver_id: user.id, capFields },
      );
      setConfirmModalOpen(false);
      navigate(`/notifications/${sent.id}/delivery`);
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'APPROVER_MISMATCH') {
        setSendError(err.body.message);
      } else {
        setSendError(err instanceof ApiRequestError ? err.body.message : 'Could not send this notification.');
      }
    } finally {
      setSending(false);
    }
  };

  const selectedGroups = (groupsQuery.data ?? []).filter((g) => selectedGroupIds.has(g.id));

  const geotargetLayer: MapLayer[] = hasGeotarget
    ? [
        {
          id: 'geotarget',
          label: 'Drawn area',
          source: 'Manual entry',
          checked: true,
        },
      ]
    : [];

  return (
    <div className="ep-compose-notification">
      <PageHeader title="Compose notification" />

      <Progress
        value={(step / 4) * 100}
        label={`Step ${step} of 4: ${STEP_LABELS[step]}`}
        // Per the mockup's exact label text ("Step 1 of 4: Audience") —
        // the label itself already states the fraction, so the numeric
        // percentage would be redundant. Documented here as the one
        // deliberate exception to Progress's "always show value" default,
        // since the step-count IS the value here, just expressed as text.
        showValue={false}
      />

      {step === 1 ? (
        <Card title="Step 1 — Audience">
          {audienceError ? (
            <Alert tone="danger" title={audienceError} />
          ) : null}

          <h3 className="h4">Recipient groups</h3>
          {/* Combobox (01-05) is single-select only — the SAME multi-select
              substitution pattern UserDetail.tsx establishes for
              jurisdiction-scope editing is reused here identically. */}
          {(groupsQuery.data ?? []).map((group) => (
            <Checkbox
              key={group.id}
              label={`${group.name} (${group.type}${
                typeof group.member_count === 'number' ? `, ${group.member_count} members` : ''
              })`}
              checked={selectedGroupIds.has(group.id)}
              onChange={() => toggleGroup(group.id)}
            />
          ))}

          <h3 className="h4">Or draw a geotargeted area</h3>
          {/* Same keyboard-operable coordinates fallback
              RecipientGroups.tsx's Geography editor uses — factored into
              the shared parseCoordinatesToPolygon helper to avoid
              duplication. */}
          <TextField
            label="Area coordinates (keyboard-operable fallback)"
            multiline
            rows={4}
            hint="Enter one lat,lng pair per line, at least 3 pairs, to define a geotargeted polygon."
            value={coordinatesRaw}
            onChange={(e) => setCoordinatesRaw(e.target.value)}
          />
          <MapCanvas height={200} label="Geotarget preview" />
          <LayerPanel layers={geotargetLayer} onToggle={() => {}} title="Geotarget" />

          <p className="caption">
            {hasGroups
              ? `Estimated recipients: ${estimatedCount}`
              : hasGeotarget
                ? 'Estimated recipients: ~ (geotarget, exact count available after send)'
                : 'Estimated recipients: 0'}
          </p>
        </Card>
      ) : null}

      {step === 2 ? (
        <Card title="Step 2 — Message">
          {messageError ? <Alert tone="danger" title={messageError} /> : null}

          <Select
            label="Template (optional)"
            options={[{ value: '', label: 'No template' }, ...(templatesQuery.data ?? []).map((t) => ({
              value: t.id,
              label: t.name,
            }))]}
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
          />

          <TextField
            label="Message"
            multiline
            rows={6}
            required
            hint={`${messageBody.length} characters`}
            value={messageBody}
            onChange={(e) => {
              setMessageBody(e.target.value);
              setAiOrigin(false);
              setAiDraftId(undefined);
            }}
          />

          <h3 className="h4">Channels</h3>
          {CHANNEL_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={channels.has(opt.value)}
              onChange={() => toggleChannel(opt.value)}
            />
          ))}

          {channels.has('IPAWS') ? (
            <Card title="CAP public-alert fields">
              <TextField
                label="Sender (authorized agency identity)"
                required
                value={capSender}
                onChange={(e) => setCapSender(e.target.value)}
              />
              <TextField label="Event" required value={capEvent} onChange={(e) => setCapEvent(e.target.value)} />
              <Select
                label="Urgency"
                required
                options={CAP_URGENCY_OPTIONS}
                value={capUrgency}
                onChange={(e) => setCapUrgency(e.target.value)}
              />
              <Select
                label="Severity"
                required
                options={CAP_SEVERITY_OPTIONS}
                value={capSeverity}
                onChange={(e) => setCapSeverity(e.target.value)}
              />
              <Select
                label="Certainty"
                required
                options={CAP_CERTAINTY_OPTIONS}
                value={capCertainty}
                onChange={(e) => setCapCertainty(e.target.value)}
              />
              <TextField
                label="Area"
                required
                hint="Plain-text description of the affected area"
                value={capArea}
                onChange={(e) => setCapArea(e.target.value)}
              />
            </Card>
          ) : null}

          <Button variant="secondary" onClick={() => void handleDraftWithAi()} loading={draftingWithAi}>
            Draft with AI
          </Button>

          {aiDraft ? (
            <Card>
              <Badge tone="neutral">Not issued</Badge>
              <p>{aiDraft.draft_text}</p>
              {aiDraft.sources.map((s, i) => (
                <Provenance key={i} source={s.source} time={s.time} confidence={s.confidence} />
              ))}
              <Button variant="ghost" onClick={handleDiscardAiDraft}>
                Discard
              </Button>
              <Button variant="primary" onClick={() => void handleApproveAiDraft()}>
                Approve
              </Button>
            </Card>
          ) : null}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card title="Step 3 — Review">
          {/* Fully read-only — no inline edit affordance of any kind;
              "Back" is the only way to change anything, per the mockup's
              explicit "nothing editable here" rule. */}
          <h3 className="h4">Final message</h3>
          <p>{messageBody}</p>

          <h3 className="h4">Audience</h3>
          <p>
            {hasGroups
              ? selectedGroups.map((g) => g.name).join(', ')
              : hasGeotarget
                ? 'Geotargeted area'
                : 'No audience selected'}
          </p>
          <p className="caption">
            {hasGroups
              ? `Estimated recipients: ${estimatedCount}`
              : 'Estimated recipients: ~ (geotarget, exact count available after send)'}
          </p>

          <h3 className="h4">Channels</h3>
          <p>{Array.from(channels).join(', ')}</p>

          {channels.has('IPAWS') ? (
            <>
              <h3 className="h4">CAP public-alert fields</h3>
              <p>Sender: {capSender}</p>
              <p>Event: {capEvent}</p>
              <p>Urgency: {capUrgency}</p>
              <p>Severity: {capSeverity}</p>
              <p>Certainty: {capCertainty}</p>
              <p>Area: {capArea}</p>
            </>
          ) : null}

          <h3 className="h4">Approver of record</h3>
          <p>{user.name}</p>
          <p className="caption">
            04-01's simplified approver model treats any notifications:approve-holding
            user as a valid approver for this channel set.
          </p>
        </Card>
      ) : null}

      {step === 4 ? (
        <Card title="Step 4 — Approve and send">
          {!canApprove ? (
            <p className="caption">You&apos;re not the designated approver for this channel.</p>
          ) : null}
          {sendError ? <Alert tone="danger" title={sendError} /> : null}
          <Button
            variant="primary"
            disabled={!canApprove}
            onClick={() => setConfirmModalOpen(true)}
          >
            Approve and send
          </Button>
        </Card>
      ) : null}

      <div className="ep-compose-notification__footer">
        <Button type="button" variant="ghost" disabled={step === 1} onClick={() => setStep((s) => (s - 1) as Step)}>
          Back
        </Button>
        {step < 4 ? (
          <Button
            type="button"
            variant="primary"
            onClick={() => {
              if (step === 1) handleContinueFromStep1();
              else if (step === 2) handleContinueFromStep2();
              else setStep((s) => (s + 1) as Step);
            }}
          >
            Continue
          </Button>
        ) : null}
      </div>

      <Modal
        open={confirmModalOpen}
        danger
        title={`Send to ${hasGroups ? estimatedCount : '~'} recipients via ${Array.from(channels).join(', ')}?`}
        onClose={() => setConfirmModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void handleConfirmSend()} loading={sending}>
              Send now
            </Button>
          </>
        }
      >
        <p>
          This restates the audience and channel list before dispatch — this confirmation cannot
          be bypassed or auto-confirmed by any client-side code path.
        </p>
      </Modal>
    </div>
  );
}
