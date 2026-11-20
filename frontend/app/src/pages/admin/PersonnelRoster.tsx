import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card, Table, Badge, Provenance, type TableColumn } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';
import './PersonnelRoster.css';

/**
 * F16-roster S16.x — Personnel Roster. Read-only admin screen sourced
 * exclusively from Plan 09-02's `GET /api/v1/integrations/hris/personnel`
 * (hris-roster-adapter.ts) — mirrors IntegrationHealth.tsx's/
 * RecordAuthority.tsx's PageHeader + Card(padded={false}) + Table
 * composition exactly (loading/error/empty states owned by Table itself).
 *
 * Structurally, this screen contains NO button, NO form, NO onClick
 * handler that could mutate a roster row — the literal mechanism
 * satisfying F16's "role/qualification value can only change by
 * resyncing... never a direct in-EPMP edit" rule, matching the backend's
 * own structural no-write-route guarantee (hris-roster-adapter.ts's doc
 * comment: zero PATCH/PUT/DELETE route exists anywhere in this codebase
 * for personnel_roster). Same "absence, not merely hidden" precedent as
 * Plan 07-04's CAD dispatch Card and Plan 08-02's facility Card.
 *
 * Provenance always renders the verified (non-dashed) branch — roster
 * data isn't an "unverified feed being validated" concept the way F12's
 * hazard layers are; it's read-only reference data whose authority lives
 * elsewhere (HR/IAM), the same semantic distinction Plan 07-04 already
 * documented for CAD dispatch data.
 */

interface PersonnelRosterRow {
  id: string;
  external_person_id: string;
  matched_user_id: string | null;
  name: string;
  email: string | null;
  role_titles: string[] | null;
  qualifications: string[] | null;
  contact_info: Record<string, unknown> | null;
  source: string;
  as_of: string;
}

interface PersonnelRosterResponse {
  items: PersonnelRosterRow[];
}

function contactEmail(row: PersonnelRosterRow): string {
  if (row.email) return row.email;
  const contactEmailValue = row.contact_info?.email;
  if (typeof contactEmailValue === 'string') return contactEmailValue;
  return '—';
}

const COLUMNS: TableColumn<PersonnelRosterRow>[] = [
  { key: 'name', header: 'Name' },
  {
    key: 'role_titles',
    header: 'Role',
    render: (row) => (row.role_titles && row.role_titles.length > 0 ? row.role_titles.join(', ') : '—'),
  },
  {
    key: 'qualifications',
    header: 'Qualifications',
    render: (row) => (row.qualifications && row.qualifications.length > 0 ? row.qualifications.join(', ') : '—'),
  },
  { key: 'contact', header: 'Contact', render: contactEmail },
  {
    key: 'match',
    header: 'Match',
    render: (row) =>
      row.matched_user_id ? (
        <Badge tone="success">Matched</Badge>
      ) : (
        <Badge tone="neutral">No matched user</Badge>
      ),
  },
  {
    key: 'source',
    header: 'Source',
    render: (row) => <Provenance source={row.source} time={new Date(row.as_of).toLocaleString()} />,
  },
];

export function PersonnelRoster(): JSX.Element {
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['hris-personnel'],
    queryFn: () => apiGet<PersonnelRosterResponse>('/api/v1/integrations/hris/personnel'),
  });

  const rows = data?.items ?? [];

  return (
    <div>
      <PageHeader title="Personnel roster" crumbs={[{ label: 'Admin' }, { label: 'Personnel roster' }]} />

      <p className="caption ep-personnel-roster__authority-note">
        HR/IAM is the authoritative system for personnel records — see{' '}
        <a
          href="/admin/record-authority"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin/record-authority');
          }}
        >
          Record Authority Registry
        </a>{' '}
        for the full declaration.
      </p>

      <Card padded={false}>
        <Table
          caption="Personnel roster"
          columns={COLUMNS}
          rows={rows}
          rowKey={(row) => row.id}
          loading={isLoading}
          error={isError ? { message: 'Could not load the personnel roster.', onRetry: () => void refetch() } : undefined}
          empty={{
            title: 'No personnel records yet',
            children: 'Personnel roster populates once the HR/IAM adapter completes its first sync.',
          }}
        />
      </Card>
    </div>
  );
}
