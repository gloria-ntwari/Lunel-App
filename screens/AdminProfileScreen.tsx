import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BottomNav from '../components/Admin/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

const AdminProfileScreen = () => {
  const navigation = useNavigation();
  const { user, logout, refreshUserData, updateProfile } = useAuth();
  const [stats, setStats] = useState({ events: 0, meals: 0, users: 0, admins: 0, students: 0 });
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    role: '',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    joinDate: 'January 2024',
    permissions: ['Manage Events', 'Manage Meals', 'Manage Admins']
  });

  // Edit state
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Load user data when component mounts or user changes
  useEffect(() => {
    if (user) {
      setAdminInfo(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        role: user.role === 'super_admin' ? 'Super Admin' :
              user.role === 'admin' ? 'Admin' :
              user.role === 'event_manager' ? 'Event Manager' :
              user.role === 'meal_coordinator' ? 'Meal Coordinator' : 'User',
        permissions: user.role === 'super_admin' ? ['Manage Events','Manage Meals','Manage Admins'] :
                     user.role === 'admin' ? ['Manage Events','Manage Meals'] :
                     user.role === 'event_manager' ? ['Manage Events'] :
                     user.role === 'meal_coordinator' ? ['Manage Meals'] : [],
      }));
      setEditName(user.name || '');
      setEditEmail(user.email || '');
      // load stats
      axios.get(`${API_CONFIG.BASE_URL}/stats/overview`).then(res => {
        const d = res.data?.data;
        if (d) setStats(d);
      }).catch(() => {});
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

  const handleManageCategories = () => {
    // Navigate to category management screen
    navigation.navigate('CategoryManagement' as never);
  };

  const handleManageUsers = () => {
    // Navigate to user management screen
    console.log('Navigate to User Management');
  };

  const handleSettings = () => {
    // Navigate to admin settings
    console.log('Navigate to Admin Settings');
  };

  const handleSaveProfile = async () => {
    try {
      if (!editName.trim() || !editEmail.trim()) {
        Alert.alert('Validation', 'Name and Email are required.');
        return;
      }
      setSavingProfile(true);
      const result = await updateProfile(editName.trim(), editEmail.trim());
      if (result.success) {
        await refreshUserData();
        Alert.alert('Success', 'Profile updated successfully.');
      } else {
        Alert.alert('Update failed', result.message || 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!newPassword || !confirmPassword) {
        Alert.alert('Validation', 'Please enter and confirm your new password.');
        return;
      }
      if (newPassword.length < 6) {
        Alert.alert('Validation', 'Password must be at least 6 characters.');
        return;
      }
      if (newPassword !== confirmPassword) {
        Alert.alert('Validation', 'Passwords do not match.');
        return;
      }
      setSavingPassword(true);
      const result = await updateProfile(editName || user?.name || '', editEmail || user?.email || '', newPassword);
      if (result.success) {
        setNewPassword('');
        setConfirmPassword('');
        Alert.alert('Success', 'Password changed successfully.');
      } else {
        Alert.alert('Change failed', result.message || 'Please try again.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
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

          <TouchableOpacity style={styles.actionCard} onPress={handleManageCategories}>
            <View style={styles.actionIcon}>
              <MaterialIcons name="category" size={24} color="#f96c3d" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Manage Categories</Text>
              <Text style={styles.actionSubtitle}>Create, edit, or delete event categories</Text>
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

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name"
              autoCapitalize="words"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.primaryButton} onPress={handleSaveProfile} disabled={savingProfile}>
              {savingProfile ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryButtonText}>Save Profile</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Change Password */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>
          <View style={styles.card}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
              secureTextEntry
            />
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              secureTextEntry
            />
            <TouchableOpacity style={styles.secondaryButton} onPress={handleChangePassword} disabled={savingPassword}>
              {savingPassword ? <ActivityIndicator color="#5b1ab2" /> : <Text style={styles.secondaryButtonText}>Update Password</Text>}
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.events}</Text>
              <Text style={styles.statLabel}>Events</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.meals}</Text>
              <Text style={styles.statLabel}>Meal Plans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.users}</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.admins}</Text>
              <Text style={styles.statLabel}>Admins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.students}</Text>
              <Text style={styles.statLabel}>Students</Text>
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
  card: {
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
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  primaryButton: {
    marginTop: 14,
    backgroundColor: '#5b1ab2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 14,
    backgroundColor: 'rgba(91,26,178,0.08)',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#5b1ab2',
  },
  secondaryButtonText: {
    color: '#5b1ab2',
    fontSize: 16,
    fontWeight: '600',
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
