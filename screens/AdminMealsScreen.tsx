import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays, startOfWeek } from 'date-fns';
import BottomNav from '../components/Admin/BottomNav';
import Header from '../components/Admin/Timetable/Header';
import MealModal from '../components/Admin/Timetable/MealModal';
import MealActionsModal from '../components/Admin/Timetable/MealActionsModal';

interface Meal {
    id: string;
    breakfast: string;
    lunch: string;
    dinner: string;
}

interface WeeklyMenu {
    [key: string]: Meal;
}

const AdminMealsScreen = () => {
    const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
        startOfWeek(new Date(), { weekStartsOn: 1 }) // Monday
    );

    const [weeklyMenu, setWeeklyMenu] = useState<WeeklyMenu>({
        'Monday': {
            id: 'monday',
            breakfast: 'Oatmeal with fruits',
            lunch: 'Grilled chicken with rice',
            dinner: 'Vegetable pasta'
        },
        'Tuesday': {
            id: 'tuesday',
            breakfast: 'Yogurt with granola',
            lunch: 'Fish with quinoa',
            dinner: 'Vegetable stir-fry'
        },
        'Wednesday': {
            id: 'wednesday',
            breakfast: 'Avocado toast',
            lunch: 'Beef burger with sweet potato fries',
            dinner: 'Chicken Caesar salad'
        },
        'Thursday': {
            id: 'thursday',
            breakfast: 'Smoothie bowl',
            lunch: 'Pasta carbonara',
            dinner: 'Grilled salmon with vegetables'
        },
        'Friday': {
            id: 'friday',
            breakfast: 'Pancakes with maple syrup',
            lunch: 'Chicken wrap with salad',
            dinner: 'Pizza night'
        },
        'Saturday': {
            id: 'saturday',
            breakfast: 'Full English breakfast',
            lunch: 'BBQ ribs with corn',
            dinner: 'Sushi platter'
        },
        'Sunday': {
            id: 'sunday',
            breakfast: 'French toast',
            lunch: 'Roast dinner',
            dinner: 'Soup and sandwiches'
        }
    });

    const [showMealModal, setShowMealModal] = useState(false);
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
    const [showActionsModal, setShowActionsModal] = useState(false);
    const [dayForActions, setDayForActions] = useState<string>('');

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

    const handleAddMeal = (day: string) => {
        setSelectedDay(day);
        setSelectedMeal(null);
        setShowMealModal(true);
    };

    const handleEditMeal = (day: string) => {
        setSelectedDay(day);
        setSelectedMeal(weeklyMenu[day]);
        setShowMealModal(true);
    };

    const handleDeleteMeal = (day: string) => {
        const updatedMenu = { ...weeklyMenu };
        delete updatedMenu[day];
        setWeeklyMenu(updatedMenu);
    };

    const handleSaveMeal = (mealData: { breakfast: string; lunch: string; dinner: string }) => {
        if (selectedMeal) {
            // Update existing meal
            setWeeklyMenu(prev => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    ...mealData
                }
            }));
        } else {
            // Add new meal
            setWeeklyMenu(prev => ({
                ...prev,
                [selectedDay]: {
                    id: selectedDay.toLowerCase(),
                    ...mealData
                }
            }));
        }
        setShowMealModal(false);
        setSelectedDay('');
        setSelectedMeal(null);
    };

    const handleMealPress = (day: string) => {
        setDayForActions(day);
        setShowActionsModal(true);
    };

    const closeActionsModal = () => {
        setShowActionsModal(false);
        setDayForActions('');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Header greeting="Weekly Meals Management" />

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
                        const menu = weeklyMenu[dayName];
                        const isToday = format(new Date(), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');

                        return (
                            <View key={index} style={[styles.dayCard, isToday && styles.todayCard]}>
                                <View style={styles.dayHeader}>
                                    <Text style={styles.dayName}>{dayName}</Text>
                                    <Text style={styles.dayDate}>{format(day, 'd MMM')}</Text>
                                </View>

                                {menu ? (
                                    <TouchableOpacity
                                        style={styles.mealContainer}
                                        onPress={() => handleMealPress(dayName)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={styles.mealItem}>
                                            <Text style={styles.mealTime}>Breakfast</Text>
                                            <Text style={styles.mealName}>{menu.breakfast}</Text>
                                        </View>

                                        <View style={styles.mealItem}>
                                            <Text style={styles.mealTime}>Lunch</Text>
                                            <Text style={styles.mealName}>{menu.lunch}</Text>
                                        </View>

                                        <View style={styles.mealItem}>
                                            <Text style={styles.mealTime}>Dinner</Text>
                                            <Text style={styles.mealName}>{menu.dinner}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.addMealButton}
                                        onPress={() => handleAddMeal(dayName)}
                                    >
                                        <Ionicons name="add-circle" size={24} color="#f96c3d" />
                                        <Text style={styles.addMealText}>Add Meals for {dayName}</Text>
                                    </TouchableOpacity>
                                )}

                                {menu && (
                                    <View style={styles.actionButtons}>
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => handleEditMeal(dayName)}
                                        >
                                            <Ionicons name="create" size={16} color="#5b1ab2" />
                                            <Text style={styles.editButtonText}>Edit</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteMeal(dayName)}
                                        >
                                            <Ionicons name="trash" size={16} color="#e74c3c" />
                                            <Text style={styles.deleteButtonText}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </View>

            </ScrollView>

            {/* Meal Modal for Add/Edit */}
            <MealModal
                visible={showMealModal}
                onClose={() => {
                    setShowMealModal(false);
                    setSelectedDay('');
                    setSelectedMeal(null);
                }}
                onSave={handleSaveMeal}
                day={selectedDay}
                meal={selectedMeal}
            />

            {/* Meal Actions Modal */}
            <MealActionsModal
                visible={showActionsModal}
                onClose={closeActionsModal}
                onEdit={() => {
                    handleEditMeal(dayForActions);
                    closeActionsModal();
                }}
                onDelete={() => {
                    handleDeleteMeal(dayForActions);
                    closeActionsModal();
                }}
                dayName={dayForActions}
            />

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
    addMealButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f0f8ff',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
    addMealText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(91, 26, 178, 0.1)',
        borderRadius: 16,
        gap: 4,
    },
    editButtonText: {
        fontSize: 12,
        color: '#5b1ab2',
        fontWeight: '500',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderRadius: 16,
        gap: 4,
    },
    deleteButtonText: {
        fontSize: 12,
        color: '#e74c3c',
        fontWeight: '500',
    },
});

export default AdminMealsScreen;
