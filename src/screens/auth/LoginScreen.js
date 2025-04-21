import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Use demo accounts for testing
      if (
        (username === 'admin' && password === 'password') ||
        (username === 'staff' && password === 'password') ||
        (username === 'volunteer' && password === 'password')
      ) {
        // Determine role based on username
        const role = username.toLowerCase();
        await login({ username, role });
      } else {
        setError('Invalid credentials. Try admin/password, staff/password, or volunteer/password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
          style={styles.logo} 
        />
        <Text style={styles.title}>Event Ticket Scanner</Text>
        <Text style={styles.subtitle}>Login to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          autoCapitalize="none"
          disabled={isLoading}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          disabled={isLoading}
          mode="outlined"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Login
        </Button>

        <View style={styles.demoAccountsContainer}>
          <Text style={styles.demoTitle}>Demo Accounts:</Text>
          <TouchableOpacity onPress={() => {
            setUsername('admin');
            setPassword('password');
          }}>
            <Text style={styles.demoAccount}>Admin: admin / password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setUsername('staff');
            setPassword('password');
          }}>
            <Text style={styles.demoAccount}>Staff: staff / password</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setUsername('volunteer');
            setPassword('password');
          }}>
            <Text style={styles.demoAccount}>Volunteer: volunteer / password</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  demoAccountsContainer: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  demoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  demoAccount: {
    color: '#0066cc',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;