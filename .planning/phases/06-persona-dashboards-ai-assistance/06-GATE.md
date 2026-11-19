---
phase: 06
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-19T12:17:19Z
tests_disabled_during_fixes: none
shadowed_sources: 0
waves:
  - wave: 1
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

