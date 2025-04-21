import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as syncService from '../services/syncService';
import * as asyncStorage from '../utils/asyncStorage';

const NetworkContext = createContext();

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingSyncCount, setPendingSyncCount] = useState(0);
  const [syncError, setSyncError] = useState(null);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      const wasConnected = isConnected;
      const nowConnected = state.isConnected;
      
      setIsConnected(nowConnected);
      
      // If we've just regained connection, trigger a sync
      if (!wasConnected && nowConnected) {
        syncData();
      }
    });

    // Get initial pending sync count
    updatePendingSyncCount();

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Update the count of pending items to sync
  const updatePendingSyncCount = async () => {
    try {
      const pendingCheckIns = await asyncStorage.getPendingCheckIns();
      const pendingGateChanges = await asyncStorage.getPendingGateStatusChanges();
      setPendingSyncCount(pendingCheckIns.length + pendingGateChanges.length);
    } catch (err) {
      console.error("Error getting pending sync count:", err);
    }
  };

  // Sync all pending data with the server
  const syncData = async () => {
    if (!isConnected || isSyncing) return;
    
    try {
      setIsSyncing(true);
      setSyncError(null);
      
      // Sync pending check-ins
      const pendingCheckIns = await asyncStorage.getPendingCheckIns();
      if (pendingCheckIns.length > 0) {
        await syncService.syncCheckIns(pendingCheckIns);
        await asyncStorage.clearPendingCheckIns();
      }
      
      // Sync pending gate status changes
      const pendingGateChanges = await asyncStorage.getPendingGateStatusChanges();
      if (pendingGateChanges.length > 0) {
        await syncService.syncGateStatusChanges(pendingGateChanges);
        await asyncStorage.clearPendingGateStatusChanges();
      }
      
      // Update the pending count after successful sync
      await updatePendingSyncCount();
    } catch (err) {
      setSyncError(err.message || 'Failed to sync data');
      console.error("Sync error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <NetworkContext.Provider value={{
      isConnected,
      isSyncing,
      pendingSyncCount,
      syncError,
      syncData,
      updatePendingSyncCount
    }}>
      {children}
    </NetworkContext.Provider>
  );
};
