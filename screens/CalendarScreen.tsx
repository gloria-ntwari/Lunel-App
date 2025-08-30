import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import Header from '../components/Calendar/Header';
import BottomNav from '../components/BottomNav';
import CalendarCard from '../components/Calendar/CalendarCard';
import EventItem from '../components/Calendar/EventItem';
import { format, isSameDay } from 'date-fns';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Events (replace with API later)
    const [events] = useState([
        { id: '1', title: 'Health and Wellness Expo', location: 'International Exhibition Center', date: new Date(2025, 7, 29), time: '8:00 AM - 3:00 PM' },
        { id: '2', title: 'Startup Grind Kyiv: Tech Innovations', location: 'UNIT.City', date: new Date(2025, 7, 29), time: '9:00 AM - 4:00 PM' },
        { id: '3', title: 'Music Festival', location: 'Central Park', date: new Date(2025, 7, 30), time: '6:00 PM - 11:00 PM' },
    ]);

    const filteredEvents = events.filter(event => isSameDay(event.date, selectedDate));

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header greeting="Calendar" />

                {/* Calendar */}
                <View style={styles.calendarWrapper}>
                    <CalendarCard
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                        events={events}
                    />
                </View>

                {/* Events for selected date */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>
                        {format(selectedDate, 'EEEE, d MMMM yyyy')}
                    </Text>
                </View>

                {filteredEvents.length > 0 ? (
                    <FlatList
                        data={filteredEvents}
                        renderItem={({ item }) => <EventItem event={item} />}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                    />
                ) : (
                    <View style={styles.noEventsContainer}>
                        <Text style={styles.noEventsText}>No events for this day</Text>
                    </View>
                )}
            </ScrollView>
            <BottomNav activeTab="Calendar" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'white' },
    calendarWrapper: {
        marginTop: -120,
        zIndex: 10,
    },
    scrollView: { flex: 1 },
    sectionHeaderRow: { paddingHorizontal: 24, marginTop: 8, marginBottom: 12 },
    sectionHeader: { fontSize: 16, fontWeight: '600', color: '#333' },
    noEventsContainer: { padding: 24, alignItems: 'center' },
    noEventsText: { color: '#999', fontSize: 16 },
});

export default CalendarScreen;
