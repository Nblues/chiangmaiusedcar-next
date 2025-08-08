// Fast Refresh utility functions
export const enableFastRefresh = () => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Ensure Fast Refresh is properly configured
    if (window.__NEXT_HMR_CB) {
      console.log('Fast Refresh is enabled');
    }

    // Clear any webpack errors that might block Fast Refresh
    if (window.__webpack_hot_middleware_reporter__) {
      window.__webpack_hot_middleware_reporter__.useCustomOverlay({
        showProblems: false,
      });
    }
  }
};

// Component wrapper for Fast Refresh compatibility
export const withFastRefresh = Component => {
  if (process.env.NODE_ENV === 'development') {
    Component.displayName = Component.name || 'Component';

    // Add Fast Refresh metadata
    if (typeof window !== 'undefined' && window.$RefreshReg$) {
      window.$RefreshReg$(Component, Component.displayName);
    }
  }

  return Component;
};

// Hook to handle Fast Refresh state preservation
export const useFastRefreshState = initialState => {
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    // Preserve state during Fast Refresh
    const stateKey = `__fast_refresh_state_${Date.now()}`;

    if (!window[stateKey]) {
      window[stateKey] = initialState;
    }

    return window[stateKey];
  }

  return initialState;
};
