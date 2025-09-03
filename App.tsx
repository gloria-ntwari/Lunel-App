import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './contexts/AuthContext';
import { EventProvider } from './contexts/EventContext';
import { CategoryProvider } from './contexts/CategoryContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { MealProvider } from './contexts/MealContext';
import { NotificationsProvider } from './contexts/NotificationsContext';

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <CategoryProvider>
          <CalendarProvider>
            <MealProvider>
              <NotificationsProvider>
                <NavigationContainer>
                  <AppNavigator />
                </NavigationContainer>
              </NotificationsProvider>
            </MealProvider>
          </CalendarProvider>
        </CategoryProvider>
      </EventProvider>
    </AuthProvider>
  );
}

