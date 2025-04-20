# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/tsconfig.json ./

# Install module-alias runtime support
RUN npm install module-alias

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "-r", "module-alias/register", "dist/index.js"]