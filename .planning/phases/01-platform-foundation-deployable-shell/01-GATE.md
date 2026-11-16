---
phase: 01
gate_status: passed
build_command: "npm run build -w backend; (cd frontend/design-system && npm run build)"
test_command: "npm test -w backend; (cd frontend/design-system && npm test)"
last_updated: 2026-11-16T03:45:44Z
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
  - wave: 3
    build: pass
    tests: pass
    fix_attempts: 0
---

## Wave 1

- Build: `npm run build -w backend; (cd frontend/design-system && npm run build)` → pass
- Tests: `npm test -w backend; (cd frontend/design-system && npm test)` → pass
- Fix attempts: 0/3

### Gate output

```
[gate] wave 1 build: rc=0; npm run build -w backend || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; exit $rc

> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 25 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 6.43 kB[22m[1m[22m[2m │ gzip: 1.46 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m38.23 kB[22m[1m[22m[2m │ gzip: 9.72 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m 6.43 kB[22m[1m[22m[2m │ gzip: 1.46 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m24.99 kB[22m[1m[22m[2m │ gzip: 8.51 kB[22m
[32m✓ built in 97ms[39m
[gate] wave 1 tests: rc=0; npm test -w backend || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc

> @epmp/backend@0.1.0 test
> echo "no tests yet" && exit 0

no tests yet

> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 87[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m23 passed[39m[22m[90m (23)[39m
[2m   Start at [22m 03:06:54
[2m   Duration [22m 400ms[2m (transform 53ms, setup 22ms, collect 80ms, tests 87ms, environment 134ms, prepare 24ms)[22m
```

## Wave 2

- Build: `npm run build -w backend; (cd frontend/design-system && npm run build)` → pass
- Tests: `npm test -w backend; (cd frontend/design-system && npm test)` → pass
- Fix attempts: 0/3 — backend routes.test.ts requires live docker-compose stack (db/nats/opa) + DATABASE_URL etc exported; first attempt failed with ECONNREFUSED before starting docker compose up -d db nats opa keycloak + migrate + seed. Re-ran with services up: 6/6 pass.

### Gate output

```
[gate] wave 2 build: rc=0; npm run build -w backend || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; exit $rc

> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 57 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m27.32 kB[22m[1m[22m[2m │ gzip:  4.12 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m75.22 kB[22m[1m[22m[2m │ gzip: 17.94 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m27.32 kB[22m[1m[22m[2m │ gzip:  4.12 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m48.78 kB[22m[1m[22m[2m │ gzip: 15.36 kB[22m
[32m✓ built in 156ms[39m
[gate] wave 2 tests: rc=0; npm test -w backend || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

 ❯ src/modules/auth-org/routes.test.ts (6 tests | 6 skipped) 10ms

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/modules/auth-org/routes.test.ts [ src/modules/auth-org/routes.test.ts ]
Error: connect ECONNREFUSED ::1:5432
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/2]⎯

 FAIL  src/modules/auth-org/routes.test.ts [ src/modules/auth-org/routes.test.ts ]
Error: connect ECONNREFUSED 127.0.0.1:5432
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  6 skipped (6)
   Start at  03:21:54
   Duration  192ms (transform 29ms, setup 0ms, import 127ms, tests 10ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path /home/daytona/project/backend
npm error workspace @epmp/backend@0.1.0
npm error location /home/daytona/project/backend
npm error command failed
npm error command sh -c vitest run

> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 70[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 114[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 183[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 99[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m40 passed[39m[22m[90m (40)[39m
[2m   Start at [22m 03:21:54
[2m   Duration [22m 1.40s[2m (transform 106ms, setup 111ms, collect 397ms, tests 466ms, environment 656ms, prepare 126ms)[22m

[gate] wave 2 tests (retry with live services): rc=0; npm test -w backend || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794799380221,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44757","remoteAddress":"127.0.0.1","remotePort":32986},"msg":"incoming request"}
{"level":30,"time":1794799380226,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","res":{"statusCode":200},"responseTime":4.600187000000005,"msg":"request completed"}
{"level":30,"time":1794799380229,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39599","remoteAddress":"127.0.0.1","remotePort":43168},"msg":"incoming request"}
{"level":30,"time":1794799380229,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","res":{"statusCode":401},"responseTime":0.10454699999999661,"msg":"request completed"}
{"level":30,"time":1794799380230,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:34945","remoteAddress":"127.0.0.1","remotePort":38848},"msg":"incoming request"}
{"level":30,"time":1794799380233,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","res":{"statusCode":200},"responseTime":2.444135000000017,"msg":"request completed"}
{"level":30,"time":1794799380234,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44851","remoteAddress":"127.0.0.1","remotePort":56716},"msg":"incoming request"}
{"level":30,"time":1794799380235,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","res":{"statusCode":200},"responseTime":1.6325390000000084,"msg":"request completed"}
{"level":30,"time":1794799380236,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36271","remoteAddress":"127.0.0.1","remotePort":52980},"msg":"incoming request"}
{"level":30,"time":1794799380239,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2248730000000023,"msg":"request completed"}
{"level":30,"time":1794799380240,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46003","remoteAddress":"127.0.0.1","remotePort":58316},"msg":"incoming request"}
{"level":30,"time":1794799380240,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","res":{"statusCode":401},"responseTime":0.3488659999999868,"msg":"request completed"}
{"level":30,"time":1794799380241,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:43817","remoteAddress":"127.0.0.1","remotePort":40534},"msg":"incoming request"}
{"level":30,"time":1794799380242,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","res":{"statusCode":200},"responseTime":1.2787040000000047,"msg":"request completed"}
{"level":30,"time":1794799380244,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:37905","remoteAddress":"127.0.0.1","remotePort":52374},"msg":"incoming request"}
{"level":30,"time":1794799380245,"pid":79673,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","res":{"statusCode":401},"responseTime":0.8751650000000097,"msg":"request completed"}

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Start at  03:23:00
   Duration  231ms (transform 29ms, setup 0ms, import 123ms, tests 55ms, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 50[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 129[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 152[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 107[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m40 passed[39m[22m[90m (40)[39m
[2m   Start at [22m 03:23:00
[2m   Duration [22m 1.39s[2m (transform 141ms, setup 90ms, collect 444ms, tests 439ms, environment 679ms, prepare 94ms)[22m
```

