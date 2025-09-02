import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/Admin/BottomNav';
import { useAuth } from '../contexts/AuthContext';

const AdminProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, refreshUserData } = useAuth();
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    joinDate: 'January 2024',
    permissions: ['Manage Events', 'Manage Meals', 'Manage Admins']
  });

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setAdminInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        role: user.role === 'super_admin' ? 'Super Admin' : 
              user.role === 'admin' ? 'Admin' : 'User',
      }));
    }
  }, [user]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await logout();
              navigation.navigate('Login' as never);
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleManageAdmins = () => {
    // Navigate to admin management screen
    navigation.navigate('AdminManagement' as never);
  };

  const handleManageUsers = () => {
    // Navigate to user management screen
    console.log('Navigate to User Management');
  };

  const handleSettings = () => {
    // Navigate to admin settings
    console.log('Navigate to Admin Settings');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Admin Profile</Text>
            <Text style={styles.headerSubtitle}>Manage your account and system</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: adminInfo.avatar }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.adminName}>{adminInfo.name}</Text>
            <Text style={styles.adminRole}>{adminInfo.role}</Text>
            <Text style={styles.adminEmail}>{adminInfo.email}</Text>
            <Text style={styles.joinDate}>Member since {adminInfo.joinDate}</Text>
          </View>
        </View>

        {/* Admin Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Actions</Text>

          <TouchableOpacity style={styles.actionCard} onPress={handleManageAdmins}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="admin-panel-settings" size={24} color="#5b1ab2" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Admins</Text>
              <Text style={styles.actionSubtitle}>Add, edit, or remove admin users</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Permissions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Permissions</Text>
          <View style={styles.permissionsContainer}>
            {adminInfo.permissions.map((permission, index) => (
              <View key={index} style={styles.permissionItem}>
                <MaterialIcons name="check-circle" size={20} color="#27ae60" />
                <Text style={styles.permissionText}>{permission}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>24</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>7</Text>
              <Text style={styles.statLabel}>Meal Plans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>156</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomNav activeTab="Profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginTop: 36,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#5b1ab2',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
  },
  profileCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  adminName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  adminRole: {
    fontSize: 14,
    color: '#5b1ab2',
    fontWeight: '500',
    marginBottom: 4,
  },
  adminEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  permissionsContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f96c3d',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default AdminProfileScreen;
