import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import BottomNav from '../components/BottomNav';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    studentId: 'STU12345',
    password: '********',
  });

  const [formData, setFormData] = useState({ ...userData, confirmPassword: '' });

  const handleSave = () => {
    // only save if password and confirmPassword match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setUserData({ 
      name: formData.name, 
      email: formData.email, 
      studentId: formData.studentId, 
      password: formData.password 
    });
    setIsEditMode(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Update your Profile</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                placeholder="Full Name"
              />
            ) : (
              <Text style={styles.infoText}>{userData.name}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                placeholder="Email"
                keyboardType="email-address"
              />
            ) : (
              <Text style={styles.infoText}>{userData.email}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={[styles.infoText, !isEditMode && styles.disabled]}>{userData.studentId}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            {isEditMode ? (
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                placeholder="Password"
                secureTextEntry
              />
            ) : (
              <Text style={styles.infoText}>********</Text>
            )}
          </View>

          {/* Confirm Password (only in edit mode) */}
          {isEditMode && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                placeholder="Confirm Password"
                secureTextEntry
              />
            </View>
          )}

          {/* Buttons */}
          {isEditMode ? (
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setFormData({ ...userData, confirmPassword: '' });
                  setIsEditMode(false);
                }}
              >
                <Text style={[styles.buttonText, { color: '#6B46C1' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditMode(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <BottomNav activeTab="Profile" />
    </View>
  );
};

const SPACING = 16;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: SPACING * 4,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: SPACING * 2,
  },
    subtitle: {
    fontWeight: '600',
    marginBottom: SPACING,
    textAlign: 'center',
    fontSize: 17,
  },
  scrollContainer: {
    flex: 1,
    padding: SPACING,
    paddingBottom: 100, 
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING * 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: SPACING,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: SPACING * 1.5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: SPACING,
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: SPACING / 2,
    paddingHorizontal: 2,
  },
  disabled: {
    color: '#999',
  },
  button: {
    borderRadius: 8,
    padding: SPACING,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING,
  },
  editButton: {
    backgroundColor: '#6B46C1',
  },
  saveButton: {
    backgroundColor: '#6B46C1',
    flex: 1,
    marginLeft: SPACING,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginRight: SPACING,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING,
    marginBottom: SPACING * 3,
  },
});

export default ProfileScreen;
