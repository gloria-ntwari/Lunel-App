import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/User(Student)/EventScreenComponents/Header';
import { useAuth } from '../contexts/AuthContext';
import CategoryTabs from '../components/User(Student)/EventScreenComponents/CategoryTabs';
import RecommendedSection from '../components/User(Student)/EventScreenComponents/RecommendedSection';
import AllEventsSection from '../components/User(Student)/EventScreenComponents/AllEventsSection';
import BottomNav from '../components/User(Student)/BottomNav';
import CompletedEvents from '../components/User(Student)/EventScreenComponents/Completed';
import CancelledEventsSection from '../components/User(Student)/EventScreenComponents/CancelledEventsSection';
import { useEvents } from '../contexts/EventContext';

const EventScreen = () => {
  const { 
    todayEvents, 
    upcomingEvents, 
    completedEvents, 
    cancelledEvents,
    isLoading, 
    fetchEvents 
  } = useEvents();
  const { user } = useAuth();

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header greeting={`Hello, ${user?.name || 'Guest'}`} />
        <RecommendedSection events={todayEvents} isLoading={isLoading} />
        <AllEventsSection events={upcomingEvents} isLoading={isLoading} />
        <CompletedEvents events={completedEvents} isLoading={isLoading} />
        <CancelledEventsSection events={cancelledEvents} isLoading={isLoading} />
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