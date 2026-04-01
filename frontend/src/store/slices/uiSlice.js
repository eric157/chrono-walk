/**
 * UI State Slice
 * 
 * Manages UI-related state:
 * - Dark/light mode
 * - Sidebar visibility
 * - Modal dialogs
 * - Notifications
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Theme
  darkMode: localStorage.getItem('darkMode') === 'true' || false,
  
  // Navigation
  sidebarOpen: true,
  currentTab: 'home',
  
  // Modals
  modals: {
    settings: false,
    help: false,
    share: false,
    export: false,
  },
  
  // Notifications
  notifications: [],
  
  // UI Preferences
  plotlyConfig: {
    responsive: true,
    displayModeBar: true,
    displaylogo: false,
  },
  
  // Language
  language: localStorage.getItem('language') || 'en',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme toggle
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode);
    },
    
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem('darkMode', state.darkMode);
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    
    // Tabs
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload;
    },
    
    // Modals
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((key) => {
        state.modals[key] = false;
      });
    },
    
    // Notifications
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      };
      state.notifications.push(notification);
      
      // Auto-remove notification after 5 seconds
      if (notification.autoClose !== false) {
        setTimeout(() => {
          state.notifications = state.notifications.filter(
            (n) => n.id !== notification.id
          );
        }, notification.duration || 5000);
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Language
    setLanguage: (state, action) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    
    // Plotly config
    setPlotlyConfig: (state, action) => {
      state.plotlyConfig = { ...state.plotlyConfig, ...action.payload };
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setCurrentTab,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLanguage,
  setPlotlyConfig,
} = uiSlice.actions;

export default uiSlice.reducer;

// Selectors
export const selectDarkMode = (state) => state.ui.darkMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectCurrentTab = (state) => state.ui.currentTab;
export const selectModals = (state) => state.ui.modals;
export const selectNotifications = (state) => state.ui.notifications;
export const selectLanguage = (state) => state.ui.language;
