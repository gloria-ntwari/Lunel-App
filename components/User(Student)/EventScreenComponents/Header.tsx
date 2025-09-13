import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryTabs from './CategoryTabs';
import NotificationModal from '../NotificationModal';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotifications } from '../../../contexts/NotificationsContext';
import { useEvents } from '../../../contexts/EventContext';

let LinearGradient: any;
try {
  // Lazy require to avoid breaking if not installed yet
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, style }: any) => <View style={[style, { backgroundColor: '#5b1ab2' }]}>{children}</View>;
}

interface HeaderProps {
  greeting: string;
}

const Header = ({ greeting }: HeaderProps) => {
  const { user } = useAuth();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const { setSearchQuery } = useEvents();
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchNotifications(); }, []);

  const handleNotificationPress = () => { setNotificationModalVisible(true); };

  const handleCloseNotificationModal = () => {
    setNotificationModalVisible(false);
  };

  const handleMarkAsRead = (id: string) => { markAsRead(id); };
  const handleMarkAllAsRead = () => { markAllAsRead(); };

  return (
    <>
      <LinearGradient
        colors={["#5b1ab2", "#a73ada"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 5 }}
        style={styles.header}
      >
        <View style={styles.topRow}>
          <TouchableOpacity>
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>{user ? `Hello, ${user.name}` : greeting}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={handleNotificationPress}
          >
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={18} color="#cfc5e6" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search an event"
              placeholderTextColor="#cfc5e6"
              value={search}
              onChangeText={(t) => {
                setSearch(t);
                setSearchQuery(t);
              }}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialCommunityIcons name="tune-variant" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ marginLeft: -10, marginTop: 20 }}>
          <CategoryTabs />
        </View>
      </LinearGradient>

      <NotificationModal
        visible={notificationModalVisible}
        onClose={handleCloseNotificationModal}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,

  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 6,
    fontWeight: '600',
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f96c3d',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#5b1ab2',
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff64',
    paddingLeft: 36,
    paddingRight: 12,
    height: 40,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
  },
  searchBar: {
    color: '#fff',
    fontSize: 14,
  },
  filterButton: {
    width: 40,
    height: 40,
    marginLeft: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Header;