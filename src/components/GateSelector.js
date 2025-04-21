import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, RadioButton, Badge } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const GateSelector = ({ gates, selectedGate, onSelectGate }) => {
  return (
    <FlatList
      data={gates}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.gateItem,
            selectedGate?.id === item.id && styles.selectedGateItem,
            !item.isEnabled && styles.disabledGateItem
          ]}
          onPress={() => item.isEnabled && onSelectGate(item)}
          disabled={!item.isEnabled}
        >
          <View style={styles.gateInfo}>
            <View style={styles.nameContainer}>
              <Text style={[
                styles.gateName,
                selectedGate?.id === item.id && styles.selectedGateName,
                !item.isEnabled && styles.disabledGateText
              ]}>
                {item.name}
              </Text>
              {!item.isEnabled && (
                <Badge style={styles.disabledBadge}>Disabled</Badge>
              )}
            </View>
            <Text style={[
              styles.gateDescription,
              !item.isEnabled && styles.disabledGateText
            ]}>
              {item.description || 'No description'}
            </Text>
          </View>
          <View style={styles.radioContainer}>
            {item.isEnabled ? (
              <RadioButton
                value={item.id}
                status={selectedGate?.id === item.id ? 'checked' : 'unchecked'}
                onPress={() => onSelectGate(item)}
                color="#1E88E5"
              />
            ) : (
              <Feather name="slash" size={20} color="#757575" />
            )}
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  gateItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedGateItem: {
    backgroundColor: '#E3F2FD',
  },
  disabledGateItem: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  gateInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gateName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectedGateName: {
    color: '#1E88E5',
  },
  disabledGateText: {
    color: '#757575',
  },
  gateDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  radioContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBadge: {
    backgroundColor: '#BDBDBD',
  },
});

export default GateSelector;
