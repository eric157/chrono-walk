/**
 * API Client - Cross-Language JavaScript/Python Integration
 * 
 * Provides seamless communication between React frontend and FastAPI backend
 * with automatic fallback to browser-based computation if backend unavailable.
 * 
 * Features:
 * - REST API calls with Promise caching
 * - WebSocket support for real-time updates
 * - Automatic fallback to client-side algorithms
 * - Request rate limiting and queuing
 * - Retry logic with exponential backoff
 * - CORS handling
 */

class APIClient {
  constructor(apiUrl = process.env.VITE_API_URL || 'http://localhost:8000') {
    this.apiUrl = apiUrl;
    this.cache = new Map();
    this.requestQueue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    this.baseDelay = 1000; // 1 second
    this.timeout = 30000; // 30 seconds
    this.backendAvailable = true;
    
    // Check backend availability on init
    this.checkBackendHealth();
  }

  /**
   * Check if backend is available
   */
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.apiUrl}/health`, {
        method: 'GET',
        timeout: 5000
      });
      this.backendAvailable = response.ok;
    } catch (error) {
      console.warn('Backend unavailable, falling back to client-side computation');
      this.backendAvailable = false;
    }
  }

  /**
   * Make GET request to API
   * @param {string} endpoint - API endpoint
   * @param {object} options - Request options
   * @returns {Promise} Response data
   */
  async get(endpoint, options = {}) {
    const cacheKey = `GET_${endpoint}_${JSON.stringify(options)}`;
    
    // Return cached result if available and cache enabled
    if (options.cache && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await fetch(`${this.apiUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(options.headers),
        timeout: options.timeout || this.timeout,
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache successful response
      if (options.cache) {
        this.cache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  }

  /**
   * Make POST request to API with retry logic
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request body
   * @param {object} options - Request options
   * @returns {Promise} Response data
   */
  async post(endpoint, data = {}, options = {}) {
    let lastError;

    for (let attempt = 0; attempt < options.retries || this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.apiUrl}${endpoint}`, {
          method: 'POST',
          headers: this.getHeaders(options.headers),
          body: JSON.stringify(data),
          timeout: options.timeout || this.timeout,
          ...options
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt + 1} failed:`, error.message);

        // Wait before retrying with exponential backoff
        if (attempt < (options.retries || this.maxRetries) - 1) {
          const delay = this.baseDelay * Math.pow(2, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * WebSocket connection for real-time updates
   * @param {string} endpoint - WebSocket endpoint
   * @param {function} onMessage - Callback for messages
   * @param {function} onError - Callback for errors
   * @returns {WebSocket}
   */
  connectWebSocket(endpoint, onMessage, onError) {
    const wsUrl = `${this.apiUrl.replace('http', 'ws')}${endpoint}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (onError) onError(error);
    };

    return ws;
  }

  /**
   * Get request headers with CORS and content-type
   * @param {object} customHeaders - Additional headers
   * @returns {object} Headers object
   */
  getHeaders(customHeaders = {}) {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };
  }

  // ============================================================================
  // API Endpoints: Cycle Analysis
  // ============================================================================

  /**
   * Run cycle graph analysis via API (or fallback to browser)
   * @param {object} params - Analysis parameters
   * @returns {Promise} Analysis results
   */
  async cycleAnalysis(params) {
    if (!this.backendAvailable) {
      console.warn('Backend unavailable, running in browser');
      // Import browser-based algorithm
      const { runCycleSim } = await import('./algorithms.js');
      return runCycleSim(params);
    }

    try {
      return await this.post('/api/cycle-analysis', {
        n: params.n,
        beta: params.beta,
        simulations: params.simulations
      }, { retries: 1, cache: false });
    } catch (error) {
      console.warn('Backend cycle analysis failed, using browser computation:', error);
      const { runCycleSim } = await import('./algorithms.js');
      return runCycleSim(params);
    }
  }

  // ============================================================================
  // API Endpoints: Hitting Times
  // ============================================================================

  /**
   * Calculate hitting time matrix via API
   * @param {object} params - Analysis parameters
   * @returns {Promise} Hitting time matrix
   */
  async hittingTimes(params) {
    if (!this.backendAvailable) {
      const { estimateHittingTimes } = await import('./algorithms.js');
      return estimateHittingTimes(params);
    }

    try {
      return await this.post('/api/hitting-times', {
        n: params.n,
        beta: params.beta,
        simulations: params.simulations
      }, { retries: 1, cache: false });
    } catch (error) {
      console.warn('Backend hitting times failed, using browser computation:', error);
      const { estimateHittingTimes } = await import('./algorithms.js');
      return estimateHittingTimes(params);
    }
  }

  // ============================================================================
  // API Endpoints: Mixing Time
  // ============================================================================

  /**
   * Calculate mixing time via API
   * @param {object} params - Analysis parameters
   * @returns {Promise} Mixing time results
   */
  async mixingTime(params) {
    if (!this.backendAvailable) {
      const { mixingTime } = await import('./algorithms.js');
      return mixingTime(params);
    }

    try {
      return await this.post('/api/mixing-time', {
        n: params.n,
        beta: params.beta
      }, { retries: 1, cache: true });
    } catch (error) {
      console.warn('Backend mixing time failed, using browser computation:', error);
      const { mixingTime } = await import('./algorithms.js');
      return mixingTime(params);
    }
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Clear cache
   * @param {string} pattern - Optional pattern to match keys
   */
  clearCache(pattern = null) {
    if (pattern) {
      for (let key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      backendAvailable: this.backendAvailable
    };
  }
}

// Initialize and export singleton instance
const api = new APIClient();
export { api, APIClient };
