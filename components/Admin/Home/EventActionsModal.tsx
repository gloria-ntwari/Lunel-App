import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface EventActionsModalProps {
    visible: boolean;
    onClose: () => void;
    onActionPress: (action: string) => void;
    event: any;
    showCancelOption?: boolean;
}

const EventActionsModal = ({
    visible,
    onClose,
    onActionPress,
    event,
    showCancelOption = true
}: EventActionsModalProps) => {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => { }}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Event Actions</Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.eventTitle}>{event?.title || 'Event'}</Text>

                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.editButton]}
                                    onPress={() => {
                                        onActionPress('edit');
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="edit" size={20} color="#fff" />
                                    <Text style={styles.actionButtonText}>Edit Event</Text>
                                </TouchableOpacity>

                                {showCancelOption && !event?.isCancelled && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, styles.cancelButton]}
                                        onPress={() => {
                                            onActionPress('cancel');
                                        }}
                                        activeOpacity={0.7}
                                    >
                                        <MaterialIcons name="cancel" size={20} color="#fff" />
                                        <Text style={styles.actionButtonText}>Cancel Event</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={() => {
                                        onActionPress('delete');
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons name="delete" size={20} color="#fff" />
                                    <Text style={styles.actionButtonText}>Delete Event</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    eventTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
        fontWeight: '500',
    },
    actionsContainer: {
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 8,
    },
    editButton: {
        backgroundColor: '#5b1ab2',
    },
    cancelButton: {
        backgroundColor: '#e74c3c',
    },
    deleteButton: {
        backgroundColor: '#e74c3c',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default EventActionsModal;
