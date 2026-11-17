---
phase: 02
gate_status: passed
build_command: "rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc"
test_command: "rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc"
last_updated: 2026-11-17T11:21:59Z
tests_disabled_during_fixes: none
shadowed_sources: 0
review_blockers_open: 0
boot_smoke: pass
browser_suite: pass
browser_headroom_mb: 8980
browser_headroom_naive_mb: 5239
waves:
  - wave: 1
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 2
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 3
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 4
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 5
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 6
    build: pass
    tests: pass
    fix_attempts: 0
---

## Wave 1

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794834150483,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45355","remoteAddress":"127.0.0.1","remotePort":58680},"msg":"incoming request"}
{"level":30,"time":1794834150486,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:36683","remoteAddress":"127.0.0.1","remotePort":56564},"msg":"incoming request"}
{"level":30,"time":1794834150490,"pid":36919,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:34543","remoteAddress":"127.0.0.1","remotePort":45946},"msg":"incoming request"}
{"level":30,"time":1794834150493,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":6.722231999999963,"msg":"request completed"}
{"level":30,"time":1794834150496,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:33721","remoteAddress":"127.0.0.1","remotePort":32882},"msg":"incoming request"}
{"level":30,"time":1794834150500,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":16.289626999999996,"msg":"request completed"}
{"level":30,"time":1794834150500,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.7948939999999993,"msg":"request completed"}
{"level":30,"time":1794834150502,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41591","remoteAddress":"127.0.0.1","remotePort":34822},"msg":"incoming request"}
{"level":30,"time":1794834150503,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/3b72e8ad-2ca4-4ed1-8af9-66fde2c805e6/timeline","host":"127.0.0.1:42319","remoteAddress":"127.0.0.1","remotePort":45320},"msg":"incoming request"}
{"level":30,"time":1794834150505,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.742943999999966,"msg":"request completed"}
{"level":30,"time":1794834150506,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1887550000000147,"msg":"request completed"}
{"level":30,"time":1794834150506,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/ecb78598-29e7-40d3-9324-e471760ec64e","host":"127.0.0.1:38101","remoteAddress":"127.0.0.1","remotePort":34612},"msg":"incoming request"}
{"level":30,"time":1794834150508,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33999","remoteAddress":"127.0.0.1","remotePort":48766},"msg":"incoming request"}
{"level":30,"time":1794834150509,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":2.9285189999999943,"msg":"request completed"}
{"level":30,"time":1794834150510,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45485","remoteAddress":"127.0.0.1","remotePort":38012},"msg":"incoming request"}
{"level":30,"time":1794834150511,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5167930000000069,"msg":"request completed"}
{"level":30,"time":1794834150512,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:40041","remoteAddress":"127.0.0.1","remotePort":42254},"msg":"incoming request"}
{"level":30,"time":1794834150519,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":201},"responseTime":10.509601999999973,"msg":"request completed"}
{"level":30,"time":1794834150520,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":403},"responseTime":1.4585090000000491,"msg":"request completed"}
{"level":30,"time":1794834150520,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45007","remoteAddress":"127.0.0.1","remotePort":43442},"msg":"incoming request"}
{"level":30,"time":1794834150521,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/7d5be51b-398b-4670-865c-7c62122625d3","host":"127.0.0.1:40489","remoteAddress":"127.0.0.1","remotePort":44184},"msg":"incoming request"}
{"level":30,"time":1794834150522,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":409},"responseTime":1.8456800000000158,"msg":"request completed"}
{"level":30,"time":1794834150523,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44093","remoteAddress":"127.0.0.1","remotePort":58806},"msg":"incoming request"}
{"level":30,"time":1794834150525,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":3.9663249999999834,"msg":"request completed"}
{"level":30,"time":1794834150526,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41501","remoteAddress":"127.0.0.1","remotePort":33040},"msg":"incoming request"}
{"level":30,"time":1794834150526,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":201},"responseTime":3.179145999999946,"msg":"request completed"}
{"level":30,"time":1794834150528,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33797","remoteAddress":"127.0.0.1","remotePort":33170},"msg":"incoming request"}
{"level":30,"time":1794834150528,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.530627999999979,"msg":"request completed"}
{"level":30,"time":1794834150530,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=d4210f50-0066-4d1c-9db5-2543378b78f9&page_size=50","host":"127.0.0.1:35883","remoteAddress":"127.0.0.1","remotePort":54432},"msg":"incoming request"}
{"level":30,"time":1794834150531,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":201},"responseTime":2.678553000000022,"msg":"request completed"}
{"level":30,"time":1794834150531,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35719","remoteAddress":"127.0.0.1","remotePort":55694},"msg":"incoming request"}
{"level":30,"time":1794834150532,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":1.6373829999999998,"msg":"request completed"}
{"level":30,"time":1794834150533,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42135","remoteAddress":"127.0.0.1","remotePort":45026},"msg":"incoming request"}
{"level":30,"time":1794834150534,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":201},"responseTime":2.6970779999999763,"msg":"request completed"}
{"level":30,"time":1794834150535,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":403},"responseTime":1.3051529999999616,"msg":"request completed"}
{"level":30,"time":1794834150535,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45675","remoteAddress":"127.0.0.1","remotePort":44710},"msg":"incoming request"}
{"level":30,"time":1794834150536,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:42893","remoteAddress":"127.0.0.1","remotePort":49778},"msg":"incoming request"}
{"level":30,"time":1794834150537,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":1.471383000000003,"msg":"request completed"}
{"level":30,"time":1794834150538,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":201},"responseTime":2.5251870000000167,"msg":"request completed"}
{"level":30,"time":1794834150538,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:44573","remoteAddress":"127.0.0.1","remotePort":58034},"msg":"incoming request"}
{"level":30,"time":1794834150539,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:40889","remoteAddress":"127.0.0.1","remotePort":56894},"msg":"incoming request"}
{"level":30,"time":1794834150540,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":422},"responseTime":1.9281839999999875,"msg":"request completed"}
{"level":30,"time":1794834150541,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:41909","remoteAddress":"127.0.0.1","remotePort":58228},"msg":"incoming request"}
{"level":30,"time":1794834150541,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.0680150000000026,"msg":"request completed"}
{"level":30,"time":1794834150543,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":200},"responseTime":1.6261220000000094,"msg":"request completed"}
{"level":30,"time":1794834150543,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40855","remoteAddress":"127.0.0.1","remotePort":41610},"msg":"incoming request"}
{"level":30,"time":1794834150543,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=d4210f50-0066-4d1c-9db5-2543378b78f9&action_type=record_view","host":"127.0.0.1:39709","remoteAddress":"127.0.0.1","remotePort":49082},"msg":"incoming request"}
{"level":30,"time":1794834150545,"pid":36920,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":200},"responseTime":1.5040239999999585,"msg":"request completed"}
{"level":30,"time":1794834150545,"pid":36921,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":201},"responseTime":2.7934769999999958,"msg":"request completed"}
{"level":30,"time":1794834150547,"pid":36919,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":56.899801000000025,"msg":"request completed"}
{"level":30,"time":1794834150754,"pid":36919,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:46247","remoteAddress":"127.0.0.1","remotePort":49066},"msg":"incoming request"}
{"level":30,"time":1794834150757,"pid":36919,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.9413339999999835,"msg":"request completed"}
{"level":30,"time":1794834150784,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34141","remoteAddress":"127.0.0.1","remotePort":43714},"msg":"incoming request"}
{"level":30,"time":1794834150786,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:41827","remoteAddress":"127.0.0.1","remotePort":58634},"msg":"incoming request"}
{"level":30,"time":1794834150789,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":5.440641999999997,"msg":"request completed"}
{"level":30,"time":1794834150792,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38447","remoteAddress":"127.0.0.1","remotePort":59722},"msg":"incoming request"}
{"level":30,"time":1794834150793,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.2336349999999925,"msg":"request completed"}
{"level":30,"time":1794834150794,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:40655","remoteAddress":"127.0.0.1","remotePort":40156},"msg":"incoming request"}
{"level":30,"time":1794834150798,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":3.346919000000014,"msg":"request completed"}
{"level":30,"time":1794834150799,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42681","remoteAddress":"127.0.0.1","remotePort":33104},"msg":"incoming request"}
{"level":30,"time":1794834150802,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":2.725069999999988,"msg":"request completed"}
{"level":30,"time":1794834150803,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39103","remoteAddress":"127.0.0.1","remotePort":36994},"msg":"incoming request"}
{"level":30,"time":1794834150805,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.938683999999995,"msg":"request completed"}
{"level":30,"time":1794834150806,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33419","remoteAddress":"127.0.0.1","remotePort":60384},"msg":"incoming request"}
{"level":30,"time":1794834150807,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.49213799999998287,"msg":"request completed"}
{"level":30,"time":1794834150808,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:43081","remoteAddress":"127.0.0.1","remotePort":57380},"msg":"incoming request"}
{"level":30,"time":1794834150810,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.7019730000000095,"msg":"request completed"}
{"level":30,"time":1794834150811,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:44395","remoteAddress":"127.0.0.1","remotePort":51804},"msg":"incoming request"}
{"level":30,"time":1794834150813,"pid":36961,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":1.185479999999984,"msg":"request completed"}
{"level":30,"time":1794834150815,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":28.886048000000017,"msg":"request completed"}
{"level":30,"time":1794834150818,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:42735","remoteAddress":"127.0.0.1","remotePort":48276},"msg":"incoming request"}
{"level":30,"time":1794834150821,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.978313000000014,"msg":"request completed"}
{"level":30,"time":1794834150823,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:40569","remoteAddress":"127.0.0.1","remotePort":37870},"msg":"incoming request"}
{"level":30,"time":1794834150824,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7351449999999886,"msg":"request completed"}
{"level":30,"time":1794834150825,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:35499","remoteAddress":"127.0.0.1","remotePort":57560},"msg":"incoming request"}
{"level":30,"time":1794834150829,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.2463220000000206,"msg":"request completed"}
{"level":30,"time":1794834150830,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/d2076b7d-ff6b-4f98-bc0d-55836175d8ad/revoke","host":"127.0.0.1:34027","remoteAddress":"127.0.0.1","remotePort":47860},"msg":"incoming request"}
{"level":30,"time":1794834150833,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":204},"responseTime":2.7028890000000274,"msg":"request completed"}
{"level":30,"time":1794834150835,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:45719","remoteAddress":"127.0.0.1","remotePort":34230},"msg":"incoming request"}
{"level":30,"time":1794834150838,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.2837369999999737,"msg":"request completed"}
{"level":30,"time":1794834150839,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:38311","remoteAddress":"127.0.0.1","remotePort":54856},"msg":"incoming request"}
{"level":30,"time":1794834150840,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6126370000000065,"msg":"request completed"}
{"level":30,"time":1794834150841,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44207","remoteAddress":"127.0.0.1","remotePort":50774},"msg":"incoming request"}
{"level":30,"time":1794834150843,"pid":36960,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9272829999999885,"msg":"request completed"}

 Test Files  5 passed (5)
      Tests  26 passed (26)
   Start at  13:02:30
   Duration  699ms (transform 248ms, setup 30ms, import 891ms, tests 773ms, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 68[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 139[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 110[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 193[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 101[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 13:02:31
[2m   Duration [22m 1.05s[2m (transform 212ms, setup 208ms, collect 727ms, tests 611ms, environment 1.10s, prepare 130ms)[22m
```

## Wave 2

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794834672996,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37371","remoteAddress":"127.0.0.1","remotePort":43032},"msg":"incoming request"}
{"level":30,"time":1794834672997,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35705","remoteAddress":"127.0.0.1","remotePort":42010},"msg":"incoming request"}
{"level":30,"time":1794834673006,"pid":55006,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:40903","remoteAddress":"127.0.0.1","remotePort":52766},"msg":"incoming request"}
{"level":30,"time":1794834673015,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":17.994719000000032,"msg":"request completed"}
{"level":30,"time":1794834673018,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/d930ea6c-b32d-498c-bdde-70d1441c3b92/timeline","host":"127.0.0.1:43781","remoteAddress":"127.0.0.1","remotePort":50680},"msg":"incoming request"}
{"level":30,"time":1794834673021,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.9183010000000422,"msg":"request completed"}
{"level":30,"time":1794834673024,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38591","remoteAddress":"127.0.0.1","remotePort":42708},"msg":"incoming request"}
{"level":30,"time":1794834673026,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":29.62135999999998,"msg":"request completed"}
{"level":30,"time":1794834673028,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":201},"responseTime":4.047014999999988,"msg":"request completed"}
{"level":30,"time":1794834673028,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:42637","remoteAddress":"127.0.0.1","remotePort":44792},"msg":"incoming request"}
{"level":30,"time":1794834673029,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36327","remoteAddress":"127.0.0.1","remotePort":41730},"msg":"incoming request"}
{"level":30,"time":1794834673030,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":409},"responseTime":1.6410510000000045,"msg":"request completed"}
{"level":30,"time":1794834673031,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.631906000000015,"msg":"request completed"}
{"level":30,"time":1794834673031,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35127","remoteAddress":"127.0.0.1","remotePort":38048},"msg":"incoming request"}
{"level":30,"time":1794834673033,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43343","remoteAddress":"127.0.0.1","remotePort":45162},"msg":"incoming request"}
{"level":30,"time":1794834673034,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7640119999999797,"msg":"request completed"}
{"level":30,"time":1794834673035,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":201},"responseTime":3.1945089999999823,"msg":"request completed"}
{"level":30,"time":1794834673036,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:32897","remoteAddress":"127.0.0.1","remotePort":35572},"msg":"incoming request"}
{"level":30,"time":1794834673037,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34603","remoteAddress":"127.0.0.1","remotePort":46746},"msg":"incoming request"}
{"level":30,"time":1794834673039,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.633921999999984,"msg":"request completed"}
{"level":30,"time":1794834673040,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":201},"responseTime":3.612912999999992,"msg":"request completed"}
{"level":30,"time":1794834673041,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/f0c5c2b8-e6dd-4a21-b586-04877ff18a7d/revoke","host":"127.0.0.1:37805","remoteAddress":"127.0.0.1","remotePort":60596},"msg":"incoming request"}
{"level":30,"time":1794834673041,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34645","remoteAddress":"127.0.0.1","remotePort":57188},"msg":"incoming request"}
{"level":30,"time":1794834673044,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":201},"responseTime":2.8558059999999728,"msg":"request completed"}
{"level":30,"time":1794834673044,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":204},"responseTime":2.987370999999996,"msg":"request completed"}
{"level":30,"time":1794834673045,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45277","remoteAddress":"127.0.0.1","remotePort":52072},"msg":"incoming request"}
{"level":30,"time":1794834673046,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36025","remoteAddress":"127.0.0.1","remotePort":54730},"msg":"incoming request"}
{"level":30,"time":1794834673049,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":201},"responseTime":3.4072660000000496,"msg":"request completed"}
{"level":30,"time":1794834673049,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.6944619999999873,"msg":"request completed"}
{"level":30,"time":1794834673050,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:43073","remoteAddress":"127.0.0.1","remotePort":50090},"msg":"incoming request"}
{"level":30,"time":1794834673050,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34567","remoteAddress":"127.0.0.1","remotePort":49404},"msg":"incoming request"}
{"level":30,"time":1794834673051,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4895779999999945,"msg":"request completed"}
{"level":30,"time":1794834673052,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.217940999999996,"msg":"request completed"}
{"level":30,"time":1794834673053,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40255","remoteAddress":"127.0.0.1","remotePort":40418},"msg":"incoming request"}
{"level":30,"time":1794834673054,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43601","remoteAddress":"127.0.0.1","remotePort":48632},"msg":"incoming request"}
{"level":30,"time":1794834673055,"pid":55007,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9657190000000355,"msg":"request completed"}
{"level":30,"time":1794834673057,"pid":55005,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":201},"responseTime":3.5015539999999987,"msg":"request completed"}
{"level":30,"time":1794834673059,"pid":55006,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":51.63737499999996,"msg":"request completed"}
{"level":30,"time":1794834673266,"pid":55006,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:45545","remoteAddress":"127.0.0.1","remotePort":35154},"msg":"incoming request"}
{"level":30,"time":1794834673269,"pid":55006,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.0702870000000075,"msg":"request completed"}
{"level":30,"time":1794834673301,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41275","remoteAddress":"127.0.0.1","remotePort":40590},"msg":"incoming request"}
{"level":30,"time":1794834673304,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:34017","remoteAddress":"127.0.0.1","remotePort":44880},"msg":"incoming request"}
{"level":30,"time":1794834673312,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":6.1230600000000095,"msg":"request completed"}
{"level":30,"time":1794834673315,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:44763","remoteAddress":"127.0.0.1","remotePort":43936},"msg":"incoming request"}
{"level":30,"time":1794834673316,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":14.519465000000025,"msg":"request completed"}
{"level":30,"time":1794834673318,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/activation","host":"127.0.0.1:38447","remoteAddress":"127.0.0.1","remotePort":46482},"msg":"incoming request"}
{"level":30,"time":1794834673318,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.7736119999999858,"msg":"request completed"}
{"level":30,"time":1794834673320,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45771","remoteAddress":"127.0.0.1","remotePort":55844},"msg":"incoming request"}
{"level":30,"time":1794834673321,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":422},"responseTime":2.7954819999999927,"msg":"request completed"}
{"level":30,"time":1794834673322,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922","host":"127.0.0.1:42613","remoteAddress":"127.0.0.1","remotePort":33560},"msg":"incoming request"}
{"level":30,"time":1794834673323,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.441139000000021,"msg":"request completed"}
{"level":30,"time":1794834673324,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/91fefa8e-1ccf-490b-8e0f-584e89c99d5f","host":"127.0.0.1:37383","remoteAddress":"127.0.0.1","remotePort":41682},"msg":"incoming request"}
{"level":30,"time":1794834673325,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.5661629999999604,"msg":"request completed"}
{"level":30,"time":1794834673326,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/command-roles","host":"127.0.0.1:33489","remoteAddress":"127.0.0.1","remotePort":52292},"msg":"incoming request"}
{"level":30,"time":1794834673327,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":3.146769000000006,"msg":"request completed"}
{"level":30,"time":1794834673328,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39883","remoteAddress":"127.0.0.1","remotePort":38734},"msg":"incoming request"}
{"level":30,"time":1794834673329,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5802459999999883,"msg":"request completed"}
{"level":30,"time":1794834673329,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1812439999999924,"msg":"request completed"}
{"level":30,"time":1794834673330,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:44951","remoteAddress":"127.0.0.1","remotePort":56220},"msg":"incoming request"}
{"level":30,"time":1794834673330,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/activation","host":"127.0.0.1:42953","remoteAddress":"127.0.0.1","remotePort":41722},"msg":"incoming request"}
{"level":30,"time":1794834673332,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":403},"responseTime":1.4539210000000367,"msg":"request completed"}
{"level":30,"time":1794834673333,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/7d5be51b-398b-4670-865c-7c62122625d3","host":"127.0.0.1:42187","remoteAddress":"127.0.0.1","remotePort":34338},"msg":"incoming request"}
{"level":30,"time":1794834673334,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":3.2716630000000464,"msg":"request completed"}
{"level":30,"time":1794834673335,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/timeline","host":"127.0.0.1:33855","remoteAddress":"127.0.0.1","remotePort":41348},"msg":"incoming request"}
{"level":30,"time":1794834673336,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":3.6922910000000115,"msg":"request completed"}
{"level":30,"time":1794834673337,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9980899999999906,"msg":"request completed"}
{"level":30,"time":1794834673337,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37603","remoteAddress":"127.0.0.1","remotePort":56828},"msg":"incoming request"}
{"level":30,"time":1794834673338,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/activation","host":"127.0.0.1:32791","remoteAddress":"127.0.0.1","remotePort":50210},"msg":"incoming request"}
{"level":30,"time":1794834673339,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":400},"responseTime":1.1672250000000304,"msg":"request completed"}
{"level":30,"time":1794834673340,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5394730000000436,"msg":"request completed"}
{"level":30,"time":1794834673340,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922","host":"127.0.0.1:43921","remoteAddress":"127.0.0.1","remotePort":34520},"msg":"incoming request"}
{"level":30,"time":1794834673341,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=dcc399a6-dd09-4422-8b90-ceed3e25c906&page_size=50","host":"127.0.0.1:36855","remoteAddress":"127.0.0.1","remotePort":35954},"msg":"incoming request"}
{"level":30,"time":1794834673343,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.183296999999982,"msg":"request completed"}
{"level":30,"time":1794834673343,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9561410000000024,"msg":"request completed"}
{"level":30,"time":1794834673344,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/command-roles","host":"127.0.0.1:46129","remoteAddress":"127.0.0.1","remotePort":60382},"msg":"incoming request"}
{"level":30,"time":1794834673345,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41297","remoteAddress":"127.0.0.1","remotePort":52614},"msg":"incoming request"}
{"level":30,"time":1794834673347,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":403},"responseTime":1.676007000000027,"msg":"request completed"}
{"level":30,"time":1794834673347,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":201},"responseTime":3.1268519999999853,"msg":"request completed"}
{"level":30,"time":1794834673348,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:34167","remoteAddress":"127.0.0.1","remotePort":50586},"msg":"incoming request"}
{"level":30,"time":1794834673348,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/timeline","host":"127.0.0.1:40737","remoteAddress":"127.0.0.1","remotePort":42892},"msg":"incoming request"}
{"level":30,"time":1794834673350,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":1.9683440000000019,"msg":"request completed"}
{"level":30,"time":1794834673351,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":200},"responseTime":2.230944999999963,"msg":"request completed"}
{"level":30,"time":1794834673351,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:33503","remoteAddress":"127.0.0.1","remotePort":51840},"msg":"incoming request"}
{"level":30,"time":1794834673352,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/closure","host":"127.0.0.1:36759","remoteAddress":"127.0.0.1","remotePort":52586},"msg":"incoming request"}
{"level":30,"time":1794834673354,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":422},"responseTime":2.464121999999975,"msg":"request completed"}
{"level":30,"time":1794834673355,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:43239","remoteAddress":"127.0.0.1","remotePort":57276},"msg":"incoming request"}
{"level":30,"time":1794834673356,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":4.09217799999999,"msg":"request completed"}
{"level":30,"time":1794834673357,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/afa0bffb-0bb7-4ad6-a3d3-ce1cca686922/timeline","host":"127.0.0.1:41019","remoteAddress":"127.0.0.1","remotePort":33584},"msg":"incoming request"}
{"level":30,"time":1794834673357,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":200},"responseTime":2.266391999999996,"msg":"request completed"}
{"level":30,"time":1794834673358,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=dcc399a6-dd09-4422-8b90-ceed3e25c906&action_type=record_view","host":"127.0.0.1:45025","remoteAddress":"127.0.0.1","remotePort":60024},"msg":"incoming request"}
{"level":30,"time":1794834673359,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":200},"responseTime":2.5693389999999567,"msg":"request completed"}
{"level":30,"time":1794834673360,"pid":55052,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":200},"responseTime":2.180361000000005,"msg":"request completed"}
{"level":30,"time":1794834673361,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40955","remoteAddress":"127.0.0.1","remotePort":58622},"msg":"incoming request"}
{"level":30,"time":1794834673366,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":201},"responseTime":4.544124999999951,"msg":"request completed"}
{"level":30,"time":1794834673367,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/96ff6641-978d-4d2d-aa1b-82479c24eb3f/command-roles","host":"127.0.0.1:42059","remoteAddress":"127.0.0.1","remotePort":59632},"msg":"incoming request"}
{"level":30,"time":1794834673370,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":201},"responseTime":3.05077,"msg":"request completed"}
{"level":30,"time":1794834673371,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/96ff6641-978d-4d2d-aa1b-82479c24eb3f/command-roles","host":"127.0.0.1:36753","remoteAddress":"127.0.0.1","remotePort":37478},"msg":"incoming request"}
{"level":30,"time":1794834673373,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","res":{"statusCode":201},"responseTime":2.2790860000000066,"msg":"request completed"}
{"level":30,"time":1794834673374,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/96ff6641-978d-4d2d-aa1b-82479c24eb3f/timeline","host":"127.0.0.1:37243","remoteAddress":"127.0.0.1","remotePort":38912},"msg":"incoming request"}
{"level":30,"time":1794834673377,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","res":{"statusCode":200},"responseTime":2.4198989999999867,"msg":"request completed"}
{"level":30,"time":1794834673378,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37395","remoteAddress":"127.0.0.1","remotePort":47180},"msg":"incoming request"}
{"level":30,"time":1794834673382,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","res":{"statusCode":201},"responseTime":3.3003669999999943,"msg":"request completed"}
{"level":30,"time":1794834673383,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/8c83ba2f-0ff1-41f2-99bd-264d1f391588/closure","host":"127.0.0.1:41655","remoteAddress":"127.0.0.1","remotePort":42014},"msg":"incoming request"}
{"level":30,"time":1794834673386,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","res":{"statusCode":200},"responseTime":2.8533499999999776,"msg":"request completed"}
{"level":30,"time":1794834673386,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/8c83ba2f-0ff1-41f2-99bd-264d1f391588/closure","host":"127.0.0.1:40793","remoteAddress":"127.0.0.1","remotePort":34542},"msg":"incoming request"}
{"level":30,"time":1794834673395,"pid":55044,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","res":{"statusCode":409},"responseTime":9.140807999999993,"msg":"request completed"}
{"level":30,"time":1794834673525,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36517","remoteAddress":"127.0.0.1","remotePort":33226},"msg":"incoming request"}
{"level":30,"time":1794834673531,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":4.839807999999977,"msg":"request completed"}
{"level":30,"time":1794834673533,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43865","remoteAddress":"127.0.0.1","remotePort":44906},"msg":"incoming request"}
{"level":30,"time":1794834673533,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18377299999997376,"msg":"request completed"}
{"level":30,"time":1794834673535,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:46409","remoteAddress":"127.0.0.1","remotePort":52142},"msg":"incoming request"}
{"level":30,"time":1794834673538,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.55401999999998,"msg":"request completed"}
{"level":30,"time":1794834673538,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42565","remoteAddress":"127.0.0.1","remotePort":38820},"msg":"incoming request"}
{"level":30,"time":1794834673540,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":1.8723340000000235,"msg":"request completed"}
{"level":30,"time":1794834673541,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33741","remoteAddress":"127.0.0.1","remotePort":48524},"msg":"incoming request"}
{"level":30,"time":1794834673543,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.540662999999995,"msg":"request completed"}
{"level":30,"time":1794834673544,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33863","remoteAddress":"127.0.0.1","remotePort":56190},"msg":"incoming request"}
{"level":30,"time":1794834673545,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.44094499999999925,"msg":"request completed"}
{"level":30,"time":1794834673546,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:46095","remoteAddress":"127.0.0.1","remotePort":32986},"msg":"incoming request"}
{"level":30,"time":1794834673548,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.42911399999997,"msg":"request completed"}
{"level":30,"time":1794834673549,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:45581","remoteAddress":"127.0.0.1","remotePort":49118},"msg":"incoming request"}
{"level":30,"time":1794834673550,"pid":55068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9377860000000169,"msg":"request completed"}

 Test Files  6 passed (6)
      Tests  29 passed (29)
   Start at  13:11:12
   Duration  899ms (transform 237ms, setup 33ms, import 1.07s, tests 910ms, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 50[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 104[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 107[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 185[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 100[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 13:11:13
[2m   Duration [22m 986ms[2m (transform 260ms, setup 128ms, collect 726ms, tests 547ms, environment 1.01s, prepare 125ms)[22m
```

## Wave 3

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 69 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m85.19 kB[22m[1m[22m[2m │ gzip: 19.92 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m55.18 kB[22m[1m[22m[2m │ gzip: 16.97 kB[22m
[32m✓ built in 173ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 110 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-B6vX45Hr.css  [39m[1m[2m 42.51 kB[22m[1m[22m[2m │ gzip:   7.22 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DA06m9Ud.js   [39m[1m[2m366.82 kB[22m[1m[22m[2m │ gzip: 109.69 kB[22m
[32m✓ built in 619ms[39m

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794835850853,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44571","remoteAddress":"127.0.0.1","remotePort":35620},"msg":"incoming request"}
{"level":30,"time":1794835850855,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:33455","remoteAddress":"127.0.0.1","remotePort":54390},"msg":"incoming request"}
{"level":30,"time":1794835850860,"pid":104291,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:36335","remoteAddress":"127.0.0.1","remotePort":33782},"msg":"incoming request"}
{"level":30,"time":1794835850861,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":6.129424999999969,"msg":"request completed"}
{"level":30,"time":1794835850864,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:39667","remoteAddress":"127.0.0.1","remotePort":53660},"msg":"incoming request"}
{"level":30,"time":1794835850869,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":4.473388999999997,"msg":"request completed"}
{"level":30,"time":1794835850870,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":16.572839999999985,"msg":"request completed"}
{"level":30,"time":1794835850871,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44547","remoteAddress":"127.0.0.1","remotePort":57136},"msg":"incoming request"}
{"level":30,"time":1794835850874,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.528602000000035,"msg":"request completed"}
{"level":30,"time":1794835850874,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/activation","host":"127.0.0.1:41043","remoteAddress":"127.0.0.1","remotePort":51776},"msg":"incoming request"}
{"level":30,"time":1794835850875,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/9fc7032c-26f4-4ded-b5d2-920a16c1c2a3","host":"127.0.0.1:37393","remoteAddress":"127.0.0.1","remotePort":59110},"msg":"incoming request"}
{"level":30,"time":1794835850877,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":422},"responseTime":2.896963000000028,"msg":"request completed"}
{"level":30,"time":1794835850878,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":2.9887259999999856,"msg":"request completed"}
{"level":30,"time":1794835850878,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148","host":"127.0.0.1:44641","remoteAddress":"127.0.0.1","remotePort":44010},"msg":"incoming request"}
{"level":30,"time":1794835850879,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36149","remoteAddress":"127.0.0.1","remotePort":48510},"msg":"incoming request"}
{"level":30,"time":1794835850879,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5489089999999806,"msg":"request completed"}
{"level":30,"time":1794835850881,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:39769","remoteAddress":"127.0.0.1","remotePort":34334},"msg":"incoming request"}
{"level":30,"time":1794835850881,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9102379999999926,"msg":"request completed"}
{"level":30,"time":1794835850882,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/command-roles","host":"127.0.0.1:46031","remoteAddress":"127.0.0.1","remotePort":38474},"msg":"incoming request"}
{"level":30,"time":1794835850882,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":403},"responseTime":1.3147160000000326,"msg":"request completed"}
{"level":30,"time":1794835850885,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":2.977222999999981,"msg":"request completed"}
{"level":30,"time":1794835850886,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/activation","host":"127.0.0.1:34329","remoteAddress":"127.0.0.1","remotePort":45680},"msg":"incoming request"}
{"level":30,"time":1794835850897,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/7d5be51b-398b-4670-865c-7c62122625d3","host":"127.0.0.1:36535","remoteAddress":"127.0.0.1","remotePort":48682},"msg":"incoming request"}
{"level":30,"time":1794835850899,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":13.192471000000012,"msg":"request completed"}
{"level":30,"time":1794835850900,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/timeline","host":"127.0.0.1:38819","remoteAddress":"127.0.0.1","remotePort":59692},"msg":"incoming request"}
{"level":30,"time":1794835850901,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":4.046910000000025,"msg":"request completed"}
{"level":30,"time":1794835850902,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41469","remoteAddress":"127.0.0.1","remotePort":35982},"msg":"incoming request"}
{"level":30,"time":1794835850903,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.5072720000000004,"msg":"request completed"}
{"level":30,"time":1794835850904,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5168199999999956,"msg":"request completed"}
{"level":30,"time":1794835850904,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/activation","host":"127.0.0.1:44735","remoteAddress":"127.0.0.1","remotePort":44712},"msg":"incoming request"}
{"level":30,"time":1794835850906,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":400},"responseTime":1.2901999999999703,"msg":"request completed"}
{"level":30,"time":1794835850906,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=2927d273-d59b-4f92-b7f5-d4ac371e26e2&page_size=50","host":"127.0.0.1:36173","remoteAddress":"127.0.0.1","remotePort":43732},"msg":"incoming request"}
{"level":30,"time":1794835850907,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148","host":"127.0.0.1:35475","remoteAddress":"127.0.0.1","remotePort":35630},"msg":"incoming request"}
{"level":30,"time":1794835850908,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7941249999999513,"msg":"request completed"}
{"level":30,"time":1794835850909,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0432109999999852,"msg":"request completed"}
{"level":30,"time":1794835850909,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41445","remoteAddress":"127.0.0.1","remotePort":45486},"msg":"incoming request"}
{"level":30,"time":1794835850910,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/command-roles","host":"127.0.0.1:39759","remoteAddress":"127.0.0.1","remotePort":47936},"msg":"incoming request"}
{"level":30,"time":1794835850910,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":403},"responseTime":1.1981670000000122,"msg":"request completed"}
{"level":30,"time":1794835850911,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:35263","remoteAddress":"127.0.0.1","remotePort":51638},"msg":"incoming request"}
{"level":30,"time":1794835850912,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":201},"responseTime":2.325010999999961,"msg":"request completed"}
{"level":30,"time":1794835850913,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":1.525371000000007,"msg":"request completed"}
{"level":30,"time":1794835850913,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/timeline","host":"127.0.0.1:35451","remoteAddress":"127.0.0.1","remotePort":50620},"msg":"incoming request"}
{"level":30,"time":1794835850914,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:35677","remoteAddress":"127.0.0.1","remotePort":35958},"msg":"incoming request"}
{"level":30,"time":1794835850915,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8466829999999845,"msg":"request completed"}
{"level":30,"time":1794835850916,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":422},"responseTime":1.9868060000000014,"msg":"request completed"}
{"level":30,"time":1794835850916,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/closure","host":"127.0.0.1:38455","remoteAddress":"127.0.0.1","remotePort":40034},"msg":"incoming request"}
{"level":30,"time":1794835850917,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37511","remoteAddress":"127.0.0.1","remotePort":43106},"msg":"incoming request"}
{"level":30,"time":1794835850918,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":200},"responseTime":1.718904000000009,"msg":"request completed"}
{"level":30,"time":1794835850920,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=2927d273-d59b-4f92-b7f5-d4ac371e26e2&action_type=record_view","host":"127.0.0.1:42145","remoteAddress":"127.0.0.1","remotePort":45146},"msg":"incoming request"}
{"level":30,"time":1794835850920,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":3.600461999999993,"msg":"request completed"}
{"level":30,"time":1794835850920,"pid":104291,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":59.843500000000006,"msg":"request completed"}
{"level":30,"time":1794835850920,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/00932e60-d9df-4ca0-9d7e-f82dcdd6b148/timeline","host":"127.0.0.1:43455","remoteAddress":"127.0.0.1","remotePort":41810},"msg":"incoming request"}
{"level":30,"time":1794835850921,"pid":104293,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":200},"responseTime":1.472200999999984,"msg":"request completed"}
{"level":30,"time":1794835850922,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":200},"responseTime":1.8875300000000266,"msg":"request completed"}
{"level":30,"time":1794835850924,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44611","remoteAddress":"127.0.0.1","remotePort":33258},"msg":"incoming request"}
{"level":30,"time":1794835850927,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":201},"responseTime":3.1791519999999878,"msg":"request completed"}
{"level":30,"time":1794835850928,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/b186ee5e-9bbe-4b2d-b3fe-b22ca371064a/command-roles","host":"127.0.0.1:37857","remoteAddress":"127.0.0.1","remotePort":40206},"msg":"incoming request"}
{"level":30,"time":1794835850930,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":201},"responseTime":2.267462000000023,"msg":"request completed"}
{"level":30,"time":1794835850931,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/b186ee5e-9bbe-4b2d-b3fe-b22ca371064a/command-roles","host":"127.0.0.1:33901","remoteAddress":"127.0.0.1","remotePort":38994},"msg":"incoming request"}
{"level":30,"time":1794835850933,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","res":{"statusCode":201},"responseTime":1.967739999999992,"msg":"request completed"}
{"level":30,"time":1794835850934,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/b186ee5e-9bbe-4b2d-b3fe-b22ca371064a/timeline","host":"127.0.0.1:46439","remoteAddress":"127.0.0.1","remotePort":45730},"msg":"incoming request"}
{"level":30,"time":1794835850935,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7463950000000068,"msg":"request completed"}
{"level":30,"time":1794835850936,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34369","remoteAddress":"127.0.0.1","remotePort":43028},"msg":"incoming request"}
{"level":30,"time":1794835850939,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","res":{"statusCode":201},"responseTime":2.943059000000005,"msg":"request completed"}
{"level":30,"time":1794835850940,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/9b56169e-2787-49b1-847a-bfcfe1b88182/closure","host":"127.0.0.1:43373","remoteAddress":"127.0.0.1","remotePort":34262},"msg":"incoming request"}
{"level":30,"time":1794835850943,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","res":{"statusCode":200},"responseTime":2.8371510000000058,"msg":"request completed"}
{"level":30,"time":1794835850944,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/9b56169e-2787-49b1-847a-bfcfe1b88182/closure","host":"127.0.0.1:33793","remoteAddress":"127.0.0.1","remotePort":36862},"msg":"incoming request"}
{"level":30,"time":1794835850946,"pid":104292,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","res":{"statusCode":409},"responseTime":2.0709130000000187,"msg":"request completed"}
{"level":30,"time":1794835851126,"pid":104291,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:44695","remoteAddress":"127.0.0.1","remotePort":45760},"msg":"incoming request"}
{"level":30,"time":1794835851130,"pid":104291,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.030212000000006,"msg":"request completed"}
{"level":30,"time":1794835851163,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43129","remoteAddress":"127.0.0.1","remotePort":35384},"msg":"incoming request"}
{"level":30,"time":1794835851177,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":14.171177,"msg":"request completed"}
{"level":30,"time":1794835851180,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/41a7c0cd-19ee-451f-b391-43b2a7d1c78e/timeline","host":"127.0.0.1:37345","remoteAddress":"127.0.0.1","remotePort":47120},"msg":"incoming request"}
{"level":30,"time":1794835851183,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.861114999999984,"msg":"request completed"}
{"level":30,"time":1794835851185,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39205","remoteAddress":"127.0.0.1","remotePort":46610},"msg":"incoming request"}
{"level":30,"time":1794835851188,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":201},"responseTime":3.480707999999993,"msg":"request completed"}
{"level":30,"time":1794835851189,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38749","remoteAddress":"127.0.0.1","remotePort":54450},"msg":"incoming request"}
{"level":30,"time":1794835851189,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:42669","remoteAddress":"127.0.0.1","remotePort":41030},"msg":"incoming request"}
{"level":30,"time":1794835851191,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":409},"responseTime":1.8542170000000056,"msg":"request completed"}
{"level":30,"time":1794835851193,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42797","remoteAddress":"127.0.0.1","remotePort":41520},"msg":"incoming request"}
{"level":30,"time":1794835851197,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":201},"responseTime":3.740205000000003,"msg":"request completed"}
{"level":30,"time":1794835851198,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35089","remoteAddress":"127.0.0.1","remotePort":44060},"msg":"incoming request"}
{"level":30,"time":1794835851202,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":201},"responseTime":3.2577699999999936,"msg":"request completed"}
{"level":30,"time":1794835851203,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41777","remoteAddress":"127.0.0.1","remotePort":38876},"msg":"incoming request"}
{"level":30,"time":1794835851205,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":201},"responseTime":2.817793999999992,"msg":"request completed"}
{"level":30,"time":1794835851206,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42677","remoteAddress":"127.0.0.1","remotePort":37934},"msg":"incoming request"}
{"level":30,"time":1794835851209,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":201},"responseTime":2.8952600000000075,"msg":"request completed"}
{"level":30,"time":1794835851211,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:35473","remoteAddress":"127.0.0.1","remotePort":34462},"msg":"incoming request"}
{"level":30,"time":1794835851213,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.310613999999987,"msg":"request completed"}
{"level":30,"time":1794835851215,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45209","remoteAddress":"127.0.0.1","remotePort":43438},"msg":"incoming request"}
{"level":30,"time":1794835851219,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":29.148615000000007,"msg":"request completed"}
{"level":30,"time":1794835851220,"pid":104329,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":201},"responseTime":5.413923000000011,"msg":"request completed"}
{"level":30,"time":1794835851222,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45679","remoteAddress":"127.0.0.1","remotePort":54276},"msg":"incoming request"}
{"level":30,"time":1794835851225,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.0928599999999733,"msg":"request completed"}
{"level":30,"time":1794835851226,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:40037","remoteAddress":"127.0.0.1","remotePort":41094},"msg":"incoming request"}
{"level":30,"time":1794835851228,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":400},"responseTime":1.8490069999999719,"msg":"request completed"}
{"level":30,"time":1794835851230,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43845","remoteAddress":"127.0.0.1","remotePort":37060},"msg":"incoming request"}
{"level":30,"time":1794835851233,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.645115999999973,"msg":"request completed"}
{"level":30,"time":1794835851235,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/a217e1ef-82ef-437a-85d5-557e34a2fdfe/revoke","host":"127.0.0.1:36259","remoteAddress":"127.0.0.1","remotePort":54254},"msg":"incoming request"}
{"level":30,"time":1794835851238,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":204},"responseTime":3.0150940000000332,"msg":"request completed"}
{"level":30,"time":1794835851241,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:32777","remoteAddress":"127.0.0.1","remotePort":60646},"msg":"incoming request"}
{"level":30,"time":1794835851243,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4765239999999835,"msg":"request completed"}
{"level":30,"time":1794835851244,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:39661","remoteAddress":"127.0.0.1","remotePort":50218},"msg":"incoming request"}
{"level":30,"time":1794835851246,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9359900000000039,"msg":"request completed"}
{"level":30,"time":1794835851248,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:32863","remoteAddress":"127.0.0.1","remotePort":34120},"msg":"incoming request"}
{"level":30,"time":1794835851251,"pid":104340,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.7883190000000013,"msg":"request completed"}
{"level":30,"time":1794835851384,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40603","remoteAddress":"127.0.0.1","remotePort":35856},"msg":"incoming request"}
{"level":30,"time":1794835851400,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":15.711033999999984,"msg":"request completed"}
{"level":30,"time":1794835851403,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37683","remoteAddress":"127.0.0.1","remotePort":54276},"msg":"incoming request"}
{"level":30,"time":1794835851407,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":201},"responseTime":4.2719319999999925,"msg":"request completed"}
{"level":30,"time":1794835851408,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:43473","remoteAddress":"127.0.0.1","remotePort":38608},"msg":"incoming request"}
{"level":30,"time":1794835851411,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.646974,"msg":"request completed"}
{"level":30,"time":1794835851413,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46773","remoteAddress":"127.0.0.1","remotePort":52244},"msg":"incoming request"}
{"level":30,"time":1794835851416,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.049869000000001,"msg":"request completed"}
{"level":30,"time":1794835851417,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:36361","remoteAddress":"127.0.0.1","remotePort":53566},"msg":"incoming request"}
{"level":30,"time":1794835851419,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5629110000000423,"msg":"request completed"}
{"level":30,"time":1794835851420,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:35373","remoteAddress":"127.0.0.1","remotePort":57798},"msg":"incoming request"}
{"level":30,"time":1794835851422,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":1.3923810000000003,"msg":"request completed"}
{"level":30,"time":1794835851423,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:42375","remoteAddress":"127.0.0.1","remotePort":41450},"msg":"incoming request"}
{"level":30,"time":1794835851424,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6636200000000372,"msg":"request completed"}
{"level":30,"time":1794835851425,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:38161","remoteAddress":"127.0.0.1","remotePort":34228},"msg":"incoming request"}
{"level":30,"time":1794835851427,"pid":104351,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.558432000000039,"msg":"request completed"}
{"level":30,"time":1794835851476,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37663","remoteAddress":"127.0.0.1","remotePort":54318},"msg":"incoming request"}
{"level":30,"time":1794835851482,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":5.247190999999987,"msg":"request completed"}
{"level":30,"time":1794835851485,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40081","remoteAddress":"127.0.0.1","remotePort":51566},"msg":"incoming request"}
{"level":30,"time":1794835851485,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.20144700000003013,"msg":"request completed"}
{"level":30,"time":1794835851487,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:34963","remoteAddress":"127.0.0.1","remotePort":48464},"msg":"incoming request"}
{"level":30,"time":1794835851489,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.751209000000017,"msg":"request completed"}
{"level":30,"time":1794835851490,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42439","remoteAddress":"127.0.0.1","remotePort":58340},"msg":"incoming request"}
{"level":30,"time":1794835851492,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7654909999999973,"msg":"request completed"}
{"level":30,"time":1794835851493,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43523","remoteAddress":"127.0.0.1","remotePort":50498},"msg":"incoming request"}
{"level":30,"time":1794835851495,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.80875199999997,"msg":"request completed"}
{"level":30,"time":1794835851496,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33787","remoteAddress":"127.0.0.1","remotePort":50388},"msg":"incoming request"}
{"level":30,"time":1794835851497,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4385030000000256,"msg":"request completed"}
{"level":30,"time":1794835851498,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:41453","remoteAddress":"127.0.0.1","remotePort":42544},"msg":"incoming request"}
{"level":30,"time":1794835851500,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.510753999999963,"msg":"request completed"}
{"level":30,"time":1794835851501,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:34823","remoteAddress":"127.0.0.1","remotePort":37422},"msg":"incoming request"}
{"level":30,"time":1794835851502,"pid":104367,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0510810000000106,"msg":"request completed"}

 Test Files  7 passed (7)
      Tests  33 passed (33)
   Start at  13:30:50
   Duration  1.00s (transform 242ms, setup 36ms, import 1.20s, tests 1.03s, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 66[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 95[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 103[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 178[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 102[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 13:30:51
[2m   Duration [22m 1.02s[2m (transform 218ms, setup 174ms, collect 763ms, tests 544ms, environment 996ms, prepare 128ms)[22m
```

## Wave 4

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 69 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m85.19 kB[22m[1m[22m[2m │ gzip: 19.92 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m55.18 kB[22m[1m[22m[2m │ gzip: 16.97 kB[22m
[32m✓ built in 176ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 114 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-1Rl7rwRe.css  [39m[1m[2m 43.21 kB[22m[1m[22m[2m │ gzip:   7.33 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-Dff2TOgz.js   [39m[1m[2m375.23 kB[22m[1m[22m[2m │ gzip: 111.92 kB[22m
[32m✓ built in 623ms[39m

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794837611939,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:33699","remoteAddress":"127.0.0.1","remotePort":54810},"msg":"incoming request"}
{"level":30,"time":1794837611939,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37781","remoteAddress":"127.0.0.1","remotePort":60856},"msg":"incoming request"}
{"level":30,"time":1794837611948,"pid":179067,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:38191","remoteAddress":"127.0.0.1","remotePort":60870},"msg":"incoming request"}
{"level":30,"time":1794837611955,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":15.480187999999998,"msg":"request completed"}
{"level":30,"time":1794837611958,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/activation","host":"127.0.0.1:43739","remoteAddress":"127.0.0.1","remotePort":55960},"msg":"incoming request"}
{"level":30,"time":1794837611961,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":422},"responseTime":3.0711009999999987,"msg":"request completed"}
{"level":30,"time":1794837611962,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db","host":"127.0.0.1:35119","remoteAddress":"127.0.0.1","remotePort":57176},"msg":"incoming request"}
{"level":30,"time":1794837611965,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":3.053418000000022,"msg":"request completed"}
{"level":30,"time":1794837611967,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/command-roles","host":"127.0.0.1:33633","remoteAddress":"127.0.0.1","remotePort":42870},"msg":"incoming request"}
{"level":30,"time":1794837611970,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.352640000000008,"msg":"request completed"}
{"level":30,"time":1794837611971,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/activation","host":"127.0.0.1:35865","remoteAddress":"127.0.0.1","remotePort":43382},"msg":"incoming request"}
{"level":30,"time":1794837611971,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":32.324479999999994,"msg":"request completed"}
{"level":30,"time":1794837611974,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:46175","remoteAddress":"127.0.0.1","remotePort":57352},"msg":"incoming request"}
{"level":30,"time":1794837611975,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":3.842088999999987,"msg":"request completed"}
{"level":30,"time":1794837611976,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/timeline","host":"127.0.0.1:37439","remoteAddress":"127.0.0.1","remotePort":40314},"msg":"incoming request"}
{"level":30,"time":1794837611977,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7979780000000005,"msg":"request completed"}
{"level":30,"time":1794837611979,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.490118999999993,"msg":"request completed"}
{"level":30,"time":1794837611979,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:45627","remoteAddress":"127.0.0.1","remotePort":36374},"msg":"incoming request"}
{"level":30,"time":1794837611980,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/activation","host":"127.0.0.1:33863","remoteAddress":"127.0.0.1","remotePort":43164},"msg":"incoming request"}
{"level":30,"time":1794837611981,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":400},"responseTime":2.074838999999997,"msg":"request completed"}
{"level":30,"time":1794837611982,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":400},"responseTime":1.3077069999999935,"msg":"request completed"}
{"level":30,"time":1794837611982,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:46579","remoteAddress":"127.0.0.1","remotePort":35102},"msg":"incoming request"}
{"level":30,"time":1794837611983,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db","host":"127.0.0.1:40847","remoteAddress":"127.0.0.1","remotePort":51072},"msg":"incoming request"}
{"level":30,"time":1794837611985,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.209069999999997,"msg":"request completed"}
{"level":30,"time":1794837611986,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/command-roles","host":"127.0.0.1:38569","remoteAddress":"127.0.0.1","remotePort":47562},"msg":"incoming request"}
{"level":30,"time":1794837611986,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.6305019999999786,"msg":"request completed"}
{"level":30,"time":1794837611988,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/42352bbe-9382-4d31-8d39-93dc30ad2345/revoke","host":"127.0.0.1:45273","remoteAddress":"127.0.0.1","remotePort":52828},"msg":"incoming request"}
{"level":30,"time":1794837611988,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":201},"responseTime":2.4323000000000548,"msg":"request completed"}
{"level":30,"time":1794837611990,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/timeline","host":"127.0.0.1:43471","remoteAddress":"127.0.0.1","remotePort":46248},"msg":"incoming request"}
{"level":30,"time":1794837611991,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":204},"responseTime":2.9303959999999734,"msg":"request completed"}
{"level":30,"time":1794837611992,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8889890000000378,"msg":"request completed"}
{"level":30,"time":1794837611993,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/closure","host":"127.0.0.1:34765","remoteAddress":"127.0.0.1","remotePort":47132},"msg":"incoming request"}
{"level":30,"time":1794837611993,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:38779","remoteAddress":"127.0.0.1","remotePort":60678},"msg":"incoming request"}
{"level":30,"time":1794837611995,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.478326999999979,"msg":"request completed"}
{"level":30,"time":1794837611996,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34841","remoteAddress":"127.0.0.1","remotePort":58092},"msg":"incoming request"}
{"level":30,"time":1794837611997,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":4.497782000000029,"msg":"request completed"}
{"level":30,"time":1794837611998,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4484509999999773,"msg":"request completed"}
{"level":30,"time":1794837611998,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/dd65c66f-eb6d-4f75-bafe-5d83525b09db/timeline","host":"127.0.0.1:34837","remoteAddress":"127.0.0.1","remotePort":45830},"msg":"incoming request"}
{"level":30,"time":1794837611999,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34459","remoteAddress":"127.0.0.1","remotePort":53598},"msg":"incoming request"}
{"level":30,"time":1794837612000,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":200},"responseTime":2.199243000000024,"msg":"request completed"}
{"level":30,"time":1794837612001,"pid":179069,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9693399999999883,"msg":"request completed"}
{"level":30,"time":1794837612001,"pid":179067,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":52.60222299999998,"msg":"request completed"}
{"level":30,"time":1794837612002,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39493","remoteAddress":"127.0.0.1","remotePort":47298},"msg":"incoming request"}
{"level":30,"time":1794837612005,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":201},"responseTime":3.2299000000000433,"msg":"request completed"}
{"level":30,"time":1794837612006,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/a0e9464a-24a7-411a-bc3d-664fc8b80def/command-roles","host":"127.0.0.1:45483","remoteAddress":"127.0.0.1","remotePort":57402},"msg":"incoming request"}
{"level":30,"time":1794837612008,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":201},"responseTime":2.1773509999999874,"msg":"request completed"}
{"level":30,"time":1794837612009,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/a0e9464a-24a7-411a-bc3d-664fc8b80def/command-roles","host":"127.0.0.1:42767","remoteAddress":"127.0.0.1","remotePort":41168},"msg":"incoming request"}
{"level":30,"time":1794837612020,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","res":{"statusCode":201},"responseTime":10.520488999999998,"msg":"request completed"}
{"level":30,"time":1794837612020,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/a0e9464a-24a7-411a-bc3d-664fc8b80def/timeline","host":"127.0.0.1:36827","remoteAddress":"127.0.0.1","remotePort":55148},"msg":"incoming request"}
{"level":30,"time":1794837612022,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","res":{"statusCode":200},"responseTime":1.801875999999993,"msg":"request completed"}
{"level":30,"time":1794837612024,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39379","remoteAddress":"127.0.0.1","remotePort":41518},"msg":"incoming request"}
{"level":30,"time":1794837612027,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","res":{"statusCode":201},"responseTime":3.1766789999999787,"msg":"request completed"}
{"level":30,"time":1794837612027,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/6ff59194-2860-45b9-9e79-a48941cfb70b/closure","host":"127.0.0.1:38011","remoteAddress":"127.0.0.1","remotePort":43692},"msg":"incoming request"}
{"level":30,"time":1794837612030,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","res":{"statusCode":200},"responseTime":2.8855120000000056,"msg":"request completed"}
{"level":30,"time":1794837612031,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/6ff59194-2860-45b9-9e79-a48941cfb70b/closure","host":"127.0.0.1:37197","remoteAddress":"127.0.0.1","remotePort":54088},"msg":"incoming request"}
{"level":30,"time":1794837612033,"pid":179068,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","res":{"statusCode":409},"responseTime":2.243666000000019,"msg":"request completed"}
{"level":30,"time":1794837612208,"pid":179067,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:38129","remoteAddress":"127.0.0.1","remotePort":33664},"msg":"incoming request"}
{"level":30,"time":1794837612211,"pid":179067,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.019072999999935,"msg":"request completed"}
{"level":30,"time":1794837612262,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:38455","remoteAddress":"127.0.0.1","remotePort":41290},"msg":"incoming request"}
{"level":30,"time":1794837612268,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":6.533496999999954,"msg":"request completed"}
{"level":30,"time":1794837612271,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:41035","remoteAddress":"127.0.0.1","remotePort":53786},"msg":"incoming request"}
{"level":30,"time":1794837612277,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":5.429102,"msg":"request completed"}
{"level":30,"time":1794837612279,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36109","remoteAddress":"127.0.0.1","remotePort":56916},"msg":"incoming request"}
{"level":30,"time":1794837612281,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.3781490000000076,"msg":"request completed"}
{"level":30,"time":1794837612282,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/bf5e69f1-833a-41f3-b443-5ce9d39d27f4","host":"127.0.0.1:42937","remoteAddress":"127.0.0.1","remotePort":60676},"msg":"incoming request"}
{"level":30,"time":1794837612285,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43625","remoteAddress":"127.0.0.1","remotePort":46322},"msg":"incoming request"}
{"level":30,"time":1794837612285,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":2.8013139999999908,"msg":"request completed"}
{"level":30,"time":1794837612286,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34465","remoteAddress":"127.0.0.1","remotePort":38070},"msg":"incoming request"}
{"level":30,"time":1794837612287,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":401},"responseTime":0.4697929999999815,"msg":"request completed"}
{"level":30,"time":1794837612288,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41881","remoteAddress":"127.0.0.1","remotePort":59308},"msg":"incoming request"}
{"level":30,"time":1794837612289,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":403},"responseTime":1.2117170000000215,"msg":"request completed"}
{"level":30,"time":1794837612290,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/7d5be51b-398b-4670-865c-7c62122625d3","host":"127.0.0.1:37625","remoteAddress":"127.0.0.1","remotePort":46352},"msg":"incoming request"}
{"level":30,"time":1794837612294,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":3.7789510000000064,"msg":"request completed"}
{"level":30,"time":1794837612295,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41465","remoteAddress":"127.0.0.1","remotePort":38272},"msg":"incoming request"}
{"level":30,"time":1794837612298,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":3.0226089999999886,"msg":"request completed"}
{"level":30,"time":1794837612300,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=8a1b75cd-71ed-40c8-931b-1e7168c78ded&page_size=50","host":"127.0.0.1:39697","remoteAddress":"127.0.0.1","remotePort":57398},"msg":"incoming request"}
{"level":30,"time":1794837612300,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":14.938840999999996,"msg":"request completed"}
{"level":30,"time":1794837612302,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.202980000000025,"msg":"request completed"}
{"level":30,"time":1794837612303,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/c91723b4-f28f-4c84-a091-3a4e96957703/timeline","host":"127.0.0.1:35395","remoteAddress":"127.0.0.1","remotePort":37780},"msg":"incoming request"}
{"level":30,"time":1794837612304,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36847","remoteAddress":"127.0.0.1","remotePort":36910},"msg":"incoming request"}
{"level":30,"time":1794837612305,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":403},"responseTime":1.3752139999999713,"msg":"request completed"}
{"level":30,"time":1794837612306,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.0499810000000025,"msg":"request completed"}
{"level":30,"time":1794837612307,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:44659","remoteAddress":"127.0.0.1","remotePort":38490},"msg":"incoming request"}
{"level":30,"time":1794837612308,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34703","remoteAddress":"127.0.0.1","remotePort":51872},"msg":"incoming request"}
{"level":30,"time":1794837612308,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":1.6860280000000216,"msg":"request completed"}
{"level":30,"time":1794837612309,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:33423","remoteAddress":"127.0.0.1","remotePort":59564},"msg":"incoming request"}
{"level":30,"time":1794837612320,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":201},"responseTime":11.74823600000002,"msg":"request completed"}
{"level":30,"time":1794837612320,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":422},"responseTime":10.50695300000001,"msg":"request completed"}
{"level":30,"time":1794837612321,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:33519","remoteAddress":"127.0.0.1","remotePort":56048},"msg":"incoming request"}
{"level":30,"time":1794837612321,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43343","remoteAddress":"127.0.0.1","remotePort":36078},"msg":"incoming request"}
{"level":30,"time":1794837612323,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":409},"responseTime":1.7999119999999493,"msg":"request completed"}
{"level":30,"time":1794837612323,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":200},"responseTime":2.121826999999996,"msg":"request completed"}
{"level":30,"time":1794837612324,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43449","remoteAddress":"127.0.0.1","remotePort":50300},"msg":"incoming request"}
{"level":30,"time":1794837612324,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=8a1b75cd-71ed-40c8-931b-1e7168c78ded&action_type=record_view","host":"127.0.0.1:43685","remoteAddress":"127.0.0.1","remotePort":46298},"msg":"incoming request"}
{"level":30,"time":1794837612325,"pid":179143,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":200},"responseTime":1.602961999999991,"msg":"request completed"}
{"level":30,"time":1794837612327,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":201},"responseTime":2.8876859999999738,"msg":"request completed"}
{"level":30,"time":1794837612328,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45033","remoteAddress":"127.0.0.1","remotePort":35618},"msg":"incoming request"}
{"level":30,"time":1794837612332,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":201},"responseTime":3.2700450000000387,"msg":"request completed"}
{"level":30,"time":1794837612333,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43149","remoteAddress":"127.0.0.1","remotePort":54530},"msg":"incoming request"}
{"level":30,"time":1794837612336,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":201},"responseTime":3.1691450000000145,"msg":"request completed"}
{"level":30,"time":1794837612337,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39385","remoteAddress":"127.0.0.1","remotePort":59152},"msg":"incoming request"}
{"level":30,"time":1794837612340,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":201},"responseTime":2.8892890000000193,"msg":"request completed"}
{"level":30,"time":1794837612341,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:44505","remoteAddress":"127.0.0.1","remotePort":33122},"msg":"incoming request"}
{"level":30,"time":1794837612344,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.397986000000003,"msg":"request completed"}
{"level":30,"time":1794837612345,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41045","remoteAddress":"127.0.0.1","remotePort":52036},"msg":"incoming request"}
{"level":30,"time":1794837612348,"pid":179155,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":201},"responseTime":2.7304509999999595,"msg":"request completed"}
{"level":30,"time":1794837612471,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46723","remoteAddress":"127.0.0.1","remotePort":37354},"msg":"incoming request"}
{"level":30,"time":1794837612486,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":14.717534999999998,"msg":"request completed"}
{"level":30,"time":1794837612489,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44361","remoteAddress":"127.0.0.1","remotePort":43296},"msg":"incoming request"}
{"level":30,"time":1794837612493,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":201},"responseTime":3.5327179999999885,"msg":"request completed"}
{"level":30,"time":1794837612494,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:37395","remoteAddress":"127.0.0.1","remotePort":55894},"msg":"incoming request"}
{"level":30,"time":1794837612497,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.4528779999999983,"msg":"request completed"}
{"level":30,"time":1794837612499,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45903","remoteAddress":"127.0.0.1","remotePort":40246},"msg":"incoming request"}
{"level":30,"time":1794837612502,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":2.8892290000000003,"msg":"request completed"}
{"level":30,"time":1794837612503,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:43081","remoteAddress":"127.0.0.1","remotePort":39550},"msg":"incoming request"}
{"level":30,"time":1794837612505,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4734589999999912,"msg":"request completed"}
{"level":30,"time":1794837612506,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:44683","remoteAddress":"127.0.0.1","remotePort":38152},"msg":"incoming request"}
{"level":30,"time":1794837612508,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":1.436318999999969,"msg":"request completed"}
{"level":30,"time":1794837612509,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:44933","remoteAddress":"127.0.0.1","remotePort":35550},"msg":"incoming request"}
{"level":30,"time":1794837612510,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6790550000000053,"msg":"request completed"}
{"level":30,"time":1794837612511,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:42853","remoteAddress":"127.0.0.1","remotePort":33006},"msg":"incoming request"}
{"level":30,"time":1794837612513,"pid":179166,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.513133000000039,"msg":"request completed"}
{"level":30,"time":1794837612570,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43603","remoteAddress":"127.0.0.1","remotePort":34914},"msg":"incoming request"}
{"level":30,"time":1794837612575,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":4.716532999999998,"msg":"request completed"}
{"level":30,"time":1794837612577,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33505","remoteAddress":"127.0.0.1","remotePort":32812},"msg":"incoming request"}
{"level":30,"time":1794837612577,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18457699999999022,"msg":"request completed"}
{"level":30,"time":1794837612579,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:40169","remoteAddress":"127.0.0.1","remotePort":45388},"msg":"incoming request"}
{"level":30,"time":1794837612581,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.450084000000004,"msg":"request completed"}
{"level":30,"time":1794837612582,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39363","remoteAddress":"127.0.0.1","remotePort":41366},"msg":"incoming request"}
{"level":30,"time":1794837612584,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":1.5983829999999841,"msg":"request completed"}
{"level":30,"time":1794837612585,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36335","remoteAddress":"127.0.0.1","remotePort":35866},"msg":"incoming request"}
{"level":30,"time":1794837612586,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4780879999999854,"msg":"request completed"}
{"level":30,"time":1794837612587,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37897","remoteAddress":"127.0.0.1","remotePort":52824},"msg":"incoming request"}
{"level":30,"time":1794837612588,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.3805650000000469,"msg":"request completed"}
{"level":30,"time":1794837612589,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:45035","remoteAddress":"127.0.0.1","remotePort":35878},"msg":"incoming request"}
{"level":30,"time":1794837612591,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3019669999999905,"msg":"request completed"}
{"level":30,"time":1794837612592,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42443","remoteAddress":"127.0.0.1","remotePort":54998},"msg":"incoming request"}
{"level":30,"time":1794837612593,"pid":179179,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":0.8994800000000396,"msg":"request completed"}

 Test Files  7 passed (7)
      Tests  33 passed (33)
   Start at  14:00:11
   Duration  1.02s (transform 219ms, setup 35ms, import 1.23s, tests 1.03s, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 70[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 100[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 120[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 181[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 104[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 14:00:12
[2m   Duration [22m 1.03s[2m (transform 209ms, setup 160ms, collect 742ms, tests 575ms, environment 1.05s, prepare 130ms)[22m
```

## Wave 5

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 69 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m85.19 kB[22m[1m[22m[2m │ gzip: 19.92 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m55.18 kB[22m[1m[22m[2m │ gzip: 16.97 kB[22m
[32m✓ built in 164ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 116 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-B9pIlQTC.css  [39m[1m[2m 43.62 kB[22m[1m[22m[2m │ gzip:   7.37 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-CP37jnLF.js   [39m[1m[2m386.88 kB[22m[1m[22m[2m │ gzip: 115.23 kB[22m
[32m✓ built in 648ms[39m

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794838975304,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40143","remoteAddress":"127.0.0.1","remotePort":45972},"msg":"incoming request"}
{"level":30,"time":1794838975309,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:40561","remoteAddress":"127.0.0.1","remotePort":38322},"msg":"incoming request"}
{"level":30,"time":1794838975309,"pid":244942,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:42215","remoteAddress":"127.0.0.1","remotePort":50716},"msg":"incoming request"}
{"level":30,"time":1794838975319,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":9.347725000000025,"msg":"request completed"}
{"level":30,"time":1794838975322,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":17.516256999999996,"msg":"request completed"}
{"level":30,"time":1794838975323,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:43971","remoteAddress":"127.0.0.1","remotePort":50456},"msg":"incoming request"}
{"level":30,"time":1794838975325,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/activation","host":"127.0.0.1:34787","remoteAddress":"127.0.0.1","remotePort":46956},"msg":"incoming request"}
{"level":30,"time":1794838975328,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":422},"responseTime":2.6947380000000294,"msg":"request completed"}
{"level":30,"time":1794838975329,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4","host":"127.0.0.1:42079","remoteAddress":"127.0.0.1","remotePort":41224},"msg":"incoming request"}
{"level":30,"time":1794838975330,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":6.619725000000017,"msg":"request completed"}
{"level":30,"time":1794838975332,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43839","remoteAddress":"127.0.0.1","remotePort":49812},"msg":"incoming request"}
{"level":30,"time":1794838975332,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":3.1230619999999476,"msg":"request completed"}
{"level":30,"time":1794838975333,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/command-roles","host":"127.0.0.1:40931","remoteAddress":"127.0.0.1","remotePort":53512},"msg":"incoming request"}
{"level":30,"time":1794838975335,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9054929999999786,"msg":"request completed"}
{"level":30,"time":1794838975336,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/2c22bd78-d835-4659-a807-7279c476e3e3","host":"127.0.0.1:33697","remoteAddress":"127.0.0.1","remotePort":58650},"msg":"incoming request"}
{"level":30,"time":1794838975337,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.484449999999981,"msg":"request completed"}
{"level":30,"time":1794838975338,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/activation","host":"127.0.0.1:42515","remoteAddress":"127.0.0.1","remotePort":35932},"msg":"incoming request"}
{"level":30,"time":1794838975340,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":3.6920789999999784,"msg":"request completed"}
{"level":30,"time":1794838975341,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37235","remoteAddress":"127.0.0.1","remotePort":41836},"msg":"incoming request"}
{"level":30,"time":1794838975342,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5324389999999539,"msg":"request completed"}
{"level":30,"time":1794838975342,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":3.827965000000006,"msg":"request completed"}
{"level":30,"time":1794838975343,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:45891","remoteAddress":"127.0.0.1","remotePort":45744},"msg":"incoming request"}
{"level":30,"time":1794838975343,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/timeline","host":"127.0.0.1:34381","remoteAddress":"127.0.0.1","remotePort":36046},"msg":"incoming request"}
{"level":30,"time":1794838975344,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":403},"responseTime":1.314828000000034,"msg":"request completed"}
{"level":30,"time":1794838975345,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.1518780000000106,"msg":"request completed"}
{"level":30,"time":1794838975345,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/7d5be51b-398b-4670-865c-7c62122625d3","host":"127.0.0.1:46159","remoteAddress":"127.0.0.1","remotePort":47240},"msg":"incoming request"}
{"level":30,"time":1794838975347,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/activation","host":"127.0.0.1:35387","remoteAddress":"127.0.0.1","remotePort":47242},"msg":"incoming request"}
{"level":30,"time":1794838975349,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":400},"responseTime":1.3342140000000313,"msg":"request completed"}
{"level":30,"time":1794838975349,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":3.8163340000000403,"msg":"request completed"}
{"level":30,"time":1794838975350,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4","host":"127.0.0.1:38273","remoteAddress":"127.0.0.1","remotePort":37780},"msg":"incoming request"}
{"level":30,"time":1794838975350,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:43559","remoteAddress":"127.0.0.1","remotePort":60534},"msg":"incoming request"}
{"level":30,"time":1794838975352,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.460628999999983,"msg":"request completed"}
{"level":30,"time":1794838975353,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.6473590000000513,"msg":"request completed"}
{"level":30,"time":1794838975353,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/command-roles","host":"127.0.0.1:33243","remoteAddress":"127.0.0.1","remotePort":36906},"msg":"incoming request"}
{"level":30,"time":1794838975354,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=74020423-9039-4068-8aa1-fd1e9c9b3853&page_size=50","host":"127.0.0.1:46455","remoteAddress":"127.0.0.1","remotePort":37384},"msg":"incoming request"}
{"level":30,"time":1794838975356,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":201},"responseTime":2.7062889999999697,"msg":"request completed"}
{"level":30,"time":1794838975356,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":1.6778690000000438,"msg":"request completed"}
{"level":30,"time":1794838975357,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/timeline","host":"127.0.0.1:35473","remoteAddress":"127.0.0.1","remotePort":41462},"msg":"incoming request"}
{"level":30,"time":1794838975358,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41465","remoteAddress":"127.0.0.1","remotePort":54452},"msg":"incoming request"}
{"level":30,"time":1794838975359,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":403},"responseTime":1.2983760000000188,"msg":"request completed"}
{"level":30,"time":1794838975359,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":200},"responseTime":2.059876000000031,"msg":"request completed"}
{"level":30,"time":1794838975360,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:41559","remoteAddress":"127.0.0.1","remotePort":44558},"msg":"incoming request"}
{"level":30,"time":1794838975360,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/closure","host":"127.0.0.1:40569","remoteAddress":"127.0.0.1","remotePort":34794},"msg":"incoming request"}
{"level":30,"time":1794838975362,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":1.5068290000000388,"msg":"request completed"}
{"level":30,"time":1794838975363,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:32937","remoteAddress":"127.0.0.1","remotePort":49130},"msg":"incoming request"}
{"level":30,"time":1794838975364,"pid":244942,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":54.23105899999996,"msg":"request completed"}
{"level":30,"time":1794838975364,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-b","res":{"statusCode":200},"responseTime":3.604475999999977,"msg":"request completed"}
{"level":30,"time":1794838975365,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":422},"responseTime":1.9198430000000144,"msg":"request completed"}
{"level":30,"time":1794838975365,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/b5087779-79e2-431f-8186-0686659bbab4/timeline","host":"127.0.0.1:37595","remoteAddress":"127.0.0.1","remotePort":52202},"msg":"incoming request"}
{"level":30,"time":1794838975365,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:38639","remoteAddress":"127.0.0.1","remotePort":57668},"msg":"incoming request"}
{"level":30,"time":1794838975367,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":200},"responseTime":1.8960989999999924,"msg":"request completed"}
{"level":30,"time":1794838975367,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-c","res":{"statusCode":200},"responseTime":2.544817000000023,"msg":"request completed"}
{"level":30,"time":1794838975368,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=74020423-9039-4068-8aa1-fd1e9c9b3853&action_type=record_view","host":"127.0.0.1:46625","remoteAddress":"127.0.0.1","remotePort":33722},"msg":"incoming request"}
{"level":30,"time":1794838975369,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32989","remoteAddress":"127.0.0.1","remotePort":50810},"msg":"incoming request"}
{"level":30,"time":1794838975370,"pid":244944,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":200},"responseTime":1.6592350000000238,"msg":"request completed"}
{"level":30,"time":1794838975373,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-d","res":{"statusCode":201},"responseTime":3.4822560000000067,"msg":"request completed"}
{"level":30,"time":1794838975374,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/0c8a41b7-3423-4879-aa33-31cc124ce00e/command-roles","host":"127.0.0.1:44389","remoteAddress":"127.0.0.1","remotePort":41460},"msg":"incoming request"}
{"level":30,"time":1794838975376,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-e","res":{"statusCode":201},"responseTime":2.5800820000000044,"msg":"request completed"}
{"level":30,"time":1794838975377,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/0c8a41b7-3423-4879-aa33-31cc124ce00e/command-roles","host":"127.0.0.1:34709","remoteAddress":"127.0.0.1","remotePort":38432},"msg":"incoming request"}
{"level":30,"time":1794838975396,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-f","res":{"statusCode":201},"responseTime":18.85314699999998,"msg":"request completed"}
{"level":30,"time":1794838975397,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/0c8a41b7-3423-4879-aa33-31cc124ce00e/timeline","host":"127.0.0.1:43567","remoteAddress":"127.0.0.1","remotePort":44384},"msg":"incoming request"}
{"level":30,"time":1794838975399,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7342550000000188,"msg":"request completed"}
{"level":30,"time":1794838975400,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35185","remoteAddress":"127.0.0.1","remotePort":54468},"msg":"incoming request"}
{"level":30,"time":1794838975403,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-h","res":{"statusCode":201},"responseTime":2.5874170000000163,"msg":"request completed"}
{"level":30,"time":1794838975405,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/9c8c22dd-9b1f-4490-946a-045860042623/closure","host":"127.0.0.1:42317","remoteAddress":"127.0.0.1","remotePort":60610},"msg":"incoming request"}
{"level":30,"time":1794838975407,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-i","res":{"statusCode":200},"responseTime":2.705768999999975,"msg":"request completed"}
{"level":30,"time":1794838975408,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/9c8c22dd-9b1f-4490-946a-045860042623/closure","host":"127.0.0.1:45159","remoteAddress":"127.0.0.1","remotePort":52782},"msg":"incoming request"}
{"level":30,"time":1794838975410,"pid":244943,"hostname":"pivota-sandbox-281c1ede","reqId":"req-j","res":{"statusCode":409},"responseTime":2.0171159999999873,"msg":"request completed"}
{"level":30,"time":1794838975571,"pid":244942,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:39385","remoteAddress":"127.0.0.1","remotePort":53514},"msg":"incoming request"}
{"level":30,"time":1794838975575,"pid":244942,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.315962999999897,"msg":"request completed"}
{"level":30,"time":1794838975640,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:41657","remoteAddress":"127.0.0.1","remotePort":38476},"msg":"incoming request"}
{"level":30,"time":1794838975665,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35379","remoteAddress":"127.0.0.1","remotePort":49512},"msg":"incoming request"}
{"level":30,"time":1794838975696,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":55.722939,"msg":"request completed"}
{"level":30,"time":1794838975699,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:35715","remoteAddress":"127.0.0.1","remotePort":53714},"msg":"incoming request"}
{"level":30,"time":1794838975702,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":2.995693000000017,"msg":"request completed"}
{"level":30,"time":1794838975703,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":37.30672299999998,"msg":"request completed"}
{"level":30,"time":1794838975704,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:35463","remoteAddress":"127.0.0.1","remotePort":45266},"msg":"incoming request"}
{"level":30,"time":1794838975706,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/f23dd632-eb22-457e-9571-fb1cc4455599/timeline","host":"127.0.0.1:38211","remoteAddress":"127.0.0.1","remotePort":46540},"msg":"incoming request"}
{"level":30,"time":1794838975706,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":400},"responseTime":1.9379369999999767,"msg":"request completed"}
{"level":30,"time":1794838975707,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42217","remoteAddress":"127.0.0.1","remotePort":49412},"msg":"incoming request"}
{"level":30,"time":1794838975709,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":200},"responseTime":3.071896000000038,"msg":"request completed"}
{"level":30,"time":1794838975711,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.538632000000007,"msg":"request completed"}
{"level":30,"time":1794838975711,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38623","remoteAddress":"127.0.0.1","remotePort":51448},"msg":"incoming request"}
{"level":30,"time":1794838975713,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/cb816e35-51a8-4dc9-b610-62a1a2a8e87f/revoke","host":"127.0.0.1:43047","remoteAddress":"127.0.0.1","remotePort":40938},"msg":"incoming request"}
{"level":30,"time":1794838975720,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":204},"responseTime":6.921241000000009,"msg":"request completed"}
{"level":30,"time":1794838975720,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":201},"responseTime":9.06142699999998,"msg":"request completed"}
{"level":30,"time":1794838975721,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34711","remoteAddress":"127.0.0.1","remotePort":55094},"msg":"incoming request"}
{"level":30,"time":1794838975722,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43957","remoteAddress":"127.0.0.1","remotePort":51074},"msg":"incoming request"}
{"level":30,"time":1794838975724,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":409},"responseTime":2.1070849999999837,"msg":"request completed"}
{"level":30,"time":1794838975725,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":2.6205980000000295,"msg":"request completed"}
{"level":30,"time":1794838975725,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35241","remoteAddress":"127.0.0.1","remotePort":39114},"msg":"incoming request"}
{"level":30,"time":1794838975726,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43625","remoteAddress":"127.0.0.1","remotePort":58836},"msg":"incoming request"}
{"level":30,"time":1794838975728,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":2.2940360000000055,"msg":"request completed"}
{"level":30,"time":1794838975728,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":201},"responseTime":3.6618540000000053,"msg":"request completed"}
{"level":30,"time":1794838975729,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40007","remoteAddress":"127.0.0.1","remotePort":52216},"msg":"incoming request"}
{"level":30,"time":1794838975730,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44417","remoteAddress":"127.0.0.1","remotePort":49244},"msg":"incoming request"}
{"level":30,"time":1794838975731,"pid":244979,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":2.3214679999999817,"msg":"request completed"}
{"level":30,"time":1794838975734,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":201},"responseTime":3.4170330000000035,"msg":"request completed"}
{"level":30,"time":1794838975735,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41313","remoteAddress":"127.0.0.1","remotePort":52532},"msg":"incoming request"}
{"level":30,"time":1794838975738,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":201},"responseTime":3.489590000000021,"msg":"request completed"}
{"level":30,"time":1794838975740,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37285","remoteAddress":"127.0.0.1","remotePort":47632},"msg":"incoming request"}
{"level":30,"time":1794838975743,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":201},"responseTime":3.5142960000000016,"msg":"request completed"}
{"level":30,"time":1794838975745,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:41883","remoteAddress":"127.0.0.1","remotePort":44578},"msg":"incoming request"}
{"level":30,"time":1794838975747,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":2.7450430000000097,"msg":"request completed"}
{"level":30,"time":1794838975749,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40135","remoteAddress":"127.0.0.1","remotePort":36864},"msg":"incoming request"}
{"level":30,"time":1794838975752,"pid":244990,"hostname":"pivota-sandbox-281c1ede","reqId":"req-a","res":{"statusCode":201},"responseTime":3.09996799999999,"msg":"request completed"}
{"level":30,"time":1794838975857,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46613","remoteAddress":"127.0.0.1","remotePort":52188},"msg":"incoming request"}
{"level":30,"time":1794838975872,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":201},"responseTime":14.655016999999987,"msg":"request completed"}
{"level":30,"time":1794838975875,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35493","remoteAddress":"127.0.0.1","remotePort":48260},"msg":"incoming request"}
{"level":30,"time":1794838975879,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":201},"responseTime":3.9672459999999887,"msg":"request completed"}
{"level":30,"time":1794838975880,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:40097","remoteAddress":"127.0.0.1","remotePort":37364},"msg":"incoming request"}
{"level":30,"time":1794838975883,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6425199999999904,"msg":"request completed"}
{"level":30,"time":1794838975885,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40019","remoteAddress":"127.0.0.1","remotePort":40980},"msg":"incoming request"}
{"level":30,"time":1794838975888,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.479321000000027,"msg":"request completed"}
{"level":30,"time":1794838975890,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:39121","remoteAddress":"127.0.0.1","remotePort":41360},"msg":"incoming request"}
{"level":30,"time":1794838975892,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5629329999999868,"msg":"request completed"}
{"level":30,"time":1794838975893,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41981","remoteAddress":"127.0.0.1","remotePort":38678},"msg":"incoming request"}
{"level":30,"time":1794838975894,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":1.5976890000000026,"msg":"request completed"}
{"level":30,"time":1794838975896,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:46545","remoteAddress":"127.0.0.1","remotePort":57686},"msg":"incoming request"}
{"level":30,"time":1794838975897,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.803654999999992,"msg":"request completed"}
{"level":30,"time":1794838975898,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:34807","remoteAddress":"127.0.0.1","remotePort":52542},"msg":"incoming request"}
{"level":30,"time":1794838975900,"pid":245004,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.7741399999999885,"msg":"request completed"}
{"level":30,"time":1794838975975,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33305","remoteAddress":"127.0.0.1","remotePort":52440},"msg":"incoming request"}
{"level":30,"time":1794838975980,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":5.040430000000015,"msg":"request completed"}
{"level":30,"time":1794838975983,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37087","remoteAddress":"127.0.0.1","remotePort":37066},"msg":"incoming request"}
{"level":30,"time":1794838975983,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19313200000001984,"msg":"request completed"}
{"level":30,"time":1794838975985,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:43931","remoteAddress":"127.0.0.1","remotePort":60686},"msg":"incoming request"}
{"level":30,"time":1794838975987,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.919930999999991,"msg":"request completed"}
{"level":30,"time":1794838975988,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46223","remoteAddress":"127.0.0.1","remotePort":50854},"msg":"incoming request"}
{"level":30,"time":1794838975990,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":1.77696499999999,"msg":"request completed"}
{"level":30,"time":1794838975992,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44029","remoteAddress":"127.0.0.1","remotePort":51442},"msg":"incoming request"}
{"level":30,"time":1794838975994,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.9205240000000003,"msg":"request completed"}
{"level":30,"time":1794838975995,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45139","remoteAddress":"127.0.0.1","remotePort":53574},"msg":"incoming request"}
{"level":30,"time":1794838975995,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.41540999999995165,"msg":"request completed"}
{"level":30,"time":1794838975997,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:46151","remoteAddress":"127.0.0.1","remotePort":46244},"msg":"incoming request"}
{"level":30,"time":1794838975998,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4236230000000205,"msg":"request completed"}
{"level":30,"time":1794838975999,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:33245","remoteAddress":"127.0.0.1","remotePort":49172},"msg":"incoming request"}
{"level":30,"time":1794838976000,"pid":245072,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9708929999999896,"msg":"request completed"}

 Test Files  7 passed (7)
      Tests  33 passed (33)
   Start at  14:22:54
   Duration  1.05s (transform 262ms, setup 35ms, import 1.24s, tests 1.10s, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 86[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 111[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 108[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 187[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 106[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 14:22:56
[2m   Duration [22m 1.04s[2m (transform 230ms, setup 158ms, collect 781ms, tests 598ms, environment 1.03s, prepare 133ms)[22m
```


## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=0 build_cmd=[npm run build] test_cmd=[npm test] head=68e29a4f48093f0e62b5169f76be880c65e0abf6 test_files=20 skip_marks=0 shadow_files=0 untested=0
{"level":30,"time":1794843804958,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40049","remoteAddress":"127.0.0.1","remotePort":55704},"msg":"incoming request"}
{"level":30,"time":1794843804962,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":201},"responseTime":3.906003999999996,"msg":"request completed"}
{"level":30,"time":1794843804963,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:35785","remoteAddress":"127.0.0.1","remotePort":44808},"msg":"incoming request"}
{"level":30,"time":1794843804966,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.779658999999981,"msg":"request completed"}
{"level":30,"time":1794843804967,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36367","remoteAddress":"127.0.0.1","remotePort":48740},"msg":"incoming request"}
{"level":30,"time":1794843804971,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":201},"responseTime":3.2396320000000287,"msg":"request completed"}
{"level":30,"time":1794843804972,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:34601","remoteAddress":"127.0.0.1","remotePort":59816},"msg":"incoming request"}
{"level":30,"time":1794843804974,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5854170000000067,"msg":"request completed"}
{"level":30,"time":1794843804975,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:36113","remoteAddress":"127.0.0.1","remotePort":37354},"msg":"incoming request"}
{"level":30,"time":1794843804977,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7543339999999716,"msg":"request completed"}
{"level":30,"time":1794843804978,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:37641","remoteAddress":"127.0.0.1","remotePort":40556},"msg":"incoming request"}
{"level":30,"time":1794843804979,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4097270000000321,"msg":"request completed"}
{"level":30,"time":1794843804980,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:46405","remoteAddress":"127.0.0.1","remotePort":43114},"msg":"incoming request"}
{"level":30,"time":1794843804982,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":200},"responseTime":1.94750700000003,"msg":"request completed"}
{"level":30,"time":1794843804983,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:33259","remoteAddress":"127.0.0.1","remotePort":42388},"msg":"incoming request"}
{"level":30,"time":1794843804985,"pid":473161,"hostname":"pivota-sandbox-281c1ede","reqId":"req-9","res":{"statusCode":200},"responseTime":1.6414320000000089,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/operating-picture.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 105[2mms[22m[39m
{"level":30,"time":1794843805054,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34933","remoteAddress":"127.0.0.1","remotePort":36746},"msg":"incoming request"}
{"level":30,"time":1794843805059,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-1","res":{"statusCode":200},"responseTime":5.09072900000001,"msg":"request completed"}
{"level":30,"time":1794843805062,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34283","remoteAddress":"127.0.0.1","remotePort":41718},"msg":"incoming request"}
{"level":30,"time":1794843805062,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-2","res":{"statusCode":401},"responseTime":0.21356099999997014,"msg":"request completed"}
{"level":30,"time":1794843805064,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:38219","remoteAddress":"127.0.0.1","remotePort":50320},"msg":"incoming request"}
{"level":30,"time":1794843805066,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-3","res":{"statusCode":200},"responseTime":2.7190350000000194,"msg":"request completed"}
{"level":30,"time":1794843805067,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41647","remoteAddress":"127.0.0.1","remotePort":41150},"msg":"incoming request"}
{"level":30,"time":1794843805069,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-4","res":{"statusCode":200},"responseTime":1.795821999999987,"msg":"request completed"}
{"level":30,"time":1794843805070,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34207","remoteAddress":"127.0.0.1","remotePort":60400},"msg":"incoming request"}
{"level":30,"time":1794843805072,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6192399999999907,"msg":"request completed"}
{"level":30,"time":1794843805073,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46003","remoteAddress":"127.0.0.1","remotePort":53970},"msg":"incoming request"}
{"level":30,"time":1794843805074,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-6","res":{"statusCode":401},"responseTime":0.421861999999976,"msg":"request completed"}
{"level":30,"time":1794843805075,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:46169","remoteAddress":"127.0.0.1","remotePort":58204},"msg":"incoming request"}
{"level":30,"time":1794843805076,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3648730000000455,"msg":"request completed"}
{"level":30,"time":1794843805078,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:46211","remoteAddress":"127.0.0.1","remotePort":59796},"msg":"incoming request"}
{"level":30,"time":1794843805079,"pid":473174,"hostname":"pivota-sandbox-281c1ede","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9437719999999672,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/routes.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 80[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[32m36 passed[39m[22m[90m (36)[39m
[2m   Start at [22m 15:43:23
[2m   Duration [22m 1.10s[2m (transform 237ms, setup 34ms, import 1.28s, tests 1.25s, environment 0ms)[22m

```

## Wave 6

- Build: `rc=0; npm run build || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; (cd frontend/app && npm run build) || rc=$?; exit $rc` → pass
- Tests: `rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 69 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m85.19 kB[22m[1m[22m[2m │ gzip: 19.92 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m34.09 kB[22m[1m[22m[2m │ gzip:  5.04 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m55.18 kB[22m[1m[22m[2m │ gzip: 16.97 kB[22m
[32m✓ built in 174ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 117 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-B9pIlQTC.css  [39m[1m[2m 43.62 kB[22m[1m[22m[2m │ gzip:   7.37 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-D5lM2tOL.js   [39m[1m[2m388.30 kB[22m[1m[22m[2m │ gzip: 115.54 kB[22m
[32m✓ built in 802ms[39m
[gate] wave 6 tests: rc=0; npm test || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794914102786,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46733","remoteAddress":"127.0.0.1","remotePort":53730},"msg":"incoming request"}
{"level":30,"time":1794914102801,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":15.026431000000002,"msg":"request completed"}
{"level":30,"time":1794914102805,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/activation","host":"127.0.0.1:41033","remoteAddress":"127.0.0.1","remotePort":58478},"msg":"incoming request"}
{"level":30,"time":1794914102815,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":422},"responseTime":10.706639999999993,"msg":"request completed"}
{"level":30,"time":1794914102817,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8","host":"127.0.0.1:41615","remoteAddress":"127.0.0.1","remotePort":43514},"msg":"incoming request"}
{"level":30,"time":1794914102819,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":200},"responseTime":2.241053000000022,"msg":"request completed"}
{"level":30,"time":1794914102820,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/command-roles","host":"127.0.0.1:39569","remoteAddress":"127.0.0.1","remotePort":43724},"msg":"incoming request"}
{"level":30,"time":1794914102822,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":201},"responseTime":2.5972909999999843,"msg":"request completed"}
{"level":30,"time":1794914102823,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/activation","host":"127.0.0.1:39521","remoteAddress":"127.0.0.1","remotePort":33096},"msg":"incoming request"}
{"level":30,"time":1794914102826,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":200},"responseTime":3.091448000000014,"msg":"request completed"}
{"level":30,"time":1794914102828,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/timeline","host":"127.0.0.1:38527","remoteAddress":"127.0.0.1","remotePort":34220},"msg":"incoming request"}
{"level":30,"time":1794914102830,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9816170000000284,"msg":"request completed"}
{"level":30,"time":1794914102831,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/activation","host":"127.0.0.1:45787","remoteAddress":"127.0.0.1","remotePort":36044},"msg":"incoming request"}
{"level":30,"time":1794914102832,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":400},"responseTime":1.198257999999953,"msg":"request completed"}
{"level":30,"time":1794914102833,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8","host":"127.0.0.1:45389","remoteAddress":"127.0.0.1","remotePort":36460},"msg":"incoming request"}
{"level":30,"time":1794914102835,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8083509999999592,"msg":"request completed"}
{"level":30,"time":1794914102836,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/command-roles","host":"127.0.0.1:38851","remoteAddress":"127.0.0.1","remotePort":33232},"msg":"incoming request"}
{"level":30,"time":1794914102838,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","res":{"statusCode":201},"responseTime":2.244579999999985,"msg":"request completed"}
{"level":30,"time":1794914102839,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/timeline","host":"127.0.0.1:39009","remoteAddress":"127.0.0.1","remotePort":42314},"msg":"incoming request"}
{"level":30,"time":1794914102841,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","res":{"statusCode":200},"responseTime":1.6099889999999846,"msg":"request completed"}
{"level":30,"time":1794914102842,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/closure","host":"127.0.0.1:35103","remoteAddress":"127.0.0.1","remotePort":55716},"msg":"incoming request"}
{"level":30,"time":1794914102845,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","res":{"statusCode":200},"responseTime":3.15709099999998,"msg":"request completed"}
{"level":30,"time":1794914102846,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/8d39961b-89b2-4083-9812-50ce2b1c27c8/timeline","host":"127.0.0.1:42241","remoteAddress":"127.0.0.1","remotePort":52326},"msg":"incoming request"}
{"level":30,"time":1794914102847,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","res":{"statusCode":200},"responseTime":1.6337540000000104,"msg":"request completed"}
{"level":30,"time":1794914102849,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34263","remoteAddress":"127.0.0.1","remotePort":37630},"msg":"incoming request"}
{"level":30,"time":1794914102851,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","res":{"statusCode":201},"responseTime":2.445255999999972,"msg":"request completed"}
{"level":30,"time":1794914102852,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/5d1c9c2c-ab00-400c-8ed1-bd0356cb4f72/command-roles","host":"127.0.0.1:40801","remoteAddress":"127.0.0.1","remotePort":50250},"msg":"incoming request"}
{"level":30,"time":1794914102854,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","res":{"statusCode":201},"responseTime":1.8533860000000004,"msg":"request completed"}
{"level":30,"time":1794914102854,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/5d1c9c2c-ab00-400c-8ed1-bd0356cb4f72/command-roles","host":"127.0.0.1:43677","remoteAddress":"127.0.0.1","remotePort":45894},"msg":"incoming request"}
{"level":30,"time":1794914102856,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-f","res":{"statusCode":201},"responseTime":1.5703550000000064,"msg":"request completed"}
{"level":30,"time":1794914102857,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/5d1c9c2c-ab00-400c-8ed1-bd0356cb4f72/timeline","host":"127.0.0.1:39043","remoteAddress":"127.0.0.1","remotePort":56696},"msg":"incoming request"}
{"level":30,"time":1794914102858,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-g","res":{"statusCode":200},"responseTime":1.3550809999999842,"msg":"request completed"}
{"level":30,"time":1794914102860,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37697","remoteAddress":"127.0.0.1","remotePort":38700},"msg":"incoming request"}
{"level":30,"time":1794914102862,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-h","res":{"statusCode":201},"responseTime":2.4595930000000408,"msg":"request completed"}
{"level":30,"time":1794914102863,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/994328e5-000b-4435-9f1e-fcee3190f1ad/activation","host":"127.0.0.1:34203","remoteAddress":"127.0.0.1","remotePort":44856},"msg":"incoming request"}
{"level":30,"time":1794914102864,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-i","res":{"statusCode":404},"responseTime":1.3016410000000178,"msg":"request completed"}
{"level":30,"time":1794914102865,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/994328e5-000b-4435-9f1e-fcee3190f1ad/command-roles","host":"127.0.0.1:39563","remoteAddress":"127.0.0.1","remotePort":56004},"msg":"incoming request"}
{"level":30,"time":1794914102866,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-j","res":{"statusCode":404},"responseTime":1.053576000000021,"msg":"request completed"}
{"level":30,"time":1794914102867,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/994328e5-000b-4435-9f1e-fcee3190f1ad/closure","host":"127.0.0.1:43181","remoteAddress":"127.0.0.1","remotePort":55130},"msg":"incoming request"}
{"level":30,"time":1794914102868,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-k","res":{"statusCode":404},"responseTime":1.3680249999999887,"msg":"request completed"}
{"level":30,"time":1794914102869,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/994328e5-000b-4435-9f1e-fcee3190f1ad/activation","host":"127.0.0.1:45057","remoteAddress":"127.0.0.1","remotePort":57036},"msg":"incoming request"}
{"level":30,"time":1794914102871,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7197049999999763,"msg":"request completed"}
{"level":30,"time":1794914102872,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38145","remoteAddress":"127.0.0.1","remotePort":53856},"msg":"incoming request"}
{"level":30,"time":1794914102874,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-m","res":{"statusCode":201},"responseTime":2.166643000000022,"msg":"request completed"}
{"level":30,"time":1794914102874,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/130c1ff1-25ba-4ebd-87ae-fe991d2dcf4e/closure","host":"127.0.0.1:37625","remoteAddress":"127.0.0.1","remotePort":46700},"msg":"incoming request"}
{"level":30,"time":1794914102878,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-n","res":{"statusCode":200},"responseTime":4.07994199999996,"msg":"request completed"}
{"level":30,"time":1794914102879,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/130c1ff1-25ba-4ebd-87ae-fe991d2dcf4e/closure","host":"127.0.0.1:36741","remoteAddress":"127.0.0.1","remotePort":36954},"msg":"incoming request"}
{"level":30,"time":1794914102881,"pid":76085,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-o","res":{"statusCode":409},"responseTime":1.8011380000000372,"msg":"request completed"}
{"level":30,"time":1794914103121,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:46131","remoteAddress":"127.0.0.1","remotePort":48506},"msg":"incoming request"}
{"level":30,"time":1794914103126,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":5.381531999999993,"msg":"request completed"}
{"level":30,"time":1794914103129,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:42301","remoteAddress":"127.0.0.1","remotePort":42972},"msg":"incoming request"}
{"level":30,"time":1794914103132,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":200},"responseTime":2.747842999999989,"msg":"request completed"}
{"level":30,"time":1794914103133,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45571","remoteAddress":"127.0.0.1","remotePort":43580},"msg":"incoming request"}
{"level":30,"time":1794914103135,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":200},"responseTime":1.8508719999999812,"msg":"request completed"}
{"level":30,"time":1794914103136,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/34654e2f-6f4a-4ec7-bac9-7e2a0821476e","host":"127.0.0.1:39485","remoteAddress":"127.0.0.1","remotePort":44474},"msg":"incoming request"}
{"level":30,"time":1794914103138,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":200},"responseTime":2.218189999999993,"msg":"request completed"}
{"level":30,"time":1794914103139,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43479","remoteAddress":"127.0.0.1","remotePort":51810},"msg":"incoming request"}
{"level":30,"time":1794914103139,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":401},"responseTime":0.42667000000000144,"msg":"request completed"}
{"level":30,"time":1794914103141,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36435","remoteAddress":"127.0.0.1","remotePort":44408},"msg":"incoming request"}
{"level":30,"time":1794914103142,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":403},"responseTime":1.0617310000000089,"msg":"request completed"}
{"level":30,"time":1794914103143,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/aaadfda6-8060-4c4f-8ce3-b763fc59bde8","host":"127.0.0.1:36281","remoteAddress":"127.0.0.1","remotePort":33344},"msg":"incoming request"}
{"level":30,"time":1794914103146,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":200},"responseTime":3.053997000000038,"msg":"request completed"}
{"level":30,"time":1794914103147,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:43953","remoteAddress":"127.0.0.1","remotePort":55962},"msg":"incoming request"}
{"level":30,"time":1794914103149,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2001960000000054,"msg":"request completed"}
{"level":30,"time":1794914103150,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=52004aaa-2d90-4862-bfb0-db9e2360f4d7&page_size=50","host":"127.0.0.1:43457","remoteAddress":"127.0.0.1","remotePort":35554},"msg":"incoming request"}
{"level":30,"time":1794914103152,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5913739999999734,"msg":"request completed"}
{"level":30,"time":1794914103153,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:44941","remoteAddress":"127.0.0.1","remotePort":59874},"msg":"incoming request"}
{"level":30,"time":1794914103154,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","res":{"statusCode":403},"responseTime":1.1482640000000401,"msg":"request completed"}
{"level":30,"time":1794914103155,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:39767","remoteAddress":"127.0.0.1","remotePort":48398},"msg":"incoming request"}
{"level":30,"time":1794914103157,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","res":{"statusCode":200},"responseTime":1.3503729999999905,"msg":"request completed"}
{"level":30,"time":1794914103157,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42629","remoteAddress":"127.0.0.1","remotePort":36958},"msg":"incoming request"}
{"level":30,"time":1794914103159,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","res":{"statusCode":422},"responseTime":1.6787980000000289,"msg":"request completed"}
{"level":30,"time":1794914103160,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36367","remoteAddress":"127.0.0.1","remotePort":51290},"msg":"incoming request"}
{"level":30,"time":1794914103162,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5431049999999686,"msg":"request completed"}
{"level":30,"time":1794914103162,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=52004aaa-2d90-4862-bfb0-db9e2360f4d7&action_type=record_view","host":"127.0.0.1:44653","remoteAddress":"127.0.0.1","remotePort":57050},"msg":"incoming request"}
{"level":30,"time":1794914103164,"pid":76150,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","res":{"statusCode":200},"responseTime":1.3896159999999895,"msg":"request completed"}
{"level":30,"time":1794914103400,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39961","remoteAddress":"127.0.0.1","remotePort":40756},"msg":"incoming request"}
{"level":30,"time":1794914103414,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":13.511669999999981,"msg":"request completed"}
{"level":30,"time":1794914103417,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/e3fabdbd-ffb6-41ff-b674-018c253bd5d8/timeline","host":"127.0.0.1:35461","remoteAddress":"127.0.0.1","remotePort":41562},"msg":"incoming request"}
{"level":30,"time":1794914103420,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":200},"responseTime":2.888295999999997,"msg":"request completed"}
{"level":30,"time":1794914103422,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38725","remoteAddress":"127.0.0.1","remotePort":33652},"msg":"incoming request"}
{"level":30,"time":1794914103425,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1990800000000092,"msg":"request completed"}
{"level":30,"time":1794914103426,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39855","remoteAddress":"127.0.0.1","remotePort":34226},"msg":"incoming request"}
{"level":30,"time":1794914103427,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":409},"responseTime":1.5036190000000147,"msg":"request completed"}
{"level":30,"time":1794914103429,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37655","remoteAddress":"127.0.0.1","remotePort":40774},"msg":"incoming request"}
{"level":30,"time":1794914103432,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":201},"responseTime":3.0257650000000353,"msg":"request completed"}
{"level":30,"time":1794914103433,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43163","remoteAddress":"127.0.0.1","remotePort":58140},"msg":"incoming request"}
{"level":30,"time":1794914103436,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":201},"responseTime":2.504827999999975,"msg":"request completed"}
{"level":30,"time":1794914103437,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44597","remoteAddress":"127.0.0.1","remotePort":35806},"msg":"incoming request"}
{"level":30,"time":1794914103439,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":201},"responseTime":2.264587000000006,"msg":"request completed"}
{"level":30,"time":1794914103440,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42839","remoteAddress":"127.0.0.1","remotePort":38122},"msg":"incoming request"}
{"level":30,"time":1794914103442,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":201},"responseTime":2.2803370000000314,"msg":"request completed"}
{"level":30,"time":1794914103443,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:37255","remoteAddress":"127.0.0.1","remotePort":53674},"msg":"incoming request"}
{"level":30,"time":1794914103445,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7154970000000276,"msg":"request completed"}
{"level":30,"time":1794914103447,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35173","remoteAddress":"127.0.0.1","remotePort":43550},"msg":"incoming request"}
{"level":30,"time":1794914103449,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-a","res":{"statusCode":201},"responseTime":2.224021999999991,"msg":"request completed"}
{"level":30,"time":1794914103450,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/a4b6cc62-59ec-4063-b91c-c80b78186e1e","host":"127.0.0.1:44723","remoteAddress":"127.0.0.1","remotePort":54038},"msg":"incoming request"}
{"level":30,"time":1794914103452,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-b","res":{"statusCode":404},"responseTime":1.3719330000000127,"msg":"request completed"}
{"level":30,"time":1794914103452,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:33135","remoteAddress":"127.0.0.1","remotePort":53378},"msg":"incoming request"}
{"level":30,"time":1794914103454,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-c","res":{"statusCode":200},"responseTime":1.519660999999985,"msg":"request completed"}
{"level":30,"time":1794914103455,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/a4b6cc62-59ec-4063-b91c-c80b78186e1e","host":"127.0.0.1:42967","remoteAddress":"127.0.0.1","remotePort":39376},"msg":"incoming request"}
{"level":30,"time":1794914103456,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-d","res":{"statusCode":404},"responseTime":1.3582170000000247,"msg":"request completed"}
{"level":30,"time":1794914103457,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/a4b6cc62-59ec-4063-b91c-c80b78186e1e/timeline","host":"127.0.0.1:43153","remoteAddress":"127.0.0.1","remotePort":44282},"msg":"incoming request"}
{"level":30,"time":1794914103458,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-e","res":{"statusCode":404},"responseTime":1.0514520000000402,"msg":"request completed"}
{"level":30,"time":1794914103459,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40169","remoteAddress":"127.0.0.1","remotePort":44906},"msg":"incoming request"}
{"level":30,"time":1794914103461,"pid":76184,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-f","res":{"statusCode":201},"responseTime":2.0267920000000004,"msg":"request completed"}
{"level":30,"time":1794914103708,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35407","remoteAddress":"127.0.0.1","remotePort":54806},"msg":"incoming request"}
{"level":30,"time":1794914103723,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":14.38796499999998,"msg":"request completed"}
{"level":30,"time":1794914103726,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46749","remoteAddress":"127.0.0.1","remotePort":51604},"msg":"incoming request"}
{"level":30,"time":1794914103730,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":201},"responseTime":3.878524000000027,"msg":"request completed"}
{"level":30,"time":1794914103731,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:38693","remoteAddress":"127.0.0.1","remotePort":55354},"msg":"incoming request"}
{"level":30,"time":1794914103734,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6415140000000292,"msg":"request completed"}
{"level":30,"time":1794914103735,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45703","remoteAddress":"127.0.0.1","remotePort":48748},"msg":"incoming request"}
{"level":30,"time":1794914103738,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":201},"responseTime":2.603482999999983,"msg":"request completed"}
{"level":30,"time":1794914103739,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:39375","remoteAddress":"127.0.0.1","remotePort":47382},"msg":"incoming request"}
{"level":30,"time":1794914103741,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":200},"responseTime":1.2564760000000206,"msg":"request completed"}
{"level":30,"time":1794914103742,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:40107","remoteAddress":"127.0.0.1","remotePort":34276},"msg":"incoming request"}
{"level":30,"time":1794914103743,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":200},"responseTime":1.2833669999999984,"msg":"request completed"}
{"level":30,"time":1794914103744,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:34719","remoteAddress":"127.0.0.1","remotePort":56778},"msg":"incoming request"}
{"level":30,"time":1794914103746,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3392020000000002,"msg":"request completed"}
{"level":30,"time":1794914103747,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:34929","remoteAddress":"127.0.0.1","remotePort":52650},"msg":"incoming request"}
{"level":30,"time":1794914103748,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":200},"responseTime":1.45687300000003,"msg":"request completed"}
{"level":30,"time":1794914103749,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:37007","remoteAddress":"127.0.0.1","remotePort":39106},"msg":"incoming request"}
{"level":30,"time":1794914103751,"pid":76194,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-9","res":{"statusCode":200},"responseTime":1.4891829999999686,"msg":"request completed"}
{"level":30,"time":1794914103991,"pid":76204,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:37173","remoteAddress":"127.0.0.1","remotePort":41704},"msg":"incoming request"}
{"level":30,"time":1794914104038,"pid":76204,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":47.293747999999994,"msg":"request completed"}
{"level":30,"time":1794914104245,"pid":76204,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:42189","remoteAddress":"127.0.0.1","remotePort":33452},"msg":"incoming request"}
{"level":30,"time":1794914104249,"pid":76204,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":200},"responseTime":3.003401999999994,"msg":"request completed"}
{"level":30,"time":1794914104482,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:39857","remoteAddress":"127.0.0.1","remotePort":57870},"msg":"incoming request"}
{"level":30,"time":1794914104510,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":201},"responseTime":27.726951000000014,"msg":"request completed"}
{"level":30,"time":1794914104513,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37689","remoteAddress":"127.0.0.1","remotePort":42894},"msg":"incoming request"}
{"level":30,"time":1794914104515,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":200},"responseTime":2.453482000000008,"msg":"request completed"}
{"level":30,"time":1794914104517,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:40415","remoteAddress":"127.0.0.1","remotePort":56254},"msg":"incoming request"}
{"level":30,"time":1794914104518,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":400},"responseTime":1.5066960000000336,"msg":"request completed"}
{"level":30,"time":1794914104519,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:39153","remoteAddress":"127.0.0.1","remotePort":38564},"msg":"incoming request"}
{"level":30,"time":1794914104522,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":201},"responseTime":3.0668609999999603,"msg":"request completed"}
{"level":30,"time":1794914104524,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/2d67acc2-1cc3-4dfe-8cce-532275c6f803/revoke","host":"127.0.0.1:37257","remoteAddress":"127.0.0.1","remotePort":54028},"msg":"incoming request"}
{"level":30,"time":1794914104527,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":204},"responseTime":2.37263999999999,"msg":"request completed"}
{"level":30,"time":1794914104528,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36117","remoteAddress":"127.0.0.1","remotePort":33648},"msg":"incoming request"}
{"level":30,"time":1794914104531,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9888100000000009,"msg":"request completed"}
{"level":30,"time":1794914104531,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35615","remoteAddress":"127.0.0.1","remotePort":49416},"msg":"incoming request"}
{"level":30,"time":1794914104533,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3503630000000157,"msg":"request completed"}
{"level":30,"time":1794914104534,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34595","remoteAddress":"127.0.0.1","remotePort":45166},"msg":"incoming request"}
{"level":30,"time":1794914104535,"pid":76216,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6797900000000254,"msg":"request completed"}
{"level":30,"time":1794914104765,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40441","remoteAddress":"127.0.0.1","remotePort":41302},"msg":"incoming request"}
{"level":30,"time":1794914104770,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-1","res":{"statusCode":200},"responseTime":5.2155019999999865,"msg":"request completed"}
{"level":30,"time":1794914104773,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45225","remoteAddress":"127.0.0.1","remotePort":46780},"msg":"incoming request"}
{"level":30,"time":1794914104773,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-2","res":{"statusCode":401},"responseTime":0.1938329999999837,"msg":"request completed"}
{"level":30,"time":1794914104775,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:34013","remoteAddress":"127.0.0.1","remotePort":46642},"msg":"incoming request"}
{"level":30,"time":1794914104778,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-3","res":{"statusCode":200},"responseTime":3.006338000000028,"msg":"request completed"}
{"level":30,"time":1794914104779,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35101","remoteAddress":"127.0.0.1","remotePort":55284},"msg":"incoming request"}
{"level":30,"time":1794914104781,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7051679999999863,"msg":"request completed"}
{"level":30,"time":1794914104782,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43197","remoteAddress":"127.0.0.1","remotePort":58066},"msg":"incoming request"}
{"level":30,"time":1794914104783,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4476650000000006,"msg":"request completed"}
{"level":30,"time":1794914104784,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36721","remoteAddress":"127.0.0.1","remotePort":44884},"msg":"incoming request"}
{"level":30,"time":1794914104785,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4509360000000129,"msg":"request completed"}
{"level":30,"time":1794914104786,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:40291","remoteAddress":"127.0.0.1","remotePort":47310},"msg":"incoming request"}
{"level":30,"time":1794914104788,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-7","res":{"statusCode":200},"responseTime":1.314515,"msg":"request completed"}
{"level":30,"time":1794914104789,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:45625","remoteAddress":"127.0.0.1","remotePort":49648},"msg":"incoming request"}
{"level":30,"time":1794914104790,"pid":76226,"hostname":"pivota-sandbox-e9ed8b97","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9824920000000077,"msg":"request completed"}

 Test Files  7 passed (7)
      Tests  36 passed (36)
   Start at  11:15:02
   Duration  2.31s (transform 90ms, setup 22ms, import 936ms, tests 969ms, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 77[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 146[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 170[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 197[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 102[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 11:15:04
[2m   Duration [22m 1.64s[2m (transform 149ms, setup 124ms, collect 569ms, tests 691ms, environment 959ms, prepare 142ms)[22m
```

