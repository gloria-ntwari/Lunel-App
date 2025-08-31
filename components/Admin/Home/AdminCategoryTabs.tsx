import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CategoryActionsModal from './CategoryActionsModal';

const { width } = Dimensions.get('window');

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryPress: (category: string) => void;
  onEditPress?: (index: number) => void;
  onDeletePress?: (index: number) => void;
}

const CategoryTabs = ({
  categories,
  activeCategory,
  onCategoryPress,
  onEditPress,
  onDeletePress,
}: CategoryTabsProps) => {
  const [showActionsModal, setShowActionsModal] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const isAdmin = onEditPress !== undefined;

  const handlePress = (label: string, index: number) => {
    if (isAdmin) {
      // Show actions modal for admin
      setSelectedCategoryIndex(index);
      setShowActionsModal(true);
    } else {
      // Regular category selection for non-admin
      onCategoryPress(label);
    }
  };

  const handleEdit = () => {
    if (selectedCategoryIndex !== null) {
      onEditPress?.(selectedCategoryIndex);
    }
  };

  const handleDelete = () => {
    if (selectedCategoryIndex !== null) {
      onDeletePress?.(selectedCategoryIndex);
    }
  };

  const closeActionsModal = () => {
    setShowActionsModal(false);
    setSelectedCategoryIndex(null);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      >
        {categories.map((label, index) => {
          const isActive = activeCategory === label;
          return (
            <View key={`${label}-${index}`} style={styles.chipContainer}>
              <TouchableOpacity
                onPress={() => handlePress(label, index)}
                activeOpacity={0.8}
                style={[
                  styles.chip,
                  isActive ? styles.chipActive : styles.chipInactive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    isActive ? styles.chipTextActive : {},
                    { maxWidth: width * 0.3 }
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {label}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Category Actions Modal */}
      <CategoryActionsModal
        visible={showActionsModal}
        onClose={closeActionsModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        categoryName={selectedCategoryIndex !== null ? categories[selectedCategoryIndex] : ''}
        canDelete={categories.length > 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingVertical: 8,
    minHeight: 50,
  },
  tabsContainer: {
    paddingHorizontal: 8,
    paddingRight: 20,
    paddingBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    position: 'relative',
  },
  chip: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 20,
    justifyContent: 'center',
    minWidth: 100,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: '#f96c3d',
    borderColor: 'transparent',
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  chipTextActive: {
    color: '#1b0b33',
    fontWeight: '700',
  },
});

export default CategoryTabs;