# State Management Guide

## Overview

Chrono-Walk uses Redux for frontend state management and Python context-based patterns for backend state management.

## Frontend: Redux State Tree

```
store/
├── simulation/          # Simulation state
│   ├── currentMode
│   ├── isRunning
│   ├── progress
│   ├── results {}
│   ├── parameters {}
│   ├── error
│   └── history []
├── ui/                  # UI state
│   ├── darkMode
│   ├── sidebarOpen
│   ├── modals {}
│   ├── notifications []
│   └── language
├── cache/               # API cache
│   ├── responses {}
│   ├── hits / misses
│   └── settings
└── settings/            # User preferences
    ├── visualization {}
    ├── computation {}
    ├── accessibility {}
    └── notifications {}
```

## Using Redux

### Accessing State

```javascript
import { useSelector } from 'react-redux';
import { selectResults, selectIsRunning } from './store/slices/simulationSlice';

function CycleAnalysis() {
  const results = useSelector(selectResults);
  const isRunning = useSelector(selectIsRunning);
  
  return (
    <div>
      {isRunning && <LoadingSpinner />}
      {results && <ResultsChart data={results} />}
    </div>
  );
}
```

### Dispatching Actions

```javascript
import { useDispatch } from 'react-redux';
import { 
  runCycleAnalysis, 
  setParameters,
  clearError 
} from './store/slices/simulationSlice';

function ControlPanel() {
  const dispatch = useDispatch();
  
  const handleRun = () => {
    const params = { n: 10, beta: 0.5, simulations: 10000 };
    dispatch(runCycleAnalysis(params));
  };
  
  const handleParameterChange = (newParams) => {
    dispatch(setParameters(newParams));
  };
  
  const handleDismissError = () => {
    dispatch(clearError());
  };
  
  return (
    <div>
      <button onClick={handleRun}>Run</button>
      <button onClick={handleDismissError}>Dismiss Error</button>
    </div>
  );
}
```

## Slices

### Simulation Slice

Manages all simulation-related state:

```javascript
// Reducers
setMode(state, action)           // Set current analysis mode
setParameters(state, action)     // Update parameters
setProgress(state, action)       // Update progress (0-100)
clearError(state)                // Clear error message
clearResults(state, action)      // Clear specific results
addToHistory(state, action)      // Add to history log
resetSimulation(state)           // Reset all state

// Async Thunks (API calls)
runCycleAnalysis(params)         // Start cycle analysis
runHittingTimes(params)          // Start hitting time calc
runMixingTime(params)            // Start mixing time calc
```

### UI Slice

Manages UI-related state:

```javascript
toggleDarkMode()                 // Toggle theme
setSidebarOpen(boolean)          // Show/hide sidebar
setCurrentTab(string)            // Navigate tabs
openModal(name) / closeModal(name) // Modal control
addNotification(data)            // Show notification
setLanguage(code)                // Change language
```

### Cache Slice

Manages API response caching:

```javascript
setCached({ key, value })       // Store in cache
getCached(key)                   // Retrieve from cache
removeCached(key)                // Remove cached item
clearCache()                     // Clear all cache
```

### Settings Slice

Manages user preferences:

```javascript
setColorScheme(scheme)           // Visualization colors
setAnimationSpeed(speed)         // Animation speed (0.5-2.0)
setHighContrast(boolean)         // Accessibility setting
setLanguage(code)                // Preferred language
setUseBackendAPI(boolean)        // Use backend vs client
```

## Selectors

Use memoized selectors for performance:

```javascript
// Simulation selectors
selectCurrentMode(state)         // Current analysis mode
selectIsRunning(state)           // Is computation running?
selectProgress(state)            // Progress percentage
selectResults(state)             // All results
selectError(state)               // Error message
selectHistory(state)             // History log
selectParameters(state)          // Current parameters

// UI selectors
selectDarkMode(state)            // Dark mode enabled?
selectSidebarOpen(state)         // Is sidebar open?
selectLanguage(state)            // Current language

// Cache selectors
selectCacheStats(state)          // Cache hit rate, size, etc.

// Settings selectors
selectVisualization(state)       // Visualization preferences
selectAccessibility(state)       // Accessibility settings
```

## DevTools

### Redux DevTools Browser Extension

