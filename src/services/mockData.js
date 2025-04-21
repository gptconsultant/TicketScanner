// Mock data for offline development

// Delay function to simulate network lag
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users for authentication
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 2,
    username: 'staff',
    password: 'staff123',
    name: 'Staff Member',
    role: 'staff',
  },
  {
    id: 3,
    username: 'volunteer',
    password: 'volunteer123',
    name: 'Volunteer Helper',
    role: 'volunteer',
  },
];

// Mock events
let mockEvents = [
  {
    id: 1,
    name: 'Summer Music Festival',
    date: '2023-07-15T10:00:00Z',
    isActive: true,
  },
  {
    id: 2,
    name: 'Tech Conference 2023',
    date: '2023-08-25T09:00:00Z',
    isActive: true,
  },
  {
    id: 3,
    name: 'Comic Convention',
    date: '2023-09-10T11:00:00Z',
    isActive: false,
  },
];

// Mock gates for events
let mockGates = {
  1: [
    {
      id: 1,
      eventId: 1,
      name: 'Main Entrance',
      identifier: 'Gate A',
      isEnabled: true,
    },
    {
      id: 2,
      eventId: 1,
      name: 'VIP Entrance',
      identifier: 'Gate B',
      isEnabled: true,
    },
    {
      id: 3,
      eventId: 1,
      name: 'Staff Entrance',
      identifier: 'Gate C',
      isEnabled: false,
    },
  ],
  2: [
    {
      id: 4,
      eventId: 2,
      name: 'North Entrance',
      identifier: 'Gate 1',
      isEnabled: true,
    },
    {
      id: 5,
      eventId: 2,
      name: 'South Entrance',
      identifier: 'Gate 2',
      isEnabled: true,
    },
  ],
  3: [
    {
      id: 6,
      eventId: 3,
      name: 'East Entrance',
      identifier: 'Gate X',
      isEnabled: false,
    },
    {
      id: 7,
      eventId: 3,
      name: 'West Entrance',
      identifier: 'Gate Y',
      isEnabled: false,
    },
  ],
};

// Mock tickets
const mockTickets = [
  {
    id: 'T1001',
    eventId: 1,
    type: 'General Admission',
    purchaseDate: '2023-06-01T14:32:00Z',
    price: 49.99,
    attendeeName: 'John Smith',
    attendeeEmail: 'john@example.com',
    isUsed: false,
  },
  {
    id: 'T1002',
    eventId: 1,
    type: 'VIP',
    purchaseDate: '2023-06-02T09:15:00Z',
    price: 149.99,
    attendeeName: 'Emma Johnson',
    attendeeEmail: 'emma@example.com',
    isUsed: false,
  },
  {
    id: 'T1003',
    eventId: 1,
    type: 'General Admission',
    purchaseDate: '2023-06-05T11:45:00Z',
    price: 49.99,
    attendeeName: 'Michael Brown',
    attendeeEmail: 'michael@example.com',
    isUsed: true,
  },
  {
    id: 'T2001',
    eventId: 2,
    type: 'Standard',
    purchaseDate: '2023-07-20T16:22:00Z',
    price: 79.99,
    attendeeName: 'Alice Williams',
    attendeeEmail: 'alice@example.com',
    isUsed: false,
  },
];

// Mock rules for events
let mockRules = {
  1: [
    {
      id: 1,
      eventId: 1,
      name: 'Entry Cutoff Time',
      type: 'TIME_RESTRICTION',
      value: '22:00',
      isActive: true,
    },
    {
      id: 2,
      eventId: 1,
      name: 'VIP Gate Only',
      type: 'GATE_RESTRICTION',
      value: 'Gate B',
      isActive: true,
    },
    {
      id: 3,
      eventId: 1,
      name: 'One-time Entry',
      type: 'ONE_TIME_USE',
      value: '',
      isActive: true,
    },
  ],
  2: [
    {
      id: 4,
      eventId: 2,
      name: 'Entry Cutoff Time',
      type: 'TIME_RESTRICTION',
      value: '17:30',
      isActive: true,
    },
  ],
};

// Mock login function
export const mockLogin = async (username, password) => {
  await delay(1000); // Simulate network delay
  
  const user = mockUsers.find(
    u => u.username === username && u.password === password
  );
  
  if (user) {
    return {
      success: true,
      token: `mock-token-${user.id}-${Date.now()}`,
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        onShift: false,
      },
    };
  } else {
    throw new Error('Invalid username or password');
  }
};

// Mock logout function
export const mockLogout = async () => {
  await delay(800); // Simulate network delay
  return { success: true };
};

