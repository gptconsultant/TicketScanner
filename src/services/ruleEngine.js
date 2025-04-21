/**
 * Rule engine for ticket validation
 * Each rule has:
 * - name: Rule identifier
 * - description: Human readable description
 * - validate: Function that validates the rule
 * - isCritical: Whether failing this rule should invalidate the ticket
 */

/**
 * Apply all validation rules to a ticket
 * @param {object} ticket - The ticket to validate
 * @param {object} event - The event
 * @param {object} gate - The gate where the ticket is being scanned
 * @returns {Array} - Results of all rule validations
 */
export const applyRules = (ticket, event, gate) => {
  const allRules = getAllRules();
  
  return allRules.map(rule => {
    try {
      return rule.validate(ticket, event, gate);
    } catch (error) {
      console.error(`Error applying rule ${rule.name}:`, error);
      return {
        name: rule.name,
        description: rule.description,
        passed: false,
        isCritical: rule.isCritical,
        failReason: 'Error validating rule',
        error: error.message
      };
    }
  });
};

/**
 * Get a subset of rules that can be applied offline
 * @returns {Array} - Offline-compatible validation rules
 */
export const getOfflineRules = () => {
  // Return only rules that can be validated offline
  // (rules that don't require server-side data)
  const allRules = getAllRules();
  return allRules.filter(rule => rule.offlineCompatible);
};

/**
 * Get all validation rules
 * @returns {Array} - All validation rules
 */
export const getAllRules = () => {
  return [
    // Event active rule
    {
      name: 'event-active',
      description: 'Event must be active',
      isCritical: true,
      offlineCompatible: true,
      validate: (ticket, event) => {
        const passed = event && event.isActive;
        return {
          name: 'event-active',
          description: 'Event must be active',
          passed,
          isCritical: true,
          failReason: passed ? null : 'This event is no longer active'
        };
      }
    },
    
    // Ticket type rule
    {
      name: 'valid-ticket-type',
      description: 'Ticket must be of a valid type',
      isCritical: true,
      offlineCompatible: true,
      validate: (ticket) => {
        // Check if ticket has a valid type
        const validTypes = ['standard', 'vip', 'early-bird', 'group', 'comp'];
        const passed = validTypes.includes(ticket.type?.toLowerCase());
        
        return {
          name: 'valid-ticket-type',
          description: 'Ticket must be of a valid type',
          passed,
          isCritical: true,
          failReason: passed ? null : 'Invalid ticket type'
        };
      }
    },
    
    // Already used rule
    {
      name: 'not-already-used',
      description: 'Ticket must not have been already used',
      isCritical: true,
      offlineCompatible: false, // Requires server check
      validate: (ticket) => {
        // In a real app, this would check server data
        // For mock, we'll use the ticket's used property
        const passed = !ticket.used;
        
        return {
          name: 'not-already-used',
          description: 'Ticket must not have been already used',
          passed,
          isCritical: true,
          failReason: passed ? null : 'This ticket has already been used'
        };
      }
    },
    
    // Gate authorization rule
    {
      name: 'gate-authorization',
      description: 'Ticket must be authorized for this gate',
      isCritical: true,
      offlineCompatible: true,
      validate: (ticket, event, gate) => {
        // VIP tickets can enter through any gate
        if (ticket.type?.toLowerCase() === 'vip') {
          return {
            name: 'gate-authorization',
            description: 'Ticket must be authorized for this gate',
            passed: true,
            isCritical: true
          };
        }
        
        // For regular tickets, check if this gate accepts the ticket type
        // In a real app, this would be more complex logic
        // For now, assume standard tickets can only use standard gates
        const isStandardTicket = ticket.type?.toLowerCase() === 'standard';
        const isStandardGate = !gate.name.toLowerCase().includes('vip');
        
        const passed = isStandardTicket ? isStandardGate : true;
        
        return {
          name: 'gate-authorization',
          description: 'Ticket must be authorized for this gate',
          passed,
          isCritical: true,
          failReason: passed ? null : 'This ticket type is not authorized for this gate'
        };
      }
    },
    
    // Gate enabled rule
    {
      name: 'gate-enabled',
      description: 'Gate must be enabled',
      isCritical: true,
      offlineCompatible: true,
      validate: (ticket, event, gate) => {
        const passed = gate && gate.isEnabled;
        
        return {
          name: 'gate-enabled',
          description: 'Gate must be enabled',
          passed,
          isCritical: true,
          failReason: passed ? null : 'This gate is currently disabled'
        };
      }
    },
    
    // Time restriction rule
    {
      name: 'time-restriction',
      description: 'Ticket must be used within allowed time',
      isCritical: false, // Warning only
      offlineCompatible: true,
      validate: (ticket, event) => {
        // This is a mock rule for time restrictions
        // In a real app, this would check against event schedule
        
        // Let's pretend the event has a cutoff time
        const now = new Date();
        const currentHour = now.getHours();
        
        // Example: Event ends at 11 PM
        const passed = currentHour < 23;
        
        return {
          name: 'time-restriction',
          description: 'Ticket must be used within allowed time',
          passed,
          isCritical: false, // Just a warning
          failReason: passed ? null : 'Entry is close to cutoff time (11 PM)'
        };
      }
    },
    
    // Capacity rule
    {
      name: 'capacity-restriction',
      description: 'Event must not be at capacity',
      isCritical: false, // Warning only
      offlineCompatible: false, // Requires server check
      validate: (ticket, event) => {
        // This would check against server-tracked capacity
        // For mock, we'll assume the event is not at capacity
        
        return {
          name: 'capacity-restriction',
          description: 'Event must not be at capacity',
          passed: true,
          isCritical: false
        };
      }
    }
  ];
};
