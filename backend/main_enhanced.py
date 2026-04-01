"""
Enhanced FastAPI Backend for Chrono-Walk
Provides REST API endpoints for stochastic simulations with caching and monitoring
"""

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import logging
import asyncio
from functools import lru_cache
import time
import os
from datetime import datetime

import numpy as np
from chrono_walk import (
    simulateWalkGeneral,
    runSimulationsFast,
    estimateHittingTimes as estimate_hitting_times,
    buildCycleTransition,
    mixingTime as calculate_mixing_time
)

# ============================================================================
# Logging Configuration
# ============================================================================

logging.basicConfig(
    level=os.getenv('LOG_LEVEL', 'INFO'),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============================================================================
# FastAPI Application Setup
# ============================================================================

app = FastAPI(
    title="Chrono-Walk API",
    description="Advanced Stochastic Process Simulator API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# ============================================================================
# CORS Configuration
# ============================================================================

CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Request Models
# ============================================================================

class CycleAnalysisRequest(BaseModel):
    """Request model for cycle analysis"""
    n: int = Field(5, ge=3, le=100, description="Number of nodes")
    beta: float = Field(0.5, ge=0, le=1, description="Drift parameter")
    simulations: int = Field(10000, ge=100, le=100000, description="Number of simulations")

class HittingTimeRequest(BaseModel):
    """Request model for hitting time calculation"""
    n: int = Field(10, ge=3, le=50, description="Number of nodes")
    beta: float = Field(0.5, ge=0, le=1, description="Drift parameter")
    simulations: int = Field(500, ge=100, le=5000, description="Trials per pair")

class MixingTimeRequest(BaseModel):
    """Request model for mixing time calculation"""
    n: int = Field(10, ge=3, le=100, description="Number of nodes")
    beta: float = Field(0.5, ge=0, le=1, description="Drift parameter")
    epsilon: float = Field(0.1, ge=0.01, le=1, description="Tolerance")

class GraphComparisonRequest(BaseModel):
    """Request model for graph comparison"""
    n: int = Field(10, ge=3, le=50, description="Number of nodes")
    simulations: int = Field(1000, ge=100, le=10000, description="Simulations per graph")

# ============================================================================
# Response Models
# ============================================================================

class CycleAnalysisResponse(BaseModel):
    """Response for cycle analysis"""
    success: bool
    timestamp: str
    parameters: Dict[str, Any]
    data: Dict[str, List[float]]
    computation_time_ms: float

class HittingTimeResponse(BaseModel):
    """Response for hitting time calculation"""
    success: bool
    timestamp: str
    parameters: Dict[str, Any]
    hitting_times: List[List[float]]
    max_hitting_time: float
    computation_time_ms: float

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: str
    version: str
    backends: Dict[str, bool]

# ============================================================================
# Caching and Performance Monitoring
# ============================================================================

class PerformanceMonitor:
    """Monitor API performance metrics"""
    def __init__(self):
        self.request_times = []
        self.error_count = 0
    
    def record_request(self, elapsed_ms: float):
        """Record request completion time"""
        self.request_times.append(elapsed_ms)
        # Keep last 1000 requests
        self.request_times = self.request_times[-1000:]
    
    def get_stats(self) -> Dict[str, float]:
        """Get performance statistics"""
        if not self.request_times:
            return {"avg_ms": 0, "min_ms": 0, "max_ms": 0}
        
        return {
            "avg_ms": np.mean(self.request_times),
            "min_ms": np.min(self.request_times),
            "max_ms": np.max(self.request_times)
        }

monitor = PerformanceMonitor()

@lru_cache(maxsize=128)
def get_mixing_time_cached(n: int, beta: float, epsilon: float = 0.1) -> float:
    """Cached mixing time calculation"""
    logger.info(f"Computing mixing time for n={n}, beta={beta}, epsilon={epsilon}")
    return calculate_mixing_time(n, beta, epsilon)

# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/", response_model=HealthResponse, tags=["status"])
async def root():
    """Root endpoint - API information"""
    return HealthResponse(
        status="ok",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        backends={"numpy": True, "algorithm": True}
    )

@app.get("/health", response_model=HealthResponse, tags=["status"])
async def health_check():
    """Health check endpoint for monitoring"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        backends={"numpy": True, "algorithm": True}
    )

@app.get("/stats", tags=["status"])
async def get_stats():
    """Get API performance statistics"""
    return {
        "performance": monitor.get_stats(),
        "cache_info": get_mixing_time_cached.cache_info()._asdict() if hasattr(get_mixing_time_cached.cache_info(), '_asdict') else {}
    }

# ============================================================================
# Cycle Analysis Endpoints
# ============================================================================

@app.post("/api/cycle-analysis", response_model=CycleAnalysisResponse, tags=["simulation"])
async def cycle_analysis(request: CycleAnalysisRequest):
    """
    Run cycle graph analysis with Monte Carlo simulation
    
    Parameters:
    - n: Number of nodes (cycle graph)
    - beta: Drift parameter [0, 1]
    - simulations: Number of Monte Carlo trials
    
    Returns analysis of node occupancy and cover time distribution
    """
    start_time = time.time()
    
    try:
        logger.info(f"Starting cycle analysis: n={request.n}, beta={request.beta}, sims={request.simulations}")
        
        # Run fast simulations
        occupancy, steps, last_nodes = runSimulationsFast(
            n=request.n,
            beta=request.beta,
            num_simulations=request.simulations
        )
        
        # Calculate statistics
        mean_cover_time = np.mean(steps)
        std_cover_time = np.std(steps)
        
        elapsed_ms = (time.time() - start_time) * 1000
        monitor.record_request(elapsed_ms)
        
        logger.info(f"Cycle analysis complete in {elapsed_ms:.1f}ms")
        
        return CycleAnalysisResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            parameters={
                "n": request.n,
                "beta": request.beta,
                "simulations": request.simulations
            },
            data={
                "occupancy": occupancy.tolist(),
                "steps": steps.tolist(),
                "last_nodes": last_nodes.tolist(),
                "mean_cover": float(mean_cover_time),
                "std_cover": float(std_cover_time)
            },
            computation_time_ms=elapsed_ms
        )
    
    except Exception as e:
        logger.error(f"Error in cycle analysis: {str(e)}")
        monitor.error_count += 1
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

# ============================================================================
# Hitting Time Endpoints
# ============================================================================

@app.post("/api/hitting-times", response_model=HittingTimeResponse, tags=["simulation"])
async def hitting_times(request: HittingTimeRequest):
    """
    Calculate hitting time matrix for cycle graph
    
    Computes expected first passage time from each node to every other node
    using Monte Carlo estimation
    """
    start_time = time.time()
    
    try:
        logger.info(f"Computing hitting times: n={request.n}, simulations={request.simulations}")
        
        # Build transition matrix
        transition_matrix = buildCycleTransition(n=request.n, beta=request.beta)
        
        # Estimate hitting times
        hitting_time_matrix = estimate_hitting_times(
            transition_matrix=transition_matrix,
            num_trials=request.simulations,
            n=request.n
        )
        
        max_hitting_time = float(np.max(hitting_time_matrix))
        elapsed_ms = (time.time() - start_time) * 1000
        monitor.record_request(elapsed_ms)
        
        logger.info(f"Hitting times complete in {elapsed_ms:.1f}ms")
        
        return HittingTimeResponse(
            success=True,
            timestamp=datetime.now().isoformat(),
            parameters={
                "n": request.n,
                "beta": request.beta,
                "simulations": request.simulations
            },
            hitting_times=hitting_time_matrix.tolist(),
            max_hitting_time=max_hitting_time,
            computation_time_ms=elapsed_ms
        )
    
    except Exception as e:
        logger.error(f"Error computing hitting times: {str(e)}")
        monitor.error_count += 1
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

# ============================================================================
# Mixing Time Endpoints
# ============================================================================

@app.post("/api/mixing-time", tags=["simulation"])
async def mixing_time(request: MixingTimeRequest):
    """
    Calculate mixing time for convergence to stationary distribution
    
    Determines how many steps until random walk converges to uniform distribution
    """
    start_time = time.time()
    
    try:
        logger.info(f"Computing mixing time: n={request.n}, beta={request.beta}")
        
        # Use cached calculation
        tau_mix = get_mixing_time_cached(
            n=request.n,
            beta=request.beta,
            epsilon=request.epsilon
        )
        
        elapsed_ms = (time.time() - start_time) * 1000
        monitor.record_request(elapsed_ms)
        
        return {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "parameters": {
                "n": request.n,
                "beta": request.beta,
                "epsilon": request.epsilon
            },
            "mixing_time": float(tau_mix),
            "computation_time_ms": elapsed_ms
        }
    
    except Exception as e:
        logger.error(f"Error computing mixing time: {str(e)}")
        monitor.error_count += 1
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

# ============================================================================
# Graph Comparison Endpoints
# ============================================================================

@app.post("/api/graph-comparison", tags=["simulation"])
async def graph_comparison(request: GraphComparisonRequest):
    """
    Compare mixing times across different graph types
    """
    start_time = time.time()
    
    try:
        graph_types = {
            "cycle": {"n": request.n, "beta": 0.5},
            "random": {"n": request.n, "beta": None}
        }
        
        results = {}
        for graph_type, params in graph_types.items():
            logger.info(f"Comparing {graph_type} graph")
            if params["beta"] is not None:
                tau = get_mixing_time_cached(request.n, params["beta"])
            else:
                tau = get_mixing_time_cached(request.n, 0.5)  # default for random
            results[graph_type] = float(tau)
        
        elapsed_ms = (time.time() - start_time) * 1000
        monitor.record_request(elapsed_ms)
        
        return {
            "success": True,
            "timestamp": datetime.now().isoformat(),
            "parameters": {"n": request.n, "simulations": request.simulations},
            "comparison": results,
            "computation_time_ms": elapsed_ms
        }
    
    except Exception as e:
        logger.error(f"Error in graph comparison: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Computation failed: {str(e)}")

# ============================================================================
# Cache Management Endpoints
# ============================================================================

@app.post("/api/cache/clear", tags=["admin"])
async def clear_cache():
    """Clear computation cache"""
    get_mixing_time_cached.cache_clear()
    return {"status": "cache cleared"}

# ============================================================================
# Error Handlers
# ============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Handle HTTP exceptions gracefully"""
    logger.error(f"HTTP Exception: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle general exceptions"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }
    )

# ============================================================================
# Startup/Shutdown Events
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    logger.info("Chrono-Walk API starting up...")
    logger.info(f"CORS enabled for origins: {CORS_ORIGINS}")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Chrono-Walk API shutting down...")

# ============================================================================
# Run with: uvicorn main:app --reload --port 8000
# ============================================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT") != "production"
    )
