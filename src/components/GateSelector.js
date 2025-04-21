import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const GateSelector = ({ gate, onSelect }) => {
  const isDisabled = !gate.isEnabled;

  const handleSelect = () => {
    if (!isDisabled && onSelect) {
      onSelect(gate);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      <Card 
        style={[
          styles.card, 
          isDisabled && styles.disabledCard
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather 
              name="map-pin" 
              size={24} 
              color={isDisabled ? "#bdc3c7" : "#2c3e50"} 
            />
          </View>
          <View style={styles.infoContainer}>
            <Title style={[styles.title, isDisabled && styles.disabledText]}>
              {gate.name}
            </Title>
            <Paragraph style={[styles.identifier, isDisabled && styles.disabledText]}>
              {gate.identifier}
            </Paragraph>
          </View>
          <View style={styles.statusContainer}>
            {isDisabled ? (
              <Badge style={styles.disabledBadge}>Disabled</Badge>
            ) : (
              <Feather name="chevron-right" size={24} color="#7f8c8d" />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  disabledCard: {
    backgroundColor: '#ecf0f1',
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  statusContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  identifier: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 0,
  },
  disabledText: {
    color: '#95a5a6',
  },
  disabledBadge: {
    backgroundColor: '#95a5a6',
  },
});

export default GateSelector;
