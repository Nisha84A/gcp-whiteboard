# Stage 1: Build the Vite/TS frontend
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production - Node.js backend serving static frontend
FROM node:20-alpine
WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json ./backend/
RUN cd backend && npm ci

# Copy backend source
COPY backend/ ./backend/

# Copy Vite static assets from Stage 1
COPY --from=build /app/dist ./dist

# Copy public data files (JSON) into dist for static serving
COPY public ./dist

# Setup non-root user for security
RUN adduser -D appuser && chown -R appuser /app
USER appuser

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

WORKDIR /app/backend
CMD ["node", "--import", "tsx", "src/server.ts"]
