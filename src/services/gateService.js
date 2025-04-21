import * as mockData from './mockData';

/**
 * Get gates for a specific event
 * @param {string} eventId - The event ID
 * @returns {Promise<Array>} - List of gates for the event
 */
export const getGatesByEvent = async (eventId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 800));
  
  try {
    // Get mock gate data - in a real app this would be a server request
    const gates = mockData.getGatesByEventId(eventId);
    return gates;
  } catch (error) {
    console.error(`Error fetching gates for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Get gate by ID
 * @param {string} gateId - The gate ID
 * @returns {Promise<object>} - Gate details
 */
export const getGateById = async (gateId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  try {
    const gate = mockData.getGateById(gateId);
    
    if (!gate) {
      throw new Error('Gate not found');
    }
    
    return gate;
  } catch (error) {
    console.error(`Error fetching gate ${gateId}:`, error);
    throw error;
  }
};

/**
 * Update gate status (enable/disable)
 * @param {string} gateId - The gate ID
 * @param {boolean} isEnabled - Whether the gate should be enabled
 * @returns {Promise<object>} - Updated gate
 */
export const updateGateStatus = async (gateId, isEnabled) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    // In a real app, this would update the gate status on the server
    // For now, just return the updated gate object with the new status
    const gate = mockData.getGateById(gateId);
    
    if (!gate) {
      throw new Error('Gate not found');
    }
    
    const updatedGate = { ...gate, isEnabled };
    return updatedGate;
  } catch (error) {
    console.error(`Error updating gate ${gateId} status:`, error);
    throw error;
  }
};

/**
 * Create a new gate for an event
 * @param {string} eventId - The event ID
 * @param {object} gateData - The gate data
 * @returns {Promise<object>} - Created gate
 */
export const createGate = async (eventId, gateData) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  try {
    // In a real app, this would create a gate on the server
    // For now, just return a mock new gate
    const newGate = {
      id: `gate-${Date.now()}`,
      eventId,
      ...gateData,
      isEnabled: true,
      createdAt: new Date().toISOString()
    };
    
    return newGate;
  } catch (error) {
    console.error('Error creating gate:', error);
    throw error;
  }
};
