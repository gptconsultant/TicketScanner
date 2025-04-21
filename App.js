import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { EventProvider } from './src/contexts/EventContext';
import { ScanProvider } from './src/contexts/ScanContext';

export default function App() {
  // Initialize app and load any necessary resources here

  return (
    <PaperProvider>
      <AuthProvider>
        <EventProvider>
          <ScanProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <AppNavigator />
            </NavigationContainer>
          </ScanProvider>
        </EventProvider>
      </AuthProvider>
    </PaperProvider>
  );
}
