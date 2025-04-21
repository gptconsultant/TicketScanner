import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  SafeAreaView,
  Alert,
  BackHandler,
} from 'react-native';
import { Button, Banner } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useAuth from '../../hooks/useAuth';
import useEvent from '../../hooks/useEvent';
import useScan from '../../hooks/useScan';
import Scanner from '../../components/Scanner';
import TicketValidationResult from '../../components/TicketValidationResult';
import NetworkStatus from '../../components/NetworkStatus';
import OfflineAlert from '../../components/OfflineAlert';

const VolunteerScannerScreen = ({ navigation }) => {
  const { userInfo, checkVolunteerShift, startVolunteerShift } = useAuth();
  const { selectedEvent, selectedGate } = useEvent();
  const { 
    lastScanResult, 
    resetScan, 
    scanStats, 
    isOnline,
  } = useScan();
  const [shiftStarted, setShiftStarted] = useState(false);
  const [showShiftBanner, setShowShiftBanner] = useState(false);

  useEffect(() => {
    // Check if volunteer is already on shift
    const isOnShift = checkVolunteerShift();
    setShiftStarted(isOnShift);
    
    if (!isOnShift) {
      setShowShiftBanner(true);
    }

    // Handle back button press
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => backHandler.remove();
  }, []);

  // Reset scan result when component is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetScan();
    });

    return unsubscribe;
  }, [navigation]);

  const handleBackPress = () => {
    // Show confirmation dialog if user tries to go back
    if (shiftStarted) {
      Alert.alert(
        'End Shift',
        'Are you sure you want to end your shift? You will need to check out.',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'End Shift',
            onPress: () => navigation.navigate('Checkout'),
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
      return true; // Prevent default back action
    }
    return false; // Allow default back action
  };

  const handleStartShift = async () => {
    await startVolunteerShift();
    setShiftStarted(true);
    setShowShiftBanner(false);
  };

  const handleEndShift = () => {
    navigation.navigate('Checkout');
  };

  const viewTicketDetails = () => {
    if (lastScanResult && lastScanResult.ticket) {
      navigation.navigate('TicketDetails', { 
        ticket: lastScanResult.ticket,
        scanResult: lastScanResult
      });
    }
  };

  // Check if we have event and gate selected
  if (!selectedEvent || !selectedGate) {
    return (
      <View style={styles.placeholderContainer}>
        <Feather name="alert-circle" size={64} color="#e74c3c" />
        <Text style={styles.placeholderText}>Setup Required</Text>
        <Text style={styles.placeholderSubtext}>
          Please select an event and gate before scanning tickets.
        </Text>
        <Button 
          mode="contained" 
          style={styles.placeholderButton}
          onPress={() => navigation.navigate('EventSelection')}
        >
          Select Event
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <NetworkStatus />
      {!isOnline && <OfflineAlert />}
      
      <Banner
        visible={showShiftBanner}
        actions={[
          {
            label: 'Start Shift',
            onPress: handleStartShift,
          },
        ]}
        icon={({ size }) => (
          <Feather name="clock" size={size} color="#e67e22" />
        )}
      >
        Please start your volunteer shift before scanning tickets.
      </Banner>

      <View style={styles.infoContainer}>
        <Text style={styles.eventText}>
          Event: {selectedEvent?.name || 'Unknown'}
        </Text>
        <Text style={styles.gateText}>
          Gate: {selectedGate?.name || 'Unknown'}
        </Text>
        <Text style={styles.volunteerText}>
          Volunteer: {userInfo?.name || 'Unknown'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{scanStats.totalScans}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#2ecc71' }]}>
            {scanStats.validScans}
          </Text>
          <Text style={styles.statLabel}>Valid</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#e74c3c' }]}>
            {scanStats.invalidScans}
          </Text>
          <Text style={styles.statLabel}>Invalid</Text>
        </View>
      </View>

      {lastScanResult ? (
        <View style={styles.resultContainer}>
          <TicketValidationResult 
            result={lastScanResult} 
            onViewDetails={viewTicketDetails}
            onRescan={() => resetScan()}
            showOverrideButton={false} // No override for volunteers
          />
        </View>
      ) : (
        <Scanner 
          onScanComplete={resetScan} 
          disabled={!shiftStarted}
        />
      )}

      {shiftStarted && (
        <Button
          mode="contained"
          icon="clock"
          onPress={handleEndShift}
          style={styles.endShiftButton}
        >
          End Shift
        </Button>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  infoContainer: {
    backgroundColor: '#2c3e50',
    padding: 12,
    alignItems: 'center',
  },
  eventText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  gateText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 4,
  },
  volunteerText: {
    color: '#bdc3c7',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  endShiftButton: {
    margin: 16,
    backgroundColor: '#e74c3c',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  placeholderButton: {
    backgroundColor: '#2c3e50',
  },
});

export default VolunteerScannerScreen;
