#!/bin/bash

echo "🐳 Setting up Subscription Manager with Docker..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check Docker permissions and set appropriate commands
if ! docker ps > /dev/null 2>&1; then
    echo "⚠️  Need sudo permissions for Docker..."
    DOCKER_COMPOSE_CMD="sudo docker-compose"
else
    DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "📦 Building and starting containers..."

# Clean up any previous containers
$DOCKER_COMPOSE_CMD down --remove-orphans 2>/dev/null || true

# Build and start the development environment
$DOCKER_COMPOSE_CMD up --build --force-recreate -d

echo "⏳ Waiting for the application to start..."
sleep 10

echo "✅ Docker setup complete!"
echo ""
echo "🎉 Your Subscription Manager is now running in Docker!"
echo ""
echo "🌐 Application URL: http://localhost:3000"
echo ""
echo "📧 Default login credentials:"
echo "   Email: admin@example.com"
echo "   Password: password123"
echo ""
echo "🐳 Useful Docker commands:"
echo "   npm run docker:dev     # Start development environment"
echo "   npm run docker:prod    # Start production environment"
echo "   npm run docker:down    # Stop containers"
echo "   docker-compose logs    # View logs"
echo ""
echo "📊 To stop the containers, run:"
echo "   npm run docker:down"