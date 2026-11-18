import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  TextField,
  Select,
  Button,
  Modal,
  Alert,
  type TableColumn,
  type SelectOption,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

/** Matches backend's message-template row shape (comms-reporting/notifications.ts). */
interface MessageTemplateRow {
  id: string;
  name: string;
  category: string | null;
  body: string;
}

/** Starter category set — the FRD specifies no fixed enum for this field
 * (04-01's `message_templates.category` column is free-text), so this is a
 * reasonable within-budget starter list per this plan's own documented
 * discretion, not a schema-level constraint. */
const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'Shelter', label: 'Shelter' },
  { value: 'Evacuation', label: 'Evacuation' },
  { value: 'All-clear', label: 'All-clear' },
  { value: 'Status update', label: 'Status update' },
];

const MAX_BODY_LENGTH = 1600;

/**
 * F5 S5.2 — Message Templates (List + Editor). Routed `/notifications/templates`.
 *
 * Supported placeholder tokens (e.g. `{{incident_name}}`, `{{jurisdiction}}`)
 * are NOT interpolated server-side in this phase — 04-01's
 * `message_templates.body` is stored verbatim with no interpolation
 * endpoint. The hint below documents this as literal text the compose
 * flow's freeform path can paste-and-edit, not a live template-engine
 * substitution.
 */
export function MessageTemplates(): JSX.Element {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<MessageTemplateRow | null>(null);

  const [name, setName] = React.useState('');
  const [category, setCategory] = React.useState(CATEGORY_OPTIONS[0].value);
  const [body, setBody] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const templatesQuery = useQuery({
    queryKey: ['message-templates'],
    queryFn: () => apiGet<MessageTemplateRow[]>('/api/v1/message-templates'),
  });

  const openCreateModal = () => {
    setEditingTemplate(null);
    setName('');
    setCategory(CATEGORY_OPTIONS[0].value);
    setBody('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (template: MessageTemplateRow) => {
    setEditingTemplate(template);
    setName(template.name);
    setCategory(template.category ?? CATEGORY_OPTIONS[0].value);
    setBody(template.body);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Enter a name for this template.');
      return;
    }
    if (!body.trim()) {
      setFormError('Enter the message body for this template.');
      return;
    }

    setSubmitting(true);
    try {
      // 04-01's API only exposes POST (create) for message-templates — no
      // PATCH/edit endpoint exists in this phase's integration_contracts,
      // same documented limitation as RecipientGroups.tsx above. "Editing"
      // an existing template creates a new row with the edited values.
      await apiPost('/api/v1/message-templates', { name: name.trim(), category, body });
      setModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.body.message : 'Could not save this template.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<MessageTemplateRow>[] = [
    {
      key: 'name',
      header: 'Template name',
      render: (row) => (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openEditModal(row);
          }}
        >
          {row.name}
        </a>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => row.category ?? '—' },
    // 04-01's message_templates schema carries no updated_at column of its
    // own in the list route's SELECT (only id/name/category/body) — no
    // "Last updated" value exists to render here without a schema change
    // outside this plan's scope. Shown as "—" rather than inventing a
    // client-side timestamp.
    { key: 'last_updated', header: 'Last updated', render: () => '—' },
  ];

  return (
    <div className="ep-message-templates">
      <PageHeader
        title="Message templates"
        actions={[
          <Button key="new" variant="primary" onClick={openCreateModal}>
            New template
          </Button>,
        ]}
      />

      <Card padded={false}>
        <Table
          caption="Message templates"
          columns={columns}
          rows={templatesQuery.data ?? []}
          rowKey={(row) => row.id}
          loading={templatesQuery.isLoading}
          error={
            templatesQuery.isError
              ? { message: 'Could not load message templates.', onRetry: () => void templatesQuery.refetch() }
              : undefined
          }
          empty={{
            title: 'No message templates yet',
            action: (
              <Button variant="primary" onClick={openCreateModal}>
                New template
              </Button>
            ),
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editingTemplate ? `Edit ${editingTemplate.name}` : 'New message template'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} loading={submitting}>
              {editingTemplate ? 'Save as new template' : 'Create template'}
            </Button>
          </>
        }
      >
        {formError ? (
          <Alert tone="danger" title="Could not save this template">
            {formError}
          </Alert>
        ) : null}

        <TextField label="Name" required value={name} onChange={(e) => setName(e.target.value)} />

        <Select
          label="Category"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <TextField
          label="Body"
          multiline
          rows={6}
          required
          value={body}
          maxLength={MAX_BODY_LENGTH}
          onChange={(e) => setBody(e.target.value)}
          hint={`${body.length}/${MAX_BODY_LENGTH} characters \u00b7 Supported placeholder tokens (pasted as literal text, not interpolated this phase): {{incident_name}}, {{jurisdiction}}`}
        />
      </Modal>
    </div>
  );
}
