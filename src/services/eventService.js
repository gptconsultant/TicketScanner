import api from './api';
import { 
  mockFetchEvents, 
  mockFetchGates, 
  mockUpdateGateStatus,
  mockCreateGate,
  mockDeleteGate,
  mockFetchEventRules,
  mockCreateRule,
  mockUpdateRule,
  mockDeleteRule,
  mockUpdateEventStatus,
  mockCreateEvent,
  mockDeleteEvent,
} from './mockData';

/**
 * Fetch all events
 * @returns {Promise<Object>} - Events data
 */
export const fetchEvents = async () => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.get('/events');
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockFetchEvents();
  } catch (error) {
    console.error('Fetch events error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch events' 
    };
  }
};

/**
 * Fetch gates for a specific event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Gates data
 */
export const fetchGates = async (eventId) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.get(`/events/${eventId}/gates`);
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockFetchGates(eventId);
  } catch (error) {
    console.error('Fetch gates error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch gates' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.patch(`/events/${eventId}/gates/${gateId}`, { 
    //   isEnabled 
    // });
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockUpdateGateStatus(eventId, gateId, isEnabled);
  } catch (error) {
    console.error('Update gate status error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to update gate status' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.post(`/events/${eventId}/gates`, { 
    //   name, 
    //   identifier,
    //   isEnabled: true
    // });
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockCreateGate(eventId, name, identifier);
  } catch (error) {
    console.error('Create gate error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to create gate' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.delete(`/events/${eventId}/gates/${gateId}`);
    // return { success: true };

    // For now, use mock data
    return await mockDeleteGate(eventId, gateId);
  } catch (error) {
    console.error('Delete gate error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to delete gate' 
    };
  }
};

/**
 * Fetch event rules
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Rules data
 */
export const fetchEventRules = async (eventId) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.get(`/events/${eventId}/rules`);
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockFetchEventRules(eventId);
  } catch (error) {
    console.error('Fetch event rules error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to fetch event rules' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.post(`/events/${eventId}/rules`, {
    //   name,
    //   type,
    //   value,
    //   isActive
    // });
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockCreateRule(eventId, name, type, value, isActive);
  } catch (error) {
    console.error('Create rule error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to create rule' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.put(`/events/${eventId}/rules/${rule.id}`, rule);
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockUpdateRule(eventId, rule);
  } catch (error) {
    console.error('Update rule error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to update rule' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.delete(`/events/${eventId}/rules/${ruleId}`);
    // return { success: true };

    // For now, use mock data
    return await mockDeleteRule(eventId, ruleId);
  } catch (error) {
    console.error('Delete rule error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to delete rule' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.patch(`/events/${eventId}`, { isActive });
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockUpdateEventStatus(eventId, isActive);
  } catch (error) {
    console.error('Update event status error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to update event status' 
    };
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
    // When ready for real API, uncomment this:
    // const response = await api.post('/events', { 
    //   name, 
    //   date,
    //   isActive: true
    // });
    // return { success: true, data: response.data };

    // For now, use mock data
    return await mockCreateEvent(name, date);
  } catch (error) {
    console.error('Create event error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to create event' 
    };
  }
};

/**
 * Delete an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteEvent = async (eventId) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.delete(`/events/${eventId}`);
    // return { success: true };

    // For now, use mock data
    return await mockDeleteEvent(eventId);
  } catch (error) {
    console.error('Delete event error:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Failed to delete event' 
    };
  }
};
