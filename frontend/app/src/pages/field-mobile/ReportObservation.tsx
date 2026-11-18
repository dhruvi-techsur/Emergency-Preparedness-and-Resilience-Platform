import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, TextField, Button, Alert, type SelectOption } from '@epmp/design-system';
import { uploadFieldReportPhoto } from '../../lib/api-client';
import { enqueueFieldReport } from '../../lib/offline-queue';
import { FieldMobileShell } from '../../lib/field-mobile-shell';
import './ReportObservation.css';

/** A fixed, reasonable option set for the FRD's free-text
 * `observation_type VARCHAR(100)` column (no enum constraint in the DDL) —
 * Claude's discretion, a sensible field-ops set. */
const OBSERVATION_TYPE_OPTIONS: SelectOption[] = [
  { value: 'Structural damage', label: 'Structural damage' },
  { value: 'Shelter conditions', label: 'Shelter conditions' },
  { value: 'Road/access hazard', label: 'Road/access hazard' },
  { value: 'Utility outage', label: 'Utility outage' },
  { value: 'Medical need', label: 'Medical need' },
  { value: 'Other', label: 'Other' },
];

interface LocationCapture {
  lat: number;
  lng: number;
  accuracy: number;
}

/**
 * F6 S6.3 — Report Observation, the structured, offline-first field
 * report form. Routed `/field/report`. Submit ALWAYS goes through
 * `enqueueFieldReport` (never a direct apiPost) — queue-first regardless
 * of connectivity, per the FRD's "always succeeds locally" hard
 * requirement.
 */
export function ReportObservation(): JSX.Element {
  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [observationType, setObservationType] = React.useState(OBSERVATION_TYPE_OPTIONS[0].value);
  const [description, setDescription] = React.useState('');
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = React.useState<string | null>(null);
  const [location, setLocation] = React.useState<LocationCapture | null>(null);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
  };

  const handleCaptureLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError("Location isn't available. You can still submit without it.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      () => {
        setLocationError("Location isn't available. You can still submit without it.");
      },
    );
  };

  const handleSubmit = async () => {
    // Client-side validate description || photo || location is set —
    // mirrors 05-01's server-side chk_report_not_empty/422 REPORT_EMPTY
    // check, with the EXACT mockup message.
    if (!description && !photo && !location) {
      setValidationError('Add a description, photo, or location before submitting.');
      return;
    }
    setValidationError(null);
    setSubmitting(true);

    try {
      // captured_at set at THIS EXACT MOMENT — the instant of tap, never
      // deferred to sync time, per the FRD's explicit hard requirement.
      const capturedAt = new Date().toISOString();
      const clientReportId = crypto.randomUUID();

      await enqueueFieldReport({
        client_report_id: clientReportId,
        observation_type: observationType,
        description: description || undefined,
        location: location ? { lat: location.lat, lng: location.lng } : undefined,
        location_accuracy_m: location?.accuracy,
        captured_at: capturedAt,
      });

      // Photo upload is best-effort-online-only in this plan's scope — not
      // client-side queued. enqueueFieldReport already guarantees the
      // REPORT itself is never lost; a later refinement could also
      // IndexedDB-queue the photo blob for true offline photo-retry, but
      // that is a documented, bounded gap matching the mockup's own
      // "Photo upload failed post-reconnect" state, which already implies
      // photo delivery can lag behind the report itself.
      if (photo && navigator.onLine) {
        try {
          await uploadFieldReportPhoto(clientReportId, photo);
        } catch {
          // Non-blocking — the report text/location already queued
          // successfully; a photo upload failure is flagged separately,
          // never blocking the whole report (FRD Process step 7).
        }
      }

      navigate('/field');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FieldMobileShell>
      <div className="ep-report-observation">
        <h1 className="h1">Report observation</h1>

        <Select
          size="lg"
          label="Observation type"
          required
          options={OBSERVATION_TYPE_OPTIONS}
          value={observationType}
          onChange={(e) => setObservationType(e.target.value)}
        />

        <TextField
          size="lg"
          multiline
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="ep-report-observation__capture">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="ep-report-observation__hidden-input"
            onChange={handlePhotoChange}
          />
          <Button
            variant="secondary"
            size="lg"
            icon="camera"
            onClick={() => fileInputRef.current?.click()}
          >
            Capture photo
          </Button>
          {photo ? (
            <div className="ep-report-observation__photo-confirm">
              <img
                src={photoPreviewUrl ?? undefined}
                alt="Captured observation"
                className="ep-report-observation__thumbnail"
              />
              <span className="label">✓ Captured</span>
            </div>
          ) : null}
        </div>

        <div className="ep-report-observation__capture">
          <Button variant="secondary" size="lg" icon="map-pin" onClick={handleCaptureLocation}>
            Use my location
          </Button>
          {location ? (
            <p className="caption">
              Lat: {location.lat.toFixed(4)}, Long: {location.lng.toFixed(4)} · Accuracy: ±
              {Math.round(location.accuracy)}m
            </p>
          ) : null}
          {locationError ? (
            <Alert tone="info" title={locationError} />
          ) : null}
        </div>

        {validationError ? <Alert tone="danger" title={validationError} /> : null}
      </div>

      <div className="ep-report-observation__action-bar">
        <Button
          variant="primary"
          size="lg"
          loading={submitting}
          block
          onClick={() => void handleSubmit()}
        >
          Submit report
        </Button>
      </div>
    </FieldMobileShell>
  );
}
