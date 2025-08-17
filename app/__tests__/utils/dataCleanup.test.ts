import AsyncStorage from '@react-native-async-storage/async-storage';
import { hasMonthChanged, cleanupOldData, performAutoCleanup } from '../../utils/dataCleanup';

// AsyncStorageのモックをリセット
beforeEach(() => {
  AsyncStorage.clear();
  jest.clearAllMocks();
});

describe('dataCleanup', () => {
  describe('hasMonthChanged', () => {
    it('初回起動時はfalseを返す', async () => {
      const result = await hasMonthChanged();
      expect(result).toBe(false);
    });

    it('同じ月の場合はfalseを返す', async () => {
      const now = new Date();
      await AsyncStorage.setItem('lastCleanupDate', now.toISOString());
      
      const result = await hasMonthChanged();
      expect(result).toBe(false);
    });

    it('月が変わった場合はtrueを返す', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      await AsyncStorage.setItem('lastCleanupDate', lastMonth.toISOString());
      
      const result = await hasMonthChanged();
      expect(result).toBe(true);
    });

    it('年が変わった場合はtrueを返す', async () => {
      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);
      await AsyncStorage.setItem('lastCleanupDate', lastYear.toISOString());
      
      const result = await hasMonthChanged();
      expect(result).toBe(true);
    });
  });

  describe('cleanupOldData', () => {
    it('古いデータを削除し、当月データのみを残す', async () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
      const lastMonth = new Date(now);
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthKey = `expenses_${lastMonth.getFullYear()}_${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;
      
      // テストデータをセット
      await AsyncStorage.setItem(`expenses_${currentMonth}`, JSON.stringify({ records: [] }));
      await AsyncStorage.setItem(lastMonthKey, JSON.stringify({ records: [] }));
      
      const result = await cleanupOldData();
      
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(1);
      
      const keys = await AsyncStorage.getAllKeys();
      expect(keys).toContain(`expenses_${currentMonth}`);
      expect(keys).not.toContain(lastMonthKey);
    });

    it('削除するデータがない場合は0件を返す', async () => {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}_${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      // 当月のデータのみセット
      await AsyncStorage.setItem(`expenses_${currentMonth}`, JSON.stringify({ records: [] }));
      
      const result = await cleanupOldData();
      
      expect(result.success).toBe(true);
      expect(result.deletedCount).toBe(0);
    });

    it('エラーが発生した場合はエラー情報を返す', async () => {
      // AsyncStorage.getAllKeysをエラーを投げるようにモック
      jest.spyOn(AsyncStorage, 'getAllKeys').mockRejectedValueOnce(new Error('Storage error'));
      
      const result = await cleanupOldData();
      
      expect(result.success).toBe(false);
      expect(result.deletedCount).toBe(0);
      expect(result.error).toBe('Storage error');
    });
  });

  describe('performAutoCleanup', () => {
    it('月が変わっていない場合はnullを返す', async () => {
      const now = new Date();
      await AsyncStorage.setItem('lastCleanupDate', now.toISOString());
      
      const result = await performAutoCleanup();
      
      expect(result).toBeNull();
    });

    it('月が変わった場合はクリーンアップを実行', async () => {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      await AsyncStorage.setItem('lastCleanupDate', lastMonth.toISOString());
      
      const result = await performAutoCleanup();
      
      expect(result).not.toBeNull();
      expect(result?.success).toBe(true);
    });
  });
});