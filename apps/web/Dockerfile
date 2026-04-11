# ── Stage 1: Install & Build ─────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy workspace root manifests
COPY package.json package-lock.json ./

# Copy only the web workspace
COPY apps/web/package.json apps/web/package.json

# Install all deps (including devDependencies needed for next build)
RUN npm ci --workspace=apps/web --include-workspace-root

# Copy web source and build
COPY apps/web apps/web
ENV NEXT_TELEMETRY_DISABLED=1
ENV API_INTERNAL_URL=http://api:7341
RUN npm run web:build

# ── Stage 2: Production image ───────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy workspace root manifests
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json

# Install production-only deps
RUN npm ci --workspace=apps/web --include-workspace-root --omit=dev

# Copy built output and config from builder
COPY --from=builder /app/apps/web/.next apps/web/.next
COPY --from=builder /app/apps/web/public apps/web/public
COPY --from=builder /app/apps/web/next.config.js apps/web/next.config.js

EXPOSE 7340

CMD ["npm", "run", "web:start"]
