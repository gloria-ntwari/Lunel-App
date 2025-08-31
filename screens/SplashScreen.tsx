import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';

export default function SplashScreen() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFonts() {
            try {
                await Font.loadAsync({
                    'Pacifico': require('../assets/fonts/Pacifico-Regular.ttf'),
                });
                setFontsLoaded(true);
            } catch (error) {
                console.log('Font loading error:', error);
                setFontsLoaded(true); // Continue even if font fails
            }
        }
        loadFonts();
    }, []);

    useEffect(() => {
        if (fontsLoaded) {
            const timer = setTimeout(() => {
                setIsLoading(false);
                navigation.navigate("Login" as never);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fontsLoaded, navigation]);


    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5b1ab2" />
            </View>
        );
    }

    return (
        <LinearGradient
            colors={["#5b1ab2", "#a73ada"]}
            start={{ x: 0, y: 5 }}
            end={{ x: 1, y: 5 }}
            style={styles.container}
        >
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            <Text style={styles.appName}>B-Lunder</Text>

            <Text style={styles.tagline}>Your Ultimate Event Companion</Text>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#5b1ab2',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 30,
    },
    appName: {
        fontSize: 42,
        fontWeight: '800',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        fontFamily: 'Pacifico',
    },
    tagline: {
        fontSize: 16,
        color: '#f0f0f0',
        textAlign: 'center',
        fontWeight: '400',
        opacity: 0.9,
        letterSpacing: 0.5,
    },
});