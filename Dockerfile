# ---- deps ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package.json
COPY frontend/design-system/package.json frontend/design-system/package.json
COPY frontend/app/package.json frontend/app/package.json
RUN npm install --include=dev

# ---- build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run --workspace=frontend/design-system build
RUN npm run --workspace=frontend/app build
RUN npm run --workspace=backend build

# ---- deps-prod ----
# A standalone (non-workspace) production-only install of backend's own
# package.json. The runtime stage only ever executes backend/dist/*.js —
# frontend/app is pre-built static output (no node_modules needed to serve
# it) and frontend/design-system is a build-time-only dependency of
# frontend/app's build (already baked into frontend/app/dist). Copying the
# FULL `deps` node_modules (as a simpler first pass did) drags every
# devDependency across EVERY workspace into the runtime image — including
# vite/vitest/tinypool/esbuild's bundled Go stdlib, which carry fixable
# CRITICAL CVEs the platform's image scanner blocks on. This stage installs
# only backend's `dependencies`, eliminating that surface entirely rather
# than attempting to selectively prune it out of a shared node_modules tree.
#
# `devDependencies` is deleted from the copied package.json (not just
# filtered via `--omit=dev`) before install: npm's arborist peer-dependency
# resolution throws "Cannot read properties of null (reading 'edgesOut')"
# on this workspace's devDependencies graph (vitest's peer-dep set)
# regardless of --omit=dev, because the ideal tree is still built including
# devDependencies before the omit filter is applied. Removing the key
# upfront means npm never attempts to resolve that subtree at all.
FROM node:22-alpine AS deps-prod
WORKDIR /app/backend
COPY backend/package.json ./package.json
RUN node -e "const p=require('./package.json'); delete p.devDependencies; require('fs').writeFileSync('./package.json', JSON.stringify(p));" \
    && npm install --omit=dev

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 10001 epmp && adduser -D -u 10001 -G epmp epmp
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/migrations ./backend/migrations
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/frontend/app/dist ./frontend/app/dist
COPY --from=deps-prod /app/backend/node_modules ./backend/node_modules
USER 10001
EXPOSE 8080
CMD ["sh", "-c", "node backend/dist/db/migrate-runner.js && node backend/dist/server.js"]
