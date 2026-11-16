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

# ---- runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 10001 epmp && adduser -D -u 10001 -G epmp epmp
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/migrations ./backend/migrations
COPY --from=build /app/backend/package.json ./backend/package.json
COPY --from=build /app/frontend/app/dist ./frontend/app/dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
USER 10001
EXPOSE 8080
CMD ["sh", "-c", "node backend/dist/db/migrate-runner.js && node backend/dist/server.js"]
