import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { apiPost } from './api-client';

/**
 * EPMP field-mobile offline queue.
 *
 * IndexedDB-backed persistence for locally-captured field reports, plus
 * auto-sync-on-reconnect against 05-01's
 * `POST /api/v1/field-reports/sync-batch` endpoint.
 *
 * The core guarantee: `enqueueFieldReport` persists to IndexedDB
 * IMMEDIATELY, before any network attempt is ever made — a submission is
 * ALWAYS queue-first, then synced opportunistically. There is no code path
 * where the app tries the network first and falls back to the queue on
 * failure; that would mean a page reload mid-request could lose the item.
 * This is the literal mechanism satisfying "every edit remains possible
 * while offline" and "a queued submission shows Queued, not Failed".
 *
 * Every field-mobile screen (05-03/05-04) reads/writes exclusively through
 * this module's exports — none of them touch IndexedDB or
 * `navigator.onLine`/the `online`/`offline` events directly. This is what
 * makes connectivity detection a single, reusable mechanism instead of a
 * per-screen convention screens could individually get wrong.
 */

export interface QueuedFieldReport {
  client_report_id: string;
  incident_id?: string;
  observation_type: string;
  description?: string;
  location?: { lat: number; lng: number };
  location_accuracy_m?: number;
  /** ISO timestamp set at the MOMENT of local capture, never at sync time. */
  captured_at: string;
  queue_status: 'pending' | 'syncing' | 'synced' | 'conflict' | 'failed';
  conflict_id?: string;
  /** Local enqueue timestamp — Queued Submissions View's "Captured: ..." display. */
  created_at: string;
}

export type SyncStatusState = 'online' | 'syncing' | 'offline' | 'conflict';

export interface QueueSnapshot {
  state: SyncStatusState;
  /** Count of queue_status==='pending' items — what SyncStatus's `detail` renders as "N queued". */
  queuedCount: number;
  items: QueuedFieldReport[];
}

interface FieldQueueDB extends DBSchema {
  field_reports: {
    key: string;
    value: QueuedFieldReport;
  };
}

const DB_NAME = 'epmp-field-queue';
const DB_VERSION = 1;
const STORE_NAME = 'field_reports';

let dbPromise: Promise<IDBPDatabase<FieldQueueDB>> | null = null;

function getDb(): Promise<IDBPDatabase<FieldQueueDB>> {
  if (!dbPromise) {
    dbPromise = openDB<FieldQueueDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'client_report_id' });
      },
    });
  }
  return dbPromise;
}

// Module-level sync-in-flight flag — read by getQueueSnapshot() to derive
// the 'syncing' state, and flipped by syncQueueNow() around its own
// network call.
let syncInFlight = false;

// Reactive subscription set — subscribeToQueue()'s callbacks, notified on
// every queue mutation and on the browser's native online/offline events.
// This is what lets every screen's SyncStatus stay current without any
// screen polling IndexedDB or attaching its own online/offline listener.
const subscribers = new Set<(snapshot: QueueSnapshot) => void>();

async function notifySubscribers(): Promise<void> {
  if (subscribers.size === 0) return;
  const snapshot = await getQueueSnapshot();
  subscribers.forEach((cb) => cb(snapshot));
}

/**
 * Persists a new field report to IndexedDB IMMEDIATELY (before any network
 * attempt), then — if currently online — kicks off a best-effort
 * fire-and-forget sync. The caller's own "queued successfully" return is
 * never blocked on that sync call.
 */
export async function enqueueFieldReport(
  report: Omit<QueuedFieldReport, 'queue_status' | 'created_at'>,
): Promise<void> {
  const db = await getDb();
  const row: QueuedFieldReport = {
    ...report,
    queue_status: 'pending',
    created_at: new Date().toISOString(),
  };
  await db.put(STORE_NAME, row);

  await notifySubscribers();

  if (navigator.onLine) {
    // Fire-and-forget — an online submission still gets a near-immediate
    // best-effort sync without blocking the caller.
    void syncQueueNow();
  }
}

