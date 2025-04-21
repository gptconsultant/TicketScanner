import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../contexts/NetworkContext';

const OfflineAlert = () => {
  const { isConnected, isServerReachable } = useNetwork();
  
  if (isConnected && isServerReachable) {
    return null; // Don't render anything when online
  }

  const message = !isConnected 
    ? 'No internet connection. Working in offline mode.'
    : 'Server unreachable. Working in offline mode.';

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e74c3c',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default OfflineAlert;