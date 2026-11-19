---
phase: 05
gate_status: passed
build_command: "rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc"
test_command: "rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc"
last_updated: 2026-11-19T11:18:17Z
tests_disabled_during_fixes: none
shadowed_sources: 0
review_blockers_open: 0
boot_smoke: pass
browser_suite: pass
browser_headroom_mb: 4969
browser_headroom_naive_mb: 2283
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
- Fix attempts: 0/3 — 05-06 gap closure (UAT-8/UAT-1): backend 87/87 tests pass (was 86, +1 new regression test), design-system 60/60 tests pass (was 59, +1 new regression test), all 3 workspace builds clean

### Gate output

```
> @epmp/backend@0.1.0 build
> tsc -p tsconfig.json

> @epmp/design-system@0.1.0 build
> vite build

[36mvite v5.4.21 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 79 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[35mbundle.css    [39m[1m[2m 38.70 kB[22m[1m[22m[2m │ gzip:  5.65 kB[22m
[2mdist/[22m[36mbundle.es.js  [39m[1m[2m108.13 kB[22m[1m[22m[2m │ gzip: 24.47 kB[22m
[2mdist/[22m[35mbundle.css  [39m[1m[2m38.70 kB[22m[1m[22m[2m │ gzip:  5.65 kB[22m
[2mdist/[22m[36mbundle.js   [39m[1m[2m68.14 kB[22m[1m[22m[2m │ gzip: 20.38 kB[22m
[32m✓ built in 205ms[39m

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
[2mdist/[22m[2massets/[22m[35mindex-DZE5RVGs.css  [39m[1m[2m 53.06 kB[22m[1m[22m[2m │ gzip:   8.52 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C2U-d5_z.js   [39m[1m[33m503.32 kB[39m[22m[2m │ gzip: 144.16 kB[22m
[33m
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.[39m
[32m✓ built in 1.01s[39m

PWA v0.21.2
mode      generateSW
precache  7 entries (545.12 KiB)
files generated
  dist/sw.js
  dist/workbox-ee9d8b34.js
[gate] wave 1 tests: rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc (timeout 600s)

> @epmp/backend@0.1.0 test
> vitest run

 RUN  v4.1.12 /home/daytona/project/backend

{"level":30,"time":1795086163763,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:44631","remoteAddress":"127.0.0.1","remotePort":53916},"msg":"incoming request"}
{"level":30,"time":1795086163810,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":46.664248999999984,"msg":"request completed"}
{"level":30,"time":1795086163813,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43851","remoteAddress":"127.0.0.1","remotePort":40594},"msg":"incoming request"}
{"level":30,"time":1795086163824,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":201},"responseTime":10.926125000000013,"msg":"request completed"}
{"level":30,"time":1795086163825,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:36167","remoteAddress":"127.0.0.1","remotePort":48902},"msg":"incoming request"}
{"level":30,"time":1795086163830,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":4.323540999999977,"msg":"request completed"}
{"level":30,"time":1795086163831,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/resource-requests/68cb020f-0dcd-43c4-b09d-fcc87caea70e/decline","host":"127.0.0.1:34825","remoteAddress":"127.0.0.1","remotePort":59112},"msg":"incoming request"}
{"level":30,"time":1795086163833,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":422},"responseTime":1.381514999999979,"msg":"request completed"}
{"level":30,"time":1795086163834,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"GET","url":"/api/v1/resource-requests?incident=da6e9d7a-017d-4719-9ee7-4d9668e4aa2a","host":"127.0.0.1:40203","remoteAddress":"127.0.0.1","remotePort":55714},"msg":"incoming request"}
{"level":30,"time":1795086163836,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":2.11660599999999,"msg":"request completed"}
{"level":30,"time":1795086163837,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/resource-requests/68cb020f-0dcd-43c4-b09d-fcc87caea70e/decline","host":"127.0.0.1:42787","remoteAddress":"127.0.0.1","remotePort":58262},"msg":"incoming request"}
{"level":30,"time":1795086163841,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":3.1429339999999684,"msg":"request completed"}
{"level":30,"time":1795086163841,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/da6e9d7a-017d-4719-9ee7-4d9668e4aa2a/timeline","host":"127.0.0.1:39167","remoteAddress":"127.0.0.1","remotePort":57626},"msg":"incoming request"}
{"level":30,"time":1795086163844,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":2.451614999999947,"msg":"request completed"}
{"level":30,"time":1795086163845,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38425","remoteAddress":"127.0.0.1","remotePort":38962},"msg":"incoming request"}
{"level":30,"time":1795086163850,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":201},"responseTime":4.7047170000000165,"msg":"request completed"}
{"level":30,"time":1795086163851,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:33969","remoteAddress":"127.0.0.1","remotePort":42008},"msg":"incoming request"}
{"level":30,"time":1795086163856,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":4.188628999999992,"msg":"request completed"}
{"level":30,"time":1795086163857,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/resource-requests/ae8db5f9-3620-4ca1-b772-73cb6023336f/approve","host":"127.0.0.1:41923","remoteAddress":"127.0.0.1","remotePort":36736},"msg":"incoming request"}
{"level":30,"time":1795086163862,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":200},"responseTime":5.702042000000006,"msg":"request completed"}
{"level":30,"time":1795086163864,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/resource-requests/ae8db5f9-3620-4ca1-b772-73cb6023336f/fulfill","host":"127.0.0.1:36247","remoteAddress":"127.0.0.1","remotePort":41932},"msg":"incoming request"}
{"level":30,"time":1795086163867,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":3.040781999999979,"msg":"request completed"}
{"level":30,"time":1795086163869,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"POST","url":"/api/v1/resource-requests/ae8db5f9-3620-4ca1-b772-73cb6023336f/fulfill","host":"127.0.0.1:43691","remoteAddress":"127.0.0.1","remotePort":40118},"msg":"incoming request"}
{"level":30,"time":1795086163872,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":200},"responseTime":3.628866999999957,"msg":"request completed"}
{"level":30,"time":1795086163874,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"GET","url":"/api/v1/incidents/ddc6bf7b-3e7b-4e33-a16f-9e17ba950264/timeline","host":"127.0.0.1:46455","remoteAddress":"127.0.0.1","remotePort":59642},"msg":"incoming request"}
{"level":30,"time":1795086163876,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":200},"responseTime":2.334594999999979,"msg":"request completed"}
{"level":30,"time":1795086164078,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:38909","remoteAddress":"127.0.0.1","remotePort":49256},"msg":"incoming request"}
{"level":30,"time":1795086164088,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":201},"responseTime":9.544218999999998,"msg":"request completed"}
{"level":30,"time":1795086164089,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:32873","remoteAddress":"127.0.0.1","remotePort":53618},"msg":"incoming request"}
{"level":30,"time":1795086164090,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":422},"responseTime":1.2445379999999204,"msg":"request completed"}
{"level":30,"time":1795086164091,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43033","remoteAddress":"127.0.0.1","remotePort":60980},"msg":"incoming request"}
{"level":30,"time":1795086164094,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":201},"responseTime":2.9228600000000142,"msg":"request completed"}
{"level":30,"time":1795086164095,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:35607","remoteAddress":"127.0.0.1","remotePort":35078},"msg":"incoming request"}
{"level":30,"time":1795086164098,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":201},"responseTime":2.640229999999974,"msg":"request completed"}
{"level":30,"time":1795086164099,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"POST","url":"/api/v1/resource-requests/1b29836e-eb65-4664-8a15-a36c33254b92/fulfill","host":"127.0.0.1:34163","remoteAddress":"127.0.0.1","remotePort":36292},"msg":"incoming request"}
{"level":30,"time":1795086164100,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":409},"responseTime":1.4958299999999554,"msg":"request completed"}
{"level":30,"time":1795086164101,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests/1b29836e-eb65-4664-8a15-a36c33254b92/approve","host":"127.0.0.1:34361","remoteAddress":"127.0.0.1","remotePort":37988},"msg":"incoming request"}
{"level":30,"time":1795086164103,"pid":165732,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":409},"responseTime":1.7031900000000633,"msg":"request completed"}
{"level":30,"time":1795086164362,"pid":165803,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/webhook-subscriptions","host":"127.0.0.1:42961","remoteAddress":"127.0.0.1","remotePort":42114},"msg":"incoming request"}
{"level":30,"time":1795086164409,"pid":165803,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":46.746853999999985,"msg":"request completed"}
{"level":30,"time":1795086164616,"pid":165803,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/openapi.json","host":"127.0.0.1:45405","remoteAddress":"127.0.0.1","remotePort":59168},"msg":"incoming request"}
{"level":30,"time":1795086164620,"pid":165803,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":3.3793679999999995,"msg":"request completed"}
{"level":30,"time":1795086164871,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:41763","remoteAddress":"127.0.0.1","remotePort":59378},"msg":"incoming request"}
{"level":30,"time":1795086164875,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":422},"responseTime":4.243400999999977,"msg":"request completed"}
{"level":30,"time":1795086164878,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:43027","remoteAddress":"127.0.0.1","remotePort":37836},"msg":"incoming request"}
{"level":30,"time":1795086164881,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":201},"responseTime":2.49181999999999,"msg":"request completed"}
{"level":30,"time":1795086164882,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33159","remoteAddress":"127.0.0.1","remotePort":44722},"msg":"incoming request"}
{"level":30,"time":1795086164892,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":10.026082999999971,"msg":"request completed"}
{"level":30,"time":1795086164893,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:45035","remoteAddress":"127.0.0.1","remotePort":35396},"msg":"incoming request"}
{"level":30,"time":1795086164902,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":8.709621000000027,"msg":"request completed"}
{"level":30,"time":1795086164903,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/notifications/dbfc3e78-98c4-47a5-a3ed-0cd39e90f836/send","host":"127.0.0.1:41431","remoteAddress":"127.0.0.1","remotePort":35918},"msg":"incoming request"}
{"level":30,"time":1795086164904,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":403},"responseTime":1.5176910000000134,"msg":"request completed"}
{"level":30,"time":1795086164905,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/notifications/dbfc3e78-98c4-47a5-a3ed-0cd39e90f836/send","host":"127.0.0.1:36179","remoteAddress":"127.0.0.1","remotePort":58342},"msg":"incoming request"}
{"level":30,"time":1795086164908,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":2.5005069999999705,"msg":"request completed"}
{"level":30,"time":1795086164909,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/0c438844-915a-4cac-9c9f-edc09d65e0eb/timeline","host":"127.0.0.1:37547","remoteAddress":"127.0.0.1","remotePort":52054},"msg":"incoming request"}
{"level":30,"time":1795086164911,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":1.8776070000000118,"msg":"request completed"}
{"level":30,"time":1795086164912,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/notifications/dbfc3e78-98c4-47a5-a3ed-0cd39e90f836/delivery-status","host":"127.0.0.1:46517","remoteAddress":"127.0.0.1","remotePort":51576},"msg":"incoming request"}
{"level":30,"time":1795086164914,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":1.7150419999999826,"msg":"request completed"}
{"level":30,"time":1795086164915,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:39729","remoteAddress":"127.0.0.1","remotePort":59216},"msg":"incoming request"}
{"level":30,"time":1795086164917,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":1.6903449999999793,"msg":"request completed"}
{"level":30,"time":1795086164918,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/ai-drafts","host":"127.0.0.1:38623","remoteAddress":"127.0.0.1","remotePort":55598},"msg":"incoming request"}
{"level":30,"time":1795086164920,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":201},"responseTime":1.9131440000000453,"msg":"request completed"}
{"level":30,"time":1795086164921,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:46219","remoteAddress":"127.0.0.1","remotePort":57882},"msg":"incoming request"}
{"level":30,"time":1795086164925,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":201},"responseTime":4.165545000000009,"msg":"request completed"}
{"level":30,"time":1795086164926,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"POST","url":"/api/v1/notifications/af095856-65ff-438a-8ebf-60fda191707b/send","host":"127.0.0.1:36181","remoteAddress":"127.0.0.1","remotePort":39592},"msg":"incoming request"}
{"level":30,"time":1795086164927,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":400},"responseTime":1.662253000000021,"msg":"request completed"}
{"level":30,"time":1795086164928,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"POST","url":"/api/v1/ai-drafts/a3fe9a9d-e64a-41d9-a2e0-6b6043fdb7e5/approve","host":"127.0.0.1:44427","remoteAddress":"127.0.0.1","remotePort":43194},"msg":"incoming request"}
{"level":30,"time":1795086164930,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":200},"responseTime":1.5844769999999926,"msg":"request completed"}
{"level":30,"time":1795086164930,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"POST","url":"/api/v1/notifications/af095856-65ff-438a-8ebf-60fda191707b/send","host":"127.0.0.1:40683","remoteAddress":"127.0.0.1","remotePort":55778},"msg":"incoming request"}
{"level":30,"time":1795086164933,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":200},"responseTime":2.370853000000011,"msg":"request completed"}
{"level":30,"time":1795086164936,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/recipient-groups","host":"127.0.0.1:46027","remoteAddress":"127.0.0.1","remotePort":36500},"msg":"incoming request"}
{"level":30,"time":1795086164938,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":201},"responseTime":1.4626969999999915,"msg":"request completed"}
{"level":30,"time":1795086164939,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:44011","remoteAddress":"127.0.0.1","remotePort":59558},"msg":"incoming request"}
{"level":30,"time":1795086164945,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":201},"responseTime":5.770639999999958,"msg":"request completed"}
{"level":30,"time":1795086164945,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"POST","url":"/api/v1/notifications/d7b5a8ca-38ee-4a09-bfea-608e3c716573/send","host":"127.0.0.1:38663","remoteAddress":"127.0.0.1","remotePort":40382},"msg":"incoming request"}
{"level":30,"time":1795086164948,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":200},"responseTime":2.2563590000000318,"msg":"request completed"}
{"level":30,"time":1795086164949,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:35859","remoteAddress":"127.0.0.1","remotePort":55754},"msg":"incoming request"}
{"level":30,"time":1795086164954,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":201},"responseTime":5.772885000000031,"msg":"request completed"}
{"level":30,"time":1795086164955,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"POST","url":"/api/v1/notifications/3e85bf7a-1fc1-4228-bfe2-dc72de7470bc/send","host":"127.0.0.1:41739","remoteAddress":"127.0.0.1","remotePort":60286},"msg":"incoming request"}
{"level":30,"time":1795086164956,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":403},"responseTime":0.9350059999999871,"msg":"request completed"}
{"level":30,"time":1795086164957,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","req":{"method":"GET","url":"/api/v1/recipient-groups","host":"127.0.0.1:42713","remoteAddress":"127.0.0.1","remotePort":56922},"msg":"incoming request"}
{"level":30,"time":1795086164961,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","res":{"statusCode":200},"responseTime":4.214316999999994,"msg":"request completed"}
{"level":30,"time":1795086164962,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","req":{"method":"POST","url":"/api/v1/notifications/compose","host":"127.0.0.1:33909","remoteAddress":"127.0.0.1","remotePort":33142},"msg":"incoming request"}
{"level":30,"time":1795086164963,"pid":165813,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","res":{"statusCode":403},"responseTime":0.8990289999999845,"msg":"request completed"}
{"level":30,"time":1795086165213,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41697","remoteAddress":"127.0.0.1","remotePort":44718},"msg":"incoming request"}
{"level":30,"time":1795086165227,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":13.16372800000002,"msg":"request completed"}
{"level":30,"time":1795086165229,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/3882e3d9-2ea6-47ed-9ba0-fea531f74dce/timeline","host":"127.0.0.1:38681","remoteAddress":"127.0.0.1","remotePort":45192},"msg":"incoming request"}
{"level":30,"time":1795086165232,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":2.864812000000029,"msg":"request completed"}
{"level":30,"time":1795086165234,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36009","remoteAddress":"127.0.0.1","remotePort":54886},"msg":"incoming request"}
{"level":30,"time":1795086165237,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":3.0093729999999823,"msg":"request completed"}
{"level":30,"time":1795086165238,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33085","remoteAddress":"127.0.0.1","remotePort":60668},"msg":"incoming request"}
{"level":30,"time":1795086165240,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":409},"responseTime":1.3778179999999907,"msg":"request completed"}
{"level":30,"time":1795086165240,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35055","remoteAddress":"127.0.0.1","remotePort":56474},"msg":"incoming request"}
{"level":30,"time":1795086165243,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":201},"responseTime":2.413013000000035,"msg":"request completed"}
{"level":30,"time":1795086165244,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44933","remoteAddress":"127.0.0.1","remotePort":36942},"msg":"incoming request"}
{"level":30,"time":1795086165247,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":201},"responseTime":2.4954869999999687,"msg":"request completed"}
{"level":30,"time":1795086165248,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37065","remoteAddress":"127.0.0.1","remotePort":33574},"msg":"incoming request"}
{"level":30,"time":1795086165250,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":201},"responseTime":2.2715769999999793,"msg":"request completed"}
{"level":30,"time":1795086165251,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37833","remoteAddress":"127.0.0.1","remotePort":49666},"msg":"incoming request"}
{"level":30,"time":1795086165253,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":201},"responseTime":2.5197140000000218,"msg":"request completed"}
{"level":30,"time":1795086165255,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"GET","url":"/api/v1/incidents?severity=Critical&page_size=100","host":"127.0.0.1:33161","remoteAddress":"127.0.0.1","remotePort":58452},"msg":"incoming request"}
{"level":30,"time":1795086165257,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":200},"responseTime":1.9762819999999692,"msg":"request completed"}
{"level":30,"time":1795086165259,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44785","remoteAddress":"127.0.0.1","remotePort":53680},"msg":"incoming request"}
{"level":30,"time":1795086165261,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":201},"responseTime":2.360193000000038,"msg":"request completed"}
{"level":30,"time":1795086165262,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"GET","url":"/api/v1/incidents/41f8566c-3790-4b2e-a8b9-7df2931f4280","host":"127.0.0.1:41375","remoteAddress":"127.0.0.1","remotePort":50452},"msg":"incoming request"}
{"level":30,"time":1795086165263,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":404},"responseTime":1.4599530000000414,"msg":"request completed"}
{"level":30,"time":1795086165264,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents?page_size=100","host":"127.0.0.1:35449","remoteAddress":"127.0.0.1","remotePort":46800},"msg":"incoming request"}
{"level":30,"time":1795086165266,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":200},"responseTime":1.9381099999999947,"msg":"request completed"}
{"level":30,"time":1795086165267,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/incidents/41f8566c-3790-4b2e-a8b9-7df2931f4280","host":"127.0.0.1:35301","remoteAddress":"127.0.0.1","remotePort":50096},"msg":"incoming request"}
{"level":30,"time":1795086165268,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":404},"responseTime":1.322183999999993,"msg":"request completed"}
{"level":30,"time":1795086165269,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"GET","url":"/api/v1/incidents/41f8566c-3790-4b2e-a8b9-7df2931f4280/timeline","host":"127.0.0.1:46531","remoteAddress":"127.0.0.1","remotePort":36692},"msg":"incoming request"}
{"level":30,"time":1795086165270,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":404},"responseTime":1.1189519999999789,"msg":"request completed"}
{"level":30,"time":1795086165271,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40029","remoteAddress":"127.0.0.1","remotePort":60648},"msg":"incoming request"}
{"level":30,"time":1795086165274,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":201},"responseTime":2.425666999999976,"msg":"request completed"}
{"level":30,"time":1795086165284,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35065","remoteAddress":"127.0.0.1","remotePort":39300},"msg":"incoming request"}
{"level":30,"time":1795086165292,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":201},"responseTime":8.258152999999993,"msg":"request completed"}
{"level":30,"time":1795086165293,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46249","remoteAddress":"127.0.0.1","remotePort":40996},"msg":"incoming request"}
{"level":30,"time":1795086165296,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":201},"responseTime":3.1896219999999857,"msg":"request completed"}
{"level":30,"time":1795086165297,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40909","remoteAddress":"127.0.0.1","remotePort":38476},"msg":"incoming request"}
{"level":30,"time":1795086165300,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":201},"responseTime":3.115412000000049,"msg":"request completed"}
{"level":30,"time":1795086165301,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"POST","url":"/api/v1/resource-requests","host":"127.0.0.1:38823","remoteAddress":"127.0.0.1","remotePort":54174},"msg":"incoming request"}
{"level":40,"time":1795086165304,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:288:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795086165305,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":201},"responseTime":4.260413000000028,"msg":"request completed"}
{"level":30,"time":1795086165306,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","req":{"method":"POST","url":"/api/v1/resource-requests/fa81859f-5569-46fc-9ca8-de21231aa0f5/approve","host":"127.0.0.1:43855","remoteAddress":"127.0.0.1","remotePort":48124},"msg":"incoming request"}
{"level":40,"time":1795086165308,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","err":{"type":"Error","message":"NATS not connected","stack":"Error: NATS not connected\n    at publishEvent (/home/daytona/project/backend/src/modules/integration-gateway/nats-client.ts:45:18)\n    at publishResourceRequestStatusChanged (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:87:3)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/resource-requests.ts:344:9)\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)"},"msg":"resource_request.status_changed publish failed"}
{"level":30,"time":1795086165308,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","res":{"statusCode":200},"responseTime":2.6108450000000403,"msg":"request completed"}
{"level":30,"time":1795086165310,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","req":{"method":"GET","url":"/api/v1/tasks?page_size=5","host":"127.0.0.1:40293","remoteAddress":"127.0.0.1","remotePort":42822},"msg":"incoming request"}
{"level":30,"time":1795086165311,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","res":{"statusCode":200},"responseTime":1.839445000000012,"msg":"request completed"}
{"level":30,"time":1795086165312,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46159","remoteAddress":"127.0.0.1","remotePort":41214},"msg":"incoming request"}
{"level":30,"time":1795086165313,"pid":165827,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","res":{"statusCode":403},"responseTime":0.8873169999999959,"msg":"request completed"}
{"level":30,"time":1795086165568,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:44585","remoteAddress":"127.0.0.1","remotePort":52902},"msg":"incoming request"}
{"level":30,"time":1795086165580,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":11.661727000000013,"msg":"request completed"}
{"level":30,"time":1795086165583,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:37009","remoteAddress":"127.0.0.1","remotePort":44640},"msg":"incoming request"}
{"level":30,"time":1795086165585,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":201},"responseTime":2.2153220000000147,"msg":"request completed"}
{"level":30,"time":1795086165587,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:35707","remoteAddress":"127.0.0.1","remotePort":44794},"msg":"incoming request"}
{"level":30,"time":1795086165589,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":422},"responseTime":1.7879280000000222,"msg":"request completed"}
{"level":30,"time":1795086165590,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35513","remoteAddress":"127.0.0.1","remotePort":33066},"msg":"incoming request"}
{"level":30,"time":1795086165595,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":4.971198000000015,"msg":"request completed"}
{"level":30,"time":1795086165596,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:34949","remoteAddress":"127.0.0.1","remotePort":55222},"msg":"incoming request"}
{"level":30,"time":1795086165601,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":4.841644999999971,"msg":"request completed"}
{"level":30,"time":1795086165603,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/sync-conflicts/25fe3b28-4cde-4f7c-b96d-2c618ef713de/resolve","host":"127.0.0.1:42929","remoteAddress":"127.0.0.1","remotePort":40146},"msg":"incoming request"}
{"level":30,"time":1795086165606,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":3.1974369999999794,"msg":"request completed"}
{"level":30,"time":1795086165608,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/incidents/bdfd3b4c-1a27-447d-9aaa-bc7c60634836/timeline","host":"127.0.0.1:33693","remoteAddress":"127.0.0.1","remotePort":44894},"msg":"incoming request"}
{"level":30,"time":1795086165610,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":2.201625999999976,"msg":"request completed"}
{"level":30,"time":1795086165611,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"POST","url":"/api/v1/sync-conflicts/25fe3b28-4cde-4f7c-b96d-2c618ef713de/resolve","host":"127.0.0.1:43347","remoteAddress":"127.0.0.1","remotePort":47578},"msg":"incoming request"}
{"level":30,"time":1795086165613,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":409},"responseTime":1.8328730000000064,"msg":"request completed"}
{"level":30,"time":1795086165615,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:45743","remoteAddress":"127.0.0.1","remotePort":44608},"msg":"incoming request"}
{"level":30,"time":1795086165618,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":2.413663999999983,"msg":"request completed"}
{"level":30,"time":1795086165620,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37649","remoteAddress":"127.0.0.1","remotePort":37054},"msg":"incoming request"}
{"level":30,"time":1795086165623,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":201},"responseTime":3.5500990000000456,"msg":"request completed"}
{"level":30,"time":1795086165624,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:39649","remoteAddress":"127.0.0.1","remotePort":49216},"msg":"incoming request"}
{"level":30,"time":1795086165627,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":2.211644999999976,"msg":"request completed"}
{"level":30,"time":1795086165627,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"POST","url":"/api/v1/sync-conflicts/66c58269-dbba-4735-a70c-abb72a46c513/resolve","host":"127.0.0.1:45367","remoteAddress":"127.0.0.1","remotePort":48786},"msg":"incoming request"}
{"level":30,"time":1795086165630,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":200},"responseTime":2.230759999999975,"msg":"request completed"}
{"level":30,"time":1795086165631,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"POST","url":"/api/v1/field-reports","host":"127.0.0.1:45843","remoteAddress":"127.0.0.1","remotePort":51364},"msg":"incoming request"}
{"level":30,"time":1795086165633,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":403},"responseTime":1.321641999999997,"msg":"request completed"}
{"level":30,"time":1795086165633,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"GET","url":"/api/v1/sync-conflicts","host":"127.0.0.1:33019","remoteAddress":"127.0.0.1","remotePort":56502},"msg":"incoming request"}
{"level":30,"time":1795086165636,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":200},"responseTime":2.3829059999999913,"msg":"request completed"}
{"level":30,"time":1795086165638,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35843","remoteAddress":"127.0.0.1","remotePort":37338},"msg":"incoming request"}
{"level":30,"time":1795086165640,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":201},"responseTime":2.567533000000026,"msg":"request completed"}
{"level":30,"time":1795086165641,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"POST","url":"/api/v1/field-reports/sync-batch","host":"127.0.0.1:37859","remoteAddress":"127.0.0.1","remotePort":46008},"msg":"incoming request"}
{"level":30,"time":1795086165643,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":200},"responseTime":1.7997709999999643,"msg":"request completed"}
{"level":30,"time":1795086165645,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"GET","url":"/api/v1/sync-conflicts?page_size=100","host":"127.0.0.1:37107","remoteAddress":"127.0.0.1","remotePort":46174},"msg":"incoming request"}
{"level":30,"time":1795086165646,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":200},"responseTime":1.7970359999999914,"msg":"request completed"}
{"level":30,"time":1795086165647,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"GET","url":"/api/v1/sync-conflicts/7abc166e-f9a8-48b4-985d-2ad534c2bd5d","host":"127.0.0.1:42973","remoteAddress":"127.0.0.1","remotePort":41942},"msg":"incoming request"}
{"level":30,"time":1795086165649,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":404},"responseTime":1.4509850000000029,"msg":"request completed"}
{"level":30,"time":1795086165650,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"POST","url":"/api/v1/sync-conflicts/7abc166e-f9a8-48b4-985d-2ad534c2bd5d/resolve","host":"127.0.0.1:43879","remoteAddress":"127.0.0.1","remotePort":56036},"msg":"incoming request"}
{"level":30,"time":1795086165651,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":404},"responseTime":1.2128079999999954,"msg":"request completed"}
{"level":30,"time":1795086165652,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","req":{"method":"GET","url":"/api/v1/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/photos/369c99a6-aff1-4f73-982f-13f3a2f5c071","host":"127.0.0.1:35313","remoteAddress":"127.0.0.1","remotePort":55856},"msg":"incoming request"}
{"level":30,"time":1795086165653,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","res":{"statusCode":404},"responseTime":1.226965000000007,"msg":"request completed"}
{"level":30,"time":1795086165655,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","req":{"method":"POST","url":"/api/v1/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/photos","host":"127.0.0.1:43653","remoteAddress":"127.0.0.1","remotePort":44860},"msg":"incoming request"}
{"level":30,"time":1795086165656,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","res":{"statusCode":404},"responseTime":1.3887080000000083,"msg":"request completed"}
{"level":30,"time":1795086165657,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","req":{"method":"GET","url":"/api/v1/sync-conflicts/7abc166e-f9a8-48b4-985d-2ad534c2bd5d","host":"127.0.0.1:42535","remoteAddress":"127.0.0.1","remotePort":53498},"msg":"incoming request"}
{"level":30,"time":1795086165659,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","res":{"statusCode":200},"responseTime":1.291755999999964,"msg":"request completed"}
{"level":30,"time":1795086165659,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-n","req":{"method":"GET","url":"/api/v1/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/photos/369c99a6-aff1-4f73-982f-13f3a2f5c071","host":"127.0.0.1:46083","remoteAddress":"127.0.0.1","remotePort":39304},"msg":"incoming request"}
{"level":50,"time":1795086165661,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-n","err":{"type":"Error","message":"ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/f0501-test.jpg'","stack":"Error: ENOENT: no such file or directory, open '/home/daytona/project/backend/uploads/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/f0501-test.jpg'\n    at async open (node:internal/fs/promises:637:25)\n    at async readFile (node:internal/fs/promises:1249:14)\n    at Object.<anonymous> (/home/daytona/project/backend/src/modules/incident-ops/field-reports.ts:420:24)","errno":-2,"code":"ENOENT","syscall":"open","path":"/home/daytona/project/backend/uploads/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/f0501-test.jpg"},"msg":"Field report photo read failed for photo_id=369c99a6-aff1-4f73-982f-13f3a2f5c071"}
{"level":30,"time":1795086165662,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-n","res":{"statusCode":404},"responseTime":2.513059999999996,"msg":"request completed"}
{"level":30,"time":1795086165663,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-o","req":{"method":"POST","url":"/api/v1/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/photos","host":"127.0.0.1:40077","remoteAddress":"127.0.0.1","remotePort":47732},"msg":"incoming request"}
{"level":30,"time":1795086165667,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-o","res":{"statusCode":204},"responseTime":3.717903999999976,"msg":"request completed"}
{"level":30,"time":1795086165668,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-p","req":{"method":"GET","url":"/api/v1/field-reports/429aa8dd-1d50-4504-a113-6fd483f2fa73/photos/98a00dfd-60df-45ca-b0d6-81d7d6a8560b","host":"127.0.0.1:37379","remoteAddress":"127.0.0.1","remotePort":51778},"msg":"incoming request"}
{"level":30,"time":1795086165669,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-p","res":{"statusCode":200},"responseTime":1.6650180000000319,"msg":"request completed"}
{"level":30,"time":1795086165670,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-q","req":{"method":"POST","url":"/api/v1/sync-conflicts/7abc166e-f9a8-48b4-985d-2ad534c2bd5d/resolve","host":"127.0.0.1:36119","remoteAddress":"127.0.0.1","remotePort":55758},"msg":"incoming request"}
{"level":30,"time":1795086165673,"pid":165838,"hostname":"pivota-sandbox-8438da0f","reqId":"req-q","res":{"statusCode":200},"responseTime":2.483505999999977,"msg":"request completed"}
{"level":30,"time":1795086165926,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:41225","remoteAddress":"127.0.0.1","remotePort":50788},"msg":"incoming request"}
{"level":30,"time":1795086165940,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":13.35686100000001,"msg":"request completed"}
{"level":30,"time":1795086165942,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41731","remoteAddress":"127.0.0.1","remotePort":55978},"msg":"incoming request"}
{"level":30,"time":1795086165946,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":201},"responseTime":3.9641170000000443,"msg":"request completed"}
{"level":30,"time":1795086165947,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents/33544522-565a-4f6a-8efc-d612f13d3e53/sitreps","host":"127.0.0.1:39691","remoteAddress":"127.0.0.1","remotePort":55248},"msg":"incoming request"}
{"level":30,"time":1795086165951,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":3.1727600000000393,"msg":"request completed"}
{"level":30,"time":1795086165952,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40633","remoteAddress":"127.0.0.1","remotePort":50626},"msg":"incoming request"}
{"level":30,"time":1795086165955,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":2.7965529999999603,"msg":"request completed"}
{"level":30,"time":1795086165956,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/019009fb-0c21-44f9-b978-271155c0a22b/aar","host":"127.0.0.1:46177","remoteAddress":"127.0.0.1","remotePort":36716},"msg":"incoming request"}
{"level":30,"time":1795086165957,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":409},"responseTime":1.3665170000000444,"msg":"request completed"}
{"level":30,"time":1795086165958,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/incidents/019009fb-0c21-44f9-b978-271155c0a22b/closure","host":"127.0.0.1:46259","remoteAddress":"127.0.0.1","remotePort":47192},"msg":"incoming request"}
{"level":30,"time":1795086165961,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":3.0533760000000143,"msg":"request completed"}
{"level":30,"time":1795086165962,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/019009fb-0c21-44f9-b978-271155c0a22b/aar","host":"127.0.0.1:44963","remoteAddress":"127.0.0.1","remotePort":44928},"msg":"incoming request"}
{"level":30,"time":1795086165965,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":201},"responseTime":2.881151999999986,"msg":"request completed"}
{"level":30,"time":1795086165966,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42655","remoteAddress":"127.0.0.1","remotePort":56682},"msg":"incoming request"}
{"level":30,"time":1795086165969,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":201},"responseTime":2.390510000000006,"msg":"request completed"}
{"level":30,"time":1795086165970,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/f9ea851d-8793-4cbd-9abf-528f5a9288ca/closure","host":"127.0.0.1:35045","remoteAddress":"127.0.0.1","remotePort":36430},"msg":"incoming request"}
{"level":30,"time":1795086165972,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":200},"responseTime":2.508131999999989,"msg":"request completed"}
{"level":30,"time":1795086165973,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/incidents/f9ea851d-8793-4cbd-9abf-528f5a9288ca/aar","host":"127.0.0.1:38773","remoteAddress":"127.0.0.1","remotePort":48820},"msg":"incoming request"}
{"level":30,"time":1795086165974,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":422},"responseTime":1.2841829999999845,"msg":"request completed"}
{"level":30,"time":1795086165975,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:43495","remoteAddress":"127.0.0.1","remotePort":47954},"msg":"incoming request"}
{"level":30,"time":1795086165978,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":201},"responseTime":2.446124999999995,"msg":"request completed"}
{"level":30,"time":1795086165979,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"POST","url":"/api/v1/incidents/2f2ebef9-b33f-4735-ac2c-00be9662fd85/closure","host":"127.0.0.1:34155","remoteAddress":"127.0.0.1","remotePort":52408},"msg":"incoming request"}
{"level":30,"time":1795086165981,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":200},"responseTime":2.300641999999982,"msg":"request completed"}
{"level":30,"time":1795086165982,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents/2f2ebef9-b33f-4735-ac2c-00be9662fd85/aar","host":"127.0.0.1:44527","remoteAddress":"127.0.0.1","remotePort":42768},"msg":"incoming request"}
{"level":30,"time":1795086165984,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":201},"responseTime":2.54511100000002,"msg":"request completed"}
{"level":30,"time":1795086165985,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/incidents/2f2ebef9-b33f-4735-ac2c-00be9662fd85/aar/70a7ce42-87d8-4f33-98a3-2f7a4a7ce48b/finalize","host":"127.0.0.1:41625","remoteAddress":"127.0.0.1","remotePort":54622},"msg":"incoming request"}
{"level":30,"time":1795086165988,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":200},"responseTime":2.6947119999999813,"msg":"request completed"}
{"level":30,"time":1795086165988,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"PATCH","url":"/api/v1/incidents/2f2ebef9-b33f-4735-ac2c-00be9662fd85/aar/70a7ce42-87d8-4f33-98a3-2f7a4a7ce48b/finalize","host":"127.0.0.1:34003","remoteAddress":"127.0.0.1","remotePort":39852},"msg":"incoming request"}
{"level":30,"time":1795086165990,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":403},"responseTime":1.3073049999999853,"msg":"request completed"}
{"level":30,"time":1795086165991,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:33227","remoteAddress":"127.0.0.1","remotePort":44124},"msg":"incoming request"}
{"level":30,"time":1795086165994,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":201},"responseTime":2.8157899999999927,"msg":"request completed"}
{"level":30,"time":1795086165994,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents/701a85ed-ea19-4915-9a4c-411323ff0a5f/closure","host":"127.0.0.1:43479","remoteAddress":"127.0.0.1","remotePort":38000},"msg":"incoming request"}
{"level":30,"time":1795086165997,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":200},"responseTime":2.6944619999999873,"msg":"request completed"}
{"level":30,"time":1795086165998,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/701a85ed-ea19-4915-9a4c-411323ff0a5f/aar","host":"127.0.0.1:42791","remoteAddress":"127.0.0.1","remotePort":59130},"msg":"incoming request"}
{"level":30,"time":1795086166000,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":201},"responseTime":2.4452040000000466,"msg":"request completed"}
{"level":30,"time":1795086166001,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"PATCH","url":"/api/v1/incidents/701a85ed-ea19-4915-9a4c-411323ff0a5f/aar/4fc824af-5388-426f-bea0-f4a7b4d18287/finalize","host":"127.0.0.1:38191","remoteAddress":"127.0.0.1","remotePort":42696},"msg":"incoming request"}
{"level":30,"time":1795086166003,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":200},"responseTime":1.928562999999997,"msg":"request completed"}
{"level":30,"time":1795086166004,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","req":{"method":"GET","url":"/api/v1/evidence-log?actor_id=e2190d68-8f54-4188-ab31-fa9ee7c41cf5&page_size=200","host":"127.0.0.1:34175","remoteAddress":"127.0.0.1","remotePort":36644},"msg":"incoming request"}
{"level":30,"time":1795086166007,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","res":{"statusCode":200},"responseTime":2.616345000000024,"msg":"request completed"}
{"level":30,"time":1795086166008,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","req":{"method":"PATCH","url":"/api/v1/evidence-log","host":"127.0.0.1:42453","remoteAddress":"127.0.0.1","remotePort":37914},"msg":"incoming request"}
{"level":30,"time":1795086166009,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","res":{"statusCode":403},"responseTime":0.9837579999999662,"msg":"request completed"}
{"level":30,"time":1795086166010,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","req":{"method":"GET","url":"/api/v1/analytics/kpis?date_range=1970-01-01%2C2099-01-01","host":"127.0.0.1:36007","remoteAddress":"127.0.0.1","remotePort":56936},"msg":"incoming request"}
{"level":30,"time":1795086166012,"pid":165906,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","res":{"statusCode":200},"responseTime":2.76725799999997,"msg":"request completed"}
{"level":30,"time":1795086166270,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:37459","remoteAddress":"127.0.0.1","remotePort":41490},"msg":"incoming request"}
{"level":30,"time":1795086166283,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":13.018065000000007,"msg":"request completed"}
{"level":30,"time":1795086166285,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/activation","host":"127.0.0.1:34281","remoteAddress":"127.0.0.1","remotePort":53112},"msg":"incoming request"}
{"level":30,"time":1795086166288,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":422},"responseTime":2.4973209999999995,"msg":"request completed"}
{"level":30,"time":1795086166289,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"GET","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede","host":"127.0.0.1:43627","remoteAddress":"127.0.0.1","remotePort":48378},"msg":"incoming request"}
{"level":30,"time":1795086166291,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":200},"responseTime":2.2545950000000516,"msg":"request completed"}
{"level":30,"time":1795086166292,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/command-roles","host":"127.0.0.1:33425","remoteAddress":"127.0.0.1","remotePort":59940},"msg":"incoming request"}
{"level":30,"time":1795086166295,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":2.6261240000000043,"msg":"request completed"}
{"level":30,"time":1795086166296,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/activation","host":"127.0.0.1:34177","remoteAddress":"127.0.0.1","remotePort":48630},"msg":"incoming request"}
{"level":30,"time":1795086166298,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":2.6972260000000006,"msg":"request completed"}
{"level":30,"time":1795086166299,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/timeline","host":"127.0.0.1:39981","remoteAddress":"127.0.0.1","remotePort":39890},"msg":"incoming request"}
{"level":30,"time":1795086166302,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":2.3468989999999508,"msg":"request completed"}
{"level":30,"time":1795086166303,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/activation","host":"127.0.0.1:46387","remoteAddress":"127.0.0.1","remotePort":36214},"msg":"incoming request"}
{"level":30,"time":1795086166304,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":400},"responseTime":1.0623150000000123,"msg":"request completed"}
{"level":30,"time":1795086166305,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede","host":"127.0.0.1:42569","remoteAddress":"127.0.0.1","remotePort":44836},"msg":"incoming request"}
{"level":30,"time":1795086166307,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":1.8931759999999827,"msg":"request completed"}
{"level":30,"time":1795086166308,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/command-roles","host":"127.0.0.1:40919","remoteAddress":"127.0.0.1","remotePort":58154},"msg":"incoming request"}
{"level":30,"time":1795086166310,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":2.268962999999985,"msg":"request completed"}
{"level":30,"time":1795086166311,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"GET","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/timeline","host":"127.0.0.1:36201","remoteAddress":"127.0.0.1","remotePort":47402},"msg":"incoming request"}
{"level":30,"time":1795086166313,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":200},"responseTime":1.674946000000034,"msg":"request completed"}
{"level":30,"time":1795086166314,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/closure","host":"127.0.0.1:33099","remoteAddress":"127.0.0.1","remotePort":58502},"msg":"incoming request"}
{"level":30,"time":1795086166317,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":3.3017130000000066,"msg":"request completed"}
{"level":30,"time":1795086166318,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"GET","url":"/api/v1/incidents/0d0fbd3a-9c29-4364-bc9e-769ab6b4cede/timeline","host":"127.0.0.1:45759","remoteAddress":"127.0.0.1","remotePort":36202},"msg":"incoming request"}
{"level":30,"time":1795086166320,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":200},"responseTime":1.6312149999999974,"msg":"request completed"}
{"level":30,"time":1795086166321,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:44315","remoteAddress":"127.0.0.1","remotePort":53360},"msg":"incoming request"}
{"level":30,"time":1795086166324,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":201},"responseTime":2.71410800000001,"msg":"request completed"}
{"level":30,"time":1795086166324,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"POST","url":"/api/v1/incidents/af43a8ae-edab-449d-9b02-eb7bcec7ba4b/command-roles","host":"127.0.0.1:42355","remoteAddress":"127.0.0.1","remotePort":58914},"msg":"incoming request"}
{"level":30,"time":1795086166327,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":201},"responseTime":2.295613000000003,"msg":"request completed"}
{"level":30,"time":1795086166327,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/incidents/af43a8ae-edab-449d-9b02-eb7bcec7ba4b/command-roles","host":"127.0.0.1:37811","remoteAddress":"127.0.0.1","remotePort":38630},"msg":"incoming request"}
{"level":30,"time":1795086166330,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":201},"responseTime":2.0382789999999886,"msg":"request completed"}
{"level":30,"time":1795086166330,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","req":{"method":"GET","url":"/api/v1/incidents/af43a8ae-edab-449d-9b02-eb7bcec7ba4b/timeline","host":"127.0.0.1:35497","remoteAddress":"127.0.0.1","remotePort":44356},"msg":"incoming request"}
{"level":30,"time":1795086166332,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-g","res":{"statusCode":200},"responseTime":1.730009999999993,"msg":"request completed"}
{"level":30,"time":1795086166334,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40731","remoteAddress":"127.0.0.1","remotePort":40630},"msg":"incoming request"}
{"level":30,"time":1795086166336,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-h","res":{"statusCode":201},"responseTime":2.395830999999987,"msg":"request completed"}
{"level":30,"time":1795086166337,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","req":{"method":"POST","url":"/api/v1/incidents/ad71ecba-a7b7-473d-b84f-b9050a6baceb/activation","host":"127.0.0.1:41265","remoteAddress":"127.0.0.1","remotePort":42412},"msg":"incoming request"}
{"level":30,"time":1795086166338,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-i","res":{"statusCode":404},"responseTime":1.306904999999972,"msg":"request completed"}
{"level":30,"time":1795086166339,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","req":{"method":"POST","url":"/api/v1/incidents/ad71ecba-a7b7-473d-b84f-b9050a6baceb/command-roles","host":"127.0.0.1:41043","remoteAddress":"127.0.0.1","remotePort":40526},"msg":"incoming request"}
{"level":30,"time":1795086166340,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-j","res":{"statusCode":404},"responseTime":1.0804599999999596,"msg":"request completed"}
{"level":30,"time":1795086166341,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","req":{"method":"POST","url":"/api/v1/incidents/ad71ecba-a7b7-473d-b84f-b9050a6baceb/closure","host":"127.0.0.1:44467","remoteAddress":"127.0.0.1","remotePort":53322},"msg":"incoming request"}
{"level":30,"time":1795086166342,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-k","res":{"statusCode":404},"responseTime":0.9969320000000153,"msg":"request completed"}
{"level":30,"time":1795086166343,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","req":{"method":"POST","url":"/api/v1/incidents/ad71ecba-a7b7-473d-b84f-b9050a6baceb/activation","host":"127.0.0.1:36459","remoteAddress":"127.0.0.1","remotePort":54956},"msg":"incoming request"}
{"level":30,"time":1795086166345,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-l","res":{"statusCode":200},"responseTime":2.1704280000000153,"msg":"request completed"}
{"level":30,"time":1795086166346,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:42253","remoteAddress":"127.0.0.1","remotePort":50006},"msg":"incoming request"}
{"level":30,"time":1795086166348,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-m","res":{"statusCode":201},"responseTime":2.3723759999999743,"msg":"request completed"}
{"level":30,"time":1795086166349,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-n","req":{"method":"POST","url":"/api/v1/incidents/645ad30e-08c1-4390-94a3-c3b350f6c65a/closure","host":"127.0.0.1:42507","remoteAddress":"127.0.0.1","remotePort":39116},"msg":"incoming request"}
{"level":30,"time":1795086166351,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-n","res":{"statusCode":200},"responseTime":2.5378770000000372,"msg":"request completed"}
{"level":30,"time":1795086166352,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-o","req":{"method":"POST","url":"/api/v1/incidents/645ad30e-08c1-4390-94a3-c3b350f6c65a/closure","host":"127.0.0.1:42005","remoteAddress":"127.0.0.1","remotePort":52610},"msg":"incoming request"}
{"level":30,"time":1795086166354,"pid":165934,"hostname":"pivota-sandbox-8438da0f","reqId":"req-o","res":{"statusCode":409},"responseTime":1.8245979999999804,"msg":"request completed"}
{"level":30,"time":1795086166619,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:38069","remoteAddress":"127.0.0.1","remotePort":50190},"msg":"incoming request"}
{"level":30,"time":1795086166633,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":13.790324999999996,"msg":"request completed"}
{"level":30,"time":1795086166636,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689/submit-review","host":"127.0.0.1:35173","remoteAddress":"127.0.0.1","remotePort":46238},"msg":"incoming request"}
{"level":30,"time":1795086166641,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":4.579883000000052,"msg":"request completed"}
{"level":30,"time":1795086166643,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689/review","host":"127.0.0.1:43145","remoteAddress":"127.0.0.1","remotePort":54648},"msg":"incoming request"}
{"level":30,"time":1795086166645,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":403},"responseTime":2.1788029999999594,"msg":"request completed"}
{"level":30,"time":1795086166646,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"GET","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689","host":"127.0.0.1:36431","remoteAddress":"127.0.0.1","remotePort":52174},"msg":"incoming request"}
{"level":30,"time":1795086166648,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":200},"responseTime":2.2215929999999844,"msg":"request completed"}
{"level":30,"time":1795086166649,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689/review","host":"127.0.0.1:33899","remoteAddress":"127.0.0.1","remotePort":37452},"msg":"incoming request"}
{"level":30,"time":1795086166653,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":3.692385999999999,"msg":"request completed"}
{"level":30,"time":1795086166654,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689","host":"127.0.0.1:36685","remoteAddress":"127.0.0.1","remotePort":52620},"msg":"incoming request"}
{"level":30,"time":1795086166656,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":1.8478210000000104,"msg":"request completed"}
{"level":30,"time":1795086166657,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"POST","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689/sections/b598cdcd-6b4b-4624-909e-ac056a87ef78/link-tasks","host":"127.0.0.1:37221","remoteAddress":"127.0.0.1","remotePort":42298},"msg":"incoming request"}
{"level":30,"time":1795086166659,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":204},"responseTime":1.8778879999999845,"msg":"request completed"}
{"level":30,"time":1795086166660,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689","host":"127.0.0.1:46883","remoteAddress":"127.0.0.1","remotePort":59496},"msg":"incoming request"}
{"level":30,"time":1795086166662,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":2.0463039999999637,"msg":"request completed"}
{"level":30,"time":1795086166663,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:35473","remoteAddress":"127.0.0.1","remotePort":50180},"msg":"incoming request"}
{"level":30,"time":1795086166672,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":9.516897000000029,"msg":"request completed"}
{"level":30,"time":1795086166673,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"POST","url":"/api/v1/plans/35b7fe2f-c61f-41b3-8742-b5dfe5c84689/materialize-tasks","host":"127.0.0.1:36501","remoteAddress":"127.0.0.1","remotePort":56472},"msg":"incoming request"}
{"level":30,"time":1795086166677,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":200},"responseTime":3.924162000000024,"msg":"request completed"}
{"level":30,"time":1795086166679,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"GET","url":"/api/v1/tasks?incident=f70bc784-07f5-45b0-bad0-3703581a501f","host":"127.0.0.1:39573","remoteAddress":"127.0.0.1","remotePort":44804},"msg":"incoming request"}
{"level":30,"time":1795086166681,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":2.366465999999946,"msg":"request completed"}
{"level":30,"time":1795086166682,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:39149","remoteAddress":"127.0.0.1","remotePort":33594},"msg":"incoming request"}
{"level":30,"time":1795086166685,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":201},"responseTime":2.796162000000038,"msg":"request completed"}
{"level":30,"time":1795086166686,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"POST","url":"/api/v1/plans/2cce646c-20be-4132-9455-c6973a2f3979/review","host":"127.0.0.1:40719","remoteAddress":"127.0.0.1","remotePort":45942},"msg":"incoming request"}
{"level":30,"time":1795086166688,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":409},"responseTime":1.6295010000000048,"msg":"request completed"}
{"level":30,"time":1795086166688,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"POST","url":"/api/v1/plans","host":"127.0.0.1:42549","remoteAddress":"127.0.0.1","remotePort":50294},"msg":"incoming request"}
{"level":30,"time":1795086166691,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":201},"responseTime":2.2456090000000017,"msg":"request completed"}
{"level":30,"time":1795086166692,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","req":{"method":"POST","url":"/api/v1/plans/6938325f-dc92-46df-a6e0-b9fb7aa3de32/submit-review","host":"127.0.0.1:45799","remoteAddress":"127.0.0.1","remotePort":58194},"msg":"incoming request"}
{"level":30,"time":1795086166693,"pid":165953,"hostname":"pivota-sandbox-8438da0f","reqId":"req-f","res":{"statusCode":422},"responseTime":1.672522000000015,"msg":"request completed"}
{"level":30,"time":1795086166954,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/api-clients","host":"127.0.0.1:43293","remoteAddress":"127.0.0.1","remotePort":33442},"msg":"incoming request"}
{"level":30,"time":1795086166981,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":27.225622999999985,"msg":"request completed"}
{"level":30,"time":1795086166984,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/api-clients","host":"127.0.0.1:34119","remoteAddress":"127.0.0.1","remotePort":34792},"msg":"incoming request"}
{"level":30,"time":1795086166987,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":2.6893119999999726,"msg":"request completed"}
{"level":30,"time":1795086166988,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:46229","remoteAddress":"127.0.0.1","remotePort":48984},"msg":"incoming request"}
{"level":30,"time":1795086166990,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":400},"responseTime":1.7284369999999853,"msg":"request completed"}
{"level":30,"time":1795086166991,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/admin/federation-grants","host":"127.0.0.1:38743","remoteAddress":"127.0.0.1","remotePort":43564},"msg":"incoming request"}
{"level":30,"time":1795086166995,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":3.372434999999996,"msg":"request completed"}
{"level":30,"time":1795086166996,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/admin/federation-grants/8f8ee50c-3a24-4bfd-b4ff-a02ce9f56a90/revoke","host":"127.0.0.1:35053","remoteAddress":"127.0.0.1","remotePort":42954},"msg":"incoming request"}
{"level":30,"time":1795086166999,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":204},"responseTime":2.689081999999985,"msg":"request completed"}
{"level":30,"time":1795086167001,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:39821","remoteAddress":"127.0.0.1","remotePort":49778},"msg":"incoming request"}
{"level":30,"time":1795086167003,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":2.1972880000000146,"msg":"request completed"}
{"level":30,"time":1795086167004,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/admin/record-authority","host":"127.0.0.1:40839","remoteAddress":"127.0.0.1","remotePort":34638},"msg":"incoming request"}
{"level":30,"time":1795086167006,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":1.4184040000000095,"msg":"request completed"}
{"level":30,"time":1795086167007,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"POST","url":"/api/v1/admin/record-authority","host":"127.0.0.1:41301","remoteAddress":"127.0.0.1","remotePort":37802},"msg":"incoming request"}
{"level":30,"time":1795086167009,"pid":165964,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":1.735198999999966,"msg":"request completed"}
{"level":30,"time":1795086167266,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:39675","remoteAddress":"127.0.0.1","remotePort":33220},"msg":"incoming request"}
{"level":30,"time":1795086167270,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":422},"responseTime":4.48324199999999,"msg":"request completed"}
{"level":30,"time":1795086167273,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:40095","remoteAddress":"127.0.0.1","remotePort":56658},"msg":"incoming request"}
{"level":30,"time":1795086167275,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":422},"responseTime":1.7085590000000366,"msg":"request completed"}
{"level":30,"time":1795086167276,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:41855","remoteAddress":"127.0.0.1","remotePort":47326},"msg":"incoming request"}
{"level":30,"time":1795086167280,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":3.61628300000001,"msg":"request completed"}
{"level":30,"time":1795086167281,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:36413","remoteAddress":"127.0.0.1","remotePort":40466},"msg":"incoming request"}
{"level":30,"time":1795086167290,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":9.222634000000028,"msg":"request completed"}
{"level":30,"time":1795086167291,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:42637","remoteAddress":"127.0.0.1","remotePort":44616},"msg":"incoming request"}
{"level":30,"time":1795086167294,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":201},"responseTime":2.5768399999999474,"msg":"request completed"}
{"level":30,"time":1795086167295,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/incidents/433a46e3-dbd4-4bd8-a55a-59b278f35b86/timeline","host":"127.0.0.1:35369","remoteAddress":"127.0.0.1","remotePort":33084},"msg":"incoming request"}
{"level":30,"time":1795086167297,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":2.4364969999999744,"msg":"request completed"}
{"level":30,"time":1795086167299,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:46459","remoteAddress":"127.0.0.1","remotePort":42728},"msg":"incoming request"}
{"level":30,"time":1795086167301,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":201},"responseTime":2.1156839999999875,"msg":"request completed"}
{"level":30,"time":1795086167302,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"PATCH","url":"/api/v1/tasks/e5d1221e-33cf-4f15-8e0b-e8e7af82ad86/status","host":"127.0.0.1:39373","remoteAddress":"127.0.0.1","remotePort":60366},"msg":"incoming request"}
{"level":30,"time":1795086167303,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":409},"responseTime":1.74471699999998,"msg":"request completed"}
{"level":30,"time":1795086167305,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/tasks","host":"127.0.0.1:38309","remoteAddress":"127.0.0.1","remotePort":44214},"msg":"incoming request"}
{"level":30,"time":1795086167307,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":201},"responseTime":2.1440880000000107,"msg":"request completed"}
{"level":30,"time":1795086167308,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/tasks/74b86ef7-00a0-4456-8cc8-594d7c6f86ba/status","host":"127.0.0.1:43349","remoteAddress":"127.0.0.1","remotePort":52108},"msg":"incoming request"}
{"level":30,"time":1795086167309,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":409},"responseTime":1.4475490000000377,"msg":"request completed"}
{"level":30,"time":1795086167310,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"PATCH","url":"/api/v1/tasks/74b86ef7-00a0-4456-8cc8-594d7c6f86ba/status","host":"127.0.0.1:41553","remoteAddress":"127.0.0.1","remotePort":33028},"msg":"incoming request"}
{"level":30,"time":1795086167313,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":2.7140789999999697,"msg":"request completed"}
{"level":30,"time":1795086167314,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/tasks/74b86ef7-00a0-4456-8cc8-594d7c6f86ba/status","host":"127.0.0.1:38107","remoteAddress":"127.0.0.1","remotePort":43178},"msg":"incoming request"}
{"level":30,"time":1795086167315,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":409},"responseTime":1.3855030000000284,"msg":"request completed"}
{"level":30,"time":1795086167316,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"PATCH","url":"/api/v1/tasks/74b86ef7-00a0-4456-8cc8-594d7c6f86ba/status","host":"127.0.0.1:43657","remoteAddress":"127.0.0.1","remotePort":49292},"msg":"incoming request"}
{"level":30,"time":1795086167318,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":200},"responseTime":2.25449500000002,"msg":"request completed"}
{"level":30,"time":1795086167319,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"PATCH","url":"/api/v1/tasks/74b86ef7-00a0-4456-8cc8-594d7c6f86ba/status","host":"127.0.0.1:41027","remoteAddress":"127.0.0.1","remotePort":32856},"msg":"incoming request"}
{"level":30,"time":1795086167321,"pid":165977,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":200},"responseTime":2.1341390000000047,"msg":"request completed"}
{"level":30,"time":1795086167579,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/admin/users","host":"127.0.0.1:41805","remoteAddress":"127.0.0.1","remotePort":33470},"msg":"incoming request"}
{"level":30,"time":1795086167586,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":6.443455,"msg":"request completed"}
{"level":30,"time":1795086167589,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/admin/users?page_size=1000","host":"127.0.0.1:39103","remoteAddress":"127.0.0.1","remotePort":44362},"msg":"incoming request"}
{"level":30,"time":1795086167597,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":7.987463999999989,"msg":"request completed"}
{"level":30,"time":1795086167599,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43903","remoteAddress":"127.0.0.1","remotePort":48278},"msg":"incoming request"}
{"level":30,"time":1795086167602,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":200},"responseTime":2.6404699999999934,"msg":"request completed"}
{"level":30,"time":1795086167603,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"PATCH","url":"/api/v1/admin/users/07815a53-86d3-427b-b497-d76d8829abf5","host":"127.0.0.1:41369","remoteAddress":"127.0.0.1","remotePort":55098},"msg":"incoming request"}
{"level":30,"time":1795086167606,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":200},"responseTime":3.3825540000000274,"msg":"request completed"}
{"level":30,"time":1795086167608,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42205","remoteAddress":"127.0.0.1","remotePort":36194},"msg":"incoming request"}
{"level":30,"time":1795086167608,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":401},"responseTime":0.6192239999999742,"msg":"request completed"}
{"level":30,"time":1795086167610,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:46099","remoteAddress":"127.0.0.1","remotePort":50286},"msg":"incoming request"}
{"level":30,"time":1795086167612,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":403},"responseTime":1.9645199999999932,"msg":"request completed"}
{"level":30,"time":1795086167613,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"PATCH","url":"/api/v1/admin/roles/e0700f1e-0757-4bfb-9c0e-f6a9744a2ea9","host":"127.0.0.1:38435","remoteAddress":"127.0.0.1","remotePort":60670},"msg":"incoming request"}
{"level":30,"time":1795086167619,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":5.154211999999973,"msg":"request completed"}
{"level":30,"time":1795086167620,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/admin/audit-log","host":"127.0.0.1:46221","remoteAddress":"127.0.0.1","remotePort":41732},"msg":"incoming request"}
{"level":30,"time":1795086167622,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":2.7497149999999806,"msg":"request completed"}
{"level":30,"time":1795086167624,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=14cb8fc6-67ed-4708-9fba-c7f2cb5c780b&page_size=50","host":"127.0.0.1:33591","remoteAddress":"127.0.0.1","remotePort":41062},"msg":"incoming request"}
{"level":30,"time":1795086167625,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":200},"responseTime":1.5872810000000186,"msg":"request completed"}
{"level":30,"time":1795086167627,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","req":{"method":"PATCH","url":"/api/v1/admin/audit-log","host":"127.0.0.1:36235","remoteAddress":"127.0.0.1","remotePort":56638},"msg":"incoming request"}
{"level":30,"time":1795086167628,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-a","res":{"statusCode":403},"responseTime":1.1417050000000017,"msg":"request completed"}
{"level":30,"time":1795086167629,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","req":{"method":"POST","url":"/api/v1/admin/sso-config/test","host":"127.0.0.1:46167","remoteAddress":"127.0.0.1","remotePort":42450},"msg":"incoming request"}
{"level":30,"time":1795086167630,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-b","res":{"statusCode":200},"responseTime":1.37578400000001,"msg":"request completed"}
{"level":30,"time":1795086167631,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","req":{"method":"PATCH","url":"/api/v1/admin/sso-config","host":"127.0.0.1:36529","remoteAddress":"127.0.0.1","remotePort":57024},"msg":"incoming request"}
{"level":30,"time":1795086167633,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-c","res":{"statusCode":422},"responseTime":1.6688859999999863,"msg":"request completed"}
{"level":30,"time":1795086167634,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","req":{"method":"GET","url":"/api/v1/admin/sso-config","host":"127.0.0.1:39883","remoteAddress":"127.0.0.1","remotePort":38926},"msg":"incoming request"}
{"level":30,"time":1795086167636,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-d","res":{"statusCode":200},"responseTime":1.8041189999999574,"msg":"request completed"}
{"level":30,"time":1795086167636,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","req":{"method":"GET","url":"/api/v1/admin/audit-log?actor_id=14cb8fc6-67ed-4708-9fba-c7f2cb5c780b&action_type=record_view","host":"127.0.0.1:41915","remoteAddress":"127.0.0.1","remotePort":57136},"msg":"incoming request"}
{"level":30,"time":1795086167638,"pid":165987,"hostname":"pivota-sandbox-8438da0f","reqId":"req-e","res":{"statusCode":200},"responseTime":1.6620519999999601,"msg":"request completed"}
{"level":30,"time":1795086167893,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34005","remoteAddress":"127.0.0.1","remotePort":42828},"msg":"incoming request"}
{"level":30,"time":1795086167908,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":14.45168799999999,"msg":"request completed"}
{"level":30,"time":1795086167911,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:34685","remoteAddress":"127.0.0.1","remotePort":46914},"msg":"incoming request"}
{"level":30,"time":1795086167915,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":201},"responseTime":3.637964000000011,"msg":"request completed"}
{"level":30,"time":1795086167916,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:41715","remoteAddress":"127.0.0.1","remotePort":32844},"msg":"incoming request"}
{"level":30,"time":1795086167919,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":200},"responseTime":3.104721999999981,"msg":"request completed"}
{"level":30,"time":1795086167920,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39065","remoteAddress":"127.0.0.1","remotePort":52128},"msg":"incoming request"}
{"level":30,"time":1795086167923,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":201},"responseTime":3.073343999999963,"msg":"request completed"}
{"level":30,"time":1795086167925,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"GET","url":"/api/v1/operating-picture/markers?force_gis_failure=true","host":"127.0.0.1:33387","remoteAddress":"127.0.0.1","remotePort":59598},"msg":"incoming request"}
{"level":30,"time":1795086167927,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":2.0030330000000163,"msg":"request completed"}
{"level":30,"time":1795086167929,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/operating-picture/markers?bbox=1%2C2%2Cnotanumber","host":"127.0.0.1:37541","remoteAddress":"127.0.0.1","remotePort":57212},"msg":"incoming request"}
{"level":30,"time":1795086167930,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":200},"responseTime":1.7475220000000036,"msg":"request completed"}
{"level":30,"time":1795086167932,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/operating-picture/layers","host":"127.0.0.1:44597","remoteAddress":"127.0.0.1","remotePort":39216},"msg":"incoming request"}
{"level":30,"time":1795086167933,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":1.6709990000000516,"msg":"request completed"}
{"level":30,"time":1795086167935,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/operating-picture/markers","host":"127.0.0.1:39811","remoteAddress":"127.0.0.1","remotePort":39564},"msg":"incoming request"}
{"level":30,"time":1795086167937,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":1.9472780000000398,"msg":"request completed"}
{"level":30,"time":1795086167937,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"GET","url":"/api/v1/integrations/gis/health","host":"127.0.0.1:35681","remoteAddress":"127.0.0.1","remotePort":36280},"msg":"incoming request"}
{"level":30,"time":1795086167939,"pid":166040,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":200},"responseTime":1.7885100000000307,"msg":"request completed"}
{"level":30,"time":1795086168203,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:45043","remoteAddress":"127.0.0.1","remotePort":48848},"msg":"incoming request"}
{"level":30,"time":1795086168218,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":201},"responseTime":14.798890000000029,"msg":"request completed"}
{"level":30,"time":1795086168225,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/967e1dda-246c-40f0-aa20-cd7abb072322/timeline","host":"127.0.0.1:45129","remoteAddress":"127.0.0.1","remotePort":58970},"msg":"incoming request"}
{"level":30,"time":1795086168228,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":200},"responseTime":3.1745630000000347,"msg":"request completed"}
{"level":30,"time":1795086168233,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:39823","remoteAddress":"127.0.0.1","remotePort":48268},"msg":"incoming request"}
{"level":30,"time":1795086168236,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":201},"responseTime":3.2847809999999527,"msg":"request completed"}
{"level":30,"time":1795086168238,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/d23f704c-201b-4ef5-9e15-7a1276fbab0c/closure","host":"127.0.0.1:42541","remoteAddress":"127.0.0.1","remotePort":60318},"msg":"incoming request"}
{"level":30,"time":1795086168241,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":200},"responseTime":3.41047599999996,"msg":"request completed"}
{"level":30,"time":1795086168242,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/d23f704c-201b-4ef5-9e15-7a1276fbab0c/timeline","host":"127.0.0.1:32933","remoteAddress":"127.0.0.1","remotePort":35078},"msg":"incoming request"}
{"level":30,"time":1795086168244,"pid":166064,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":1.6113269999999602,"msg":"request completed"}
{"level":30,"time":1795086168498,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:43685","remoteAddress":"127.0.0.1","remotePort":47970},"msg":"incoming request"}
{"level":30,"time":1795086168503,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":200},"responseTime":5.182514999999995,"msg":"request completed"}
{"level":30,"time":1795086168506,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:42967","remoteAddress":"127.0.0.1","remotePort":60560},"msg":"incoming request"}
{"level":30,"time":1795086168506,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":401},"responseTime":0.18809299999998075,"msg":"request completed"}
{"level":30,"time":1795086168508,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:44299","remoteAddress":"127.0.0.1","remotePort":54008},"msg":"incoming request"}
{"level":30,"time":1795086168511,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":200},"responseTime":2.8618749999999977,"msg":"request completed"}
{"level":30,"time":1795086168512,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:44125","remoteAddress":"127.0.0.1","remotePort":56606},"msg":"incoming request"}
{"level":30,"time":1795086168513,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-4","res":{"statusCode":200},"responseTime":1.599234000000024,"msg":"request completed"}
{"level":30,"time":1795086168514,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35863","remoteAddress":"127.0.0.1","remotePort":54732},"msg":"incoming request"}
{"level":30,"time":1795086168516,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-5","res":{"statusCode":200},"responseTime":1.8026270000000295,"msg":"request completed"}
{"level":30,"time":1795086168517,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:35237","remoteAddress":"127.0.0.1","remotePort":35188},"msg":"incoming request"}
{"level":30,"time":1795086168518,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-6","res":{"statusCode":401},"responseTime":0.4089880000000221,"msg":"request completed"}
{"level":30,"time":1795086168519,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:34317","remoteAddress":"127.0.0.1","remotePort":35692},"msg":"incoming request"}
{"level":30,"time":1795086168520,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-7","res":{"statusCode":200},"responseTime":1.5098169999999982,"msg":"request completed"}
{"level":30,"time":1795086168523,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:42135","remoteAddress":"127.0.0.1","remotePort":60740},"msg":"incoming request"}
{"level":30,"time":1795086168525,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-8","res":{"statusCode":200},"responseTime":1.1918090000000348,"msg":"request completed"}
{"level":30,"time":1795086168527,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:37431","remoteAddress":"127.0.0.1","remotePort":37836},"msg":"incoming request"}
{"level":30,"time":1795086168528,"pid":166074,"hostname":"pivota-sandbox-8438da0f","reqId":"req-9","res":{"statusCode":401},"responseTime":0.9201780000000213,"msg":"request completed"}
{"level":30,"time":1795086168777,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:45901","remoteAddress":"127.0.0.1","remotePort":34928},"msg":"incoming request"}
{"level":30,"time":1795086168781,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-1","res":{"statusCode":403},"responseTime":3.7303970000000106,"msg":"request completed"}
{"level":30,"time":1795086168783,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:42407","remoteAddress":"127.0.0.1","remotePort":49590},"msg":"incoming request"}
{"level":30,"time":1795086168785,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-2","res":{"statusCode":403},"responseTime":1.3113229999999874,"msg":"request completed"}
{"level":30,"time":1795086168786,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:43203","remoteAddress":"127.0.0.1","remotePort":45806},"msg":"incoming request"}
{"level":30,"time":1795086168787,"pid":166087,"hostname":"pivota-sandbox-8438da0f","reqId":"req-3","res":{"statusCode":200},"responseTime":1.2905350000000055,"msg":"request completed"}

 Test Files  15 passed (15)
      Tests  87 passed (87)
   Start at  11:02:43
   Duration  5.43s (transform 192ms, setup 38ms, import 2.19s, tests 2.41s, environment 1ms)

> @epmp/design-system@0.1.0 test
> vitest run

[1m[7m[36m RUN [39m[27m[22m [36mv2.1.9 [39m[90m/home/daytona/project/frontend/design-system[39m

 [32m✓[39m test/data-viz.test.tsx [2m([22m[2m5 tests[22m[2m)[22m[90m 81[2mms[22m[39m
 [32m✓[39m test/foundations.test.tsx [2m([22m[2m23 tests[22m[2m)[22m[90m 114[2mms[22m[39m
 [32m✓[39m test/layout-nav.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 57[2mms[22m[39m
 [32m✓[39m test/maps.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 114[2mms[22m[39m
 [32m✓[39m test/forms.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 194[2mms[22m[39m
 [32m✓[39m test/data-overlays.test.tsx [2m([22m[2m6 tests[22m[2m)[22m[90m 103[2mms[22m[39m
 [32m✓[39m test/product-patterns.test.tsx [2m([22m[2m8 tests[22m[2m)[22m[90m 56[2mms[22m[39m

[2m Test Files [22m [1m[32m7 passed[39m[22m[90m (7)[39m
[2m      Tests [22m [1m[32m60 passed[39m[22m[90m (60)[39m
[2m   Start at [22m 11:02:48
[2m   Duration [22m 2.07s[2m (transform 278ms, setup 236ms, collect 777ms, tests 720ms, environment 1.41s, prepare 197ms)[22m
```

