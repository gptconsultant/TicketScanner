import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import useAuth from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and password are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      // No need to navigate, the AppNavigator will handle routing based on auth state
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Please check your credentials and try again');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Event Ticket Scanner</Text>
          <Text style={styles.subtitle}>Staff Login</Text>

          <View style={styles.formContainer}>
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              disabled={isSubmitting}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              disabled={isSubmitting}
            />

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Login
            </Button>

            {/* Add these for testing demo purposes */}
            <View style={styles.demoContainer}>
              <Text style={styles.demoText}>Demo Accounts:</Text>
              <Text style={styles.demoCredentials}>Admin: admin / password</Text>
              <Text style={styles.demoCredentials}>Staff: staff / password</Text>
              <Text style={styles.demoCredentials}>Volunteer: volunteer / password</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#2c3e50',
  },
  demoContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  demoText: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  demoCredentials: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
    color: '#555',
  },
});

export default LoginScreen;