import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Admin/Home/HeaderSection';
import EventManager from '../components/Admin/Home/EventManager';
import BottomNav from '../components/Admin/BottomNav';

const AdminHomeScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header greeting="Hello, Gloria" />
                <EventManager />
            </ScrollView>
            <BottomNav activeTab="Home" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});

export default AdminHomeScreen;