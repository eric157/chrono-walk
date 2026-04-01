# Backend API for Chrono-Walk

A FastAPI backend for the Chrono-Walk Stochastic Simulator. Optional - the frontend runs algorithms in the browser, but the backend can handle heavier computations and provide an API for other clients.

**Stack:** FastAPI + Uvicorn + NumPy (Python 3.8+)

## Endpoints

### GET `/`
Health check / API info

### GET `/health`
Health check endpoint for monitoring

### POST `/api/cycle-analysis`
Run cycle graph analysis with simulations.

**Request:**
```json
{
  "n": 12,
  "beta": 0.5,
  "simulations": 50000
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "occupancy": [0.1, 0.2, ...],
    "steps": [150, 200, ...],
    "last_nodes": [5, 3, ...]
  }
}
```

### POST `/api/hitting-times`
Calculate hitting time matrix for cycle graph.

**Request:**
```json
{
  "n": 10,
  "beta": 0.5,
  "simulations": 500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hitting_times": [[0, 5.2, 10.1, ...], ...]
  }
}
```

### POST `/api/mixing-times`
Compare mixing times across graph types.

**Request:**
```json
{
  "n": 10,
  "num_trials": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "cycle_times": [1.5, 1.6, 1.5],
    "random_times": [8.2, 8.3, 8.1],
    "grid_times": [3.2, 3.3, 3.1],
    "cycle_avg": 1.53,
    "random_avg": 8.2,
    "grid_avg": 3.2
  }
}
```


app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing

```bash
# Run health check
curl http://localhost:8000/health

# Run cycle analysis
curl -X POST http://localhost:8000/api/cycle-analysis \
  -H "Content-Type: application/json" \
  -d '{"n": 10, "beta": 0.5, "simulations": 5000}'
```

## Performance Considerations

- Cycle Analysis: 50k simulations ≈ 10-20s (with Numba JIT compilation)
- Hitting Times: 10x10 matrix ≈ 5-10s
- Mixing Times: 3 graphs × 3 trials ≈ 15-30s

For frequently accessed endpoints, consider:
- Response caching with Redis
- Database storage of results
- Background task queue (Celery + Redis)

## License

MIT
