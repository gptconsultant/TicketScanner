import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  ActivityIndicator, 
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, List, Divider } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useScan from '../../hooks/useScan';
import useOfflineSync from '../../hooks/useOfflineSync';
import NetworkStatus from '../../components/NetworkStatus';

const VolunteerCheckoutScreen = ({ navigation }) => {
  const { userInfo, endVolunteerShift, logout } = useAuth();
  const { scanStats, offlineCheckIns, isOnline, resetScanStats } = useScan();
  const { triggerSync, isSyncing } = useOfflineSync(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const handleCheckout = async () => {
    // Check if there are offline check-ins that need to be synced
    if (offlineCheckIns.length > 0 && isOnline) {
      Alert.alert(
        'Sync Required',
        'You have unsynced check-ins. Do you want to sync them before ending your shift?',
        [
          {
            text: 'Sync and Checkout',
            onPress: performSyncAndCheckout,
          },
          {
            text: 'Checkout without Syncing',
            onPress: performCheckout,
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else if (offlineCheckIns.length > 0 && !isOnline) {
      Alert.alert(
        'Warning',
        'You are offline and have unsynced check-ins. These will be lost if you logout now. Do you want to continue?',
        [
          {
            text: 'Checkout Anyway',
            onPress: performCheckout,
            style: 'destructive',
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } else {
      performCheckout();
    }
  };

  const performSyncAndCheckout = async () => {
    setCheckingOut(true);
    try {
      // Try to sync
      const syncResult = await triggerSync();
      if (syncResult.success) {
        // Now checkout
        await endVolunteerShift();
        setCheckoutComplete(true);
      } else {
        Alert.alert('Sync Failed', 'Unable to sync check-ins. Do you want to checkout anyway?', [
          {
            text: 'Checkout Anyway',
            onPress: performCheckout,
            style: 'destructive',
          },
          {
            text: 'Cancel',
            onPress: () => setCheckingOut(false),
            style: 'cancel',
          },
        ]);
      }
    } catch (error) {
      console.error('Error during sync and checkout:', error);
      Alert.alert('Error', 'An error occurred during checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  const performCheckout = async () => {
    setCheckingOut(true);
    try {
      await endVolunteerShift();
      setCheckoutComplete(true);
    } catch (error) {
      console.error('Error during checkout:', error);
      Alert.alert('Error', 'An error occurred during checkout. Please try again.');
      setCheckingOut(false);
    }
  };

  const handleLogout = async () => {
    try {
      await resetScanStats();
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'An error occurred during logout. Please try again.');
    }
  };

  const handleBackToScanning = () => {
    navigation.goBack();
  };

  if (checkingOut && !checkoutComplete) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.loadingText}>Processing checkout...</Text>
      </View>
    );
  }

  if (checkoutComplete) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="check-circle" size={80} color="#2ecc71" />
        <Title style={styles.completeTitle}>Shift Completed</Title>
        <Paragraph style={styles.completeParagraph}>
          Thank you for your volunteer work!
        </Paragraph>
        <Button 
          mode="contained" 
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="log-out"
        >
          Log Out
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <NetworkStatus />

      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>End Volunteer Shift</Title>
          <Paragraph>
            Complete your volunteer shift and log any important notes.
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <View style={styles.volunteerInfo}>
            <Feather name="user" size={24} color="#2c3e50" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.volunteerName}>{userInfo?.name || 'Volunteer'}</Text>
              <Text style={styles.volunteerRole}>Volunteer</Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <Title style={styles.sectionTitle}>Shift Summary</Title>
          
          <List.Item
            title="Total Tickets Scanned"
            right={() => <Text style={styles.statValue}>{scanStats.totalScans}</Text>}
            left={props => <List.Icon {...props} icon="counter" />}
          />
          <Divider />
          <List.Item
            title="Valid Tickets"
            right={() => <Text style={[styles.statValue, { color: '#2ecc71' }]}>{scanStats.validScans}</Text>}
            left={props => <List.Icon {...props} icon="check-circle" />}
          />
          <Divider />
          <List.Item
            title="Invalid Tickets"
            right={() => <Text style={[styles.statValue, { color: '#e74c3c' }]}>{scanStats.invalidScans}</Text>}
            left={props => <List.Icon {...props} icon="close-circle" />}
          />
          <Divider />
          <List.Item
            title="Unsynced Check-ins"
            right={() => <Text style={[styles.statValue, { color: '#f39c12' }]}>{offlineCheckIns.length}</Text>}
            left={props => <List.Icon {...props} icon="cloud-off-outline" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button 
          mode="contained" 
          onPress={handleCheckout}
          style={styles.checkoutButton}
          icon="check-circle"
          loading={checkingOut}
          disabled={checkingOut}
        >
          Complete Shift
        </Button>
        
        <Button 
          mode="outlined" 
          onPress={handleBackToScanning}
          style={styles.backButton}
          icon="camera"
          disabled={checkingOut}
        >
          Back to Scanning
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerCard: {
    margin: 16,
    backgroundColor: '#2c3e50',
  },
  headerTitle: {
    color: 'white',
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  volunteerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  volunteerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  volunteerRole: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 16,
    color: '#2c3e50',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  buttonContainer: {
    margin: 16,
    marginTop: 8,
  },
  checkoutButton: {
    marginBottom: 12,
    backgroundColor: '#2c3e50',
    paddingVertical: 6,
  },
  backButton: {
    borderColor: '#2c3e50',
    paddingVertical: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#7f8c8d',
  },
  completeTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 24,
    color: '#2c3e50',
  },
  completeParagraph: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 6,
  },
});

export default VolunteerCheckoutScreen;
