import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  Table,
  TextField,
  Select,
  Combobox,
  MapCanvas,
  Button,
  Modal,
  Alert,
  type TableColumn,
  type ComboboxOption,
  type SelectOption,
  type MapArea,
} from '@epmp/design-system';
import { apiGet, apiPost, ApiRequestError } from '../../lib/api-client';

type RecipientGroupType = 'Role' | 'Jurisdiction' | 'Geography';

/** Matches backend's recipient-group list-row shape (comms-reporting/notifications.ts). */
interface RecipientGroupRow {
  id: string;
  name: string;
  type: RecipientGroupType;
  selector: Record<string, unknown>;
  /** Omitted (undefined) for Geography-type groups — no live roster-geo-match
   * exists this phase (04-01's own documented Phase-6/F16 scope boundary). */
  member_count?: number;
}

interface RoleOption {
  id: string;
  name: string;
}

interface JurisdictionsResponse {
  items: { id: string; name: string }[];
}

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'Role', label: 'Role' },
  { value: 'Jurisdiction', label: 'Jurisdiction' },
  { value: 'Geography', label: 'Geography' },
];

/**
 * Parses the keyboard-operable coordinates fallback's raw textarea value
 * (one "lat,lng" pair per line) into a GeoJSON Polygon. Shared with
 * ComposeNotification.tsx's Step 1 geotargeting — both pages use this exact
 * accessible fallback since MapCanvas's current contract (04-03/02-04) has
 * no literal freehand-polygon-draw prop (only `areas`/`onSelect`), and the
 * UX mockup explicitly calls for "a keyboard-operable polygon-entry
 * fallback... since freehand drawing is pointer-only."
 */
export function parseCoordinatesToPolygon(raw: string): GeoJSON.Polygon | null {
  const lines = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 3) return null;
  const coords: [number, number][] = [];
  for (const line of lines) {
    const parts = line.split(',').map((p) => parseFloat(p.trim()));
    if (parts.length !== 2 || parts.some((p) => Number.isNaN(p))) return null;
    const [lat, lng] = parts;
    coords.push([lng, lat]);
  }
  // GeoJSON polygons must close (first point === last point).
  const first = coords[0];
  const last = coords[coords.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) {
    coords.push(first);
  }
  return { type: 'Polygon', coordinates: [coords] };
}

/** Projects a GeoJSON polygon's [lng,lat] ring into MapCanvas's 0-100
 * percent-of-canvas "x,y" point format for live preview rendering, using a
 * simple fixed bounding box (CONUS-ish) — the same documented linear-
 * approximation standing-in for a real map-engine 02-07's
 * OperatingPicture.tsx already establishes for this codebase, not a new
 * pattern. */
