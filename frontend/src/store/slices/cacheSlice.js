/**
 * Cache State Slice
 * 
 * Manages API response caching and cache statistics
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Cached API responses
  responses: {},
  
  // Cache statistics
  hits: 0,
  misses: 0,
  
  // Cache settings
  enabled: true,
  maxAge: 1000 * 60 * 30, // 30 minutes
  maxSize: 100, // Max number of cached items
};

const cacheSlice = createSlice({
  name: 'cache',
  initialState,
  reducers: {
    // Cache management
    setCached: (state, action) => {
      const { key, value, timestamp } = action.payload;
      
      // Enforce max size limit
      if (Object.keys(state.responses).length >= state.maxSize) {
        // Remove oldest entry
        const oldestKey = Object.keys(state.responses)[0];
        delete state.responses[oldestKey];
      }
      
      state.responses[key] = {
        value,
        timestamp: timestamp || Date.now(),
      };
    },
    
    getCached: (state, action) => {
      const key = action.payload;
      const cached = state.responses[key];
      
      if (!cached || state.maxAge && Date.now() - cached.timestamp > state.maxAge) {
        state.misses++;
        return null;
      }
      
      state.hits++;
      return cached.value;
    },
    
    removeCached: (state, action) => {
      delete state.responses[action.payload];
    },
    
    clearCache: (state) => {
      state.responses = {};
    },
    
    // Cache settings
    setCacheEnabled: (state, action) => {
      state.enabled = action.payload;
    },
    
    setMaxAge: (state, action) => {
      state.maxAge = action.payload;
    },
    
    resetStats: (state) => {
      state.hits = 0;
      state.misses = 0;
    },
  },
});

export const {
  setCached,
  getCached,
  removeCached,
  clearCache,
  setCacheEnabled,
  setMaxAge,
  resetStats,
} = cacheSlice.actions;

export default cacheSlice.reducer;

// Selectors
export const selectCacheStats = (state) => ({
  hits: state.cache.hits,
  misses: state.cache.misses,
  hitRate: state.cache.hits + state.cache.misses > 0 
    ? (state.cache.hits / (state.cache.hits + state.cache.misses) * 100).toFixed(2) 
    : 0,
  size: Object.keys(state.cache.responses).length,
});
