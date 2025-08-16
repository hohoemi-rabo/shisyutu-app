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
import { Category, Expense, MonthlyData } from '../types/expense';
import {
  saveExpense,
  getMonthlyData,
  deleteExpense,
  updateExpense,
  getTodayString,
  cleanupOldData,
} from '../services/storage';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.Food);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [monthlyData, setMonthlyData] = useState<MonthlyData>({
    records: [],
    totals: {
      month: 0,
      today: 0,
      byCategory: {
        [Category.Food]: 0,
        [Category.Transport]: 0,
        [Category.Daily]: 0,
        [Category.Entertainment]: 0,
        [Category.Other]: 0,
      },
    },
  });
  const [todayExpenses, setTodayExpenses] = useState<Expense[]>([]);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subTextColor = useThemeColor({ light: '#666', dark: '#999' }, 'text');

  // データの読み込み
  const loadData = useCallback(async () => {
    try {
      const data = await getMonthlyData();
      setMonthlyData(data);
      
      const today = getTodayString();
      const todayRecords = data.records.filter((e) => e.date === today);
      // 古い順（時刻昇順）にソート
      todayRecords.sort((a, b) => a.timestamp - b.timestamp);
      setTodayExpenses(todayRecords);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }, []);

  // 初回読み込みと古いデータのクリーンアップ
  useEffect(() => {
    loadData();
    cleanupOldData();
  }, [loadData]);

  // プルダウン更新
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // 支出を保存
  const handleSaveExpense = async () => {
    // バリデーション
    if (!amount) {
      setError('金額を入力してください');
      return;
    }

    const numAmount = parseInt(amount, 10);
    if (numAmount > 1000000) {
      setError('100万円以下で入力してください');
      return;
    }

    if (numAmount === 0) {
      setError('0円より大きい金額を入力してください');
      return;
    }

    try {
      await saveExpense({
        date: getTodayString(),
        amount: numAmount,
        category: selectedCategory,
      });

      // 入力をクリア
      setAmount('');
      setError('');

      // データを再読み込み
      await loadData();
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert('エラー', '保存に失敗しました');
    }
  };

  // 支出を削除
  const handleDeleteExpense = (id: string) => {
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
              await loadData();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('エラー', '削除に失敗しました');
            }
          },
        },
      ]
    );
  };

  // 編集モーダルを開く
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  // 編集を保存
  const handleSaveEdit = async (id: string, category: Category, amount: number) => {
    try {
      await updateExpense(id, { category, amount });
      setShowEditModal(false);
      setEditingExpense(null);
      await loadData();
    } catch (error) {
      console.error('Error updating expense:', error);
      Alert.alert('エラー', '更新に失敗しました');
    }
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingExpense(null);
  };

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