/**
 * Mock authentication function for demonstration purposes
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} - Mock authentication response
 */
export const mockLogin = async (username, password) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Define valid credentials
  const validCredentials = [
    { username: 'admin', password: 'password', role: 'admin' },
    { username: 'staff', password: 'password', role: 'staff' },
    { username: 'volunteer', password: 'password', role: 'volunteer' }
  ];
  
  // Find matching credentials
  const user = validCredentials.find(
    cred => cred.username === username && cred.password === password
  );
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Return successful response
  return {
    token: `mock-token-${user.role}-${Date.now()}`,
    role: user.role,
    user: {
      id: user.role === 'admin' ? 1 : user.role === 'staff' ? 2 : 3,
      username: user.username,
      name: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} User`,
      email: `${user.username}@example.com`
    }
  };
};

/**
 * Mock logout function
 * @returns {Promise<Object>} - Mock logout response
 */
export const mockLogout = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return successful response
  return { success: true };
};

/**
 * Mock function to fetch all events
 * @returns {Promise<Array>} - Array of mock events
 */
export const mockFetchEvents = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock events
  return [
    {
      id: 1,
      name: 'Summer Music Festival',
      date: '2025-06-15',
      location: 'Central Park',
      isActive: true,
      expectedAttendees: 5000,
      ticketsSold: 3750
    },
    {
      id: 2,
      name: 'Tech Conference 2025',
      date: '2025-09-22',
      location: 'Convention Center',
      isActive: true,
      expectedAttendees: 2000,
      ticketsSold: 1850
    },
    {
      id: 3,
      name: 'Holiday Craft Fair',
      date: '2025-12-10',
      location: 'Community Hall',
      isActive: false,
      expectedAttendees: 1000,
      ticketsSold: 300
    }
  ];
};

/**
 * Mock function to fetch gates for a specific event
 * @param {number} eventId - ID of the event
 * @returns {Promise<Array>} - Array of mock gates
 */
export const mockFetchGates = async (eventId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return mock gates based on event ID
  const gatesByEvent = {
    1: [
      { id: 101, name: 'Main Entrance', identifier: 'GATE-A', isEnabled: true },
      { id: 102, name: 'VIP Entrance', identifier: 'GATE-B', isEnabled: true },
      { id: 103, name: 'Staff Entrance', identifier: 'GATE-C', isEnabled: true },
      { id: 104, name: 'West Side Entrance', identifier: 'GATE-D', isEnabled: false }
    ],
    2: [
      { id: 201, name: 'Front Entrance', identifier: 'MAIN', isEnabled: true },
      { id: 202, name: 'Side Entrance', identifier: 'SIDE', isEnabled: true }
    ],
    3: [
      { id: 301, name: 'Main Hall Entrance', identifier: 'HALL', isEnabled: true }
    ]
  };
  
  return gatesByEvent[eventId] || [];
};

/**
 * Mock function to update gate status
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @param {boolean} isEnabled - New gate status
 * @returns {Promise<Object>} - Result object
 */
export const mockUpdateGateStatus = async (eventId, gateId, isEnabled) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success result
  return { 
    success: true,
    gate: {
      id: gateId,
      isEnabled
    }
  };
};

/**
 * Mock function to create a new gate
 * @param {number} eventId - Event ID
 * @param {string} name - Gate name
 * @param {string} identifier - Gate identifier
 * @returns {Promise<Object>} - New gate object
 */
export const mockCreateGate = async (eventId, name, identifier) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new ID
  const newId = Math.floor(Math.random() * 1000) + 500;
  
  // Return new gate
  return {
    success: true,
    gate: {
      id: newId,
      name,
      identifier,
      isEnabled: true,
      eventId
    }
  };
};

/**
 * Mock function to delete a gate
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @returns {Promise<Object>} - Result object
 */
export const mockDeleteGate = async (eventId, gateId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return success result
  return { 
    success: true,
    message: `Gate ${gateId} deleted successfully`
  };
};

/**
 * Mock function to fetch event rules
 * @param {number} eventId - Event ID
 * @returns {Promise<Array>} - Array of mock rules
 */
export const mockFetchEventRules = async (eventId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return mock rules based on event ID
  const rulesByEvent = {
    1: [
      { 
        id: 1001, 
        name: 'VIP Access Only', 
        type: 'TICKET_TYPE_RESTRICTION', 
        value: 'VIP', 
        isActive: true,
        gateIds: [102] // Only applies to VIP entrance
      },
      { 
        id: 1002, 
        name: 'One-time Entry', 
        type: 'ONE_TIME_USE', 
        value: 'true', 
        isActive: true,
        gateIds: [101, 102, 103, 104] // Applies to all gates
      },
      { 
        id: 1003, 
        name: 'Event Hours Only', 
        type: 'TIME_RESTRICTION', 
        value: '08:00-23:00', 
        isActive: true,
        gateIds: [101, 102, 103, 104] // Applies to all gates
      }
    ],
    2: [
      { 
        id: 2001, 
        name: 'One-time Entry', 
        type: 'ONE_TIME_USE', 
        value: 'true', 
        isActive: true,
        gateIds: [201, 202] // Applies to all gates
      }
    ],
    3: [
      { 
        id: 3001, 
        name: 'Event Hours Only', 
        type: 'TIME_RESTRICTION', 
        value: '09:00-17:00', 
        isActive: true,
        gateIds: [301] // Applies to all gates
      }
    ]
  };
  
  return rulesByEvent[eventId] || [];
};

/**
 * Mock function to create a new rule
 * @param {number} eventId - Event ID
 * @param {string} name - Rule name
 * @param {string} type - Rule type
 * @param {string} value - Rule value
 * @param {boolean} isActive - Whether rule is active
 * @returns {Promise<Object>} - New rule object
 */
export const mockCreateRule = async (eventId, name, type, value, isActive) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new ID
  const newId = Math.floor(Math.random() * 1000) + 3000;
  
  // Return new rule
  return {
    success: true,
    rule: {
      id: newId,
      name,
      type,
      value,
      isActive,
      eventId,
      gateIds: [] // Default to no gates
    }
  };
};

/**
 * Mock function to update a rule
 * @param {number} eventId - Event ID
 * @param {Object} rule - Updated rule object
 * @returns {Promise<Object>} - Result object
 */
export const mockUpdateRule = async (eventId, rule) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return success result
  return { 
    success: true,
    rule
  };
};

/**
 * Mock function to delete a rule
 * @param {number} eventId - Event ID
 * @param {number} ruleId - Rule ID
 * @returns {Promise<Object>} - Result object
 */
export const mockDeleteRule = async (eventId, ruleId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Return success result
  return { 
    success: true,
    message: `Rule ${ruleId} deleted successfully`
  };
};

/**
 * Mock function to update event status
 * @param {number} eventId - Event ID
 * @param {boolean} isActive - New event status
 * @returns {Promise<Object>} - Result object
 */
export const mockUpdateEventStatus = async (eventId, isActive) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return success result
  return { 
    success: true,
    event: {
      id: eventId,
      isActive
    }
  };
};

/**
 * Mock function to create a new event
 * @param {string} name - Event name
 * @param {string} date - Event date
 * @returns {Promise<Object>} - New event object
 */
export const mockCreateEvent = async (name, date) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate a new ID
  const newId = Math.floor(Math.random() * 100) + 10;
  
  // Return new event
  return {
    success: true,
    event: {
      id: newId,
      name,
      date,
      location: '',
      isActive: true,
      expectedAttendees: 0,
      ticketsSold: 0
    }
  };
};

/**
 * Mock function to delete an event
 * @param {number} eventId - Event ID
 * @returns {Promise<Object>} - Result object
 */
export const mockDeleteEvent = async (eventId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return success result
  return { 
    success: true,
    message: `Event ${eventId} deleted successfully`
  };
};

/**
 * Mock function to validate a ticket
 * @param {string} ticket - Ticket data (QR code content)
 * @param {number} eventId - Event ID
 * @param {number} gateId - Gate ID
 * @returns {Promise<Object>} - Validation result
 */
export const mockValidateTicket = async (ticket, eventId, gateId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Parse the ticket data
  let ticketData;
  try {
    if (typeof ticket === 'string') {
      ticketData = JSON.parse(ticket);
    } else {
      ticketData = ticket;
    }
  } catch (e) {
    return {
      valid: false,
      reason: 'Invalid ticket format',
      ticket: null
    };
  }
  
  // Validate ticket fields
  if (!ticketData.id || !ticketData.type || !ticketData.eventId) {
    return {
      valid: false,
      reason: 'Missing required ticket information',
      ticket: ticketData
    };
  }
  
  // Check if ticket is for this event
  if (parseInt(ticketData.eventId) !== parseInt(eventId)) {
    return {
      valid: false,
      reason: 'Ticket is for a different event',
      ticket: ticketData
    };
  }
  
  // Check if ticket has been used before (50% chance for demo)
  const hasBeenUsedBefore = Math.random() > 0.5;
  if (hasBeenUsedBefore && ticketData.id % 2 === 0) {
    return {
      valid: false,
      reason: 'Ticket has already been used',
      ticket: ticketData,
      checkInHistory: [
        {
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          gate: { id: gateId, name: `Gate ${gateId}` }
        }
      ]
    };
  }
  
  // Randomly determine if VIP ticket for demo purposes
  const isVip = ticketData.type === 'VIP' || ticketData.id % 5 === 0;
  
  // VIP tickets can only enter VIP gate
  if (isVip && eventId === 1 && gateId !== 102) {
    return {
      valid: false,
      reason: 'VIP tickets must use the VIP entrance (Gate B)',
      ticket: {
        ...ticketData,
        type: 'VIP'
      }
    };
  }
  
  // Check if within event hours (always pass for demo)
  const withinHours = true;
  
  // Return validation result
  return {
    valid: withinHours,
    ticket: {
      ...ticketData,
      type: isVip ? 'VIP' : ticketData.type || 'STANDARD',
      holderName: ticketData.holderName || `Guest ${ticketData.id}`,
      seat: ticketData.seat || (isVip ? `VIP-${Math.floor(Math.random() * 100)}` : `A-${Math.floor(Math.random() * 1000)}`)
    },
    checkInHistory: [],
    checkInResult: {
      success: withinHours,
      timestamp: new Date().toISOString(),
      gate: { id: gateId, name: `Gate ${gateId}` }
    }
  };
};

/**
 * Mock function to sync check-ins
 * @param {Array} checkIns - Array of check-in objects
 * @returns {Promise<Array>} - Array of sync results
 */
export const mockSyncCheckIns = async (checkIns) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Process each check-in and return results
  return checkIns.map(checkIn => ({
    success: true,
    ticketId: checkIn.ticketId,
    serverTimestamp: new Date().toISOString()
  }));
};