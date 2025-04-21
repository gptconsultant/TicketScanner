/**
 * Mock data for the EventScan application
 * In a real application, this would be replaced with API calls to a backend
 */

// Mock events
const mockEvents = [
  {
    id: '1',
    name: 'Summer Music Festival',
    date: '2023-07-15T12:00:00.000Z',
    location: 'Central Park',
    isActive: true,
    description: 'Annual summer music festival featuring local and international artists'
  },
  {
    id: '2',
    name: 'Tech Conference 2023',
    date: '2023-08-10T09:00:00.000Z',
    location: 'Convention Center',
    isActive: true,
    description: 'The premier tech event of the year with keynote speakers and workshops'
  },
  {
    id: '3',
    name: 'Food & Wine Expo',
    date: '2023-09-05T10:00:00.000Z',
    location: 'Waterfront Plaza',
    isActive: true,
    description: 'A culinary journey with tastings from top chefs and wineries'
  },
  {
    id: '4',
    name: 'Charity Gala Dinner',
    date: '2023-10-25T18:00:00.000Z',
    location: 'Grand Ballroom',
    isActive: false,
    description: 'Annual fundraising gala supporting local community initiatives'
  }
];

// Mock gates for events
const mockGates = [
  // Gates for event 1 (Summer Music Festival)
  {
    id: '101',
    eventId: '1',
    name: 'Main Entrance',
    description: 'Primary entrance for all ticket holders',
    isEnabled: true
  },
  {
    id: '102',
    eventId: '1',
    name: 'VIP Gate',
    description: 'Exclusive entrance for VIP ticket holders',
    isEnabled: true
  },
  {
    id: '103',
    eventId: '1',
    name: 'East Gate',
    description: 'Secondary entrance on the east side of the venue',
    isEnabled: false
  },
  
  // Gates for event 2 (Tech Conference)
  {
    id: '201',
    eventId: '2',
    name: 'Registration Desk',
    description: 'Check-in for all attendees',
    isEnabled: true
  },
  {
    id: '202',
    eventId: '2',
    name: 'Speakers Entrance',
    description: 'Private entrance for speakers and staff',
    isEnabled: true
  },
  
  // Gates for event 3 (Food & Wine Expo)
  {
    id: '301',
    eventId: '3',
    name: 'Main Hall',
    description: 'Main entrance to the exhibition hall',
    isEnabled: true
  },
  {
    id: '302',
    eventId: '3',
    name: 'Workshop Area',
    description: 'Entrance to cooking demonstration area',
    isEnabled: true
  },
  
  // Gates for event 4 (Charity Gala)
  {
    id: '401',
    eventId: '4',
    name: 'Ballroom Entrance',
    description: 'Main entrance to the gala venue',
    isEnabled: false
  }
];

// Mock tickets
const mockTickets = [
  // Tickets for Event 1 (Summer Music Festival)
  {
    id: 'T1001',
    eventId: '1',
    type: 'standard',
    used: false,
    attendeeName: 'John Doe',
    email: 'john.doe@example.com'
  },
  {
    id: 'T1002',
    eventId: '1',
    type: 'vip',
    used: false,
    attendeeName: 'Jane Smith',
    email: 'jane.smith@example.com'
  },
  {
    id: 'T1003',
    eventId: '1',
    type: 'standard',
    used: true, // Already scanned
    attendeeName: 'Bob Johnson',
    email: 'bob.johnson@example.com'
  },
  
  // Tickets for Event 2 (Tech Conference)
  {
    id: 'T2001',
    eventId: '2',
    type: 'standard',
    used: false,
    attendeeName: 'Alice Williams',
    email: 'alice.williams@example.com'
  },
  {
    id: 'T2002',
    eventId: '2',
    type: 'vip',
    used: false,
    attendeeName: 'Charlie Brown',
    email: 'charlie.brown@example.com'
  },
  
  // Tickets for Event 3 (Food & Wine Expo)
  {
    id: 'T3001',
    eventId: '3',
    type: 'standard',
    used: false,
    attendeeName: 'David Miller',
    email: 'david.miller@example.com'
  },
  
  // Tickets for Event 4 (Charity Gala)
  {
    id: 'T4001',
    eventId: '4',
    type: 'vip',
    used: false,
    attendeeName: 'Emma Davis',
    email: 'emma.davis@example.com'
  }
];

/**
 * Get all events
 * @returns {Array} - All events
 */
export const getEvents = () => {
  return [...mockEvents];
};

/**
 * Get an event by ID
 * @param {string} eventId - The event ID
 * @returns {object|null} - The event or null if not found
 */
export const getEventById = (eventId) => {
  const event = mockEvents.find(event => event.id === eventId);
  return event ? { ...event } : null;
};

/**
 * Get all gates for a specific event
 * @param {string} eventId - The event ID
 * @returns {Array} - Gates for the event
 */
export const getGatesByEventId = (eventId) => {
  const gates = mockGates.filter(gate => gate.eventId === eventId);
  return gates.map(gate => ({ ...gate }));
};

/**
 * Get a gate by ID
 * @param {string} gateId - The gate ID
 * @returns {object|null} - The gate or null if not found
 */
export const getGateById = (gateId) => {
  const gate = mockGates.find(gate => gate.id === gateId);
  return gate ? { ...gate } : null;
};

/**
 * Get all tickets
 * @returns {Array} - All tickets
 */
export const getTickets = () => {
  return [...mockTickets];
};

/**
 * Get a ticket by ID
 * @param {string} ticketId - The ticket ID
 * @returns {object|null} - The ticket or null if not found
 */
export const getTicketById = (ticketId) => {
  const ticket = mockTickets.find(ticket => ticket.id === ticketId);
  return ticket ? { ...ticket } : null;
};

/**
 * Get tickets for a specific event
 * @param {string} eventId - The event ID
 * @returns {Array} - Tickets for the event
 */
export const getTicketsByEventId = (eventId) => {
  const tickets = mockTickets.filter(ticket => ticket.eventId === eventId);
  return tickets.map(ticket => ({ ...ticket }));
};
