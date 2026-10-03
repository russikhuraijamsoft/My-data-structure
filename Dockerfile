# ==============================================================================
# TalkOS Restaurant Enterprise ERP - Google Cloud Run Production Dockerfile
# Optimized for Google Cloud Run, Cloud Build, and Artifact Registry
# ==============================================================================

# Stage 1: Build stage
FROM node:22-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests first for optimal layer caching
COPY package.json package-lock.json* bun.lock* ./

# Install all dependencies (including devDependencies required for vite build)
RUN npm install

# Copy application source code and configurations
COPY . .

# Build Vite client production bundle into /app/dist
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime Stage
# ==============================================================================
FROM node:22-slim AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Install curl/wget for container health check
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY package.json package-lock.json* bun.lock* ./

# Install production dependencies only to minimize image size and attack surface
RUN npm install --omit=dev

# Copy compiled frontend distribution from builder
COPY --from=builder /app/dist ./dist

# Copy server entrypoint and runtime configs
COPY server.ts ./
COPY firebase-applet-config.json ./
COPY firebase-blueprint.json ./

# Create non-root user and set permissions for security best practices
USER node

# Expose Google Cloud Run default port
EXPOSE 8080

# Cloud Run Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT:-8080}/api/health || exit 1

# Start TalkOS Full-Stack Server
CMD ["node", "server.ts"]
