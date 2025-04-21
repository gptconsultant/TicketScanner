import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { ActivityIndicator, Button } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;

const QRScanner = forwardRef(({ onScan, scanning = true }, ref) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(!scanning);
  const [permissionMessage, setPermissionMessage] = useState('');
  const [camera, setCamera] = useState(null);
  
  useImperativeHandle(ref, () => ({
    resetScanner: () => {
      setScanned(false);
    }
  }));

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status !== 'granted') {
        setPermissionMessage('Permission to access camera is required to scan tickets.');
      }
    })();
  }, []);

  useEffect(() => {
    setScanned(!scanning);
  }, [scanning]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    
    try {
      // Only handle QR codes
      if (type === BarCodeScanner.Constants.BarCodeType.qr) {
        onScan(data);
      } else {
        throw new Error('Please scan a QR code');
      }
    } catch (err) {
      console.error("Error scanning code:", err);
      // Allow scanning again after error
      setTimeout(() => {
        setScanned(false);
      }, 2000);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text style={styles.infoText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Feather name="camera-off" size={50} color="#F44336" />
        <Text style={styles.errorText}>{permissionMessage}</Text>
        <Button 
          mode="contained" 
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
          }}
          style={styles.permissionButton}
        >
          Request Permission
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={ref => setCamera(ref)}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        ratio="16:9"
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
          </View>
          <Text style={styles.scanText}>
            {scanned ? 'Processing...' : 'Align QR code within frame'}
          </Text>
        </View>
      </Camera>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#FFFFFF',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#FFFFFF',
  },
  scanText: {
    marginTop: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoText: {
    marginTop: 16,
    color: '#FFFFFF',
  },
  errorText: {
    marginTop: 16,
    color: '#F44336',
    marginHorizontal: 24,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionButton: {
    marginTop: 24,
    backgroundColor: '#1E88E5',
  },
});

export default QRScanner;
