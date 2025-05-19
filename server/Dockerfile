FROM node:20-slim AS base
WORKDIR /app
COPY ./shared-utils /app/shared-utils
COPY ./server/package*.json /app/server/
WORKDIR /app/server

FROM base AS dev
RUN npm install
COPY ./server /app/server
CMD ["npm", "run", "dev"]

FROM base AS prod
RUN npm install --production
COPY ./server /app/server
CMD ["npm", "run", "start"]