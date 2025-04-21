import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import StaffNavigator from './StaffNavigator';
import VolunteerNavigator from './VolunteerNavigator';
import useAuth from '../hooks/useAuth';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isLoading, isAuthenticated, userRole, userInfo, checkVolunteerShift } = useAuth();

  // Show loading screen while checking auth state
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Determine which navigator to show based on auth state and user role
  const getNavigator = () => {
    if (!isAuthenticated()) {
      return <Stack.Screen 
        name="Auth" 
        component={AuthNavigator} 
        options={{ headerShown: false }} 
      />;
    }

    switch (userRole) {
      case 'admin':
        return <Stack.Screen 
          name="Admin" 
          component={AdminNavigator} 
          options={{ headerShown: false }} 
        />;
      case 'staff':
        return <Stack.Screen 
          name="Staff" 
          component={StaffNavigator} 
          options={{ headerShown: false }} 
        />;
      case 'volunteer':
        return <Stack.Screen 
          name="Volunteer" 
          component={VolunteerNavigator} 
          options={{ headerShown: false }} 
        />;
      default:
        // Fallback to auth if role is unknown
        return <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ headerShown: false }} 
        />;
    }
  };

  return (
    <Stack.Navigator>
      {getNavigator()}
    </Stack.Navigator>
  );
};

export default AppNavigator;
