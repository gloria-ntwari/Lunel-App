import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

export default function SplashScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate("Login" as never);
        }, 2000);
        return () => clearTimeout(timer);
    }, [navigation]);
    return (
        <View style={tw`flex-1 bg-indigo-700 justify-center items-center`}>
            <Text style={tw`text-4xl font-bold text-white`}>Lunel</Text>
        </View>
    );
}