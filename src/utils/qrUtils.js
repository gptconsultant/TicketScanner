/**
 * Parse a QR code string into a ticket object
 * @param {string} qrData - The QR code data string
 * @returns {Object|null} - Parsed ticket object or null if invalid
 */
export const parseQRData = (qrData) => {
  try {
    // Try to parse as JSON
    if (typeof qrData === 'string') {
      return JSON.parse(qrData);
    }
    // If already an object, return as is
    if (typeof qrData === 'object' && qrData !== null) {
      return qrData;
    }
    return null;
  } catch (error) {
    console.error('Error parsing QR data:', error);
    return null;
  }
};

/**
 * Validate basic QR format before sending to server
 * @param {string} qrData - The QR code data string
 * @returns {Object} - Validation result with validity and reason
 */
export const validateQRFormat = (qrData) => {
  if (!qrData) {
    return {
      valid: false,
      reason: 'No ticket data found'
    };
  }

  try {
    const parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    
    // Check for minimum required fields
    if (!parsedData.id) {
      return {
        valid: false,
        reason: 'Missing ticket ID',
        ticket: parsedData
      };
    }
    
    if (!parsedData.eventId) {
      return {
        valid: false,
        reason: 'Missing event ID',
        ticket: parsedData
      };
    }
    
    // Valid format
    return {
      valid: true,
      ticket: parsedData
    };
  } catch (error) {
    return {
      valid: false,
      reason: 'Invalid ticket format (not valid JSON)'
    };
  }
};

/**
 * Generate a standard format for QR code data
 * @param {Object} ticket - Ticket data object
 * @returns {string} - JSON string formatted for QR code
 */
export const generateQRData = (ticket) => {
  try {
    // Ensure minimum required fields
    const standardizedTicket = {
      id: ticket.id,
      eventId: ticket.eventId,
      type: ticket.type || 'STANDARD',
      holderName: ticket.holderName || '',
      seat: ticket.seat || '',
      ...ticket
    };
    
    return JSON.stringify(standardizedTicket);
  } catch (error) {
    console.error('Error generating QR data:', error);
    return '';
  }
};