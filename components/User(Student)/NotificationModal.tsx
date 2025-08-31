import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'event' | 'reminder' | 'update';
    timestamp: string;
    isRead: boolean;
}

interface NotificationModalProps {
    visible: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
}

const NotificationModal = ({ visible, onClose, notifications, onMarkAsRead }: NotificationModalProps) => {
    const handleNotificationPress = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification.id);
        }
        // Here you can add navigation logic to the specific event/feature
        console.log('Navigate to:', notification.title);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'event':
                return 'event';
            case 'reminder':
                return 'alarm';
            case 'update':
                return 'update';
            default:
                return 'notifications';
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'event':
                return '#5b1ab2';
            case 'reminder':
                return '#f96c3d';
            case 'update':
                return '#27ae60';
            default:
                return '#666';
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
                                            key={notification.id}
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
                                                <Text style={styles.notificationTime}>{notification.timestamp}</Text>
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
                                    <TouchableOpacity style={styles.markAllReadButton}>
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
