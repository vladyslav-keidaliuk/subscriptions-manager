# Subscription Manager

A modern web application for managing your subscriptions built with Remix, TypeScript, and SQLite.

## Features

- 🔐 User authentication (login/register)
- 📋 Subscription CRUD operations (Create, Read, Update, Delete)
- 📊 Dashboard with subscription statistics
- 💰 Cost tracking and upcoming payment notifications
- 🔄 Multiple billing cycles (Monthly, Quarterly, Yearly)
- 📱 Responsive design
- 🐳 Docker ready

## Tech Stack

- **Frontend**: Remix (React), TypeScript
- **Backend**: Remix (Node.js), TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: Session-based with bcrypt
- **Styling**: Tailwind CSS
- **Containerization**: Docker

## Getting Started

### Prerequisites

- Node.js 18+ (if running locally)
- Docker and Docker Compose (recommended)

### 🐳 Docker Setup (Recommended)

**Quick Start with Docker:**
```bash
# Clone the repository
git clone <your-repo-url>
cd subscriptions-manager

# Clean Docker setup (most reliable) ⭐
sudo docker-compose -f docker-compose.clean.yml up --build

# Alternative: Simple Docker setup  
sudo docker-compose -f docker-compose.simple.yml up --build

# Or run the auto-fix script that tries multiple approaches
chmod +x docker-fix.sh
./docker-fix.sh
```

**Manual Docker Commands:**
```bash
# Clean setup (recommended) ⭐
sudo docker-compose -f docker-compose.clean.yml up --build

# Simple production-like setup
sudo docker-compose -f docker-compose.simple.yml up --build

# Development environment (with hot reload and sample data)
npm run docker:dev

# Production environment
npm run docker:prod

# Stop containers
npm run docker:down

# Auto-fix with multiple attempts
npm run docker:fix

# View logs
docker-compose logs
```

The Docker setup includes:
- ✅ Complete environment isolation
- ✅ Automatic database setup and seeding
- ✅ Hot reload for development
- ✅ Persistent data storage
- ✅ Production-ready configuration

### 💻 Local Development (Alternative)

If you prefer to run without Docker:

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd subscriptions-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Apply database migrations
npm run db:push

# Seed the database with sample data
npm run db:seed
```

4. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Docker Development

1. **Build and run with Docker Compose**
```bash
# Build the application
docker-compose up --build

# Or use the npm script
npm run docker:build
npm run docker:run
```

## Default Login

When you seed the database, a default user is created:

- **Email**: admin@example.com
- **Password**: password123

## Database Schema

The application uses two main models:

- **User**: Stores user authentication information
- **Subscription**: Stores subscription details with relationships to users

### Subscription Fields

- Name and description
- Price and currency
- Billing cycle (Monthly/Quarterly/Yearly)
- Status (Active/Paused/Cancelled/Expired)
- Next billing date
- Created/Updated timestamps

## API Routes

- `GET /` - Dashboard
- `GET /login` - Login page
- `POST /login` - Login handler
- `GET /join` - Registration page
- `POST /join` - Registration handler
- `GET /logout` - Logout handler
- `GET /subscriptions` - Subscription list
- `GET /subscriptions/new` - New subscription form
- `POST /subscriptions/new` - Create subscription
- `GET /subscriptions/:id` - Subscription details
- `POST /subscriptions/:id` - Update/delete subscription

## Development Scripts

### 🐳 Docker Commands
```bash
# Clean setup (most reliable) ⭐
npm run docker:clean

# Simple setup (avoids permission issues) 
npm run docker:simple

# Development environment (with hot reload)
npm run docker:dev

# Production environment
npm run docker:prod

# Stop all containers
npm run docker:down

# Auto-fix with multiple attempts
npm run docker:fix

# Build production image
npm run docker:build

# Run production container
npm run docker:run
```

### 💻 Local Development Commands
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Database operations
npm run db:generate    # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:migrate    # Create and run migrations
npm run db:reset      # Reset database
npm run db:seed       # Seed with sample data
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="file:./dev.db"

# Session secret for authentication
SESSION_SECRET="super-duper-s3cret"

# Environment
NODE_ENV="development"
```

## Production Deployment

### 🐳 Docker Production (Recommended)

1. **Create production environment file:**
```bash
# Create .env.production
echo "DATABASE_URL=file:./data/production.db" > .env.production
echo "SESSION_SECRET=$(openssl rand -base64 32)" >> .env.production
echo "NODE_ENV=production" >> .env.production
```

2. **Deploy with Docker Compose:**
```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d --build

# Or use the npm script
npm run docker:prod
```

3. **Monitor the application:**
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs

# Check container status
docker-compose -f docker-compose.prod.yml ps
```

### 📦 Manual Production Deployment

If deploying without Docker:

1. **Set environment variables**
   - `DATABASE_URL`: Your production database URL
   - `SESSION_SECRET`: A strong secret for session management
   - `NODE_ENV=production`

2. **Build the application**
```bash
npm run build
```

3. **Run database migrations**
```bash
npm run db:migrate
```

4. **Start the server**
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.