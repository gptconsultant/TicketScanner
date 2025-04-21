import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Load token and user info from storage on mount
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userInfoStr = await AsyncStorage.getItem('userInfo');
        const role = await AsyncStorage.getItem('userRole');
        
        if (token && userInfoStr && role) {
          setUserToken(token);
          setUserInfo(JSON.parse(userInfoStr));
          setUserRole(role);
        }
      } catch (e) {
        console.error('Failed to load auth data from storage:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const login = async (userData) => {
    try {
      setIsLoading(true);
      
      // In a real app, this would call an API
      // Here we're just setting mock data for demo
      const { username, role } = userData;
      
      // Simulate API call
      // const response = await authService.login(username, password);
      const mockToken = `mock-token-${role}-${Date.now()}`;
      const mockUserInfo = {
        id: role === 'admin' ? 1 : role === 'staff' ? 2 : 3,
        username,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} User`,
        email: `${username}@example.com`
      };
      
      // Store auth data
      await AsyncStorage.setItem('userToken', mockToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(mockUserInfo));
      await AsyncStorage.setItem('userRole', role);
      
      // Update state
      setUserToken(mockToken);
      setUserInfo(mockUserInfo);
      setUserRole(role);
      
      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // In a real app, call logout API
      // await authService.logout(userToken);
      
      // Clear storage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('userRole');
      
      // Reset state
      setUserToken(null);
      setUserInfo(null);
      setUserRole(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userInfo,
        userRole,
        login,
        logout,
        isAuthenticated: !!userToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};