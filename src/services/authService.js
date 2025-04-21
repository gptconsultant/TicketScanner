import api from './api';
import { mockLogin, mockLogout } from './mockData';

/**
 * Login user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Login result with token, role, and user info
 */
export const login = async (username, password) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.post('/auth/login', { username, password });
    // return response.data;

    // For now, use mock data
    return await mockLogin(username, password);
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Login failed. Please check your credentials and try again.'
    );
  }
};

/**
 * Logout user
 * @param {string} token - User's auth token
 * @returns {Promise<Object>} - Logout result
 */
export const logout = async (token) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.post('/auth/logout');
    // return response.data;

    // For now, use mock data
    return await mockLogout(token);
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Logout failed. Please try again.'
    );
  }
};

/**
 * Get current user profile
 * @returns {Promise<Object>} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to get user profile. Please try again.'
    );
  }
};

/**
 * Check if token is valid
 * @param {string} token - User's auth token
 * @returns {Promise<boolean>} - Whether token is valid
 */
export const validateToken = async (token) => {
  try {
    const response = await api.post('/auth/validate', { token });
    return response.data.valid;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};
