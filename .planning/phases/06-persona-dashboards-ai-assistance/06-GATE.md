---
phase: 06
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-19T12:26:47Z
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

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

### Gate output

```
> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 81 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 39.21 kB[22m[1m[22m[2m │ gzip:  5.72 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m109.52 kB[22m[1m[22m[2m │ gzip: 24.80 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m39.21 kB[22m[1m[22m[2m │ gzip:  5.72 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m69.06 kB[22m[1m[22m[2m │ gzip: 20.65 kB[22m
[32m✓ built in 175ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 153 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mregisterSW.js              [39m[1m[2m  0.13 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest       [39m[1m[2m  0.32 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.55 kB[22m[1m[22m[2m │ gzip:   0.87 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-CD_vJSGO.css  [39m[1m[2m 53.57 kB[22m[1m[22m[2m │ gzip:   8.58 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-Div60X0n.js   [39m[1m[33m503.32 kB[39m[22m[2m │ gzip: 144.16 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 766ms[39m

PWA v0.21.2
mode      generateSW
precache  7 entries (545.62 KiB)
files generated
  dist/sw.js
  dist/workbox-ee9d8b34.js

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1795090630273,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:32847","remoteAddress":"127.0.0.1","remotePort":47780},"msg":"incoming request"}
{"level":30,"time":1795090630274,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40417","remoteAddress":"127.0.0.1","remotePort":46242},"msg":"incoming request"}
{"level":30,"time":1795090630282,"pid":42593,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:44709","remoteAddress":"127.0.0.1","remotePort":32892},"msg":"incoming request"}
{"level":30,"time":1795090630287,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":13.413939000000028,"msg":"request completed"}
{"level":30,"time":1795090630290,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d/submit-review","host":"127.0.0.1:35387","remoteAddress":"127.0.0.1","remotePort":57338},"msg":"incoming request"}
{"level":30,"time":1795090630296,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":6.017875000000004,"msg":"request completed"}
{"level":30,"time":1795090630299,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d/review","host":"127.0.0.1:44713","remoteAddress":"127.0.0.1","remotePort":41266},"msg":"incoming request"}
{"level":30,"time":1795090630302,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":403},"responseTime":3.4628450000000157,"msg":"request completed"}
{"level":30,"time":1795090630304,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d","host":"127.0.0.1:33465","remoteAddress":"127.0.0.1","remotePort":56264},"msg":"incoming request"}
{"level":30,"time":1795090630304,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":31.041301999999973,"msg":"request completed"}
{"level":30,"time":1795090630306,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":2.556553000000008,"msg":"request completed"}
{"level":30,"time":1795090630307,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:40967","remoteAddress":"127.0.0.1","remotePort":48344},"msg":"incoming request"}
{"level":30,"time":1795090630307,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d/review","host":"127.0.0.1:33829","remoteAddress":"127.0.0.1","remotePort":58740},"msg":"incoming request"}
{"level":30,"time":1795090630310,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":2.8487010000000055,"msg":"request completed"}
{"level":30,"time":1795090630312,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:41397","remoteAddress":"127.0.0.1","remotePort":42072},"msg":"incoming request"}
{"level":30,"time":1795090630312,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":4.529980000000023,"msg":"request completed"}
{"level":30,"time":1795090630313,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d","host":"127.0.0.1:43703","remoteAddress":"127.0.0.1","remotePort":35758},"msg":"incoming request"}
{"level":30,"time":1795090630314,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":400},"responseTime":1.6896239999999807,"msg":"request completed"}
{"level":30,"time":1795090630315,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:33325","remoteAddress":"127.0.0.1","remotePort":35012},"msg":"incoming request"}
{"level":30,"time":1795090630315,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.0657899999999927,"msg":"request completed"}
{"level":30,"time":1795090630316,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d/sections/ad62ce3a-7a88-407c-9861-e8651db27de2/link-tasks","host":"127.0.0.1:45269","remoteAddress":"127.0.0.1","remotePort":34394},"msg":"incoming request"}
{"level":30,"time":1795090630318,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":3.0481459999999743,"msg":"request completed"}
{"level":30,"time":1795090630319,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":204},"responseTime":2.1843339999999785,"msg":"request completed"}
{"level":30,"time":1795090630320,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/a678ce43-e53e-4658-b043-2508d2d7d122/revoke","host":"127.0.0.1:39329","remoteAddress":"127.0.0.1","remotePort":59244},"msg":"incoming request"}
{"level":30,"time":1795090630320,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d","host":"127.0.0.1:35733","remoteAddress":"127.0.0.1","remotePort":44386},"msg":"incoming request"}
{"level":30,"time":1795090630322,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.331088999999963,"msg":"request completed"}
{"level":30,"time":1795090630322,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":204},"responseTime":2.8170709999999985,"msg":"request completed"}
{"level":30,"time":1795090630323,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41915","remoteAddress":"127.0.0.1","remotePort":34438},"msg":"incoming request"}
{"level":30,"time":1795090630335,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35441","remoteAddress":"127.0.0.1","remotePort":58860},"msg":"incoming request"}
{"level":30,"time":1795090630338,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.371515000000045,"msg":"request completed"}
{"level":30,"time":1795090630339,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40701","remoteAddress":"127.0.0.1","remotePort":58922},"msg":"incoming request"}
{"level":30,"time":1795090630341,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.0546190000000024,"msg":"request completed"}
{"level":30,"time":1795090630342,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:32825","remoteAddress":"127.0.0.1","remotePort":47052},"msg":"incoming request"}
{"level":30,"time":1795090630345,"pid":42594,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.6969159999999874,"msg":"request completed"}
{"level":30,"time":1795090630345,"pid":42593,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":62.440045999999995,"msg":"request completed"}
{"level":30,"time":1795090630346,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":22.72244599999999,"msg":"request completed"}
{"level":30,"time":1795090630347,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/92dcdaff-07d5-4a7a-940f-312821b4286d/materialize-tasks","host":"127.0.0.1:34623","remoteAddress":"127.0.0.1","remotePort":37136},"msg":"incoming request"}
{"level":30,"time":1795090630352,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":4.693476999999973,"msg":"request completed"}
{"level":30,"time":1795090630354,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=97694789-2182-4dae-b2ac-35b616958faa","host":"127.0.0.1:42879","remoteAddress":"127.0.0.1","remotePort":58434},"msg":"incoming request"}
{"level":30,"time":1795090630357,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.7823869999999715,"msg":"request completed"}
{"level":30,"time":1795090630358,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:36693","remoteAddress":"127.0.0.1","remotePort":36594},"msg":"incoming request"}
{"level":30,"time":1795090630361,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":201},"responseTime":2.6554590000000076,"msg":"request completed"}
{"level":30,"time":1795090630362,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/254a652e-7f41-44c7-91a6-3bde72c1aec1/review","host":"127.0.0.1:44549","remoteAddress":"127.0.0.1","remotePort":56350},"msg":"incoming request"}
{"level":30,"time":1795090630363,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":409},"responseTime":1.7392370000000028,"msg":"request completed"}
{"level":30,"time":1795090630364,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46589","remoteAddress":"127.0.0.1","remotePort":57678},"msg":"incoming request"}
{"level":30,"time":1795090630366,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":2.0272079999999733,"msg":"request completed"}
{"level":30,"time":1795090630367,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/fe66229f-d5bb-40ac-8a1f-b1588f011153/submit-review","host":"127.0.0.1:43247","remoteAddress":"127.0.0.1","remotePort":33910},"msg":"incoming request"}
{"level":30,"time":1795090630369,"pid":42595,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":422},"responseTime":1.6644260000000486,"msg":"request completed"}
{"level":30,"time":1795090630552,"pid":42593,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:34493","remoteAddress":"127.0.0.1","remotePort":57172},"msg":"incoming request"}
{"level":30,"time":1795090630556,"pid":42593,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":3.5272360000000162,"msg":"request completed"}
{"level":30,"time":1795090630610,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:38019","remoteAddress":"127.0.0.1","remotePort":51160},"msg":"incoming request"}
{"level":30,"time":1795090630618,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":422},"responseTime":6.757875000000013,"msg":"request completed"}
{"level":30,"time":1795090630621,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:42485","remoteAddress":"127.0.0.1","remotePort":44368},"msg":"incoming request"}
{"level":30,"time":1795090630624,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":2.9834639999999695,"msg":"request completed"}
{"level":30,"time":1795090630625,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36371","remoteAddress":"127.0.0.1","remotePort":50104},"msg":"incoming request"}
{"level":30,"time":1795090630634,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45499","remoteAddress":"127.0.0.1","remotePort":55704},"msg":"incoming request"}
{"level":30,"time":1795090630639,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":13.329219000000023,"msg":"request completed"}
{"level":30,"time":1795090630640,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:41939","remoteAddress":"127.0.0.1","remotePort":35270},"msg":"incoming request"}
{"level":30,"time":1795090630649,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":9.530473000000029,"msg":"request completed"}
{"level":30,"time":1795090630651,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/c7a5c894-d64c-496c-b801-4ac380610e44/send","host":"127.0.0.1:41633","remoteAddress":"127.0.0.1","remotePort":47006},"msg":"incoming request"}
{"level":30,"time":1795090630651,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":16.378277000000026,"msg":"request completed"}
{"level":30,"time":1795090630653,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":403},"responseTime":2.0944750000000454,"msg":"request completed"}
{"level":30,"time":1795090630654,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41167","remoteAddress":"127.0.0.1","remotePort":42644},"msg":"incoming request"}
{"level":30,"time":1795090630654,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/c7a5c894-d64c-496c-b801-4ac380610e44/send","host":"127.0.0.1:40977","remoteAddress":"127.0.0.1","remotePort":35234},"msg":"incoming request"}
{"level":30,"time":1795090630658,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.3207370000000083,"msg":"request completed"}
{"level":30,"time":1795090630659,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":4.262196000000017,"msg":"request completed"}
{"level":30,"time":1795090630659,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/1f129321-f72b-4e36-9353-cd8df33f8f22/timeline","host":"127.0.0.1:41135","remoteAddress":"127.0.0.1","remotePort":41744},"msg":"incoming request"}
{"level":30,"time":1795090630660,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:37791","remoteAddress":"127.0.0.1","remotePort":38572},"msg":"incoming request"}
{"level":30,"time":1795090630675,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":15.40365700000001,"msg":"request completed"}
{"level":30,"time":1795090630676,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/c7a5c894-d64c-496c-b801-4ac380610e44/delivery-status","host":"127.0.0.1:35263","remoteAddress":"127.0.0.1","remotePort":42124},"msg":"incoming request"}
{"level":30,"time":1795090630677,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":17.402230999999972,"msg":"request completed"}
{"level":30,"time":1795090630679,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.6625119999999924,"msg":"request completed"}
{"level":30,"time":1795090630679,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38421","remoteAddress":"127.0.0.1","remotePort":37452},"msg":"incoming request"}
{"level":30,"time":1795090630681,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:39903","remoteAddress":"127.0.0.1","remotePort":53968},"msg":"incoming request"}
{"level":30,"time":1795090630682,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":1.8142280000000142,"msg":"request completed"}
{"level":30,"time":1795090630683,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":3.388004999999964,"msg":"request completed"}
{"level":30,"time":1795090630683,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:41749","remoteAddress":"127.0.0.1","remotePort":46312},"msg":"incoming request"}
{"level":30,"time":1795090630685,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:32871","remoteAddress":"127.0.0.1","remotePort":46118},"msg":"incoming request"}
{"level":30,"time":1795090630686,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":2.3452350000000024,"msg":"request completed"}
{"level":30,"time":1795090630687,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.064768000000015,"msg":"request completed"}
{"level":30,"time":1795090630687,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:42533","remoteAddress":"127.0.0.1","remotePort":56268},"msg":"incoming request"}
{"level":30,"time":1795090630688,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:37505","remoteAddress":"127.0.0.1","remotePort":55830},"msg":"incoming request"}
{"level":30,"time":1795090630690,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8771560000000136,"msg":"request completed"}
{"level":30,"time":1795090630691,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":201},"responseTime":4.1619589999999675,"msg":"request completed"}
{"level":30,"time":1795090630691,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41983","remoteAddress":"127.0.0.1","remotePort":45692},"msg":"incoming request"}
{"level":30,"time":1795090630692,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/cee713fd-f0c7-4a7d-b3d2-d007e9341671/send","host":"127.0.0.1:39739","remoteAddress":"127.0.0.1","remotePort":33964},"msg":"incoming request"}
{"level":30,"time":1795090630693,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9560039999999503,"msg":"request completed"}
{"level":30,"time":1795090630694,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":400},"responseTime":2.1288090000000466,"msg":"request completed"}
{"level":30,"time":1795090630694,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:34239","remoteAddress":"127.0.0.1","remotePort":56648},"msg":"incoming request"}
{"level":30,"time":1795090630695,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/3980736d-f37f-4038-93f9-aef65981e7fa/approve","host":"127.0.0.1:44835","remoteAddress":"127.0.0.1","remotePort":48656},"msg":"incoming request"}
{"level":30,"time":1795090630697,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2534129999999664,"msg":"request completed"}
{"level":30,"time":1795090630698,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.064469000000031,"msg":"request completed"}
{"level":30,"time":1795090630698,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45019","remoteAddress":"127.0.0.1","remotePort":54152},"msg":"incoming request"}
{"level":30,"time":1795090630698,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/cee713fd-f0c7-4a7d-b3d2-d007e9341671/send","host":"127.0.0.1:38553","remoteAddress":"127.0.0.1","remotePort":46552},"msg":"incoming request"}
{"level":30,"time":1795090630700,"pid":42682,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9045380000000023,"msg":"request completed"}
{"level":30,"time":1795090630701,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":2.4608330000000365,"msg":"request completed"}
{"level":30,"time":1795090630705,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:46327","remoteAddress":"127.0.0.1","remotePort":59496},"msg":"incoming request"}
{"level":30,"time":1795090630707,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":1.6407619999999952,"msg":"request completed"}
{"level":30,"time":1795090630708,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:41617","remoteAddress":"127.0.0.1","remotePort":49506},"msg":"incoming request"}
{"level":30,"time":1795090630711,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":3.568484000000012,"msg":"request completed"}
{"level":30,"time":1795090630712,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/7e0d98b7-db9b-422d-a16e-b57987646047/send","host":"127.0.0.1:33405","remoteAddress":"127.0.0.1","remotePort":48466},"msg":"incoming request"}
{"level":30,"time":1795090630715,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":2.4567349999999806,"msg":"request completed"}
{"level":30,"time":1795090630716,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35595","remoteAddress":"127.0.0.1","remotePort":44546},"msg":"incoming request"}
{"level":30,"time":1795090630719,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":3.6222739999999476,"msg":"request completed"}
{"level":30,"time":1795090630720,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/17d668ff-bc82-4acb-9e15-27d6e2b10cbb/send","host":"127.0.0.1:45901","remoteAddress":"127.0.0.1","remotePort":42902},"msg":"incoming request"}
{"level":30,"time":1795090630721,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":403},"responseTime":1.046275000000037,"msg":"request completed"}
{"level":30,"time":1795090630723,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:46423","remoteAddress":"127.0.0.1","remotePort":38186},"msg":"incoming request"}
{"level":30,"time":1795090630725,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":2.1085009999999897,"msg":"request completed"}
{"level":30,"time":1795090630725,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35803","remoteAddress":"127.0.0.1","remotePort":44066},"msg":"incoming request"}
{"level":30,"time":1795090630727,"pid":42670,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":403},"responseTime":1.097451000000035,"msg":"request completed"}
{"level":30,"time":1795090630884,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:46309","remoteAddress":"127.0.0.1","remotePort":51504},"msg":"incoming request"}
{"level":30,"time":1795090630945,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":60.94275299999998,"msg":"request completed"}
{"level":30,"time":1795090630949,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37415","remoteAddress":"127.0.0.1","remotePort":34512},"msg":"incoming request"}
{"level":30,"time":1795090630960,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":11.342897999999991,"msg":"request completed"}
{"level":30,"time":1795090630961,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38291","remoteAddress":"127.0.0.1","remotePort":45176},"msg":"incoming request"}
{"level":30,"time":1795090630965,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":4.125560000000007,"msg":"request completed"}
{"level":30,"time":1795090630976,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/b36290ec-5eed-4d14-bfc2-9350ea120daa/decline","host":"127.0.0.1:45479","remoteAddress":"127.0.0.1","remotePort":36864},"msg":"incoming request"}
{"level":30,"time":1795090630977,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":422},"responseTime":1.6015990000000215,"msg":"request completed"}
{"level":30,"time":1795090630979,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=4920d280-8164-4218-ae75-63df650759f0","host":"127.0.0.1:34439","remoteAddress":"127.0.0.1","remotePort":50220},"msg":"incoming request"}
{"level":30,"time":1795090630981,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.4958179999999857,"msg":"request completed"}
{"level":30,"time":1795090630982,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/b36290ec-5eed-4d14-bfc2-9350ea120daa/decline","host":"127.0.0.1:38373","remoteAddress":"127.0.0.1","remotePort":42502},"msg":"incoming request"}
{"level":30,"time":1795090630986,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.4753479999999968,"msg":"request completed"}
{"level":30,"time":1795090630987,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/4920d280-8164-4218-ae75-63df650759f0/timeline","host":"127.0.0.1:44543","remoteAddress":"127.0.0.1","remotePort":35472},"msg":"incoming request"}
{"level":30,"time":1795090630989,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.2531420000000253,"msg":"request completed"}
{"level":30,"time":1795090630991,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41285","remoteAddress":"127.0.0.1","remotePort":53976},"msg":"incoming request"}
{"level":30,"time":1795090630996,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":4.357354999999984,"msg":"request completed"}
{"level":30,"time":1795090630997,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35893","remoteAddress":"127.0.0.1","remotePort":52276},"msg":"incoming request"}
{"level":30,"time":1795090631001,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":4.39823199999995,"msg":"request completed"}
{"level":30,"time":1795090631003,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/fd2f0b8b-8620-4af3-a69b-5a8b3c5c2f8e/approve","host":"127.0.0.1:33545","remoteAddress":"127.0.0.1","remotePort":48834},"msg":"incoming request"}
{"level":30,"time":1795090631008,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":4.662568999999962,"msg":"request completed"}
{"level":30,"time":1795090631009,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/fd2f0b8b-8620-4af3-a69b-5a8b3c5c2f8e/fulfill","host":"127.0.0.1:44571","remoteAddress":"127.0.0.1","remotePort":46522},"msg":"incoming request"}
{"level":30,"time":1795090631012,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.6471429999999714,"msg":"request completed"}
{"level":30,"time":1795090631013,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/fd2f0b8b-8620-4af3-a69b-5a8b3c5c2f8e/fulfill","host":"127.0.0.1:44799","remoteAddress":"127.0.0.1","remotePort":34142},"msg":"incoming request"}
{"level":30,"time":1795090631017,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":4.009241000000031,"msg":"request completed"}
{"level":30,"time":1795090631019,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/5af7b062-79cf-407e-a864-1cb4ed115935/timeline","host":"127.0.0.1:37795","remoteAddress":"127.0.0.1","remotePort":43212},"msg":"incoming request"}
{"level":30,"time":1795090631021,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.1123779999999783,"msg":"request completed"}
{"level":30,"time":1795090631034,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39165","remoteAddress":"127.0.0.1","remotePort":45696},"msg":"incoming request"}
{"level":30,"time":1795090631039,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":200},"responseTime":5.055025999999998,"msg":"request completed"}
{"level":30,"time":1795090631042,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37257","remoteAddress":"127.0.0.1","remotePort":57822},"msg":"incoming request"}
{"level":30,"time":1795090631042,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":401},"responseTime":0.21241900000001124,"msg":"request completed"}
{"level":30,"time":1795090631044,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:36917","remoteAddress":"127.0.0.1","remotePort":54420},"msg":"incoming request"}
{"level":30,"time":1795090631047,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":3.000417000000027,"msg":"request completed"}
{"level":30,"time":1795090631048,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43143","remoteAddress":"127.0.0.1","remotePort":57184},"msg":"incoming request"}
{"level":30,"time":1795090631050,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":1.922140000000013,"msg":"request completed"}
{"level":30,"time":1795090631051,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46883","remoteAddress":"127.0.0.1","remotePort":55770},"msg":"incoming request"}
{"level":30,"time":1795090631053,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":1.809759999999983,"msg":"request completed"}
{"level":30,"time":1795090631054,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39233","remoteAddress":"127.0.0.1","remotePort":40048},"msg":"incoming request"}
{"level":30,"time":1795090631054,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":401},"responseTime":0.45384200000000874,"msg":"request completed"}
{"level":30,"time":1795090631055,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46831","remoteAddress":"127.0.0.1","remotePort":36092},"msg":"incoming request"}
{"level":30,"time":1795090631056,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:41299","remoteAddress":"127.0.0.1","remotePort":42884},"msg":"incoming request"}
{"level":30,"time":1795090631058,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":1.7865249999999833,"msg":"request completed"}
{"level":30,"time":1795090631059,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":422},"responseTime":4.253059999999948,"msg":"request completed"}
{"level":30,"time":1795090631061,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:36779","remoteAddress":"127.0.0.1","remotePort":36054},"msg":"incoming request"}
{"level":30,"time":1795090631062,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":1.4848690000000033,"msg":"request completed"}
{"level":30,"time":1795090631063,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36081","remoteAddress":"127.0.0.1","remotePort":59272},"msg":"incoming request"}
{"level":30,"time":1795090631064,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":422},"responseTime":1.722144999999955,"msg":"request completed"}
{"level":30,"time":1795090631065,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41693","remoteAddress":"127.0.0.1","remotePort":41414},"msg":"incoming request"}
{"level":30,"time":1795090631065,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42369","remoteAddress":"127.0.0.1","remotePort":53042},"msg":"incoming request"}
{"level":30,"time":1795090631067,"pid":42707,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":401},"responseTime":1.0723749999999654,"msg":"request completed"}
{"level":30,"time":1795090631069,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":3.8577769999999987,"msg":"request completed"}
{"level":30,"time":1795090631071,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38509","remoteAddress":"127.0.0.1","remotePort":59048},"msg":"incoming request"}
{"level":30,"time":1795090631081,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":10.232011,"msg":"request completed"}
{"level":30,"time":1795090631082,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34517","remoteAddress":"127.0.0.1","remotePort":43222},"msg":"incoming request"}
{"level":30,"time":1795090631085,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":201},"responseTime":2.5830419999999776,"msg":"request completed"}
{"level":30,"time":1795090631085,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/7b5a98c5-cf50-477d-934b-537a3addf88c/timeline","host":"127.0.0.1:45663","remoteAddress":"127.0.0.1","remotePort":50328},"msg":"incoming request"}
{"level":30,"time":1795090631088,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.163244999999961,"msg":"request completed"}
{"level":30,"time":1795090631089,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37761","remoteAddress":"127.0.0.1","remotePort":52488},"msg":"incoming request"}
{"level":30,"time":1795090631091,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":1.9256679999999733,"msg":"request completed"}
{"level":30,"time":1795090631092,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/f95dd340-d508-47fd-be1f-b06de5fdaaf7/status","host":"127.0.0.1:45585","remoteAddress":"127.0.0.1","remotePort":56854},"msg":"incoming request"}
{"level":30,"time":1795090631094,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":409},"responseTime":2.178442999999959,"msg":"request completed"}
{"level":30,"time":1795090631096,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37365","remoteAddress":"127.0.0.1","remotePort":54206},"msg":"incoming request"}
{"level":30,"time":1795090631099,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.92112800000001,"msg":"request completed"}
{"level":30,"time":1795090631100,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/332e9d0b-1a0e-4726-ade5-1a6ae5ee1169/status","host":"127.0.0.1:38801","remoteAddress":"127.0.0.1","remotePort":49204},"msg":"incoming request"}
{"level":30,"time":1795090631102,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":409},"responseTime":1.8314009999999712,"msg":"request completed"}
{"level":30,"time":1795090631103,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/332e9d0b-1a0e-4726-ade5-1a6ae5ee1169/status","host":"127.0.0.1:45335","remoteAddress":"127.0.0.1","remotePort":60672},"msg":"incoming request"}
{"level":30,"time":1795090631106,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.5589969999999767,"msg":"request completed"}
{"level":30,"time":1795090631106,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/332e9d0b-1a0e-4726-ade5-1a6ae5ee1169/status","host":"127.0.0.1:40671","remoteAddress":"127.0.0.1","remotePort":34252},"msg":"incoming request"}
{"level":30,"time":1795090631108,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":409},"responseTime":1.6266559999999686,"msg":"request completed"}
{"level":30,"time":1795090631109,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/332e9d0b-1a0e-4726-ade5-1a6ae5ee1169/status","host":"127.0.0.1:39047","remoteAddress":"127.0.0.1","remotePort":48712},"msg":"incoming request"}
{"level":30,"time":1795090631111,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.491911000000016,"msg":"request completed"}
{"level":30,"time":1795090631112,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/332e9d0b-1a0e-4726-ade5-1a6ae5ee1169/status","host":"127.0.0.1:45991","remoteAddress":"127.0.0.1","remotePort":36518},"msg":"incoming request"}
{"level":30,"time":1795090631114,"pid":42718,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":2.0348920000000135,"msg":"request completed"}
{"level":30,"time":1795090631224,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38663","remoteAddress":"127.0.0.1","remotePort":60530},"msg":"incoming request"}
{"level":30,"time":1795090631228,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":4.70595000000003,"msg":"request completed"}
{"level":30,"time":1795090631230,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:33393","remoteAddress":"127.0.0.1","remotePort":35382},"msg":"incoming request"}
{"level":30,"time":1795090631232,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":422},"responseTime":1.8164130000000114,"msg":"request completed"}
{"level":30,"time":1795090631234,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38815","remoteAddress":"127.0.0.1","remotePort":40334},"msg":"incoming request"}
{"level":30,"time":1795090631238,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":4.004092000000014,"msg":"request completed"}
{"level":30,"time":1795090631239,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40181","remoteAddress":"127.0.0.1","remotePort":55316},"msg":"incoming request"}
{"level":30,"time":1795090631242,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":3.3950580000000627,"msg":"request completed"}
{"level":30,"time":1795090631244,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/3b13d0f9-4879-4848-8e3a-9c75464787ee/fulfill","host":"127.0.0.1:41719","remoteAddress":"127.0.0.1","remotePort":32908},"msg":"incoming request"}
{"level":30,"time":1795090631246,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":409},"responseTime":2.131795000000011,"msg":"request completed"}
{"level":30,"time":1795090631247,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/3b13d0f9-4879-4848-8e3a-9c75464787ee/approve","host":"127.0.0.1:43243","remoteAddress":"127.0.0.1","remotePort":48138},"msg":"incoming request"}
{"level":30,"time":1795090631249,"pid":42693,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":409},"responseTime":1.4757020000000693,"msg":"request completed"}
{"level":30,"time":1795090631355,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36581","remoteAddress":"127.0.0.1","remotePort":37548},"msg":"incoming request"}
{"level":30,"time":1795090631384,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":28.923163999999986,"msg":"request completed"}
{"level":30,"time":1795090631387,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/06c8a27a-4e68-4fa7-8dee-79bc2321e681/timeline","host":"127.0.0.1:37863","remoteAddress":"127.0.0.1","remotePort":58602},"msg":"incoming request"}
{"level":30,"time":1795090631390,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":3.094772999999975,"msg":"request completed"}
{"level":30,"time":1795090631392,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41715","remoteAddress":"127.0.0.1","remotePort":47910},"msg":"incoming request"}
{"level":30,"time":1795090631396,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":3.548225000000002,"msg":"request completed"}
{"level":30,"time":1795090631397,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34625","remoteAddress":"127.0.0.1","remotePort":34114},"msg":"incoming request"}
{"level":30,"time":1795090631398,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":409},"responseTime":1.569037000000037,"msg":"request completed"}
{"level":30,"time":1795090631399,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45507","remoteAddress":"127.0.0.1","remotePort":50850},"msg":"incoming request"}
{"level":30,"time":1795090631402,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":201},"responseTime":2.9063599999999497,"msg":"request completed"}
{"level":30,"time":1795090631404,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42449","remoteAddress":"127.0.0.1","remotePort":58240},"msg":"incoming request"}
{"level":30,"time":1795090631407,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":201},"responseTime":3.045029999999997,"msg":"request completed"}
{"level":30,"time":1795090631408,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37059","remoteAddress":"127.0.0.1","remotePort":57914},"msg":"incoming request"}
{"level":30,"time":1795090631411,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":2.6602379999999926,"msg":"request completed"}
{"level":30,"time":1795090631411,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46083","remoteAddress":"127.0.0.1","remotePort":40452},"msg":"incoming request"}
{"level":30,"time":1795090631411,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:44379","remoteAddress":"127.0.0.1","remotePort":40064},"msg":"incoming request"}
{"level":30,"time":1795090631415,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":3.1097819999999956,"msg":"request completed"}
{"level":30,"time":1795090631416,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:36521","remoteAddress":"127.0.0.1","remotePort":52960},"msg":"incoming request"}
{"level":30,"time":1795090631418,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":2.1736530000000016,"msg":"request completed"}
{"level":30,"time":1795090631418,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":6.564600999999982,"msg":"request completed"}
{"level":30,"time":1795090631420,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42883","remoteAddress":"127.0.0.1","remotePort":39530},"msg":"incoming request"}
{"level":30,"time":1795090631422,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:35337","remoteAddress":"127.0.0.1","remotePort":49606},"msg":"incoming request"}
{"level":30,"time":1795090631424,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":3.3040169999999875,"msg":"request completed"}
{"level":30,"time":1795090631425,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/5bca5a90-d3c5-4571-8221-a1b9644f6b79","host":"127.0.0.1:33793","remoteAddress":"127.0.0.1","remotePort":46852},"msg":"incoming request"}
{"level":30,"time":1795090631426,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":4.167558999999983,"msg":"request completed"}
{"level":30,"time":1795090631427,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":404},"responseTime":2.0610119999999483,"msg":"request completed"}
{"level":30,"time":1795090631428,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46673","remoteAddress":"127.0.0.1","remotePort":36464},"msg":"incoming request"}
{"level":30,"time":1795090631428,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:42651","remoteAddress":"127.0.0.1","remotePort":53268},"msg":"incoming request"}
{"level":30,"time":1795090631430,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":1.9752510000000143,"msg":"request completed"}
{"level":30,"time":1795090631430,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":2.4166790000000447,"msg":"request completed"}
{"level":30,"time":1795090631435,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/2e2194ca-afa3-40f8-b6ac-03427996522c","host":"127.0.0.1:36091","remoteAddress":"127.0.0.1","remotePort":36352},"msg":"incoming request"}
{"level":30,"time":1795090631435,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/5bca5a90-d3c5-4571-8221-a1b9644f6b79","host":"127.0.0.1:43867","remoteAddress":"127.0.0.1","remotePort":37412},"msg":"incoming request"}
{"level":30,"time":1795090631437,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":404},"responseTime":1.7410800000000108,"msg":"request completed"}
{"level":30,"time":1795090631437,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/5bca5a90-d3c5-4571-8221-a1b9644f6b79/timeline","host":"127.0.0.1:38089","remoteAddress":"127.0.0.1","remotePort":38012},"msg":"incoming request"}
{"level":30,"time":1795090631438,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":3.336297000000002,"msg":"request completed"}
{"level":30,"time":1795090631439,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":404},"responseTime":1.2477840000000242,"msg":"request completed"}
{"level":30,"time":1795090631439,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42709","remoteAddress":"127.0.0.1","remotePort":38926},"msg":"incoming request"}
{"level":30,"time":1795090631439,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5295449999999846,"msg":"request completed"}
{"level":30,"time":1795090631440,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43381","remoteAddress":"127.0.0.1","remotePort":37878},"msg":"incoming request"}
{"level":30,"time":1795090631441,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:34091","remoteAddress":"127.0.0.1","remotePort":59542},"msg":"incoming request"}
{"level":30,"time":1795090631443,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":403},"responseTime":1.5642080000000078,"msg":"request completed"}
{"level":30,"time":1795090631444,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":3.63477800000004,"msg":"request completed"}
{"level":30,"time":1795090631444,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/8c257962-6ced-46b5-b7a3-f0d6e40ebb93","host":"127.0.0.1:40891","remoteAddress":"127.0.0.1","remotePort":50574},"msg":"incoming request"}
{"level":30,"time":1795090631448,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":4.257047,"msg":"request completed"}
{"level":30,"time":1795090631449,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:46605","remoteAddress":"127.0.0.1","remotePort":56854},"msg":"incoming request"}
{"level":30,"time":1795090631452,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.8258179999999697,"msg":"request completed"}
{"level":30,"time":1795090631453,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=18bfbba2-1bf6-4f2d-b1f7-e6bdd76ecc22&page_size=50","host":"127.0.0.1:34685","remoteAddress":"127.0.0.1","remotePort":56700},"msg":"incoming request"}
{"level":30,"time":1795090631455,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":1.914777000000015,"msg":"request completed"}
{"level":30,"time":1795090631456,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39081","remoteAddress":"127.0.0.1","remotePort":59478},"msg":"incoming request"}
{"level":30,"time":1795090631457,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41853","remoteAddress":"127.0.0.1","remotePort":44956},"msg":"incoming request"}
{"level":30,"time":1795090631459,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":403},"responseTime":1.6322159999999712,"msg":"request completed"}
{"level":30,"time":1795090631460,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:46607","remoteAddress":"127.0.0.1","remotePort":38928},"msg":"incoming request"}
{"level":30,"time":1795090631462,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.0929009999999835,"msg":"request completed"}
{"level":30,"time":1795090631463,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42299","remoteAddress":"127.0.0.1","remotePort":34798},"msg":"incoming request"}
{"level":30,"time":1795090631477,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":422},"responseTime":13.580941999999993,"msg":"request completed"}
{"level":30,"time":1795090631478,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":21.408065999999963,"msg":"request completed"}
{"level":30,"time":1795090631478,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36913","remoteAddress":"127.0.0.1","remotePort":56980},"msg":"incoming request"}
{"level":30,"time":1795090631479,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33373","remoteAddress":"127.0.0.1","remotePort":58742},"msg":"incoming request"}
{"level":30,"time":1795090631481,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2588330000000383,"msg":"request completed"}
{"level":30,"time":1795090631482,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=18bfbba2-1bf6-4f2d-b1f7-e6bdd76ecc22&action_type=record_view","host":"127.0.0.1:44401","remoteAddress":"127.0.0.1","remotePort":38664},"msg":"incoming request"}
{"level":30,"time":1795090631483,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":4.210829999999987,"msg":"request completed"}
{"level":30,"time":1795090631484,"pid":42747,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":1.9599809999999707,"msg":"request completed"}
{"level":30,"time":1795090631484,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43739","remoteAddress":"127.0.0.1","remotePort":55466},"msg":"incoming request"}
{"level":30,"time":1795090631487,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":3.1228160000000003,"msg":"request completed"}
{"level":30,"time":1795090631488,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:36613","remoteAddress":"127.0.0.1","remotePort":34876},"msg":"incoming request"}
{"level":40,"time":1795090631492,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795090631494,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":201},"responseTime":5.242387000000008,"msg":"request completed"}
{"level":30,"time":1795090631495,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/70e496ac-5c53-402e-bbf9-e7f0aead3de9/approve","host":"127.0.0.1:40097","remoteAddress":"127.0.0.1","remotePort":60408},"msg":"incoming request"}
{"level":40,"time":1795090631497,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795090631498,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":3.131603000000041,"msg":"request completed"}
{"level":30,"time":1795090631499,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:43823","remoteAddress":"127.0.0.1","remotePort":35894},"msg":"incoming request"}
{"level":30,"time":1795090631501,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":200},"responseTime":1.9196469999999977,"msg":"request completed"}
{"level":30,"time":1795090631502,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34257","remoteAddress":"127.0.0.1","remotePort":51196},"msg":"incoming request"}
{"level":30,"time":1795090631503,"pid":42736,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":403},"responseTime":1.0120210000000043,"msg":"request completed"}
{"level":30,"time":1795090631574,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36719","remoteAddress":"127.0.0.1","remotePort":49888},"msg":"incoming request"}
{"level":30,"time":1795090631591,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":16.027308000000005,"msg":"request completed"}
{"level":30,"time":1795090631594,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms","host":"127.0.0.1:38247","remoteAddress":"127.0.0.1","remotePort":39848},"msg":"incoming request"}
{"level":30,"time":1795090631598,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":4.347916999999995,"msg":"request completed"}
{"level":30,"time":1795090631600,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms/8cdc508f-4b10-4a08-b1bc-bebd238e465b/approve","host":"127.0.0.1:39227","remoteAddress":"127.0.0.1","remotePort":41816},"msg":"incoming request"}
{"level":30,"time":1795090631603,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":403},"responseTime":2.7263510000000224,"msg":"request completed"}
{"level":30,"time":1795090631605,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46151","remoteAddress":"127.0.0.1","remotePort":34036},"msg":"incoming request"}
{"level":30,"time":1795090631609,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":3.912018000000046,"msg":"request completed"}
{"level":30,"time":1795090631611,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms/8cdc508f-4b10-4a08-b1bc-bebd238e465b/approve","host":"127.0.0.1:45149","remoteAddress":"127.0.0.1","remotePort":38988},"msg":"incoming request"}
{"level":30,"time":1795090631635,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":24.166598000000022,"msg":"request completed"}
{"level":30,"time":1795090631636,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/timeline","host":"127.0.0.1:36953","remoteAddress":"127.0.0.1","remotePort":34650},"msg":"incoming request"}
{"level":30,"time":1795090631640,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.6144499999999766,"msg":"request completed"}
{"level":30,"time":1795090631642,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43931","remoteAddress":"127.0.0.1","remotePort":51428},"msg":"incoming request"}
{"level":30,"time":1795090631644,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.178702000000044,"msg":"request completed"}
{"level":30,"time":1795090631646,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms","host":"127.0.0.1:42597","remoteAddress":"127.0.0.1","remotePort":33880},"msg":"incoming request"}
{"level":30,"time":1795090631649,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":3.0849550000000363,"msg":"request completed"}
{"level":30,"time":1795090631650,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms/07d08e5f-c269-41a5-9139-68e093a4a324/approve","host":"127.0.0.1:41503","remoteAddress":"127.0.0.1","remotePort":52998},"msg":"incoming request"}
{"level":30,"time":1795090631653,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":400},"responseTime":2.8919429999999693,"msg":"request completed"}
{"level":30,"time":1795090631655,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44925","remoteAddress":"127.0.0.1","remotePort":48908},"msg":"incoming request"}
{"level":30,"time":1795090631657,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":1.9779960000000187,"msg":"request completed"}
{"level":30,"time":1795090631658,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms/07d08e5f-c269-41a5-9139-68e093a4a324/approve","host":"127.0.0.1:40035","remoteAddress":"127.0.0.1","remotePort":58252},"msg":"incoming request"}
{"level":30,"time":1795090631677,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":19.348707000000047,"msg":"request completed"}
{"level":30,"time":1795090631680,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40603","remoteAddress":"127.0.0.1","remotePort":49830},"msg":"incoming request"}
{"level":30,"time":1795090631682,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.1165869999999813,"msg":"request completed"}
{"level":30,"time":1795090631683,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/9b1ed87d-ad8f-4675-b3a0-3ed3080bc1e7/ics-forms/8cdc508f-4b10-4a08-b1bc-bebd238e465b/approve","host":"127.0.0.1:42531","remoteAddress":"127.0.0.1","remotePort":42216},"msg":"incoming request"}
{"level":30,"time":1795090631684,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":403},"responseTime":1.470612000000017,"msg":"request completed"}
{"level":30,"time":1795090631685,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/dashboard/summary","host":"127.0.0.1:40619","remoteAddress":"127.0.0.1","remotePort":54730},"msg":"incoming request"}
{"level":30,"time":1795090631689,"pid":42758,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":3.1298499999999763,"msg":"request completed"}
{"level":30,"time":1795090631839,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:42457","remoteAddress":"127.0.0.1","remotePort":46430},"msg":"incoming request"}
{"level":30,"time":1795090631851,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":12.032272999999975,"msg":"request completed"}
{"level":30,"time":1795090631855,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:40923","remoteAddress":"127.0.0.1","remotePort":42520},"msg":"incoming request"}
{"level":30,"time":1795090631858,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":3.1009750000000054,"msg":"request completed"}
{"level":30,"time":1795090631859,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46205","remoteAddress":"127.0.0.1","remotePort":41826},"msg":"incoming request"}
{"level":30,"time":1795090631860,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:33951","remoteAddress":"127.0.0.1","remotePort":60140},"msg":"incoming request"}
{"level":30,"time":1795090631862,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":422},"responseTime":2.1507310000000075,"msg":"request completed"}
{"level":30,"time":1795090631863,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41695","remoteAddress":"127.0.0.1","remotePort":59216},"msg":"incoming request"}
{"level":30,"time":1795090631877,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":13.413697999999954,"msg":"request completed"}
{"level":30,"time":1795090631878,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:38201","remoteAddress":"127.0.0.1","remotePort":57150},"msg":"incoming request"}
{"level":30,"time":1795090631883,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":4.432907999999998,"msg":"request completed"}
{"level":30,"time":1795090631883,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":23.102839999999958,"msg":"request completed"}
{"level":30,"time":1795090631885,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/sync-conflicts/a3a36dbc-8c54-46c7-a56e-e9d1e7de12a3/resolve","host":"127.0.0.1:42823","remoteAddress":"127.0.0.1","remotePort":41762},"msg":"incoming request"}
{"level":30,"time":1795090631886,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46187","remoteAddress":"127.0.0.1","remotePort":53706},"msg":"incoming request"}
{"level":30,"time":1795090631889,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.6493659999999863,"msg":"request completed"}
{"level":30,"time":1795090631890,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":4.403742999999963,"msg":"request completed"}
{"level":30,"time":1795090631890,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/a22e55da-fb05-4a7b-b942-9d97d0caae1c/timeline","host":"127.0.0.1:39315","remoteAddress":"127.0.0.1","remotePort":58082},"msg":"incoming request"}
{"level":30,"time":1795090631891,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/4402a32d-c62c-47e3-b0ce-2465ae301e4e/sitreps","host":"127.0.0.1:41869","remoteAddress":"127.0.0.1","remotePort":54292},"msg":"incoming request"}
{"level":30,"time":1795090631894,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.977002999999968,"msg":"request completed"}
{"level":30,"time":1795090631895,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/sync-conflicts/a3a36dbc-8c54-46c7-a56e-e9d1e7de12a3/resolve","host":"127.0.0.1:39255","remoteAddress":"127.0.0.1","remotePort":32920},"msg":"incoming request"}
{"level":30,"time":1795090631896,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":4.313864000000024,"msg":"request completed"}
{"level":30,"time":1795090631897,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":409},"responseTime":2.1731319999999528,"msg":"request completed"}
{"level":30,"time":1795090631898,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32909","remoteAddress":"127.0.0.1","remotePort":60514},"msg":"incoming request"}
{"level":30,"time":1795090631899,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:33331","remoteAddress":"127.0.0.1","remotePort":52998},"msg":"incoming request"}
{"level":30,"time":1795090631901,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":3.4209660000000213,"msg":"request completed"}
{"level":30,"time":1795090631902,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.3313700000000495,"msg":"request completed"}
{"level":30,"time":1795090631903,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/2b01e223-f4f0-4767-bf5a-f7674a8d6678/aar","host":"127.0.0.1:36191","remoteAddress":"127.0.0.1","remotePort":46758},"msg":"incoming request"}
{"level":30,"time":1795090631904,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45125","remoteAddress":"127.0.0.1","remotePort":35244},"msg":"incoming request"}
{"level":30,"time":1795090631904,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":409},"responseTime":1.6035320000000297,"msg":"request completed"}
{"level":30,"time":1795090631906,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/2b01e223-f4f0-4767-bf5a-f7674a8d6678/closure","host":"127.0.0.1:36153","remoteAddress":"127.0.0.1","remotePort":41242},"msg":"incoming request"}
{"level":30,"time":1795090631907,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":3.06570899999997,"msg":"request completed"}
{"level":30,"time":1795090631908,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:38043","remoteAddress":"127.0.0.1","remotePort":37742},"msg":"incoming request"}
{"level":30,"time":1795090631909,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.5095829999999637,"msg":"request completed"}
{"level":30,"time":1795090631910,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/2b01e223-f4f0-4767-bf5a-f7674a8d6678/aar","host":"127.0.0.1:43741","remoteAddress":"127.0.0.1","remotePort":41712},"msg":"incoming request"}
{"level":30,"time":1795090631911,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.9046769999999924,"msg":"request completed"}
{"level":30,"time":1795090631912,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/sync-conflicts/104ef7f3-a438-44c8-a1c8-85c33228016c/resolve","host":"127.0.0.1:45187","remoteAddress":"127.0.0.1","remotePort":33344},"msg":"incoming request"}
{"level":30,"time":1795090631914,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":3.6119050000000357,"msg":"request completed"}
{"level":30,"time":1795090631915,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.8908399999999688,"msg":"request completed"}
{"level":30,"time":1795090631915,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46823","remoteAddress":"127.0.0.1","remotePort":50652},"msg":"incoming request"}
{"level":30,"time":1795090631917,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:40293","remoteAddress":"127.0.0.1","remotePort":34870},"msg":"incoming request"}
{"level":30,"time":1795090631918,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":2.6995319999999765,"msg":"request completed"}
{"level":30,"time":1795090631918,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":403},"responseTime":1.2618310000000292,"msg":"request completed"}
{"level":30,"time":1795090631919,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/sync-conflicts","host":"127.0.0.1:40143","remoteAddress":"127.0.0.1","remotePort":46182},"msg":"incoming request"}
{"level":30,"time":1795090631919,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/ab4db9a6-25c1-4335-9741-35fbb08011fc/closure","host":"127.0.0.1:42185","remoteAddress":"127.0.0.1","remotePort":56324},"msg":"incoming request"}
{"level":30,"time":1795090631921,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":1.9396130000000085,"msg":"request completed"}
{"level":30,"time":1795090631922,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":2.9410349999999994,"msg":"request completed"}
{"level":30,"time":1795090631922,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46369","remoteAddress":"127.0.0.1","remotePort":60082},"msg":"incoming request"}
{"level":30,"time":1795090631923,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/ab4db9a6-25c1-4335-9741-35fbb08011fc/aar","host":"127.0.0.1:33211","remoteAddress":"127.0.0.1","remotePort":52602},"msg":"incoming request"}
{"level":30,"time":1795090631924,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":422},"responseTime":1.5132729999999697,"msg":"request completed"}
{"level":30,"time":1795090631925,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":2.624980999999991,"msg":"request completed"}
{"level":30,"time":1795090631926,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45941","remoteAddress":"127.0.0.1","remotePort":36114},"msg":"incoming request"}
{"level":30,"time":1795090631935,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:43791","remoteAddress":"127.0.0.1","remotePort":50984},"msg":"incoming request"}
{"level":30,"time":1795090631936,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":201},"responseTime":9.923351000000025,"msg":"request completed"}
{"level":30,"time":1795090631936,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/3081a2cc-81b6-4742-9443-5eb707b7ffe4/closure","host":"127.0.0.1:46057","remoteAddress":"127.0.0.1","remotePort":54568},"msg":"incoming request"}
{"level":30,"time":1795090631937,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":200},"responseTime":1.8632200000000125,"msg":"request completed"}
{"level":30,"time":1795090631939,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"GET","url":"/api/v1/sync-conflicts?page_size=100","host":"127.0.0.1:44311","remoteAddress":"127.0.0.1","remotePort":52676},"msg":"incoming request"}
{"level":30,"time":1795090631939,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.5941640000000348,"msg":"request completed"}
{"level":30,"time":1795090631940,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/3081a2cc-81b6-4742-9443-5eb707b7ffe4/aar","host":"127.0.0.1:34707","remoteAddress":"127.0.0.1","remotePort":37766},"msg":"incoming request"}
{"level":30,"time":1795090631940,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":1.6741150000000289,"msg":"request completed"}
{"level":30,"time":1795090631941,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"GET","url":"/api/v1/sync-conflicts/3aebecc0-de15-412a-93f7-63fda6092aa8","host":"127.0.0.1:44035","remoteAddress":"127.0.0.1","remotePort":40734},"msg":"incoming request"}
{"level":30,"time":1795090631943,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6650280000000066,"msg":"request completed"}
{"level":30,"time":1795090631943,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":201},"responseTime":3.3766140000000178,"msg":"request completed"}
{"level":30,"time":1795090631944,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/sync-conflicts/3aebecc0-de15-412a-93f7-63fda6092aa8/resolve","host":"127.0.0.1:35213","remoteAddress":"127.0.0.1","remotePort":41308},"msg":"incoming request"}
{"level":30,"time":1795090631944,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/3081a2cc-81b6-4742-9443-5eb707b7ffe4/aar/1cffa710-7bac-47b1-b01b-cf77548f9d49/finalize","host":"127.0.0.1:38545","remoteAddress":"127.0.0.1","remotePort":52674},"msg":"incoming request"}
{"level":30,"time":1795090631945,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":404},"responseTime":1.3405480000000125,"msg":"request completed"}
{"level":30,"time":1795090631946,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/photos/772b2665-6d54-46b0-98ec-f5e92d119b0d","host":"127.0.0.1:33859","remoteAddress":"127.0.0.1","remotePort":39960},"msg":"incoming request"}
{"level":30,"time":1795090631947,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":2.956294000000014,"msg":"request completed"}
{"level":30,"time":1795090631948,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":404},"responseTime":1.2714579999999955,"msg":"request completed"}
{"level":30,"time":1795090631948,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/3081a2cc-81b6-4742-9443-5eb707b7ffe4/aar/1cffa710-7bac-47b1-b01b-cf77548f9d49/finalize","host":"127.0.0.1:38943","remoteAddress":"127.0.0.1","remotePort":48076},"msg":"incoming request"}
{"level":30,"time":1795090631949,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":403},"responseTime":1.5562830000000076,"msg":"request completed"}
{"level":30,"time":1795090631950,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/photos","host":"127.0.0.1:41345","remoteAddress":"127.0.0.1","remotePort":49434},"msg":"incoming request"}
{"level":30,"time":1795090631950,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41317","remoteAddress":"127.0.0.1","remotePort":60082},"msg":"incoming request"}
{"level":30,"time":1795090631951,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":404},"responseTime":1.5247640000000047,"msg":"request completed"}
{"level":30,"time":1795090631952,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"GET","url":"/api/v1/sync-conflicts/3aebecc0-de15-412a-93f7-63fda6092aa8","host":"127.0.0.1:41121","remoteAddress":"127.0.0.1","remotePort":46322},"msg":"incoming request"}
{"level":30,"time":1795090631953,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":200},"responseTime":1.4120920000000297,"msg":"request completed"}
{"level":30,"time":1795090631953,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":2.951334000000031,"msg":"request completed"}
{"level":30,"time":1795090631954,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","req":{"method":"GET","url":"/api/v1/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/photos/772b2665-6d54-46b0-98ec-f5e92d119b0d","host":"127.0.0.1:45361","remoteAddress":"127.0.0.1","remotePort":54170},"msg":"incoming request"}
{"level":30,"time":1795090631954,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/48e61072-6567-42e5-aeea-16f9839af0e7/closure","host":"127.0.0.1:36523","remoteAddress":"127.0.0.1","remotePort":56302},"msg":"incoming request"}
{"level":50,"time":1795090631955,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","err":{"type":"Error","message":"ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/f0501-test.jpg'","stack":"Error: ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/f0501-test.jpg'\n    at async open (node:internal/fs/promises:637:25)\n    at async readFile (node:internal/fs/promises:1249:14)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/field-reports.ts:420:24)","errno":-2,"code":"ENOENT","syscall":"open","path":"/home/daytona/project/backend/uploads/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/f0501-test.jpg"},"msg":"Field report photo read failed for photo_id=772b2665-6d54-46b0-98ec-f5e92d119b0d"}
{"level":30,"time":1795090631957,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","res":{"statusCode":404},"responseTime":2.540813000000014,"msg":"request completed"}
{"level":30,"time":1795090631957,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":3.1579120000000103,"msg":"request completed"}
{"level":30,"time":1795090631958,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","req":{"method":"POST","url":"/api/v1/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/photos","host":"127.0.0.1:37329","remoteAddress":"127.0.0.1","remotePort":40420},"msg":"incoming request"}
{"level":30,"time":1795090631958,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/48e61072-6567-42e5-aeea-16f9839af0e7/aar","host":"127.0.0.1:35659","remoteAddress":"127.0.0.1","remotePort":38758},"msg":"incoming request"}
{"level":30,"time":1795090631961,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":2.9735359999999673,"msg":"request completed"}
{"level":30,"time":1795090631962,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","res":{"statusCode":204},"responseTime":3.613287000000014,"msg":"request completed"}
{"level":30,"time":1795090631962,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/48e61072-6567-42e5-aeea-16f9839af0e7/aar/0f63a4af-9424-4966-a0c9-d26d6b4e30c3/finalize","host":"127.0.0.1:34265","remoteAddress":"127.0.0.1","remotePort":60752},"msg":"incoming request"}
{"level":30,"time":1795090631962,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-p","req":{"method":"GET","url":"/api/v1/field-reports/3b9629b8-6c0b-4803-ae78-4b6645a3e5cf/photos/89c08e31-8992-46dd-aa97-b2c650255985","host":"127.0.0.1:38181","remoteAddress":"127.0.0.1","remotePort":34772},"msg":"incoming request"}
{"level":30,"time":1795090631964,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-p","res":{"statusCode":200},"responseTime":1.4797399999999925,"msg":"request completed"}
{"level":30,"time":1795090631964,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":200},"responseTime":2.3399160000000165,"msg":"request completed"}
{"level":30,"time":1795090631965,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-q","req":{"method":"POST","url":"/api/v1/sync-conflicts/3aebecc0-de15-412a-93f7-63fda6092aa8/resolve","host":"127.0.0.1:42661","remoteAddress":"127.0.0.1","remotePort":59882},"msg":"incoming request"}
{"level":30,"time":1795090631965,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=2b0535c4-28be-4e54-bbc2-917054500d58&page_size=200","host":"127.0.0.1:46793","remoteAddress":"127.0.0.1","remotePort":33670},"msg":"incoming request"}
{"level":30,"time":1795090631967,"pid":42789,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-q","res":{"statusCode":200},"responseTime":2.0183920000000057,"msg":"request completed"}
{"level":30,"time":1795090631968,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":2.5742060000000038,"msg":"request completed"}
{"level":30,"time":1795090631969,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:33157","remoteAddress":"127.0.0.1","remotePort":59182},"msg":"incoming request"}
{"level":30,"time":1795090631970,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":403},"responseTime":1.1020000000000323,"msg":"request completed"}
{"level":30,"time":1795090631971,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:36121","remoteAddress":"127.0.0.1","remotePort":42058},"msg":"incoming request"}
{"level":30,"time":1795090631976,"pid":42800,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":200},"responseTime":4.448677000000032,"msg":"request completed"}
{"level":30,"time":1795090632010,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40069","remoteAddress":"127.0.0.1","remotePort":33708},"msg":"incoming request"}
{"level":30,"time":1795090632025,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":14.497203000000013,"msg":"request completed"}
{"level":30,"time":1795090632032,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/f82a4147-215a-45e5-aa34-9e2f9d688adf/timeline","host":"127.0.0.1:37073","remoteAddress":"127.0.0.1","remotePort":51326},"msg":"incoming request"}
{"level":30,"time":1795090632037,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":4.263439000000005,"msg":"request completed"}
{"level":30,"time":1795090632041,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35143","remoteAddress":"127.0.0.1","remotePort":51054},"msg":"incoming request"}
{"level":30,"time":1795090632044,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1112340000000245,"msg":"request completed"}
{"level":30,"time":1795090632045,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/0bd2503b-b37d-418e-b2e5-31b6dfd4f089/closure","host":"127.0.0.1:41489","remoteAddress":"127.0.0.1","remotePort":55636},"msg":"incoming request"}
{"level":30,"time":1795090632049,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":3.7631589999999733,"msg":"request completed"}
{"level":30,"time":1795090632051,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/0bd2503b-b37d-418e-b2e5-31b6dfd4f089/timeline","host":"127.0.0.1:43689","remoteAddress":"127.0.0.1","remotePort":51224},"msg":"incoming request"}
{"level":30,"time":1795090632053,"pid":42830,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.1271659999999883,"msg":"request completed"}
{"level":30,"time":1795090632243,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34599","remoteAddress":"127.0.0.1","remotePort":51964},"msg":"incoming request"}
{"level":30,"time":1795090632252,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:43249","remoteAddress":"127.0.0.1","remotePort":39390},"msg":"incoming request"}
{"level":30,"time":1795090632256,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":403},"responseTime":3.983203000000003,"msg":"request completed"}
{"level":30,"time":1795090632257,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":13.781468999999959,"msg":"request completed"}
{"level":30,"time":1795090632259,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:46117","remoteAddress":"127.0.0.1","remotePort":53886},"msg":"incoming request"}
{"level":30,"time":1795090632260,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/activation","host":"127.0.0.1:43731","remoteAddress":"127.0.0.1","remotePort":38398},"msg":"incoming request"}
{"level":30,"time":1795090632261,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":403},"responseTime":1.6319959999999583,"msg":"request completed"}
{"level":30,"time":1795090632262,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:34927","remoteAddress":"127.0.0.1","remotePort":52488},"msg":"incoming request"}
{"level":30,"time":1795090632262,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":422},"responseTime":2.612437,"msg":"request completed"}
{"level":30,"time":1795090632263,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30","host":"127.0.0.1:34279","remoteAddress":"127.0.0.1","remotePort":43224},"msg":"incoming request"}
{"level":30,"time":1795090632263,"pid":42854,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":1.4846099999999751,"msg":"request completed"}
{"level":30,"time":1795090632266,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":2.517979999999966,"msg":"request completed"}
{"level":30,"time":1795090632267,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/command-roles","host":"127.0.0.1:34567","remoteAddress":"127.0.0.1","remotePort":46984},"msg":"incoming request"}
{"level":30,"time":1795090632270,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":2.872726,"msg":"request completed"}
{"level":30,"time":1795090632271,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/activation","host":"127.0.0.1:46569","remoteAddress":"127.0.0.1","remotePort":33186},"msg":"incoming request"}
{"level":30,"time":1795090632274,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":3.246509000000003,"msg":"request completed"}
{"level":30,"time":1795090632275,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/timeline","host":"127.0.0.1:35361","remoteAddress":"127.0.0.1","remotePort":50194},"msg":"incoming request"}
{"level":30,"time":1795090632278,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.1950539999999705,"msg":"request completed"}
{"level":30,"time":1795090632279,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/activation","host":"127.0.0.1:46427","remoteAddress":"127.0.0.1","remotePort":46330},"msg":"incoming request"}
{"level":30,"time":1795090632281,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":400},"responseTime":1.1278590000000008,"msg":"request completed"}
{"level":30,"time":1795090632281,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30","host":"127.0.0.1:37683","remoteAddress":"127.0.0.1","remotePort":58726},"msg":"incoming request"}
{"level":30,"time":1795090632283,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9769840000000158,"msg":"request completed"}
{"level":30,"time":1795090632284,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/command-roles","host":"127.0.0.1:42421","remoteAddress":"127.0.0.1","remotePort":57592},"msg":"incoming request"}
{"level":30,"time":1795090632287,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.3142270000000167,"msg":"request completed"}
{"level":30,"time":1795090632288,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/timeline","host":"127.0.0.1:39845","remoteAddress":"127.0.0.1","remotePort":42222},"msg":"incoming request"}
{"level":30,"time":1795090632290,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8963319999999726,"msg":"request completed"}
{"level":30,"time":1795090632291,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/closure","host":"127.0.0.1:32789","remoteAddress":"127.0.0.1","remotePort":59208},"msg":"incoming request"}
{"level":30,"time":1795090632294,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":3.3385110000000395,"msg":"request completed"}
{"level":30,"time":1795090632295,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/103ef3e5-84c1-4cb9-90e9-37832c40aa30/timeline","host":"127.0.0.1:37809","remoteAddress":"127.0.0.1","remotePort":49362},"msg":"incoming request"}
{"level":30,"time":1795090632296,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":1.5324679999999944,"msg":"request completed"}
{"level":30,"time":1795090632297,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40369","remoteAddress":"127.0.0.1","remotePort":39566},"msg":"incoming request"}
{"level":30,"time":1795090632300,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":201},"responseTime":2.4483700000000113,"msg":"request completed"}
{"level":30,"time":1795090632301,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/6b4af9ef-4561-4711-aaf5-35b921c117b0/command-roles","host":"127.0.0.1:38081","remoteAddress":"127.0.0.1","remotePort":38440},"msg":"incoming request"}
{"level":30,"time":1795090632302,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":1.704242000000022,"msg":"request completed"}
{"level":30,"time":1795090632303,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/6b4af9ef-4561-4711-aaf5-35b921c117b0/command-roles","host":"127.0.0.1:42283","remoteAddress":"127.0.0.1","remotePort":42432},"msg":"incoming request"}
{"level":30,"time":1795090632305,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":1.7020179999999527,"msg":"request completed"}
{"level":30,"time":1795090632306,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/6b4af9ef-4561-4711-aaf5-35b921c117b0/timeline","host":"127.0.0.1:39763","remoteAddress":"127.0.0.1","remotePort":36452},"msg":"incoming request"}
{"level":30,"time":1795090632307,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":200},"responseTime":1.44612699999999,"msg":"request completed"}
{"level":30,"time":1795090632309,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37145","remoteAddress":"127.0.0.1","remotePort":45580},"msg":"incoming request"}
{"level":30,"time":1795090632311,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":2.2647740000000454,"msg":"request completed"}
{"level":30,"time":1795090632312,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/3e4404a9-643f-4697-a0b7-9ba251294a81/activation","host":"127.0.0.1:42251","remoteAddress":"127.0.0.1","remotePort":35476},"msg":"incoming request"}
{"level":30,"time":1795090632313,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":404},"responseTime":1.2125280000000203,"msg":"request completed"}
{"level":30,"time":1795090632314,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/3e4404a9-643f-4697-a0b7-9ba251294a81/command-roles","host":"127.0.0.1:35457","remoteAddress":"127.0.0.1","remotePort":45374},"msg":"incoming request"}
{"level":30,"time":1795090632315,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":404},"responseTime":1.0900780000000054,"msg":"request completed"}
{"level":30,"time":1795090632316,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/3e4404a9-643f-4697-a0b7-9ba251294a81/closure","host":"127.0.0.1:34275","remoteAddress":"127.0.0.1","remotePort":35162},"msg":"incoming request"}
{"level":30,"time":1795090632317,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":404},"responseTime":1.0239240000000223,"msg":"request completed"}
{"level":30,"time":1795090632317,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/3e4404a9-643f-4697-a0b7-9ba251294a81/activation","host":"127.0.0.1:45843","remoteAddress":"127.0.0.1","remotePort":56962},"msg":"incoming request"}
{"level":30,"time":1795090632319,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":200},"responseTime":1.5687280000000214,"msg":"request completed"}
{"level":30,"time":1795090632320,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41515","remoteAddress":"127.0.0.1","remotePort":46048},"msg":"incoming request"}
{"level":30,"time":1795090632322,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":201},"responseTime":2.080438000000015,"msg":"request completed"}
{"level":30,"time":1795090632322,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/a9356bc3-8967-4517-8dd9-5bf62de6bb80/closure","host":"127.0.0.1:36263","remoteAddress":"127.0.0.1","remotePort":35664},"msg":"incoming request"}
{"level":30,"time":1795090632325,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","res":{"statusCode":200},"responseTime":2.153084999999976,"msg":"request completed"}
{"level":30,"time":1795090632325,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/a9356bc3-8967-4517-8dd9-5bf62de6bb80/closure","host":"127.0.0.1:46421","remoteAddress":"127.0.0.1","remotePort":44506},"msg":"incoming request"}
{"level":30,"time":1795090632327,"pid":42847,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","res":{"statusCode":409},"responseTime":2.1315740000000005,"msg":"request completed"}

 Test Files  16 passed (16)
      Tests  94 passed (94)
   Start at  12:17:09
   Duration  2.47s (transform 408ms, setup 56ms, import 3.10s, tests 2.96s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 58[2mms[22m[39m
 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 69[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 99[2mms[22m[39m
 [32m✓[39m test/product-patterns.test.tsx [2m([22m[2m13 tests[22m[2m)[22m[90m 111[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 118[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 116[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 179[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[32m65 passed[39m[22m[90m (65)[39m
[2m   Start at [22m 12:17:12
[2m   Duration [22m 1.15s[2m (transform 313ms, setup 225ms, collect 963ms, tests 751ms, environment 1.34s, prepare 179ms)[22m
```

