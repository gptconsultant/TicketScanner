import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  Dimensions,
  Vibration,
} from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ActivityIndicator } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import useScan from '../hooks/useScan';
import useEvent from '../hooks/useEvent';

const windowWidth = Dimensions.get('window').width;

const Scanner = ({ onScanComplete, disabled = false }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [torch, setTorch] = useState(false);
  const cameraRef = useRef(null);
  
  const { selectedEvent, selectedGate } = useEvent();
  const { isScanning, processScan } = useScan();
  
  // Request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Handle barcode scanning
  const handleBarCodeScanned = async ({ type, data }) => {
    if (isScanning || !selectedEvent || !selectedGate || disabled) return;
    
    // Vibrate device to provide feedback
    Vibration.vibrate(200);
    
    try {
      // Process the scan
      await processScan(data);
      
      // Call the callback if provided
      if (onScanComplete) {
        onScanComplete();
      }
    } catch (error) {
      console.error('Error processing scan:', error);
    }
  };

  // Toggle torch/flashlight
  const toggleTorch = () => {
    setTorch(!torch);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="camera-off" size={64} color="#e74c3c" />
        <Text style={styles.permissionText}>No access to camera</Text>
        <Text style={styles.permissionSubtext}>
          Please enable camera access in your device settings to scan tickets.
        </Text>
      </View>
    );
  }

  if (disabled) {
    return (
      <View style={styles.disabledContainer}>
        <Feather name="camera-off" size={64} color="#7f8c8d" />
        <Text style={styles.disabledText}>Scanner Disabled</Text>
        <Text style={styles.disabledSubtext}>
          Please start your shift to enable scanning.
        </Text>
      </View>
    );
  }

  return (
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
        onBarCodeScanned={isScanning ? undefined : handleBarCodeScanned}
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
    </View>
  );
};

const styles = StyleSheet.create({
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  permissionSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  disabledContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 20,
  },
  disabledText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  disabledSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
  },
});

export default Scanner;
