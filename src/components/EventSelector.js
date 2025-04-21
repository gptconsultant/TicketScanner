import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Chip, Card, Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const EventSelector = ({ events, selectedEvent, onSelectEvent }) => {
  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card 
          style={[
            styles.eventCard,
            selectedEvent?.id === item.id && styles.selectedEventCard,
            !item.isActive && styles.inactiveEventCard
          ]}
          onPress={() => item.isActive && onSelectEvent(item)}
        >
          <Card.Content>
            <View style={styles.eventHeader}>
              <Text style={styles.eventName}>{item.name}</Text>
              {item.isActive ? (
                <Chip icon="check-circle" mode="outlined" style={styles.activeChip}>
                  Active
                </Chip>
              ) : (
                <Chip icon="close-circle" mode="outlined" style={styles.inactiveChip}>
                  Inactive
                </Chip>
              )}
            </View>
            
            <View style={styles.eventDetails}>
              <View style={styles.detailItem}>
                <Feather name="calendar" size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.detailItem}>
                <Feather name="map-pin" size={16} color="#666" style={styles.detailIcon} />
                <Text style={styles.detailText}>{item.location}</Text>
              </View>
            </View>
          </Card.Content>
          
          <Card.Actions>
            <Button 
              mode={selectedEvent?.id === item.id ? "contained" : "outlined"}
              onPress={() => onSelectEvent(item)}
              disabled={!item.isActive}
            >
              {selectedEvent?.id === item.id ? "Selected" : "Select"}
            </Button>
          </Card.Actions>
        </Card>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
  },
  selectedEventCard: {
    borderWidth: 2,
    borderColor: '#1E88E5',
  },
  inactiveEventCard: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  eventDetails: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});

export default EventSelector;
