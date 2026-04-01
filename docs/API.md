# API Documentation

## Overview

Chrono-Walk provides a comprehensive REST API for stochastic simulations. The API handles heavy computations server-side and returns results for visualization.

**Base URL:** `http://localhost:8000` (development) | `https://api.chrono-walk.com` (production)

**API Version:** 1.0.0

## Authentication

Currently, the API is open without authentication. For production deployments, add OAuth2:

```javascript
// Frontend with OAuth2
const token = await getAuthToken();
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## Status Endpoints

### GET `/health`

Health check for monitoring

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-04-01T12:00:00Z",
  "version": "1.0.0",
  "backends": {
    "numpy": true,
    "algorithm": true
  }
}
```

### GET `/stats`

API performance statistics

**Response (200):**
```json
{
  "performance": {
    "avg_ms": 4500.0,
    "min_ms": 2000.0,
    "max_ms": 9000.0
  },
  "cache_info": {
    "hits": 245,
    "misses": 53
  }
}
```

## Simulation Endpoints

### POST `/api/cycle-analysis`

Run cycle graph analysis with Monte Carlo simulation

**Request:**
```json
{
  "n": 12,
  "beta": 0.5,
  "simulations": 50000
}
```

**Parameters:**
| Name | Type | Range | Description |
|------|------|-------|-------------|
| `n` | integer | 3-100 | Number of nodes in cycle graph |
| `beta` | float | 0-1 | Drift parameter (0=leftward, 1=rightward) |
| `simulations` | integer | 100-100000 | Number of Monte Carlo trials |

**Response (200):**
```json
{
  "success": true,
  "timestamp": "2024-04-01T12:00:00Z",
  "parameters": {
    "n": 12,
    "beta": 0.5,
    "simulations": 50000
  },
  "data": {
    "occupancy": [0.08, 0.09, ..., 0.08],
    "steps": [200, 250, ..., 220],
    "last_nodes": [0, 5, ..., 11],
    "mean_cover": 250.5,
    "std_cover": 45.2
  },
  "computation_time_ms": 7500.0
}
```

### POST `/api/hitting-times`

Calculate hitting time matrix

**Request:**
```json
{
  "n": 10,
  "beta": 0.5,
  "simulations": 500
}
```

**Response (200):**
```json
{
  "success": true,
  "timestamp": "2024-04-01T12:00:00Z",
  "parameters": {
    "n": 10,
    "beta": 0.5,
    "simulations": 500
  },
  "hitting_times": [
    [0.0, 1.5, 3.2, 5.1, ...],
    [1.5, 0.0, 1.7, 3.4, ...],
    ...
  ],
  "max_hitting_time": 25.3,
  "computation_time_ms": 3200.0
}
```

### POST `/api/mixing-time`

Calculate mixing time

**Request:**
```json
{
  "n": 10,
  "beta": 0.5,
  "epsilon": 0.1
}
```

**Response (200):**
```json
{
  "success": true,
  "timestamp": "2024-04-01T12:00:00Z",
  "parameters": {
    "n": 10,
    "beta": 0.5,
    "epsilon": 0.1
  },
  "mixing_time": 45.3,
  "computation_time_ms": 1200.0
}
```

### POST `/api/graph-comparison`

Compare mixing times across graph types

**Request:**
```json
{
  "n": 10,
  "simulations": 1000
}
```

**Response (200):**
```json
{
  "success": true,
  "timestamp": "2024-04-01T12:00:00Z",
  "parameters": {
    "n": 10,
    "simulations": 1000
  },
  "comparison": {
    "cycle": 45.3,
    "random": 23.5,
    "grid": 67.8
  },
  "computation_time_ms": 5000.0
}
```

## Cache Management

### POST `/api/cache/clear`

Clear computation cache

**Response (200):**
```json
{
  "status": "cache cleared"
}
```

## Error Responses

### HTTP 400 - Bad Request

Invalid parameters

```json
{
  "success": false,
  "error": "Parameter 'n' must be between 3 and 100",
  "timestamp": "2024-04-01T12:00:00Z"
}
```

### HTTP 500 - Internal Server Error

Server error during computation

```json
{
  "success": false,
  "error": "Computation failed: numerical error",
  "timestamp": "2024-04-01T12:00:00Z"
}
```

## Rate Limiting

- **Requests per minute:** 100
- **Max concurrent requests:** 10
- **Request timeout:** 30 seconds

## Usage Examples

### cURL

```bash
# Cycle analysis
curl -X POST http://localhost:8000/api/cycle-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "n": 12,
    "beta": 0.5,
    "simulations": 50000
  }'
```

### JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:8000/api/cycle-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    n: 12,
    beta: 0.5,
    simulations: 50000
  })
});

const data = await response.json();
console.log(data);
```

### Python (Requests)

```python
import requests

response = requests.post(
  'http://localhost:8000/api/cycle-analysis',
  json={
    'n': 12,
    'beta': 0.5,
    'simulations': 50000
  }
)

print(response.json())
```

## API Documentation UI

Interactive API documentation available at:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Webhooks (Future)

Planned for v2.0: Webhooks for long-running computations

```json
{
  "event": "simulation.completed",
  "data": { ... },
  "timestamp": "2024-04-01T12:00:00Z"
}
```

## Pagination

For endpoints returning large datasets:

```
GET /api/results?page=1&limit=50&sort=created_at
```

## Versioning

API versioning via URL:
- Current: `http://localhost:8000/api/v1/...`
- Legacy: `http://localhost:8000/api/v0/...` (deprecated)

---

See [ARCHITECTURE.md](ARCHITECTURE.md) for more details.
