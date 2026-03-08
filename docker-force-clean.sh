#!/bin/bash

echo "🛑 Stopping all containers..."
sudo docker-compose down --remove-orphans 2>/dev/null || true

echo "🧹 Force cleaning Docker cache..."
sudo docker system prune -af --volumes

echo "🚀 Trying the working setup (bypasses ES module issues)..."
sudo docker-compose -f docker-compose.working.yml up --build

echo "✅ Done! App should be at http://localhost:3000"