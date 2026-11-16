# Emergency Preparedness and Resilience Platform

Created by Pivota. Planning documents live under `.planning/`.

## Development

Running `npm run dev` from the repo root starts Postgres/NATS/OPA/Keycloak via
`docker compose`, builds the design system, then runs the backend and frontend
dev servers concurrently.

- **Open `http://localhost:5173`** — the Vite dev server, which serves the
  real SPA with the sign-in flow. This is the URL to use when testing the app
  in a browser during native dev mode.
- `http://localhost:8080` is the backend API only. In native dev mode it has
  no built frontend to serve (`frontend/app/dist` only exists after
  `npm run build -w frontend/app`), so every non-`/api` GET there returns a
  bare JSON 404 — this is expected, not a bug.
- `pivota-deploy.yaml`'s `port: 8080` is the **production/deployed** port
  (where the Dockerfile's build stage has already run `vite build`, so
  `frontend/app/dist` exists and 8080 correctly serves the SPA) — it is not
  meant to be used directly in native dev mode.
