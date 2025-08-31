import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TodaySection from './TodaySection';
import AllSection from './AllSection';
import CompletedSection from './CompletedSection';

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

const EventManager = () => {
    const [allEvents, setAllEvents] = useState<Event[]>([]);

    // Initialize with some sample events
    useEffect(() => {
        const sampleEvents: Event[] = [
            {
                id: '1',
                title: 'KAZKA band concert in Kyiv',
                category: 'Concert',
                date: new Date('2024-09-15'),
                startTime: new Date('2024-09-15T08:00:00'),
                endTime: new Date('2024-09-15T11:00:00'),
                location: 'Kyiv Concert Hall',
                image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                isCompleted: false
            },
            {
                id: '2',
                title: 'Theater Performance',
                category: 'Theater',
                date: new Date('2024-09-16'),
                startTime: new Date('2024-09-16T14:00:00'),
                endTime: new Date('2024-09-16T16:00:00'),
                location: 'National Theater',
                image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                isCompleted: false
            },
            {
                id: '3',
                title: 'Sports Tournament',
                category: 'Sports',
                date: new Date('2024-09-17'),
                startTime: new Date('2024-09-17T10:00:00'),
                endTime: new Date('2024-09-17T18:00:00'),
                location: 'Sports Complex',
                image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                isCompleted: false
            },
            {
                id: '4',
                title: 'Art Exhibition',
                category: 'Exhibition',
                date: new Date('2024-09-18'),
                startTime: new Date('2024-09-18T09:00:00'),
                endTime: new Date('2024-09-18T17:00:00'),
                location: 'Art Gallery',
                image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                isCompleted: false
            }
        ];
        setAllEvents(sampleEvents);
    }, []);

    const handleAddEvent = (newEvent: Event) => {
        const eventWithId = { ...newEvent, id: Date.now().toString(), isCompleted: false };
        setAllEvents(prev => [...prev, eventWithId]);
    };

    const handleUpdateEvent = (updatedEvent: Event) => {
        setAllEvents(prev => prev.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        ));
    };

    const handleDeleteEvent = (eventId: string) => {
        setAllEvents(prev => prev.filter(event => event.id !== eventId));
    };

    const handleMarkCompleted = (eventId: string) => {
        setAllEvents(prev => prev.map(event =>
            event.id === eventId
                ? { ...event, isCompleted: true }
                : event
        ));
    };

    const handleMarkNotCompleted = (eventId: string) => {
        setAllEvents(prev => prev.map(event =>
            event.id === eventId
                ? { ...event, isCompleted: false }
                : event
        ));
    };

    // Filter events for different sections
    // Show all active events in Today's Events section (not filtered by date)
    const activeEvents = allEvents.filter(event => !event.isCompleted);
    const completedEvents = allEvents.filter(event => event.isCompleted);

    return (
        <View style={styles.container}>
            <TodaySection
                events={activeEvents}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onMarkCompleted={handleMarkCompleted}
            />
            <AllSection
                events={activeEvents}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onMarkCompleted={handleMarkCompleted}
            />
            <CompletedSection
                completedEvents={completedEvents}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default EventManager;
