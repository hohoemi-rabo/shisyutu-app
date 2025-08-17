import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CategoryDropdown } from '../components/CategoryDropdown';
import { AmountInput } from '../components/AmountInput';
import { ExpenseListItem } from '../components/ExpenseListItem';
import { TotalCard } from '../components/TotalCard';
import { EditExpenseModal } from '../components/EditExpenseModal';
import { CategorySummary } from '../components/CategorySummary';
import { MonthlyStats } from '../components/MonthlyStats';
import { Category, Expense } from '../types/expense';
import {
  saveExpense,
  deleteExpense,
  updateExpense,
  getTodayString,
  cleanupOldData,
} from '../services/storage';
import { validateAmount } from '../utils/validation';
import { useData } from '../contexts/DataContext';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Food);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const { monthlyData, todayExpenses, refreshData } = useData();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');

  // 初回読み込みと古いデータのクリーンアップ
  useEffect(() => {
    refreshData();
    cleanupOldData();
  }, [refreshData]);

  // 画面がフォーカスされた時にデータを更新
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [refreshData])
  );

  // プルダウン更新
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  // 支出を保存 - useCallbackでメモ化
  const handleSaveExpense = useCallback(async () => {
    // バリデーション
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error || '入力エラー');
      return;
    }

    const numAmount = parseInt(amount, 10);

    try {
      await saveExpense({
        date: getTodayString(),
        amount: numAmount,
        category: selectedCategory,
        synced: false, // オフラインで作成されたデータ
      });

      // 入力をクリア
      setAmount('');
      setError('');

      // データを再読み込み
      await refreshData();
      
      // 成功時の触覚フィードバック（iOS）
      if (Platform.OS === 'ios') {
        const { default: Haptics } = await import('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error saving expense:', error);
      setError('保存に失敗しました。もう一度お試しください。');
      
      // エラー時の触覚フィードバック（iOS）
      if (Platform.OS === 'ios') {
        const { default: Haptics } = await import('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }, [amount, selectedCategory, refreshData]);

  // 支出を削除 - useCallbackでメモ化
  const handleDeleteExpense = useCallback((id: string) => {
    Alert.alert(
      '削除確認',
      'この支出を削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(id);
              await refreshData();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ]
    );
  }, [refreshData]);

  // 編集モーダルを開く - useCallbackでメモ化
  const handleEditExpense = useCallback((expense: Expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  }, []);

  // 編集を保存 - useCallbackでメモ化
  const handleSaveEdit = useCallback(async (id: string, category: Category, amount: number) => {
    try {
      await updateExpense(id, { category, amount });
      setShowEditModal(false);
      setEditingExpense(null);
      await refreshData();
    } catch (error) {
      console.error('Error updating expense:', error);
      Alert.alert('エラー', '更新に失敗しました');
    }
  }, [refreshData]);

  // 編集をキャンセル - useCallbackでメモ化
  const handleCancelEdit = useCallback(() => {
    setShowEditModal(false);
    setEditingExpense(null);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* ヘッダー */}
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: textColor }]}>
              支出管理
            </Text>
            <Text style={[styles.headerSubtitle, { color: subTextColor }]}>
              {new Date().toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'short',
              })}
            </Text>
          </View>

          {/* 入力エリア */}
          <View style={styles.inputSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              支出を記録
            </Text>
            <CategoryDropdown
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <AmountInput
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                setError('');
              }}
              onSubmit={handleSaveExpense}
              error={error}
              placeholder="金額を入力"
            />
          </View>

          {/* 集計エリア */}
          <View style={styles.summarySection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                集計
              </Text>
              <TouchableOpacity onPress={() => setShowStats(!showStats)}>
                <Text style={[styles.toggleButton, { color: '#007AFF' }]}>
                  {showStats ? '簡易表示' : '詳細表示'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.summaryCards}>
              <View style={styles.summaryCard}>
                <TotalCard
                  title="今月の合計"
                  amount={monthlyData.totals.month}
                  subtitle={`${monthlyData.records.length}件`}
                  color="#007AFF"
                />
              </View>
              <View style={styles.summaryCard}>
                <TotalCard
                  title="今日の合計"
                  amount={monthlyData.totals.today}
                  subtitle={`${todayExpenses.length}件`}
                  color="#34C759"
                />
              </View>
            </View>

            {/* 詳細統計 */}
            {showStats && (
              <>
                <MonthlyStats 
                  expenses={monthlyData.records}
                  monthTotal={monthlyData.totals.month}
                />
                <Text style={[styles.subSectionTitle, { color: textColor }]}>
                  カテゴリ別
                </Text>
                <CategorySummary 
                  totals={monthlyData.totals.byCategory}
                  monthTotal={monthlyData.totals.month}
                />
              </>
            )}
          </View>

          {/* 今日の支出リスト */}
          <View style={styles.listSection}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              今日の支出
            </Text>
            {todayExpenses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateIcon]}>📝</Text>
                <Text style={[styles.emptyStateText, { color: textColor }]}>
                  まだ支出が記録されていません
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: subTextColor }]}>
                  上から支出を記録してみましょう
                </Text>
              </View>
            ) : (
              <View>
                {todayExpenses.map((expense) => (
                  <ExpenseListItem
                    key={expense.id}
                    expense={expense}
                    onEdit={handleEditExpense}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* 編集モーダル */}
        <EditExpenseModal
          visible={showEditModal}
          expense={editingExpense}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  inputSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  listSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
  },
});