Install [Redux DevTools](https://github.com/reduxjs/redux-devtools-extension)

Features:
- 🔍 Inspect state at every action
- ⏮️ Time-travel debugging
- 📊 Action history
- 🔄 Replay actions
- 💾 Save/load state

```javascript
// App already configured in store/index.js
devTools: process.env.NODE_ENV !== 'production'
```

### Usage

1. Install extension in Chrome/Firefox
2. Open DevTools → Redux tab
3. Dispatch actions and inspect state
4. Use time-travel buttons to replay

## Backend: Python State Management

### SimulationContext (State Machine)

```python
from dataclasses import dataclass, field
from typing import Dict, Optional, List
import json

@dataclass
class SimulationState:
    """State representation for simulations"""
    id: str
    status: str  # 'idle', 'running', 'completed', 'failed'
    progress: float  # 0.0 - 1.0
    results: Optional[Dict] = None
    error: Optional[str] = None
    metadata: Dict = field(default_factory=dict)
    
    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'progress': self.progress,
            'results': self.results,
            'error': self.error,
            'metadata': self.metadata
        }

class SimulationContext:
    """Context manager for simulation lifecycle"""
    
    def __init__(self):
        self._states: Dict[str, SimulationState] = {}
    
    def start(self, sim_id: str) -> SimulationState:
        """Start new simulation"""
        state = SimulationState(id=sim_id, status='running', progress=0.0)
        self._states[sim_id] = state
        return state
    
    def update_progress(self, sim_id: str, progress: float):
        """Update progress (0.0-1.0)"""
        if sim_id in self._states:
            self._states[sim_id].progress = max(0.0, min(1.0, progress))
    
    def complete(self, sim_id: str, results: Dict):
        """Mark simulation complete"""
        if sim_id in self._states:
            self._states[sim_id].status = 'completed'
            self._states[sim_id].results = results
            self._states[sim_id].progress = 1.0
    
    def fail(self, sim_id: str, error: str):
        """Mark simulation failed"""
        if sim_id in self._states:
            self._states[sim_id].status = 'failed'
            self._states[sim_id].error = error
    
    def get_state(self, sim_id: str) -> Optional[SimulationState]:
        """Get current state"""
        return self._states.get(sim_id)

# Global context instance
simulation_context = SimulationContext()
```

### Usage in FastAPI

```python
from fastapi import FastAPI
import uuid

app = FastAPI()
context = SimulationContext()

@app.post("/api/cycle-analysis")
async def cycle_analysis(request: CycleAnalysisRequest):
    sim_id = str(uuid.uuid4())
    
    # Start simulation
    context.start(sim_id)
    
    try:
        # Run computation
        results = await run_cycle_analysis(
            n=request.n,
            beta=request.beta,
            simulations=request.simulations,
            on_progress=lambda p: context.update_progress(sim_id, p)
        )
        
        # Mark complete
        context.complete(sim_id, results)
        
        return {
            "success": True,
            "data": results,
            "simulation_id": sim_id
        }
    
    except Exception as e:
        context.fail(sim_id, str(e))
        raise HTTPException(status_code=500, detail=str(e))
```

### WebSocket for Real-time Updates

```python
from fastapi import WebSocket

@app.websocket("/ws/simulation/{sim_id}")
async def websocket_endpoint(websocket: WebSocket, sim_id: str):
    await websocket.accept()
    
    try:
        while True:
            # Send updates to client
            state = context.get_state(sim_id)
            
            if state:
                await websocket.send_json(state.to_dict())
            
            if state and state.status != 'running':
                break
            
            await asyncio.sleep(0.5)
    
    except ConnectionClosedOk:
        pass
```

## Performance Optimization

### 1. Memoization

```javascript
// Expensive selector
const expensiveSelector = (state) => {
  return state.results.data
    .filter(x => x.value > 0)
    .map(x => ({ ...x, computed: x.value * 2 }))
    .sort((a, b) => b.computed - a.computed);
};

// Memoized version
import { createSelector } from '@reduxjs/toolkit';

const selectMemoizedResults = createSelector(
  state => state.results.data,
  data => data
    .filter(x => x.value > 0)
    .map(x => ({ ...x, computed: x.value * 2 }))
    .sort((a, b) => b.computed - a.computed)
);
```

### 2. Normalized State

```javascript
// ❌ Nested state (expensive updates)
const badState = {
  data: [
    { id: 1, value: 100, nested: { deep: { value: 50 } } },
    { id: 2, value: 200, nested: { deep: { value: 100 } } }
  ]
};

// ✅ Normalized state (efficient updates)
const goodState = {
  entities: {
    1: { id: 1, value: 100, nestedId: 'n1' },
    2: { id: 2, value: 200, nestedId: 'n2' }
  },
  nested: {
    n1: { deep: { value: 50 } },
    n2: { deep: { value: 100 } }
  }
};
```

### 3. Reselect for Complex Queries

```javascript
import { createSelector } from 'reselect';

const selectResults = state => state.simulation.results;
const selectMode = state => state.simulation.currentMode;

export const selectModeResults = createSelector(
  [selectResults, selectMode],
  (results, mode) => results[mode] // Only recomputed if inputs change
);
```

## Redux Middleware

Custom middleware for logging:

```javascript
const loggerMiddleware = store => next => action => {
  console.log('Action:', action);
  const result = next(action);
  console.log('New State:', store.getState());
  return result;
};

export const store = configureStore({
  reducer: { /* ... */ },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware)
});
```

---

See [README.md](../README.md) for general architecture details.
