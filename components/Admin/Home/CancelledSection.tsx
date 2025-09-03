import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EventModal from './EventModal';
import EventActionsModal from './EventActionsModal';
import { useCategories } from '../../../contexts/CategoryContext';

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
  isCancelled?: boolean;
  cancelledAt?: Date;
  cancelledBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

interface CancelledSectionProps {
  cancelledEvents: Event[];
  onUpdateEvent: (event: Event) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  isLoading: boolean;
}

const CancelledSection: React.FC<CancelledSectionProps> = ({ 
  cancelledEvents, 
  onUpdateEvent, 
  onDeleteEvent, 
  isLoading 
}) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventForActions, setEventForActions] = useState<Event | null>(null);

  const { categories } = useCategories();
  const categoryNames = categories.map(cat => cat.name);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleEventLongPress = (event: Event) => {
    setEventForActions(event);
    setShowActionsModal(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    if (selectedEvent) {
      await onUpdateEvent({ ...selectedEvent, ...eventData });
      setShowEventModal(false);
      setSelectedEvent(null);
    }
  };

  const handleActionPress = async (action: string) => {
    if (!eventForActions) return;

    switch (action) {
      case 'edit':
        setSelectedEvent(eventForActions);
        setShowActionsModal(false);
        setShowEventModal(true);
        break;
      case 'delete':
        Alert.alert(
          'Delete Event',
          'Are you sure you want to delete this event? This action cannot be undone.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await onDeleteEvent(eventForActions._id);
                setShowActionsModal(false);
                setEventForActions(null);
              }
            }
          ]
        );
        break;
    }
  };

  const closeActionsModal = () => {
    setShowActionsModal(false);
    setEventForActions(null);
  };

  if (isLoading) {
    return (
      <View style={styles.recommendedContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Cancelled Events ❌</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading events...</Text>
        </View>
      </View>
    );
  }

  if (cancelledEvents.length === 0) {
    return (
      <View style={styles.recommendedContainer}>
        <View style={styles.header}>
          <Text style={styles.sectionTitle}>Cancelled Events ❌</Text>
        </View>
        <View style={styles.emptyState}>
          <MaterialIcons name="event-busy" size={48} color="#e74c3c" />
          <Text style={styles.emptyStateText}>No cancelled events</Text>
          <Text style={styles.emptyStateSubtext}>Cancelled events will appear here</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.recommendedContainer}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Cancelled Events ❌</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.events}
      >
        {cancelledEvents.map((event) => (
          <TouchableOpacity
            key={event._id}
            style={[styles.card, styles.cancelledCard]}
            onPress={() => handleEventPress(event)}
            onLongPress={() => handleEventLongPress(event)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
              style={[styles.cardImage, styles.cancelledImage]}
            />
            <View style={styles.cardTagRow}>
              <Text style={styles.cardTag}>{event.category.toLowerCase()}</Text>
              <View style={styles.cancelledBadge}>
                <MaterialIcons name="cancel" size={16} color="#fff" />
              </View>
            </View>
            <Text style={[styles.cardTitle, styles.cancelledTitle]} numberOfLines={2}>{event.title}</Text>
            <Text style={styles.cardLocation} numberOfLines={1}>📍 {event.location}</Text>
            <Text style={styles.cardMeta}>
              {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · 
              {event.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - 
              {event.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
            {event.cancelledAt && (
              <Text style={styles.cancelledDate}>
                Cancelled: {new Date(event.cancelledAt).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Event Modal for Edit */}
      <EventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        categories={categoryNames}
      />

      {/* Event Actions Modal */}
      <EventActionsModal
        visible={showActionsModal}
        onClose={closeActionsModal}
        onActionPress={handleActionPress}
        event={eventForActions}
        showCancelOption={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recommendedContainer: {
    paddingTop: 16,
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
    fontSize: 17,
    color: '#e74c3c',
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
  cancelledCard: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  cancelledImage: {
    opacity: 0.6,
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
  cancelledBadge: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 4,
  },
  cardTitle: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  cancelledTitle: {
    color: '#e74c3c',
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
    paddingBottom: 8,
    paddingTop: 4,
  },
  cancelledDate: {
    color: '#e74c3c',
    fontSize: 11,
    paddingHorizontal: 12,
    paddingBottom: 12,
    fontStyle: 'italic',
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

export default CancelledSection;
