# Multi-stage build for production
FROM node:18-alpine AS builder

# Build frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Build backend
FROM node:18-alpine

WORKDIR /app

# Copy backend files
COPY server/package*.json ./
RUN npm install --production

COPY server/ ./
COPY --from=builder /app/client/build ./public

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "index.js"]

