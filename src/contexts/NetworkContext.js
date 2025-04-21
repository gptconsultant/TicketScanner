import React, { createContext, useState, useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { isAPIReachable } from '../utils/networkUtils';

export const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isServerReachable, setIsServerReachable] = useState(true);

  useEffect(() => {
    // Check initial network state
    const checkConnection = async () => {
      try {
        const networkState = await NetInfo.fetch();
        setIsConnected(networkState.isConnected);
        
        if (networkState.isConnected) {
          const apiReachable = await isAPIReachable();
          setIsServerReachable(apiReachable);
        } else {
          setIsServerReachable(false);
        }
      } catch (error) {
        console.error('Network check error:', error);
        setIsServerReachable(false);
      }
    };

    checkConnection();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected);
      
      if (state.isConnected) {
        try {
          const apiReachable = await isAPIReachable();
          setIsServerReachable(apiReachable);
        } catch (error) {
          setIsServerReachable(false);
        }
      } else {
        setIsServerReachable(false);
      }
    });

    // Set up periodic API reachability check when connected
    let intervalId;
    if (isConnected) {
      intervalId = setInterval(async () => {
        try {
          const apiReachable = await isAPIReachable();
          setIsServerReachable(apiReachable);
        } catch (error) {
          setIsServerReachable(false);
        }
      }, 30000); // Check every 30 seconds
    }

    // Cleanup function
    return () => {
      unsubscribe();
      if (intervalId) clearInterval(intervalId);
    };
  }, [isConnected]);

  return (
    <NetworkContext.Provider value={{ isConnected, isServerReachable }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);