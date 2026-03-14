FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Regenerate Prisma client for the runtime environment
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]
