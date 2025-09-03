import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import TodaySection from './TodaySection';
import AllSection from './AllSection';
import CompletedSection from './CompletedSection';
import CancelledSection from './CancelledSection';
import { useEvents } from '../../../contexts/EventContext';
import { useCategories } from '../../../contexts/CategoryContext';

const EventManager = () => {
    const { 
        todayEvents, 
        upcomingEvents, 
        completedEvents, 
        cancelledEvents,
        isLoading, 
        fetchEvents,
        createEvent,
        updateEvent,
        deleteEvent,
        cancelEvent
    } = useEvents();

    const { categories, fetchCategories } = useCategories();

    // Fetch events and categories when component mounts
    useEffect(() => {
        fetchEvents();
        fetchCategories();
    }, []);

    const handleAddEvent = async (newEvent: any) => {
        try {
            // Convert Date objects to ISO strings for API
            const eventData = {
                ...newEvent,
                date: newEvent.date instanceof Date ? newEvent.date.toISOString() : newEvent.date,
                startTime: newEvent.startTime instanceof Date ? newEvent.startTime.toISOString() : newEvent.startTime,
                endTime: newEvent.endTime instanceof Date ? newEvent.endTime.toISOString() : newEvent.endTime,
            };

            const result = await createEvent(eventData);
            if (result.success) {
                // Events will be automatically updated in context
                console.log('Event created successfully');
            } else {
                console.error('Failed to create event:', result.message);
            }
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleUpdateEvent = async (updatedEvent: any) => {
        try {
            // Convert Date objects to ISO strings for API
            const eventData = {
                ...updatedEvent,
                date: updatedEvent.date instanceof Date ? updatedEvent.date.toISOString() : updatedEvent.date,
                startTime: updatedEvent.startTime instanceof Date ? updatedEvent.startTime.toISOString() : updatedEvent.startTime,
                endTime: updatedEvent.endTime instanceof Date ? updatedEvent.endTime.toISOString() : updatedEvent.endTime,
            };

            const result = await updateEvent(updatedEvent._id, eventData);
            if (result.success) {
                console.log('Event updated successfully');
            } else {
                console.error('Failed to update event:', result.message);
            }
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const handleDeleteEvent = async (eventId: string) => {
        try {
            const result = await deleteEvent(eventId);
            if (result.success) {
                console.log('Event deleted successfully');
            } else {
                console.error('Failed to delete event:', result.message);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const handleCancelEvent = async (eventId: string) => {
        try {
            const result = await cancelEvent(eventId);
            if (result.success) {
                console.log('Event cancelled successfully');
            } else {
                console.error('Failed to cancel event:', result.message);
            }
        } catch (error) {
            console.error('Error cancelling event:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TodaySection
                events={todayEvents}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onCancelEvent={handleCancelEvent}
                isLoading={isLoading}
            />
            <AllSection
                events={upcomingEvents}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onCancelEvent={handleCancelEvent}
                isLoading={isLoading}
            />
            <CompletedSection
                completedEvents={completedEvents}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                isLoading={isLoading}
            />
            <CancelledSection
                cancelledEvents={cancelledEvents}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                isLoading={isLoading}
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
