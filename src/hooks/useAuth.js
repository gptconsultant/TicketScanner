import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook to access the authentication context
 * @returns {Object} Authentication context methods and state
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};