# --- Stage 1: Build the React app ---
FROM node:18-alpine AS builder
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Pass API URL to Vite at build time
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build the static files
RUN npm run build

# --- Stage 2: Serve the static files ---
FROM node:18-alpine
WORKDIR /app

# Install static file server
RUN npm install -g serve

# Copy build output from builder stage
COPY --from=builder /app/dist ./dist

# Serve on port 80 (not 5173)
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]
