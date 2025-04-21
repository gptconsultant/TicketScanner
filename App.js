import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import { EventProvider } from './src/contexts/EventContext';
import { ScanProvider } from './src/contexts/ScanContext';
import AppNavigator from './src/navigation/AppNavigator';
import OfflineAlert from './src/components/OfflineAlert';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <NetworkProvider>
        <AuthProvider>
          <EventProvider>
            <ScanProvider>
              <OfflineAlert />
              <AppNavigator />
            </ScanProvider>
          </EventProvider>
        </AuthProvider>
      </NetworkProvider>
    </SafeAreaProvider>
  );
}