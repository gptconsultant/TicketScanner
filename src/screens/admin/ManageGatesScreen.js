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
} from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useEvent from '../../hooks/useEvent';
import { fetchGates, updateGateStatus, createGate, deleteGate } from '../../services/eventService';

const ManageGatesScreen = ({ route, navigation }) => {
  const { events, selectedEvent, selectEvent } = useEvent();
  
  const [gates, setGates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createDialogVisible, setCreateDialogVisible] = useState(false);
  const [newGateName, setNewGateName] = useState('');
  const [newGateIdentifier, setNewGateIdentifier] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // If eventId is passed in route params, select that event
  useEffect(() => {
    if (route.params?.eventId) {
      const event = events.find(e => e.id === route.params.eventId);
      if (event) {
        selectEvent(event);
      }
    }
  }, [route.params, events]);

  // Load gates for the selected event
  useEffect(() => {
    if (selectedEvent) {
      loadGates();
    }
  }, [selectedEvent]);

  const loadGates = async () => {
    if (!selectedEvent) return;
    
    setLoading(true);
    try {
      const response = await fetchGates(selectedEvent.id);
      if (response.success) {
        setGates(response.data);
      } else {
        showSnackbar('Failed to load gates');
      }
    } catch (error) {
      console.error('Error loading gates:', error);
      showSnackbar('Error loading gates');
    } finally {
      setLoading(false);
    }
  };

  const toggleGateStatus = async (gate) => {
    try {
      const response = await updateGateStatus(
        selectedEvent.id,
        gate.id,
        !gate.isEnabled
      );
      
      if (response.success) {
        // Update local state
        setGates(gates.map(g => 
          g.id === gate.id ? { ...g, isEnabled: !g.isEnabled } : g
        ));
        
        showSnackbar(`Gate ${gate.name} ${!gate.isEnabled ? 'enabled' : 'disabled'}`);
      } else {
        showSnackbar('Failed to update gate status');
      }
    } catch (error) {
      console.error('Error updating gate status:', error);
      showSnackbar('Error updating gate status');
    }
  };

  const handleCreateGate = async () => {
    if (!newGateName.trim() || !newGateIdentifier.trim()) {
      showSnackbar('Please enter both name and identifier');
      return;
    }
    
    try {
      const response = await createGate(
        selectedEvent.id,
        newGateName.trim(),
        newGateIdentifier.trim()
      );
      
      if (response.success) {
        setGates([...gates, response.data]);
        showSnackbar(`Gate ${newGateName} created`);
        setCreateDialogVisible(false);
        setNewGateName('');
        setNewGateIdentifier('');
      } else {
        showSnackbar('Failed to create gate');
      }
    } catch (error) {
      console.error('Error creating gate:', error);
      showSnackbar('Error creating gate');
    }
  };

  const handleDeleteGate = (gate) => {
    Alert.alert(
      'Delete Gate',
      `Are you sure you want to delete ${gate.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await deleteGate(selectedEvent.id, gate.id);
              
              if (response.success) {
                setGates(gates.filter(g => g.id !== gate.id));
                showSnackbar(`Gate ${gate.name} deleted`);
              } else {
                showSnackbar('Failed to delete gate');
              }
            } catch (error) {
              console.error('Error deleting gate:', error);
              showSnackbar('Error deleting gate');
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

  if (!selectedEvent) {
    return (
      <View style={styles.placeholderContainer}>
        <Title>No Event Selected</Title>
        <Paragraph>Please select an event first</Paragraph>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Dashboard')}
          style={{ marginTop: 20 }}
        >
          Go to Dashboard
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Managing Gates for:</Title>
        <Paragraph style={styles.eventName}>{selectedEvent.name}</Paragraph>
        <Divider style={styles.divider} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2c3e50" />
          <Paragraph>Loading gates...</Paragraph>
        </View>
      ) : gates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="map-pin" size={48} color="#7f8c8d" />
          <Paragraph style={styles.emptyText}>No gates found for this event.</Paragraph>
          <Paragraph style={styles.emptySubtext}>
            Create gates by pressing the + button below.
          </Paragraph>
        </View>
      ) : (
        <FlatList
          data={gates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={`ID: ${item.identifier}`}
              left={(props) => <List.Icon {...props} icon="map-pin" />}
              right={() => (
                <View style={styles.listItemRight}>
                  <Switch
                    value={item.isEnabled}
                    onValueChange={() => toggleGateStatus(item)}
                    color="#2c3e50"
                  />
                  <Feather 
                    name="trash-2" 
                    size={24} 
                    color="#e74c3c" 
                    style={styles.deleteIcon}
                    onPress={() => handleDeleteGate(item)}
                  />
                </View>
              )}
              style={[
                styles.listItem,
                !item.isEnabled && styles.disabledItem
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
          <Dialog.Title>Create New Gate</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Gate Name"
              value={newGateName}
              onChangeText={setNewGateName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Gate Identifier (e.g. 'Gate A')"
              value={newGateIdentifier}
              onChangeText={setNewGateIdentifier}
              mode="outlined"
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCreateDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCreateGate}>Create</Button>
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
    fontSize: 16,
    color: '#7f8c8d',
  },
  eventName: {
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
  disabledItem: {
    backgroundColor: '#ecf0f1',
    opacity: 0.7,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    marginLeft: 16,
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
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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

export default ManageGatesScreen;
