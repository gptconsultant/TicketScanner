import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableWithoutFeedback, 
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Title, 
  Paragraph, 
  Headline,
  HelperText,
  Snackbar
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { Feather } from '@expo/vector-icons';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { login, loading } = useAuth();

  const validate = () => {
    let isValid = true;
    
    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }
    
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    try {
      await login(username, password);
      // If successful, navigation will happen automatically via the AppNavigator
    } catch (error) {
      setSnackbarMessage(error.message || 'Login failed. Please check your credentials.');
      setSnackbarVisible(true);
    }
  };

  const toggleSecureTextEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Feather name="check-circle" size={60} color="#1E88E5" />
            <Headline style={styles.appName}>EventScan</Headline>
            <Paragraph style={styles.appDescription}>Ticket scanning for event staff</Paragraph>
          </View>
          
          <View style={styles.formContainer}>
            <Title style={styles.loginTitle}>Log In</Title>
            
            <TextInput
              label="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.input}
              autoCapitalize="none"
              error={!!usernameError}
              disabled={loading}
            />
            {usernameError ? <HelperText type="error">{usernameError}</HelperText> : null}
            
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
              style={styles.input}
              error={!!passwordError}
              disabled={loading}
              right={
                <TextInput.Icon 
                  icon={secureTextEntry ? "eye" : "eye-off"} 
                  onPress={toggleSecureTextEntry} 
                />
              }
            />
            {passwordError ? <HelperText type="error">{passwordError}</HelperText> : null}
            
            <Button 
              mode="contained" 
              onPress={handleLogin} 
              style={styles.loginButton}
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
          </View>
          
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: 'Dismiss',
              onPress: () => setSnackbarVisible(false),
            }}>
            {snackbarMessage}
          </Snackbar>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#1E88E5',
  },
  appDescription: {
    marginTop: 5,
    color: '#666',
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#1E88E5',
  },
});

export default LoginScreen;
