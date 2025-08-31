import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/User(Student)/EventScreenComponents/Header';
import CategoryTabs from '../components/User(Student)/EventScreenComponents/CategoryTabs';
import RecommendedSection from '../components/User(Student)/EventScreenComponents/RecommendedSection';
import WeekEventsSection from '../components/User(Student)/EventScreenComponents/WeekEventsSection';
import BottomNav from '../components/User(Student)/BottomNav';
import CompletedEvents from '../components/User(Student)/EventScreenComponents/Completed';

const EventScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header greeting="Hello, Gloria" />
        <RecommendedSection />
        <WeekEventsSection />
        <CompletedEvents />
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