## Wave 2

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3 — pre_existing: field-reports.test.ts intermittently flakes on shared compose-stack DB state (same class as 05-04/05-06 deferred-items.md); confirmed unrelated to 06-02 (no overlap with touched files), reproduced 1/3 bare runs, passed on retry

### Gate output

```
> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 81 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 39.21 kB[22m[1m[22m[2m │ gzip:  5.72 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m109.52 kB[22m[1m[22m[2m │ gzip: 24.80 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m39.21 kB[22m[1m[22m[2m │ gzip:  5.72 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m69.06 kB[22m[1m[22m[2m │ gzip: 20.65 kB[22m
[32m✓ built in 179ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 153 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mregisterSW.js              [39m[1m[2m  0.13 kB[22m[1m[22m
[2mdist/[22m[32mmanifest.webmanifest       [39m[1m[2m  0.32 kB[22m[1m[22m
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.55 kB[22m[1m[22m[2m │ gzip:   0.87 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-CD_vJSGO.css  [39m[1m[2m 53.57 kB[22m[1m[22m[2m │ gzip:   8.58 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-Div60X0n.js   [39m[1m[33m503.32 kB[39m[22m[2m │ gzip: 144.16 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 784ms[39m

PWA v0.21.2
mode      generateSW
precache  7 entries (545.62 KiB)
files generated
  dist/sw.js
  dist/workbox-ee9d8b34.js

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1795091197554,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42971","remoteAddress":"127.0.0.1","remotePort":49230},"msg":"incoming request"}
{"level":30,"time":1795091197560,"pid":73110,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:42235","remoteAddress":"127.0.0.1","remotePort":40748},"msg":"incoming request"}
{"level":30,"time":1795091197562,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:45595","remoteAddress":"127.0.0.1","remotePort":51028},"msg":"incoming request"}
{"level":30,"time":1795091197569,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":14.951166999999998,"msg":"request completed"}
{"level":30,"time":1795091197572,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/f68d1bd1-a9b4-476a-be78-2ffb6ed03bec/timeline","host":"127.0.0.1:41853","remoteAddress":"127.0.0.1","remotePort":55442},"msg":"incoming request"}
{"level":30,"time":1795091197578,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":5.92019700000003,"msg":"request completed"}
{"level":30,"time":1795091197580,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46419","remoteAddress":"127.0.0.1","remotePort":51406},"msg":"incoming request"}
{"level":30,"time":1795091197584,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":4.00455199999999,"msg":"request completed"}
{"level":30,"time":1795091197585,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41555","remoteAddress":"127.0.0.1","remotePort":44564},"msg":"incoming request"}
{"level":30,"time":1795091197587,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":409},"responseTime":1.828834000000029,"msg":"request completed"}
{"level":30,"time":1795091197588,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40069","remoteAddress":"127.0.0.1","remotePort":49538},"msg":"incoming request"}
{"level":30,"time":1795091197591,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":201},"responseTime":3.095203999999967,"msg":"request completed"}
{"level":30,"time":1795091197594,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45075","remoteAddress":"127.0.0.1","remotePort":50198},"msg":"incoming request"}
{"level":30,"time":1795091197597,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":201},"responseTime":3.261302999999998,"msg":"request completed"}
{"level":30,"time":1795091197598,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36397","remoteAddress":"127.0.0.1","remotePort":46272},"msg":"incoming request"}
{"level":30,"time":1795091197601,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":2.640940999999998,"msg":"request completed"}
{"level":30,"time":1795091197601,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41165","remoteAddress":"127.0.0.1","remotePort":44794},"msg":"incoming request"}
{"level":30,"time":1795091197605,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":3.270448999999985,"msg":"request completed"}
{"level":30,"time":1795091197606,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:45691","remoteAddress":"127.0.0.1","remotePort":37248},"msg":"incoming request"}
{"level":30,"time":1795091197610,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":2.97263700000002,"msg":"request completed"}
{"level":30,"time":1795091197613,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44673","remoteAddress":"127.0.0.1","remotePort":53160},"msg":"incoming request"}
{"level":30,"time":1795091197617,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":4.445350000000019,"msg":"request completed"}
{"level":30,"time":1795091197618,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":56.13231400000001,"msg":"request completed"}
{"level":30,"time":1795091197619,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/f8e3dd56-f3ac-4a66-9a2d-7cdefcbe21d4","host":"127.0.0.1:39179","remoteAddress":"127.0.0.1","remotePort":37512},"msg":"incoming request"}
{"level":30,"time":1795091197619,"pid":73110,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":57.99102399999998,"msg":"request completed"}
{"level":30,"time":1795091197621,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":404},"responseTime":2.209531000000027,"msg":"request completed"}
{"level":30,"time":1795091197622,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:39641","remoteAddress":"127.0.0.1","remotePort":49210},"msg":"incoming request"}
{"level":30,"time":1795091197622,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34719","remoteAddress":"127.0.0.1","remotePort":32890},"msg":"incoming request"}
{"level":30,"time":1795091197625,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.827877000000001,"msg":"request completed"}
{"level":30,"time":1795091197626,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/f8e3dd56-f3ac-4a66-9a2d-7cdefcbe21d4","host":"127.0.0.1:45289","remoteAddress":"127.0.0.1","remotePort":35822},"msg":"incoming request"}
{"level":30,"time":1795091197627,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":404},"responseTime":1.6865400000000363,"msg":"request completed"}
{"level":30,"time":1795091197628,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/f8e3dd56-f3ac-4a66-9a2d-7cdefcbe21d4/timeline","host":"127.0.0.1:44011","remoteAddress":"127.0.0.1","remotePort":43488},"msg":"incoming request"}
{"level":30,"time":1795091197630,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":404},"responseTime":1.236364999999978,"msg":"request completed"}
{"level":30,"time":1795091197631,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41253","remoteAddress":"127.0.0.1","remotePort":44326},"msg":"incoming request"}
{"level":30,"time":1795091197633,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":2.726298999999983,"msg":"request completed"}
{"level":30,"time":1795091197637,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":15.130781000000013,"msg":"request completed"}
{"level":30,"time":1795091197638,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39023","remoteAddress":"127.0.0.1","remotePort":33136},"msg":"incoming request"}
{"level":30,"time":1795091197643,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":4.382213000000036,"msg":"request completed"}
{"level":30,"time":1795091197645,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34793","remoteAddress":"127.0.0.1","remotePort":50938},"msg":"incoming request"}
{"level":30,"time":1795091197645,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/8769e075-dcae-4db9-95b6-b8f8f00ef0d3/decline","host":"127.0.0.1:44941","remoteAddress":"127.0.0.1","remotePort":53572},"msg":"incoming request"}
{"level":30,"time":1795091197647,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":422},"responseTime":1.6007809999999836,"msg":"request completed"}
{"level":30,"time":1795091197649,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=dca8e6b0-511d-4519-8730-3f5f6bb271dd","host":"127.0.0.1:33945","remoteAddress":"127.0.0.1","remotePort":49438},"msg":"incoming request"}
{"level":30,"time":1795091197651,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.262318999999991,"msg":"request completed"}
{"level":30,"time":1795091197652,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/8769e075-dcae-4db9-95b6-b8f8f00ef0d3/decline","host":"127.0.0.1:46407","remoteAddress":"127.0.0.1","remotePort":42366},"msg":"incoming request"}
{"level":30,"time":1795091197654,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":9.462572000000023,"msg":"request completed"}
{"level":30,"time":1795091197655,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43027","remoteAddress":"127.0.0.1","remotePort":35326},"msg":"incoming request"}
{"level":30,"time":1795091197656,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.776647999999966,"msg":"request completed"}
{"level":30,"time":1795091197657,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/dca8e6b0-511d-4519-8730-3f5f6bb271dd/timeline","host":"127.0.0.1:33157","remoteAddress":"127.0.0.1","remotePort":36266},"msg":"incoming request"}
{"level":30,"time":1795091197658,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":3.162029000000018,"msg":"request completed"}
{"level":30,"time":1795091197659,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38393","remoteAddress":"127.0.0.1","remotePort":51122},"msg":"incoming request"}
{"level":30,"time":1795091197663,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":3.1523799999999937,"msg":"request completed"}
{"level":30,"time":1795091197664,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46647","remoteAddress":"127.0.0.1","remotePort":60892},"msg":"incoming request"}
{"level":30,"time":1795091197666,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":8.746201000000042,"msg":"request completed"}
{"level":30,"time":1795091197669,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42581","remoteAddress":"127.0.0.1","remotePort":44982},"msg":"incoming request"}
{"level":40,"time":1795091197667,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795091197670,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":201},"responseTime":5.928882999999928,"msg":"request completed"}
{"level":30,"time":1795091197671,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/9b3d5325-bffc-4182-a98b-5016374c1aa2/approve","host":"127.0.0.1:39821","remoteAddress":"127.0.0.1","remotePort":54994},"msg":"incoming request"}
{"level":40,"time":1795091197673,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795091197674,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":5.0589089999999715,"msg":"request completed"}
{"level":30,"time":1795091197674,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":3.3452290000000175,"msg":"request completed"}
{"level":30,"time":1795091197675,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:34621","remoteAddress":"127.0.0.1","remotePort":40466},"msg":"incoming request"}
{"level":30,"time":1795091197676,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:43969","remoteAddress":"127.0.0.1","remotePort":59714},"msg":"incoming request"}
{"level":30,"time":1795091197678,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":200},"responseTime":2.2611160000000154,"msg":"request completed"}
{"level":30,"time":1795091197678,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34099","remoteAddress":"127.0.0.1","remotePort":55896},"msg":"incoming request"}
{"level":30,"time":1795091197679,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":3.4607019999999693,"msg":"request completed"}
{"level":30,"time":1795091197679,"pid":73111,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":403},"responseTime":0.9275609999999688,"msg":"request completed"}
{"level":30,"time":1795091197681,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/25b1f4f5-94fe-40e1-b192-731226652ff3/approve","host":"127.0.0.1:38711","remoteAddress":"127.0.0.1","remotePort":50884},"msg":"incoming request"}
{"level":30,"time":1795091197685,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":3.7390289999999595,"msg":"request completed"}
{"level":30,"time":1795091197686,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/25b1f4f5-94fe-40e1-b192-731226652ff3/fulfill","host":"127.0.0.1:41199","remoteAddress":"127.0.0.1","remotePort":57292},"msg":"incoming request"}
{"level":30,"time":1795091197689,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":3.012440999999967,"msg":"request completed"}
{"level":30,"time":1795091197691,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/25b1f4f5-94fe-40e1-b192-731226652ff3/fulfill","host":"127.0.0.1:43201","remoteAddress":"127.0.0.1","remotePort":36574},"msg":"incoming request"}
{"level":30,"time":1795091197694,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":3.6370699999999943,"msg":"request completed"}
{"level":30,"time":1795091197696,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/cc1e323a-7ca2-4aeb-90bd-bfa3cedc9001/timeline","host":"127.0.0.1:44275","remoteAddress":"127.0.0.1","remotePort":40554},"msg":"incoming request"}
{"level":30,"time":1795091197698,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2011549999999716,"msg":"request completed"}
{"level":30,"time":1795091197826,"pid":73110,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:45925","remoteAddress":"127.0.0.1","remotePort":35078},"msg":"incoming request"}
{"level":30,"time":1795091197829,"pid":73110,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":3.577639999999974,"msg":"request completed"}
{"level":30,"time":1795091197900,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42575","remoteAddress":"127.0.0.1","remotePort":54836},"msg":"incoming request"}
{"level":30,"time":1795091197905,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":4.762918999999897,"msg":"request completed"}
{"level":30,"time":1795091197906,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39557","remoteAddress":"127.0.0.1","remotePort":57998},"msg":"incoming request"}
{"level":30,"time":1795091197908,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":422},"responseTime":1.4859579999999823,"msg":"request completed"}
{"level":30,"time":1795091197909,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33691","remoteAddress":"127.0.0.1","remotePort":42960},"msg":"incoming request"}
{"level":30,"time":1795091197914,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":4.96244999999999,"msg":"request completed"}
{"level":30,"time":1795091197915,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:32817","remoteAddress":"127.0.0.1","remotePort":46936},"msg":"incoming request"}
{"level":30,"time":1795091197919,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":3.387375999999904,"msg":"request completed"}
{"level":30,"time":1795091197920,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/d8c025af-48b9-40d0-aa58-a3b7db6c7d6e/fulfill","host":"127.0.0.1:43671","remoteAddress":"127.0.0.1","remotePort":58986},"msg":"incoming request"}
{"level":30,"time":1795091197922,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":409},"responseTime":2.2753629999999703,"msg":"request completed"}
{"level":30,"time":1795091197924,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/d8c025af-48b9-40d0-aa58-a3b7db6c7d6e/approve","host":"127.0.0.1:39177","remoteAddress":"127.0.0.1","remotePort":51612},"msg":"incoming request"}
{"level":30,"time":1795091197926,"pid":73109,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":409},"responseTime":2.598171999999977,"msg":"request completed"}
{"level":30,"time":1795091197964,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:38067","remoteAddress":"127.0.0.1","remotePort":46356},"msg":"incoming request"}
{"level":30,"time":1795091197980,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":422},"responseTime":5.63270399999999,"msg":"request completed"}
{"level":30,"time":1795091197984,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:39747","remoteAddress":"127.0.0.1","remotePort":33890},"msg":"incoming request"}
{"level":30,"time":1795091197986,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":2.8478450000000066,"msg":"request completed"}
{"level":30,"time":1795091197988,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39141","remoteAddress":"127.0.0.1","remotePort":54288},"msg":"incoming request"}
{"level":30,"time":1795091197999,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":10.791818000000035,"msg":"request completed"}
{"level":30,"time":1795091198000,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:37715","remoteAddress":"127.0.0.1","remotePort":57804},"msg":"incoming request"}
{"level":30,"time":1795091198010,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":10.000750000000039,"msg":"request completed"}
{"level":30,"time":1795091198011,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/5e9b7793-11e6-49fd-8758-56a22b9ae7b0/send","host":"127.0.0.1:42773","remoteAddress":"127.0.0.1","remotePort":56164},"msg":"incoming request"}
{"level":30,"time":1795091198013,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":403},"responseTime":1.9364039999999818,"msg":"request completed"}
{"level":30,"time":1795091198014,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/5e9b7793-11e6-49fd-8758-56a22b9ae7b0/send","host":"127.0.0.1:45365","remoteAddress":"127.0.0.1","remotePort":46084},"msg":"incoming request"}
{"level":30,"time":1795091198017,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.206591000000003,"msg":"request completed"}
{"level":30,"time":1795091198019,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/2b2ab8b2-b938-4c5c-8ed2-bbae08152961/timeline","host":"127.0.0.1:40177","remoteAddress":"127.0.0.1","remotePort":50430},"msg":"incoming request"}
{"level":30,"time":1795091198021,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.566303000000005,"msg":"request completed"}
{"level":30,"time":1795091198023,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/5e9b7793-11e6-49fd-8758-56a22b9ae7b0/delivery-status","host":"127.0.0.1:41467","remoteAddress":"127.0.0.1","remotePort":54588},"msg":"incoming request"}
{"level":30,"time":1795091198025,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0991260000000125,"msg":"request completed"}
{"level":30,"time":1795091198027,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:41605","remoteAddress":"127.0.0.1","remotePort":54294},"msg":"incoming request"}
{"level":30,"time":1795091198036,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":9.076424999999972,"msg":"request completed"}
{"level":30,"time":1795091198037,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:42159","remoteAddress":"127.0.0.1","remotePort":43082},"msg":"incoming request"}
{"level":30,"time":1795091198039,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":2.3024729999999636,"msg":"request completed"}
{"level":30,"time":1795091198040,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:43411","remoteAddress":"127.0.0.1","remotePort":60760},"msg":"incoming request"}
{"level":30,"time":1795091198046,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":201},"responseTime":5.311387000000025,"msg":"request completed"}
{"level":30,"time":1795091198047,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/816fced2-da4b-484d-807f-4f1099959ce0/send","host":"127.0.0.1:44235","remoteAddress":"127.0.0.1","remotePort":38164},"msg":"incoming request"}
{"level":30,"time":1795091198049,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":400},"responseTime":2.25867199999999,"msg":"request completed"}
{"level":30,"time":1795091198050,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/a9def671-31a5-44e6-a988-4f862047d0e6/approve","host":"127.0.0.1:45091","remoteAddress":"127.0.0.1","remotePort":58194},"msg":"incoming request"}
{"level":30,"time":1795091198052,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":2.0252490000000307,"msg":"request completed"}
{"level":30,"time":1795091198053,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/816fced2-da4b-484d-807f-4f1099959ce0/send","host":"127.0.0.1:42223","remoteAddress":"127.0.0.1","remotePort":32844},"msg":"incoming request"}
{"level":30,"time":1795091198056,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":3.4977409999999622,"msg":"request completed"}
{"level":30,"time":1795091198061,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:33687","remoteAddress":"127.0.0.1","remotePort":57524},"msg":"incoming request"}
{"level":30,"time":1795091198076,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":15.394110000000012,"msg":"request completed"}
{"level":30,"time":1795091198078,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:39597","remoteAddress":"127.0.0.1","remotePort":40158},"msg":"incoming request"}
{"level":30,"time":1795091198090,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":12.413919000000021,"msg":"request completed"}
{"level":30,"time":1795091198092,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/9da9f46e-8146-4375-b2a7-d79f7b3ad8b9/send","host":"127.0.0.1:34127","remoteAddress":"127.0.0.1","remotePort":58014},"msg":"incoming request"}
{"level":30,"time":1795091198095,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":2.980241000000035,"msg":"request completed"}
{"level":30,"time":1795091198096,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:43203","remoteAddress":"127.0.0.1","remotePort":45452},"msg":"incoming request"}
{"level":30,"time":1795091198104,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":8.491579999999999,"msg":"request completed"}
{"level":30,"time":1795091198105,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/ac78a0c6-e6d6-4f89-ab30-0d0bc9c7d19a/send","host":"127.0.0.1:35127","remoteAddress":"127.0.0.1","remotePort":46362},"msg":"incoming request"}
{"level":30,"time":1795091198106,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":403},"responseTime":1.1744300000000294,"msg":"request completed"}
{"level":30,"time":1795091198108,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:35349","remoteAddress":"127.0.0.1","remotePort":39160},"msg":"incoming request"}
{"level":30,"time":1795091198114,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":6.217980000000011,"msg":"request completed"}
{"level":30,"time":1795091198115,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35097","remoteAddress":"127.0.0.1","remotePort":36512},"msg":"incoming request"}
{"level":30,"time":1795091198116,"pid":73148,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":403},"responseTime":1.2891619999999762,"msg":"request completed"}
{"level":30,"time":1795091198179,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38797","remoteAddress":"127.0.0.1","remotePort":47850},"msg":"incoming request"}
{"level":30,"time":1795091198195,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":15.709705999999983,"msg":"request completed"}
{"level":30,"time":1795091198198,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/activation","host":"127.0.0.1:41085","remoteAddress":"127.0.0.1","remotePort":40526},"msg":"incoming request"}
{"level":30,"time":1795091198202,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":422},"responseTime":3.3615279999999643,"msg":"request completed"}
{"level":30,"time":1795091198203,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa","host":"127.0.0.1:33947","remoteAddress":"127.0.0.1","remotePort":40526},"msg":"incoming request"}
{"level":30,"time":1795091198206,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":3.058086000000003,"msg":"request completed"}
{"level":30,"time":1795091198207,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/command-roles","host":"127.0.0.1:42983","remoteAddress":"127.0.0.1","remotePort":35092},"msg":"incoming request"}
{"level":30,"time":1795091198211,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":3.8085480000000302,"msg":"request completed"}
{"level":30,"time":1795091198212,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/activation","host":"127.0.0.1:36637","remoteAddress":"127.0.0.1","remotePort":48350},"msg":"incoming request"}
{"level":30,"time":1795091198216,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":3.773904000000016,"msg":"request completed"}
{"level":30,"time":1795091198217,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/timeline","host":"127.0.0.1:41615","remoteAddress":"127.0.0.1","remotePort":50184},"msg":"incoming request"}
{"level":30,"time":1795091198220,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.869043999999974,"msg":"request completed"}
{"level":30,"time":1795091198222,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/activation","host":"127.0.0.1:41057","remoteAddress":"127.0.0.1","remotePort":53058},"msg":"incoming request"}
{"level":30,"time":1795091198224,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":400},"responseTime":1.8955080000000066,"msg":"request completed"}
{"level":30,"time":1795091198231,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa","host":"127.0.0.1:45481","remoteAddress":"127.0.0.1","remotePort":60834},"msg":"incoming request"}
{"level":30,"time":1795091198235,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":4.325497999999982,"msg":"request completed"}
{"level":30,"time":1795091198236,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/command-roles","host":"127.0.0.1:41877","remoteAddress":"127.0.0.1","remotePort":60628},"msg":"incoming request"}
{"level":30,"time":1795091198239,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.8866270000000327,"msg":"request completed"}
{"level":30,"time":1795091198240,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/timeline","host":"127.0.0.1:42895","remoteAddress":"127.0.0.1","remotePort":36844},"msg":"incoming request"}
{"level":30,"time":1795091198242,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":2.0054420000000164,"msg":"request completed"}
{"level":30,"time":1795091198243,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/closure","host":"127.0.0.1:39353","remoteAddress":"127.0.0.1","remotePort":42342},"msg":"incoming request"}
{"level":30,"time":1795091198247,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":4.275675999999976,"msg":"request completed"}
{"level":30,"time":1795091198248,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/547e6c89-86ec-4d3b-b387-5f691f323baa/timeline","host":"127.0.0.1:45889","remoteAddress":"127.0.0.1","remotePort":57130},"msg":"incoming request"}
{"level":30,"time":1795091198250,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.113040999999953,"msg":"request completed"}
{"level":30,"time":1795091198252,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43747","remoteAddress":"127.0.0.1","remotePort":39902},"msg":"incoming request"}
{"level":30,"time":1795091198255,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":201},"responseTime":3.0926600000000235,"msg":"request completed"}
{"level":30,"time":1795091198256,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/99507e53-e150-45d1-915e-a5d3c8740abf/command-roles","host":"127.0.0.1:35879","remoteAddress":"127.0.0.1","remotePort":50204},"msg":"incoming request"}
{"level":30,"time":1795091198258,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":2.4725990000000024,"msg":"request completed"}
{"level":30,"time":1795091198259,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/99507e53-e150-45d1-915e-a5d3c8740abf/command-roles","host":"127.0.0.1:37311","remoteAddress":"127.0.0.1","remotePort":52972},"msg":"incoming request"}
{"level":30,"time":1795091198262,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":2.313734000000011,"msg":"request completed"}
{"level":30,"time":1795091198263,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/99507e53-e150-45d1-915e-a5d3c8740abf/timeline","host":"127.0.0.1:39967","remoteAddress":"127.0.0.1","remotePort":39820},"msg":"incoming request"}
{"level":30,"time":1795091198265,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":200},"responseTime":2.0649420000000305,"msg":"request completed"}
{"level":30,"time":1795091198266,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42999","remoteAddress":"127.0.0.1","remotePort":44186},"msg":"incoming request"}
{"level":30,"time":1795091198269,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:34755","remoteAddress":"127.0.0.1","remotePort":43024},"msg":"incoming request"}
{"level":30,"time":1795091198277,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":201},"responseTime":10.171307000000013,"msg":"request completed"}
{"level":30,"time":1795091198278,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/4bfc5f97-0728-491b-98ad-e807379ccbb3/activation","host":"127.0.0.1:42003","remoteAddress":"127.0.0.1","remotePort":49634},"msg":"incoming request"}
{"level":30,"time":1795091198279,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6759000000000128,"msg":"request completed"}
{"level":30,"time":1795091198280,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/4bfc5f97-0728-491b-98ad-e807379ccbb3/command-roles","host":"127.0.0.1:41373","remoteAddress":"127.0.0.1","remotePort":47942},"msg":"incoming request"}
{"level":30,"time":1795091198281,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":404},"responseTime":1.327633999999989,"msg":"request completed"}
{"level":30,"time":1795091198282,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/4bfc5f97-0728-491b-98ad-e807379ccbb3/closure","host":"127.0.0.1:35563","remoteAddress":"127.0.0.1","remotePort":38386},"msg":"incoming request"}
{"level":30,"time":1795091198283,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":404},"responseTime":1.1394249999999602,"msg":"request completed"}
{"level":30,"time":1795091198284,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/4bfc5f97-0728-491b-98ad-e807379ccbb3/activation","host":"127.0.0.1:40289","remoteAddress":"127.0.0.1","remotePort":45842},"msg":"incoming request"}
{"level":30,"time":1795091198286,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":200},"responseTime":2.2521090000000186,"msg":"request completed"}
{"level":30,"time":1795091198287,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":17.495370000000037,"msg":"request completed"}
{"level":30,"time":1795091198287,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46145","remoteAddress":"127.0.0.1","remotePort":58172},"msg":"incoming request"}
{"level":30,"time":1795091198289,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af/submit-review","host":"127.0.0.1:43351","remoteAddress":"127.0.0.1","remotePort":59364},"msg":"incoming request"}
{"level":30,"time":1795091198290,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":201},"responseTime":2.8568219999999656,"msg":"request completed"}
{"level":30,"time":1795091198291,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/93ff4de0-aefc-4ef2-a6c4-ad96912bb01a/closure","host":"127.0.0.1:33893","remoteAddress":"127.0.0.1","remotePort":43578},"msg":"incoming request"}
{"level":30,"time":1795091198294,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","res":{"statusCode":200},"responseTime":2.8460420000000113,"msg":"request completed"}
{"level":30,"time":1795091198294,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":4.727423999999985,"msg":"request completed"}
{"level":30,"time":1795091198295,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/93ff4de0-aefc-4ef2-a6c4-ad96912bb01a/closure","host":"127.0.0.1:44819","remoteAddress":"127.0.0.1","remotePort":38936},"msg":"incoming request"}
{"level":30,"time":1795091198296,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af/review","host":"127.0.0.1:35901","remoteAddress":"127.0.0.1","remotePort":54676},"msg":"incoming request"}
{"level":30,"time":1795091198297,"pid":73166,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","res":{"statusCode":409},"responseTime":2.881147999999996,"msg":"request completed"}
{"level":30,"time":1795091198298,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":403},"responseTime":2.241459999999961,"msg":"request completed"}
{"level":30,"time":1795091198299,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af","host":"127.0.0.1:37841","remoteAddress":"127.0.0.1","remotePort":37470},"msg":"incoming request"}
{"level":30,"time":1795091198302,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":2.6073989999999867,"msg":"request completed"}
{"level":30,"time":1795091198303,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af/review","host":"127.0.0.1:34863","remoteAddress":"127.0.0.1","remotePort":60100},"msg":"incoming request"}
{"level":30,"time":1795091198307,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":4.006285999999989,"msg":"request completed"}
{"level":30,"time":1795091198308,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af","host":"127.0.0.1:33097","remoteAddress":"127.0.0.1","remotePort":49016},"msg":"incoming request"}
{"level":30,"time":1795091198310,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.122429000000011,"msg":"request completed"}
{"level":30,"time":1795091198311,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af/sections/9965f16d-4d29-4635-8faf-2655eb418307/link-tasks","host":"127.0.0.1:36455","remoteAddress":"127.0.0.1","remotePort":38158},"msg":"incoming request"}
{"level":30,"time":1795091198313,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":204},"responseTime":2.133118999999965,"msg":"request completed"}
{"level":30,"time":1795091198314,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af","host":"127.0.0.1:37151","remoteAddress":"127.0.0.1","remotePort":37114},"msg":"incoming request"}
{"level":30,"time":1795091198317,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.56825699999996,"msg":"request completed"}
{"level":30,"time":1795091198318,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35673","remoteAddress":"127.0.0.1","remotePort":35190},"msg":"incoming request"}
{"level":30,"time":1795091198338,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":19.973288000000025,"msg":"request completed"}
{"level":30,"time":1795091198339,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/64cb8c52-f84a-406b-abb3-6e5b324638af/materialize-tasks","host":"127.0.0.1:33153","remoteAddress":"127.0.0.1","remotePort":52270},"msg":"incoming request"}
{"level":30,"time":1795091198344,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":4.234128000000055,"msg":"request completed"}
{"level":30,"time":1795091198345,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=a28d6c5e-a406-4729-9976-816f327cca93","host":"127.0.0.1:38053","remoteAddress":"127.0.0.1","remotePort":37934},"msg":"incoming request"}
{"level":30,"time":1795091198348,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.5577169999999683,"msg":"request completed"}
{"level":30,"time":1795091198349,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:44553","remoteAddress":"127.0.0.1","remotePort":35414},"msg":"incoming request"}
{"level":30,"time":1795091198352,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":201},"responseTime":2.725949999999955,"msg":"request completed"}
{"level":30,"time":1795091198353,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/cfc7a0d8-52fb-4246-9799-9c2e8691abb4/review","host":"127.0.0.1:44343","remoteAddress":"127.0.0.1","remotePort":59692},"msg":"incoming request"}
{"level":30,"time":1795091198355,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":409},"responseTime":1.809488999999985,"msg":"request completed"}
{"level":30,"time":1795091198355,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42241","remoteAddress":"127.0.0.1","remotePort":44846},"msg":"incoming request"}
{"level":30,"time":1795091198358,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":201},"responseTime":2.1861180000000218,"msg":"request completed"}
{"level":30,"time":1795091198358,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/ffe37960-806b-4694-8ca1-e6fb31ae535c/submit-review","host":"127.0.0.1:37003","remoteAddress":"127.0.0.1","remotePort":53728},"msg":"incoming request"}
{"level":30,"time":1795091198360,"pid":73196,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":422},"responseTime":1.449940999999967,"msg":"request completed"}
{"level":30,"time":1795091198451,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40587","remoteAddress":"127.0.0.1","remotePort":50320},"msg":"incoming request"}
{"level":30,"time":1795091198480,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":29.11142799999999,"msg":"request completed"}
{"level":30,"time":1795091198484,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34167","remoteAddress":"127.0.0.1","remotePort":55922},"msg":"incoming request"}
{"level":30,"time":1795091198490,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":5.791108000000008,"msg":"request completed"}
{"level":30,"time":1795091198492,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/6b790a06-d494-45d3-9e5c-069edaa80f0d/sitreps","host":"127.0.0.1:33843","remoteAddress":"127.0.0.1","remotePort":59126},"msg":"incoming request"}
{"level":30,"time":1795091198496,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":4.7382840000000215,"msg":"request completed"}
{"level":30,"time":1795091198498,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44421","remoteAddress":"127.0.0.1","remotePort":39516},"msg":"incoming request"}
{"level":30,"time":1795091198502,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":4.083357999999976,"msg":"request completed"}
{"level":30,"time":1795091198504,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/8b62e70d-687e-4a7c-b858-081ea7ef3206/aar","host":"127.0.0.1:43029","remoteAddress":"127.0.0.1","remotePort":45760},"msg":"incoming request"}
{"level":30,"time":1795091198506,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":409},"responseTime":2.0364789999999857,"msg":"request completed"}
{"level":30,"time":1795091198507,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/8b62e70d-687e-4a7c-b858-081ea7ef3206/closure","host":"127.0.0.1:37915","remoteAddress":"127.0.0.1","remotePort":46634},"msg":"incoming request"}
{"level":30,"time":1795091198512,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":4.942673000000013,"msg":"request completed"}
{"level":30,"time":1795091198513,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/8b62e70d-687e-4a7c-b858-081ea7ef3206/aar","host":"127.0.0.1:40959","remoteAddress":"127.0.0.1","remotePort":51438},"msg":"incoming request"}
{"level":30,"time":1795091198518,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":4.569390999999996,"msg":"request completed"}
{"level":30,"time":1795091198519,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44435","remoteAddress":"127.0.0.1","remotePort":57216},"msg":"incoming request"}
{"level":30,"time":1795091198538,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":18.246274000000028,"msg":"request completed"}
{"level":30,"time":1795091198539,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/85240f3c-eb24-4ad4-bba1-5f31d3051188/closure","host":"127.0.0.1:34077","remoteAddress":"127.0.0.1","remotePort":40948},"msg":"incoming request"}
{"level":30,"time":1795091198543,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":4.153708999999992,"msg":"request completed"}
{"level":30,"time":1795091198544,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/85240f3c-eb24-4ad4-bba1-5f31d3051188/aar","host":"127.0.0.1:40571","remoteAddress":"127.0.0.1","remotePort":46206},"msg":"incoming request"}
{"level":30,"time":1795091198546,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":422},"responseTime":2.0090390000000298,"msg":"request completed"}
{"level":30,"time":1795091198548,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37089","remoteAddress":"127.0.0.1","remotePort":35604},"msg":"incoming request"}
{"level":30,"time":1795091198552,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":201},"responseTime":3.8758230000000253,"msg":"request completed"}
{"level":30,"time":1795091198553,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/62073ae6-b1de-4ad8-be73-1b336d5f8ca8/closure","host":"127.0.0.1:38319","remoteAddress":"127.0.0.1","remotePort":51666},"msg":"incoming request"}
{"level":30,"time":1795091198556,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":3.2058299999999917,"msg":"request completed"}
{"level":30,"time":1795091198557,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/62073ae6-b1de-4ad8-be73-1b336d5f8ca8/aar","host":"127.0.0.1:41907","remoteAddress":"127.0.0.1","remotePort":51554},"msg":"incoming request"}
{"level":30,"time":1795091198560,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":201},"responseTime":3.3445370000000025,"msg":"request completed"}
{"level":30,"time":1795091198561,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/62073ae6-b1de-4ad8-be73-1b336d5f8ca8/aar/04a8b117-bf8c-4628-8d76-cdafda72384f/finalize","host":"127.0.0.1:39895","remoteAddress":"127.0.0.1","remotePort":56966},"msg":"incoming request"}
{"level":30,"time":1795091198564,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":3.1216340000000287,"msg":"request completed"}
{"level":30,"time":1795091198565,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/62073ae6-b1de-4ad8-be73-1b336d5f8ca8/aar/04a8b117-bf8c-4628-8d76-cdafda72384f/finalize","host":"127.0.0.1:33261","remoteAddress":"127.0.0.1","remotePort":59958},"msg":"incoming request"}
{"level":30,"time":1795091198567,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":403},"responseTime":1.8246270000000209,"msg":"request completed"}
{"level":30,"time":1795091198568,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43897","remoteAddress":"127.0.0.1","remotePort":58200},"msg":"incoming request"}
{"level":30,"time":1795091198578,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":201},"responseTime":9.332490000000007,"msg":"request completed"}
{"level":30,"time":1795091198579,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/92fc1b9b-6e28-4f3d-97da-1423cd546036/closure","host":"127.0.0.1:41089","remoteAddress":"127.0.0.1","remotePort":34034},"msg":"incoming request"}
{"level":30,"time":1795091198582,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":3.03722700000003,"msg":"request completed"}
{"level":30,"time":1795091198583,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/92fc1b9b-6e28-4f3d-97da-1423cd546036/aar","host":"127.0.0.1:45571","remoteAddress":"127.0.0.1","remotePort":49122},"msg":"incoming request"}
{"level":30,"time":1795091198586,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":201},"responseTime":3.4436210000000074,"msg":"request completed"}
{"level":30,"time":1795091198587,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/92fc1b9b-6e28-4f3d-97da-1423cd546036/aar/1c489dde-70de-49c9-9fe7-f2fecf9d912f/finalize","host":"127.0.0.1:40667","remoteAddress":"127.0.0.1","remotePort":50012},"msg":"incoming request"}
{"level":30,"time":1795091198590,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":200},"responseTime":2.6274870000000305,"msg":"request completed"}
{"level":30,"time":1795091198591,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=982fd187-8da0-497d-b43f-7cbfe6a5dc59&page_size=200","host":"127.0.0.1:46439","remoteAddress":"127.0.0.1","remotePort":54116},"msg":"incoming request"}
{"level":30,"time":1795091198594,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":200},"responseTime":2.804986000000042,"msg":"request completed"}
{"level":30,"time":1795091198595,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:43037","remoteAddress":"127.0.0.1","remotePort":46306},"msg":"incoming request"}
{"level":30,"time":1795091198596,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":403},"responseTime":1.224964,"msg":"request completed"}
{"level":30,"time":1795091198597,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:37487","remoteAddress":"127.0.0.1","remotePort":42484},"msg":"incoming request"}
{"level":30,"time":1795091198600,"pid":73221,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":200},"responseTime":3.073734999999999,"msg":"request completed"}
{"level":30,"time":1795091198658,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:34557","remoteAddress":"127.0.0.1","remotePort":45770},"msg":"incoming request"}
{"level":30,"time":1795091198676,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":17.04612599999996,"msg":"request completed"}
{"level":30,"time":1795091198679,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:33429","remoteAddress":"127.0.0.1","remotePort":44960},"msg":"incoming request"}
{"level":30,"time":1795091198681,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":2.7242459999999937,"msg":"request completed"}
{"level":30,"time":1795091198683,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:39011","remoteAddress":"127.0.0.1","remotePort":40942},"msg":"incoming request"}
{"level":30,"time":1795091198685,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":422},"responseTime":1.8959789999999543,"msg":"request completed"}
{"level":30,"time":1795091198686,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33627","remoteAddress":"127.0.0.1","remotePort":34826},"msg":"incoming request"}
{"level":30,"time":1795091198692,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":5.0495919999999614,"msg":"request completed"}
{"level":30,"time":1795091198693,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:35247","remoteAddress":"127.0.0.1","remotePort":49002},"msg":"incoming request"}
{"level":30,"time":1795091198697,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":4.041229999999985,"msg":"request completed"}
{"level":30,"time":1795091198699,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/sync-conflicts/dfdbb08e-9d9d-4e5b-ba6d-8556537f8652/resolve","host":"127.0.0.1:45181","remoteAddress":"127.0.0.1","remotePort":43290},"msg":"incoming request"}
{"level":30,"time":1795091198702,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.918376999999964,"msg":"request completed"}
{"level":30,"time":1795091198702,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:39615","remoteAddress":"127.0.0.1","remotePort":53878},"msg":"incoming request"}
{"level":30,"time":1795091198703,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/64b6612c-2a41-42f7-b446-89668a0b8c21/timeline","host":"127.0.0.1:44285","remoteAddress":"127.0.0.1","remotePort":48640},"msg":"incoming request"}
{"level":30,"time":1795091198706,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.562945999999954,"msg":"request completed"}
{"level":30,"time":1795091198707,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/sync-conflicts/dfdbb08e-9d9d-4e5b-ba6d-8556537f8652/resolve","host":"127.0.0.1:36619","remoteAddress":"127.0.0.1","remotePort":43304},"msg":"incoming request"}
{"level":30,"time":1795091198709,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":409},"responseTime":2.130884999999978,"msg":"request completed"}
{"level":30,"time":1795091198709,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":6.59314599999999,"msg":"request completed"}
{"level":30,"time":1795091198712,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:32773","remoteAddress":"127.0.0.1","remotePort":34324},"msg":"incoming request"}
{"level":30,"time":1795091198713,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:36229","remoteAddress":"127.0.0.1","remotePort":34230},"msg":"incoming request"}
{"level":30,"time":1795091198715,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.842706000000021,"msg":"request completed"}
{"level":30,"time":1795091198717,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42725","remoteAddress":"127.0.0.1","remotePort":48280},"msg":"incoming request"}
{"level":30,"time":1795091198720,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":201},"responseTime":3.6140170000000467,"msg":"request completed"}
{"level":30,"time":1795091198722,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:42111","remoteAddress":"127.0.0.1","remotePort":58616},"msg":"incoming request"}
{"level":30,"time":1795091198722,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":9.36114299999997,"msg":"request completed"}
{"level":30,"time":1795091198735,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43785","remoteAddress":"127.0.0.1","remotePort":44490},"msg":"incoming request"}
{"level":30,"time":1795091198737,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":2.472377999999992,"msg":"request completed"}
{"level":30,"time":1795091198737,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":15.220188000000007,"msg":"request completed"}
{"level":30,"time":1795091198738,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"POST","url":"/api/v1/sync-conflicts/8a353b3f-4ef3-4d0a-bc7e-21480e8fa78c/resolve","host":"127.0.0.1:35537","remoteAddress":"127.0.0.1","remotePort":44558},"msg":"incoming request"}
{"level":30,"time":1795091198738,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/d801156c-7728-4342-93fe-4847fd874017","host":"127.0.0.1:42735","remoteAddress":"127.0.0.1","remotePort":58032},"msg":"incoming request"}
{"level":30,"time":1795091198741,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":2.8426560000000336,"msg":"request completed"}
{"level":30,"time":1795091198741,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":2.9309090000000424,"msg":"request completed"}
{"level":30,"time":1795091198742,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36763","remoteAddress":"127.0.0.1","remotePort":48324},"msg":"incoming request"}
{"level":30,"time":1795091198742,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":401},"responseTime":0.5087740000000167,"msg":"request completed"}
{"level":30,"time":1795091198743,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:44755","remoteAddress":"127.0.0.1","remotePort":48532},"msg":"incoming request"}
{"level":30,"time":1795091198744,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35027","remoteAddress":"127.0.0.1","remotePort":55644},"msg":"incoming request"}
{"level":30,"time":1795091198745,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":403},"responseTime":1.9450989999999706,"msg":"request completed"}
{"level":30,"time":1795091198746,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/sync-conflicts","host":"127.0.0.1:33719","remoteAddress":"127.0.0.1","remotePort":33906},"msg":"incoming request"}
{"level":30,"time":1795091198746,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":403},"responseTime":1.7615490000000023,"msg":"request completed"}
{"level":30,"time":1795091198747,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/8c257962-6ced-46b5-b7a3-f0d6e40ebb93","host":"127.0.0.1:39101","remoteAddress":"127.0.0.1","remotePort":38796},"msg":"incoming request"}
{"level":30,"time":1795091198748,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":2.3832629999999995,"msg":"request completed"}
{"level":30,"time":1795091198750,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43791","remoteAddress":"127.0.0.1","remotePort":48896},"msg":"incoming request"}
{"level":30,"time":1795091198752,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":4.646211999999991,"msg":"request completed"}
{"level":30,"time":1795091198753,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-f","res":{"statusCode":201},"responseTime":2.8036430000000223,"msg":"request completed"}
{"level":30,"time":1795091198753,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35495","remoteAddress":"127.0.0.1","remotePort":51876},"msg":"incoming request"}
{"level":30,"time":1795091198754,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:45219","remoteAddress":"127.0.0.1","remotePort":35622},"msg":"incoming request"}
{"level":30,"time":1795091198756,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-g","res":{"statusCode":200},"responseTime":1.9987500000000296,"msg":"request completed"}
{"level":30,"time":1795091198756,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.9854200000000333,"msg":"request completed"}
{"level":30,"time":1795091198757,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","req":{"method":"GET","url":"/api/v1/sync-conflicts?page_size=100","host":"127.0.0.1:40259","remoteAddress":"127.0.0.1","remotePort":35120},"msg":"incoming request"}
{"level":30,"time":1795091198758,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=97a95980-f298-4e2c-86ba-656a4fd7a132&page_size=50","host":"127.0.0.1:45473","remoteAddress":"127.0.0.1","remotePort":50000},"msg":"incoming request"}
{"level":30,"time":1795091198760,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-h","res":{"statusCode":200},"responseTime":2.0449259999999754,"msg":"request completed"}
{"level":30,"time":1795091198760,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":1.8953980000000001,"msg":"request completed"}
{"level":30,"time":1795091198761,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","req":{"method":"GET","url":"/api/v1/sync-conflicts/cce94faa-2566-45fd-871d-3354ad9d5cfb","host":"127.0.0.1:45813","remoteAddress":"127.0.0.1","remotePort":58066},"msg":"incoming request"}
{"level":30,"time":1795091198761,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:34417","remoteAddress":"127.0.0.1","remotePort":45656},"msg":"incoming request"}
{"level":30,"time":1795091198762,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-i","res":{"statusCode":404},"responseTime":1.731873999999948,"msg":"request completed"}
{"level":30,"time":1795091198763,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":403},"responseTime":1.352579999999989,"msg":"request completed"}
{"level":30,"time":1795091198763,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","req":{"method":"POST","url":"/api/v1/sync-conflicts/cce94faa-2566-45fd-871d-3354ad9d5cfb/resolve","host":"127.0.0.1:38481","remoteAddress":"127.0.0.1","remotePort":43082},"msg":"incoming request"}
{"level":30,"time":1795091198764,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:45853","remoteAddress":"127.0.0.1","remotePort":45774},"msg":"incoming request"}
{"level":30,"time":1795091198765,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-j","res":{"statusCode":404},"responseTime":1.420375999999976,"msg":"request completed"}
{"level":30,"time":1795091198766,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":1.5367420000000038,"msg":"request completed"}
{"level":30,"time":1795091198766,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","req":{"method":"GET","url":"/api/v1/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/photos/0e3401cf-0303-4f4c-8677-85eef48e5cf5","host":"127.0.0.1:34777","remoteAddress":"127.0.0.1","remotePort":53904},"msg":"incoming request"}
{"level":30,"time":1795091198766,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:41367","remoteAddress":"127.0.0.1","remotePort":42610},"msg":"incoming request"}
{"level":30,"time":1795091198767,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-k","res":{"statusCode":404},"responseTime":1.5018269999999916,"msg":"request completed"}
{"level":30,"time":1795091198769,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":422},"responseTime":2.040596999999991,"msg":"request completed"}
{"level":30,"time":1795091198769,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","req":{"method":"POST","url":"/api/v1/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/photos","host":"127.0.0.1:39321","remoteAddress":"127.0.0.1","remotePort":58012},"msg":"incoming request"}
{"level":30,"time":1795091198769,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37643","remoteAddress":"127.0.0.1","remotePort":47252},"msg":"incoming request"}
{"level":30,"time":1795091198775,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-l","res":{"statusCode":404},"responseTime":6.0222160000000144,"msg":"request completed"}
{"level":30,"time":1795091198776,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":6.687382000000014,"msg":"request completed"}
{"level":30,"time":1795091198776,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","req":{"method":"GET","url":"/api/v1/sync-conflicts/cce94faa-2566-45fd-871d-3354ad9d5cfb","host":"127.0.0.1:33015","remoteAddress":"127.0.0.1","remotePort":41028},"msg":"incoming request"}
{"level":30,"time":1795091198777,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=97a95980-f298-4e2c-86ba-656a4fd7a132&action_type=record_view","host":"127.0.0.1:33757","remoteAddress":"127.0.0.1","remotePort":35790},"msg":"incoming request"}
{"level":30,"time":1795091198778,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-m","res":{"statusCode":200},"responseTime":1.73098200000004,"msg":"request completed"}
{"level":30,"time":1795091198779,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","req":{"method":"GET","url":"/api/v1/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/photos/0e3401cf-0303-4f4c-8677-85eef48e5cf5","host":"127.0.0.1:44701","remoteAddress":"127.0.0.1","remotePort":55956},"msg":"incoming request"}
{"level":30,"time":1795091198779,"pid":73246,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":1.7621110000000044,"msg":"request completed"}
{"level":50,"time":1795091198781,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","err":{"type":"Error","message":"ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/f0501-test.jpg'","stack":"Error: ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/f0501-test.jpg'\n    at async open (node:internal/fs/promises:637:25)\n    at async readFile (node:internal/fs/promises:1249:14)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/field-reports.ts:420:24)","errno":-2,"code":"ENOENT","syscall":"open","path":"/home/daytona/project/backend/uploads/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/f0501-test.jpg"},"msg":"Field report photo read failed for photo_id=0e3401cf-0303-4f4c-8677-85eef48e5cf5"}
{"level":30,"time":1795091198782,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-n","res":{"statusCode":404},"responseTime":3.3698739999999816,"msg":"request completed"}
{"level":30,"time":1795091198784,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","req":{"method":"POST","url":"/api/v1/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/photos","host":"127.0.0.1:43285","remoteAddress":"127.0.0.1","remotePort":36398},"msg":"incoming request"}
{"level":30,"time":1795091198788,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-o","res":{"statusCode":204},"responseTime":3.9919189999999958,"msg":"request completed"}
{"level":30,"time":1795091198789,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-p","req":{"method":"GET","url":"/api/v1/field-reports/a26cf1e6-14f7-4524-8ef9-571d61561dc1/photos/f3241ad9-9cb9-494e-99ef-aa951573b622","host":"127.0.0.1:41407","remoteAddress":"127.0.0.1","remotePort":48892},"msg":"incoming request"}
{"level":30,"time":1795091198790,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-p","res":{"statusCode":200},"responseTime":1.6929020000000037,"msg":"request completed"}
{"level":30,"time":1795091198791,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-q","req":{"method":"POST","url":"/api/v1/sync-conflicts/cce94faa-2566-45fd-871d-3354ad9d5cfb/resolve","host":"127.0.0.1:38991","remoteAddress":"127.0.0.1","remotePort":40826},"msg":"incoming request"}
{"level":30,"time":1795091198793,"pid":73235,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-q","res":{"statusCode":200},"responseTime":2.2883770000000254,"msg":"request completed"}
{"level":30,"time":1795091198957,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:37943","remoteAddress":"127.0.0.1","remotePort":43928},"msg":"incoming request"}
{"level":30,"time":1795091198999,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":41.84556199999997,"msg":"request completed"}
{"level":30,"time":1795091199002,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:34131","remoteAddress":"127.0.0.1","remotePort":55090},"msg":"incoming request"}
{"level":30,"time":1795091199005,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":3.281671000000017,"msg":"request completed"}
{"level":30,"time":1795091199007,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:33305","remoteAddress":"127.0.0.1","remotePort":56290},"msg":"incoming request"}
{"level":30,"time":1795091199010,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":400},"responseTime":2.7023550000000114,"msg":"request completed"}
{"level":30,"time":1795091199012,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:34219","remoteAddress":"127.0.0.1","remotePort":35918},"msg":"incoming request"}
{"level":30,"time":1795091199016,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":4.505671999999947,"msg":"request completed"}
{"level":30,"time":1795091199018,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/b8eaf193-8421-4ece-aa49-233202686e6e/revoke","host":"127.0.0.1:33749","remoteAddress":"127.0.0.1","remotePort":36114},"msg":"incoming request"}
{"level":30,"time":1795091199039,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":204},"responseTime":20.37752999999998,"msg":"request completed"}
{"level":30,"time":1795091199041,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43021","remoteAddress":"127.0.0.1","remotePort":37240},"msg":"incoming request"}
{"level":30,"time":1795091199044,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.908908999999994,"msg":"request completed"}
{"level":30,"time":1795091199045,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:46345","remoteAddress":"127.0.0.1","remotePort":56238},"msg":"incoming request"}
{"level":30,"time":1795091199047,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":1.8364579999999933,"msg":"request completed"}
{"level":30,"time":1795091199048,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34559","remoteAddress":"127.0.0.1","remotePort":54882},"msg":"incoming request"}
{"level":30,"time":1795091199051,"pid":73258,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.2413199999999733,"msg":"request completed"}
{"level":30,"time":1795091199128,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43185","remoteAddress":"127.0.0.1","remotePort":57582},"msg":"incoming request"}
{"level":30,"time":1795091199140,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38253","remoteAddress":"127.0.0.1","remotePort":35756},"msg":"incoming request"}
{"level":30,"time":1795091199144,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":16.372276999999997,"msg":"request completed"}
{"level":30,"time":1795091199148,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms","host":"127.0.0.1:37073","remoteAddress":"127.0.0.1","remotePort":42466},"msg":"incoming request"}
{"level":30,"time":1795091199152,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":4.174046000000033,"msg":"request completed"}
{"level":30,"time":1795091199154,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms/487f3b77-0fb3-4636-91e4-6c095dccd5d9/approve","host":"127.0.0.1:45345","remoteAddress":"127.0.0.1","remotePort":46408},"msg":"incoming request"}
{"level":30,"time":1795091199156,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":403},"responseTime":2.3495300000000157,"msg":"request completed"}
{"level":30,"time":1795091199157,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":16.904224,"msg":"request completed"}
{"level":30,"time":1795091199158,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38949","remoteAddress":"127.0.0.1","remotePort":45408},"msg":"incoming request"}
{"level":30,"time":1795091199160,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":2.3063300000000027,"msg":"request completed"}
{"level":30,"time":1795091199161,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms/487f3b77-0fb3-4636-91e4-6c095dccd5d9/approve","host":"127.0.0.1:38603","remoteAddress":"127.0.0.1","remotePort":42920},"msg":"incoming request"}
{"level":30,"time":1795091199178,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/e69a201b-a62f-4724-8f8b-9741dff107c2/timeline","host":"127.0.0.1:45523","remoteAddress":"127.0.0.1","remotePort":42488},"msg":"incoming request"}
{"level":30,"time":1795091199178,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":16.74955600000004,"msg":"request completed"}
{"level":30,"time":1795091199179,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/timeline","host":"127.0.0.1:38245","remoteAddress":"127.0.0.1","remotePort":42100},"msg":"incoming request"}
{"level":30,"time":1795091199181,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1545340000000124,"msg":"request completed"}
{"level":30,"time":1795091199183,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":3.048278000000039,"msg":"request completed"}
{"level":30,"time":1795091199184,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37611","remoteAddress":"127.0.0.1","remotePort":33562},"msg":"incoming request"}
{"level":30,"time":1795091199186,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40679","remoteAddress":"127.0.0.1","remotePort":51812},"msg":"incoming request"}
{"level":30,"time":1795091199186,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9471529999999575,"msg":"request completed"}
{"level":30,"time":1795091199188,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms","host":"127.0.0.1:34605","remoteAddress":"127.0.0.1","remotePort":45982},"msg":"incoming request"}
{"level":30,"time":1795091199190,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":3.7191229999999678,"msg":"request completed"}
{"level":30,"time":1795091199190,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":201},"responseTime":2.3657210000000077,"msg":"request completed"}
{"level":30,"time":1795091199191,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms/08ef3d3e-7919-4e25-bcc7-4fa6556b3605/approve","host":"127.0.0.1:38127","remoteAddress":"127.0.0.1","remotePort":42684},"msg":"incoming request"}
{"level":30,"time":1795091199192,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/235ec055-fe5c-4da1-85cd-300395144f17/closure","host":"127.0.0.1:44031","remoteAddress":"127.0.0.1","remotePort":51958},"msg":"incoming request"}
{"level":30,"time":1795091199194,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":400},"responseTime":2.70192499999996,"msg":"request completed"}
{"level":30,"time":1795091199196,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33599","remoteAddress":"127.0.0.1","remotePort":41462},"msg":"incoming request"}
{"level":30,"time":1795091199197,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":5.569195999999977,"msg":"request completed"}
{"level":30,"time":1795091199198,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":200},"responseTime":2.2907319999999913,"msg":"request completed"}
{"level":30,"time":1795091199199,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/235ec055-fe5c-4da1-85cd-300395144f17/timeline","host":"127.0.0.1:41665","remoteAddress":"127.0.0.1","remotePort":49370},"msg":"incoming request"}
{"level":30,"time":1795091199199,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms/08ef3d3e-7919-4e25-bcc7-4fa6556b3605/approve","host":"127.0.0.1:36663","remoteAddress":"127.0.0.1","remotePort":46204},"msg":"incoming request"}
{"level":30,"time":1795091199201,"pid":73278,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.114463999999998,"msg":"request completed"}
{"level":30,"time":1795091199202,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.8477450000000317,"msg":"request completed"}
{"level":30,"time":1795091199204,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44717","remoteAddress":"127.0.0.1","remotePort":57048},"msg":"incoming request"}
{"level":30,"time":1795091199206,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":200},"responseTime":1.6257170000000087,"msg":"request completed"}
{"level":30,"time":1795091199207,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/5f41f40c-d950-4d14-a46c-f900d7ceb1cd/ics-forms/487f3b77-0fb3-4636-91e4-6c095dccd5d9/approve","host":"127.0.0.1:37013","remoteAddress":"127.0.0.1","remotePort":54640},"msg":"incoming request"}
{"level":30,"time":1795091199208,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":403},"responseTime":1.2417149999999992,"msg":"request completed"}
{"level":30,"time":1795091199209,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"GET","url":"/api/v1/dashboard/summary","host":"127.0.0.1:45293","remoteAddress":"127.0.0.1","remotePort":50886},"msg":"incoming request"}
{"level":30,"time":1795091199212,"pid":73271,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":2.786000999999999,"msg":"request completed"}
{"level":30,"time":1795091199384,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39475","remoteAddress":"127.0.0.1","remotePort":37682},"msg":"incoming request"}
{"level":30,"time":1795091199400,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":201},"responseTime":15.499787000000026,"msg":"request completed"}
{"level":30,"time":1795091199404,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41705","remoteAddress":"127.0.0.1","remotePort":50956},"msg":"incoming request"}
{"level":30,"time":1795091199408,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":201},"responseTime":4.254255000000001,"msg":"request completed"}
{"level":30,"time":1795091199409,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:43073","remoteAddress":"127.0.0.1","remotePort":47850},"msg":"incoming request"}
{"level":30,"time":1795091199413,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":3.92640700000004,"msg":"request completed"}
{"level":30,"time":1795091199415,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40897","remoteAddress":"127.0.0.1","remotePort":43474},"msg":"incoming request"}
{"level":30,"time":1795091199436,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":20.643934,"msg":"request completed"}
{"level":30,"time":1795091199438,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:40591","remoteAddress":"127.0.0.1","remotePort":41360},"msg":"incoming request"}
{"level":30,"time":1795091199440,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.4300300000000448,"msg":"request completed"}
{"level":30,"time":1795091199442,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:35091","remoteAddress":"127.0.0.1","remotePort":42044},"msg":"incoming request"}
{"level":30,"time":1795091199444,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3599289999999655,"msg":"request completed"}
{"level":30,"time":1795091199446,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41299","remoteAddress":"127.0.0.1","remotePort":42482},"msg":"incoming request"}
{"level":30,"time":1795091199448,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":2.0012040000000297,"msg":"request completed"}
{"level":30,"time":1795091199449,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:40633","remoteAddress":"127.0.0.1","remotePort":37458},"msg":"incoming request"}
{"level":30,"time":1795091199451,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.122920000000022,"msg":"request completed"}
{"level":30,"time":1795091199452,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:38811","remoteAddress":"127.0.0.1","remotePort":41284},"msg":"incoming request"}
{"level":30,"time":1795091199454,"pid":73330,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":200},"responseTime":1.746360999999979,"msg":"request completed"}
{"level":30,"time":1795091199533,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40925","remoteAddress":"127.0.0.1","remotePort":49690},"msg":"incoming request"}
{"level":30,"time":1795091199534,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40133","remoteAddress":"127.0.0.1","remotePort":55790},"msg":"incoming request"}
{"level":30,"time":1795091199540,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":200},"responseTime":6.868016999999952,"msg":"request completed"}
{"level":30,"time":1795091199540,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":422},"responseTime":6.16139499999997,"msg":"request completed"}
{"level":30,"time":1795091199543,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36017","remoteAddress":"127.0.0.1","remotePort":48138},"msg":"incoming request"}
{"level":30,"time":1795091199543,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":401},"responseTime":0.22395599999998694,"msg":"request completed"}
{"level":30,"time":1795091199544,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39361","remoteAddress":"127.0.0.1","remotePort":35568},"msg":"incoming request"}
{"level":30,"time":1795091199546,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:41821","remoteAddress":"127.0.0.1","remotePort":49798},"msg":"incoming request"}
{"level":30,"time":1795091199546,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":422},"responseTime":2.325305999999955,"msg":"request completed"}
{"level":30,"time":1795091199547,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36451","remoteAddress":"127.0.0.1","remotePort":49730},"msg":"incoming request"}
{"level":30,"time":1795091199549,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":3.602616000000012,"msg":"request completed"}
{"level":30,"time":1795091199551,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46831","remoteAddress":"127.0.0.1","remotePort":49818},"msg":"incoming request"}
{"level":30,"time":1795091199553,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":201},"responseTime":5.101147000000026,"msg":"request completed"}
{"level":30,"time":1795091199553,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":2.110227000000009,"msg":"request completed"}
{"level":30,"time":1795091199554,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41411","remoteAddress":"127.0.0.1","remotePort":54566},"msg":"incoming request"}
{"level":30,"time":1795091199554,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37503","remoteAddress":"127.0.0.1","remotePort":37904},"msg":"incoming request"}
{"level":30,"time":1795091199556,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":2.25690800000001,"msg":"request completed"}
{"level":30,"time":1795091199558,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41063","remoteAddress":"127.0.0.1","remotePort":54628},"msg":"incoming request"}
{"level":30,"time":1795091199575,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":401},"responseTime":17.155939999999987,"msg":"request completed"}
{"level":30,"time":1795091199576,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":201},"responseTime":21.907017999999994,"msg":"request completed"}
{"level":30,"time":1795091199577,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:44509","remoteAddress":"127.0.0.1","remotePort":59766},"msg":"incoming request"}
{"level":30,"time":1795091199577,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33643","remoteAddress":"127.0.0.1","remotePort":33706},"msg":"incoming request"}
{"level":30,"time":1795091199581,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":4.163117,"msg":"request completed"}
{"level":30,"time":1795091199583,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":201},"responseTime":5.507460999999978,"msg":"request completed"}
{"level":30,"time":1795091199584,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/5106813d-abaf-4612-8840-c91092d7ea8a/timeline","host":"127.0.0.1:42873","remoteAddress":"127.0.0.1","remotePort":58006},"msg":"incoming request"}
{"level":30,"time":1795091199585,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:45409","remoteAddress":"127.0.0.1","remotePort":36294},"msg":"incoming request"}
{"level":30,"time":1795091199587,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":1.5114350000000059,"msg":"request completed"}
{"level":30,"time":1795091199587,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":2.8190519999999992,"msg":"request completed"}
{"level":30,"time":1795091199588,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45203","remoteAddress":"127.0.0.1","remotePort":54242},"msg":"incoming request"}
{"level":30,"time":1795091199590,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:43699","remoteAddress":"127.0.0.1","remotePort":45272},"msg":"incoming request"}
{"level":30,"time":1795091199591,"pid":73343,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":401},"responseTime":1.210567000000026,"msg":"request completed"}
{"level":30,"time":1795091199591,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":201},"responseTime":2.9982540000000313,"msg":"request completed"}
{"level":30,"time":1795091199592,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/5e97691f-ac00-44f8-90a6-52163f749a89/status","host":"127.0.0.1:46641","remoteAddress":"127.0.0.1","remotePort":57278},"msg":"incoming request"}
{"level":30,"time":1795091199594,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":409},"responseTime":2.0161920000000464,"msg":"request completed"}
{"level":30,"time":1795091199596,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40759","remoteAddress":"127.0.0.1","remotePort":55620},"msg":"incoming request"}
{"level":30,"time":1795091199599,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-9","res":{"statusCode":201},"responseTime":2.5556330000000003,"msg":"request completed"}
{"level":30,"time":1795091199600,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/8d125b58-4dd6-41d1-9a20-72c4de5c6ec4/status","host":"127.0.0.1:46103","remoteAddress":"127.0.0.1","remotePort":60060},"msg":"incoming request"}
{"level":30,"time":1795091199601,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-a","res":{"statusCode":409},"responseTime":1.6490309999999795,"msg":"request completed"}
{"level":30,"time":1795091199602,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/8d125b58-4dd6-41d1-9a20-72c4de5c6ec4/status","host":"127.0.0.1:45447","remoteAddress":"127.0.0.1","remotePort":48516},"msg":"incoming request"}
{"level":30,"time":1795091199605,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-b","res":{"statusCode":200},"responseTime":2.8124690000000214,"msg":"request completed"}
{"level":30,"time":1795091199606,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/8d125b58-4dd6-41d1-9a20-72c4de5c6ec4/status","host":"127.0.0.1:44593","remoteAddress":"127.0.0.1","remotePort":40994},"msg":"incoming request"}
{"level":30,"time":1795091199608,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-c","res":{"statusCode":409},"responseTime":1.7342689999999834,"msg":"request completed"}
{"level":30,"time":1795091199608,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/8d125b58-4dd6-41d1-9a20-72c4de5c6ec4/status","host":"127.0.0.1:35527","remoteAddress":"127.0.0.1","remotePort":56936},"msg":"incoming request"}
{"level":30,"time":1795091199612,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-d","res":{"statusCode":200},"responseTime":3.474439000000018,"msg":"request completed"}
{"level":30,"time":1795091199613,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/8d125b58-4dd6-41d1-9a20-72c4de5c6ec4/status","host":"127.0.0.1:37929","remoteAddress":"127.0.0.1","remotePort":33876},"msg":"incoming request"}
{"level":30,"time":1795091199617,"pid":73350,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-e","res":{"statusCode":200},"responseTime":3.476370999999972,"msg":"request completed"}
{"level":30,"time":1795091199741,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:45745","remoteAddress":"127.0.0.1","remotePort":33928},"msg":"incoming request"}
{"level":30,"time":1795091199752,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":200},"responseTime":10.302431000000013,"msg":"request completed"}
{"level":30,"time":1795091199755,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:36365","remoteAddress":"127.0.0.1","remotePort":58436},"msg":"incoming request"}
{"level":30,"time":1795091199757,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":200},"responseTime":1.9086829999999964,"msg":"request completed"}
{"level":30,"time":1795091199759,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:45709","remoteAddress":"127.0.0.1","remotePort":51584},"msg":"incoming request"}
{"level":30,"time":1795091199761,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":1.7265339999999583,"msg":"request completed"}
{"level":30,"time":1795091199762,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:38083","remoteAddress":"127.0.0.1","remotePort":53376},"msg":"incoming request"}
{"level":30,"time":1795091199764,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-4","res":{"statusCode":200},"responseTime":1.6081950000000234,"msg":"request completed"}
{"level":30,"time":1795091199766,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:40647","remoteAddress":"127.0.0.1","remotePort":36728},"msg":"incoming request"}
{"level":30,"time":1795091199767,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5743119999999635,"msg":"request completed"}
{"level":30,"time":1795091199769,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:42099","remoteAddress":"127.0.0.1","remotePort":42292},"msg":"incoming request"}
{"level":30,"time":1795091199771,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8961189999999988,"msg":"request completed"}
{"level":30,"time":1795091199773,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:42243","remoteAddress":"127.0.0.1","remotePort":56904},"msg":"incoming request"}
{"level":30,"time":1795091199774,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4486690000000522,"msg":"request completed"}
{"level":30,"time":1795091199778,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","req":{"method":"GET","url":"/api/v1/me/landing-config","host":"127.0.0.1:39245","remoteAddress":"127.0.0.1","remotePort":33586},"msg":"incoming request"}
{"level":30,"time":1795091199781,"pid":73366,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0918829999999957,"msg":"request completed"}
{"level":30,"time":1795091199873,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:35741","remoteAddress":"127.0.0.1","remotePort":33176},"msg":"incoming request"}
{"level":30,"time":1795091199878,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-1","res":{"statusCode":403},"responseTime":4.906025,"msg":"request completed"}
{"level":30,"time":1795091199882,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:44905","remoteAddress":"127.0.0.1","remotePort":44338},"msg":"incoming request"}
{"level":30,"time":1795091199884,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-2","res":{"statusCode":403},"responseTime":1.8480000000000132,"msg":"request completed"}
{"level":30,"time":1795091199885,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:34583","remoteAddress":"127.0.0.1","remotePort":44156},"msg":"incoming request"}
{"level":30,"time":1795091199887,"pid":73380,"hostname":"pivota-sandbox-c5aaeb0a","reqId":"req-3","res":{"statusCode":200},"responseTime":1.7161850000000527,"msg":"request completed"}

 Test Files  17 passed (17)
      Tests  98 passed (98)
   Start at  12:26:37
   Duration  2.75s (transform 394ms, setup 61ms, import 3.43s, tests 3.30s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 63[2mms[22m[39m
 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 70[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 96[2mms[22m[39m
 [32m✓[39m test/product-patterns.test.tsx [2m([22m[2m13 tests[22m[2m)[22m[90m 121[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 95[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 107[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 159[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[32m65 passed[39m[22m[90m (65)[39m
[2m   Start at [22m 12:26:40
[2m   Duration [22m 1.16s[2m (transform 240ms, setup 274ms, collect 935ms, tests 710ms, environment 1.37s, prepare 192ms)[22m
```

