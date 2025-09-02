
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";
import { useAuth } from '../contexts/AuthContext';


export default function SignupScreen() {
  const navigation = useNavigation();
  const { register, isLoading } = useAuth();
  const [isPressed, setIsPressed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    const result = await register(name.trim(), email.trim(), password, confirmPassword);
    
    if (result.success && result.user) {
      // Navigate to Event screen for regular users
      navigation.navigate('Event' as never);
    } else {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lunel</Text>
      <Text style={styles.subtitle}>Create your Account</Text>
      <TextInput 
        style={[styles.input, styles.passwordInput]} 
        placeholder="Name" 
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      <TextInput 
        style={[styles.input, styles.passwordInput]} 
        placeholder="Email" 
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput 
        style={[styles.input, styles.passwordInput]} 
        placeholder="Password" 
        secureTextEntry 
        value={password}
        onChangeText={setPassword}
      />
      <TextInput 
        style={[styles.input, styles.passwordInput]} 
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onPress={() => navigation.navigate('Login' as never)}
    >
      <Text style={[styles.signupText, isPressed && styles.underlined]}>
        Already have an account? Sign In
      </Text>
    </TouchableOpacity>
    </View>
  );
}

const SPACING = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: SPACING * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: SPACING * 2,
    textAlign: 'center',
  },
  signupText: {
    textAlign: 'center',
    color: '#6B46C1',
    fontWeight: '400',
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: SPACING,
    textAlign: 'center',
    fontSize: 17,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: SPACING,
    marginBottom: SPACING,
  },
  passwordInput: {
    marginBottom: SPACING * 1.5,
  },
  button: {
    backgroundColor: '#6B46C1',
    borderRadius: 40,
    paddingVertical: SPACING,
    marginBottom: SPACING,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
});
