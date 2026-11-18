---
phase: 04
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-18T06:39:04Z
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
  - wave: 4
    build: pass
    tests: pass
    fix_attempts: 0
---

## Wave 1

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3 — env vars from .env not auto-exported in gate shell; exported manually before running gate (not a phase-4 code issue)

### Gate output

```
> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 77 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m106.44 kB[22m[1m[22m[2m │ gzip: 23.93 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m67.19 kB[22m[1m[22m[2m │ gzip: 20.10 kB[22m
[32m✓ built in 227ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 130 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DkLgSvGc.css  [39m[1m[2m 48.37 kB[22m[1m[22m[2m │ gzip:   7.98 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C8xuLRjY.js   [39m[1m[2m430.78 kB[22m[1m[22m[2m │ gzip: 125.06 kB[22m
[32m✓ built in 856ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794980199555,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:40295","remoteAddress":"127.0.0.1","remotePort":44388},"msg":"incoming request"}
{"level":30,"time":1794980199603,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":47.05624,"msg":"request completed"}
{"level":30,"time":1794980199606,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41713","remoteAddress":"127.0.0.1","remotePort":40386},"msg":"incoming request"}
{"level":30,"time":1794980199617,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":11.171817999999973,"msg":"request completed"}
{"level":30,"time":1794980199618,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46777","remoteAddress":"127.0.0.1","remotePort":45212},"msg":"incoming request"}
{"level":30,"time":1794980199623,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":4.27383500000002,"msg":"request completed"}
{"level":30,"time":1794980199625,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/c3cd2608-a038-4d35-a01d-90dcdc1a0326/decline","host":"127.0.0.1:38917","remoteAddress":"127.0.0.1","remotePort":40460},"msg":"incoming request"}
{"level":30,"time":1794980199627,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":422},"responseTime":1.7415000000000305,"msg":"request completed"}
{"level":30,"time":1794980199629,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=6d108c7e-5eed-4e2d-bbdd-e557c5f2d986","host":"127.0.0.1:43195","remoteAddress":"127.0.0.1","remotePort":54204},"msg":"incoming request"}
{"level":30,"time":1794980199631,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.167950000000019,"msg":"request completed"}
{"level":30,"time":1794980199632,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/c3cd2608-a038-4d35-a01d-90dcdc1a0326/decline","host":"127.0.0.1:46289","remoteAddress":"127.0.0.1","remotePort":39446},"msg":"incoming request"}
{"level":30,"time":1794980199636,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.697022000000004,"msg":"request completed"}
{"level":30,"time":1794980199637,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/6d108c7e-5eed-4e2d-bbdd-e557c5f2d986/timeline","host":"127.0.0.1:43535","remoteAddress":"127.0.0.1","remotePort":56270},"msg":"incoming request"}
{"level":30,"time":1794980199640,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.638103000000001,"msg":"request completed"}
{"level":30,"time":1794980199641,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41581","remoteAddress":"127.0.0.1","remotePort":37808},"msg":"incoming request"}
{"level":30,"time":1794980199644,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.4717019999999934,"msg":"request completed"}
{"level":30,"time":1794980199645,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35541","remoteAddress":"127.0.0.1","remotePort":45906},"msg":"incoming request"}
{"level":30,"time":1794980199648,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.5350099999999998,"msg":"request completed"}
{"level":30,"time":1794980199649,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/5d54b74f-3b8f-4e4a-b783-5215bf66a65b/approve","host":"127.0.0.1:35673","remoteAddress":"127.0.0.1","remotePort":57654},"msg":"incoming request"}
{"level":30,"time":1794980199653,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":4.370005999999989,"msg":"request completed"}
{"level":30,"time":1794980199654,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/5d54b74f-3b8f-4e4a-b783-5215bf66a65b/fulfill","host":"127.0.0.1:36025","remoteAddress":"127.0.0.1","remotePort":59564},"msg":"incoming request"}
{"level":30,"time":1794980199657,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.5067980000000034,"msg":"request completed"}
{"level":30,"time":1794980199658,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/5d54b74f-3b8f-4e4a-b783-5215bf66a65b/fulfill","host":"127.0.0.1:35739","remoteAddress":"127.0.0.1","remotePort":39224},"msg":"incoming request"}
{"level":30,"time":1794980199660,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.498422000000005,"msg":"request completed"}
{"level":30,"time":1794980199662,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/4588d4d3-ad1d-426c-92c5-3fb779218f4e/timeline","host":"127.0.0.1:45303","remoteAddress":"127.0.0.1","remotePort":41612},"msg":"incoming request"}
{"level":30,"time":1794980199664,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.6755059999999844,"msg":"request completed"}
{"level":30,"time":1794980199665,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33725","remoteAddress":"127.0.0.1","remotePort":45748},"msg":"incoming request"}
{"level":30,"time":1794980199668,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.479174999999998,"msg":"request completed"}
{"level":30,"time":1794980199669,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37209","remoteAddress":"127.0.0.1","remotePort":44004},"msg":"incoming request"}
{"level":30,"time":1794980199670,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.026358000000016,"msg":"request completed"}
{"level":30,"time":1794980199671,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33965","remoteAddress":"127.0.0.1","remotePort":60114},"msg":"incoming request"}
{"level":30,"time":1794980199673,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.0580940000000396,"msg":"request completed"}
{"level":30,"time":1794980199674,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:33691","remoteAddress":"127.0.0.1","remotePort":57692},"msg":"incoming request"}
{"level":30,"time":1794980199675,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":1.8899089999999887,"msg":"request completed"}
{"level":30,"time":1794980199676,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/e802d4c3-76de-46f1-a8e1-3dd8e6eb7f0f/fulfill","host":"127.0.0.1:46789","remoteAddress":"127.0.0.1","remotePort":53502},"msg":"incoming request"}
{"level":30,"time":1794980199678,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":409},"responseTime":1.2809949999999617,"msg":"request completed"}
{"level":30,"time":1794980199679,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/e802d4c3-76de-46f1-a8e1-3dd8e6eb7f0f/approve","host":"127.0.0.1:35577","remoteAddress":"127.0.0.1","remotePort":56220},"msg":"incoming request"}
{"level":30,"time":1794980199680,"pid":36375,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":409},"responseTime":1.0687770000000114,"msg":"request completed"}
{"level":30,"time":1794980199979,"pid":36386,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:34811","remoteAddress":"127.0.0.1","remotePort":58524},"msg":"incoming request"}
{"level":30,"time":1794980200029,"pid":36386,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":49.42396600000001,"msg":"request completed"}
{"level":30,"time":1794980200235,"pid":36386,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:42929","remoteAddress":"127.0.0.1","remotePort":37100},"msg":"incoming request"}
{"level":30,"time":1794980200238,"pid":36386,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.2837859999999637,"msg":"request completed"}
{"level":30,"time":1794980200478,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35153","remoteAddress":"127.0.0.1","remotePort":35404},"msg":"incoming request"}
{"level":30,"time":1794980200493,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.829509000000002,"msg":"request completed"}
{"level":30,"time":1794980200496,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36781","remoteAddress":"127.0.0.1","remotePort":58056},"msg":"incoming request"}
{"level":30,"time":1794980200499,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.5378029999999967,"msg":"request completed"}
{"level":30,"time":1794980200500,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:39305","remoteAddress":"127.0.0.1","remotePort":52480},"msg":"incoming request"}
{"level":30,"time":1794980200503,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.098487999999975,"msg":"request completed"}
{"level":30,"time":1794980200505,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42631","remoteAddress":"127.0.0.1","remotePort":41682},"msg":"incoming request"}
{"level":30,"time":1794980200508,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.600383000000022,"msg":"request completed"}
{"level":30,"time":1794980200509,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:40631","remoteAddress":"127.0.0.1","remotePort":40584},"msg":"incoming request"}
{"level":30,"time":1794980200511,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5657689999999889,"msg":"request completed"}
{"level":30,"time":1794980200512,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:35433","remoteAddress":"127.0.0.1","remotePort":45322},"msg":"incoming request"}
{"level":30,"time":1794980200513,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.705412000000024,"msg":"request completed"}
{"level":30,"time":1794980200515,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:40425","remoteAddress":"127.0.0.1","remotePort":51282},"msg":"incoming request"}
{"level":30,"time":1794980200516,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.732512999999983,"msg":"request completed"}
{"level":30,"time":1794980200518,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:35217","remoteAddress":"127.0.0.1","remotePort":42840},"msg":"incoming request"}
{"level":30,"time":1794980200520,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0881610000000137,"msg":"request completed"}
{"level":30,"time":1794980200521,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:39535","remoteAddress":"127.0.0.1","remotePort":54404},"msg":"incoming request"}
{"level":30,"time":1794980200522,"pid":36454,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7002729999999815,"msg":"request completed"}
{"level":30,"time":1794980200775,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:38611","remoteAddress":"127.0.0.1","remotePort":39142},"msg":"incoming request"}
{"level":30,"time":1794980200781,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":5.432992000000013,"msg":"request completed"}
{"level":30,"time":1794980200783,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:40829","remoteAddress":"127.0.0.1","remotePort":48526},"msg":"incoming request"}
{"level":30,"time":1794980200786,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":2.33211,"msg":"request completed"}
{"level":30,"time":1794980200787,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45243","remoteAddress":"127.0.0.1","remotePort":35560},"msg":"incoming request"}
{"level":30,"time":1794980200799,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":12.301829999999995,"msg":"request completed"}
{"level":30,"time":1794980200800,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:43431","remoteAddress":"127.0.0.1","remotePort":59248},"msg":"incoming request"}
{"level":30,"time":1794980200809,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.105117000000007,"msg":"request completed"}
{"level":30,"time":1794980200810,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/8ade1b70-ba9a-49ab-9aea-d18b1b35200c/send","host":"127.0.0.1:44773","remoteAddress":"127.0.0.1","remotePort":56410},"msg":"incoming request"}
{"level":30,"time":1794980200812,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":403},"responseTime":1.7626700000000142,"msg":"request completed"}
{"level":30,"time":1794980200813,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/8ade1b70-ba9a-49ab-9aea-d18b1b35200c/send","host":"127.0.0.1:36629","remoteAddress":"127.0.0.1","remotePort":58130},"msg":"incoming request"}
{"level":30,"time":1794980200816,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4068900000000326,"msg":"request completed"}
{"level":30,"time":1794980200817,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/fc5d0c23-0de0-40b5-82a1-ed47109e93d8/timeline","host":"127.0.0.1:39557","remoteAddress":"127.0.0.1","remotePort":56420},"msg":"incoming request"}
{"level":30,"time":1794980200819,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.237601999999981,"msg":"request completed"}
{"level":30,"time":1794980200821,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/8ade1b70-ba9a-49ab-9aea-d18b1b35200c/delivery-status","host":"127.0.0.1:36983","remoteAddress":"127.0.0.1","remotePort":46490},"msg":"incoming request"}
{"level":30,"time":1794980200822,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.7478120000000104,"msg":"request completed"}
{"level":30,"time":1794980200824,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:45333","remoteAddress":"127.0.0.1","remotePort":33580},"msg":"incoming request"}
{"level":30,"time":1794980200825,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":1.6068470000000161,"msg":"request completed"}
{"level":30,"time":1794980200826,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:34263","remoteAddress":"127.0.0.1","remotePort":49718},"msg":"incoming request"}
{"level":30,"time":1794980200828,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":1.9753389999999627,"msg":"request completed"}
{"level":30,"time":1794980200829,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:33561","remoteAddress":"127.0.0.1","remotePort":35428},"msg":"incoming request"}
{"level":30,"time":1794980200832,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":2.7813729999999737,"msg":"request completed"}
{"level":30,"time":1794980200833,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/ef55f388-edc7-4d85-a857-03120b8e37f5/send","host":"127.0.0.1:46475","remoteAddress":"127.0.0.1","remotePort":53006},"msg":"incoming request"}
{"level":30,"time":1794980200834,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":400},"responseTime":1.6066670000000158,"msg":"request completed"}
{"level":30,"time":1794980200835,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/2f4bbbab-2df4-4b9a-b5f7-16bc4027c68c/approve","host":"127.0.0.1:33391","remoteAddress":"127.0.0.1","remotePort":33988},"msg":"incoming request"}
{"level":30,"time":1794980200837,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5500710000000026,"msg":"request completed"}
{"level":30,"time":1794980200837,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/ef55f388-edc7-4d85-a857-03120b8e37f5/send","host":"127.0.0.1:45743","remoteAddress":"127.0.0.1","remotePort":49628},"msg":"incoming request"}
{"level":30,"time":1794980200840,"pid":36464,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.2528310000000147,"msg":"request completed"}
{"level":30,"time":1794980201079,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38939","remoteAddress":"127.0.0.1","remotePort":47330},"msg":"incoming request"}
{"level":30,"time":1794980201092,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.214824000000021,"msg":"request completed"}
{"level":30,"time":1794980201098,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/7268fe8f-0410-4e45-a5eb-56de32c8ce46/timeline","host":"127.0.0.1:42601","remoteAddress":"127.0.0.1","remotePort":38722},"msg":"incoming request"}
{"level":30,"time":1794980201101,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.0253920000000107,"msg":"request completed"}
{"level":30,"time":1794980201107,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33125","remoteAddress":"127.0.0.1","remotePort":44668},"msg":"incoming request"}
{"level":30,"time":1794980201111,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.501696000000038,"msg":"request completed"}
{"level":30,"time":1794980201113,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/11d4d910-fc8e-4c1f-9a0b-63543d07c8a0/closure","host":"127.0.0.1:36435","remoteAddress":"127.0.0.1","remotePort":54770},"msg":"incoming request"}
{"level":30,"time":1794980201117,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":4.5030759999999646,"msg":"request completed"}
{"level":30,"time":1794980201119,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/11d4d910-fc8e-4c1f-9a0b-63543d07c8a0/timeline","host":"127.0.0.1:42177","remoteAddress":"127.0.0.1","remotePort":56956},"msg":"incoming request"}
{"level":30,"time":1794980201120,"pid":36476,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.9127209999999764,"msg":"request completed"}
{"level":30,"time":1794980201363,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42587","remoteAddress":"127.0.0.1","remotePort":39104},"msg":"incoming request"}
{"level":30,"time":1794980201369,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":5.421449999999993,"msg":"request completed"}
{"level":30,"time":1794980201372,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40289","remoteAddress":"127.0.0.1","remotePort":60864},"msg":"incoming request"}
{"level":30,"time":1794980201374,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":1.6531339999999943,"msg":"request completed"}
{"level":30,"time":1794980201375,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40907","remoteAddress":"127.0.0.1","remotePort":59978},"msg":"incoming request"}
{"level":30,"time":1794980201378,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.8244009999999946,"msg":"request completed"}
{"level":30,"time":1794980201380,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35611","remoteAddress":"127.0.0.1","remotePort":57050},"msg":"incoming request"}
{"level":30,"time":1794980201389,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.368783000000008,"msg":"request completed"}
{"level":30,"time":1794980201390,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35995","remoteAddress":"127.0.0.1","remotePort":43890},"msg":"incoming request"}
{"level":30,"time":1794980201392,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.247208999999998,"msg":"request completed"}
{"level":30,"time":1794980201393,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/41f0713f-511a-4435-b172-466d8433008d/timeline","host":"127.0.0.1:42021","remoteAddress":"127.0.0.1","remotePort":59218},"msg":"incoming request"}
{"level":30,"time":1794980201395,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.956975,"msg":"request completed"}
{"level":30,"time":1794980201396,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43127","remoteAddress":"127.0.0.1","remotePort":35600},"msg":"incoming request"}
{"level":30,"time":1794980201398,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":1.8498839999999745,"msg":"request completed"}
{"level":30,"time":1794980201399,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/b52521d0-dd09-4f0d-a676-8f57c785d301/status","host":"127.0.0.1:39083","remoteAddress":"127.0.0.1","remotePort":53438},"msg":"incoming request"}
{"level":30,"time":1794980201401,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":409},"responseTime":1.6187800000000152,"msg":"request completed"}
{"level":30,"time":1794980201402,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:34567","remoteAddress":"127.0.0.1","remotePort":48922},"msg":"incoming request"}
{"level":30,"time":1794980201404,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.129187999999999,"msg":"request completed"}
{"level":30,"time":1794980201405,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/0d44efdf-f7db-440e-a7b7-19f8b803c3c3/status","host":"127.0.0.1:33963","remoteAddress":"127.0.0.1","remotePort":38274},"msg":"incoming request"}
{"level":30,"time":1794980201406,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":409},"responseTime":1.5142139999999813,"msg":"request completed"}
{"level":30,"time":1794980201407,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/0d44efdf-f7db-440e-a7b7-19f8b803c3c3/status","host":"127.0.0.1:39213","remoteAddress":"127.0.0.1","remotePort":47084},"msg":"incoming request"}
{"level":30,"time":1794980201409,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.2015240000000063,"msg":"request completed"}
{"level":30,"time":1794980201410,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/0d44efdf-f7db-440e-a7b7-19f8b803c3c3/status","host":"127.0.0.1:41889","remoteAddress":"127.0.0.1","remotePort":60548},"msg":"incoming request"}
{"level":30,"time":1794980201411,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":409},"responseTime":1.338122999999996,"msg":"request completed"}
{"level":30,"time":1794980201412,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/0d44efdf-f7db-440e-a7b7-19f8b803c3c3/status","host":"127.0.0.1:36065","remoteAddress":"127.0.0.1","remotePort":53152},"msg":"incoming request"}
{"level":30,"time":1794980201414,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.083802999999989,"msg":"request completed"}
{"level":30,"time":1794980201415,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/0d44efdf-f7db-440e-a7b7-19f8b803c3c3/status","host":"127.0.0.1:34993","remoteAddress":"127.0.0.1","remotePort":38476},"msg":"incoming request"}
{"level":30,"time":1794980201417,"pid":36486,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.7838199999999915,"msg":"request completed"}
{"level":30,"time":1794980201666,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42385","remoteAddress":"127.0.0.1","remotePort":48238},"msg":"incoming request"}
{"level":30,"time":1794980201680,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.913857000000007,"msg":"request completed"}
{"level":30,"time":1794980201682,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/activation","host":"127.0.0.1:40509","remoteAddress":"127.0.0.1","remotePort":36890},"msg":"incoming request"}
{"level":30,"time":1794980201685,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":2.5409010000000194,"msg":"request completed"}
{"level":30,"time":1794980201686,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589","host":"127.0.0.1:36651","remoteAddress":"127.0.0.1","remotePort":57708},"msg":"incoming request"}
{"level":30,"time":1794980201688,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.318443000000002,"msg":"request completed"}
{"level":30,"time":1794980201689,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/command-roles","host":"127.0.0.1:39935","remoteAddress":"127.0.0.1","remotePort":55042},"msg":"incoming request"}
{"level":30,"time":1794980201693,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.9741429999999696,"msg":"request completed"}
{"level":30,"time":1794980201694,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/activation","host":"127.0.0.1:42229","remoteAddress":"127.0.0.1","remotePort":46076},"msg":"incoming request"}
{"level":30,"time":1794980201698,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.6618569999999977,"msg":"request completed"}
{"level":30,"time":1794980201699,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/timeline","host":"127.0.0.1:46369","remoteAddress":"127.0.0.1","remotePort":47908},"msg":"incoming request"}
{"level":30,"time":1794980201701,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.2589810000000057,"msg":"request completed"}
{"level":30,"time":1794980201703,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/activation","host":"127.0.0.1:45469","remoteAddress":"127.0.0.1","remotePort":52434},"msg":"incoming request"}
{"level":30,"time":1794980201704,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":400},"responseTime":1.1118069999999989,"msg":"request completed"}
{"level":30,"time":1794980201705,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589","host":"127.0.0.1:43783","remoteAddress":"127.0.0.1","remotePort":44580},"msg":"incoming request"}
{"level":30,"time":1794980201707,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.7793520000000171,"msg":"request completed"}
{"level":30,"time":1794980201707,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/command-roles","host":"127.0.0.1:44025","remoteAddress":"127.0.0.1","remotePort":45984},"msg":"incoming request"}
{"level":30,"time":1794980201710,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.3910189999999716,"msg":"request completed"}
{"level":30,"time":1794980201711,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/timeline","host":"127.0.0.1:33553","remoteAddress":"127.0.0.1","remotePort":37108},"msg":"incoming request"}
{"level":30,"time":1794980201712,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":1.606347000000028,"msg":"request completed"}
{"level":30,"time":1794980201713,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/closure","host":"127.0.0.1:33257","remoteAddress":"127.0.0.1","remotePort":54138},"msg":"incoming request"}
{"level":30,"time":1794980201717,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.9248999999999796,"msg":"request completed"}
{"level":30,"time":1794980201718,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/e667da66-fac1-4b2e-821f-c9337c8b6589/timeline","host":"127.0.0.1:45903","remoteAddress":"127.0.0.1","remotePort":41786},"msg":"incoming request"}
{"level":30,"time":1794980201720,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.0630439999999908,"msg":"request completed"}
{"level":30,"time":1794980201722,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43331","remoteAddress":"127.0.0.1","remotePort":55324},"msg":"incoming request"}
{"level":30,"time":1794980201725,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":3.2439919999999915,"msg":"request completed"}
{"level":30,"time":1794980201726,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/ab05950a-4f16-4e80-ad9a-f1b63c98a379/command-roles","host":"127.0.0.1:45477","remoteAddress":"127.0.0.1","remotePort":46982},"msg":"incoming request"}
{"level":30,"time":1794980201728,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.336847999999975,"msg":"request completed"}
{"level":30,"time":1794980201729,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/ab05950a-4f16-4e80-ad9a-f1b63c98a379/command-roles","host":"127.0.0.1:39705","remoteAddress":"127.0.0.1","remotePort":34884},"msg":"incoming request"}
{"level":30,"time":1794980201731,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.0689649999999915,"msg":"request completed"}
{"level":30,"time":1794980201732,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/ab05950a-4f16-4e80-ad9a-f1b63c98a379/timeline","host":"127.0.0.1:41813","remoteAddress":"127.0.0.1","remotePort":33730},"msg":"incoming request"}
{"level":30,"time":1794980201733,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":200},"responseTime":1.5460330000000226,"msg":"request completed"}
{"level":30,"time":1794980201735,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42603","remoteAddress":"127.0.0.1","remotePort":50018},"msg":"incoming request"}
{"level":30,"time":1794980201738,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":2.8432690000000207,"msg":"request completed"}
{"level":30,"time":1794980201738,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/dd962053-1714-416e-b0b5-06438bb68875/activation","host":"127.0.0.1:46627","remoteAddress":"127.0.0.1","remotePort":38274},"msg":"incoming request"}
{"level":30,"time":1794980201740,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":404},"responseTime":1.3888479999999959,"msg":"request completed"}
{"level":30,"time":1794980201741,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/dd962053-1714-416e-b0b5-06438bb68875/command-roles","host":"127.0.0.1:43735","remoteAddress":"127.0.0.1","remotePort":35074},"msg":"incoming request"}
{"level":30,"time":1794980201742,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":404},"responseTime":1.2955430000000092,"msg":"request completed"}
{"level":30,"time":1794980201743,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/dd962053-1714-416e-b0b5-06438bb68875/closure","host":"127.0.0.1:44985","remoteAddress":"127.0.0.1","remotePort":55406},"msg":"incoming request"}
{"level":30,"time":1794980201744,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":404},"responseTime":1.1442380000000298,"msg":"request completed"}
{"level":30,"time":1794980201744,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/dd962053-1714-416e-b0b5-06438bb68875/activation","host":"127.0.0.1:41491","remoteAddress":"127.0.0.1","remotePort":60610},"msg":"incoming request"}
{"level":30,"time":1794980201747,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":2.1177569999999832,"msg":"request completed"}
{"level":30,"time":1794980201747,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39215","remoteAddress":"127.0.0.1","remotePort":46414},"msg":"incoming request"}
{"level":30,"time":1794980201750,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":201},"responseTime":2.752888999999982,"msg":"request completed"}
{"level":30,"time":1794980201751,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/a441757f-f035-4015-8369-ef1e3bf4dcdd/closure","host":"127.0.0.1:43403","remoteAddress":"127.0.0.1","remotePort":43212},"msg":"incoming request"}
{"level":30,"time":1794980201754,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","res":{"statusCode":200},"responseTime":2.975717999999972,"msg":"request completed"}
{"level":30,"time":1794980201754,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/a441757f-f035-4015-8369-ef1e3bf4dcdd/closure","host":"127.0.0.1:38355","remoteAddress":"127.0.0.1","remotePort":54734},"msg":"incoming request"}
{"level":30,"time":1794980201756,"pid":36496,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","res":{"statusCode":409},"responseTime":1.9292629999999917,"msg":"request completed"}
{"level":30,"time":1794980202002,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:42151","remoteAddress":"127.0.0.1","remotePort":37882},"msg":"incoming request"}
{"level":30,"time":1794980202008,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":5.988724999999988,"msg":"request completed"}
{"level":30,"time":1794980202011,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:44049","remoteAddress":"127.0.0.1","remotePort":49606},"msg":"incoming request"}
{"level":30,"time":1794980202014,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.265732000000014,"msg":"request completed"}
{"level":30,"time":1794980202015,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41795","remoteAddress":"127.0.0.1","remotePort":38404},"msg":"incoming request"}
{"level":30,"time":1794980202017,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.0540670000000034,"msg":"request completed"}
{"level":30,"time":1794980202020,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/dc721137-2081-4492-a702-15c1c7771bab","host":"127.0.0.1:41371","remoteAddress":"127.0.0.1","remotePort":41744},"msg":"incoming request"}
{"level":30,"time":1794980202022,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.65226100000001,"msg":"request completed"}
{"level":30,"time":1794980202023,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43443","remoteAddress":"127.0.0.1","remotePort":41550},"msg":"incoming request"}
{"level":30,"time":1794980202024,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":401},"responseTime":0.44431400000001986,"msg":"request completed"}
{"level":30,"time":1794980202025,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35599","remoteAddress":"127.0.0.1","remotePort":45696},"msg":"incoming request"}
{"level":30,"time":1794980202026,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":403},"responseTime":1.242332000000033,"msg":"request completed"}
{"level":30,"time":1794980202027,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/35463cbd-22bb-4519-9c32-cccf5e25bbb8","host":"127.0.0.1:41409","remoteAddress":"127.0.0.1","remotePort":57798},"msg":"incoming request"}
{"level":30,"time":1794980202031,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":3.4910750000000235,"msg":"request completed"}
{"level":30,"time":1794980202032,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:44335","remoteAddress":"127.0.0.1","remotePort":36758},"msg":"incoming request"}
{"level":30,"time":1794980202034,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.602175999999986,"msg":"request completed"}
{"level":30,"time":1794980202036,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=14e28e41-1503-4d08-8d8c-a75a8d703e82&page_size=50","host":"127.0.0.1:42665","remoteAddress":"127.0.0.1","remotePort":52130},"msg":"incoming request"}
{"level":30,"time":1794980202037,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7605060000000208,"msg":"request completed"}
{"level":30,"time":1794980202039,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42277","remoteAddress":"127.0.0.1","remotePort":51016},"msg":"incoming request"}
{"level":30,"time":1794980202040,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":403},"responseTime":1.265124999999955,"msg":"request completed"}
{"level":30,"time":1794980202041,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:40845","remoteAddress":"127.0.0.1","remotePort":45118},"msg":"incoming request"}
{"level":30,"time":1794980202043,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.6458499999999958,"msg":"request completed"}
{"level":30,"time":1794980202044,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36113","remoteAddress":"127.0.0.1","remotePort":56740},"msg":"incoming request"}
{"level":30,"time":1794980202046,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":422},"responseTime":1.904796000000033,"msg":"request completed"}
{"level":30,"time":1794980202047,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:43625","remoteAddress":"127.0.0.1","remotePort":42506},"msg":"incoming request"}
{"level":30,"time":1794980202049,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.7324439999999868,"msg":"request completed"}
{"level":30,"time":1794980202049,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=14e28e41-1503-4d08-8d8c-a75a8d703e82&action_type=record_view","host":"127.0.0.1:33363","remoteAddress":"127.0.0.1","remotePort":38832},"msg":"incoming request"}
{"level":30,"time":1794980202051,"pid":36506,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.423874000000012,"msg":"request completed"}
{"level":30,"time":1794980202304,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:44381","remoteAddress":"127.0.0.1","remotePort":56064},"msg":"incoming request"}
{"level":30,"time":1794980202317,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":12.346824999999995,"msg":"request completed"}
{"level":30,"time":1794980202319,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f/submit-review","host":"127.0.0.1:44139","remoteAddress":"127.0.0.1","remotePort":34354},"msg":"incoming request"}
{"level":30,"time":1794980202325,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":5.596819000000039,"msg":"request completed"}
{"level":30,"time":1794980202326,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f/review","host":"127.0.0.1:32821","remoteAddress":"127.0.0.1","remotePort":53790},"msg":"incoming request"}
{"level":30,"time":1794980202329,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":403},"responseTime":2.0892240000000015,"msg":"request completed"}
{"level":30,"time":1794980202330,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f","host":"127.0.0.1:40779","remoteAddress":"127.0.0.1","remotePort":36742},"msg":"incoming request"}
{"level":30,"time":1794980202331,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.81259399999999,"msg":"request completed"}
{"level":30,"time":1794980202332,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f/review","host":"127.0.0.1:45845","remoteAddress":"127.0.0.1","remotePort":40000},"msg":"incoming request"}
{"level":30,"time":1794980202335,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.0452980000000025,"msg":"request completed"}
{"level":30,"time":1794980202336,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f","host":"127.0.0.1:40099","remoteAddress":"127.0.0.1","remotePort":51024},"msg":"incoming request"}
{"level":30,"time":1794980202338,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.792304999999999,"msg":"request completed"}
{"level":30,"time":1794980202339,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f/sections/d77ed42f-5372-4777-b9f1-fec3e4af0b23/link-tasks","host":"127.0.0.1:41711","remoteAddress":"127.0.0.1","remotePort":49330},"msg":"incoming request"}
{"level":30,"time":1794980202341,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":204},"responseTime":1.6908640000000332,"msg":"request completed"}
{"level":30,"time":1794980202341,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f","host":"127.0.0.1:40695","remoteAddress":"127.0.0.1","remotePort":43380},"msg":"incoming request"}
{"level":30,"time":1794980202343,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6712180000000103,"msg":"request completed"}
{"level":30,"time":1794980202344,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36851","remoteAddress":"127.0.0.1","remotePort":54162},"msg":"incoming request"}
{"level":30,"time":1794980202353,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":8.730152999999973,"msg":"request completed"}
{"level":30,"time":1794980202354,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/2e8131ec-51f1-44c4-af57-11bdadfbb88f/materialize-tasks","host":"127.0.0.1:33227","remoteAddress":"127.0.0.1","remotePort":40298},"msg":"incoming request"}
{"level":30,"time":1794980202357,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":2.9791339999999877,"msg":"request completed"}
{"level":30,"time":1794980202358,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=c96f5e77-7a18-4e5c-a54b-865be901ddd2","host":"127.0.0.1:44261","remoteAddress":"127.0.0.1","remotePort":40574},"msg":"incoming request"}
{"level":30,"time":1794980202360,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.805731000000037,"msg":"request completed"}
{"level":30,"time":1794980202361,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42975","remoteAddress":"127.0.0.1","remotePort":53888},"msg":"incoming request"}
{"level":30,"time":1794980202363,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":201},"responseTime":2.2214310000000523,"msg":"request completed"}
{"level":30,"time":1794980202364,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/b0ae7445-40f6-4fc6-a3f3-cf25b1fdc21e/review","host":"127.0.0.1:44449","remoteAddress":"127.0.0.1","remotePort":60632},"msg":"incoming request"}
{"level":30,"time":1794980202366,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":409},"responseTime":1.5424560000000156,"msg":"request completed"}
{"level":30,"time":1794980202366,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40683","remoteAddress":"127.0.0.1","remotePort":54522},"msg":"incoming request"}
{"level":30,"time":1794980202368,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":1.9893460000000118,"msg":"request completed"}
{"level":30,"time":1794980202369,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/417d521f-0971-4d4d-997f-d93d888987b4/submit-review","host":"127.0.0.1:41401","remoteAddress":"127.0.0.1","remotePort":45912},"msg":"incoming request"}
{"level":30,"time":1794980202370,"pid":36535,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.2950519999999983,"msg":"request completed"}
{"level":30,"time":1794980202612,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:34363","remoteAddress":"127.0.0.1","remotePort":47416},"msg":"incoming request"}
{"level":30,"time":1794980202642,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":30.112423000000007,"msg":"request completed"}
{"level":30,"time":1794980202645,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:35061","remoteAddress":"127.0.0.1","remotePort":53266},"msg":"incoming request"}
{"level":30,"time":1794980202648,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.5612489999999752,"msg":"request completed"}
{"level":30,"time":1794980202649,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42067","remoteAddress":"127.0.0.1","remotePort":37036},"msg":"incoming request"}
{"level":30,"time":1794980202651,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":400},"responseTime":1.6087909999999965,"msg":"request completed"}
{"level":30,"time":1794980202652,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:46129","remoteAddress":"127.0.0.1","remotePort":33398},"msg":"incoming request"}
{"level":30,"time":1794980202655,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.009731000000045,"msg":"request completed"}
{"level":30,"time":1794980202656,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/706471ff-eb3b-48c6-aac6-58fd5beb4df0/revoke","host":"127.0.0.1:45487","remoteAddress":"127.0.0.1","remotePort":41742},"msg":"incoming request"}
{"level":30,"time":1794980202659,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":204},"responseTime":2.523237999999992,"msg":"request completed"}
{"level":30,"time":1794980202661,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:46669","remoteAddress":"127.0.0.1","remotePort":37938},"msg":"incoming request"}
{"level":30,"time":1794980202663,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.963797999999997,"msg":"request completed"}
{"level":30,"time":1794980202664,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34469","remoteAddress":"127.0.0.1","remotePort":53108},"msg":"incoming request"}
{"level":30,"time":1794980202665,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.367287000000033,"msg":"request completed"}
{"level":30,"time":1794980202666,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40691","remoteAddress":"127.0.0.1","remotePort":49872},"msg":"incoming request"}
{"level":30,"time":1794980202668,"pid":36582,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6259029999999939,"msg":"request completed"}
{"level":30,"time":1794980202912,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43199","remoteAddress":"127.0.0.1","remotePort":59662},"msg":"incoming request"}
{"level":30,"time":1794980202926,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.747313999999989,"msg":"request completed"}
{"level":30,"time":1794980202930,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/0d2923da-1451-4b51-9aa4-5200c7a333aa/timeline","host":"127.0.0.1:33149","remoteAddress":"127.0.0.1","remotePort":39410},"msg":"incoming request"}
{"level":30,"time":1794980202933,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1162410000000023,"msg":"request completed"}
{"level":30,"time":1794980202935,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44297","remoteAddress":"127.0.0.1","remotePort":38124},"msg":"incoming request"}
{"level":30,"time":1794980202938,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.9034109999999487,"msg":"request completed"}
{"level":30,"time":1794980202939,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36229","remoteAddress":"127.0.0.1","remotePort":55058},"msg":"incoming request"}
{"level":30,"time":1794980202940,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":409},"responseTime":1.4060010000000034,"msg":"request completed"}
{"level":30,"time":1794980202941,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44715","remoteAddress":"127.0.0.1","remotePort":45544},"msg":"incoming request"}
{"level":30,"time":1794980202944,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.419163000000026,"msg":"request completed"}
{"level":30,"time":1794980202945,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39987","remoteAddress":"127.0.0.1","remotePort":53852},"msg":"incoming request"}
{"level":30,"time":1794980202948,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":201},"responseTime":2.3544310000000337,"msg":"request completed"}
{"level":30,"time":1794980202948,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42573","remoteAddress":"127.0.0.1","remotePort":51330},"msg":"incoming request"}
{"level":30,"time":1794980202951,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.291482999999971,"msg":"request completed"}
{"level":30,"time":1794980202951,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34333","remoteAddress":"127.0.0.1","remotePort":34038},"msg":"incoming request"}
{"level":30,"time":1794980202954,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.311971999999969,"msg":"request completed"}
{"level":30,"time":1794980202955,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:43097","remoteAddress":"127.0.0.1","remotePort":44150},"msg":"incoming request"}
{"level":30,"time":1794980202957,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9069010000000048,"msg":"request completed"}
{"level":30,"time":1794980202959,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40349","remoteAddress":"127.0.0.1","remotePort":58836},"msg":"incoming request"}
{"level":30,"time":1794980202961,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.4503610000000435,"msg":"request completed"}
{"level":30,"time":1794980202962,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/451b1b8b-8705-4d0c-9364-9a469583d9ee","host":"127.0.0.1:36923","remoteAddress":"127.0.0.1","remotePort":52892},"msg":"incoming request"}
{"level":30,"time":1794980202964,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":404},"responseTime":1.7962729999999851,"msg":"request completed"}
{"level":30,"time":1794980202965,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:34587","remoteAddress":"127.0.0.1","remotePort":49012},"msg":"incoming request"}
{"level":30,"time":1794980202967,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.7384839999999713,"msg":"request completed"}
{"level":30,"time":1794980202967,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/451b1b8b-8705-4d0c-9364-9a469583d9ee","host":"127.0.0.1:41287","remoteAddress":"127.0.0.1","remotePort":58354},"msg":"incoming request"}
{"level":30,"time":1794980202969,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":404},"responseTime":1.4367980000000102,"msg":"request completed"}
{"level":30,"time":1794980202970,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/451b1b8b-8705-4d0c-9364-9a469583d9ee/timeline","host":"127.0.0.1:34327","remoteAddress":"127.0.0.1","remotePort":46828},"msg":"incoming request"}
{"level":30,"time":1794980202971,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":404},"responseTime":1.1602490000000216,"msg":"request completed"}
{"level":30,"time":1794980202972,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36315","remoteAddress":"127.0.0.1","remotePort":41592},"msg":"incoming request"}
{"level":30,"time":1794980202974,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.283138000000008,"msg":"request completed"}
{"level":30,"time":1794980202983,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42549","remoteAddress":"127.0.0.1","remotePort":41982},"msg":"incoming request"}
{"level":30,"time":1794980202992,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":8.537721999999974,"msg":"request completed"}
{"level":30,"time":1794980202993,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44407","remoteAddress":"127.0.0.1","remotePort":35426},"msg":"incoming request"}
{"level":30,"time":1794980202996,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.111471999999992,"msg":"request completed"}
{"level":30,"time":1794980202997,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42703","remoteAddress":"127.0.0.1","remotePort":47340},"msg":"incoming request"}
{"level":30,"time":1794980203000,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.550499000000002,"msg":"request completed"}
{"level":30,"time":1794980203000,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39347","remoteAddress":"127.0.0.1","remotePort":37344},"msg":"incoming request"}
{"level":40,"time":1794980203004,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794980203005,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":201},"responseTime":4.572705999999982,"msg":"request completed"}
{"level":30,"time":1794980203006,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/2c6a2f67-8bea-4e35-a830-dfd0df3c5044/approve","host":"127.0.0.1:36359","remoteAddress":"127.0.0.1","remotePort":44950},"msg":"incoming request"}
{"level":40,"time":1794980203008,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794980203008,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.5976679999999988,"msg":"request completed"}
{"level":30,"time":1794980203009,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:38005","remoteAddress":"127.0.0.1","remotePort":53466},"msg":"incoming request"}
{"level":30,"time":1794980203011,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6412619999999833,"msg":"request completed"}
{"level":30,"time":1794980203012,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44345","remoteAddress":"127.0.0.1","remotePort":34468},"msg":"incoming request"}
{"level":30,"time":1794980203013,"pid":36593,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8478420000000142,"msg":"request completed"}
{"level":30,"time":1794980203253,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46175","remoteAddress":"127.0.0.1","remotePort":41220},"msg":"incoming request"}
{"level":30,"time":1794980203258,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":5.318216000000007,"msg":"request completed"}
{"level":30,"time":1794980203261,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:32783","remoteAddress":"127.0.0.1","remotePort":35454},"msg":"incoming request"}
{"level":30,"time":1794980203261,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.1838650000000257,"msg":"request completed"}
{"level":30,"time":1794980203263,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:40087","remoteAddress":"127.0.0.1","remotePort":35596},"msg":"incoming request"}
{"level":30,"time":1794980203265,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6599049999999806,"msg":"request completed"}
{"level":30,"time":1794980203266,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37363","remoteAddress":"127.0.0.1","remotePort":58946},"msg":"incoming request"}
{"level":30,"time":1794980203269,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.9802259999999876,"msg":"request completed"}
{"level":30,"time":1794980203270,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:32995","remoteAddress":"127.0.0.1","remotePort":37310},"msg":"incoming request"}
{"level":30,"time":1794980203272,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4299139999999966,"msg":"request completed"}
{"level":30,"time":1794980203273,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34251","remoteAddress":"127.0.0.1","remotePort":36086},"msg":"incoming request"}
{"level":30,"time":1794980203273,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.3914649999999824,"msg":"request completed"}
{"level":30,"time":1794980203275,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:45631","remoteAddress":"127.0.0.1","remotePort":44518},"msg":"incoming request"}
{"level":30,"time":1794980203276,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3202389999999582,"msg":"request completed"}
{"level":30,"time":1794980203277,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:33273","remoteAddress":"127.0.0.1","remotePort":60728},"msg":"incoming request"}
{"level":30,"time":1794980203278,"pid":36607,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9129939999999692,"msg":"request completed"}

 Test Files  12 passed (12)
      Tests  58 passed (58)
   Start at  05:36:39
   Duration  4.06s (transform 129ms, setup 31ms, import 1.65s, tests 1.74s, environment 0ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 70[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 112[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 46[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 110[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 154[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 100[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 05:36:43
[2m   Duration [22m 1.94s[2m (transform 205ms, setup 149ms, collect 683ms, tests 592ms, environment 1.15s, prepare 179ms)[22m
```

