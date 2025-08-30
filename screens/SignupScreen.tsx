
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useState } from "react";


export default function SignupScreen() {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lunel</Text>
      <Text style={styles.subtitle}>Create your Account</Text>
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Name" />
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Email" />
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Password" secureTextEntry />
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Confirm Password"/>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login' as never)}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
});
