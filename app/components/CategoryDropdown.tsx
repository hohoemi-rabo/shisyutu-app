import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Category, CategoryInfo } from '../types/expense';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getCategoryColor } from '../utils/theme';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface CategoryDropdownProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const colorScheme = useColorScheme();
  const cardBackground = useThemeColor(
    { light: Colors.light.card, dark: Colors.dark.card },
    'background'
  );
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor(
    { light: Colors.light.border, dark: Colors.dark.border },
    'text'
  );
  const modalOverlay = useThemeColor(
    { light: Colors.light.modalOverlay, dark: Colors.dark.modalOverlay },
    'text'
  );

  const categories = Object.values(Category);
  const selectedInfo = CategoryInfo[selectedCategory];
  const selectedColor = getCategoryColor(selectedCategory, colorScheme);

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdownButton, { backgroundColor: cardBackground, borderColor }]}
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.dropdownContent}>
          <View style={[styles.categoryDot, { backgroundColor: selectedColor }]} />
          <Text style={[styles.dropdownButtonText, { color: textColor }]}>
            {selectedInfo.icon} {selectedInfo.label}
          </Text>
        </View>
        <Text style={[styles.arrow, { color: textColor, opacity: 0.5 }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: modalOverlay }]}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: cardBackground }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>カテゴリを選択</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const info = CategoryInfo[item];
                const categoryColor = getCategoryColor(item, colorScheme);
                const isSelected = item === selectedCategory;
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      isSelected && styles.selectedItem,
                      isSelected && { backgroundColor: `${categoryColor}15` },
                      { borderBottomColor: borderColor }
                    ]}
                    onPress={() => {
                      onSelectCategory(item);
                      setIsOpen(false);
                    }}
                  >
                    <View style={styles.categoryItemContent}>
                      <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
                      <Text style={[styles.categoryItemText, { color: textColor }]}>
                        {info.icon} {info.label}
                      </Text>
                    </View>
                    {isSelected && (
                      <Text style={[styles.checkmark, { color: categoryColor }]}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 8,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: 400,
    borderRadius: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 12,
    opacity: 0.6,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  selectedItem: {},
  categoryItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItemText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});