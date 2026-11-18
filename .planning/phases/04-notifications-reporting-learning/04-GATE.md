---
phase: 04
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-18T13:08:11Z
tests_disabled_during_fixes: none
shadowed_sources: 0
review_blockers_open: 0
boot_smoke: pass
browser_suite: pass
browser_headroom_mb: 5041
browser_headroom_naive_mb: 1403
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

## Wave 5

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
[32m✓ built in 201ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 138 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-D2bto9tI.css  [39m[1m[2m 48.76 kB[22m[1m[22m[2m │ gzip:   8.01 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C05ugWQ5.js   [39m[1m[2m479.84 kB[22m[1m[22m[2m │ gzip: 137.71 kB[22m
[32m✓ built in 902ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1794985800538,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:46769","remoteAddress":"127.0.0.1","remotePort":44066},"msg":"incoming request"}
{"level":30,"time":1794985800585,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":46.76625999999999,"msg":"request completed"}
{"level":30,"time":1794985800588,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45617","remoteAddress":"127.0.0.1","remotePort":40686},"msg":"incoming request"}
{"level":30,"time":1794985800599,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":10.713439999999991,"msg":"request completed"}
{"level":30,"time":1794985800601,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40017","remoteAddress":"127.0.0.1","remotePort":47260},"msg":"incoming request"}
{"level":30,"time":1794985800605,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.8689860000000067,"msg":"request completed"}
{"level":30,"time":1794985800607,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/bf1d94cb-e4c0-453d-8174-bb1e3ba04989/decline","host":"127.0.0.1:37613","remoteAddress":"127.0.0.1","remotePort":45460},"msg":"incoming request"}
{"level":30,"time":1794985800608,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":422},"responseTime":1.3692219999999793,"msg":"request completed"}
{"level":30,"time":1794985800610,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=d7dd0d11-3b76-46d3-a907-4ede0f2e10fc","host":"127.0.0.1:32813","remoteAddress":"127.0.0.1","remotePort":59242},"msg":"incoming request"}
{"level":30,"time":1794985800612,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2654750000000377,"msg":"request completed"}
{"level":30,"time":1794985800613,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/bf1d94cb-e4c0-453d-8174-bb1e3ba04989/decline","host":"127.0.0.1:34187","remoteAddress":"127.0.0.1","remotePort":33258},"msg":"incoming request"}
{"level":30,"time":1794985800617,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":4.080733000000009,"msg":"request completed"}
{"level":30,"time":1794985800618,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/d7dd0d11-3b76-46d3-a907-4ede0f2e10fc/timeline","host":"127.0.0.1:45229","remoteAddress":"127.0.0.1","remotePort":34762},"msg":"incoming request"}
{"level":30,"time":1794985800621,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.6044310000000337,"msg":"request completed"}
{"level":30,"time":1794985800623,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42133","remoteAddress":"127.0.0.1","remotePort":38988},"msg":"incoming request"}
{"level":30,"time":1794985800629,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":5.97746699999999,"msg":"request completed"}
{"level":30,"time":1794985800630,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:40635","remoteAddress":"127.0.0.1","remotePort":42702},"msg":"incoming request"}
{"level":30,"time":1794985800637,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":6.764835000000005,"msg":"request completed"}
{"level":30,"time":1794985800639,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/ae7e70be-e6ae-45c5-b416-a7c0e0ff74d1/approve","host":"127.0.0.1:45023","remoteAddress":"127.0.0.1","remotePort":51290},"msg":"incoming request"}
{"level":30,"time":1794985800661,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":22.139930999999933,"msg":"request completed"}
{"level":30,"time":1794985800663,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/ae7e70be-e6ae-45c5-b416-a7c0e0ff74d1/fulfill","host":"127.0.0.1:34139","remoteAddress":"127.0.0.1","remotePort":56276},"msg":"incoming request"}
{"level":30,"time":1794985800666,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.4738250000000335,"msg":"request completed"}
{"level":30,"time":1794985800667,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/ae7e70be-e6ae-45c5-b416-a7c0e0ff74d1/fulfill","host":"127.0.0.1:42447","remoteAddress":"127.0.0.1","remotePort":36446},"msg":"incoming request"}
{"level":30,"time":1794985800672,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":4.934077000000002,"msg":"request completed"}
{"level":30,"time":1794985800675,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/d1a82579-065e-48eb-96da-2e015ae6194e/timeline","host":"127.0.0.1:34257","remoteAddress":"127.0.0.1","remotePort":50370},"msg":"incoming request"}
{"level":30,"time":1794985800682,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":7.7903009999999995,"msg":"request completed"}
{"level":30,"time":1794985800885,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39605","remoteAddress":"127.0.0.1","remotePort":41714},"msg":"incoming request"}
{"level":30,"time":1794985800889,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":3.6610059999999294,"msg":"request completed"}
{"level":30,"time":1794985800890,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:46395","remoteAddress":"127.0.0.1","remotePort":58934},"msg":"incoming request"}
{"level":30,"time":1794985800891,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.1988920000000007,"msg":"request completed"}
{"level":30,"time":1794985800892,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38303","remoteAddress":"127.0.0.1","remotePort":37532},"msg":"incoming request"}
{"level":30,"time":1794985800894,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.2824869999999464,"msg":"request completed"}
{"level":30,"time":1794985800895,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:44859","remoteAddress":"127.0.0.1","remotePort":57810},"msg":"incoming request"}
{"level":30,"time":1794985800897,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":1.982212000000004,"msg":"request completed"}
{"level":30,"time":1794985800898,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/7c8b3f78-bcbd-4d71-9b75-d4ab5ce8cefd/fulfill","host":"127.0.0.1:42351","remoteAddress":"127.0.0.1","remotePort":58974},"msg":"incoming request"}
{"level":30,"time":1794985800899,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":409},"responseTime":1.5010790000000043,"msg":"request completed"}
{"level":30,"time":1794985800900,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/7c8b3f78-bcbd-4d71-9b75-d4ab5ce8cefd/approve","host":"127.0.0.1:39737","remoteAddress":"127.0.0.1","remotePort":34666},"msg":"incoming request"}
{"level":30,"time":1794985800901,"pid":263504,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":409},"responseTime":1.130042000000003,"msg":"request completed"}
{"level":30,"time":1794985801155,"pid":263570,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:44881","remoteAddress":"127.0.0.1","remotePort":33430},"msg":"incoming request"}
{"level":30,"time":1794985801202,"pid":263570,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":46.76081100000002,"msg":"request completed"}
{"level":30,"time":1794985801409,"pid":263570,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:35879","remoteAddress":"127.0.0.1","remotePort":43832},"msg":"incoming request"}
{"level":30,"time":1794985801413,"pid":263570,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.3094449999999824,"msg":"request completed"}
{"level":30,"time":1794985801663,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40087","remoteAddress":"127.0.0.1","remotePort":39712},"msg":"incoming request"}
{"level":30,"time":1794985801676,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.146990000000017,"msg":"request completed"}
{"level":30,"time":1794985801679,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/737d7ef7-26ea-4979-b466-faa7762ce2ac/timeline","host":"127.0.0.1:45565","remoteAddress":"127.0.0.1","remotePort":49298},"msg":"incoming request"}
{"level":30,"time":1794985801682,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":3.462221999999997,"msg":"request completed"}
{"level":30,"time":1794985801684,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33925","remoteAddress":"127.0.0.1","remotePort":53984},"msg":"incoming request"}
{"level":30,"time":1794985801687,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.236188000000027,"msg":"request completed"}
{"level":30,"time":1794985801688,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41853","remoteAddress":"127.0.0.1","remotePort":49542},"msg":"incoming request"}
{"level":30,"time":1794985801690,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":409},"responseTime":1.3728380000000016,"msg":"request completed"}
{"level":30,"time":1794985801691,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34293","remoteAddress":"127.0.0.1","remotePort":60724},"msg":"incoming request"}
{"level":30,"time":1794985801693,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.6077569999999923,"msg":"request completed"}
{"level":30,"time":1794985801695,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37047","remoteAddress":"127.0.0.1","remotePort":36040},"msg":"incoming request"}
{"level":30,"time":1794985801698,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":201},"responseTime":2.891420000000039,"msg":"request completed"}
{"level":30,"time":1794985801698,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39411","remoteAddress":"127.0.0.1","remotePort":38432},"msg":"incoming request"}
{"level":30,"time":1794985801701,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.3351659999999583,"msg":"request completed"}
{"level":30,"time":1794985801702,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33783","remoteAddress":"127.0.0.1","remotePort":60858},"msg":"incoming request"}
{"level":30,"time":1794985801704,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.3946169999999825,"msg":"request completed"}
{"level":30,"time":1794985801705,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:35083","remoteAddress":"127.0.0.1","remotePort":55578},"msg":"incoming request"}
{"level":30,"time":1794985801707,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":2.068764999999985,"msg":"request completed"}
{"level":30,"time":1794985801709,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39481","remoteAddress":"127.0.0.1","remotePort":57760},"msg":"incoming request"}
{"level":30,"time":1794985801712,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":2.4133019999999874,"msg":"request completed"}
{"level":30,"time":1794985801713,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/ef9fc118-6eff-425a-9224-763eb8339201","host":"127.0.0.1:44695","remoteAddress":"127.0.0.1","remotePort":45452},"msg":"incoming request"}
{"level":30,"time":1794985801714,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":404},"responseTime":1.519993999999997,"msg":"request completed"}
{"level":30,"time":1794985801715,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:46481","remoteAddress":"127.0.0.1","remotePort":43686},"msg":"incoming request"}
{"level":30,"time":1794985801717,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.331869999999981,"msg":"request completed"}
{"level":30,"time":1794985801718,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/ef9fc118-6eff-425a-9224-763eb8339201","host":"127.0.0.1:34507","remoteAddress":"127.0.0.1","remotePort":33418},"msg":"incoming request"}
{"level":30,"time":1794985801720,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":404},"responseTime":1.4633590000000254,"msg":"request completed"}
{"level":30,"time":1794985801720,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/ef9fc118-6eff-425a-9224-763eb8339201/timeline","host":"127.0.0.1:43637","remoteAddress":"127.0.0.1","remotePort":49562},"msg":"incoming request"}
{"level":30,"time":1794985801722,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":404},"responseTime":1.1413630000000126,"msg":"request completed"}
{"level":30,"time":1794985801723,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40689","remoteAddress":"127.0.0.1","remotePort":35454},"msg":"incoming request"}
{"level":30,"time":1794985801725,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":2.2764460000000213,"msg":"request completed"}
{"level":30,"time":1794985801735,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37195","remoteAddress":"127.0.0.1","remotePort":52130},"msg":"incoming request"}
{"level":30,"time":1794985801743,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":8.504571999999996,"msg":"request completed"}
{"level":30,"time":1794985801744,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42587","remoteAddress":"127.0.0.1","remotePort":41086},"msg":"incoming request"}
{"level":30,"time":1794985801747,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":3.0255219999999667,"msg":"request completed"}
{"level":30,"time":1794985801748,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46415","remoteAddress":"127.0.0.1","remotePort":58056},"msg":"incoming request"}
{"level":30,"time":1794985801751,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.516395999999986,"msg":"request completed"}
{"level":30,"time":1794985801751,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:42201","remoteAddress":"127.0.0.1","remotePort":33688},"msg":"incoming request"}
{"level":40,"time":1794985801755,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794985801756,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":201},"responseTime":4.7821120000000406,"msg":"request completed"}
{"level":30,"time":1794985801757,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/46629fe5-4550-41a7-a5fc-9747d0492d85/approve","host":"127.0.0.1:38801","remoteAddress":"127.0.0.1","remotePort":57142},"msg":"incoming request"}
{"level":40,"time":1794985801759,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1794985801760,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.997589000000005,"msg":"request completed"}
{"level":30,"time":1794985801761,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:42931","remoteAddress":"127.0.0.1","remotePort":34746},"msg":"incoming request"}
{"level":30,"time":1794985801763,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":2.1601570000000265,"msg":"request completed"}
{"level":30,"time":1794985801764,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44149","remoteAddress":"127.0.0.1","remotePort":32808},"msg":"incoming request"}
{"level":30,"time":1794985801765,"pid":263580,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":403},"responseTime":1.0022120000000427,"msg":"request completed"}
{"level":30,"time":1794985802018,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:38709","remoteAddress":"127.0.0.1","remotePort":42902},"msg":"incoming request"}
{"level":30,"time":1794985802022,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.619706000000008,"msg":"request completed"}
{"level":30,"time":1794985802025,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:33291","remoteAddress":"127.0.0.1","remotePort":35978},"msg":"incoming request"}
{"level":30,"time":1794985802028,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":2.249825000000044,"msg":"request completed"}
{"level":30,"time":1794985802029,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42855","remoteAddress":"127.0.0.1","remotePort":59902},"msg":"incoming request"}
{"level":30,"time":1794985802040,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":11.071252000000015,"msg":"request completed"}
{"level":30,"time":1794985802041,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35667","remoteAddress":"127.0.0.1","remotePort":55536},"msg":"incoming request"}
{"level":30,"time":1794985802054,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":12.865812000000005,"msg":"request completed"}
{"level":30,"time":1794985802056,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/5e077b0f-11fc-49ca-a428-b8ddda97cc0d/send","host":"127.0.0.1:46297","remoteAddress":"127.0.0.1","remotePort":54634},"msg":"incoming request"}
{"level":30,"time":1794985802058,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":403},"responseTime":2.062534000000028,"msg":"request completed"}
{"level":30,"time":1794985802059,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/5e077b0f-11fc-49ca-a428-b8ddda97cc0d/send","host":"127.0.0.1:46639","remoteAddress":"127.0.0.1","remotePort":40174},"msg":"incoming request"}
{"level":30,"time":1794985802062,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.22594799999996,"msg":"request completed"}
{"level":30,"time":1794985802063,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/68fe7466-6812-46bc-94b1-67228155dbb5/timeline","host":"127.0.0.1:40653","remoteAddress":"127.0.0.1","remotePort":57736},"msg":"incoming request"}
{"level":30,"time":1794985802066,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":2.4427780000000325,"msg":"request completed"}
{"level":30,"time":1794985802067,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/5e077b0f-11fc-49ca-a428-b8ddda97cc0d/delivery-status","host":"127.0.0.1:39317","remoteAddress":"127.0.0.1","remotePort":37604},"msg":"incoming request"}
{"level":30,"time":1794985802070,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5819190000000276,"msg":"request completed"}
{"level":30,"time":1794985802072,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:36711","remoteAddress":"127.0.0.1","remotePort":55154},"msg":"incoming request"}
{"level":30,"time":1794985802074,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":1.8894689999999628,"msg":"request completed"}
{"level":30,"time":1794985802074,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:38319","remoteAddress":"127.0.0.1","remotePort":38160},"msg":"incoming request"}
{"level":30,"time":1794985802076,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":201},"responseTime":1.9766619999999762,"msg":"request completed"}
{"level":30,"time":1794985802077,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:38347","remoteAddress":"127.0.0.1","remotePort":40286},"msg":"incoming request"}
{"level":30,"time":1794985802082,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":4.342224999999985,"msg":"request completed"}
{"level":30,"time":1794985802083,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/124c53c0-36a9-4dd6-bf4d-4d8fe4527d7e/send","host":"127.0.0.1:37101","remoteAddress":"127.0.0.1","remotePort":45700},"msg":"incoming request"}
{"level":30,"time":1794985802084,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":400},"responseTime":1.605275000000006,"msg":"request completed"}
{"level":30,"time":1794985802085,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/777d5c20-4580-4c73-9127-47908ccbec6e/approve","host":"127.0.0.1:36229","remoteAddress":"127.0.0.1","remotePort":41016},"msg":"incoming request"}
{"level":30,"time":1794985802087,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5445009999999684,"msg":"request completed"}
{"level":30,"time":1794985802087,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/124c53c0-36a9-4dd6-bf4d-4d8fe4527d7e/send","host":"127.0.0.1:34275","remoteAddress":"127.0.0.1","remotePort":50914},"msg":"incoming request"}
{"level":30,"time":1794985802089,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.912290999999982,"msg":"request completed"}
{"level":30,"time":1794985802092,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:42849","remoteAddress":"127.0.0.1","remotePort":53250},"msg":"incoming request"}
{"level":30,"time":1794985802094,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.3935280000000034,"msg":"request completed"}
{"level":30,"time":1794985802095,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:40953","remoteAddress":"127.0.0.1","remotePort":51436},"msg":"incoming request"}
{"level":30,"time":1794985802102,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":7.70618300000001,"msg":"request completed"}
{"level":30,"time":1794985802103,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/00ef3310-96c3-4455-83cc-70d79716d52d/send","host":"127.0.0.1:33301","remoteAddress":"127.0.0.1","remotePort":45320},"msg":"incoming request"}
{"level":30,"time":1794985802106,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":2.382844999999975,"msg":"request completed"}
{"level":30,"time":1794985802107,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:34179","remoteAddress":"127.0.0.1","remotePort":53062},"msg":"incoming request"}
{"level":30,"time":1794985802111,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":4.457953000000032,"msg":"request completed"}
{"level":30,"time":1794985802112,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/a48b72c9-767d-46c6-b63f-14edc0b4b78a/send","host":"127.0.0.1:33875","remoteAddress":"127.0.0.1","remotePort":41590},"msg":"incoming request"}
{"level":30,"time":1794985802113,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":403},"responseTime":0.8699340000000007,"msg":"request completed"}
{"level":30,"time":1794985802114,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:41779","remoteAddress":"127.0.0.1","remotePort":34268},"msg":"incoming request"}
{"level":30,"time":1794985802122,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":7.84295000000003,"msg":"request completed"}
{"level":30,"time":1794985802122,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:45159","remoteAddress":"127.0.0.1","remotePort":53564},"msg":"incoming request"}
{"level":30,"time":1794985802124,"pid":263591,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":1.102220999999986,"msg":"request completed"}
{"level":30,"time":1794985802388,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39991","remoteAddress":"127.0.0.1","remotePort":41298},"msg":"incoming request"}
{"level":30,"time":1794985802404,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":16.241884000000027,"msg":"request completed"}
{"level":30,"time":1794985802407,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36861","remoteAddress":"127.0.0.1","remotePort":44396},"msg":"incoming request"}
{"level":30,"time":1794985802412,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":4.656445000000019,"msg":"request completed"}
{"level":30,"time":1794985802413,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/a822747c-e8a4-4ff0-b4d7-db7ae951ebbb/sitreps","host":"127.0.0.1:41875","remoteAddress":"127.0.0.1","remotePort":52048},"msg":"incoming request"}
{"level":30,"time":1794985802417,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":4.0143489999999815,"msg":"request completed"}
{"level":30,"time":1794985802418,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37731","remoteAddress":"127.0.0.1","remotePort":38162},"msg":"incoming request"}
{"level":30,"time":1794985802421,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1837099999999623,"msg":"request completed"}
{"level":30,"time":1794985802423,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/b8be6e32-7208-42f2-86a4-2f49e7b6f6f0/aar","host":"127.0.0.1:43879","remoteAddress":"127.0.0.1","remotePort":52182},"msg":"incoming request"}
{"level":30,"time":1794985802424,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":409},"responseTime":1.4944560000000138,"msg":"request completed"}
{"level":30,"time":1794985802425,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/b8be6e32-7208-42f2-86a4-2f49e7b6f6f0/closure","host":"127.0.0.1:38847","remoteAddress":"127.0.0.1","remotePort":45554},"msg":"incoming request"}
{"level":30,"time":1794985802429,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":3.236649,"msg":"request completed"}
{"level":30,"time":1794985802430,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/b8be6e32-7208-42f2-86a4-2f49e7b6f6f0/aar","host":"127.0.0.1:33423","remoteAddress":"127.0.0.1","remotePort":55740},"msg":"incoming request"}
{"level":30,"time":1794985802432,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":2.840915999999993,"msg":"request completed"}
{"level":30,"time":1794985802433,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46723","remoteAddress":"127.0.0.1","remotePort":51882},"msg":"incoming request"}
{"level":30,"time":1794985802436,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":201},"responseTime":2.8871630000000437,"msg":"request completed"}
{"level":30,"time":1794985802437,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/91211ca5-508d-44d7-95fc-be32bee130fe/closure","host":"127.0.0.1:44217","remoteAddress":"127.0.0.1","remotePort":35996},"msg":"incoming request"}
{"level":30,"time":1794985802441,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":3.2898379999999747,"msg":"request completed"}
{"level":30,"time":1794985802442,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/91211ca5-508d-44d7-95fc-be32bee130fe/aar","host":"127.0.0.1:41093","remoteAddress":"127.0.0.1","remotePort":54690},"msg":"incoming request"}
{"level":30,"time":1794985802443,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":422},"responseTime":1.5630759999999668,"msg":"request completed"}
{"level":30,"time":1794985802444,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38203","remoteAddress":"127.0.0.1","remotePort":52484},"msg":"incoming request"}
{"level":30,"time":1794985802447,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":201},"responseTime":2.8204170000000204,"msg":"request completed"}
{"level":30,"time":1794985802448,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/8af8420a-35b4-4038-b0c6-1d8f64b258f3/closure","host":"127.0.0.1:37223","remoteAddress":"127.0.0.1","remotePort":55200},"msg":"incoming request"}
{"level":30,"time":1794985802451,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":2.6995809999999665,"msg":"request completed"}
{"level":30,"time":1794985802452,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/8af8420a-35b4-4038-b0c6-1d8f64b258f3/aar","host":"127.0.0.1:38389","remoteAddress":"127.0.0.1","remotePort":60912},"msg":"incoming request"}
{"level":30,"time":1794985802455,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":3.2164000000000215,"msg":"request completed"}
{"level":30,"time":1794985802456,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/8af8420a-35b4-4038-b0c6-1d8f64b258f3/aar/6d423e95-2e26-41bb-ab4a-f5803582d00a/finalize","host":"127.0.0.1:45279","remoteAddress":"127.0.0.1","remotePort":56652},"msg":"incoming request"}
{"level":30,"time":1794985802459,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":3.566227999999967,"msg":"request completed"}
{"level":30,"time":1794985802460,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/8af8420a-35b4-4038-b0c6-1d8f64b258f3/aar/6d423e95-2e26-41bb-ab4a-f5803582d00a/finalize","host":"127.0.0.1:38379","remoteAddress":"127.0.0.1","remotePort":55144},"msg":"incoming request"}
{"level":30,"time":1794985802462,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":403},"responseTime":1.7426530000000184,"msg":"request completed"}
{"level":30,"time":1794985802463,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43541","remoteAddress":"127.0.0.1","remotePort":60840},"msg":"incoming request"}
{"level":30,"time":1794985802466,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":201},"responseTime":2.9557419999999865,"msg":"request completed"}
{"level":30,"time":1794985802467,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/cfdd8620-5c40-4ac0-96df-a63c7959258b/closure","host":"127.0.0.1:41665","remoteAddress":"127.0.0.1","remotePort":53160},"msg":"incoming request"}
{"level":30,"time":1794985802470,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":200},"responseTime":3.0311629999999923,"msg":"request completed"}
{"level":30,"time":1794985802471,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/cfdd8620-5c40-4ac0-96df-a63c7959258b/aar","host":"127.0.0.1:43287","remoteAddress":"127.0.0.1","remotePort":47498},"msg":"incoming request"}
{"level":30,"time":1794985802473,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":201},"responseTime":2.64795399999997,"msg":"request completed"}
{"level":30,"time":1794985802474,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/cfdd8620-5c40-4ac0-96df-a63c7959258b/aar/d9fcd9cb-4ab8-4d4f-b62e-37637cd034da/finalize","host":"127.0.0.1:32869","remoteAddress":"127.0.0.1","remotePort":40040},"msg":"incoming request"}
{"level":30,"time":1794985802476,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":200},"responseTime":1.914305000000013,"msg":"request completed"}
{"level":30,"time":1794985802477,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=3aefb1e7-3560-4d8a-84f0-68cf3a17b612&page_size=200","host":"127.0.0.1:42785","remoteAddress":"127.0.0.1","remotePort":50526},"msg":"incoming request"}
{"level":30,"time":1794985802479,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":200},"responseTime":2.204250000000002,"msg":"request completed"}
{"level":30,"time":1794985802480,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:39191","remoteAddress":"127.0.0.1","remotePort":55626},"msg":"incoming request"}
{"level":30,"time":1794985802481,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":403},"responseTime":0.8700240000000008,"msg":"request completed"}
{"level":30,"time":1794985802482,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:46637","remoteAddress":"127.0.0.1","remotePort":46222},"msg":"incoming request"}
{"level":30,"time":1794985802485,"pid":263602,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":200},"responseTime":2.6320329999999785,"msg":"request completed"}
{"level":30,"time":1794985802747,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44007","remoteAddress":"127.0.0.1","remotePort":35072},"msg":"incoming request"}
{"level":30,"time":1794985802762,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":15.463522000000012,"msg":"request completed"}
{"level":30,"time":1794985802765,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/activation","host":"127.0.0.1:43677","remoteAddress":"127.0.0.1","remotePort":58114},"msg":"incoming request"}
{"level":30,"time":1794985802768,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":2.6271730000000275,"msg":"request completed"}
{"level":30,"time":1794985802769,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735","host":"127.0.0.1:32891","remoteAddress":"127.0.0.1","remotePort":56012},"msg":"incoming request"}
{"level":30,"time":1794985802771,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.1560289999999895,"msg":"request completed"}
{"level":30,"time":1794985802772,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/command-roles","host":"127.0.0.1:35327","remoteAddress":"127.0.0.1","remotePort":56722},"msg":"incoming request"}
{"level":30,"time":1794985802774,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.421146999999962,"msg":"request completed"}
{"level":30,"time":1794985802775,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/activation","host":"127.0.0.1:33765","remoteAddress":"127.0.0.1","remotePort":42092},"msg":"incoming request"}
{"level":30,"time":1794985802778,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":2.703448000000037,"msg":"request completed"}
{"level":30,"time":1794985802779,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/timeline","host":"127.0.0.1:42057","remoteAddress":"127.0.0.1","remotePort":53490},"msg":"incoming request"}
{"level":30,"time":1794985802781,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8961810000000128,"msg":"request completed"}
{"level":30,"time":1794985802782,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/activation","host":"127.0.0.1:33147","remoteAddress":"127.0.0.1","remotePort":39100},"msg":"incoming request"}
{"level":30,"time":1794985802783,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":400},"responseTime":0.9887870000000021,"msg":"request completed"}
{"level":30,"time":1794985802784,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735","host":"127.0.0.1:37909","remoteAddress":"127.0.0.1","remotePort":49754},"msg":"incoming request"}
{"level":30,"time":1794985802786,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9797680000000355,"msg":"request completed"}
{"level":30,"time":1794985802787,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/command-roles","host":"127.0.0.1:42621","remoteAddress":"127.0.0.1","remotePort":34210},"msg":"incoming request"}
{"level":30,"time":1794985802789,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.138986999999986,"msg":"request completed"}
{"level":30,"time":1794985802790,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/timeline","host":"127.0.0.1:37127","remoteAddress":"127.0.0.1","remotePort":53956},"msg":"incoming request"}
{"level":30,"time":1794985802792,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":1.6138910000000237,"msg":"request completed"}
{"level":30,"time":1794985802793,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/closure","host":"127.0.0.1:39243","remoteAddress":"127.0.0.1","remotePort":51584},"msg":"incoming request"}
{"level":30,"time":1794985802796,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":3.140578000000005,"msg":"request completed"}
{"level":30,"time":1794985802796,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/2e408975-5f50-4d15-bb35-2ce889160735/timeline","host":"127.0.0.1:34717","remoteAddress":"127.0.0.1","remotePort":35984},"msg":"incoming request"}
{"level":30,"time":1794985802798,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":200},"responseTime":1.4892970000000219,"msg":"request completed"}
{"level":30,"time":1794985802799,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44331","remoteAddress":"127.0.0.1","remotePort":45634},"msg":"incoming request"}
{"level":30,"time":1794985802802,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":201},"responseTime":2.812722000000008,"msg":"request completed"}
{"level":30,"time":1794985802803,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/3ac39ca6-91ed-4a4a-a8ea-2457be7df4f3/command-roles","host":"127.0.0.1:44567","remoteAddress":"127.0.0.1","remotePort":60332},"msg":"incoming request"}
{"level":30,"time":1794985802805,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.2995480000000157,"msg":"request completed"}
{"level":30,"time":1794985802806,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/3ac39ca6-91ed-4a4a-a8ea-2457be7df4f3/command-roles","host":"127.0.0.1:38895","remoteAddress":"127.0.0.1","remotePort":53384},"msg":"incoming request"}
{"level":30,"time":1794985802808,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":201},"responseTime":1.917692000000045,"msg":"request completed"}
{"level":30,"time":1794985802809,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/3ac39ca6-91ed-4a4a-a8ea-2457be7df4f3/timeline","host":"127.0.0.1:42211","remoteAddress":"127.0.0.1","remotePort":52334},"msg":"incoming request"}
{"level":30,"time":1794985802810,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7326029999999832,"msg":"request completed"}
{"level":30,"time":1794985802812,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39641","remoteAddress":"127.0.0.1","remotePort":38894},"msg":"incoming request"}
{"level":30,"time":1794985802814,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-h","res":{"statusCode":201},"responseTime":2.6274250000000166,"msg":"request completed"}
{"level":30,"time":1794985802815,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/92233b91-462b-4624-9d81-460ad92c7111/activation","host":"127.0.0.1:35953","remoteAddress":"127.0.0.1","remotePort":49396},"msg":"incoming request"}
{"level":30,"time":1794985802817,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-i","res":{"statusCode":404},"responseTime":1.7326739999999745,"msg":"request completed"}
{"level":30,"time":1794985802818,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/92233b91-462b-4624-9d81-460ad92c7111/command-roles","host":"127.0.0.1:41845","remoteAddress":"127.0.0.1","remotePort":57246},"msg":"incoming request"}
{"level":30,"time":1794985802819,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-j","res":{"statusCode":404},"responseTime":1.2033400000000256,"msg":"request completed"}
{"level":30,"time":1794985802820,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/92233b91-462b-4624-9d81-460ad92c7111/closure","host":"127.0.0.1:36093","remoteAddress":"127.0.0.1","remotePort":56938},"msg":"incoming request"}
{"level":30,"time":1794985802821,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-k","res":{"statusCode":404},"responseTime":0.99606,"msg":"request completed"}
{"level":30,"time":1794985802821,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/92233b91-462b-4624-9d81-460ad92c7111/activation","host":"127.0.0.1:38933","remoteAddress":"127.0.0.1","remotePort":40512},"msg":"incoming request"}
{"level":30,"time":1794985802823,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7068350000000123,"msg":"request completed"}
{"level":30,"time":1794985802824,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40447","remoteAddress":"127.0.0.1","remotePort":54648},"msg":"incoming request"}
{"level":30,"time":1794985802827,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-m","res":{"statusCode":201},"responseTime":2.812291000000016,"msg":"request completed"}
{"level":30,"time":1794985802827,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/c22d9ab7-ab9c-4efd-bd69-90fa7430a3ae/closure","host":"127.0.0.1:44483","remoteAddress":"127.0.0.1","remotePort":47026},"msg":"incoming request"}
{"level":30,"time":1794985802830,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-n","res":{"statusCode":200},"responseTime":2.77430099999998,"msg":"request completed"}
{"level":30,"time":1794985802831,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/c22d9ab7-ab9c-4efd-bd69-90fa7430a3ae/closure","host":"127.0.0.1:46359","remoteAddress":"127.0.0.1","remotePort":48016},"msg":"incoming request"}
{"level":30,"time":1794985802833,"pid":263612,"hostname":"pivota-sandbox-92886c5e","reqId":"req-o","res":{"statusCode":409},"responseTime":1.974608000000046,"msg":"request completed"}
{"level":30,"time":1794985803077,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42311","remoteAddress":"127.0.0.1","remotePort":51222},"msg":"incoming request"}
{"level":30,"time":1794985803089,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":11.925626999999992,"msg":"request completed"}
{"level":30,"time":1794985803092,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0/submit-review","host":"127.0.0.1:44479","remoteAddress":"127.0.0.1","remotePort":49322},"msg":"incoming request"}
{"level":30,"time":1794985803096,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":4.095421999999985,"msg":"request completed"}
{"level":30,"time":1794985803097,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0/review","host":"127.0.0.1:40837","remoteAddress":"127.0.0.1","remotePort":56922},"msg":"incoming request"}
{"level":30,"time":1794985803099,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":403},"responseTime":1.9683860000000095,"msg":"request completed"}
{"level":30,"time":1794985803100,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0","host":"127.0.0.1:42833","remoteAddress":"127.0.0.1","remotePort":41440},"msg":"incoming request"}
{"level":30,"time":1794985803102,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.094763999999998,"msg":"request completed"}
{"level":30,"time":1794985803103,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0/review","host":"127.0.0.1:46135","remoteAddress":"127.0.0.1","remotePort":33758},"msg":"incoming request"}
{"level":30,"time":1794985803107,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":4.023495999999966,"msg":"request completed"}
{"level":30,"time":1794985803108,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0","host":"127.0.0.1:41045","remoteAddress":"127.0.0.1","remotePort":58092},"msg":"incoming request"}
{"level":30,"time":1794985803110,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.1699649999999906,"msg":"request completed"}
{"level":30,"time":1794985803111,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0/sections/eec2734b-a6dd-44f5-ac5d-0be949ae43c6/link-tasks","host":"127.0.0.1:36849","remoteAddress":"127.0.0.1","remotePort":46302},"msg":"incoming request"}
{"level":30,"time":1794985803114,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":204},"responseTime":2.080948000000035,"msg":"request completed"}
{"level":30,"time":1794985803114,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0","host":"127.0.0.1:45563","remoteAddress":"127.0.0.1","remotePort":57636},"msg":"incoming request"}
{"level":30,"time":1794985803116,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.1612590000000296,"msg":"request completed"}
{"level":30,"time":1794985803118,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37713","remoteAddress":"127.0.0.1","remotePort":35772},"msg":"incoming request"}
{"level":30,"time":1794985803127,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":9.509809999999959,"msg":"request completed"}
{"level":30,"time":1794985803128,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/37558e74-b8b6-4d25-9f8a-75253acf30d0/materialize-tasks","host":"127.0.0.1:43781","remoteAddress":"127.0.0.1","remotePort":47252},"msg":"incoming request"}
{"level":30,"time":1794985803132,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":200},"responseTime":3.668880999999999,"msg":"request completed"}
{"level":30,"time":1794985803133,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=2f325410-13c2-42ea-bd71-7255fc315f0f","host":"127.0.0.1:33495","remoteAddress":"127.0.0.1","remotePort":38898},"msg":"incoming request"}
{"level":30,"time":1794985803135,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.1969460000000254,"msg":"request completed"}
{"level":30,"time":1794985803136,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:43495","remoteAddress":"127.0.0.1","remotePort":52516},"msg":"incoming request"}
{"level":30,"time":1794985803139,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":201},"responseTime":2.5353719999999953,"msg":"request completed"}
{"level":30,"time":1794985803140,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/494650e6-cab2-432b-b9ff-149d0f4496b6/review","host":"127.0.0.1:44499","remoteAddress":"127.0.0.1","remotePort":47758},"msg":"incoming request"}
{"level":30,"time":1794985803141,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":409},"responseTime":1.6518120000000067,"msg":"request completed"}
{"level":30,"time":1794985803142,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:45545","remoteAddress":"127.0.0.1","remotePort":42508},"msg":"incoming request"}
{"level":30,"time":1794985803145,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":201},"responseTime":2.39219300000002,"msg":"request completed"}
{"level":30,"time":1794985803146,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/9004db0e-296d-4102-b2d2-370409cbbe3f/submit-review","host":"127.0.0.1:35611","remoteAddress":"127.0.0.1","remotePort":37120},"msg":"incoming request"}
{"level":30,"time":1794985803147,"pid":263695,"hostname":"pivota-sandbox-92886c5e","reqId":"req-f","res":{"statusCode":422},"responseTime":1.4971009999999865,"msg":"request completed"}
{"level":30,"time":1794985803397,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:36461","remoteAddress":"127.0.0.1","remotePort":59922},"msg":"incoming request"}
{"level":30,"time":1794985803401,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":422},"responseTime":4.244792000000018,"msg":"request completed"}
{"level":30,"time":1794985803404,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37237","remoteAddress":"127.0.0.1","remotePort":33956},"msg":"incoming request"}
{"level":30,"time":1794985803406,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":422},"responseTime":1.6695449999999994,"msg":"request completed"}
{"level":30,"time":1794985803407,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:32827","remoteAddress":"127.0.0.1","remotePort":33840},"msg":"incoming request"}
{"level":30,"time":1794985803411,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":3.8054270000000088,"msg":"request completed"}
{"level":30,"time":1794985803412,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35657","remoteAddress":"127.0.0.1","remotePort":55228},"msg":"incoming request"}
{"level":30,"time":1794985803421,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":9.323229999999967,"msg":"request completed"}
{"level":30,"time":1794985803422,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46321","remoteAddress":"127.0.0.1","remotePort":52538},"msg":"incoming request"}
{"level":30,"time":1794985803424,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":201},"responseTime":2.2517390000000432,"msg":"request completed"}
{"level":30,"time":1794985803425,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/50d3c900-29b1-4004-99b1-d7cbc1eaed22/timeline","host":"127.0.0.1:44603","remoteAddress":"127.0.0.1","remotePort":49166},"msg":"incoming request"}
{"level":30,"time":1794985803427,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.000906999999984,"msg":"request completed"}
{"level":30,"time":1794985803429,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43389","remoteAddress":"127.0.0.1","remotePort":52504},"msg":"incoming request"}
{"level":30,"time":1794985803430,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":201},"responseTime":1.7562690000000316,"msg":"request completed"}
{"level":30,"time":1794985803431,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/aa872693-6966-4374-bbe8-b1669cfb795d/status","host":"127.0.0.1:34765","remoteAddress":"127.0.0.1","remotePort":58712},"msg":"incoming request"}
{"level":30,"time":1794985803433,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":409},"responseTime":1.5314970000000017,"msg":"request completed"}
{"level":30,"time":1794985803434,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33191","remoteAddress":"127.0.0.1","remotePort":57272},"msg":"incoming request"}
{"level":30,"time":1794985803436,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":201},"responseTime":2.26957299999998,"msg":"request completed"}
{"level":30,"time":1794985803437,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/3c8c8896-7ed7-49f4-adc5-e0de7e70eac8/status","host":"127.0.0.1:34307","remoteAddress":"127.0.0.1","remotePort":49804},"msg":"incoming request"}
{"level":30,"time":1794985803439,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":409},"responseTime":1.658996000000002,"msg":"request completed"}
{"level":30,"time":1794985803440,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/3c8c8896-7ed7-49f4-adc5-e0de7e70eac8/status","host":"127.0.0.1:35043","remoteAddress":"127.0.0.1","remotePort":35606},"msg":"incoming request"}
{"level":30,"time":1794985803442,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":2.4367369999999937,"msg":"request completed"}
{"level":30,"time":1794985803443,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/3c8c8896-7ed7-49f4-adc5-e0de7e70eac8/status","host":"127.0.0.1:42253","remoteAddress":"127.0.0.1","remotePort":35848},"msg":"incoming request"}
{"level":30,"time":1794985803444,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4586999999999648,"msg":"request completed"}
{"level":30,"time":1794985803445,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/3c8c8896-7ed7-49f4-adc5-e0de7e70eac8/status","host":"127.0.0.1:38561","remoteAddress":"127.0.0.1","remotePort":39006},"msg":"incoming request"}
{"level":30,"time":1794985803447,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":2.2808240000000524,"msg":"request completed"}
{"level":30,"time":1794985803448,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/3c8c8896-7ed7-49f4-adc5-e0de7e70eac8/status","host":"127.0.0.1:37035","remoteAddress":"127.0.0.1","remotePort":43662},"msg":"incoming request"}
{"level":30,"time":1794985803450,"pid":263706,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":2.1325749999999744,"msg":"request completed"}
{"level":30,"time":1794985803694,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:40261","remoteAddress":"127.0.0.1","remotePort":45038},"msg":"incoming request"}
{"level":30,"time":1794985803722,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":27.330598999999978,"msg":"request completed"}
{"level":30,"time":1794985803724,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:46519","remoteAddress":"127.0.0.1","remotePort":54586},"msg":"incoming request"}
{"level":30,"time":1794985803727,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.6782499999999914,"msg":"request completed"}
{"level":30,"time":1794985803728,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:37929","remoteAddress":"127.0.0.1","remotePort":50274},"msg":"incoming request"}
{"level":30,"time":1794985803730,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":400},"responseTime":1.5456230000000346,"msg":"request completed"}
{"level":30,"time":1794985803731,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42143","remoteAddress":"127.0.0.1","remotePort":55238},"msg":"incoming request"}
{"level":30,"time":1794985803734,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1021259999999984,"msg":"request completed"}
{"level":30,"time":1794985803736,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/a27ca06f-1b09-430c-be36-66394f65bdef/revoke","host":"127.0.0.1:46419","remoteAddress":"127.0.0.1","remotePort":47516},"msg":"incoming request"}
{"level":30,"time":1794985803738,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":204},"responseTime":2.4652999999999565,"msg":"request completed"}
{"level":30,"time":1794985803740,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36285","remoteAddress":"127.0.0.1","remotePort":51096},"msg":"incoming request"}
{"level":30,"time":1794985803742,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":2.001959999999997,"msg":"request completed"}
{"level":30,"time":1794985803743,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:36167","remoteAddress":"127.0.0.1","remotePort":55394},"msg":"incoming request"}
{"level":30,"time":1794985803745,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5287810000000377,"msg":"request completed"}
{"level":30,"time":1794985803746,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:46019","remoteAddress":"127.0.0.1","remotePort":56974},"msg":"incoming request"}
{"level":30,"time":1794985803748,"pid":263716,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8397950000000378,"msg":"request completed"}
{"level":30,"time":1794985803995,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:33797","remoteAddress":"127.0.0.1","remotePort":53936},"msg":"incoming request"}
{"level":30,"time":1794985804001,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":5.729500000000002,"msg":"request completed"}
{"level":30,"time":1794985804003,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:43597","remoteAddress":"127.0.0.1","remotePort":59756},"msg":"incoming request"}
{"level":30,"time":1794985804010,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":6.826349999999991,"msg":"request completed"}
{"level":30,"time":1794985804012,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36955","remoteAddress":"127.0.0.1","remotePort":35836},"msg":"incoming request"}
{"level":30,"time":1794985804014,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":1.8218919999999912,"msg":"request completed"}
{"level":30,"time":1794985804015,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/d9c65404-0311-437a-ae32-0cf853a49c53","host":"127.0.0.1:40497","remoteAddress":"127.0.0.1","remotePort":59336},"msg":"incoming request"}
{"level":30,"time":1794985804017,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":2.309457000000009,"msg":"request completed"}
{"level":30,"time":1794985804018,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:45027","remoteAddress":"127.0.0.1","remotePort":42714},"msg":"incoming request"}
{"level":30,"time":1794985804018,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":401},"responseTime":0.3956529999999816,"msg":"request completed"}
{"level":30,"time":1794985804019,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:35959","remoteAddress":"127.0.0.1","remotePort":47808},"msg":"incoming request"}
{"level":30,"time":1794985804021,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":403},"responseTime":0.9928939999999784,"msg":"request completed"}
{"level":30,"time":1794985804021,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/35463cbd-22bb-4519-9c32-cccf5e25bbb8","host":"127.0.0.1:37109","remoteAddress":"127.0.0.1","remotePort":34736},"msg":"incoming request"}
{"level":30,"time":1794985804025,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":3.415474999999958,"msg":"request completed"}
{"level":30,"time":1794985804026,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:42357","remoteAddress":"127.0.0.1","remotePort":46772},"msg":"incoming request"}
{"level":30,"time":1794985804028,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.5274969999999826,"msg":"request completed"}
{"level":30,"time":1794985804029,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=e2a212da-097a-48a7-a88c-55d34da0763f&page_size=50","host":"127.0.0.1:32823","remoteAddress":"127.0.0.1","remotePort":46444},"msg":"incoming request"}
{"level":30,"time":1794985804031,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.4352860000000192,"msg":"request completed"}
{"level":30,"time":1794985804032,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:37289","remoteAddress":"127.0.0.1","remotePort":52466},"msg":"incoming request"}
{"level":30,"time":1794985804034,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-a","res":{"statusCode":403},"responseTime":1.0742569999999887,"msg":"request completed"}
{"level":30,"time":1794985804035,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:38833","remoteAddress":"127.0.0.1","remotePort":52278},"msg":"incoming request"}
{"level":30,"time":1794985804036,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-b","res":{"statusCode":200},"responseTime":1.3482520000000022,"msg":"request completed"}
{"level":30,"time":1794985804037,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:42247","remoteAddress":"127.0.0.1","remotePort":47954},"msg":"incoming request"}
{"level":30,"time":1794985804039,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-c","res":{"statusCode":422},"responseTime":1.8410579999999754,"msg":"request completed"}
{"level":30,"time":1794985804040,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:35645","remoteAddress":"127.0.0.1","remotePort":33416},"msg":"incoming request"}
{"level":30,"time":1794985804041,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-d","res":{"statusCode":200},"responseTime":1.534902000000045,"msg":"request completed"}
{"level":30,"time":1794985804042,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=e2a212da-097a-48a7-a88c-55d34da0763f&action_type=record_view","host":"127.0.0.1:40031","remoteAddress":"127.0.0.1","remotePort":51740},"msg":"incoming request"}
{"level":30,"time":1794985804043,"pid":263726,"hostname":"pivota-sandbox-92886c5e","reqId":"req-e","res":{"statusCode":200},"responseTime":1.5598090000000298,"msg":"request completed"}
{"level":30,"time":1794985804285,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37257","remoteAddress":"127.0.0.1","remotePort":32816},"msg":"incoming request"}
{"level":30,"time":1794985804300,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.97012699999999,"msg":"request completed"}
{"level":30,"time":1794985804303,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46513","remoteAddress":"127.0.0.1","remotePort":43936},"msg":"incoming request"}
{"level":30,"time":1794985804306,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":201},"responseTime":3.5207429999999817,"msg":"request completed"}
{"level":30,"time":1794985804307,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:39543","remoteAddress":"127.0.0.1","remotePort":40608},"msg":"incoming request"}
{"level":30,"time":1794985804311,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.3021320000000287,"msg":"request completed"}
{"level":30,"time":1794985804312,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39431","remoteAddress":"127.0.0.1","remotePort":35932},"msg":"incoming request"}
{"level":30,"time":1794985804315,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":201},"responseTime":2.5509310000000482,"msg":"request completed"}
{"level":30,"time":1794985804316,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:34547","remoteAddress":"127.0.0.1","remotePort":39166},"msg":"incoming request"}
{"level":30,"time":1794985804318,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.7523710000000392,"msg":"request completed"}
{"level":30,"time":1794985804319,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:46875","remoteAddress":"127.0.0.1","remotePort":34472},"msg":"incoming request"}
{"level":30,"time":1794985804321,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7555269999999723,"msg":"request completed"}
{"level":30,"time":1794985804322,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:40463","remoteAddress":"127.0.0.1","remotePort":45486},"msg":"incoming request"}
{"level":30,"time":1794985804324,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.7240879999999947,"msg":"request completed"}
{"level":30,"time":1794985804325,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:38435","remoteAddress":"127.0.0.1","remotePort":43052},"msg":"incoming request"}
{"level":30,"time":1794985804327,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":2.006498000000022,"msg":"request completed"}
{"level":30,"time":1794985804328,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45707","remoteAddress":"127.0.0.1","remotePort":47066},"msg":"incoming request"}
{"level":30,"time":1794985804329,"pid":263736,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5266579999999976,"msg":"request completed"}
{"level":30,"time":1794985804573,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32971","remoteAddress":"127.0.0.1","remotePort":37580},"msg":"incoming request"}
{"level":30,"time":1794985804586,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.167720000000003,"msg":"request completed"}
{"level":30,"time":1794985804592,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/d80e4fe6-e8c0-463a-b69e-839c364cebac/timeline","host":"127.0.0.1:46533","remoteAddress":"127.0.0.1","remotePort":36174},"msg":"incoming request"}
{"level":30,"time":1794985804595,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.646070000000009,"msg":"request completed"}
{"level":30,"time":1794985804599,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46223","remoteAddress":"127.0.0.1","remotePort":48396},"msg":"incoming request"}
{"level":30,"time":1794985804602,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.9521139999999946,"msg":"request completed"}
{"level":30,"time":1794985804603,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/65091ffd-2837-4d80-81bd-0d62b60e89e0/closure","host":"127.0.0.1:39361","remoteAddress":"127.0.0.1","remotePort":57184},"msg":"incoming request"}
{"level":30,"time":1794985804607,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":3.4327669999999557,"msg":"request completed"}
{"level":30,"time":1794985804608,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/65091ffd-2837-4d80-81bd-0d62b60e89e0/timeline","host":"127.0.0.1:39199","remoteAddress":"127.0.0.1","remotePort":41644},"msg":"incoming request"}
{"level":30,"time":1794985804610,"pid":263746,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.887453999999991,"msg":"request completed"}
{"level":30,"time":1794985804892,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44145","remoteAddress":"127.0.0.1","remotePort":56508},"msg":"incoming request"}
{"level":30,"time":1794985804897,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":4.888740999999982,"msg":"request completed"}
{"level":30,"time":1794985804899,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43203","remoteAddress":"127.0.0.1","remotePort":55932},"msg":"incoming request"}
{"level":30,"time":1794985804899,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18261300000000347,"msg":"request completed"}
{"level":30,"time":1794985804901,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:38523","remoteAddress":"127.0.0.1","remotePort":52842},"msg":"incoming request"}
{"level":30,"time":1794985804904,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8435099999999807,"msg":"request completed"}
{"level":30,"time":1794985804905,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:37989","remoteAddress":"127.0.0.1","remotePort":47256},"msg":"incoming request"}
{"level":30,"time":1794985804907,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.932029,"msg":"request completed"}
{"level":30,"time":1794985804908,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36829","remoteAddress":"127.0.0.1","remotePort":48426},"msg":"incoming request"}
{"level":30,"time":1794985804910,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.7743919999999775,"msg":"request completed"}
{"level":30,"time":1794985804911,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42929","remoteAddress":"127.0.0.1","remotePort":37152},"msg":"incoming request"}
{"level":30,"time":1794985804911,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.455566000000033,"msg":"request completed"}
{"level":30,"time":1794985804913,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:45135","remoteAddress":"127.0.0.1","remotePort":56906},"msg":"incoming request"}
{"level":30,"time":1794985804914,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.548217999999963,"msg":"request completed"}
{"level":30,"time":1794985804915,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:45869","remoteAddress":"127.0.0.1","remotePort":48808},"msg":"incoming request"}
{"level":30,"time":1794985804916,"pid":263756,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":1.0175100000000157,"msg":"request completed"}

 Test Files  13 passed (13)
      Tests  67 passed (67)
   Start at  07:10:00
   Duration  4.79s (transform 157ms, setup 38ms, import 1.87s, tests 2.18s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 87[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 112[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 72[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 115[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 154[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 100[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 07:10:05
[2m   Duration [22m 2.24s[2m (transform 201ms, setup 259ms, collect 758ms, tests 640ms, environment 1.34s, prepare 271ms)[22m
```


## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=0 build_cmd=[npm run build] test_cmd=[npm test] head=bed7fe21672ec194dd5e4de40ce6e28fc689bc42 test_files=34 skip_marks=0 shadow_files=0 untested=0
{"level":30,"time":1794990604306,"pid":467467,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5432670000000144,"msg":"request completed"}
{"level":30,"time":1794990604307,"pid":467467,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:43445","remoteAddress":"127.0.0.1","remotePort":55342},"msg":"incoming request"}
{"level":30,"time":1794990604309,"pid":467467,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9017509999999902,"msg":"request completed"}
{"level":30,"time":1794990604310,"pid":467467,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45983","remoteAddress":"127.0.0.1","remotePort":47340},"msg":"incoming request"}
{"level":30,"time":1794990604312,"pid":467467,"hostname":"pivota-sandbox-92886c5e","reqId":"req-9","res":{"statusCode":200},"responseTime":1.4302350000000388,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/operating-picture.test.ts [2m([22m[2m5 tests[22m[2m)[22m[32m 104[2mms[22m[39m
{"level":30,"time":1794990604570,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43339","remoteAddress":"127.0.0.1","remotePort":52920},"msg":"incoming request"}
{"level":30,"time":1794990604584,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":201},"responseTime":13.494793999999985,"msg":"request completed"}
{"level":30,"time":1794990604590,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/243e174e-e7cc-446c-b0b8-0d85ab153f33/timeline","host":"127.0.0.1:37901","remoteAddress":"127.0.0.1","remotePort":47812},"msg":"incoming request"}
{"level":30,"time":1794990604593,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":200},"responseTime":2.8835240000000226,"msg":"request completed"}
{"level":30,"time":1794990604597,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34573","remoteAddress":"127.0.0.1","remotePort":39352},"msg":"incoming request"}
{"level":30,"time":1794990604600,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":201},"responseTime":2.8427669999999807,"msg":"request completed"}
{"level":30,"time":1794990604601,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/681b4fd4-e8bd-4340-8e31-4cc034d77032/closure","host":"127.0.0.1:33743","remoteAddress":"127.0.0.1","remotePort":49954},"msg":"incoming request"}
{"level":30,"time":1794990604604,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":3.427525000000003,"msg":"request completed"}
{"level":30,"time":1794990604605,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/681b4fd4-e8bd-4340-8e31-4cc034d77032/timeline","host":"127.0.0.1:45235","remoteAddress":"127.0.0.1","remotePort":47454},"msg":"incoming request"}
{"level":30,"time":1794990604607,"pid":467477,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5633449999999698,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/overdue-sweep.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 98[2mms[22m[39m
{"level":30,"time":1794990604847,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39531","remoteAddress":"127.0.0.1","remotePort":33276},"msg":"incoming request"}
{"level":30,"time":1794990604852,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-1","res":{"statusCode":200},"responseTime":4.944401999999997,"msg":"request completed"}
{"level":30,"time":1794990604855,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:41431","remoteAddress":"127.0.0.1","remotePort":42820},"msg":"incoming request"}
{"level":30,"time":1794990604855,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19916399999999612,"msg":"request completed"}
{"level":30,"time":1794990604857,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:45261","remoteAddress":"127.0.0.1","remotePort":33578},"msg":"incoming request"}
{"level":30,"time":1794990604861,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-3","res":{"statusCode":200},"responseTime":3.423778000000027,"msg":"request completed"}
{"level":30,"time":1794990604861,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39769","remoteAddress":"127.0.0.1","remotePort":58234},"msg":"incoming request"}
{"level":30,"time":1794990604863,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-4","res":{"statusCode":200},"responseTime":1.7535120000000006,"msg":"request completed"}
{"level":30,"time":1794990604864,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:34881","remoteAddress":"127.0.0.1","remotePort":50070},"msg":"incoming request"}
{"level":30,"time":1794990604866,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-5","res":{"statusCode":200},"responseTime":1.505406999999991,"msg":"request completed"}
{"level":30,"time":1794990604867,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33703","remoteAddress":"127.0.0.1","remotePort":42246},"msg":"incoming request"}
{"level":30,"time":1794990604867,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-6","res":{"statusCode":401},"responseTime":0.45739900000000944,"msg":"request completed"}
{"level":30,"time":1794990604869,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:39533","remoteAddress":"127.0.0.1","remotePort":37678},"msg":"incoming request"}
{"level":30,"time":1794990604870,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4337319999999636,"msg":"request completed"}
{"level":30,"time":1794990604871,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:46267","remoteAddress":"127.0.0.1","remotePort":50878},"msg":"incoming request"}
{"level":30,"time":1794990604872,"pid":467526,"hostname":"pivota-sandbox-92886c5e","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9359670000000051,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/routes.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 85[2mms[22m[39m

[2m Test Files [22m [1m[32m13 passed[39m[22m[90m (13)[39m
[2m      Tests [22m [1m[32m67 passed[39m[22m[90m (67)[39m
[2m   Start at [22m 08:30:00
[2m   Duration [22m 4.64s[2m (transform 144ms, setup 33ms, import 1.82s, tests 2.11s, environment 1ms)[22m

```

## Wave 6

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3 — env not up at first attempt (docker compose stack not started in this sandbox session) - started db/nats/opa/keycloak, ran migrate+seed, re-ran gate clean; 70/70 backend tests + 51/51 design-system tests passed

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
[32m✓ built in 192ms[39m

> @epmp/app@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 139 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  1.38 kB[22m[1m[22m[2m │ gzip:   0.80 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-D2bto9tI.css  [39m[1m[2m 48.76 kB[22m[1m[22m[2m │ gzip:   8.01 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-fdwtm9pg.js   [39m[1m[2m481.52 kB[22m[1m[22m[2m │ gzip: 138.01 kB[22m
[32m✓ built in 909ms[39m

> @epmp/backend@0.1.0 test
> vitest run


 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1795006647852,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:34271","remoteAddress":"127.0.0.1","remotePort":40826},"msg":"incoming request"}
{"level":30,"time":1795006647879,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":27.014933000000042,"msg":"request completed"}
{"level":30,"time":1795006647882,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:39785","remoteAddress":"127.0.0.1","remotePort":51828},"msg":"incoming request"}
{"level":30,"time":1795006647885,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":3.5663059999999973,"msg":"request completed"}
{"level":30,"time":1795006647887,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:42263","remoteAddress":"127.0.0.1","remotePort":39706},"msg":"incoming request"}
{"level":30,"time":1795006647888,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":400},"responseTime":1.5831919999999968,"msg":"request completed"}
{"level":30,"time":1795006647889,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:44131","remoteAddress":"127.0.0.1","remotePort":37736},"msg":"incoming request"}
{"level":30,"time":1795006647893,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":3.055357000000015,"msg":"request completed"}
{"level":30,"time":1795006647894,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/0d7f2270-193e-40eb-acc5-619f869c2481/revoke","host":"127.0.0.1:36729","remoteAddress":"127.0.0.1","remotePort":39540},"msg":"incoming request"}
{"level":30,"time":1795006647896,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":204},"responseTime":2.3218990000000304,"msg":"request completed"}
{"level":30,"time":1795006647898,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:35741","remoteAddress":"127.0.0.1","remotePort":56516},"msg":"incoming request"}
{"level":30,"time":1795006647900,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":1.9735360000000242,"msg":"request completed"}
{"level":30,"time":1795006647901,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43381","remoteAddress":"127.0.0.1","remotePort":47124},"msg":"incoming request"}
{"level":30,"time":1795006647902,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":1.3173039999999787,"msg":"request completed"}
{"level":30,"time":1795006647903,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:43559","remoteAddress":"127.0.0.1","remotePort":42846},"msg":"incoming request"}
{"level":30,"time":1795006647905,"pid":324459,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":1.6736620000000357,"msg":"request completed"}
{"level":30,"time":1795006648149,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46131","remoteAddress":"127.0.0.1","remotePort":60598},"msg":"incoming request"}
{"level":30,"time":1795006648154,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":200},"responseTime":4.786767999999995,"msg":"request completed"}
{"level":30,"time":1795006648156,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:33355","remoteAddress":"127.0.0.1","remotePort":44152},"msg":"incoming request"}
{"level":30,"time":1795006648157,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18442600000000198,"msg":"request completed"}
{"level":30,"time":1795006648158,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:37025","remoteAddress":"127.0.0.1","remotePort":45286},"msg":"incoming request"}
{"level":30,"time":1795006648161,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":200},"responseTime":2.627794999999992,"msg":"request completed"}
{"level":30,"time":1795006648162,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46605","remoteAddress":"127.0.0.1","remotePort":59658},"msg":"incoming request"}
{"level":30,"time":1795006648163,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":200},"responseTime":1.6553479999999752,"msg":"request completed"}
{"level":30,"time":1795006648164,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40385","remoteAddress":"127.0.0.1","remotePort":56718},"msg":"incoming request"}
{"level":30,"time":1795006648166,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4831950000000234,"msg":"request completed"}
{"level":30,"time":1795006648167,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38691","remoteAddress":"127.0.0.1","remotePort":60100},"msg":"incoming request"}
{"level":30,"time":1795006648167,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":401},"responseTime":0.37617599999998674,"msg":"request completed"}
{"level":30,"time":1795006648169,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:39537","remoteAddress":"127.0.0.1","remotePort":49316},"msg":"incoming request"}
{"level":30,"time":1795006648170,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5835730000000012,"msg":"request completed"}
{"level":30,"time":1795006648171,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:36349","remoteAddress":"127.0.0.1","remotePort":52874},"msg":"incoming request"}
{"level":30,"time":1795006648172,"pid":324487,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9045079999999643,"msg":"request completed"}
{"level":30,"time":1795006648426,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:38375","remoteAddress":"127.0.0.1","remotePort":36466},"msg":"incoming request"}
{"level":30,"time":1795006648473,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":46.79539299999999,"msg":"request completed"}
{"level":30,"time":1795006648477,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36087","remoteAddress":"127.0.0.1","remotePort":60178},"msg":"incoming request"}
{"level":30,"time":1795006648487,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":201},"responseTime":10.68976200000003,"msg":"request completed"}
{"level":30,"time":1795006648489,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37999","remoteAddress":"127.0.0.1","remotePort":36460},"msg":"incoming request"}
{"level":30,"time":1795006648494,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":4.753656000000035,"msg":"request completed"}
{"level":30,"time":1795006648496,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/863e052d-435c-4e00-9c51-f37d2c24320b/decline","host":"127.0.0.1:36639","remoteAddress":"127.0.0.1","remotePort":41106},"msg":"incoming request"}
{"level":30,"time":1795006648498,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":422},"responseTime":1.771345999999994,"msg":"request completed"}
{"level":30,"time":1795006648500,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=01ea1815-c808-46a0-8166-3d48bbc50342","host":"127.0.0.1:41607","remoteAddress":"127.0.0.1","remotePort":52852},"msg":"incoming request"}
{"level":30,"time":1795006648502,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":2.2662750000000074,"msg":"request completed"}
{"level":30,"time":1795006648504,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/863e052d-435c-4e00-9c51-f37d2c24320b/decline","host":"127.0.0.1:35711","remoteAddress":"127.0.0.1","remotePort":55452},"msg":"incoming request"}
{"level":30,"time":1795006648507,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":3.569992999999954,"msg":"request completed"}
{"level":30,"time":1795006648508,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/01ea1815-c808-46a0-8166-3d48bbc50342/timeline","host":"127.0.0.1:41483","remoteAddress":"127.0.0.1","remotePort":56838},"msg":"incoming request"}
{"level":30,"time":1795006648512,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":3.9724489999999832,"msg":"request completed"}
{"level":30,"time":1795006648514,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37747","remoteAddress":"127.0.0.1","remotePort":44024},"msg":"incoming request"}
{"level":30,"time":1795006648519,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":201},"responseTime":4.8077970000000505,"msg":"request completed"}
{"level":30,"time":1795006648520,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:45541","remoteAddress":"127.0.0.1","remotePort":44998},"msg":"incoming request"}
{"level":30,"time":1795006648524,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":201},"responseTime":4.111448999999993,"msg":"request completed"}
{"level":30,"time":1795006648526,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/90390d5a-03c6-47da-9ea9-86d3c179f95e/approve","host":"127.0.0.1:37537","remoteAddress":"127.0.0.1","remotePort":53134},"msg":"incoming request"}
{"level":30,"time":1795006648529,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":200},"responseTime":3.32757799999996,"msg":"request completed"}
{"level":30,"time":1795006648530,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/90390d5a-03c6-47da-9ea9-86d3c179f95e/fulfill","host":"127.0.0.1:42871","remoteAddress":"127.0.0.1","remotePort":43742},"msg":"incoming request"}
{"level":30,"time":1795006648533,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":200},"responseTime":2.7046580000000517,"msg":"request completed"}
{"level":30,"time":1795006648534,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/90390d5a-03c6-47da-9ea9-86d3c179f95e/fulfill","host":"127.0.0.1:41597","remoteAddress":"127.0.0.1","remotePort":48666},"msg":"incoming request"}
{"level":30,"time":1795006648538,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":200},"responseTime":3.705848000000003,"msg":"request completed"}
{"level":30,"time":1795006648540,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/0ac187a8-684b-4c49-952a-d45d1fb49d99/timeline","host":"127.0.0.1:38269","remoteAddress":"127.0.0.1","remotePort":57278},"msg":"incoming request"}
{"level":30,"time":1795006648546,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":200},"responseTime":6.685221999999953,"msg":"request completed"}
{"level":30,"time":1795006648548,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39619","remoteAddress":"127.0.0.1","remotePort":52364},"msg":"incoming request"}
{"level":30,"time":1795006648551,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":201},"responseTime":3.072088000000008,"msg":"request completed"}
{"level":30,"time":1795006648552,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:37333","remoteAddress":"127.0.0.1","remotePort":44510},"msg":"incoming request"}
{"level":30,"time":1795006648553,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":422},"responseTime":0.9311890000000176,"msg":"request completed"}
{"level":30,"time":1795006648554,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36503","remoteAddress":"127.0.0.1","remotePort":45184},"msg":"incoming request"}
{"level":30,"time":1795006648556,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-g","res":{"statusCode":201},"responseTime":2.1227360000000317,"msg":"request completed"}
{"level":30,"time":1795006648557,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:43479","remoteAddress":"127.0.0.1","remotePort":53656},"msg":"incoming request"}
{"level":30,"time":1795006648558,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-h","res":{"statusCode":201},"responseTime":1.9295640000000276,"msg":"request completed"}
{"level":30,"time":1795006648559,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/758799ab-f19d-4125-bf88-b965fc4ce726/fulfill","host":"127.0.0.1:43447","remoteAddress":"127.0.0.1","remotePort":45372},"msg":"incoming request"}
{"level":30,"time":1795006648561,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-i","res":{"statusCode":409},"responseTime":1.3192870000000312,"msg":"request completed"}
{"level":30,"time":1795006648562,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/758799ab-f19d-4125-bf88-b965fc4ce726/approve","host":"127.0.0.1:46589","remoteAddress":"127.0.0.1","remotePort":43050},"msg":"incoming request"}
{"level":30,"time":1795006648563,"pid":324501,"hostname":"pivota-sandbox-13637243","reqId":"req-j","res":{"statusCode":409},"responseTime":1.5328979999999888,"msg":"request completed"}
{"level":30,"time":1795006648811,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:46841","remoteAddress":"127.0.0.1","remotePort":59528},"msg":"incoming request"}
{"level":30,"time":1795006648817,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":5.637214999999998,"msg":"request completed"}
{"level":30,"time":1795006648820,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:34269","remoteAddress":"127.0.0.1","remotePort":50250},"msg":"incoming request"}
{"level":30,"time":1795006648823,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":3.8492569999999944,"msg":"request completed"}
{"level":30,"time":1795006648825,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42299","remoteAddress":"127.0.0.1","remotePort":59026},"msg":"incoming request"}
{"level":30,"time":1795006648827,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":200},"responseTime":1.9815209999999865,"msg":"request completed"}
{"level":30,"time":1795006648828,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/a4b21b48-7533-4c2f-8081-77087eface04","host":"127.0.0.1:45279","remoteAddress":"127.0.0.1","remotePort":33744},"msg":"incoming request"}
{"level":30,"time":1795006648830,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":200},"responseTime":2.424722000000031,"msg":"request completed"}
{"level":30,"time":1795006648831,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42339","remoteAddress":"127.0.0.1","remotePort":38246},"msg":"incoming request"}
{"level":30,"time":1795006648832,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":401},"responseTime":0.44611800000001267,"msg":"request completed"}
{"level":30,"time":1795006648833,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:33069","remoteAddress":"127.0.0.1","remotePort":51796},"msg":"incoming request"}
{"level":30,"time":1795006648834,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":403},"responseTime":1.065150000000017,"msg":"request completed"}
{"level":30,"time":1795006648835,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/64819ac3-7a3e-4e08-9a9a-eb75da964654","host":"127.0.0.1:32803","remoteAddress":"127.0.0.1","remotePort":50420},"msg":"incoming request"}
{"level":30,"time":1795006648838,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":3.109207999999967,"msg":"request completed"}
{"level":30,"time":1795006648839,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:40019","remoteAddress":"127.0.0.1","remotePort":54704},"msg":"incoming request"}
{"level":30,"time":1795006648841,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":2.4712200000000166,"msg":"request completed"}
{"level":30,"time":1795006648842,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=ccb091e6-1ac1-4b7c-9436-fc96d3aa43ad&page_size=50","host":"127.0.0.1:42537","remoteAddress":"127.0.0.1","remotePort":50144},"msg":"incoming request"}
{"level":30,"time":1795006648844,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5847160000000144,"msg":"request completed"}
{"level":30,"time":1795006648846,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:34319","remoteAddress":"127.0.0.1","remotePort":35670},"msg":"incoming request"}
{"level":30,"time":1795006648847,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":403},"responseTime":1.2910939999999869,"msg":"request completed"}
{"level":30,"time":1795006648848,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:37105","remoteAddress":"127.0.0.1","remotePort":39050},"msg":"incoming request"}
{"level":30,"time":1795006648850,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":200},"responseTime":1.5132019999999784,"msg":"request completed"}
{"level":30,"time":1795006648851,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:40183","remoteAddress":"127.0.0.1","remotePort":59076},"msg":"incoming request"}
{"level":30,"time":1795006648852,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":422},"responseTime":1.8213399999999638,"msg":"request completed"}
{"level":30,"time":1795006648853,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:38827","remoteAddress":"127.0.0.1","remotePort":59818},"msg":"incoming request"}
{"level":30,"time":1795006648855,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5074510000000032,"msg":"request completed"}
{"level":30,"time":1795006648856,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=ccb091e6-1ac1-4b7c-9436-fc96d3aa43ad&action_type=record_view","host":"127.0.0.1:34467","remoteAddress":"127.0.0.1","remotePort":38448},"msg":"incoming request"}
{"level":30,"time":1795006648857,"pid":324513,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":200},"responseTime":1.4055490000000077,"msg":"request completed"}
{"level":30,"time":1795006649102,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:41869","remoteAddress":"127.0.0.1","remotePort":37536},"msg":"incoming request"}
{"level":30,"time":1795006649106,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":403},"responseTime":3.673248000000001,"msg":"request completed"}
{"level":30,"time":1795006649109,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:36037","remoteAddress":"127.0.0.1","remotePort":58796},"msg":"incoming request"}
{"level":30,"time":1795006649111,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":403},"responseTime":1.7655949999999905,"msg":"request completed"}
{"level":30,"time":1795006649112,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:43523","remoteAddress":"127.0.0.1","remotePort":44526},"msg":"incoming request"}
{"level":30,"time":1795006649114,"pid":324523,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":200},"responseTime":1.4600010000000054,"msg":"request completed"}
{"level":30,"time":1795006649359,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39649","remoteAddress":"127.0.0.1","remotePort":44556},"msg":"incoming request"}
{"level":30,"time":1795006649372,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":13.520336000000015,"msg":"request completed"}
{"level":30,"time":1795006649375,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41467","remoteAddress":"127.0.0.1","remotePort":46716},"msg":"incoming request"}
{"level":30,"time":1795006649379,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":201},"responseTime":4.288582000000019,"msg":"request completed"}
{"level":30,"time":1795006649380,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/bc23646e-5819-4774-96d8-c7f3ca7f533e/sitreps","host":"127.0.0.1:32843","remoteAddress":"127.0.0.1","remotePort":43382},"msg":"incoming request"}
{"level":30,"time":1795006649384,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":3.9624900000000025,"msg":"request completed"}
{"level":30,"time":1795006649386,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33777","remoteAddress":"127.0.0.1","remotePort":43638},"msg":"incoming request"}
{"level":30,"time":1795006649389,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":3.1964720000000284,"msg":"request completed"}
{"level":30,"time":1795006649390,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/6aa64c33-fd5c-4c18-9c42-ea74fa8094df/aar","host":"127.0.0.1:39369","remoteAddress":"127.0.0.1","remotePort":41722},"msg":"incoming request"}
{"level":30,"time":1795006649392,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":409},"responseTime":1.6435460000000148,"msg":"request completed"}
{"level":30,"time":1795006649393,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/6aa64c33-fd5c-4c18-9c42-ea74fa8094df/closure","host":"127.0.0.1:40499","remoteAddress":"127.0.0.1","remotePort":51048},"msg":"incoming request"}
{"level":30,"time":1795006649397,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":3.5401070000000345,"msg":"request completed"}
{"level":30,"time":1795006649398,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/6aa64c33-fd5c-4c18-9c42-ea74fa8094df/aar","host":"127.0.0.1:33741","remoteAddress":"127.0.0.1","remotePort":56808},"msg":"incoming request"}
{"level":30,"time":1795006649401,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":201},"responseTime":3.0395670000000337,"msg":"request completed"}
{"level":30,"time":1795006649402,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35351","remoteAddress":"127.0.0.1","remotePort":42614},"msg":"incoming request"}
{"level":30,"time":1795006649404,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":201},"responseTime":2.3592499999999745,"msg":"request completed"}
{"level":30,"time":1795006649405,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/549df38b-7517-4d6e-98d1-c53eb2a5e8b3/closure","host":"127.0.0.1:38151","remoteAddress":"127.0.0.1","remotePort":37542},"msg":"incoming request"}
{"level":30,"time":1795006649408,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":200},"responseTime":2.589492000000007,"msg":"request completed"}
{"level":30,"time":1795006649409,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/549df38b-7517-4d6e-98d1-c53eb2a5e8b3/aar","host":"127.0.0.1:45631","remoteAddress":"127.0.0.1","remotePort":40178},"msg":"incoming request"}
{"level":30,"time":1795006649410,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":422},"responseTime":1.2427529999999933,"msg":"request completed"}
{"level":30,"time":1795006649411,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40363","remoteAddress":"127.0.0.1","remotePort":37462},"msg":"incoming request"}
{"level":30,"time":1795006649413,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":201},"responseTime":2.2443739999999934,"msg":"request completed"}
{"level":30,"time":1795006649414,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/41874341-aaf4-49c1-addc-b11942163345/closure","host":"127.0.0.1:41221","remoteAddress":"127.0.0.1","remotePort":57778},"msg":"incoming request"}
{"level":30,"time":1795006649416,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":200},"responseTime":2.2924750000000245,"msg":"request completed"}
{"level":30,"time":1795006649417,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/41874341-aaf4-49c1-addc-b11942163345/aar","host":"127.0.0.1:44045","remoteAddress":"127.0.0.1","remotePort":38726},"msg":"incoming request"}
{"level":30,"time":1795006649419,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":201},"responseTime":2.4610000000000127,"msg":"request completed"}
{"level":30,"time":1795006649420,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/41874341-aaf4-49c1-addc-b11942163345/aar/6ceb055c-9157-416a-9bc7-e31f95486a25/finalize","host":"127.0.0.1:36021","remoteAddress":"127.0.0.1","remotePort":39478},"msg":"incoming request"}
{"level":30,"time":1795006649423,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":200},"responseTime":2.5571110000000203,"msg":"request completed"}
{"level":30,"time":1795006649424,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/41874341-aaf4-49c1-addc-b11942163345/aar/6ceb055c-9157-416a-9bc7-e31f95486a25/finalize","host":"127.0.0.1:42531","remoteAddress":"127.0.0.1","remotePort":39286},"msg":"incoming request"}
{"level":30,"time":1795006649425,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":403},"responseTime":1.3376010000000065,"msg":"request completed"}
{"level":30,"time":1795006649426,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37695","remoteAddress":"127.0.0.1","remotePort":56966},"msg":"incoming request"}
{"level":30,"time":1795006649428,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-g","res":{"statusCode":201},"responseTime":2.517296999999985,"msg":"request completed"}
{"level":30,"time":1795006649429,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/5a449a5c-2dfd-416e-a432-48d34ed7fb14/closure","host":"127.0.0.1:37671","remoteAddress":"127.0.0.1","remotePort":35398},"msg":"incoming request"}
{"level":30,"time":1795006649432,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-h","res":{"statusCode":200},"responseTime":3.0731509999999957,"msg":"request completed"}
{"level":30,"time":1795006649433,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/5a449a5c-2dfd-416e-a432-48d34ed7fb14/aar","host":"127.0.0.1:46683","remoteAddress":"127.0.0.1","remotePort":39438},"msg":"incoming request"}
{"level":30,"time":1795006649436,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-i","res":{"statusCode":201},"responseTime":2.5485949999999775,"msg":"request completed"}
{"level":30,"time":1795006649436,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/5a449a5c-2dfd-416e-a432-48d34ed7fb14/aar/426e164b-4627-4f22-a0ba-823697a542af/finalize","host":"127.0.0.1:40985","remoteAddress":"127.0.0.1","remotePort":56638},"msg":"incoming request"}
{"level":30,"time":1795006649438,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-j","res":{"statusCode":200},"responseTime":1.7560470000000237,"msg":"request completed"}
{"level":30,"time":1795006649439,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=ea84f2b8-9419-44bb-81b0-3ff37ed0d211&page_size=200","host":"127.0.0.1:40231","remoteAddress":"127.0.0.1","remotePort":58184},"msg":"incoming request"}
{"level":30,"time":1795006649442,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-k","res":{"statusCode":200},"responseTime":2.3526069999999777,"msg":"request completed"}
{"level":30,"time":1795006649442,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:39181","remoteAddress":"127.0.0.1","remotePort":37686},"msg":"incoming request"}
{"level":30,"time":1795006649443,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-l","res":{"statusCode":403},"responseTime":0.9007609999999886,"msg":"request completed"}
{"level":30,"time":1795006649444,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:35035","remoteAddress":"127.0.0.1","remotePort":53390},"msg":"incoming request"}
{"level":30,"time":1795006649447,"pid":324555,"hostname":"pivota-sandbox-13637243","reqId":"req-m","res":{"statusCode":200},"responseTime":2.368056000000024,"msg":"request completed"}
{"level":30,"time":1795006649713,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38361","remoteAddress":"127.0.0.1","remotePort":47988},"msg":"incoming request"}
{"level":30,"time":1795006649727,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":13.72235599999999,"msg":"request completed"}
{"level":30,"time":1795006649729,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/ff3665db-b8ff-4d5e-bbc4-ce84f28f4ec1/timeline","host":"127.0.0.1:43821","remoteAddress":"127.0.0.1","remotePort":58226},"msg":"incoming request"}
{"level":30,"time":1795006649733,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":4.034284000000014,"msg":"request completed"}
{"level":30,"time":1795006649735,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41493","remoteAddress":"127.0.0.1","remotePort":55314},"msg":"incoming request"}
{"level":30,"time":1795006649738,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":3.2134940000000256,"msg":"request completed"}
{"level":30,"time":1795006649739,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40433","remoteAddress":"127.0.0.1","remotePort":48286},"msg":"incoming request"}
{"level":30,"time":1795006649741,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":409},"responseTime":1.4077729999999633,"msg":"request completed"}
{"level":30,"time":1795006649741,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36245","remoteAddress":"127.0.0.1","remotePort":51610},"msg":"incoming request"}
{"level":30,"time":1795006649744,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":201},"responseTime":2.604159999999979,"msg":"request completed"}
{"level":30,"time":1795006649745,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42621","remoteAddress":"127.0.0.1","remotePort":36746},"msg":"incoming request"}
{"level":30,"time":1795006649748,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":201},"responseTime":2.45553000000001,"msg":"request completed"}
{"level":30,"time":1795006649749,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46077","remoteAddress":"127.0.0.1","remotePort":35968},"msg":"incoming request"}
{"level":30,"time":1795006649751,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":201},"responseTime":2.2785880000000134,"msg":"request completed"}
{"level":30,"time":1795006649752,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38115","remoteAddress":"127.0.0.1","remotePort":47494},"msg":"incoming request"}
{"level":30,"time":1795006649754,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":201},"responseTime":2.2990369999999984,"msg":"request completed"}
{"level":30,"time":1795006649756,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:36189","remoteAddress":"127.0.0.1","remotePort":49654},"msg":"incoming request"}
{"level":30,"time":1795006649758,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":200},"responseTime":1.82743099999999,"msg":"request completed"}
{"level":30,"time":1795006649759,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45343","remoteAddress":"127.0.0.1","remotePort":37780},"msg":"incoming request"}
{"level":30,"time":1795006649762,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":201},"responseTime":2.26534300000003,"msg":"request completed"}
{"level":30,"time":1795006649762,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/b12b6df0-74fb-4032-a299-5134f24ce4d7","host":"127.0.0.1:46523","remoteAddress":"127.0.0.1","remotePort":58074},"msg":"incoming request"}
{"level":30,"time":1795006649764,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":404},"responseTime":1.3729079999999954,"msg":"request completed"}
{"level":30,"time":1795006649765,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:36733","remoteAddress":"127.0.0.1","remotePort":46836},"msg":"incoming request"}
{"level":30,"time":1795006649766,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":200},"responseTime":1.661059000000023,"msg":"request completed"}
{"level":30,"time":1795006649767,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/b12b6df0-74fb-4032-a299-5134f24ce4d7","host":"127.0.0.1:36619","remoteAddress":"127.0.0.1","remotePort":51364},"msg":"incoming request"}
{"level":30,"time":1795006649769,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":404},"responseTime":1.3395759999999655,"msg":"request completed"}
{"level":30,"time":1795006649769,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/b12b6df0-74fb-4032-a299-5134f24ce4d7/timeline","host":"127.0.0.1:35367","remoteAddress":"127.0.0.1","remotePort":41762},"msg":"incoming request"}
{"level":30,"time":1795006649770,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":404},"responseTime":1.1867780000000039,"msg":"request completed"}
{"level":30,"time":1795006649771,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37577","remoteAddress":"127.0.0.1","remotePort":34348},"msg":"incoming request"}
{"level":30,"time":1795006649774,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":201},"responseTime":2.1022269999999708,"msg":"request completed"}
{"level":30,"time":1795006649783,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:46555","remoteAddress":"127.0.0.1","remotePort":49744},"msg":"incoming request"}
{"level":30,"time":1795006649792,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-g","res":{"statusCode":201},"responseTime":8.870376000000022,"msg":"request completed"}
{"level":30,"time":1795006649793,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:45063","remoteAddress":"127.0.0.1","remotePort":40704},"msg":"incoming request"}
{"level":30,"time":1795006649796,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-h","res":{"statusCode":201},"responseTime":3.257836999999995,"msg":"request completed"}
{"level":30,"time":1795006649797,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45635","remoteAddress":"127.0.0.1","remotePort":36966},"msg":"incoming request"}
{"level":30,"time":1795006649801,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-i","res":{"statusCode":201},"responseTime":3.2056690000000003,"msg":"request completed"}
{"level":30,"time":1795006649801,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:36731","remoteAddress":"127.0.0.1","remotePort":34612},"msg":"incoming request"}
{"level":40,"time":1795006649805,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795006649806,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-j","res":{"statusCode":201},"responseTime":4.704964999999959,"msg":"request completed"}
{"level":30,"time":1795006649807,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/cc8380a7-7d2d-4ff0-a1a1-f255985aaaac/approve","host":"127.0.0.1:39993","remoteAddress":"127.0.0.1","remotePort":51800},"msg":"incoming request"}
{"level":40,"time":1795006649809,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795006649809,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-k","res":{"statusCode":200},"responseTime":2.651087000000018,"msg":"request completed"}
{"level":30,"time":1795006649810,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:41441","remoteAddress":"127.0.0.1","remotePort":40180},"msg":"incoming request"}
{"level":30,"time":1795006649812,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-l","res":{"statusCode":200},"responseTime":1.7257099999999923,"msg":"request completed"}
{"level":30,"time":1795006649813,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37915","remoteAddress":"127.0.0.1","remotePort":58790},"msg":"incoming request"}
{"level":30,"time":1795006649814,"pid":324584,"hostname":"pivota-sandbox-13637243","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8772969999999987,"msg":"request completed"}
{"level":30,"time":1795006650068,"pid":324616,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:44589","remoteAddress":"127.0.0.1","remotePort":38754},"msg":"incoming request"}
{"level":30,"time":1795006650117,"pid":324616,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":48.717623,"msg":"request completed"}
{"level":30,"time":1795006650323,"pid":324616,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:39815","remoteAddress":"127.0.0.1","remotePort":55238},"msg":"incoming request"}
{"level":30,"time":1795006650327,"pid":324616,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":3.395264999999995,"msg":"request completed"}
{"level":30,"time":1795006650576,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:37315","remoteAddress":"127.0.0.1","remotePort":44772},"msg":"incoming request"}
{"level":30,"time":1795006650581,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":422},"responseTime":4.239079000000004,"msg":"request completed"}
{"level":30,"time":1795006650584,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:43311","remoteAddress":"127.0.0.1","remotePort":50574},"msg":"incoming request"}
{"level":30,"time":1795006650586,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":422},"responseTime":1.62525100000002,"msg":"request completed"}
{"level":30,"time":1795006650587,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40747","remoteAddress":"127.0.0.1","remotePort":58906},"msg":"incoming request"}
{"level":30,"time":1795006650590,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":3.660283000000021,"msg":"request completed"}
{"level":30,"time":1795006650591,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36237","remoteAddress":"127.0.0.1","remotePort":42748},"msg":"incoming request"}
{"level":30,"time":1795006650601,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":9.501440000000002,"msg":"request completed"}
{"level":30,"time":1795006650602,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:44747","remoteAddress":"127.0.0.1","remotePort":43946},"msg":"incoming request"}
{"level":30,"time":1795006650605,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":201},"responseTime":2.643242999999984,"msg":"request completed"}
{"level":30,"time":1795006650606,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/4388a816-4bc2-4216-9202-4c9fa3b926fe/timeline","host":"127.0.0.1:46075","remoteAddress":"127.0.0.1","remotePort":42260},"msg":"incoming request"}
{"level":30,"time":1795006650608,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":2.239675000000034,"msg":"request completed"}
{"level":30,"time":1795006650609,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33139","remoteAddress":"127.0.0.1","remotePort":45858},"msg":"incoming request"}
{"level":30,"time":1795006650611,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":201},"responseTime":2.1379839999999604,"msg":"request completed"}
{"level":30,"time":1795006650612,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/3be17f93-4c8b-4d4e-beee-50ee640b6ce3/status","host":"127.0.0.1:45295","remoteAddress":"127.0.0.1","remotePort":33456},"msg":"incoming request"}
{"level":30,"time":1795006650614,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":409},"responseTime":2.0099139999999807,"msg":"request completed"}
{"level":30,"time":1795006650616,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:33425","remoteAddress":"127.0.0.1","remotePort":56638},"msg":"incoming request"}
{"level":30,"time":1795006650619,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":201},"responseTime":3.0391559999999913,"msg":"request completed"}
{"level":30,"time":1795006650620,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/e50ab0a8-3439-4f50-8e07-b1ff36b2ba05/status","host":"127.0.0.1:38217","remoteAddress":"127.0.0.1","remotePort":36922},"msg":"incoming request"}
{"level":30,"time":1795006650622,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":409},"responseTime":1.6145120000000475,"msg":"request completed"}
{"level":30,"time":1795006650622,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/e50ab0a8-3439-4f50-8e07-b1ff36b2ba05/status","host":"127.0.0.1:36721","remoteAddress":"127.0.0.1","remotePort":51132},"msg":"incoming request"}
{"level":30,"time":1795006650625,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":200},"responseTime":2.4423760000000243,"msg":"request completed"}
{"level":30,"time":1795006650626,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/e50ab0a8-3439-4f50-8e07-b1ff36b2ba05/status","host":"127.0.0.1:39169","remoteAddress":"127.0.0.1","remotePort":36684},"msg":"incoming request"}
{"level":30,"time":1795006650627,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":409},"responseTime":1.4136540000000082,"msg":"request completed"}
{"level":30,"time":1795006650628,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/e50ab0a8-3439-4f50-8e07-b1ff36b2ba05/status","host":"127.0.0.1:35841","remoteAddress":"127.0.0.1","remotePort":35676},"msg":"incoming request"}
{"level":30,"time":1795006650630,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":200},"responseTime":2.3441510000000108,"msg":"request completed"}
{"level":30,"time":1795006650631,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/e50ab0a8-3439-4f50-8e07-b1ff36b2ba05/status","host":"127.0.0.1:43395","remoteAddress":"127.0.0.1","remotePort":49716},"msg":"incoming request"}
{"level":30,"time":1795006650633,"pid":324626,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":200},"responseTime":2.0486470000000168,"msg":"request completed"}
{"level":30,"time":1795006650884,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:45969","remoteAddress":"127.0.0.1","remotePort":51954},"msg":"incoming request"}
{"level":30,"time":1795006650888,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":422},"responseTime":4.433785,"msg":"request completed"}
{"level":30,"time":1795006650891,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:41335","remoteAddress":"127.0.0.1","remotePort":57400},"msg":"incoming request"}
{"level":30,"time":1795006650894,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":201},"responseTime":2.3901579999999853,"msg":"request completed"}
{"level":30,"time":1795006650895,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38455","remoteAddress":"127.0.0.1","remotePort":39166},"msg":"incoming request"}
{"level":30,"time":1795006650905,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":10.013149999999996,"msg":"request completed"}
{"level":30,"time":1795006650906,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:34193","remoteAddress":"127.0.0.1","remotePort":58020},"msg":"incoming request"}
{"level":30,"time":1795006650915,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":8.781567999999993,"msg":"request completed"}
{"level":30,"time":1795006650915,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/ee87ade3-3d3d-4f2e-9960-006e52bd966e/send","host":"127.0.0.1:38825","remoteAddress":"127.0.0.1","remotePort":33544},"msg":"incoming request"}
{"level":30,"time":1795006650917,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":403},"responseTime":1.659025999999983,"msg":"request completed"}
{"level":30,"time":1795006650918,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/ee87ade3-3d3d-4f2e-9960-006e52bd966e/send","host":"127.0.0.1:46231","remoteAddress":"127.0.0.1","remotePort":59794},"msg":"incoming request"}
{"level":30,"time":1795006650922,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":3.1778060000000323,"msg":"request completed"}
{"level":30,"time":1795006650923,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/eb333c0a-33be-4d1b-bb77-c976c73b8310/timeline","host":"127.0.0.1:37653","remoteAddress":"127.0.0.1","remotePort":34962},"msg":"incoming request"}
{"level":30,"time":1795006650925,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":2.075678000000039,"msg":"request completed"}
{"level":30,"time":1795006650926,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/ee87ade3-3d3d-4f2e-9960-006e52bd966e/delivery-status","host":"127.0.0.1:36301","remoteAddress":"127.0.0.1","remotePort":54400},"msg":"incoming request"}
{"level":30,"time":1795006650928,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9011699999999792,"msg":"request completed"}
{"level":30,"time":1795006650929,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:46433","remoteAddress":"127.0.0.1","remotePort":57246},"msg":"incoming request"}
{"level":30,"time":1795006650931,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":201},"responseTime":1.4782149999999774,"msg":"request completed"}
{"level":30,"time":1795006650932,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:36685","remoteAddress":"127.0.0.1","remotePort":35626},"msg":"incoming request"}
{"level":30,"time":1795006650934,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":201},"responseTime":1.773559999999975,"msg":"request completed"}
{"level":30,"time":1795006650934,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:44951","remoteAddress":"127.0.0.1","remotePort":39818},"msg":"incoming request"}
{"level":30,"time":1795006650937,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":201},"responseTime":2.9611909999999853,"msg":"request completed"}
{"level":30,"time":1795006650938,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/b07e7d21-fc2b-43ad-87a0-86b447c1fdca/send","host":"127.0.0.1:38667","remoteAddress":"127.0.0.1","remotePort":58698},"msg":"incoming request"}
{"level":30,"time":1795006650940,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":400},"responseTime":1.5215670000000046,"msg":"request completed"}
{"level":30,"time":1795006650940,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/44bedfb7-8db3-4e18-8c8f-d2cb0ec49175/approve","host":"127.0.0.1:32903","remoteAddress":"127.0.0.1","remotePort":49706},"msg":"incoming request"}
{"level":30,"time":1795006650942,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":200},"responseTime":1.4912500000000364,"msg":"request completed"}
{"level":30,"time":1795006650943,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/b07e7d21-fc2b-43ad-87a0-86b447c1fdca/send","host":"127.0.0.1:45439","remoteAddress":"127.0.0.1","remotePort":50846},"msg":"incoming request"}
{"level":30,"time":1795006650944,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":200},"responseTime":1.885930999999971,"msg":"request completed"}
{"level":30,"time":1795006650948,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:34429","remoteAddress":"127.0.0.1","remotePort":50828},"msg":"incoming request"}
{"level":30,"time":1795006650949,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":201},"responseTime":1.429132999999979,"msg":"request completed"}
{"level":30,"time":1795006650950,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:41265","remoteAddress":"127.0.0.1","remotePort":40770},"msg":"incoming request"}
{"level":30,"time":1795006650954,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-g","res":{"statusCode":201},"responseTime":3.579611,"msg":"request completed"}
{"level":30,"time":1795006650955,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/141b5f4e-5363-4b57-ba9a-b86c5bb4e3da/send","host":"127.0.0.1:40669","remoteAddress":"127.0.0.1","remotePort":50052},"msg":"incoming request"}
{"level":30,"time":1795006650957,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-h","res":{"statusCode":200},"responseTime":2.3207970000000273,"msg":"request completed"}
{"level":30,"time":1795006650958,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:44963","remoteAddress":"127.0.0.1","remotePort":44936},"msg":"incoming request"}
{"level":30,"time":1795006650962,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-i","res":{"statusCode":201},"responseTime":4.177314000000024,"msg":"request completed"}
{"level":30,"time":1795006650963,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/241d77ea-0aaf-4ae9-9dba-61033ff83542/send","host":"127.0.0.1:44189","remoteAddress":"127.0.0.1","remotePort":40760},"msg":"incoming request"}
{"level":30,"time":1795006650964,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-j","res":{"statusCode":403},"responseTime":1.1292300000000068,"msg":"request completed"}
{"level":30,"time":1795006650965,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:39625","remoteAddress":"127.0.0.1","remotePort":55712},"msg":"incoming request"}
{"level":30,"time":1795006650968,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-k","res":{"statusCode":200},"responseTime":2.7226719999999887,"msg":"request completed"}
{"level":30,"time":1795006650969,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:43119","remoteAddress":"127.0.0.1","remotePort":39258},"msg":"incoming request"}
{"level":30,"time":1795006650970,"pid":324645,"hostname":"pivota-sandbox-13637243","reqId":"req-l","res":{"statusCode":403},"responseTime":0.8679200000000264,"msg":"request completed"}
{"level":30,"time":1795006651221,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33065","remoteAddress":"127.0.0.1","remotePort":59496},"msg":"incoming request"}
{"level":30,"time":1795006651235,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":13.429936000000026,"msg":"request completed"}
{"level":30,"time":1795006651237,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/activation","host":"127.0.0.1:35753","remoteAddress":"127.0.0.1","remotePort":56304},"msg":"incoming request"}
{"level":30,"time":1795006651240,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":422},"responseTime":2.520893000000001,"msg":"request completed"}
{"level":30,"time":1795006651241,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774","host":"127.0.0.1:36491","remoteAddress":"127.0.0.1","remotePort":59170},"msg":"incoming request"}
{"level":30,"time":1795006651243,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":200},"responseTime":2.5351589999999646,"msg":"request completed"}
{"level":30,"time":1795006651244,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/command-roles","host":"127.0.0.1:41213","remoteAddress":"127.0.0.1","remotePort":36502},"msg":"incoming request"}
{"level":30,"time":1795006651247,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":2.9133810000000153,"msg":"request completed"}
{"level":30,"time":1795006651248,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/activation","host":"127.0.0.1:33917","remoteAddress":"127.0.0.1","remotePort":60034},"msg":"incoming request"}
{"level":30,"time":1795006651252,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":3.4028690000000097,"msg":"request completed"}
{"level":30,"time":1795006651252,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/timeline","host":"127.0.0.1:35401","remoteAddress":"127.0.0.1","remotePort":42828},"msg":"incoming request"}
{"level":30,"time":1795006651255,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":2.257158000000004,"msg":"request completed"}
{"level":30,"time":1795006651256,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/activation","host":"127.0.0.1:42265","remoteAddress":"127.0.0.1","remotePort":51500},"msg":"incoming request"}
{"level":30,"time":1795006651258,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":400},"responseTime":1.200174000000004,"msg":"request completed"}
{"level":30,"time":1795006651258,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774","host":"127.0.0.1:40159","remoteAddress":"127.0.0.1","remotePort":50780},"msg":"incoming request"}
{"level":30,"time":1795006651260,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":2.1358510000000024,"msg":"request completed"}
{"level":30,"time":1795006651261,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/command-roles","host":"127.0.0.1:41075","remoteAddress":"127.0.0.1","remotePort":52898},"msg":"incoming request"}
{"level":30,"time":1795006651264,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":201},"responseTime":2.769650000000013,"msg":"request completed"}
{"level":30,"time":1795006651265,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/timeline","host":"127.0.0.1:36707","remoteAddress":"127.0.0.1","remotePort":41942},"msg":"incoming request"}
{"level":30,"time":1795006651267,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":200},"responseTime":1.9209470000000124,"msg":"request completed"}
{"level":30,"time":1795006651268,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/closure","host":"127.0.0.1:36361","remoteAddress":"127.0.0.1","remotePort":59670},"msg":"incoming request"}
{"level":30,"time":1795006651272,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":200},"responseTime":3.83378799999997,"msg":"request completed"}
{"level":30,"time":1795006651273,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/dc003b73-4052-4db4-b813-f1c9254e9774/timeline","host":"127.0.0.1:45505","remoteAddress":"127.0.0.1","remotePort":41674},"msg":"incoming request"}
{"level":30,"time":1795006651275,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":200},"responseTime":1.8135350000000017,"msg":"request completed"}
{"level":30,"time":1795006651276,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39469","remoteAddress":"127.0.0.1","remotePort":34496},"msg":"incoming request"}
{"level":30,"time":1795006651279,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":201},"responseTime":3.383833999999979,"msg":"request completed"}
{"level":30,"time":1795006651280,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/21b356e2-a39d-4379-a41b-42d905b0cdae/command-roles","host":"127.0.0.1:46673","remoteAddress":"127.0.0.1","remotePort":35340},"msg":"incoming request"}
{"level":30,"time":1795006651282,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":201},"responseTime":1.688841000000025,"msg":"request completed"}
{"level":30,"time":1795006651283,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/21b356e2-a39d-4379-a41b-42d905b0cdae/command-roles","host":"127.0.0.1:36019","remoteAddress":"127.0.0.1","remotePort":51564},"msg":"incoming request"}
{"level":30,"time":1795006651284,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":201},"responseTime":1.4661719999999718,"msg":"request completed"}
{"level":30,"time":1795006651285,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/21b356e2-a39d-4379-a41b-42d905b0cdae/timeline","host":"127.0.0.1:43577","remoteAddress":"127.0.0.1","remotePort":51622},"msg":"incoming request"}
{"level":30,"time":1795006651286,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-g","res":{"statusCode":200},"responseTime":1.3474600000000123,"msg":"request completed"}
{"level":30,"time":1795006651288,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36335","remoteAddress":"127.0.0.1","remotePort":48740},"msg":"incoming request"}
{"level":30,"time":1795006651290,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-h","res":{"statusCode":201},"responseTime":2.252760999999964,"msg":"request completed"}
{"level":30,"time":1795006651291,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/1c72abf0-229f-4b2c-9156-9baac3dcfd38/activation","host":"127.0.0.1:39135","remoteAddress":"127.0.0.1","remotePort":35072},"msg":"incoming request"}
{"level":30,"time":1795006651292,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-i","res":{"statusCode":404},"responseTime":1.409956999999963,"msg":"request completed"}
{"level":30,"time":1795006651293,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/1c72abf0-229f-4b2c-9156-9baac3dcfd38/command-roles","host":"127.0.0.1:38183","remoteAddress":"127.0.0.1","remotePort":39448},"msg":"incoming request"}
{"level":30,"time":1795006651294,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-j","res":{"statusCode":404},"responseTime":1.0326489999999922,"msg":"request completed"}
{"level":30,"time":1795006651294,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/1c72abf0-229f-4b2c-9156-9baac3dcfd38/closure","host":"127.0.0.1:40707","remoteAddress":"127.0.0.1","remotePort":50382},"msg":"incoming request"}
{"level":30,"time":1795006651296,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-k","res":{"statusCode":404},"responseTime":1.0758799999999837,"msg":"request completed"}
{"level":30,"time":1795006651296,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/1c72abf0-229f-4b2c-9156-9baac3dcfd38/activation","host":"127.0.0.1:45007","remoteAddress":"127.0.0.1","remotePort":40152},"msg":"incoming request"}
{"level":30,"time":1795006651298,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-l","res":{"statusCode":200},"responseTime":1.8585390000000075,"msg":"request completed"}
{"level":30,"time":1795006651299,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42987","remoteAddress":"127.0.0.1","remotePort":59434},"msg":"incoming request"}
{"level":30,"time":1795006651301,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-m","res":{"statusCode":201},"responseTime":2.1998310000000174,"msg":"request completed"}
{"level":30,"time":1795006651302,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/9d4f9824-db7b-45b3-8abf-af3db5f2418d/closure","host":"127.0.0.1:41529","remoteAddress":"127.0.0.1","remotePort":48350},"msg":"incoming request"}
{"level":30,"time":1795006651305,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-n","res":{"statusCode":200},"responseTime":3.0944800000000328,"msg":"request completed"}
{"level":30,"time":1795006651306,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/9d4f9824-db7b-45b3-8abf-af3db5f2418d/closure","host":"127.0.0.1:43777","remoteAddress":"127.0.0.1","remotePort":39316},"msg":"incoming request"}
{"level":30,"time":1795006651308,"pid":324693,"hostname":"pivota-sandbox-13637243","reqId":"req-o","res":{"statusCode":409},"responseTime":1.9913690000000202,"msg":"request completed"}
{"level":30,"time":1795006651556,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42649","remoteAddress":"127.0.0.1","remotePort":36520},"msg":"incoming request"}
{"level":30,"time":1795006651570,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":13.968808000000024,"msg":"request completed"}
{"level":30,"time":1795006651573,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42355","remoteAddress":"127.0.0.1","remotePort":58214},"msg":"incoming request"}
{"level":30,"time":1795006651577,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":201},"responseTime":3.7631360000000313,"msg":"request completed"}
{"level":30,"time":1795006651578,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:34777","remoteAddress":"127.0.0.1","remotePort":34506},"msg":"incoming request"}
{"level":30,"time":1795006651581,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":200},"responseTime":3.3454120000000103,"msg":"request completed"}
{"level":30,"time":1795006651583,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43847","remoteAddress":"127.0.0.1","remotePort":58834},"msg":"incoming request"}
{"level":30,"time":1795006651586,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":201},"responseTime":3.235794999999996,"msg":"request completed"}
{"level":30,"time":1795006651588,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:39283","remoteAddress":"127.0.0.1","remotePort":54352},"msg":"incoming request"}
{"level":30,"time":1795006651590,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":1.7740309999999795,"msg":"request completed"}
{"level":30,"time":1795006651591,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:46611","remoteAddress":"127.0.0.1","remotePort":48226},"msg":"incoming request"}
{"level":30,"time":1795006651593,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8493530000000078,"msg":"request completed"}
{"level":30,"time":1795006651594,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:34591","remoteAddress":"127.0.0.1","remotePort":50102},"msg":"incoming request"}
{"level":30,"time":1795006651596,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":200},"responseTime":1.7595839999999612,"msg":"request completed"}
{"level":30,"time":1795006651597,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:37741","remoteAddress":"127.0.0.1","remotePort":59280},"msg":"incoming request"}
{"level":30,"time":1795006651599,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0334380000000465,"msg":"request completed"}
{"level":30,"time":1795006651600,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:45399","remoteAddress":"127.0.0.1","remotePort":51432},"msg":"incoming request"}
{"level":30,"time":1795006651601,"pid":324706,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":200},"responseTime":1.597329000000002,"msg":"request completed"}
{"level":30,"time":1795006651849,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:34789","remoteAddress":"127.0.0.1","remotePort":45664},"msg":"incoming request"}
{"level":30,"time":1795006651862,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":12.62036599999999,"msg":"request completed"}
{"level":30,"time":1795006651864,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c/submit-review","host":"127.0.0.1:33125","remoteAddress":"127.0.0.1","remotePort":43686},"msg":"incoming request"}
{"level":30,"time":1795006651869,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":5.175588000000005,"msg":"request completed"}
{"level":30,"time":1795006651871,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c/review","host":"127.0.0.1:44901","remoteAddress":"127.0.0.1","remotePort":50498},"msg":"incoming request"}
{"level":30,"time":1795006651873,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":403},"responseTime":2.2394950000000335,"msg":"request completed"}
{"level":30,"time":1795006651874,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c","host":"127.0.0.1:39007","remoteAddress":"127.0.0.1","remotePort":48978},"msg":"incoming request"}
{"level":30,"time":1795006651876,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":200},"responseTime":2.1460690000000113,"msg":"request completed"}
{"level":30,"time":1795006651877,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c/review","host":"127.0.0.1:45725","remoteAddress":"127.0.0.1","remotePort":34568},"msg":"incoming request"}
{"level":30,"time":1795006651881,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":3.990963000000022,"msg":"request completed"}
{"level":30,"time":1795006651882,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c","host":"127.0.0.1:42859","remoteAddress":"127.0.0.1","remotePort":58302},"msg":"incoming request"}
{"level":30,"time":1795006651885,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-6","res":{"statusCode":200},"responseTime":2.192136000000005,"msg":"request completed"}
{"level":30,"time":1795006651885,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c/sections/0c57216c-4d97-4f92-ba2c-e68eefaae687/link-tasks","host":"127.0.0.1:44397","remoteAddress":"127.0.0.1","remotePort":51064},"msg":"incoming request"}
{"level":30,"time":1795006651888,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-7","res":{"statusCode":204},"responseTime":2.080126000000007,"msg":"request completed"}
{"level":30,"time":1795006651888,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c","host":"127.0.0.1:34973","remoteAddress":"127.0.0.1","remotePort":56948},"msg":"incoming request"}
{"level":30,"time":1795006651890,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-8","res":{"statusCode":200},"responseTime":2.112536999999975,"msg":"request completed"}
{"level":30,"time":1795006651891,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36601","remoteAddress":"127.0.0.1","remotePort":35124},"msg":"incoming request"}
{"level":30,"time":1795006651901,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-9","res":{"statusCode":201},"responseTime":9.637085000000013,"msg":"request completed"}
{"level":30,"time":1795006651902,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/465fdac6-078f-48a1-b857-2a15d9d7355c/materialize-tasks","host":"127.0.0.1:41619","remoteAddress":"127.0.0.1","remotePort":42150},"msg":"incoming request"}
{"level":30,"time":1795006651906,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-a","res":{"statusCode":200},"responseTime":3.827807000000007,"msg":"request completed"}
{"level":30,"time":1795006651907,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=0e088ab4-3c57-4a2c-afdc-51bd61afa615","host":"127.0.0.1:46669","remoteAddress":"127.0.0.1","remotePort":37670},"msg":"incoming request"}
{"level":30,"time":1795006651909,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-b","res":{"statusCode":200},"responseTime":2.08286099999998,"msg":"request completed"}
{"level":30,"time":1795006651911,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42087","remoteAddress":"127.0.0.1","remotePort":55518},"msg":"incoming request"}
{"level":30,"time":1795006651913,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-c","res":{"statusCode":201},"responseTime":2.3767520000000104,"msg":"request completed"}
{"level":30,"time":1795006651914,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/897cc619-2cca-40fb-bc53-d8171b7ffa44/review","host":"127.0.0.1:33901","remoteAddress":"127.0.0.1","remotePort":51786},"msg":"incoming request"}
{"level":30,"time":1795006651915,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-d","res":{"statusCode":409},"responseTime":1.430716000000018,"msg":"request completed"}
{"level":30,"time":1795006651916,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:34171","remoteAddress":"127.0.0.1","remotePort":44178},"msg":"incoming request"}
{"level":30,"time":1795006651918,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-e","res":{"statusCode":201},"responseTime":1.6982679999999846,"msg":"request completed"}
{"level":30,"time":1795006651919,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/9af5bf2d-cb33-494d-ac38-93b654427127/submit-review","host":"127.0.0.1:45497","remoteAddress":"127.0.0.1","remotePort":38398},"msg":"incoming request"}
{"level":30,"time":1795006651920,"pid":324753,"hostname":"pivota-sandbox-13637243","reqId":"req-f","res":{"statusCode":422},"responseTime":1.28296899999998,"msg":"request completed"}
{"level":30,"time":1795006652160,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:32979","remoteAddress":"127.0.0.1","remotePort":60490},"msg":"incoming request"}
{"level":30,"time":1795006652173,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-1","res":{"statusCode":201},"responseTime":13.504266000000001,"msg":"request completed"}
{"level":30,"time":1795006652180,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/eb29fbcd-a371-4e84-858b-1b267a98674d/timeline","host":"127.0.0.1:42869","remoteAddress":"127.0.0.1","remotePort":51990},"msg":"incoming request"}
{"level":30,"time":1795006652182,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-2","res":{"statusCode":200},"responseTime":2.8651499999999714,"msg":"request completed"}
{"level":30,"time":1795006652187,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33319","remoteAddress":"127.0.0.1","remotePort":39022},"msg":"incoming request"}
{"level":30,"time":1795006652190,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-3","res":{"statusCode":201},"responseTime":3.205528999999956,"msg":"request completed"}
{"level":30,"time":1795006652191,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/38299540-1ce7-4c84-9826-f97d60cee85c/closure","host":"127.0.0.1:37557","remoteAddress":"127.0.0.1","remotePort":60540},"msg":"incoming request"}
{"level":30,"time":1795006652195,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-4","res":{"statusCode":200},"responseTime":3.7732639999999833,"msg":"request completed"}
{"level":30,"time":1795006652196,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/38299540-1ce7-4c84-9826-f97d60cee85c/timeline","host":"127.0.0.1:38731","remoteAddress":"127.0.0.1","remotePort":43656},"msg":"incoming request"}
{"level":30,"time":1795006652198,"pid":324767,"hostname":"pivota-sandbox-13637243","reqId":"req-5","res":{"statusCode":200},"responseTime":1.5985519999999838,"msg":"request completed"}

 Test Files  14 passed (14)
      Tests  70 passed (70)
   Start at  12:57:27
   Duration  4.69s (transform 145ms, setup 35ms, import 1.93s, tests 1.98s, environment 1ms)


> @epmp/design-system@0.1.0 test
> vitest run


[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 80[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 144[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 53[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 114[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 158[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 101[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m51 passed[39m[22m[90m (51)[39m
[2m   Start at [22m 12:57:32
[2m   Duration [22m 1.98s[2m (transform 184ms, setup 175ms, collect 636ms, tests 650ms, environment 1.12s, prepare 178ms)[22m
```

