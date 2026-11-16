import * as React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  PageHeader,
  Card,
  TextField,
  Select,
  Button,
  Alert,
  type SelectOption,
} from '@epmp/design-system';
import { apiGet, apiPatch, apiPost, ApiRequestError } from '../../lib/api-client';

/**
 * F8 S8.4 — SSO configuration. The screen's entire reason for existing per
 * the FRD's Validation rule: "no untested IdP config goes live." The
 * client-side gate below is a UX convenience, not the security boundary —
 * 01-07's PATCH /api/v1/admin/sso-config re-verifies IdP reachability
 * server-side unconditionally (see T-01-27 in this plan's threat model,
 * mirroring 01-11's T-01-24 pattern for role-permission edits).
 */

type Protocol = 'SAML2' | 'OIDC';

interface AttributeMapping {
  email_attr: string;
  name_attr: string;
  group_attr: string;
}

interface GroupRoleMapping {
  idp_group: string;
  role_id: string;
}

interface SsoConfigResponse {
  id: string;
  protocol: Protocol;
  idp_metadata_url: string | null;
  idp_metadata_xml: string | null;
  attribute_mapping: AttributeMapping;
  group_to_role_mapping: GroupRoleMapping[];
  tested_at: string | null;
  active: boolean;
}

interface TestResult {
  success: boolean;
  details: string;
}

interface RoleListItem {
  id: string;
  name: string;
}

const PROTOCOL_OPTIONS: SelectOption[] = [
  { value: 'OIDC', label: 'OIDC' },
  { value: 'SAML2', label: 'SAML2' },
];

/** Stable, order-independent JSON snapshot of the fields a Test-connection
 * call actually validates and a Save would persist — used as the
 * fingerprint comparison that closes "test once, then silently change the
 * URL before saving." */
function buildFingerprint(fields: {
  protocol: Protocol;
  idpMetadataUrl: string;
  idpMetadataXml: string;
  attributeMapping: AttributeMapping;
  groupToRoleMapping: GroupRoleMapping[];
}): string {
  return JSON.stringify(fields);
}

