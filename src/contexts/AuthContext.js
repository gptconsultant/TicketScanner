import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, logout } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'admin', 'staff', or 'volunteer'
  const [userInfo, setUserInfo] = useState(null);

  const loginUser = async (username, password) => {
    setIsLoading(true);
    try {
      // Call login service
      const response = await login(username, password);
      
      if (response.success) {
        const { token, role, user } = response;
        
        // Store auth data
        setUserToken(token);
        setUserRole(role);
        setUserInfo(user);
        
        // Save to AsyncStorage
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', role);
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      } else {
        // Handle login failure
        console.error('Login failed:', response.error);
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      // Call logout service
      await logout(userToken);
      
      // Clear auth data
      setUserToken(null);
      setUserRole(null);
      setUserInfo(null);
      
      // Remove from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userInfo');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!userToken;
  };

  const checkVolunteerShift = () => {
    // For volunteers, check if they're still on shift
    if (userRole === 'volunteer' && userInfo) {
      return userInfo.onShift || false;
    }
    return false;
  };

  const startVolunteerShift = async () => {
    if (userRole === 'volunteer' && userInfo) {
      const updatedUserInfo = { ...userInfo, onShift: true };
      setUserInfo(updatedUserInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  };

  const endVolunteerShift = async () => {
    if (userRole === 'volunteer' && userInfo) {
      const updatedUserInfo = { ...userInfo, onShift: false };
      setUserInfo(updatedUserInfo);
      await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
    }
  };

  // Check if user is already logged in on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        const storedRole = await AsyncStorage.getItem('userRole');
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        
        if (storedToken && storedRole) {
          setUserToken(storedToken);
          setUserRole(storedRole);
          setUserInfo(storedUserInfo ? JSON.parse(storedUserInfo) : null);
        }
      } catch (error) {
        console.error('Error restoring auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userRole,
        userInfo,
        isAuthenticated,
        login: loginUser,
        logout: logoutUser,
        checkVolunteerShift,
        startVolunteerShift,
        endVolunteerShift
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
