import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Button, Divider, List } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useEvent from '../../hooks/useEvent';
import NetworkStatus from '../../components/NetworkStatus';
import SyncStatus from '../../components/SyncStatus';

const DashboardScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const { events, gates, loadEvents, isLoading } = useEvent();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const activeEventsCount = events.filter(event => event.isActive).length;
  const totalGatesCount = gates.length;
  const enabledGatesCount = gates.filter(gate => gate.isEnabled).length;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Card style={styles.welcomeCard}>
          <Card.Content>
            <Title>Welcome, {userInfo?.name || 'Admin'}</Title>
            <Paragraph>Admin Dashboard for Event Ticket Scanner</Paragraph>
          </Card.Content>
        </Card>

        <NetworkStatus />
        <SyncStatus />

        <Card style={styles.statsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Event Statistics</Title>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Feather name="calendar" size={32} color="#3498db" />
                <Text style={styles.statNumber}>{events.length}</Text>
                <Text style={styles.statLabel}>Total Events</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="activity" size={32} color="#2ecc71" />
                <Text style={styles.statNumber}>{activeEventsCount}</Text>
                <Text style={styles.statLabel}>Active Events</Text>
              </View>
              <View style={styles.statItem}>
                <Feather name="map-pin" size={32} color="#9b59b6" />
                <Text style={styles.statNumber}>{totalGatesCount}</Text>
                <Text style={styles.statLabel}>Total Gates</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.actionCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Actions</Title>
            <View style={styles.buttonGroup}>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('ManageEvents')}
                style={styles.actionButton}
                icon="calendar"
              >
                Manage Events
              </Button>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('ManageGates')}
                style={styles.actionButton}
                icon="map-pin"
              >
                Manage Gates
              </Button>
              <Button 
                mode="contained" 
                onPress={() => navigation.navigate('ManageRules')}
                style={styles.actionButton}
                icon="shield"
              >
                Manage Rules
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.activeEventsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Active Events</Title>
            {events.filter(event => event.isActive).length > 0 ? (
              events
                .filter(event => event.isActive)
                .map(event => (
                  <List.Item
                    key={event.id}
                    title={event.name}
                    description={`Date: ${new Date(event.date).toLocaleDateString()}`}
                    left={props => <List.Icon {...props} icon="calendar" />}
                    right={props => <Feather name="chevron-right" size={24} color="#7f8c8d" />}
                    onPress={() => navigation.navigate('ManageGates', { eventId: event.id })}
                    style={styles.listItem}
                  />
                ))
            ) : (
              <Paragraph style={styles.emptyText}>No active events found.</Paragraph>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.quickActions}>
          <Card.Content>
            <Title style={styles.cardTitle}>Quick Actions</Title>
            <Button 
              mode="outlined" 
              onPress={() => navigation.navigate('Scan')}
              style={styles.quickButton}
              icon="camera"
            >
              Go to Scanner
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContent: {
    padding: 16,
  },
  welcomeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  activeEventsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  quickActions: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: '#2c3e50',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  buttonGroup: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 10,
    backgroundColor: '#2c3e50',
  },
  listItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 16,
    color: '#7f8c8d',
  },
  quickButton: {
    marginTop: 8,
    borderColor: '#2c3e50',
  },
});

export default DashboardScreen;
