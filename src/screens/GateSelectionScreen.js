import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { 
  Card, 
  Title, 
  Button, 
  ActivityIndicator, 
  Text,
  Chip,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNetwork } from '../contexts/NetworkContext';
import OfflineNotice from '../components/OfflineNotice';
import { Feather } from '@expo/vector-icons';

const GateSelectionScreen = () => {
  const navigation = useNavigation();
  const { selectedEvent, gates, loadGates, selectGate, selectedGate, loading, error } = useEvent();
  const { user } = useAuth();
  const { isConnected } = useNetwork();
  
  useEffect(() => {
    if (selectedEvent && selectedEvent.id) {
      loadGates(selectedEvent.id);
    } else {
      // If no event is selected, navigate to event selection
      navigation.navigate('EventSelection');
    }
  }, [selectedEvent]);

  const handleSelectGate = async (gate) => {
    await selectGate(gate);
    
    // Navigate to scanner tab
    navigation.navigate('ScannerTab');
  };

  const renderGateItem = ({ item }) => (
    <Card 
      style={[
        styles.gateCard, 
        selectedGate?.id === item.id && styles.selectedGateCard,
        !item.isEnabled && styles.disabledGateCard
      ]} 
      onPress={() => handleSelectGate(item)}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.name}</Title>
          {item.isEnabled ? (
            <Chip icon="check-circle" mode="outlined" style={styles.enabledChip}>
              Enabled
            </Chip>
          ) : (
            <Chip icon="close-circle" mode="outlined" style={styles.disabledChip}>
              Disabled
            </Chip>
          )}
        </View>
        <Text style={styles.gateDescription}>{item.description || 'No description'}</Text>
      </Card.Content>
      <Card.Actions>
        <Button 
          mode={selectedGate?.id === item.id ? "contained" : "outlined"} 
          onPress={() => handleSelectGate(item)}
          disabled={!item.isEnabled}
        >
          {selectedGate?.id === item.id ? "Selected" : "Select"}
        </Button>
      </Card.Actions>
    </Card>
  );

  if (!selectedEvent) {
    return (
      <View style={styles.container}>
        <View style={styles.noEventContainer}>
          <Feather name="calendar" size={48} color="#757575" />
          <Text style={styles.noEventText}>No event selected</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.navigate('EventSelection')}
            style={styles.selectEventButton}
          >
            Select Event
          </Button>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineNotice />}
      
      <View style={styles.header}>
        <Text style={styles.eventName}>{selectedEvent?.name}</Text>
        <Text style={styles.selectGatePrompt}>Select a gate to start scanning</Text>
      </View>
      
      <Divider />
      
      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={24} color="#B00020" />
          <Text style={styles.errorText}>{error}</Text>
          <Button 
            mode="contained" 
            onPress={() => loadGates(selectedEvent.id)} 
            style={styles.retryButton}
          >
            Retry
          </Button>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Loading gates...</Text>
        </View>
      ) : gates.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="map-pin" size={48} color="#757575" />
          <Text style={styles.emptyText}>No gates available for this event</Text>
        </View>
      ) : (
        <FlatList
          data={gates}
          renderItem={renderGateItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectGatePrompt: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  gateCard: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedGateCard: {
    borderWidth: 2,
    borderColor: '#1E88E5',
  },
  disabledGateCard: {
    opacity: 0.7,
    backgroundColor: '#F5F5F5',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gateDescription: {
    color: '#666',
  },
  enabledChip: {
    backgroundColor: '#E8F5E9',
  },
  disabledChip: {
    backgroundColor: '#FFEBEE',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#B00020',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#1E88E5',
  },
  noEventContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  noEventText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    marginBottom: 16,
  },
  selectEventButton: {
    backgroundColor: '#1E88E5',
  },
});

export default GateSelectionScreen;
