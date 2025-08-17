import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Expense, CategoryInfo } from '../types/expense';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ExpenseListItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export const ExpenseListItem: React.FC<ExpenseListItemProps> = memo(({
  expense,
  onEdit,
  onDelete,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');
  const borderColor = useThemeColor({ light: '#F0F0F0', dark: '#333' }, 'text');

  const categoryInfo = CategoryInfo[expense.category];
  const time = new Date(expense.timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedAmount = expense.amount.toLocaleString('ja-JP');

  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor: borderColor }]}>
      <View style={styles.leftContent}>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryIcon}>{categoryInfo.icon}</Text>
          <View>
            <Text style={[styles.categoryLabel, { color: textColor }]}>
              {categoryInfo.label}
            </Text>
            <Text style={[styles.time, { color: subTextColor }]}>{time}</Text>
          </View>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={[styles.amount, { color: textColor }]}>¥{formattedAmount}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(expense)}
          >
            <Text style={styles.actionButtonText}>編集</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(expense.id)}
          >
            <Text style={[styles.actionButtonText, { color: '#FF6B6B' }]}>削除</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}, (prevProps, nextProps) => {
  // カスタム比較関数: expenseオブジェクトの内容が同じなら再レンダリングしない
  return (
    prevProps.expense.id === nextProps.expense.id &&
    prevProps.expense.amount === nextProps.expense.amount &&
    prevProps.expense.category === nextProps.expense.category &&
    prevProps.expense.date === nextProps.expense.date
  );
});

ExpenseListItem.displayName = 'ExpenseListItem';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  leftContent: {
    flex: 1,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  time: {
    fontSize: 12,
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginLeft: 8,
  },
  editButton: {},
  deleteButton: {},
  actionButtonText: {
    fontSize: 12,
    color: '#007AFF',
  },
});