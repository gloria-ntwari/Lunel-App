import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const ForgotPasswordScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSendVerificationCode = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }
        try {
            setSubmitting(true);
            const res = await axios.post('/auth/forgot', { email: email.trim().toLowerCase() });
            const data = res.data || {};
            if (data.success) {
                const devToken = data.token as string | undefined;
                Alert.alert('Check your email', 'If that email exists, a reset link has been sent.');
                navigation.navigate('ResetPassword' as never, { email: email.trim(), token: devToken } as never);
            } else {
                Alert.alert('Error', data.message || 'Failed to start reset');
            }
        } catch (e: any) {
            const msg = e?.response?.status === 404
                ? "No account found with this email. Please sign up first."
                : (e?.response?.data?.message || 'Failed to start reset');
            Alert.alert('Error', msg);
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
                <Text style={styles.headerTitle}>Forgot Password</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.instructionText}>
                    Enter your email to receive a password reset token
                </Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                </View>

                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendVerificationCode}
                    activeOpacity={0.8}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Send Verification Code</Text>}
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
        marginBottom: 40,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    sendButton: {
        backgroundColor: '#5b1ab2',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        shadowColor: '#f96c3d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    sendButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ForgotPasswordScreen;
