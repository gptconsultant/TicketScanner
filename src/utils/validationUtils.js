import { validateRules } from '../services/rulesEngine';
import { getCachedTicketById } from '../services/offlineStorage';
import { parseQRData } from './qrUtils';

/**
 * Validate a ticket offline using cached data and rules
 * @param {string} qrData - QR code data
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @param {Array} rules - Rules to apply
 * @returns {Promise<Object>} - Validation result
 */
export const validateTicketOffline = async (qrData, eventId, gateId, rules) => {
  try {
    // Parse QR data
    let ticket = parseQRData(qrData);
    
    if (!ticket) {
      return {
        success: false,
        error: 'Invalid QR code format',
        ticket: null,
        isOffline: true
      };
    }
    
    // Check if ticket is for this event
    if (ticket.eventId !== eventId) {
      return {
        success: false,
        error: 'Ticket is for a different event',
        ticket,
        isOffline: true
      };
    }
    
    // Try to get more detailed ticket info from cache
    const cachedTicket = await getCachedTicketById(ticket.id);
    if (cachedTicket) {
      ticket = cachedTicket;
    }
    
    // Apply validation rules
    const rulesResult = validateRules(ticket, gateId, rules);
    
    if (!rulesResult.valid) {
      return {
        success: false,
        error: rulesResult.reason,
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
  } catch (error) {
    console.error('Offline validation error:', error);
    return {
      success: false,
      error: error.message || 'Error validating ticket offline',
      ticket: null,
      isOffline: true
    };
  }
};

/**
 * Basic validation checks for a ticket
 * @param {Object} ticket - Ticket object
 * @returns {Object} - Validation result
 */
export const basicTicketValidation = (ticket) => {
  if (!ticket) {
    return {
      valid: false,
      reason: 'No ticket data'
    };
  }
  
  if (!ticket.id) {
    return {
      valid: false,
      reason: 'Invalid ticket: missing ID'
    };
  }
  
  if (!ticket.eventId) {
    return {
      valid: false,
      reason: 'Invalid ticket: missing event ID'
    };
  }
  
  return { valid: true };
};

/**
 * Format validation error for display
 * @param {Error} error - Error object
 * @returns {string} - Formatted error message
 */
export const formatValidationError = (error) => {
  if (!error) {
    return 'Unknown error occurred';
  }
  
  // If the error is an object with a message property
  if (error.message) {
    return error.message;
  }
  
  // If the error is a string
  if (typeof error === 'string') {
    return error;
  }
  
  // Otherwise, convert to string
  return String(error);
};
