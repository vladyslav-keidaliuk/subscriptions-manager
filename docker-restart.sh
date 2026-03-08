#!/bin/bash

echo "🛑 Stopping the current container..."
sudo docker-compose -f docker-compose.clean.yml down

echo "🔧 Fixed ES module issues in package.json"
echo "📦 Rebuilding with corrected configuration..."

sudo docker-compose -f docker-compose.clean.yml up --build

echo "✅ Done! App should now start properly at http://localhost:3000"