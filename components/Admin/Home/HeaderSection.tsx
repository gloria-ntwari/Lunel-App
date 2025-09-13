import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminCategoryTabs from './AdminCategoryTabs';
import { useAuth } from '../../../contexts/AuthContext';
import { useEvents } from '../../../contexts/EventContext';
import { useCategories } from '../../../contexts/CategoryContext';

let LinearGradient: any;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (e) {
  LinearGradient = ({ children, style }: any) => <View style={[style, { backgroundColor: '#5b1ab2' }]}>{children}</View>;
}

interface HeaderProps {
  greeting: string;
}

const Header = ({ greeting }: HeaderProps) => {
  const { user } = useAuth();
  const { setSearchQuery } = useEvents();
  const { categories, fetchAdminCategories, createCategory, updateCategory, deleteCategory, isLoading } = useCategories();
  const [activeCategory, setActiveCategory] = useState('All events');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [search, setSearch] = useState('');

  // Fetch categories when component mounts
  useEffect(() => {
    fetchAdminCategories();
  }, []);

  // Create dynamic categories list with "All events" first
  const dynamicCategories = ['All events', ...categories.map(cat => cat.name)];

  const handleEditCategory = (index: number) => {
    // Skip "All events" (index 0) as it's not a real category
    if (index === 0) return;
    
    const categoryIndex = index - 1; // Adjust for "All events"
    const category = categories[categoryIndex];
    if (category) {
      setNewCategoryName(category.name);
      setEditingCategory({ id: category._id, name: category.name });
      setIsModalVisible(true);
    }
  };

  const handleDeleteCategory = async (index: number) => {
    // Skip "All events" (index 0) as it's not a real category
    if (index === 0) return;
    
    const categoryIndex = index - 1; // Adjust for "All events"
    const category = categories[categoryIndex];
    if (category) {
      Alert.alert(
        'Delete Category',
        `Are you sure you want to delete "${category.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteCategory(category._id);
                if (activeCategory === category.name) {
                  setActiveCategory('All events');
                }
              } catch (error: any) {
                Alert.alert('Error', error.message || 'Failed to delete category');
              }
            }
          }
        ]
      );
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        await createCategory(newCategoryName.trim());
        setNewCategoryName('');
        setIsModalVisible(false);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to create category');
      }
    }
  };

  const handleUpdateCategory = async () => {
    if (editingCategory && newCategoryName.trim()) {
      try {
        await updateCategory(editingCategory.id, newCategoryName.trim());
        setNewCategoryName('');
        setEditingCategory(null);
        setIsModalVisible(false);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to update category');
      }
    }
  };

  return (
    <LinearGradient
      colors={["#5b1ab2", "#a73ada"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 5 }}
      style={styles.header}
    >
      <View style={styles.topRow}>
        <TouchableOpacity>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>{user ? `Hello, ${user.name}` : greeting}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#cfc5e6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search an event"
            placeholderTextColor="#cfc5e6"
            value={search}
            onChangeText={(t) => { setSearch(t); setSearchQuery(t); }}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialCommunityIcons name="tune-variant" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setNewCategoryName('');
            setEditingCategory(null);
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: -10, marginTop: 10 }}>
        <AdminCategoryTabs
          categories={dynamicCategories}
          activeCategory={activeCategory}
          onCategoryPress={setActiveCategory}
          onEditPress={handleEditCategory}
          onDeletePress={handleDeleteCategory}
        />
      </View>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingCategory !== null ? 'Edit Category' : 'Add New Category'}
            </Text>
            <TextInput
              style={styles.input}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              placeholder="Enter category name"
              placeholderTextColor="#999"
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewCategoryName('');
                  setEditingCategory(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, !newCategoryName.trim() && styles.disabledButton]}
                onPress={editingCategory !== null ? handleUpdateCategory : handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingCategory !== null ? 'Update' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 6,
    fontWeight: '600',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBarWrapper: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ffffff64',
    paddingLeft: 36,
    paddingRight: 12,
    height: 40,
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
  },
  searchBar: {
    color: '#fff',
    fontSize: 14,
  },
  filterButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#5b1ab2',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Header;