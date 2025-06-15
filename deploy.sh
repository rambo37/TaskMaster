#!/bin/bash

# Load environment variables from .env file
set -a
source .env
set +a

# Pull the latest images
echo "Pulling latest images..."
docker pull ${DOCKERHUB_USERNAME}/taskmaster-client:latest || exit 1
docker pull ${DOCKERHUB_USERNAME}/taskmaster-server:latest || exit 1

# Start the containers using docker-compose
echo "Starting containers..."
docker-compose -f docker-compose.prod.yml up -d || exit 1

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
echo "Frontend: http://${SERVER_HOST}:80"
echo "Backend: http://${SERVER_HOST}:5000" 