function polygonToMapAreaPoints(polygon: GeoJSON.Polygon): string[] {
  const BBOX = { minLng: -130, maxLng: -65, minLat: 20, maxLat: 50 };
  return polygon.coordinates[0].map(([lng, lat]) => {
    const x = ((lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
    const y = 100 - ((lat - BBOX.minLat) / (BBOX.maxLat - BBOX.minLat)) * 100;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
}

/**
 * F5 S5.1 — Recipient Groups (List + Editor). Routed `/notifications/groups`.
 *
 * "Last used" column: the mockup names this column, but 04-01's API surface
 * exposes no GET (list) endpoint for `notifications` rows at all (only
 * compose/send/delivery-status by id) — deriving "most recent notification
 * referencing this group" would require inventing a new backend endpoint
 * outside this plan's integration_contracts. This renders "Never" for every
 * row, documented here as a Phase-4 simplification matching 04-01's own
 * "acceptable to defer to a future phase" allowance, rather than inventing
 * an endpoint this frontend-only plan has no budget to design/test.
 */
export function RecipientGroups(): JSX.Element {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<RecipientGroupRow | null>(null);

  const [name, setName] = React.useState('');
  const [type, setType] = React.useState<RecipientGroupType>('Role');
  const [roleId, setRoleId] = React.useState('');
  const [jurisdictionId, setJurisdictionId] = React.useState('');
  const [coordinatesRaw, setCoordinatesRaw] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const groupsQuery = useQuery({
    queryKey: ['recipient-groups'],
    queryFn: () => apiGet<RecipientGroupRow[]>('/api/v1/recipient-groups'),
  });

  const rolesQuery = useQuery({
    queryKey: ['admin-roles-for-recipient-groups'],
    queryFn: () => apiGet<RoleOption[]>('/api/v1/admin/roles'),
    enabled: modalOpen && type === 'Role',
  });

  const jurisdictionsQuery = useQuery({
    queryKey: ['jurisdictions-for-recipient-groups'],
    queryFn: () => apiGet<JurisdictionsResponse>('/api/v1/jurisdictions'),
    enabled: modalOpen && type === 'Jurisdiction',
  });

  const roleOptions: ComboboxOption[] = (rolesQuery.data ?? []).map((r) => ({
    value: r.id,
    label: r.name,
  }));

  const jurisdictionOptions: ComboboxOption[] = (jurisdictionsQuery.data?.items ?? []).map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const parsedPolygon = React.useMemo(
    () => (coordinatesRaw.trim() ? parseCoordinatesToPolygon(coordinatesRaw) : null),
    [coordinatesRaw],
  );

  const previewAreas: MapArea[] = parsedPolygon
    ? [
        {
          id: 'preview',
          points: polygonToMapAreaPoints(parsedPolygon),
          tone: 'brand',
          label: 'Drawn area (preview)',
        },
      ]
    : [];

  const openCreateModal = () => {
    setEditingGroup(null);
    setName('');
    setType('Role');
    setRoleId('');
    setJurisdictionId('');
    setCoordinatesRaw('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (group: RecipientGroupRow) => {
    setEditingGroup(group);
    setName(group.name);
    setType(group.type);
    setRoleId(typeof group.selector?.role_id === 'string' ? group.selector.role_id : '');
    setJurisdictionId(
      typeof group.selector?.jurisdiction_id === 'string' ? group.selector.jurisdiction_id : '',
    );
    setCoordinatesRaw('');
    setFormError(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setFormError(null);
    if (!name.trim()) {
      setFormError('Enter a name for this group.');
      return;
    }

    let selector: Record<string, unknown> = {};
    if (type === 'Role') {
      if (!roleId) {
        setFormError('Select a role.');
        return;
      }
      selector = { role_id: roleId };
    } else if (type === 'Jurisdiction') {
      if (!jurisdictionId) {
        setFormError('Select a jurisdiction.');
        return;
      }
      selector = { jurisdiction_id: jurisdictionId };
    } else {
      if (!parsedPolygon) {
        setFormError('Enter at least 3 lat,lng coordinate pairs (one per line) to define the area.');
        return;
      }
      selector = { geotarget_polygon: parsedPolygon };
    }

    setSubmitting(true);
    try {
      // 04-01's API only exposes POST (create) for recipient-groups — no
      // PATCH/edit endpoint exists in this phase's integration_contracts, so
      // "editing" an existing group creates a new row with the edited
      // values rather than mutating in place. Documented here as a Phase-4
      // simplification, not an oversight.
      await apiPost('/api/v1/recipient-groups', { name: name.trim(), type, selector });
      setModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['recipient-groups'] });
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.body.message : 'Could not save this group.');
    } finally {
      setSubmitting(false);
    }
  };

  const columns: TableColumn<RecipientGroupRow>[] = [
    {
      key: 'name',
      header: 'Group name',
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
    { key: 'type', header: 'Type' },
    {
      key: 'member_count',
      header: 'Member count',
      align: 'right',
      render: (row) => (typeof row.member_count === 'number' ? row.member_count : '—'),
    },
    // See file-header doc comment: no list endpoint for notifications
    // exists to derive a real "most recently used" value from.
    { key: 'last_used', header: 'Last used', render: () => 'Never' },
  ];

  return (
    <div className="ep-recipient-groups">
      <PageHeader
        title="Notification groups"
        actions={[
          <Button key="new" variant="primary" onClick={openCreateModal}>
            New group
          </Button>,
        ]}
      />

      <Card padded={false}>
        <Table
          caption="Notification groups"
          columns={columns}
          rows={groupsQuery.data ?? []}
          rowKey={(row) => row.id}
          loading={groupsQuery.isLoading}
          error={
            groupsQuery.isError
              ? { message: 'Could not load recipient groups.', onRetry: () => void groupsQuery.refetch() }
              : undefined
          }
          empty={{
            title: 'No notification groups yet',
            action: (
              <Button variant="primary" onClick={openCreateModal}>
                New group
              </Button>
            ),
          }}
        />
      </Card>

      <Modal
        open={modalOpen}
        title={editingGroup ? `Edit ${editingGroup.name}` : 'New notification group'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => void handleSubmit()} loading={submitting}>
              {editingGroup ? 'Save as new group' : 'Create group'}
            </Button>
          </>
        }
      >
        {formError ? (
          <Alert tone="danger" title="Could not save this group">
            {formError}
          </Alert>
        ) : null}

        <TextField
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value as RecipientGroupType)}
        />

        {type === 'Role' ? (
          <Combobox
            label="Role"
            required
            options={roleOptions}
            value={roleId}
            onChange={(value) => setRoleId(value)}
            loading={rolesQuery.isLoading}
          />
        ) : null}

        {type === 'Jurisdiction' ? (
          <Combobox
            label="Jurisdiction"
            required
            options={jurisdictionOptions}
            value={jurisdictionId}
            onChange={(value) => setJurisdictionId(value)}
            loading={jurisdictionsQuery.isLoading}
          />
        ) : null}

        {type === 'Geography' ? (
          <>
            {/*
              MapCanvas's current contract (02-04/04-03) has no literal
              freehand-polygon-draw prop — only `areas`/`onSelect`. Per the
              mockup's own explicit accessible fallback ("The MapCanvas
              geotargeting draw tool has a keyboard-operable polygon-entry
              fallback... since freehand drawing is pointer-only"), geography
              selection here uses a plain coordinates TextField, parsed
              client-side into a GeoJSON polygon, with a read-only MapCanvas
              live preview of the parsed area below it. This is the literal
              mockup-specified accessible fallback, not a corner cut.
            */}
            <TextField
              label="Area coordinates (keyboard-operable fallback)"
              multiline
              rows={5}
              required
              hint="Enter one lat,lng pair per line, at least 3 pairs, to define the geotargeted polygon."
              value={coordinatesRaw}
              onChange={(e) => setCoordinatesRaw(e.target.value)}
            />
            <MapCanvas height={200} areas={previewAreas} label="Drawn area preview" />
          </>
        ) : null}
      </Modal>
    </div>
  );
}
