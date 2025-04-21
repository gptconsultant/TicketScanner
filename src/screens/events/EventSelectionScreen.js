import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Paragraph, 
  ActivityIndicator, 
  Button, 
  Headline,
  Subheading,
  Searchbar,
  Chip,
  Divider
} from 'react-native-paper';
import { useEvent } from '../../contexts/EventContext';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import GateSelector from '../../components/GateSelector';

const EventSelectionScreen = () => {
  const { 
    events, 
    selectedEvent, 
    changeEvent, 
    loading, 
    error,
    refreshEvents
  } = useEvent();
  
  const { isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  
  useEffect(() => {
    if (events) {
      if (searchQuery) {
        setFilteredEvents(
          events.filter(event => 
            event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase())
          )
        );
      } else {
        setFilteredEvents(events);
      }
    }
  }, [events, searchQuery]);
  
  const handleRefresh = () => {
    refreshEvents();
  };
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const renderEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now < startDate) {
      return <Chip icon="clock" style={styles.upcomingChip}>Upcoming</Chip>;
    } else if (now > endDate) {
      return <Chip icon="check" style={styles.completedChip}>Completed</Chip>;
    } else {
      return <Chip icon="star" style={styles.activeChip}>Active</Chip>;
    }
  };
  
  const renderEventItem = ({ item }) => {
    const isSelected = selectedEvent && selectedEvent.id === item.id;
    
    return (
      <TouchableOpacity onPress={() => changeEvent(item)} activeOpacity={0.8}>
        <Card 
          style={[
            styles.eventCard, 
            isSelected && styles.selectedCard
          ]}
        >
          <Card.Content>
            <View style={styles.eventHeader}>
              <Title style={styles.eventTitle}>{item.name}</Title>
              {renderEventStatus(item)}
            </View>
            
            <Paragraph style={styles.location}>
              <Feather name="map-pin" size={14} />
              {' '}{item.location}
            </Paragraph>
            
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Start</Text>
                <Text style={styles.dateValue}>
                  {formatDate(item.startDate)}
                </Text>
              </View>
              
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>End</Text>
                <Text style={styles.dateValue}>
                  {formatDate(item.endDate)}
                </Text>
              </View>
            </View>
            
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Feather name="check-circle" size={24} color="#1E88E5" />
                <Text style={styles.selectedText}>Selected</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Headline style={styles.screenTitle}>Events</Headline>
        <Searchbar
          placeholder="Search events..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>
      
      {selectedEvent && (
        <Card style={styles.currentEventCard}>
          <Card.Content>
            <Subheading style={styles.currentEventLabel}>Current Selection</Subheading>
            <Title style={styles.currentEventTitle}>{selectedEvent.name}</Title>
            
            <Divider style={styles.divider} />
            
            <GateSelector />
          </Card.Content>
        </Card>
      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={handleRefresh} 
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#757575" />
          <Text style={styles.emptyText}>
            {searchQuery 
              ? "No events match your search" 
              : "No events available"}
          </Text>
          <Button 
            mode="contained" 
            onPress={handleRefresh} 
            style={styles.refreshButton}
          >
            Refresh
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={handleRefresh}
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#f1f3f4',
  },
  currentEventCard: {
    margin: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#1E88E5',
  },
  currentEventLabel: {
    color: '#5f6368',
    fontSize: 14,
  },
  currentEventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  listContainer: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 12,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#1E88E5',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    flex: 1,
    fontSize: 18,
  },
  location: {
    color: '#5f6368',
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#5f6368',
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
  },
  selectedText: {
    marginLeft: 8,
    color: '#1E88E5',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#F44336',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 16,
    color: '#757575',
    textAlign: 'center',
  },
  refreshButton: {
    marginTop: 16,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  upcomingChip: {
    backgroundColor: '#E3F2FD',
  },
  completedChip: {
    backgroundColor: '#ECEFF1',
  },
});

export default EventSelectionScreen;
