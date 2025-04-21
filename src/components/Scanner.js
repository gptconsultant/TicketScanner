import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Vibration,
  Alert,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ActivityIndicator } from 'react-native-paper';
import useScan from '../hooks/useScan';
import useEvent from '../hooks/useEvent';
import { useNetwork } from '../contexts/NetworkContext';

const windowWidth = Dimensions.get('window').width;

const Scanner = ({ onScanComplete }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null);
  
  const { validateTicket } = useScan();
  const { selectedEvent, selectedGate } = useEvent();
  const { isConnected } = useNetwork();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const toggleFlash = () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.torch
        ? Camera.Constants.FlashMode.off
        : Camera.Constants.FlashMode.torch
    );
  };

  const resetScanner = () => {
    setScanned(false);
    setLoading(false);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      // Prevent multiple scans
      if (scanned || loading) return;
      
      setScanned(true);
      setLoading(true);
      
      // Provide haptic feedback
      Vibration.vibrate(200);
      
      if (!selectedEvent || !selectedGate) {
        Alert.alert('Error', 'Please select an event and gate before scanning');
        resetScanner();
        return;
      }
      
      // Validate the ticket
      const result = await validateTicket(data, selectedEvent.id, selectedGate.id);
      
      // Pass result to parent component
      if (onScanComplete) {
        onScanComplete(result);
      }
      
    } catch (error) {
      console.error('Scanning error:', error);
      Alert.alert('Scanning Error', error.message || 'Could not process ticket');
    } finally {
      setLoading(false);
    }
  };

  // Handle permission request result
  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }
  
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
        >
          <Text style={styles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        flashMode={flashMode}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          {/* Frame for the QR code */}
          <View style={styles.frameContainer}>
            <View style={styles.frame} />
          </View>
          
          {/* Status indicator */}
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, 
              {backgroundColor: isConnected ? '#2ecc71' : '#e74c3c'}]} />
            <Text style={styles.statusText}>
              {isConnected ? 'Online Mode' : 'Offline Mode'}
            </Text>
          </View>
          
          {/* Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity 
              style={styles.controlButton} 
              onPress={toggleFlash}
            >
              <Text style={styles.controlButtonText}>
                {flashMode === Camera.Constants.FlashMode.torch ? 'Flash Off' : 'Flash On'}
              </Text>
            </TouchableOpacity>
            
            {scanned && !loading && (
              <TouchableOpacity 
                style={styles.controlButton} 
                onPress={resetScanner}
              >
                <Text style={styles.controlButtonText}>Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Loading indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20,
  },
  frameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: windowWidth * 0.7,
    height: windowWidth * 0.7,
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  statusContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(52, 152, 219, 0.7)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  controlButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 10,
  },
});

export default Scanner;