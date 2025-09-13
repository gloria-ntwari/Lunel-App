import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NotificationItem } from '../../contexts/NotificationsContext';

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
    notifications: NotificationItem[];
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

const NotificationModal = ({ visible, onClose, notifications, onMarkAsRead, onMarkAllAsRead }: NotificationModalProps) => {
    const navigation = useNavigation();

    const handleNotificationPress = (notification: NotificationItem) => {
        if (!notification.isRead) {
            onMarkAsRead(notification._id);
        }
        
        // Navigate to Event screen and determine which section to show
        const eventDate = new Date(notification.eventDate);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        let targetSection = 'upcoming'; // default
        if (notification.type === 'event_cancelled') {
            targetSection = 'cancelled';
        } else if (eventDate.toDateString() === today.toDateString()) {
            targetSection = 'today';
        } else if (eventDate < today) {
            targetSection = 'completed';
        }
        
        onClose();
        navigation.navigate('Event' as never, { scrollToSection: targetSection } as never);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'event_created':
                return 'event';
            case 'event_cancelled':
                return 'cancel';
            default:
                return 'notifications';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'event_created':
                return '#5b1ab2';
            case 'event_cancelled':
                return '#e74c3c';
            default:
                return '#666';
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.headerTitle}>Notifications</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            {/* Notifications List */}
                            <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
                                {notifications.length === 0 ? (
                                    <View style={styles.emptyState}>
                                        <MaterialIcons name="notifications-none" size={48} color="#ccc" />
                                        <Text style={styles.emptyText}>No notifications yet</Text>
                                        <Text style={styles.emptySubtext}>You're all caught up!</Text>
                                    </View>
                                ) : (
                                    notifications.map((notification) => (
                                        <TouchableOpacity
                                            key={notification._id}
                                            style={[
                                                styles.notificationItem,
                                                !notification.isRead && styles.unreadNotification
                                            ]}
                                            onPress={() => handleNotificationPress(notification)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.notificationIcon}>
                                                <MaterialIcons
                                                    name={getNotificationIcon(notification.type) as any}
                                                    size={24}
                                                    color={getNotificationColor(notification.type)}
                                                />
                                            </View>

                                            <View style={styles.notificationContent}>
                                                <Text style={styles.notificationTitle}>{notification.title}</Text>
                                                <Text style={styles.notificationMessage}>{notification.message}</Text>
                                                <Text style={styles.notificationTime}>{formatTime(notification.createdAt)}</Text>
                                            </View>

                                            {!notification.isRead && (
                                                <View style={styles.unreadIndicator} />
                                            )}
                                        </TouchableOpacity>
                                    ))
                                )}
                            </ScrollView>

                            {/* Footer Actions */}
                            {notifications.length > 0 && (
                                <View style={styles.footer}>
                                    <TouchableOpacity style={styles.markAllReadButton} onPress={onMarkAllAsRead}>
                                        <Text style={styles.markAllReadText}>Mark All as Read</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        minHeight: '50%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    notificationsList: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f8f8f8',
    },
    unreadNotification: {
        backgroundColor: '#f8f9ff',
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    notificationContent: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 8,
    },
    notificationTime: {
        fontSize: 12,
        color: '#999',
    },
    unreadIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#5b1ab2',
        marginLeft: 12,
        marginTop: 8,
    },
    footer: {
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    markAllReadButton: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    markAllReadText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#5b1ab2',
    },
});

export default NotificationModal;
