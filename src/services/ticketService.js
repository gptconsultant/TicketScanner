import * as ruleEngine from './ruleEngine';
import * as mockData from './mockData';

/**
 * Validates a ticket against the server
 * @param {string} ticketId - The ticket ID
 * @param {string} eventId - The event ID
 * @param {string} gateId - The gate ID
 * @returns {Promise<object>} - Validation result
 */
export const validateTicket = async (ticketId, eventId, gateId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Get mock ticket data - in a real app this would be a server request
    const mockTickets = mockData.getTickets();
    const mockEvent = mockData.getEventById(eventId);
    const mockGate = mockData.getGateById(gateId);
    
    const ticket = mockTickets.find(t => t.id === ticketId);
    
    if (!ticket) {
      return {
        isValid: false,
        message: 'Ticket not found',
        errorType: 'error',
        details: 'This ticket ID does not exist in our system'
      };
    }
    
    if (ticket.eventId !== eventId) {
      return {
        isValid: false,
        message: 'Ticket is for a different event',
        errorType: 'error',
        details: 'This ticket is not valid for the selected event'
      };
    }
    
    // Apply validation rules
    const ruleResults = ruleEngine.applyRules(ticket, mockEvent, mockGate);
    
    // Check if any rule failed that should invalidate the ticket
    const criticalFailure = ruleResults.find(r => !r.passed && r.isCritical);
    
    if (criticalFailure) {
      return {
        isValid: false,
        message: criticalFailure.failReason || 'Ticket validation failed',
        errorType: 'error',
        details: criticalFailure.description,
        appliedRules: ruleResults
      };
    }
    
    // Check if any non-critical warnings exist
    const warnings = ruleResults.filter(r => !r.passed && !r.isCritical);
    
    if (warnings.length > 0) {
      return {
        isValid: true,
        message: 'Ticket valid with warnings',
        errorType: 'warning',
        details: warnings[0].failReason,
        appliedRules: ruleResults
      };
    }
    
    // If we get here, the ticket is fully valid
    return {
      isValid: true,
      message: 'Ticket is valid',
      ticketInfo: ticket,
      appliedRules: ruleResults
    };
    
  } catch (error) {
    console.error('Ticket validation error:', error);
    return {
      isValid: false,
      message: 'Error validating ticket',
      errorType: 'error',
      details: error.message
    };
  }
};

/**
 * Validates a ticket offline (local validation without server)
 * @param {object} ticketInfo - The parsed ticket data from QR
 * @param {string} eventId - The event ID
 * @param {string} gateId - The gate ID 
 * @returns {Promise<object>} - Validation result
 */
export const validateTicketOffline = async (ticketInfo, eventId, gateId) => {
  // Add a slight delay to simulate processing
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // For offline mode, we can only do basic validation
    // For a real app, you would use cached event/ticket data
    
    const mockEvent = mockData.getEventById(eventId);
    const mockGate = mockData.getGateById(gateId);
    
    // Basic checks
    if (!ticketInfo.id) {
      return {
        isValid: false,
        message: 'Invalid ticket format',
        errorType: 'error',
        details: 'The scanned QR code does not contain valid ticket data'
      };
    }
    
    if (ticketInfo.eventId !== eventId) {
      return {
        isValid: false,
        message: 'Ticket is for a different event',
        errorType: 'error',
        details: 'This ticket is not valid for the selected event'
      };
    }
    
    // Apply offline validation rules - a subset of the full rules
    const offlineRules = ruleEngine.getOfflineRules();
    const ruleResults = offlineRules.map(rule => rule.validate(ticketInfo, mockEvent, mockGate));
    
    // Check if any critical rule failed
    const criticalFailure = ruleResults.find(r => !r.passed && r.isCritical);
    
    if (criticalFailure) {
      return {
        isValid: false,
        message: criticalFailure.failReason || 'Ticket validation failed',
        errorType: 'error',
        details: criticalFailure.description,
        appliedRules: ruleResults
      };
    }
    
    // Return valid with offline warning
    return {
      isValid: true,
      message: 'Ticket appears valid (offline)',
      errorType: 'warning',
      details: 'Limited validation in offline mode. Ticket will be fully validated when connection is restored.',
      appliedRules: ruleResults
    };
    
  } catch (error) {
    console.error('Offline ticket validation error:', error);
    return {
      isValid: false,
      message: 'Error validating ticket',
      errorType: 'error',
      details: error.message
    };
  }
};

/**
 * Mark a ticket as used/scanned
 * @param {string} ticketId - The ticket ID
 * @param {string} eventId - The event ID
 * @param {string} gateId - The gate ID where ticket was scanned
 * @returns {Promise<object>} - Result of the operation
 */
export const markTicketAsUsed = async (ticketId, eventId, gateId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would update the ticket status on the server
  return {
    success: true,
    timestamp: new Date().toISOString()
  };
};
