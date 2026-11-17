---
phase: 03
gate_status: passed
build_command: "npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app"
test_command: "npm test && npm test -w frontend/design-system"
last_updated: 2026-11-17T22:07:05Z
tests_disabled_during_fixes: none
shadowed_sources: 0
review_blockers_open: 0
boot_smoke: pass
browser_suite: pass
browser_headroom_mb: 5071
browser_headroom_naive_mb: 1956
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
  - wave: 7
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 8
    build: pass
    tests: pass
    fix_attempts: 0
---

## Wave 1

- Build: `npm run build` → pass
- Tests: `npm test` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

 ❯ src/modules/incident-ops/activation.test.ts (4 tests | 4 skipped) 36ms
 ❯ src/modules/integration-gateway/eventbus.test.ts (4 tests | 4 skipped) 37ms
 ❯ src/modules/incident-ops/incidents.test.ts (5 tests | 5 skipped) 37ms
 ❯ src/modules/auth-org/admin.test.ts (7 tests | 7 skipped) 35ms
 ❯ src/modules/incident-ops/tasks.test.ts (5 tests | 5 skipped) 35ms
 ❯ src/modules/integration-gateway/gateway.test.ts (5 tests | 5 skipped) 37ms
 ❯ src/modules/auth-org/routes.test.ts (6 tests | 6 skipped) 34ms
 ❯ src/modules/incident-ops/operating-picture.test.ts (5 tests | 5 skipped) 33ms

⎯⎯⎯⎯⎯⎯ Failed Suites 8 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/auth-org/admin.test.ts [ src/modules/auth-org/admin.test.ts ]
 FAIL  src/modules/auth-org/routes.test.ts [ src/modules/auth-org/routes.test.ts ]
 FAIL  src/modules/incident-ops/activation.test.ts [ src/modules/incident-ops/activation.test.ts ]
 FAIL  src/modules/incident-ops/incidents.test.ts [ src/modules/incident-ops/incidents.test.ts ]
 FAIL  src/modules/incident-ops/operating-picture.test.ts [ src/modules/incident-ops/operating-picture.test.ts ]
 FAIL  src/modules/incident-ops/tasks.test.ts [ src/modules/incident-ops/tasks.test.ts ]
 FAIL  src/modules/integration-gateway/gateway.test.ts [ src/modules/integration-gateway/gateway.test.ts ]
Error: connect ECONNREFUSED ::1:5432
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/16]⎯

 FAIL  src/modules/auth-org/admin.test.ts [ src/modules/auth-org/admin.test.ts ]
 FAIL  src/modules/auth-org/routes.test.ts [ src/modules/auth-org/routes.test.ts ]
 FAIL  src/modules/incident-ops/activation.test.ts [ src/modules/incident-ops/activation.test.ts ]
 FAIL  src/modules/incident-ops/incidents.test.ts [ src/modules/incident-ops/incidents.test.ts ]
 FAIL  src/modules/incident-ops/operating-picture.test.ts [ src/modules/incident-ops/operating-picture.test.ts ]
 FAIL  src/modules/incident-ops/tasks.test.ts [ src/modules/incident-ops/tasks.test.ts ]
 FAIL  src/modules/integration-gateway/gateway.test.ts [ src/modules/integration-gateway/gateway.test.ts ]
Error: connect ECONNREFUSED 127.0.0.1:5432
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/16]⎯

 FAIL  src/modules/integration-gateway/eventbus.test.ts [ src/modules/integration-gateway/eventbus.test.ts ]
NatsError: CONNECTION_REFUSED
 ❯ NatsError.errorForCode ../node_modules/nats/nats-base-client/core.ts:170:11
 ❯ NodeTransport.<anonymous> ../node_modules/nats/src/node_transport.ts:102:20
 ❯ rejected ../node_modules/nats/lib/src/node_transport.js:6:65

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/16]⎯

 FAIL  src/modules/integration-gateway/eventbus.test.ts [ src/modules/integration-gateway/eventbus.test.ts ]
