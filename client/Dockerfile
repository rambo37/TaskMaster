# Base layer
FROM node:20-slim AS base
WORKDIR /app
COPY ./shared-utils /app/shared-utils
COPY ./client/package*.json /app/client/
WORKDIR /app/client
RUN npm install
COPY ./client /app/client

# Dev stage
FROM base AS dev
CMD ["npm", "start"]

# Build stage (for production)
FROM base AS build
RUN npm run build

# Production: serve with NGINX
FROM nginx:alpine AS prod
COPY --from=build /app/client/build /usr/share/nginx/html
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
