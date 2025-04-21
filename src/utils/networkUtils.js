import NetInfo from '@react-native-community/netinfo';

/**
 * Check if the device is currently connected to the internet
 * @returns {Promise<boolean>} - Whether the device has network connectivity
 */
export const isConnected = async () => {
  try {
    const networkState = await NetInfo.fetch();
    return networkState.isConnected && networkState.isInternetReachable;
  } catch (error) {
    console.error('Error checking network connectivity:', error);
    // Assume not connected if we can't determine status
    return false;
  }
};

/**
 * Subscribe to network state changes
 * @param {Function} callback - Callback function to call when network state changes
 * @returns {Function} - Unsubscribe function
 */
export const subscribeToNetworkChanges = (callback) => {
  return NetInfo.addEventListener(state => {
    const isConnectedNow = state.isConnected && state.isInternetReachable;
    callback(isConnectedNow, state);
  });
};

/**
 * Get detailed network information
 * @returns {Promise<object>} - Detailed network information
 */
export const getNetworkInfo = async () => {
  try {
    const networkState = await NetInfo.fetch();
    return {
      isConnected: networkState.isConnected,
      isInternetReachable: networkState.isInternetReachable,
      type: networkState.type,
      isWifi: networkState.type === 'wifi',
      isCellular: networkState.type === 'cellular',
      details: networkState.details
    };
  } catch (error) {
    console.error('Error getting network info:', error);
    throw error;
  }
};

/**
 * Utility to help with API calls that need to handle offline scenarios
 * @param {Function} onlineCallback - Function to call when online
 * @param {Function} offlineCallback - Function to call when offline
 * @returns {Promise<any>} - Result of the appropriate callback
 */
export const withNetworkConnectivity = async (onlineCallback, offlineCallback) => {
  const connected = await isConnected();
  
  if (connected) {
    return onlineCallback();
  } else {
    return offlineCallback();
  }
};

/**
 * Retry a network operation with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.baseDelay - Base delay in ms (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in ms (default: 10000)
 * @returns {Promise<any>} - Result of the operation
 */
export const retryWithBackoff = async (operation, options = {}) => {
  const { 
    maxRetries = 3, 
    baseDelay = 1000, 
    maxDelay = 10000 
  } = options;
  
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        maxDelay,
        baseDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5)
      );
      
      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};
