import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_CHECKINS_KEY = 'offline_checkins';
const OFFLINE_TICKETS_KEY = 'offline_tickets';

/**
 * Save a check-in to offline storage
 * @param {Object} checkInData - The check-in data to save
 * @returns {Promise<void>}
 */
export const saveCheckInOffline = async (checkInData) => {
  try {
    // Get existing check-ins
    const existingCheckIns = await getOfflineCheckIns();
    
    // Add the new check-in
    const updatedCheckIns = [...existingCheckIns, checkInData];
    
    // Save back to storage
    await AsyncStorage.setItem(
      OFFLINE_CHECKINS_KEY, 
      JSON.stringify(updatedCheckIns)
    );
  } catch (error) {
    console.error('Error saving offline check-in:', error);
    throw new Error('Failed to save check-in data offline');
  }
};

/**
 * Get all offline check-ins
 * @returns {Promise<Array>} - Array of offline check-ins
 */
export const getOfflineCheckIns = async () => {
  try {
    const checkInsJson = await AsyncStorage.getItem(OFFLINE_CHECKINS_KEY);
    return checkInsJson ? JSON.parse(checkInsJson) : [];
  } catch (error) {
    console.error('Error getting offline check-ins:', error);
    return [];
  }
};

/**
 * Remove a specific check-in from offline storage
 * @param {string} ticketId - ID of the ticket to remove
 * @returns {Promise<void>}
 */
export const removeOfflineCheckIn = async (ticketId) => {
  try {
    // Get existing check-ins
    const existingCheckIns = await getOfflineCheckIns();
    
    // Filter out the check-in to remove
    const updatedCheckIns = existingCheckIns.filter(
      checkIn => checkIn.ticketId !== ticketId
    );
    
    // Save back to storage
    await AsyncStorage.setItem(
      OFFLINE_CHECKINS_KEY, 
      JSON.stringify(updatedCheckIns)
    );
  } catch (error) {
    console.error('Error removing offline check-in:', error);
    throw new Error('Failed to remove check-in data');
  }
};

/**
 * Clear all offline check-ins
 * @returns {Promise<void>}
 */
export const clearOfflineCheckIns = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_CHECKINS_KEY);
  } catch (error) {
    console.error('Error clearing offline check-ins:', error);
    throw new Error('Failed to clear offline check-ins');
  }
};

/**
 * Cache a validated ticket for offline use
 * @param {Object} ticket - The ticket to cache
 * @returns {Promise<void>}
 */
export const cacheTicketOffline = async (ticket) => {
  try {
    // Get existing cached tickets
    const existingTickets = await getCachedTickets();
    
    // Check if ticket already exists
    const ticketExists = existingTickets.some(t => t.id === ticket.id);
    
    if (!ticketExists) {
      // Add the new ticket
      const updatedTickets = [...existingTickets, ticket];
      
      // Save back to storage
      await AsyncStorage.setItem(
        OFFLINE_TICKETS_KEY, 
        JSON.stringify(updatedTickets)
      );
    }
  } catch (error) {
    console.error('Error caching ticket offline:', error);
    throw new Error('Failed to cache ticket data offline');
  }
};

/**
 * Get all cached tickets
 * @returns {Promise<Array>} - Array of cached tickets
 */
export const getCachedTickets = async () => {
  try {
    const ticketsJson = await AsyncStorage.getItem(OFFLINE_TICKETS_KEY);
    return ticketsJson ? JSON.parse(ticketsJson) : [];
  } catch (error) {
    console.error('Error getting cached tickets:', error);
    return [];
  }
};

/**
 * Get a cached ticket by ID
 * @param {string} ticketId - ID of the ticket to get
 * @returns {Promise<Object|null>} - The cached ticket or null if not found
 */
export const getCachedTicketById = async (ticketId) => {
  try {
    const tickets = await getCachedTickets();
    return tickets.find(ticket => ticket.id === ticketId) || null;
  } catch (error) {
    console.error('Error getting cached ticket by ID:', error);
    return null;
  }
};

/**
 * Clear all cached tickets
 * @returns {Promise<void>}
 */
export const clearCachedTickets = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_TICKETS_KEY);
  } catch (error) {
    console.error('Error clearing cached tickets:', error);
    throw new Error('Failed to clear cached tickets');
  }
};

/**
 * Mark a cached ticket as used
 * @param {string} ticketId - ID of the ticket to mark as used
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const markCachedTicketAsUsed = async (ticketId) => {
  try {
    const tickets = await getCachedTickets();
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex === -1) {
      return false;
    }
    
    tickets[ticketIndex].isUsed = true;
    
    await AsyncStorage.setItem(
      OFFLINE_TICKETS_KEY, 
      JSON.stringify(tickets)
    );
    
    return true;
  } catch (error) {
    console.error('Error marking cached ticket as used:', error);
    return false;
  }
};
