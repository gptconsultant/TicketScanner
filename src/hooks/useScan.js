import { useContext } from 'react';
import { ScanContext } from '../contexts/ScanContext';

const useScan = () => {
  const context = useContext(ScanContext);
  
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  
  return context;
};

export default useScan;
