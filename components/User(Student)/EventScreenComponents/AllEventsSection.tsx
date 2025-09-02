import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

interface Event {
  _id: string;
  title: string;
  description?: string;
  category: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  image?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isCompleted?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
}

interface AllEventsSectionProps {
  events: Event[];
  isLoading: boolean;
}

const AllEventsSection: React.FC<AllEventsSectionProps> = ({ events, isLoading }) => {
  if (isLoading) {
    return (
      <View style={styles.recommendedContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>All Events 📅</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a73e8" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.recommendedContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>All Events</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No upcoming events yet</Text>
          <Text style={styles.emptyStateSubtext}>Check back later for new events</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.recommendedContainer}>
              <View style={styles.header}>
          <Text style={styles.sectionTitle}>All Events 📅</Text>
        </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.events}
      >
        {events.map((event) => (
          <TouchableOpacity key={event._id} style={styles.card} activeOpacity={0.8}>
            <Image
              source={{ uri: event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
              style={styles.cardImage}
            />
            <View style={styles.cardTagRow}>
              <Text style={styles.cardTag}>{event.category.toLowerCase()}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>📍 {event.location}</Text>
            <Text style={styles.cardMeta}>
              {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 
              {event.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
              {event.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>                  
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 17,
  },
  seeAll: {
    color: '#1a73e8',
    fontSize: 14,
  },
  events: {
    paddingHorizontal: 12,
  },
  card: {
    width: 240,
    marginRight: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cardTagRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardTag: {
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
    overflow: 'hidden',
  },
  cardViews: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 12,
  },
  cardTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  cardLocation: {
    color: '#666',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingTop: 4,
  },
  cardMeta: {
    color: '#444346ff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default AllEventsSection;
