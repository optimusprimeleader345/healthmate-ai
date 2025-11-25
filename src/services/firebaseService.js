/**
 * Firebase Health Service
 * Cloud integration for data persistence, authentication, and real-time sync
 */

// Firebase imports
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  limit as limitFn,
  Timestamp,
  enableNetwork,
  disableNetwork,
  serverTimestamp
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if using demo credentials
const isDemoMode = import.meta.env.VITE_USE_DEMO_MODE === 'true' ||
                   firebaseConfig.apiKey?.includes('demo') ||
                   firebaseConfig.projectId?.includes('demo');

/**
 * Firebase Health Service Class
 */
export class FirebaseHealthService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.currentUser = null;
    this.unsubscribers = [];
    this.userListeners = new Map();

    if (isDemoMode) {
      console.warn('Firebase service running in demo mode. Using localStorage persistence.');
      this.initializeDemoMode();
    } else {
      this.initializeFirebase();
    }
  }

  /**
   * Initialize Firebase with real credentials
   */
  initializeFirebase() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.storage = getStorage(this.app);

      // Set up auth state listener
      this.setupAuthListener();
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase:', error);
      this.initializeDemoMode();
    }
  }

  /**
   * Demo mode using localStorage for development
   */
  async initializeDemoMode() {
    this.demoStorage = {
      users: new Map(),
      nutrition: new Map(),
      fitness: new Map(),
      medications: new Map(),
      sleep: new Map(),
      chatHistory: new Map()
    };

    // Load from localStorage
    this.loadFromLocalStorage();

    console.log('Firebase service initialized in demo mode');
  }

  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('healthmate_firebase_demo');
      if (stored) {
        const data = JSON.parse(stored);
        Object.keys(data).forEach(key => {
          if (this.demoStorage[key]) {
            this.demoStorage[key] = new Map(Object.entries(data[key]));
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load demo data from localStorage');
    }
  }

  saveToLocalStorage() {
    try {
      const data = {};
      Object.keys(this.demoStorage).forEach(key => {
        data[key] = Object.fromEntries(this.demoStorage[key]);
      });
      localStorage.setItem('healthmate_firebase_demo', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save demo data to localStorage');
    }
  }

  setupAuthListener() {
    if (!this.auth) return;

    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
      console.log('Auth state changed:', user ? 'signed in' : 'signed out', user?.email);
    });

    this.unsubscribers.push(unsubscribe);
  }

  /**
   * Authentication Methods
   */
  async signUp(email, password, userData = {}) {
    if (isDemoMode) {
      return await this.demoSignUp(email, password, userData);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Update profile with additional data
      await updateProfile(user, {
        displayName: userData.displayName || userData.name || email.split('@')[0]
      });

      // Create user profile in Firestore
      await this.createUserProfile(user.uid, {
        ...userData,
        email: user.email,
        createdAt: new Date(),
        subscription: 'free',
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
          units: 'metric'
        }
      });

      return {
        success: true,
        user: user,
        message: 'Account created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
        code: error.code
      };
    }
  }

  async signIn(email, password) {
    if (isDemoMode) {
      return await this.demoSignIn(email, password);
    }

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return {
        success: true,
        user: userCredential.user,
        message: 'Signed in successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
        code: error.code
      };
    }
  }

  async signInWithGoogle() {
    if (isDemoMode) {
      return await this.demoGoogleSignIn();
    }

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      const result = await signInWithPopup(this.auth, provider);

      // Check if user profile exists, create if not
      await this.ensureUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        provider: 'google'
      });

      return {
        success: true,
        user: result.user,
        message: 'Signed in with Google successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error),
        code: error.code
      };
    }
  }

  async signOut() {
    if (isDemoMode) {
      return await this.demoSignOut();
    }

    try {
      await signOut(this.auth);
      return {
        success: true,
        message: 'Signed out successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  async resetPassword(email) {
    if (isDemoMode) {
      return await this.demoResetPassword(email);
    }

    try {
      await sendPasswordResetEmail(this.auth, email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  }

  /**
   * User Profile Methods
   */
  async getUserProfile(userId) {
    if (isDemoMode) {
      return this.demoStorage.users.get(userId) || null;
    }

    try {
      const docRef = doc(this.db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId, data) {
    if (isDemoMode) {
      this.demoStorage.users.set(userId, data);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = doc(this.db, 'users', userId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  async createUserProfile(userId, data) {
    if (isDemoMode) {
      this.demoStorage.users.set(userId, data);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = doc(this.db, 'users', userId);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error: error.message };
    }
  }

  async ensureUserProfile(userId, data) {
    const existing = await this.getUserProfile(userId);
    if (!existing) {
      await this.createUserProfile(userId, data);
    }
  }

  /**
   * Health Data Storage Methods
   */
  async saveNutritionData(userId, mealData) {
    if (isDemoMode) {
      this.demoStorage.nutrition.set(`${userId}_${Date.now()}`, mealData);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = await addDoc(collection(this.db, 'nutrition'), {
        userId,
        ...mealData,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving nutrition data:', error);
      return { success: false, error: error.message };
    }
  }

  async getNutritionData(userId, date, limit = 50) {
    if (isDemoMode) {
      const allEntries = Array.from(this.demoStorage.nutrition.values())
        .filter(entry => entry.userId === userId && entry.date === date)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      return { success: true, data: allEntries };
    }

    try {
      const q = query(
        collection(this.db, 'nutrition'),
        where('userId', '==', userId),
        where('date', '==', date),
        orderBy('createdAt', 'desc'),
        limitFn(limit)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error getting nutrition data:', error);
      return { success: false, error: error.message };
    }
  }

  async saveFitnessData(userId, workoutData) {
    if (isDemoMode) {
      this.demoStorage.fitness.set(`${userId}_${Date.now()}`, workoutData);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = await addDoc(collection(this.db, 'fitness'), {
        userId,
        ...workoutData,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving fitness data:', error);
      return { success: false, error: error.message };
    }
  }

  async getFitnessData(userId, startDate, endDate) {
    if (isDemoMode) {
      const allEntries = Array.from(this.demoStorage.fitness.values())
        .filter(entry => {
          const entryDate = new Date(entry.date);
          return entry.userId === userId &&
                 entryDate >= new Date(startDate) &&
                 entryDate <= new Date(endDate);
        });
      return { success: true, data: allEntries };
    }

    try {
      const q = query(
        collection(this.db, 'fitness'),
        where('userId', '==', userId),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { success: true, data };
    } catch (error) {
      console.error('Error getting fitness data:', error);
      return { success: false, error: error.message };
    }
  }

  async saveSleepData(userId, sleepData) {
    if (isDemoMode) {
      this.demoStorage.sleep.set(`${userId}_${Date.now()}`, sleepData);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = await addDoc(collection(this.db, 'sleep'), {
        userId,
        ...sleepData,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving sleep data:', error);
      return { success: false, error: error.message };
    }
  }

  async saveMedicationData(userId, medicationData) {
    if (isDemoMode) {
      this.demoStorage.medications.set(`${userId}_${Date.now()}`, medicationData);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const docRef = await addDoc(collection(this.db, 'medications'), {
        userId,
        ...medicationData,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving medication data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Chat History Methods for AI Assistant
   */
  async saveChatMessage(userId, message, isUser = true) {
    if (isDemoMode) {
      const chats = this.demoStorage.chatHistory.get(userId) || [];
      chats.push({
        text: message,
        isUser,
        timestamp: new Date().toISOString()
      });
      // Keep only last 100 messages
      if (chats.length > 100) chats.splice(0, chats.length - 100);
      this.demoStorage.chatHistory.set(userId, chats);
      this.saveToLocalStorage();
      return { success: true };
    }

    try {
      const chatRef = await addDoc(collection(this.db, 'chatHistory'), {
        userId,
        message,
        isUser,
        createdAt: serverTimestamp()
      });
      return { success: true, id: chatRef.id };
    } catch (error) {
      console.error('Error saving chat message:', error);
      return { success: false, error: error.message };
    }
  }

  async getChatHistory(userId, limit = 50) {
    if (isDemoMode) {
      const chats = this.demoStorage.chatHistory.get(userId) || [];
      return { success: true, data: chats.slice(-limit) };
    }

    try {
      const q = query(
        collection(this.db, 'chatHistory'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limitFn(limit)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .reverse(); // Put in chronological order

      return { success: true, data };
    } catch (error) {
      console.error('Error getting chat history:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Real-time Subscriptions
   */
  subscribeToUserData(userId, callback) {
    if (isDemoMode) {
      // In demo mode, just call callback immediately
      setTimeout(() => callback && callback(this.demoStorage.users.get(userId)), 100);
      return () => {}; // Return no-op unsubscribe
    }

    const docRef = doc(this.db, 'users', userId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && callback) {
        callback({
          id: docSnap.id,
          ...docSnap.data()
        });
      }
    });

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  subscribeToNutritionData(userId, callback) {
    if (isDemoMode) {
      return () => {}; // No real subscription needed
    }

    const q = query(
      collection(this.db, 'nutrition'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limitFn(100)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      if (callback) callback(data);
    });

    this.unsubscribers.push(unsubscribe);
    return unsubscribe;
  }

  /**
   * Demo Mode Implementations
   */
  async demoSignUp(email, password, userData) {
    const userId = `demo_${Date.now()}`;
    this.demoStorage.users.set(userId, {
      uid: userId,
      email,
      displayName: userData.name || userData.displayName || email.split('@')[0],
      ...userData,
      createdAt: new Date(),
      provider: 'password'
    });
    this.saveToLocalStorage();

    return {
      success: true,
      user: { uid: userId, email },
      message: 'Demo account created successfully'
    };
  }

  async demoSignIn(email, password) {
    // Find user by email
    for (const [userId, userData] of this.demoStorage.users) {
      if (userData.email === email) {
        return {
          success: true,
          user: { uid: userId, email },
          message: 'Demo sign in successful'
        };
      }
    }

    // Create demo user on first sign in
    return await this.demoSignUp(email, password, {});
  }

  async demoGoogleSignIn() {
    const userId = `demo_google_${Date.now()}`;
    this.demoStorage.users.set(userId, {
      uid: userId,
      email: 'demo@google.com',
      displayName: 'Demo Google User',
      provider: 'google',
      createdAt: new Date()
    });
    this.saveToLocalStorage();

    return {
      success: true,
      user: { uid: userId, email: 'demo@google.com', displayName: 'Demo Google User' },
      message: 'Demo Google sign in successful'
    };
  }

  async demoSignOut() {
    return { success: true, message: 'Demo signed out' };
  }

  async demoResetPassword(email) {
    return { success: true, message: 'Demo password reset email sent' };
  }

  /**
   * Utility Methods
   */
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled';
      default:
        return error.message || 'An authentication error occurred';
    }
  }

  /**
   * Cleanup Methods
   */
  async disconnect() {
    this.unsubscribers.forEach(unsubscribe => unsubscribe());
    this.unsubscribers = [];
    this.userListeners.clear();

    if (!isDemoMode) {
      await this.signOut();
    }
  }

  /**
   * Connection Status
   */
  getConnectionStatus() {
    return {
      isInitialized: true,
      isDemoMode,
      hasUser: !!this.currentUser,
      userId: this.currentUser?.uid || null,
      networkEnabled: !isDemoMode
    };
  }

  enableNetwork() {
    if (!isDemoMode && this.db) {
      enableNetwork(this.db);
    }
  }

  disableNetwork() {
    if (!isDemoMode && this.db) {
      disableNetwork(this.db);
    }
  }
}

// Create singleton instance
const firebaseService = new FirebaseHealthService();

// Export Firebase modules for direct use
export { getAuth, onAuthStateChanged };

// Export the auth instance for use in components
export const auth = isDemoMode ? null : firebaseService.auth;

// Export singleton instance
export const firebaseHealthService = firebaseService;

export default firebaseHealthService;
