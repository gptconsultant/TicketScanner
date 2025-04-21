import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const OFFLINE_CHECK_INS_KEY = '@event_scanner:offline_check_ins';
const CACHED_TICKETS_KEY = '@event_scanner:cached_tickets';

/**
 * Save a check-in to offline storage
 * @param {Object} checkInData - The check-in data to save
 * @returns {Promise<void>}
 */
export const saveCheckInOffline = async (checkInData) => {
  try {
    // Get existing check-ins
    const existingCheckIns = await getOfflineCheckIns();
    
    // Add new check-in with timestamp
    const newCheckIn = {
      ...checkInData,
      offlineTimestamp: new Date().toISOString(),
      synced: false,
    };
    
    // Save updated array
    await AsyncStorage.setItem(
      OFFLINE_CHECK_INS_KEY,
      JSON.stringify([...existingCheckIns, newCheckIn])
    );
    
    console.log('Check-in saved offline:', newCheckIn);
  } catch (error) {
    console.error('Error saving check-in offline:', error);
    throw error;
  }
};

/**
 * Get all offline check-ins
 * @returns {Promise<Array>} - Array of offline check-ins
 */
export const getOfflineCheckIns = async () => {
  try {
    const checkInsJson = await AsyncStorage.getItem(OFFLINE_CHECK_INS_KEY);
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
    const checkIns = await getOfflineCheckIns();
    
    // Filter out the specific check-in
    const updatedCheckIns = checkIns.filter(
      checkIn => checkIn.ticketId !== ticketId
    );
    
    // Save updated array
    await AsyncStorage.setItem(
      OFFLINE_CHECK_INS_KEY,
      JSON.stringify(updatedCheckIns)
    );
  } catch (error) {
    console.error('Error removing offline check-in:', error);
    throw error;
  }
};

/**
 * Clear all offline check-ins
 * @returns {Promise<void>}
 */
export const clearOfflineCheckIns = async () => {
  try {
    await AsyncStorage.removeItem(OFFLINE_CHECK_INS_KEY);
  } catch (error) {
    console.error('Error clearing offline check-ins:', error);
    throw error;
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
    
    // Check if ticket already exists in cache
    const ticketExists = existingTickets.some(t => t.id === ticket.id);
    
    if (!ticketExists) {
      // Add new ticket with cache timestamp
      const cachedTicket = {
        ...ticket,
        cached_at: new Date().toISOString(),
        used: false,
      };
      
      // Save updated array
      await AsyncStorage.setItem(
        CACHED_TICKETS_KEY,
        JSON.stringify([...existingTickets, cachedTicket])
      );
      
      console.log('Ticket cached offline:', cachedTicket);
    }
  } catch (error) {
    console.error('Error caching ticket offline:', error);
    throw error;
  }
};

/**
 * Get all cached tickets
 * @returns {Promise<Array>} - Array of cached tickets
 */
export const getCachedTickets = async () => {
  try {
    const ticketsJson = await AsyncStorage.getItem(CACHED_TICKETS_KEY);
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
    await AsyncStorage.removeItem(CACHED_TICKETS_KEY);
  } catch (error) {
    console.error('Error clearing cached tickets:', error);
    throw error;
  }
};

/**
 * Mark a cached ticket as used
 * @param {string} ticketId - ID of the ticket to mark as used
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
export const markCachedTicketAsUsed = async (ticketId) => {
  try {
    // Get existing cached tickets
    const tickets = await getCachedTickets();
    
    // Find the ticket and update it
    const updatedTickets = tickets.map(ticket => {
      if (ticket.id === ticketId) {
        return { ...ticket, used: true, used_at: new Date().toISOString() };
      }
      return ticket;
    });
    
    // Check if any ticket was updated
    const ticketWasUpdated = tickets.some(ticket => ticket.id === ticketId);
    
    if (ticketWasUpdated) {
      // Save updated array
      await AsyncStorage.setItem(
        CACHED_TICKETS_KEY,
        JSON.stringify(updatedTickets)
      );
      
      console.log('Ticket marked as used:', ticketId);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error marking cached ticket as used:', error);
    return false;
  }
};