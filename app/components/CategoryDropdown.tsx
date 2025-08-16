import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Category, CategoryInfo } from '../types/expense';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CategoryDropdownProps {
  selectedCategory: Category;
  onSelectCategory: (category: Category) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'text');

  const categories = Object.values(Category);
  const selectedInfo = CategoryInfo[selectedCategory];

  return (
    <View>
      <TouchableOpacity
        style={[styles.dropdownButton, { backgroundColor, borderColor }]}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownButtonText, { color: textColor }]}>
          {selectedInfo.icon} {selectedInfo.label}
        </Text>
        <Text style={[styles.arrow, { color: textColor }]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor }]}>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => {
                const info = CategoryInfo[item];
                return (
                  <TouchableOpacity
                    style={[
                      styles.categoryItem,
                      item === selectedCategory && styles.selectedItem,
                      { borderBottomColor: borderColor }
                    ]}
                    onPress={() => {
                      onSelectCategory(item);
                      setIsOpen(false);
                    }}
                  >
                    <Text style={[styles.categoryItemText, { color: textColor }]}>
                      {info.icon} {info.label}
                    </Text>
                    {item === selectedCategory && (
                      <Text style={[styles.checkmark, { color: info.color }]}>✓</Text>
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
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: 300,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  categoryItemText: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});