/**
 * Parse a QR code string into a ticket object
 * @param {string} qrData - The QR code data string
 * @returns {Object|null} - Parsed ticket object or null if invalid
 */
export const parseQRData = (qrData) => {
  try {
    // Try to parse as JSON
    return JSON.parse(qrData);
  } catch (error) {
    console.warn('Failed to parse QR data as JSON:', error);
    
    // Try to parse as URL query params
    try {
      if (qrData.includes('?')) {
        const params = new URLSearchParams(qrData.split('?')[1]);
        const ticketId = params.get('ticket') || params.get('id');
        const eventId = params.get('event') || params.get('eventId');
        
        if (ticketId && eventId) {
          return { 
            id: ticketId, 
            eventId: parseInt(eventId),
            // Other fields will be populated by the server validation
          };
        }
      }
    } catch (urlError) {
      console.warn('Failed to parse QR data as URL params:', urlError);
    }
  }
  
  // If all parsing attempts fail, return null
  return null;
};

/**
 * Validate basic QR format before sending to server
 * @param {string} qrData - The QR code data string
 * @returns {Object} - Validation result with validity and reason
 */
export const validateQRFormat = (qrData) => {
  // Check if data is empty
  if (!qrData || typeof qrData !== 'string') {
    return { 
      isValid: false, 
      reason: 'Empty or invalid QR code data' 
    };
  }
  
  // Try to parse the data
  const parsedTicket = parseQRData(qrData);
  
  if (!parsedTicket) {
    return { 
      isValid: false, 
      reason: 'QR code contains invalid data format' 
    };
  }
  
  // Check for minimum required fields
  if (!parsedTicket.id) {
    return { 
      isValid: false, 
      reason: 'QR code missing ticket ID' 
    };
  }
  
  if (!parsedTicket.eventId) {
    return { 
      isValid: false, 
      reason: 'QR code missing event ID' 
    };
  }
  
  return { 
    isValid: true, 
    ticket: parsedTicket 
  };
};

/**
 * Generate a standard format for QR code data
 * @param {Object} ticket - Ticket data object
 * @returns {string} - JSON string formatted for QR code
 */
export const generateQRData = (ticket) => {
  const qrData = {
    id: ticket.id,
    eventId: ticket.eventId,
    type: ticket.type,
  };
  
  return JSON.stringify(qrData);
};
