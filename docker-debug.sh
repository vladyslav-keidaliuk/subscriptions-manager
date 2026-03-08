#!/bin/bash

echo "🔧 Debugging Docker issues..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Check if the user has Docker permissions
if ! docker ps > /dev/null 2>&1; then
    echo "⚠️  Permission denied. Running with sudo..."
    DOCKER_CMD="sudo docker"
    DOCKER_COMPOSE_CMD="sudo docker-compose"
else
    DOCKER_CMD="docker"
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "🐳 Docker command: $DOCKER_CMD"
echo "🐳 Docker Compose command: $DOCKER_COMPOSE_CMD"

# Clean up any previous containers
echo "🧹 Cleaning up previous containers..."
$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Remove any previous images
echo "🗑️  Removing previous images..."
$DOCKER_CMD image rm subscriptions-manager-app 2>/dev/null || true

# Build and start
echo "🚀 Building and starting containers..."
$DOCKER_COMPOSE_CMD up --build --force-recreate

echo "✅ Done!"