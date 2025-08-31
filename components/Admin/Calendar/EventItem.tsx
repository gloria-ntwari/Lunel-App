import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EventItem = ({ event }: { event: any }) => (
  <View style={styles.eventRow}>
    <View style={styles.eventTimeContainer}>
      <Text style={styles.eventTime}>{event.time}</Text>
    </View>
    <View style={styles.eventDetails}>
      <Text style={styles.eventTitle}>{event.title}</Text>
      <Text style={styles.eventSubTitle}>{event.location}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  eventRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  eventTimeContainer: { width: 100 },
  eventTime: { color: '#f96c3d', fontWeight: '600', fontSize: 14 },
  eventDetails: { flex: 1, marginLeft: 16 },
  eventTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 2 },
  eventSubTitle: { fontSize: 14, color: '#666' },
});

export default EventItem;
