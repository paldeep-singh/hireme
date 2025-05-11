# Step 1: Setup builder image
FROM node:23 as base

WORKDIR /workspace

# Install pnpm
RUN npm install -g pnpm

# Copy only the package manager files
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/jobs-dashboard/package.json apps/jobs-dashboard/package.json

# (Optional) If you have shared packages
COPY packages/shared/package.json packages/shared/package.json

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy everything now
COPY . .


#Build shared package
RUN pnpm --filter @repo/api-types run build

# Step 2: Build frontend (React)
RUN pnpm --filter jobs-dashboard build

# Step 3: Build backend (optional if TypeScript)
RUN pnpm --filter api build

COPY apps/api/.env apps/api/dist/.env

# Step 4: Create a clean production image
FROM nginx:stable-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built React app into nginx public folder
COPY --from=base /workspace/apps/jobs-dashboard/dist /usr/share/nginx/html

# Copy backend API server
COPY --from=base /workspace/apps/api /api

# Install Node.js in Nginx image (minimal for Express)
RUN apk add --no-cache nodejs

RUN apk add --no-cache nginx-mod-http-lua nginx-mod-http-headers-more


# Startup script
# COPY start.sh /start.sh
# RUN chmod +x /start.sh

# EXPOSE 80

# CMD ["/start.sh"]
