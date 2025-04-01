# Use official Node.js image as base
FROM node:20

# Set the working directory
WORKDIR /app

RUN mkdir -p /app/shared-utils
RUN mkdir -p /app/server

# First copy the shared-utils since it is a dependency used by the server
COPY ./shared-utils /app/shared-utils

# Copy the package.json and package-lock.json and install dependencies
COPY ./server/package*.json /app/server/
WORKDIR /app/server
RUN npm install

# Copy the rest of the application code
COPY ./server /app/server

# Start the app in development mode
CMD ["npm", "run", "dev"]
