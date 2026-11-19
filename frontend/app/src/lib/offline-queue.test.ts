// fake-indexeddb's /auto side-effect entry polyfills global `indexedDB`
// before offline-queue.ts (which calls idb's openDB at module load) is
// ever imported — jsdom alone does not implement IndexedDB.
import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./api-client', () => ({
  apiPost: vi.fn(),
  apiPatch: vi.fn(),
}));

import { apiPost } from './api-client';
import {
  enqueueFieldReport,
  getQueueSnapshot,
  resolveQueuedConflict,
  subscribeToQueue,
  syncQueueNow,
} from './offline-queue';

const DB_NAME = 'epmp-field-queue';
const STORE_NAME = 'field_reports';

/**
 * Clears every row from the queue's IndexedDB store between tests. A
 * module-level `vi.resetModules()` + re-import approach was tried first,
 * but closing/reopening idb connections against fake-indexeddb's shared
 * global database causes `deleteDatabase` to block indefinitely on the
 * still-open prior connection — this direct clear() avoids that entirely
 * by reusing the ONE module instance's own already-open connection
 * indirectly (opening a second connection to the same store name/version
 * is valid IndexedDB and does not require closing the first).
 */
async function clearQueueStore(): Promise<void> {
  // Ensure the DB/store exists (first call in the whole test run lazily
  // creates it via offline-queue.ts's own getDb()) before trying to clear.
  await getQueueSnapshot();

  // DB_VERSION bumped 1 -> 2 (05-03 added the tasks_status object store) —
  // this MUST open at the same version offline-queue.ts's own getDb() last
  // opened, or fake-indexeddb throws VersionError ("a lower version than
  // the existing version").
  await new Promise<void>((resolve, reject) => {
    const openReq = indexedDB.open(DB_NAME, 2);
    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).clear();
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    };
    openReq.onerror = () => reject(openReq.error);
  });
}

function baseReport(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    client_report_id: `report-${Math.random().toString(36).slice(2)}`,
    observation_type: 'hazard',
    description: 'Downed power line',
    captured_at: new Date().toISOString(),
    ...overrides,
  };
}

