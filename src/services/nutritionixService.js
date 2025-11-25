/**
 * Nutritionix API Service
 * Provides food lookup, nutrition analysis, and barcode scanning
 */

// API rate limiting
class RateLimiter {
  constructor(maxRequestsPerMinute = 50, maxRequestsPerHour = 1000) {
    this.requests = [];
    this.maxPerMinute = maxRequestsPerMinute;
    this.maxPerHour = maxRequestsPerHour;
  }

  canMakeRequest() {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const oneHour = 60 * 60 * 1000;

    // Remove old requests
    this.requests = this.requests.filter(timestamp => now - timestamp < oneHour);

    const requestsInLastMinute = this.requests.filter(timestamp => now - timestamp < oneMinute).length;
    const requestsInLastHour = this.requests.length;

    return requestsInLastMinute < this.maxPerMinute && requestsInLastHour < this.maxPerHour;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }

  getRemainingRequests() {
    const now = Date.now();
    const oneMinute = 60 * 1000;
    const requestsInLastMinute = this.requests.filter(timestamp => now - timestamp < oneMinute).length;
    const requestsInLastHour = this.requests.filter(timestamp => now - timestamp < oneHour).length;

    return {
      perMinute: Math.max(0, this.maxPerMinute - requestsInLastMinute),
      perHour: Math.max(0, this.maxPerHour - requestsInLastHour)
    };
  }
}

// Nutritionix API Service Class
export class NutritionixAPI {
  constructor() {
    this.baseURL = 'https://trackapi.nutritionix.com/v2';
    this.appId = import.meta.env.VITE_NUTRITIONIX_APP_ID;
    this.apiKey = import.meta.env.VITE_NUTRITIONIX_APP_KEY;
    this.isDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
                     this.appId?.startsWith('demo') ||
                     this.apiKey?.startsWith('demo');

    // Rate limiter using environment config
    const maxPerMinute = parseInt(import.meta.env.VITE_API_REQUEST_LIMIT_PER_MINUTE) || 50;
    const maxPerHour = parseInt(import.meta.env.VITE_API_REQUEST_LIMIT_PER_HOUR) || 1000;
    this.rateLimiter = new RateLimiter(maxPerMinute, maxPerHour);

    // Cache for API responses
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes

    // Validation
    if (!this.appId || !this.apiKey || this.isDemoMode) {
      console.warn('Nutritionix API credentials not found or using demo mode. Using mock data for development.');
    }
  }

  /**
   * Check if API is properly configured
   */
  isConfigured() {
    return Boolean(this.appId && this.apiKey);
  }

  /**
   * Get API request headers
   */
  getHeaders() {
    return {
      'x-app-id': this.appId,
      'x-app-key': this.apiKey,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Handle API errors consistently
   */
  handleError(error, endpoint) {
    console.error(`Nutritionix API Error (${endpoint}):`, error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR'
      };
    }

    if (error.status) {
      switch (error.status) {
        case 401:
          return {
            success: false,
            error: 'Invalid API credentials. Please check your Nutritionix configuration.',
            code: 'AUTH_ERROR'
          };
        case 429:
          return {
            success: false,
            error: 'API rate limit exceeded. Please wait before making more requests.',
            code: 'RATE_LIMIT'
          };
        case 500:
        case 502:
        case 503:
          return {
            success: false,
            error: 'Nutritionix service temporarily unavailable. Please try again later.',
            code: 'SERVER_ERROR'
          };
        default:
          return {
            success: false,
            error: `API error: ${error.message || 'Unknown error'}`,
            code: 'API_ERROR'
          };
      }
    }

    return {
      success: false,
      error: error.message || 'Unknown error occurred',
      code: 'UNKNOWN_ERROR'
    };
  }

  /**
   * Make API request with caching and rate limiting
   */
  async makeRequest(endpoint, options = {}) {
    // Check rate limiting
    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'Rate limit exceeded. Please wait before making more requests.',
        code: 'RATE_LIMIT'
      };
    }

    // Cache key
    const cacheKey = `${options.method || 'GET'}_${endpoint}_${JSON.stringify(options.body || {})}`;

    // Check cache
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      this.rateLimiter.recordRequest();

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw { status: response.status, message: response.statusText };
      }

      const data = await response.json();

      // Cache successful responses
      this.cache.set(cacheKey, {
        data: { success: true, data },
        timestamp: Date.now()
      });

      return { success: true, data };

    } catch (error) {
      const errorResponse = this.handleError(error, endpoint);
      return errorResponse;
    }
  }

  /**
   * Search for foods using instant search
   * @param {string} query - Search query (e.g., "apple", "chicken breast")
   * @returns {Promise<Object>} - Search results
   */
  async searchFoods(query) {
    if (!query || query.trim().length < 2) {
      return { success: false, error: 'Search query must be at least 2 characters long' };
    }

    return await this.makeRequest('/search/instant', {
      method: 'GET'
    });
  }

  /**
   * Search for foods with natural language processing
   * @param {string} query - Natural language query (e.g., "1 large apple", "2 cups cooked rice")
   * @returns {Promise<Object>} - Nutrition analysis results
   */
  async naturalLanguageQuery(query) {
    if (!query || query.trim().length < 2) {
      return { success: false, error: 'Query must be at least 2 characters long' };
    }

    // Check cache first (nourish endpoint is the main natural language one)
    const cacheKey = `natural_language_${query.toLowerCase().trim()}`;
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    return await this.makeRequest('/natural/nutrients', {
      method: 'POST',
      body: {
        query: query.trim(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    });
  }

  /**
   * Get detailed nutrition information for a specific food item
   * @param {string} foodId - Nutritionix food ID
   * @returns {Promise<Object>} - Food details
   */
  async getFoodDetails(foodId) {
    if (!foodId) {
      return { success: false, error: 'Food ID is required' };
    }

    return await this.makeRequest(`/search/item?nix_item_id=${foodId}`);
  }

  /**
   * Get nutrition information by UPC/barcode
   * @param {string} upc - UPC/barcode number
   * @returns {Promise<Object>} - Product nutrition information
   */
  async getNutritionByUPC(upc) {
    if (!upc) {
      return { success: false, error: 'UPC code is required' };
    }

    return await this.makeRequest(`/search/item?upc=${upc}`);
  }

  /**
   * Convert between different serving sizes/weights
   * @param {string} foodId - Nutritionix food ID
   * @param {string} measure - Serving size (e.g., "100g", "1 cup")
   * @returns {Promise<Object>} - Converted nutrition info
   */
  async convertServingSize(foodId, measure) {
    if (!foodId || !measure) {
      return { success: false, error: 'Food ID and measure are required' };
    }

    return await this.makeRequest('/utils/measure', {
      method: 'POST',
      body: {
        nix_item_id: foodId,
        measure: measure.toLowerCase()
      }
    });
  }

  /**
   * Get rate limiting status
   */
  getRateLimitStatus() {
    return this.rateLimiter.getRemainingRequests();
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Validate API credentials
   */
  async validateCredentials() {
    try {
      const response = await this.makeRequest('/search/instant?q=test');
      return {
        valid: response.success && !response.error?.includes('credentials'),
        rateLimitInfo: this.getRateLimitStatus()
      };
    } catch {
      return { valid: false };
    }
  }
}

// Export singleton instance
export const nutritionixAPI = new NutritionixAPI();

// Export types for TypeScript usage
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  SERVER_ERROR: 'SERVER_ERROR',
  API_ERROR: 'API_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export default nutritionixAPI;
