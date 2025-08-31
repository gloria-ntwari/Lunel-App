import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import SignupScreen from "../screens/SignupScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import EventScreen from "../screens/EventScreen";
import CalendarScreen from "../screens/CalendarScreen";
import TimetableScreen from "../screens/TimetableScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AdminHomeScreen from "../screens/AdminHomeScreen";
import AdminMealsScreen from "../screens/AdminMealsScreen";
import AdminProfileScreen from "../screens/AdminProfileScreen";
import AdminManagementScreen from "../screens/AdminManagementScreen";
import AdminCalendarScreen from "../screens/AdminCalendarScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
            <Stack.Screen name="Event" component={EventScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Timetable" component={TimetableScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
            <Stack.Screen name="AdminMeals" component={AdminMealsScreen} />
            <Stack.Screen name="AdminProfile" component={AdminProfileScreen} />
            <Stack.Screen name="AdminManagement" component={AdminManagementScreen} />
            <Stack.Screen name="AdminCalendar" component={AdminCalendarScreen} />
        </Stack.Navigator>
    );
}