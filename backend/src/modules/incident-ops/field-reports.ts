import { randomUUID } from 'node:crypto';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';
import multipart from '@fastify/multipart';
import { requirePermission } from '../auth-org/rbac.js';
import { query } from '../../db/client.js';
import { TimelineService, withTimelineTransaction } from './timeline.js';

export type FieldReportSyncStatus = 'synced' | 'conflict' | 'failed';

export interface FieldReportInput {
  client_report_id: string;
  incident_id?: string;
  observation_type: string;
  description?: string;
  location?: { lat: number; lng: number };
  location_accuracy_m?: number;
  captured_at: string;
}

interface FieldReportRow {
  id: string;
  sync_status: FieldReportSyncStatus;
}

export const FIELD_REPORT_NOT_FOUND = {
  error_code: 'FIELD_REPORT_NOT_FOUND',
  message: "This field report no longer exists or you don't have access.",
} as const;

const REPORT_EMPTY = {
  error_code: 'REPORT_EMPTY',
  message: 'A report needs a description or a location — add one before submitting.',
} as const;

// Local-disk stand-in for a real object-storage adapter (MinIO/S3) --
// TechArch doesn't specify one for Phase 5. Photo bytes are written here
// and read back exclusively through the same-origin GET route below,
// never exposing a raw filesystem path or external URL to the client --
// satisfies the object-store I/O rule even though this is disk, not a
// real store. A later phase's real adapter would replace this
// implementation behind the exact same two routes with no API contract
// change.
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

function toWktPoint(location?: { lat: number; lng: number }): string | null {
  if (!location) return null;
  return `SRID=4326;POINT(${location.lng} ${location.lat})`;
}

// Idempotency check shared by the single-submit route and each item of the
// sync-batch route: a client_report_id that already exists returns the
// SAME row unchanged -- this is what makes a flaky-retry resubmission safe,
// never a duplicate row (the client_report_id UNIQUE constraint is the DB
// backstop; this SELECT is what avoids ever hitting it in the happy path).
async function findExistingByClientReportId(clientReportId: string): Promise<FieldReportRow | null> {
  const rows = await query<FieldReportRow>(
    `SELECT id, sync_status FROM field_reports WHERE client_report_id = $1`,
    [clientReportId],
  );
  return rows[0] ?? null;
}

