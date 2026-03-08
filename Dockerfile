# Use Node.js 18 LTS
FROM node:18-alpine

# Install OpenSSL to fix Prisma warnings
RUN apk add --no-cache openssl

# Set working directory
WORKDIR /app

# Copy package*.json files
COPY package*.json ./

# Install all dependencies (including dev for build process)
RUN npm install

# Copy source code
COPY . .

# Create data directory for SQLite database
RUN mkdir -p /app/data && chmod 755 /app/data

# Generate Prisma client
RUN npx prisma generate

# Run database migrations
RUN DATABASE_URL="file:./data/production.db" npx prisma db push --skip-generate

# Seed database with sample data
RUN DATABASE_URL="file:./data/production.db" node prisma/seed.cjs

# Build the application
RUN npm run build

# Remove dev dependencies to keep image lean
RUN npm prune --omit=dev

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]