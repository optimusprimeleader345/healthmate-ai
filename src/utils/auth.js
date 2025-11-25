// Authentication system for HealthMate
// Mock authentication with localStorage persistence

export const USER_ROLES = {
  PATIENT: 'patient',
  ADMIN: 'admin'
};

// Mock user database (in real app this would be a secure backend)
const MOCK_USERS_DB = {
  'admin@healthmate.com': {
    id: 'admin-001',
    email: 'admin@healthmate.com',
    password: 'admin123',
    name: 'HealthMate Administrator',
    role: USER_ROLES.ADMIN,
    avatar: '👑',
    department: 'System Administration',
    createdAt: '2024-01-01T00:00:00Z',
    lastLogin: null,
    isActive: true
  },
  'patient@example.com': {
    id: 'patient-001',
    email: 'patient@example.com',
    password: 'patient123',
    name: 'John Doe',
    role: USER_ROLES.PATIENT,
    avatar: '👤',
    dateOfBirth: '1985-06-15',
    medicalId: 'HID-12345001',
    createdAt: '2024-01-15T00:00:00Z',
    lastLogin: null,
    isActive: true,
    healthProfile: {
      bloodType: 'O+',
      allergies: ['Penicillin'],
      emergencyContact: 'Jane Doe - 555-0123'
    }
  },
  // Demo users for easy testing
  'demo.patient@healthmate.com': {
    id: 'patient-demo-001',
    email: 'demo.patient@healthmate.com',
    password: 'demo',
    name: 'Demo Patient',
    role: USER_ROLES.PATIENT,
    avatar: '🏥',
    dateOfBirth: '1990-03-20',
    medicalId: 'HID-99990001',
    createdAt: '2024-02-01T00:00:00Z',
    lastLogin: null,
    isActive: true,
    healthProfile: {
      bloodType: 'A-',
      allergies: ['Shellfish'],
      emergencyContact: 'Family Member - 555-0199'
    }
  }
};

// Authentication utilities
export const auth = {
  // Login function
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = Object.values(MOCK_USERS_DB).find(u => u.email === email && u.password === password);

        if (!user) {
          reject(new Error('Invalid email or password'));
          return;
        }

        if (!user.isActive) {
          reject(new Error('Account is deactivated'));
          return;
        }

        // Update last login
        user.lastLogin = new Date().toISOString();
        MOCK_USERS_DB[user.email] = user;

        // Set session
        const sessionUser = {
          ...user,
          sessionToken: `session-${user.id}-${Date.now()}`,
          loggedInAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        localStorage.setItem('healthmate_auth', JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 800); // Simulate network delay
    });
  },

  // Signup function
  signup: async (userData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password, name, role = USER_ROLES.PATIENT, ...profileData } = userData;

        // Check if user already exists
        if (MOCK_USERS_DB[email]) {
          reject(new Error('User already exists with this email'));
          return;
        }

        // Create new user
        const newUser = {
          id: `${role}-${Date.now()}`,
          email,
          password, // In real app: hash this!
          name,
          role,
          avatar: role === USER_ROLES.ADMIN ? '👑' : '🏥',
          createdAt: new Date().toISOString(),
          lastLogin: null,
          isActive: true,
          healthProfile: role === USER_ROLES.PATIENT ? {} : undefined,
          ...profileData
        };

        MOCK_USERS_DB[email] = newUser;

        // Auto-login after signup
        const sessionUser = {
          ...newUser,
          sessionToken: `session-${newUser.id}-${Date.now()}`,
          loggedInAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };

        localStorage.setItem('healthmate_auth', JSON.stringify(sessionUser));
        resolve(sessionUser);
      }, 1000); // Simulate network delay
    });
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('healthmate_auth');
  },

  // Get current user
  getCurrentUser: () => {
    const authData = localStorage.getItem('healthmate_auth');
    if (!authData) return null;

    try {
      const user = JSON.parse(authData);

      // Check if session is expired
      if (user.expiresAt && new Date() > new Date(user.expiresAt)) {
        auth.logout();
        return null;
      }

      return user;
    } catch {
      auth.logout();
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return auth.getCurrentUser() !== null;
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = auth.getCurrentUser();
    return user && user.role === role;
  },

  // Check if user has admin privileges
  isAdmin: () => {
    return auth.hasRole(USER_ROLES.ADMIN);
  },

  // Refresh session (extend expiration)
  refreshSession: () => {
    const user = auth.getCurrentUser();
    if (user) {
      user.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      localStorage.setItem('healthmate_auth', JSON.stringify(user));
      return true;
    }
    return false;
  },

  // Update user profile
  updateProfile: (updates) => {
    const user = auth.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem('healthmate_auth', JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  }
};

// Session management
export const sessionManager = {
  init: () => {
    const user = auth.getCurrentUser();
    if (user) {
      // Check for session expiration every minute
      setInterval(() => {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) {
          // Session expired, user will be redirected to login
          window.location.href = '/login';
        }
      }, 60 * 1000);
    }
  }
};

// Permission helpers
export const permissions = {
  canAccessAdminDashboard: () => {
    const user = auth.getCurrentUser();
    return user && user.role === USER_ROLES.ADMIN;
  },

  canAccessPremiumFeatures: () => {
    // Check both authentication and subscription
    const user = auth.getCurrentUser();
    if (!user) return false;

    // For demo purposes, demo user gets premium access
    return user.email === 'demo.patient@healthmate.com' || user.role === USER_ROLES.ADMIN;
  },

  canManageUsers: () => {
    return auth.hasRole(USER_ROLES.ADMIN);
  },

  canViewSensitiveData: (dataOwnerId) => {
    const user = auth.getCurrentUser();
    if (!user) return false;

    // Admins can view all data
    if (user.role === USER_ROLES.ADMIN) return true;

    // Users can only view their own data
    return user.id === dataOwnerId;
  }
};