// Mock fetch events function
export const mockFetchEvents = async () => {
  await delay(1000); // Simulate network delay
  return {
    success: true,
    data: mockEvents,
  };
};

// Mock fetch gates function
export const mockFetchGates = async (eventId) => {
  await delay(800); // Simulate network delay
  
  const gates = mockGates[eventId] || [];
  return {
    success: true,
    data: gates,
  };
};

// Mock update gate status function
export const mockUpdateGateStatus = async (eventId, gateId, isEnabled) => {
  await delay(800); // Simulate network delay
  
  const eventGates = mockGates[eventId] || [];
  const gateIndex = eventGates.findIndex(g => g.id === gateId);
  
  if (gateIndex === -1) {
    return {
      success: false,
      error: 'Gate not found',
    };
  }
  
  // Update gate status
  eventGates[gateIndex].isEnabled = isEnabled;
  
  return {
    success: true,
    data: eventGates[gateIndex],
  };
};

// Mock create gate function
export const mockCreateGate = async (eventId, name, identifier) => {
  await delay(1000); // Simulate network delay
  
  // Generate new gate ID
  let maxGateId = 0;
  Object.values(mockGates).forEach(gates => {
    gates.forEach(gate => {
      if (gate.id > maxGateId) maxGateId = gate.id;
    });
  });
  
  const newGate = {
    id: maxGateId + 1,
    eventId: parseInt(eventId),
    name,
    identifier,
    isEnabled: true,
  };
  
  // Add to mock gates
  if (!mockGates[eventId]) {
    mockGates[eventId] = [];
  }
  mockGates[eventId].push(newGate);
  
  return {
    success: true,
    data: newGate,
  };
};

// Mock delete gate function
export const mockDeleteGate = async (eventId, gateId) => {
  await delay(800); // Simulate network delay
  
  const eventGates = mockGates[eventId] || [];
  const gateIndex = eventGates.findIndex(g => g.id === gateId);
  
  if (gateIndex === -1) {
    return {
      success: false,
      error: 'Gate not found',
    };
  }
  
  // Remove gate
  mockGates[eventId] = eventGates.filter(g => g.id !== gateId);
  
  return {
    success: true,
  };
};

// Mock fetch event rules function
export const mockFetchEventRules = async (eventId) => {
  await delay(800); // Simulate network delay
  
  const rules = mockRules[eventId] || [];
  return {
    success: true,
    data: rules,
  };
};

// Mock create rule function
export const mockCreateRule = async (eventId, name, type, value, isActive) => {
  await delay(1000); // Simulate network delay
  
  // Generate new rule ID
  let maxRuleId = 0;
  Object.values(mockRules).forEach(rules => {
    rules.forEach(rule => {
      if (rule.id > maxRuleId) maxRuleId = rule.id;
    });
  });
  
  const newRule = {
    id: maxRuleId + 1,
    eventId: parseInt(eventId),
    name,
    type,
    value,
    isActive,
  };
  
  // Add to mock rules
  if (!mockRules[eventId]) {
    mockRules[eventId] = [];
  }
  mockRules[eventId].push(newRule);
  
  return {
    success: true,
    data: newRule,
  };
};

// Mock update rule function
export const mockUpdateRule = async (eventId, rule) => {
  await delay(800); // Simulate network delay
  
  const eventRules = mockRules[eventId] || [];
  const ruleIndex = eventRules.findIndex(r => r.id === rule.id);
  
  if (ruleIndex === -1) {
    return {
      success: false,
      error: 'Rule not found',
    };
  }
  
  // Update rule
  mockRules[eventId][ruleIndex] = rule;
  
  return {
    success: true,
    data: rule,
  };
};

// Mock delete rule function
export const mockDeleteRule = async (eventId, ruleId) => {
  await delay(800); // Simulate network delay
  
  const eventRules = mockRules[eventId] || [];
  const ruleIndex = eventRules.findIndex(r => r.id === ruleId);
  
  if (ruleIndex === -1) {
    return {
      success: false,
      error: 'Rule not found',
    };
  }
  
  // Remove rule
  mockRules[eventId] = eventRules.filter(r => r.id !== ruleId);
  
  return {
    success: true,
  };
};

// Mock update event status function
export const mockUpdateEventStatus = async (eventId, isActive) => {
  await delay(800); // Simulate network delay
  
  const eventIndex = mockEvents.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return {
      success: false,
      error: 'Event not found',
    };
  }
  
  // Update event status
  mockEvents[eventIndex].isActive = isActive;
  
  return {
    success: true,
    data: mockEvents[eventIndex],
  };
};

