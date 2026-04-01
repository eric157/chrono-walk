/**
 * Redux Store Configuration for Chrono-Walk
 * 
 * Centralized state management for the entire application
 * 
 * Structure:
 * - simulation: Running simulations and results
 * - ui: UI state (mode, loading, errors)
 * - cache: API response caching
 * - settings: User preferences
 */

import { configureStore } from '@reduxjs/toolkit';
import simulationReducer from './slices/simulationSlice';
import uiReducer from './slices/uiSlice';
import cacheReducer from './slices/cacheSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    simulation: simulationReducer,
    ui: uiReducer,
    cache: cacheReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat([
        // Custom middleware can be added here
        // e.g., for logging, analytics, error reporting
      ]),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
