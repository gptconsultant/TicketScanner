import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import useScan from './useScan';

const useOfflineSync = (autoSync = true) => {
  const { offlineCheckIns, syncOfflineCheckIns, isOnline, isSyncing } = useScan();
  const [syncStatus, setSyncStatus] = useState({
    lastSyncAttempt: null,
    lastSuccessfulSync: null,
    pendingItems: offlineCheckIns.length,
  });

  // Update pendingItems when offlineCheckIns changes
  useEffect(() => {
    setSyncStatus(prev => ({
      ...prev,
      pendingItems: offlineCheckIns.length,
    }));
  }, [offlineCheckIns]);

  // Listen for network status changes
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      // If we're coming back online and auto-sync is enabled, try to sync
      if (state.isConnected && !isSyncing && autoSync && offlineCheckIns.length > 0) {
        triggerSync();
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [autoSync, offlineCheckIns, isSyncing]);

  // Trigger a manual sync
  const triggerSync = async () => {
    if (!isOnline) {
      console.log('Cannot sync while offline');
      return { success: false, error: 'Cannot sync while offline' };
    }
    
    if (isSyncing) {
      console.log('Sync already in progress');
      return { success: false, error: 'Sync already in progress' };
    }
    
    if (offlineCheckIns.length === 0) {
      console.log('No items to sync');
      return { success: true, synced: 0, message: 'No items to sync' };
    }
    
    setSyncStatus(prev => ({
      ...prev,
      lastSyncAttempt: new Date(),
    }));
    
    try {
      const result = await syncOfflineCheckIns();
      
      setSyncStatus(prev => ({
        ...prev,
        lastSuccessfulSync: new Date(),
        pendingItems: offlineCheckIns.length - (result?.synced || 0),
      }));
      
      return { 
        success: true, 
        ...result 
      };
    } catch (error) {
      console.error('Sync failed:', error);
      return { 
        success: false, 
        error: error.message || 'Sync failed' 
      };
    }
  };

  return {
    syncStatus,
    triggerSync,
    isPending: offlineCheckIns.length > 0,
    isSyncing,
  };
};

export default useOfflineSync;
