import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/EventScreenComponents/Header';
import CategoryTabs from '../components/EventScreenComponents/CategoryTabs';
import RecommendedSection from '../components/EventScreenComponents/RecommendedSection';
import WeekEventsSection from '../components/EventScreenComponents/WeekEventsSection';
import BottomNav from '../components/BottomNav';

const EventScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header greeting="Hello, Gloria" />
        <RecommendedSection />
        <WeekEventsSection />
      </ScrollView>
      <BottomNav activeTab="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});

export default EventScreen;