# ── Stage 1: Install & Build ─────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy workspace root manifests
COPY package.json package-lock.json ./

# Copy only the api workspace (skip web to avoid pulling its deps)
COPY apps/api/package.json apps/api/package.json

# Install all deps (including devDependencies needed for nest build)
RUN npm ci --workspace=apps/api --include-workspace-root

# Copy api source and build
COPY apps/api apps/api
RUN npm run api:build

# ── Stage 2: Production image ───────────────────────────────────────
FROM node:24-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy workspace root manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/package.json

# Install production-only deps
RUN npm ci --workspace=apps/api --include-workspace-root --omit=dev

# Copy compiled output from builder
COPY --from=builder /app/apps/api/dist apps/api/dist

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]
