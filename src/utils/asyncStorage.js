import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER: '@EventScan:user',
  SESSION_DATA: '@EventScan:sessionData',
  PENDING_CHECK_INS: '@EventScan:pendingCheckIns',
  PENDING_GATE_CHANGES: '@EventScan:pendingGateChanges'
};

/**
 * Store user data in AsyncStorage
 * @param {object} userData - User data to store
 * @returns {Promise<void>}
 */
export const storeUser = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, jsonValue);
  } catch (error) {
    console.error('Error storing user data:', error);
    throw error;
  }
};

/**
 * Retrieve user data from AsyncStorage
 * @returns {Promise<object|null>} - User data or null if not found
 */
export const getStoredUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    throw error;
  }
};

/**
 * Clear user data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Store session data (selected event, gate, etc.)
 * @param {object} sessionData - Session data to store
 * @returns {Promise<void>}
 */
export const storeSessionData = async (sessionData) => {
  try {
    const jsonValue = JSON.stringify(sessionData);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_DATA, jsonValue);
  } catch (error) {
    console.error('Error storing session data:', error);
    throw error;
  }
};

/**
 * Retrieve session data from AsyncStorage
 * @returns {Promise<object|null>} - Session data or null if not found
 */
export const getSessionData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_DATA);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving session data:', error);
    throw error;
  }
};

/**
 * Clear session data from AsyncStorage
 * @returns {Promise<void>}
 */
export const clearSessionData = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_DATA);
  } catch (error) {
    console.error('Error clearing session data:', error);
    throw error;
  }
};

/**
 * Store a pending check-in to be synchronized later
 * @param {object} checkInData - Check-in data to store
 * @returns {Promise<void>}
 */
export const storePendingCheckIn = async (checkInData) => {
  try {
    // Get existing pending check-ins
    const existingData = await getPendingCheckIns();
    
    // Add timestamp if it doesn't exist
    if (!checkInData.timestamp) {
      checkInData.timestamp = new Date().toISOString();
    }
    
    // Add the new check-in
    const updatedData = [...existingData, checkInData];
    
    // Store the updated list
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_CHECK_INS, 
      JSON.stringify(updatedData)
    );
  } catch (error) {
    console.error('Error storing pending check-in:', error);
    throw error;
  }
};

/**
 * Get all pending check-ins
 * @returns {Promise<Array>} - Array of pending check-ins
 */
export const getPendingCheckIns = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_CHECK_INS);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving pending check-ins:', error);
    throw error;
  }
};

/**
 * Clear all pending check-ins
 * @returns {Promise<void>}
 */
export const clearPendingCheckIns = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_CHECK_INS);
  } catch (error) {
    console.error('Error clearing pending check-ins:', error);
    throw error;
  }
};

/**
 * Queue a gate status change to be synchronized later
 * @param {string} gateId - ID of the gate
 * @param {boolean} enabled - New status of the gate
 * @returns {Promise<void>}
 */
export const queueGateStatusChange = async (gateId, enabled) => {
  try {
    // Get existing pending gate changes
    const existingChanges = await getPendingGateStatusChanges();
    
    // Create the new change object
    const newChange = {
      gateId,
      enabled,
      timestamp: new Date().toISOString()
    };
    
    // Add the new change
    const updatedChanges = [...existingChanges, newChange];
    
    // Store the updated list
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_GATE_CHANGES, 
      JSON.stringify(updatedChanges)
    );
  } catch (error) {
    console.error('Error queuing gate status change:', error);
    throw error;
  }
};

/**
 * Get all pending gate status changes
 * @returns {Promise<Array>} - Array of pending changes
 */
export const getPendingGateStatusChanges = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_GATE_CHANGES);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error retrieving pending gate changes:', error);
    throw error;
  }
};

/**
 * Clear all pending gate status changes
 * @returns {Promise<void>}
 */
export const clearPendingGateStatusChanges = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_GATE_CHANGES);
  } catch (error) {
    console.error('Error clearing pending gate changes:', error);
    throw error;
  }
};

/**
 * Clear all stored data (for complete reset)
 * @returns {Promise<void>}
 */
export const clearAllData = async () => {
  try {
    const keys = [
      STORAGE_KEYS.USER,
      STORAGE_KEYS.SESSION_DATA,
      STORAGE_KEYS.PENDING_CHECK_INS,
      STORAGE_KEYS.PENDING_GATE_CHANGES
    ];
    
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