/**
 * Reads every row and derives the single connectivity+pending-count state
 * every screen's SyncStatus prop reads. No screen computes connectivity
 * itself — this is the one place that derivation happens.
 */
export async function getQueueSnapshot(): Promise<QueueSnapshot> {
  const db = await getDb();
  const items = await db.getAll(STORE_NAME);
  const queuedCount = items.filter((item) => item.queue_status === 'pending').length;

  let state: SyncStatusState;
  if (items.some((item) => item.queue_status === 'conflict')) {
    state = 'conflict';
  } else if (syncInFlight) {
    state = 'syncing';
  } else if (!navigator.onLine) {
    state = 'offline';
  } else {
    state = 'online';
  }

  return { state, queuedCount, items };
}

/**
 * Subscribes to queue state changes: calls `cb` immediately with the
 * current snapshot, then again on every subsequent queue mutation or
 * online/offline window event. Returns an unsubscribe function.
 */
export function subscribeToQueue(cb: (snapshot: QueueSnapshot) => void): () => void {
  subscribers.add(cb);
  // Immediate call with the current snapshot — async, but fires before any
  // other mutation can race it since this is the very next microtask.
  void getQueueSnapshot().then(cb);

  return () => {
    subscribers.delete(cb);
  };
}

interface SyncBatchResult {
  client_report_id: string;
  status: 'synced' | 'conflict' | 'failed';
  conflict_id?: string;
}

interface SyncBatchResponse {
  results: SyncBatchResult[];
}

/**
 * Reads every 'pending' row, in the order they were enqueued (sorted by
 * `created_at` ascending — explicit rather than relying on a non-indexed
 * cursor walk's implicit insertion order, since `getAll()` does not
 * guarantee ordering across all IndexedDB implementations), and POSTs them
 * as a batch to `/api/v1/field-reports/sync-batch`. Reconciles each
 * response item back to its local row by `client_report_id`.
 *
 * A total request failure (not a per-item failure — the whole fetch
 * rejecting) leaves every attempted item's queue_status unchanged at
 * 'pending': a network-level failure is retried on the next reconnect,
 * never given up on by marking the item 'failed'.
 */
export async function syncQueueNow(): Promise<void> {
  const db = await getDb();
  const allItems = await db.getAll(STORE_NAME);
  const pending = allItems
    .filter((item) => item.queue_status === 'pending')
    .sort((a, b) => a.created_at.localeCompare(b.created_at));

  if (pending.length === 0) {
    return;
  }

  syncInFlight = true;
  await notifySubscribers();

  try {
    const response = await apiPost<SyncBatchResponse>('/api/v1/field-reports/sync-batch', {
      reports: pending.map(({ queue_status: _queueStatus, created_at: _createdAt, conflict_id: _conflictId, ...rest }) => rest),
    });

    const byId = new Map(response.results.map((result) => [result.client_report_id, result]));

    for (const item of pending) {
      const result = byId.get(item.client_report_id);
      if (!result) continue;
      await db.put(STORE_NAME, {
        ...item,
        queue_status: result.status,
        conflict_id: result.conflict_id,
      });
    }
  } catch (err) {
    // A totally-failed request (not a per-item failure) — every attempted
    // item stays 'pending' and is retried on the next reconnect. Never
    // throws uncaught.
    console.warn('offline-queue: sync-batch request failed, will retry on next reconnect', err);
  } finally {
    syncInFlight = false;
    await notifySubscribers();
  }
}

// Attach once at module load — the "no manual upload step required"
// mechanism: the moment the browser's own connectivity detection fires
// 'online', a sync attempt starts automatically, with no user action.
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    void notifySubscribers();
    void syncQueueNow();
  });
  window.addEventListener('offline', () => {
    void notifySubscribers();
  });
}
