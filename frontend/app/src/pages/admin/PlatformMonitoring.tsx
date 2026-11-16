import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader, Card, Stat, Alert } from '@epmp/design-system';
import { apiGet } from '../../lib/api-client';

/**
 * F8 S8.7 — Platform Monitoring. Fetches 01-09's platform-health snapshot
 * and polls every 30s via React Query's refetchInterval so the view
 * updates without a manual refresh — this is explicitly NOT real-time
 * websocket push in Phase 1; a point-in-time snapshot refreshed on an
 * interval is the documented scope boundary for this phase.
 *
 * Deliberately omits any trend-over-time chart tile: no historical
 * time-series data exists yet (platform-health.ts's backend is a
 * point-in-time snapshot query, not an aggregation table), so faking a
 * trend visualization here would display data that was never collected. A
 * later phase that adds real historical aggregation can add trend tiles
 * without changing this screen's contract.
 */

interface PlatformHealthAlert {
  subsystem: string;
  message: string;
  since: string;
}

interface PlatformHealthResponse {
  active_sessions: number;
  failed_login_rate: number;
  integration_error_rate: number;
  uptime_pct: number;
  alerts: PlatformHealthAlert[];
}

const POLL_INTERVAL_MS = 30_000;

export function PlatformMonitoring(): JSX.Element {
  const { data } = useQuery({
    queryKey: ['platform-health'],
    queryFn: () => apiGet<PlatformHealthResponse>('/api/v1/admin/platform-health'),
    refetchInterval: POLL_INTERVAL_MS,
  });

  return (
    <div>
      <PageHeader title="Platform monitoring" crumbs={[{ label: 'Admin' }, { label: 'Platform monitoring' }]} />

      <Card>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          <Stat
            label="Uptime"
            value={data ? `${data.uptime_pct.toFixed(1)}%` : '—'}
            hint="Phase 1 placeholder — full historical uptime tracking is a later-phase concern"
          />
          <Stat
            label="Active sessions"
            value={data ? data.active_sessions : '—'}
            hint="Approximated as users with a login in the last 15 minutes (no live session store in Phase 1)"
          />
          <Stat
            label="Failed-login rate"
            value={data ? `${(data.failed_login_rate * 100).toFixed(1)}%` : '—'}
            hint="Phase 1 placeholder — no login_failed audit event is recorded yet"
          />
          <Stat
            label="Integration-error rate"
            value={data ? `${(data.integration_error_rate * 100).toFixed(1)}%` : '—'}
            hint="Share of background jobs currently in a failed state"
          />
        </div>
      </Card>

      {data && data.alerts.length > 0 ? (
        <div style={{ marginTop: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {data.alerts.map((alert) => (
            <Alert
              key={alert.subsystem}
              tone="danger"
              title={`${alert.subsystem} is degraded. Investigating.`}
            >
              {alert.message}
            </Alert>
          ))}
        </div>
      ) : null}
    </div>
  );
}
