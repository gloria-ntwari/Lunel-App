import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryTabs from './CategoryTabs';
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
  return (
    <LinearGradient
      colors={["#5b1ab2", "#a73ada"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 5 }}
      style={styles.header}
    >
      <View style={styles.topRow}>
        <TouchableOpacity>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{greeting}</Text>
          </View>
        </TouchableOpacity>
        <Ionicons name="notifications-outline" size={22} color="#fff" />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#cfc5e6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search an event"
            placeholderTextColor="#cfc5e6"
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
    gap:12,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor:'#ffffff64',
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