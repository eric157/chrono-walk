from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
from chrono_walk import (
    run_simulations_fast,
    estimate_hitting_times,
    build_cycle_transition,
    build_random_graph,
    build_grid_graph,
    mixing_time
)

app = FastAPI(
    title="Chrono-Walk API",
    description="Backend API for Stochastic Simulator",
    version="1.0.0"
)

# Enable CORS for GitHub Pages frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# Request Models
# =========================

class CycleAnalysisRequest(BaseModel):
    n: int
    beta: float
    simulations: int = 50000

class HittingTimeRequest(BaseModel):
    n: int
    beta: float
    simulations: int = 500

class MixingTimeRequest(BaseModel):
    n: int
    num_trials: int = 3

# =========================
# Endpoints
# =========================

@app.get("/")
async def root():
    """API Health check"""
    return {
        "status": "ok",
        "message": "Chrono-Walk API is running",
        "version": "1.0.0"
    }

@app.post("/api/cycle-analysis")
async def cycle_analysis(request: CycleAnalysisRequest):
    """
    Run cycle graph analysis with simulations.
    
    Returns: occupancy distribution and step counts
    """
    try:
        last_nodes, steps, occupancy = run_simulations_fast(
            request.n, 
            request.beta, 
            request.simulations
        )
        
        return {
            "success": True,
            "data": {
                "occupancy": occupancy.tolist(),
                "steps": steps.tolist(),
                "last_nodes": last_nodes.tolist()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/hitting-times")
async def hitting_times(request: HittingTimeRequest):
    """
    Calculate hitting time matrix for cycle graph.
    
    Returns: H[i][j] = expected steps from node i to node j
    """
    try:
        H = estimate_hitting_times(
            request.n,
            request.beta,
            simulations=request.simulations
        )
        
        return {
            "success": True,
            "data": {
                "hitting_times": H.tolist()
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@app.post("/api/mixing-times")
async def mixing_times(request: MixingTimeRequest):
    """
    Compare mixing times across three graph types.
    
    Returns: cycle, random, and grid mixing times
    """
    try:
        mix_times = {
            "cycle": [],
            "random": [],
            "grid": []
        }
        
        for _ in range(request.num_trials):
            # Cycle graph
            P_cycle = build_cycle_transition(request.n, 0.5)
            mix_times["cycle"].append(float(mixing_time(P_cycle)))
            
            # Random graph
            P_random = build_random_graph(request.n)
            mix_times["random"].append(float(mixing_time(P_random)))
            
            # Grid graph
            P_grid = build_grid_graph(int(np.sqrt(request.n)))
            mix_times["grid"].append(float(mixing_time(P_grid)))
        
        return {
            "success": True,
            "data": {
                "cycle_times": mix_times["cycle"],
                "random_times": mix_times["random"],
                "grid_times": mix_times["grid"],
                "cycle_avg": float(np.mean(mix_times["cycle"])),
                "random_avg": float(np.mean(mix_times["random"])),
                "grid_avg": float(np.mean(mix_times["grid"]))
            }
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# =========================
# Health Check
# =========================

@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {
        "status": "healthy",
        "api": "Chrono-Walk"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
