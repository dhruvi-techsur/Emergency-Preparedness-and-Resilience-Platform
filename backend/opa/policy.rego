package epmp.authz

import future.keywords.in

default allow = false

allow {
	some rp in input.role_permissions
	rp.role_id == input.role_id
	rp.feature == input.feature
	input.action in rp.actions
}
