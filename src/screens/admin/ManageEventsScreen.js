import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  List, 
  Switch, 
  FAB, 
  Dialog, 
  Portal, 
  Button, 
  TextInput, 
  Title, 
  Paragraph,
  Divider,
  ActivityIndicator,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import useEvent from '../../hooks/useEvent';
import { 
  fetchEvents, 
  updateEventStatus, 
  createEvent, 
  deleteEvent 
} from '../../services/eventService';

const ManageEventsScreen = ({ navigation }) => {
  const { events, loadEvents } = useEvent();
  
  const [loading, setLoading] = useState(true);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Load events on mount
  useEffect(() => {
    loadEventsList();
  }, []);

  const loadEventsList = async () => {
    setLoading(true);
    try {
      await loadEvents();
    } catch (error) {
      console.error('Error loading events:', error);
      showSnackbar('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const toggleEventStatus = async (event) => {
    try {
      const response = await updateEventStatus(
        event.id,
        !event.isActive
      );
      
      if (response.success) {
        // Reload events list
        await loadEvents();
        
        showSnackbar(`Event ${event.name} ${!event.isActive ? 'activated' : 'deactivated'}`);
      } else {
        showSnackbar('Failed to update event status');
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      showSnackbar('Error updating event status');
    }
  };

  const handleCreateEvent = async () => {
    if (!newEventName.trim()) {
      showSnackbar('Please enter event name');
      return;
    }
    
    try {
      const response = await createEvent(
        newEventName.trim(),
        newEventDate.toISOString()
      );
      
      if (response.success) {
        // Reload events list
        await loadEvents();
        
        showSnackbar(`Event ${newEventName} created`);
        setCreateDialogVisible(false);
        setNewEventName('');
        setNewEventDate(new Date());
      } else {
        showSnackbar('Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      showSnackbar('Error creating event');
    }
  };

  const handleDeleteEvent = (event) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to delete ${event.name}? This will delete all gates and rules for this event.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteEvent(event.id);
              
              if (response.success) {
                // Reload events list
                await loadEvents();
                
                showSnackbar(`Event ${event.name} deleted`);
              } else {
                showSnackbar('Failed to delete event');
              }
            } catch (error) {
              console.error('Error deleting event:', error);
              showSnackbar('Error deleting event');
            }
          } 
        },
      ]
    );
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewEventDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString();
  };

  const handleManageGates = (event) => {
    navigation.navigate('ManageGates', { eventId: event.id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Manage Events</Title>
        <Divider style={styles.divider} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Paragraph>Loading events...</Paragraph>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#7f8c8d" />
          <Paragraph style={styles.emptyText}>No events found.</Paragraph>
          <Paragraph style={styles.emptySubtext}>
            Create events by pressing the + button below.
          </Paragraph>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`Date: ${new Date(item.date).toLocaleDateString()}`}
              left={(props) => <List.Icon {...props} icon="calendar" />}
              right={() => (
                <View style={styles.listItemRight}>
                  <Switch
                    value={item.isActive}
                    onValueChange={() => toggleEventStatus(item)}
                    color="#2c3e50"
                  />
                  <IconButton
                    icon="door"
                    size={24}
                    color="#3498db"
                    onPress={() => handleManageGates(item)}
                  />
                  <IconButton
                    icon="trash-can-outline"
                    size={24}
                    color="#e74c3c"
                    onPress={() => handleDeleteEvent(item)}
                  />
                </View>
              )}
              style={[
                styles.listItem,
                !item.isActive && styles.inactiveItem
              ]}
            />
          )}
          ItemSeparatorComponent={() => <Divider />}
          contentContainerStyle={styles.listContent}
        />
      )}

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setCreateDialogVisible(true)}
      />

      <Portal>
        <Dialog
          visible={createDialogVisible}
          onDismiss={() => setCreateDialogVisible(false)}
        >
          <Dialog.Title>Create New Event</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Event Name"
              value={newEventName}
              onChangeText={setNewEventName}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.datePickerContainer}>
              <Paragraph style={styles.dateLabel}>Event Date:</Paragraph>
              <Button 
                mode="outlined" 
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}
              >
                {formatDate(newEventDate)}
              </Button>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={newEventDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateEvent}>Create</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  divider: {
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: 'white',
  },
  inactiveItem: {
    backgroundColor: '#ecf0f1',
    opacity: 0.7,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2c3e50',
  },
  input: {
    marginBottom: 16,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  dateLabel: {
    marginRight: 8,
  },
  dateButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#95a5a6',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ManageEventsScreen;
