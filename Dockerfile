# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm ci; fi

# Copy source code
COPY . .

# Build the application (Nuxt 4 with SSR: false will output to .output/public)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from builder
# Nuxt 4 outputs static files to .output/public when SSR is false
COPY --from=builder /app/.output/public /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

