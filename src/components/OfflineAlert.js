import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Banner } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useScan from '../hooks/useScan';

const OfflineAlert = () => {
  const { isOnline, offlineCheckIns } = useScan();

  // Don't show if we're online
  if (isOnline) {
    return null;
  }

  return (
    <Banner
      visible={true}
      icon={({ size }) => (
        <Feather name="wifi-off" size={size} color="#e74c3c" />
      )}
      actions={[
        {
          label: 'Dismiss',
          onPress: () => {}, // This banner stays visible while offline
        },
      ]}
      style={styles.banner}
    >
      <Text style={styles.title}>Offline Mode</Text>
      <Text style={styles.description}>
        You are currently offline. Scanned tickets will be stored locally and synced when connection is restored.
        {offlineCheckIns.length > 0 && (
          `\n\nYou have ${offlineCheckIns.length} unsynced check-ins.`
        )}
      </Text>
    </Banner>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FDECEA',
  },
  title: {
    fontWeight: 'bold',
    color: '#c0392b',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    color: '#e74c3c',
    fontSize: 14,
  },
});

export default OfflineAlert;
