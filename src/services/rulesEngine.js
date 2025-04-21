/**
 * Validate a ticket against a set of rules
 * @param {Object} ticket - The ticket to validate
 * @param {number} gateId - The ID of the gate being used
 * @param {Array} rules - Array of rule objects to check against
 * @returns {Object} - Validation result with valid flag and reason if invalid
 */
export const validateRules = (ticket, gateId, rules = []) => {
  // Filter to only active rules
  const activeRules = rules.filter(rule => rule.isActive);
  
  // If no active rules, ticket is valid
  if (activeRules.length === 0) {
    return { valid: true };
  }
  
  // Check each rule type
  for (const rule of activeRules) {
    const result = validateRule(rule, ticket, gateId);
    if (!result.valid) {
      return result;
    }
  }
  
  // All rules passed
  return { valid: true };
};

/**
 * Validate a ticket against a specific rule
 * @param {Object} rule - The rule to check
 * @param {Object} ticket - The ticket to validate
 * @param {number} gateId - The ID of the gate being used
 * @returns {Object} - Validation result with valid flag and reason if invalid
 */
const validateRule = (rule, ticket, gateId) => {
  switch (rule.type) {
    case 'TIME_RESTRICTION':
      return validateTimeRestriction(rule, ticket);
    
    case 'GATE_RESTRICTION':
      return validateGateRestriction(rule, ticket, gateId);
    
    case 'TICKET_TYPE_RESTRICTION':
      return validateTicketTypeRestriction(rule, ticket);
    
    case 'ONE_TIME_USE':
      return validateOneTimeUse(ticket);
    
    default:
      // Unknown rule type, consider it valid
      return { valid: true };
  }
};

/**
 * Validate a time restriction rule
 * @param {Object} rule - The time restriction rule
 * @param {Object} ticket - The ticket to validate
 * @returns {Object} - Validation result
 */
const validateTimeRestriction = (rule, ticket) => {
  // Parse the time restriction (expected format: "HH:MM")
  const [hours, minutes] = rule.value.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) {
    // Invalid time format in rule, consider it valid
    return { valid: true };
  }
  
  // Create cutoff time for today
  const cutoffTime = new Date();
  cutoffTime.setHours(hours, minutes, 0, 0);
  
  // Get current time
  const currentTime = new Date();
  
  // Check if current time is past cutoff
  if (currentTime > cutoffTime) {
    return { 
      valid: false, 
      reason: `Entry not allowed after ${rule.value}` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate a gate restriction rule
 * @param {Object} rule - The gate restriction rule
 * @param {Object} ticket - The ticket to validate
 * @param {number} gateId - The ID of the gate being used
 * @returns {Object} - Validation result
 */
const validateGateRestriction = (rule, ticket, gateId) => {
  // Allowed gates should be comma-separated in rule.value
  const allowedGateIds = rule.value.split(',').map(id => id.trim());
  
  // Check if current gate is in allowed gates
  if (!allowedGateIds.includes(gateId.toString())) {
    return { 
      valid: false, 
      reason: `This ticket can only be used at: ${rule.value}` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate a ticket type restriction rule
 * @param {Object} rule - The ticket type restriction rule
 * @param {Object} ticket - The ticket to validate
 * @returns {Object} - Validation result
 */
const validateTicketTypeRestriction = (rule, ticket) => {
  // Allowed ticket types should be comma-separated in rule.value
  const allowedTypes = rule.value.split(',').map(type => type.trim());
  
  // Check if ticket type is in allowed types
  if (!allowedTypes.includes(ticket.type)) {
    return { 
      valid: false, 
      reason: `Ticket type "${ticket.type}" is not allowed` 
    };
  }
  
  return { valid: true };
};

/**
 * Validate a one-time use rule
 * @param {Object} ticket - The ticket to validate
 * @returns {Object} - Validation result
 */
const validateOneTimeUse = (ticket) => {
  // Check if ticket has already been used
  if (ticket.isUsed) {
    return { 
      valid: false, 
      reason: 'Ticket has already been used' 
    };
  }
  
  return { valid: true };
};

/**
 * Get applicable rules for a specific gate
 * @param {Array} allRules - All rules for the event
 * @param {number} gateId - The gate ID
 * @returns {Array} - Rules that apply to this gate
 */
export const getApplicableRules = (allRules, gateId) => {
  if (!allRules || !Array.isArray(allRules)) {
    return [];
  }
  
  return allRules.filter(rule => {
    // If rule is not active, exclude it
    if (!rule.isActive) {
      return false;
    }
    
    // If rule is not gate-specific, include it
    if (rule.type !== 'GATE_RESTRICTION') {
      return true;
    }
    
    // If rule is gate-specific, check if this gate is included
    const allowedGateIds = rule.value.split(',').map(id => id.trim());
    return allowedGateIds.includes(gateId.toString());
  });
};
