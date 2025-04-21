import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, SafeAreaView } from 'react-native';
import { 
  Text, 
  Card, 
  Title, 
  Button, 
  ActivityIndicator, 
  Chip,
  Divider,
  List
} from 'react-native-paper';
import { useNetwork } from '../contexts/NetworkContext';
import * as asyncStorage from '../utils/asyncStorage';
import OfflineNotice from '../components/OfflineNotice';
import { Feather } from '@expo/vector-icons';

const PendingSyncScreen = () => {
  const { isConnected, syncData, isSyncing, pendingSyncCount, updatePendingSyncCount } = useNetwork();
  const [pendingCheckIns, setPendingCheckIns] = useState([]);
  const [pendingGateChanges, setPendingGateChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingData();
  }, [pendingSyncCount]);

  const loadPendingData = async () => {
    try {
      setLoading(true);
      const checkIns = await asyncStorage.getPendingCheckIns();
      const gateChanges = await asyncStorage.getPendingGateStatusChanges();
      
      setPendingCheckIns(checkIns);
      setPendingGateChanges(gateChanges);
    } catch (err) {
      console.error("Error loading pending data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    await syncData();
    await loadPendingData();
  };

  const renderCheckInItem = ({ item }) => (
    <Card style={styles.item}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <Title>Ticket Check-in</Title>
          <Chip icon="clock" mode="outlined" compact>Pending</Chip>
        </View>
        <List.Item 
          title="Ticket ID"
          description={item.ticketId}
          left={props => <List.Icon {...props} icon="ticket" />}
        />
        <List.Item 
          title="Gate"
          description={item.gateId}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
        <List.Item 
          title="Timestamp"
          description={new Date(item.timestamp).toLocaleString()}
          left={props => <List.Icon {...props} icon="calendar-clock" />}
        />
      </Card.Content>
    </Card>
  );

  const renderGateChangeItem = ({ item }) => (
    <Card style={styles.item}>
      <Card.Content>
        <View style={styles.itemHeader}>
          <Title>Gate Status Change</Title>
          <Chip icon="clock" mode="outlined" compact>Pending</Chip>
        </View>
        <List.Item 
          title="Gate ID"
          description={item.gateId}
          left={props => <List.Icon {...props} icon="map-marker" />}
        />
        <List.Item 
          title="Status"
          description={item.enabled ? 'Enable' : 'Disable'}
          left={props => <List.Icon {...props} icon={item.enabled ? 'check-circle' : 'close-circle'} />}
        />
        <List.Item 
          title="Timestamp"
          description={new Date(item.timestamp).toLocaleString()}
          left={props => <List.Icon {...props} icon="calendar-clock" />}
        />
      </Card.Content>
    </Card>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Feather name="check-circle" size={48} color="#4CAF50" />
      <Text style={styles.emptyText}>No pending items to sync</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineNotice />}
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Pending Sync</Text>
          <Text style={styles.subtitle}>Items that need to be synced with server</Text>
        </View>
        <Chip 
          icon="database"
          mode="outlined"
          style={pendingSyncCount > 0 ? styles.pendingChip : styles.noPendingChip}
        >
          {pendingSyncCount} {pendingSyncCount === 1 ? 'item' : 'items'}
        </Chip>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E88E5" />
          <Text style={styles.loadingText}>Loading pending items...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={[...pendingCheckIns, ...pendingGateChanges]}
            renderItem={({ item }) => 
              item.ticketId ? renderCheckInItem({ item }) : renderGateChangeItem({ item })
            }
            keyExtractor={(item, index) => `pending-${index}`}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmptyComponent}
          />
          
          <View style={styles.footer}>
            <Button 
              mode="contained" 
              onPress={handleSync}
              disabled={!isConnected || isSyncing || pendingSyncCount === 0}
              loading={isSyncing}
              icon="sync"
              style={styles.syncButton}
            >
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
            <Button 
              mode="outlined" 
              onPress={loadPendingData}
              disabled={loading}
              icon="refresh"
              style={styles.refreshButton}
            >
              Refresh
            </Button>
          </View>
        </>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  pendingChip: {
    backgroundColor: '#FFF8E1',
  },
  noPendingChip: {
    backgroundColor: '#E8F5E9',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  item: {
    marginBottom: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  syncButton: {
    marginBottom: 8,
    backgroundColor: '#1E88E5',
  },
  refreshButton: {
    borderColor: '#1E88E5',
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
    marginTop: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default PendingSyncScreen;
