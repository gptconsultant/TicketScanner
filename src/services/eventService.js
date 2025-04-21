import * as mockData from './mockData';

/**
 * Get all events
 * @returns {Promise<Array>} - List of events
 */
export const getEvents = async () => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // Get mock event data - in a real app this would be a server request
    const events = mockData.getEvents();
    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get event by ID
 * @param {string} eventId - The event ID
 * @returns {Promise<object>} - Event details
 */
export const getEventById = async (eventId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const event = mockData.getEventById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return event;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Get active events
 * @returns {Promise<Array>} - List of active events
 */
export const getActiveEvents = async () => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    const events = mockData.getEvents();
    return events.filter(event => event.isActive);
  } catch (error) {
    console.error('Error fetching active events:', error);
    throw error;
  }
};

/**
 * Update event details
 * @param {string} eventId - The event ID
 * @param {object} updates - The event updates
 * @returns {Promise<object>} - Updated event
 */
export const updateEvent = async (eventId, updates) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  try {
    // In a real app, this would update the event on the server
    // For now, just return the merged updates
    const event = mockData.getEventById(eventId);
    
    if (!event) {
      throw new Error('Event not found');
    }
    
    return { ...event, ...updates };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};
