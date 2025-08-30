import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CategoryTabs = () => {
  const [active, setActive] = useState('All events');
  const categories = ['All events', 'Concerts', 'Theater', 'Sports', 'Festival', 'Exhibition', 'Family'];

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {categories.map((label) => {
          const isActive = active === label;
          return (
            <TouchableOpacity
              key={label}
              onPress={() => setActive(label)}
              style={[styles.chip, isActive ? styles.chipActive : styles.chipInactive]}
            >
              <Text style={[styles.chipText, isActive ? styles.chipTextActive : styles.chipTextInactive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
  },
  tabsContainer: {
    paddingHorizontal: 12,
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 18,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: '#f96c3dff',
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor:'#ffffff64',
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#1b0b33',
  },
  chipTextInactive: {
    color: '#ffffff',
  },
});

export default CategoryTabs;