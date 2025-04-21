import { useContext } from 'react';
import { ScanContext } from '../contexts/ScanContext';

/**
 * Hook to access the scan context
 * @returns {Object} Scan context methods and state
 */
export const useScan = () => {
  const context = useContext(ScanContext);
  
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  
  return context;
};