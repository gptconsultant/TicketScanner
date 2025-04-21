import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { registerNetworkListeners } from '../utils/networkUtils';

// Create context
export const NetworkContext = createContext({
  isConnected: true,
  isInternetReachable: true,
  apiIsReachable: true,
});

// Custom hook for using the network context
export const useNetwork = () => useContext(NetworkContext);

// Provider component
export const NetworkProvider = ({ children }) => {
  const [netInfo, setNetInfo] = useState({
    isConnected: true,
    isInternetReachable: true,
  });
  const [apiIsReachable, setApiIsReachable] = useState(true);
  const [lastOnlineTime, setLastOnlineTime] = useState(null);

  // Monitor network connectivity
  useEffect(() => {
    // Handle connection
    const handleConnection = () => {
      setApiIsReachable(true);
      setLastOnlineTime(new Date());
    };

    // Handle disconnection
    const handleDisconnection = () => {
      setApiIsReachable(false);
    };

    // Subscribe to network state updates
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setNetInfo({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
      
      if (state.isConnected && state.isInternetReachable) {
        setLastOnlineTime(new Date());
      }
    });

    // Subscribe to API reachability updates
    const unsubscribeApiMonitor = registerNetworkListeners(
      handleConnection,
      handleDisconnection
    );

    // Initial network state check
    NetInfo.fetch().then(state => {
      setNetInfo({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
      
      if (state.isConnected && state.isInternetReachable) {
        setLastOnlineTime(new Date());
      }
    });

    // Cleanup
    return () => {
      unsubscribeNetInfo();
      unsubscribeApiMonitor();
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        ...netInfo,
        apiIsReachable,
        lastOnlineTime,
        isOfflineMode: !apiIsReachable,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};