FROM node:21-alpine as base

ARG PORT \
    GATEWAY_URL \
    GITHUB_CLIENT_ID

ENV VITE_PORT=$PORT \
    VITE_GATEWAY_URL=$GATEWAY_URL \
    VITE_GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID

FROM base as deps

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

ARG PORT

COPY --from=deps /dist /usr/share/nginx/html

COPY --from=deps /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE $PORT

ENTRYPOINT ["nginx", "-g", "daemon off;"]