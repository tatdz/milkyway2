# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN npm run build

# Production image, copy only production dependencies
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5001

# Install only the runtime dependencies
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy package files for production install
COPY package.json package-lock.json* ./

# Install all dependencies since we need them for runtime
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /root/.npm

# Copy only the built application and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared

USER nextjs

EXPOSE 5001

ENV PORT=5001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "dist/index.js"] 