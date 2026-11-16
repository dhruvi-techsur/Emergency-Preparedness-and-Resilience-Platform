package epmp.authz

import future.keywords.in

default allow = false

# role_permissions is pushed into OPA's *data* document (not passed as part of
# input) via PUT /v1/data/role_permissions, keyed {role_id: {feature: [actions]}}.
# Per-request input is only {role_id, feature, action} — no caching of a
# revoked/changed permission across requests, since data is re-synced whenever
# role_permissions changes (see backend/src/modules/auth-org/opa-client.ts).
allow {
	actions := data.role_permissions[input.role_id][input.feature]
	input.action in actions
}
