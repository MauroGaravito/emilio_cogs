# --- Stage 1: Build the React app ---
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# --- Stage 2: Serve static files with a lightweight server ---
FROM node:18-alpine
WORKDIR /app

# Install 'serve' to host static files
RUN npm install -g serve

# Copy build output from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5173

# Serve built files
CMD ["serve", "-s", "dist", "-l", "5173"]