TypeError: Cannot read properties of undefined (reading 'close')
 ❯ src/modules/integration-gateway/eventbus.test.ts:126:55
    124|
    125| afterAll(async () => {
    126|   await new Promise<void>((resolve) => receiverServer.close(() => reso…
       |                                                       ^
    127|   await pool.end();
    128| });
 ❯ src/modules/integration-gateway/eventbus.test.ts:126:9

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/16]⎯


 Test Files  8 failed (8)
      Tests  41 skipped (41)
   Start at  13:31:33
   Duration  807ms (transform 307ms, setup 37ms, import 1.41s, tests 284ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/daytona/project/backend
npm error workspace @epmp/backend@0.1.0
npm error location /home/daytona/project/backend
npm error command failed
npm error command sh -c vitest run
[gate] wave 1 tests: npm test (timeout 600s)

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794922331457,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:35843","remoteAddress":"127.0.0.1","remotePort":40778},"msg":"incoming request"}
{"level":30,"time":1794922331459,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42745","remoteAddress":"127.0.0.1","remotePort":43274},"msg":"incoming request"}
{"level":30,"time":1794922331470,"pid":21387,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:44965","remoteAddress":"127.0.0.1","remotePort":37440},"msg":"incoming request"}
{"level":30,"time":1794922331482,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":22.87954400000001,"msg":"request completed"}
{"level":30,"time":1794922331485,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/5e251a9b-a1b3-45ce-983b-c8702894ee5e/timeline","host":"127.0.0.1:40027","remoteAddress":"127.0.0.1","remotePort":39382},"msg":"incoming request"}
{"level":30,"time":1794922331489,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.655497999999966,"msg":"request completed"}
{"level":30,"time":1794922331491,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":33.586562000000015,"msg":"request completed"}
{"level":30,"time":1794922331491,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40379","remoteAddress":"127.0.0.1","remotePort":39082},"msg":"incoming request"}
{"level":30,"time":1794922331494,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45249","remoteAddress":"127.0.0.1","remotePort":45828},"msg":"incoming request"}
{"level":30,"time":1794922331496,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7926089999999704,"msg":"request completed"}
{"level":30,"time":1794922331497,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":5.050615999999991,"msg":"request completed"}
{"level":30,"time":1794922331498,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45565","remoteAddress":"127.0.0.1","remotePort":39586},"msg":"incoming request"}
{"level":30,"time":1794922331498,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43843","remoteAddress":"127.0.0.1","remotePort":43466},"msg":"incoming request"}
{"level":30,"time":1794922331499,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":1.8553009999999972,"msg":"request completed"}
{"level":30,"time":1794922331500,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7007000000000403,"msg":"request completed"}
{"level":30,"time":1794922331501,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45673","remoteAddress":"127.0.0.1","remotePort":43274},"msg":"incoming request"}
{"level":30,"time":1794922331501,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:46811","remoteAddress":"127.0.0.1","remotePort":43778},"msg":"incoming request"}
{"level":30,"time":1794922331504,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.1802059999999983,"msg":"request completed"}
{"level":30,"time":1794922331504,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.5570940000000064,"msg":"request completed"}
{"level":30,"time":1794922331506,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40835","remoteAddress":"127.0.0.1","remotePort":43368},"msg":"incoming request"}
{"level":30,"time":1794922331506,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/8c685aaf-38a1-4039-af13-dfef6ae65534/revoke","host":"127.0.0.1:40093","remoteAddress":"127.0.0.1","remotePort":44614},"msg":"incoming request"}
{"level":30,"time":1794922331509,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":2.9823049999999967,"msg":"request completed"}
{"level":30,"time":1794922331509,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":3.008194000000003,"msg":"request completed"}
{"level":30,"time":1794922331510,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44701","remoteAddress":"127.0.0.1","remotePort":38224},"msg":"incoming request"}
{"level":30,"time":1794922331512,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:42501","remoteAddress":"127.0.0.1","remotePort":60434},"msg":"incoming request"}
{"level":30,"time":1794922331513,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":3.3588809999999967,"msg":"request completed"}
{"level":30,"time":1794922331514,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33937","remoteAddress":"127.0.0.1","remotePort":35058},"msg":"incoming request"}
{"level":30,"time":1794922331514,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3049239999999713,"msg":"request completed"}
{"level":30,"time":1794922331515,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44589","remoteAddress":"127.0.0.1","remotePort":44686},"msg":"incoming request"}
{"level":30,"time":1794922331516,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5005950000000325,"msg":"request completed"}
{"level":30,"time":1794922331517,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":3.147375000000011,"msg":"request completed"}
{"level":30,"time":1794922331517,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:42449","remoteAddress":"127.0.0.1","remotePort":54290},"msg":"incoming request"}
{"level":30,"time":1794922331518,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:43655","remoteAddress":"127.0.0.1","remotePort":58796},"msg":"incoming request"}
{"level":30,"time":1794922331520,"pid":21389,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.047501000000011,"msg":"request completed"}
{"level":30,"time":1794922331521,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.246514999999988,"msg":"request completed"}
{"level":30,"time":1794922331523,"pid":21387,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":50.16703699999999,"msg":"request completed"}
{"level":30,"time":1794922331523,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44585","remoteAddress":"127.0.0.1","remotePort":56876},"msg":"incoming request"}
{"level":30,"time":1794922331526,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.3502249999999663,"msg":"request completed"}
{"level":30,"time":1794922331527,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/0b60c03b-3d03-43a4-84fc-d80ba771c40e","host":"127.0.0.1:45519","remoteAddress":"127.0.0.1","remotePort":42160},"msg":"incoming request"}
{"level":30,"time":1794922331529,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":1.8673939999999902,"msg":"request completed"}
{"level":30,"time":1794922331530,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:36607","remoteAddress":"127.0.0.1","remotePort":33730},"msg":"incoming request"}
{"level":30,"time":1794922331532,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.0539929999999913,"msg":"request completed"}
{"level":30,"time":1794922331533,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/0b60c03b-3d03-43a4-84fc-d80ba771c40e","host":"127.0.0.1:35275","remoteAddress":"127.0.0.1","remotePort":52156},"msg":"incoming request"}
{"level":30,"time":1794922331535,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":1.5745540000000346,"msg":"request completed"}
{"level":30,"time":1794922331535,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/0b60c03b-3d03-43a4-84fc-d80ba771c40e/timeline","host":"127.0.0.1:46221","remoteAddress":"127.0.0.1","remotePort":40876},"msg":"incoming request"}
{"level":30,"time":1794922331537,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":1.2993069999999989,"msg":"request completed"}
{"level":30,"time":1794922331538,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39289","remoteAddress":"127.0.0.1","remotePort":35058},"msg":"incoming request"}
{"level":30,"time":1794922331541,"pid":21388,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.8734509999999887,"msg":"request completed"}
{"level":30,"time":1794922331729,"pid":21387,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:35845","remoteAddress":"127.0.0.1","remotePort":55942},"msg":"incoming request"}
{"level":30,"time":1794922331733,"pid":21387,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.5090830000000324,"msg":"request completed"}
{"level":30,"time":1794922331770,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36057","remoteAddress":"127.0.0.1","remotePort":35362},"msg":"incoming request"}
{"level":30,"time":1794922331785,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":14.55521699999997,"msg":"request completed"}
{"level":30,"time":1794922331788,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/activation","host":"127.0.0.1:42137","remoteAddress":"127.0.0.1","remotePort":55794},"msg":"incoming request"}
{"level":30,"time":1794922331791,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.9534510000000296,"msg":"request completed"}
{"level":30,"time":1794922331792,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff","host":"127.0.0.1:37219","remoteAddress":"127.0.0.1","remotePort":52194},"msg":"incoming request"}
{"level":30,"time":1794922331792,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35833","remoteAddress":"127.0.0.1","remotePort":56518},"msg":"incoming request"}
{"level":30,"time":1794922331795,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":3.2125469999999723,"msg":"request completed"}
{"level":30,"time":1794922331797,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/command-roles","host":"127.0.0.1:45371","remoteAddress":"127.0.0.1","remotePort":36588},"msg":"incoming request"}
{"level":30,"time":1794922331797,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":4.770278999999988,"msg":"request completed"}
{"level":30,"time":1794922331800,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":2.9696309999999926,"msg":"request completed"}
{"level":30,"time":1794922331801,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44379","remoteAddress":"127.0.0.1","remotePort":56750},"msg":"incoming request"}
{"level":30,"time":1794922331801,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/activation","host":"127.0.0.1:42761","remoteAddress":"127.0.0.1","remotePort":54840},"msg":"incoming request"}
{"level":30,"time":1794922331803,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":1.7413870000000031,"msg":"request completed"}
{"level":30,"time":1794922331804,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33963","remoteAddress":"127.0.0.1","remotePort":43016},"msg":"incoming request"}
{"level":30,"time":1794922331805,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.820888000000025,"msg":"request completed"}
{"level":30,"time":1794922331806,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/timeline","host":"127.0.0.1:45857","remoteAddress":"127.0.0.1","remotePort":54720},"msg":"incoming request"}
{"level":30,"time":1794922331807,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.462966999999992,"msg":"request completed"}
{"level":30,"time":1794922331808,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36639","remoteAddress":"127.0.0.1","remotePort":44076},"msg":"incoming request"}
{"level":30,"time":1794922331808,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3552289999999516,"msg":"request completed"}
{"level":30,"time":1794922331810,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/activation","host":"127.0.0.1:41651","remoteAddress":"127.0.0.1","remotePort":56646},"msg":"incoming request"}
{"level":30,"time":1794922331812,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.6682089999999903,"msg":"request completed"}
{"level":30,"time":1794922331813,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff","host":"127.0.0.1:46361","remoteAddress":"127.0.0.1","remotePort":43734},"msg":"incoming request"}
{"level":30,"time":1794922331815,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.387728999999979,"msg":"request completed"}
{"level":30,"time":1794922331816,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/command-roles","host":"127.0.0.1:40447","remoteAddress":"127.0.0.1","remotePort":50716},"msg":"incoming request"}
{"level":30,"time":1794922331818,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":9.898721000000023,"msg":"request completed"}
{"level":30,"time":1794922331819,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.080338999999981,"msg":"request completed"}
{"level":30,"time":1794922331819,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41945","remoteAddress":"127.0.0.1","remotePort":58830},"msg":"incoming request"}
{"level":30,"time":1794922331820,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/timeline","host":"127.0.0.1:40427","remoteAddress":"127.0.0.1","remotePort":44498},"msg":"incoming request"}
{"level":30,"time":1794922331822,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":2.7311839999999847,"msg":"request completed"}
{"level":30,"time":1794922331822,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":2.1052990000000023,"msg":"request completed"}
{"level":30,"time":1794922331823,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/eecc4a0d-8503-44d6-984f-ae2f8709b967/timeline","host":"127.0.0.1:36975","remoteAddress":"127.0.0.1","remotePort":44742},"msg":"incoming request"}
{"level":30,"time":1794922331823,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/closure","host":"127.0.0.1:39663","remoteAddress":"127.0.0.1","remotePort":33434},"msg":"incoming request"}
{"level":30,"time":1794922331826,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.5208900000000085,"msg":"request completed"}
{"level":30,"time":1794922331828,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":4.149604999999951,"msg":"request completed"}
{"level":30,"time":1794922331828,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33955","remoteAddress":"127.0.0.1","remotePort":38788},"msg":"incoming request"}
{"level":30,"time":1794922331828,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/04a9667f-99de-4862-9c8f-4781992159ff/timeline","host":"127.0.0.1:37517","remoteAddress":"127.0.0.1","remotePort":47016},"msg":"incoming request"}
{"level":30,"time":1794922331830,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.5777760000000285,"msg":"request completed"}
{"level":30,"time":1794922331830,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.081865999999991,"msg":"request completed"}
{"level":30,"time":1794922331831,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/625c737f-850d-4cbf-b7e5-9ebf797b661e/status","host":"127.0.0.1:37933","remoteAddress":"127.0.0.1","remotePort":51324},"msg":"incoming request"}
{"level":30,"time":1794922331832,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41173","remoteAddress":"127.0.0.1","remotePort":54888},"msg":"incoming request"}
{"level":30,"time":1794922331833,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":1.7487800000000107,"msg":"request completed"}
{"level":30,"time":1794922331839,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45363","remoteAddress":"127.0.0.1","remotePort":57582},"msg":"incoming request"}
{"level":30,"time":1794922331840,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":7.835368999999957,"msg":"request completed"}
{"level":30,"time":1794922331841,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/1ce8f8d9-2760-469e-8a45-42292e931094/command-roles","host":"127.0.0.1:40425","remoteAddress":"127.0.0.1","remotePort":57868},"msg":"incoming request"}
{"level":30,"time":1794922331843,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.957427999999993,"msg":"request completed"}
{"level":30,"time":1794922331844,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.7668110000000183,"msg":"request completed"}
{"level":30,"time":1794922331844,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/af2cbcd4-aa10-44c8-b8b7-db2ada3786b8/status","host":"127.0.0.1:38125","remoteAddress":"127.0.0.1","remotePort":34760},"msg":"incoming request"}
{"level":30,"time":1794922331845,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/1ce8f8d9-2760-469e-8a45-42292e931094/command-roles","host":"127.0.0.1:39389","remoteAddress":"127.0.0.1","remotePort":48998},"msg":"incoming request"}
{"level":30,"time":1794922331847,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":2.613443000000018,"msg":"request completed"}
{"level":30,"time":1794922331847,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.880223000000001,"msg":"request completed"}
{"level":30,"time":1794922331848,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/af2cbcd4-aa10-44c8-b8b7-db2ada3786b8/status","host":"127.0.0.1:44487","remoteAddress":"127.0.0.1","remotePort":33534},"msg":"incoming request"}
{"level":30,"time":1794922331849,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/1ce8f8d9-2760-469e-8a45-42292e931094/timeline","host":"127.0.0.1:42693","remoteAddress":"127.0.0.1","remotePort":58756},"msg":"incoming request"}
{"level":30,"time":1794922331851,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":2.234772000000021,"msg":"request completed"}
{"level":30,"time":1794922331851,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.391803999999979,"msg":"request completed"}
{"level":30,"time":1794922331852,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/af2cbcd4-aa10-44c8-b8b7-db2ada3786b8/status","host":"127.0.0.1:35609","remoteAddress":"127.0.0.1","remotePort":44880},"msg":"incoming request"}
{"level":30,"time":1794922331853,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42801","remoteAddress":"127.0.0.1","remotePort":53474},"msg":"incoming request"}
{"level":30,"time":1794922331854,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.9384259999999927,"msg":"request completed"}
{"level":30,"time":1794922331855,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/af2cbcd4-aa10-44c8-b8b7-db2ada3786b8/status","host":"127.0.0.1:39659","remoteAddress":"127.0.0.1","remotePort":57538},"msg":"incoming request"}
{"level":30,"time":1794922331856,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.3123640000000023,"msg":"request completed"}
{"level":30,"time":1794922331857,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/871767e7-bdb4-4526-a3ca-9533ccce89a4/activation","host":"127.0.0.1:44309","remoteAddress":"127.0.0.1","remotePort":56364},"msg":"incoming request"}
{"level":30,"time":1794922331858,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.6455229999999688,"msg":"request completed"}
{"level":30,"time":1794922331859,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/af2cbcd4-aa10-44c8-b8b7-db2ada3786b8/status","host":"127.0.0.1:42261","remoteAddress":"127.0.0.1","remotePort":37240},"msg":"incoming request"}
{"level":30,"time":1794922331859,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.677266999999972,"msg":"request completed"}
{"level":30,"time":1794922331860,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/871767e7-bdb4-4526-a3ca-9533ccce89a4/command-roles","host":"127.0.0.1:45841","remoteAddress":"127.0.0.1","remotePort":42144},"msg":"incoming request"}
{"level":30,"time":1794922331861,"pid":21474,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.3381259999999884,"msg":"request completed"}
{"level":30,"time":1794922331861,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.5217650000000162,"msg":"request completed"}
{"level":30,"time":1794922331862,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/871767e7-bdb4-4526-a3ca-9533ccce89a4/closure","host":"127.0.0.1:38771","remoteAddress":"127.0.0.1","remotePort":43118},"msg":"incoming request"}
{"level":30,"time":1794922331864,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.6400669999999877,"msg":"request completed"}
{"level":30,"time":1794922331873,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/871767e7-bdb4-4526-a3ca-9533ccce89a4/activation","host":"127.0.0.1:42979","remoteAddress":"127.0.0.1","remotePort":34110},"msg":"incoming request"}
{"level":30,"time":1794922331876,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.8030689999999936,"msg":"request completed"}
{"level":30,"time":1794922331877,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42455","remoteAddress":"127.0.0.1","remotePort":34874},"msg":"incoming request"}
{"level":30,"time":1794922331882,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":4.551910000000021,"msg":"request completed"}
{"level":30,"time":1794922331883,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/0a06f2f4-7bca-46d9-a34d-cbda4f1697c9/closure","host":"127.0.0.1:38101","remoteAddress":"127.0.0.1","remotePort":33394},"msg":"incoming request"}
{"level":30,"time":1794922331886,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":3.2497869999999693,"msg":"request completed"}
{"level":30,"time":1794922331887,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/0a06f2f4-7bca-46d9-a34d-cbda4f1697c9/closure","host":"127.0.0.1:42511","remoteAddress":"127.0.0.1","remotePort":58026},"msg":"incoming request"}
{"level":30,"time":1794922331889,"pid":21463,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.200818999999967,"msg":"request completed"}
{"level":30,"time":1794922332020,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:45851","remoteAddress":"127.0.0.1","remotePort":38508},"msg":"incoming request"}
{"level":30,"time":1794922332043,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":22.83122400000002,"msg":"request completed"}
{"level":30,"time":1794922332046,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:46613","remoteAddress":"127.0.0.1","remotePort":33866},"msg":"incoming request"}
{"level":30,"time":1794922332050,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.7932270000000017,"msg":"request completed"}
{"level":30,"time":1794922332051,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43393","remoteAddress":"127.0.0.1","remotePort":44232},"msg":"incoming request"}
{"level":30,"time":1794922332054,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.3111859999999638,"msg":"request completed"}
{"level":30,"time":1794922332055,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/b6599146-9db7-4c6f-b037-712de370a0ca","host":"127.0.0.1:40431","remoteAddress":"127.0.0.1","remotePort":47774},"msg":"incoming request"}
{"level":30,"time":1794922332058,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.8790619999999763,"msg":"request completed"}
{"level":30,"time":1794922332059,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40019","remoteAddress":"127.0.0.1","remotePort":48012},"msg":"incoming request"}
{"level":30,"time":1794922332059,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5493910000000142,"msg":"request completed"}
{"level":30,"time":1794922332061,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35551","remoteAddress":"127.0.0.1","remotePort":39500},"msg":"incoming request"}
{"level":30,"time":1794922332062,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.3678559999999607,"msg":"request completed"}
{"level":30,"time":1794922332063,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:33641","remoteAddress":"127.0.0.1","remotePort":53654},"msg":"incoming request"}
{"level":30,"time":1794922332067,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":3.518069999999966,"msg":"request completed"}
{"level":30,"time":1794922332067,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:39637","remoteAddress":"127.0.0.1","remotePort":54256},"msg":"incoming request"}
{"level":30,"time":1794922332074,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":6.035212000000001,"msg":"request completed"}
{"level":30,"time":1794922332075,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=eb3bea9b-d882-4769-9fa2-44a715b58237&page_size=50","host":"127.0.0.1:36301","remoteAddress":"127.0.0.1","remotePort":40566},"msg":"incoming request"}
{"level":30,"time":1794922332077,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.8449410000000057,"msg":"request completed"}
{"level":30,"time":1794922332078,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41509","remoteAddress":"127.0.0.1","remotePort":59562},"msg":"incoming request"}
{"level":30,"time":1794922332079,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.2246579999999767,"msg":"request completed"}
{"level":30,"time":1794922332081,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:34407","remoteAddress":"127.0.0.1","remotePort":35250},"msg":"incoming request"}
{"level":30,"time":1794922332082,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.429271999999969,"msg":"request completed"}
{"level":30,"time":1794922332083,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36663","remoteAddress":"127.0.0.1","remotePort":49056},"msg":"incoming request"}
{"level":30,"time":1794922332085,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":2.0896299999999997,"msg":"request completed"}
{"level":30,"time":1794922332086,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:41641","remoteAddress":"127.0.0.1","remotePort":60030},"msg":"incoming request"}
{"level":30,"time":1794922332088,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":1.8552000000000248,"msg":"request completed"}
{"level":30,"time":1794922332089,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=eb3bea9b-d882-4769-9fa2-44a715b58237&action_type=record_view","host":"127.0.0.1:38541","remoteAddress":"127.0.0.1","remotePort":56990},"msg":"incoming request"}
{"level":30,"time":1794922332091,"pid":21503,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.9379450000000134,"msg":"request completed"}
{"level":30,"time":1794922332139,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44059","remoteAddress":"127.0.0.1","remotePort":44614},"msg":"incoming request"}
{"level":30,"time":1794922332145,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.040206000000012,"msg":"request completed"}
{"level":30,"time":1794922332147,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42447","remoteAddress":"127.0.0.1","remotePort":56398},"msg":"incoming request"}
{"level":30,"time":1794922332148,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19878299999999172,"msg":"request completed"}
{"level":30,"time":1794922332149,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:41037","remoteAddress":"127.0.0.1","remotePort":37786},"msg":"incoming request"}
{"level":30,"time":1794922332152,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36695","remoteAddress":"127.0.0.1","remotePort":53838},"msg":"incoming request"}
{"level":30,"time":1794922332152,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":3.037789000000032,"msg":"request completed"}
{"level":30,"time":1794922332153,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44987","remoteAddress":"127.0.0.1","remotePort":43720},"msg":"incoming request"}
{"level":30,"time":1794922332155,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.890747000000033,"msg":"request completed"}
{"level":30,"time":1794922332156,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42703","remoteAddress":"127.0.0.1","remotePort":34238},"msg":"incoming request"}
{"level":30,"time":1794922332158,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5565509999999563,"msg":"request completed"}
{"level":30,"time":1794922332159,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40751","remoteAddress":"127.0.0.1","remotePort":57618},"msg":"incoming request"}
{"level":30,"time":1794922332159,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.43887399999999843,"msg":"request completed"}
{"level":30,"time":1794922332161,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:36605","remoteAddress":"127.0.0.1","remotePort":47234},"msg":"incoming request"}
{"level":30,"time":1794922332162,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5781900000000064,"msg":"request completed"}
{"level":30,"time":1794922332164,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:36629","remoteAddress":"127.0.0.1","remotePort":47730},"msg":"incoming request"}
{"level":30,"time":1794922332165,"pid":21517,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9692379999999616,"msg":"request completed"}
{"level":30,"time":1794922332166,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":14.484263999999996,"msg":"request completed"}
{"level":30,"time":1794922332169,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41749","remoteAddress":"127.0.0.1","remotePort":54652},"msg":"incoming request"}
{"level":30,"time":1794922332173,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":3.386243000000036,"msg":"request completed"}
{"level":30,"time":1794922332174,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:38297","remoteAddress":"127.0.0.1","remotePort":50358},"msg":"incoming request"}
{"level":30,"time":1794922332176,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.2309960000000046,"msg":"request completed"}
{"level":30,"time":1794922332178,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40607","remoteAddress":"127.0.0.1","remotePort":45952},"msg":"incoming request"}
{"level":30,"time":1794922332181,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":2.797307999999987,"msg":"request completed"}
{"level":30,"time":1794922332182,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:39185","remoteAddress":"127.0.0.1","remotePort":38210},"msg":"incoming request"}
{"level":30,"time":1794922332184,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4582760000000121,"msg":"request completed"}
{"level":30,"time":1794922332185,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:38459","remoteAddress":"127.0.0.1","remotePort":39004},"msg":"incoming request"}
{"level":30,"time":1794922332186,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":1.3639289999999846,"msg":"request completed"}
{"level":30,"time":1794922332187,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41053","remoteAddress":"127.0.0.1","remotePort":33542},"msg":"incoming request"}
{"level":30,"time":1794922332189,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.2795709999999758,"msg":"request completed"}
{"level":30,"time":1794922332190,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:40499","remoteAddress":"127.0.0.1","remotePort":53176},"msg":"incoming request"}
{"level":30,"time":1794922332191,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.4771709999999985,"msg":"request completed"}
{"level":30,"time":1794922332192,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:46801","remoteAddress":"127.0.0.1","remotePort":38466},"msg":"incoming request"}
{"level":30,"time":1794922332194,"pid":21528,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5265239999999949,"msg":"request completed"}

 Test Files  8 passed (8)
      Tests  41 passed (41)
   Start at  13:32:11
   Duration  1.08s (transform 299ms, setup 39ms, import 1.38s, tests 1.22s, environment 0ms)
```

## Wave 2

- Build: `npm run build` → pass
- Tests: `npm test` → pass
- Fix attempts: 0/3

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794922853612,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46557","remoteAddress":"127.0.0.1","remotePort":47872},"msg":"incoming request"}
{"level":30,"time":1794922853621,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:40857","remoteAddress":"127.0.0.1","remotePort":48062},"msg":"incoming request"}
{"level":30,"time":1794922853623,"pid":46497,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:45941","remoteAddress":"127.0.0.1","remotePort":33128},"msg":"incoming request"}
{"level":30,"time":1794922853629,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.97686200000004,"msg":"request completed"}
{"level":30,"time":1794922853632,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/activation","host":"127.0.0.1:32925","remoteAddress":"127.0.0.1","remotePort":60194},"msg":"incoming request"}
{"level":30,"time":1794922853636,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":3.679165000000012,"msg":"request completed"}
{"level":30,"time":1794922853637,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74","host":"127.0.0.1:36061","remoteAddress":"127.0.0.1","remotePort":46626},"msg":"incoming request"}
{"level":30,"time":1794922853642,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":5.268146999999999,"msg":"request completed"}
{"level":30,"time":1794922853644,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/command-roles","host":"127.0.0.1:39469","remoteAddress":"127.0.0.1","remotePort":47108},"msg":"incoming request"}
{"level":30,"time":1794922853647,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.836819999999989,"msg":"request completed"}
{"level":30,"time":1794922853649,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/activation","host":"127.0.0.1:45639","remoteAddress":"127.0.0.1","remotePort":53056},"msg":"incoming request"}
{"level":30,"time":1794922853653,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.500886999999977,"msg":"request completed"}
{"level":30,"time":1794922853655,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/timeline","host":"127.0.0.1:39043","remoteAddress":"127.0.0.1","remotePort":55510},"msg":"incoming request"}
{"level":30,"time":1794922853658,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.9282249999999976,"msg":"request completed"}
{"level":30,"time":1794922853659,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/activation","host":"127.0.0.1:40487","remoteAddress":"127.0.0.1","remotePort":54290},"msg":"incoming request"}
{"level":30,"time":1794922853661,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.3370800000000145,"msg":"request completed"}
{"level":30,"time":1794922853662,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74","host":"127.0.0.1:45693","remoteAddress":"127.0.0.1","remotePort":48984},"msg":"incoming request"}
{"level":30,"time":1794922853664,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.272824999999955,"msg":"request completed"}
{"level":30,"time":1794922853665,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/command-roles","host":"127.0.0.1:38893","remoteAddress":"127.0.0.1","remotePort":35376},"msg":"incoming request"}
{"level":30,"time":1794922853667,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.5988479999999754,"msg":"request completed"}
{"level":30,"time":1794922853669,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/timeline","host":"127.0.0.1:40491","remoteAddress":"127.0.0.1","remotePort":56414},"msg":"incoming request"}
{"level":30,"time":1794922853674,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":5.109739999999988,"msg":"request completed"}
{"level":30,"time":1794922853675,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/closure","host":"127.0.0.1:37003","remoteAddress":"127.0.0.1","remotePort":45436},"msg":"incoming request"}
{"level":30,"time":1794922853679,"pid":46497,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":55.282163000000025,"msg":"request completed"}
{"level":30,"time":1794922853679,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":57.98094800000001,"msg":"request completed"}
{"level":30,"time":1794922853680,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":4.815017000000012,"msg":"request completed"}
{"level":30,"time":1794922853681,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/b74f5864-00ac-46d8-b407-7e92f1772e74/timeline","host":"127.0.0.1:43869","remoteAddress":"127.0.0.1","remotePort":41650},"msg":"incoming request"}
{"level":30,"time":1794922853683,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.083470000000034,"msg":"request completed"}
{"level":30,"time":1794922853683,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41161","remoteAddress":"127.0.0.1","remotePort":51344},"msg":"incoming request"}
{"level":30,"time":1794922853684,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46747","remoteAddress":"127.0.0.1","remotePort":60176},"msg":"incoming request"}
{"level":30,"time":1794922853688,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":3.343295000000012,"msg":"request completed"}
{"level":30,"time":1794922853689,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/9e88487a-3643-41fd-be75-5e0965aeeb2c/command-roles","host":"127.0.0.1:37185","remoteAddress":"127.0.0.1","remotePort":39020},"msg":"incoming request"}
{"level":30,"time":1794922853691,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.3730239999999867,"msg":"request completed"}
{"level":30,"time":1794922853692,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/9e88487a-3643-41fd-be75-5e0965aeeb2c/command-roles","host":"127.0.0.1:42961","remoteAddress":"127.0.0.1","remotePort":54062},"msg":"incoming request"}
{"level":30,"time":1794922853694,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":1.8886850000000095,"msg":"request completed"}
{"level":30,"time":1794922853694,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":10.806941999999992,"msg":"request completed"}
{"level":30,"time":1794922853695,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/9e88487a-3643-41fd-be75-5e0965aeeb2c/timeline","host":"127.0.0.1:37579","remoteAddress":"127.0.0.1","remotePort":36086},"msg":"incoming request"}
{"level":30,"time":1794922853695,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35441","remoteAddress":"127.0.0.1","remotePort":35444},"msg":"incoming request"}
{"level":30,"time":1794922853696,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7257089999999948,"msg":"request completed"}
{"level":30,"time":1794922853698,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43391","remoteAddress":"127.0.0.1","remotePort":38270},"msg":"incoming request"}
{"level":30,"time":1794922853700,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.741798999999958,"msg":"request completed"}
{"level":30,"time":1794922853701,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.7143839999999955,"msg":"request completed"}
{"level":30,"time":1794922853702,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/5b9e38cf-8141-4944-a75d-cff6e01d95fa/decline","host":"127.0.0.1:35155","remoteAddress":"127.0.0.1","remotePort":48944},"msg":"incoming request"}
{"level":30,"time":1794922853702,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/29148719-3bee-4d4f-92b3-720018500839/activation","host":"127.0.0.1:44893","remoteAddress":"127.0.0.1","remotePort":37384},"msg":"incoming request"}
{"level":30,"time":1794922853703,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.4212270000000444,"msg":"request completed"}
{"level":30,"time":1794922853703,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.4544389999999794,"msg":"request completed"}
{"level":30,"time":1794922853704,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/29148719-3bee-4d4f-92b3-720018500839/command-roles","host":"127.0.0.1:34889","remoteAddress":"127.0.0.1","remotePort":44358},"msg":"incoming request"}
{"level":30,"time":1794922853704,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=366f9f94-cb26-47e7-8b22-536393e1540e","host":"127.0.0.1:36573","remoteAddress":"127.0.0.1","remotePort":33018},"msg":"incoming request"}
{"level":30,"time":1794922853706,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.5744550000000004,"msg":"request completed"}
{"level":30,"time":1794922853707,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.0194999999999936,"msg":"request completed"}
{"level":30,"time":1794922853707,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/29148719-3bee-4d4f-92b3-720018500839/closure","host":"127.0.0.1:45375","remoteAddress":"127.0.0.1","remotePort":45514},"msg":"incoming request"}
{"level":30,"time":1794922853708,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/5b9e38cf-8141-4944-a75d-cff6e01d95fa/decline","host":"127.0.0.1:42675","remoteAddress":"127.0.0.1","remotePort":58406},"msg":"incoming request"}
{"level":30,"time":1794922853708,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.160158000000024,"msg":"request completed"}
{"level":30,"time":1794922853708,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/29148719-3bee-4d4f-92b3-720018500839/activation","host":"127.0.0.1:45121","remoteAddress":"127.0.0.1","remotePort":57364},"msg":"incoming request"}
{"level":30,"time":1794922853711,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.7949120000000107,"msg":"request completed"}
{"level":30,"time":1794922853712,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":3.572765000000004,"msg":"request completed"}
{"level":30,"time":1794922853713,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/366f9f94-cb26-47e7-8b22-536393e1540e/timeline","host":"127.0.0.1:33751","remoteAddress":"127.0.0.1","remotePort":48866},"msg":"incoming request"}
{"level":30,"time":1794922853713,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36257","remoteAddress":"127.0.0.1","remotePort":47518},"msg":"incoming request"}
{"level":30,"time":1794922853715,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":2.492036999999982,"msg":"request completed"}
{"level":30,"time":1794922853716,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":2.882078999999976,"msg":"request completed"}
{"level":30,"time":1794922853717,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38659","remoteAddress":"127.0.0.1","remotePort":35416},"msg":"incoming request"}
{"level":30,"time":1794922853717,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/f02daf96-1979-4baa-89c8-7307f40e76ae/closure","host":"127.0.0.1:45611","remoteAddress":"127.0.0.1","remotePort":41958},"msg":"incoming request"}
{"level":30,"time":1794922853720,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":3.185068000000001,"msg":"request completed"}
{"level":30,"time":1794922853721,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/f02daf96-1979-4baa-89c8-7307f40e76ae/closure","host":"127.0.0.1:41845","remoteAddress":"127.0.0.1","remotePort":40134},"msg":"incoming request"}
{"level":30,"time":1794922853721,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":4.528969999999958,"msg":"request completed"}
{"level":30,"time":1794922853723,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46661","remoteAddress":"127.0.0.1","remotePort":46586},"msg":"incoming request"}
{"level":30,"time":1794922853723,"pid":46499,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.5677200000000084,"msg":"request completed"}
{"level":30,"time":1794922853726,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.3444169999999644,"msg":"request completed"}
{"level":30,"time":1794922853728,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/31ba8afe-27b9-48a6-a5fa-ae15feadf222/approve","host":"127.0.0.1:33765","remoteAddress":"127.0.0.1","remotePort":42214},"msg":"incoming request"}
{"level":30,"time":1794922853732,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":3.9484409999999457,"msg":"request completed"}
{"level":30,"time":1794922853733,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/31ba8afe-27b9-48a6-a5fa-ae15feadf222/fulfill","host":"127.0.0.1:41599","remoteAddress":"127.0.0.1","remotePort":43666},"msg":"incoming request"}
{"level":30,"time":1794922853735,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.30490599999996,"msg":"request completed"}
{"level":30,"time":1794922853736,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/31ba8afe-27b9-48a6-a5fa-ae15feadf222/fulfill","host":"127.0.0.1:42087","remoteAddress":"127.0.0.1","remotePort":59964},"msg":"incoming request"}
{"level":30,"time":1794922853739,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.149370000000033,"msg":"request completed"}
{"level":30,"time":1794922853742,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/87e74062-c3db-44cd-a81c-b7486644ad71/timeline","host":"127.0.0.1:36139","remoteAddress":"127.0.0.1","remotePort":47408},"msg":"incoming request"}
{"level":30,"time":1794922853750,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":7.93106499999999,"msg":"request completed"}
{"level":30,"time":1794922853751,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37541","remoteAddress":"127.0.0.1","remotePort":54168},"msg":"incoming request"}
{"level":30,"time":1794922853755,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":3.215474000000029,"msg":"request completed"}
{"level":30,"time":1794922853756,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37881","remoteAddress":"127.0.0.1","remotePort":53120},"msg":"incoming request"}
{"level":30,"time":1794922853757,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":0.9877940000000649,"msg":"request completed"}
{"level":30,"time":1794922853758,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38867","remoteAddress":"127.0.0.1","remotePort":41410},"msg":"incoming request"}
{"level":30,"time":1794922853760,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":2.459114999999997,"msg":"request completed"}
{"level":30,"time":1794922853761,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:41513","remoteAddress":"127.0.0.1","remotePort":52394},"msg":"incoming request"}
{"level":30,"time":1794922853763,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.253349000000071,"msg":"request completed"}
{"level":30,"time":1794922853764,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/ad9b2dae-0845-4cd5-a08c-aa2db1c29f0c/fulfill","host":"127.0.0.1:43767","remoteAddress":"127.0.0.1","remotePort":56880},"msg":"incoming request"}
{"level":30,"time":1794922853766,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":1.297604999999976,"msg":"request completed"}
{"level":30,"time":1794922853767,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/ad9b2dae-0845-4cd5-a08c-aa2db1c29f0c/approve","host":"127.0.0.1:33807","remoteAddress":"127.0.0.1","remotePort":46416},"msg":"incoming request"}
{"level":30,"time":1794922853768,"pid":46498,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.2188070000000835,"msg":"request completed"}
{"level":30,"time":1794922853886,"pid":46497,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:39501","remoteAddress":"127.0.0.1","remotePort":35236},"msg":"incoming request"}
{"level":30,"time":1794922853889,"pid":46497,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1964399999999387,"msg":"request completed"}
{"level":30,"time":1794922853977,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44779","remoteAddress":"127.0.0.1","remotePort":42912},"msg":"incoming request"}
{"level":30,"time":1794922853993,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.261829000000006,"msg":"request completed"}
{"level":30,"time":1794922853996,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/0c7994fc-e29b-46b4-81c1-b43c6e058ad2/timeline","host":"127.0.0.1:42417","remoteAddress":"127.0.0.1","remotePort":45926},"msg":"incoming request"}
{"level":30,"time":1794922854000,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.370576000000028,"msg":"request completed"}
{"level":30,"time":1794922854002,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40593","remoteAddress":"127.0.0.1","remotePort":55130},"msg":"incoming request"}
{"level":30,"time":1794922854006,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.295911999999987,"msg":"request completed"}
{"level":30,"time":1794922854007,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39143","remoteAddress":"127.0.0.1","remotePort":51726},"msg":"incoming request"}
{"level":30,"time":1794922854009,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":1.6497360000000185,"msg":"request completed"}
{"level":30,"time":1794922854010,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35785","remoteAddress":"127.0.0.1","remotePort":60334},"msg":"incoming request"}
{"level":30,"time":1794922854013,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.060514000000012,"msg":"request completed"}
{"level":30,"time":1794922854015,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36277","remoteAddress":"127.0.0.1","remotePort":56504},"msg":"incoming request"}
{"level":30,"time":1794922854018,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":3.6650190000000293,"msg":"request completed"}
{"level":30,"time":1794922854019,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34885","remoteAddress":"127.0.0.1","remotePort":41286},"msg":"incoming request"}
{"level":30,"time":1794922854021,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37077","remoteAddress":"127.0.0.1","remotePort":35690},"msg":"incoming request"}
{"level":30,"time":1794922854022,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.964644000000021,"msg":"request completed"}
{"level":30,"time":1794922854023,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37239","remoteAddress":"127.0.0.1","remotePort":58190},"msg":"incoming request"}
{"level":30,"time":1794922854026,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":2.894924000000003,"msg":"request completed"}
{"level":30,"time":1794922854028,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:41595","remoteAddress":"127.0.0.1","remotePort":43184},"msg":"incoming request"}
{"level":30,"time":1794922854030,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.2399540000000115,"msg":"request completed"}
{"level":30,"time":1794922854039,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41687","remoteAddress":"127.0.0.1","remotePort":55238},"msg":"incoming request"}
{"level":30,"time":1794922854042,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":2.6460759999999937,"msg":"request completed"}
{"level":30,"time":1794922854043,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/9fa858f6-81ba-4780-9485-ae973bdcb530","host":"127.0.0.1:45703","remoteAddress":"127.0.0.1","remotePort":47346},"msg":"incoming request"}
{"level":30,"time":1794922854045,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":1.7888079999999604,"msg":"request completed"}
{"level":30,"time":1794922854046,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:42719","remoteAddress":"127.0.0.1","remotePort":51428},"msg":"incoming request"}
{"level":30,"time":1794922854048,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.3130610000000047,"msg":"request completed"}
{"level":30,"time":1794922854049,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/9fa858f6-81ba-4780-9485-ae973bdcb530","host":"127.0.0.1:33031","remoteAddress":"127.0.0.1","remotePort":49244},"msg":"incoming request"}
{"level":30,"time":1794922854050,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":1.5472639999999842,"msg":"request completed"}
{"level":30,"time":1794922854051,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/9fa858f6-81ba-4780-9485-ae973bdcb530/timeline","host":"127.0.0.1:35603","remoteAddress":"127.0.0.1","remotePort":33274},"msg":"incoming request"}
{"level":30,"time":1794922854054,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":2.367524000000003,"msg":"request completed"}
{"level":30,"time":1794922854055,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32993","remoteAddress":"127.0.0.1","remotePort":36328},"msg":"incoming request"}
{"level":30,"time":1794922854057,"pid":46534,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.5867749999999887,"msg":"request completed"}
{"level":30,"time":1794922854062,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":40.930657999999994,"msg":"request completed"}
{"level":30,"time":1794922854065,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:44293","remoteAddress":"127.0.0.1","remotePort":47320},"msg":"incoming request"}
{"level":30,"time":1794922854068,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":2.683035000000018,"msg":"request completed"}
{"level":30,"time":1794922854073,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42079","remoteAddress":"127.0.0.1","remotePort":47324},"msg":"incoming request"}
{"level":30,"time":1794922854075,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7163510000000315,"msg":"request completed"}
{"level":30,"time":1794922854076,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:44731","remoteAddress":"127.0.0.1","remotePort":51168},"msg":"incoming request"}
{"level":30,"time":1794922854079,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.4297369999999887,"msg":"request completed"}
{"level":30,"time":1794922854081,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/c609ec2a-10d6-4ad4-a664-02a8fb963b95/revoke","host":"127.0.0.1:41891","remoteAddress":"127.0.0.1","remotePort":42300},"msg":"incoming request"}
{"level":30,"time":1794922854084,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":2.9403179999999907,"msg":"request completed"}
{"level":30,"time":1794922854086,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44049","remoteAddress":"127.0.0.1","remotePort":48966},"msg":"incoming request"}
{"level":30,"time":1794922854088,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.301009000000022,"msg":"request completed"}
{"level":30,"time":1794922854089,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41983","remoteAddress":"127.0.0.1","remotePort":38230},"msg":"incoming request"}
{"level":30,"time":1794922854091,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6662469999999985,"msg":"request completed"}
{"level":30,"time":1794922854092,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:37711","remoteAddress":"127.0.0.1","remotePort":53780},"msg":"incoming request"}
{"level":30,"time":1794922854094,"pid":46545,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2162399999999707,"msg":"request completed"}
{"level":30,"time":1794922854168,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39201","remoteAddress":"127.0.0.1","remotePort":59088},"msg":"incoming request"}
{"level":30,"time":1794922854176,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":8.199900000000014,"msg":"request completed"}
{"level":30,"time":1794922854180,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46485","remoteAddress":"127.0.0.1","remotePort":54346},"msg":"incoming request"}
{"level":30,"time":1794922854183,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.7285909999999944,"msg":"request completed"}
{"level":30,"time":1794922854185,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34949","remoteAddress":"127.0.0.1","remotePort":37698},"msg":"incoming request"}
{"level":30,"time":1794922854190,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":5.193878000000041,"msg":"request completed"}
{"level":30,"time":1794922854192,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35453","remoteAddress":"127.0.0.1","remotePort":56664},"msg":"incoming request"}
{"level":30,"time":1794922854203,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":11.415323999999998,"msg":"request completed"}
{"level":30,"time":1794922854205,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44149","remoteAddress":"127.0.0.1","remotePort":36640},"msg":"incoming request"}
{"level":30,"time":1794922854208,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.0544929999999795,"msg":"request completed"}
{"level":30,"time":1794922854209,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/038d76f9-158c-4266-a9dc-859d8935364e/timeline","host":"127.0.0.1:41799","remoteAddress":"127.0.0.1","remotePort":52340},"msg":"incoming request"}
{"level":30,"time":1794922854212,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.852433000000019,"msg":"request completed"}
{"level":30,"time":1794922854240,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41571","remoteAddress":"127.0.0.1","remotePort":49262},"msg":"incoming request"}
{"level":30,"time":1794922854243,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.988207999999986,"msg":"request completed"}
{"level":30,"time":1794922854244,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/bad61a06-43e3-4002-84c3-988ed1c09e62/status","host":"127.0.0.1:35699","remoteAddress":"127.0.0.1","remotePort":44464},"msg":"incoming request"}
{"level":30,"time":1794922854246,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":1.9919290000000274,"msg":"request completed"}
{"level":30,"time":1794922854247,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33909","remoteAddress":"127.0.0.1","remotePort":58092},"msg":"incoming request"}
{"level":30,"time":1794922854250,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.6071730000000457,"msg":"request completed"}
{"level":30,"time":1794922854251,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/0e64d6ba-0cfa-4d54-afda-71d140367d69/status","host":"127.0.0.1:45925","remoteAddress":"127.0.0.1","remotePort":53316},"msg":"incoming request"}
{"level":30,"time":1794922854252,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.626333000000045,"msg":"request completed"}
{"level":30,"time":1794922854253,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/0e64d6ba-0cfa-4d54-afda-71d140367d69/status","host":"127.0.0.1:46281","remoteAddress":"127.0.0.1","remotePort":42108},"msg":"incoming request"}
{"level":30,"time":1794922854256,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.5922649999999976,"msg":"request completed"}
{"level":30,"time":1794922854257,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/0e64d6ba-0cfa-4d54-afda-71d140367d69/status","host":"127.0.0.1:44201","remoteAddress":"127.0.0.1","remotePort":54478},"msg":"incoming request"}
{"level":30,"time":1794922854258,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4432389999999486,"msg":"request completed"}
{"level":30,"time":1794922854259,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/0e64d6ba-0cfa-4d54-afda-71d140367d69/status","host":"127.0.0.1:45905","remoteAddress":"127.0.0.1","remotePort":46228},"msg":"incoming request"}
{"level":30,"time":1794922854261,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.361261000000013,"msg":"request completed"}
{"level":30,"time":1794922854262,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/0e64d6ba-0cfa-4d54-afda-71d140367d69/status","host":"127.0.0.1:42775","remoteAddress":"127.0.0.1","remotePort":59592},"msg":"incoming request"}
{"level":30,"time":1794922854264,"pid":46556,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.8994350000000395,"msg":"request completed"}
{"level":30,"time":1794922854357,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:34375","remoteAddress":"127.0.0.1","remotePort":49418},"msg":"incoming request"}
{"level":30,"time":1794922854364,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":5.9660069999999905,"msg":"request completed"}
{"level":30,"time":1794922854366,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:42085","remoteAddress":"127.0.0.1","remotePort":39388},"msg":"incoming request"}
{"level":30,"time":1794922854377,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":10.945312000000001,"msg":"request completed"}
{"level":30,"time":1794922854379,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34041","remoteAddress":"127.0.0.1","remotePort":35870},"msg":"incoming request"}
{"level":30,"time":1794922854382,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6729859999999803,"msg":"request completed"}
{"level":30,"time":1794922854383,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/2d306b85-2a1a-46e8-ad52-eb4ece574c85","host":"127.0.0.1:44309","remoteAddress":"127.0.0.1","remotePort":56318},"msg":"incoming request"}
{"level":30,"time":1794922854387,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.2971979999999803,"msg":"request completed"}
{"level":30,"time":1794922854388,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33197","remoteAddress":"127.0.0.1","remotePort":33102},"msg":"incoming request"}
{"level":30,"time":1794922854388,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5881540000000314,"msg":"request completed"}
{"level":30,"time":1794922854390,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41081","remoteAddress":"127.0.0.1","remotePort":54148},"msg":"incoming request"}
{"level":30,"time":1794922854392,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.5693949999999859,"msg":"request completed"}
{"level":30,"time":1794922854393,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:46265","remoteAddress":"127.0.0.1","remotePort":53584},"msg":"incoming request"}
{"level":30,"time":1794922854396,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35721","remoteAddress":"127.0.0.1","remotePort":49714},"msg":"incoming request"}
{"level":30,"time":1794922854397,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":4.284931999999969,"msg":"request completed"}
{"level":30,"time":1794922854399,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:32801","remoteAddress":"127.0.0.1","remotePort":45480},"msg":"incoming request"}
{"level":30,"time":1794922854404,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":5.380056999999965,"msg":"request completed"}
{"level":30,"time":1794922854407,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=831cdbe5-6c9b-4450-8a5d-5b46ce5f2a3a&page_size=50","host":"127.0.0.1:44125","remoteAddress":"127.0.0.1","remotePort":34438},"msg":"incoming request"}
{"level":30,"time":1794922854410,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":3.582312999999999,"msg":"request completed"}
{"level":30,"time":1794922854412,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35311","remoteAddress":"127.0.0.1","remotePort":42488},"msg":"incoming request"}
{"level":30,"time":1794922854414,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.8771530000000212,"msg":"request completed"}
{"level":30,"time":1794922854416,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:41497","remoteAddress":"127.0.0.1","remotePort":59782},"msg":"incoming request"}
{"level":30,"time":1794922854416,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":19.80944800000003,"msg":"request completed"}
{"level":30,"time":1794922854418,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.9962059999999724,"msg":"request completed"}
{"level":30,"time":1794922854419,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36963","remoteAddress":"127.0.0.1","remotePort":45586},"msg":"incoming request"}
{"level":30,"time":1794922854421,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":2.559402999999975,"msg":"request completed"}
{"level":30,"time":1794922854423,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:40163","remoteAddress":"127.0.0.1","remotePort":52242},"msg":"incoming request"}
{"level":30,"time":1794922854424,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/18faa15b-57f7-4b5d-b07c-1676accbec46/timeline","host":"127.0.0.1:43637","remoteAddress":"127.0.0.1","remotePort":60662},"msg":"incoming request"}
{"level":30,"time":1794922854440,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":17.753428999999983,"msg":"request completed"}
{"level":30,"time":1794922854441,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":16.776947000000007,"msg":"request completed"}
{"level":30,"time":1794922854441,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=831cdbe5-6c9b-4450-8a5d-5b46ce5f2a3a&action_type=record_view","host":"127.0.0.1:46771","remoteAddress":"127.0.0.1","remotePort":57364},"msg":"incoming request"}
{"level":30,"time":1794922854443,"pid":46572,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.000864999999976,"msg":"request completed"}
{"level":30,"time":1794922854446,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46721","remoteAddress":"127.0.0.1","remotePort":43856},"msg":"incoming request"}
{"level":30,"time":1794922854451,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.036856,"msg":"request completed"}
{"level":30,"time":1794922854452,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/5e132ad8-f872-43b2-ad05-41dccf9ed665/closure","host":"127.0.0.1:38859","remoteAddress":"127.0.0.1","remotePort":48852},"msg":"incoming request"}
{"level":30,"time":1794922854456,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.7703860000000304,"msg":"request completed"}
{"level":30,"time":1794922854457,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/5e132ad8-f872-43b2-ad05-41dccf9ed665/timeline","host":"127.0.0.1:34227","remoteAddress":"127.0.0.1","remotePort":56968},"msg":"incoming request"}
{"level":30,"time":1794922854459,"pid":46583,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.9146239999999466,"msg":"request completed"}
{"level":30,"time":1794922854557,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37901","remoteAddress":"127.0.0.1","remotePort":47724},"msg":"incoming request"}
{"level":30,"time":1794922854574,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.12196799999998,"msg":"request completed"}
{"level":30,"time":1794922854577,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34857","remoteAddress":"127.0.0.1","remotePort":55916},"msg":"incoming request"}
{"level":30,"time":1794922854581,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":4.127606000000014,"msg":"request completed"}
{"level":30,"time":1794922854582,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:32785","remoteAddress":"127.0.0.1","remotePort":35568},"msg":"incoming request"}
{"level":30,"time":1794922854585,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.720485999999994,"msg":"request completed"}
{"level":30,"time":1794922854587,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35179","remoteAddress":"127.0.0.1","remotePort":34856},"msg":"incoming request"}
{"level":30,"time":1794922854590,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":2.88376199999999,"msg":"request completed"}
{"level":30,"time":1794922854591,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:35959","remoteAddress":"127.0.0.1","remotePort":38470},"msg":"incoming request"}
{"level":30,"time":1794922854593,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5551080000000184,"msg":"request completed"}
{"level":30,"time":1794922854594,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:41135","remoteAddress":"127.0.0.1","remotePort":48202},"msg":"incoming request"}
{"level":30,"time":1794922854596,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":1.4725540000000024,"msg":"request completed"}
{"level":30,"time":1794922854597,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:46749","remoteAddress":"127.0.0.1","remotePort":53236},"msg":"incoming request"}
{"level":30,"time":1794922854598,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4151960000000372,"msg":"request completed"}
{"level":30,"time":1794922854599,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:39499","remoteAddress":"127.0.0.1","remotePort":58800},"msg":"incoming request"}
{"level":30,"time":1794922854601,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9147629999999936,"msg":"request completed"}
{"level":30,"time":1794922854602,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:42167","remoteAddress":"127.0.0.1","remotePort":58428},"msg":"incoming request"}
{"level":30,"time":1794922854604,"pid":46595,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.6510279999999966,"msg":"request completed"}
{"level":30,"time":1794922854690,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36137","remoteAddress":"127.0.0.1","remotePort":55292},"msg":"incoming request"}
{"level":30,"time":1794922854695,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.365499999999997,"msg":"request completed"}
{"level":30,"time":1794922854698,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36217","remoteAddress":"127.0.0.1","remotePort":39986},"msg":"incoming request"}
{"level":30,"time":1794922854698,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18407600000000457,"msg":"request completed"}
{"level":30,"time":1794922854700,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:33157","remoteAddress":"127.0.0.1","remotePort":36826},"msg":"incoming request"}
{"level":30,"time":1794922854702,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.5801020000000108,"msg":"request completed"}
{"level":30,"time":1794922854703,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34891","remoteAddress":"127.0.0.1","remotePort":38946},"msg":"incoming request"}
{"level":30,"time":1794922854705,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.6896610000000294,"msg":"request completed"}
{"level":30,"time":1794922854706,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38485","remoteAddress":"127.0.0.1","remotePort":53742},"msg":"incoming request"}
{"level":30,"time":1794922854708,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6002229999999713,"msg":"request completed"}
{"level":30,"time":1794922854709,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46045","remoteAddress":"127.0.0.1","remotePort":34708},"msg":"incoming request"}
{"level":30,"time":1794922854709,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.46878999999995585,"msg":"request completed"}
{"level":30,"time":1794922854711,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:37883","remoteAddress":"127.0.0.1","remotePort":56752},"msg":"incoming request"}
{"level":30,"time":1794922854712,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.410568000000012,"msg":"request completed"}
{"level":30,"time":1794922854713,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:44167","remoteAddress":"127.0.0.1","remotePort":43270},"msg":"incoming request"}
{"level":30,"time":1794922854714,"pid":46644,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9473280000000273,"msg":"request completed"}

 Test Files  10 passed (10)
      Tests  49 passed (49)
   Start at  13:40:53
   Duration  1.48s (transform 297ms, setup 41ms, import 1.82s, tests 1.63s, environment 0ms)
```

## Wave 3

- Build: `npm run build` → pass
- Tests: `npm test` → pass
- Fix attempts: 0/3 — 03-03: migration renumbered 1700000000005->1700000000007 to avoid collision with already-applied 03-02 migration (auto-fixed, DDL unchanged)

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794923459264,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39413","remoteAddress":"127.0.0.1","remotePort":53710},"msg":"incoming request"}
{"level":30,"time":1794923459271,"pid":75599,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:41785","remoteAddress":"127.0.0.1","remotePort":60806},"msg":"incoming request"}
{"level":30,"time":1794923459272,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:37749","remoteAddress":"127.0.0.1","remotePort":47868},"msg":"incoming request"}
{"level":30,"time":1794923459280,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.527369000000022,"msg":"request completed"}
{"level":30,"time":1794923459283,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/d0fd57a2-058a-450f-874c-69a1f2f5fb49/timeline","host":"127.0.0.1:33005","remoteAddress":"127.0.0.1","remotePort":50602},"msg":"incoming request"}
{"level":30,"time":1794923459286,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.5739509999999655,"msg":"request completed"}
{"level":30,"time":1794923459288,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43037","remoteAddress":"127.0.0.1","remotePort":55548},"msg":"incoming request"}
{"level":30,"time":1794923459293,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.070454000000041,"msg":"request completed"}
{"level":30,"time":1794923459294,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44799","remoteAddress":"127.0.0.1","remotePort":44572},"msg":"incoming request"}
{"level":30,"time":1794923459296,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":1.8460420000000113,"msg":"request completed"}
{"level":30,"time":1794923459297,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41583","remoteAddress":"127.0.0.1","remotePort":35892},"msg":"incoming request"}
{"level":30,"time":1794923459300,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.226167000000032,"msg":"request completed"}
{"level":30,"time":1794923459302,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41749","remoteAddress":"127.0.0.1","remotePort":40022},"msg":"incoming request"}
{"level":30,"time":1794923459305,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":2.8864679999999794,"msg":"request completed"}
{"level":30,"time":1794923459306,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38429","remoteAddress":"127.0.0.1","remotePort":39274},"msg":"incoming request"}
{"level":30,"time":1794923459309,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.68258400000002,"msg":"request completed"}
{"level":30,"time":1794923459310,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36037","remoteAddress":"127.0.0.1","remotePort":38066},"msg":"incoming request"}
{"level":30,"time":1794923459313,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":3.11947600000002,"msg":"request completed"}
{"level":30,"time":1794923459315,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:42909","remoteAddress":"127.0.0.1","remotePort":45314},"msg":"incoming request"}
{"level":30,"time":1794923459317,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.5144189999999753,"msg":"request completed"}
{"level":30,"time":1794923459319,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45613","remoteAddress":"127.0.0.1","remotePort":60090},"msg":"incoming request"}
{"level":30,"time":1794923459323,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.167527000000007,"msg":"request completed"}
{"level":30,"time":1794923459323,"pid":75599,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":51.817452,"msg":"request completed"}
{"level":30,"time":1794923459323,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":50.79070200000001,"msg":"request completed"}
{"level":30,"time":1794923459324,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/024165ed-076e-45ce-9071-092c190ea038","host":"127.0.0.1:33825","remoteAddress":"127.0.0.1","remotePort":55856},"msg":"incoming request"}
{"level":30,"time":1794923459326,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":1.8923689999999738,"msg":"request completed"}
{"level":30,"time":1794923459326,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39271","remoteAddress":"127.0.0.1","remotePort":55898},"msg":"incoming request"}
{"level":30,"time":1794923459327,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:45041","remoteAddress":"127.0.0.1","remotePort":36110},"msg":"incoming request"}
{"level":30,"time":1794923459329,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.743909999999971,"msg":"request completed"}
{"level":30,"time":1794923459330,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/024165ed-076e-45ce-9071-092c190ea038","host":"127.0.0.1:39417","remoteAddress":"127.0.0.1","remotePort":51306},"msg":"incoming request"}
{"level":30,"time":1794923459337,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":10.20492999999999,"msg":"request completed"}
{"level":30,"time":1794923459339,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":9.01849900000002,"msg":"request completed"}
{"level":30,"time":1794923459340,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:36869","remoteAddress":"127.0.0.1","remotePort":38778},"msg":"incoming request"}
{"level":30,"time":1794923459341,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/024165ed-076e-45ce-9071-092c190ea038/timeline","host":"127.0.0.1:44285","remoteAddress":"127.0.0.1","remotePort":52700},"msg":"incoming request"}
{"level":30,"time":1794923459343,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":1.312217999999973,"msg":"request completed"}
{"level":30,"time":1794923459344,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43403","remoteAddress":"127.0.0.1","remotePort":53258},"msg":"incoming request"}
{"level":30,"time":1794923459344,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.070745000000045,"msg":"request completed"}
{"level":30,"time":1794923459346,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/23609d4a-35d6-4f5a-af3a-4126c83252bf/decline","host":"127.0.0.1:44457","remoteAddress":"127.0.0.1","remotePort":56130},"msg":"incoming request"}
{"level":30,"time":1794923459347,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":3.0823859999999854,"msg":"request completed"}
{"level":30,"time":1794923459347,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.443714,"msg":"request completed"}
{"level":30,"time":1794923459349,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=5c47899c-6a5b-4a1d-bf8b-03612c623c18","host":"127.0.0.1:39127","remoteAddress":"127.0.0.1","remotePort":46378},"msg":"incoming request"}
{"level":30,"time":1794923459351,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2528859999999895,"msg":"request completed"}
{"level":30,"time":1794923459352,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/23609d4a-35d6-4f5a-af3a-4126c83252bf/decline","host":"127.0.0.1:37085","remoteAddress":"127.0.0.1","remotePort":46052},"msg":"incoming request"}
{"level":30,"time":1794923459356,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.7135130000000345,"msg":"request completed"}
{"level":30,"time":1794923459357,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/5c47899c-6a5b-4a1d-bf8b-03612c623c18/timeline","host":"127.0.0.1:34057","remoteAddress":"127.0.0.1","remotePort":58240},"msg":"incoming request"}
{"level":30,"time":1794923459358,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39325","remoteAddress":"127.0.0.1","remotePort":44442},"msg":"incoming request"}
{"level":30,"time":1794923459359,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":2.3858569999999872,"msg":"request completed"}
{"level":30,"time":1794923459361,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33297","remoteAddress":"127.0.0.1","remotePort":51978},"msg":"incoming request"}
{"level":30,"time":1794923459365,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":4.335352,"msg":"request completed"}
{"level":30,"time":1794923459367,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:36707","remoteAddress":"127.0.0.1","remotePort":59638},"msg":"incoming request"}
{"level":30,"time":1794923459367,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":9.432687999999985,"msg":"request completed"}
{"level":30,"time":1794923459368,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42191","remoteAddress":"127.0.0.1","remotePort":34868},"msg":"incoming request"}
{"level":30,"time":1794923459370,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.5464599999999677,"msg":"request completed"}
{"level":30,"time":1794923459371,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/7bb96e95-0fbb-4462-8c28-27e65d65e4b7/approve","host":"127.0.0.1:46159","remoteAddress":"127.0.0.1","remotePort":59296},"msg":"incoming request"}
{"level":30,"time":1794923459372,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.40013399999998,"msg":"request completed"}
{"level":30,"time":1794923459373,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34765","remoteAddress":"127.0.0.1","remotePort":58644},"msg":"incoming request"}
{"level":30,"time":1794923459376,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":201},"responseTime":2.771772999999996,"msg":"request completed"}
{"level":30,"time":1794923459377,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":5.2014520000000175,"msg":"request completed"}
{"level":30,"time":1794923459377,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46023","remoteAddress":"127.0.0.1","remotePort":51770},"msg":"incoming request"}
{"level":30,"time":1794923459378,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/7bb96e95-0fbb-4462-8c28-27e65d65e4b7/fulfill","host":"127.0.0.1:41565","remoteAddress":"127.0.0.1","remotePort":39914},"msg":"incoming request"}
{"level":30,"time":1794923459380,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.568589999999972,"msg":"request completed"}
{"level":40,"time":1794923459380,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:238:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794923459382,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/7bb96e95-0fbb-4462-8c28-27e65d65e4b7/fulfill","host":"127.0.0.1:38327","remoteAddress":"127.0.0.1","remotePort":41116},"msg":"incoming request"}
{"level":30,"time":1794923459382,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":201},"responseTime":4.885316999999986,"msg":"request completed"}
{"level":30,"time":1794923459383,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/89336137-26e0-4ceb-977c-707b923dcfbd/approve","host":"127.0.0.1:45923","remoteAddress":"127.0.0.1","remotePort":51702},"msg":"incoming request"}
{"level":40,"time":1794923459385,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:293:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794923459385,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":200},"responseTime":2.5124750000000518,"msg":"request completed"}
{"level":30,"time":1794923459386,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.7683759999999893,"msg":"request completed"}
{"level":30,"time":1794923459386,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:46643","remoteAddress":"127.0.0.1","remotePort":58064},"msg":"incoming request"}
{"level":30,"time":1794923459388,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6145759999999996,"msg":"request completed"}
{"level":30,"time":1794923459388,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/a19efdf7-a31a-48a8-b362-a985681d6c14/timeline","host":"127.0.0.1:34191","remoteAddress":"127.0.0.1","remotePort":58734},"msg":"incoming request"}
{"level":30,"time":1794923459389,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37835","remoteAddress":"127.0.0.1","remotePort":48926},"msg":"incoming request"}
{"level":30,"time":1794923459390,"pid":75600,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":403},"responseTime":1.4942700000000286,"msg":"request completed"}
{"level":30,"time":1794923459390,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.152918999999997,"msg":"request completed"}
{"level":30,"time":1794923459530,"pid":75599,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:44819","remoteAddress":"127.0.0.1","remotePort":43084},"msg":"incoming request"}
{"level":30,"time":1794923459533,"pid":75599,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.3039340000000266,"msg":"request completed"}
{"level":30,"time":1794923459592,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36461","remoteAddress":"127.0.0.1","remotePort":57364},"msg":"incoming request"}
{"level":30,"time":1794923459603,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":10.738022,"msg":"request completed"}
{"level":30,"time":1794923459604,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35281","remoteAddress":"127.0.0.1","remotePort":48614},"msg":"incoming request"}
{"level":30,"time":1794923459606,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.60182199999997,"msg":"request completed"}
{"level":30,"time":1794923459607,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37169","remoteAddress":"127.0.0.1","remotePort":36630},"msg":"incoming request"}
{"level":30,"time":1794923459611,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":3.7760509999999385,"msg":"request completed"}
{"level":30,"time":1794923459612,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37771","remoteAddress":"127.0.0.1","remotePort":32816},"msg":"incoming request"}
{"level":30,"time":1794923459616,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.350951000000009,"msg":"request completed"}
{"level":30,"time":1794923459617,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/6ef22232-ae44-48d5-83f8-e913b377ee56/fulfill","host":"127.0.0.1:42215","remoteAddress":"127.0.0.1","remotePort":45298},"msg":"incoming request"}
{"level":30,"time":1794923459618,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":1.6448129999999992,"msg":"request completed"}
{"level":30,"time":1794923459619,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/6ef22232-ae44-48d5-83f8-e913b377ee56/approve","host":"127.0.0.1:45609","remoteAddress":"127.0.0.1","remotePort":35144},"msg":"incoming request"}
{"level":30,"time":1794923459621,"pid":75598,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.7438290000000052,"msg":"request completed"}
{"level":30,"time":1794923459648,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42615","remoteAddress":"127.0.0.1","remotePort":58522},"msg":"incoming request"}
{"level":30,"time":1794923459677,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":28.552854000000025,"msg":"request completed"}
{"level":30,"time":1794923459680,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/activation","host":"127.0.0.1:38987","remoteAddress":"127.0.0.1","remotePort":50548},"msg":"incoming request"}
{"level":30,"time":1794923459683,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":3.0471600000000194,"msg":"request completed"}
{"level":30,"time":1794923459684,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36","host":"127.0.0.1:39485","remoteAddress":"127.0.0.1","remotePort":49136},"msg":"incoming request"}
{"level":30,"time":1794923459687,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.953113999999971,"msg":"request completed"}
{"level":30,"time":1794923459688,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/command-roles","host":"127.0.0.1:38293","remoteAddress":"127.0.0.1","remotePort":58972},"msg":"incoming request"}
{"level":30,"time":1794923459692,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.5902320000000145,"msg":"request completed"}
{"level":30,"time":1794923459693,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/activation","host":"127.0.0.1:42077","remoteAddress":"127.0.0.1","remotePort":38104},"msg":"incoming request"}
{"level":30,"time":1794923459697,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.036471000000006,"msg":"request completed"}
{"level":30,"time":1794923459698,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/timeline","host":"127.0.0.1:42373","remoteAddress":"127.0.0.1","remotePort":45684},"msg":"incoming request"}
{"level":30,"time":1794923459702,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.718151999999975,"msg":"request completed"}
{"level":30,"time":1794923459703,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/activation","host":"127.0.0.1:42413","remoteAddress":"127.0.0.1","remotePort":40052},"msg":"incoming request"}
{"level":30,"time":1794923459705,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.295927000000006,"msg":"request completed"}
{"level":30,"time":1794923459706,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36","host":"127.0.0.1:45379","remoteAddress":"127.0.0.1","remotePort":57820},"msg":"incoming request"}
{"level":30,"time":1794923459708,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.962220000000002,"msg":"request completed"}
{"level":30,"time":1794923459709,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/command-roles","host":"127.0.0.1:40247","remoteAddress":"127.0.0.1","remotePort":57806},"msg":"incoming request"}
{"level":30,"time":1794923459711,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.327436999999975,"msg":"request completed"}
{"level":30,"time":1794923459712,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/timeline","host":"127.0.0.1:42693","remoteAddress":"127.0.0.1","remotePort":42088},"msg":"incoming request"}
{"level":30,"time":1794923459714,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":1.79831200000001,"msg":"request completed"}
{"level":30,"time":1794923459715,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/closure","host":"127.0.0.1:34095","remoteAddress":"127.0.0.1","remotePort":34052},"msg":"incoming request"}
{"level":30,"time":1794923459719,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.9794029999999907,"msg":"request completed"}
{"level":30,"time":1794923459720,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/8dbaaffc-b8d8-46f5-b0c1-3eee68da2e36/timeline","host":"127.0.0.1:35885","remoteAddress":"127.0.0.1","remotePort":53848},"msg":"incoming request"}
{"level":30,"time":1794923459722,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.0374510000000328,"msg":"request completed"}
{"level":30,"time":1794923459723,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40627","remoteAddress":"127.0.0.1","remotePort":33412},"msg":"incoming request"}
{"level":30,"time":1794923459727,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":3.5573400000000106,"msg":"request completed"}
{"level":30,"time":1794923459728,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/e4188a97-8936-4e46-8241-4e8f2c674376/command-roles","host":"127.0.0.1:46807","remoteAddress":"127.0.0.1","remotePort":43146},"msg":"incoming request"}
{"level":30,"time":1794923459730,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.626970999999969,"msg":"request completed"}
{"level":30,"time":1794923459731,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/e4188a97-8936-4e46-8241-4e8f2c674376/command-roles","host":"127.0.0.1:38009","remoteAddress":"127.0.0.1","remotePort":56432},"msg":"incoming request"}
{"level":30,"time":1794923459734,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.4945710000000076,"msg":"request completed"}
{"level":30,"time":1794923459734,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/e4188a97-8936-4e46-8241-4e8f2c674376/timeline","host":"127.0.0.1:44877","remoteAddress":"127.0.0.1","remotePort":54024},"msg":"incoming request"}
{"level":30,"time":1794923459736,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":1.9433240000000183,"msg":"request completed"}
{"level":30,"time":1794923459738,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35271","remoteAddress":"127.0.0.1","remotePort":57576},"msg":"incoming request"}
{"level":30,"time":1794923459741,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.1215609999999856,"msg":"request completed"}
{"level":30,"time":1794923459742,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/6048e8ad-dd40-462e-a533-6cb2e0cb9d63/activation","host":"127.0.0.1:42275","remoteAddress":"127.0.0.1","remotePort":46730},"msg":"incoming request"}
{"level":30,"time":1794923459744,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.5508870000000456,"msg":"request completed"}
{"level":30,"time":1794923459744,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/6048e8ad-dd40-462e-a533-6cb2e0cb9d63/command-roles","host":"127.0.0.1:46411","remoteAddress":"127.0.0.1","remotePort":53308},"msg":"incoming request"}
{"level":30,"time":1794923459746,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.4014460000000213,"msg":"request completed"}
{"level":30,"time":1794923459747,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/6048e8ad-dd40-462e-a533-6cb2e0cb9d63/closure","host":"127.0.0.1:45047","remoteAddress":"127.0.0.1","remotePort":45966},"msg":"incoming request"}
{"level":30,"time":1794923459748,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.3075890000000072,"msg":"request completed"}
{"level":30,"time":1794923459749,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/6048e8ad-dd40-462e-a533-6cb2e0cb9d63/activation","host":"127.0.0.1:40129","remoteAddress":"127.0.0.1","remotePort":60734},"msg":"incoming request"}
{"level":30,"time":1794923459751,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.211900000000014,"msg":"request completed"}
{"level":30,"time":1794923459752,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40131","remoteAddress":"127.0.0.1","remotePort":37458},"msg":"incoming request"}
{"level":30,"time":1794923459755,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":3.000152000000014,"msg":"request completed"}
{"level":30,"time":1794923459756,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/9affbc47-54a6-47e2-bc73-e017cf4b907e/closure","host":"127.0.0.1:37877","remoteAddress":"127.0.0.1","remotePort":58750},"msg":"incoming request"}
{"level":30,"time":1794923459759,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":3.3613509999999565,"msg":"request completed"}
{"level":30,"time":1794923459760,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/9affbc47-54a6-47e2-bc73-e017cf4b907e/closure","host":"127.0.0.1:43079","remoteAddress":"127.0.0.1","remotePort":39626},"msg":"incoming request"}
{"level":30,"time":1794923459762,"pid":75637,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.642419000000018,"msg":"request completed"}
{"level":30,"time":1794923459818,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42027","remoteAddress":"127.0.0.1","remotePort":39794},"msg":"incoming request"}
{"level":30,"time":1794923459832,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":13.515847000000008,"msg":"request completed"}
{"level":30,"time":1794923459835,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6/submit-review","host":"127.0.0.1:41737","remoteAddress":"127.0.0.1","remotePort":48306},"msg":"incoming request"}
{"level":30,"time":1794923459841,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":6.023306999999988,"msg":"request completed"}
{"level":30,"time":1794923459843,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6/review","host":"127.0.0.1:35689","remoteAddress":"127.0.0.1","remotePort":58864},"msg":"incoming request"}
{"level":30,"time":1794923459846,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":403},"responseTime":3.159893000000011,"msg":"request completed"}
{"level":30,"time":1794923459848,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6","host":"127.0.0.1:45301","remoteAddress":"127.0.0.1","remotePort":33384},"msg":"incoming request"}
{"level":30,"time":1794923459851,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.1270399999999654,"msg":"request completed"}
{"level":30,"time":1794923459852,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6/review","host":"127.0.0.1:42963","remoteAddress":"127.0.0.1","remotePort":35388},"msg":"incoming request"}
{"level":30,"time":1794923459857,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.581425000000024,"msg":"request completed"}
{"level":30,"time":1794923459858,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6","host":"127.0.0.1:40529","remoteAddress":"127.0.0.1","remotePort":60166},"msg":"incoming request"}
{"level":30,"time":1794923459860,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.220696000000032,"msg":"request completed"}
{"level":30,"time":1794923459873,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6/sections/fc512657-e06c-41bb-bf41-712098afbc6b/link-tasks","host":"127.0.0.1:39355","remoteAddress":"127.0.0.1","remotePort":49352},"msg":"incoming request"}
{"level":30,"time":1794923459875,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":204},"responseTime":2.640495000000044,"msg":"request completed"}
{"level":30,"time":1794923459876,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6","host":"127.0.0.1:44311","remoteAddress":"127.0.0.1","remotePort":50932},"msg":"incoming request"}
{"level":30,"time":1794923459879,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5876969999999915,"msg":"request completed"}
{"level":30,"time":1794923459880,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34355","remoteAddress":"127.0.0.1","remotePort":35786},"msg":"incoming request"}
{"level":30,"time":1794923459891,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":11.094161999999983,"msg":"request completed"}
{"level":30,"time":1794923459892,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/be3b3615-2085-40e9-b67d-98e3fb6898a6/materialize-tasks","host":"127.0.0.1:46765","remoteAddress":"127.0.0.1","remotePort":33904},"msg":"incoming request"}
{"level":30,"time":1794923459897,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.028286000000037,"msg":"request completed"}
{"level":30,"time":1794923459898,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=1915963f-817e-4b54-8676-ab700d4f5068","host":"127.0.0.1:40429","remoteAddress":"127.0.0.1","remotePort":59656},"msg":"incoming request"}
{"level":30,"time":1794923459901,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.655594000000008,"msg":"request completed"}
{"level":30,"time":1794923459903,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:36013","remoteAddress":"127.0.0.1","remotePort":51114},"msg":"incoming request"}
{"level":30,"time":1794923459906,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":201},"responseTime":3.0070440000000076,"msg":"request completed"}
{"level":30,"time":1794923459907,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/0c37ce6b-a7e4-48bc-9b7a-83aa9cc8a2be/review","host":"127.0.0.1:33495","remoteAddress":"127.0.0.1","remotePort":37610},"msg":"incoming request"}
{"level":30,"time":1794923459909,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":409},"responseTime":2.013375999999994,"msg":"request completed"}
{"level":30,"time":1794923459910,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46391","remoteAddress":"127.0.0.1","remotePort":50348},"msg":"incoming request"}
{"level":30,"time":1794923459912,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.251784999999984,"msg":"request completed"}
{"level":30,"time":1794923459913,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/573ddb1a-1212-4480-8dac-057b3f846b85/submit-review","host":"127.0.0.1:37595","remoteAddress":"127.0.0.1","remotePort":38286},"msg":"incoming request"}
{"level":30,"time":1794923459914,"pid":75650,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.671132,"msg":"request completed"}
{"level":30,"time":1794923459926,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:33725","remoteAddress":"127.0.0.1","remotePort":55656},"msg":"incoming request"}
{"level":30,"time":1794923459933,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":6.412197999999989,"msg":"request completed"}
{"level":30,"time":1794923459936,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:44471","remoteAddress":"127.0.0.1","remotePort":37782},"msg":"incoming request"}
{"level":30,"time":1794923459947,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":11.171707999999967,"msg":"request completed"}
{"level":30,"time":1794923459949,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36367","remoteAddress":"127.0.0.1","remotePort":56560},"msg":"incoming request"}
{"level":30,"time":1794923459951,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6744990000000257,"msg":"request completed"}
{"level":30,"time":1794923459952,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/c6832eed-7700-4c48-b009-88a29ceb04b2","host":"127.0.0.1:45479","remoteAddress":"127.0.0.1","remotePort":56760},"msg":"incoming request"}
{"level":30,"time":1794923459955,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.7545299999999884,"msg":"request completed"}
{"level":30,"time":1794923459956,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45127","remoteAddress":"127.0.0.1","remotePort":60480},"msg":"incoming request"}
{"level":30,"time":1794923459957,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5682989999999677,"msg":"request completed"}
{"level":30,"time":1794923459958,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:32969","remoteAddress":"127.0.0.1","remotePort":59380},"msg":"incoming request"}
{"level":30,"time":1794923459959,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.303120999999976,"msg":"request completed"}
{"level":30,"time":1794923459962,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:35051","remoteAddress":"127.0.0.1","remotePort":36892},"msg":"incoming request"}
{"level":30,"time":1794923459975,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":12.776657,"msg":"request completed"}
{"level":30,"time":1794923459975,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:39583","remoteAddress":"127.0.0.1","remotePort":51088},"msg":"incoming request"}
{"level":30,"time":1794923459978,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.868775000000028,"msg":"request completed"}
{"level":30,"time":1794923459980,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=6a952222-be30-4dc3-bd3e-c19b81650224&page_size=50","host":"127.0.0.1:46417","remoteAddress":"127.0.0.1","remotePort":59228},"msg":"incoming request"}
{"level":30,"time":1794923459981,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7306350000000066,"msg":"request completed"}
{"level":30,"time":1794923459983,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36969","remoteAddress":"127.0.0.1","remotePort":49582},"msg":"incoming request"}
{"level":30,"time":1794923459984,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.281189999999981,"msg":"request completed"}
{"level":30,"time":1794923459985,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:43715","remoteAddress":"127.0.0.1","remotePort":33608},"msg":"incoming request"}
{"level":30,"time":1794923459987,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.494470999999976,"msg":"request completed"}
{"level":30,"time":1794923459988,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37755","remoteAddress":"127.0.0.1","remotePort":48354},"msg":"incoming request"}
{"level":30,"time":1794923459990,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":1.9373830000000112,"msg":"request completed"}
{"level":30,"time":1794923459991,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:34349","remoteAddress":"127.0.0.1","remotePort":40422},"msg":"incoming request"}
{"level":30,"time":1794923459992,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":1.71225000000004,"msg":"request completed"}
{"level":30,"time":1794923459993,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=6a952222-be30-4dc3-bd3e-c19b81650224&action_type=record_view","host":"127.0.0.1:36583","remoteAddress":"127.0.0.1","remotePort":37562},"msg":"incoming request"}
{"level":30,"time":1794923459995,"pid":75680,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.609817000000021,"msg":"request completed"}
{"level":30,"time":1794923460079,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:39237","remoteAddress":"127.0.0.1","remotePort":48166},"msg":"incoming request"}
{"level":30,"time":1794923460110,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":30.914445,"msg":"request completed"}
{"level":30,"time":1794923460113,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:43415","remoteAddress":"127.0.0.1","remotePort":33428},"msg":"incoming request"}
{"level":30,"time":1794923460116,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.2284409999999752,"msg":"request completed"}
{"level":30,"time":1794923460118,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:40635","remoteAddress":"127.0.0.1","remotePort":35912},"msg":"incoming request"}
{"level":30,"time":1794923460120,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.8118769999999813,"msg":"request completed"}
{"level":30,"time":1794923460121,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:39777","remoteAddress":"127.0.0.1","remotePort":36516},"msg":"incoming request"}
{"level":30,"time":1794923460125,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.8761599999999703,"msg":"request completed"}
{"level":30,"time":1794923460127,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/0fdc61fc-49d8-44f2-9736-f7a87bf4a389/revoke","host":"127.0.0.1:39585","remoteAddress":"127.0.0.1","remotePort":33154},"msg":"incoming request"}
{"level":30,"time":1794923460130,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":3.0810130000000413,"msg":"request completed"}
{"level":30,"time":1794923460140,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44753","remoteAddress":"127.0.0.1","remotePort":60574},"msg":"incoming request"}
{"level":30,"time":1794923460143,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.7384999999999877,"msg":"request completed"}
{"level":30,"time":1794923460144,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:38367","remoteAddress":"127.0.0.1","remotePort":47514},"msg":"incoming request"}
{"level":30,"time":1794923460146,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6924629999999752,"msg":"request completed"}
{"level":30,"time":1794923460147,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:46249","remoteAddress":"127.0.0.1","remotePort":56298},"msg":"incoming request"}
{"level":30,"time":1794923460149,"pid":75691,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0687110000000075,"msg":"request completed"}
{"level":30,"time":1794923460210,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34149","remoteAddress":"127.0.0.1","remotePort":46434},"msg":"incoming request"}
{"level":30,"time":1794923460226,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.594043999999997,"msg":"request completed"}
{"level":30,"time":1794923460230,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40231","remoteAddress":"127.0.0.1","remotePort":56402},"msg":"incoming request"}
{"level":30,"time":1794923460233,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":3.615899000000013,"msg":"request completed"}
{"level":30,"time":1794923460234,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:46089","remoteAddress":"127.0.0.1","remotePort":60224},"msg":"incoming request"}
{"level":30,"time":1794923460237,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.609026999999969,"msg":"request completed"}
{"level":30,"time":1794923460239,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38845","remoteAddress":"127.0.0.1","remotePort":43342},"msg":"incoming request"}
{"level":30,"time":1794923460242,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.021501999999998,"msg":"request completed"}
{"level":30,"time":1794923460244,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:35527","remoteAddress":"127.0.0.1","remotePort":44750},"msg":"incoming request"}
{"level":30,"time":1794923460246,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.0947590000000105,"msg":"request completed"}
{"level":30,"time":1794923460247,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:38717","remoteAddress":"127.0.0.1","remotePort":53924},"msg":"incoming request"}
{"level":30,"time":1794923460249,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7737359999999853,"msg":"request completed"}
{"level":30,"time":1794923460250,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:44597","remoteAddress":"127.0.0.1","remotePort":33578},"msg":"incoming request"}
{"level":30,"time":1794923460252,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6185439999999858,"msg":"request completed"}
{"level":30,"time":1794923460254,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:43995","remoteAddress":"127.0.0.1","remotePort":54350},"msg":"incoming request"}
{"level":30,"time":1794923460256,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9700040000000172,"msg":"request completed"}
{"level":30,"time":1794923460257,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:41477","remoteAddress":"127.0.0.1","remotePort":58630},"msg":"incoming request"}
{"level":30,"time":1794923460259,"pid":75742,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7438690000000179,"msg":"request completed"}
{"level":30,"time":1794923460278,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45897","remoteAddress":"127.0.0.1","remotePort":55234},"msg":"incoming request"}
{"level":30,"time":1794923460283,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":5.359679000000028,"msg":"request completed"}
{"level":30,"time":1794923460287,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33673","remoteAddress":"127.0.0.1","remotePort":46992},"msg":"incoming request"}
{"level":30,"time":1794923460290,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.368895000000009,"msg":"request completed"}
{"level":30,"time":1794923460291,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46517","remoteAddress":"127.0.0.1","remotePort":52872},"msg":"incoming request"}
{"level":30,"time":1794923460296,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.921555000000012,"msg":"request completed"}
{"level":30,"time":1794923460298,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35273","remoteAddress":"127.0.0.1","remotePort":40832},"msg":"incoming request"}
{"level":30,"time":1794923460308,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":10.31950599999999,"msg":"request completed"}
{"level":30,"time":1794923460309,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36189","remoteAddress":"127.0.0.1","remotePort":51268},"msg":"incoming request"}
{"level":30,"time":1794923460312,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":2.9513600000000224,"msg":"request completed"}
{"level":30,"time":1794923460314,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/04e0ce8d-b9c8-45e4-b18b-706525502536/timeline","host":"127.0.0.1:46421","remoteAddress":"127.0.0.1","remotePort":39938},"msg":"incoming request"}
{"level":30,"time":1794923460317,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.6931640000000243,"msg":"request completed"}
{"level":30,"time":1794923460318,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39491","remoteAddress":"127.0.0.1","remotePort":58332},"msg":"incoming request"}
{"level":30,"time":1794923460321,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.1885050000000206,"msg":"request completed"}
{"level":30,"time":1794923460321,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/1f125a04-3a1e-4ee7-baf5-5ce2b2970aaf/status","host":"127.0.0.1:46635","remoteAddress":"127.0.0.1","remotePort":40804},"msg":"incoming request"}
{"level":30,"time":1794923460323,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":1.7762599999999793,"msg":"request completed"}
{"level":30,"time":1794923460325,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40537","remoteAddress":"127.0.0.1","remotePort":53738},"msg":"incoming request"}
{"level":30,"time":1794923460327,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.502486000000033,"msg":"request completed"}
{"level":30,"time":1794923460328,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/da1644b6-4ae5-4824-8c1f-a0636d8295f8/status","host":"127.0.0.1:46497","remoteAddress":"127.0.0.1","remotePort":55470},"msg":"incoming request"}
{"level":30,"time":1794923460330,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.4910239999999817,"msg":"request completed"}
{"level":30,"time":1794923460331,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/da1644b6-4ae5-4824-8c1f-a0636d8295f8/status","host":"127.0.0.1:33563","remoteAddress":"127.0.0.1","remotePort":44130},"msg":"incoming request"}
{"level":30,"time":1794923460340,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":9.376483000000007,"msg":"request completed"}
{"level":30,"time":1794923460341,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/da1644b6-4ae5-4824-8c1f-a0636d8295f8/status","host":"127.0.0.1:35255","remoteAddress":"127.0.0.1","remotePort":36324},"msg":"incoming request"}
{"level":30,"time":1794923460342,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.3695960000000014,"msg":"request completed"}
{"level":30,"time":1794923460343,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/da1644b6-4ae5-4824-8c1f-a0636d8295f8/status","host":"127.0.0.1:46379","remoteAddress":"127.0.0.1","remotePort":60326},"msg":"incoming request"}
{"level":30,"time":1794923460345,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2906070000000227,"msg":"request completed"}
{"level":30,"time":1794923460346,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/da1644b6-4ae5-4824-8c1f-a0636d8295f8/status","host":"127.0.0.1:38631","remoteAddress":"127.0.0.1","remotePort":54444},"msg":"incoming request"}
{"level":30,"time":1794923460348,"pid":75753,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.006413000000009,"msg":"request completed"}
{"level":30,"time":1794923460426,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42601","remoteAddress":"127.0.0.1","remotePort":48944},"msg":"incoming request"}
{"level":30,"time":1794923460442,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.010487000000012,"msg":"request completed"}
{"level":30,"time":1794923460448,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/c61687a6-988a-4d5e-a174-b9aab1d16370/timeline","host":"127.0.0.1:33833","remoteAddress":"127.0.0.1","remotePort":44036},"msg":"incoming request"}
{"level":30,"time":1794923460450,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7383800000000065,"msg":"request completed"}
{"level":30,"time":1794923460455,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41161","remoteAddress":"127.0.0.1","remotePort":35970},"msg":"incoming request"}
{"level":30,"time":1794923460457,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":2.8269860000000335,"msg":"request completed"}
{"level":30,"time":1794923460459,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/fe73b8e1-e695-4372-b172-776b58f26068/closure","host":"127.0.0.1:35995","remoteAddress":"127.0.0.1","remotePort":38120},"msg":"incoming request"}
{"level":30,"time":1794923460463,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.7087450000000217,"msg":"request completed"}
{"level":30,"time":1794923460464,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/fe73b8e1-e695-4372-b172-776b58f26068/timeline","host":"127.0.0.1:32977","remoteAddress":"127.0.0.1","remotePort":57342},"msg":"incoming request"}
{"level":30,"time":1794923460466,"pid":75765,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.745663000000036,"msg":"request completed"}
{"level":30,"time":1794923460531,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44535","remoteAddress":"127.0.0.1","remotePort":35236},"msg":"incoming request"}
{"level":30,"time":1794923460536,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":4.830082000000004,"msg":"request completed"}
{"level":30,"time":1794923460538,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44531","remoteAddress":"127.0.0.1","remotePort":38598},"msg":"incoming request"}
{"level":30,"time":1794923460539,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18028900000001613,"msg":"request completed"}
{"level":30,"time":1794923460540,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:34511","remoteAddress":"127.0.0.1","remotePort":59362},"msg":"incoming request"}
{"level":30,"time":1794923460543,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.7357039999999984,"msg":"request completed"}
{"level":30,"time":1794923460544,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33635","remoteAddress":"127.0.0.1","remotePort":56090},"msg":"incoming request"}
{"level":30,"time":1794923460546,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7359140000000366,"msg":"request completed"}
{"level":30,"time":1794923460547,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42635","remoteAddress":"127.0.0.1","remotePort":33828},"msg":"incoming request"}
{"level":30,"time":1794923460549,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5220030000000406,"msg":"request completed"}
{"level":30,"time":1794923460550,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36505","remoteAddress":"127.0.0.1","remotePort":57712},"msg":"incoming request"}
{"level":30,"time":1794923460550,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.40065299999997706,"msg":"request completed"}
{"level":30,"time":1794923460551,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:40461","remoteAddress":"127.0.0.1","remotePort":55604},"msg":"incoming request"}
{"level":30,"time":1794923460553,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3817579999999907,"msg":"request completed"}
{"level":30,"time":1794923460554,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:45725","remoteAddress":"127.0.0.1","remotePort":45094},"msg":"incoming request"}
{"level":30,"time":1794923460555,"pid":75778,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9351589999999987,"msg":"request completed"}

 Test Files  11 passed (11)
      Tests  55 passed (55)
   Start at  13:50:58
   Duration  1.66s (transform 300ms, setup 44ms, import 1.96s, tests 2.01s, environment 0ms)
```

## Wave 4

- Build: `npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app` → pass
- Tests: `npm test && npm test -w frontend/design-system` → pass
- Fix attempts: 0/3 — backend: 11/11 files 55/55 tests; design-system: 5/5 files 46/46 tests; frontend/app build clean (e2e/plans.spec.ts deferred to browser_suite_gate). 03-05: 2 auto-fixed deviations (seeded 2 new Keycloak identities for cross-reviewer approval proof; Playwright Badge-locator strict-mode scoping fix)

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794925132351,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34369","remoteAddress":"127.0.0.1","remotePort":36500},"msg":"incoming request"}
{"level":30,"time":1794925132357,"pid":143685,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:41935","remoteAddress":"127.0.0.1","remotePort":49498},"msg":"incoming request"}
{"level":30,"time":1794925132361,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:37531","remoteAddress":"127.0.0.1","remotePort":42026},"msg":"incoming request"}
{"level":30,"time":1794925132378,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":26.090305999999998,"msg":"request completed"}
{"level":30,"time":1794925132381,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/267fcbbe-2903-4fa7-aa6e-ccc7ebeeb329/timeline","host":"127.0.0.1:38295","remoteAddress":"127.0.0.1","remotePort":44962},"msg":"incoming request"}
{"level":30,"time":1794925132384,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.567830000000015,"msg":"request completed"}
{"level":30,"time":1794925132387,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43463","remoteAddress":"127.0.0.1","remotePort":36756},"msg":"incoming request"}
{"level":30,"time":1794925132391,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.3639760000000365,"msg":"request completed"}
{"level":30,"time":1794925132392,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43277","remoteAddress":"127.0.0.1","remotePort":49644},"msg":"incoming request"}
{"level":30,"time":1794925132394,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":1.9129220000000373,"msg":"request completed"}
{"level":30,"time":1794925132395,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41897","remoteAddress":"127.0.0.1","remotePort":40818},"msg":"incoming request"}
{"level":30,"time":1794925132399,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.747556999999972,"msg":"request completed"}
{"level":30,"time":1794925132401,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33901","remoteAddress":"127.0.0.1","remotePort":57508},"msg":"incoming request"}
{"level":30,"time":1794925132405,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":4.000772999999981,"msg":"request completed"}
{"level":30,"time":1794925132406,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43649","remoteAddress":"127.0.0.1","remotePort":41346},"msg":"incoming request"}
{"level":30,"time":1794925132410,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":3.1974650000000224,"msg":"request completed"}
{"level":30,"time":1794925132411,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44183","remoteAddress":"127.0.0.1","remotePort":53274},"msg":"incoming request"}
{"level":30,"time":1794925132413,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":2.822860999999989,"msg":"request completed"}
{"level":30,"time":1794925132415,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:39199","remoteAddress":"127.0.0.1","remotePort":38490},"msg":"incoming request"}
{"level":30,"time":1794925132417,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.248332000000005,"msg":"request completed"}
{"level":30,"time":1794925132419,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34863","remoteAddress":"127.0.0.1","remotePort":60596},"msg":"incoming request"}
{"level":30,"time":1794925132423,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.3942240000000083,"msg":"request completed"}
{"level":30,"time":1794925132424,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/604e63b3-0835-44fc-8219-c919876c3c5c","host":"127.0.0.1:45915","remoteAddress":"127.0.0.1","remotePort":40086},"msg":"incoming request"}
{"level":30,"time":1794925132424,"pid":143685,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":66.716588,"msg":"request completed"}
{"level":30,"time":1794925132426,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":2.0262950000000046,"msg":"request completed"}
{"level":30,"time":1794925132427,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:45891","remoteAddress":"127.0.0.1","remotePort":60014},"msg":"incoming request"}
{"level":30,"time":1794925132427,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":65.57960399999996,"msg":"request completed"}
{"level":30,"time":1794925132430,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.031682999999987,"msg":"request completed"}
{"level":30,"time":1794925132431,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35683","remoteAddress":"127.0.0.1","remotePort":56908},"msg":"incoming request"}
{"level":30,"time":1794925132431,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/604e63b3-0835-44fc-8219-c919876c3c5c","host":"127.0.0.1:41671","remoteAddress":"127.0.0.1","remotePort":38500},"msg":"incoming request"}
{"level":30,"time":1794925132433,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":1.9495809999999665,"msg":"request completed"}
{"level":30,"time":1794925132434,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/604e63b3-0835-44fc-8219-c919876c3c5c/timeline","host":"127.0.0.1:42985","remoteAddress":"127.0.0.1","remotePort":50872},"msg":"incoming request"}
{"level":30,"time":1794925132440,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":6.488424000000009,"msg":"request completed"}
{"level":30,"time":1794925132441,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":10.727645999999993,"msg":"request completed"}
{"level":30,"time":1794925132442,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33681","remoteAddress":"127.0.0.1","remotePort":47832},"msg":"incoming request"}
{"level":30,"time":1794925132443,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39073","remoteAddress":"127.0.0.1","remotePort":39314},"msg":"incoming request"}
{"level":30,"time":1794925132444,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.7471889999999917,"msg":"request completed"}
{"level":30,"time":1794925132447,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.402026000000035,"msg":"request completed"}
{"level":30,"time":1794925132450,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/1e3a519a-217c-4f4e-a02a-01d9d9d0aba4/decline","host":"127.0.0.1:45969","remoteAddress":"127.0.0.1","remotePort":34734},"msg":"incoming request"}
{"level":30,"time":1794925132451,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.8194669999999746,"msg":"request completed"}
{"level":30,"time":1794925132453,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=5e4d5c9a-568e-4ba2-bbb1-a20376780fc5","host":"127.0.0.1:37909","remoteAddress":"127.0.0.1","remotePort":52896},"msg":"incoming request"}
{"level":30,"time":1794925132454,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36513","remoteAddress":"127.0.0.1","remotePort":52886},"msg":"incoming request"}
{"level":30,"time":1794925132455,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2028459999999654,"msg":"request completed"}
{"level":30,"time":1794925132457,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/1e3a519a-217c-4f4e-a02a-01d9d9d0aba4/decline","host":"127.0.0.1:42585","remoteAddress":"127.0.0.1","remotePort":43048},"msg":"incoming request"}
{"level":30,"time":1794925132462,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":4.896875999999963,"msg":"request completed"}
{"level":30,"time":1794925132463,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":8.922375999999986,"msg":"request completed"}
{"level":30,"time":1794925132463,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/5e4d5c9a-568e-4ba2-bbb1-a20376780fc5/timeline","host":"127.0.0.1:43565","remoteAddress":"127.0.0.1","remotePort":40818},"msg":"incoming request"}
{"level":30,"time":1794925132463,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35439","remoteAddress":"127.0.0.1","remotePort":44888},"msg":"incoming request"}
{"level":30,"time":1794925132466,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":2.862185000000011,"msg":"request completed"}
{"level":30,"time":1794925132467,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.6240060000000085,"msg":"request completed"}
{"level":30,"time":1794925132468,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46591","remoteAddress":"127.0.0.1","remotePort":60856},"msg":"incoming request"}
{"level":30,"time":1794925132468,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35041","remoteAddress":"127.0.0.1","remotePort":58592},"msg":"incoming request"}
{"level":30,"time":1794925132471,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":201},"responseTime":3.035710999999992,"msg":"request completed"}
{"level":30,"time":1794925132472,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":4.12393400000002,"msg":"request completed"}
{"level":30,"time":1794925132472,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40743","remoteAddress":"127.0.0.1","remotePort":54282},"msg":"incoming request"}
{"level":30,"time":1794925132473,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:34377","remoteAddress":"127.0.0.1","remotePort":42248},"msg":"incoming request"}
{"level":40,"time":1794925132475,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:238:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794925132477,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":201},"responseTime":4.517984000000013,"msg":"request completed"}
{"level":30,"time":1794925132477,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":4.08011300000004,"msg":"request completed"}
{"level":30,"time":1794925132478,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/b46c0157-f3ed-49a0-9057-0eb091b6cd13/approve","host":"127.0.0.1:44953","remoteAddress":"127.0.0.1","remotePort":51392},"msg":"incoming request"}
{"level":40,"time":1794925132480,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:293:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794925132480,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":200},"responseTime":2.6147699999999645,"msg":"request completed"}
{"level":30,"time":1794925132481,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/d3ea65a6-ec88-46a8-922e-c34034cff985/approve","host":"127.0.0.1:37803","remoteAddress":"127.0.0.1","remotePort":47066},"msg":"incoming request"}
{"level":30,"time":1794925132481,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:34757","remoteAddress":"127.0.0.1","remotePort":38272},"msg":"incoming request"}
{"level":30,"time":1794925132483,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6474340000000325,"msg":"request completed"}
{"level":30,"time":1794925132484,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34027","remoteAddress":"127.0.0.1","remotePort":39238},"msg":"incoming request"}
{"level":30,"time":1794925132485,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":3.9285169999999425,"msg":"request completed"}
{"level":30,"time":1794925132485,"pid":143686,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":403},"responseTime":1.0033740000000648,"msg":"request completed"}
{"level":30,"time":1794925132486,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/d3ea65a6-ec88-46a8-922e-c34034cff985/fulfill","host":"127.0.0.1:34345","remoteAddress":"127.0.0.1","remotePort":57404},"msg":"incoming request"}
{"level":30,"time":1794925132488,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.3132640000000038,"msg":"request completed"}
{"level":30,"time":1794925132489,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/d3ea65a6-ec88-46a8-922e-c34034cff985/fulfill","host":"127.0.0.1:42755","remoteAddress":"127.0.0.1","remotePort":39594},"msg":"incoming request"}
{"level":30,"time":1794925132493,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.419842000000017,"msg":"request completed"}
{"level":30,"time":1794925132495,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/a34a6227-d002-4869-b50f-525d92c863cb/timeline","host":"127.0.0.1:34551","remoteAddress":"127.0.0.1","remotePort":46234},"msg":"incoming request"}
{"level":30,"time":1794925132497,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.1307919999999285,"msg":"request completed"}
{"level":30,"time":1794925132631,"pid":143685,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:46289","remoteAddress":"127.0.0.1","remotePort":48030},"msg":"incoming request"}
{"level":30,"time":1794925132634,"pid":143685,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.097806999999989,"msg":"request completed"}
{"level":30,"time":1794925132699,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36493","remoteAddress":"127.0.0.1","remotePort":38632},"msg":"incoming request"}
{"level":30,"time":1794925132703,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":4.030187999999953,"msg":"request completed"}
{"level":30,"time":1794925132704,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:44617","remoteAddress":"127.0.0.1","remotePort":53834},"msg":"incoming request"}
{"level":30,"time":1794925132705,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.1312440000000379,"msg":"request completed"}
{"level":30,"time":1794925132707,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45863","remoteAddress":"127.0.0.1","remotePort":42788},"msg":"incoming request"}
{"level":30,"time":1794925132709,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":2.4183910000000424,"msg":"request completed"}
{"level":30,"time":1794925132710,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:43525","remoteAddress":"127.0.0.1","remotePort":38744},"msg":"incoming request"}
{"level":30,"time":1794925132712,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":1.994636000000014,"msg":"request completed"}
{"level":30,"time":1794925132713,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/1a79a6fc-4dfd-4eda-930e-e6dc4ed9f8a8/fulfill","host":"127.0.0.1:32901","remoteAddress":"127.0.0.1","remotePort":40914},"msg":"incoming request"}
{"level":30,"time":1794925132715,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":1.6133399999999938,"msg":"request completed"}
{"level":30,"time":1794925132715,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/1a79a6fc-4dfd-4eda-930e-e6dc4ed9f8a8/approve","host":"127.0.0.1:38983","remoteAddress":"127.0.0.1","remotePort":34432},"msg":"incoming request"}
{"level":30,"time":1794925132717,"pid":143684,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.4583089999999856,"msg":"request completed"}
{"level":30,"time":1794925132739,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37505","remoteAddress":"127.0.0.1","remotePort":53266},"msg":"incoming request"}
{"level":30,"time":1794925132755,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.21165400000001,"msg":"request completed"}
{"level":30,"time":1794925132758,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/activation","host":"127.0.0.1:41995","remoteAddress":"127.0.0.1","remotePort":50910},"msg":"incoming request"}
{"level":30,"time":1794925132761,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":3.0427040000000147,"msg":"request completed"}
{"level":30,"time":1794925132762,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0","host":"127.0.0.1:33515","remoteAddress":"127.0.0.1","remotePort":36584},"msg":"incoming request"}
{"level":30,"time":1794925132765,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.547864000000004,"msg":"request completed"}
{"level":30,"time":1794925132766,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/command-roles","host":"127.0.0.1:38087","remoteAddress":"127.0.0.1","remotePort":46052},"msg":"incoming request"}
{"level":30,"time":1794925132773,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":6.905327999999997,"msg":"request completed"}
{"level":30,"time":1794925132774,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/activation","host":"127.0.0.1:33483","remoteAddress":"127.0.0.1","remotePort":36112},"msg":"incoming request"}
{"level":30,"time":1794925132777,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.3893249999999853,"msg":"request completed"}
{"level":30,"time":1794925132778,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/timeline","host":"127.0.0.1:36657","remoteAddress":"127.0.0.1","remotePort":44610},"msg":"incoming request"}
{"level":30,"time":1794925132781,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.40718099999998,"msg":"request completed"}
{"level":30,"time":1794925132782,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/activation","host":"127.0.0.1:34887","remoteAddress":"127.0.0.1","remotePort":32990},"msg":"incoming request"}
{"level":30,"time":1794925132784,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.279674,"msg":"request completed"}
{"level":30,"time":1794925132786,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0","host":"127.0.0.1:42715","remoteAddress":"127.0.0.1","remotePort":45256},"msg":"incoming request"}
{"level":30,"time":1794925132789,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5665500000000065,"msg":"request completed"}
{"level":30,"time":1794925132789,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/command-roles","host":"127.0.0.1:34283","remoteAddress":"127.0.0.1","remotePort":60706},"msg":"incoming request"}
{"level":30,"time":1794925132792,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.482170999999994,"msg":"request completed"}
{"level":30,"time":1794925132793,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/timeline","host":"127.0.0.1:42737","remoteAddress":"127.0.0.1","remotePort":47570},"msg":"incoming request"}
{"level":30,"time":1794925132795,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8520679999999743,"msg":"request completed"}
{"level":30,"time":1794925132796,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/closure","host":"127.0.0.1:37753","remoteAddress":"127.0.0.1","remotePort":33604},"msg":"incoming request"}
{"level":30,"time":1794925132800,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.6942280000000096,"msg":"request completed"}
{"level":30,"time":1794925132800,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/cf6bcac8-910b-4c74-8125-0afd76e9ccc0/timeline","host":"127.0.0.1:41469","remoteAddress":"127.0.0.1","remotePort":42934},"msg":"incoming request"}
{"level":30,"time":1794925132802,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":1.9513339999999744,"msg":"request completed"}
{"level":30,"time":1794925132804,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33759","remoteAddress":"127.0.0.1","remotePort":42492},"msg":"incoming request"}
{"level":30,"time":1794925132807,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":2.8841259999999806,"msg":"request completed"}
{"level":30,"time":1794925132808,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/06341ffa-a81f-4e34-a879-3b34171652b4/command-roles","host":"127.0.0.1:32799","remoteAddress":"127.0.0.1","remotePort":51834},"msg":"incoming request"}
{"level":30,"time":1794925132810,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":1.9292330000000106,"msg":"request completed"}
{"level":30,"time":1794925132810,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/06341ffa-a81f-4e34-a879-3b34171652b4/command-roles","host":"127.0.0.1:37123","remoteAddress":"127.0.0.1","remotePort":55658},"msg":"incoming request"}
{"level":30,"time":1794925132812,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":1.6681430000000432,"msg":"request completed"}
{"level":30,"time":1794925132813,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/06341ffa-a81f-4e34-a879-3b34171652b4/timeline","host":"127.0.0.1:36303","remoteAddress":"127.0.0.1","remotePort":51716},"msg":"incoming request"}
{"level":30,"time":1794925132814,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":1.5006690000000162,"msg":"request completed"}
{"level":30,"time":1794925132816,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33843","remoteAddress":"127.0.0.1","remotePort":53004},"msg":"incoming request"}
{"level":30,"time":1794925132819,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.1350779999999645,"msg":"request completed"}
{"level":30,"time":1794925132820,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/b95da107-c3ac-4203-9a6b-02af58dcbe0d/activation","host":"127.0.0.1:42861","remoteAddress":"127.0.0.1","remotePort":41026},"msg":"incoming request"}
{"level":30,"time":1794925132821,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6146519999999782,"msg":"request completed"}
{"level":30,"time":1794925132822,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/b95da107-c3ac-4203-9a6b-02af58dcbe0d/command-roles","host":"127.0.0.1:37825","remoteAddress":"127.0.0.1","remotePort":33172},"msg":"incoming request"}
{"level":30,"time":1794925132824,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.3629799999999932,"msg":"request completed"}
{"level":30,"time":1794925132824,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/b95da107-c3ac-4203-9a6b-02af58dcbe0d/closure","host":"127.0.0.1:35837","remoteAddress":"127.0.0.1","remotePort":55646},"msg":"incoming request"}
{"level":30,"time":1794925132826,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.5088440000000105,"msg":"request completed"}
{"level":30,"time":1794925132827,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/b95da107-c3ac-4203-9a6b-02af58dcbe0d/activation","host":"127.0.0.1:39981","remoteAddress":"127.0.0.1","remotePort":46836},"msg":"incoming request"}
{"level":30,"time":1794925132829,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.196534999999983,"msg":"request completed"}
{"level":30,"time":1794925132830,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38915","remoteAddress":"127.0.0.1","remotePort":41458},"msg":"incoming request"}
{"level":30,"time":1794925132840,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":10.155862000000013,"msg":"request completed"}
{"level":30,"time":1794925132841,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/8e137ae7-5463-4878-ab24-9ffb79f496d8/closure","host":"127.0.0.1:38933","remoteAddress":"127.0.0.1","remotePort":34736},"msg":"incoming request"}
{"level":30,"time":1794925132844,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":2.9255039999999894,"msg":"request completed"}
{"level":30,"time":1794925132845,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/8e137ae7-5463-4878-ab24-9ffb79f496d8/closure","host":"127.0.0.1:37055","remoteAddress":"127.0.0.1","remotePort":59086},"msg":"incoming request"}
{"level":30,"time":1794925132847,"pid":143791,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.4622740000000363,"msg":"request completed"}
{"level":30,"time":1794925132908,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:46007","remoteAddress":"127.0.0.1","remotePort":59770},"msg":"incoming request"}
{"level":30,"time":1794925132936,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":28.49769600000002,"msg":"request completed"}
{"level":30,"time":1794925132939,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:44697","remoteAddress":"127.0.0.1","remotePort":60352},"msg":"incoming request"}
{"level":30,"time":1794925132943,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.268359000000032,"msg":"request completed"}
{"level":30,"time":1794925132945,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:33065","remoteAddress":"127.0.0.1","remotePort":50418},"msg":"incoming request"}
{"level":30,"time":1794925132947,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":2.2860829999999623,"msg":"request completed"}
{"level":30,"time":1794925132949,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43551","remoteAddress":"127.0.0.1","remotePort":35258},"msg":"incoming request"}
{"level":30,"time":1794925132955,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":6.452357000000006,"msg":"request completed"}
{"level":30,"time":1794925132957,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/b2e72f22-7c76-4cc5-96c9-7cee60b3a202/revoke","host":"127.0.0.1:34693","remoteAddress":"127.0.0.1","remotePort":39428},"msg":"incoming request"}
{"level":30,"time":1794925132960,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":3.0893309999999587,"msg":"request completed"}
{"level":30,"time":1794925132964,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35637","remoteAddress":"127.0.0.1","remotePort":35696},"msg":"incoming request"}
{"level":30,"time":1794925132967,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.978513000000021,"msg":"request completed"}
{"level":30,"time":1794925132968,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:46321","remoteAddress":"127.0.0.1","remotePort":51238},"msg":"incoming request"}
{"level":30,"time":1794925132974,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":6.200153999999998,"msg":"request completed"}
{"level":30,"time":1794925132975,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:39817","remoteAddress":"127.0.0.1","remotePort":43452},"msg":"incoming request"}
{"level":30,"time":1794925132978,"pid":143805,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.4459439999999972,"msg":"request completed"}
{"level":30,"time":1794925133005,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40197","remoteAddress":"127.0.0.1","remotePort":47150},"msg":"incoming request"}
{"level":30,"time":1794925133019,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":13.649152000000015,"msg":"request completed"}
{"level":30,"time":1794925133022,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857/submit-review","host":"127.0.0.1:41177","remoteAddress":"127.0.0.1","remotePort":34420},"msg":"incoming request"}
{"level":30,"time":1794925133027,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":4.997655000000009,"msg":"request completed"}
{"level":30,"time":1794925133029,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857/review","host":"127.0.0.1:46679","remoteAddress":"127.0.0.1","remotePort":36336},"msg":"incoming request"}
{"level":30,"time":1794925133031,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":403},"responseTime":2.294699000000037,"msg":"request completed"}
{"level":30,"time":1794925133032,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857","host":"127.0.0.1:35889","remoteAddress":"127.0.0.1","remotePort":47396},"msg":"incoming request"}
{"level":30,"time":1794925133035,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.1240189999999757,"msg":"request completed"}
{"level":30,"time":1794925133040,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857/review","host":"127.0.0.1:33217","remoteAddress":"127.0.0.1","remotePort":39800},"msg":"incoming request"}
{"level":30,"time":1794925133044,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.011632999999961,"msg":"request completed"}
{"level":30,"time":1794925133045,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857","host":"127.0.0.1:37931","remoteAddress":"127.0.0.1","remotePort":47690},"msg":"incoming request"}
{"level":30,"time":1794925133049,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.4331269999999563,"msg":"request completed"}
{"level":30,"time":1794925133050,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857/sections/925ae933-b800-428e-9945-4711ca17b0d6/link-tasks","host":"127.0.0.1:45701","remoteAddress":"127.0.0.1","remotePort":57788},"msg":"incoming request"}
{"level":30,"time":1794925133052,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":204},"responseTime":2.3763020000000097,"msg":"request completed"}
{"level":30,"time":1794925133053,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857","host":"127.0.0.1:33029","remoteAddress":"127.0.0.1","remotePort":59804},"msg":"incoming request"}
{"level":30,"time":1794925133055,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.318694999999991,"msg":"request completed"}
{"level":30,"time":1794925133056,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41867","remoteAddress":"127.0.0.1","remotePort":51082},"msg":"incoming request"}
{"level":30,"time":1794925133066,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":10.26252199999999,"msg":"request completed"}
{"level":30,"time":1794925133068,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/4aae0236-845b-4c8d-9afe-810192350857/materialize-tasks","host":"127.0.0.1:35827","remoteAddress":"127.0.0.1","remotePort":42026},"msg":"incoming request"}
{"level":30,"time":1794925133072,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.264798999999982,"msg":"request completed"}
{"level":30,"time":1794925133074,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=c5845056-4fa2-493f-a9ee-2dadb78c17d7","host":"127.0.0.1:40347","remoteAddress":"127.0.0.1","remotePort":33278},"msg":"incoming request"}
{"level":30,"time":1794925133076,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.603147999999976,"msg":"request completed"}
{"level":30,"time":1794925133078,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40857","remoteAddress":"127.0.0.1","remotePort":53026},"msg":"incoming request"}
{"level":30,"time":1794925133081,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":201},"responseTime":3.1013039999999705,"msg":"request completed"}
{"level":30,"time":1794925133082,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/395d2541-2bdf-46b6-a486-8032bdc6fedf/review","host":"127.0.0.1:34297","remoteAddress":"127.0.0.1","remotePort":41290},"msg":"incoming request"}
{"level":30,"time":1794925133084,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":409},"responseTime":1.9737960000000498,"msg":"request completed"}
{"level":30,"time":1794925133085,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46235","remoteAddress":"127.0.0.1","remotePort":55536},"msg":"incoming request"}
{"level":30,"time":1794925133087,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.574615000000051,"msg":"request completed"}
{"level":30,"time":1794925133088,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/357aab4e-8235-4079-8e0b-9bf55fb6184a/submit-review","host":"127.0.0.1:35879","remoteAddress":"127.0.0.1","remotePort":59000},"msg":"incoming request"}
{"level":30,"time":1794925133090,"pid":143817,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.77434199999999,"msg":"request completed"}
{"level":30,"time":1794925133129,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46023","remoteAddress":"127.0.0.1","remotePort":53072},"msg":"incoming request"}
{"level":30,"time":1794925133144,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":14.784003000000041,"msg":"request completed"}
{"level":30,"time":1794925133148,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:38363","remoteAddress":"127.0.0.1","remotePort":55226},"msg":"incoming request"}
{"level":30,"time":1794925133150,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.168542000000002,"msg":"request completed"}
{"level":30,"time":1794925133152,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39119","remoteAddress":"127.0.0.1","remotePort":48020},"msg":"incoming request"}
{"level":30,"time":1794925133156,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.721336000000008,"msg":"request completed"}
{"level":30,"time":1794925133158,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40899","remoteAddress":"127.0.0.1","remotePort":54424},"msg":"incoming request"}
{"level":30,"time":1794925133173,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":15.49212300000005,"msg":"request completed"}
{"level":30,"time":1794925133175,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35343","remoteAddress":"127.0.0.1","remotePort":36026},"msg":"incoming request"}
{"level":30,"time":1794925133178,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.2980340000000297,"msg":"request completed"}
{"level":30,"time":1794925133179,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/0a7e6a28-d659-4a26-8bb5-b18ba08a3460/timeline","host":"127.0.0.1:40901","remoteAddress":"127.0.0.1","remotePort":40728},"msg":"incoming request"}
{"level":30,"time":1794925133182,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.669472999999982,"msg":"request completed"}
{"level":30,"time":1794925133183,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44853","remoteAddress":"127.0.0.1","remotePort":58050},"msg":"incoming request"}
{"level":30,"time":1794925133186,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":2.718195000000037,"msg":"request completed"}
{"level":30,"time":1794925133187,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/04de187d-13b8-4d2a-8d89-1b8a917680f0/status","host":"127.0.0.1:37595","remoteAddress":"127.0.0.1","remotePort":52874},"msg":"incoming request"}
{"level":30,"time":1794925133189,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":2.0291199999999776,"msg":"request completed"}
{"level":30,"time":1794925133191,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34839","remoteAddress":"127.0.0.1","remotePort":50568},"msg":"incoming request"}
{"level":30,"time":1794925133195,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":4.225986000000034,"msg":"request completed"}
{"level":30,"time":1794925133196,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/f78ad660-703e-44c4-a3b4-5e7db83dc6cd/status","host":"127.0.0.1:37455","remoteAddress":"127.0.0.1","remotePort":49780},"msg":"incoming request"}
{"level":30,"time":1794925133198,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.9539589999999976,"msg":"request completed"}
{"level":30,"time":1794925133199,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/f78ad660-703e-44c4-a3b4-5e7db83dc6cd/status","host":"127.0.0.1:46559","remoteAddress":"127.0.0.1","remotePort":56016},"msg":"incoming request"}
{"level":30,"time":1794925133202,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.125139000000047,"msg":"request completed"}
{"level":30,"time":1794925133203,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/f78ad660-703e-44c4-a3b4-5e7db83dc6cd/status","host":"127.0.0.1:42527","remoteAddress":"127.0.0.1","remotePort":35476},"msg":"incoming request"}
{"level":30,"time":1794925133205,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.7085380000000328,"msg":"request completed"}
{"level":30,"time":1794925133206,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/f78ad660-703e-44c4-a3b4-5e7db83dc6cd/status","host":"127.0.0.1:34109","remoteAddress":"127.0.0.1","remotePort":52292},"msg":"incoming request"}
{"level":30,"time":1794925133209,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":3.26581299999998,"msg":"request completed"}
{"level":30,"time":1794925133210,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/f78ad660-703e-44c4-a3b4-5e7db83dc6cd/status","host":"127.0.0.1:38245","remoteAddress":"127.0.0.1","remotePort":60678},"msg":"incoming request"}
{"level":30,"time":1794925133213,"pid":143829,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.6481229999999982,"msg":"request completed"}
{"level":30,"time":1794925133277,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:39313","remoteAddress":"127.0.0.1","remotePort":42734},"msg":"incoming request"}
{"level":30,"time":1794925133283,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":6.3297959999999875,"msg":"request completed"}
{"level":30,"time":1794925133286,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:38585","remoteAddress":"127.0.0.1","remotePort":50260},"msg":"incoming request"}
{"level":30,"time":1794925133293,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":6.696484999999996,"msg":"request completed"}
{"level":30,"time":1794925133295,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38143","remoteAddress":"127.0.0.1","remotePort":43210},"msg":"incoming request"}
{"level":30,"time":1794925133297,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.3192449999999667,"msg":"request completed"}
{"level":30,"time":1794925133298,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/1835a755-3176-4a04-88e8-bdb40c19c662","host":"127.0.0.1:38723","remoteAddress":"127.0.0.1","remotePort":43190},"msg":"incoming request"}
{"level":30,"time":1794925133301,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.1343459999999936,"msg":"request completed"}
{"level":30,"time":1794925133304,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35649","remoteAddress":"127.0.0.1","remotePort":38574},"msg":"incoming request"}
{"level":30,"time":1794925133305,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5940860000000043,"msg":"request completed"}
{"level":30,"time":1794925133306,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41813","remoteAddress":"127.0.0.1","remotePort":51002},"msg":"incoming request"}
{"level":30,"time":1794925133308,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.8825550000000248,"msg":"request completed"}
{"level":30,"time":1794925133310,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:37763","remoteAddress":"127.0.0.1","remotePort":41402},"msg":"incoming request"}
{"level":30,"time":1794925133314,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":4.083048000000019,"msg":"request completed"}
{"level":30,"time":1794925133315,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:45231","remoteAddress":"127.0.0.1","remotePort":51806},"msg":"incoming request"}
{"level":30,"time":1794925133318,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":3.162018000000046,"msg":"request completed"}
{"level":30,"time":1794925133320,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=d08ca078-ce00-404d-b97a-5d67c037d39a&page_size=50","host":"127.0.0.1:46137","remoteAddress":"127.0.0.1","remotePort":32798},"msg":"incoming request"}
{"level":30,"time":1794925133322,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.1755059999999844,"msg":"request completed"}
{"level":30,"time":1794925133324,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:34493","remoteAddress":"127.0.0.1","remotePort":50104},"msg":"incoming request"}
{"level":30,"time":1794925133325,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.5633559999999989,"msg":"request completed"}
{"level":30,"time":1794925133327,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:37435","remoteAddress":"127.0.0.1","remotePort":52526},"msg":"incoming request"}
{"level":30,"time":1794925133329,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.923212000000035,"msg":"request completed"}
{"level":30,"time":1794925133330,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:40103","remoteAddress":"127.0.0.1","remotePort":33140},"msg":"incoming request"}
{"level":30,"time":1794925133332,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":2.1807549999999765,"msg":"request completed"}
{"level":30,"time":1794925133340,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:44815","remoteAddress":"127.0.0.1","remotePort":44636},"msg":"incoming request"}
{"level":30,"time":1794925133343,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.4893640000000232,"msg":"request completed"}
{"level":30,"time":1794925133344,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=d08ca078-ce00-404d-b97a-5d67c037d39a&action_type=record_view","host":"127.0.0.1:35793","remoteAddress":"127.0.0.1","remotePort":55502},"msg":"incoming request"}
{"level":30,"time":1794925133350,"pid":143842,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":6.05316700000003,"msg":"request completed"}
{"level":30,"time":1794925133406,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33627","remoteAddress":"127.0.0.1","remotePort":42712},"msg":"incoming request"}
{"level":30,"time":1794925133424,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":17.442916000000025,"msg":"request completed"}
{"level":30,"time":1794925133428,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34095","remoteAddress":"127.0.0.1","remotePort":49434},"msg":"incoming request"}
{"level":30,"time":1794925133432,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":4.402839000000029,"msg":"request completed"}
{"level":30,"time":1794925133433,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:46053","remoteAddress":"127.0.0.1","remotePort":49744},"msg":"incoming request"}
{"level":30,"time":1794925133436,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8972709999999893,"msg":"request completed"}
{"level":30,"time":1794925133438,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46471","remoteAddress":"127.0.0.1","remotePort":40850},"msg":"incoming request"}
{"level":30,"time":1794925133441,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1397360000000276,"msg":"request completed"}
{"level":30,"time":1794925133443,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:33157","remoteAddress":"127.0.0.1","remotePort":48864},"msg":"incoming request"}
{"level":30,"time":1794925133444,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.685405000000003,"msg":"request completed"}
{"level":30,"time":1794925133446,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:44923","remoteAddress":"127.0.0.1","remotePort":48370},"msg":"incoming request"}
{"level":30,"time":1794925133447,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":1.6387679999999705,"msg":"request completed"}
{"level":30,"time":1794925133449,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41485","remoteAddress":"127.0.0.1","remotePort":49734},"msg":"incoming request"}
{"level":30,"time":1794925133450,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6715190000000462,"msg":"request completed"}
{"level":30,"time":1794925133453,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:40633","remoteAddress":"127.0.0.1","remotePort":45906},"msg":"incoming request"}
{"level":30,"time":1794925133455,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2667660000000183,"msg":"request completed"}
{"level":30,"time":1794925133456,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:35685","remoteAddress":"127.0.0.1","remotePort":38658},"msg":"incoming request"}
{"level":30,"time":1794925133458,"pid":143854,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9133129999999596,"msg":"request completed"}
{"level":30,"time":1794925133508,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37609","remoteAddress":"127.0.0.1","remotePort":41220},"msg":"incoming request"}
{"level":30,"time":1794925133522,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":14.06314900000001,"msg":"request completed"}
{"level":30,"time":1794925133529,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/93261111-6ad8-4ac3-872a-6f195ddb2935/timeline","host":"127.0.0.1:39745","remoteAddress":"127.0.0.1","remotePort":36130},"msg":"incoming request"}
{"level":30,"time":1794925133533,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.031381999999951,"msg":"request completed"}
{"level":30,"time":1794925133537,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38739","remoteAddress":"127.0.0.1","remotePort":57020},"msg":"incoming request"}
{"level":30,"time":1794925133540,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.0822580000000244,"msg":"request completed"}
{"level":30,"time":1794925133542,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/69ec55e6-73c6-41eb-b390-776886905afa/closure","host":"127.0.0.1:42113","remoteAddress":"127.0.0.1","remotePort":35278},"msg":"incoming request"}
{"level":30,"time":1794925133546,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.9884400000000255,"msg":"request completed"}
{"level":30,"time":1794925133547,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/69ec55e6-73c6-41eb-b390-776886905afa/timeline","host":"127.0.0.1:44139","remoteAddress":"127.0.0.1","remotePort":45678},"msg":"incoming request"}
{"level":30,"time":1794925133550,"pid":143866,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.125528999999972,"msg":"request completed"}
{"level":30,"time":1794925133615,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41899","remoteAddress":"127.0.0.1","remotePort":34050},"msg":"incoming request"}
{"level":30,"time":1794925133620,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.18777300000005,"msg":"request completed"}
{"level":30,"time":1794925133623,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44385","remoteAddress":"127.0.0.1","remotePort":44670},"msg":"incoming request"}
{"level":30,"time":1794925133623,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18268299999999726,"msg":"request completed"}
{"level":30,"time":1794925133625,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:37281","remoteAddress":"127.0.0.1","remotePort":54764},"msg":"incoming request"}
{"level":30,"time":1794925133627,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6036600000000476,"msg":"request completed"}
{"level":30,"time":1794925133628,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38729","remoteAddress":"127.0.0.1","remotePort":34836},"msg":"incoming request"}
{"level":30,"time":1794925133630,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.6310629999999833,"msg":"request completed"}
{"level":30,"time":1794925133631,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38305","remoteAddress":"127.0.0.1","remotePort":48286},"msg":"incoming request"}
{"level":30,"time":1794925133632,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4475480000000402,"msg":"request completed"}
{"level":30,"time":1794925133633,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45067","remoteAddress":"127.0.0.1","remotePort":59372},"msg":"incoming request"}
{"level":30,"time":1794925133634,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4056019999999876,"msg":"request completed"}
{"level":30,"time":1794925133635,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:34447","remoteAddress":"127.0.0.1","remotePort":50144},"msg":"incoming request"}
{"level":30,"time":1794925133636,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3517489999999839,"msg":"request completed"}
{"level":30,"time":1794925133638,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:39631","remoteAddress":"127.0.0.1","remotePort":48660},"msg":"incoming request"}
{"level":30,"time":1794925133639,"pid":143881,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.995189000000039,"msg":"request completed"}

 Test Files  11 passed (11)
      Tests  55 passed (55)
   Start at  14:18:51
   Duration  1.68s (transform 372ms, setup 45ms, import 1.96s, tests 2.07s, environment 0ms)
```

## Wave 5

- Build: `npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app` → pass
- Tests: `npm test && npm test -w frontend/design-system` → pass
- Fix attempts: 0/3 — pre_existing: eventbus.test.ts (phase-1 file, untouched by phase 3) failed once on first run with cross-test-file NATS durable-consumer state race (wrong user_id delivered), passed in isolation and passed on full-suite re-run with zero code changes — not traceable to this phase's diff. backend 11/11 55/55 on confirming re-run; design-system 5/5 46/46; frontend/app build clean

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794927581558,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38021","remoteAddress":"127.0.0.1","remotePort":50302},"msg":"incoming request"}
{"level":30,"time":1794927581565,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:40933","remoteAddress":"127.0.0.1","remotePort":42264},"msg":"incoming request"}
{"level":30,"time":1794927581568,"pid":247908,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:33717","remoteAddress":"127.0.0.1","remotePort":52396},"msg":"incoming request"}
{"level":30,"time":1794927581574,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.566598999999997,"msg":"request completed"}
{"level":30,"time":1794927581577,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/0b8aad89-a0d5-4f6d-8b14-80719794db1e/timeline","host":"127.0.0.1:33437","remoteAddress":"127.0.0.1","remotePort":47368},"msg":"incoming request"}
{"level":30,"time":1794927581581,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.777349999999956,"msg":"request completed"}
{"level":30,"time":1794927581583,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44671","remoteAddress":"127.0.0.1","remotePort":57442},"msg":"incoming request"}
{"level":30,"time":1794927581587,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.909468000000004,"msg":"request completed"}
{"level":30,"time":1794927581588,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34097","remoteAddress":"127.0.0.1","remotePort":33612},"msg":"incoming request"}
{"level":30,"time":1794927581590,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":2.0829899999999952,"msg":"request completed"}
{"level":30,"time":1794927581592,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40215","remoteAddress":"127.0.0.1","remotePort":58434},"msg":"incoming request"}
{"level":30,"time":1794927581595,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.501002000000028,"msg":"request completed"}
{"level":30,"time":1794927581597,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36585","remoteAddress":"127.0.0.1","remotePort":49048},"msg":"incoming request"}
{"level":30,"time":1794927581601,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":3.333055999999999,"msg":"request completed"}
{"level":30,"time":1794927581602,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37717","remoteAddress":"127.0.0.1","remotePort":51000},"msg":"incoming request"}
{"level":30,"time":1794927581605,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":3.329589999999996,"msg":"request completed"}
{"level":30,"time":1794927581606,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39029","remoteAddress":"127.0.0.1","remotePort":38294},"msg":"incoming request"}
{"level":30,"time":1794927581612,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":5.488992999999994,"msg":"request completed"}
{"level":30,"time":1794927581614,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:37219","remoteAddress":"127.0.0.1","remotePort":51116},"msg":"incoming request"}
{"level":30,"time":1794927581619,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":4.526776999999981,"msg":"request completed"}
{"level":30,"time":1794927581620,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":54.375134,"msg":"request completed"}
{"level":30,"time":1794927581621,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35571","remoteAddress":"127.0.0.1","remotePort":52976},"msg":"incoming request"}
{"level":30,"time":1794927581624,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46453","remoteAddress":"127.0.0.1","remotePort":57954},"msg":"incoming request"}
{"level":30,"time":1794927581625,"pid":247908,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":56.087738,"msg":"request completed"}
{"level":30,"time":1794927581625,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.6211470000000077,"msg":"request completed"}
{"level":30,"time":1794927581626,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/2546f2db-c208-4ac4-a96e-ef55ba30e507","host":"127.0.0.1:37891","remoteAddress":"127.0.0.1","remotePort":37742},"msg":"incoming request"}
{"level":30,"time":1794927581641,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":1.928841000000034,"msg":"request completed"}
{"level":30,"time":1794927581642,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:33215","remoteAddress":"127.0.0.1","remotePort":43930},"msg":"incoming request"}
{"level":30,"time":1794927581645,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.9658660000000054,"msg":"request completed"}
{"level":30,"time":1794927581646,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/2546f2db-c208-4ac4-a96e-ef55ba30e507","host":"127.0.0.1:36791","remoteAddress":"127.0.0.1","remotePort":59410},"msg":"incoming request"}
{"level":30,"time":1794927581649,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":25.00678800000003,"msg":"request completed"}
{"level":30,"time":1794927581649,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":2.8856059999999957,"msg":"request completed"}
{"level":30,"time":1794927581650,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/2546f2db-c208-4ac4-a96e-ef55ba30e507/timeline","host":"127.0.0.1:38649","remoteAddress":"127.0.0.1","remotePort":34024},"msg":"incoming request"}
{"level":30,"time":1794927581650,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38107","remoteAddress":"127.0.0.1","remotePort":37216},"msg":"incoming request"}
{"level":30,"time":1794927581651,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":1.4541090000000167,"msg":"request completed"}
{"level":30,"time":1794927581652,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42597","remoteAddress":"127.0.0.1","remotePort":43758},"msg":"incoming request"}
{"level":30,"time":1794927581655,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.6848039999999855,"msg":"request completed"}
{"level":30,"time":1794927581655,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":3.1462149999999838,"msg":"request completed"}
{"level":30,"time":1794927581657,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/87791a30-5ecb-4019-a655-15aa50250c1f/decline","host":"127.0.0.1:34413","remoteAddress":"127.0.0.1","remotePort":41714},"msg":"incoming request"}
{"level":30,"time":1794927581659,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.8228219999999737,"msg":"request completed"}
{"level":30,"time":1794927581661,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=b9e2f0e3-70de-4021-b131-115830cf5451","host":"127.0.0.1:42363","remoteAddress":"127.0.0.1","remotePort":49882},"msg":"incoming request"}
{"level":30,"time":1794927581663,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.085715999999991,"msg":"request completed"}
{"level":30,"time":1794927581664,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/87791a30-5ecb-4019-a655-15aa50250c1f/decline","host":"127.0.0.1:43947","remoteAddress":"127.0.0.1","remotePort":34312},"msg":"incoming request"}
{"level":30,"time":1794927581666,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46023","remoteAddress":"127.0.0.1","remotePort":56910},"msg":"incoming request"}
{"level":30,"time":1794927581668,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.8048729999999864,"msg":"request completed"}
{"level":30,"time":1794927581669,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/b9e2f0e3-70de-4021-b131-115830cf5451/timeline","host":"127.0.0.1:39031","remoteAddress":"127.0.0.1","remotePort":44230},"msg":"incoming request"}
{"level":30,"time":1794927581676,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":10.176671999999996,"msg":"request completed"}
{"level":30,"time":1794927581677,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44529","remoteAddress":"127.0.0.1","remotePort":53724},"msg":"incoming request"}
{"level":30,"time":1794927581678,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":8.811087999999984,"msg":"request completed"}
{"level":30,"time":1794927581680,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44229","remoteAddress":"127.0.0.1","remotePort":41712},"msg":"incoming request"}
{"level":30,"time":1794927581682,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":4.085208000000023,"msg":"request completed"}
{"level":30,"time":1794927581683,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37623","remoteAddress":"127.0.0.1","remotePort":42226},"msg":"incoming request"}
{"level":30,"time":1794927581685,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":5.279478999999981,"msg":"request completed"}
{"level":30,"time":1794927581686,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":201},"responseTime":3.011322000000007,"msg":"request completed"}
{"level":30,"time":1794927581686,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35705","remoteAddress":"127.0.0.1","remotePort":52274},"msg":"incoming request"}
{"level":30,"time":1794927581687,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46493","remoteAddress":"127.0.0.1","remotePort":39506},"msg":"incoming request"}
{"level":30,"time":1794927581690,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.6127609999999777,"msg":"request completed"}
{"level":40,"time":1794927581690,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:266:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794927581692,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/6d23f200-e1e8-4b0a-b4d7-746fca788f7e/approve","host":"127.0.0.1:35345","remoteAddress":"127.0.0.1","remotePort":54952},"msg":"incoming request"}
{"level":30,"time":1794927581692,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":201},"responseTime":4.929832999999974,"msg":"request completed"}
{"level":30,"time":1794927581693,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/81388949-9451-4601-9761-ef1c9bdfdf26/approve","host":"127.0.0.1:45229","remoteAddress":"127.0.0.1","remotePort":53216},"msg":"incoming request"}
{"level":40,"time":1794927581695,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:321:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794927581696,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":200},"responseTime":2.8984909999999786,"msg":"request completed"}
{"level":30,"time":1794927581697,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.703789000000029,"msg":"request completed"}
{"level":30,"time":1794927581697,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:39647","remoteAddress":"127.0.0.1","remotePort":56728},"msg":"incoming request"}
{"level":30,"time":1794927581698,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/6d23f200-e1e8-4b0a-b4d7-746fca788f7e/fulfill","host":"127.0.0.1:41057","remoteAddress":"127.0.0.1","remotePort":59434},"msg":"incoming request"}
{"level":30,"time":1794927581699,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":1.778287999999975,"msg":"request completed"}
{"level":30,"time":1794927581700,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45619","remoteAddress":"127.0.0.1","remotePort":40848},"msg":"incoming request"}
{"level":30,"time":1794927581701,"pid":247909,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":403},"responseTime":1.0616319999999746,"msg":"request completed"}
{"level":30,"time":1794927581701,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.402766999999983,"msg":"request completed"}
{"level":30,"time":1794927581702,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/6d23f200-e1e8-4b0a-b4d7-746fca788f7e/fulfill","host":"127.0.0.1:35493","remoteAddress":"127.0.0.1","remotePort":54826},"msg":"incoming request"}
{"level":30,"time":1794927581707,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":4.296846000000016,"msg":"request completed"}
{"level":30,"time":1794927581708,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/820f129d-4de4-4079-86b4-86c3ec006a37/timeline","host":"127.0.0.1:37537","remoteAddress":"127.0.0.1","remotePort":48888},"msg":"incoming request"}
{"level":30,"time":1794927581710,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.028466999999978,"msg":"request completed"}
{"level":30,"time":1794927581834,"pid":247908,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:36203","remoteAddress":"127.0.0.1","remotePort":36060},"msg":"incoming request"}
{"level":30,"time":1794927581838,"pid":247908,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.465876000000094,"msg":"request completed"}
stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:169:13

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

 ❯ src/modules/integration-gateway/eventbus.test.ts (4 tests | 1 failed) 342ms
     × a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key 205ms
{"level":30,"time":1794927581912,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32889","remoteAddress":"127.0.0.1","remotePort":33738},"msg":"incoming request"}
{"level":30,"time":1794927581916,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":4.407602999999995,"msg":"request completed"}
{"level":30,"time":1794927581918,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:44657","remoteAddress":"127.0.0.1","remotePort":36676},"msg":"incoming request"}
{"level":30,"time":1794927581919,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.3717149999999947,"msg":"request completed"}
{"level":30,"time":1794927581920,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41931","remoteAddress":"127.0.0.1","remotePort":34230},"msg":"incoming request"}
{"level":30,"time":1794927581923,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":2.9846129999999675,"msg":"request completed"}
{"level":30,"time":1794927581924,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38999","remoteAddress":"127.0.0.1","remotePort":38518},"msg":"incoming request"}
{"level":30,"time":1794927581927,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.2722259999999324,"msg":"request completed"}
{"level":30,"time":1794927581928,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/e70f882d-2c10-4c51-8a3a-3cbb4ac7e8a9/fulfill","host":"127.0.0.1:37585","remoteAddress":"127.0.0.1","remotePort":49662},"msg":"incoming request"}
{"level":30,"time":1794927581929,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":1.6242280000000164,"msg":"request completed"}
{"level":30,"time":1794927581930,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/e70f882d-2c10-4c51-8a3a-3cbb4ac7e8a9/approve","host":"127.0.0.1:36187","remoteAddress":"127.0.0.1","remotePort":51688},"msg":"incoming request"}
{"level":30,"time":1794927581932,"pid":247907,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.4951170000000502,"msg":"request completed"}
{"level":30,"time":1794927581957,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37077","remoteAddress":"127.0.0.1","remotePort":50172},"msg":"incoming request"}
{"level":30,"time":1794927581974,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.63455399999998,"msg":"request completed"}
{"level":30,"time":1794927581977,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/activation","host":"127.0.0.1:35225","remoteAddress":"127.0.0.1","remotePort":58726},"msg":"incoming request"}
{"level":30,"time":1794927581980,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":3.0375609999999824,"msg":"request completed"}
{"level":30,"time":1794927581982,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927","host":"127.0.0.1:34009","remoteAddress":"127.0.0.1","remotePort":38672},"msg":"incoming request"}
{"level":30,"time":1794927581984,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6157389999999623,"msg":"request completed"}
{"level":30,"time":1794927581985,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/command-roles","host":"127.0.0.1:43615","remoteAddress":"127.0.0.1","remotePort":50870},"msg":"incoming request"}
{"level":30,"time":1794927581988,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":2.8568630000000326,"msg":"request completed"}
{"level":30,"time":1794927581989,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/activation","host":"127.0.0.1:46433","remoteAddress":"127.0.0.1","remotePort":35508},"msg":"incoming request"}
{"level":30,"time":1794927581993,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.7780710000000113,"msg":"request completed"}
{"level":30,"time":1794927581994,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/timeline","host":"127.0.0.1:45327","remoteAddress":"127.0.0.1","remotePort":59502},"msg":"incoming request"}
{"level":30,"time":1794927581997,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.484253000000024,"msg":"request completed"}
{"level":30,"time":1794927582000,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/activation","host":"127.0.0.1:42049","remoteAddress":"127.0.0.1","remotePort":60876},"msg":"incoming request"}
{"level":30,"time":1794927582001,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.3657929999999965,"msg":"request completed"}
{"level":30,"time":1794927582002,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927","host":"127.0.0.1:37163","remoteAddress":"127.0.0.1","remotePort":49246},"msg":"incoming request"}
{"level":30,"time":1794927582004,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2733779999999797,"msg":"request completed"}
{"level":30,"time":1794927582005,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/command-roles","host":"127.0.0.1:46123","remoteAddress":"127.0.0.1","remotePort":42626},"msg":"incoming request"}
{"level":30,"time":1794927582008,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.1958589999999845,"msg":"request completed"}
{"level":30,"time":1794927582009,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/timeline","host":"127.0.0.1:38675","remoteAddress":"127.0.0.1","remotePort":50576},"msg":"incoming request"}
{"level":30,"time":1794927582011,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8441310000000044,"msg":"request completed"}
{"level":30,"time":1794927582012,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/closure","host":"127.0.0.1:33589","remoteAddress":"127.0.0.1","remotePort":53516},"msg":"incoming request"}
{"level":30,"time":1794927582016,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.6631360000000086,"msg":"request completed"}
{"level":30,"time":1794927582017,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/301fdace-4042-41e0-a1e5-75d1b855b927/timeline","host":"127.0.0.1:43465","remoteAddress":"127.0.0.1","remotePort":55168},"msg":"incoming request"}
{"level":30,"time":1794927582019,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":1.8440919999999892,"msg":"request completed"}
{"level":30,"time":1794927582020,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40537","remoteAddress":"127.0.0.1","remotePort":57848},"msg":"incoming request"}
{"level":30,"time":1794927582023,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":3.141477000000009,"msg":"request completed"}
{"level":30,"time":1794927582024,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/dc068e84-bf36-4794-b1f1-f43457bf508e/command-roles","host":"127.0.0.1:38593","remoteAddress":"127.0.0.1","remotePort":54146},"msg":"incoming request"}
{"level":30,"time":1794927582026,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.4162350000000288,"msg":"request completed"}
{"level":30,"time":1794927582027,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/dc068e84-bf36-4794-b1f1-f43457bf508e/command-roles","host":"127.0.0.1:44435","remoteAddress":"127.0.0.1","remotePort":46130},"msg":"incoming request"}
{"level":30,"time":1794927582030,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.3474860000000035,"msg":"request completed"}
{"level":30,"time":1794927582031,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/dc068e84-bf36-4794-b1f1-f43457bf508e/timeline","host":"127.0.0.1:40115","remoteAddress":"127.0.0.1","remotePort":59354},"msg":"incoming request"}
{"level":30,"time":1794927582043,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":12.044336999999985,"msg":"request completed"}
{"level":30,"time":1794927582045,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41159","remoteAddress":"127.0.0.1","remotePort":54804},"msg":"incoming request"}
{"level":30,"time":1794927582049,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.9572880000000055,"msg":"request completed"}
{"level":30,"time":1794927582050,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/20fe907c-bc0d-4a01-86f2-065aed3a1cb8/activation","host":"127.0.0.1:36213","remoteAddress":"127.0.0.1","remotePort":42022},"msg":"incoming request"}
{"level":30,"time":1794927582052,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.853529999999978,"msg":"request completed"}
{"level":30,"time":1794927582053,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/20fe907c-bc0d-4a01-86f2-065aed3a1cb8/command-roles","host":"127.0.0.1:33661","remoteAddress":"127.0.0.1","remotePort":45450},"msg":"incoming request"}
{"level":30,"time":1794927582054,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.4072419999999966,"msg":"request completed"}
{"level":30,"time":1794927582055,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/20fe907c-bc0d-4a01-86f2-065aed3a1cb8/closure","host":"127.0.0.1:37799","remoteAddress":"127.0.0.1","remotePort":45068},"msg":"incoming request"}
{"level":30,"time":1794927582056,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.2878170000000182,"msg":"request completed"}
{"level":30,"time":1794927582057,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/20fe907c-bc0d-4a01-86f2-065aed3a1cb8/activation","host":"127.0.0.1:33405","remoteAddress":"127.0.0.1","remotePort":37520},"msg":"incoming request"}
{"level":30,"time":1794927582060,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.6249669999999696,"msg":"request completed"}
{"level":30,"time":1794927582061,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40699","remoteAddress":"127.0.0.1","remotePort":40208},"msg":"incoming request"}
{"level":30,"time":1794927582064,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":3.3813879999999585,"msg":"request completed"}
{"level":30,"time":1794927582065,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/b72dbae8-c016-4214-bf92-e3fe10c8a854/closure","host":"127.0.0.1:40333","remoteAddress":"127.0.0.1","remotePort":34162},"msg":"incoming request"}
{"level":30,"time":1794927582068,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":2.893461000000002,"msg":"request completed"}
{"level":30,"time":1794927582069,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/b72dbae8-c016-4214-bf92-e3fe10c8a854/closure","host":"127.0.0.1:34447","remoteAddress":"127.0.0.1","remotePort":47598},"msg":"incoming request"}
{"level":30,"time":1794927582074,"pid":247946,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":4.765945999999985,"msg":"request completed"}
{"level":30,"time":1794927582117,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:36157","remoteAddress":"127.0.0.1","remotePort":38994},"msg":"incoming request"}
{"level":30,"time":1794927582130,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":13.03125,"msg":"request completed"}
{"level":30,"time":1794927582132,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695/submit-review","host":"127.0.0.1:35337","remoteAddress":"127.0.0.1","remotePort":46754},"msg":"incoming request"}
{"level":30,"time":1794927582141,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":8.43717700000002,"msg":"request completed"}
{"level":30,"time":1794927582143,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695/review","host":"127.0.0.1:45909","remoteAddress":"127.0.0.1","remotePort":38418},"msg":"incoming request"}
{"level":30,"time":1794927582145,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":403},"responseTime":2.4989209999999957,"msg":"request completed"}
{"level":30,"time":1794927582146,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695","host":"127.0.0.1:45129","remoteAddress":"127.0.0.1","remotePort":59930},"msg":"incoming request"}
{"level":30,"time":1794927582149,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.195871000000011,"msg":"request completed"}
{"level":30,"time":1794927582150,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695/review","host":"127.0.0.1:44021","remoteAddress":"127.0.0.1","remotePort":39446},"msg":"incoming request"}
{"level":30,"time":1794927582154,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.805229999999995,"msg":"request completed"}
{"level":30,"time":1794927582155,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695","host":"127.0.0.1:42361","remoteAddress":"127.0.0.1","remotePort":36580},"msg":"incoming request"}
{"level":30,"time":1794927582158,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.2574070000000006,"msg":"request completed"}
{"level":30,"time":1794927582159,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695/sections/0ae14175-2376-4d1c-9cca-a508749114a2/link-tasks","host":"127.0.0.1:42039","remoteAddress":"127.0.0.1","remotePort":49246},"msg":"incoming request"}
{"level":30,"time":1794927582161,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":204},"responseTime":1.9912279999999782,"msg":"request completed"}
{"level":30,"time":1794927582162,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695","host":"127.0.0.1:42545","remoteAddress":"127.0.0.1","remotePort":37938},"msg":"incoming request"}
{"level":30,"time":1794927582164,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9213970000000131,"msg":"request completed"}
{"level":30,"time":1794927582165,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38213","remoteAddress":"127.0.0.1","remotePort":57960},"msg":"incoming request"}
{"level":30,"time":1794927582176,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":11.504584000000023,"msg":"request completed"}
{"level":30,"time":1794927582178,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/7ded5b30-2229-4c6e-9f60-c0bcfc741695/materialize-tasks","host":"127.0.0.1:36879","remoteAddress":"127.0.0.1","remotePort":47608},"msg":"incoming request"}
{"level":30,"time":1794927582182,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.327362000000051,"msg":"request completed"}
{"level":30,"time":1794927582184,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=da127537-c5ec-4cad-982b-e3ee7f2f4c19","host":"127.0.0.1:33103","remoteAddress":"127.0.0.1","remotePort":51384},"msg":"incoming request"}
{"level":30,"time":1794927582187,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.666716000000008,"msg":"request completed"}
{"level":30,"time":1794927582188,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:39007","remoteAddress":"127.0.0.1","remotePort":45074},"msg":"incoming request"}
{"level":30,"time":1794927582191,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":201},"responseTime":3.0916930000000207,"msg":"request completed"}
{"level":30,"time":1794927582192,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/7060f043-7593-4ff1-a988-e6e84df5f476/review","host":"127.0.0.1:37937","remoteAddress":"127.0.0.1","remotePort":37352},"msg":"incoming request"}
{"level":30,"time":1794927582194,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":409},"responseTime":1.8780550000000176,"msg":"request completed"}
{"level":30,"time":1794927582195,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:39099","remoteAddress":"127.0.0.1","remotePort":52446},"msg":"incoming request"}
{"level":30,"time":1794927582198,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.8822300000000496,"msg":"request completed"}
{"level":30,"time":1794927582199,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/7d1993f5-65a5-4cd3-b314-6ac509bba0f1/submit-review","host":"127.0.0.1:38469","remoteAddress":"127.0.0.1","remotePort":34300},"msg":"incoming request"}
{"level":30,"time":1794927582201,"pid":247957,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":2.2751609999999687,"msg":"request completed"}
{"level":30,"time":1794927582208,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40775","remoteAddress":"127.0.0.1","remotePort":49622},"msg":"incoming request"}
{"level":30,"time":1794927582213,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":4.744665999999995,"msg":"request completed"}
{"level":30,"time":1794927582217,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43137","remoteAddress":"127.0.0.1","remotePort":33296},"msg":"incoming request"}
{"level":30,"time":1794927582218,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":1.7563770000000432,"msg":"request completed"}
{"level":30,"time":1794927582219,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33205","remoteAddress":"127.0.0.1","remotePort":48212},"msg":"incoming request"}
{"level":30,"time":1794927582223,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.870705999999984,"msg":"request completed"}
{"level":30,"time":1794927582225,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37999","remoteAddress":"127.0.0.1","remotePort":45848},"msg":"incoming request"}
{"level":30,"time":1794927582250,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":25.153804999999977,"msg":"request completed"}
{"level":30,"time":1794927582251,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33735","remoteAddress":"127.0.0.1","remotePort":42566},"msg":"incoming request"}
{"level":30,"time":1794927582255,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.3973569999999995,"msg":"request completed"}
{"level":30,"time":1794927582256,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/b20e07b9-6500-4a65-9524-ba3fb89d3c5a/timeline","host":"127.0.0.1:39651","remoteAddress":"127.0.0.1","remotePort":60040},"msg":"incoming request"}
{"level":30,"time":1794927582259,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.2329879999999775,"msg":"request completed"}
{"level":30,"time":1794927582262,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43255","remoteAddress":"127.0.0.1","remotePort":57600},"msg":"incoming request"}
{"level":30,"time":1794927582266,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":3.105278999999996,"msg":"request completed"}
{"level":30,"time":1794927582266,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/5e3ac8f4-2a9c-43c7-aaff-23feb6796e96/status","host":"127.0.0.1:44795","remoteAddress":"127.0.0.1","remotePort":57696},"msg":"incoming request"}
{"level":30,"time":1794927582268,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":1.899966999999947,"msg":"request completed"}
{"level":30,"time":1794927582270,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45571","remoteAddress":"127.0.0.1","remotePort":52310},"msg":"incoming request"}
{"level":30,"time":1794927582273,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.3527630000000386,"msg":"request completed"}
{"level":30,"time":1794927582274,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/14d293cf-bb82-4df0-b9ab-54409616f622/status","host":"127.0.0.1:41453","remoteAddress":"127.0.0.1","remotePort":47350},"msg":"incoming request"}
{"level":30,"time":1794927582276,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.516947000000016,"msg":"request completed"}
{"level":30,"time":1794927582276,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/14d293cf-bb82-4df0-b9ab-54409616f622/status","host":"127.0.0.1:44069","remoteAddress":"127.0.0.1","remotePort":42300},"msg":"incoming request"}
{"level":30,"time":1794927582279,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.555327000000034,"msg":"request completed"}
{"level":30,"time":1794927582280,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/14d293cf-bb82-4df0-b9ab-54409616f622/status","host":"127.0.0.1:40095","remoteAddress":"127.0.0.1","remotePort":45772},"msg":"incoming request"}
{"level":30,"time":1794927582281,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4671240000000125,"msg":"request completed"}
{"level":30,"time":1794927582282,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/14d293cf-bb82-4df0-b9ab-54409616f622/status","host":"127.0.0.1:35191","remoteAddress":"127.0.0.1","remotePort":42058},"msg":"incoming request"}
{"level":30,"time":1794927582284,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.302191999999991,"msg":"request completed"}
{"level":30,"time":1794927582285,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/14d293cf-bb82-4df0-b9ab-54409616f622/status","host":"127.0.0.1:43331","remoteAddress":"127.0.0.1","remotePort":54774},"msg":"incoming request"}
{"level":30,"time":1794927582288,"pid":247969,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.452342999999985,"msg":"request completed"}
{"level":30,"time":1794927582369,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45333","remoteAddress":"127.0.0.1","remotePort":36650},"msg":"incoming request"}
{"level":30,"time":1794927582400,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":30.785045000000025,"msg":"request completed"}
{"level":30,"time":1794927582403,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:35075","remoteAddress":"127.0.0.1","remotePort":35168},"msg":"incoming request"}
{"level":30,"time":1794927582407,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.2212560000000394,"msg":"request completed"}
{"level":30,"time":1794927582408,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:36435","remoteAddress":"127.0.0.1","remotePort":48088},"msg":"incoming request"}
{"level":30,"time":1794927582410,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7259200000000305,"msg":"request completed"}
{"level":30,"time":1794927582411,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43719","remoteAddress":"127.0.0.1","remotePort":50046},"msg":"incoming request"}
{"level":30,"time":1794927582415,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.804772000000014,"msg":"request completed"}
{"level":30,"time":1794927582417,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/942d57ca-cd19-4e97-b6d0-d80b8966fe03/revoke","host":"127.0.0.1:44755","remoteAddress":"127.0.0.1","remotePort":44022},"msg":"incoming request"}
{"level":30,"time":1794927582420,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":3.2447310000000016,"msg":"request completed"}
{"level":30,"time":1794927582422,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35597","remoteAddress":"127.0.0.1","remotePort":44352},"msg":"incoming request"}
{"level":30,"time":1794927582441,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":18.306601999999998,"msg":"request completed"}
{"level":30,"time":1794927582442,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:37073","remoteAddress":"127.0.0.1","remotePort":44070},"msg":"incoming request"}
{"level":30,"time":1794927582444,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9170990000000074,"msg":"request completed"}
{"level":30,"time":1794927582445,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:45369","remoteAddress":"127.0.0.1","remotePort":56148},"msg":"incoming request"}
{"level":30,"time":1794927582448,"pid":247980,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.4298710000000483,"msg":"request completed"}
{"level":30,"time":1794927582500,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35909","remoteAddress":"127.0.0.1","remotePort":54990},"msg":"incoming request"}
{"level":30,"time":1794927582517,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.95446400000003,"msg":"request completed"}
{"level":30,"time":1794927582520,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37547","remoteAddress":"127.0.0.1","remotePort":42850},"msg":"incoming request"}
{"level":30,"time":1794927582524,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":4.0808999999999855,"msg":"request completed"}
{"level":30,"time":1794927582525,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:45947","remoteAddress":"127.0.0.1","remotePort":60390},"msg":"incoming request"}
{"level":30,"time":1794927582528,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8828609999999912,"msg":"request completed"}
{"level":30,"time":1794927582530,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35501","remoteAddress":"127.0.0.1","remotePort":38468},"msg":"incoming request"}
{"level":30,"time":1794927582541,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":10.868321000000037,"msg":"request completed"}
{"level":30,"time":1794927582543,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:45223","remoteAddress":"127.0.0.1","remotePort":51484},"msg":"incoming request"}
{"level":30,"time":1794927582545,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.3551109999999653,"msg":"request completed"}
{"level":30,"time":1794927582547,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:44945","remoteAddress":"127.0.0.1","remotePort":48574},"msg":"incoming request"}
{"level":30,"time":1794927582550,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":3.302257999999995,"msg":"request completed"}
{"level":30,"time":1794927582551,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:32973","remoteAddress":"127.0.0.1","remotePort":56368},"msg":"incoming request"}
{"level":30,"time":1794927582553,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9698270000000093,"msg":"request completed"}
{"level":30,"time":1794927582555,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:36175","remoteAddress":"127.0.0.1","remotePort":47982},"msg":"incoming request"}
{"level":30,"time":1794927582557,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.587617000000023,"msg":"request completed"}
{"level":30,"time":1794927582558,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:39581","remoteAddress":"127.0.0.1","remotePort":51852},"msg":"incoming request"}
{"level":30,"time":1794927582560,"pid":247994,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.066709000000003,"msg":"request completed"}
{"level":30,"time":1794927582603,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:33217","remoteAddress":"127.0.0.1","remotePort":35848},"msg":"incoming request"}
{"level":30,"time":1794927582611,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":7.45270899999997,"msg":"request completed"}
{"level":30,"time":1794927582615,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:46403","remoteAddress":"127.0.0.1","remotePort":50946},"msg":"incoming request"}
{"level":30,"time":1794927582624,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":8.395048000000031,"msg":"request completed"}
{"level":30,"time":1794927582645,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38975","remoteAddress":"127.0.0.1","remotePort":49238},"msg":"incoming request"}
{"level":30,"time":1794927582647,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8159250000000497,"msg":"request completed"}
{"level":30,"time":1794927582649,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/fbfd3732-905d-4800-9727-e0665b55edda","host":"127.0.0.1:40207","remoteAddress":"127.0.0.1","remotePort":46692},"msg":"incoming request"}
{"level":30,"time":1794927582652,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.8928899999999658,"msg":"request completed"}
{"level":30,"time":1794927582652,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36111","remoteAddress":"127.0.0.1","remotePort":35806},"msg":"incoming request"}
{"level":30,"time":1794927582653,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.4339650000000006,"msg":"request completed"}
{"level":30,"time":1794927582654,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35079","remoteAddress":"127.0.0.1","remotePort":36318},"msg":"incoming request"}
{"level":30,"time":1794927582655,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.1345499999999902,"msg":"request completed"}
{"level":30,"time":1794927582656,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:38329","remoteAddress":"127.0.0.1","remotePort":33486},"msg":"incoming request"}
{"level":30,"time":1794927582660,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":3.255260000000021,"msg":"request completed"}
{"level":30,"time":1794927582660,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36655","remoteAddress":"127.0.0.1","remotePort":33722},"msg":"incoming request"}
{"level":30,"time":1794927582663,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.712200999999993,"msg":"request completed"}
{"level":30,"time":1794927582664,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=fe13d2c6-8248-4b43-9aa1-4d0a4e530d88&page_size=50","host":"127.0.0.1:41061","remoteAddress":"127.0.0.1","remotePort":52880},"msg":"incoming request"}
{"level":30,"time":1794927582666,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5458610000000022,"msg":"request completed"}
{"level":30,"time":1794927582667,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:44241","remoteAddress":"127.0.0.1","remotePort":40322},"msg":"incoming request"}
{"level":30,"time":1794927582669,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.3359279999999671,"msg":"request completed"}
{"level":30,"time":1794927582670,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:33279","remoteAddress":"127.0.0.1","remotePort":52204},"msg":"incoming request"}
{"level":30,"time":1794927582672,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.6750849999999673,"msg":"request completed"}
{"level":30,"time":1794927582672,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:38373","remoteAddress":"127.0.0.1","remotePort":34530},"msg":"incoming request"}
{"level":30,"time":1794927582674,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":1.973905000000002,"msg":"request completed"}
{"level":30,"time":1794927582675,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:34633","remoteAddress":"127.0.0.1","remotePort":46778},"msg":"incoming request"}
{"level":30,"time":1794927582678,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.0384260000000154,"msg":"request completed"}
{"level":30,"time":1794927582678,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=fe13d2c6-8248-4b43-9aa1-4d0a4e530d88&action_type=record_view","host":"127.0.0.1:42201","remoteAddress":"127.0.0.1","remotePort":38580},"msg":"incoming request"}
{"level":30,"time":1794927582680,"pid":248024,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.6086300000000051,"msg":"request completed"}
{"level":30,"time":1794927582738,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37033","remoteAddress":"127.0.0.1","remotePort":44276},"msg":"incoming request"}
{"level":30,"time":1794927582752,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":14.56592999999998,"msg":"request completed"}
{"level":30,"time":1794927582760,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/29df5050-42f8-4d6b-b30d-de053a687fb3/timeline","host":"127.0.0.1:41639","remoteAddress":"127.0.0.1","remotePort":47624},"msg":"incoming request"}
{"level":30,"time":1794927582763,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.0477300000000014,"msg":"request completed"}
{"level":30,"time":1794927582767,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44487","remoteAddress":"127.0.0.1","remotePort":41966},"msg":"incoming request"}
{"level":30,"time":1794927582770,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.3958240000000046,"msg":"request completed"}
{"level":30,"time":1794927582772,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/8bcca56b-4bba-43e0-8dfc-4f968d3b43f6/closure","host":"127.0.0.1:34977","remoteAddress":"127.0.0.1","remotePort":58064},"msg":"incoming request"}
{"level":30,"time":1794927582777,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":4.451084999999978,"msg":"request completed"}
{"level":30,"time":1794927582778,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/8bcca56b-4bba-43e0-8dfc-4f968d3b43f6/timeline","host":"127.0.0.1:42971","remoteAddress":"127.0.0.1","remotePort":56114},"msg":"incoming request"}
{"level":30,"time":1794927582781,"pid":248054,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.926172000000008,"msg":"request completed"}
{"level":30,"time":1794927582840,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36019","remoteAddress":"127.0.0.1","remotePort":57400},"msg":"incoming request"}
{"level":30,"time":1794927582845,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":4.841306999999972,"msg":"request completed"}
{"level":30,"time":1794927582847,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43805","remoteAddress":"127.0.0.1","remotePort":50752},"msg":"incoming request"}
{"level":30,"time":1794927582848,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19132899999999609,"msg":"request completed"}
{"level":30,"time":1794927582849,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:42275","remoteAddress":"127.0.0.1","remotePort":52032},"msg":"incoming request"}
{"level":30,"time":1794927582852,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.593898999999965,"msg":"request completed"}
{"level":30,"time":1794927582853,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36517","remoteAddress":"127.0.0.1","remotePort":39618},"msg":"incoming request"}
{"level":30,"time":1794927582854,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.596507000000031,"msg":"request completed"}
{"level":30,"time":1794927582855,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37731","remoteAddress":"127.0.0.1","remotePort":38978},"msg":"incoming request"}
{"level":30,"time":1794927582857,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4381889999999657,"msg":"request completed"}
{"level":30,"time":1794927582858,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42175","remoteAddress":"127.0.0.1","remotePort":56850},"msg":"incoming request"}
{"level":30,"time":1794927582858,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.37748899999996866,"msg":"request completed"}
{"level":30,"time":1794927582859,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:43951","remoteAddress":"127.0.0.1","remotePort":40018},"msg":"incoming request"}
{"level":30,"time":1794927582861,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.2562980000000152,"msg":"request completed"}
{"level":30,"time":1794927582863,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:45541","remoteAddress":"127.0.0.1","remotePort":49150},"msg":"incoming request"}
{"level":30,"time":1794927582864,"pid":248084,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9087959999999953,"msg":"request completed"}

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/integration-gateway/eventbus.test.ts > event bus: publish -> durable delivery -> webhook subscriber > a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key
AssertionError: expected { …(2) } to match object { Object (user_id) }
(1 matching property omitted from actual)

- Expected
+ Received

  {
-   "user_id": "f39b0f8f-603a-481a-9fa8-4b41684e5ea6",
+   "user_id": "92b1d3f4-b53c-4440-a757-5a3f1476d9ac",
  }

 ❯ src/modules/integration-gateway/eventbus.test.ts:157:31
    155|     expect(typeof delivered.idempotency_key).toBe('string');
    156|     expect((delivered.idempotency_key as string).length).toBeGreaterTh…
    157|     expect(delivered.payload).toMatchObject({ user_id: testUserId });
       |                               ^
    158|   });
    159|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 10 passed (11)
      Tests  1 failed | 54 passed (55)
   Start at  14:59:41
   Duration  1.68s (transform 325ms, setup 50ms, import 1.95s, tests 2.06s, environment 1ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/daytona/project/backend
npm error workspace @epmp/backend@0.1.0
npm error location /home/daytona/project/backend
npm error command failed
npm error command sh -c vitest run
```

## Wave 6

- Build: `npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app` → pass
- Tests: `npm test && npm test -w frontend/design-system` → pass
- Fix attempts: 0/3 — pre_existing: eventbus.test.ts flaked again (same cross-test-file NATS durable-consumer race as wave 5), confirmed via immediate re-run: 11/11 files 55/55 tests pass with zero code changes. design-system 5/5 46/46; frontend/app build clean. 03-08's resumed session fixed a second real gap found during its own verification (PlanDetail.tsx had no Link-tasks entry point for Approved plans) and proved the full F3->F4 plan-to-task-materialization handoff via a new 7-step Playwright spec against the real compose stack

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794930289178,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46765","remoteAddress":"127.0.0.1","remotePort":44272},"msg":"incoming request"}
{"level":30,"time":1794930289183,"pid":373428,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:46759","remoteAddress":"127.0.0.1","remotePort":59482},"msg":"incoming request"}
{"level":30,"time":1794930289188,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:39487","remoteAddress":"127.0.0.1","remotePort":39706},"msg":"incoming request"}
{"level":30,"time":1794930289194,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.506308999999987,"msg":"request completed"}
{"level":30,"time":1794930289197,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/activation","host":"127.0.0.1:44533","remoteAddress":"127.0.0.1","remotePort":44058},"msg":"incoming request"}
{"level":30,"time":1794930289200,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":3.424558999999988,"msg":"request completed"}
{"level":30,"time":1794930289202,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4","host":"127.0.0.1:44655","remoteAddress":"127.0.0.1","remotePort":49654},"msg":"incoming request"}
{"level":30,"time":1794930289209,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":7.18861499999997,"msg":"request completed"}
{"level":30,"time":1794930289211,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/command-roles","host":"127.0.0.1:38733","remoteAddress":"127.0.0.1","remotePort":50054},"msg":"incoming request"}
{"level":30,"time":1794930289215,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":4.52177800000004,"msg":"request completed"}
{"level":30,"time":1794930289216,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/activation","host":"127.0.0.1:43987","remoteAddress":"127.0.0.1","remotePort":48082},"msg":"incoming request"}
{"level":30,"time":1794930289220,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":4.032569000000024,"msg":"request completed"}
{"level":30,"time":1794930289221,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/timeline","host":"127.0.0.1:37745","remoteAddress":"127.0.0.1","remotePort":49046},"msg":"incoming request"}
{"level":30,"time":1794930289224,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4343600000000265,"msg":"request completed"}
{"level":30,"time":1794930289226,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/activation","host":"127.0.0.1:36797","remoteAddress":"127.0.0.1","remotePort":50960},"msg":"incoming request"}
{"level":30,"time":1794930289227,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.435104000000024,"msg":"request completed"}
{"level":30,"time":1794930289228,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4","host":"127.0.0.1:46367","remoteAddress":"127.0.0.1","remotePort":58694},"msg":"incoming request"}
{"level":30,"time":1794930289242,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":14.071515000000034,"msg":"request completed"}
{"level":30,"time":1794930289243,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/command-roles","host":"127.0.0.1:45717","remoteAddress":"127.0.0.1","remotePort":51074},"msg":"incoming request"}
{"level":30,"time":1794930289246,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.6224920000000225,"msg":"request completed"}
{"level":30,"time":1794930289247,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/timeline","host":"127.0.0.1:36651","remoteAddress":"127.0.0.1","remotePort":40582},"msg":"incoming request"}
{"level":30,"time":1794930289249,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":2.048014999999964,"msg":"request completed"}
{"level":30,"time":1794930289250,"pid":373428,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":67.32102500000002,"msg":"request completed"}
{"level":30,"time":1794930289250,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/closure","host":"127.0.0.1:44707","remoteAddress":"127.0.0.1","remotePort":55796},"msg":"incoming request"}
{"level":30,"time":1794930289254,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":3.8073969999999804,"msg":"request completed"}
{"level":30,"time":1794930289255,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/9ecfa411-1f89-477a-83f7-05640111a0a4/timeline","host":"127.0.0.1:37747","remoteAddress":"127.0.0.1","remotePort":33852},"msg":"incoming request"}
{"level":30,"time":1794930289257,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":1.8330609999999865,"msg":"request completed"}
{"level":30,"time":1794930289258,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35359","remoteAddress":"127.0.0.1","remotePort":34528},"msg":"incoming request"}
{"level":30,"time":1794930289261,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":3.132439999999974,"msg":"request completed"}
{"level":30,"time":1794930289262,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/03650146-0776-4ab6-8947-3481e14491af/command-roles","host":"127.0.0.1:43007","remoteAddress":"127.0.0.1","remotePort":34952},"msg":"incoming request"}
{"level":30,"time":1794930289262,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":73.51176600000002,"msg":"request completed"}
{"level":30,"time":1794930289264,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.0284079999999562,"msg":"request completed"}
{"level":30,"time":1794930289265,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/03650146-0776-4ab6-8947-3481e14491af/command-roles","host":"127.0.0.1:44381","remoteAddress":"127.0.0.1","remotePort":51520},"msg":"incoming request"}
{"level":30,"time":1794930289266,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45879","remoteAddress":"127.0.0.1","remotePort":59544},"msg":"incoming request"}
{"level":30,"time":1794930289268,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.857684000000006,"msg":"request completed"}
{"level":30,"time":1794930289269,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/03650146-0776-4ab6-8947-3481e14491af/timeline","host":"127.0.0.1:45451","remoteAddress":"127.0.0.1","remotePort":52446},"msg":"incoming request"}
{"level":30,"time":1794930289271,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":1.8081439999999702,"msg":"request completed"}
{"level":30,"time":1794930289272,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39045","remoteAddress":"127.0.0.1","remotePort":52010},"msg":"incoming request"}
{"level":30,"time":1794930289275,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.7509750000000395,"msg":"request completed"}
{"level":30,"time":1794930289276,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/aa7fd81f-4dfb-4688-b411-9d79f0dffa7e/activation","host":"127.0.0.1:37717","remoteAddress":"127.0.0.1","remotePort":52524},"msg":"incoming request"}
{"level":30,"time":1794930289277,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":10.950065999999993,"msg":"request completed"}
{"level":30,"time":1794930289278,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6957830000000058,"msg":"request completed"}
{"level":30,"time":1794930289278,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/aa7fd81f-4dfb-4688-b411-9d79f0dffa7e/command-roles","host":"127.0.0.1:36749","remoteAddress":"127.0.0.1","remotePort":32980},"msg":"incoming request"}
{"level":30,"time":1794930289279,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40493","remoteAddress":"127.0.0.1","remotePort":36340},"msg":"incoming request"}
{"level":30,"time":1794930289280,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.3819149999999922,"msg":"request completed"}
{"level":30,"time":1794930289281,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/aa7fd81f-4dfb-4688-b411-9d79f0dffa7e/closure","host":"127.0.0.1:35575","remoteAddress":"127.0.0.1","remotePort":49218},"msg":"incoming request"}
{"level":30,"time":1794930289282,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.2223349999999868,"msg":"request completed"}
{"level":30,"time":1794930289282,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/aa7fd81f-4dfb-4688-b411-9d79f0dffa7e/activation","host":"127.0.0.1:34379","remoteAddress":"127.0.0.1","remotePort":37554},"msg":"incoming request"}
{"level":30,"time":1794930289284,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":5.57405399999999,"msg":"request completed"}
{"level":30,"time":1794930289285,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.108908999999983,"msg":"request completed"}
{"level":30,"time":1794930289286,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43869","remoteAddress":"127.0.0.1","remotePort":48610},"msg":"incoming request"}
{"level":30,"time":1794930289287,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/43550ca7-94cf-47a2-9f53-88f4a3b65804/decline","host":"127.0.0.1:35141","remoteAddress":"127.0.0.1","remotePort":41828},"msg":"incoming request"}
{"level":30,"time":1794930289288,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":2.6131050000000187,"msg":"request completed"}
{"level":30,"time":1794930289289,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.8321189999999774,"msg":"request completed"}
{"level":30,"time":1794930289289,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/62a02682-b9e6-4f76-8c55-2639387f2f07/closure","host":"127.0.0.1:43645","remoteAddress":"127.0.0.1","remotePort":42346},"msg":"incoming request"}
{"level":30,"time":1794930289291,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=005322ba-e006-4384-a15e-bbfda3ad6f78","host":"127.0.0.1:44647","remoteAddress":"127.0.0.1","remotePort":38044},"msg":"incoming request"}
{"level":30,"time":1794930289293,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":3.3603579999999624,"msg":"request completed"}
{"level":30,"time":1794930289293,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/62a02682-b9e6-4f76-8c55-2639387f2f07/closure","host":"127.0.0.1:45091","remoteAddress":"127.0.0.1","remotePort":43056},"msg":"incoming request"}
{"level":30,"time":1794930289294,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.634141999999997,"msg":"request completed"}
{"level":30,"time":1794930289295,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/43550ca7-94cf-47a2-9f53-88f4a3b65804/decline","host":"127.0.0.1:39023","remoteAddress":"127.0.0.1","remotePort":44622},"msg":"incoming request"}
{"level":30,"time":1794930289296,"pid":373429,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.657619000000011,"msg":"request completed"}
{"level":30,"time":1794930289301,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":5.227131999999983,"msg":"request completed"}
{"level":30,"time":1794930289302,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/005322ba-e006-4384-a15e-bbfda3ad6f78/timeline","host":"127.0.0.1:38335","remoteAddress":"127.0.0.1","remotePort":41192},"msg":"incoming request"}
{"level":30,"time":1794930289310,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":8.329666000000032,"msg":"request completed"}
{"level":30,"time":1794930289312,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36079","remoteAddress":"127.0.0.1","remotePort":40408},"msg":"incoming request"}
{"level":30,"time":1794930289316,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":3.9733289999999784,"msg":"request completed"}
{"level":30,"time":1794930289318,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38743","remoteAddress":"127.0.0.1","remotePort":52432},"msg":"incoming request"}
{"level":30,"time":1794930289321,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.4384350000000268,"msg":"request completed"}
{"level":30,"time":1794930289323,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/d790d3da-633f-4831-8d1d-6d901fca63ad/approve","host":"127.0.0.1:40433","remoteAddress":"127.0.0.1","remotePort":50018},"msg":"incoming request"}
{"level":30,"time":1794930289326,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":3.2280000000000655,"msg":"request completed"}
{"level":30,"time":1794930289327,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/d790d3da-633f-4831-8d1d-6d901fca63ad/fulfill","host":"127.0.0.1:43195","remoteAddress":"127.0.0.1","remotePort":33898},"msg":"incoming request"}
{"level":30,"time":1794930289329,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.3730840000000626,"msg":"request completed"}
{"level":30,"time":1794930289331,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/d790d3da-633f-4831-8d1d-6d901fca63ad/fulfill","host":"127.0.0.1:40087","remoteAddress":"127.0.0.1","remotePort":36074},"msg":"incoming request"}
{"level":30,"time":1794930289334,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.823237000000063,"msg":"request completed"}
{"level":30,"time":1794930289336,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/38fb40e3-fe69-4a3f-ac5f-52b1c943aa41/timeline","host":"127.0.0.1:42807","remoteAddress":"127.0.0.1","remotePort":53924},"msg":"incoming request"}
{"level":30,"time":1794930289338,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.382522999999992,"msg":"request completed"}
{"level":30,"time":1794930289460,"pid":373428,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:34393","remoteAddress":"127.0.0.1","remotePort":50450},"msg":"incoming request"}
{"level":30,"time":1794930289463,"pid":373428,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.2736449999999877,"msg":"request completed"}
 ❯ src/modules/integration-gateway/eventbus.test.ts (4 tests | 1 failed) 346ms
     × a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key 205ms
{"level":30,"time":1794930289540,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34653","remoteAddress":"127.0.0.1","remotePort":34682},"msg":"incoming request"}
{"level":30,"time":1794930289544,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":4.788558999999964,"msg":"request completed"}
{"level":30,"time":1794930289546,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39521","remoteAddress":"127.0.0.1","remotePort":49084},"msg":"incoming request"}
{"level":30,"time":1794930289547,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.2104530000000295,"msg":"request completed"}
{"level":30,"time":1794930289549,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46031","remoteAddress":"127.0.0.1","remotePort":53590},"msg":"incoming request"}
{"level":30,"time":1794930289552,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":3.729710999999952,"msg":"request completed"}
{"level":30,"time":1794930289554,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35361","remoteAddress":"127.0.0.1","remotePort":43430},"msg":"incoming request"}
{"level":30,"time":1794930289556,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.463273000000072,"msg":"request completed"}
{"level":30,"time":1794930289557,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/26edbcaa-2827-42e0-a0b0-a44990f5b78e/fulfill","host":"127.0.0.1:45301","remoteAddress":"127.0.0.1","remotePort":38472},"msg":"incoming request"}
{"level":30,"time":1794930289559,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":1.594673000000057,"msg":"request completed"}
{"level":30,"time":1794930289560,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/26edbcaa-2827-42e0-a0b0-a44990f5b78e/approve","host":"127.0.0.1:40709","remoteAddress":"127.0.0.1","remotePort":58798},"msg":"incoming request"}
{"level":30,"time":1794930289562,"pid":373427,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.4654509999999163,"msg":"request completed"}
{"level":30,"time":1794930289563,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35801","remoteAddress":"127.0.0.1","remotePort":52814},"msg":"incoming request"}
{"level":30,"time":1794930289587,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":24.384513999999967,"msg":"request completed"}
{"level":30,"time":1794930289590,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/5aaa74b1-6c91-4f69-86f6-5fdba4bf559a/timeline","host":"127.0.0.1:37975","remoteAddress":"127.0.0.1","remotePort":56908},"msg":"incoming request"}
{"level":30,"time":1794930289594,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.9907420000000116,"msg":"request completed"}
{"level":30,"time":1794930289597,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36751","remoteAddress":"127.0.0.1","remotePort":47812},"msg":"incoming request"}
{"level":30,"time":1794930289602,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":5.070538999999997,"msg":"request completed"}
{"level":30,"time":1794930289603,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41751","remoteAddress":"127.0.0.1","remotePort":39192},"msg":"incoming request"}
{"level":30,"time":1794930289606,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":2.3130820000000085,"msg":"request completed"}
{"level":30,"time":1794930289607,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40497","remoteAddress":"127.0.0.1","remotePort":54826},"msg":"incoming request"}
{"level":30,"time":1794930289611,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":4.335407999999973,"msg":"request completed"}
{"level":30,"time":1794930289614,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37337","remoteAddress":"127.0.0.1","remotePort":43078},"msg":"incoming request"}
{"level":30,"time":1794930289641,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":26.95053200000001,"msg":"request completed"}
{"level":30,"time":1794930289642,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36637","remoteAddress":"127.0.0.1","remotePort":41066},"msg":"incoming request"}
{"level":30,"time":1794930289646,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":4.068967999999984,"msg":"request completed"}
{"level":30,"time":1794930289647,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36297","remoteAddress":"127.0.0.1","remotePort":59132},"msg":"incoming request"}
{"level":30,"time":1794930289651,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":4.049982,"msg":"request completed"}
{"level":30,"time":1794930289653,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:35751","remoteAddress":"127.0.0.1","remotePort":33352},"msg":"incoming request"}
{"level":30,"time":1794930289655,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.654071999999985,"msg":"request completed"}
{"level":30,"time":1794930289658,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40581","remoteAddress":"127.0.0.1","remotePort":50284},"msg":"incoming request"}
{"level":30,"time":1794930289661,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.455126000000007,"msg":"request completed"}
{"level":30,"time":1794930289662,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/d8543abb-d4c3-41ad-bb70-e8a77981a414","host":"127.0.0.1:36649","remoteAddress":"127.0.0.1","remotePort":54896},"msg":"incoming request"}
{"level":30,"time":1794930289664,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":1.708387000000016,"msg":"request completed"}
{"level":30,"time":1794930289665,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:46609","remoteAddress":"127.0.0.1","remotePort":44388},"msg":"incoming request"}
{"level":30,"time":1794930289667,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.5301789999999755,"msg":"request completed"}
{"level":30,"time":1794930289668,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/d8543abb-d4c3-41ad-bb70-e8a77981a414","host":"127.0.0.1:33401","remoteAddress":"127.0.0.1","remotePort":51870},"msg":"incoming request"}
{"level":30,"time":1794930289670,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":1.65364500000004,"msg":"request completed"}
{"level":30,"time":1794930289671,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/d8543abb-d4c3-41ad-bb70-e8a77981a414/timeline","host":"127.0.0.1:35459","remoteAddress":"127.0.0.1","remotePort":51740},"msg":"incoming request"}
{"level":30,"time":1794930289672,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":1.3189160000000015,"msg":"request completed"}
{"level":30,"time":1794930289673,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42831","remoteAddress":"127.0.0.1","remotePort":49330},"msg":"incoming request"}
{"level":30,"time":1794930289676,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.7265179999999987,"msg":"request completed"}
{"level":30,"time":1794930289686,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43985","remoteAddress":"127.0.0.1","remotePort":50524},"msg":"incoming request"}
{"level":30,"time":1794930289696,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":10.02145200000001,"msg":"request completed"}
{"level":30,"time":1794930289697,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46605","remoteAddress":"127.0.0.1","remotePort":59846},"msg":"incoming request"}
{"level":30,"time":1794930289701,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.8218439999999987,"msg":"request completed"}
{"level":30,"time":1794930289702,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42597","remoteAddress":"127.0.0.1","remotePort":59704},"msg":"incoming request"}
{"level":30,"time":1794930289706,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":201},"responseTime":3.4579410000000053,"msg":"request completed"}
{"level":30,"time":1794930289707,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:41705","remoteAddress":"127.0.0.1","remotePort":54514},"msg":"incoming request"}
{"level":40,"time":1794930289710,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:266:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794930289711,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":201},"responseTime":4.62077400000004,"msg":"request completed"}
{"level":30,"time":1794930289712,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/3eae9411-6f0e-462b-a37b-cea288d52d14/approve","host":"127.0.0.1:37155","remoteAddress":"127.0.0.1","remotePort":58286},"msg":"incoming request"}
{"level":40,"time":1794930289715,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:321:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794930289715,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":200},"responseTime":2.8050960000000487,"msg":"request completed"}
{"level":30,"time":1794930289717,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:42241","remoteAddress":"127.0.0.1","remotePort":52866},"msg":"incoming request"}
{"level":30,"time":1794930289719,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":1.939380999999969,"msg":"request completed"}
{"level":30,"time":1794930289719,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43327","remoteAddress":"127.0.0.1","remotePort":49440},"msg":"incoming request"}
{"level":30,"time":1794930289721,"pid":373467,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":403},"responseTime":1.0093250000000467,"msg":"request completed"}
{"level":30,"time":1794930289781,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:43747","remoteAddress":"127.0.0.1","remotePort":57164},"msg":"incoming request"}
{"level":30,"time":1794930289795,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":13.101674000000003,"msg":"request completed"}
{"level":30,"time":1794930289797,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea/submit-review","host":"127.0.0.1:37499","remoteAddress":"127.0.0.1","remotePort":55908},"msg":"incoming request"}
{"level":30,"time":1794930289803,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":5.576929000000007,"msg":"request completed"}
{"level":30,"time":1794930289805,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea/review","host":"127.0.0.1:36483","remoteAddress":"127.0.0.1","remotePort":50634},"msg":"incoming request"}
{"level":30,"time":1794930289809,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":403},"responseTime":3.1542309999999816,"msg":"request completed"}
{"level":30,"time":1794930289810,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea","host":"127.0.0.1:44455","remoteAddress":"127.0.0.1","remotePort":41588},"msg":"incoming request"}
{"level":30,"time":1794930289813,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.981667000000016,"msg":"request completed"}
{"level":30,"time":1794930289815,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea/review","host":"127.0.0.1:46149","remoteAddress":"127.0.0.1","remotePort":48698},"msg":"incoming request"}
{"level":30,"time":1794930289820,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":5.031184999999994,"msg":"request completed"}
{"level":30,"time":1794930289821,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea","host":"127.0.0.1:44503","remoteAddress":"127.0.0.1","remotePort":57530},"msg":"incoming request"}
{"level":30,"time":1794930289825,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":4.1118490000000065,"msg":"request completed"}
{"level":30,"time":1794930289826,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea/sections/32285f12-ce2c-411e-af85-74df1b6c2b53/link-tasks","host":"127.0.0.1:40717","remoteAddress":"127.0.0.1","remotePort":47850},"msg":"incoming request"}
{"level":30,"time":1794930289829,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":204},"responseTime":2.223282999999981,"msg":"request completed"}
{"level":30,"time":1794930289829,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea","host":"127.0.0.1:33301","remoteAddress":"127.0.0.1","remotePort":54688},"msg":"incoming request"}
{"level":30,"time":1794930289831,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":1.995004999999992,"msg":"request completed"}
{"level":30,"time":1794930289833,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46317","remoteAddress":"127.0.0.1","remotePort":46012},"msg":"incoming request"}
{"level":30,"time":1794930289850,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":17.741374000000008,"msg":"request completed"}
{"level":30,"time":1794930289852,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/55ff70a3-dd46-4f59-88c2-a244fda51cea/materialize-tasks","host":"127.0.0.1:36695","remoteAddress":"127.0.0.1","remotePort":57830},"msg":"incoming request"}
{"level":30,"time":1794930289856,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.421049000000039,"msg":"request completed"}
{"level":30,"time":1794930289858,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=281b1ec5-2e9c-4620-9236-dbd94e1f4342","host":"127.0.0.1:45249","remoteAddress":"127.0.0.1","remotePort":47626},"msg":"incoming request"}
{"level":30,"time":1794930289860,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.1752329999999915,"msg":"request completed"}
{"level":30,"time":1794930289861,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40515","remoteAddress":"127.0.0.1","remotePort":38526},"msg":"incoming request"}
{"level":30,"time":1794930289864,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":201},"responseTime":2.49614600000001,"msg":"request completed"}
{"level":30,"time":1794930289864,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/5a2ca1d2-d749-44fd-a877-41c2c64dd9a7/review","host":"127.0.0.1:43703","remoteAddress":"127.0.0.1","remotePort":36924},"msg":"incoming request"}
{"level":30,"time":1794930289874,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":409},"responseTime":9.269490000000019,"msg":"request completed"}
{"level":30,"time":1794930289875,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:38219","remoteAddress":"127.0.0.1","remotePort":35494},"msg":"incoming request"}
{"level":30,"time":1794930289877,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.0535449999999855,"msg":"request completed"}
{"level":30,"time":1794930289877,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/6ac5320a-7bbc-4085-8004-0bb0138513c2/submit-review","host":"127.0.0.1:43591","remoteAddress":"127.0.0.1","remotePort":56524},"msg":"incoming request"}
{"level":30,"time":1794930289879,"pid":373478,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.4318679999999517,"msg":"request completed"}
{"level":30,"time":1794930289897,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37439","remoteAddress":"127.0.0.1","remotePort":44060},"msg":"incoming request"}
{"level":30,"time":1794930289926,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":28.771259000000043,"msg":"request completed"}
{"level":30,"time":1794930289929,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:40101","remoteAddress":"127.0.0.1","remotePort":56752},"msg":"incoming request"}
{"level":30,"time":1794930289932,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":2.9838419999999815,"msg":"request completed"}
{"level":30,"time":1794930289933,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43437","remoteAddress":"127.0.0.1","remotePort":34118},"msg":"incoming request"}
{"level":30,"time":1794930289935,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.6232669999999985,"msg":"request completed"}
{"level":30,"time":1794930289936,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:34387","remoteAddress":"127.0.0.1","remotePort":59086},"msg":"incoming request"}
{"level":30,"time":1794930289939,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.4775080000000003,"msg":"request completed"}
{"level":30,"time":1794930289941,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/0e03a153-3e1a-400d-8e43-ae4a69b43644/revoke","host":"127.0.0.1:42415","remoteAddress":"127.0.0.1","remotePort":43280},"msg":"incoming request"}
{"level":30,"time":1794930289944,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":2.974774000000025,"msg":"request completed"}
{"level":30,"time":1794930289946,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44537","remoteAddress":"127.0.0.1","remotePort":60748},"msg":"incoming request"}
{"level":30,"time":1794930289949,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3995749999999703,"msg":"request completed"}
{"level":30,"time":1794930289949,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35805","remoteAddress":"127.0.0.1","remotePort":38838},"msg":"incoming request"}
{"level":30,"time":1794930289952,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":2.648801999999989,"msg":"request completed"}
{"level":30,"time":1794930289953,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41647","remoteAddress":"127.0.0.1","remotePort":44236},"msg":"incoming request"}
{"level":30,"time":1794930289955,"pid":373490,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.023988999999972,"msg":"request completed"}
{"level":30,"time":1794930290002,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39489","remoteAddress":"127.0.0.1","remotePort":54684},"msg":"incoming request"}
{"level":30,"time":1794930290008,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":5.563574000000017,"msg":"request completed"}
{"level":30,"time":1794930290011,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36459","remoteAddress":"127.0.0.1","remotePort":49928},"msg":"incoming request"}
{"level":30,"time":1794930290013,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.078510999999992,"msg":"request completed"}
{"level":30,"time":1794930290015,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45999","remoteAddress":"127.0.0.1","remotePort":55598},"msg":"incoming request"}
{"level":30,"time":1794930290019,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.407774000000018,"msg":"request completed"}
{"level":30,"time":1794930290020,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36541","remoteAddress":"127.0.0.1","remotePort":42888},"msg":"incoming request"}
{"level":30,"time":1794930290040,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":20.070366999999976,"msg":"request completed"}
{"level":30,"time":1794930290042,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44263","remoteAddress":"127.0.0.1","remotePort":39490},"msg":"incoming request"}
{"level":30,"time":1794930290045,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.204935999999975,"msg":"request completed"}
{"level":30,"time":1794930290046,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/c426557b-2500-4705-b823-103005fe68bb/timeline","host":"127.0.0.1:34345","remoteAddress":"127.0.0.1","remotePort":35860},"msg":"incoming request"}
{"level":30,"time":1794930290048,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.6111120000000483,"msg":"request completed"}
{"level":30,"time":1794930290050,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45657","remoteAddress":"127.0.0.1","remotePort":57636},"msg":"incoming request"}
{"level":30,"time":1794930290054,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":3.665992000000017,"msg":"request completed"}
{"level":30,"time":1794930290054,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/530de935-c4ac-4eef-9fd0-d62e141a416a/status","host":"127.0.0.1:40597","remoteAddress":"127.0.0.1","remotePort":57152},"msg":"incoming request"}
{"level":30,"time":1794930290057,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":2.3434090000000083,"msg":"request completed"}
{"level":30,"time":1794930290058,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40917","remoteAddress":"127.0.0.1","remotePort":45626},"msg":"incoming request"}
{"level":30,"time":1794930290061,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.65184899999997,"msg":"request completed"}
{"level":30,"time":1794930290062,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/8a76b24e-66f7-4462-86d5-5f9a0e75ff7c/status","host":"127.0.0.1:38043","remoteAddress":"127.0.0.1","remotePort":34382},"msg":"incoming request"}
{"level":30,"time":1794930290064,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.6515909999999963,"msg":"request completed"}
{"level":30,"time":1794930290073,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/8a76b24e-66f7-4462-86d5-5f9a0e75ff7c/status","host":"127.0.0.1:34049","remoteAddress":"127.0.0.1","remotePort":52568},"msg":"incoming request"}
{"level":30,"time":1794930290076,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.7175909999999703,"msg":"request completed"}
{"level":30,"time":1794930290076,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/8a76b24e-66f7-4462-86d5-5f9a0e75ff7c/status","host":"127.0.0.1:34931","remoteAddress":"127.0.0.1","remotePort":36674},"msg":"incoming request"}
{"level":30,"time":1794930290078,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.5447100000000091,"msg":"request completed"}
{"level":30,"time":1794930290079,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/8a76b24e-66f7-4462-86d5-5f9a0e75ff7c/status","host":"127.0.0.1:43055","remoteAddress":"127.0.0.1","remotePort":35044},"msg":"incoming request"}
{"level":30,"time":1794930290081,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.34982100000002,"msg":"request completed"}
{"level":30,"time":1794930290082,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/8a76b24e-66f7-4462-86d5-5f9a0e75ff7c/status","host":"127.0.0.1:36205","remoteAddress":"127.0.0.1","remotePort":42926},"msg":"incoming request"}
{"level":30,"time":1794930290085,"pid":373502,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.5624500000000126,"msg":"request completed"}
{"level":30,"time":1794930290180,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:41583","remoteAddress":"127.0.0.1","remotePort":37834},"msg":"incoming request"}
{"level":30,"time":1794930290188,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":7.013375999999994,"msg":"request completed"}
{"level":30,"time":1794930290191,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:38673","remoteAddress":"127.0.0.1","remotePort":48906},"msg":"incoming request"}
{"level":30,"time":1794930290200,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":9.285199999999975,"msg":"request completed"}
{"level":30,"time":1794930290204,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35753","remoteAddress":"127.0.0.1","remotePort":54320},"msg":"incoming request"}
{"level":30,"time":1794930290207,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9556180000000154,"msg":"request completed"}
{"level":30,"time":1794930290208,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/efe9499c-8ab0-49b0-870b-421fea866f75","host":"127.0.0.1:33037","remoteAddress":"127.0.0.1","remotePort":35352},"msg":"incoming request"}
{"level":30,"time":1794930290212,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.267003000000045,"msg":"request completed"}
{"level":30,"time":1794930290213,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46791","remoteAddress":"127.0.0.1","remotePort":46542},"msg":"incoming request"}
{"level":30,"time":1794930290213,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.6522850000000062,"msg":"request completed"}
{"level":30,"time":1794930290215,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:43513","remoteAddress":"127.0.0.1","remotePort":56102},"msg":"incoming request"}
{"level":30,"time":1794930290217,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.6967950000000087,"msg":"request completed"}
{"level":30,"time":1794930290219,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:39917","remoteAddress":"127.0.0.1","remotePort":35296},"msg":"incoming request"}
{"level":30,"time":1794930290242,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":23.378665999999953,"msg":"request completed"}
{"level":30,"time":1794930290243,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:43675","remoteAddress":"127.0.0.1","remotePort":39960},"msg":"incoming request"}
{"level":30,"time":1794930290246,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.869817000000012,"msg":"request completed"}
{"level":30,"time":1794930290247,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=1c539e58-716a-48c1-9788-0ee94cb159a5&page_size=50","host":"127.0.0.1:39737","remoteAddress":"127.0.0.1","remotePort":57874},"msg":"incoming request"}
{"level":30,"time":1794930290249,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":2.0431159999999977,"msg":"request completed"}
{"level":30,"time":1794930290251,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37405","remoteAddress":"127.0.0.1","remotePort":52660},"msg":"incoming request"}
{"level":30,"time":1794930290254,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":2.0805859999999825,"msg":"request completed"}
{"level":30,"time":1794930290255,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:33337","remoteAddress":"127.0.0.1","remotePort":35584},"msg":"incoming request"}
{"level":30,"time":1794930290257,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.071337999999969,"msg":"request completed"}
{"level":30,"time":1794930290258,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:44939","remoteAddress":"127.0.0.1","remotePort":58100},"msg":"incoming request"}
{"level":30,"time":1794930290260,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":2.08738900000003,"msg":"request completed"}
{"level":30,"time":1794930290261,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42765","remoteAddress":"127.0.0.1","remotePort":41528},"msg":"incoming request"}
{"level":30,"time":1794930290263,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":1.6572209999999927,"msg":"request completed"}
{"level":30,"time":1794930290264,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=1c539e58-716a-48c1-9788-0ee94cb159a5&action_type=record_view","host":"127.0.0.1:37603","remoteAddress":"127.0.0.1","remotePort":49658},"msg":"incoming request"}
{"level":30,"time":1794930290265,"pid":373516,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.4549220000000105,"msg":"request completed"}
{"level":30,"time":1794930290281,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40821","remoteAddress":"127.0.0.1","remotePort":53496},"msg":"incoming request"}
{"level":30,"time":1794930290297,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.730599999999981,"msg":"request completed"}
{"level":30,"time":1794930290301,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45535","remoteAddress":"127.0.0.1","remotePort":34586},"msg":"incoming request"}
{"level":30,"time":1794930290306,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":4.36160799999999,"msg":"request completed"}
{"level":30,"time":1794930290307,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:42651","remoteAddress":"127.0.0.1","remotePort":49492},"msg":"incoming request"}
{"level":30,"time":1794930290310,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9455990000000156,"msg":"request completed"}
{"level":30,"time":1794930290312,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43653","remoteAddress":"127.0.0.1","remotePort":42904},"msg":"incoming request"}
{"level":30,"time":1794930290315,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.167707000000007,"msg":"request completed"}
{"level":30,"time":1794930290317,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:40317","remoteAddress":"127.0.0.1","remotePort":51996},"msg":"incoming request"}
{"level":30,"time":1794930290319,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.8845680000000016,"msg":"request completed"}
{"level":30,"time":1794930290321,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:43827","remoteAddress":"127.0.0.1","remotePort":56506},"msg":"incoming request"}
{"level":30,"time":1794930290322,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":1.6453580000000443,"msg":"request completed"}
{"level":30,"time":1794930290323,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:33725","remoteAddress":"127.0.0.1","remotePort":46998},"msg":"incoming request"}
{"level":30,"time":1794930290325,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.8490209999999934,"msg":"request completed"}
{"level":30,"time":1794930290326,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:34251","remoteAddress":"127.0.0.1","remotePort":37132},"msg":"incoming request"}
{"level":30,"time":1794930290328,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.02128399999998,"msg":"request completed"}
{"level":30,"time":1794930290329,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45631","remoteAddress":"127.0.0.1","remotePort":47046},"msg":"incoming request"}
{"level":30,"time":1794930290331,"pid":373527,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7340040000000272,"msg":"request completed"}
{"level":30,"time":1794930290404,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40271","remoteAddress":"127.0.0.1","remotePort":34014},"msg":"incoming request"}
{"level":30,"time":1794930290420,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.846036999999967,"msg":"request completed"}
{"level":30,"time":1794930290428,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/fab26063-4ff9-4e33-842f-c9a84fa3f230/timeline","host":"127.0.0.1:46185","remoteAddress":"127.0.0.1","remotePort":56170},"msg":"incoming request"}
{"level":30,"time":1794930290431,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1427489999999807,"msg":"request completed"}
{"level":30,"time":1794930290436,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41129","remoteAddress":"127.0.0.1","remotePort":55116},"msg":"incoming request"}
{"level":30,"time":1794930290439,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.2549700000000144,"msg":"request completed"}
{"level":30,"time":1794930290441,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/120fca7c-ff15-44b1-9b1e-e435cfb16389/closure","host":"127.0.0.1:44529","remoteAddress":"127.0.0.1","remotePort":51470},"msg":"incoming request"}
{"level":30,"time":1794930290444,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.6190839999999866,"msg":"request completed"}
{"level":30,"time":1794930290446,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/120fca7c-ff15-44b1-9b1e-e435cfb16389/timeline","host":"127.0.0.1:42165","remoteAddress":"127.0.0.1","remotePort":60624},"msg":"incoming request"}
{"level":30,"time":1794930290447,"pid":373542,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6854339999999866,"msg":"request completed"}
{"level":30,"time":1794930290528,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43793","remoteAddress":"127.0.0.1","remotePort":47686},"msg":"incoming request"}
{"level":30,"time":1794930290534,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.0724320000000205,"msg":"request completed"}
{"level":30,"time":1794930290536,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36557","remoteAddress":"127.0.0.1","remotePort":60986},"msg":"incoming request"}
{"level":30,"time":1794930290536,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.1818609999999694,"msg":"request completed"}
{"level":30,"time":1794930290538,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:35385","remoteAddress":"127.0.0.1","remotePort":54372},"msg":"incoming request"}
{"level":30,"time":1794930290541,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9122259999999756,"msg":"request completed"}
{"level":30,"time":1794930290542,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45465","remoteAddress":"127.0.0.1","remotePort":46044},"msg":"incoming request"}
{"level":30,"time":1794930290544,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.0937999999999874,"msg":"request completed"}
{"level":30,"time":1794930290545,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40125","remoteAddress":"127.0.0.1","remotePort":54674},"msg":"incoming request"}
{"level":30,"time":1794930290547,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.599852999999996,"msg":"request completed"}
{"level":30,"time":1794930290548,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38289","remoteAddress":"127.0.0.1","remotePort":58194},"msg":"incoming request"}
{"level":30,"time":1794930290548,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.42927600000001576,"msg":"request completed"}
{"level":30,"time":1794930290549,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:33549","remoteAddress":"127.0.0.1","remotePort":42804},"msg":"incoming request"}
{"level":30,"time":1794930290551,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3881359999999745,"msg":"request completed"}
{"level":30,"time":1794930290552,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42843","remoteAddress":"127.0.0.1","remotePort":42310},"msg":"incoming request"}
{"level":30,"time":1794930290554,"pid":373610,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":1.8362670000000207,"msg":"request completed"}

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/integration-gateway/eventbus.test.ts > event bus: publish -> durable delivery -> webhook subscriber > a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key
AssertionError: expected { …(3) } to match object { Object (user_id) }
(2 matching properties omitted from actual)

- Expected
+ Received

  {
-   "user_id": "e6b2dd01-1d07-498c-8638-7f4000221589",
+   "user_id": "db4dc89a-cb7b-46a8-b702-65c62ed31ddf",
  }

 ❯ src/modules/integration-gateway/eventbus.test.ts:157:31
    155|     expect(typeof delivered.idempotency_key).toBe('string');
    156|     expect((delivered.idempotency_key as string).length).toBeGreaterTh…
    157|     expect(delivered.payload).toMatchObject({ user_id: testUserId });
       |                               ^
    158|   });
    159|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed | 10 passed (11)
      Tests  1 failed | 54 passed (55)
   Start at  15:44:48
   Duration  1.75s (transform 340ms, setup 46ms, import 2.03s, tests 2.14s, environment 1ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/daytona/project/backend
npm error workspace @epmp/backend@0.1.0
npm error location /home/daytona/project/backend
npm error command failed
npm error command sh -c vitest run
```

## Wave 7

- Build: `npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app` → pass
- Tests: `npm test && npm test -w frontend/design-system` → pass
- Fix attempts: 0/3 — pre_existing: eventbus.test.ts (phase-1, untouched by this phase) + resource-requests.test.ts both failed once with NATS/JetStream contention under full-suite parallel load (same class as waves 5-6's flake, now also hitting a second file under shared broker pressure); confirmed transient via two consecutive clean re-runs (11/11 files, 55/55 tests, zero code changes between runs). design-system 5/5 46/46; frontend/app build clean. Phase 3 all 9 plans now complete; success criterion 4's map-visibility clause closed by this wave's resource-request triangle markers

### Gate output

```
> epmp@0.1.0 build
> npm run build -w backend


> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794932137846,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43669","remoteAddress":"127.0.0.1","remotePort":44440},"msg":"incoming request"}
{"level":30,"time":1794932137853,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:33159","remoteAddress":"127.0.0.1","remotePort":45520},"msg":"incoming request"}
{"level":30,"time":1794932137855,"pid":456153,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:37101","remoteAddress":"127.0.0.1","remotePort":44424},"msg":"incoming request"}
{"level":30,"time":1794932137864,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":17.656968000000006,"msg":"request completed"}
{"level":30,"time":1794932137868,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/15f3da79-2fa5-4c7f-862b-8ba3319ca255/timeline","host":"127.0.0.1:37003","remoteAddress":"127.0.0.1","remotePort":40956},"msg":"incoming request"}
{"level":30,"time":1794932137875,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":6.470711999999992,"msg":"request completed"}
{"level":30,"time":1794932137878,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36541","remoteAddress":"127.0.0.1","remotePort":36322},"msg":"incoming request"}
{"level":30,"time":1794932137882,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.676593000000025,"msg":"request completed"}
{"level":30,"time":1794932137884,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39927","remoteAddress":"127.0.0.1","remotePort":38682},"msg":"incoming request"}
{"level":30,"time":1794932137887,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":409},"responseTime":2.4530770000000075,"msg":"request completed"}
{"level":30,"time":1794932137888,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38601","remoteAddress":"127.0.0.1","remotePort":46702},"msg":"incoming request"}
{"level":30,"time":1794932137893,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":4.508758,"msg":"request completed"}
{"level":30,"time":1794932137895,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38055","remoteAddress":"127.0.0.1","remotePort":60424},"msg":"incoming request"}
{"level":30,"time":1794932137900,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":201},"responseTime":4.9736500000000206,"msg":"request completed"}
{"level":30,"time":1794932137902,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44233","remoteAddress":"127.0.0.1","remotePort":41794},"msg":"incoming request"}
{"level":30,"time":1794932137907,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":4.571003999999959,"msg":"request completed"}
{"level":30,"time":1794932137908,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37753","remoteAddress":"127.0.0.1","remotePort":38320},"msg":"incoming request"}
{"level":30,"time":1794932137912,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":3.6186850000000277,"msg":"request completed"}
{"level":30,"time":1794932137913,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:33401","remoteAddress":"127.0.0.1","remotePort":41638},"msg":"incoming request"}
{"level":30,"time":1794932137917,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":3.9373539999999707,"msg":"request completed"}
{"level":30,"time":1794932137918,"pid":456153,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":62.79851100000002,"msg":"request completed"}
{"level":30,"time":1794932137919,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":65.074726,"msg":"request completed"}
{"level":30,"time":1794932137920,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42899","remoteAddress":"127.0.0.1","remotePort":60526},"msg":"incoming request"}
{"level":30,"time":1794932137922,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37775","remoteAddress":"127.0.0.1","remotePort":57198},"msg":"incoming request"}
{"level":30,"time":1794932137923,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":201},"responseTime":3.398181999999963,"msg":"request completed"}
{"level":30,"time":1794932137924,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/e36dd27f-1888-4baa-8f21-50d8265529d5","host":"127.0.0.1:37747","remoteAddress":"127.0.0.1","remotePort":41604},"msg":"incoming request"}
{"level":30,"time":1794932137942,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":404},"responseTime":17.211081000000036,"msg":"request completed"}
{"level":30,"time":1794932137942,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:41315","remoteAddress":"127.0.0.1","remotePort":48476},"msg":"incoming request"}
{"level":30,"time":1794932137946,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.0642449999999712,"msg":"request completed"}
{"level":30,"time":1794932137947,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/e36dd27f-1888-4baa-8f21-50d8265529d5","host":"127.0.0.1:45663","remoteAddress":"127.0.0.1","remotePort":42300},"msg":"incoming request"}
{"level":30,"time":1794932137948,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":404},"responseTime":1.8144480000000272,"msg":"request completed"}
{"level":30,"time":1794932137949,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":26.45893699999999,"msg":"request completed"}
{"level":30,"time":1794932137949,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/e36dd27f-1888-4baa-8f21-50d8265529d5/timeline","host":"127.0.0.1:38755","remoteAddress":"127.0.0.1","remotePort":57512},"msg":"incoming request"}
{"level":30,"time":1794932137951,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":404},"responseTime":1.4264989999999784,"msg":"request completed"}
{"level":30,"time":1794932137951,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37527","remoteAddress":"127.0.0.1","remotePort":44288},"msg":"incoming request"}
{"level":30,"time":1794932137953,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41439","remoteAddress":"127.0.0.1","remotePort":37986},"msg":"incoming request"}
{"level":30,"time":1794932137956,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":5.284684000000027,"msg":"request completed"}
{"level":30,"time":1794932137956,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":3.0839809999999943,"msg":"request completed"}
{"level":30,"time":1794932137959,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/55d660cc-6c89-45c9-af5f-e390639c8830/decline","host":"127.0.0.1:43321","remoteAddress":"127.0.0.1","remotePort":57752},"msg":"incoming request"}
{"level":30,"time":1794932137960,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":422},"responseTime":1.5763299999999845,"msg":"request completed"}
{"level":30,"time":1794932137962,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=fd5a7b0a-d6c8-40e2-96e9-079943ae6236","host":"127.0.0.1:43607","remoteAddress":"127.0.0.1","remotePort":57990},"msg":"incoming request"}
{"level":30,"time":1794932137966,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.9749860000000012,"msg":"request completed"}
{"level":30,"time":1794932137967,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44665","remoteAddress":"127.0.0.1","remotePort":44136},"msg":"incoming request"}
{"level":30,"time":1794932137967,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/55d660cc-6c89-45c9-af5f-e390639c8830/decline","host":"127.0.0.1:45291","remoteAddress":"127.0.0.1","remotePort":55586},"msg":"incoming request"}
{"level":30,"time":1794932137972,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":4.461869000000036,"msg":"request completed"}
{"level":30,"time":1794932137973,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/fd5a7b0a-d6c8-40e2-96e9-079943ae6236/timeline","host":"127.0.0.1:40813","remoteAddress":"127.0.0.1","remotePort":47020},"msg":"incoming request"}
{"level":30,"time":1794932137976,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":2.619899000000032,"msg":"request completed"}
{"level":30,"time":1794932137977,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":10.362840000000006,"msg":"request completed"}
{"level":30,"time":1794932137977,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36677","remoteAddress":"127.0.0.1","remotePort":33308},"msg":"incoming request"}
{"level":30,"time":1794932137978,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34991","remoteAddress":"127.0.0.1","remotePort":49416},"msg":"incoming request"}
{"level":30,"time":1794932137982,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.6571969999999965,"msg":"request completed"}
{"level":30,"time":1794932137983,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33301","remoteAddress":"127.0.0.1","remotePort":55724},"msg":"incoming request"}
{"level":30,"time":1794932137987,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":201},"responseTime":3.262727000000041,"msg":"request completed"}
{"level":30,"time":1794932137987,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":201},"responseTime":9.385124000000076,"msg":"request completed"}
{"level":30,"time":1794932137988,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40293","remoteAddress":"127.0.0.1","remotePort":45706},"msg":"incoming request"}
{"level":30,"time":1794932137988,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:43671","remoteAddress":"127.0.0.1","remotePort":56616},"msg":"incoming request"}
{"level":30,"time":1794932137992,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":3.9340680000000248,"msg":"request completed"}
{"level":40,"time":1794932137992,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:266:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794932137994,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/93c83eed-0226-4645-aae7-59ef435a1af3/approve","host":"127.0.0.1:32877","remoteAddress":"127.0.0.1","remotePort":41152},"msg":"incoming request"}
{"level":30,"time":1794932137993,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":201},"responseTime":5.246152000000052,"msg":"request completed"}
{"level":30,"time":1794932137994,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/5cc93ba9-d15f-4bd8-b536-8e921f69d086/approve","host":"127.0.0.1:40181","remoteAddress":"127.0.0.1","remotePort":58340},"msg":"incoming request"}
{"level":40,"time":1794932137997,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:70:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:321:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794932137997,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":200},"responseTime":3.1905209999999897,"msg":"request completed"}
{"level":30,"time":1794932137998,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":4.066695999999979,"msg":"request completed"}
{"level":30,"time":1794932137999,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:41459","remoteAddress":"127.0.0.1","remotePort":40758},"msg":"incoming request"}
{"level":30,"time":1794932137999,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/93c83eed-0226-4645-aae7-59ef435a1af3/fulfill","host":"127.0.0.1:35111","remoteAddress":"127.0.0.1","remotePort":33148},"msg":"incoming request"}
{"level":30,"time":1794932138001,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.088422000000037,"msg":"request completed"}
{"level":30,"time":1794932138002,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36879","remoteAddress":"127.0.0.1","remotePort":33552},"msg":"incoming request"}
{"level":30,"time":1794932138002,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.524180000000001,"msg":"request completed"}
{"level":30,"time":1794932138003,"pid":456154,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":403},"responseTime":1.1711199999999735,"msg":"request completed"}
{"level":30,"time":1794932138003,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/93c83eed-0226-4645-aae7-59ef435a1af3/fulfill","host":"127.0.0.1:45963","remoteAddress":"127.0.0.1","remotePort":44288},"msg":"incoming request"}
{"level":30,"time":1794932138007,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":3.781331000000023,"msg":"request completed"}
{"level":30,"time":1794932138009,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/099d32dd-e781-48e2-b1fb-0c85640a8ac1/timeline","host":"127.0.0.1:40211","remoteAddress":"127.0.0.1","remotePort":34800},"msg":"incoming request"}
{"level":30,"time":1794932138012,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.698056999999949,"msg":"request completed"}
{"level":30,"time":1794932138144,"pid":456153,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:40563","remoteAddress":"127.0.0.1","remotePort":56762},"msg":"incoming request"}
{"level":30,"time":1794932138148,"pid":456153,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.963162000000011,"msg":"request completed"}
stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at bumpJobFailure (/home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:201:3)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:175:13

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

stderr | src/modules/integration-gateway/eventbus.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:83:22

 ❯ src/modules/integration-gateway/eventbus.test.ts (4 tests | 1 failed) 374ms
     × a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key 205ms
{"level":30,"time":1794932138298,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36455","remoteAddress":"127.0.0.1","remotePort":37878},"msg":"incoming request"}
{"level":30,"time":1794932138315,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":16.757479999999987,"msg":"request completed"}
{"level":30,"time":1794932138342,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/activation","host":"127.0.0.1:41103","remoteAddress":"127.0.0.1","remotePort":57016},"msg":"incoming request"}
{"level":30,"time":1794932138345,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.7326419999999985,"msg":"request completed"}
{"level":30,"time":1794932138346,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8","host":"127.0.0.1:36239","remoteAddress":"127.0.0.1","remotePort":51490},"msg":"incoming request"}
{"level":30,"time":1794932138349,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8493909999999687,"msg":"request completed"}
{"level":30,"time":1794932138350,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/command-roles","host":"127.0.0.1:43289","remoteAddress":"127.0.0.1","remotePort":59258},"msg":"incoming request"}
{"level":30,"time":1794932138353,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.207033000000024,"msg":"request completed"}
{"level":30,"time":1794932138354,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/activation","host":"127.0.0.1:34745","remoteAddress":"127.0.0.1","remotePort":41306},"msg":"incoming request"}
{"level":30,"time":1794932138357,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.6549229999999966,"msg":"request completed"}
{"level":30,"time":1794932138358,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/timeline","host":"127.0.0.1:44167","remoteAddress":"127.0.0.1","remotePort":46240},"msg":"incoming request"}
{"level":30,"time":1794932138361,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4105169999999703,"msg":"request completed"}
{"level":30,"time":1794932138363,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/activation","host":"127.0.0.1:35493","remoteAddress":"127.0.0.1","remotePort":43638},"msg":"incoming request"}
{"level":30,"time":1794932138364,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":400},"responseTime":1.2797630000000026,"msg":"request completed"}
{"level":30,"time":1794932138365,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8","host":"127.0.0.1:33645","remoteAddress":"127.0.0.1","remotePort":35178},"msg":"incoming request"}
{"level":30,"time":1794932138367,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.312763000000018,"msg":"request completed"}
{"level":30,"time":1794932138369,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/command-roles","host":"127.0.0.1:42549","remoteAddress":"127.0.0.1","remotePort":36114},"msg":"incoming request"}
{"level":30,"time":1794932138372,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.939549999999997,"msg":"request completed"}
{"level":30,"time":1794932138374,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/timeline","host":"127.0.0.1:45761","remoteAddress":"127.0.0.1","remotePort":58072},"msg":"incoming request"}
{"level":30,"time":1794932138376,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":1.9942360000000008,"msg":"request completed"}
{"level":30,"time":1794932138377,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/closure","host":"127.0.0.1:34339","remoteAddress":"127.0.0.1","remotePort":38010},"msg":"incoming request"}
{"level":30,"time":1794932138381,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":4.439887999999996,"msg":"request completed"}
{"level":30,"time":1794932138382,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/6f364b7c-be81-4349-9d0e-9a4db69943b8/timeline","host":"127.0.0.1:39759","remoteAddress":"127.0.0.1","remotePort":46212},"msg":"incoming request"}
{"level":30,"time":1794932138384,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":200},"responseTime":2.00732899999997,"msg":"request completed"}
{"level":30,"time":1794932138385,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36335","remoteAddress":"127.0.0.1","remotePort":44168},"msg":"incoming request"}
{"level":30,"time":1794932138389,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":201},"responseTime":3.482078999999999,"msg":"request completed"}
{"level":30,"time":1794932138390,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/53707d42-da7c-4361-98d1-0ad97c5f16f2/command-roles","host":"127.0.0.1:37309","remoteAddress":"127.0.0.1","remotePort":52598},"msg":"incoming request"}
{"level":30,"time":1794932138392,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.3769340000000057,"msg":"request completed"}
{"level":30,"time":1794932138393,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/53707d42-da7c-4361-98d1-0ad97c5f16f2/command-roles","host":"127.0.0.1:45965","remoteAddress":"127.0.0.1","remotePort":36616},"msg":"incoming request"}
{"level":30,"time":1794932138395,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":201},"responseTime":2.055168999999978,"msg":"request completed"}
{"level":30,"time":1794932138396,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/53707d42-da7c-4361-98d1-0ad97c5f16f2/timeline","host":"127.0.0.1:38319","remoteAddress":"127.0.0.1","remotePort":35596},"msg":"incoming request"}
{"level":30,"time":1794932138398,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7775780000000054,"msg":"request completed"}
{"level":30,"time":1794932138400,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34999","remoteAddress":"127.0.0.1","remotePort":51988},"msg":"incoming request"}
{"level":30,"time":1794932138403,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":3.24596600000001,"msg":"request completed"}
{"level":30,"time":1794932138404,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/cab3157e-cc77-4c44-b41c-b15d4cd2be54/activation","host":"127.0.0.1:41035","remoteAddress":"127.0.0.1","remotePort":47630},"msg":"incoming request"}
{"level":30,"time":1794932138406,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6914059999999722,"msg":"request completed"}
{"level":30,"time":1794932138406,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/cab3157e-cc77-4c44-b41c-b15d4cd2be54/command-roles","host":"127.0.0.1:44437","remoteAddress":"127.0.0.1","remotePort":46936},"msg":"incoming request"}
{"level":30,"time":1794932138408,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":404},"responseTime":1.4289739999999824,"msg":"request completed"}
{"level":30,"time":1794932138409,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/cab3157e-cc77-4c44-b41c-b15d4cd2be54/closure","host":"127.0.0.1:41951","remoteAddress":"127.0.0.1","remotePort":57494},"msg":"incoming request"}
{"level":30,"time":1794932138410,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-k","res":{"statusCode":404},"responseTime":1.3763349999999832,"msg":"request completed"}
{"level":30,"time":1794932138411,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/cab3157e-cc77-4c44-b41c-b15d4cd2be54/activation","host":"127.0.0.1:41917","remoteAddress":"127.0.0.1","remotePort":46866},"msg":"incoming request"}
{"level":30,"time":1794932138413,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-l","res":{"statusCode":200},"responseTime":2.357416999999998,"msg":"request completed"}
{"level":30,"time":1794932138414,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38469","remoteAddress":"127.0.0.1","remotePort":40918},"msg":"incoming request"}
{"level":30,"time":1794932138417,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-m","res":{"statusCode":201},"responseTime":2.9389489999999796,"msg":"request completed"}
{"level":30,"time":1794932138418,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/3c0849b5-ea4c-4ec6-ae6c-ab1323c29eb5/closure","host":"127.0.0.1:40373","remoteAddress":"127.0.0.1","remotePort":45376},"msg":"incoming request"}
{"level":30,"time":1794932138421,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-n","res":{"statusCode":200},"responseTime":3.3966990000000123,"msg":"request completed"}
{"level":30,"time":1794932138422,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/3c0849b5-ea4c-4ec6-ae6c-ab1323c29eb5/closure","host":"127.0.0.1:36745","remoteAddress":"127.0.0.1","remotePort":34634},"msg":"incoming request"}
{"level":30,"time":1794932138424,"pid":456209,"hostname":"pivota-sandbox-83f205c0","reqId":"req-o","res":{"statusCode":409},"responseTime":2.4783539999999675,"msg":"request completed"}
{"level":30,"time":1794932138452,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:43259","remoteAddress":"127.0.0.1","remotePort":46524},"msg":"incoming request"}
{"level":30,"time":1794932138466,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":14.019637999999986,"msg":"request completed"}
{"level":30,"time":1794932138469,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491/submit-review","host":"127.0.0.1:46287","remoteAddress":"127.0.0.1","remotePort":43528},"msg":"incoming request"}
{"level":30,"time":1794932138474,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":4.910953000000006,"msg":"request completed"}
{"level":30,"time":1794932138476,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491/review","host":"127.0.0.1:32785","remoteAddress":"127.0.0.1","remotePort":43640},"msg":"incoming request"}
{"level":30,"time":1794932138478,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":403},"responseTime":2.581647999999973,"msg":"request completed"}
{"level":30,"time":1794932138479,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491","host":"127.0.0.1:46019","remoteAddress":"127.0.0.1","remotePort":36450},"msg":"incoming request"}
{"level":30,"time":1794932138482,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":3.1268820000000233,"msg":"request completed"}
{"level":30,"time":1794932138484,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491/review","host":"127.0.0.1:41263","remoteAddress":"127.0.0.1","remotePort":36134},"msg":"incoming request"}
{"level":30,"time":1794932138490,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":5.946747000000016,"msg":"request completed"}
{"level":30,"time":1794932138491,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491","host":"127.0.0.1:36705","remoteAddress":"127.0.0.1","remotePort":34876},"msg":"incoming request"}
{"level":30,"time":1794932138494,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.573933000000011,"msg":"request completed"}
{"level":30,"time":1794932138495,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491/sections/11f3b294-0749-43a4-87a0-693adeb1afa3/link-tasks","host":"127.0.0.1:42761","remoteAddress":"127.0.0.1","remotePort":48126},"msg":"incoming request"}
{"level":30,"time":1794932138497,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":204},"responseTime":2.2001020000000153,"msg":"request completed"}
{"level":30,"time":1794932138498,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491","host":"127.0.0.1:37045","remoteAddress":"127.0.0.1","remotePort":42716},"msg":"incoming request"}
{"level":30,"time":1794932138500,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.1016070000000013,"msg":"request completed"}
{"level":30,"time":1794932138501,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41159","remoteAddress":"127.0.0.1","remotePort":43270},"msg":"incoming request"}
{"level":30,"time":1794932138511,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":10.25426699999997,"msg":"request completed"}
{"level":30,"time":1794932138512,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/49da701a-3399-4a4a-8bcd-14dfa626f491/materialize-tasks","host":"127.0.0.1:33459","remoteAddress":"127.0.0.1","remotePort":36478},"msg":"incoming request"}
{"level":30,"time":1794932138516,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":200},"responseTime":3.850481000000002,"msg":"request completed"}
{"level":30,"time":1794932138518,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=8f330785-8b80-4a0a-b5cb-fafd8f059194","host":"127.0.0.1:35123","remoteAddress":"127.0.0.1","remotePort":54890},"msg":"incoming request"}
{"level":30,"time":1794932138521,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.495106000000021,"msg":"request completed"}
{"level":30,"time":1794932138522,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46169","remoteAddress":"127.0.0.1","remotePort":42592},"msg":"incoming request"}
{"level":30,"time":1794932138526,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":201},"responseTime":3.172327999999993,"msg":"request completed"}
{"level":30,"time":1794932138527,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/aa4a77c0-0408-4124-aab6-5e2cae698473/review","host":"127.0.0.1:40475","remoteAddress":"127.0.0.1","remotePort":49064},"msg":"incoming request"}
{"level":30,"time":1794932138540,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":409},"responseTime":13.523736999999983,"msg":"request completed"}
{"level":30,"time":1794932138541,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:36845","remoteAddress":"127.0.0.1","remotePort":34844},"msg":"incoming request"}
{"level":30,"time":1794932138544,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":2.3750499999999874,"msg":"request completed"}
{"level":30,"time":1794932138544,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/1741bca0-d4d5-4102-9f6a-d69265dff98c/submit-review","host":"127.0.0.1:40167","remoteAddress":"127.0.0.1","remotePort":41296},"msg":"incoming request"}
{"level":30,"time":1794932138546,"pid":456220,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.766317000000015,"msg":"request completed"}
{"level":30,"time":1794932138699,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37017","remoteAddress":"127.0.0.1","remotePort":37576},"msg":"incoming request"}
{"level":30,"time":1794932138705,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":422},"responseTime":5.282280000000014,"msg":"request completed"}
{"level":30,"time":1794932138709,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36967","remoteAddress":"127.0.0.1","remotePort":44992},"msg":"incoming request"}
{"level":30,"time":1794932138711,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":422},"responseTime":2.1382360000000062,"msg":"request completed"}
{"level":30,"time":1794932138712,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43881","remoteAddress":"127.0.0.1","remotePort":44638},"msg":"incoming request"}
{"level":30,"time":1794932138717,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.5581000000000245,"msg":"request completed"}
{"level":30,"time":1794932138718,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41515","remoteAddress":"127.0.0.1","remotePort":46996},"msg":"incoming request"}
{"level":30,"time":1794932138740,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":21.284761000000003,"msg":"request completed"}
{"level":30,"time":1794932138741,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45117","remoteAddress":"127.0.0.1","remotePort":45580},"msg":"incoming request"}
{"level":30,"time":1794932138744,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":201},"responseTime":3.1492039999999974,"msg":"request completed"}
{"level":30,"time":1794932138746,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/8920f13d-10d3-4a04-8616-b0bfe3dcf13c/timeline","host":"127.0.0.1:46101","remoteAddress":"127.0.0.1","remotePort":57296},"msg":"incoming request"}
{"level":30,"time":1794932138748,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.78249500000004,"msg":"request completed"}
{"level":30,"time":1794932138750,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36867","remoteAddress":"127.0.0.1","remotePort":33972},"msg":"incoming request"}
{"level":30,"time":1794932138755,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":201},"responseTime":4.468731999999989,"msg":"request completed"}
{"level":30,"time":1794932138756,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/33dd4de5-e483-4612-adf8-4dd7daa69bf4/status","host":"127.0.0.1:46319","remoteAddress":"127.0.0.1","remotePort":52168},"msg":"incoming request"}
{"level":30,"time":1794932138758,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":409},"responseTime":2.280163000000016,"msg":"request completed"}
{"level":30,"time":1794932138759,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45607","remoteAddress":"127.0.0.1","remotePort":52680},"msg":"incoming request"}
{"level":30,"time":1794932138762,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":201},"responseTime":2.6436140000000137,"msg":"request completed"}
{"level":30,"time":1794932138763,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/1f9b33fb-d8c3-4e13-bd21-c0dcdb56d4af/status","host":"127.0.0.1:43373","remoteAddress":"127.0.0.1","remotePort":52526},"msg":"incoming request"}
{"level":30,"time":1794932138765,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":409},"responseTime":1.73544899999996,"msg":"request completed"}
{"level":30,"time":1794932138766,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/1f9b33fb-d8c3-4e13-bd21-c0dcdb56d4af/status","host":"127.0.0.1:46821","remoteAddress":"127.0.0.1","remotePort":48044},"msg":"incoming request"}
{"level":30,"time":1794932138769,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":2.861212999999964,"msg":"request completed"}
{"level":30,"time":1794932138769,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/1f9b33fb-d8c3-4e13-bd21-c0dcdb56d4af/status","host":"127.0.0.1:33737","remoteAddress":"127.0.0.1","remotePort":42964},"msg":"incoming request"}
{"level":30,"time":1794932138771,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4961100000000442,"msg":"request completed"}
{"level":30,"time":1794932138772,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/1f9b33fb-d8c3-4e13-bd21-c0dcdb56d4af/status","host":"127.0.0.1:41649","remoteAddress":"127.0.0.1","remotePort":57440},"msg":"incoming request"}
{"level":30,"time":1794932138774,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.6297680000000128,"msg":"request completed"}
{"level":30,"time":1794932138775,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/1f9b33fb-d8c3-4e13-bd21-c0dcdb56d4af/status","host":"127.0.0.1:38471","remoteAddress":"127.0.0.1","remotePort":54070},"msg":"incoming request"}
{"level":30,"time":1794932138778,"pid":456252,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":2.633837000000028,"msg":"request completed"}
{"level":30,"time":1794932138826,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:43239","remoteAddress":"127.0.0.1","remotePort":59482},"msg":"incoming request"}
{"level":30,"time":1794932138856,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":30.280003000000022,"msg":"request completed"}
{"level":30,"time":1794932138859,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:46373","remoteAddress":"127.0.0.1","remotePort":53320},"msg":"incoming request"}
{"level":30,"time":1794932138862,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.020992999999976,"msg":"request completed"}
{"level":30,"time":1794932138864,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42715","remoteAddress":"127.0.0.1","remotePort":48772},"msg":"incoming request"}
{"level":30,"time":1794932138865,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":400},"responseTime":1.6549479999999903,"msg":"request completed"}
{"level":30,"time":1794932138867,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:35153","remoteAddress":"127.0.0.1","remotePort":35574},"msg":"incoming request"}
{"level":30,"time":1794932138870,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.151077999999984,"msg":"request completed"}
{"level":30,"time":1794932138872,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/f9274ab9-9e4a-487e-8f4e-cf427d614a6e/revoke","host":"127.0.0.1:35345","remoteAddress":"127.0.0.1","remotePort":55874},"msg":"incoming request"}
{"level":30,"time":1794932138875,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":204},"responseTime":2.940052000000037,"msg":"request completed"}
{"level":30,"time":1794932138877,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41221","remoteAddress":"127.0.0.1","remotePort":55162},"msg":"incoming request"}
{"level":30,"time":1794932138881,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":4.014808999999957,"msg":"request completed"}
{"level":30,"time":1794932138882,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41369","remoteAddress":"127.0.0.1","remotePort":40480},"msg":"incoming request"}
{"level":30,"time":1794932138884,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.8946079999999483,"msg":"request completed"}
{"level":30,"time":1794932138885,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:33541","remoteAddress":"127.0.0.1","remotePort":57142},"msg":"incoming request"}
{"level":30,"time":1794932138887,"pid":456264,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.356375000000014,"msg":"request completed"}
{"level":30,"time":1794932139078,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:46397","remoteAddress":"127.0.0.1","remotePort":51404},"msg":"incoming request"}
{"level":30,"time":1794932139085,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":6.675557000000026,"msg":"request completed"}
{"level":30,"time":1794932139089,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:43641","remoteAddress":"127.0.0.1","remotePort":35396},"msg":"incoming request"}
{"level":30,"time":1794932139099,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":9.553770999999983,"msg":"request completed"}
{"level":30,"time":1794932139103,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33761","remoteAddress":"127.0.0.1","remotePort":56098},"msg":"incoming request"}
{"level":30,"time":1794932139106,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.7357370000000287,"msg":"request completed"}
{"level":30,"time":1794932139107,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/0e157ecb-59b2-4115-b09f-68d729d496a5","host":"127.0.0.1:44787","remoteAddress":"127.0.0.1","remotePort":37376},"msg":"incoming request"}
{"level":30,"time":1794932139110,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":2.7135559999999828,"msg":"request completed"}
{"level":30,"time":1794932139111,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43341","remoteAddress":"127.0.0.1","remotePort":51620},"msg":"incoming request"}
{"level":30,"time":1794932139111,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5429200000000378,"msg":"request completed"}
{"level":30,"time":1794932139113,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36103","remoteAddress":"127.0.0.1","remotePort":59204},"msg":"incoming request"}
{"level":30,"time":1794932139114,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":403},"responseTime":1.4562250000000176,"msg":"request completed"}
{"level":30,"time":1794932139115,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/3917794e-80bb-4c33-b073-53e7e84c2683","host":"127.0.0.1:36023","remoteAddress":"127.0.0.1","remotePort":33106},"msg":"incoming request"}
{"level":30,"time":1794932139119,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":3.76173399999999,"msg":"request completed"}
{"level":30,"time":1794932139120,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42889","remoteAddress":"127.0.0.1","remotePort":44636},"msg":"incoming request"}
{"level":30,"time":1794932139123,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.959578000000022,"msg":"request completed"}
{"level":30,"time":1794932139124,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=e3c65465-f5e4-4b1e-bf86-3083168daecb&page_size=50","host":"127.0.0.1:46581","remoteAddress":"127.0.0.1","remotePort":33222},"msg":"incoming request"}
{"level":30,"time":1794932139126,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7076069999999959,"msg":"request completed"}
{"level":30,"time":1794932139127,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:39463","remoteAddress":"127.0.0.1","remotePort":59460},"msg":"incoming request"}
{"level":30,"time":1794932139129,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-a","res":{"statusCode":403},"responseTime":1.2619599999999878,"msg":"request completed"}
{"level":30,"time":1794932139130,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:43451","remoteAddress":"127.0.0.1","remotePort":56818},"msg":"incoming request"}
{"level":30,"time":1794932139132,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-b","res":{"statusCode":200},"responseTime":1.5472050000000195,"msg":"request completed"}
{"level":30,"time":1794932139132,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:35809","remoteAddress":"127.0.0.1","remotePort":33194},"msg":"incoming request"}
{"level":30,"time":1794932139134,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":1.9891359999999736,"msg":"request completed"}
{"level":30,"time":1794932139139,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37479","remoteAddress":"127.0.0.1","remotePort":42102},"msg":"incoming request"}
{"level":30,"time":1794932139141,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":1.770083999999997,"msg":"request completed"}
{"level":30,"time":1794932139142,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=e3c65465-f5e4-4b1e-bf86-3083168daecb&action_type=record_view","host":"127.0.0.1:44397","remoteAddress":"127.0.0.1","remotePort":58668},"msg":"incoming request"}
{"level":30,"time":1794932139144,"pid":456294,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.6448589999999967,"msg":"request completed"}
{"level":30,"time":1794932139171,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33475","remoteAddress":"127.0.0.1","remotePort":33150},"msg":"incoming request"}
{"level":30,"time":1794932139187,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.191198000000043,"msg":"request completed"}
{"level":30,"time":1794932139191,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46601","remoteAddress":"127.0.0.1","remotePort":47526},"msg":"incoming request"}
{"level":30,"time":1794932139195,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":201},"responseTime":4.2272290000000226,"msg":"request completed"}
{"level":30,"time":1794932139196,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:41787","remoteAddress":"127.0.0.1","remotePort":55740},"msg":"incoming request"}
{"level":30,"time":1794932139200,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":4.016152000000034,"msg":"request completed"}
{"level":30,"time":1794932139202,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39781","remoteAddress":"127.0.0.1","remotePort":50400},"msg":"incoming request"}
{"level":30,"time":1794932139206,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":201},"responseTime":3.4480950000000234,"msg":"request completed"}
{"level":30,"time":1794932139207,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:34529","remoteAddress":"127.0.0.1","remotePort":53660},"msg":"incoming request"}
{"level":30,"time":1794932139211,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":3.707503000000031,"msg":"request completed"}
{"level":30,"time":1794932139213,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:42755","remoteAddress":"127.0.0.1","remotePort":57658},"msg":"incoming request"}
{"level":30,"time":1794932139215,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":200},"responseTime":2.2241470000000163,"msg":"request completed"}
{"level":30,"time":1794932139216,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:37441","remoteAddress":"127.0.0.1","remotePort":50520},"msg":"incoming request"}
{"level":30,"time":1794932139218,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9740980000000263,"msg":"request completed"}
{"level":30,"time":1794932139219,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:41151","remoteAddress":"127.0.0.1","remotePort":34182},"msg":"incoming request"}
{"level":30,"time":1794932139222,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":200},"responseTime":2.4271170000000097,"msg":"request completed"}
{"level":30,"time":1794932139223,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45303","remoteAddress":"127.0.0.1","remotePort":34886},"msg":"incoming request"}
{"level":30,"time":1794932139225,"pid":456306,"hostname":"pivota-sandbox-83f205c0","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7308400000000006,"msg":"request completed"}
{"level":30,"time":1794932139451,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46521","remoteAddress":"127.0.0.1","remotePort":40642},"msg":"incoming request"}
{"level":30,"time":1794932139474,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":22.739472999999975,"msg":"request completed"}
{"level":30,"time":1794932139484,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/e549d3ba-cdb4-4996-8be7-7c8986542c7c/timeline","host":"127.0.0.1:33783","remoteAddress":"127.0.0.1","remotePort":36796},"msg":"incoming request"}
{"level":30,"time":1794932139487,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":3.258760000000052,"msg":"request completed"}
{"level":30,"time":1794932139492,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46077","remoteAddress":"127.0.0.1","remotePort":47226},"msg":"incoming request"}
{"level":30,"time":1794932139496,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":4.008978000000013,"msg":"request completed"}
{"level":30,"time":1794932139498,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/f756e5fb-405c-444f-bf12-dd6d6344fdbd/closure","host":"127.0.0.1:46583","remoteAddress":"127.0.0.1","remotePort":49548},"msg":"incoming request"}
{"level":30,"time":1794932139503,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":4.7166879999999765,"msg":"request completed"}
{"level":30,"time":1794932139506,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/f756e5fb-405c-444f-bf12-dd6d6344fdbd/timeline","host":"127.0.0.1:36811","remoteAddress":"127.0.0.1","remotePort":46182},"msg":"incoming request"}
{"level":30,"time":1794932139508,"pid":456318,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":2.1948719999999753,"msg":"request completed"}
{"level":30,"time":1794932139521,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34055","remoteAddress":"127.0.0.1","remotePort":34598},"msg":"incoming request"}
{"level":30,"time":1794932139527,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.7391680000000065,"msg":"request completed"}
{"level":30,"time":1794932139529,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33655","remoteAddress":"127.0.0.1","remotePort":46750},"msg":"incoming request"}
{"level":30,"time":1794932139530,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19621799999998757,"msg":"request completed"}
{"level":30,"time":1794932139531,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:44683","remoteAddress":"127.0.0.1","remotePort":43200},"msg":"incoming request"}
{"level":30,"time":1794932139534,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.9295319999999947,"msg":"request completed"}
{"level":30,"time":1794932139535,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45611","remoteAddress":"127.0.0.1","remotePort":48636},"msg":"incoming request"}
{"level":30,"time":1794932139537,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.9466559999999618,"msg":"request completed"}
{"level":30,"time":1794932139539,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45483","remoteAddress":"127.0.0.1","remotePort":52818},"msg":"incoming request"}
{"level":30,"time":1794932139540,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.788567999999998,"msg":"request completed"}
{"level":30,"time":1794932139541,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38415","remoteAddress":"127.0.0.1","remotePort":50868},"msg":"incoming request"}
{"level":30,"time":1794932139542,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.49081200000000536,"msg":"request completed"}
{"level":30,"time":1794932139543,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:38487","remoteAddress":"127.0.0.1","remotePort":57230},"msg":"incoming request"}
{"level":30,"time":1794932139545,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5265459999999962,"msg":"request completed"}
{"level":30,"time":1794932139546,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:36487","remoteAddress":"127.0.0.1","remotePort":40124},"msg":"incoming request"}
{"level":30,"time":1794932139547,"pid":456330,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":0.949764000000016,"msg":"request completed"}
{"level":30,"time":1794932148022,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41123","remoteAddress":"127.0.0.1","remotePort":43482},"msg":"incoming request"}
{"level":30,"time":1794932148026,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":201},"responseTime":4.467659999998432,"msg":"request completed"}
{"level":30,"time":1794932148027,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:41285","remoteAddress":"127.0.0.1","remotePort":48118},"msg":"incoming request"}
{"level":30,"time":1794932148029,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-f","res":{"statusCode":422},"responseTime":1.4091860000007728,"msg":"request completed"}
{"level":30,"time":1794932148030,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44879","remoteAddress":"127.0.0.1","remotePort":36288},"msg":"incoming request"}
{"level":30,"time":1794932148033,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-g","res":{"statusCode":201},"responseTime":2.7099079999989044,"msg":"request completed"}
{"level":30,"time":1794932148034,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35125","remoteAddress":"127.0.0.1","remotePort":42386},"msg":"incoming request"}
{"level":30,"time":1794932148036,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-h","res":{"statusCode":201},"responseTime":2.3215889999992214,"msg":"request completed"}
{"level":30,"time":1794932148037,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/a3870056-f536-41cb-b444-04e26cea8832/fulfill","host":"127.0.0.1:35405","remoteAddress":"127.0.0.1","remotePort":49836},"msg":"incoming request"}
{"level":30,"time":1794932148043,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-i","res":{"statusCode":409},"responseTime":6.413163999999597,"msg":"request completed"}
{"level":30,"time":1794932148044,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/a3870056-f536-41cb-b444-04e26cea8832/approve","host":"127.0.0.1:35631","remoteAddress":"127.0.0.1","remotePort":46138},"msg":"incoming request"}
{"level":30,"time":1794932148046,"pid":456152,"hostname":"pivota-sandbox-83f205c0","reqId":"req-j","res":{"statusCode":409},"responseTime":1.5585559999999532,"msg":"request completed"}
stderr | src/modules/incident-ops/resource-requests.test.ts
webhook delivery worker: error processing message Error: Cannot use a pool after calling end on the pool
    at /home/daytona/project/node_modules/pg-pool/index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at query (/home/daytona/project/backend/src/db/client.ts:6:18)
    at /home/daytona/project/backend/src/modules/integration-gateway/webhook-delivery-worker.ts:125:30

 ❯ src/modules/incident-ops/resource-requests.test.ts (4 tests | 1 failed) 10267ms
     × approve -> two-phase assign-then-fulfill flow; Timeline proves full lifecycle; event-bus publishes resource_request.status_changed 10044ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/incident-ops/resource-requests.test.ts > incident-ops resource-request routes > approve -> two-phase assign-then-fulfill flow; Timeline proves full lifecycle; event-bus publishes resource_request.status_changed
Error: waitFor timed out
 ❯ Timeout.poll [as _onTimeout] src/modules/incident-ops/resource-requests.test.ts:73:57
     71|     const poll = () => {
     72|       if (predicate()) return resolve();
     73|       if (Date.now() - start > timeoutMs) return reject(new Error('wai…
       |                                                         ^
     74|       setTimeout(poll, 200);
     75|     };

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/modules/integration-gateway/eventbus.test.ts > event bus: publish -> durable delivery -> webhook subscriber > a published user.login event is delivered to the registered subscriber within the poll window, with a populated idempotency_key
AssertionError: expected { …(3) } to match object { Object (user_id) }
(2 matching properties omitted from actual)

- Expected
+ Received

  {
-   "user_id": "6bac48d2-6596-4233-9fdd-2a108e76bf50",
+   "user_id": "db4dc89a-cb7b-46a8-b702-65c62ed31ddf",
  }

 ❯ src/modules/integration-gateway/eventbus.test.ts:157:31
    155|     expect(typeof delivered.idempotency_key).toBe('string');
    156|     expect((delivered.idempotency_key as string).length).toBeGreaterTh…
    157|     expect(delivered.payload).toMatchObject({ user_id: testUserId });
       |                               ^
    158|   });
    159|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  2 failed | 9 passed (11)
      Tests  2 failed | 53 passed (55)
   Start at  16:15:37
   Duration  10.59s (transform 322ms, setup 47ms, import 2.04s, tests 11.97s, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/daytona/project/backend
npm error workspace @epmp/backend@0.1.0
npm error location /home/daytona/project/backend
npm error command failed
npm error command sh -c vitest run
```


## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=0 build_cmd=[npm run build] test_cmd=[npm test] head=5c0be6dd9586732b51762e7d1a9ee6f37e405285 test_files=28 skip_marks=0 shadow_files=0 untested=0
{"level":30,"time":1794937033224,"pid":686681,"hostname":"pivota-sandbox-83f205c0","reqId":"req-c","res":{"statusCode":422},"responseTime":2.1726220000000467,"msg":"request completed"}
{"level":30,"time":1794937033225,"pid":686681,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42037","remoteAddress":"127.0.0.1","remotePort":45118},"msg":"incoming request"}
{"level":30,"time":1794937033227,"pid":686681,"hostname":"pivota-sandbox-83f205c0","reqId":"req-d","res":{"statusCode":200},"responseTime":2.0251650000000154,"msg":"request completed"}
{"level":30,"time":1794937033228,"pid":686681,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=f8fbccf4-882b-48ee-8a32-d2fb716582f1&action_type=record_view","host":"127.0.0.1:42649","remoteAddress":"127.0.0.1","remotePort":45098},"msg":"incoming request"}
{"level":30,"time":1794937033230,"pid":686681,"hostname":"pivota-sandbox-83f205c0","reqId":"req-e","res":{"statusCode":200},"responseTime":1.8310010000000148,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/admin.test.ts [2m([22m[2m7 tests[22m[2m)[22m[32m 142[2mms[22m[39m
{"level":30,"time":1794937033314,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34555","remoteAddress":"127.0.0.1","remotePort":58238},"msg":"incoming request"}
{"level":30,"time":1794937033329,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":201},"responseTime":15.060078000000033,"msg":"request completed"}
{"level":30,"time":1794937033336,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/812afd7a-e375-4dcf-b298-1f4e9301778b/timeline","host":"127.0.0.1:42359","remoteAddress":"127.0.0.1","remotePort":52920},"msg":"incoming request"}
{"level":30,"time":1794937033339,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":200},"responseTime":2.921260000000018,"msg":"request completed"}
{"level":30,"time":1794937033343,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43633","remoteAddress":"127.0.0.1","remotePort":35504},"msg":"incoming request"}
{"level":30,"time":1794937033346,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1970569999999725,"msg":"request completed"}
{"level":30,"time":1794937033348,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/e787f8aa-158c-4aa3-9802-abf28c573895/closure","host":"127.0.0.1:33777","remoteAddress":"127.0.0.1","remotePort":43192},"msg":"incoming request"}
{"level":30,"time":1794937033352,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":4.2206410000000005,"msg":"request completed"}
{"level":30,"time":1794937033353,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/e787f8aa-158c-4aa3-9802-abf28c573895/timeline","host":"127.0.0.1:43371","remoteAddress":"127.0.0.1","remotePort":49522},"msg":"incoming request"}
{"level":30,"time":1794937033355,"pid":686693,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.859104000000002,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/overdue-sweep.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 108[2mms[22m[39m
{"level":30,"time":1794937033400,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45597","remoteAddress":"127.0.0.1","remotePort":55030},"msg":"incoming request"}
{"level":30,"time":1794937033406,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-1","res":{"statusCode":200},"responseTime":5.397571999999968,"msg":"request completed"}
{"level":30,"time":1794937033409,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44519","remoteAddress":"127.0.0.1","remotePort":34092},"msg":"incoming request"}
{"level":30,"time":1794937033409,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-2","res":{"statusCode":401},"responseTime":0.21499399999999014,"msg":"request completed"}
{"level":30,"time":1794937033411,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:39393","remoteAddress":"127.0.0.1","remotePort":35098},"msg":"incoming request"}
{"level":30,"time":1794937033414,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-3","res":{"statusCode":200},"responseTime":2.926828999999998,"msg":"request completed"}
{"level":30,"time":1794937033414,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36927","remoteAddress":"127.0.0.1","remotePort":51218},"msg":"incoming request"}
{"level":30,"time":1794937033416,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-4","res":{"statusCode":200},"responseTime":1.8431929999999852,"msg":"request completed"}
{"level":30,"time":1794937033417,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37251","remoteAddress":"127.0.0.1","remotePort":33150},"msg":"incoming request"}
{"level":30,"time":1794937033419,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5989739999999983,"msg":"request completed"}
{"level":30,"time":1794937033420,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40279","remoteAddress":"127.0.0.1","remotePort":39018},"msg":"incoming request"}
{"level":30,"time":1794937033421,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-6","res":{"statusCode":401},"responseTime":0.49744500000002745,"msg":"request completed"}
{"level":30,"time":1794937033423,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:36561","remoteAddress":"127.0.0.1","remotePort":33492},"msg":"incoming request"}
{"level":30,"time":1794937033425,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-7","res":{"statusCode":200},"responseTime":1.679124999999999,"msg":"request completed"}
{"level":30,"time":1794937033427,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42509","remoteAddress":"127.0.0.1","remotePort":48254},"msg":"incoming request"}
{"level":30,"time":1794937033428,"pid":686705,"hostname":"pivota-sandbox-83f205c0","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0018230000000017,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/routes.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 88[2mms[22m[39m

[2m Test Files [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m      Tests [22m [1m[32m55 passed[39m[22m[90m (55)[39m
[2m   Start at [22m 17:37:11
[2m   Duration [22m 2.06s[2m (transform 930ms, setup 45ms, import 2.80s, tests 2.27s, environment 0ms)[22m

```

## Wave 8

- Build: `npm run build && npm run build -w frontend/design-system && npm run build -w frontend/app` → pass
- Tests: `npm test && npm test -w frontend/design-system` → pass
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
[32m✓ built in 185ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 130 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-sVNHn7gz.css  [39m[1m[2m 44.66 kB[22m[1m[22m[2m │ gzip:   7.48 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-Bz_BFDWf.js   [39m[1m[2m430.78 kB[22m[1m[22m[2m │ gzip: 125.06 kB[22m
[32m✓ built in 860ms[39m

> epmp@0.1.0 test
> npm run test -w backend


> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794952309451,"pid":170572,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:43829","remoteAddress":"127.0.0.1","remotePort":41634},"msg":"incoming request"}
{"level":30,"time":1794952309497,"pid":170572,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":46.10054100000002,"msg":"request completed"}
{"level":30,"time":1794952309705,"pid":170572,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:40799","remoteAddress":"127.0.0.1","remotePort":55998},"msg":"incoming request"}
{"level":30,"time":1794952309709,"pid":170572,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":3.2465250000000196,"msg":"request completed"}
{"level":30,"time":1794952309956,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:36735","remoteAddress":"127.0.0.1","remotePort":48748},"msg":"incoming request"}
{"level":30,"time":1794952310004,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":48.131996999999984,"msg":"request completed"}
{"level":30,"time":1794952310007,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39191","remoteAddress":"127.0.0.1","remotePort":60434},"msg":"incoming request"}
{"level":30,"time":1794952310017,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":201},"responseTime":9.864430000000027,"msg":"request completed"}
{"level":30,"time":1794952310018,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46201","remoteAddress":"127.0.0.1","remotePort":43534},"msg":"incoming request"}
{"level":30,"time":1794952310022,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":201},"responseTime":3.9632550000000037,"msg":"request completed"}
{"level":30,"time":1794952310025,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/fa346855-7e65-423d-bac2-09d4b8a8f7be/decline","host":"127.0.0.1:39643","remoteAddress":"127.0.0.1","remotePort":38016},"msg":"incoming request"}
{"level":30,"time":1794952310027,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":422},"responseTime":1.6111349999999902,"msg":"request completed"}
{"level":30,"time":1794952310028,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=12e733bd-d6dc-4d18-b8db-ee9bb84d5499","host":"127.0.0.1:44467","remoteAddress":"127.0.0.1","remotePort":35162},"msg":"incoming request"}
{"level":30,"time":1794952310030,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":1.9615039999999908,"msg":"request completed"}
{"level":30,"time":1794952310031,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/fa346855-7e65-423d-bac2-09d4b8a8f7be/decline","host":"127.0.0.1:35769","remoteAddress":"127.0.0.1","remotePort":50328},"msg":"incoming request"}
{"level":30,"time":1794952310034,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":2.818929999999966,"msg":"request completed"}
{"level":30,"time":1794952310035,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/12e733bd-d6dc-4d18-b8db-ee9bb84d5499/timeline","host":"127.0.0.1:40237","remoteAddress":"127.0.0.1","remotePort":37326},"msg":"incoming request"}
{"level":30,"time":1794952310037,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":2.075840000000028,"msg":"request completed"}
{"level":30,"time":1794952310039,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43165","remoteAddress":"127.0.0.1","remotePort":46856},"msg":"incoming request"}
{"level":30,"time":1794952310042,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":201},"responseTime":3.0234250000000316,"msg":"request completed"}
{"level":30,"time":1794952310044,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35709","remoteAddress":"127.0.0.1","remotePort":54302},"msg":"incoming request"}
{"level":30,"time":1794952310047,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":201},"responseTime":3.2070909999999913,"msg":"request completed"}
{"level":30,"time":1794952310049,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/9405f871-d7ab-45b1-b18f-c6580d43ef14/approve","host":"127.0.0.1:35235","remoteAddress":"127.0.0.1","remotePort":55102},"msg":"incoming request"}
{"level":30,"time":1794952310052,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":200},"responseTime":3.1609940000000165,"msg":"request completed"}
{"level":30,"time":1794952310053,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/9405f871-d7ab-45b1-b18f-c6580d43ef14/fulfill","host":"127.0.0.1:38605","remoteAddress":"127.0.0.1","remotePort":56370},"msg":"incoming request"}
{"level":30,"time":1794952310057,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":200},"responseTime":3.549946000000034,"msg":"request completed"}
{"level":30,"time":1794952310058,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/9405f871-d7ab-45b1-b18f-c6580d43ef14/fulfill","host":"127.0.0.1:39659","remoteAddress":"127.0.0.1","remotePort":58514},"msg":"incoming request"}
{"level":30,"time":1794952310061,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":200},"responseTime":3.1914509999999723,"msg":"request completed"}
{"level":30,"time":1794952310062,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/6964d68c-f819-4df8-805e-5565dc4b2086/timeline","host":"127.0.0.1:35533","remoteAddress":"127.0.0.1","remotePort":60472},"msg":"incoming request"}
{"level":30,"time":1794952310064,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":200},"responseTime":1.9484899999999925,"msg":"request completed"}
{"level":30,"time":1794952310065,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45613","remoteAddress":"127.0.0.1","remotePort":55920},"msg":"incoming request"}
{"level":30,"time":1794952310068,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":201},"responseTime":2.2820480000000316,"msg":"request completed"}
{"level":30,"time":1794952310068,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46647","remoteAddress":"127.0.0.1","remotePort":44240},"msg":"incoming request"}
{"level":30,"time":1794952310069,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","res":{"statusCode":422},"responseTime":0.9201830000000086,"msg":"request completed"}
{"level":30,"time":1794952310070,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42237","remoteAddress":"127.0.0.1","remotePort":33464},"msg":"incoming request"}
{"level":30,"time":1794952310073,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","res":{"statusCode":201},"responseTime":2.0817409999999654,"msg":"request completed"}
{"level":30,"time":1794952310073,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39087","remoteAddress":"127.0.0.1","remotePort":39004},"msg":"incoming request"}
{"level":30,"time":1794952310075,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","res":{"statusCode":201},"responseTime":2.1162860000000023,"msg":"request completed"}
{"level":30,"time":1794952310076,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/c72dda9d-5c06-4021-af46-c4efcd40a292/fulfill","host":"127.0.0.1:32897","remoteAddress":"127.0.0.1","remotePort":53126},"msg":"incoming request"}
{"level":30,"time":1794952310078,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","res":{"statusCode":409},"responseTime":1.467644000000007,"msg":"request completed"}
{"level":30,"time":1794952310079,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/c72dda9d-5c06-4021-af46-c4efcd40a292/approve","host":"127.0.0.1:34835","remoteAddress":"127.0.0.1","remotePort":55492},"msg":"incoming request"}
{"level":30,"time":1794952310080,"pid":170583,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","res":{"statusCode":409},"responseTime":1.3596009999999978,"msg":"request completed"}
{"level":30,"time":1794952310324,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41931","remoteAddress":"127.0.0.1","remotePort":47190},"msg":"incoming request"}
{"level":30,"time":1794952310337,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":12.973295000000007,"msg":"request completed"}
{"level":30,"time":1794952310340,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/3f40d176-4236-48e1-8771-b3f38985ab1a/timeline","host":"127.0.0.1:35187","remoteAddress":"127.0.0.1","remotePort":41288},"msg":"incoming request"}
{"level":30,"time":1794952310343,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":2.80151699999999,"msg":"request completed"}
{"level":30,"time":1794952310344,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35691","remoteAddress":"127.0.0.1","remotePort":50596},"msg":"incoming request"}
{"level":30,"time":1794952310348,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":201},"responseTime":3.119154999999978,"msg":"request completed"}
{"level":30,"time":1794952310348,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34987","remoteAddress":"127.0.0.1","remotePort":47856},"msg":"incoming request"}
{"level":30,"time":1794952310350,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":409},"responseTime":1.3095659999999612,"msg":"request completed"}
{"level":30,"time":1794952310351,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35799","remoteAddress":"127.0.0.1","remotePort":55310},"msg":"incoming request"}
{"level":30,"time":1794952310355,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":201},"responseTime":4.178480000000036,"msg":"request completed"}
{"level":30,"time":1794952310357,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35987","remoteAddress":"127.0.0.1","remotePort":36094},"msg":"incoming request"}
{"level":30,"time":1794952310360,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":201},"responseTime":3.1488800000000197,"msg":"request completed"}
{"level":30,"time":1794952310361,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36423","remoteAddress":"127.0.0.1","remotePort":50158},"msg":"incoming request"}
{"level":30,"time":1794952310364,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":201},"responseTime":2.5185330000000477,"msg":"request completed"}
{"level":30,"time":1794952310364,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34099","remoteAddress":"127.0.0.1","remotePort":42404},"msg":"incoming request"}
{"level":30,"time":1794952310367,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":201},"responseTime":2.46387100000004,"msg":"request completed"}
{"level":30,"time":1794952310368,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:33183","remoteAddress":"127.0.0.1","remotePort":56024},"msg":"incoming request"}
{"level":30,"time":1794952310371,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":200},"responseTime":2.3346970000000056,"msg":"request completed"}
{"level":30,"time":1794952310373,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33255","remoteAddress":"127.0.0.1","remotePort":49602},"msg":"incoming request"}
{"level":30,"time":1794952310375,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":201},"responseTime":2.6349030000000084,"msg":"request completed"}
{"level":30,"time":1794952310376,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/bf625310-cdb1-45b5-aa6a-327e80a92cc5","host":"127.0.0.1:44811","remoteAddress":"127.0.0.1","remotePort":34446},"msg":"incoming request"}
{"level":30,"time":1794952310378,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":404},"responseTime":1.547234000000003,"msg":"request completed"}
{"level":30,"time":1794952310379,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:33441","remoteAddress":"127.0.0.1","remotePort":55556},"msg":"incoming request"}
{"level":30,"time":1794952310381,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":200},"responseTime":1.9475189999999998,"msg":"request completed"}
{"level":30,"time":1794952310381,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/bf625310-cdb1-45b5-aa6a-327e80a92cc5","host":"127.0.0.1:34353","remoteAddress":"127.0.0.1","remotePort":35482},"msg":"incoming request"}
{"level":30,"time":1794952310383,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":404},"responseTime":1.4064989999999966,"msg":"request completed"}
{"level":30,"time":1794952310384,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/bf625310-cdb1-45b5-aa6a-327e80a92cc5/timeline","host":"127.0.0.1:38065","remoteAddress":"127.0.0.1","remotePort":36294},"msg":"incoming request"}
{"level":30,"time":1794952310385,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":404},"responseTime":1.0421329999999784,"msg":"request completed"}
{"level":30,"time":1794952310386,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35433","remoteAddress":"127.0.0.1","remotePort":33624},"msg":"incoming request"}
{"level":30,"time":1794952310389,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","res":{"statusCode":201},"responseTime":2.9373829999999543,"msg":"request completed"}
{"level":30,"time":1794952310398,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40277","remoteAddress":"127.0.0.1","remotePort":54042},"msg":"incoming request"}
{"level":30,"time":1794952310407,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","res":{"statusCode":201},"responseTime":8.464763000000005,"msg":"request completed"}
{"level":30,"time":1794952310408,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36767","remoteAddress":"127.0.0.1","remotePort":41458},"msg":"incoming request"}
{"level":30,"time":1794952310411,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","res":{"statusCode":201},"responseTime":2.8687340000000177,"msg":"request completed"}
{"level":30,"time":1794952310412,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35551","remoteAddress":"127.0.0.1","remotePort":33206},"msg":"incoming request"}
{"level":30,"time":1794952310415,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","res":{"statusCode":201},"responseTime":2.9839999999999804,"msg":"request completed"}
{"level":30,"time":1794952310415,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:34265","remoteAddress":"127.0.0.1","remotePort":41486},"msg":"incoming request"}
{"level":40,"time":1794952310418,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794952310420,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","res":{"statusCode":201},"responseTime":4.4032040000000165,"msg":"request completed"}
{"level":30,"time":1794952310420,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/cb0c3e13-7bef-4ffc-8daf-42325c33fa3e/approve","host":"127.0.0.1:38127","remoteAddress":"127.0.0.1","remotePort":34522},"msg":"incoming request"}
{"level":40,"time":1794952310423,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794952310423,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-k","res":{"statusCode":200},"responseTime":2.6266069999999786,"msg":"request completed"}
{"level":30,"time":1794952310424,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:41579","remoteAddress":"127.0.0.1","remotePort":59154},"msg":"incoming request"}
{"level":30,"time":1794952310426,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6509999999999536,"msg":"request completed"}
{"level":30,"time":1794952310426,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43129","remoteAddress":"127.0.0.1","remotePort":59434},"msg":"incoming request"}
{"level":30,"time":1794952310427,"pid":170594,"hostname":"pivota-sandbox-b8875590","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8851980000000026,"msg":"request completed"}
{"level":30,"time":1794952310669,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:38883","remoteAddress":"127.0.0.1","remotePort":34494},"msg":"incoming request"}
{"level":30,"time":1794952310682,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":12.288895999999994,"msg":"request completed"}
{"level":30,"time":1794952310684,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea/submit-review","host":"127.0.0.1:34465","remoteAddress":"127.0.0.1","remotePort":43752},"msg":"incoming request"}
{"level":30,"time":1794952310689,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":4.338752000000028,"msg":"request completed"}
{"level":30,"time":1794952310692,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea/review","host":"127.0.0.1:39373","remoteAddress":"127.0.0.1","remotePort":40022},"msg":"incoming request"}
{"level":30,"time":1794952310694,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":403},"responseTime":2.1018980000000056,"msg":"request completed"}
{"level":30,"time":1794952310695,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea","host":"127.0.0.1:46179","remoteAddress":"127.0.0.1","remotePort":54434},"msg":"incoming request"}
{"level":30,"time":1794952310697,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":1.934112999999968,"msg":"request completed"}
{"level":30,"time":1794952310698,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea/review","host":"127.0.0.1:37823","remoteAddress":"127.0.0.1","remotePort":33174},"msg":"incoming request"}
{"level":30,"time":1794952310701,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":3.346642999999972,"msg":"request completed"}
{"level":30,"time":1794952310702,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea","host":"127.0.0.1:38063","remoteAddress":"127.0.0.1","remotePort":45354},"msg":"incoming request"}
{"level":30,"time":1794952310704,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7171339999999873,"msg":"request completed"}
{"level":30,"time":1794952310704,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea/sections/b35ce3b2-b1ab-4fcd-82c9-2bfb75178424/link-tasks","host":"127.0.0.1:38235","remoteAddress":"127.0.0.1","remotePort":53830},"msg":"incoming request"}
{"level":30,"time":1794952310706,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":204},"responseTime":1.7110930000000053,"msg":"request completed"}
{"level":30,"time":1794952310707,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea","host":"127.0.0.1:45591","remoteAddress":"127.0.0.1","remotePort":42236},"msg":"incoming request"}
{"level":30,"time":1794952310709,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6707870000000185,"msg":"request completed"}
{"level":30,"time":1794952310710,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42521","remoteAddress":"127.0.0.1","remotePort":51586},"msg":"incoming request"}
{"level":30,"time":1794952310719,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":201},"responseTime":8.817747999999995,"msg":"request completed"}
{"level":30,"time":1794952310719,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/47aa4fdd-3188-4da9-8477-cb587fd983ea/materialize-tasks","host":"127.0.0.1:40703","remoteAddress":"127.0.0.1","remotePort":37980},"msg":"incoming request"}
{"level":30,"time":1794952310722,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":200},"responseTime":2.8679520000000025,"msg":"request completed"}
{"level":30,"time":1794952310724,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=51ecdb50-20a9-4f3d-b2b8-5f956b36ca09","host":"127.0.0.1:35099","remoteAddress":"127.0.0.1","remotePort":49810},"msg":"incoming request"}
{"level":30,"time":1794952310726,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":200},"responseTime":1.8905710000000227,"msg":"request completed"}
{"level":30,"time":1794952310727,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:44635","remoteAddress":"127.0.0.1","remotePort":53748},"msg":"incoming request"}
{"level":30,"time":1794952310729,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":201},"responseTime":2.460894000000053,"msg":"request completed"}
{"level":30,"time":1794952310730,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/6779950c-1a81-44c6-95bc-7bee843497aa/review","host":"127.0.0.1:45993","remoteAddress":"127.0.0.1","remotePort":50890},"msg":"incoming request"}
{"level":30,"time":1794952310732,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":409},"responseTime":1.9960790000000088,"msg":"request completed"}
{"level":30,"time":1794952310733,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46225","remoteAddress":"127.0.0.1","remotePort":44198},"msg":"incoming request"}
{"level":30,"time":1794952310735,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":201},"responseTime":2.360525999999993,"msg":"request completed"}
{"level":30,"time":1794952310736,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/e27f92d3-eb93-41fb-ae7e-bcb18f4fd1ca/submit-review","host":"127.0.0.1:34121","remoteAddress":"127.0.0.1","remotePort":49642},"msg":"incoming request"}
{"level":30,"time":1794952310738,"pid":170623,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","res":{"statusCode":422},"responseTime":1.6208520000000135,"msg":"request completed"}
{"level":30,"time":1794952310995,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44065","remoteAddress":"127.0.0.1","remotePort":59186},"msg":"incoming request"}
{"level":30,"time":1794952311011,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":15.728704000000022,"msg":"request completed"}
{"level":30,"time":1794952311014,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/activation","host":"127.0.0.1:41649","remoteAddress":"127.0.0.1","remotePort":59144},"msg":"incoming request"}
{"level":30,"time":1794952311016,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":422},"responseTime":2.738948999999991,"msg":"request completed"}
{"level":30,"time":1794952311017,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4","host":"127.0.0.1:39433","remoteAddress":"127.0.0.1","remotePort":39966},"msg":"incoming request"}
{"level":30,"time":1794952311020,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":200},"responseTime":2.95159000000001,"msg":"request completed"}
{"level":30,"time":1794952311021,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/command-roles","host":"127.0.0.1:40729","remoteAddress":"127.0.0.1","remotePort":48788},"msg":"incoming request"}
{"level":30,"time":1794952311024,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":201},"responseTime":2.6260259999999676,"msg":"request completed"}
{"level":30,"time":1794952311025,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/activation","host":"127.0.0.1:36971","remoteAddress":"127.0.0.1","remotePort":58044},"msg":"incoming request"}
{"level":30,"time":1794952311028,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":3.1357659999999896,"msg":"request completed"}
{"level":30,"time":1794952311030,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/timeline","host":"127.0.0.1:40083","remoteAddress":"127.0.0.1","remotePort":47708},"msg":"incoming request"}
{"level":30,"time":1794952311033,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":2.286266000000012,"msg":"request completed"}
{"level":30,"time":1794952311035,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/activation","host":"127.0.0.1:42453","remoteAddress":"127.0.0.1","remotePort":51206},"msg":"incoming request"}
{"level":30,"time":1794952311036,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":400},"responseTime":1.1748939999999948,"msg":"request completed"}
{"level":30,"time":1794952311037,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4","host":"127.0.0.1:36465","remoteAddress":"127.0.0.1","remotePort":42268},"msg":"incoming request"}
{"level":30,"time":1794952311039,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":2.3840299999999957,"msg":"request completed"}
{"level":30,"time":1794952311040,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/command-roles","host":"127.0.0.1:44801","remoteAddress":"127.0.0.1","remotePort":42430},"msg":"incoming request"}
{"level":30,"time":1794952311042,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":201},"responseTime":2.529975000000036,"msg":"request completed"}
{"level":30,"time":1794952311044,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/timeline","host":"127.0.0.1:37305","remoteAddress":"127.0.0.1","remotePort":52442},"msg":"incoming request"}
{"level":30,"time":1794952311046,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":200},"responseTime":1.9054289999999696,"msg":"request completed"}
{"level":30,"time":1794952311047,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/closure","host":"127.0.0.1:32957","remoteAddress":"127.0.0.1","remotePort":58630},"msg":"incoming request"}
{"level":30,"time":1794952311050,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":200},"responseTime":3.74875099999997,"msg":"request completed"}
{"level":30,"time":1794952311051,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/7901fc3f-5af9-4962-bde0-b86ba2fd95a4/timeline","host":"127.0.0.1:40411","remoteAddress":"127.0.0.1","remotePort":54398},"msg":"incoming request"}
{"level":30,"time":1794952311053,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":200},"responseTime":1.9071220000000153,"msg":"request completed"}
{"level":30,"time":1794952311055,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38129","remoteAddress":"127.0.0.1","remotePort":47386},"msg":"incoming request"}
{"level":30,"time":1794952311058,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":201},"responseTime":3.298423000000014,"msg":"request completed"}
{"level":30,"time":1794952311059,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/0d2a833e-9d6b-4f7d-b2f8-f1d59ec8d235/command-roles","host":"127.0.0.1:36821","remoteAddress":"127.0.0.1","remotePort":58064},"msg":"incoming request"}
{"level":30,"time":1794952311061,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":201},"responseTime":2.2795429999999897,"msg":"request completed"}
{"level":30,"time":1794952311062,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/0d2a833e-9d6b-4f7d-b2f8-f1d59ec8d235/command-roles","host":"127.0.0.1:39075","remoteAddress":"127.0.0.1","remotePort":49218},"msg":"incoming request"}
{"level":30,"time":1794952311064,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-f","res":{"statusCode":201},"responseTime":2.019734000000028,"msg":"request completed"}
{"level":30,"time":1794952311065,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/0d2a833e-9d6b-4f7d-b2f8-f1d59ec8d235/timeline","host":"127.0.0.1:37109","remoteAddress":"127.0.0.1","remotePort":41758},"msg":"incoming request"}
{"level":30,"time":1794952311066,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7680609999999888,"msg":"request completed"}
{"level":30,"time":1794952311068,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39057","remoteAddress":"127.0.0.1","remotePort":55294},"msg":"incoming request"}
{"level":30,"time":1794952311071,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-h","res":{"statusCode":201},"responseTime":2.644019999999955,"msg":"request completed"}
{"level":30,"time":1794952311071,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/67a9690c-a7a6-44ea-84c6-ad3a42a33609/activation","host":"127.0.0.1:45571","remoteAddress":"127.0.0.1","remotePort":37338},"msg":"incoming request"}
{"level":30,"time":1794952311073,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-i","res":{"statusCode":404},"responseTime":1.3257370000000037,"msg":"request completed"}
{"level":30,"time":1794952311074,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/67a9690c-a7a6-44ea-84c6-ad3a42a33609/command-roles","host":"127.0.0.1:34839","remoteAddress":"127.0.0.1","remotePort":50200},"msg":"incoming request"}
{"level":30,"time":1794952311075,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-j","res":{"statusCode":404},"responseTime":1.0952230000000327,"msg":"request completed"}
{"level":30,"time":1794952311075,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/67a9690c-a7a6-44ea-84c6-ad3a42a33609/closure","host":"127.0.0.1:39555","remoteAddress":"127.0.0.1","remotePort":49428},"msg":"incoming request"}
{"level":30,"time":1794952311077,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-k","res":{"statusCode":404},"responseTime":1.0811760000000277,"msg":"request completed"}
{"level":30,"time":1794952311077,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/67a9690c-a7a6-44ea-84c6-ad3a42a33609/activation","host":"127.0.0.1:33539","remoteAddress":"127.0.0.1","remotePort":49114},"msg":"incoming request"}
{"level":30,"time":1794952311079,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-l","res":{"statusCode":200},"responseTime":2.1643569999999954,"msg":"request completed"}
{"level":30,"time":1794952311080,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43081","remoteAddress":"127.0.0.1","remotePort":58570},"msg":"incoming request"}
{"level":30,"time":1794952311083,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-m","res":{"statusCode":201},"responseTime":2.732887000000005,"msg":"request completed"}
{"level":30,"time":1794952311084,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/1086bd91-9444-4a78-91dd-644d97ba0955/closure","host":"127.0.0.1:40447","remoteAddress":"127.0.0.1","remotePort":35514},"msg":"incoming request"}
{"level":30,"time":1794952311087,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-n","res":{"statusCode":200},"responseTime":3.0196070000000077,"msg":"request completed"}
{"level":30,"time":1794952311087,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/1086bd91-9444-4a78-91dd-644d97ba0955/closure","host":"127.0.0.1:35693","remoteAddress":"127.0.0.1","remotePort":33628},"msg":"incoming request"}
{"level":30,"time":1794952311090,"pid":170689,"hostname":"pivota-sandbox-b8875590","reqId":"req-o","res":{"statusCode":409},"responseTime":2.0664529999999672,"msg":"request completed"}
{"level":30,"time":1794952311331,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42935","remoteAddress":"127.0.0.1","remotePort":46794},"msg":"incoming request"}
{"level":30,"time":1794952311335,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":422},"responseTime":4.239235000000008,"msg":"request completed"}
{"level":30,"time":1794952311339,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39609","remoteAddress":"127.0.0.1","remotePort":56834},"msg":"incoming request"}
{"level":30,"time":1794952311341,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":422},"responseTime":2.128860000000003,"msg":"request completed"}
{"level":30,"time":1794952311342,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36451","remoteAddress":"127.0.0.1","remotePort":37728},"msg":"incoming request"}
{"level":30,"time":1794952311347,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":201},"responseTime":4.360422999999997,"msg":"request completed"}
{"level":30,"time":1794952311348,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45489","remoteAddress":"127.0.0.1","remotePort":45132},"msg":"incoming request"}
{"level":30,"time":1794952311357,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":201},"responseTime":9.498771000000033,"msg":"request completed"}
{"level":30,"time":1794952311358,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41057","remoteAddress":"127.0.0.1","remotePort":34980},"msg":"incoming request"}
{"level":30,"time":1794952311361,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":201},"responseTime":2.494047000000023,"msg":"request completed"}
{"level":30,"time":1794952311363,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/07d5513d-e1c1-4964-8da6-bc4d729fdcea/timeline","host":"127.0.0.1:32833","remoteAddress":"127.0.0.1","remotePort":39240},"msg":"incoming request"}
{"level":30,"time":1794952311366,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3200899999999933,"msg":"request completed"}
{"level":30,"time":1794952311367,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36617","remoteAddress":"127.0.0.1","remotePort":34836},"msg":"incoming request"}
{"level":30,"time":1794952311369,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":201},"responseTime":1.8581099999999537,"msg":"request completed"}
{"level":30,"time":1794952311370,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/30eef310-7880-43ba-a782-f08d53355e7b/status","host":"127.0.0.1:43843","remoteAddress":"127.0.0.1","remotePort":47332},"msg":"incoming request"}
{"level":30,"time":1794952311371,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":409},"responseTime":1.5579140000000393,"msg":"request completed"}
{"level":30,"time":1794952311372,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42717","remoteAddress":"127.0.0.1","remotePort":41542},"msg":"incoming request"}
{"level":30,"time":1794952311375,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":201},"responseTime":2.2358820000000037,"msg":"request completed"}
{"level":30,"time":1794952311376,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/879fdf6d-0691-4cd6-b999-193c89c07bfd/status","host":"127.0.0.1:36349","remoteAddress":"127.0.0.1","remotePort":60434},"msg":"incoming request"}
{"level":30,"time":1794952311377,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":409},"responseTime":1.5790839999999662,"msg":"request completed"}
{"level":30,"time":1794952311378,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/879fdf6d-0691-4cd6-b999-193c89c07bfd/status","host":"127.0.0.1:36483","remoteAddress":"127.0.0.1","remotePort":34866},"msg":"incoming request"}
{"level":30,"time":1794952311380,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":200},"responseTime":2.2262130000000298,"msg":"request completed"}
{"level":30,"time":1794952311381,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/879fdf6d-0691-4cd6-b999-193c89c07bfd/status","host":"127.0.0.1:40715","remoteAddress":"127.0.0.1","remotePort":33604},"msg":"incoming request"}
{"level":30,"time":1794952311383,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":409},"responseTime":1.3258570000000418,"msg":"request completed"}
{"level":30,"time":1794952311383,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/879fdf6d-0691-4cd6-b999-193c89c07bfd/status","host":"127.0.0.1:46149","remoteAddress":"127.0.0.1","remotePort":50708},"msg":"incoming request"}
{"level":30,"time":1794952311385,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":200},"responseTime":2.06698300000005,"msg":"request completed"}
{"level":30,"time":1794952311386,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/879fdf6d-0691-4cd6-b999-193c89c07bfd/status","host":"127.0.0.1:38139","remoteAddress":"127.0.0.1","remotePort":34092},"msg":"incoming request"}
{"level":30,"time":1794952311388,"pid":170699,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":200},"responseTime":1.8727979999999889,"msg":"request completed"}
{"level":30,"time":1794952311631,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37429","remoteAddress":"127.0.0.1","remotePort":54046},"msg":"incoming request"}
{"level":30,"time":1794952311659,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":28.33672200000001,"msg":"request completed"}
{"level":30,"time":1794952311662,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:40039","remoteAddress":"127.0.0.1","remotePort":44202},"msg":"incoming request"}
{"level":30,"time":1794952311665,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":2.5651320000000055,"msg":"request completed"}
{"level":30,"time":1794952311666,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:41745","remoteAddress":"127.0.0.1","remotePort":54656},"msg":"incoming request"}
{"level":30,"time":1794952311667,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":400},"responseTime":1.4487700000000245,"msg":"request completed"}
{"level":30,"time":1794952311668,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:44185","remoteAddress":"127.0.0.1","remotePort":38356},"msg":"incoming request"}
{"level":30,"time":1794952311672,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":201},"responseTime":3.6484120000000075,"msg":"request completed"}
{"level":30,"time":1794952311674,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/d9a3deb3-aba3-4eac-896b-44756a5fee6b/revoke","host":"127.0.0.1:44321","remoteAddress":"127.0.0.1","remotePort":51840},"msg":"incoming request"}
{"level":30,"time":1794952311676,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":204},"responseTime":2.439374999999984,"msg":"request completed"}
{"level":30,"time":1794952311678,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:39033","remoteAddress":"127.0.0.1","remotePort":49128},"msg":"incoming request"}
{"level":30,"time":1794952311680,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9216900000000123,"msg":"request completed"}
{"level":30,"time":1794952311681,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43027","remoteAddress":"127.0.0.1","remotePort":45068},"msg":"incoming request"}
{"level":30,"time":1794952311682,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5785830000000374,"msg":"request completed"}
{"level":30,"time":1794952311684,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44309","remoteAddress":"127.0.0.1","remotePort":48312},"msg":"incoming request"}
{"level":30,"time":1794952311687,"pid":170709,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":2.953421999999989,"msg":"request completed"}
{"level":30,"time":1794952311932,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:46333","remoteAddress":"127.0.0.1","remotePort":51662},"msg":"incoming request"}
{"level":30,"time":1794952311938,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":5.448872999999992,"msg":"request completed"}
{"level":30,"time":1794952311941,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:45995","remoteAddress":"127.0.0.1","remotePort":32778},"msg":"incoming request"}
{"level":30,"time":1794952311945,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":4.396501000000001,"msg":"request completed"}
{"level":30,"time":1794952311948,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44497","remoteAddress":"127.0.0.1","remotePort":47266},"msg":"incoming request"}
{"level":30,"time":1794952311950,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":200},"responseTime":2.159688000000017,"msg":"request completed"}
{"level":30,"time":1794952311951,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/48b3cbb2-c37f-4b60-a0c3-71d829deb593","host":"127.0.0.1:38911","remoteAddress":"127.0.0.1","remotePort":57120},"msg":"incoming request"}
{"level":30,"time":1794952311954,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":2.623841999999968,"msg":"request completed"}
{"level":30,"time":1794952311955,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46141","remoteAddress":"127.0.0.1","remotePort":41878},"msg":"incoming request"}
{"level":30,"time":1794952311955,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":401},"responseTime":0.4493559999999661,"msg":"request completed"}
{"level":30,"time":1794952311956,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:34087","remoteAddress":"127.0.0.1","remotePort":39418},"msg":"incoming request"}
{"level":30,"time":1794952311958,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":403},"responseTime":1.0941809999999919,"msg":"request completed"}
{"level":30,"time":1794952311959,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/1cfb7e61-0abf-40df-90b5-44d155ab9288","host":"127.0.0.1:39803","remoteAddress":"127.0.0.1","remotePort":48392},"msg":"incoming request"}
{"level":30,"time":1794952311962,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":3.4806959999999663,"msg":"request completed"}
{"level":30,"time":1794952311963,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37715","remoteAddress":"127.0.0.1","remotePort":36280},"msg":"incoming request"}
{"level":30,"time":1794952311966,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5251559999999813,"msg":"request completed"}
{"level":30,"time":1794952311967,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=904f45d7-7073-48f3-b072-25cf23035c3a&page_size=50","host":"127.0.0.1:44587","remoteAddress":"127.0.0.1","remotePort":47832},"msg":"incoming request"}
{"level":30,"time":1794952311968,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5635750000000144,"msg":"request completed"}
{"level":30,"time":1794952311970,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:46845","remoteAddress":"127.0.0.1","remotePort":53896},"msg":"incoming request"}
{"level":30,"time":1794952311971,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-a","res":{"statusCode":403},"responseTime":1.1272129999999834,"msg":"request completed"}
{"level":30,"time":1794952311972,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:37007","remoteAddress":"127.0.0.1","remotePort":54238},"msg":"incoming request"}
{"level":30,"time":1794952311973,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-b","res":{"statusCode":200},"responseTime":1.3725350000000276,"msg":"request completed"}
{"level":30,"time":1794952311974,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:40465","remoteAddress":"127.0.0.1","remotePort":36082},"msg":"incoming request"}
{"level":30,"time":1794952311976,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-c","res":{"statusCode":422},"responseTime":1.6967559999999935,"msg":"request completed"}
{"level":30,"time":1794952311977,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42889","remoteAddress":"127.0.0.1","remotePort":49496},"msg":"incoming request"}
{"level":30,"time":1794952311978,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-d","res":{"statusCode":200},"responseTime":1.4861190000000306,"msg":"request completed"}
{"level":30,"time":1794952311979,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=904f45d7-7073-48f3-b072-25cf23035c3a&action_type=record_view","host":"127.0.0.1:33269","remoteAddress":"127.0.0.1","remotePort":44016},"msg":"incoming request"}
{"level":30,"time":1794952311981,"pid":170719,"hostname":"pivota-sandbox-b8875590","reqId":"req-e","res":{"statusCode":200},"responseTime":1.4083820000000173,"msg":"request completed"}
{"level":30,"time":1794952312223,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44471","remoteAddress":"127.0.0.1","remotePort":51320},"msg":"incoming request"}
{"level":30,"time":1794952312236,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":13.144067000000007,"msg":"request completed"}
{"level":30,"time":1794952312239,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40917","remoteAddress":"127.0.0.1","remotePort":32832},"msg":"incoming request"}
{"level":30,"time":1794952312243,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":201},"responseTime":3.5333750000000066,"msg":"request completed"}
{"level":30,"time":1794952312244,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:41825","remoteAddress":"127.0.0.1","remotePort":32938},"msg":"incoming request"}
{"level":30,"time":1794952312247,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":200},"responseTime":3.1459560000000124,"msg":"request completed"}
{"level":30,"time":1794952312249,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40719","remoteAddress":"127.0.0.1","remotePort":56236},"msg":"incoming request"}
{"level":30,"time":1794952312251,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":201},"responseTime":2.82019200000002,"msg":"request completed"}
{"level":30,"time":1794952312253,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:33853","remoteAddress":"127.0.0.1","remotePort":59936},"msg":"incoming request"}
{"level":30,"time":1794952312254,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6329660000000104,"msg":"request completed"}
{"level":30,"time":1794952312256,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:41975","remoteAddress":"127.0.0.1","remotePort":55410},"msg":"incoming request"}
{"level":30,"time":1794952312257,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":200},"responseTime":1.5368040000000178,"msg":"request completed"}
{"level":30,"time":1794952312260,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:45095","remoteAddress":"127.0.0.1","remotePort":43462},"msg":"incoming request"}
{"level":30,"time":1794952312261,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6942710000000147,"msg":"request completed"}
{"level":30,"time":1794952312263,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:35175","remoteAddress":"127.0.0.1","remotePort":56296},"msg":"incoming request"}
{"level":30,"time":1794952312264,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8435819999999694,"msg":"request completed"}
{"level":30,"time":1794952312265,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:40049","remoteAddress":"127.0.0.1","remotePort":49130},"msg":"incoming request"}
{"level":30,"time":1794952312267,"pid":170729,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5694460000000277,"msg":"request completed"}
{"level":30,"time":1794952312512,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37907","remoteAddress":"127.0.0.1","remotePort":46530},"msg":"incoming request"}
{"level":30,"time":1794952312526,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":13.435506000000004,"msg":"request completed"}
{"level":30,"time":1794952312532,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/326747a5-0ed4-4418-baef-1bfbb90991c2/timeline","host":"127.0.0.1:39163","remoteAddress":"127.0.0.1","remotePort":57788},"msg":"incoming request"}
{"level":30,"time":1794952312535,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":2.8764380000000074,"msg":"request completed"}
{"level":30,"time":1794952312540,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35669","remoteAddress":"127.0.0.1","remotePort":37880},"msg":"incoming request"}
{"level":30,"time":1794952312543,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":201},"responseTime":2.9136480000000233,"msg":"request completed"}
{"level":30,"time":1794952312544,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/003524be-6eb6-404c-92fa-366e3e2378fd/closure","host":"127.0.0.1:33645","remoteAddress":"127.0.0.1","remotePort":47182},"msg":"incoming request"}
{"level":30,"time":1794952312547,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":3.126198000000045,"msg":"request completed"}
{"level":30,"time":1794952312549,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/003524be-6eb6-404c-92fa-366e3e2378fd/timeline","host":"127.0.0.1:38131","remoteAddress":"127.0.0.1","remotePort":44324},"msg":"incoming request"}
{"level":30,"time":1794952312551,"pid":170739,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5587960000000294,"msg":"request completed"}
{"level":30,"time":1794952312793,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33463","remoteAddress":"127.0.0.1","remotePort":48022},"msg":"incoming request"}
{"level":30,"time":1794952312798,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":200},"responseTime":4.604162000000002,"msg":"request completed"}
{"level":30,"time":1794952312801,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45855","remoteAddress":"127.0.0.1","remotePort":57392},"msg":"incoming request"}
{"level":30,"time":1794952312801,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":401},"responseTime":0.17075099999999566,"msg":"request completed"}
{"level":30,"time":1794952312802,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:43519","remoteAddress":"127.0.0.1","remotePort":59574},"msg":"incoming request"}
{"level":30,"time":1794952312805,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":200},"responseTime":2.4532299999999907,"msg":"request completed"}
{"level":30,"time":1794952312806,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35003","remoteAddress":"127.0.0.1","remotePort":53030},"msg":"incoming request"}
{"level":30,"time":1794952312808,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":2.147986000000003,"msg":"request completed"}
{"level":30,"time":1794952312810,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43617","remoteAddress":"127.0.0.1","remotePort":41504},"msg":"incoming request"}
{"level":30,"time":1794952312812,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":2.396895000000029,"msg":"request completed"}
{"level":30,"time":1794952312814,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38089","remoteAddress":"127.0.0.1","remotePort":46688},"msg":"incoming request"}
{"level":30,"time":1794952312814,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":401},"responseTime":0.5727180000000089,"msg":"request completed"}
{"level":30,"time":1794952312816,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:34847","remoteAddress":"127.0.0.1","remotePort":51136},"msg":"incoming request"}
{"level":30,"time":1794952312820,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":3.5499469999999747,"msg":"request completed"}
{"level":30,"time":1794952312821,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42767","remoteAddress":"127.0.0.1","remotePort":54776},"msg":"incoming request"}
{"level":30,"time":1794952312822,"pid":170767,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0007950000000392,"msg":"request completed"}

 Test Files  11 passed (11)
      Tests  55 passed (55)
   Start at  21:51:49
   Duration  3.70s (transform 123ms, setup 31ms, import 1.50s, tests 1.58s, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 68[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 157[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 132[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 170[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 102[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m46 passed[39m[22m[90m (46)[39m
[2m   Start at [22m 21:51:53
[2m   Duration [22m 1.70s[2m (transform 180ms, setup 172ms, collect 571ms, tests 629ms, environment 1.05s, prepare 122ms)[22m
```


## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=0 build_cmd=[npm run build] test_cmd=[npm test] head=85e91aff1db6569259a13579cfbe4835e27d6b02 test_files=28 skip_marks=0 shadow_files=0 untested=0
{"level":30,"time":1794953688565,"pid":232153,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":1.684301000000005,"msg":"request completed"}
{"level":30,"time":1794953688567,"pid":232153,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:45673","remoteAddress":"127.0.0.1","remotePort":38768},"msg":"incoming request"}
{"level":30,"time":1794953688569,"pid":232153,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9471750000000156,"msg":"request completed"}
{"level":30,"time":1794953688569,"pid":232153,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:39045","remoteAddress":"127.0.0.1","remotePort":49802},"msg":"incoming request"}
{"level":30,"time":1794953688571,"pid":232153,"hostname":"pivota-sandbox-b8875590","reqId":"req-9","res":{"statusCode":200},"responseTime":1.49063799999999,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/operating-picture.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 106[2mms[22m[39m
{"level":30,"time":1794953688816,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38321","remoteAddress":"127.0.0.1","remotePort":43936},"msg":"incoming request"}
{"level":30,"time":1794953688831,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":201},"responseTime":14.746403000000015,"msg":"request completed"}
{"level":30,"time":1794953688838,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/4437ec1b-6082-4574-bce5-45cfd592814b/timeline","host":"127.0.0.1:41367","remoteAddress":"127.0.0.1","remotePort":50260},"msg":"incoming request"}
{"level":30,"time":1794953688842,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":200},"responseTime":4.439413999999999,"msg":"request completed"}
{"level":30,"time":1794953688847,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35225","remoteAddress":"127.0.0.1","remotePort":56042},"msg":"incoming request"}
{"level":30,"time":1794953688851,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":201},"responseTime":3.537080000000003,"msg":"request completed"}
{"level":30,"time":1794953688852,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/1dc7d2da-3d80-446b-92c4-dcd7a141a2df/closure","host":"127.0.0.1:45533","remoteAddress":"127.0.0.1","remotePort":51610},"msg":"incoming request"}
{"level":30,"time":1794953688856,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":4.044783000000052,"msg":"request completed"}
{"level":30,"time":1794953688858,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/1dc7d2da-3d80-446b-92c4-dcd7a141a2df/timeline","host":"127.0.0.1:43215","remoteAddress":"127.0.0.1","remotePort":40308},"msg":"incoming request"}
{"level":30,"time":1794953688860,"pid":232163,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":2.142201,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/overdue-sweep.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 104[2mms[22m[39m
{"level":30,"time":1794953689097,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40383","remoteAddress":"127.0.0.1","remotePort":33076},"msg":"incoming request"}
{"level":30,"time":1794953689102,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-1","res":{"statusCode":200},"responseTime":5.078262999999993,"msg":"request completed"}
{"level":30,"time":1794953689105,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40711","remoteAddress":"127.0.0.1","remotePort":49760},"msg":"incoming request"}
{"level":30,"time":1794953689105,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18596900000000005,"msg":"request completed"}
{"level":30,"time":1794953689107,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:40885","remoteAddress":"127.0.0.1","remotePort":43380},"msg":"incoming request"}
{"level":30,"time":1794953689110,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6741799999999785,"msg":"request completed"}
{"level":30,"time":1794953689110,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39665","remoteAddress":"127.0.0.1","remotePort":34206},"msg":"incoming request"}
{"level":30,"time":1794953689112,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-4","res":{"statusCode":200},"responseTime":1.618719000000027,"msg":"request completed"}
{"level":30,"time":1794953689113,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39243","remoteAddress":"127.0.0.1","remotePort":60062},"msg":"incoming request"}
{"level":30,"time":1794953689116,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-5","res":{"statusCode":200},"responseTime":2.6748019999999997,"msg":"request completed"}
{"level":30,"time":1794953689117,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39279","remoteAddress":"127.0.0.1","remotePort":40474},"msg":"incoming request"}
{"level":30,"time":1794953689117,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4168529999999748,"msg":"request completed"}
{"level":30,"time":1794953689119,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:44213","remoteAddress":"127.0.0.1","remotePort":47926},"msg":"incoming request"}
{"level":30,"time":1794953689120,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-7","res":{"statusCode":200},"responseTime":1.512709000000001,"msg":"request completed"}
{"level":30,"time":1794953689122,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:34009","remoteAddress":"127.0.0.1","remotePort":46182},"msg":"incoming request"}
{"level":30,"time":1794953689123,"pid":232191,"hostname":"pivota-sandbox-b8875590","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9947480000000155,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/routes.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 81[2mms[22m[39m

[2m Test Files [22m [1m[32m11 passed[39m[22m[90m (11)[39m
[2m      Tests [22m [1m[32m55 passed[39m[22m[90m (55)[39m
[2m   Start at [22m 22:14:45
[2m   Duration [22m 3.79s[2m (transform 123ms, setup 29ms, import 1.55s, tests 1.62s, environment 0ms)[22m

```
