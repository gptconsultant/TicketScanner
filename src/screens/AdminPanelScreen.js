import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Title, 
  Switch, 
  Divider, 
  List, 
  ActivityIndicator,
  Dialog,
  Portal,
  Paragraph
} from 'react-native-paper';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { useNetwork } from '../contexts/NetworkContext';
import OfflineNotice from '../components/OfflineNotice';
import AdminGateControl from '../components/AdminGateControl';
import { Feather } from '@expo/vector-icons';

const AdminPanelScreen = () => {
  const { selectedEvent, gates, updateGateStatus, loading } = useEvent();
  const { user, checkOut } = useAuth();
  const { isConnected, syncData, isSyncing } = useNetwork();
  const [checkOutDialogVisible, setCheckOutDialogVisible] = useState(false);

  // Check if user has admin permissions
  const isAdmin = user?.role === 'Admin';
  const isStaff = user?.role === 'Staff'; // Staff can also access some admin features

  const handleForceSync = () => {
    if (isConnected) {
      syncData();
    }
  };

  const handleCheckOut = async () => {
    await checkOut();
    setCheckOutDialogVisible(false);
  };

  if (!isAdmin && !isStaff) {
    return (
      <View style={styles.container}>
        <View style={styles.unauthorizedContainer}>
          <Feather name="lock" size={48} color="#757575" />
          <Text style={styles.unauthorizedText}>
            You do not have permission to access the admin panel.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineNotice />}

      <View style={styles.header}>
        <Text style={styles.title}>Admin Panel</Text>
        <Text style={styles.subtitle}>Manage gates and settings</Text>
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>User Information</Title>
            <List.Item 
              title="Name"
              description={user?.name}
              left={props => <List.Icon {...props} icon="account" />}
            />
            <List.Item 
              title="Role"
              description={user?.role}
              left={props => <List.Icon {...props} icon="shield-account" />}
            />
            <List.Item 
              title="User ID"
              description={user?.id}
              left={props => <List.Icon {...props} icon="identifier" />}
            />
          </Card.Content>
        </Card>

        {selectedEvent ? (
          <Card style={styles.card}>
            <Card.Content>
              <Title>Event: {selectedEvent.name}</Title>
              <Divider style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Gate Management</Text>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#1E88E5" />
                  <Text style={styles.loadingText}>Loading gates...</Text>
                </View>
              ) : gates.length === 0 ? (
                <Text style={styles.noGatesText}>No gates available for this event</Text>
              ) : (
                gates.map(gate => (
                  <AdminGateControl 
                    key={gate.id} 
                    gate={gate} 
                    onToggle={(enabled) => updateGateStatus(gate.id, enabled)}
                    isAdmin={isAdmin} // Only true admins can enable/disable gates
                  />
                ))
              )}
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Title>No Event Selected</Title>
              <Paragraph>Please select an event to manage gates.</Paragraph>
            </Card.Content>
          </Card>
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Title>System Actions</Title>
            <View style={styles.actionButtons}>
              <Button 
                mode="contained" 
                onPress={handleForceSync}
                loading={isSyncing}
                disabled={!isConnected || isSyncing}
                style={styles.actionButton}
                icon="sync"
              >
                Force Sync
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setCheckOutDialogVisible(true)}
                style={styles.actionButton}
                icon="logout-variant"
              >
                Check Out
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog
          visible={checkOutDialogVisible}
          onDismiss={() => setCheckOutDialogVisible(false)}
        >
          <Dialog.Title>Check Out Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Are you sure you want to check out? This will reset your current session but keep you logged in.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setCheckOutDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleCheckOut}>Check Out</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  gateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  gateName: {
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  noGatesText: {
    fontStyle: 'italic',
    color: '#666',
    marginVertical: 8,
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 8,
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  unauthorizedText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default AdminPanelScreen;