export function SsoConfigForm(): JSX.Element {
  const queryClient = useQueryClient();

  const { data: existingConfig } = useQuery({
    queryKey: ['sso-config'],
    queryFn: () => apiGet<SsoConfigResponse>('/api/v1/admin/sso-config'),
    retry: false,
  });

  const { data: rolesData } = useQuery({
    queryKey: ['roles-for-sso-mapping'],
    queryFn: () => apiGet<RoleListItem[]>('/api/v1/admin/roles'),
  });

  const [protocol, setProtocol] = React.useState<Protocol>('OIDC');
  const [idpMetadataUrl, setIdpMetadataUrl] = React.useState('');
  const [idpMetadataXml, setIdpMetadataXml] = React.useState('');
  const [emailAttr, setEmailAttr] = React.useState('email');
  const [nameAttr, setNameAttr] = React.useState('name');
  const [groupAttr, setGroupAttr] = React.useState('groups');
  const [groupMappings, setGroupMappings] = React.useState<GroupRoleMapping[]>([
    { idp_group: '', role_id: '' },
  ]);

  const [testPending, setTestPending] = React.useState(false);
  const [testResult, setTestResult] = React.useState<TestResult | null>(null);
  // The fingerprint of the form values at the moment Test connection last
  // returned success:true. Save is enabled only while the CURRENT form's
  // fingerprint still matches this one — any edit afterward invalidates it.
  const [lastTestedFingerprint, setLastTestedFingerprint] = React.useState<string | null>(null);

  const [savePending, setSavePending] = React.useState(false);
  const [saveError, setSaveError] = React.useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  // Prefill from the existing config once loaded, without clobbering
  // in-progress edits on an unrelated re-fetch.
  const hasPrefilledRef = React.useRef(false);
  React.useEffect(() => {
    if (existingConfig && !hasPrefilledRef.current) {
      hasPrefilledRef.current = true;
      setProtocol(existingConfig.protocol);
      setIdpMetadataUrl(existingConfig.idp_metadata_url ?? '');
      setIdpMetadataXml(existingConfig.idp_metadata_xml ?? '');
      setEmailAttr(existingConfig.attribute_mapping?.email_attr ?? 'email');
      setNameAttr(existingConfig.attribute_mapping?.name_attr ?? 'name');
      setGroupAttr(existingConfig.attribute_mapping?.group_attr ?? 'groups');
      setGroupMappings(
        existingConfig.group_to_role_mapping?.length
          ? existingConfig.group_to_role_mapping
          : [{ idp_group: '', role_id: '' }],
      );
    }
  }, [existingConfig]);

  const attributeMapping: AttributeMapping = {
    email_attr: emailAttr,
    name_attr: nameAttr,
    group_attr: groupAttr,
  };

  const currentFingerprint = buildFingerprint({
    protocol,
    idpMetadataUrl,
    idpMetadataXml,
    attributeMapping,
    groupToRoleMapping: groupMappings,
  });

  // Save re-disables the instant any field changes after a successful test —
  // comparing fingerprints is what closes the "test once, edit, save
  // untested" loophole the FRD calls out.
  const saveEnabled =
    testResult?.success === true && lastTestedFingerprint === currentFingerprint;

  const roleOptions: SelectOption[] = (rolesData ?? []).map((r) => ({
    value: r.id,
    label: r.name,
  }));

  function invalidateTestResult() {
    // Any field edit after a test invalidates the gate — this handler is
    // wired to every field's onChange below.
    setTestResult(null);
  }

  async function handleTestConnection() {
    setTestPending(true);
    setSaveError(null);
    try {
      const result = await apiPost<TestResult>('/api/v1/admin/sso-config/test', {
        protocol,
        idp_metadata_url: protocol === 'OIDC' ? idpMetadataUrl : undefined,
        idp_metadata_xml: protocol === 'SAML2' ? idpMetadataXml : undefined,
      });
      setTestResult(result);
      if (result.success) {
        setLastTestedFingerprint(currentFingerprint);
      } else {
        setLastTestedFingerprint(null);
      }
    } catch (err) {
      const message =
        err instanceof ApiRequestError ? err.body.message : 'Test connection failed unexpectedly.';
      setTestResult({ success: false, details: message });
      setLastTestedFingerprint(null);
    } finally {
      setTestPending(false);
    }
  }

  async function handleSave() {
    setSavePending(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      await apiPatch('/api/v1/admin/sso-config', {
        protocol,
        idp_metadata_url: protocol === 'OIDC' ? idpMetadataUrl : undefined,
        idp_metadata_xml: protocol === 'SAML2' ? idpMetadataXml : undefined,
        attribute_mapping: attributeMapping,
        group_to_role_mapping: groupMappings.filter((m) => m.idp_group && m.role_id),
        active: true,
      });
      setSaveSuccess(true);
      await queryClient.invalidateQueries({ queryKey: ['sso-config'] });
    } catch (err) {
      if (err instanceof ApiRequestError && err.body.error_code === 'SSO_CONFIG_INVALID') {
        // Server-side re-verification caught a race (e.g. the IdP went
        // down between the client Test and this Save) — the FRD's exact
        // message, and the gate re-disables since this config is now
        // known-untested-and-failing.
        setSaveError(err.body.message);
        setTestResult(null);
        setLastTestedFingerprint(null);
      } else {
        setSaveError(
          err instanceof ApiRequestError ? err.body.message : 'Could not save SSO configuration.',
        );
      }
    } finally {
      setSavePending(false);
    }
  }

  function updateGroupMapping(index: number, patch: Partial<GroupRoleMapping>) {
    invalidateTestResult();
    setGroupMappings((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function addGroupMapping() {
    setGroupMappings((prev) => [...prev, { idp_group: '', role_id: '' }]);
  }

  return (
    <div>
      <PageHeader title="SSO configuration" crumbs={[{ label: 'Admin' }, { label: 'SSO configuration' }]} />

      <div style={{ maxWidth: 560 }}>
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Select
            label="Protocol"
            options={PROTOCOL_OPTIONS}
            value={protocol}
            onChange={(e) => {
              invalidateTestResult();
              setProtocol(e.target.value as Protocol);
            }}
          />

          {protocol === 'OIDC' ? (
            <TextField
              label="IdP metadata URL"
              hint="The OIDC discovery document URL (e.g. https://idp.example.org/.well-known/openid-configuration)"
              value={idpMetadataUrl}
              onChange={(e) => {
                invalidateTestResult();
                setIdpMetadataUrl(e.target.value);
              }}
              required
            />
          ) : (
            <TextField
              label="IdP metadata XML"
              hint="Paste the SAML2 EntityDescriptor XML document"
              multiline
              rows={6}
              value={idpMetadataXml}
              onChange={(e) => {
                invalidateTestResult();
                setIdpMetadataXml(e.target.value);
              }}
              required
            />
          )}

          <TextField
            label="Email attribute"
            value={emailAttr}
            onChange={(e) => {
              invalidateTestResult();
              setEmailAttr(e.target.value);
            }}
            required
          />
          <TextField
            label="Name attribute"
            value={nameAttr}
            onChange={(e) => {
              invalidateTestResult();
              setNameAttr(e.target.value);
            }}
            required
          />
          <TextField
            label="Group attribute"
            value={groupAttr}
            onChange={(e) => {
              invalidateTestResult();
              setGroupAttr(e.target.value);
            }}
            required
          />

          <div>
            <p className="overline" style={{ marginBottom: 'var(--space-2)' }}>
              Group → role mapping
            </p>
            {groupMappings.map((mapping, index) => (
              <div
                key={index}
                style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}
              >
                <TextField
                  label={`IdP group ${index + 1}`}
                  value={mapping.idp_group}
                  onChange={(e) => updateGroupMapping(index, { idp_group: e.target.value })}
                />
                <Select
                  label={`Role ${index + 1}`}
                  options={[{ value: '', label: 'Select a role' }, ...roleOptions]}
                  value={mapping.role_id}
                  onChange={(e) => updateGroupMapping(index, { role_id: e.target.value })}
                />
              </div>
            ))}
            <Button variant="ghost" icon="plus" onClick={addGroupMapping}>
              Add mapping
            </Button>
          </div>

          {testResult ? (
            <Alert tone={testResult.success ? 'success' : 'danger'} title={testResult.details} />
          ) : null}

          {saveError ? <Alert tone="danger" title={saveError} /> : null}
          {saveSuccess ? <Alert tone="success" title="SSO configuration saved and activated." /> : null}

          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
            <Button variant="secondary" loading={testPending} onClick={handleTestConnection}>
              Test connection
            </Button>
            {/* Save configuration starts disabled and stays disabled until a
                Test connection call against the EXACT current form values
                has returned success:true — tracked via the fingerprint
                comparison above. This is the screen's entire reason for
                existing (FRD: "no untested IdP config goes live"). The
                real security boundary is 01-07's server-side re-verification
                on PATCH, not this disabled attribute — see this plan's
                threat model (T-01-27). */}
            <Button
              variant="primary"
              disabled={!saveEnabled}
              loading={savePending}
              onClick={handleSave}
            >
              Save configuration
            </Button>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
}
