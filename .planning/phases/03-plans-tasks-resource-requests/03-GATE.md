---
phase: 03
gate_status: passed
build_command: "npm run build"
test_command: "npm test"
last_updated: 2026-11-17T13:32:22Z
tests_disabled_during_fixes: none
shadowed_sources: 0
waves:
  - wave: 1
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

