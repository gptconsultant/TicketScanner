import { parseQRData, validateQRFormat } from './qrUtils';
import { validateRules } from '../services/rulesEngine';
import { getCachedTicketById } from '../services/offlineStorage';

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
    // First, validate the QR format
    const formatValidation = validateQRFormat(qrData);
    if (!formatValidation.valid) {
      return formatValidation;
    }
    
    // Parse the QR data
    const ticketData = parseQRData(qrData);
    if (!ticketData) {
      return {
        valid: false,
        reason: 'Invalid ticket format',
        offline: true
      };
    }
    
    // Perform basic validation
    const basicValidation = basicTicketValidation(ticketData);
    if (!basicValidation.valid) {
      return {
        ...basicValidation,
        offline: true
      };
    }
    
    // Check if the ticket is for this event
    if (ticketData.eventId !== eventId) {
      return {
        valid: false,
        reason: 'Ticket is for a different event',
        ticket: ticketData,
        offline: true
      };
    }
    
    // Try to get cached ticket data
    const cachedTicket = await getCachedTicketById(ticketData.id);
    
    // If we have cached data, use it, otherwise use the parsed data
    const ticketToValidate = cachedTicket || ticketData;
    
    // Apply rules
    const rulesValidation = validateRules(ticketToValidate, gateId, rules);
    
    // Return validation result
    return {
      ...rulesValidation,
      ticket: ticketToValidate,
      offline: true
    };
  } catch (error) {
    console.error('Error validating ticket offline:', error);
    return {
      valid: false,
      reason: 'Error validating ticket',
      offline: true
    };
  }
};

/**
 * Basic validation checks for a ticket
 * @param {Object} ticket - Ticket object
 * @returns {Object} - Validation result
 */
export const basicTicketValidation = (ticket) => {
  // Check if ticket has minimum required fields
  if (!ticket.id) {
    return {
      valid: false,
      reason: 'Missing ticket ID',
      ticket
    };
  }
  
  if (!ticket.eventId) {
    return {
      valid: false,
      reason: 'Missing event ID',
      ticket
    };
  }
  
  return { valid: true, ticket };
};

/**
 * Format validation error for display
 * @param {Error} error - Error object
 * @returns {string} - Formatted error message
 */
export const formatValidationError = (error) => {
  if (!error) return 'Unknown error';
  
  if (typeof error === 'object' && error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An error occurred during validation';
};