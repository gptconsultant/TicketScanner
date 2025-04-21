import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Alert,
  Vibration,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button, ActivityIndicator, Banner } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useEvent from '../../hooks/useEvent';
import useScan from '../../hooks/useScan';
import TicketValidationResult from '../../components/TicketValidationResult';
import NetworkStatus from '../../components/NetworkStatus';
import OfflineAlert from '../../components/OfflineAlert';

const windowWidth = Dimensions.get('window').width;

const ScannerScreen = ({ navigation, route }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef(null);
  
  const { selectedEvent, selectedGate } = useEvent();
  const { 
    isScanning, 
    lastScanResult, 
    processScan, 
    resetScan, 
    scanStats,
    isOnline
  } = useScan();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Reset scan result when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetScan();
      setScanned(false);
    });

    return unsubscribe;
  }, [navigation]);

  // Check if we have event and gate selected
  useEffect(() => {
    if (!selectedEvent || !selectedGate) {
      Alert.alert(
        'Setup Required',
        'Please select an event and gate before scanning tickets.',
        [
          {
            text: 'Select Event',
            onPress: () => navigation.navigate('EventSelection'),
          },
        ],
        { cancelable: false }
      );
    }
  }, [selectedEvent, selectedGate]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isScanning || !selectedEvent || !selectedGate) return;
    
    // Vibrate device to provide feedback
    Vibration.vibrate(200);
    
    // Mark as scanned to prevent multiple scans
    setScanned(true);
    
    try {
      // Process the scan
      const result = await processScan(data);
      
      // Provide audio feedback based on result
      if (result.success) {
        // Play success sound (would implement with Expo AV if available)
        console.log('Scan successful!');
      } else {
        // Play error sound (would implement with Expo AV if available)
        console.log('Scan failed!');
      }
    } catch (error) {
      console.error('Error processing scan:', error);
      Alert.alert('Scan Error', error.message);
    }
  };

  const handleRescan = () => {
    resetScan();
    setScanned(false);
  };

  const toggleTorch = () => {
    setTorch(!torch);
  };

  const viewTicketDetails = () => {
    if (lastScanResult && lastScanResult.ticket) {
      navigation.navigate('TicketDetails', { 
        ticket: lastScanResult.ticket,
        scanResult: lastScanResult
      });
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.permissionContainer}>
        <Feather name="camera-off" size={64} color="#e74c3c" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in your device settings to scan tickets.
        </Text>
        <Button 
          mode="contained" 
          style={styles.permissionButton}
          onPress={() => navigation.goBack()}
        >
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {!selectedEvent || !selectedGate ? (
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
      ) : (
        <>
          <NetworkStatus />
          {!isOnline && <OfflineAlert />}
          
          <View style={styles.infoContainer}>
            <Text style={styles.eventText}>
              Event: {selectedEvent?.name || 'Unknown'}
            </Text>
            <Text style={styles.gateText}>
              Gate: {selectedGate?.name || 'Unknown'}
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
                onRescan={handleRescan}
              />
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                type={Camera.Constants.Type.back}
                flashMode={
                  torch 
                    ? Camera.Constants.FlashMode.torch 
                    : Camera.Constants.FlashMode.off
                }
                barCodeScannerSettings={{
                  barCodeTypes: [
                    BarCodeScanner.Constants.BarCodeType.qr,
                    BarCodeScanner.Constants.BarCodeType.pdf417,
                  ],
                }}
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              >
                <View style={styles.overlay}>
                  <View style={styles.topOverlay} />
                  <View style={styles.middleOverlay}>
                    <View style={styles.sideOverlay} />
                    <View style={styles.scanWindow}>
                      <View style={styles.cornerTL} />
                      <View style={styles.cornerTR} />
                      <View style={styles.cornerBL} />
                      <View style={styles.cornerBR} />
                    </View>
                    <View style={styles.sideOverlay} />
                  </View>
                  <View style={styles.bottomOverlay}>
                    <TouchableOpacity 
                      style={styles.torchButton} 
                      onPress={toggleTorch}
                    >
                      <Feather 
                        name={torch ? "zap-off" : "zap"} 
                        size={24} 
                        color="white" 
                      />
                      <Text style={styles.torchText}>
                        {torch ? "Flash Off" : "Flash On"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Camera>
              
              {isScanning && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.scanningText}>Processing ticket...</Text>
                </View>
              )}
              
              {scanned && !lastScanResult && (
                <View style={styles.scanningOverlay}>
                  <ActivityIndicator size="large" color="white" />
                  <Text style={styles.scanningText}>Validating ticket...</Text>
                </View>
              )}
            </View>
          )}
          
          {!lastScanResult && scanned && (
            <Button 
              mode="contained" 
              style={styles.rescanButton}
              onPress={handleRescan}
            >
              Scan Again
            </Button>
          )}
        </>
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
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleOverlay: {
    flex: 5,
    flexDirection: 'row',
  },
  bottomOverlay: {
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanWindow: {
    width: windowWidth * 0.7,
    aspectRatio: 1,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: 'white',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: 'white',
  },
  torchButton: {
    alignItems: 'center',
  },
  torchText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  scanningOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  rescanButton: {
    margin: 16,
    backgroundColor: '#2c3e50',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: '#2c3e50',
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

export default ScannerScreen;
