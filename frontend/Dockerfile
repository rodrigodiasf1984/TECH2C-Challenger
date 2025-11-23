# frontend/Dockerfile

# 1. Base Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

COPY frontend/src ./src
COPY frontend/index.html .
COPY frontend/vite.config.ts .
COPY frontend/tailwind.config.js .
COPY frontend/postcss.config.js .
COPY frontend/tsconfig.json .
COPY frontend/tsconfig.app.json .
COPY frontend/tsconfig.node.json .
COPY frontend/.env* .

RUN npm run build

FROM nginx:alpine AS final

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]