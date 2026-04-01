/**
 * Settings State Slice
 * 
 * Manages user settings and preferences
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Visualization preferences
  visualization: {
    colorScheme: 'viridis',
    animationSpeed: 1.0, // 0.5 - 2.0
    showGridlines: true,
    showAxisLabels: true,
  },
  
  // Computation preferences
  computation: {
    autoRunOnParamChange: false,
    maxSimulations: 100000,
    useBackendAPI: true,
    fallbackToClient: true,
  },
  
  // Output preferences
  output: {
    exportFormat: 'json', // 'json', 'csv', 'png', 'svg'
    downloadCharts: true,
    includeMetadata: true,
  },
  
  // Accessibility
  accessibility: {
    highContrast: false,
    fontSize: 'normal', // 'small', 'normal', 'large'
    reducedMotion: false,
  },
  
  // Notifications
  notifications: {
    enabled: true,
    sound: true,
    unreadBudge: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // Visualization settings
    setColorScheme: (state, action) => {
      state.visualization.colorScheme = action.payload;
      localStorage.setItem('visualizationColorScheme', action.payload);
    },
    
    setAnimationSpeed: (state, action) => {
      state.visualization.animationSpeed = Math.max(0.5, Math.min(2.0, action.payload));
    },
    
    toggleGridlines: (state) => {
      state.visualization.showGridlines = !state.visualization.showGridlines;
    },
    
    toggleAxisLabels: (state) => {
      state.visualization.showAxisLabels = !state.visualization.showAxisLabels;
    },
    
    // Computation settings
    setAutoRunOnParamChange: (state, action) => {
      state.computation.autoRunOnParamChange = action.payload;
    },
    
    setMaxSimulations: (state, action) => {
      state.computation.maxSimulations = Math.min(1000000, action.payload);
    },
    
    setUseBackendAPI: (state, action) => {
      state.computation.useBackendAPI = action.payload;
    },
    
    setFallbackToClient: (state, action) => {
      state.computation.fallbackToClient = action.payload;
    },
    
    // Output settings
    setExportFormat: (state, action) => {
      state.output.exportFormat = action.payload;
    },
    
    setDownloadCharts: (state, action) => {
      state.output.downloadCharts = action.payload;
    },
    
    // Accessibility settings
    setHighContrast: (state, action) => {
      state.accessibility.highContrast = action.payload;
      localStorage.setItem('highContrast', action.payload);
    },
    
    setFontSize: (state, action) => {
      state.accessibility.fontSize = action.payload;
      localStorage.setItem('fontSize', action.payload);
    },
    
    setReducedMotion: (state, action) => {
      state.accessibility.reducedMotion = action.payload;
      localStorage.setItem('reducedMotion', action.payload);
      
      // Apply to document
      if (action.payload) {
        document.body.style.setProperty('--motion-reduce', '1');
      } else {
        document.body.style.removeProperty('--motion-reduce');
      }
    },
    
    // Notification settings
    setNotificationsEnabled: (state, action) => {
      state.notifications.enabled = action.payload;
    },
    
    setNotificationSound: (state, action) => {
      state.notifications.sound = action.payload;
    },
    
    // Reset to defaults
    resetSettings: () => initialState,
    
    // Load settings from localStorage
    loadSettings: (state) => {
      const saved = localStorage.getItem('appSettings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...state, ...parsed };
      }
    },
    
    // Save settings to localStorage
    saveSettings: (state) => {
      localStorage.setItem('appSettings', JSON.stringify(state));
    },
  },
});

export const {
  setColorScheme,
  setAnimationSpeed,
  toggleGridlines,
  toggleAxisLabels,
  setAutoRunOnParamChange,
  setMaxSimulations,
  setUseBackendAPI,
  setFallbackToClient,
  setExportFormat,
  setDownloadCharts,
  setHighContrast,
  setFontSize,
  setReducedMotion,
  setNotificationsEnabled,
  setNotificationSound,
  resetSettings,
  loadSettings,
  saveSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

// Selectors
export const selectVisualization = (state) => state.settings.visualization;
export const selectComputation = (state) => state.settings.computation;
export const selectAccessibility = (state) => state.settings.accessibility;
export const selectNotifications = (state) => state.settings.notifications;
