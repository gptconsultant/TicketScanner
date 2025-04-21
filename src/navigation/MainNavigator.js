import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import EventSelectionScreen from '../screens/EventSelectionScreen';
import GateSelectionScreen from '../screens/GateSelectionScreen';
import ScannerScreen from '../screens/ScannerScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import PendingSyncScreen from '../screens/PendingSyncScreen';
import ScanResultScreen from '../screens/ScanResultScreen';
import { Feather } from '@expo/vector-icons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ScannerStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Scan Tickets' }}
      />
      <Stack.Screen 
        name="ScanResult" 
        component={ScanResultScreen}
        options={{ title: 'Scan Result' }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Staff';

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="ScannerTab" 
        component={ScannerStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Feather name="camera" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="GateSelection" 
        component={GateSelectionScreen}
        options={{
          title: 'Gate Selection',
          tabBarLabel: 'Gates',
          tabBarIcon: ({ color, size }) => (
            <Feather name="map-pin" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="PendingSync" 
        component={PendingSyncScreen}
        options={{
          title: 'Pending Sync',
          tabBarLabel: 'Sync',
          tabBarIcon: ({ color, size }) => (
            <Feather name="refresh-cw" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <Tab.Screen 
          name="AdminPanel" 
          component={AdminPanelScreen}
          options={{
            title: 'Admin Panel',
            tabBarLabel: 'Admin',
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EventSelection" 
        component={EventSelectionScreen}
        options={{ title: 'Select Event' }}
      />
      <Stack.Screen 
        name="Main" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainNavigator;
