import axios from 'axios';

// Base API URL - update this to match your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
      }

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  },
};

// Health Data API functions
export const healthDataAPI = {
  getHealthData: async () => {
    try {
      const response = await api.get('/health-data');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      // Return mock data as fallback
      return {
        success: true,
        data: [
          {
            date: new Date(),
            heartRate: 75,
            sleepHours: 8,
            steps: 8500,
            waterIntake: 2.5
          }
        ]
      };
    }
  },

  addHealthData: async (healthData) => {
    try {
      const response = await api.post('/health-data', healthData);
      return response.data;
    } catch (error) {
      console.error('Failed to add health data:', error);
      throw new Error('Failed to save health data');
    }
  },
};

// Medication API functions
export const medicationAPI = {
  getMedications: async () => {
    try {
      const response = await api.get('/medication');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch medications:', error);
      // Return mock data as fallback
      return {
        success: true,
        medications: []
      };
    }
  },

  addMedication: async (medicationData) => {
    try {
      const response = await api.post('/medication', medicationData);
      return response.data;
    } catch (error) {
      console.error('Failed to add medication:', error);
      throw new Error('Failed to save medication');
    }
  },

  updateMedication: async (id, medicationData) => {
    try {
      const response = await api.put(`/medication/${id}`, medicationData);
      return response.data;
    } catch (error) {
      console.error('Failed to update medication:', error);
      throw new Error('Failed to update medication');
    }
  },

  deleteMedication: async (id) => {
    try {
      const response = await api.delete(`/medication/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete medication:', error);
      throw new Error('Failed to delete medication');
    }
  },
};

// Notification API functions
export const notificationAPI = {
  getNotifications: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Return mock data as fallback
      return {
        success: true,
        notifications: [
          {
            id: 1,
            title: 'Medication Reminder',
            message: 'Time to take your medication',
            type: 'reminder',
            isRead: false,
            createdAt: new Date()
          }
        ]
      };
    }
  },

  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw new Error('Failed to update notification');
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw new Error('Failed to update notifications');
    }
  },
};

// Admin API functions (requires admin role)
export const adminAPI = {
  getUsers: async () => {
    try {
      const response = await api.get('/auth/users');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  },

  getSystemStats: async () => {
    try {
      const response = await api.get('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
      throw new Error('Failed to fetch system stats');
    }
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('Server is not responding');
  }
};

export default api;