export default async function fieldReportsRoutes(app: FastifyInstance) {
  // Registered locally (not globally in server.ts) -- Fastify plugin
  // encapsulation keeps the blast radius of this new dependency contained
  // to the one route that needs multipart parsing.
  await app.register(multipart);

  // POST /api/v1/field-reports -- idempotent single-report submission.
  app.post<{ Body: FieldReportInput }>(
    '/api/v1/field-reports',
    { preHandler: requirePermission('field_reports', 'create') },
    async (req, reply) => {
      const {
        client_report_id,
        incident_id,
        observation_type,
        description,
        location,
        location_accuracy_m,
        captured_at,
      } = req.body ?? ({} as never);

      // Idempotent via client_report_id's UNIQUE constraint: a resubmission
      // of an already-synced queue item (flaky retry) returns the SAME
      // record unchanged, never a second INSERT / never an error.
      const existing = await findExistingByClientReportId(client_report_id);
      if (existing) {
        return reply.code(201).send({ id: existing.id, sync_status: existing.sync_status });
      }

      // Mirrors the DB's own chk_report_not_empty CHECK -- returning a
      // clean 422 here means that constraint is never actually hit in the
      // happy case.
      if (!description && !location) {
        return reply.code(422).send(REPORT_EMPTY);
      }

      try {
        const created = await withTimelineTransaction(async (client) => {
          const insertedRows = await client.query<{ id: string; sync_status: FieldReportSyncStatus }>(
            `INSERT INTO field_reports
               (client_report_id, incident_id, observation_type, description, location,
                location_accuracy_m, submitted_by, captured_at, sync_status)
             VALUES ($1,$2,$3,$4,ST_GeogFromText($5),$6,$7,$8,'synced')
             RETURNING id, sync_status`,
            [
              client_report_id,
              incident_id ?? null,
              observation_type,
              description ?? null,
              toWktPoint(location),
              location_accuracy_m ?? null,
              req.epmpUser!.id,
              captured_at,
            ],
          );
          const row = insertedRows.rows[0];

          // Only when incident_id is present -- a field report not tied to
          // any specific incident is valid per the FRD, and there is no
          // Timeline to append to in that case.
          if (incident_id) {
            await TimelineService.append(
              client,
              incident_id,
              'Field report received',
              undefined,
              'brand',
              req.epmpUser!.id,
              'EPMP',
              { observation_type, client_report_id },
            );
          }

          return row;
        });

        return reply.code(201).send({ id: created.id, sync_status: created.sync_status });
      } catch (err) {
        req.log.error(err, 'Field report creation transaction failed');
        return reply.code(500).send({
          error_code: 'TIMELINE_WRITE_FAILED',
          message: "This action didn't record to the incident timeline. Retry before continuing.",
        });
      }
    },
  );

  // POST /api/v1/field-reports/sync-batch -- processes the client's queued
  // offline reports IN THE GIVEN ORDER, sequentially (never Promise.all --
  // order matters for idempotency/conflict semantics), returning a
  // per-item synced/conflict/failed result so the client can mark each
  // queue item individually rather than all-or-nothing.
  app.post<{ Body: { reports: FieldReportInput[] } }>(
    '/api/v1/field-reports/sync-batch',
    { preHandler: requirePermission('field_reports', 'create') },
    async (req, reply) => {
      const { reports } = req.body ?? ({ reports: [] } as never);
      const results: Array<{ client_report_id: string; status: FieldReportSyncStatus; conflict_id?: string }> = [];

      for (const report of reports) {
        try {
          // 1. Idempotency check -- identical to the single-POST route.
          const existing = await findExistingByClientReportId(report.client_report_id);
          if (existing) {
            results.push({ client_report_id: report.client_report_id, status: existing.sync_status });
            continue;
          }

          // 2. Conflict detection -- this plan's scope covers the
          // field_report-vs-incident case explicitly. Any other
          // entity_type is a documented extension point for a later plan
          // (e.g. F4 task-status sync-batch reconciliation would need its
          // own detection rule).
          let conflictingIncident: { updated_at: string; name: string } | null = null;
          if (report.incident_id) {
            const incidentRows = await query<{ updated_at: string; name: string }>(
              `SELECT updated_at, name FROM incidents WHERE id = $1`,
              [report.incident_id],
            );
            const incident = incidentRows[0];
            if (incident && new Date(incident.updated_at).getTime() > new Date(report.captured_at).getTime()) {
              conflictingIncident = incident;
            }
          }

          if (conflictingIncident) {
            // Insert the field_reports row FIRST (sync_status: 'conflict'),
            // THEN the sync_conflicts row referencing it -- both versions
            // (field_version: the incoming body, eoc_version: the current
            // incident state) are preserved exactly as submitted/as-found,
            // neither discarded.
            const insertedReport = await query<{ id: string }>(
              `INSERT INTO field_reports
                 (client_report_id, incident_id, observation_type, description, location,
                  location_accuracy_m, submitted_by, captured_at, sync_status)
               VALUES ($1,$2,$3,$4,ST_GeogFromText($5),$6,$7,$8,'conflict')
               RETURNING id`,
              [
                report.client_report_id,
                report.incident_id ?? null,
                report.observation_type,
                report.description ?? null,
                toWktPoint(report.location),
                report.location_accuracy_m ?? null,
                req.epmpUser!.id,
                report.captured_at,
              ],
            );
            const fieldReportId = insertedReport[0].id;

            const conflictRows = await query<{ id: string }>(
              `INSERT INTO sync_conflicts (entity_type, entity_id, field_version, eoc_version)
               VALUES ('field_report', $1, $2, $3)
               RETURNING id`,
              [
                fieldReportId,
                JSON.stringify(report),
                JSON.stringify({ incident_updated_at: conflictingIncident.updated_at, incident_name: conflictingIncident.name }),
              ],
            );

            results.push({
              client_report_id: report.client_report_id,
              status: 'conflict',
              conflict_id: conflictRows[0].id,
            });
            continue;
          }

          // 3. No conflict -- insert as synced, wrap this item's write in
          // withTimelineTransaction if incident-linked (fires once per
          // synced item, not once per batch -- this is the "appends a
          // Timeline entry noting the sync" success criterion).
          if (report.incident_id) {
            await withTimelineTransaction(async (client) => {
              await client.query(
                `INSERT INTO field_reports
                   (client_report_id, incident_id, observation_type, description, location,
                    location_accuracy_m, submitted_by, captured_at, sync_status, synced_at)
                 VALUES ($1,$2,$3,$4,ST_GeogFromText($5),$6,$7,$8,'synced',now())`,
                [
                  report.client_report_id,
                  report.incident_id,
                  report.observation_type,
                  report.description ?? null,
                  toWktPoint(report.location),
                  report.location_accuracy_m ?? null,
                  req.epmpUser!.id,
                  report.captured_at,
                ],
              );
              await TimelineService.append(
                client,
                report.incident_id!,
                'Field report synced',
                undefined,
                'brand',
                req.epmpUser!.id,
                'EPMP',
                { observation_type: report.observation_type, client_report_id: report.client_report_id, captured_at: report.captured_at },
              );
            });
          } else {
            await query(
              `INSERT INTO field_reports
                 (client_report_id, incident_id, observation_type, description, location,
                  location_accuracy_m, submitted_by, captured_at, sync_status, synced_at)
               VALUES ($1,NULL,$2,$3,ST_GeogFromText($4),$5,$6,$7,'synced',now())`,
              [
                report.client_report_id,
                report.observation_type,
                report.description ?? null,
                toWktPoint(report.location),
                report.location_accuracy_m ?? null,
                req.epmpUser!.id,
                report.captured_at,
              ],
            );
          }

          results.push({ client_report_id: report.client_report_id, status: 'synced' });
        } catch (err) {
          // One failed item must never abort the whole batch -- every item
          // resolves to synced/conflict/failed, per the FRD's "queue never
          // silently drops an item" hard requirement.
          req.log.error(err, `Field report sync-batch item failed: ${report.client_report_id}`);
          results.push({ client_report_id: report.client_report_id, status: 'failed' });
        }
      }

      // The per-item statuses carry the outcome, not the HTTP status.
      return reply.code(200).send({ results });
    },
  );

  // POST /api/v1/field-reports/{id}/photos -- non-blocking multipart photo
  // upload. Bytes persist to local disk (object-storage stand-in, see
  // UPLOADS_DIR docstring above) and are read back exclusively through the
  // paired GET route below.
  //
  // The `:id` path param is matched against EITHER field_reports.id (the
  // server-assigned primary key) OR client_report_id (the client-generated
  // idempotency key) -- ReportObservation.tsx's submit flow only ever has
  // the client_report_id in hand at the moment it fires this upload
  // (enqueueFieldReport is queue-first and returns void by design, so the
  // caller never synchronously learns the server-assigned id). Accepting
  // both identifier shapes here, resolved to the real field_reports.id
  // before any INSERT, is what makes a same-request online photo upload
  // actually resolve instead of 404ing against a client_report_id that
  // field_reports.id was never equal to.
  app.post<{ Params: { id: string } }>(
    '/api/v1/field-reports/:id/photos',
    { preHandler: requirePermission('field_reports', 'create') },
    async (req, reply) => {
      const { id: pathId } = req.params;

      // `id::text = $1` (not `id = $1`) -- the path param can be EITHER a
      // real UUID (field_reports.id) or an arbitrary client-generated
      // string (client_report_id, VARCHAR(100), not necessarily
      // UUID-shaped) -- a bare `id = $1` comparison against the uuid
      // column throws `operator does not exist: uuid = character varying`
      // when $1 isn't valid UUID syntax, which client_report_id values
      // frequently aren't. Casting the uuid side to text sidesteps that
      // entirely and still matches correctly when $1 happens to BE a
      // UUID string.
      //
      // Jurisdiction-scope enforcement (F-05-01 fix, 05-SECURITY.md): the
      // scope check runs on this same lookup, BEFORE any file write --
      // an out-of-scope id 404s here and never reaches the upload logic
      // below. Standalone reports (incident_id IS NULL) carry no
      // jurisdiction data and are left unscoped, same convention as
      // tasks.ts's fetchTaskRow.
      const existing = await query<{ id: string }>(
        `SELECT fr.id
         FROM field_reports fr
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE (fr.id::text = $1 OR fr.client_report_id = $1)
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($2))`,
        [pathId, req.epmpUser!.jurisdiction_scope],
      );
      if (!existing[0]) {
        return reply.code(404).send(FIELD_REPORT_NOT_FOUND);
      }
      const id = existing[0].id;

      try {
        const uploadedFile = await req.file();
        if (!uploadedFile) {
          return reply.code(500).send({
            error_code: 'PHOTO_UPLOAD_FAILED',
            message: "This photo couldn't be saved. The rest of your report was submitted.",
          });
        }

        const buffer = await uploadedFile.toBuffer();
        const ext = path.extname(uploadedFile.filename || '') || '.jpg';
        const storageRef = `field-reports/${id}/${randomUUID()}${ext}`;
        const diskPath = path.join(UPLOADS_DIR, storageRef);
        await mkdir(path.dirname(diskPath), { recursive: true });
        await writeFile(diskPath, buffer);

        await query(
          `INSERT INTO field_report_photos (field_report_id, storage_ref, upload_status) VALUES ($1,$2,'uploaded')`,
          [id, storageRef],
        );

        return reply.code(204).send();
      } catch (err) {
        req.log.error(err, `Field report photo upload failed for field_report_id=${id}`);
        return reply.code(500).send({
          error_code: 'PHOTO_UPLOAD_FAILED',
          message: "This photo couldn't be saved. The rest of your report was submitted.",
        });
      }
    },
  );

  // GET /api/v1/field-reports/{id}/photos/{photoId} -- streams the photo
  // bytes back through this same-origin, permission-gated route. Never
  // exposes storage_ref or a filesystem path to the client (object-store
  // I/O rule, runtime-environment.md §9a). Same id-or-client_report_id
  // resolution as the POST route above, for the same reason.
  app.get<{ Params: { id: string; photoId: string } }>(
    '/api/v1/field-reports/:id/photos/:photoId',
    { preHandler: requirePermission('field_reports', 'view') },
    async (req, reply) => {
      const { id: pathId, photoId } = req.params;
      // Same `id::text = $1` cast reasoning as the POST route above, and
      // the same jurisdiction-scope join+filter (F-05-01 fix,
      // 05-SECURITY.md) -- an out-of-scope id 404s before the photo
      // bytes are ever read from disk.
      const reportRows = await query<{ id: string }>(
        `SELECT fr.id
         FROM field_reports fr
         LEFT JOIN incidents i ON i.id = fr.incident_id
         WHERE (fr.id::text = $1 OR fr.client_report_id = $1)
           AND (fr.incident_id IS NULL OR i.jurisdiction_id = ANY($2))`,
        [pathId, req.epmpUser!.jurisdiction_scope],
      );
      const id = reportRows[0]?.id;
      if (!id) {
        return reply.code(404).send(FIELD_REPORT_NOT_FOUND);
      }

      const rows = await query<{ storage_ref: string | null }>(
        `SELECT storage_ref FROM field_report_photos WHERE id = $1 AND field_report_id = $2`,
        [photoId, id],
      );
      const row = rows[0];
      if (!row || !row.storage_ref) {
        return reply.code(404).send(FIELD_REPORT_NOT_FOUND);
      }

      try {
        const diskPath = path.join(UPLOADS_DIR, row.storage_ref);
        const buffer = await readFile(diskPath);
        return reply.code(200).header('Content-Type', 'application/octet-stream').send(buffer);
      } catch (err) {
        req.log.error(err, `Field report photo read failed for photo_id=${photoId}`);
        return reply.code(404).send(FIELD_REPORT_NOT_FOUND);
      }
    },
  );
}
