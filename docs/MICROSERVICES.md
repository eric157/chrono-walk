# Microservices Architecture Guide

## Overview

Chrono-Walk uses a containerized microservices architecture for scalability, independent deployment, and high availability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Internet / Users                          │
└──────────────────┬──────────────────────────────────────────┘
                   │
            ┌──────▼──────┐
            │   Traefik   │ ◄─── Load Balancer & Reverse Proxy
            │   (Proxy)   │
            └───┬─────┬───┘
     ┌──────────┘     └──────────┐
     │                           │
┌────▼────┐              ┌───────▼─────┐
│Frontend  │              │   Backend   │
│ (React)  │              │  (FastAPI)  │
└──────────┘              └───┬────┬────┘
                             │    │
                    ┌────────┘    └────────┐
                    │                     │
            ┌───────▼─────┐      ┌────────▼────┐
            │ PostgreSQL  │      │    Redis    │
            │ (Database)  │      │   (Cache)   │
            └─────────────┘      └─────────────┘
                    │                     │
            ┌───────▼─────────────────────▼─────┐
            │   Prometheus + Grafana (Monitoring)
            └─────────────────────────────────────┘
```

## Services

### 1. Frontend Service

**Image:** `chrono-walk-frontend`
**Port:** 3000
**Technology:** Node.js + Vite

```dockerfile
FROM node:18-alpine AS builder
# Build React app with Vite
COPY frontend/ .
RUN npm run build

FROM node:18-alpine
# Serve static files
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
CMD ["serve", "-s", "dist", "-l", "3000"]
```

**Features:**
- ✅ Multi-stage build for optimization
- ✅ Health checks
- ✅ Environment variables for API URL

### 2. Backend API Service

**Image:** `chrono-walk-api`
**Port:** 8000
**Technology:** Python + FastAPI + Gunicorn

```dockerfile
FROM python:3.10-slim
# Install dependencies
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
# Run with Gunicorn → Uvicorn workers
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "main:app"]
```

**Features:**
- ✅ Production-grade ASGI server (Gunicorn)
- ✅ Health checks
- ✅ Database connectivity
- ✅ Cache integration

### 3. PostgreSQL Database

**Image:** `postgres:15-alpine`
**Port:** 5432
**Volume:** `postgres_data:/var/lib/postgresql/data`

**Features:**
- ✅ Persistent data storage
- ✅ Health checks
- ✅ Backup capabilities
- ✅ Automatic initialization

### 4. Redis Cache

**Image:** `redis:7-alpine`
**Port:** 6379
**Volume:** `redis_data:/data`

**Features:**
- ✅ Session caching
- ✅ Query result caching
- ✅ Background task queue (optional)
- ✅ AOF persistence

### 5. Prometheus Monitoring

**Image:** `prom/prometheus:latest`
**Port:** 9090

**Features:**
- ✅ Metrics collection from services
- ✅ 15-day data retention
- ✅ Custom alert rules

### 6. Grafana Dashboards

**Image:** `grafana/grafana:latest`
**Port:** 3001
**Default:** admin/admin

**Features:**
- ✅ Real-time dashboards
- ✅ Service health visualization
- ✅ Custom alerts
- ✅ Data exploration

### 7. Traefik Reverse Proxy

**Image:** `traefik:latest`
**Port:** 80, 8080 (dashboard)

**Features:**
- ✅ Automatic HTTPS (Let's Encrypt)
- ✅ Load balancing
- ✅ Path-based routing
- ✅ Service discovery

### 8. PgAdmin (Optional)

**Image:** `dpage/pgadmin4:latest`
**Port:** 5050

Database management UI for PostgreSQL

### 9. Redis Commander (Optional)

**Image:** `rediscommander/redis-commander:latest`
**Port:** 8081

Redis management UI

## Deployment Commands

### Start All Services

```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d api
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 100 lines
docker-compose logs --tail 100 frontend
```

### Stop Services

```bash
# Stop all (keep data)
docker-compose stop

# Stop specific
docker-compose stop api

# Remove containers (keep data)
docker-compose down

# Remove everything
docker-compose down -v
```

### Service Status

```bash
# List running services
docker-compose ps

