import React, { createContext, useState, useContext } from 'react';
import { validateTicket, validateTicketOffline } from '../services/ticketService';
import { useNetwork } from './NetworkContext';
import { saveCheckInOffline } from '../services/offlineStorage';

export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [error, setError] = useState(null);
  const { isOfflineMode } = useNetwork();

  // Reset scan state
  const resetScan = () => {
    setScanResults(null);
    setError(null);
  };

  // Handle a scan
  const handleScan = async (scannedData, eventId, gateId, rules = []) => {
    setError(null);
    setIsScanning(true);
    
    try {
      let results;
      
      if (isOfflineMode) {
        // Use offline validation
        results = validateTicketOffline(scannedData, eventId, gateId, rules);
        
        // Save check-in for later sync
        if (results.valid) {
          await saveCheckInOffline({
            ticketId: results.ticket.id,
            eventId,
            gateId,
            timestamp: new Date().toISOString(),
            valid: results.valid,
          });
        }
      } else {
        // Use online validation with API
        results = await validateTicket(scannedData, eventId, gateId);
      }
      
      // Store results
      setScanResults(results);
      
      // Add to history
      if (results) {
        const historyItem = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          ticketData: results.ticket || { scannedData },
          valid: results.valid,
          reason: results.reason,
          offline: isOfflineMode,
        };
        
        setScanHistory(prevHistory => [historyItem, ...prevHistory]);
      }
      
      return results;
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message || 'Error processing scan');
      return { valid: false, reason: err.message || 'Error processing scan' };
    } finally {
      setIsScanning(false);
    }
  };

  // Clear scan history
  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <ScanContext.Provider
      value={{
        isScanning,
        scanResults,
        scanHistory,
        error,
        handleScan,
        resetScan,
        clearHistory,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};