## Wave 2

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
[32m✓[39m 77 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m106.44 kB[22m[1m[22m[2m │ gzip: 23.93 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m67.19 kB[22m[1m[22m[2m │ gzip: 20.10 kB[22m
[32m✓ built in 220ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 130 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DkLgSvGc.css  [39m[1m[2m 48.37 kB[22m[1m[22m[2m │ gzip:   7.98 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C8xuLRjY.js   [39m[1m[2m430.78 kB[22m[1m[22m[2m │ gzip: 125.06 kB[22m
[32m✓ built in 956ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794980996689,"pid":54871,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:38753","remoteAddress":"127.0.0.1","remotePort":51418},"msg":"incoming request"}
{"level":30,"time":1794980996736,"pid":54871,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":46.777552000000014,"msg":"request completed"}
{"level":30,"time":1794980996943,"pid":54871,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:44731","remoteAddress":"127.0.0.1","remotePort":50312},"msg":"incoming request"}
{"level":30,"time":1794980996946,"pid":54871,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.289429000000041,"msg":"request completed"}
{"level":30,"time":1794980997196,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:45935","remoteAddress":"127.0.0.1","remotePort":39696},"msg":"incoming request"}
{"level":30,"time":1794980997243,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":46.70580699999999,"msg":"request completed"}
{"level":30,"time":1794980997247,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34929","remoteAddress":"127.0.0.1","remotePort":49916},"msg":"incoming request"}
{"level":30,"time":1794980997258,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":10.818587999999977,"msg":"request completed"}
{"level":30,"time":1794980997259,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39879","remoteAddress":"127.0.0.1","remotePort":53702},"msg":"incoming request"}
{"level":30,"time":1794980997263,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.8834420000000023,"msg":"request completed"}
{"level":30,"time":1794980997265,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/35fccade-843d-49ed-a85a-4b1e90446bc2/decline","host":"127.0.0.1:33149","remoteAddress":"127.0.0.1","remotePort":52618},"msg":"incoming request"}
{"level":30,"time":1794980997266,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":422},"responseTime":1.4053619999999682,"msg":"request completed"}
{"level":30,"time":1794980997268,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=913e1e79-9a49-4888-83ea-f34611ded402","host":"127.0.0.1:43783","remoteAddress":"127.0.0.1","remotePort":40160},"msg":"incoming request"}
{"level":30,"time":1794980997270,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.071528999999998,"msg":"request completed"}
{"level":30,"time":1794980997271,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/35fccade-843d-49ed-a85a-4b1e90446bc2/decline","host":"127.0.0.1:32787","remoteAddress":"127.0.0.1","remotePort":36740},"msg":"incoming request"}
{"level":30,"time":1794980997274,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.1016579999999863,"msg":"request completed"}
{"level":30,"time":1794980997276,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/913e1e79-9a49-4888-83ea-f34611ded402/timeline","host":"127.0.0.1:39871","remoteAddress":"127.0.0.1","remotePort":40902},"msg":"incoming request"}
{"level":30,"time":1794980997283,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":7.516214000000048,"msg":"request completed"}
{"level":30,"time":1794980997284,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43031","remoteAddress":"127.0.0.1","remotePort":39678},"msg":"incoming request"}
{"level":30,"time":1794980997287,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.8665770000000066,"msg":"request completed"}
{"level":30,"time":1794980997288,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:45759","remoteAddress":"127.0.0.1","remotePort":49004},"msg":"incoming request"}
{"level":30,"time":1794980997291,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":3.204469999999958,"msg":"request completed"}
{"level":30,"time":1794980997293,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/c26a7f86-a0a4-47d9-8db5-2efc26de205b/approve","host":"127.0.0.1:33045","remoteAddress":"127.0.0.1","remotePort":32976},"msg":"incoming request"}
{"level":30,"time":1794980997296,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":3.506395999999995,"msg":"request completed"}
{"level":30,"time":1794980997297,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/c26a7f86-a0a4-47d9-8db5-2efc26de205b/fulfill","host":"127.0.0.1:45937","remoteAddress":"127.0.0.1","remotePort":48180},"msg":"incoming request"}
{"level":30,"time":1794980997300,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.320104000000015,"msg":"request completed"}
{"level":30,"time":1794980997301,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/c26a7f86-a0a4-47d9-8db5-2efc26de205b/fulfill","host":"127.0.0.1:45397","remoteAddress":"127.0.0.1","remotePort":39522},"msg":"incoming request"}
{"level":30,"time":1794980997303,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.6161480000000097,"msg":"request completed"}
{"level":30,"time":1794980997305,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/d6250cb0-a0fc-41d6-9e51-14448cc98e64/timeline","host":"127.0.0.1:41465","remoteAddress":"127.0.0.1","remotePort":36342},"msg":"incoming request"}
{"level":30,"time":1794980997308,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.902285000000006,"msg":"request completed"}
{"level":30,"time":1794980997309,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37263","remoteAddress":"127.0.0.1","remotePort":38540},"msg":"incoming request"}
{"level":30,"time":1794980997312,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.5085679999999684,"msg":"request completed"}
{"level":30,"time":1794980997312,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37603","remoteAddress":"127.0.0.1","remotePort":58574},"msg":"incoming request"}
{"level":30,"time":1794980997313,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":0.9708080000000336,"msg":"request completed"}
{"level":30,"time":1794980997315,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46527","remoteAddress":"127.0.0.1","remotePort":60762},"msg":"incoming request"}
{"level":30,"time":1794980997317,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.2009009999999876,"msg":"request completed"}
{"level":30,"time":1794980997318,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:44011","remoteAddress":"127.0.0.1","remotePort":53788},"msg":"incoming request"}
{"level":30,"time":1794980997320,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":2.2179230000000416,"msg":"request completed"}
{"level":30,"time":1794980997321,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/d4e88026-f1d9-4c2c-91e2-b5a9a72e4d45/fulfill","host":"127.0.0.1:33959","remoteAddress":"127.0.0.1","remotePort":49102},"msg":"incoming request"}
{"level":30,"time":1794980997323,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":409},"responseTime":2.045620999999983,"msg":"request completed"}
{"level":30,"time":1794980997324,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/d4e88026-f1d9-4c2c-91e2-b5a9a72e4d45/approve","host":"127.0.0.1:41585","remoteAddress":"127.0.0.1","remotePort":40888},"msg":"incoming request"}
{"level":30,"time":1794980997325,"pid":54884,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":409},"responseTime":1.180470000000014,"msg":"request completed"}
{"level":30,"time":1794980997574,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:45145","remoteAddress":"127.0.0.1","remotePort":34088},"msg":"incoming request"}
{"level":30,"time":1794980997579,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.553505999999999,"msg":"request completed"}
{"level":30,"time":1794980997582,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:37507","remoteAddress":"127.0.0.1","remotePort":39030},"msg":"incoming request"}
{"level":30,"time":1794980997584,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":2.3445000000000107,"msg":"request completed"}
{"level":30,"time":1794980997585,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40725","remoteAddress":"127.0.0.1","remotePort":37466},"msg":"incoming request"}
{"level":30,"time":1794980997595,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":10.222822000000008,"msg":"request completed"}
{"level":30,"time":1794980997596,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:34367","remoteAddress":"127.0.0.1","remotePort":59310},"msg":"incoming request"}
{"level":30,"time":1794980997606,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":10.106314999999995,"msg":"request completed"}
{"level":30,"time":1794980997607,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/c60192ea-997c-4b3f-be50-22f30076b21b/send","host":"127.0.0.1:41315","remoteAddress":"127.0.0.1","remotePort":43306},"msg":"incoming request"}
{"level":30,"time":1794980997610,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":403},"responseTime":2.2613039999999955,"msg":"request completed"}
{"level":30,"time":1794980997611,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/c60192ea-997c-4b3f-be50-22f30076b21b/send","host":"127.0.0.1:45599","remoteAddress":"127.0.0.1","remotePort":60898},"msg":"incoming request"}
{"level":30,"time":1794980997616,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":4.576688999999988,"msg":"request completed"}
{"level":30,"time":1794980997618,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/b497e443-e4a3-436c-9c41-66bad9aeaa6e/timeline","host":"127.0.0.1:34965","remoteAddress":"127.0.0.1","remotePort":55534},"msg":"incoming request"}
{"level":30,"time":1794980997621,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.7863170000000537,"msg":"request completed"}
{"level":30,"time":1794980997622,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/c60192ea-997c-4b3f-be50-22f30076b21b/delivery-status","host":"127.0.0.1:43703","remoteAddress":"127.0.0.1","remotePort":39702},"msg":"incoming request"}
{"level":30,"time":1794980997624,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.879399000000035,"msg":"request completed"}
{"level":30,"time":1794980997625,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:42957","remoteAddress":"127.0.0.1","remotePort":34932},"msg":"incoming request"}
{"level":30,"time":1794980997627,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":1.6481259999999907,"msg":"request completed"}
{"level":30,"time":1794980997628,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:39069","remoteAddress":"127.0.0.1","remotePort":39970},"msg":"incoming request"}
{"level":30,"time":1794980997630,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.2377800000000434,"msg":"request completed"}
{"level":30,"time":1794980997631,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:33275","remoteAddress":"127.0.0.1","remotePort":37856},"msg":"incoming request"}
{"level":30,"time":1794980997634,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":3.2881380000000036,"msg":"request completed"}
{"level":30,"time":1794980997635,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/fd044517-be03-4b26-954b-ff93c0a44ee4/send","host":"127.0.0.1:46257","remoteAddress":"127.0.0.1","remotePort":38968},"msg":"incoming request"}
{"level":30,"time":1794980997637,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":400},"responseTime":1.5059800000000223,"msg":"request completed"}
{"level":30,"time":1794980997637,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/6c01350d-6128-4b08-94b2-40d890508165/approve","host":"127.0.0.1:41227","remoteAddress":"127.0.0.1","remotePort":35600},"msg":"incoming request"}
{"level":30,"time":1794980997639,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.525716999999986,"msg":"request completed"}
{"level":30,"time":1794980997640,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/fd044517-be03-4b26-954b-ff93c0a44ee4/send","host":"127.0.0.1:42703","remoteAddress":"127.0.0.1","remotePort":55936},"msg":"incoming request"}
{"level":30,"time":1794980997642,"pid":54913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.8907700000000318,"msg":"request completed"}
{"level":30,"time":1794980997890,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46691","remoteAddress":"127.0.0.1","remotePort":44196},"msg":"incoming request"}
{"level":30,"time":1794980997903,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.19897499999999,"msg":"request completed"}
{"level":30,"time":1794980997906,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/4b4dc38e-5542-4862-a925-68907ec658de/timeline","host":"127.0.0.1:35293","remoteAddress":"127.0.0.1","remotePort":55064},"msg":"incoming request"}
{"level":30,"time":1794980997909,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.946567000000016,"msg":"request completed"}
{"level":30,"time":1794980997911,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42349","remoteAddress":"127.0.0.1","remotePort":47158},"msg":"incoming request"}
{"level":30,"time":1794980997914,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1412930000000188,"msg":"request completed"}
{"level":30,"time":1794980997915,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46301","remoteAddress":"127.0.0.1","remotePort":42768},"msg":"incoming request"}
{"level":30,"time":1794980997916,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":409},"responseTime":1.5179820000000177,"msg":"request completed"}
{"level":30,"time":1794980997917,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37727","remoteAddress":"127.0.0.1","remotePort":45254},"msg":"incoming request"}
{"level":30,"time":1794980997920,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.4529130000000237,"msg":"request completed"}
{"level":30,"time":1794980997921,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32775","remoteAddress":"127.0.0.1","remotePort":49864},"msg":"incoming request"}
{"level":30,"time":1794980997924,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":201},"responseTime":2.9710830000000215,"msg":"request completed"}
{"level":30,"time":1794980997925,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42375","remoteAddress":"127.0.0.1","remotePort":49542},"msg":"incoming request"}
{"level":30,"time":1794980997928,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.3368350000000078,"msg":"request completed"}
{"level":30,"time":1794980997928,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38775","remoteAddress":"127.0.0.1","remotePort":46060},"msg":"incoming request"}
{"level":30,"time":1794980997931,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.386429000000021,"msg":"request completed"}
{"level":30,"time":1794980997932,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:40951","remoteAddress":"127.0.0.1","remotePort":42520},"msg":"incoming request"}
{"level":30,"time":1794980997934,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.17104599999999,"msg":"request completed"}
{"level":30,"time":1794980997936,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35087","remoteAddress":"127.0.0.1","remotePort":59146},"msg":"incoming request"}
{"level":30,"time":1794980997939,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.399712999999963,"msg":"request completed"}
{"level":30,"time":1794980997940,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/dfb87791-bfa5-4545-a290-68ffe71a6bee","host":"127.0.0.1:41563","remoteAddress":"127.0.0.1","remotePort":49856},"msg":"incoming request"}
{"level":30,"time":1794980997941,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":404},"responseTime":1.4224530000000186,"msg":"request completed"}
{"level":30,"time":1794980997942,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:39387","remoteAddress":"127.0.0.1","remotePort":55134},"msg":"incoming request"}
{"level":30,"time":1794980997944,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.8204690000000028,"msg":"request completed"}
{"level":30,"time":1794980997945,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/dfb87791-bfa5-4545-a290-68ffe71a6bee","host":"127.0.0.1:41095","remoteAddress":"127.0.0.1","remotePort":50308},"msg":"incoming request"}
{"level":30,"time":1794980997946,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":404},"responseTime":1.368161999999984,"msg":"request completed"}
{"level":30,"time":1794980997947,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/dfb87791-bfa5-4545-a290-68ffe71a6bee/timeline","host":"127.0.0.1:37601","remoteAddress":"127.0.0.1","remotePort":36318},"msg":"incoming request"}
{"level":30,"time":1794980997948,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":404},"responseTime":1.012155000000007,"msg":"request completed"}
{"level":30,"time":1794980997949,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43691","remoteAddress":"127.0.0.1","remotePort":40678},"msg":"incoming request"}
{"level":30,"time":1794980997951,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.0767380000000344,"msg":"request completed"}
{"level":30,"time":1794980997961,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41957","remoteAddress":"127.0.0.1","remotePort":60658},"msg":"incoming request"}
{"level":30,"time":1794980997969,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":8.597769999999969,"msg":"request completed"}
{"level":30,"time":1794980997970,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36875","remoteAddress":"127.0.0.1","remotePort":44238},"msg":"incoming request"}
{"level":30,"time":1794980997973,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.0575660000000084,"msg":"request completed"}
{"level":30,"time":1794980997974,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40003","remoteAddress":"127.0.0.1","remotePort":49742},"msg":"incoming request"}
{"level":30,"time":1794980997977,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.532442000000003,"msg":"request completed"}
{"level":30,"time":1794980997977,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:45319","remoteAddress":"127.0.0.1","remotePort":44706},"msg":"incoming request"}
{"level":40,"time":1794980997980,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794980997982,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":201},"responseTime":4.47972900000002,"msg":"request completed"}
{"level":30,"time":1794980997983,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/a5f9d6b1-6559-4566-a79c-984be5f8f2cb/approve","host":"127.0.0.1:40837","remoteAddress":"127.0.0.1","remotePort":33542},"msg":"incoming request"}
{"level":40,"time":1794980997985,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794980997985,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.5458269999999743,"msg":"request completed"}
{"level":30,"time":1794980997986,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:32911","remoteAddress":"127.0.0.1","remotePort":34356},"msg":"incoming request"}
{"level":30,"time":1794980997988,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7058339999999816,"msg":"request completed"}
{"level":30,"time":1794980997989,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35371","remoteAddress":"127.0.0.1","remotePort":53624},"msg":"incoming request"}
{"level":30,"time":1794980997990,"pid":54961,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8713620000000333,"msg":"request completed"}
{"level":30,"time":1794980998235,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38237","remoteAddress":"127.0.0.1","remotePort":35290},"msg":"incoming request"}
{"level":30,"time":1794980998249,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.551566000000008,"msg":"request completed"}
{"level":30,"time":1794980998252,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38837","remoteAddress":"127.0.0.1","remotePort":48142},"msg":"incoming request"}
{"level":30,"time":1794980998256,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.9129070000000183,"msg":"request completed"}
{"level":30,"time":1794980998257,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:41121","remoteAddress":"127.0.0.1","remotePort":38572},"msg":"incoming request"}
{"level":30,"time":1794980998261,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.51640500000002,"msg":"request completed"}
{"level":30,"time":1794980998262,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37015","remoteAddress":"127.0.0.1","remotePort":54194},"msg":"incoming request"}
{"level":30,"time":1794980998266,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1369439999999713,"msg":"request completed"}
{"level":30,"time":1794980998267,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:40801","remoteAddress":"127.0.0.1","remotePort":32772},"msg":"incoming request"}
{"level":30,"time":1794980998269,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.8545219999999745,"msg":"request completed"}
{"level":30,"time":1794980998270,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:33547","remoteAddress":"127.0.0.1","remotePort":38092},"msg":"incoming request"}
{"level":30,"time":1794980998272,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7587929999999687,"msg":"request completed"}
{"level":30,"time":1794980998273,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:43549","remoteAddress":"127.0.0.1","remotePort":39648},"msg":"incoming request"}
{"level":30,"time":1794980998275,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6421040000000175,"msg":"request completed"}
{"level":30,"time":1794980998276,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:44889","remoteAddress":"127.0.0.1","remotePort":58258},"msg":"incoming request"}
{"level":30,"time":1794980998278,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.875472000000002,"msg":"request completed"}
{"level":30,"time":1794980998279,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:39411","remoteAddress":"127.0.0.1","remotePort":55614},"msg":"incoming request"}
{"level":30,"time":1794980998280,"pid":54973,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.578675999999973,"msg":"request completed"}
{"level":30,"time":1794980998527,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37859","remoteAddress":"127.0.0.1","remotePort":45584},"msg":"incoming request"}
{"level":30,"time":1794980998541,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.243107999999978,"msg":"request completed"}
{"level":30,"time":1794980998543,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/activation","host":"127.0.0.1:36245","remoteAddress":"127.0.0.1","remotePort":57396},"msg":"incoming request"}
{"level":30,"time":1794980998546,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":2.4419520000000148,"msg":"request completed"}
{"level":30,"time":1794980998547,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc","host":"127.0.0.1:36687","remoteAddress":"127.0.0.1","remotePort":60672},"msg":"incoming request"}
{"level":30,"time":1794980998549,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.0857260000000224,"msg":"request completed"}
{"level":30,"time":1794980998550,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/command-roles","host":"127.0.0.1:44661","remoteAddress":"127.0.0.1","remotePort":55804},"msg":"incoming request"}
{"level":30,"time":1794980998552,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.446691000000044,"msg":"request completed"}
{"level":30,"time":1794980998553,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/activation","host":"127.0.0.1:41011","remoteAddress":"127.0.0.1","remotePort":55804},"msg":"incoming request"}
{"level":30,"time":1794980998556,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.744308999999987,"msg":"request completed"}
{"level":30,"time":1794980998557,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/timeline","host":"127.0.0.1:37639","remoteAddress":"127.0.0.1","remotePort":55766},"msg":"incoming request"}
{"level":30,"time":1794980998559,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.109359999999981,"msg":"request completed"}
{"level":30,"time":1794980998560,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/activation","host":"127.0.0.1:41959","remoteAddress":"127.0.0.1","remotePort":40808},"msg":"incoming request"}
{"level":30,"time":1794980998561,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":400},"responseTime":0.9903839999999491,"msg":"request completed"}
{"level":30,"time":1794980998562,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc","host":"127.0.0.1:43865","remoteAddress":"127.0.0.1","remotePort":55708},"msg":"incoming request"}
{"level":30,"time":1794980998564,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8347850000000108,"msg":"request completed"}
{"level":30,"time":1794980998565,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/command-roles","host":"127.0.0.1:45275","remoteAddress":"127.0.0.1","remotePort":57620},"msg":"incoming request"}
{"level":30,"time":1794980998567,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.1043699999999603,"msg":"request completed"}
{"level":30,"time":1794980998568,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/timeline","host":"127.0.0.1:39175","remoteAddress":"127.0.0.1","remotePort":55648},"msg":"incoming request"}
{"level":30,"time":1794980998570,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":1.6787030000000414,"msg":"request completed"}
{"level":30,"time":1794980998571,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/closure","host":"127.0.0.1:46113","remoteAddress":"127.0.0.1","remotePort":38538},"msg":"incoming request"}
{"level":30,"time":1794980998574,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.465910000000008,"msg":"request completed"}
{"level":30,"time":1794980998575,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/19d6d4b1-ac7a-4f84-923e-1301df595bbc/timeline","host":"127.0.0.1:36613","remoteAddress":"127.0.0.1","remotePort":52512},"msg":"incoming request"}
{"level":30,"time":1794980998577,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.7824679999999944,"msg":"request completed"}
{"level":30,"time":1794980998578,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43049","remoteAddress":"127.0.0.1","remotePort":33436},"msg":"incoming request"}
{"level":30,"time":1794980998582,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":3.262209000000041,"msg":"request completed"}
{"level":30,"time":1794980998582,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/2d67d0ba-d9d7-4650-8e75-88d84770a3aa/command-roles","host":"127.0.0.1:39547","remoteAddress":"127.0.0.1","remotePort":42366},"msg":"incoming request"}
{"level":30,"time":1794980998585,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.124147999999991,"msg":"request completed"}
{"level":30,"time":1794980998585,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/2d67d0ba-d9d7-4650-8e75-88d84770a3aa/command-roles","host":"127.0.0.1:41297","remoteAddress":"127.0.0.1","remotePort":47934},"msg":"incoming request"}
{"level":30,"time":1794980998587,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.7395970000000034,"msg":"request completed"}
{"level":30,"time":1794980998588,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/2d67d0ba-d9d7-4650-8e75-88d84770a3aa/timeline","host":"127.0.0.1:36947","remoteAddress":"127.0.0.1","remotePort":54612},"msg":"incoming request"}
{"level":30,"time":1794980998589,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":200},"responseTime":1.6522640000000024,"msg":"request completed"}
{"level":30,"time":1794980998591,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34767","remoteAddress":"127.0.0.1","remotePort":46464},"msg":"incoming request"}
{"level":30,"time":1794980998594,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.1482450000000313,"msg":"request completed"}
{"level":30,"time":1794980998595,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/5da739d9-2b5f-493c-b6be-328a523fa0d7/activation","host":"127.0.0.1:39733","remoteAddress":"127.0.0.1","remotePort":58480},"msg":"incoming request"}
{"level":30,"time":1794980998596,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":404},"responseTime":1.4540629999999624,"msg":"request completed"}
{"level":30,"time":1794980998597,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/5da739d9-2b5f-493c-b6be-328a523fa0d7/command-roles","host":"127.0.0.1:35379","remoteAddress":"127.0.0.1","remotePort":37284},"msg":"incoming request"}
{"level":30,"time":1794980998598,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":404},"responseTime":1.2081919999999968,"msg":"request completed"}
{"level":30,"time":1794980998599,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/5da739d9-2b5f-493c-b6be-328a523fa0d7/closure","host":"127.0.0.1:34827","remoteAddress":"127.0.0.1","remotePort":53748},"msg":"incoming request"}
{"level":30,"time":1794980998600,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":404},"responseTime":1.1566960000000108,"msg":"request completed"}
{"level":30,"time":1794980998601,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/5da739d9-2b5f-493c-b6be-328a523fa0d7/activation","host":"127.0.0.1:44175","remoteAddress":"127.0.0.1","remotePort":43140},"msg":"incoming request"}
{"level":30,"time":1794980998603,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7506880000000251,"msg":"request completed"}
{"level":30,"time":1794980998604,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45323","remoteAddress":"127.0.0.1","remotePort":38274},"msg":"incoming request"}
{"level":30,"time":1794980998606,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":201},"responseTime":2.5538420000000315,"msg":"request completed"}
{"level":30,"time":1794980998607,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/8ed05db9-1027-4cab-9639-b9bb095af041/closure","host":"127.0.0.1:44677","remoteAddress":"127.0.0.1","remotePort":56508},"msg":"incoming request"}
{"level":30,"time":1794980998610,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","res":{"statusCode":200},"responseTime":2.6655920000000037,"msg":"request completed"}
{"level":30,"time":1794980998610,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/8ed05db9-1027-4cab-9639-b9bb095af041/closure","host":"127.0.0.1:33047","remoteAddress":"127.0.0.1","remotePort":57184},"msg":"incoming request"}
{"level":30,"time":1794980998613,"pid":54983,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","res":{"statusCode":409},"responseTime":2.4343790000000354,"msg":"request completed"}
{"level":30,"time":1794980998858,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44707","remoteAddress":"127.0.0.1","remotePort":42406},"msg":"incoming request"}
{"level":30,"time":1794980998872,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.540545999999978,"msg":"request completed"}
{"level":30,"time":1794980998875,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:32897","remoteAddress":"127.0.0.1","remotePort":39970},"msg":"incoming request"}
{"level":30,"time":1794980998878,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.5774390000000267,"msg":"request completed"}
{"level":30,"time":1794980998879,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/c6c3cfaf-770c-4700-b932-1c866efdb235/sitreps","host":"127.0.0.1:38043","remoteAddress":"127.0.0.1","remotePort":43186},"msg":"incoming request"}
{"level":30,"time":1794980998883,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1472530000000347,"msg":"request completed"}
{"level":30,"time":1794980998884,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41883","remoteAddress":"127.0.0.1","remotePort":48736},"msg":"incoming request"}
{"level":30,"time":1794980998886,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.778652999999963,"msg":"request completed"}
{"level":30,"time":1794980998888,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/481949b5-0d6a-4f54-8928-723c1df63893/aar","host":"127.0.0.1:43693","remoteAddress":"127.0.0.1","remotePort":60624},"msg":"incoming request"}
{"level":30,"time":1794980998889,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":409},"responseTime":1.5744179999999801,"msg":"request completed"}
{"level":30,"time":1794980998890,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/481949b5-0d6a-4f54-8928-723c1df63893/closure","host":"127.0.0.1:33343","remoteAddress":"127.0.0.1","remotePort":50564},"msg":"incoming request"}
{"level":30,"time":1794980998894,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.1274660000000267,"msg":"request completed"}
{"level":30,"time":1794980998894,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/481949b5-0d6a-4f54-8928-723c1df63893/aar","host":"127.0.0.1:34905","remoteAddress":"127.0.0.1","remotePort":35802},"msg":"incoming request"}
{"level":30,"time":1794980998897,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.685619000000031,"msg":"request completed"}
{"level":30,"time":1794980998898,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43761","remoteAddress":"127.0.0.1","remotePort":49896},"msg":"incoming request"}
{"level":30,"time":1794980998901,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.3356640000000084,"msg":"request completed"}
{"level":30,"time":1794980998902,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/6132d51a-cd5a-4e04-b59d-2c17135c38ef/closure","host":"127.0.0.1:37489","remoteAddress":"127.0.0.1","remotePort":49290},"msg":"incoming request"}
{"level":30,"time":1794980998904,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.7994320000000243,"msg":"request completed"}
{"level":30,"time":1794980998905,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/6132d51a-cd5a-4e04-b59d-2c17135c38ef/aar","host":"127.0.0.1:40097","remoteAddress":"127.0.0.1","remotePort":48970},"msg":"incoming request"}
{"level":30,"time":1794980998907,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":422},"responseTime":1.2634060000000318,"msg":"request completed"}
{"level":30,"time":1794980998908,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41831","remoteAddress":"127.0.0.1","remotePort":33822},"msg":"incoming request"}
{"level":30,"time":1794980998910,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":2.3186419999999544,"msg":"request completed"}
{"level":30,"time":1794980998911,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/6b7ea0db-0892-48e2-9fe4-5469b48bb989/closure","host":"127.0.0.1:39567","remoteAddress":"127.0.0.1","remotePort":36260},"msg":"incoming request"}
{"level":30,"time":1794980998913,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.340471999999977,"msg":"request completed"}
{"level":30,"time":1794980998914,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/6b7ea0db-0892-48e2-9fe4-5469b48bb989/aar","host":"127.0.0.1:35279","remoteAddress":"127.0.0.1","remotePort":59486},"msg":"incoming request"}
{"level":30,"time":1794980998916,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.407197999999994,"msg":"request completed"}
{"level":30,"time":1794980998917,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/6b7ea0db-0892-48e2-9fe4-5469b48bb989/aar/f5818ab3-e522-446d-81b1-b145cd057a94/finalize","host":"127.0.0.1:45345","remoteAddress":"127.0.0.1","remotePort":35814},"msg":"incoming request"}
{"level":30,"time":1794980998920,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.4638229999999908,"msg":"request completed"}
{"level":30,"time":1794980998920,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/6b7ea0db-0892-48e2-9fe4-5469b48bb989/aar/f5818ab3-e522-446d-81b1-b145cd057a94/finalize","host":"127.0.0.1:34437","remoteAddress":"127.0.0.1","remotePort":44714},"msg":"incoming request"}
{"level":30,"time":1794980998922,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":403},"responseTime":1.1889560000000188,"msg":"request completed"}
{"level":30,"time":1794980998923,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35741","remoteAddress":"127.0.0.1","remotePort":46288},"msg":"incoming request"}
{"level":30,"time":1794980998925,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.3925500000000284,"msg":"request completed"}
{"level":30,"time":1794980998926,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/5a136e18-a137-4448-9a54-1a36805446ea/closure","host":"127.0.0.1:39563","remoteAddress":"127.0.0.1","remotePort":57328},"msg":"incoming request"}
{"level":30,"time":1794980998928,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.31245100000001,"msg":"request completed"}
{"level":30,"time":1794980998929,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/5a136e18-a137-4448-9a54-1a36805446ea/aar","host":"127.0.0.1:45213","remoteAddress":"127.0.0.1","remotePort":44096},"msg":"incoming request"}
{"level":30,"time":1794980998931,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.1008830000000103,"msg":"request completed"}
{"level":30,"time":1794980998931,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/5a136e18-a137-4448-9a54-1a36805446ea/aar/b13f0cea-b756-404e-97bc-4197b3bbf726/finalize","host":"127.0.0.1:33637","remoteAddress":"127.0.0.1","remotePort":57936},"msg":"incoming request"}
{"level":30,"time":1794980998933,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":200},"responseTime":1.6411530000000312,"msg":"request completed"}
{"level":30,"time":1794980998934,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=9d427a64-758a-4ad4-969e-deb0b879a7e1&page_size=200","host":"127.0.0.1:39853","remoteAddress":"127.0.0.1","remotePort":39078},"msg":"incoming request"}
{"level":30,"time":1794980998936,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.13928599999997,"msg":"request completed"}
{"level":30,"time":1794980998937,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:40561","remoteAddress":"127.0.0.1","remotePort":53764},"msg":"incoming request"}
{"level":30,"time":1794980998938,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":0.8736459999999511,"msg":"request completed"}
{"level":30,"time":1794980998939,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:34565","remoteAddress":"127.0.0.1","remotePort":39732},"msg":"incoming request"}
{"level":30,"time":1794980998942,"pid":54993,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":200},"responseTime":2.5382529999999974,"msg":"request completed"}
{"level":30,"time":1794980999193,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:38799","remoteAddress":"127.0.0.1","remotePort":36042},"msg":"incoming request"}
{"level":30,"time":1794980999198,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.345978000000002,"msg":"request completed"}
{"level":30,"time":1794980999201,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33903","remoteAddress":"127.0.0.1","remotePort":54328},"msg":"incoming request"}
{"level":30,"time":1794980999202,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":1.8129150000000038,"msg":"request completed"}
{"level":30,"time":1794980999203,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39725","remoteAddress":"127.0.0.1","remotePort":51658},"msg":"incoming request"}
{"level":30,"time":1794980999208,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":4.58504499999998,"msg":"request completed"}
{"level":30,"time":1794980999209,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33687","remoteAddress":"127.0.0.1","remotePort":58616},"msg":"incoming request"}
{"level":30,"time":1794980999219,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.684864999999945,"msg":"request completed"}
{"level":30,"time":1794980999220,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37139","remoteAddress":"127.0.0.1","remotePort":60630},"msg":"incoming request"}
{"level":30,"time":1794980999223,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.6257870000000025,"msg":"request completed"}
{"level":30,"time":1794980999224,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/6ed63cdb-2580-4f41-a0b3-285c4c83f1ab/timeline","host":"127.0.0.1:32851","remoteAddress":"127.0.0.1","remotePort":49762},"msg":"incoming request"}
{"level":30,"time":1794980999226,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3585160000000087,"msg":"request completed"}
{"level":30,"time":1794980999227,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41821","remoteAddress":"127.0.0.1","remotePort":56030},"msg":"incoming request"}
{"level":30,"time":1794980999229,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.1731189999999856,"msg":"request completed"}
{"level":30,"time":1794980999230,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/34629d6a-a7ed-48e9-9452-c5f76d262ed8/status","host":"127.0.0.1:37999","remoteAddress":"127.0.0.1","remotePort":58262},"msg":"incoming request"}
{"level":30,"time":1794980999232,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":409},"responseTime":1.8434819999999945,"msg":"request completed"}
{"level":30,"time":1794980999234,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35025","remoteAddress":"127.0.0.1","remotePort":60528},"msg":"incoming request"}
{"level":30,"time":1794980999236,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.38496600000002,"msg":"request completed"}
{"level":30,"time":1794980999237,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/d6bea55a-dc4c-4a89-a2ce-d1ecae453d30/status","host":"127.0.0.1:45359","remoteAddress":"127.0.0.1","remotePort":43902},"msg":"incoming request"}
{"level":30,"time":1794980999239,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":409},"responseTime":1.5306249999999864,"msg":"request completed"}
{"level":30,"time":1794980999239,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/d6bea55a-dc4c-4a89-a2ce-d1ecae453d30/status","host":"127.0.0.1:40673","remoteAddress":"127.0.0.1","remotePort":46534},"msg":"incoming request"}
{"level":30,"time":1794980999242,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.390656999999976,"msg":"request completed"}
{"level":30,"time":1794980999243,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/d6bea55a-dc4c-4a89-a2ce-d1ecae453d30/status","host":"127.0.0.1:34191","remoteAddress":"127.0.0.1","remotePort":50676},"msg":"incoming request"}
{"level":30,"time":1794980999244,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":409},"responseTime":1.3866459999999847,"msg":"request completed"}
{"level":30,"time":1794980999245,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/d6bea55a-dc4c-4a89-a2ce-d1ecae453d30/status","host":"127.0.0.1:33223","remoteAddress":"127.0.0.1","remotePort":58012},"msg":"incoming request"}
{"level":30,"time":1794980999247,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.169401999999991,"msg":"request completed"}
{"level":30,"time":1794980999248,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/d6bea55a-dc4c-4a89-a2ce-d1ecae453d30/status","host":"127.0.0.1:38911","remoteAddress":"127.0.0.1","remotePort":59786},"msg":"incoming request"}
{"level":30,"time":1794980999250,"pid":55004,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.0299309999999764,"msg":"request completed"}
{"level":30,"time":1794980999494,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36965","remoteAddress":"127.0.0.1","remotePort":58810},"msg":"incoming request"}
{"level":30,"time":1794980999499,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":4.807171000000011,"msg":"request completed"}
{"level":30,"time":1794980999502,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33837","remoteAddress":"127.0.0.1","remotePort":51338},"msg":"incoming request"}
{"level":30,"time":1794980999502,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.1811700000000087,"msg":"request completed"}
{"level":30,"time":1794980999504,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:35855","remoteAddress":"127.0.0.1","remotePort":45554},"msg":"incoming request"}
{"level":30,"time":1794980999506,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.7392389999999978,"msg":"request completed"}
{"level":30,"time":1794980999507,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40267","remoteAddress":"127.0.0.1","remotePort":54514},"msg":"incoming request"}
{"level":30,"time":1794980999509,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.8369200000000205,"msg":"request completed"}
{"level":30,"time":1794980999510,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33659","remoteAddress":"127.0.0.1","remotePort":38320},"msg":"incoming request"}
{"level":30,"time":1794980999512,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5362070000000188,"msg":"request completed"}
{"level":30,"time":1794980999513,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37633","remoteAddress":"127.0.0.1","remotePort":37442},"msg":"incoming request"}
{"level":30,"time":1794980999513,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4062600000000316,"msg":"request completed"}
{"level":30,"time":1794980999514,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:34701","remoteAddress":"127.0.0.1","remotePort":43410},"msg":"incoming request"}
{"level":30,"time":1794980999516,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.357140999999956,"msg":"request completed"}
{"level":30,"time":1794980999517,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:42835","remoteAddress":"127.0.0.1","remotePort":35874},"msg":"incoming request"}
{"level":30,"time":1794980999518,"pid":55035,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9220359999999914,"msg":"request completed"}
{"level":30,"time":1794980999769,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:39787","remoteAddress":"127.0.0.1","remotePort":59352},"msg":"incoming request"}
{"level":30,"time":1794980999797,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":27.391470999999996,"msg":"request completed"}
{"level":30,"time":1794980999799,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45613","remoteAddress":"127.0.0.1","remotePort":54870},"msg":"incoming request"}
{"level":30,"time":1794980999802,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.6854589999999803,"msg":"request completed"}
{"level":30,"time":1794980999804,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:36819","remoteAddress":"127.0.0.1","remotePort":57922},"msg":"incoming request"}
{"level":30,"time":1794980999805,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":400},"responseTime":1.6882120000000214,"msg":"request completed"}
{"level":30,"time":1794980999806,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:43039","remoteAddress":"127.0.0.1","remotePort":39924},"msg":"incoming request"}
{"level":30,"time":1794980999810,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.3202479999999923,"msg":"request completed"}
{"level":30,"time":1794980999811,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/4e6efd52-8718-4c81-866b-cf9233e36105/revoke","host":"127.0.0.1:36247","remoteAddress":"127.0.0.1","remotePort":55256},"msg":"incoming request"}
{"level":30,"time":1794980999814,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":204},"responseTime":2.7536359999999718,"msg":"request completed"}
{"level":30,"time":1794980999816,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44297","remoteAddress":"127.0.0.1","remotePort":35916},"msg":"incoming request"}
{"level":30,"time":1794980999818,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.29265300000003,"msg":"request completed"}
{"level":30,"time":1794980999819,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:39009","remoteAddress":"127.0.0.1","remotePort":44666},"msg":"incoming request"}
{"level":30,"time":1794980999821,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4205600000000231,"msg":"request completed"}
{"level":30,"time":1794980999822,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43683","remoteAddress":"127.0.0.1","remotePort":41602},"msg":"incoming request"}
{"level":30,"time":1794980999824,"pid":55081,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8874439999999595,"msg":"request completed"}
{"level":30,"time":1794981000068,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:36579","remoteAddress":"127.0.0.1","remotePort":35196},"msg":"incoming request"}
{"level":30,"time":1794981000074,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":5.320652999999993,"msg":"request completed"}
{"level":30,"time":1794981000077,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:43537","remoteAddress":"127.0.0.1","remotePort":43694},"msg":"incoming request"}
{"level":30,"time":1794981000080,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.8158050000000117,"msg":"request completed"}
{"level":30,"time":1794981000082,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45457","remoteAddress":"127.0.0.1","remotePort":43010},"msg":"incoming request"}
{"level":30,"time":1794981000084,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.0761380000000145,"msg":"request completed"}
{"level":30,"time":1794981000085,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/a0a84688-b5af-404d-9c40-8f51b9576ffe","host":"127.0.0.1:41435","remoteAddress":"127.0.0.1","remotePort":54656},"msg":"incoming request"}
{"level":30,"time":1794981000087,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.4679219999999873,"msg":"request completed"}
{"level":30,"time":1794981000088,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37469","remoteAddress":"127.0.0.1","remotePort":35008},"msg":"incoming request"}
{"level":30,"time":1794981000089,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":401},"responseTime":0.39393799999999146,"msg":"request completed"}
{"level":30,"time":1794981000090,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:46127","remoteAddress":"127.0.0.1","remotePort":56768},"msg":"incoming request"}
{"level":30,"time":1794981000091,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":403},"responseTime":1.1179730000000063,"msg":"request completed"}
{"level":30,"time":1794981000092,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/35463cbd-22bb-4519-9c32-cccf5e25bbb8","host":"127.0.0.1:34289","remoteAddress":"127.0.0.1","remotePort":58472},"msg":"incoming request"}
{"level":30,"time":1794981000095,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":3.0612919999999804,"msg":"request completed"}
{"level":30,"time":1794981000096,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:43303","remoteAddress":"127.0.0.1","remotePort":60198},"msg":"incoming request"}
{"level":30,"time":1794981000099,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.3112479999999778,"msg":"request completed"}
{"level":30,"time":1794981000100,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=2fccf529-d330-4e5f-84f7-f748ea55b7b0&page_size=50","host":"127.0.0.1:42213","remoteAddress":"127.0.0.1","remotePort":40124},"msg":"incoming request"}
{"level":30,"time":1794981000102,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.6592980000000352,"msg":"request completed"}
{"level":30,"time":1794981000103,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37175","remoteAddress":"127.0.0.1","remotePort":58270},"msg":"incoming request"}
{"level":30,"time":1794981000105,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":403},"responseTime":1.5425189999999702,"msg":"request completed"}
{"level":30,"time":1794981000106,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:35619","remoteAddress":"127.0.0.1","remotePort":54706},"msg":"incoming request"}
{"level":30,"time":1794981000107,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.5550610000000233,"msg":"request completed"}
{"level":30,"time":1794981000108,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:38973","remoteAddress":"127.0.0.1","remotePort":52044},"msg":"incoming request"}
{"level":30,"time":1794981000111,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":422},"responseTime":2.454275999999993,"msg":"request completed"}
{"level":30,"time":1794981000112,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:38545","remoteAddress":"127.0.0.1","remotePort":53424},"msg":"incoming request"}
{"level":30,"time":1794981000114,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.745849000000021,"msg":"request completed"}
{"level":30,"time":1794981000114,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=2fccf529-d330-4e5f-84f7-f748ea55b7b0&action_type=record_view","host":"127.0.0.1:38303","remoteAddress":"127.0.0.1","remotePort":34426},"msg":"incoming request"}
{"level":30,"time":1794981000116,"pid":55091,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.5074030000000107,"msg":"request completed"}
{"level":30,"time":1794981000360,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34285","remoteAddress":"127.0.0.1","remotePort":41208},"msg":"incoming request"}
{"level":30,"time":1794981000374,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":14.047633999999988,"msg":"request completed"}
{"level":30,"time":1794981000381,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/39951bfd-e3cc-4fbf-a8c3-c768d77c3e4d/timeline","host":"127.0.0.1:39481","remoteAddress":"127.0.0.1","remotePort":39328},"msg":"incoming request"}
{"level":30,"time":1794981000384,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.899249999999995,"msg":"request completed"}
{"level":30,"time":1794981000388,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32831","remoteAddress":"127.0.0.1","remotePort":50290},"msg":"incoming request"}
{"level":30,"time":1794981000391,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.0265870000000064,"msg":"request completed"}
{"level":30,"time":1794981000393,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/c02486aa-7f85-4356-8333-62af098d8e4a/closure","host":"127.0.0.1:45577","remoteAddress":"127.0.0.1","remotePort":56688},"msg":"incoming request"}
{"level":30,"time":1794981000396,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":3.3798079999999686,"msg":"request completed"}
{"level":30,"time":1794981000397,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/c02486aa-7f85-4356-8333-62af098d8e4a/timeline","host":"127.0.0.1:45119","remoteAddress":"127.0.0.1","remotePort":40148},"msg":"incoming request"}
{"level":30,"time":1794981000399,"pid":55101,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6285100000000057,"msg":"request completed"}
{"level":30,"time":1794981000642,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:40185","remoteAddress":"127.0.0.1","remotePort":49668},"msg":"incoming request"}
{"level":30,"time":1794981000655,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.00279900000001,"msg":"request completed"}
{"level":30,"time":1794981000658,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e/submit-review","host":"127.0.0.1:33365","remoteAddress":"127.0.0.1","remotePort":53932},"msg":"incoming request"}
{"level":30,"time":1794981000663,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":5.124205000000018,"msg":"request completed"}
{"level":30,"time":1794981000664,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e/review","host":"127.0.0.1:33079","remoteAddress":"127.0.0.1","remotePort":40818},"msg":"incoming request"}
{"level":30,"time":1794981000667,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":403},"responseTime":2.140346999999963,"msg":"request completed"}
{"level":30,"time":1794981000667,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e","host":"127.0.0.1:45961","remoteAddress":"127.0.0.1","remotePort":35500},"msg":"incoming request"}
{"level":30,"time":1794981000669,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7386759999999981,"msg":"request completed"}
{"level":30,"time":1794981000670,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e/review","host":"127.0.0.1:45103","remoteAddress":"127.0.0.1","remotePort":37414},"msg":"incoming request"}
{"level":30,"time":1794981000674,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.352999000000011,"msg":"request completed"}
{"level":30,"time":1794981000674,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e","host":"127.0.0.1:36821","remoteAddress":"127.0.0.1","remotePort":58610},"msg":"incoming request"}
{"level":30,"time":1794981000676,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.752320999999995,"msg":"request completed"}
{"level":30,"time":1794981000677,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e/sections/d560db7b-8085-4d89-bc62-40712136c421/link-tasks","host":"127.0.0.1:43243","remoteAddress":"127.0.0.1","remotePort":57236},"msg":"incoming request"}
{"level":30,"time":1794981000679,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":204},"responseTime":2.0889119999999934,"msg":"request completed"}
{"level":30,"time":1794981000680,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e","host":"127.0.0.1:41747","remoteAddress":"127.0.0.1","remotePort":37902},"msg":"incoming request"}
{"level":30,"time":1794981000682,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.1238669999999615,"msg":"request completed"}
{"level":30,"time":1794981000683,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37515","remoteAddress":"127.0.0.1","remotePort":53590},"msg":"incoming request"}
{"level":30,"time":1794981000694,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":10.281443000000024,"msg":"request completed"}
{"level":30,"time":1794981000695,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/4ef81c77-8233-4b9a-94c3-9c696d14d43e/materialize-tasks","host":"127.0.0.1:38651","remoteAddress":"127.0.0.1","remotePort":44490},"msg":"incoming request"}
{"level":30,"time":1794981000698,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":3.259412999999995,"msg":"request completed"}
{"level":30,"time":1794981000699,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=28d416ea-18e0-43de-9229-daff49e1f59a","host":"127.0.0.1:44591","remoteAddress":"127.0.0.1","remotePort":45464},"msg":"incoming request"}
{"level":30,"time":1794981000702,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.0633040000000165,"msg":"request completed"}
{"level":30,"time":1794981000703,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46375","remoteAddress":"127.0.0.1","remotePort":52292},"msg":"incoming request"}
{"level":30,"time":1794981000705,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":201},"responseTime":2.5863429999999994,"msg":"request completed"}
{"level":30,"time":1794981000706,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/a88a1386-c937-4420-8054-3df65291e521/review","host":"127.0.0.1:35849","remoteAddress":"127.0.0.1","remotePort":58298},"msg":"incoming request"}
{"level":30,"time":1794981000707,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":409},"responseTime":1.4946390000000065,"msg":"request completed"}
{"level":30,"time":1794981000708,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:34555","remoteAddress":"127.0.0.1","remotePort":35196},"msg":"incoming request"}
{"level":30,"time":1794981000710,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.030302000000006,"msg":"request completed"}
{"level":30,"time":1794981000711,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/68504a99-0a56-45b9-bf70-572a99aaeded/submit-review","host":"127.0.0.1:44089","remoteAddress":"127.0.0.1","remotePort":60652},"msg":"incoming request"}
{"level":30,"time":1794981000712,"pid":55111,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.341942999999958,"msg":"request completed"}

 Test Files  13 passed (13)
      Tests  64 passed (64)
   Start at  05:49:56
   Duration  4.37s (transform 139ms, setup 34ms, import 1.78s, tests 1.87s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 91[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 125[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 77[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 115[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 158[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 99[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 05:50:00
[2m   Duration [22m 1.95s[2m (transform 195ms, setup 182ms, collect 634ms, tests 665ms, environment 1.14s, prepare 167ms)[22m
```

## Wave 3

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
[32m✓[39m 77 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m106.44 kB[22m[1m[22m[2m │ gzip: 23.93 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m67.19 kB[22m[1m[22m[2m │ gzip: 20.10 kB[22m
[32m✓ built in 212ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 130 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DkLgSvGc.css  [39m[1m[2m 48.37 kB[22m[1m[22m[2m │ gzip:   7.98 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C8xuLRjY.js   [39m[1m[2m430.78 kB[22m[1m[22m[2m │ gzip: 125.06 kB[22m
[32m✓ built in 884ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794981619547,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:36935","remoteAddress":"127.0.0.1","remotePort":54170},"msg":"incoming request"}
{"level":30,"time":1794981619597,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":49.86013099999997,"msg":"request completed"}
{"level":30,"time":1794981619600,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39963","remoteAddress":"127.0.0.1","remotePort":46648},"msg":"incoming request"}
{"level":30,"time":1794981619611,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":11.163894999999968,"msg":"request completed"}
{"level":30,"time":1794981619612,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:42387","remoteAddress":"127.0.0.1","remotePort":57932},"msg":"incoming request"}
{"level":30,"time":1794981619617,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":4.460794999999962,"msg":"request completed"}
{"level":30,"time":1794981619619,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/0609f591-2e25-4917-bf42-6955b565ba6b/decline","host":"127.0.0.1:37771","remoteAddress":"127.0.0.1","remotePort":46816},"msg":"incoming request"}
{"level":30,"time":1794981619621,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":422},"responseTime":1.578550000000007,"msg":"request completed"}
{"level":30,"time":1794981619622,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=07f309ca-ddfe-427d-941f-23bd27cafc06","host":"127.0.0.1:33245","remoteAddress":"127.0.0.1","remotePort":59292},"msg":"incoming request"}
{"level":30,"time":1794981619625,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2349609999999984,"msg":"request completed"}
{"level":30,"time":1794981619626,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/0609f591-2e25-4917-bf42-6955b565ba6b/decline","host":"127.0.0.1:46053","remoteAddress":"127.0.0.1","remotePort":35246},"msg":"incoming request"}
{"level":30,"time":1794981619630,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.771963000000028,"msg":"request completed"}
{"level":30,"time":1794981619631,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/07f309ca-ddfe-427d-941f-23bd27cafc06/timeline","host":"127.0.0.1:34679","remoteAddress":"127.0.0.1","remotePort":42958},"msg":"incoming request"}
{"level":30,"time":1794981619640,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":9.024152000000015,"msg":"request completed"}
{"level":30,"time":1794981619641,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43855","remoteAddress":"127.0.0.1","remotePort":56026},"msg":"incoming request"}
{"level":30,"time":1794981619644,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":3.066710999999998,"msg":"request completed"}
{"level":30,"time":1794981619645,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:34413","remoteAddress":"127.0.0.1","remotePort":54440},"msg":"incoming request"}
{"level":30,"time":1794981619648,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.868217999999956,"msg":"request completed"}
{"level":30,"time":1794981619649,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/5493e228-d2de-4490-9224-f626ccc3de7e/approve","host":"127.0.0.1:45487","remoteAddress":"127.0.0.1","remotePort":57920},"msg":"incoming request"}
{"level":30,"time":1794981619652,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":2.981741999999997,"msg":"request completed"}
{"level":30,"time":1794981619654,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/5493e228-d2de-4490-9224-f626ccc3de7e/fulfill","host":"127.0.0.1:40191","remoteAddress":"127.0.0.1","remotePort":40880},"msg":"incoming request"}
{"level":30,"time":1794981619656,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.3312010000000214,"msg":"request completed"}
{"level":30,"time":1794981619657,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/5493e228-d2de-4490-9224-f626ccc3de7e/fulfill","host":"127.0.0.1:43305","remoteAddress":"127.0.0.1","remotePort":39004},"msg":"incoming request"}
{"level":30,"time":1794981619660,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":3.2002919999999904,"msg":"request completed"}
{"level":30,"time":1794981619662,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/2002bb16-c8fa-46c1-a46f-4a3d258f25d8/timeline","host":"127.0.0.1:40221","remoteAddress":"127.0.0.1","remotePort":58532},"msg":"incoming request"}
{"level":30,"time":1794981619664,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.129813000000013,"msg":"request completed"}
{"level":30,"time":1794981619867,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35595","remoteAddress":"127.0.0.1","remotePort":40386},"msg":"incoming request"}
{"level":30,"time":1794981619871,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":3.8259950000000345,"msg":"request completed"}
{"level":30,"time":1794981619872,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:42175","remoteAddress":"127.0.0.1","remotePort":46294},"msg":"incoming request"}
{"level":30,"time":1794981619873,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.1178569999999581,"msg":"request completed"}
{"level":30,"time":1794981619874,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33553","remoteAddress":"127.0.0.1","remotePort":35064},"msg":"incoming request"}
{"level":30,"time":1794981619876,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.131597000000056,"msg":"request completed"}
{"level":30,"time":1794981619877,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:45677","remoteAddress":"127.0.0.1","remotePort":43536},"msg":"incoming request"}
{"level":30,"time":1794981619879,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":2.3433140000000776,"msg":"request completed"}
{"level":30,"time":1794981619880,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/c7b94f4b-c1be-4e9a-9793-0f80d5a25626/fulfill","host":"127.0.0.1:45223","remoteAddress":"127.0.0.1","remotePort":48764},"msg":"incoming request"}
{"level":30,"time":1794981619882,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":409},"responseTime":1.4168670000000247,"msg":"request completed"}
{"level":30,"time":1794981619883,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/c7b94f4b-c1be-4e9a-9793-0f80d5a25626/approve","host":"127.0.0.1:42039","remoteAddress":"127.0.0.1","remotePort":39554},"msg":"incoming request"}
{"level":30,"time":1794981619884,"pid":76790,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":409},"responseTime":1.2359780000000455,"msg":"request completed"}
{"level":30,"time":1794981620135,"pid":76866,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:46363","remoteAddress":"127.0.0.1","remotePort":39844},"msg":"incoming request"}
{"level":30,"time":1794981620184,"pid":76866,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":48.636055,"msg":"request completed"}
{"level":30,"time":1794981620390,"pid":76866,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:38479","remoteAddress":"127.0.0.1","remotePort":49124},"msg":"incoming request"}
{"level":30,"time":1794981620393,"pid":76866,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.3524869999999964,"msg":"request completed"}
{"level":30,"time":1794981620642,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34983","remoteAddress":"127.0.0.1","remotePort":50372},"msg":"incoming request"}
{"level":30,"time":1794981620656,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":14.036090999999999,"msg":"request completed"}
{"level":30,"time":1794981620659,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/5d5274a3-b7ac-420c-8352-6245acf10682/timeline","host":"127.0.0.1:44385","remoteAddress":"127.0.0.1","remotePort":50604},"msg":"incoming request"}
{"level":30,"time":1794981620662,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.6260749999999575,"msg":"request completed"}
{"level":30,"time":1794981620664,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41125","remoteAddress":"127.0.0.1","remotePort":41352},"msg":"incoming request"}
{"level":30,"time":1794981620667,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.946305000000052,"msg":"request completed"}
{"level":30,"time":1794981620668,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38783","remoteAddress":"127.0.0.1","remotePort":41810},"msg":"incoming request"}
{"level":30,"time":1794981620669,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":409},"responseTime":1.4193410000000313,"msg":"request completed"}
{"level":30,"time":1794981620670,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40211","remoteAddress":"127.0.0.1","remotePort":50886},"msg":"incoming request"}
{"level":30,"time":1794981620672,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.3203809999999976,"msg":"request completed"}
{"level":30,"time":1794981620674,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33059","remoteAddress":"127.0.0.1","remotePort":46016},"msg":"incoming request"}
{"level":30,"time":1794981620676,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":201},"responseTime":2.4187559999999735,"msg":"request completed"}
{"level":30,"time":1794981620677,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34425","remoteAddress":"127.0.0.1","remotePort":42988},"msg":"incoming request"}
{"level":30,"time":1794981620680,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.3885689999999613,"msg":"request completed"}
{"level":30,"time":1794981620680,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35549","remoteAddress":"127.0.0.1","remotePort":37648},"msg":"incoming request"}
{"level":30,"time":1794981620683,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.3412999999999897,"msg":"request completed"}
{"level":30,"time":1794981620684,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:34533","remoteAddress":"127.0.0.1","remotePort":51338},"msg":"incoming request"}
{"level":30,"time":1794981620686,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9441360000000145,"msg":"request completed"}
{"level":30,"time":1794981620688,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36835","remoteAddress":"127.0.0.1","remotePort":51712},"msg":"incoming request"}
{"level":30,"time":1794981620690,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.209643999999969,"msg":"request completed"}
{"level":30,"time":1794981620691,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/196bc47a-b526-40c0-87d5-4576aed233ba","host":"127.0.0.1:35073","remoteAddress":"127.0.0.1","remotePort":35418},"msg":"incoming request"}
{"level":30,"time":1794981620692,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":404},"responseTime":1.3925819999999476,"msg":"request completed"}
{"level":30,"time":1794981620693,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:38947","remoteAddress":"127.0.0.1","remotePort":42390},"msg":"incoming request"}
{"level":30,"time":1794981620695,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.882870999999966,"msg":"request completed"}
{"level":30,"time":1794981620696,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/196bc47a-b526-40c0-87d5-4576aed233ba","host":"127.0.0.1:38331","remoteAddress":"127.0.0.1","remotePort":60462},"msg":"incoming request"}
{"level":30,"time":1794981620697,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":404},"responseTime":1.3541700000000105,"msg":"request completed"}
{"level":30,"time":1794981620698,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/196bc47a-b526-40c0-87d5-4576aed233ba/timeline","host":"127.0.0.1:33001","remoteAddress":"127.0.0.1","remotePort":57816},"msg":"incoming request"}
{"level":30,"time":1794981620699,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":404},"responseTime":0.9979009999999562,"msg":"request completed"}
{"level":30,"time":1794981620700,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44705","remoteAddress":"127.0.0.1","remotePort":45926},"msg":"incoming request"}
{"level":30,"time":1794981620702,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.071423999999979,"msg":"request completed"}
{"level":30,"time":1794981620711,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37479","remoteAddress":"127.0.0.1","remotePort":42322},"msg":"incoming request"}
{"level":30,"time":1794981620720,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":8.70826100000005,"msg":"request completed"}
{"level":30,"time":1794981620721,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35487","remoteAddress":"127.0.0.1","remotePort":51918},"msg":"incoming request"}
{"level":30,"time":1794981620724,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.0349919999999884,"msg":"request completed"}
{"level":30,"time":1794981620725,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42607","remoteAddress":"127.0.0.1","remotePort":36370},"msg":"incoming request"}
{"level":30,"time":1794981620727,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.473257999999987,"msg":"request completed"}
{"level":30,"time":1794981620728,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:39519","remoteAddress":"127.0.0.1","remotePort":36918},"msg":"incoming request"}
{"level":40,"time":1794981620731,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794981620732,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":201},"responseTime":4.2951739999999745,"msg":"request completed"}
{"level":30,"time":1794981620733,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/479c744c-851b-4cc2-9f19-ed5fd6c65822/approve","host":"127.0.0.1:42325","remoteAddress":"127.0.0.1","remotePort":51084},"msg":"incoming request"}
{"level":40,"time":1794981620735,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794981620736,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.4328419999999937,"msg":"request completed"}
{"level":30,"time":1794981620737,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:33065","remoteAddress":"127.0.0.1","remotePort":56150},"msg":"incoming request"}
{"level":30,"time":1794981620738,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7755600000000413,"msg":"request completed"}
{"level":30,"time":1794981620739,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35385","remoteAddress":"127.0.0.1","remotePort":47140},"msg":"incoming request"}
{"level":30,"time":1794981620740,"pid":76876,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":403},"responseTime":0.858540000000005,"msg":"request completed"}
{"level":30,"time":1794981620990,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:44223","remoteAddress":"127.0.0.1","remotePort":42648},"msg":"incoming request"}
{"level":30,"time":1794981620996,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":5.060450000000003,"msg":"request completed"}
{"level":30,"time":1794981620999,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:37097","remoteAddress":"127.0.0.1","remotePort":53170},"msg":"incoming request"}
{"level":30,"time":1794981621001,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":2.506069000000025,"msg":"request completed"}
{"level":30,"time":1794981621002,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35173","remoteAddress":"127.0.0.1","remotePort":38828},"msg":"incoming request"}
{"level":30,"time":1794981621012,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":10.051748999999973,"msg":"request completed"}
{"level":30,"time":1794981621013,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:33775","remoteAddress":"127.0.0.1","remotePort":55978},"msg":"incoming request"}
{"level":30,"time":1794981621023,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.592587999999978,"msg":"request completed"}
{"level":30,"time":1794981621024,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/8da00837-1920-426e-ac25-b38811373bd7/send","host":"127.0.0.1:45621","remoteAddress":"127.0.0.1","remotePort":50122},"msg":"incoming request"}
{"level":30,"time":1794981621026,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":403},"responseTime":1.5662270000000262,"msg":"request completed"}
{"level":30,"time":1794981621027,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/8da00837-1920-426e-ac25-b38811373bd7/send","host":"127.0.0.1:45943","remoteAddress":"127.0.0.1","remotePort":49762},"msg":"incoming request"}
{"level":30,"time":1794981621029,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.458529999999996,"msg":"request completed"}
{"level":30,"time":1794981621030,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/f2e84429-3731-472d-9260-bcc4d3ba3893/timeline","host":"127.0.0.1:43463","remoteAddress":"127.0.0.1","remotePort":35282},"msg":"incoming request"}
{"level":30,"time":1794981621032,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.8326270000000022,"msg":"request completed"}
{"level":30,"time":1794981621033,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/8da00837-1920-426e-ac25-b38811373bd7/delivery-status","host":"127.0.0.1:38183","remoteAddress":"127.0.0.1","remotePort":32988},"msg":"incoming request"}
{"level":30,"time":1794981621035,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.654291999999998,"msg":"request completed"}
{"level":30,"time":1794981621036,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:39923","remoteAddress":"127.0.0.1","remotePort":48570},"msg":"incoming request"}
{"level":30,"time":1794981621038,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":1.9155119999999783,"msg":"request completed"}
{"level":30,"time":1794981621039,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:40945","remoteAddress":"127.0.0.1","remotePort":42130},"msg":"incoming request"}
{"level":30,"time":1794981621041,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":1.9761359999999968,"msg":"request completed"}
{"level":30,"time":1794981621042,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35769","remoteAddress":"127.0.0.1","remotePort":41166},"msg":"incoming request"}
{"level":30,"time":1794981621046,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":3.245757000000026,"msg":"request completed"}
{"level":30,"time":1794981621046,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/3a6e7fa2-dffe-4686-8a0c-c92c23fddc3c/send","host":"127.0.0.1:38755","remoteAddress":"127.0.0.1","remotePort":41952},"msg":"incoming request"}
{"level":30,"time":1794981621048,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":400},"responseTime":1.540427999999963,"msg":"request completed"}
{"level":30,"time":1794981621049,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/933cfc51-64f4-4b9e-824f-5ea4ca371e9c/approve","host":"127.0.0.1:40953","remoteAddress":"127.0.0.1","remotePort":57840},"msg":"incoming request"}
{"level":30,"time":1794981621050,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.428950000000043,"msg":"request completed"}
{"level":30,"time":1794981621051,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/3a6e7fa2-dffe-4686-8a0c-c92c23fddc3c/send","host":"127.0.0.1:38391","remoteAddress":"127.0.0.1","remotePort":45500},"msg":"incoming request"}
{"level":30,"time":1794981621053,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.8994020000000091,"msg":"request completed"}
{"level":30,"time":1794981621056,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:46081","remoteAddress":"127.0.0.1","remotePort":38446},"msg":"incoming request"}
{"level":30,"time":1794981621057,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.3313469999999938,"msg":"request completed"}
{"level":30,"time":1794981621058,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:45267","remoteAddress":"127.0.0.1","remotePort":39240},"msg":"incoming request"}
{"level":30,"time":1794981621062,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":3.7157290000000103,"msg":"request completed"}
{"level":30,"time":1794981621063,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/134848c3-1848-436d-82aa-fa2a860234b3/send","host":"127.0.0.1:33145","remoteAddress":"127.0.0.1","remotePort":51190},"msg":"incoming request"}
{"level":30,"time":1794981621065,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.069942000000026,"msg":"request completed"}
{"level":30,"time":1794981621066,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:32821","remoteAddress":"127.0.0.1","remotePort":55740},"msg":"incoming request"}
{"level":30,"time":1794981621069,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":3.539176999999995,"msg":"request completed"}
{"level":30,"time":1794981621070,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/7bb83c4d-11df-44bc-9f7b-36c628424481/send","host":"127.0.0.1:46641","remoteAddress":"127.0.0.1","remotePort":44268},"msg":"incoming request"}
{"level":30,"time":1794981621071,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":403},"responseTime":0.9744769999999789,"msg":"request completed"}
{"level":30,"time":1794981621072,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:43571","remoteAddress":"127.0.0.1","remotePort":47824},"msg":"incoming request"}
{"level":30,"time":1794981621075,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.8593030000000113,"msg":"request completed"}
{"level":30,"time":1794981621076,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:42953","remoteAddress":"127.0.0.1","remotePort":54544},"msg":"incoming request"}
{"level":30,"time":1794981621077,"pid":76887,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":0.995947000000001,"msg":"request completed"}
{"level":30,"time":1794981621324,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45769","remoteAddress":"127.0.0.1","remotePort":49802},"msg":"incoming request"}
{"level":30,"time":1794981621338,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.63572099999999,"msg":"request completed"}
{"level":30,"time":1794981621341,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42511","remoteAddress":"127.0.0.1","remotePort":40848},"msg":"incoming request"}
{"level":30,"time":1794981621345,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.963403000000028,"msg":"request completed"}
{"level":30,"time":1794981621345,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/44c6e9ab-07b5-4e48-ab21-e80926d43852/sitreps","host":"127.0.0.1:39537","remoteAddress":"127.0.0.1","remotePort":38094},"msg":"incoming request"}
{"level":30,"time":1794981621349,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.371512999999993,"msg":"request completed"}
{"level":30,"time":1794981621350,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41517","remoteAddress":"127.0.0.1","remotePort":60914},"msg":"incoming request"}
{"level":30,"time":1794981621354,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.9333860000000413,"msg":"request completed"}
{"level":30,"time":1794981621356,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/ae43db6b-85ba-4250-b528-6e28f06fe5da/aar","host":"127.0.0.1:41527","remoteAddress":"127.0.0.1","remotePort":46044},"msg":"incoming request"}
{"level":30,"time":1794981621358,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":409},"responseTime":2.0382720000000063,"msg":"request completed"}
{"level":30,"time":1794981621359,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/ae43db6b-85ba-4250-b528-6e28f06fe5da/closure","host":"127.0.0.1:34117","remoteAddress":"127.0.0.1","remotePort":41936},"msg":"incoming request"}
{"level":30,"time":1794981621363,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.6182450000000017,"msg":"request completed"}
{"level":30,"time":1794981621364,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/ae43db6b-85ba-4250-b528-6e28f06fe5da/aar","host":"127.0.0.1:34241","remoteAddress":"127.0.0.1","remotePort":44378},"msg":"incoming request"}
{"level":30,"time":1794981621368,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":3.2848399999999742,"msg":"request completed"}
{"level":30,"time":1794981621369,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44907","remoteAddress":"127.0.0.1","remotePort":37614},"msg":"incoming request"}
{"level":30,"time":1794981621371,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.475662,"msg":"request completed"}
{"level":30,"time":1794981621372,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/bc0ef9e6-b0e0-46b1-976a-f692ea3552c8/closure","host":"127.0.0.1:43379","remoteAddress":"127.0.0.1","remotePort":33620},"msg":"incoming request"}
{"level":30,"time":1794981621375,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.545693999999969,"msg":"request completed"}
{"level":30,"time":1794981621376,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/bc0ef9e6-b0e0-46b1-976a-f692ea3552c8/aar","host":"127.0.0.1:33215","remoteAddress":"127.0.0.1","remotePort":51556},"msg":"incoming request"}
{"level":30,"time":1794981621377,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":422},"responseTime":1.348007999999993,"msg":"request completed"}
{"level":30,"time":1794981621378,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35303","remoteAddress":"127.0.0.1","remotePort":41284},"msg":"incoming request"}
{"level":30,"time":1794981621380,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":2.2997119999999995,"msg":"request completed"}
{"level":30,"time":1794981621381,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/f49fb8ef-6646-48c2-8a58-c066fa43d674/closure","host":"127.0.0.1:39113","remoteAddress":"127.0.0.1","remotePort":50444},"msg":"incoming request"}
{"level":30,"time":1794981621384,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.351278999999977,"msg":"request completed"}
{"level":30,"time":1794981621384,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/f49fb8ef-6646-48c2-8a58-c066fa43d674/aar","host":"127.0.0.1:37717","remoteAddress":"127.0.0.1","remotePort":33908},"msg":"incoming request"}
{"level":30,"time":1794981621387,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.6318959999999834,"msg":"request completed"}
{"level":30,"time":1794981621388,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/f49fb8ef-6646-48c2-8a58-c066fa43d674/aar/0260d0a4-778b-4dd0-81ee-357bcf9036a7/finalize","host":"127.0.0.1:36535","remoteAddress":"127.0.0.1","remotePort":58536},"msg":"incoming request"}
{"level":30,"time":1794981621390,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.4785779999999704,"msg":"request completed"}
{"level":30,"time":1794981621391,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/f49fb8ef-6646-48c2-8a58-c066fa43d674/aar/0260d0a4-778b-4dd0-81ee-357bcf9036a7/finalize","host":"127.0.0.1:41323","remoteAddress":"127.0.0.1","remotePort":37256},"msg":"incoming request"}
{"level":30,"time":1794981621392,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":403},"responseTime":1.4122389999999996,"msg":"request completed"}
{"level":30,"time":1794981621393,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33195","remoteAddress":"127.0.0.1","remotePort":60496},"msg":"incoming request"}
{"level":30,"time":1794981621396,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.408456000000001,"msg":"request completed"}
{"level":30,"time":1794981621396,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/ba342f9b-b6d9-4469-a7d6-8e95d355f2c1/closure","host":"127.0.0.1:41037","remoteAddress":"127.0.0.1","remotePort":33754},"msg":"incoming request"}
{"level":30,"time":1794981621399,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.341099999999983,"msg":"request completed"}
{"level":30,"time":1794981621399,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/ba342f9b-b6d9-4469-a7d6-8e95d355f2c1/aar","host":"127.0.0.1:43885","remoteAddress":"127.0.0.1","remotePort":37496},"msg":"incoming request"}
{"level":30,"time":1794981621402,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.1962890000000357,"msg":"request completed"}
{"level":30,"time":1794981621402,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/ba342f9b-b6d9-4469-a7d6-8e95d355f2c1/aar/04e0d7ba-241e-404b-a323-793bf407cbce/finalize","host":"127.0.0.1:35935","remoteAddress":"127.0.0.1","remotePort":49254},"msg":"incoming request"}
{"level":30,"time":1794981621404,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":200},"responseTime":1.6483409999999594,"msg":"request completed"}
{"level":30,"time":1794981621405,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=86af402b-b82a-4128-9721-548f81ae0e63&page_size=200","host":"127.0.0.1:46475","remoteAddress":"127.0.0.1","remotePort":37040},"msg":"incoming request"}
{"level":30,"time":1794981621407,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":1.9816870000000222,"msg":"request completed"}
{"level":30,"time":1794981621408,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:40749","remoteAddress":"127.0.0.1","remotePort":55294},"msg":"incoming request"}
{"level":30,"time":1794981621409,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":0.9195940000000178,"msg":"request completed"}
{"level":30,"time":1794981621410,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:34369","remoteAddress":"127.0.0.1","remotePort":44944},"msg":"incoming request"}
{"level":30,"time":1794981621412,"pid":76918,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":200},"responseTime":2.425929999999994,"msg":"request completed"}
{"level":30,"time":1794981621658,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40933","remoteAddress":"127.0.0.1","remotePort":50512},"msg":"incoming request"}
{"level":30,"time":1794981621672,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.037789000000004,"msg":"request completed"}
{"level":30,"time":1794981621674,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/activation","host":"127.0.0.1:38557","remoteAddress":"127.0.0.1","remotePort":54852},"msg":"incoming request"}
{"level":30,"time":1794981621676,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":2.3351900000000114,"msg":"request completed"}
{"level":30,"time":1794981621677,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c","host":"127.0.0.1:43749","remoteAddress":"127.0.0.1","remotePort":39472},"msg":"incoming request"}
{"level":30,"time":1794981621680,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.120857000000001,"msg":"request completed"}
{"level":30,"time":1794981621680,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/command-roles","host":"127.0.0.1:44985","remoteAddress":"127.0.0.1","remotePort":37856},"msg":"incoming request"}
{"level":30,"time":1794981621683,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.457197000000008,"msg":"request completed"}
{"level":30,"time":1794981621684,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/activation","host":"127.0.0.1:34863","remoteAddress":"127.0.0.1","remotePort":34214},"msg":"incoming request"}
{"level":30,"time":1794981621687,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.847198999999989,"msg":"request completed"}
{"level":30,"time":1794981621687,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/timeline","host":"127.0.0.1:45639","remoteAddress":"127.0.0.1","remotePort":60720},"msg":"incoming request"}
{"level":30,"time":1794981621689,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9597049999999854,"msg":"request completed"}
{"level":30,"time":1794981621691,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/activation","host":"127.0.0.1:44451","remoteAddress":"127.0.0.1","remotePort":36364},"msg":"incoming request"}
{"level":30,"time":1794981621692,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":400},"responseTime":1.286512000000016,"msg":"request completed"}
{"level":30,"time":1794981621693,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c","host":"127.0.0.1:43789","remoteAddress":"127.0.0.1","remotePort":56426},"msg":"incoming request"}
{"level":30,"time":1794981621695,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9213730000000169,"msg":"request completed"}
{"level":30,"time":1794981621696,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/command-roles","host":"127.0.0.1:33823","remoteAddress":"127.0.0.1","remotePort":54948},"msg":"incoming request"}
{"level":30,"time":1794981621698,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.3694230000000402,"msg":"request completed"}
{"level":30,"time":1794981621699,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/timeline","host":"127.0.0.1:38629","remoteAddress":"127.0.0.1","remotePort":55762},"msg":"incoming request"}
{"level":30,"time":1794981621701,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":1.6366290000000276,"msg":"request completed"}
{"level":30,"time":1794981621702,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/closure","host":"127.0.0.1:42003","remoteAddress":"127.0.0.1","remotePort":48396},"msg":"incoming request"}
{"level":30,"time":1794981621705,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.176016000000004,"msg":"request completed"}
{"level":30,"time":1794981621706,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/b03151cd-e784-4dd6-951a-a085a40ec46c/timeline","host":"127.0.0.1:37581","remoteAddress":"127.0.0.1","remotePort":59194},"msg":"incoming request"}
{"level":30,"time":1794981621707,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.515422000000001,"msg":"request completed"}
{"level":30,"time":1794981621709,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42901","remoteAddress":"127.0.0.1","remotePort":48258},"msg":"incoming request"}
{"level":30,"time":1794981621711,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.6081909999999766,"msg":"request completed"}
{"level":30,"time":1794981621712,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/769ac707-f5d9-48d8-b861-25ae411ab684/command-roles","host":"127.0.0.1:46555","remoteAddress":"127.0.0.1","remotePort":38478},"msg":"incoming request"}
{"level":30,"time":1794981621714,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":1.737197999999978,"msg":"request completed"}
{"level":30,"time":1794981621714,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/769ac707-f5d9-48d8-b861-25ae411ab684/command-roles","host":"127.0.0.1:39865","remoteAddress":"127.0.0.1","remotePort":35758},"msg":"incoming request"}
{"level":30,"time":1794981621716,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.5074769999999944,"msg":"request completed"}
{"level":30,"time":1794981621717,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/769ac707-f5d9-48d8-b861-25ae411ab684/timeline","host":"127.0.0.1:37589","remoteAddress":"127.0.0.1","remotePort":42082},"msg":"incoming request"}
{"level":30,"time":1794981621718,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":200},"responseTime":1.6232840000000124,"msg":"request completed"}
{"level":30,"time":1794981621720,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41427","remoteAddress":"127.0.0.1","remotePort":48124},"msg":"incoming request"}
{"level":30,"time":1794981621723,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.3682060000000433,"msg":"request completed"}
{"level":30,"time":1794981621724,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/f65c779f-057c-4873-bf80-040bf4a82cf0/activation","host":"127.0.0.1:44843","remoteAddress":"127.0.0.1","remotePort":59554},"msg":"incoming request"}
{"level":30,"time":1794981621726,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":404},"responseTime":1.6603240000000028,"msg":"request completed"}
{"level":30,"time":1794981621727,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/f65c779f-057c-4873-bf80-040bf4a82cf0/command-roles","host":"127.0.0.1:35593","remoteAddress":"127.0.0.1","remotePort":43884},"msg":"incoming request"}
{"level":30,"time":1794981621728,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":404},"responseTime":1.1471010000000206,"msg":"request completed"}
{"level":30,"time":1794981621728,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/f65c779f-057c-4873-bf80-040bf4a82cf0/closure","host":"127.0.0.1:32967","remoteAddress":"127.0.0.1","remotePort":52700},"msg":"incoming request"}
{"level":30,"time":1794981621730,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":404},"responseTime":1.1108029999999758,"msg":"request completed"}
{"level":30,"time":1794981621730,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/f65c779f-057c-4873-bf80-040bf4a82cf0/activation","host":"127.0.0.1:42677","remoteAddress":"127.0.0.1","remotePort":48328},"msg":"incoming request"}
{"level":30,"time":1794981621732,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6307170000000042,"msg":"request completed"}
{"level":30,"time":1794981621733,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34467","remoteAddress":"127.0.0.1","remotePort":47212},"msg":"incoming request"}
{"level":30,"time":1794981621735,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":201},"responseTime":2.2161259999999743,"msg":"request completed"}
{"level":30,"time":1794981621736,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/3cd161fc-dcc2-4249-9d26-1ff1c15ebdf6/closure","host":"127.0.0.1:44029","remoteAddress":"127.0.0.1","remotePort":35176},"msg":"incoming request"}
{"level":30,"time":1794981621738,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","res":{"statusCode":200},"responseTime":2.2136310000000208,"msg":"request completed"}
{"level":30,"time":1794981621739,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/3cd161fc-dcc2-4249-9d26-1ff1c15ebdf6/closure","host":"127.0.0.1:35719","remoteAddress":"127.0.0.1","remotePort":54248},"msg":"incoming request"}
{"level":30,"time":1794981621740,"pid":76965,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","res":{"statusCode":409},"responseTime":1.7298739999999952,"msg":"request completed"}
{"level":30,"time":1794981621984,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:35791","remoteAddress":"127.0.0.1","remotePort":35220},"msg":"incoming request"}
{"level":30,"time":1794981621996,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":11.78470900000002,"msg":"request completed"}
{"level":30,"time":1794981621999,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67/submit-review","host":"127.0.0.1:36879","remoteAddress":"127.0.0.1","remotePort":38410},"msg":"incoming request"}
{"level":30,"time":1794981622003,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":4.371377999999993,"msg":"request completed"}
{"level":30,"time":1794981622005,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67/review","host":"127.0.0.1:45003","remoteAddress":"127.0.0.1","remotePort":48020},"msg":"incoming request"}
{"level":30,"time":1794981622007,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":403},"responseTime":1.9804239999999709,"msg":"request completed"}
{"level":30,"time":1794981622008,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67","host":"127.0.0.1:34829","remoteAddress":"127.0.0.1","remotePort":39166},"msg":"incoming request"}
{"level":30,"time":1794981622010,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.927425000000028,"msg":"request completed"}
{"level":30,"time":1794981622011,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67/review","host":"127.0.0.1:42571","remoteAddress":"127.0.0.1","remotePort":36696},"msg":"incoming request"}
{"level":30,"time":1794981622014,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.255966000000001,"msg":"request completed"}
{"level":30,"time":1794981622015,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67","host":"127.0.0.1:44761","remoteAddress":"127.0.0.1","remotePort":54232},"msg":"incoming request"}
{"level":30,"time":1794981622017,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8070889999999622,"msg":"request completed"}
{"level":30,"time":1794981622017,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67/sections/86139eac-93c1-4f97-af15-f329a3b4f44e/link-tasks","host":"127.0.0.1:35415","remoteAddress":"127.0.0.1","remotePort":53298},"msg":"incoming request"}
{"level":30,"time":1794981622019,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":204},"responseTime":1.8446700000000078,"msg":"request completed"}
{"level":30,"time":1794981622020,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67","host":"127.0.0.1:37853","remoteAddress":"127.0.0.1","remotePort":47622},"msg":"incoming request"}
{"level":30,"time":1794981622022,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8294010000000185,"msg":"request completed"}
{"level":30,"time":1794981622023,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41521","remoteAddress":"127.0.0.1","remotePort":51710},"msg":"incoming request"}
{"level":30,"time":1794981622032,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":9.559406000000024,"msg":"request completed"}
{"level":30,"time":1794981622034,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/263fc72b-7381-43af-b36c-ca70ea78ec67/materialize-tasks","host":"127.0.0.1:37501","remoteAddress":"127.0.0.1","remotePort":34724},"msg":"incoming request"}
{"level":30,"time":1794981622037,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":3.3817419999999743,"msg":"request completed"}
{"level":30,"time":1794981622039,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=188fde0e-b39d-4e80-86d6-a5c819d0261b","host":"127.0.0.1:46281","remoteAddress":"127.0.0.1","remotePort":60784},"msg":"incoming request"}
{"level":30,"time":1794981622041,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.086573000000044,"msg":"request completed"}
{"level":30,"time":1794981622042,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42213","remoteAddress":"127.0.0.1","remotePort":50190},"msg":"incoming request"}
{"level":30,"time":1794981622045,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":201},"responseTime":2.743864999999971,"msg":"request completed"}
{"level":30,"time":1794981622046,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/22dc4fee-4613-40f1-8730-8471bb6342d3/review","host":"127.0.0.1:45793","remoteAddress":"127.0.0.1","remotePort":60442},"msg":"incoming request"}
{"level":30,"time":1794981622047,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":409},"responseTime":1.7834239999999681,"msg":"request completed"}
{"level":30,"time":1794981622048,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:46017","remoteAddress":"127.0.0.1","remotePort":33236},"msg":"incoming request"}
{"level":30,"time":1794981622051,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.1658120000000167,"msg":"request completed"}
{"level":30,"time":1794981622051,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/ade978ff-310a-4eb4-9709-dfdaa005e0ba/submit-review","host":"127.0.0.1:45205","remoteAddress":"127.0.0.1","remotePort":39370},"msg":"incoming request"}
{"level":30,"time":1794981622053,"pid":76975,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.4264350000000263,"msg":"request completed"}
{"level":30,"time":1794981622293,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37077","remoteAddress":"127.0.0.1","remotePort":57758},"msg":"incoming request"}
{"level":30,"time":1794981622298,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.376165999999984,"msg":"request completed"}
{"level":30,"time":1794981622301,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39323","remoteAddress":"127.0.0.1","remotePort":36912},"msg":"incoming request"}
{"level":30,"time":1794981622303,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":1.9574200000000133,"msg":"request completed"}
{"level":30,"time":1794981622304,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:38585","remoteAddress":"127.0.0.1","remotePort":59160},"msg":"incoming request"}
{"level":30,"time":1794981622308,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":4.371328000000005,"msg":"request completed"}
{"level":30,"time":1794981622310,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45365","remoteAddress":"127.0.0.1","remotePort":58108},"msg":"incoming request"}
{"level":30,"time":1794981622319,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.17033699999999,"msg":"request completed"}
{"level":30,"time":1794981622320,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41663","remoteAddress":"127.0.0.1","remotePort":44920},"msg":"incoming request"}
{"level":30,"time":1794981622323,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.867847999999981,"msg":"request completed"}
{"level":30,"time":1794981622324,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/34586e0c-7fbf-4b46-a305-bd796380288a/timeline","host":"127.0.0.1:45923","remoteAddress":"127.0.0.1","remotePort":57326},"msg":"incoming request"}
{"level":30,"time":1794981622326,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4079550000000154,"msg":"request completed"}
{"level":30,"time":1794981622327,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44835","remoteAddress":"127.0.0.1","remotePort":54766},"msg":"incoming request"}
{"level":30,"time":1794981622329,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.1374889999999596,"msg":"request completed"}
{"level":30,"time":1794981622330,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/b7d3c08a-45e0-465c-a2a5-73c170dedfde/status","host":"127.0.0.1:37571","remoteAddress":"127.0.0.1","remotePort":46704},"msg":"incoming request"}
{"level":30,"time":1794981622332,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":409},"responseTime":1.789416000000017,"msg":"request completed"}
{"level":30,"time":1794981622333,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:35993","remoteAddress":"127.0.0.1","remotePort":46286},"msg":"incoming request"}
{"level":30,"time":1794981622336,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.389230999999995,"msg":"request completed"}
{"level":30,"time":1794981622337,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/735d6461-78ca-4c87-956a-ac7344ceb94a/status","host":"127.0.0.1:40097","remoteAddress":"127.0.0.1","remotePort":58358},"msg":"incoming request"}
{"level":30,"time":1794981622339,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":409},"responseTime":1.6702920000000177,"msg":"request completed"}
{"level":30,"time":1794981622339,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/735d6461-78ca-4c87-956a-ac7344ceb94a/status","host":"127.0.0.1:39191","remoteAddress":"127.0.0.1","remotePort":60178},"msg":"incoming request"}
{"level":30,"time":1794981622342,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.407685000000015,"msg":"request completed"}
{"level":30,"time":1794981622343,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/735d6461-78ca-4c87-956a-ac7344ceb94a/status","host":"127.0.0.1:33155","remoteAddress":"127.0.0.1","remotePort":49126},"msg":"incoming request"}
{"level":30,"time":1794981622344,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":409},"responseTime":1.439519999999959,"msg":"request completed"}
{"level":30,"time":1794981622345,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/735d6461-78ca-4c87-956a-ac7344ceb94a/status","host":"127.0.0.1:40729","remoteAddress":"127.0.0.1","remotePort":51526},"msg":"incoming request"}
{"level":30,"time":1794981622347,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2432769999999778,"msg":"request completed"}
{"level":30,"time":1794981622348,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/735d6461-78ca-4c87-956a-ac7344ceb94a/status","host":"127.0.0.1:36247","remoteAddress":"127.0.0.1","remotePort":41448},"msg":"incoming request"}
{"level":30,"time":1794981622350,"pid":76988,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.03203000000002,"msg":"request completed"}
{"level":30,"time":1794981622590,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:32829","remoteAddress":"127.0.0.1","remotePort":57736},"msg":"incoming request"}
{"level":30,"time":1794981622619,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":28.470350000000025,"msg":"request completed"}
{"level":30,"time":1794981622621,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45867","remoteAddress":"127.0.0.1","remotePort":47012},"msg":"incoming request"}
{"level":30,"time":1794981622624,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.627476999999999,"msg":"request completed"}
{"level":30,"time":1794981622625,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:39287","remoteAddress":"127.0.0.1","remotePort":33992},"msg":"incoming request"}
{"level":30,"time":1794981622627,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":400},"responseTime":1.4652679999999805,"msg":"request completed"}
{"level":30,"time":1794981622628,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:38873","remoteAddress":"127.0.0.1","remotePort":44704},"msg":"incoming request"}
{"level":30,"time":1794981622631,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.912781999999993,"msg":"request completed"}
{"level":30,"time":1794981622633,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/fb34e978-796b-4c0c-b077-96a9b6455d29/revoke","host":"127.0.0.1:43413","remoteAddress":"127.0.0.1","remotePort":58666},"msg":"incoming request"}
{"level":30,"time":1794981622635,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":204},"responseTime":2.552035999999987,"msg":"request completed"}
{"level":30,"time":1794981622637,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:37341","remoteAddress":"127.0.0.1","remotePort":49582},"msg":"incoming request"}
{"level":30,"time":1794981622639,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.912115999999969,"msg":"request completed"}
{"level":30,"time":1794981622640,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:44225","remoteAddress":"127.0.0.1","remotePort":59530},"msg":"incoming request"}
{"level":30,"time":1794981622641,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3312660000000278,"msg":"request completed"}
{"level":30,"time":1794981622642,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:34849","remoteAddress":"127.0.0.1","remotePort":35106},"msg":"incoming request"}
{"level":30,"time":1794981622644,"pid":76999,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.592175999999995,"msg":"request completed"}
{"level":30,"time":1794981622886,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:37767","remoteAddress":"127.0.0.1","remotePort":38652},"msg":"incoming request"}
{"level":30,"time":1794981622892,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":5.670444000000003,"msg":"request completed"}
{"level":30,"time":1794981622894,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:33715","remoteAddress":"127.0.0.1","remotePort":51362},"msg":"incoming request"}
{"level":30,"time":1794981622899,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":4.553327999999993,"msg":"request completed"}
{"level":30,"time":1794981622901,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33205","remoteAddress":"127.0.0.1","remotePort":58786},"msg":"incoming request"}
{"level":30,"time":1794981622903,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.2687139999999886,"msg":"request completed"}
{"level":30,"time":1794981622904,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/a278460f-83f3-4812-b5b4-d50666f0b0c4","host":"127.0.0.1:46341","remoteAddress":"127.0.0.1","remotePort":52264},"msg":"incoming request"}
{"level":30,"time":1794981622907,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.78051499999998,"msg":"request completed"}
{"level":30,"time":1794981622907,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46499","remoteAddress":"127.0.0.1","remotePort":53102},"msg":"incoming request"}
{"level":30,"time":1794981622908,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":401},"responseTime":0.46633400000001757,"msg":"request completed"}
{"level":30,"time":1794981622909,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:41307","remoteAddress":"127.0.0.1","remotePort":38934},"msg":"incoming request"}
{"level":30,"time":1794981622910,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":403},"responseTime":1.076609000000019,"msg":"request completed"}
{"level":30,"time":1794981622911,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/35463cbd-22bb-4519-9c32-cccf5e25bbb8","host":"127.0.0.1:36741","remoteAddress":"127.0.0.1","remotePort":55858},"msg":"incoming request"}
{"level":30,"time":1794981622916,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":4.1262479999999755,"msg":"request completed"}
{"level":30,"time":1794981622916,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42193","remoteAddress":"127.0.0.1","remotePort":51748},"msg":"incoming request"}
{"level":30,"time":1794981622919,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.7817569999999705,"msg":"request completed"}
{"level":30,"time":1794981622920,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=4daac35c-b8b3-4b72-bb37-7fe9ac2aaa57&page_size=50","host":"127.0.0.1:40795","remoteAddress":"127.0.0.1","remotePort":41292},"msg":"incoming request"}
{"level":30,"time":1794981622922,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.702652999999998,"msg":"request completed"}
{"level":30,"time":1794981622924,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:33133","remoteAddress":"127.0.0.1","remotePort":51588},"msg":"incoming request"}
{"level":30,"time":1794981622925,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":403},"responseTime":1.2675070000000233,"msg":"request completed"}
{"level":30,"time":1794981622926,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:36775","remoteAddress":"127.0.0.1","remotePort":45890},"msg":"incoming request"}
{"level":30,"time":1794981622928,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.642870999999957,"msg":"request completed"}
{"level":30,"time":1794981622929,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:34225","remoteAddress":"127.0.0.1","remotePort":44158},"msg":"incoming request"}
{"level":30,"time":1794981622931,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":422},"responseTime":1.8887409999999818,"msg":"request completed"}
{"level":30,"time":1794981622932,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36693","remoteAddress":"127.0.0.1","remotePort":39696},"msg":"incoming request"}
{"level":30,"time":1794981622933,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5428640000000087,"msg":"request completed"}
{"level":30,"time":1794981622934,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=4daac35c-b8b3-4b72-bb37-7fe9ac2aaa57&action_type=record_view","host":"127.0.0.1:44047","remoteAddress":"127.0.0.1","remotePort":60644},"msg":"incoming request"}
{"level":30,"time":1794981622935,"pid":77009,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.4127389999999878,"msg":"request completed"}
{"level":30,"time":1794981623175,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37663","remoteAddress":"127.0.0.1","remotePort":57304},"msg":"incoming request"}
{"level":30,"time":1794981623190,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":14.437444,"msg":"request completed"}
{"level":30,"time":1794981623193,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42531","remoteAddress":"127.0.0.1","remotePort":49144},"msg":"incoming request"}
{"level":30,"time":1794981623197,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.9859449999999867,"msg":"request completed"}
{"level":30,"time":1794981623198,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:42499","remoteAddress":"127.0.0.1","remotePort":45692},"msg":"incoming request"}
{"level":30,"time":1794981623201,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.3416770000000042,"msg":"request completed"}
{"level":30,"time":1794981623203,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38213","remoteAddress":"127.0.0.1","remotePort":50392},"msg":"incoming request"}
{"level":30,"time":1794981623206,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.5744580000000497,"msg":"request completed"}
{"level":30,"time":1794981623207,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:37583","remoteAddress":"127.0.0.1","remotePort":54652},"msg":"incoming request"}
{"level":30,"time":1794981623209,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.810516000000007,"msg":"request completed"}
{"level":30,"time":1794981623210,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:41951","remoteAddress":"127.0.0.1","remotePort":52512},"msg":"incoming request"}
{"level":30,"time":1794981623212,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7164489999999546,"msg":"request completed"}
{"level":30,"time":1794981623213,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:41763","remoteAddress":"127.0.0.1","remotePort":49604},"msg":"incoming request"}
{"level":30,"time":1794981623214,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5527619999999729,"msg":"request completed"}
{"level":30,"time":1794981623215,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:42785","remoteAddress":"127.0.0.1","remotePort":50390},"msg":"incoming request"}
{"level":30,"time":1794981623217,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.944295000000011,"msg":"request completed"}
{"level":30,"time":1794981623218,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:37183","remoteAddress":"127.0.0.1","remotePort":39048},"msg":"incoming request"}
{"level":30,"time":1794981623220,"pid":77039,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.4839729999999918,"msg":"request completed"}
{"level":30,"time":1794981623470,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35613","remoteAddress":"127.0.0.1","remotePort":54568},"msg":"incoming request"}
{"level":30,"time":1794981623484,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.093984999999975,"msg":"request completed"}
{"level":30,"time":1794981623490,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/07f14756-d742-4a88-a9ef-14e631ce8776/timeline","host":"127.0.0.1:40369","remoteAddress":"127.0.0.1","remotePort":60108},"msg":"incoming request"}
{"level":30,"time":1794981623493,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7705349999999953,"msg":"request completed"}
{"level":30,"time":1794981623497,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36733","remoteAddress":"127.0.0.1","remotePort":53224},"msg":"incoming request"}
{"level":30,"time":1794981623500,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.7776489999999967,"msg":"request completed"}
{"level":30,"time":1794981623501,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/143c5922-1ff3-402b-8334-08464239ce92/closure","host":"127.0.0.1:45189","remoteAddress":"127.0.0.1","remotePort":34966},"msg":"incoming request"}
{"level":30,"time":1794981623504,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":3.1801939999999718,"msg":"request completed"}
{"level":30,"time":1794981623506,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/143c5922-1ff3-402b-8334-08464239ce92/timeline","host":"127.0.0.1:40099","remoteAddress":"127.0.0.1","remotePort":46632},"msg":"incoming request"}
{"level":30,"time":1794981623507,"pid":77068,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5712970000000155,"msg":"request completed"}
{"level":30,"time":1794981623757,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34371","remoteAddress":"127.0.0.1","remotePort":44142},"msg":"incoming request"}
{"level":30,"time":1794981623762,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":5.025334000000015,"msg":"request completed"}
{"level":30,"time":1794981623765,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33017","remoteAddress":"127.0.0.1","remotePort":56900},"msg":"incoming request"}
{"level":30,"time":1794981623765,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.1933819999999855,"msg":"request completed"}
{"level":30,"time":1794981623767,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:38549","remoteAddress":"127.0.0.1","remotePort":52920},"msg":"incoming request"}
{"level":30,"time":1794981623771,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.2898989999999912,"msg":"request completed"}
{"level":30,"time":1794981623772,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38089","remoteAddress":"127.0.0.1","remotePort":45254},"msg":"incoming request"}
{"level":30,"time":1794981623774,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.2046040000000175,"msg":"request completed"}
{"level":30,"time":1794981623775,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37745","remoteAddress":"127.0.0.1","remotePort":47882},"msg":"incoming request"}
{"level":30,"time":1794981623777,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.0678080000000136,"msg":"request completed"}
{"level":30,"time":1794981623778,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37551","remoteAddress":"127.0.0.1","remotePort":48582},"msg":"incoming request"}
{"level":30,"time":1794981623779,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4658429999999498,"msg":"request completed"}
{"level":30,"time":1794981623780,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:44079","remoteAddress":"127.0.0.1","remotePort":34834},"msg":"incoming request"}
{"level":30,"time":1794981623782,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5910429999999565,"msg":"request completed"}
{"level":30,"time":1794981623783,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:32969","remoteAddress":"127.0.0.1","remotePort":51582},"msg":"incoming request"}
{"level":30,"time":1794981623785,"pid":77096,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0804959999999824,"msg":"request completed"}

 Test Files  13 passed (13)
      Tests  67 passed (67)
   Start at  06:00:19
   Duration  4.60s (transform 152ms, setup 35ms, import 1.78s, tests 2.10s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 70[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 101[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 72[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 136[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 165[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 102[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 06:00:23
[2m   Duration [22m 1.96s[2m (transform 272ms, setup 148ms, collect 674ms, tests 644ms, environment 1.12s, prepare 203ms)[22m
```

## Wave 4

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3 — 04-05/04-06 ran in parallel touching shared AppShell/routes.ts files, both append-only, zero conflicts observed per executor reports

### Gate output

```
> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json


> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 77 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m106.44 kB[22m[1m[22m[2m │ gzip: 23.93 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m37.80 kB[22m[1m[22m[2m │ gzip:  5.53 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m67.19 kB[22m[1m[22m[2m │ gzip: 20.10 kB[22m
[32m✓ built in 219ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 138 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-DkLgSvGc.css  [39m[1m[2m 48.37 kB[22m[1m[22m[2m │ gzip:   7.98 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-BOCL4wGE.js   [39m[1m[2m478.28 kB[22m[1m[22m[2m │ gzip: 137.34 kB[22m
[32m✓ built in 980ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794983933156,"pid":181776,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:34125","remoteAddress":"127.0.0.1","remotePort":50560},"msg":"incoming request"}
{"level":30,"time":1794983933206,"pid":181776,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":49.396141,"msg":"request completed"}
{"level":30,"time":1794983933413,"pid":181776,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:36567","remoteAddress":"127.0.0.1","remotePort":33208},"msg":"incoming request"}
{"level":30,"time":1794983933416,"pid":181776,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.460066999999981,"msg":"request completed"}
{"level":30,"time":1794983933668,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:37033","remoteAddress":"127.0.0.1","remotePort":39184},"msg":"incoming request"}
{"level":30,"time":1794983933716,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":47.57095899999999,"msg":"request completed"}
{"level":30,"time":1794983933719,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44915","remoteAddress":"127.0.0.1","remotePort":57452},"msg":"incoming request"}
{"level":30,"time":1794983933730,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":10.473967000000016,"msg":"request completed"}
{"level":30,"time":1794983933731,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:44595","remoteAddress":"127.0.0.1","remotePort":57960},"msg":"incoming request"}
{"level":30,"time":1794983933735,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.9273559999999748,"msg":"request completed"}
{"level":30,"time":1794983933736,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/f7de5ec9-bf41-40ff-9ae5-76a79a4e6253/decline","host":"127.0.0.1:37517","remoteAddress":"127.0.0.1","remotePort":39644},"msg":"incoming request"}
{"level":30,"time":1794983933738,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":422},"responseTime":1.3240399999999681,"msg":"request completed"}
{"level":30,"time":1794983933739,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=2b2a8d31-9516-4135-b2e4-cd11c1244bb3","host":"127.0.0.1:46319","remoteAddress":"127.0.0.1","remotePort":35292},"msg":"incoming request"}
{"level":30,"time":1794983933741,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.8729720000000043,"msg":"request completed"}
{"level":30,"time":1794983933742,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/f7de5ec9-bf41-40ff-9ae5-76a79a4e6253/decline","host":"127.0.0.1:42037","remoteAddress":"127.0.0.1","remotePort":47174},"msg":"incoming request"}
{"level":30,"time":1794983933745,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.971677999999997,"msg":"request completed"}
{"level":30,"time":1794983933746,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/2b2a8d31-9516-4135-b2e4-cd11c1244bb3/timeline","host":"127.0.0.1:45039","remoteAddress":"127.0.0.1","remotePort":51546},"msg":"incoming request"}
{"level":30,"time":1794983933749,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.8965069999999855,"msg":"request completed"}
{"level":30,"time":1794983933750,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35531","remoteAddress":"127.0.0.1","remotePort":33028},"msg":"incoming request"}
{"level":30,"time":1794983933754,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":3.870388000000048,"msg":"request completed"}
{"level":30,"time":1794983933755,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35763","remoteAddress":"127.0.0.1","remotePort":53298},"msg":"incoming request"}
{"level":30,"time":1794983933759,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":3.9725609999999847,"msg":"request completed"}
{"level":30,"time":1794983933761,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/f72039de-660c-4929-b3cc-b9310d22992a/approve","host":"127.0.0.1:34061","remoteAddress":"127.0.0.1","remotePort":44886},"msg":"incoming request"}
{"level":30,"time":1794983933765,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":3.6254780000000437,"msg":"request completed"}
{"level":30,"time":1794983933766,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/f72039de-660c-4929-b3cc-b9310d22992a/fulfill","host":"127.0.0.1:33389","remoteAddress":"127.0.0.1","remotePort":33042},"msg":"incoming request"}
{"level":30,"time":1794983933770,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":4.244441999999992,"msg":"request completed"}
{"level":30,"time":1794983933772,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/f72039de-660c-4929-b3cc-b9310d22992a/fulfill","host":"127.0.0.1:35283","remoteAddress":"127.0.0.1","remotePort":36274},"msg":"incoming request"}
{"level":30,"time":1794983933776,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":3.8627539999999954,"msg":"request completed"}
{"level":30,"time":1794983933778,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/eba2c30c-d59d-4c5e-9917-1285d3e4457b/timeline","host":"127.0.0.1:38601","remoteAddress":"127.0.0.1","remotePort":43048},"msg":"incoming request"}
{"level":30,"time":1794983933786,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":8.204519000000005,"msg":"request completed"}
{"level":30,"time":1794983933989,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42139","remoteAddress":"127.0.0.1","remotePort":59120},"msg":"incoming request"}
{"level":30,"time":1794983933993,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":4.205058000000008,"msg":"request completed"}
{"level":30,"time":1794983933994,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:41841","remoteAddress":"127.0.0.1","remotePort":43014},"msg":"incoming request"}
{"level":30,"time":1794983933995,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.0959609999999884,"msg":"request completed"}
{"level":30,"time":1794983933996,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37313","remoteAddress":"127.0.0.1","remotePort":58980},"msg":"incoming request"}
{"level":30,"time":1794983933999,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.3643260000000055,"msg":"request completed"}
{"level":30,"time":1794983934000,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38475","remoteAddress":"127.0.0.1","remotePort":37740},"msg":"incoming request"}
{"level":30,"time":1794983934002,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":1.9391870000000608,"msg":"request completed"}
{"level":30,"time":1794983934003,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/e4239a83-98b7-429d-b870-f9bd72dae920/fulfill","host":"127.0.0.1:39769","remoteAddress":"127.0.0.1","remotePort":57532},"msg":"incoming request"}
{"level":30,"time":1794983934004,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":409},"responseTime":1.5221420000000307,"msg":"request completed"}
{"level":30,"time":1794983934005,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/e4239a83-98b7-429d-b870-f9bd72dae920/approve","host":"127.0.0.1:35235","remoteAddress":"127.0.0.1","remotePort":36916},"msg":"incoming request"}
{"level":30,"time":1794983934006,"pid":181787,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":409},"responseTime":1.1778150000000096,"msg":"request completed"}
{"level":30,"time":1794983934307,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33219","remoteAddress":"127.0.0.1","remotePort":46330},"msg":"incoming request"}
{"level":30,"time":1794983934321,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.966083999999967,"msg":"request completed"}
{"level":30,"time":1794983934323,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/44365ab3-4730-41cb-b347-7a1525a1fe97/timeline","host":"127.0.0.1:34139","remoteAddress":"127.0.0.1","remotePort":42978},"msg":"incoming request"}
{"level":30,"time":1794983934327,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.5145689999999945,"msg":"request completed"}
{"level":30,"time":1794983934329,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45153","remoteAddress":"127.0.0.1","remotePort":53952},"msg":"incoming request"}
{"level":30,"time":1794983934333,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.791569999999979,"msg":"request completed"}
{"level":30,"time":1794983934334,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34083","remoteAddress":"127.0.0.1","remotePort":43376},"msg":"incoming request"}
{"level":30,"time":1794983934335,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":409},"responseTime":1.552359000000024,"msg":"request completed"}
{"level":30,"time":1794983934336,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44471","remoteAddress":"127.0.0.1","remotePort":40424},"msg":"incoming request"}
{"level":30,"time":1794983934339,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":3.2666229999999814,"msg":"request completed"}
{"level":30,"time":1794983934341,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34115","remoteAddress":"127.0.0.1","remotePort":60770},"msg":"incoming request"}
{"level":30,"time":1794983934344,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":201},"responseTime":3.071776,"msg":"request completed"}
{"level":30,"time":1794983934345,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40803","remoteAddress":"127.0.0.1","remotePort":43826},"msg":"incoming request"}
{"level":30,"time":1794983934348,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":3.0359699999999634,"msg":"request completed"}
{"level":30,"time":1794983934349,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41005","remoteAddress":"127.0.0.1","remotePort":40322},"msg":"incoming request"}
{"level":30,"time":1794983934352,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":3.043713000000025,"msg":"request completed"}
{"level":30,"time":1794983934353,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:37613","remoteAddress":"127.0.0.1","remotePort":57536},"msg":"incoming request"}
{"level":30,"time":1794983934355,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.1747799999999984,"msg":"request completed"}
{"level":30,"time":1794983934357,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40783","remoteAddress":"127.0.0.1","remotePort":50374},"msg":"incoming request"}
{"level":30,"time":1794983934360,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.9001839999999675,"msg":"request completed"}
{"level":30,"time":1794983934361,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/34472e9f-33aa-4ce4-a8cd-daa92fc7ad48","host":"127.0.0.1:38759","remoteAddress":"127.0.0.1","remotePort":47470},"msg":"incoming request"}
{"level":30,"time":1794983934363,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":404},"responseTime":1.558019999999999,"msg":"request completed"}
{"level":30,"time":1794983934364,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:33283","remoteAddress":"127.0.0.1","remotePort":52050},"msg":"incoming request"}
{"level":30,"time":1794983934366,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.340951999999959,"msg":"request completed"}
{"level":30,"time":1794983934367,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/34472e9f-33aa-4ce4-a8cd-daa92fc7ad48","host":"127.0.0.1:43367","remoteAddress":"127.0.0.1","remotePort":52068},"msg":"incoming request"}
{"level":30,"time":1794983934368,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":404},"responseTime":1.5272219999999948,"msg":"request completed"}
{"level":30,"time":1794983934369,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/34472e9f-33aa-4ce4-a8cd-daa92fc7ad48/timeline","host":"127.0.0.1:38113","remoteAddress":"127.0.0.1","remotePort":47166},"msg":"incoming request"}
{"level":30,"time":1794983934370,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":404},"responseTime":1.2044750000000022,"msg":"request completed"}
{"level":30,"time":1794983934371,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44427","remoteAddress":"127.0.0.1","remotePort":48448},"msg":"incoming request"}
{"level":30,"time":1794983934374,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.8294109999999932,"msg":"request completed"}
{"level":30,"time":1794983934384,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41139","remoteAddress":"127.0.0.1","remotePort":34694},"msg":"incoming request"}
{"level":30,"time":1794983934393,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":9.065386999999987,"msg":"request completed"}
{"level":30,"time":1794983934394,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36509","remoteAddress":"127.0.0.1","remotePort":60508},"msg":"incoming request"}
{"level":30,"time":1794983934397,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.4621009999999615,"msg":"request completed"}
{"level":30,"time":1794983934398,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38965","remoteAddress":"127.0.0.1","remotePort":38222},"msg":"incoming request"}
{"level":30,"time":1794983934401,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.800756999999976,"msg":"request completed"}
{"level":30,"time":1794983934402,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:33899","remoteAddress":"127.0.0.1","remotePort":49542},"msg":"incoming request"}
{"level":40,"time":1794983934405,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794983934407,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":201},"responseTime":4.689839000000006,"msg":"request completed"}
{"level":30,"time":1794983934407,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/aba6c74c-1819-4c2b-bb84-2f4a51b01569/approve","host":"127.0.0.1:39539","remoteAddress":"127.0.0.1","remotePort":36784},"msg":"incoming request"}
{"level":40,"time":1794983934409,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794983934410,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.5218830000000025,"msg":"request completed"}
{"level":30,"time":1794983934411,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:40531","remoteAddress":"127.0.0.1","remotePort":45428},"msg":"incoming request"}
{"level":30,"time":1794983934413,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.8519229999999993,"msg":"request completed"}
{"level":30,"time":1794983934414,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37585","remoteAddress":"127.0.0.1","remotePort":33458},"msg":"incoming request"}
{"level":30,"time":1794983934414,"pid":181834,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8961959999999749,"msg":"request completed"}
{"level":30,"time":1794983934660,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45101","remoteAddress":"127.0.0.1","remotePort":44300},"msg":"incoming request"}
{"level":30,"time":1794983934674,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.084114999999997,"msg":"request completed"}
{"level":30,"time":1794983934676,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45859","remoteAddress":"127.0.0.1","remotePort":59498},"msg":"incoming request"}
{"level":30,"time":1794983934680,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.576294999999959,"msg":"request completed"}
{"level":30,"time":1794983934681,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/fba57577-fd7c-46e9-b5cc-bd2f4d8df0ef/sitreps","host":"127.0.0.1:34303","remoteAddress":"127.0.0.1","remotePort":47266},"msg":"incoming request"}
{"level":30,"time":1794983934684,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1085260000000403,"msg":"request completed"}
{"level":30,"time":1794983934685,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41851","remoteAddress":"127.0.0.1","remotePort":40356},"msg":"incoming request"}
{"level":30,"time":1794983934688,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.587144999999964,"msg":"request completed"}
{"level":30,"time":1794983934689,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/470ce63f-b7ca-421d-946f-54b909440395/aar","host":"127.0.0.1:39823","remoteAddress":"127.0.0.1","remotePort":41980},"msg":"incoming request"}
{"level":30,"time":1794983934690,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":409},"responseTime":1.3921480000000201,"msg":"request completed"}
{"level":30,"time":1794983934692,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/470ce63f-b7ca-421d-946f-54b909440395/closure","host":"127.0.0.1:41811","remoteAddress":"127.0.0.1","remotePort":35458},"msg":"incoming request"}
{"level":30,"time":1794983934695,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.037290999999982,"msg":"request completed"}
{"level":30,"time":1794983934696,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/470ce63f-b7ca-421d-946f-54b909440395/aar","host":"127.0.0.1:33581","remoteAddress":"127.0.0.1","remotePort":48210},"msg":"incoming request"}
{"level":30,"time":1794983934699,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.950087999999994,"msg":"request completed"}
{"level":30,"time":1794983934700,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46437","remoteAddress":"127.0.0.1","remotePort":36420},"msg":"incoming request"}
{"level":30,"time":1794983934702,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.6238950000000045,"msg":"request completed"}
{"level":30,"time":1794983934703,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/69ed3b13-8aae-4e15-82a3-88a27a97a1a2/closure","host":"127.0.0.1:36045","remoteAddress":"127.0.0.1","remotePort":32816},"msg":"incoming request"}
{"level":30,"time":1794983934706,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.7606010000000083,"msg":"request completed"}
{"level":30,"time":1794983934707,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/69ed3b13-8aae-4e15-82a3-88a27a97a1a2/aar","host":"127.0.0.1:46159","remoteAddress":"127.0.0.1","remotePort":34986},"msg":"incoming request"}
{"level":30,"time":1794983934708,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":422},"responseTime":1.3121979999999667,"msg":"request completed"}
{"level":30,"time":1794983934710,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45459","remoteAddress":"127.0.0.1","remotePort":54344},"msg":"incoming request"}
{"level":30,"time":1794983934712,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":2.3029900000000225,"msg":"request completed"}
{"level":30,"time":1794983934713,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/022a8430-d394-4502-9948-7fff2ff3eede/closure","host":"127.0.0.1:33695","remoteAddress":"127.0.0.1","remotePort":41056},"msg":"incoming request"}
{"level":30,"time":1794983934715,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.30308100000002,"msg":"request completed"}
{"level":30,"time":1794983934716,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/022a8430-d394-4502-9948-7fff2ff3eede/aar","host":"127.0.0.1:40835","remoteAddress":"127.0.0.1","remotePort":50942},"msg":"incoming request"}
{"level":30,"time":1794983934718,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.5548049999999876,"msg":"request completed"}
{"level":30,"time":1794983934719,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/022a8430-d394-4502-9948-7fff2ff3eede/aar/478145ef-bf7e-42a5-96af-d4ea6855cfaa/finalize","host":"127.0.0.1:44001","remoteAddress":"127.0.0.1","remotePort":48486},"msg":"incoming request"}
{"level":30,"time":1794983934722,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.5994479999999953,"msg":"request completed"}
{"level":30,"time":1794983934722,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/022a8430-d394-4502-9948-7fff2ff3eede/aar/478145ef-bf7e-42a5-96af-d4ea6855cfaa/finalize","host":"127.0.0.1:37037","remoteAddress":"127.0.0.1","remotePort":52932},"msg":"incoming request"}
{"level":30,"time":1794983934724,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":403},"responseTime":1.3836120000000278,"msg":"request completed"}
{"level":30,"time":1794983934725,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43401","remoteAddress":"127.0.0.1","remotePort":56320},"msg":"incoming request"}
{"level":30,"time":1794983934727,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.3916980000000194,"msg":"request completed"}
{"level":30,"time":1794983934728,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/f45dc539-344c-4a95-bdeb-112ebef119d1/closure","host":"127.0.0.1:46199","remoteAddress":"127.0.0.1","remotePort":34630},"msg":"incoming request"}
{"level":30,"time":1794983934730,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.2729340000000207,"msg":"request completed"}
{"level":30,"time":1794983934731,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/f45dc539-344c-4a95-bdeb-112ebef119d1/aar","host":"127.0.0.1:44303","remoteAddress":"127.0.0.1","remotePort":38092},"msg":"incoming request"}
{"level":30,"time":1794983934733,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.3227679999999964,"msg":"request completed"}
{"level":30,"time":1794983934734,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/f45dc539-344c-4a95-bdeb-112ebef119d1/aar/dbc15abc-3068-489b-83ae-7b8a24277b6a/finalize","host":"127.0.0.1:37747","remoteAddress":"127.0.0.1","remotePort":40016},"msg":"incoming request"}
{"level":30,"time":1794983934735,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":200},"responseTime":1.5646220000000426,"msg":"request completed"}
{"level":30,"time":1794983934736,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=09958c3d-398b-4663-825e-5b1e570a0d99&page_size=200","host":"127.0.0.1:38625","remoteAddress":"127.0.0.1","remotePort":34994},"msg":"incoming request"}
{"level":30,"time":1794983934738,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":1.97931200000005,"msg":"request completed"}
{"level":30,"time":1794983934739,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:43069","remoteAddress":"127.0.0.1","remotePort":40928},"msg":"incoming request"}
{"level":30,"time":1794983934740,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":0.9170740000000137,"msg":"request completed"}
{"level":30,"time":1794983934741,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:40765","remoteAddress":"127.0.0.1","remotePort":56084},"msg":"incoming request"}
{"level":30,"time":1794983934744,"pid":181845,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":200},"responseTime":2.4785309999999754,"msg":"request completed"}
{"level":30,"time":1794983934995,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:40419","remoteAddress":"127.0.0.1","remotePort":41018},"msg":"incoming request"}
{"level":30,"time":1794983935000,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.465237000000002,"msg":"request completed"}
{"level":30,"time":1794983935003,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:46121","remoteAddress":"127.0.0.1","remotePort":53262},"msg":"incoming request"}
{"level":30,"time":1794983935005,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":2.1753510000000063,"msg":"request completed"}
{"level":30,"time":1794983935006,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37597","remoteAddress":"127.0.0.1","remotePort":59878},"msg":"incoming request"}
{"level":30,"time":1794983935016,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":9.650499000000025,"msg":"request completed"}
{"level":30,"time":1794983935017,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35753","remoteAddress":"127.0.0.1","remotePort":42808},"msg":"incoming request"}
{"level":30,"time":1794983935026,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.588530999999989,"msg":"request completed"}
{"level":30,"time":1794983935027,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/dea9c8cd-6811-4088-885a-37302902d7a2/send","host":"127.0.0.1:38553","remoteAddress":"127.0.0.1","remotePort":33442},"msg":"incoming request"}
{"level":30,"time":1794983935029,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":403},"responseTime":1.5096589999999992,"msg":"request completed"}
{"level":30,"time":1794983935030,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/dea9c8cd-6811-4088-885a-37302902d7a2/send","host":"127.0.0.1:36845","remoteAddress":"127.0.0.1","remotePort":40326},"msg":"incoming request"}
{"level":30,"time":1794983935033,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.725595999999996,"msg":"request completed"}
{"level":30,"time":1794983935034,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/e3afe860-7915-40bd-a998-38a56338bf16/timeline","host":"127.0.0.1:39731","remoteAddress":"127.0.0.1","remotePort":36382},"msg":"incoming request"}
{"level":30,"time":1794983935036,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.2508119999999963,"msg":"request completed"}
{"level":30,"time":1794983935037,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/dea9c8cd-6811-4088-885a-37302902d7a2/delivery-status","host":"127.0.0.1:41661","remoteAddress":"127.0.0.1","remotePort":41782},"msg":"incoming request"}
{"level":30,"time":1794983935039,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.7198140000000421,"msg":"request completed"}
{"level":30,"time":1794983935041,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:44029","remoteAddress":"127.0.0.1","remotePort":38538},"msg":"incoming request"}
{"level":30,"time":1794983935043,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":1.7464140000000157,"msg":"request completed"}
{"level":30,"time":1794983935044,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:34559","remoteAddress":"127.0.0.1","remotePort":59732},"msg":"incoming request"}
{"level":30,"time":1794983935045,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":1.8611500000000092,"msg":"request completed"}
{"level":30,"time":1794983935046,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:39393","remoteAddress":"127.0.0.1","remotePort":47562},"msg":"incoming request"}
{"level":30,"time":1794983935050,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":3.9341080000000375,"msg":"request completed"}
{"level":30,"time":1794983935051,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/daad2168-97b1-49c1-9d10-de97ad1f2d9c/send","host":"127.0.0.1:36531","remoteAddress":"127.0.0.1","remotePort":58016},"msg":"incoming request"}
{"level":30,"time":1794983935053,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":400},"responseTime":1.5992069999999785,"msg":"request completed"}
{"level":30,"time":1794983935053,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/822e8ad9-29b8-4e5d-940c-b6f8df8dc918/approve","host":"127.0.0.1:36959","remoteAddress":"127.0.0.1","remotePort":39404},"msg":"incoming request"}
{"level":30,"time":1794983935055,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.526791000000003,"msg":"request completed"}
{"level":30,"time":1794983935056,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/daad2168-97b1-49c1-9d10-de97ad1f2d9c/send","host":"127.0.0.1:42957","remoteAddress":"127.0.0.1","remotePort":39678},"msg":"incoming request"}
{"level":30,"time":1794983935058,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.183306000000016,"msg":"request completed"}
{"level":30,"time":1794983935061,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:35475","remoteAddress":"127.0.0.1","remotePort":36672},"msg":"incoming request"}
{"level":30,"time":1794983935062,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.3278669999999693,"msg":"request completed"}
{"level":30,"time":1794983935063,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:43395","remoteAddress":"127.0.0.1","remotePort":46946},"msg":"incoming request"}
{"level":30,"time":1794983935068,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":4.524518999999998,"msg":"request completed"}
{"level":30,"time":1794983935069,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/62644171-4593-4376-8e69-4786299d6efa/send","host":"127.0.0.1:38761","remoteAddress":"127.0.0.1","remotePort":53972},"msg":"incoming request"}
{"level":30,"time":1794983935071,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.3269659999999703,"msg":"request completed"}
{"level":30,"time":1794983935072,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:40941","remoteAddress":"127.0.0.1","remotePort":39530},"msg":"incoming request"}
{"level":30,"time":1794983935076,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":3.803692999999953,"msg":"request completed"}
{"level":30,"time":1794983935076,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/3c234c9d-741d-4d4b-b2de-7d815643a05c/send","host":"127.0.0.1:35873","remoteAddress":"127.0.0.1","remotePort":38398},"msg":"incoming request"}
{"level":30,"time":1794983935077,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":403},"responseTime":0.8303710000000137,"msg":"request completed"}
{"level":30,"time":1794983935078,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:40619","remoteAddress":"127.0.0.1","remotePort":33652},"msg":"incoming request"}
{"level":30,"time":1794983935084,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":5.867063999999971,"msg":"request completed"}
{"level":30,"time":1794983935085,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:46711","remoteAddress":"127.0.0.1","remotePort":60426},"msg":"incoming request"}
{"level":30,"time":1794983935086,"pid":181892,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":1.0145080000000348,"msg":"request completed"}
{"level":30,"time":1794983935332,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40203","remoteAddress":"127.0.0.1","remotePort":60148},"msg":"incoming request"}
{"level":30,"time":1794983935346,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.853192000000007,"msg":"request completed"}
{"level":30,"time":1794983935349,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/activation","host":"127.0.0.1:34773","remoteAddress":"127.0.0.1","remotePort":34150},"msg":"incoming request"}
{"level":30,"time":1794983935352,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":2.6875140000000215,"msg":"request completed"}
{"level":30,"time":1794983935353,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4","host":"127.0.0.1:38809","remoteAddress":"127.0.0.1","remotePort":34898},"msg":"incoming request"}
{"level":30,"time":1794983935355,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.467050000000029,"msg":"request completed"}
{"level":30,"time":1794983935356,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/command-roles","host":"127.0.0.1:34703","remoteAddress":"127.0.0.1","remotePort":56492},"msg":"incoming request"}
{"level":30,"time":1794983935359,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.9402600000000234,"msg":"request completed"}
{"level":30,"time":1794983935360,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/activation","host":"127.0.0.1:32891","remoteAddress":"127.0.0.1","remotePort":40074},"msg":"incoming request"}
{"level":30,"time":1794983935363,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.4000540000000115,"msg":"request completed"}
{"level":30,"time":1794983935364,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/timeline","host":"127.0.0.1:40889","remoteAddress":"127.0.0.1","remotePort":41588},"msg":"incoming request"}
{"level":30,"time":1794983935366,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.240724,"msg":"request completed"}
{"level":30,"time":1794983935368,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/activation","host":"127.0.0.1:36891","remoteAddress":"127.0.0.1","remotePort":48756},"msg":"incoming request"}
{"level":30,"time":1794983935369,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":400},"responseTime":1.0800110000000132,"msg":"request completed"}
{"level":30,"time":1794983935370,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4","host":"127.0.0.1:43529","remoteAddress":"127.0.0.1","remotePort":60842},"msg":"incoming request"}
{"level":30,"time":1794983935372,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0946689999999535,"msg":"request completed"}
{"level":30,"time":1794983935373,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/command-roles","host":"127.0.0.1:42125","remoteAddress":"127.0.0.1","remotePort":50430},"msg":"incoming request"}
{"level":30,"time":1794983935376,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.9297490000000153,"msg":"request completed"}
{"level":30,"time":1794983935377,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/timeline","host":"127.0.0.1:41407","remoteAddress":"127.0.0.1","remotePort":47612},"msg":"incoming request"}
{"level":30,"time":1794983935379,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":1.8152039999999943,"msg":"request completed"}
{"level":30,"time":1794983935380,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/closure","host":"127.0.0.1:39647","remoteAddress":"127.0.0.1","remotePort":45766},"msg":"incoming request"}
{"level":30,"time":1794983935383,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.131099000000006,"msg":"request completed"}
{"level":30,"time":1794983935383,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/9f4054f5-16fa-44ef-a2b2-b8d26f16dbf4/timeline","host":"127.0.0.1:40375","remoteAddress":"127.0.0.1","remotePort":34046},"msg":"incoming request"}
{"level":30,"time":1794983935385,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.5210909999999558,"msg":"request completed"}
{"level":30,"time":1794983935386,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37467","remoteAddress":"127.0.0.1","remotePort":56686},"msg":"incoming request"}
{"level":30,"time":1794983935389,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.761954000000003,"msg":"request completed"}
{"level":30,"time":1794983935390,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/7a2e9972-8fce-40de-a0f4-cd743ce79809/command-roles","host":"127.0.0.1:40987","remoteAddress":"127.0.0.1","remotePort":40002},"msg":"incoming request"}
{"level":30,"time":1794983935392,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":1.9689130000000432,"msg":"request completed"}
{"level":30,"time":1794983935393,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/7a2e9972-8fce-40de-a0f4-cd743ce79809/command-roles","host":"127.0.0.1:39215","remoteAddress":"127.0.0.1","remotePort":59532},"msg":"incoming request"}
{"level":30,"time":1794983935394,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.9019570000000385,"msg":"request completed"}
{"level":30,"time":1794983935395,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/7a2e9972-8fce-40de-a0f4-cd743ce79809/timeline","host":"127.0.0.1:46377","remoteAddress":"127.0.0.1","remotePort":39762},"msg":"incoming request"}
{"level":30,"time":1794983935397,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":200},"responseTime":1.8267960000000016,"msg":"request completed"}
{"level":30,"time":1794983935399,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40295","remoteAddress":"127.0.0.1","remotePort":51852},"msg":"incoming request"}
{"level":30,"time":1794983935402,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.0683500000000095,"msg":"request completed"}
{"level":30,"time":1794983935402,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/c949dfc7-0b98-4ddc-9ca1-cb09f211e5e0/activation","host":"127.0.0.1:37895","remoteAddress":"127.0.0.1","remotePort":54284},"msg":"incoming request"}
{"level":30,"time":1794983935404,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":404},"responseTime":1.4392770000000041,"msg":"request completed"}
{"level":30,"time":1794983935405,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/c949dfc7-0b98-4ddc-9ca1-cb09f211e5e0/command-roles","host":"127.0.0.1:45133","remoteAddress":"127.0.0.1","remotePort":36238},"msg":"incoming request"}
{"level":30,"time":1794983935406,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":404},"responseTime":1.0884570000000053,"msg":"request completed"}
{"level":30,"time":1794983935406,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/c949dfc7-0b98-4ddc-9ca1-cb09f211e5e0/closure","host":"127.0.0.1:43985","remoteAddress":"127.0.0.1","remotePort":42640},"msg":"incoming request"}
{"level":30,"time":1794983935407,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":404},"responseTime":0.9395459999999503,"msg":"request completed"}
{"level":30,"time":1794983935408,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/c949dfc7-0b98-4ddc-9ca1-cb09f211e5e0/activation","host":"127.0.0.1:39201","remoteAddress":"127.0.0.1","remotePort":60394},"msg":"incoming request"}
{"level":30,"time":1794983935410,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.6016220000000203,"msg":"request completed"}
{"level":30,"time":1794983935411,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42673","remoteAddress":"127.0.0.1","remotePort":39520},"msg":"incoming request"}
{"level":30,"time":1794983935413,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":201},"responseTime":2.1743190000000254,"msg":"request completed"}
{"level":30,"time":1794983935413,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/b1eb5af8-6add-436f-95c9-97f68a511d45/closure","host":"127.0.0.1:38807","remoteAddress":"127.0.0.1","remotePort":35518},"msg":"incoming request"}
{"level":30,"time":1794983935416,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","res":{"statusCode":200},"responseTime":2.2482780000000275,"msg":"request completed"}
{"level":30,"time":1794983935416,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/b1eb5af8-6add-436f-95c9-97f68a511d45/closure","host":"127.0.0.1:35293","remoteAddress":"127.0.0.1","remotePort":46480},"msg":"incoming request"}
{"level":30,"time":1794983935418,"pid":181903,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","res":{"statusCode":409},"responseTime":1.8809069999999792,"msg":"request completed"}
{"level":30,"time":1794983935666,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:39011","remoteAddress":"127.0.0.1","remotePort":36530},"msg":"incoming request"}
{"level":30,"time":1794983935678,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":12.105283999999983,"msg":"request completed"}
{"level":30,"time":1794983935681,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040/submit-review","host":"127.0.0.1:46837","remoteAddress":"127.0.0.1","remotePort":51670},"msg":"incoming request"}
{"level":30,"time":1794983935685,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":4.622993000000008,"msg":"request completed"}
{"level":30,"time":1794983935687,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040/review","host":"127.0.0.1:36823","remoteAddress":"127.0.0.1","remotePort":58634},"msg":"incoming request"}
{"level":30,"time":1794983935689,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":403},"responseTime":1.9743530000000078,"msg":"request completed"}
{"level":30,"time":1794983935690,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040","host":"127.0.0.1:38325","remoteAddress":"127.0.0.1","remotePort":57444},"msg":"incoming request"}
{"level":30,"time":1794983935692,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.808179999999993,"msg":"request completed"}
{"level":30,"time":1794983935693,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040/review","host":"127.0.0.1:43511","remoteAddress":"127.0.0.1","remotePort":60258},"msg":"incoming request"}
{"level":30,"time":1794983935696,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":3.1551830000000223,"msg":"request completed"}
{"level":30,"time":1794983935697,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040","host":"127.0.0.1:39163","remoteAddress":"127.0.0.1","remotePort":34230},"msg":"incoming request"}
{"level":30,"time":1794983935699,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.0609759999999824,"msg":"request completed"}
{"level":30,"time":1794983935700,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040/sections/946684b1-8559-4f47-8d7a-6fdd67d91b03/link-tasks","host":"127.0.0.1:42195","remoteAddress":"127.0.0.1","remotePort":38778},"msg":"incoming request"}
{"level":30,"time":1794983935702,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":204},"responseTime":1.8059059999999931,"msg":"request completed"}
{"level":30,"time":1794983935702,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040","host":"127.0.0.1:34419","remoteAddress":"127.0.0.1","remotePort":36318},"msg":"incoming request"}
{"level":30,"time":1794983935704,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.715475999999967,"msg":"request completed"}
{"level":30,"time":1794983935705,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33567","remoteAddress":"127.0.0.1","remotePort":46112},"msg":"incoming request"}
{"level":30,"time":1794983935714,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":9.01673599999998,"msg":"request completed"}
{"level":30,"time":1794983935715,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/cce89046-633b-4638-b4ee-834da89d7040/materialize-tasks","host":"127.0.0.1:39193","remoteAddress":"127.0.0.1","remotePort":33526},"msg":"incoming request"}
{"level":30,"time":1794983935718,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":2.876959999999997,"msg":"request completed"}
{"level":30,"time":1794983935719,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=4bc0e753-8862-4bf7-8d06-d6de521ce548","host":"127.0.0.1:39541","remoteAddress":"127.0.0.1","remotePort":50378},"msg":"incoming request"}
{"level":30,"time":1794983935721,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.8887520000000109,"msg":"request completed"}
{"level":30,"time":1794983935722,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:43261","remoteAddress":"127.0.0.1","remotePort":53362},"msg":"incoming request"}
{"level":30,"time":1794983935725,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":201},"responseTime":2.2973499999999945,"msg":"request completed"}
{"level":30,"time":1794983935725,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/607182e9-3098-4173-a2fe-e30175ae6a4c/review","host":"127.0.0.1:45853","remoteAddress":"127.0.0.1","remotePort":57872},"msg":"incoming request"}
{"level":30,"time":1794983935727,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":409},"responseTime":1.5581900000000246,"msg":"request completed"}
{"level":30,"time":1794983935728,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:33729","remoteAddress":"127.0.0.1","remotePort":43642},"msg":"incoming request"}
{"level":30,"time":1794983935730,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":1.8232790000000136,"msg":"request completed"}
{"level":30,"time":1794983935730,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/951abd3a-065a-4721-bf4b-ac85497ef983/submit-review","host":"127.0.0.1:46291","remoteAddress":"127.0.0.1","remotePort":42078},"msg":"incoming request"}
{"level":30,"time":1794983935732,"pid":181913,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.3088409999999726,"msg":"request completed"}
{"level":30,"time":1794983935974,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33613","remoteAddress":"127.0.0.1","remotePort":39544},"msg":"incoming request"}
{"level":30,"time":1794983935979,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.386439000000024,"msg":"request completed"}
{"level":30,"time":1794983935982,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40293","remoteAddress":"127.0.0.1","remotePort":44718},"msg":"incoming request"}
{"level":30,"time":1794983935984,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":1.623041999999998,"msg":"request completed"}
{"level":30,"time":1794983935985,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41173","remoteAddress":"127.0.0.1","remotePort":54378},"msg":"incoming request"}
{"level":30,"time":1794983935989,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.7736559999999884,"msg":"request completed"}
{"level":30,"time":1794983935990,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41823","remoteAddress":"127.0.0.1","remotePort":44138},"msg":"incoming request"}
{"level":30,"time":1794983935999,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.223514999999992,"msg":"request completed"}
{"level":30,"time":1794983936000,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42093","remoteAddress":"127.0.0.1","remotePort":40570},"msg":"incoming request"}
{"level":30,"time":1794983936002,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.3292299999999955,"msg":"request completed"}
{"level":30,"time":1794983936003,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/a8d7a328-c6dd-4981-8785-abf694a7bcad/timeline","host":"127.0.0.1:35725","remoteAddress":"127.0.0.1","remotePort":49688},"msg":"incoming request"}
{"level":30,"time":1794983936006,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.1716030000000046,"msg":"request completed"}
{"level":30,"time":1794983936007,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33193","remoteAddress":"127.0.0.1","remotePort":51466},"msg":"incoming request"}
{"level":30,"time":1794983936009,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":1.8687139999999545,"msg":"request completed"}
{"level":30,"time":1794983936010,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/799a604a-1479-4ae4-b3e2-93ec62479132/status","host":"127.0.0.1:34341","remoteAddress":"127.0.0.1","remotePort":47152},"msg":"incoming request"}
{"level":30,"time":1794983936011,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":409},"responseTime":1.6778850000000034,"msg":"request completed"}
{"level":30,"time":1794983936012,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42591","remoteAddress":"127.0.0.1","remotePort":42952},"msg":"incoming request"}
{"level":30,"time":1794983936015,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.144431999999995,"msg":"request completed"}
{"level":30,"time":1794983936015,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/b8392396-0bcd-45d0-b4cc-b00f5544d4a9/status","host":"127.0.0.1:35887","remoteAddress":"127.0.0.1","remotePort":55890},"msg":"incoming request"}
{"level":30,"time":1794983936017,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":409},"responseTime":1.489691999999991,"msg":"request completed"}
{"level":30,"time":1794983936018,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/b8392396-0bcd-45d0-b4cc-b00f5544d4a9/status","host":"127.0.0.1:37111","remoteAddress":"127.0.0.1","remotePort":60368},"msg":"incoming request"}
{"level":30,"time":1794983936020,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.34612199999998,"msg":"request completed"}
{"level":30,"time":1794983936021,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/b8392396-0bcd-45d0-b4cc-b00f5544d4a9/status","host":"127.0.0.1:33583","remoteAddress":"127.0.0.1","remotePort":60546},"msg":"incoming request"}
{"level":30,"time":1794983936022,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4660570000000348,"msg":"request completed"}
{"level":30,"time":1794983936023,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/b8392396-0bcd-45d0-b4cc-b00f5544d4a9/status","host":"127.0.0.1:38117","remoteAddress":"127.0.0.1","remotePort":60544},"msg":"incoming request"}
{"level":30,"time":1794983936025,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2491400000000112,"msg":"request completed"}
{"level":30,"time":1794983936026,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/b8392396-0bcd-45d0-b4cc-b00f5544d4a9/status","host":"127.0.0.1:44723","remoteAddress":"127.0.0.1","remotePort":57856},"msg":"incoming request"}
{"level":30,"time":1794983936028,"pid":181942,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.008726999999965,"msg":"request completed"}
{"level":30,"time":1794983936272,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:45923","remoteAddress":"127.0.0.1","remotePort":49570},"msg":"incoming request"}
{"level":30,"time":1794983936300,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":27.76303900000002,"msg":"request completed"}
{"level":30,"time":1794983936303,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:44931","remoteAddress":"127.0.0.1","remotePort":47716},"msg":"incoming request"}
{"level":30,"time":1794983936306,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.5875350000000026,"msg":"request completed"}
{"level":30,"time":1794983936307,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:34951","remoteAddress":"127.0.0.1","remotePort":44310},"msg":"incoming request"}
{"level":30,"time":1794983936309,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":400},"responseTime":1.5374410000000012,"msg":"request completed"}
{"level":30,"time":1794983936310,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:38159","remoteAddress":"127.0.0.1","remotePort":44580},"msg":"incoming request"}
{"level":30,"time":1794983936313,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.850459999999998,"msg":"request completed"}
{"level":30,"time":1794983936314,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/104b4f71-c33c-4b06-a03b-f35ddc88a5d3/revoke","host":"127.0.0.1:43035","remoteAddress":"127.0.0.1","remotePort":52802},"msg":"incoming request"}
{"level":30,"time":1794983936317,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":204},"responseTime":2.6745599999999854,"msg":"request completed"}
{"level":30,"time":1794983936319,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36017","remoteAddress":"127.0.0.1","remotePort":56726},"msg":"incoming request"}
{"level":30,"time":1794983936321,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.018515999999977,"msg":"request completed"}
{"level":30,"time":1794983936322,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41395","remoteAddress":"127.0.0.1","remotePort":35996},"msg":"incoming request"}
{"level":30,"time":1794983936323,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4331050000000118,"msg":"request completed"}
{"level":30,"time":1794983936324,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36131","remoteAddress":"127.0.0.1","remotePort":52916},"msg":"incoming request"}
{"level":30,"time":1794983936326,"pid":181952,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6453240000000164,"msg":"request completed"}
{"level":30,"time":1794983936571,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:36535","remoteAddress":"127.0.0.1","remotePort":57334},"msg":"incoming request"}
{"level":30,"time":1794983936577,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":5.204827999999992,"msg":"request completed"}
{"level":30,"time":1794983936579,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:44531","remoteAddress":"127.0.0.1","remotePort":37904},"msg":"incoming request"}
{"level":30,"time":1794983936584,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":5.304715999999985,"msg":"request completed"}
{"level":30,"time":1794983936586,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37237","remoteAddress":"127.0.0.1","remotePort":50930},"msg":"incoming request"}
{"level":30,"time":1794983936588,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.1080839999999625,"msg":"request completed"}
{"level":30,"time":1794983936589,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/0970447b-31d7-4dd8-afca-1ae7063e5604","host":"127.0.0.1:45093","remoteAddress":"127.0.0.1","remotePort":57738},"msg":"incoming request"}
{"level":30,"time":1794983936592,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.768346000000008,"msg":"request completed"}
{"level":30,"time":1794983936593,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37991","remoteAddress":"127.0.0.1","remotePort":47590},"msg":"incoming request"}
{"level":30,"time":1794983936593,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":401},"responseTime":0.504197999999974,"msg":"request completed"}
{"level":30,"time":1794983936595,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:33859","remoteAddress":"127.0.0.1","remotePort":35682},"msg":"incoming request"}
{"level":30,"time":1794983936596,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":403},"responseTime":1.0454159999999888,"msg":"request completed"}
{"level":30,"time":1794983936597,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/35463cbd-22bb-4519-9c32-cccf5e25bbb8","host":"127.0.0.1:40713","remoteAddress":"127.0.0.1","remotePort":53648},"msg":"incoming request"}
{"level":30,"time":1794983936600,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":3.5218229999999835,"msg":"request completed"}
{"level":30,"time":1794983936601,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42775","remoteAddress":"127.0.0.1","remotePort":47716},"msg":"incoming request"}
{"level":30,"time":1794983936604,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.809522999999956,"msg":"request completed"}
{"level":30,"time":1794983936605,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=272df886-646f-433f-86d4-fbb640848e40&page_size=50","host":"127.0.0.1:33585","remoteAddress":"127.0.0.1","remotePort":55334},"msg":"incoming request"}
{"level":30,"time":1794983936608,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.174640000000011,"msg":"request completed"}
{"level":30,"time":1794983936610,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:44097","remoteAddress":"127.0.0.1","remotePort":35424},"msg":"incoming request"}
{"level":30,"time":1794983936614,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":403},"responseTime":3.162136999999973,"msg":"request completed"}
{"level":30,"time":1794983936616,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:39609","remoteAddress":"127.0.0.1","remotePort":52604},"msg":"incoming request"}
{"level":30,"time":1794983936618,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.476095999999984,"msg":"request completed"}
{"level":30,"time":1794983936619,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37481","remoteAddress":"127.0.0.1","remotePort":32940},"msg":"incoming request"}
{"level":30,"time":1794983936622,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":422},"responseTime":2.4772590000000037,"msg":"request completed"}
{"level":30,"time":1794983936623,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:37627","remoteAddress":"127.0.0.1","remotePort":55838},"msg":"incoming request"}
{"level":30,"time":1794983936625,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.8703669999999875,"msg":"request completed"}
{"level":30,"time":1794983936626,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=272df886-646f-433f-86d4-fbb640848e40&action_type=record_view","host":"127.0.0.1:38725","remoteAddress":"127.0.0.1","remotePort":55546},"msg":"incoming request"}
{"level":30,"time":1794983936628,"pid":181962,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.7106170000000134,"msg":"request completed"}
{"level":30,"time":1794983936890,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37923","remoteAddress":"127.0.0.1","remotePort":51580},"msg":"incoming request"}
{"level":30,"time":1794983936904,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.814848999999981,"msg":"request completed"}
{"level":30,"time":1794983936907,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34479","remoteAddress":"127.0.0.1","remotePort":55150},"msg":"incoming request"}
{"level":30,"time":1794983936910,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.4076179999999567,"msg":"request completed"}
{"level":30,"time":1794983936911,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:46109","remoteAddress":"127.0.0.1","remotePort":43146},"msg":"incoming request"}
{"level":30,"time":1794983936914,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.0867849999999635,"msg":"request completed"}
{"level":30,"time":1794983936916,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35353","remoteAddress":"127.0.0.1","remotePort":36848},"msg":"incoming request"}
{"level":30,"time":1794983936919,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.66812699999997,"msg":"request completed"}
{"level":30,"time":1794983936920,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:44965","remoteAddress":"127.0.0.1","remotePort":39222},"msg":"incoming request"}
{"level":30,"time":1794983936922,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.7797970000000305,"msg":"request completed"}
{"level":30,"time":1794983936923,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:39175","remoteAddress":"127.0.0.1","remotePort":58592},"msg":"incoming request"}
{"level":30,"time":1794983936925,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.6961599999999635,"msg":"request completed"}
{"level":30,"time":1794983936926,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:39025","remoteAddress":"127.0.0.1","remotePort":49240},"msg":"incoming request"}
{"level":30,"time":1794983936928,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.9420220000000086,"msg":"request completed"}
{"level":30,"time":1794983936929,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:34855","remoteAddress":"127.0.0.1","remotePort":35150},"msg":"incoming request"}
{"level":30,"time":1794983936931,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.911405000000002,"msg":"request completed"}
{"level":30,"time":1794983936932,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:43243","remoteAddress":"127.0.0.1","remotePort":37226},"msg":"incoming request"}
{"level":30,"time":1794983936934,"pid":182010,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.508937000000003,"msg":"request completed"}
{"level":30,"time":1794983937173,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40307","remoteAddress":"127.0.0.1","remotePort":57756},"msg":"incoming request"}
{"level":30,"time":1794983937187,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.97026200000002,"msg":"request completed"}
{"level":30,"time":1794983937193,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/fdf052af-4c60-45b7-ad86-a04a3cfdc385/timeline","host":"127.0.0.1:45171","remoteAddress":"127.0.0.1","remotePort":56052},"msg":"incoming request"}
{"level":30,"time":1794983937196,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.7013999999999783,"msg":"request completed"}
{"level":30,"time":1794983937200,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33501","remoteAddress":"127.0.0.1","remotePort":53830},"msg":"incoming request"}
{"level":30,"time":1794983937203,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.816607000000033,"msg":"request completed"}
{"level":30,"time":1794983937204,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/f44edced-078e-482b-84e7-33dd66cf29fe/closure","host":"127.0.0.1:38477","remoteAddress":"127.0.0.1","remotePort":59720},"msg":"incoming request"}
{"level":30,"time":1794983937207,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":3.1791690000000017,"msg":"request completed"}
{"level":30,"time":1794983937209,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/f44edced-078e-482b-84e7-33dd66cf29fe/timeline","host":"127.0.0.1:45935","remoteAddress":"127.0.0.1","remotePort":53282},"msg":"incoming request"}
{"level":30,"time":1794983937210,"pid":182042,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5836080000000265,"msg":"request completed"}
{"level":30,"time":1794983937453,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38811","remoteAddress":"127.0.0.1","remotePort":55494},"msg":"incoming request"}
{"level":30,"time":1794983937458,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":4.829191000000009,"msg":"request completed"}
{"level":30,"time":1794983937460,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37333","remoteAddress":"127.0.0.1","remotePort":34746},"msg":"incoming request"}
{"level":30,"time":1794983937460,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18248400000001652,"msg":"request completed"}
{"level":30,"time":1794983937462,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:42503","remoteAddress":"127.0.0.1","remotePort":55898},"msg":"incoming request"}
{"level":30,"time":1794983937465,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.789095000000003,"msg":"request completed"}
{"level":30,"time":1794983937466,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39885","remoteAddress":"127.0.0.1","remotePort":53956},"msg":"incoming request"}
{"level":30,"time":1794983937467,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.638181000000003,"msg":"request completed"}
{"level":30,"time":1794983937468,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43655","remoteAddress":"127.0.0.1","remotePort":51262},"msg":"incoming request"}
{"level":30,"time":1794983937470,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5197880000000055,"msg":"request completed"}
{"level":30,"time":1794983937471,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44441","remoteAddress":"127.0.0.1","remotePort":39496},"msg":"incoming request"}
{"level":30,"time":1794983937472,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.40583300000002964,"msg":"request completed"}
{"level":30,"time":1794983937473,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:45769","remoteAddress":"127.0.0.1","remotePort":53042},"msg":"incoming request"}
{"level":30,"time":1794983937474,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3617810000000077,"msg":"request completed"}
{"level":30,"time":1794983937475,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:44053","remoteAddress":"127.0.0.1","remotePort":50876},"msg":"incoming request"}
{"level":30,"time":1794983937476,"pid":182052,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9945500000000038,"msg":"request completed"}

 Test Files  13 passed (13)
      Tests  67 passed (67)
   Start at  06:38:52
   Duration  4.66s (transform 144ms, setup 33ms, import 1.84s, tests 2.11s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 53[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 103[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 66[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 133[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 153[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 107[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 06:38:57
[2m   Duration [22m 1.96s[2m (transform 331ms, setup 133ms, collect 708ms, tests 615ms, environment 1.10s, prepare 192ms)[22m
```