# Check logs for errors
docker-compose logs api
```

## Configuration

### Environment Variables

Create `.env` file in project root:

```bash
# Frontend
VITE_API_URL=http://api:8000
NODE_ENV=production

# Backend
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/chrono_walk
REDIS_URL=redis://redis:6379/0
CORS_ORIGINS=http://localhost:3000
LOG_LEVEL=INFO

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=chrono_walk
```

### Volume Persistence

All important data stored in volumes:

```yaml
volumes:
  postgres_data:      # Database files
  redis_data:         # Cache snapshots
  prometheus_data:    # Metrics
  grafana_data:       # Dashboards & configs
  pgadmin_data:       # PgAdmin settings
```

Backup volumes:

```bash
# Backup database
docker-compose exec postgres pg_dump -U postgres chrono_walk > backup.sql

# Restore database
docker-compose exec -T postgres psql -U postgres chrono_walk < backup.sql
```

## Networking

Services communicate via Docker network `chrono-walk`:

```
frontend → api        (http://api:8000)
api → postgres        (postgresql://postgres:5432)
api → redis           (redis://redis:6379)
prometheus → services (http://service:port/metrics)
traefik → all services
```

Access services:

| Service | URL | Access |
|---------|-----|--------|
| Frontend | http://localhost:3000 | Public |
| API | http://localhost:8000 | Private (via Traefik) |
| API Docs | http://localhost:8000/docs | Private |
| Prometheus | http://localhost:9090 | Local only |
| Grafana | http://localhost:3001 | Local only (admin/admin) |
| Traefik | http://localhost:8080 | Local only |

## Scaling

### Horizontal Scaling

Scale specific services:

```bash
# Run 3 API instances
docker-compose up -d --scale api=3

# Traefik automatically load-balances between instances
```

### Production Deployment

For Kubernetes:

```bash
# Build images
docker build -t chrono-walk-frontend:latest -f Dockerfile.frontend .
docker build -t chrono-walk-api:latest -f Dockerfile.backend .

# Push to registry
docker push myregistry/chrono-walk-frontend:latest
docker push myregistry/chrono-walk-api:latest

# Deploy with Helm
helm install chrono-walk ./helm-charts
```

## Monitoring

### Health Checks

All services have health endpoints:

```bash
# Frontend
curl http://localhost:3000

# API
curl http://localhost:8000/health

# Database
docker-compose exec postgres pg_isready

# Redis
docker-compose exec redis redis-cli ping
```

### Metrics

Prometheus scrapes metrics from:
- **API:** http://api:8000/metrics
- **Database:** (via postgres_exporter)
- **Redis:** (via redis_exporter)

View in Grafana: http://localhost:3001

## Troubleshooting

### Services won't start

```bash
# Check Docker daemon
docker info

# Check logs
docker-compose logs api
docker-compose logs -f

# Validate docker-compose.yml
docker-compose config
```

### Database connection failed

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres psql -U postgres -c "SELECT 1"

# Check connection string in API logs
docker-compose logs api | grep DATABASE_URL
```

### Out of disk space

```bash
# Clean up unused images/containers
docker system prune

# Remove specific volume
docker volume rm chrono-walk_postgres_data
```

### High memory usage

```bash
# Check resource usage
docker stats

# Limit service resources
# Edit docker-compose.yml and add:
# deploy:
#   resources:
#     limits:
#       memory: 512M
```

## Production Checklist

- [ ] Use strong passwords for all services
- [ ] Enable HTTPS with Traefik + Let's Encrypt
- [ ] Set up automated backups
- [ ] Configure monitoring and alerts
- [ ] Set resource limits for all services
- [ ] Enable container restart policies
- [ ] Set up log aggregation
- [ ] Configure rate limiting and CORS
- [ ] Use secrets for credentials
- [ ] Test disaster recovery procedure

## Performance Optimization

1. **Database Indexing:** Add indexes for frequent queries
2. **Redis Caching:** Cache expensive API responses
3. **CDN:** Serve static frontend via CDN
4. **Compression:** Enable gzip compression
5. **Database Replication:** Set up read replicas
6. **Load Testing:** Test with `ab` or `wrk`

```bash
# Load test API endpoint
ab -n 10000 -c 100 http://localhost:8000/health
```

---

See [README.md](../README.md) for additional setup information.
