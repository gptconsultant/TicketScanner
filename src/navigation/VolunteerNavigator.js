import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VolunteerScannerScreen from '../screens/volunteer/VolunteerScannerScreen';
import VolunteerCheckoutScreen from '../screens/volunteer/VolunteerCheckoutScreen';
import EventSelectionScreen from '../screens/staff/EventSelectionScreen';
import GateSelectionScreen from '../screens/staff/GateSelectionScreen';
import TicketDetailsScreen from '../screens/staff/TicketDetailsScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';

const Stack = createStackNavigator();

const VolunteerNavigator = () => {
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
        component={VolunteerScannerScreen} 
        options={{ title: 'Volunteer Scanner' }} 
      />
      <Stack.Screen 
        name="TicketDetails" 
        component={TicketDetailsScreen} 
        options={{ title: 'Ticket Information' }} 
      />
      <Stack.Screen 
        name="Checkout" 
        component={VolunteerCheckoutScreen} 
        options={{ title: 'End Shift' }} 
      />
      <Stack.Screen 
        name="Logout" 
        component={LogoutScreen} 
        options={{ title: 'Logging Out' }} 
      />
    </Stack.Navigator>
  );
};

export default VolunteerNavigator;
