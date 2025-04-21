import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Alert, 
  Vibration, 
  Dimensions,
  Animated,
  Modal
} from 'react-native';
import { 
  Text, 
  Surface, 
  Button, 
  Title, 
  FAB,
  ActivityIndicator, 
  Headline, 
  Card,
  Chip
} from 'react-native-paper';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Feather } from '@expo/vector-icons';
import { useEvent } from '../../contexts/EventContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNetwork } from '../../contexts/NetworkContext';
import { validateTicket } from '../../services/ticketService';
import TicketResultCard from '../../components/TicketResultCard';
import OfflineBanner from '../../components/OfflineBanner';
import GateSelector from '../../components/GateSelector';

const ScannerScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showGateModal, setShowGateModal] = useState(false);
  
  const { selectedEvent, selectedGate, isGateEnabled } = useEvent();
  const { user } = useAuth();
  const { isOnline, addPendingAction } = useNetwork();
  
  const scannerAnimatedValue = useRef(new Animated.Value(0)).current;
  const scannerAnimation = useRef(null);
  
  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  
  // Check if we need to select a gate
  useEffect(() => {
    if (selectedEvent && !selectedGate) {
      setShowGateModal(true);
    } else {
      setShowGateModal(false);
    }
  }, [selectedEvent, selectedGate]);
  
  // Start or stop the scanner line animation
  useEffect(() => {
    if (scanning && !scanned) {
      scannerAnimatedValue.setValue(0);
      scannerAnimation.current = Animated.loop(
        Animated.timing(scannerAnimatedValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      scannerAnimation.current.start();
    } else if (scannerAnimation.current) {
      scannerAnimation.current.stop();
    }
    
    return () => {
      if (scannerAnimation.current) {
        scannerAnimation.current.stop();
      }
    };
  }, [scanning, scanned, scannerAnimatedValue]);
  
  const handleBarCodeScanned = async ({ type, data }) => {
    if (processing || scanned) return;
    
    setScanned(true);
    setProcessing(true);
    Vibration.vibrate(200);
    
    try {
      // Parse the QR code data
      let ticketData;
      try {
        ticketData = JSON.parse(data);
      } catch (error) {
        // If not JSON, treat as a ticket ID
        ticketData = { id: data };
      }
      
      if (!ticketData.id) {
        throw new Error('Invalid ticket format');
      }
      
      // Validate the ticket
      const result = await validateTicket({
        ticketId: ticketData.id,
        eventId: selectedEvent?.id,
        gateId: selectedGate?.id,
        userId: user?.id,
        isOnline
      });
      
      // Save the scan result
      if (!isOnline) {
        // Store for offline sync
        await addPendingAction({
          type: 'TICKET_SCAN',
          id: `scan_${Date.now()}`,
          payload: {
            ticketId: ticketData.id,
            eventId: selectedEvent?.id,
            gateId: selectedGate?.id,
            scannedAt: new Date().toISOString(),
            userId: user?.id
          }
        });
      }
      
      setTicket(result);
    } catch (error) {
      console.error('Scan error:', error);
      setTicket({
        isValid: false,
        message: error.message || 'Failed to process ticket',
        error: true
      });
    } finally {
      setProcessing(false);
    }
  };
  
  const resetScanner = () => {
    setScanned(false);
    setTicket(null);
  };
  
  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };
  
  const toggleScanning = () => {
    if (!scanning) {
      setScanning(true);
      resetScanner();
    } else {
      setScanning(false);
    }
  };
  
  const translateY = scannerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });
  
  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="camera-off" size={64} color="#F44336" />
        <Text style={styles.permissionText}>
          Camera access is required to scan tickets
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Settings')}
          style={styles.permissionButton}
        >
          Go to Settings
        </Button>
      </View>
    );
  }
  
  if (!selectedEvent) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="calendar" size={64} color="#F44336" />
        <Text style={styles.permissionText}>
          Please select an event first
        </Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Events')}
          style={styles.permissionButton}
        >
          Select Event
        </Button>
      </View>
    );
  }
  
  if (!isGateEnabled) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="x-circle" size={64} color="#F44336" />
        <Text style={styles.permissionText}>
          This scanning point is currently disabled
        </Text>
        <Button 
          mode="contained" 
          onPress={() => setShowGateModal(true)}
          style={styles.permissionButton}
        >
          Change Gate
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfflineBanner />
      
      <View style={styles.eventInfoBar}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>{selectedEvent?.name}</Text>
          <Chip 
            icon="map-marker" 
            style={styles.gateChip}
            onPress={() => setShowGateModal(true)}
          >
            {selectedGate?.name || 'Select Gate'}
          </Chip>
        </View>
      </View>
      
      {scanning ? (
        <View style={styles.scannerContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            flashMode={
              flashOn 
                ? Camera.Constants.FlashMode.torch 
                : Camera.Constants.FlashMode.off
            }
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.scannerFrameContainer}>
                <View style={styles.scannerFrame}>
                  {!scanned && (
                    <Animated.View 
                      style={[
                        styles.scannerLine,
                        {
                          transform: [{ translateY }],
                        },
                      ]}
                    />
                  )}
                </View>
                
                <Text style={styles.scannerText}>
                  {processing
                    ? 'Processing...'
                    : scanned
                    ? 'Scan Complete'
                    : 'Scanning for QR Code...'}
                </Text>
              </View>
            </View>
          </Camera>
          
          <View style={styles.controlsContainer}>
            <FAB
              style={[styles.controlButton, flashOn && styles.activeButton]}
              icon="flash"
              onPress={toggleFlash}
              color={flashOn ? '#fff' : '#757575'}
            />
            
            <FAB
              style={styles.stopButton}
              icon="close"
              onPress={toggleScanning}
              color="#fff"
            />
          </View>
        </View>
      ) : (
        <View style={styles.startScanContainer}>
          <Surface style={styles.startScanSurface}>
            <Feather name="camera" size={64} color="#1E88E5" />
            <Headline style={styles.startScanTitle}>
              Ready to Scan Tickets
            </Headline>
            <Text style={styles.startScanText}>
              Tap the button below to start scanning QR codes on tickets
            </Text>
            <Button
              mode="contained"
              icon="camera"
              onPress={toggleScanning}
              style={styles.startScanButton}
            >
              Start Scanning
            </Button>
          </Surface>
        </View>
      )}
      
      {/* Ticket Result Modal */}
      {ticket && (
        <TicketResultCard
          ticket={ticket}
          onClose={resetScanner}
          onContinueScanning={() => {
            resetScanner();
            setScanning(true);
          }}
        />
      )}
      
      {/* Gate Selection Modal */}
      <Modal
        visible={showGateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          if (selectedGate) {
            setShowGateModal(false);
          }
        }}
      >
        <View style={styles.modalContainer}>
          <Surface style={styles.modalContent}>
            <Title style={styles.modalTitle}>Select Scanning Point</Title>
            <GateSelector onSelect={() => setShowGateModal(false)} />
            
            {selectedGate && (
              <Button
                mode="contained"
                onPress={() => setShowGateModal(false)}
                style={styles.doneButton}
              >
                Done
              </Button>
            )}
          </Surface>
        </View>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');
const scanFrameSize = width * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
    color: '#5f6368',
  },
  permissionButton: {
    marginTop: 16,
  },
  eventInfoBar: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  gateChip: {
    backgroundColor: '#E3F2FD',
  },
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrameContainer: {
    alignItems: 'center',
  },
  scannerFrame: {
    width: scanFrameSize,
    height: scanFrameSize,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scannerLine: {
    height: 3,
    width: '100%',
    backgroundColor: '#1E88E5',
  },
  scannerText: {
    color: '#fff',
    marginTop: 24,
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  activeButton: {
    backgroundColor: '#1E88E5',
  },
  stopButton: {
    marginHorizontal: 8,
    backgroundColor: '#F44336',
  },
  startScanContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  startScanSurface: {
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
  },
  startScanTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  startScanText: {
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
    color: '#5f6368',
  },
  startScanButton: {
    paddingHorizontal: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  doneButton: {
    marginTop: 16,
  },
});

export default ScannerScreen;
