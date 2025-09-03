// API Configuration
import { Platform } from 'react-native';

const BASE_URL = Platform.select({
  // iOS simulator and Web use localhost
  ios: 'http://localhost:5000/api',
  web: 'http://localhost:5000/api',
  // Physical Android device (Expo Go) should use your machine's Wi‑Fi IP
  android: 'http://10.100.20.161:5000/api',
  // Fallback
  default: 'http://localhost:5000/api',
});

export const API_CONFIG = {
  BASE_URL: BASE_URL as string,
  TIMEOUT: 10000, // 10 seconds
};

export default API_CONFIG;
