import { createContext, useState, useEffect, useCallback } from 'react';

import {
  loginWithEmail,
  loginWithGoogle,
  sendOTP,
  verifyOTP,
  signupWithEmail,
  logout as authLogout,
} from '../services/authService';
import { getUserData, clearAllStorage, isAuthenticated as checkAuth } from '../utils/storage';


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check if user has valid token in localStorage
        if (checkAuth()) {
          // Get stored user data
          const userData = getUserData();

          if (userData) {
            setUser(userData);
            console.log('User restored from storage:', userData);
          } else {
            // Token exists but no user data - clear everything
            clearAllStorage();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        clearAllStorage();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      // Call authService
      const { user: userData } = await loginWithEmail(email, password);

      // Update state
      setUser(userData);

      console.log('Login successful:', userData);
      return userData;

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Call authService
      const { user: userData } = await loginWithGoogle();

      // Update state
      setUser(userData);

      console.log('Google login successful:', userData);
      return userData;

    } catch (err) {
      console.error('Google login error:', err);
      setError(err.message || 'Google login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const loginPhone = useCallback(async (phoneNumber) => {
    try {
      setLoading(true);
      setError(null);

      // Send OTP via Firebase
      await sendOTP(phoneNumber);

      console.log('OTP sent to:', phoneNumber);

    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.message || 'Failed to send OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const verifyPhone = useCallback(async (otp) => {
    try {
      setLoading(true);
      setError(null);

      // Verify OTP and complete login
      const { user: userData } = await verifyOTP(otp);

      // Update state
      setUser(userData);

      console.log('Phone login successful:', userData);
      return userData;

    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Invalid OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const signup = useCallback(async (email, password, name) => {
    try {
      setLoading(true);
      setError(null);

      // Call authService
      const { user: userData } = await signupWithEmail(email, password, name);

      // Update state
      setUser(userData);

      console.log('Signup successful:', userData);
      return userData;

    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      setLoading(true);

      // Call authService logout
      await authLogout();

      // Clear state
      setUser(null);
      setError(null);

      console.log('Logout successful');

    } catch (err) {
      console.error('Logout error:', err);
      // Even if API call fails, clear local state
      setUser(null);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...updates };

      // Also update localStorage
      const userData = getUserData();
      if (userData) {
        setUserData({ ...userData, ...updates });
      }

      console.log('📝 User updated:', updatedUser);
      return updatedUser;
    });
  }, []);

   const clearError = useCallback(() => {
    setError(null);
  }, []);


  const value = {
    // State
    user,                           // Current user object or null
    loading,                        // Is auth operation in progress?
    error,                          // Error message or null
    isAuthenticated: !!user,        // Boolean: is user logged in?

    // Auth functions
    login,                          // Email/password login
    loginGoogle,                    // Google OAuth login
    loginPhone,                     // Send OTP to phone
    verifyPhone,                    // Verify OTP and login
    signup,                         // Create new account
    logout,                         // Logout user

    // Utility functions
    updateUser,                     // Update user data
    clearError,                     // Clear error message
  };

  if (loading && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Loading...</p>
      </div>
    );
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};