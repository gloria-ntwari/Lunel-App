import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

interface CompletedSectionProps {
    completedEvents: Event[];
    onUpdateEvent: (event: Event) => void;
    onDeleteEvent: (eventId: string) => void;
}

const CompletedSection = ({ completedEvents, onUpdateEvent, onDeleteEvent }: CompletedSectionProps) => {
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [showActionsModal, setShowActionsModal] = useState(false);
    const [eventForActions, setEventForActions] = useState<Event | null>(null);

    const categories = ['Concert', 'Theater', 'Sports', 'Festival', 'Exhibition'];

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

    };

    const handleSaveEvent = (event: Event) => {
        if (selectedEvent) {
            // Update existing event
            onUpdateEvent(event);
        }
        setShowEventModal(false);
    };

    const closeActionsModal = () => {
        setShowActionsModal(false);
        setEventForActions(null);
    };

    if (completedEvents.length === 0) {
        return (
            <View style={styles.recommendedContainer}>
                <View style={styles.header}>
                    <Text style={styles.sectionTitle}>Completed Events ✅</Text>
                </View>
                <View style={styles.emptyState}>
                    <MaterialIcons name="event-available" size={48} color="#ccc" />
                    <Text style={styles.emptyStateText}>No completed events yet</Text>
                    <Text style={styles.emptyStateSubtext}>Events will appear here once marked as completed</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.recommendedContainer}>
            <View style={styles.header}>
                <Text style={styles.sectionTitle}>Completed Events ✅</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.events}
            >
                {completedEvents.map((event) => (
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
                            <View style={styles.completedBadge}>
                                <MaterialIcons name="check-circle" size={16} color="#27ae60" />
                            </View>
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
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
                onMarkCompleted={handleMarkCompleted}
                eventTitle={eventForActions?.title || ''}
                isCompleted={eventForActions?.isCompleted || true}
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
        opacity: 0.7, // Make completed events slightly faded
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
    completedBadge: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderRadius: 10,
        padding: 4,
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
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default CompletedSection;
