# Build stage
FROM node:21-alpine AS base

ARG PORT
ARG GATEWAY_URL
ARG GITHUB_CLIENT_ID

ENV VITE_PORT=$PORT
ENV VITE_GATEWAY_URL=$GATEWAY_URL
ENV VITE_GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM nginxinc/nginx-unprivileged:alpine AS production

ARG PORT

COPY --from=base /app/dist /usr/share/nginx/html

COPY --from=base /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE $PORT

CMD ["nginx", "-g", "daemon off;"]