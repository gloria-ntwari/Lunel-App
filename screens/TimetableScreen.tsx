import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek } from 'date-fns';
import BottomNav from '../components/User(Student)/BottomNav';
import Header from '../components/User(Student)/Timetable/Header';
import { useMeals } from '../contexts/MealContext';

// Define types for our data
interface Meal {
    breakfast: string;
    lunch: string;
    dinner: string;
}

interface WeeklyMenu {
    [key: string]: Meal;
}

const TimetableScreen = () => {
    const { meals, isLoading, fetchMeals } = useMeals();
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
        startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
    );

    // Generate array of 7 days starting from currentWeekStart
    const weekDays = Array.from({ length: 7 }, (_, i) =>
        addDays(new Date(currentWeekStart), i)
    );

    const navigateWeek = (direction: 'prev' | 'next') => {
        setCurrentWeekStart(prev =>
            direction === 'prev' ? addDays(prev, -7) : addDays(prev, 7)
        );
    };

    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    // Fetch meals for the current week
    useEffect(() => {
        fetchMeals('all');
    }, [currentWeekStart]);

    // Group meals by day
    const getMealsForDay = (dayIndex: number) => {
        const dayDate = weekDays[dayIndex];
        const dayStart = new Date(dayDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayDate);
        dayEnd.setHours(23, 59, 59, 999);

        const dayName = dayNames[dayIndex];
        return meals.filter((meal: any) => meal.day === dayName);
    };

    // Get meal by type for a specific day
    const getMealByType = (dayIndex: number, mealType: string) => {
        const dayMeals = getMealsForDay(dayIndex);
        const meal = dayMeals.find((m: any) => m.mealType === mealType);
        return meal ? meal.menu : 'No meal scheduled';
    };

    return (
        <View style={styles.container}>
                        <ScrollView style={styles.scrollView}>
                <Header greeting="Weekly Menu" />

                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading meals...</Text>
                    </View>
                ) : (
                    <>
                        {/* Week Navigation */}
                        <View style={styles.weekNavigation}>
                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => navigateWeek('prev')}
                            >
                                <Ionicons name="chevron-back" size={24} color="#f96c3d" />
                            </TouchableOpacity>

                            <Text style={styles.weekText}>
                                {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
                            </Text>

                            <TouchableOpacity
                                style={styles.navButton}
                                onPress={() => navigateWeek('next')}
                            >
                                <Ionicons name="chevron-forward" size={24} color="#f96c3d" />
                            </TouchableOpacity>
                        </View>

                        {/* Weekly Menu */}
                        <View style={styles.weekContainer}>
                            {weekDays.map((day: Date, index: number) => {
                                const dayName = dayNames[index];
                                const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

                                return (
                                    <View key={index} style={[styles.dayCard, isToday && styles.todayCard]}>
                                        <View style={styles.dayHeader}>
                                            <Text style={styles.dayName}>{dayName}</Text>
                                            <Text style={styles.dayDate}>{format(day, 'd MMM')}</Text>
                                        </View>

                                        <View style={styles.mealContainer}>
                                            <View style={styles.mealItem}>
                                                <Text style={styles.mealTime}>Breakfast</Text>
                                                <Text style={styles.mealName}>{getMealByType(index, 'Breakfast')}</Text>
                                            </View>

                                            <View style={styles.mealItem}>
                                                <Text style={styles.mealTime}>Lunch</Text>
                                                <Text style={styles.mealName}>{getMealByType(index, 'Lunch')}</Text>
                                            </View>

                                            <View style={styles.mealItem}>
                                                <Text style={styles.mealTime}>Dinner</Text>
                                                <Text style={styles.mealName}>{getMealByType(index, 'Dinner')}</Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>
            <BottomNav activeTab="Timetable" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollView: {
        flex: 1,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    weekNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    navButton: {
        padding: 8,
    },
    weekText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    weekContainer: {
        padding: 10,
    },
    dayCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    todayCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#f96c3d',
    },
    dayHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    dayName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dayDate: {
        fontSize: 14,
        color: '#666',
    },
    mealContainer: {
        gap: 12,
    },
    mealItem: {
        padding: 12,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    mealTime: {
        fontSize: 12,
        color: '#f96c3d',
        fontWeight: '500',
        marginBottom: 4,
    },
    mealName: {
        fontSize: 14,
        color: '#333',
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff8f5',
        padding: 15,
        margin: 15,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#f96c3d',
    },
    infoText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#666',
        flex: 1,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
    },
});

export default TimetableScreen;
