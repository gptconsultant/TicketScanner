import NetInfo from '@react-native-community/netinfo';
import { checkApiConnection } from '../services/api';

/**
 * Check if the device is connected to the internet and the API is reachable
 * @returns {Promise<boolean>} - Whether the API is reachable
 */
export const isAPIReachable = async () => {
  try {
    // First check if device has network connection
    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      return false;
    }
    
    // Then check if our API server is reachable
    const isReachable = await checkApiConnection();
    return isReachable;
  } catch (error) {
    console.error('API reachability check error:', error);
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
  const unsubscribe = NetInfo.addEventListener(state => {
    if (state.isConnected) {
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
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      
      // Wait for the calculated delay
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};