import NetInfo from '@react-native-community/netinfo';
import { checkApiConnection } from '../services/api';

/**
 * Check if the device is connected to the internet and the API is reachable
 * @returns {Promise<boolean>} - Whether the API is reachable
 */
export const isAPIReachable = async () => {
  try {
    // First check if device has any connection
    const netInfo = await NetInfo.fetch();
    
    if (!netInfo.isConnected) {
      return false;
    }
    
    // Then check if API server is reachable
    return await checkApiConnection();
  } catch (error) {
    console.error('Error checking API reachability:', error);
    return false;
  }
};

/**
 * Register listeners for network state changes
 * @param {Function} onConnected - Callback when connected
 * @param {Function} onDisconnected - Callback when disconnected
 * @returns {Function} - Cleanup function to unsubscribe
 */
export const registerNetworkListeners = (onConnected, onDisconnected) => {
  // Set up network change listener
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected && state.isInternetReachable !== false) {
      if (typeof onConnected === 'function') {
        onConnected();
      }
    } else {
      if (typeof onDisconnected === 'function') {
        onDisconnected();
      }
    }
  });
  
  return unsubscribe;
};

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise<any>} - Result of the function
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed:`, error);
      lastError = error;
      
      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
