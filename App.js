import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { EventProvider } from './src/contexts/EventContext';
import { ScanProvider } from './src/contexts/ScanContext';
import { NetworkProvider } from './src/contexts/NetworkContext';
import OfflineAlert from './src/components/OfflineAlert';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NetworkProvider>
          <AuthProvider>
            <EventProvider>
              <ScanProvider>
                <NavigationContainer>
                  <StatusBar style="auto" />
                  <OfflineAlert />
                  <AppNavigator />
                </NavigationContainer>
              </ScanProvider>
            </EventProvider>
          </AuthProvider>
        </NetworkProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
