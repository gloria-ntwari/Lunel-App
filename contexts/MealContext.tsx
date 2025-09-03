import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface Meal {
  _id: string;
  title: string;
  description?: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  menu: string;
  image?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface MealContextType {
  meals: Meal[];
  isLoading: boolean;
  error: string | null;
  fetchMeals: (mealType?: string, day?: string) => Promise<void>;
  fetchMealsByDay: (day: string) => Promise<void>;
  createMeal: (mealData: Partial<Meal>) => Promise<Meal>;
  updateMeal: (id: string, mealData: Partial<Meal>) => Promise<Meal>;
  deleteMeal: (id: string) => Promise<void>;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

interface MealProviderProps {
  children: ReactNode;
}

export const MealProvider: React.FC<MealProviderProps> = ({ children }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
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

  // Fetch meals with optional filtering
  const fetchMeals = async (mealType?: string, day?: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      let url = `${API_CONFIG.BASE_URL}/meals`;
      const params = new URLSearchParams();
      
      if (mealType) params.append('mealType', mealType);
      if (day) params.append('day', day);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMeals(response.data.data.meals);
    } catch (error: any) {
      console.error('Error fetching meals:', error);
      setError(error.response?.data?.message || 'Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch meals for a specific day
  const fetchMealsByDay = async (day: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/meals/day/${day}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMeals(response.data.data);
    } catch (error: any) {
      console.error('Error fetching meals by date:', error);
      setError(error.response?.data?.message || 'Failed to fetch meals');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new meal
  const createMeal = async (mealData: Partial<Meal>): Promise<Meal> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/meals`,
        mealData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh meals
      await fetchMeals();
      
      return response.data.data.meal;
    } catch (error: any) {
      console.error('Error creating meal:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create meal';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update a meal
  const updateMeal = async (id: string, mealData: Partial<Meal>): Promise<Meal> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/meals/${id}`,
        mealData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh meals
      await fetchMeals();
      
      return response.data.data.meal;
    } catch (error: any) {
      console.error('Error updating meal:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update meal';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete a meal
  const deleteMeal = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_CONFIG.BASE_URL}/meals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove meal from local state
      setMeals(prevMeals => prevMeals.filter(meal => meal._id !== id));
    } catch (error: any) {
      console.error('Error deleting meal:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete meal';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: MealContextType = {
    meals,
    isLoading,
    error,
    fetchMeals,
    fetchMealsByDay,
    createMeal,
    updateMeal,
    deleteMeal
  };

  return (
    <MealContext.Provider value={value}>
      {children}
    </MealContext.Provider>
  );
};

export const useMeals = (): MealContextType => {
  const context = useContext(MealContext);
  if (context === undefined) {
    throw new Error('useMeals must be used within a MealProvider');
  }
  return context;
};
