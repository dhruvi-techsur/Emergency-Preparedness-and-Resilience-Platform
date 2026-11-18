---
phase: 04
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-18T05:50:07Z
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

