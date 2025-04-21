import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, SafeAreaView } from 'react-native';
import { 
  Text, 
  Button, 
  ActivityIndicator, 
  Banner,
  Chip
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useEvent } from '../contexts/EventContext';
import { useNetwork } from '../contexts/NetworkContext';
import QRScanner from '../components/QRScanner';
import OfflineNotice from '../components/OfflineNotice';
import PendingSyncBadge from '../components/PendingSyncBadge';
import * as ticketService from '../services/ticketService';
import * as asyncStorage from '../utils/asyncStorage';
import { Feather } from '@expo/vector-icons';

const ScannerScreen = () => {
  const navigation = useNavigation();
  const { selectedEvent, selectedGate } = useEvent();
  const { isConnected, pendingSyncCount, updatePendingSyncCount } = useNetwork();
  const [scanning, setScanning] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  const resetScanner = () => {
    setScanning(true);
    setError(null);
    
    // If we have a ref to the scanner component, call its reset method
    if (scannerRef.current && scannerRef.current.resetScanner) {
      scannerRef.current.resetScanner();
    }
  };

  useEffect(() => {
    // Check if we have a selected event and gate
    if (!selectedEvent) {
      Alert.alert(
        'No Event Selected',
        'Please select an event before scanning tickets.',
        [{ text: 'OK', onPress: () => navigation.navigate('EventSelection') }]
      );
    } else if (!selectedGate) {
      Alert.alert(
        'No Gate Selected',
        'Please select a gate before scanning tickets.',
        [{ text: 'OK', onPress: () => navigation.navigate('GateSelection') }]
      );
    }
  }, [selectedEvent, selectedGate]);

  const handleScan = async (data) => {
    try {
      if (!scanning || processing) return;
      
      // Stop scanner while processing
      setScanning(false);
      setProcessing(true);
      setError(null);
      
      // Extract ticket info from QR code
      let ticketInfo;
      try {
        ticketInfo = JSON.parse(data);
      } catch (err) {
        throw new Error('Invalid QR code format');
      }
      
      // Validate the ticket
      let validationResult;
      
      if (isConnected) {
        // If online, validate with the server
        validationResult = await ticketService.validateTicket(
          ticketInfo.id, 
          selectedEvent.id, 
          selectedGate.id
        );
      } else {
        // If offline, validate locally and queue for sync
        validationResult = await ticketService.validateTicketOffline(
          ticketInfo, 
          selectedEvent.id,
          selectedGate.id
        );
        
        // Store the check-in for later sync
        await asyncStorage.storePendingCheckIn({
          ticketId: ticketInfo.id,
          eventId: selectedEvent.id,
          gateId: selectedGate.id,
          timestamp: new Date().toISOString(),
          scannedData: data
        });
        
        // Update pending sync count
        await updatePendingSyncCount();
      }
      
      // Navigate to result screen
      navigation.navigate('ScanResult', {
        result: validationResult,
        ticketInfo,
        eventId: selectedEvent.id,
        gateName: selectedGate.name
      });
      
    } catch (err) {
      setError(err.message || 'Failed to validate ticket');
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedEvent || !selectedGate) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          {!selectedEvent 
            ? 'Please select an event first'
            : 'Please select a gate first'
          }
        </Text>
        <Button 
          mode="contained" 
          onPress={() => !selectedEvent 
            ? navigation.navigate('EventSelection')
            : navigation.navigate('GateSelection')
          }
          style={styles.actionButton}
        >
          {!selectedEvent ? 'Select Event' : 'Select Gate'}
        </Button>
      </View>
    );
  }

  if (!selectedGate.isEnabled) {
    return (
      <View style={styles.container}>
        <Feather name="slash" size={50} color="#F44336" />
        <Text style={styles.disabledText}>This gate is currently disabled</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('GateSelection')}
          style={styles.actionButton}
        >
          Change Gate
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isConnected && <OfflineNotice />}
      
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.eventName}>{selectedEvent?.name}</Text>
          <View style={styles.gateChip}>
            <Chip icon="map-marker">{selectedGate?.name}</Chip>
          </View>
        </View>
        <PendingSyncBadge count={pendingSyncCount} />
      </View>

      {error && (
        <Banner
          visible={!!error}
          actions={[
            {
              label: 'Dismiss',
              onPress: () => setError(null),
            },
            {
              label: 'Try Again',
              onPress: resetScanner,
            },
          ]}
          icon={({size}) => (
            <Feather name="alert-circle" size={size} color="#B00020" />
          )}
        >
          {error}
        </Banner>
      )}

      <View style={styles.scannerContainer}>
        {processing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.processingText}>Processing ticket...</Text>
          </View>
        ) : (
          <QRScanner 
            onScan={handleScan} 
            scanning={scanning} 
            ref={scannerRef}
          />
        )}
      </View>

      <View style={styles.footer}>
        <Button 
          mode="contained" 
          onPress={resetScanner}
          disabled={processing || scanning}
          style={styles.scanButton}
        >
          Scan Again
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  gateChip: {
    marginTop: 8,
  },
  scannerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    marginTop: 16,
    fontSize: 16,
  },
  footer: {
    padding: 16,
  },
  scanButton: {
    backgroundColor: '#1E88E5',
  },
  warningText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 32,
    marginBottom: 16,
  },
  actionButton: {
    marginHorizontal: 32,
    backgroundColor: '#1E88E5',
  },
  disabledText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default ScannerScreen;
