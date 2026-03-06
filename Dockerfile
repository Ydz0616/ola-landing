FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Production ---
FROM node:20-alpine

WORKDIR /app

# Install all deps (tsx needed at runtime to run server.ts)
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY tsconfig.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
