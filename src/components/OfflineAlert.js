import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../contexts/NetworkContext';

const OfflineAlert = () => {
  const { isConnected, apiIsReachable, lastOnlineTime } = useNetwork();
  
  // If connected and API is reachable, don't show the alert
  if (isConnected && apiIsReachable) {
    return null;
  }
  
  // Format last online time
  const formatLastOnline = () => {
    if (!lastOnlineTime) return 'Never';
    
    const now = new Date();
    const diff = now - lastOnlineTime;
    
    if (diff < 60000) {
      // Less than a minute
      return 'Just now';
    } else if (diff < 3600000) {
      // Less than an hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diff < 86400000) {
      // Less than a day
      const hours = Math.floor(diff / 3600000);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      // More than a day
      const days = Math.floor(diff / 86400000);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {!isConnected
          ? 'No internet connection. Working offline.'
          : 'Server connection lost. Using offline mode.'}
      </Text>
      {lastOnlineTime && (
        <Text style={styles.lastOnlineText}>
          Last online: {formatLastOnline()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5c6cb',
  },
  text: {
    color: '#721c24',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  lastOnlineText: {
    color: '#721c24',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default OfflineAlert;