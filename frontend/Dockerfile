# Multi-stage build for React app with Caddy server
# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the app
RUN pnpm run build

# Stage 2: Serve with Caddy
FROM caddy:2.7-alpine

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Copy built app from builder stage
COPY --from=builder /app/dist /srv

# Expose port (Railway will override with $PORT)
EXPOSE 8080

# Caddy will automatically use the Caddyfile
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
