import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

axios.defaults.baseURL = API_CONFIG.BASE_URL;

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'event_created' | 'event_cancelled';
  eventId: string;
  eventTitle: string;
  eventDate: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data?.data?.notifications || []);
    } catch (e) {
      // ignore silently
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get('/notifications/unread-count');
      setUnreadCount(res.data?.data?.unreadCount || 0);
    } catch (e) {
      // ignore silently
    }
  };

  const markAsRead = async (id: string) => {
    if (!id || id === 'undefined') {
      console.warn('Invalid notification ID:', id);
      return;
    }
    try {
      await axios.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) { 
      console.error('Mark as read error:', e);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post('/notifications/mark-all-read');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) { 
      console.error('Mark all as read error:', e);
    }
  };

  useEffect(() => { 
    fetchNotifications(); 
    fetchUnreadCount();
  }, []);

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    fetchUnreadCount,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}


