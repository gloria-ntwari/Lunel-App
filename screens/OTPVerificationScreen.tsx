import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OTPVerificationScreen = () => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState(['', '', '', '', '']);
    const inputRefs = useRef<TextInput[]>([]);

    const handleOtpChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 4) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyAccount = () => {
        const otpString = otp.join('');
        if (otpString.length === 5) {
            // Navigate to reset password screen
            navigation.navigate('ResetPassword' as never);
        } else {
            Alert.alert('Error', 'Please enter the complete verification code');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleResendCode = () => {
        Alert.alert('Code Resent', 'A new verification code has been sent to your email/phone');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                    <MaterialIcons name="arrow-back" size={24} color="#5b1ab2" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Account Verification</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.instructionText}>
                    We have sent verification code on your email. Use it to activate your account.
                </Text>

                {/* OTP Input Fields */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                if (ref) inputRefs.current[index] = ref;
                            }}
                            style={styles.otpInput}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            textAlign="center"
                            placeholder=""
                            placeholderTextColor="#ccc"
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.verifyButton}
                    onPress={handleVerifyAccount}
                    activeOpacity={0.8}
                >
                    <Text style={styles.verifyButtonText}>Verify Account</Text>
                </TouchableOpacity>

                {/* Resend Code */}
                <TouchableOpacity style={styles.resendContainer} onPress={handleResendCode}>
                    <Text style={styles.resendText}>Didn't receive the code? </Text>
                    <Text style={styles.resendLink}>Resend Code</Text>
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
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
        alignItems: 'center',
        gap: 5,
    },
    otpInput: {
        width: 60,
        height: 60,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        fontSize: 24,
        fontWeight: '600',
        color: '#5b1ab2',
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    verifyButton: {
        backgroundColor: '#5b1ab2',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#f96c3d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    verifyButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resendText: {
        fontSize: 14,
        color: '#666',
    },
    resendLink: {
        fontSize: 14,
        color: '#5b1ab2',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default OTPVerificationScreen;
