import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Admin/Home/HeaderSection';
import BottomNav from '../components/Admin/BottomNav';
// Removed complex MealModal in favor of simple quick-edit modal
import { useMeals, type Meal } from '../contexts/MealContext';
import { format } from 'date-fns';

const AdminMealsScreen = () => {
  const { meals, isLoading, fetchMeals, createMeal, updateMeal, deleteMeal } = useMeals();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [editingMeal, setEditingMeal] = useState<Partial<Meal> | null>(null);
  const dayNames: Array<Meal['day']> = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const [quickAddVisible, setQuickAddVisible] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState<Date>(new Date());
  const [quickAddType, setQuickAddType] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Breakfast');
  const [quickAddMenu, setQuickAddMenu] = useState('');
  const [selectedDayName, setSelectedDayName] = useState<Meal['day']>('Monday');

  useEffect(() => {
    fetchMeals();
  }, []);

  const getCanonicalDateForDay = (dayName: Meal['day']): Date => {
    const anchor = new Date(2024, 0, 1); // Jan 1, 2024 (Monday)
    const index = dayNames.indexOf(dayName);
    const d = new Date(anchor);
    d.setDate(anchor.getDate() + index);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const handleDeleteMeal = async (mealId: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to delete this meal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMeal(mealId);
              Alert.alert('Success', 'Meal deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete meal');
            }
          }
        }
      ]
    );
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setSelectedDayName(meal.day as any);
    setQuickAddType(meal.mealType as 'Breakfast' | 'Lunch' | 'Dinner');
    setQuickAddMenu(meal.menu || '');
    setQuickAddVisible(true);
  };

  const handleAddMeal = (dayName?: Meal['day'], mealType?: Meal['mealType']) => {
    if (dayName && mealType) {
      setSelectedDayName(dayName);
      setQuickAddType(mealType as 'Breakfast' | 'Lunch' | 'Dinner');
      setQuickAddMenu('');
      setQuickAddVisible(true);
    }
  };

  const handleModalSubmit = async (mealData: any) => {
    try {
      if (editingMeal && (editingMeal as any)._id) {
        await updateMeal((editingMeal as any)._id, {
          ...mealData,
          mealType: quickAddType,
          date: quickAddDate,
        });
        Alert.alert('Success', 'Meal updated successfully!');
        } else {
        await createMeal(mealData);
        Alert.alert('Success', 'Meal created successfully!');
      }
      setEditingMeal(null);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save meal');
    }
  };

  const renderMealItem = ({ item }: { item: any }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealHeader}>
        <View style={styles.mealTypeContainer}>
          <Text style={styles.mealType}>{item.mealType}</Text>
        </View>
        <View style={styles.mealActions}>
                    <TouchableOpacity
            style={styles.actionButton} 
            onPress={() => handleEditMeal(item)}
                    >
            <Ionicons name="pencil" size={16} color="#5b1ab2" />
                    </TouchableOpacity>
                    <TouchableOpacity
            style={styles.actionButton} 
            onPress={() => handleDeleteMeal(item._id)}
                    >
            <Ionicons name="trash" size={16} color="#e74c3c" />
                    </TouchableOpacity>
                </View>
                                </View>

      <Text style={styles.mealTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.mealDescription}>{item.description}</Text>
      )}
      <Text style={styles.mealMenu}>{item.menu}</Text>
      {/* Removed date display by request */}
    </View>
  );

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.activeFilter]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.activeFilterText]}>
            All Meals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'today' && styles.activeFilter]}
          onPress={() => setSelectedFilter('today')}
        >
          <Text style={[styles.filterText, selectedFilter === 'today' && styles.activeFilterText]}>
            Today
          </Text>
        </TouchableOpacity>
                                    <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'upcoming' && styles.activeFilter]}
          onPress={() => setSelectedFilter('upcoming')}
        >
          <Text style={[styles.filterText, selectedFilter === 'upcoming' && styles.activeFilterText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </ScrollView>
                                        </View>
  );

  const renderMealTypeButtons = () => (
    <View style={styles.mealTypeFilterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.mealTypeButton, selectedMealType === 'all' && styles.activeMealType]}
          onPress={() => setSelectedMealType('all')}
        >
          <Text style={[styles.mealTypeText, selectedMealType === 'all' && styles.activeMealTypeText]}>
            All Types
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.mealTypeButton, selectedMealType === 'Breakfast' && styles.activeMealType]}
          onPress={() => setSelectedMealType('Breakfast')}
        >
          <Text style={[styles.mealTypeText, selectedMealType === 'Breakfast' && styles.activeMealTypeText]}>
            Breakfast
          </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
          style={[styles.mealTypeButton, selectedMealType === 'Lunch' && styles.activeMealType]}
          onPress={() => setSelectedMealType('Lunch')}
                                    >
          <Text style={[styles.mealTypeText, selectedMealType === 'Lunch' && styles.activeMealTypeText]}>
            Lunch
          </Text>
                                    </TouchableOpacity>
                                        <TouchableOpacity
          style={[styles.mealTypeButton, selectedMealType === 'Dinner' && styles.activeMealType]}
          onPress={() => setSelectedMealType('Dinner')}
                                        >
          <Text style={[styles.mealTypeText, selectedMealType === 'Dinner' && styles.activeMealTypeText]}>
            Dinner
          </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
          style={[styles.mealTypeButton, selectedMealType === 'Snack' && styles.activeMealType]}
          onPress={() => setSelectedMealType('Snack')}
                                        >
          <Text style={[styles.mealTypeText, selectedMealType === 'Snack' && styles.activeMealTypeText]}>
            Snack
          </Text>
                                        </TouchableOpacity>
      </ScrollView>
                            </View>
                        );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Header greeting="Meals Management" />
        
        {/* Removed top Add button and filters per request */}

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading meals...</Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20 }}>
            {dayNames.map((dayName, idx) => {
              const dayMeals = meals.filter((m: any) => m.day === dayName);
              const breakfast = dayMeals.find(m => m.mealType === 'Breakfast');
              const lunch = dayMeals.find(m => m.mealType === 'Lunch');
              const dinner = dayMeals.find(m => m.mealType === 'Dinner');
              return (
                <View key={idx} style={styles.dayCard}>
                  <View style={styles.dayHeader}>
                    <Text style={styles.dayName}>{dayName}</Text>
                  </View>
                  <View style={styles.mealContainer}>
                    <View style={styles.mealItem}>
                      <Text style={styles.mealTime}>Breakfast</Text>
                      {breakfast ? (
                        renderMealItem({ item: breakfast })
                      ) : (
                        <TouchableOpacity style={styles.placeholder} onPress={() => handleAddMeal(dayName, 'Breakfast')}>
                          <Ionicons name="add-circle-outline" size={18} color="#5b1ab2" />
                          <Text style={styles.placeholderText}>Add breakfast</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.mealItem}>
                      <Text style={styles.mealTime}>Lunch</Text>
                      {lunch ? (
                        renderMealItem({ item: lunch })
                      ) : (
                        <TouchableOpacity style={styles.placeholder} onPress={() => handleAddMeal(dayName, 'Lunch')}>
                          <Ionicons name="add-circle-outline" size={18} color="#5b1ab2" />
                          <Text style={styles.placeholderText}>Add lunch</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View style={styles.mealItem}>
                      <Text style={styles.mealTime}>Dinner</Text>
                      {dinner ? (
                        renderMealItem({ item: dinner })
                      ) : (
                        <TouchableOpacity style={styles.placeholder} onPress={() => handleAddMeal(dayName, 'Dinner')}>
                          <Ionicons name="add-circle-outline" size={18} color="#5b1ab2" />
                          <Text style={styles.placeholderText}>Add dinner</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
            </ScrollView>

            {/* Quick Add Modal - single text field */}
            <Modal visible={quickAddVisible} transparent animationType="fade" onRequestClose={() => setQuickAddVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
              {editingMeal && (editingMeal as any)._id ? 'Edit' : 'Add'} {quickAddType} · {selectedDayName}
            </Text>
            {/* Date removed from modal per request */}
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, color: '#333' }}
              placeholder={`Enter ${quickAddType} menu`}
              placeholderTextColor="#999"
              value={quickAddMenu}
              onChangeText={setQuickAddMenu}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => setQuickAddVisible(false)} style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  if (!quickAddMenu.trim()) return;
                  try {
                    await createMeal({
                      title: `${quickAddType} Meal`,
                      mealType: quickAddType,
                      day: selectedDayName,
                      menu: quickAddMenu.trim(),
                    });
                    setQuickAddVisible(false);
                  } catch (e) {
                    Alert.alert('Error', 'Failed to add meal');
                  }
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#5b1ab2' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

            {/* Simple Quick Add/Edit Modal */}
            <Modal visible={quickAddVisible} transparent animationType="fade" onRequestClose={() => setQuickAddVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 10 }}>
              {editingMeal && (editingMeal as any)._id ? 'Edit' : 'Add'} {quickAddType} · {selectedDayName}
            </Text>
            {/* Date removed from modal per request */}
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, color: '#333' }}
              placeholder={`Enter ${quickAddType} menu`}
              placeholderTextColor="#999"
              value={quickAddMenu}
              onChangeText={setQuickAddMenu}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <TouchableOpacity onPress={() => { setQuickAddVisible(false); setEditingMeal(null); }} style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' }}>
                <Text style={{ color: '#666' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const trimmed = quickAddMenu.trim();
                  if (!trimmed) return;
                  try {
                    if (editingMeal && (editingMeal as any)._id) {
                      await updateMeal((editingMeal as any)._id, { menu: trimmed, day: selectedDayName });
                    } else {
                      await createMeal({
                        title: `${quickAddType} Meal`,
                        mealType: quickAddType,
                        day: selectedDayName,
                        menu: trimmed,
                      });
                    }
                    setQuickAddVisible(false);
                    setEditingMeal(null);
                  } catch (e) {
                    Alert.alert('Error', 'Failed to save meal');
                  }
                }}
                style={{ paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#5b1ab2' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

            <BottomNav activeTab="Timetable" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
  addButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#5b1ab2',
        flexDirection: 'row',
        alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    marginLeft: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilter: {
    backgroundColor: '#5b1ab2',
    borderColor: '#5b1ab2',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  mealTypeFilterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  mealTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeMealType: {
    backgroundColor: '#f96c3d',
    borderColor: '#f96c3d',
  },
  mealTypeText: {
    fontSize: 12,
    color: '#666',
  },
  activeMealTypeText: {
    color: '#fff',
  },
  mealsList: {
    paddingHorizontal: 20,
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
  placeholder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  placeholderText: {
    color: '#5b1ab2',
        fontSize: 14,
    fontWeight: '500',
  },
  mealCard: {
    backgroundColor: '#fff',
        borderRadius: 12,
    padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mealHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeContainer: {
    backgroundColor: '#f96c3d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  mealType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  mealActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#f8f9fa',
  },
  mealTitle: {
    fontSize: 18,
        fontWeight: '600',
        color: '#333',
    marginBottom: 4,
    },
  mealDescription: {
        fontSize: 14,
        color: '#666',
    marginBottom: 8,
  },
  mealMenu: {
        fontSize: 14,
        color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  mealDate: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    padding: 40,
        alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
        color: '#666',
  },
  noMealsContainer: {
    padding: 40,
        alignItems: 'center',
  },
  noMealsText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noMealsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    },
});

export default AdminMealsScreen;
