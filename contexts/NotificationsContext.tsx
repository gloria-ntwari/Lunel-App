import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

axios.defaults.baseURL = API_CONFIG.BASE_URL;

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'event_created' | 'event_cancelled';
  isRead: boolean;
  createdAt: string;
}

interface NotificationsContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/notifications');
      setNotifications(res.data?.data?.notifications || []);
    } catch (e) {
      // ignore silently
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axios.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (e) { /* ignore */ }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const value: NotificationsContextType = {
    notifications,
    unreadCount: notifications.filter(n => !n.isRead).length,
    fetchNotifications,
    markAsRead,
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


