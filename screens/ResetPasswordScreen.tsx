import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const ResetPasswordScreen = () => {
    const navigation = useNavigation();
    const route = useRoute() as any;
    const presetEmail = route?.params?.email as string | undefined;
    const presetToken = route?.params?.token as string | undefined;
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState(presetEmail || '');
    const [token, setToken] = useState(presetToken || '');
    const [submitting, setSubmitting] = useState(false);

    const handleSavePassword = async () => {
        if (!email.trim() || !token.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert('Error', 'Please fill in all fields (email, token, passwords)');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }
        try {
            setSubmitting(true);
            const res = await axios.post('/auth/reset', {
                email: email.trim().toLowerCase(),
                token: token.trim(),
                password: newPassword,
            });
            if (res.data?.success) {
                Alert.alert('Success', 'Your password has been reset successfully', [
                    { text: 'OK', onPress: () => navigation.navigate('Login' as never) }
                ]);
            } else {
                Alert.alert('Error', res.data?.message || 'Failed to reset password');
            }
        } catch (e: any) {
            Alert.alert('Error', e?.response?.data?.message || 'Failed to reset password');
        } finally {
            setSubmitting(false);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <MaterialIcons name="arrow-back" size={24} color="#5b1ab2" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.instructionText}>Enter reset token sent to your email and set a new password</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Reset Token</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Paste reset token"
                            placeholderTextColor="#999"
                            value={token}
                            onChangeText={setToken}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>New Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Enter new password"
                            placeholderTextColor="#999"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <MaterialIcons
                                name={showPassword ? 'visibility' : 'visibility-off'}
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <View style={styles.passwordInputContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Confirm new password"
                            placeholderTextColor="#999"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            autoCapitalize="none"
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <MaterialIcons
                                name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                                size={24}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSavePassword}
                    activeOpacity={0.8}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Password</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
        backgroundColor: 'rgba(91, 26, 178, 0.1)',
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#5b1ab2',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
    },
    instructionText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: '#333',
    },
    eyeButton: {
        padding: 16,
    },
    saveButton: {
        backgroundColor: '#5b1ab2',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#f96c3d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ResetPasswordScreen;
