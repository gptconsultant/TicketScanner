import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { 
  Card, 
  Title, 
  Paragraph, 
  Button, 
  ActivityIndicator, 
  Text,
  IconButton,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNetwork } from '../contexts/NetworkContext';
import OfflineNotice from '../components/OfflineNotice';
import PendingSyncBadge from '../components/PendingSyncBadge';
import { Feather } from '@expo/vector-icons';

const EventSelectionScreen = () => {
  const navigation = useNavigation();
  const { events, loadEvents, selectedEvent, selectEvent, loading, error } = useEvent();
  const { user, logout } = useAuth();
  const { isConnected, pendingSyncCount } = useNetwork();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  const handleSelectEvent = async (event) => {
    await selectEvent(event);
    navigation.navigate('Main');
  };

  const renderEventItem = ({ item }) => (
    <Card style={styles.eventCard} onPress={() => handleSelectEvent(item)}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Date: {new Date(item.date).toLocaleDateString()}</Paragraph>
        <Paragraph>Location: {item.location}</Paragraph>
        {item.isActive 
          ? <Text style={styles.activeEvent}>Active</Text> 
          : <Text style={styles.inactiveEvent}>Inactive</Text>
        }
      </Card.Content>
      <Card.Actions>
        <Button 
          mode="contained" 
          onPress={() => handleSelectEvent(item)}
          disabled={!item.isActive}
        >
          Select
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
          <Text style={styles.roleText}>{user?.role}</Text>
        </View>
        <View style={styles.headerActions}>
          <PendingSyncBadge count={pendingSyncCount} />
          <IconButton 
            icon="logout" 
            size={24} 
            onPress={logout} 
            color="#1E88E5"
          />
        </View>
      </View>
      
      <Divider />
      
      {!isConnected && <OfflineNotice />}
      
      <Title style={styles.title}>Select Event</Title>
      
      {error ? (
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={24} color="#B00020" />
          <Text style={styles.errorText}>{error}</Text>
          <Button mode="contained" onPress={loadEvents} style={styles.retryButton}>
            Retry
          </Button>
        </View>
      ) : loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#757575" />
          <Text style={styles.emptyText}>No events available</Text>
          <Button mode="contained" onPress={loadEvents} style={styles.refreshButton}>
            Refresh
          </Button>
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  userInfo: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  roleText: {
    fontSize: 14,
    color: '#666',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
    marginBottom: 16,
    elevation: 2,
  },
  activeEvent: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 8,
  },
  inactiveEvent: {
    color: '#F44336',
    fontWeight: 'bold',
    marginTop: 8,
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
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 16,
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
});

export default EventSelectionScreen;