describe('offline-queue', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubGlobal('navigator', { onLine: true });
    await clearQueueStore();
  });

  it('enqueueFieldReport persists a row retrievable via getQueueSnapshot with queue_status "pending"', async () => {
    // Offline during enqueue — isolates this test from enqueue's own
    // fire-and-forget auto-sync-if-online branch, which would otherwise
    // call the unmocked-for-this-test apiPost and log a harmless but
    // noisy console.warn.
    vi.stubGlobal('navigator', { onLine: false });
    const report = baseReport();
    await enqueueFieldReport(report);

    const snapshot = await getQueueSnapshot();
    const row = snapshot.items.find((item) => item.client_report_id === report.client_report_id);
    expect(row).toBeDefined();
    expect(row?.queue_status).toBe('pending');
  });

  it('getQueueSnapshot returns queuedCount:3 and state:"offline" when navigator.onLine is false', async () => {
    vi.stubGlobal('navigator', { onLine: false });

    await enqueueFieldReport(baseReport());
    await enqueueFieldReport(baseReport());
    await enqueueFieldReport(baseReport());

    const snapshot = await getQueueSnapshot();
    expect(snapshot.queuedCount).toBe(3);
    expect(snapshot.state).toBe('offline');
  });

  it('subscribeToQueue invokes the callback immediately, then again after a subsequent enqueueFieldReport', async () => {
    const calls: number[] = [];
    const unsubscribe = subscribeToQueue((snapshot) => {
      calls.push(snapshot.queuedCount);
    });

    // The immediate call happens asynchronously inside subscribeToQueue —
    // wait for it to land before asserting.
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(calls.length).toBeGreaterThanOrEqual(1);
    expect(calls[0]).toBe(0);

    await enqueueFieldReport(baseReport());

    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[calls.length - 1]).toBe(1);

    unsubscribe();
  });

  it('syncQueueNow reconciles a sync-batch response marking one item conflict and one synced', async () => {
    // Stub offline during enqueue so enqueueFieldReport's own
    // fire-and-forget auto-sync-if-online branch does not race with (and
    // consume the mocked return value intended for) this test's explicit
    // syncQueueNow() call below.
    vi.stubGlobal('navigator', { onLine: false });

    const reportA = baseReport();
    const reportB = baseReport();
    await enqueueFieldReport(reportA);
    await enqueueFieldReport(reportB);

    vi.mocked(apiPost).mockResolvedValueOnce({
      results: [
        { client_report_id: reportA.client_report_id, status: 'synced' },
        { client_report_id: reportB.client_report_id, status: 'conflict', conflict_id: 'conflict-1' },
      ],
    });

    await syncQueueNow();

    const snapshot = await getQueueSnapshot();
    const rowA = snapshot.items.find((item) => item.client_report_id === reportA.client_report_id);
    const rowB = snapshot.items.find((item) => item.client_report_id === reportB.client_report_id);

    expect(rowA?.queue_status).toBe('synced');
    expect(rowB?.queue_status).toBe('conflict');
    expect(rowB?.conflict_id).toBe('conflict-1');
  });

  it('syncQueueNow leaves a pending item unchanged (not "failed") when apiPost rejects', async () => {
    // Same offline-during-enqueue reasoning as the test above — isolates
    // this test's explicit syncQueueNow() call from enqueue's own
    // fire-and-forget auto-sync branch.
    vi.stubGlobal('navigator', { onLine: false });

    const report = baseReport();
    await enqueueFieldReport(report);

    vi.mocked(apiPost).mockRejectedValueOnce(new Error('network down'));

    await syncQueueNow();

    const snapshot = await getQueueSnapshot();
    const row = snapshot.items.find((item) => item.client_report_id === report.client_report_id);
    expect(row?.queue_status).toBe('pending');
  });

  // Review finding W1: SyncConflictResolution.tsx's handleResolve() never
  // cleared the local 'conflict' queue_status after a successful
  // server-side resolve, leaving SyncStatus stuck showing 'conflict'
  // forever. resolveQueuedConflict() is the fix — these two cases cover
  // both resolution outcomes' DISTINCT local-status mapping.
  it('resolveQueuedConflict("keep_mine") updates the matching local row from "conflict" to "synced"', async () => {
    vi.stubGlobal('navigator', { onLine: false });

    const report = baseReport();
    await enqueueFieldReport(report);

    vi.mocked(apiPost).mockResolvedValueOnce({
      results: [{ client_report_id: report.client_report_id, status: 'conflict', conflict_id: 'conflict-keep-mine' }],
    });
    await syncQueueNow();

    let snapshot = await getQueueSnapshot();
    expect(snapshot.state).toBe('conflict');

    await resolveQueuedConflict('conflict-keep-mine', 'keep_mine');

    snapshot = await getQueueSnapshot();
    const row = snapshot.items.find((item) => item.client_report_id === report.client_report_id);
    expect(row?.queue_status).toBe('synced');
    expect(snapshot.state).not.toBe('conflict');
  });

  it('resolveQueuedConflict("keep_eoc") updates the matching local row from "conflict" to "failed"', async () => {
    vi.stubGlobal('navigator', { onLine: false });

    const report = baseReport();
    await enqueueFieldReport(report);

    vi.mocked(apiPost).mockResolvedValueOnce({
      results: [{ client_report_id: report.client_report_id, status: 'conflict', conflict_id: 'conflict-keep-eoc' }],
    });
    await syncQueueNow();

    await resolveQueuedConflict('conflict-keep-eoc', 'keep_eoc');

    const snapshot = await getQueueSnapshot();
    const row = snapshot.items.find((item) => item.client_report_id === report.client_report_id);
    expect(row?.queue_status).toBe('failed');
    expect(snapshot.state).not.toBe('conflict');
  });

  it('resolveQueuedConflict is a no-op (does not throw) when no local row references the given conflict_id', async () => {
    await expect(resolveQueuedConflict('no-such-conflict-id', 'keep_mine')).resolves.toBeUndefined();
  });
});
