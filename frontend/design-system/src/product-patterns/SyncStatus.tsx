import * as React from 'react';
import { Icon, type IconName } from '../foundations/Icon';
import './SyncStatus.css';

/**
 * EPMP Design System — SyncStatus (PRODUCT PATTERNS)
 *
 * Connection and sync state for degraded-mode field operation: online,
 * syncing, offline (with queued count in `detail`), conflict. Per
 * EPMP-Design-System.pdf.md's dedicated SyncStatus product-pattern chapter:
 * each state has its own icon AND word — this is F0's "status always
 * icon + word + color" hard rule (the same one Badge.tsx enforces)
 * applied to connectivity, never color alone. Meant to be pinned in the
 * app header and visible on every mobile screen; when offline, all edits
 * stay possible (see `frontend/app/src/lib/offline-queue.ts`) and this
 * component is purely presentational — it renders whatever state/detail
 * its caller (the offline-queue's subscription, wired up in 05-03) hands
 * it, with no IndexedDB/network code of its own.
 */

export type SyncStatusState = 'online' | 'syncing' | 'offline' | 'conflict';

export interface SyncStatusProps {
  /** Required. */
  state: SyncStatusState;
  /** e.g. "3 queued". Rendered alongside the state word. */
  detail?: string;
  /**
   * Tappable — navigates to Queued Submissions View (conflict state
   * navigates to Sync Conflict Resolution instead; routing correctly
   * based on `state` is the caller's responsibility). When provided, the
   * root element is a native `<button type="button">` so it is keyboard-
   * operable and focusable with no extra ARIA. When absent, the root is a
   * plain `<span>` (e.g. a non-interactive header placement).
   */
  onClick?: () => void;
}

type SyncStatusTone = 'success' | 'brand' | 'warning' | 'danger';

interface StateConfig {
  icon: IconName;
  tone: SyncStatusTone;
  word: string;
}

const STATE_CONFIG: Record<SyncStatusState, StateConfig> = {
  online: { icon: 'check', tone: 'success', word: 'Online' },
  syncing: { icon: 'refresh', tone: 'brand', word: 'Syncing' },
  offline: { icon: 'wifi-off', tone: 'warning', word: 'Offline' },
  conflict: { icon: 'alert', tone: 'danger', word: 'Conflict' },
};

export function SyncStatus({ state, detail, onClick }: SyncStatusProps) {
  const { icon, tone, word } = STATE_CONFIG[state];

  const content = (
    <>
      <span className={state === 'syncing' ? 'ep-sync-status__icon-spin' : undefined}>
        <Icon name={icon} size="sm" />
      </span>
      <span className="label ep-sync-status__word">{word}</span>
      {detail ? <span className="caption ep-sync-status__detail">{detail}</span> : null}
    </>
  );

  const classes = `ep-sync-status ep-sync-status--${tone}`;

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <span className={classes}>{content}</span>;
}
