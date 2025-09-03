import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import Header from '../components/User(Student)/Calendar/Header';
import BottomNav from '../components/User(Student)/BottomNav';
import CalendarCard from '../components/User(Student)/Calendar/CalendarCard';
import EventItem from '../components/User(Student)/Calendar/EventItem';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { events, monthEvents, isLoading, fetchEventsByDate, fetchEventsByMonth } = useCalendar();

    // Fetch events when component mounts
    useEffect(() => {
        fetchEventsByDate(selectedDate);
        fetchEventsByMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    }, []);

    // Fetch events when selected date changes
    useEffect(() => {
        fetchEventsByDate(selectedDate);
    }, [selectedDate]);

    // Fetch month events when month changes
    useEffect(() => {
        fetchEventsByMonth(selectedDate.getFullYear(), selectedDate.getMonth());
    }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header greeting="Calendar" />

                {/* Calendar */}
                <View style={styles.calendarWrapper}>
                    <CalendarCard
                        selectedDate={selectedDate}
                        onDateChange={handleDateChange}
                        events={monthEvents}
                    />
                </View>

                {/* Events for selected date */}
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionHeader}>
                        {format(selectedDate, 'EEEE, d MMMM yyyy')}
                    </Text>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading events...</Text>
                    </View>
                ) : events.length > 0 ? (
                    <FlatList
                        data={events}
                        renderItem={({ item }) => <EventItem event={item} />}
                        keyExtractor={item => item._id}
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
    loadingContainer: { 
        padding: 24, 
        alignItems: 'center' 
    },
    loadingText: { 
        color: '#666', 
        fontSize: 16 
    },
    noEventsContainer: { padding: 24, alignItems: 'center' },
    noEventsText: { color: '#999', fontSize: 16 },
});

export default CalendarScreen;
