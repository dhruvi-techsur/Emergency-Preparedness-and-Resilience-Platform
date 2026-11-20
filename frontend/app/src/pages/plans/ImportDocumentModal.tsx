import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Modal,
  Button,
  TextField,
  Table,
  Select,
  Combobox,
  Alert,
  type TableColumn,
  type SelectOption,
  type ComboboxOption,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

/** Matches backend's DocumentSearchResult shape (document-adapter.ts). */
interface DocumentSearchResult {
  external_document_id: string;
  name: string;
  source_system: string;
}

type PlanType = 'EOP' | 'SOP' | 'Annex';

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

interface PlansListResponse {
  items: { id: string; name: string }[];
}

const PLAN_TYPE_OPTIONS: SelectOption[] = [
  { value: 'EOP', label: 'EOP' },
  { value: 'SOP', label: 'SOP' },
  { value: 'Annex', label: 'Annex' },
];

const TARGET_MODE_OPTIONS: SelectOption[] = [
  { value: 'new', label: 'Create a new plan' },
  { value: 'existing', label: 'Attach to an existing plan' },
];

export interface ImportDocumentModalProps {
  open: boolean;
  onClose: () => void;
  /** Caller navigates to the resulting plan on a successful import/link —
   * see 08-09's new POST /api/v1/plans/import, which always returns a
   * real, GET-reachable plan id (either newly created or the existing
   * plan the caller attached to). */
  onImported: (planId: string) => void;
}

/**
 * F3 S3.6 — Import from Document System (F17 integration) modal.
 *
 * Replaces Phase 3's documented, deliberately-disabled "Import plan"
 * placeholder on the Plan Repository (now in scope via Phase 8's F17).
 *
 * Search choice: a plain `TextField`, not `Combobox` — the browse results
 * here are a server-filtered RESULT LIST a user picks ONE row from to act
 * on (import/link), not a fixed short options list feeding a form field's
 * single value. Combobox's ARIA combobox+listbox pattern (type-to-filter,
 * Enter-to-choose-a-value) doesn't fit a "search, then pick a row to open
 * an action on" flow as naturally as TextField + Table does, and Table is
 * this codebase's established pattern for every other such list.
 *
 * No debounce: this stub's catalog is fixed at exactly 3 documents
 * (document-adapter.ts's DOCUMENT_CATALOG) — a network round-trip per
 * keystroke against a 3-row in-memory filter adds no real cost here, and
 * debouncing would be complexity with no payoff at this data scale.
 *
 * CRITICAL (T-08-18's mitigation): the results list below renders EXACTLY
 * what GET /api/v1/integrations/documents/browse returns. No client-side
 * filtering, re-ordering, or additional permission check happens in this
 * component — the server-side filtering in Plan 08-02's browseDocuments()
 * is the ENTIRE enforcement mechanism. A document this user's delegated
 * access doesn't cover is never present in `results` at all, so there is
 * nothing here to filter out.
 *
 * 08-10 (UAT gap ref 4 closure): once a document is selected, the user
 * also picks a target — create a brand-new plan (default, per the FRD's
 * "land it in Draft status" flow) or attach to an existing in-scope plan
 * — and submission calls 08-09's new POST /api/v1/plans/import, which
 * always returns a real, GET-reachable plan. The resulting plan id is
 * handed back via onImported so the caller can navigate there instead of
 * silently refetching an unrelated list.
 */
