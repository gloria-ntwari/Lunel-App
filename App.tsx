import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </EventProvider>
    </AuthProvider>
  );
}

