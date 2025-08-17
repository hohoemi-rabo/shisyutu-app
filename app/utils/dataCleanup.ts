import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_CLEANUP_KEY = 'lastCleanupDate';

export interface CleanupResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

/**
 * 前回のクリーンアップ日を取得
 */
const getLastCleanupDate = async (): Promise<Date | null> => {
  try {
    const dateStr = await AsyncStorage.getItem(LAST_CLEANUP_KEY);
    return dateStr ? new Date(dateStr) : null;
  } catch (error) {
    console.error('Failed to get last cleanup date:', error);
    return null;
  }
};

/**
 * クリーンアップ日を保存
 */
const saveLastCleanupDate = async (date: Date): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_CLEANUP_KEY, date.toISOString());
  } catch (error) {
    console.error('Failed to save cleanup date:', error);
  }
};

/**
 * 月が変わったかチェック
 */
export const hasMonthChanged = async (): Promise<boolean> => {
  const lastCleanup = await getLastCleanupDate();
  if (!lastCleanup) {
    // 初回起動時はクリーンアップしない
    await saveLastCleanupDate(new Date());
    return false;
  }

  const now = new Date();
  const lastMonth = lastCleanup.getMonth();
  const lastYear = lastCleanup.getFullYear();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return lastYear !== currentYear || lastMonth !== currentMonth;
};


/**
 * 前月以前のデータを削除
 */
export const cleanupOldData = async (): Promise<CleanupResult> => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth()は0-11なので+1
    
    // 現在の月のキー
    const currentMonthKey = `expenses_${currentYear}_${String(currentMonth).padStart(2, '0')}`;
    
    // 全てのキーを取得
    const keys = await AsyncStorage.getAllKeys();
    const expenseKeys = keys.filter(key => key.startsWith('expenses_') && key !== currentMonthKey);
    
    const deletedCount = expenseKeys.length;
    
    if (deletedCount > 0) {
      // 古い月のデータを削除
      await AsyncStorage.multiRemove(expenseKeys);
      console.log(`Cleaned up ${deletedCount} old month(s) of data`);
    }
    
    // クリーンアップ日を更新
    await saveLastCleanupDate(now);
    
    return {
      success: true,
      deletedCount
    };
  } catch (error) {
    console.error('Data cleanup failed:', error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * 自動クリーンアップを実行（アプリ起動時に呼び出す）
 */
export const performAutoCleanup = async (): Promise<CleanupResult | null> => {
  const monthChanged = await hasMonthChanged();
  
  if (monthChanged) {
    console.log('Month changed, performing auto cleanup...');
    return await cleanupOldData();
  }
  
  return null;
};

/**
 * デバッグ用: 手動でクリーンアップを実行
 */
export const forceCleanup = async (): Promise<CleanupResult> => {
  console.log('Force cleanup initiated...');
  return await cleanupOldData();
};

/**
 * デバッグ用: クリーンアップ履歴をリセット
 */
export const resetCleanupHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(LAST_CLEANUP_KEY);
    console.log('Cleanup history reset');
  } catch (error) {
    console.error('Failed to reset cleanup history:', error);
  }
};