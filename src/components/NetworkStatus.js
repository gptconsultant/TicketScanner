import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';

const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Subscribe to network status updates
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionStatus = state.isConnected;
      
      // If connection status changed, show appropriate message
      if (newConnectionStatus !== isConnected) {
        if (newConnectionStatus) {
          setSnackbarMessage('Back online');
        } else {
          setSnackbarMessage('No internet connection. Working offline.');
        }
        setShowSnackbar(true);
      }
      
      setIsConnected(newConnectionStatus);
    });

    // Check initial status
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  // Don't show anything if connected
  if (isConnected && !showSnackbar) {
    return null;
  }

  return (
    <Snackbar
      visible={showSnackbar}
      onDismiss={() => setShowSnackbar(false)}
      duration={isConnected ? 3000 : 5000}
      style={[
        styles.snackbar,
        isConnected ? styles.onlineSnackbar : styles.offlineSnackbar
      ]}
    >
      <View style={styles.snackbarContent}>
        <Feather 
          name={isConnected ? "wifi" : "wifi-off"} 
          size={16} 
          color="white" 
          style={styles.icon}
        />
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </View>
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 0,
  },
  onlineSnackbar: {
    backgroundColor: '#2ecc71',
  },
  offlineSnackbar: {
    backgroundColor: '#e74c3c',
  },
  snackbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  snackbarText: {
    color: 'white',
  },
});

export default NetworkStatus;