// Mock create event function
export const mockCreateEvent = async (name, date) => {
  await delay(1000); // Simulate network delay
  
  // Generate new event ID
  const maxEventId = Math.max(...mockEvents.map(e => e.id), 0);
  
  const newEvent = {
    id: maxEventId + 1,
    name,
    date,
    isActive: true,
  };
  
  // Add to mock events
  mockEvents.push(newEvent);
  
  return {
    success: true,
    data: newEvent,
  };
};

// Mock delete event function
export const mockDeleteEvent = async (eventId) => {
  await delay(1000); // Simulate network delay
  
  const eventIndex = mockEvents.findIndex(e => e.id === eventId);
  
  if (eventIndex === -1) {
    return {
      success: false,
      error: 'Event not found',
    };
  }
  
  // Remove event
  mockEvents = mockEvents.filter(e => e.id !== eventId);
  
  // Also clean up associated gates and rules
  delete mockGates[eventId];
  delete mockRules[eventId];
  
  return {
    success: true,
  };
};

// Mock validate ticket function
export const mockValidateTicket = async (ticket, eventId, gateId) => {
  await delay(1500); // Simulate network delay
  
  // Find the actual ticket in our mock data
  const actualTicket = mockTickets.find(t => t.id === ticket.id);
  
  if (!actualTicket) {
    return {
      success: false,
      error: 'Ticket not found',
      ticket: null,
    };
  }
  
  // Check if ticket is for this event
  if (actualTicket.eventId !== eventId) {
    return {
      success: false,
      error: 'Ticket is for a different event',
      ticket: actualTicket,
    };
  }
  
  // Check if ticket is already used
  if (actualTicket.isUsed) {
    return {
      success: false,
      error: 'Ticket has already been used',
      ticket: actualTicket,
    };
  }
  
  // Get gates for this event
  const gates = mockGates[eventId] || [];
  const gate = gates.find(g => g.id === gateId);
  
  if (!gate) {
    return {
      success: false,
      error: 'Invalid gate',
      ticket: actualTicket,
    };
  }
  
  if (!gate.isEnabled) {
    return {
      success: false,
      error: 'Gate is disabled',
      ticket: actualTicket,
    };
  }
  
  // Get rules for this event
  const rules = mockRules[eventId] || [];
  
  // Check VIP restrictions
  const vipRule = rules.find(
    r => r.isActive && 
    r.type === 'TICKET_TYPE_RESTRICTION'
  );
  
  if (vipRule) {
    const allowedTypes = vipRule.value.split(',').map(t => t.trim());
    if (!allowedTypes.includes(actualTicket.type)) {
      return {
        success: false,
        error: `Ticket type "${actualTicket.type}" not allowed at this gate`,
        ticket: actualTicket,
      };
    }
  }
  
  // Check gate restrictions
  const gateRule = rules.find(
    r => r.isActive && 
    r.type === 'GATE_RESTRICTION'
  );
  
  if (gateRule) {
    const allowedGates = gateRule.value.split(',').map(g => g.trim());
    if (!allowedGates.includes(gate.identifier)) {
      return {
        success: false,
        error: `This ticket can only be used at: ${gateRule.value}`,
        ticket: actualTicket,
      };
    }
  }
  
  // Check time restrictions
  const timeRule = rules.find(
    r => r.isActive && 
    r.type === 'TIME_RESTRICTION'
  );
  
  if (timeRule) {
    const [hours, minutes] = timeRule.value.split(':').map(Number);
    const cutoffTime = new Date();
    cutoffTime.setHours(hours, minutes, 0, 0);
    
    const currentTime = new Date();
    
    if (currentTime > cutoffTime) {
      return {
        success: false,
        error: `Entry not allowed after ${timeRule.value}`,
        ticket: actualTicket,
      };
    }
  }
  
  // Mark ticket as used
  actualTicket.isUsed = true;
  
  return {
    success: true,
    message: 'Ticket validated successfully',
    ticket: actualTicket,
  };
};

// Mock sync check-ins function
export const mockSyncCheckIns = async (checkIns) => {
  await delay(2000); // Simulate longer network delay for sync
  
  // Process each check-in
  const results = checkIns.map(checkIn => {
    try {
      const ticketData = JSON.parse(checkIn.scannedData);
      const ticket = mockTickets.find(t => t.id === ticketData.id);
      
      if (!ticket) {
        return { success: false, error: 'Ticket not found' };
      }
      
      // For demonstration purposes, let's assume 90% of syncs succeed
      const randomSuccess = Math.random() > 0.1;
      
      if (randomSuccess) {
        // Mark ticket as used
        ticket.isUsed = true;
        return { success: true };
      } else {
        return { success: false, error: 'Server error' };
      }
    } catch (e) {
      return { success: false, error: 'Invalid ticket data' };
    }
  });
  
  return results;
};