export function ImportDocumentModal({
  open,
  onClose,
  onImported,
}: ImportDocumentModalProps): JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDocId, setSelectedDocId] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [targetMode, setTargetMode] = React.useState<'new' | 'existing'>('new');
  const [existingPlanId, setExistingPlanId] = React.useState('');
  const [newPlanName, setNewPlanName] = React.useState('');
  const [newPlanType, setNewPlanType] = React.useState<PlanType>('EOP');
  const [newPlanJurisdictionId, setNewPlanJurisdictionId] = React.useState('');

  // Reset-on-open, matching ReviewPlanModal.tsx's exact pattern.
  React.useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedDocId(null);
      setError(null);
      setTargetMode('new');
      setExistingPlanId('');
      setNewPlanName('');
      setNewPlanType('EOP');
      setNewPlanJurisdictionId('');
    }
  }, [open]);

  const browseQuery = useQuery({
    queryKey: ['document-browse', searchQuery],
    queryFn: () =>
      apiGet<DocumentSearchResult[]>(
        `/api/v1/integrations/documents/browse?query=${encodeURIComponent(searchQuery)}`,
      ),
    enabled: open,
  });

  const results = browseQuery.data ?? [];
  const selectedDoc = results.find((d) => d.external_document_id === selectedDocId) ?? null;

  // Pre-fill the new-plan name from the selected document's own name
  // whenever selection changes, so the user isn't forced to retype it but
  // can still edit it.
  React.useEffect(() => {
    if (selectedDoc) setNewPlanName(selectedDoc.name);
  }, [selectedDoc]);

  // "Attach to an existing plan" options — gated so the list only fires
  // when actually needed (targetMode === 'existing').
  const plansForTargetQuery = useQuery({
    queryKey: ['plans-for-import-target'],
    queryFn: () => apiGet<PlansListResponse>('/api/v1/plans?page_size=100'),
    enabled: open && targetMode === 'existing',
  });

  // Jurisdictions for "create new" — reuses the exact GET
  // /api/v1/jurisdictions call PlanEditor.tsx/PlanRepository.tsx already
  // use, gated so it only fires when actually needed (targetMode === 'new').
  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
    enabled: open && targetMode === 'new',
  });

  const existingPlanOptions: ComboboxOption[] = (plansForTargetQuery.data?.items ?? []).map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const jurisdictionOptions: ComboboxOption[] = (jurisdictionsQuery.data?.items ?? []).map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const handleSubmit = async (mode: 'import_copy' | 'link_live') => {
    if (!selectedDocId) return;
    if (targetMode === 'new' && (!newPlanName.trim() || !newPlanJurisdictionId)) {
      setError('Enter a plan name and jurisdiction, or choose an existing plan.');
      return;
    }
    if (targetMode === 'existing' && !existingPlanId) {
      setError('Choose an existing plan to attach this document to.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = await apiPost<{ id: string }>('/api/v1/plans/import', {
        source_document_ref: selectedDocId,
        mode,
        name: newPlanName.trim(),
        type: newPlanType,
        jurisdiction_id: targetMode === 'new' ? newPlanJurisdictionId : undefined,
        plan_id: targetMode === 'existing' ? existingPlanId : undefined,
      });
      onImported(result.id);
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : 'Could not import this document. Try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<DocumentSearchResult>[] = [
    { key: 'name', header: 'Name' },
    { key: 'source_system', header: 'Source' },
  ];

  return (
    <Modal
      open={open}
      title="Import from document system"
      onClose={onClose}
      width={640}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {selectedDoc ? (
            <>
              <Button
                variant="secondary"
                onClick={() => void handleSubmit('import_copy')}
                loading={submitting}
              >
                Import copy
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSubmit('link_live')}
                loading={submitting}
              >
                Link live
              </Button>
            </>
          ) : null}
        </>
      }
    >
      {error ? (
        <Alert tone="danger" title="Could not import this document">
          {error}
        </Alert>
      ) : null}

      <TextField
        label="Search"
        placeholder="Search by document name"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setSelectedDocId(null);
        }}
      />

      <Table
        caption="Documents in the connected document system"
        columns={columns}
        rows={results}
        rowKey={(row) => row.external_document_id}
        selectedKey={selectedDocId ?? undefined}
        onRowClick={(row) => setSelectedDocId(row.external_document_id)}
        loading={browseQuery.isLoading}
        error={
          browseQuery.isError
            ? { message: 'Could not load documents.', onRetry: () => void browseQuery.refetch() }
            : undefined
        }
        empty={{
          title: 'No documents found',
          children: 'Try a different search term.',
        }}
      />

      {selectedDoc ? (
        <>
          <p className="caption">
            Selected: {selectedDoc.name} ({selectedDoc.source_system})
          </p>

          <Select
            label="Where should this go?"
            options={TARGET_MODE_OPTIONS}
            value={targetMode}
            onChange={(e) => setTargetMode(e.target.value as 'new' | 'existing')}
          />

          {targetMode === 'new' ? (
            <>
              <TextField
                label="Plan name"
                required
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
              />
              <Select
                label="Type"
                options={PLAN_TYPE_OPTIONS}
                value={newPlanType}
                onChange={(e) => setNewPlanType(e.target.value as PlanType)}
              />
              <Combobox
                label="Jurisdiction"
                required
                options={jurisdictionOptions}
                value={newPlanJurisdictionId}
                onChange={(value) => setNewPlanJurisdictionId(value)}
                loading={jurisdictionsQuery.isLoading}
              />
            </>
          ) : (
            <Combobox
              label="Existing plan"
              required
              options={existingPlanOptions}
              value={existingPlanId}
              onChange={(value) => setExistingPlanId(value)}
              loading={plansForTargetQuery.isLoading}
            />
          )}
        </>
      ) : null}
    </Modal>
  );
}
