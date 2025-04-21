import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Surface, Badge, IconButton } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useScan from '../hooks/useScan';
import useOfflineSync from '../hooks/useOfflineSync';

const SyncStatus = () => {
  const { offlineCheckIns, isOnline } = useScan();
  const { triggerSync, isSyncing, syncStatus } = useOfflineSync(false);

  const handleManualSync = async () => {
    if (isOnline && !isSyncing && offlineCheckIns.length > 0) {
      await triggerSync();
    }
  };

  // Don't show anything if no offline check-ins
  if (offlineCheckIns.length === 0) {
    return null;
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.infoContainer}>
        <Feather 
          name="database" 
          size={20} 
          color={isOnline ? "#3498db" : "#7f8c8d"} 
        />
        <Text style={styles.text}>
          {offlineCheckIns.length} {offlineCheckIns.length === 1 ? 'check-in' : 'check-ins'} pending sync
        </Text>
      </View>
      <TouchableOpacity 
        onPress={handleManualSync}
        disabled={!isOnline || isSyncing}
        style={[
          styles.syncButton,
          (!isOnline || isSyncing) && styles.disabledSyncButton
        ]}
      >
        {isSyncing ? (
          <Text style={styles.syncButtonText}>Syncing...</Text>
        ) : (
          <Text style={styles.syncButtonText}>Sync Now</Text>
        )}
        <Feather 
          name={isSyncing ? "loader" : "upload-cloud"} 
          size={16} 
          color="#fff" 
          style={[
            styles.syncIcon,
            isSyncing && styles.spinningIcon
          ]} 
        />
      </TouchableOpacity>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2c3e50',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  disabledSyncButton: {
    backgroundColor: '#bdc3c7',
  },
  syncButtonText: {
    color: 'white',
    fontSize: 12,
    marginRight: 4,
  },
  syncIcon: {
    marginLeft: 4,
  },
  spinningIcon: {
    // Note: In a real app, you would use an animation here
  },
});

export default SyncStatus;
