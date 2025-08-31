import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

type TabKey = 'Home' | 'Calendar' | 'Timetable' | 'Profile';

interface BottomNavProps {
  activeTab?: TabKey;
}

const BottomNav = ({ activeTab = 'Home' }: BottomNavProps) => {
  const navigation: any = useNavigation();
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('AdminHome')}
      >
        <Ionicons name="home-outline" size={24} color={activeTab === 'Home' ? '#f96c3d' : '#b7b0b0ff'} />
        <Text style={[styles.navText, activeTab === 'Home' && styles.navTextActive]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Calendar')}
      >
        <Ionicons name="calendar-outline" size={24} color={activeTab === 'Calendar' ? '#f96c3d' : '#b7b0b0ff'} />
        <Text style={[styles.navText, activeTab === 'Calendar' && styles.navTextActive]}>Calendar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('AdminMeals')}
      >
        <Ionicons name="fast-food-outline" size={24} color={activeTab === 'Timetable' ? '#f96c3d' : '#b7b0b0ff'} />
        <Text style={[styles.navText, activeTab === 'Timetable' && styles.navTextActive]}>Meals</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}
      onPress={() => navigation.navigate('Profile')}
       >
        <Ionicons name="person-outline" size={24} color={activeTab === 'Profile' ? '#f96c3d' : '#b7b0b0ff'} />
        <Text style={[styles.navText, activeTab === 'Profile' && styles.navTextActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 30,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    color: '#9c9797ff',
    fontSize: 11,
    marginTop: 4,
  },
  navTextActive: {
    color: '#f96c3d',
    fontWeight: '600',
  },
});

export default BottomNav;