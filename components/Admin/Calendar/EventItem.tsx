import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EventItemProps {
  event: any;
  onEdit?: () => void;
  onCancel?: () => void;
}

const EventItem: React.FC<EventItemProps> = ({ event, onEdit, onCancel }) => {
  const formatTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const end = new Date(endTime).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${start} - ${end}`;
  };

  return (
    <View style={styles.eventRow}>
      <View style={styles.eventTimeContainer}>
        <Text style={styles.eventTime}>
          {formatTime(event.startTime, event.endTime)}
        </Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventSubTitle}>{event.location}</Text>
        <Text style={styles.eventCategory}>{event.category}</Text>
      </View>
      {(onEdit || onCancel) && (
        <View style={styles.eventActions}>
          {onEdit && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Ionicons name="pencil" size={16} color="#5b1ab2" />
            </TouchableOpacity>
          )}
          {onCancel && (
            <TouchableOpacity style={styles.actionButton} onPress={onCancel}>
              <Ionicons name="close-circle" size={16} color="#e74c3c" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  eventRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  eventTimeContainer: { 
    width: 100 
  },
  eventTime: { 
    color: '#f96c3d', 
    fontWeight: '600', 
    fontSize: 14 
  },
  eventDetails: { 
    flex: 1, 
    marginLeft: 16 
  },
  eventTitle: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#333', 
    marginBottom: 2 
  },
  eventSubTitle: { 
    fontSize: 14, 
    color: '#666',
    marginBottom: 2
  },
  eventCategory: {
    fontSize: 12,
    color: '#5b1ab2',
    fontWeight: '500',
  },
  eventActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
  },
});

export default EventItem;
