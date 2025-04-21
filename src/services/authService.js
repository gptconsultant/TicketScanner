// Mock authentication service for the event scanning app
// This would be replaced with actual API calls in a production environment

// Mock user data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'Admin'
  },
  {
    id: '2',
    username: 'staff',
    password: 'staff123',
    name: 'Staff Member',
    role: 'Staff'
  },
  {
    id: '3',
    username: 'volunteer',
    password: 'volunteer123',
    name: 'Event Volunteer',
    role: 'Volunteer'
  }
];

/**
 * Simulates a login request to authenticate a user
 * @param {string} username - The username
 * @param {string} password - The password
 * @returns {Promise<object>} - User data if authentication successful
 */
export const login = async (username, password) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(
    user => user.username === username && user.password === password
  );
  
  if (user) {
    // Don't include password in the returned user object
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } else {
    throw new Error('Invalid username or password');
  }
};

/**
 * Simulates a logout request
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return true;
};

/**
 * Validate an authentication token
 * @param {string} token - Authentication token
 * @returns {Promise<boolean>} - True if token is valid
 */
export const validateToken = async (token) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, this would validate the token with the server
  return true;
};

/**
 * Get the user's permissions
 * @param {string} userId - User ID
 * @returns {Promise<object>} - User permissions
 */
export const getUserPermissions = async (userId) => {
  // Simulate network request
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const user = mockUsers.find(user => user.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Return different permissions based on role
  switch (user.role) {
    case 'Admin':
      return {
        canScanTickets: true,
        canManageGates: true,
        canViewReports: true
      };
    case 'Staff':
      return {
        canScanTickets: true,
        canManageGates: true,
        canViewReports: false
      };
    case 'Volunteer':
      return {
        canScanTickets: true,
        canManageGates: false,
        canViewReports: false
      };
    default:
      return {
        canScanTickets: false,
        canManageGates: false,
        canViewReports: false
      };
  }
};