## Wave 2

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

## Wave 3

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

## Wave 4

- Build: `rc=0; (npm run build -w backend) || rc=$?; (npm run build -w frontend/design-system) || rc=$?; (npm run build -w frontend/app) || rc=$?; exit $rc` → pass
- Tests: `rc=0; (npm run test -w backend) || rc=$?; (npm run test -w frontend/design-system) || rc=$?; exit $rc` → pass
- Fix attempts: 0/3

## Backend pre-push gate

- Status: passed
- Result marker + failing output tail:
```
__GATE__ build_exit=0 test_exit=0 build_cmd=[npm run build] test_cmd=[npm test] head=c33b99adb51e2f8f289fd90a23d60e5373799442 test_files=41 skip_marks=0 shadow_files=0 untested=0
{"level":30,"time":1795023027506,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-1","res":{"statusCode":201},"responseTime":29.248425999999995,"msg":"request completed"}
{"level":30,"time":1795023027514,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","req":{"method":"GET","url":"/api/v1/incidents/3b48516e-0591-4753-972b-8874fcc04f42/timeline","host":"127.0.0.1:33161","remoteAddress":"127.0.0.1","remotePort":51880},"msg":"incoming request"}
{"level":30,"time":1795023027518,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","res":{"statusCode":200},"responseTime":3.8487520000000472,"msg":"request completed"}
{"level":30,"time":1795023027524,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","req":{"method":"POST","url":"/api/v1/incidents","host":"127.0.0.1:40167","remoteAddress":"127.0.0.1","remotePort":44076},"msg":"incoming request"}
{"level":30,"time":1795023027527,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","res":{"statusCode":201},"responseTime":3.6227159999999685,"msg":"request completed"}
{"level":30,"time":1795023027529,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-4","req":{"method":"POST","url":"/api/v1/incidents/06e1bed1-f08b-4e8c-a3cf-614df573240b/closure","host":"127.0.0.1:35647","remoteAddress":"127.0.0.1","remotePort":60304},"msg":"incoming request"}
{"level":30,"time":1795023027535,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-4","res":{"statusCode":200},"responseTime":5.805248000000006,"msg":"request completed"}
{"level":30,"time":1795023027537,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-5","req":{"method":"GET","url":"/api/v1/incidents/06e1bed1-f08b-4e8c-a3cf-614df573240b/timeline","host":"127.0.0.1:45877","remoteAddress":"127.0.0.1","remotePort":47548},"msg":"incoming request"}
{"level":30,"time":1795023027539,"pid":518176,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-5","res":{"statusCode":200},"responseTime":2.4629770000000235,"msg":"request completed"}
 [32m✓[39m src/modules/incident-ops/overdue-sweep.test.ts [2m([22m[2m4 tests[22m[2m)[22m[32m 143[2mms[22m[39m
{"level":30,"time":1795023027621,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-1","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:39099","remoteAddress":"127.0.0.1","remotePort":52898},"msg":"incoming request"}
{"level":30,"time":1795023027627,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-1","res":{"statusCode":200},"responseTime":5.619159000000025,"msg":"request completed"}
{"level":30,"time":1795023027629,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:40761","remoteAddress":"127.0.0.1","remotePort":60910},"msg":"incoming request"}
{"level":30,"time":1795023027629,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","res":{"statusCode":401},"responseTime":0.19297199999999748,"msg":"request completed"}
{"level":30,"time":1795023027631,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","req":{"method":"PATCH","url":"/api/v1/me/preferences","host":"127.0.0.1:39335","remoteAddress":"127.0.0.1","remotePort":46210},"msg":"incoming request"}
{"level":30,"time":1795023027634,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","res":{"statusCode":200},"responseTime":2.965502000000015,"msg":"request completed"}
{"level":30,"time":1795023027635,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-4","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:38721","remoteAddress":"127.0.0.1","remotePort":33138},"msg":"incoming request"}
{"level":30,"time":1795023027637,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-4","res":{"statusCode":200},"responseTime":1.819148000000041,"msg":"request completed"}
{"level":30,"time":1795023027638,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-5","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:36623","remoteAddress":"127.0.0.1","remotePort":57580},"msg":"incoming request"}
{"level":30,"time":1795023027639,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-5","res":{"statusCode":200},"responseTime":1.4939469999999915,"msg":"request completed"}
{"level":30,"time":1795023027640,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-6","req":{"method":"GET","url":"/api/v1/me","host":"127.0.0.1:46707","remoteAddress":"127.0.0.1","remotePort":36318},"msg":"incoming request"}
{"level":30,"time":1795023027641,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-6","res":{"statusCode":401},"responseTime":0.38740799999999354,"msg":"request completed"}
{"level":30,"time":1795023027642,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-7","req":{"method":"GET","url":"/api/v1/me/nav-config","host":"127.0.0.1:44785","remoteAddress":"127.0.0.1","remotePort":33628},"msg":"incoming request"}
{"level":30,"time":1795023027644,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-7","res":{"statusCode":200},"responseTime":1.382257999999979,"msg":"request completed"}
{"level":30,"time":1795023027645,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-8","req":{"method":"POST","url":"/api/v1/auth/sso/callback","host":"127.0.0.1:36797","remoteAddress":"127.0.0.1","remotePort":45746},"msg":"incoming request"}
{"level":30,"time":1795023027646,"pid":518189,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-8","res":{"statusCode":401},"responseTime":0.9335440000000403,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/routes.test.ts [2m([22m[2m6 tests[22m[2m)[22m[32m 115[2mms[22m[39m
{"level":30,"time":1795023027692,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-1","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:33137","remoteAddress":"127.0.0.1","remotePort":51574},"msg":"incoming request"}
{"level":30,"time":1795023027697,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-1","res":{"statusCode":403},"responseTime":3.980049000000008,"msg":"request completed"}
{"level":30,"time":1795023027699,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:37805","remoteAddress":"127.0.0.1","remotePort":39962},"msg":"incoming request"}
{"level":30,"time":1795023027701,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-2","res":{"statusCode":403},"responseTime":1.3352090000000203,"msg":"request completed"}
{"level":30,"time":1795023027702,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","req":{"method":"GET","url":"/api/v1/_test/rbac-reporting-edit-probe","host":"127.0.0.1:45859","remoteAddress":"127.0.0.1","remotePort":59764},"msg":"incoming request"}
{"level":30,"time":1795023027703,"pid":518200,"hostname":"pivota-sandbox-6b1d0337","reqId":"req-3","res":{"statusCode":200},"responseTime":1.2896840000000225,"msg":"request completed"}
 [32m✓[39m src/modules/auth-org/rbac.test.ts [2m([22m[2m3 tests[22m[2m)[22m[32m 76[2mms[22m[39m

[2m Test Files [22m [1m[32m15 passed[39m[22m[90m (15)[39m
[2m      Tests [22m [1m[32m86 passed[39m[22m[90m (86)[39m
[2m   Start at [22m 17:30:25
[2m   Duration [22m 2.43s[2m (transform 398ms, setup 54ms, import 3.03s, tests 3.02s, environment 1ms)[22m

```
