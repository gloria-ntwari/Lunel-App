import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WeekEventsSection = () => {
  return (
    <View style={styles.weekEventsContainer}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Week events</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.events}
      >
        {[1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.card}>
                    <Image
                      source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' }}
                      style={styles.cardImage}
                    />
                    <View style={styles.cardTagRow}>
                      <Text style={styles.cardTag}>concert</Text>
                    </View>
                    <Text style={styles.cardTitle} numberOfLines={2}>KAZKA band concert in Kyiv</Text>
                    <Text style={styles.cardMeta}>15 Sep  ·  8:00AM - 11:00AM</Text>
                  </View>
                ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  weekEventsContainer: {
    paddingTop: 8,
    paddingBottom: 16,

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
    borderColor:'white',
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
});

export default WeekEventsSection;