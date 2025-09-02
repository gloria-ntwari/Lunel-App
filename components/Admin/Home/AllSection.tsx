import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import EventModal from './EventModal';
import EventActionsModal from './EventActionsModal';

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
  isCompleted?: boolean;
  isToday?: boolean;
  isUpcoming?: boolean;
}

interface AllSectionProps {
  events: Event[];
  onUpdateEvent: (event: Event) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onCancelEvent: (eventId: string) => Promise<void>;
  isLoading: boolean;
}

const AllSection = ({ events, onUpdateEvent, onDeleteEvent, onCancelEvent, isLoading }: AllSectionProps) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [eventForActions, setEventForActions] = useState<Event | null>(null);

  const categories = ['Concert', 'Theater', 'Sports', 'Festival', 'Exhibition'];

  const handleEventPress = (event: Event) => {
    setEventForActions(event);
    setShowActionsModal(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    if (selectedEvent) {
      // Update existing event
      await onUpdateEvent({ ...selectedEvent, ...eventData });
    }
    setShowEventModal(false);
  };

  const handleActionPress = async (action: string) => {
    if (!eventForActions) return;

    switch (action) {
      case 'edit':
        setSelectedEvent(eventForActions);
        setShowActionsModal(false);
        setShowEventModal(true);
        break;
      case 'cancel':
        await handleCancelEvent();
        setShowActionsModal(false);
        break;
      case 'delete':
        await handleDeleteEvent();
        setShowActionsModal(false);
        break;
    }
  };

  const handleDeleteEvent = () => {
    if (eventForActions) {
      Alert.alert(
        'Delete Event',
        `Are you sure you want to delete "${eventForActions.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await onDeleteEvent(eventForActions._id);
            }
          }
        ]
      );
    }
  };

  const handleCancelEvent = () => {
    if (eventForActions) {
      Alert.alert(
        'Cancel Event',
        `Are you sure you want to cancel "${eventForActions.title}"?`,
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Cancel Event',
            style: 'destructive',
            onPress: async () => {
              await onCancelEvent(eventForActions._id);
            }
          }
        ]
      );
    }
  };

  const closeActionsModal = () => {
    setShowActionsModal(false);
    setEventForActions(null);
  };

  return (
    <View style={styles.recommendedContainer}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>All Events </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.events}
      >
        {events.map((event) => (
          <TouchableOpacity
            key={event._id}
            style={styles.card}
            onPress={() => handleEventPress(event)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: event.image || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
              style={styles.cardImage}
            />
            <View style={styles.cardTagRow}>
              <Text style={styles.cardTag}>{event.category.toLowerCase()}</Text>
              {event.isCompleted && (
                <View style={styles.completedBadge}>
                  <MaterialIcons name="check-circle" size={16} color="#27ae60" />
                </View>
              )}
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
            <Text style={styles.cardMeta}>
              {event.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ·
              {event.startTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} -
              {event.endTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Event Modal for Edit */}
      <EventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        categories={categories}
      />

      {/* Event Actions Modal */}
      <EventActionsModal
        visible={showActionsModal}
        onClose={closeActionsModal}
        onActionPress={handleActionPress}
        event={eventForActions}
        showCancelOption={true}
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
  cardMeta: {
    color: '#444346ff',
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 4,
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 4,
  },
});

export default AllSection;