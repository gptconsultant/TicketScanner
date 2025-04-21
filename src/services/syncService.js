import * as ticketService from './ticketService';
import * as gateService from './gateService';

/**
 * Syncs pending check-ins with the server
 * @param {Array} pendingCheckIns - Array of pending check-ins to sync
 * @returns {Promise<object>} - Result of sync operation
 */
export const syncCheckIns = async (pendingCheckIns) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const results = {
      successful: [],
      failed: []
    };
    
    // Process each check-in
    for (const checkIn of pendingCheckIns) {
      try {
        // In a real implementation, this would submit each check-in to the server
        await ticketService.markTicketAsUsed(
          checkIn.ticketId, 
          checkIn.eventId, 
          checkIn.gateId
        );
        
        results.successful.push(checkIn);
      } catch (error) {
        console.error(`Failed to sync check-in ${checkIn.ticketId}:`, error);
        results.failed.push({
          ...checkIn,
          error: error.message
        });
      }
    }
    
    return {
      success: results.failed.length === 0,
      synced: results.successful.length,
      failed: results.failed.length,
      results
    };
  } catch (error) {
    console.error('Error syncing check-ins:', error);
    throw error;
  }
};

/**
 * Syncs pending gate status changes with the server
 * @param {Array} pendingChanges - Array of pending gate status changes
 * @returns {Promise<object>} - Result of sync operation
 */
export const syncGateStatusChanges = async (pendingChanges) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  try {
    const results = {
      successful: [],
      failed: []
    };
    
    // Process each gate status change
    for (const change of pendingChanges) {
      try {
        // In a real implementation, this would submit each gate status change to the server
        await gateService.updateGateStatus(
          change.gateId,
          change.enabled
        );
        
        results.successful.push(change);
      } catch (error) {
        console.error(`Failed to sync gate change ${change.gateId}:`, error);
        results.failed.push({
          ...change,
          error: error.message
        });
      }
    }
    
    return {
      success: results.failed.length === 0,
      synced: results.successful.length,
      failed: results.failed.length,
      results
    };
  } catch (error) {
    console.error('Error syncing gate changes:', error);
    throw error;
  }
};

/**
 * Checks if there are changes waiting to be synced
 * @param {Array} pendingCheckIns - Array of pending check-ins
 * @param {Array} pendingGateChanges - Array of pending gate changes
 * @returns {boolean} - True if there are pending changes
 */
export const hasPendingChanges = (pendingCheckIns, pendingGateChanges) => {
  return (pendingCheckIns && pendingCheckIns.length > 0) || 
         (pendingGateChanges && pendingGateChanges.length > 0);
};
