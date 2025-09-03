import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useCategories, Category } from '../../../contexts/CategoryContext';
import CategoryModal from './CategoryModal';
import CategoryActionsModal from './CategoryActionsModal';

const CategoryManager: React.FC = () => {
  const {
    categories,
    isLoading,
    error,
    fetchAdminCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    initializeCategories
  } = useCategories();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminCategories();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdminCategories();
    setRefreshing(false);
  };

  const handleAddCategory = async (name: string) => {
    try {
      await createCategory(name);
      setShowAddModal(false);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleEditCategory = async (name: string) => {
    if (!selectedCategory) return;
    
    try {
      await updateCategory(selectedCategory._id, name);
      setShowEditModal(false);
      setSelectedCategory(null);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;

    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${selectedCategory.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCategory(selectedCategory._id);
              setShowActionsModal(false);
              setSelectedCategory(null);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setShowActionsModal(true);
  };

  const handleEditPress = () => {
    setShowActionsModal(false);
    setShowEditModal(true);
  };

  const handleInitializeCategories = () => {
    Alert.alert(
      'Initialize Default Categories',
      'This will create the default categories (Concert, Theater, Sports, Festival). Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Initialize',
          onPress: async () => {
            try {
              await initializeCategories();
              Alert.alert('Success', 'Default categories initialized successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          }
        }
      ]
    );
  };

  const defaultCategories = categories.filter(cat => cat.isDefault);
  const customCategories = categories.filter(cat => !cat.isDefault);

  if (isLoading && categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5b1ab2" />
        <Text style={styles.loadingText}>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Category Management</Text>
        <View style={styles.headerActions}>
          {categories.length === 0 && (
            <TouchableOpacity
              style={styles.initButton}
              onPress={handleInitializeCategories}
            >
              <MaterialIcons name="add-circle" size={20} color="#fff" />
              <Text style={styles.initButtonText}>Initialize</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error" size={20} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Default Categories */}
        {defaultCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Default Categories</Text>
            {defaultCategories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[styles.categoryCard, styles.defaultCategoryCard]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <View style={styles.defaultBadge}>
                    <MaterialIcons name="star" size={16} color="#f39c12" />
                    <Text style={styles.defaultBadgeText}>Default</Text>
                  </View>
                </View>
                <MaterialIcons name="more-vert" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom Categories</Text>
            {customCategories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={[styles.categoryCard, styles.customCategoryCard]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.createdBy}>
                    Created by: {category.createdBy?.name || 'Unknown'}
                  </Text>
                </View>
                <MaterialIcons name="more-vert" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {categories.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="category" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Categories</Text>
            <Text style={styles.emptyStateText}>
              Initialize default categories or create your first custom category
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Category Modal */}
      <CategoryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddCategory}
        isEditing={false}
      />

      {/* Edit Category Modal */}
      <CategoryModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleEditCategory}
        initialValue={selectedCategory?.name || ''}
        isEditing={true}
      />

      {/* Category Actions Modal */}
      <CategoryActionsModal
        visible={showActionsModal}
        onClose={() => {
          setShowActionsModal(false);
          setSelectedCategory(null);
        }}
        onEdit={handleEditPress}
        onDelete={handleDeleteCategory}
        categoryName={selectedCategory?.name || ''}
        canDelete={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  initButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  initButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5b1ab2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    gap: 8,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  defaultCategoryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  customCategoryCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#5b1ab2',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  defaultBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  defaultBadgeText: {
    fontSize: 12,
    color: '#f39c12',
    fontWeight: '500',
  },
  createdBy: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default CategoryManager;
