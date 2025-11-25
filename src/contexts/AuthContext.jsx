import React, { createContext, useContext, useEffect, useState } from 'react';
import { firebaseHealthService, auth, onAuthStateChanged } from '../services/firebaseService';

// Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Initialize auth state listener
  useEffect(() => {
    // Only set up Firebase auth listener if not in demo mode
    if (firebaseHealthService.getConnectionStatus().isDemoMode) {
      console.log('Demo mode: Skipping Firebase auth listener');
      setLoading(false);
      return;
    }

    // Firebase production mode
    if (!auth) {
      console.error('Firebase auth instance not available in production mode');
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      try {
        setUser(firebaseUser);

        if (firebaseUser) {
          // Load user profile from Firebase when user signs in
          const profile = await firebaseHealthService.getUserProfile(firebaseUser.uid);
          setUserProfile(profile);

          // Subscribe to real-time profile updates
          const unsubscribeProfile = firebaseHealthService.subscribeToUserData(
            firebaseUser.uid,
            (updatedProfile) => {
              setUserProfile(updatedProfile);
            }
          );

          // Store unsubscribe function for cleanup
          setUser({ ...firebaseUser, profileUnsubscribe: unsubscribeProfile });

        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe?.();
  }, []);

  // Authentication functions
  const signUp = async (email, password, userData = {}) => {
    setLoading(true);
    try {
      const result = await firebaseHealthService.signUp(email, password, userData);

      if (result.success) {
        // Profile will be loaded via the auth state listener
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await firebaseHealthService.signIn(email, password);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const result = await firebaseHealthService.signInWithGoogle();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Unsubscribe from profile updates if exists
      if (user?.profileUnsubscribe) {
        user.profileUnsubscribe();
      }

      // If in demo mode, just clear local storage
      if (firebaseHealthService.getConnectionStatus().isDemoMode) {
        localStorage.removeItem('healthmate-demo-user');
        // Clear local state
        setUser(null);
        setUserProfile(null);
        setLoading(false);
        return { success: true };
      }

      // Production mode - use Firebase sign out
      const result = await firebaseHealthService.signOut();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Clear local state
      setUser(null);
      setUserProfile(null);

    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      return await firebaseHealthService.resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    if (!user) throw new Error('No user logged in');

    try {
      const result = await firebaseHealthService.updateUserProfile(user.uid, profileData);

      if (result.success) {
        // Update local profile state
        setUserProfile(prev => ({ ...prev, ...profileData }));
      }

      return result;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Context value
  const value = {
    // User state
    user,
    userProfile,
    loading,

    // Authentication methods
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,

    // Helper computed values
    isAuthenticated: !!user || firebaseHealthService.getConnectionStatus().isDemoMode,
    // Check for demo admin user in localStorage for demo mode, or if admin email used
    isAdmin: userProfile?.role === 'admin' ||
      (() => {
        if (!firebaseHealthService.getConnectionStatus().isDemoMode) return false;
        try {
          const demoUser = JSON.parse(localStorage.getItem('healthmate-demo-user') || 'null');
          return demoUser?.role === 'admin' || demoUser?.role === 'Admin';
        } catch {
          return false;
        }
      })(),
    userId: user?.uid,
    userEmail: user?.email,
    displayName: userProfile?.displayName || userProfile?.name || user?.displayName,
    subscription: userProfile?.subscription || 'free',
    preferences: userProfile?.preferences || {},

    // Connection status
    connectionStatus: firebaseHealthService.getConnectionStatus(),
    isDemoMode: firebaseHealthService.getConnectionStatus().isDemoMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
