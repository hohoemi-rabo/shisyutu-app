import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMonthlyKey,
  getTodayString,
  getMonthlyData,
  saveExpense,
  updateExpense,
  deleteExpense,
} from '../../services/storage';
import { Category } from '../../types/expense';

// AsyncStorageのモックをリセット
beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('storage service', () => {
  describe('getMonthlyKey', () => {
    it('現在の年月からキーを生成する', () => {
      const date = new Date('2024-03-15');
      const key = getMonthlyKey(date);
      expect(key).toBe('expenses_2024_03');
    });

    it('引数なしで現在の年月のキーを生成する', () => {
      const key = getMonthlyKey();
      const now = new Date();
      const expected = `expenses_${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
      expect(key).toBe(expected);
    });
  });

  describe('getTodayString', () => {
    it('今日の日付をYYYY-MM-DD形式で返す', () => {
      const dateString = getTodayString();
      const regex = /^\d{4}-\d{2}-\d{2}$/;
      expect(dateString).toMatch(regex);
    });
  });

  describe('getMonthlyData', () => {
    it('データがない場合は空のMonthlyDataを返す', async () => {
      const data = await getMonthlyData();
      
      expect(data.records).toEqual([]);
      expect(data.totals.month).toBe(0);
      expect(data.totals.today).toBe(0);
      expect(data.totals.byCategory[Category.Food]).toBe(0);
    });

    it('保存されたデータを取得する', async () => {
      const testData = {
        records: [
          {
            id: 'test1',
            date: getTodayString(),
            amount: 1000,
            category: Category.Food,
            timestamp: Date.now(),
            synced: false,
          },
        ],
        totals: {
          month: 1000,
          today: 1000,
          byCategory: {
            [Category.Food]: 1000,
            [Category.Transport]: 0,
            [Category.Daily]: 0,
            [Category.Entertainment]: 0,
            [Category.Other]: 0,
          },
        },
      };
      
      const key = getMonthlyKey();
      await AsyncStorage.setItem(key, JSON.stringify(testData));
      
      const data = await getMonthlyData();
      expect(data.records).toHaveLength(1);
      expect(data.totals.month).toBe(1000);
    });
  });

  describe('saveExpense', () => {
    it('新しい支出を保存する', async () => {
      const expense = {
        date: getTodayString(),
        amount: 500,
        category: Category.Food,
        synced: false,
      };
      
      const saved = await saveExpense(expense);
      
      expect(saved.id).toBeDefined();
      expect(saved.amount).toBe(500);
      expect(saved.category).toBe(Category.Food);
      expect(saved.timestamp).toBeDefined();
      
      const data = await getMonthlyData();
      expect(data.records).toHaveLength(1);
      expect(data.totals.month).toBe(500);
      expect(data.totals.byCategory[Category.Food]).toBe(500);
    });

    it('複数の支出を正しく集計する', async () => {
      await saveExpense({
        date: getTodayString(),
        amount: 1000,
        category: Category.Food,
        synced: false,
      });
      
      await saveExpense({
        date: getTodayString(),
        amount: 500,
        category: Category.Transport,
        synced: false,
      });
      
      const data = await getMonthlyData();
      expect(data.records).toHaveLength(2);
      expect(data.totals.month).toBe(1500);
      expect(data.totals.byCategory[Category.Food]).toBe(1000);
      expect(data.totals.byCategory[Category.Transport]).toBe(500);
    });
  });

  describe('updateExpense', () => {
    it('既存の支出を更新する', async () => {
      const saved = await saveExpense({
        date: getTodayString(),
        amount: 1000,
        category: Category.Food,
        synced: false,
      });
      
      await updateExpense(saved.id, {
        amount: 1500,
        category: Category.Transport,
      });
      
      const data = await getMonthlyData();
      const updated = data.records.find(r => r.id === saved.id);
      
      expect(updated?.amount).toBe(1500);
      expect(updated?.category).toBe(Category.Transport);
      expect(data.totals.month).toBe(1500);
      expect(data.totals.byCategory[Category.Food]).toBe(0);
      expect(data.totals.byCategory[Category.Transport]).toBe(1500);
    });

    it('存在しないIDの場合はエラーを投げる', async () => {
      await expect(
        updateExpense('non-existent', { amount: 1000 })
      ).rejects.toThrow('Expense not found');
    });
  });

  describe('deleteExpense', () => {
    it('支出を削除する', async () => {
      const saved = await saveExpense({
        date: getTodayString(),
        amount: 1000,
        category: Category.Food,
        synced: false,
      });
      
      await deleteExpense(saved.id);
      
      const data = await getMonthlyData();
      expect(data.records).toHaveLength(0);
      expect(data.totals.month).toBe(0);
      expect(data.totals.byCategory[Category.Food]).toBe(0);
    });

    it('存在しないIDの場合はエラーを投げる', async () => {
      await expect(
        deleteExpense('non-existent')
      ).rejects.toThrow('Expense not found');
    });
  });
});