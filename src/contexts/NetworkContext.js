import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Monitor network state
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    // Initial check
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    // Load pending actions from storage
    loadPendingActions();

    return () => {
      unsubscribe();
    };
  }, []);

  // When coming back online, process pending actions
  useEffect(() => {
    if (isOnline && pendingActions.length > 0 && !isProcessing) {
      processPendingActions();
    }
  }, [isOnline, pendingActions, isProcessing]);

  const loadPendingActions = async () => {
    try {
      const actionsJson = await AsyncStorage.getItem('pendingActions');
      if (actionsJson) {
        setPendingActions(JSON.parse(actionsJson));
      }
    } catch (error) {
      console.error('Failed to load pending actions', error);
    }
  };

  const savePendingActions = async (actions) => {
    try {
      await AsyncStorage.setItem('pendingActions', JSON.stringify(actions));
    } catch (error) {
      console.error('Failed to save pending actions', error);
    }
  };

  const addPendingAction = async (action) => {
    const updatedActions = [...pendingActions, action];
    setPendingActions(updatedActions);
    await savePendingActions(updatedActions);
    return action.id; // Return the ID for reference
  };

  const processPendingActions = async () => {
    if (pendingActions.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      const failedActions = [];
      
      // Process each action sequentially
      for (const action of pendingActions) {
        try {
          // Execute the action based on its type
          switch (action.type) {
            case 'TICKET_SCAN':
              await processTicketScan(action.payload);
              break;
            default:
              console.warn(`Unknown action type: ${action.type}`);
              failedActions.push(action);
          }
        } catch (error) {
          console.error(`Failed to process action ${action.id}:`, error);
          failedActions.push(action);
        }
      }
      
      // Update pending actions with only the failed ones
      setPendingActions(failedActions);
      await savePendingActions(failedActions);
      
    } finally {
      setIsProcessing(false);
    }
  };

  const processTicketScan = async (payload) => {
    // Implementation for processing a ticket scan when back online
    // This would call the API to register the scan on the backend
    const { ticketId, eventId, gateId, scannedAt, userId } = payload;
    
    // Mock API call - in real implementation, this would use apiClient
    // Example:
    // await apiClient.post('/scans', { ticketId, eventId, gateId, scannedAt, userId });
    
    console.log('Processing ticket scan:', payload);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // If we get here without throwing, the action is considered successful
  };

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        pendingActions,
        isProcessing,
        addPendingAction,
        processPendingActions,
        pendingCount: pendingActions.length
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
