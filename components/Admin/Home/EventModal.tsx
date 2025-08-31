import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet, TouchableWithoutFeedback, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

interface EventModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (event: any) => void; // Update the type according to your event structure
    event?: any; // For editing existing event
    categories: string[];
}

const EventModal: React.FC<EventModalProps> = ({
    visible,
    onClose,
    onSave,
    event,
    categories = []
}) => {
    const [title, setTitle] = useState(event?.title || '');
    const [selectedCategory, setSelectedCategory] = useState(event?.category || '');
    const [date, setDate] = useState(event?.date || new Date());
    const [startTime, setStartTime] = useState(event?.startTime || new Date());
    const [endTime, setEndTime] = useState(event?.endTime || new Date());
    const [location, setLocation] = useState(event?.location || '');
    const [image, setImage] = useState(event?.image || null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        const eventData = {
            id: event?.id || Date.now().toString(),
            title,
            category: selectedCategory,
            date,
            startTime,
            endTime,
            location,
            image,
        };
        onSave(eventData);
        onClose();
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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
                            <Text style={styles.modalTitle}>
                                {event ? 'Edit Event' : 'Add New Event'}
                            </Text>

                            <ScrollView style={styles.scrollView}>
                                {/* Image Upload */}
                                <TouchableOpacity
                                    style={styles.imageUpload}
                                    onPress={handleImagePick}
                                >
                                    {image ? (
                                        <Image source={{ uri: image }} style={styles.imagePreview} />
                                    ) : (
                                        <View style={styles.uploadPlaceholder}>
                                            <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
                                            <Text>Add Event Image</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {/* Event Title */}
                                <Text style={styles.label}>Event Title</Text>
                                <TextInput
                                    style={styles.input}
                                    value={title}
                                    onChangeText={setTitle}
                                    placeholder="Enter event title"
                                    placeholderTextColor="#999"
                                />

                                {/* Category Dropdown */}
                                <Text style={styles.label}>Category</Text>
                                <TouchableOpacity
                                    style={styles.dropdown}
                                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                >
                                    <Text style={selectedCategory ? styles.dropdownText : styles.placeholderText}>
                                        {selectedCategory || 'Select Category'}
                                    </Text>
                                    <MaterialIcons
                                        name={showCategoryDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                                        size={24}
                                        color="#666"
                                    />
                                </TouchableOpacity>

                                {showCategoryDropdown && (
                                    <View style={styles.dropdownOptions}>
                                        {categories.map((category) => (
                                            <TouchableOpacity
                                                key={category}
                                                style={styles.option}
                                                onPress={() => {
                                                    setSelectedCategory(category);
                                                    setShowCategoryDropdown(false);
                                                }}
                                            >
                                                <Text>{category}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {/* Date Picker */}
                                <Text style={styles.label}>Date</Text>
                                <TouchableOpacity
                                    style={styles.dateTimeInput}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text>{formatDate(date)}</Text>
                                    <MaterialIcons name="calendar-today" size={20} color="#666" />
                                </TouchableOpacity>

                                {/* Start Time */}
                                <Text style={styles.label}>Start Time</Text>
                                <TouchableOpacity
                                    style={styles.dateTimeInput}
                                    onPress={() => setShowStartTimePicker(true)}
                                >
                                    <Text>{formatTime(startTime)}</Text>
                                    <MaterialIcons name="access-time" size={20} color="#666" />
                                </TouchableOpacity>

                                {/* End Time */}
                                <Text style={styles.label}>End Time</Text>
                                <TouchableOpacity
                                    style={styles.dateTimeInput}
                                    onPress={() => setShowEndTimePicker(true)}
                                >
                                    <Text>{formatTime(endTime)}</Text>
                                    <MaterialIcons name="access-time" size={20} color="#666" />
                                </TouchableOpacity>

                                {/* Location */}
                                <Text style={styles.label}>Location</Text>
                                <TextInput
                                    style={styles.input}
                                    value={location}
                                    onChangeText={setLocation}
                                    placeholder="Enter event location"
                                    placeholderTextColor="#999"
                                />
                            </ScrollView>

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onClose}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.saveButton]}
                                    onPress={handleSave}
                                >
                                    <Text style={styles.saveButtonText}>{event ? 'Update' : 'Save'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>

            {/* Date and Time Pickers */}
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            {showStartTimePicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowStartTimePicker(false);
                        if (selectedTime) setStartTime(selectedTime);
                    }}
                />
            )}

            {showEndTimePicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event, selectedTime) => {
                        setShowEndTimePicker(false);
                        if (selectedTime) setEndTime(selectedTime);
                    }}
                />
            )}
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    scrollView: {
        maxHeight: '75%',
    },
    imageUpload: {
        height: 150,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 6,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    dropdown: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    dropdownText: {
        color: '#333',
        fontSize: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    dropdownOptions: {
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: -10,
        marginBottom: 16,
        maxHeight: 200,
    },
    option: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dateTimeInput: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
    },
    saveButton: {
        backgroundColor: '#f96c3d',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default EventModal;
