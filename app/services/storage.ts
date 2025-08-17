import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, MonthlyData, Totals, Category } from '../types/expense';

// 月別データのキーを生成
export const getMonthlyKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `expenses_${year}_${month}`;
};

// 今日の日付をYYYY-MM-DD形式で取得
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 空の月別データを作成
const createEmptyMonthlyData = (): MonthlyData => ({
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
    }
  }
});

// 月別データを取得
export const getMonthlyData = async (date: Date = new Date()): Promise<MonthlyData> => {
  try {
    const key = getMonthlyKey(date);
    const data = await AsyncStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return createEmptyMonthlyData();
  } catch (error) {
    console.error('Error getting monthly data:', error);
    return createEmptyMonthlyData();
  }
};

// 合計を再計算
const recalculateTotals = (records: Expense[]): Totals => {
  const today = getTodayString();
  const totals: Totals = {
    month: 0,
    today: 0,
    byCategory: {
      [Category.Food]: 0,
      [Category.Transport]: 0,
      [Category.Daily]: 0,
      [Category.Entertainment]: 0,
      [Category.Other]: 0,
    }
  };

  records.forEach(expense => {
    totals.month += expense.amount;
    if (expense.date === today) {
      totals.today += expense.amount;
    }
    totals.byCategory[expense.category] += expense.amount;
  });

  return totals;
};

// 支出を保存
export const saveExpense = async (expense: Omit<Expense, 'id' | 'timestamp'>): Promise<Expense> => {
  try {
    const monthlyData = await getMonthlyData();
    
    const newExpense: Expense = {
      ...expense,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      synced: false
    };

    monthlyData.records.push(newExpense);
    monthlyData.totals = recalculateTotals(monthlyData.records);

    const key = getMonthlyKey();
    await AsyncStorage.setItem(key, JSON.stringify(monthlyData));

    return newExpense;
  } catch (error) {
    console.error('Error saving expense:', error);
    throw error;
  }
};

// 支出を更新
export const updateExpense = async (id: string, updates: Partial<Expense>): Promise<void> => {
  try {
    const monthlyData = await getMonthlyData();
    const index = monthlyData.records.findIndex(e => e.id === id);
    
    if (index !== -1) {
      monthlyData.records[index] = { ...monthlyData.records[index], ...updates };
      monthlyData.totals = recalculateTotals(monthlyData.records);
      
      const key = getMonthlyKey();
      await AsyncStorage.setItem(key, JSON.stringify(monthlyData));
    }
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// 支出を削除
export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const monthlyData = await getMonthlyData();
    monthlyData.records = monthlyData.records.filter(e => e.id !== id);
    monthlyData.totals = recalculateTotals(monthlyData.records);
    
    const key = getMonthlyKey();
    await AsyncStorage.setItem(key, JSON.stringify(monthlyData));
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// 今日の支出を取得
export const getTodayExpenses = async (): Promise<Expense[]> => {
  const monthlyData = await getMonthlyData();
  const today = getTodayString();
  return monthlyData.records.filter(e => e.date === today);
};

// 古いデータを削除（月が変わった時）
export const cleanupOldData = async (): Promise<void> => {
  try {
    const currentKey = getMonthlyKey();
    const allKeys = await AsyncStorage.getAllKeys();
    const expenseKeys = allKeys.filter(key => key.startsWith('expenses_') && key !== currentKey);
    
    if (expenseKeys.length > 0) {
      await AsyncStorage.multiRemove(expenseKeys);
      console.log(`Deleted ${expenseKeys.length} old month(s) data`);
    }
  } catch (error) {
    console.error('Error cleaning up old data:', error);
  }
};