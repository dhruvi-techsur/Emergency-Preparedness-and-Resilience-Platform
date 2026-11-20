import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Modal, Button, TextField, Table, Alert, type TableColumn } from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

/** Matches backend's DocumentSearchResult shape (document-adapter.ts). */
interface DocumentSearchResult {
  external_document_id: string;
  name: string;
  source_system: string;
}

export interface ImportDocumentModalProps {
  open: boolean;
  onClose: () => void;
  /** Caller refetches the Plan Repository list on a successful import/link. */
  onImported: () => void;
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

  // Reset-on-open, matching ReviewPlanModal.tsx's exact pattern.
  React.useEffect(() => {
    if (open) {
      setSearchQuery('');
      setSelectedDocId(null);
      setError(null);
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

  const handleSubmit = async (mode: 'import' | 'link') => {
    if (!selectedDocId) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiPost(`/api/v1/integrations/documents/${selectedDocId}/${mode}`, {});
      onImported();
      onClose();
    } catch (err) {
      // 403 IMPORT_PERMISSION_DENIED should be structurally unreachable via
      // this UI's own browse-filtered list, but the backend re-checks the
      // user's access set at call time (T-08-19) — a race where the
      // simulated access set changed between browse and import is still
      // possible, so this path is handled, not assumed impossible.
      setError(
        err instanceof ApiRequestError
          ? err.message
          : 'Could not import this document. Try again.',
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
                onClick={() => void handleSubmit('import')}
                loading={submitting}
              >
                Import copy
              </Button>
              <Button
                variant="primary"
                onClick={() => void handleSubmit('link')}
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
        <p className="caption">
          Selected: {selectedDoc.name} ({selectedDoc.source_system})
        </p>
      ) : null}
    </Modal>
  );
}
