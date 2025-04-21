import api from './api';
import { validateRules } from './rulesEngine';
import { mockValidateTicket, mockSyncCheckIns } from './mockData';

/**
 * Validate a ticket against the server
 * @param {string} ticketData - QR code data
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @returns {Promise<Object>} - Validation result
 */
export const validateTicket = async (ticketData, eventId, gateId) => {
  try {
    // Parse ticket data - we expect a JSON string from the QR code
    let ticket;
    try {
      ticket = JSON.parse(ticketData);
    } catch (e) {
      return {
        success: false,
        error: 'Invalid ticket format. QR code contains invalid data.',
        ticket: null
      };
    }

    // When ready for real API, uncomment this:
    // const response = await api.post('/tickets/validate', {
    //   ticketId: ticket.id,
    //   eventId,
    //   gateId,
    //   scannedAt: new Date().toISOString()
    // });
    // return response.data;

    // For now, use mock data
    return await mockValidateTicket(ticket, eventId, gateId);
  } catch (error) {
    console.error('Validate ticket error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to validate ticket',
      ticket: null
    };
  }
};

/**
 * Validate a ticket locally (for offline mode)
 * @param {Object} ticket - Ticket object
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @param {Array} rules - Array of rule objects
 * @returns {Object} - Validation result
 */
export const validateTicketOffline = (ticket, eventId, gateId, rules) => {
  // Basic validation first
  if (!ticket || !ticket.id) {
    return {
      success: false,
      error: 'Invalid ticket format',
      ticket: null,
      isOffline: true
    };
  }

  // Ensure ticket is for the correct event
  if (ticket.eventId !== eventId) {
    return {
      success: false,
      error: 'Ticket is for a different event',
      ticket,
      isOffline: true
    };
  }

  // Apply rule validations (from rulesEngine.js)
  const ruleValidation = validateRules(ticket, gateId, rules);
  if (!ruleValidation.valid) {
    return {
      success: false,
      error: ruleValidation.reason,
      ticket,
      isOffline: true
    };
  }

  return {
    success: true,
    message: 'Ticket validated successfully (offline)',
    ticket,
    isOffline: true
  };
};

/**
 * Sync offline check-ins with the server
 * @param {Array} checkIns - Array of check-in objects
 * @returns {Promise<Array>} - Array of sync results
 */
export const syncCheckIns = async (checkIns) => {
  try {
    // When ready for real API, uncomment this:
    // const response = await api.post('/tickets/sync', { checkIns });
    // return response.data.results;

    // For now, use mock data
    return await mockSyncCheckIns(checkIns);
  } catch (error) {
    console.error('Sync check-ins error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to sync check-ins'
    );
  }
};

/**
 * Get ticket history for a specific event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} - Array of ticket check-ins
 */
export const getTicketHistory = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}/tickets/history`);
    return response.data;
  } catch (error) {
    console.error('Get ticket history error:', error);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to get ticket history'
    );
  }
};
