# 🐳 Full Docker Setup - Subscription Manager

Everything is now properly containerized with Jenkins CI/CD! Here's your complete deployment setup:

## 📁 Configuration Files

- **`Dockerfile.prod`** - Production-optimized container
- **`Dockerfile.dev`** - Development container with hot reload
- **`docker-compose.yml`** - Development environment (default)
- **`docker-compose.staging.yml`** - Staging environment
- **`docker-compose.prod.yml`** - Production environment
- **`jenkins/`** - Complete Jenkins CI/CD setup
- **`scripts/`** - Deployment and utility scripts

## 🚀 Quick Start

**🎯 One-command setup:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**Or try these options in order:**

**Option 1: Jenkins CI/CD Setup (Recommended) ⭐**
```bash
./scripts/setup-jenkins.sh
```

**Option 2: Development Environment**
```bash
docker-compose up --build
```

**Option 3: Staging Environment**
```bash
docker-compose -f docker-compose.staging.yml up --build
```

**Option 4: Production Environment**
```bash
# Update .env.production first!
docker-compose -f docker-compose.prod.yml up --build
```

## 🏗️ CI/CD Pipeline

- **Jenkins**: Complete CI/CD with automated testing and deployment
- **Docker Registry**: Local registry for built images
- **Automated Testing**: TypeScript checks, security audits, health checks
- **Staging Deployment**: Auto-deploy from `develop` branch
- **Production Deployment**: Manual approval required for `main` branch

## ✅ What You Get

- **🔄 Hot Reload**: Development environment with live code updates
- **📊 Sample Data**: Pre-seeded database with example subscriptions
- **💾 Persistent Storage**: Database persists between container restarts
- **🔒 Secure**: Production setup with proper secrets management
- **🌐 Ready to Deploy**: Complete production configuration
- **🚀 CI/CD Pipeline**: Jenkins-based automated testing and deployment
- **📈 Health Monitoring**: Built-in health checks and monitoring
- **🔄 Blue-Green Deployment**: Zero-downtime production deployments

## 🎯 Access Points

- **Local Application**: http://localhost:3000
- **Tailscale Access**: http://100.120.67.89:3000 (accessible from any device on Tailscale network)
- **Staging**: http://localhost:3001  
- **Jenkins**: http://localhost:8080
- **Docker Registry**: http://localhost:5000
- **Default Login**: admin@example.com / password123

## 🛠️ Available Commands

```bash
./deploy.sh                    # Interactive deployment menu
./scripts/setup-jenkins.sh     # Setup Jenkins CI/CD
./scripts/deploy-staging.sh    # Deploy to staging
./scripts/deploy-production.sh # Deploy to production
./scripts/health-check.sh      # Run health checks
```

## 📖 Documentation

- **[README-DEPLOYMENT.md](README-DEPLOYMENT.md)** - Complete deployment guide
- **[Jenkinsfile](Jenkinsfile)** - CI/CD pipeline configuration

**Everything runs in Docker - no local Node.js installation needed!** 🎉