import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator 
} from 'react-native';
import { Searchbar, Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useEvent from '../../hooks/useEvent';
import GateSelector from '../../components/GateSelector';

const GateSelectionScreen = ({ navigation, route }) => {
  const { selectedEvent, gates, loadGates, selectGate, isLoading } = useEvent();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGates, setFilteredGates] = useState([]);

  useEffect(() => {
    if (selectedEvent) {
      loadGates(selectedEvent.id);
    } else {
      // Redirect to event selection if no event is selected
      navigation.navigate('EventSelection');
    }
  }, [selectedEvent]);

  useEffect(() => {
    if (gates) {
      filterGates();
    }
  }, [gates, searchQuery]);

  const filterGates = () => {
    if (!searchQuery.trim()) {
      setFilteredGates(gates);
    } else {
      const filtered = gates.filter(gate => 
        gate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gate.identifier.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredGates(filtered);
    }
  };

  const handleSelectGate = async (gate) => {
    if (!gate.isEnabled) {
      return; // Don't allow selection of disabled gates
    }

    const success = await selectGate(gate);
    if (success) {
      // Navigate to scanner screen
      navigation.navigate('Scanner');
    }
  };

  if (!selectedEvent) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="alert-circle" size={50} color="#e74c3c" />
        <Text style={styles.errorText}>No event selected</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('EventSelection')}
          style={styles.button}
        >
          Select Event
        </Button>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Loading gates...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.eventCard}>
        <Card.Content>
          <Title style={styles.eventName}>{selectedEvent.name}</Title>
          <Paragraph>
            {new Date(selectedEvent.date).toLocaleDateString()}
          </Paragraph>
        </Card.Content>
      </Card>

      <Searchbar
        placeholder="Search gates..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      {gates.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="map-pin" size={50} color="#95a5a6" />
          <Text style={styles.emptyText}>No gates available for this event</Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      ) : (
        <FlatList
          data={filteredGates}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <GateSelector
              gate={item}
              onSelect={handleSelectGate}
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
  eventCard: {
    margin: 16,
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    color: '#2c3e50',
  },
  searchBar: {
    margin: 16,
    marginTop: 8,
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
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    marginVertical: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginVertical: 10,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2c3e50',
  },
  backButton: {
    marginTop: 20,
    borderColor: '#2c3e50',
  }
});

export default GateSelectionScreen;
