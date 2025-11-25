/**
 * Fitbit API Service
 * OAuth2-based integration for activity, sleep, and heart rate data
 */

// OAuth2 Configuration
const OAUTH_CONFIG = {
  clientId: import.meta.env.VITE_FITBIT_CLIENT_ID,
  clientSecret: import.meta.env.VITE_FITBIT_CLIENT_SECRET,
  redirectUri: `${window.location.origin}/fitbit/callback`,
  authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
  tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
  apiBaseURL: 'https://api.fitbit.com/1',
  subscriptionId: import.meta.env.VITE_FITBIT_SUBSCRIPTION_ID
};

// Rate limiting for Fitbit API (150 per hour)
class RateLimiter {
  constructor(maxRequestsPerHour = 150) {
    this.maxPerHour = maxRequestsPerHour;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);

    // Remove requests older than 1 hour
    this.requests = this.requests.filter(timestamp => timestamp > oneHourAgo);

    return this.requests.length < this.maxPerHour;
  }

  recordRequest() {
    this.requests.push(Date.now());
  }
}

// Core Fitbit Service Class
export class FitbitAPI {
  constructor() {
    this.clientId = OAUTH_CONFIG.clientId;
    this.clientSecret = OAUTH_CONFIG.clientSecret;
    this.redirectUri = OAUTH_CONFIG.redirectUri;
    this.baseURL = OAUTH_CONFIG.apiBaseURL;
    this.subscriptionId = OAUTH_CONFIG.subscriptionId;

    // Check if using demo credentials
    this.isDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
                     this.clientId?.startsWith('demo') ||
                     this.clientSecret?.startsWith('demo');

    this.rateLimiter = new RateLimiter();
    this.cache = new Map();
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes

    // OAuth2 state management
    this.tokens = this.loadStoredTokens();
    this.isAuthenticated = false;

    // Validation
    this.validateConfiguration();
  }

  validateConfiguration() {
    if (!this.clientId || !this.clientSecret) {
      console.warn('Fitbit OAuth credentials not found. Using demo mode.');
      this.isDemoMode = true;
    }
  }

