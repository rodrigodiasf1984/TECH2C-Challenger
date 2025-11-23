# backend/Dockerfile

# 1. Base Stage
FROM node:20-alpine AS base

# 2. Dependencies Stage
FROM base AS deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev

# 3. Build Stage
FROM base AS build
WORKDIR /app
COPY backend/tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY backend/package.json ./
RUN npm install
COPY backend/src ./src
RUN npm run build 

# 4. Production Stage:
FROM node:20-alpine AS final 

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist 
COPY backend/package.json .

EXPOSE 3333

CMD ["npm", "run", "start"]