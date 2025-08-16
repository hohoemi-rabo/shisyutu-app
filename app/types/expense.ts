// 支出カテゴリの列挙型
export enum Category {
  Food = 'food',
  Transport = 'transport',
  Daily = 'daily',
  Entertainment = 'entertainment',
  Other = 'other'
}

// カテゴリ情報
export const CategoryInfo = {
  [Category.Food]: { label: '食費', icon: '🍽️', color: '#FF6B6B' },
  [Category.Transport]: { label: '交通費', icon: '🚃', color: '#4ECDC4' },
  [Category.Daily]: { label: '日用品', icon: '🧺', color: '#45B7D1' },
  [Category.Entertainment]: { label: '娯楽', icon: '🎮', color: '#F7B801' },
  [Category.Other]: { label: 'その他', icon: '📦', color: '#95A99C' }
};

// 支出データの型定義
export interface Expense {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: Category;
  timestamp: number;
  synced: boolean;
}

// カテゴリ別合計の型定義
export interface CategoryTotals {
  [Category.Food]: number;
  [Category.Transport]: number;
  [Category.Daily]: number;
  [Category.Entertainment]: number;
  [Category.Other]: number;
}

// 合計データの型定義
export interface Totals {
  month: number;
  today: number;
  byCategory: CategoryTotals;
}

// 月別データの型定義
export interface MonthlyData {
  records: Expense[];
  totals: Totals;
}