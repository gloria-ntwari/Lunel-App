import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface CategoryModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (category: string) => void;
    initialValue?: string;
    isEditing?: boolean;
}

const CategoryModal = ({
    visible,
    onClose,
    onSubmit,
    initialValue = '',
    isEditing = false
}: CategoryModalProps) => {
    const [category, setCategory] = React.useState(initialValue);

    React.useEffect(() => {
        setCategory(initialValue);
    }, [initialValue]);

    const handleSubmit = () => {
        if (category.trim()) {
            onSubmit(category.trim());
            setCategory('');
            onClose();
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {isEditing ? 'Edit Category' : 'Add New Category'}
                                </Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Category Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={category}
                                    onChangeText={setCategory}
                                    placeholder="Enter category name"
                                    placeholderTextColor="#999"
                                    autoFocus
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.submitButton, !category.trim() && styles.disabledButton]}
                                    onPress={handleSubmit}
                                    disabled={!category.trim()}
                                >
                                    <Text style={styles.submitButtonText}>
                                        {isEditing ? 'Update' : 'Add'}
                                    </Text>
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
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        color: '#333',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    submitButton: {
        backgroundColor: '#5b1ab2',
    },
    disabledButton: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 15,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default CategoryModal;
