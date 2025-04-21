import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Card, Title, Paragraph, Badge } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const EventSelector = ({ event, onSelect }) => {
  const isActive = event.isActive;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString();
  
  const handleSelect = () => {
    if (isActive && onSelect) {
      onSelect(event);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      disabled={!isActive}
      activeOpacity={0.7}
    >
      <Card 
        style={[
          styles.card, 
          !isActive && styles.inactiveCard
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.iconContainer}>
            <Feather 
              name="calendar" 
              size={24} 
              color={!isActive ? "#bdc3c7" : "#2c3e50"} 
            />
          </View>
          <View style={styles.infoContainer}>
            <Title style={[styles.title, !isActive && styles.inactiveText]}>
              {event.name}
            </Title>
            <Paragraph style={[styles.date, !isActive && styles.inactiveText]}>
              {formattedDate}
            </Paragraph>
          </View>
          <View style={styles.statusContainer}>
            {!isActive ? (
              <Badge style={styles.inactiveBadge}>Inactive</Badge>
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
  inactiveCard: {
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
  date: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 0,
  },
  inactiveText: {
    color: '#95a5a6',
  },
  inactiveBadge: {
    backgroundColor: '#95a5a6',
  },
});

export default EventSelector;
