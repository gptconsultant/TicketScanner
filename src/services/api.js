import { Platform } from 'react-native';

// Base API URL - would be replaced with your actual API endpoint
const API_BASE_URL = 'https://api.event-scanner.example.com';

// API endpoints
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VALIDATE_TOKEN: '/auth/validate',
  },
  EVENTS: {
    LIST: '/events',
    GATES: '/events/:eventId/gates',
    RULES: '/events/:eventId/rules',
  },
  TICKETS: {
    VALIDATE: '/tickets/validate',
    SYNC: '/tickets/sync',
    HISTORY: '/events/:eventId/tickets/history',
  },
};

/**
 * Generic fetch wrapper with authentication and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {string} authToken - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const fetchFromAPI = async (endpoint, options = {}, authToken = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': `EventScanner/${Platform.OS}`,
    };

    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Check if the API server is reachable
 * @returns {Promise<boolean>} - Whether the API is reachable
 */
export const checkApiConnection = async () => {
  try {
    // Using a simple endpoint that doesn't require authentication
    // In a real app, you might have a specific health check endpoint
    // This is just a mock function for demonstration
    
    // In development or when using mock data, we'll return true
    // In a real app, you would use the commented code below
    
    /* 
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Short timeout to not block the UI for too long
      timeout: 5000,
    });
    
    return response.ok;
    */
    
    // For demo purposes, we'll simulate a successful connection
    return true;
  } catch (error) {
    console.error('API connection check error:', error);
    return false;
  }
};