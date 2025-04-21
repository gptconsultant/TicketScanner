import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text, 
  ActivityIndicator 
} from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useEvent from '../../hooks/useEvent';
import EventSelector from '../../components/EventSelector';

const EventSelectionScreen = ({ navigation }) => {
  const { events, loadEvents, selectEvent, isLoading } = useEvent();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (events) {
      filterEvents();
    }
  }, [events, searchQuery]);

  const filterEvents = () => {
    if (!searchQuery.trim()) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => 
        event.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  };

  const handleSelectEvent = async (event) => {
    if (!event.isActive) {
      return; // Don't allow selection of inactive events
    }

    await selectEvent(event);
    // Navigate to gate selection screen
    navigation.navigate('GateSelection');
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select an Event</Text>
        <Text style={styles.headerSubtitle}>Choose an active event to scan tickets for</Text>
      </View>

      <Searchbar
        placeholder="Search events..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {events.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="calendar" size={50} color="#95a5a6" />
          <Text style={styles.emptyText}>No events available</Text>
          <Text style={styles.emptySubText}>
            Please contact an administrator to create events
          </Text>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="search" size={50} color="#95a5a6" />
          <Text style={styles.emptyText}>No events match your search</Text>
          <Button onPress={() => setSearchQuery('')} mode="outlined" style={styles.clearButton}>
            Clear Search
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <EventSelector 
              event={item} 
              onSelect={handleSelectEvent} 
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ecf0f1',
    marginTop: 4,
  },
  searchBar: {
    margin: 16,
    backgroundColor: 'white',
  },
  list: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginVertical: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  clearButton: {
    marginTop: 20,
    borderColor: '#2c3e50',
  }
});

export default EventSelectionScreen;
