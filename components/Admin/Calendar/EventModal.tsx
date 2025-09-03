import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useCategories } from '../../../contexts/CategoryContext';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
  event?: any;
  selectedDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({ visible, onClose, onSubmit, event, selectedDate }) => {
  const { categories } = useCategories();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [image, setImage] = useState<string | null>(null);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setLocation(event.location || '');
      setCategory(event.category || '');
      setStartTime(event.startTime ? new Date(event.startTime) : new Date());
      setEndTime(event.endTime ? new Date(event.endTime) : new Date());
      setImage(event.image || null);
    } else {
      // Reset form for new event
      setTitle('');
      setLocation('');
      setCategory('');
      setStartTime(new Date());
      setEndTime(new Date());
      setImage(null);
    }
  }, [event, visible]);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (endTime <= startTime) {
      Alert.alert('Error', 'End time must be after start time');
      return;
    }

    const eventData = {
      title: title.trim(),
      location: location.trim(),
      category,
      date: selectedDate,
      startTime,
      endTime,
      image
    };

    onSubmit(eventData);
    onClose();
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {event ? 'Edit Event' : 'Create New Event'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

                                 <ScrollView style={styles.form}>
              <Text style={styles.label}>Title *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter event title"
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Location *</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Enter event location"
                placeholderTextColor="#999"
              />

             <Text style={styles.label}>Category *</Text>
             <View style={styles.categoryContainer}>
               {categories.map((cat) => (
                 <TouchableOpacity
                   key={cat._id}
                   style={[
                     styles.categoryButton,
                     category === cat.name && styles.selectedCategory
                   ]}
                   onPress={() => setCategory(cat.name)}
                 >
                   <Text style={[
                     styles.categoryText,
                     category === cat.name && styles.selectedCategoryText
                   ]}>
                     {cat.name}
                   </Text>
                 </TouchableOpacity>
               ))}
             </View>

             <Text style={styles.label}>Event Image</Text>
             <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
               {image ? (
                 <Image source={{ uri: image }} style={styles.imagePreview} />
               ) : (
                 <View style={styles.imagePlaceholder}>
                   <Ionicons name="camera-outline" size={32} color="#666" />
                   <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                 </View>
               )}
             </TouchableOpacity>

             <Text style={styles.label}>Start Time *</Text>
             <TouchableOpacity
               style={styles.timeButton}
               onPress={() => setShowStartTimePicker(true)}
             >
               <Text style={styles.timeText}>{formatTime(startTime)}</Text>
               <Ionicons name="time-outline" size={20} color="#666" />
             </TouchableOpacity>

             <Text style={styles.label}>End Time *</Text>
             <TouchableOpacity
               style={styles.timeButton}
               onPress={() => setShowEndTimePicker(true)}
             >
               <Text style={styles.timeText}>{formatTime(endTime)}</Text>
               <Ionicons name="time-outline" size={20} color="#666" />
             </TouchableOpacity>

             <Text style={styles.dateText}>
               Date: {selectedDate.toLocaleDateString()}
             </Text>
           </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {event ? 'Update' : 'Create'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour={false}
          onChange={(event, selectedTime) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setStartTime(selectedTime);
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour={false}
          onChange={(event, selectedTime) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setEndTime(selectedTime);
            }
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
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#5b1ab2',
    borderColor: '#5b1ab2',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  imageButton: {
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  imagePlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  timeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#5b1ab2',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default EventModal;
