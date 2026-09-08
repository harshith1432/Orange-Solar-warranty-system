# ==============================================================================
# Multi-stage Dockerfile for React/Vite Frontend
# ==============================================================================

# Stage 1: Build React static bundle using Node.js
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve static files with lightweight Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose web server port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
