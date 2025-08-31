import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AdminCategoryTabs from './AdminCategoryTabs';

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
  const [categories, setCategories] = useState(['All events', 'Concerts', 'Theater', 'Sports', 'Festival']);
  const [activeCategory, setActiveCategory] = useState('All events');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleEditCategory = (index: number) => {
    setNewCategoryName(categories[index]);
    setEditingIndex(index);
    setIsModalVisible(true);
  };

  const handleDeleteCategory = (index: number) => {
    if (categories.length > 1) {
      const newCategories = [...categories];
      newCategories.splice(index, 1);
      setCategories(newCategories);
      if (activeCategory === categories[index]) {
        setActiveCategory(newCategories[0] || '');
      }
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
      setIsModalVisible(false);
    }
  };

  const handleUpdateCategory = () => {
    if (editingIndex !== null && newCategoryName.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[editingIndex] = newCategoryName.trim();
      setCategories(updatedCategories);
      setNewCategoryName('');
      setEditingIndex(null);
      setIsModalVisible(false);
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
            <Text style={styles.locationText}>{greeting}</Text>
          </View>
        </TouchableOpacity>
        <Ionicons name="notifications-outline" size={22} color="#fff" />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBarWrapper}>
          <Ionicons name="search" size={18} color="#cfc5e6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder="Search an event"
            placeholderTextColor="#cfc5e6"
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
            setEditingIndex(null);
            setIsModalVisible(true);
          }}
        >
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Category</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginLeft: -10, marginTop: 10 }}>
        <AdminCategoryTabs
          categories={categories}
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
              {editingIndex !== null ? 'Edit Category' : 'Add New Category'}
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
                  setEditingIndex(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, !newCategoryName.trim() && styles.disabledButton]}
                onPress={editingIndex !== null ? handleUpdateCategory : handleAddCategory}
                disabled={!newCategoryName.trim()}
              >
                <Text style={styles.saveButtonText}>
                  {editingIndex !== null ? 'Update' : 'Add'}
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