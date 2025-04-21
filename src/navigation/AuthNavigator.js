import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import LogoutScreen from '../screens/auth/LogoutScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
        name="Login" 
        component={LoginScreen} 
        options={{ title: 'Event Staff Login' }} 
      />
      <Stack.Screen 
        name="Logout" 
        component={LogoutScreen} 
        options={{ title: 'Logging Out' }} 
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
