FROM node:20-alpine

WORKDIR /app

# Copy root configurations
COPY package.json package-lock.json ./

# Copy workspace configurations
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY packages ./packages/

# Install dependencies first (caching)
RUN npm ci

# Copy source code
COPY backend ./backend

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Start command
CMD ["npm", "start"]
