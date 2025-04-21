import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const AppNavigator = () => {
  const { user } = useAuth();
  
  return user ? <MainNavigator /> : <AuthNavigator />;
};

export default AppNavigator;
