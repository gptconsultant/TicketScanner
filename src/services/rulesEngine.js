/**
 * Validate a ticket against a set of rules
 * @param {Object} ticket - The ticket to validate
 * @param {number} gateId - The ID of the gate being used
 * @param {Array} rules - Array of rule objects to check against
 * @returns {Object} - Validation result with valid flag and reason if invalid
 */
export const validateRules = (ticket, gateId, rules = []) => {
  // If no rules, consider the ticket valid
  if (!rules || rules.length === 0) {
    return { valid: true };
  }
  
  // Get rules that apply to this gate
  const applicableRules = getApplicableRules(rules, gateId);
  
  // Validate against each applicable rule
  for (const rule of applicableRules) {
    // Skip inactive rules
    if (!rule.isActive) continue;
    
    // Validate against this rule
    const validation = validateRule(rule, ticket, gateId);
    
    // If any rule fails, return the failure result
    if (!validation.valid) {
      return validation;
    }
  }
  
  // If all rules pass, ticket is valid
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
      // Unknown rule type, consider it passed
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
  // Extract time range from rule value (format: "HH:MM-HH:MM")
  const timeRange = rule.value.split('-');
  
  if (timeRange.length !== 2) {
    // Invalid time range format, consider it passed
    return { valid: true };
  }
  
  const [startTime, endTime] = timeRange;
  
  // Get current time
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  // Parse start time
  const [startHour, startMinute] = startTime.split(':').map(Number);
  
  // Parse end time
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  // Convert to minutes for easier comparison
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;
  
  // Check if current time is within range
  if (currentTimeInMinutes < startTimeInMinutes || currentTimeInMinutes > endTimeInMinutes) {
    return {
      valid: false,
      reason: `Entry is only allowed between ${startTime} and ${endTime}`,
      rule: rule
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
  // Extract allowed gates from rule value (comma-separated gate IDs)
  const allowedGates = rule.value.split(',').map(Number);
  
  if (!allowedGates.includes(gateId)) {
    return {
      valid: false,
      reason: 'This ticket is not valid for this entrance',
      rule: rule
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
  // Extract allowed ticket types from rule value (comma-separated types)
  const allowedTypes = rule.value.split(',').map(type => type.trim());
  
  if (!allowedTypes.includes(ticket.type)) {
    return {
      valid: false,
      reason: `This entrance is only for ${allowedTypes.join('/')} tickets`,
      rule: rule
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
  // This would normally check if the ticket has been used before
  // For the mock implementation, we'll just assume it's valid
  // In a real app, this would check against a database
  
  // If the ticket has a "used" property and it's true, consider it invalid
  if (ticket.used) {
    return {
      valid: false,
      reason: 'This ticket has already been used',
      rule: { type: 'ONE_TIME_USE', name: 'One-time Entry' }
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
  return allRules.filter(rule => 
    // If the rule has gateIds field and it's an array, check if this gate is included
    !rule.gateIds || 
    !Array.isArray(rule.gateIds) || 
    rule.gateIds.length === 0 || 
    rule.gateIds.includes(gateId)
  );
};