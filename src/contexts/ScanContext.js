import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { EventContext } from './EventContext';
import { validateTicket, syncCheckIns } from '../services/ticketService';
import { saveCheckInOffline, getOfflineCheckIns, removeOfflineCheckIn } from '../services/offlineStorage';

export const ScanContext = createContext();

export const ScanProvider = ({ children }) => {
  const { selectedEvent, selectedGate } = useContext(EventContext);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanResult, setLastScanResult] = useState(null);
  const [offlineCheckIns, setOfflineCheckIns] = useState([]);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scanStats, setScanStats] = useState({
    totalScans: 0,
    validScans: 0,
    invalidScans: 0,
  });

  // Initialize network state and add listeners
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
      
      // If we just came back online, try to sync
      if (state.isConnected && offlineCheckIns.length > 0) {
        syncOfflineCheckIns();
      }
    });
    
    // Load offline check-ins from storage
    loadOfflineCheckIns();
    
    // Load scan stats from storage
    loadScanStats();
    
    return () => {
      unsubscribe();
    };
  }, []);

  // Load offline check-ins from storage
  const loadOfflineCheckIns = async () => {
    try {
      const checkIns = await getOfflineCheckIns();
      setOfflineCheckIns(checkIns);
    } catch (error) {
      console.error('Error loading offline check-ins:', error);
    }
  };

  // Load scan stats from storage
  const loadScanStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('scanStats');
      if (stats) {
        setScanStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading scan stats:', error);
    }
  };

  // Save scan stats to storage
  const saveScanStats = async (stats) => {
    try {
      await AsyncStorage.setItem('scanStats', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving scan stats:', error);
    }
  };

  // Update scan stats
  const updateScanStats = useCallback((isValid) => {
    setScanStats(prevStats => {
      const newStats = {
        totalScans: prevStats.totalScans + 1,
        validScans: isValid ? prevStats.validScans + 1 : prevStats.validScans,
        invalidScans: !isValid ? prevStats.invalidScans + 1 : prevStats.invalidScans,
      };
      
      // Save to storage
      saveScanStats(newStats);
      
      return newStats;
    });
  }, []);

  // Process a scanned QR code
  const processScan = async (scannedData) => {
    if (!selectedEvent || !selectedGate) {
      setLastScanResult({
        success: false,
        error: 'No event or gate selected',
        ticket: null,
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      let result;
      
      if (isOnline) {
        // Online mode - validate with server
        result = await validateTicket(
          scannedData, 
          selectedEvent.id, 
          selectedGate.id
        );
      } else {
        // Offline mode - validate locally and queue for sync
        const ticketData = JSON.parse(scannedData);
        
        // Basic validation
        if (!ticketData || !ticketData.id || !ticketData.eventId) {
          result = {
            success: false,
            error: 'Invalid ticket format',
            ticket: null,
          };
        } else if (ticketData.eventId !== selectedEvent.id) {
          result = {
            success: false,
            error: 'Ticket is for a different event',
            ticket: ticketData,
          };
        } else {
          // Check if already in offline queue
          const alreadyScanned = offlineCheckIns.some(
            checkIn => checkIn.ticketId === ticketData.id
          );
          
          if (alreadyScanned) {
            result = {
              success: false,
              error: 'Ticket already scanned (offline)',
              ticket: ticketData,
            };
          } else {
            // Locally approve and queue for sync
            const checkInData = {
              ticketId: ticketData.id,
              eventId: selectedEvent.id,
              gateId: selectedGate.id,
              timestamp: new Date().toISOString(),
              scannedData: scannedData,
            };
            
            await saveCheckInOffline(checkInData);
            
            // Update local state
            setOfflineCheckIns(prev => [...prev, checkInData]);
            
            result = {
              success: true,
              message: 'Ticket validated offline',
              ticket: ticketData,
              isOffline: true,
            };
          }
        }
      }
      
      // Update scan stats
      updateScanStats(result.success);
      
      // Store the result
      setLastScanResult(result);
      
      return result;
    } catch (error) {
      console.error('Error processing scan:', error);
      
      const errorResult = {
        success: false,
        error: error.message || 'Failed to process ticket',
        ticket: null,
      };
      
      setLastScanResult(errorResult);
      updateScanStats(false);
      
      return errorResult;
    } finally {
      setIsScanning(false);
    }
  };

  // Sync offline check-ins with the server
  const syncOfflineCheckIns = async () => {
    if (!isOnline || isSyncing || offlineCheckIns.length === 0) {
      return;
    }
    
    setIsSyncing(true);
    
    try {
      // Attempt to sync each offline check-in
      const results = await syncCheckIns(offlineCheckIns);
      
      // Process results
      const successfulSyncs = [];
      
      results.forEach((result, index) => {
        if (result.success) {
          successfulSyncs.push(offlineCheckIns[index]);
        }
      });
      
      // Remove successfully synced check-ins
      for (const checkIn of successfulSyncs) {
        await removeOfflineCheckIn(checkIn.ticketId);
      }
      
      // Update local state
      const remainingCheckIns = offlineCheckIns.filter(
        checkIn => !successfulSyncs.some(
          syncedCheckIn => syncedCheckIn.ticketId === checkIn.ticketId
        )
      );
      
      setOfflineCheckIns(remainingCheckIns);
      
      return {
        total: offlineCheckIns.length,
        synced: successfulSyncs.length,
        failed: offlineCheckIns.length - successfulSyncs.length,
      };
    } catch (error) {
      console.error('Error syncing offline check-ins:', error);
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset scan state
  const resetScan = () => {
    setLastScanResult(null);
  };

  // Reset scan stats
  const resetScanStats = async () => {
    const newStats = {
      totalScans: 0,
      validScans: 0,
      invalidScans: 0,
    };
    
    setScanStats(newStats);
    await saveScanStats(newStats);
  };

  return (
    <ScanContext.Provider
      value={{
        isScanning,
        lastScanResult,
        offlineCheckIns,
        isOnline,
        isSyncing,
        scanStats,
        processScan,
        syncOfflineCheckIns,
        resetScan,
        resetScanStats,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};
