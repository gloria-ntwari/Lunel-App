import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import EventModal from './EventModal';
import EventActionsModal from './EventActionsModal';

interface Event {
  id: string;
  title: string;
  category: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  location: string;
  image: string | null;
  isCompleted: boolean;
}

interface TodaySectionProps {
  events: Event[];
  onAddEvent: (event: Event) => void;
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onMarkCompleted: (eventId: string) => void;
}

const TodaySection = ({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onMarkCompleted
}: TodaySectionProps) => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [eventForActions, setEventForActions] = useState<Event | null>(null);

  const categories = ['Concert', 'Theater', 'Sports', 'Festival', 'Exhibition'];

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowEventModal(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      // Update existing event
      onUpdateEvent(event);
    } else {
      // Add new event
      onAddEvent(event);
    }
    setShowEventModal(false);
  };

  const handleEventPress = (event: Event) => {
    setEventForActions(event);
    setShowActionsModal(true);
  };

  const handleEditEvent = () => {
    if (eventForActions) {
      setSelectedEvent(eventForActions);
      setShowEventModal(true);
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
            onPress: () => {
              onDeleteEvent(eventForActions.id);
            }
          }
        ]
      );
    }
  };

  const handleMarkCompleted = () => {
    if (eventForActions) {
      onMarkCompleted(eventForActions.id);
    }
  };

  const closeActionsModal = () => {
    setShowActionsModal(false);
    setEventForActions(null);
  };

  return (
    <View style={styles.recommendedContainer}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Today's Events 🔥</Text>
        <TouchableOpacity onPress={handleAddEvent} style={styles.addButton} >
          <Ionicons name="add-circle" size={20} color="#f96c3d" />
          <Text style={styles.addButtonText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.events}
      >
        {events.map((event) => (
          <TouchableOpacity
            key={event.id}
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

      <EventModal
        visible={showEventModal}
        onClose={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        categories={categories}
      />
      <EventActionsModal
        visible={showActionsModal}
        onClose={closeActionsModal}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onMarkCompleted={handleMarkCompleted}
        eventTitle={eventForActions?.title || ''}
        isCompleted={eventForActions?.isCompleted || false}
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
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: 17,
    color: '#333',
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
  addButtonText: {
    color: '#f96c3d',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 219, 219, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(222, 191, 191, 0.3)',
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
    backgroundColor: 'rgba(39, 174, 96, 0.2)',
    borderRadius: 10,
    padding: 4,
  },
});

export default TodaySection;