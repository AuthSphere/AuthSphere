# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json ./

# Copy workspace configurations
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/
COPY packages ./packages/

# Install dependencies (workspaces automatically link)
RUN npm ci

# Copy source
COPY frontend ./frontend

# Build args
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
WORKDIR /app/frontend
RUN npm run build

# Serve Stage
FROM nginx:alpine

# Copy build artifacts
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy custom nginx configuration
# (Note: we use frontend/nginx.conf since the build context is the monorepo root)
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
