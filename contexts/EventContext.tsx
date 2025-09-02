import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Configure axios defaults
axios.defaults.baseURL = API_CONFIG.BASE_URL;

interface Event {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  image?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isActive: boolean;
  isCancelled?: boolean;
  cancelledAt?: Date;
  cancelledBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isCompleted?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
  isCancelledEvent?: boolean;
}

interface EventContextType {
  events: Event[];
  todayEvents: Event[];
  upcomingEvents: Event[];
  completedEvents: Event[];
  cancelledEvents: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: (filter?: string, category?: string) => Promise<void>;
  createEvent: (eventData: Partial<Event>) => Promise<{ success: boolean; message: string; event?: Event }>;
  updateEvent: (eventId: string, eventData: Partial<Event>) => Promise<{ success: boolean; message: string; event?: Event }>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  cancelEvent: (eventId: string) => Promise<{ success: boolean; message: string; event?: Event }>;
  getEventById: (eventId: string) => Event | null;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Computed properties for filtered events
  const todayEvents = events.filter(event => event.isToday && !event.isCancelled);
  const upcomingEvents = events.filter(event => event.isUpcoming && !event.isCancelled);
  const completedEvents = events.filter(event => event.isCompleted && !event.isCancelled);
  const cancelledEvents = events.filter(event => event.isCancelled);

  const fetchEvents = async (filter?: string, category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filter) params.append('filter', filter);
      if (category && category !== 'all') params.append('category', category);

      const response = await axios.get(`/events?${params.toString()}`);
      
      if (response.data.success) {
        // Convert string dates to Date objects
        const eventsWithDateObjects = response.data.data.events.map((event: any) => ({
          ...event,
          date: new Date(event.date),
          startTime: new Date(event.startTime),
          endTime: new Date(event.endTime),
          createdAt: new Date(event.createdAt),
          updatedAt: new Date(event.updatedAt)
        }));
        setEvents(eventsWithDateObjects);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (error: any) {
      console.error('Fetch events error:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post('/events', eventData);
      
      if (response.data.success) {
        const newEvent = response.data.data.event;
        // Convert string dates to Date objects
        const eventWithDateObjects = {
          ...newEvent,
          date: new Date(newEvent.date),
          startTime: new Date(newEvent.startTime),
          endTime: new Date(newEvent.endTime),
          createdAt: new Date(newEvent.createdAt),
          updatedAt: new Date(newEvent.updatedAt)
        };
        setEvents(prev => [...prev, eventWithDateObjects]);
        return { success: true, message: 'Event created successfully', event: eventWithDateObjects };
      } else {
        return { success: false, message: response.data.message || 'Failed to create event' };
      }
    } catch (error: any) {
      console.error('Create event error:', error);
      const message = error.response?.data?.message || 'Failed to create event';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.put(`/events/${eventId}`, eventData);
      
      if (response.data.success) {
        const updatedEvent = response.data.data.event;
        // Convert string dates to Date objects
        const eventWithDateObjects = {
          ...updatedEvent,
          date: new Date(updatedEvent.date),
          startTime: new Date(updatedEvent.startTime),
          endTime: new Date(updatedEvent.endTime),
          createdAt: new Date(updatedEvent.createdAt),
          updatedAt: new Date(updatedEvent.updatedAt)
        };
        setEvents(prev => prev.map(event => 
          event._id === eventId ? eventWithDateObjects : event
        ));
        return { success: true, message: 'Event updated successfully', event: eventWithDateObjects };
      } else {
        return { success: false, message: response.data.message || 'Failed to update event' };
      }
    } catch (error: any) {
      console.error('Update event error:', error);
      const message = error.response?.data?.message || 'Failed to update event';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.delete(`/events/${eventId}`);
      
      if (response.data.success) {
        setEvents(prev => prev.filter(event => event._id !== eventId));
        return { success: true, message: 'Event deleted successfully' };
      } else {
        return { success: false, message: response.data.message || 'Failed to delete event' };
      }
    } catch (error: any) {
      console.error('Delete event error:', error);
      const message = error.response?.data?.message || 'Failed to delete event';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEvent = async (eventId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.patch(`/events/${eventId}/cancel`);
      
      if (response.data.success) {
        const cancelledEvent = response.data.data.event;
        // Convert string dates to Date objects
        const eventWithDateObjects = {
          ...cancelledEvent,
          date: new Date(cancelledEvent.date),
          startTime: new Date(cancelledEvent.startTime),
          endTime: new Date(cancelledEvent.endTime),
          createdAt: new Date(cancelledEvent.createdAt),
          updatedAt: new Date(cancelledEvent.updatedAt),
          cancelledAt: cancelledEvent.cancelledAt ? new Date(cancelledEvent.cancelledAt) : undefined
        };
        setEvents(prev => prev.map(event => 
          event._id === eventId ? eventWithDateObjects : event
        ));
        return { success: true, message: 'Event cancelled successfully', event: eventWithDateObjects };
      } else {
        return { success: false, message: response.data.message || 'Failed to cancel event' };
      }
    } catch (error: any) {
      console.error('Cancel event error:', error);
      const message = error.response?.data?.message || 'Failed to cancel event';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const getEventById = (eventId: string): Event | null => {
    return events.find(event => event._id === eventId) || null;
  };

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const value: EventContextType = {
    events,
    todayEvents,
    upcomingEvents,
    completedEvents,
    cancelledEvents,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    cancelEvent,
    getEventById
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
