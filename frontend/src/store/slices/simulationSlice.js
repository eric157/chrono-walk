/**
 * Simulation State Slice
 * 
 * Manages state for all simulation operations:
 * - Running simulations
 * - Results
 * - Progress tracking
 * - Error handling
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/apiClient';

// Define async thunks for API calls
export const runCycleAnalysis = createAsyncThunk(
  'simulation/runCycleAnalysis',
  async (params, { rejectWithValue }) => {
    try {
      const result = await api.cycleAnalysis(params);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const runHittingTimes = createAsyncThunk(
  'simulation/runHittingTimes',
  async (params, { rejectWithValue }) => {
    try {
      const result = await api.hittingTimes(params);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const runMixingTime = createAsyncThunk(
  'simulation/runMixingTime',
  async (params, { rejectWithValue }) => {
    try {
      const result = await api.mixingTime(params);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Current simulation state
  currentMode: null, // 'cycle', 'walk', 'hitting', 'comparison'
  isRunning: false,
  progress: 0, // 0-100
  
  // Results storage
  results: {
    cycle: null,
    walk: null,
    hitting: null,
    comparison: null,
  },
  
  // Current parameters
  parameters: {
    n: 10,
    beta: 0.5,
    simulations: 10000,
  },
  
  // Error handling
  error: null,
  errorDetails: null,
  
  // History
  history: [],
  maxHistory: 20,
  
  // Metadata
  lastRun: null,
  totalComputationTime: 0,
};

const simulationSlice = createSlice({
  name: 'simulation',
  initialState,
  reducers: {
    // Regular reducers
    setMode: (state, action) => {
      state.currentMode = action.payload;
    },
    
    setParameters: (state, action) => {
      state.parameters = { ...state.parameters, ...action.payload };
    },
    
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
      state.errorDetails = null;
    },
    
    clearResults: (state, action) => {
      const mode = action.payload || 'all';
      if (mode === 'all') {
        state.results = {
          cycle: null,
          walk: null,
          hitting: null,
          comparison: null,
        };
      } else {
        state.results[mode] = null;
      }
    },
    
    addToHistory: (state, action) => {
      state.history.push({
        timestamp: new Date().toISOString(),
        mode: state.currentMode,
        parameters: { ...state.parameters },
        ...action.payload,
      });
      
      // Keep only max history items
      if (state.history.length > state.maxHistory) {
        state.history.shift();
      }
    },
    
    resetSimulation: (state) => {
      state.isRunning = false;
      state.progress = 0;
      state.error = null;
      state.errorDetails = null;
    },
  },
  
  // Async thunk handlers
  extraReducers: (builder) => {
    // Cycle Analysis
    builder
      .addCase(runCycleAnalysis.pending, (state) => {
        state.isRunning = true;
        state.progress = 0;
        state.error = null;
        state.currentMode = 'cycle';
      })
      .addCase(runCycleAnalysis.fulfilled, (state, action) => {
        state.isRunning = false;
        state.progress = 100;
        state.results.cycle = action.payload;
        state.lastRun = new Date().toISOString();
        if (action.payload.computation_time_ms) {
          state.totalComputationTime += action.payload.computation_time_ms;
        }
      })
      .addCase(runCycleAnalysis.rejected, (state, action) => {
        state.isRunning = false;
        state.error = 'Failed to run cycle analysis';
        state.errorDetails = action.payload;
        state.progress = 0;
      });
    
    // Hitting Times
    builder
      .addCase(runHittingTimes.pending, (state) => {
        state.isRunning = true;
        state.progress = 0;
        state.error = null;
        state.currentMode = 'hitting';
      })
      .addCase(runHittingTimes.fulfilled, (state, action) => {
        state.isRunning = false;
        state.progress = 100;
        state.results.hitting = action.payload;
        state.lastRun = new Date().toISOString();
        if (action.payload.computation_time_ms) {
          state.totalComputationTime += action.payload.computation_time_ms;
        }
      })
      .addCase(runHittingTimes.rejected, (state, action) => {
        state.isRunning = false;
        state.error = 'Failed to compute hitting times';
        state.errorDetails = action.payload;
        state.progress = 0;
      });
    
    // Mixing Time
    builder
      .addCase(runMixingTime.pending, (state) => {
        state.isRunning = true;
        state.progress = 0;
        state.error = null;
        state.currentMode = 'mixing';
      })
      .addCase(runMixingTime.fulfilled, (state, action) => {
        state.isRunning = false;
        state.progress = 100;
        state.results.comparison = action.payload;
        state.lastRun = new Date().toISOString();
        if (action.payload.computation_time_ms) {
          state.totalComputationTime += action.payload.computation_time_ms;
        }
      })
      .addCase(runMixingTime.rejected, (state, action) => {
        state.isRunning = false;
        state.error = 'Failed to compute mixing time';
        state.errorDetails = action.payload;
        state.progress = 0;
      });
  },
});

export const {
  setMode,
  setParameters,
  setProgress,
  clearError,
  clearResults,
  addToHistory,
  resetSimulation,
} = simulationSlice.actions;

export default simulationSlice.reducer;

// Selectors
export const selectCurrentMode = (state) => state.simulation.currentMode;
export const selectIsRunning = (state) => state.simulation.isRunning;
export const selectProgress = (state) => state.simulation.progress;
export const selectResults = (state) => state.simulation.results;
export const selectError = (state) => state.simulation.error;
export const selectHistory = (state) => state.simulation.history;
export const selectParameters = (state) => state.simulation.parameters;
