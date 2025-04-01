FROM node:20 AS build

WORKDIR /app

RUN mkdir -p /app/shared-utils
RUN mkdir -p /app/client

# First copy the shared-utils since it is a dependency used by the client
COPY ./shared-utils /app/shared-utils

# Then copy the package.json and package-lock.json and install dependencies
COPY ./client/package*.json /app/client
WORKDIR /app/client
RUN npm install

# Copy the application source code
COPY ./client /app/client

# Start the app in development mode
CMD ["npm", "start"]
