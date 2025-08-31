import React , {useState} from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from '@expo/vector-icons';


export default function LoginScreen() {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lunel</Text>
      <Text style={styles.subtitle}>Login to your Account</Text>
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Email" />
      <TextInput style={[styles.input, styles.passwordInput]} placeholder="Password" secureTextEntry />
      <TouchableOpacity style={styles.forgotPassword} onPress={() => alert('Forgot Password pressed!')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Event' as never)}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialIcon} onPress={() => navigation.navigate('AdminHome' as never)}> 
        <Text style={styles.AdminText}>Admin Login</Text>
      </TouchableOpacity>
      <Text style={styles.orText}>- Or login in with -</Text>
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialIcon2} onPress={() => alert('Button pressed!')}>
          <Image source={require('../assets/icons/google.png')} style={styles.image}/>
          <Text style={styles.buttonGoogle}>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon2} onPress={() => alert('Button pressed!')}>
          <Image source={require('../assets/icons/apple.png')} style={styles.image2}/>
          <Text style={styles.buttonGoogle}>Apple</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={() => navigation.navigate('Signup' as never)}
          >
            <Text style={[styles.signupText, isPressed && styles.underlined]}>
              Don't have an account? Sign Up
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
  AdminText: {
    color: '#6B46C1',
    textAlign: 'center',    
  },
  orText: {
    textAlign: 'center',
    marginBottom: SPACING,
    marginTop: SPACING *2,
    color: '#4a4c4e9c',
    fontWeight: '400',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING,
    gap: SPACING,
    
  },

  socialIcon: {
    marginHorizontal: SPACING / 2,
  },
  signupText: {
    textAlign: 'center',
    color: '#6B46C1',
  },
  buttonGoogle: {
    color: '#000',
    fontSize: 16,
    marginLeft: 8,
  },
  socialIcon2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: SPACING /2 - 2,
    paddingHorizontal: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -SPACING * 1.5,
    marginBottom: SPACING * 2,
  },
  forgotText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  image: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  image2: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
 underlined: {
    textDecorationLine: 'underline',
  },
});
