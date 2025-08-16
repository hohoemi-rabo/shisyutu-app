import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Category, Expense } from '../types/expense';
import { CategoryDropdown } from './CategoryDropdown';
import { AmountInput } from './AmountInput';

interface EditExpenseModalProps {
  visible: boolean;
  expense: Expense | null;
  onSave: (id: string, category: Category, amount: number) => void;
  onCancel: () => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({
  visible,
  expense,
  onSave,
  onCancel,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Food);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'text');

  useEffect(() => {
    if (expense) {
      setSelectedCategory(expense.category);
      setAmount(expense.amount.toString());
      setError('');
    }
  }, [expense]);

  const handleSave = () => {
    if (!amount) {
      setError('金額を入力してください');
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (numAmount > 1000000) {
      setError('100万円以下で入力してください');
      return;
    }

    if (expense) {
      onSave(expense.id, selectedCategory, numAmount);
    }
  };

  if (!expense) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={[styles.modalContent, { backgroundColor }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]}>支出を編集</Text>
            <TouchableOpacity onPress={onCancel}>
              <Text style={[styles.closeButton, { color: '#007AFF' }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: borderColor }]} />

          <View style={styles.form}>
            <View style={styles.formItem}>
              <Text style={[styles.label, { color: textColor }]}>カテゴリ</Text>
              <CategoryDropdown
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </View>

            <View style={styles.formItem}>
              <Text style={[styles.label, { color: textColor }]}>金額</Text>
              <AmountInput
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  setError('');
                }}
                onSubmit={handleSave}
                error={error}
              />
            </View>

            <View style={styles.dateInfo}>
              <Text style={[styles.dateText, { color: textColor, opacity: 0.6 }]}>
                記録日時: {new Date(expense.timestamp).toLocaleString('ja-JP')}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor }]}
              onPress={onCancel}
            >
              <Text style={[styles.buttonText, { color: textColor }]}>キャンセル</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>保存</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  formItem: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  dateInfo: {
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});