// API Configuration
import { Platform } from 'react-native';

const BASE_URL = Platform.select({

  ios: 'http://localhost:5000/api',
  web: 'http://localhost:5000/api',

  android: 'http://10.12.74.23:5000/api',

  default: 'http://localhost:5000/api',
});

export const API_CONFIG = {
  BASE_URL: BASE_URL as string,
  TIMEOUT: 10000, // 10 seconds
};

export default API_CONFIG;
