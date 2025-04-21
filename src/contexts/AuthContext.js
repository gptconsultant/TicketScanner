import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService';
import * as asyncStorage from '../utils/asyncStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkLoggedInUser = async () => {
      try {
        const userData = await asyncStorage.getStoredUser();
        if (userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Error retrieving stored user:", err);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedInUser();
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      setLoading(true);
      const userData = await authService.login(username, password);
      setUser(userData);
      // Store user data for persistence
      await asyncStorage.storeUser(userData);
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      // Clear stored user data
      await asyncStorage.clearUser();
    } catch (err) {
      setError(err.message || 'Failed to logout');
    } finally {
      setLoading(false);
    }
  };

  const checkOut = async () => {
    try {
      setLoading(true);
      // Keep the user logged in but reset their session info
      await asyncStorage.clearSessionData();
      // Update user state to reflect the check out
      if (user) {
        const updatedUser = { ...user, currentSession: null };
        setUser(updatedUser);
        await asyncStorage.storeUser(updatedUser);
      }
    } catch (err) {
      setError(err.message || 'Failed to check out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout,
      checkOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
