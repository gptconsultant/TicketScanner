import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import useAuth from '../../hooks/useAuth';

const LogoutScreen = ({ navigation }) => {
  const { logout } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Navigation will be handled by the AppNavigator based on auth state
      } catch (error) {
        console.error('Logout error:', error);
        // If there's an error, we still want to try to navigate back to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    performLogout();
  }, [logout, navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#2c3e50" />
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#2c3e50',
  },
});

export default LogoutScreen;