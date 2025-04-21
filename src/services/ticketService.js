import { fetchFromAPI } from './api';
import * as mockData from './mockData';
import { validateRules } from './rulesEngine';
import { parseQRData, validateQRFormat } from '../utils/qrUtils';
import { getCachedTicketById, markCachedTicketAsUsed } from './offlineStorage';

/**
 * Validate a ticket against the server
 * @param {string} ticketData - QR code data
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @returns {Promise<Object>} - Validation result
 */
export const validateTicket = async (ticketData, eventId, gateId) => {
  try {
    // Validate QR format first
    const formatValidation = validateQRFormat(ticketData);
    if (!formatValidation.valid) {
      return formatValidation;
    }
    
    // In a real app, this would call your backend API
    // return await fetchFromAPI('/tickets/validate', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     ticketData,
    //     eventId,
    //     gateId,
    //   }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockValidateTicket(ticketData, eventId, gateId);
  } catch (error) {
    console.error('Error validating ticket:', error);
    return { 
      valid: false, 
      reason: error.message || 'Error validating ticket' 
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
  try {
    // Parse ticket data if it's a string
    let ticketObj;
    if (typeof ticket === 'string') {
      // Validate QR format first
      const formatValidation = validateQRFormat(ticket);
      if (!formatValidation.valid) {
        return formatValidation;
      }
      
      ticketObj = parseQRData(ticket);
    } else {
      ticketObj = ticket;
    }
    
    // Check if ticket exists in offline cache
    if (!ticketObj || !ticketObj.id) {
      return { 
        valid: false, 
        reason: 'Invalid ticket format',
        ticket: ticketObj
      };
    }
    
    // Check if ticket is for this event
    if (ticketObj.eventId && ticketObj.eventId !== eventId) {
      return { 
        valid: false, 
        reason: 'Ticket is for a different event',
        ticket: ticketObj
      };
    }
    
    // Apply validation rules
    const rulesValidation = validateRules(ticketObj, gateId, rules);
    
    // If validation passed, mark ticket as used in offline storage
    if (rulesValidation.valid) {
      markCachedTicketAsUsed(ticketObj.id);
    }
    
    return {
      ...rulesValidation,
      ticket: ticketObj,
      offline: true
    };
  } catch (error) {
    console.error('Error validating ticket offline:', error);
    return { 
      valid: false, 
      reason: error.message || 'Error validating ticket offline',
      offline: true
    };
  }
};

/**
 * Sync offline check-ins with the server
 * @param {Array} checkIns - Array of check-in objects
 * @returns {Promise<Array>} - Array of sync results
 */
export const syncCheckIns = async (checkIns) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI('/tickets/sync', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ checkIns }),
    // });
    
    // For demo purposes, use mock implementation
    return await mockData.mockSyncCheckIns(checkIns);
  } catch (error) {
    console.error('Error syncing check-ins:', error);
    throw error;
  }
};

/**
 * Get ticket history for a specific event
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} - Array of ticket check-ins
 */
export const getTicketHistory = async (eventId) => {
  try {
    // In a real app, this would call your backend API
    // return await fetchFromAPI(`/events/${eventId}/tickets/history`);
    
    // For demo purposes, return an empty array
    return [];
  } catch (error) {
    console.error(`Error getting ticket history for event ${eventId}:`, error);
    throw error;
  }
};