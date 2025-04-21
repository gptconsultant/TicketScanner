import { useContext } from 'react';
import { EventContext } from '../contexts/EventContext';

/**
 * Hook to access the event context
 * @returns {Object} Event context methods and state
 */
export const useEvent = () => {
  const context = useContext(EventContext);
  
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  
  return context;
};