  loadStoredTokens() {
    try {
      const stored = localStorage.getItem('fitbit_tokens');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  saveTokens(tokens) {
    if (tokens) {
      localStorage.setItem('fitbit_tokens', JSON.stringify(tokens));
      this.tokens = tokens;
      this.isAuthenticated = true;
    }
  }

  clearTokens() {
    localStorage.removeItem('fitbit_tokens');
    this.tokens = null;
    this.isAuthenticated = false;
  }

  /**
   * OAuth2 Authorization Flow
   */
  initiateOAuthLogin() {
    const state = this.generateState();
    const scopes = [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'profile',
      'settings',
      'sleep',
      'social',
      'weight'
    ].join(' ');

    const authUrl = `${OAUTH_CONFIG.authorizationEndpoint}?` +
      `response_type=code&` +
      `client_id=${this.clientId}&` +
      `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `state=${state}`;

    // Store state for verification
    localStorage.setItem('fitbit_oauth_state', state);

    window.location.href = authUrl;
  }

  async handleOAuthCallback(code, state) {
    try {
      // Verify state for security
      const storedState = localStorage.getItem('fitbit_oauth_state');
      if (state !== storedState) {
        throw new Error('OAuth state mismatch');
      }

      localStorage.removeItem('fitbit_oauth_state');

      // Exchange code for tokens
      const tokenResponse = await fetch(OAUTH_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `client_id=${this.clientId}&` +
              `grant_type=authorization_code&` +
              `redirect_uri=${encodeURIComponent(this.redirectUri)}&` +
              `code=${code}`
      });

      if (!tokenResponse.ok) {
        throw new Error('Token exchange failed');
      }

      const tokens = await tokenResponse.json();
      this.saveTokens(tokens);

      return tokens;
    } catch (error) {
      console.error('OAuth callback failed:', error);
      throw error;
    }
  }

  /**
   * Token Management
   */
  async refreshAccessToken() {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(OAUTH_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${this.clientId}:${this.clientSecret}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${this.tokens.refresh_token}`
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const newTokens = await response.json();
      this.saveTokens({
        ...newTokens,
        refresh_token: newTokens.refresh_token || this.tokens.refresh_token // Keep old refresh token if new one not provided
      });

      return newTokens;
    } catch (error) {
      // Clear tokens on refresh failure
      this.clearTokens();
      throw error;
    }
  }

  /**
   * API Request Handler with Authentication
   */
  async makeAuthenticatedRequest(endpoint, options = {}) {
    if (this.isDemoMode) {
      return this.handleDemoRequest(endpoint);
    }

    if (!this.rateLimiter.canMakeRequest()) {
      return {
        success: false,
        error: 'API rate limit exceeded. Please wait before making more requests.',
        code: 'RATE_LIMIT'
      };
    }

    // Check if token needs refresh (5 minutes buffer)
    if (this.tokens && Date.now() > (this.tokens.expires_at - (5 * 60 * 1000))) {
      await this.refreshAccessToken();
    }

    this.rateLimiter.recordRequest();

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
          'Authorization': `Bearer ${this.tokens.access_token}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        body: options.body
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        await this.refreshAccessToken();
        return this.makeAuthenticatedRequest(endpoint, options);
      }

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };

    } catch (error) {
      console.error(`Fitbit API Error (${endpoint}):`, error);
      return this.handleApiError(error);
    }
  }

  handleDemoRequest(endpoint) {
    console.log(`[Demo Mode] Fitbit API call: ${endpoint}`);
    return {
      success: true,
      data: this.generateMockDataForEndpoint(endpoint)
    };
  }

  handleApiError(error) {
    if (error.message.includes('401')) {
      this.clearTokens();
      return {
        success: false,
        error: 'Authentication expired. Please reconnect your Fitbit account.',
        code: 'AUTH_ERROR'
      };
    }

    if (error.message.includes('429')) {
      return {
        success: false,
        error: 'API rate limit exceeded.',
        code: 'RATE_LIMIT'
      };
    }

    return {
      success: false,
      error: 'Failed to connect to Fitbit. Please try again.',
      code: 'API_ERROR'
    };
  }

  generateMockDataForEndpoint(endpoint) {
    // Generate appropriate mock data based on endpoint
    if (endpoint.includes('/activities/date/')) {
      return this.getMockDailyActivitySummary();
    }
    if (endpoint.includes('/sleep/date/')) {
      return this.getMockSleepData();
    }
    if (endpoint.includes('/heart/date/')) {
      return this.getMockHeartRateData();
    }
    return { mock: true };
  }

  /**
   * Activity Data APIs
   */
  async getDailyActivitySummary(date = 'today') {
    return await this.makeAuthenticatedRequest(`/user/-/activities/date/${date}.json`);
  }

  async getActivityTimeSeries(resource, startDate, endDate, period = '30d') {
    return await this.makeAuthenticatedRequest(
      `/user/-/activities/tracker/${resource}/date/${startDate}/${endDate}.json`
    );
  }

  async getStepCount(period = '30d') {
    return await this.getActivityTimeSeries('steps', 'today', period);
  }

  async getDistanceData(period = '30d') {
    return await this.getActivityTimeSeries('distance', 'today', period);
  }

  async getCaloriesData(period = '30d') {
    return await this.getActivityTimeSeries('calories', 'today', period);
  }

  async getFloorsClimbed(period = '30d') {
    return await this.getActivityTimeSeries('floors', 'today', period);
  }

  async getActiveMinutes(period = '30d') {
    return await this.getActivityTimeSeries('minutesFairlyActive', 'today', period);
  }

  /**
   * Sleep Data APIs
   */
  async getSleepLog(date = 'today') {
    return await this.makeAuthenticatedRequest(`/user/-/sleep/date/${date}.json`);
  }

  async getSleepTimeSeries(startDate, endDate) {
    return await this.makeAuthenticatedRequest(
      `/user/-/sleep/date/${startDate}/${endDate}.json`
    );
  }

  /**
   * Heart Rate Data APIs
   */
  async getHeartRateTimeSeries(startDate, endDate) {
    return await this.makeAuthenticatedRequest(
      `/user/-/activities/heart/date/${startDate}/${endDate}.json`
    );
  }

  async getHeartRateIntraday(date = 'today') {
    return await this.makeAuthenticatedRequest(
      `/user/-/activities/heart/date/${date}/1d/time/00:00/23:59.json`
    );
  }

  /**
   * User Profile APIs
   */
  async getUserProfile() {
    return await this.makeAuthenticatedRequest('/user/-/profile.json');
  }

  async getDeviceInfo() {
    return await this.makeAuthenticatedRequest('/user/-/devices.json');
  }

  /**
   * Nutrition Data APIs (if enabled)
   */
  async getFoodLog(date = 'today') {
    return await this.makeAuthenticatedRequest(`/user/-/foods/log/date/${date}.json`);
  }

  async getWaterLog(date = 'today') {
    return await this.makeAuthenticatedRequest(`/user/-/foods/log/water/date/${date}.json`);
  }

  /**
   * Mock Data Generators (for demo/testing)
   */
  getMockDailyActivitySummary() {
    const today = new Date();
    return {
      summary: {
        activeScore: -1,
        activityCalories: Math.floor(Math.random() * 300) + 200,
        caloriesBMR: Math.floor(Math.random() * 200) + 1400,
        caloriesOut: Math.floor(Math.random() * 400) + 1600,
        distances: [
          {
            activity: 'total',
            distance: Math.floor(Math.random() * 3) + 2
          },
          {
            activity: 'tracker',
            distance: Math.floor(Math.random() * 2) + 1
          }
        ],
        elevation: Math.floor(Math.random() * 20) + 5,
        fairlyActiveMinutes: Math.floor(Math.random() * 30) + 10,
        floors: Math.floor(Math.random() * 15) + 3,
        heartRateZones: {
          fatBurn: Math.floor(Math.random() * 120) + 60,
          cardio: Math.floor(Math.random() * 30) + 15,
          peak: Math.floor(Math.random() * 10) + 5
        },
        lightlyActiveMinutes: Math.floor(Math.random() * 60) + 120,
        marginalCalories: Math.floor(Math.random() * 100) + 50,
        restingHeartRate: Math.floor(Math.random() * 20) + 60,
        sedentaryMinutes: Math.floor(Math.random() * 300) + 600,
        steps: Math.floor(Math.random() * 5000) + 5000,
        veryActiveMinutes: Math.floor(Math.random() * 15) + 5
      },
      goals: {
        activeMinutes: 30,
        caloriesOut: 2000,
        distance: 8.05,
        floors: 10,
        steps: 10000
      }
    };
  }

  getMockSleepData() {
    return {
      sleep: [{
        dateOfSleep: new Date().toISOString().split('T')[0],
        duration: (Math.floor(Math.random() * 3) + 7) * 3600000, // 7-10 hours
        efficiency: Math.floor(Math.random() * 20) + 80,
        endTime: new Date().toISOString(),
        isMainSleep: true,
        levels: {
          summary: {
            awake: {
              count: Math.floor(Math.random() * 5) + 1,
              minutes: Math.floor(Math.random() * 30) + 10
            },
            rem: {
              count: Math.floor(Math.random() * 8) + 3,
              minutes: Math.floor(Math.random() * 120) + 90
            },
            deep: {
              count: Math.floor(Math.random() * 3) + 1,
              minutes: Math.floor(Math.random() * 120) + 50
            },
            light: {
              count: Math.floor(Math.random() * 10) + 5,
              minutes: Math.floor(Math.random() * 300) + 200
            }
          }
        },
        logId: Math.floor(Math.random() * 10000),
        minutesAfterWakeup: Math.floor(Math.random() * 10),
        minutesAsleep: Math.floor(Math.random() * 180) + 240,
        minutesAwake: Math.floor(Math.random() * 40) + 5,
        minutesToFallAsleep: Math.floor(Math.random() * 15),
        startTime: new Date(Date.now() - 9 * 3600000).toISOString()
      }],
      summary: {
        totalMinutesAsleep: Math.floor(Math.random() * 180) + 240,
        totalSleepRecords: 1,
        totalTimeInBed: Math.floor(Math.random() * 200) + 300
      }
    };
  }

  getMockHeartRateData() {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 288; i++) { // 5-minute intervals for 24 hours
      const time = new Date(now);
      time.setMinutes(time.getMinutes() - (i * 5));
      const hour = time.getHours();
      let heartRate;

      if (hour >= 22 || hour <= 6) {
        heartRate = Math.floor(Math.random() * 10) + 50; // Night: 50-60 bpm
      } else if (hour >= 12 && hour <= 14) {
        heartRate = Math.floor(Math.random() * 5) + 70; // After lunch: 70-75 bpm
      } else {
        heartRate = Math.floor(Math.random() * 15) + 65; // Day: 65-80 bpm
      }

      data.push({
        dateTime: time.toISOString(),
        value: heartRate
      });
    }

    return {
      'activities-heart': [
        {
          dateTime: now.toISOString().split('T')[0],
          value: {
            restingHeartRate: Math.floor(Math.random() * 15) + 55,
            heartRateZones: {
              fatBurn: Math.floor(Math.random() * 120) + 60,
              cardio: Math.floor(Math.random() * 30) + 15,
              peak: Math.floor(Math.random() * 10) + 5
            }
          }
        }
      ],
      'activities-heart-intraday': {
        dataset: data.reverse(), // Newest first
        datasetInterval: 5,
        datasetType: 'minute'
      }
    };
  }

  generateState() {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Utility Methods
   */
  isConnected() {
    return this.isAuthenticated && !this.isDemoMode;
  }

  disconnect() {
    this.clearTokens();
    console.log('Fitbit account disconnected');
  }

  getRateLimitStatus() {
    return {
      used: this.rateLimiter.requests.length,
      available: this.rateLimiter.maxPerHour - this.rateLimiter.requests.length,
      limit: this.rateLimiter.maxPerHour
    };
  }
}

// Export singleton instance
export const fitbitAPI = new FitbitAPI();

// Export additional utilities
export const FITBIT_ERRORS = {
  AUTH_ERROR: 'AUTH_ERROR',
  RATE_LIMIT: 'RATE_LIMIT',
  API_ERROR: 'API_ERROR',
  DEMO_MODE: 'DEMO_MODE'
};

// Export OAuth configuration for components that need it
export { OAUTH_CONFIG };

export default fitbitAPI;
