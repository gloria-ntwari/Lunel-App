import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'super_admin' | 'event_manager' | 'meal_coordinator';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; user?: User }>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string; user?: User }>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  refreshUserData: () => Promise<User | null>;
  updateProfile: (name: string, email: string, password?: string) => Promise<{ success: boolean; message: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up axios interceptor for token
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        
        // Verify token with backend
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data.user);
        } else {
          // Token is invalid, clear storage
          await AsyncStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear invalid token
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login with:', { email, baseURL: axios.defaults.baseURL });
      
      const response = await axios.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token
        await AsyncStorage.setItem('authToken', authToken);
        setToken(authToken);
        setUser(userData);
        
        return { success: true, message: 'Login successful', user: userData };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: axios.defaults.baseURL
      });
      
      let message = 'Login failed. Please try again.';
      
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        message = 'Cannot connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid email or password format.';
      } else if (error.response?.status === 401) {
        message = 'Invalid email or password.';
      }
      
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/auth/register', {
        name,
        email,
        password,
        confirmPassword
      });
      
      if (response.data.success) {
        const { user: userData, token: authToken } = response.data.data;
        
        // Store token
        await AsyncStorage.setItem('authToken', authToken);
        setToken(authToken);
        setUser(userData);
        
        return { success: true, message: 'Registration successful', user: userData };
      } else {
        return { success: false, message: response.data.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      // Clear axios default headers
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const refreshUserData = async () => {
    try {
      if (token) {
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.data.user);
          return response.data.data.user;
        }
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
    return null;
  };

  const updateProfile = async (name: string, email: string, password?: string) => {
    try {
      setIsLoading(true);
      const updateData: any = { name, email };
      if (password && password !== '********') {
        updateData.password = password;
      }

      const response = await axios.put('/auth/profile', updateData);
      
      if (response.data.success) {
        const updatedUser = response.data.data.user;
        setUser(updatedUser);
        return { success: true, message: 'Profile updated successfully', user: updatedUser };
      } else {
        return { success: false, message: response.data.message || 'Profile update failed' };
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      const message = error.response?.data?.message || 'Profile update failed. Please try again.';
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
    refreshUserData,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
