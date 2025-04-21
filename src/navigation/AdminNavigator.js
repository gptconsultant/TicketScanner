import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import DashboardScreen from '../screens/admin/DashboardScreen';
import ManageGatesScreen from '../screens/admin/ManageGatesScreen';
import ManageEventsScreen from '../screens/admin/ManageEventsScreen';
import ManageRulesScreen from '../screens/admin/ManageRulesScreen';
import ScannerScreen from '../screens/staff/ScannerScreen';
import TicketDetailsScreen from '../screens/staff/TicketDetailsScreen';
import GateSelectionScreen from '../screens/staff/GateSelectionScreen';
import EventSelectionScreen from '../screens/staff/EventSelectionScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Scanner Stack Navigator
const ScannerStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="EventSelection" 
        component={EventSelectionScreen} 
        options={{ title: 'Select Event' }} 
      />
      <Stack.Screen 
        name="GateSelection" 
        component={GateSelectionScreen} 
        options={{ title: 'Select Gate' }} 
      />
      <Stack.Screen 
        name="Scanner" 
        component={ScannerScreen} 
        options={{ title: 'Scan Tickets' }} 
      />
      <Stack.Screen 
        name="TicketDetails" 
        component={TicketDetailsScreen} 
        options={{ title: 'Ticket Information' }} 
      />
    </Stack.Navigator>
  );
};

// Management Stack Navigator
const ManagementStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2c3e50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ title: 'Admin Dashboard' }} 
      />
      <Stack.Screen 
        name="ManageEvents" 
        component={ManageEventsScreen} 
        options={{ title: 'Manage Events' }} 
      />
      <Stack.Screen 
        name="ManageGates" 
        component={ManageGatesScreen} 
        options={{ title: 'Manage Gates' }} 
      />
      <Stack.Screen 
        name="ManageRules" 
        component={ManageRulesScreen} 
        options={{ title: 'Manage Entry Rules' }} 
      />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Manage') {
            iconName = 'settings';
          } else if (route.name === 'Scan') {
            iconName = 'camera';
          } else if (route.name === 'LogOut') {
            iconName = 'log-out';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Manage" component={ManagementStackNavigator} />
      <Tab.Screen name="Scan" component={ScannerStackNavigator} />
      <Tab.Screen name="LogOut" component={LogoutScreen} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