## Wave 3

- Build: `npm run build -w backend; (cd frontend/design-system && npm run build)` → pass
- Tests: `npm test -w backend; (cd frontend/design-system && npm test)` → pass
- Fix attempts: 0/3

### Gate output

```
[gate] wave 3 build: rc=0; npm run build -w backend || rc=$?; (cd frontend/design-system && npm run build) || rc=$?; exit $rc

> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 57 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m27.32 kB[22m[1m[22m[2m │ gzip:  4.12 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m75.22 kB[22m[1m[22m[2m │ gzip: 17.94 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m27.32 kB[22m[1m[22m[2m │ gzip:  4.12 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m48.78 kB[22m[1m[22m[2m │ gzip: 15.36 kB[22m
[32m✓ built in 154ms[39m
[gate] wave 3 tests: rc=0; npm test -w backend || rc=$?; (cd frontend/design-system && npm test) || rc=$?; exit $rc

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794800733234,"pid":145748,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:33441","remoteAddress":"127.0.0.1","remotePort":47438},"msg":"incoming request"}
{"level":30,"time":1794800733281,"pid":145748,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","res":{"statusCode":201},"responseTime":47.03133100000002,"msg":"request completed"}
{"level":30,"time":1794800733487,"pid":145748,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:33887","remoteAddress":"127.0.0.1","remotePort":33974},"msg":"incoming request"}
{"level":30,"time":1794800733490,"pid":145748,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7122209999999995,"msg":"request completed"}
{"level":30,"time":1794800733705,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:35983","remoteAddress":"127.0.0.1","remotePort":35636},"msg":"incoming request"}
{"level":30,"time":1794800733734,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","res":{"statusCode":201},"responseTime":28.440584,"msg":"request completed"}
{"level":30,"time":1794800733737,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:44697","remoteAddress":"127.0.0.1","remotePort":60356},"msg":"incoming request"}
{"level":30,"time":1794800733739,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","res":{"statusCode":200},"responseTime":2.6649419999999964,"msg":"request completed"}
{"level":30,"time":1794800733741,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:41239","remoteAddress":"127.0.0.1","remotePort":60750},"msg":"incoming request"}
{"level":30,"time":1794800733742,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","res":{"statusCode":400},"responseTime":1.4991240000000232,"msg":"request completed"}
{"level":30,"time":1794800733743,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:46645","remoteAddress":"127.0.0.1","remotePort":52272},"msg":"incoming request"}
{"level":30,"time":1794800733746,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","res":{"statusCode":201},"responseTime":2.9334560000000067,"msg":"request completed"}
{"level":30,"time":1794800733748,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/aaaaa847-039a-4e48-95e7-492810e619a2/revoke","host":"127.0.0.1:33119","remoteAddress":"127.0.0.1","remotePort":38180},"msg":"incoming request"}
{"level":30,"time":1794800733751,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","res":{"statusCode":204},"responseTime":2.495353999999992,"msg":"request completed"}
{"level":30,"time":1794800733752,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43067","remoteAddress":"127.0.0.1","remotePort":33534},"msg":"incoming request"}
{"level":30,"time":1794800733754,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9705490000000054,"msg":"request completed"}
{"level":30,"time":1794800733755,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:45691","remoteAddress":"127.0.0.1","remotePort":48718},"msg":"incoming request"}
{"level":30,"time":1794800733757,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4003979999999956,"msg":"request completed"}
{"level":30,"time":1794800733758,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40747","remoteAddress":"127.0.0.1","remotePort":54108},"msg":"incoming request"}
{"level":30,"time":1794800733760,"pid":145797,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8605319999999779,"msg":"request completed"}
{"level":30,"time":1794800733975,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:36251","remoteAddress":"127.0.0.1","remotePort":51062},"msg":"incoming request"}
{"level":30,"time":1794800733980,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","res":{"statusCode":201},"responseTime":5.389386000000002,"msg":"request completed"}
{"level":30,"time":1794800733983,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:36419","remoteAddress":"127.0.0.1","remotePort":50480},"msg":"incoming request"}
{"level":30,"time":1794800733986,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","res":{"statusCode":200},"responseTime":3.170571999999993,"msg":"request completed"}
{"level":30,"time":1794800733987,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44145","remoteAddress":"127.0.0.1","remotePort":53594},"msg":"incoming request"}
{"level":30,"time":1794800733989,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","res":{"statusCode":200},"responseTime":1.986237999999986,"msg":"request completed"}
{"level":30,"time":1794800733990,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/2edcebf1-6b05-41c6-8c9d-8f55715f366c","host":"127.0.0.1:45637","remoteAddress":"127.0.0.1","remotePort":48192},"msg":"incoming request"}
{"level":30,"time":1794800733993,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","res":{"statusCode":200},"responseTime":2.3063689999999895,"msg":"request completed"}
{"level":30,"time":1794800733993,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43537","remoteAddress":"127.0.0.1","remotePort":33156},"msg":"incoming request"}
{"level":30,"time":1794800733994,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","res":{"statusCode":401},"responseTime":0.43830299999999056,"msg":"request completed"}
{"level":30,"time":1794800733995,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42807","remoteAddress":"127.0.0.1","remotePort":57824},"msg":"incoming request"}
{"level":30,"time":1794800733996,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","res":{"statusCode":403},"responseTime":0.992984000000007,"msg":"request completed"}
{"level":30,"time":1794800733997,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/55e2f1c2-e284-42b4-abc8-7702946746e9","host":"127.0.0.1:41729","remoteAddress":"127.0.0.1","remotePort":51018},"msg":"incoming request"}
{"level":30,"time":1794800734000,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","res":{"statusCode":200},"responseTime":3.071575999999993,"msg":"request completed"}
{"level":30,"time":1794800734001,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:33129","remoteAddress":"127.0.0.1","remotePort":51986},"msg":"incoming request"}
{"level":30,"time":1794800734004,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5101310000000012,"msg":"request completed"}
{"level":30,"time":1794800734005,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=ea3f654b-da14-4f17-9000-cbd86dbe488c&page_size=50","host":"127.0.0.1:38185","remoteAddress":"127.0.0.1","remotePort":56772},"msg":"incoming request"}
{"level":30,"time":1794800734006,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-9","res":{"statusCode":200},"responseTime":1.524440999999996,"msg":"request completed"}
{"level":30,"time":1794800734008,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37595","remoteAddress":"127.0.0.1","remotePort":36440},"msg":"incoming request"}
{"level":30,"time":1794800734009,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-a","res":{"statusCode":403},"responseTime":1.099995000000007,"msg":"request completed"}
{"level":30,"time":1794800734010,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:33079","remoteAddress":"127.0.0.1","remotePort":53162},"msg":"incoming request"}
{"level":30,"time":1794800734011,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-b","res":{"statusCode":200},"responseTime":1.3536600000000192,"msg":"request completed"}
{"level":30,"time":1794800734012,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:44617","remoteAddress":"127.0.0.1","remotePort":40198},"msg":"incoming request"}
{"level":30,"time":1794800734014,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-c","res":{"statusCode":422},"responseTime":1.6593049999999891,"msg":"request completed"}
{"level":30,"time":1794800734014,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:35675","remoteAddress":"127.0.0.1","remotePort":42288},"msg":"incoming request"}
{"level":30,"time":1794800734016,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-d","res":{"statusCode":200},"responseTime":1.4819209999999998,"msg":"request completed"}
{"level":30,"time":1794800734017,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=ea3f654b-da14-4f17-9000-cbd86dbe488c&action_type=record_view","host":"127.0.0.1:41229","remoteAddress":"127.0.0.1","remotePort":47956},"msg":"incoming request"}
{"level":30,"time":1794800734018,"pid":145831,"hostname":"pivota-sandbox-35551bf5","reqId":"req-e","res":{"statusCode":200},"responseTime":1.4220189999999775,"msg":"request completed"}
{"level":30,"time":1794800734226,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46413","remoteAddress":"127.0.0.1","remotePort":54682},"msg":"incoming request"}
{"level":30,"time":1794800734231,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-1","res":{"statusCode":200},"responseTime":4.882294999999999,"msg":"request completed"}
{"level":30,"time":1794800734234,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40705","remoteAddress":"127.0.0.1","remotePort":50604},"msg":"incoming request"}
{"level":30,"time":1794800734234,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-2","res":{"statusCode":401},"responseTime":0.17933700000000385,"msg":"request completed"}
{"level":30,"time":1794800734235,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:34439","remoteAddress":"127.0.0.1","remotePort":52458},"msg":"incoming request"}
{"level":30,"time":1794800734238,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-3","res":{"statusCode":200},"responseTime":2.572088999999977,"msg":"request completed"}
{"level":30,"time":1794800734239,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36893","remoteAddress":"127.0.0.1","remotePort":39008},"msg":"incoming request"}
{"level":30,"time":1794800734241,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7404070000000047,"msg":"request completed"}
{"level":30,"time":1794800734242,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39475","remoteAddress":"127.0.0.1","remotePort":49302},"msg":"incoming request"}
{"level":30,"time":1794800734243,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-5","res":{"statusCode":200},"responseTime":1.45356799999999,"msg":"request completed"}
{"level":30,"time":1794800734244,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38561","remoteAddress":"127.0.0.1","remotePort":60002},"msg":"incoming request"}
{"level":30,"time":1794800734245,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-6","res":{"statusCode":401},"responseTime":0.42823400000000333,"msg":"request completed"}
{"level":30,"time":1794800734246,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:40993","remoteAddress":"127.0.0.1","remotePort":58012},"msg":"incoming request"}
{"level":30,"time":1794800734247,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-7","res":{"statusCode":200},"responseTime":1.2549459999999897,"msg":"request completed"}
{"level":30,"time":1794800734249,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:44751","remoteAddress":"127.0.0.1","remotePort":42410},"msg":"incoming request"}
{"level":30,"time":1794800734250,"pid":145841,"hostname":"pivota-sandbox-35551bf5","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0333289999999806,"msg":"request completed"}

 Test Files  4 passed (4)
      Tests  22 passed (22)
   Start at  03:45:32
   Duration  1.33s (transform 66ms, setup 0ms, import 534ms, tests 583ms, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 58[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 108[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 159[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 114[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m40 passed[39m[22m[90m (40)[39m
[2m   Start at [22m 03:45:34
[2m   Duration [22m 1.42s[2m (transform 258ms, setup 75ms, collect 480ms, tests 439ms, environment 678ms, prepare 121ms)[22m
```

