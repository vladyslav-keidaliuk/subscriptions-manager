#!/bin/bash

echo "🛑 Stopping any running containers..."
sudo docker-compose down --remove-orphans 2>/dev/null || true

echo "🧹 Cleaning up..."
sudo docker system prune -f 2>/dev/null || true

echo "🚀 Trying Clean Setup (Most Reliable)..."
echo "This setup handles everything at runtime to avoid build issues..."
if sudo docker-compose -f docker-compose.clean.yml up --build; then
    echo "✅ Success! App should be running at http://localhost:3000"
    echo "📧 Login: admin@example.com / password123"
else
    echo "❌ Clean setup failed, trying simple setup..."
    
    echo "🔄 Trying Simple Setup..."
    if sudo docker-compose -f docker-compose.simple.yml up --build; then
        echo "✅ Success! App should be running at http://localhost:3000"
        echo "📧 Login: admin@example.com / password123"
    else
        echo "❌ Both setups failed. Showing troubleshooting info..."
        echo ""
        echo "🔍 Troubleshooting:"
        echo "   1. Check Docker logs: sudo docker-compose logs"
        echo "   2. Verify Docker is running: sudo docker info"
        echo "   3. Clean everything: sudo docker system prune -a"
        echo "   4. Check disk space: df -h"
        echo ""
        echo "💡 Manual commands to try:"
        echo "   sudo docker-compose -f docker-compose.clean.yml up --build"
        exit 1
    fi
fi