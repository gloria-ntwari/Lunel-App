import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface MealModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (mealData: { breakfast: string; lunch: string; dinner: string }) => void;
    day: string;
    meal?: {
        id: string;
        breakfast: string;
        lunch: string;
        dinner: string;
    } | null;
}

const MealModal: React.FC<MealModalProps> = ({
    visible,
    onClose,
    onSave,
    day,
    meal
}) => {
    const [breakfast, setBreakfast] = useState('');
    const [lunch, setLunch] = useState('');
    const [dinner, setDinner] = useState('');

    useEffect(() => {
        if (meal) {
            setBreakfast(meal.breakfast);
            setLunch(meal.lunch);
            setDinner(meal.dinner);
        } else {
            setBreakfast('');
            setLunch('');
            setDinner('');
        }
    }, [meal]);

    const handleSave = () => {
        if (breakfast.trim() && lunch.trim() && dinner.trim()) {
            onSave({
                breakfast: breakfast.trim(),
                lunch: lunch.trim(),
                dinner: dinner.trim()
            });
        }
    };

    const isFormValid = breakfast.trim() && lunch.trim() && dinner.trim();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>
                                    {meal ? 'Edit Meals' : 'Add Meals'} for {day}
                                </Text>
                                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={24} color="#666" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView style={styles.scrollView}>
                                {/* Breakfast Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Breakfast</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={breakfast}
                                        onChangeText={setBreakfast}
                                        placeholder="Enter breakfast menu"
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>

                                {/* Lunch Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Lunch</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={lunch}
                                        onChangeText={setLunch}
                                        placeholder="Enter lunch menu"
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>

                                {/* Dinner Input */}
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Dinner</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={dinner}
                                        onChangeText={setDinner}
                                        placeholder="Enter dinner menu"
                                        placeholderTextColor="#999"
                                        multiline
                                        numberOfLines={2}
                                    />
                                </View>
                            </ScrollView>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton, !isFormValid && styles.disabledButton]}
                                    onPress={handleSave}
                                    disabled={!isFormValid}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {meal ? 'Update' : 'Add'}
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
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
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    scrollView: {
        maxHeight: 300,
    },
    inputContainer: {
        marginBottom: 20,
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
        minHeight: 60,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
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
    saveButton: {
        backgroundColor: '#f96c3d',
    },
    disabledButton: {
        opacity: 0.6,
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 15,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default MealModal;
