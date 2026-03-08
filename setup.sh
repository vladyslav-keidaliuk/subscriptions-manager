#!/bin/bash

echo "🚀 Setting up Subscription Manager..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Set up database
echo "🗄️ Setting up database..."
npm run db:generate
npm run db:push

echo "🌱 Seeding database with sample data..."
npm run db:seed

echo "✅ Setup complete!"
echo ""
echo "🎉 You can now start the development server with:"
echo "   npm run dev"
echo ""
echo "📧 Default login credentials:"
echo "   Email: admin@example.com"
echo "   Password: password123"
echo ""
echo "🌐 The app will be available at: http://localhost:3000"