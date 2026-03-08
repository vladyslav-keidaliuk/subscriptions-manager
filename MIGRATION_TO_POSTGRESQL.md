# Migration from SQLite to PostgreSQL

## Overview

Your subscription manager has been successfully migrated from SQLite to PostgreSQL! This guide explains what changed and how to get started.

## What Changed

### Database Provider
- **Before:** SQLite with file-based database
- **After:** PostgreSQL with proper database server

### Docker Configurations
All Docker Compose files now include:
- PostgreSQL 15 Alpine service
- Health checks for database readiness
- Proper service dependencies
- Updated connection strings

### Environment Variables
Database URLs changed from:
```
DATABASE_URL=file:./data/app.db
```
To:
```
DATABASE_URL=postgresql://subscriptions_user:password@postgres:5432/database_name
```

## Getting Started

### Development
```bash
# Start with development database
npm run docker:dev
```

### Working Environment
```bash
# Start with the working configuration  
npm run docker:working
```

### Production
```bash
# Set environment variable for production
export POSTGRES_PASSWORD=your_secure_password

# Start production environment
npm run docker:prod
```

## Database Credentials by Environment

| Environment | Database | User | Password | Port |
|------------|----------|------|----------|------|
| Development | subscriptions_dev | subscriptions_user | dev_password | 5432 |
| Working | subscriptions | subscriptions_user | subscriptions_pass | 5432 |
| Simple | subscriptions_simple | subscriptions_user | simple_password | 5432 |
| Clean | subscriptions_clean | subscriptions_user | clean_password | 5432 |
| Minimal | subscriptions_minimal | subscriptions_user | minimal_password | 5432 |
| Production | subscriptions_prod | subscriptions_user | ${POSTGRES_PASSWORD} | 5432 |

## Benefits of PostgreSQL

✅ **Better Performance**: Improved concurrent read/write operations  
✅ **JSON Support**: Native JSON column types for subscription metadata  
✅ **Scalability**: Can handle much higher user loads  
✅ **Data Integrity**: Better transaction support and foreign keys  
✅ **Production Ready**: Industry standard for SaaS applications  
✅ **Advanced Features**: Full-text search, window functions, etc.  

## Migration Commands

If you have existing SQLite data you want to migrate:

```bash
# Generate a fresh migration
npx prisma migrate dev --name migrate_to_postgresql

# View the migration SQL
cat prisma/migrations/*/migration.sql

# Apply migration manually if needed
npx prisma db push
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Check database logs
docker-compose logs postgres

# Connect to database manually
docker exec -it <postgres_container> psql -U subscriptions_user -d subscriptions_dev
```

### Reset Database
```bash
# Stop and remove containers
docker-compose down

# Remove volumes (⚠️  This deletes all data!)
docker volume prune

# Start fresh
npm run docker:working
```

## Environment Variables for Production

Create a `.env.production` file:
```env
POSTGRES_PASSWORD=your_very_secure_password
SESSION_SECRET=your_session_secret_key
DATABASE_URL=postgresql://subscriptions_user:your_very_secure_password@postgres:5432/subscriptions_prod
```

⚠️ **Never commit passwords to git!** Add `.env.*` to your `.gitignore`.