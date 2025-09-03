import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

export interface CalendarEvent {
  _id: string;
  title: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  category: string;
  image?: string;
  isCancelled: boolean;
  cancelledAt?: Date;
  cancelledBy?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarContextType {
  events: CalendarEvent[];
  monthEvents: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEventsByDate: (date: Date) => Promise<void>;
  fetchEventsByMonth: (year: number, month: number) => Promise<void>;
  createEvent: (eventData: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  updateEvent: (id: string, eventData: Partial<CalendarEvent>) => Promise<CalendarEvent>;
  deleteEvent: (id: string) => Promise<void>;
  cancelEvent: (id: string) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [monthEvents, setMonthEvents] = useState<CalendarEvent[]>([]);
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

  // Fetch events for a specific date
  const fetchEventsByDate = async (date: Date): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const response = await axios.get(`${API_CONFIG.BASE_URL}/events/date/${dateString}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Convert string dates to Date objects
      const eventsWithDates = response.data.data.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        cancelledAt: event.cancelledAt ? new Date(event.cancelledAt) : undefined
      }));

      setEvents(eventsWithDates);
    } catch (error: any) {
      console.error('Error fetching events by date:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch events for a specific month (for calendar dots)
  const fetchEventsByMonth = async (year: number, month: number): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_CONFIG.BASE_URL}/events/month/${year}/${month + 1}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Convert string dates to Date objects
      const eventsWithDates = response.data.data.map((event: any) => ({
        ...event,
        date: new Date(event.date),
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt),
        cancelledAt: event.cancelledAt ? new Date(event.cancelledAt) : undefined
      }));

      setMonthEvents(eventsWithDates);
    } catch (error: any) {
      console.error('Error fetching events by month:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
    }
  };

  // Create a new event
  const createEvent = async (eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert Date objects to ISO strings for API
      const apiEventData = {
        ...eventData,
        date: eventData.date?.toISOString(),
        startTime: eventData.startTime instanceof Date ? eventData.startTime.toISOString() : eventData.startTime,
        endTime: eventData.endTime instanceof Date ? eventData.endTime.toISOString() : eventData.endTime,
      };

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/events`,
        apiEventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh events for the current date
      if (eventData.date) {
        await fetchEventsByDate(eventData.date);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error creating event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Update an event
  const updateEvent = async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Convert Date objects to ISO strings for API
      const apiEventData = {
        ...eventData,
        date: eventData.date?.toISOString(),
        startTime: eventData.startTime instanceof Date ? eventData.startTime.toISOString() : eventData.startTime,
        endTime: eventData.endTime instanceof Date ? eventData.endTime.toISOString() : eventData.endTime,
      };

      const response = await axios.put(
        `${API_CONFIG.BASE_URL}/events/${id}`,
        apiEventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Refresh events for the current date
      if (eventData.date) {
        await fetchEventsByDate(eventData.date);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Error updating event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete an event
  const deleteEvent = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_CONFIG.BASE_URL}/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove event from local state
      setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
    } catch (error: any) {
      console.error('Error deleting event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Cancel an event
  const cancelEvent = async (id: string): Promise<void> => {
    try {
      setError(null);
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.patch(`${API_CONFIG.BASE_URL}/events/${id}/cancel`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Refresh events for the current date
      await fetchEventsByDate(new Date());
    } catch (error: any) {
      console.error('Error cancelling event:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel event';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value: CalendarContextType = {
    events,
    monthEvents,
    isLoading,
    error,
    fetchEventsByDate,
    fetchEventsByMonth,
    createEvent,
    updateEvent,
    deleteEvent,
    cancelEvent
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
