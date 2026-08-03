# Multi-stage Dockerfile for Hono.js Cloud Run API
FROM node:20-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy root workspace files
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install and build
RUN pnpm install --frozen-lockfile
RUN npx turbo run build --filter=@iis/api...

FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8080

CMD ["node", "dist/index.js"]
