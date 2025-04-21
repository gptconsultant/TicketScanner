import { isAPIReachable } from '../utils/networkUtils';

// Base API URL - would point to your backend in production
const API_BASE_URL = 'https://api.example.com';

/**
 * Generic fetch wrapper with authentication and error handling
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @param {string} authToken - Authentication token
 * @returns {Promise<Object>} - Response data
 */
export const fetchFromAPI = async (endpoint, options = {}, authToken = null) => {
  try {
    // Check if API is reachable
    const isReachable = await isAPIReachable();
    if (!isReachable) {
      throw new Error('API is not reachable. Please check your internet connection.');
    }

    // Prepare headers
    const headers = {
      ...(options.headers || {}),
    };

    // Add auth token if provided
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Parse response
    const data = await response.json();

    // Check for error
    if (!response.ok) {
      throw new Error(data.message || `API error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Check if the API server is reachable
 * @returns {Promise<boolean>} - Whether the API is reachable
 */
export const checkApiConnection = async () => {
  try {
    // Use a timeout to avoid hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('API connection check failed:', error.message);
    return false;
  }
};