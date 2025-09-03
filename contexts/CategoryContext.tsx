import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface Category {
  _id: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
  createdBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryContextType {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchAdminCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<Category>;
  updateCategory: (id: string, name: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  initializeCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth token from AsyncStorage
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Fetch categories for public use (active categories only)
  const fetchCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_CONFIG.BASE_URL}/categories`);
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all categories for admin (including inactive)
  const fetchAdminCategories = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      console.log('CategoryContext - Token retrieved:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/categories/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCategories(response.data);
    } catch (error: any) {
      console.error('Error fetching admin categories:', error);
      setError(error.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new category
  const createCategory = async (name: string): Promise<Category> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/categories`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh categories list
      await fetchAdminCategories();
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update a category
  const updateCategory = async (id: string, name: string): Promise<Category> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/categories/${id}`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh categories list
      await fetchAdminCategories();
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a category
  const deleteCategory = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_CONFIG.BASE_URL}/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh categories list
      await fetchAdminCategories();
    } catch (error: any) {
      console.error('Error deleting category:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Initialize default categories
  const initializeCategories = async (): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(
        `${API_CONFIG.BASE_URL}/categories/initialize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh categories list
      await fetchAdminCategories();
    } catch (error: any) {
      console.error('Error initializing categories:', error);
      const errorMessage = error.response?.data?.message || 'Failed to initialize categories';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: CategoryContextType = {
    categories,
    isLoading,
    error,
    fetchCategories,
    fetchAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    initializeCategories
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};


