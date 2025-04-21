import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Switch, Divider, ActivityIndicator } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const AdminGateControl = ({ gate, onToggle, isAdmin = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleToggle = async (value) => {
    if (!isAdmin) return;
    
    try {
      setIsUpdating(true);
      await onToggle(value);
    } catch (error) {
      console.error("Error toggling gate status:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.gateInfo}>
        <Text style={styles.gateName}>{gate.name}</Text>
        <Text style={styles.gateDescription}>{gate.description || 'No description'}</Text>
      </View>
      <View style={styles.controlContainer}>
        {isUpdating ? (
          <ActivityIndicator size="small" color="#1E88E5" />
        ) : (
          <>
            <Text style={[
              styles.statusText,
              gate.isEnabled ? styles.enabledText : styles.disabledText
            ]}>
              {gate.isEnabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={gate.isEnabled}
              onValueChange={handleToggle}
              disabled={!isAdmin || isUpdating}
              color="#1E88E5"
            />
          </>
        )}
      </View>
      <Divider style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  gateInfo: {
    flex: 1,
    marginBottom: 8,
  },
  gateName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gateDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 8,
  },
  statusText: {
    marginRight: 12,
    fontWeight: 'bold',
  },
  enabledText: {
    color: '#4CAF50',
  },
  disabledText: {
    color: '#F44336',
  },
  divider: {
    marginTop: 8,
  },
});

export default AdminGateControl;
