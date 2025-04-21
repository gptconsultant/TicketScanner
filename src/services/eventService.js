import { fetchFromAPI } from './api';
import * as mockData from './mockData';

/**
 * Fetch all events
 * @returns {Promise<Object>} - Events data
 */
export const fetchEvents = async () => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI('/events');
    
    // For demo purposes, use mock implementation
    return await mockData.mockFetchEvents();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch gates for a specific event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Gates data
 */
export const fetchGates = async (eventId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/gates`);
    
    // For demo purposes, use mock implementation
    return await mockData.mockFetchGates(eventId);
  } catch (error) {
    console.error(`Error fetching gates for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Update gate status (enable/disable)
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @param {boolean} isEnabled - Whether gate is enabled
 * @returns {Promise<Object>} - Update result
 */
export const updateGateStatus = async (eventId, gateId, isEnabled) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/gates/${gateId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ isEnabled }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockUpdateGateStatus(eventId, gateId, isEnabled);
  } catch (error) {
    console.error(`Error updating gate ${gateId} status for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Create a new gate for an event
 * @param {number} eventId - Event ID
 * @param {string} name - Gate name
 * @param {string} identifier - Gate identifier (e.g., "Gate A")
 * @returns {Promise<Object>} - Create result with new gate data
 */
export const createGate = async (eventId, name, identifier) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/gates`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, identifier }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockCreateGate(eventId, name, identifier);
  } catch (error) {
    console.error(`Error creating gate for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Delete a gate
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteGate = async (eventId, gateId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/gates/${gateId}`, {
    //   method: 'DELETE',
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockDeleteGate(eventId, gateId);
  } catch (error) {
    console.error(`Error deleting gate ${gateId} for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Fetch event rules
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Rules data
 */
export const fetchEventRules = async (eventId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/rules`);
    
    // For demo purposes, use mock implementation
    return await mockData.mockFetchEventRules(eventId);
  } catch (error) {
    console.error(`Error fetching rules for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Create a new rule for an event
 * @param {number} eventId - Event ID
 * @param {string} name - Rule name
 * @param {string} type - Rule type (e.g., TIME_RESTRICTION)
 * @param {string} value - Rule value
 * @param {boolean} isActive - Whether rule is active
 * @returns {Promise<Object>} - Create result with new rule data
 */
export const createRule = async (eventId, name, type, value, isActive) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/rules`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, type, value, isActive }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockCreateRule(eventId, name, type, value, isActive);
  } catch (error) {
    console.error(`Error creating rule for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Update an existing rule
 * @param {number} eventId - Event ID
 * @param {Object} rule - Rule object with updated data
 * @returns {Promise<Object>} - Update result
 */
export const updateRule = async (eventId, rule) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/rules/${rule.id}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(rule),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockUpdateRule(eventId, rule);
  } catch (error) {
    console.error(`Error updating rule ${rule.id} for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Delete a rule
 * @param {number} eventId - Event ID
 * @param {number} ruleId - Rule ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteRule = async (eventId, ruleId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/rules/${ruleId}`, {
    //   method: 'DELETE',
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockDeleteRule(eventId, ruleId);
  } catch (error) {
    console.error(`Error deleting rule ${ruleId} for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Update event status (active/inactive)
 * @param {number} eventId - Event ID
 * @param {boolean} isActive - Whether event is active
 * @returns {Promise<Object>} - Update result
 */
export const updateEventStatus = async (eventId, isActive) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ isActive }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockUpdateEventStatus(eventId, isActive);
  } catch (error) {
    console.error(`Error updating event ${eventId} status:`, error);
    throw error;
  }
};

/**
 * Create a new event
 * @param {string} name - Event name
 * @param {string} date - Event date
 * @returns {Promise<Object>} - Create result with new event data
 */
export const createEvent = async (name, date) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI('/events', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ name, date }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockCreateEvent(name, date);
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteEvent = async (eventId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}`, {
    //   method: 'DELETE',
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockDeleteEvent(eventId);
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};