---
phase: 03
gate_status: passed
build_command: "npm run build"
test_command: "npm test"
last_updated: 2026-11-17T13:41:00Z
tests_disabled_during_fixes: none
shadowed_sources: 0
waves:
  - wave: 1
    build: pass
    tests: pass
    fix_attempts: 0
  - wave: 2
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

