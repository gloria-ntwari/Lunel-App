import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Admin/Calendar/Header';
import BottomNav from '../components/Admin/BottomNav';
import CalendarCard from '../components/Admin/Calendar/CalendarCard';
import EventItem from '../components/Admin/Calendar/EventItem';
import EventModal from '../components/Admin/Calendar/EventModal';
import { format, isSameDay } from 'date-fns';
import { useCalendar } from '../contexts/CalendarContext';
import { useCategories } from '../contexts/CategoryContext';

const CalendarScreen = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);

    const { events, monthEvents, isLoading, fetchEventsByDate, fetchEventsByMonth, createEvent, updateEvent, cancelEvent } = useCalendar();
    const { fetchCategories } = useCategories();

    // Fetch categories and events when component mounts
    useEffect(() => {
        fetchCategories();
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

    const handleCreateEvent = async (eventData: any) => {
        try {
            await createEvent(eventData);
            Alert.alert('Success', 'Event created successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create event');
        }
    };

    const handleUpdateEvent = async (eventData: any) => {
        try {
            await updateEvent(editingEvent._id, eventData);
            setEditingEvent(null);
            Alert.alert('Success', 'Event updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update event');
        }
    };

    const handleCancelEvent = async (eventId: string) => {
        Alert.alert(
            'Cancel Event',
            'Are you sure you want to cancel this event?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Cancel Event',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await cancelEvent(eventId);
                            Alert.alert('Success', 'Event cancelled successfully!');
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to cancel event');
                        }
                    }
                }
            ]
        );
    };

    const handleEditEvent = (event: any) => {
        setEditingEvent(event);
        setIsModalVisible(true);
    };

    const handleAddEvent = () => {
        setEditingEvent(null);
        setIsModalVisible(true);
    };

    const handleModalSubmit = (eventData: any) => {
        if (editingEvent) {
            handleUpdateEvent(eventData);
        } else {
            handleCreateEvent(eventData);
        }
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
                    <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
                        <Ionicons name="add-circle" size={24} color="#5b1ab2" />
                    </TouchableOpacity>
                </View>

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading events...</Text>
                    </View>
                ) : events.length > 0 ? (
                    <FlatList
                        data={events}
                        renderItem={({ item }) => (
                            <EventItem 
                                event={item} 
                                onEdit={() => handleEditEvent(item)}
                                onCancel={() => handleCancelEvent(item._id)}
                            />
                        )}
                        keyExtractor={item => item._id}
                        scrollEnabled={false}
                    />
                ) : (
                    <View style={styles.noEventsContainer}>
                        <Text style={styles.noEventsText}>No events for this day</Text>
                        <TouchableOpacity style={styles.addEventButton} onPress={handleAddEvent}>
                            <Text style={styles.addEventButtonText}>Add Event</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <EventModal
                visible={isModalVisible}
                onClose={() => {
                    setIsModalVisible(false);
                    setEditingEvent(null);
                }}
                onSubmit={handleModalSubmit}
                event={editingEvent}
                selectedDate={selectedDate}
            />

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
    sectionHeaderRow: { 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24, 
        marginTop: 8, 
        marginBottom: 12 
    },
    sectionHeader: { fontSize: 16, fontWeight: '600', color: '#333' },
    addButton: {
        padding: 4,
    },
    loadingContainer: { 
        padding: 24, 
        alignItems: 'center' 
    },
    loadingText: { 
        color: '#666', 
        fontSize: 16 
    },
    noEventsContainer: { 
        padding: 24, 
        alignItems: 'center' 
    },
    noEventsText: { 
        color: '#999', 
        fontSize: 16,
        marginBottom: 16
    },
    addEventButton: {
        backgroundColor: '#5b1ab2',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addEventButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CalendarScreen;
