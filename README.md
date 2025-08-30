## Lunel
Lunel is a React Native mobile application designed for students to manage events and personal profiles. It features a calendar view to track events, a profile screen for editing user details, and a signup interface for new users. Built with Expo and TypeScript, Lunel provides a clean, modern UI with a focus on usability and event organization.
Features

## Tech Stack

React Native: Framework for building cross-platform mobile apps.
Expo: Simplifies development and deployment of React Native apps.
TypeScript: Adds type safety to JavaScript code.
date-fns: Library for date manipulation and formatting in the calendar.
React Navigation: Handles navigation between screens.
Expo Linear Gradient: Used for gradient backgrounds in the calendar.

## Installation
Prerequisites

Node.js (v16 or higher)
Yarn or npm
A mobile device or emulator (iOS/Android)
Expo Go app (for testing on a physical device)

Steps

Clone the Repository:
git clone https://github.com/your-username/lunel.git
cd lunel


Install Dependencies:
yarn install
# or
npm install


## Install Expo Dependencies:Ensure Expo modules are installed:
npx expo install expo-linear-gradient @react-navigation/native @react-navigation/stack react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @expo/vector-icons date-fns


## Start the Development Server:Run the app using npx expo start to launch the Expo development server:
npx expo start


## Scan the QR code with the Expo Go app on your mobile device to test the app.
Alternatively, press a for Android emulator or i for iOS simulator in the terminal.

Note: This project uses npx expo start to run the app without requiring a global installation of Expo CLI. This approach ensures compatibility with the project's specific Expo version and avoids global dependency conflicts.


## Usage

Signup:

Open the app and navigate to the Signup screen.
Enter your name, email, password, and confirm your password to create an account.
Tap "Sign Up" to proceed or "Sign In" if you already have an account.


Calendar:

View the calendar to see events marked with orange dots.
The current date is highlighted with a purple background.
Tap a date to view events for that day, listed below the calendar.
Navigate between months using the arrow buttons.


Profile:

Access the Profile screen via the bottom navigation bar.
View your name, email, student ID, and password fields.
Tap "Edit Profile" to update your details, then "Save Changes" or "Cancel."



Project Structure
lunel/
├── components/
│   ├── Calendar/
│   │   ├── CalendarCard.tsx  # Calendar component with event indicators
│   │   ├── EventItem.tsx     # Displays individual event details
│   │   ├── Header.tsx        # Header for the Calendar screen
│   ├── BottomNav.tsx         # Bottom navigation bar
├── screens/
│   ├── CalendarScreen.tsx    # Main calendar screen with event list
│   ├── ProfileScreen.tsx     # Profile editing screen
│   ├── SignupScreen.tsx      # Account creation screen
├── App.tsx                   # App entry point
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
