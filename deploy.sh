#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Validate required environment variables
if [ -z "$CLIENT_IMAGE_TAG" ]; then
    echo "Error: CLIENT_IMAGE_TAG environment variable is not set"
    exit 1
fi

if [ -z "$SERVER_IMAGE_TAG" ]; then
    echo "Error: SERVER_IMAGE_TAG environment variable is not set"
    exit 1
fi

if [ -z "$DOCKERHUB_USERNAME" ]; then
    echo "Error: DOCKERHUB_USERNAME environment variable is not set"
    exit 1
fi

# Pull the latest images
echo "Pulling images with tags:"
echo "Client: ${DOCKERHUB_USERNAME}/taskmaster-client:${CLIENT_IMAGE_TAG}"
echo "Server: ${DOCKERHUB_USERNAME}/taskmaster-server:${SERVER_IMAGE_TAG}"

docker pull ${DOCKERHUB_USERNAME}/taskmaster-client:${CLIENT_IMAGE_TAG} || exit 1
docker pull ${DOCKERHUB_USERNAME}/taskmaster-server:${SERVER_IMAGE_TAG} || exit 1

# Stop the old containers
echo "Stopping old containers..."
docker-compose -f docker-compose.deploy.yml down

# Start the containers using docker-compose
echo "Starting containers..."
docker-compose -f docker-compose.deploy.yml up -d || exit 1

# Check if containers are running
echo "Checking container status..."
if ! docker ps | grep -q "taskmaster-client" || ! docker ps | grep -q "taskmaster-server"; then
    echo "Error: One or more containers failed to start"
    exit 1
fi

# Cleanup old images
echo "Cleaning up old images..."
docker image prune -f

echo "Deployment complete! Your application should be accessible at:"
echo "Frontend: http://${SERVER_HOST}:${CLIENT_PORT:-80}"
echo "Backend: http://${SERVER_HOST}:${SERVER_PORT:-5000}"
