import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { SyncStatus } from '@epmp/design-system';
import { subscribeToQueue, type QueueSnapshot } from './offline-queue';

/**
 * Shared wrapper every field-mobile screen renders inside (this plan's 3
 * screens — Field Home, My Tasks, Report Observation — plus 05-04's
 * remaining 3). The UX mockup's layout table shows `SyncStatus` pinned at
 * the top of EVERY field-mobile screen identically; building this once
 * means each screen subscribes to the offline-queue exactly once, via this
 * shared wrapper, rather than six independent subscriptions that could
 * drift out of sync with each other.
 *
 * This wrapper owns ONLY the top-pinned `SyncStatus` — it does NOT render
 * the bottom bar. `AppShell.tsx` (05-04's Task 3) already renders the
 * `SideNav variant="bottom-bar"` at the app-shell level for any role whose
 * nav-config returns the 4-item field bottom bar, so duplicating that here
 * would render it twice.
 */
export function FieldMobileShell({ children }: { children: React.ReactNode }): JSX.Element {
  const navigate = useNavigate();
  const [snapshot, setSnapshot] = React.useState<QueueSnapshot | null>(null);

  React.useEffect(() => {
    const unsubscribe = subscribeToQueue(setSnapshot);
    return unsubscribe;
  }, []);

  const handleSyncStatusTap = () => {
    // Per the Navigation Map's literal "Sync Conflict Resolution ...
    // Reached from: Queued Submissions View conflict row / SyncStatus
    // conflict state" — a specific conflict is reached from a Queued
    // Submissions View row's own conflict_id, never from this global tap,
    // which has no single conflict id to deep-link to when there could be
    // multiple. So SyncStatus's conflict-state tap in THIS shared wrapper
    // goes to /field/queued the same as every other state — simpler and
    // consistent with that documented reach-path rather than guessing
    // which conflict id to jump to.
    navigate('/field/queued');
  };

  const state = snapshot?.state ?? 'online';
  const detail = state === 'offline' && snapshot ? `${snapshot.queuedCount} queued` : undefined;

  return (
    <>
      <SyncStatus state={state} detail={detail} onClick={handleSyncStatusTap} />
      <main>{children}</main>
    </>
  );
}
